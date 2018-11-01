		$(function(){
			    //2.初始化Table
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
	 });
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
						{visible: true,title: '操作',width:100,align:'center',formatter:messageSix}]
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
				return getLocalTime(value.time);
			return '';
		}
		// 操作
		function messageSix(value,row,index){
			return "<button id=\"btn_edit\" type=\"button\" class=\"btn btn-primary\" style=\"border:1px solid transparent;\" onclick=\"detailSix("+row.id+")\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>详细</button>";
		}
		function detailSix(id){
			layer.open({
					type: 2,
					title: '六小时天气预报',
					maxmin: true, //开启最大化最小化按钮
					area: ['800px', '400px'],
				    content: 'SixWeatherInput.html?id='+id
			});
		} 
		//刷新 
		function refreshTableSix(){
			$("#tableSix").bootstrapTable('refresh');
		}
		function reloadDataSix(){
			refreshTableSix();
		}
