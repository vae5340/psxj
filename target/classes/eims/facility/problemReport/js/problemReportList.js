define(['jquery','layer','dateUtil','bootstrap','bootstrapTable','bootstrapTableCN','bootstrapDatetimepicker','bootstrapDatetimepickerCN'],function($,layer,dateUtil,bootstrap,bootstrapTable,bootstrapTableCN,bootstrapDatetimepicker,bootstrapDatetimepickerCN){
var layerIndex;


	function format_status(value, row, index){
		if(value == 0){
			return '<span style="color:red">未处理</span>'
		}else if(value == 1){
			return '<span style="color:green">已处理</span>'
		}
	}

	function formatter_action(action){
		switch(action){
			case 0:
			return "<span style='color:red'>未知</span>";
			case 1:
			return "<span style='color:#c0392b'>增援</span>";
			case 2:
			return "<span style='color:#27ae60'>撤防</span>";
			case 3:
			return "<span style='color:#9b59b6'>布防</span>";
			case 4:
			return "<span style='color:#d35400'>一般情况上报</span>";
		}
		return "<span style='color:red'>未知</span>";
	}

	function formatter_deal(value, row, index){
		if(row.problemStatus == 0){
			return "<button type='button' class='btn btn-primary itemDealBtn'  data-id='"+row.id+"'>处理</button>";//onclick='dealDialog("+row.id+")'
		}else{
			return "";
		}
	}

	function addBtnCol(value, row, index){
		return "<button type='button' class='btn btn-primary itemDetailBtn' style='border:1px solid transparent;' data-id='"+row.id+"'><span class='glyphicon' aria-hidden='true'></span>详细</button>";//onclick='detailDialog("+row.id+")'
	}


	function reloadData(){
		var query=new Object();
		if($("#problemReportList #problemReportListProblemName").val())
			query.problemName=$("#problemReportList #problemReportListProblemName").val();
		if($("#problemReportList #problemStatus").val())
			query.problemStatus=$("#problemReportList #problemStatus").val();
		if($("#problemReportList #startTime").val())
			query.startTime = dateUtil.getTimeLong($("#problemReportList #startTime").val());
		if($("#problemReportList #endTime").val())
			query.endTime = dateUtil.getTimeLong($("#problemReportList #endTime").val());
		$("#problemReportList #problemReportListTable").bootstrapTable('refresh', {url: '/psemgy/yjProblemReport/listJson',query:query});
	}


	function addData(){
		$.get("/psemgy/eims/facility/problemReport/problemReportInput.html",function(h){
	  	layerIndex=layer.open({
		    type: 1, 
		    content: h,
		    title:'新增应急问题上报记录',
		    area: ['900px', '550px'], 
		    maxmin: true	    
		  });
		  require(['psemgy/eims/facility/problemReport/js/problemReportInput'],function(problemReportInput){
		    problemReportInput.init("","",layerIndex);
		  });
		});  
		// layer.open({
		// 	type: 2,
		// 	title: '新增应急问题上报记录',
		// 	maxmin: true, 
		// 	area: ['900px', '550px'],
		// 	content: 'problemReportInput.html'
		// });
	}

	function closeLayer(layerIndex){
		layer.close();
		reloadData();
	}

	function delData(){		    
		var selList=$("#problemReportList #problemReportListTable").bootstrapTable('getSelections');
		if(selList.length==0)
			layer.msg('请选中删除项', {icon: 0,time: 1000});
		else{
			var checkedIds= new Array();
			for (var i=0;i<selList.length;i++){
				checkedIds.push(selList[i].id);
			}
			$.ajax({  
				url: '/psemgy/yjProblemReport/deleteMoreJson',
				traditional: true,
				data: {"checkedIds" : checkedIds},
				type: "POST",
				dataType: "json",
				success: function(data) {
		        //alert(data.status);
		        layer.msg(data.result);
		        reloadData();
		      }
		    });
		}
	}	    

	function detailDialog(e){
		// layer.open({
		// 	type: 2,
		// 	title: '应急问题详细',
		// 	maxmin: true, 
		// 	area: ['900px', '550px'],
		// 	content: 'problemReportInput.html?id='+id
		// });
		$.get("/psemgy/eims/facility/problemReport/problemReportInput.html",function(h){
	  	layerIndex=layer.open({
		    type: 1, 
		    content: h,
		    title:'应急问题详细',
			area: ['900px', '550px'],
		    maxmin: true, 
		  });
		  require(['psemgy/eims/facility/problemReport/js/problemReportInput'],function(problemReportInput){
		    problemReportInput.init($(e.target).data('id'),'',layerIndex);
		  });
		});  
	}
	var deal_layer;
	function dealDialog(e){
		// deal_layer = layer.open({
		// 	type: 2,
		// 	title: '问题处理',
		// 	maxmin: true, 
		// 	area: ['600px', '500px'],
		// 	content: 'problemReportDeal.html?id='+id
		// });	
		$.get("/psemgy/eims/facility/problemReport/problemReportDeal.html",function(h){
	  	deal_layer=layer.open({
		    type: 1, 
		    content: h,
		    title:'问题处理',
			area: ['600px', '350px'],
			maxmin: true, 
			end: function(){
				$("#problemReportList #problemReportListTable").bootstrapTable('refresh');
			}
		  });
		  require(['psemgy/eims/facility/problemReport/js/problemReportDeal'],function(problemReportDeal){
		    problemReportDeal.init($(e.target).data('id'),deal_layer);
		  });
		});  
	}
	function format_date(value, row, index){
		if(value) return dateUtil.getLocalTime(value.time);
		return '';
	}

	function format_problemSolveTime(value, row, index){
		if(row.problemStatus == 1){
			if(value)
				return dateUtil.getLocalTime(value.time)
			return ''
		}
		return ''
	}

	function queryParams(params) {
		return {
			pageSize:params.limit,
			pageNo: params.offset/params.limit+1
		};
	}
	function initBtn(){
		$("#problemReportList #startTime").datetimepicker({
			language: 'zh-CN',
			format: 'yyyy-mm-dd',
			autoclose:true,
			minView:2,
			pickerPosition:'bottom-right'
		});
		
		$("#problemReportList #endTime").datetimepicker({
			language: 'zh-CN',
			format: 'yyyy-mm-dd',
			autoclose:true,
			minView:2,
			pickerPosition:'bottom-right'
		});
		
		$("#problemReportList #startTime").on("change",function(){   		      
			if($("#problemReportList #endTime").val()!=""){
				$("#problemReportList #startTime").attr('max','$("#problemReportList #endTime").val()');
			}
		});
		
		$("#problemReportList #endTime").on("change",function(){   		      
			if($("#problemReportList #startTime").val()!=""){
				$("#problemReportList #endTime").attr('min','$("#problemReportList #startTime").val()');
			}
		});
		$('#problemReportList #btn_add').click(addData);
		$('#problemReportList #btn_delete').click(delData);
		$('#problemReportList #btn_query').click(reloadData);
	};
	function initData(){ 
		$("#problemReportList #problemReportListTable").bootstrapTable({
			method:"post",
			contentType:"application/x-www-form-urlencoded; charset=UTF-8",
			toggle:"table",
			//height:parent.$("#problemReportList #content-main").height()-120,								
			url:"/psemgy/yjProblemReport/listJson?t=" + new Date().getTime(),
			rowStyle:"rowStyle",
			//toolbar: '#toolbar',
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
			{field:'problemName',visible: true,title: '事件名称',align:'center'},
			{field:'jsdName',visible: true,title: '积水点名称',align:'center'},
			{field:'problemAction',visible: true,title: '上报指令',align:'center',formatter:formatter_action},
			{field:'problemPerson',visible: true,title: '上报人',align:'center'},
			{field:'problemTime',visible: true,title: '上报时间',align:'center',formatter:format_date},
			{field:'problemSolveTime',visible: true,title: '处理时间',align:'center',formatter:format_problemSolveTime},
			{field:'problemSolvePerson',visible: true,title: '处理人',align:'center'},
			{field:'problemStatus',visible: true,title: '状态',align:'center',formatter:format_status},
			{visible: true,title: '操作',width:100,align:'center',formatter:addBtnCol},
			{title: '处理',width:100,align:'center',formatter:formatter_deal},
			],
			onLoadSuccess:function(){
				$('#problemReportList .itemDealBtn').click(dealDialog);
				$('#problemReportList .itemDetailBtn').click(detailDialog);
			}
		});					
	} 
	function init(){ 
		initBtn();
		initData();
	}

	return{
	  init:init,
		reloadData:reloadData
	}

})

