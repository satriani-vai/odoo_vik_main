# -*- coding: utf-8 -*-

{
    'name' : 'F - License Control',
    'version' : '8.0.0.2',

    'license': 'LGPL-3',
    'website': 'https://straga.github.io',
    'support': 'vostraga@gmail.com',

    'category': 'Project Management',
    'description' : """

         License Control
    """,
    'depends' : ['base', 'web_readonly_bypass'
],
    'data': [
        'security/security.xml',
        'security/ir.model.access.csv',
        'views/license_control_view.xml',
        'views/res_partner_view.xml'


    ],
    'installable': True,
}

