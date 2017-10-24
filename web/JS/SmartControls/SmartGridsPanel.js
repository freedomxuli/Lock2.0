Ext.define("SmartGridsPanel", {
    extend: Ext.grid.Panel,
    alias: 'widget.SmartGridsPanel',
    padding: 5,
    showRowNumber: true,
    showCheckBox: false,

    initComponent: function () {
        var me = this;
        if (me.columns.length > 0) {
            if (me.showRowNumber) {
                var cols = me.columns;
                var rowNumCol = Ext.create('Ext.grid.RowNumberer');
                rowNumCol.resizable = true;
                rowNumCol.setWidth(30);
                cols.splice(0, 0, rowNumCol);
            }
            if (me.showCheckBox) {
                var cols = me.columns;
                var smCol = Ext.create('Ext.selection.CheckboxModel');
                me.selModel = smCol;
            }
        }

        //var RowsItems = [];
        //for (var i = 0; i < me.rows.length; i++) {
        //    var Rows = { items: me.rows[i].items };
        //    RowsItems.push(Rows);
        //}
        //Ext.applyIf(me, {
        //    items: RowsItems
        //});
        me.callParent(arguments);
    }
    //rows: []
});