$(window).load(function(){
	$("#tableDiv").mCustomScrollbar();
});
        
//数据填充	    
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) return unescape(r[2]); return "";
}
			
var id=getQueryStr("id");			
var yaId=getQueryStr("yaId");
var districtUnitId=getQueryStr("districtUnitId");
var cityYaId;
var superviseId;
var groupId;
                     
$(function(){
	if(id){	            
		$("#reportBtn").hide();
		$.ajax({
			method:'GET',
			url:'/agsupport/ya-process-report!inputJson.action',
			data:{"id":id},
			dataType : 'json',  
			async:false,
			success:function(data){
			    $('#reportName').val(data.form.reportName)
				$('#content').html(data.form.reportContent);							
			},
			error:function (e){
				layer.msg("error");
			}
		});    
	} else {
		var time=new Date();  	            
		$("#reportName").val(time.getFullYear()+"年"+(time.getMonth()+1)+"月"+time.getDate()+"日"+time.getHours()+"时事中报告");
        $.ajax({
			method:'GET',
			url:'/agsupport/ya-process-report!produceDistrictReportContent.action',
			dataType : 'json',  
			async:false,
			success:function(data){
			  	if(data.repeat!=null){
			   		parent.layer.msg("已提交事中报告");
			   		var index = parent.layer.getFrameIndex(window.name);
					parent.layer.close(index);	
			 	} else if(data.nosupervise!=null) {
					parent.layer.msg("当前无事中报告督办，不能提交");
					var index = parent.layer.getFrameIndex(window.name);
					parent.layer.close(index);
			 	} else {
					$('#content').html(data.content);
					superviseId=data.superviseId;
					groupId=data.groupId;
					changenote();							   
			 	}
			},
			error:function (e){
				layer.msg("error");
			}
		});    	               	            
	}
         
	$.ajax({
		method : 'GET',
		url : '/agsupport/ya-record-city!getNowCityRecord.action',
		async : true,
		dataType : 'json',
		success : function(data) {  
			if(data!=0){
				cityYaId=data.id;
			}
		},
		error : function() {   
			parent.layer.msg('error');
		}
	});

	$("#table").bootstrapTable({
		toggle:"table",
		height:380,
		url:"/agsupport/ya-jsd-report!listJson.action?yaId="+yaId+"&reportType=1&reportId="+id,
		rowStyle:"rowStyle",
		toolbar: '#toolbar',
		pagination:true,
		sortable: false,
		striped: true,
		pageNumber:1,
		pageSize: 10,
		pageList: [10, 25, 50, 100],
		cache: false,
		queryParams: queryParams,
		sidePagination: "server",
		columns: [
			{visible:true,checkbox:true},
			{field:'jsdName',visible: true,title: '积水点名称',align:"center"},
			{field:'jsReason',visible: true,title: '积水原因',align:"center"},
			{field:'dutyUnit',visible: true,title: '责任单位',align:"center"},
			{field:'dutyPerson',visible: true,title: '责任人',align:"center"},
			{field:'reportCreater',visible: true,title: '创建人',align:"center"},
			{field:'reportCreateTime',visible: true,title: '创建时间',formatter:format_date,align:"center"},
			{visible: true,title: '操作',formatter:addBtnCol,width:100,align:"center"}
		]
	});
});
       		
function showJsdReport(id){
	//iframe层
	layer.open({
		type: 2,
		title: '修改积水点报告',
		shadeClose: true,
		shade: 0.5,
		area: ['920px', '570px'],
		content: '/awater/nnwaterSystem/EmergenControl/District/processReport/jsdReportInput.html?id='+id
	}); 	
}

