odoo.define('web_gantt_native.TimeLineData', function (require) {
"use strict";

var config = require('web.config');
var core = require('web.core');
var Dialog = require('web.Dialog');
var form_common = require('web.form_common');
var Widget = require('web.Widget');

var _lt = core._lt;
var _t = core._t;
var QWeb = core.qweb;


var GanttTimeLineData = Widget.extend({
    template: "GanttTimeLine.data",

   // 'mouseover  .task-gantt-item, .task-gantt-timeline-row'     :'handleHoverOver',
   // 'mouseout   .task-gantt-item, .task-gantt-timeline-row'     :'handleHoverOut',

    init: function(parent, timeScale, timeType, record) {
        this._super(parent);
        this.parent = parent;
        this.record = record;
        this.record_id = this.record['id']

    },


    start: function(){

        var self = this;

        var id = this.record_id;

        if (!this.record.is_group) {

            var gantt_bar = $('<div class="task-gantt-bar-plan"></div>');

            var bar_left = Math.round((this.record.task_start.getTime()-this.parent.firstDayScale) / this.parent.pxScaleUTC);

            var task_start = this.record.task_start.getTime();
            var task_stop = this.record.task_stop.getTime();

            var task_time_len = task_stop - task_start;

            var bar_width = Math.round(task_time_len / this.parent.pxScaleUTC);


            gantt_bar.css({"left": bar_left + "px"});
            gantt_bar.css({"width": bar_width + "px"});

            var bar_point_start = $('<div class="task-gantt-point task-gantt-point-start"></div>');
            var bar_point_end = $('<div class="task-gantt-point task-gantt-point-end"></div>');

            var bar_start = $('<div class="task-gantt-bar-plan-start"></div>');
            var bar_end = $('<div class="task-gantt-bar-plan-end"></div>');

            gantt_bar.append(bar_start);
            gantt_bar.append(bar_end);
            gantt_bar.append(bar_point_start);
            gantt_bar.append(bar_point_end);
          //  task-gantt-timeline-row-2

            if (id != undefined) {

            this.$el.prop('id', "task-gantt-timeline-row-" + id + "");
            this.$el.prop('data-id', id);
            this.$el.prop('allowRowHover', true);
            this.$el.prop('record', this.record);

                this.$el.prop('record_id', id);

                gantt_bar.prop('record_id', id);
                gantt_bar.prop('record', this.record);

                gantt_bar.addClass("task-gantt-bar-plan-" + id + "")




        }




            this.$el.append(gantt_bar);

        }


    },


});

return GanttTimeLineData;

});