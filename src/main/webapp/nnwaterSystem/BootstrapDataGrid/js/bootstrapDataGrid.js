function changeTable(heightValue){
	$('#table').bootstrapTable('resetView', {
		height: heightValue-200
	});
}
//数据填充	    
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) return unescape(r[2]); return "";
}
var type = getQueryStr("type");//设施类型
var equipType = getQueryStr("equipType");//设备类型

function showPoint(){
	var frames=window.parent.window.document.getElementById("main"); 
	frames.contentWindow.getInfo(); 
}
function reloadData(){
	var paramData;
	if(type.indexOf(",")!=-1){
		var types = type.split(",");
		paramData = new Array();
		for(var i  in types)
			paramData.push(types[i]);
	} else 
		paramData = type;
	var para="?equipType="+encodeURIComponent(equipType);
	if($("#districtName").val()!="")
		para+="&area="+encodeURIComponent($("#districtName").val());//所在区
	if($("#combName").val()!="")
	    para+="&combName="+encodeURIComponent($("#combName").val());//设备名称			
	if($("#dataSource").val()!="")
	    para+="&orgDept="+encodeURIComponent($("#dataSource").val());//数据来源

	if(type=="29,30,31"&equipType=="雨量计")
		para+="&order=desc&sort=comb.org_dept,dvalue";
	else
		para+="&order=desc&sort=dvalue";
	$.ajax({
		url: '/agsupport/ps-comb!obtainMonitorList.action'+para,
		dataType: 'json',
		data:{"estType":paramData},
		cache:false,
		success: function (data){
		    $("#totalNum").html("记录总数："+data.length+"条");
			$("#table").bootstrapTable('refreshOptions', {data:data});	    
		},
		error : function() {
			parent.layer.msg('请求失败');
		}
	});	
}
	
function showTabWindow(url){
	parent.createNewtab(url,"设备详情");	
}
var $table = $('#table'), $remove = $('#re_send_selected');

function format_device(value, row, index){
	if(row.devicename!=null)
    	return row.combname+row.devicename;
	return row.combname; 
}

function format_value(value, row, index){
    return row.dvalue+row.unit;
}

function format_warnLimit2(value, row, index){
	if(value)
		return value;
	else
		return "";
}

function format_item(value, row, index){
	var alarmIcon="";
	if(!value)
		return "";
	if(value>0){
		switch(row.esttype){
			case 29: 
				if(value<=2)
					alarmIcon="point_15px_jyt_y";
				else
					alarmIcon="point_15px_jyt_r";
				break; 
			case 30: 
				if(value<=2)
					alarmIcon="point_15px_jyt_y";
				else
					alarmIcon="point_15px_jyt_r";
				break;
			case 31: 
				if(value<=2)
					alarmIcon="point_15px_jyt_y";
				else
					alarmIcon="point_15px_jyt_r";
				break;
			case 33: 
				if(value<=2)
					alarmIcon="point_15px_jxsw_y";
				else
					alarmIcon="point_15px_jxsw_r";
				break;
			case 34: 
				if(value<=2)
					alarmIcon="point_15px_jxsw_y";
				else
					alarmIcon="point_15px_jxsw_r";
				break;
			case 35: 
				if(value<=2)
					alarmIcon="point_15px_nhzd_y";
				else
					alarmIcon="point_15px_nhzd_r";
				break;
			case 36: 
				if(value<=2)
					alarmIcon="point_15px_nhzd_y";
				else
					alarmIcon="point_15px_nhzd_r";
				break;
			case 37: 
				if(value<=2)
					alarmIcon="point_15px_jxsw_y";
				else
					alarmIcon="point_15px_jxsw_r";
				break;
			default:
				alarmIcon=""; 
		}
	}
	if(alarmIcon!="")
		return "<img src='/awater/waterSystem/ssjk/img/legend_15x15/gif/"+alarmIcon+".gif' width=16 height=16></img>";
	else
		return "";
}

$(function(){
	for(var index in nnArea)
		$("#districtName").append("<option value="+nnArea[index].code+">"+nnArea[index].name+"</option>");	        
	if($("#dataSource").val()==""){
		var paramData;
		if(type.indexOf(",")!=-1){
			var types = type.split(",");
			paramData = new Array();
			for(var i  in types)
				paramData.push(types[i]);
		} else 
			paramData = type;
		$.ajax({
			url: '/agsupport/ps-comb!findDeptByEstType.action',
			data:{"estType":paramData},
			dataType: 'json',
			cache:false,
			success: function (data){			  
				for(var index in data){ 
			  		for(var key in data[index]){
			     		$("#dataSource").append("<option value="+data[index][key]+">"+data[index][key]+"</option>");	        			  
			  		}	
				}		
			},
			error : function(){
				parent.layer.msg('请求失败');
			}
		});
	}
	var paramData;
	if(type.indexOf(",")!=-1){
		var types = type.split(",");
		paramData = new Array();
		for(var i  in types)
			paramData.push(types[i]);
	} else 
		paramData = type;
	var queryUrl="?equipType="+encodeURIComponent(equipType);
	if(type=="29,30,31"&equipType=="雨量计")
		queryUrl+="&order=desc&sort=comb.org_dept,dvalue";
	else
		queryUrl+="&order=desc&sort=dvalue";
	$.ajax({
		url: '/agsupport/ps-comb!obtainMonitorList.action'+queryUrl,
		data:{"estType":paramData},
		dataType: 'json',
		cache:false,
		success: function (data){
			$("#totalNum").html("记录总数："+data.length+"条");			
			$("#table").bootstrapTable({
				toggle:"table",
				height:parent.window.$("#leftMenuTableDiv").height()-220,
				data: data,
				rowStyle:"rowStyle",
				cache: false, 
				striped: true,
				sidePagination: "server",
				columns:[
					{visible: true,title: '设备名称',field:'combname',align:'center',formatter:format_device},
					{visible: true,title: '监测值',field:'dvalue',align:'center',formatter:format_value},
					{visible: true,title: '上限值',field:'warnlimit2',align:'center',formatter:format_warnLimit2},
					{visible: true,title: '报警',field:'status',align:'center',formatter:format_item}
		    	]
			});
			if(getQueryStr("tableTitleName")=="视频监控"){
				$table.bootstrapTable('hideColumn', 'dvalue');
				$table.bootstrapTable('hideColumn', 'status');
				$table.bootstrapTable('hideColumn', 'warnlimit2');
			}
		},
		error : function() {
			parent.layer.msg('请求失败');
		}
	});
	
   	$("#table").on('post-body.bs.table', function (row,obj) {
		$(".fixed-table-body").mCustomScrollbar({
			mouseWheelPixels:300
		});				
	});
	
	$table.on('click-row.bs.table', function (row,obj) {
		window.parent.showInfoWindowByPoint(obj);
	});
});