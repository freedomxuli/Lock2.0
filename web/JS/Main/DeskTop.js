var now_date = new Date();
var hotelid = "";
var mdStore = Ext.create('Ext.data.Store', {
    fields: ['ID', 'HotelName']
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
                        id: 't_show',
                        height: document.documentElement.clientHeight,
                        html: ""
                    }
                ]
            });
            me.callParent(arguments);
        }
    });
    new MainView();

    dataBind();
});

function dataBind() {
    CS("CZCLZ.DeskTop.Tshow", function (retVal) {
        if (retVal) {
            Ext.getCmp("t_show").update(retVal);
            addListen();
        }
    }, CS.onError, now_date, hotelid);
}

Ext.define('HotelWin', {
    extend: 'Ext.window.Window',

    height: 401,
    width: 282,
    layout: {
        type: 'fit'
    },
    title: '门店列表',
    modal: true,
    id: 'HotelWin',

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
                            store:mdStore,
                            columns: [
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'HotelName',
                                    flex: 2,
                                    sortable: false,
                                    menuDisabled:true,
                                    text: '门店'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'ID',
                                    flex: 1,
                                    sortable: false,
                                    menuDisabled: true,
                                    text: '操作',
                                    renderer: function (value,cellmeta,record,rowIndex,columnIndex,store) {
                                        return "<a href='javascript:void(0);' onClick='selHotel(\"" + value + "\");'>选择</a>";
                                    }
                                }
                            ]
                        }
                    ],
                    buttonAlign: 'center',
                    buttons: [
                        {
                            text: '关闭',
                            handler: function () {
                                me.close();
                            }
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});

function ShowHotel() {
    var win = new HotelWin();
    win.show(null, function () {
        CS('CZCLZ.DeskTop.GetHotelList', function (retVal) {
            if (retVal)
            {
                mdStore.loadData(retVal);
            }
        }, CS.onError);
    });
}

function selHotel(id) {
    hotelid = id;
    dataBind();
    Ext.getCmp("HotelWin").close();
}

function selecttime() {
    var win = new TimeWin();
    win.show(null, function () {
        Ext.getCmp("CheckTime").setValue(now_date);
    });
}

function addListen() {
    var ydata = Ext.query("#yd-data td");
    for (var i = 0; i < ydata.length; i++) {
        Ext.EventManager.addListener(ydata[i], "click", function () {
            if ($(this).children("input")[1].value == 0) {
                var isCanClose = $(this).children("input")[2].value;
                var win = new Buttons({ roomid: $(this).children("input")[0].value });
                win.show(null, function () {
                    Ext.getCmp("AddOrder").show();
                    Ext.getCmp("ShowRoom").show();
                    if (isCanClose == 0)
                        Ext.getCmp("CloseRoom").show();
                });
            } else if ($(this).children("input")[1].value == 1) {
                var win = new Buttons({ roomid: $(this).children("input")[0].value, AuthorizeId: $(this).children("input")[3].value });
                win.show(null, function () {
                    Ext.getCmp("ShowRoom").show();
                    Ext.getCmp("ShowOrder").show();
                });
            } else {
                var win = new Buttons({ roomid: $(this).children("input")[0].value });
                win.show(null, function () {
                    Ext.getCmp("ShowRoom").show();
                    Ext.getCmp("OpenRoom").show();
                });
            }
        });
    }
}

