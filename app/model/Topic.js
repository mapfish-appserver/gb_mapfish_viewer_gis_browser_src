/**
 * File: app/model/Topic.js
 *
 */

Ext.define('Gb41.model.Topic', {
	extend: 'Ext.data.Model',

	idProperty: 'name',

	fields: [
		{
			name: 'name',
			type: 'string'
		},
		{
			name: 'title',
			type: 'string',
			sortType: 'asUCText' 
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
			type: 'string',
			sortType: 'asUCText' 
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
			type: 'string',
			sortType: 'asUCText' 
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
			name: 'parent_id',
			type: 'int'
		},
		{
			name: 'missingpermission',
			type: 'boolean'
		},
		{
			name: 'background_layer',
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
			name: 'minscale',
			type: 'auto'
		},
		{
			name: 'keywords',
			type: 'auto'
		},
		{
			name: 'tools',
			type: 'auto'
		},
		{
			name: 'ollayer_class',
			type: 'string'
		},
		{
			name: 'ollayer_type',
			type: 'string'
		},
		{
			name: 'bg_topic',
			type: 'string'
		},
		{
			name: 'overlay_topics',
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
		},
		{
			name: 'gb1_params',
			type: 'auto'
		}
	],

	proxy: {
		type: 'ajax',
		extraParams: {
			gbapp: 'gbzh'
		},
		//url: 'data/topics.json',
		url: '/topics.json',
		reader: {
			type: 'json',
			root: 'gbtopics',
			totalProperty: 'results'
		}
	}
});