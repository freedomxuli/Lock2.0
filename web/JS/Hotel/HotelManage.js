
var pageSize = 15;
var serviceId;
var hotelId;

//************************************数据源*****************************************
var store = createSFW4Store({
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'ID' },
       { name: 'HotelName' },
       { name: 'HotelNo' },
       { name: 'Mobile' },
       { name: 'Tel' },
       { name: 'UserName' },
       { name: 'FreezeMoney' },
       { name: 'CreateDate' },
       { name: 'CompleteAddress' },
       { name: 'CellPhone' },
       { name: 'RealName' }

    ],
    //sorters: [{ property: 'b', direction: 'DESC'}],
    onPageChange: function (sto, nPage, sorters) {
        loadData(nPage);
    }
});

var cleanerStore = Ext.create('Ext.data.Store', {
    fields: [
       { name: 'ID', type: 'string' },
       { name: 'RealName', type: 'string' },
       { name: 'CellPhone', type: 'string' }
    ]

});

var UserStore = Ext.create('Ext.data.Store', {
    fields: ['VALUE', 'TEXT'],
    data: [
    ]
});

var CleanerComnboStore = Ext.create('Ext.data.Store', {
    fields: ['VALUE', 'TEXT'],
    data: [
    ]
});



function loadData(nPage) {

    var cx_mc = Ext.getCmp("cx_mc").getValue();

    CS('CZCLZ.HotelDB.GetHotelList', function (retVal) {
        store.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
            //sorters: { property: 'a', direction: 'DESC' }
        });
    }, CS.onError, nPage, pageSize, cx_mc);

}

function edit(id) {
    FrameStack.pushFrame({
        url: "HotelAdd.html?id=" + id,
        onClose: function (ret) {
            loadData(1);
        }
    });
}

function choseAdmin(id) {
    hotelId = id;
    var win = new choseWin();
    win.show(null, function () {
        CS('CZCLZ.HotelDB.GetManagerList', function (retVal) {
            if (retVal.length > 0) {
                UserStore.loadData(retVal, false);
            }
        }, CS.onError);
    })
}

function bj(id) {
    hotelId = id;
    var win = new cleanerWin();
    win.show(null, function () {
        CS('CZCLZ.HotelDB.GetCleanerList', function (retVal) {
            if (retVal.length > 0) {
                cleanerStore.loadData(retVal);
            }
        }, CS.onError, id);
    })
}

