
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) return unescape(r[2]); return "";
}

//当前成员单位编号
var districtUnitId=getQueryStr("districtUnitId");
//当前成员单位应急响应编号
var yaDistrictId=getQueryStr("yaDistrictId");
//当前市级应急响应编号
var id=getQueryStr("id");
//调度室页面定时器句柄
var intervalIndex;   
//地图单击事件句柄
var mapClickEventObject;

//地图页面window
var muniMap;
//当前成员单位名称
var districtName;
//当前成员单位区域
var districtArea="";
//特殊成员单位标识
var specialArea=false;
//获取当前成员单位信息
$.ajax({
	method : 'GET',
	url : '/agsupport/om-org!input.action?orgId='+districtUnitId,
	async : false,
	success : function(data) {
		districtName=data.result[0].orgName;
		if(data.result[0].orgType==3)
			specialArea=true;
		for(var index in nnArea){
			if(nnArea[index].name==districtName){
				districtArea=nnArea[index].code;
			}				   
		}		
	},
	error : function(e) {
		parent.layer.msg('获取当前用户基本信息失败！');
	}
});

//页面初始化加载表格数据
(function($){
	$(window).resize(function () {
		$('#table_team').bootstrapTable('resetView');
		$('#table_jsd').bootstrapTable('resetView');
	});

	$(window).load(function(){
		$("#map").attr("src","/awater/nnwaterSystem/EmergenControl/District/map/map.html?modelId="+yaDistrictId); 
		$("#AlarmInfo").attr("src","/awater/nnwaterSystem/Alarm/District/AlarmInfoNew.html?districtYaId="+id);
		$("#superviseRec").attr("src","/awater/nnwaterSystem/EmergenControl/District/Supervise/SuperviseNews.html?districtUnitId="+districtUnitId);
		intervalIndex=setInterval("reload()",30000);
		
		var table_team_height=$("#ya_team").height()-$("#ya_team .panel-body #queryBar").height()-$("#ya_team .panel-heading").height();
		$.ajax({
			type: 'get',
			url : '/agsupport/yj-team!listAllByModelId.action?modelId='+yaDistrictId,
			dataType : 'json',  
			success : function(data) {
				$("#table_team").bootstrapTable({
					height: table_team_height,
					toggle:"table",
					data : data,
					clickToSelect:true,
					rowStyle:"rowStyle",
					sidePagination: "server",
					search:false,
					columns: [
						{field:'id',visible: false,title: 'id'},
						{field:'icon',visible: true,title: '操作',align:'center',formatter:"operateFormatterPsn"},
						{field:'contact',visible: true,title: '姓名',align:'center'},
						{field:'name',visible: true,title: '隶属部门',align:'center'},
						{visible: true,title: '通知',align:'center',formatter:"sendSmsDic"}]
				});
			},
			error : function() {
				parent.layer.msg('获取应急队伍信息失败！');
			}
		});                
																			
		$("#table_team").on('post-body.bs.table', function (row,obj) {
			$(".fixed-table-body").mCustomScrollbar();
		});
		
		var table_jsd_height=$("#ya_jsd").height()-$("#ya_jsd .panel-body #queryBar").height()-$("#ya_jsd .panel-heading").height();

		 var url="/agsupport/ps-comb!listNoPageJson.action?estType=13";
		 if(districtArea){
		      url+="&area="+districtArea;
		 }
		 $("#table_jsd").bootstrapTable({
				toggle:"table",
				url:url,
				rowStyle:"rowStyle",
				height: table_jsd_height,
				pagination:false,
				cache: false, 
				checkboxHeader:false,
				singleSelect:true,
				clickToSelect:true,
				sidePagination: "server",
				columns: [
					{field:'combName',visible: true,title: '名称',align:'center'},
					{field:'estDept',visible: true,title: '记录建立单位',align:'center'}]
		});              
				
		$("#table_jsd").on('post-body.bs.table', function (row,obj) {
			$(".fixed-table-body").mCustomScrollbar();
		});
		
		$("#table_jsd").on('click-row.bs.table', function (row,obj) {
		    $("#map")[0].contentWindow.centerAtJsd(obj.xcoor,obj.ycoor);
        });
	        
		$("#table_problem").bootstrapTable({
			toggle:"table",
			height:$("#buttomDiv").height(),
			url:'/agsupport/yj-problem-report!listJsonDispatchRoom.action?yaId='+yaDistrictId,
			clickToSelect:true,
			rowStyle:"rowStyle",
			sidePagination: "server",
			search:false,
			uniqueId:"id",
			columns: [
				{field:'id',visible: false,title: 'id'},
				{field:'problemName',title: '事件名称',align:'center',formatter:format_view},
				{field:'problemAction',title: '上报时间',align:'center',formatter:format_action},
				{field:'problemTime',title: '上报时间',align:'center',formatter:format_date},
				{field:'problemPerson',title: '上报人',align:'center'},
				{field:'problemLocation',title: '定位',align:'center',formatter:format_location},
				{field:'problemStatus',title: '状态',align:'center',formatter:format_status}]
		});
		
		muniMap=window.frames['map'];
	});
	        
	$.ajax({
		method : 'GET',
		url : '/agsupport/meteo-hydrolog-alarm!listJson.action',
		async : true,
		dataType : 'json',
		success : function(data) {		
			if(data.cityRecord){
				$("#cityRecord").html(data.cityRecord.templateName);
				$("#cityA").on("click",function(){
				    showRecordWindow('/awater/nnwaterSystem/EmergenControl/Municipal/Record/Record_Input.html?yaCityId='+data.cityRecord.id+"&showStart=0",'市级应急预案详细')
				});
			} else {
				$("#cityRecord").html("已结束");
			}
			if(data.districtRecord){
			    for(var index in data.districtRecord){
			        if(data.districtRecord[index].status==1){
			            $("#districtRecord").html(data.districtRecord[index].templateName);
			            $("#districtA").on("click",function(){
						    if(parent.createNewtab)
								parent.createNewtab('/awater/nnwaterSystem/EmergenControl/District/Record/Record_Alarm_Input.html?id='+data.districtRecord[index].id+"&view=1",'成员单位应急预案详细');
							else
								parent.parent.createNewtab('/awater/nnwaterSystem/EmergenControl/District/Record/Record_Alarm_Input.html?id='+data.districtRecord[index].id+"&view=1",'成员单位应急预案详细');
						});					            
					}
				}
			}
		},
		error : function() {
			parent.layer.msg('获取预警日志失败！');
		}
	});
	$.ajax({
		url: "/agsupport/ya-record-district!inputJsonNoL.action?id="+yaDistrictId, 
		dataType:'json',
		async: false,
		success: function(data){
			$("#districtRecord").html(data.form.templateName);
			$("#districtA").on("click",function(){
		        if(parent.createNewtab)
					parent.createNewtab('/awater/nnwaterSystem/EmergenControl/District/Record/Record_Alarm_Input.html?id='+yaDistrictId+"&view=1",'成员单位应急预案详细');
				else
					parent.parent.createNewtab('/awater/nnwaterSystem/EmergenControl/District/Record/Record_Alarm_Input.html?id='+yaDistrictId+"&view=1",'成员单位应急预案详细');
			});
		},
		error:function(){
			parent.layer.msg('获取成员单位基本信息失败！');
		}
	});
})(jQuery);

