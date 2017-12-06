
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
                                        padding:20,
                                        fieldLabel: '提现宾馆'
                                    },
                                    {
                                        xtype: 'displayfield',
                                        columnWidth: 1,
                                        padding: 20,
                                        fieldLabel: '可提现余额',
                                        value: ''
                                    },
                                    {
                                        xtype: 'numberfield',
                                        columnWidth: 1,
                                        padding: 20,
                                        fieldLabel: '提现金额'
                                    },
                                    {
                                        xtype: 'combobox',
                                        columnWidth: 1,
                                        padding: 20,
                                        fieldLabel: 'Label'
                                    },
                                    {
                                        xtype: 'textareafield',
                                        columnWidth: 1,
                                        padding: 20,
                                        fieldLabel: 'Label'
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
});