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

{
    'name': 'Project Task Materials to Invoice Task ',
    'summary': 'Record products over Invoice Tasks in a Task',
    'version': '1.0',
    'category': "Project Management",
    'author': 'Viktor Vorobjov',
    'description': """\
It allow ad time spent, material to tasks. After in Invoice Tasks you can put all in Invoice
""",
    'depends': ['project', 'product'],
    'data': [
        'project_view.xml',

    ],
    'installable': True,
}
