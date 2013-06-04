/*
 * File: app/controller/edit/FormNiDienstbarkeitenFController.js
 *
 * Controller for FormNiDienstbarkeitenF edit panel
 */
Ext.define('Gb41.controller.edit.FormNiDienstbarkeitenFController', {
	extend: 'Gb41.controller.GbEditToolsController',

	views: [
		'edit.FormNiDienstbarkeitenF'
	],

	refs: [
		{
			ref: 'editPanel',
			selector: 'editFormNiDienstbarkeitenF' // alias name of view panel class
		},
		// tool buttons
		{
			ref: 'toolbar',
			selector: 'editFormNiDienstbarkeitenF toolbar'
		},
		{
			ref: 'btnAdd',
			selector: 'editFormNiDienstbarkeitenF #btnAdd'
		},
		{
			ref: 'btnSelect',
			selector: 'editFormNiDienstbarkeitenF #btnSelect'
		},
		{
			ref: 'btnDelete',
			selector: 'editFormNiDienstbarkeitenF #btnDelete'
		},
		{
			ref: 'btnConfig',
			selector: 'editFormNiDienstbarkeitenF #btnConfig'
		},
		// Dienstbarkeiten
		{
			ref: 'fieldsetDienstbarkeiten',
			selector: 'editFormNiDienstbarkeitenF #fieldsetDienstbarkeiten'
		},
		{
			ref: 'fieldcontainerDienstbarkeiten',
			selector: 'editFormNiDienstbarkeitenF #fieldsetDienstbarkeiten fieldcontainer'
		},
		{
			ref: 'idField',
			selector: 'editFormNiDienstbarkeitenF #fieldsetDienstbarkeiten fieldcontainer #geodb_oid'
		},
		{
			ref: 'geomField',
			selector: 'editFormNiDienstbarkeitenF #fieldsetDienstbarkeiten fieldcontainer #geom'
		},
		{
			ref: 'bfsnrField',
			selector: 'editFormNiDienstbarkeitenF #fieldsetDienstbarkeiten #bfsnr'
		},
		{
			ref: 'parzellennummerField',
			selector: 'editFormNiDienstbarkeitenF #fieldsetDienstbarkeiten #parzellennummer'
		},
		{
			ref: 'dbklaufnrField',
			selector: 'editFormNiDienstbarkeitenF #fieldsetDienstbarkeiten #dbk_laufnr'
		},
		{
			ref: 'dbkartidField',
			selector: 'editFormNiDienstbarkeitenF #fieldsetDienstbarkeiten #dbk_art_id'
		},
		{
			ref: 'statusidField',
			selector: 'editFormNiDienstbarkeitenF #fieldsetDienstbarkeiten #status_id'
		},
		{
			ref: 'vonField',
			selector: 'editFormNiDienstbarkeitenF #fieldsetDienstbarkeiten #von'
		},
		{
			ref: 'bisField',
			selector: 'editFormNiDienstbarkeitenF #fieldsetDienstbarkeiten #bis'
		},
		{
			ref: 'bemerkungenField',
			selector: 'editFormNiDienstbarkeitenF #fieldsetDienstbarkeiten #bemerkungen'
		},
		// form buttons
		{
			ref: 'btnEdit',
			selector: 'editFormNiDienstbarkeitenF #btnEdit'
		},
		{
			ref: 'btnDelete',
			selector: 'editFormNiDienstbarkeitenF #btnDelete'
		},
		{
			ref: 'btnSave',
			selector: 'editFormNiDienstbarkeitenF #btnSave'
		},
		{
			ref: 'btnReset',
			selector: 'editFormNiDienstbarkeitenF #btnReset'
		},
		{
			ref: 'btnCancel',
			selector: 'editFormNiDienstbarkeitenF #btnCancel'
		}
	],

	// overwrite clickTolerance
	clickTolerance: 10,

	// identifier for managing OL controls
	editPanelName: 'NiDienstbarkeitenF',

	// edit layer config
	editLayerName: "Dienstbarkeiten Flächen",
	editLayerUrl: '/geo/ni_dienstbarkeiten_fs',
	editLayerGeometryType: 'MultiPolygon',

	init: function () {
		this.callParent(arguments);

		this.control({
			'editFormNiDienstbarkeitenF': {
				activate: this.onEditPanelActivate,
				deactivate: this.onEditPanelDeactivate,
				beforedestroy: this.onEditPanelDestroy
			},
			'editFormNiDienstbarkeitenF #btnAdd': {
				toggle: this.onBtnAddToggle
			},
			'editFormNiDienstbarkeitenF #btnSelect': {
				toggle: this.onBtnSelectToggle
			},
			'editFormNiDienstbarkeitenF #btnDelete': {
				toggle: this.onBtnDeleteToggle
			},
			'editFormNiDienstbarkeitenF #btnEdit': {
				click: this.onBtnEditClick
			},
			'editFormNiDienstbarkeitenF #btnDelete': {
				click: this.onBtnDeleteClick
			},
			'editFormNiDienstbarkeitenF #btnSave': {
				click: this.onBtnSaveClick
			},
			'editFormNiDienstbarkeitenF #btnReset': {
				click: this.onBtnResetClick
			},
			'editFormNiDienstbarkeitenF #btnCancel': {
				click: this.onBtnCancelClick
			}
		});

		// register edit panel for the topic
		GbZh.base.ViewerState.fireEvent('registereditpanelclass', 'NiDienstbarkeitenZH', 'Gb41.view.edit.FormNiDienstbarkeitenF');
	},

	// show feature edit form and fill with feature attribute values
	showFeatureAttributes: function (feature) {
		this.callParent(arguments);

		this.getToolbar().disable();

		// show widgets
		this.getFieldsetDienstbarkeiten().show();
		this.getBtnSave().show();
		if (this.getBtnSelect().pressed) {
			this.getBtnReset().show();
		}
		this.getBtnCancel().show();

		// update position lable
		this.editLayer.events.on({
			featuremodified: this.updatePositionLable,
			scope: this
		});
	},

	// hide feature edit form
	hideFeatureAttributes: function () {
		this.lastTool = null;
		this.callParent(arguments);

		this.getToolbar().enable();

		// hide widgets
		this.getBtnEdit().hide();
		this.getBtnDelete().hide();
		this.getFieldsetDienstbarkeiten().hide();
		this.getBtnSave().hide();
		this.getBtnReset().hide();
		this.getBtnCancel().hide();

		// stop updating position lable
		this.editLayer.events.un({
			featuremodified: this.updatePositionLable,
			scope: this
		});
	},

	updatePositionLable: function (e) {
		this.getGeomField().setValue(Math.round(e.feature.geometry.getCentroid().x) + " " + Math.round(e.feature.geometry.getCentroid().y));
	},

	// default tool
	defaultEditToolButton: function () {
		return this.getBtnSelect();
	},

	// disable edit form until edit mode activated
	setFeatureFormDisabled: function (disabled) {
		this.getBtnEdit().setVisible(disabled);
		this.getBtnDelete().setVisible(disabled);

		this.getFieldsetDienstbarkeiten().setDisabled(disabled);
		this.getFieldcontainerDienstbarkeiten().setDisabled(disabled);
		this.getBtnSave().setDisabled(disabled);
		this.getBtnReset().setDisabled(disabled);
		this.getBtnCancel().setDisabled(disabled);

		this.scrollPanelToTop(this.getEditPanel());
	},

	// fill form fields from feature attributes
	readFeatureAttributes: function (feature) {
		// Dienstbarkeiten
		this.getIdField().setValue(feature.attributes.geodb_oid);
		this.updatePositionLable({feature: feature});
		this.getBfsnrField().setValue(feature.attributes.bfsnr);
		this.getParzellennummerField().setValue(feature.attributes.parzellennummer);
		this.getDbklaufnrField().setValue(feature.attributes.dbk_laufnr);
		this.getDbkartidField().setValue(feature.attributes.dbk_art_id);
		this.getStatusidField().setValue(feature.attributes.status_id);
		this.getBemerkungenField().setValue(feature.attributes.bemerkungen);

		// format: "2012-10-18T00:00:00Z"
		this.getVonField().setValue(this.getValidDate(feature.attributes.von));
		this.getBisField().setValue(this.getValidDate(feature.attributes.bis));
	},

	// apply form attributes to feature
	writeFeatureAttributes: function (feature) {
		// Dienstbarkeiten
		feature.attributes.bfsnr = this.getBfsnrField().getValue();
		feature.attributes.parzellennummer = this.getParzellennummerField().getValue();
		feature.attributes.dbk_laufnr = this.getDbklaufnrField().getValue();
		feature.attributes.dbk_art_id = this.getDbkartidField().getValue();
		feature.attributes.status_id = this.getStatusidField().getValue();
		feature.attributes.bemerkungen = this.getBemerkungenField().getValue();

		feature.attributes.von = this.getDateString(this.getVonField().getValue());
		feature.attributes.bis = this.getDateString(this.getBisField().getValue());

		// remove protected attributes
		delete feature.attributes.geodb_oid;


	}
});
