function loadRangePoint(map,x,y){
	debugger;
	require(["esri/geometry/Point",
		"dojo/_base/array",
        "dojo/parser",
        "dojo/query",
        "dojo/on",
        "esri/Color",
        "esri/config",
        "esri/map",
        "esri/graphic",
        "esri/geometry/normalizeUtils",
        "esri/tasks/GeometryService",
        "esri/tasks/BufferParameters",
        "esri/toolbars/draw",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane",
        "dijit/form/Button", "dojo/domReady!"
        ],
        
      function(Point, array, parser, query, on, Color, esriConfig, Map, Graphic, normalizeUtils, GeometryService, BufferParameters,
      			 Draw, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol){
      	var arcgisBaseUrl="http://192.168.30.147:6080";
      	/**
      	esriConfig.defaults.geometryService = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");	
     	esriConfig.defaults.io.proxyUrl= "/awater/esri_proxy.jsp";
		esriConfig.defaults.io.alwaysUseProxy= false;
      	*/
		
		esriConfig.defaults.geometryService = new GeometryService(arcgisBaseUrl+"/arcgis/rest/services/Utilities/Geometry/GeometryServer");
        esriConfig.defaults.io.proxyUrl= "/awater/esri_proxy.jsp";
		esriConfig.defaults.io.alwaysUseProxy= false;
		
       var geometry = new Point(x,y), symbol;
       geometry.type="point";
        symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 1, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 1), new Color([0,255,0,0.25]));
         var graphic = new Graphic(geometry, symbol);
         map.graphics.add(graphic);  

         //setup the buffer parameters
         var params = new BufferParameters();
         params.distances = ["500"];
         params.outSpatialReference = map.spatialReference;
         params.unit = GeometryService.UNIT_METER;
         //normalize the geometry 
         
         normalizeUtils.normalizeCentralMeridian([geometry]).then(function(normalizedGeometries){
           var normalizedGeometry = normalizedGeometries[0];
           if (normalizedGeometry.type === "polygon") {
             //if geometry is a polygon then simplify polygon.  This will make the user drawn polygon topologically correct.
             esriConfig.defaults.geometryService.simplify([normalizedGeometry], function(geometries) {
               params.geometries = geometries;
               esriConfig.defaults.geometryService.buffer(params, showBuffer);
             });
           } else {
             params.geometries = [normalizedGeometry];
             esriConfig.defaults.geometryService.buffer(params, showBuffer);
           }
         });
         
        function showBuffer(bufferedGeometries) {
          var symbol = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(
              SimpleLineSymbol.STYLE_SOLID,
              new Color([255,0,0,0.65]), 2
            ),
            new Color([255,0,0,0.35])
          );
          array.forEach(bufferedGeometries, function(geometry) {
            var graphic = new Graphic(geometry, symbol);
            map.graphics.add(graphic);
          });
        }
  });
}