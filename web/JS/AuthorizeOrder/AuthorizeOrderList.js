var AuthorizeId;
var pageSize = 15;
var zt = queryString.zt;

//************************************数据源*****************************************
var store = createSFW4Store({
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'ID' },
       { name: 'AuthorizeNo' },
       { name: 'RealName' },
       { name: 'CellPhone' },
       { name: 'AuthorStatus' },
       { name: 'CellPhone' },
       { name: 'LiveStartDate' },
       { name: 'LiveEndDate' },
       { name: 'HotelName' },
       { name: 'Mobile' },
       { name: 'CompleteAddress' },
       { name: 'RoomNo' },
       { name: 'AuthorRoomStyle' },
       { name: 'AuthorLiveStatus' }
    ],
    //sorters: [{ property: 'b', direction: 'DESC'}],
    onPageChange: function (sto, nPage, sorters) {
        loadData(nPage);
    }
});


function loadData(nPage) {

    var cx_mc = Ext.getCmp("cx_mc").getValue();
    var cx_no = Ext.getCmp("cx_no").getValue();
    var cx_fjh = Ext.getCmp("cx_fjh").getValue();
    var cx_bgmc = Ext.getCmp("cx_bgmc").getValue();
    var cx_sqzt = Ext.getCmp("cx_sqzt").getValue();

    CS('CZCLZ.AuthorizeOrderDB.GetAuthorizeOrderList', function (retVal) {
        store.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
            //sorters: { property: 'a', direction: 'DESC' }
        });
    }, CS.onError, nPage, pageSize, cx_mc, cx_no, cx_fjh, cx_bgmc, cx_sqzt);

}

function ck(id) {
    FrameStack.pushFrame({
        url: "AuthorizeOrderAdd.html?id=" + id,
        onClose: function (ret) {
            loadData(1);
        }
    });
}

//************************************页面方法**************************************



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
                              align: 'center'
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
                               flex: 2,
                               dataIndex: 'HotelName',
                               sortable: false,
                               menuDisabled: true,
                               align: 'center',
                               text: "宾馆名称"
                           },
                              {
                                  xtype: 'gridcolumn',
                                  flex: 1,
                                  dataIndex: 'RoomNo',
                                  sortable: false,
                                  menuDisabled: true,
                                  align: 'center',
                                  text: "房间号"
                              },
                                 {
                                     xtype: 'gridcolumn',
                                     flex: 1,
                                     dataIndex: 'CellPhone',
                                     sortable: false,
                                     menuDisabled: true,
                                     align: 'center',
                                     text: "下单手机"
                                 },
                              {
                                  xtype: 'gridcolumn',
                                  flex: 1,
                                  dataIndex: 'RealName',
                                  sortable: false,
                                  menuDisabled: true,
                                  align: 'center',
                                  text: "下单姓名"
                              },
                               {
                                   xtype: 'gridcolumn',
                                   flex: 1,
                                   dataIndex: 'AuthorRoomStyle',
                                   sortable: false,
                                   menuDisabled: true,
                                   align: 'center',
                                   text: "授权房型",
                                   renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                       var str = "";
                                       if (value == 1)
                                           str = "全天房";
                                       else if (value == 2)
                                           str = "钟点房";
                                       else if (value == 3)
                                           str = "看房";
                                       else if (value == 4)
                                           str = "月租房";
                                       return str;
                                   }
                               },

                              {
                                  xtype: 'datecolumn',
                                  flex: 1,
                                  format: 'Y-m-d H:i',
                                  dataIndex: 'LiveStartDate',
                                  sortable: false,
                                  menuDisabled: true,
                                  align: 'center',
                                  text: "预计入住时间"
                              },

                                {
                                    xtype: 'datecolumn',
                                    flex: 1,
                                    format: 'Y-m-d H:i',
                                    dataIndex: 'LiveEndDate',
                                    sortable: false,
                                    menuDisabled: true,
                                    align: 'center',
                                    text: "预计退房时间"
                                },
                             {
                                 xtype: 'gridcolumn',
                                 flex: 1,
                                 dataIndex: 'AuthorStatus',
                                 sortable: false,
                                 menuDisabled: true,
                                 align: 'center',
                                 text: "授权状态",
                                 renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                     var str = "";
                                     if (value == 1)
                                         str = "待授权";
                                     else if (value == 2)
                                         str = "已授权";
                                     else if (value == 3)
                                         str = "授权失败";
                                     else if (value == 5)
                                         str = "授权挂起";
                                     else if (value == 6)
                                         str = "授权关闭";
                                     else if (value == 7)
                                         str = "授权取消";

                                     return str;
                                 }
                             },
                            {
                                xtype: 'gridcolumn',
                                flex: 1,
                                dataIndex: 'AuthorLiveStatus',
                                sortable: false,
                                menuDisabled: true,
                                align: 'center',
                                text: "授权入住状态",
                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                    var str = "";
                                    if (value == 0)
                                        str = "预定";
                                    else if (value == 1)
                                        str = "已入住";
                                    else if (value == 2)
                                        str = "续住";
                                    else if (value == 3)
                                        str = "延时";
                                    else if (value == 4)
                                        str = "待退房";
                                    else if (value == 5)
                                        str = "已退房";
                                    else if (value == 6)
                                        str = "退房申请";
                                    else if (value == 15)
                                        str = "未知";
                                    else if (value == 16)
                                        str = "看房";

                                    return str;
                                }
                            },
                            {
                                text: '操作',
                                width: 80,
                                dataIndex: 'AuthorStatus',
                                align: 'center',
                                sortable: false,
                                menuDisabled: true,
                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                    return "<a href='#' onclick='ck(\"" + record.data.ID + "\")'>查看</a>";
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
                                            id: 'cx_no',
                                            width: 160,
                                            labelWidth: 60,
                                            fieldLabel: '授权单号'
                                        },
                                         {
                                             xtype: 'textfield',
                                             id: 'cx_mc',
                                             width: 160,
                                             labelWidth: 60,
                                             fieldLabel: '房客姓名'
                                         },
                                           {
                                               xtype: 'textfield',
                                               id: 'cx_fjh',
                                               width: 160,
                                               labelWidth: 60,
                                               fieldLabel: '房间号'
                                           },
                                             {
                                                 xtype: 'textfield',
                                                 id: 'cx_bgmc',
                                                 width: 160,
                                                 labelWidth: 60,
                                                 fieldLabel: '宾馆名称'
                                             },
                                              {
                                                  xtype: 'combobox',
                                                  id: 'cx_sqzt',
                                                  width: 160,
                                                  labelWidth: 60,
                                                  fieldLabel: '授权状态',
                                                  queryMode: 'local',
                                                  displayField: 'TEXT',
                                                  valueField: 'VALUE',
                                                  store: new Ext.data.ArrayStore({
                                                      fields: ['TEXT', 'VALUE'],
                                                      data: [
                                                           ['全部', ''],
                                                           ['待授权', '1'],
                                                           ['已授权', '2'],
                                                           ['授权失败', '3'],
                                                           ['授权挂起', '5'],
                                                           ['授权关闭', '6'],
                                                           ['授权取消', '7']
                                                      ]
                                                  }),
                                                  value: ''
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
                                                     text: '新增授权',
                                                     handler: function () {
                                                         FrameStack.pushFrame({
                                                             url: "AuthorizeOrderAdd.html",
                                                             onClose: function (ret) {
                                                                 loadData(1);
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

    Ext.getCmp("cx_sqzt").setValue(zt);
    loadData(1);
})
//************************************主界面*****************************************

