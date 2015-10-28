# -*- coding: utf-8 -*-

{
    'name' : 'Service Task',
    'version' : '8.0.0.2',
    'author' : 'Viktor Vorobjov',
    'category': 'Project Management',
    'description' : """

         task
    """,
    'website' : 'http://straga.github.io',
    'depends' : ['project'],
    'data': [
        'security/security.xml',
        'security/ir.model.access.csv',
        'task_view.xml',
        'res_partner_view.xml',

    ],
    'installable': True,
}

