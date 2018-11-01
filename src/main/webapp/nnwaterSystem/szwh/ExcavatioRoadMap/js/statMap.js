//地图初始化相关的脚本
mapOptions = {
    extent: { center: [108.40669180908202,22.815586677246095], zoom: 3 }, //设置地图的初始范围
    baseMap: {},
    featureLayers: {},
    service: {}
}

require([
	"esri/map", 
	"esri/graphic",
	"esri/InfoTemplate",
	"esri/toolbars/draw",
	"custom/tdt/TDTLayer", 
	"custom/tdt/TomcatLayer", 
	"custom/tdt/SuperMapLayer",
	"custom/tdt/SuperMapBZLayer",
	"esri/geometry/Polygon",
	"esri/dijit/LocateButton", 
	"esri/dijit/Scalebar", 
	"esri/dijit/HomeButton",
	"esri/symbols/SimpleLineSymbol", 
	"esri/symbols/SimpleMarkerSymbol",
	"esri/symbols/SimpleFillSymbol",
	"esri/Color",
	"custom/popup/PopupWin",
	"custom/InfoPanel/InfoPanel", 
	"esri/layers/FeatureLayer",
	"esri/layers/GraphicsLayer"
]);
require(["dojo/ready"], function (ready){
    ready(function () {
        initMap();
    });
});

$(window).on("load",function(){
     setTimeout(query,500);
});

var map;
var mapGlobe = {};

//地图初始化
function initMap() {
    map = new esri.Map("mapDiv", {
    	logo: false,
		center: [108.3113111601501,22.820486635299154], 
		extent: new esri.geometry.Extent({
			xmin: 107.23452588182978,
			ymin: 21.813379881292327,
		    xmax: 110.3840906318817,
			ymax: 24.252829164596033,
			spatialReference:{wkid:4326}
		}),
		zoom: 13,
		minZoom:9
  	});
  	if(location.hostname.indexOf("180.140.190.209")==-1){
		map.addLayer(createGTWMTSLayer()); //添加国土局wmts
    	map.addLayer(createGTBZWMTSLayer()); //添加国土局wmts标注
    } else {
    	map.addLayer(createVECLayer()); //添加南宁底图
    	map.addLayer(createCVALayer()); //添加南宁底图
    }
	awaterui.mapQueryBar();	
}
function createGTWMTSLayer(){
	var layer = new tdt.SuperMapLayer({id: "GTWMTS" });
	layer.setOpacity(.60);
    return layer;
}
function createGTBZWMTSLayer(){
	var layer = new tdt.SuperMapBZLayer({id: "GTBZWMTS" });
	layer.setOpacity(.60);
    return layer;
}
function createTomcatLayer() {
    var layer = new tdt.TomcatLayer({ url: "/map/Layers/_alllayers", id: "NNVectorLayer" });
    return layer;
}
//创建南宁地图
function createVECLayer(){
    var layer = new tdt.TDTLayer("vec");
    layer.setOpacity(.60);
    return layer;
}
//创建南宁地图
function createCVALayer(){
    var layer = new tdt.TDTLayer("cva");
    layer.setOpacity(.60);
    return layer;
}
//添加比例尺
function addScalebar() {
    var scalebar = new esri.dijit.Scalebar({
        map: map,
        attachTo: 'bottom-right', //top-right, bottom-right, top-center, bottom-center, bottom-left, top-left.
        scalebarUnit: "dual"
    });
}
function createrLayer(layerId){
	if(map.getLayer(layerId)!=null)
		return map.getLayer(layerId);
	var newLayer = new esri.layers.GraphicsLayer({
		id:layerId
	});
	
	map.addLayer(newLayer);
	return newLayer;
}

