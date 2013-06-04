/**
 * File: app/controller/GbTopicController.js
 *
 */

Ext.define('Gb41.controller.GbTopicController', {
	extend: 'Ext.app.Controller',

	requires: [
		'Ext.grid.feature.Grouping'
	],

	models: [
		'Topic'
	],
	stores: [
		'Topics'
	],
	refs: [
		{
			ref: 'GbTopicGrid',
			selector: 'gbtopicgrid'
		},
		{
			ref: 'txtFilter',
			selector: '#txtFilter'
		},
		{
			ref: 'menuGrouping',
			selector: '#menuGrouping'
		},
		{
			ref: 'btnMain',
			selector: '#btnMain'
		},
		{
			ref: 'btnOver',
			selector: '#btnOver'
		},
		{
			ref: 'btnBack',
			selector: '#btnBack'
		}
	],

	init: function (application) {
		this.control({
			'#btnOver': {
				click: this.onBtnOver
			},
			'#btnMain': {
				click: this.onBtnMain
			},
			'#btnBack': {
				click: this.onBtnBack
			},
			'#txtFilter': {
				change: this.onTxtFilter
			},
			'#menuGrouping': {
				click: this.onMenuGrouping
			}
		});
		GbZh.base.ViewerState.on({
			userchanged: {
				fn: this.onUserChanged,
				scope: this
			},
			topicselected: {
				fn: this.onTopicSelected,
				scope: this
			},
			insufficientpermission: {
				fn: this.onInsufficientPermission,
				scope: this
			},
			topicready: {
				fn: this.onTopicReady,
				scope: this
			},
			gbmaskoff: {
				fn: this.onGbMaskOff,
				scope: this
			}
		});
	},

	onMenuGrouping: function (menu, item, e, eOpts) {
		switch (item.itemId) {
		case 'groupCategory':
			this.onTopicGroupCategory();
			break;
		case 'groupOrganisation':
			this.onTopicGroupOrganisation();
			break;
		case 'groupAlphabet':
			this.onTopicAlphabet();
			break;
		default:
			this.onTopicGroupCategory();
		}
	},

	onLaunch: function () {
		//LOG console.log('TopicController launch');
	},

	changeLevelTo: function (level) {
		Ext.suspendLayouts();
		var topicStore = this.getTopicsStore();
		//TODO: suspendLayout auf TopicGrid
		topicStore.clearFilter();
		this.getTxtFilter().setValue('');
		topicStore.filter(level, true);

		if (level === 'main_layer') {
			var noParentIdFilter = new Ext.util.Filter({
				filterFn: function (item) {
			        return item.data.parent_id < 1;
			    }
			});
			topicStore.filter(noParentIdFilter);
		}
		Ext.resumeLayouts();
	},

	onUserChanged: function (user) {
		var i, len;
		this.getTopicsStore().load({
			scope: this,
			addRecords: false,
			callback: function (records, operation, success) {
				if (success) {
					var topicName = GbZh.base.ViewerState.getRequestedTopic();
					GbZh.base.ViewerState.fireEvent('topicselected', topicName, 'main', false);
				}
			}
		});

		this.getTxtFilter().setValue('');
		if (this.getBtnOver().pressed) {
			this.changeLevelTo('overlay_layer');
		} else if (this.getBtnBack().pressed) {
			this.changeLevelTo('background_layer');
		} else if (this.getBtnMain().pressed) {
			this.changeLevelTo('main_layer');
		}

		var menuItems = this.getMenuGrouping().items;
		for (i = 0, len = menuItems.items.length; i < len; i += 1) {
			if (menuItems.items[i].checked) {
				//onMenuGrouping: function (menu, item, e, eOpts)
				this.onMenuGrouping(menuItems, menuItems.items[i]);
				break;
			}
		}
	},

	onGbMaskOff: function () {
		this.getGbTopicGrid().el.unmask();
	},

	onTopicGroupCategory: function () {
//		this.store.group('topicgroupcategory', 'ASC');
		this.getTopicsStore().group([{
			property: 'categorytitle',
			direction: 'ASC'
		}, {
			property: 'title',
			direction: 'ASC'
		}]);
		this.getTopicsStore().sort([{
			property: 'categorysort',
			direction: 'ASC'
		}, {
			property: 'title',
			direction: 'ASC'
		}]);
	},

	onTopicAlphabet: function () {
//FIXME: hier wäre die Verwendung einer dummy-Variablen nötig. singleTile als Test
		this.getTopicsStore().group('singleTile', 'ASC');
		this.getTopicsStore().sort([{
			property: 'singleTile',
			direction: 'ASC'
		}, {
			property: 'title',
			direction: 'ASC'
		}]);
	},

	onTopicGroupOrganisation: function () {
		this.getTopicsStore().group('organisationtitle', 'ASC');
		this.getTopicsStore().sort([{
			property: 'organisationsort',
			direction: 'DESC'
		}, {
			property: 'title',
			direction: 'ASC'
		}]);
	},

	onTopicSelected: function (topicName, level, persistOverlay) {
		if (topicName === GbZh.base.ViewerState.activeTopic) {
			return;
		}
		Ext.suspendLayouts();
		var topicStore = this.getTopicsStore();
		var oldFilter = topicStore.filters.clone();
		//TODO: suspendLayout auf TopicGrid
		topicStore.clearFilter(true);

		var ix = topicStore.findExact('name', topicName);

		if (ix >= 0) {
			var rec = topicStore.getAt(ix);
			var blnMissingpermission = rec.get('missingpermission');
			var topicTitle = rec.get('title');

			if (blnMissingpermission) {

				if (level === 'main') {
					GbZh.base.ViewerState.fireEvent('insufficientpermission', topicName, topicTitle);
				} else {
					alert('onTopicSelected', 'topic "' + topicName + '" konnte nicht als "' + level + '" geladen werden');
				}

			} else {
				var olLayerClass = rec.get('ollayer_class');
				//TODO: if löschen sobald Daten korrigiert sind
				if (olLayerClass === 'WMS') {
					olLayerClass = 'wmszh';
				}

				if (olLayerClass === 'wmszh') {
					GbZh.base.ViewerState.fireEvent('wmszh', topicName, topicTitle,  level, persistOverlay);
				} else {
					GbZh.base.ViewerState.fireEvent('topicready', topicName, topicTitle,  level, persistOverlay);
				}

			}
		} else {
			if (level === 'main') {
				GbZh.base.ViewerState.fireEvent('insufficientpermission', topicName, topicName);
			} else {
				alert('onTopicSelected: topic "' + topicName + '" konnte nicht als "' + level + '" geladen werden');
			}
		}

//		topicStore.filter('missingpermission', false);
		topicStore.filters = oldFilter;
		topicStore.filter();
		Ext.resumeLayouts(true);
	},

	onInsufficientPermission: function (topicName, topicTitle) {
		var req = GbZh.base.ViewerState.getRequestedTopic();
		var noa = GbZh.base.ViewerState.getNoaccessTopic();
		if (req === noa) {
			alert("Karte " + topicTitle + " kann nicht geladen werden.");
			GbZh.base.ViewerState.setNoaccessTopic(null);
			GbZh.base.ViewerState.setRequestedTopic(GbZh.base.ViewerState.getActiveTopic());
			if (!GbZh.base.ViewerState.getRequestedTopic()) {
				GbZh.base.ViewerState.setRequestedTopic(GbZh.base.ViewerState.getDefaultTopic());
			}
			req = GbZh.base.ViewerState.getRequestedTopic();
			GbZh.base.ViewerState.fireEvent('topicselected', req, 'main', false);
		} else {
			GbZh.base.ViewerState.setRequestedTopic(topicName);
			GbZh.base.ViewerState.setNoaccessTopic(topicName);
			GbZh.base.ViewerState.fireEvent('showsigninform');
			if (!GbZh.base.ViewerState.getActiveTopic()) {
				GbZh.base.ViewerState.fireEvent('topicselected', GbZh.base.ViewerState.getDefaultTopic(), 'main', false);
			}
		}
	},

/*
	onTopicReady: function (topicName, topicTitle, level, persistOverlay) {
		if (level === 'main') {
			GbZh.base.ViewerState.setActiveTopic(topicName);
			GbZh.base.ViewerState.setActiveTopicTitle(topicTitle);
		}
		var bgTopic = null;
		var ovTopics = null;
		var topicStore = this.getTopicsStore();
		//TODO: suspendLayout auf TopicGrid
		topicStore.clearFilter();

		var ix = topicStore.findExact('name', topicName);

		if (ix >= 0) {
			var rec = topicStore.getAt(ix);
			bgTopic = rec.get('bg_topic');
			if (bgTopic === "" || bgTopic === undefined) {
				bgTopic = null;
			}
			ovTopics = rec.get('overlay_topic');
			if (ovTopics === "" || ovTopics === undefined) {
				ovTopics = null;
			}
		}

		if (level === 'main') {
			this.loadBackTopic(level, bgTopic, ovTopics);
		} else {
			this.loadOverTopics(level, ovTopics);
		}

	},
*/

	onTopicReady: function (topicName, topicTitle, level, persistOverlay) {
		Ext.suspendLayouts();
		if (level === 'main') {
			var bgTopic = null;
			var ovTopics = null;
			var isFirstRequest = GbZh.base.ViewerState.getIsFirstRequest();

			var topicStore = this.getTopicsStore();
			//TODO: suspendLayout auf TopicGrid
			var oldFilter = topicStore.filters.clone();
			topicStore.clearFilter(true);

			var ix = topicStore.findExact('name', topicName);

			if (ix >= 0) {
				var rec = topicStore.getAt(ix);
				bgTopic = rec.get('bg_topic');
				if (bgTopic === "" || bgTopic === undefined) {
					bgTopic = null;
				}
				ovTopics = rec.get('overlay_topics');
				if (ovTopics === "" || ovTopics === undefined || ovTopics.length === 0) {
					ovTopics = null;
				}
			}

			if (!bgTopic) {
				if (isFirstRequest) {
					this.loadBackTopic(level, bgTopic, isFirstRequest);
				}
			} else {
				this.loadBackTopic(level, bgTopic, isFirstRequest);
			}

			this.loadOverTopics(level, ovTopics, isFirstRequest);

			GbZh.base.ViewerState.setRequestedTopic(topicName);
			GbZh.base.ViewerState.setActiveTopic(topicName);
			GbZh.base.ViewerState.setActiveTopicTitle(topicTitle);
			GbZh.base.ViewerState.setIsFirstRequest(false);
			topicStore.filters = oldFilter;
			topicStore.filter();
//HACK
			if (topicName === 'StaBevZH') {
				GbZh.base.ViewerState.csradius = Math.abs(GbZh.base.ViewerState.csradius);
			} else {
				GbZh.base.ViewerState.csradius = -Math.abs(GbZh.base.ViewerState.csradius);
				GbZh.base.ViewerState.fireEvent('doremovelayer', 'Umkreis', 'tool', false);
			}
//EHACK
		}

		Ext.resumeLayouts(true);
	},

	loadBackTopic: function (level, bgTopic, isFirstRequest) {
		if (bgTopic === null) {

			if (isFirstRequest) {
				var reqState = GbZh.base.ViewerState.getRequestState();
				var reqStateBgTopic = reqState.backRequestedTopic;
				var reqStateDefaultBgTopic = reqState.backDefaultTopic;

				if (reqStateBgTopic !== null) {
					bgTopic = reqStateBgTopic;
				} else {
					if (reqStateDefaultBgTopic !== null) {
						bgTopic = reqStateDefaultBgTopic;
					}
				}
			}
		}

		if (bgTopic !== null) {
			GbZh.base.ViewerState.fireEvent('topicselected', bgTopic, 'back', false);
		}
	},

	loadOverTopics: function (level, ovTopics, isFirstRequest) {
		var i, len;
		//TODO: Prüfen, ob alle Fälle ok, wenn zuerst alle Overlays entfernt werden
		GbZh.base.ViewerState.fireEvent('removerlays');

		if (isFirstRequest) {

			var reqState = GbZh.base.ViewerState.getRequestState();
			var reqStateOverTopics = reqState.overRequestedTopic;
			if (reqStateOverTopics) {
				if (!ovTopics) {
					ovTopics = reqStateOverTopics;
				} else {
					ovTopics = Ext.Array.clone(ovTopics);
					if (reqStateOverTopics) {
						for (i = 0, len = reqStateOverTopics.length; i < len; i += 1) {
							ovTopics.push(reqStateOverTopics[i]);
						}
					}
				}
			}
		}

		if (ovTopics) {
			var numOverlays = ovTopics.length;
			if (numOverlays > 0) {
				for (i = 0, len = numOverlays; i < len; i += 1) {
					//TODO: Parameter 'persistOverlay' sollte aus Daten gewonnen werden
					//GbZh.base.ViewerState.fireEvent('topicselected', ovTopics[i], 'over', persistOverlay);
					GbZh.base.ViewerState.fireEvent('topicselected', ovTopics[i], 'over', false);
				}
			}
		}
/* 
			else {
			//GbZh.base.ViewerState.fireEvent('removerlays');
		}
 */
	},

	onBtnOver: function (b, e, o) {
		this.changeLevelTo('overlay_layer');
	},

	onBtnMain: function (b, e, o) {
		this.changeLevelTo('main_layer');
	},

	onBtnBack: function (b, e, o) {
		this.changeLevelTo('background_layer');
	},

	onTxtFilter: function (field, newValue, oldValue, eOpts) {
		var store = this.getTopicsStore();
		var oldFilters = store.filters.clone();
		store.clearFilter(true);
		var idx = oldFilters.findIndex('property', 'keywords');
		if (idx > -1) {
			oldFilters.removeAt(idx);
		}
		store.filters = oldFilters;
		store.filter('keywords', new RegExp(newValue, 'i'));
	}

});
