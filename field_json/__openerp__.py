# -*- coding: utf-8 -*-


{
    'name': 'Json Field Widget',
    'version': '1.0',
    'category': 'Stuff',
    'sequence': 6,
    'summary': 'Json Field Widget',
    'description': """

=======================

This module adds - Json Field Widget:
How it use: widget="jsonurl"
<field name="demander" string="Demander" widget="jsonurl" attrs="{'readonly': 1}"/>

demander = fields.Char('UoM', compute='_compute_demander')

 data[procur_id] = {

                                            "uid_id": uid_id,
                                            "uid_model": uid_model,
                                            "uid_name": uid_name,
                                            "procur_id" : procur_id,
                                            "procur_name": procur_name,
                                            "procur_qty":  procur_qty,
                                            "uid_partner_id" : uid_partner_id
            }

        json_str = json.dumps(data)
        self.demander = json_str


""",
    'author': 'Viktor Vorobjov',
    'depends': [],
    'website': 'http//straga.github.io',
    'data': [
        'views/templates.xml',


    ],
    'qweb':[

        'static/src/xml/json.xml',
    ],
    'installable': True,
    'auto_install': False,
}


