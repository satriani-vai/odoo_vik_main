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



class ServiceLocation(models.Model):

    _name = 'service.location'

    name = fields.Char(string='Name')
    rented_location_id = fields.Many2one('stock.location', 'Rented', required=True, ondelete='restrict', domain="[('usage', '=', 'internal')]")
    storage_location_id = fields.Many2one('stock.location', 'Storage', required=True, ondelete='restrict', domain="[('usage', '=', 'internal')]")
    rent_to_picking = fields.Many2one('stock.picking.type', 'Picking Rent To', required=True, ondelete='restrict', domain="[('code', '=', 'internal')]")
    rent_from_picking = fields.Many2one('stock.picking.type', 'Picking Rent From', required=True, ondelete='restrict', domain="[('code', '=', 'internal')]")
    rent_route = fields.Many2one('stock.location.route', 'Route', required=True, ondelete='restrict',)
    rent_warehouse = fields.Many2one('stock.warehouse', 'Warehouse', required=True, ondelete='restrict',)
    is_configure = fields.Boolean('Is Configure',readonly=True)



    @api.multi
    def _set_rental_route_push_pull_rules(self):
        self.ensure_one()

        #Pull: Rent to customer
        rental_pull_rule = {
            'name': u'{0} - {1}'.format('Rent to:', self.rented_location_id.name),
            'location_id': self.rented_location_id.id,
            'location_src_id': self.storage_location_id.id,
            'route_id': self.rent_route.id,
            'action': 'move',
            'picking_type_id': self.rent_to_picking.id,
            'warehouse_id': self.rent_warehouse.id,
        }

        #Push: Rent from customer
        rental_push_rule = {
            'name': u'{0} - {1}'.format('Rent from:', self.rented_location_id.name),
            'location_from_id': self.rented_location_id.id,
            'location_dest_id': self.storage_location_id.id,
            'route_id': self.rent_route.id,
            'auto': 'auto',
            'invoice_state': 'none',
            'picking_type_id': self.rent_from_picking.id,
            'warehouse_id': self.rent_warehouse.id,
            }

        return {
            'procurement.rule': [ rental_pull_rule ],
            'stock.location.path': [ rental_push_rule ],
            }





    @api.multi
    def set_rental_route_push_pull_rules(self):
        self.ensure_one()



        for obj, rules_list in self._set_rental_route_push_pull_rules().iteritems():
            for rule in rules_list:

                self.env[obj].create(rule)
                self.write({'is_configure': True})





















