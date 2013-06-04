/**
* File: app/controller/GbSigninController.js
*
*/

Ext.define('Gb41.controller.GbSigninController', {
	extend: 'Ext.app.Controller',

	views: [
		'GbSigninWindow'
	],

	refs: [
		{
			ref: 'txtUsername',
			selector: 'gbsigninwindow #username'
		}
	],

	// **** Texte ****
	/**
	* @cfg {String} btnTextSignin
	* Text for button Sign in.
	*/
	//<locale>
	alertTitle: 'Login failed',
	//</locale>

	/**
	* @cfg {String} errText
	* Text in alert window if login failed.
	*/
	//<locale>
	alertText: 'Username or password not correct.<br />Please try again.',
	//</locale>


	init: function () {
		this.control({
			"gbsigninwindow button[action=signin]": {
				click: this.onSignin
			},
			"gbsigninwindow button[action=cancel]": {
				click: this.onCancel
			},
			"gbsigninwindow textfield": {
				specialkey: this.onTextfieldSpecialkey
			}
		});

		GbZh.base.ViewerState.on({
			showsigninform: {
				fn: this.onShowsigninform
			},
			dologout: {
				fn: this.onDologout,
				scope: this
			}
		});
	},

	onLaunch: function () {
		//LOG console.log('GbSigninController launch');
	},

	onShowsigninform: function () {
		var win = Ext.create('Gb41.view.GbSigninWindow', {}).show();
		win.down('textfield').focus('', 10);
	},

	onSignin: function (button, e, options) {
		this.doSignin(button);
	},

	onCancel: function (button, e, options) {
		this.doCancel(button);
	},

	onTextfieldSpecialkey: function (field, e, options) {
		if (e.getKey() === e.ENTER) {
			this.doSignin(field);
		}
	},

	doCancel: function (formElement) {
		var form = formElement.up('form');
		var me = this;
		form.ownerCt.doClose();
		GbZh.base.ViewerState.fireEvent('gbmaskoff', null);
	},

	doSignin: function (formElement) {
		var form = formElement.up('form');
		var me = this;
		form.submit({
			clientValidation: true,
			url: GbZh.base.ViewerState.signinUrl,

			success: function (form, action) {
//				Ext.util.Cookies.set("gbuser", Ext.encode(action.result));
				form.owner.ownerCt.doClose();
				GbZh.base.ViewerState.fireEvent('userchanged', action.result);
			},
			failure: function (form, action) {
				if (action.failureType === 'client') {
					me.alertText = action.failure.form._fields.items[0].activeErrors[0];
				}

				Ext.Msg.alert(me.alertTitle, me.alertText, function (btn, text) {
					if (btn === 'ok') {
						form.findField('user[login]').focus(true, 10);
					}
				});
			}
		});
	},

	onDologout: function () {
		// Ext.util.Cookies.clear('gbuser');
		// GbZh.base.ViewerState.fireEvent('userchanged', null);
		// *************  Do we need serverside code? YES
		Ext.Ajax.request({
			url: '/session/sign_out',
			success: function (response, opts) {
//				Ext.util.Cookies.clear('gbuser');
				GbZh.base.ViewerState.fireEvent('userchanged', null);
			},
			failure: function (response, opts) {
//				Ext.util.Cookies.clear('gbuser');
				GbZh.base.ViewerState.fireEvent('userchanged', null);
			}
		});
	}
});
