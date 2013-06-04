/**
 * File: app/controller/edit/FormAwelLhForstfeuerZHController.js
 *
 * Controller for AwelLhForstfeuerZH edit panel
 */

Ext.define('Gb41.controller.edit.FormAwelLhForstfeuerZHController', {
	extend: 'Gb41.controller.GbEditToolsController',

	views: [
		'edit.FormAwelLhForstfeuerZH'
	],

	refs: [
		{
			ref: 'editPanel',
			selector: 'editFormAwelLhForstfeuerZH' // alias name of view panel class
		},
		{
			ref: 'toolbar',
			selector: 'editFormAwelLhForstfeuerZH toolbar'
		},
		{
			ref: 'btnSelect',
			selector: 'editFormAwelLhForstfeuerZH #btnSelect'
		},
		// Bewilligung
		{
			ref: 'fieldsetBewilligung',
			selector: '#fieldsetBewilligung'
		},
		{
			ref: 'fieldsetHelp',
			selector: '#fieldsetHelp'
		},
		{
			ref: 'helpComponent',
			selector: '#helpComponent'
		},
		{
			ref: 'idField',
			selector: '#fieldsetBewilligung displayfield[name="geodb_oid"]'
		},
		{
			ref: 'geomField',
			selector: '#fieldsetBewilligung displayfield[name="geom"]'
		},
		{
			ref: 'erstellerField',
			selector: '#fieldsetBewilligung displayfield[name="ersteller"]'
		},
		{
			ref: 'dauervonField',
			selector: '#fieldsetBewilligung datefield[name="dauervon"]'
		},
		{
			ref: 'dauerbisField',
			selector: '#fieldsetBewilligung datefield[name="dauerbis"]'
		},
		{
			ref: 'bewilligtRadiogroup',
			selector: '#fieldsetBewilligung radiogroup[fieldLabel="Bewilligt"]'
		},
		{
			ref: 'grundField',
			selector: '#fieldsetBewilligung textareafield[name="grund"]'
		},
		// Bewilligungsnehmer
		{
			ref: 'fieldsetBewilligungsnehmer',
			selector: '#fieldsetBewilligungsnehmer'
		},
		{
			ref: 'vornameField',
			selector: '#fieldsetBewilligungsnehmer textfield[name="vorname"]'
		},
		{
			ref: 'nachnameField',
			selector: '#fieldsetBewilligungsnehmer textfield[name="name"]'
		},
		{
			ref: 'strasseField',
			selector: '#fieldsetBewilligungsnehmer textfield[name="strasse"]'
		},
		{
			ref: 'plzField',
			selector: '#fieldsetBewilligungsnehmer numberfield[name="plz"]'
		},
		{
			ref: 'ortField',
			selector: '#fieldsetBewilligungsnehmer textfield[name="ort"]'
		},
		{
			ref: 'telefonField',
			selector: '#fieldsetBewilligungsnehmer textfield[name="telefon"]'
		},
		{
			ref: 'natelField',
			selector: '#fieldsetBewilligungsnehmer textfield[name="natel"]'
		},
		// form buttons
		{
			ref: 'btnEdit',
			selector: 'editFormAwelLhForstfeuerZH #btnEdit'
		},
		{
			ref: 'btnDelete',
			selector: 'editFormAwelLhForstfeuerZH #btnDelete'
		},
		{
			ref: 'btnSave',
			selector: 'editFormAwelLhForstfeuerZH #btnSave'
		},
		{
			ref: 'btnReset',
			selector: 'editFormAwelLhForstfeuerZH #btnReset'
		},
		{
			ref: 'btnCancel',
			selector: 'editFormAwelLhForstfeuerZH #btnCancel'
		}
	],

	// overwrite clickTolerance 
	clickTolerance: 10,

	// identifier for managing OL controls
	editPanelName: 'AwelLhForstfeuerZH',

	// edit layer config
	editLayerName: "Forstfeuer",
	editLayerUrl: '/geo/awel_lh_forstfeuer_ps',
	editLayerGeometryType: 'Point',

	init: function () {
		this.callParent(arguments);

		this.control({
			'editFormAwelLhForstfeuerZH': {
				activate: this.onEditPanelActivate,
				deactivate: this.onEditPanelDeactivate,
				beforedestroy: this.onEditPanelDestroy
			},
			'editFormAwelLhForstfeuerZH #btnAdd': {
				toggle: this.onBtnAddToggle
			},
			'editFormAwelLhForstfeuerZH #btnSelect': {
				toggle: this.onBtnSelectToggle
			},
			'editFormAwelLhForstfeuerZH #btnEdit': {
				click: this.onBtnEditClick
			},
			'editFormAwelLhForstfeuerZH #btnDelete': {
				click: this.onBtnDeleteClick
			},
			'editFormAwelLhForstfeuerZH #btnSave': {
				click: this.onBtnSaveClick
			},
			'editFormAwelLhForstfeuerZH #btnReset': {
				click: this.onBtnResetClick
			},
			'editFormAwelLhForstfeuerZH #btnCancel': {
				click: this.onBtnCancelClick
			}
		});

		GbZh.base.ViewerState.on({
			// events für helpmeldung
			featureeditsuccess: {
				fn: this.onFeatureEditSuccess,
				scope: this
			}
		});


		// register edit panel for the topic
		GbZh.base.ViewerState.fireEvent('registereditpanelclass', 'AwelLhForstFeuerZH', 'Gb41.view.edit.FormAwelLhForstfeuerZH');
	},

	// show feature edit form and fill with feature attribute values
	showFeatureAttributes: function (feature) {
		this.callParent(arguments);

	//	this.getToolbar().disable();

		// show widgets
//		this.getFieldsetHelp().hide();
		this.getFieldsetBewilligung().show();
		this.getFieldsetBewilligungsnehmer().show();
		this.getBtnSave().show();
		this.getBtnReset().show();
		this.getBtnCancel().show();

		// update position lable
		this.editLayer.events.on({
			featuremodified: this.updatePositionLable,
			scope: this
		});
	},

	// hide feature edit form
	hideFeatureAttributes: function () {
		this.callParent(arguments);

		this.getToolbar().enable();

		// hide widgets
		this.getFieldsetHelp().show();
		this.getBtnEdit().hide();
		this.getBtnDelete().hide();
		this.getFieldsetBewilligung().hide();
		this.getFieldsetBewilligungsnehmer().hide();
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

		this.getFieldsetBewilligung().setDisabled(disabled);
		this.getFieldsetBewilligungsnehmer().setDisabled(disabled);
		this.getBtnSave().setDisabled(disabled);
		this.getBtnReset().setDisabled(disabled);
		this.getBtnCancel().setDisabled(disabled);

		this.scrollPanelToTop(this.getEditPanel());
	},

	// fill form fields from feature attributes
	readFeatureAttributes: function (feature) {
		// Bewilligung
		this.getIdField().setValue(feature.fid);
		this.updatePositionLable({feature: feature});
		this.getErstellerField().setValue(feature.attributes['ersteller']);

		// format: "2012-10-18T00:00:00Z"
		var dauervon = this.getValidDate(feature.attributes['dauervon']);
		if (dauervon === null) {
			dauervon = new Date();
		}
		this.getDauervonField().setValue(dauervon);

		var dauerbis = this.getValidDate(feature.attributes['dauerbis']);
		if (dauerbis === null) {
			dauerbis = new Date();
		}
		this.getDauerbisField().setValue(dauerbis);

		var bewilligt = feature.attributes['bewilligt'] === 1 ? 'true' : 'false';
		this.getBewilligtRadiogroup().setValue({bewilligt: bewilligt});

		this.getGrundField().setValue(feature.attributes['grund']);

		// Bewilligungsnehmer
		this.getVornameField().setValue(feature.attributes['vorname']);
		this.getNachnameField().setValue(feature.attributes['nachname']);
		this.getStrasseField().setValue(feature.attributes['strasse']);
		this.getPlzField().setValue(feature.attributes['plz']);
		this.getOrtField().setValue(feature.attributes['ort']);
		this.getTelefonField().setValue(feature.attributes['telefon']);
		this.getNatelField().setValue(feature.attributes['natel']);
	},

	// apply form attributes to feature
	writeFeatureAttributes: function (feature) {
		// Bewilligung
		var dauervon = null;
		if (this.getDauervonField().getValue() !== null) {
			// target format: "2012-10-18T00:00:00Z"
			dauervon = Ext.Date.format(this.getDauervonField().getValue(), 'Y-m-d\\Th:i:s\\Z');
		}
		feature.attributes['dauervon'] = dauervon;

		var dauerbis = null;
		if (this.getDauerbisField().getValue() !== null) {
			// target format: "2012-10-18T00:00:00Z"
			dauerbis = Ext.Date.format(this.getDauerbisField().getValue(), 'Y-m-d\\Th:i:s\\Z');
		}
		feature.attributes['dauerbis'] = dauerbis;

		feature.attributes['bewilligt'] = (this.getBewilligtRadiogroup().getValue()['bewilligt'] === 'true') ? 1 : 0;

		feature.attributes['grund'] = this.getGrundField().getValue();

		// Bewilligungsnehmer
		feature.attributes['vorname'] = this.getVornameField().getValue();
		feature.attributes['nachname'] = this.getNachnameField().getValue();
		feature.attributes['strasse'] = this.getStrasseField().getValue();
		feature.attributes['plz'] = this.getPlzField().getValue();
		feature.attributes['ort'] = this.getOrtField().getValue();
		feature.attributes['telefon'] = this.getTelefonField().getValue();
		feature.attributes['natel'] = this.getNatelField().getValue();

		// remove protected attributes
	//	feature.attributes['ersteller2'] = feature.attributes['ersteller'];
		
		delete feature.attributes['geodb_oid'];
		delete feature.attributes['ersteller'];
	},

	onFeatureEditSuccess: function (result) {
		var msg = '';
		if (result === 'feature_saved') {
			msg = 'Point saved.';
		} else if (result === 'feature_deleted') {
			msg = 'Point deleted.';
		} else if (result === 'error') {
			msg = 'Problem: Point not successfully saved.';
		} else if (result === 'help_add') {
			msg = 'Select a new point to the map.';
		} else if (result === 'help_modify') {
			msg = 'Select a point to change it\'s position or values.';
		} else {
			msg = result;
		}
		Gb41.utils.GbTools.displayHelpMessage('forstfeuerhelp', msg);
	},
	
	
	onBtnEditClick: function () {
		this.callParent(arguments);
		this.getToolbar().disable();
	},

	onBtnSaveClick: function () {
		this.callParent(arguments);
		this.getToolbar().enable();
	}


});
