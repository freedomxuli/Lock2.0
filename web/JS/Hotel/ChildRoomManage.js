﻿var ParentId = queryString.ParentId;
var RoomGuid = queryString.RoomGuid;
var HotelId = queryString.HotelId;
var pageSize = 15;
var RoomId;

//************************************数据源*****************************************
var store = createSFW4Store({
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'ID' },
       { name: 'RoomNo' },
       { name: 'RoomGuidNumber' },
       { name: 'HotelName' },
       { name: 'CellPhone' },
       { name: 'RealName' },
       { name: 'RoomKind' },
       { name: 'RoomCheckStatus' },
       { name: 'RoomLiveStatus' },
       { name: 'ParentRoonNo' }

    ],
    //sorters: [{ property: 'b', direction: 'DESC'}],
    onPageChange: function (sto, nPage, sorters) {
        loadData(nPage);
    }
});

var goodsStore = Ext.create('Ext.data.Store', {
    fields: [
       { name: 'ID', type: 'string' },
       { name: 'Name', type: 'string' },
       { name: 'Number', type: 'string' },
       { name: 'Money', type: 'string' },
       { name: 'Unit', type: 'string' }
    ]

});

var deviceStore = Ext.create('Ext.data.Store', {
    fields: [
       { name: 'ID', type: 'string' },
       { name: 'DeviceName', type: 'string' },
       { name: 'DeviceNo', type: 'string' },
       { name: 'DeviceSN', type: 'string' },
       { name: 'TypeName', type: 'string' },
       { name: 'BindSuccess', type: 'string' }
    ]

});

var DeviceTypeStore = Ext.create('Ext.data.Store', {
    fields: ['VALUE', 'TEXT'],
    data: [
    ]
});



function loadData(nPage) {
    CS('CZCLZ.RoomDB.GetChildRoomList', function (retVal) {
        store.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
            //sorters: { property: 'a', direction: 'DESC' }
        });
    }, CS.onError, nPage, pageSize, ParentId);
}

function edit(id) {
    FrameStack.pushFrame({
        url: "ChildRoomAdd.html?id=" + id + "&ParentId=" + ParentId + "&RoomGuid=" + RoomGuid + "&HotelId=" + HotelId,
        onClose: function (ret) {
            loadData(1);
        }
    });
}

function jggl(id) {
    FrameStack.pushFrame({
        url: "PriceManage.html?id=" + id,
        onClose: function (ret) {
            loadData(1);
        }
    });
}

function wpgl(id) {
    RoomId = id;
    var win = new goodsWin();
    win.show(null, function () {
        CS('CZCLZ.RoomDB.GetRoomGoods', function (retVal) {
            goodsStore.loadData(retVal);
        }, CS.onError, RoomId);
    });
}

function editGoods(id) {
    var win = new addGoodsWin();
    win.show(null, function () {
        CS('CZCLZ.RoomDB.GetRoomGoodsInfo', function (retVal) {
            var form = Ext.getCmp("addGoodsForm");
            form.form.setValues(retVal[0]);
        }, CS.onError, id);
    });
}

function sbgl(id) {
    RoomId = id;
    var win = new deviceWin();
    win.show(null, function () {
        CS('CZCLZ.RoomDB.GetRoomDevice', function (retVal) {
            deviceStore.loadData(retVal);
        }, CS.onError, RoomId);
    });
}

function editDevice(id) {
    var win = new addDeviceWin();
    win.show(null, function () {
        CS('CZCLZ.RoomDB.GetRoomDeviceInfo', function (retVal) {
            var form = Ext.getCmp("addDeviceForm");
            form.form.setValues(retVal[0]);
        }, CS.onError, id);
    });
}

