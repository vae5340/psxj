define(['jquery','awaterui','dateUtil','layer','mousewheel','customScrollbar'],function($,awaterui,dateUtil,layer,mousewheel,customScrollbar){
   var id,clickRecordEvent;
   function init(_id){
	    id=_id;
		$("#alarmInfoNew").load("/psemgy/eims/dispatch/pages/municipal/alarm/alarmInfoNew.html",function(h){
			require(["psemgy/eims/dispatch/pages/municipal/alarm/js/alarmInfoNew"],function(alarmInfoNew){
				alarmInfoNew.init(id);
			})
		});

		$("#supervise").load("/psemgy/eims/dispatch/pages/district/supervise/superviseNews.html",function(h){
			require(["psemgy/eims/dispatch/pages/district/supervise/js/superviseNews"],function(superviseNews){
				superviseNews.init(id);
			})
		});

		$("#refreshBtn").click(reload);
		$("#cityRecordTitleDiv button").click(resetRecord);

		getRecordInfo();
						
		$.ajax({
			method : 'GET',
			url : '/psemgy/yaRecordCity/inputJson?id='+id,
			async : true,
			dataType : 'json',
			success : function(data) {
				var dictionary=data.Dict;
				for (itemname in dictionary){
					for (num in dictionary[itemname]){
						var selText="";
						if(dictionary[itemname][num].itemCode==data.form[itemname])
							$("#"+itemname).html(dictionary[itemname][num].itemName);
					}
				}
				for (var key in data.form){
					if(key!="templateSmsReceiver"&&key!="recordNoteDistrict"&&key!="templateGrade"&&key!="templateType"){
						if(key.toLowerCase().indexOf("time")!=-1&&data.form[key]!=null)
							$("#"+key).html(dateUtil.getLocalTime(data.form[key].time));
						else
							$("#"+key).html(data.form[key]);
					}
				}
			},
			error : function() {
				layer.msg('获取各单位信息失败');
			}
		});

		//初始化地图
        require(['psemgy/eims/dispatch/pages/municipal/dispatchMap/js/initMap','awaterui','ssjk-data'],function(initMap,awaterui,ssjkData){
			initMap.init("municipalMapDiv",ssjkData.ssjkInit);
			awaterui.mapLegend("municipalMapDiv",initMap.graphicLayerArr);
		});

		freshTabRespone();

		//$(window).load(function(){
		intervalIndex=setInterval(reload,30000);
		$("#tableResponeDiv").mCustomScrollbar();
		//});
   }

   function getRecordInfo(){
	   $.ajax({
			method : 'GET',
			url : '/psemgy/yaRecordCity/getNowCityRecord',
			async : true,
			dataType : 'json',
			success : function(data) {  
				if(data!=0){
					$("#cityRecord").html(data.templateName);
					//插入预案升级按钮
					if(!clickRecordEvent){
						clickRecordEvent = $("#cityA").on("click",function(){
							showRecordWindow(data.id,0);
						});
					}
				}
			},
			error : function() {   
				layer.msg('获取应急预案信息失败');
			}
		});
   }

	function reload(){
		if(clickRecordEvent){
			clickRecordEvent.remove();
			clickRecordEvent=null;
		}
		getRecordInfo();
		

		$("#supervise").empty();
		$("#supervise").load("/psemgy/eims/dispatch/pages/district/supervise/superviseNews.html",function(h){
			require(["psemgy/eims/dispatch/pages/district/supervise/js/superviseNews"],function(superviseNews){
				superviseNews.init(id);
			})
		});

		$("#alarmInfoNew").empty();
		$("#alarmInfoNew").load("/psemgy/eims/dispatch/pages/municipal/alarm/alarmInfoNew.html",function(h){
			require(["psemgy/eims/dispatch/pages/municipal/alarm/js/alarmInfoNew"],function(alarmInfoNew){
				alarmInfoNew.init(id);
			})
		});		

		freshTabRespone();
	}

	var setting = {
		check: {
			enable: true,
			chkStyle : "checkbox",
			chkboxType: { "Y": "s", "N": "s" }
		},
		data: {
			key: {name: "orgName"},
			simpleData: {
				enable: true,
				idKey: "orgId",
				pIdKey: "parentOrgId",
				rootPId: 0
			}
		}
	};
			
	var intervalIndex;

    
	function freshTabRespone(){
		if(!$("#tableRespone").length){
			clearInterval(intervalIndex);
			return;
		}
		$("#tableRespone").empty();
		$.ajax({
			method : 'GET',
			url : '/psemgy/yaRecordDistrict/getDistrictStatus',
			async : true,
			dataType : 'json',
			success : function(data) {
				$("#tableRespone").append("<tr height='20px' id ='type2'><td colspan='3' class='unitTitle'>成员单位机构</td></td></tr>");
				$("#tableRespone").append("<tr height='20px' id ='type3'><td colspan='3' class='unitTitle'>有关单位</td></td></tr>");
				//var canEnd=true;
				$.each(data.row,function(index,item){
					if(item.ORG_TYPE==3){
						if(item.STATUS)
							districtName="<a class='viewA' href='#' data-ids='"+item.ORG_ID+"','"+item.ID+"'>"+item.ORG_NAME+"</a>";
						else
							districtName=item.ORG_NAME;
							
						if(item.STATUS==1){
							$("#type3").after("<tr height='20px'><td>"+districtName+"</td><td>启动中</td><td><a class='sendA' href='#' data-id='"+item.ORG_ID+"' data-status=1>督办</a></td></tr>")
						} else if(item.STATUS==2){
							$("#type3").after("<tr height='20px'><td>"+districtName+"</td><td><font style='color: red;'>已结束</font></td><td></td></tr>")
						} else {
							$("#type3").after("<tr height='20px'><td>"+districtName+"</td><td><font style='color: red;'>未开始</font></td><td><a class='sendA' href='#' data-id='"+item.ORG_ID+"' data-status=0>督办</a></td></tr>")
						}
					} else {
						if(item.STATUS)
							districtName="<a class='viewA' href='#' data-ids='"+item.ORG_ID+"','"+item.ID+"'>"+item.ORG_NAME+"</a>";
						else
							districtName=item.ORG_NAME;
						if(item.STATUS==1){
							$("#type2").after("<tr height='20px'><td>"+districtName+"</td><td>启动中</td><td><a class='sendA' href='#' data-id='"+item.ORG_ID+"' data-status=1>督办</a></td></tr>")
						} else if(item.STATUS==2){
							$("#type2").after("<tr height='20px'><td>"+districtName+"</td><td><font style='color: red;'>已结束</font></td><td></td></tr>")
						} else {
							$("#type2").after("<tr height='20px'><td>"+districtName+"</td><td><font style='color: red;'>未开始</font></td><td><a class='sendA' href='#' data-id='"+item.ORG_ID+"' data-status=0>督办</a></td></tr>")
					    }
					}						
				});
				$(".viewA").click(viewDistrictRecord);
				$(".sendA").click(SendSupervise);

				if($("#tableAction").html()==""){
					$("#tableAction").append("<tr height='20px'><td>全市&nbsp;&nbsp;</td><td colspan='2'><button id='sendMiddle' class='btn btn-primary'"+
					"style='padding: 0px;vertical-align: top;height:30px;width:180px;' type='button'>"+
					"<i class='fa fa-check'></i>&nbsp;通知各单位提交事中报告</button><br /><button id='processRep' class='btn btn-primary' "+
					"style='padding: 0px;vertical-align: top;height:30px;width:180px;' type='button'>"+
					"<i class='fa fa-check'></i>&nbsp;生成事中报告</button><br /><button id='addEnd' class='btn btn-primary' "+
					"style='padding: 0px;vertical-align: top;height:30px;width:180px;' type='button'>"+
					"<i class='fa fa-check'></i>&nbsp;结束预案督办通知</button><br /><button id='checkEnd' class='btn btn-primary' "+
					"style='padding: 0px;vertical-align: top;height:30px;width:180px;' type='button'>"+
					"<i class='fa fa-check'></i>&nbsp;结束预案</button><br /></td></tr>");	
					$("#sendMiddle").click(SendMiddleView);
					$("#processRep").click(processRep);
					$("#addEnd").click(addenddb);
					$("#checkEnd").click(checkEndRecord);
				}
			},
			error : function() {
				layer.msg('获取各单位信息失败');
			}
		});
	}

	//检查当前预案是否满足结束预案条件
	function checkEndRecord(){
		endCityRecord();
	}

	function endCityRecord(){
		layer.confirm('是否确定结束当前应急响应预案？', {
			btn: ['是','否'] //按钮
		}, function(){
			$.ajax({
				type: 'post',
				url :'/psemgy/yaRecordCity/endRecordJson?id='+id,
				dataType : 'json',  
				success : function(data) {
					layer.closeAll('dialog');
					layer.msg(data.result);
					
					clearInterval(intervalIndex);
					awaterui.closeTab();
				},
				error : function() {
					layer.msg('error');
				}
			});
		}, function(){
			layer.closeAll('dialog');
		});
	}
	//检查当前预案生成事中报告状态
	function processRep(){
		$.ajax({
			method:'GET',
			url:'/psemgy/yaProcessReport/checkCreateCityReport',
			data:{cityYaId:id},
			dataType : 'json',
			async:false,
			success:function(data){
				if(data.statusId==1){
					//不可以生成事中报告督办（检查数据有事中报告且该事中报告未结束）
					layer.msg("当前没生成事中报告督办，不能生成事中报告");
				} else if(data.statusId==2){
					//生成事中报告
					createProcessRep();
				} else if(data.statusId==3) {
					//生成事中报告
					layer.confirm('当前有成员单位未提交成员报告，是否提交市级事中报告？', {btn: ['是','否'] //按钮
					}, function(){
						createProcessRep();
						layer.closeAll('dialog');
					}, function(){
						layer.closeAll('dialog');
					});
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

	//生成事中报告
	function createProcessRep(){
		$.ajax({
			method:'GET',
			url:'/psemgy/yaProcessReport/produceCityReportContent',
			dataType : 'json',
			async:false,
			success:function(data){
				if(data.id!=null){
					awaterui.createNewtab('/psemgy/eims/dispatch/pages/municipal/processReport/processReport.html?id='+data.id+"&yaId="+id,"提交事中报告");
					require(["psemgy/eims/dispatch/pages/municipal/processReport/js/processReport"],function(processReport){
						processReport.init(data.id,id);
					});						  
					
			} else if(data.repetition!=null){
					layer.msg("已提交事中报告");
				} else {
					layer.msg("当前无事中报告督办，不能提交");
				}
			},
			error:function (e){
				layer.msg("生成市级事中报告失败");
			}
		});
	}

	function showRecordWindow(yaCityId,showStart){
		$.get("/psemgy/eims/dispatch/pages/municipal/record/recordInput.html",function(h){
			layer.open({
				type: 1,
				title: '市级应急预案详细',
				shadeClose: false,
				shade: 0.5,
				area: ['900px', '600px'],
				content: h,
				success: function(layero,index){
					require(["psemgy/eims/dispatch/pages/municipal/record/js/recordInput"],function(recordInput){
						recordInput.init(yaCityId,showStart,index);
					})
				}

			}); 
		})			
	}

	//发起成员单位启动预案督办
	function SendSupervise(e){
		//SendSupervise('SuperviseNews.html?yaId="+id+"&yaType=1&status=0&districtUnitId="+item.ORG_ID+"')
		var orgId=$(e.target).data("id");
		var status=$(e.target).data("status");
		$.get("/psemgy/eims/dispatch/pages/municipal/supervise/superviseNews.html",function(h){
			layer.open({
				type: 1,
				title: '督办通知设置',
				shadeClose: false,
				shade: 0.5,
				area: ['550px', '300px'],
				content:h,
				success: function(layero,index){
					require(["psemgy/eims/dispatch/pages/municipal/supervise/js/superviseNews"],function(superviseNews){
						superviseNews.init(id,1,orgId,status,index);
					})
				}
			}); 
		});		
	}

	//发起提交事中报告通知
	function SendMiddleView(){
		$.ajax({
			method:'GET',
			url:'/psemgy/yaSuperviseLog/checkAllowSZ',
			data:{yaId:id},
			dataType : 'json',
			async:false,
			success:function(data){
				if(data.statusId==1||data.statusId==2){
					//生成事中报告
					$.get("/psemgy/eims/dispatch/pages/municipal/supervise/superviseMultiNewsSZ.html",function(h){
						layer.open({
							type: 1,
							title: '提交事中报告通知',
							shadeClose: false,
							shade: 0.5,
							area: ['650px', '280px'],
							content:h,
							success:function(layero,index){
								require(["psemgy/eims/dispatch/pages/municipal/supervise/js/superviseMultiNewsSZ"],function(superviseMultiNewsSZ){
										superviseMultiNewsSZ.init(id,1,2,index);
								});
							}	
						});
					});
				} else if(data.statusId==3) {
					layer.msg("禁止发起督办，当前有事中报告未提交");
				} else {
					//未知状态
					layer.msg("检查发起督办通知失败");
				}
			},
			error:function (e){
				layer.msg("检查发起督办通知失败");
			}
		});
	}
	//发起结束预案督办
	function addenddb(){
		$.get("/psemgy/eims/dispatch/pages/municipal/supervise/superviseMultiNewsJS.html",function(h){
			layer.open({
				type: 1,
				title: '结束预案督办通知',
				shadeClose: false,
				shade: 0.5,
				area: ['650px', '280px'],
				content:h,
				success:function(layero,index){
					require(["psemgy/eims/dispatch/pages/municipal/supervise/js/superviseMultiNewsJS"],function(superviseMultiNewsJS){
							superviseMultiNewsJS.init(id,1,3,index);
					});
				}	
			});
		});
	}
	//查看成员单位调度室
	function viewDistrictRecord(e){
		var orgId=$(e.target).data("ids").split(",")[0];
		var yaDisId=$(e.target).data("ids").split(",")[1];
		$.get("/psemgy/eims/dispatch/pages/district/mainView.html",function(h){
			layer.open({
				type: 1,
				title: '浏览成员单位启动预案',
				shadeClose: false,
				shade: 0.5,
				area: ['100%', '100%'],
				content:"/psemgy/eims/dispatch/pages/district/mainView.html",
				success:function(layero,index){
					require(["psemgy/eims/dispatch/pages/district/js/mainView"],function(mainView){
							mainView.init(orgId,id,yaDisId);
					});
				}
			});
		});
	}

	//应急预案升级
	function resetRecord(){
	    $.get("/psemgy/eims/dispatch/pages/municipal/dispatchLog/templateAlarmList.html",function(h){
			layer.open({
				type: 1,
				title: '预案调整',
				shadeClose: false,
				shade: 0.5,
				area: ['900px', '400px'],
				content:h,
				success: function(layero,index){
					require(["psemgy/eims/dispatch/pages/municipal/dispatchLog/js/templateAlarmList"],function(templateAlarmList){
						templateAlarmList.init(id,index);
					});
				}
			});
		});		
	}

	return{
		init: init
	}
});	