//道路监测-新增地图展示要素
function adddljcGraphics(startTime,endTime){
	$.ajax({
		url: '/agsupport/sz-roaddetection!listJsonAll.action',
		data:{ "startTime":startTime,"endTime":endTime },
		dataType: 'json',
		async:true,
		success: function(data){
			var layer=createrLayer("dljc");
			layer.on("mouse-over", dljcMouseOverHandler);
			var Symbol = new esri.symbol.SimpleFillSymbol( 
				esri.symbol.SimpleFillSymbol.STYLE_SOLID,  
				new esri.symbol.SimpleLineSymbol(
				esri.symbol.SimpleLineSymbol.STYLE_SOLID,
				new dojo.Color([42,162,86]),3),
				new dojo.Color([125,125,125,0.35])  
			);
			if(data.rows!=null){
				for(var i=0;i<data.rows.length;i++){
					if(data.rows[i].wkt!=""){
						var array=data.rows[i].wkt.split(",");
						var coorArray=new Array();
						for (j = 0; j < array.length; j++){
							var pointArray=new Array(array[j],array[++j]);
							coorArray.push(pointArray);
						}
						var polygonJson  = {"rings":[coorArray],"spatialReference":{"wkid":2433 }};
						var polygon = new esri.geometry.Polygon(polygonJson);
						var attr = {"id":data.rows[i].id,"reportName":data.rows[i].reportName,"reportDate": data.rows[i].reportDate==null?"":getLocalTime(data.rows[i].reportDate.time),"reportor":data.rows[i].reportor};
						var graphic = new esri.Graphic(polygon,Symbol,attr);
						layer.add(graphic);
					}
				}
			}
		}
	})
}

//道路开挖-新增地图展示要素
function adddlkwGraphics(startTime,endTime){
	$.ajax({
		url: '/agsupport/excavate-apply!listJsonAll.action',
		data:{ "startTime":startTime,"endTime":endTime },
		dataType: 'json',
		async:true,
		success: function(data){
			var layer=createrLayer("dlkw");
			layer.on("mouse-over", dlkwMouseOverHandler);
			var Symbol = new esri.symbol.SimpleFillSymbol( 
				esri.symbol.SimpleFillSymbol.STYLE_SOLID,  
				new esri.symbol.SimpleLineSymbol(
				esri.symbol.SimpleLineSymbol.STYLE_SOLID,
				new dojo.Color([46,108,173]),3),
				new dojo.Color([125,125,125,0.35])  
			);
			if(data.rows!=null){
				for(var i=0;i<data.rows.length;i++){
					if(data.rows[i].wkt!=""){
						var array=data.rows[i].wkt.split(",");
						var coorArray=new Array();
						for (j = 0; j < array.length; j++){
							var pointArray=new Array(array[j],array[++j]);
							coorArray.push(pointArray);
						}
						var polygonJson  = {"rings":[coorArray],"spatialReference":{"wkid":2433 }};
						var polygon = new esri.geometry.Polygon(polygonJson);
						var attr = {"id":data.rows[i].id,"applyUnit":data.rows[i].applyUnit,"applyDate": data.rows[i].applyDate==null?"":getLocalTime(data.rows[i].applyDate.time),"contactPerson":data.rows[i].contactPerson};
						var graphic = new esri.Graphic(polygon,Symbol,attr);
						layer.add(graphic);
					}
				}
			}
		}
	})
}
//道路开挖-鼠标悬停事件
function dlkwMouseOverHandler(g) {
    var pt = g.graphic.geometry.getExtent().getCenter();
    var attr = g.graphic.attributes;
    var content ="申请单位:" + attr["applyUnit"] + "<br/>"+"申请日期:" + attr["applyDate"] + "<br/>"+"联系人:" + attr["contactPerson"]+ "<br/><a href='#' onclick='openInfo("+attr["id"]+")'>项目详情</a>";
    map.infoWindow.setTitle("道路开挖审批");
    map.infoWindow.setContent(content);
    map.infoWindow.show(pt);
}
//道路检测-鼠标悬停事件
function dljcMouseOverHandler(g) {
    var pt = g.graphic.geometry.getExtent().getCenter();
    var attr = g.graphic.attributes;
    var content ="报告名称:" + attr["reportName"] + "<br/>"+"报告日期:" + attr["reportDate"] + "<br/>"+"报告人:" + attr["reportor"] + "<br/><a href='#' onclick='openInfo("+attr["id"]+")'>项目详情</a>";
    map.infoWindow.setTitle("道路监测");
    map.infoWindow.setContent(content);
    map.infoWindow.show(pt);
}
//
function openInfo(id){
	$.ajax({
		method : 'GET',
		url : '/agsupport/sz-roaddetection!getWorkFlowId.action',
		data:{"id":id},
		async : true,
		dataType : 'json',
		success : function(data) {
			if(data.instanceId!=null){
				var url="/agsupport/task/work-task!viewHistoryTask.action?instance.wfBusInstanceId="+data.instanceId;
				window.open (url, 'newWindow', 'height=768px, width=1024px, scrollbars=yes, resizable=yes');
			} else {
				alert('请求失败');
			}
		},
		error : function() {
			alert('请求失败');
		}
	});
}

