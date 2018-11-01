define(['jquery','bootstrap','bootstrapTable','bootstrapTableCN','layer','awaterui','mousewheel','customScrollbar'],function($,bootstrap,bootstrapTable,bootstrapTableCN,layer,awaterui){

  var DictList=null,layerIndex;
  function format_grade(value, row, index){
    if(DictList){
       for (var item in DictList["templateGrade"]){
        if(value==DictList["templateGrade"][item].itemCode){
          gradeList[value]=DictList["templateGrade"][item].itemName
          return DictList["templateGrade"][item].itemName;
         }    
      }
      return '';
    } else {
      $.ajax({
        method : 'GET',
        url : location.protocol+"//"+location.hostname+":"+location.port+'/psemgy/yaTemplateCity/getAllDict',
        async : false,
        dataType : 'json',
        success : function(data) {
          DictList=data;  
        },
        error : function() {
          alert('error');
        }
      });
      for (var item in DictList["templateGrade"]){
        if(value==DictList["templateGrade"][item].itemCode){
          gradeList[value]=DictList["templateGrade"][item].itemName           
          return DictList["templateGrade"][item].itemName;
          }   
      }
      return '';
    }
  }
  var gradeList=[];
  function format_type(value, row, index){
    if(DictList){
       for (var item in DictList["templateType"]){
        if(value==DictList["templateType"][item].itemCode)
          return DictList["templateType"][item].itemName;
      }
      return '';
    } else {
      $.ajax({
        method : 'GET',
        url : location.protocol+"//"+location.hostname+":"+location.port+'/psemgy/yaTemplateCity/getAllDict',
        async : false,
        dataType : 'json',
        success : function(data) {
          DictList=data;  
        },
        error : function() {
          alert('error');
        }
      });
      for (var item in DictList["templateType"]){
        if(value==DictList["templateType"][item].itemCode)
          return DictList["templateType"][item].itemName;
      }
      return '';
    }
  }


  function selectYA(){
    var selectObj=$('#recordAlarmList #tableMuni').bootstrapTable('getSelections');
    if(selectObj.length==0){
      layer.msg('请先选中预案模板', {icon: 0,time: 1000});
    } else {
      $.ajax({
        type: 'post',
        url : '/psemgy/yaRainReport/saveCityJson',
        data:{"cityYaId":selectObj[0].id},
        dataType : 'json',  
        success : function(data) {
          layer.msg(data.result);
          showWindow(data.form.id);
          layer.close(layerIndex);
        },
        error : function() {
          layer.msg("操作失败", {icon: 1,time: 1000});
        }
      });
    }
    
  }

  function showWindow(id){
    awaterui.createNewtab("/psemgy/eims/dispatch/pages/municipal/rainReport/list.html","防汛应急响应一雨一报",function(){
      require(["psemgy/eims/dispatch/pages/municipal/rainReport/js/list"],function(list){
        list.init(id);
      }); 
    });
  }

  function cancel(){
    layer.close(layerIndex);
  }

  function initData(){                  
    $("#recordAlarmList #tableMuni").bootstrapTable({
      toggle:"table",
      height:300,
      url:"/psemgy/yaRecordCity/listJsonRainReport",
      rowStyle:"rowStyle",
      //toolbar: '#toolbar',
      cache: false, 
      striped: true,
      checkboxHeader:false,
      singleSelect:true,
      clickToSelect:true,
      sidePagination: "server",
      columns: [
        {visible:true,checkbox:true},
        {field:'templateNo',visible: true,title: '预案编号',width:"15%"},
        {field:'templateName',visible: true,title: '预案名称',align:'center'},
        {field:'templateGrade',visible: true,title: '预案级别',align:'center',formatter:format_grade},
        {field:'templateType',visible: true,title: '预案类型',align:'center',formatter:format_type},
        {field:'templateContent',visible: true,title: '预案内容',halign:'center'},
        {field:'recordCreatePerson',visible: true,title: '编制人',align:'center'}
      ]
    });
  }
  function initBtn(){
    $('#recordAlarmList #recordAlarmListSelectBtn').click(selectYA);
    $('#recordAlarmList #recordAlarmListCancelBtn').click(cancel);
  }
  function init(_layerIndex){
    initData();
    initBtn();
    layerIndex=_layerIndex;
    $("#recordAlarmList #tableMuni").on('post-body.bs.table', function (row,obj) {
      $(".fixed-table-body").mCustomScrollbar({mouseWheelPixels:600});
    });
  }
  return{
    init:init
  }

});

