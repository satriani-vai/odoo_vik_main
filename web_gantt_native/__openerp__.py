{
    'name': 'Web Native Chart',
    'category': 'Hidden',
    'description': """
		Odoo Web Native Gantt chart view.
		

	""",
    'version': '2.0',
    'depends': ['web'],
    'data' : [
        'views/web_gantt_src.xml',
    ],
    'qweb': [
        'static/src/xml/*.xml',
    ],
    'auto_install': False,

}
