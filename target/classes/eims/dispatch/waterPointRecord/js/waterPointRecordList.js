define(['jquery','bootstrap','bootstrapTable','bootstrapTableCN','bootstrapDatetimepicker','bootstrapDatetimepickerCN','layer','mousewheel','customScrollbar','content'],function($,bootstrap,bootstrapTable,bootstrapTableCN,bootstrapDatetimepicker,bootstrapDatetimepickerCN,layer,mousewheel,customScrollbar,content){

  var pItemDimArr;
  function save(e){
    var tId=$(e.target).data('id');
    var dataParam;
    if(tId){
       dataParam=tId;
    }else{
      var tableSelections=$("#waterPointRecordListTable").bootstrapTable('getSelections');
      if(tableSelections.length==0){
         layer.msg("请选择发布监测项", {icon: 0});
         return;
      }
      var dataArr=[];
      for(var i in tableSelections){
         dataArr.push(tableSelections[i].ITEM_DIM_ID);
      }
      dataParam=dataArr.join(",");
    }
    $.ajax({
      type: 'post',
      url : "/agsupport/rest/jkalarm/weChatJkAlarmInfo", 
      data: {itemArrStr:dataParam},
      dataType : 'json',
      success : function(data) {
        layer.msg(data.result, {icon: 1});
        initData(true);
      },
      error : function(e) {
        layer.msg("操作失败！",{icon: 2,time: 1000});
      }
    });
  }

  function draw(e){
    var tId=$(e.target).data('id');
    var dataParam;
    if(tId){
       dataParam=tId;
    }else{
      var tableSelections=$("#waterPointRecordListTable").bootstrapTable('getSelections');
      if(tableSelections.length==0){
         layer.msg("请选择撤回监测项", {icon: 0});
         return;
      }
      var dataArr=[];
      for(var i =0; i< tableSelections.length;i++){//var i in tableSelections
         dataArr.push(tableSelections[i].ITEM_DIM_ID);
      }
      dataParam=dataArr.join(",");
    }
    $.ajax({
      type: 'post',
      url : "/agsupport/rest/jkalarm/weChatJkAlarmInfoW", 
      data: {itemArrStr:dataParam},
      dataType : 'json',
      success : function(data) {
        layer.msg(data.result, {icon: 1});
        //location.reload();      
        initData(true);
      },
      error : function() {
        layer.msg("操作失败！",{icon: 2,time: 1000});
      }
    });

  }

  function format_operation(value,row,index){
    var arr = pItemDimArr.filter(function(item){ 
      return item.ITEM_DIM_ID==row.ITEM_DIM_ID;
    });
    if(arr.length==0)
      return "<button class='btn btn-primary itemSaveBtn' data-id='"+row.ITEM_DIM_ID+"' >发布</button>";//onclick=save('"+row.ITEM_DIM_ID+"')
    else
      return "<button class='btn btn-primary itemDrawBtn' data-id='"+row.ITEM_DIM_ID+"' >撤回</button>";//onclick=withdraw('"+row.ITEM_DIM_ID+"')
  }

  function format_status(value,row,index){
    var arr = pItemDimArr.filter(function(item){
      return item.ITEM_DIM_ID==row.ITEM_DIM_ID;
    });
    if(arr.length>0)
      return "是";
    else
      return "否";
  }
  function initBtn(){
    $("#waterPointRecordListSaveBtn").click(save);
    $("#waterPointRecordListDrawBtn").click(draw);
  }
  function initData(refresh){
    $.ajax({ 
      url: "/agsupport/rest/jkalarm/weChatJkAlarmData", 
      cache:false,
      dataType:'json',
      success: function(results){
        console.log(results);
        var rows=results.rows;
        pItemDimArr=results.pRows;

        if(refresh){
          $("#waterPointRecordListTable").bootstrapTable('destroy'); //先销毁重新加在数据
        }
        $("#waterPointRecordListTable").bootstrapTable({
          toggle:"table",
          height:550,
          data:rows,
          rowStyle:"rowStyle",
          cache: false, 
          checkboxHeader:false,
          columns: [{visible:true,checkbox:true},
          {field: 'COMB_NAME',title: '设施名称',align:'center'},
          {field: 'DEVICE_NAME',title: '设施名称',align:'center'},
          {field: 'ITEM_DIM_NAME',title: '监控项名称',align:'center'},
          {field: 'ALARM_VALUE',title: '监测值',align:'center'},
          {title: '是否发布',align:'center',formatter:format_status},
          {title: '操作',align:'center',formatter:format_operation}]
        });
        $('.itemSaveBtn').click(save);
        $('.itemDrawBtn').click(draw);
        
      },  
      error:function(e){
        console.log("初始化数据失败"+e)
      }
    });  
  }

  function init(){ 
    initBtn();
    initData();
   //
    $("#waterPointRecordListTable").on('post-body.bs.table', function (row,obj) {
      $(".fixed-table-body").mCustomScrollbar({
        mouseWheelPixels:300
      }); 
    });

  }
  return{
    init:init
  } 

})