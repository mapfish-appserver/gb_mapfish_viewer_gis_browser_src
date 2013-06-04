/**
 * File: app/view/GbPrintPanel.js
 *
 */

Ext.define('Gb41.view.GbPrintPanel', {
	extend: 'Ext.form.Panel',
	alias: 'widget.gbprintpanel',
	requires: [
		'GeoExt.plugins.PrintPageField',
		'GeoExt.plugins.PrintProviderField',
		'Ext.form.FieldSet',
		'Ext.form.FieldContainer'
	],

	//height: 250,
	//width: 400,
	bodyPadding: 10,
	title: 'Print',
	txtDescription: 'Description',
	txtTitle: 'Title',
	txtComment: 'Comments',
	txtPageSetup: 'Page Setup',
	txtLayout: 'Layout',
	txtResolution: 'Resolution',
	txtScale: 'Scale',
	txtRotation: 'Rotation',
	txtOutputFormat: 'Data Format',
	txtResetButton: 'Reset',
	txtCreateButton: 'Create ',
	mapPanel: null,


	initComponent: function () {
		var me = this;
		var printPage = this.mapPanel.plugins[0].page;
		var printProvider = this.mapPanel.plugins[0].printProvider;
		var mapPanel = this.mapPanel;

		Ext.applyIf(me, {
			items: [
				{
					xtype: 'fieldset',
					title: this.txtDescription,
					items: [
						{
							xtype: "textfield",
							name: "user_title",
							value: "",
							fieldLabel: this.txtTitle,
							plugins: Ext.create('GeoExt.plugins.PrintPageField', {
								printPage: printPage
							}),
							anchor: '100%'
						},
						{
							xtype: "textarea",
							name: "user_comment",
							value: "",
							fieldLabel: this.txtComment,
							plugins: Ext.create('GeoExt.plugins.PrintPageField', {
								printPage: printPage
							}),
							anchor: '100%'
						}
					]
				},
				{
					xtype: 'fieldset',
					title: this.txtPageSetup,
					items: [
						{
							xtype: "combo",
							store: printProvider.layouts,
							displayField: "name",
							forceSelection: true,
							fieldLabel: this.txtLayout,
							typeAhead: true,
							queryMode: "local",
							triggerAction: "all",
							plugins: Ext.create('GeoExt.plugins.PrintProviderField', {
								printProvider: printProvider
							}),
							anchor: '100%'
						},
						{
							xtype: "combo",
							store: printProvider.dpis,
							displayField: "name",
							forceSelection: true,
							fieldLabel: this.txtResolution,
							displayTpl: Ext.create('Ext.XTemplate', '<tpl for=".">{name} dpi</tpl>'),
							tpl: '<tpl for="."><li role="option" class="x-boundlist-item">{name} dpi</li></tpl>',
							typeAhead: true,
							queryMode: "local",
							triggerAction: "all",
							plugins: Ext.create('GeoExt.plugins.PrintProviderField', {
								printProvider: printProvider
							}),
							anchor: '100%'
						},
						{
							xtype: "combo",
							store: printProvider.scales,
							displayField: "name",
							forceSelection: true,
							fieldLabel: this.txtScale,
							typeAhead: true,
							queryMode: "local",
							triggerAction: "all",
							plugins: Ext.create('GeoExt.plugins.PrintPageField', {
								printPage: printPage
							}),
							anchor: '100%'
						},
						{
							xtype: "numberfield",
							name: "rotation",
							fieldLabel: this.txtRotation,
							maxValue: 180,
							minValue: -180,
							plugins: Ext.create('GeoExt.plugins.PrintPageField', {
								printPage: printPage
							}),
							anchor: '100%'
						},
						{
							xtype: "combo",
							store: printProvider.outputFormats,
							id: 'outputFormats',
							name: "outputformat",
							displayField: "name",
							forceSelection: true,
							fieldLabel: this.txtOutputFormat,
							typeAhead: true,
							queryMode: "local",
							triggerAction: "all",
							listeners: {
								select: function (combo, records, opts) {
									var printProvider = this.mapPanel.plugins[0].printProvider;
									printProvider.setOutputFormat(records[0]);
									var ft = records[0].get('name');
									Ext.getCmp('createbutton').setText(this.txtCreateButton + ft.toUpperCase());
								},
								scope: this
							},
							anchor: '100%'
						}
					]
				},
				{
					xtype: 'fieldcontainer',
					height: 24,
					layout: {
						align: 'stretch',
						type: 'hbox'
					},
					items: [
						{
							xtype: 'button',
							text: this.txtResetButton,
							handler: function (b, e) {
								printPage.setRotation(0);
								printPage.fit(mapPanel, {mode: 'screen'});
							},
							flex: 1
						},
						{
							xtype: 'splitter',
							width: 10
						},
						{
							xtype: 'button',
							text: this.txtCreateButton,
							id: 'createbutton',
							handler: function () {
								Ext.apply(printPage.customParams, {
									header_img: 'http://127.0.0.1/images/print_logo.gif',
									topic_title: GbZh.base.ViewerState.getActiveTopicTitle(),
									topic: GbZh.base.ViewerState.getActiveTopic()
								});
								printProvider.print(mapPanel, printPage);
							},
							flex: 1
						}
					]
				}
			]
		});

		this.on({
			close: {
				fn: this.onClose,
				scope: this
			}
		});


		me.callParent(arguments);
		this.setFirstValue('outputFormats');
        Ext.getCmp('createbutton').setText(this.txtCreateButton + Ext.getCmp('outputFormats').store.getAt(0).get('name').toUpperCase());
		GbZh.base.ViewerState.on('modeactivate', this.onModeActivate, this, this);
	},

	setFirstValue: function (combobox) {
		var c = Ext.getCmp(combobox);
		c.setValue(c.store.getAt(0));
	},

	onModeActivate: function (newMode, tool) {
		if (newMode === 'gbprint') {
			this.mapPanel.plugins[0].show();
		} else {
			this.mapPanel.plugins[0].hide();
		}
	},

	onClose: function (p) {
		GbZh.base.ViewerState.fireEvent('printdeactivate');
	}

});