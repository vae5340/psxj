function format_icon(value,row,index){
	if(row.alarmType==1)
		return "<img src='/awater/img/danger.png' width='18' height='18'>";
	else
		return "<img src='/awater/img/exclamation.png' width='18' height='18'>";
}	       
function format_color(value,row,index){
	return "<font style='color:red;'>"+value+"米</button>";
}	     
function format_time(value,row,index){
	if(value)
		return getLocalTime(value.time);
	return '';
}	     
function queryParams(params) {
	if($("#isCheckHis").is(':checked')==true){
		return {
			pageSize:params.limit,
			pageNo: params.offset/params.limit+1,
			alarmType:$("#alarmType").val(),
			estType:$("#estType").val(),
			deviceOwner:$("#deviceOwner").val(),
			isCheckHis:$("#isCheckHis").is(':checked'),
			startTime:$("#startTime").val(),
			endTime:$("#endTime").val()
		};
	} else {
		return {
			pageSize:params.limit,
			pageNo: params.offset/params.limit+1,
			alarmType:$("#alarmType").val(),
			estType:$("#estType").val(),
			deviceOwner:$("#deviceOwner").val(),
			isCheckHis:$("#isCheckHis").is(':checked')
		};
	}
}
    
function format_type(value, row, index){
	if(value==2)
		return '超越管顶';
	else if(value==3)
		return '超越井盖'
	return value;
}

function format_combName(value, row, index){
	return "<a onclick='locationComb("+row.combId+")'>"+value+"</a>";
}

function format_owner(value, row, index){
	for(var i=0;i<nnArea.length;i++){
		if(nnArea[i].code==value)
			return nnArea[i].name;
	}
	return '';
}
var nnArea=[];
$(function(){
	nnArea.push({code:'450102',name:'B区'});
	nnArea.push({code:'450103',name:'H区'});
	nnArea.push({code:'450105',name:'A区'});
	nnArea.push({code:'450107',name:'D区'});
	nnArea.push({code:'450108',name:'C区'});
	nnArea.push({code:'450109',name:'E区'});
	nnArea.push({code:'450122',name:'J区'});
	nnArea.push({code:'450123',name:'K区'});
	nnArea.push({code:'450124',name:'L区'});
	nnArea.push({code:'450125',name:'M区'});
	nnArea.push({code:'450126',name:'N区'});
	nnArea.push({code:'450127',name:'O区'});
	
	$("#table").bootstrapTable({
		toggle:"table",
		url:"/agsupport/jk-alarm-info!listJson.action",
		rowStyle:"rowStyle",
		cache: false, 
		pagination:true,
		striped: true,
		pageNumber:1,
		pageSize: 10,
		pageList: [10, 25, 50, 100],
		queryParams: queryParams,
		sidePagination: "server",
		columns: [{field: 'icon',title: '',visible: true,align:'center',formatter:format_icon},
			{field: 'id',title: '报警编号',visible: false,align:'center'},
			{field: 'combId',title: '设施编号',visible: false,align:'center'},
			{field: 'combName',title: '设施地址',align:'center',formatter:format_combName}, 
			{field: 'deviceId',title: '设备编号',visible: false,align:'center'},
			{field: 'deviceName',title: '设备名称',align:'center'},
			/*{field: 'deviceOwner',title: '设备权属单位',align:'center',formatter:format_owner},*/
			{field: 'itemDimId',title: '监控项编号',visible: false,align:'center',}, 
			{field: 'itemDimName',title: '监控项名称',align:'center'}, 
			{field: 'alarmValue',title: '监控值',align:'center',formatter:format_color},
			{field: 'alarmDate',title: '监控日期',align:'center',formatter:format_time}, 
			{field: 'alarmType',title: '监控类型',align:'center',formatter:format_type},
			/*{field: 'alarmDescription',title: '监控描述',align:'center'}*/]
	});
	$("#startTime").datetimepicker({
       	language: 'zh-CN',
		format: 'yyyy-mm-dd',
		autoclose:true,
		minView:4,
		pickerPosition:'bottom-right'
	});
	$("#endTime").datetimepicker({
       	language: 'zh-CN',
		format: 'yyyy-mm-dd',
		autoclose:true,
		minView:4,
		pickerPosition:'bottom-right'
	});
	$("#isCheckHis").change(function() { 
		toggleHistory();
	});
});

function reloadData(){
	var query=new Object();
	if($("#alarmType").val()!="")
		query.alarmType=$("#alarmType").val();
	if($("#estType").val()!="")
		query.estType=$("#estType").val();
	if($("#deviceOwner").val()!="")
		query.deviceOwner=$("#deviceOwner").val();
	query.isCheckHis=$("#isCheckHis").is(':checked');
	if($("#isCheckHis").is(':checked')==true){
		query.startTime=$("#startTime").val();
		query.endTime=$("#endTime").val();
	}
	$("#table").bootstrapTable('refresh', {url: '/agsupport/jk-alarm-info!listJson.action',query:query});
}

function objToQueryStr(obj){
	var query = "?",
		first = true,
		prop;
	if(obj){
		for(prop in obj){
			if(!obj.hasOwnProperty(prop)){
				continue;
			}
			if(!first){
				query += "&";
			}else{
				first = false;
			}
			
			query += prop+"="+obj[prop];
		}
	}
	return query;
}

function exportExcel(){
	var params = queryParams({
		'limit': 1,
		'offset': 0
	}), queryStr, url;
	
	delete params.pageSize;
	delete params.pageNo;
	
	$.extend(params, {
		'page.pageSize': 99999999,
		'page.pageNo': 1
	});
	
	queryStr = objToQueryStr(params);
	url = '/agsupport/jk-alarm-info!exportJkAlarmExcel.action' + queryStr;
	window.open(url);
}

function toggleHistory(){
	$('#timeQueryTitle').toggle();
	$('#startTime').toggle();
	$('#timeSpan').toggle();
	$('#endTime').toggle();
	reloadData();
}

function locationComb(combId){
	$.ajax({
		url: '/agsupport/ps-comb!inputJson.action?id='+combId,
        type: 'get',
        cache:false,
        dataType:'json',
        success: function(data){
        	data.combId=data.id;
        	parent.showInfoWindowByPoint(data);
        },
        error: function(){
        	alert("error");
        }
	});
}

function statisticReport(){
	var param = statReportParam();
	var queryStr = objToQueryStr(param);
	layer.open({
		type: 2,
		title: "设施设备质量报表",
		shadeClose: true,
		shade: 0,
		area: ['860px', '520px'],
		content: ["/awater/nnwaterSystem/AlarmCenter/FacilityAlarm/statisticReport.html"+queryStr]
	});
}

function statReportParam() {
	if($("#isCheckHis").is(':checked')==true){
		return {
			alarmType:$("#alarmType").val(),
			estType:$("#estType").val(),
			deviceOwner:$("#deviceOwner").val(),
			isCheckHis:$("#isCheckHis").is(':checked'),
			startTime:$("#startTime").val(),
			endTime:$("#endTime").val()
		};
	} else {
		return {
			alarmType:$("#alarmType").val(),
			estType:$("#estType").val(),
			deviceOwner:$("#deviceOwner").val(),
			isCheckHis:$("#isCheckHis").is(':checked')
		};
	}
}