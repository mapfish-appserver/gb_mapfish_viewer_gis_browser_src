/**
 * File: app/view/GbSearchTabPanel.js
 *
 */

Ext.define('Gb41.view.GbSearchTabPanel', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.gbsearchtabpanel',
	requires: [
		'Gb41.view.GbAddrSearch',
		'Gb41.view.GbParzSearch'
	],

	itemId: 'MySearchTabPanel',
	layout: {
		type: 'fit'
	},
	border: 0,
	activeTab: 0,

	initComponent: function() {
		var me = this;

		Ext.applyIf(me, {
			items: [
				{
					xtype: 'gbaddrsearch',
					itemId: 'MyGbAddrSearch'
				},
				{
					xtype: 'gbparzsearch',
					itemId: 'MyGbParzSearch'
				}
			]
		});

		me.callParent(arguments);
	}

});