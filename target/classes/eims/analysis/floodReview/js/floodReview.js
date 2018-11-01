define(['jquery','bootstrap','bootstrapTable','bootstrapTableCN','dateUtil','awaterui'],function($,bootstrap,bootstrapTable,bootstrapTableCN,dateUtil,awaterui){
  var layerIndex;
  function format_time(value, row, index) {
    if (value) return dateUtil.getLocalTime(value.time);
    return '';
  }

  function formatter_detail(value, row, index) {
    var repStr = row.cityYaId + "," + row.rescuePeopleNumber + "," + row.rescueCarNumber;
     if(row.reportCreateTime)
       repStr += "," + row.reportCreateTime.time;
    return "<button class='btn btn-primary itemDetailBtn' type='button' data-id='" + row.cityYaId + "'>详情</button>";//onclick=openHistory('/psemgy/eims/dispatch/pages/municipal/supervise/superviseReview.html?id=" + row.cityYaId + "')
  }

  function closeLayer() {
    layer.close(layerIndex);
    reloadData();
  }

  function queryParams(params) {
    return {
      pageSize: params.limit,
      pageNo: params.offset / params.limit + 1
    };
  }
  function openHistory(e) {
    //parent.createNewtab(url, "历史预案回顾");
    awaterui.createNewtab("/psemgy/eims/dispatch/pages/municipal/supervise/superviseReview.html","历史预案回顾",function(){
      require(["psemgy/eims/dispatch/pages/municipal/supervise/js/superviseReview"],function(superviseReview){
        superviseReview.init($(e.target).data('id'));
      }); 
    });
  }

  function initData(){
    $("#floodReview_table").bootstrapTable({
      toggle: "table",
      url: "/psemgy/yaRainReport/getCityRainReport",
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
        field: 'reportName',
        title: '雨报名称',
        align: 'center'
      },{
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
      }, {
        title: '详情',
        formatter: formatter_detail,
        align: 'center'
      }],
      onLoadSuccess:function(){
        $('.itemDetailBtn').click(openHistory);
      }
    });
  }

  function init() {
    initData();
  };


  return{
    init:init
  }
});