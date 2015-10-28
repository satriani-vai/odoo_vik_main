# -*- encoding: utf-8 -*-

from openerp.models import Model, api
from openerp import fields


class northwind_customers(Model):
    _inherit = 'northwind.customers'

    northwind_attachment_ids = fields.Many2many('northwind.files', 'northwind_files_rel', 'northwind_id', 'file_id', string='Attachmets')



class northwind_files(Model):
    _name = 'northwind.files'

    name = fields.Char("Name File")
    attachment_id = fields.Many2one('ir.attachment', string='File', domain=[('res_model','=','northwind.customers')])
    file = fields.Binary("File", related='attachment_id.datas')

