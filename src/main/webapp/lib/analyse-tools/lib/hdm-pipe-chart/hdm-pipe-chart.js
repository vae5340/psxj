/**
 * 横断面图表插件 
 */
define([
  'dojo/string',
  'dojo/dom',
  'dojox/gfx',
  'dojo/mouse',
  'dojo/_base/lang',
  'dojo/query',
  'dojo/dom-construct',
  'dojo/dom-class',
  'dojo/on'
],function(string,dom,gfx,mouse,lang,query,domConstruct,domClass,on){
  "use strict";
  return function(){
    var
      exports,
      initDone = false,
      configDone = false,
      mouseState = {},
      dataMap = {},
      gfxMap = {},
      queryMap = {},
      eventHandlerMap = {},
      defaultConfigMap = {
        statusTemplate:'起点埋深(m):${startDeep} | 终点埋深(m):${endDeep} | 管径(mm):${width}',
        pluginPath: '.',
        groundBg: '/css/img/ground.jpg',
        undergroundBg: '/css/img/underground.png',
        statusBarHeight: 30,
        statusFontSize: 20,
        groundHeight: 60,
        scale: {
          x: 1,
          y: 1
        },
        tableFields: [
          'bCode',
          'cabCount',
          'width',
          'dType',
          'endDeep',
          'endPoint',
          'flowdirect',
          'holeCount',
          'lineStyle',
          'material',
          'mDate',
          'objectId',
          'pDS',
          'pEDeep',
          'pMaterial',
          'pSDeep',
          'roadName',
          'length',
          'surDate',
          'startDeep',
          'startPoint',
          'status',
          'surDate'
        ],
        tableFieldNameMap: {
          'bCode':'BCode',
          'cabCount':'CabCount',
          'width':'管径(mm)',
          'dType':'DType',
          'endDeep':'终点埋深(m)',
          'endPoint':'EndPoint',
          'flowdirect':'流向',
          'holeCount':'HoleCount',
          'lineStyle':'LineStyle',
          'material':'Material',
          'mDate':'Mdate',
          'objectId':'OBJECTID',
          'pDS':'PDS',
          'pEDeep':'PEdeep',
          'pMaterial':'PMaterial',
          'pSDeep':'PSDeep',
          'roadName':'路名',
          'length':'管长(m)',
          'surDate':'SurDate',
          'startDeep':'起点埋深(m)',
          'startPoint':'StartPoint',
          'status':'Status'
        },
        internalFieldMap: {
          'bCode':'BCode',
          'cabCount':'CabCount',
          'width':'DS',
          'dType':'DType',
          'endDeep':'EndDeep',
          'endPoint':'EndPoint',
          'flowdirect':'Flowdirect',
          'holeCount': 'HoleCount',
          'lineStyle': 'LineStyle',
          'material': 'Material',
          'mDate':'Mdate',
          'objectId':'OBJECTID',
          'pDS':'PDS',
          'pEDeep':'PEdeep',
          'pMaterial':'PMaterial',
          'pSDeep':'PSdeep',
          'roadName':'RoadName',
          'length':'LEN',
          'surUnit':'SurDate',
          'startDeep':'StartDeep',
          'startPoint':'StartPoint',
          'status':'Status',
          'surDate':'SurDate'
        }
      },
        /* original
        tableFields: [
          'bCode', 'cabCount', 'width', 'dType', 'enabled', 'endDeep', 'endPoint','fId',
          'fX', 'fY', 'flowdirect', 'holeCount', 'lineStyle', 'material', 'mDate', 'objectId',
          'pDS', 'pEDeep', 'pMaterial', 'pSDeep','pressure', 'roadName', 'length', 'surUnit', 'startDeep',
          'startPoint', 'status', 'surDate', 'tX', 'tY', 'typeInfo', 'voltage'
        ],
        tableFieldNameMap: {
          'bCode':'B_Code',
          'cabCount':'Cab_Count',
          'width':'管径(mm)',
          'dType':'D_Type',
          'enabled':'Enabled',
          'endDeep':'终点埋深(m)',
          'endPoint':'终点',
          'fId':'FID',
          'fX':'FX',
          'fY':'FY',
          'flowdirect':'流向',
          'holeCount': 'Hole_Count',
          'lineStyle': 'Line_Style',
          'material': 'Material',
          'mDate':'Mdate',
          'objectId':'OBJECTID',
          'pDS':'P_D_S',
          'pEDeep':'P_Edeep',
          'pMaterial':'P_Material',
          'pSDeep':'P_Sdeep',
          'pressure':'Pressure',
          'roadName':'路名',
          'length':'管长',
          'surUnit':'Sur_Date',
          'startDeep':'起点埋深(m)',
          'startPoint':'起点',
          'status':'Status',
          'surDate':'Sur_Date',
          'tX':'TX',
          'tY':'TY',
          'typeInfo':'TYPEINFO',
          'voltage':'Voltage'
        },
        internalFieldMap:{
          'bCode':'B_Code',
          'cabCount':'Cab_Count',
          'width':'D_S',
          'dType':'D_Type',
          'enabled':'Enabled',
          'endDeep':'End_Deep',
          'endPoint':'End_Point',
          'fId':'FID',
          'fX':'FX',
          'fY':'FY',
          'flowdirect':'Flowdirect',
          'holeCount': 'Hole_Count',
          'lineStyle': 'Line_Style',
          'material': 'Material',
          'mDate':'Mdate',
          'objectId':'OBJECTID',
          'pDS':'P_D_S',
          'pEDeep':'P_Edeep',
          'pMaterial':'P_Material',
          'pSDeep':'P_Sdeep',
          'pressure':'Pressure',
          'roadName':'Road_name',
          'length':'SHAPE_Leng',
          'surUnit':'Sur_Date',
          'startDeep':'Start_Deep',
          'startPoint':'Start_Poin',
          'status':'Status',
          'surDate':'Sur_Date',
          'tX':'TX',
          'tY':'TY',
          'typeInfo':'TYPEINFO',
          'voltage':'Voltage'
        }
      },
      */
      domMap = {
        tableHtml:
          "<div class=\"hdm-pipe-chart-table-wrapper\">"
            +"<table class=\"hdm-pipe-chart-table\" border=\"0\" cellspacing=\"0\">"
            +"</table>"
         +"</div>"
      },
      configMap = {
      },
      strokes = {
        'GROUND_LINE_STROKE': {color: [255,255,255], style: 'ShortDash', width: 2},
        'ROUND_PIPE_STROKE': {color: [0,0,0], style: 'Solid', width: 2},
        'ROUND_PIPE_STROKE_HIGHLIGHT': {color: [100,100,100], style: 'Solid', width: 2},
        'RECT_PIPE_STROKE': {color: [0,0,0], style: 'Solid', width: 2},
        'RECT_PIPE_STROKE_HIGHLIGHT': {color: [255,0,0], style: 'Solid', width: 2}
      },
      fills = {
        'STATUS_BAR_FILL': [0,0,0,0.5],
        'STATUS_TEXT_FILL': [255,255,255],
        'ROUND_PIPE_FILL': [200,200,200],
        'ROUND_PIPE_FILL_HIGHLIGHT': [255,255,255],
        'RECT_PIPE_FILL': [200,200,200],
        'RECT_PIPE_FILL_HIGHLIGHT': [255,255,255]
      },
      init,
      config,
      destroy,
      draw,
      setPipes,
      clear,
      drawPipes,
      removeEventHandler,
      initChart,
      initTable,
      initGFX,
      initGround,
      initStatusBar,
      updateTable,
      computeScale,
      getInternalField,
      getExternalField,
      formatInput,
      formatInputPipe,
      setStatus,
      beforeDraw,
      drawPipe,
      afterDraw,
      rearrangeZIndex,
      mouseOverPipeHandler,
      mouseOutPipeHandler,
      mouseOverGroundHandler,
      mouseOverTableRowHandler,
      mouseOutTableRowHandler,
      highlightTableRow,
      unhighlightTableRow,
      highlightPipe,
      unhighlightPipe,
      formatPipeStatus,
      getTableRowFromPipe,
      getPipeFromTableRow,
      configInternalFieldMap,
      configTableFieldNameMap,
      configTableFields;
    
    /**
     * 使用内部字段名获取对应字段的外部格式数据的值 
     * @param pipe
     * @param field 内部字段名
     */
    getExternalField = function(pipe, field){
      return pipe.attributes[configMap.internalFieldMap[field]];
    };     
    /**
     * 使用内部字段名获取对应字段的内部格式数据的值 
     * @pipe 
     * @param field 内部字段名 
     */
    getInternalField = function(pipe, field){
      return pipe.__internal[field];
    };
    
    /**
     * 重新调整各图形Z-Index的值 
     */
    rearrangeZIndex = function(){
      gfxMap.groundGroup.moveToBack();
    };
    
    /**
     * 画图之前的准备工作 
     */
    beforeDraw = function(){
      computeScale(dataMap.pipeArr);
    };
    
    /**
     * 画图的后置处理器，在画图之后调用此函数 
     */
    afterDraw = function(){
      rearrangeZIndex();
      updateTable(dataMap.pipeArr);
    };
    
    /**
     *  
     */
    formatPipeStatus = function(pipe){
      var 
        dataModel = {},status, prop;
        for(prop in configMap.internalFieldMap){
          if(configMap.internalFieldMap.hasOwnProperty(prop)){
            dataModel[prop] = getExternalField(pipe,prop);
          }
        }
        status = string.substitute(configMap.statusTemplate,dataModel);
      return status;
    };
    
    unhighlightTableRow = function(tr){
      if(tr){
        domClass.remove(tr,'hdm-pipe-chart-table-row-highlight');
      }
    };
    
    highlightTableRow = function(tr){
      if(tr){
        domClass.add(tr,'hdm-pipe-chart-table-row-highlight');
      }
    };
    
    highlightPipe = function(gfxPipe){
      var pipe = gfxPipe.__pipe;
      if(pipe){
        gfxPipe.setStroke(pipe.isRect?strokes.RECT_PIPE_STROKE_HIGHLIGHT:strokes.ROUND_PIPE_STROKE_HIGHLIGHT)
               .setFill(pipe.isRect?fills.RECT_PIPE_FILL_HIGHLIGHT:fills.ROUND_PIPE_FILL_HIGHLIGHT);
        setStatus(formatPipeStatus(pipe));
        gfxPipe.moveToFront();
      }
    };
    
    unhighlightPipe = function(gfxPipe){
      var pipe = gfxPipe.__pipe;
      if(pipe){
        gfxPipe.setStroke(pipe.isRect?strokes.RECT_PIPE_STROKE_HIGHLIGHT:strokes.ROUND_PIPE_STROKE)
               .setFill(pipe.isRect?fills.RECT_PIPE_FILL_HIGHLIGHT:fills.ROUND_PIPE_FILL);
        setStatus('');
      }
    };
    
    getPipeFromTableRow = function(tr){
      if(!queryMap.tableRows || !dataMap.pipeArr || !tr){
        return null;
      }
      var i,index = -1;
      for(i=0;i<queryMap.tableRows.length;i+=1){
        if(queryMap.tableRows[i] === tr){
          index = i;
          break;   
        }
      }
      if(index !== -1){
        return dataMap.pipeArr[index];
      }else{
        return null;
      }
    };
    
    getTableRowFromPipe = function(pipe){
      if(!dataMap.pipeArr || !queryMap.tableRows || !pipe){
        return null;
      }
      var i,index = -1;
      for(i=0;i<dataMap.pipeArr.length;i+=1){
        if(dataMap.pipeArr[i] === pipe){
          index = i;
          break;
        }
      }
      if(index !== -1){
        return queryMap.tableRows[index];
      }else{
        return null;
      }
    };
    
    mouseOverTableRowHandler = function(event){
      var pipe,tr = event.target.parentNode;
      pipe = getPipeFromTableRow(tr);
      highlightTableRow(tr);
      highlightPipe(pipe.__gfxObject);
    };
    
    mouseOutTableRowHandler = function(event){
      var pipe,tr = event.target.parentNode;
      pipe = getPipeFromTableRow(tr);
      unhighlightTableRow(tr);
      unhighlightPipe(pipe.__gfxObject);
    };
    
    mouseOverPipeHandler = function(event){
      var gfxTarget = event.gfxTarget;
      mouseState.overPipe = gfxTarget;
      highlightPipe(gfxTarget);
      highlightTableRow(getTableRowFromPipe(gfxTarget.__pipe));
    };
    
    mouseOverGroundHandler = function(event){
      var gfxTarget;
      if(mouseState.overPipe){
        gfxTarget = mouseState.overPipe;
        unhighlightPipe(gfxTarget); 
        unhighlightTableRow(getTableRowFromPipe(gfxTarget.__pipe));
      }
      event.stopPropagation();
    };
    
    mouseOutPipeHandler = function(event){
      var gfxTarget = event.gfxTarget;
      console.log(gfxTarget);
      unhighlightPipe(gfxTarget); 
      unhighlightTableRow(getTableRowFromPipe(gfxTarget.__pipe));
    };
    
    /**
     * 绘制一条管道 
     */
    drawPipe = function(pipe){
      //TODO
      var 
        p = pipe.__screen,
        rect,
        shape = p.isRect?{
          type: 'rect',
          x: p.x,
          y: p.y,
          width: p.width.width,
          height: p.width.height
        }:{
          type: 'circle',
          cx: p.x,
          cy: p.y,
          r: p.width / 2
        };
      rect = gfxMap.pipeGroup.createShape(shape).setFill(p.isRect?fills.RECT_PIPE_FILL:fills.ROUND_PIPE_FILL).setStroke(p.isRect?strokes.RECT_PIPE_STROKE:strokes.ROUND_PIPE_STROKE);
      rect.__pipe = pipe;
      pipe.__gfxObject = rect;
    };

    /**
     * 画图方法 
     */
    drawPipes = function(){
      var i;
      beforeDraw();
      for(i=0;i<dataMap.pipeArr.length;i+=1){
        drawPipe(dataMap.pipeArr[i]);
      }
      afterDraw();
    };
    
    /**
     * 将一个管道的数据转化成内部格式
     */
    formatInputPipe = function(pipe){
      var internal, curField, matchGroup;
      pipe.__internal = {};
      internal = pipe.__internal;
      curField = getExternalField(pipe,'width');
      internal.isRect = (''+curField).match(/(\d+)x(\d+)/i)?true:false;
      if(internal.isRect){
        matchGroup = curField.split(/x/i);
        internal.width = {
          width: parseFloat(matchGroup[0]) / 1000,
          height: parseFloat(matchGroup[1]) / 1000
        };
      }else{
        internal.width = parseFloat(curField) / 1000;
      }
      curField = getExternalField(pipe,'startDeep');
      internal.startDeep = curField;
      curField = getExternalField(pipe,'endDeep');
      internal.endDeep = curField;
      //get intersectionPoint
      curField = pipe.attributes.intersectionPoint;
      internal.intersectionPoint = curField;
      return pipe;
    };
    
    /**
     * 将外部格式的数据转变成内部数据格式 
     */
    formatInput = function(pipes){
      var i, internalPipes = [];
      for(i=0;i<pipes.length;i+=1){
        internalPipes.push(formatInputPipe(pipes[i]));
      }
      return internalPipes;
    };
    
    /**
     * 计算缩放系数 
     */
    computeScale = function(pipes){
      var i, minX, maxX, minY, maxY, pipe, minPipeWidth, minPipeHeight,
          unitWidth, unitHeight, totalWidth, totalHeight;
      minX = 66666666666666;
      maxX = -66666666666666;
      minY = 66666666666666;
      maxY = -66666666666666;
      minPipeWidth = 6666666666666;
      minPipeHeight = 6666666666666;
      for(i=0;i<pipes.length;i+=1){
        pipe = pipes[i].__internal;
        minX = Math.min(minX,pipe.intersectionPoint.distance - (pipe.isRect?pipe.width.width:pipe.width) / 2);
        maxX = Math.max(maxX,pipe.intersectionPoint.distance + (pipe.isRect?pipe.width.width:pipe.width) / 2);
        minY = Math.min(minY, Math.min(pipe.startDeep,pipe.endDeep) - (pipe.isRect?pipe.width.height:pipe.width) / 2);
        maxY = Math.max(maxY, Math.max(pipe.startDeep,pipe.endDeep) + (pipe.isRect?pipe.width.height:pipe.width) / 2);
        minPipeWidth = Math.min(minPipeWidth,pipe.isRect?pipe.width.width:pipe.width);
        minPipeHeight = Math.min(minPipeHeight,pipe.isRect?pipe.width.height:pipe.width);
      }
      totalHeight = Math.abs(minY - maxY);
      totalWidth = Math.abs(minX - maxX);

      unitHeight = (queryMap.chartParent.offsetHeight - configMap.groundHeight - configMap.statusBarHeight) / totalHeight;
      unitWidth = (queryMap.chartParent.offsetWidth * 0.95) / totalWidth;
      //test
      unitHeight = Math.min(Math.min(unitHeight,unitWidth),65);
      unitWidth = unitHeight;
      
      configMap.scale = {
        x: unitWidth,
        y: unitHeight
      };
      
      for(i=0;i<pipes.length;i+=1){
        pipe = pipes[i].__internal;
        pipes[i].__screen = {
          'isRect': pipe.isRect,
          'x': ((pipe.isRect?pipe.intersectionPoint.distance - pipe.width.width / 2 : pipe.intersectionPoint.distance) - minX) * configMap.scale.x + queryMap.chartParent.offsetWidth * 0.025,
          'y': ((pipe.startDeep + pipe.endDeep) / 2 - (pipe.isRect?pipe.width.height:pipe.width)) * configMap.scale.y + configMap.groundHeight,
          'width': (pipe.isRect?{
            'width': pipe.width.width * configMap.scale.x,
            'height': pipe.width.height * configMap.scale.y 
            }:pipe.width * configMap.scale.x)
        };
      }
    };

    /**
     * 设置管道数据，数组
     */
    setPipes = function(pipes){
      clear();
      //test data
      //pipes = [{"attributes":{"OBJECTID_1":1395,"PipeLine_N":" ","StartPoint":" ","EndPoint_N":" ","Start_Poin":"4-102-11Y4","End_Point":"4-102-11Y5","Start_Deep":10.71,"End_Deep":0.78,"Material":"砼","D_Type":2,"D_S":"3000X3000","P_Sdeep":0,"P_Edeep":0,"P_Material":" ","P_D_S":" ","B_Code":"1010","Mdate":"2015-10","Line_Style":0,"Cab_Count":" ","Voltage":" ","Pressure":" ","Hole_Count":" ","Status":"运行","Road_name":"平海路","SUR_UNIT":"杭州市勘测设计研究院","Sur_Date":1443657600000,"Flowdirect":1,"CivicProje":" ","Project_No":" ","Project_Na":" ","SProject_N":" ","SProject_1":" ","IntoDBTime":null,"UpdateTime":null,"DTProvider":" ","DTProvid_1":" ","Facilities":" ","Faciliti_1":" ","Kind":0,"Length":0,"ConsOrg":" ","ConsDate":null,"Unused":" ","Unused_Met":" ","Picture_ID":" ","PictureNam":" ","PictureTyp":" ","CreateDate":null,"RANK":0,"SHAPE_Leng":31.6561957968,"Shape_Length":0.00032760466061735997,"intersectionPoint":{"x":120.15728445810151,"y":30.256272160332294,"distance":27.95572159105412}},"geometry":{"paths":[[[120.15740480765398,30.25627668459106],[120.15707743423496,30.25626437775626]]]}},{"attributes":{"OBJECTID_1":3398,"PipeLine_N":" ","StartPoint":" ","EndPoint_N":" ","Start_Poin":"4-102-11Y9","End_Point":"4-102-11Y10","Start_Deep":1.9,"End_Deep":2.1,"Material":"砼","D_Type":0,"D_S":"600","P_Sdeep":0,"P_Edeep":0,"P_Material":" ","P_D_S":" ","B_Code":"1010","Mdate":"2015-10","Line_Style":0,"Cab_Count":" ","Voltage":" ","Pressure":" ","Hole_Count":" ","Status":"运行","Road_name":"平海路","SUR_UNIT":"杭州市勘测设计研究院","Sur_Date":1443657600000,"Flowdirect":1,"CivicProje":" ","Project_No":" ","Project_Na":" ","SProject_N":" ","SProject_1":" ","IntoDBTime":null,"UpdateTime":null,"DTProvider":" ","DTProvid_1":" ","Facilities":" ","Faciliti_1":" ","Kind":0,"Length":0,"ConsOrg":" ","ConsDate":null,"Unused":" ","Unused_Met":" ","Picture_ID":" ","PictureNam":" ","PictureTyp":" ","CreateDate":null,"RANK":0,"SHAPE_Leng":31.3377510306,"Shape_Length":0.00032432558995037884,"intersectionPoint":{"x":120.15728445810151,"y":30.25623165621636,"distance":23.46557719097621}},"geometry":{"paths":[[[120.15740469057974,30.256235684015685],[120.15708054682497,30.256224825169426]]]}},{"attributes":{"OBJECTID_1":4847,"PipeLine_N":" ","StartPoint":" ","EndPoint_N":" ","Start_Poin":"4-102-11Y13","End_Point":"4-102-11Y14","Start_Deep":0.78,"End_Deep":0.82,"Material":"砼","D_Type":2,"D_S":"300X300","P_Sdeep":0,"P_Edeep":0,"P_Material":" ","P_D_S":" ","B_Code":"1010","Mdate":"2015-10","Line_Style":0,"Cab_Count":" ","Voltage":" ","Pressure":" ","Hole_Count":" ","Status":"运行","Road_name":"平海路","SUR_UNIT":"杭州市勘测设计研究院","Sur_Date":1443657600000,"Flowdirect":1,"CivicProje":" ","Project_No":" ","Project_Na":" ","SProject_N":" ","SProject_1":" ","IntoDBTime":null,"UpdateTime":null,"DTProvider":" ","DTProvid_1":" ","Facilities":" ","Faciliti_1":" ","Kind":0,"Length":0,"ConsOrg":" ","ConsDate":null,"Unused":" ","Unused_Met":" ","Picture_ID":" ","PictureNam":" ","PictureTyp":" ","CreateDate":null,"RANK":0,"SHAPE_Leng":31.3721211831,"Shape_Length":0.00032466963511084616,"intersectionPoint":{"x":120.15728445810151,"y":30.25619536924878,"distance":19.442931106099135}},"geometry":{"paths":[[[120.15740514443627,30.256199767045512],[120.15708069014553,30.25618794396692]]]}},{"attributes":{"OBJECTID_1":28878,"PipeLine_N":" ","StartPoint":" ","EndPoint_N":" ","Start_Poin":"4-102-11W2","End_Point":"4-102-11W3","Start_Deep":2.08,"End_Deep":20.07,"Material":"PVC","D_Type":0,"D_S":"3000","P_Sdeep":0,"P_Edeep":0,"P_Material":" ","P_D_S":" ","B_Code":"1010","Mdate":"2015-10","Line_Style":0,"Cab_Count":" ","Voltage":" ","Pressure":" ","Hole_Count":" ","Status":"运行","Road_name":"平海路","SUR_UNIT":"杭州市勘测设计研究院","Sur_Date":1443657600000,"Flowdirect":1,"CivicProje":" ","Project_No":" ","Project_Na":" ","SProject_N":" ","SProject_1":" ","IntoDBTime":null,"UpdateTime":null,"DTProvider":" ","DTProvid_1":" ","Facilities":" ","Faciliti_1":" ","Kind":0,"Length":0,"ConsOrg":" ","ConsDate":null,"Unused":" ","Unused_Met":" ","Picture_ID":" ","PictureNam":" ","PictureTyp":" ","CreateDate":null,"RANK":0,"SHAPE_Leng":43.2088876707,"Shape_Length":0.00044713701381763303,"intersectionPoint":{"x":120.15728445810151,"y":30.256210476369287,"distance":219.117653549896346}},"geometry":{"paths":[[[120.15772946986192,30.256228989455952],[120.15728271927028,30.256210404031574]]]}}];
      pipes = formatInput(pipes);
      dataMap.pipeArr = pipes;
    };
    
    setStatus = function(statusText){
      //复用原有的shape对象
      gfxMap.statusBarText.shape.text = statusText;
      gfxMap.statusBarText.setShape(gfxMap.statusBarText.shape);
    };
    
    removeEventHandler = function(handlerName){
      if(eventHandlerMap[handlerName]){
        eventHandlerMap[handlerName].remove();
        delete eventHandlerMap[handlerName];
      }
    };
    
    clear = function(){
      gfxMap.pipeGroup.clear();
      delete dataMap.pipeArr;
    };
    
    /**
     * 释放资源，destroy之后不应该再使用图表的任何方法（除了init），如需重新使用此图表，则应该调用init方法。
     * destroy 和 init 应该是相互可逆的两个过程 
     */
    destroy = function(){
      var prop;
      //销毁事件
      removeEventHandler('mouseoverPipeHandler');
      removeEventHandler('mouseOverGroundHandler');
      removeEventHandler('mouseOverTableRowHandler');
      removeEventHandler('mouseOutTableRowHandler');
      //销毁gfx对象
      gfxMap.surface.clear(true);
      gfxMap.surface.destroy();
      for(prop in gfxMap){
        if(gfxMap.hasOwnProperty(prop)){
          delete gfxMap[prop];
        }
      }
      //销毁dom对象
      domConstruct.empty(queryMap.chartParent);
      delete queryMap.chartParent;
      if(queryMap.table){
        domConstruct.empty(queryMap.table);
        domConstruct.empty(queryMap.tableParent);
        delete queryMap.table;
        delete queryMap.tableParent;
      }      
      //销毁数据
      for(prop in dataMap){
        if(dataMap.hasOwnProperty(prop)){
          delete dataMap[prop];
        }
      }
    };
    /**
     * 初始化背景 
     */
    initGround = function(){
      //TODO
      var groundLineShape, groundShape, groundFill, undergroundShape, undergroundFill;
      // - 画地表背景: gfxMap.ground
      groundShape = {
        x: 0,
        y: 0,
        width: queryMap.chartParent.offsetWidth,
        height: configMap.groundHeight 
      };
      groundFill = {
        type: 'pattern',
        x: 0,
        y: 0,
        width: 300,
        height: 60,
        src: configMap.groundBg
      };
      gfxMap.ground = gfxMap.groundGroup.createRect(groundShape).setFill(groundFill);
      // - 画地下背景: gfxMap.underground
      undergroundShape = {
        x: 0,
        y: groundShape.y + groundShape.height,
        width: groundShape.width,
        height: queryMap.chartParent.offsetHeight - groundShape.height
      };
      undergroundFill = {
        type: 'pattern',
        x: 0,
        y: 0,
        width: 221,
        height: 157,
        src: configMap.undergroundBg
      };
      gfxMap.underground = gfxMap.groundGroup.createRect(undergroundShape).setFill(undergroundFill);
      // - 画地表线: gfxMap.groundLine
      groundLineShape = {
        x1: 0,
        y1: configMap.groundHeight,
        x2: queryMap.chartParent.offsetWidth,
        y2: configMap.groundHeight
      };
      gfxMap.groundLine = gfxMap.groundGroup.createLine(groundLineShape).setStroke(strokes.GROUND_LINE_STROKE);
      
      eventHandlerMap.mouseOverGroundHandler = gfxMap.groundGroup.on('mouseover',mouseOverGroundHandler);
    };
    
    updateTable = function(pipes){
      if(!queryMap.table){
        return false;
      }
      var i,k,field,header,row,rowHtml,table,value;
      delete queryMap.tableRows;
      queryMap.tableRows = [];
      domConstruct.empty(queryMap.table);
      header = "";
      //generate table head
      header = "<tr>";
      for(i=0;i<configMap.tableFields.length;i+=1){
        field = configMap.tableFields[i];
        header += "<th>"
                    + configMap.tableFieldNameMap[field]
                 +"</th>";
      }
      header += "</tr>";
      row = domConstruct.toDom(header);
      domConstruct.place(row,queryMap.table);
      //generate table body
      if(pipes){
        for(i=0;i<pipes.length;i+=1){
          rowHtml = "<tr class=\"hdm-pipe-chart-table-row\">";
          for(k=0;k<configMap.tableFields.length;k+=1){
            value = getExternalField(pipes[i],configMap.tableFields[k]);
            rowHtml += "<td>"+(value!==undefined&&value!==null?value:"")+"</td>";
          }
          rowHtml += "</tr>";
          row = domConstruct.toDom(rowHtml);
          queryMap.tableRows.push(row);
          domConstruct.place(row,queryMap.table);
        }
      }
      
    };
    
    /**
     * 初始化状态栏 
     */
    initStatusBar = function(){
      //TODO
      // - 画半透明背景: gfxMap.statusBar
      var statusBarShape, statusTextShape;
      
      statusBarShape = {
        x: 0,
        y: gfxMap.underground.shape.y + gfxMap.underground.shape.height - configMap.statusBarHeight,
        width: gfxMap.underground.shape.width,
        height: configMap.statusBarHeight   
      };
      
      gfxMap.statusBar = gfxMap.statusBarGroup.createRect(statusBarShape).setFill(fills.STATUS_BAR_FILL);
      
      statusTextShape = {
        x: configMap.statusFontSize / 2,
        y: statusBarShape.y + configMap.statusFontSize,
        text: ''
      };
      
      gfxMap.statusBarText = gfxMap.statusBarGroup.createText(statusTextShape).setFill(fills.STATUS_TEXT_FILL);
       
    };
    
    initGFX = function(){
      gfxMap.surface = gfx.createSurface(queryMap.chartParent,queryMap.chartParent.offsetWidth,queryMap.chartParent.offsetHeight);
      gfxMap.surface.whenLoaded(function(){
        gfxMap.pipeGroup = gfxMap.surface.createGroup();
        gfxMap.groundGroup = gfxMap.surface.createGroup();
        gfxMap.statusBarGroup = gfxMap.surface.createGroup();
        
        eventHandlerMap.mouseOverPipeHandler = gfxMap.pipeGroup.on('mouseover',mouseOverPipeHandler);
        // eventHandlerMap.mouseOutPipeHandler = gfxMap.pipeGroup.on('mouseout',mouseOutPipeHandler);
        
        initGround();
        initStatusBar();
      });
    };
    
    initChart = function(){
      initGFX();
    };
    
    initTable = function(){
      if(queryMap.tableParent){
        queryMap.tableWrapper = domConstruct.toDom(domMap.tableHtml);
        queryMap.table = query('.hdm-pipe-chart-table',queryMap.tableWrapper)[0];
        domConstruct.place(queryMap.tableWrapper,queryMap.tableParent);
        eventHandlerMap.mouseoverTableRowHandler = on(queryMap.table,".hdm-pipe-chart-table-row:mouseover",mouseOverTableRowHandler);
        eventHandlerMap.mouseoutTableRowHandler = on(queryMap.table,".hdm-pipe-chart-table-row:mouseout",mouseOutTableRowHandler); 
        updateTable();
      }
    };
    
    configInternalFieldMap = function(fieldMap){
      var prop;
      if(fieldMap){
        delete configMap.internalFieldMap;
        configMap.internalFieldMap = lang.clone(defaultConfigMap.internalFieldMap);
        for(prop in fieldMap){
          if(fieldMap.hasOwnProperty(prop) && defaultConfigMap.internalFieldMap.hasOwnProperty(prop) && fieldMap[prop]){
            configMap.internalFieldMap[prop] = fieldMap[prop];  
          }
        }
      }
    };
    
    configTableFieldNameMap = function(fieldNameMap){
      var prop;
      if(fieldNameMap){
        delete configMap.tableFieldNameMap;
        configMap.tableFieldNameMap = lang.clone(defaultConfigMap.tableFieldNameMap);
        for(prop in fieldNameMap){
          if(fieldNameMap.hasOwnProperty(prop) && defaultConfigMap.tableFieldNameMap.hasOwnProperty(prop) && fieldNameMap[prop]){
            configMap.tableFieldNameMap[prop] = fieldNameMap[prop];
          }
        }
      }
    };
    
    configTableFields = function(fieldArr){
      var i,field;
      if(!configMap.tableFieldNameMap){
        throw "Table field names not config yet!!";
      }
      if(fieldArr){
        for(i=0;i<fieldArr.length;i+=1){
          field = fieldArr[i];
          if(!configMap.tableFieldNameMap[field]){
            throw "Illegal field '"+field+"'!!";
          }
        }
        configMap.tableFields = lang.clone(fieldArr);
      }else{
        delete configMap.tableFields;
        configMap.tableFields = lang.clone(defaultConfigMap.tableFields);
      }
    };
    
    config = function(confMap){
      confMap = lang.clone(confMap) || {};

      configMap.statusTemplate = confMap.statusTemplate || defaultConfigMap.statusTemplate;
      configMap.pluginPath = confMap.pluginPath || defaultConfigMap.pluginPath;
      configMap.groundBg = confMap.groundBg || (configMap.pluginPath + defaultConfigMap.groundBg);
      configMap.undergroundBg = confMap.undergroundBg || (configMap.pluginPath + defaultConfigMap.undergroundBg);
      configMap.statusBarHeight = !isNaN(confMap.statusBarHeight)?confMap.statusBarHeight:defaultConfigMap.statusBarHeight;
      configMap.statusFontSize = !isNaN(confMap.statusFontSize)?confMap.statusFontSize:defaultConfigMap.statusFontSize;
      configMap.groundHeight = !isNaN(confMap.groundHeight)?confMap.groundHeight:defaultConfigMap.groundHeight;
      configMap.scale = lang.clone(defaultConfigMap.scale);
     
      configInternalFieldMap(confMap.internalFieldMap || {});
      configTableFieldNameMap(confMap.tableFieldNameMap || {});
      configTableFields(confMap.tableFields);
      
      configDone = true;
    };

    init = function(initMap){
      if(!configDone){
        config();
      }
      initMap = lang.clone(initMap) || {};
      
      if(initMap.chartParentId){
        queryMap.chartParent = dom.byId(initMap.chartParentId);
        if(queryMap.chartParent){
          initChart();          
        }else{
          throw "Wrong chart parent id, can't get a matched node!";
        }
      }else{
        throw "A 'chartParentId' parameter is neccessary for init this module!";
      }
      
      if(initMap.tableParentId){
        queryMap.tableParent = dom.byId(initMap.tableParentId);
        if(queryMap.tableParent){
          initTable();
        }else{
          throw "Wrong table parent id, can't find a matched node!";
        }
      }
      
      initDone = true;
    };
    
    exports = {//导出公有属性和方法
      init: init,
      config: config,
      destroy: destroy,
      setPipes: setPipes,
      draw: drawPipes
    };
    
    return exports;
  };
});
