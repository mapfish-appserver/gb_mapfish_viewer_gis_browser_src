Ext.define('GbZh.store.GeoLionServices', {
	extend: 'Ext.data.Store',
	requires: [
		'GbZh.model.GeoLionService'
	],
	model: 'GbZh.model.GeoLionService',
	autoLoad: false
});
