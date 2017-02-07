##############################################################################
#
#    OpenERP, Open Source Management Solution
# -*- coding: utf-8 -*-
{
    "name" : "Aimax PressForm",
    "version" : "1.0",
    
    "license": "LGPL-3",
    "website": "https://straga.github.io",
    "support": "vostraga@gmail.com",

    "category" : "Generic Modules",
    "depends" : ["product"],
    "init_xml" : [],
    "demo_xml" : [],
    "description": "A module that add PressForm atribute for manufactured product ...",
    "update_xml" : [
        "aimax_pressform_view.xml",
        "aimax_pressform_options_view.xml",
        "aimax_pressform_productsize_view.xml",
        "security/ir.model.access.csv",
        ],
    "active": False,
    "installable": True,
}

