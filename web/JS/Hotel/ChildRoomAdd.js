var id = queryString.id;
var RoomGuid = queryString.RoomGuid;
var HotelId = queryString.HotelId;
var ParentId = queryString.ParentId;

var roomPic = [];
var goodsPic = [];

var HotelStore = Ext.create('Ext.data.Store', {
    fields: ['VALUE', 'TEXT'],
    data: [
    ]
});

function tp(v) {
    var win = new phWin({ lx: v });
    win.show(null, function () {
        if (v == 1) {
            for (var i = 0; i < roomPic.length; i++) {
                Ext.getCmp('uploadproductpic').add(new SelectImg({
                    isSelected: false,
                    src: roomPic[i],
                    fileid: roomPic[i]
                }));
            }
        }
        else {
            for (var i = 0; i < goodsPic.length; i++) {
                Ext.getCmp('uploadproductpic').add(new SelectImg({
                    isSelected: false,
                    src: goodsPic[i],
                    fileid: goodsPic[i]
                }));
            }
        }
    });
}

function initData() {
    if (id != null && id != "") {
        CS('CZCLZ.RoomDB.GetRoomInfo', function (retVal) {
            if (retVal) {
                Ext.getCmp('addform').form.setValues(retVal[0]);

                if (retVal[0]["Image1"] != "" && retVal[0]["Image1"] != null)
                    roomPic.push(retVal[0]["Image1"]);
                if (retVal[0]["Image2"] != "" && retVal[0]["Image2"] != null)
                    roomPic.push(retVal[0]["Image2"]);
                if (retVal[0]["Image3"] != "" && retVal[0]["Image3"] != null)
                    roomPic.push(retVal[0]["Image3"]);
                if (retVal[0]["Image4"] != "" && retVal[0]["Image4"] != null)
                    roomPic.push(retVal[0]["Image4"]);
                if (retVal[0]["Image5"] != "" && retVal[0]["Image5"] != null)
                    roomPic.push(retVal[0]["Image5"]);

                if (retVal[0]["GoodsImage1"] != "" && retVal[0]["GoodsImage1"] != null)
                    goodsPic.push(retVal[0]["GoodsImage1"]);
                if (retVal[0]["GoodsImage2"] != "" && retVal[0]["GoodsImage2"] != null)
                    goodsPic.push(retVal[0]["GoodsImage2"]);
                if (retVal[0]["GoodsImage3"] != "" && retVal[0]["GoodsImage3"] != null)
                    goodsPic.push(retVal[0]["GoodsImage3"]);
                if (retVal[0]["GoodsImage4"] != "" && retVal[0]["GoodsImage4"] != null)
                    goodsPic.push(retVal[0]["GoodsImage4"]);
                if (retVal[0]["GoodsImage5"] != "" && retVal[0]["GoodsImage5"] != null)
                    goodsPic.push(retVal[0]["GoodsImage5"]);
            }
        }, CS.onError, id);
    }
}


Ext.onReady(function () {
    Ext.define('add', {
        extend: 'Ext.container.Viewport',
        layout: {
            type: 'fit'
        },

        initComponent: function () {
            var me = this;

            Ext.applyIf(me, {
                items: [
                    {
                        xtype: 'panel',
                        layout: {
                            type: 'anchor'
                        },
                        autoScroll: true,
                        items: [
                            {
                                xtype: 'form',
                                id: 'addform',
                                layout: {
                                    type: 'column'
                                },
                                border: true,
                                // margin: 10,
                                title: '房间信息',
                                items: [
                                        {
                                            xtype: 'textfield',
                                            name: 'ID',
                                            margin: '10 10 10 10',
                                            fieldLabel: '主键ID',
                                            hidden: true,
                                            columnWidth: 0.5,
                                            labelWidth: 80
                                        },
                                          {
                                              xtype: 'textfield',
                                              name: 'RoomGuidNumber',
                                              disabled: true,
                                              margin: '10 10 10 10',
                                              fieldLabel: '房间唯一编号',
                                              columnWidth: 0.5,
                                              labelWidth: 80

                                          },
                                         {
                                             xtype: 'textfield',
                                             name: 'RoomNo',
                                             margin: '10 10 10 10',
                                             fieldLabel: '房间号',
                                             columnWidth: 0.5,
                                             labelWidth: 80

                                         },
                                          {
                                              xtype: 'textfield',
                                              name: 'Name',
                                              margin: '10 10 10 10',
                                              fieldLabel: '房间类型',
                                              columnWidth: 0.5,
                                              labelWidth: 80

                                          },
                                            {
                                                xtype: 'displayfield',
                                                value: '<a href="#" onclick="tp(1)">上传</a>',
                                                margin: '10 10 10 10',
                                                fieldLabel: '房间图片',
                                                columnWidth: 0.5,
                                                labelWidth: 80
                                            },
                                            {
                                                xtype: 'displayfield',
                                                value: '<a href="#" onclick="tp(2)">上传</a>',
                                                margin: '10 10 10 10',
                                                fieldLabel: '物品图片',
                                                columnWidth: 0.5,
                                                labelWidth: 80
                                            },

                                                {
                                                    xtype: 'combobox',
                                                    margin: '10 10 10 10',
                                                    name: 'RoomCheckStatus',
                                                    id: 'RoomCheckStatus',
                                                    fieldLabel: '检查状态',
                                                    columnWidth: 0.5,
                                                    labelWidth: 80,
                                                    queryMode: 'local',
                                                    displayField: 'TEXT',
                                                    valueField: 'VALUE',
                                                    store: new Ext.data.ArrayStore({
                                                        fields: ['TEXT', 'VALUE'],
                                                        data: [
                                                            ['正常', 1],
                                                            ['维修', 2]
                                                        ]
                                                    }),
                                                    value: 1
                                                },
                                                 {
                                                     xtype: 'combobox',
                                                     margin: '10 10 10 10',
                                                     id: 'RoomLiveStatus',
                                                     name: 'RoomLiveStatus',
                                                     fieldLabel: '入住状态',
                                                     columnWidth: 0.5,
                                                     labelWidth: 80,
                                                     queryMode: 'local',
                                                     displayField: 'TEXT',
                                                     valueField: 'VALUE',
                                                     store: new Ext.data.ArrayStore({
                                                         fields: ['TEXT', 'VALUE'],
                                                         data: [
                                                             ['空闲', 1],
                                                             ['已预订', 2],
                                                             ['已入住', 3],
                                                             ['待退房', 4]
                                                         ]
                                                     }),
                                                     value: 1
                                                 },
                                              {
                                                  xtype: 'ueditor',
                                                  zIndex: 1,
                                                  style: 'z-index:-9999',
                                                  margin: '10 10 10 10',
                                                  fieldLabel: '房间描述',
                                                  id: 'RoomRemark',
                                                  name: 'RoomRemark',
                                                  listeners: {
                                                      initialize: function () {
                                                          initData();
                                                      }
                                                  },
                                                  height: 200,
                                                  columnWidth: 1,
                                                  labelWidth: 80
                                              }
                                ]

                            }
                        ],
                        buttonAlign: 'center',
                        buttons: [
                            {
                                text: '保存',
                                handler: function () {
                                    var form = Ext.getCmp('addform');
                                    if (form.form.isValid()) {
                                        var values = form.getValues(false);

                                        CS('CZCLZ.RoomDB.SaveChildRoom', function (retVal) {
                                            if (retVal) {
                                                Ext.MessageBox.alert("提示", "保存成功!", function () {
                                                    FrameStack.popFrame();
                                                });
                                            }
                                        }, CS.onError, values, roomPic, goodsPic, ParentId, HotelId, RoomGuid);
                                    }
                                }

                            },
                            {
                                text: '返回',
                                handler: function () {
                                    FrameStack.popFrame();
                                }
                            }
                        ]
                    }
                ]
            });

            me.callParent(arguments);
        }

    });
    new add();

    //CS('CZCLZ.RoomDB.GetHotelCombobox', function (retVal) {
    //    if (retVal) {
    //        HotelStore.loadData(retVal, true);
    //    }
    //}, CS.onError);
});

