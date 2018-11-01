 
define(['jquery','layer','dateUtil','bootstrap','bootstrapTable','bootstrapTableCN'],
  function($,layer,dateUtil,bootstrap,bootstrapTable,bootstrapTableCN){
  
  var layerIndex;
  function closeLayer(){
    layer.close(layerIndex);
    reloadData();
  }
   
  function reloadData(){
    var query=new Object();
    if($("#listExpName").val()!="")
      query.expName=encodeURIComponent($("#listExpName").val());
    $("#expertlistTable").bootstrapTable('refreshOptions',{data:[]});     
    $("#expertlistTable").bootstrapTable('refresh', {url: '/psemgy/yjExpert/listJson',query:query});
  }

  function addBtnCol(value, row, index){
    return "<button id='btn_edit' type='button' class='btn btn-primary itemDetailBtn' data-id='"+row.id+"' style='border:1px solid transparent;'><span class='glyphicon' aria-hidden='true'></span>详细</button>";// onclick='detailDialog("+row.id+")'
  }

  function format_gender(value, row, index){
    if(value==1) return "男";
    return "女";
  }

  function addData(){
    $.get("/psemgy/eims/facility/expert/expertInput.html",function(h){
      layerIndex=layer.open({
        type: 1, 
        content: h,
        title:'防汛专家详细',
        area: ['900px', '420px'],
        maxmin: true, 
      });
      require(['psemgy/eims/facility/expert/js/expertInput'],function(problemReportList){
        problemReportList.init('',layerIndex);
      });
    }); 
    // layer.open({
    //   type: 2,
    //   title: '新增防汛专家记录',
    //   maxmin: true, //开启最大化最小化按钮
    //   area: ['900px', '420px'],
    //   content: 'expertInput.html'
    // });
  }

  function delData(){       
    var selList=$("#expertlistTable").bootstrapTable('getSelections');
    if(selList.length==0)
      layer.msg('请选中删除项',{icon: 0,time: 1000});
    else{
      var checkedIds= new Array();
      for (var i=0;i<selList.length;i++){
        checkedIds.push(selList[i].id);
      }
      $.ajax({  
        url: '/psemgy/yjExpert/deleteMoreJson',
        traditional: true,
        data: {"checkedIds" : checkedIds},
        type: "POST",
        dataType: "json",
        success: function(data) {
          //alert(data.status);
          layer.msg(data.result);
          reloadData();
        }
      });
    }
  }  
  //修改
  function detailDialog(e){
    $.get("/psemgy/eims/facility/expert/expertInput.html",function(h){
      layerIndex=layer.open({
        type: 1, 
        content: h,
        title:'防汛专家详细',
        area: ['900px', '420px'],
        maxmin: true, 
      });
      require(['psemgy/eims/facility/expert/js/expertInput'],function(problemReportList){
        problemReportList.init($(e.target).data('id'),layerIndex);
      });
    });  
    // layer.open({
    //   type: 2,
    //   title: '防汛专家详细',
    //   maxmin: true, //开启最大化最小化按钮
    //   area: ['900px', '420px'],
    //   content: 'expertInput.html?id='+id
    // });
  }   

  function queryParams(params) {
    return {
      pageSize:params.limit,
      pageNo: params.offset/params.limit+1
    };
  }
  function initBtn(){
    $("#listExpertlistQueryBtn").click(reloadData);
    $("#expertlistAddBtn").click(addData);
    $("#expertlistDeleteBtn").click(delData);
  }
  function initData(){
    $("#expertlistTable").bootstrapTable({
      toggle:"table",
      url:"/psemgy/yjExpert/listJson",
      rowStyle:"rowStyle",
      toolbar: '#expertlistToolbar',
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
      {field:'expName',visible: true,title: '姓名',align:'center'},
      {field:'expGender',visible: true,title: '性别',align:'center',formatter:format_gender},
      {field:'expCompany',visible: true,title: '单位',align:'center'},
      {field:'jobTitle',visible: true,title: '头衔',align:'center'},
      {field:'expDuty',visible: true,title: '职责',align:'center'},
      {field:'expPhone',visible: true,title: '联系方式',align:'center'},
      {field:'bz',visible: true,title: '备注',align:'center'},
      {visible: true,title: '操作',width:100,align:'center',formatter:addBtnCol}
      ],
      onLoadSuccess:function(){
        $('.itemDetailBtn').click(detailDialog);
      }
    }); 
  }
  function init(){
    initBtn();
    initData();
  }
        
  return{
    init:init,
    closeLayer:closeLayer
  }

});

  
 