# -*- coding: utf-8 -*-

{
    'name' : 'Odoo Popup Message',
    'version' : '1.0.0',
    'author' : 'Viktor Vorobjov',
    'license': 'LGPL-3',
    'website': 'https://straga.github.io',
    'support': 'vostraga@gmail.com',
    'category': 'Base',
    'description' : """
        Popup message core. Shows message without stop function.
    """,
    'website' : 'http://straga.github.io',
    'images': ['static/description/icon.png'],
    'depends' : ['base_setup'],
    'data': [
        'mpopup.xml',
    ],
    'installable': True,
}

