Ext.define("SmartCombobox", {
    extend: Ext.form.field.ComboBox,
    alias: 'widget.SmartCombobox',
    initComponent: function () {
        var me = this;
        var linkedCS = me.linkedCS,
            linkedStore = me.linkedStore,
            linkedId = me.linkedId;
        //me.addEvents('linkedBind');
        me.addListener('select', function (cmb,v) {
            //alert(2);
            if (linkedCS && linkedStore) {
                if (linkedId) {
                    var lnkCtr = Ext.getCmp(linkedId);
                    var selVal = cmb.value;
                    if (lnkCtr) {
                        CS(linkedCS, function (retVal) {
                            lnkCtr.clearValue();
                            linkedStore.loadData(retVal);
                        }, CS.onError, selVal);
                    }
                }
            }
        });
        me.callParent(arguments);
    }
});