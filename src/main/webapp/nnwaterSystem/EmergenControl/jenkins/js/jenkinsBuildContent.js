//数据填充	    
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}
var name=getQueryStr("name");

$(function(){
	ajaxJobName();

	var TabJen = new TabJenkins();	
	TabJen.Init();	
	
	//3.初始化Button的点击事件
	var oButtonInit = new ButtonInit();
	oButtonInit.Init();
	
	/**
	if(!name){
		$("#header").show();
		ajaxJobName();
	}else{
		$("#header").hide();
	}
	*/
	
});

function ajaxJobName(){
	$.ajax({
		method : 'get',
		url : '/agsupport/ps-jenkins-data!getJobs.action',
		async : false,
		dataType : 'json',
		success : function (data){
			$("<option/>").val("test").text("--请选择--").appendTo("#jonname");
			for(key in data.rows){
				$("<option/>").text(data.rows[key].name).appendTo("#jonname");
			}
		},error:function(){}
	});
}

var TabJenkins = function(){
	var tabjen = new Object();
	tabjen.Init = function(){
		var url="/agsupport/ps-jenkins-data!getJenkinsBuildLog.action";
		if(name){
			//url = encodeURI(url+'?jonname='+name);
			$("select#jonname").val(name);
		}
		$("#table").bootstrapTable({
			method : 'GET',
			toggle:"table",
			url : url,
			rowStyle:"rowStyle",
			cache: false, 
			pagination:true,
			striped: false,
			pageNumber:1,
		    pageSize: 10,
			pageList: [10, 25, 50, 100],
			queryParams: tabjen.queryParams,
			sidePagination: "server",
			columns: [
				{field : 'name',title : '作业', align : 'center'},
				{field : 'number',title:'记录数',align : 'center'},
				{field : 'result',title:'运行结果',align : 'center',formatter : formatSuccFall},
				{field : 'timestamp',title:'更新时间',align : 'center',formatter : formatDates},
				{visible:true,title:'操作',align :'center',width:100,formatter:messagee}]
		});
	};
	
	tabjen.queryParams = function(params){
		var temp = {
			pageSize:params.limit,
			pageNo: params.offset/params.limit+1,
			jonname : encodeURI($("#jonname").val())
		};
		return temp;
	};
	return tabjen;
};

var ButtonInit = function () {
		var oInit = new Object();
		var postdata = {};

		oInit.Init = function () {
			//初始化页面上面的按钮事件
			searchBtn();
		};
		return oInit;
};

function formatDates(value,row,index){
	if(value){
		return getLocalTime(value);
	}
	return 'NNNN-NN-NN';
}
function formatName(value,row,index){
	if(value.indexOf('(') > -1){
		var content = value.split(' (')[0];
		return content;
	}else{
		return value;
	}
}
// 操作
function messagee(value,rows,index){
	return "<button type=\"button\" class=\"btn btn-primary\" style=\"border:1px solid transparent;\" onclick=\"detailDas('"+rows.name+"','"+rows.number+"')\">日志</button>";
}

function detailDas(name,number){
			layer.open({
					type: 2,
					title: '日志',
					maxmin: true, //开启最大化最小化按钮
					area: ['900px', '500px'],
				    content: 'jenkinsJobLog.html?name='+name+'&count='+number
			});
		}
function formatSuccFall(value, rows,index){
	if(value){
		if(value.indexOf('FAILURE') > -1){
			return '<font color="red">失败</font>';
		}else if(value.indexOf('SUCCESS') > -1){
			return '<font color="blue">成功</font>';
		}else if(value.indexOf('ABORTED')>-1){
			return '<font color="red">异常终止</font>';
		}else{
			return '无';
		}
	}else{
		return '';
	}
}
//搜索 
function searchBtn(){
	$("#btn_query").on('click',function(){
        refreshTable();
	});
}
function refreshTable(){
	$("#table").bootstrapTable('refresh');
}
/**
function detailDas(value){
	if(value.indexOf('#') > -1 && value.indexOf('(') > -1){
		var jobname = value.replace(/[ ]/g, "").split('(')[0];
		var nameString = jobname.split('(')[0].split('#')[0];
		var count = jobname.split('(')[0].split('#')[1];
		window.open('jenkinsJobLog.html?name='+nameString+'&count='+count);
	}else{
		alert();
	}
}
*/ 