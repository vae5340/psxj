$(window).load(function(){
	AutoResizeImage($(window).width(),0,$("#jgt")[0]);
	loadTableData();
	$("#leader_contact").on('post-body.bs.table', function (row,obj) {
		$(".fixed-table-body").mCustomScrollbar({mouseWheelPixels:300});	
	});
	$("#controldept_contact").on('post-body.bs.table', function (row,obj) {
		$(".fixed-table-body").mCustomScrollbar({mouseWheelPixels:300});	
	});
});
//图片缩放自动计算
function AutoResizeImage(maxWidth,maxHeight,objImg){
	var img = new Image();
	img.src = objImg.src;
	var hRatio;
	var wRatio;
	var w = img.width;
	var h = img.height;
	var wRatio= this.innerWidth;
	var hRatio= img.height*(this.innerWidth/w);
	objImg.height = hRatio;
	objImg.width = wRatio;
}
//页面调整大小自动缩放图片
window.onresize = function(){  
	AutoResizeImage($(window).width(),0,$("#jgt")[0]);
	$('#leader_contact').bootstrapTable('resetView');
	$('#controldept_contact').bootstrapTable('resetView');
}
//加载表格数据
function loadTableData(){
	$('#controldept_contact').bootstrapTable({
		url:"/agsupport/yj-controldept-contact!listJson.action",
		toggle:"table",
		height:$(window).height()-50,
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
	    ]
	});
	$('#leader_contact').bootstrapTable({
	  	toggle:"table",
	  	url:"/agsupport/yj-leader-contact!listJson.action",
	  	height:$(window).height()-50,
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
	    ]
	});
}
//构造表格操作按钮
function format_cc_button(value, row, index) {
	return "<button class='btn btn-primary' onclick='editCC("+row.id+")'>修改</button>";
}
//构造表格操作按钮
function format_lc_button(value, row, index) {
	return "<button class='btn btn-primary' onclick='editLC("+row.id+")'>修改</button>";
}
function reloadDataCC(){
	$.ajax({  
	    url: '/agsupport/yj-controldept-contact!listJson.action',
	    data: {"name" : $("#CCname").val()},
	    type: "POST",
	    dataType: "json",
	    success: function(data) {
	    	$("#controldept_contact").bootstrapTable('removeAll');
	    	$("#controldept_contact").bootstrapTable('load',data);
	    },
	    error:function(){
	    	layer.msg("删除失败");
	    }
	});
}
function reloadDataLC(){
	$.ajax({  
	    url: '/agsupport/yj-leader-contact!listJson.action',
	    data: {"name" : $("#name").val(),"unit" : $("#unit").val(),"post" : $("#post").val()},
	    type: "POST",
	    dataType: "json",
	    success: function(data) {
	    	$("#leader_contact").bootstrapTable('removeAll');
	 		$("#leader_contact").bootstrapTable('load',data);
	    },
	    error:function(){
	    	layer.msg("删除失败");
	    }
	});
	
}
//分页参数
function queryParamsCC(params) {
	return {
        pageSize:params.limit,
        pageNo:params.offset/params.limit+1,
        name:$("#CCname").val(),
	};
}
//分页参数
function queryParamsLC(params) {
	return {
        pageSize:params.limit,
        pageNo:params.offset/params.limit+1,
        name:$("#name").val(),
        unit:$("#unit").val(),
        post:$("#post").val(),
	};
}

function editCC(id){
	layer.open({
		type: 2,
		title: '指挥部通讯录-修改',
		maxmin: true, //开启最大化最小化按钮
		area: ['600px', '320px'],
		content: 'Controldept_Contact_Input.html?id='+id
	});
}

function editLC(id){
	layer.open({
		type: 2,
		title: '责任人通讯录-修改',
		maxmin: true, //开启最大化最小化按钮
		area: ['600px', '350px'],
		content: 'Leader_Contact_Input.html?id='+id
	});
}

function addCC(){
	layer.open({
		type: 2,
		title: '指挥部通讯录-新增',
		maxmin: true, //开启最大化最小化按钮
		area: ['600px', '320px'],
		content: 'Controldept_Contact_Input.html'
	});
}

function addLC(){
	layer.open({
		type: 2,
		title: '责任人通讯录-新增',
		maxmin: true, //开启最大化最小化按钮
		area: ['600px', '350px'],
		content: 'Leader_Contact_Input.html'
	});
}

function delCC(){
	var selList=$("#controldept_contact").bootstrapTable('getSelections');
 	if(selList.length==0)
 		layer.msg('请选中删除项');
 	else {
 		layer.confirm('是否删除选中项？', {
	  		btn: ['是', '否']
			}, function(index){
				var checkedIds= new Array();
			  	for (var i=0;i<selList.length;i++)
			  		checkedIds.push(selList[i].id);
		 	    $.ajax({  
				    url: '/agsupport/yj-controldept-contact!deleteMoreJson.action',  
				    traditional: true,
				    data: {"checkedIds" : checkedIds},
				    type: "POST",
				    dataType: "json",
				    success: function(data) {
				        layer.msg(data.result);
				 		reloadDataCC();
				    },
				    error:function(){
				    	layer.msg("删除失败");
				    }
				});
			}, function(index){}
		);
 	}
}
function delLC(){
	var selList=$("#leader_contact").bootstrapTable('getSelections');
 	if(selList.length==0)
 		layer.msg('请选中删除项');
 	else {
	  	layer.confirm('是否删除选中项？', {
	  		btn: ['是', '否']
			}, function(index){
				var checkedIds= new Array();
			  	for (var i=0;i<selList.length;i++)
			  		checkedIds.push(selList[i].id);
		 	    $.ajax({  
				    url: '/agsupport/yj-leader-contact!deleteMoreJson.action',  
				    traditional: true,
				    data: {"checkedIds" : checkedIds},
				    type: "POST",
				    dataType: "json",
				    success: function(data) {
				        layer.msg(data.result);
				 		reloadDataCC();
				    },
				    error:function(){
				    	layer.msg("删除失败");
				    }
				});
			}, function(index){}
		);
 	}
}