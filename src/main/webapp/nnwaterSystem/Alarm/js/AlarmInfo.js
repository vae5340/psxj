var userType;
$(function (){		
       $.ajax({
		method : 'GET',
		url : '/agsupport/meteo-hydrolog-alarm!listJsonAlarmInfo.action',
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
				var setText="<li><div style=\"width: 60%;float: left;\"><a onclick=\"startYJ('"+data.form.id+"')\"";
				if(data.form.alarmGrade==1)
					setText+=" class=\"a_red\"> ";
				else
					setText+=" class=\"a_yellow\"> ";
				setText+=data.form.alarmTitle+"</a></div><div style=\"width: 40%;float: left;\"><span>"+getLocalTime(data.form.alarmTime.time)+"</span></div></li>";
				allulcontent.append(setText);
				if(data.form.alarmType==1)
					qxulcontent.append(setText);
				else
					swulcontent.append(setText);
			}
			for (i in data.listRec){
				if(data.listRec[i][1]=="1"){
			    	var setText="<li><div style=\"width: 60%;float: left;\"><a class=\"a_red\">"+data.listRec[i][0]+data.listRec[i][2] +"</a></div><div style=\"width: 40%;float: left;\"><span>"+getLocalTime(data.listRec[i][3])+"</span></div></li>"
			    	qjulcontent.append(setText);
			       	allulcontent.append(setText);
				}
			}
			for (i in data.listSuper){
			    var dbText;
				if(data.listSuper[i]["type"]=="1"){
			       dbText="<li><div style=\"width: 60%;float: left;\"><a onclick=\"viewSupervise("+data.listSuper[i].id+")\"  class=\"a_red\">"+data.listSuper[i]["district"]+"启动应急响应</a></div><div style=\"width: 40%;float: left;\"><span>"+getLocalTime(data.listSuper[i]["time"].time)+"</span></div></li>"					    
			   	} else if(data.listSuper[i]["type"]=="2") {
			       dbText="<li><div style=\"width: 60%;float: left;\"><a onclick=\"viewSupervise("+data.listSuper[i].id+")\"  class=\"a_red\">"+data.listSuper[i]["district"]+"提交事中报告</a></div><div style=\"width: 40%;float: left;\"><span>"+getLocalTime(data.listSuper[i]["time"].time)+"</span></div></li>"
			   	} else if(data.listSuper[i]["type"]=="5") {
			       dbText="<li><div style=\"width: 60%;float: left;\"><a onclick=\"viewSupervise("+data.listSuper[i].id+")\"  class=\"a_red\">"+data.listSuper[i]["district"]+"抢险队督办</a></div><div style=\"width: 40%;float: left;\"><span>"+getLocalTime(data.listSuper[i]["time"].time)+"</span></div></li>"
			   	}
			   	dbulcontent.append(dbText);
			   	allulcontent.append(dbText);				   
			}
			
			if(data.cityRecord){
				$("#emergenRespon").html(data.cityRecord.templateName);
				$("#emergenRespon").on("click",function(){showDialog(data.cityRecord.id)});
				$("#emergenResponSpan").html(getLocalTime(data.cityRecord.recordCreateTime.time));
				$("#emergenResponDiv").show();
			}
            if(data.city){
				if(data.districtRecord){
					for (i in data.districtRecord){
						var setText="<li><div style=\"width: 60%;float: left;\"><a href=\"#\" onclick=\"showDistrictRecord('"+data.districtRecord[i].id+"')\">"+data.districtRecord[i]["districtName"]+data.districtRecord[i]["templateName"]+"</a></div><div style=\"width: 40%;float: left;\"><span>"+getLocalTime(data.districtRecord[i]["recordCreateTime"].time)+"</span></div></li>";
						qjulcontent.append(setText);
						allulcontent.append(setText);				   							
					}
				}
			}else{
			    if(data.districtRecord){
					for (i in data.districtRecord){
						var setText="<li><div style=\"width: 60%;float: left;\"><a href=\"#\" onclick=showTabWindow('/awater/nnwaterSystem/EmergenControl/District/main.html?districtUnitId="+data.districtRecord[i].districtId+"&id="+data.districtRecord[i].id+"')>"
						+data.districtRecord[i]["districtName"]+data.districtRecord[i]["templateName"]+"</a></div><div style=\"width: 40%;float: left;\"><span>"+getLocalTime(data.districtRecord[i]["recordCreateTime"].time)+"</span></div></li>";
						qjulcontent.append(setText);
						allulcontent.append(setText);				   															
					}
				}
			}

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
			parent.layer.msg('请求失败');
		}
	});
});
function startYJ(id){
	//市级用户点击
	if(userType==1){
		$.ajax({
			url: '/agsupport/meteo-hydrolog-alarm!checkAlarmStatus.action',
			data:{"id":id},
			dataType: 'json',
			cache:false,
			success: function (data){
				if(data.status==1)
					window.parent.showAddYJWindow(id);
				else if(data.status==2)
					parent.layer.msg("本预警已启动预案或已有启动预案");
				else if(data.status==3)
					parent.layer.msg("当前用户无权启动预案");
			},
			error : function() {
				parent.layer.msg('请求失败');
			}
		});
	} else {
		//其他用户点击，提示
		parent.layer.msg("当前用户无权限启动市级响应预案");
	}
}

