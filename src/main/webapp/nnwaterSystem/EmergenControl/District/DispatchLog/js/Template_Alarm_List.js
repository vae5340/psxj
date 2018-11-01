//数据填充
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}

var districtYaId=getQueryStr("districtYaId");

var districtUnitId =getQueryStr("districtUnitId");
//存放字典变量
var DictList=null;

function format_grade(value, row, index){
	for (var item in DictList["templateGrade"]){
		if(value==DictList["templateGrade"][item].itemCode)
			return DictList["templateGrade"][item].itemName;
	}
	return "";
}

function format_type(value, row, index){
	for (var item in DictList["templateType"]){
		if(value==DictList["templateType"][item].itemCode)
			return DictList["templateType"][item].itemName;
	}
	return "";
}

$(function(){
	$.ajax({
		method : 'GET',
		url : '/agsupport/ya-template-district!getAllDict.action',
		async : false,
		dataType : 'json',
		success : function(data) {
			DictList=data;
			loadTable();
		},
		error : function() {
			parent.layer.msg('获取数据失败');
		}
	});
});

function loadTable(){
	$("#tableMuni").bootstrapTable({
		toggle:"table",
		height:300,
		url:"/agsupport/ya-template-district!listJsonNoUse.action?districtYaId="+districtYaId+"&districtUnitId="+districtUnitId,
		rowStyle:"rowStyle",
		toolbar: '#toolbar',
		cache: false, 
		striped: true,
		checkboxHeader:false,
		singleSelect:true,
		clickToSelect:true,
		sidePagination: "server",
		columns: [
			{visible:true,checkbox:true},
			{field:'templateNo',visible: true,title: '预案编号',width:"15%"},
			{field:'templateName',visible: true,title: '预案名称',align:'center'},
			{field:'templateGrade',visible: true,title: '预案级别',align:'center',formatter:format_grade},
			{field:'templateType',visible: true,title: '预案类型',align:'center',formatter:format_type},
			{field:'templateContent',visible: true,title: '预案内容',halign:'center'},
			{field:'templateCreatePerson',visible: true,title: '编制人',align:'center'}
		]
	});
	$("#tableMuni").on('post-body.bs.table', function (row,obj) {
		$(".fixed-table-body").mCustomScrollbar({mouseWheelPixels:600});
	});
}

function changeYA(){
	var selectObj=$('#tableMuni').bootstrapTable('getSelections');
	if(selectObj.length==0){
		parent.layer.msg('请先选中预案模板');
	} else {
		parent.layer.confirm('是否使用当前选中预案信息作为更新预案内容？', {btn: ['确认','取消'] //按钮
		}, function(){
			//新增调度日志
			//修改当前预案内容
			$.ajax({
				method : 'GET',
				url : '/agsupport/ya-dispatch-log!recordDistirctReset.action',
				data:{templateId:selectObj[0].id,districtYaId:districtYaId},
				dataType : 'json',
				success : function(data) {
					parent.layer.msg(data.result);
					parent.location.reload();
					parent.layer.close(parent.layer.getFrameIndex(window.name));
				},
				error : function() {
					parent.layer.msg("预案调整失败");
				}
			});
		}, function(){
			
		});
	}
}

function cancel(){
     parent.layer.close(parent.layer.getFrameIndex(window.name));
}