Ext.define('phWin', {
    extend: 'Ext.window.Window',
    height: 275,
    width: 653,
    modal: true,
    layout: 'border',
    initComponent: function () {
        var me = this;
        var lx = me.lx;
        me.items = [{
            xtype: 'UploaderPanel',
            id: 'uploadproductpic',
            region: 'center',
            autoScroll: true,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    xtype: 'filefield',
                    fieldLabel: '上传图片',
                    buttonText: '浏览'
                }

                ]
            }],
            buttonAlign: 'center',
            buttons: [
                 {
                     xtype: 'button',
                     text: '上传',
                     iconCls: 'upload',
                     handler: function () {
                         if (lx == 1 && roomPic.length == 5) {
                             Ext.MessageBox.alert("提示", "最多只能上传5张照片!");
                             return;
                         }
                         if (lx == 2 && goodsPic.length == 5) {
                             Ext.MessageBox.alert("提示", "最多只能上传5张照片!");
                             return;
                         }
                         Ext.getCmp('uploadproductpic').upload('CZCLZ.RoomDB.UploadPicForProduct', function (retVal) {
                             Ext.getCmp('uploadproductpic').add(new SelectImg({
                                 isSelected: retVal.isDefault,
                                 src: retVal.fileurl,
                                 fileid: retVal.fileurl
                             }));
                             if (lx == 1)
                                 roomPic.push(retVal.fileurl);
                             else
                                 goodsPic.push(retVal.fileurl);
                         }, CS.onError, lx);
                     }
                 },
            {
                text: '删除',
                handler: function () {
                    Ext.MessageBox.confirm('确认', '是否删除该图片？', function (btn) {
                        if (btn == 'yes') {
                            var selPics = Ext.getCmp('uploadproductpic').query('image[isSelected=true]');
                            if (selPics.length > 0) {
                                Ext.getCmp('uploadproductpic').remove(selPics[0]);
                                if (lx == 1) {
                                    for (var i = 0; i < roomPic.length; i++) {
                                        if (roomPic[i] == selPics[0].fileid) {
                                            roomPic.splice(i, 1);
                                            break;
                                        }
                                    }
                                }
                                else {
                                    for (var i = 0; i < goodsPic.length; i++) {
                                        if (goodsPic[i] == selPics[0].fileid) {
                                            goodsPic.splice(i, 1);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            }]
        }];
        me.callParent(arguments);
    }
});

Ext.define('SelectImg', {
    extend: 'Ext.Img',

    height: 80,
    width: 120,
    margin: 5,
    padding: 2,
    constructor: function (config) {
        var me = this;
        config = config || {};
        config.cls = config.isSelected ? "clsSelected" : "clsUnselected";
        me.callParent([config]);
        me.on('render', function () {
            Ext.fly(me.el).on('click', function () {
                var oldSelectImg = Ext.getCmp('uploadproductpic').query('image[isSelected=true]');
                if (oldSelectImg.length < 0 || oldSelectImg[0] != me) {
                    me.removeCls('clsUnselected');
                    me.addCls('clsSelected');
                    me.isSelected = true;
                    if (oldSelectImg.length > 0) {
                        oldSelectImg[0].removeCls('clsSelected');
                        oldSelectImg[0].addCls('clsUnselected');
                        oldSelectImg[0].isSelected = false;
                    }
                }
            });
        });

    },

    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    }
});