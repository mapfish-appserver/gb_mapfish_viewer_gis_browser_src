Ext.define('Gb41.view.GbHeaderZH', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.gbheaderzh',

	height: 115,
	bodyCls: 'zhheader',

	html: '<div id="logo" role="banner">\r\n' +
		'<img class="logo" src="/img/logo.gif" alt="Kanton Zürich" />\r\n' +
		 '<div>\r\n' +
		 '<p class="identity one-line">\r\n' +
		 '<strong>Kanton Zürich</strong> <a href="http://www.zh.ch" class="home">Startseite</a>\r\n' +
		 '</p>\r\n' +
		 '</div>\r\n' +
		 '</div>\r\n',
	title: 'test',

	initComponent: function () {
		var me = this;
		me.callParent(arguments);
		if (GbZh.base.ViewerState.isIntranet) {
			me.html = '<div id="logointra" role="bannerintra">\r\n' +
				'<img class="logointra" src="/img/logo-intranet.gif" alt="Kanton Zürich" />\r\n' +
				'<div>\r\n' +
				'<p class="identity one-line">\r\n' +
				'<strong>Intranet</strong> <a href="http://www.ktzh.ch" class="home">Startseite</a>\r\n' +
				'</p>\r\n' +
				'</div>\r\n' +
				'</div>\r\n';
			me.bodyCls = 'zhheaderintranet';
		}
	}

});