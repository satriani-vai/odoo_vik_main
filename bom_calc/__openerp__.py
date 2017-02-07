# -*- coding: utf-8 -*-


{
    'name': 'MRP bom calc',
    'version': '1.0',
    'category': 'mrp',
    'sequence': 6,
    'summary': 'MRP bom calc',
    'description': """

=======================

This module adds ... to the MRP Bom :


""",
    'author': 'Viktor Vorobjov',
    'depends': ['stock','mrp'],

    'license': 'LGPL-3',
    'website': 'https://straga.github.io',
    'support': 'vostraga@gmail.com',
    
    'data': [
        'bom_calc_view.xml',
       
    ],
    'qweb':[


    ],
    'installable': True,
    'auto_install': False,
}

