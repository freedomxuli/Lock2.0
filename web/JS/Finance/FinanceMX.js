var parentid = queryString.id;
var hotelid = queryString.hotelid;

var mxStore = Ext.create('Ext.data.Store',{
    fields:[
        'LiveStartTime', 'LiveEndTime', 'RealName', 'AuthorizeNo', 'RoomNo', 'TotalPrice', 'ActualTotalPrice'
    ]
});

Ext.onReady(function () {

    Ext.define('MainView', {
        extend: 'Ext.container.Viewport',

        layout: {
            type: 'fit'
        },

        initComponent: function () {
            var me = this;

            Ext.applyIf(me, {
                items: [
                    {
                        xtype: 'panel',
                        layout: {
                            type: 'fit'
                        },
                        items: [
                            {
                                xtype: 'gridpanel',
                                border: 1,
                                columnLines: 1,
                                store: mxStore,
                                columns: [
                                    {
                                        xtype: 'datecolumn',
                                        dataIndex: 'LiveStartTime',
                                        sortable: false,
                                        menuDisabled: true,
                                        format: 'Y-m-d',
                                        flex: 1,
                                        text: '入住日期'
                                    },
                                    {
                                        xtype: 'datecolumn',
                                        dataIndex: 'LiveEndTime',
                                        sortable: false,
                                        menuDisabled: true,
                                        format: 'Y-m-d',
                                        flex: 1,
                                        text: '退房日期'
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'RealName',
                                        sortable: false,
                                        menuDisabled: true,
                                        flex: 1,
                                        text: '姓名'
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'AuthorizeNo',
                                        sortable: false,
                                        menuDisabled: true,
                                        flex: 1,
                                        text: '授权单号'
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'RoomNo',
                                        sortable: false,
                                        menuDisabled: true,
                                        flex: 1,
                                        text: '入住房间号'
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'TotalPrice',
                                        sortable: false,
                                        menuDisabled: true,
                                        flex: 1,
                                        text: '预支付'
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'ActualTotalPrice',
                                        sortable: false,
                                        menuDisabled: true,
                                        flex: 1,
                                        text: '实收'
                                    }
                                ]
                            }
                        ],
                        buttonAlign: 'center',
                        buttons: [
                            {
                                text: '返回',
                                iconCls:'back',
                                handler: function () {
                                    FrameStack.popFrame();
                                }
                            }
                        ]
                    }
                ]
            });

            me.callParent(arguments);
        }

    });

    var mainView = new MainView();

    dataBind();
});

function dataBind() {
    CS('CZCLZ.FinanceDB.GetFinanceDetail', function (retVal) {
        if(retVal)
        {
            mxStore.loadData(retVal);
        }
    }, CS.onError, parentid, hotelid)
}