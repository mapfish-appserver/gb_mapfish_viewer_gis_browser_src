Ext.define('Gb41.view.GbRedliningPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.gbredliningpanel',
    title: 'Zeichnen',
    config: {
        mapContentController: null
    },

    // private
    map: null,
    redliningTools: null,
    redliningLayer: null,
    padding: 10,

    initComponent: function () {
        this.callParent(arguments);

        this.map = this.mapContentController.getMyMapPanel().map;
        var redliningLayers = this.map.getLayersBy('redlining', true);
        if (redliningLayers.length > 0) {
            // use existing redlining layer
            this.redliningLayer = redliningLayers[0];
        } else {
            // add layer
            var redliningStyles = new OpenLayers.StyleMap({
                "default": new OpenLayers.Style(null, {
                    rules: [
                        new OpenLayers.Rule({
                            symbolizer: {
                                "Point": {
                                    strokeWidth: 2,
                                    fillColor: "#ff0000",
                                    strokeColor: "#ff0000"
                                },
                                "Line": {
                                    strokeWidth: 2,
                                    strokeColor: "#ff0000"
                                },
                                "Polygon": {
                                    strokeWidth: 2,
                                    fillColor: "#ff0000",
                                    strokeColor: "#ff0000"
                                }
                            }
                        })
                    ]
                }),
                "select": new OpenLayers.Style(null, {
                    rules: [
                        new OpenLayers.Rule({
                            symbolizer: {
                                "Point": {
                                    strokeWidth: 2,
                                    fillColor: "#800000",
                                    strokeColor: "#800000"
                                },
                                "Line": {
                                    strokeWidth: 2,
                                    strokeColor: "#800000"
                                },
                                "Polygon": {
                                    strokeWidth: 2,
                                    fillColor: "#800000",
                                    strokeColor: "#800000"
                                }
                            }
                        })
                    ]
                }),
                "temporary": new OpenLayers.Style(null, {
                    rules: [
                        new OpenLayers.Rule({
                            symbolizer: {
                                "Point": {
                                    fillOpacity: 0.3,
                                    strokeOpacity: 0.7,
                                    fillColor: "#ff0000",
                                    strokeColor: "#ff0000"
                                },
                                "Line": {
                                    strokeOpacity: 0.7,
                                    strokeColor: "#ff0000"
                                },
                                "Polygon": {
                                    fillOpacity: 0.3,
                                    strokeOpacity: 0.7,
                                    fillColor: "#ff0000",
                                    strokeColor: "#ff0000"
                                }
                            }
                        })
                    ]
                })
            });
            this.redliningLayer = new OpenLayers.Layer.Vector(
                "redlining",
                {
                    styleMap: redliningStyles,
                    eventListeners: {
                        sketchcomplete: this.sketchComplete,
                        featureadded: this.updatePermalink,
                        afterfeaturemodified: this.updatePermalink,
                        featureremoved: this.updatePermalink,
                        scope: this
                    },
                    // custom params
                    redlining: true,
                    gbLayerTitle: 'Zeichnen'
                }
            );
            this.map.addLayer(this.redliningLayer);
        }

        // controls
        this.redliningTools = {};

        this.addRedliningTool({
            name: "Punkt",
            iconCls: 'redlining_point-icon',
            toolName: 'point',
            control: new OpenLayers.Control.DrawFeature(this.redliningLayer, OpenLayers.Handler.Point, {multi: false})
        });
        this.addRedliningTool({
            name: "Linie",
            iconCls: "redlining_line-icon",
            toolName: 'line',
            control: new OpenLayers.Control.DrawFeature(this.redliningLayer, OpenLayers.Handler.Path, {multi: false})
        });
        this.addRedliningTool({
            name: "Polygon",
            iconCls: "redlining_polygon-icon",
            toolName: 'polygon',
            control: new OpenLayers.Control.DrawFeature(this.redliningLayer, OpenLayers.Handler.Polygon, {multi: false})
        });
        this.add({
            xtype: 'label',
            html: '&nbsp;&nbsp;'
        });

        this.addRedliningTool({
            name: "Editieren",
            iconCls: "redlining_edit-icon",
            toolName: 'edit',
            control: new OpenLayers.Control.ModifyFeature(this.redliningLayer)
        });
        this.add({
            xtype: 'label',
            html: '&nbsp;&nbsp;'
        });
        this.addRedliningTool({
            name: "Löschen",
            iconCls: "redlining_delete-icon",
            toolName: 'delete',
            control: new OpenLayers.Control.SelectFeature(
                this.redliningLayer,
                {
                    eventListeners: {
                        featurehighlighted: function (e) {
                            // ask for confirmation
                            if (confirm("Gezeichnetes Objekt löschen?")) {
                                this.redliningLayer.destroyFeatures([e.feature]);
                                if (this.redliningLayer.features.length === 0) {
                                    var tool = 'polygon';
                                    this.redliningTools[tool].button.doToggle();
                                    this.activateTool(tool);
                                }
                            } else {
                                e.object.unselectAll();
                            }
                        },
                        scope: this
                    }
                }
            )
        });
        this.add({
            xtype: 'button',
            tooltip: 'Alle löschen',
            iconCls: "redlining_delete_all-icon",
            handler:  function () {

                if (confirm("Alle gezeichneten Objekte löschen?")) {
                    this.redliningLayer.removeAllFeatures();
// ohne den folgenden Befehl wurde der Permalink nicht aufdatiert;
                    this.updatePermalink();
                    var tool = 'polygon';
                    this.redliningTools[tool].button.doToggle();
                    this.activateTool(tool);
                }
            },
            scope: this
        });

/*       this.add({
            xtype: 'button',
            tooltip: 'Farbe wählen',
            iconCls: "redlining_delete_all",
            menu: colorPicker,
            scope: this
        });
*/
/*        var colorPicker = Ext.create('Ext.picker.Color', {
            value: 'ff0000',  // initial selected color
 //           renderTo: Ext.getBody(),
            hidden: false,
            listeners: {
                select: function (picker, selColor) {
                    alert(selColor);
                }
            }
        });

        this.add(colorPicker);
*/

        this.on("deactivate", this.onDeactivate);
        GbZh.base.ViewerState.on('redliningpermalinkfeaturesadd', this.addPermalinkFeatures, this, this);
        GbZh.base.ViewerState.on('modeactivate', this.onModeActivate, this, this);
        GbZh.base.ViewerState.on('removelayer', this.onRemoveLayer, this, this);
    },

    onRemoveLayer: function (e) {
        if (e.layer.name === 'redlining') {
            this.close();
        }
    },

    onModeActivate: function (newMode, tool) {
        if (newMode === 'gbredlining') {
            if (tool === '') {
                if (this.redliningLayer.features.length === 0) {
                    tool = 'polygon';
                } else {
                    tool = 'edit';
                }
            }
            this.redliningTools[tool].button.doToggle();
            this.activateTool(tool);
        } else {
            this.onDeactivate();
        }
    },

    beforeDestroy: function () {
        this.deactivateTools();
        for (var key in this.redliningTools) {
            GbZh.base.ViewerState.fireEvent('unregisterolcontrols', 'GbRedliningPanel', key);
            this.map.removeControl(this.redliningTools[key].control);
        }

        this.un("deactivate", this.onDeactivate);
        GbZh.base.ViewerState.un('redliningpermalinkfeaturesadd', this.addPermalinkFeatures, this, this);
        GbZh.base.ViewerState.un('modeactivate', this.onModeActivate, this, this);
        GbZh.base.ViewerState.un('removelayer', this.onRemoveLayer, this, this);

        // NOTE: keep redlining layer when closing panel
    },

    onDeactivate: function () {
        var i;
        this.deactivateTools();
        // deselect tools
        for (var key in this.redliningTools) {
            this.redliningTools[key].button.toggle(false);
        }
    },

    addRedliningTool: function (config) {
        var toolControl = config.control || new OpenLayers.Control();
        this.map.addControls([toolControl]);
        GbZh.base.ViewerState.fireEvent('registerolcontrols', 'GbRedliningPanel', config.toolName, [toolControl]);

        var button = Ext.create(Ext.Button, {
 //           icon: config.icon || "img/pen.png",
            iconCls: config.iconCls || "img/pen.png",
            tooltip: config.name || "Tool",
            enableToggle: true,
            toggleGroup: 'RedlineTools',
            handler: function () {
                this.activateTool(config.toolName);
            },
            scope: this
        });
        this.add(button);

        this.redliningTools[config.toolName] = {
            button: button,
            control: toolControl
        };
    },

    deactivateTools: function () {
        // enable identify tool
        GbZh.base.ViewerState.fireEvent('activateolcontrols', 'GbMapController', 'featureQuery');
    },

    activateTool: function (toolName) {
        if (this.redliningTools[toolName].button.pressed) {
            GbZh.base.ViewerState.fireEvent('activateolcontrols', 'GbRedliningPanel', toolName);
        }
        else {
            // enable identify tool
            GbZh.base.ViewerState.fireEvent('activateolcontrols', 'GbMapController', 'featureQuery');
        }
    },

    sketchComplete: function (e) {
        var geom = e.feature.geometry;
        // check number of polygon vertices before adding feature
        // polygons with less than 3 vertices cause errors when printing
        if (geom.CLASS_NAME == 'OpenLayers.Geometry.Polygon' && geom.getVertices().length < 3) {
            // do not add feature to layer
            return false;
        }

        return true;
    },

    // convert permalink param to redlining features
    addPermalinkFeatures: function (features) {
        // convert WKT to features
        var format = new OpenLayers.Format.WKT();
        this.redliningLayer.addFeatures(format.read(features));
    },

    // set redlining features as permalink param
    updatePermalink: function () {
        var i, j;
        // round feature coordinates to shorten permalink string
        var numFeatures = this.redliningLayer.features.length;
        for (i = 0; i < numFeatures; i++) {
            var vertices = this.redliningLayer.features[i].geometry.getVertices();
            var numVertices = vertices.length;
            for (j = 0; j < numVertices; j++) {
                var vertex = vertices[j];
                vertex.x = Ext.util.Format.round(vertex.x, 0);
                vertex.y = Ext.util.Format.round(vertex.y, 0);
            }
        }

        // convert features to WKT
        var format = new OpenLayers.Format.WKT();
        GbZh.base.ViewerState.fireEvent('redliningpermalinkupdate', format.write(this.redliningLayer.features));
    }
});
