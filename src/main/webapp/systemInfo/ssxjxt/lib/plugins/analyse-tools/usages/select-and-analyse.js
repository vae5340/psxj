/**
 * 先选择后分析（用法） 
 */
define([
  'dojo/_base/lang',
  'dojo/json',
  'esri/toolbars/draw',
  'analyse-tools/lib/analyse-query/analyse-query',
  'analyse-tools/interfaces/analyse-usage'
],function(lang,JSON,Draw,queryUtils,AnalyseUsage){
  "use strict";
  return function($){
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
      fetchData,
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
      optMap.geometryType = options.geometryType;
      
      geometryType = geometryTypeMap[optMap.geometryType];
      
      if(geometryType){
        activateDraw(geometryType);
        if(eventHandlerMap.drawEndHandler){
          eventHandlerMap.drawEndHandler.remove();
          delete eventHandlerMap.drawEndHandler;
        }
        eventHandlerMap.drawEndHandler = draw.on('draw-end',function(event){
          queryUtils.query(event.geometry,tool.use,optMap);
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
      name: 'select-and-analyse',
      use: use,
      init: init,
      stop: stop
    };
    
    return new AnalyseUsage(exports);
  };
});
