# -*- coding: utf-8 -*-


{
    'name' : 'Odoo Project MY Task',
    'version' : '9.0.0.1',
    'author' : 'Viktor Vorobjov',
    'category': 'Calendar',
    'description' : """

        Project MY Task


    
    """,
    'website' : 'http://straga.github.io',
    'depends' : ['base_setup','base','web', 'project' ],
    "external_dependencies": {

    },
    'data': [
        'views/include_templates.xml',
        'views/project_task_view.xml',


    ],
    'auto_install': False,
    'installable': True,
}