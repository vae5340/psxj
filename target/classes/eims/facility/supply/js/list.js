define(['jquery','layer','dateUtil','bootstrap','bootstrapTable','bootstrapTableCN','bootstrapDatetimepicker','bootstrapDatetimepickerCN'],function($,layer,dateUtil,bootstrap,bootstrapTable,bootstrapTableCN,bootstrapDatetimepicker,bootstrapDatetimepickerCN){
	var name,ownerdept,address,layerIndex;

	// var name=getQueryStr("name");
	// var ownerdept=getQueryStr("ownerdept");
	// var address=getQueryStr("address");

	function queryParams(params) {
		return {
			name:encodeURIComponent(name),
			ownerdept:encodeURIComponent(ownerdept),
			address:encodeURIComponent(address),
			pageSize:params.limit,
			pageNo: params.offset/params.limit+1
		};
	}


	function editBtn(value, row, index){
		return "<button type='button' class='btn btn-primary itemDetailBtn' style='border:1px solid transparent;' data-id='"+row.id+"'><span class='glyphicon' aria-hidden='true'></span>修改</button>";//onclick='editDialog("+row.id+")'
	}
	function addData(){
		$.get("/psemgy/eims/facility/supply/supplyInput.html",function(h){
			layer.open({
				type: 1, 
				content: h,
				title:'修改应急物资',
				area: ['770px', '400px'],
				success: function(layero,index){
					require(['psemgy/eims/facility/supply/js/supplyInput'],function(supplyInput){
						supplyInput.init('',index);
					});
				},
				end: function(){
					$("#supplyList #supplyTable").bootstrapTable("refresh");
				}
			});
		});  
		// layer.open({
		// 	type: 2,
		// 	area: ['770px', '400px'],
		// 	title : "新增应急物资",	
		// 	content: ['/psemgy/eims/facility/supply/supplyInput.html', 'yes']
		// });
	}
	function editDialog(e){
		$.get("/psemgy/eims/facility/supply/supplyInput.html",function(h){
			layer.open({
				type: 1, 
				content: h,
				title:'修改应急物资',
				area: ['770px', '400px'],
				success: function(layero,index){
					require(['psemgy/eims/facility/supply/js/supplyInput'],function(supplyInput){
						supplyInput.init($(e.target).data('id'),index);
					});
				},
				end: function(){
					$("#supplyList #supplyTable").bootstrapTable("refresh");
				}
			});		 
		});  
		// layer.open({
		// 	type: 2,
		// 	area: ['770px', '400px'],
		// 	title : "修改应急物资",
		// 	offset: ['100px', '350px'],
		// 	content: ['/psemgy/eims/facility/supply/supplyInput.html?id='+id, 'yes']
		// });
	}

	function delData(){
		var selList=$("#supplyList #supplyTable").bootstrapTable('getSelections');
		if(selList.length==0)
			layer.msg('请选中删除项', {icon:0,time: 1000});
		else {
	  	layer.confirm('是否删除选中数据？', {btn: ['确认','取消'] //按钮
	  }, function(){
	  	var checkedIds= new Array();
	  	for (var i=0;i<selList.length;i++){
	  		checkedIds.push(selList[i].id);
	  	}
	  	$.ajax({  
	  		url : '/psemgy/yjGood/delJson',
	  		traditional: true,
	  		data: {"checkedIds" : checkedIds},
	  		type: "POST",
	  		dataType: "json",
	  		success: function(data) {
	  			layer.msg(data.result);
	  			reloadData();
	  		}
	  	});
	  }, function(){

	  });
	  }
	}
	function closeLayer(){
		layer.close(layerIndex);
		reloadData();
	}
	function reloadData(){
		$.ajax({  
			url: '/psemgy/yjGood/listJson',
			data: {"name" :encodeURIComponent(name),"ownerdept" : encodeURIComponent(ownerdept),"address" : encodeURIComponent(address)},
			type: "POST",
			dataType: "json",
			success: function(data) {
				$("#supplyList #supplyTable").bootstrapTable('removeAll');
				$("#supplyList #supplyTable").bootstrapTable('load',data);
			},
			error:function(){
				layer.msg("删除失败！", {icon: 2,time: 1000});
			}
		});
	}


	function initBtn(){
		$("#supplyList #supplyAddBtn").click(addData);
		$("#supplyList #supplyDeleteBtn").click(delData);
	}

	function initData(){	
		$("#supplyList #supplyTable").bootstrapTable({
			url:'/psemgy/yjGood/listJson',
			toolbar: '#supplyList #toolbar',
			cache: false, 
			//search:true,
			//showRefresh:true,
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
			//{field:'id',visible: true,title: '序号',align:'center'},
			{field:'name',visible: true,title: '名称',width:"15%",align:'center'},
			{field:'code',visible: true,title: '编号',align:'center'},
			{field:'model',visible: true,title: '物资型号',align:'center'},
			{field:'amount',visible: true,title: '数量',align:'center'},
			{field:'address',visible: true,title: '存放地址',align:'center'},
			{field:'ownerdept',visible: true,title: '权属单位',align:'center'},
			{visible: true,title: '操作',width:100,align:'center',formatter:editBtn}],
			onLoadSuccess:function(){
				$('#supplyList .itemDetailBtn').click(editDialog);
			}
		});
	}
	function init(_name,_ownerdept,_address) {
		name=(_name&&_name!='')?_name:'';
		ownerdept=(_ownerdept&&_ownerdept!='')?_ownerdept:'';
		address=(_address&&_address!='')?_address:'';
		initBtn();
		initData();
	};

	return{
	   init:init
	}
});
