/**
 * 先划线后分析（用法），获取相交的feature的同时获取交点 
 */
define([
  'dojo/_base/lang',
  'dojo/json',
  'esri/geometry/geodesicUtils',
  'esri/toolbars/draw',
  'esri/geometry/Polyline',
  'esri/units',
  'analyse-tools/lib/analyse-query/analyse-query',
  'analyse-tools/interfaces/analyse-usage'
],function(lang,JSON,mathUtils,Draw,Polyline,Units,queryUtils,AnalyseUsage){
  "use strict";
  return function(){
    var
      exports,
      map,
      draw,
      eventHandlerMap = {},
      drawState = {},
      curTool,
      geometryTypeMap = {
        'polygon': Draw.POLYGON,
        'line': Draw.LINE
      },
      esriGeometryTypeMap = {
        'polygon': 'esriGeometryPolygon',
        'line': 'esriGeometryPolyline',
        'polyline': 'esriGeometryPolyline'
      },
      geometryElementNameMap = {
        'polygon': 'rings',
        'line': 'paths',
        'polyline': 'paths'
      },
      initDone = false,
      use,
      init,
      stop,
      getEquation,
      getEquationGroup,
      getIntersectionPoint,
      getIntersectionPoints,
      getDistanceInMeters,
      initDraw,
      activateDraw,
      deactivateDraw;
    
    /**
     * options:
     *  //- keepCurrentWork 是否保留当前工具的工作结果
     */
    stop = function(options){
      options = lang.clone(options) || {};
      deactivateDraw();
      // if(curTool && !options.keepCurrentWork){
      if(curTool){
        curTool.cancel(options);
        curTool = null;
      }
    };
    
    /**
     * 获取两点（经纬度坐标）之间的距离（以米为单位） 
     */
    getDistanceInMeters = function(point1,point2){
      // var distance = Math.sqrt(111 * Math.pow(point1[0]-point2[0],2) + 78 * Math.pow(point1[1]-point2[1],2)) / 1000;
      var distance, line;
      line = new Polyline({
        paths: [[point1,point2]],
        spatialReference: map.spatialReference
      });
      distance = mathUtils.geodesicLengths([line],Units.METERS);
      return distance[0];
    };
    
    /**
     * 给两个点，得到直线方程 
     */
    getEquation = function(path1){
      var k,m,a,b,c,p = path1;
      if(p[0][0] === p[1][0]){//line has no pitch
        a = 1;
        b = 0;
        c = - (p[0][0]);
      }else{
        k = (p[0][1] - p[1][1]) / (p[0][0] - p[1][0]);
        m = p[0][1] - k * p[0][0];
        a = k;
        b = -1;
        c = m;
      }
      return [a,b,c];
    };
    
    /**
     * 给两个（[起点,终点]），得出方程组 
     */
    getEquationGroup = function(path1,path2){
      var eq1, eq2;
      eq1 = getEquation(path1);
      eq2 = getEquation(path2);
      return [
        eq1,
        eq2
      ];
    };
    
    /**
     * 解方程组，得出交点坐标 
     */
    getIntersectionPoint = function(g){
      var x,y,k1,k2,b1,b2,a = 0,b = 1,c = 2;
      if((g[0][a] === 0 && g[0][b] === 0) || (g[1][a] === 0 && g[1][b] === 0)){
        //either line1 or line2 is not a line 
        return null;  
      }
      if(g[0][b] === 0){//line 1 has no pitch
        if(g[1][b] === 0){//line2 has no pitch, too
          if(g[0][c]/g[0][a] === g[1][c]/g[1][a]){
            return 'overlay';
          }else{
            return null;
          }
        }else{
          x = -g[0][c]/g[0][a];
          k2 = -g[1][a]/g[1][b];
          b2 = -g[1][c]/g[1][b];
          y = k2*x + b2;
        }
      }else if(g[1][b] === 0){//line2 has no pitch
        x = -g[1][c]/g[1][a];
        k1 = -g[0][a]/g[0][b];
        b1 = -g[0][c]/g[0][b];
        y = k1*x + b1; 
      }else{//both line1 and line2 has pitch
        k1 = -g[0][a]/g[0][b];
        k2 = -g[1][a]/g[1][b];
        b1 = -g[0][c]/g[0][b];
        b2 = -g[1][c]/g[1][b];
        if(k1 === k2){
          if(b1 === b2){ //overlay
            return 'overlay';
          }else{
            return null;        
          }
        }else{
          x = (b2 - b1) / (k1 - k2);
          y = k2*x + b2;
        }
      }
      return {'x':x,'y':y};
    };

    getIntersectionPoints = function(data,strokeLineGeometry){
      var
        newArr = [],
        i,
        pipeEquation,
        point, 
        strokeEquation = getEquation(strokeLineGeometry.paths[0]);
      for(i=0;i<data.features.length;i+=1){
        pipeEquation = getEquation(data.features[i].geometry.paths[0]);
        point = getIntersectionPoint([strokeEquation,pipeEquation]);
        if(point && point != 'overlay'){
          data.features[i].attributes.intersectionPoint = {
            'x': point.x,
            'y': point.y,
            //z
            'distance': getDistanceInMeters([point.x,point.y],strokeLineGeometry.paths[0][0])
          };
          newArr.push(data.features[i]); 
        }
      }
      return newArr;
    };
    
    /**
     * options: 
     *  - cancelCurrentOperation 如果当前操作未完成，取消当前操作，进行新的操作
     *  - ignoreIfBusy 如果当前操作未完成，忽略新的操作请求(默认)
     *  - geometryType 选区的几何类型['polygon','line']
     */
    use = function(tool,options){//实现方法
      if(!tool){
        throw "A usage must be 'used' to a tool.";
      }
      options = lang.clone(options) || {};
      if(!curTool){
        curTool = tool;
      }else if(options.cancelCurrentOperation || window.confirm("当前操作未完成，是否取消当前操作?")){
        stop();
        curTool = tool;
      }else{
        return false;
      }

      var geometryType, optMap = lang.clone(options) || {};
      optMap.queryUrl = options.queryUrl;
      optMap.queryParams = options.queryParams;
      optMap.geometryParamName = options.geometryParamName;
      optMap.geometryTypeParamName = options.geometryTypeParamName;
      optMap.toolOptions = options.toolOptions;
      
      geometryType = Draw.LINE;
      
      if(geometryType){
        activateDraw(geometryType);
        if(eventHandlerMap.drawEndHandler){
          eventHandlerMap.drawEndHandler.remove();
          delete eventHandlerMap.drawEndHandler;
        }
        eventHandlerMap.drawEndHandler = draw.on('draw-end',function(event){
          // queryUtils.query(event.geometry,tool.use,optMap);
          queryUtils.query(
            event.geometry,
            function(data,opts){
              data = getIntersectionPoints(data,event.geometry);
              optMap.selectAreaGeometry = event.geometry;
              tool.use({'features':data},optMap);
            },
            optMap
          );
          deactivateDraw();      
        });
      }
    };
    
    activateDraw = function(geometryType){
      draw.activate(geometryType);
      drawState.activating = true;
    };
    
    deactivateDraw = function(){
      draw.deactivate();
      drawState.activating = false;
    };   
    
    initDraw = function(initMap){
      draw = new Draw(map); 
      drawState.activating = false;
    };
    
    init = function(pMap,initMap){
      if(!pMap){
        throw "A esri.Map object is neccessary for init this usage!";
      }
      
      initMap = lang.clone(initMap) || {};
      
      map = pMap;
      
      initDraw(initMap);
      
      initDone = true;
    };
    
    exports = {
      name: 'stroke-and-analyse',
      use: use,
      init: init,
      stop: stop
    };
    
    return new AnalyseUsage(exports);
  };
});
