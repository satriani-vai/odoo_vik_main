# -*- coding: utf-8 -*-


{
    'name': 'Service Rent',
    'version': '1.0',
    'category': 'mrp',
    'sequence': 6,
    'summary': 'Service Rent',
    'description': """

=======================

This module adds ... to the ... :


""",
    'author': 'Viktor Vorobjov',
    'depends': ['stock','sale'],
    'website': 'http//straga.github.io',
    'data': [

        'data/rent_sequence.xml',
        'data/service_data.xml',
        'views/product_view.xml',
        'views/service_rent_view.xml',
        'views/service_location_view.xml'
    ],
    'qweb':[


    ],
    'installable': True,
    'auto_install': False,
}

