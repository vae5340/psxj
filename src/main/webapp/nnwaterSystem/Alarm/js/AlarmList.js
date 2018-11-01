//格式化预案状态
function formatter_status(value,row,index){
	if(value==1)
		return "<font color='red'>启动中</font>";        		
	return "启动结束";
}
//格式化查看按钮-进入调度室
function formatter_overView(value,row,index){
	    return "<button class='btn btn-primary'  onclick=showRecordWindow('/awater/nnwaterSystem/EmergenControl/Municipal/Record/Record_Input.html?yaCityId="+row.id+"&showStart=0','市级应急预案详细')>详情</button>";
   //showRecordWindow(location.protocol+"//"+location.hostname+":"+location.port+'/awater/nnwaterSystem/EmergenControl/Municipal/Record/Record_Input.html?yaCityId='+row.id+'&showStart=0','市级应急预案详细')
}

//格式化查看报告按钮-进入报告汇总页面
function formatter_report(value,row,index){
    return "<button class='btn btn-primary' onclick=showBGWindow('"+row.id+"')>详情</button>";
}		     
//格式化列表时间
function formatter_time(value,row,index){
	if(value)
		return getLocalTime(value.time);
	return '';
}
//格式化字典字段数据-预案类型
function format_type(value, row, index){
	for (var item in DictList["templateType"]){
		if(value==DictList["templateType"][item].itemCode)
			return DictList["templateType"][item].itemName;
	}
	return '';
}
//格式化字典字段数据-预案等级
function format_grade(value, row, index){
	for (var item in DictList["templateGrade"]){
		if(value==DictList["templateGrade"][item].itemCode)
			return DictList["templateGrade"][item].itemName;
	}
	return '';
}

//表格刷新查询参数
function queryParams(params) {
	return {
		pageSize:params.limit,
		pageNo: params.offset/params.limit+1,
		
		templateGrade:$("#templateGrade").val(),
		recordCreateTime:$("#startTime").val(),
		recordCreateTime:$("#endTime").val(),
		recordStatus:$("#recordStatus").val(),
	};
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

//字典列表数据
var DictList=null;
//页面初始化加载内容
$(function(){
    $.ajax({
		method : 'GET',
		url : '/agsupport/ya-template-city!getAllDict.action',
		async : false,
		dataType : 'json',
		success : function(data) {
			DictList=data;  
			$("#table").bootstrapTable({
				toggle:"table",
				url:"/agsupport/ya-record-city!listJson.action",
				rowStyle:"rowStyle",
				cache: false, 
				pagination:true,
				striped: true,
				pageNumber:1,
			    pageSize: 10,
				pageList: [10, 25, 50, 100],
				queryParams: queryParams,
				sidePagination: "server",
				columns: [{field: 'templateNo',title: '方案编号',align:'center'},
				          {field: 'templateType',title: '方案分类',align:'center',formatter:format_type}, 
				          {field: 'templateName',title: '方案名称',align:'center'},
				          {field: 'templateGrade',title: '方案级别',align:'center',formatter:format_grade},
				          {field: 'templateCreateTime',title: '编制时间',visible:false, align:'center',formatter:formatter_time}, 
				          {field: 'templateCreatePerson',title: '编制人',align:'center'}, 
				          {field: 'recordCreateTime',title: '发布时间',align:'center',formatter:formatter_time},
				          {field: 'recordStatus',title: '状态',align:'center',formatter:formatter_status},
				          {title: '查看', formatter:formatter_overView,align:'center'}]
			});
		},
		error : function() {
			layer.msg("页面加载数据失败");
		}
	});
	$("#startTime").datetimepicker({
	    language: 'zh-CN',
		format: 'yyyy-mm-dd',
		autoclose:true,
		minView:2,
		pickerPosition:'bottom-right'
	});
	   
   	$("#endTime").datetimepicker({
        language: 'zh-CN',
	  	format: 'yyyy-mm-dd',
	  	autoclose:true,
	  	minView:2,
	  	pickerPosition:'bottom-right'
   	});
	   
function templateGrade_formatter(value, row, index){
	if(value=='1')
		return '一级应急预案';
	else if(value=='2')
		return '二级应急预案';
	else if(value=='3')
		return '三级应急预案';	
	else  
		return '四级应急预案';
}
function recordStatus_formatter(value, row, index){
	if(value=='1')
		return '启动中';
	else if(value=='2')
		return '启动结束';
	else if(value=='3')
		return '未启动';	

}
  	$("#startTime").on("change",function(){   		      
      	if($("#endTime").val()!=""){
          	$("#startTime").attr('max','$("#endTime").val()');
      	}
   	});
	   
	$("#endTime").on("change",function(){   		      
		if($("#startTime").val()!=""){
          	$("#endTime").attr('min','$("#startTime").val()');
     	}
  	});
  	
});
//进入实时市级调度室
function showNowTabWindow(id){
	var url="/awater/nnwaterSystem/EmergenControl/Municipal/Supervise/Supervise.html?id="+id;
	parent.createNewtab(url,"市级调度");	
}
//进入历史市级调度室
function showHistoryTabWindow(id){
	var url="/awater/nnwaterSystem/EmergenControl/Municipal/Supervise/SuperviseReview.html?id="+id;
	parent.createNewtab(url,"历史市级调度");	
}
//进入市级汇总报告
function showBGWindow(id){
	var url="/awater/nnwaterSystem/EmergenControl/Municipal/reportList.html?id="+id;
	parent.createNewtab(url,"市级应急报告"); 	
}
//重新加载表格数据
function reloadData(){
	var query=new Object();
	query.templateGrade=encodeURIComponent($("#templateGrade").val());
	
	if($("#startTime").val()!="")
		query.startTime=getTimeLong($("#startTime").val());
	if($("#endTime").val()!="")
		query.endTime=getTimeLong($("#endTime").val());
		
	query.recordStatus=encodeURIComponent($("#recordStatus").val());
	
	$("#table").bootstrapTable('refresh', {url:'/agsupport/ya-record-city!listJson.action',query:query});
}
//关闭弹出tab页面
function closeLayer(index){
	layer.close(index);
   	reloadData();
}