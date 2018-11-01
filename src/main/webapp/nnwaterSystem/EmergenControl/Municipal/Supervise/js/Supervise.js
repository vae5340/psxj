
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) return unescape(r[2]); return "";
}

var id=getQueryStr("id");
	    
function reload(){
	window.frames[0].location.reload();
	window.frames[1].location.reload();
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
$(window).load(function(){
	intervalIndex=setInterval("reload()",30000);
	$("#tableResponeDiv").mCustomScrollbar();
});

$(function(){
	$("#alarmInfoNew").attr("src","/awater/nnwaterSystem/Alarm/Municipal/AlarmInfoNew.html?cityYaId="+id);
	$("#supervise").attr("src","/awater/nnwaterSystem/EmergenControl/District/Supervise/SuperviseNews.html?cityYaId="+id);
	
	$.ajax({
		method : 'GET',
		url : '/agsupport/ya-record-city!getNowCityRecord.action',
		async : true,
		dataType : 'json',
		success : function(data) {  
			if(data!=0){
				$("#cityRecord").html(data.templateName);
				//插入预案升级按钮
				$("#cityRecordTitleDiv").append("<button class='btn btn-primary' style='margin-left:5px;padding: 0px;vertical-align: top;height:20px;' type='button' onclick='resetRecord()'>预案调整</button>");
				
				$("#cityA").on("click",function(){
				    showRecordWindow('/awater/nnwaterSystem/EmergenControl/Municipal/Record/Record_Input.html?yaCityId='+data.id+'&showStart=0','市级应急预案详细')
				});
			}
		},
		error : function() {   
			parent.layer.msg('获取应急预案信息失败');
		}
	});
					
	$.ajax({
		method : 'GET',
		url : '/agsupport/ya-record-city!inputJson.action?id='+id,
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
						$("#"+key).html(getLocalTime(data.form[key].time));
					else
						$("#"+key).html(data.form[key]);
				}
			}
		},
		error : function() {
			parent.layer.msg('获取各单位信息失败');
		}
	});
	freshTabRespone();
});

function freshTabRespone(){
	$("#tableRespone").empty();
	$.ajax({
		method : 'GET',
		url : '/agsupport/ya-record-district!getDistrictStatus.action',
		async : true,
		dataType : 'json',
		success : function(data) {
			$("#tableRespone").append("<tr height='20px' id ='type2'><td colspan='3' class='unitTitle'>成员单位机构</td></td></tr>");
			$("#tableRespone").append("<tr height='20px' id ='type3'><td colspan='3' class='unitTitle'>有关单位</td></td></tr>");
			//var canEnd=true;
			$.each(data.row,function(index,item){
				if(item.ORG_TYPE==3){
					if(item.STATUS)
						districtName="<a href='#' onclick=viewDistrictRecord('"+item.ORG_ID+"','"+item.ID+"')>"+item.ORG_NAME+"</a>";
					else
						districtName=item.ORG_NAME;
					if(item.STATUS==1){
						$("#type3").after("<tr height='20px'><td>"+districtName+"</td><td>启动中</td><td><a href='#' onclick=SendSupervise('SuperviseNews.html?yaId="+id+"&yaType=1&status=1&districtUnitId="+item.ORG_ID+"')>督办</a></td></tr>")
					} else if(item.STATUS==2){
						$("#type3").after("<tr height='20px'><td>"+districtName+"</td><td><font style='color: red;'>已结束</font></td><td></td></tr>")
					} else {
						$("#type3").after("<tr height='20px'><td>"+districtName+"</td><td><font style='color: red;'>未开始</font></td><td><a  href='#' onclick=SendSupervise('SuperviseNews.html?yaId="+id+"&yaType=1&status=0&districtUnitId="+item.ORG_ID+"')>督办</a></td></tr>")
					}	
				} else {
					if(item.STATUS)
						districtName="<a href='#' onclick=viewDistrictRecord('"+item.ORG_ID+"','"+item.ID+"')>"+item.ORG_NAME+"</a>";
					else
						districtName=item.ORG_NAME;
					if(item.STATUS==1){
						$("#type2").after("<tr height='20px'><td>"+districtName+"</td><td>启动中</td><td><a href='#' onclick=SendSupervise('SuperviseNews.html?yaId="+id+"&yaType=1&status=1&districtUnitId="+item.ORG_ID+"')>督办</a></td></tr>")
					} else if(item.STATUS==2){
						$("#type2").after("<tr height='20px'><td>"+districtName+"</td><td><font style='color: red;'>已结束</font></td><td></td></tr>")
					} else {
						$("#type2").after("<tr height='20px'><td>"+districtName+"</td><td><font style='color: red;'>未开始</font></td><td><a  href='#' onclick=SendSupervise('SuperviseNews.html?yaId="+id+"&yaType=1&status=0&districtUnitId="+item.ORG_ID+"')>督办</a></td></tr>")
					}
				}
			});
			$("#tableAction").append("<tr height='20px'><td>全市&nbsp;&nbsp;</td><td colspan='2'><button class='btn btn-primary' style='padding: 0px;vertical-align: top;height:30px;width:180px;' type='button' onclick='SendMiddleView()'><i class='fa fa-check'></i>&nbsp;通知各单位提交事中报告</button><br /><button class='btn btn-primary' style='padding: 0px;vertical-align: top;height:30px;width:180px;' type='button' onclick='processRep()'><i class='fa fa-check'></i>&nbsp;生成事中报告</button><br /><button class='btn btn-primary' style='padding: 0px;vertical-align: top;height:30px;width:180px;' type='button' onclick='addenddb()'><i class='fa fa-check'></i>&nbsp;结束预案督办通知</button><br /><button class='btn btn-primary' style='padding: 0px;vertical-align: top;height:30px;width:180px;' type='button' onclick='checkEndRecord()'><i class='fa fa-check'></i>&nbsp;结束预案</button><br /></td></tr>");	
			//结束预案并
		},
		error : function() {
			parent.layer.msg('获取各单位信息失败');
		}
	});
}

