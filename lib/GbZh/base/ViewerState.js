/**
 * Base class for GIS-Browser
 *
 * - Manages the actual state of the application (actual topic)
 * - acts as an event bus for the application. All application wide
 * events are fired here.
 *
 * - This component is also the central point for global configuration.
 */
Ext.define('GbZh.base.ViewerState', {
	mixins: {
		observable: 'Ext.util.Observable'
	},

	singleton: true,
	
	/**
	 * @property {String} INFOMARKER
	 * CONSTANT: Path to info marker image
	 */
	INFOMARKER: '/images/identify_marker.png',

	/**
	* @property {String} signinUrl
	* Local testdata are:
	* - success: './data/user.json'
	* - failure: './data/loginfailed.json'
	*
	* GIS-ZH:
	* - server: '/session/sign_in'
	*/
	signinUrl: '/session/sign_in',

	/**
	* @property {String} serverUrl
	* used e.g. for the permalink
	*/
	//serverUrl: 'print/create.json',  //TODO: wahrsch. l�schen
	serverUrl: null,
	/**
	* @property {String} isIntranet
	* used e.g. for header style
	*/
	isIntranet: false,
	
	/**
	* @property {String} geoLionHost
	* different for Intra- and Internet
	*/
	geoLionHost: null,
	/**
	* @property {String} geoLionUrl
	* different for Intra- and Internet
	*/
	geoLionUrl: null,
	/**
	* @property {String} oldGb
	* Link to old GIS-Browser
	*/
	oldGb: null,
	csradius: 500,

	
	
	config : {
		/**
		* @cfg {Object} requestState
		* This object contains all request parameters from URL parameters or from permalink:
		* - gbApplication
		* - topic
		* - offLayers
		* - bbox
		* - scaleDenominator
		* - selection
		* - redlining
		* - ...
		*/
//TODO: requestState wird mit Ruby generiert aus Permalink-Parametern:
//http://web.maps.zh.ch?topic=BASISKARTEZH&offlayers=siedlung%2Chaltestellen&scale=5525&x=691203&y=255941
//		requestState: null,
//TODO: Nachfolgenden Workaround l�schen s.oben		
		requestState: {
			mainRequestedTopic: 'AwelNISZH',
			backRequestedTopic: null,
//			overRequestedTopic: ['WaldWNBZH','AwelNISZH'],
//			overRequestedTopic: ['xxx', 'WaldWNBZH'],
//			mainDefaultTopic: 'Lageklassen2011ZH',
			mainDefaultTopic: 'BASISKARTEZH',
			backDefaultTopic: null,
			scaleDenominator: 20005,
            mapScale: 15553,
            mapPos: [694610.75, 261549.16],
			selection: null,
			filter: {
				filtertopic: '',
				filterlayer: '',
				filtersql: ''
            }

/*
			mainRequestedTopic: '',
			backRequestedTopic: 'basis',
			overRequestedTopic: ['WaldWNBZH','AwelNISZH'],
//			overRequestedTopic: ['xxx', 'WaldWNBZH'],
//			mainDefaultTopic: 'Lageklassen2011ZH',
			mainDefaultTopic: 'BASISKARTEZH',
			backDefaultTopic: 'basis',
			scaleDenominator: 20005,
			selection: null
*/

		},

		/**
		* @cfg {Boolean} isFirstRequest
		* Used to decide if default properties need to be loaded
		*/
		isFirstRequest: true,
		
		/**
		* @cfg {String} requestedTopic
		* Topicname of the requested topic. On application start it is set 
		* by the requestState || permalink object else by the parameter of 
		* the topicselected event.
		*/
		requestedTopic: null,
		/**
		* @cfg {String} defaultTopic
		* Topicname of the default topic. On application start it is set 
		* by the ruby code
		*/
		defaultTopic: null,
		/**
		* @cfg {String} noaccessTopic
		* Topicname to controll if requestedTopic is requested the first or second time
		*/
		noaccessTopic: null,
		/**
		* @cfg {String} activeTopic
		* Topicname set when topic is accessible
		*/
		activeTopic: null,
		/**
		* @cfg {String} activeTopicTitle
		* Topictitle set when topic is accessible
		*/
		activeTopicTitle: null,
		/**
		* @cfg {String} activeBackTopic
		* Topicname set when topic is ready
		*/
		//activeBackTopic: null,
		/**
		* @cfg {Array} activeOverlayTopics
		* Topicname set when topic is accessible
		*/
		//activeOverlayTopics: [],

		/**
		* @cfg {double} scaleDenominator
		* Map scale
		*/
		scaleDenominator: null,

		/**
		 * @property {Object} currentState
		 * This object contains state information for different components and permalink:
		 * - gbApplication
		 * - topicRecord
		 * - offLayers (user selection)
		 * - bbox
		 * - scaleDenominator
		 * - selection
		 * - redlining
		 * - ...
		 */
		currentState: {
			selection: null,
                        redlining: ''
		}
	},

	constructor: function (config) {
		this.mixins.observable.constructor.call(this, config);
		this.addEvents({
			/**
			 * @event showsigninform
			 * Should be fired if the user has not appropriate rights for reqested topic or 
			 * action. Or gets fired by a login button
			 * @param none
			 */
			'showsigninform': true,

			/**
			 * @event dologout
			 
			 * Gets fired by a logout button
			 * @param none
			 */
			'dologout': true,

			/**
			 * @event userchanged
			 * Gets fired after successful authentication
			 * @param {Object} user (username, email, groups ...)
			 */
			'userchanged': true,

			/**
			 * @event topicselected
			 * Gets fired after selection of requested topic
			 * @param {String} topicName
			 * @param {String} level ('main' | 'back' | 'over') 
			 * @param {Boolean} persistOverlay
			 */
			'topicselected': true,

			/**
			 * @event topicready
			 * Gets fired after topic is ready
			 * @param {String} topicName
			 * @param {String} topicTitle					 
			 * @param {String} level ('main' | 'back' | 'over') 
			 * @param {Boolean} persistOverlay
			 */
			'topicready': true,

			/**
			 * @event wmszh
			 * Gets fired if topic is GIS-ZH WMS
			 * @param {String} topicName
			 * @param {String} topicTitle			 
			 * @param {String} level ('main' | 'back' | 'over') 
			 * @param {Boolean} persistOverlay
			 */
			'wmszh': true,

			/**
			 * @event insufficientpermission
			 * Not enough rights, authentication required
			 * @param {String} topicName 
			 * @param {String} topicTitle
			 */
			'insufficientpermission': true,

			/**
			 * @event scalechanged
			 * Change of visiblity (user changes at tree)
			 * @param {double} scaleDenominator 
			 */
			'scalechanged': true,

		/**
			 * @event topicvisibilitychanged
			 * Change of visiblity (user changes at tree)
			 * @param {String} topicName 
			 * @param {boolean} visible
			 */
			'topicvisibilitychanged': true,

			/**
			 * @event wmslayersvisibilitychanged
			 * Change of visiblity of wmslayer(s)
			 * @param {String} topicName 
			 */
			'wmslayersvisibilitychanged': true,

			/**
			 * @event showfeatures
			 * Select features to show on map
			 * @param {String} layer 
			 * @param {String} property 
			 * @param {String} values.split('$') 
			 * @param {double} minx 
			 * @param {double} miny 
			 * @param {double} maxx 
			 * @param {double} maxy 
			 * @param {double} maxZoom 
			 */
			'showfeatures': true,
			
			/**
			 * @event removerlays
			 * Remove topic from map
			 */
			'removerlays': true,
			
			/**
			 * @event removelayer
			 * Remove topic from map
			 */
			'doremovelayer': true,
			
			/**
			 * @event removetocnode
			 * Remove topic from toc tree
			 * @param {String} topicName
			 */
			'removetocnode': true,
			/**
			 * @event ...
			 * Activate button actions
			 * @param {String} ...
			 */
			'exportactivate': true,
			'editactivate': true,

                        /**
			 * @event registereditpanelclass
			 * register edit panel for a topic
			 * @param {String} topicName
                         * @param {String} editPanelClassName
			 */
                        'registereditpanelclass': true,

                        /**
			 * @event registerolcontrols
			 * register OpenLayers controls for an edit panel and tool
			 * @param {String} groupName
                         * @param {String} toolName
                         * @param {OpenLayers.Control[]} olControls
			 */
                        'registerolcontrols': true,

                        /**
			 * @event unregisterolcontrols
			 * unregister OpenLayers controls for an edit panel and tool
			 * @param {String} groupName
                         * @param {String} toolName
			 */
                        'unregisterolcontrols': true,

                        /**
			 * @event activateolcontrols
			 * activate registered OpenLayers controls for an edit panel and tool
			 * @param {String} groupName
                         * @param {String} toolName
			 */
                        'activateolcontrols': true,

			'redliningshow': true,
                        'redliningpermalinkupdate': true,
                        // Params: features von GbZh.widgets.RedliningPanel
                        'redliningpermalinkfeaturesadd': true,
                        // Params: features für GbZh.widgets.RedliningPanel
			'printactivate': true,
			'permalinkactivate': true,
			'modeactivate': true,
			'updatemeasure': true
		});

		// show redlining from permalink after first topic load
		this.on('topicready', this.showRedliningPermalink, this);
                // update redlining permalink on redlining changes
		this.on('redliningpermalinkupdate', this.setRedliningPermalink, this);

		this.serverUrl = location.protocol + "//" + location.host;
		
		this.isIntranet = (location.host.indexOf('.ktzh.ch') > 0) || (location.host.indexOf('web.') >= 0) || (location.host.indexOf('localhost') >= 0);
		if (this.isIntranet) {
			this.geoLionHost = 'http://www.geolion.ktzh.ch';
			this.geoLionUrl = 'http://www.geolion.ktzh.ch/geodatensatz/getmetagds.json';
			this.geoLionServiceUrl = 'http://www.geolion.ktzh.ch/geodatensatz/getmetagdd.json';
			this.oldGb = 'http://web.gis.zh.ch/gb/gb.asp';
		} else  {
			this.geoLionHost = 'http://www.geolion.zh.ch';
			this.geoLionUrl = 'http://www.geolion.zh.ch/geodatensatz/getmetagds.json';
			this.geoLionServiceUrl = 'http://www.geolion.zh.ch/geodatensatz/getmetagdd.json';
			this.oldGb = 'http://www.gis.zh.ch/gb/gb.asp';
		}
	},

	// set redlining features as permalink param
	setRedliningPermalink: function(redlining) {
		this.currentState.redlining = redlining;
	},

	// convert permalink param to redlining features
	showRedliningPermalink: function() {
		if (this.currentState.redlining) {
			this.fireEvent('redliningshow', false);
			this.fireEvent('redliningpermalinkfeaturesadd', this.currentState.redlining);
		}

		// show redlining from permalink only after first topic load
		this.un('topicready', this.showRedliningPermalink, this);
	}
});

