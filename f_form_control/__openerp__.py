# -*- coding: utf-8 -*-

{
    'name' : 'Form Control',
    'version' : '8.0.0.2',

    'license': 'LGPL-3',
    'website': 'https://straga.github.io',
    'support': 'vostraga@gmail.com',

    'category': 'Project Management',
    'description' : """

         task
    """,

    'depends' : ['base',
],
    'data': [
        'security/security.xml',
        'security/ir.model.access.csv',
        'form_control_view.xml',
        'res_partner_view.xml',


    ],
    'installable': True,
}

