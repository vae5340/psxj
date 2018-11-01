define(['jquery','awaterui','layer','bootstrap','bootstrapTable','bootstrapTableCN','mousewheel','customScrollbar'],function($,awaterui,layer){
   var id,pIndex;
	
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

   function init(_id,index){
	   id = _id;
	   pIndex = index;
	   $("#cityTemplateAlarmList #startYABtn").click(startYA);
	   $("#cityTemplateAlarmList #cancelBtn").click(cancel);

		$.ajax({
			method : 'GET',
			url : '/psemgy/yaTemplateCity/getAllDict',
			async : false,
			dataType : 'json',
			success : function(data) {
				DictList=data;
				loadTable();
			},
			error : function() {
				layer.msg('获取数据失败');
			}
		});
	}

	function loadTable(){
		$("#cityTemplateAlarmList #tableMuni").bootstrapTable({
			toggle:"table",
			height:300,
			url:"/psemgy/yaTemplateCity/listJson",
			rowStyle:"rowStyle",
			toolbar: '#toolbar',
			cache: false, 
			striped: true,
			checkboxHeader:false,
			singleSelect:true,
			clickToSelect:true,
			sidePagination: "server",
			columns: [
				{visible:true,checkbox:true},
				{field:'templateNo',visible: true,title: '预案编号',width:"15%"},
				{field:'templateName',visible: true,title: '预案名称',align:'center'},
				{field:'templateGrade',visible: true,title: '预案级别',align:'center',formatter:format_grade},
				{field:'templateType',visible: true,title: '预案类型',align:'center',formatter:format_type},
				{field:'templateContent',visible: true,title: '预案内容',halign:'center'},
				{field:'templateCreatePerson',visible: true,title: '编制人',align:'center'}
			]
		});
		$("#cityTemplateAlarmList #tableMuni").on('post-body.bs.table', function (row,obj) {
			$(".fixed-table-body").mCustomScrollbar({mouseWheelPixels:600});
		});
	}

	function startYA(){
		var selectObj=$('#cityTemplateAlarmList #tableMuni').bootstrapTable('getSelections');
		if(selectObj.length==0){
			layer.msg('请先选中预案模板');
		} else {
			$.get("/psemgy/eims/dispatch/pages/municipal/record/recordAlarmInput.html",function(h){
				layer.open({
					type: 1,
					title: '启动市级应急预案-启动预案',
					shadeClose: true,
					shade: 0,
					area: ['900px', '600px'],
					content: h,
					success: function(layero,index){
						//'?template_id='+selectObj[0].id+"&meteoHydrologAlarmId="+id,
						layer.close(pIndex);
						require(["psemgy/eims/dispatch/pages/municipal/record/js/recordAlarmInput"],function(recordAlarmInput){
							recordAlarmInput.init(selectObj[0].id,id,index);
						});
					}
				});
			});			
		}
	}

	function cancel(){
		layer.close(pIndex);
	}

	return {
		init: init
	}
});