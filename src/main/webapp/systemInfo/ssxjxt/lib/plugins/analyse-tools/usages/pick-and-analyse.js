/**
 * 点击选取后分析（用法）
 */
define([
  'dojo/_base/lang',
  'dojo/json',
  'esri/graphic',
  'esri/Color',
  'esri/geometry/Polyline',
  'esri/symbols/SimpleLineSymbol',
  'esri/layers/GraphicsLayer',
  'esri/units',
  'esri/geometry/Circle',
  'analyse-tools/lib/analyse-query/analyse-query',
  'analyse-tools/interfaces/analyse-usage'
],function(lang,JSON,Graphic,Color,Polyline,SimpleLineSymbol,GraphicsLayer,units,Circle,queryUtils,AnalyseUsage){
  "use strict";
  return function($){
    var 
      map,
      exports,
      curTool,
      graphicLayer,
      initDone = false,
      stateMap = {},
      eventHandlerMap = {},
      pipeFieldMap = {
        'startPoint': 'StartPoint',
        'endPoint': 'EndPoint'
      },
      symbols = {
        'PICKED_PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,255]),3)
      },
      init,
      use,
      stop,
      initGraphicLayer,
      useTool,
      sortPipes,
      fetchData,
      pickOne,
      addPipe,
      drawPipe,
      isPipeConnected,
      activatePick,
      deactivatePick,
      clickPickHandler,
      endPickHandler,
      queryResultHandler;
    
    isPipeConnected = function(pipe){
      if(!pipe){
        return false;
      }
      if(stateMap.pipeArr.length <= 0){
        return true;
      }
      var 
        flag = false,
        startPt, endPt;
        
      startPt = pipe.attributes[pipeFieldMap.startPoint];
      endPt = pipe.attributes[pipeFieldMap.endPoint]; 
      /*
       * 判断条件：
       *  1. pipe的起点是已有管的终点，且pipe的终点不是已有管道的起点或终点，且未选中相同起点的管
       *  2. pipe的终点是已有管的起点，且pipe的起点不是已有管道的起点或终点，且未选中相同终点的管
       */
      if(
        (stateMap.endConnectionMap[startPt] && !stateMap.startConnectionMap[startPt] && !stateMap.endConnectionMap[endPt] && !stateMap.startConnectionMap[endPt])
        || (stateMap.startConnectionMap[endPt] && !stateMap.endConnectionMap[endPt] && !stateMap.endConnectionMap[startPt] && !stateMap.startConnectionMap[startPt])
      ){
        flag = true;
      }
      return flag;
    };
    
    /**
     * 选择策略 
     */
    pickOne = function(data){
      var i, pipes;
      if(data && data.features && data.features.length){//最简单策略，选择第一条管道
        pipes = data.features;
        for(i=0;i<pipes.length;i+=1){
          if(isPipeConnected(pipes[i])){//选择第1条与已选管连通的管
            return pipes[i];
          }
        }
      }
      return null;
    };
    
    drawPipe = function(pipe){
      var geometry, graphic;
      geometry = new Polyline({
        paths: pipe.geometry.paths,
        spatialReferences: map.spatialReference
      });
      graphic = new Graphic(geometry,symbols.PICKED_PIPE_LINE_SYMBOL);
      graphicLayer.add(graphic);
      
      if(!graphicLayer.visible){
        graphicLayer.show();
      }
    };
    
    addPipe = function(pipe){
      stateMap.pipeArr.push(pipe);
      stateMap.startConnectionMap[pipe.attributes[pipeFieldMap.startPoint]] = pipe;
      stateMap.endConnectionMap[pipe.attributes[pipeFieldMap.endPoint]] = pipe;
      drawPipe(pipe);
    };
    
    queryResultHandler = function(inputData){
      var pipe, data;
      if(!inputData){
        return false;
      }
      if(inputData.substring){//如果是字符串，先解析
        data = JSON.parse(inputData);
      }else{
        data = inputData;
      }
      pipe = pickOne(data);
      if(pipe){
        addPipe(pipe);
      }
    };
    
    sortPipes = function(pipes){
      var point, pipe, result = [];
      for(point in stateMap.startConnectionMap){
        if(stateMap.startConnectionMap.hasOwnProperty(point)){
          if(!stateMap.endConnectionMap[point]){
            pipe = stateMap.startConnectionMap[point];
            break;
          }
        }
      }
      if(pipe){
        result.push(pipe);        
        while(stateMap.startConnectionMap[pipe.attributes[pipeFieldMap.endPoint]]){
          pipe = stateMap.startConnectionMap[pipe.attributes[pipeFieldMap.endPoint]];
          result.push(pipe);
        }
      }
      return result;
    };
    
    useTool = function(tool,inputData,options){
      var i;
      tool.use(inputData,options);      
    };
    
    endPickHandler = function(event){
      var i, selectAreaGeometry, paths, sortedPipes;
      if(window.confirm("确定显示图表？")){
        if(curTool){
          sortedPipes = sortPipes(stateMap.pipeArr);
          paths = []; 
          for(i=0;i<sortedPipes.length;i+=1){
            paths.push(sortedPipes[i].geometry.paths[0]);
          }
          selectAreaGeometry = new Polyline({
            'paths': paths,
            spatialReference: map.spatialReference
          });
          useTool(curTool,{features:sortedPipes},{'selectAreaGeometry':lang.clone(selectAreaGeometry)});
        }
        deactivatePick();
      }
    };
    
    clickPickHandler = function(event,qUrl){
      // TODO
      // * 在点击点处生成一个圆形区域（半径5米）
      // * 使用圆形进行查询
      // * 使用查询的结果，判断是否跟stateMap.pipeArr数组中的管道相连，使用选择策略（定义一个选择方法进行选择），选择一条加入数组
      // * 用户可以取消已经选择的管线中的一些
      // * 触发"确定"之后将查询到的管道数组传入tool工具
      var circle,queryOptions;
      circle = new Circle(event.mapPoint,{
        radius: 1,
        radiusUnit: units.METERS
      });
      
      queryOptions = {//查询参数
        geometryType: 'polygon',
        geometryParamName: 'geometry',
        geometryTypeParamName: 'geometryType',
        queryUrl: qUrl,
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
      
      if(map.infoWindow.isShowing){
        map.infoWindow.hide();
      }
      
      queryUtils.query(circle,queryResultHandler,queryOptions);
    };
    
    stop = function(options){
      options = lang.clone(options) || {};
      if(curTool){
        curTool.cancel(options);
        curTool = null;
      }
      graphicLayer.clear();
      graphicLayer.hide();
      deactivatePick();
    };      
    
    deactivatePick = function(){
      if(eventHandlerMap.clickPick){
        eventHandlerMap.clickPick.remove();
        delete eventHandlerMap.clickPick;
      }
      if(eventHandlerMap.endPick){
        eventHandlerMap.endPick.remove();
        delete eventHandlerMap.endClick;
      }
      delete stateMap.pipeArr;
      delete stateMap.startConnectionMap;
      delete stateMap.endConnectionMap;
    };
    
    activatePick = function(options){
      if(eventHandlerMap.clickPick){
        eventHandlerMap.clickPick.remove();
        delete eventHandlerMap.clickPick;
      }
      if(eventHandlerMap.endPick){
        eventHandlerMap.endPick.remove();
        delete eventHandlerMap.endPick;
      }
      
      stateMap.pipeArr = [];
      stateMap.startConnectionMap = {};
      stateMap.endConnectionMap = {};
      options = options || {};

      eventHandlerMap.clickPick = map.on('click',function(event){
        clickPickHandler(event,options.queryUrl);
      });
      eventHandlerMap.endPick = map.on('dbl-click',endPickHandler); 
    };
      
    use = function(tool,options){
      if(!tool){
        throw "A tool is needed for use!";
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
      
      activatePick(options);
    };     
    
    initGraphicLayer = function(){
      graphicLayer = new GraphicsLayer();
      map.addLayer(graphicLayer);
      graphicLayer.hide();
    };
      
    init = function(pMap,initMap){
      if(!pMap){
        throw "A esri.Map object is neccessary for init this usage!";
      }
      initMap = lang.clone(initMap) || {};
      
      map = pMap;
      
      initGraphicLayer();
      
      initDone = true;
    };
    
    exports = {
      name: 'pick-and-analyse',
      init: init,
      use: use,
      stop: stop
    };
    
    return new AnalyseUsage(exports);
  };
});
