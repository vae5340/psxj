define(['jquery','layer','dateUtil','bootstrap','bootstrapTable','bootstrapTableCN','bootstrapDatetimepicker','bootstrapDatetimepickerCN','dateUtil'],function($,layer,dateUtil,bootstrap,bootstrapTable,bootstrapTableCN,bootstrapDatetimepicker,bootstrapDatetimepickerCN,dateUtil){

	var layerIndex; 
	function reloadData(){
		var query=new Object();
		if($("#templateList #templateNo").val()!="")
			query.templateNo=$("#templateList #templateNo").val();
		if($("#templateList #templateName").val()!="")
			query.templateName=$("#templateList #templateName").val();
		$("#templateList #templateListTable").bootstrapTable('refresh', {url:'/psemgy/yaTemplateCity/listJson',query:query});
	}
				
	function closeLayer(){
		layer.close(layerIndex);
		reloadData();
	}

	function addBtnCol(value, row, index){
		return "<button id='btn_edit' type='button' class='btn btn-primary itemDetailBtn' data-id='"+row.id+"' style='border:1px solid transparent;' ><span class='glyphicon' aria-hidden='true'></span>详细</button>";//onclick='detailDialog("+row.id+")'
	}

	//存放字典变量
	var DictList=null;

	function format_grade(value, row, index){
		for (var item in DictList["templateGrade"]){
			if(value==DictList["templateGrade"][item].itemCode)
				return DictList["templateGrade"][item].itemName;
		}
		return '';
	}
	function format_type(value, row, index){
		for (var item in DictList["templateType"]){
			if(value==DictList["templateType"][item].itemCode)
				return DictList["templateType"][item].itemName;
		}
		return '';
	}
	function format_date(value, row, index){
		if(value)	
			return dateUtil.getLocalTime(value.time);
		return '';
	}

	function delData(){		    
	 	var selList=$("#templateList #templateListTable").bootstrapTable('getSelections');
	 	if(selList.length==0)
	 		layer.msg('请选中删除项', {icon: 0,time: 1000});
	 	else {
	 		layer.confirm('是否删除选中数据？', {btn: ['确认','取消'] //按钮
			}, function(){
				var checkedIds= new Array();
		   	for (var i=0;i<selList.length;i++)
		   		checkedIds.push(selList[i].id);
	  	    $.ajax({
				    url: '/psemgy/yaTemplateCity/deleteMoreJson',
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

	function addData(){
		$.get("/psemgy/eims/facility/municipalTemplate/templateInput.html",function(h){
	  	layerIndex=layer.open({
		    type: 1, 
		    content: h,
		    title:'新增市级调度预案',
				area: ['900px', '600px'],
		    maxmin: true, 
		  });
		  require(['psemgy/eims/facility/municipalTemplate/js/templateInput'],function(templateInput){
		    templateInput.init("",layerIndex);
		  });
		});  

  	// layer.open({
		// 	type: 2,
		// 	title: '新增市级调度预案',
		// 	maxmin: true, //开启最大化最小化按钮
		// 	area: ['900px', '600px'],
	 //    content: 'templateInput.html'
		// });
	}

	function detailDialog(e){
		$.get("/psemgy/eims/facility/municipalTemplate/templateInput.html",function(h){
	  	layer.open({
		    type: 1, 
		    content: h,
		    title:'市级调度预案详细',
			area: ['900px', '600px'],
			maxmin: true, 
			success: function(layero,index){
				require(['psemgy/eims/facility/municipalTemplate/js/templateInput'],function(templateInput){
					templateInput.init($(e.target).data('id'),index);
				});
			}
		  });
		});  
		// layer.open({
		// 	type: 2,
		// 	title: '市级调度预案详细',
		// 	maxmin: true, //开启最大化最小化按钮
		// 	area: ['900px', '600px'],
	 //    content: 'templateInput.html?id='+id
		// });

	}    	

	function queryParams(params) {
		return {
			pageSize:params.limit,
			pageNo: params.offset/params.limit+1
		};
	}
	function initBtn(){
		$('#templateList #btn_query').click(reloadData);
		$('#templateList #btn_add').click(addData);
		$('#templateList #btn_delete').click(delData);
	}
	function init(){ 
		initBtn();
		$.ajax({
			method : 'GET',
			url : '/agsupport/sz-facilities!getSum.action',
			async : false,
			dataType : 'json',
			success : function(data) {
			   var t=data.table;
			},
			error : function() {
				layer.msg('数据加载失败', {icon: 2,time: 1000});
			}
		});
		       
		     
		$.ajax({
			method : 'GET',
			url : '/psemgy/yaTemplateCity/getAllDict',
			async : false,
			dataType : 'json',
			success : function(data) {
				DictList=data;
				$("#templateList #templateListTable").bootstrapTable({
					toggle:"table",
					url:"/psemgy/yaTemplateCity/listJson",
					rowStyle:"rowStyle",
					cache: false,
					pagination:true,
					striped: true,
					pageNumber:1,
				    pageSize: 10,
					pageList: [10, 25, 50, 100],
					queryParams: queryParams,
					sidePagination: "server",
					columns: [
						{visible:true,checkbox:true},
						{field:'templateNo',visible: true,title: '预案编号',width:"15%",align:'center'},
						{field:'templateName',visible: true,title: '预案名称',align:'center'},
						{field:'templateGrade',visible: true,title: '预案级别',align:'center',formatter:format_grade},
						{field:'templateType',visible: true,title: '预案类型',align:'center',formatter:format_type},
						{field:'templateCreateTime',visible: true,title: '创建时间',align:'center',formatter:format_date},
						{field:'templateCreatePerson',visible: true,title: '编制人',align:'center'},
						{visible: true,title: '操作',width:100,align:'center',formatter:addBtnCol}
					],
					onLoadSuccess:function(){
						$('#templateList .itemDetailBtn').click(detailDialog);
					}
				});
			},
			error : function() {
				layer.msg('数据加载失败', {icon: 2,time: 1000});
			}
		});
	};


	return{
	    init:init,
		reloadData:reloadData,
		closeLayer:closeLayer
	}
})
		    		    
