	/*
	* File: app/view/GbInfoTabPanel.js
	*
	* This file was generated by Sencha Architect version 2.0.0.
	* http://www.sencha.com/products/architect/
	*
	* This file requires use of the Ext JS 4.0.x library, under independent license.
	* License of Sencha Architect does not include license for Ext JS 4.0.x. For more
	* details see http://www.sencha.com/license or contact license@sencha.com.
	*
	* This file will be auto-generated each and everytime you save your project.
	*
	* Do NOT hand edit this file.
	*/

Ext.define('Gb41.view.GbInfoTabPanel', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.gbinfotabpanel',
	requires: [
		'Gb41.view.GbMapContent',
		'Gb41.view.GbInfoPanel'
	],

	width: 300,
	//collapseFirst: false,
	collapsible: true,
	title: 'Informationen',
	titleCollapse: true,
	activeTab: 0,

	initComponent: function () {
		var me = this;

		Ext.applyIf(me, {
			items: [
				{
					xtype: 'gbmapcontent',
					itemId: 'MyGbMapContent'
				},
				{
					xtype: 'gbinfopanel',
					itemId: 'MyGbInfoPanel',
					id: 'info'
				}
			],
			listeners: {
                tabchange: {
                    fn: me.onTabpanelTabChange,
                    scope: me
                }
            }
        });

		me.callParent(arguments);
	},

	onTabpanelTabChange: function (tabPanel, newCard, oldCard, options) {
		var modeString = newCard.xtype;
		if (modeString.indexOf('panel') > -1) {
			modeString = modeString.substring(0, modeString.indexOf('panel'));
		}
		if (modeString !== 'gbinfo') {
			GbZh.base.ViewerState.fireEvent('modeactivate', modeString, '', this);
		}
		//LOG console.log(arguments);
	}

});


