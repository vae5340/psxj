function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}
//积水点编号
var jsdId=getQueryStr("jsdId");
//成员单位应急响应编号
var yaId=getQueryStr("yaId");
//市级应急响应编号
var yaCityId;
//成员单位编号
var districtUnitId;
//地图页面window
var controlMap;
//视频播放对象
var player;

var districtYaObj;

Highcharts.setOptions({ global: { useUTC: false } }); 

//出水口
var datasCSK=Array();
datasCSK.push([
	[{typename:"管道流量",y:0.02}],
	[{typename:"管道流量",y:0.03}],
	[{typename:"管道流量",y:0.04}],
	[{typename:"管道流量",y:0.05}],
	[{typename:"管道流量",y:0.06}],
	
	[{typename:"管道流量",y:0.08}],
	[{typename:"管道流量",y:0.10}],
	[{typename:"管道流量",y:0.13}],
	[{typename:"管道流量",y:0.16}],
	[{typename:"管道流量",y:0.19}],
	
	[{typename:"管道流量",y:0.22}],
	[{typename:"管道流量",y:0.25}],
	[{typename:"管道流量",y:0.29}],
	[{typename:"管道流量",y:0.27}],
	[{typename:"管道流量",y:0.24}],
	
	[{typename:"管道流量",y:0.21}],
	[{typename:"管道流量",y:0.19}],
	[{typename:"管道流量",y:0.18}],
	[{typename:"管道流量",y:0.17}],
	[{typename:"管道流量",y:0.16}],
	[{typename:"管道流量",y:0.15}]
]);
//井下水深
var datasJXSS=Array();
datasJXSS.push([
	[{typename:"井下水深",y:0.20}],
	[{typename:"井下水深",y:0.85}],
	[{typename:"井下水深",y:1.45}],
	[{typename:"井下水深",y:1.71}],
	[{typename:"井下水深",y:2.10}],
	
	[{typename:"井下水深",y:2.62}],
	[{typename:"井下水深",y:2.93}],
	[{typename:"井下水深",y:3.37}],
	[{typename:"井下水深",y:4.04}],
	[{typename:"井下水深",y:4.61}],
	
	[{typename:"井下水深",y:5.20}],
	[{typename:"井下水深",y:5.79}],
	[{typename:"井下水深",y:6.06}],
	[{typename:"井下水深",y:6.55}],
	[{typename:"井下水深",y:7.10}],
	
	[{typename:"井下水深",y:7.16}],
	[{typename:"井下水深",y:6.92}],
	[{typename:"井下水深",y:6.78}],
	[{typename:"井下水深",y:6.32}],
	[{typename:"井下水深",y:6.20}],
	[{typename:"井下水深",y:6.20}]
]);

//积水点
var datasJSD=Array();
datasJSD.push([
	[{typename:"积水点",y:0.10}],
	[{typename:"积水点",y:0.12}],
	[{typename:"积水点",y:0.16}],
	[{typename:"积水点",y:0.15}],
	[{typename:"积水点",y:0.30}],
	
	[{typename:"积水点",y:0.70}],
	[{typename:"积水点",y:0.90}],
	[{typename:"积水点",y:1.20}],
	[{typename:"积水点",y:1.40}],
	[{typename:"积水点",y:1.70}],
	
	[{typename:"积水点",y:1.70}],
	[{typename:"积水点",y:1.60}],
	[{typename:"积水点",y:1.40}],
	[{typename:"积水点",y:1.20}],
	[{typename:"积水点",y:0.90}],
	
	[{typename:"积水点",y:0.60}],
	[{typename:"积水点",y:0.40}],
	[{typename:"积水点",y:0.30}],
	[{typename:"积水点",y:0.20}],
	[{typename:"积水点",y:0.10}],
	[{typename:"积水点",y:0.10}]
]);

