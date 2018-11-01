/**
 * 逆管分析工具 
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
        'FLOW_DIRECT_ARROW': 'img/arrow.png'
      },
      symbols = {
        'SELECT_AREA_FILL_SYMBOL': new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,null,new Color([255,0,0,0.1])),
        'SELECT_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,255,0.5]),2),
        'FLOW_DIRECT_PIPE_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([255,0,0]),2),
        'FLOW_DIRECT_ARROW_MARKER_SYMBOL': new PictureMarkerSymbol(images.FLOW_DIRECT_ARROW,8,10),
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
      getReversedPipes,
      analyseReversedPipes,
      popupPipeInfo,
      hidePopup,
      getPopupPosition,
      addGraphicToMap,
      clearGraphics,
      makePipeGraphic,
      makePipeArrowGraphic,
      getPitch,
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
    popupPipeInfo = function(data,pos){
      var pipes,fields,rows,header,i,k,content;
      fields = [//弹窗要显示字段
        {field: 'StartPoint',name:'起点'},
        {field: 'EndPoint',name:'终点'},
        {field: 'Pitch',name:'坡度'},  
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
      popupWindow.setTitle("逆管分析");
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
      /* 不画箭头
      graphic = makePipeArrowGraphic(pipe);
      addGraphicToMap(graphic);
      */
    };
    
    getPitch = function(feature){
      var 
        attrs = feature.attributes,
        ds = parseFloat(attrs.StartDeep),//起点埋深
        de = parseFloat(attrs.EndDeep),//终点埋深
        length = parseFloat(attrs.LEN),//管长
        sin, tan;
      sin = (ds - de) / length; //终点低于起点，即终点埋深大于起点埋深时，坡度为负数
      tan = Math.tan(Math.asin(sin));
      return tan;
    };
    
    /**
     * 逆管分析主方法 
     */
    analyseReversedPipes = function(data){
      var i, pipes = data.features;
      for(i=0;i<pipes.length;i+=1){
        if(pipes[i].attributes.Pitch < 0){
          makePipeGraphic(pipes[i]);
        }
      }
      graphicLayer.show();
    };

    /**
     * 从数据中找出逆管
     * 因为查询不在此模块中进行，所以无法传入的查询结果只有逆管，所以为了保证这一点，这里做一次过滤；
     * 应用时最好在查询参数中设置好where条件，只查询出逆管，在传入此模块 
     */
    getReversedPipes = function(data){
      var i,rPipes = [];
      for(i=0;i<data.features.length;i+=1){
        data.features[i].attributes.Pitch = getPitch(data.features[i]);
        if(data.features[i].attributes.Pitch < 0){
          rPipes.push(data.features[i]);
        }
      }
      data.features = rPipes;
      return data;
    };

    /**
     * 对外提供的逆管分析调用入口 
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
      
      //过滤掉非逆管
      data = getReversedPipes(data);
      
      //分析管道流向，并绘制管道图像
      analyseReversedPipes(data);
      //弹窗显示管道信息列表
      popupPipeInfo(data,getPopupPosition(selectAreaGeometry));
    };
    
    /**
     * 对外提供的逆流分析取消入口 
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
      name: 'reversed-pipe-analyse',
      use: use,
      init: init,
      cancel: cancel
    };
    
    return new AnalyseTool(exports);//返回一个符合analyse-tool接口的实例
  };
});