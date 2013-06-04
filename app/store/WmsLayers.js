/**
 * File: app/store/WmsLayers.js
 *
 */

Ext.define('Gb41.store.WmsLayers', {
	extend: 'Ext.data.Store',
	requires: [
		'Gb41.model.WmsLayer'
	],

	constructor: function(cfg) {
		var me = this;
		cfg = cfg || {};
		me.callParent([Ext.apply({
			storeId: 'MyJsonStore3',
			model: 'Gb41.model.WmsLayer'
		}, cfg)]);
	},

	proxy: {
		type: 'ajax',
		//url: 'data/layers.json',
		url: '/layers.json',
		reader: {
			type: 'json',
			idProperty: 'id',
			messageProperty: 'messageProperty',
			root: 'wmslayers',
			totalProperty: 'results'
		}
	}
});