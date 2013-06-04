/**
 * File: app/view/GbMapTabPanel.js
 *
 */

Ext.define('Gb41.view.GbMapTabPanel', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.gbmaptabpanel',

	hidden: false,
	animCollapse: false,
	collapsible: false,
	activeTab: 0,

	initComponent: function() {
		var me = this;

		Ext.applyIf(me, {
			items: [
				{
					xtype: 'panel',
					hidden: true,
					title: 'OSM'
				}
			]
		});

		me.callParent(arguments);
	}
	
});