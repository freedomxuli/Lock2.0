var pageSize = 15;
var RoomId;
var zt = queryString.zt;
var userid;

//************************************数据源*****************************************

var store = createSFW4Store({
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'UserId' },
       { name: 'RealName' },
       { name: 'CellPhone' },
       { name: 'LiveStartDate' },
       { name: 'IDCard' },
       { name: 'Point' }

    ],
    //sorters: [{ property: 'b', direction: 'DESC'}],
    onPageChange: function (sto, nPage, sorters) {
        loadData(nPage);
    }
});

var rzjlstore = createSFW4Store({
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'RoomNo' },
       { name: 'AuthorRoomStyle' },
       { name: 'LiveStartDate' },
       { name: 'LiveEndDate' },
       { name: 'ConsumeActualTotal' },
       { name: 'tzry' },
       { name: 'context' }

    ],
    //sorters: [{ property: 'b', direction: 'DESC'}],
    onPageChange: function (sto, nPage, sorters) {
        CS('CZCLZ.SystemDB.GetRZJL', function (retVal) {
            rzjlstore.setData({
                data: retVal.dt,
                pageSize: 10,
                total: retVal.ac,
                currentPage: retVal.cp
            });
        }, CS.onError, nPage, 10, userid);
    }
});

var HotelStore = Ext.create('Ext.data.Store', {
    fields: ['VALUE', 'TEXT'],
    data: [
    ]
});



function loadData(nPage) {

    var AuthorizeNo = Ext.getCmp("AuthorizeNo").getValue();
    var RoomNo = Ext.getCmp("RoomNo").getValue();
    var cx_sj = Ext.getCmp("cx_sj").getValue();
    var cx_xm = Ext.getCmp("cx_xm").getValue();
    var cx_sdate = Ext.getCmp("cx_sdate").getValue();
    var cx_edate = Ext.getCmp("cx_edate").getValue();

    CS('CZCLZ.SystemDB.GetTenantList', function (retVal) {
        store.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, cx_sj, cx_xm, cx_sdate, cx_edate, RoomNo, AuthorizeNo);
}

function rzjl(id) {
    userid = id;
    var win = new rzjlWin();
    win.show(null, function () {
        CS('CZCLZ.SystemDB.GetRZJL', function (retVal) {
            rzjlstore.setData({
                data: retVal.dt,
                pageSize: 10,
                total: retVal.ac,
                currentPage: retVal.cp
            });
        }, CS.onError, 1, 10, id);
    });
}


Ext.define('rzjlWin', {
    extend: 'Ext.window.Window',

    height: 400,
    width: 850,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '入住记录',
    id: 'rzjlWin',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'gridpanel',
                margin: '0 0 0 0',
                id: 'rzjlgrid',
                store: rzjlstore,
                columnLines: true,
                border: true,
                autoscroll: true,

                columns: [
                    Ext.create('Ext.grid.RowNumberer'),
                     {
                         xtype: 'gridcolumn',
                         dataIndex: 'RoomNo',
                         align: 'center',
                         text: '入住房间',
                         width: 80,
                         sortable: false,
                         menuDisabled: true
                     },

                    {
                        xtype: 'gridcolumn',
                        dataIndex: 'AuthorRoomStyle',
                        align: 'center',
                        text: '入住类型',
                        width: 80,
                        sortable: false,
                        menuDisabled: true,
                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                            if (value == 1)
                                return "全天房";
                            else if (value == 2)
                                return "钟点房";
                            else if (value == 3)
                                return "看房";
                        }
                    },
                    {
                        xtype: 'datecolumn',
                        dataIndex: 'LiveStartDate',
                        format: 'Y-m-d H:i:s',
                        align: 'center',
                        text: '入住时间',
                        width: 150,
                        sortable: false,
                        menuDisabled: true
                    },
                     {
                         xtype: 'datecolumn',
                         format: 'Y-m-d H:i:s',
                         dataIndex: 'LiveEndDate',
                         align: 'center',
                         text: '退房时间',
                         width: 150,
                         sortable: false,
                         menuDisabled: true
                     },
                      {
                          xtype: 'gridcolumn',
                          dataIndex: 'ConsumeActualTotal',
                          align: 'center',
                          text: '消费金额',
                          width: 80,
                          sortable: false,
                          menuDisabled: true
                      },

                         {
                             xtype: 'gridcolumn',
                             dataIndex: 'tzry',
                             align: 'center',
                             text: '同住人员',
                             width: 80,
                             sortable: false,
                             menuDisabled: true
                         },
                          {
                              xtype: 'gridcolumn',
                              dataIndex: 'context',
                              align: 'center',
                              text: '房东评价',
                              flex: 1,
                              sortable: false,
                              menuDisabled: true
                          }

                ],

                buttonAlign: 'center',
                buttons: [

                    {
                        text: '关闭',
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
                              dataIndex: 'RealName',
                              sortable: false,
                              menuDisabled: true,
                              align: 'center',
                              text: "用户姓名"
                          },
                          {
                              xtype: 'gridcolumn',
                              flex: 1,
                              dataIndex: 'CellPhone',
                              sortable: false,
                              menuDisabled: true,
                              align: 'center',
                              text: "用户手机"
                          },
                          {
                              xtype: 'gridcolumn',
                              flex: 1,
                              dataIndex: 'xydj',
                              sortable: false,
                              menuDisabled: true,
                              align: 'center',
                              text: "信用等级",
                              renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                  return "4.5";
                              }
                          },
                          {
                              xtype: 'gridcolumn',
                              flex: 1,
                              dataIndex: 'Point',
                              sortable: false,
                              menuDisabled: true,
                              align: 'center',
                              text: "本店消费积分"
                          },
                          {
                              xtype: 'gridcolumn',
                              hidden: true,
                              flex: 1,
                              dataIndex: 'CellPhone',
                              sortable: false,
                              menuDisabled: true,
                              align: 'center',
                              text: "房东评价"
                          },
                           {
                               xtype: 'datecolumn',
                               flex: 1,
                               dataIndex: 'LiveStartDate',
                               format: 'Y-m-d H:i:s',
                               sortable: false,
                               menuDisabled: true,
                               align: 'center',
                               text: "最近入住时间"
                           },

                               {
                                   text: '操作',
                                   dataIndex: 'IsReply',
                                   width: 80,
                                   align: 'center',
                                   sortable: false,
                                   menuDisabled: true,
                                   renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                       return "<a href='#' onclick='rzjl(\"" + record.data.UserId + "\",)'>入住记录</a>";
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
                                               id: 'cx_sj',
                                               width: 180,
                                               labelWidth: 60,
                                               fieldLabel: '手机'
                                           },
                                           {
                                               xtype: 'textfield',
                                               id: 'cx_xm',
                                               width: 180,
                                               labelWidth: 60,
                                               fieldLabel: '姓名'
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
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    items: [

                                           {
                                               xtype: 'datefield',
                                               format: 'Y-m-d',
                                               id: 'cx_sdate',
                                               width: 180,
                                               labelWidth: 60,
                                               fieldLabel: '开始时间'
                                           },
                                           {
                                               xtype: 'datefield',
                                               format: 'Y-m-d',
                                               id: 'cx_edate',
                                               width: 180,
                                               labelWidth: 60,
                                               fieldLabel: '结束时间'
                                           },
                                          {
                                              xtype: 'textfield',
                                              id: 'AuthorizeNo',
                                              width: 180,
                                              labelWidth: 60,
                                              fieldLabel: '授权单号'
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