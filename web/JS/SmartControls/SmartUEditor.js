Ext.define('Ext.ux.UEditor', {
    extend: Ext.form.FieldContainer,
    mixins: {
        field: Ext.form.field.Field
    },
    alias: 'widget.ueditor',
    alternateClassName: 'Ext.form.UEditor',
    ueditorInstance: null,
    initialized: false,
    initComponent: function () {
        var me = this;
        me.addEvents('initialize', 'change');
        var id = me.id + '-ueditor';
        me.html = '<script id="' + id + '" type="text/plain" name="' + me.name + '"></script>';
        me.callParent(arguments);
        me.initField();
        me.on('render', function () {
            //console.log('width:' + me.getWidth() + ';height:' + me.getHeight());
            //var width = me.width - 205;
            //var height = me.height - 109;
            var config = { initialFrameWidth: "100%", initialFrameHeight:"100%", zIndex:1 };
            me.ueditorInstance = UE.getEditor(id, config);
            me.ueditorInstance.ready(function () {
                me.initialized = true;
                me.fireEvent('initialize', me);
                me.ueditorInstance.addListener('contentChange', function () {
                    me.fireEvent('change', me);
                });
                me.ueditorInstance.setHeight(me.getHeight() - me.ueditorInstance.ui.getDom('iframeholder').offsetTop);
            });
        });
    },
    
    getValue: function () {
        var me = this,
            value = '';
        if (me.initialized) {
            value = me.ueditorInstance.getContent();
        }
        me.value = value;
        return value;
    },
    setValue: function (value) {
        var me = this;
        if (value === null || value === undefined) {
            value = '';
        }
        if (me.initialized) {
            me.ueditorInstance.setContent(value);
        }
        return me;
    },
    listeners: {
        beforedestroy: function () {
            this.ueditorInstance.destroy();
        },
        resize: function (me, width, height, oldWidth, oldHeight, eOpts) {
            if (me.ueditorInstance.iframe)
                me.ueditorInstance.setHeight(height - me.ueditorInstance.ui.getDom('iframeholder').offsetTop);
        }
    }
});