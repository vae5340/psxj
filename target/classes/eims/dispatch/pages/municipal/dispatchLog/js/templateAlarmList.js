define(["jquery","layer","bootstrapTable",'mousewheel','customScrollbar'],function($,layer){
    function init(yaId,index){
		cityYaId=yaId;
		pIndex=index;

		$("#changeYABtn").click(changeYA);
		$("#changeCancelBtn").click(cancel);
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
	var cityYaId,pIndex;
	//存放字典变量
	var DictList=null;

	function format_grade(value, row, index){
		for (var item in DictList["templateGrade"]){
			if(value==DictList["templateGrade"][item].itemCode)
				return DictList["templateGrade"][item].itemName;
		}
		return "";
	}

	function format_type(value, row, index){
		for (var item in DictList["templateType"]){
			if(value==DictList["templateType"][item].itemCode)
				return DictList["templateType"][item].itemName;
		}
		return "";
	}

	function loadTable(){
		$("#tableMuni").bootstrapTable({
			toggle:"table",
			height:300,
			url:"/psemgy/yaTemplateCity/listJsonNoUse?id="+cityYaId,
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
		$("#tableMuni").on('post-body.bs.table', function (row,obj) {
			$(".fixed-table-body").mCustomScrollbar({mouseWheelPixels:600});
		});
	}

	function changeYA(){
		var selectObj=$('#tableMuni').bootstrapTable('getSelections');
		if(selectObj.length==0){
			layer.msg('请先选中预案模板');
		} else {
			layer.confirm('是否使用当前选中预案信息作为更新预案内容？', {btn: ['确认','取消'] //按钮
			}, function(){
				//新增调度日志
				//修改当前预案内容
				$.ajax({
					method : 'GET',
					url : '/psemgy/yaDispatchLog/recordReset',
					data:{templateId:selectObj[0].id,cityYaId:cityYaId},
					dataType : 'json',
					success : function(data) {
						layer.msg(data.result);
						//parent.location.reload();
						layer.close(pIndex);
					},
					error : function() {
						layer.msg("预案调整失败");
					}
				});
			}, function(){
				
			});
		}
	}

	function cancel(){
		layer.close(pIndex);
	}

	return{
		init: init
	}
});	