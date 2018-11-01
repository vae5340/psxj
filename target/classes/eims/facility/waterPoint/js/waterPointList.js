define(['jquery','layer','areaUtil','bootstrap','bootstrapTable','bootstrapTableCN'],function($,layer,areaUtil,bootstrap,bootstrapTable,bootstrapTableCN){
  var layerIndex,districtArea;

  function addData(){
    $.get("/psemgy/eims/facility/waterPoint/waterPointInput.html",function(h){
      layerIndex=layer.open({
        type: 1, 
        content: h,
        title:'新增易涝隐患点信息',
        area: ['800px', '480px'],
        maxmin: true, 
      });
      require(['psemgy/eims/facility/waterPoint/js/waterPointInput'],function(waterPointInput){
        waterPointInput.init('',districtArea,layerIndex);
      });
    });  
    // var url;
    // if(districtArea)
    //   url='waterPointInput.html?districtArea='+districtArea;
    // else 
    //   url='waterPointInput.html';    
    // layer.open({
    //   type: 2,
    //   title: '新增易涝隐患点信息',
    //   maxmin: true, //开启最大化最小化按钮
    //   area: ['800px', '460px'],
    //   content: url
    // });
  }

  function detailDialog(e){
     $.get("/psemgy/eims/facility/waterPoint/waterPointInput.html",function(h){
      layerIndex=layer.open({
        type: 1, 
        content: h,
        title:'易涝隐患点详细',
        area: ['800px', '480px'],
        maxmin: true, 
      });
      require(['psemgy/eims/facility/waterPoint/js/waterPointInput'],function(waterPointInput){
        waterPointInput.init($(e.target).data('id'),districtArea,layerIndex);
      });
    });  
    // var url;
    // if(districtArea)
    //   url='waterPointInput.html?id='+id+'&districtArea='+districtArea;
    // else 
    //   url='waterPointInput.html?id='+id;
    // layer.open({
    //   type: 2,
    //   title: '易涝隐患点详细',
    //   maxmin: true, //开启最大化最小化按钮
    //   area: ['800px', '480px'],
    //   content: url
    // });
  }


  function closeLayer(){
    layer.close(layerIndex);
    reloadData();
  }

  function delData(){       
    var selList=$("#waterPointListTable").bootstrapTable('getSelections');
    if(selList.length==0)
      layer.msg('请选中删除项', {icon: 0,time: 1000});
    else{
      var checkedIds= new Array();
      for (var i=0;i<selList.length;i++){
        checkedIds.push(selList[i].id);
      }
      $.ajax({  
        url: '/psfacility/pscomb/deleteMoreJson',
        traditional: true,
        data: {"checkedIds" : checkedIds},
        type: "POST",
        dataType: "json",
        success: function(data) {
          layer.msg(data.result);
          reloadData();
        }
      });
    }
  }     

  function reloadData(){
    var query=new Object();
    query.estType=13;
    if($("#waterPointListCombName").val()!="")
      query.combName=$("#waterPointListCombName").val();
    if($("#waterPointListDistrictName").val()!="")
      query.area=encodeURIComponent($("#waterPointListDistrictName").val());
   $("#waterPointList #waterPointListTable").bootstrapTable('refreshOptions',{data:[]});
   $("#waterPointList #waterPointListTable").bootstrapTable('refresh', {url: '/psfacility/pscomb/listNoPageJson',query:query});
  }

  function addBtnCol(value, row, index){
    if(districtArea){
      if(row.area==districtArea)
        return "<button  type='button' class='btn btn-primary itemDetailBtn' data-id='"+row.id+"' style='border:1px solid transparent;'><span class='glyphicon' aria-hidden='true'></span>详细</button>";//onclick='detailDialog("+row.id+")'
      else 
        return "";
    }else{
      return "<button type='button' class='btn btn-primary itemDetailBtn' data-id='"+row.id+"' style='border:1px solid transparent;'><span class='glyphicon' aria-hidden='true'></span>详细</button>";// onclick='detailDialog("+row.id+")'
    }
  }

  function formatter_district(value, row, index){
    if(value!=null){          
      for(var index =0 ;index< xzArea.length;index++){
        if(xzArea[index].code==value)
          return xzArea[index].name;                  
      }          
    }
    return value;  
  }


  function queryParams(params) {
    return {
      pageSize:params.limit,
      pageNo: params.offset/params.limit+1
    };
  }


  var xzArea=areaUtil.xzArea;
  function initArea(){ 

    $.ajax({
      url : '/agsupport/om-org!getDistrictName.action',
      async : false,
      dataType:"json",    
      success : function(data){
        if(data.district){
         for(var index = 0 ;index < xzArea.length;index++){//var index in xzArea
            if(data.district==xzArea[index].name){
              districtArea=xzArea[index].code;
              break;
            }         
          }
        }   
      },
      error : function(e) {
        alert('error');
      }
    });

    for(var index =0 ;index< xzArea.length;index++){//var index in xzArea
     $("#waterPointList #waterPointListDistrictName").append("<option value="+xzArea[index].code+">"+xzArea[index].name+"</option>");          
    } 
  }

  function initBtn(){
   $("#waterPointList #waterPointListQueryBtn").click(reloadData);
   $("#waterPointList #waterPointListAddBtn").click(addData);
   $("#waterPointList #waterPointListDeleteBtn").click(delData);
  }
  function initData(){    
   $("#waterPointList #waterPointListTable").bootstrapTable({
      toggle:"table",
      url:"/psfacility/pscomb/listNoPageJson?estType=13",
      //height:parent.$("#content-main").height()-195,    
      rowStyle:"rowStyle", 
      toolbar: '#toolbar',
      cache: false, 
      pagination:true,
      striped: true,
      pageNumber:1,
      pageSize: 10,
      pageList: [10, 25, 50, 100],
      queryParams: queryParams,
      sidePagination: "server",
      columns: [
      {visible:true,checkbox:true},
      {field:'combName',visible: true,title: '名称',width:"20%",align:'center'},
      {field:'area',visible: true,title: '行政区',align:'center',formatter:formatter_district},
      {field:'xcoor',visible: true,title: '经度',align:'center'},
      {field:'ycoor',visible: true,title: '纬度',align:'center'},
      {field:'estDept',visible: true,title: '记录建立单位',align:'center'},
      {field:'coorSys',visible: true,title: '坐标系统',align:'center'},
      {field:'eleSys',visible: true,title: '高程系统',align:'center'},
      {visible: true,title: '操作',width:100,align:'center',formatter:addBtnCol}
      ],
      onLoadSuccess:function(){
        $('.itemDetailBtn').click(detailDialog);
      }
    });    
  }
  function init(){ 
    initArea();
    initBtn();
    initData();
  }; 
  return{
    init:init,
    closeLayer:closeLayer
  }
})