//刷新调度室数据
function reload(){
	window.frames[0].location.reload();
	window.frames[1].location.reload();
	$("#table_problem").bootstrapTable('refresh', {url: '/agsupport/yj-problem-report!listJsonDispatchRoom.action?yaId='+yaDistrictId});
}

//关闭弹出窗
function closeLayer(index){
	layer.close(index);
}

//地图定位调度物资位置
function operateFormatterPsn(value, row, index) {
	return "<a onclick=\"javascript:muniMap.locatePerson("+row.id+")\"><img src=\"/awater/img/blue-gislocate.png\"></img></a>";
}
	   
//地图定位调度人员位置
function locationGood(value, row, index) {
	return "<a onclick=\"javascript:muniMap.locateGood("+row.id+")\"><img src=\"/awater/img/blue-gislocate.png\"></img></a>";
}

//格式化物资数量
function operateFormatterNum(value, row, index){     
	return value+row.unit;
}

function format_view(value, row, index){
	if(row.problemAction==5)
		return " <a href=\"#\" onclick=\"showOProblem("+row.id+")\">"+value+"</a>";
	else
		return " <a href=\"#\" onclick=\"showProblem("+row.id+")\">"+value+"</a>";
}

//格式化问题上报状态
function format_status(value, row, index){
	if(value==0)
		return "上报";
	else
		return "核查";
}

