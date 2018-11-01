var FileList=null;

$(function(){
	$("#table").bootstrapTable({
		toggle:"table",
		url: "/agsupport/sz-file!listJson.action?fileTreeId="+GetQueryString("fileTreeId"),
		rowStyle:"rowStyle",
		method: 'post',
		cache: false, 
		pagination:true,
		striped: true,
		pageNumber: 1,
		pageSize: 10,
		pageList: [10, 25, 50, 100],
		queryParams: queryParams,
		sidePagination: "server",
		columns: [
				{field: 'id',title: 'ID',align:'center',valign:'middle',visible:false},
				{field: 'fileName',title: '档案名称',align:'center',valign:'middle'},
				{field: 'status',title: '档案状态',align:'center',valign:'middle',formatter:status_formatter},
				{field: 'fileYear',title: '档案年份',align:'center',valign:'middle'},
				{field: '',title: '相关文件',align:'center',valign:'middle',formatter:document_formatter},
				{field: '',title: '详细',align:'center',valign:'middle' ,formatter:option_formatter}
			
		]
	});
});
 
function queryParams(params){
	return {
		pageSize: params.limit,
		pageNo: params.offset/params.limit + 1
	};
}

function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

function document_formatter(value, row, index){
	return "<button class='btn btn-primary' onclick='documentList(" + row.id + "," + row.fileGroupId + ")'>详细</button>"
}

function option_formatter(value, row, index){
	var th = "<button class='btn btn-primary' style='margin-right:5px' onclick='modifiedFile(" + row.id + ")'>修改</button>"
	th += "<button class='btn btn-white' onclick='delFile(" + row.id + ")'>删除</button>"
	return th
}

function status_formatter(value, row, index){
	switch(value){
		case 0:
			return "已建档"
		case 1:
			return "未建档（预报）"
	}
	return ""
}
//上传按钮方法
//直接在Layer层上跳转到上传页面
var uploadIndex;
function uploadFile(){
	uploadIndex = layer.open({
		type: 2, 
		title: '新增档案',
		area: ['70%','95%'],
		content: '/awater/nnwaterSystem/szwh/facility/ssgl/document-upload.html?fileTreeId='+GetQueryString("fileTreeId")
	})
}

function modifiedFile(id){
	uploadIndex = layer.open({
		type: 2, 
		title: '修改档案',
		area: ['70%','95%'],
		content: '/awater/nnwaterSystem/szwh/facility/ssgl/document-upload.html?id=' + id
	})
}

function delFile(id){
	var r = confirm("确定要删除数据?")
	if(r){
		$.ajax({
			url: '/agsupport/sz-file!delete.action?id=' + id,
			success: function(){
				window.location.reload();
			}
		})
	}
}

var documentIndex;
function documentList(id,groupId){
	documentIndex = layer.open({
		type: 2, 
		title: '档案相关文件',
		area: ['600px','350px'],
		content: '/awater/nnwaterSystem/szwh/facility/ssgl/document-file-upload.html?id=' + id + '&groupId='+groupId
	})	
}

function GetQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
}