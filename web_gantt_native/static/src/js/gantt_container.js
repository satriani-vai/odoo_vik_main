odoo.define('web_gantt_native.GanttContainer', function (require) {
"use strict";

var core = require('web.core');
var formats = require('web.formats');
var Model = require('web.Model');
var time = require('web.time');
var View = require('web.View');
var form_common = require('web.form_common');
var Dialog = require('web.Dialog');

//var GanttAPSViewItem = require('web_gantt_native.Item');
//var GanttAPSViewDays = require('web_gantt_native.Days');
//var GanttAPSViewElement = require('web_gantt_native.Element');
var GanttTimeLineHead = require('web_gantt_native.TimeLineHead');
var GanttListItem =     require('web_gantt_native.Item');
var GanttTimeLineData = require('web_gantt_native.TimeLineData');


var _t = core._t;
var _lt = core._lt;
var QWeb = core.qweb;



var GanttContainer = View.extend({
    display_name: _lt('Gantt APS'),
    icon: 'fa-tasks',
    template: 'GanttContainerView',
    view_type: 'ganttaps',

    events: {
      'mousedown .task-gantt-gutter': 'GutterMouseDown',
      'click .task-gantt-zoom-in': 'ZoomInClick',
      'click .task-gantt-zoom-out': 'ZoomOutClick',
      'click .task-gantt-today': 'ClickToday',

      'mouseover  .task-gantt-item, .task-gantt-timeline-row'     :'HandleHoverOver',
      'mouseout   .task-gantt-item, .task-gantt-timeline-row'     :'HandleHoverOut',

      'mousedown .task-gantt-bar-plan': 'BarClick',





    },

    custom_events: {
         'item_record_open': 'open_record',
         'item_record_edit': 'edit_record',
         'item_reload': 'do_reload',
         'focus_today' : 'focus_today',

     },

    defaults_ttt: {
                order: 0,
                name: undefined,
                description: undefined,
                startDate: undefined,
                endDate: undefined,
                slackEndDate: undefined,
                type: undefined,
                percentageDone: undefined,
                hoursExpected: undefined,
                resources: undefined,
                predecessors: undefined,
                icons: undefined
            },

     fieldNames : {
            name: "Error Name",
            resources: "Error Resources",
            percentageDone: "Error Status",
            estimatedHours: "Error Estimate Hours"
        },



    init: function() {
        var self = this;
        this._super.apply(this, arguments);

        this.has_been_loaded = $.Deferred();
        this.chart_id = _.uniqueId();
        this.last_data = null;
        this.scroll_today = 0;
        this.counter = 0;
        this.widgets = [];
        this.monthNames = [ "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December" ];

        this.mandatoryFields = ['id', 'name', 'startDate'];
        this.options = "month";
        this.gutterClientX  = 0;// how add need info
        this.gutterOffset = 300;
        this.gutterOffsetX = 2;
        this.timeline_width = undefined;
        this.timeScale = undefined;
        this.timePrimary =  [] ;
        this.timeSecondary =   [] ;
        this.timeType = undefined;
        this.gantt_timeline_head_widget = undefined;
        this.gantt_timeline_data_widget = [];
        this.pxScaleUTC = undefined;
        this.firstDayScale = undefined;
        this.rows_to_gantt = undefined;
        this.timeScaleUTC = undefined;

        //this.BarMovieX = undefined;
        this.BarMovieRecord_id = undefined;
        this.BarClickDiffX = undefined;
        this.BarClickX = undefined;

        this.BarRecord= undefined;

        this.BarClickDown = false;

        this.BarWidth = undefined;

        this.ABarWidth = undefined;
        this.ABarLeft = undefined;




    },

    normalizeGutterOffset: function(offset) {
	    var minOffset = 2;
	    var maxOffset = $('.gantt-container').width() - 100;
	    return Math.min(Math.max(offset, minOffset), maxOffset > minOffset ? maxOffset : minOffset);
    },





    //--0--1 Load First
     view_loading: function(r) {
        return this.load_gantt(r);
    },

    //--0--2 Load First
    load_gantt: function(fields_view_get, fields_get) {
        var self = this;
        this.fields_view = fields_view_get;



        this.$el.addClass(this.fields_view.arch.attrs['class']);
        return self.alive(new Model(this.dataset.model)
            .call('fields_get')).then(function (fields) {
                self.fields = fields;
                self.has_been_loaded.resolve();
            });
    },

    //---1---//
    do_search: function (domains, contexts, group_bys, options) {
        var self = this;
        self.options = options || 'all';
        self.last_domains = domains;
        self.last_contexts = contexts;
        self.last_group_bys = group_bys;
        self.date_start = null;
        self.date_stop = null;

        var n_group_bys = [];

        // select the group by - we can select gropu from attribute where XML
        //
       //if (this.fields_view.arch.attrs.default_group_by) {
        //    n_group_bys = this.fields_view.arch.attrs.default_group_by.split(',');
       // }

        if (group_bys.length) {
            n_group_bys = group_bys;
        }
        // gather the fields to get
        var fields = _.compact(_.map(["date_start", "date_delay", "date_stop"], function(key) {
            self.date_start = self.fields_view.arch.attrs['date_start'];
            self.date_stop = self.fields_view.arch.attrs['date_stop'];
            return self.fields_view.arch.attrs[key] || '';
        }));
        fields = _.uniq(fields.concat(n_group_bys));
        if ($.inArray('user_id', fields) == -1) {
            fields.push('user_id')
        }
        //my fields to get
        fields.push('pl_percentage_done')
        fields.push('pl_planned_hours')

        // Options wise view loading [Year, Month, Week]

        if (self.options == 'all') {
            domains = domains;
        }

        return $.when(this.has_been_loaded).then(function() {
            return self.dataset.read_slice(fields, {
                domain: domains,
                context: contexts
            }).then(function(data) {
                if (data.length) {
                    return self.on_data_loaded(data, n_group_bys);
                } else {
                    return alert('No data found...');
                }
            });
        });


    },


    //--2--//
    on_data_loaded: function(tasks, group_bys) {
        var self = this;
        var ids = _.pluck(tasks, "id");
        return this.dataset.name_get(ids).then(function(names) {
            var ntasks = _.map(tasks, function(task) {
                return _.extend({__name: _.detect(names, function(name) { return name[0] == task.id; })[1]}, task);
            });
            return self.gantt_render(ntasks, group_bys);

        });
    },


    on_data_loaded_2: function(tasks, group_bys) {
        var self = this;
        //prevent more that 1 group by
     //   if (group_bys.length > 0) {
     //       group_bys = [group_bys[0]];
     //   }
        // if there is no group by, simulate it
        if (group_bys.length == 0) {
            group_bys = ["_pseudo_group_by"];
            _.each(tasks, function(el) {
                el._pseudo_group_by = "Gantt View";
            });
            this.fields._pseudo_group_by = {type: "string"};
        }

        // get the groups
        var split_groups = function(tasks, group_bys) {
            if (group_bys.length === 0)
                return tasks;
            var sp_groups = [];
            _.each(tasks, function(task) {
                var group_name = task[_.first(group_bys)];
                var group = _.find(sp_groups, function(group) { return _.isEqual(group.name, group_name); });
                if (group === undefined) {
                    group = {name:group_name, tasks: [], __is_group: true};
                   sp_groups.push(group);
                }
                group.tasks.push(task);
            });
            _.each(sp_groups, function(group) {
                group.tasks = split_groups(group.tasks, _.rest(group_bys));
            });
            return sp_groups;
        }
        var groups = split_groups(tasks, group_bys);
        // track ids of task items for context menu
        var task_ids = {};
        var assign_to = [];
        // creation of the chart
        var generate_task_info = function(task, plevel) {
            var level = plevel || 0;
            if (task.__is_group) {
                assign_to = task.user_id;
                var task_infos = _.compact(_.map(task.tasks, function(sub_task) {
                    return generate_task_info(sub_task, level + 1);
                }));
                if (task_infos.length == 0)
                    return;
                var group_name = openerp.web.format_value(task.name, self.fields[group_bys[level]]);
                return {
                    is_group: task.__is_group,
                    group_info:task.name,
                    group_field: group_bys[level],
                    child_task:task_infos,
                    task_name:group_name,
                    level:level,
                };
            } else {
                assign_to = task.user_id;
                var task_name = task.__name;
                var task_time = task.pl_percentage_done;
                var task_effective_hours = task.pl_planned_hours;


                var task_start = openerp.web.auto_str_to_date(task[self.fields_view.arch.attrs.date_start]);
                if (!task_start)
                    return;
                var task_stop;
                if (self.fields_view.arch.attrs.date_stop) {
                    task_stop = openerp.web.auto_str_to_date(task[self.fields_view.arch.attrs.date_stop]);
                    if (!task_stop)
                        return;
                } else { // we assume date_duration is defined
                    var tmp = openerp.web.format_value(task[self.fields_view.arch.attrs.date_delay],
                        self.fields[self.fields_view.arch.attrs.date_delay]);
                    if (!tmp)
                        return;
                    task_stop = task_start.clone().addMilliseconds(tmp * 60 * 60 * 1000);
                }
                return {
                    id:task.id,
                    task_name: task_name,
                    task_start: task_start,
                    task_stop: task_stop,
                    level:level,
                    assign_to:assign_to,
                    time: task_time,
                    effective_hours: task_effective_hours,

                };
            }
        }

       //generate projects info from groupby
        var projects = _.map(groups, function(result) {
           return generate_task_info(result, 0);
       });

        self.projects = projects;
        return projects;
    },




    gantt_render: function(tasks, group_bys){
        var self = this;

        var task_sources =  this.on_data_loaded_2(tasks, group_bys);

        ///////////////////
        var gantt_attrs = this.fields_view.arch.attrs; //determinate in xml
        var fieldNames_keys = _.keys(this.fieldNames); //what determinate fo table header


        //get fields id from xml for headers
        var fields_id = [];
        fieldNames_keys.forEach(function(entry){
            _.each(gantt_attrs,function(field, options){
                if (options == entry){
                    fields_id.push(field);
                }
            });
        });


        // Determine when the gantt chart starts and finishes

        var  dateIterator;
        var  today = new Date();

        var model_start_date = "2015-12-01T08:00:00.000Z";
        var model_end_date = "2016-04-26T08:00:00.000Z";


        var startDate = new Date(model_start_date); //to-do detect from switch
        var endDate = new Date(model_end_date);

        var  firstDay = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        var  lastDay1 = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
        var  lastDay = new Date(lastDay1.getFullYear(), lastDay1.getMonth() + 1, 1);


        var  monthRow = [];
        var  dayRow = [];

        var  currMonth = 0;
        var  currMonthSize = 0;
        var  currMonthEl = {};




        dateIterator = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        currMonth = dateIterator.getMonth();

                while (dateIterator <= lastDay) {


                    if (dateIterator.getMonth() !== currMonth) {

                        var   curect_year = new Date(dateIterator.getFullYear(), dateIterator.getMonth()-1, 1);

                        currMonthEl = {
                            colspan: currMonthSize,
                            month_name: this.monthNames[currMonth],
                            year_name: curect_year.getFullYear(),

                        };

                        monthRow.push(currMonthEl);

                        currMonth = dateIterator.getMonth();
                        currMonthSize = 0;


                    }

                    var el = {};

                    var iter_date = dateIterator.getDate();
                    var iter_dateString = dateIterator.toDateString();
                    var day_today = '';
                    var weekend = '';

                    if (today.toDateString() === iter_dateString) {
                        day_today = 'day-today';
                    }
                    if (dateIterator.getDay() === 6 || dateIterator.getDay() === 0) {
                        weekend = 'weekend';
                    }

                    var class_date = dateIterator.getDate() + "-" + dateIterator.getMonth() + "-" + dateIterator.getFullYear();
                    el = {

                        iter_date: iter_date,
                        iter_dateString: iter_dateString,
                        class_date: class_date,
                        day_today: day_today,
                        weekend: weekend,
                        colspan: currMonthSize,
                        month_name: this.monthNames[dateIterator.getMonth()],
                        year_name: dateIterator.getFullYear(),
                    };


                    if (dateIterator < lastDay) {

                        dayRow.push(el);
                    }


                    dateIterator.setDate(dateIterator.getDate() + 1);
                    currMonthSize = currMonthSize + 1;
                }


        var time_month =  monthRow ;
        var time_day =   dayRow ;

        this.timePrimary =  monthRow ;
        this.timeSecondary =   dayRow ;

        if ( this.timeScale == undefined || this.timeType == undefined )
        {
            this.timeScale = 24; //px
            this.timeType = 'month_day';
        }


         if ( this.timeline_width == undefined )
         {
             this.timeline_width = this.timeScale*time_day.length;
         }


        var firstDayScale = firstDay.getTime(); //nachalo setki
        var lastDayScale = lastDay.getTime(); //konech setki

        this.timeScaleUTC = lastDayScale - firstDayScale; // raznica vremeni


        this.firstDayScale = firstDayScale;

        this.pxScaleUTC = Math.round(this.timeScaleUTC / this.timeline_width); // skolko vremeni v odnom px






        this.$el.html(QWeb.render('GanttContainerView.main', {
                    'title': "My Table",
                    'widget': self,
   //                 'fields': this.fields_view.fields, //list of fields from model
   //                 'fields_view': fields_id,
                      'display_name': this.display_name,
                      'timeline_width' : this.timeline_width,
   //                 'fields_months': monthRow, //list of fields from model
   //                 'fields_days': dayRow, //list of fields from model

                }));

        self.AddTimeLineHead(this.timeScale, this.timeType, time_month, time_day );







        var rows_to_gantt = [];

            var generate_flat_gantt = function(value) {

                if (value.is_group) {

                    rows_to_gantt.push({

                        id: value.id,
                        is_group: value.is_group,
                        group_id: value.group_info,
                        level: value.level,
                        value_name: value.task_name,

                    });

                }
                else {
                    rows_to_gantt.push({

                        id: value.id,
                        group_id: value.group_info,
                        level: value.level,
                        value_name: value.task_name,
                        assign_to: value.assign_to[1],
                        time: value.time,
                        effective_hours: value.effective_hours,
                        task_start: value.task_start,
                        task_stop: value.task_stop,

                    });

                }

                var task_infos = _.map(value.child_task, function(sub_task) {
                    generate_flat_gantt(sub_task);
                });

                if (task_infos.length != 0) {
                    return 5;
                }

            }


        var flat_gantt = _.map(self.projects, function(result) {
           return generate_flat_gantt(result);
       });

        this.rows_to_gantt = rows_to_gantt;



    var ddd = "dfd";

     /// task-gantt-items   GanttListItem

        _.map(rows_to_gantt, function(record){

            var row = new GanttListItem(self, record);
            row.appendTo(self.$('.task-gantt-items'));
            self.widgets.push(row);

            }
        );


    self.AddTimeLineData(this.timeScale, this.timeType, rows_to_gantt);




                //var task_left = Math.round((event.target.record.task_start.getTime()-this.firstDayScale) / this.pxScaleUTC);
        var task_left = 1500;
        $('.task-gantt-timeline').animate( { scrollLeft: task_left-500 }, 1);

    },


    AddTimeLineHead: function(timeScale, time_type, time_month, time_day ) {

        var self = this;
        if (this.gantt_timeline_head_widget){

            this.gantt_timeline_head_widget.destroy();
        }

        this.gantt_timeline_head_widget = new GanttTimeLineHead(self, timeScale, time_type, time_month, time_day  );
        this.gantt_timeline_head_widget.appendTo(self.$('.task-gantt-timeline-inner'));


    },


     AddTimeLineData: function(timeScale, time_type, rows_to_gantt ) {

         var self = this;
         if (this.gantt_timeline_data_widget.length > 0){

            this.gantt_timeline_data_widget = [];
           //  _.each(this.gantt_timeline_data_widget, function(data_widget) {

           //      data_widget.destroy();

           //  })

        }


         _.map(rows_to_gantt, function (record) {

             var gantt_time_line_data = new GanttTimeLineData(self, timeScale, time_type, record);

             gantt_time_line_data.appendTo(self.$('.task-gantt-timeline-data'));
             self.gantt_timeline_data_widget.push(gantt_time_line_data);
         });




     },






    ZoomInClick: function(event) {


        //this.timePrimary =  monthRow ;
        //this.timeSecondary =   dayRow ;

        this.timeType = 'day_hour';

        this.timeScale = 60; //px

        this.timeline_width = this.timeScale*this.timeSecondary.length*6; // min otrzok 60 - eto 4 4asa. v sutkah 6 otrezkov
        this.pxScaleUTC = Math.round(this.timeScaleUTC / this.timeline_width); // skolko vremeni v odnom px

        $('.task-gantt-timeline-inner').width(this.timeline_width);

        this.AddTimeLineHead(this.timeScale, this.timeType, this.timePrimary, this.timeSecondary );

        this.AddTimeLineData(this.timeScale, this.timeType, this.rows_to_gantt);


    },

    ZoomOutClick: function(event) {

        this.timeScale = 24; //px

        this.timeType = 'month_day';

        this.timeline_width = this.timeScale*this.timeSecondary.length;
        this.pxScaleUTC = Math.round(this.timeScaleUTC / this.timeline_width); // skolko vremeni v odnom px

        $('.task-gantt-timeline-inner').width(this.timeline_width);

        this.AddTimeLineHead(this.timeScale, this.timeType, this.timePrimary, this.timeSecondary );
        this.AddTimeLineData(this.timeScale, this.timeType, this.rows_to_gantt);


    },

//BarChangeStart


//BarMouseDown
    BarClick: function(event){

         if ( $(event.target).hasClass('task-gantt-bar-plan') ) {


                this.$el.delegate('.task-gantt-timeline-data', 'mouseup', this.proxy('BarMouseUp'));
                this.$el.delegate('.task-gantt-timeline-data', 'mousemove', this.proxy('BarMouseMove'));

                    this.BarClickDiffX = event.target.offsetLeft - event.clientX;
                    this.BarClickX = event.clientX;
                    this.BarClickDown = true;
                    this.BarRecord = event.currentTarget.record;
           }

        if ( $(event.target).hasClass('task-gantt-bar-plan-start') ) {


                this.$el.delegate('.task-gantt-timeline-data', 'mouseup', this.proxy('BarChangeStartUp'));
                this.$el.delegate('.task-gantt-timeline-data', 'mousemove', this.proxy('BarChangeStartMove'));


                    this.BarRecord = event.currentTarget.record;
                    this.BarClickDiffX =  event.currentTarget.offsetLeft - event.clientX;
                    this.BarClickX = event.clientX;
                    this.BarWidth = event.currentTarget.offsetWidth;

           }

        if ( $(event.target).hasClass('task-gantt-bar-plan-end') ) {


                this.$el.delegate('.task-gantt-timeline-data', 'mouseup', this.proxy('BarChangeEndUp'));
                this.$el.delegate('.task-gantt-timeline-data', 'mousemove', this.proxy('BarChangeEndMove'));


                    this.BarRecord = event.currentTarget.record;
                    this.BarClickDiffX =  event.currentTarget.offsetWidth - event.clientX;
                    this.BarClickX = event.clientX;

           }

    },


    BarChangeEndUp: function(event) {

        this.$el.undelegate('.task-gantt-timeline-data', 'mousemove');
        this.$el.undelegate('.task-gantt-timeline-data', 'mouseup');

        // var offsetLeft = $(".task-gantt-bar-plan-" + this.BarRecord.id + "").offsetLeft;
        // var offsetWidth = $(".task-gantt-bar-plan-" + this.BarRecord.id + "").width();
        var ABarWidth = this.ABarWidth;
        var ABarLeft = this.ABarLeft;

        //var ABarWidth = this.ABarWidth = undefined;
        //var ABarLeft = this.ABarLeft = undefined;

        var timeWidth = (ABarLeft - ABarWidth) * this.pxScaleUTC;

        var data = {};


        var today_dates = new Date(timeWidth);

        data['pl_end_date'] = today_dates;

        if (timeWidth > 0) {

        this.dataset.write(this.BarRecord.id, data, {});

    }
        //this.options
        //this.last_domains
        //this.last_contexts
        //this.last_group_bys

        this.do_search(this.last_domains, this.last_contexts, this.last_group_bys, this.options );

    },


    BarChangeEndMove: function(event){


        var offsetLeft = event.target.offsetParent.offsetLeft;
       // var offsetLeft = $(event.target).parent().offset().left;
        var offsetWidth = event.target.offsetParent.offsetWidth;

        var DiffForMove = this.BarClickX - event.clientX; //raznica mez nazatijem i tekuchej poziciji mishi
        var BarNewPos = offsetWidth  - DiffForMove; //Velichina smechenija bloka.
        var NewBarClickDiffX = offsetWidth - event.clientX; //tekucheje rastojanija mezdu nachalom blok i tekuchem pol mishki
        var Kdiff =  this.BarClickDiffX - NewBarClickDiffX; //Koeficent corekciji dla poderzanija rastojanije meszu nachalom
        //bloka i tekuchem polozenijem mishi.

        //console.debug('Target:',event.target.className);
        //console.debug('offsetLeft:',offsetLeft,'offsetWidth:',offsetWidth, 'BarClickX:', this.BarClickX, 'DiffForMove:', DiffForMove , 'BarClickDiffX:', this.BarClickDiffX);
        //console.debug('BarNewPos:',BarNewPos);
        //console.debug('BarNewPos-Kdiff:',BarNewPos+Kdiff);
        //console.debug('Kdiff:',Kdiff);
        //console.debug('NewBarClickDiffX:',NewBarClickDiffX);

        //Dvigajem tolko tekuchij blok
        if (this.BarRecord.id == event.target.offsetParent.record_id || this.BarRecord.id == event.target.record_id) {

            $(".task-gantt-bar-plan-" + this.BarRecord.id + "").css({"width": BarNewPos+Kdiff+DiffForMove + "px"});
                        this.ABarWidth = offsetWidth;
            this.ABarLeft = offsetLeft;
        }
        else {

            this.BarChangeEndUp();
        }


      return false;


    },


    BarChangeStartUp: function(event){

        this.$el.undelegate('.task-gantt-timeline-data', 'mousemove');
        this.$el.undelegate('.task-gantt-timeline-data', 'mouseup');
    },

    BarChangeStartMove: function(event){

        var gantt_bar = $(".task-gantt-bar-plan-" + this.BarRecord.id + "");
        var offsetLeft = Math.round(gantt_bar.offset().left);

        var NewBarDiff = offsetLeft - event.clientX;
        var Kdiff =  this.BarClickDiffX - NewBarDiff; //Koeficent corekciji dla poderzanija rastojanije meszu nachalom
        var DiffForMove = this.BarClickX - event.clientX; //raznica mez nazatijem i tekuchej poziciji mishi

        //console.debug('offsetLeft:',offsetLeft);
        //console.debug('event.clientX:', event.clientX);
        //console.debug('this.BarClickDiffX:', Kdiff);
        //console.debug('Kdiff:', Kdiff);
        //console.debug('this.BarClickX:', this.BarClickX);
        //console.debug('DiffForMove:', DiffForMove);

        //Dvigajem tolko tekuchij blok
        if (this.BarRecord.id == event.target.offsetParent.record_id) {

            gantt_bar.css({"left": offsetLeft+Kdiff + "px"});
            gantt_bar.css({"width": this.BarWidth+DiffForMove + "px"});
        }
        else {
            this.BarChangeStartUp();
        }


      return false;


    },




    BarMouseUp: function(event){

        this.$el.undelegate('.task-gantt-timeline-data', 'mousemove');
        this.$el.undelegate('.task-gantt-timeline-data', 'mouseup');
        this.BarMovieRecord_id = undefined;
        this.BarClickDiffX = undefined;
        this.BarClickX = undefined;
        this.BarClickDown = false;
    },

    BarMouseMove: function(event){

        var offsetLeft = event.target.offsetLeft;

        var DiffForMove = this.BarClickX - event.clientX; //raznica mez nazatijem i tekuchej poziciji mishi
        var BarNewPos = offsetLeft  - DiffForMove; //Velichina smechenija bloka.
        var NewBarClickDiffX = BarNewPos - event.clientX; //tekucheje rastojanija mezdu nachalom blok i tekuchem pol mishki
        var Kdiff =  this.BarClickDiffX - NewBarClickDiffX; //Koeficent corekciji dla poderzanija rastojanije meszu nachalom
        //bloka i tekuchem polozenijem mishi.

        //console.debug('ClickDiff:',this.BarClickDiffX, 'ClickX:', this.BarClickX);
        //console.debug('MouseCurrentPos:',DiffForMove);
        //console.debug('BarCurrentPos:',offsetLeft);
        //console.debug('BarNewPos:',BarNewPos);
        //console.debug('NewBarClickDiffX:',NewBarClickDiffX);
        //console.debug('BarClickDown:',this.BarClickDown);

        //Dvigajem tolko tekuchij blok
        if (this.BarRecord.id == event.target.record_id &&  this.BarClickDown == true ) {
            $(".task-gantt-bar-plan-" + this.BarRecord.id + "").css({"left": BarNewPos+Kdiff + "px"});
        }
        else {
            this.BarMouseUp();
        }
        return false;

    },



//Gutter Movie

    GutterMouseDown: function(event){

        this.$el.delegate('.task-gantt', 'mouseup', this.proxy('GutterMouseUp'));
        this.$el.delegate('.task-gantt', 'mousemove', this.proxy('GutterMouseMove'));
        this.gutterClientX = event.clientX;
    },


    GutterMouseUp: function(event){

        this.$el.undelegate('.task-gantt', 'mouseup');
        this.$el.undelegate('.task-gantt', 'mousemove');
    },

    GutterMouseMove: function(event){

        var parentOffset = $('.task-gantt-gutter').parent().offset();
        var pxc = this.gutterOffsetX + (event.clientX - parentOffset.left);
        $('.task-gantt-list').width(pxc);
        this.gutterOffset = pxc;
    },



    open_record: function (event, options) {

        if (this.dataset.select_id(event.data.id)) {

            this.do_switch_view('form', null, options); //, null, { mode: "edit" });

        } else {
            this.do_warn("Kanban: could not find id#" + event.data.id);
        }
    },

    edit_record: function (event) {
        this.open_record(event, {mode: 'edit'});
    },


//Today Focus
    ClickToday: function (event) {

        var today = new Date();
        var today_left = Math.round((today.getTime()-this.firstDayScale) / this.pxScaleUTC);
        $('.task-gantt-timeline').animate( { scrollLeft: today_left-500 }, 1000);

    },

    focus_today: function (event) {

        var task_left = Math.round((event.target.record.task_start.getTime()-this.firstDayScale) / this.pxScaleUTC);
        $('.task-gantt-timeline').animate( { scrollLeft: task_left-500 }, 1000);

    },


    HandleHoverOver: function(ev) {


        //   if (this.$el.hasClass('oe_kanban_global_click') || this.$el.hasClass('oe_kanban_global_click_edit')) {
        ///       this.$el.on('click', this.proxy('on_global_click'));
        //   }
        /// ev.target.id
        //ev.target.id

        if (ev.target.allowRowHover)
        {

       /// var $el = $(ev.target);

            var rowdata = '#task-gantt-timeline-row-'+ev.target['data-id'];
            var rowitem = '#task-gantt-item-'+ev.target['data-id'];

       /// $el.addClass("task-gantt-item-hover");
            $(rowdata).addClass("task-gantt-timeline-row-hover");
            $(rowitem).addClass("task-gantt-item-hover");

        }

       // console.debug(ev);
      //  return false;
    },


    HandleHoverOut: function(ev) {


             //   if (this.$el.hasClass('oe_kanban_global_click') || this.$el.hasClass('oe_kanban_global_click_edit')) {
     ///       this.$el.on('click', this.proxy('on_global_click'));
     //   }
       /// ev.target.id
        //ev.target.id
        //var $el = $(ev.target);
        var rowdata = '#task-gantt-timeline-row-'+ev.target['data-id'];
        var rowitem = '#task-gantt-item-'+ev.target['data-id'];

        $(rowdata).removeClass("task-gantt-timeline-row-hover");
        $(rowitem).removeClass("task-gantt-item-hover");
        //$el.removeClass("task-gantt-item-hover");

       // ev.target.addClass("task-gantt-item-tree-hover");
	  ///  BX.addClass(this.layout.row, "task-gantt-timeline-row-hover");



       // console.debug(ev);
        //return false;
    }







});

core.view_registry.add('ganttaps', GanttContainer);

return GanttContainer;
});
