/**
 * File: app/store/Topics.js
 *
 */

Ext.define('Gb41.store.Topics', {
	extend: 'Ext.data.Store',
	requires: [
		'Gb41.model.Topic'
	],

	constructor: function (cfg) {
		var me = this;
		cfg = cfg || {};
		me.callParent([Ext.apply({
			storeId: 'Topics',
			model: 'Gb41.model.Topic'
		}, cfg)]);
	}
});