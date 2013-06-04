/**
 * File: app/view/GbAddrSearch.js
 *
 */

Ext.define('Gb41.view.GbAddrSearch', {
	extend: 'Ext.form.Panel',
	alias: 'widget.gbaddrsearch',

	bodyPadding: 10,
	titleCollapse: false,

	// **** Texte ****
	/**
	* @cfg {String} title
	* Panel title of address form.
	*/
	//<locale>
	title: 'address',
	//</locale>	
	
	initComponent: function() {
		var me = this;
		
		Ext.applyIf(me, {
			items: [
				{
					xtype: 'gbswissnames',
					itemId: 'MyGbSwissnames'
				}
			]
		});

		me.callParent(arguments);
	}

});