Ext.define('GbZh.store.GeoLionDatasets', {
	extend: 'Ext.data.Store',
	requires: [
		'GbZh.model.GeoLionDataset'
	],
	model: 'GbZh.model.GeoLionDataset',
	autoLoad: false
});
