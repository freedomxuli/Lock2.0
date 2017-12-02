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
       { name: 'InvoiceTile' },
       { name: 'AuthorizeNo' },
       { name: 'InvoiceNumber' },
       { name: 'InvoiceKind' },
       { name: 'InvoiceEmail' },
       { name: 'InvoiceAddress' },
       { name: 'ContactPerson' },
       { name: 'ContactMobile' },
       { name: 'IsHandler' }

    ],
    //sorters: [{ property: 'b', direction: 'DESC'}],
    onPageChange: function (sto, nPage, sorters) {
        loadData(nPage);
    }
});

function loadData(nPage) {

    var AuthorizeNo = Ext.getCmp("AuthorizeNo").getValue();
    var RoomNo = Ext.getCmp("RoomNo").getValue();

    CS('CZCLZ.SystemDB.GetInvoiceList', function (retVal) {
        store.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, AuthorizeNo, RoomNo, zt);
}

function bl(id, AuthorizeNo) {
    Ext.MessageBox.confirm('提示', '确定处理？', function (obj) {
        if (obj == "yes") {
            CS('CZCLZ.SystemDB.HandlerInvoice', function (retVal) {
                if (retVal.status == "ok") {
                    Ext.MessageBox.alert("提示", "处理成功!", function () {

                    });
                }
            }, CS.onError, id, AuthorizeNo, 3);
        }
    });
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
                               dataIndex: 'AuthorizeNo',
                               sortable: false,
                               menuDisabled: true,
                               align: 'center',
                               text: "授权单号"
                           },
                            {
                                xtype: 'gridcolumn',
                                flex: 1,
                                dataIndex: '',
                                sortable: false,
                                menuDisabled: true,
                                align: 'center',
                                text: "联系人",
                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                    return record.data.ContactPerson + "(" + record.data.ContactMobile + ")";
                                }
                            },
                             {
                                 xtype: 'gridcolumn',
                                 flex: 1,
                                 dataIndex: 'InvoiceTile',
                                 sortable: false,
                                 menuDisabled: true,
                                 align: 'center',
                                 text: "发票抬头"
                             },
                              {
                                  xtype: 'gridcolumn',
                                  flex: 1,
                                  dataIndex: 'InvoiceNumber',
                                  sortable: false,
                                  menuDisabled: true,
                                  align: 'center',
                                  text: "税号"
                              },
                               {
                                   xtype: 'gridcolumn',
                                   flex: 1,
                                   dataIndex: 'InvoiceKind',
                                   sortable: false,
                                   menuDisabled: true,
                                   align: 'center',
                                   text: "发票类型"
                               },
                                 {
                                     xtype: 'gridcolumn',
                                     flex: 1,
                                     dataIndex: 'InvoiceAddress',
                                     sortable: false,
                                     menuDisabled: true,
                                     align: 'center',
                                     text: "邮寄地址"
                                 },
                                   {
                                       xtype: 'gridcolumn',
                                       flex: 1,
                                       dataIndex: 'InvoiceEmail',
                                       sortable: false,
                                       menuDisabled: true,
                                       align: 'center',
                                       text: "邮箱"
                                   },

                               {
                                   text: '操作',
                                   dataIndex: 'IsHandler',
                                   width: 80,
                                   align: 'center',
                                   sortable: false,
                                   menuDisabled: true,
                                   renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                       if (value == 2)
                                           return "<a href='#' onclick='bl(\"" + record.data.ID + "\",\"" + record.data.AuthorizeNo + "\")'>办理</a>";
                                       else if (value == 3)
                                           return "平台已处理";
                                       else if (value == 4)
                                           return "已拒绝";
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