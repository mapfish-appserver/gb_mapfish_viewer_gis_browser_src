gbzh viewer
===========

ExtJS 4.1 based viewer for maps.zh.ch

Usage
-----

Starten der lokalisieren Varianten (de, en, fr oder it) mit 

app-xx.html?lang=xx

Ohne lang=xx werden die lokalisierten Ext-Meldungen nicht verwendet. (z.B. Sort Ascending anstelle von Aufsteigend Sortieren im Grid...)


Build for deployment
--------------------

Get Sencha Cmd from  http://www.sencha.com/products/sencha-cmd/download

sencha app build

Note: SenchaCmd > 3.0.0.190 raises exception because of missing build.xml.

Sench Cmd usage: http://docs.sencha.com/ext-js/4-1/#!/guide/command_app


Javascript Files und CSS (bzw. SASS) komprimieren.

Javascript:
-----------
	ste@MGIS00009 /c/wwwroot/apps/gb41build (master)
	$ sencha create jsb -a app-de.html -p myapp.jsb3 -v
	
	myapp.jsb3 anpassen:
	
	
{
	"projectName": "GIS-Browser",
	"licenseText": "Copyright(c) 2012 GIS-ZH",
	"builds": [
		{
			"name": "All Classes",
			"target": "all-classes.js",
			"options": {
				"debug": false
			},
			"files": [
				{
					"clsName": "OpenLayers.Control.FeatureQuery",
					"name": "FeatureQuery.js",
					"path": "./lib/GbZh/ol/"
				},
				{
					"clsName": "OpenLayers.Control.OrthogonalLines",
					"name": "OrthogonalLines.js",
					"path": "./lib/GbZh/ol/"
				},
				{
					"clsName": "OpenLayers.Control.ArcIntersection",
					"name": "ArcIntersection.js",
					"path": "./lib/GbZh/ol/"
				},
				{
                    "clsName": "Ext.util.Observable",
                    "name": "Observable.js",
                    "path": "../../lib/ext/extjs-4.1.1/src/util/"
                },
			:
			:
			}]
		:
		:
	}
	
	$ sencha build -p myapp.jsb3 -d . -v

	Wenn der Output - warum auch immer - nicht komprimiert wird, so kann man auch mit dem yuicompressor
	nachbearbeiten:
	
	$ java -jar yuicompressor-2.4.7.jar app-all.js -o app-all_compressed.js
	
	
Css3, SASS, Compass:
------------------------------

	************  nach Anleitung ***********
	http://existdissolve.com/2011/09/extjs-4-theming-getting-this-thing-to-go/
	http://existdissolve.com/2011/09/extjs-4-theming-custom-uis/

	config.rb anpassen in C:\wwwroot\apps\gb41build\extjs\resources\custom:
	
		$ext_path = "../.."
		sass_path = File.dirname(__FILE__)
		css_path = File.join(sass_path, "..", "css")
		# output_style = :compressed
		output_style = :expanded
		load File.join(File.dirname(__FILE__), $ext_path, 'resources', 'themes')	

		
	ste@MGIS00009 /c/wwwroot/apps/gb41build/extjs/resources/custom (master)
		$ compass compile
	oder besser während Entwicklung
		$ compass watch gbzh-dark.scss
	
	
	*********** hat nicht funktioniert ... 
	ste@MGIS00009 /c/wwwroot/apps/gb41build (master)
	$ sencha slice theme -d extjs -c extjs/resources/css/gbzh-dark.css -o extjs/resources/themes/images/default -m extjs/resources/custom/manifest.json -v
	

Doku erstellen
==============

Install jsduck with "gem install jsduck"

cd ...apps/gb41build
jsduck --config gb41build.json



License
-------

GPL V3
