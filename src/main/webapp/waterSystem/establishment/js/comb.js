var oTableInit;
		var $table=$('#combTable');
			
		$(function () {
			//1.初始化页面
			setNnArea($('#area'));
			
	        //2.初始化Table
	        var oTable = new TableInit();
	        oTable.Init();
	 
	        //3.初始化Button的点击事件
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
	                url: '/agsupport/ps-comb!getBeanList.action?d='+new Date(),         //请求后台的URL（*）
	                method: 'get',                      //请求方式（*）
	                toolbar: '#combTableToolbar',                //工具按钮用哪个容器
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
	                    title: '编号',
						align: 'center',
						visible: false
	                }, {
	                    field: 'comb_name',
	                    title: '设施地址',
						align: 'center'
						
	                }, {
	                    field: 'est_type',
	                    title: '设施类型',
						align: 'center',
						formatter:function(value,row,index){
							return selectEstType(value);
						}
	                },{
	                    field: 'device_num',
	                    title: '设备数量',
						align: 'center'
	                },{
	                    field: 'lane_way',
	                    title: '所在道路',
						align: 'center'
	                },{
	                    field: 'est_date',
	                    title: '建立日期', 
						align: 'center',
						formatter:function(value,row,index){
							if(value=='NaN-aN-aN aN:aN:aN') return '';
								else
							return new Date(value).pattern('yyyy-MM-dd');
						}
	                },{
						field: 'operation',
						title: '操作',
						align: 'center',
						width: '250px',
						formatter:function(value,row,index){
							//var s = '<a class = "glyphicon glyphicon-edit" href="javascript:toUpdate('+row.id +')"></a>';    
							//var d = '<a class = "glyphicon glyphicon-trash" href="javascript:void(0)"></a>';   
							var s = '<button type="button" class="btn btn-primary btn-xs" onclick="toUpdate('+row.id +')">修改</button>'; 
							var d = '<button type="button" class="btn btn-primary btn-xs" onclick="toDelete('+row.id +')">删除</button>';
							var v = '<button type="button" class="btn btn-primary btn-xs" >查看</button>'; 
							var device = '<button type="button" class="btn btn-primary btn-xs" onclick="toAddDevice('+row.id +',\''+ row.comb_name +'\')" >设备</button>'; 
							//var s = '<button type="button" class="btn btn-outline btn-success">修改</button>';
							//var d = '<button type="button" class="btn btn-outline btn-danger">删除</button>';
							//return s+' '+d+' '+v;
							return s+' '+device;
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
					combName:$("#txt_search_comb_name").val(),
					estType:$("#txt_search_est_type").val(),
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
				  result="易涝隐患点";
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
				case 17:
				  result="视频点";
				  break;   
				case 18:
				  result="内河站点";
				  break;   
				case 19:
				  result="雨量站";
				  break; 	  
				case 20:
				  result="水文站";
				  break; 	  
				case 21:
				  result="窨井";
				  break; 	  
				case 22:
				  result="仓库";
				  break;
				case 23:
				  result="安置点";
				  break; 
				case 24:
				  result="撤离点";
				  break; 
				case 25:
				  result="地面视频";
				  break; 
				case 26:
				  result="交警视频";
				  break; 
				case 27:
				  result="排水泵站视频";
				  break; 
				case 28:
				  result="内河泵站视频";
				  break; 
				case 29:
				  result="内河站降雨量";
				  break; 
				case 30:
				  result="水文雨量站";
				  break;
				case 31:
				  result="自建雨量站";
				  break; 
				case 32:
				  result="自建雨量站";
				  break; 
				case 33:
				  result="路面(管渠)水位";
				  break; 
				case 34:
				  result="河道水位";
				  break; 
				case 35:
				  result="管渠流量";
				  break; 
				case 36:
				  result="河道流量";
				  break; 
				case 37:
				  result="泵站水位";
				  break; 
			}
			return result;
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
				minView: 2,
				forceParse: 0,
				format:'yyyy-mm-dd'
		    });
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
		var validator=$("#combForm").validate({        
	        submitHandler:function() { 
				var title=$("#combModalLabel").html();
				if(title=='新增'){
					doSave();
				}else{
					doUpdate();
				}
			}
		});
		
		//添加
		function toAdd(){
			//设置标题
			$("#combModalLabel").empty();
			$("#combModalLabel").html("新增"); 
			//清空表单
			$("#combForm")[0].reset();
			//弹模态框
			$("#combModal").modal('show');
			//修改表单保存方法出发的事件
			//$("#submitBtn").attr("onclick","doSave()");
			validator.resetForm();
		}
		
		function doSave(){
			var formobj = $("#combForm").serializeArray();
			var formjson = JSON.stringify(formobj);
			$.post("/agsupport/comb/ps-comb!doSave.action?d="+new Date(),
					{
						"form.combName":$("#combName").val(),
						"form.estType":$("#estType").val(),
						"form.xcoor":$("#xcoor").val(),
						"form.ycoor":$("#ycoor").val(),
						"form.laneWay":$("#laneWay").val(),
						"form.status":$("#status").val(),
						"form.estDate":$("#estDate").val(),
						"form.updateDate":$("#updateDate").val(),
						"form.estDept":$("#estDept").val(),
						"form.orgDept":$("#orgDept").val(),
						"form.coorSys":$("#coorSys").val(),
						"form.eleSys":$("#eleSys").val(),
						"form.drainSys":$("#drainSys").val(),
						"form.area":$("#area").val()
					},
					function(result){ 
						$('#combModal').modal('hide');
						//消息提醒
						toastr.success("提示", "新增成功!")
						//刷新表格
						refreshTable();
					}
			 );
		}
		
		function toUpdate(id2){
			//设置标题
			$("#combModalLabel").empty();
			$("#combModalLabel").html("修改");
			
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
			//弹模态框
			$("#combModal").modal('show');
			
			//查询
			$.post("/agsupport/comb/ps-comb!toUpdate.action?d="+new Date(),
					{"psCombIds":id},    
					function(result,textStatus, jqXHR){ 
						//将json字符串转json对象
						var psComb=eval('(' + result + ')');
						
						//将查询的值放入到修改面板中
						$("#id").val(psComb.id);
						$("#combName").val(psComb.comb_name);
						$("#estType").val(psComb.est_type);
						$("#xcoor").val(psComb.xcoor);
						$("#ycoor").val(psComb.ycoor);
						$("#laneWay").val(psComb.lane_way);
						$("#status").val(psComb.status);
						$("#estDate").val(new Date(psComb.est_date).pattern('yyyy-MM-dd'));//new Date(value).pattern('yyyy-MM-dd')
						$("#updateDate").val(new Date(psComb.update_date).pattern('yyyy-MM-dd'));
						$("#estDept").val(psComb.est_dept);
						$("#orgDept").val(psComb.org_dept);
						$("#coorSys").val(psComb.coor_sys);
						$("#eleSys").val(psComb.ele_sys);
						$("#drainSys").val(psComb.drain_sys);
						$("#area").val(psComb.area);

						//修改表单保存方法出发的事件
						//$("#submitBtn").attr("onclick","doUpdate()");
						validator.resetForm();
					}
			 );
		}
		
		function doUpdate(){
			var formobj = $("#combForm").serializeArray();
			var data=formobj;
		      $.ajax({
		             type: "POST",
		             url: "/agsupport/comb/ps-comb!doUpdate.action?d="+new Date(),
		             data: data,
		             dataType: "json",
		             success: function(data){
//							//隐藏面板
							$('#combModal').modal('hide');
							//提示
							toastr.success("提示", "修改成功!");
							//刷新表格
							refreshTable();
                      },
                      error:function(e){

                      }
                      
		         });
			
			
//			//提交
//			$.post("/agsupport/comb/ps-comb!doUpdate.action",
//					{
//						"form.id":$("#id").val(),
//						"form.combName":$("#combName").val(),
//						"form.estType":$("#estType").val(),
//						"form.xcoor":$("#xcoor").val(),
//						"form.ycoor":$("#ycoor").val(),
//						"form.laneWay":$("#laneWay").val(),
//						"form.status":$("#status").val(),
//						"form.estDate":$("#estDate").val(),
//						"form.updateDate":$("#updateDate").val(),
//						"form.estDept":$("#estDept").val(),
//						"form.orgDept":$("#orgDept").val(),
//						"form.coorSys":$("#coorSys").val(),
//						"form.eleSys":$("#eleSys").val(),
//						"form.drainSys":$("#drainSys").val(),
//						"form.area":$("#area").val()
//					},	
//					function(result, textStatus, jqXHR){ 
//						//隐藏面板
//						$('#combModal').modal('hide');
//						//提示
//						toastr.success("提示", "修改成功!");
//						//刷新表格
//						refreshTable();
//					}
//			 );	
		}
				
		//删除前提示框
		function isDelete(){
			var selects = $table.bootstrapTable('getSelections');
			var combId=$("#deleteId").val();
			if(selects.length>0 || combId!='' ){
				$('#delcfmModel').modal();
			}
		}
		
		var isDeleteFlag=0;
		//操作列删除按钮
		function toDelete(id){
			isDeleteFlag=1;
			$("#deleteId").val(id); 
			$('#delcfmModel').modal(); 
		}
		
		//删除	
		function doDelete(){
			if(isDeleteFlag==0){
				var checkedIds="";
				//获取选中行对象
				var selects = $table.bootstrapTable('getSelections');  
				
				for(var i=0;i<selects.length;i++){
					checkedIds+=selects[i].id+",";
					//判断是否含有设备记录
					if(selects[i].device_num>0){
						//消息提醒
						toastr.success("提示", "含有设备的记录不能删除!");
						return ;
					}
				}
			}else{
				checkedIds=$("#deleteId").val()+","; 
			}
			$.post("/agsupport/comb/ps-comb!doDeleteMore.action",
					{"psCombIds":checkedIds},     
					function(result){ 
						//消息提醒
						toastr.success("提示", "删除成功!")
						//刷新表格
						refreshTable();
					}
			 );
		}
		
		//为设施添加设备 
		function toAddDevice(id2,comb_name){ 
			//获取选中行id
			var id;
			if(id2==''){
				//获取选中行对象
				var selects = $table.bootstrapTable('getSelections');  	
				id=selects[0].id;
			}else{
				id=id2;
			}
			
			//$("#combModal2").modal({remote:'/awater/waterSystem/establishment/device.html?isSearch=2&combId=10171'});	
			//$("#combModal3").load('/awater/waterSystem/establishment/device.html?isSearch=2&combId=10171');
			var index=layer.open({
		      type: 2,
		      title: comb_name+'-设备',
		      area: ['320px', '195px'],
  			  maxmin: true,
		      content: '/awater/waterSystem/establishment/device.html?isSearch=2&combId='+id,
		      cancel: function(index){ 
		    	//关闭时刷新table
		    	  $table.bootstrapTable("refresh");
		    	  layer.close(index);
		    	  return true; 
		    	} 
		    }); 
		    layer.full(index);     
		}
		
		//跳到数据授权
		function toRoleAuth(){
			var index=layer.open({
		      type: 2,
		      title: '数据授权',
		      area: ['320px', '195px'],
  			  maxmin: true,
		      content: '/awater/nnwaterSystem/dataAuth/establishmentAuth.html' 
		    }); 
		    layer.full(index);
		}