//格式化表格日期
function format_date(value, row, index){
	if(value)
		return getLocalTime(value.time);
	else
		return '';
}

function format_location(value, row, index){
	if(row.problemAction==5)
		return "<button class='btn btn-primary' style='padding: 0px;vertical-align: top;width: 70px;height: 21px;' type='button'  onclick=muniMap.locationOP('"+row.id+"')><i class='fa fa-check'></i>定位</button>";
	else
		return "";
}

function format_action(value, row, index){
	if(value>=0&&value<4)
		return "现场情况上报";
	else if(value==5)
		return "其他问题上报";
	else
		return "未知类型";
}
//表格自适应
$(window).resize(function () {
	$('#table_jsd').bootstrapTable('resetView');
	//$('#table_team').bootstrapTable('resetView');
	$('#table_problem').bootstrapTable('resetView');
});

//查看启动应急预案内容
function showRecordWindow(url,title){
	layer.open({
		type: 2,
		title: title,
		shadeClose: false,
		shade: 0.5,
		area: ['900px', '600px'],
		content: url
	}); 	
}
//查看应急问题详细
function showProblem(id){			
	layer.open({
		type: 2,
		title: '应急问题详细',
		maxmin: true, 
		area: ['900px', '600px'],
		content: '/awater/nnwaterSystem/EmergenControl/ProblemReport/ProblemReport_Input_View.html?id='+id
	});
}
//查看其他应急问题详细
function showOProblem(id){			
	layer.open({
		type: 2,
		title: '应急问题详细',
		maxmin: true, 
		shadeClose: true,
		area: ['750px', '400px'],
		content: '/awater/nnwaterSystem/EmergenControl/ProblemReport/OtherProblem_Input.html?id='+id
	});
}
//其他问题上报，点位采集
function pickPoint(OPwindow){
	var map=muniMap.map;
	mapClickEventObject=map.on("mouse-down", function (p) {
		var x=p.mapPoint.x;
		var y=p.mapPoint.y;
		
		OPwindow.$("#longitude").val(x);
		OPwindow.$("#latitude").val(y);
		OPwindow.maxThisLayer();
		
		OPwindow.$("#locationStatus").text("已定位");
		OPwindow.$("#locationStatus").css("color","black");
		
		mapClickEventObject.remove();
	});
}
function sendSmsDic(value,row,index){
	return '<button class="btn btn-primary" style="padding: 0px;vertical-align: top;width: 70px;height: 21px;" type="button" id="endBtn" onclick="sendSmsDictrict('+row.id+')">短信督办</button>';
}
function sendSmsDictrict(teamId){
	layer.open({
		type: 2,
		title: '短信督办',
		area: ['550px', '250px'],
		content: '/awater/nnwaterSystem/EmergenControl/dispatchAction/DistrictSendSms/DistrictSendSms.html?teamId='+teamId+'&yaDistrictId='+id
	});
}
