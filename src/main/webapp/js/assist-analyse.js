function useAnalyseTool(callback){
  "use strict";
  require([
    'analyse-tools/analyse-tools'
  ],function(analyseTools){
    callback(analyseTools);
  });
}

function getArcGISQueryParameters(geometryType,map){
  "use strict";
  var param,options = {
    geometryType: geometryType,
    geometryParamName: 'geometry',
    geometryTypeParamName: 'geometryType',
    queryUrl: location.protocol+"//"+location.hostname+':6080/arcgis/rest/services/HangZhouPipe/MapServer/1/query',
    queryParams: {
      where:'',
      text:'',
      objectIds:'',
      time:'',
      inSR:'',
      spatialRel:"esriSpatialRelIntersects",
      outFields:"*",
      relationParam:'',
      returnGeometry:true,
      maxAllowableOffset:'',
      geometryPrecision:'',
      outSR:'',
      returnIdsOnly:false,
      returnCountOnly:false,
      orderByFields:'',
      groupByFieldsForStatistics:'',
      outStatistics:'',
      returnZ:false,
      returnM:false,
      gdbVersion:'',
      returnDistinctValues:false,
      returnTrueCurves:false,
      resultOffset:'',
      resultRecordCount:'',
      f:'json'
    }
  };
  map = map || {};
  for(param in map){
    if(map.hasOwnProperty(param) && options.hasOwnProperty(param)){
      options[param] = map[param];    
    }
  }
  
  return options;
}

function analyseFlowdirect(analyseTools){
  "use strict";
  var options = getArcGISQueryParameters('polygon');  
  analyseTools.useTool('select-and-analyse','flowdirect-analyse',options);
}

function analyseHDM(analyseTools){
  "use strict";
  var options = getArcGISQueryParameters('polyline');
  analyseTools.useTool('stroke-and-analyse','hdm-analyse',options);
}

function analyseZDM(analyseTools){
  "use strict";
  var options = {
    queryUrl: getArcGISQueryParameters('polyline').queryUrl
  };
  analyseTools.useTool('pick-and-analyse','zdm-analyse',options);
}

function analyseReversedPipes(analyseTools){
  "use strict";
  var options = getArcGISQueryParameters('polygon',{});
  analyseTools.useTool('select-and-analyse','reversed-pipe-analyse',options);
}

function analysePitch(analyseTools){
  "use strict";
  var options = getArcGISQueryParameters('polygon');
  analyseTools.useTool('select-and-analyse','pitch-analyse',options);  
}

function stopAnalyse(analyseTools){
  "use strict";
  // analyseTools.stopUse('select-and-analyse');
  analyseTools.stopAll();
}
