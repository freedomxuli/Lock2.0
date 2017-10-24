Ext.onReady(function () {
    Ext.apply(Ext.form.field.Date.prototype, { format: 'Y-m-d' });
});

var smartControls = ['SmartInputsPanel', 'SmartGridsPanel', 'SmartButtons', 'SmartDateRange', 'SmartFieldBox', 'SmartCombobox','SmartUEditor'];
for (var i = 0; i < smartControls.length; i++) {
    loadScript('approot/r/js/SmartControls/' + smartControls[i] + ".js");
}
//Ext.apply(Ext.form.field.Date, { format: 'y-m-d' });

