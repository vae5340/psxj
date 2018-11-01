function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}

var id=getQueryStr("id");
var cityYaId=getQueryStr("cityYaId");
var groupId=getQueryStr("groupId");		

function format_time(value, row, index){
	if(value)
		return getLocalTime(value.time);
	return '';
}
		
function queryParams(params) {
	return {
		limit:params.limit,
       	offset: params.offset
	};
}

function formatter_detail(value, row, index){
	return "<button class='btn btn-primary' type=\"button\"  onclick=openszbg('/awater/nnwaterSystem/EmergenControl/District/processReport/processReport.html?id="+row.id+"&yaId="+row.districtyaid+"')>详情</button>";		
}
	
function formatter_normal(value, row, index){
    if(value)
	   return value;
	return '';
}
	
function closeLayer(index) {
	layer.close(index);
   	reloadData();
}
	    
$(window).load(function(){
	$("#table").on('post-body.bs.table', function (row,obj) {
		$(".fixed-table-body").mCustomScrollbar({mouseWheelPixels:300});				
	});
});

$(function(){
	$.ajax({
		method:'GET',
		url:'/agsupport/ya-process-report!inputJson.action',
		data:{"id":id},
		dataType : 'json',  
		async:false,
		success:function(data){
		    $('#reportName').html(data.form.reportName)
			$('#reportContent').html(data.form.reportContent);
		},
		error:function (e){
			layer.msg("获取事中报告内容失败");
		}
	});

	$("#table").bootstrapTable({
		toggle:"table",
		height:parent.$("#content-main").height()-$("#reportContent").height()-100,					
		url:"/agsupport/ya-process-report!listAllDistrictReport.action?cityYaId="+cityYaId+"&groupId="+groupId+"&id="+id,
		rowStyle:"rowStyle",
		cache: false, 
		pagination:true,
		striped: true,
		pageNumber:1,
	    pageSize: 10,
		pageList: [10, 25, 50, 100],
		queryParams: queryParams,
		sidePagination: "server",
		columns: [
		  {field: 'reportname',title: '报告名称',align:'center'}, 
          {field: 'districtname',title: '成员单位',align:'center'},
          {field: 'reportcreatetime',title: '报告时间',align:'center',formatter:format_time},
          {field: 'reportcreater',title: '报告人',align:'center'}, 
          {title: '详情', formatter:formatter_detail,align:'center'}]
	});			
});
		
function openszbg(url){ 
	parent.createNewtab(url,"查看事中报告");  			 
}