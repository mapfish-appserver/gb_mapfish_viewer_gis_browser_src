/**
 * File: app/view/GbParzSearch.js
 *
 */

Ext.define('Gb41.view.GbParzSearch', {
	extend: 'Ext.form.Panel',
	alias: 'widget.gbparzsearch',
    requires: ["Gb41.view.GbParcels"],

	bodyPadding: 10,
	titleCollapse: false,

	// **** Texte ****
	/**
	* @cfg {String} title
	* Panel title of plot form.
	*/
	//<locale>
	title: 'parcel',
	//</locale>		

	initComponent: function() {
		var me = this;
		Ext.applyIf(me, {
			items: [
				{
					xtype: 'gbparcels',
					itemId: 'MyGbParcels'
				}
			]
		});

		me.callParent(arguments);
	}

});

