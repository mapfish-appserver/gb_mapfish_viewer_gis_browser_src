/**
 * File: app/view/GbViewport.js
 * 
 * Border layout of our GIS-Browser
 */

Ext.define('Gb41.view.GbViewport', {
	extend: 'Ext.container.Viewport',
	requires: [
		'Gb41.view.GbMapTabPanel',
		'Gb41.view.GbSearchTabPanel',
		'Gb41.view.GbTopicGrid',
		'Gb41.view.GbInfoTabPanel',
		'Gb41.view.GbPrintPanel',
		'Gb41.view.GbPermalinkPanel',
		'Gb41.view.GbEditPanel'
	],

	layout: {
		type: 'border'
	},

	// **** Texte ****
	/**
	* @cfg {String} titleWestRegionPanel
	* Panel title of west region.
	*/
	//<locale>
	titleWestRegionPanel: 'GIS-Browser',
	//</locale>	
	
	initComponent: function() {
		var me = this;

		Ext.applyIf(me, {
			items: [
				{
					xtype: 'gbmaptabpanel',
					itemId: 'MyGbMapTabPanel',
					margins: '0 0 5 0',
					region: 'center',
					split: false
				},
				{
					xtype: 'panel',
					ui: 'gbwestpanel',					
					frame: false,
					itemId: 'gbwest',
					width: 300,
					layout: {
						type: 'border'
					},
					collapsible: true,
					title: this.titleWestRegionPanel,
					titleCollapse: true,
					floatable: false,
					margins: '0 0 5 5',
					region: 'west',
					split: true,
					items: [
						{
							itemId: 'MyImpressum',
			//				flex: 1,
							height: 25,
							region: 'north',
							split: true,
							dockedItems: [
								{
									xtype: 'gbheadertoolbar',
									itemId: 'MyGbHeaderToolbar',
									flex: 1,
									dock: 'top'
								}
							]
						},
						{
							xtype: 'gbsearchtabpanel',
							itemId: 'MyGbSearchTabPanel',
							title: 'Suche',
			//				flex: 1,
							height: 100,
							region: 'north',
							split: true
						},
						{
							xtype: 'gbtopicgrid',
							itemId: 'MyGbTopicGrid',
							preventHeader: false,
							titleCollapse: false,
							columnLines: false,
			//				flex: 6,
							region: 'center'
						}
					]
				},
				{
					xtype: 'gbinfotabpanel',
					itemId: 'MyGbInfoTabPanel',
					floatable: false,
					margins: '0 5 5 0',
					region: 'east',
					split: true
				},
				{
					xtype: 'gbheaderzh',
					itemId: 'MyGbHeader',
					collapsible: true,
					//hideCollapseTool: true,
					preventHeader: true,
					collapseMode: 'mini',
					margins: '0 5 0 5',
					//margins: '5 5 5 5',
					split: true,
					region: 'north'
				}
			]
		});

		me.callParent(arguments);
	}
});