/**
 * File: app/model/WmsLayer.js
 *
 */

Ext.define('Gb41.model.WmsLayer', {
	extend: 'Ext.data.Model',

	fields: [
		{
			name: 'id'
		},
		{
			name: 'niveau',
			type: 'int'
		},
		{
			name: 'layername'
		},
		{
			name: 'topic'
		},
		{
			name: 'groupname'
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
		{
			name: 'wms_sort',
			type: 'int'
		},
		{
			name: 'toc_sort',
			type: 'int'
		},
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