//************************************物品管理***************************************
Ext.define('addCleanerWin', {
    extend: 'Ext.window.Window',

    height: 150,
    width: 300,
    layout: {
        type: 'fit'
    },
    id: 'addCleanerWin',
    closeAction: 'destroy',
    modal: true,
    title: '选择保洁',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'addCleanerForm',
                frame: true,
                bodyPadding: 10,

                title: '',
                items: [
                       {
                           xtype: 'combobox',
                           name: 'BJUserId',
                           id: 'BJUserId',
                           fieldLabel: '保洁',
                           editable: false,
                           labelWidth: 70,
                           anchor: '100%',
                           store: CleanerComnboStore,
                           queryMode: 'local',
                           displayField: 'TEXT',
                           valueField: 'VALUE',
                           allowBlank: false,
                           value: ''
                       }

                ],
                buttonAlign: 'center',
                buttons: [

                    {
                        text: '保存',
                        handler: function () {
                            var form = Ext.getCmp('addCleanerForm');
                            if (form.form.isValid()) {
                                //取得表单中的内容
                                var bjid = Ext.getCmp("BJUserId").getValue();
                                CS('CZCLZ.HotelDB.SaveCleaner', function (ret) {
                                    if (ret) {
                                        CS('CZCLZ.HotelDB.GetCleanerList', function (retVal) {
                                            if (retVal.length > 0) {
                                                cleanerStore.loadData(retVal);
                                            }
                                        }, CS.onError, hotelId);
                                        Ext.getCmp("addCleanerWin").close();
                                    }
                                }, CS.onError, bjid, hotelId);
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
        ];
        me.callParent(arguments);
    }
});

Ext.define('cleanerWin', {
    extend: 'Ext.window.Window',

    height: 300,
    width: 600,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '保洁列表',
    id: 'cleanerWin',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'gridpanel',
                margin: '0 0 0 0',
                id: 'cleanergrid',
                store: cleanerStore,
                columnLines: true,
                border: true,
                autoscroll: true,
                selModel: Ext.create('Ext.selection.CheckboxModel', {

                }),
                columns: [
                     {
                         xtype: 'gridcolumn',
                         dataIndex: 'ID',
                         align: 'center',
                         hidden: true,
                         flex: 1,
                         sortable: false,
                         menuDisabled: true
                     },
                     {
                         xtype: 'gridcolumn',
                         dataIndex: 'RealName',
                         align: 'center',
                         text: '保洁姓名',
                         flex: 1,
                         sortable: false,
                         menuDisabled: true
                     },

                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'CellPhone',
                        align: 'center',
                        text: '保洁手机',
                        flex: 1,
                        sortable: false,
                        menuDisabled: true
                    }

                ],
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [
                               {
                                   xtype: 'buttongroup',
                                   title: '',
                                   items: [
                                       {
                                           xtype: 'button',
                                           iconCls: 'add',
                                           text: '新增',
                                           handler: function () {
                                               var win = new addCleanerWin();
                                               win.show(null, function () {

                                               });
                                           }
                                       },
                                        {
                                            xtype: 'button',
                                            iconCls: 'delete',
                                            text: '删除',
                                            handler: function () {
                                                var idlist = [];
                                                var grid = Ext.getCmp("cleanergrid");
                                                var rds = grid.getSelectionModel().getSelection();
                                                if (rds.length == 0) {
                                                    Ext.Msg.show({
                                                        title: '提示',
                                                        msg: '请选择至少一条要删除的记录!',
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: Ext.MessageBox.INFO
                                                    });
                                                    return;
                                                }

                                                Ext.MessageBox.confirm('删除提示', '是否要删除数据!', function (obj) {
                                                    if (obj == "yes") {
                                                        for (var n = 0, len = rds.length; n < len; n++) {
                                                            var rd = rds[n];

                                                            idlist.push(rd.get("ID"));
                                                        }

                                                        CS('CZCLZ.HotelDB.DeleteCleaner', function (retVal) {
                                                            if (retVal) {
                                                                CS('CZCLZ.HotelDB.GetCleanerList', function (retVal) {
                                                                    if (retVal.length > 0) {
                                                                        cleanerStore.loadData(retVal);
                                                                    }
                                                                }, CS.onError, hotelId);
                                                            }
                                                        }, CS.onError, idlist);
                                                    }
                                                    else {
                                                        return;
                                                    }
                                                });
                                            }
                                        }
                                   ]
                               }
                        ]
                    }
                ],
                buttonAlign: 'center',
                buttons: [

                    {
                        text: '关闭',
                        handler: function () {
                            this.up('window').close();
                        }
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
});

Ext.define('choseWin', {
    extend: 'Ext.window.Window',

    height: 150,
    width: 300,
    layout: {
        type: 'fit'
    },
    id: 'choseWin',
    closeAction: 'destroy',
    modal: true,
    title: '选择管理员',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'choseForm',
                frame: true,
                bodyPadding: 10,

                title: '',
                items: [

                       {
                           xtype: 'combobox',
                           id: 'User',
                           fieldLabel: '门店管理员',
                           editable: false,
                           labelWidth: 70,
                           anchor: '100%',
                           store: UserStore,
                           queryMode: 'local',
                           displayField: 'TEXT',
                           valueField: 'VALUE',
                           value: ''
                       }

                ],
                buttonAlign: 'center',
                buttons: [

                    {
                        text: '保存',
                        handler: function () {
                            var form = Ext.getCmp('choseForm');
                            if (form.form.isValid()) {
                                var userid = Ext.getCmp("User").getValue();
                                Ext.MessageBox.confirm('提示', '确认选择？', function (obj) {
                                    if (obj == "yes") {
                                        CS('CZCLZ.HotelDB.UpdateHotelManager', function (retVal) {
                                            if (retVal) {
                                                Ext.MessageBox.alert("提示", "保存成功!", function () {
                                                    loadData(1);
                                                });
                                            }
                                            Ext.getCmp('choseWin').close();
                                        }, CS.onError, hotelId, userid);
                                    }
                                });

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
        ];
        me.callParent(arguments);
    }
});

//************************************主界面*****************************************
Ext.onReady(function () {
    Ext.define('mainView', {
        extend: 'Ext.container.Viewport',

        layout: {
            type: 'fit'
        },

        initComponent: function () {
            var me = this;
            me.items = [
                {
                    xtype: 'gridpanel',
                    id: 'maingrid',
                    title: '',
                    store: store,
                    columnLines: true,
                    selModel: Ext.create('Ext.selection.CheckboxModel', {

                    }),

                    columns: [Ext.create('Ext.grid.RowNumberer'),
                          {
                              xtype: 'gridcolumn',
                              dataIndex: 'ID',
                              hidden: true,
                              sortable: false,
                              menuDisabled: true,
                              align: 'center',
                              text: "ID"
                          },
                            {
                                xtype: 'gridcolumn',
                                flex: 1,
                                dataIndex: 'HotelName',
                                sortable: false,
                                menuDisabled: true,
                                align: 'center',
                                text: "宾馆名称"
                            },
                             {
                                 xtype: 'gridcolumn',
                                 flex: 1,
                                 dataIndex: 'HotelNo',
                                 sortable: false,
                                 menuDisabled: true,
                                 align: 'center',
                                 text: "宾馆编号"
                             },
                              {
                                  xtype: 'gridcolumn',
                                  flex: 1,
                                  dataIndex: 'Mobile',
                                  sortable: false,
                                  menuDisabled: true,
                                  align: 'center',
                                  text: "宾馆(手机)"
                              },

                                {
                                    xtype: 'gridcolumn',
                                    flex: 1,
                                    dataIndex: 'Tel',
                                    sortable: false,
                                    menuDisabled: true,
                                    align: 'center',
                                    text: "宾馆(座机)"
                                },
                                 {
                                     xtype: 'gridcolumn',
                                     flex: 1,
                                     dataIndex: 'UserName',
                                     sortable: false,
                                     menuDisabled: true,
                                     align: 'center',
                                     text: "所属房东",
                                     renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                         var CellPhone = "";
                                         var RealName = "";
                                         if (record.data.CellPhone != null)
                                             CellPhone = record.data.CellPhone;
                                         if (record.data.RealName != null)
                                             RealName = record.data.RealName;
                                         return CellPhone + "(" + RealName + ")";
                                     }
                                 },
                                  {
                                      xtype: 'gridcolumn',
                                      flex: 1,
                                      dataIndex: 'FreezeMoney',
                                      sortable: false,
                                      menuDisabled: true,
                                      align: 'center',
                                      text: "余额"
                                  },
                                   {
                                       xtype: 'gridcolumn',
                                       flex: 1,
                                       dataIndex: 'CompleteAddress',
                                       sortable: false,
                                       menuDisabled: true,
                                       align: 'center',
                                       text: "宾馆地址"
                                   },

                            {
                                xtype: 'datecolumn',
                                flex: 1,
                                format: 'Y-m-d H:i:s',
                                dataIndex: 'CreateDate',
                                sortable: false,
                                menuDisabled: true,
                                align: 'center',
                                text: "创建时间"
                            },

                            {
                                text: '操作',
                                width: 200,
                                align: 'center',
                                sortable: false,
                                menuDisabled: true,
                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                    var str;
                                    str = "<a href='#' onclick='edit(\"" + record.data.ID + "\")'>编辑</a>";
                                    str += "|<a href='#' onclick='choseAdmin(\"" + record.data.ID + "\")'>选择管理员</a>";
                                    str += "|<a href='#' onclick='bj(\"" + record.data.ID + "\")'>保洁管理</a>";
                                    return str;
                                }
                            }

                    ],
                    viewConfig: {

                    },
                    dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    items: [

                                        {
                                            xtype: 'textfield',
                                            id: 'cx_mc',
                                            width: 180,
                                            labelWidth: 80,
                                            fieldLabel: '门店名称'
                                        },

                                        {
                                            xtype: 'buttongroup',
                                            title: '',
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'search',
                                                    text: '查询',
                                                    handler: function () {
                                                        loadData(1);
                                                        //CS('CZCLZ.RoomDB.GetService', function (retVal) {
                                                        //    if (retVal) {
                                                        //      //  loadData(1);
                                                        //    }
                                                        //}, CS.onError);
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'buttongroup',
                                            title: '',
                                            //hidden: true,
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'add',
                                                    text: '新增',

                                                    handler: function () {
                                                        FrameStack.pushFrame({
                                                            url: "HotelAdd.html",
                                                            onClose: function (ret) {
                                                                loadData(1);
                                                            }
                                                        });
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'buttongroup',
                                            title: '',
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'delete',
                                                    text: '删除',
                                                    handler: function () {
                                                        var idlist = [];
                                                        var grid = Ext.getCmp("maingrid");
                                                        var rds = grid.getSelectionModel().getSelection();
                                                        if (rds.length == 0) {
                                                            Ext.Msg.show({
                                                                title: '提示',
                                                                msg: '请选择至少一条要删除的记录!',
                                                                buttons: Ext.MessageBox.OK,
                                                                icon: Ext.MessageBox.INFO
                                                            });
                                                            return;
                                                        }

                                                        Ext.MessageBox.confirm('删除提示', '是否要删除数据!', function (obj) {
                                                            if (obj == "yes") {
                                                                for (var n = 0, len = rds.length; n < len; n++) {
                                                                    var rd = rds[n];

                                                                    idlist.push(rd.get("ID"));
                                                                }

                                                                CS('CZCLZ.HotelDB.DeleteHotel', function (retVal) {
                                                                    if (retVal) {
                                                                        loadData(1);
                                                                    }
                                                                }, CS.onError, idlist);
                                                            }
                                                            else {
                                                                return;
                                                            }
                                                        });

                                                    }
                                                }
                                            ]
                                        }

                                    ]
                                },
                                {
                                    xtype: 'pagingtoolbar',
                                    displayInfo: true,
                                    store: store,
                                    dock: 'bottom'
                                }
                    ]
                }
            ];
            me.callParent(arguments);
        }
    });

    new mainView();

    CS('CZCLZ.HotelDB.GetCleanerCombo', function (retVal) {
        if (retVal) {
            CleanerComnboStore.loadData(retVal, false);
        }
    }, CS.onError);

    loadData(1);
})
