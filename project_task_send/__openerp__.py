# -*- coding: utf-8 -*-

{
    'name' : 'Project task send',
    'version' : '8.0.0.2',
    
    'author' : 'Viktor Vorobjov',
    'license': 'LGPL-3',
    'website': 'https://straga.github.io',
    'support': 'vostraga@gmail.com',

    'category': 'Project Management',
    'description' : """

        Send task over email. When create task.
        Create email_template
        Send to assignment (get email from user)
        Subject: Customer : Task name
        Body:
            Task Description
            Context.

    """,
   
    'depends' : ['project'],
    'data': [
        'task_send_template.xml',

    ],
    'installable': True,
}

