Ext.onReady(function () {
    Ext.define('mianView', {
        extend: 'Ext.container.Viewport',

        layout: {
            type: 'fit'
        },
        initComponent: function () {
            var me = this;
            Ext.applyIf(me, {
                items: [

                    {
                        xtype: 'tabpanel',
                        activeTab: 0,
                        id: 'tab',
                        layout: {
                            type: 'fit'
                        },
                        items: [
                               {
                                   xtype: 'panel',
                                   title: '登录密码',
                                   layout: {
                                       align: 'center',
                                       pack: 'center',
                                       type: 'vbox'
                                   },
                                   height: 100,

                                   items: [
                                       {
                                           xtype: 'form',
                                           id: 'form1',
                                           flex: 1,
                                           width: 350,
                                           border: 0,
                                           bodyPadding: 10,
                                           title: '',
                                           items: [
                                               {
                                                   xtype: 'textfield',
                                                   id: 'pw1',
                                                   fieldLabel: '密码',
                                                   labelWidth: 70,
                                                   inputType: 'password',
                                                   allowBlank: false,
                                                   anchor: '100%'
                                               },
                                              {
                                                  xtype: 'textfield',
                                                  id: 'pw2',
                                                  fieldLabel: '确认密码',
                                                  labelWidth: 70,
                                                  inputType: 'password',
                                                  allowBlank: false,
                                                  anchor: '100%'
                                              },
                                           ],
                                           buttonAlign: 'center',
                                           buttons: [
                                               {
                                                   text: '保存',
                                                   handler: function () {
                                                       var form = Ext.getCmp('form1');
                                                       if (form.form.isValid()) {
                                                           var pw1 = Ext.getCmp("pw1").getValue();
                                                           var pw2 = Ext.getCmp("pw2").getValue();
                                                           if (pw1 != pw2) {
                                                               Ext.MessageBox.alert('提示', '两次输入密码不一致，请重新输入。');
                                                               return;
                                                           }
                                                           else {

                                                               Ext.Msg.confirm('提醒', '确定修改？', function (btn) {
                                                                   if (btn == 'yes') {
                                                                       CS('CZCLZ.SystemDB.ModifyDLPassWord', function (retVal) {
                                                                           if (retVal) {
                                                                               Ext.MessageBox.alert('提示', '修改成功！', function () {
                                                                                   Ext.getCmp("pw1").setValue('');
                                                                                   Ext.getCmp("pw2").setValue('');
                                                                               });
                                                                           }
                                                                       }, CS.onError, pw1)
                                                                   }
                                                               });
                                                           }
                                                       }
                                                   }
                                               }
                                           ]
                                       }
                                   ]

                               },
                               {
                                   xtype: 'panel',
                                   title: '操作密码',
                                   layout: {
                                       align: 'center',
                                       pack: 'center',
                                       type: 'vbox'
                                   },
                                   height: 100,

                                   items: [
                                       {
                                           xtype: 'form',
                                           id: 'form2',
                                           flex: 1,
                                           width: 350,
                                           border: 0,
                                           bodyPadding: 10,
                                           title: '',
                                           items: [
                                               {
                                                   xtype: 'textfield',
                                                   id: 'pw3',
                                                   fieldLabel: '密码',
                                                   labelWidth: 70,
                                                   allowBlank: false,
                                                   inputType: 'password',
                                                   anchor: '100%'
                                               },
                                              {
                                                  xtype: 'textfield',
                                                  id: 'pw4',
                                                  fieldLabel: '确认密码',
                                                  labelWidth: 70,
                                                  allowBlank: false,
                                                  inputType: 'password',
                                                  anchor: '100%'
                                              },
                                           ],
                                           buttonAlign: 'center',
                                           buttons: [
                                               {
                                                   text: '保存',
                                                   handler: function () {
                                                       var form = Ext.getCmp('form2');
                                                       if (form.form.isValid()) {
                                                           var pw1 = Ext.getCmp("pw3").getValue();
                                                           var pw2 = Ext.getCmp("pw4").getValue();
                                                           if (pw1 != pw2) {
                                                               Ext.MessageBox.alert('提示', '两次输入密码不一致，请重新输入。');
                                                               return;
                                                           }
                                                           else {

                                                               Ext.Msg.confirm('提醒', '确定修改？', function (btn) {
                                                                   if (btn == 'yes') {
                                                                       CS('CZCLZ.SystemDB.ModifyCZPassWord', function (retVal) {
                                                                           if (retVal) {
                                                                               Ext.MessageBox.alert('提示', '修改成功！', function () {
                                                                                   Ext.getCmp("pw3").setValue('');
                                                                                   Ext.getCmp("pw4").setValue('');
                                                                               });
                                                                           }
                                                                       }, CS.onError, pw1)
                                                                   }
                                                               });
                                                           }
                                                       }
                                                   }
                                               }
                                           ]
                                       }
                                   ]

                               }
                        ]
                    }



                ]
            });
            me.callParent(arguments);
        }
    });
    new mianView();
})

