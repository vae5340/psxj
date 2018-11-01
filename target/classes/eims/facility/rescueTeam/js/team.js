var OrgFirstClicked=true;
function zTreeOnClick(event, treeId, treeNode) {
	var showTeam=false;
	$.each(teamMap,function(key,subList){
		if(key==treeNode.orgId){
			showTeam=true;	                  
			$.each(subList,function(index,teamForm){
				$("#name").val(teamForm["name"]);	                  
			});	
			
			if(teamFirstClicked){			
				$("#tableTeam").bootstrapTable({
					toggle:"table",
					height:300,
					data:subList,
					rowStyle:"rowStyle",
					cache: false, 						    
					striped: true,
					sidePagination: "server",
					columns: [
					{field:'id',visible: false},
					{field:'contact',visible: true,title: '联系人'},
					{field:'name',visible: true,title: '所属部门'},
					{field:'phone',visible: true,title: '电话号码'},
					{field:'address',visible: true,title: '地址'}
					]
				});
				$("#tableTeamDiv").show();
				teamFirstClicked=false;
			}
			else{
				if(subList!=undefined){
					$("#tableTeam").bootstrapTable('refreshOptions', {data:subList});
					$("#tableTeamDiv").show();
				}  
				else{
					$("#tableTeam").bootstrapTable('refreshOptions', {data:{}});   
					$("#tableTeamDiv").hide();
				}
			}                  	                  	                  
		}
		return true;	              
	});
};

var teamMap;
$.ajax({
	method : 'GET',
	url : location.protocol+"//"+location.hostname+":"+location.port+'/agsupport/om-org!allOrgsJson.action',
	async : true,
	dataType : 'json',
	success : function(data) {
		$.fn.zTree.init($("#teamtree"), setting,data.formList);
		teamMap=data.teamMap;
	},
	error : function() {
		alert('error');
	}
})