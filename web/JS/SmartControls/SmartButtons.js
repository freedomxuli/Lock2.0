Ext.define("SmartButtons", {
    extend: Ext.button.Button,
    alias: 'widget.SmartButtons',
    margins:'0 0 0 5',
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            iconCls: me.btnType
        });
        me.callParent(arguments);
    }
    //rows: []
});
var ButtonType = { Search: 'search', Add: 'add',Download:'download' };