# -*- coding: utf-8 -*-
##############################################################################
#
#    Copyright (C) 2012 - 2013 Daniel Reis
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################

from openerp.osv import fields, orm, osv


class task(osv.osv):

    _inherit = "project.task"
    _columns = {
         'invoice_task_ids': fields.one2many('account.analytic.line', 'task_id', 'Resource used'),
    }

task()


class account_analytic_line(osv.osv):
    _inherit = 'account.analytic.line'
    _description = 'Analytic Line'
    _columns = {

        'task_id': fields.many2one('project.task', 'Task', ondelete='cascade', required=False),
    }


account_analytic_line()
