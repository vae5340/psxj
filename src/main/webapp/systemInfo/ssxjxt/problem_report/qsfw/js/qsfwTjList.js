var myChars,option,componentType,wtlx;
var usid_="";
var layerName_="";
$(function(){
	var Tables = new Table();
	Tables.Init();
	/*var Table2s = new Table2();
	Table2s.Init();*/
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
			url:'/psxj/lackMark/qsfwtj',//
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
			    {field:'objectid',title:'objectid',visible:false,align:'center'},
				{field:'qsdw',title:'权属单位',visible:true,align:'center'},
				{field:'yhdw',title:'养护单位',visible:true,align:'center'},
				{field:'yhfwms',title:'养护范围描述',visible:true,align:'center'},
				{field:'gwcd',title:'管网长度(米)',visible:true,align:'center'},
				{field:'memo1',title:'井数量',visible:false,align:'center'}
			],
			onClickRow: function(row){
				if(row.objectid!=null){
					position(row.objectid);
				}
			}
		});
	},
	Table.queryParms=function(params){
		var temp = {
			//pageSize:params.limit,
	        //pageNo: params.offset/params.limit+1,
	        szqy : $("#szqy").val(),
	        qslx : $("#qslx").val()
		};
		return temp;
	}
	return Table;
}
/*var Table2=function(){
	Table2 = new Object();
	Table2.Init=function(){
		$("#table").bootstrapTable({
			method: 'get',
			toolbar: '#toolbar', //工具按钮用哪个容器
			toggle:"tableCell",
			url:'/psxj/lack-mark!qsfwtj.action',//
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
			queryParams:Table2.queryParms,
			clickToSelect:true,
			onLoadSuccess: function(data){ //加载成功时执行
				appendTable2(data);
			},
			columns:[
			    {field:'qslx',title:'权属类型',visible:true,align:'center'},
				{field:'qsdw',title:'权属单位',visible:true,align:'center'},
				{field:'yhdw',title:'养护单位',visible:false,align:'center'},
				{field:'yhfwms',title:'养护范围描述',visible:false,align:'center'},
				{field:'gwcd',title:'管网长度(米)',visible:false,align:'center'},
				{field:'memo1',title:'井数量',visible:true,align:'center'}
			]
		});
	},
	Table2.queryParms=function(params){
		var temp = {
			//pageSize:params.limit,
	        //pageNo: params.offset/params.limit+1,
	        szqy : $("#szqy").val()
		};
		return temp;
	}
	return Table2;
}*/

//格式化时间
function format_date(val,rows,index){
	if(val)
		return getLocalTime(val.time);
	else
		return "";
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
	var text=$("#szqy").find("option:selected").text()+"-"+$("#qslx").find("option:selected").text()+"-排水设施分布统计";
	$("#table thead").prepend('<tr class="del"><th style="text-align: center;" colspan="4">'+text+'</th></tr>');
	var gwcd_total=0.00,j_total=0;
	if(data.rows.length>0){
		 for(var i=0;i<data.rows.length;i++){
			 gwcd_total+=Number(data.rows[i].gwcd);
			 //j_total+=parseInt(data.rows[i].memo1);
		 } 
	 }
	//<td style="text-align: center; ">'+j_total+'</td>
	var tableStr='<tr class="del"><td style="text-align: center;" colspan="3">合计</td><td style="text-align: center; ">'+gwcd_total.toFixed(2)+'</td></tr>';
	 $("#table tbody").append(tableStr);
}
/*//拼接table2
function appendTable2(data){
	$('#table2 tr .del').remove();
	var text=$("#szqy").find("option:selected").text()+"-统计报表";
	$("#table2 thead").prepend('<tr class="del"><th style="text-align: center;" colspan="5">'+text+'</th></tr>');
	var gwcd_total=0.00,j_total=0;
	if(data.rows.length>0){
		 for(var i=0;i<data.rows.length;i++){
			 gwcd_total+=Number(data.rows[i].gwcd);
			 j_total+=parseInt(data.rows[i].memo1);
		 } 
	 }
	var tableStr='<tr class="del"><td style="text-align: center;" colspan="3">合计</td><td style="text-align: center; ">'+gwcd_total.toFixed(2)+'</td><td style="text-align: center; ">'+j_total+'</td></tr>';
	 $("#table2 tbody").append(tableStr);
}*/
//导出
function loadToExcel(){
	var text=$("#szqy").find("option:selected").text()+"-"+$("#qslx").find("option:selected").text()+"-排水设施分布统计";
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
//权属范围定位
function position(objectid){
	toMap();
	window.parent.positionByObject(objectid);
}
//跳回到map地图
function toMap(){
	var aTab = parent.$(".page-tabs-content a[data-id*='wrapper-map']");
    aTab.addClass("active").siblings(".J_menuTab").removeClass("active");
    var aContent = parent.$(".J_mainContent .J_iframe[data-id*='wrapper-map']");
    aContent.show().siblings(".J_iframe").hide();
}

