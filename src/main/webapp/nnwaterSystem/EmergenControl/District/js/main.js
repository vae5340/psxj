
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) return unescape(r[2]); return "";
}
//当前成员单位编号
var districtUnitId=getQueryStr("districtUnitId");	 
//当前应急响应编号	       
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
//获取当前成员单位信息
$.ajax({
	method : 'GET',
	url : '/agsupport/om-org!getOrganizationName.action',
	async : false,
	success : function(data) {
		districtName=data;	
		for(var index in nnArea){
			if(nnArea[index].name==districtName){
				districtArea=nnArea[index].code;
				break;
			}
		}
	},
	error : function(e) {
		alert('请求失败');
	}
});
var specialArea=false;
//查看是不是特殊成员单位     
$.ajax({
	url : '/agsupport/om-org!obtainUserType.action',
	async : false,
	dataType:"json",		
	success : function(data) {
		if(data.userType==3){
		   specialArea=true;
		}		
	},
	error : function(e) {
		alert('error');
	}
});
//页面初始化加载表格数据
(function($){
	$(window).resize(function () {
		$('#table_team').bootstrapTable('resetView');
		$('#table_jsd').bootstrapTable('resetView');
	});

	$(window).load(function(){
		$("#map").attr("src","/awater/nnwaterSystem/EmergenControl/District/map/map.html?modelId="+id); 
		$("#AlarmInfo").attr("src","/awater/nnwaterSystem/Alarm/District/AlarmInfoNew.html?districtYaId="+id);
		$("#superviseRec").attr("src","/awater/nnwaterSystem/EmergenControl/District/Supervise/SuperviseNews.html?districtUnitId="+districtUnitId);
		intervalIndex=setInterval("reload()",30000);
		
		var table_team_height=$("#ya_team").height()-$("#ya_team .panel-body #queryBar").height()-$("#ya_team .panel-heading").height();
		$.ajax({
			type: 'get',
			url :'/agsupport/yj-team!listAllByModelId.action?modelId='+id,
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
						{field:'icon',visible: true,title: '定位',align:'center',formatter:"operateFormatterPsn"},
						{field:'contact',visible: true,title: '姓名',align:'center'},
						{field:'name',visible: true,title: '隶属部门',align:'center'},
						{visible: true,title: '通知',align:'center',formatter:"sendSmsDic"}]
				});
			},
			error : function() {
				parent.layer.msg('请求失败');
			}
		});                
																			
		$("#table_team").on('post-body.bs.table', function (row,obj) {
			$(".fixed-table-body").mCustomScrollbar();
		});
		
		var table_jsd_height=$("#ya_jsd").height()-$("#ya_jsd .panel-body #queryBar").height()-$("#ya_jsd .panel-heading").height();

		/*$.ajax({
			type: 'get',
			url : location.protocol+"//"+location.hostname+":"+location.port+'/agsupport/yj-good!listAllByModelId.action?modelId='+id,
			dataType : 'json',  
			success : function(data) {							
				$("#table_jsd").bootstrapTable({
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
						{field:'amount',visible: true,title: '数量',align:'center',formatter:"operateFormatterNum"}]
				});
			},
			error : function() {
				parent.layer.msg('请求失败');
			}
		});*/
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
			url:'/agsupport/yj-problem-report!listJsonDispatchRoom.action?yaId='+id,
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
				    showRecordWindow('/awater/nnwaterSystem/EmergenControl/Municipal/Record/Record_Input.html?yaCityId='+data.cityRecord.id+"&showStart=0",'市级应急预案详细');
				});
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
						//插入预案调整按钮
						if(id)
							$("#districtRecordDiv").append("<button class='btn btn-primary' style='margin-left:5px;padding: 0px;height:20px;' type='button' onclick='resetRecord()'>预案调整</button>");
					}
				}
			}
		},
		error : function() {
			parent.layer.msg('请求失败');
		}
	});
})(jQuery);

//新增应急积水点操作
function addJsd(){
	var map=muniMap.map;
	if(mapClickEventObject!=null)
		return ;
	mapClickEventObject=map.on("mouse-down", function (p) {
		var x=p.mapPoint.x;
		var y=p.mapPoint.y;

		layer.prompt({title: '请输入应急积水点名称'}, function(value, index, elem){
			doSave(value,x,y);
			layer.close(index);
		});
		mapClickEventObject.remove();
		mapClickEventObject=null;
	});
}
//刷新调度室数据
function reload(){
	window.frames[0].location.reload();
	window.frames[1].location.reload();
	$("#table_problem").bootstrapTable('refresh', {url: '/agsupport/yj-problem-report!listJsonDispatchRoom.action?yaId='+id});
	map.refreshLayer();
}

