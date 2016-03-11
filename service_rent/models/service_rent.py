from openerp import models, fields, api, _
import logging
_logger = logging.getLogger(__name__) # Need for message in console. _logger.debug("ID Line: %s",line.id )

import openerp.addons.decimal_precision as dp

from lxml import etree
from openerp.osv.orm import setup_modifiers
from itertools import chain
import json

import datetime
from dateutil import tz
import pytz
import time
from pdb import set_trace as bp
from openerp.exceptions import ValidationError
from dateutil.relativedelta import relativedelta

class ServiceRentCalc(models.Model):

    _name = 'service.rent.calc'
    _inherit = ['mail.thread']

    READONLY_STATES = {
        'draft': [('readonly', False)],
        'check': [('readonly', False)],

    }
    READONLY_STATES_2 = {
        'draft': [('readonly', False)],

    }

    READONLY_STATES_3 = {
        'check': [('readonly', False)],

    }

    name = fields.Char(string='Name', required=True, readonly=True, default="New")
    product_id = fields.Many2one('product.product','Service',
                                    required=True,
                                    readonly=True,
                                    states=READONLY_STATES_2,
                                    domain=[('type','=','service')])

    service_price = fields.Float('Service Sale Price',
                                        related='product_id.lst_price',
                                        store=True, required=True,
                                        readonly=True,
                                        states=READONLY_STATES_2,
                                        digits_compute=dp.get_precision('Product Unit of Measure'))

    service_start_date = fields.Date(string='Service Start Date',  readonly=True, states=READONLY_STATES_3,  )
    service_end_date = fields.Date(string='Service End Date' , readonly=True, states=READONLY_STATES_3, )
    number_of_days = fields.Integer(string='Number of Days', readonly=True,states=READONLY_STATES_3)



    partner_id = fields.Many2one('res.partner', string='Customer',required=True, readonly=True, states=READONLY_STATES_2 )

    rent_calc_lines = fields.One2many('service.rent.calc.line', 'rent_id', string='Rent Lines', readonly=True, states=READONLY_STATES_2)

    amount_total = fields.Float('Service Amount Total',
                                        compute='_amount_all',
                                        store=True,
                                        readonly=True,
                                        track_visibility='always',
                                        digits_compute=dp.get_precision('Product Unit of Measure'))



    rent_order_id = fields.Many2one('sale.order', string='Rental Sale Order', readonly=True)
    rent_order_line_id = fields.Many2one('sale.order.line', string='Rental Sale Order Line', readonly=True)
    rent_procurement_group = fields.Many2one('procurement.group', string='Rental Procurement Group', readonly=True)



    state = fields.Selection([
        ('draft', 'Draft'),
        ('check', 'Check'),
        ('reserved', 'Reserved'),
        ('order', 'Order'),
        ('running', 'Running'),
        ('done', 'Done'),
        ('cancel', 'Cancelled')
        ], string='Status', readonly=True, select=True, copy=False, default='draft', track_visibility='onchange')



    #go_to_running
    @api.multi
    def go_to_running(self):
        self.ensure_one()


        if self.rent_order_id.state in ('manual','done') and self.rent_order_line_id.state in ('confirmed','done'):

            active_id = self.id
            start_date = self.service_start_date
            end_date = self.service_end_date

            service_location_obj = self.env['service.location']
            service_location_ids = service_location_obj.search([])
            location_id = service_location_ids[0].rented_location_id.id

            var_procurement_group = {
                'name' : u'{} - {} - PR: {}'.format(self.name, self.rent_order_id.name, self.env['ir.sequence'].get('procurement.group')),
                'move_type':  'one'
            }

            procurement_group = self.env['procurement.group'].create(var_procurement_group)

            self.rent_procurement_group = procurement_group.id
            #_logger.debug("var_procurement_group:  %s",var_procurement_group)
            #_logger.debug("res:  %s",res.id)

            for line in self.rent_calc_lines:

                var_procurement ={
                    'name' : u'{}: {}'.format(self.name, line.product_id.name),
                    'product_id': line.product_id.id,
                    'product_qty': line.rent_product_qty,
                    'product_uom': line.product_id.uom_id.id,
                    'date_planned': start_date,
                    'location_id': location_id,
                    'group_id': procurement_group.id

                    }
                procurement_order = self.env['procurement.order'].create(var_procurement)

                line.procurement_order_id = procurement_order.id

                for stock_move in procurement_order.move_ids:

                    if stock_move.location_dest_id.id == location_id \
                            and stock_move.picking_id.state not in ('done','cancel') \
                            and not stock_move.picking_id.partner_id:

                            stock_move.write({'partner_id': self.partner_id.id})
                            stock_move.picking_id.write({'partner_id': self.partner_id.id})



            self.write({'state': "running"})



        else:
            raise ValidationError(
                _("Imposible. Sale Order state = '%s' , Sale Order Line = '%s'")
                % (self.rent_order_id.state, self.rent_order_line_id.state))








    @api.model
    def create(self, vals):

        if vals.get('name') == 'New' or not vals.get('name'):
            vals['name'] = self.env['ir.sequence'].next_by_code('service.rent.calc') or 'New Rent'
        result = super(ServiceRentCalc, self).create(vals)
        return result




     #   for invoice in self:
    #        if invoice.state not in ('draft', 'cancel'):
     #           raise Warning(_('You cannot delete an invoice which is not draft or cancelled. You should refund it instead.'))
     #       elif invoice.internal_number:
     #           raise Warning(_('You cannot delete an invoice after it has been validated (and received a number).  You can set it back to "Draft" state and modify its content, then re-confirm it.'))
     #   return super(account_invoice, self).unlink()



    @api.multi
    def unlink(self):

        for rent_order in self:
            if rent_order.state in ('reserved', 'order', 'running', 'done', 'cancel'):
                raise ValidationError(_('You can not remove a Rent Calculator.\nDiscard changes and try remove: Sale Oreder, Stock Movie and .. .'))
        return super(ServiceRentCalc, self).unlink()


    @api.multi
    def back_to_reserved(self):
        self.ensure_one()

        if self.rent_order_id:
            raise ValidationError(_("Can't back to reserved. Sale Order exist in state '%s'.") % (self.rent_order_id.state))
        else:
            self.write({'state': "reserved"})



    @api.multi
    def make_quotation(self):
        self.ensure_one()

       # if not self.rent_order_id:

        active_id = self.id
        start_date = self.service_start_date
        end_date = self.service_end_date

        service_location_obj = self.env['service.location']
        service_location_ids = service_location_obj.search([])
        warehouse_id = service_location_ids[0].rent_warehouse.id


        var_rent_order ={
                        'partner_id' : self.partner_id.id,
                        'warehouse_id' : warehouse_id
                        }


        sale_order = self.env['sale.order'].create(var_rent_order)

        price_unit = self.amount_total / self.number_of_days

        if sale_order.id:

            var_rent_order_line ={
                            'order_id' : sale_order.id,
                            'name' :  u'{}:{} {} - {}'.format(self.name, self.product_id.name, self.service_start_date, self.service_end_date),
                            'product_id': self.product_id.id,
                            'product_uom_qty': self.number_of_days,
                            'product_uom': self.product_id.uom_id.id,
                            'price_unit' : price_unit

                            }

            sale_order_line = self.env['sale.order.line'].create(var_rent_order_line)
            if sale_order_line.id:

                self.rent_order_id = sale_order
                self.rent_order_line_id = sale_order_line.id

                self.write({'state': "order"})

            else:
              raise ValidationError(_("Something Wrong '%s'.") % (self.rent_order_id.name))









    @api.depends('rent_calc_lines.service_cost_total')
    def _amount_all(self):
        """
        Compute the total amounts of the Rent.
        """
        for rent in self:
            amount_total = 0.0
            for line in rent.rent_calc_lines:
                amount_total += line.service_cost_total

            rent.update({
                'amount_total': amount_total
            })




    @api.multi
    def back_to_check_unreserve(self):
        self.ensure_one()

        self.write({'state': "check"})





    @api.multi
    def go_to_check(self):
        self.ensure_one()

        if self.rent_calc_lines:

            self.write({'state': "check"})
        else:
            raise ValidationError(
                        _("Missing Product for Rent" "Rent Order '%s'.") % (self.name))


    @api.multi
    def back_to_draft(self):
        self.ensure_one()

        self.write({'state': "draft"})

    @api.multi
    def check_available(self):
        self.ensure_one()

        self._check_service_start_end_dates()
        not_available = 0
        for line in self.rent_calc_lines:

            if not line.is_available_qty:
                not_available += 1

        if not_available == 0:
            self.write({'state': "reserved"})



