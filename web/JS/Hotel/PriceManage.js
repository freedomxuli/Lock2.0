var RoomId = queryString.id;

Ext.onReady(function () {
    Ext.define('mainView', {
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
                            align: 'center',
                            pack: 'center',
                            type: 'vbox'
                        },
                        items: [
                            {
                                xtype: 'form',
                                flex: 1,
                                width: 635,
                                border: 0,
                                id:'addForm',
                                items: [
                                    {
                                        xtype: 'datefield',
                                        format: 'Y-m-d',
                                        name: 'StartDate',
                                        fieldLabel: '开始时间',
                                        labelWidth: 90,
                                        allowBlank: false,
                                        padding: 10,
                                        anchor: '100%',
                                        value: (new Date(new Date().getFullYear() + "-01-01"))
                                    },
                                    {
                                        xtype: 'datefield',
                                        format: 'Y-m-d',
                                        name: 'EndDate',
                                        fieldLabel: '结束时间',
                                        labelWidth: 90,
                                        allowBlank: false,
                                        padding: 10,
                                        anchor: '100%',
                                        value: (new Date(new Date().getFullYear() + "-12-31"))
                                    },
                                    {
                                        xtype: 'numberfield',
                                        id: 'Price',
                                        name: 'Price',
                                        fieldLabel: '平时价',
                                        labelWidth: 90,
                                        allowBlank: false,
                                        padding: 10,
                                        anchor: '100%'
                                    },

                                    {
                                        xtype: 'numberfield',
                                        id: 'WeekEndPrice',
                                        name: 'WeekEndPrice',
                                        fieldLabel: '周末价',
                                        labelWidth: 90,
                                        allowBlank: false,
                                        padding: 10,
                                        anchor: '100%'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        id: 'HourPrice',
                                        name: 'HourPrice',
                                        fieldLabel: '钟点房1平时价',
                                        labelWidth: 90,
                                        allowBlank: false,
                                        padding: 10,
                                        anchor: '100%'
                                    },

                                    {
                                        xtype: 'numberfield',
                                        id: 'HourWeekEndPrice',
                                        name: 'HourWeekEndPrice',
                                        fieldLabel: '钟点房1周末价',
                                        labelWidth: 90,
                                        allowBlank: false,
                                        padding: 10,
                                        anchor: '100%'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        id: 'HourPrice2',
                                        name: 'HourPrice2',
                                        fieldLabel: '钟点房2平时价',
                                        labelWidth: 90,
                                        allowBlank: false,
                                        padding: 10,
                                        anchor: '100%'
                                    },

                                    {
                                        xtype: 'numberfield',
                                        id: 'HourWeekEndPrice2',
                                        name: 'HourWeekEndPrice2',
                                        fieldLabel: '钟点房2周末价',
                                        labelWidth: 90,
                                        allowBlank: false,
                                        padding: 10,
                                        anchor: '100%'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        id: 'HourPrice3',
                                        name: 'HourPrice3',
                                        fieldLabel: '钟点房3平时价',
                                        labelWidth: 90,
                                        allowBlank: false,
                                        padding: 10,
                                        anchor: '100%'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        id: 'HourWeekEndPrice3',
                                        name: 'HourWeekEndPrice3',
                                        fieldLabel: '钟点房3周末价',
                                        labelWidth: 90,
                                        allowBlank: false,
                                        padding: 10,
                                        anchor: '100%'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        id: 'MonthRentPrice',
                                        name: 'MonthRentPrice',
                                        fieldLabel: '月租价',
                                        labelWidth: 90,
                                        allowBlank: false,
                                        padding: 10,
                                        anchor: '100%'
                                    }
                                ],
                                buttonAlign: 'center',
                                buttons: [
                                    {
                                        text: '保存',
                                        handler: function () {
                                            var form = Ext.getCmp('addForm');
                                            if (form.form.isValid()) {
                                                //取得表单中的内容
                                                var values = form.form.getValues(false);

                                                CS('CZCLZ.RoomDB.SaveRoomPrice', function (retVal) {
                                                    if (retVal) {
                                                        Ext.Msg.alert("提示", "保存价格成功！", function () {
                                                            location.reload();
                                                        });
                                                    }
                                                }, CS.onError, values, RoomId);
                                            }
                                        }
                                    },
                                    {
                                        text: '取消',
                                        handler: function () {
                                            this.up('window').close();
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

            me.callParent(arguments);
        }

    });

    new mainView();
    loadData();
});

function loadData() {
    CS('CZCLZ.RoomDB.GetRoomPrice', function (retVal) {
        if (retVal)
        {
            if (retVal.length > 0)
            {
                Ext.getCmp("Price").setValue(retVal[0]["Price"]);
                Ext.getCmp("WeekEndPrice").setValue(retVal[0]["WeekEndPrice"]);
                Ext.getCmp("HourPrice").setValue(retVal[0]["HourPrice"]);
                Ext.getCmp("HourWeekEndPrice").setValue(retVal[0]["HourWeekEndPrice"]);
                Ext.getCmp("HourPrice2").setValue(retVal[0]["HourPrice2"]);
                Ext.getCmp("HourWeekEndPrice2").setValue(retVal[0]["HourWeekEndPrice2"]);
                Ext.getCmp("HourPrice3").setValue(retVal[0]["HourPrice3"]);
                Ext.getCmp("HourWeekEndPrice3").setValue(retVal[0]["HourWeekEndPrice3"]);
                Ext.getCmp("MonthRentPrice").setValue(retVal[0]["MonthRentPrice"]);
            }
        }
    },CS.onError,RoomId);
}

//var pageSize = 15;
//var RoomId = queryString.id;

//function loadData(nPage) {
//    //var cx_lx = Ext.getCmp("cx_lx").getValue();
//    CS('CZCLZ.RoomDB.GetRoomPriceList', function (retVal) {
//        store.setData({
//            data: retVal.dt,
//            pageSize: pageSize,
//            total: retVal.ac,
//            currentPage: retVal.cp
//            //sorters: { property: 'a', direction: 'DESC' }
//        });
//    }, CS.onError, nPage, pageSize, RoomId);
//}

////************************************数据源*****************************************
//var store = createSFW4Store({
//    pageSize: pageSize,
//    total: 1,
//    currentPage: 1,
//    fields: [
//       { name: 'ID' },
//       { name: 'StartDate' },
//       { name: 'EndDate' },
//       { name: 'Price' },
//       { name: 'WeekEndPrice' },
//       { name: 'HourPrice' },
//       { name: 'HourWeekEndPrice' },
//         { name: 'HourPrice2' },
//       { name: 'HourWeekEndPrice2' },
//         { name: 'HourPrice3' },
//       { name: 'HourWeekEndPrice3' }
//    ],
//    onPageChange: function (sto, nPage, sorters) {
//        loadData(nPage);
//    }
//});

//function edit(id) {
//    var r = store.findRecord("ID", id).data;
//    var win = new addWin();
//    win.show(null, function () {
//        win.setTitle("修改");
//        var form = Ext.getCmp('addForm');
//        form.form.setValues(r);
//    });
//}

//Ext.define('addWin', {
//    extend: 'Ext.window.Window',

//    height: 400,
//    width: 450,
//    layout: {
//        type: 'fit'
//    },
//    id: 'addWin',
//    closeAction: 'destroy',
//    modal: true,
//    title: '价格信息',
//    initComponent: function () {
//        var me = this;
//        me.items = [
//            {
//                xtype: 'form',
//                id: 'addForm',
//                frame: true,
//                bodyPadding: 10,

//                title: '',
//                items: [
//                     {
//                         xtype: 'textfield',
//                         name: 'ID',
//                         hidden: true,
//                         fieldLabel: 'ID',
//                         labelWidth: 90,
//                         anchor: '100%'
//                     },
//                    {
//                        xtype: 'datefield',
//                        format: 'Y-m-d H:i:s',
//                        name: 'StartDate',
//                        fieldLabel: '开始时间',
//                        labelWidth: 90,
//                        allowBlank: false,
//                        anchor: '100%'
//                    },
//                    {
//                        xtype: 'datefield',
//                        format: 'Y-m-d H:i:s',
//                        name: 'EndDate',
//                        fieldLabel: '结束时间',
//                        labelWidth: 90,
//                        allowBlank: false,
//                        anchor: '100%'
//                    },
//                    {
//                        xtype: 'numberfield',
//                        name: 'Price',
//                        fieldLabel: '平时价',
//                        labelWidth: 90,
//                        allowBlank: false,
//                        anchor: '100%'
//                    },

//                   {
//                       xtype: 'numberfield',
//                       name: 'WeekEndPrice',
//                       fieldLabel: '周末价',
//                       labelWidth: 90,
//                       allowBlank: false,
//                       anchor: '100%'
//                   },
//                    {
//                        xtype: 'numberfield',
//                        name: 'HourPrice',
//                        fieldLabel: '钟点房1平时价',
//                        labelWidth: 90,
//                        allowBlank: false,
//                        anchor: '100%'
//                    },

//                   {
//                       xtype: 'numberfield',
//                       name: 'HourWeekEndPrice',
//                       fieldLabel: '钟点房1周末价',
//                       labelWidth: 90,
//                       allowBlank: false,
//                       anchor: '100%'
//                   },
//                    {
//                        xtype: 'numberfield',
//                        name: 'HourPrice2',
//                        fieldLabel: '钟点房2平时价',
//                        labelWidth: 90,
//                        allowBlank: false,
//                        anchor: '100%'
//                    },

//                   {
//                       xtype: 'numberfield',
//                       name: 'HourWeekEndPrice2',
//                       fieldLabel: '钟点房2周末价',
//                       labelWidth: 90,
//                       allowBlank: false,
//                       anchor: '100%'
//                   },
//                    {
//                        xtype: 'numberfield',
//                        name: 'HourPrice3',
//                        fieldLabel: '钟点房3平时价',
//                        labelWidth: 90,
//                        allowBlank: false,
//                        anchor: '100%'
//                    },

//                   {
//                       xtype: 'numberfield',
//                       name: 'HourWeekEndPrice3',
//                       fieldLabel: '钟点房3周末价',
//                       labelWidth: 90,
//                       allowBlank: false,
//                       anchor: '100%'
//                   }
//                ],
//                buttonAlign: 'center',
//                buttons: [

//                    {
//                        text: '保存',
//                        handler: function () {
//                            var form = Ext.getCmp('addForm');
//                            if (form.form.isValid()) {
//                                //取得表单中的内容
//                                var values = form.form.getValues(false);

//                                CS('CZCLZ.RoomDB.SaveRoomPrice', function (retVal) {
//                                    if (retVal) {
//                                        Ext.getCmp("addWin").close();
//                                        loadData(1);
//                                    }
//                                }, CS.onError, values, RoomId);
//                            }
//                        }
//                    },
//                    {
//                        text: '取消',
//                        handler: function () {
//                            this.up('window').close();
//                        }
//                    }
//                ]
//            }
//        ];
//        me.callParent(arguments);
//    }
//});

//Ext.onReady(function () {
//    Ext.define('mainView', {
//        extend: 'Ext.container.Viewport',

//        layout: {
//            type: 'fit'
//        },

//        initComponent: function () {
//            var me = this;
//            me.items = [
//                {
//                    xtype: 'gridpanel',
//                    id: 'maingrid',
//                    title: '',
//                    store: store,
//                    columnLines: true,
//                    selModel: Ext.create('Ext.selection.CheckboxModel', {

//                    }),

//                    columns: [Ext.create('Ext.grid.RowNumberer'),
//                          {
//                              xtype: 'gridcolumn',
//                              dataIndex: 'ID',
//                              hidden: true,
//                              sortable: false,
//                              menuDisabled: true,
//                              align: 'center',
//                              text: "ID"
//                          },
//                            {
//                                xtype: 'datecolumn',
//                                flex: 1.6,
//                                format: 'Y-m-d H:i:s',
//                                dataIndex: 'StartDate',
//                                sortable: false,
//                                menuDisabled: true,
//                                align: 'center',
//                                text: "开始时间"
//                            },
//                            {
//                                xtype: 'datecolumn',
//                                flex: 1.6,
//                                format: 'Y-m-d H:i:s',
//                                dataIndex: 'EndDate',
//                                sortable: false,
//                                menuDisabled: true,
//                                align: 'center',
//                                text: "结束时间"
//                            },
//                              {
//                                  xtype: 'gridcolumn',
//                                  flex: 1,
//                                  dataIndex: 'Price',
//                                  sortable: false,
//                                  menuDisabled: true,
//                                  align: 'center',
//                                  text: "平时价"
//                              },
//                             {
//                                 xtype: 'gridcolumn',
//                                 flex: 1,
//                                 dataIndex: 'WeekEndPrice',
//                                 sortable: false,
//                                 menuDisabled: true,
//                                 align: 'center',
//                                 text: "周末价"
//                             },
//                             {
//                                 xtype: 'gridcolumn',
//                                 flex: 1,
//                                 dataIndex: 'HourPrice',
//                                 sortable: false,
//                                 menuDisabled: true,
//                                 align: 'center',
//                                 text: "钟点房1平时价"
//                             },
//                             {
//                                 xtype: 'gridcolumn',
//                                 flex: 1,
//                                 dataIndex: 'HourWeekEndPrice',
//                                 sortable: false,
//                                 menuDisabled: true,
//                                 align: 'center',
//                                 text: "钟点房1周末价"
//                             },
//                                   {
//                                       xtype: 'gridcolumn',
//                                       flex: 1,
//                                       dataIndex: 'HourPrice2',
//                                       sortable: false,
//                                       menuDisabled: true,
//                                       align: 'center',
//                                       text: "钟点房2平时价"
//                                   },
//                             {
//                                 xtype: 'gridcolumn',
//                                 flex: 1,
//                                 dataIndex: 'HourWeekEndPrice2',
//                                 sortable: false,
//                                 menuDisabled: true,
//                                 align: 'center',
//                                 text: "钟点房2周末价"
//                             },
//                                   {
//                                       xtype: 'gridcolumn',
//                                       flex: 1,
//                                       dataIndex: 'HourPrice3',
//                                       sortable: false,
//                                       menuDisabled: true,
//                                       align: 'center',
//                                       text: "钟点房3平时价"
//                                   },
//                             {
//                                 xtype: 'gridcolumn',
//                                 flex: 1,
//                                 dataIndex: 'HourWeekEndPrice3',
//                                 sortable: false,
//                                 menuDisabled: true,
//                                 align: 'center',
//                                 text: "钟点房3周末价"
//                             },
//                            {
//                                text: '操作',
//                                width: 80,
//                                align: 'center',
//                                sortable: false,
//                                menuDisabled: true,
//                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
//                                    var str;
//                                    str = "<a href='#' onclick='edit(\"" + record.data.ID + "\")'>编辑</a>";
//                                    return str;
//                                }
//                            }

//                    ],
//                    viewConfig: {

//                    },
//                    dockedItems: [
//                                {
//                                    xtype: 'toolbar',
//                                    dock: 'top',
//                                    items: [
//                                        {
//                                            xtype: 'buttongroup',
//                                            title: '',
//                                            items: [
//                                                {
//                                                    xtype: 'button',
//                                                    iconCls: 'add',
//                                                    text: '新增',
//                                                    handler: function () {
//                                                        var win = new addWin();
//                                                        win.show();
//                                                    }
//                                                }
//                                            ]
//                                        },
//                                        {
//                                            xtype: 'buttongroup',
//                                            title: '',
//                                            items: [
//                                                {
//                                                    xtype: 'button',
//                                                    iconCls: 'delete',
//                                                    text: '删除',
//                                                    handler: function () {
//                                                        var idlist = [];
//                                                        var grid = Ext.getCmp("maingrid");
//                                                        var rds = grid.getSelectionModel().getSelection();
//                                                        if (rds.length == 0) {
//                                                            Ext.Msg.show({
//                                                                title: '提示',
//                                                                msg: '请选择至少一条要删除的记录!',
//                                                                buttons: Ext.MessageBox.OK,
//                                                                icon: Ext.MessageBox.INFO
//                                                            });
//                                                            return;
//                                                        }

//                                                        Ext.MessageBox.confirm('删除提示', '是否要删除数据!', function (obj) {
//                                                            if (obj == "yes") {
//                                                                for (var n = 0, len = rds.length; n < len; n++) {
//                                                                    var rd = rds[n];

//                                                                    idlist.push(rd.get("ID"));
//                                                                }

//                                                                CS('CZCLZ.RoomDB.DeleteRoomPrice', function (retVal) {
//                                                                    if (retVal) {
//                                                                        loadData(1);
//                                                                    }
//                                                                }, CS.onError, idlist);
//                                                            }
//                                                            else {
//                                                                return;
//                                                            }
//                                                        });

//                                                    }
//                                                }
//                                            ]
//                                        },
//                                         {
//                                             xtype: 'buttongroup',
//                                             title: '',
//                                             items: [
//                                                 {
//                                                     xtype: 'button',
//                                                     iconCls: 'back',
//                                                     text: '返回',
//                                                     handler: function () {
//                                                         FrameStack.popFrame();
//                                                     }
//                                                 }
//                                             ]
//                                         }

//                                    ]
//                                },
//                                {
//                                    xtype: 'pagingtoolbar',
//                                    displayInfo: true,
//                                    store: store,
//                                    dock: 'bottom'
//                                }
//                    ]
//                }
//            ];
//            me.callParent(arguments);
//        }
//    });

//    new mainView();

//    loadData(1);

//})