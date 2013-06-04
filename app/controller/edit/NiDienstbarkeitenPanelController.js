/*
 * File: app/controller/edit/NiDienstbarkeitenPanelController.js
 *
 * Controller for NiDienstbarkeitenPanel edit panel containing layer edit panels
 */
Ext.define('Gb41.controller.edit.NiDienstbarkeitenPanelController', {
	extend: 'Ext.app.Controller',

	views: [
		'edit.NiDienstbarkeitenPanel'
	],

	refs: [
		{
			ref: 'tabPanel',
			selector: '#tabpanelDienstbarkeiten'
		}
	],

	init: function () {
		this.control({
			'editNiDienstbarkeitenPanel': {
				activate: this.onPanelActivate,
				deactivate: this.onPanelDeactivate
			}
		});

		// register edit panel for the topic
		GbZh.base.ViewerState.fireEvent('registereditpanelclass', 'NIDienstbarkeitenZH', 'Gb41.view.edit.NiDienstbarkeitenPanel');
	},

	onPanelActivate: function () {
		// activate last panel
		this.getTabPanel().getActiveTab().setActive(true);
	},

	onPanelDeactivate: function () {
		// deactivate current panel
		this.getTabPanel().getActiveTab().setActive(false);
	}
});
