$(function(){
			    //2.初始化Table
		        var oTable = new TableInit();
		        oTable.Init();
				//3.初始化Button的点击事件
		        var oButtonInit = new ButtonInit();
		        oButtonInit.Init();
				
	    			$("#sendTime").datetimepicker({
			        	language: 'zh-CN',
		    			format: 'yyyy-mm-dd',
		    			minView:'month',
		    			autoclose:true,
		    			pickerPosition:'bottom-right'
	    			});
		    		$("#endTime").datetimepicker({
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
			$("#table").bootstrapTable({
					toggle : "table",
					url: "/agsupport/yj-sms-record!listJson.action",
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
					columns: [{visible:true,checkbox:true},
						{field: 'id',title: '序号',visible: false,align:'center'},
						{field: 'smsId',title: '短信编号',visible: false,align:'center'},
						{field: 'sendUnit',title: '发布单位',align:'center'},
					    {field: 'receiveUnit',title: '发布单位编号',visible: false,align:'center'}, 
						{field: 'sendPerson',title: '发送人员',visible: false,align:'center'},
						{field: 'remark',title: '发送内容',align:'center'},
						{field: 'sendStatus',title: '发送状态',align:'center',formatter:format_status},
						{field: 'sendTime',title: '发送时间',align:'center',formatter:format_date},
						{field: 'remark',title: '备注',visible: false,align:'center'},
						{visible: true,title: '操作',width:100,align:'center',formatter:message}]
			});	
		};
		 //得到查询的参数
	      oTableInit.queryParams = function (params) {
	            var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
	                pageSize:params.limit,
			        pageNo: params.offset/params.limit+1,
					sendStatus:$("#sendStatus").val(),
					sendTime:$("#sendTime").val(),
					endTime:$("#endTime").val(),
	            };
	            return temp;
	        };
	        return oTableInit;
	    };
		var ButtonInit = function () {
			var oInit = new Object();
			var postdata = {};

			oInit.Init = function () {
				//初始化页面上面的按钮事件
				searchBtn();
			};
			return oInit;
		};
		
		// 短信发布
		function addSmsWindow(){
			layer.open({
				type: 2,
			  	title: '新增短信发送',
			  	maxmin: true, //开启最大化最小化按钮
			  	//shadeClose: true,
			  	//shade: 0.1,
			  	area: ['800px', '400px'],
			  	content: 'DistictSmsInput.html'
			}); 
		}
		// 分页参数，和查询条件
		 function queryParams(params) {
	       	return {
		        pageSize:params.limit,
		        pageNo: params.offset/params.limit+1
	        };
		}
		//格式化日期
		function format_date(value, row, index){
			if(value)
				return getLocalTime(value.time);
			return '';
		}
		//格式化状态
		function format_status(value,row,index){
			if(value===1) return '<font color="#0000C6">未发送</font>';
			if(value===2) return '<font color="#00A600">发送成功</font>';
			if(value===3) return '<font color="#EA0000">发送失败</font>';
			else
				return '';
		}
		// 操作
		function message(value,row,index){
			return "<button id=\"btn_edit\" type=\"button\" class=\"btn btn-primary\" style=\"border:1px solid transparent;\" onclick=\"detailDialog("+row.id+")\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>详细</button>";
		}
		function detailDialog(id){
			layer.open({
					type: 2,
					title: '短信调度详细',
					maxmin: true, //开启最大化最小化按钮
					area: ['800px', '400px'],
				    content: 'DistictSmsDetail.html?id='+id
			});
		} 
		//刷新 
		function refreshTable(){
			$("#table").bootstrapTable('refresh');
		}
		//搜索 
		function searchBtn(){
			$("#btn_query").on('click',function(){
	        	   refreshTable();
			});
		}
		
		/**
		function reloadData(){
			var query=new Object();
			if($("#sendStatus").val()!="")
				query.sendStatus=$("#sendStatus").val();
			if($("#sendTime").val()!="")
				query.sendTime=$("#sendTime").val();
			$("#table").bootstrapTable('refresh', {url: '/agsupport/yj-sms-record!listJson.action',query:query});
     	}
		
		function doDelete(){
		    var selList=$("#table").bootstrapTable('getSelections');
		    if(selList.length==0)
		    	parent.layer.msg('请选中删除项');
		    else {
		    	parent.layer.confirm('是否删除选中数据？', {btn: ['确认','取消'] //按钮
				}, function(){
					var checkedIds= new Array();
				   	for (var i=0;i<selList.length;i++){
				   		checkedIds.push(selList[i].id);
				   	}
			        $.ajax({  
					    url : '/agsupport/yj-sms-record!doDeleteMore.action',
						traditional: true,
					    data: {"checkedIds" : checkedIds},
					    type: "POST",
					    dataType: "json",
					    success: function(data) {
					        parent.layer.msg(data.result);
					    	refreshTable();
					    }
					});
				}, function(){
					
				});
		   	}
	}
		*/