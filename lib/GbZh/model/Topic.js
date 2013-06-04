/**
 * File: GbZh/model/Topic.js
 */

Ext.define('GbZh.model.Topic', {
	extend: 'Ext.data.Model',

	idProperty: 'name',

	fields: [
		{
			name: 'name',
			type: 'string'
		},
		{
			name: 'title',
			type: 'string'
		},
		{
			name: 'print_title',
			type: 'string'
		},
		{
			name: 'gbapp_specific',
			type: 'int'
		},
		{
			name: 'categorytitle',
			type: 'string'
		},
		{
			name: 'categorysort',
			type: 'int'
		},
		{
			name: 'categories_topics_sort',
			type: 'int'
		},
		{
			name: 'organisationtitle',
			type: 'string'
		},
		{
			name: 'organisationsort',
			type: 'int'
		},
		{
			name: 'icon',
			type: 'string'
		},
		{
			name: 'geoliongdd',
			type: 'int'
		},
		{
			name: 'missingpermission',
			type: 'boolean'
		},
		{
			name: 'base_layer',
			type: 'boolean'
		},
		{
			name: 'main_layer',
			type: 'boolean'
		},
		{
			name: 'overlay_layer',
			type: 'boolean'
		},
		{
			name: 'hassubtopics',
			type: 'boolean'
		},
		{
			name: 'subtopics',
			type: 'auto'
		},
		{
			name: 'tools',
			type: 'auto'
		},
		{
			name: 'wms_url',
			type: 'string'
		},
		{
			name: 'wms_layer_options',
			type: 'auto'
		},
		{
			name: 'wms_layer_params',
			type: 'auto'
		}
	],

	proxy: {
		type: 'ajax',
		url: 'data/topics.json',
		extraParams: {'gbapp':'default'},
		reader: {
			type: 'json',
			root: 'gbtopics',
			totalProperty: 'results'
		}
	}
});