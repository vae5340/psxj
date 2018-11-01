var myChars,option,componentType,wtlx;
var usid_="";
var layerName_="";
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


//加载设施纠错图表
var Table=function(){
	Table = new Object();
	Table.Init=function(){
		$("#table").bootstrapTable({
			method: 'get',
			toolbar: '#toolbar', //工具按钮用哪个容器
			toggle:"tableCell",
			url:'/psxj/sewerage-user!list.action',//
			rowStyle:"rowStyle",
			cache:false,
			pagination:true,
			dataType:'json',
			striped:true,
			sidePagination:"server",
			pageNumber: 1,
		    pageSize: 10,                       
		    pageList: [10, 25, 50, 100],
			queryParams:Table.queryParms,
			clickToSelect:true,
			columns:[
				{field:'id',title:'主键',visible:false,align:'center'},
				{field:'administrative',title:'行政区',visible:true,align:'center'},
				{field:'entryName',title:'项目名称',visible:true,align:'center'},
				{field:'licenseKey',title:'许可证号',visible:true,align:'center'},
				{field:'type',title:'排水户类型',visible:true,align:'center',formatter: format_type},
				{field:'state',title:'审核状态',visible:true,align:'center',formatter: format_state},
				{title:'操作',visible:true,align:'center',formatter: format_oper}]
		});
	},
	Table.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        administrative : $("#administrative").val(),
	        entryName : $("#entryName").val(),
	        licenseKey : $("#licenseKey").val(),
	        type : $("#type").val(),
	        state : $("#state").val()
		};
		return temp;
	}
	return Table;
}

//操作
function format_oper(val,row,index){
	var a ='<button type="button" class="btn btn-primary btn-sm" onclick="viewShow('+row.id +')">查看</button>';
	var b ='&nbsp;<button type="button" class="btn btn-primary btn-sm" onclick="updateShow('+row.id +')">修改</button>';
	var c ='&nbsp;<button type="button" class="btn btn-primary btn-sm" onclick="deleteRow('+row.id +')">删除</button>';
	return a+b+c; 
}
//格式化状态
function format_state(val,rows,index){
	if(val){
		if(val=="0"){
			return "未审核";
		}else if("1"==val){
			return "已审核";
		}else{
			return "";
		}
	}
	else
		return "";
}
//格式化类型
function format_type(val,rows,index){
	if(val){
		if(val=="0"){
			return "重点排水户";
		}else if("1"==val){
			return "一般排水户";
		}else{
			return "";
		}
	}
	else
		return "";
}
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
//删除
function deleteRow(thisId){
	layer.confirm('确定删除？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
    	$.ajax({
            type: 'post',
            url: '/psxj/sewerage-user!deleteRow.action',
            data: {id: thisId},
            dataType: 'json',
            success: function (data) {
            	if(data.success){
            		refreshTable();
            		layer.msg('删除成功！', {
                        icon: 1,
                        time: 2000
                    });
            	}else{
        			refreshTable();
        			layer.msg('删除失败！', {
                        icon: 1,
                        time: 2000
                    });
            	}
            }
    	});
    }, function () {
        return;
    });
}
//新增
function addShow(){
	layer.open({
		type: 2,
		area: ['1050px', '550px'],
		title : "新增",	
		maxmin: true,
		btn:['确定','取消'],
		content: ['/psxj/systemInfo/ssxjxt/problem_report/sewerage_user/sewerageUserInput.html', 'yes'],
		btn1: function(index,layero){
			$(layero).find("iframe")[0].contentWindow.save();
   		}
	});
}
//修改
function updateShow(id){
	layer.open({
		type: 2,
		area: ['1050px', '550px'],
		title : "修改",	
		maxmin: true,
		btn:['确定','取消'],
		content: ['/psxj/systemInfo/ssxjxt/problem_report/sewerage_user/sewerageUserInput.html?id='+id, 'yes'],
		btn1: function(index,layero){
			$(layero).find("iframe")[0].contentWindow.save();
   		}
	});
}
//修改
function viewShow(id){
	layer.open({
		type: 2,
		area: ['1050px', '550px'],
		title : "查看",	
		maxmin: true,
		btn:['确定','取消'],
		content: ['/psxj/systemInfo/ssxjxt/problem_report/sewerage_user/sewerageUserView.html?id='+id, 'yes']
	});
}

