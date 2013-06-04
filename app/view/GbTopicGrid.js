/**
 * File: app/view/GbTopicGrid.js
 */

Ext.define('Gb41.view.GbTopicGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.gbtopicgrid',

	border: 0,
	padding: '',
	autoScroll: false,
	enableColumnHide: false,
	enableColumnMove: false,
	enableColumnResize: false,
	hideHeaders: true,
	store: 'Topics',
	id: 'topicGrid',

	// **** Texte ****
	/**
	* @cfg {String} title
	* Panel title of GbTopicGrid.
	*/
	//<locale>
	title: 'topics',
	//</locale>	

	/**
	* @cfg {String} waitText
	* Text for the waiting mask.
	*/
	//<locale>
	waitText: 'Loading topic ...',
	//</locale>

	initComponent: function () {
		var me = this;

		Ext.applyIf(me, {
			viewConfig: {
				singleSelect: true,
				preserveScrollOnRefresh: true
			},
			tools: [

				{
					xtype: 'textfield',
					name: 'txtFilter',
					itemId: 'txtFilter',
					width: 90,
					emptyText: 'Filter ...',
					enableKeyEvents: true,
					style: {
						marginBottom: '0px',
						marginTop: '0px'
					}
				}, {
					text: 'Gruppierung',
					//            iconCls: 'bmenu',  // <-- icon
					xtype: 'splitbutton',
					enableToggle: true,
					menu: {
						itemId: 'menuGrouping',
						items: [{
							text: 'nach Themen',
							group: 'sorting',
							checked: true,
							itemId: 'groupCategory'
						}, {
							text: 'nach Fachstellen',
							group: 'sorting',
							checked: false,
							itemId: 'groupOrganisation'
						}, {
							text: 'nur alphabetisch',
							group: 'sorting',
							checked: false,
							itemId: 'groupAlphabet'
						}]
					}
				},
				{
					xtype: 'tool',
					itemId: 'einklappen',
					tooltip: 'Alles einklappen',
					type: 'minus',
					handler: function (item) {
						this.onCollapseAll();
					},
					scope: this
				},
				{
					xtype: 'tool',
					itemId: 'ausklappen',
					tooltip: 'Alles ausklappen',
					type: 'plus',
					handler: function (item) {
						this.onExpandAll();
					},
					scope: this
				}
			],
			dockedItems: [
                {
                    xtype: 'toolbar',
					itemId: 'levelSelector',
                    dock: 'bottom',
                    items: [
                        {
                            xtype: 'button',
							itemId: 'btnOver',
							enableToggle: true,
                            text: 'Überlagerung',
                            toggleGroup: 'level',
                            flex: 1
                        },
                        {
                            xtype: 'button',
							id: 'btnMain',
							itemId: 'btnMain',
                            enableToggle: true,
                            pressed: true,
                            text: 'Thema',
                            toggleGroup: 'level',
                            flex: 1
                        },
                        {
                            xtype: 'button',
							itemId: 'btnBack',
                            enableToggle: true,
                            text: 'Hintergrund',
                            toggleGroup: 'level',
                            flex: 1
                        }
                    ]
                }
            ],
			columns: [
				{
					xtype: 'gridcolumn',
					hidden: true,
					width: 164,
					dataIndex: 'name',
					text: 'name'
				},
				{
					xtype: 'gridcolumn',
					hidden: true,
					width: 154,
					dataIndex: 'categorytitle',
					groupable: true,
					groupName: 'category',
					text: 'TopicGroup'
				},
				{
					xtype: 'gridcolumn',
					renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
						var imgName = value;
						if (record.data.gb1_params) {
							var i = value.indexOf('.gif');
							imgName = value.substring(0, i) + '_grau' + value.substring(i);
						}
						var link = '<img src="' + imgName + '" alt="' + record.data.title + '" title="' + record.data.title + '" width=51>';
						if (record.data.hassubtopics) {
							link = "<div onmouseover='this.style.background=\"#fff\";' onmouseout='this.style.background=\"\";'  onclick='GbZh.base.ViewerState.fireEvent(\"topicselected\", " + Ext.encode(record.data.name) + ", \"main\", false)'>"
								+ link + "/div>";
						}
						return link;

					},
/*					xtype: 'templatecolumn',
					tpl: [
						'<img src="{icon}" alt="{title}" title="{title}" width=51>'
//						'<a href="#" onclick="GbZh.base.ViewerState.fireEvent(\'topicselected\',\'{name}\',\'main\',false)"><img src="{icon}" alt="{title}" title="{title}" width=51></a>'
					],
*/
					width: 51,
					dataIndex: 'icon',
					text: 'Icon'
				},
				{
					xtype: 'gridcolumn',
					tdCls: 'wrapText',
					renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
						var strTopic = '';
						if (record.data.gb1_params) {
							strTopic +=   value.toString() + '<br><div class="gbgb1">Thema im alten GIS-Browser!</div>';
						} else {
							if (record.data.hassubtopics) {
								var selObj = Ext.clone(record.data);
								var strSubTopics = [];
								var i, len;
//								strTopic += "<a href='javascript:GbZh.base.ViewerState.fireEvent(\"topicselected\", " + Ext.encode(selObj.name) + ", \"main\", false)'>" + value.toString() + '</a>,<br />';
								strTopic += "<div onmouseover='this.style.background=\"#fff\";' onmouseout='this.style.background=\"\";'  onclick='GbZh.base.ViewerState.fireEvent(\"topicselected\", " + Ext.encode(selObj.name) + ", \"main\", false)'>";
								if (selObj.name === GbZh.base.ViewerState.activeTopic) {
									strTopic += "<div class='subTopicActive'>" + value.toString() + "</div>";
								} else {
									strTopic += "<div class='subTopicNotActive'>" + value.toString() + "</div>";
								}
								strTopic += '</div>';

								for (i = 0, len = record.data.subtopics.length; i < len; i += 1) {
									selObj.name = record.data.subtopics[i].subtopicname;
									selObj.title = record.data.subtopics[i].subtopictitle;

									if (record.data.subtopics[i].subtopicname === GbZh.base.ViewerState.activeTopic) {
										selObj.title = "<div class='subTopicActive'>" + selObj.title + "</div>";
									} else {
										selObj.title = "<div class='subTopicNotActive'>" + selObj.title + "</div>";
									}


//									strSubTopics.push("<a href='javascript:GbZh.base.ViewerState.fireEvent(\"topicselected\", " + Ext.encode(selObj.name) + ", \"main\", false)'>" + selObj.title + '</a>');
//									strSubTopics.push("<div>- <a href='javascript:void(0)' onclick='GbZh.base.ViewerState.fireEvent(\"topicselected\", " + Ext.encode(selObj.name) + ", \"main\", false)'>" + selObj.title + '</a></div>');
									strSubTopics.push("<div onmouseover='this.style.background=\"#fff\";' onmouseout='this.style.background=\"\";'  onclick='GbZh.base.ViewerState.fireEvent(\"topicselected\", " + Ext.encode(selObj.name) + ", \"main\", false)'>" + selObj.title + '</div>');
								}
								strTopic += strSubTopics.join(' ');

							} else {
								strTopic += value.toString();
							}
						}

						if (this.dockedItems.get('levelSelector').items.get('btnBack').pressed) {
							strTopic = '<div class="bgtopic">' + strTopic + '</div>';
						}
						return strTopic;
					},
					//width: 228,
					dataIndex: 'title',
					flex: 1,
					text: 'Title'
				}
			],
			selModel: Ext.create('Ext.selection.RowModel', {
				listeners: {
					select: {
						fn: me.onRowselectionmodelSelect,
						scope: me
					}
				}
			}),
			features: [Ext.create('Ext.grid.feature.Grouping', {
				groupHeaderTpl: '{name} ({rows.length} Karte{[values.rows.length > 1 ? "n" : ""]})'
			})]
		});

		GbZh.base.ViewerState.on({
			userchange: {
				fn: this.onUserChange,
				scope: this
			},
			topicready: {
				fn: this.onTopicReady,
				scope: this
			}
		});

		me.callParent(arguments);
	},

	onRowselectionmodelSelect: function (rowmodel, record, index, options) {
		// var selrow = this.getView().getRow(index);
  //         Ext.fly(selrow).addClass('layer');

		if (record.data.gb1_params) {
		    var map = Gb41.app.getController('GbMapController').getMyMapPanel().map;
			var center = map.getCenter();
			var urlGbOld =  GbZh.base.ViewerState.oldGb + '?' + record.data.gb1_params;

			urlGbOld += '&start=' + Math.round(center.lon) + '$' + Math.round(center.lat) + '&Massstab=' + Math.round(map.getScale());

			window.open(urlGbOld, "GISBrowser");
		} else if (!record.data.hassubtopics) {
			this.el.mask(this.waitText);
			var level;
			if (this.dockedItems.get('levelSelector').items.get('btnMain').pressed) {
				level = 'main';
			} else if (this.dockedItems.get('levelSelector').items.get('btnBack').pressed) {
				level = 'back';
			} else if (this.dockedItems.get('levelSelector').items.get('btnOver').pressed) {
				level = 'over';
			}
			GbZh.base.ViewerState.fireEvent('topicselected', record.data.name, level, false);
		}
	},

	onUserChange: function () {
		this.el.mask('Loading topics ...');
	},

	onTopicReady: function () {
		this.el.unmask();
	},

	onCollapseAll: function () {
		var i;
		var view = this.view;
		var theHeaders = view.el.query('.x-grid-group-hd');
		for (i = 0; i < theHeaders.length; i += 1) {
			var group_body = Ext.fly(theHeaders[i].nextSibling, '_grouping');
			view.features[0].collapse(group_body);
		}
	},

	onExpandAll: function () {
		var i;
		var view = this.view;
		var items = view.el.query('.x-grid-group-hd');
		for (i = 0; i < items.length;  i += 1) {
			var group_body = Ext.fly(items[i].nextSibling, '_grouping');
			view.features[0].expand(group_body);
		}
	}

// war nicht IE-kompatibel:
/*		view.el.query('.x-grid-group-hd').forEach(function (group) {
			var group_body = Ext.fly(group.nextSibling, '_grouping');
			view.features[0].expand(group_body);
		});
*/

/*	onTopicGroupingChange: function (was, sortierung) {
		this.store.group(was, sortierung);
	}
*/
});