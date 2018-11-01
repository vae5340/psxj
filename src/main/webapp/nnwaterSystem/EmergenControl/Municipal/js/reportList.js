function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
 }

var cityYaId=getQueryStr("id");     
   
function format_time(value, row, index){
	if(value)
		return getLocalTime(value.time);
	return '';
}	

function formatter_detail(value, row, index){
    if(row.type==1)   	
		return "<button class='btn btn-primary' type=\"button\"  onclick=openszbg('/awater/nnwaterSystem/EmergenControl/Municipal/processReport/processReportList.html?id="+row.id+"&cityYaId="+row.cityyaid+"&groupId="+row.groupid+"')>详情</button>";
	else
		return "<button class='btn btn-primary' type=\"button\"  onclick=openyyyb('"+row.id+"')>详情</button>";			
}

function format_type(value, row, index){   
   if(value==1)
      return "事中报告";
   return "一雨一报";   
}

function closeLayer(index){
	layer.close(index);
   	reloadData();
}
   
function queryParams(params) {
	return {
		limit:params.limit,
		offset:params.offset
	};
}

$(function(){
	//验证当前预案是否已经生成一雨一报
    $.ajax({
		method : 'GET',
		url : '/agsupport/ya-rain-report!checkHasCityReport.action',
		data:{cityYaId:cityYaId},
		async : false,
		dataType:'json',
		success : function(data) {
			if(data.canCreateReport==true)
				$("#toolBar").show();
		},
		error : function(e) {
			layer.msg('获取预案一雨一报信息失败');
		}
	});
	
	$("#table").bootstrapTable({
		toggle:"table",		
		url:"/agsupport/ya-rain-report!listCityAllReport.action?cityYaId="+cityYaId,
		rowStyle:"rowStyle",
		cache: false,
		pagination:false,
		striped: true,
		sidePagination: "server",
		columns: [
			{field: 'type',title:'报告类型',align:'center',formatter:format_type}, 
		  	{field: 'reportname',title: '报告名称',align:'center'}, 
          	{field: 'reportcreatetime',title: '报告时间',align:'center',formatter:format_time},
          	{field: 'reportcreater',title: '报告人',align:'center'}, 
          	{title: '详情', formatter:formatter_detail,align:'center'}]
	});					
});	  

$(window).resize(function (){
	$('#table').bootstrapTable('resetView');
});

function openyyyb(id){
	var taburl="/awater/nnwaterSystem/EmergenControl/Municipal/RainNews/list.html?id="+id;
	parent.createNewtab(taburl,"防汛应急响应一雨一报");
}

function openszbg(url){
	parent.createNewtab(url,"防汛应急响应事中报告");  
}

function addData(){
	layer.open({
		type: 2,
		title: '新增成员单位一雨一报',
		shadeClose: true,
		shade: 0.5,
		area: ['800px', '300px'],
		content: 'ya_list.html' //iframe的url
	});
}
function reloadData(){
    $.ajax({
		method : 'GET',
		url:"/agsupport/ya-rain-report!listCityAllReport.action?cityYaId="+cityYaId,
		async : false,
		success : function(data) {
		    $("#table").bootstrapTable('refreshOptions', {data:JSON.parse(data).rows});	       				
		},
		error : function(e) {
			layer.msg('获取应急报告列表失败');
		}
	});	
}

function createRainReport(){
	layer.confirm('是否新增市级单位一雨一报？', {btn: ['是','否']},
	function(index){
		$.ajax({
			method:'GET',
			url:'/agsupport/ya-rain-report!createCityReport.action',
			data:{cityYaId:cityYaId},
			dataType : 'json',  
			async:false,
			success:function(data){
				layer.close(index);
				reloadData();
				$("#toolBar").hide();
				if(data.form)
					parent.createNewtab("/awater/nnwaterSystem/EmergenControl/District/RainNews/listView.html?id="+data.form.id,"修改市级一雨一报");						
			},
			error:function (e){
				layer.close(index);
				layer.msg("新增市级单位一雨一报失败");
			}
		});
	}, 
	function(){
		
	});
}