//行业大类
var pcodeData=[
	          {"code":"1","name":"生活排污类"},
	          {"code":"2","name":"餐饮排污类"},
	          {"code":"3","name":"沉淀物排污类"},
	          {"code":"4","name":"有毒有害排污类"}
          ];
//行业小类
var codeData=[
           	  {"pCode":"生活排污类","data":[
                  {"code":"11","name":"机关企事业单位"},
                  {"code":"12","name":"学校"},
                  {"code":"13","name":"商场"},
                  {"code":"14","name":"居民住宅"},
                  {"code":"15","name":"其他"}
              ]},
              {"pCode":"餐饮排污类","data":[
                   {"code":"21","name":"餐饮店"},
                   {"code":"22","name":"农家乐"},
                   {"code":"23","name":"酒店"},
                   {"code":"24","name":"大型食堂"},
                   {"code":"25","name":"其他"}
               ]},
               {"pCode":"沉淀物排污类","data":[
                    {"code":"31","name":"洗车、修车档"},
                    {"code":"32","name":"沙场"},
                    {"code":"33","name":"建筑工地"},
                    {"code":"34","name":"养殖场"},
                    {"code":"35","name":"其他"}
                ]},
                {"pCode":"有毒有害排污类","data":[
                     {"code":"41","name":"化工"},
                     {"code":"42","name":"印染"},
                     {"code":"43","name":"电镀"},
                     {"code":"44","name":"医疗"},
                     {"code":"45","name":"其他"}
                 ]}
          ];
$(function(){
	var Tables = new Table();
	Tables.Init();
	initDatetimepicker();
	initHylbData();
	
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
	//初始化行业类别数据字典
	$('#dischargerType1').selectpicker({
		noneSelectedText: '请选择',
		actionsBox: true,
		selectAllText: "全选",
		deselectAllText: "清除",
		selectedTextFormat:"count>3",
		countSelectedText:"选中{0}个污水类别"
    });
	$('#dischargerType2').selectpicker({
		noneSelectedText: '请选择',
		actionsBox: true,
		selectAllText: "全选",
		deselectAllText: "清除",
		selectedTextFormat:"count>3",
		countSelectedText:"选中{0}个单位类型"
	});
	//下拉框监听改变事件
	 $('#dischargerType1').on('change',function(elv){
		$('#childCode').html("");  //每次改变大类清空子类
		if($(this).val()){
		   var selectVal = $(this).val();
		   for(i in selectVal){
			   for(k in codeData){
				   if(selectVal[i] == codeData[k].pCode){
					   for(v in codeData[k].data){
						  var code_c  = codeData[k].data[v].code;
						  var name_c =  codeData[k].data[v].name;
						  if(code_c) $("#childCode").append("<option value='"+name_c+"'>"+name_c+"</option>");
					   }
				   }
			   }
		   }
		}
		$('#dischargerType2').selectpicker('refresh');
	});
}

function initHylbData(){
	for(i in pcodeData){
		if(pcodeData[i].code)
			$("#pcode").append("<option value='"+pcodeData[i].name+"'>"+pcodeData[i].name+"</option>");
	}
	$('#dischargerType1').selectpicker('refresh');
	$('#dischargerType2').selectpicker('refresh');
}


//加载列表
var Table=function(){
	Table = new Object();
	Table.Init=function(){
		$("#table").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/pshDischarger/getPshList',//
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
				{field:'parentOrgName',title:'所属区域',visible:true,align:'center'},
				{field:'town',title:'所属镇(街)',visible:true,align:'center'},
				{field:'name',title:'排水户名称',visible:true,align:'center'},
				{field:'dischargerType1',title:'污水类别',visible:true,align:'center'},
				{field:'dischargerType2',title:'单位类型',visible:true,align:'center'},
				{field:'markTime',title:'上报时间',visible:true,align:'center',formatter: format_date},
				{field:'addr',title:'详细地址',visible:true,align:'center'},
				{field:'state',title:'审核状态',visible:true,align:'center',formatter: format_state},
				{title:'操作',visible:true,align:'center',formatter: format_oper}],
			onDblClickRow: function(row){
				viewShow(row.id);
			}
		});
	},
	Table.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        parentOrgName : $("#parentOrgName").val(),
	        town : $("#town").val(),
	        name : $("#name").val(),
	        addr : $("#addr").val(),
	        state : $("#state").val(),
	        lr : "true",
	        startTime : $("#startTime").val(),
	        endTime :  $("#endTime").val(),
	        dischargerType1: $("#dischargerType1").val()?$("#dischargerType1").val():"",
    		dischargerType2: $("#dischargerType2").val()?$("#dischargerType2").val():""
		};
		return temp;
	}
	return Table;
}

//操作
function format_oper(val,row,index){
	var c="",b="",a ='<button type="button" class="btn btn-primary btn-sm" onclick="updateShow('+row.id +')">修改</button>';
	if(row.doorplateAddressCode){
		c+='&nbsp;<button type="button" class="btn btn-primary btn-sm" onclick="toPoint(\''+row.doorplateAddressCode+'\')">定位</button>';
	}
	b+='&nbsp;<button type="button" class="btn btn-primary btn-sm" onclick="deleteRow('+row.id+')">删除</button>';
	return a+b+c;
}
//格式化状态
function format_state(val,rows,index){
	if(val){
		if(val=="1"){
			return "未审核";
		}else if("2"==val){
			return "审核通过";
		}else if("3"==val){
			return "存在疑问";
		}else{
			return val;
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
	$('#dischargerType1').selectpicker('refresh');
	$('#childCode').html("");
	$('#dischargerType2').selectpicker('refresh');
	refreshTable();
}
function importPsh(){
	layer.open({
		type: 2,
		area: ['600px', '380px'],
		title : "排水户导入",	
		maxmin: true,
		btn:['导入','取消'],
		content: ['/psxj/psh/psh_lr/pshImport.html', 'yes'],
		btn1: function(index,layero){
			$(layero).find("iframe")[0].contentWindow.importEmp();
   		}
	});
}
//修改排水户
function updateShow(id){
	layer.open({
		type: 2,
		area: ['1000px', '580px'],
		title : "排水户修改",	
		maxmin: true,
		btn:['保存','取消'],
		content: ['/psxj/psh/psh_lr/pshLrInput.html?type=update&id='+id, 'yes'],
		btn1: function(index,layero){
			$(layero).find("iframe")[0].contentWindow.save();
   		}
	});
}
//查看详情
function viewShow(id){
	layer.open({
		type: 2,
		area: ['850px', '550px'],
		title : "查看",	
		maxmin: true,
		btn:['确定','取消'],
		content: ['/psxj/psh/psh_query/pshInput.html?id='+id+'&type=view', 'yes']
	});
}
//删除
function deleteRow(thisId){
	layer.confirm('确定删除？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
    	$.ajax({
            type: 'post',
            url: '/psxj/pshDischarger/deleteRow',
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
//接驳井定位
function toPoint(sGuid){
	toMap();
	window.parent.positionSGuid(sGuid);
}
//跳回到map地图
function toMap(){
	var aTab = parent.$(".page-tabs-content a[data-id*='wrapper-map']");
    aTab.addClass("active").siblings(".J_menuTab").removeClass("active");
    var aContent = parent.$(".J_mainContent .J_iframe[data-id*='wrapper-map']");
    aContent.show().siblings(".J_iframe").hide();
}