//弹出框
Ext.define('TimeWin', {
    extend: 'Ext.window.Window',

    height: 244,
    width: 285,
    layout: {
        type: 'fit'
    },
    title: '选择时间',
    modal: true,

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    items: [
                        {
                            xtype: 'datefield',
                            id: "CheckTime",
                            format: 'Y-m-d',
                            editable: false,
                            padding: 10,
                            labelWidth: 40,
                            fieldLabel: '时间'
                        }
                    ],
                    buttonAlign: 'center',
                    buttons: [
                        {
                            text: '确定',
                            handler: function () {
                                now_date = Ext.getCmp("CheckTime").getValue();
                                dataBind();
                                me.close();
                            }
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});

Ext.define('Buttons', {
    extend: 'Ext.window.Window',

    width: 167,
    layout: {
        type: 'anchor'
    },
    title: '操作',

    modal: true,
    id: 'cz',
    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            dockedItems: [
                {
                    xtype: 'panel',
                    dock: 'top',
                    layout: {
                        align: 'center',
                        pack: 'center',
                        type: 'vbox'
                    },
                    items: [
                        {
                            xtype: 'button',
                            flex: 1,
                            margin: 10,
                            id: 'AddOrder',
                            hidden: true,
                            text: '新增授权',
                            handler: function () {
                                FrameStack.pushFrame({
                                    url: "approot/r/page/AuthorizeOrder/AuthorizeOrderAddByDesk.html?roomid=" + me.roomid,
                                    onClose: function (ret) {
                                        dataBind();
                                    }
                                });
                            }
                        },
                        {
                            xtype: 'button',
                            flex: 1,
                            margin: 10,
                            id: 'ShowRoom',
                            hidden: true,
                            text: '房间信息',
                            handler: function () {
                                var win = new fjxxWin();
                                win.show(null, function () {
                                    CS('CZCLZ.AuthorizeOrderDB.GetRoomInfo', function (retVal) {
                                        if (retVal) {
                                            rzjlStore.loadData(retVal.dt3);
                                            wsStore.loadData(retVal.dt4);
                                            sbStore.loadData(retVal.dt5);
                                            var fjxxForm = Ext.getCmp("fjxxForm");
                                            fjxxForm.form.setValues(retVal.dt1[0]);
                                            for (var i in retVal.dt2) {
                                                var df = new Ext.form.DisplayField({
                                                    xtype: 'displayfield',
                                                    labelWidth: 90,
                                                    allowBlank: false,
                                                    fieldLabel: retVal.dt2[i]["TagName"],
                                                    value: retVal.dt2[i]["TagDec"] + retVal.dt2[i]["Unit"],
                                                    anchor: '100%'
                                                });
                                                Ext.getCmp("fjxxForm").items.add(df);
                                                Ext.getCmp("fjxxForm").doLayout();
                                            }

                                        }
                                    }, CS.onError, me.roomid);

                                    CS('CZCLZ.RoomDB.GetRoomGoods', function (retVal) {
                                        goodsStore.loadData(retVal);
                                    }, CS.onError, me.roomid);

                                    CS('CZCLZ.AuthorizeOrderDB.GetLockRecord', function (retVal) {
                                        if (retVal.status)
                                            lockStore.loadData(retVal.dt);
                                    }, CS.onError, me.roomid);
                                });
                            }
                        },
                        {
                            xtype: 'button',
                            flex: 1,
                            margin: 10,
                            id: 'ShowOrder',
                            hidden: true,
                            text: '订单信息',
                            handler: function () {
                                FrameStack.pushFrame({
                                    url: "approot/r/page/AuthorizeOrder/AuthorizeOrderAdd.html?id=" + me.AuthorizeId,
                                    onClose: function (ret) {
                                        dataBind();
                                    }
                                });
                            }
                        },
                        {
                            xtype: 'button',
                            flex: 1,
                            margin: 10,
                            id: 'CloseRoom',
                            hidden: true,
                            text: '设置关房',
                            handler: function () {
                                CS('CZCLZ.DeskTop.SetCloseRoom', function (retVal) {
                                    if (retVal) {
                                        Ext.Msg.alert("提示", "关房成功！", function () {
                                            dataBind();
                                            me.close();
                                        });
                                    }
                                }, CS.onError, me.roomid);
                            }
                        },
                        {
                            xtype: 'button',
                            flex: 1,
                            margin: 10,
                            id: 'OpenRoom',
                            hidden: true,
                            text: '设置开房',
                            handler: function () {
                                CS('CZCLZ.DeskTop.SetOpenRoom', function (retVal) {
                                    if (retVal) {
                                        Ext.Msg.alert("提示", "开房成功！", function () {
                                            dataBind();
                                            me.close();
                                        });
                                    }
                                }, CS.onError, me.roomid);
                            }
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
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

var rzjlStore = Ext.create('Ext.data.Store', {
    fields: [
       { name: 'AuthorizeNo', type: 'string' },
       { name: 'RealName', type: 'string' },
       { name: 'CellPhone', type: 'string' },
       { name: 'LiveStartDate', type: 'string' },
       { name: 'LiveEndDate', type: 'string' }
    ]
});

var wsStore = Ext.create('Ext.data.Store', {
    fields: [
       { name: 'ServiceRemark', type: 'string' },
       { name: 'DamagePrice', type: 'string' },
       { name: 'FinishTime', type: 'string' }
    ]
});

var sbStore = Ext.create('Ext.data.Store', {
    fields: [
       { name: 'ID', type: 'string' },
       { name: 'DeviceName', type: 'string' },
       { name: 'DeviceNo', type: 'string' },
       { name: 'DeviceSN', type: 'string' },
       { name: 'TypeName', type: 'string' },
       { name: 'BindSuccess', type: 'string' }
    ]

});

var lockStore = Ext.create('Ext.data.Store', {
    fields: [
       { name: 'date', type: 'string' },
       { name: 'type', type: 'string' }
    ]
});

function ckdd(authno) {
    FrameStack.pushFrame({
        url: "approot/r/page/AuthorizeOrder/AuthorizeOrderDetail.html?AuthorizeNo=" + authno,
        onClose: function (ret) {
            //  loadData(1);
        }
    });
}

Ext.define('fjxxWin', {
    extend: 'Ext.window.Window',
    height: 400,
    width: 600,
    layout: {
        type: 'fit'
    },
    id: 'fjxxWin',
    closeAction: 'destroy',
    modal: true,
    title: '房间信息',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'tabpanel',
                activeTab: 0,
                items: [
                    {
                        title: '基本信息',
                        xtype: 'form',
                        id: 'fjxxForm',
                        bodyPadding: 10,
                        items: [
                            {
                                xtype: 'displayfield',
                                name: 'RoomNo',
                                fieldLabel: '房间编号',
                                labelWidth: 90,
                                allowBlank: false,
                                anchor: '100%'
                            },
                            {
                                xtype: 'displayfield',
                                name: 'CompleteAddress',
                                fieldLabel: '房间地址',
                                labelWidth: 90,
                                allowBlank: false,
                                anchor: '100%'
                            },
                            {
                                xtype: 'displayfield',
                                name: 'CompleteAddress',
                                fieldLabel: '房间标签',
                                labelWidth: 90,
                                allowBlank: false,
                                anchor: '100%'
                            }
                        ]
                    },
                    {
                        xtype: 'gridpanel',
                        margin: '0 0 0 0',
                        title: '房间物品',
                        id: 'goodsgrid',
                        store: goodsStore,
                        columnLines: true,
                        border: true,
                        autoscroll: true,
                        columns: [Ext.create('Ext.grid.RowNumberer'),
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
                             }
                        ]
                    },
                     {
                         xtype: 'gridpanel',
                         margin: '0 0 0 0',
                         title: '入住记录',
                         store: rzjlStore,
                         columnLines: true,
                         border: true,
                         autoscroll: true,
                         columns: [Ext.create('Ext.grid.RowNumberer'),
                              {
                                  xtype: 'gridcolumn',
                                  dataIndex: 'RealName',
                                  align: 'center',
                                  text: '房客',
                                  flex: 1,
                                  sortable: false,
                                  menuDisabled: true
                              },

                             {
                                 xtype: 'gridcolumn',
                                 dataIndex: 'CellPhone',
                                 align: 'center',
                                 text: '手机',
                                 width: 100,
                                 sortable: false,
                                 menuDisabled: true
                             },
                             {
                                 xtype: 'datecolumn',
                                 dataIndex: 'LiveStartDate',
                                 format: 'Y-m-d H:i',
                                 align: 'center',
                                 text: '开始时间',
                                 flex: 1,
                                 sortable: false,
                                 menuDisabled: true
                             },
                              {
                                  xtype: 'datecolumn',
                                  dataIndex: 'LiveEndDate',
                                  format: 'Y-m-d H:i',
                                  align: 'center',
                                  text: '结束时间',
                                  flex: 1,
                                  sortable: false,
                                  menuDisabled: true
                              },
                               {
                                   text: '操作',
                                   width: 100,
                                   align: 'center',
                                   sortable: false,
                                   menuDisabled: true,
                                   renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                       var str;
                                       str = "<a href='#' onclick='ckdd(\"" + record.data.AuthorizeNo + "\")'>查看订单</a>";
                                       return str;
                                   }
                               }
                         ]
                     },
                      {
                          xtype: 'gridpanel',
                          margin: '0 0 0 0',
                          title: '物损记录',
                          store: wsStore,
                          columnLines: true,
                          border: true,
                          autoscroll: true,
                          columns: [Ext.create('Ext.grid.RowNumberer'),
                               {
                                   xtype: 'gridcolumn',
                                   dataIndex: 'ServiceRemark',
                                   align: 'center',
                                   text: '物损描述',
                                   flex: 1,
                                   sortable: false,
                                   menuDisabled: true
                               },

                              {
                                  xtype: 'gridcolumn',
                                  dataIndex: 'DamagePrice',
                                  align: 'center',
                                  text: '物损金额',
                                  flex: 1,
                                  sortable: false,
                                  menuDisabled: true
                              },
                              {
                                  xtype: 'datecolumn',
                                  dataIndex: 'FinishTime',
                                  format: 'Y-m-d H:i',
                                  align: 'center',
                                  text: '上报时间',
                                  flex: 1,
                                  sortable: false,
                                  menuDisabled: true
                              }
                          ]
                      },
                      {
                          xtype: 'gridpanel',
                          margin: '0 0 0 0',
                          title: '设备信息',
                          store: sbStore,
                          columnLines: true,
                          border: true,
                          autoscroll: true,
                          columns: [Ext.create('Ext.grid.RowNumberer'),
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
                                }
                          ]
                      },
                       {
                           xtype: 'gridpanel',
                           margin: '0 0 0 0',
                           title: '开锁信息',
                           store: lockStore,
                           columnLines: true,
                           border: true,
                           autoscroll: true,
                           columns: [Ext.create('Ext.grid.RowNumberer'),
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'date',
                                    align: 'center',
                                    text: '开锁日期',
                                    flex: 1,
                                    sortable: false,
                                    menuDisabled: true,
                                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                        var regtime = /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
                                        regtime.test(value);
                                        var t = "20" + RegExp.$1 + "." + RegExp.$2 + "." + RegExp.$3 + " " + RegExp.$4 + ":" + RegExp.$5;
                                        return t;
                                    }
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'type',
                                    align: 'center',
                                    text: '开锁方式',
                                    flex: 1,
                                    sortable: false,
                                    menuDisabled: true,
                                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                        var kaisuostyle = "使用密码开锁";

                                        if (value == "1")
                                            kaisuostyle = "管理密码开锁";
                                        else if (value == "2")
                                            kaisuostyle = "超级管理密码开锁";
                                        else if (value == "3")
                                            kaisuostyle = "钥匙开锁";
                                        else if (value == "4")
                                            kaisuostyle = "应急密码开锁";
                                        else if (value == "5")
                                            kaisuostyle = "超级管理员身份证开锁";
                                        else if (value == "6")
                                            kaisuostyle = "管理员身份证开锁";
                                        else if (value == "7")
                                            kaisuostyle = "授权单密码开锁";
                                        else if (value == "8")
                                            kaisuostyle = "授权单身份证主卡开锁";
                                        else if (value == "9")
                                            kaisuostyle = "授权单身份证副卡开锁";
                                        else if (value == "a")
                                            kaisuostyle = "预设用户密码开锁";
                                        return kaisuostyle;
                                    }
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


