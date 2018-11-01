var oTableInit;
		var $table=$('#itemTable');
		$(function () {
			//1.初始化Table
	        var oTable = new TableInit();
	        oTable.Init();
	 
	        //2.初始化Button的点击事件
	        var oButtonInit = new ButtonInit();
	        oButtonInit.Init();
	 
	    });
		
		var TableInit = function () {
	        oTableInit = new Object();
	        //初始化Table
	        oTableInit.Init = function () {
	            $table.bootstrapTable({
	                url: '/agsupport/ps-item-table!getBeanList.action',         //请求后台的URL（*）
	                method: 'get',                      //请求方式（*）
	                toolbar: '#itemTableToolbar',                //工具按钮用哪个容器
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
	                height: 597,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
	                uniqueId: "id",                     //每一行的唯一标识，一般为主键列
	                cardView: false,                    //是否显示详细视图
	                detailView: false,                   //是否显示父子表
					iconSize: "outline",
					showColumns: true,                  //是否显示所有的列
					showRefresh: true,                  //是否显示刷新按钮
	 				columns: [{
						checkbox: true
					},{
	                    field: 'id',
	                    title: '序号',
						align: 'center',
						visible: false
						
	                }, {
	                    field: 'item_name',
	                    title: '名称',
						align: 'center'
						
	                }, 
					{
	                    field: 'table_name_real',
	                    title: '实时数据表名称',
						align: 'center'
	                },
					{
	                    field: 'table_name_hist',
	                    title: '历史数据表名称',
						align: 'center'
	                }, 
//					{
//	                    field: 'item_type_name',
//	                    title: '数据类型',
//						align: 'center',
//						formatter:function(value,row,index){
//							return selectItemTypeName(value);
//						}
//	                }, 
					{
						field: 'operation',
						title: '操作',
						align: 'center',
						width: '250px', 
						formatter:function(value,row,index){
							//var s = '<a class = "save" href="javascript:toUpdate('+row.id +')">编辑</a>'; 
							//var d = '<a class = "remove" href="javascript:void(0)">删除</a>'; 
							
							var s = '<button type="button" class="btn btn-primary btn-xs" onclick="toUpdate('+row.id +')">编辑</button>'; 
							var d = '<button type="button" class="btn btn-primary btn-xs" >删除</button>'; 
							
							return s;
						},
						events: 'operateEvents'
					}]
	            });
	        };
	 
	        //得到查询的参数
	      oTableInit.queryParams = function (params) {
	            var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
	                limit: params.limit,   //页面大小
	                offset: params.offset,  //页码 
					itemName:$("#txt_search_item_name").val(),
					itemTypeName:$("#txt_search_item_type_name").val(),
	                //order: params.offset, 
	                //maxrows: params.limit, 
	                //pageindex:params.pageNumber 
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
		
		//刷新
		function refreshTable(){
			$table.bootstrapTable('refresh');
		}
		
		//搜索
		function searchBtn(){
			$("#btn_query").on('click',function(){
	        	   refreshTable();
			});
		}
		
		//验证表单		
		var validator=$("#itemTableForm").validate({        
	        submitHandler:function() { 
				var title=$("#itemTableLabel").html();
				if(title=='新增'){
					doSave();
				}else{
					doUpdate();
				}
			}
		})
		
		//跳到新增页面
		function toAdd(){
			//设置标题
			$("#itemTableLabel").empty();
			$("#itemTableLabel").html("新增"); 
			//清空表单
			$("#itemTableForm")[0].reset();
			//弹模态框
			$("#itemTableModal").modal('show');
			//修改表单保存方法出发的事件
			//$("#submitBtn").attr("onclick","doSave()");
			//恢复到验证前原来的状态。
			validator.resetForm();
		}
		
		//新增
		function doSave(){
			var formobj = $("#itemTableForm").serializeArray(); 
			var formjson = JSON.stringify(formobj);
			$.post("/agsupport/itemTable/ps-item-table!doSave.action",
					{
						"form.itemName":$("#itemName").val(),
						"form.itemTypeName":$("#itemTypeName").val(),
						"form.tableNameHist":$("#tableNameHist").val(),
						"form.tableNameReal":$("#tableNameReal").val()
					},   
					function(result){ 
						$('#itemTableModal').modal('hide');
						//消息提醒
						toastr.success("提示", "新增成功!")
						
						//刷新表格
						refreshTable(); 
					}
			 );
		}
		
		function toUpdate(id2){
			//设置标题
			$("#itemTableLabel").empty();
			$("#itemTableLabel").html("修改");
			
			//获取选中行id
			var id;
			if(id2==''){
				//获取选中行对象
				var selects = $table.bootstrapTable('getSelections');  	
				if(selects.length >1){
					toastr.success("提示", "编辑只能选中一条记录！")
					return ;
				}else{
					id=selects[0].id;
				}	
			}else{
				id=id2;
			}
			
			//恢复到验证前原来的状态。
			validator.resetForm();
			
			//弹模态框
			$("#itemTableModal").modal('show');
			//查询
			$.post("/agsupport/itemTable/ps-item-table!toUpdate.action",
					{"psItemTableIds":id},    
					function(result){ 
						//将json字符串转json对象
						var psItemTable=eval('(' + result + ')');
						
						//将查询的值放入到修改面板中
						$("#id").val(psItemTable.id);
						$("#itemName").val(psItemTable.item_name);
						$("#itemTypeName").val(psItemTable.item_type_name);
						$("#tableNameHist").val(psItemTable.table_name_hist);
						$("#tableNameReal").val(psItemTable.table_name_real);
						
						//修改表单保存方法出发的事件
						//$("#submitBtn").attr("onclick","doUpdate()");
					}
			 );
		}
		
		function doUpdate(){
			//提交
			$.post("/agsupport/itemTable/ps-item-table!doUpdate.action",
					{"form.id":$("#id").val(),
					"form.itemName":$("#itemName").val(),
					"form.itemTypeName":$("#itemTypeName").val(),
					"form.tableNameHist":$("#tableNameHist").val(),
					"form.tableNameReal":$("#tableNameReal").val()},   
					function(result){ 
						//隐藏面板
						$('#itemTableModal').modal('hide');
						//提示
						toastr.success("提示", "修改成功!")
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
			$.post("/agsupport/itemTable/ps-item-table!doDeleteMore.action",
					{"psItemTableIds":checkedIds},     
					function(result){ 
						//消息提醒
						toastr.success("提示", "删除成功!")
						//刷新表格
						refreshTable();
					}
			 );
		}
		
		//正则表达式获取url参数
		function GetParam(name)
		{
		     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		     var r = window.location.search.substr(1).match(reg);
		     if(r!=null)return  unescape(r[2]); return null;
		}
		
		//返回 数据类型
		function selectItemTypeName(type){
			  var result="";	
			  switch (type){
				case 'GP':
				  result="闸位";
				  break;
				case 'WL':
				  result="水位";
				  break;
				case 'RF':
				  result="雨量";
				  break;
				case 'WS':
				  result="风速";
				  break;
				case 'WD':
				  result="风向";
				  break;
				case 'SE':
				  result="测站设备";
				  break;  
				case 'AT':
				  result="气温";
				  break;  
				case 'FL':
				  result="流量";
				  break;
				case 'WQ':
				  result="水质";
				  break;   
			}
			return result;
		}