$(function(){
	$("#mapDiv").attr("src","map/map.html?jsdId="+jsdId);
	controlMap=window.frames['mapDiv'];
	//$("#videoMoniter").append("<embed name=\"ply\" width=\"100%\" height=\"176\" id=\"ply\" src=\"/awater/nnwaterSystem/popup/ply/player.swf\" type=\"application/x-shockwave-flash\" flashvars=\"file=/awater/nnwaterSystem/popup/ply/a1.flv&amp;image=img/preview.gif&amp;autostart=true\" allowscriptaccess=\"always\" allowfullscreen=\"false\" quality=\"high\" bgcolor=\"red\">");
	//$("#videoMoniter").append("<embed name=\"ply\" width=\"100%\" height=\"176\" id=\"ply\" src=\"/awater/nnwaterSystem/popup/ply/player.swf\" type=\"application/x-shockwave-flash\" flashvars=\"file=/awater/nnwaterSystem/popup/ply/a3.flv&amp;image=img/preview.gif&amp;autostart=true\" allowscriptaccess=\"always\" allowfullscreen=\"false\" quality=\"high\" bgcolor=\"red\">");
			
	$.ajax({
		url: "/agsupport/ya-record-district!inputJsonNoL.action?id="+yaId, 
		dataType:'json',
		async: false,
		success: function(data){
			yaCityId=data.form.yaCityId;
			districtUnitId=data.form.districtUnitId;
			districtYaObj = data.form;
			$("#districtRecord").html(data.form.templateName);
			$("#districtA").on("click",function(){
				parent.createNewtab('/awater/nnwaterSystem/EmergenControl/District/Record/Record_Alarm_Input.html?id='+data.form.id+"&view=1",'成员单位应急预案详细');
			});
			$("#superviseIframe").attr("src","/awater/nnwaterSystem/EmergenControl/District/Supervise/SuperviseNewsReviewWide.html?yaId="+yaCityId+"&districtUnitId="+districtUnitId);
			var startDateTime = new Date(data.form.recordCreateTime.time).format('yyyy-MM-dd hh:mm:ss');
			var endDateTime = new Date(data.form.recordCloseTime.time).format('yyyy-MM-dd hh:mm:ss');
			getRainData(startDateTime,endDateTime);
			getTeamData(startDateTime,endDateTime,yaId);
		},
		error:function(){
			alert("error");
		}
	});
	$.ajax({
		url: "/agsupport/ya-record-city!inputJson.action?id="+yaCityId, 
		dataType:'json',
		async: false,
		success: function(data){
			$("#cityRecord").html(data.form.templateName);
			$("#cityA").on("click",function(){
			    parent.createNewtab('/awater/nnwaterSystem/EmergenControl/Municipal/Record/Record_Input.html?yaCityId='+data.form.id+"&showStart=0",'市级应急预案详细');
			});
		},
		error:function(){
			alert("error");
		}
	});
	var table_team_height=$("#ya_team").height()-$("#ya_team .panel-header").height();
	
	$("#table_team").bootstrapTable({
		height: table_team_height,
		toggle:"table",
		url :'/agsupport/yj-team!listAllByModelId.action?modelId='+yaId,
		rowStyle:"rowStyle",
		search:false,
		columns: [
			{field:'id',visible: false,title: 'id'},
			{field:'icon',visible: true,title: '操作',align:'center',formatter:operateFormatterPsn},
			{field:'contact',visible: true,title: '姓名',align:'center'},
			{field:'name',visible: true,title: '隶属部门',align:'center'}]
	});
	$("#table_team").on('post-body.bs.table', function (row,obj) {
		$(".fixed-table-body").mCustomScrollbar();
	});
	
	/*var table_good_height=$("#ya_good").height()-$("#ya_good .panel-header").height();

	$.ajax({
		type: 'get',
		url : '/agsupport/yj-good!listAllByModelId.action?modelId='+yaId,
		dataType : 'json',  
		success : function(data) {							
			$("#table_good").bootstrapTable({
				height: table_good_height,
				toggle:"table",
				data : data,
				clickToSelect:true,
				rowStyle:"rowStyle",
				sidePagination: "server",
				search:false,
				columns: [
					{field:'id',visible: false,title: '编号'},
					{field:'icon',visible: true,title: '操作',align:'center',formatter:locationGood},
					{field:'name',visible: true,title: '名称',align:'center'},
					{field:'code',visible: true,title: '代码',align:'center'},
					{field:'model',visible: true,title: '型号',align:'center'},
					{field:'amount',visible: true,title: '数量',align:'center',formatter:operateFormatterNum}]
			});
		},
		error : function() {
			parent.layer.msg('请求失败');
		}
	});                
			
	$("#table_good").on('post-body.bs.table', function (row,obj) {
		$(".fixed-table-body").mCustomScrollbar();
	});*/
	$("#waterLevelMoniter").mCustomScrollbar();
	
	$("#videoMoniter").mCustomScrollbar({mouseWheelPixels:100});
	
	$("#ya_title").mCustomScrollbar();
	
	$("#startButton").on("click",function(){
		playbackBtnOnClick();
	});
	$("#endButton").on("click",function(){
		stopbackBtnOnClick();
	});
});

/**
 * 日期转换
 */
Date.prototype.format =function(format){
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
            (this.getFullYear()+"").substr(4- RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
                RegExp.$1.length==1? o[k] :
                        ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}
/**
 * 获取降雨量数据
 */
function getRainData(stratTime,endTime){
	var param={
		s:stratTime,
		e:endTime
	}
	$.ajax({
		url: "/agsupport/rest/swmmTimeseriesRest/getForTime/?d="+new Date(), 
		data:param,
		dataType:'json',
		async: false,
		success: function(results){
			var datasYQ = new Array();
			$(results).each(function(index,item){
				datasYQ.push([item.dataMillisecond,item.value]);
			});
			loadYQData(datasYQ);
		},
		error:function(){
			
		}
	});	
}

function getRainData(startTime,endTime){
	var param={s:startTime,e:endTime}
	$.ajax({
		url: "/agsupport/rest/swmmTimeseriesRest/getForTime/?d="+new Date(), 
		data:param,
		dataType:'json',
		async: false,
		success: function(results){
			var datasYQ = new Array();
			$(results).each(function(index,item){
				datasYQ.push([item.dataMillisecond,item.value]);
			});
			loadYQData(datasYQ);
		},
		error:function(){
			
		}
	});	
}
var teamData;
function getTeamData(startTime,endTime,yaId){
	$.ajax({
		url: "/agsupport/yj-gps-record!loadFloodReviewTeamGps.action", 
		data:{startTime:startTime,endTime:endTime,yaId:yaId},
		dataType:'json',
		cache: false,
		success: function(data){
			teamData = data;
		},
		error:function(){
			
		}
	});	
}
//地图定位调度物资位置
function operateFormatterPsn(value, row, index) {
	return "<a onclick=\"javascript:controlMap.contentWindow.locatePerson("+row.id+")\"><img src=\"/awater/img/blue-gislocate.png\"></img></a>";
}
//格式化物资数量
function operateFormatterNum(value, row, index) {     
	return value+row.unit;
}
//地图定位调度人员位置
function locationGood(value, row, index) {
	return "<a onclick=\"javascript:controlMap.locateGood("+row.id+")\"><img src=\"/awater/img/blue-gislocate.png\"></img></a>";
}