//保存新增积水点信息
function doSave(combName,x,y){
	$.post("/agsupport/comb/ps-comb!doSave.action",{
			"form.combName":combName,
			"form.estType":13,
			"form.xcoor":x,
			"form.ycoor":y,
			"form.estDept":districtName,
			"form.orgDept":districtName,						
			"form.area":districtArea
		},
		function(result){
		    mapClickEventObject.remove();
			var map=muniMap.map;
			map.removeLayer(map.getLayer("ssjk_13"));
			window.frames[2].ssjkInit();									
		}
	);
}
//检查当前预案是否可以提交事中报告
function checkAllowprocessRep(){
	$.ajax({
		method:'GET',
		url:'/agsupport/ya-process-report!checkCreateDistrictReport.action',
		data:{districtYaId:id},
		dataType : 'json',
		async:false,
		success:function(data){
    		if(data.statusId==1){
    			//不可以提交事中报告（检查数据库无市级事中报告督办）
    			layer.msg("当前市级没发起事中报告督办，不能生成事中报告");
    		} else if(data.statusId==2){
    			//可提交事中报告（检查数据有事中报告且当前未提交事中报告）
    			 processRep();
    		} else if(data.statusId==3) {
    			//不可提交事中报告（检查数据有事中报告且当前已提交事中报告）
    			layer.msg("当前市级没发起事中报告督办，不能生成事中报告");
    		} else {
    			//未知状态
    			layer.msg("检查生成事中报告失败");
    		}
		},
		error:function (e){
			layer.msg("检查生成事中报告失败");
		}
	});
}
//新增事中报告
function processRep(){
	layer.confirm('是否提交事中报告？', {btn: ['是','否']},
	function(index){
		$.ajax({
			method:'GET',
			url:'/agsupport/ya-process-report!produceDistrictReportContent.action?districtYaId='+id,
			dataType : 'json',  
			async:false,
			success:function(data){
				if(data.id!=null){
					parent.createNewtab('/awater/nnwaterSystem/EmergenControl/District/processReport/processReport.html?yaId='+id+"&districtUnitId="+districtUnitId+"&id="+data.id,"提交事中报告");	
					layer.close(index);
				} else {
					layer.msg("生成事中报告失败");
					layer.close(index);
				}
			},
			error:function (e){
				layer.msg("请求失败");
				layer.close(index);
			}
		});
	}, 
	function(){
	});
}

//结束当前应急响应预案
function endRecord(){
	layer.confirm('是否确定结束当前应急响应预案？', {btn: ['是','否'] //按钮
		},
		function(){
			$.ajax({
				type: 'post',
				url : '/agsupport/ya-record-district!endRecordJson.action?id='+id,
				dataType : 'json',  
				success : function(data) {
					parent.layer.msg(data.result);
					if(data.closeTab==true){
						//parent.createNewtab("/awater/nnwaterSystem/EmergenControl/District/RainNews/listView.html?id="+data.rainReportForm.id,"修改"+districtName+"一雨一报");						
						clearInterval(intervalIndex);
						muniMap.stopInterval();
						var rmPart=location.protocol+"//"+location.hostname+":"+location.port;
						var queryUrl=window.location.href.substring(rmPart.length);
						parent.closeNavTab(queryUrl);
					}
					layer.close(layer.index);
				},
				error : function() {
					layer.msg('请求失败');
				}
			});
		}, 
		function(){}
	);
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

function format_action(value, row, index){
	if(value>=0&&value<4)
		return "现场情况上报";
	else if(value==5)
		return "其他问题上报";
	else
		return "未知类型";
}

function format_location(value, row, index){
	if(row.problemAction==5)
		return "<button class='btn btn-primary' style='padding: 0px;vertical-align: top;width: 70px;height: 21px;' type='button'  onclick=muniMap.locationOP('"+row.id+"')><i class='fa fa-check'></i>定位</button>";
	else
		return "";
}

//格式化问题上报状态
function format_status(value, row, index){
	if(value==0)
		return "<font style='color:red;'>未处理</font>";
	else
		return "已处理";
}

//格式化表格日期
function format_date(value, row, index){
	if(value)
		return getLocalTime(value.time);
	else
		return '';
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
//新增问题上报页面
function showWindow(){
	layer.msg('请选择上报类型',{
			time: 0 ,btn: ['现场情况上报','其他问题上报'],
			yes:function(){
				layer.close(layer.index);
				layer.open({
					type: 2,
					title: '应急问题上报',
					shadeClose: true,
					shade: 0.5,
					area: ['850px', '550px'],
					content: '/awater/nnwaterSystem/EmergenControl/ProblemReport/ProblemReport_Input.html?districtYaId='+id
				});
			}, 
			btn2:function(){
				layer.open({
					type: 2,
					title: '其他问题上报',
					shadeClose: false,
					shade: 0,
					maxmin: true,
					area: ['750px', '400px'],
					content: '/awater/nnwaterSystem/EmergenControl/ProblemReport/OtherProblem_Input.html?districtYaId='+id
				});
			}
		}
	);
}
//查看应急问题详细
function showProblem(id){			
	layer.open({
		type: 2,
		title: '应急问题详细',
		maxmin: true,
		shadeClose: true,
		area: ['900px', '100%'],
		content: '/awater/nnwaterSystem/EmergenControl/ProblemReport/ProblemReport_Edit.html?id='+id
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
//应急预案升级
function resetRecord(){
	layer.open({
		type: 2,
		title: '预案调整',
		shadeClose: false,
		shade: 0.5,
		area: ['900px', '400px'],
		content:"/awater/nnwaterSystem/EmergenControl/District/DispatchLog/Template_Alarm_List.html?districtYaId="+id+"&districtUnitId="+districtUnitId
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