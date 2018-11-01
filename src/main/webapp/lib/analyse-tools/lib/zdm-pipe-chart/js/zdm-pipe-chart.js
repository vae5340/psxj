define([
  'dojo/dom',
  'dojox/gfx',
  'dojo/mouse',
  'dojo/_base/lang',
  'dojo/query',
  'dojo/dom-construct',
  'dojo/dom-class',
  'dojo/on'
],function(dom,gfx,mouse,lang,query,domConstruct,domClass,on){
  "use strict";
  return function(){
  var 
    exports,
    surface,
    initDone = false, configDone = false,
    pipeArr = [],
    configMap = {},
    queryMap = {},
    strokes = {},
    fills = {},
    fonts = {},
    tableState = {
      mouseOverRow:null,
      hoverEventSignal:null,
      unhoverEventSignal:null
    },
    mouseState = {
      processing: false,
      lastTimePoint:0,
      inPipe : [],
      lastPos:{
        x: -10000,
        y: -10000
      }
    },
    domMap = {
      tableHtml:""
        +"<div class=\"zdm-pipe-chart-table-wrapper\">"
         +"<table class=\"zdm-pipe-chart-table\" cellspacing=\"0\">"
         +"</table>"
        +"</div>",
      tableRowHtml:""
        +"<tr>"
        +"</tr>"
    },
    defaultConfigMap = {
      pluginPath: ".",
      maxWidth: 15,
      minHeight: 60,
      startX: 50,
      statusBarHeight: 30,
      marginBottom: 110,
      mouseMoveLongEnoughInterval:300,
      mouseMoveFarEnoughDistance:{
        x: 8,
        y: 8
      },
      unit: {
        ds: 'm',
        de: 'm',
        width: 'mm',
        widthValue: 'mm',
        length: 'm'
      },
      internalFieldMap:{
        'bCode':'BCode',
        'cabCount':'CabCount',
        'width':'DS',
        'dType':'DType',
        'de':'EndDeep',
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
        'pressure':'Pressure',
        'roadName':'RoadName',
        'length':'LEN',
        'surUnit':'SurDate',
        'ds':'StartDeep',
        'startPoint':'StartPoint',
        'status':'Status',
        'surDate':'SurDate'
      },
      tableFields:[
        'BCode',
        'CabCount',
        'DS',
        'DType',
        'EndDeep',
        'EndPoint',
        'Flowdirect',
        'HoleCount',
        'LineStyle',
        'Material',
        'Mdate',
        'OBJECTID',
        'PDS',
        'PEdeep',
        'PMaterial',
        'PSdeep',
        'RoadName',
        'LEN',
        'SurDate',
        'StartDeep',
        'StartPoint',
        'Status',
        'SurDate'
      ],
      tableFieldNames:{
        'BCode':'BCode',
        'CabCount':'CabCount',
        'DS':'管径(mm)',
        'DType':'DType',
        'Enabled':'Enabled',
        'EndDeep':'终点埋深(m)',
        'EndPoint':'EndPoint',
        'Flowdirect':'流向',
        'HoleCount':'HoleCount',
        'LineStyle':'LineStyle',
        'Material':'Material',
        'Mdate':'Mdate',
        'OBJECTID':'OBJECTID',
        'PDS':'PDS',
        'PEdeep':'PEdeep',
        'PMaterial':'PMaterial',
        'PSdeep':'PSdeep',
        'RoadName':'路名',
        'LEN':'管长(m)',
        'SurDate':'SurDate',
        'StartDeep':'起点埋深(m)',
        'StartPoint':'StartPoint',
        'Status':'Status'
      },
      /* original
      internalFieldMap:{
        'bCode':'B_Code',
        'cabCount':'Cab_Count',
        'width':'D_S',
        'dType':'D_Type',
        'enabled':'Enabled',
        'de':'End_Deep',
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
        'roadName':'Road_Name',
        'length':'SHAPE_Leng',
        'surUnit':'Sur_Date',
        'ds':'Start_Deep',
        'startPoint':'Start_Poin',
        'status':'Status',
        'surDate':'Sur_Date',
        'tX':'TX',
        'tY':'TY',
        'typeInfo':'TYPEINFO',
        'voltage':'Voltage'
      },
      tableFields:[
        'B_Code',
        'Cab_Count',
        'D_S',
        'D_Type',
        'Enabled',
        'End_Deep',
        'End_Point',
        'FID',
        'FX',
        'FY',
        'Flowdirect',
        'Hole_Count',
        'Line_Style',
        'Material',
        'Mdate',
        'OBJECTID',
        'P_D_S',
        'P_Edeep',
        'P_Material',
        'P_Sdeep',
        'Pressure',
        'Road_Name',
        'SHAPE_Leng',
        'Sur_Date',
        'Start_Deep',
        'Start_Poin',
        'Status',
        'Sur_Date',
        'TX',
        'TY',
        'TYPEINFO',
        'Voltage'       
      ],
      tableFieldNames:{
        'B_Code':'B_Code',
        'Cab_Count':'Cab_Count',
        'D_S':'管径(mm)',
        'D_Type':'D_Type',
        'Enabled':'Enabled',
        'End_Deep':'终点埋深(m)',
        'End_Point':'End_Point',
        'FID':'FID',
        'FX':'FX',
        'FY':'FY',
        'Flowdirect':'流向',
        'Hole_Count':'Hole_Count',
        'Line_Style':'Line_Style',
        'Material':'Material',
        'Mdate':'Mdate',
        'OBJECTID':'OBJECTID',
        'P_D_S':'P_D_S',
        'P_Edeep':'P_Edeep',
        'P_Material':'P_Material',
        'P_Sdeep':'P_Sdeep',
        'Pressure':'Pressure',
        'Road_Name':'路名',
        'SHAPE_Leng':'管长(m)',
        'Sur_Date':'Sur_Date',
        'Start_Deep':'起点埋深(m)',
        'Start_Poin':'Start_Poin',
        'Status':'Status',
        'TX':'TX',
        'TY':'TY',
        'TYPEINFO':'TYPEINFO',
        'Voltage':'Voltage'
      },
      */
      pipeSelectHandler: function(pipe){}
    },
    mouseEnterPipeHandler,mouseLeavePipeHandler,mouseEnterTableRowHandler,mouseLeaveTableRowHandler,
    init,config,onSelectPipe,
    setPipes,addPipe,draw,getScaleFactor,
    recordPoint,isRoundPipe,toInternalPipe,indexOfPipe,indexOfTableRow,getTableRowFromPipe,getPipeFromTableRow,getGraphicFromPipe,
    doesMouseLeavePipe,doesMouseMoveLongEnough,doesMouseMoveFarEnough,
    initGround,initPipeLayer,initStatusBar,initTable,initInternalFieldMapper,
    highlightPipe,unhighlightPipe,selectTableRow,unselectTableRow,updateTable,drawPipe,setStatus,hideStatus,afterPipeChange,afterDraw,computeScale,clear,
    makeTableHeaderHtml,makeTableRowHtml;

  strokes = {//预定义轮廓样式
    MARKER:{//标注线
      color: "#FFFFFF",
      style: "Dash",
      width: "1"
    },MARKERHOVER:{//鼠标经过时，标注线
      color: "#FFFFFF",
      style: "Dash",
      width: "2"
    },PIPE:{//管道
      color: "#222222"
    },TEXT:{//文字
      color: "#EEEEEE",
      width: "1"
    },GROUNDLINE:{
      style: "Dash",
      width: "2",
      color: "#EEEEEE"
    }
  };
  
  fills = {//预定义填充样式
    PIPE: "#EEEEEE", //管道
    PIPEHOVER: "#00EEEE", //鼠标经过时，管道
    TEXTHOVER: "#00EEEE", //文字
    TEXT: "#EEEEEE", //鼠标经过时，文字
    GROUND: "#959595",
    UNDERGROUND: "#A31515",
    STATUS: "#EEEEEE",
    STATUSBG: [50, 50, 50, 0.8]
  };
  
  fonts = {
    TEXT : {
      weight:"normal"
    },
    TEXTHOVER: {
      weight: "bold"
    }
  };
  
  //生成一行数据HTML
  makeTableRowHtml = function(pipe){
    var i,value,template = "";
    template += "<tr class=\"zdm-pipe-chart-table-row\">";
    for(i=0;i<configMap.tableFields.length;i+=1){
      value = pipe[configMap.tableFields[i]];
      if(value){
        template += "<td>"+((value !== undefined && value.toString().replace(/ +/,"").length > 0)?value:"")+"</td>";
      }else{
        template += "<td></td>";
      }
    }
    template += "</tr>";
    return template;
  };
  
  //生成表头HTML
  makeTableHeaderHtml = function(){
    var i,template = "";
    template += "<tr class=\"zdm-pipe-chart-table-header\">";
    for(i=0;i<configMap.tableFields.length;i+=1){
      template += "<th>"+configMap.tableFieldNames[configMap.tableFields[i]]+"</th>"; 
    }
    template += "</tr>";
    return template;
  };
  
  //更新表格
  updateTable = function(){
    if(!queryMap.table){
      return false;
    }
    var i, row;
    //清除表数据
    domConstruct.empty(queryMap.table);
    delete queryMap.tableRows;
    queryMap.tableRows = [];
    if(tableState.hoverEventSignal){
      tableState.hoverEventSignal.remove();
      delete tableState.hoverEventSignal;
    }
    if(tableState.unhoverEventSignal){
      tableState.unhoverEventSignal.remove();
      delete tableState.unhoverEventSignal;
    }
    //生成表头
    row = domConstruct.toDom(makeTableHeaderHtml());
    domConstruct.place(row,queryMap.table);
    //生成表数据
    for(i=0;i<pipeArr.length;i+=1){
      row = domConstruct.toDom(makeTableRowHtml(pipeArr[i].__external));
      domConstruct.place(row,queryMap.table);
      queryMap.tableRows.push(row);
    }
    tableState.hoverEventSignal = on(queryMap.table,".zdm-pipe-chart-table-row:mouseover",mouseEnterTableRowHandler);
    tableState.unhoverEventSignal = on(queryMap.table,".zdm-pipe-chart-table-row:mouseout",mouseLeaveTableRowHandler);
    return true;
  };
  
  initInternalFieldMapper = function(){
    var prop;
    if(configMap.internalFieldMap === defaultConfigMap.internalFieldMap){
      return true;
    }
    
    for(prop in defaultConfigMap.internalFieldMap){
      if(defaultConfigMap.internalFieldMap.hasOwnProperty(prop) && !configMap.internalFieldMap.hasOwnProperty(prop)){
        configMap.internalFieldMap[prop] = defaultConfigMap.internalFieldMap[prop];
      }
    }
  };
  
  //初始化表格
  initTable = function(tableId){
    if(!tableId){
      return false;
    }
    var prop,tmpArr,i;

    if(configMap.tableFields && configMap.tableFields !== defaultConfigMap.tableFields){
      tmpArr = [];
      for(i=0;i<configMap.tableFields.length;i+=1){
        prop = configMap.tableFields[i];
        if(defaultConfigMap.tableFieldNames[prop] !== undefined){
          tmpArr.push(prop);
        }
      }
      configMap.tableFields = tmpArr;
    }

    if(configMap.tableFieldNames && configMap.tableFieldNames !== defaultConfigMap.tableFieldNames){
      /*
      for(prop in configMap.tableFieldNames){
              if(configMap.tableFieldNames.hasOwnProperty(prop) && !defaultConfigMap.tableFieldNames[prop]){
                delete configMap.tableFieldNames[prop];
              }
            }*/
      
      for(prop in defaultConfigMap.tableFieldNames){
        if(defaultConfigMap.tableFieldNames.hasOwnProperty(prop) && !configMap.tableFieldNames[prop]){
          configMap.tableFieldNames[prop] = defaultConfigMap.tableFieldNames[prop];
        }
      }
    }
    
    queryMap.tableParent = dom.byId(tableId);
    queryMap.tableWrapper = domConstruct.toDom(domMap.tableHtml);
    domConstruct.place(queryMap.tableWrapper,queryMap.tableParent);
    
    queryMap.table = query(".zdm-pipe-chart-table",queryMap.tableWrapper)[0];
    
    updateTable();    
    return true;
  };
  
  //清除状态栏的文字
  hideStatus = function(){
    queryMap.statusBarText.setFill(null);
  };
  //设置并显示状态栏的文字
  setStatus = function(text){
    queryMap.statusBarText.setShape({
      x: queryMap.statusBar.shape.x + 10,
      y: queryMap.statusBar.shape.y + 20,
      text: text
    }).setFill(fills.STATUS);
    queryMap.statusBarText.moveToFront();
  };
  //用户用于设置点击管道时的事件处理函数
  onSelectPipe = function(func){
    if(func && (typeof func).toLowerCase() == "function"){
      configMap.pipeSelectHandler = func || defaultConfigMap.pipeSelectHandler;
    }
  };
  //将输入的管道数据转化成内部使用的数据结构
  toInternalPipe = function(pipe){
    var inPipe = {};
    inPipe.__external = pipe;
    inPipe.ds = parseFloat(pipe[configMap.internalFieldMap.ds]);
    inPipe.de = parseFloat(pipe[configMap.internalFieldMap.de]);
    inPipe.length = parseFloat(pipe[configMap.internalFieldMap.length]);
    inPipe.width = parseFloat(pipe[configMap.internalFieldMap.width]);
    inPipe.widthValue = isNaN(inPipe.width)?pipe[configMap.internalFieldMap.width]:undefined;
    if(pipe.unit){
      inPipe.unit = {
        ds: pipe.unit[configMap.internalFieldMap.ds] || defaultConfigMap.unit.ds,
        de: pipe.unit[configMap.internalFieldMap.de] || defaultConfigMap.unit.de,
        width: pipe.unit[configMap.internalFieldMap.width] || defaultConfigMap.unit.width,
        widthValue : pipe.unit[configMap.internalFieldMap.widthValue] || defaultConfigMap.unit.widthValue,
        length: pipe.unit[configMap.internalFieldMap.length] || defaultConfigMap.unit.length
      };        
    }else{
      inPipe.unit = defaultConfigMap.unit;
    }
    return inPipe;
  };
  //计算x方向和y方向的缩放比例，即1个实际的单位长度（m）等于多少个px
  computeScale = function(startX){
    if(!surface){
      return false;
    }
    var surfWidth, surfHeight, pipeTotalLen, unitLen, unitHeight,i, minWidth, maxWidth,minHeight, maxHeight, pipeTotalHeight;
    surfWidth = (queryMap.parent.offsetWidth - startX) * 0.98;
    surfHeight = queryMap.parent.offsetHeight;
    
    pipeTotalLen = 0;
    minHeight = 65535;
    maxHeight = 0;
    maxWidth = 0;
    minWidth = 65535;
    for(i=0;i<pipeArr.length;i+=1){
      pipeTotalLen += pipeArr[i].length;
      minHeight = Math.min(minHeight,pipeArr[i].ds,pipeArr[i].de);
      maxHeight = Math.max(maxHeight,pipeArr[i].ds,pipeArr[i].de);
      minWidth = Math.min(minWidth,pipeArr[i].width);
      maxWidth = Math.max(maxWidth,pipeArr[i].width);
    }
    
    pipeTotalHeight = Math.abs(minHeight-maxHeight);
    
    // minHeight = maxWidth * 2;
    
    unitHeight = configMap.maxWidth / minWidth;
    
    // if(unitHeight * (maxHeight + minHeight)> surfHeight - 110){
      // unitHeight = (surfHeight - 110) / (maxHeight + minHeight);
    // }
    
    if(unitHeight * maxHeight + configMap.minHeight > surfHeight - configMap.marginBottom - configMap.statusBarHeight){
      unitHeight = (surfHeight - configMap.marginBottom - configMap.minHeight - configMap.statusBarHeight) / maxHeight;
    }
    
    configMap.scale.y = unitHeight;
    
    unitLen = (surfWidth - pipeArr.length * maxWidth * configMap.scale.y) / (pipeTotalLen);
    
    configMap.scale.x = unitLen;
    // configMap.minHeight = minHeight * configMap.scale.y;

    return true;
  };
  
  mouseEnterTableRowHandler = function(event){
    var target,oldTar,pipe;
    target = event.target;
    if(target.tagName.toLowerCase() == "td"){
      target = target.parentNode;
    }else if(target.tagName.toLowerCase() != "tr"){
      return false;
    }
    oldTar = tableState.mouseOverRow;
    if(oldTar){
      pipe = getPipeFromTableRow(oldTar);
      if(pipe){
        unhighlightPipe(pipe);
        unselectTableRow(pipe);
      }
    }
    pipe = getPipeFromTableRow(target);
    if(pipe){
      highlightPipe(pipe);
      selectTableRow(pipe);
    }
    event.stopPropagation();
  };
  
  mouseLeaveTableRowHandler = function(event){
    var target,pipe;
    target = event.selectorTarget;
    pipe = getPipeFromTableRow(target);
    if(pipe){
      unhighlightPipe(pipe);
      unselectTableRow(pipe);
      }
    event.stopPropagation();
  };
  
  //鼠标进入管道上时触发
  mouseEnterPipeHandler = function(group,markers,pipe){
    return function(event){
       var i,status;
      highlightPipe(pipe);
      selectTableRow(pipe);
    };
  };
  
  recordPoint = function(event){
    mouseState.lastPointPos.x = event.x;
    mouseState.lastPointPos.y = event.y;
    mouseState.lastTimePoint = new Date().getTime();
  };
  
  //判断鼠标是否离开管道
  doesMouseLeavePipe = function(event,pipe){
      var leave = false, graphic, group, child, i;
      graphic = getGraphicFromPipe(pipe);
      if(graphic){
        group = graphic.group;
        for(i=0;i<group.children.length;i+=1){
          child = group.children[i];
          if(child.shape.type == "rect"){
            if(event.offsetX < child.shape.x || event.offsetX > child.shape.x + child.shape.width){
              leave = true;
            }
            break;
          }
        }
      }
      return leave;
  };
  //判断鼠标是否离上一个记录点够远
  doesMouseMoveFarEnough = function(event){
    return (Math.abs(event.x - mouseState.lastPos.x) > configMap.mouseMoveFarEnoughDistance.x);// || (Math.abs(event.y - mouseState.lastPos.y) > configMap.mouseMoveFarEnoughDistance.y); 
  };
  //判断鼠标是否离上一个记录点够久
  doesMouseMoveLongEnough = function(event){
    return new Date().getTime() - mouseState.lastTimePoint > configMap.mouseMoveLongEnoughInterval;
  };
  
  //鼠标离开管道时触发
  mouseLeavePipeHandler = function(event){//通过mouseover事件来模拟mouseleave
    if(mouseState.processing || !(doesMouseMoveFarEnough(event) || doesMouseMoveLongEnough(event))){
      return false;
    }
    event.stopPropagation();
    mouseState.processing = true;

    var i,tmpArr = [], pipe;
    while(mouseState.inPipe.length > 0){
      pipe = mouseState.inPipe.pop();
      if(indexOfPipe(pipe,pipeArr) !== -1){
        if(doesMouseLeavePipe(event,pipe)){
          //处理离开事件 -- 开始
          unhighlightPipe(pipe);
          unselectTableRow(pipe);
          //处理离开时事件-- 结束
        }else{
          tmpArr.push(pipe);
        }
      }
    }
    while(tmpArr.length > 0){
      mouseState.inPipe.push(tmpArr.pop());
    }
    mouseState.processing = false;
  };
  
  unselectTableRow = function(pipe){
    var row;
    row = getTableRowFromPipe(pipe);
    tableState.mouseOverRow = null;
    if(row){
      domClass.remove(row,"zdm-pipe-chart-table-td-hover");
    }
  };
  
  getTableRowFromPipe = function(pipe){
    var pos = -1;
    if(queryMap.table){
      pos = indexOfPipe(pipe,pipeArr);
    }
    return pos===-1?null:queryMap.tableRows[pos];
  };
  
  getPipeFromTableRow = function(row){
    var pos = -1;
    if(queryMap.table){
      pos = indexOfTableRow(row,queryMap.tableRows);
    }
    return pos===-1?null:pipeArr[pos];
  };
  
  getGraphicFromPipe = function(pipe){
    var pos = indexOfPipe(pipe,pipeArr);
    return pos===-1?null:queryMap.pipeGraphicArr[pos];
  };
  
  highlightPipe = function(pipe){
      var i,status,group,markers,graphic;
      graphic = getGraphicFromPipe(pipe);
      if(!graphic){
        return false;
      }
      group = graphic.group;
      markers = graphic.markers;
      group.moveToFront();
      markers.moveToFront();
      for(i=0;i<markers.children.length;i+=1){
        if(markers.children[i].shape.type == "text"){
          markers.children[i].setFont(fonts.TEXTHOVER).setFill(fills.TEXTHOVER);
        }else if(markers.children[i].shape.type == "line"){
          markers.children[i].setStroke(strokes.MARKERHOVER);
        }
      }
      for(i=0;i<group.children.length;i+=1){
        group.children[i].setFill(fills.PIPEHOVER);
      }
      status = configMap.tableFieldNames[configMap.internalFieldMap.ds]+":"+pipe.__external[configMap.internalFieldMap.ds]+" | "+configMap.tableFieldNames[configMap.internalFieldMap.de]+":"+pipe.__external[configMap.internalFieldMap.de]+" | "+configMap.tableFieldNames[configMap.internalFieldMap.width]+":"+(pipe.widthValue?pipe.__external[configMap.internalFieldMap.widthValue]:pipe.__external[configMap.internalFieldMap.width])+" | "+configMap.tableFieldNames[configMap.internalFieldMap.length]+":"+pipe.__external[configMap.internalFieldMap.length];
      setStatus(status);
      if(indexOfPipe(pipe,mouseState.inPipe) === -1){
        mouseState.inPipe.push(pipe);
      }
  };
  
  unhighlightPipe = function(pipe){
    var i,group,markers,graphic;
    graphic = getGraphicFromPipe(pipe);
    group = graphic.group;
    markers = graphic.markers;
    group.moveToBack();
    for(i=0;i<markers.children.length;i+=1){
      if(markers.children[i].shape.type == "text"){
        markers.children[i].setFont(fonts.TEXT).setFill(fills.TEXT);
      }else if(markers.children[i].shape.type == "line"){
        markers.children[i].setStroke(strokes.MARKER);
      }
    }
    for(i=0;i<group.children.length;i+=1){
      group.children[i].setFill(fills.PIPE);
    }
    queryMap.groundGroup.moveToBack();
    queryMap.groundLine.moveToFront();
    hideStatus();    
  };
  
  selectTableRow = function(pipe){
    var row;
    row = getTableRowFromPipe(pipe);
    tableState.mouseOverRow = row;
    if(row){
      domClass.add(row,"zdm-pipe-chart-table-td-hover");
    }
  };
  
  //判断表格中的一行在数组中的位置
  indexOfTableRow = function(node,array){
    var i,pos = -1;
    for(i=0;i<array.length;i+=1){
      if(node === array[i]){
        pos = i;
        break;
      }
    }
    return pos;
  };
  
  //判断一个管道在数组pipeArr中位置
  indexOfPipe = function(pipe,array){
    var i,pos = -1;
    for(i=0;i<array.length;i+=1){
      if(array[i] === pipe){
        pos = i;
        break;
      }
    }
    return pos;
  };
  
  //判断一个管道时是否圆管（即判断一条管道不是方管）
  isRoundPipe = function(pipe){
    return pipe.widthValue?false:true;
  };
  //添加一组管道，覆盖已有管道
  setPipes = function(arr){
    pipeArr = [];
    var i,pArr = arr?lang.clone(arr):[];
    for(i=0;i<pArr.length;i+=1){
      addPipe(pArr[i],true);
    }
    afterPipeChange();
  };
  //添加一条管道
  addPipe = function(pipe,skipPostProcess){
    var widthValue;
    if(pipe){
      pipe = toInternalPipe(pipe);
      if(!isNaN(pipe.width)){
        pipe.width = pipe.width / 1000;
      }else{
        pipe.width = "格式错误("+pipe.width+")";
      }
      if(pipe.widthValue && pipe.widthValue.match(/\d+x\d+/i)){
        widthValue = pipe.widthValue.toLowerCase().split(/x/);
        widthValue[0] = parseFloat(widthValue[0]); 
        widthValue[1] = parseFloat(widthValue[1]);
        pipe.width = Math.min(widthValue[0],widthValue[1])/ 1000;
      }else if(pipe.widthValue){
        pipe.width = 1;
        pipe.widthValue = "格式错误("+pipe.widthValue+")";
      }
      pipeArr.push(pipe);
      if(!skipPostProcess){
        afterPipeChange();
      }
    }
  };
  //绘制地面
  initGround = function(){
    var group, fill, groundShape, undergroundShape, groundLineShape, groundFill, undergroundFill, groundImg, undergroundImg, groundLine;
    
    group = surface.createGroup();
    
    groundImg = new Image();
    undergroundImg = new Image();
    
    groundImg.src = configMap.pluginPath + "/css/img/ground.jpg";
    undergroundImg.src = configMap.pluginPath + "/css/img/underground.png";
    
    //画地表层
    groundShape = {
      x: 0,
      y: 0,
      width: queryMap.parent.offsetWidth,
      height: configMap.minHeight
    };
    
    
    groundImg.onload = function(){
      groundFill = {
        type: "pattern",
        x:0,
        y:0,
        width: groundImg.width,
        height:groundImg.height,
        src: groundImg.src
      };
      group.createRect(groundShape).setFill(groundFill);
      
    };
    
    //画地下层
    undergroundShape = {
      x: 0,
      y: groundShape.y + groundShape.height,
      width:groundShape.width,
      height: queryMap.parent.offsetHeight - groundShape.height
    };
    undergroundImg.onload = function(){
      undergroundFill = {
        type: "pattern",
        x: 0,
        y: undergroundShape.y,
        width: undergroundImg.width,
        height: undergroundImg.height,
        src: undergroundImg.src
      };
      group.createRect(undergroundShape).setFill(undergroundFill);
    };      
    
    //画 地面线
    groundLineShape = {
      x1: 0,
      y1: undergroundShape.y,
      x2: undergroundShape.x + undergroundShape.width,
      y2: undergroundShape.y
    }; 
    
    groundLine = surface.createLine(groundLineShape).setStroke(strokes.GROUNDLINE);
    queryMap.groundGroup = group;
    queryMap.groundLine = groundLine;
  };
  //绘制单条管道
  drawPipe = function(startX,pipeObj){
    var group,    //管道图组
      markers,  //标注图组
      rectShape,//管道纵面矩形形状参数
      sEllShape, //管道起始椭圆切面参数
      eEllShape, //管道结束椭圆切面参数
      radians,  //管道倾斜角度（弧度）
      sin,      //管道倾斜角度的sin值
      mattrix,  //管道的旋转矩阵
      markLines = {},//标注的辅助线参数
      markTexts = {},//标注文字参数
      tmp, //中间变量
      matrix,
      needRotate = true,
      pipe = pipeObj.screen,
      surface = queryMap.pipeGroup;

    //创建图组
    group = surface.createGroup();
    markers = surface.createGroup();
    //Group中，画水管矩形
    rectShape = {
      x: startX,
      y: pipe.ds - pipe.width,
      width: pipe.length,
      height: pipe.width
    };
    group.createRect(rectShape).setFill(fills.PIPE).setStroke(strokes.PIPE);
    if(isRoundPipe(pipeObj)){//如果是圆管，画两端椭圆切面
      sEllShape = { //起始切面椭圆形状
        cx: startX,
        cy: pipe.ds - pipe.width / 2,
        rx: pipe.width / 4,
        ry: pipe.width / 2
      };
      eEllShape = lang.clone(sEllShape);
      eEllShape.cx = startX + pipe.length;
      eEllShape.cy = pipe.ds - pipe.width / 2;
      group.createEllipse(sEllShape).setFill(fills.PIPE).setStroke(strokes.PIPE);
      group.createEllipse(eEllShape).setFill(fills.PIPE).setStroke(strokes.PIPE);
    }
    //根据斜率，旋转Group
    if(pipe.de === pipe.ds){
      needRotate = false;
    }
    if(needRotate){
      sin = (pipe.de - pipe.ds)/pipe.length; //计算倾斜角度的sin值
      radians = Math.asin(sin); //得到倾斜角度
      //得到以起始横切面中心为轴，倾斜角度为radians的旋转矩阵
      matrix = gfx.matrix.rotateAt(radians,rectShape.x,rectShape.y + rectShape.height / 2);
      group.applyTransform(matrix);
    }
    //埋深标注
    markLines.qdms = {//起点埋深辅助线
      x1: rectShape.x,
      y1: pipe.ds,
      x2: rectShape.x,
      y2: pipe.ds + 80
    };
    markTexts.qdms = {//起点埋深文字
      x: markLines.qdms.x1,
      y: markLines.qdms.y2 + 20,
      text: "埋深:"+pipeObj.ds+pipeObj.unit.ds,
      align: "start"
    };
    //计算经过变换的管道的终点横坐标
    tmp = startX + (needRotate?(pipe.de - pipe.ds) / Math.tan(radians):pipe.length);
    markLines.zdms = {//终点埋深辅助线
      x1: tmp, 
      y1: pipe.de,
      x2: tmp,
      y2: pipe.de + 80
    };
    markTexts.zdms = {//终点埋深文字
      x: markLines.zdms.x1,
      y: markLines.zdms.y2 + 20,
      text: "埋深:"+pipeObj.de+pipeObj.unit.de,
      align:"end"
    };
    //起点埋深
    markers.createLine(markLines.qdms).setStroke(strokes.MARKER);
    markers.createText(markTexts.qdms).setFont(fonts.TEXT).setFill(fills.TEXT);
    //终点埋深
    markers.createLine(markLines.zdms).setStroke(strokes.MARKER);
    markers.createText(markTexts.zdms).setFont(fonts.TEXT).setFill(fills.TEXT);
    
    //标管径
    tmp = (startX+(startX + (needRotate?(pipe.de - pipe.ds) / Math.tan(radians):pipe.length))) / 2; //管径标注辅助线起点横坐标
    markLines.width = {//管径辅助线
      x1: tmp,
      y1: (pipe.de + pipe.ds) / 2 - pipe.width / 2,
      x2: tmp,
      y2: (pipe.de + pipe.ds) / 2 + pipe.width 
    };
    
    markTexts.width = {//管径文字
      x: tmp,
      y: (pipe.de + pipe.ds) / 2 + pipe.width + 20,
      text: "管径:"+(pipeObj.widthValue || pipeObj.__external[configMap.internalFieldMap.width]) + (pipeObj.widthValue?pipeObj.unit.widthValue:pipeObj.unit.width),
      align: "middle"
    };
    
    markers.createLine(markLines.width).setStroke(strokes.MARKER);
    markers.createText(markTexts.width).setFont(fonts.TEXT).setFill(fills.TEXT);
   
   markTexts.length = {//管长标注文字
      x: markTexts.width.x,
      y: markTexts.width.y + 20,
      text: "管长:"+pipeObj.length + pipeObj.unit.length,
      align:"middle"
    };
   
    tmp = markers.createText(markTexts.length).setFont(fonts.TEXT).setFill(fills.TEXT);
    
    group.on('mouseover',mouseEnterPipeHandler(group,markers,pipeObj));//鼠标移动到管道上时触发事件
    
    group.on('click',function(){
      if(configMap.pipeSelectHandler){
        configMap.pipeSelectHandler(lang.clone(pipeObj.__external));
      }
    });
    
    return {
      'group':group,
      'markers':markers
    };
  };
  //管道数据（数组）变化的后置处理器
  afterPipeChange =function(){
    updateTable();
  };
  //绘制管道的后置处理器
  afterDraw = function(){
    queryMap.groundGroup.moveToBack();
    queryMap.pipeGroup.moveToFront();
    queryMap.groundLine.moveToFront();
    queryMap.statusBar.moveToFront();
  };
  //绘制所有管道
  draw = function(startX){
    if(!initDone){
      setTimeout(function checkSurfaceReady(){
        if(!initDone){
          setTimeout(checkSurfaceReady,500);   
        }
      },500);
      return false;
    }
    var i,cos = 0,needRotate = true, graphic;
    startX = !isNaN(startX)?startX:defaultConfigMap.startX;
    clear();
    computeScale(startX);
    for(i=0;i<pipeArr.length;i+=1){
      delete pipeArr[i].screen;
      pipeArr[i].screen = {};
      pipeArr[i].screen.ds = configMap.minHeight + pipeArr[i].ds * configMap.scale.y;
      pipeArr[i].screen.de = configMap.minHeight + pipeArr[i].de * configMap.scale.y;
      pipeArr[i].screen.width = pipeArr[i].width * configMap.scale.y;
      pipeArr[i].screen.length = pipeArr[i].length * configMap.scale.x;
      graphic = drawPipe(startX,pipeArr[i]);
      queryMap.pipeGraphicArr.push(graphic);
      needRotate = true;
      if(pipeArr[i].screen.ds === pipeArr[i].screen.de){
        needRotate = false;
      }else{
        cos = Math.cos(Math.asin(Math.abs(pipeArr[i].screen.ds - pipeArr[i].screen.de)/pipeArr[i].screen.length));
      }
      startX += (needRotate?pipeArr[i].screen.length * cos : pipeArr[i].screen.length) + pipeArr[i].screen.width;
    }
    afterDraw();
  };
  //清除管道图层
  clear = function(){
    queryMap.pipeGroup.clear();
    delete queryMap.pipeGraphicArr;
    queryMap.pipeGraphicArr = [];
  };
  //初始化状态栏
  initStatusBar = function(){
    var statusBarShape;
    
    queryMap.statusBarGroup = surface.createGroup();
    
    statusBarShape = {
      x: 0,
      y: queryMap.parent.offsetHeight - configMap.statusBarHeight,
      width: queryMap.parent.offsetWidth,
      height: configMap.statusBarHeight
    };
    
    queryMap.statusBar = queryMap.statusBarGroup.createRect(statusBarShape).setFill(fills.STATUSBG);
    queryMap.statusBarText = queryMap.statusBarGroup.createText();
    
    queryMap.statusBar.moveToFront();
  };
  //初始化管道图层（组）
  initPipeLayer = function(){
    queryMap.pipeGroup = surface.createGroup();
    surface.on('mousemove',mouseLeavePipeHandler);
  };
  
  //初始化
  init = function(initMap){
    if(!configDone){
      config();
    }
    if(!initMap){
      return false;
    }
    var opts = lang.clone(initMap);
    
    queryMap.parent = dom.byId(opts.parentId);
    surface = gfx.createSurface(queryMap.parent,queryMap.parent.offsetWidth,queryMap.parent.offsetHeight);
    
    surface.whenLoaded(function(){
      initInternalFieldMapper();
      
      initPipeLayer();
      
      initStatusBar();
      
      initGround();
      
      initTable(opts.tableId);
      
      initDone = true;
    });
    
    
    configMap.scale = {};
    
    return true;
  };
  
  //配置
  config = function(confMap){
    if(!confMap && configDone){
      return true;
    }
    var conf = confMap?lang.clone(confMap):{};
    configMap.pluginPath = conf.pluginPath || defaultConfigMap.pluginPath;
    configMap.maxWidth = conf.maxWidth || defaultConfigMap.maxWidth;
    configMap.minHeight = conf.minHeight || defaultConfigMap.minHeight;
    configMap.statusBarHeight = !isNaN(conf.statusBarHeight)?conf.statusBarHeight:defaultConfigMap.statusBarHeight;
    configMap.marginBottom = conf.marginBottom || defaultConfigMap.marginBottom;
    configMap.tableFieldNames = conf.tableFieldNames || defaultConfigMap.tableFieldNames;
    configMap.tableFields = conf.tableFields || defaultConfigMap.tableFields;
    configMap.mouseMoveFarEnoughDistance = defaultConfigMap.mouseMoveFarEnoughDistance;
    configMap.mouseMoveLongEnoughInterval = defaultConfigMap.mouseMoveLongEnoughInterval;
    configMap.internalFieldMap = conf.internalFieldMap || defaultConfigMap.internalFieldMap;
    configDone = true;
    return configDone;
  };
  
  //获取缩放比例（即多少像素代表1米的长度）
  //结构 {x:Number,y:Number} //x轴方向和y轴方向的比例可能不同
  getScaleFactor = function(){
    return lang.clone(configMap.scale);
  };
  
  //导出公开方法
  exports = {
    init:init,
    config:config,
    addPipe:addPipe,
    setPipes:setPipes,
    draw:draw,
    onSelectPipe:onSelectPipe,
    getScaleFactor:getScaleFactor
  };
  
  return exports;
  };       
});
