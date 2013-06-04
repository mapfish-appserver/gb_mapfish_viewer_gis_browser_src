Ext.define('Gb41.view.edit.FormNiDienstbarkeitenF', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.editFormNiDienstbarkeitenF',

	layout: {
		type: 'auto'
	},
	bodyPadding: 10,
	title: 'Fläche',

	initComponent: function() {
		var me = this;

		Ext.applyIf(me, {
			dockedItems: [
				{
					xtype: 'toolbar',
					dock: 'top',
					items: [
						{
							xtype: 'button',
							itemId: 'btnAdd',
							enableToggle: true,
							pressed: true,
							text: 'Add',
							toggleGroup: 'editTools'
						},
						{
							xtype: 'button',
							itemId: 'btnSelect',
							enableToggle: true,
							text: 'Select',
							toggleGroup: 'editTools'
						},
						{
							xtype: 'button',
							itemId: 'btnSelect',
							enableToggle: true,
							text: 'Select',
							toggleGroup: 'editTools'
						},
						{
							xtype: 'tbspacer',
							flex: 1
						},
						{
							xtype: 'button',
							itemId: 'btnConfig',
							text: 'Snapping'
						}
					]
				}
			],
			items: [
				{
					xtype: 'button',
					itemId: 'btnEdit',
					text: 'Edit'
				},						
				{
					xtype: 'button',
					itemId: 'btnDelete',
					text: 'Delete'
				},
				{
					xtype: 'fieldset',
					title: 'Dienstbarkeiten',
					itemId: 'fieldsetDienstbarkeiten',
					items: [
						{
							xtype: 'fieldcontainer',
							layout: {
								align: 'stretch',
								padding: '10 0 10 0',
								type: 'hbox'
							},
							items: [
								{
									xtype: 'displayfield',
									flex: 1,
									name: 'geodb_oid',
									itemId: 'geodb_oid',
									fieldLabel: 'ID',
									labelAlign: 'top',
									labelWidth: 25
								},
								{
									xtype: 'displayfield',
									flex: 1,
									name: 'geom',
									itemId: 'geom',
									fieldLabel: 'Koordinate',
									labelAlign: 'top',
									labelWidth: 75
								}
							]
						},
						{
							xtype: 'combobox',
							anchor: '100%',
							name: 'bfsnr',
							itemId: 'bfsnr',
							fieldLabel: 'Gemeinde'
							// TODO: combobox store
						},
						{
							xtype: 'textfield',
							anchor: '100%',
							name: 'parzellennummer',
							itemId: 'parzellennummer',
							fieldLabel: 'Grundstück Nr.'
						},
						{
							xtype: 'textfield',
							anchor: '100%',
							name: 'dbk_laufnr',
							itemId: 'dbk_laufnr',
							fieldLabel: 'Laufnummer'
						},
						{
							xtype: 'combobox',
							anchor: '100%',
							name: 'dbk_art_id',
							itemId: 'dbk_art_id',
							fieldLabel: 'Art'
							// TODO: combobox store
						},
						{
							xtype: 'combobox',
							anchor: '100%',
							name: 'status_id',
							itemId: 'status_id',
							fieldLabel: 'Status'
							// TODO: combobox store
						},
						{
							xtype: 'datefield',
							anchor: '100%',
							name: 'von',
							itemId: 'von',
							fieldLabel: 'Von'
						},
						{
							xtype: 'datefield',
							anchor: '100%',
							name: 'bis',
							itemId: 'bis',
							fieldLabel: 'Bis'
						},
						{
							xtype: 'textareafield',
							anchor: '100%',
							name: 'bemerkungen',
							itemId: 'bemerkungen',
							fieldLabel: 'Bemerkungen'
						}
					]
				},
                                {
                                    xtype: 'button',
                                    itemId: 'btnSave',
                                    text: 'Speichern'
                                },
                                {
                                    xtype: 'button',
                                    itemId: 'btnReset',
                                    text: 'Zurücksetzen'
                                },
                                {
                                    xtype: 'button',
                                    itemId: 'btnCancel',
                                    text: 'Abbrechen'
                                }
			]
		});

		me.callParent(arguments);
	}

});