Ext.define("SmartDateRange", {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.SmartDateRange',
    delimiter: ' 至 ',
    editable:false,
    format:'Y-m-d',
    getDates:function() {
        var val = this.getValue()+'';
		
        if( this.isDateRange(val) ) {
            var dates = val.split(this.delimiter);
            var ndates = [];
            Ext.each(dates,function(v){
                var dp = Date.parse(v);
                if(dp) { ndates.push(dp); }
            });
            return ndates;
        }
        else {
            return [ Date.parse(val) ];
        }
    },
    value: 'today',
    keywords: {
        today: function () {
            var d = new Date();
            d = d.format(this.format);
            return d;
        }
    },
    isDateRange: function (v) {
        if (v === undefined) { v = this.getValue(); }
        return (v.indexOf(this.delimiter) !== -1);
    },
    setValue: function (date) {
        var value = '';

        if (date == '') {
            return false;
        }

        this.value = date;

        if (Ext.isDate(date)) {
            // is a single date
            value = this.formatDate(date);
        }
        else if (Ext.isArray(date) && !Ext.isObject(date)) {
            // multiple dates ([0] start, [1], end)
            if (date.length == 1) {
                value = this.formatDate(date[0]);
            }
            else if (date.length > 1) {
                value = this.formatDate(date[0]) + this.delimiter + this.formatDate(date[1]);
            }
        }
        else if (this.isDateRange(date)) {
            value = date; // pass thru
        }
        else {
            value = this.formatDate(Date.parse(date)); // try a parse (last shot)
        }

        return Ext.form.DateField.superclass.setValue.call(this, value);
    },
    formatDate: function (date) {
        return Ext.isDate(date) ? Ext.Date.format(date,this.format) : date;
    },
    onTriggerClick: function () {
        if (this.disabled) {
            return;
        }
        var me = this;

        var dateToday = Date.parse('today');
        var cdates = me.getDates(),
        cdateS = (cdates.length > 0) ? cdates[0] : dateToday,
        cdateE = (cdates.length > 1) ? cdates[1] : cdateS;

        var instanciateDatePickerPanel = function (config, pickerCfg) {
            var $this = this;
            this.picker = new Ext.DatePicker(Ext.applyIf({
                internalRender: this.strict || !Ext.isIE,
                ctCls: 'x-daterange-item',
                showToday: false
            }, pickerCfg));
            return new Ext.Panel(Ext.applyIf({
                picker: this.picker,
                cls: 'x-daterange-picker-panel',
                items: [this.picker]
            }, config));
        };
        var p1, p2;

        p1 = instanciateDatePickerPanel({ role: 'start', title: '起始日期' }, { maxDate: dateToday });
        p2 = instanciateDatePickerPanel({ role: 'end', title: '结束日期' }, { maxDate: dateToday });
        Ext.applyIf(p2, { margin: '0 0 0 5' });

        p1.picker.setMaxDate(cdateE);
        p1.picker.setValue(cdateS);
        p2.picker.setMinDate(cdateS);
        p2.picker.setValue(cdateE);

        p1.picker.addListener('select', function (p, d) {
            p2.picker.setMinDate(d);
        });
        p2.picker.addListener('select', function (p, d) {
            p1.picker.setMaxDate(d);
        });

        var dateControls = new Ext.Container({
            cls: 'x-daterange',
            layout: 'hbox',
            items: [p1, p2]
        });

        var dateForm = new Ext.form.FormPanel({
            border: false,
            cls: 'x-daterange-form',
            items: [dateControls],
            buttons: [
                { text: '取消', handler: function () { me.menu.hide(); } },
                {
                    text: '确定', handler: function () {
                        var sdate = p1.picker.getValue();
                        var edate = p2.picker.getValue();

                        me.setValue([p1.picker.getValue(), p2.picker.getValue()]);

                        me.menu.hide();

                        //me.handler(p1.picker.getValue(), p2.picker.getValue());
                    }
                }
            ]
        });

        me.menu = new Ext.menu.Menu({
            plain: true,
            items: [dateForm]
        });

        me.menu.showBy(this.inputEl, "tl-bl?");
    }
});

Date.prototype.extAdd = Date.prototype.add;

Date.prototype.datejsAdd = Date.prototype.add;
Date.prototype.add = function (config, extVal) {
    if (typeof config == "object") {
        return this.datejsAdd(config);
    } else {
        return this.extAdd(config, extVal);
    }
};