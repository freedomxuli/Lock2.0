var pageSize = 15;
var RoomId;
var pjid;

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
       { name: 'UserName' },
       { name: 'AddDate' },
       { name: 'Content' },
       { name: 'RpContent' },
       { name: 'IsReply' },
       { name: 'ReplyDate' }

    ],
    //sorters: [{ property: 'b', direction: 'DESC'}],
    onPageChange: function (sto, nPage, sorters) {
        loadData(nPage);
    }
});

function loadData(nPage) {

    var AuthorizeNo = Ext.getCmp("AuthorizeNo").getValue();
    var RoomNo = Ext.getCmp("RoomNo").getValue();

    CS('CZCLZ.SystemDB.GetJudgeList', function (retVal) {
        store.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, AuthorizeNo, RoomNo, 1);
}

function hf(id) {
    pjid = id;
    var win = new addWin();
    win.show();
}

Ext.define('addWin', {
    extend: 'Ext.window.Window',

    height: 250,
    width: 400,
    layout: {
        type: 'fit'
    },
    id: 'addWin',
    closeAction: 'destroy',
    modal: true,
    title: '回复',
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
                        xtype: 'textareafield',
                        id: 'ReplyContent',
                        name: 'ReplyContent',
                        fieldLabel: '回复内容',
                        labelWidth: 70,
                        height: 150,
                        anchor: '100%'
                    }
                ],
                buttonAlign: 'center',
                buttons: [

                    {
                        text: '确定',
                        handler: function () {
                            CS('CZCLZ.SystemDB.ReplyJudge', function (retVal) {
                                if (retVal.status == "ok") {
                                    Ext.MessageBox.alert("提示", "回复成功", function () {
                                        Ext.getCmp("addWin").close();
                                        loadData(1);
                                    });
                                }
                            }, CS.onError, pjid, Ext.getCmp("ReplyContent").getValue());

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
                           //{
                           //    xtype: 'gridcolumn',
                           //    flex: 1,
                           //    dataIndex: 'AuthorizeNo',
                           //    sortable: false,
                           //    menuDisabled: true,
                           //    align: 'center',
                           //    text: "授权单号"
                           //},
                           // {
                           //     xtype: 'gridcolumn',
                           //     flex: 1,
                           //     dataIndex: 'UserName',
                           //     sortable: false,
                           //     menuDisabled: true,
                           //     align: 'center',
                           //     text: "房客姓名"
                           // },
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
                                  flex: 2,
                                  dataIndex: 'Content',
                                  sortable: false,
                                  menuDisabled: true,
                                  align: 'center',
                                  text: "平价内容"
                              },
                               {
                                   xtype: 'datecolumn',
                                   format: 'Y-m-d H:i:s',
                                   flex: 1,
                                   dataIndex: 'AddDate',
                                   sortable: false,
                                   menuDisabled: true,
                                   align: 'center',
                                   text: "评价时间"
                               },                              
                               {
                                   text: '操作',
                                   dataIndex: 'IsReply',
                                   width: 80,
                                   align: 'center',
                                   sortable: false,
                                   menuDisabled: true,
                                   renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                       if (value != 1)
                                           return "<a href='#' onclick='hf(\"" + record.data.ID + "\")'>回复</a>";
                                       else
                                           return "已回复";
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

})