var pageSize = 15;

var FinanceStore = createSFW4Store({
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: ['HotelName', 'CreateTime', 'TxMoney', 'Status'],
    onPageChange: function (sto, nPage, sorters) {
        loadData(nPage);
    }
});

Ext.onReady(function () {
    Ext.define('FinanceList', {
        extend: 'Ext.container.Viewport',

        layout: {
            type: 'fit'
        },

        initComponent: function () {
            var me = this;

            Ext.applyIf(me, {
                items: [
                    {
                        xtype: 'gridpanel',
                        columnLines: 1,
                        border: 1,
                        store: FinanceStore,
                        columns: [
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'HotelName',
                                flex: 1,
                                sortable: false,
                                menuDisabled: true,
                                text: '门店名称'
                            },
                            {
                                xtype: 'datecolumn',
                                dataIndex: 'CreateTime',
                                flex: 1,
                                sortable: false,
                                menuDisabled: true,
                                format: 'Y-m-d',
                                text: '提现时间'
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'TxMoney',
                                flex: 1,
                                sortable: false,
                                menuDisabled: true,
                                text: '提现金额'
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'Status',
                                flex: 1,
                                sortable: false,
                                menuDisabled: true,
                                text: '处理状态',
                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                    if (value == "1")
                                        return "待打款";
                                    else if (value == "2")
                                        return "打款中";
                                    else if (value == "3")
                                        return "已打款";
                                    else if (value == "4")
                                        return "已拒绝";
                                    else if (value == "4")
                                        return "打款失败";
                                }
                            }
                        ],
                        dockedItems: [
                            {
                                xtype: 'pagingtoolbar',
                                dock: 'bottom',
                                width: 360,
                                store: FinanceStore,
                                displayInfo: true
                            }
                        ]
                    }
                ]
            });

            me.callParent(arguments);
        }

    });
    var win = new czmmWin();
    win.show();
  
});

function loadData(nPage) {
    CS('CZCLZ.FinanceDB.ApplyListNew', function (retVal) {
        if (retVal) {
            FinanceStore.setData({
                data: retVal.dt,
                pageSize: pageSize,
                total: retVal.ac,
                currentPage: retVal.cp
            });
        }
    }, CS.onError, nPage, pageSize, 0)
}


Ext.define('czmmWin', {
    extend: 'Ext.window.Window',

    height: 120,
    width: 400,
    layout: {
        type: 'fit'
    },
    id: 'czmmWin',
    modal: true,
    title: '操作密码',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'czmmForm',
                frame: true,
                bodyPadding: 10,

                title: '',
                items: [

                    {
                        xtype: 'textfield',
                        id: 'czmm',
                        fieldLabel: '操作密码',
                        labelWidth: 70,
                        inputType: 'password',
                        allowBlank: false,
                        anchor: '100%'
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '确定',
                        handler: function () {
                            var form = Ext.getCmp('czmmForm');
                            if (form.form.isValid()) {
                                CS('CZCLZ.SystemDB.CheckCZPassWord', function (retVal) {
                                    if (retVal) {
                                        Ext.getCmp("czmmWin").close();

                                        var mainView = new FinanceList();

                                        loadData(1);

                                    }
                                    else {
                                        Ext.MessageBox.alert('提示', '密码错误');

                                    }
                                }, CS.onError, Ext.getCmp("czmm").getValue())
                            }
                        }
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
});