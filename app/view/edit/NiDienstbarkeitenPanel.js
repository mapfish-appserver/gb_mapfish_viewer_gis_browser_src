/*
 * File: app/view/edit/NiDienstbarkeitenPanel.js
 */
Ext.define('Gb41.view.edit.NiDienstbarkeitenPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.editNiDienstbarkeitenPanel',

	layout: {
		type: 'fit'
	},
	title: 'NiDienstbarkeiten',

	initComponent: function () {
		Ext.applyIf(this, {
			items: [
				{
					xtype: 'tabpanel',
					title: "Dienstbarkeiten",
					itemId: 'tabpanelDienstbarkeiten',
					componentCls: 'editpanel',
					border: 0,
					activeTab: 0,
					defaults: {
						border: 0,
						autoScroll: true
					},
					items: [
						{
							xtype: 'editFormNiDienstbarkeitenF'
						},
						{
							xtype: 'editFormNiDienstbarkeitenL'
						},
						{
							xtype: 'editFormNiDienstbarkeitenP'
						}
					]
				}
			]
		});

		this.callParent(arguments);
	}
});
