Ext.define('Gb41.utils.GbTools', {
	statics: {

		AKSGBLink: function (ParzNr, BFSNr) {
			//alert(GVZNr + ' ' + BFSNr);
			//https://test.datenlogistik.zh.ch:444/grundbuch/RedirectGrundSuche.do?gmBFS=261&gnNummer=AA1488
			//https://portal.datenlogistik.zh.ch/grundbuch/RedirectGrundSuche.do?gmBFS=[BFS-Nr]&gnNummer=[Grundstueck-Nr]
			if (BFSNr === '230') {
				ParzNr = ParzNr.substr(2, ParzNr.length);
			}
			var url;
			url = 'https://portal.datenlogistik.zh.ch/grundbuch/RedirectGrundSuche.do?';
			url += 'gmBFS=' + BFSNr;
			url += '&gnNummer=' + ParzNr;
			var AKSFenster = window.open(url, "AKSFenster", "width=1000,height=600,left=100,top=200,resizable=yes,menubar=yes,location=yes,status=yes,scrollbars=yes");
			AKSFenster.focus();
		},

		AKSLink: function (GVZNr, BFSNr) {
			//alert(GVZNr + ' ' + BFSNr);
			//https://portal.datenlogistik.zh.ch/auskunft/RedirectEigSuche.do?gmGemeinde_Nr_BfS=154&geGebaeude_Nr=678&veKreis=154
			var url;
			url = 'https://portal.datenlogistik.zh.ch/auskunft/RedirectEigSuche.do?';
			url += 'geGebaeude_Nr=' + GVZNr;
			url += '&gmGemeinde_Nr_BfS=' + BFSNr;
			if (BFSNr === '230' || BFSNr === '261') {
				var kr = GVZNr.substr(0, 3);
				//alert(kr);
				url += '&veKreis=' + kr;
			}
			//alert(url);
			var AKSFenster = window.open(url, "AKSFenster", "width=1000,height=500,left=100,top=200,resizable=yes,menubar=yes,location=yes,status=yes,scrollbars=yes");
			AKSFenster.focus();
		},

		popUp: function (url, width, height) {
			var newwindow = window.open(url, 'name', 'width=' + width + ', height=' + height + "'");
			if (window.focus) {
				newwindow.focus();
			}
			return false;
		},

		popUpHtml: function (url, width, height, title) {
			var w, h;
			if (width > 800) {
				width = 800;
			}
			w = width - 10;

			if (height > 500) {
				height = 500;
			}
			h = height - 25;

			Ext.create('Ext.window.Window', {
				title: title || 'GIS-Browser',
				height: height,
				width: width,
				layout: 'fit',
				modal: true,
				autoScroll: false,
				resizable: false,
				//bodyPadding: 10,
				html: '<iframe src="' + url + '" width=' + w + ' height=' + h + '><a href="' + url + '" target="_blank">' + title + '</a></iframe>'
/* 
				loader : {
					url : url,
					loadMask: true,
					scripts: true,
					autoLoad: true, // important
					renderer: 'html'
				}
 */
			}).show();
		},


		popUpImage: function (url, width, height, title) {
			var img = Ext.create('Ext.Img', {
				src: '/Veloparkplaetze-Foto1-1312.jpg',
				autoEl: 'div' // wrap in a div
			});
			var winw = Ext.create('Ext.window.Window', {
				title: title || 'Glossar',
				height: height + 35,
				width: width + 15,
				layout: 'fit',
				autoScroll: true,
				modal: true,
				items: img,
				loader : {
					url : url,
					loadMask : true,
					autoLoad : true, // important
					renderer : 'component'
				}
			});
			winw.show();
		},

		drawCircle: function (east, north, radius, layerName, style, ftype) {
			//check if vectorlayer "circlelayer" exists - or create it
			var map, circleLayer, circleStyle, lyrName, isPoint;

			if (!Ext.isNumber(radius)) {
				radius = 15;
			}

			if (Ext.isString(layerName)) {
				lyrName = layerName;
			} else {
				lyrName = 'Suchresultat';
			}

			if (Ext.isString(ftype)) {
				if (ftype === 'Point') {
					isPoint = true;
				} else {
					isPoint = false;
				}
			} else {
				isPoint = false;
			}

			if (Ext.isObject(style)) {
				circleStyle = style;
			} else {
				if (isPoint) {
					circleStyle = {
						strokeColor: '#ee3333',
						strokeWidth: 3,
						strokeOpacity: 1,
						//strokeLinecap: 'round', // 'butt' || 'square'
						fillColor: '#ee3333',
						fillOpacity: 0.0,
						pointRadius: radius
					};
				} else {
					// red ring for search result
					circleStyle = {
						strokeColor: '#ee3333',
						strokeWidth: 3,
						strokeOpacity: 1,
						//strokeLinecap: 'round', // 'butt' || 'square'
						fillColor: '#ee3333',
						fillOpacity: 0.1
					};
				}
			}


			map = Gb41.app.getController('GbMapController').getMyMapPanel().map;
			var circleLayers = map.getLayersByName(lyrName);

			if (circleLayers.length > 0) {
				// use existing circlelayer layer
				circleLayer = circleLayers[0];
			} else {
				// create circlelayer layer
				circleLayer = new OpenLayers.Layer.Vector(lyrName);
				map.addLayer(circleLayer);
			}
			circleLayer.removeAllFeatures();
			var circleCenter = new OpenLayers.Geometry.Point(east, north);
			if (isPoint) {
				var pointFeature = new OpenLayers.Feature.Vector(circleCenter, null, circleStyle);
				circleLayer.addFeatures([pointFeature]);
			} else {
				//var circleCenter = new OpenLayers.Geometry.Point(east, north);
				var circle = OpenLayers.Geometry.Polygon.createRegularPolygon(circleCenter, radius, 32);
				var polygonFeature = new OpenLayers.Feature.Vector(circle, null, circleStyle);
				circleLayer.addFeatures([polygonFeature]);
			}
		},

		areCookiesEnabled: function () {
	        var r = false;
	        Ext.util.Cookies.set("testing", "Hello");
	        if (Ext.util.Cookies.get("testing") !== null) {
	            r = true;
	            Ext.util.Cookies.clear("testing");
	        }
	        return r;
	    },


		displayHelpMessage: function (componentId, message, displayTime) {
			var hc = Ext.getCmp(componentId);
			if (hc) {
				hc.update(message);
			}
			if (displayTime) {
				//TODO
			}
		}


	}

});
