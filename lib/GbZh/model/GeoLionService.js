Ext.define('GbZh.model.GeoLionService', {
	extend: 'Ext.data.Model',
	fields: [
		{ name: 'gddnr', type: 'string' },
		{ name: 'title', type: 'string' },
		{ name: 'beschreibung', type: 'string' },
		{ name: 'url', type: 'string' },
		{ name: 'service', type: 'string' },
		{ name: 'servicetype', type: 'string' }
	],

	proxy: {
		type: 'jsonp',
		extraParams: {
			nr: 4
		},
		reader: {
			type: 'json',
			root: 'results'
		}
	}
});
