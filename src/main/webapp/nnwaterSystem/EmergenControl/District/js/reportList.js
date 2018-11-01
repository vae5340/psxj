function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
 }

var districtYaId=getQueryStr("id");
   	      	    	    
function format_time(value, row, index){
	if(value)
		return getLocalTime(value.time);
	return '';
}

function formatter_district(value, row, index){
	return districtName;
}

function formatter_detail(value, row, index){
    if(row.type==1)   	
		return "<button class='btn btn-primary' type=\"button\"  onclick=openszbg('"+row.id+"')>详情</button>";
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

$(function(){
	//加载预案机构名称
    $.ajax({
		method : 'GET',
		url : '/agsupport/om-org!getOrganizationName.action',
		async : false,
		success : function(data) {
			districtName=data;
			$("#title").html(districtName+"应急报告汇总");	
		},
		error : function(e) {
			layer.msg('获取机构信息失败');
		}
	});

	//验证当前预案是否已经生成一雨一报
    $.ajax({
		method : 'GET',
		url : '/agsupport/ya-rain-report!checkHasDistrictReport.action',
		data:{districtYaId:districtYaId},
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
		height:parent.$("#content-main").height()-120,			
		url:"/agsupport/ya-rain-report!listDistrictAllReport.action?districtYaId="+districtYaId,
		rowStyle:"rowStyle",
		cache: false,
		pagination:false,
		striped: true,
		sidePagination: "server",
		columns: [
		  {field: 'type',title:'报告类型',align:'center',formatter:format_type}, 
		  {field: 'reportname',title: '报告名称',align:'center'}, 
          {title: '成员单位',formatter:formatter_district,align:'center'},
          {field: 'reportcreatetime',title: '报告时间',align:'center',formatter:format_time},
          {field: 'reportcreater',title: '报告人',align:'center'}, 
          {title: '详情',formatter:formatter_detail,align:'center'}]
	});					
});	  
$(window).resize(function () {
	$('#table').bootstrapTable('resetView');
});

function openyyyb(id){
	var taburl="/awater/nnwaterSystem/EmergenControl/District/RainNews/list.html?id="+id;
	parent.createNewtab(taburl,"防汛应急响应一雨一报");
}

function openszbg(id){
	parent.createNewtab('/awater/nnwaterSystem/EmergenControl/District/processReport/processReport.html?id='+id+"&yaId="+districtYaId,"查看事中报告");
	/*layer.open({
	  type: 2,
	  title: '查看事中报告',
	  shadeClose: false,
	  shade: 0.5,
	  area: ['960px', '500px'],
	  content: '/awater/nnwaterSystem/EmergenControl/District/processReport.html?id='+id
	});*/   
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
		url : "/agsupport/ya-rain-report!listDistrictAllReport.action?districtYaId="+districtYaId,
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
	layer.confirm('是否新增成员单位一雨一报？', {btn: ['是','否']},
	function(index){
		$.ajax({
			method:'GET',
			url:'/agsupport/ya-rain-report!createDisReport.action',
			data:{districtYaId:districtYaId},
			dataType : 'json',  
			async:false,
			success:function(data){
				layer.close(index);
				reloadData();
				$("#toolBar").hide();
				if(data.form)
					parent.createNewtab("/awater/nnwaterSystem/EmergenControl/Municipal/RainNews/listView.html?id="+data.rainReportForm.id,data.rainReportForm.reportName+"一雨一报");
			},
			error:function (e){
				layer.close(index);
				layer.msg("新增成员单位一雨一报失败");
			}
		});
	}, 
	function(){
		
	});
}