# -*- coding: utf-8 -*-
from openerp import models, fields, api, _
import logging
from lxml import etree

import datetime
from dateutil import tz
import pytz
import time
from string import Template
from datetime import datetime, timedelta
from openerp.exceptions import  Warning
from pdb import set_trace as bp

_logger = logging.getLogger(__name__) # Need for message in console.

class ProjectTaskNative(models.Model):
    _inherit = 'project.task'



    pl_planned_hours =  fields.Float('P. Hours', help='Estimated time to do the task, usually set by the project manager when the task is in draft state.')
    pl_remaining_hours =  fields.Float('Remaining Hours', digits=(16,2), help="Total remaining time, can be re-estimated periodically by the assignee of the task.")

    pl_start_date = fields.Datetime(default=fields.Date.today, string='Planned Start Date' )
    pl_end_date = fields.Datetime(default=fields.Date.today, string='Planned Start Date' )
    pl_percentage_done =  fields.Integer(default=0, string='Done' )

    pl_parent_ids =  fields.Many2many('project.task', 'project_native_task_parent_rel', 'task_id', 'parent_id', 'Parent Tasks')
    pl_child_ids = fields.Many2many('project.task', 'project_native_task_parent_rel', 'parent_id', 'task_id', 'Child Tasks', domain="[('project_id','=',project_id)]")





