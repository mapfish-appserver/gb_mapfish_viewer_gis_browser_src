/**
 * File: app/view/Viewport.js
 *
 */

Ext.define('Gb41.view.Viewport', {
	extend: 'Gb41.view.GbViewport',
	renderTo: Ext.getBody(),
	requires: [
		// ************* missing files in jsb3-file (sencha builder)
		'Ext.layout.container.Border',
		'Ext.grid.column.Boolean',
		'Ext.grid.column.Number',
		'Ext.grid.column.Template',
		'Ext.layout.container.Accordion',
		'Ext.toolbar.Spacer',
		'Ext.button.Split',
		'Ext.form.Label',
		// ************* missing files in jsb3-file (sencha builder)
		'Gb41.view.GbViewport'
	]
});