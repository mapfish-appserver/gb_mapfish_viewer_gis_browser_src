/**
* File: app/view/GbHeaderToolbar.js
*
* GbHeaderToolbar
*/
Ext.define('Gb41.view.GbHeaderToolbar', {
	extend: 'Ext.toolbar.Toolbar',
	alias: 'widget.gbheadertoolbar',

	//ui: 'mainmenu',
	height: 25,

	// **** Texte ****
	/**
	* @cfg {String} btnHomeText
	* Text for home button.
	*/
	//<locale>
	btnHomeText: 'home',
	//</locale>

	/**
	* @cfg {String} btnHomeLink
	* Link for home button.
	*/
	//<locale>
	btnHomeLink: 'http://www.gis.zh.ch/en/',
	//</locale>

	/**
	* @cfg {String} btnHomeTip
	* Tip for home button.
	*/
	//<locale>
	btnHomeTip: 'homepage www.gis.zh.ch',
	//</locale>

	/**
	* @cfg {String} btnHelpText
	* Text for help button.
	*/
	//<locale>
	btnHelpText: 'help',
	//</locale>

	/**
	* @cfg {String} btnHelpLink
	* Link for help button.
	*/
	//<locale>
	btnHelpLink: 'http://www.gis.zh.ch/help/en/',
	//</locale>

	/**
	* @cfg {String} btnHelpTip
	* Tip for help button.
	*/
	//<locale>
	btnHelpTip: 'help GIS-Browser',
	//</locale>

	/**
	* @cfg {String} btnContactText
	* Text for contact button.
	*/
	//<locale>
	btnContactText: 'contact',
	//</locale>

	/**
	* @cfg {String} btnContactLink
	* Link for contact button.
	*/
	//<locale>
	btnContactLink: 'http://www.gis.zh.ch/contact/en/',
	//</locale>

	/**
	* @cfg {String} btnContactTip
	* Tip for contact button.
	*/
	//<locale>
	btnContactTip: 'contact',
	//</locale>

	/**
	* @cfg {String} btnFeedbackText
	* Text for feedback button.
	*/
	//<locale>
	btnFeedbackText: 'feedback',
	//</locale>

	/**
	* @cfg {String} btnFeedbackLink
	* Link for feedback button.
	*/
	//<locale>
	btnFeedbackLink: 'mailto://gisbrowser@bd.zh.ch',
	//</locale>

	/**
	* @cfg {String} btnFeedbackTip
	* Tip for feedback button.
	*/
	//<locale>
	btnFeedbackTip: 'mail to gisbrowser@bd.zh.ch',
	//</locale>

	/**
	* @cfg {String} btnMoreText
	* Text for 'more ...' button.
	*/
	//<locale>
	btnMoreText: 'more ...',
	//</locale>

	/**
	* @cfg {String} btnMoreTip
	* Tip for 'more ...' button.
	*/
	//<locale>
	btnMoreTip: 'more ...',
	//</locale>

	/**
	* @cfg {String} btnMoreMenuItem1Text
	* Text for 'more ... -> MenuItem1' button.
	*/
	//<locale>
	btnMoreMenuItem1Text: 'logout -> debug',
	//</locale>

	/**
	* @cfg {String} btnMoreMenuItem2Text
	* Text for 'more ... -> MenuItem1' button.
	*/
	//<locale>
	btnMoreMenuItem2Text: 'MenuItem2',
	//</locale>

	/**
	* @cfg {String} btnLoginText
	* Text for login button.
	*/
	//<locale>
	btnLoginText: 'Sign in',
	//</locale>

	/**
	* @cfg {String} btnLogoutText
	* Text for logout button.
	*/
	//<locale>
	btnLogoutText: 'logout - {user}',
	//</locale>

	/**
	* @cfg {String} btnLoginTip
	* Tip for login button.
	*/
	//<locale>
	btnLoginTip: 'login',
	//</locale>

	/**
	* @cfg {String} btnLogoutTip
	* Tip for logout button.
	*/
	//<locale>
	btnLogoutTip: '{user} logout',
	//</locale>


	initComponent: function () {
		var me = this;

		Ext.applyIf(me, {
			defaults: {
				xtype: 'button',
				//ui: 'mainmenubtn',
				//baseCls: 'mainmenubtn',
				//cls: 'mainmenubtn',
				border: 0,
				padding: 0,
				margins: 0,
				autoWidth: true
			},
			items: [
				{
					text: this.btnHomeText,
					href: this.btnHomeLink,
					//iconCls: 'home',
					tooltip: this.btnHomeTip
				},
				{
					xtype: 'tbseparator',
					border: 1
				},
				{
					text: this.btnContactText,
					href: this.btnContactLink,
					//iconCls: 'contact',
					tooltip: this.btnContactTip
				},
				
				{
					xtype: 'tbseparator',
					border: 1
				},
				{
					text: this.btnHelpText,
					href: this.btnHelpLink,
					tooltip: this.btnHelpTip
				},
				
				
/*				{
					xtype: 'tbseparator'
					//border: 1
				},
				{
					text: this.btnFeedbackText,
					href: this.btnFeedbackLink,
					//iconCls: 'mail',
					tooltip: this.btnFeedbackTip
				},
*/
				{
					xtype: 'tbseparator'
					//border: 1
				},
/*
				{
					text: this.btnMoreText,
					iconCls: 'service',
					menu: {
						xtype: 'menu',
						items: [
							{
								xtype: 'menuitem',
								text: this.btnMoreMenuItem1Text,
								listeners: {
									click: {
										fn: me.onMenuitemClick,
										scope: me
									}
								}
							},
							{
								xtype: 'menuitem',
								text: this.btnMoreMenuItem2Text
							},
							{
								xtype: 'menuitem',
								text: '...'
							}
						]
					}
				},
				{
					xtype: 'tbseparator',
					border: 1
				},
				{
					xtype: 'button',
					enableToggle: true,
					href: 'app-de.html?lang=de',
					pressed: true,
					text: 'de',
					toggleGroup: 'lang',
					tooltip: 'deutsch'
				},
				{
					xtype: 'button',
					enableToggle: true,
					text: 'fr',
					toggleGroup: 'lang',
					tooltip: 'français'
				},
				{
					xtype: 'button',
					enableToggle: true,
					text: 'it',
					toggleGroup: 'lang',
					tooltip: 'italiano'
				},
				{
					xtype: 'button',
					enableToggle: true,
					href: 'app-en.html?lang=en',
					text: 'en',
					toggleGroup: 'lang',
					tooltip: 'english'
				},
				{
					xtype: 'tbseparator',
					border: 1
				},
*/
				{
					xtype: 'tbspacer',
					flex: 1,
					border: 1
				},
				{
					itemId: 'btnLoginLogout',
					href: 'Javascript: void(0);',
					hrefTarget: '_self',
					//iconCls: 'user',
					tooltip: this.btnLoginTip,
					text: this.btnLoginText
				}
			]
		});

		me.callParent(arguments);
	},

	onMenuitemClick: function (item, e, options) {
		GbZh.base.ViewerState.fireEvent('dologout');
	}
});