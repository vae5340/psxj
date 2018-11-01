define(['jquery','layer','bootstrap','bootstrapTable','bootstrapTableCN','mousewheel','customScrollbar'],
  function($,layer,bootstrap,bootstrapTable,bootstrapTableCN,mousewheel,customScrollbar){

  function save(){
    var dataparam=$("#form").serialize();
    var expName = $("#expName");
    var expPhone = $("#expPhone");
    if($.trim(expName.val()) == ""){
      layer.msg("姓名不能为空!", {icon: 0,time: 1000});
      expName.focus();
      return;
    }else if($.trim(expPhone.val()) == ""){
      layer.msg("联系电话不能为空!", {icon: 0,time: 1000});
      expPhone.focus();
      return;
    }
    $.ajax({
      type: 'post',
      url : '/psemgy/yjExpert/saveJson',
      data:dataparam,
      dataType : 'json',  
      success : function(data) {
        layer.msg(data.result);
        // var index = layer.getFrameIndex(window.name);
        // window.parent.closeLayer(index);
        require(['eims/facility/expert/js/expertlist'],function(expertlist){
          expertlist.closeLayer();
        });
      },
      error : function() {
        layer.msg("保存失败", {icon: 2,time: 1000});
      }
    });
  }

  function cancel(){
    layer.close(layerIndex);
  }

  function initData(){
    $.ajax({
      method : 'GET',
      url : '/psemgy/yjExpert/listJson?id='+id,
      async : true,
      dataType : 'json',
      success : function(data) {
        for (var key in data.rows[0]){
          if(key.toLowerCase().indexOf("gender")!=-1){
            if(data.rows[0][key]=="1")
              $("#"+key).val(1);
            else if(data.rows[0][key]=="0")
              $("#"+key).val(0);
          } else{
            $("#"+key).val(data.rows[0][key]);
          }
        }
      },
      error : function() {
         layer.msg("初始化数据失败", {icon: 2,time: 1000});
      }
    });
  }

  function initBtn(){
    $("#expertInputSaveBtn").click(save);
    $("#expertInputCancelBtn").click(cancel);
  }

  function init(_id,_layerIndex){     
    layerIndex=_layerIndex;
    id=_id;
    initBtn();
    if(id!=""){
      initData();
    }
    $("#content").mCustomScrollbar();
  };


  return{
    init:init
  }
})
var id,layerIndex;


