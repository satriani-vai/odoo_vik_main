odoo.define('web_gantt_native.TimeLineHead', function (require) {
"use strict";

var config = require('web.config');
var core = require('web.core');
var Dialog = require('web.Dialog');
var form_common = require('web.form_common');
var Widget = require('web.Widget');

var _lt = core._lt;
var _t = core._t;
var QWeb = core.qweb;


var GanttTimeLineHead = Widget.extend({
    template: "GanttTimeLine.head",

    init: function(parent, timeScale, timeType, time_month, time_day) {
        this._super(parent);

        this.timeScale = timeScale;
        this.timeType = timeType;
        this.time_month = time_month;
        this.time_day = time_day;

       // this.record_id = this.record['id']

    },


    start: function(){

        var self = this;
        var el = self.$el;


        var el_scale_primary = el.find('.task-gantt-scale-primary');
        var el_scale_secondary = el.find('.task-gantt-scale-secondary');


        if (this.timeType == 'month_day')
        {

            _.map(this.time_month, function(month){

                var monthScale = self.timeScale*month.colspan;
                var div_cell = $('<span class="task-gantt-top-column"></span>');
                    div_cell.css({ width: monthScale + "px" });
                    div_cell.append($('<span class="task-gantt-scale-month-text">'+month.month_name+' - '+month.year_name+'</span>'));

                return  el_scale_primary.append(div_cell);

                }
            );


            _.map(this.time_day, function(day){

                var div_cell ='';
                //  for (var i = 1; i <= day.length; i++) {

                div_cell = $('<span class="task-gantt-bottom-column">'+day.iter_date+'</span>');
                div_cell.css({ width: self.timeScale + "px" });

                if (day.weekend){
                    div_cell.addClass('task-gantt-weekend-column');
                }

                if (day.day_today){
                    div_cell.addClass('task-gantt-today-column');
                }

                //        }
                return  el_scale_secondary.append(div_cell);


                }
            );

        }

        if (this.timeType == 'day_hour')
        {

            _.map(this.time_day, function(day){

                var monthScale = self.timeScale*6;

                var div_cell = $('<span class="task-gantt-top-column"></span>');
                    div_cell.css({ width: monthScale + "px" });
                    div_cell.append($('<span class="task-gantt-scale-month-text">'+day.iter_date+' - '+day.month_name+' - '+day.year_name+'</span>'));

                return  el_scale_primary.append(div_cell);

                }
            );


            _.map(this.time_day, function(day){

                var scaleHours = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"];


                _.each(scaleHours, function(hour) {
                    var div_cell = '';

                    div_cell = $('<span class="task-gantt-bottom-column">' + hour + '</span>');
                    div_cell.css({width: self.timeScale + "px"});

                    if (day.weekend) {
                        div_cell.addClass('task-gantt-weekend-column');
                    }

                    if (day.day_today) {
                        div_cell.addClass('task-gantt-today-column');
                    }


                    return el_scale_secondary.append(div_cell);
                });









                }
            );




        }








/***

        $.fn.append.apply(el.find('.task-gantt-scale-primary'), _(this.time_month).map(function (month) {

               // var div_cell = $('<div class="task-gantt-top-column" style="width:240px;"></div>');

                var div_cell = $('<span class="task-gantt-top-column"></span>');
                div_cell.css({ width: firstScale + "px" });

                div_cell.append($('<span class="task-gantt-scale-month-text">'+month.month_name+' - '+month.year_name+'</span>'));

                return  div_cell;

        }));



        $.fn.append.apply(el.find('.task-gantt-scale-secondary'), _(this.time_day).map(function (day) {

               // var div_cell = $('<div class="task-gantt-top-column" style="width:240px;"></div>');

                var div_cell ='';

                 for (var i = 1; i <= 6; i++) {

                         div_cell = $('<span class="task-gantt-bottom-column">"0:00"</span>');
                        div_cell.css({ width: this.secondScale + "px" });

                    }






                return  div_cell;

        }));



***/























//        var scale_primary = $('.task-gantt-scale-primary');


   //     el.append(scale_primary);




   //     var scale_secondary = $('<div class="task-gantt-scale-secondaryt" ></div>');



  //      el.append(scale_secondary);


 //       return el;


//            $.fn.append.apply(this.$el, _(this.days).map(function (day) {
//
//                var add_cell = $('<td></td>');
//
//                var div_cell = $('<div class="cell"></div>');
//                div_cell.addClass(day.class_date);

//                if (day.weekend){

//                    add_cell.addClass(day.weekend);

//                }

//                if (day.day_today){

//                    div_cell.append($('<div id="today" tabindex="1" class="cell day-today"></div>'));

//                }

//                add_cell.append(div_cell);


//                return  add_cell;


        //            }));


    },


});

return GanttTimeLineHead;

});