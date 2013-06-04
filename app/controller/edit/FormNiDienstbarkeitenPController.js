/*
 * File: app/controller/edit/FormNiDienstbarkeitenPController.js
 *
 * Controller for FormNiDienstbarkeitenP edit panel
 */
Ext.define('Gb41.controller.edit.FormNiDienstbarkeitenPController', {
	extend: 'Gb41.controller.GbEditToolsController',

	views: [
		'edit.FormNiDienstbarkeitenP'
	],

        refs: [
		{
			ref: 'editPanel',
			selector: 'editFormNiDienstbarkeitenP' // alias name of view panel class
		},
		{
			ref: 'toolbar',
			selector: 'editFormNiDienstbarkeitenP toolbar'
		},
		{
			ref: 'btnSelect',
			selector: 'editFormNiDienstbarkeitenP #btnSelect'
		},
		// Dienstbarkeiten
		{
			ref: 'fieldsetDienstbarkeiten',
			selector: 'editFormNiDienstbarkeitenP #fieldsetDienstbarkeiten'
		},
		// form buttons
		{
			ref: 'btnEdit',
			selector: 'editFormNiDienstbarkeitenP #btnEdit'
		},
		{
			ref: 'btnSave',
			selector: 'editFormNiDienstbarkeitenP #btnSave'
		},
		{
			ref: 'btnReset',
			selector: 'editFormNiDienstbarkeitenP #btnReset'
		},
		{
			ref: 'btnCancel',
			selector: 'editFormNiDienstbarkeitenP #btnCancel'
		}
	],

	// overwrite clickTolerance
	clickTolerance: 10,

	// identifier for managing OL controls
	editPanelName: 'NiDienstbarkeitenP',

	// edit layer config
	editLayerName: "Dienstbarkeiten Punkte",
	editLayerUrl: '/geo/ni_dienstbarkeiten_ps',
	editLayerGeometryType: 'Point',

	init: function () {
		this.callParent(arguments);

		this.control({
			'editFormNiDienstbarkeitenP': {
				activate: this.onEditPanelActivate,
				deactivate: this.onEditPanelDeactivate,
				beforedestroy: this.onEditPanelDestroy
			},
			'editFormNiDienstbarkeitenP #btnAdd': {
				toggle: this.onBtnAddToggle
			},
			'editFormNiDienstbarkeitenP #btnSelect': {
				toggle: this.onBtnSelectToggle
			},
			'editFormNiDienstbarkeitenP #btnDelete': {
				toggle: this.onBtnDeleteToggle
			},
			'editFormNiDienstbarkeitenP #btnEdit': {
				click: this.onBtnEditClick
			},
			'editFormNiDienstbarkeitenP #btnSave': {
				click: this.onBtnSaveClick
			},
			'editFormNiDienstbarkeitenP #btnReset': {
				click: this.onBtnResetClick
			},
			'editFormNiDienstbarkeitenP #btnCancel': {
				click: this.onBtnCancelClick
			}
                });
	},

	// show feature edit form and fill with feature attribute values
	showFeatureAttributes: function(feature) {
		this.callParent(arguments);

		this.getToolbar().disable();

		// show widgets
		this.getFieldsetDienstbarkeiten().show();
		this.getBtnSave().show();
		this.getBtnReset().show();
		this.getBtnCancel().show();
	},

	// hide feature edit form
	hideFeatureAttributes: function() {
		this.callParent(arguments);

		this.getToolbar().enable();

		// hide widgets
		this.getBtnEdit().hide();
		this.getFieldsetDienstbarkeiten().hide();
		this.getBtnSave().hide();
		this.getBtnReset().hide();
		this.getBtnCancel().hide();
	},

	// default tool
	defaultEditToolButton: function() {
		return this.getBtnSelect();
	},

	// disable edit form until edit mode activated
	setFeatureFormDisabled: function(disabled) {
		this.getBtnEdit().setVisible(disabled);

		this.getFieldsetDienstbarkeiten().setDisabled(disabled);
		this.getBtnSave().setDisabled(disabled);
		this.getBtnReset().setDisabled(disabled);
		this.getBtnCancel().setDisabled(disabled);

		this.scrollPanelToTop(this.getEditPanel());
	},

	// fill form fields from feature attributes
	readFeatureAttributes: function(feature) {
		// TODO
	},

	// apply form attributes to feature
	writeFeatureAttributes: function(feature) {
		// TODO
	}
});
