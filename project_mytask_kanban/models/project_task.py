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

class ProjectForecast(models.Model):
    _inherit = 'project.task'

    @api.model
    def _get_my_state_id(self):


        custome_state = [   ('3 In Test', _('3 In Test')),
                            ('4 Closed', _('4 Closed'))

                        ]


        return custome_state

    def default_end_date(self):
        today = fields.Date.from_string(fields.Datetime.now())
        duration = timedelta(days=1)
        return today + duration

    my_start_date = fields.Date(default=fields.Date.today, required="True", string='My Start Date' )
    my_state_id =  fields.Char(compute='compute_my_state_id', string='My State', store=True, readonly=True)
    url =  fields.Char(string='URL')
    url_title =  fields.Char(string='URL title')


    my_state_control =  fields.Selection('_get_my_state_id', string='My State Control')

    #my_state_id =  fields.Many2one('project.task.type', compute='compute_my_state_id', string=_('My State'),store=True, readonly=True)

    @api.one
    @api.depends('my_start_date','my_state_control')
    def compute_my_state_id(self):

        today = fields.Date.from_string(fields.Date.today())
        my_start_date = fields.Date.from_string(self.my_start_date)

        delta = my_start_date - today
        delta_deys = delta.days

        _logger.debug("Duration: %s",delta_deys)

        if not self.my_state_control:
            if delta_deys <= 0:
                self.my_state_id = '0 Today'
            elif delta_deys == 1:
                self.my_state_id = '1 Tomorrow'
            elif delta_deys > 1:
                self.my_state_id = '2 Coming Days'
        else:
            self.my_state_id = self.my_state_control


    @api.model
    def project_task_my_state(self):

        project_task_obj = self.env['project.task']
        project_task_obj_search = project_task_obj.search([('active', '=', True)])

        _logger.debug("Task my state - Hello from cron", )

        today = fields.Date.from_string(fields.Date.today())
        for project_task in project_task_obj_search:

            my_state = None
            my_start_date = fields.Date.from_string(project_task["my_start_date"])

            delta = my_start_date - today
            delta_deys = delta.days
            #bp()
            #_logger.debug("self.my_state_control: %s",project_task["my_state_control"])
            #_logger.debug("Duration: %s",delta_deys)
            if not project_task["my_state_control"]:

                if delta_deys <= 0:
                    my_state = '0 Today'
                elif delta_deys == 1:
                    my_state = '1 Tomorrow'
                elif delta_deys > 1:
                    my_state = '2 Coming Days'

                project_task.write({'my_state_id': my_state})
