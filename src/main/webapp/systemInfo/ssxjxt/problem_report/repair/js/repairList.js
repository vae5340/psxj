var layerIds,tableId,rowDatas=[],tables=["table_all","table_yj","table_ysk","table_pfk","table_yly","table_pm","table_fm","table_psgd","table_psgq"]
	url="";
$(function(){
	//初始化点击事件
	btn_click();
	
	for(var i=0;i<tables.length;i++){
		initTable(tables[i]);
	}
	loadMaptoQuery();
	initDatetimepicker();
	//initMyEchars();
});

function initDatetimepicker(){
	$(".form_datetime").datetimepicker({
		 format: "yyyy-mm-dd",
		 autoclose: true,
		 todayBtn: true,
		 todayHighlight: true,
		 showMeridian: true,
		 pickerPosition: "bottom-left",
		 language: 'zh-CN',//中文，需要引用zh-CN.js包
		 startView: 2,//月视图
		 minView: 2//日期时间选择器所能够提供的最精确的时间选择视图
	 });
}

function initMyEchars(){
	if(options){
		option = options;
		option.title.text="数据修正统计";
		option.series[0].name="数据修正统计";
		myChar = echarts.init(document.getElementById('chartContainer'));
		myChar.setOption(option);
		window.onresize = myChar.resize; //自适应窗口大小
	}
}
function btn_click(){
	//parentMethod('6');
	//tableId="table_yj";
	$("#panel_all_").click(function(){
		loadMaptoQuery();
		tableId="table_all";
		layerIds="";
	});
	$("#panel_yj_").click(function(){
		parentMethod('5');
		tableId="table_yj";
	});
	$("#panel_ysk_").click(function(){
		parentMethod('4');
		tableId="table_ysk";
	});
	$("#panel_pfk_").click(function(){
		parentMethod('2');
		tableId="table_pfk";
	});
	$("#panel_yly_").click(function(){
		parentMethod('1');
		tableId="table_yly";
	});
	$("#panel_pm_").click(function(){
		parentMethod('3');
		tableId="table_pm";
	});
	$("#panel_fm_").click(function(){
		parentMethod('0');
		tableId="table_fm";
	});
	$("#panel_psgd_").click(function(){
		parentMethod('6');
		tableId="table_psgd";
	});
	$("#panel_psgq_").click(function(){
		parentMethod('7');
		tableId="table_psgq";
	});
}
var quertResult = function(result){
	var rows=[];
	var features = result.features;
	for(var i=0;i<features.length;i++){
		var form = features[i].attributes;
		rows[i] = form;
	}
	loadDataTable(tableId,rows);
}


Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
    (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
        RegExp.$1.length == 1 ? o[k] :
        ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

//UTC时间转换
function GetTimeByTimeStr(dateStr,type) {
	var t=dateStr+" 00:00:00";
	var d = new Date(t);
	if("start" == type){
		return new Date(d.getTime()-8*60*60*1000).format("yyyy-MM-dd hh:mm:ss");
	}else{
		return new Date(d.getTime()-8*60*60*1000+24*60*60*1000).format("yyyy-MM-dd hh:mm:ss");
	}
}
//调取父页面的方法
function parentMethod(layerId){
	where = "1=1 and REPAIR_DAT is not null";
	var startTime = $("#startTime").val();
    var endTime =  $("#endTime").val();
    if(startTime){
        var utcStartTime=GetTimeByTimeStr(startTime,"start");
    	where = where+" and REPAIR_DAT>=date '"+utcStartTime+"'";
    }
    if(endTime){
    	var utcEndTime=GetTimeByTimeStr(endTime,"end");
    	where = where+" and REPAIR_DAT<=date '"+utcEndTime+"'";
    }
	layerIds=layerId;
	window.parent.querysData("",layerId,where,quertResult);
}

//初始化table
function initTable(tableId){
	$("#"+tableId).bootstrapTable({
		toggle:"tableCell",
		//data: rows,
		rowStyle:"rowStyle",
		cache:false,
		pagination:true,
		dataType:'json',
		striped:true,
		pageNumber:1,
		pageSize:10,
		pageList:[10,25,50,100],
		//queryParams:Table.queryParams,
		sidePagination:"client",
		clickToSelect:true,
		columns:[
			{field:'OBJECTID',title:'设施编号',visible:false,align:'center'},
			{field:'layerId',title:'layerId',visible:false,align:'center'},
			{field:'DISTRICT',title:'所属区域',visible:true,align:'center'},
			//{field:'layerName',title:'设施类型',visible:true,align:'center',formatter: format_comb},
			{field:'REPAIR_COM',title:'调查单位',visible:true,align:'center'},
			{field:'REPAIR_DAT',title:'调查日期',visible:true,align:'center',formatter: format_Data},
			{field:'SORT',title:'类别',visible:true,align:'center'},
			{field:'x',title:'经度',visible:false,align:'center'},
			{field:'y',title:'纬度',visible:false,align:'center'},
			{field:'STATE',title:'设施状态',visible:true,align:'center'},
			{field:'DATA_ORIGI',title:'数据来源',visible:true,align:'center'},
			{field:'MANAGEDEPT',title:'管理单位',visible:true,align:'center'},
			{field:'OWNERDEPT',title:'权属单位',visible:true,align:'center'},
			{title:'操作',visible:true,align:'center',formatter: format_ck}
		]
	});
}
function format_ck(value,row,index){
	var b="",a ="",c ="";
	if(layerIds){
		c ='<button type="button" class="btn btn-primary btn-sm" onclick="updateRepair('+row.OBJECTID +','+layerIds+')">修改</button>';
		a ='<button type="button" class="btn btn-primary btn-sm" onclick="delRepair('+row.OBJECTID +','+layerIds+')">删除</button>';
	}
	if(row.x && row.y){
		b= "<button type=\"button\" class=\"btn btn-primary btn-sm\"" +
		"onclick=\"openMapToPoint('"+row.x+"','"+row.y+"')\">" +
		"定位</button>";
	}else{
		b = "<button type=\"button\" class=\"btn btn-primary btn-sm\"" +
		"onclick=\"openMap('"+layerIds+"','"+row.OBJECTID+"')\">" +
		"定位</button>";
	}
	return c+a+b;
}
function format_Data(value,row,index){
	if(value){
		return getLocalTime(value);
	}else{
		return '';
	}
}
function format_comb(value,row,index){
	if(value=='0')
		return '阀门';
	else if(value=='1')
		return '溢流堰';
	else if(value=='2')
		return '排放口';
	else if(value=='3')
		return '拍门';
	else if(value=='4')
		return '雨水口';
	else if(value=='5')
		return '窨井';
	else if(value=='6')
		return '排水管道';
	else if(value=='7')
		return '排水沟渠';
	else return '';
}
function openMap(layerId,objId){
	toMap();
	window.parent.openQuerys(objId,layerId);
}
function openMapToPoint(x,y){
	toMap();
	window.parent.positPoint(x,y);
}
//跳回到map地图
function toMap(){
	var aTab = parent.$(".page-tabs-content a[data-id*='wrapper-map']");
    aTab.addClass("active").siblings(".J_menuTab").removeClass("active");
    var aContent = parent.$(".J_mainContent .J_iframe[data-id*='wrapper-map']");
    aContent.show().siblings(".J_iframe").hide();
}
//时间排序
function sortTime(a,b){  
    return b.REPAIR_DAT-a.REPAIR_DAT  
}
function reloadMapToQuery(){
	url="";
	loadMaptoQuery();
}
//初始化查询
function loadMaptoQuery(){
	rowDatas=[];
	var ids=[0,1,2,3,4,5,6,7];
	var ik=0;
	var where = "1=1 and REPAIR_DAT is not null";// and FLAG_ is not null
	var startTime = $("#startTime").val();
    var endTime =  $("#endTime").val();
    if(startTime){
        var utcStartTime=GetTimeByTimeStr(startTime,"start");
    	where = where+" and REPAIR_DAT>=date '"+utcStartTime+"'";
    }
    if(endTime){
    	var utcEndTime=GetTimeByTimeStr(endTime,"end");
    	where = where+" and REPAIR_DAT<=date '"+utcEndTime+"'";
    }
	for(var i=0;i<ids.length;i++){
		var layer_id = ids[i];
		window.parent.querysData(url,layer_id,where,function(result){
			var rows=[];
			var features = result.features;
			for(var i=0;i<features.length;i++){
				var geometry = features[i].geometry;
				var form = features[i].attributes;
				form.layerId = layer_id;
				if(geometry && geometry.type=='point'){
					form.x = geometry.x;
					form.y = geometry.y;
				}
				rowDatas.push(form);
			}
			if(ik==6)
				if(rowDatas && rowDatas.length>0)
					loadDatas(rowDatas);
				else
					reloadMapToQuery();
			ik++;
		});
	}
	//console.log(rowDatas);
}
/*var quertResultList = function(result){
	
}*/
function loadDataTable(tableId,rows){
	rows.sort(sortTime);
	row=[];
	for(var i=0;i<rows.length;i++){
		row[i] = rows[i];
	}
	$("#"+tableId).bootstrapTable('load',row);
}
function loadDatas(data){
	data.sort(sortTime);
	rows=[];
	for(var i=0;i<data.length;i++){
		rows[i] = data[i];
	}
	$("#table_all").bootstrapTable('load',rows);
}

//查看详情
function add(){
	layer.open({
		type: 2,
		area: ['850px', '550px'],
		title : "新增",	
		maxmin: true,
		btn:['保存','取消'],
		content: ['/psxj/systemInfo/ssxjxt/problem_report/repair/repairInput.html?id=&type=add', 'yes'],
		btn1: function(index,layero){
//			var form = $(layero).find("iframe")[0].contentWindow.document.getElementById("jbqkForm");
			$(layero).find("iframe")[0].contentWindow.save();
	    },cancel: function(index, layero){
			layer.close(index)
        }
	});
}
function updateRepair(objectid,layerId){
	layer.open({
		type: 2,
		area: ['850px', '550px'],
		title : "新增",	
		maxmin: true,
		btn:['保存','取消'],
		content: ['/psxj/systemInfo/ssxjxt/problem_report/repair/repairInput.html?objectid='+objectid+'&layerId='+layerId+'&type=add', 'yes'],
		btn1: function(index,layero){
			$(layero).find("iframe")[0].contentWindow.update();
		},cancel: function(index, layero){
			layer.close(index)
		}
	});
}
//删除
function delRepair(objectid,layerId){
	layer.confirm('确定删除？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
    	$.ajax({
            type: 'post',
            url: '/psxj/repair!delRepair.action',
            data: {objectid: objectid,layerId:layerId},
            dataType: 'json',
            success: function (data) {
            	if(data.success){
            		refreshTable();
            		layer.alert('删除成功！');
            	}else{
            		if(data.code=="500"){
            			layer.alert('删除失败！');
            		}else{
            			refreshTable();
            			layer.alert(data.message);
            		}
            	}
            }
    	});
    }, function () {
        return;
    });
}
function refreshTable(){
	if(layerIds){
		parentMethod(layerIds);
	}else{
		loadMaptoQuery();
	}
}

//清空
function resets(){
	$('#myform')[0].reset();
	refreshTable();
}
