var hotelStore = Ext.create('Ext.data.Store', {
    fields: ['ID', 'HotelName']
});

var PayStore = Ext.create('Ext.data.Store', {
    fields: ['ID', 'MC'],
    data: [
        { 'ID': '2', 'MC': '微信打款' },
        { 'ID': '6', 'MC': '线下打款' },
        { 'ID': '8', 'MC': '支付宝打款' }
    ]
});

Ext.onReady(function () {
    Ext.define('MainView', {
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
                            align: 'center',
                            pack: 'center',
                            type: 'vbox'
                        },
                        items: [
                            {
                                xtype: 'panel',
                                flex: 1,
                                height: 747,
                                width: 543,
                                layout: {
                                    type: 'column'
                                },
                                border: 0,
                                items: [
                                    {
                                        xtype: 'combobox',
                                        columnWidth: 1,
                                        editable: false,
                                        queryMode: 'local',
                                        valueField: 'ID',
                                        displayField: 'HotelName',
                                        store: hotelStore,
                                        id: 'HotelSelect',
                                        padding:20,
                                        fieldLabel: '提现宾馆',
                                        listeners: {
                                            change: function (obj, newValue, oldValue, eOpts) {
                                                getHotel();
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'displayfield',
                                        columnWidth: 1,
                                        padding: 20,
                                        fieldLabel: '可提现余额（元）',
                                        id:'MoneyShow',
                                        value: ''
                                    },
                                    {
                                        xtype: 'numberfield',
                                        columnWidth: 1,
                                        padding: 20,
                                        id: 'TxMoney',
                                        allowDecimals: true,
                                        decimalPrecision: 2,
                                        fieldLabel: '提现金额'
                                    },
                                    {
                                        xtype: 'combobox',
                                        columnWidth: 1,
                                        padding: 20,
                                        editable: false,
                                        queryMode: 'local',
                                        valueField: 'ID',
                                        displayField: 'MC',
                                        store: PayStore,
                                        id: 'PayType',
                                        fieldLabel: '打款方式'
                                    },
                                    {
                                        xtype: 'textareafield',
                                        columnWidth: 1,
                                        padding: 20,
                                        height: 120,
                                        id: 'Remark',
                                        fieldLabel: '备注'
                                    }
                                ],
                                buttonAlign: 'center',
                                buttons: [
                                    {
                                        text: '提交',
                                        iconCls: 'save',
                                        handler: function () {
                                            if (Ext.getCmp("HotelSelect").getValue() == "" || Ext.getCmp("HotelSelect").getValue() == null)
                                            {
                                                Ext.Msg.alert("提示", "没有可提款的门店！", function () {
                                                    return;
                                                });
                                            }

                                            if (Ext.getCmp("TxMoney").getValue() == "" || Ext.getCmp("TxMoney").getValue() == null)
                                            {
                                                Ext.Msg.alert("提示", "提现金额不能为空！", function () {
                                                    return;
                                                });
                                            }

                                            if (parseFloat(Ext.getCmp("TxMoney").getValue()) > parseFloat(Ext.getCmp("MoneyShow").getValue()))
                                            {
                                                Ext.Msg.alert("提示", "提现金额不能超过可提现总额！", function () {
                                                    return;
                                                });
                                            }

                                            if (Ext.getCmp("PayType").getValue() == "" || Ext.getCmp("PayType").getValue() == null)
                                            {
                                                Ext.Msg.alert("提示", "打款方式不能为空！", function () {
                                                    return;
                                                });
                                            }

                                            CS('CZCLZ.FinanceDB.SubmitTXOrder', function (retVal) {
                                                if (retVal) {
                                                    if (retVal.status == "ok") {
                                                        Ext.MessageBox.alert("提示", "提现成功！", function () {
                                                            location.href = "FinanceHandler.html";
                                                        });
                                                    }
                                                }
                                                else {
                                                    Ext.MessageBox.alert("提示", "提现失败！");
                                                }
                                            }, CS.onError, Ext.getCmp("HotelSelect").getValue(), Ext.getCmp("TxMoney").getValue(), Ext.getCmp("PayType").getValue(), Ext.getCmp("Remark").getValue())
                                        }
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

    var mainView = new MainView();

    getHotel();

});

function getHotel() {
    CS('CZCLZ.FinanceDB.GetHotelComboboxByUserId', function (retVal) {
        if (retVal) {
            hotelStore.loadData(retVal);
            if (hotelStore.data.length > 0) {
                Ext.getCmp('HotelSelect').setValue(hotelStore.data.items[0].data.ID);
                getHotelBanlance(Ext.getCmp('HotelSelect').getValue());
            }
        }
    }, CS.onError)
}

function getHotelBanlance(hotelid)
{
    CS('CZCLZ.FinanceDB.getHotelBalance', function (retVal) {
        if(retVal)
        {
            Ext.getCmp("MoneyShow").setValue(retVal);
        }
    }, CS.onError, hotelid)
}