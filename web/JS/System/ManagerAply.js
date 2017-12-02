var pageSize = 15;

//************************************数据源*****************************************
var store = createSFW4Store({
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'ID' },
       { name: 'Name' },
       { name: 'Mobile' },
       { name: 'IdCard' },
       { name: 'Email' },
       { name: 'State' }

    ],
    //sorters: [{ property: 'b', direction: 'DESC'}],
    onPageChange: function (sto, nPage, sorters) {
        loadData(nPage);
    }
});

function loadData(nPage) {
    CS('CZCLZ.SystemDB.GetManagerList', function (retVal) {
        store.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize);
}

function hf() {
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
    title: '新增门店管理员',
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
                         name: 'Name',
                         fieldLabel: '管理员姓名',
                         allowBlank: false,
                         labelWidth: 70,
                         anchor: '100%'
                     },
                      {
                          xtype: 'textfield',
                          name: 'Mobile',
                          fieldLabel: '手机号码',
                          allowBlank: false,
                          labelWidth: 70,
                          anchor: '100%'
                      }, {
                          xtype: 'textfield',
                          name: 'IdCard',
                          fieldLabel: '身份证号码',
                          labelWidth: 70,
                          anchor: '100%'
                      },
                       {
                           xtype: 'textfield',
                           name: 'Email',
                           fieldLabel: '邮箱',
                           labelWidth: 70,
                           anchor: '100%'
                       }

                ],
                buttonAlign: 'center',
                buttons: [

                    {
                        text: '确定',
                        handler: function () {
                            var form = Ext.getCmp('addForm');
                            if (form.form.isValid()) {
                                var values = form.getValues(false);
                                CS('CZCLZ.SystemDB.SaveManager', function (retVal) {
                                    if (retVal) {
                                        Ext.MessageBox.alert("提示", "保存成功!", function () {
                                            Ext.getCmp("addWin").close();
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
                               dataIndex: 'Name',
                               sortable: false,
                               menuDisabled: true,
                               align: 'center',
                               text: "管理员姓名"
                           },
                            {
                                xtype: 'gridcolumn',
                                flex: 1,
                                dataIndex: 'Mobile',
                                sortable: false,
                                menuDisabled: true,
                                align: 'center',
                                text: "手机号码"
                            },
                             {
                                 xtype: 'gridcolumn',
                                 flex: 1,
                                 dataIndex: 'IdCard',
                                 sortable: false,
                                 menuDisabled: true,
                                 align: 'center',
                                 text: "身份证号码"
                             },
                              {
                                  xtype: 'gridcolumn',
                                  flex: 1,
                                  dataIndex: 'Email',
                                  sortable: false,
                                  menuDisabled: true,
                                  align: 'center',
                                  text: "邮箱"
                              },

                               {
                                   text: '审核状态',
                                   dataIndex: 'State',
                                   flex: 1,
                                   align: 'center',
                                   sortable: false,
                                   menuDisabled: true,
                                   renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                       if (value == 0)
                                           return "审核中";
                                       else if (value == 1)
                                           return "审核通过";
                                       else if (value == 2)
                                           return "审核不通过";
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