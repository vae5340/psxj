define(['jquery','layer','dateUtil','awaterui','bootstrap','bootstrapTable','bootstrapTableCN','bootstrapDatetimepicker','bootstrapDatetimepickerCN'],function($,layer,dateUtil,awaterui){
   function init(){
    $.ajax({
			method : 'GET',
			url : '/psemgy/yaTemplateCity/getAllDict',
			async : false,
			dataType : 'json',
			success : function(data) {
				DictList=data;  
				$("#alarmList_table").bootstrapTable({
					toggle:"table",
					url:"/psemgy/yaRecordCity/listJson",
					rowStyle:"rowStyle",
					cache: false, 
					pagination:true,
					striped: true,
					pageNumber:1,
					pageSize: 10,
					pageList: [10, 25, 50, 100],
					queryParams: queryParams,
					sidePagination: "server",
					columns: [{field: 'templateNo',title: '方案编号',align:'center'},
							{field: 'templateType',title: '方案分类',align:'center',formatter:format_type}, 
							{field: 'templateName',title: '方案名称',align:'center'},
							{field: 'templateGrade',title: '方案级别',align:'center',formatter:format_grade},
							{field: 'templateCreateTime',title: '编制时间',visible:false, align:'center',formatter:formatter_time}, 
							{field: 'templateCreatePerson',title: '编制人',align:'center'}, 
							{field: 'recordCreateTime',title: '发布时间',align:'center',formatter:formatter_time},
							{field: 'recordStatus',title: '状态',align:'center',formatter:formatter_status},
							{title: '查看', formatter:formatter_overView,align:'center'}],
					onLoadSuccess: function(){
            			$(".overView").click(showRecordWindow);
						$(".report").click(showBGWindow);
					}
				});
			},
			error : function() {
				layer.msg("页面加载数据失败");
			}
		});
		$("#alarmList_btn_query").click(reloadData);

		$("#alarmList_startTime").datetimepicker({
			language: 'zh-CN',
			format: 'yyyy-mm-dd',
			autoclose:true,
			minView:2,
			pickerPosition:'bottom-right'
		});
		
		$("#alarmList_endTime").datetimepicker({
			language: 'zh-CN',
			format: 'yyyy-mm-dd',
			autoclose:true,
			minView:2,
			pickerPosition:'bottom-right'
		});
		
		$("#alarmList_startTime").on("change",function(){   		      
			if($("#alarmList_endTime").val()!=""){
				$("#alarmList_startTime").attr('max','$("#alarmList_endTime").val()');
			}
		});
		
		$("#alarmList_endTime").on("change",function(){   		      
			if($("#alarmList_startTime").val()!=""){
				$("#alarmList_endTime").attr('min','$("#alarmList_startTime").val()');
			}
		});
   }
   
   //格式化预案状态
	function formatter_status(value,row,index){
		if(value==1)
			return "<font color='red'>启动中</font>";        		
		return "启动结束";
	}
	//格式化查看按钮-进入调度室
	function formatter_overView(value,row,index){
			return "<button class='btn btn-primary overView' data-id='"+row.id+"'>详情</button>";
	}

	//格式化查看报告按钮-进入报告汇总页面
	function formatter_report(value,row,index){
		return "<button class='btn btn-primary report' data-id='"+row.id+"'>详情</button>";
	}		     
	//格式化列表时间
	function formatter_time(value,row,index){
		if(value)
			return dateUtil.getLocalTime(value);
		return '';
	}
	//格式化字典字段数据-预案类型
	function format_type(value, row, index){
		for (var item in DictList["templateType"]){
			if(value==DictList["templateType"][item].itemCode)
				return DictList["templateType"][item].itemName;
		}
		return '';
	}
	//格式化字典字段数据-预案等级
	function format_grade(value, row, index){
		for (var item in DictList["templateGrade"]){
			if(value==DictList["templateGrade"][item].itemCode)
				return DictList["templateGrade"][item].itemName;
		}
		return '';
	}

	function templateGrade_formatter(value, row, index){
		if(value=='1')
			return '一级应急预案';
		else if(value=='2')
			return '二级应急预案';
		else if(value=='3')
			return '三级应急预案';	
		else  
			return '四级应急预案';
	}

	function recordStatus_formatter(value, row, index){
		if(value=='1')
			return '启动中';
		else if(value=='2')
			return '启动结束';
		else if(value=='3')
			return '未启动';	

	}
	//表格刷新查询参数
	function queryParams(params) {
		return {
			pageSize:params.limit,
			pageNo: params.offset/params.limit+1,
			
			templateGrade:$("#alarmList_templateGrade").val(),
			recordCreateTime:$("#alarmList_startTime").val(),
			recordCreateTime:$("#alarmList_endTime").val(),
			recordStatus:$("#alarmList_recordStatus").val(),
		};
	}

	function showRecordWindow(e){
		$.get("/psemgy/eims/dispatch/pages/municipal/record/recordInput.html",function(h){
			layer.open({
				type: 1,
				title: '市级应急预案详细',
				shade:0.1,
				title:"气象水文预警详细", 
				area: ['900px', '600px'],
				content: h,
				success: function(layero,index){
					require(["psemgy/eims/dispatch/pages/municipal/record/js/recordInput"],function(recordInput){
						recordInput.init($(e.target).data("id"),0,index);
					})
				}
			}); 
		});
	}

	//字典列表数据
	var DictList=null;
	//进入实时市级调度室
	function showNowTabWindow(id){
		var url="/psemgy/eims/dispatch/pages/municipal/supervise/supervise.html?id="+id;
		awaterui.createNewtab(url,"市级调度");	
	}
	//进入历史市级调度室
	function showHistoryTabWindow(id){
		var url="/psemgy/eims/dispatch/pages/municipal/supervise/superviseReview.html?id="+id;
		awaterui.createNewtab(url,"历史市级调度");	
	}
	//进入市级汇总报告
	function showBGWindow(e){
		var url="/psemgy/eims/dispatch/pages/municipal/reportList.html?id="+$(e.target).data("id");
		awaterui.createNewtab(url,"市级应急报告"); 	
	}
	//重新加载表格数据
	function reloadData(){
		var query=new Object();
		query.templateGrade=encodeURIComponent($("#alarmList_templateGrade").val());
		
		if($("#alarmList_startTime").val()!="")
			query.startTime=dateUtil.getTimeLong($("#alarmList_startTime").val());
		if($("#alarmList_endTime").val()!="")
			query.endTime=dateUtil.getTimeLong($("#alarmList_endTime").val());
			
		query.recordStatus=encodeURIComponent($("#alarmList_recordStatus").val());
		
		$("#alarmList_table").bootstrapTable('refresh', {url:'/psemgy/yaRecordCity/listJson',query:query});
	}
	//关闭弹出tab页面
	function closeLayer(index){
		layer.close(index);
		reloadData();
	}

	return{
		init: init
	}
});
