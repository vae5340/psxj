define(['jquery','layer','awaterui','psemgy/eims/dispatch/pages/district/map/js/initMap','ssjk-data','dateUtil','areaUtil','bootstrap','bootstrapTable','bootstrapTableCN','mousewheel','customScrollbar'],function($,layer,awaterui,initMap,ssjkData,dateUtil,areaUtil){
	//当前成员单位编号
	var districtUnitId;
	//当前成员单位应急响应编号
	var yaDistrictId;
	//当前市级应急响应编号
	var id;
	//调度室页面定时器句柄
	var intervalIndex;   
	//地图单击事件句柄
	var mapClickEventObject;

	//当前成员单位名称
	var districtName;
	//当前成员单位区域
	var districtArea="";
	//特殊成员单位标识
	var specialArea=false;

	//页面初始化加载表格数据
	function init(_id,districtUnitId){
		//yaDistrictId=id
		id=_id;
		//获取当前成员单位信息
		$.ajax({
			method : 'GET',
			url : '/agsupport/om-org!input.action?orgId='+districtUnitId,
			async : false,
			success : function(data) {
				districtName=data.result[0].orgName;
				if(data.result[0].orgType==3)
					specialArea=true;
				for(var index in areaUtil.xzArea){
					if(areaUtil.xzArea[index].name==districtName){
						districtArea=areaUtil.xzArea[index].code;
						break;
					}				   
				}		
			},
			error : function(e) {
				layer.msg('获取当前用户基本信息失败！');
			}
		});

		/*$(window).resize(function () {
			$('#table_team').bootstrapTable('resetView');
			$('#table_jsd_hist').bootstrapTable('resetView');
		});*/

		//$(window).load(function(){
			//$("#map").attr("src","/psemgy/eims/dispatch/pages/district/map/map.html?modelId="+yaDistrictId);
			//$("#AlarmInfo").attr("src","/psemgy/eims/dispatch/pages/district/alarm/alarmInfoNew.html?districtYaId="+id);
			//$("#superviseRec").attr("src","/psemgy/eims/dispatch/pages/district/supervise/superviseNews.html?districtUnitId="+districtUnitId);
            /*$("#map").load("/psemgy/eims/dispatch/pages/district/map/map.html",function(map){
                 map.init(yaDistrictId);   
			});
			$("#AlarmInfo").load("/psemgy/eims/dispatch/pages/district/alarm/alarmInfoNew.html",function(alarmInfoNew){
                 alarmInfoNew.init(id);
			});
			$("#superviseRec").load("/psemgy/eims/dispatch/pages/district/supervise/superviseNews.html",function(superviseNews){
                 superviseNews.init(districtUnitId);
			});*/

			$("#districtMapDiv_hist").load("/psemgy/eims/dispatch/pages/district/map/mapView.html",function(){
				initMap.init(id,"districtDispatchMapViewDiv",ssjkData.ssjkInit);
				awaterui.mapLegend("districtDispatchMapViewDiv",initMap.graphicLayerArr);
			});

			$("#AlarmInfo_hist").load("/psemgy/eims/dispatch/pages/district/alarm/alarmInfoNew.html",function(){
				require(['psemgy/eims/dispatch/pages/district/alarm/js/alarmInfoNew'],function(alarmInfoNew){
					alarmInfoNew.init(id);
				});
			});

			$("#superviseRec_hist").load("/psemgy/eims/dispatch/pages/district/supervise/superviseNews.html",function(){
				require(['psemgy/eims/dispatch/pages/district/supervise/js/superviseNews'],function(superviseNews){
					superviseNews.init(null,districtUnitId);
				});
			});
			

			intervalIndex=setInterval(reload,30000);
			
			var table_team_height=$("#ya_team_hist").height()-$("#ya_team_hist .panel-body #queryBar").height()-$("#ya_team_hist .panel-heading").height();
			$.ajax({
				type: 'get',
				url : '/psemgy/yjTeam/listAllByModelId?modelId='+id,
				dataType : 'json',  
				success : function(data) {
					$("#table_team_hist").bootstrapTable({
						height: table_team_height,
						toggle:"table",
						data : data,
						clickToSelect:true,
						rowStyle:"rowStyle",
						sidePagination: "server",
						search:false,
						columns: [
							{field:'id',visible: false,title: 'id'},
							{field:'icon',visible: true,title: '操作',align:'center',formatter:operateFormatterPsn},
							{field:'contact',visible: true,title: '姓名',align:'center'},
							{field:'name',visible: true,title: '隶属部门',align:'center'}
							//{visible: true,title: '通知',align:'center',formatter:sendSmsDic}
						]
					});
					$(".locatePersonA").click(initMap.locatePerson);
					$(".endBtn").click(sendSmsDictrict);
				},
				error : function() {
					layer.msg('获取应急队伍信息失败！');
				}
			});                
																				
			$("#table_team_hist").on('post-body.bs.table', function (row,obj) {
				$(".fixed-table-body").mCustomScrollbar();
			});
			
			var table_jsd_height=$("#ya_jsd_hist").height()-$("#ya_jsd_hist .panel-body #queryBar").height()-$("#ya_jsd_hist .panel-heading").height();

			var url="/psfacility/pscomb/listNoPageJson?estType=13";
			if(districtArea){
				url+="&area="+districtArea;
			}
			$("#table_jsd_hist").bootstrapTable({
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
					
			$("#table_jsd_hist").on('post-body.bs.table', function (row,obj) {
				$(".fixed-table-body").mCustomScrollbar();
			});
			
			$("#table_jsd_hist").on('click-row.bs.table', function (row,obj) {
				initMap.centerAtJsd(obj.xcoor,obj.ycoor);
			});
				
			$("#table_problem_hist").bootstrapTable({
				toggle:"table",
				height:$("#buttomDiv").height(),
				url:'/psemgy/yjProblemReport/listJsonDispatchRoom?yaId='+id,
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
					{field:'problemStatus',title: '状态',align:'center',formatter:format_status}],
				onLoadSuccess: function(){
					$(".OProblemA").click(showOProblem);
					$(".NProblemA").click(showProblem);
					$(".problemLocationBtn").click(initMap.locationOP);
					$("#table_problem").bootstrapTable("resetWidth");
				}
			});
		//});
				
		$.ajax({
			method : 'GET',
			url : '/psemgy/meteoHydrologAlarm/listJson',
			async : true,
			dataType : 'json',
			success : function(data) {		
				if(data.cityRecord){
					$("#cityRecord").html(data.cityRecord.templateName);
					$("#cityA").on("click",function(){
						showRecordWindow('/psemgy/eims/dispatch/pages/municipal/record/recordInput.html?yaCityId='+data.cityRecord.id+"&showStart=0",'市级应急预案详细')
					});
				} else {
					$("#cityRecord").html("已结束");
				}
				if(data.districtRecord){
					for(var index in data.districtRecord){
						if(data.districtRecord[index].status==1){
							$("#districtRecord_hist").html(data.districtRecord[index].templateName);
							$("#districtA_hist").on("click",function(){
								awaterui.createNewtab('/psemgy/eims/dispatch/pages/district/record/recordAlarmInput.html','成员单位应急预案详细',function(){
									require(["psemgy/eims/dispatch/pages/district/record/js/recordAlarmInput"],function(recordAlarmInput){
										recordAlarmInput.init(null,data.districtRecord[index].id,1,districtUnitId,null);
									});
								});
							});					            
						}
					}
				}
			},
			error : function() {
				layer.msg('获取预警日志失败！');
			}
		});
		$.ajax({
			url: "/psemgy/yaRecordDistrict/inputJsonNoL?id="+id,
			dataType:'json',
			async: false,
			success: function(data){
				$("#districtRecord_hist").html(data.form.templateName);
				$("#districtA_hist").on("click",function(){
					awaterui.createNewtab('/psemgy/eims/dispatch/pages/district/record/recordAlarmInput.html','成员单位应急预案详细',function(){
						require(["psemgy/eims/dispatch/pages/district/record/js/recordAlarmInput"],function(recordAlarmInput){
							recordAlarmInput.init(null,id,1,districtUnitId,null);
						});
					});
				});
			},
			error:function(){
				layer.msg('获取成员单位基本信息失败！');
			}
		});
	}

	//刷新调度室数据
	function reload(){
		//window.frames[0].location.reload();
		//window.frames[1].location.reload();
		$("#table_problem_hist").bootstrapTable('refresh', {url: '/psemgy/yjProblemReport/listJsonDispatchRoom?yaId='+yaDistrictId});
	}

	//关闭弹出窗
	function closeLayer(index){
		layer.close(index);
	}

	/*//地图定位调度物资位置
	function operateFormatterPsn(value, row, index) {
		return "<a onclick=\"javascript:awaterMap.locatePerson("+row.id+")\"><img src=\"/awater/img/blue-gislocate.png\"></img></a>";
	}
		
	//地图定位调度人员位置
	function locationGood(value, row, index) {
		return "<a onclick=\"javascript:awaterMap.locateGood("+row.id+")\"><img src=\"/awater/img/blue-gislocate.png\"></img></a>";
	}*/

	//地图定位调度人员位置
	function operateFormatterPsn(value, row, index) {
		return "<a class=\"locatePersonA\" data-id="+row.id+"><img src=\"/awater/img/blue-gislocate.png\"></img></a>";
	}
		
	//地图定位调度物资位置
	function locationGood(value, row, index) {
		return "<a class=\"locateGoodA\" data-id="+row.id+" onclick=\"javascript:initMap.locateGood("+row.id+")\"><img src=\"/awater/img/blue-gislocate.png\"></img></a>";
	}

	//格式化物资数量
	function operateFormatterNum(value, row, index){     
		return value+row.unit;
	}

	function format_view(value, row, index){
		if(row.problemAction==5)
			return " <a href=\"#\" class=\"OProblemA\" data-id="+row.id+">"+value+"</a>";
		else
			return " <a href=\"#\" class=\"NProblemA\" data-id="+row.id+">"+value+"</a>";
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
			return dateUtil.getLocalTime(value);
		else
			return '';
	}

	function format_location(value, row, index){
		if(row.problemAction==5)
			return "<button class='btn btn-primary problemLocationBtn' style='padding: 0px;vertical-align: top;height: 21px;' type='button' data-id="+row.id+"><i class='fa fa-check'></i>定位</button>";
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
		$('#table_jsd_hist').bootstrapTable('resetView');
		//$('#table_team').bootstrapTable('resetView');
		$('#table_problem_hist').bootstrapTable('resetView');
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
	function showProblem(e){			
		var pid=$(e.target).data("id");			
		$.get("/psemgy/eims/facility/problemReport/problemReportInputView.html",function(h){
			layer.open({
				type: 1,
				title: '应急问题详细',
				maxmin: true,
				shadeClose: true,
				area: ['900px', '600px'],
				content: h,			
				success: function(layero,index){
					require(["psemgy/eims/facility/problemReport/js/problemReportInputView"],function(problemReportInputView){
						problemReportInputView.init(pid,id,1,index);
					})
				}
			});
		});		
	}

	//查看其他应急问题详细
	function showOProblem(e){	
		var id=$(e.target).data("id");
		$.get("/psemgy/eims/facility/problemReport/otherProblemInput",function(h){
			layer.open({
				type: 1,
				title: '应急问题详细',
				maxmin: true, 
				shadeClose: true,
				area: ['750px', '400px'],
				content: 'eims/facility/problemReport/otherProblemInput.html?id='+id,	
				success: function(layero,index){
					require(["psemgy/eims/facility/problemReport/js/otherProblemInput"],function(otherProblemInput){
						otherProblemInput.init(yaCityId,showStart,index);
					})
				}
			});	
		});	
	}

	function sendSmsDic(value,row,index){
		return '<button class="btn btn-primary endBtn" style="padding: 0px;vertical-align: top;width: 70px;height: 21px;" type="button" data-id='+row.id+'>短信督办</button>';
	}

	function sendSmsDictrict(teamId){
		$.get("/psemgy/eims/dispatch/dispatchAction/districtSendSms.html",function(h){
			layer.open({
				type: 1,
				title: '短信督办',
				area: ['550px', '250px'],
				content: h,
				success: function(layero,index){
					require(['eims/dispatch/dispatchAction/js/districtSendSms'],function(districtSendSms){
                        districtSendSms.init(id,teamId,index);
					});
				}
			});
		});		
	}


	return{
		init: init
	}
});	