//************************************物品管理***************************************
Ext.define('addDeviceWin', {
    extend: 'Ext.window.Window',

    height: 250,
    width: 400,
    layout: {
        type: 'fit'
    },
    id: 'addDeviceWin',
    closeAction: 'destroy',
    modal: true,
    title: '添加设备',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'addDeviceForm',
                frame: true,
                bodyPadding: 10,

                title: '',
                items: [
                     {
                         xtype: 'textfield',
                         name: 'ID',
                         hidden: true,
                         fieldLabel: 'ID',
                         labelWidth: 70,
                         anchor: '100%'
                     },
                       {
                           xtype: 'combobox',
                           name: 'DeviceType',
                           fieldLabel: '设备类型',
                           editable: false,
                           labelWidth: 70,
                           anchor: '100%',
                           store: DeviceTypeStore,
                           queryMode: 'local',
                           displayField: 'TEXT',
                           valueField: 'VALUE',
                           value: ''
                       },
                    {
                        xtype: 'textfield',
                        name: 'DeviceName',
                        fieldLabel: '设备名称',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'textfield',
                        name: 'DeviceNo',
                        fieldLabel: '设备编号',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'textfield',
                        name: 'DeviceSN',
                        fieldLabel: '设备授权码',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },

                    {
                        xtype: 'textareafield',
                        id: 'CallBackData',
                        name: 'CallBackData',
                        fieldLabel: '返回信息',
                        labelWidth: 70,
                        anchor: '100%'
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                     {
                         text: '获取设备',
                         handler: function () {
                             var form = Ext.getCmp('addDeviceForm');
                             if (form.form.isValid()) {
                                 //取得表单中的内容
                                 var values = form.form.getValues(false);

                                 CS('CZCLZ.RoomDB.GetDevice', function (retVal) {
                                     if (retVal) {
                                         if (retVal.status == "ok") {
                                             Ext.MessageBox.alert("提示", "获取设备成功", function () {
                                                 Ext.getCmp("CallBackData").setValue(retVal.result);
                                             });
                                         }
                                     }
                                     else {
                                         Ext.MessageBox.alert("提示", "获取设备失败");
                                     }
                                 }, CS.onError, values);
                             }
                         }
                     },
                    {
                        text: '保存',
                        handler: function () {
                            var form = Ext.getCmp('addDeviceForm');
                            if (form.form.isValid()) {
                                //取得表单中的内容
                                var values = form.form.getValues(false);


                                CS('CZCLZ.RoomDB.GetDevice', function (retVal) {
                                    if (retVal) {
                                        if (retVal.status == "ok") {
                                            CS('CZCLZ.RoomDB.SaveRoomDevice', function (retVal) {
                                                if (retVal) {
                                                    CS('CZCLZ.RoomDB.GetRoomDevice', function (retVal) {
                                                        deviceStore.loadData(retVal);
                                                    }, CS.onError, RoomId);
                                                }

                                                Ext.getCmp('addDeviceWin').close()
                                            }, CS.onError, values, RoomId);
                                        }
                                    }
                                    else {
                                        Ext.MessageBox.alert("提示", "请先获取设备");
                                    }
                                }, CS.onError, values);


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

Ext.define('deviceWin', {
    extend: 'Ext.window.Window',

    height: 300,
    width: 600,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '设备列表',
    id: 'deviceWin',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'gridpanel',
                margin: '0 0 0 0',
                id: 'devicegrid',
                store: deviceStore,
                columnLines: true,
                border: true,
                autoscroll: true,
                selModel: Ext.create('Ext.selection.CheckboxModel', {

                }),
                columns: [

                     {
                         xtype: 'gridcolumn',
                         dataIndex: 'DeviceName',
                         align: 'center',
                         text: '设备名称',
                         flex: 1,
                         sortable: false,
                         menuDisabled: true
                     },

                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'TypeName',
                        align: 'center',
                        text: '设备类型',
                        flex: 1,
                        sortable: false,
                        menuDisabled: true
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'DeviceNo',
                        align: 'center',
                        text: '设备编号',
                        flex: 1,
                        sortable: false,
                        menuDisabled: true
                    },
                     {
                         xtype: 'gridcolumn',
                         dataIndex: 'DeviceSN',
                         align: 'center',
                         text: '设备授权码',
                         flex: 1,
                         sortable: false,
                         menuDisabled: true
                     },
                      {
                          xtype: 'gridcolumn',
                          dataIndex: 'BindSuccess',
                          align: 'center',
                          text: '是否匹配成功',
                          flex: 1,
                          sortable: false,
                          menuDisabled: true,
                          renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                              if (value == 0)
                                  return "否";
                              else
                                  return "是";
                          }
                      },
                     {
                         text: '操作',
                         width: 80,
                         align: 'center',
                         sortable: false,
                         menuDisabled: true,
                         renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                             var str;
                             str = "<a href='#' onclick='editDevice(\"" + record.data.ID + "\")'>编辑</a>";
                             return str;
                         }
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
                                               var win = new addDeviceWin();
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
                                                var grid = Ext.getCmp("devicegrid");
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

                                                        CS('CZCLZ.RoomDB.DeleteRoomDevice', function (retVal) {
                                                            if (retVal) {
                                                                CS('CZCLZ.RoomDB.GetRoomDevice', function (retVal) {
                                                                    deviceStore.loadData(retVal);
                                                                }, CS.onError, RoomId);
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
                          text: '设备绑定',
                          handler: function () {
                              Ext.MessageBox.confirm('提示', '确定绑定？', function (obj) {
                                  if (obj == "yes") {
                                      CS('CZCLZ.RoomDB.DeviceSQ', function (retVal) {
                                          if (retVal) {
                                              Ext.MessageBox.alert("提示", "绑定成功", function () {
                                                  Ext.getCmp("deviceWin").close();
                                                  loadData(1);
                                              });
                                          }
                                          else {
                                              Ext.MessageBox.alert("提示", "绑定失败", function () {
                                                  Ext.getCmp("deviceWin").close();
                                              });
                                          }
                                      }, CS.onError, RoomId);

                                  }
                                  else {
                                      return;
                                  }
                              });
                          }
                      },
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
//************************************物品管理***************************************

//************************************物品管理***************************************
Ext.define('addGoodsWin', {
    extend: 'Ext.window.Window',

    height: 250,
    width: 400,
    layout: {
        type: 'fit'
    },
    id: 'addGoodsWin',
    closeAction: 'destroy',
    modal: true,
    title: '添加物品',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'addGoodsForm',
                frame: true,
                bodyPadding: 10,

                title: '',
                items: [
                     {
                         xtype: 'textfield',
                         name: 'ID',
                         hidden: true,
                         fieldLabel: 'ID',
                         labelWidth: 70,
                         anchor: '100%'
                     },
                    {
                        xtype: 'textfield',
                        name: 'Name',
                        fieldLabel: '名称',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'numberfield',
                        name: 'Number',
                        fieldLabel: '数量',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'numberfield',
                        name: 'Money',
                        fieldLabel: '金额',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'textfield',
                        name: 'Unit',
                        fieldLabel: '单位',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'numberfield',
                        name: 'Sort',
                        fieldLabel: '排序',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '确定',
                        handler: function () {
                            var form = Ext.getCmp('addGoodsForm');
                            if (form.form.isValid()) {
                                //取得表单中的内容
                                var values = form.form.getValues(false);

                                CS('CZCLZ.RoomDB.SaveRoomGoods', function (retVal) {
                                    if (retVal) {
                                        CS('CZCLZ.RoomDB.GetRoomGoods', function (retVal) {
                                            goodsStore.loadData(retVal);
                                        }, CS.onError, RoomId);
                                    }

                                    Ext.getCmp('addGoodsWin').close()
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
        ];
        me.callParent(arguments);
    }
});
Ext.define('goodsWin', {
    extend: 'Ext.window.Window',

    height: 300,
    width: 600,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '物品列表',
    id: 'goodsWin',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'gridpanel',
                margin: '0 0 0 0',
                id: 'goodsgrid',
                store: goodsStore,
                columnLines: true,
                border: true,
                autoscroll: true,
                selModel: Ext.create('Ext.selection.CheckboxModel', {

                }),
                columns: [

                     {
                         xtype: 'gridcolumn',
                         dataIndex: 'Name',
                         align: 'center',
                         text: '名称',
                         flex: 1,
                         sortable: false,
                         menuDisabled: true
                     },

                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'Number',
                        align: 'center',
                        text: '数量',
                        flex: 1,
                        sortable: false,
                        menuDisabled: true
                    },
                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'Money',
                        align: 'center',
                        text: '金额',
                        flex: 1,
                        sortable: false,
                        menuDisabled: true
                    },
                     {
                         xtype: 'gridcolumn',
                         dataIndex: 'Unit',
                         align: 'center',
                         text: '单位',
                         flex: 1,
                         sortable: false,
                         menuDisabled: true
                     },
                     {
                         text: '操作',
                         width: 80,
                         align: 'center',
                         sortable: false,
                         menuDisabled: true,
                         renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                             var str;
                             str = "<a href='#' onclick='editGoods(\"" + record.data.ID + "\")'>编辑</a>";
                             return str;
                         }
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
                                               var win = new addGoodsWin();
                                               win.show();
                                           }
                                       },
                                        {
                                            xtype: 'button',
                                            iconCls: 'delete',
                                            text: '删除',
                                            handler: function () {
                                                var idlist = [];
                                                var grid = Ext.getCmp("goodsgrid");
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

                                                        CS('CZCLZ.RoomDB.DeleteRoomGoods', function (retVal) {
                                                            if (retVal) {
                                                                CS('CZCLZ.RoomDB.GetRoomGoods', function (retVal) {
                                                                    goodsStore.loadData(retVal);
                                                                }, CS.onError, RoomId);
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
//************************************物品管理***************************************

Ext.define('addWin', {
    extend: 'Ext.window.Window',

    height: 250,
    width: 400,
    layout: {
        type: 'fit'
    },
    id: 'deviceWin',
    closeAction: 'destroy',
    modal: true,
    title: '新增房间',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                frame: true,
                bodyPadding: 10,

                title: '',
                items: [
                     {
                         xtype: 'combobox',
                         id: 'RoomKind',
                         fieldLabel: '房间类型',
                         width: 180,
                         labelWidth: 60,
                         queryMode: 'local',
                         displayField: 'TEXT',
                         valueField: 'VALUE',
                         store: new Ext.data.ArrayStore({
                             fields: ['TEXT', 'VALUE'],
                             data: [
                                 ['合租', '1'],
                                 ['整租', '2']
                             ]
                         }),
                         value: '2'
                     }

                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '确定',
                        handler: function () {
                            var RoomKind = Ext.getCmp("RoomKind").getValue();
                            FrameStack.pushFrame({
                                url: "RoomAdd.html?RoomKind=" + RoomKind,
                                onClose: function (ret) {
                                    loadData(1);
                                }
                            });
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
                                width: 100,
                                dataIndex: 'RoomNo',
                                sortable: false,
                                menuDisabled: true,
                                align: 'center',
                                text: "房间编号"
                            },
                             {
                                 xtype: 'gridcolumn',
                                 width: 150,
                                 dataIndex: 'RoomGuidNumber',
                                 sortable: false,
                                 menuDisabled: true,
                                 align: 'center',
                                 text: "房间唯一编码"
                             },
                              {
                                  xtype: 'gridcolumn',
                                  flex: 1.5,
                                  dataIndex: 'HotelName',
                                  sortable: false,
                                  menuDisabled: true,
                                  align: 'center',
                                  text: "所属门店"
                              },

                                //{
                                //    xtype: 'gridcolumn',
                                //    flex: 1,
                                //    dataIndex: 'CellPhone',
                                //    sortable: false,
                                //    menuDisabled: true,
                                //    align: 'center',
                                //    text: "所属房东",
                                //    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                //        var CellPhone = "";
                                //        var RealName = "";
                                //        if (record.data.CellPhone != null)
                                //            CellPhone = record.data.CellPhone;
                                //        if (record.data.RealName != null)
                                //            RealName = record.data.RealName;
                                //        return CellPhone + "(" + RealName + ")";
                                //    }
                                //},
                                  {
                                      xtype: 'gridcolumn',
                                      flex: 1.5,
                                      dataIndex: 'ParentRoonNo',
                                      sortable: false,
                                      menuDisabled: true,
                                      align: 'center',
                                      text: "所属房间"
                                  },
                                  {
                                      xtype: 'gridcolumn',
                                      width: 80,
                                      dataIndex: 'RoomCheckStatus',
                                      sortable: false,
                                      menuDisabled: true,
                                      align: 'center',
                                      text: "检查状态",
                                      renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                          if (value == "1")
                                              return "正常";
                                          else if (value == "2")
                                              return "维修";

                                      }
                                  },
                                   {
                                       xtype: 'gridcolumn',
                                       width: 80,
                                       dataIndex: 'RoomLiveStatus',
                                       sortable: false,
                                       menuDisabled: true,
                                       align: 'center',
                                       text: "入住状态",
                                       renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                           if (value == "1")
                                               return "空闲";
                                           else if (value == "2")
                                               return "已预订";
                                           else if (value == "3")
                                               return "已入住";
                                           else if (value == "4")
                                               return "待退房";
                                       }
                                   },


                            {
                                text: '操作',
                                width: 300,
                                align: 'center',
                                sortable: false,
                                menuDisabled: true,
                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                    var str;
                                    str = "<a href='#' onclick='edit(\"" + record.data.ID + "\")'>编辑</a>";
                                    var roomkind = record.data.RoomKind;
                                    str += "|<a href='#' onclick='sbgl(\"" + record.data.ID + "\")'>设备管理</a>";
                                    str += "|<a href='#' onclick='jggl(\"" + record.data.ID + "\")'>价格管理</a>";
                                    str += "|<a href='#' onclick='wpgl(\"" + record.data.ID + "\")'>物品管理</a>";
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
                                            xtype: 'buttongroup',
                                            hidden: true,
                                            title: '',
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'search',
                                                    text: '查询',
                                                    handler: function () {
                                                        loadData(1);
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
                                                    iconCls: 'add',
                                                    text: '新增',
                                                    handler: function () {
                                                        FrameStack.pushFrame({
                                                            url: "ChildRoomAdd.html?ParentId=" + ParentId + "&RoomGuid=" + RoomGuid + "&HotelId=" + HotelId,
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

                                                                CS('CZCLZ.RoomDB.DeleteRoom', function (retVal) {
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
                                        },
                                         {
                                             xtype: 'buttongroup',
                                             title: '',
                                             items: [
                                                 {
                                                     xtype: 'button',
                                                     iconCls: 'back',
                                                     text: '返回',
                                                     handler: function () {
                                                         FrameStack.popFrame();
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

    loadData(1);

    CS('CZCLZ.RoomDB.GetChildDeviceTypeCombobox', function (retVal) {
        if (retVal) {
            DeviceTypeStore.loadData(retVal, true);
        }
    }, CS.onError);
})