//检查当前预案是否满足结束预案条件
function checkEndRecord(){
	endCityRecord();
	/*$.ajax({
		type: 'post',
		url :'/agsupport/ya-record-city!checkEndRecord.action?id='+id,
		dataType : 'json',  
		success : function(data) {
			if(data.status==0){
				layer.msg("当前成员单位还有未结束,不能结束当前市级预案");
			} else if(data.status==1){
				endCityRecord();
			} else {
				layer.msg("获取结束预案状态失败");
			}
		},
		error : function() {
			layer.msg("获取结束预案状态失败");
		}
	});*/
}

function endCityRecord(){
	layer.confirm('是否确定结束当前应急响应预案？', {
		btn: ['是','否'] //按钮
	}, function(){
		$.ajax({
			type: 'post',
			url :'/agsupport/ya-record-city!endRecordJson.action?id='+id,
			dataType : 'json',  
			success : function(data) {
				layer.closeAll('dialog');
				parent.layer.msg(data.result);
				
				clearInterval(intervalIndex);
				var rmPart=location.protocol+"//"+location.hostname+":"+location.port;
				var queryUrl=window.location.href.substring(rmPart.length);
				parent.closeNavTab(queryUrl);
				
				/*if(data.rainReportForm){
					parent.$("#alarmInfo")[0].src=parent.$("#alarmInfo")[0].src;
					parent.createNewtab("/awater/nnwaterSystem/EmergenControl/Municipal/RainNews/listView.html?id="+data.rainReportForm.id,data.rainReportForm.reportName+"一雨一报");						
					clearInterval(intervalIndex);
					var rmPart=location.protocol+"//"+location.hostname+":"+location.port;
					var queryUrl=window.location.href.substring(rmPart.length);
					parent.closeNavTab(queryUrl);
				}*/
			},
			error : function() {
				parent.layer.msg('error');
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
		url:'/agsupport/ya-process-report!checkCreateCityReport.action',
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
		url:'/agsupport/ya-process-report!produceCityReportContent.action',
		dataType : 'json',
		async:false,
		success:function(data){
			if(data.id!=null){
				parent.createNewtab('/awater/nnwaterSystem/EmergenControl/Municipal/processReport/processReport.html?id='+data.id+"&yaId="+id,"提交事中报告");							  
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
//发起成员单位启动预案督办
function SendSupervise(url){
	layer.open({
		type: 2,
		title: '督办通知设置',
		shadeClose: false,
		shade: 0.5,
		area: ['550px', '300px'],
		content:url
	}); 
}
//发起提交事中报告通知
function SendMiddleView(){
	$.ajax({
		method:'GET',
		url:'/agsupport/ya-supervise-log!checkAllowSZ.action',
		data:{yaId:id},
		dataType : 'json',
		async:false,
		success:function(data){
    		if(data.statusId==1||data.statusId==2){
    			//生成事中报告
    			layer.open({
					type: 2,
					title: '提交事中报告通知',
					shadeClose: false,
					shade: 0.5,
					area: ['650px', '280px'],
					content:'SuperviseMultiNews_SZ.html?yaId='+id+"&yaType=1&type=2"
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
	layer.open({
		type: 2,
		title: '结束预案督办通知',
		shadeClose: false,
		shade: 0.5,
		area: ['650px', '280px'],
		content:'SuperviseMultiNews_JS.html?yaId='+id+"&yaType=1&type=3"
	});
}
//查看成员单位调度室
function viewDistrictRecord(districtUnitId,yaId){
	layer.open({
		type: 2,
		title: '浏览成员单位启动预案',
		shadeClose: false,
		shade: 0.5,
		area: ['100%', '100%'],
		content:"/awater/nnwaterSystem/EmergenControl/District/main-View.html?districtUnitId="+districtUnitId+"&id="+id+"&yaDistrictId="+yaId
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
		content:"/awater/nnwaterSystem/EmergenControl/Municipal/DispatchLog/Template_Alarm_List.html?cityYaId="+id
	});
}