var store = new Ext.data.Store({
    fields: ['XWLB_ID', 'XWLB_NAME'],
    data: [],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});



Ext.define('NewsEditViewport', {
    extend: 'Ext.container.Viewport',

    layout: {
        type: 'border'
    },

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'form',
                    id: 'editForm',
                    layout: {
                        align: 'stretch',
                        type: 'vbox'
                    },
                    bodyPadding: 10,
                    border: false,
                    title: '新闻编辑',
                    region: 'center',
                    items: [
                         
                        {
                            xtype: 'ueditor',
                            style: 'z-index:1;',
                            fieldLabel: '新闻内容',
                            id: 'XW_CONTEXT',
                            name: 'XW_CONTEXT',
                           
                            flex: 1
                        }
                    ],
                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [

                            {
                                xtype: 'button',
                                text: '保存',
                                iconCls: 'save',
                                handler: function () {
                                    Ext.MessageBox.alert("提示", "保存成功!", function () {
                                        FrameStack.popFrame();
                                    });
                                }
                            },
                            {
                                xtype: 'button',
                                text: '取消',
                                iconCls: 'close',
                                handler: function () {
                                    window.location.href = 'newslist.html';
                                }
                            }
                        ]
                    }]
                }
            ]
        });

        me.callParent(arguments);
    }

});



var newsId = window.queryString['id'];

function saveNews() {
    var editForm = Ext.getCmp('editForm').form;
    if (editForm.isValid()) {
        var vals = editForm.getValues();
        var realVals = new Object();
        if (newsId)
            realVals['newsid'] = newsId;
        else
            realVals['newsid'] = '';
        realVals['title'] = vals['XW_TITLE'];
        realVals['contxt'] = vals['XW_CONTEXT'];

        realVals['XW_TITLE_SMALL'] = vals['XW_TITLE_SMALL'];
        realVals['ADDTIME'] = vals['ADDTIME'];
        realVals['XW_CONTEXT_SMALL'] = vals['XW_CONTEXT_SMALL'];


        CS('CZCLZ.News.SaveNews', function (retVal) {
            Ext.Msg.show({
                title: '提示',
                msg: '保存成功',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO,
                fn: function (btn) {
                    if (btn == 'ok') {
                        window.location.href = 'newslist.html';
                    }
                }
            });
        }, CS.onError, realVals);
    }
}
function initData() {

    if (newsId) {
        var editForm = Ext.getCmp('editForm');
        CS('CZCLZ.News.GetNews', function (retVal) {
            editForm.form.setValues(retVal.dt[0]);
        }, CS.onError, newsId);



    }
}

Ext.onReady(function () {
    new NewsEditViewport();
    Ext.getCmp('XW_CONTEXT').setValue
});



//******************************************上传数据********************************************
Ext.define('sbBdwin', {
    extend: 'Ext.window.Window',
    title: "上传",
    height: 120,
    width: 400,
    modal: true,
    layout: 'border',
    id: 'sbBdwin',
    initComponent: function () {
        var me = this;
        var SPID = me.SPID;


        me.items = [{
            xtype: 'UploaderPanel',
            id: 'sbBdform',
            region: 'center',
            autoScroll: true,
            items: [
                {
                    xtype: 'filefield',
                    allowBlank: false,
                    width: 300,
                    labelWidth: 65,
                    fieldLabel: '图片上传',
                    buttonText: '浏览'
                }, {
                    xtype: 'button',
                    text: '上传',
                    iconCls: 'upload',
                    handler: function () {

                        Ext.getCmp('sbBdform').upload('DataCenter.newsListMaxClass.UploadFJTwo', function (retVal) {
                            Ext.getCmp("btpic").setValue(retVal.fileid);
                            Ext.getCmp("fileolg").setValue("文件名：" + retVal.filename + "[<a href='" + retVal.fileurl + "' target='_blank'>查看</a>][<a href='javascript:void(0)' onclick='delfile()'>删除</a>]");


                            me.close();
                        }, CS.onError);
                    }
                }
            ]

        }];
        me.callParent(arguments);
    }
});
function delfile() {
    Ext.getCmp("btpic").setValue("");
    Ext.getCmp("fileolg").setValue("");
}
function DR() {
    var win = new sbBdwin();
    win.show();
}
//******************************************上传数据********************************************
