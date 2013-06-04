/*
 * File: app/view/GbLegendPanel.js
 *
 */

function toggleDisplayElement(el) {
	el = document.getElementById(el);
	el.style.display = (el.style.display === "block") ? "none" : "block";
}

function toggleSlide(el) {
	toggleDisplayElement(el);
}


Ext.define('Gb41.view.GbLegendPanel', {
	extend: 'Ext.panel.Panel',
	requires: [
		'GbZh.store.GeoLionDatasets'
	],
	alias: 'widget.gblegendpanel',
	autoScroll: true,
	collapsed: true,
	title: 'Legende',
	metadatastore: null,
	metaservicedatastore: null,
	metaDataTemplate: null,

	initComponent: function () {
        var me = this;

		this.metadatastore = Ext.create('GbZh.store.GeoLionDatasets');
		this.metadatastore.on('load', this.fillMeta, this);
		this.metaservicedatastore = Ext.create('GbZh.store.GeoLionServices');
		this.metaservicedatastore.on('load', this.fillServiceMeta, this);
		GbZh.base.ViewerState.on('wmslayerstoreloaded',  this.showLegendInfo, this, this);
        GbZh.base.ViewerState.on('printLegend',  this.printLegend, this, this);
//		GbZh.base.ViewerState.on('showmetadata', this.doShowMetadata, this, this)insertservicemetadata
		GbZh.base.ViewerState.on('insertmetadata', this.doInsertMetadata, this, this);
		GbZh.base.ViewerState.on('insertservicemetadata', this.doInsertServiceMetadata, this, this);

		GbZh.base.ViewerState.on('popup', this.doPopup, this, this);
		GbZh.base.ViewerState.on('popuphtml', this.doPopupHtml, this, this);
		GbZh.base.ViewerState.on('popupimage', this.doPopupImage, this, this);
		this.metaDataTemplate = new Ext.XTemplate(
			'<tpl for=".">',
			'<div class="metadata">',
			'<span><b>{kurzbeschreibung}</b></span><br/><br/>',
//			'<h1>{title}</h1>',
			'<span>{owner}</span><br/>',
			'<span><i>Stand: {standdate}</i></span><br/>',
			'<span>Nachführung: {nachfuehrungstyp}</span><br/><br/>',
			'<span>{beschreibung}</span> ',
			'<span><a href="{metadetail}" target=_blank><b>Mehr...</b></a></span><br/>',
			'</div>',
//			'<a href="javascript:;" onmousedown="toggleSlide(\'meta' + this.metadatastore.proxy.extraParams.nr + '\');">',
//			'<a href="javascript:;" click="toggleSlide(\'meta{title}\');">',
			'<a href="javascript: toggleDisplayElement(\'{divtag}\')">',
			'<img src="/img/triangle_up.gif" id="test" height="10" width="10" text-align="right">',
			'</a>',
			'</tpl>'
		);

        me.callParent(arguments);
	},

	printLegend: function () {
		var w = window.open("", "legend_print", "resizable=yes,status=no,location=no,width=550,height=800,left=100");
		var d = w.document;
		d.writeln('<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">');
		d.writeln('<title>GIS-Browser Legende</title>');
		d.writeln('<link rel="stylesheet" type="text/css" href="../../lib/ext/ext4/resources/css/ext-all.css">');
		d.writeln('<link rel="stylesheet" type="text/css" href="resources/css/my-ext-theme.css">');
		d.writeln('<link rel="stylesheet" type="text/css" href="../../lib/GbZh/css/gbzh.css">');
		d.writeln('</head>');
		d.writeln('<body onload="window.print()">');
		d.write('<div class="x-body">');
//		d.writeln('<h1>' + Ext.get('myHeader').dom.textContent + '</h1>');
		d.writeln('<h1>' + GbZh.base.ViewerState.activeTopicTitle + '</h1>');
		d.writeln('<div class="legtext">Legende</div><br/>');
		d.write(Ext.getCmp("legend").html);
		d.writeln('</div>');
		d.writeln('</body></html>');
		d.close();
	},

	doPopup: function (url, height, width) {
		Gb41.utils.GbTools.popUp(url, height, width);
	},

	doPopupHtml: function (url, height, width, title) {
		Gb41.utils.GbTools.popUpHtml(url, height, width, title);
	},

	doPopupImage: function (url, height, width, title) {
		Gb41.utils.GbTools.popUpImage(url, height, width, title);
	},

	doInsertMetadata: function (nr) {
		var metaNr = nr;
		if (nr.indexOf('_') > 0) {
			metaNr = nr.substring(0, (nr.indexOf('_') - 1));
		}
		this.metadatastore.proxy.extraParams.nr = metaNr;
		this.metadatastore.proxy.url = GbZh.base.ViewerState.geoLionUrl;
		this.metadatastore.load();
	},

	fillMeta: function (store, records, successful, operation,  eOpts) {
//Ext.data.Store this, Ext.util.Grouper[] records, Boolean successful, Ext.data.Operation operation, Object eOpts
		var meta = records[0].data;
		var divtag = "meta" + store.proxy.extraParams.nr;
		var geolionUrl = GbZh.base.ViewerState.geoLionHost + '/geodatensatz/show?gdsid=' + store.proxy.extraParams.nr;
		Ext.apply(meta, {metadetail: geolionUrl, divtag: divtag});
		this.metaDataTemplate.overwrite(Ext.get(divtag), meta);
//		slidedown(divtag);
		toggleDisplayElement(divtag);
	},

	doInsertServiceMetadata: function (nr) {
//TODO: Aktivieren des WMW/WFS-Links, hier wird er deaktiviert
		if (2 > 1) {
			return;
		}
//ETODO
		this.metaservicedatastore.proxy.extraParams.nr = nr;
//HACK leider haben wir noch keine Nummer im topicsstore, der auf den wms oder wfs weist, darum hier mal fix eine gültige Nummer:
		this.metaservicedatastore.proxy.extraParams.nr = 171;
		this.metaservicedatastore.proxy.url = GbZh.base.ViewerState.geoLionServiceUrl;
		this.metaservicedatastore.load();
	},

	fillServiceMeta: function (store, records, successful, operation,  eOpts) {
//Ext.data.Store this, Ext.util.Grouper[] records, Boolean successful, Ext.data.Operation operation, Object eOpts
		var meta = records[0].data;
		if (meta.service !== "") {
			var st = Ext.String.trim(meta.servicetype);
			Ext.DomQuery.selectNode('#serviceinfo').innerHTML = '<a href="javascript: toggleDisplayElement(\'servicedetails\')">' + st + '</a>';
			Ext.DomQuery.selectNode('#servicedetails').innerHTML = 'URL: ' + meta.service
				+ '<br><a href="' + meta.service + '?SERVICE=WMS&VERISON=1.1.1.&REQUEST=GetCapabilities" target="_blank">GetCapabilities</a>'
				+ '<br><a href="javascript: toggleDisplayElement(\'servicedetails\')">'
				+ '<br><img src="/img/triangle_up.gif" id="test" height="10" width="10" align="right"></a>';
		}
	},

	showLegendInfo: function (topic, me) {
		alert('showlegendeinfo in gblegendpanel');
		if (!topic.overlay) {
			Ext.Ajax.request({
				url: '/topics/' + topic.name + '/legend',
				success: function (response, opts) {
					var legHtml = '<div id="legtxt">';
/*
//INFO: hätten wir Metadaten auf Topic-Niveau, müsste man da was machen
					var gdpnr = GbZh.store.Topics.getMetaForTopic(topic);
					if (gdpnr) {
						legHtml += '<a href="#" onclick="GbZh.base.ViewerState.fireEvent(\'showmetadata\', \'P\', \'' + gdpnr + '\', \'0\')">';
						legHtml += '<img src="/img/info.png" alt="Metadaten"></a>';
					}
 */
					legHtml += '<span class="noPrint"><a href="#" onclick="return GbZh.base.ViewerState.fireEvent(\'printLegend\')">';
					legHtml += '<img src="/img/print.png" alt="Metadaten"></a></span>';
					legHtml += response.responseText;
					legHtml += '</div>';
					me.update(legHtml);
					me.expand();
				}
			});
		}
	}

});

