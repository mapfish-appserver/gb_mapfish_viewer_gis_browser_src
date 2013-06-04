/**
 *
 */
Ext.define('Gb41.view.GbMousePosAndSetCenter', {
	extend: 'Ext.form.TextField',
	alias: 'widget.gb-mouseposandsetcenter',
	
	requires: [
		'Gb41.utils.GbTools'
	],
	
	config: {
		map: {},
		maxScale: 99999999,
		minScale: 1,
		decimalPrecision: 0,
		baseCls: "gb-mouseposandsetcenter",
		emptyString: '',
		prefixEast: '',
		prefixNorth: '',
		separator: ' / ',
		suffix: '',
		numDigits: 0,
		granularity: 10,
		/** 
		 * @property {OpenLayers.Pixel} lastXy Last position on map
		 */
		lastXy: null
	},

	listeners: {
		focus: function (field, e) {
			//			this.empty();
		},

		blur: function (field, e) {
			this.reset();
		},

		specialkey: function (field, e) {
			// e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
			// e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
			var centerCoord;
			if (e.getKey() === e.ENTER) {
				centerCoord = this.parseCoord(this.getValue());
				if (!centerCoord) {
					this.setValue('???');
				} else if (!this.map.getMaxExtent().containsLonLat(centerCoord)) {
					this.setValue('ausserhalb!');
				} else {
					Gb41.utils.GbTools.drawCircle(centerCoord.lon, centerCoord.lat, 'Suchresultat', 15, null, 'Point');
					this.map.setCenter(centerCoord);
				}
				this.selectText();
			}
		}
	},

	initComponent: function () {
		Ext.applyIf(this, this.config);
		this.callParent();
		this.map.events.on({
			mousemove: this.update,
			mouseout: this.reset,
			scope: this
		});
		if (this.map.baseLayer) {
			this.update();
		}
		
		if (!this.cls) {
			this.cls = this.baseCls;
		}
		this.selectOnFocus = true;
		this.enableKeyEvents = true;
		//        this.on("keypress", this.setCenterHandler, this);
		this.on("beforedestroy", this.unbind, this);
	},

	unbind: function () {
		this.map.events.un('mousemove', this, this.update);
		this.map.events.un('mouseout', this, this.reset);
		this.map = null;
	},

/*     setCenterHandler: function (t, e) {
        var centerCoord;
        if (e.getKey() === 13) {
            //alert(t.getValue());
            centerCoord = this.parseCoord(t.getValue());
            this.map.setCenter(centerCoord); //zoomToScale: function(scale {float},	closest{Boolean})
        }
    },
 */
	/** private: method[parseCoord]
	 *  Parse the coordString and convert to valid OpenLayers.LonLat-Object. Returns null if not valid.
	 *  EPSG:21781
	 *  - 685'853.20 - 253'126.60
	 *  - 685853.20/253126.60
	 *  EPSG:4326
	 *  - N47.12345° E007.98765°
	 *  - N47° 12.345' E 007° 98.765'
	 *  - N47° 12' 345.67" E 007° 98' 765"
	 */
	parseCoord: function (coordString) {
		var inputProj = '';
		var validCoords = false;
		var eastCoord, northCoord;
		var strTemp = '';
		var strCoord1 = '';
		var strCoord2 = '';
		var stringCoords;
		var projectionString = this.map.getProjection();
		var point = null;
		var i;

		coordString = Ext.String.trim(coordString);

		var Ausdruck = /\d+/; //beliebige Ganzzahl
		strTemp = Ausdruck.exec(coordString);
		if (!strTemp) {
			return null;
		}
		if (strTemp[0] > 180) { //Landeskoordinaten
			coordString = coordString.replace(/\´+|\`+|\'+/g, ""); // Tausender-Trennzeichen ersetzen 685´853.20 -> 685853.20
			coordString = coordString.replace(/\./g, "p"); // Dezimalpunkt ersetzen 685853.20 - 253126.60 -> 685853x20 - 253126x60
			coordString = coordString.replace(/\W+/g, "$"); // -> 685853x20$253126x60
			coordString = coordString.replace(/p/g, "."); // Dezimalpunkt ersetzen -> 685853.20$253126.60
			stringCoords = coordString.split("$");
			for (i = 0; i < stringCoords.length; i += 1) {
				strTemp = stringCoords[i];
				if (strTemp > 100000) {
					if (strCoord1 === '') {
						strCoord1 = strTemp;
					} else {
						strCoord2 = strTemp;
					}
				}
			}
			if (strCoord1 > 100000 && strCoord2 > 100000) {
				if (strCoord1 > strCoord2) {
					eastCoord = strCoord1;
					northCoord = strCoord2;
				} else {
					eastCoord = strCoord2;
					northCoord = strCoord1;
				}
				validCoords = true;
				inputProj = 'EPSG:21781';
			}
		} else { // WGS84
			coordString = coordString.replace(/\./g, "p"); // Dezimalpunkt ersetzen N 47.20423 - E 8.253126 -> N 47p20423 - E 8p253126
			//coordString = coordString.replace(/\°/g, "g"); // Grad
			//coordString = coordString.replace(/\'/g, "m"); // Minuten
			//coordString = coordString.replace(/\"/g, "s"); // Sekunden
			coordString = coordString.replace(/\W+/g, "$"); // 
			coordString = coordString.replace(/p/g, "."); // Dezimalpunkt ersetzen -> N 47p20423 - E 8p253126$N 47.20423 - E 8.253126
			stringCoords = coordString.split("$");
			if (stringCoords.length === 2) { //
				strCoord1 = stringCoords[0];
				strCoord2 = stringCoords[1];
			} else {
				for (i = 0; i < stringCoords.length; i += 1) {
					strTemp = stringCoords[i];
					eastCoord = stringCoords[0];
					northCoord = stringCoords[1];
				}
			}

			strCoord1 = parseFloat(strCoord1);
			strCoord2 = parseFloat(strCoord2);
			if (strCoord1 >= -180 && strCoord1 <= 180 && strCoord2 >= -90 && strCoord2 <= 90) {
				if (strCoord1 > strCoord2) {
					eastCoord = strCoord2;
					northCoord = strCoord1;
					validCoords = true;
				} else {
					eastCoord = strCoord1;
					northCoord = strCoord2;
					validCoords = true;
				}
			} else if (strCoord2 >= -180 && strCoord2 <= 180 && strCoord1 >= -90 && strCoord1 <= 90) {
				eastCoord = strCoord2;
				northCoord = strCoord1;
				validCoords = true;
			}
			inputProj = 'EPSG:4326';
		}

		if (validCoords){
			point = new OpenLayers.LonLat(eastCoord, northCoord);
			if (projectionString !== inputProj){
				var fromProj = new OpenLayers.Projection(inputProj);
				var toProj = this.map.getProjectionObject();
				
				point.transform(fromProj, toProj);
			}
		}
		
		return point;
	},


	update: function (evt) {
		var lonLat;
		if (evt === undefined || evt === null) {
			this.reset();
			return;
		} else {
			if (this.lastXy === null || Math.abs(evt.xy.x - this.lastXy.x) > this.granularity || Math.abs(evt.xy.y - this.lastXy.y) > this.granularity) {
				this.lastXy = evt.xy;
				return;
			}

			lonLat = this.map.getLonLatFromPixel(evt.xy);
			if (!lonLat) {
				// map has not yet been properly initialized
				return;
			}
			if (this.displayProjection) {
				lonLat.transform(this.map.getProjectionObject(), this.displayProjection);
			}
			this.lastXy = evt.xy;

		}

		var newHtml = this.formatOutput(lonLat);

		if (newHtml !== this.getValue) {
			this.setValue(newHtml);
		}
	},

	reset: function (evt) {
		if (evt) {
			lonLat = this.map.getCenter();
			if (!lonLat) {
				// map has not yet been properly initialized
				return;
			}
			if (this.displayProjection) {
				lonLat.transform(this.map.getProjectionObject(), this.displayProjection);
			}
			this.lastXy = evt.xy;
			this.setValue(this.formatOutput(lonLat));
		}
		if (this.emptyString !== null) {
			//           this.setValue(this.map.getCenter().lon + this.separator + this.map.getCenter().lat);
		}
	},

	empty: function (evt) {
		this.setValue("");
	},

//TODO das folgende statement war erstaunlicherweise ausserhalb der funktion ...
//	var digits = parseInt(this.numDigits, 10);
	formatOutput: function (lonLat) {
		var digits = parseInt(this.numDigits, 10);
		var newHtml = this.prefixEast + lonLat.lon.toFixed(digits) + this.separator + this.prefixNorth + lonLat.lat.toFixed(digits) + this.suffix;
		return newHtml;
	},

	//    /**
	//    * Method: destroy
	//    */
	//    destroy: function () {
	//        if (this.map) {
	//            this.map.events.unregister('mousemove', this, this.redraw);
	//        }
	//        OpenLayers.Control.prototype.destroy.apply(this, arguments);
	//    },
	CLASS_NAME: "Gb41.view.GbMousePosAndSetCenter"
});
