/**
 * 纵断面分析工具 
 */
define([
  'dojo/on',
  'dojo/html',
  'dojo/dom',
  'dojo/dom-construct',
  'dojo/dom-style',
  'dojo/dom-class',
  'dojo/_base/lang',
  'dojo/json',
  'esri/layers/GraphicsLayer',
  'esri/graphic',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/PictureMarkerSymbol',
  'esri/Color',
  'esri/geometry/Polyline',
  'esri/geometry/Point',
  'esri/geometry/screenUtils',
  'analyse-tools/lib/zdm-pipe-chart/js/zdm-pipe-chart',
  'analyse-tools/interfaces/analyse-tool'
],function(on,html,dom,domConstruct,domStyle,domClass,lang,JSON,GraphicsLayer,Graphic,SimpleFillSymbol,SimpleLineSymbol,PictureMarkerSymbol,Color,Polyline,Point,screenUtils,ZDMPipeChart,AnalyseTool){
  "use strict";
  return function(){
    var
      map,
      graphicLayer,
      chart,
      exports,
      chartState = {},
      queryMap = {},
      eventHandlerMap = {},
      domMap = {
        miniIconHtml: 
           "<div class=\"zdm-pipe-chart-mini-icon-wrapper\">"
          +"</div>"
      },
      symbols = {
        'SELECT_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,255,0.5]),2),
        'PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([255,0,0]),2)
      },
      geometryElementNameMap = {
        'polygon': 'rings',
        'polyline': 'paths',
        'line': 'paths'
      },
      use,
      init,
      cancel,
      initGraphicLayer,
      initChart,
      analyseZDM,
      makePipeGraphic,
      addGraphicToMap,
      toggle,
      getMiniIconPosition,
      maximize,
      minimize,
      hide,
      show,
      clearGraphics;
   /**
    * 隐藏纵断面分析界面 
    */
   hide = function(){
     minimize();
     domStyle.set(queryMap.main,'display','none');
     graphicLayer.hide();
   };
   /**
    * 显示纵断面分析界面
    */
   show = function(){
     maximize();
     domStyle.set(queryMap.main,'display','');
     graphicLayer.show();
   };    
   /**
    * 使图表在'最大化'和'最小化'之间切换 
    */
   toggle = function(){
     if(domClass.contains(queryMap.main,'zdm-pipe-chart-minimized')){
       maximize();
     }else{
       minimize();
     }
   };
   
   /**
    *  根据选区，计算'最大化/最小化'按钮应该出现的位置 
    */
   getMiniIconPosition = function(geometry){
     var pos,maxX,maxY,paths,i,k;
     if(!geometryElementNameMap[geometry.type]){
       return map.position;
     }
     paths = geometry[geometryElementNameMap[geometry.type]];
     maxX = maxY = -6666666666666;
     for(i=0;i<paths.length;i+=1){ //找选择区的右上角坐标
       for(k=0;k<paths[i].length;k+=1){
         maxX = maxX < paths[i][k][0]?paths[i][k][0]:maxX;
         maxY = maxY < paths[i][k][1]?paths[i][k][1]:maxY;
       }
     }
     pos = map.toScreen(new Point(maxX,maxY,map.spatialReference));
     return pos;
   };
   /**
    * 最大化分析图表 
    */
   maximize = function(){
     html.set(queryMap.miniIcon,'纵截面分析图表 -');
     domClass.replace(queryMap.main,'zdm-pipe-chart-maximized','zdm-pipe-chart-minimized');
     domStyle.set(queryMap.miniIcon,"left","45%");
     domStyle.set(queryMap.miniIcon,"top","0px");
   };
   /**
    * 最小化分析图表 
    */
   minimize = function(){
     var x, y;
     html.set(queryMap.miniIcon,'纵截面分析图表  +');
     domClass.replace(queryMap.main,'zdm-pipe-chart-minimized','zdm-pipe-chart-maximized');
     x = chartState.miniIconPosition.x;
     y = chartState.miniIconPosition.y;
     domStyle.set(queryMap.miniIcon,"left",x+(!isNaN(x) || x.indexOf('%') === -1?"px":""));
     domStyle.set(queryMap.miniIcon,"top",y+(!isNaN(y) || y.indexOf('%') === -1?"px":""));
   };    
   
   initGraphicLayer = function(){
     graphicLayer = new GraphicsLayer();
     map.addLayer(graphicLayer);
     graphicLayer.hide();
   };
      
   /**
    * options:
    *  - parentContainerId 图表父容器的id（父容器包含'图容器'和'表容器'）
    *  - chartPluginPath 图表插件的地址，用于配置zdm-pipe-chart插件
    *  - chartContainerId 图表插件的（图）容器id
    *  - tableContainerId 图标插件的（表）容器id，如果不显示表，则此项可选
    */
    initChart = function(options){
      chart = new ZDMPipeChart();
      chart.config({
        pluginPath: options.chartPluginPath
      });
      
      if(!options || !options.parentContainerId){
        throw "A 'parentContainerId' option is neccessary for init this tool!";
      }
      
      if(!options.chartContainerId){
        throw "A 'chartContainerId' option is neccessary for init this tool!";
      }
      
      queryMap.main = dom.byId(options.parentContainerId);
      
      queryMap.miniIcon = domConstruct.toDom(domMap.miniIconHtml);
      domConstruct.place(queryMap.miniIcon,queryMap.main);
      
      chartState.miniIconPosition = {x:"40%",y:"0px"};
      
      on(queryMap.miniIcon,'click',toggle);
      
      chart.init({
        parentId: options.chartContainerId,
        tableId: options.tableContainerId
      });
    };
    /**
     * 清空纵断面分析的图形 
     */
    clearGraphics = function(){
      graphicLayer.clear();
    };
    /**
     * 取消纵断面分析 
     */
    cancel = function(options){
      clearGraphics();
      hide();
    };
    
    /**
     * 将指定的图形添加到地图上 
     */
    addGraphicToMap = function(graphic){
      graphicLayer.add(graphic);
    };
    
    /**
     * 生成一根管线的图形 
     */
    makePipeGraphic = function(pipe){
      var graphic, geometry;
      geometry = new Polyline({
        paths: pipe.geometry.paths,
        spatialReference: map.spatialReference
      });
      graphic = new Graphic(geometry,symbols.PIPE_LINE_SYMBOL);
      return graphic;
    };
    
    /**
     * 进行纵断面分析，即利用管线数据在图表上生成管道图像和表格数据
     */
    analyseZDM = function(data){
      var i, pipes, pipeArr = [], graphic;
      pipes = data.features;
      for(i=0;i<pipes.length;i+=1){
        pipeArr.push(pipes[i].attributes);
        graphic = makePipeGraphic(pipes[i]);
        addGraphicToMap(graphic);
      }
      chart.setPipes(pipeArr);
    };
    
    /**
     * 外部调用纵断面分析的入口 
     */
    use = function(inputData,options){
      var data, selectLineGeometry, selectLineGraphic, miniIconPosition;
      options = lang.clone(options) || {};
      if(!inputData){
        return false;
      }
      if(inputData.substring){//如果是字符串，先解析
        data = JSON.parse(inputData); 
      }else{
        data = inputData;
      }
      if(!data.features){
        return false;
      }
      //显示选中区域
      if(options.selectAreaGeometry){
        selectLineGeometry = options.selectAreaGeometry;
        selectLineGraphic =  new Graphic(selectLineGeometry,symbols.SELECT_LINE_SYMBOL);
        addGraphicToMap(selectLineGraphic);
      }
      
      analyseZDM(data);
      
      miniIconPosition = getMiniIconPosition(selectLineGeometry);
      
      chartState.miniIconPosition = miniIconPosition;
      
      show();//先显示，后画图
      chart.draw();//注意！！图表必需在图表显示的时候调用，因为显示时插件才能计算容器的高度
    };
    
    /**
     * 初始化工具 
     */
    init = function(pMap,initMap){
      if(!pMap){
        throw "A esri.Map object is neccessary for init this tool!";
      }
      
      initMap = lang.clone(initMap) || {};
      
      map = pMap;
      
      initGraphicLayer();
      initChart(initMap);
      
      hide();
    };
      
    exports = {//导出公有方法
      name: 'zdm-analyse',
      use: use,
      init: init,
      cancel: cancel
    };
    
    return new AnalyseTool(exports); //返回一个分析工具的接口实例
  };
});