function openWfBusInstance(id){
    var url="/agsupport/task/work-task!viewHistoryTask.action?instance.wfBusInstanceId="+id;
	window.open (url, 'newWindow', 'height=768px, width=1024px, scrollbars=yes, resizable=yes');
}

//可视化统计
function query(){
	var queryframe = window.frames["queryIframe"];
	var startTime = queryframe.$("#startTime").val();
	var endTime = queryframe.$("#endTime").val();
	var queryType =queryframe.$('input[name="queryType"]:checked').val();
	var table = queryframe.$("#contentTable");
	if(queryType==1){
		createrLayer("dljc");
		if(map.getLayer("dlkw")!=null)
		     map.getLayer("dlkw").clear();
		adddljcGraphics(startTime,endTime); 
		table.bootstrapTable("destroy");
		table.bootstrapTable({
			toggle:"table",
			height:260,
			url: '/agsupport/work-task!getBjTasks.action?templateCode=dljc&oTable=1&startTime='+startTime+'&endTime='+endTime,
			rowStyle:"rowStyle",
			cache: false, 
			checkboxHeader:false,
			pagination:true,
			striped: true,
			pageNumber:1,
		    pageSize: 10,
			pageList: [10, 25, 50, 100],
			queryParams: queryParams,
			sidePagination: "server",
			columns: [{title: "所属区",formatter:format_district,align:'center'},
			{title: "报告名称",formatter:format_name,align:'center'},
			{title: "报告内容",formatter:format_content,align:'center'},
			{title: "报告时间",formatter:format_time,align:'center'},
			{title: "报告附件",formatter:format_affix,align:'center'}]
	     });
	     table.on('post-body.bs.table', function (row,obj) {
				window.frames["queryIframe"].$(".fixed-table-body").mCustomScrollbar();
		 });
		 table.on('dbl-click-row.bs.table', function (row,obj) {
		       openWfBusInstance(obj[1]);
		 });
	} else if(queryType==2){
		createrLayer("dlkw").clear();
		if(map.getLayer("dljc")!=null)
		     map.getLayer("dljc").clear();
		adddlkwGraphics(startTime,endTime);    
		table.bootstrapTable("destroy");
		table.bootstrapTable({
			toggle:"table",
			height:260,
			url: '/agsupport/work-task!getDlkwBjTasks.action?templateCode=dlkw&oTable=1&startTime='+startTime+'&endTime='+endTime,
			rowStyle:"rowStyle",
			cache: false, 
			checkboxHeader:false,
			pagination:true,
			striped: true,
			pageNumber:1,
		    pageSize: 10,
			pageList: [10, 25, 50, 100],
			queryParams: queryParams,
			sidePagination: "server",
			columns: [{title: "施工状态",formatter:format_status,width:85,align:'center'},
			{title: "路面状态",formatter:format_type,width:85,align:'center'},
			{title: "规划许可证号码",formatter:format_number,width:150,align:'center'},
			{title: "申请单位",formatter:format_unit,align:'center'},
			{title: "用途原因",formatter:format_reason,align:'center'}
			//{title: "占用、挖掘地点",formatter:format_place,align:'center'}
			]
	     }); 
	     table.on('post-body.bs.table', function (row,obj) {
				window.frames["queryIframe"].$(".fixed-table-body").mCustomScrollbar();
		 });
		 table.on('dbl-click-row.bs.table', function (row,obj) {
				openWfBusInstance(obj[1]);
		 });
	} else if(queryType==3){
		createrLayer("dljc").clear();
		createrLayer("dlkw").clear();
		adddljcGraphics(startTime,endTime);
		adddlkwGraphics(startTime,endTime);
	}
	//$(".top-queryBar").click();
}

