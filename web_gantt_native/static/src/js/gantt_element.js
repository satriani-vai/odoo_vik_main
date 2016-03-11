odoo.define('web_gantt_native.Element', function (require) {
"use strict";

var config = require('web.config');
var core = require('web.core');
var Dialog = require('web.Dialog');
var form_common = require('web.form_common');
var Widget = require('web.Widget');

var _lt = core._lt;
var _t = core._t;
var QWeb = core.qweb;


var GanttAPSViewElement = Widget.extend({
    template: "GanttAPSView.element",



    init: function(parent, record) {
        this._super(parent);

        this.record = record;

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
        var el = self.$el;
        //this.$el = $(this.el);

 //       // stuff you want to make after the rendering, `this.$el` holds a correct value
 //*         this.$el.find(".my_button").click(/* an example of event binding * /);
 //*
 //*         // if you have some asynchronous operations, it's a good idea to return
 //*         // a promise in start()
 //*         var promise = this.rpc(...);
 //*         return promise;
                   //         task_start: value.task_start,
                 //   task_stop: value.task_stop,


        var gantt_element = $('<div class="gantt-element" ></div>');
        var record = this.record;
        var task_start = record.task_start;
        var task_stop = record.task_stop;
        var percentageDone = record.time;


        var noOfDaysBeforeRound = (task_stop.getTime() - task_start.getTime()) / (24 * 60 * 60 * 1000);

        if (noOfDaysBeforeRound > 0 && noOfDaysBeforeRound < 1)
        {
            noOfDaysBeforeRound = 1

        }

        var noOfDays = Math.round(noOfDaysBeforeRound);



      //  var dayFromStart = Math.round((model.get("startDate").getTime() - this.options.firstDate.getTime()) / (24 * 60 * 60 * 1000));
        //this.$el.css({ width: noOfDays * 23 - 3 });
       // gantt_cell.css({ width: noOfDays * 23 - 3 });
        gantt_element.css({ width: noOfDays * 23 - 3 });
//style="width: 273px; border-bottom-color: rgb(204, 0, 0);"
        //'style'
//style="width: 273px; border-bottom-color: rgb(204, 0, 0);"
     //   gantt_cell.removeAttr
       /// $("#YourElementID").css({ display: "block" });
       /// gantt_cell.addCss

        //var el =   this.$el;

       // var gantt_cell = el.append(gantt_element);

        if (percentageDone && percentageDone > 0) {
                    var el_done = $('<div class="done"></div>');
                    el_done.css({ width: percentageDone + "%" });
                    gantt_element.append(el_done, $('<div class="donetext">' + (percentageDone < 100 ? percentageDone + "% done" : "Done") + '</div>'));
                }





        return el.append(gantt_element);






 },

        ///    $.fn.append.apply(this.$el, _(this.days).map(function (day) {

       //         var add_cell = $('<td></td>');

       //         var div_cell = $('<div class="cell"></div>');
       //         div_cell.addClass(day.class_date);

       //         if (day.weekend){

        //            add_cell.addClass(day.weekend);

       //         }

       //         if (day.day_today){

        //            div_cell.append($('<div id="today" tabindex="1" class="cell day-today"></div>'));
//
        //        }

         //       add_cell.append(div_cell);


         //       return  add_cell;




      //       }));





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

return GanttAPSViewElement;

});