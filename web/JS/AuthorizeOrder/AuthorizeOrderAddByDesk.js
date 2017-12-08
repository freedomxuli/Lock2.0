var roomid = queryString.roomid;
var AuthorizeNo;
var userid;
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

var hourStore = Ext.create('Ext.data.Store', {
    fields: ['TEXT', 'VALUE']
});

function getHourMinute(date) {
    date = new Date(date);
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return hour + ":" + minute;
}

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
                            type: 'vbox',
                            align: 'center'
                        },
                        autoScroll: true,
                        title: '新增授权',
                        items: [
                            {
                                xtype: 'form',
                                id: 'addform',
                                layout: {
                                    type: 'column'
                                },
                                width: 850,
                                border: false,
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
                                                ['E家智宿', 1],
                                                ['美团', 2],
                                                ['线下', 3],
                                                ['其他', 0]
                                            ]
                                        }),
                                        value: 1
                                    },
                                    {
                                        xtype: 'combobox',
                                        margin: '10 10 10 10',
                                        name: 'HotelId',
                                        id: 'HotelId',
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
                                        readOnly:true
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
                                        readOnly: true,
                                        queryMode: 'local',
                                        displayField: 'TEXT',
                                        valueField: 'VALUE'
                                    },
                                    {
                                        xtype: 'combobox',
                                        id: 'AuthorRoomStyle',
                                        name: 'AuthorRoomStyle',
                                        allowBlank: false,
                                        margin: '10 10 10 10',
                                        fieldLabel: '授权房型',
                                        columnWidth: 0.5,
                                        labelWidth: 80,
                                        queryMode: 'local',
                                        displayField: 'TEXT',
                                        valueField: 'VALUE',
                                        editable: false,
                                        store: new Ext.data.ArrayStore({
                                            fields: ['TEXT', 'VALUE'],
                                            data: [
                                                ['全天房', 1],
                                                ['钟点房', 2],
                                                ['月租房', 4]
                                                //['看房', 3]
                                            ]
                                        }),
                                        value: 1,
                                        listeners: {
                                            'select': function (field, val, obj) {
                                                if (field.value == 1) {
                                                    Ext.getCmp("UnitPrice").setValue(0);
                                                    Ext.getCmp("LiveDays").show();
                                                    Ext.getCmp("LiveHour").hide();
                                                    Ext.getCmp("LiveMonths").hide();
                                                }
                                                else if (field.value == 2) {
                                                    Ext.getCmp("UnitPrice").setValue(0);
                                                    Ext.getCmp("LiveDays").hide();
                                                    Ext.getCmp("LiveHour").show();
                                                    Ext.getCmp("LiveMonths").hide();
                                                } else if (field.value == 4) {
                                                    Ext.getCmp("UnitPrice").setValue(0);
                                                    Ext.getCmp("LiveDays").hide();
                                                    Ext.getCmp("LiveHour").hide();
                                                    Ext.getCmp("LiveMonths").show();
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'datefield',
                                        name: 'LiveStartDate',
                                        id: 'LiveStartDate',
                                        allowBlank: false,
                                        format: 'Y-m-d',
                                        margin: '10 10 10 10',
                                        fieldLabel: '入住时间',
                                        columnWidth: 0.25,
                                        labelWidth: 80,
                                        listeners: {
                                            change: function (obj, newValue, oldValue, eOpts) {
                                                if (oldValue != undefined) {
                                                    CalculateTimeAndPrice();
                                                }
                                            }
                                        }
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
                                        value: '0',
                                        listeners: {
                                            change: function (obj, newValue, oldValue, eOpts) {
                                                if (oldValue != undefined) {
                                                    CalculateTimeAndPrice();
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'numberfield',
                                        id: 'LiveDays',
                                        name: 'LiveDays',
                                        margin: '10 10 10 10',
                                        fieldLabel: '入住天数',
                                        minValue: 1,
                                        value:1,
                                        columnWidth: 0.5,
                                        labelWidth: 80,
                                        listeners: {
                                            change: function (obj, newValue, oldValue, eOpts) {
                                                if (oldValue != undefined) {
                                                    CalculateTimeAndPrice();
                                                }
                                            }
                                        }
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
                                        editable: false,
                                        store: hourStore,
                                        listeners: {
                                            change: function (obj, newValue, oldValue, eOpts) {
                                                if (oldValue != undefined) {
                                                    Ext.getCmp("UnitPrice").setValue(0);
                                                    CalculateTimeAndPrice();
                                                }
                                            }
                                        }

                                    },
                                    {
                                        xtype: 'numberfield',
                                        id: 'LiveMonths',
                                        name: 'LiveMonths',
                                        hidden: true,
                                        margin: '10 10 10 10',
                                        fieldLabel: '入住月数',
                                        minValue: 1,
                                        value: 1,
                                        columnWidth: 0.5,
                                        labelWidth: 80,
                                        listeners: {
                                            change: function (obj, newValue, oldValue, eOpts) {
                                                if (oldValue != undefined) {
                                                    CalculateTimeAndPrice();
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'datefield',
                                        name: 'LiveEndDate',
                                        id: 'LiveEndDate',
                                        allowBlank: false,
                                        format: 'Y-m-d',
                                        margin: '10 10 10 10',
                                        fieldLabel: '退房时间',
                                        columnWidth: 0.25,
                                        readOnly:true,
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
                                        readOnly: true,
                                        value: '0'

                                    },
                                    {
                                        xtype: 'datefield',
                                        allowBlank: false,
                                        id: 'LatestDate',
                                        name: 'LatestDate',
                                        format: 'Y-m-d',
                                        margin: '10 10 10 10',
                                        fieldLabel: '最晚到店时间',
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
                                        xtype: 'textfield',
                                        id: 'RealName',
                                        name: 'RealName',
                                        allowBlank: false,
                                        margin: '10 10 10 10',
                                        fieldLabel: '姓名',
                                        columnWidth: 0.5,
                                        labelWidth: 80
                                    },
                                    {
                                        xtype: 'textfield',
                                        id: 'CellPhone',
                                        name: 'CellPhone',
                                        allowBlank: false,
                                        margin: '10 10 10 10',
                                        fieldLabel: '手机号码',
                                        columnWidth: 0.5,
                                        labelWidth: 80,
                                        listeners: {
                                            blur: function () {
                                                if (Ext.getCmp("RealName").getValue() == "" || Ext.getCmp("RealName").getValue() == null)
                                                {
                                                    CS('CZCLZ.AuthorizeOrderDB.GetRealNameByCellPhone', function (retVal) {
                                                        if (retVal)
                                                        {
                                                            Ext.getCmp("RealName").setValue(retVal);
                                                        }
                                                    }, CS.onError, Ext.getCmp("CellPhone").getValue());
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'datefield',
                                        id: 'EarliestDate',
                                        name: 'EarliestDate',
                                        allowBlank: false,
                                        hidden:true,
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
                                        hidden: true,
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
                                        id: 'UnitPrice',
                                        name: 'UnitPrice',
                                        margin: '10 10 10 10',
                                        fieldLabel: '房费(单价)',
                                        allowBlank: false,
                                        columnWidth: 0.5,
                                        labelWidth: 80,
                                        listeners: {
                                            change: function (obj, newValue, oldValue, eOpts) {
                                                if (oldValue != undefined) {
                                                    CalculateTimeAndPrice();
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'numberfield',
                                        id: 'LiveTotalPrice',
                                        name: 'LiveTotalPrice',
                                        margin: '10 10 10 10',
                                        fieldLabel: '房费(总价)',
                                        allowBlank: false,
                                        columnWidth: 0.5,
                                        labelWidth: 80

                                    },
                                    {
                                        xtype: 'numberfield',
                                        id: 'DepositPrice',
                                        name: 'DepositPrice',
                                        margin: '10 10 10 10',
                                        allowBlank: false,
                                        fieldLabel: '押金',
                                        columnWidth: 0.5,
                                        labelWidth: 80,
                                        listeners: {
                                            change: function (obj, newValue, oldValue, eOpts) {
                                                if (oldValue != undefined) {
                                                    CalculateTimeAndPrice();
                                                }
                                            }
                                        }
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
                                text: '确认',
                                id: 'bc',
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

    dataBind();

    function dataBind() {
        CS('CZCLZ.AuthorizeOrderDB.GetHotelAndRoomDetails', function (retVal) {
            if (retVal) {
                HotelStore.loadData(retVal.dt_hotel);
                RoomStore.loadData(retVal.dt_room);
                hourStore.loadData(retVal.dt_hour);
                HotelId = retVal.dt_hotel[0]["VALUE"];
                Ext.getCmp("HotelId").setValue(retVal.dt_hotel[0]["VALUE"]);
                Ext.getCmp("RoomId").setValue(retVal.dt_room[0]["VALUE"]);
                if (retVal.dt_hour.length > 0)
                    Ext.getCmp("LiveHour").setValue(retVal.dt_hour[0]["VALUE"]);
                Ext.getCmp("LiveStartDate").setValue(new Date());
                Ext.getCmp("LiveStartHour").setValue(new Date().Format("hh:mm"));
                var UnitPrice = 0;
                if (Ext.getCmp("UnitPrice").getValue() != "" && Ext.getCmp("UnitPrice").getValue() != null)
                    UnitPrice = Ext.getCmp("UnitPrice").getValue();
                var DepositPrice = 0;
                if (Ext.getCmp("DepositPrice").getValue() != "" && Ext.getCmp("DepositPrice").getValue() != null)
                    DepositPrice = Ext.getCmp("DepositPrice").getValue();
                CS("CZCLZ.AuthorizeOrderDB.CalculateTimeAndPrice", function (ret) {
                    if (ret) {
                        Ext.getCmp("LiveEndDate").setValue(new Date(ret.LiveEndDate));
                        Ext.getCmp("LiveEndHour").setValue("12:00");
                        Ext.getCmp("EarliestDate").setValue(new Date(ret.EarliestDate));
                        Ext.getCmp("EarliestHour").setValue(new Date(ret.EarliestDate).Format("hh:mm"));
                        Ext.getCmp("LatestDate").setValue(new Date(ret.LatestDate));
                        Ext.getCmp("LatestHour").setValue("11:00");
                        Ext.getCmp("UnitPrice").setValue(ret.UnitPrice);
                        Ext.getCmp("DepositPrice").setValue(ret.DepositPrice);
                        Ext.getCmp("LiveTotalPrice").setValue(ret.LiveTotalPrice);
                        Ext.getCmp("ActualTotalPrice").setValue(ret.ActualTotalPrice);
                    }
                }, CS.onError, retVal.dt_hotel[0]["VALUE"], roomid, Ext.getCmp("AuthorRoomStyle").getValue(), Ext.getCmp("LiveStartDate").getValue(), new Date(Ext.getCmp("LiveStartHour").getValue()).Format("hh:mm"), Ext.getCmp("LiveDays").getValue(), Ext.getCmp("LiveHour").getValue(), Ext.getCmp("LiveMonths").getValue(), UnitPrice, DepositPrice);
            }
        }, CS.onError, roomid);
    }
});

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function CalculateTimeAndPrice() {
    var UnitPrice = 0;
    alert(Ext.getCmp("UnitPrice").getValue());
    if (Ext.getCmp("UnitPrice").getValue() != "" && Ext.getCmp("UnitPrice").getValue() != null)
        UnitPrice = Ext.getCmp("UnitPrice").getValue();
    var DepositPrice = 0;
    if (Ext.getCmp("DepositPrice").getValue() != "" && Ext.getCmp("DepositPrice").getValue() != null)
        DepositPrice = Ext.getCmp("DepositPrice").getValue();
    CS("CZCLZ.AuthorizeOrderDB.CalculateTimeAndPrice", function (ret) {
        if (ret) {
            Ext.getCmp("LiveEndDate").setValue(new Date(ret.LiveEndDate));
            if (Ext.getCmp("AuthorRoomStyle").getValue() == "1" || Ext.getCmp("AuthorRoomStyle").getValue() == "4")
                Ext.getCmp("LiveEndHour").setValue("12:00");
            else if (Ext.getCmp("AuthorRoomStyle").getValue() == "2")
                Ext.getCmp("LiveEndHour").setValue(ret.LiveEndDateHour);
            Ext.getCmp("EarliestDate").setValue(new Date(ret.EarliestDate));
            Ext.getCmp("EarliestHour").setValue(new Date(ret.EarliestDate).Format("hh:mm"));
            Ext.getCmp("LatestDate").setValue(new Date(ret.LatestDate));
            if (Ext.getCmp("AuthorRoomStyle").getValue() == "1" || Ext.getCmp("AuthorRoomStyle").getValue() == "4")
                Ext.getCmp("LatestHour").setValue("11:00");
            else if (Ext.getCmp("AuthorRoomStyle").getValue() == "2")
                Ext.getCmp("LatestHour").setValue(ret.LatestDateHour);
            Ext.getCmp("UnitPrice").setValue(ret.UnitPrice);
            Ext.getCmp("DepositPrice").setValue(ret.DepositPrice);
            Ext.getCmp("LiveTotalPrice").setValue(ret.LiveTotalPrice);
            Ext.getCmp("ActualTotalPrice").setValue(ret.ActualTotalPrice); 
        }
    }, CS.onError, HotelId, roomid, Ext.getCmp("AuthorRoomStyle").getValue(), Ext.getCmp("LiveStartDate").getValue(), new Date(Ext.getCmp("LiveStartHour").getValue()).Format("hh:mm"), Ext.getCmp("LiveDays").getValue(), Ext.getCmp("LiveHour").getValue(), Ext.getCmp("LiveMonths").getValue(), UnitPrice, DepositPrice);
}