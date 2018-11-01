function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) return unescape(r[2]); return "";
}

var yaId=getQueryStr("yaId");
var id=getQueryStr("id");
var reportId=getQueryStr("reportId");
var reportType=getQueryStr("reportType");
var view=getQueryStr("view");		    
var districtArea="";
$.ajax({
	method : 'GET',
	url : '/agsupport/om-org!getOrganizationName.action',
	async : false,
	success : function(data) {
		var districtName=data;	
		for(var index in nnArea){
			if(nnArea[index].name==districtName){
		    	districtArea=nnArea[index].code;
		    	break;
			}
		}		
	},
	error : function(e) {
		layer.msg("获取当前用户机构信息失败");
	}
});
	    
$(function(){
	if(view!=""){
		$("#save").hide();	
		$.ajax({
			type: 'get',
			url : '/agsupport/ya-jsd-report!inputJson.action?id='+id,
			dataType : 'json',  
			success : function(data) {
				for(var key in data){
					if(key.toLowerCase().indexOf("time")!=-1&&data[key]!=null){
						$("#createTime").val(data[key].time);
				   	} else if(key=="jsdId"){
			       		$("#jsdId").append("<option value='"+data["jsdId"]+"'>"+data["jsdName"]+"</option>");					       					            
					} else 
			           $("#"+key).val(data[key]);        							      
				}
				$.ajax({
					type: 'post',
					url : "/agsupport/yj-problem-report!listJsdJson.action?yaId="+data["yaId"]+"&jsdId="+data["jsdId"],
					dataType : 'json',  
					success : function(data) {
						$("#tableJsd").bootstrapTable('refreshOptions', {data:data.rows});
					},
					error : function(e) {
						layer.msg("获取积水点列表失败");
					}
				});	
            },
			error : function(e) {
				layer.msg("获取积水点报告失败");
			}
		});	
	} else if(id!="") {
		$.ajax({
			type: 'get',
			url : '/agsupport/ya-jsd-report!inputJson.action?id='+id,
			dataType : 'json',  
			success : function(data) {
				for(var key in data){
					if(key=="jsdId"){
						$("#jsdId").append("<option selected='selected' value='"+data["jsdId"]+"'>"+data["jsdName"]+"</option>");					       					            
					} else 
						$("#"+key).val(data[key]);        							      
				}
			    $.ajax({
					type: 'post',
					url : "/agsupport/yj-problem-report!listJsdJson.action?yaId="+data["yaId"]+"&jsdId="+data["jsdId"],
					dataType : 'json',  
					success : function(data) {
						$("#tableJsd").bootstrapTable('refreshOptions', {data:data.rows});
					},
					error : function(e) {
						layer.msg("获取积水点数据失败");
					}
				 });	   
            },
			error : function(e) {
				layer.msg("获取积水点报告失败");
			}
		});				
	} else {
		$("#createInfo").hide();
		$("#yaId").val(yaId);	 
		
	}
	
	var url="/agsupport/ya-jsd-report!listNoRepeatJsd.action?yaId="+$("#yaId").val();
	$.ajax({
		type: 'post',
		url : url,
		dataType : 'json',  
		success : function(data) {			    
		    for(var index in data.list){
		    	if($("#jsdId").val()!=data.list[index].id)
					$("#jsdId").append("<option value='"+data.list[index].id+"'>"+data.list[index].comb_name+"</option>");
			}	
		    $("#jsdName").val($("#jsdId").find("option:selected").text());
		},
		error : function(e) {
			layer.msg("获取积水点名称失败");
		}
	});
		
	$('#jsdId').change(function(){
		$("#jsdName").val($(this).find("option:selected").text());
		$.ajax({
			type: 'post',
			url : "/agsupport/yj-problem-report!listJsdJson.action?yaId="+$("#yaId").val()+"&jsdId="+$(this).val(),
			dataType : 'json',  
			success : function(data) {
				if(data.dutyUnit)
					$("#dutyUnit").val(data.dutyUnit);
			    if(data.dutyPerson)
			        $("#dutyPerson").val(data.dutyPerson);
			    $("#tableJsd").bootstrapTable('refreshOptions', {data:data.rows});
            },
			error : function(e) {
				layer.msg("获取积水点数据失败");
			}
		});	
	});
	$("#tableJsd").bootstrapTable({
		toggle:"table",
		data:{},
		rowStyle:"rowStyle",
		height:250,
		cache: false, 
		checkboxHeader:false,
		singleSelect:true,
		clickToSelect:true,
		sidePagination: "server",
		columns: [
			{field:'problemName',visible: true,title: '问题名称',width:"15%",align:'center'},
			{field:'problemDescription',visible: true,title: '问题描述',align:'center',formatter:formatter_normal},
			{field:'problemPerson',visible: true,title: '上报人',align:'center'},
			{field:'problemTime',visible: true,title: '上报时间',align:'center',formatter:format_time},
			{visible: true,title: '操作',width:100,align:'center',formatter:addBtnCol}]
	});
});
	    
function formatter_normal(value, row, index){
	if(value==null)
	   return '';
	return value;
}
   
function format_time(value, row, index){
	if(value)
		return getLocalTime(value.time);
	return '';
}   

function addBtnCol(value, row, index){
	return "<button id=\"btn_edit\" type=\"button\" class=\"btn btn-primary\" style=\"border:1px solid transparent;\" onclick=\"detailDialog("+row.id+")\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>详细</button>";
}	
  
function detailDialog(id){
	parent.layer.open({
		type: 2,
		title: '应急问题详细',
		shade: 0,
		maxmin: true, 
		area: ['880px', '530px'],
		content: '/awater/nnwaterSystem/EmergenControl/ProblemReport/ProblemReport_Edit.html?id='+id
	});
}    
   
function save(){
	var dataContent = $("#form").serialize();
	if(reportId)
		dataContent += "&reportId="+reportId;
	if(reportType)
		dataContent += "&reportType="+reportType;
	$.ajax({
		type: 'post',
		url : '/agsupport/ya-jsd-report!saveJson.action',
		data:dataContent,
		dataType : 'json',  
		success : function(data) {
			parent.layer.msg(data.result);
			var index=parent.layer.getFrameIndex(window.name);
			parent.closeLayer(index);
		},
		error : function() {
			layer.msg("报错积水点数据失败");
		}
	});										
}
		
function cancel(){
	parent.layer.close(parent.layer.getFrameIndex(window.name));
}
		
$(window).load(function(){
	$("#content").mCustomScrollbar({
		mouseWheelPixels:300
	});
});