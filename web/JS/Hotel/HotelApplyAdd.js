var id = queryString.id;
var picItem = [];

var dqstore = Ext.create('Ext.data.Store', {
    fields: ['VALUE', 'TEXT'],
    data: [
    ]
});



function DataBind() {
    CS('CZCLZ.JjrDB.GetFdById', function (retVal) {
        if (retVal) {
            var addform = Ext.getCmp("addform");
            addform.form.setValues(retVal[0]);
        }
    }, CS.onError, id);
}

function tp() {

    var win = new phWin();
    win.show(null, function () {
        for (var i = 0; i < picItem.length; i++) {
            Ext.getCmp('uploadproductpic').add(new SelectImg({
                isSelected: false,
                src: picItem[i],
                fileid: picItem[i]
            }));
        }
    });
}

function getUserInfo(phone) {
    CS('CZCLZ.HotelApplyDB.getUserInfo', function (retVal) {
        if (retVal.length > 0) {
            var win = new UserWin();
            win.show(null, function () {
                var UserForm = Ext.getCmp("UserForm");
                UserForm.form.setValues(retVal[0]);

            });

        }
        else {

        }
    }, CS.onError, phone);
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
                                title: '宾馆信息',
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
                                             name: 'HotelName',
                                             margin: '10 10 10 10',
                                             fieldLabel: '宾馆名称',
                                             columnWidth: 0.5,
                                             labelWidth: 80
                                         },
                                          {
                                              xtype: 'textfield',
                                              name: 'HotelNo',
                                              margin: '10 10 10 10',
                                              fieldLabel: '宾馆编号',
                                              allowBlank: false,
                                              columnWidth: 0.5,
                                              labelWidth: 80

                                          },
                                         {
                                             xtype: 'textfield',
                                             name: 'Mobile',
                                             margin: '10 10 10 10',
                                             fieldLabel: '联系手机',
                                             columnWidth: 0.5,
                                             labelWidth: 80,
                                             listeners: {
                                                 blur: function (value) {
                                                     getUserInfo(this.value);
                                                 }

                                             }

                                         },
                                         {
                                             xtype: 'textfield',
                                             name: 'Tel',
                                             margin: '10 10 10 10',
                                             fieldLabel: '联系座机',
                                             columnWidth: 0.5,
                                             labelWidth: 80,
                                             listeners: {
                                                 blur: function (value) {
                                                     getUserInfo(this.value);
                                                 }

                                             }

                                         },
                                         {
                                             xtype: 'combobox',
                                             name: 'ManagementMode',
                                             fieldLabel: '经营方式',
                                             margin: '10 10 10 10',
                                             columnWidth: 0.5,
                                             labelWidth: 80,
                                             queryMode: 'local',
                                             displayField: 'TEXT',
                                             valueField: 'VALUE',
                                             allowBlank: false,
                                             store: new Ext.data.ArrayStore({
                                                 fields: ['TEXT', 'VALUE'],
                                                 data: [
                                                     ['自营', 1],
                                                     ['门店管理员经营', 2],
                                                     ['平台托管', 3]
                                                 ]
                                             })
                                         },
                                         {
                                             xtype: 'panel',
                                             margin: '10 10 10 10',
                                             fieldLabel: '地点标注',
                                             columnWidth: 1,
                                             labelWidth: 80,
                                             html: '<iframe src="approot/r/MapSelect.aspx?v=122" frameborder="0" scrolling="no" width="100%" height="300px"></iframe>'
                                         },
                                         {
                                             xtype: 'displayfield',
                                             id: 'address',
                                             margin: '10 10 10 10',
                                             fieldLabel: '门店地区',
                                             columnWidth: 0.5,
                                             labelWidth: 80
                                         },
                                         {
                                             xtype: 'textfield',
                                             id: 'DetailAddress',
                                             name: 'DetailAddress',
                                             margin: '10 10 10 10',
                                             fieldLabel: '详细地址',
                                             columnWidth: 0.5,
                                             labelWidth: 80
                                         },
                                          {
                                              xtype: 'textfield',
                                              id: 'Province',
                                              name: 'Province',
                                              fieldLabel: '省',
                                              hidden: true
                                          },
                                           {
                                               xtype: 'textfield',
                                               id: 'City',
                                               name: 'City',
                                               fieldLabel: '市',
                                               hidden: true
                                           },
                                            {
                                                xtype: 'textfield',
                                                id: 'County',
                                                name: 'County',
                                                fieldLabel: '区',
                                                hidden: true
                                            },
                                           {
                                               xtype: 'textfield',
                                               id: 'Lat',
                                               name: 'Lat',
                                               fieldLabel: '纬度',
                                               hidden: true
                                           },
                                           {
                                               xtype: 'textfield',
                                               id: 'Lng',
                                               name: 'Lng',
                                               fieldLabel: '经度',
                                               hidden: true
                                           },
                                            {
                                                xtype: 'displayfield',
                                                value: '<a href="#" onclick="tp()">上传</a>',
                                                margin: '10 10 10 10',
                                                fieldLabel: '门店图片',
                                                columnWidth: 0.5,
                                                labelWidth: 80
                                            },
                                            //{
                                            //    xtype: 'displayfield',
                                            //    value: ' <div id="inputBox"><input type="file" title="请选择图片" id="file" multiple accept="image/png,image/jpg,image/gif,image/JPEG"/>点击选择图片</div>',
                                            //    margin: '10 10 10 10',
                                            //    fieldLabel: '门店图片',
                                            //    columnWidth: 0.5,
                                            //    labelWidth: 80
                                            //},
                                             {
                                                 xtype: 'displayfield',
                                                 value: '<div id="imgBox"></div>',
                                                 margin: '10 10 10 10',
                                                 columnWidth: 1,
                                                 labelWidth: 80
                                             },
                                            {
                                                xtype: 'checkboxgroup',
                                                id: 'ServiceInfo',
                                                name: 'ServiceInfo',
                                                columnWidth: 1,
                                                labelWidth: 80,
                                                margin: '10 10 10 10',
                                                fieldLabel: '门店提供服务',
                                                items: [
                                                    {
                                                        xtype: 'checkboxfield',
                                                        name: 'si',
                                                        boxLabel: '停车场',
                                                        value: '停车场'
                                                    },
                                                    {
                                                        xtype: 'checkboxfield',
                                                        name: 'si',
                                                        boxLabel: '接机服务',
                                                        value: '接机服务'
                                                    },
                                                    {
                                                        xtype: 'checkboxfield',
                                                        name: 'si',
                                                        boxLabel: '叫醒服务',
                                                        value: '叫醒服务'
                                                    },
                                                    {
                                                        xtype: 'checkboxfield',
                                                        name: 'si',
                                                        boxLabel: '可带宠物',
                                                        value: '可带宠物'
                                                    }
                                                ]
                                            },
                                             {
                                                 xtype: 'fieldcontainer',
                                                 layout: 'column',
                                                 columnWidth: 1,
                                                 items: [
                                                     {
                                                         xtype: 'numberfield',
                                                         name: 'HourRoomTimeLong',
                                                         margin: '10 10 10 10',
                                                         fieldLabel: '钟点房1时长',
                                                         columnWidth: 0.5,
                                                         labelWidth: 80

                                                     },
                                                     {
                                                         xtype: 'displayfield',
                                                         columnWidth: 0.5
                                                     }
                                                 ]
                                             },
                                               {
                                                   xtype: 'fieldcontainer',
                                                   layout: 'column',
                                                   columnWidth: 1,
                                                   items: [
                                                       {
                                                           xtype: 'numberfield',
                                                           name: 'HourRoomTimeLong2',
                                                           margin: '10 10 10 10',
                                                           fieldLabel: '钟点房2时长',
                                                           columnWidth: 0.5,
                                                           labelWidth: 80

                                                       },
                                                       {
                                                           xtype: 'displayfield',
                                                           columnWidth: 0.5
                                                       }
                                                   ]
                                               },
                                               {
                                                   xtype: 'fieldcontainer',
                                                   layout: 'column',
                                                   columnWidth: 1,
                                                   items: [
                                                       {
                                                           xtype: 'numberfield',
                                                           name: 'HourRoomTimeLong3',
                                                           margin: '10 10 10 10',
                                                           fieldLabel: '钟点房3时长',
                                                           columnWidth: 0.5,
                                                           labelWidth: 80

                                                       },
                                                       {
                                                           xtype: 'displayfield',
                                                           columnWidth: 0.5
                                                       }
                                                   ]
                                               },
                                               {
                                                   xtype: 'fieldcontainer',
                                                   columnWidth: 0.5,
                                                   layout: {
                                                       type: 'hbox',
                                                       align: 'middle'
                                                   },
                                                   items: [
                                                       {
                                                           xtype: 'numberfield',
                                                           name: 'CheckinHour',
                                                           margin: '10 10 10 10',
                                                           fieldLabel: '默认入住时间',
                                                           allowBlank: false,
                                                           width: 190,
                                                           labelWidth: 80
                                                       },
                                                        {
                                                            xtype: 'displayfield',
                                                            width: 20,
                                                            value: '时'
                                                        },
                                                        {
                                                            xtype: 'numberfield',
                                                            name: 'CheckinMinute',
                                                            allowBlank: false,
                                                            width: 100
                                                        },
                                                        {
                                                            xtype: 'displayfield',
                                                            width: 40,
                                                            value: '分'
                                                        }
                                                   ]
                                               },
                                                {
                                                    xtype: 'fieldcontainer',
                                                    columnWidth: 0.5,
                                                    layout: {
                                                        type: 'hbox',
                                                        align: 'middle'
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'numberfield',
                                                            name: 'CheckoutHour',
                                                            margin: '10 10 10 10',
                                                            fieldLabel: '默认退房时间',
                                                            allowBlank: false,
                                                            width: 190,
                                                            labelWidth: 80
                                                        },
                                                         {
                                                             xtype: 'displayfield',
                                                             width: 20,
                                                             value: '时'
                                                         },
                                                         {
                                                             xtype: 'numberfield',
                                                             name: 'CheckoutMinute',
                                                             allowBlank: false,
                                                             width: 100
                                                         },
                                                         {
                                                             xtype: 'displayfield',
                                                             width: 40,
                                                             value: '分'
                                                         }
                                                    ]
                                                },
                                               {
                                                   xtype: 'checkboxgroup',
                                                   id: 'IsHasWeekendPrice',
                                                   columnWidth: 0.5,
                                                   labelWidth: 90,
                                                   margin: '10 10 10 10',
                                                   fieldLabel: '是否区分周末价',
                                                   items: [
                                                       {
                                                           xtype: 'checkboxfield',
                                                           name: 'IsHasWeekendPrice',
                                                           boxLabel: '是'
                                                       }
                                                   ]
                                               },
                                                {
                                                    xtype: 'checkboxgroup',
                                                    id: 'zmdy',
                                                    columnWidth: 0.5,
                                                    labelWidth: 80,
                                                    margin: '10 10 10 10',
                                                    fieldLabel: '周末定义',
                                                    items: [
                                                        {
                                                            xtype: 'checkboxfield',
                                                            name: 'WeekendConatin5',
                                                            boxLabel: '周五'
                                                        },
                                                         {
                                                             xtype: 'checkboxfield',
                                                             name: 'WeekendConatin6',
                                                             boxLabel: '周六'
                                                         },
                                                         {
                                                             xtype: 'checkboxfield',
                                                             name: 'WeekendConatin7',
                                                             boxLabel: '周日'
                                                         }
                                                    ]
                                                },
                                                {
                                                    xtype: 'checkboxgroup',
                                                    id: 'IsOpenDayRent',
                                                    columnWidth: 0.5,
                                                    labelWidth: 90,
                                                    margin: '10 10 10 10',
                                                    fieldLabel: '是否开启全天房',
                                                    items: [
                                                        {
                                                            xtype: 'checkboxfield',
                                                            name: 'IsOpenDayRent',
                                                            boxLabel: '是'
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'checkboxgroup',
                                                    id: 'IsOpenHourRent',
                                                    columnWidth: 0.5,
                                                    labelWidth: 90,
                                                    margin: '10 10 10 10',
                                                    fieldLabel: '是否开启钟点房',
                                                    items: [
                                                        {
                                                            xtype: 'checkboxfield',
                                                            name: 'IsOpenHourRent',
                                                            boxLabel: '是'
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'checkboxgroup',
                                                    id: 'IsOpenMonthRent',
                                                    columnWidth: 0.5,
                                                    labelWidth: 90,
                                                    margin: '10 10 10 10',
                                                    fieldLabel: '是否开启月租房',
                                                    items: [
                                                        {
                                                            xtype: 'checkboxfield',
                                                            name: 'IsOpenMonthRent',
                                                            boxLabel: '是'
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'displayfield',

                                                    columnWidth: 0.5,
                                                    labelWidth: 90,
                                                    margin: '10 10 10 10'
                                                },
                                                 {
                                                     xtype: 'numberfield',
                                                     name: 'MonthRentPrice',
                                                     columnWidth: 0.5,
                                                     labelWidth: 90,
                                                     margin: '10 10 10 10',
                                                     fieldLabel: '月租房价格'
                                                 },
                                                 {
                                                     xtype: 'numberfield',
                                                     name: 'DepositPriceByMonth',
                                                     columnWidth: 0.5,
                                                     labelWidth: 90,
                                                     margin: '10 10 10 10',
                                                     fieldLabel: '月租房押金'
                                                 },
                                                 {
                                                     xtype: 'numberfield',
                                                     name: 'JSCycle',
                                                     columnWidth: 0.5,
                                                     labelWidth: 90,
                                                     margin: '10 10 10 10',
                                                     fieldLabel: '结算周期'
                                                 },
                                                {
                                                    xtype: 'numberfield',
                                                    name: 'DepositPrice',
                                                    columnWidth: 0.5,
                                                    labelWidth: 90,
                                                    margin: '10 10 10 10',
                                                    fieldLabel: '默认押金金额'
                                                },
                                                 {
                                                     xtype: 'radiogroup',
                                                     margin: '10 10 10 10',
                                                     columnWidth: 0.5,
                                                     labelWidth: 90,
                                                     id: 'JsPlatSel',
                                                     fieldLabel: '结算平台',
                                                     items: [
                                                         {
                                                             xtype: 'radiofield',
                                                             name: 'jspt',
                                                             inputValue: 0,
                                                             checked: true,
                                                             boxLabel: '微信'
                                                         },
                                                         {
                                                             xtype: 'radiofield',
                                                             name: 'jspt',
                                                             inputValue: 1,
                                                             boxLabel: '支付宝'
                                                         }, {
                                                             xtype: 'radiofield',
                                                             name: 'jspt',
                                                             inputValue: 2,
                                                             boxLabel: '银联'
                                                         }
                                                     ]
                                                 },
                                                  {
                                                      xtype: 'textfield',
                                                      name: 'AlipayAccount',
                                                      columnWidth: 0.5,
                                                      labelWidth: 90,
                                                      margin: '10 10 10 10',
                                                      fieldLabel: '账号'
                                                  },
                                                 {
                                                     xtype: 'textfield',
                                                     name: 'LiableAccount',
                                                     columnWidth: 0.5,
                                                     labelWidth: 90,
                                                     margin: '10 10 10 10',
                                                     fieldLabel: '门店负责人电话',
                                                     listeners: {
                                                         blur: function (value) {
                                                             getUserInfo(this.value);
                                                         }

                                                     }
                                                 },
                                                  {
                                                      xtype: 'textfield',
                                                      name: 'CleanerAccount',
                                                      columnWidth: 0.5,
                                                      labelWidth: 90,
                                                      margin: '10 10 10 10',
                                                      fieldLabel: '默认保洁手机',
                                                      listeners: {
                                                          blur: function (value) {
                                                              getUserInfo(this.value);
                                                          }
                                                      }
                                                  },
                                              {
                                                  xtype: 'ueditor',
                                                  zIndex: 1,
                                                  style: 'z-index:1',
                                                  margin: '10 10 10 10',
                                                  fieldLabel: '门店介绍',
                                                  id: 'DecRemark',
                                                  name: 'DecRemark',

                                                  height: 200,
                                                  columnWidth: 1,
                                                  labelWidth: 80
                                              },
                                              {
                                                  xtype: 'ueditor',
                                                  zIndex: 1,
                                                  style: 'z-index:1',
                                                  margin: '10 10 10 10',
                                                  fieldLabel: '门店规则',
                                                  id: 'ConsumeRule',
                                                  name: 'ConsumeRule',
                                                  listeners: {
                                                      initialize: function () {
                                                          setTimeout(initData(), 2000);
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
                                        var ServiceInfo = "";
                                        var cb1 = Ext.getCmp('ServiceInfo').items;
                                        if (cb1.get(0).getValue() == true)
                                            ServiceInfo += "停车场,";
                                        if (cb1.get(1).getValue() == true)
                                            ServiceInfo += "接机服务,";
                                        if (cb1.get(2).getValue() == true)
                                            ServiceInfo += "叫醒服务,";
                                        if (cb1.get(3).getValue() == true)
                                            ServiceInfo += "可带宠物,";
                                        if (ServiceInfo != "")
                                            values["ServiceInfo"] = ServiceInfo.substring(0, ServiceInfo.length - 1);

                                        if (Ext.getCmp('IsHasWeekendPrice').items.get(0).getValue() == true)
                                            values["IsHasWeekendPrice"] = 1;
                                        else
                                            values["IsHasWeekendPrice"] = 0;
                                        if (Ext.getCmp('zmdy').items.get(0).getValue() == true)
                                            values["WeekendConatin5"] = 1;
                                        else
                                            values["WeekendConatin5"] = 0;
                                        if (Ext.getCmp('zmdy').items.get(1).getValue() == true)
                                            values["WeekendConatin6"] = 1;
                                        else
                                            values["WeekendConatin6"] = 0;
                                        if (Ext.getCmp('zmdy').items.get(2).getValue() == true)
                                            values["WeekendConatin7"] = 1;
                                        else
                                            values["WeekendConatin7"] = 0;

                                        if (Ext.getCmp('IsOpenDayRent').items.get(0).getValue() == true)
                                            values["IsOpenDayRent"] = 1;
                                        else
                                            values["IsOpenDayRent"] = 0;

                                        if (Ext.getCmp('IsOpenHourRent').items.get(0).getValue() == true)
                                            values["IsOpenHourRent"] = 1;
                                        else
                                            values["IsOpenHourRent"] = 0;

                                        if (Ext.getCmp('IsOpenMonthRent').items.get(0).getValue() == true)
                                            values["IsOpenMonthRent"] = 1;
                                        else
                                            values["IsOpenMonthRent"] = 0;

                                        if (Ext.getCmp('JsPlatSel').items.get(0).getValue() == true)
                                            values["JsPlatSel"] = 0;
                                        else
                                            values["JsPlatSel"] = 1;
                                        CS('CZCLZ.HotelApplyDB.SaveHotel', function (retVal) {
                                            if (retVal) {
                                                //Ext.MessageBox.alert("提示", "保存成功!", function () {
                                                //    FrameStack.popFrame();
                                                //});
                                                FrameStack.popFrame()
                                            }
                                        }, CS.onError, values, picItem);
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
    imgUpload({
        inputId: 'file', //input框id
        imgBox: 'imgBox', //图片容器id
        buttonId: 'btn', //提交按钮id
        upUrl: 'php/imgFile.php',  //提交地址
        data: 'file1', //参数名
        num: "5"//上传个数
    })
});


function initData() {
    if (id != null && id != "") {
        CS('CZCLZ.HotelApplyDB.GetHotelInfo', function (retVal) {
            if (retVal) {
                Ext.getCmp('addform').form.setValues(retVal[0]);
                var ServiceInfo = retVal[0]["ServiceInfo"];
                var si = new Array();
                si = ServiceInfo.split(",");
                for (i = 0; i < si.length ; i++) {
                    if (si[i] == "停车场")
                        Ext.getCmp('ServiceInfo').items.get(0).setValue("on");
                    if (si[i] == "接机服务")
                        Ext.getCmp('ServiceInfo').items.get(1).setValue("on");
                    if (si[i] == "叫醒服务")
                        Ext.getCmp('ServiceInfo').items.get(2).setValue("on");
                    if (si[i] == "可带宠物")
                        Ext.getCmp('ServiceInfo').items.get(3).setValue("on");
                }
                if (retVal[0]["IsHasWeekendPrice"] == "1")
                    Ext.getCmp('IsHasWeekendPrice').items.get(0).setValue("on");
                if (retVal[0]["WeekendConatin5"] == "1")
                    Ext.getCmp('zmdy').items.get(0).setValue("on");
                if (retVal[0]["WeekendConatin6"] == "1")
                    Ext.getCmp('zmdy').items.get(1).setValue("on");
                if (retVal[0]["WeekendConatin7"] == "1")
                    Ext.getCmp('zmdy').items.get(2).setValue("on");
                if (retVal[0]["IsOpenDayRent"] == "1")
                    Ext.getCmp('IsOpenDayRent').items.get(0).setValue("on");
                if (retVal[0]["IsOpenHourRent"] == "1")
                    Ext.getCmp('IsOpenHourRent').items.get(0).setValue("on");
                if (retVal[0]["IsOpenMonthRent"] == "1")
                    Ext.getCmp('IsOpenMonthRent').items.get(0).setValue("on");
                if (retVal[0]["JsPlatSel"] == "0")
                    Ext.getCmp('JsPlatSel').items.get(0).setValue(true);
                else
                    Ext.getCmp('JsPlatSel').items.get(1).setValue(true);

                if (retVal[0]["Image1"] != "" && retVal[0]["Image1"] != null)
                    picItem.push(retVal[0]["Image1"]);
                if (retVal[0]["Image2"] != "" && retVal[0]["Image2"] != null)
                    picItem.push(retVal[0]["Image2"]);
                if (retVal[0]["Image3"] != "" && retVal[0]["Image3"] != null)
                    picItem.push(retVal[0]["Image3"]);
                if (retVal[0]["Image4"] != "" && retVal[0]["Image4"] != null)
                    picItem.push(retVal[0]["Image4"]);
                if (retVal[0]["Image5"] != "" && retVal[0]["Image5"] != null)
                    picItem.push(retVal[0]["Image5"]);


            }
        }, CS.onError, id);
    }
}


//获取地图信息
function updateparentinfo(objinfo) {
    if (objinfo.lat != null && objinfo.lat != "" && objinfo.lng != null && objinfo.lng != "") {
        Ext.getCmp("address").setValue(objinfo.province + "," + objinfo.city + "," + objinfo.county);
        Ext.getCmp("DetailAddress").setValue(objinfo.streetnumber);
        Ext.getCmp("Province").setValue(objinfo.province);
        Ext.getCmp("City").setValue(objinfo.city);
        Ext.getCmp("County").setValue(objinfo.county);
        Ext.getCmp("Lng").setValue(objinfo.lng);
        Ext.getCmp("Lat").setValue(objinfo.lat);
    }
    else {
        //$("#lblregion").html("");
        //$("#txtdetailaddress").val("");
    }
}

Ext.define('phWin', {
    extend: 'Ext.window.Window',
    height: 275,
    width: 653,
    modal: true,
    layout: 'border',
    initComponent: function () {
        var me = this;
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
                         Ext.getCmp('uploadproductpic').upload('CZCLZ.HotelApplyDB.UploadPicForProduct', function (retVal) {
                             Ext.getCmp('uploadproductpic').add(new SelectImg({
                                 isSelected: retVal.isDefault,
                                 src: retVal.fileurl,
                                 fileid: retVal.fileurl
                             }));
                             picItem.push(retVal.fileurl);
                         }, CS.onError);
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
                                for (var i = 0; i < picItem.length; i++) {
                                    if (picItem[i] == selPics[0].fileid) {
                                        picItem.splice(i, 1);
                                        break;
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

Ext.define('UserWin', {
    extend: 'Ext.window.Window',

    height: 250,
    width: 400,
    layout: {
        type: 'fit'
    },
    id: 'UserWin',
    closeAction: 'destroy',
    modal: true,
    title: '用户信息',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'UserForm',
                bodyPadding: 10,

                title: '',
                items: [
                    {
                        xtype: 'displayfield',
                        name: 'RealName',
                        fieldLabel: '姓名',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'displayfield',
                        name: 'RoleName',
                        fieldLabel: '角色',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'displayfield',
                        name: 'CellPhone',
                        fieldLabel: '手机号',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'displayfield',
                        name: 'IdCardNo',
                        fieldLabel: '身份证',
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '确定',
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