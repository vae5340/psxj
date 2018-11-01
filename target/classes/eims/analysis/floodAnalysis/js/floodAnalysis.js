define(['jquery','layer','dateUtil','areaUtil','bootstrap','bootstrapTable','bootstrapTableCN','bootstrapDatetimepicker','bootstrapDatetimepickerCN'],function($,layer,dateUtil,areaUtil,bootstrap,bootstrapTable,bootstrapTableCN,bootstrapDatetimepicker,bootstrapDatetimepickerCN){

function formatter_unit(value, row, index) {
  if (value != null && row.UNIT) return value.toFixed(1) + row.UNIT;
  else if (value != null) return value.toFixed(1);
  else if (value == null) return "";
  else return value;
}

function formatter_normal(value, row, index) {
  if (value == null) return "";
  return value;
}

function formatter_detail(value, row, index) {
  if (row.ALARMCOUNT == null) return "";
  else if (row.ESTTYPE != 13) return "<button class='btn btn-primary itemDetailBtn' data-urlname='showMap' data-id='"+row.ITEMID+"' data-itemname='"+row.ITEMNAME+"' data-combname='"+row.COMBNAME+"'>详细</button>";// onclick=showWindow('showMap.html?itemId=" + row.ITEMID + "&combName=" + row.COMBNAME + "&itemName=" + row.ITEMNAME + "')
}

function queryParams(params) {
  return {
    limit: params.limit,
    offset: params.offset
  };
}

function showWindow(e) {
  var $btn=$(e.target),
   itemId=$btn.data('id'),
   itemName=$btn.data('itemname'),
   combName=$btn.data('combname'),
   urlname=$btn.data('urlname'),
   dateStr=dateUtil.getTimeLong($("#floodAnalysis_startTime").val());
   $.get("/psemgy/eims/analysis/floodAnalysis/"+urlname+".html",function(h){
    layer.open({
      type: 1, 
      content: h,
      title:"统计图",
      area: ['900px', '530px'],
      maxmin: false,
      success: function(layero,index){
        require(['psemgy/eims/analysis/floodAnalysis/js/'+urlname],function(urlname){
          urlname.init(itemId,itemName,combName,dateStr);
        });
      }
    });
  });  
}

function reloadData() {
  if ($("#floodAnalysis_startTime").val() == "") {
    layer.msg("请选择日期！", {icon: 0,time: 1000});
    return;
  }
  var para = "?area=" + $("#floodAnalysis_district").val() + "&estType=" + $("#floodAnalysis_sstype").val() + "&startTime=" + dateUtil.getTimeLong($("#floodAnalysis_startTime").val());
  $("#floodAnalysis_table").bootstrapTable('refresh', {
    url: "/psfacility/pscomb/rainStatistic" + para
  });
}

function initBtn(){
  $("#floodAnalysis_startTime").datetimepicker({
    language: 'zh-CN',
    format: 'yyyy-mm-dd',
    minView: 'month',
    autoclose: true,
    pickerPosition: 'bottom'
  });
  $("#floodAnalysis_btn_query").click(reloadData);
}

function initData(){
  $("#floodAnalysis_startTime").val(dateUtil.getLocalDate((new Date()).getTime()));
  $("#floodAnalysis_table").bootstrapTable({
    toggle: "table",
    url: "/psfacility/pscomb/rainStatistic",
    rowStyle: "rowStyle",
    cache: false,
    pagination: true,
    striped: true,
    pageNumber: 1,
    pageSize: 10,
    pageList: [10, 25, 50, 100],
    queryParams: queryParams,
    sidePagination: "server",
    columns: [{
      field: 'COMBNAME',
      title: '设施名称',
      align: 'center'
    }, {
      field: 'ITEMNAME',
      title: '监测项',
      align: 'center'
    }, {
      field: 'AVGVALUE',
      title: '平均值',
      align: 'center',
      formatter: formatter_unit
    }, {
      field: 'MAXVALUE',
      title: '最大值',
      align: 'center',
      formatter: formatter_unit
    }, {
      field: 'ALARMCOUNT',
      title: '预警次数',
      align: 'center',
      formatter: formatter_normal
    }, {
      title: '雨水情统计',
      formatter: formatter_detail,
      align: 'center'
    }],
    onLoadSuccess:function(){
      $('#floodAnalysis .itemDetailBtn').click(showWindow);
    }
  });

  areaUtil.setArea($('#floodAnalysis_district')); 
  // for (var index=0;index<areaUtil.xzArea.length;index++) {//var index in areaUtil.xzArea
  //   $("#floodAnalysis_district").append("<option value=" + areaUtil.xzArea[index].code + ">" + areaUtil.xzArea[index].name + "</option>")
  // }
  /*for (var i = 0; i < 6; i++){
    $('#floodAnalysis_table').bootstrapTable('hideRow', {
      index: i
    });
  }*/


}

function init(){
  initBtn();
  initData();
}
return{
  init:init
}

})

