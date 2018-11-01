define(['jquery','awaterui','dateUtil','bootstrapTable','bootstrapTableCN','bootstrapDatetimepicker','bootstrapDatetimepickerCN'],function($,awaterui,dateUtil){
	function init(){
		$.ajax({
			method : 'GET',
			url : '/psemgy/yaTemplateCity/getAllDict',
			async : false,
			dataType : 'json',
			success : function(data) {
				DictList=data;  
				$("#municipalRecordList #muniRecordTable").bootstrapTable({
					toggle:"table",
					url:"/psemgy/yaRecordCity/listJson.",
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
							{field: 'templateCreateTime',title: '编制时间',visible:false,align:'center',formatter:formatter_time}, 
							{field: 'templateCreatePerson',title: '编制人',align:'center'}, 
							{field: 'recordCreateTime',title: '发布时间',align:'center',formatter:formatter_time},
							{field: 'recordStatus',title: '状态',align:'center',formatter:formatter_status},
							{title: '查看', formatter:formatter_overView,align:'center'},
							{title: '查看报告',formatter:formatter_report,align:'center'}],
					onLoadSuccess: function(){
						$(".nowOverview").click(showNowTabWindow);
						$(".hisOverview").click(showHistoryTabWindow);
						$(".report").click(showBGWindow);
					}
				});
			},
			error : function() {
				layer.msg("页面加载数据失败");
			}
		});

		$("#municipalRecordList #btn_query").click(reloadData);
		
		$("#municipalRecordList #startTime").datetimepicker({
			language: 'zh-CN',
			format: 'yyyy-mm-dd',
			autoclose:true,
			minView:2,
			pickerPosition:'bottom-right'
		});
		
		$("#municipalRecordList #endTime").datetimepicker({
			language: 'zh-CN',
			format: 'yyyy-mm-dd',
			autoclose:true,
			minView:2,
			pickerPosition:'bottom-right'
		});
		
		$("#municipalRecordList #startTime").on("change",function(){   		      
			if($("#municipalRecordList #endTime").val()!=""){
				$("#municipalRecordList #startTime").attr('max','$("#municipalRecordList #endTime").val()');
			}
		});
		
		$("#municipalRecordList #endTime").on("change",function(){   		      
			if($("#municipalRecordList #startTime").val()!=""){
				$("#municipalRecordList #endTime").attr('min','$("#municipalRecordList #startTime").val()');
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
		if(row.recordStatus==1)
			return "<button class='btn btn-primary nowOverview' data-id='"+row.id+"'>详情</button>";
		else
			return "<button class='btn btn-primary hisOverview' data-id='"+row.id+"'>详情</button>";
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
	//表格刷新查询参数
	function queryParams(params) {
		return {
			pageSize:params.limit,
			pageNo: params.offset/params.limit+1
		};
	}
	//字典列表数据
	var DictList=null;
	//进入实时市级调度室
	function showNowTabWindow(e){
		var id=$(e.target).data("id");
		var url="/psemgy/eims/dispatch/pages/municipal/supervise/supervise.html";
		awaterui.createNewtab(url,"市级调度",function(){
			require(["psemgy/eims/dispatch/pages/municipal/supervise/js/supervise"],function(supervise){
				supervise.init(id);
			});	
		});			
	}
	//进入历史市级调度室
	function showHistoryTabWindow(e){
		var id=$(e.target).data("id");
		var url="/psemgy/eims/dispatch/pages/municipal/supervise/superviseReview.html";
		awaterui.createNewtab(url,"历史市级调度",function(){
			require(["psemgy/eims/dispatch/pages/municipal/supervise/js/superviseReview"],function(superviseReview){
				superviseReview.init(id);
			});	
		});
	}
	//进入市级汇总报告
	function showBGWindow(e){
		var id=$(e.target).data("id");
		var url="/psemgy/eims/dispatch/pages/municipal/reportList.html";
		awaterui.createNewtab(url,"市级应急报告",function(){
			require(["psemgy/eims/dispatch/pages/municipal/js/reportList"],function(reportList){
				reportList.init(id);
			});		
		}); 
	}
	//重新加载表格数据
	function reloadData(){
		var query=new Object();
		if($("#municipalRecordList #startTime").val())
			query.startTime=dateUtil.getTimeLong($("#municipalRecordList #startTime").val());
		if($("#municipalRecordList #endTime").val())
			query.endTime=dateUtil.getTimeLong($("#municipalRecordList #endTime").val());
		if($("#municipalRecordList #recordStatus").val())
			query.recordStatus=$("#municipalRecordList #recordStatus").val();
		$("#municipalRecordList #muniRecordTable").bootstrapTable('refresh', {url: '/psemgy/yaRecordCity/listJson',query:query});
	}

	return{
		init: init
	}
});
