/**
 * File: app/controller/MapController.js
 *
 * This file should instantiate a GbMapPanel and load an empty openlayers map 
 * or an overview picture (static imagelayer) of the provided area.
 */
Ext.define('Gb41.controller.GbMapController', {
	extend: 'Ext.app.Controller',

	requires: [
	//   'GeoExt.panel.Map',
		'GeoExt.data.MapfishPrintProvider',
		'GeoExt.plugins.PrintExtent',
		'Gb41.utils.GbTools'
	],

	views: ['GbMapTabPanel', 'GbMapPanel'],

	refs: [{
		ref: 'myGbMapTabPanel',
		selector: 'viewport > gbmaptabpanel'
	}, {
		ref: 'myMapPanel',
		selector: '#gbZhMapPanel'
//		selector: 'viewport > gbmaptabpanel > gbmappanel'
	}, {
		ref: 'myBtnDefaultNavigation',
		selector: '#btnDefaultNavigation'
	}, {
		ref: 'myBtnDistance',
		selector: '#BtnDistance'
	}, {
		ref: 'myBtnArea',
		selector: '#BtnArea'
	}, {
		ref: 'myBtnEdit',
		selector: '#btnEditPanel'
	}, {
		ref: 'myBtnExport',
		selector: '#btnExport'
	}, {
		ref: 'myLblDistanceArea',
		selector: 'viewport > gbmaptabpanel > gbmappanel > toolbar > #lblDistanceArea'
	}
		],

	map: null,

	toggleControls: {},

	selectionLayer: null,
	markerLayer: null,

	navHistory: null,
	lineMeasure: null,
	areaMeasure: null,

	// **** Texte ****
	/**
	 * @cfg {String} txtDistance
	 * Text for distance measurements.
	 */
	//<locale>
	txtDistance: 'Distance',
	//</locale>

	/**
	 * @cfg {String} txtArea
	 * Text button area measurements.
	 */
	//<locale>
	txtArea: 'Area',
	//</locale>

	init: function () {
		var me = this;
		this.control({
			'#btnPrev': {
				click: this.onBtnPrev
			},
			'#btnNext': {
				click: this.onBtnNext
			},
			'#btnDefaultNavigation': {
				click: this.onBtnDefaultNavigation
			},
			'#btnDistance': {
				click: this.onBtnDistance
			},
			'#btnArea': {
				click: this.onBtnArea
			},
			'#btnRedlining': {
				click: this.onBtnRedlining,
				toggle: this.onToggleBtnRedlining
			},
			'#btnExport': {
				click: this.onBtnExport
			},
			'#btnEditPanel': {
				click: this.onBtnEdit
			},
			'#btnLink': {
				click: this.onBtnLink
			},
			'#btnPrint': {
				click: this.onBtnPrint
			}
//INFO: afterlayeradd-Event des GeoExt2-MapPanels fehlt Eventobjekt. Darum onAddLayer direkt an map gehängt.
//			'#gbZhMapPanel': {
//				afterlayeradd: this.onAddLayer
//				afterlayerremove: this.onRemoveLayer
//			},
		});

		GbZh.base.ViewerState.on({
			topicready: {
				fn: this.onTopicReady,
				scope: this
			},
			topicvisibilitychanged: {
				fn: this.onTopicVisibilityChanged,
				scope: this
			},
			wmslayersvisibilitychanged: {
				fn: this.onWmsLayersVisibilityChanged,
				scope: this
			},
			identifyclicked: {
				fn: this.onIdentifyClicked,
				scope: this
			},
			showfeatures: {
				fn: this.onShowFeatures,
				scope: this
			},
			printactivate: {
				fn: this.onPrintActivate,
				scope: this
			},
			printdeactivate: {
				fn: this.onPrintDeActivate,
				scope: this
			},
			removerlays: {
				fn: this.onRemOverlays,
				scope: this
			},
			doremovelayer: {
				fn: this.onDoRemoveLayer,
				scope: this
			},
			modeactivate: {
				fn: this.onModeActivate,
				scope: this
			},
			searchresultselected: {
				fn: this.onSearchResultselected,
				scope: this
			}

		});
	},

	onSearchResultselected: function (markerImg, posX, posY, mapScale) {
        Gb41.utils.GbTools.drawCircle(posX, posY, 15, 'Suchresultat', null, 'Point');
		this.map.setCenter(
            OpenLayers.LonLat.fromArray([posX, posY])
        );

		if (this.map.getScale() > mapScale) {
			this.map.zoomToScale(mapScale);
		}
	},

	onLaunch: function () {

//		var void_layer = new OpenLayers.Layer.Image('void', './lib/openlayers/img/blank.gif',
		var void_layer = new OpenLayers.Layer.Image('void', '/img/blank.gif',
			new OpenLayers.Bounds(660000, 220000, 725000, 285000),
			new OpenLayers.Size(640, 412), {
				displayInLayerSwitcher: true,
				visibility: false,
				projection: new OpenLayers.Projection("EPSG:21781"),
				units: 'm',
				maxExtent: new OpenLayers.Bounds(660000, 220000, 725000, 285000),
				isBaseLayer: true,
				gbLayerLevel: 'base',
				gbPersistOverlay: true
			});

		var imgLayer = new OpenLayers.Layer.Image('KtGde', './data/ktgde.gif',
			new OpenLayers.Bounds(635877, 220000, 749123, 285000),
			new OpenLayers.Size(1629, 935), {
				isBaseLayer: false,
				projection: new OpenLayers.Projection("EPSG:21781"),
				units: 'm',
				displayOutsideMaxExtent: true,
				allwaysInRange: true,
				transparent: true
			});


		// The printProvider that connects us to the print service
		var printProvider = Ext.create('GeoExt.data.MapfishPrintProvider', {
			method: "POST", // "POST" recommended for production use
			//capabilities: printCapabilities, // from the info.json script in the html
			autoLoad: true,
			url: '/print',
			customParams: {
				mapTitle: "Printing Demo",
				comment: "This is a map printed from GeoExt."
			}
		});
		// printProvider.capabilities.printURL = "http://web.maps.zh.ch/print/create.json";
		// printProvider.capabilities.createURL = "http://web.maps.zh.ch/print/create.json";
		// ********* workaround for local print config ******
		if (window.location.host === 'localhost' || window.location.host === '127.0.0.1') {
			Ext.applyIf(printProvider, {capabilities: printCapabilities});
		}

		var navControl = new OpenLayers.Control.Navigation({
			dragPanOptions: {
				enableKinetic: true
			},
			mouseWheelOptions: {
//TODO: ist das ein sinnvolles Intervall?
				interval: 100
			}
		});


		this.map = new OpenLayers.Map('map', {
			controls: [navControl, new OpenLayers.Control.Zoom3()]

			//				maxExtent:  new OpenLayers.Bounds.fromArray([420000,30000,900000,350000]),
			//				restrictedExtent:  new OpenLayers.Bounds.fromArray([470000,70000,840000,300000]),
			//				resolutions: [100,50,20,10,5,2.5,2,1.5,1,0.5,0.25,0.1,0.05],
			// allOverlays: true

		});
		//map.addLayers([void_layer, imgLayer]);
		this.map.addLayers([void_layer]);
		//this.map.addControl(new OpenLayers.Control.LayerSwitcher());
		this.map.addControl(new OpenLayers.Control.ScaleLine({topInUnits: 'm'}));
		this.map.fractionalZoom = true;

/*		this.map.addControl(new OpenLayers.Control.FeatureQuery({
			protocol: new OpenLayers.Protocol.HTTP({
				format: new OpenLayers.Format.Raw()
			}),
			url: '/topics/query',
			//					viewerState: GbZh.base.ViewerState,
			autoActivate: true,
			toggle: true,
			clickTolerance: 0,
			outputNode: '#info-body'
		}));

*/		// NavigationHistory
		this.navHistory = new OpenLayers.Control.NavigationHistory();

		var sketchSymbolizers = {
			"Point": {
				pointRadius: 5,
				graphicName: "circle",
				fillColor: "red",
				fillOpacity: 0.1,
				strokeWidth: 1,
				strokeOpacity: 1,
				strokeColor: "#FF0000"
			},
			"Line": {
				strokeWidth: 2,
				strokeOpacity: 1,
				strokeColor: "#FF0000",
				strokeDashstyle: "dash"
			},
			"Polygon": {
				strokeWidth: 2,
				strokeOpacity: 1,
				strokeColor: "#FF0000",
				fillColor: "yellow",
				fillOpacity: 0.3
			}
		};

		var style = new OpenLayers.Style();
		style.addRules([
			new OpenLayers.Rule({
				symbolizer: sketchSymbolizers
			})]);
		var styleMap = new OpenLayers.StyleMap({
			"default": style
		});

		var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
		renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;


		this.toggleControls = {
			featureQuery: new OpenLayers.Control.FeatureQuery({
				protocol: new OpenLayers.Protocol.HTTP({
					format: new OpenLayers.Format.Raw()
				}),
				url: '/topics/query',
				autoActivate: true,
				toggle: true,
				clickTolerance: 0,
				outputNode: '#info-body'
			}),

			lineMeasure: new OpenLayers.Control.Measure(
				OpenLayers.Handler.Path,
				{
					persist: true,
					immediate: true,
					handlerOptions: {
						layerOptions: {
							renderers: renderer,
							styleMap: styleMap
						}
					}
				}
			),

			areaMeasure: new OpenLayers.Control.Measure(
				OpenLayers.Handler.Polygon,
				{
					persist: true,
					handlerOptions: {
						layerOptions: {
							renderers: renderer,
							styleMap: styleMap
						}
					}
				}
			)

/*			point: new OpenLayers.Control.DrawFeature(vectors,
				OpenLayers.Handler.Point),
			line: new OpenLayers.Control.DrawFeature(vectors,
				OpenLayers.Handler.Path),
			polygon: new OpenLayers.Control.DrawFeature(vectors,
				OpenLayers.Handler.Polygon),
			regular: new OpenLayers.Control.DrawFeature(vectors,
				OpenLayers.Handler.RegularPolygon,
				{handlerOptions: {sides: 5}}),
			modify: new OpenLayers.Control.ModifyFeature(vectors)
*/
		};

		var key;
		for (key in this.toggleControls) {
			this.map.addControl(this.toggleControls[key]);
			GbZh.base.ViewerState.fireEvent('registerolcontrols', 'GbMapController', key, [this.toggleControls[key]]);
		}


/*		for(var key in this.toggleButtons) {
			this.map.addControl(this.toggleControls[key]);
		}
*/

		this.toggleControls.lineMeasure.events.on({
			"measure": this.handleMeasurements,
			"measurepartial": this.handleMeasurements,
			scope: this
		});


		this.toggleControls.areaMeasure.events.on({
			"measure": this.handleMeasurements,
			"measurepartial": this.handleMeasurements,
			scope: this
		});

		this.map.addControl(this.navHistory);
//		this.map.addControl(this.lineMeasure);
//		this.map.addControl(this.areaMeasure);

//		this.map.zoomToMaxExtent();

		this.map.events.on({
			'addlayer': this.onAddLayer,
			'removelayer': this.onRemoveLayer,
			'zoomend': this.onZoomEnd,
			scope: this
		});

		var printExtent = Ext.create('GeoExt.plugins.PrintExtent', {
			printProvider: printProvider
		});

		var mappanel = Ext.create('Gb41.view.GbMapPanel', {
			title: 'GIS-ZH',
			map: this.map,
			itemId: 'gbZhMapPanel',
			plugins: [
				printExtent
			],
			center: '692500,252500'

		});

                // apply request state
		if (GbZh.base.ViewerState.requestState.mapPos) {
			this.map.setCenter(GbZh.base.ViewerState.requestState.mapPos);
		}
		if (GbZh.base.ViewerState.requestState.scaleDenominator) {
			this.map.zoomToScale(GbZh.base.ViewerState.requestState.scaleDenominator, false);
		} else {
			this.map.zoomToMaxExtent();
		}

        GbZh.base.ViewerState.on('topicready', function () {
            if (GbZh.base.ViewerState.requestState.selection !== null) {
                this.showSelection(GbZh.base.ViewerState.requestState.selection);
            }
        }, this);

		// printExtent.addPage();
		// printExtent.hide();

		var tab = this.getMyGbMapTabPanel();

		tab.add(mappanel);
		tab.setActiveTab(mappanel);

		//LOG console.log('MapController launch');

		// start topicstore
		GbZh.base.ViewerState.fireEvent('userchanged', {
			user: {
				login: GbZh.base.ViewerState.requestState.user
			}
		});
	},

	toggleControl: function (toggleControlKey) {
		GbZh.base.ViewerState.fireEvent('activateolcontrols', 'GbMapController', toggleControlKey);

//		this.getMyLblDistanceArea().setVisible(
//			toggleControlKey === 'lineMeasure' || toggleControlKey === 'areaMeasure'
//		);
//		this.getMyLblDistanceArea().update('');
	},

	onTopicReady: function (topicName, topicTitle, level, persistOverlay) {
		var topicStore = this.getStore('Topics');
		var oldFilter = topicStore.filters.clone();
		topicStore.clearFilter(true);
		var ix = topicStore.findExact('name', topicName);
		var rec = topicStore.getAt(ix);
		topicStore.filters = oldFilter;
		topicStore.filter();

		var layer = this.buildLayer(rec, level, persistOverlay);

		//LOG console.log(topicName + " " + level + " " + ix);

		this.onDoRemoveLayer(topicName, level, persistOverlay);
		this.getMyMapPanel().map.addLayer(layer);
		if (level === 'main') {
			this.updateToolbar(rec);
			this.getMyMapPanel().setTitle(topicTitle);
		}
	},

	updateToolbar: function (record) {
		if (Ext.Array.indexOf(record.get('tools'), 'EditTool') >= 0) {
			this.getMyBtnEdit().show();
		} else {
			this.getMyBtnEdit().hide();
		}
		if (Ext.Array.indexOf(record.get('tools'), 'ExportTool') >= 0) {
			this.getMyBtnExport().show();
		} else {
			this.getMyBtnExport().hide();
		}
	},

	onRemOverlays: function () {
		var i,
			len,
			nonPersistentOverlayLayers = this.getNonPersistentOverlayLayers();
		for (i = 0, len = nonPersistentOverlayLayers.length; i < len; i += 1) {
			this.onDoRemoveLayer(nonPersistentOverlayLayers[i], 'over', false);
		}
	},

	getNonPersistentOverlayLayers: function () {
		var i,
			nonPersistentOverlayLayers = [],
			map = this.getMyMapPanel().map,
			layers = map.layers;
		for (i = 0; i < layers.length; i += 1) {
			if (layers[i].gbLayerLevel === 'over') {
				if (!layers[i].gbPersistOverlay) {
					nonPersistentOverlayLayers.push(layers[i].name);
				}
			}
		}
		return nonPersistentOverlayLayers;
	},

	onDoRemoveLayer: function (topicName, level, persistOverlay) {
		var i,
			map = this.getMyMapPanel().map,
			layers = map.layers;
		//LOG console.log(arguments);
		//LOG console.log(layers);
		for (i = 0; i < layers.length; i += 1) {
			//LOG console.log(i + " " + layers[i].gbLayerLevel);
			if (level === 'tool' || level === 'over') {
                                // do not remove edit layers
				if (topicName === layers[i].name && layers[i].isEditLayer != true) {
					map.removeLayer(layers[i], false);
					GbZh.base.ViewerState.fireEvent('removetocnode', topicName, level);
					return;
				}
			} else if (layers[i].gbLayerLevel === level.toLowerCase()) {
				map.removeLayer(layers[i], false);
				GbZh.base.ViewerState.fireEvent('removetocnode', topicName, level);
				return;
			}
		}
	},

	onTopicVisibilityChanged: function (topic, visible) {
		var map = this.getMyMapPanel().map,
			layers = map.getLayersByName(topic);
		layers[0].setVisibility(visible);
	},

	onWmsLayersVisibilityChanged: function (topic) {
		var map = this.getMyMapPanel().map,
			layers = map.getLayersByName(topic),
			wmsLayerController,
			wmsLayersList;
		if (layers.length > 0) {
			wmsLayerController = this.getController('GbWmsLayerController');
			wmsLayersList = wmsLayerController.getLayerList(topic, false);
			if (wmsLayersList.length > 0) {
				layers[0].mergeNewParams({
					layers: wmsLayersList
				});
				if (!layers[0].visibility) {
					GbZh.base.ViewerState.fireEvent('topicvisibilitychanged', topic, true);
				}
			} else {
				GbZh.base.ViewerState.fireEvent('topicvisibilitychanged', topic, false);
				// früher				layers[0].setVisibility(wmsLayersList !== "");
			}
		}
	},

	buildLayer: function (rec, topicLevel, persistOverlay) {
		if (!rec) {
			var i = 0;
		}
		var olLayer,
			olClass = rec.get('ollayer_class');
		//TODO: im Moment fix als wms (solange nicht in DB)
		if (!olClass) {
			olClass = 'WMS';
		}

		if (olClass === 'WMS') {
			olLayer = this.buildWmsLayer(rec, topicLevel, persistOverlay);
		} else if (olClass === 'WMTS') {
			olLayer = this.buildWmtsLayer(rec, topicLevel, persistOverlay);
		}
		return olLayer;
	},

	buildWmsLayer: function (rec, topicLevel, persistOverlay) {
		var wmsLayerController = this.getController('GbWmsLayerController');
		var topic = rec.get('name');
		var wmsLayerParams = rec.get('wms_layer_params') || {};

		Ext.applyIf(wmsLayerParams, {
			"layers": wmsLayerController.getLayerList(topic, true)
		});

		var defaultWmsLayerParams = {
			//			version: '1.3.0',
			version: '1.1.1',
			dpi: OpenLayers.DOTS_PER_INCH,
			transparent: true,
			format: 'image/png; mode=8bit'
		};
		Ext.applyIf(wmsLayerParams, defaultWmsLayerParams);

		var olLayerOptions = rec.get('wms_layer_options') || {};
		Ext.apply(olLayerOptions, {
			layername: topic
		});
		Ext.apply(olLayerOptions, {
			gbLayerLevel: topicLevel
		});
		Ext.apply(olLayerOptions, {
			gbPersistOverlay: persistOverlay
		});

		var opacity = 1;
		if (topicLevel === 'over') {
			opacity = 1.0;
		}
		var defaultOlLayerOptions = {
			displayInLayerSwitcher: true,
			visibility: true,
			projection: new OpenLayers.Projection("EPSG:21781"),
			//TODO aus Mapfile?
			maxExtent: new OpenLayers.Bounds(660000, 220000, 725000, 285000),
			units: 'm',
			isBaseLayer: false,
			opacity: opacity,
			singleTile: true,
			ratio: 1.0,
			transitionEffect: 'resize'
		};
		Ext.applyIf(olLayerOptions, defaultOlLayerOptions);

		var wms = new OpenLayers.Layer.WMS(
			rec.get('name'),
			rec.get('wms_url'),
			wmsLayerParams,
			olLayerOptions
		);

		/*
		wms.events.on({
			loadstarted: GbZh.base.ViewerState.fireEvent('loadstarted'),
			loadend: GbZh.base.ViewerState.fireEvent('loadend'),
			scope: this
		});
		*/
		return wms;
	},

	buildWmtsLayer: function (rec, topicLevel, persistOverlay) {

		var wmtsConfig = rec.get('wms_layer_params') || {};
		var defaultOlLayerOptions = {
			displayInLayerSwitcher: true,
			visibility: true,
			projection: new OpenLayers.Projection("EPSG:21781"),
			//TODO aus Mapfile?
			maxExtent: new OpenLayers.Bounds(660000, 220000, 725000, 285000),
			units: 'm',
			isBaseLayer: false,
			opacity: 1,
			//		singleTile: true,
			ratio: 1.0,
			transitionEffect: 'resize'
		};
		Ext.applyIf(wmtsConfig, defaultOlLayerOptions);
		Ext.apply(wmtsConfig, {
			"gbLayerLevel": topicLevel
		});
		Ext.apply(wmtsConfig, {
			"gbPersistOverlay": persistOverlay
		});

		var wmts = new OpenLayers.Layer.WMTS(wmtsConfig);
		return wmts;
	},

	handleMeasurements: function (event) {
		GbZh.base.ViewerState.fireEvent('updatemeasure', event);
/*
		var geometry = event.geometry;
		var valText;
		if (event.order === 1) { // Längen
			// if (units === 'xm') {
			// measure = measure / Math.pow(1000.0, order);
			// units = 'km';
			// }
			valText = this.txtDistance + ": " + event.measure.toFixed(3) + " " + event.units;
		} else { // Flächen
			valText = this.txtArea + ": " + event.measure.toFixed(3) + " " + event.units + "<sup>2</" + "sup>";
		}
		this.getMyLblDistanceArea().update(valText);
*/
	},

	onIdentifyClicked: function (posX, posY) {
		this.showMarker(GbZh.base.ViewerState.INFOMARKER, posX, posY);
	},

	showMarker: function (markerImg, posX, posY) {
		var i;
		var markerLayers = this.map.getLayersByName('Markers');
		if (markerLayers.length === 0) {
			this.markerLayer = new OpenLayers.Layer.Markers('Markers');
			this.markerLayer.addOptions({
				'gbLayerLevel': 'tool',
				'topic': 'marker',
				'gbLayerTitle': 'Markierung'
			}, false);
			this.map.addLayer(this.markerLayer);
		} else {
			this.markerLayer = markerLayers[0];
			//			this.map.setLayerIndex(this.markerLayer, this.map.getNumLayers());
			// remove existing markers
			for (i = this.markerLayer.markers.length - 1; i >= 0; i--) {
				this.markerLayer.removeMarker(this.markerLayer.markers[i]);
			}
		}

		// add marker
		var size = new OpenLayers.Size(40, 40);
		var offset = new OpenLayers.Pixel(-(size.w / 2), -(size.h / 2));
		var icon = new OpenLayers.Icon(markerImg, size, offset);
		this.markerLayer.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(posX, posY), icon));
	},

	onShowFeatures: function (topic, layer, property, values, minx, miny, maxx, maxy, maxZoom) {
		//TODO Versuch, einen vernünftigen Zoom zu erhalten. Verbesserungsfähig.
//		var mind = 250;

		minx = parseFloat(minx);
		miny = parseFloat(miny);
		maxx = parseFloat(maxx);
		maxy = parseFloat(maxy);
		var isPoint = (maxx - minx) < 10 && (maxy - miny) < 10;
/*
		if (maxx - minx < (2.0 * mind)) {
			var meanx = (maxx + minx) / 2.0;
			minx = meanx - mind;
			maxx = meanx + mind;
		}
		if (maxy - miny < (2.0 * mind)) {
			var meany = (maxy + miny) / 2.0;
			miny = meany - mind;
			maxy = meany + mind;
		}
*/
		// features bounds
		var bounds = new OpenLayers.Bounds(minx, miny, maxx, maxy);
		var map = this.getMyMapPanel().map;
		// zoom out a bit
		var zoom = map.getZoomForExtent(bounds, false) * 0.98;	// ein bisschen Luft um die Selektion

		// clamp to min scale
		if (zoom > maxZoom) {
			zoom = maxZoom;
		}

		// falls (bei Punkt) schon weiterreingezoomt ist: zoom nicht verändern<<<<<<<<<<<<<<<<<<
		var zoomNow = map.getZoom();
		if (zoom < zoomNow) {
			if (isPoint) {
				zoom = zoomNow;
			}
		}


		// zoom to features
		map.setCenter(bounds.getCenterLonLat(), zoom);

		// store selection params

		var currentState = GbZh.base.ViewerState.getCurrentState();
		var selection = currentState.selection;

		if (selection === null) {
			selection = {};
		}
		selection.seltopic = topic || GbZh.base.ViewerState.getActiveTopic();
		selection.sellayer = layer;
		selection.selproperty = property;
		selection.selvalues = values;

		GbZh.base.ViewerState.currentState.selection = selection;

		this.clearSelection();
        this.showSelection(selection);
    },

	showSelection: function (selection) {
		var selOlLayers = this.map.getLayersByName(selection.seltopic);
		var selectionParams;
		if (selOlLayers.length > 0) {
			selectionParams = {
				wms_url: selOlLayers[0].url,
				layerName: selection.sellayer,
				filterProperty: selection.selproperty,
				filterValues: selection.selvalues
				//				options: selOlLayers[0].options
			};
			//			selection.options.opacity = 0.6;
		}

		this.selectionLayer = this.buildSelectionLayer(selectionParams);
		// add selection layer to map if topic layer has been loaded
		if (this.map !== null && this.map.layers.length > 1) {
			this.map.addLayer(this.selectionLayer);

		/*
					// marker on top
					if (this.markerLayer !== null) {
						this.map.setLayerIndex(this.markerLayer, this.map.getNumLayers());
					}
		*/
		}
	},

	clearSelection: function () {
		if (this.selectionLayer !== null) {
			this.onDoRemoveLayer('Selection', 'tool', false);
			this.selectionLayer = null;
		}
		//		Ext.getCmp('seloffbtn').hide();
	},

	buildSelectionLayer: function (selection) {
		return new OpenLayers.Layer.WMS("Selection", selection.wms_url, {
			layers: selection.layerName,
			format: "image/gif",
			transparent: true,
			// custom params
			"selection[layer]": selection.layerName,
			"selection[property]": selection.filterProperty,
			"selection[values]": selection.filterValues.join(',')
		}, {
			displayInLayerSwitcher: true,
			visibility: true,
			projection: new OpenLayers.Projection("EPSG:21781"),
			//TODO aus Mapfile?
			maxExtent: new OpenLayers.Bounds(660000, 220000, 725000, 285000),
			units: 'm',
			isBaseLayer: false,
			opacity: 0.6,
			singleTile: true,
			ratio: 1.0,
			transitionEffect: 'resize',
			gbLayerLevel: 'tool',
			topic: 'Selection',
			gbLayerTitle: 'Selektion'
		});
	},

	onBtnPrev: function () {
		//TODO: back to last map extent. Insert code here!
		//		alert('TODO: go back to last map extent.');
		this.navHistory.previous.trigger();
	},

	onBtnNext: function () {
		//TODO: procede to next map extent. Insert code here!
		//		alert('procede to next map extent.');
		this.navHistory.next.trigger();
	},

	onBtnDefaultNavigation: function (b, e, o) {
		GbZh.base.ViewerState.fireEvent('infoshow', 'featureQuery');
		this.toggleControl('featureQuery');
		//TODO: switch mouse cursor to default behavior. Insert code here!
		b.doToggle();
//		alert('switch mouse cursor to default behavior.');
	},

	onBtnDistance: function () {
		GbZh.base.ViewerState.fireEvent('infoshow', 'lineMeasure');
		this.toggleControl('lineMeasure');
	},

	onBtnArea: function () {
		GbZh.base.ViewerState.fireEvent('infoshow', 'areaMeasure');
		this.toggleControl('areaMeasure');
	},

	onBtnRedlining: function (b, e, o) {
		//b.doToggle();
		GbZh.base.ViewerState.fireEvent('redliningshow');
	},

	onToggleBtnRedlining: function (b, pressed, c) {
/*
		if (pressed) {
			//this.areaMeasure.activate();
			//if (this.areaMeasure.setImmediate !== undefined) {
			//	this.areaMeasure.setImmediate(true);
			//}
		} else {
			//this.areaMeasure.deactivate();
		}
*/
	},

	onModeActivate: function (newMode, tool) {
		//LOG console.log("NEWmODE: " + newMode);
		var b = this.getMyBtnDefaultNavigation();
		if (!b.pressed) {
			if (newMode !== 'gbinfo') {
				b.toggle();
			} else {
				if (!this.getMyBtnDistance().pressed && !this.getMyBtnArea().pressed) {
					b.toggle();
				}
			}
		}
		switch (newMode) {
		case 'gbmapcontent':
			this.toggleControl('featureQuery');
			break;
		case 'gbinfo':
			this.toggleControl('featureQuery');
			break;
		case 'gbredlining':
			break;
		case 'gbprint':
			this.toggleControl('none');
//			this.onPrintActivate();
			break;
		case 'gbpermalink':
			this.toggleControl('none');
			break;
		case 'gbedit':
			this.toggleControl('none');
			break;
		default:
			//LOG console.log("neues Panel eigenartigerweise: " + newMode);
		}
	},

	onBtnExport: function (b, e, o) {
//		this.getMyLblDistanceArea().setVisible(false);
		b.doToggle();
		GbZh.base.ViewerState.fireEvent('exportactivate');
	},

	onBtnEdit: function (b, e, o) {
//		this.getMyLblDistanceArea().setVisible(false);
		b.doToggle();
		GbZh.base.ViewerState.fireEvent('editactivate');
	},

	onBtnLink: function (b, e, o) {
		//TODO: Vielleicht besser ViewerState-Event losschicken und Funktion im Permalink-Panel aufrufen
		var perma = (this.getController('GbMapContentController').permalink());
		b.doToggle();
		GbZh.base.ViewerState.fireEvent('permalinkactivate', perma);
	},

	onBtnPrint: function (b, e, o) {
		GbZh.base.ViewerState.fireEvent('printactivate');
		b.doToggle();
	},

	onZoomEnd: function (e) {
		var sd = this.map.getScale();
		if (GbZh.base.ViewerState.getActiveTopic()) {
			var topicStore = this.getStore('Topics');
			var oldFilter = topicStore.filters.clone();
			topicStore.clearFilter(true);
			var ix = topicStore.findExact('name', GbZh.base.ViewerState.getActiveTopic());
			var rec = topicStore.getAt(ix);
			var minscale = rec.get('minscale');
//TODO: ist das sicher, wenn wir auf kleiner prüfen? nach dem zoomToScale ist der neue
// Zoom-Wert nur ungefähr gleich minscale (Rundungsfehler). Könnte es einen ewigen
// Loop geben?
//TODO: bräuchte es eine Meldung, dass man nicht weiter reinzoomen darf? Wo?
			if (minscale && sd < 0.99 * minscale) {
				sd = minscale;
				this.map.zoomToScale(sd);

				var olAttrControl = this.map.getControlsByClass('OpenLayers.Control.Attribution')[0];
				var el = Ext.get(olAttrControl.div);
				var oldFontSize = el.getStyle('font-size');
				el.dom.innerHTML = 'Zoom-Maximum für diese Karte erreicht';
				el.setStyle('font-size', '18px');
				el.setStyle('bottom', '3px');
				el.setStyle('right', '3px');
				el.highlight("ffff00", { attr: 'backgroundColor', duration: 2000 });
				var resetAttribution = new Ext.util.DelayedTask(function () {
					Ext.get(olAttrControl.div).setStyle('font-size', oldFontSize);
				    olAttrControl.updateAttribution();
				});
				resetAttribution.delay(2000);
				topicStore.filters = oldFilter;
				topicStore.filter();
				return;
			} else {
				topicStore.filters = oldFilter;
				topicStore.filter();
			}
		}

		GbZh.base.ViewerState.setScaleDenominator(sd);
		GbZh.base.ViewerState.fireEvent('scalechanged', sd);
	},

	onPrintActivate: function () {
		var p = this.getMyMapPanel().plugins[0];
		if (p.pages.length === 0) {
			p.addPage();
		}
		p.page.setRotation(0);
		p.page.fit(p.map, {
			mode: 'screen'
		});
//		p.show();
	},

	onPrintDeActivate: function () {
		var p = this.getMyMapPanel().plugins[0];
		p.hide();
		// p.removePage(p.page);
		// p.page = null;
		//	p.map.removeLayer(layer, false);
	},

	onRemoveLayer: function (e) {
		GbZh.base.ViewerState.fireEvent('removelayer', e);
	},

	onAddLayer: function (e) {
		var i;
		GbZh.base.ViewerState.fireEvent('addlayer', e);

		if (this.map === undefined) {
			return;
		}
		var map = this.map;
		switch (e.layer.gbLayerLevel) {
		case 'Redlining':
			map.setLayerIndex(e.layer, this.getNumLayers());
			return;
		case 'main':
			map.setLayerIndex(e.layer, 1);
			return;
		case 'back':
			map.setLayerIndex(e.layer, 0);
			return;
		default:
		}

		var pos = 9999;
		var wnow = this.getWeight(e.layer.gbLayerLevel);

/*		console.log("gewicht: " + wnow + " ------------ " + e.layer.gbLayerLevel + " " + e.layer.name);

		for (var i = map.layers.length - 1; i >= 0; i--) {
			console.log(i + ": " + map.layers[i].gbLayerLevel + " " + this.getWeight(map.layers[i].gbLayerLevel) + " " + (map.layers[i].name));
		};
*/
		for (i = map.layers.length - 2; i >= 0; i--) {
			var wlayer = this.getWeight(map.layers[i].gbLayerLevel);
			if (wnow >= wlayer) {
				pos = i + 1;
				break;
			}
		}

		map.setLayerIndex(e.layer, pos);
/*		for (var i = map.layers.length - 1; i >= 0; i--) {
			console.log(i + ". " + map.layers[i].gbLayerLevel + " " + this.getWeight(map.layers[i].gbLayerLevel) + " " + (map.layers[i].name));
		};
*/
	},

	getWeight: function (level) {
		var w = [];
		w.redlining = 999;
		w.marker = 300;
		w.selection = 200;
		w.over = 100;
		w.main = 1;
		w.back = 0;
		w.base = -100;
		var ww = w[level];
		if (ww === undefined) {
			ww = 400;
		}
		return ww;
	}

/*		switch (e.layer.gbLayerLevel) {
		case 'marker':
			this.setLayerIndex(e.layer, this.getNumLayers());
			break;
		case 'redlining':
			this.setLayerIndex(e.layer, this.getNumLayers());
			break;
		case 'selection':
			this.setLayerIndex(e.layer, this.getNumLayers());
			break;
		case 'over':
			this.setLayerIndex(e.layer, this.getNumLayers());
			break;
		case 'main':
			this.setLayerIndex(e.layer, 100);
			break;
		case 'back':
			this.setLayerIndex(e.layer, 0);
			break;
		default:
			console.log('onAddLayer-Problem ******************************');
			console.log(e);
		}
*/

});