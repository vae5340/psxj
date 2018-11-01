define(['jquery','bootstrap','bootstrapTable','bootstrapTableCN','bootstrapDatetimepicker','bootstrapDatetimepickerCN','layer','dateUtil','content'],function($,bootstrap,bootstrapTable,bootstrapTableCN,bootstrapDatetimepicker,bootstrapDatetimepickerCN,layer,dateUtil,content){

  //表格查询参数设置
  function queryParams(params) {
    return {
      pageSize:params.limit,
      pageNo: params.offset/params.limit+1
    };
  }

  function format_phone(value, row, index){   
    if(value) return value;
    return "";   
  }

  function format_date(value, row, index){
    if(value){
      var timstr=dateUtil.getLocalDate(value.time);
      return timstr.replace("-","年").replace("-","月")+"日";
    }    
    return '';
  }

  function queryDuty(){
    if($("#districtQuery_district").val()==null){
      layer.msg("请选择成员单位", {icon: 2,time: 1000});
      return;
    }
    if($("#districtQuery_startTime").val()==""){
      layer.msg("开始时间不能为空", {icon: 2,time: 1000});
      return;
    }
    if($("#districtQuery_endTime").val()==""){
      layer.msg("结束时间不能为空", {icon: 2,time: 1000});
      return;
    }
    var startTimeStr=(new Date($("#districtQuery_startTime").val())).getTime();
    var endTimeStr=(new Date($("#districtQuery_endTime").val())).getTime();
    var orgId=$("#districtQuery_district").val(); 
    var para;
    if(orgId)
      para='orgId='+orgId+'&startTimeStr='+startTimeStr+'&endTimeStr='+endTimeStr;
    else
      para='startTimeStr='+startTimeStr+'&endTimeStr='+endTimeStr;
    $("#districtQuery_table").bootstrapTable('destroy');
    $("#districtQuery_table").bootstrapTable({
      toggle:"table",
      height:465,
      url:"/psemgy/dutyManagement/listQueryJson?"+para,
      rowStyle:"rowStyle",
      cache: false, 
      pagination:true,
      striped: true,
      pageNumber:1,
      pageSize: 10,
      pageList: [10, 25, 50, 100],
      queryParams: queryParams,
      sidePagination: "server",
      columns: [{field: 'personName',title: '人员名称',align:'center'},
        {field: 'phoneNumber',title: '联系方式',formatter:format_phone,align:'center'}, 
        {field: 'dutyDate',title: '值班日期',formatter:format_date,align:'center'},
        {field: 'orgName',title: '所属机构',align:'center'}]
    });
  }

  function exportTable(){  
    if($("#districtQuery_district").val()==null){
       layer.msg("请选择成员单位", {icon: 2,time: 1000});
       return;
    }
    if($("#districtQuery_startTime").val()==""){
       layer.msg("开始时间不能为空", {icon: 2,time: 1000});
       return;
    }
    if($("#districtQuery_endTime").val()==""){
       layer.msg("结束时间不能为空", {icon: 2,time: 1000});
       return;
    } 
    var startTimeStr=(new Date($("#districtQuery_startTime").val())).getTime();
    var endTimeStr=(new Date($("#districtQuery_endTime").val())).getTime();
    var orgId=$("#districtQuery_district").val(); 
    var para;
    if(orgId)
      para='orgId='+orgId+'&startTimeStr='+startTimeStr+'&endTimeStr='+endTimeStr;
    else
      para='startTimeStr='+startTimeStr+'&endTimeStr='+endTimeStr;
    window.open('/psemgy/dutyManagement/exportDutyManagement?'+para);
  }

  function getToday(){
    var today=new Date();
    $("#districtQuery_startTime").val(today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate());
    $("#districtQuery_endTime").val(today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate());
  }
  function initBtn(){
    $("#districtQueryGetToday").click(getToday);
    $("#districtQueryBtn").click(queryDuty);
    $("#districtQueryExportBtn").click(exportTable);   

    $("#districtQuery_startTime").datetimepicker({
      language: 'zh-CN',
      format: 'yyyy-mm-dd',
      autoclose:true,
      minView:2,
      pickerPosition:'bottom-right'
    });
       
    $("#districtQuery_endTime").datetimepicker({
      language: 'zh-CN',
      format: 'yyyy-mm-dd',
      autoclose:true,
      minView:2,
      pickerPosition:'bottom-right'
    });
     
    $("#districtQuery_startTime").on("change",function(){            
      if($("#districtQuery_endTime").val()!=""){
        $("#districtQuery_startTime").attr('max','$("#districtQuery_endTime").val()');
      }
    });
     
    $("#districtQuery_endTime").on("change",function(){            
      if($("#districtQuery_startTime").val()!=""){
        $("#districtQuery_endTime").attr('min','$("#districtQuery_startTime").val()');
      //$("#districtQuery_endTime").val($("#districtQuery_endTime").val());
      }
    }); 
  }

  function init(){
    initBtn();
    $.ajax({
      method : 'GET',
      url : '/agsupport/om-org!getDistrict.action',
      async : false,
      dataType : 'json',
      success:function(data){         
        for(var i in data){
          $("#districtQuery_district").append("<option value="+data[i].orgId+">"+data[i].orgName+"</option>");
        }                                 
      },
      error : function(e) {
        layer.msg("发生错误！", {icon: 2,time: 1000});
        console.log("初始化人员名单数据error"+e);
      }
    }); 
    $("#districtQuery_table").bootstrapTable({
      toggle:"table",
      height:470,
      data:{},
      rowStyle:"rowStyle",
      cache: false, 
      pagination:true,
      striped: true,
      pageNumber:1,
      pageSize: 10,
      pageList: [10, 25, 50, 100],
      queryParams: queryParams,
      sidePagination: "server",
      columns: [{field: 'personName',title: '人员名称',align:'center'},
      {field: 'phoneNumber',title: '联系方式',formatter:format_phone,align:'center'}, 
      {field: 'dutyDate',title: '值班日期',formatter:format_date,align:'center'},
      {field: 'orgName',title: '所属机构',align:'center'}]
    });
    $(".no-records-found").hide();

  };
  return{
    init:init
  }

})

