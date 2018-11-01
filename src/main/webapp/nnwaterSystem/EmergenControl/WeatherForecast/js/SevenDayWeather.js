		$(function(){
			    //2.初始化Table
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
	 });
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
						{visible: true,title: '操作',width:100,align:'center',formatter:messageSeven}]
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
				return getLocalTime(value.time);
			return '';
		}
		// 操作
		function messageSeven(value,row,index){
			return "<button id=\"btn_edit\" type=\"button\" class=\"btn btn-primary\" style=\"border:1px solid transparent;\" onclick=\"detailSeven("+row.id+")\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>详细</button>";
		}
		function detailSeven(id){
			layer.open({
					type: 2,
					title: '短时预报详细',
					maxmin: true, //开启最大化最小化按钮
					area: ['1000px', '480px'],
				    content: 'SevenDayWeatherInput.html?id='+id
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
