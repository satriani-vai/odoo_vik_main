# -*- coding: utf-8 -*-

{
    'name' : 'F - Sale Tax',
    'version' : '8.0.0.2',
    'author' : 'Viktor Vorobjov',

    'license': 'LGPL-3',
    'website': 'https://straga.github.io',
    'support': 'vostraga@gmail.com',

    'category': 'Project Management',
    'description' : """

        Sale Tax
    """,
   
    'depends' : ['base', 'web_readonly_bypass'
],
    'data': [
        'security/security.xml',
        'security/ir.model.access.csv',
        'views/sale_tax_view.xml',
        'views/res_partner_view.xml'


    ],
    'installable': True,
}

