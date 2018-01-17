var pageSize = 15;
var RoomId;
var zt = queryString.zt;

//************************************数据源*****************************************

var store = createSFW4Store({
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'ID' },
       { name: 'RoomNo' },
       { name: 'AuthorizeNo' },
       { name: 'HotelName' },
       { name: 'ApplyRealName' },
       { name: 'StartTime' },
       { name: 'EndTime' },
       { name: 'ServiceStatus' },
       { name: 'Remark' },
       { name: 'ServiceRemark' },
       { name: 'FinishTime' },
       { name: 'IsDamage' }

    ],
    //sorters: [{ property: 'b', direction: 'DESC'}],
    onPageChange: function (sto, nPage, sorters) {
        loadData(nPage);
    }
});

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


function loadData(nPage) {
    var AuthorizeNo = Ext.getCmp("AuthorizeNo").getValue();
    var RoomNo = Ext.getCmp("RoomNo").getValue();
    var ServiceStatus = Ext.getCmp("ServiceStatus").getValue();

    CS('CZCLZ.SystemDB.GetTaskList', function (retVal) {
        store.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, AuthorizeNo, RoomNo, ServiceStatus);
}

function cl(id) {
    var win = new addWin();
    win.show(null, function () {
        CS('CZCLZ.SystemDB.GetTask', function (retVal) {
            CS('CZCLZ.AuthorizeOrderDB.GetRoomCombobox', function (retVal1) {
                if (retVal) {
                    RoomStore.loadData(retVal1, true);
                    Ext.getCmp('addForm').form.setValues(retVal[0]);
                    Ext.getCmp("StartTimeHour").setValue(getHourMinute(retVal[0]["StartTime"]));
                    Ext.getCmp("EndTimeHour").setValue(getHourMinute(retVal[0]["EndTime"]));

                }
            }, CS.onError, retVal[0]["HotelId"]);

            CS('CZCLZ.SystemDB.GetHotelBJList', function (retVal2) {
                if (retVal2.status == "ok") {
                    UserStore.loadData(retVal2.result, true);
                }
            }, CS.onError, retVal[0]["RoomId"]);

        }, CS.onError, id);
    });
}

function getHourMinute(date) {
    date = new Date(date);
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return hour + ":" + minute;
}

Ext.define('addWin', {
    extend: 'Ext.window.Window',

    height: 380,
    width: 360,
    layout: {
        type: 'fit'
    },
    id: 'addWin',
    closeAction: 'destroy',
    modal: true,
    title: '任务派发',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'addForm',
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
                             valueField: 'BJUserId',
                             listeners: {
                                 'select': function (field, val, obj) {
                                     CS('CZCLZ.SystemDB.GetBjXX', function (retVal) {
                                         if (retVal) {
                                             Ext.getCmp("bjname").setValue(retVal[0]["RealName"]);
                                             Ext.getCmp("dclrw").setValue(retVal[0]["Num"] + "条");
                                         }
                                     }, CS.onError, field.value);
                                 }
                             }

                         },
                         {
                             xtype: 'textfield',
                             fieldLabel: '姓名',
                             editable: false,
                             id: 'bjname',
                             anchor: '100%',
                             labelWidth: 70
                         },
                         {
                             xtype: 'textfield',
                             fieldLabel: '待处理任务',
                             editable: false,
                             id: 'dclrw',
                             anchor: '100%',
                             labelWidth: 70
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
                                       id: 'StartTimeHour',
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
                                    id: 'EndTimeHour',
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
                            var form = Ext.getCmp('addForm');
                            if (form.form.isValid()) {
                                var values = form.getValues(false);
                                values["starttime"] = values["StartTime"] + " " + values["StartTimeHour"] + ":00";
                                values["endtime"] = values["EndTime"] + " " + values["EndTimeHour"] + ":00";

                                CS('CZCLZ.SystemDB.ApplyService', function (retVal) {
                                    if (retVal.status == "ok") {
                                        Ext.MessageBox.alert("提示", "派发成功", function () {
                                            Ext.getCmp('addWin').close();
                                            loadData(1);
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

var wsStore = Ext.create('Ext.data.Store', {
    fields: [
       { name: 'ServiceRemark', type: 'string' },
       { name: 'DamagePrice', type: 'string' },
       { name: 'FinishTime', type: 'string' }
    ]
});

function ckws(wsid) {
    CS('CZCLZ.SystemDB.GetWSXX', function (retVal) {
        if(retVal){
            wsStore.loadData(retVal);
        }
    }, CS.onError, wsid)


}

Ext.define('wsWin', {
    extend: 'Ext.window.Window',

    height: 300,
    width: 600,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '设备列表',
    id: 'wsWin',
    initComponent: function () {
        var me = this;
        me.items = [
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
                               dataIndex: 'AuthorizeNo',
                               sortable: false,
                               menuDisabled: true,
                               align: 'center',
                               text: "授权单号"
                           },
                             {
                                 xtype: 'gridcolumn',
                                 flex: 1,
                                 dataIndex: 'HotelName',
                                 sortable: false,
                                 menuDisabled: true,
                                 align: 'center',
                                 text: "门店名称"
                             },
                              {
                                  xtype: 'gridcolumn',
                                  flex: 1,
                                  dataIndex: 'RoomNo',
                                  sortable: false,
                                  menuDisabled: true,
                                  align: 'center',
                                  text: "房间编号"
                              },
                              {
                                  xtype: 'gridcolumn',
                                  flex: 1,
                                  dataIndex: 'ApplyRealName',
                                  sortable: false,
                                  menuDisabled: true,
                                  align: 'center',
                                  text: "房客姓名"
                              },

                              {
                                  xtype: 'gridcolumn',
                                  flex: 2,
                                  dataIndex: 'Remark',
                                  sortable: false,
                                  menuDisabled: true,
                                  align: 'center',
                                  text: "服务内容"
                              },
                               {
                                   xtype: 'datecolumn',
                                   format: 'Y-m-d H:i:s',
                                   flex: 1,
                                   dataIndex: 'StartTime',
                                   sortable: false,
                                   menuDisabled: true,
                                   align: 'center',
                                   text: "生效时间"
                               },
                                {
                                    xtype: 'datecolumn',
                                    format: 'Y-m-d H:i:s',
                                    flex: 1,
                                    dataIndex: 'EndTime',
                                    sortable: false,
                                    menuDisabled: true,
                                    align: 'center',
                                    text: "失效时间"
                                },
                                {
                                    xtype: 'gridcolumn',
                                    flex: 2,
                                    dataIndex: 'ServiceRemark',
                                    sortable: false,
                                    menuDisabled: true,
                                    align: 'center',
                                    text: "反馈内容"
                                },
                                   {
                                       xtype: 'datecolumn',
                                       format: 'Y-m-d H:i:s',
                                       flex: 1,
                                       dataIndex: 'FinishTime',
                                       sortable: false,
                                       menuDisabled: true,
                                       align: 'center',
                                       text: "完成时间"
                                   },
                                {
                                    xtype: 'gridcolumn',
                                    flex: 1,
                                    dataIndex: 'ServiceStatus',
                                    sortable: false,
                                    menuDisabled: true,
                                    align: 'center',
                                    text: "任务状态",
                                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                        var str = "";
                                        if (value == 1)
                                            str = "待服务";
                                        else if (value == 2)
                                            str = "服务中";
                                        else if (value == 3)
                                            str = "已服务";
                                        else if (value == 4)
                                            str = "已拒绝";
                                        return str;
                                    }
                                },
                               {
                                   text: '操作',
                                   dataIndex: 'IsReply',
                                   width: 120,
                                   align: 'center',
                                   sortable: false,
                                   menuDisabled: true,
                                   renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                       var str = "";
                                       if (record.data.ServiceStatus == 1)
                                           str += "<a href='#' onclick='cl(\"" + record.data.ID + "\")'>处理</a>";
                                       if (record.data.IsDamage == 1)
                                           str += " <a href='#' onclick='ckws(\"" + record.data.ID + "\")'>物损详情</a>";
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
                                            id: 'AuthorizeNo',
                                            width: 180,
                                            labelWidth: 60,
                                            fieldLabel: '授权单号'
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'RoomNo',
                                            width: 180,
                                            labelWidth: 60,
                                            fieldLabel: '房间编号'
                                        },
                                        {
                                            xtype: 'combobox',
                                            id: 'ServiceStatus',
                                            fieldLabel: '任务状态',
                                            hidden: true,
                                            width: 180,
                                            labelWidth: 60,
                                            queryMode: 'local',
                                            displayField: 'TEXT',
                                            valueField: 'VALUE',
                                            store: new Ext.data.ArrayStore({
                                                fields: ['TEXT', 'VALUE'],
                                                data: [
                                                     ['全部', 0],
                                                    ['待服务', 1],
                                                    ['服务中', 2],
                                                    ['已服务', 3],
                                                    ['已拒绝', 4]
                                                ]
                                            })
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
                                                    text: '任务派发',
                                                    handler: function () {
                                                        var win = new addWin();
                                                        win.show();
                                                        //CS('CZCLZ.SystemDB.GetHotelBJList', function (retVal) {

                                                        //}, CS.onError, 71);
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
    Ext.getCmp("ServiceStatus").setValue(parseInt(zt));
    if (zt == 0)
        Ext.getCmp("ServiceStatus").show();
    loadData(1);

    CS('CZCLZ.AuthorizeOrderDB.GetHotelCombobox', function (retVal) {
        if (retVal) {
            HotelStore.loadData(retVal, true);

        }
    }, CS.onError);

})