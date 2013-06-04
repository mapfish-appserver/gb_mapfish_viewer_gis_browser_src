Ext.define('Gb41.view.GbPermalinkPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.gbpermalinkpanel',
	requires: [
		'GbZh.store.BitLys',
		'Ext.form.FieldSet',
		'Ext.form.FieldContainer'
	],

	title: 'Link',
	bodyPadding: 10,
	config: {
		mapContentController: null
	},

    // private
    map: null,

	// **** Texts ****
	txtLink: 'URL to this map:',
	txtShortLink: 'Short link',
	txtIntro: 'Map at ',
	txtShare: 'Share: ',

// im language-file überschreiben:	
	bitlyUsername: 'o_2qabbn8ll9',
	bitlyApiKey: 'R_faf22404cfa2868638ba29bcd75cc80d',

	initComponent: function () {
		var me = this;
		Ext.applyIf(me, {


			items: [{

				xtype: 'fieldset',
				title: this.txtLink,
				items: [
					{
						xtype: 'textarea',
						width: 250,

						id: 'permalink',
						selectOnFocus: true
					}, {
						xtype: 'checkboxfield',
						fieldLabel: '',
						boxLabel: this.txtShortLink,
						id: 'shortUrlCheckbox',
						listeners: {
							change: function (field, shortChecked, oldVal, eOpt) {
								field.ownerCt.ownerCt.showLink();
							},
							scope: this
						}
					}
				]
			}, {
				xtype: 'fieldset',
				title: this.txtShare,
				items: [
					{
						xtype: 'label',
						id: 'twitter'
					},
					{
						xtype: 'label',
						id: 'facebook'
					},
					{
						xtype: 'label',
						id: 'googleplus'
					},
					{
						xtype: 'label',
						id: 'email'
					}
				]
			}]
		});

		this.on('activate', this.showLink, this);
		me.callParent(arguments);


		this.map = this.mapContentController.getMyMapPanel().map;
		this.map.events.on({
			zoomend: this.showLink,
			moveend: this.showLink,
			scope: this
		});

		this.store = Ext.create('GbZh.store.BitLys');
		this.store.on('load', this.setLink, this);

		GbZh.base.ViewerState.on({
			topicready: {
				fn: this.showLink,
				scope: this
			},
			addlayer: {
				fn: this.showLink,
				scope: this
			},
			removelayer: {
				fn: this.showLink,
				scope: this
			}
		});


		this.showLink();

	},

	showLink: function () {
		var fld = Ext.getCmp('permalink');
		var perma = this.mapContentController.permalink();
		if (Ext.getCmp('shortUrlCheckbox').checked) {
			this.store.model.proxy.url = 'http://api.bitly.com/v3/shorten?login=' + this.bitlyUsername + '&apiKey=' + this.bitlyApiKey +
				'&longUrl=' + encodeURIComponent(perma);
			this.store.load();
		} else {
			fld.setValue(perma);
		}
		fld.focus(true);
		this.updateLinks(perma);
	},

	setLink: function (store, record, success) {
		Ext.getCmp('shortUrlCheckbox').boxLabel = 'PRoblem';
		if (!success) {
			Ext.getCmp('shortUrlCheckbox').setValue(false);
	//TODO hier sollte es irgendwo eine Meldung geben, dass die URL nicht verkürzt werden konnte.
			return;
		}
		var fld = this.items.get('permalink');
		fld = Ext.getCmp('permalink');
		if (fld) {
			var perma = record[0].data.url;
			fld.setValue(perma);
			fld.focus(true);
			this.updateLinks(perma);
		}
	},

	updateLinks: function (perma) {
		var encodedPerma = encodeURIComponent(perma);
		this.doTwitterLink(encodedPerma);
		this.doFacebookLink(encodedPerma);
		this.doGooglePlusLink(encodedPerma);
		this.doEmailLink(encodedPerma);
	},


	doTwitterLink: function (encodedPerma) {
		Ext.getCmp('twitter').setText('<a href="https://twitter.com/intent/tweet?text=' + this.txtIntro +
			encodeURIComponent(location.host + ": ") +
			'&url=' + encodedPerma +
			'&hashtags=GISZH" target="_blank"><img src="/img/twitter.png"></a>&nbsp;', false);
	},

	doFacebookLink: function (encodedPerma) {
		Ext.getCmp('facebook').setText('<a href="http://www.facebook.com/sharer/sharer.php?u='
			+ encodedPerma +
			'" target="_blank"><img src="/img/facebook.png"></a>&nbsp;', false);
	},

	doGooglePlusLink: function (encodedPerma) {
		Ext.getCmp('googleplus').setText('<a href="https://www.google.com/bookmarks/mark?op=edit&bkmk='
			+ encodedPerma +
			'&title=' + this.txtIntro + encodeURIComponent(location.host) +
			'" target="_blank"><img src="/img/googleplus.png"></a>&nbsp;', false);
	},

	doEmailLink: function (encodedPerma) {
		Ext.getCmp('email').setText('<a href="mailto:?subject=' + this.txtIntro +
			encodeURIComponent(location.host) +
			'&body=' + encodedPerma +
			'"><img src="/img/mail.png" width="20" height="20"></a>', false);
	}

});
