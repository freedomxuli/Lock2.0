var pageSize = 15;

var hotelStore = Ext.create('Ext.data.Store', {
    fields: ['ID', 'HotelName']
});

var FinanceStore = createSFW4Store({
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: ['StartTime', 'EndTime', 'HotelName', 'FinanceStatus', 'JSStatus', 'TotalPrice', 'PlatYJ', 'ID', 'HotelId'],
    //sorters: [{ property: 'b', direction: 'DESC'}],
    onPageChange: function (sto, nPage, sorters) {
        loadData(nPage);
    }
});

var MxStore = Ext.create('Ext.data.Store', {
    fields: ['LiveStartTime', 'LiveEndTime', 'RealName', 'AuthorizeNo', 'RoomNo', 'ActualTotalPrice']
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
                                xtype: 'datecolumn',
                                dataIndex: 'StartTime',
                                flex: 1,
                                sortable: false,
                                menuDisabled: true,
                                format: 'Y-m-d',
                                text: '账期开始时间'
                            },
                            {
                                xtype: 'datecolumn',
                                dataIndex: 'EndTime',
                                flex: 1,
                                sortable: false,
                                menuDisabled: true,
                                format: 'Y-m-d',
                                text: '账期结束时间'
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'HotelName',
                                flex: 2,
                                sortable: false,
                                menuDisabled: true,
                                text: '宾馆名称'
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'FinanceStatus',
                                flex: 1,
                                sortable: false,
                                menuDisabled: true,
                                text: '状态',
                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                    if (value == "1")
                                        return "未出账";
                                    else
                                        return "已出帐";
                                }
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'TotalPrice',
                                flex: 1,
                                sortable: false,
                                menuDisabled: true,
                                text: '应付金额'
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'PlatYJ',
                                flex: 1,
                                sortable: false,
                                menuDisabled: true,
                                text: '平台佣金'
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'ID',
                                flex: 1,
                                sortable: false,
                                menuDisabled: true,
                                text: '操作',
                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                    var html = "";
                                    if (record.data.FinanceStatus == "2" && record.data.JSStatus == "0")
                                        html += "<a href='javascript:void(0);' onclick='Confirm(\"" + value + "\");'>确认</a>　<a href='javascript:void(0);' onclick='ShowDetail(\"" + value + "\",\"" + record.data.HotelId + "\");'>查看详情</a>";
                                    else
                                        html += "<a href='javascript:void(0);' onclick='ShowDetail(\"" + value + "\",\"" + record.data.HotelId + "\");'>查看详情</a>";
                                    return html;
                                }
                            }
                        ],
                        dockedItems: [
                            {
                                xtype: 'toolbar',
                                dock: 'top',
                                items: [
                                    {
                                        xtype: 'combobox',
                                        store: hotelStore,
                                        valueField: 'ID',
                                        displayField: 'HotelName',
                                        editable: false,
                                        queryMode: 'local',
                                        labelWidth: 80,
                                        width: 320,
                                        id: 'HotelSelect',
                                        fieldLabel: '门店选择'
                                    },
                                    {
                                        xtype: 'button',
                                        iconCls: 'search',
                                        text: '查看',
                                        handler: function () {
                                            loadData(1);
                                        }
                                    }
                                ]
                            },
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

function getHotel() {
    CS('CZCLZ.FinanceDB.GetHotelComboboxByUserId', function (retVal) {
        if (retVal) {
            hotelStore.loadData(retVal);
            if (hotelStore.data.length > 0) {
                Ext.getCmp('HotelSelect').setValue(hotelStore.data.items[0].data.ID);
                loadData(1);
            }
        }
    }, CS.onError)
}

function loadData(nPage) {
    CS('CZCLZ.FinanceDB.GetFinanceList', function (retVal) {
        if (retVal) {
            FinanceStore.setData({
                data: retVal.dt,
                pageSize: pageSize,
                total: retVal.ac,
                currentPage: retVal.cp
            });
        }
    }, CS.onError, nPage, pageSize, Ext.getCmp('HotelSelect').getValue());
}

function Confirm(id) {
    Ext.Msg.confirm("提示", "是否确认账单？", function (btn) {
        if (btn == "yes")
        {
            CS('CZCLZ.FinanceDB.ConfirmFinance', function (retVal) {
                if (retVal) {
                    if (retVal.status == "ok") {
                        Ext.MessageBox.alert("提示", "确认成功！", function () {
                            loadData(1);
                        });
                    }
                }
                else {
                    Ext.MessageBox.alert("提示", "确认失败！");
                }
            }, CS.onError, id)
        }
    });
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

                                        getHotel();

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

Ext.define('detailWin', {
    extend: 'Ext.window.Window',

    height: 600,
    width: 700,
    layout: {
        type: 'fit'
    },
    id: 'detailWin',
    modal: true,
    title: '授权单明细',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'gridpanel',
                columnLines: 1,
                border: 1,
                store: MxStore,
                columns: [
                    {
                        xtype: 'datecolumn',
                        dataIndex: 'LiveStartTime',
                        flex: 1,
                        sortable: false,
                        menuDisabled: true,
                        format: 'Y-m-d',
                        text: '入住日期'
                    },
                    {
                        xtype: 'datecolumn',
                        dataIndex: 'LiveEndTime',
                        flex: 1,
                        sortable: false,
                        menuDisabled: true,
                        format: 'Y-m-d',
                        text: '退房日期'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'RealName',
                        flex: 1,
                        sortable: false,
                        menuDisabled: true,
                        text: '姓名'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'AuthorizeNo',
                        flex: 1,
                        sortable: false,
                        menuDisabled: true,
                        text: '授权单号'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'RoomNo',
                        flex: 1,
                        sortable: false,
                        menuDisabled: true,
                        text: '入住房间号'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'ActualTotalPrice',
                        flex: 1,
                        sortable: false,
                        menuDisabled: true,
                        text: '线上支付'
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'ActualTotalPrice',
                        flex: 1,
                        sortable: false,
                        menuDisabled: true,
                        text: '本单实收'
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
});

function ShowDetail(id,hotelid)
{
    var winDetail = new detailWin();
    winDetail.show(null, function () {
        CS('CZCLZ.FinanceDB.GetFinanceDetail', function (retVal) {
            if (retVal)
            {
                MxStore.loadData(retVal);
            }
        }, CS.onError, id, hotelid);
    });
}