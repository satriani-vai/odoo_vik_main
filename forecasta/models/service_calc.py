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

class ServiceBomCalc(models.Model):

    _name = 'service.bom.calc'

    READONLY_STATES = {
        'generated': [('readonly', True)],
        'available': [('readonly', True)],
        'reserved': [('readonly', True)],
        'done': [('readonly', True)],
        'cancel': [('readonly', True)],
    }
    READONLY_STATES_2 = {

        'available': [('readonly', True)],
        'reserved': [('readonly', True)],
        'done': [('readonly', True)],
        'cancel': [('readonly', True)],
    }


    #domain=[('type','!=','service'),('bom_ids','!=',False),('bom_ids.type','!=','phantom')] ,('service_type','=','rent') ('type','=','consu')

    name = fields.Char(string='Name', related='product_tmp_id.name')
    product_id = fields.Many2one('product.product','Product', required=True, states=READONLY_STATES, domain=[('type','=','consu'), ('service_type','=','rent'), ('bom_ids','!=',False),('bom_ids.type','!=','phantom')])
    product_tmp_id = fields.Many2one(string='Product Template',related='product_id.product_tmpl_id', readonly=True)

    bom_id = fields.Many2one('mrp.bom','Bill of Material', required=True)
    product_qty = fields.Float('Product Quantity in BOM', related='bom_id.product_qty', required=False,  digits_compute=dp.get_precision('Product Unit of Measure'))

    purch_qty = fields.Float(string='Demand Qty.', digits_compute=dp.get_precision('Product Price'), required=True, states=READONLY_STATES_2 )
    service_start_date = fields.Date(string='Service Start Date', required=True,states=READONLY_STATES_2 )
    service_end_date = fields.Date(string='Service End Date' ,required=True, states=READONLY_STATES_2)

    calc_line_ids = fields.One2many('service.bom.calc.line', 'service_bom_calc_id', string='Lines')
    bom_service_reserve_ids = fields.One2many('service.reserve', 'bom_service_reserve_id', string='service reserve')

    is_available_qty = fields.Boolean('Is Available', compute='_is_available_qty')
    is_readonly = fields.Boolean('Is Readonly', readonly=True)

    route_ids = fields.Many2many('stock.location.route', 'stock_route_bom_calc', 'product_id', 'route_id', 'Routes', domain="[('product_selectable', '=', True)]")

    state = fields.Selection([
        ('draft', 'Draft'),
        ('generated', 'Generated'),
        ('available', 'Available'),
        ('reserved', 'Reserved'),
        ('done', 'Done'),
        ('cancel', 'Cancelled')
        ], string='Status', readonly=True, select=True, copy=False, default='draft')


    _defaults = {
        'purch_qty': 1.0,}

    @api.one
    @api.constrains('service_start_date', 'service_end_date')
    def _check_service_start_end_dates(self):
        if (
                self.service_start_date and
                self.service_end_date and
                self.service_start_date > self.service_end_date):
            raise ValidationError(
                _("Service Start Date should be before or be the "
                    "same as Default End Date for sale order %s")
                % self.name)

    @api.onchange('service_start_date')
    def service_start_date_change(self):
        if (
                self.service_start_date and
                self.service_end_date and
                self.service_start_date > self.service_end_date):
            self.service_end_date = self.service_start_date

    @api.onchange('service_end_date')
    def service_end_date_change(self):
        if (
                self.service_start_date and
                self.service_end_date and
                self.service_start_date > self.service_end_date):
            self.service_start_date = self.service_end_date


    @api.onchange('product_id')
    def _change_product_id(self):
        """ Detect chenge product"""
        self.purch_qty = 1.0
        self.bom_id = None
        self.calc_line_ids.unlink()

    def get_children(self, object, level=0): # recusive search sub level bom.
        result = []

        def _get_rec(object, level, parent=None):
            for line in object:

                res = {}
                res['p_id']         = '{}'.format(line.product_id.id)
                res['p_name']       = u'[{}] {}'.format(line.product_id.default_code or '', line.product_id.name)
                res['b_line_id']    = '{}'.format(line.id)
                res['uname']        = u'{}'.format(line.product_uom.name)
                res['level']        = '{}'.format(level)
                res['b_id']         = '{}'.format(line.bom_id.id)
                res['id_parent']    = '{}'.format(parent)  #'{}'.format('True' if line.child_line_ids else 'False') parent
                result.append(res)

                _logger.debug("ID Line: %s",line.id )
                _logger.debug("Child Line: %s",line.child_line_ids )
                _logger.debug("Parent Line: %s", parent )
                _logger.debug("Level Line: %s", level )
                _logger.debug("------: %s", "" )

                if line.child_line_ids:

                    if level<6:
                        level += 1
                        parent = line.id
                    _get_rec(line.child_line_ids,level, parent )
                    if level>0 and level<6:
                        level -= 1
                        parent = None

            return result

        children = _get_rec(object,level)

        return children


    @api.multi
    def get_ids_from_bom(self):
        self.ensure_one()

        active_id = self.id
        self.write({'state': "generated"})
        self.calc_line_ids.unlink()
        line_datas = self.get_children(self.bom_id.bom_line_ids)

        #bp()

        _logger.debug("recur BOM IDs: %s",line_datas )

        for index, line in enumerate(line_datas):
            level = int(line["level"])
            name = line["p_name"]

            for i in range(0,level):
                name = u'\u2014'+name

            var_data ={
                    'name': name,
                    'seq_line': index+1,
                    'level': level,
                    'service_bom_calc_id': active_id,
                    'bom_line_id' : line["b_line_id"],
                    'bom_id' : line["b_id"],
                    'id_parent' : line['id_parent']
            }
            #_logger.warning("Line: %s",index )
            res = self.env['service.bom.calc.line'].create(var_data)
            #_logger.warning("Line: %s",var_data )


    @api.multi
    def check_available(self):
        self.ensure_one()

        if self.is_available_qty:
            self.write({'state': "available"})

    @api.multi
    def to_generate(self):
        self.ensure_one()

        self.write({'state': "generated"})


    @api.one
    def _is_available_qty(self):
        """ Detect chenge bom"""

        is_available = False
        false_qty = 0

        if self.calc_line_ids and self.service_start_date and self.service_end_date:

            for line in self.calc_line_ids:

                if line.product_id.type != 'service' and line.forecast_balance_qty < 0:
                    false_qty=+1
            if false_qty == 0:
                is_available = True
        else:
            is_available = False

        self.is_available_qty = is_available



    @api.multi
    def set_service_reserve(self):
        self.ensure_one()

        if self.is_available_qty:
            active_id = self.id
            start_date = self.service_start_date
            end_date = self.service_end_date

            for line in self.calc_line_ids:
                if line.product_id.type != 'service':
                    var_data ={
                        'product_id': line.product_id.id,
                        'reserve_start_date': start_date,
                        'reserve_end_date': end_date,
                        'product_qty': line.purch_qty,
                        'bom_service_reserve_id' : active_id,
                        'bom_line_service_reserve_id' : line.id,
                        }
                    res = self.env['service.reserve'].create(var_data)

                    if res:
                        self.is_readonly = True

            self.write({'state': "reserved"})

        else:
            self.write({'state': "generated"})


    @api.multi
    def reserve_to_draft(self):
        self.ensure_one()

        self.bom_service_reserve_ids.unlink()
        self.calc_line_ids.unlink()
        self.write({'state': "draft"})









