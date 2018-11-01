var oTableInit;
		var $table=$('#itemDimTableEvents');
		$(function () {
			//load页面
			loadItemDim();        
	
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
	                url: '/agsupport/ps-item-dim!getBeanList.action?d='+new Date(),         //请求后台的URL（*）
	                method: 'get',                      //请求方式（*）
	                toolbar: '#itemDimTableEventsToolbar',                //工具按钮用哪个容器
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
	                    field: 'item_id',
	                    title: '监控项编码',
						align: 'center'
						
	                }, {
	                    field: 'item_name',
	                    title: '监控项名称',
						align: 'center'
	                }, {
	                    field: 'item_type',
	                    title: '监控项类型',
						align: 'center',
						formatter:function(value,row,index){
							return selectItemType(value);
						}
	                }, {
	                    field: 'warn_limit',
	                    title: '警告值',
						align: 'center'
	                }, {
	                    field: 'warn_limit2',
	                    title: '警告值2',
						align: 'center'
	                }, {
	                    field: 'warn_limit3',
	                    title: '警告值3',
						align: 'center'
	                }, {
	                    field: 'upper_limit',
	                    title: '上限值',
						align: 'center'
	                }, {
	                    field: 'lower_limit',
	                    title: '下限值',
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
							var d = '<button type="button" class="btn btn-primary btn-xs" >删除</button>'; 
							var u = '<button type="button" class="btn btn-primary btn-xs" onclick="uploadImage(' + row.id + ',' + row.file_group_id + ')">图片</button>'; 
							return s+"&nbsp;&nbsp;"+u;
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
					itemId:$("#txt_search_item_id").val(),
					itemName:$("#txt_search_item_name").val(),
					pid:$("#deviceId").val(),
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
		
		//上传
		function uploadImage(id,groupId){
			
			layer.open({
				type: 2,
				title: '图片上传<span style="font-size:12px;color:#7a7a7a">（点击图片可查看大图）</span>',
				area: ['700px','300px'],
				content: '/awater/waterSystem/establishment/itemImgUpload.html?id=' + id + '&fileGroupId=' + groupId
			})
		}
		
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
		var validator=$("#itemDimForm").validate({        
	        submitHandler:function() { 
				var title=$("#itemDimModalLabel").html();
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
			$("#itemDimModalLabel").empty();
			$("#itemDimModalLabel").html("新增"); 
			//清空表单
			$("#itemDimForm")[0].reset();
			//弹模态框
			$("#itemDimModal").modal('show');
			//动态设置监测类型
			getAllItemTableList();
			//恢复到验证前原来的状态。
			validator.resetForm();
		}
		
		//新增
		function doSave(){
			var formobj = $("#itemDimForm").serializeArray(); 
			var formjson = JSON.stringify(formobj);
			
			//itemTableMap.id 和 itemTableMap.item_type_name 进行分开，分别存放到  itemType 和 itemTag字段里
			//var itemType=$("#itemType").val();
			//var arr=itemType.split(",");
			
			$.post("/agsupport/itemDim/ps-item-dim!doSave.action?d="+new Date(),
					{"form.itemId":$("#itemId").val(),
					"form.itemName":$("#itemName").val(),
					"form.sttnId":$("#sttnId").val(),
					"form.itemType":$("#itemType").val(),
					"form.itemTable":$("#itemTable").val(),
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
					"form.defaultShow":$("#defaultShow").val(),
					"form.pid":$("#deviceId").val(),
					"form.videoUrl":$("#videoUrl").val()
					},   
					function(result){ 
						$('#itemDimModal').modal('hide');
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
			$("#itemDimModalLabel").html("修改");
			
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
			$("#itemDimModal").modal('show');
			//查询
			$.post("/agsupport/itemDim/ps-item-dim!toUpdate.action?d="+new Date(),
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
						$("#videoUrl").val(psItemDime.video_url);

						//动态设置监测类型
						getAllItemTableList();
					}
			 );
		}
		
		function doUpdate(){
			//itemTableMap.id 和 itemTableMap.item_type_name 进行分开，分别存放到  itemType 和 itemTag字段里
			//var itemType=$("#itemType").val();
			//var arr=itemType.split(",");
			
			//提交
			$.post("/agsupport/itemDim/ps-item-dim!doUpdate.action?d="+new Date(),
					{"form.id":$("#id").val(),
					"form.itemId":$("#itemId").val(),
					"form.itemName":$("#itemName").val(),
					"form.sttnId":$("#sttnId").val(),
					"form.itemType":$("#itemType").val(),
					"form.itemTable":$("#itemTable").val(),
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
					"form.defaultShow":$("#defaultShow").val(),
					"form.videoUrl":$("#videoUrl").val()},   
					function(result){ 
						//隐藏面板
						$('#itemDimModal').modal('hide');
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
			$.post("/agsupport/itemDim/ps-item-dim!doDeleteMore.action?d="+new Date(),
					{"psItemDimIds":checkedIds},     
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
		
		//监控项加载页面方法
		function loadItemDim(){
			//isSearch: 1-搜索；2-编辑
			var isSearch=GetParam("isSearch");
			if(isSearch=='1'){
				$("#itemDimSearch").removeAttr("style");
			}else if(isSearch=='2'){
				$("#deviceName").removeAttr("style");
				
				var deviceId=GetParam("deviceId");
				$("#deviceId").val(deviceId); 
				//查询
				$.post("/agsupport/device/ps-device!toUpdate.action?d="+new Date(),
						{"psDeviceIds":deviceId},    
						function(result){ 
							//将json字符串转json对象
							var psDevice=eval('(' + result + ')');
							
							//将查询的值放入到修改面板中
							$("#deviceName2").val(psDevice.device_name); 
							$("#deviceId").val(psDevice.id); 
							
							//refreshTable();
						}
				 );	
				
			}
		
		}
		
		function selectItemType(type){
			  var result="";	
			  switch (type){
				case 'ZZ_WL':
				  result="闸站水位";
				  break;
				case 'CSK_WL':
				  result="出水口水位";
				  break;
				case 'JSD_WL':
				  result="积水点水位";
				  break;
				case 'JX_WL':
				  result="井下水位";
				  break;
				case 'DP_WL':
				  result="泵站水位";
				  break;
				case 'YL_WL':
				  result="雨量水位";
				  break;    
				case 'Q':
				  result="流量";
				  break; 
				case 'VD':
				  result="视频";
				  break;
				case 'TPT':
				  result="温度";
				  break;
			}
			return result;
		}
		
		function getAllItemTableList(){ 		
			//查询
				$.post("/agsupport/ps-item-table!getBeanList.action?limit=1000000&offset=0", 
						{},    
						function(result){ 
							$("#itemTable").empty();
														
							var itemTableList=result.rows; 
							//var optionStr="<option value=''>--请选择--</option>";
							var optionStr;
							var itemTableMap;
							var len=itemTableList.length;
							for(var i=0;i<len;i++){
								itemTableMap=itemTableList[i];	
								optionStr+="<option value='"+ itemTableMap.id +","+ itemTableMap.item_type_name +"'>"+ itemTableMap.item_name +"</option> ";
							}
							$("#itemTable").append(optionStr); 
						}
				 );
		}
		
		function showBigImage(img,src){
			var img_html = "";
			var w = $(img).width();
			var h = $(img).height();
			if(w >= h){
				//横向
				$("#imgBoxDiv").css("position","fixed");
				img_html = "<img style='border:2px solid #505050;' src='" + src + "' height='90%'/>"
			}else{
				//纵向
				$("#imgBoxDiv").css("position","absolute");
				img_html = "<img style='border:2px solid #505050' src='" + src + "' width='90%'/>"
			}
			$("#imgBoxDiv").html(img_html)
			
			//$("#bigImg").attr('src',src);
			$("#showBigImageDiv").css("display","block")
		}
		
		function closeBigImage(){
			$("#showBigImageDiv").css("display","none");
		}