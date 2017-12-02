
var pageSize = 15;
var serviceId;
var hotelId;

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
       { name: 'CompleteAddress' },
       { name: 'CellPhone' },
       { name: 'RealName' },
        { name: 'SHZT' }

    ],
    //sorters: [{ property: 'b', direction: 'DESC'}],
    onPageChange: function (sto, nPage, sorters) {
        loadData(nPage);
    }
});

var UserStore = Ext.create('Ext.data.Store', {
    fields: ['VALUE', 'TEXT'],
    data: [
    ]
});



function loadData(nPage) {

    var cx_mc = Ext.getCmp("cx_mc").getValue();
    var cx_zt = Ext.getCmp("cx_zt").getValue();
    CS('CZCLZ.HotelApplyDB.GetHotelList', function (retVal) {
        store.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
            //sorters: { property: 'a', direction: 'DESC' }
        });
    }, CS.onError, nPage, pageSize, cx_mc, cx_zt);

}

function edit(id) {
    FrameStack.pushFrame({
        url: "HotelApplyAdd.html?id=" + id,
        onClose: function (ret) {
            loadData(1);
        }
    });
}

function choseAdmin(id) {
    hotelId = id;
    var win = new choseWin();
    win.show(null, function () {
        CS('CZCLZ.HotelApplyDB.GetManagerList', function (retVal) {
            if (retVal.length > 0) {
                UserStore.loadData(retVal, false);
            }
        }, CS.onError);
    })
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
                                     text: "所属房东",
                                     renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                         var CellPhone = "";
                                         var RealName = "";
                                         if (record.data.CellPhone != null)
                                             CellPhone = record.data.CellPhone;
                                         if (record.data.RealName != null)
                                             RealName = record.data.RealName;
                                         return CellPhone + "(" + RealName + ")";
                                     }
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
                                 xtype: 'gridcolumn',
                                 flex: 1,
                                 dataIndex: 'SHZT',
                                 sortable: false,
                                 menuDisabled: true,
                                 align: 'center',
                                 text: "审核状态",
                                 renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                     if (value == 0)
                                         return "经纪人审核中";
                                     else if (value == 1)
                                         return "管理员审核中";
                                     else if (value == 2)
                                         return "申请成功";
                                     else if (value == 3)
                                         return "申请失败";
                                 }
                             },

                            {
                                text: '操作',
                                width: 120,
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
                                            xtype: 'combobox',
                                            id: 'cx_zt',
                                            fieldLabel: '宾馆状态',
                                            width: 180,
                                            labelWidth: 60,
                                            queryMode: 'local',
                                            displayField: 'TEXT',
                                            valueField: 'VALUE',
                                            store: new Ext.data.ArrayStore({
                                                fields: ['TEXT', 'VALUE'],
                                                data: [
                                                     ['全部', ""],
                                                    ['经纪人审核中', '1'],
                                                    ['管理员审核中', '2'],
                                                    ['申请成功', '3'],
                                                    ['申请失败', '4']
                                                ]
                                            }),
                                            value:'1'
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
                                                        //CS('CZCLZ.RoomDB.GetService', function (retVal) {
                                                        //    if (retVal) {
                                                        //      //  loadData(1);
                                                        //    }
                                                        //}, CS.onError);
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

                                                                    idlist.push(rd.get("ID"));
                                                                }

                                                                CS('CZCLZ.HotelApplyDB.DeleteHotel', function (retVal) {
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
