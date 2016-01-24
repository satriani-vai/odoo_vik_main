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



class ServiceReserve(models.Model):

    _name = 'service.reserve'

    name = fields.Char(string='Name', readonly=True)

    product_id = fields.Many2one('product.product','Product', readonly=True)

    reserve_start_date = fields.Date(string='Reserve Start Date', readonly=True)
    reserve_end_date = fields.Date(string='Reserve End Date', readonly=True)

    product_qty = fields.Float('Product Quantity', digits_compute=dp.get_precision('Product Unit of Measure'), readonly=True)

    seq_line = fields.Integer(string='Seq.', readonly=True)

    bom_service_reserve_id = fields.Many2one('service.bom.calc', 'Bom Calc', required=True, ondelete='cascade', readonly=True)
    bom_line_service_reserve_id = fields.Many2one('service.bom.calc.line', 'Bom Calc Line', required=True, ondelete='cascade', readonly=True)


    _order = 'seq_line'




















