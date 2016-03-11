# -*- coding: utf-8 -*-

{
    'name' : 'F - Statement Control',
    'version' : '8.0.0.2',
    'author' : 'Viktor Vorobjov',
    'category': 'Project Management',
    'description' : """

         task
    """,
    'website' : 'http://straga.github.io',
    'depends' : ['base', 'web_readonly_bypass'
],
    'data': [
        'security/security.xml',
        'security/ir.model.access.csv',
        'views/statement_control_view.xml',
        'views/res_partner_view.xml'


    ],
    'installable': True,
}

