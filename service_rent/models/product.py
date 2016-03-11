# -*- coding: utf-8 -*-
from openerp import models, fields, api, _
import logging
from lxml import etree

import datetime
from dateutil import tz
import pytz
import time
from string import Template

from openerp.exceptions import  Warning
from openerp.tools.float_utils import float_round

import math
from openerp.exceptions import Warning
from openerp import tools
import openerp.addons.decimal_precision as dp

_logger = logging.getLogger(__name__) # Need for message in console.


class ProductProduct(models.Model):
    _inherit = "product.product"

    @api.multi
    def _get_domain_locations_rent(self):
        '''
        Domain
        '''

        service_location_obj = self.env['service.location']
        service_location_ids = service_location_obj.search([])
        location_id = service_location_ids[0]

        domain = ['|',('location_id', '=', location_id.storage_location_id.id), ('location_id', '=', location_id.rented_location_id.id)]
        return domain



    @api.model
    def _search_qty_available_rent(self, operator, value):
        domain_quant = []
        domain_quant += self._get_domain_locations_rent()

        quants = self.env['stock.quant'].read_group(domain_quant, ['product_id', 'qty'], ['product_id'])
        quants = dict(map(lambda x: (x['product_id'][0], x['qty']), quants))
        quants = dict((k, v) for k, v in quants.iteritems() if eval(str(v) + operator + str(value)))

        return( list(quants) )


    @api.multi
    def _product_available_rent(self):


        domain_quant = []

        domain_products = [('product_id', 'in', self.ids)]
        domain_quant_loc = self._get_domain_locations_rent()

        domain_quant += domain_products
        domain_quant += domain_quant_loc

        quants = self.env['stock.quant'].read_group(domain_quant, ['product_id', 'qty'], ['product_id'])
        #_logger.debug("quants %s",quants)

        quants = dict(map(lambda x: (x['product_id'][0], x['qty']), quants))



        for product in self:
            product.rent_qty = float_round(quants.get(product.id, 0.0), precision_rounding=product.uom_id.rounding)
            #_logger.debug("product.rent_qty %s",product.rent_qty)





    rent_qty = fields.Float(
        compute='_product_available_rent',
        digits_compute=dp.get_precision('Product Unit of Measure'),
        string='Quantity For Rent',
        search='_search_qty_available_rent')




class ProductServiceType(models.Model):

    _inherit = "product.template"


    @api.model
    def _service_type_selection(self):

        res = [ ('rent',  'Can be Rent')]
        return res

    service_type = fields.Selection(string='Service Type', selection=_service_type_selection)
    service_factor = fields.Float(string='Service Factor')


    @api.model
    def _product_available_rent(self):
        var_ids = []
        for product in self:
            var_ids += [p.id for p in product.product_variant_ids]
        variant_available = self.product_variant_ids._product_available_rent()

        for product in self:
            for p in product.product_variant_ids:
                p.rent_qty += variant_available[p.id]["rent_qty"] or 0


    @api.model
    def _search_product_quantity_rent(self, obj, name, domain):
        prod = self.env["product.product"]
        product_variant_ids = prod.search(domain)
        return [('product_variant_ids', 'in', product_variant_ids)]


    rent_qty = fields.Float(compute="_product_available_rent", search="_search_product_quantity_rent", string='Quantity For Rent')

