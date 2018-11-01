define(['jquery','bootstrap','bootstrapTable','bootstrapTableCN','layer','dateUtil','awaterui','mousewheel','customScrollbar'],function($,bootstrap,bootstrapTable,bootstrapTableCN,layer,dateUtil,awaterui,mousewheel,customScrollbar){
  var districtUnitId,layerIndex,districtName;

  function format_time(value, row, index) {
    if (value) return dateUtil.getLocalTime(value);
    return '';
  }

  function formatter_district(value, row, index) {
    return districtName;
  }

  function formatter_detail(value, row, index) {
    return "<button class='btn btn-primary itemDetailBtn' type='button' data-id='"+row.id+"'>详情</button>"; //onclick=openyyyb('" + row.id + "')
  }

  function closeLayer() {
    layer.close(layerIndex);
    reloadData();
  }
  function openyyyb(e) {
    var id=$(e.target).data('id');
    awaterui.createNewtab("/psemgy/eims/dispatch/pages/district/rainReport/list.html","防汛应急响应一雨一报",function(){
      require(["psemgy/eims/dispatch/pages/district/rainReport/js/list"],function(list){
        list.init(id);
      }); 
    });

  }
  function reloadData(){
    $("#planListCyTable").bootstrapTable('refresh');  
  }

  function queryParams(params) {
    return {
      pageSize: params.limit,
      pageNo: params.offset / params.limit + 1
    };
  }

  function addData() {
    $.get("/psemgy/eims/dispatch/pages/municipal/rainReport/rainNewList.html",function(h){
      layer.open({
        type: 1, 
        content: h,
        title: '选择市级一雨一报',
        shadeClose: true,
        shade: 0.5,
        area: ['800px', '400px'],
        success: function(layero,index){
           require(['psemgy/eims/dispatch/pages/municipal/rainReport/js/rainNewList'],function(rainNewList){
               rainNewList.init(index);
           });
        }
      });     
    });  
  }
  function delData(){       
    var selList=$("#planListCyTable").bootstrapTable('getSelections');
    if(selList.length==0)
      layer.msg('请选中删除项', {icon: 0,time: 1000});
    else{
      layerIndex=layer.confirm('是否删除选中项？', {
        btn: ['是','否'] //按钮
      }, 
      function(){
        var checkedIds= new Array();
        for (var i=0;i<selList.length;i++){
          checkedIds.push(selList[i].id);
        }
        $.ajax({  
          url: location.protocol+"//"+location.hostname+":"+location.port+'/psemgy/yaRainReport/deleteMoreJson',
          traditional: true,
          data: {"checkedIds" : checkedIds},
          type: "POST",
          dataType: "json",
          success: function(data) {
            layer.msg(data.result);
            closeLayer();
          }
        });
      }, 
      function(){

      });

    }
  }


  function initData(){
    var url;
    if (!districtUnitId||districtUnitId == "") url =  "/psemgy/yaRainReport/getDistrictRainReport";
    else url = "/psemgy/yaRainReport/getDistrictRainReport?districtUnitId=" + districtUnitId;
    $("#planListCyTable").bootstrapTable({
      toggle: "table",
      height: $("#content-main").height() - 150,
      url: url,
      rowStyle: "rowStyle",
      cache: false,
      striped: true,
      sidePagination: "server",
      columns:[
        {visible:true,checkbox:true},
        {field:'reportName',title:'雨报名称',align:'center'},
        {title:'成员单位',formatter:formatter_district,align:'center'},
        {field:'rescuePeopleNumber',title:'出动救援人员',align:'center'},
        {field:'rescueCarNumber',title:'出动救援车辆',align:'center'},
        {field:'reportCreateTime',title:'报告时间',align:'center',formatter:format_time},
        {field:'reportCreater',title:'报告人',align:'center'},
        {title:'详情',formatter:formatter_detail,align:'center'}
      ],
      onLoadSuccess:function(){
        $('#planListCy .itemDetailBtn').click(openyyyb);
      }
    });
  }

  function initBtn(){
    $("#planListCyAddBtn").click(addData);
    $("#planListCyDeleteBtn").click(delData);
  }

  function init(_districtUnitId) {
    if(_districtUnitId&&_districtUnitId!='')
      districtUnitId=_districtUnitId

    $.ajax({
      method :  'GET',
      url :  '/agsupport/om-org!getOrganizationName.action',
      async :  false,
      success :function(data)  {
        districtName = data;
        $("#title").html(districtName + "一雨一报");
      },
      error : function(e)  {
        layer.msg("初始化标题数据发生错误！", {icon: 0,time: 1000});
        console.log('error'+e);
      }
    });
    initData();
    initBtn();
  };

  return{
    init:init
  }
});
   
