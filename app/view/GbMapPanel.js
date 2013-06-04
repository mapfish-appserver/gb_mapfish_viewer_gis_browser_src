/**
 * File: app/view/GbMapPanel.js
 *
 */

Ext.define('Gb41.view.GbMapPanel', {
	extend: 'GeoExt.panel.Map',
	alias: 'widget.gbmappanel',
    requires: [
        'Gb41.view.GbSwissnames',
        'Gb41.view.GbMousePosAndSetCenter',
//        'Gb41.view.GbScaleCombo'
        'Gb41.view.GbScaleTextField'
    ],

	title: 'GIS-ZH',

	txtToolTipPrev: 'previous',
	txtToolTipNext: 'next',
	txtToolTipDefaultNavigation: 'default navigation',
	txtToolTipDistance: 'distance',
	txtToolTipArea: 'area',
	txtToolTipRedlining: 'redlining',
	txtToolTipExport: 'export',
	txtToolTipEdit: 'edit',
	txtToolTipPrint: 'print',
	txtToolTipPermalink: 'permalink',

	initComponent: function () {
		var me = this;

		Ext.applyIf(me, {
			dockedItems: [
				{
					xtype: 'toolbar',
					dock: 'top',
					items: [
						{
							xtype: 'container',
							itemId: 'history',
							items: [
								{
									xtype: 'button',
									//text: 'prev',
									itemId: 'btnPrev',
									iconCls: 'prev-icon',
									tooltip: this.txtToolTipPrev
								},
								{
									xtype: 'button',
									//text: 'next',
									itemId: 'btnNext',
									iconCls: 'next-icon',
									tooltip: this.txtToolTipNext
								}
							]
						},
						{
							xtype: 'tbspacer',
							//width: 15
							flex: 0.2
						},
						{
							xtype: 'container',
							itemId: 'maptools',
							items: [
								{
									xtype: 'button',
									itemId: 'btnDefaultNavigation',
									iconCls: 'defaultNavigation-icon',
									//text: 'default',
									enableToggle: true,
									toggleGroup: 'tools',
									pressed: true,
									tooltip: this.txtToolTipDefaultNavigation
								},
								{
									xtype: 'button',
									itemId: 'btnDistance',
									iconCls: 'distance-icon',
									//text: 'distance',
									enableToggle: true,
									toggleGroup: 'tools',
									tooltip: this.txtToolTipDistance
								},
								{
									xtype: 'button',
									itemId: 'btnArea',
									iconCls: 'area-icon',
									//text: 'area',
									enableToggle: true,
									toggleGroup: 'tools',
									tooltip: this.txtToolTipArea
								},
								{
									xtype: 'button',
									itemId: 'btnRedlining',
									iconCls: 'pen-icon',
									//text: 'Print',
									enableToggle: true,
									toggleGroup: 'tools',
									tooltip: this.txtToolTipRedlining
								}
							]
						},
						{
							xtype: 'tbspacer',
							flex: 2
						},
/*						
						{
							xtype: 'label',
							itemId: 'lblDistanceArea',
							id: 'lblDistanceArea',
							html: 'click to begin',
							hidden: true,
							flex: 1
						},
						{
							xtype: 'tbspacer',
							flex: 1
						},
*/
						{
							xtype: 'container',
							itemId: 'advacedtools',
							items: [
								{
									xtype: 'button',
									itemId: 'btnExport',
									iconCls: 'select-icon',
									//text: 'select',
									enableToggle: true,
									toggleGroup: 'tools',
									tooltip: this.txtToolTipExport
								},
								{
									xtype: 'button',
									itemId: 'btnEditPanel',
									iconCls: 'edit-icon',
									//text: 'edit',
									enableToggle: true,
									toggleGroup: 'tools',
									tooltip: this.txtToolTipEdit
								}
							]
						},
						{
							xtype: 'tbspacer',
							flex: 0.2
						},
						{
							xtype: 'container',
							items: [
								{
									xtype: 'button',
									itemId: 'btnPrint',
									iconCls: 'print-icon',
									//text: 'Print',
									enableToggle: true,
									toggleGroup: 'tools',
									tooltip: this.txtToolTipPrint
								},
								{
									xtype: 'button',
									itemId: 'btnLink',
									iconCls: 'link-icon',
									//text: 'Link',
									enableToggle: true,
									toggleGroup: 'tools',
									tooltip: this.txtToolTipPermalink
								}
							]
						}
					]
				},
				{
					xtype: 'toolbar',
					dock: 'bottom',
					items: [
						{
							xtype: 'gb-mouseposandsetcenter',
							map: this.map,
							emptyString: 'Koordinate eingeben',
							width: 120
						},
						{
							xtype: 'tbspacer',
							flex: 1
						},
						{
	//						xtype: 'gb-scalecombo',
							xtype: 'gb-scaletextfield',
							map: this.map,
							hideTrigger: true,
							width: 160
						}
						
					]
				}
			]
		});

		me.callParent(arguments);
	}

});