$(function(){
     $.ajax({
		method : 'GET',
		url : '/agsupport/om-org!getDistrict.action',
		async : false,
		dataType : 'json',
		success:function(data){					
			for(var i in data){
			   $("#district").append("<option value="+data[i].orgId+">"+data[i].orgName+"</option>");
			}																	
		},
		error : function() {
			alert("error");
		}
	}); 
	
	$("#startTime").datetimepicker({
	        language: 'zh-CN',
		  	format: 'yyyy-mm-dd',
		  	autoclose:true,
	  	    minView:2,
		  	pickerPosition:'bottom-right'
	 });
	   
	 $("#endTime").datetimepicker({
	        language: 'zh-CN',
		  	format: 'yyyy-mm-dd',
		  	autoclose:true,
	     	minView:2,
		  	pickerPosition:'bottom-right'
	 });
	   
	 $("#startTime").on("change",function(){   		      
	      if($("#endTime").val()!="")
	      {
	          $("#startTime").attr('max','$("#endTime").val()');
	      }
	 });
	   
	 $("#endTime").on("change",function(){   		      
	      if($("#startTime").val()!="")
	      {
	           $("#endTime").attr('min','$("#startTime").val()');
	           //$("#endTime").val($("#endTime").val());
	      }
	 });
	 
	 $("#table").bootstrapTable({
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
});

//表格查询参数设置
function queryParams(params) {
	return {
		pageSize:params.limit,
	    pageNo: params.offset/params.limit+1
	};
}

function format_phone(value, row, index){		
    if(value)	
	   return value;
	return "";   
}

function format_date(value, row, index){
   if(value){
        var timstr=getLocalDate(value.time);
		return timstr.replace("-","年").replace("-","月")+"日";
   }		
	return '';
}

function queryDuty(){
     if($("#district").val()==null){
         layer.msg("请选择成员单位");
         return;
     }
     if($("#startTime").val()==""){
         layer.msg("开始时间不能为空");
         return;
     }
     if($("#endTime").val()==""){
         layer.msg("结束时间不能为空");
         return;
     }
     var startTimeStr=(new Date($("#startTime").val())).getTime();
     var endTimeStr=(new Date($("#endTime").val())).getTime();
     var orgId=$("#district").val(); 
     var para;
     if(orgId)
        para='orgId='+orgId+'&startTimeStr='+startTimeStr+'&endTimeStr='+endTimeStr;
     else
        para='startTimeStr='+startTimeStr+'&endTimeStr='+endTimeStr;
	 $("#table").bootstrapTable('destroy');
	 $("#table").bootstrapTable({
		toggle:"table",
		height:465,
		url:location.protocol+"//"+location.hostname+":"+location.port+"/agsupport/duty-management!listQueryJson.action?"+para,
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
     if($("#district").val()==null){
         layer.msg("请选择成员单位");
         return;
     }
     if($("#startTime").val()==""){
         layer.msg("开始时间不能为空");
         return;
     }
     if($("#endTime").val()==""){
         layer.msg("结束时间不能为空");
         return;
     } 
     var startTimeStr=(new Date($("#startTime").val())).getTime();
     var endTimeStr=(new Date($("#endTime").val())).getTime();
     var orgId=$("#district").val(); 
     var para;
     if(orgId)
        para='orgId='+orgId+'&startTimeStr='+startTimeStr+'&endTimeStr='+endTimeStr;
     else
        para='startTimeStr='+startTimeStr+'&endTimeStr='+endTimeStr;
     window.open('/agsupport/duty-management!exportDutyManagement.action?'+para);
}

function getToday(){
   var today=new Date();
   $("#startTime").val(today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate());
   $("#endTime").val(today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate());
}
