var oTableInit;
		var $table=$('#itemDimTableEvents');
		$(function () {
	        //1.初始化Table
	        var oTable = new TableInit();
	        oTable.Init();
	 
	        //2.初始化Button的点击事件
	        var oButtonInit = new ButtonInit();
	        oButtonInit.Init();
		 
			//初始化日期控件
			creatDatetimepicker();
	    });
		
		var TableInit = function () {
	        oTableInit = new Object();
	        //初始化Table
	        oTableInit.Init = function () {
	            $table.bootstrapTable({
	                url: '/agsupport/ps-data-history!getBeanList.action',         //请求后台的URL（*）
	                method: 'get',                      //请求方式（*）
	                //toolbar: '#itemDimTableEventsToolbar',                //工具按钮用哪个容器
	                striped: true,                      //是否显示行间隔色
	                cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	                pagination: true,                   //是否显示分页（*）
	                sortable: false,                     //是否启用排序
	                sortOrder: "asc",                   //排序方式
	                queryParams: oTableInit.queryParams,//传递参数（*） 
	                sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
	                pageNumber:1,                       //初始化加载第一页，默认第一页
	                pageSize: 10,                       //每页的记录行数（*）
	                pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
	                strictSearch: true,
	                //clickToSelect: true,                //是否启用点击选中行
	                height: 560,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
	                uniqueId: "id",                     //每一行的唯一标识，一般为主键列
	                cardView: false,                    //是否显示详细视图
	                detailView: false,                   //是否显示父子表
					iconSize: "outline",
					showColumns: false,                  //是否显示所有的列
					showRefresh: false,                  //是否显示刷新按钮
	 				columns: [{
						checkbox: true
					},{
	                    field: 'item_id',
	                    title: '编码',
						align: 'center'
						
	                }, {
	                    field: 'remark3',
	                    title: '名称',
						align: 'center'
						
	                }, {
	                    field: 'd_value1',
	                    title: '数值',
						align: 'center'
	                }, {
	                    field: 'device_update_time',
	                    title: '更新时间',
						align: 'center',
						formatter:function(value,row,index){
							var d=new Date(value);
							return d.format("yyyy-MM-dd hh:mm:ss");
						}
	                }]
	            });
	        };
	 
	        //得到查询的参数
	      oTableInit.queryParams = function (params) {
	            var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
	                limit: params.limit,   //页面大小
	                offset: params.offset,  //页码 
					stationName:$("#txt_search_station_name").val(),
					startDate:$("#txt_search_startDate").val(),
					endDate:$("#txt_search_endDate").val(),
					tableType:$("#txt_search_tableType").val(), //'real',
	                //order: params.offset, 
	                //maxrows: params.limit, 
	                //pageindex:params.pageNumber 
	            };
	            return temp;
	        };
	        return oTableInit;
	    };
	
		Date.prototype.format = function(format){ 
				var o = { 
				"M+" : this.getMonth()+1, //month 
				"d+" : this.getDate(), //day 
				"h+" : this.getHours(), //hour 
				"m+" : this.getMinutes(), //minute 
				"s+" : this.getSeconds(), //second 
				"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
				"S" : this.getMilliseconds() //millisecond 
				} 

				if(/(y+)/.test(format)) { 
				format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
				} 

				for(var k in o) { 
				if(new RegExp("("+ k +")").test(format)) { 
				format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
				} 
				} 
		return format; 
		} 
	
		var ButtonInit = function () {
			var oInit = new Object();
			var postdata = {};

			oInit.Init = function () {
				//初始化页面上面的按钮事件
				searchBtn();
			};
			return oInit;
		};
		
		//刷新
		function refreshTable(){
			$table.bootstrapTable('refresh');
		}
		
		//搜索
		function searchBtn(){
			$("#btn_query").on('click',function(){
				   var stname=$("#txt_search_station_name").val();
				    var d1=$("#txt_search_startDate").val();
					var d2=	$("#txt_search_endDate").val();	
				   if(stname=="" && d1=="" && d2==""){
						$("#txt_search_tableType").val("real");
				   }else{
						$("#txt_search_tableType").val("history");
				   }
				   
	        	   refreshTable();
			});
		}
		
		//添加
		function toAdd(){
			//设置标题
			$("#itemDimModalLabel").empty();
			$("#itemDimModalLabel").html("新增"); 
			//清空表单
			$("#itemDimForm")[0].reset();
			//弹模态框
			$("#itemDimModal").modal('show');
		}
		
		function toSave(){
			var formobj = $("#itemDimForm").serializeArray();
			var formjson = JSON.stringify(formobj);
			$.post("/agsupport/itemDim/ps-item-dim!toSave.action",
					{"form.itemId":$("#itemId").val(),
					"form.itemName":$("#itemName").val(),
					"form.sttnId":$("#sttnId").val(),
					"form.itemType":$("#itemType").val(),
					"form.itemTag":$("#itemTag").val(),
					"form.unit":$("#unit").val(),
					"form.sort":$("#sort").val(),
					"form.rate":$("#rate").val(),
					"form.upperLimit":$("#upperLimit").val(),
					"form.lowerLimit":$("#lowerLimit").val(),
					"form.surgeLimit":$("#surgeLimit").val(),
					"form.codeId":$("#codeId").val(),
					"form.parentItem":$("#parentItem").val(),
					"form.warnLimit":$("#warnLimit").val(),
					"form.warnLimit2":$("#warnLimit2").val(),
					"form.warnLimit3":$("#warnLimit3").val(),
					"form.warnLimit4":$("#warnLimit4").val(),
					"form.warnLimit5":$("#warnLimit5").val(),
					"form.warnLimit6":$("#warnLimit6").val(),
					"form.baseValue1":$("#baseValue1").val(),
					"form.baseValue2":$("#baseValue2").val(),
					"form.defaultShow":$("#defaultShow").val(),},   
					function(result){ 
						$('#itemDimModal').modal('hide');
						clearnItemDimForm();
						//消息提醒
						toastr.success("提示", "新增成功!")
						//刷新表格
						refreshTable();
					}
			 );
		}
		
		function toUpdate(id2){
			//设置标题
			$("#itemDimModalLabel").empty();
			$("#itemDimModalLabel").append("修改");
			
			//获取选中行id
			var id;
			if(id2==''){
				//获取选中行对象
				var selects = $table.bootstrapTable('getSelections');  	
				id=selects[0].id;
			}else{
				id=id2;
			}
			//弹模态框
			$("#itemDimModal").modal('show');
			//查询
			$.post("/agsupport/itemDim/ps-item-dim!toUpdate.action",
					{"psItemDimIds":id},    
					function(result){ 
						//将json字符串转json对象
						var psItemDime=eval('(' + result + ')');
						
						//将查询的值放入到修改面板中
						$("#id").val(psItemDime.id);
						$("#itemId").val(psItemDime.item_id);
						$("#itemName").val(psItemDime.item_name);
						$("#sttnId").val(psItemDime.sttn_id);
						$("#itemType").val(psItemDime.item_type);
						$("#itemTable").val(psItemDime.item_table);
						$("#unit").val(psItemDime.unit);
						$("#sort").val(psItemDime.sort);
						$("#rate").val(psItemDime.rate);
						$("#upperLimit").val(psItemDime.upper_limit);
						$("#lowerLimit").val(psItemDime.lower_limit);
						$("#surgeLimit").val(psItemDime.surge_limit);
						$("#codeId").val(psItemDime.code_id);
						$("#parentItem").val(psItemDime.parent_item);
						$("#warnLimit").val(psItemDime.warn_limit);
						$("#warnLimit2").val(psItemDime.warn_limit2);
						$("#warnLimit3").val(psItemDime.warn_limit3);
						$("#warnLimit4").val(psItemDime.warn_limit4);
						$("#warnLimit5").val(psItemDime.warn_limit5);
						$("#warnLimit6").val(psItemDime.warn_limit6);
						$("#baseValue1").val(psItemDime.base_value1);
						$("#baseValue2").val(psItemDime.base_value2);
						$("#defaultShow").val(psItemDime.default_show);
						$("#isShow").val(psItemDime.is_show);
						
						//
						$("#submitBtn").attr("onclick","doUpdate()");
					}
			 );
		}
		
		function doUpdate(){
			//校验
			
			//提交
			$.post("/agsupport/itemDim/ps-item-dim!doUpdate.action",
					{"form.id":$("#id").val(),
					"form.itemId":$("#itemId").val(),
					"form.itemName":$("#itemName").val(),
					"form.sttnId":$("#sttnId").val(),
					"form.itemType":$("#itemType").val(),
					"form.itemTag":$("#itemTag").val(),
					"form.unit":$("#unit").val(),
					"form.sort":$("#sort").val(),
					"form.rate":$("#rate").val(),
					"form.upperLimit":$("#upperLimit").val(),
					"form.lowerLimit":$("#lowerLimit").val(),
					"form.surgeLimit":$("#surgeLimit").val(),
					"form.codeId":$("#codeId").val(),
					"form.parentItem":$("#parentItem").val(),
					"form.warnLimit":$("#warnLimit").val(),
					"form.warnLimit2":$("#warnLimit2").val(),
					"form.warnLimit3":$("#warnLimit3").val(),
					"form.warnLimit4":$("#warnLimit4").val(),
					"form.warnLimit5":$("#warnLimit5").val(),
					"form.warnLimit6":$("#warnLimit6").val(),
					"form.baseValue1":$("#baseValue1").val(),
					"form.baseValue2":$("#baseValue2").val(),
					"form.defaultShow":$("#defaultShow").val(),},   
					function(result){ 
						//隐藏面板
						$('#itemDimModal').modal('hide');
						//提示
						toastr.success("提示", "修改成功!")
						//
						clearnItemDimForm();
						//刷新表格
						refreshTable();
					}
			 );
		
		}
		
		//删除前提示框
		function isDelete(){
			$('#delcfmModel').modal();
		}
		
		//删除	
		function doDelete(){
			var checkedIds="";
			//获取选中行对象
			var selects = $table.bootstrapTable('getSelections');  
			
			for(var i=0;i<selects.length;i++){
				checkedIds+=selects[i].id+",";
			}
			$.post("/agsupport/itemDim/ps-item-dim!doDeleteMore.action",
					{"psItemDimIds":checkedIds},     
					function(result){ 
						//消息提醒
						toastr.success("提示", "删除成功!")
						//刷新表格
						refreshTable();
					}
			 );
		}
		
		//设置日期空间
		function creatDatetimepicker(){
			$('.form_date').datetimepicker({
		        language:  'zh-CN',
		        weekStart: 1,
		        todayBtn:  1,
				autoclose: 1,
				todayHighlight: 1,
				startView: 2,
				minView: 0,
				forceParse: 0
		    });
		}
		function clearnItemDimForm(){
			
		}