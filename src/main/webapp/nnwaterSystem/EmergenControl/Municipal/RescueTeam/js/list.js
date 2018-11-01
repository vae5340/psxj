var setting = {
	data: {
		simpleData: {enable: true}				
	},
	async: {
		enable: true,
		url: '/agsupport/om-org!getOrgAndTeam.action'
	},
	callback: {
		onClick:zTreeClick,
		onDblClick: zTreeDoubleClick
    }
};

function formatter_data(value, row, index){
	if(value==null)
		return "";
	else
   	    return value;
}

var subTeamList;
var searchParentId;

function zTreeClick(event, treeId, treeNode) {
	searchParentId=treeNode.id;
	clickSearchData(searchParentId);
};

function zTreeDoubleClick(event, treeId, treeNode) {
	//id为空,显示人员信息
	if(treeNode.id!=null){
		layer.open({
			type: 2,
			title: '机构信息',
			maxmin: true,
			area: ['1000px', '500px'],
		   	content: 'agency.html',
		   	success: function(layero, index){
				$.each(treeNode,function(key){
					layer.getChildFrame("#"+key, index).val(treeNode[key]);
		       	});
		   	}
		});
	} else {
         layer.open({
			type: 2,
			title: '队伍信息',
			maxmin: true,
			area: ['1000px', '500px'],
		    content: 'team.html',
		    success: function(layero, index){
		    	$.each(treeNode,function(key){
					layer.getChildFrame("#"+key, index).val(treeNode[key]);
				});
			}
		});			
	}
}
      
var zNodes=[];  
$(window).resize(function () {
	$('#teamTable').bootstrapTable('resetView');
});

$(document).ready(function(){
	$.fn.zTree.init($("#teamtree"), setting, zNodes);
	$("#teamTable").bootstrapTable({
		toggle:"table",
		height:parent.$("#content-main").height()-165,
		rowStyle:"rowStyle",
		cache: false,
		striped: true,
		sidePagination: "server",
		columns:[{field:'NAME',visible: true,title: '机构名称',align:'center',formatter:formatter_data},
			/*{field:'orgType',visible: false,title: '机构类型',align:'center',formatter:formatter_data},*/
			{field:'CONTACT',visible: true,title: '联系人',align:'center',formatter:formatter_data},
			{field:'PHONE',visible: true,title: '联系电话',align:'center',formatter:formatter_data},
			{field:'ADDRESS',visible: true,title: '机构地址',align:'center',formatter:formatter_data},
			{field:'AMOUNT',visible: true,title: '队伍人数',align:'center',formatter:formatter_data}/*,
			{field:'orgPath',visible: false,title: '机构位置',align:'center',formatter:formatter_data},
			{field:'area',visible: true,title: '所属地域',align:'center',formatter:formatter_data}*/]
	});
	
	$("#teamTable").on('post-body.bs.table', function (row,obj) {
		$(".fixed-table-body").mCustomScrollbar({mouseWheelPixels:300});
	});
});  
      
function searchData(org){ 
	var para; 
    $("#teamTable").bootstrapTable('refreshOptions', {data:{}});
    para="orgName="+encodeURI($("#searchTeamName").val())+"&seq=2";	
    if(searchParentId!=null)
    	para+="&parentOrgId="+searchParentId;
	$.ajax({
	    method : 'GET',
		url : "/agsupport/om-org!searchOrgAndTeam.action?"+para,
		async : true,
		dataType : 'json',
		success : function(data) {
			$("#teamTable").bootstrapTable('refreshOptions', {data:data});	
		},
		error : function() {
			alert('error');
		}
	});
}

function clickSearchData(parentOrgId){
	$("#teamTable").bootstrapTable('refreshOptions', {data:{}});
	$.ajax({
		method : 'GET',
		url : "/agsupport/yj-team!searchOrgTeam.action?orgId="+parentOrgId,
		async : true,
		dataType : 'json',
		success : function(data) {
		   	if(data.total){
				$("#teamTable").bootstrapTable('refreshOptions', {data:data.total});		                  
        	}
		},
		error : function(e) {
			alert('error');
		}
	});
}