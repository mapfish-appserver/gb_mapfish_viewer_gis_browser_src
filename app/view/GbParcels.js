Ext.define('Gb41.view.GbParcels', {
	extend: 'Ext.form.field.ComboBox',
    requires: ["Ext.data.JsonStore", "Ext.data.proxy.JsonP"],
    alias: 'widget.gbparcels',

	emptyText: 'Grundstück Nr. ...',
	enableKeyEvents: true,
	selectOnFocus: true,
	hideLabel: true,
	hideTrigger: true,
	minChars: 1,
	queryParam: 'bsname',
	valueField: 'label',
	displayField: 'bsname',
	forceSelection: true,
	scaleForParcel: 2400.0,

	listeners: {

//TEST
		beforequery: function (qe) {
			//LOG console.log('beforequery');
//            delete qe.combo.lastQuery;
			delete this.lastQuery;
        },

		specialkey: function (field, e) {
			//LOG console.log('specialKey: ' + e.getKey());
		},

		render: function () {
			Ext.create('Ext.tip.ToolTip', {
				target: 'parcelsearch',
				html: 'Eingabe: <b>Grundstücksnummer</b>, anschliessend Auswahl der Gemeinde. '
				//				html: 'Eingabe: <b>Grundstücksnummer</b> und <b>Gemeindename</b>, z.B. "123 wil". '
			});
		},

		select: function (sm, selected, options) {
			//LOG console.log('selected: ' + selected[0].data.bsname + ' in ' + selected[0].data.gemeinde);
			//LOG console.log(selected);
			GbZh.base.ViewerState.fireEvent('searchresultselected', '/images/identify_marker.png', selected[0].data.lkx, selected[0].data.lky, this.scaleForParcel);
		}
	},

	listConfig: {
		getInnerTpl: function () {
			return '{bsname} <b>{gemeinde}</b>';
		},
		loadingText: 'Suche läuft ...',
		emptyText: 'Nichts gefunden.',
		maxHeight: 400
	},

	store: Ext.create('Ext.data.JsonStore', {
		fields: [
			{ name: 'lkx', type: 'string' },
			{ name: 'lky', type: 'string' },
			{ name: 'geodb_oid', type: 'string' },
			{ name: 'bsname', type: 'string' },
			{ name: 'gemeinde', type: 'string', sortType: 'asUCText' }
		],

		proxy: {
			type: 'ajax',
			url: '../../search/parzelle.json',
			reader: {
				type: 'json',
				root: 'features'
			}
		}
	})

});