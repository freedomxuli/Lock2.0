var id = queryString.id;
var AuthorizeNo;
var userid;
var RoomId;
var HotelId;

var HotelStore = Ext.create('Ext.data.Store', {
    fields: ['VALUE', 'TEXT'],
    data: [
    ]
});

var RoomStore = Ext.create('Ext.data.Store', {
    fields: ['VALUE', 'TEXT'],
    data: [
    ]
});

var UserStore = Ext.create('Ext.data.Store', {
    fields: ['BJUserId', 'UserName'],
    data: [
    ]
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

function DataBind() {
    CS('CZCLZ.AuthorizeOrderDB.GetAuthorizeOrderById', function (retVal) {
        if (retVal) {


            AuthorizeNo = retVal[0]["AuthorizeNo"];
            userid = retVal[0]["UserId"];
            RoomId = retVal[0]["RoomId"];
            HotelId = retVal[0]["HotelId"];
            CS('CZCLZ.AuthorizeOrderDB.GetRoomCombobox', function (ret) {
                if (retVal) {
                    RoomStore.loadData(ret, true);
                    var addform = Ext.getCmp("addform");
                    addform.form.setValues(retVal[0]);
                    Ext.getCmp("EarliestHour").setValue(getHourMinute(retVal[0]["EarliestDate"]));
                    Ext.getCmp("LatestHour").setValue(getHourMinute(retVal[0]["LatestDate"]));
                    Ext.getCmp("LiveStartHour").setValue(getHourMinute(retVal[0]["LiveStartDate"]));
                    Ext.getCmp("LiveEndHour").setValue(getHourMinute(retVal[0]["LiveEndDate"]));
                    var AuthorStatus = retVal[0]["AuthorStatus"];
                    var AuthorizeBookStatus = retVal[0]["AuthorizeBookStatus"];
                    var AuthorLiveStatus = retVal[0]["AuthorLiveStatus"];
                    Ext.getCmp("ActualTotalPrice").setValue(retVal[0]["LiveTotalPrice"] + retVal[0]["DepositPrice"]);
                    if (AuthorStatus == 1) {
                        Ext.getCmp("sc").show();
                        Ext.getCmp("qx").show();
                        if (AuthorizeBookStatus == 1)
                            Ext.getCmp("qryd").show();
                    }
                    else if (AuthorStatus == 2) {
                        Ext.getCmp("cxxf").show();
                        Ext.getCmp("ys").show();
                        Ext.getCmp("xz").show();
                        Ext.getCmp("tf").show();
                        Ext.getCmp("fkxx").show();
                    }
                    else if (AuthorStatus == 2) {
                        Ext.getCmp("cxxf").show();
                        Ext.getCmp("ys").show();
                        Ext.getCmp("xz").show();
                        Ext.getCmp("tf").show();
                        Ext.getCmp("fkxx").show();
                    }
                    else if (AuthorStatus == 3) {
                        Ext.getCmp("qtsq").show();
                        Ext.getCmp("fwzp").show();
                        Ext.getCmp("fkxx").show();
                        if (AuthorLiveStatus == 5) {
                            CS('CZCLZ.AuthorizeOrderDB.CheckIsJudge', function (retVal) {
                                if (retVal) {
                                    Ext.getCmp("pj").show();
                                }
                            }, CS.onError, AuthorizeNo);
                        }
                        if (AuthorLiveStatus == 6)
                            Ext.getCmp("tfqr").show();
                    }

                    CS('CZCLZ.SystemDB.GetHotelBJList', function (retVal) {
                        if (retVal.status == "ok") {
                            UserStore.loadData(retVal.result, true);
                        }
                    }, CS.onError, RoomId);
                }
            }, CS.onError, HotelId);



        }
    }, CS.onError, id);
}

function getHourMinute(date) {
    date = new Date(date);
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return hour + ":" + minute;
}

function ysAndxz(v) {
    var win = new rzxxWin({ lx: v });
    win.show(null, function () {
        CS('CZCLZ.AuthorizeOrderDB.GetAuthorizeOrderById', function (retVal) {
            if (retVal) {
                var rzxxForm = Ext.getCmp("rzxxForm");
                rzxxForm.form.setValues(retVal[0]);
                if (v == 2)
                    Ext.getCmp("ApplyDay").show();
                else
                    Ext.getCmp("ApplyHour").show();
                if (retVal[0]["ParentRoomNo"] == null || retVal[0]["ParentRoomNo"] == "")
                    Ext.getCmp("ParentRoomNo").setValue(retVal[0].RoomNo);
            }
        }, CS.onError, id);
    });
}

function ckdd(authno) {
    FrameStack.pushFrame({
        url: "AuthorizeOrderDetail.html?AuthorizeNo=" + authno,
        onClose: function (ret) {
            //  loadData(1);
        }
    });
}

Ext.define('rzxxWin', {
    extend: 'Ext.window.Window',
    height: 250,
    width: 400,
    layout: {
        type: 'fit'
    },
    id: 'rzxxWin',
    closeAction: 'destroy',
    modal: true,
    title: '入住信息',
    initComponent: function () {
        var me = this;
        var lx = me.lx;
        me.items = [
            {
                xtype: 'form',
                id: 'rzxxForm',
                frame: true,
                bodyPadding: 10,
                title: '',
                items: [
                    {
                        xtype: 'displayfield',
                        name: 'HotelName',
                        fieldLabel: '宾馆名称',
                        labelWidth: 90,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'displayfield',
                        id: 'ParentRoomNo',
                        name: 'ParentRoomNo',
                        fieldLabel: '房间号',
                        labelWidth: 90,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'displayfield',
                        name: 'RoomNo',
                        fieldLabel: '子房间号',
                        labelWidth: 90,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'displayfield',
                        id: 'UnitPrice',
                        name: 'UnitPrice',
                        fieldLabel: '房价',
                        labelWidth: 90,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'numberfield',
                        hidden: true,
                        id: 'ApplyHour',
                        name: 'ApplyHour',
                        fieldLabel: '申请时间(小时)',
                        labelWidth: 90,
                        allowBlank: false,
                        anchor: '100%',
                        value: 0,
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                var price = Ext.getCmp("UnitPrice").getValue();
                                var time = Ext.getCmp("ApplyHour").getValue();
                                var totleprice = price * time;
                                Ext.getCmp("Money").setValue(totleprice);
                            }
                        }
                    },
                     {
                         xtype: 'numberfield',
                         hidden: true,
                         id: 'ApplyDay',
                         name: 'ApplyDay',
                         fieldLabel: '申请时间(天)',
                         labelWidth: 90,
                         allowBlank: false,
                         anchor: '100%',
                         value: 0,
                         listeners: {
                             change: function (field, newValue, oldValue) {
                                 var price = Ext.getCmp("UnitPrice").getValue();
                                 var time = Ext.getCmp("ApplyDay").getValue();
                                 var totleprice = price * time;
                                 Ext.getCmp("Money").setValue(totleprice);
                             }
                         }
                     },
                    {
                        xtype: 'numberfield',
                        id: 'Money',
                        name: 'Money',
                        fieldLabel: '消费金额',
                        labelWidth: 90,
                        allowBlank: false,
                        anchor: '100%'
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '授权',
                        handler: function () {
                            var form = Ext.getCmp('rzxxForm');
                            if (form.form.isValid()) {
                                var values = form.getValues(false);
                                CS('CZCLZ.AuthorizeOrderDB.AddAuthDetail', function (retVal) {
                                    if (retVal.status == "ok") {
                                        Ext.MessageBox.alert("提示", "授权成功!", function () {
                                            FrameStack.popFrame();
                                        });
                                    }
                                }, CS.onError, values, AuthorizeNo, lx);
                            }
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

Ext.define('tfWin', {
    extend: 'Ext.window.Window',
    height: 250,
    width: 400,
    layout: {
        type: 'fit'
    },
    id: 'tfWin',
    closeAction: 'destroy',
    modal: true,
    title: '退房授权',
    initComponent: function () {
        var me = this;
        var lx = me.lx;
        me.items = [
            {
                xtype: 'form',
                id: 'tfForm',
                frame: true,
                bodyPadding: 10,
                title: '',
                items: [
                    {
                        xtype: 'displayfield',
                        id: 'litdays',
                        name: 'litdays',
                        fieldLabel: '实际入住天数',
                        labelWidth: 90,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'displayfield',
                        id: 'lithours',
                        name: 'lithours',
                        fieldLabel: '实际入住小时',
                        labelWidth: 90,
                        allowBlank: false,
                        anchor: '100%'
                    },

                    {
                        xtype: 'displayfield',
                        id: 'hidConsumeRecordTotal',
                        name: 'hidConsumeRecordTotal',
                        fieldLabel: '入住消费已支付',
                        labelWidth: 90,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'numberfield',
                        id: 'ActualTotalPrice',
                        name: 'ActualTotalPrice',
                        fieldLabel: '实际入住费用',
                        labelWidth: 90,
                        allowBlank: false,
                        anchor: '100%',
                        value: 0,
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                var price1 = newValue;
                                var price2 = Ext.getCmp("hidConsumeRecordTotal").getValue();
                                var totleprice = price2 - price1;
                                Ext.getCmp("RefundPrice").setValue(totleprice);
                            }
                        }
                    },
                     {
                         xtype: 'numberfield',
                         name: 'OtherPrice',
                         fieldLabel: '物损及其他',
                         labelWidth: 90,
                         allowBlank: false,
                         anchor: '100%',
                         value: 0
                     },
                    {
                        xtype: 'numberfield',
                        id: 'RefundPrice',
                        name: 'RefundPrice',
                        fieldLabel: '建议退还',
                        labelWidth: 90,
                        allowBlank: false,
                        anchor: '100%',
                        value: 0
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '确认退房',
                        handler: function () {
                            Ext.MessageBox.confirm('提示', '确认退房？', function (obj) {
                                if (obj == "yes") {
                                    var form = Ext.getCmp('tfForm');
                                    if (form.form.isValid()) {
                                        var values = form.getValues(false);
                                        CS('CZCLZ.AuthorizeOrderDB.AddRefundLive', function (retVal) {
                                            if (retVal.status == "ok") {
                                                Ext.MessageBox.alert("提示", "退房成功", function () {
                                                    FrameStack.popFrame();
                                                });
                                            }
                                        }, CS.onError, values, AuthorizeNo);
                                    }
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

Ext.define('fkxxWin', {
    extend: 'Ext.window.Window',
    height: 250,
    width: 400,
    layout: {
        type: 'fit'
    },
    id: 'fkxxWin',
    closeAction: 'destroy',
    modal: true,
    title: '房客信息',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'fkxxForm',
                frame: true,
                bodyPadding: 10,
                title: '',
                items: [
                    {
                        xtype: 'displayfield',
                        name: 'RealName',
                        fieldLabel: '姓名',
                        labelWidth: 90,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'displayfield',
                        name: 'CellPhone',
                        fieldLabel: '电话号码',
                        labelWidth: 90,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'displayfield',
                        name: 'IDCard',
                        fieldLabel: '身份证号码',
                        labelWidth: 90,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: '下单平台',
                        labelWidth: 90,
                        allowBlank: false,
                        anchor: '100%',
                        value: '微信平台'
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: '信用等级',
                        labelWidth: 90,
                        allowBlank: false,
                        anchor: '100%',
                        value: '5'
                    },
                    {
                        xtype: 'displayfield',
                        name: 'Points',
                        fieldLabel: '入住本店积分',
                        labelWidth: 90,
                        allowBlank: false,
                        anchor: '100%'
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

Ext.define('rwpfWin', {
    extend: 'Ext.window.Window',

    height: 350,
    width: 360,
    layout: {
        type: 'fit'
    },
    id: 'rwpfWin',
    closeAction: 'destroy',
    modal: true,
    title: '任务派发',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'rwpfForm',
                frame: true,
                bodyPadding: 10,

                title: '',
                items: [

                       {
                           xtype: 'combobox',
                           name: 'ServiceType',
                           fieldLabel: '任务类型',
                           anchor: '100%',
                           labelWidth: 70,
                           queryMode: 'local',
                           displayField: 'TEXT',
                           valueField: 'VALUE',
                           store: new Ext.data.ArrayStore({
                               fields: ['TEXT', 'VALUE'],
                               data: [
                                   ['服务员', 1],
                                   ['保洁', 2],
                                   ['维修员', 3],
                                   ['前台客服', 4]
                               ]
                           }),
                           value: 2
                       },
                         {
                             xtype: 'combobox',
                             id: 'rwHotelId',
                             name: 'HotelId',
                             fieldLabel: '指定门店',
                             allowBlank: false,
                             editable: false,
                             anchor: '100%',
                             labelWidth: 70,
                             store: HotelStore,
                             queryMode: 'local',
                             displayField: 'TEXT',
                             valueField: 'VALUE',
                             value: '',
                             listeners: {
                                 'select': function (field, val, obj) {
                                     CS('CZCLZ.AuthorizeOrderDB.GetRoomCombobox', function (retVal) {
                                         if (retVal) {
                                             RoomStore.loadData(retVal, true);
                                         }
                                     }, CS.onError, field.value);
                                 }
                             }
                         },

                        {
                            xtype: 'combobox',
                            id: 'rwRoomId',
                            name: 'RoomId',
                            fieldLabel: '指定房间',
                            allowBlank: false,
                            editable: false,
                            anchor: '100%',
                            labelWidth: 70,
                            store: RoomStore,
                            queryMode: 'local',
                            displayField: 'TEXT',
                            valueField: 'VALUE',
                            listeners: {
                                'select': function (field, val, obj) {
                                    CS('CZCLZ.SystemDB.GetHotelBJList', function (retVal) {
                                        if (retVal.status == "ok") {
                                            UserStore.loadData(retVal.result, true);
                                        }
                                    }, CS.onError, field.value);
                                }
                            }

                        },
                         {
                             xtype: 'combobox',
                             name: 'AssignUserId',
                             fieldLabel: '指定人员',
                             allowBlank: false,
                             editable: false,
                             anchor: '100%',
                             labelWidth: 70,
                             store: UserStore,
                             queryMode: 'local',
                             displayField: 'UserName',
                             valueField: 'BJUserId'

                         },
                           {
                               xtype: 'fieldcontainer',
                               layout: 'column',
                               anchor: '100%',
                               items: [
                                   {
                                       xtype: 'datefield',
                                       name: 'StartTime',
                                       fieldLabel: '开始时间',
                                       labelWidth: 70,
                                       columnWidth: 0.7
                                   },
                                   {
                                       xtype: 'timefield',
                                       name: 'StartTimeHour',
                                       format: 'H:i',
                                       increment: 1,
                                       columnWidth: 0.3
                                   }
                               ]
                           },
                        {
                            xtype: 'fieldcontainer',
                            layout: 'column',
                            anchor: '100%',
                            items: [
                                {
                                    xtype: 'datefield',
                                    name: 'EndTime',
                                    fieldLabel: '结束时间',
                                    labelWidth: 70,
                                    columnWidth: 0.7

                                },
                                {
                                    xtype: 'timefield',
                                    name: 'EndTimeHour',
                                    format: 'H:i',
                                    increment: 1,
                                    columnWidth: 0.3
                                }
                            ]
                        },
                        {
                            xtype: 'textareafield',
                            name: 'Remark',
                            fieldLabel: '备注',
                            labelWidth: 70,
                            height: 80,
                            anchor: '100%'
                        }
                ],
                buttonAlign: 'center',
                buttons: [

                    {
                        text: '任务派发',
                        handler: function () {
                            var form = Ext.getCmp('rwpfForm');
                            if (form.form.isValid()) {
                                var values = form.getValues(false);
                                values["starttime"] = values["StartTime"] + " " + values["StartTimeHour"] + ":00";
                                values["endtime"] = values["EndTime"] + " " + values["EndTimeHour"] + ":00";

                                CS('CZCLZ.SystemDB.ApplyService', function (retVal) {
                                    if (retVal.status == "ok") {
                                        Ext.MessageBox.alert("提示", "派发成功", function () {
                                            Ext.getCmp('rwpfWin').close();
                                        });
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

Ext.define('pjWin', {
    extend: 'Ext.window.Window',
    height: 250,
    width: 400,
    layout: {
        type: 'fit'
    },
    id: 'pjWin',
    closeAction: 'destroy',
    modal: true,
    title: '评价',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'pjForm',
                frame: true,
                bodyPadding: 10,
                title: '',
                items: [
                    {
                        xtype: 'combobox',
                        id: 'score',
                        fieldLabel: '信用评分',
                        anchor: '100%',
                        labelWidth: 90,
                        queryMode: 'local',
                        displayField: 'TEXT',
                        valueField: 'VALUE',
                        store: new Ext.data.ArrayStore({
                            fields: ['TEXT', 'VALUE'],
                            data: [
                                ['5分', 5],
                                ['4分', 4],
                                ['3分', 3],
                                ['2分', 2],
                                ['1分', 1]
                            ]
                        }),
                        value: 5
                    },
                    {
                        xtype: 'textareafield',
                        id: 'context',
                        fieldLabel: '评价',
                        labelWidth: 90,
                        height: 120,
                        anchor: '100%'
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '提交',
                        handler: function () {
                            CS('CZCLZ.AuthorizeOrderDB.ApplyFDJudge', function (retVal) {
                                if (retVal.status == "ok") {
                                    Ext.MessageBox.alert("提示", "提交成功!", function () {
                                        Ext.getCmp("pjWin").close();
                                        Ext.getCmp("pj").hide();
                                    });
                                }
                            }, CS.onError, AuthorizeNo, Ext.getCmp("score").getValue(), Ext.getCmp("context").getValue());
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

Ext.onReady(function () {
    Ext.define('add', {
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
                            type: 'anchor'
                        },
                        autoScroll: true,
                        items: [
                            {
                                xtype: 'form',
                                id: 'addform',
                                layout: {
                                    type: 'column'
                                },
                                border: true,
                                title: '授权信息',
                                items: [
                                        {
                                            xtype: 'textfield',
                                            name: 'ID',
                                            margin: '10 10 10 10',
                                            fieldLabel: '主键ID',
                                            hidden: true,
                                            columnWidth: 0.5,
                                            labelWidth: 80
                                        },
                                         {
                                             xtype: 'combobox',
                                             name: 'PlatType',
                                             margin: '10 10 10 10',
                                             fieldLabel: '下单平台',
                                             allowBlank: false,
                                             columnWidth: 0.5,
                                             labelWidth: 80,
                                             queryMode: 'local',
                                             displayField: 'TEXT',
                                             valueField: 'VALUE',
                                             store: new Ext.data.ArrayStore({
                                                 fields: ['TEXT', 'VALUE'],
                                                 data: [
                                                     ['其他', 0],
                                                     ['E家智宿', 1],
                                                     ['美团', 2],
                                                     ['线下', 3]
                                                 ]
                                             }),
                                             value: 0
                                         },
                                        {
                                            xtype: 'combobox',
                                            margin: '10 10 10 10',
                                            name: 'HotelId',
                                            fieldLabel: '选择门店',
                                            allowBlank: false,
                                            editable: false,
                                            columnWidth: 0.5,
                                            labelWidth: 80,
                                            store: HotelStore,
                                            queryMode: 'local',
                                            displayField: 'TEXT',
                                            valueField: 'VALUE',
                                            value: '',
                                            listeners: {
                                                'select': function (field, val, obj) {
                                                    CS('CZCLZ.AuthorizeOrderDB.GetRoomCombobox', function (retVal) {
                                                        if (retVal) {
                                                            RoomStore.loadData(retVal, true);
                                                        }
                                                    }, CS.onError, field.value);
                                                }
                                            }
                                        },

                                          {
                                              xtype: 'combobox',
                                              margin: '10 10 10 10',
                                              id: 'RoomId',
                                              name: 'RoomId',
                                              fieldLabel: '选择房间',
                                              allowBlank: false,
                                              editable: false,
                                              columnWidth: 0.5,
                                              labelWidth: 80,
                                              store: RoomStore,
                                              queryMode: 'local',
                                              displayField: 'TEXT',
                                              valueField: 'VALUE'

                                          },
                                             {
                                                 xtype: 'combobox',
                                                 name: 'AuthorRoomStyle',
                                                 allowBlank: false,
                                                 margin: '10 10 10 10',
                                                 fieldLabel: '授权房型',
                                                 columnWidth: 0.5,
                                                 labelWidth: 80,
                                                 queryMode: 'local',
                                                 displayField: 'TEXT',
                                                 valueField: 'VALUE',
                                                 store: new Ext.data.ArrayStore({
                                                     fields: ['TEXT', 'VALUE'],
                                                     data: [
                                                         ['全天房', 1],
                                                         ['钟点房', 2],
                                                         ['看房', 3]
                                                     ]
                                                 }),
                                                 value: 1,
                                                 listeners: {
                                                     'select': function (field, val, obj) {
                                                         if (field.value == 1) {
                                                             Ext.getCmp("LiveDays").show();
                                                             Ext.getCmp("LiveHour").hide();

                                                         }
                                                         else if (field.value == 2) {
                                                             Ext.getCmp("LiveDays").hide();
                                                             Ext.getCmp("LiveHour").show();
                                                         }
                                                     }
                                                 }
                                             },
                                          {
                                              xtype: 'textfield',
                                              name: 'RealName',
                                              allowBlank: false,
                                              margin: '10 10 10 10',
                                              fieldLabel: '姓名',
                                              columnWidth: 0.5,
                                              labelWidth: 80

                                          },

                                         {
                                             xtype: 'textfield',
                                             name: 'CellPhone',
                                             allowBlank: false,
                                             margin: '10 10 10 10',
                                             fieldLabel: '手机号码',
                                             columnWidth: 0.5,
                                             labelWidth: 80

                                         },
                                          {
                                              xtype: 'datefield',
                                              name: 'EarliestDate',
                                              allowBlank: false,
                                              format: 'Y-m-d',
                                              margin: '10 10 10 10',
                                              fieldLabel: '最早到店时间',
                                              columnWidth: 0.25,
                                              labelWidth: 80

                                          },
                                             {
                                                 xtype: 'timefield',
                                                 id: 'EarliestHour',
                                                 name: 'EarliestHour',
                                                 allowBlank: false,
                                                 format: 'H:i',
                                                 increment: 1,
                                                 margin: '10 10 10 0',
                                                 columnWidth: 0.25,
                                                 value: '0'

                                             },
                                              {
                                                  xtype: 'datefield',
                                                  allowBlank: false,
                                                  name: 'LatestDate',
                                                  format: 'Y-m-d',
                                                  margin: '10 10 10 10',
                                                  fieldLabel: '最早到店时间',
                                                  columnWidth: 0.25,
                                                  labelWidth: 80

                                              },
                                             {
                                                 xtype: 'timefield',
                                                 id: 'LatestHour',
                                                 name: 'LatestHour',
                                                 allowBlank: false,
                                                 format: 'H:i',
                                                 increment: 1,
                                                 margin: '10 10 10 0',
                                                 columnWidth: 0.25,
                                                 value: '0'

                                             },
                                          {
                                              xtype: 'datefield',
                                              name: 'LiveStartDate',
                                              allowBlank: false,
                                              format: 'Y-m-d',
                                              margin: '10 10 10 10',
                                              fieldLabel: '入住时间',
                                              columnWidth: 0.25,
                                              labelWidth: 80

                                          },
                                          {
                                              xtype: 'timefield',
                                              id: 'LiveStartHour',
                                              name: 'LiveStartHour',
                                              allowBlank: false,
                                              format: 'H:i',
                                              increment: 1,
                                              margin: '10 10 10 0',
                                              columnWidth: 0.25,
                                              value: '0'

                                          },

                                           {
                                               xtype: 'numberfield',
                                               id: 'LiveDays',
                                               name: 'LiveDays',
                                               margin: '10 10 10 10',
                                               fieldLabel: '入住天数',
                                               columnWidth: 0.5,
                                               labelWidth: 80

                                           },
                                           {
                                               xtype: 'combobox',
                                               id: 'LiveHour',
                                               name: 'LiveHour',
                                               hidden: true,
                                               margin: '10 10 10 10',
                                               fieldLabel: '钟点房时长',
                                               columnWidth: 0.5,
                                               labelWidth: 80,
                                               queryMode: 'local',
                                               displayField: 'TEXT',
                                               valueField: 'VALUE',
                                               store: new Ext.data.ArrayStore({
                                                   fields: ['TEXT', 'VALUE'],
                                                   data: [
                                                       ['3小时', 3],
                                                       ['4小时', 4],
                                                       ['5小时', 5]
                                                   ]
                                               })
                                           },
                                              {
                                                  xtype: 'datefield',
                                                  name: 'LiveEndDate',
                                                  allowBlank: false,
                                                  format: 'Y-m-d',
                                                  margin: '10 10 10 10',
                                                  fieldLabel: '退房时间',
                                                  columnWidth: 0.25,
                                                  labelWidth: 80

                                              },
                                          {
                                              xtype: 'timefield',
                                              id: 'LiveEndHour',
                                              name: 'LiveEndHour',
                                              allowBlank: false,
                                              format: 'H:i',
                                              increment: 1,
                                              margin: '10 10 10 0',
                                              columnWidth: 0.25,
                                              value: '0'

                                          },


                                                {
                                                    xtype: 'combobox',
                                                    margin: '10 10 10 10',
                                                    name: 'TakepowerType',
                                                    fieldLabel: '取电方式',
                                                    allowBlank: false,
                                                    columnWidth: 0.5,
                                                    labelWidth: 80,
                                                    queryMode: 'local',
                                                    displayField: 'TEXT',
                                                    valueField: 'VALUE',
                                                    store: new Ext.data.ArrayStore({
                                                        fields: ['TEXT', 'VALUE'],
                                                        data: [
                                                            ['身份证', 1],
                                                            ['无条件取电', 2]
                                                        ]
                                                    }),
                                                    value: 1
                                                },
                                                 {
                                                     xtype: 'combobox',
                                                     margin: '10 10 10 10',
                                                     name: 'UnlockType',
                                                     fieldLabel: '开锁方式',
                                                     allowBlank: false,
                                                     columnWidth: 0.5,
                                                     labelWidth: 80,
                                                     queryMode: 'local',
                                                     displayField: 'TEXT',
                                                     valueField: 'VALUE',
                                                     store: new Ext.data.ArrayStore({
                                                         fields: ['TEXT', 'VALUE'],
                                                         data: [
                                                             ['身份证', 1],
                                                             ['组合', 2]
                                                         ]
                                                     }),
                                                     value: 1
                                                 },
                                                   {
                                                       xtype: 'numberfield',
                                                       name: 'UnitPrice',
                                                       margin: '10 10 10 10',
                                                       fieldLabel: '房费(单价)',
                                                       allowBlank: false,
                                                       columnWidth: 0.5,
                                                       labelWidth: 80

                                                   },
                                                     {
                                                         xtype: 'numberfield',
                                                         name: 'LiveTotalPrice',
                                                         margin: '10 10 10 10',
                                                         fieldLabel: '房费(总价)',
                                                         allowBlank: false,
                                                         columnWidth: 0.5,
                                                         labelWidth: 80

                                                     },
                                                       {
                                                           xtype: 'numberfield',
                                                           name: 'DepositPrice',
                                                           margin: '10 10 10 10',
                                                           allowBlank: false,
                                                           fieldLabel: '押金',
                                                           columnWidth: 0.5,
                                                           labelWidth: 80

                                                       },
                                                         {
                                                             xtype: 'numberfield',
                                                             id: 'ActualTotalPrice',
                                                             name: 'ActualTotalPrice',
                                                             allowBlank: false,
                                                             margin: '10 10 10 10',
                                                             fieldLabel: '合计',
                                                             columnWidth: 0.5,
                                                             labelWidth: 80

                                                         }
                                ]

                            }
                        ],
                        buttonAlign: 'center',
                        buttons: [
                            {
                                text: '保存',
                                id: 'bc',
                                hidden: true,
                                handler: function () {
                                    var form = Ext.getCmp('addform');
                                    if (form.form.isValid()) {
                                        var values = form.getValues(false);
                                        var senddata = {};
                                        senddata.roomid = values["RoomId"];
                                        senddata.phone = values["CellPhone"];
                                        senddata.realname = values["RealName"];
                                        senddata.plattype = values["PlatType"];
                                        senddata.roomstyle = values["AuthorRoomStyle"];
                                        senddata.earlydate = values["EarliestDate"] + " " + values["EarliestHour"] + ":00";
                                        senddata.latestdate = values["LatestDate"] + " " + values["LatestHour"] + ":00";
                                        senddata.livestartdate = values["LiveStartDate"] + " " + values["LiveStartHour"] + ":00";
                                        senddata.liveenddate = values["LiveEndDate"] + " " + values["LiveEndHour"] + ":00";
                                        if (senddata.roomstyle != 3) {
                                            //全天与钟点房的预留开始时间与入住时间一致
                                            senddata.earlydate = senddata.livestartdate;
                                        }
                                        senddata.timelong = 0;
                                        if (senddata.roomstyle == 1)
                                            senddata.timelong = values["LiveDays"];//天数
                                        else if (senddata.roomstyle == 2)
                                            senddata.timelong = values["LiveHour"];//小时数
                                        senddata.takepowertype = values["TakepowerType"];
                                        senddata.unlocktype = values["TakepowerType"];
                                        senddata.takepowertype = values["UnlockType"];

                                        senddata.unitprice = values["UnitPrice"];
                                        senddata.livetotalprice = values["LiveTotalPrice"];
                                        senddata.depositprice = values["DepositPrice"];
                                        senddata.consumerecordtotal = values["ActualTotalPrice"];

                                        CS('CZCLZ.AuthorizeOrderDB.SubmitAuthorizeOrder', function (retVal) {
                                            if (retVal.status == "ok") {
                                                Ext.MessageBox.alert("提示", "保存成功", function () {
                                                    FrameStack.popFrame();
                                                });
                                            }
                                        }, CS.onError, senddata);
                                    }
                                }

                            },
                              {
                                  text: '确认预订',
                                  id: 'qryd',
                                  hidden: true,
                                  handler: function () {
                                      Ext.MessageBox.confirm('提示', '确认预定？', function (obj) {
                                          if (obj == "yes") {
                                              CS('CZCLZ.AuthorizeOrderDB.ConfirmBook2', function (retVal) {
                                                  if (retVal.status == "ok") {
                                                      Ext.MessageBox.alert("提示", "预定成功!", function () {
                                                          FrameStack.popFrame();
                                                      });
                                                  }
                                              }, CS.onError, AuthorizeNo, userid);
                                          }
                                      });
                                  }

                              },
                               {
                                   text: '重新下发',
                                   id: 'cxxf',
                                   hidden: true,
                                   handler: function () {
                                       Ext.MessageBox.confirm('提示', '确认重新下发？', function (obj) {
                                           if (obj == "yes") {
                                               CS('CZCLZ.AuthorizeOrderDB.SendCMDAgain', function (retVal) {
                                                   if (retVal.status == "ok") {
                                                       Ext.MessageBox.alert("提示", "下发成功!", function () {
                                                           FrameStack.popFrame();
                                                       });
                                                   }
                                               }, CS.onError, AuthorizeNo);
                                           }
                                       });
                                   }
                               },
                               {
                                   text: '延时',
                                   id: 'ys',
                                   hidden: true,
                                   handler: function () {
                                       ysAndxz(3);
                                   }
                               },
                                {
                                    text: '续住',
                                    id: 'xz',
                                    hidden: true,
                                    handler: function () {
                                        ysAndxz(2);
                                    }
                                },
                                {
                                    text: '退房',
                                    id: 'tf',
                                    hidden: true,
                                    handler: function () {
                                        var win = new tfWin();
                                        win.show(null, function () {
                                            CS('CZCLZ.AuthorizeOrderDB.ReFundMoney', function (retVal) {
                                                if (retVal.status == "ok") {
                                                    Ext.getCmp("litdays").setValue(retVal.info["litdays"]);
                                                    Ext.getCmp("lithours").setValue(retVal.info["lithours"]);
                                                    Ext.getCmp("hidConsumeRecordTotal").setValue(retVal.info["hidConsumeRecordTotal"]);
                                                    Ext.getCmp("ActualTotalPrice").setValue(retVal.info["txtActualTotalPrice"]);
                                                    Ext.getCmp("RefundPrice").setValue(retVal.info["txtRefundPrice"]);
                                                }
                                            }, CS.onError, AuthorizeNo);
                                        });
                                    }
                                },
                                {
                                    text: '强退授权',
                                    id: 'qtsq',
                                    hidden: true,
                                    handler: function () {
                                        Ext.MessageBox.confirm('提示', '是否重新下发退房授权单？', function (obj) {
                                            if (obj == "yes") {
                                                CS('CZCLZ.AuthorizeOrderDB.SendCMDAgainTF', function (retVal) {
                                                    if (retVal.status == "ok") {
                                                        Ext.MessageBox.alert("提示", "下发成功!", function () {
                                                            FrameStack.popFrame();
                                                        });
                                                    }
                                                }, CS.onError, AuthorizeNo);
                                            }
                                        });
                                    }

                                },
                             {
                                 text: '服务指派',
                                 id: 'fwzp',
                                 hidden: true,
                                 handler: function () {
                                     var win = new rwpfWin();
                                     win.show(null, function () {
                                         Ext.getCmp("rwHotelId").setValue(HotelId);
                                         Ext.getCmp("rwRoomId").setValue(RoomId);
                                     });
                                 }

                             },
                               {
                                   text: '评价',
                                   id: 'pj',
                                   hidden: true,
                                   handler: function () {
                                       var win = new pjWin();
                                       win.show();
                                   }
                               },
                             {
                                 text: '退房确认',
                                 id: 'tfqr',
                                 hidden: true,
                                 handler: function () {
                                     var win = new tfWin();
                                     win.show(null, function () {
                                         CS('CZCLZ.AuthorizeOrderDB.ReFundMoney', function (retVal) {
                                             if (retVal.status == "ok") {
                                                 Ext.getCmp("litdays").setValue(retVal.info["litdays"]);
                                                 Ext.getCmp("lithours").setValue(retVal.info["lithours"]);
                                                 Ext.getCmp("hidConsumeRecordTotal").setValue(retVal.info["hidConsumeRecordTotal"]);
                                                 Ext.getCmp("ActualTotalPrice").setValue(retVal.info["txtActualTotalPrice"]);
                                                 Ext.getCmp("RefundPrice").setValue(retVal.info["txtRefundPrice"]);
                                             }
                                         }, CS.onError, AuthorizeNo);
                                     });
                                 }
                             },
                             {
                                 text: '删除',
                                 id: 'sc',
                                 hidden: true,
                                 handler: function () {
                                     Ext.MessageBox.confirm('提示', '确认删除？', function (obj) {
                                         if (obj == "yes") {
                                             CS('CZCLZ.AuthorizeOrderDB.CancelAuthorizeOrder', function (retVal) {
                                                 if (retVal.status == "ok") {
                                                     Ext.MessageBox.alert("提示", "删除成功!", function () {
                                                         FrameStack.popFrame();
                                                     });
                                                 }
                                             }, CS.onError, id, 1);
                                         }
                                     });
                                 }

                             },
                             {
                                 text: '取消',
                                 id: 'qx',
                                 hidden: true,
                                 handler: function () {
                                     Ext.MessageBox.confirm('提示', '确认取消？', function (obj) {
                                         if (obj == "yes") {
                                             CS('CZCLZ.AuthorizeOrderDB.CancelAuthorizeOrder', function (retVal) {
                                                 if (retVal.status == "ok") {
                                                     Ext.MessageBox.alert("提示", "取消成功!", function () {
                                                         FrameStack.popFrame();
                                                     });
                                                 }
                                             }, CS.onError, id, 2);
                                         }
                                     });
                                 }

                             },
                              {
                                  text: '房客信息',
                                  id: 'fkxx',
                                  //  hidden: true,
                                  handler: function () {
                                      var win = new fkxxWin();
                                      win.show(null, function () {
                                          CS('CZCLZ.AuthorizeOrderDB.GetMemberInfo', function (retVal) {
                                              if (retVal) {
                                                  var fkxxForm = Ext.getCmp("fkxxForm");
                                                  fkxxForm.form.setValues(retVal[0]);
                                              }
                                          }, CS.onError, id);
                                      });
                                  }

                              },

                                {
                                    text: '房间信息',
                                    id: 'fjxx',
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
                                            }, CS.onError, RoomId);

                                            CS('CZCLZ.RoomDB.GetRoomGoods', function (retVal) {
                                                goodsStore.loadData(retVal);
                                            }, CS.onError, RoomId);

                                            CS('CZCLZ.AuthorizeOrderDB.GetLockRecord', function (retVal) {
                                                if (retVal.status)
                                                    lockStore.loadData(retVal.dt);
                                            }, CS.onError, RoomId);
                                        });
                                    }

                                },
                            {
                                text: '返回',
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
    new add();

    CS('CZCLZ.AuthorizeOrderDB.GetHotelCombobox', function (retVal) {
        if (retVal) {
            HotelStore.loadData(retVal, true);
            if (id != null && id != "") {

                DataBind();

            }
            else {
                Ext.getCmp("bc").show();
            }
        }
    }, CS.onError);
});