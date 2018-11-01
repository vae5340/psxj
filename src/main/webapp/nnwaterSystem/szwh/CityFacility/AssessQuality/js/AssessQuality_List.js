function addData(){
  	layer.open({
		type: 2,
		title: '新增项目质量考核记录',
		maxmin: true, 
		area: ['900px', '550px'],
	    content: 'AssessQuality_Input.html'
	});
}
		    		    
function closeLayer(index) {
	layer.close(index);
  	reloadData();
}
		    
function delData(){		    
	var selList=$("#table").bootstrapTable('getSelections');
	if(selList.length==0)
 		layer.msg('请选中删除项');
 	else{
	  	var checkedIds= new Array();
	  	for (var i=0;i<selList.length;i++)
	  		checkedIds.push(selList[i].id);
		$.ajax({  
		    url: '/agsupport/sz-assessmentquality!deleteMoreJson.action',  
		    traditional: true,
		    data: {"checkedIds" : checkedIds},
		    type: "POST",
		    dataType: "json",
		    success: function(data) {
		        layer.msg(data.result);
		 		reloadData();
		    }
		});
	}
 }	    
		    
function reloadData(){
	var query=new Object();
	if($("#assessmentYear").val()!="")
		query.assessmentYear=$("#assessmentYear").val();
	$("#table").bootstrapTable('removeAll');
	$("#table").bootstrapTable('refresh', {url: location.protocol+"//"+location.hostname+":"+location.port+'/agsupport/sz-assessmentquality!listJson.action',query:query});
}
			
function addBtnCol(value, row, index){
	return "<button id=\"btn_edit\" class=\"btn btn-primary\" style=\"border:1px solid transparent;\" onclick=\"detailDialog("+row.id+")\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>详细</button>";
}

function format_road(value, row, index){
   return (row.dlwgScore*0.3+row.dlscslScore*0.4+row.dlbzzlScore*0.3).toFixed(2);  
}

function format_drain(value, row, index){
   return (row.pswgScore*0.3+row.psscslScore*0.4+row.psbzzlScore*0.3).toFixed(2);  
}

function format_bridge(value, row, index){
   return (row.qhwgScore*0.3+row.qhscslScore*0.4+row.qhbzzlScore*0.3).toFixed(2);  
}

function format_date(value, row, index){
	if(value)
		return getLocalTime(value.time);
	return '';
}
	
function detailDialog(id){
	layer.open({
		type: 2,
		title: '项目质量考核详细',
		maxmin: true, 
		area: ['900px', '550px'],
	    content: 'AssessQuality_Input.html?id='+id
	});
}    	

function queryParams(params) {
	return {
        pageSize:params.limit,
        pageNo: params.offset/params.limit+1
	};
}

$(function(){ 				
	$("#table").bootstrapTable({
		toggle:"table",
		height:parent.$("#content-main").height()-200,												
		url:location.protocol+"//"+location.hostname+":"+location.port+"/agsupport/sz-assessmentquality!listJson.action",
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
		    {field:'subjectUnit',visible: true,title: '受检单位',align:'center'},						
			{field:'roadScore',visible: true,title: '道路工程得分',align:'center',formatter:format_road},
			{field:'drainScore',visible: true,title: '排水工程得分',align:'center',formatter:format_drain},
			{field:'bridgeScore',visible: true,title: '桥涵工程得分',align:'center',formatter:format_bridge},
			{field:'assessmentYear',visible: true,title: '考评年份',align:'center'},
			{visible: true,title: '操作',width:100,align:'center',formatter:addBtnCol}
		]
	});					
}); 