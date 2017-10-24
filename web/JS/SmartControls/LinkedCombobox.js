var _cmbArr = [];
Ext.define("LinkedCombobox", {
    extend: Ext.form.field.ComboBox,
    alias: 'widget.LinkedCombobox',
    initComponent: function () {
        var me = this;
        var linkName = me.linkName;
        var level = me.level;
        var dataSource = me.dataSource;
        //var id = linkName + '_' + level;
        //me.id = id;
         
        var _groupIndex = -1
        
        for (var i = 0; i < _cmbArr.length; i++) {
            if (_cmbArr[i].linkname == linkName) {
                _groupIndex = i;
                break;
            }
        }
        if (_groupIndex < 0) {
            _cmbArr.push({ 'linkname': linkName, 'items': [{ 'level': level, 'dataSource': dataSource, 'cmb': me }] });
        }
        else {
            var _cmbItems = _cmbArr[_groupIndex].items;
            var _itemIndex = -1;
            for (var j = 0 ; j < _cmbItems.length; j++) {
                var _lv = _cmbItems[j].level;
                if (_lv == level) {
                    _itemIndex = j;
                    break;
                }
            }
            if (_itemIndex < 0) {
                _cmbItems.push({ 'level': level, 'dataSource': dataSource, 'cmb': me });
            }
            else {
                _cmbItems[_itemIndex].items = { 'level': level, 'dataSource': dataSource, 'cmb': me };
            }
        }

        me.addListener('select', function (cmb, v) {
            //_cmbArr.sort(_comparetorFun(['linkname', 'level']));
            var CurItems;
            for (var i = 0; i < _cmbArr.length; i++) {
                if (_cmbArr[i].linkname == linkName)
                {
                    CurItems = _cmbArr[i].items;
                    break;
                }
            }
            if (CurItems.length < 1)
                return;
            CurItems.sort(function (a, b) {
                if (a.level > b.level)
                    return 1;
                if (a.level < b.level)
                    return -1;
                return 0;
            });
            if (me.dataSource || CurItems[0].dataSource) {
                var _callServerFun = me.dataSource ? me.dataSource : CurItems[0].dataSource;

            }

            alert(1);
        })

        //var linkedCS = me.linkedCS,
        //    linkedStore = me.linkedStore,
        //    linkedId = me.linkedId;
        ////me.addEvents('linkedBind');
        //me.addListener('select', function (cmb, v) {
        //    //alert(2);
        //    if (linkedCS && linkedStore) {
        //        if (linkedId) {
        //            var lnkCtr = Ext.getCmp(linkedId);
        //            var selVal = cmb.value;
        //            if (lnkCtr) {
        //                CS(linkedCS, function (retVal) {
        //                    lnkCtr.clearValue();
        //                    linkedStore.loadData(retVal);
        //                }, CS.onError, selVal);
        //            }
        //        }
        //    }
        //});
        me.callParent(arguments);
    }
});
function _comparetorFun(arr) {
    if (arr && arr.length > 0) {
        return function (a, b) {
            var asub, bsub, prop;
            for (var i = 0; i < arr.length; i++) {
                prop = arr[i];
                asub = a[prop];
                bsub = b[prop];
                if (asub < bsub)
                    return -1;
                if (asub > bsub)
                    return 1;
            }
            return 0;
        }
    } else {
        return function (a, b) { return a <= b; };
    }
}