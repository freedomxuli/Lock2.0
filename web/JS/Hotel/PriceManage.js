var pageSize = 15;
var RoomId = queryString.id;

function loadData(nPage) {
    var cx_lx = Ext.getCmp("cx_lx").getValue();
    CS('CZCLZ.RoomDB.GetRoomPriceList', function (retVal) {
        store.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
            //sorters: { property: 'a', direction: 'DESC' }
        });
    }, CS.onError, nPage, pageSize, RoomId, cx_lx);
}

//************************************数据源*****************************************
var store = createSFW4Store({
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'ID' },
       { name: 'StartDate' },
       { name: 'EndDate' },
       { name: 'Price' },
       { name: 'WeekEndPrice' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        loadData(nPage);
    }
});

Ext.define('addWin', {
    extend: 'Ext.window.Window',

    height: 350,
    width: 500,
    layout: {
        type: 'fit'
    },
    id: 'addWin',
    closeAction: 'destroy',
    modal: true,
    title: '价格信息',
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
                         xtype: 'textfield',
                         name: 'ID',
                         hidden: true,
                         fieldLabel: 'ID',
                         labelWidth: 70,
                         anchor: '100%'
                     },
                      {
                          xtype: 'combobox',
                          name: 'PriceType',
                          fieldLabel: '价格类型',
                          anchor: '100%',
                          labelWidth: 70,
                          queryMode: 'local',
                          displayField: 'TEXT',
                          valueField: 'VALUE',
                          allowBlank: false,
                          store: new Ext.data.ArrayStore({
                              fields: ['TEXT', 'VALUE'],
                              data: [
                                  ['全天房价', '1'],
                                  ['钟点房1价', '2'],
                                  ['钟点房2价', '2'],
                                  ['钟点房3价', '3'],
                                  ['月租房价', '4']
                              ]
                          })
                      },
                    {
                        xtype: 'datefield',
                        format: 'Y-m-d H:i:s',
                        name: 'StartDate',
                        fieldLabel: '开始时间',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'datefield',
                        format: 'Y-m-d H:i:s',
                        name: 'EndDate',
                        fieldLabel: '结束时间',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'numberfield',
                        name: 'Price',
                        fieldLabel: '平时价',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },

                   {
                       xtype: 'numberfield',
                       name: 'WeekEndPrice',
                       fieldLabel: '周末价',
                       labelWidth: 70,
                       allowBlank: false,
                       anchor: '100%'
                   },
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
                                        Ext.getCmp("addWin").close;
                                        loadData(1);
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
        ];
        me.callParent(arguments);
    }
});

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
                                xtype: 'datecolumn',
                                flex: 1,
                                format: 'Y-m-d H:i:s',
                                dataIndex: 'StartDate',
                                sortable: false,
                                menuDisabled: true,
                                align: 'center',
                                text: "开始时间"
                            },
                            {
                                xtype: 'datecolumn',
                                flex: 1,
                                format: 'Y-m-d H:i:s',
                                dataIndex: 'EndDate',
                                sortable: false,
                                menuDisabled: true,
                                align: 'center',
                                text: "结束时间"
                            },
                              {
                                  xtype: 'gridcolumn',
                                  flex: 1,
                                  dataIndex: 'Price',
                                  sortable: false,
                                  menuDisabled: true,
                                  align: 'center',
                                  text: "平时价"
                              },
                             {
                                 xtype: 'gridcolumn',
                                 flex: 1,
                                 dataIndex: 'WeekEndPrice',
                                 sortable: false,
                                 menuDisabled: true,
                                 align: 'center',
                                 text: "周末价"
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
                                             xtype: 'combobox',
                                             id: 'cx_lx',
                                             fieldLabel: '价格类型',
                                             width: 180,
                                             labelWidth: 60,
                                             queryMode: 'local',
                                             displayField: 'TEXT',
                                             valueField: 'VALUE',
                                             store: new Ext.data.ArrayStore({
                                                 fields: ['TEXT', 'VALUE'],
                                                 data: [
                                                     ['全天房价', '1'],
                                                     ['钟点房1价', '2'],
                                                     ['钟点房2价', '2'],
                                                     ['钟点房3价', '3'],
                                                     ['月租房价', '4']
                                                 ]
                                             }),
                                             value: '1'
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
                                                        var win = new addWin();
                                                        win.show();
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

                                                                CS('CZCLZ.RoomDB.DeleteRoomPrice', function (retVal) {
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

})