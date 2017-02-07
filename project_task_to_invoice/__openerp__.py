# -*- coding: utf-8 -*-

{
    'name': 'Project Task Materials to Invoice Task ',
    'summary': 'Record products over Invoice Tasks in a Task',
    'version': '1.0',
    'category': "Project Management",
    'author': 'Viktor Vorobjov',

    'license': 'LGPL-3',
    'website': 'https://straga.github.io',
    'support': 'vostraga@gmail.com',
    
    'description': """\
It allow ad time spent, material to tasks. After in Invoice Tasks you can put all in Invoice
""",
    'depends': ['project', 'product'],
    'data': [
        'project_view.xml',

    ],
    'installable': True,
}
