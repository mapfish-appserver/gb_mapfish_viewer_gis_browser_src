/**
 * File: app/controller/GbWmsLayerController.js
 *
 */

Ext.define('Gb41.controller.GbWmsLayerController', {
	extend: 'Ext.app.Controller',

	models: [
		'WmsLayer'
	],
	stores: [
		'WmsLayers'
	],

	init: function (application) {
		GbZh.base.ViewerState.on({
			userchanged: {
				fn: this.onUserChanged,
				scope: this
			},
			wmszh: {
				fn: this.onWmsZh,
				scope: this
			}
		});
	},

	onLaunch: function () {
		//LOG console.log('GbWmsLayerController launch');
	},

	onUserChanged: function () {
		// clear WmsLayerStore
		var wmsLayers = this.getWmsLayersStore();
		wmsLayers.removeAll();
	},

	onWmsZh: function (topicName, topicTitle,  level, persistOverlay) {

		var wmsLayers = this.getWmsLayersStore();
		var topicLevel = level;
		var irec, rec;

		wmsLayers.clearFilter(true);

		var idx = wmsLayers.findExact('topic', topicName);

		if (idx === -1) {
			//if topic not exists in store -> add layers 
			wmsLayers.load({
				scope: this,
				params: {
					topic: topicName
				},
				addRecords: true,
				callback: function (records, operation, success) {
					var i, len;
					if (success) {
						wmsLayers.clearFilter(true);
						wmsLayers.filter('topic', topicName);
						var offLayers = GbZh.base.ViewerState.requestState.offlayers;
						var withOffLayers = false;
						if (Ext.isArray(offLayers)) {
							withOffLayers = offLayers.length > 0;
						}
						if (withOffLayers) {
							wmsLayers.each(function (r) {
								r.data.visuser = true; // bei offlayers: alle zuerst auf true
							});

							for (i = 0, len = offLayers.length; i < len; i += 1) {
								irec = wmsLayers.findExact('layername', offLayers[i]);
								rec = wmsLayers.getAt(irec);
								if (rec) {
									rec.data.visuser = false;
								}
							}
							GbZh.base.ViewerState.requestState.offlayers = [];
						}
/*						var onLayers = GbZh.base.ViewerState.requestState.onlayers;
						if (onLayers) {
							for (i = 0, len = onLayers.length; i < len; i += 1) {
								irec = wmsLayers.findExact('layername', onLayers[i]);
								rec = wmsLayers.getAt(irec);
								if (rec) {
									rec.data.visuser = true;
								}
							}
						}

						GbZh.base.ViewerState.requestState.onlayers = [];
*/
						if (wmsLayers.data.length > 0) {
							GbZh.base.ViewerState.fireEvent('topicready', topicName, topicTitle, topicLevel, persistOverlay);
						} else {
							GbZh.base.ViewerState.fireEvent('insufficientpermission', topicName, topicTitle);
						}

					} else {
						//LOG console.log('no success: ' + topicName);
						GbZh.base.ViewerState.fireEvent('insufficientpermission', topicName, topicTitle);
					}
				}
			});
		} else {
			wmsLayers.filter('topic', topicName);
			GbZh.base.ViewerState.fireEvent('topicready', topicName, topicTitle, topicLevel, persistOverlay);
		}
	},


/**
	 * Get comma separated layers string
	 * @return {String} Layer list
	 * @param {String} topicName
	 */
	getLayerList: function (topicName) {
		return this.buildLayerList(topicName, true, false);
	},

	/**
	 * Disabled layers for permalink offlayers attribute
	 * @return {String} Layer list
	 * @param {String} topicName	 
	 */
	getOffLayerList: function (topicName) {
		return this.buildLayerList(topicName, false, false);
	},

	/**
	 * Layerlist for query with queryorder
	 * @return {String} Layer list
	 * @param {String} topicName	 
	 */
	getQueryLayerList: function (topicName) {
		return this.buildLayerList(topicName, true, true);
	},


	/**
	* Get comma separated layers string
	* @return {String} Layer list
	* @param {String} topicName
	* @param {Boolean} visible
	*/
	buildLayerList: function (topicName, visible, isQuery) {
		var layerList = '';
		var wmsLayers = Ext.getStore('WmsLayers');
		var filters = [{
	//TODO warum value=false?
			property: 'wms',
			value: false
		}, {
			property: 'visuser',
			value: visible
		}, {
			property: 'topic',
			value: topicName,
			exactMatch: true
		}];
		if (isQuery) {
			var scale = GbZh.base.ViewerState.getScaleDenominator();
			filters.push({
				property: 'minscale',
				filterFn: function (item) { return item.get("minscale") < scale && item.get("maxscale") > scale; }
			});
		}
		wmsLayers.filter(filters);

		wmsLayers.sort('wms_sort', 'ASC');

		wmsLayers.each(function (r) {
			layerList += r.data.layername + ',';
		});
		if (layerList !== '') {
			layerList = layerList.slice(0, layerList.length - 1);
		}
		wmsLayers.clearFilter(true);
		return layerList;
	}

});