function changenote(){
	if($("#changenote").attr("status")=="save"){
		$("#eg").removeClass("no-padding");
		var aHTML = $('.click2edit').code();
		$('.click2edit').destroy();
		$("#changenote").attr("status","edit");
		$("#changenote").text("修改事中报告");
		$("#reportName").css("border","none");						
		$("#reportName").attr("readonly",true);
		$.ajax({
			method:'GET',
			url:'/agsupport/ya-process-report!saveJson.action',
			data:{"id":id,"cityYaId":cityYaId,"districtYaId":yaId,"reportName":$("#reportName").val(),"reportContent":aHTML,"superviseId":superviseId,"groupId":groupId},
			dataType : 'json',  
			async:false,
			success:function(data){
			    id=data.id;
				parent.layer.msg(data.result);
	 			var index = parent.layer.getFrameIndex(window.name);
			    parent.layer.close(index);	
			},
			error:function (e){
				layer.msg("保存失败");
			}
		});    
	} else {
		$("#eg").addClass("no-padding");
		$('.click2edit').summernote({
           	height: 120, 		            
            lang: 'zh-CN',
            focus: true
        });
        $("#reportName").attr("readonly",false);
        $("#reportName").css("border","1px");
        $("#changenote").attr("status","save");
		$("#changenote").text("保存事中报告");
	}
}	
    		
function addData(){
	layer.open({
		type: 2,
		title: '新增积水点报告',
		maxmin: true, //开启最大化最小化按钮
		area: ['900px', '550px'],
	    content: 'jsdReportInput.html?yaId='+yaId+"&reportType=1&reportId="+id
	});
}
   
function closeLayer(index){
	layer.close(index);
	reloadData();
}
   
function delData(){
   	var selList=$("#table").bootstrapTable('getSelections');
   	if(selList.length==0)
   		layer.msg('请选中删除项');
   	else {
    	var checkedIds= new Array();
    	for (var i=0;i<selList.length;i++){
    		checkedIds.push(selList[i].id);
    	}
   	    $.ajax({  
		    url:'/agsupport/ya-jsd-report!deleteMoreJson.action',  
		    traditional: true,
		    data: {"checkedIds" : checkedIds},
		    type: "POST",
		    dataType: "json",
		    success: function(data) {
		        layer.msg(data.result);
		    }
		});
   		reloadData();
	}
}
   
function queryParams(params) {
	return {
		pageSize:params.limit,
		pageNo: params.offset/params.limit+1
	};
}
   
function reloadData(){
	var query=new Object();
	query.yaId=yaId;
	if($("#jsdId").val()!="")
		query.jsdId=$("#jsdId").val();
	$("#table").bootstrapTable('refresh', {url: '/agsupport/ya-jsd-report!listJson.action',query:query});
	
	//编辑状态下更新明显积水点数量
    if($("#changenote").attr("status")=="save"){   					  
		$.ajax({
			method:'GET',
			url:'/agsupport/ya-process-report!jsdNum.action?districtYaId='+yaId,
			dataType : 'json',  
			async:false,
			success:function(data){   
				var aHTML = $('.click2edit').code();
				var sIndex=aHTML.indexOf("<font id=\"jsdNum\">");
				var jsdHtml=aHTML.substr(sIndex);	
				var rLength=jsdHtml.indexOf("</font>");
				aHTML=aHTML.replace(aHTML.substr(sIndex,rLength),"<font id=\"jsdNum\">"+data);
				$('.click2edit').code(aHTML);							   
			},
			error:function (e){
				layer.msg("保存失败");
			}
		});
	}
}

function addBtnCol(value, row, index){
    return "<button id=\"btn_edit\" type=\"button\" class=\"btn btn-primary\" style=\"border:1px solid transparent;\" onclick=\"showJsdReport("+row.id+")\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>详细</button>";
}

function format_date(value, row, index){
	if(value)
		return getLocalTime(value.time);
	return '';
}

function detailDialog(id){
	layer.open({
		type: 2,
		title: '应急问题详细',
		maxmin: true, 
		area: ['900px', '550px'],
		content: 'ProblemReport_Input.html?id='+id
	});
} 
 function exportWord(){
	if(id){
		var url = '/agsupport/ya-process-report!exportWord.action?id='+id;
		window.open(url);
	}else{
		parent.layer.msg("导出失败");
	}
}