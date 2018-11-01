define(['jquery','layer','dateUtil','areaUtil','bootstrap','bootstrapTable','bootstrapTableCN','bootstrapDatetimepicker','bootstrapDatetimepickerCN'],function($,layer,dateUtil,areaUtil,bootstrap,bootstrapTable,bootstrapTableCN,bootstrapDatetimepicker,bootstrapDatetimepickerCN){

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
				url : '/psemgy/yaTemplateCity/getAllDict',
				async : false,
				dataType : 'json',
				success : function(data) {
					DictList=data;													
				},
				error : function() {
					layer.msg('获取数据失败', {icon: 2,time: 1000});
				}
			});
			for (var item in DictList["templateGrade"]){
				if(value==DictList["templateGrade"][item].itemCode)
					return DictList["templateGrade"][item].itemName;
			}
			return '';
		}
	}

	function format_date(value, row, index){
		if(value)
			return dateUtil.getLocalTime(value);
		return '';
	}

	function format_type(value, row, index){
		for (var item in DictList["templateType"]){
			if(value==DictList["templateType"][item].itemCode)
				return DictList["templateType"][item].itemName;
		}
		return '';
	}

	function format_district(value, row, index){
		for(var index=0;index<areaUtil.xzDistrict.length;index++){
			if(areaUtil.xzDistrict[index].code==value){
				return areaUtil.xzDistrict[index].name;
			}
		}
		return "";
	}

	function addBtnCol(value, row, index){
		return "<button id='btn_edit' type='button' class='btn btn-primary itemDetailBtn' data-id='"+row.id+"' style='border:1px solid transparent;' ><span class='glyphicon' aria-hidden='true'></span>详细</button>";//onclick='detailDialog("+row.id+")'
	}


	function delData(){
		var selList=$('#templateListCYTable').bootstrapTable('getSelections');
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
					url: '/psemgy/yaTemplateDistrict/deleteMoreJson',
					traditional: true,
					data: {"checkedIds" : checkedIds},
					type: "POST",
					dataType: "json",
					success: function(data) {
						layer.msg(data.result);
						reloadData();
					}
				});
			}, function(index){}
			);
		}
	}

	function addData(){
		$.get("/psemgy/eims/facility/districtTemplate/templateInput.html",function(h){
			layer.open({
				type: 1, 
				content: h,
				title:'新增区级调度预案',
				area: ['1000px', '600px'],
				maxmin: true, 
				success: function(layero,index){
					require(['eims/facility/districtTemplate/js/templateInput'],function(templateInput){
						templateInput.init("",null,index);
					});
				},
				end: function(){
					reloadData();
				}
			});		 
		});  

		// layer.open({
		// 	type: 2,
		// 	title: '新增区级调度预案',
		// 	maxmin: true, //开启最大化最小化按钮
		// 	area: ['1000px', '600px'],
		// 	content: 'templateIput.html'
		// });
	}


	function detailDialog(e){
		var view;
		if(isDistrictOrg)
			view = 0;
		else
			view = 1;
		$.get("/psemgy/eims/facility/districtTemplate/templateInput.html",function(h){
	  		layer.open({
				type: 1, 
				content: h,
				title:'区级调度预案详细',
				area: ['1000px', '600px'],
				maxmin: true, 
				success: function(layero,index){
					require(['eims/facility/districtTemplate/js/templateInput'],function(templateInput){
						templateInput.init($(e.target).data('id'),view,index);
					});
				}
			});		  
		});  
		// layer.open({
		// 	type: 2,
		// 	title: '区级调度预案详细',
		// 	maxmin: true, //开启最大化最小化按钮
		// 	area: ['1000px', '600px'],
		// 	content: 'templateInput.html?id='+id
		// });
	}

	function reloadData(){
		/*$.ajax({  
			url: '/psemgy/yaTemplateDistrict/listDistrictJson',
			data: {"templateNo" : $("#templateListCY #listTemplateNo").val(),"templateName":$("#templateListCY #listTemplateName").val()},
			type: "POST",
			dataType: "json",
			success: function(data) {
				$("#templateListCY #templateListCYTable").bootstrapTable('removeAll');
				$("#templateListCY #templateListCYTable").bootstrapTable('load',data);
			},
			error:function(){
				layer.msg("删除失败！", {icon: 2,time: 1000});
			}
		});*/
	
		var query=new Object();
		if($("#templateListCY #listTemplateNo").val()!="")
			query.templateNo=$("#templateListCY #listTemplateNo").val();
		if($("#templateListCY #listTemplateName").val()!="")
			query.templateName=$("#templateListCY #listTemplateName").val();
		$("#templateListCY #templateListCYTable").bootstrapTable('refresh', {url:'/psemgy/yaTemplateDistrict/listDistrictJson',query:query});
	}

	function queryParams(params) {
		return {
			pageSize:params.limit,
			pageNo: params.offset/params.limit+1
		};
	}

	function closeLayer(){
		layer.close(layerIndex);
		reloadData();
	}

	function initBtn(){
		if(isDistrictOrg){
			$('#templateListCY #btn_query').click(reloadData);
			$('#templateListCY #btn_add').click(addData);
		}else{
			$('#templateListCY #toolbar').hide();
		}
		$('#templateListCY #btn_delete').click(delData);
	}

	function initData(){
		$('#templateListCY #templateListCYTable').bootstrapTable({
			toggle:"table",
			url:"/psemgy/yaTemplateDistrict/listDistrictJson",
			rowStyle:"rowStyle",
			toolbar: '#templateListCY #toolbar',
			pagination:true,
			sortable: false,
			striped: true,
			pageNumber:1,
			pageSize: 10,
			pageList: [10, 25, 50, 100],
			cache: false,
			queryParams: queryParams,
			sidePagination: "server",
			columns: [
			{visible:true,checkbox:true},
			{field:'templateNo',visible: true,title: '预案号',align:"center"},
			{field:'templateName',visible: true,title: '预案名称',align:"center"},
			{field:'templateGrade',visible: true,formatter:format_grade,title: '预案级别',align:"center"},
			{field:'templateType',visible: true,title: '预案类型',formatter:format_type,align:"center"},
			{field:'templateContent',visible: true,title: '预案内容',halign:"center"},
			{field:'templateCreateTime',visible: true,title: '创建时间',formatter:format_date,align:"center"},
			{field:'districtUnitId',visible: true,title: '所属区域',formatter:format_district,align:"center"},
			{visible: true,title: '操作',formatter:addBtnCol,width:100,align:"center"}
			],
			onLoadSuccess:function(){
				$('#templateListCY .itemDetailBtn').click(detailDialog);
			}
		});
	}

	var isDistrictOrg = false;

	function init() {		
		$.ajax({
			url : '/agsupport/om-org!obtainUserType.action',
			async : false,
			dataType:"json",		
			success : function(data) {
				if(data.userType==2){
					isDistrictOrg = true;
				}
				initBtn();
				initData();					
			},
			error : function(e) {
				alert('error');
			}
		});	
	};

	return{
	  init:init,
	  reloadData:reloadData,
	  closeLayer:closeLayer
	}
})
		  