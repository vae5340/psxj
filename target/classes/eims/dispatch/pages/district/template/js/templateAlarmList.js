define(['jquery','awaterui','layer','bootstrapTable','mousewheel','customScrollbar'],function($,awaterui,layer){
	function init(yaId,index){
		yaCityId=yaId;
		layerIndex=index;
		$("#startYABtn").click(startYA);
		$("#cancelYABtn").click(cancel);
		$("#tableDistrict").bootstrapTable({
			toggle:"table",
			height:300,
			url:"/psemgy/yaTemplateDistrict/listDistrictJson",
			rowStyle:"rowStyle",
			cache: false, 
			striped: true,
			checkboxHeader:false,
			singleSelect:true,
			clickToSelect:true,
			sidePagination: "server",
			columns: [
				{visible:true,checkbox:true},
				{field:'templateNo',visible: true,title: '预案编号',width:"15%"},
				{field:'templateName',visible: true,title: '预案名称'},
				{field:'templateGrade',visible: true,title: '预案级别',formatter:format_grade},
				{field:'templateType',visible: true,title: '预案类型',formatter:format_type},
				{field:'templateContent',visible: true,title: '预案内容'},
				{field:'templateCreatePerson',visible: true,title: '编制人'}
			],
			onLoadSuccess: function(){
				$(".fixed-table-body").mCustomScrollbar({mouseWheelPixels:600});
			}
		});
		/*$("#tableDistrict").on('post-body.bs.table', function (row,obj) {
			$(".fixed-table-body").mCustomScrollbar({mouseWheelPixels:600});
		});*/
	}
	var yaCityId;
	var layerIndex;
	//存放字典变量
	var DictList=null;

	function format_grade(value, row, index){
		if(DictList){
			for (var item in DictList["templateGrade"]){
				if(value==DictList["templateGrade"][item].itemCode)
					return DictList["templateGrade"][item].itemName;
			}
			return '';
		} else {
			$.ajax({
				method : 'GET',
				url : '/psemgy/yaTemplateDistrict/getAllDict',
				async : false,
				dataType : 'json',
				success : function(data) {
					DictList=data;	
				},
				error : function() {
					layer.msg('数据加载失败');
				}
			});
			for (var item in DictList["templateGrade"]){
				if(value==DictList["templateGrade"][item].itemCode)
					return DictList["templateGrade"][item].itemName;
			}
			return '';
		}
	}

	function format_type(value, row, index){
		if(DictList){
			for (var item in DictList["templateType"]){
				if(value==DictList["templateType"][item].itemCode)
					return DictList["templateType"][item].itemName;
			}
			return '';
		} else {
			$.ajax({
				method : 'GET',
				url : '/psemgy/yaTemplateDistrict/getAllDict',
				async : false,
				dataType : 'json',
				success : function(data) {
					DictList=data;	
				},
				error : function() {
					layer.msg('数据加载失败');
				}
			});
			for (var item in DictList["templateType"]){
				if(value==DictList["templateType"][item].itemCode)
					return DictList["templateType"][item].itemName;
			}
			return '';
		}
	}

	function startYA(){
		var selectObj=$('#tableDistrict').bootstrapTable('getSelections');
		if(selectObj.length==0){
			layer.msg('请先选中预案模板');
		} else {
			awaterui.createNewtab("/psemgy/eims/dispatch/pages/district/record/recordAlarmInput.html","成员单位应急预案-启动预案",function(){
				require(["psemgy/eims/dispatch/pages/district/record/js/recordAlarmInput"],function(recordAlarmInput){
					// template_id='+selectObj[0].id+"&districtUnitId="+ selectObj[0].districtUnitId+"&yaCityId="+yaCityId,
					 recordAlarmInput.init(selectObj[0].id,null,null, selectObj[0].districtUnitId,yaCityId)
				 });
				 layer.close(layerIndex);
			}); 							
		}				
	}	 
		
	function cancel(){
		layer.close(layerIndex);
	}

	return{
		init: init
	}
});
