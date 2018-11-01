/**
 * 流向分析工具 
 */
define([
  'dojo/_base/lang',
  'dojo/json',
  'dojo/dom-construct',
  'esri/layers/GraphicsLayer',
  'esri/graphic',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/PictureMarkerSymbol',
  'esri/Color',
  'esri/dijit/Popup',
  'esri/geometry/Polyline',
  'esri/geometry/Point',
  'analyse-tools/interfaces/analyse-tool'
],function(lang,JSON,domConstruct,GraphicsLayer,Graphic,SimpleFillSymbol,SimpleLineSymbol,PictureMarkerSymbol,Color, Popup, Polyline,Point,AnalyseTool){
  "use strict";
  return function(){
    var 
      map,
      graphicLayer,
      popupWindow,
      images = {
        'FLOW_DIRECT_ARROW':{src:'img/arrow.png',width:8,height:10}
      },
      symbols = {
        'SELECT_AREA_FILL_SYMBOL': new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,null,new Color([255,0,0,0.1])),
        'SELECT_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,255,0.5]),2),
        'FLOW_DIRECT_PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([255,0,0]),2),
        'FLOW_DIRECT_ARROW_MARKER_SYMBOL': function(){return new PictureMarkerSymbol(images.FLOW_DIRECT_ARROW.src,images.FLOW_DIRECT_ARROW.width,images.FLOW_DIRECT_ARROW.height);},
        'POPUP_WINDOW_FILL_SYMBOL': new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,null,new Color([255,0,0]))        
      },
      geometryElementNameMap = {
        'polygon': 'rings',
        'polyline': 'paths',
        'line': 'paths'
      },
      initDone = false,
      exports,
      use,
      cancel,
      init,
      initGraphicLayer,
      initPopupWindow,
      analyseFlowdirect,
      popupFlowdirectInfo,
      hidePopup,
      getPopupPosition,
      addGraphicToMap,
      clearGraphics,
      formatPipe,
      makePipeGraphic,
      makePipeArrowGraphic,
      getFlowdirectArrowRotateAngle;
  
    /**
     *  获取弹窗的位置 
     */
    getPopupPosition = function(geometry){
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
      return new Point(maxX,maxY,map.spatialReference);
    };
    /**
     * 隐藏弹窗 
     */
    hidePopup = function(){
      popupWindow.hide();      
    };

    /**
     * 弹窗显示数据表格
     */
    popupFlowdirectInfo = function(data,pos){
      var pipes,fields,rows,header,i,k,content;
      fields = [//弹窗要显示字段
        {field: 'StartPoint',name:'起点'},
        {field: 'EndPoint',name:'终点'},  
        {field: 'Flowdirect',name:'流向'},
        {field: 'RoadName', name:'路名'},
        {field: 'StartDeep', name:'起点埋深(m)'},
        {field: 'EndDeep',name:'终点埋深(m)'}
      ];
      pipes = data.features;
      rows = "";
      for(i=0;i<pipes.length;i+=1){
        rows += "<tr>";
        for(k =0;k < fields.length;k+=1){
          rows += "<td>"+pipes[i].attributes[fields[k].field]+"</td>"; 
        }
        rows += "</tr>";
      }
      header = "<tr>";
      for(i=0;i<fields.length;i+=1){
        header += "<th field=\""+fields[i].field+"\" width=\"150\">"+fields[i].name+"</th>";  
      }
      header += "</tr>";
      content =
         "<div style=\"width:100%;height:200px;\">"
          +"<table class=\"easyui-datagrid\" style=\"width:100%;text-align:center;\" border=\"1\" cellspacing=\"0\">"
            + "<thead>"
              + header
            + "</thead>"
            + "<tbody>"
              + rows
            + "</tbody>"
          +"</table>"
        +"</div>"
      ;
      popupWindow.setTitle("流向分析");
      popupWindow.setContent(content);
      popupWindow.resize(500,300);
      popupWindow.show(pos);
    };
    
    /**
     * 清除流向分析的图形 
     */
    clearGraphics = function(){
      graphicLayer.clear();
      graphicLayer.hide();
    };
    
    /**
     * 往地图上添加图形 
     */
    addGraphicToMap = function(graphic){
      graphicLayer.add(graphic);
    };
    
    /**
     * 获取管道流向箭头的旋转角度（初始角度是箭头垂直向上） 
     */
    getFlowdirectArrowRotateAngle = function(from,to){
      var dir,angle;
      dir = to[1] > from[1];
      if(to[1] === from[1]){//管线水平
        return to[0] > from[0]? 90:-90;
      }
      if(to[0] === from[0]){//管线垂直
        return dir?0:180;
      }
      angle = Math.atan(-((to[0] - from[0]) / (to[1] - from[1])));//根据垂直直线的两直线斜率相乘为-1，得到箭头底边的斜率->角度
      return -(angle / Math.PI * 180) + (dir?0:180); //弧度转换成角度
    };
    
    /**
     * 生成管道流向箭头的图形 
     */
    makePipeArrowGraphic = function(pipe){
      var from, to, point, symbol, graphic;
      from = pipe.geometry.paths[0][pipe.attributes.Flowdirect];//根据流向选择水流的终点
      to = pipe.geometry.paths[0][Math.abs(pipe.attributes.Flowdirect - 1)];//根据流向选择水流的起点（不是管道的起点）
      point = new Point((to[0]+from[0])/2,(to[1]+from[1])/2,map.spatialReference);//在终点处画箭头
      symbol = symbols.FLOW_DIRECT_ARROW_MARKER_SYMBOL();
      symbol.setAngle(getFlowdirectArrowRotateAngle(from,to));
      graphic = new Graphic(point,symbol);
      return graphic;
    };
    
    /**
     * 生成一个管道的图形 
     */
    makePipeGraphic = function(pipe){
      var graphic, geometry;
      geometry = new Polyline({
        paths: pipe.geometry.paths,
        spatialReference: map.spatialReference
      });
      graphic = new Graphic(geometry,symbols.FLOW_DIRECT_PIPE_LINE_SYMBOL);
      addGraphicToMap(graphic);
       //不画箭头
      graphic = makePipeArrowGraphic(pipe);
      addGraphicToMap(graphic);
    };
    
    formatPipe = function(pipe){
      pipe.attributes.Flowdirect = parseInt(pipe.attributes.Flowdirect);
    };
    
    /**
     * 流向分析主方法 
     */
    analyseFlowdirect = function(data){
      var i, pipes = data.features;
      for(i=0;i<pipes.length;i+=1){
        formatPipe(pipes[i]);
        makePipeGraphic(pipes[i]);
      }
      graphicLayer.show();
    };

    /**
     * 对外提供的流向分析调用入口 
     */
    use = function(inputData,options){//实现分析方法
      var data, selectAreaGeometry, selectAreaGraphic, symbol;
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
      selectAreaGeometry = options.selectAreaGeometry;
      //根据选区的几何类型，选择合适的Symbol
      symbol = selectAreaGeometry.type.match(/line/i)? symbols.SELECT_LINE_SYMBOL:symbols.SELECT_AREA_FILL_SYMBOL;
      selectAreaGraphic =  new Graphic(selectAreaGeometry,symbol);
      addGraphicToMap(selectAreaGraphic);
      //分析管道流向，并绘制管道图像
      analyseFlowdirect(data);
      //弹窗显示管道信息列表
      popupFlowdirectInfo(data,getPopupPosition(selectAreaGeometry));
    };
    
    /**
     * 对外提供的流向分析取消入口 
     */
    cancel = function(options){//取消分析
      clearGraphics();
      hidePopup();
    };
    
    initGraphicLayer = function(){
      graphicLayer = new GraphicsLayer();
      map.addLayer(graphicLayer);
      graphicLayer.hide();
    };
    
    initPopupWindow = function(){
      popupWindow = new Popup({
        anchor: 'top',
        offsetX: 10,
        offsetY: 10,
        zoomFactor: 2,
        fillSymbol: symbols.POPUP_WINDOW_FILL_SYMBOL
      }, domConstruct.create("div"));
      popupWindow.setMap(map);
      hidePopup();
    };

    /**
     * 对外提供的初始化方法 
     */
    init = function(pMap,initMap){
      if(!pMap){
        throw "A esri.Map object is neccessary for init this tool!";
      }
      
      initMap = lang.clone(initMap) || {};
      map = pMap;
      
      initGraphicLayer();
      initPopupWindow();
      
      initDone = true;
    };
    
    exports = {//导出公有属性和方法
      name: 'flowdirect-analyse',
      use: use,
      init: init,
      cancel: cancel
    };
    
    return new AnalyseTool(exports);//返回一个符合analyse-tool接口的实例
  };
});
