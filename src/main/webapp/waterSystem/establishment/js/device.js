		var oTableInit;
		var $table=$('#deviceTableEvents');
		$(function () {
	        //load页面
			loadDevice();
			
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
	                url: '/agsupport/ps-device!getBeanList.action',         //请求后台的URL（*）
	                method: 'get',                      //请求方式（*）
	                toolbar: '#deviceTableEventsToolbar',                //工具按钮用哪个容器
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
						align: 'center'					
	                }, {
	                    field: 'device_name',
	                    title: '设备名称',
						align: 'center'						
	                }, {
	                    field: 'sort',
	                    title: '排序',
						align: 'center'
	                }, {
	                    field: 'item_dim_num',
	                    title: '监控项数量',
						align: 'center'
	                },{
						field: 'operation',
						title: '操作',
						align: 'center',
						width: '250px',
						formatter:function(value,row,index){
							//var s = '<a class = "save" href="javascript:toUpdate('+row.id +')">编辑</a>';  
							//var d = '<a class = "remove" href="javascript:void(0)">删除</a>'; 
							var s = '<button type="button" class="btn btn-primary btn-xs" onclick="toUpdate('+row.id +')">编辑</button>'; 
							var d = '<button type="button" class="btn btn-primary btn-xs" onclick="toDelete('+row.id +')">删除</button>';
							var v = '<button type="button" class="btn btn-primary btn-xs" >查看</button>';
							var itemDim = '<button type="button" class="btn btn-primary btn-xs" onclick="toAddItemDim('+row.id +',\''+ row.device_name +'\')">监控项</button>';
							//var s = '<button type="button" class="btn btn-outline btn-success">修改</button>';
							//var d = '<button type="button" class="btn btn-outline btn-danger">删除</button>';
							//return s+' '+d+' '+v;
							return s+' '+itemDim;
						},
						events: 'operateEvents'
					}]
	            });
	        };
	 
	        //得到查询的参数
	      oTableInit.queryParams = function (params) {
				var pid=$("#combId").val();
	            var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
	                limit: params.limit,   //页面大小
	                offset: params.offset,  //页码 
					deviceName:$("#txt_search_device_name").val(),
					pid:pid
					//itemName:$("#txt_search_item_name").val(),
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
		var validator=$("#deviceForm").validate({        
	        submitHandler:function() { 
				var title=$("#deviceModalLabel").html();
				if(title=='新增'){
					doSave();
				}else{
					doUpdate();
				}
			}
		})
		
		//打开添加窗体
		function toAdd(){
			//设置标题
			$("#deviceModalLabel").empty();
			$("#deviceModalLabel").html("新增"); 
			//清空表单
			//$("#deviceForm")
			$("form[name='deviceForm']")[0].reset();
			//弹模态框
			$("#deviceModal").modal('show');
			
			//修改表单保存方法出发的事件
			//$("#submitBtn").attr("onclick","doValidate()");
			validator.resetForm();
		}
		
		//保存
		function doSave() {
			//提交
			var formobj = $("#deviceForm").serializeArray();
			var formjson = JSON.stringify(formobj);
			$.post("/agsupport/device/ps-device!doSave.action?d="+new Date(),
					{
						"form.deviceName":$("#deviceName").val(),
						"form.sort":$("#sort").val(),
						"form.pid":$("#combId").val()
					},    //"form.sttnId":$("#sttnId").val()
					function(result){ 
						$('#deviceModal').modal('hide');
						//消息提醒
						toastr.success("提示", "新增成功!")
						//刷新表格
						refreshTable(); 
					}
			 );
		}
		
		//跳到修改页面
		function toUpdate(id2){
			//设置标题
			$("#deviceModalLabel").empty();
			$("#deviceModalLabel").html("修改");
			
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
			$("#deviceModal").modal('show');
			//查询
			$.post("/agsupport/device/ps-device!toUpdate.action?d="+new Date(),
					{"psDeviceIds":id},    
					function(result){ 
						//将json字符串转json对象
						var psDevice=eval('(' + result + ')');
						
						//将查询的值放入到修改面板中
						$("#id").val(psDevice.id);
						$("#deviceName").val(psDevice.device_name);
						$("#sort").val(psDevice.sort);
						//$("#pid").val(psItemDime.item_name);
						
						//修改表单保存方法出发的事件
						//$("#submitBtn").attr("onclick","doUpdate()"); 
					}
			 );
		}
		
		function doUpdate(){
			//提交
			$.post("/agsupport/device/ps-device!doUpdate.action?d="+new Date(),
					{
						"form.id":$("#id").val(),
						"form.deviceName":$("#deviceName").val(),
						"form.sort":$("#sort").val(),
						"form.pid":$("#combId").val()
					},    //"form.itemName":$("#itemName").val() 
					function(result){ 
						//隐藏面板
						$('#deviceModal').modal('hide');
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
				//判断删除的记录中是否包含有监控项子记录
				if(selects[i].item_dim_num>0){
					//消息提醒
					toastr.success("提示", "含有监控项的记录不能删除!");
					return ;
				}
			}
			$.post("/agsupport/device/ps-device!doDeleteMore.action?d="+new Date(),
					{"psDeviceIds":checkedIds},     
					function(result){ 
						//消息提醒
						toastr.success("提示", "删除成功!");
						//刷新表格
						refreshTable();
					}
			 );
		}
		
		//监控项
		function toAddItemDim(id2,device_name){
			//获取选中行id
			var id;
			if(id2==''){
				//获取选中行对象
				var selects = $table.bootstrapTable('getSelections');  	
				id=selects[0].id;
			}else{
				id=id2;
			}
			
			var index=layer.open({
		      type: 2,
		      title: device_name+'-监控项',
		      shadeClose: true,
		      shade: false,
		      maxmin: true, //开启最大化最小化按钮    
		      area: ['893px', '600px'], 
		      content: '/awater/waterSystem/establishment/itemDim.html?isSearch=2&deviceId='+ id,
		      cancel: function(index){ 
		    	  //关闭时刷新table
		    	  $table.bootstrapTable("refresh");
		    	  layer.close(index);
		    	  return true; 
		    	} 
		    }); 
		    layer.full(index); 
		}
		
		//正则表达式获取url参数
		function GetParam(name)
		{
		     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		     var r = window.location.search.substr(1).match(reg);
		     if(r!=null)return  unescape(r[2]); return null;
		}
		
		function selectEstType(type){
			  var result="";	
			  switch (type){
				case 1:
				  result="雨水口";
				  break;
				case 2:
				  result="检查井";
				  break;
				case 3:
				  result="排水管";
				  break;
				case 4:
				  result="排水渠";
				  break;
				case 5:
				  result="排放口";
				  break;
				case 6:
				  result="排水泵站";
				  break;
				case 7:
				  result="截流设施";
				  break;
				case 8:
				  result="调储设施";
				  break;
				case 9:
				  result="溢流堰";
				  break;
				case 10:
				  result="闸门";
				  break;
				case 11:
				  result="易涝区域";
				  break;
				case 12:
				  result="基站";
				  break;
				case 13:
				  result="积水点";
				  break;
				case 14:
				  result="井盖";
				  break;
				case 15:
				  result="湿度";
				  break;
				case 16:
				  result="树木";
				  break;                    
			}
			return result;
		}
		
		function loadDevice(){
			//isSearch: 1-搜索；2-编辑
			var isSearch=GetParam("isSearch");
			if(isSearch=='1'){
				$("#deviceSearch").removeAttr("style");
			}else if(isSearch=='2'){
				$("#deviceItem").removeAttr("style");
				
				var combId=GetParam("combId");
				$("#combId").val(combId);
				//查询
				$.post("/agsupport/comb/ps-comb!toUpdate.action?d="+new Date(),
						{"psCombIds":combId},    
						function(result){ 
							//将json字符串转json对象
							var psComb=eval('(' + result + ')');
							
							//将查询的值放入到修改面板中
							//$("#id").val(psComb.id); 
							$("#combName2").val(psComb.comb_name);
							$("#estType2").val(selectEstType(psComb.est_type)); 
							//$("#pid").val(combId); 
							
							//刷新表格
							//refreshTable();
						}
				 );	
				
			}
		
		}