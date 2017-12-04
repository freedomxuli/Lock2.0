var pageSize = 15;
var userInfo;

//************************************数据源*****************************************
var store = createSFW4Store({
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
         { name: 'GL_ID' },
       { name: 'RealName' },
       { name: 'UserName' },
       { name: 'Email' },
       { name: 'IdCardNo' }

    ],
    //sorters: [{ property: 'b', direction: 'DESC'}],
    onPageChange: function (sto, nPage, sorters) {
        loadData(nPage);
    }
});

function loadData(nPage) {
    CS('CZCLZ.SystemDB.GetMDList', function (retVal) {
        store.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize);
}


function getUserInfo(phone) {
    CS('CZCLZ.HotelDB.getUserInfo', function (retVal) {
        if (retVal.length > 0) {
            var win = new UserWin();
            win.show(null, function () {
                var UserForm = Ext.getCmp("UserForm");
                UserForm.form.setValues(retVal[0]);
                userInfo = retVal[0];
            });

        }
        else {

        }
    }, CS.onError, phone);
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
    title: '选择保洁',
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
                         name: 'RealName',
                         fieldLabel: '管理员姓名',
                         allowBlank: false,
                         labelWidth: 70,
                         anchor: '100%'
                     },
                      {
                          xtype: 'textfield',
                          name: 'CellPhone',
                          fieldLabel: '手机号码',
                          allowBlank: false,
                          labelWidth: 70,
                          anchor: '100%',
                          listeners: {
                              blur: function (value) {
                                  getUserInfo(this.value);
                              }

                          }
                      }, {
                          xtype: 'textfield',
                          name: 'IdCardNo',
                          fieldLabel: '身份证号码',
                          labelWidth: 70,
                          anchor: '100%'
                      },
                       {
                           xtype: 'textfield',
                           hidden: true,
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
Ext.define('UserWin', {
    extend: 'Ext.window.Window',

    height: 250,
    width: 400,
    layout: {
        type: 'fit'
    },
    id: 'UserWin',
    closeAction: 'destroy',
    modal: true,
    title: '用户信息',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'UserForm',
                bodyPadding: 10,

                title: '',
                items: [
                    {
                        xtype: 'displayfield',
                        name: 'RealName',
                        fieldLabel: '姓名',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'displayfield',
                        name: 'RoleName',
                        fieldLabel: '角色',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'displayfield',
                        name: 'CellPhone',
                        fieldLabel: '手机号',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'displayfield',
                        name: 'IdCardNo',
                        fieldLabel: '身份证',
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
                            this.up('window').close();
                            var addForm = Ext.getCmp("addForm");
                            addForm.form.setValues(userInfo);
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
                               flex: 1,
                               dataIndex: 'RealName',
                               sortable: false,
                               menuDisabled: true,
                               align: 'center',
                               text: "门店管理员"
                           },
                           {
                               xtype: 'gridcolumn',
                               flex: 1,
                               dataIndex: 'UserName',
                               sortable: false,
                               menuDisabled: true,
                               align: 'center',
                               text: "手机号码"
                           },
                             {
                                 xtype: 'gridcolumn',
                                 flex: 1,
                                 dataIndex: 'IdCardNo',
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

                                                                    idlist.push(rd.get("GL_ID"));
                                                                }

                                                                CS('CZCLZ.SystemDB.DeleteManager', function (retVal) {
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