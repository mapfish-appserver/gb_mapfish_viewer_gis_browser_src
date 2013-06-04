Ext.define('Gb41.model.Treemodel', {
	extend: 'Ext.data.Model',

	fields: [
		{
			name: 'id'
		},
		{
			name: 'layername'
		},
		{
			name: 'level'
		},
		{
			name: 'topic'
		},
		{
			name: 'goupname'
		},
		{
			name: 'toclayertitle'
		},
		{
			name: 'leglayertitle'
		},
		{
			name: 'showscale',
			type: 'boolean'
		},
		{
			name: 'minscale',
			type: 'int'
		},
		{
			name: 'maxscale',
			type: 'int'
		},
		{
			name: 'editeable',
			type: 'boolean'
		},
		{
			name: 'wms',
			type: 'boolean'
		},
		// {
		// 	name: 'wms_sort',
		// 	type: 'int'
		// },
		{
			name: 'visini',
			type: 'boolean'
		},
		{
			name: 'visuser',
			type: 'boolean'
		},
		{
			name: 'showtoc',
			type: 'boolean'
		}
	]
	});