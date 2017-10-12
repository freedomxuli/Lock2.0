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
                            type: 'fit'
                        },
                        id: 't_show',
                        height:document.documentElement.clientHeight,
                        html:""
                    }
                ]
            });
            me.callParent(arguments);
        }
    });
    new MainView();

    dataBind();
});



function dataBind()
{
    CS("CZCLZ.DeskTop.Tshow", function (retVal) {
        if (retVal)
        {
            Ext.getCmp("t_show").update(retVal);
            addListen();
        }
    },CS.onError)
}

function addListen() {
    var ydata = Ext.query("#yd-data td");
    for (var i = 0; i < ydata.length; i++) {
        Ext.EventManager.addListener(ydata[i], "click", function () {
            console.log($(this).children("input")[0].value);
            console.log($(this).children("input")[1].value);
        });
    }
}


