Ext.define('Gb41.view.edit.FormNiDienstbarkeitenL', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.editFormNiDienstbarkeitenL',

	layout: {
		type: 'auto'
	},
	bodyPadding: 10,
	title: 'Linie',

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
							text: 'Modify',
							toggleGroup: 'editTools'
						},
						{
							xtype: 'button',
							itemId: 'btnDelete',
							enableToggle: true,
							text: 'Delete',
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
					text: 'Bearbeiten'
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
									fieldLabel: 'ID',
									labelAlign: 'top',
									labelWidth: 25
								},
								{
									xtype: 'displayfield',
									flex: 1,
									name: 'geom',
									fieldLabel: 'Koordinate',
									labelAlign: 'top',
									labelWidth: 75
								}
							]
						},
						{
							xtype: 'combobox',
							anchor: '100%',
							name: 'bfs',
							fieldLabel: 'Gemeinde'
						},
						{
							xtype: 'textfield',
							anchor: '100%',
							name: 'parzellennummer',
							fieldLabel: 'Grundstück Nr.'
						},
						{
							xtype: 'textfield',
							anchor: '100%',
							name: 'dbk_laufnr',
							fieldLabel: 'Laufnummer'
						},
						{
							xtype: 'combobox',
							anchor: '100%',
							name: 'dbk_art_id',
							fieldLabel: 'Art'
						},
						{
							xtype: 'combobox',
							anchor: '100%',
							name: 'status_id',
							fieldLabel: 'Status'
						},
						{
							xtype: 'datefield',
							anchor: '100%',
							name: 'von',
							fieldLabel: 'Von'
						},
						{
							xtype: 'datefield',
							anchor: '100%',
							name: 'bis',
							fieldLabel: 'Bis'
						},
						{
							xtype: 'textareafield',
							anchor: '100%',
							name: 'bemerkungen',
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