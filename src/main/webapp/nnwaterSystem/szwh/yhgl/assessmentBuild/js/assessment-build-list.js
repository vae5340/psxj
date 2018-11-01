
var FileList = null;
$(function () {
	$("#table").bootstrapTable({toggle:"table", url:"/agsupport/sz-assessmentbuild!listJson.action", 
	rowStyle:"rowStyle",
	height:parent.$("#content-main").height()-230,							
	cache:false, pagination:true, striped:true, pageNumber:1, pageSize:10, 
	pageList:[10, 25, 50, 100], queryParams:queryParams, sidePagination:"server", 
	columns:[
		{visible:true,checkbox:true},
		{field: 'number', title: '序号', formatter: function (value, row, index) { return index+1;}},
		{field:"assessmentYear", title:"年份", align:"center"},
		{field:"subjectUnit", title:"受检单位", align:"center"}, 
		{field:"totalScore", title:"得分", align:"center"}, 
		{field:"assessmentor", title:"考评人员", align:"center"}, 
		{field:"assessmentStart", title:"检查开始时间", align:"center",formatter:createDate_formatter},
		{field:"assessmentEnd", title:"检查结束时间", align:"center",formatter:createDate_formatter},
	 	{visible: true,title: '操作',width:100,align:'center',formatter:addBtnCol}]
 	});
});

function createDate_formatter(value, row, index){
	if(value){
		return getLocalDate(value.time);
	}
	return '';
}

function queryParams(params) {
	return {
	 pageSize:params.limit,
	 pageNo:params.offset / params.limit + 1
	};
}

function reloadData(){
	var query = new Object();
	if($("#subjectUnit").val()!="")
		query.subjectUnit=$("#subjectUnit").val();
	$("#table").bootstrapTable(
	'refresh', {
		url:"/agsupport/sz-assessmentbuild!listJson.action",query:query
	});    
}

function addBtnCol(value, row, index){
	  return "<button id=\"btn_edit\" class=\"btn btn-primary\" style=\"border:1px solid transparent;\" onclick=\"detailDialog("+row.assessmentBuildId+")\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>详细</button>";
}

function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2]);
	}
	return null;
}

function addData(){
   	layer.open({
		type: 2,
		title: '新增安全文明施工考核',
		maxmin: true, 
		area: ['900px','550px'],
	    content: 'assessment-build-edit.html'
	});
}

function delData(){		    
 	var selList=$("#table").bootstrapTable('getSelections');
 	if(selList.length==0)
 		layer.msg('请选中删除项');
 	else{
	  	var checkedIds= new Array();
	  	for (var i=0;i<selList.length;i++){
	  		checkedIds.push(selList[i].assessmentBuildId);
	  	}
 	    $.ajax({  
		    url: location.protocol+"//"+location.hostname+":"+location.port+'/agsupport/sz-assessmentbuild!deleteMoreJson.action',  
		    traditional: true,
		    data: {"checkedIds" : checkedIds},
		    type: "POST",
		    dataType: "json",
		    success: function(data) {
		        //alert(data.status);
		        layer.msg(data.result);
		 		reloadData();
		    }
		});
 	}
 }

function detailDialog(id){
	layer.open({
			type: 2,
			title: '安全文明施工考核详细',
			maxmin: true, 
			area: ['900px','550px'],
		    content: 'assessment-build-edit.html?id='+id
	});
}