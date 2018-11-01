$(function(){
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
   	
   	//获取作业名
   	getJobName();
	
	var TabJen = new TabJenkins();
	TabJen.Init();	
	
	//3.初始化Button的点击事件
	var oButtonInit = new ButtonInit();
	oButtonInit.Init();
	
});

var TabJenkins = function(){
	var tabjen = new Object();
	tabjen.Init = function(){
		var url="/agsupport/ps-jenkins-kettle-logs!listJson.action";
		$("#table").bootstrapTable({
			//method : 'GET',
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
				{field : 'count',title:'记录数',align : 'center'},
				{field : 'status',title:'运行结果',align : 'center',formatter : formatSuccFall},
				{field : 'updateTime',title:'更新时间',align : 'center',formatter : formatDates},
				{visible:true,title:'操作',align :'center',width:100,formatter:messagee}]
		});
	};
	var name;
	if($("#name").val()==null || $("#name").val().trim() =="")
		name = $("#likeName").val();
	else
		name = $("#name").val();
	tabjen.queryParams = function(params){
		var temp = {
			pageSize:params.limit,
			pageNo: params.offset/params.limit+1,
			name : ($("#name").val()==null || $("#name").val().trim() =="")?$("#likeName").val():$("#name").val(),
			status: $("#status").val(),
			startTime:$("#startTime").val(),
			endTime:$("#endTime").val()
		};
		return temp;
	};
return tabjen;
	
};

function formatSuccFall(value, rows, index) {
	if(value == 1) {
		return '<span style="color:green">成功</span>';
	} else if(value == 2){
		return '<span style="color:red">失败</span>';
	}
}

function formatDates(value, rows, index) {
	if(value) {
		return getLocalTime(value.time);
	}
	return "NNNN-NN-NN";
}

function messagee(value, rows, index) {
	return "<button type=\"button\" class=\"btn btn-primary\" style=\"border:1px solid transparent;\" onclick=\"detailDas('"+rows.id+"')\">日志</button>";
}

var ButtonInit = function () {
		var oInit = new Object();
		
		oInit.Init = function () {
			//初始化页面上面的按钮事件
			searchBtn();
		};
		return oInit;
};

function searchBtn(value, rows,index){
	$("#btn_query").on('click',function(){
        refreshTable();
	});
}

function refreshTable(value, rows,index){
	$("#table").bootstrapTable('refresh');
}

function detailDas(id) {
	layer.open({
		type: 2,
		title: '日志',
		maxmin: true, //开启最大化最小化按钮
		area: ['900px', '500px'],
	    content: 'jenkinsJobLog_His.html?id='+id
	});
}

function getJobName() {
	$.ajax({
		method : 'post',
		url : '/agsupport/ps-jenkins-kettle-logs!getJobName.action',
		async : true,
		dataType : 'json',
		success : function(data) {
		console.log(data);
			for(var i=0; i<data.rows.length; i++) {
				$("#name").append("<option value='"+data.rows[i].name+"'>" + data.rows[i].name + "</option>");
			}
		},
		error : function(error) {
			parent.layer.msg("获取作业名称失败");
		}
	});
}