### date - days : validation
    @api.one
    @api.depends('service_start_date', 'service_end_date')
    def _compute_number_of_days(self):
        if self.service_start_date and self.service_end_date:
            self.number_of_days = (
                fields.Date.from_string(self.service_end_date) -
                fields.Date.from_string(self.service_start_date)).days + 1
        else:
            self.number_of_days = 0


    @api.onchange('service_end_date')
    def service_end_date_change(self):
        if self.service_end_date:
            if self.service_start_date and self.service_start_date > self.service_end_date:
                self.service_start_date = self.service_end_date
            if self.service_start_date:
                number_of_days = (
                    fields.Date.from_string(self.service_end_date) -
                    fields.Date.from_string(self.service_start_date)).days + 1
                if self.number_of_days != number_of_days:
                    self.number_of_days = number_of_days

    @api.onchange('service_start_date')
    def service_start_date_change(self):
        if self.service_start_date:
            if self.service_end_date and self.service_start_date > self.service_end_date:
                self.service_end_date = self.service_start_date
            if self.service_end_date:
                number_of_days = (
                    fields.Date.from_string(self.service_end_date) -
                    fields.Date.from_string(self.service_start_date)).days + 1
                if self.number_of_days != number_of_days:
                    self.number_of_days = number_of_days

    @api.onchange('number_of_days')
    def number_of_days_change(self):
        if self.number_of_days:
            if self.service_start_date:
                end_date_dt = fields.Date.from_string(self.service_start_date) + relativedelta(days=self.number_of_days - 1)
                end_date = fields.Date.to_string(end_date_dt)
                if self.service_end_date != end_date:
                    self.service_end_date = end_date
            elif self.service_end_date:
                self.service_start_date = fields.Date.from_string(self.service_end_date) - relativedelta(days=self.number_of_days - 1)

    @api.one
    @api.constrains('service_start_date', 'service_end_date', 'number_of_days')
    def _check_service_start_end_dates(self):
        if self.rent_calc_lines:
            if not self.service_end_date:
                raise ValidationError(
                        _("Missing End Date." "Product '%s'.") % (self.product_id.name))
            if not self.service_start_date:
                raise ValidationError(
                        _("Missing Start Date." "Product '%s'.") % (self.product_id.name))
            if not self.number_of_days:
                raise ValidationError(
                        _("Missing number of days." "Product '%s'.") % (self.product_id.name))
            if self.service_start_date > self.service_end_date:
                raise ValidationError(
                        _("Start Date should be before or be the same as " "Product '%s'.") % (self.product_id.name))
            if self.number_of_days < 0:
                raise ValidationError(
                        _("Product '%s', the ""number of days is negative ; this is not allowed.")% (self.product_id.name))

            days_delta = (
                fields.Date.from_string(self.service_end_date) -
                fields.Date.from_string(self.service_start_date)).days + 1

            if self.number_of_days != days_delta:
                raise ValidationError(
                    _("On the Product '%s', "
                        "there are %d days between the Start Date (%s) and "
                        "the End Date (%s), but the number of days field "
                        "has a value of %d days.")
                    % (self.product_id.name, days_delta, self.service_start_date,
                        self.service_end_date, self.number_of_days))