class ServiceBomCalcLine(models.Model):

    _name = 'service.bom.calc.line'

    name = fields.Char(string='Name', readonly=True)
    bom_line_id = fields.Many2one('mrp.bom.line', 'Bom Line', required=True, readonly=True)

    product_id = fields.Many2one('product.product','Product', related='bom_line_id.product_id',store=True, readonly=True )
    product_qty = fields.Float('Product Quantity', related='bom_line_id.product_qty', required=False, store=True, digits_compute=dp.get_precision('Product Unit of Measure'), readonly=True)
    product_uom = fields.Char('UoM', compute='_compute_uom', store=True, readonly=True)

    bom_id = fields.Char(string='Bom', readonly=True)
    level = fields.Char(string='Level', readonly=True)
    seq_line = fields.Integer(string='Seq.', readonly=True)

    service_bom_calc_id = fields.Many2one('service.bom.calc', 'Bom Calc', required=True, ondelete='cascade', readonly=True)
    is_calc = fields.Boolean('Is Calc', compute='_compute_is_calc', readonly=True)

    purch_qty = fields.Float(string='Demand Qty.', compute='_compute_unit_qty', digits_compute= dp.get_precision('Product Price'), store=True, readonly=True)
    purch_cost = fields.Float(string='Cost', compute='_compute_unit_cost', digits_compute= dp.get_precision('Product Price'), store=True, readonly=True)
    purch_total = fields.Float(string='Total', compute='_compute_total_cost',  digits_compute= dp.get_precision('Account'), store=True, readonly=True)

    id_parent = fields.Char(string='Parent ID', readonly=True)
    id_bom_line = fields.Integer('Bom Line ID', compute='_id_bom_line', store=True, readonly=True)

    forecast_out_qty = fields.Float(string='Out Qty. ', compute='_compute_out_qty', digits_compute= dp.get_precision('Product Price'), store=True, readonly=True)
    forecast_stock_qty = fields.Float(string='Stock Qty.', compute='_compute_stock_qty', digits_compute= dp.get_precision('Product Price'),store=True, readonly=True)
    forecast_real_qty = fields.Float(string='Real Qty.', compute='_compute_real_qty', digits_compute= dp.get_precision('Product Price'), store=True, readonly=True)
    forecast_balance_qty = fields.Float(string='Balance Qty.', compute='_compute_balance_qty', digits_compute= dp.get_precision('Product Price'), store=True, readonly=True)


    bom_line_service_reserve_ids = fields.One2many('service.reserve', 'bom_line_service_reserve_id', string='Bom Lines', readonly=True)

    _order = 'seq_line'


    #How to you can over python code we can add color rule for List view
    @api.model
    def fields_view_get(self, view_id=None, view_type='form', toolbar=False, submenu=False):
        res = super(ServiceBomCalcLine, self).fields_view_get(
                view_id=view_id,
                view_type=view_type,
                toolbar=toolbar,
                submenu=submenu)

        doc = etree.XML(res['arch'])
        #for node in doc.xpath("//field[@name='product_uom']"): #example for search field
        for node in doc.xpath("//tree[@name='color_test']"):

            #node.set('colors', '#7aae7e:is_calc==False;#e56852:forecast_balance_qty<0')
            node.set('colors', '#e56852:forecast_balance_qty<0')
            setup_modifiers(node, res['fields']['is_calc'])

            #_logger.warning("Node Found: %s",node )

        res['arch'] = etree.tostring(doc)
        return res



    @api.one
    @api.depends('bom_line_id')
    def _id_bom_line(self):
        """
        Method
        """
        #if self.is_calc:
        self.id_bom_line = self.bom_line_id.id


    @api.one
    @api.depends('bom_line_id')
    def _compute_uom(self):
        """
        Method
        """
        #if self.is_calc:
        self.product_uom = self.bom_line_id.product_uom.name



    @api.one
    @api.depends('bom_line_id')
    def _compute_is_calc(self):


        if self.product_id.type == 'service':
            self.is_calc = True

        else:
            self.is_calc = False


    @api.one
    @api.depends('service_bom_calc_id.service_start_date','service_bom_calc_id.service_end_date', 'purch_qty')
    def _compute_out_qty(self):
        """
        Method
        """
        if not self.is_calc:

            start_date = self.service_bom_calc_id.service_start_date
            end_date = self.service_bom_calc_id.service_end_date

            _logger.debug("service_start_date %s",start_date)
            _logger.debug("service_start_date %s",end_date)

            already_out_qty = 0

            if self.product_id.type != 'service':
                _logger.debug("product_id: %s",self.product_id.name )

                domain = ['|','&', ('reserve_start_date', '>=', start_date), ('reserve_end_date', '<=', end_date) , '&', ('reserve_end_date', '>=', start_date), ('reserve_start_date', '<=', end_date) ]

                service_reserver_result = self.env['service.reserve'].search(domain)



                for service_reserver in service_reserver_result:


                    _logger.debug("period: %s - %s",service_reserver.reserve_start_date, service_reserver.reserve_end_date )
                    _logger.debug("product_qty: %s",service_reserver.product_qty )

                    already_out_qty+=service_reserver.product_qty

                _logger.debug("rent_out_qty: %s",already_out_qty )


            self.forecast_out_qty = already_out_qty

    @api.one
    @api.depends('is_calc', 'product_id')
    def _compute_stock_qty(self):
        """
        Method
        """
        if not self.is_calc:
            self.forecast_stock_qty = self.product_id.qty_available



    @api.one
    @api.depends('is_calc','forecast_stock_qty','forecast_out_qty')
    def _compute_real_qty(self):
        """
        Method
        """
        if not self.is_calc:
            real_qty = self.forecast_stock_qty - self.forecast_out_qty



            if real_qty < 0:
                real_qty = 0
            #else:
            #    real_qty -= self.purch_qty


            self.forecast_real_qty = real_qty

    @api.one
    @api.depends('is_calc', 'forecast_real_qty','purch_qty')
    def _compute_balance_qty(self):
        """
        Method
        """
        if not self.is_calc:
            balance_qty = self.forecast_real_qty - self.purch_qty

            self.forecast_balance_qty = balance_qty





    @api.one
    @api.depends('service_bom_calc_id.purch_qty')
    def _compute_unit_qty(self):
        """
        Method
        """

        ##if not self.is_calc:
        ##    self.purch_qty = self.product_qty
        ##else:
        _logger.debug("------: %s",self.bom_id)
        _logger.debug("   ---: %s",self.service_bom_calc_id.id)
        _logger.debug("   1--: %s",self.id_parent)

        if self.id_parent != 'None':

            _logger.debug("       1---: %s",self.service_bom_calc_id.id)
            _logger.debug("       2---: %s",self.id_parent)

            k_qty_result = self.env['service.bom.calc.line'].search([('service_bom_calc_id','=',self.service_bom_calc_id.id),('bom_line_id', '=',int(self.id_parent))])

            _logger.debug("       3---: %s",k_qty_result)

            k_qty = 1.0

            if k_qty_result:
                k_qty = k_qty_result[0].purch_qty

        else:
            k_qty = self.service_bom_calc_id.purch_qty

        _logger.debug("------k_qty: %s",k_qty)
        _logger.debug("     %s","")

        self.purch_qty = self.product_qty*k_qty


    @api.one
    @api.depends('is_calc','bom_id')
    def _compute_unit_cost(self):
        """
        Method
        """

        if self.is_calc:


            unit = self.bom_line_id.product_uom

            if not unit or self.product_id.uom_po_id.category_id.id != unit.category_id.id:
                unit = self.product_id.uom_po_id

            ctx = dict(self._context or {})
            if unit:
                # price_get() will respect a 'uom' in its context, in order
                # to return a default price for those units
                ctx['uom'] = unit.id

            # Compute based on pricetype
            amount_unit = self.product_id.with_context(ctx).price_get('standard_price')[self.product_id.id]

            self.purch_cost = amount_unit




        _logger.debug("------k_qty: %s",self.product_id)


    @api.one
    @api.depends('is_calc','purch_qty','purch_cost')
    def _compute_total_cost(self):
        """
        Method
        """
        if self.is_calc:
            self.purch_total = self.purch_qty * self.purch_cost


















