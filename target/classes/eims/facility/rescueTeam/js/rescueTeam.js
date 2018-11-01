define(['jquery','layer','dateUtil','bootstrap','bootstrapTable','bootstrapTableCN','bootstrapDatetimepicker','bootstrapDatetimepickerCN','mousewheel','customScrollbar'],function($,layer,dateUtil,bootstrap,bootstrapTable,bootstrapTableCN,bootstrapDatetimepicker,bootstrapDatetimepickerCN){
	var layerIndex;


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
			//onDblClick: zTreeDoubleClick
		}
	};
	var zNodes=[];

	var searchParentId;

	function zTreeClick(event, treeId, treeNode) {
		searchParentId=treeNode.id;
		clickSearchData(searchParentId);
	};

	function zTreeDoubleClick(event, treeId, treeNode) {
		debugger;
		//id为空,显示人员信息
		if(treeNode.id!=null){
			$.get("/psemgy/eims/facility/rescueTeam/agency.html",function(h){
				layerIndex=layer.open({
				  type: 1, 
				  content: h,
				  title:'机构信息',
					area: ['1000px', '500px']
				});
				require(['eims/facility/rescueTeam/js/agency'],function(agency){
				  agency.init(treeNode);
				});
			});  
			
			// layer.open({
			// 	type: 2,
			// 	title: '机构信息',
			// 	maxmin: true,
			// 	area: ['1000px', '500px'],
			// 	content: 'agency.html',
			// 	success: function(layero, index){
			// 		$.each(treeNode,function(key){
			// 			layer.getChildFrame("#"+key, index).val(treeNode[key]);
			// 		});
			// 	}
			// });
		} else {
			$.get("/psemgy/eims/facility/rescueTeam/team.html",function(h){
				layerIndex=layer.open({
				  type: 1, 
				  content: h,
				  title:'队伍信息',
					area: ['1000px', '500px']
				});
				require(['eims/facility/rescueTeam/js/team'],function(team){
					team.init(treeNode);
				});
			}); 
			// layer.open({
			// 	type: 2,
			// 	title: '队伍信息',
			// 	maxmin: true,
			// 	area: ['1000px', '500px'],
			// 	content: 'team.html',
			// 	success: function(layero, index){
			// 		$.each(treeNode,function(key){
			// 			layer.getChildFrame("#"+key, index).val(treeNode[key]);
			// 		});
			// 	}
			// });			
		}
	}

	  
	$(window).resize(function () {
		$('#rescueTeamTable').bootstrapTable('resetView');
	});


	function formatter_name(value, row, index){
		return value||row.name||"";
	}
	function formatter_contact(value, row, index){
		return value||row.linkMan||"";
	} 
	function formatter_address(value, row, index){
		return value||row.address||"";
	} 
	function formatter_amount(value, row, index){
		return value||row.amount||"";
	} 
	function formatter_phone(value, row, index){
		return value||row.linkTel||"";
	}  

	function searchData(org){ 
		if(!$("#searchTeamName").val())
			return;
		if(!searchParentId){
			layer.msg('请先选中左侧父级单位',{icon: 0,time: 1000});
			//alert("请先选中左侧父级单位");
			return;
		}
		var para; 
		$("#rescueTeamTable").bootstrapTable('refreshOptions', {data:[]});
		para="orgName="+encodeURI($("#searchTeamName").val())+"&seq=2";	
		if(searchParentId!=null)
			para+="&parentOrgId="+searchParentId;
		$.ajax({
			method : 'GET',
			url : "/agsupport/om-org!searchOrgAndTeam.action?"+para,
			async : true,
			dataType : 'json',
			success : function(data) {
				$("#rescueTeamTable").bootstrapTable('refreshOptions', {data:data});	
			},
			error : function() {
				layer.msg('搜索出现错误',{icon: 2,time: 1000});
			}
		});
	}

	function clickSearchData(parentOrgId){
		$("#rescueTeamTable").bootstrapTable('refreshOptions', {data:{}});
		$.ajax({
			method : 'GET',
			url : "/psemgy/yjTeam/searchOrgTeam?orgId="+parentOrgId,
			async : true,
			dataType : 'json',
			success : function(data) {
				if(data.total){
					$("#rescueTeamTable").bootstrapTable('refreshOptions', {data:data.total});		                  
				}
			},
			error : function(e) {
				layer.msg('数据加载失败', {icon: 2,time: 1000});
			}
		});
	}

	function init(){
		$('#rescueTeamSearchBtn').click(searchData);
		$.fn.zTree.init($("#teamtree"), setting, zNodes);
		$("#rescueTeamTable").bootstrapTable({
			toggle:"table",
			height:parent.$("#content-main").height()-165,
			rowStyle:"rowStyle",
			cache: false,
			striped: true,
			sidePagination: "server",
			columns:[
				{field:'NAME',visible: true,title: '机构名称',align:'center',formatter:formatter_name},
				/*{field:'orgType',visible: false,title: '机构类型',align:'center',formatter:formatter_data},*/
				{field:'CONTACT',visible: true,title: '联系人',align:'center',formatter:formatter_contact},
				{field:'PHONE',visible: true,title: '联系电话',align:'center',formatter:formatter_phone},
				{field:'ADDRESS',visible: true,title: '机构地址',align:'center',formatter:formatter_address},
				{field:'AMOUNT',visible: true,title: '队伍人数',align:'center',formatter:formatter_amount}/*,
				{field:'orgPath',visible: false,title: '机构位置',align:'center',formatter:formatter_data},
				{field:'area',visible: true,title: '所属地域',align:'center',formatter:formatter_data}*/
			],
			onPostBody:function(){
				$("#rescueTeamTable").on('post-body.bs.table', function (row,obj) {
					$(".fixed-table-body").mCustomScrollbar({mouseWheelPixels:300});
				});
			}
		});
	}; 

	return{
	  init:init,
	}
})

