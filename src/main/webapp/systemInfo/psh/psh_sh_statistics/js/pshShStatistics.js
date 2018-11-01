$(function(){
	var Tables = new Table();
	Tables.Init();
	initDatetimepicker();
	
});
function initDatetimepicker(){
	$(".form_datetime").datetimepicker({
		 format: "yyyy-mm-dd",
		 autoclose: true,
		 todayBtn: true,
		 todayHighlight: true,
		 showMeridian: true,
		 pickerPosition: "bottom-left",
		 language: 'zh-CN',//中文，需要引用zh-CN.js包
		 startView: 2,//月视图
		 minView: 2//日期时间选择器所能够提供的最精确的时间选择视图
	 }); 
}

var Table=function(){
	Table = new Object();
	Table.Init=function(){
		$("#table").bootstrapTable({
			method: 'get',
			toolbar: '#toolbar', //工具按钮用哪个容器
			toggle:"tableCell",
			url:'/agsupport_swj/psh-discharger!statisticsForSh.action',//
			rowStyle:"rowStyle",
			cache:false,
			pagination:false,
			dataType:'json',
			striped:true,
			sidePagination:"server",
			undefinedText:'',
			pageNumber: 1,
		    pageSize: 10,                       
		    pageList: [10, 25, 50, 100],
			queryParams:Table.queryParms,
			clickToSelect:true,
			onLoadSuccess: function(data){ //加载成功时执行
				appendTable(data);
			},
			columns:[
			    {field: 'Number',title: '序号',align:'center',formatter: function (value, row, index) {return index+1;}},
				{field:'shr',title:'审核人',visible:true,align:'center'},
				{field:'shTotal',title:'审核次数',visible:true,align:'center'},
				{field:'total',title:'审核条数',visible:true,align:'center'},
				{field:'pass',title:'已通过',visible:true,align:'center'},
				{field:'doubt',title:'疑问',visible:true,align:'center'}
			]
		});
	},
	Table.queryParms=function(params){
		var temp = {
			//pageSize:params.limit,
	        //pageNo: params.offset/params.limit+1,
			startTime : $("#startTime").val(),
	        endTime :  $("#endTime").val()
		};
		return temp;
	}
	return Table;
}

//刷新 
function refreshTable(){
	$("#table").bootstrapTable('refresh');
	//$("#table2").bootstrapTable('refresh');
}
//搜索
function search(){
	refreshTable();
}
//清空
function resets(){
	$('#myform')[0].reset();
	refreshTable();
}
//拼接table
function appendTable(data){
	$('tr.del').remove();
	var dateStr="";
	var startTime= $("#startTime").val();
	var endTime= $("#endTime").val();
	var date = new Date();//默认为当前时间
	if(startTime!="" || endTime!=""){
		if(startTime!=""){
			dateStr+=startTime.substring(0,4)+'年'+startTime.substring(5,7)+'月'+startTime.substring(8)+'日'+'-';
		}else{
			dateStr+="2018年01月01日-";
		}
		if(endTime!=""){
			dateStr+=endTime.substring(0,4)+'年'+endTime.substring(5,7)+'月'+endTime.substring(8)+'日';
		}else{
			dateStr+=date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate()+'日';
		}
	}else{
	    dateStr=date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate()+'日';
	}
	var text=dateStr+"排水户审核统计报表";
	$("#table thead").prepend('<tr class="del"><th style="text-align: center;" colspan="6">'+text+'</th></tr>');
	var total=0,pass=0,doubt=0,shTotal=0;
	if(data.rows.length>0){
		 for(var i=0;i<data.rows.length;i++){
			 shTotal+=Number(data.rows[i].shTotal);
			 total+=Number(data.rows[i].total);
			 pass+=Number(data.rows[i].pass);
			 doubt+=Number(data.rows[i].doubt);
		 } 
	 }
	//<td style="text-align: center; ">'+j_total+'</td>
	var tableStr='<tr class="del"><td style="text-align: center;" colspan="2">合计</td><td style="text-align:center;">'+shTotal+'</td><td style="text-align:center;">'+total+'</td><td style="text-align:center;">'+pass+'</td><td style="text-align:center;">'+doubt+'</td></tr>';
	 $("#table tbody").append(tableStr);
}
//导出
function loadToExcel(){
	var dateStr="";
	var startTime= $("#startTime").val();
	var endTime= $("#endTime").val();
	var date = new Date();//默认为当前时间
	if(startTime!="" || endTime!=""){
		if(startTime!=""){
			dateStr+=startTime.substring(0,4)+'年'+startTime.substring(5,7)+'月'+startTime.substring(8)+'日'+'-';
		}else{
			dateStr+="2018年01月01日-";
		}
		if(endTime!=""){
			dateStr+=endTime.substring(0,4)+'年'+endTime.substring(5,7)+'月'+endTime.substring(8)+'日';
		}else{
			dateStr+=date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate()+'日';
		}
	}else{
	    dateStr=date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate()+'日';
	}
	var text=dateStr+"排水户审核统计报表";
	 if (getExplorer() == 'ie' || getExplorer() == undefined) {  
		 $('#table').tableExport({ type: 'excel', escape: 'false',fileName:text });  
     }  
     else {  
         HtmlExportToExcelForEntire("table",text)  
     }
}
//非IE浏览器导出Excel  
var HtmlExportToExcelForEntire = (function() {  
    var uri = 'data:application/vnd.ms-excel;base64,',  
template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',  
base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) },  
format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }  
    return function(table, name) {  
        if (!table.nodeType) { table = document.getElementById(table); }  
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }  
        document.getElementById("dlink").href = uri + base64(format(template, ctx));  
        document.getElementById("dlink").download = name + ".xls";  
        document.getElementById("dlink").click();  
    }  
})()
function getExplorer() {  
    var explorer = window.navigator.userAgent;  
    //ie   
    if (explorer.indexOf("MSIE") >= 0) {  
        return 'ie';  
    }  
    //firefox   
    else if (explorer.indexOf("Firefox") >= 0) {  
        return 'Firefox';  
    }  
    //Chrome  
    else if (explorer.indexOf("Chrome") >= 0) {  
        return 'Chrome';  
    }  
    //Opera  
    else if (explorer.indexOf("Opera") >= 0) {  
        return 'Opera';  
    }  
    //Safari  
    else if (explorer.indexOf("Safari") >= 0) {  
        return 'Safari';  
    }  
}