class ServiceRentCalcLine(models.Model):
    _name = 'service.rent.calc.line'
    _description = 'Service Rent Calc Line'
    _order = 'id'

    rent_id = fields.Many2one('service.rent.calc', string='Rent Reference', required=True, ondelete='cascade', index=True, copy=False)
    name = fields.Text(string='Description', required=False)

    product_id = fields.Many2one('product.product', string='Product', domain=[('service_type','=','rent'), ('service_factor','>',0)], change_default=True, ondelete='restrict', required=True)
    rent_product_qty = fields.Float(string='Rent Qty.', digits=dp.get_precision('Product Unit of Measure'), required=True, default=1.0)
    rent_days = fields.Integer(string='Rent Days', related='rent_id.number_of_days', store=True, readonly=True)
    rent_total_qty = fields.Float(string='Rent Total Qty.', compute='_compute_rent_total_qty', digits_compute= dp.get_precision('Product Price'), store=True, readonly=True)


    service_price = fields.Float(string='Price', related='rent_id.service_price', store=True, digits=dp.get_precision('Product Unit of Measure'))
    service_factor = fields.Float(string='Factor', related='product_id.service_factor', store=True, digits=dp.get_precision('Product Unit of Measure'), readonly=True)
    service_unit_price = fields.Float(string='Price Unit', compute='_compute_service_unit_price', digits_compute= dp.get_precision('Product Price'), store=True, readonly=True)

    service_cost_total = fields.Float(string='Cost Total', compute='_compute_service_cost_total',  digits_compute= dp.get_precision('Account'), store=True, readonly=True)

    rent_partner_id = fields.Many2one(related='rent_id.partner_id', store=True, string='Customer')


    ##reserv
    reserve_start_date = fields.Date(string='Start Date',related='rent_id.service_start_date', readonly=True)
    reserve_end_date = fields.Date(string='End Date',related='rent_id.service_end_date',  readonly=True)


    #procuremnt
    procurement_order_id = fields.Many2one('procurement.order', 'Procurement Order', ondelete='restrict', readonly=True)

    #forecast
    forecast_out_qty = fields.Float(string='F.Out Qty. ',
                                    compute='_compute_forecast_out_qty',
                                    digits_compute= dp.get_precision('Product Price'), store=False, readonly=True)

    forecast_stock_qty = fields.Float(string='F.Stock Qty.',
                                      compute='_compute_forecast_stock_qty',
                                      digits_compute= dp.get_precision('Product Price'),store=False, readonly=True)

    forecast_real_qty = fields.Float(string='F.Real Qty.',
                                     compute='_compute_forecast_real_qty',
                                     digits_compute= dp.get_precision('Product Price'), store=False, readonly=True)
    forecast_balance_qty = fields.Float(string='F.Balance Qty.',
                                        compute='_compute_forecast_balance_qty',
                                        digits_compute= dp.get_precision('Product Price'), store=False, readonly=True)


    is_available_qty = fields.Boolean('Is Available', compute='_compute_is_available_qty')


    state = fields.Selection([
        ('draft', 'Draft'),
        ('check', 'Check'),
        ('reserved', 'Reserved'),
        ('order', 'Order'),
        ('running', 'Running'),
        ('done', 'Done'),
        ('cancel', 'Cancelled')
    ], related='rent_id.state', string='Order Status', readonly=True, copy=False, store=True, default='draft')





    @api.one
    @api.depends('forecast_real_qty', 'rent_product_qty')
    def _compute_is_available_qty(self):
        """
        Method
        """
        if self.state not in ('draft','reserved','order', 'running', 'done', 'cancel'):

            _logger.debug("self.forecast_balance_qty %s",self.forecast_balance_qty)
            _logger.debug("self.rent_days %s",self.rent_days)
            _logger.debug("self.service_cost_total %s",self.service_cost_total)
            if self.forecast_balance_qty < 0 or self.service_cost_total <= 0:
                self.is_available_qty = False
            else:
                self.is_available_qty = True




    @api.one
    @api.depends('forecast_real_qty', 'rent_product_qty')
    def _compute_forecast_balance_qty(self):
        """
        Method
        """
        if self.state not in ('draft', 'reserved','order', 'running', 'done', 'cancel'):
            balance_qty = self.forecast_real_qty - float(self.rent_product_qty)
            self.forecast_balance_qty = balance_qty





    @api.one
    @api.depends('forecast_stock_qty','forecast_out_qty')
    def _compute_forecast_real_qty(self):
        """
        Method
        """

        if self.state not in ('draft', 'reserved','order', 'running', 'done', 'cancel'):
            real_qty = self.forecast_stock_qty - self.forecast_out_qty

            if real_qty < 0:
                    real_qty = 0

            self.forecast_real_qty = real_qty


    @api.one
    @api.depends('rent_product_qty', 'rent_days')
    def _compute_forecast_stock_qty(self):
        """
        Method
        """
        if self.state not in ('draft', 'reserved','order', 'running', 'done', 'cancel'):
            self.forecast_stock_qty = self.product_id.rent_qty



    @api.one
    @api.depends('rent_product_qty', 'rent_days')
    def _compute_forecast_out_qty(self):
        if self.state not in ('draft', 'reserved','order', 'running', 'done', 'cancel'):
            start_date = self.rent_id.service_start_date
            end_date = self.rent_id.service_end_date

            _logger.debug("service_start_date %s",start_date)
            _logger.debug("service_start_date %s",end_date)

            already_out_qty = 0

            #_logger.debug("product_id: %s",self.product_id.name )

            domain = [('product_id', '=', self.product_id.id), ('state', 'in', ('reserved', 'order','running', 'done' )),
                              '|','&', ('reserve_start_date', '>=', start_date), ('reserve_end_date', '<=', end_date) ,
                              '&', ('reserve_end_date', '>=', start_date), ('reserve_start_date', '<=', end_date)
                              ]

            service_reserve_result = self.env['service.rent.calc.line'].search(domain)



            for service_reserve in service_reserve_result:

                _logger.debug("period: %s - %s",service_reserve.reserve_start_date, service_reserve.reserve_end_date )
                _logger.debug("!!!! product_qty: %s",service_reserve.rent_product_qty )

                already_out_qty+=service_reserve.rent_product_qty

            _logger.debug("rent_out_qty: %s",already_out_qty )


            self.forecast_out_qty = already_out_qty




    @api.one
    @api.depends('rent_total_qty', 'service_unit_price', 'rent_product_qty')
    def _compute_service_cost_total(self):
        """
        Method
        """
        service_cost_total = self.rent_total_qty * self.service_unit_price

        self.service_cost_total = service_cost_total




    @api.one
    @api.depends('service_price', 'service_factor')
    def _compute_service_unit_price(self):
        """
        Method
        """
        service_unit_price = self.service_price * self.service_factor

        self.service_unit_price = service_unit_price

    @api.one
    @api.depends('rent_id.number_of_days', 'rent_days', 'rent_product_qty')
    def _compute_rent_total_qty(self):
        """
        Method
        """
        rent_total_qty = self.rent_product_qty * self.rent_days

        self.rent_total_qty = rent_total_qty