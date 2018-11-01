//数据填充
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return "";
}

var name=getQueryStr("name");
var ownerdept=getQueryStr("ownerdept");
var address=getQueryStr("address");

function queryParams(params) {
	return {
		name:encodeURIComponent(name),
		ownerdept:encodeURIComponent(ownerdept),
		address:encodeURIComponent(address),
		pageSize:params.limit,
		pageNo: params.offset/params.limit+1
	};
}

$(function () {
   	$("#table").bootstrapTable({
		url:'/agsupport/yj-good!listJson.action',
		toolbar: '#toolbar',
		cache: false, 
		search:true,
		showRefresh:true,
		showExport:true,
		pagination:true,
		striped: true,
		pageNumber:1,
	    pageSize: 10,
		pageList: [10, 25, 50, 100],
		queryParams: queryParams,
		sidePagination: "server",
		columns: [
			{visible:true,checkbox:true},
			{field:'name',visible: true,title: '名称',width:"15%",align:'center'},
			{field:'code',visible: true,title: '编号',align:'center'},
			{field:'model',visible: true,title: '物资型号',align:'center'},
			{field:'amount',visible: true,title: '数量',align:'center'},
			{field:'address',visible: true,title: '存放地址',align:'center'},
			{field:'ownerdept',visible: true,title: '权属单位',align:'center'},
			{visible: true,title: '操作',width:100,align:'center',formatter:editBtn}
		]
	});
});
function editBtn(value, row, index){
	return "<button id=\"btn_edit\" type=\"button\" class=\"btn btn-primary\" style=\"border:1px solid transparent;\" onclick=\"editDialog("+row.id+")\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>修改</button>";
}
function opennewlayer(){
	parent.layer.open({
		type: 2,
		area: ['770px', '400px'],
		title : "新增应急物资",	
		content: ['/awater/nnwaterSystem/EmergenControl/PrevWatelogSupplies/Input.html', 'yes']
	});
}
function editDialog(id){
	parent.layer.open({
		type: 2,
		area: ['770px', '400px'],
		title : "修改应急物资",
		content: ['/awater/nnwaterSystem/EmergenControl/PrevWatelogSupplies/Input.html?id='+id, 'yes']
	});
}

function delData(){
    var selList=$("#table").bootstrapTable('getSelections');
    if(selList.length==0)
    	parent.layer.msg('请选中删除项');
    else {
    	parent.layer.confirm('是否删除选中数据？', {btn: ['确认','取消'] //按钮
		}, function(){
			var checkedIds= new Array();
		   	for (var i=0;i<selList.length;i++){
		   		checkedIds.push(selList[i].id);
		   	}
	        $.ajax({  
			    url : '/agsupport/yj-good!delJson.action',
				traditional: true,
			    data: {"checkedIds" : checkedIds},
			    type: "POST",
			    dataType: "json",
			    success: function(data) {
			        parent.layer.msg(data.result);
			    	reloadData();
			    }
			});
		}, function(){
			
		});
   	}
}

function reloadData(){
	$.ajax({  
	    url: '/agsupport/yj-good!listJson.action',
	    data: {"name" :encodeURIComponent(name),"ownerdept" : encodeURIComponent(ownerdept),"address" : encodeURIComponent(address)},
	    type: "POST",
	    dataType: "json",
	    success: function(data) {
	    	$("#table").bootstrapTable('removeAll');
	 		$("#table").bootstrapTable('load',data);
	    },
	    error:function(){
	    	layer.msg("删除失败");
	    }
	});
}