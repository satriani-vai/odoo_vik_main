
odoo.define('disable_openerp_online', function (require)
{
    "use strict";
    var WebClient = require('web.WebClient');
    // Disabling the lookup of a valid OPW for the dbuuid,
    // resulting in 'Your OpenERP is not supported'
    WebClient.include({

        _ab_location: function(dbuuid) {
        return _.str.sprintf('', dbuuid);
    },

        show_annoucement_bar: function() {}
    });
});
