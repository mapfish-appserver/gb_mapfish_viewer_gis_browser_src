/**
 * File: GbZh/store/Topics.js
 */

Ext.define('GbZh.store.Topics', {
    extend: 'Ext.data.Store',
    requires: [
        'GbZh.model.Topic'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            storeId: 'Topics',
            model: 'GbZh.model.Topic'
        }, cfg)]);
    }
});