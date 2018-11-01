
//数据填充
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) return unescape(r[2]); return "";
}
//市级预案编号
var id=getQueryStr("id");


$(function(){
	$("#alarmInfoNew").attr("src","/awater/nnwaterSystem/Alarm/Municipal/AlarmInfoNew.html?cityYaId="+id);
	$("#supervise").attr("src","/awater/nnwaterSystem/EmergenControl/District/Supervise/SuperviseNewsReview.html?yaId="+id);
	$.ajax({
		method : 'GET',
		url : '/agsupport/ya-record-city!getHistoryCityRecord.action?id='+id,
		async : true,
		dataType : 'json',
		success : function(data) {  
			if(data!=0){
				$("#cityRecord").html(data.templateName);
				$("#cityA").on("click",function(){
				    showRecordWindow(data.id,'市级应急预案详细')
				});
			}
		},
		error : function() {   
			parent.layer.msg('error');
		}
	});
	
	
	
	$.ajax({
		method : 'GET',
		url : '/agsupport/ya-record-district!getDistrictStatusHis.action?yaCityId='+id,
		async : true,
		dataType : 'json',
		success : function(data) {
			$("#tableRespone").append("<tr height='20px' id ='type2'><td colspan='2' class='unitTitle'>成员单位机构</td></td></tr>");
			$("#tableRespone").append("<tr height='20px' id ='type3'><td colspan='2' class='unitTitle'>有关单位</td></td></tr>");
		
			$.each(data.row,function(index,item){			
			var districtName="";
			 if(item.ORG_TYPE==3){
					if(item.STATUS)
						districtName="<a href='#' onclick=viewDistrictRecord('"+item.ORG_ID+"','"+item.ID+"')>"+item.ORG_NAME+"</a>";
					else
						districtName=item.ORG_NAME;
					if(item.STATUS==1){
						$("#type3").after("<tr height='20px'><td >"+districtName+"</td><td>启动中</td></tr>")
					} else if(item.STATUS==2){
						$("#type3").after("<tr height='20px'><td >"+districtName+"</td><td><font style='color: red;'>已结束</font></td></tr>")
					} else {
						$("#type3").after("<tr height='20px'><td >"+districtName+"</td><td><font style='color: red;'>未开始</font></td></tr>")
					}
				}else{
					if(item.STATUS)
						districtName="<a href='#' onclick=viewDistrictRecord('"+item.ORG_ID+"','"+item.ID+"')>"+item.ORG_NAME+"</a>";
					else
						districtName=item.ORG_NAME;
					if(item.STATUS==1){
						$("#type2").after("<tr height='20px'><td >"+districtName+"</td><td>启动中</td></tr>")
					} else if(item.STATUS==2){
						$("#type2").after("<tr height='20px'><td >"+districtName+"</td><td><font style='color: red;'>已结束</font></td></tr>")
					} else {
						$("#type2").after("<tr height='20px'><td>"+districtName+"</td><td><font style='color: red;'>未开始</font></td></tr>")
					}	
				 }
			});
		},
		error : function() {
			parent.layer.msg('error');
		}
	});
});
//市级预案内容详细
function showRecordWindow(id,title){
	var url="/awater/nnwaterSystem/EmergenControl/Municipal/Record/Record_Input.html?yaCityId="+id+"&showStart=0";
	layer.open({
		type: 2,
		title: title,
		shadeClose: false,
		shade: 0.5,
		area: ['800px', '700px'],
		content:url
	});
}
//查看成员单位调度室
function viewDistrictRecord(districtUnitId,yaId){
	var url="/awater/nnwaterSystem/EmergenControl/District/main-View.html?districtUnitId="+districtUnitId+"&id="+id+"&yaDistrictId="+yaId;
	layer.open({
		type: 2,
		title: '浏览成员单位启动预案',
		shadeClose: false,
		shade: 0.5,
		area: ['100%', '100%'],
		content:url
	});
}