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
                                                ['月租房', 4],
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
                                        xtype: 'datefield',
                                        name: 'LiveStartDate',
                                        id: 'LiveStartDate',
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
                                        minValue: 1,
                                        value:1,
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
                                        xtype: 'numberfield',
                                        id: 'LiveDays',
                                        name: 'LiveDays',
                                        hidden: true,
                                        margin: '10 10 10 10',
                                        fieldLabel: '入住月数',
                                        minValue: 1,
                                        value: 1,
                                        columnWidth: 0.5,
                                        labelWidth: 80
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

    CS('CZCLZ.AuthorizeOrderDB.GetHotelAndRoomDetails', function (retVal) {
        if (retVal) {
            HotelStore.loadData(retVal.dt_hotel);
            RoomStore.loadData(retVal.dt_room);
            Ext.getCmp("HotelId").setValue(retVal.dt_hotel[0]["VALUE"]);
            Ext.getCmp("RoomId").setValue(retVal.dt_room[0]["VALUE"]);
            Ext.getCmp("LiveStartDate").setValue(new Date());
            Ext.getCmp("LiveStartHour").setValue(new Date().Format("hh:mm"));
            CS("CZCLZ.AuthorizeOrderDB.CalculateTimeAndPrice", function (ret) {
                if (ret) {

                }
            }, CS.onError, retVal.dt_hotel[0]["VALUE"], roomid, Ext.getCmp("LiveStartDate").getValue(), Ext.getCmp("LiveStartHour").getValue(), Ext.getCmp("LiveDays").getValue(), Ext.getCmp("LiveHour").getValue(), Ext.getCmp("LiveMonth").getValue());
        }
    }, CS.onError, roomid);
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