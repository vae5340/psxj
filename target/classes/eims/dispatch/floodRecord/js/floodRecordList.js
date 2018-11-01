define(['jquery','layer','dateUtil','bootstrapTable','bootstrapTableCN','bootstrapDatetimepicker','bootstrapDatetimepickerCN'],function($,layer,dateUtil){	
	function init(){ 
		$("#floodRecordListTable").bootstrapTable({
			method:'get',
			contentType:"application/x-www-form-urlencoded; charset=UTF-8",
			toggle:"table",
			url:"/psemgy/floodRecord/listJson",
			rowStyle:"rowStyle",
			toolbar:"#floodRecordList_toolbar",
			cache: false, 
			pagination:true,
			striped: true,
			pageNumber:1,
			pageSize: 10,
			pageList: [10, 25, 50, 100],
			queryParams: queryParams,
			sidePagination: "server",
			columns: [{field: 'id',title: '序号',visible: false,align:'center'},
				{field: 'recordTitle',title: '发布标题',align:'center'},
				{field: 'recordTime',title: '发布时间',align:'center',formatter:format_time}, 
				{field: 'recordPerson',title: '发布人',visible: false,align:'center'},
				{field: 'recordSmsReceiverName',title: '短信接收人名称',align:'center'},
				{field: 'recordType',title: '发布类型',align:'center',formatter:format_recordType},
				{field: 'isRelease',title: '是否发布',align:'center',formatter:format_isRelease},
				{field: 'option',title: '详细',align:'center',formatter:format_operation}],
			onLoadSuccess: function(){
				$(".smsBtn").click(showSmsWindow);
				$(".wcBtn").click(showWCWindow);
			}
		});
		$("#floodRecordList_recordTime").datetimepicker({
			language: 'zh-CN',
			format: 'yyyy-mm-dd',
			minView:'month',
			autoclose:true,
			pickerPosition:'bottom-right'
		});
		
		//初始化Button的点击事件
		var oButtonInit = new ButtonInit();
		oButtonInit.Init();
		
	} 

	function format_operation(value,row,index){
		if(row.recordType==1)
			return "<button class='btn btn-primary smsBtn' data-id='"+row.id+"'>详情</button>";
		else
			return "<button class='btn btn-primary wcBtn' data-id='"+row.id+"'>详情</button>";
	}
		
	function format_time(value,row,index){
		if(value)
			return dateUtil.getLocalTime(value.time);
		return '';
	}	     
	
	function format_recordType(value,row,index){
		if(value==1)
			return "短信发布";
		else if (value==2)
			return "微信发布";
		else
			return "";
	}
		
	function format_isRelease(value,row,index){
		if(value==0)
			return "<font color='red'>未发布</font>";
		else if(value==1)
			return "已发布";
		else
			return "<font color='red'>未知状态</font>";
	}
		
	function queryParams(params) {
		return {
			pageSize:params.limit,
			pageNo: params.offset/params.limit+1,
			isRelease: $("#floodRecordList_isRelease").val(),
			recordTitle: $("#floodRecordList_recordTitle").val(),
			recordTime: $("#floodRecordList_recordTime").val()
		};
	}
	var DictList=null;

	function addSmsWindow(){
		parent.closeNavTab(window.location.href);
	}

	function addWCWindow(){
		$.get("/psemgy/eims/dispatch/floodRecord/floodRecordWCInput.html",function(h){
			layer.open({
				type: 1,
				title: '新增微信涝情发布',
				shadeClose: false,
				shade: 0.1,
				area: ['900px', '400px'],
				content:h,			
				success: function(layero,index){
					require(["psemgy/eims/dispatch/floodRecord/js/floodRecordWCInput"],function(floodRecordWCInput){
						floodRecordWCInput.init(id,index);
					})
				}
			});	
		
		}); 	
	}
	function showSmsWindow(e){
		var id=$(e.target).data("id");
		$.get("/psemgy/eims/dispatch/floodRecord/floodRecordSmsInputView.html",function(h){
			layer.open({
				type: 1,
				title: '涝情发布信息',
				shadeClose: false,
				shade: 0.1,
				area: ['700px', '350px'],
				content:h,			
				success: function(layero,index){
					require(["psemgy/eims/dispatch/floodRecord/js/floodRecordSmsInputView"],function(floodRecordSmsInputView){
						floodRecordSmsInputView.init(id,index);
					})
				}
			});	
		
		}); 
	}

	function showWCWindow(e){
		var id=$(e.target).data("id");
		$.get("/psemgy/eims/dispatch/floodRecord/floodRecordWCInputView.html",function(h){
			layer.open({
				type: 1,
				title: '微信涝情发布信息',
				shadeClose: false,
				shade: 0.1,
				area: ['900px', '350px'],
				content:h,			
				success: function(layero,index){
					require(["psemgy/eims/dispatch/floodRecord/js/floodRecordWCInputView"],function(floodRecordWCInputView){
						floodRecordWCInputView.init(id,index);
					})
				}
			});	
		
		}); 
	}

	var ButtonInit = function () {
			var oInit = new Object();
			var postdata = {};

			oInit.Init = function () {
				//初始化页面上面的按钮事件
				reloadData();
				$("#floodRecordList_addWCWindow").click(addWCWindow);
			};
			return oInit;
	};

	function reloadData(){
		/*var query=new Object();
		query.recordTitle=encodeURIComponent($("#recordTitle").val());
		query.recordTime=$("#recordTime").val();
		$('#table').bootstrapTable('removeAll');*/
		$("#floodRecordList_btn_query").on('click',function(){
	        refreshTable();
		});
	}
	function refreshTable(value, rows,index){
		$("#floodRecordListTable").bootstrapTable('refresh');
	}

	return{
		init: init
	}
});