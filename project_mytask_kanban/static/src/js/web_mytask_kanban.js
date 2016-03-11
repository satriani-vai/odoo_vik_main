odoo.define('project_mytask_kanban.web_mytask_kanban', function(require) {


    var KanbanView = require('web_kanban.KanbanView');

    Date.prototype.addDays = function(days)
    {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    };


    KanbanView.include({

        add_record_to_column: function (event) {
        var self = this;
        var column = event.target;
        var record = event.data.record;
        var data = {};


        if (this.group_by_field == 'my_state_id')
        {

            var my_state_id = record.values.my_state_id.value;
            var my_start_date = record.values.my_start_date.value;
            var my_state_control = record.values.my_state_control.value;

            var today_date = new Date();
            var tomorrow_date = today_date.addDays(1);
            var comming_date = today_date.addDays(2);


            if (event.target.id == '0 Today'){
                data['my_start_date'] = today_date;
                data['my_state_control'] = '';
            }
            else if (event.target.id == '1 Tomorrow') {
                data['my_start_date'] = tomorrow_date;
                data['my_state_control'] = '';
            }
            else if (event.target.id == '2 Coming Days'){
                data['my_start_date'] = comming_date;
                data['my_state_control'] = '';
            }
            else {
                data['my_state_control'] = event.target.id;
            }


            data[this.group_by_field] = event.target.id;
            this.dataset.write(record.id, data, {}).done(function () {
                if (!self.isDestroyed()) {
                    self.reload_record(record);
                    self.resequence_column(column);
                }
            }).fail(this.do_reload);


        }


        else{

            data[this.group_by_field] = event.target.id;
            this.dataset.write(record.id, data, {}).done(function () {
                if (!self.isDestroyed()) {
                    self.reload_record(record);
                    self.resequence_column(column);
                }
            }).fail(this.do_reload);
        }





        /*

        var no_dragdrop = this.dataset.context['no_dragdrop'];
        if (no_dragdrop) {
             this.do_reload()
        }
        else{

            data[this.group_by_field] = event.target.id;
            this.dataset.write(record.id, data, {}).done(function () {
                if (!self.isDestroyed()) {
                    self.reload_record(record);
                    self.resequence_column(column);
                }
            }).fail(this.do_reload);
        }
        */


        },



    })



});