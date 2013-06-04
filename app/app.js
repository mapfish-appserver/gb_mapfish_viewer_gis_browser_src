/**
 * File: app.js
 *
 */

Ext.Loader.setConfig({
	enabled: true
});

Ext.application({
	requires: [
		'GbZh.base.ViewerState',
		'Gb41.utils.GbTools'
	],

	name: 'Gb41',

	autoCreateViewport: true,

	controllers: [
		'GbSigninController',
		'GbHeaderController',
		'GbTopicController',
		'GbWmsLayerController',
		'GbMapController',
		'GbMapContentController',
		'GbInfoTabPanelController',
		'GbOLControlsController',
		'edit.FormAwelLhForstfeuerZHController',
		'edit.NiDienstbarkeitenPanelController',
		'edit.FormNiDienstbarkeitenFController',
		'edit.FormNiDienstbarkeitenLController',
		'edit.FormNiDienstbarkeitenPController'
	],
	models: [
	],
	stores: [
	],
	views: [
		'GbViewport',
		//'GbSearchTabPanel',
		//'GbAddrSearch',
		//'GbParzSearch',
		//'GbTopicGrid',
		//'GbInfoTabPanel',
		'GbSwissnames',
		'GbParcels',
		//'GbMapContent',
		//'GbTocPanel',
		//'GbTocGrid',
		//'GbLegendPanel',
		'GbPrintPanel',
		'GbRedliningPanel',
		'GbEditPanel',
		'GbExportPanel'
	],

	launch: function () {
		if (!Gb41.utils.GbTools.areCookiesEnabled()) {
			alert('Das Setzen von Cookies muss für den GIS-Browser erlaubt sein.');
		}
		Gb41.app = this;
		OpenLayers.DOTS_PER_INCH = 96;
		// get the selected language code parameter from url (if exists)
		var url, params = Ext.urlDecode(window.location.search.substring(1));
		if (params.lang) {
			url = Ext.util.Format.format('../../lib/ext/ext-4.1.1a/locale/ext-lang-{0}.js', params.lang);
			Ext.Loader.injectScriptElement(url, Ext.emptyFn);
			//Ext.Loader.loadScriptFile('../../lib/ext/extjs-4.1.0/locale/ext-lang-de.js', Ext.emptyFn);

			/*
			*********** fuktioniert nicht ************
			url = Ext.util.Format.format('./locale/gb41-lang-{0}.js', params.lang);
			Ext.Loader.injectScriptElement(url, Ext.emptyFn);

			*/

		}

//		var requestState = GbZh.base.ViewerState.getRequestState();
		GbZh.base.ViewerState.setRequestState(requestState);
		GbZh.base.ViewerState.currentState.selection = requestState.selection;
		GbZh.base.ViewerState.currentState.redlining = requestState.redlining;
		GbZh.base.ViewerState.setRequestedTopic(requestState.mainRequestedTopic);
		GbZh.base.ViewerState.setDefaultTopic(requestState.mainDefaultTopic);

		//LOG console.log('Application launch');

		// *** globale Events überwachen, welche von ViewerState gefeuert werden
		Ext.util.Observable.capture(GbZh.base.ViewerState, function (e, params) {
			//LOG console.log('ViewerState-event: ' + e);
			if (typeof (params) === 'object') {
				//LOG console.log(params);
			} else {
				//LOG console.log(params); // auch Strings etc. :-)
			}
		}, this);
		// *** globale Events überwachen, welche von ViewerState gefeuert werden


		Ext.apply(Ext.data.SortTypes, {

			germanize: function (s) {
				var umlRe = /&([AEIOUYaeiouy])UML;/g, szRe = /&szlig;/g, aeoeue = /([ÄÖÜ])/g;
				return s.replace(umlRe,
					function (a, b) {return b; }).replace(/Ö/g, 'O').replace(/Ä/g, 'A').replace(/Ü/g, 'U');
			},


			asUCText: function (s) {
				return Ext.data.SortTypes.germanize(String(s).toUpperCase().replace(this.stripTagsRE, ""), false);
			},

			asUCString: function (s) {
				return Ext.data.SortTypes.germanize(String(s).toUpperCase(), false);
			},

			asText: function (s) {
				return Ext.data.SortTypes.germanize(String(s).replace(this.stripTagsRE, ""), true);
			},

			none: function (s) {
				return Ext.data.SortTypes.germanize(s, true);
			}
		});

	}

});

// link from identify results
var showID = function (layer, property, a, b, values) {
    var el = Ext.get("show-" + layer + "-" + values);
    if (el !== null) {
        var topic = el.getAttribute("data-topic");
        // get feature bounds
        var minx = el.getAttribute("data-minx");
        var miny = el.getAttribute("data-miny");
        var maxx = el.getAttribute("data-maxx");
        var maxy = el.getAttribute("data-maxy");

        var maxZoom = 10.537142856949282; // = minScale 500

        GbZh.base.ViewerState.fireEvent('showfeatures', topic, layer, property, values.split('$'), minx, miny, maxx, maxy, maxZoom);
    }
};
