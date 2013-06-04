/**
 * File: app/view/GbHeader.js
 *
 * Display in GB fullversion
 */
Ext.define('Gb41.view.GbHeader', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.gbheader',
	requires: [
		'Gb41.view.GbHeaderToolbar'
	],

	// Texte
	/**
	* @cfg {String} imgHeaderLogo
	* Source url for logo image.
	*/
	//<locale>
	imgLogo: '../../img/zhlion.gif',
	//</locale>

	/**
	* @cfg {String} htmlMapProvider
	* Link for home button.
	*/
	//<locale>
	htmlMapProvider: 'Canton of Zurich',
	//</locale>

	height: 65,
	minHeight: 65,
	layout: {
		align: 'stretchmax',
		type: 'hbox'
	},

	initComponent: function () {
		var me = this;

		Ext.applyIf(me, {
			items: [
				{
					xtype: 'image',
					border: 0,
					height: 37,
					itemId: 'imgLogo',
					margin: 0,
					width: 66,
					cls: 'headerlogo',
					src: this.imgLogo
				},
				{
					xtype: 'component',
					html: this.htmlMapProvider,
					itemId: 'compKtZh',
					cls: 'headerzh',
					margins: '20 0 0 3'
				},
				{
					xtype: 'component',
					html: 'GIS-Browser',
					itemId: 'compGb',
					cls: 'headergb',
					margins: '20 5 0 5'
				},
				{
					xtype: 'component',
					itemId: 'compSpacer',
					flex: 1
				},
				{
					xtype: 'label',
					html: 'Landeskarten, Übersichtsplan',
					itemId: 'compTopicTitle',
					cls: 'topicTitle',
					tpl: [
						'<h1>{topicTitle}</h1>'
					],
					autoScroll: true,
					margins: '10 5 0 0'
				}
			]
/*			,
			dockedItems: [
				{
					xtype: 'gbheadertoolbar',
					itemId: 'MyGbHeaderToolbar',
					flex: 1,
					dock: 'bottom'
				}
			]*/
		});

		me.callParent(arguments);
	}

});