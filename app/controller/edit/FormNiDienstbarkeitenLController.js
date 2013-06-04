/*
 * File: app/controller/edit/FormNiDienstbarkeitenLController.js
 *
 * Controller for FormNiDienstbarkeitenL edit panel
 */
Ext.define('Gb41.controller.edit.FormNiDienstbarkeitenLController', {
	extend: 'Gb41.controller.GbEditToolsController',

	views: [
		'edit.FormNiDienstbarkeitenL'
	],

        refs: [
		{
			ref: 'editPanel',
			selector: 'editFormNiDienstbarkeitenL' // alias name of view panel class
		},
		{
			ref: 'toolbar',
			selector: 'editFormNiDienstbarkeitenL toolbar'
		},
		{
			ref: 'btnSelect',
			selector: 'editFormNiDienstbarkeitenL #btnSelect'
		},
		// Dienstbarkeiten
		{
			ref: 'fieldsetDienstbarkeiten',
			selector: 'editFormNiDienstbarkeitenL #fieldsetDienstbarkeiten'
		},
		// form buttons
		{
			ref: 'btnEdit',
			selector: 'editFormNiDienstbarkeitenL #btnEdit'
		},
		{
			ref: 'btnSave',
			selector: 'editFormNiDienstbarkeitenL #btnSave'
		},
		{
			ref: 'btnReset',
			selector: 'editFormNiDienstbarkeitenL #btnReset'
		},
		{
			ref: 'btnCancel',
			selector: 'editFormNiDienstbarkeitenL #btnCancel'
		}
	],

	// overwrite clickTolerance
	clickTolerance: 10,

	// identifier for managing OL controls
	editPanelName: 'NiDienstbarkeitenL',

	// edit layer config
	editLayerName: "Dienstbarkeiten Linien",
	editLayerUrl: '/geo/ni_dienstbarkeiten_ls',
	editLayerGeometryType: 'Linestring',

	init: function () {
		this.callParent(arguments);

		this.control({
			'editFormNiDienstbarkeitenL': {
				activate: this.onEditPanelActivate,
				deactivate: this.onEditPanelDeactivate,
				beforedestroy: this.onEditPanelDestroy
			},
			'editFormNiDienstbarkeitenL #btnAdd': {
				toggle: this.onBtnAddToggle
			},
			'editFormNiDienstbarkeitenL #btnSelect': {
				toggle: this.onBtnSelectToggle
			},
			'editFormNiDienstbarkeitenL #btnDelete': {
				toggle: this.onBtnDeleteToggle
			},
			'editFormNiDienstbarkeitenL #btnEdit': {
				click: this.onBtnEditClick
			},
			'editFormNiDienstbarkeitenL #btnSave': {
				click: this.onBtnSaveClick
			},
			'editFormNiDienstbarkeitenL #btnReset': {
				click: this.onBtnResetClick
			},
			'editFormNiDienstbarkeitenL #btnCancel': {
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
