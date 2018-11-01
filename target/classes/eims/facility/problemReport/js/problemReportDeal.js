define(['jquery','jqueryForm','layer','fileInput','fileInputLocaleZh'],function($,jqueryForm,layer,fileInput,fileInputLocaleZh){
  var id,layerIndex;
  function cancel(){
    layer.close(layerIndex)
  }

  function deal(){
    //验证！备注、处理结果、处理措施不能为空，图片可以为空
    if($("#problemReportDeal #problemSolveWay").val().trim() == ""){
      layer.msg("处理措施不能为空",{icon:2});
      return ;
    }
    if($("#problemReportDeal #problemSolveResult").val().trim() == ""){
      layer.msg("处理结果不能为空",{icon:2});
      return ;
    }
    if($("#problemReportDeal #problemSolveRemark").val().trim() == ""){
      layer.msg("备注不能为空",{icon:2});
      return ;
    }
    //
    $("#problemReportDeal #problemDeal").ajaxSubmit({
      url: '/psemgy/yjProblemReport/dealProblemUpload',
      type: 'post',
      success: function(){
        layer.msg("处理成功！", {icon: 1,time: 1000});
        require(['eims/facility/problemReport/js/problemReportList'],function(problemReportList){
          problemReportList.reloadData();
        });
        cancel();
      //parent.location.reload();
      //console.log("处理成功！")
      },
      error: function(){
        layer.msg("处理失败！", {icon: 2,time: 1000});
      }
    })
  }
  function initBtn(){
    //初始化input file
    $("#problemReportDeal #uploadImage").fileinput({
      showUpload : false,
      showRemove : false,
      language : 'zh',
      allowedPreviewTypes : ['image'],
      allowedFileExtensions : ['jpg','png','gif'],
      maxFileSize : 20000,
      maxFileCount: 10
    });
    $('#problemReportDeal #problemReportDealSaveBtn').click(deal);
    $('#problemReportDeal #problemReportDealCancelBtn').click(cancel);
  }
  function init(_id,_layerIndex){
    id=_id,
    layerIndex=_layerIndex;
    $("#problemReportDeal #id").val(_id);
    initBtn();
  }
  return{
    init:init
  }
})