function format_district(value, row, index){
    var dv=row[3];
	if (dv == 1) {
		return "青秀区";
	} else if(dv == 2) {
		return "兴宁区";
	} else if(dv == 3) {
		return "西乡塘区";
	} else if(dv == 4) {
		return "良庆区";
	} else if(dv == 5) {
		return "江南区";
	} else if(dv == 6) {
		return "邕宁区";
	} else if(dv == 7) {
		return "武鸣县";
	} else if(dv == 8) {
		return "隆安县";
	} else if(dv == 9) {
		return "马山县";
	} else if(dv == 10) {
		return "上林县";
	} else if(dv == 11) {
		return "宾阳县";
	} else if(dv == 12) {
		return ">横县";
	} else {
		return "";
	}
}

function format_name(value, row, index){
	 return row[6]; 
}

function format_content(value, row, index){
	  return row[4];
}

function format_unit(value, row, index){
	if(row[6])
	  return row[6];
	else 
	  return ''; 
}

function format_reason(value, row, index){
	if(row[10])
	  return row[10];
	else 
	  return ''; 
}

function format_place(value, row, index){
    if(row[11])
	  return row[11];
	else 
	  return ''; 
}

function format_time(value, row, index){
	if(row[5])
	  return getLocalDate(row[5].time);
	else 
	  return ''; 
}

function format_affix(value, row, index){
	if(row[8])
	  return row[8];
	else 
	  return '';  
}

function format_status(value, row, index){
	var appleOccupyEndTime=null;
	if(row[5])
		appleOccupyEndTime = new Date(getLocalDate(row[5].time).replace(/-/g,"/"));
	var completeTime=null;
	if(row[7])
		completeTime=new Date(getLocalDate(row[7].time).replace(/-/g,"/"));
	var nowDate=new Date();
	if(!appleOccupyEndTime)
		return "<span style='color:red'>未知</span>";
	else if(appleOccupyEndTime>nowDate)
		return "<span style='color:red'>施工中</span>";
	else if(!completeTime&&appleOccupyEndTime<nowDate)
		return "<span style='color:red'>超期</span>";
	else if(completeTime>nowDate&&appleOccupyEndTime<nowDate)
		return "<span style='color:red'>超期</span>";
	else
		return '完成';
}

function format_type(value, row, index){
    var roadType=row[8];
	if (roadType == 1) {
		return "沥青路面";
	} else if(roadType == 2) {
		return "水泥路面";
	} else if(roadType == 3) {
		return "泥土路面";
	} else if(roadType == 4) {
		return "普砖";
	} else if(roadType == 5) {
		return "彩砖";
	} else if(roadType == 6) {
		return "广场砖";
	} else {
		return "";
	}
}

function format_number(value, row, index){
	if(row[9])
	  return row[9];
	else 
	  return ''; 
}


function queryParams(params) {
  return {
	  pageSize:params.limit,
	  pageNo: params.offset/params.limit+1
  };
}

//创建可视化查询panel
var awaterui=(function(){
	return{
		//创建地图查询菜单
		mapQueryBar:function(){
			var innerHtml='<div class="queryBar" style="bottom:-365px;">'+
				'<div class="top-queryBar" status="flod"><a id="togger_link" href="#">查询条件<em1></em1></a></div>'+
				'<div class="content-queryBar clearfix"><iframe id="queryIframe" name="queryIframe" frameborder="0" src="queryBar.html" style="width:100%;height:100%;overflow: hidden;"></iframe></div></div>';
			$("#mapDiv").append(innerHtml);
			$(".queryBar").animate({ bottom: - $(".queryBar").height()+25 }, 100);
			$(".top-queryBar").attr("status","flod");
			$(".top-queryBar").click(function(){
				var status=$(".top-queryBar").attr("status");
				if(status=="flod"){
					$(".queryBar").animate({ bottom: - $(".queryBar").height()+420 }, 100);
					$(".top-queryBar").attr("status","unflod");
					$(".top-queryBar").html("<a id=\"togger_link\" href=\"#\">查询内容<em></em>");
				} else {
					$(".queryBar").animate({ bottom: - $(".queryBar").height()+25 }, 100);
					$(".top-queryBar").attr("status","flod");
					$(".top-queryBar").html("<a id=\"togger_link\" href=\"#\">查询内容<em1></em1>");
				}
			});
			$(".top-queryBar").click();
		}
	}
})();
