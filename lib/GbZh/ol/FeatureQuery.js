OpenLayers.Control.FeatureQuery = OpenLayers.Class(OpenLayers.Control.GetFeature, {
	requires: [
		'GbZh.base.ViewerState',
		'Gb41.controller.GbWmsLayerController'
	],

	outputNode: '#info .x-panel-body',

	request: function (bounds, options) {
		options = options || {};
		var latlon = bounds.getCenterLonLat();
		GbZh.base.ViewerState.fireEvent('identifyclicked', latlon.lon, latlon.lat);
		if (this.displayProjection) {
			bounds.transform(this.map.getProjectionObject(), this.displayProjection);
		}

		var filter = new OpenLayers.Filter.Spatial({
			type: OpenLayers.Filter.Spatial.BBOX,
			value: bounds
		});

		var topicName = (GbZh.base.ViewerState === null) ? '' : GbZh.base.ViewerState.getActiveTopic();
		var layerNames = this.findAllLayers();

		var queries = this.findQueries(topicName);
		if (queries.length === 2) {
			layerNames.queryTopics[0].customQueries = queries[0];
			layerNames.queryTopics[0].customParams = queries[1];
		}

		var response = this.protocol.read({
			url: this.url,
			maxFeatures: options.single === true ? this.maxFeatures : undefined,
			filter: filter,
			params: {
//				topic: topicName,
				infoQuery: Ext.JSON.encode(layerNames)
			},
			callback: this.showResults,
			scope: this
		});
	},

	showResults: function (result) {
		GbZh.base.ViewerState.fireEvent('featurequeryresultsready', result);
		// Reset the cursor.
		OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
	},


	findLayers: function () {
		var layerNames = [];
		var candidates = this.layers || this.map.layers;
		var layer;
		var i, len;

		for (i = 0, len = candidates.length; i < len; ++i) {
			layer = candidates[i];
			if (layer instanceof OpenLayers.Layer.WMS && (layer.getVisibility() && layer.inRange && layer.gbLayerLevel === 'main')) {
// vorher
//				layerNames = layerNames.concat(layer.params.LAYERS);
//TEST neu (dieser String sollte in der richtigen Infoabfragenreihenfolge und massstabbereinigt sein)
				layerNames = Gb41.controller.GbWmsLayerController.prototype.getQueryLayerList(layer.name);
			}
		}
		return layerNames;
	},

	findQueries: function (topicName) {
//TODO hier werden ein paar Spezialqueries gleich hart verdrahtet. Wo wollen wir diese verwalten???
		var customQueries = '',
			customParams = '',
			radius = 600;
		if (topicName === 'StaBevZH') {
			if (GbZh.base.ViewerState.csradius) {
				radius = GbZh.base.ViewerState.csradius;
			}
			customQueries = {
				'umkreis-statistik': 'circle_statistics'
			};
			customParams = {
				'radius': radius
			};
		}
		if (customQueries === '') {
			return [];
		}
		return [customQueries, customParams];
	},


	findAllLayers: function () {
		var queryTopics = [];
		var candidates = this.layers || this.map.layers;
		var layer;
		var i, len;


		for (i = 0, len = candidates.length; i < len; ++i) {
			layer = candidates[i];
			if (layer instanceof OpenLayers.Layer.WMS && (layer.getVisibility() && layer.inRange && (layer.gbLayerLevel === 'main' || layer.gbLayerLevel === 'over'))) {
				queryTopics.push({
					'level': layer.gbLayerLevel,
					'topic': layer.name,
					'divCls': 'leg' + layer.gbLayerLevel,
					'layers': Gb41.controller.GbWmsLayerController.prototype.getQueryLayerList(layer.name)
				});
			}
		}
		return {
			'queryTopics': queryTopics
		};
	},

	CLASS_NAME: "OpenLayers.Control.FeatureQuery"
});

OpenLayers.Format.Raw = OpenLayers.Class(OpenLayers.Format, {

	initialize: function (options) {
		OpenLayers.Format.prototype.initialize.apply(this, [options]);
	},

	read: function (text) {
		if (text.length > 0) {
			return [new OpenLayers.Feature(null, null, text)];
		} else {
			return [];
		}
	},

	CLASS_NAME: "OpenLayers.Format.Raw"
});