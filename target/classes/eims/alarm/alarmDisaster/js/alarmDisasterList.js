define(['jquery','appFunc','dateUtil','layer','appFunc','dateUtil','bootstrap','bootstrapTable','bootstrapTableCN','bootstrapDatetimepicker','bootstrapDatetimepickerCN'],function($,appFunc,dateUtil,layer,appFunc,dateUtil,bootstrap,bootstrapTable,bootstrapTableCN,bootstrapDatetimepicker,bootstrapDatetimepickerCN){
	function init(){
		$("#alarmDisasterListTable").bootstrapTable({
			toggle:"table", 
			url:"/psemgy/meteoHydrologAlarm/disasteJson",
			rowStyle:"rowStyle",
			cache:false, 
			pagination:true, 
			striped:true, 
			// pageNumber:1,
			// pageSize:10,
			pageList:[10, 25, 50, 100],
            queryParams: queryParams,
            sidePagination:"server",
			columns:[
				{field:"alarmTitle", title:"预警标题", align:"center"},
				{field:"alarmGrade", title:"预警级别", align:"center",formatter:alarmGrade_formatter},
				{field:"alarmTime", title:"预警时间", align:"center",formatter:createDate_formatter},
				{field:"alarmStatus", title:"预警状态", align:"center",formatter:alarmStatus_formatter},
				{field:"alarmChange", title:"预警指令", align:"center",formatter:alarmChange_formatter},
				{title:"详情", align:"center",formatter:option_formatter}],
		    onLoadSuccess: function(){
				$(".alarmDisasteroption").click(detailWindow);
			}
		});  
		$("#alarmDisasterList #startTime").datetimepicker({
			language: 'zh-CN',
			format: 'yyyy-mm-dd',
			autoclose:true,
			minView:4,
			pickerPosition:'bottom-right'
		});
		$("#alarmDisasterList #endTime").datetimepicker({
			language: 'zh-CN',
			format: 'yyyy-mm-dd',
			autoclose:true,
			minView:4,
			pickerPosition:'bottom-right'
		});
		$("#alarmDisasterList #btn_query").click(reloadData);
	}

	function alarmChange_formatter(value, row, index){
		if(value==0)
			return '<span style="color:red;">气象报警启动';
		else if(value==1) 
			return '气象报警升级';
		else if(value==2)
			return '气象报警持续';	
		else  
			return '未知';
	}

	function alarmGrade_formatter(value, row, index){
		if(value=='1')
			return '红色警报';
		else if(value=='2')
			return '橙色警报';
		else if(value=='3')
			return '黄色警报';	
		else  
			return '蓝色警报';
	}

	function alarmStatus_formatter(value, row, index){
		//if(row.alarmChange>0)
		//	return '';
		if(value=='1')return '未启动';
		else if(value=='2') return '已启动';
		else return '已关闭';
	}

	function createDate_formatter(value, row, index){
		if(value){
			return dateUtil.getLocalTime(value);
		}
		return '';
	}

	function queryParams(params) {
		return {
			pageSize:params.limit, 
			pageNo:params.offset / params.limit + 1,
			alarmTitle:$("#alarmDisasterList #alarmTitle").val(),
			alarmGrade:$("#alarmDisasterList #alarmGrade").val(),
			alarmTime:$("#alarmDisasterList #startTime").val(),
			alarmTime:$("#alarmDisasterList #endTime").val(),
			alarmStatus:$("#alarmDisasterList #alarmStatus").val(),
		};
	}

	function option_formatter(value, row, index) {
		//return "<button class='btn btn-primary' onclick='detailWindow(" + row.id + ")'>详细</button>";
		return "<button class='btn btn-primary alarmDisasteroption' data-id=" + row.id + ">详细</button>";
	}

	function detailWindow(e) {
		var id = $(e.target).data("id");
		$.get("/psemgy/eims/alarm/alarmDisaster/alarmInput.html",function(h){
			layer.open({
				type: 1, 
				content: h,
				shade:0.1,
				title:"气象水文预警详细", 
				area:["700px", "600px"],
				success: function(){
					require(['psemgy/eims/alarm/alarmDisaster/js/alarmInput'],function(alarmInput){
						alarmInput.init(id);
					});
				}
			});
			
		});		
	}
	
	function reloadData(){
		var query=new Object();
		if($("#alarmDisasterList #alarmTitle").val() !=""){	
			query.alarmTitle=encodeURIComponent($("#alarmDisasterList #alarmTitle").val());
		}
		query.alarmGrade=encodeURIComponent($("#alarmDisasterList #alarmGrade").val());
		
		if($("#alarmDisasterList #startTime").val()!="")
			query.startTime=dateUtil.getTimeLong($("#alarmDisasterList #startTime").val());
		if($("#alarmDisasterList #endTime").val()!="")
			query.endTime=dateUtil.getTimeLong($("#alarmDisasterList #endTime").val());
			
		query.alarmStatus=encodeURIComponent($("#alarmDisasterList #alarmStatus").val());
		
		query.alarmSubtype=encodeURIComponent(appFunc.getQueryStr("subtype"));
		$('#alarmDisasterListTable').bootstrapTable('removeAll');
		$("#alarmDisasterListTable").bootstrapTable('refresh', {
			url: "/psemgy/meteoHydrologAlarm/disasteJson",
			query:query
		});
	}

	return{
		init: init
	}
});