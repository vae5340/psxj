//数据填充	    
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) return unescape(r[2]); return "";
}

var alarmType = getQueryStr("alarmType");
var estType = getQueryStr("estType");
var deviceOwner = getQueryStr("deviceOwner");
var isCheckHis = getQueryStr("isCheckHis");
var startTime = getQueryStr("startTime");
var endTime = getQueryStr("endTime");

$("#columnTable").bootstrapTable({
	toggle:"table",
	rowStyle:"rowStyle",
	cache: false,
	striped: true,		
	columns: [
		{field: 'estType',title: '设施类型',align:'center'},
		{field: 'overTopPipe',title: '超越管顶',align:'center'}, 
		{field: 'overWell',title: '超越井盖',align:'center'},
		{field: 'sum',title: '异常总数',align:'center'}]
});
$(function () {
	getStatisticData();
	$("#columnTable tr:gt(0)").hover(
    	function () { $(this).addClass("hover") },
    	function () { $(this).removeClass("hover") }
    )
    $("#pieTable tr:gt(0)").hover(
		function () { $(this).addClass("hover") },
    	function () { $(this).removeClass("hover") }
    )
});

//获取统计表报数据
function getStatisticData(){
	$.ajax({
		method : 'GET',
		url : '/agsupport/jk-alarm-info!statReport.action',
		data:{alarmType:alarmType,estType:estType,deviceOwner:deviceOwner,isCheckHis:isCheckHis,startTime:startTime,endTime:endTime},
		async : true,
		dataType : 'json',
		success : function(data) {
			fillData(data);
		},
		error : function() {
			parent.layer.msg('获取设施设备运行数据失败');
		}
	});
}

//填充页面数据
function fillData(data){
	$.each(data.result,function(index,item){
		if(item.ALARM_TYPE==2){
			dataArray[0][ssTypes[item.EST_TYPE].order]=item.SUM_NUM;
		}else {
			dataArray[1][ssTypes[item.EST_TYPE].order]=item.SUM_NUM;
		}
	});
	$.each(ssTypes,function(index,item){
		if(item){
			var rowdata = new Object();
			rowdata.estType = item.layerName;
			rowdata.overTopPipe = dataArray[0][item.order];
			rowdata.overWell = dataArray[1][item.order];
			rowdata.sum =dataArray[0][item.order]+dataArray[1][item.order];
			$("#columnTable").bootstrapTable("insertRow", { index: item.order-1, row: rowdata });
		}
	});
	if(data){
		fillPieView(data);
		fillColumnView(data);
		fillTable(data);
	}
}

//填充柱状图视图数据
function fillPieView(data){
	$('#pieView').highcharts({
		chart: {
          	plotBackgroundColor: null,
          	plotBorderWidth: null,
          	plotShadow: false,
          	backgroundColor:'#F1F1F3'
      	},
      	title: {
          	text: '设施设备运行数据质量报表-饼状图'
      	},
      	tooltip: {
          	hideDelay:500,
          	pointFormat: '{series.name}:<b>{point.percentage:.1f}%</b>'
      	},
		plotOptions: {
			pie: {
	            allowPointSelect: true,
	            cursor: 'pointer',
	            dataLabels: {
	                enabled: true,
	                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
	                style: {
	                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                }
	            }
			}
		},
		
		series: [{
			type: 'pie',
			name: '所占比例',
			data: [{
				name: ssTypes[29].layerName+'超越井盖',
				y: dataArray[0][0]
			},{
				name: ssTypes[30].layerName+'超越井盖',
				y: dataArray[0][1]
			},{
				name: ssTypes[31].layerName+'超越井盖',
				y: dataArray[0][2]
			},{
				name: ssTypes[33].layerName+'超越井盖',
				y: dataArray[0][3]
			},{
				name: ssTypes[34].layerName+'超越井盖',
				y: dataArray[0][4]
			},{
				name: ssTypes[35].layerName+'超越井盖',
				y: dataArray[0][5]
			},{
				name: ssTypes[36].layerName+'超越井盖',
				y: dataArray[0][6]
			},{
				name: ssTypes[37].layerName+'超越井盖',
				y: dataArray[0][7]
			},{
				name: ssTypes[29].layerName+'超越管顶',
				y: dataArray[1][0]
			},{
				name: ssTypes[30].layerName+'超越管顶',
				y: dataArray[1][1]
			},{
				name: ssTypes[31].layerName+'超越管顶',
				y: dataArray[1][2]
			},{
				name: ssTypes[33].layerName+'超越管顶',
				y: dataArray[1][3]
			},{
				name: ssTypes[34].layerName+'超越管顶',
				y: dataArray[1][4]
			},{
				name: ssTypes[35].layerName+'超越管顶',
				y: dataArray[1][5]
			},{
				name: ssTypes[36].layerName+'超越管顶',
				y: dataArray[1][6]
			},{
				name: ssTypes[37].layerName+'超越管顶',
				y: dataArray[1][7]
			}]
		}]
	});
}

//填充饼状图视图数据
function fillColumnView(data){
	$('#columnView').highcharts({
		chart: {
          	type:'column',
          	plotBackgroundColor: null,
          	plotBorderWidth: null,
          	plotShadow: false,
          	backgroundColor:'#F1F1F3'
      	},
      	title: {
          	text: '设施设备运行数据质量报表-柱状图'
      	},
      	xAxis: {
      		categories: [
                '内河站降雨量',
                '水文雨量站',
                '自建雨量站',
                '路面(管渠)水位',
                '河道水位',
                '管渠流量',
                '河道流量',
                '泵站水位'
            ],
			labels:{
				y:30,//调节y偏移
				rotation:25//调节倾斜角度偏移
			}
        },
        yAxis:{
        	title:{text:'数量'}
        },
      	tooltip: {
          	hideDelay:500,
          	pointFormat: '{series.name}: <b>{point.y}</b>'
      	},
		series: [{
			name: '超越井盖',
			data: dataArray[0]
		},{
			name:'超越管顶',
            data: dataArray[1]
		}]
	});
}

//填充表格数据
function fillTable(data){
	$.each(ssTypes,function(index,item){
		if(item){
			var emptyTableItem = new Object();
			emptyTableItem.estType=item.layerName;
			emptyTableItem.overTopPipe=0;
			emptyTableItem.overWell=0;
			emptyTableItem.sum=0;
		}
	});
}

var emptyItem = new Array(0,0,0,0,0,0,0,0);
var emptyItem1 = new Array(0,0,0,0,0,0,0,0);
var dataArray = new Array(emptyItem,emptyItem1);

var ssTypes=new Array();
ssTypes[29]={order:0,layerId:'ssjk_29',layerName:'内河站降雨量'};
ssTypes[30]={order:1,layerId:'ssjk_30',layerName:'水文雨量站'};
ssTypes[31]={order:2,layerId:'ssjk_31',layerName:'自建雨量站'};
ssTypes[33]={order:3,layerId:'ssjk_33',layerName:'路面(管渠)水位'};
ssTypes[34]={order:4,layerId:'ssjk_34',layerName:'河道水位'};
ssTypes[35]={order:5,layerId:'ssjk_35',layerName:'管渠流量'};
ssTypes[36]={order:6,layerId:'ssjk_36',layerName:'河道流量'};
ssTypes[37]={order:7,layerId:'ssjk_37',layerName:'泵站水位'};
