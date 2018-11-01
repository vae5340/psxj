define(['jquery','bootstrap','bootstrapTable','bootstrapTableCN','layer','dateUtil','awaterui','mousewheel','customScrollbar'],function($,bootstrap,bootstrapTable,bootstrapTableCN,layer,dateUtil,awaterui,mousewheel,customScrollbar){
  var layerIndex;
  function addData() {
    var selectRows = $('#rainNewList_table').bootstrapTable('getSelections');
    if (selectRows.length > 0) {
      $.ajax({
        type: 'post', 
        url :  location.protocol + "//" + location.hostname + ":" + location.port + '/psemgy/yaRainReport/saveDistrictJson',
        //url :  location.protocol + "//" + location.hostname + ":" + location.port + '/psemgy/yaRainReport/createDisReport',
        data: {"cityYaId": selectRows[0].cityYaId},
        dataType :  'json',
        success :  function(data)  {
          layer.msg(data.result);
          showWindow(data.form.id);
          setTimeout("layer.closeAll()", 2000);
        },
        error : function(e)  {
          console.log("addData！"+e);
          layer.msg("新增失败！", {icon: 2,time: 1000});
        }
      });
    } else {
      layer.msg("请选择新增项", {icon: 0,time: 1000});
    }
  }

  function cancel() {
    layer.close(layerIndex);
  }

  function showWindow(id) {
    // var url = "/psemgy/eims/dispatch/pages/district/rainReport/list.html?id=" + id;
    // parent.parent.createNewtab(url, "防汛应急响应一雨一报");
    awaterui.createNewtab("/psemgy/eims/dispatch/pages/municipal/rainReport/list.html","防汛应急响应一雨一报",function(){
      require(["psemgy/eims/dispatch/pages/municipal/rainReport/js/list"],function(list){
        list.init(id);
      }); 
    });
  }

  function format_time(value, row, index) {
    if (value) return dateUtil.getLocalTime(value);
    return '';
  }
  function initBtn(){
    $("#rainNewListAddBtn").click(addData);
    $("#rainNewListCancelBtn").click(cancel);
  }
  function initData(){
    $.ajax({
      method :  'GET',
      url :  location.protocol + "//" + location.hostname + ":" + location.port + '/psemgy/yaRainReport/getCityRRNoReport.action',
      async :  false,
      success : function(data)  {
        $("#rainNewList_table").bootstrapTable({
          toggle: "table",
          data: JSON.parse(data).rows,
          height: 300,
          rowStyle: "rowStyle",
          cache: false,
          striped: true,
          pagination: true,
          singleSelect: true,
          clickToSelect: true,
          columns: [{
            visible: true,
            checkbox: true
          }, {
            field: 'reportName',
            title: '雨报名称',
            align: 'center'
          }, {
            field: 'rescuePeopleNumber',
            title: '出动救援人员',
            align: 'center'
          }, {
            field: 'rescueCarNumber',
            title: '出动救援车辆',
            align: 'center'
          }, {
            field: 'reportCreateTime',
            title: '报告时间',
            align: 'center',
            formatter: format_time
          }, {
            field: 'reportCreater',
            title: '报告人',
            align: 'center'
          }]
        });
      },
      error : function(e)  {
       layer.msg("初始化数据失败！", {icon: 2,time: 1000});
      }
    });
  }
  function init(_layerIndex) {
    layerIndex=_layerIndex
    initData();
    initBtn();
  };
  return{
    init:init
  }
});
