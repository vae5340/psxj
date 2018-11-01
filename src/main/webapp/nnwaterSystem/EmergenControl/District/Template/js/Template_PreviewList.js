
$(function () {
	$('#Table_Template_List').bootstrapTable({
		toggle:"table",
		url:"/agsupport/ya-template-district!listDistrictJson.action",
		rowStyle:"rowStyle",
		toolbar: '#toolbar',
		pagination:true,
		sortable: false,
		striped: true,
		pageNumber:1,
		pageSize: 10,
		pageList: [10, 25, 50, 100],
		queryParamsType: "limit",
		cache: false,
		queryParams: queryParams,
		sidePagination: "server",
		columns: [
			{visible:true,checkbox:true},
			{field:'templateNo',visible: true,title: '预案号',align:"center"},
			{field:'templateName',visible: true,title: '预案名称',align:"center"},
			{field:'templateGrade',visible: true,formatter:format_grade,title: '预案级别',align:"center"},
			{field:'templateType',visible: true,title: '预案类型',formatter:format_type,align:"center"},
			{field:'templateContent',visible: true,title: '预案内容',halign:"center"},
			{field:'templateCreateTime',visible: true,title: '创建时间',formatter:format_date,align:"center"},
			{visible: true,title: '操作',formatter:addBtnCol,width:100,align:"center"}
		]
	});
});
function queryParams(params) {
	return {
		pageSize:params.limit,
   		//pageNo: params.offset/params.limit+1
   		pageNumber: params.pageNumber,
		
   		
	};
}
function addData(){
  	layer.open({
		type: 2,
		title: '新增区级调度预案',
		maxmin: true, //开启最大化最小化按钮
		area: ['1000px', '600px'],
	    content: 'Template_PreviewInput.html'
	});
}

function delData(){
   	var selList=$('#Table_Template_List').bootstrapTable('getSelections');
   	if(selList.length==0)
   		layer.msg('请选中删除项');
   	else {
	   	layer.confirm('是否删除选中项？', {
	  		btn: ['是', '否']
			}, function(index){
				var checkedIds= new Array();
		    	for (var i=0;i<selList.length;i++)
		    		checkedIds.push(selList[i].id);
		   	    $.ajax({  
				    url: '/agsupport/ya-template-district!deleteMoreJson.action',  
				    traditional: true,
				    data: {"checkedIds" : checkedIds},
				    type: "POST",
				    dataType: "json",
				    success: function(data) {
				        layer.msg(data.result);
				        reloadData();
				    }
				});
		   		reloadData();
			}, function(index){}
		);
	}
}

function addBtnCol(value, row, index){
	return "<button id=\"btn_edit\" type=\"button\" class=\"btn btn-primary\" style=\"border:1px solid transparent;\" onclick=\"detailDialog("+row.id+")\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>详细</button>";
}

//存放字典变量
var DictList=null;

function format_grade(value, row, index){
	if(DictList){
		for (var item in DictList["templateGrade"]){
			if(value==DictList["templateGrade"][item].itemCode)
				return DictList["templateGrade"][item].itemName;
		}
		return '';
	} else {
		$.ajax({
			method : 'GET',
			url : '/agsupport/ya-template-city!getAllDict.action',
			async : false,
			dataType : 'json',
			success : function(data) {
				DictList=data;													
			},
			error : function() {
				layer.msg("获取数据失败");
			}
		});
		for (var item in DictList["templateGrade"]){
			if(value==DictList["templateGrade"][item].itemCode)
				return DictList["templateGrade"][item].itemName;
		}
		return '';
	}
}

function format_date(value, row, index){
	if(value)
		return getLocalTime(value.time);
	return '';
}

function format_type(value, row, index){
	for (var item in DictList["templateType"]){
		if(value==DictList["templateType"][item].itemCode)
			return DictList["templateType"][item].itemName;
	}
	return '';
}

function detailDialog(id){
	layer.open({
		type: 2,
		title: '区级调度预案详细',
		maxmin: true, //开启最大化最小化按钮
		area: ['1000px', '600px'],
	    content: 'Template_PreviewInput.html?id='+id
	});
}

function reloadData(){
	$.ajax({  
	    url: '/agsupport/ya-template-district!listDistrictJson.action',
	    data: {"templateNo" : $("#templateNo").val(),"#templateName":$("#templateName").val()},
	    type: "POST",
	    dataType: "json",
	    success: function(data) {
	    	$("#Table_Template_List").bootstrapTable('removeAll');
	    	$("#Table_Template_List").bootstrapTable('load',data);
	    },
	    error:function(){
	    	layer.msg("删除失败");
	    }
	});
}


   	    
function closeLayer(index){
	layer.close(index);
	reloadData();
}