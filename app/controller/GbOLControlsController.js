/**
 * File: app/controller/GbOLController.js
 *
 * Manage all OpenLayers tool controls to activate controls for selected tool only
 */
Ext.define('Gb41.controller.GbOLControlsController', {
	extend: 'Ext.app.Controller',
	requires: [],
	views: [],
	refs: [
		{
			ref: 'myMapPanel',
			selector: '#gbZhMapPanel'
		}
	],

	map: null,
	controls: {},

	init: function () {
		GbZh.base.ViewerState.on({
			// events
			registerolcontrols: {
				fn: this.onRegisterOlControls,
				scope: this
			},
			unregisterolcontrols: {
				fn: this.onUnregisterOlControls,
				scope: this
			},
			activateolcontrols: {
				fn: this.onActivateOlControls,
				scope: this
			}
		});
	},

	onLaunch: function () {
		// get map from panel
		if (this.getMyMapPanel() != null) {
			this.map = this.getMyMapPanel().map;
		}
	},

	onRegisterOlControls: function (groupName, toolName, olControls) {
		if (this.controls[groupName] == null) {
			this.controls[groupName] = {};
		}
		this.controls[groupName][toolName] = olControls;
	},

	onUnregisterOlControls: function (groupName, toolName) {
		var i, len,
			controls = this.controls[groupName][toolName];
		if (controls != undefined) {
			for (i = 0, len = controls.length; i < len; i += 1) {
				controls[i].deactivate();
			}
			delete this.controls[groupName][toolName];
		}
	},

	onActivateOlControls: function (groupName, toolName) {
		var group, tool, i, len, controls;
		// deactivate other controls
		for (group in this.controls) {
			if (this.controls.hasOwnProperty(group)) {
				for (tool in this.controls[group]) {
					if (this.controls[group].hasOwnProperty(tool)) {
						controls = this.controls[group][tool];
						for (i = 0, len = controls.length; i < len; i += 1) {
							controls[i].deactivate();
						}
					}
				}
			}
		}

		// activate requested controls
		if (this.controls[groupName] != null
				&& this.controls[groupName][toolName] != null) {
			controls = this.controls[groupName][toolName];
			for (i = 0, len = controls.length; i < len; i += 1) {
				controls[i].activate();
			}
		}
	}
});
