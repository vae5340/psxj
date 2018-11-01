define(['jquery','dateUtil','layer','bootstrap','bootstrapTable','bootstrapTableCN','bootstrapDatetimepicker',
'bootstrapDatetimepickerCN'],function($,dateUtil,layer){
		function init(){
	        var oTableSeven = new TableInitSeven();
	        oTableSeven.Init();
		
			$("#sendTimeSeven").datetimepicker({
				language: 'zh-CN',
				format: 'yyyy-mm-dd',
				minView:'month',
				autoclose:true,
				pickerPosition:'bottom-right'
			});
			$("#endTimeSeven").datetimepicker({
				language: 'zh-CN',
				format: 'yyyy-mm-dd',
				minView:'month',
				autoclose:true,
				pickerPosition:'bottom-right'
			});

			 var oTableSix = new TableInitSix();
		     oTableSix.Init();
		
			$("#sendTimeSix").datetimepicker({
				language: 'zh-CN',
				format: 'yyyy-mm-dd',
				minView:'month',
				autoclose:true,
				pickerPosition:'bottom-right'
			});
			$("#endTimeSix").datetimepicker({
				language: 'zh-CN',
				format: 'yyyy-mm-dd',
				minView:'month',
				autoclose:true,
				pickerPosition:'bottom-right'
			});

		    var oTable = new TableInit();
	        oTable.Init();
			
				$("#sendTimeThree").datetimepicker({
					language: 'zh-CN',
					format: 'yyyy-mm-dd',
					minView:'month',
					autoclose:true,
					pickerPosition:'bottom-right'
				});
				$("#endTimeThree").datetimepicker({
					language: 'zh-CN',
					format: 'yyyy-mm-dd',
					minView:'month',
					autoclose:true,
					pickerPosition:'bottom-right'
				});

				$("#searchSevenBtn").click(reloadDataSeven);
				$("#searchSixBtn").click(reloadDataSix);
				$("#searchThreeBtn").click(reloadDataThree);
		}

		var TableInitSeven = function () {
        oTableInit = new Object();
        //初始化Table  
        oTableInit.Init = function (){
			$("#tableSeven").bootstrapTable({
					toggle : "tableSeven",
					url: "/agsupport/ps-qx-seven-data!listJsonSeven.action",
					rowStyle:"rowStyle",
					toolbar:"#tableToolbar",
					cache: false, 
					pagination:true,
					striped: true,
					pageNumber:1,
					pageSize: 10,
					pageList: [10, 25, 50, 100],
					queryParams: oTableInit.queryParams,
					sidePagination: "server",
					columns: [{visible:false,checkbox:false},
						{field: 'id',title: '序号',visible: false,align:'center'},
						{field: 'fileName',title: '站点',visible: false,align:'center'},
						{field: 'weatherCon',title: '预报结论',align:'center'},
						{field: 'deviceTime',title: '预报时间',align:'center',formatter:format_dateseven},
						{field: 'remark',title: '备注',visible: false,align:'center'},
						{visible: true,title: '操作',width:100,align:'center',formatter:messageSeven}],
					onLoadSuccess: function(){
						$(".messageSeven").click(detailSeven);
					}
			});	
		};
		 //得到查询的参数
	      oTableInit.queryParams = function (params) {
	            var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
	                pageSize:params.limit,
			        pageNo: params.offset/params.limit+1,
					deviceTime:$("#sendTimeSeven").val(),
					endTimeSeven:$("#endTimeSeven").val(),
	            };
	            return temp;
	        };
	        return oTableInit;
	    };
		//格式化日期
		function format_dateseven(value, row, index){
			if(value)
				return dateUtil.getLocalTime(value.time);
			return '';
		}
		// 操作
		function messageSeven(value,row,index){
			return "<button type=\"button\" class=\"btn btn-primary messageSeven\" style=\"border:1px solid transparent;\" data-id="+row.id+"><span class=\"glyphicon\" aria-hidden=\"true\"></span>详细</button>";
		}
		function detailSeven(e){
			debugger;
			var id = $(e.target).data("id");
			$.get("/psemgy/eims/alarm/shortWeatherForcast/sevenDayWeatherInput.html",function(h){
				layer.open({
					type: 1, 
					content: h,
					maxmin: true, 
					title:"短时预报详细",
					area:['1000px', '480px']
				});
				$.ajax({
					method : 'GET',
					url : "/agsupport/ps-qx-seven-data!inputJsonSeven.action?id="+id,
					async : true,
					dataType : 'json',
					success : function(data) {
						$("#content").html(data.form.content);
					},
					error : function() {
						alert('加载失败');
					}
				});
			});		
		} 
		//刷新 
		function refreshTableSeven(){
			$("#tableSeven").bootstrapTable('refresh');
		}
		//搜索 
		function reloadDataSeven(){
			refreshTableSeven();
		}

		var TableInitSix = function () {
        oTableInit = new Object();
        //初始化Table  
        oTableInit.Init = function (){
			$("#tableSix").bootstrapTable({
					toggle : "tableSix",
					url: "/agsupport/ps-qx-sixdata!listSixWeather.action",
					rowStyle:"rowStyle",
					toolbar:"#tableToolbar",
					cache: false, 
					pagination:true,
					striped: true,
					pageNumber:1,
					pageSize: 10,
					pageList: [10, 25, 50, 100],
					queryParams: oTableInit.queryParams,
					sidePagination: "server",
					columns: [{visible:false,checkbox:false},
						{field: 'id',title: '序号',visible: false,align:'center'},
						{field: 'qxSite',title: '站点',align:'center'},
					    {field: 'qxWeaher',title: '天气',align:'center'}, 
						{field: 'deciceTime',title: '预报时间',align:'center',formatter:format_datesix},
						{field: 'remark',title: '备注',visible: false,align:'center'},
						{visible: true,title: '操作',width:100,align:'center',formatter:messageSix}],
					onLoadSuccess: function(){
						$(".messageSix").click(detailSix);
					}
			});	
		};
		 //得到查询的参数
	      oTableInit.queryParams = function (params) {
	            var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
	                pageSize:params.limit,
			        pageNo: params.offset/params.limit+1,
					startTime:$("#sendTimeSix").val(),
					endTime:$("#endTimeSix").val(),
	            };
	            return temp;
	        };
	        return oTableInit;
	    };
		//格式化日期
		function format_datesix(value, row, index){
			if(value)
				return dateUtil.getLocalTime(value.time);
			return '';
		}
		// 操作
		function messageSix(value,row,index){
			return "<button id=\"btn_edit\" type=\"button\" class=\"btn btn-primary messageSix\" style=\"border:1px solid transparent;\" data-id="+row.id+"><span class=\"glyphicon\" aria-hidden=\"true\"></span>详细</button>";
		}
		function detailSix(e){
			debugger;
			var id = $(e.target).data("id");
			$.get("/psemgy/eims/alarm/shortWeatherForcast/sixWeatherInput.html",function(h){
				layer.open({
					type: 1, 
					content: h,
					maxmin: true, 
					title: "六小时天气预报",
					area: ['800px', '400px']
				});
				$.ajax({
					method : 'GET',
					url : "/agsupport/ps-qx-sixdata!inputSixWeather.action?id="+id,
					async : true,
					dataType : 'json',
					success : function(data) {
						$("#content").html(data.form.content);
					},
					error : function() {
						alert('加载失败');
					}
				});
			});	
		} 
		//刷新 
		function refreshTableSix(){
			$("#tableSix").bootstrapTable('refresh');
		}
		function reloadDataSix(){
			refreshTableSix();
		}

		var TableInit = function () {
        oTableInit = new Object();
        //初始化Table
        oTableInit.Init = function (){
			$("#tableThree").bootstrapTable({
					toggle : "tableThree",
					url: "/agsupport/ps-qx-data!listThreeWeather.action",
					rowStyle:"rowStyle",
					toolbar:"#tableToolbar",
					cache: false, 
					pagination:true,
					striped: true,
					pageNumber:1,
					pageSize: 10,
					pageList: [10, 25, 50, 100],
					queryParams: oTableInit.queryParams,
					sidePagination: "server",
					columns: [{visible:false,checkbox:false},
						{field: 'id',title: '序号',visible: false,align:'center'},
						{field: 'qxHours',title: '小时',visible: false,align:'center'},
					    {field: 'qxContent',title: '气象内容',align:'center'},
					    {field: 'qxDeviceTime',title: '预报时间',align:'center',formatter:format_date},
						{field: 'qxFilename',title: '名称',visible: false,align:'center'},
						{field: 'remark',title: '备注',visible: false,align:'center'}]
			});	
		};
		 //得到查询的参数
	      oTableInit.queryParams = function (params) {
	            var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
	                pageSize:params.limit,
			        pageNo: params.offset/params.limit+1,
					qxDeviceTime : $("#sendTimeThree").val(),
					endTime:$("#endTimeThree").val(),
	            };
	            return temp;
	        };
	        return oTableInit;
	    };
		//格式化日期
		function format_date(value, row, index){
			if(value)
				return dateUtil.getLocalTime(value.time);
			return '';
		}
		/**
		 * // 操作
		function message(value,row,index){
			return "<button id=\"btn_edit\" type=\"button\" class=\"btn btn-primary message\" style=\"border:1px solid transparent;\" data-id="+row.id+"\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>详细</button>";
		}

		function detailDialog(id){
			layer.open({
					type: 2,
					title: '三小时天气预报',
					maxmin: true, //开启最大化最小化按钮
					area: ['800px', '400px'],
				    content: 'DistictSmsDetail.html?id='+id
			});
		} 
		*/
		//刷新 
		function refreshTable(){
			$("#tableThree").bootstrapTable('refresh');
		}
		//搜索 
		function reloadDataThree(){
			refreshTable();
		}

		return{
			init: init
		}
});		
		
