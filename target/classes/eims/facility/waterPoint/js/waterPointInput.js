define(['jquery','layer','areaUtil','awaterui','appFunc'],function($,layer,areaUtil,awaterui,appFunc){

var id,districtArea,layerIndex;
var xzArea=areaUtil.xzArea;


  var lIndex;
  function position(){
    awaterui.createNewtab("mapDiv","地图服务");  
    layer.msg("请在地图选择易涝隐患点位置，双击鼠标左键选定",{icon:0});
    //lIndex = layer.getFrameIndex(window.name);
    //parent.parent.addJsdToList(lIndex);
    appFunc.addJsdToList(layerIndex);
  }


  function save(){
      var dataparam=$("#waterPointInput #waterPointInputForm").serialize()+"&estType=13";
      $.ajax({
        type: 'post',
        url : '/psfacility/pscomb/saveJson.action',
        // async : true,
        data:dataparam,
        dataType : 'json',  
        success : function(data) {
          layer.msg(data.result);
          require(['psemgy/eims/facility/waterPoint/js/waterPointList'],function(waterPointList){
            waterPointList.closeLayer();
          });
          // var index = parent.layer.getFrameIndex(window.name);
          // window.parent.closeLayer(index);
        },
        error : function() {
          layer.msg("保存失败", {icon: 2,time: 1000});
        }
      });
    }

  function cancel(){
    layer.close(layerIndex);
  }

  function initBtn(){
    $("#waterPointInput #waterPointInputPositionBtn").click(position);
    $("#waterPointInput #waterPointInputSaveBtn").click(save);
    $("#waterPointInput #waterPointCancelSaveBtn").click(cancel);
  }

  function initData(){
    $.ajax({
      method : 'GET',
      url : '/psfacility/pscomb/listNoPageJson',
      async : true,
      dataType : 'json',
      success : function(data) {
        for (var key in data.rows[0]){
          $("#waterPointInput #"+key).val(data.rows[0][key]);
          if(key=='xcoor') $('#waterPointInput #waterPointInput #waterPointInputXcoor').val(data.rows[0][key]);
          if(key=='ycoor') $('#waterPointInput #waterPointInput #waterPointInputYcoor').val(data.rows[0][key]);
        }
      },
      error : function() {
        layer.msg("初始化设施数据失败", {icon: 2,time: 1000});
      }
    });

    $.ajax({
      method : 'GET',
      url : '/psfacility/pscomb/listDutyInfo?id='+id,
      async : true,
      dataType : 'json',
      success : function(data){
        if(data.rows){
          $("#waterPointInput #dutyUnit").val(data.rows[0].DUTY_UNIT);
          $("#waterPointInput #dutyPerson").val(data.rows[0].DUTY_PERSON);
        }
      },
      error : function() {
        layer.msg("初始化责任数据失败", {icon: 2,time: 1000});
      }
    });
  }

  function init(_id,_districtArea,_layerIndex){
    initBtn();
    id=(_id&&_id!='')?_id:'';
    districtArea=(_districtArea&&_districtArea!='')?_districtArea:'';
    layerIndex=_layerIndex;
    if(districtArea!=""){
      $("#waterPointInput #area").val(districtArea);
      for(var index =0 ;index< xzArea.length;index++){//var index in xzArea
        if(xzArea[index].code==districtArea){
          $("#waterPointInput #area").append("<option value="+xzArea[index].code+">"+xzArea[index].name+"</option>");
          break;  
        }        
      } 
    }else{
      $("#waterPointInput #area").append("<option></option>");
      for(var index =0 ;index< xzArea.length;index++){//var index in xzArea
        $("#waterPointInput #area").append("<option value="+xzArea[index].code+">"+xzArea[index].name+"</option>")         
      }
    }
    if(id!=""){
      initData();
    }
  };

  return{
    init:init,
  }
})
