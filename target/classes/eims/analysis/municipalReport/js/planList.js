define(['jquery','bootstrap','bootstrapTable','bootstrapTableCN','layer','dateUtil','awaterui','mousewheel','customScrollbar'],function($,bootstrap,bootstrapTable,bootstrapTableCN,layer,dateUtil,awaterui,mousewheel,customScrollbar){

	var layerIndex;
	function format_time(value, row, index){
		if(value)return dateUtil.getLocalTime(value.time);
		return '';
	}
		
	function formatter_detail(value, row, index){   	
	   return "<button class='btn btn-primary itemDetailBtn' type='button' data-id='"+row.id+"')>详情</button>";//onclick=openyyyb('/psemgy/eims/dispatch/pages/municipal/rainReport/list.html?id="+row.id+"'
	}
		
	function closeLayer(){
		layer.close(layerIndex);
		reloadData();
	}
		    
	function reloadData(){
		$.ajax({
			method : 'GET',
			url : location.protocol+"//"+location.hostname+":"+location.port+'/psemgy/yaRainReport/getCityRainReport',
			async : false,
			success : function(data) {
			    $("#municipalPlanList #planListTableMuni").bootstrapTable('refreshOptions', {data:JSON.parse(data).rows});	 
			    initItemBtn();      				
			},
			error : function(e) {
				layer.msg("重新加载数据出错！", {icon: 2,time: 1000});
				console.log('error'+e);
			}
		});	
	}
			
	function queryParams(params) {
		return {
			pageSize:params.limit,
			pageNo: params.offset/params.limit+1
		};
	}
			
	function openyyyb(e){
		// parent.createNewtab(url,"防汛应急响应一雨一报");
		var id=$(e.target).data('id');
		awaterui.createNewtab("/psemgy/eims/dispatch/pages/municipal/rainReport/list.html","防汛应急响应一雨一报",function(){
			require(["psemgy/eims/dispatch/pages/municipal/rainReport/js/list"],function(list){
			  list.init(id);
			}); 
		});
	}
			
	function addData(){
		$.get("/psemgy/eims/dispatch/pages/municipal/record/recordAlarmList.html",function(h){
		   layer.open({
		    type: 1, 
		    content: h,
			  title: '市级应急预案列表',
			  shadeClose: false,
			  shade: 0.1,
			  area: ['800px', '400px'],
			  success: function(layero,index){
				require(['/psemgy/eims/dispatch/pages/municipal/record/js/recordAlarmList'],function(recordAlarmList){
					recordAlarmList.init(index);
				});
			  },
			  end: function(){
				reloadData();
			  }
		  });
		});  
	}
				
	function delData(){		    
		var selList=$("#municipalPlanList #planListTableMuni").bootstrapTable('getSelections');
		if(selList.length==0)
			layer.msg('请选中删除项', {icon: 0,time: 1000});
		else{
			layerIndex=layer.confirm('是否删除选中项？', {
				btn: ['是','否'] //按钮
			}, 
			function(){
				var checkedIds= new Array();
				for (var i=0;i<selList.length;i++){
					checkedIds.push(selList[i].id);
				}
		  	$.ajax({  
					url: '/psemgy/yaRainReport/deleteMoreJson',
					traditional: true,
					data: {"checkedIds" : checkedIds},
					type: "POST",
					dataType: "json",
					success: function(data) {
				    layer.msg(data.result);
						closeLayer();
					}
				});
			}, 
			function(){

			});

		}
	}

	function initItemBtn(){
		$('#municipalPlanList .itemDetailBtn').click(openyyyb);
	}
	function initBtn(){
		$("#municipalPlanList #planListAddBtn").click(addData);
		$("#municipalPlanList #planListDeleteBtn").click(delData);
	}
	function initData(){
		$.ajax({
			method : 'GET',
			url : '/psemgy/yaRainReport/getCityRainReport',
			async : false,
			success : function(data) {
				$("#municipalPlanList #planListTableMuni").bootstrapTable({
					toggle:"table",		
					data:JSON.parse(data).rows,
					rowStyle:"rowStyle",
					cache: false, 
					striped: true,
					pagination:true,
					columns: [{visible:true,checkbox:true},
						{field: 'reportName',title: '雨报名称',align:'center'}, 
						{field: 'rescuePeopleNumber',title: '出动救援人员',align:'center'}, 
						{field: 'rescueCarNumber',title: '出动救援车辆',align:'center'},
						{field: 'reportCreateTime',title: '报告时间',align:'center',formatter:format_time},
						{field: 'reportCreater',title: '报告人',align:'center'}, 
						{title: '详情', formatter:formatter_detail,align:'center'}],
					onPageChange:initItemBtn,
				});			
				initItemBtn();
			},
			error : function(e) {
				layer.msg("初始化数据出错！", {icon: 2,time: 1000});
				console.log('error'+e);
			}
		});
	}
	function init(){
		initData();
		initBtn();
	}

	return{
		init:init,
		reloadData:reloadData
	}

});

