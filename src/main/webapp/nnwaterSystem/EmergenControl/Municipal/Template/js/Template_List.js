function addData(){
  	layer.open({
		type: 2,
		title: '新增市级调度预案',
		maxmin: true, //开启最大化最小化按钮
		area: ['900px', '600px'],
		//offset: ['1px', '1px'],
	    content: 'Template_Input.html'
	});
}
		    		    
function closeLayer(index){
	layer.close(index);
	reloadData();
}
		    
function delData(){		    
 	var selList=$("#tableMuni").bootstrapTable('getSelections');
 	if(selList.length==0)
 		layer.msg('请选中删除项');
 	else {
 		layer.confirm('是否删除选中数据？', {btn: ['确认','取消'] //按钮
		}, function(){
			var checkedIds= new Array();
		   	for (var i=0;i<selList.length;i++)
		   		checkedIds.push(selList[i].id);
		  	    $.ajax({
			    url: '/agsupport/ya-template-city!deleteMoreJson.action',  
			    traditional: true,
			    data: {"checkedIds" : checkedIds},
			    type: "POST",
			    dataType: "json",
			    success: function(data) {
			        layer.msg(data.result);
		  			reloadData();
			    }
			});
		}, function(){
			
		});
	}
}	    
		    
function reloadData(){
	var query=new Object();
	if($("#templateNo").val()!="")
		query.templateNo=$("#templateNo").val();
	if($("#templateName").val()!="")
		query.templateName=$("#templateName").val();
	$("#tableMuni").bootstrapTable('refresh', {url:'/agsupport/ya-template-city!listJson.action',query:query});
}
			
function addBtnCol(value, row, index){
	return "<button id=\"btn_edit\" type=\"button\" class=\"btn btn-primary\" style=\"border:1px solid transparent;\" onclick=\"detailDialog("+row.id+")\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>详细</button>";
}

//存放字典变量
var DictList=null;

function format_grade(value, row, index){
	for (var item in DictList["templateGrade"]){
		if(value==DictList["templateGrade"][item].itemCode)
			return DictList["templateGrade"][item].itemName;
	}
	return '';
}
function format_type(value, row, index){
	for (var item in DictList["templateType"]){
		if(value==DictList["templateType"][item].itemCode)
			return DictList["templateType"][item].itemName;
	}
	return '';
}
function format_date(value, row, index){
	if(value)
		return getLocalTime(value.time);
	return '';
}
function detailDialog(id){
	layer.open({
			type: 2,
			title: '市级调度预案详细',
			maxmin: true, //开启最大化最小化按钮
			area: ['900px', '600px'],
		    content: 'Template_Input.html?id='+id
	});
}    	

function queryParams(params) {
	return {
        pageSize:params.limit,
        pageNo: params.offset/params.limit+1
	};
}
			
$(function(){ 
	$.ajax({
		method : 'GET',
		url : '/agsupport/sz-facilities!getSum.action',
		async : false,
		dataType : 'json',
		success : function(data) {
		   var t=data.table;
		},
		error : function() {
			layer.msg('数据加载失败');
		}
	});
	       
	     
	$.ajax({
		method : 'GET',
		url : '/agsupport/ya-template-city!getAllDict.action',
		async : false,
		dataType : 'json',
		success : function(data) {
			DictList=data;
			$("#tableMuni").bootstrapTable({
				toggle:"table",
				url:"/agsupport/ya-template-city!listJson.action",
				rowStyle:"rowStyle",
				toolbar: '#toolbar',
				cache: false, 
				pagination:true,
				striped: true,
				pageNumber:1,
			    pageSize: 10,
				pageList: [10, 25, 50, 100],
				queryParams: queryParams,
				sidePagination: "server",
				columns: [
					{visible:true,checkbox:true},
					{field:'templateNo',visible: true,title: '预案编号',width:"15%",align:'center'},
					{field:'templateName',visible: true,title: '预案名称',align:'center'},
					{field:'templateGrade',visible: true,title: '预案级别',align:'center',formatter:format_grade},
					{field:'templateType',visible: true,title: '预案类型',align:'center',formatter:format_type},
					{field:'templateCreateTime',visible: true,title: '创建时间',align:'center',formatter:format_date},
					{field:'templateCreatePerson',visible: true,title: '编制人',align:'center'},
					{visible: true,title: '操作',width:100,align:'center',formatter:addBtnCol}
				]
			});
		},
		error : function() {
			layer.msg('数据加载失败');
		}
	});
});