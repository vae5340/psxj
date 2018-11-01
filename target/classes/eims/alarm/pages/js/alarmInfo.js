define(['jquery','dateUtil','awaterui','bootstrap','bootstrapTable','myScroll'],function($,dateUtil,awaterui){
    var userType;

    function init(){
		$.ajax({
			method : 'GET',
			url : '/psemgy/meteoHydrologAlarm/listJsonAlarmInfo',
			async : true,
			dataType : 'json',
			success : function(data) {
				var allulcontent=$("#all #ul_content");
				var qxulcontent=$("#qx #ul_content");
				var swulcontent=$("#sw #ul_content");
				var qjulcontent=$("#qj #ul_content");
				var dbulcontent=$("#db #ul_content");
				userType=data.userType;
				
				if(data.form){
					var setText="<li><div style=\"width: 60%;float: left;\"><a data-id="+data.form.id;
					if(data.form.alarmGrade==1)
						setText+=" class=\"a_red formA\"> ";
					else
						setText+=" class=\"a_yellow formA\"> ";
					setText+=data.form.alarmTitle+"</a></div><div style=\"width: 40%;float: left;\"><span>"+dateUtil.getLocalTime(data.form.alarmTime)+"</span></div></li>";
					allulcontent.append(setText);
					if(data.form.alarmType==1)
						qxulcontent.append(setText);
					else
						swulcontent.append(setText);
				}
				for (i in data.listRec){
					if(data.listRec[i][1]=="1"){
						var setText="<li><div style=\"width: 60%;float: left;\"><a class=\"a_red\">"+data.listRec[i][0]+data.listRec[i][2] +"</a></div><div style=\"width: 40%;float: left;\"><span>"+dateUtil.getLocalTime(data.listRec[i][3])+"</span></div></li>"
						qjulcontent.append(setText);
						allulcontent.append(setText);
					}
				}
				for (i in data.listSuper){
					var dbText;
					if(data.listSuper[i]["type"]=="1"){
					dbText="<li><div style=\"width: 60%;float: left;\"><a data-id="+data.listSuper[i].id+" class=\"listSuper a_red\">"+data.listSuper[i]["district"]+"启动应急响应</a></div><div style=\"width: 40%;float: left;\"><span>"+dateUtil.getLocalTime(data.listSuper[i]["time"])+"</span></div></li>"
					} else if(data.listSuper[i]["type"]=="2") {
					dbText="<li><div style=\"width: 60%;float: left;\"><a data-id="+data.listSuper[i].id+" class=\"listSuper a_red\">"+data.listSuper[i]["district"]+"提交事中报告</a></div><div style=\"width: 40%;float: left;\"><span>"+dateUtil.getLocalTime(data.listSuper[i]["time"])+"</span></div></li>"
					} else if(data.listSuper[i]["type"]=="5") {
					dbText="<li><div style=\"width: 60%;float: left;\"><a data-id="+data.listSuper[i].id+" class=\"listSuper a_red\">"+data.listSuper[i]["district"]+"抢险队督办</a></div><div style=\"width: 40%;float: left;\"><span>"+dateUtil.getLocalTime(data.listSuper[i]["time"])+"</span></div></li>"
					}
					dbulcontent.append(dbText);
					allulcontent.append(dbText);				   
				}
				
				if(data.cityRecord){
					$("#emergenRespon").html(data.cityRecord.templateName);
					$("#emergenRespon").on("click",function(){showDialog(data.cityRecord.id)});
					$("#emergenResponSpan").html(dateUtil.getLocalTime(data.cityRecord.recordCreateTime));
					$("#emergenResponDiv").show();
				}
				if(data.city){
					if(data.districtRecord&&data.districtRecord.length){
						for (var i=0;i<data.districtRecord.length;i++){
							var setText="<li><div style=\"width: 60%;float: left;\"><a href=\"#\" class=\"districtAlarmA\" data-id='"+data.districtRecord[i].id+"'>"+data.districtRecord[i]["districtName"]+data.districtRecord[i]["templateName"]+"</a></div><div style=\"width: 40%;float: left;\"><span>"+dateUtil.getLocalTime(data.districtRecord[i]["recordCreateTime"])+"</span></div></li>";
							qjulcontent.append(setText);
							allulcontent.append(setText);				   							
						}
						$(".districtAlarmA").click(showDistrictRecord);						
					}
				}else{
					if(data.districtRecord&&data.districtRecord.length){
						for (var i=0;i<data.districtRecord.length;i++){
							var setText="<li><div style=\"width: 60%;float: left;\"><a href=\"#\" class=\"districtDispatchA\" data-ids='"+data.districtRecord[i].districtId+","+data.districtRecord[i].id+"'>"
							+data.districtRecord[i]["districtName"]+data.districtRecord[i]["templateName"]+"</a></div><div style=\"width: 40%;float: left;\"><span>"+dateUtil.getLocalTime(data.districtRecord[i]["recordCreateTime"])+"</span></div></li>";
							qjulcontent.append(setText);
							allulcontent.append(setText);				   															
						}
						$(".districtDispatchA").click(showTabWindow);
					}
				}

				$(".formA").click(startYJ);
				$(".listSuper.a_red").click(viewSupervise);

				$('#all .list_lh li:even').addClass('lieven');
				$("#all div.list_lh").myScroll({
					speed:200, //数值越大，速度越慢
					rowHeight:20 //li的高度
				});
				$('#qx .list_lh li:even').addClass('lieven');
				$("#qx div.list_lh").myScroll({
					speed:200, //数值越大，速度越慢
					rowHeight:20 //li的高度
				});
				$('#sw .list_lh li:even').addClass('lieven');
				$("#sw div.list_lh").myScroll({
					speed:200, //数值越大，速度越慢
					rowHeight:20 //li的高度
				});
				$('#qj .list_lh li:even').addClass('lieven');
				$("#qj div.list_lh").myScroll({
					speed:200, //数值越大，速度越慢
					rowHeight:20 //li的高度
				});
				$('#db .list_lh li:even').addClass('lieven');
				$("#db div.list_lh").myScroll({
					speed:200, //数值越大，速度越慢
					rowHeight:20 //li的高度
				});
			},
			error : function() {
				layer.msg('请求失败');
			}
		});
	}
	
	function startYJ(e){
		var id=$(e.target).data("id");
		//市级用户点击
		if(userType==1){
			$.ajax({
				url: '/psemgy/meteoHydrologAlarm/checkAlarmStatus',
				data:{"id":id},
				dataType: 'json',
				cache:false,
				success: function (data){
					if(data.status==1){
						require(['appFunc'],function(appFunc){
							appFunc.showAddYJWindow(id);
						});						
					}
					else if(data.status==2)
						layer.msg("本预警已启动预案或已有启动预案");
					else if(data.status==3)
						layer.msg("当前用户无权启动预案");
				},
				error : function() {
					layer.msg('请求失败');
				}
			});
		}else{
			//其他用户点击，提示
			layer.msg("当前用户无权限启动市级响应预案");
		}
	}

	function showDistrictRecord(e){
		var id=$(e.target).data("id");
		$.get("/psemgy/eims/dispatch/pages/district/record/recordInput.html",function(h){
			layer.open({
				type: 1,
				title: '成员单位应急调度情况',
				shadeClose: false,
				shade: 0.5,
				area: ['900px', '600px'],
				content: h,
				success: function(layero,index){
					require(["psemgy/eims/dispatch/pages/district/record/js/recordInput"],function(recordInput){
						recordInput.init(id,null,null,null,index);
					});
				}
			}); 	
		});		
	}

	function viewSupervise(e){
		var id=$(e.target).data("id");
		$.get("/psemgy/eims/dispatch/pages/district/supervise/superviseView.html",function(h){
			layer.open({
				type: 1,
				title: '督办详情',
				shadeClose: false,
				shade: 0.5,
				area: ['650px', '450px'],
				content:h,
				success: function(layero,index){
					require(["psemgy/eims/dispatch/pages/district/supervise/js/superviseView"],function(superviseView){
						superviseView.init(id,index);
					})
				}
			});
		});	
	}

	function showTabWindow(e,districtUnitId,id){
		if(!districtUnitId)
		   districtUnitId=$(e.target).data("ids").split(",")[0];
		if(!id)
	       id=$(e.target).data("ids").split(",")[1];
		//districtUnitId="+data.districtRecord[i].districtId+"&id="+data.districtRecord[i].id+"'
		awaterui.createNewtab("/psemgy/eims/dispatch/pages/district/main.html","成员单位调度详情",function(){
			require(['psemgy/eims/dispatch/pages/district/js/main'],function(main){
				main.init(id,districtUnitId);
			});
		});	
	}

	function showDialog(cityRecordId){
		if(userType==1){
			awaterui.createNewtab("/psemgy/eims/dispatch/pages/municipal/supervise/supervise.html","市级调度",function(){
				require(["psemgy/eims/dispatch/pages/municipal/supervise/js/supervise"],function(supervise){
                     supervise.init(cityRecordId);
				});
			});	
		} else {
			$.ajax({
				type: 'get',
				url : '/psemgy/yaRecordDistrict/checkStatus',
				data:{"yaCityId":cityRecordId},
				dataType : 'json',  
				success : function(data) {
					if(data.statusId==0){
						//启动成员单位预案
						$.get("/psemgy/eims/dispatch/pages/municipal/record/recordInput.html",function(h){
							layer.open({
								type: 1,
								title: '市级应急响应详细',
								shadeClose: false,
								shade: 0,
								maxmin: true,
								area: ['900px', '600px'],
								content: h,
								success: function(layero,index){
									  require(["psemgy/eims/dispatch/pages/municipal/record/js/recordInput"],function(recordInput){
										recordInput.init(cityRecordId,1,index);
									  });
								}
							});
						});						 
					} else if(data.statusId==1) {
						//进入成员单位调度室
						$.ajax({
							method : 'GET',
							url : '/psemgy/yaRecordDistrict/getNowDistrict',
							async : false,
							dataType : 'json',
							success : function(data) {			
								showTabWindow(null,data.districtUnitId,data.id);
							},
							error : function(error) {
								alert('error');
							}
						});
					} else if(data.statusId==2)  {
						layer.msg('当前预案完成调度工作！');
					} else if(data.statusId==3)  {
						layer.msg('当前用户机构无权启动预案！');
					} else {
						layer.msg('检查用户机构预案信息错误！');
					}
				},
				error : function() {
					layer.msg('请求失败');
				}
			});                   	
		}
	}

	return{
		startYJ: startYJ,
		//showDistrictRecord: showDistrictRecord,
		viewSupervise: viewSupervise,
		showTabWindow: showTabWindow,
		showDialog: showDialog,
		init: init
	}
});
