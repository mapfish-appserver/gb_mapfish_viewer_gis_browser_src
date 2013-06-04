/**
* File: lib/GbZh/widget/GbSwissnamesSearchComboBox.js
*
*/

/**
 *  Creates a combo box that handles results from the Swissnames geocoding service. 
 * @class GbZh.widget.GbSwissnamesSearchComboBox
 */

Ext.define('Gb41.view.GbSwissnames', {
    extend : 'GeoExt.form.field.GeocoderComboBox',
    requires: ['GeoExt.panel.Map', 'Ext.data.JsonStore', 'Ext.data.proxy.JsonP', 'Gb41.utils.GbTools'],
 //   alias : 'widget.gb_swissnamesgeocodercombo',
    alias: 'widget.gbswissnames',

	// **** Texte ****
	/**
	* @cfg {String} btnTextSignin
	* Text for button Sign in.
	*/
	//<locale>
	alertTitle: 'Login failed',
	//</locale>

	url: 'http://api.geo.admin.ch/swisssearch/geocoding',
	width: 200,
	queryParam: 'query',
	srs: 'EPSG:21781',
	emptyText: 'Ortschaft, Adresse, PLZ ...',
	displayField: 'label',
	valueField: 'bbox',
	zoom: 9,

    handleSelect: function (combo, rec) {
        if (!this.map) {
            this.findMapPanel();
        }
        var value = this.getValue();
        if (Ext.isArray(value)) {
            var mapProj = this.map.getProjectionObject();
            delete this.center;
            delete this.locationFeature;
            if (value.length === 4 && (value[2] - value[0] !== 0) && (value[3] - value[1] !== 0)) {
                this.map.zoomToExtent(
                    OpenLayers.Bounds.fromArray(value)
                        .transform(this.srs, mapProj)
                );
            } else {
                this.map.setCenter(
                    OpenLayers.LonLat.fromArray(value)
                        .transform(this.srs, mapProj),
                    Math.max(this.map.getZoom(), this.zoom)
                );
                var xy = this.map.getCenter();
                Gb41.utils.GbTools.drawCircle(xy.lon, xy.lat, 15, 'Suchresultat', null, 'Point');
            }
			rec = rec[0];
            this.center = this.map.getCenter();
            var lonlat = rec.get(this.locationField);
            if (this.layer && lonlat) {
                var geom = new OpenLayers.Geometry.Point(lonlat[0], lonlat[1]).transform(this.srs, mapProj);
                this.locationFeature = new OpenLayers.Feature.Vector(geom, rec.data);
                this.layer.addFeatures([this.locationFeature]);
            }
        }
    },

    /** 
     * Find the MapPanel somewhere up in the hierarchy or everywhere and set the map
     * @private
     */


    findMapPanel: function () {
		var mapPanel = this.up('gx_mappanel');
        if (mapPanel) {
            this.setMap(mapPanel);
        } else {
			mapPanel = Ext.ComponentQuery.query("gx_mappanel");
			if (mapPanel.length > 0) {
				this.setMap(mapPanel[0]);
			}
		}
    },

	listeners: {
		render: function () {
			Ext.create('Ext.tip.ToolTip', {
				target: 'swissnamessearch',
				html: 'Eingabe: <b>Ort</b>, <b>PLZ</b> oder <b>administrative Einheit</b>'
			});
		},
		select: function (combo, rec) {
			combo.setValue((rec[0].data.label).replace(/<[\/]?[^>]*>/g, ''));
		}
	},

	store: Ext.create('Ext.data.JsonStore', {
		fields: [
			{ name: 'service', type: 'string' },
			{ name: 'objectorig', type: 'string' },
			{ name: 'rank', type: 'int' },
			{ name: 'label', type: 'string' },
			{ name: 'bbox', type: 'auto' },
			{ name: 'id', type: 'auto' }
		],
		proxy: {
			type: 'jsonp',
			url : 'http://api.geo.admin.ch/swisssearch/geocoding',
			callbackKey: 'cb',
			reader: {
				type: 'json',
				root: 'results'
			}
		}
	})
});
