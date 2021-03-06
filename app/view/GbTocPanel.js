/*
 * File: app/view/GbTocPanel.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.0.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */


Ext.define('Gb41.view.GbTocPanel', {
	extend: 'Ext.tree.Panel',
	alias: 'widget.gbtocpanel',
	requires: ['Gb41.model.WmsLayer'],

	collapsed: false,
	title: 'Ebenen',
	rootVisible: false,
	hideHeaders: true,
//	useArrows: true,

	columns: [
		{
			xtype: 'treecolumn',
			text: 'Layer',
			flex: 2,
			sortable: false,
			dataIndex: 'toclayertitle'
		}, {
			xtype: 'templatecolumn',
			text: ' ',
			flex: 0.2,
			sortable: false,
			dataIndex: 'niveau',
			align: 'center',
			tpl: Ext.create('Ext.XTemplate', '<div class="hiddenscales">{niveau:this.removeOlLayer}</div>', {
				removeOlLayer: function (v) {
					if (v === 0) {
						var a = this.fn.arguments[1];
						var ap = a.parentId;
                                                // FIXME: no remove button for edit layers
						if (ap === 'tool' ||
								ap === 'over' ||
								ap === 'back') {
							return '<a href="javascript:void(0)" onclick="GbZh.base.ViewerState.fireEvent(\'doremovelayer\', \'' + a.topic + '\', \'' + ap +  '\', false)"><img src="/img/cancel.png" alt="Remove Layer"></a>';
						}
					}
				}
			})
		}, {
			xtype: 'templatecolumn',
			text: 'Massstab',
			flex: 1,
			sortable: false,
			dataIndex: 'minscale',
			align: 'center',
			tpl: Ext.create('Ext.XTemplate', '<div class="hiddenscales">{minscale:this.writeMin} {maxscale:this.writeMax}</div>{topic:this.opacitySlider}', {
				writeMin: function (v) {
					if (v === undefined || v === 0) {
						return '';
					}
					return (v !== "") ? (v + ' - ') : '';
				},
				writeMax: function (v) {
					if (v === undefined || v === 0) {
						return '';
					}
					return v;
				},
                opacitySlider: function (v) {
                    if (v !== "") {
                        var a = this.fn.arguments[1];
                        if (a.depth === 2) {
                            return '<div class="addopacityslider" data-topic="' + v + '"></div>';
                        }
                    }
                }
			})
		}],

	initComponent: function () {
		var me = this;

		Ext.applyIf(me, {
			viewConfig: {
				preserveScrollOnRefresh: true
			}
		});
		this.store = Ext.create('Ext.data.TreeStore', {
			model: 'Gb41.model.WmsLayer',
			proxy: {
				type: 'memory'
			},
			root: {
				expanded: true,
				children: [
					{
						toclayertitle: 'Werkzeuge',
						level: 'tool',
						leaf: false,
						niveau: -10,
						expanded: true,
						checked: true,
						id: 'tool'
					},
					{
						toclayertitle: 'Überlagerung',
						level: 'over',
						cls: 'levelnode',
						leaf: false,
						niveau: -10,
						expanded: true,
						checked: true,
						id: 'over'
					},
					{
						toclayertitle: 'Thema',
						level: 'main',
						cls: 'levelnode',
						leaf: false,
						niveau: -1,
						expanded: true,
						checked: true,
						id: 'main'
					},
					{
						toclayertitle: 'Hintergrund',
						level: 'back',
						cls: 'levelnode',
						leaf: false,
						niveau: -1,
						expanded: true,
						checked: true,
						id: 'back'
					}
				]
			}
		});

		me.callParent(arguments);
	}

});