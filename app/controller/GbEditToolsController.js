/**
 * File: app/controller/GbEditToolsController.js
 *
 * Base class for edit panel controllers.
 * Create edit layer and common edit controls.
 */
Ext.define('Gb41.controller.GbEditToolsController', {
	extend: 'Ext.app.Controller',
	requires: [],

	map: null,
	clickTolerance: 5,
	featureEditUrl: null,
	saveStrategy: null,
	editLayer: null,
	/*
		featureEditControls contains
			- getFeatureControl
			- drawFeatureControl
			- selectFeatureControl
			- modifyFeatureControl
			- deleteFeatureControl
	 */
	featureEditControls: null,

	// flag to setup editing components
	initEditing: true,

	// edit layer config
	editLayerName: '',
	editLayerUrl: '',
	editLayerGeometryType: '',

	// identifier for managing OL controls
	editPanelName: 'GbEditToolsController',

	// last edit tool used
	lastTool: null,

	// current feature being edited
	feature: null,

	// original feature attributes, geom and state before editing
	originalFeatureInfo: null,

	
	// Texts
	txtBasicHelpMessage: 'Add or select a feature.',


	constructor : function (config) {
		// merge default refs
		var refs = [
			{
				ref: 'mapPanel',
				selector: '#gbZhMapPanel'
			}
		];
		this.refs = this.refs ? Ext.Array.merge(this.refs, refs) : refs;

		this.callParent(arguments);
	},

	onLaunch: function () {
		// get map from panel
		if (this.getMapPanel() !== null) {
			this.map = this.getMapPanel().map;
		}
	},

	/*
	 * Manage edit layer and controls
	 */

	addEditLayer: function (name, url) {
		var i, len;
		this.featureEditUrl = url;

		this.saveStrategy = new OpenLayers.Strategy.Save();
		this.saveStrategy.events.on({
			'success': function (e) {
				// redraw layers
				for (i = 0, len = this.map.layers.length; i < len; i += 1) {
					this.map.layers[i].redraw(true);
				}

				var feature = e.response.reqFeatures[0];
				if (feature.geometry !== null) {
					// reselect feature if not deleted
					this.editLayer.removeAllFeatures();
					GbZh.base.ViewerState.fireEvent('activateolcontrols', this.editPanelName, 'select');
					this.onGetFeatureSelected({feature: feature});
					GbZh.base.ViewerState.fireEvent('featureeditsuccess', 'feature_saved');
				} else {
					GbZh.base.ViewerState.fireEvent('featureeditsuccess', 'feature_deleted');
				}
			},
			'fail': function () {
				// TODO: recreate the deleted feature
				GbZh.base.ViewerState.fireEvent('featureeditsuccess', 'error');

				Ext.Msg.show({
					title: "Save Feature",
					msg: "Save failed",
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.ERROR
				});

				// close form
				this.hideFeatureAttributes();
			},
			scope: this
		});

		this.editLayer = new OpenLayers.Layer.Vector(
			name,
			{
				strategies: [
					this.saveStrategy
				],
				protocol: new OpenLayers.Protocol.HTTP({
					url: url,
					headers: {
						'CONTENT-TYPE': "application/json; charset=UTF-8"
					},
					format: new OpenLayers.Format.GeoJSON()
				}),
				projection: new OpenLayers.Projection("EPSG:21781"),
				eventListeners: {
					beforefeatureadded: function (e) {
						var feature = e.feature;
						if (feature.fid === null) {
							// new feature drawn by the user, as opposed
							// to received from the web service
							this.onBeforeFeatureAdded(e);
						}
					},
					beforefeatureselected: this.onBeforeFeatureSelected,
					featureunselected: this.onFeatureUnselected,
					scope: this
				},
				// custom attribute to mark as edit layer
				isEditLayer: true
			}
		);
		this.map.addLayer(this.editLayer);
	},

	removeEditLayer: function () {
		// remove edit layer
		if (this.editLayer !== null) {
			this.map.removeLayer(this.editLayer);
			this.editLayer = null;
			this.saveStrategy = null;
			this.featureEditUrl = null;
		}
	},

	createEditFeatureControls: function (geomType) {
		var geojsonProtocol = new OpenLayers.Protocol.HTTP({
			url: this.featureEditUrl,
			headers: {
				'CONTENT-TYPE': "application/json; charset=UTF-8"
			},
			format: new OpenLayers.Format.GeoJSON()
		});

		// load feature on click
		var getFeatureControl = new OpenLayers.Control.GetFeature({
			clickTolerance: this.clickTolerance,
			protocol: geojsonProtocol,
			eventListeners: {
				featureselected: this.onGetFeatureSelected,
				scope: this
			}
		});

		// delete feature on click
		var deleteFeatureControl = new OpenLayers.Control.GetFeature({
			clickTolerance: this.clickTolerance,
			protocol: geojsonProtocol,
			eventListeners: {
				featureselected: this.onDeleteFeatureSelected,
				scope: this
			}
		});

		// NOTE: no multigeometries supported for editing
		var geomHandlers = {
			Point: [OpenLayers.Handler.Point, false],
			Linestring: [OpenLayers.Handler.Path, false],
			Polygon: [OpenLayers.Handler.Polygon, false],
			MultiPoint: [OpenLayers.Handler.Point, true],
			MultiLinestring: [OpenLayers.Handler.Path, true],
			MultiPolygon: [OpenLayers.Handler.Polygon, true]
		};
		var drawFeatureControl = new OpenLayers.Control.DrawFeature(this.editLayer, geomHandlers[geomType][0], {multi: geomHandlers[geomType][1]});
		var selectFeatureControl = new OpenLayers.Control.SelectFeature(this.editLayer, {clickout: true});
		var modifyFeatureControl = new OpenLayers.Control.ModifyFeature(this.editLayer, {standalone: true});

		this.map.addControls([
			getFeatureControl,
			drawFeatureControl,
			selectFeatureControl,
			modifyFeatureControl,
			deleteFeatureControl
		]);

		this.featureEditControls = {
			getFeatureControl: getFeatureControl,
			drawFeatureControl: drawFeatureControl,
			selectFeatureControl: selectFeatureControl,
			modifyFeatureControl: modifyFeatureControl,
			deleteFeatureControl: deleteFeatureControl
		};
	},

	removeEditFeatureControls: function () {
		var key;
		if (this.featureEditControls !== null) {
			for (key in this.featureEditControls) {
				if (this.featureEditControls.hasOwnProperty(key)) {
					this.map.removeControl(this.featureEditControls[key]);
				}
			}
			this.featureEditControls = null;
		}
	},

	/*
	 * Basic edit functionality
	 *
	 * Setup listeners in subclass
	 */

	onBtnAddToggle: function (button, pressed) {
		if (pressed) {
		// close form
			this.lastTool = null;
			this.hideFeatureAttributes();
			this.lastTool = button;
			GbZh.base.ViewerState.fireEvent('activateolcontrols', this.editPanelName, 'draw');
		}
	},

	onBtnSelectToggle: function (button, pressed) {
		if (pressed) {
			this.lastTool = button;
			GbZh.base.ViewerState.fireEvent('activateolcontrols', this.editPanelName, 'select');
		}
	},

/*	onBtnDeleteToggle: function (button, pressed) {
		if (pressed) {
			this.lastTool = button;
			GbZh.base.ViewerState.fireEvent('activateolcontrols', this.editPanelName, 'delete');
		}
	},

*/	onBtnDeleteClick: function () {

// select and show feature
//		this.editLayer.addFeatures([this.feature]);
//		this.featureEditControls.selectFeatureControl.select(this.feature);

		Ext.Msg.show({
			title: "Objekt löschen?",
			msg: "Sind Sie sicher, dass Sie dieses Objekt löschen möchten?",
			buttons: Ext.Msg.YESNO,
			icon: Ext.MessageBox.QUESTION,
			fn: function (button) {
				if (button === "yes") {
					this.feature.state = OpenLayers.State.DELETE;
					if (this.feature.fid === null) {
						// new feature unknown to the server
	//					this.editLayer.destroyFeatures([this.feature]);
					} else {
						// existing feature
						this.saveStrategy.save([this.feature]);
						this.hideFeatureAttributes();
					}
				}

			},
			scope: this
		});


	},

	onBtnEditClick: function () {
		// activate modify feature
		GbZh.base.ViewerState.fireEvent('activateolcontrols', this.editPanelName, 'modify');
		this.featureEditControls.modifyFeatureControl.selectFeature(this.feature);

		this.setFeatureFormDisabled(false);
	},

	onBtnSaveClick: function () {
		// apply form attributes to feature
		this.writeFeatureAttributes(this.feature);

		// save feature
		if (this.feature.fid === null) {
			// new feature
			this.feature.state = OpenLayers.State.INSERT;
		} else {
			// existing feature
			this.feature.state = OpenLayers.State.UPDATE;
		}
		this.saveStrategy.save([this.feature]);
	},

	onBtnResetClick: function () {
		// reset feature
		this.editLayer.drawFeature(this.feature, {display: "none"});
		this.feature.geometry = this.originalFeatureInfo.geometry;
		this.feature.attributes = this.originalFeatureInfo.attributes;
		this.feature.state = this.originalFeatureInfo.state;
		this.editLayer.drawFeature(this.feature);

		this.showFeatureAttributes(this.feature);
	},

	onBtnCancelClick: function () {
		// close form
		this.hideFeatureAttributes();
		Gb41.utils.GbTools.displayHelpMessage('forstfeuerhelp', this.txtBasicHelpMessage);

	},

	// initialize editing tools on first use
	onEditPanelActivate: function () {
		if (this.initEditing) {
			// create edit layer and controls
			this.addEditLayer(this.editLayerName, this.editLayerUrl);
			this.createEditFeatureControls(this.editLayerGeometryType);

			// register controls
			GbZh.base.ViewerState.fireEvent('registerolcontrols', this.editPanelName, 'select', [this.featureEditControls.getFeatureControl, this.featureEditControls.selectFeatureControl]);
			GbZh.base.ViewerState.fireEvent('registerolcontrols', this.editPanelName, 'draw', [this.featureEditControls.drawFeatureControl, this.featureEditControls.selectFeatureControl]);
			GbZh.base.ViewerState.fireEvent('registerolcontrols', this.editPanelName, 'modify', [this.featureEditControls.modifyFeatureControl]);
			GbZh.base.ViewerState.fireEvent('registerolcontrols', this.editPanelName, 'delete', [this.featureEditControls.deleteFeatureControl, this.featureEditControls.selectFeatureControl]);

			// default tool
			this.lastTool = this.defaultEditToolButton();

			this.initEditing = false;
		}

		this.hideFeatureAttributes();
	},

	onEditPanelDeactivate: function () {
		// deactivate controls
		GbZh.base.ViewerState.fireEvent('activateolcontrols', this.editPanelName, 'none');

		// reset editing
		this.feature = null;
		this.originalFeatureInfo = null;

		this.editLayer.removeAllFeatures();
	},

	// destroy editing tools on panel close
	onEditPanelDestroy: function () {
		if (!this.initEditing) {
			GbZh.base.ViewerState.fireEvent('unregisterolcontrols', this.editPanelName, 'select');
			GbZh.base.ViewerState.fireEvent('unregisterolcontrols', this.editPanelName, 'draw');
			GbZh.base.ViewerState.fireEvent('unregisterolcontrols', this.editPanelName, 'modify');

			this.removeEditFeatureControls();
			this.removeEditLayer();

			this.initEditing = true;
		}
	},

	// show feature edit form and fill with feature attribute values
	showFeatureAttributes: function (feature) {
		this.feature = feature;

		// store the initial state of the feature
		this.originalFeatureInfo = {
			geometry: this.feature.geometry.clone(),
			attributes: Ext.apply({}, this.feature.attributes),
			state: this.feature.state
		};

		// disable forms if not a new feature
		this.setFeatureFormDisabled(this.feature.fid !== null);

		// fill form fields from feature attributes
		this.readFeatureAttributes(feature);
	},

	// hide feature edit form
	hideFeatureAttributes: function () {
		// reset editing
		this.feature = null;
		this.originalFeatureInfo = null;

		this.editLayer.removeAllFeatures();

		// activate last tool
		if (this.lastTool !== null) {
			this.lastTool.toggle(false);
			this.lastTool.toggle(true);
		}
	},

	// scroll body of panel to top position
	scrollPanelToTop: function (panel) {
		panel.getEl().select('div.x-panel-body').elements[0].scrollTop = 0;
	},

	onBeforeFeatureAdded: function (e) {
		// select new feature
		this.featureEditControls.selectFeatureControl.select(e.feature);
	},

	onBeforeFeatureSelected: function (e) {
		if (e.feature.fid === null) {
			// activate modify for new feature
			GbZh.base.ViewerState.fireEvent('activateolcontrols', this.editPanelName, 'modify');
			this.featureEditControls.modifyFeatureControl.selectFeature(e.feature);
		}

		this.showFeatureAttributes(e.feature);
	},

	onGetFeatureSelected: function (e) {
		// select existing feature
		this.editLayer.addFeatures([e.feature]);
		this.featureEditControls.selectFeatureControl.select(e.feature);
	},

	onDeleteFeatureSelected: function (e) {
		// select and show feature
		this.editLayer.addFeatures([e.feature]);
		this.featureEditControls.selectFeatureControl.select(e.feature);

		Ext.Msg.show({
			title: "Objekt löschen?",
			msg: "Sind Sie sicher, dass Sie dieses Objekt löschen möchten?",
			buttons: Ext.Msg.YESNO,
			icon: Ext.MessageBox.QUESTION,
			fn: function (button) {
				if (button === "yes") {
					e.feature.state = OpenLayers.State.DELETE;
					if (e.feature.fid === null) {
						// new feature unknown to the server
						this.editLayer.destroyFeatures([e.feature]);
					} else {
						// existing feature
						this.saveStrategy.save([e.feature]);
					}
				}

				this.hideFeatureAttributes();
			},
			scope: this
		});
	},

	onFeatureUnselected: function (e) {
		this.hideFeatureAttributes();
	},

	/*
	 * Implement in subclass
	 */

	// return default tool button
	defaultEditToolButton: function () {
		throw Ext.getClassName(this) + "::defaultEditToolButton not implemented.";
	},

	// disable edit form until edit mode activated
	setFeatureFormDisabled: function (disabled) {
		throw Ext.getClassName(this) + "::setFeatureFormDisabled not implemented.";
	},

	// fill form fields from feature attributes
	readFeatureAttributes: function (feature) {
		throw Ext.getClassName(this) + "::readFeatureAttributes not implemented.";
	},

	// apply form attributes to feature
	writeFeatureAttributes: function (feature) {
		throw Ext.getClassName(this) + "::writeFeatureAttributes not implemented.";
	},

	getValidDate: function (s) {
		var d = null;
		if (Ext.isString(s)) {
			d = new Date(s);
			if (isNaN(d.getTime())) {
				d = null;
			}
		}
		return d;
	},

	getDateString: function (v) {
		var s = null;
		s = Ext.Date.format(v, 'Y-m-d\\TH:i:s\\Z');
		if (Ext.isEmpty(s)) {
			s = null;
		}
		return s;
	}
});
