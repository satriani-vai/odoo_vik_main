# -*- coding: utf-8 -*-




import os
import sys
import shutil
import glob
import os



import base64
import xmlrpclib


import time
import datetime
from dateutil import tz

import pytz


from dateutil import parser


from openerp import SUPERUSER_ID
from openerp import models, fields, api
from openerp.tools.translate import _
from openerp.tools import html2text
from openerp import netsvc
import openerp.tools as tools

from openerp import models, api
from openerp.exceptions import Warning
from openerp import exceptions


import csv
import re
import base64
import logging
_logger = logging.getLogger(__name__) # Need for message in console.




class img_product(models.Model):

    _name = 'img.product'

    name = fields.Char(string='File Name')
    path = fields.Char(string='Path')


    @api.multi
    def read_img_part(self, imgcode):

        _logger.warning("Update: %s", 'Start' )
        #product_obj = self.env['product.template']

        def _read_down(self):

            product_obj = self.env['product.template']
            result = product_obj.search([('active', '=', True),('image', '=', False)], limit=500)

            if result:
                _logger.warning("Update: %s", 'Wait while Done' )
                for product_data in result:
                    product_data.write({'image': imgcode})
                start_recur_update = True
            else:
                start_recur_update = False

            if start_recur_update:
                _read_down(self)

            return start_recur_update

        start = _read_down(self)

        _logger.warning("Update: %s", 'Done' )
        return start



    @api.multi
    def read_img_to_log(self):


        import_file = False
        context = (self._context or {})
        img_product_obj = self.env['img.product']
        idsd = self.id
        img_product_data = img_product_obj.search([('id', '=', self.id)], limit=1)


        file_name = img_product_data.name
        dir_path = img_product_data.path


        filename = file_name
        source_dir = dir_path




        try:
            import_file = open(os.path.join(source_dir, filename), 'r')
        except Exception, e:
             ierror = tools.ustr(e)

             message="Error: %s " %( ierror )

             return self.env['popup.message'].warning(title='Error source', message="Error: %s " %( ierror ))


        #if (action_id):
        #    return exceptions.RedirectWarning(msg % values, action_id, _('Go to the configuration panel'))
       # return exceptions.Warning(msg % values)


        #with open("yourfile.ext", "rb") as image_file:

        if import_file:

            encoded_string = base64.encodestring(import_file.read())

            self.read_img_part(encoded_string)
            #image_base64 = base64.encodestring(image)
            #_logger.warning("Import: id = %s", encoded_string )

            #product_obj = self.env['product.template']

            #product_result = product_obj.search([('active', '=', True)], limit=1000)
            #product_result = product_obj.search([('active', '=', True), ('image', '=', False)])



            #for product_data in product_result:

                #product_data.write({'image': encoded_string})

                #_logger.warning("Update: id = %s", product_data.id )

            #_logger.warning("Done Upload %s", 'Image' )

        return True





















