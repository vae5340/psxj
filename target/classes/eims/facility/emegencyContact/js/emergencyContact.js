define(['jquery','layer','bootstrap','bootstrapTable','bootstrapTableCN','mousewheel','customScrollbar'],function($,layer,bootstrap,bootstrapTable,bootstrapTableCN,mousewheel,customScrollbar){

	//图片缩放自动计算
	function AutoResizeImage(maxWidth,maxHeight,objImg){
		var img = new Image();
		img.src = objImg.src;
		var hRatio;
		var wRatio;
		var w = img.width;
		var h = img.height;
		var wRatio= maxWidth;
		var hRatio= img.height*(maxWidth/w);
		objImg.height = hRatio;
		objImg.width = wRatio;
	}


	//加载表格数据
	function loadTableData(){
		$('#controldept_contact').bootstrapTable({
			url:"/psemgy/yjControldeptContact/listJson",
			toggle:"table",
			height:$(window).height()-100,
			rowStyle:"rowStyle",
			cache: false,
		  	pagination: true, //分页
		  	sidePagination: "server",
		  	queryParams: queryParamsCC,
		  	pageNumber:1,
		  	pageSize: 100,
		  	pageList: [10, 25, 50, 100],
		  	locale:"zh-CN",//表格汉化
		  	columns: [
		  	{visible:true,checkbox:true},
		  	{field: 'name',title: '名称',align:'center'},
		  	{field: 'telNum',title: '联系电话',align:'center'},
		  	{field: 'fax',title: '传真',align:'center'},
		  	{field: 'bz',title: '备注',align:'center'},
		  	{field: 'operation',title: '操作',halign:'center',formatter: format_cc_button}
		  	],
		  	onLoadSuccess:function(){
		  		$('.itemUploadBtnCC').click(editCC);
					
		  	},
		  	onPostBody:function(){
		  		$("#controldept_contact").on('post-body.bs.table', function (row,obj) {
						$(".fixed-table-body").mCustomScrollbar({mouseWheelPixels:300});	
					});
		  	}
		  });
		$('#leader_contact').bootstrapTable({
			toggle:"table",
			url:"/psemgy/yjLeaderContact/listJson",
			height:$(window).height()-100,
			rowStyle:"rowStyle",
			cache: false,
		  	pagination: true, //分页
		  	sidePagination: "server",
		  	queryParams: queryParamsLC,
		  	locale:"zh-CN",//表格汉化
		  	pageNumber:1,
		  	pageSize: 100,
		  	pageList: [10, 25, 50, 100],
		  	columns: [
		  	{visible:true,checkbox:true},
		  	{field: 'unit',title: '单位',align:'center'},
		  	{field: 'name',title: '名称',align:'center'},
		  	{field: 'post',title: '职务',align:'center'}, 
		  	{field: 'telphone',title: '联系方法',align:'center'}, 
		  	{field: 'regularPhone',title: '固话',align:'center'}, 
		  	{field: 'bz',title: '备注',halign:'center'}, 
		  	{field: 'operation',title: '操作',halign:'center',formatter: format_lc_button}
		  	],
		  	onLoadSuccess:function(){
		  		$('.itemUploadBtnLC').click(editLC);
		  	
		  	},
		  	onPostBody:function(){
	  			$("#leader_contact").on('post-body.bs.table', function (row,obj) {
						$(".fixed-table-body").mCustomScrollbar({mouseWheelPixels:300});	
					});
		  	}
		  });
	}
	//构造表格操作按钮
	function format_cc_button(value, row, index) {
		return "<button class='btn btn-primary itemUploadBtnCC' data-id='"+row.id+"'>修改</button>";// onclick='editCC("+row.id+")'
	}
	//构造表格操作按钮
	function format_lc_button(value, row, index) {
		return "<button class='btn btn-primary itemUploadBtnLC' data-id='"+row.id+"'>修改</button>";//onclick='editLC("+row.id+")'
	}

	function reloadDataCC(){
		$.ajax({  
			url: '/psemgy/yjControldeptContact/listJson',
			data: {"name" : $("#listCCname").val()},
			type: "POST",
			dataType: "json",
			success: function(data) {
				$("#controldept_contact").bootstrapTable('removeAll');   
				$("#controldept_contact").bootstrapTable('refresh',{pageNumber: 1});
				$("#controldept_contact").bootstrapTable('load',data);
			},
			error:function(){
				layer.msg("重新加载失败", {icon: 2,time: 1000});
			}
		});
	}
	function reloadDataLC(){
		$.ajax({  
			url: '/psemgy/yjLeaderContact/listJson',
			data: {"name" : $("#listName").val(),"unit" : $("#listUnit").val(),"post" : $("#listPost").val()},
			type: "POST",
			dataType: "json",
			success: function(data) {
				$("#leader_contact").bootstrapTable('removeAll');
				$("#leader_contact").bootstrapTable('refresh',{pageNumber: 1});
				$("#leader_contact").bootstrapTable('load',data);
			},
			error:function(){
				layer.msg("重新加载失败", {icon: 2,time: 1000});
			}
		});
		
	}
	//分页参数
	function queryParamsCC(params) {
		return {
			pageSize:params.limit,
			pageNo:params.offset/params.limit+1,
			name:$("#listCCname").val(),
		};
	}
	//分页参数
	function queryParamsLC(params) {
		return {
			pageSize:params.limit,
			pageNo:params.offset/params.limit+1,
			name:$("#listName").val(),
			unit:$("#listUnit").val(),
			post:$("#listPost").val(),
		};
	}

	var layerIndex;
	function editCC(e){
		$.get("/psemgy/eims/facility/emegencyContact/controldeptContactInput.html",function(h){
			layerIndex=layer.open({
			  type: 1, 
			  content: h,
			  title:'指挥部通讯录-修改',
				area: ['600px', '320px'],
			});
			require(['eims/facility/emegencyContact/js/controldeptContactInput'],function(controldeptContactInput){
			  controldeptContactInput.init($(e.target).data('id'),layerIndex);
			});
		});  
		// layer.open({
		// 	type: 2,
		// 	title: '指挥部通讯录-修改',
		// 	maxmin: true, //开启最大化最小化按钮
		// 	area: ['600px', '320px'],
		// 	content: 'controldeptContactInput.html?id='+id
		// });
	}


	function editLC(e){
		$.get("/psemgy/eims/facility/emegencyContact/leaderContactInput.html",function(h){
			layerIndex=layer.open({
			  type: 1, 
			  content: h,
			  title:'责任人通讯录-修改',
				area: ['600px', '350px'],
			});
			require(['eims/facility/emegencyContact/js/leaderContactInput'],function(leaderContactInput){
			  leaderContactInput.init($(e.target).data('id'),layerIndex);
			});
		});  
		// layer.open({
		// 	type: 2,
		// 	title: '责任人通讯录-修改',
		// 	maxmin: true, //开启最大化最小化按钮
		// 	area: ['600px', '350px'],
		// 	content: 'leaderContactInput.html?id='+id
		// });
	}

	function addCC(){
		$.get("/psemgy/eims/facility/emegencyContact/controldeptContactInput.html",function(h){
			layerIndex=layer.open({
			  type: 1, 
			  content: h,
			  title:'指挥部通讯录-新增',
				area: ['600px', '320px'],
			});
			require(['eims/facility/emegencyContact/js/controldeptContactInput'],function(controldeptContactInput){
			  controldeptContactInput.init("",layerIndex);
			});
		});  
		// layer.open({
		// 	type: 2,
		// 	title: '指挥部通讯录-新增',
		// 	maxmin: true, //开启最大化最小化按钮
		// 	area: ['600px', '320px'],
		// 	content: 'controldeptContactInput.html'
		// });
	}

	function addLC(){
		$.get("/psemgy/eims/facility/emegencyContact/leaderContactInput.html",function(h){
			layerIndex=layer.open({
			  type: 1, 
			  content: h,
			  title:'责任人通讯录-新增',
				area: ['600px', '350px'],
			});
			require(['eims/facility/emegencyContact/js/leaderContactInput'],function(leaderContactInput){
			  leaderContactInput.init("",layerIndex);
			});
		});  
		// layer.open({
		// 	type: 2,
		// 	title: '责任人通讯录-新增',
		// 	maxmin: true, //开启最大化最小化按钮
		// 	area: ['600px', '350px'],
		// 	content: 'leaderContactInput.html'
		// });
	}

	function delCC(){
		var selList=$("#controldept_contact").bootstrapTable('getSelections');
		if(selList.length==0)
			layer.msg('请选中删除项', {icon: 0,time: 1000});
		else {
			layer.confirm('是否删除选中项？', {
				btn: ['是', '否']
			}, function(index){
				var checkedIds= new Array();
				for (var i=0;i<selList.length;i++)
					checkedIds.push(selList[i].id);
				$.ajax({  
					url: '/psemgy/yjControldeptContact/deleteMoreJson',
					traditional: true,
					data: {"checkedIds" : checkedIds},
					type: "POST",
					dataType: "json",
					success: function(data) {
						layer.msg(data.result);
						reloadDataCC();
					},
					error:function(){
						layer.msg("删除失败" ,{icon: 2,time: 1000});
					}
				});
			}, function(index){}
			);
		}
	}

	function delLC(){
		var selList=$("#leader_contact").bootstrapTable('getSelections');
		if(selList.length==0)
			layer.msg('请选中删除项' ,{icon: 0,time: 1000});
		else {
			layer.confirm('是否删除选中项？', {
				btn: ['是', '否']
			}, function(index){
				var checkedIds= new Array();
				for (var i=0;i<selList.length;i++)
					checkedIds.push(selList[i].id);
				$.ajax({  
					url: '/psemgy/yjLeaderContact/deleteMoreJson',
					traditional: true,
					data: {"checkedIds" : checkedIds},
					type: "POST",
					dataType: "json",
					success: function(data) {
						layer.msg(data.result);
						reloadDataLC();
					},
					error:function(){
						layer.msg("删除失败" ,{icon: 2,time: 1000});
					}
				});
			}, function(index){}
			);
		}
	}


	//页面调整大小自动缩放图片
	/*window.onresize = function(){  
		AutoResizeImage($("#emergencyContact").width(),0,$("#jgt")[0]);
		$('#leader_contact').bootstrapTable('resetView');
		$('#controldept_contact').bootstrapTable('resetView');
	}*/

	function initBtn(){
		$('#btn_queryLC').click(reloadDataLC);
		$('#btn_addLC').click(addLC);
		$('#btn_delLC').click(delLC);
		$('#btn_queryCC').click(reloadDataCC);
		$('#btn_addCC').click(addCC);
		$('#btn_delCC').click(delCC);
	}
	function init(){

		AutoResizeImage($("#emergencyContact").width(),0,$("#jgt")[0]);
		loadTableData();
		initBtn();
	};

	return {
	  init:init
	}


})


