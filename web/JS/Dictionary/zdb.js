    var pageSize = 15;


//************************************数据源*****************************************
var store = createSFW4Store({
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'ZDBID' },
       { name: 'LX' },
       { name: 'MC' },
       { name: 'XH' }
    ],
    //sorters: [{ property: 'b', direction: 'DESC'}],
    onPageChange: function (sto, nPage, sorters) {
        loadData(nPage);
    }
});

var lxStore = Ext.create('Ext.data.Store', {
    fields: ['LXID', 'LXMC'],
    data: [
    ]
});

function loadData(nPage) {
    var lx = Ext.getCmp("cx_lx").getValue();
    CS('CZCLZ.SystemDB.GetZDBList', function (retVal) {
        store.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
            //sorters: { property: 'a', direction: 'DESC' }
        });
    }, CS.onError, nPage, pageSize, lx);

}

function edit(id) {
    var win = new addWin();
    win.show(null, function () {
        CS('CZCLZ.SystemDB.GetZDB', function (retVal) {
            var form = Ext.getCmp("addForm");
            form.form.setValues(retVal[0]);
        }, CS.onError, id);
    });
}

//************************************页面方法**************************************

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
    title: '字典信息',
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
                         name: 'ZDBID',
                         hidden: true,
                         fieldLabel: 'ID',
                         labelWidth: 70,
                         anchor: '100%'
                     },
                      {
                          xtype: 'combobox',
                          name: 'LX',
                          fieldLabel: '字典类型',
                          editable: false,
                          labelWidth: 70,
                          anchor: '100%',
                          store: lxStore,
                          queryMode: 'local',
                          displayField: 'LXMC',
                          valueField: 'LXID'

                      },
                    {
                        xtype: 'textfield',
                        name: 'MC',
                        fieldLabel: '类型名称',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'numberfield',
                        name: 'XH',
                        fieldLabel: '序号',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    }
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

                                CS('CZCLZ.SystemDB.SaveZDB', function (retVal) {
                                    if (retVal) {
                                        Ext.MessageBox.alert("提示", "保存成功", function () {
                                            Ext.getCmp('addWin').close()
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
                              dataIndex: 'ZDBID',
                              hidden: true,
                              sortable: false,
                              menuDisabled: true,
                              align: 'center'
                          },
                           {
                               xtype: 'gridcolumn',
                               flex: 1,
                               dataIndex: 'MC',
                               sortable: false,
                               menuDisabled: true,
                               align: 'center',
                               text: "类型名称"
                           },
                           {
                               xtype: 'gridcolumn',
                               flex: 1,
                               dataIndex: 'XH',
                               sortable: false,
                               menuDisabled: true,
                               align: 'center',
                               text: "序号"
                           },

                            {
                                text: '操作',
                                width: 80,
                                dataIndex: 'AuthorStatus',
                                align: 'center',
                                sortable: false,
                                menuDisabled: true,
                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                    return "<a href='#' onclick='edit(\"" + record.data.ZDBID + "\")'>编辑</a>";
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
                                            fieldLabel: '字典类型',
                                            editable: false,
                                            width: 180,
                                            labelWidth: 60,
                                            store: lxStore,
                                            queryMode: 'local',
                                            displayField: 'LXMC',
                                            valueField: 'LXID'

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

                                                                   CS('CZCLZ.SystemDB.DeleteZDB', function (retVal) {
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
    CS('CZCLZ.SystemDB.GetZDLXCombo', function (retVal) {
        if (retVal) {
            lxStore.loadData(retVal, true);
        }
    }, CS.onError);
  //  loadData(1);
})
//************************************主界面*****************************************

