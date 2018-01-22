var id = queryString.id;
var RoomGuid = queryString.RoomGuid;
var HotelId = queryString.HotelId;
var ParentId = queryString.ParentId;
var tag

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
    CS('CZCLZ.RoomDB.GetTag', function (ret) {
        if (ret) {
            tag = ret;
            var Items = [];
            if (id != null && id != "") {
                CS('CZCLZ.RoomDB.GetRoomInfo', function (retVal) {
                    if (retVal) {
                        Ext.getCmp('addform').form.setValues(retVal.dt[0]);

                        var html = "";
                        if (retVal.dt[0]["Image1"] != "" && retVal.dt[0]["Image1"] != null)
                            html += '<div class="file-item uploadimages" style="margin-left:5px;margin-bottom:5px" imageurl="~/' + retVal.dt[0]["Image1"] + '"><img src="approot/r/' + retVal.dt[0]["Image1"] + '" width="100px" height="100px"/></div>';
                        if (retVal.dt[0]["Image2"] != "" && retVal.dt[0]["Image2"] != null)
                            html += '<div class="file-item uploadimages" style="margin-left:5px;margin-bottom:5px" imageurl="~/' + retVal.dt[0]["Image2"] + '"><img src="approot/r/' + retVal.dt[0]["Image2"] + '" width="100px" height="100px"/></div>';
                        if (retVal.dt[0]["Image3"] != "" && retVal.dt[0]["Image3"] != null)
                            html += '<div class="file-item uploadimages" style="margin-left:5px;margin-bottom:5px" imageurl="~/' + retVal.dt[0]["Image3"] + '"><img src="approot/r/' + retVal.dt[0]["Image3"] + '" width="100px" height="100px"/></div>';
                        if (retVal.dt[0]["Image4"] != "" && retVal.dt[0]["Image4"] != null)
                            html += '<div class="file-item uploadimages" style="margin-left:5px;margin-bottom:5px" imageurl="~/' + retVal.dt[0]["Image4"] + '"><img src="approot/r/' + retVal.dt[0]["Image4"] + '" width="100px" height="100px"/></div>';
                        if (retVal.dt[0]["Image5"] != "" && retVal.dt[0]["Image5"] != null)
                            html += '<div class="file-item uploadimages" style="margin-left:5px;margin-bottom:5px" imageurl="~/' + retVal.dt[0]["Image5"] + '"><img src="approot/r/' + retVal.dt[0]["Image5"] + '" width="100px" height="100px"/></div>';
                        $("#fileList").append(html);

                        var checkboxgroup = Ext.getCmp("bq");
                        for (var i = 0; i < ret.length; i++) {
                            var isCheck = false;
                            for (var j = 0; j < retVal.dt1.length; j++) {
                                if (ret[i].ID == retVal.dt1[j].TagId) {
                                    isCheck = true;
                                    break;
                                }
                            }
                            var checkbox = new Ext.form.Checkbox(
                              {
                                  boxLabel: ret[i].TagName,
                                  inputValue: ret[i].ID,
                                  id: ret[i].ID + "id",
                                  checked: isCheck,
                                  unit: ret[i].Unit,
                                  listeners: {
                                      change: function (e, newValue, oldValue, eOpts) {
                                          if (newValue) {
                                              var tf = new Ext.form.TextField({
                                                  xtype: 'textfield',
                                                  margin: '10 10 10 10',
                                                  labelWidth: 80,
                                                  fieldLabel: e.boxLabel,
                                                  id: e.inputValue,

                                                  columnWidth: 0.4
                                              });
                                              Ext.getCmp("addform").items.add(tf);

                                              var df = new Ext.form.DisplayField({
                                                  id: e.inputValue + "unit",
                                                  xtype: 'displayfield',
                                                  margin: '10 10 10 10',
                                                  columnWidth: 0.1,
                                                  value: e.unit
                                              });
                                              Ext.getCmp("addform").items.add(df);
                                          }
                                          else {
                                              var bq = Ext.getCmp(e.inputValue);
                                              var bq_unit = Ext.getCmp(e.inputValue + "unit");
                                              Ext.getCmp("addform").remove(bq);
                                              Ext.getCmp("addform").remove(bq_unit);
                                          }
                                          Ext.getCmp("addform").doLayout();
                                      }
                                  }
                              });
                            checkboxgroup.items.add(checkbox);
                        }

                        for (var i = 0; i < retVal.dt1.length; i++) {

                            var tf = new Ext.form.TextField({
                                xtype: 'textfield',
                                margin: '10 10 10 10',
                                labelWidth: 80,
                                fieldLabel: retVal.dt1[i].TagName1,
                                id: retVal.dt1[i].TagId + '',
                                name: retVal.dt1[i].TagId + '',
                                columnWidth: 0.4,
                                value: retVal.dt1[i].TagDec
                            });
                            Ext.getCmp("addform").items.add(tf);

                            var df = new Ext.form.DisplayField({
                                xtype: 'displayfield',
                                id: retVal.dt1[i].TagId + "unit",
                                margin: '10 10 10 10',
                                columnWidth: 0.1,
                                value: retVal.dt1[i].Unit
                            });
                            Ext.getCmp("addform").items.add(df);
                        }

                        Ext.getCmp("addform").doLayout();
                    }
                }, CS.onError, id);
            }
            else {
                var checkboxgroup = Ext.getCmp("bq");
                for (var i = 0; i < ret.length; i++) {
                    var checkbox = new Ext.form.Checkbox(
                      {
                          boxLabel: ret[i].TagName,
                          inputValue: ret[i].ID,
                          id: ret[i].ID + "id",
                          checked: false,
                          unit: ret[i].Unit,
                          listeners: {
                              change: function (e, newValue, oldValue, eOpts) {
                                  if (newValue) {
                                      var tf = new Ext.form.TextField({
                                          xtype: 'textfield',
                                          margin: '10 10 10 10',
                                          labelWidth: 80,
                                          fieldLabel: e.boxLabel,
                                          id: e.inputValue,

                                          columnWidth: 0.4
                                      });
                                      Ext.getCmp("addform").items.add(tf);

                                      var df = new Ext.form.DisplayField({
                                          id: e.inputValue + "unit",
                                          xtype: 'displayfield',
                                          margin: '10 10 10 10',
                                          columnWidth: 0.1,
                                          value: e.unit
                                      });
                                      Ext.getCmp("addform").items.add(df);
                                  }
                                  else {
                                      var bq = Ext.getCmp(e.inputValue);
                                      var bq_unit = Ext.getCmp(e.inputValue + "unit");
                                      Ext.getCmp("addform").remove(bq);
                                      Ext.getCmp("addform").remove(bq_unit);
                                  }
                                  Ext.getCmp("addform").doLayout();
                              }
                          }
                      });
                    checkboxgroup.items.add(checkbox);
                }

                Ext.getCmp("addform").doLayout();
            }
        }
    }, CS.onError);
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
                            type: 'vbox',
                            align: 'center'
                        },
                        autoScroll: true,
                        items: [
                            {
                                xtype: 'form',
                                id: 'addform',
                                layout: {
                                    type: 'column'
                                },
                                width: 850,
                                height:700,
                                border: true,
                                // margin: 10,
                                //title: '房间信息',
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
                                            //{
                                            //    xtype: 'displayfield',
                                            //    value: '<a href="#" onclick="tp(1)">上传</a>',
                                            //    margin: '10 10 10 10',
                                            //    fieldLabel: '房间图片',
                                            //    columnWidth: 0.5,
                                            //    labelWidth: 80
                                            //},
                                            //{
                                            //    xtype: 'displayfield',
                                            //    value: '<a href="#" onclick="tp(2)">上传</a>',
                                            //    margin: '10 10 10 10',
                                            //    fieldLabel: '物品图片',
                                            //    columnWidth: 0.5,
                                            //    labelWidth: 80
                                            //},

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
                                                      xtype: 'displayfield',
                                                      id: 'tp',
                                                      value: ' <div id="fileList"><div id="filePicker" style="float:left;margin-right:10px;margin-bottom:5px;width:50px;height:50px;">点击选择图片</div></div>',
                                                      margin: '10 10 10 10',
                                                      fieldLabel: '门店图片',
                                                      columnWidth: 1,
                                                      labelWidth: 80
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
                                                       xtype: 'textfield',
                                                       name: 'RoomAddress',
                                                       margin: '10 10 10 10',
                                                       fieldLabel: '房间地址',
                                                       columnWidth: 0.5,
                                                       labelWidth: 80

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
                                              },
                                               {
                                                   xtype: 'checkboxgroup',
                                                   id: 'bq',
                                                   margin: '10 10 10 10',
                                                   fieldLabel: '房间标签',
                                                   columnWidth: 1,
                                                   labelWidth: 80,
                                                   items: [
                                                   ]
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
                                        var tagids = [];
                                        var tagvalues = [];
                                        for (var i in tag) {
                                            if ($("#" + tag[i]["ID"] + "").length > 0) {
                                                var tagvalue = Ext.getCmp(tag[i]["ID"] + "").getValue();
                                                if (tagvalue != "") {
                                                    tagids.push(tag[i]["ID"]);
                                                    tagvalues.push(tagvalue);
                                                }
                                            }
                                        }

                                        var imglist = "";
                                        $("#fileList .file-item").each(function () {
                                            imglist += $(this).attr("imageurl") + ",";
                                        })

                                        if (imglist.length > 0)
                                            imglist = imglist.substr(0, imglist.length - 1);
                                        CS('CZCLZ.RoomDB.SaveChildRoom', function (retVal) {
                                            if (retVal) {
                                                Ext.MessageBox.alert("提示", "保存成功!", function () {
                                                    FrameStack.popFrame();
                                                });
                                            }
                                        }, CS.onError, values, roomPic, goodsPic, ParentId, HotelId, RoomGuid, tagids, tagvalues, imglist);
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
    initwebupload("filePicker", "fileList", 5);
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