/** 
 *坡度分析工具 
 */
define([
  'dojo/_base/lang',
  'dojo/string',
  'dojo/dom-construct',
  'esri/dijit/Popup',
  'esri/Color',
  'esri/graphic',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/geometry/Point',
  'esri/geometry/Polyline',
  'esri/layers/GraphicsLayer',
  'analyse-tools/interfaces/analyse-tool'
],function(lang,string,domConstruct,Popup,Color,Graphic,SimpleFillSymbol,SimpleLineSymbol,Point,Polyline,GraphicsLayer,AnalyseTool){
  "use strict"; 
  return function(){
    var 
      exports,
      graphicLayer,
      tablePopup,
      featurePopup,
      symbols = {
        'POPUP_WINDOW_FILL_SYMBOL': new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,null,new Color([255,0,0])),
        'SELECT_AREA_FILL_SYMBOL': new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,null,new Color([255,0,0,0.1])),
        'SELECT_LINE_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([255,0,0,0.5]),2),
        'LINE_HIGHLIGHT_SYMBOL': new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([255,0,0]),2) 
      },
      geometryElementNameMap = {
        'polygon': 'rings',
        'polyline': 'paths',
        'line': 'paths'
      },
      templateMap = {
        'featurePopupTemplate':
          "<ul>"
           +"<li>路名: ${roadName}</li>"
           +"<li>起点: ${startPoint}</li>"
           +"<li>终点: ${endPoint}</li>"
           +"<li>起点埋深(m): ${startDeep}</li>"
           +"<li>终点埋深(m): ${endDeep}</li>"
           +"<li>坡度: ${pitch}</li>"
         +"</ul>"
      },
      map,
      initDone = false,
      hideTablePopup,
      hideFeaturePopup,
      getLinesFromPolyline,
      initPopups,
      initGraphicLayer,
      getPopupTablePosition,
      addGraphicToMap,
      getPitch,
      drawPipe,
      analysePitch,
      popupTable,
      popupFeature,
      init,
      use,
      cancel;
    
    /**
     * 弹窗显示数据表格
     */
    popupTable = function(data,pos){
      var pipes,fields,rows,header,i,k,content;
      fields = [//弹窗要显示字段
        {field: 'StartPoint',name:'起点'},
        {field: 'EndPoint',name:'终点'},  
        {field: 'Flowdirect',name:'流向'},
        {field: 'RoadName', name:'路名'},
        {field: 'StartDeep', name:'起点埋深(m)'},
        {field: 'EndDeep',name:'终点埋深(m)'},
        {field: 'Pitch',name:'坡度'}
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
      tablePopup.setTitle("坡度分析");
      tablePopup.setContent(content);
      tablePopup.resize(500,300);
      tablePopup.show(pos);
    };
    /**
     * 弹窗显示（单个 Feature的）数据提示框
     */
    popupFeature = function(graphic,pos){
      var model = {
        pitch: graphic.attributes.Pitch || "",
        startPoint: graphic.attributes.StartPoint || "",
        endPoint: graphic.attributes.EndPoint || "",
        roadName: graphic.attributes.RoadName || "",
        startDeep: graphic.attributes.StartDeep || "",
        endDeep: graphic.attributes.EndDeep || ""
      };
      featurePopup.setContent(string.substitute(templateMap.featurePopupTemplate,model));
      featurePopup.show(pos);
    };
    
    /**
     * 隐藏表格弹窗 
     */
    hideTablePopup = function(){
      tablePopup.hide();  
      tablePopup.restore();
    };
    
    /**
     * 隐藏提示框 
     */
    hideFeaturePopup = function(){
      featurePopup.hide();
      tablePopup.restore();
    };  
    
    /**
     * 计算管道坡度（斜率） 
     */
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
     * 绘制一个管道的图形 
     */
    drawPipe = function(pipe){
      var geometry,graphic;
      geometry = new Polyline({
        'paths': pipe.geometry.paths,
        'spatialReference':map.spatialReference
      });
      graphic = new Graphic(geometry,symbols.SELECT_LINE_SYMBOL);
      graphic.setAttributes(pipe.attributes);
      addGraphicToMap(graphic);
    };
    
    /**
     * 坡度分析功能的入口
     */
    analysePitch = function(data){
      var i, pipes;
      pipes = data.features;
      for(i=0;i<pipes.length;i+=1){
        pipes[i].attributes.Pitch = getPitch(pipes[i]); //添加坡度属性
        drawPipe(pipes[i]);
      }
      if(!graphicLayer.visible){
        graphicLayer.show();
      }
    };
    
    /**
     * 初始化图形层 
     */
    initGraphicLayer = function(){
      graphicLayer = new GraphicsLayer();
      map.addLayer(graphicLayer);
      graphicLayer.on('mouse-over',function(event){
        event.graphic.setSymbol(symbols.LINE_HIGHLIGHT_SYMBOL);
        popupFeature(event.graphic,event.mapPoint);
      });
      graphicLayer.on('mouse-out',function(event){
        event.graphic.setSymbol(symbols.SELECT_LINE_SYMBOL);
        hideFeaturePopup();
      });
      graphicLayer.hide();
    };
    
    /**
     * 将一个图形绘制到图形层上 
     */
    addGraphicToMap = function(graphic){
      graphicLayer.add(graphic);
    };
    
    /**
     * 初始化弹窗（表格弹窗，提示窗） 
     */
    initPopups = function(){
      var createOptions = {
        anchor: 'top',
        offsetX: 10,
        offsetY: 10,
        zoomFactor: 2,
        fillSymbol:symbols.POPUP_WINDOW_FILL_SYMBOL
      };
      tablePopup = new Popup(createOptions,domConstruct.create("div"));
      featurePopup = new Popup(createOptions,domConstruct.create("div"));
      
      tablePopup.setMap(map);
      featurePopup.setMap(map);
      
      hideTablePopup();
      hideFeaturePopup(); 
    };
    
    /**
     * 计算表格弹窗的位置 
     */
    getPopupTablePosition = function(geometry){
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
     * 取消分析的入口 
     */
    cancel = function(options){
      options = lang.clone(options) || {};
      graphicLayer.clear();
      hideTablePopup();
      hideFeaturePopup();
      graphicLayer.hide();
    };
    
    /**
     * 坡度分析对外的调用入口 
     */
    use = function(inputData,options){
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
      /*
      symbol = selectAreaGeometry.type.match(/line/i)? symbols.SELECT_LINE_SYMBOL:symbols.SELECT_AREA_FILL_SYMBOL;
      selectAreaGraphic =  new Graphic(selectAreaGeometry,symbol);
      addGraphicToMap(selectAreaGraphic);
      */
      analysePitch(data);
      
      popupTable(data,getPopupTablePosition(selectAreaGeometry));
    };
    
    /**
     * 初始化方法 
     */
    init = function(pMap, initMap){
      if(!pMap){
        throw "A esri.Map object is neccessary for init this tool!";
      }
      map = pMap;
      
      initMap = lang.clone(initMap) || {};
      
      initGraphicLayer();
      
      initPopups();
      
      initDone = true;
    };
    
    exports = {//导出公有属性和方法
      name: 'pitch-analyse',
      init: init,
      use: use,
      cancel: cancel
    };
    
    return new AnalyseTool(exports); //返回一个AnalyseTool接口实例
  };
});
