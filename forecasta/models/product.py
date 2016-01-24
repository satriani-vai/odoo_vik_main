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


import math
from openerp.exceptions import Warning
from openerp import tools

_logger = logging.getLogger(__name__) # Need for message in console.


class ServiceTypeProduct(models.Model):

    _inherit = "product.template"


    @api.model
    def _service_type_selection(self):

        return [
            ('rent',  'Rent'),

        ]


    service_type = fields.Selection(string='Service Type', selection=_service_type_selection)