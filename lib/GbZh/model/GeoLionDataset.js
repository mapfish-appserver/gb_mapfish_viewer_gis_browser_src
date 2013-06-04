Ext.define('GbZh.model.GeoLionDataset', {
	extend: 'Ext.data.Model',
	fields: [
		{ name: 'title', type: 'string' },
		{ name: 'owner', type: 'string' },
		{ name: 'standdate', type: 'string' },
		{ name: 'nachfuehrungstyp', type: 'string' },
		{ name: 'kurzbeschreibung', type: 'string' },
		{ name: 'beschreibung', type: 'string' }
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
