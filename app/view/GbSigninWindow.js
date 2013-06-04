/**
* File: app/view/GbSigninWindow.js
*
*/

Ext.define('Gb41.view.GbSigninWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.gbsigninwindow',

	frame: false,
	height: 155,
	width: 333,
	closable: false,
	title: 'Sign in',
	modal: true,

	// **** Texte ****
	/**
	* @cfg {String} txtUsername
	* Text for textfield userlogin: label and emptytext.
	*/
	//<locale>
	txtUsername: 'Username',
	//</locale>

	/**
	* @cfg {String} txtPassword
	* Text for textfield userpassword: label and emptytext.
	*/
	//<locale>
	txtPassword: 'Password',
	//</locale>

	/**
	* @cfg {String} btnCancel
	* Text for cancel button.
	*/
	//<locale>
	btnCancel: 'Cancel',
	//</locale>
	
	/**
	* @cfg {String} btnSignin
	* Text for Signin button.
	*/
	//<locale>
	btnSignin: 'Sign in',
	//</locale>
	
	/**
	* @cfg {String} htmlPwRecovery
	* HTML text and link for password recovery.
	*/
	//<locale>
	htmlPwRecovery: '<a href="#" >Can\'t access your account?</a>',
	//</locale>

	title: this.btnSignin,
	
	
	initComponent: function() {
		var me = this;

		Ext.applyIf(me, {
			items: [
				{
					xtype: 'form',
					itemId: 'SigninForm',
					bodyPadding: 10,
					items: [
						{
							xtype: 'textfield',
							width: 300,
							maintainFlex: false,
							name: 'user[login]',
							fieldLabel: this.txtUsername,
							labelWidth: 80,
							allowBlank: false,
							emptyText: this.txtUsername,
							enableKeyEvents: true,
							minLength: 3,
							selectOnFocus: true
						},
						{
							xtype: 'textfield',
							width: 300,
							inputType: 'password',
							name: 'user[password]',
							fieldLabel: this.txtPassword,
							hideLabel: false,
							labelWidth: 80,
							emptyText: this.txtPassword,
							enableKeyEvents: true,
							selectOnFocus: true
						},
						{
							xtype: 'fieldcontainer',
							height: 25,
							width: 300,
							layout: {
								align: 'stretch',
								type: 'hbox'
							},
							fieldLabel: ' ',
							hideLabel: false,
							labelSeparator: ' ',
							labelWidth: 80,
							items: [
								{
									xtype: 'button',
									text: this.btnCancel,
									action: 'cancel',
									flex: 1
									// listeners: {
									// 	click: {
									// 		fn: me.onButtonClick,
									// 		scope: me
									// 	}
									// }
								},
								{
									xtype: 'button',
									text: this.btnSignin,
									action: 'signin',
									flex: 1
								}
							]
						}
					]
				},
				{
					xtype: 'container',
					html: this.htmlPwRecovery
				}
			]
		});

		me.callParent(arguments);
	},

	onButtonClick: function(button, e, options) {
		this.doClose();
	}

});