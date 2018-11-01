//数据填充
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}
var id=getQueryStr("id");
   
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

$(function(){
	$.ajax({
		method : 'GET',
		url : '/agsupport/ya-template-city!getAllDict.action',
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
		url:"/agsupport/ya-template-city!listJson.action",
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

function startYA(){
	var selectObj=$('#tableMuni').bootstrapTable('getSelections');
	if(selectObj.length==0){
		parent.layer.msg('请先选中预案模板');
	} else {
		parent.layer.open({
			type: 2,
			title: '启动市级应急预案-启动预案',
			shadeClose: true,
			shade: 0,
			area: ['900px', '600px'],
			content: '/awater/nnwaterSystem/EmergenControl/Municipal/Record/Record_Alarm_Input.html?template_id='+selectObj[0].id+"&meteoHydrologAlarmId="+id,
			success: function(){
				var index = parent.layer.getFrameIndex(window.name);
		       	window.parent.layer.close(index);
			}
		});
	}
}

function cancel(){
     parent.layer.close(parent.layer.getFrameIndex(window.name));
}