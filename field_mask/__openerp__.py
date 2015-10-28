# -*- coding: utf-8 -*-


{
    'name': 'Char Input Field Mask',
    'version': '1.0',
    'category': 'Stuff',
    'sequence': 6,
    'summary': 'Char Input Field Mask',
    'description': """

=======================

This module adds Char Input Field Mask - Widget:

   mask="+(999)-999-999"  //static mask
   mask="9-a{1,3}9{1,3}" //mask with dynamic syntax

   <field name="business_phone"  placeholder="+(999)-999-99-99" widget="mask" mask="+(999)-999-99-99" /> with placeholder
   <field name="business_phone"  widget="mask" mask="+(999)-999-99-99" /> without placeholder

    link: https://github.com/RobinHerbots/jquery.inputmask

""",
    'author': 'Viktor Vorobjov',
    'depends': [],
    'website': 'http//straga.github.io',
    'data': [
        'views/templates.xml',

    ],
    'qweb':[

        'static/src/xml/mask.xml',
    ],
    'installable': True,
    'auto_install': False,
}


