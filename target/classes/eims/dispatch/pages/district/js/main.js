define(['jquery','layer','awaterui','psemgy/eims/dispatch/pages/district/map/js/initMap','ssjk-data','dateUtil','areaUtil','bootstrap','bootstrapTable','bootstrapTableCN','mousewheel','customScrollbar'],function($,layer,awaterui,initMap,ssjkData,dateUtil,areaUtil){
	function init(_id,_districtUnitId){
		 id = _id;
		 districtUnitId = _districtUnitId;
		
		 $("#districtMainDiv #problemReportBtn").click(showWindow);
		 $("#districtMainDiv #addJsdBtn").click(addJsd);
		 $("#districtMainDiv #checkProcessRepBtn").click(checkAllowprocessRep);
		 $("#districtMainDiv #endBtn").click(endRecord);
		//获取当前成员单位信息
		$.ajax({
			method : 'GET',
			url : '/agsupport/om-org!getOrganizationName.action',
			async : false,
			success : function(data) {
				districtName=data;	
				for(var index in areaUtil.xzArea){
					if(areaUtil.xzArea[index].name==districtName){
						districtArea=areaUtil.xzArea[index].code;
						break;
					}
				}
			},
			error : function(e) {
				alert('请求失败');
			}
		});

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

		//$(window).load(function(){
			/* $("#districtMainDiv #districtMap").attr("src","/psemgy/eims/dispatch/pages/district/map/map.html?modelId="+id);
			$("#districtMainDiv #AlarmInfo").attr("src","/psemgy/eims/dispatch/pages/district/alarm/alarmInfoNew.html?districtYaId="+id);
			$("#districtMainDiv #superviseRec").attr("src","/psemgy/eims/dispatch/pages/district/supervise/superviseNews.html?districtUnitId="+districtUnitId);*/
			
			$("#districtMainDiv #districtMapDiv").load("/psemgy/eims/dispatch/pages/district/map/map.html",function(){
				$("#districtMainDiv #reloadDistBtn").click(reload);
				initMap.init(id,"districtDispatchMapDiv",ssjkData.ssjkInit);
				awaterui.mapLegend("districtDispatchMapDiv",initMap.graphicLayerArr);
			});

			$("#districtMainDiv #AlarmInfo").load("/psemgy/eims/dispatch/pages/district/alarm/alarmInfoNew.html",function(){
				require(['psemgy/eims/dispatch/pages/district/alarm/js/alarmInfoNew'],function(alarmInfoNew){
					alarmInfoNew.init(id);
				});
			});

			$("#districtMainDiv #superviseRec").load("/psemgy/eims/dispatch/pages/district/supervise/superviseNews.html",function(){
				require(['psemgy/eims/dispatch/pages/district/supervise/js/superviseNews'],function(superviseNews){
					superviseNews.init(null,districtUnitId);
				});
			});

			
			intervalIndex=setInterval(reload,30000);
			
			var table_team_height=$("#districtMainDiv #ya_team").height()-$("#districtMainDiv #ya_team .panel-body #queryBar").height()-$("#districtMainDiv #ya_team .panel-heading").height();
			$.ajax({
				type: 'get',
				url :'/psemgy/yjTeam/listAllByModelId?modelId='+id,
				dataType : 'json',  
				success : function(data) {
					$("#districtMainDiv #table_team").bootstrapTable({
						height: table_team_height,
						toggle:"table",
						data : data,
						clickToSelect:true,
						rowStyle:"rowStyle",
						sidePagination: "server",
						search:false,
						columns: [
							{field:'id',visible: false,title: 'id'},
							{field:'icon',visible: true,title: '定位',align:'center',formatter:operateFormatterPsn},
							{field:'contact',visible: true,title: '姓名',align:'center'},
							{field:'name',visible: true,title: '隶属部门',align:'center'},
							{visible: true,title: '通知',align:'center',formatter:sendSmsDic}]							
					});
					$("#districtMainDiv .locatePersonA").click(initMap.locatePerson);
					$("#districtMainDiv .endBtn").click(sendSmsDictrict);
				},
				error : function() {
					layer.msg('请求失败');
				}
			});                
																				
			$("#districtMainDiv #table_team").on('post-body.bs.table', function (row,obj) {
				$("#districtMainDiv .fixed-table-body").mCustomScrollbar();
			});
			
			var table_jsd_height=$("#districtMainDiv #ya_jsd").height()-$("#districtMainDiv #ya_jsd .panel-body #queryBar").height()-$("#districtMainDiv #ya_jsd .panel-heading").height();

			var url="/psfacility/pscomb/listNoPageJson?estType=13";
			if(districtArea){
				url+="&area="+districtArea;
			}
			$("#districtMainDiv #table_jsd").bootstrapTable({
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
					
			$("#districtMainDiv #table_jsd").on('post-body.bs.table', function (row,obj) {
				$("#districtMainDiv .fixed-table-body").mCustomScrollbar();
			});
			
			$("#districtMainDiv #table_jsd").on('click-row.bs.table', function (row,obj) {
				initMap.centerAtJsd(obj.xcoor,obj.ycoor);
			});
				
			$("#districtMainDiv #table_problem").bootstrapTable({
				toggle:"table",
				height:$("#districtMainDiv #buttomDiv").height(),
				url:'/psemgy/yjProblemReport/listJsonDispatchRoom?yaId='+id,
				clickToSelect:true,
				rowStyle:"rowStyle",
				sidePagination: "server",
				search:false,
				uniqueId:"id",
				columns: [
					{field:'id',visible: false,title: 'id'},
					{field:'problemName',visible: true,title: '事件名称',align:'center',formatter:format_view},
					{field:'problemAction',visible: true,title: '上报类型',align:'center',formatter:format_action},
					{field:'problemTime',visible: true,title: '上报时间',align:'center',formatter:format_date},
					{field:'problemPerson',visible: true,title: '上报人',align:'center'},
					{field:'problemLocation',visible: true,title: '定位',align:'center',formatter:format_location},
					{field:'problemStatus',visible: true,title: '状态',align:'center',formatter:format_status}],
				onLoadSuccess: function(){
					$("#districtMainDiv .OProblemA").click(showOProblem);
					$("#districtMainDiv .NProblemA").click(showProblem);
					$("#districtMainDiv .problemLocationBtn").click(initMap.locationOP);
					$("#districtMainDiv #table_problem").bootstrapTable("resetWidth");
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
					$("#districtMainDiv #cityRecord").html(data.cityRecord.templateName);
					$("#districtMainDiv #cityA").on("click",function(){
						showRecordWindow(data.cityRecord.id,0);
					});
				}
				if(data.districtRecord){
					for(var index=0;index<data.districtRecord.length;index++){
						if(data.districtRecord[index].status==1){
							$("#districtMainDiv #districtRecord").html(data.districtRecord[index].templateName);
							var id = data.districtRecord[index].id;							
							$("#districtMainDiv #districtA").on("click",function(){
								awaterui.createNewtab('/psemgy/eims/dispatch/pages/district/record/recordAlarmInput.html','成员单位应急预案详细',function(){
									require(["psemgy/eims/dispatch/pages/district/record/js/recordAlarmInput"],function(recordAlarmInput){
										recordAlarmInput.init(null,id,1,districtUnitId,null);
									})
								});
							});
							//插入预案调整按钮
							if(id){
								$("#districtMainDiv #districtRecordDiv").append("<button class='btn btn-primary' style='margin-left:5px;padding: 0px;height:20px;' type='button'>预案调整</button>");
								$("#districtMainDiv #districtRecordDiv button").click(resetRecord);
							}
						}
					}
				}
			},
			error : function() {
				layer.msg('请求失败');
			}
		});
	}

	//当前成员单位编号
	var districtUnitId;	 
	//当前应急响应编号	       
	var id;

	//调度室页面定时器句柄
	var intervalIndex;   
	//地图单击事件句柄
	var mapClickEventObject;

	//当前成员单位名称
	var districtName;
	//当前成员单位区域
	var districtArea="";

	var specialArea=false;

	//新增应急积水点操作
	function addJsd(){
		var map=initMap.getMap();
		if(mapClickEventObject!=null)
			return ;
		mapClickEventObject=map.on("mouse-down", function (p) {
			var x=p.mapPoint.x;
			var y=p.mapPoint.y;

			layer.prompt({title: '请输入应急积水点名称'}, function(value, index, elem){
				doSave(value,x,y);
				layer.close(index);
			});
		});
	}
	//刷新调度室数据
	function reload(){
		if(!$("#districtMainDiv #districtMainDiv").length){
			clearInterval(intervalIndex);
			return;
		}

	    ssjkData.ssjkInit(initMap.getMap(),initMap.graphicLayerArr);

		$("#districtMainDiv #AlarmInfo").empty();
		$("#districtMainDiv #AlarmInfo").load("/psemgy/eims/dispatch/pages/district/alarm/alarmInfoNew.html",function(){
			require(['psemgy/eims/dispatch/pages/district/alarm/js/alarmInfoNew'],function(alarmInfoNew){
				alarmInfoNew.init(id);
			});
		});

		$("#districtMainDiv #superviseRec").empty();
		$("#districtMainDiv #superviseRec").load("/psemgy/eims/dispatch/pages/district/supervise/superviseNews.html",function(){
			require(['psemgy/eims/dispatch/pages/district/supervise/js/superviseNews'],function(superviseNews){
				superviseNews.init(null,districtUnitId);
			});
		});
	
		$("#districtMainDiv #table_problem").bootstrapTable('refresh', {url: '/psemgy/yjProblemReport/listJsonDispatchRoom?yaId='+id});
		initMap.refreshLayer();
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
				mapClickEventObject=null;
				var map=initMap.getMap();
				map.removeLayer(map.getLayer("ssjk_13"));
				ssjkData.ssjkInit(map,initMap.graphicLayerArr);									
			}
		);
	}
	//检查当前预案是否可以提交事中报告
	function checkAllowprocessRep(){
	
		$.ajax({
			method:'GET',
			url:'/psemgy/yaProcessReport/checkCreateDistrictReport',
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
					layer.msg("事中报告已提交，不能重复提交");
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
				url:'/psemgy/yaProcessReport/produceDistrictReportContent?districtYaId='+id,
				dataType : 'json',  
				async:false,
				success:function(data){
					if(data.id!=null){
						awaterui.createNewtab("/psemgy/eims/dispatch/pages/district/processReport/processReport.html","提交事中报告",function(){
							//?yaId='+id+"&districtUnitId="+districtUnitId+"&id="+data.id
							require(["psemgy/eims/dispatch/pages/district/processReport/js/processReport"],function(processReport){
								processReport.init(data.id,id,districtUnitId);
							});
						});	
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
					url : '/psemgy/yaRecordDistrict/endRecordJson?id='+id,
					dataType : 'json',  
					success : function(data) {
						layer.msg(data.result);
						if(data.closeTab==true){
							clearInterval(intervalIndex);
							initMap.stopInterval();
							awaterui.closeTab();
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
			return "<button class='btn btn-primary problemLocationBtn' style='padding: 0px;vertical-align: top;height: 21px;' type='button' data-id="+row.id+"><i class='fa fa-check'></i>定位</button>";
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
			return dateUtil.getLocalTime(value);
		else
			return '';
	}

	//查看启动应急预案内容
	function showRecordWindow(yaCityId,showStart){
		//init(_id,_template_id,_yaCityId,_districtUnitId,index){
		//'/psemgy/eims/dispatch/pages/district/Record/recordInput.html?yaCityId='+data.cityRecord.id+"&showStart=0"
		$.get("/psemgy/eims/dispatch/pages/district/record/recordInput.html",function(h){
			layer.open({
				type: 1,
				title: '市级应急预案详细',
				shadeClose: false,
				shade: 0.5,
				area: ['900px', '600px'],
				content: h,
				success: function(layero,index){
					require(["psemgy/eims/dispatch/pages/district/record/js/recordInput"],function(recordInput){
                        recordInput.init(yaCityId,null,yaCityId,null,index);
					});
				}
			}); 
		});
			
	}
	//新增问题上报页面
	function showWindow(){
		layer.msg('请选择上报类型',{
				time: 0 ,btn: ['现场情况上报','其他问题上报'],
				yes:function(){
					layer.close(layer.index);
					$.get('/psemgy/eims/facility/problemReport/problemReportInput.html',function(h){
						layer.open({
							type: 1,
							title: '应急问题上报',
							shadeClose: true,
							shade: 0.5,
							area: ['850px', '550px'],
							content: h,
							success: function(layero,index){
								require(['psemgy/eims/facility/problemReport/js/problemReportInput'],function(problemReportInput){
									problemReportInput.init("",id,index);
								});
							}
						});
					});					
				}, 
				btn2:function(){
					$.get('/psemgy/eims/facility/problemReport/otherProblemInput.html',function(h){
						layer.open({
							type: 1,
							title: '其他问题上报',
							shadeClose: false,
							shade: 0,
							maxmin: true,
							area: ['750px', '400px'],
							content: h,
							success: function(layero,index){
								require(['eims/facility/problemReport/js/otherProblemInput'],function(otherProblemInput){
									otherProblemInput.init("",id,index);
								});
							}
						});
					});
				}
			}
		);
	}
	//查看应急问题详细
	function showProblem(e){
		var id=$(e.target).data("id");			
		$.get("/psemgy/eims/facility/problemReport/problemReportEdit.html",function(h){
			layer.open({
				type: 1,
				title: '应急问题详细',
				maxmin: true,
				shadeClose: true,
				area: ['900px', '90%'],
				content: h,			
				success: function(layero,index){
					require(["psemgy/eims/facility/problemReport/js/problemReportEdit"],function(problemReportEdit){
						problemReportEdit.init(id,null,index);
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
	//应急预案升级
	function resetRecord(){
		$.get("/psemgy/eims/dispatch/pages/district/dispatchLog/templateAlarmList.html",function(h){
			layer.open({
				type: 1,
				title: '预案调整',
				shadeClose: false,
				shade: 0.5,
				area: ['900px', '400px'],
				content:h,		
				success: function(layero,index){
					require(["psemgy/eims/dispatch/pages/district/dispatchLog/js/templateAlarmList"],function(templateAlarmList){
						templateAlarmList.init(id,districtUnitId,index);	
					});
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