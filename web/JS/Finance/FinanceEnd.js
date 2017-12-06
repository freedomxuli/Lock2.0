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

    var mainView = new FinanceList();

    loadData(1);
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
    }, CS.onError, nPage, pageSize, 1)
}