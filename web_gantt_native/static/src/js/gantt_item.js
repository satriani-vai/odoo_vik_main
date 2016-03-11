odoo.define('web_gantt_native.Item', function (require) {
"use strict";

var config = require('web.config');
var core = require('web.core');
var Dialog = require('web.Dialog');
var form_common = require('web.form_common');
var Widget = require('web.Widget');

var _lt = core._lt;
var _t = core._t;
var QWeb = core.qweb;


var GanttListItem = Widget.extend({
    template: "GanttList.item",



    init: function(parent, record) {
        this._super(parent);

        this.record = record;

    },

    start: function() {

        var self = this;


        var name = self.record['value_name'];
        var resources = self.record['assign_to'] || '';
        var percentageDone = self.record['time'] || '';
        var estimatedHours = self.record['effective_hours'] || '';
        var level = self.record['level'];
        var id = self.record['id'];

        var padding = 33;

        if (level > 0) {

            this.$el.css({'padding-left': padding * level + "px"});
        }

        // id="task-gantt-item-2" .prop('id', 'INSERT ID NAME').

        if (id != undefined) {

            this.$el.prop('id', "task-gantt-item-" + id + "");
            this.$el.prop('data-id', id);
            this.$el.prop('allowRowHover', true);
        }

         if (!this.record.is_group) {
             this.$el.append('<span class="task-gantt-focus"><i class="fa fa-dot-circle-o fa-1x"></i></span>');
         }


        this.$el.append('<span class="task-gantt-item-handle"></span>');
        this.$el.append('<span class="task-gantt-item-name">'+name+'</span>');



    },




    renderElement: function () {
        this._super();

        this.$el.data('record', this);
        this.$el.on('click', this.proxy('on_global_click'));

    },



    on_global_click: function (ev) {

        if (!ev.isTrigger) { //human detect
            var trigger = true;

            if (trigger) {

               //if (ev.target.className == 'gantt-item-name-click-edit') $(event.target) fa-crosshairs

               if ($(ev.target).hasClass("gantt-item-name-click-edit" ))
               {
                   this.trigger_up('item_record_edit', {id: this.record.id});
               }

               if ($(ev.target).hasClass("fa-dot-circle-o")) {
                   this.trigger_up('focus_today', {id: this.record.id});
               }

            }
        }
    },





});

return GanttListItem;

});