function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}
var id=getQueryStr("id");
var DistrictYaId;

 function format_time(value, row, index){
	if(value)
		return getLocalTime(value.time);
	return '';
}

function formatter_detail(value, row, index){
	return "<button id=\"btn_edit\" type=\"button\" class=\"btn btn-primary\" style=\"border:1px solid transparent;\" onclick=\"detailDialog("+row.id+")\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>详细</button>";
}

function formatter_normal(value, row, index){
	if(value==null)
	   return '';
	return value;
}

function addBtnCol(value, row, index){
    return "<button id=\"btn_edit\" type=\"button\" class=\"btn btn-success\" style=\"border:1px solid transparent;\" onclick=\"showJsdReport("+row.id+")\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>详细</button>";
}

function addLQHGBtnCol(value, row, index){
    return "<button id=\"btn_edit\" type=\"button\" class=\"btn btn-success\" style=\"border:1px solid transparent;\" onclick=\"showLQHGTab('"+row.yaId+"','"+row.jsdId+"')\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>回顾</button>";
}

function closeLayer(index){
	layer.close(index);
   	reloadData();
}

function reloadData(){
    $.ajax({
		method : 'GET',
		url : "/agsupport/ya-jsd-report!listJson.action?yaId="+districtYaId,
		async : false,
		success : function(data) {
		    $("#table").bootstrapTable('refreshOptions', {data:JSON.parse(data).rows});	       				
		},
		error : function(e) {
			alert('error');
		}
	});	
}

function detailDialog(id){
	layer.open({
		type: 2,
		title: '应急问题详细',
		maxmin: true, 
		area: ['900px', '600px'],
		content: '/awater/nnwaterSystem/EmergenControl/ProblemReport/ProblemReport_Input.html?id='+id
	});
}

function showJsdReport(id){
	//iframe层
	layer.open({
		type: 2,
		title: '修改积水点报告',
		shadeClose: true,
		shade: 0.5,
		area: ['900px', '550px'],
		content: 'jsdReportInput.html?id='+id
	}); 	
}

var districtYaId;
$(function(){
   	$.ajax({
		method : 'GET',
		url : "/agsupport/ya-rain-report!inputJsonDistrcit.action?id="+id,
		async : true,
		dataType : 'json',
		success : function(data) {
			$("#content").html(data.form.reportContent);
			cityYaId=data.cityYaId;
			$("#reportName").val(data.form.reportName);
			districtYaId=data.form.districtYaId; 	          
			$("#table").bootstrapTable({
				toggle:"table",
				url:"/agsupport/ya-jsd-report!listJson.action?yaId="+districtYaId+"&reportType=2&reportId="+id,
				rowStyle:"rowStyle",
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
						{field:'jsdName',visible: true,title: '积水点名称',align:"center"},
						{field:'jsReason',visible: true,title: '积水原因',align:"center"},
						{field:'dutyUnit',visible: true,title: '责任单位',align:"center"},
						{field:'dutyPerson',visible: true,title: '责任人',align:"center"},
						{field:'reportCreater',visible: true,title: '创建人',align:"center"},
						{field:'reportCreateTime',visible: true,title: '创建时间',formatter:format_time,align:"center"},
						{visible: true,title: '操作',formatter:addBtnCol,width:100,align:"center"}
					]
			});  
		},
		error : function() {
			parent.layer.msg('请求失败');
		}
	});
});	     

function queryParams(params) {
	return {
		pageSize:params.limit,
        pageNo: params.offset/params.limit+1
	};
}
   
function showWindow(url){
	//iframe层
	layer.open({
		type: 2,
	  	title: '详细',
	  	shadeClose: true,
	  	shade: 0.5,
	  	area: ['70%', '70%'],
	  	content: url //iframe的url
	});
}
//新建tab - 显示对应积水点涝情回顾
function showLQHGTab(yaDistrcitId,jsdId){
	var url="/awater/nnwaterSystem/EmergenControl/FloodReview/history.html?yaId="+yaDistrcitId+"&jsdId="+jsdId;
	parent.createNewtab(url,"涝情回顾");
}

function addData(){
	if(districtYaId!=null){
		layer.open({
			type: 2,
			title: '新增积水点报告',
			maxmin: true, //开启最大化最小化按钮
			area: ['900px', '550px'],
		    content: 'jsdReportInput.html?yaId='+districtYaId
		});
	}
}
function changenote(){
	if($("#changenote").attr("status")=="save"){
		layer.confirm('是否保存修改内容？', {btn: ['是','否'] //按钮
		}, function(){
			$("#eg").removeClass("no-padding");
			var str = $('.click2edit').code();
			$('.click2edit').destroy();
			$("#changenote").attr("status","edit");
			$("#changenote").text("修改一雨一报内容");
			$("#reportName").attr("readonly",true);
			$.ajax({
				method:'POST',
				url:'/agsupport/ya-rain-report!saveContent.action',
				data:{ "id":id,"reportContent":str,"reportName":$("#reportName").val()},
				async:false,
				success:function(data){
					layer.msg(data.result);
				},
				error:function (e){
					layer.msg("保存失败");
				}
			});
		}, function(){
			
		});
       } else {
       	$("#eg").addClass("no-padding");
           $('.click2edit').summernote({
               lang: 'zh-CN',
               focus: true
           });
           $("#reportName").attr("readonly",false);
           $("#changenote").attr("status","save");
		$("#changenote").text("保存一雨一报内容");
       }
		}
		function delData(){		    
   	var selList=$("#table").bootstrapTable('getSelections');
   	if(selList.length==0)
   		layer.msg('请选中删除项');
   	else{
    	layer.confirm('是否删除选中项？', {
			btn: ['是','否'] //按钮
		}, function(){
			var checkedIds= new Array();
	    	for (var i=0;i<selList.length;i++){
	    		checkedIds.push(selList[i].id);
	    	}
    	    $.ajax({  
			    url: '/agsupport/ya-jsd-report!deleteMoreJson.action',  
			    traditional: true,
			    data: {"checkedIds" : checkedIds},
			    type: "POST",
			    dataType: "json",
			    success: function(data) {
			        layer.msg(data.result);
    				reloadData();
			    }
			});
		}, function(){
			
		});
   	}
}
 function exportWord(){
	if(id){
		var url = '/agsupport/ya-rain-report!exportWord.action?id='+id;
		window.open(url);
	}else{
		parent.layer.msg("导出失败");
	}
}