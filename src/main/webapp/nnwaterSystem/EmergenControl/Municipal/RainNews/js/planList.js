function format_time(value, row, index){
	if(value)
		return getLocalTime(value.time);
	return '';
}
	
function formatter_detail(value, row, index){   	
   return "<button class='btn btn-primary'type=\"button\"  onclick=openyyyb('/awater/nnwaterSystem/EmergenControl/Municipal/RainNews/list.html?id="+row.id+"')>详情</button>";
}
	
function closeLayer(index){
	layer.close(index);
   	reloadData();
   }
	    
function reloadData(){
	$.ajax({
		method : 'GET',
		url : location.protocol+"//"+location.hostname+":"+location.port+'/agsupport/ya-rain-report!getCityRainReport.action',
		async : false,
		success : function(data) {
		    $("#tableMuni").bootstrapTable('refreshOptions', {data:JSON.parse(data).rows});	       				
		},
		error : function(e) {
			alert('error');
		}
	});	
}
		
function queryParams(params) {
   	return {
     pageSize:params.limit,
     pageNo: params.offset/params.limit+1
    };
}
		
function openyyyb(url){
	parent.createNewtab(url,"防汛应急响应一雨一报");
}

$.ajax({
	method : 'GET',
	url : location.protocol+"//"+location.hostname+":"+location.port+'/agsupport/ya-rain-report!getCityRainReport.action',
	async : false,
	success : function(data) {
		$("#tableMuni").bootstrapTable({
			toggle:"table",		
			data:JSON.parse(data).rows,
			rowStyle:"rowStyle",
			cache: false, 
			striped: true,
			pagination:true,
			clickToSelect:true,
			columns: [{visible:true,checkbox:true},
				{field: 'reportName',title: '雨报名称',align:'center'}, 
				{field: 'rescuePeopleNumber',title: '出动救援人员',align:'center'}, 
				{field: 'rescueCarNumber',title: '出动救援车辆',align:'center'},
				{field: 'reportCreateTime',title: '报告时间',align:'center',formatter:format_time},
				{field: 'reportCreater',title: '报告人',align:'center'}, 
				{title: '详情', formatter:formatter_detail,align:'center'}]
		});					
	},
	error : function(e) {
		alert('error');
	}
});

$(window).resize(function () {
	$('#tableMuni').bootstrapTable('resetView');
});

function showWindow(url){
	//iframe层
	layer.open({
	  type: 2,
	  title: '详细',
	  shadeClose: false,
	  shade: 0.1,
	  area: ['70%', '70%'],
	  content: url //iframe的url
	}); 	
}
		
function addData(){
		layer.open({
		  type: 2,
		  title: '市级应急预案列表',
		  shadeClose: false,
		  shade: 0.1,
		  area: ['800px', '400px'],
		  content: '/awater/nnwaterSystem/EmergenControl/Municipal/Record/Record_Alarm_List.html'
		});
	}
			
function delData(){		    
  	var selList=$("#tableMuni").bootstrapTable('getSelections');
  	if(selList.length==0)
  		layer.msg('请选中删除项');
  	else{
   	layer.confirm('是否删除选中项？', {
		btn: ['是','否'] //按钮
	}, function(){
		var checkedIds= new Array();
    	for (var i=0;i<selList.length;i++){
    		checkedIds.push(selList[i].id);
    	}
   	    $.ajax({  
		    url: location.protocol+"//"+location.hostname+":"+location.port+'/agsupport/ya-rain-report!deleteMoreJson.action',  
		    traditional: true,
		    data: {"checkedIds" : checkedIds},
		    type: "POST",
		    dataType: "json",
		    success: function(data) {
		        layer.msg(data.result);
   				reloadData();
		    }
		});
	}, function(){
		
	});
   	
  	}
}