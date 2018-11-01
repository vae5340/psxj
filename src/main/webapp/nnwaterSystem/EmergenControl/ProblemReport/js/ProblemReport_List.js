$(function(){
	$("#startTime").datetimepicker({
	    language: 'zh-CN',
		format: 'yyyy-mm-dd',
		autoclose:true,
		minView:2,
		pickerPosition:'bottom-right'
	});
	   
   	$("#endTime").datetimepicker({
        language: 'zh-CN',
	  	format: 'yyyy-mm-dd',
	  	autoclose:true,
	  	minView:2,
	  	pickerPosition:'bottom-right'
   	});
	   
   	$("#startTime").on("change",function(){   		      
      	if($("#endTime").val()!=""){
          	$("#startTime").attr('max','$("#endTime").val()');
      	}
   	});
	   
	$("#endTime").on("change",function(){   		      
		if($("#startTime").val()!=""){
          	$("#endTime").attr('min','$("#startTime").val()');
     	}
  	});
});

function addData(){
		    	layer.open({
					type: 2,
					title: '新增应急问题上报记录',
					maxmin: true, 
					area: ['900px', '550px'],
				    content: 'ProblemReport_Input.html'
				});
		    }
		    		    
		    function closeLayer(index)
		    {
				layer.close(index);
			   	reloadData();
		    }
		    
		    function delData(){		    
		    	var selList=$("#table").bootstrapTable('getSelections');
		    	if(selList.length==0)
		    		layer.msg('请选中删除项');
		    	else{
			    	var checkedIds= new Array();
			    	for (var i=0;i<selList.length;i++){
			    		checkedIds.push(selList[i].id);
			    	}
		    	    $.ajax({  
					    url: '/agsupport/yj-problem-report!deleteMoreJson.action',  
					    traditional: true,
					    data: {"checkedIds" : checkedIds},
					    type: "POST",
					    dataType: "json",
					    success: function(data) {
					        //alert(data.status);
					        layer.msg(data.result);
		    				reloadData();
					    }
					});
		    	}
		    }	    
		    
			function reloadData(){
				var query=new Object();
				if($("#problemName").val())
					query.problemName=$("#problemName").val();
				if($("#problemStatus").val())
					query.problemStatus=$("#problemStatus").val();
				if($("#startTime").val())
					query.startTime = getTimeLong($("#startTime").val());
				if($("#endTime").val())
					query.endTime = getTimeLong($("#endTime").val());
				$("#table").bootstrapTable('refresh', {url: '/agsupport/yj-problem-report!listJson.action',query:query});
			}
			
			function addBtnCol(value, row, index){
				return "<button id=\"btn_edit\" type=\"button\" class=\"btn btn-primary\" style=\"border:1px solid transparent;\" onclick=\"detailDialog("+row.id+")\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>详细</button>";
			}

			function detailDialog(id){
				layer.open({
					type: 2,
					title: '应急问题详细',
					maxmin: true, 
					area: ['900px', '550px'],
					content: 'ProblemReport_Input.html?id='+id
				});
			}
			
			function format_date(value, row, index){
				if(value)
					return getLocalTime(value.time);
				return '';
			}
			
function format_problemSolveTime(value, row, index){
	if(row.problemStatus == 1){
		if(value)
			return getLocalTime(value.time)
		return ''
	}
	return ''
}

 	    function closeLayer(index)
   {
	layer.close(index);
   	reloadData();
   }

function queryParams(params) {
	return {
		pageSize:params.limit,
		pageNo: params.offset/params.limit+1
	};
}

$(function(){ 
	$("#table").bootstrapTable({
		method:"post",
		contentType:"application/x-www-form-urlencoded; charset=UTF-8",
		toggle:"table",
		height:parent.$("#content-main").height()-120,								
		url:"/agsupport/yj-problem-report!listJson.action?t=" + new Date().getTime(),
		rowStyle:"rowStyle",
		toolbar: '#toolbar',
		cache: false, 
		pagination:true,
		striped: true,
		pageNumber:1, 
	    pageSize: 10,
		pageList: [10, 25, 50, 100],
		queryParams: queryParams,
		sidePagination: "server",
		columns: [
			{visible:true,checkbox:true},
			{field:'problemName',visible: true,title: '事件名称',align:'center'},
			{field:'jsdName',visible: true,title: '积水点名称',align:'center'},
			{field:'problemAction',visible: true,title: '上报指令',align:'center',formatter:formatter_action},
			{field:'problemPerson',visible: true,title: '上报人',align:'center'},
			{field:'problemTime',visible: true,title: '上报时间',align:'center',formatter:format_date},
			{field:'problemSolveTime',visible: true,title: '处理时间',align:'center',formatter:format_problemSolveTime},
			{field:'problemSolvePerson',visible: true,title: '处理人',align:'center'},
			{field:'problemStatus',visible: true,title: '状态',align:'center',formatter:format_status},
			{visible: true,title: '操作',width:100,align:'center',formatter:addBtnCol},
			{title: '处理',width:100,align:'center',formatter:formatter_deal},
		]
	});					
}); 

function format_status(value, row, index){
	if(value == 0){
		return '<span style="color:red">未处理</span>'
	}else if(value == 1){
		return '<span style="color:green">已处理</span>'
	}
}

function formatter_deal(value, row, index){
	if(row.problemStatus == 0){
		return "<button type=\"button\" class=\"btn btn-primary\" onclick=\"dealDialog("+row.id+")\">处理</button>"
	}else{
		return ""
	}
}
function formatter_action(action){
	switch(action){
		case 0:
			return "<span style='color:red'>未知</span>";
		case 1:
			return "<span style='color:#c0392b'>增援</span>";
		case 2:
			return "<span style='color:#27ae60'>撤防</span>";
		case 3:
			return "<span style='color:#9b59b6'>布防</span>";
		case 4:
			return "<span style='color:#d35400'>一般情况上报</span>";
	}
	return "<span style='color:red'>未知</span>";
}
var deal_layer;
function dealDialog(id){
	deal_layer = layer.open({
		type: 2,
		title: '问题处理',
		maxmin: true, 
		area: ['600px', '500px'],
		content: 'ProblemReport_Deal.html?id='+id
	});
}