/**
 * File: app/controller/GbInfoTabPanelController.js
 *
 */

Ext.define('Gb41.controller.GbInfoTabPanelController', {
	extend: 'Ext.app.Controller',

	views: [
		'GbInfoTabPanel'
	],

	refs: [
		{
			ref: 'infoTabPanel',
			selector: 'viewport > gbinfotabpanel'
		}
	],

	// **** Texte ****
	/**
	* @cfg {String} btnTextSignin
	* Text for button Sign in.
	*/
	//<locale>
	btnPrint: 'Print',
	//</locale>

	// lookup table to get edit panel class name for active topic
	editPanelClasses: {},

	init: function () {
/*
		this.control({
			"#btnLoginLogout": {
				click: this.onBtnLoginLogoutClick
			}
		});
 */
		GbZh.base.ViewerState.on({
			redliningshow: {
				fn: this.onRedliningShow,
				scope: this
			},
			infoshow: {
				fn: this.onInfoShow,
				scope: this
			},
			identifyclicked: {
				fn: this.onInfoShow,
				scope: this
			},
			printactivate: {
				fn: this.onPrintActivate,
				scope: this
			},
			editactivate: {
				fn: this.onEditActivate,
				scope: this
			},
			exportactivate: {
				fn: this.onExportActivate,
				scope: this
			},
			permalinkactivate: {
				fn: this.onPermalinkActivate,
				scope: this
			},
			registereditpanelclass: {
				fn: this.onRegisterEditPanelClass,
				scope: this
			},
			topicready: {
				fn: this.onTopicReady,
				scope: this
			}
		});
	},

	onLaunch: function () {
		//LOG console.log('GbInfoTabPanelController launch');

		// TODO: move to Gb41.view.GbEditPanel
		GbZh.base.ViewerState.fireEvent('registereditpanelclass', 'FnsLWeditZH', 'Gb41.view.GbEditPanel');
	},

	onInfoShow: function (tool) {
		var infoTabPanel = this.getInfoTabPanel();
		infoTabPanel.items.get('MyGbInfoPanel').show();
		infoTabPanel.items.get('MyGbInfoPanel').chooseTool(tool);
		infoTabPanel.setActiveTab('MyGbInfoPanel');
	},

	onRedliningShow: function () {
		var infoTabPanel = this.getInfoTabPanel();
		var mcc = this.getController('GbMapContentController');
		if (typeof (infoTabPanel.items.get('MyGbRedliningPanel')) === 'undefined') {
			var pp = Ext.create('Gb41.view.GbRedliningPanel', {
				url: GbZh.base.ViewerState.serverUrl,
				itemId: 'MyGbRedliningPanel',
				title: 'Zeichnen',
				hidden: false,
				closable: true,
				mapContentController: mcc
//				map: mc.getMyMapPanel().map
			});
			infoTabPanel.add(pp);
			pp.show();
		} else {
			infoTabPanel.items.get('MyGbRedliningPanel').show();
		}
		infoTabPanel.setActiveTab('MyGbRedliningPanel');
	},

	onPrintActivate: function () {
		var infoTabPanel = this.getInfoTabPanel();
		var mc = this.getController('GbMapController');
		if (typeof (infoTabPanel.items.get('MyGbPrintPanel')) === 'undefined') {
			var pp = Ext.create('Gb41.view.GbPrintPanel', {
				url: GbZh.base.ViewerState.serverUrl,
				itemId: 'MyGbPrintPanel',
				title: 'Print',
				hidden: false,
				closable: true,
				mapPanel: mc.getMyMapPanel()
			});
			infoTabPanel.add(pp);
//			pp.on('click', this.onDestroy, this);
			pp.show();
		} else {
			infoTabPanel.items.get('MyGbPrintPanel').show();
		}
		infoTabPanel.setActiveTab('MyGbPrintPanel');
		//		GbZh.base.ViewerState.fireEvent('printextenttoggled', true);
	},

	onEditActivate: function () {
		var infoTabPanel = this.getInfoTabPanel();
		var mc = this.getController('GbMapController');
		if (typeof (infoTabPanel.items.get('MyGbEditPanel')) === 'undefined') {
			// instantiate edit panel class depending on active topic
			var editPanelClassName = this.editPanelClasses[GbZh.base.ViewerState.activeTopic];
			if (editPanelClassName != null) {
				var pp = Ext.create(editPanelClassName, {
					itemId: 'MyGbEditPanel',
					title: 'Erfassen',
					hidden: false,
					closable: true,
					map: mc.getMyMapPanel().map // FIXME: map only used by LiWa Gb41.view.GbEditPanel
				});
				infoTabPanel.add(pp);
				pp.show();
			} else {
				// no edit panel defined for active topic
				return;
			}
		} else {
			infoTabPanel.items.get('MyGbEditPanel').show();
		}
		infoTabPanel.setActiveTab('MyGbEditPanel');
	},

	onExportActivate: function () {
		var infoTabPanel = this.getInfoTabPanel();
		var mc = this.getController('GbMapController');
		if (typeof (infoTabPanel.items.get('MyGbExportPanel')) === 'undefined') {
			var pp = Ext.create('Gb41.view.GbExportPanel', {
//				url: GbZh.base.ViewerState.serverUrl,
				itemId: 'MyGbExportPanel',
				title: 'Export',
				hidden: false,
				closable: true,
				map: mc.getMyMapPanel().map
			});
			infoTabPanel.add(pp);
			pp.show();
		} else {
			infoTabPanel.items.get('MyGbExportPanel').show();
		}
		infoTabPanel.setActiveTab('MyGbExportPanel');
	},

	onPermalinkActivate: function () {
		var infoTabPanel = this.getInfoTabPanel();
		var mcc = this.getController('GbMapContentController');
		if (typeof (infoTabPanel.items.get('MyGbPermalinkPanel')) === 'undefined') {
			var pp = Ext.create('Gb41.view.GbPermalinkPanel', {
				url: GbZh.base.ViewerState.serverUrl,
				itemId: 'MyGbPermalinkPanel',
				title: 'Link',
				hidden: false,
				closable: true,
				mapContentController: mcc
//				map: mc.getMyMapPanel().map
			});
			infoTabPanel.add(pp);
			pp.show();
		} else {
			infoTabPanel.items.get('MyGbPermalinkPanel').show();
		}
		infoTabPanel.setActiveTab('MyGbPermalinkPanel');
	},

	onRegisterEditPanelClass: function (topicName, editPanelClassName) {
		this.editPanelClasses[topicName] = editPanelClassName;
	},

	onTopicReady: function () {
		// close edit panel
		var infoTabPanel = this.getInfoTabPanel();
		if (typeof (infoTabPanel.items.get('MyGbEditPanel')) != 'undefined') {
			infoTabPanel.items.get('MyGbEditPanel').close();
		}
	}
});
