
var pageSize = 15;
var serviceId;

//************************************数据源*****************************************
var store = createSFW4Store({
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'ID' },
       { name: 'HotelName' },
       { name: 'HotelNo' },
       { name: 'Mobile' },
       { name: 'Tel' },
       { name: 'UserName' },
       { name: 'FreezeMoney' },
       { name: 'CreateDate' },
       { name: 'CompleteAddress' }

    ],
    //sorters: [{ property: 'b', direction: 'DESC'}],
    onPageChange: function (sto, nPage, sorters) {
        loadData(nPage);
    }
});


function loadData(nPage) {

    var cx_mc = Ext.getCmp("cx_mc").getValue();

    CS('CZCLZ.HotelDB.GetHotelList', function (retVal) {
        store.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
            //sorters: { property: 'a', direction: 'DESC' }
        });
    }, CS.onError, nPage, pageSize, cx_mc);

}


//************************************页面方法***************************************

function delDevice(id) {
    Ext.MessageBox.confirm('删除提示', '是否要删除数据!', function (obj) {
        if (obj == "yes") {
            CS('CZCLZ.JjrDB.DeleteFdDevice', function (retVal) {
                if (retVal) {
                    CS('CZCLZ.JjrDB.GetFdSbList', function (retVal) {
                        deviceStore.loadData(retVal);
                    }, CS.onError, serviceId);
                }
            }, CS.onError, id);
        }
    });
}


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
                                dataIndex: 'HotelName',
                                sortable: false,
                                menuDisabled: true,
                                align: 'center',
                                text: "宾馆名称"
                            },
                             {
                                 xtype: 'gridcolumn',
                                 flex: 1,
                                 dataIndex: 'HotelNo',
                                 sortable: false,
                                 menuDisabled: true,
                                 align: 'center',
                                 text: "宾馆编号"
                             },
                              {
                                  xtype: 'gridcolumn',
                                  flex: 1,
                                  dataIndex: 'Mobile',
                                  sortable: false,
                                  menuDisabled: true,
                                  align: 'center',
                                  text: "宾馆(手机)"
                              },

                                {
                                    xtype: 'gridcolumn',
                                    flex: 1,
                                    dataIndex: 'Tel',
                                    sortable: false,
                                    menuDisabled: true,
                                    align: 'center',
                                    text: "宾馆(座机)"
                                },
                                 {
                                     xtype: 'gridcolumn',
                                     flex: 1,
                                     dataIndex: 'UserName',
                                     sortable: false,
                                     menuDisabled: true,
                                     align: 'center',
                                     text: "负责人"
                                 },
                                  {
                                      xtype: 'gridcolumn',
                                      flex: 1,
                                      dataIndex: 'FreezeMoney',
                                      sortable: false,
                                      menuDisabled: true,
                                      align: 'center',
                                      text: "余额"
                                  },
                                   {
                                       xtype: 'gridcolumn',
                                       flex: 1,
                                       dataIndex: 'CompleteAddress',
                                       sortable: false,
                                       menuDisabled: true,
                                       align: 'center',
                                       text: "宾馆地址"
                                   },

                            {
                                xtype: 'datecolumn',
                                flex: 1,
                                format: 'Y-m-d H:i:s',
                                dataIndex: 'CreateDate',
                                sortable: false,
                                menuDisabled: true,
                                align: 'center',
                                text: "创建时间"
                            },

                            {
                                text: '操作',
                                width: 100,
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
                                            xtype: 'textfield',
                                            id: 'cx_mc',
                                            width: 180,
                                            labelWidth: 80,
                                            fieldLabel: '宾馆名称'
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
                                                        FrameStack.pushFrame({
                                                            url: "HotelAdd.html",
                                                            onClose: function (ret) {
                                                                loadData(1);
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

                                                                    idlist.push(rd.get("User_ID"));
                                                                }

                                                                CS('CZCLZ.JjrDB.DelFdByids', function (retVal) {
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
