var oTableInit;
		var table=$('#smsTable');
			
		$(function () {
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
        oTableInit.Init = function (){
           table.bootstrapTable({
                url:'/agsupport/ya-temlate-sms!listSmsMessage.action?d='+new Date(),    //请求后台的URL（*）
                method: 'get',
                toolbar: '#smsTableToolbar',		//工具按钮容器
				rowStyle:"rowStyle",
				striped: true,                      //是否显示行间隔色
				cache: false,			           //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: true,                   //是否显示分页（*）
                sortable: false,                     //是否启用排序
                sortOrder: "asc",                   //排序方式
                queryParams: oTableInit.queryParams,//传递参数（*） 
                sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
                pageNumber:1,                       //初始化加载第一页，默认第一页
                pageSize: 10,                       //每页的记录行数（*）
                pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
                strictSearch: true,
                height: 597,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                uniqueId: "id",                     //每一行的唯一标识，一般为主键列
                cardView: false,                    //是否显示详细视图
 				detailView: false,                   //是否显示父子表
				iconSize: "outline",
				showColumns: true,                  //是否显示所有的列
				showRefresh: true,
				columns: [{checkbox: true},
				{field: 'id',title: '编号',visible: false,align:'center'},
				{field: 'templateName',title: '模板名称',align:'center'}, 
				{field: 'templateCode',title: '模板编号',align:'center'}, 
				{field: 'templateContet',title: '短信内容',align:'center'}, 
				{field: 'templateCreatePerson',visible: false,align:'center'}, 
				{field: 'templateUnitCode',title: '所属区域',align:'center',formatter:format_unitcode}, 
				{field: 'templateCreateTime',title: '创建时间',align:'center',formatter:format_time}, 
				{field: 'state',title: '状态',align:'center',formatter:format_status},
				{field: 'operation',title: '操作',align: 'center',width: '100px',formatter:operations,events: 'operateEvents'}]
            });
        };
 
        //得到查询的参数
      oTableInit.queryParams = function (params) {
            var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                pageSize:params.limit,
		        pageNo: params.offset/params.limit+1,
				templateName:$("#txt_search_template_name").val(),
				templateCode:$("#txt_search_template_code").val(),
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
		/**所属区域*/
		function format_unitcode(value,row,index){
			if(value == 407) return '市区防内涝抢险指挥部';
			if(value == 1065) return 'B区';
			if(value == 1067) return 'A区';
			if(value == 1068) return 'H区';
			if(value == 1069) return 'D区';
			if(value == 1070) return 'E区';
			if(value == 1071) return 'C区';
			if(value == 1072) return 'F区';
			if(value == 1073) return 'G区';
			if(value == 1074) return 'I区';
			else
				return '';
		}
		function operations(value,row,index){
			var s = '<button type="button" class="btn btn-primary btn-xs" onclick="toUpdate('+row.id +')">修改</button>'; 
			var v = '<button type="button" class="btn btn-primary btn-xs" >查看</button>'; 
			return s;
		}
		//设置状态
		function format_status(value){
			if(value === 1){
				return '<font color="#00EC00">启用</font>';
			}else
				return '<font color="red">未启用</font>';
		}
		
		
		function format_time(value,row,index){
		if(value)
			return getLocalTime(value.time).split(" ")[0];
		return '';
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
			table.bootstrapTable('refresh');
		}
		
		//搜索 
		function searchBtn(){
			$("#btn_query").on('click',function(){
	        	   refreshTable();
			});
		}
		
		
		//验证表单		
		var validator=$("#smsMessageForm").validate({        
	        submitHandler:function() { 
				var title=$("#smsModalLabel").html();
				if(title=='新增'){
					doSave();
				}else{
					doUpdate();
				}
			}
		});
		
	//添加页面
	function toAdd(){
		parent.layer.open({
			type: 2,
			area: ['770px', '400px'],
			title : "新增短信",	
			content: ['/awater/nnwaterSystem/EmergenControl/smsMessage/smsInput.html', 'yes']
		});
	}
	/**
		* 修改页面
		*/
		function toUpdate(id){
		 var selList;
		if(id){ selList = id;
			}else{
			var selects = new Array();
			selects = table.bootstrapTable('getSelections');
			if(selects.length >1){
				parent.layer.msg('提示,编辑只能选中一条记录！')
				return ;
			}else if(selects.length < 1){
				parent.layer.msg('提示,请选中一条记录！')
				return ;
			}else{
				selList=selects[0].id;
			}
		}	
		parent.layer.open({
			type: 2,
			area: ['770px', '400px'],
			title : "修改短信",
			content: ['/awater/nnwaterSystem/EmergenControl/smsMessage/smsInput.html?id='+selList, 'yes']
			});
		}	
		//删除	
		function doDelete(){
		    var selList=table.bootstrapTable('getSelections');
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
					    url : '/agsupport/ya-temlate-sms!doDeleteMore.action',
						traditional: true,
					    data: {"checkedIds" : checkedIds},
					    type: "POST",
					    dataType: "json",
					    success: function(data) {
					        parent.layer.msg(data.result);
					    	window.location.reload();
					    },
					    error : function(e) {
							parent.layer.msg("删除失败!");
						}
					});
					
				}, function(){
					
				});
		   	}
	}
	
function reloadData(){
	$.ajax({  
	    url: '/agsupport/ya-temlate-sms!listSmsMessage.action',
	    data: {"templateName":$("#txt_search_template_name").val(),"templateCode":$("#txt_search_template_code").val()},
	    type: "POST",
	    dataType: "json",
	    success: function(data) {
	    	$("#table").bootstrapTable('removeAll');
	 		$("#table").bootstrapTable('load',data);
	    },
	    error:function(){
	    	layer.msg("删除失败");
	    }
	});
}	
