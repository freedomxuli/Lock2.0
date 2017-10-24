
var pageSize = 15;
var serviceId;

//************************************数据源*****************************************
var store = createSFW4Store({
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'ID' },
       { name: 'RoomNo' },
       { name: 'RoomGuidNumber' },
       { name: 'HotelName' },
       { name: 'CellPhone' },
       { name: 'RealName' },
       { name: 'RoomKind' },
       { name: 'RoomCheckStatus' },
       { name: 'RoomLiveStatus' }

    ],
    //sorters: [{ property: 'b', direction: 'DESC'}],
    onPageChange: function (sto, nPage, sorters) {
        loadData(nPage);
    }
});


function loadData(nPage) {

    var cx_mc = Ext.getCmp("cx_mc").getValue();
    var cx_no = Ext.getCmp("cx_no").getValue();
    var cx_lx = Ext.getCmp("cx_lx").getValue();

    CS('CZCLZ.RoomDB.GetRoomList', function (retVal) {
        store.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
            //sorters: { property: 'a', direction: 'DESC' }
        });
    }, CS.onError, nPage, pageSize, cx_mc, cx_no, cx_lx);

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
                                dataIndex: 'RoomNo',
                                sortable: false,
                                menuDisabled: true,
                                align: 'center',
                                text: "房间编号"
                            },
                             {
                                 xtype: 'gridcolumn',
                                 flex: 1,
                                 dataIndex: 'RoomGuidNumber',
                                 sortable: false,
                                 menuDisabled: true,
                                 align: 'center',
                                 text: "房间唯一编码"
                             },
                              {
                                  xtype: 'gridcolumn',
                                  flex: 1.5,
                                  dataIndex: 'HotelName',
                                  sortable: false,
                                  menuDisabled: true,
                                  align: 'center',
                                  text: "所属门店"
                              },

                                {
                                    xtype: 'gridcolumn',
                                    flex: 1,
                                    dataIndex: 'CellPhone',
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
                                     dataIndex: 'RoomKind',
                                     sortable: false,
                                     menuDisabled: true,
                                     align: 'center',
                                     text: "房间类型",
                                     renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                         if (value == "1")
                                             return "分租";
                                         else if (value == "2")
                                             return "整租";
                                     }
                                 },
                                  {
                                      xtype: 'gridcolumn',
                                      flex: 1,
                                      dataIndex: 'RoomCheckStatus',
                                      sortable: false,
                                      menuDisabled: true,
                                      align: 'center',
                                      text: "检查状态",
                                      renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                          if (value == "1")
                                              return "正常";
                                          else if (value == "2")
                                              return "维修";

                                      }
                                  },
                                   {
                                       xtype: 'gridcolumn',
                                       flex: 1,
                                       dataIndex: 'RoomLiveStatus',
                                       sortable: false,
                                       menuDisabled: true,
                                       align: 'center',
                                       text: "入住状态",
                                       renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                           if (value == "1")
                                               return "空闲";
                                           else if (value == "2")
                                               return "已预订";
                                           else if (value == "3")
                                               return "已入住";
                                           else if (value == "4")
                                               return "待退房";
                                       }
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
                                            labelWidth: 60,
                                            fieldLabel: '宾馆名称'
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'cx_no',
                                            width: 180,
                                            labelWidth: 60,
                                            fieldLabel: '房间编号'
                                        },
                                         {
                                             xtype: 'combobox',
                                             id: 'cx_lx',
                                             fieldLabel: '房间类型',
                                             width: 180,
                                             labelWidth: 60,
                                             queryMode: 'local',
                                             displayField: 'TEXT',
                                             valueField: 'VALUE',
                                             store: new Ext.data.ArrayStore({
                                                 fields: ['TEXT', 'VALUE'],
                                                 data: [
                                                     ['全部', ''],
                                                     ['分租', '1'],
                                                     ['整租', '2']
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
