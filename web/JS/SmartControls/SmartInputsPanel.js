Ext.define("SmartInputsPanel", {
    extend: Ext.panel.Panel,
    alias: 'widget.SmartInputsPanel',
    layout: {
        type: 'vbox',
        align: 'left'
    },
    bodyPadding:5,
    defaults: {
        margins: '0 5 0 0',
        border: false,
        xtype: 'panel',
        layout: 'hbox',
        pack: 'start',
        align: 'middle',
        defaults: {
            padding: 5,
            labelWidth: 50,
            width: 180
        }
    },
    initComponent: function () {
        var me = this;
        var RowsItems = [];
        for (var i = 0; i < me.rows.length; i++) {
            var Rows ={ items : me.rows[i].items};
            RowsItems.push(Rows);
        }
        Ext.applyIf(me, {
            items: RowsItems
        });
        me.callParent(arguments);
    },
    rows: []
});
//alert(1);