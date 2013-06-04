Ext.define('GbZh.store.BitLys', {
	extend: 'Ext.data.Store',
    alias: 'store.bitlysstore',
    requires: [
        'GbZh.model.BitLy'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: false,
            storeId: 'BitLys',
            model: 'GbZh.model.BitLy'
        }, cfg)]);
    }
});
