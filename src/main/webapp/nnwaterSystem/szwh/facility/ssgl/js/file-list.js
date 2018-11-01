var FileList=null;

$(function(){
	$("#table").bootstrapTable({
		toggle:"table",
		url: "/agsupport/sz-facilities!getFacByType.action?faclitiesType=" + GetQueryString("faclitiesType"),
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
			[
				{field: 'id',rowspan:2,title: 'ID',align:'center',valign:'middle',visible:false},
				{field: 'faclitiesName',rowspan:2,title: '道路名称',align:'center',valign:'middle'},
				{field: 'totallength',rowspan:2,title: '道路总长度<br/>(m)',align:'center',valign:'middle'},
				{field: '',rowspan:2,title: '道路路幅红线宽度<br/>(m)',align:'center',valign:'middle'},
				{field: 'totalarea',rowspan:2,title: '道路总面积<br/>(m²)',align:'center',valign:'middle'},
				{field: '',title: '车行道',colspan:5,align:'center',valign:'middle'},
				{field: 'dividingstrip',colspan:2,title: '分隔带面积<br/>(m²)',align:'center',valign:'middle'}, 
				{field: 'footwalkarea',colspan:2,title: '土路肩/人行道',align:'center',valign:'middle'},
				{field: 'footwalkarea',colspan:3,title: '浆砌片石排水沟',align:'center',valign:'middle'},
				{field: 'bridgeculvert',rowspan:2,title: '桥涵<br/>(座)',align:'center',valign:'middle'},
				{field: 'completiondate',rowspan:2,title: '竣工日期',align:'center',valign:'middle'},
				{field: 'receiveddate',rowspan:2,title: '接受日期',align:'center',valign:'middle'},
				{field: 'releaseliabilitydate',rowspan:2,title: '解除质保责任日期',align:'center',valign:'middle'},
				{field: 'remark',rowspan:2,title: '备注',align:'center',valign:'middle'}
				//{field: 'option',rowspan:2,title: '操作',align:'center',valign:'middle',formatter:option_formatter}
			],[
				{field: '',title: '道路宽度<br/>(m)',align:'center',valign:'middle'},
				{field: 'roadwayarea',title: '合计面积<br/>(m²)',align:'center',valign:'middle'},
				{field: 'roadwaysubarea1',title: '水泥砼面积<br/>(m²)',align:'center',valign:'middle'},
				{field: 'roadwaysubarea2',title: '沥青砼面积<br/>(m²)',align:'center',valign:'middle'},
				{field: 'roadwaysubarea3',title: '改性沥青砼面积<br/>(m²)',align:'center',valign:'middle'},
				{field: '',title: '宽度<br/>(m)',align:'center',valign:'middle'},
				{field: '',title: '面积<br/>(m²)',align:'center',valign:'middle'},
				{field: '',title: '宽度<br/>(m)',align:'center',valign:'middle'},
				{field: 'footwalkarea',title: '面积<br/>(m²)',align:'center',valign:'middle'},
				{field: '',title: '长度<br/>(m²)',align:'center',valign:'middle'},
				{field: 'checkwell',title: '检查井<br/>(m²)',align:'center',valign:'middle'},
				{field: 'storminlet',title: '雨水井<br/>(m²)',align:'center',valign:'middle'},
			]
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

function uploadFile_formatter(value, row, index){
	return "<button class='btn btn-success' onclick=''>详细</button>"
}

function option_formatter(value, row, index){
	return "<button class='btn btn-danger' onclick='delFile(" + row.id + ")'>删除</button>"
}
//上传按钮方法
//直接在Layer层上跳转到上传页面
function uploadFile(){
	window.location.href = "/awater/nnwaterSystem/szwh/facility/ssgl/file-upload.html?facilitiesId=" + GetQueryString("id");
}
//
//
function uploadFileList(){
}

function delFile(id){
	$.ajax({
		url: '/agsupport/sz-file!delete.action?id=' + id,
		success: function(){
			window.location.reload();
		}
	})
}