function showDistrictRecord(id){
	parent.layer.open({
	  	type: 2,
	  	title: '成员单位应急调度情况',
	  	shadeClose: false,
	  	shade: 0.5,
		area: ['900px', '600px'],
		content: '/awater/nnwaterSystem/EmergenControl/District/Record/Record_Input.html?id='+id
	}); 			
}

function viewSupervise(id){
	parent.layer.open({
		type: 2,
		title: '督办详情',
		shadeClose: false,
		shade: 0.5,
		area: ['650px', '450px'],
		content:'/awater/nnwaterSystem/EmergenControl/District/Supervise/SuperviseView.html?id='+id
	}); 
}

function showTabWindow(url){
	parent.createNewtab(url,"成员单位调度详情");	
}

function showDialog(cityRecordId){
	if(userType==1){
		parent.createNewtab("/awater/nnwaterSystem/EmergenControl/Municipal/Supervise/Supervise.html?id="+cityRecordId,"市级调度");	
	} else {
		$.ajax({
			type: 'get',
			url : '/agsupport/ya-record-district!checkStatus.action',
			data:{"yaCityId":cityRecordId},
			dataType : 'json',  
			success : function(data) {
				if(data.statusId==0){
					//启动成员单位预案
					parent.layer.open({
						type: 2,
						title: '市级应急响应详细',
						shadeClose: false,
						shade: 0,
						maxmin: true,
						area: ['900px', '600px'],
						content: "/awater/nnwaterSystem/EmergenControl/Municipal/Record/Record_Input.html?yaCityId="+cityRecordId
					}); 
				} else if(data.statusId==1) {
					//进入成员单位调度室
					$.ajax({
						method : 'GET',
						url : '/agsupport/ya-record-district!getNowDistrict.action',
						async : false,
						dataType : 'json',
						success : function(data) {			
                        	showTabWindow("/awater/nnwaterSystem/EmergenControl/District/main.html?districtUnitId="+data.districtUnitId+"&id="+data.id);
						},
						error : function(error) {
							alert('error');
						}
				    });
				} else if(data.statusId==2)  {
					parent.layer.msg('当前预案完成调度工作！');
				} else if(data.statusId==3)  {
					parent.layer.msg('当前用户机构无权启动预案！');
				} else {
					parent.layer.msg('检查用户机构预案信息错误！');
				}
			},
			error : function() {
				parent.layer.msg('请求失败');
			}
		});                   	
	}
}