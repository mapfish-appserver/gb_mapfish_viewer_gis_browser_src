/**
 * File: app/controller/GbHeaderController.js
 *
 */

Ext.define('Gb41.controller.GbHeaderController', {
	extend: 'Ext.app.Controller',

	views: [
		'GbHeaderZH',
		'GbHeaderToolbar'
	],

	refs: [
		{
			ref: 'btnLoginLogout',
			selector: '#btnLoginLogout'
		},
		{
			ref: 'compTopicTitle',
			selector: '#compTopicTitle'
		},
		{
			ref: 'gbHeaderZH',
			selector: 'viewport > gbheaderzh'
		}
	],

	// **** Texte ****
	/**
	* @cfg {String} btnTextSignin
	* Text for button Sign in.
	*/
	//<locale>
	btnTextSignin: 'Sign in',
	//</locale>

	/**
	* @cfg {String} btnTextLogout
	* Text button Logout.
	*/
	//<locale>
	btnTextLogout: 'Logout --- ',
	//</locale>

	/**
	* @cfg {String} user
	* Current user login.
	*/
	//<locale>
	user: null,
	//</locale>

	init: function () {
		this.control({
			'#btnLoginLogout': {
				click: this.onBtnLoginLogoutClick
			}
		});

		GbZh.base.ViewerState.on({
			userchanged: {
				fn: this.onUserChanged,
				scope: this
	/*			},
			topicready: {
				fn: this.onTopicReady,
				scope: this*/
			}
		});
	},

	onLaunch: function () {
		//LOG console.log('GbHeaderController launch');
		this.user = GbZh.base.ViewerState.requestState.user;
		if (this.user != undefined) {
			this.getBtnLoginLogout().setText(this.btnTextLogout);
		}

		var collapseHeader = new Ext.util.DelayedTask(function () {
			this.getGbHeaderZH().collapse();
		},this);
		collapseHeader.delay(10000);
	},

	onBtnLoginLogoutClick: function (button, e, options) {
		if (button.text === this.btnTextSignin) {
			GbZh.base.ViewerState.fireEvent('showsigninform');
		} else {
						this.user = null;
			GbZh.base.ViewerState.fireEvent('dologout');
		}
	},

	onUserChanged: function (params, scope) {
				if (params !== null) {
					this.user = params.user.login;
				}
		var btnText = (this.user != null) ? this.btnTextLogout + this.user : this.btnTextSignin;
		var myButton = this.getBtnLoginLogout();
		myButton.setText(btnText);
	},

	onTopicReady: function (topicName, topicTitle, topicLevel, persistOverlay) {
		if (topicLevel === 'main') {
			this.getCompTopicTitle().setText(topicTitle);
			this.getGbHeader().doLayout();
		}
	}

});
