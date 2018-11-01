		
	$(function(){
			    //2.初始化Table
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
	    	
		});
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
				return getLocalTime(value.time);
			return '';
		}
		// 操作
		function message(value,row,index){
			return "<button id=\"btn_edit\" type=\"button\" class=\"btn btn-primary\" style=\"border:1px solid transparent;\" onclick=\"detailDialog("+row.id+")\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>详细</button>";
		}
		/**
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
		