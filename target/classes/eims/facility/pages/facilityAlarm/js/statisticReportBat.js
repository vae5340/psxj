define(['jquery','layer','dateUtil','areaUtil','bootstrap','bootstrapTable','bootstrapTableCN','highcharts','highchartsExporting','highchartsCN'],function($,layer,dateUtil,areaUtil,bootstrap,bootstrapTable,bootstrapTableCN,highcharts,highchartsExporting,highchartsCN){

  var dataArray = new Array(0,0,0,0,0,0,0,0);

  var ssTypes=new Array();
  ssTypes[29]={order:0,layerId:'ssjk_29',layerName:'内河站降雨量'};
  ssTypes[30]={order:1,layerId:'ssjk_30',layerName:'水文雨量站'};
  ssTypes[31]={order:2,layerId:'ssjk_31',layerName:'自建雨量站'};
  ssTypes[33]={order:3,layerId:'ssjk_33',layerName:'路面(管渠)水位'};
  ssTypes[34]={order:4,layerId:'ssjk_34',layerName:'河道水位'};
  ssTypes[35]={order:5,layerId:'ssjk_35',layerName:'管渠流量'};
  ssTypes[36]={order:6,layerId:'ssjk_36',layerName:'河道流量'};
  ssTypes[37]={order:7,layerId:'ssjk_37',layerName:'泵站水位'};
  //填充页面数据
  function fillData(data){
    debugger;
  	$.each(data.rows,function(index,item){
  		dataArray[ssTypes[item[1]].order]=item[0];
  	});
  	$.each(ssTypes,function(index,item){
  		if(item){
  			var rowdata = new Object();
  			rowdata.estType = item.layerName;
  			rowdata.outTime = dataArray[item.order];
  			$("#statisticReportBat_columnTable").bootstrapTable("insertRow", { index: item.order-1, row: rowdata });
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
    $('#statisticReportBat_pieView').highcharts({
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
          name: ssTypes[29].layerName,
          y: dataArray[0]
        },{
          name: ssTypes[30].layerName,
          y: dataArray[1]
        },{
          name: ssTypes[31].layerName,
          y: dataArray[2]
        },{
          name: ssTypes[33].layerName,
          y: dataArray[3]
        },{
          name: ssTypes[34].layerName,
          y: dataArray[4]
        },{
          name: ssTypes[35].layerName,
          y: dataArray[5]
        },{
          name: ssTypes[36].layerName,
          y: dataArray[6]
        },{
          name: ssTypes[37].layerName,
          y: dataArray[7]
        }]
      }]
    });
  }

  //填充饼状图视图数据
  function fillColumnView(data){
    $('#statisticReportBat_columnView').highcharts({
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
        type: 'category'
      },
      yAxis:{
        title:{text:'数量'}
      },
      tooltip: {
        hideDelay:500,
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '电量报警数量：<b>{point.y}</b>'
      },
      series: [{
        name: '内河站降雨量',
        data: [dataArray[0]]
      },{
        name: '水文雨量站',
        data: [dataArray[1]]
      },{
        name: '自建雨量站',
        data: [dataArray[2]]
      },{
        name: '路面(管渠)水位',
        data: [dataArray[3]]
      },{
        name: '河道水位',
        data: [dataArray[4]]
      },{
        name: '管渠流量',
        data: [dataArray[5]]
      },{
        name: '泵站水位',
        data: [dataArray[6]]
      },{
        name: '河道流量',
        data: [dataArray[7]]
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

  function initColumnTable(){
    $("#statisticReportBat_columnTable").bootstrapTable({
      toggle:"table",
      rowStyle:"rowStyle",
      cache: false,
      striped: true,    
      columns: [
      {field: 'estType',title: '设施类型',align:'center'},
      {field: 'outTime',title: '电量报警',align:'center'}]
    });
  }
  //获取统计表报数据
  function getStatisticData(){
    $.ajax({
      method : 'GET',
      url : '/agsupport/jk-alarm-info!statReportBat.action',
      async : true,
      dataType : 'json',
      success : function(data) {
        fillData(data);
      },
      error : function() {
        layer.msg('获取设施设备运行数据失败');
      }
    });
  }
  
  function init() {
    initColumnTable();
    getStatisticData();
    $("#statisticReportBat_columnTable tr:gt(0)").hover(
     function () { $(this).addClass("hover") },
     function () { $(this).removeClass("hover") }
     )
    $("#statisticReportBat_pieTable tr:gt(0)").hover(
      function () { $(this).addClass("hover") },
      function () { $(this).removeClass("hover") }
      )
  };
  return{
    init:init  
  }
});