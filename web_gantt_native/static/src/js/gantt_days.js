odoo.define('web_gantt_native.Days', function (require) {
"use strict";

var config = require('web.config');
var core = require('web.core');
var Dialog = require('web.Dialog');
var form_common = require('web.form_common');
var Widget = require('web.Widget');

var _lt = core._lt;
var _t = core._t;
var QWeb = core.qweb;


var GanttAPSViewDays = Widget.extend({
    template: "GanttAPSView.days",



    init: function(parent, record, days) {
        this._super(parent);

        this.record = record;
        this.days = days;

        this.record_id = this.record['id']

    },

//        init_content: function (record) {
//        var self = this;
 //       this.id = record.id;

 //       var qweb_context = {
 //           record: this.record,
  //          widget: this,
  //          user_context: session.user_context,

   //     };

        //this.content = this.qweb.render('kanban-box', qweb_context);
  ////  },











    start: function(){

      var self = this;



            $.fn.append.apply(this.$el, _(this.days).map(function (day) {

                var add_cell = $('<td></td>');

                var div_cell = $('<div class="cell"></div>');
                div_cell.addClass(day.class_date);

                if (day.weekend){

                    add_cell.addClass(day.weekend);

                }

                if (day.day_today){

                    div_cell.append($('<div id="today" tabindex="1" class="cell day-today"></div>'));

                }

                add_cell.append(div_cell);


                return  add_cell;


             }));





//        var name = self.record['value_name'];
//        var resources = self.record['assign_to'];
//        var percentageDone = self.record['time'] || '';
//        var estimatedHours = self.record['effective_hours'] || '';
//        var level = self.record['level'];


       // this.$el.addClass('treegrid-' + this.counter + '');
       // this.$el.addClass('treegrid-parent-' + parent + '');


//        var indent = '';
//        if (level == 1){

//            indent = '<span class="treegrid-indent"></span><span class="treegrid-expander"></span>';
//        }

//        this.$el.append('<td id="data_name"  class="oe_kanban_global_click_edit">'+indent+''+name+'</td>');

            //.on('click', this.proxy('on_global_click'));

//        this.$el.append('<td>'+resources+'</td>');
//        this.$el.append('<td>'+percentageDone+'</td>');
//        this.$el.append('<td>'+estimatedHours+'</td>');


    },

//    renderElement: function () {
//        this._super();

     //   this.$el.data('record', this);

//        this.$el.on('click', this.proxy('on_global_click'));

     //   if (this.$el.hasClass('oe_kanban_global_click') || this.$el.hasClass('oe_kanban_global_click_edit')) {
     ///       this.$el.on('click', this.proxy('on_global_click'));
     //   }
//    },



//    on_global_click: function (ev) {

//        if (!ev.isTrigger) { //human detect
//            var trigger = true;

//            if (trigger) {
//                this.on_card_clicked(ev);
//            }
//        }
//    },



 //   on_card_clicked: function() {

 //       this.trigger_up('kanban_record_edit', {id: this.record.id});

 //   },




});

return GanttAPSViewDays;

});