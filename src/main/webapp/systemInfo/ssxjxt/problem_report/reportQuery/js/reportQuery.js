var myChars,option,componentType,wtlx;
$(function(){
	
	initDatetimepicker();
	//初始化设施类型数据字典
	initComponentType();
	getNum();
	
});
//获取总数
function getNum(){
	$('#problemTable').on('load-success.bs.table', function () {
		var wtsbNum =$('#problemTable').bootstrapTable('getOptions').totalRows;
		if(!wtsbNum){
			wtsbNum=0;
		}
		$("#wtsbNum").text('('+wtsbNum+')');
	});
	$('#lackAddTable').on('load-success.bs.table', function () {
		var sjxzNum =$('#lackAddTable').bootstrapTable('getOptions').totalRows;
		if(!sjxzNum){
			sjxzNum =0;
		}
		$("#sjxzNum").text('('+sjxzNum+')');
	});
	$('#lackTable').on('load-success.bs.table', function () {
		var sjqrNum =$('#lackTable').bootstrapTable('getOptions').totalRows;
		if(!sjqrNum){
			sjqrNum =0;
		}
		$("#sjqrNum").text('('+sjqrNum+')');
	});
	$('#correctTable').on('load-success.bs.table', function () {
		var sjjcNum =$('#correctTable').bootstrapTable('getOptions').totalRows;
		if(!sjjcNum){
			sjjcNum=0;
		}
		$("#sjjcNum").text('('+sjjcNum+')');
	});
	$('#notCorrectTable').on('load-success.bs.table', function () {
		var notClass=$('#not_correct_Tab').attr('class');
		if(notClass.indexOf('active')!=-1){
			var ykwkjNum =$('#notCorrectTable').bootstrapTable('getOptions').totalRows;
			if(!ykwkjNum){
				ykwkjNum=0;
			}
			$("#ykwkjNum").text('('+ykwkjNum+')');
		}
	});
}

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
	//初始化问题类型数据字典
	$('#wentilx').selectpicker({
		noneSelectedText: '请选择',
		actionsBox: true,
		selectAllText: "全选",
		deselectAllText: "反选",
		selectedTextFormat:"count>3",
		countSelectedText:"选中{0}个问题"
    });
	$('#wentilx-2').selectpicker({
		noneSelectedText: '请选择',
		actionsBox: true,
		selectAllText: "全选",
		deselectAllText: "反选",
		selectedTextFormat:"count>3",
		countSelectedText:"选中{0}个问题"
	});
	
	if(parent.awater.code){
		initSuzd();
	}
	//下拉框监听改变事件
	 $('#wentilx').on('change',function(elv){
		 var selectVals = $("#wentilx-2").val();
		$('#childCode').html("");  //每次改变大类清空子类
		if($(this).val()){
			var codeData = parent.awater.code.data;
		   var selectVal = $(this).val();
		   for(i in selectVal){
			   for(k in codeData){
				   if(selectVal[i] == codeData[k].code){
					   for(v in codeData[k].data){
						  var code_c  = codeData[k].data[v].code;
						  var name_c =  codeData[k].data[v].name;
						  if(code_c) $("#childCode").append("<option value='"+code_c+"'>"+name_c+"</option>");
					   }
				   }
			   }
		   }
		}
		$('#wentilx-2').selectpicker('refresh');
	});
}
//加载问题类型下拉框
var initSuzd=function(){
	var childArr = {},pcodeData=parent.awater.code.pcode;
	for(i in pcodeData){
		if(pcodeData[i].code)
			$("#pcode").append("<option value='"+pcodeData[i].code+"'>"+pcodeData[i].name+"</option>");
	}
	$('#wentilx').selectpicker('refresh');
	 $('#wentilx-2').selectpicker('refresh');
}
function initComponentType(){
	debugger;
	$.ajax({
        type:'post',
        //url:'/psxj/asi/municipalBuild/facilityLayout/metacodeitem!getItemList.action',
        url:'/psxj/rest/report/listWtsbTree',
        data:{},
        dataType:'json',
        success:function(result){
        	debugger;
        	if(result){
        		componentType=result.facility_type;
        		wtlx=result.wtlx3;
        		for(var i in result.facility_type){//设施类型
        			item = result.facility_type[i];
        			$("#componentType").append("<option value='"+item.code+"'>"+item.name+"</option>");
        		}
        		for(var i in result.yzdw){//上报单位
        			item = result.yzdw[i];
        			$("#parentOrgId").append("<option value='"+item.orgId+"'>"+item.orgName+"</option>");
        		}
        		//审核状态
        		$("#shzt").append("<option value='1'>未审核</option>");
        		$("#shzt").append("<option value='2'>已审核</option>");
        		$("#shzt").append("<option value='3'>存在疑问</option>");
        		var problemTables = new ProblemTable();
        		problemTables.Init();
        		var lackTables = new LackTable();
        		lackTables.Init();
        		var lackAddTables = new LackAddTable();
        		lackAddTables.Init();
        		var correctTables = new CorrectTable();
        		correctTables.Init();
        		/*var notCorrectTables = new NotCorrectTable();
        		notCorrectTables.Init();*/
        	}
        }
    });
}
//加载问题上报图表
var ProblemTable=function(){
	ProblemTable = new Object();
	ProblemTable.Init=function(){
		$("#problemTable").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/gxProblemrReport/searchSbPage',
			rowStyle:"rowStyle",
			cache:false,
			pagination:true,
			dataType:'json',
			striped:true,
			sidePagination:"server",
			pageNumber: 1,
		    pageSize: 10,                       
		    pageList: [10, 25, 50, 100],
			queryParams:ProblemTable.queryParms,
			clickToSelect:true,
			columns:[
				{field:'id',title:'编号',visible:false,algin:'center'},
				{field:'sbr',title:'上报人',visible:true,align:'center'},
				{field:'sbsj',title:'上报时间',visible:true,align:'center',formatter: format_date},
				{field:'sslx',title:'设施类型',visible:true,align:'center',formatter: format_sslx},
				{field:'bhlx',title:'问题类型',visible:true,align:'center',formatter: format_bhlx},
				{field:'wtms',title:'问题描述',visible:false,align:'center'},
				{field:'jdmc',title:'所在道路',visible:true,align:'center'},
				{field:'szwz',title:'问题地点',visible:false,align:'center'},
				{field:'parentOrgName',title:'上报单位',visible:true,align:'center'},
				{field:'state',title:'办理状态',visible:true,align:'center',formatter: format_state},
				{title:'操作',visible:true,align:'center',formatter: format_oper}]
		});
	},
	ProblemTable.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
            startTime : $("#startTime").val()?new Date(Date.parse($("#startTime").val().replace(/-/g,"/"))).getTime():'',
            endTime : $("#startTime").val()? new Date(Date.parse($("#endTime").val().replace(/-/g,"/"))).getTime():'',
	        sslx : $("#componentType").val(),
	        parentOrgId : $("#parentOrgId").val(),
	        sbr : $("#sbr").val(),
	        jdmc : $("#szdl").val()
	    };
		return temp;
	}
	return ProblemTable;
}
//加载数据确认图表
var LackTable=function(){
	LackTable = new Object();
	LackTable.Init=function(){
		$("#lackTable").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/correctMark/searchSbPage',
			method: 'get',
			rowStyle:"rowStyle",
			cache:false,
			pagination:true,
			dataType:'json',
			striped:true,
			sidePagination:"server",
			pageNumber: 1,
		    pageSize: 10,                       
		    pageList: [10, 25, 50, 100],
			queryParams:LackTable.queryParms,
			clickToSelect:true,
			columns:[
				{field:'id',title:'编号',visible:false,algin:'center'},
				{field:'markPersonId',title:'标识人编号',visible:false,align:'center'},
				{field:'objectId',title:'上报编号',visible:true,align:'center'},
				{field:'markPerson',title:'上报人',visible:true,align:'center'},
				{field:'layerName',title:'设施类型',visible:true,align:'center'},
				{field:'layerId',title:'图层id',visible:false,align:'center'},
				{field:'markTime',title:'上报时间',visible:true,align:'center',formatter: format_date},
				{field:'correctType',title:'核准类型',visible:true,align:'center'},
				{field:'road',title:'所在道路',visible:true,align:'center'},
				{field:'teamOrgName',title:'队伍',visible:false,align:'center'},
				{field:'directOrgName',title:'直属单位',visible:false,align:'center'},
				{field:'parentOrgName',title:'上报单位',visible:true,align:'center'},
				{field:'pcode',title:'问题大类',visible:true,align:'center',formatter: format_pcode},
				{field:'childCode',title:'问题子类',visible:true,align:'center',formatter: format_childCode},
				{field:'x',title:'经度',visible:false,align:'center'},
				{field:'y',title:'纬度',visible:false,align:'center'},
				{field:'cityVillage',title:'管理状态',visible:true,align:'center'},
				{field:'checkState',title:'审核状态',visible:true,align:'center',formatter: format_checkState},
				{title:'操作',visible:true,align:'center',formatter: format_lack_oper}]
		});
	},
	LackTable.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        //markPerson : $("#markPerson").val(),
	        //directOrgName : $("#directOrgName").val(),
	        //parentOrgName : $("#parentOrgName").val()
	        parentOrgId : $("#parentOrgId").val(),
	        layerName : $("#componentType").find("option:selected").text(),
	        markPerson : $("#sbr").val(),
	        /*startTime : $("#startTime").val(),
	        endTime :  $("#endTime").val(),*/
            startTime : $("#startTime").val()?new Date(Date.parse($("#startTime").val().replace(/-/g,"/"))).getTime():'',
            endTime : $("#startTime").val()? new Date(Date.parse($("#endTime").val().replace(/-/g,"/"))).getTime():'',
	        reportType:"confirm",
	        road : $("#szdl").val(),
	        checkState : $("#shzt").val(),
	        checkDesription : $("#shyj").val(),
	        objectId: $("#objectId").val(),
	        cityVillage: $("#cityVillage").val(),
	        pcode: $("#wentilx").val()?$("#wentilx").val():"",
	        childCode: $("#wentilx-2").val()?$("#wentilx-2").val():""
		};
		return temp;
	}
	return LackTable;
}
//加载设施新增图表
var LackAddTable=function(){
	LackAddTable = new Object();
	LackAddTable.Init=function(){
		$("#lackAddTable").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/lackMark/searchSbPage',
			method: 'get',
			rowStyle:"rowStyle",
			cache:false,
			pagination:true,
			dataType:'json',
			striped:true,
			sidePagination:"server",
			pageNumber: 1,
		    pageSize: 10,                       
		    pageList: [10, 25, 50, 100],
			queryParams:LackAddTable.queryParms,
			clickToSelect:true,
			columns:[
				{field:'id',title:'编号',visible:false,algin:'center'},
				{field:'markPersonId',title:'标识人编号',visible:false,align:'center'},
				{field:'objectId',title:'上报编号',visible:true,align:'center'},
				{field:'markPerson',title:'上报人',visible:true,align:'center'},
				{field:'componentType',title:'设施类型',visible:true,align:'center'},
				{field:'markTime',title:'上报时间',visible:true,align:'center',formatter: format_date},
				{field:'updateTime',title:'更新时间',visible:false,align:'center',formatter: format_date},
				{field:'isBinding',title:'上报类型',visible:true,align:'center',formatter: format_isBinding},
				{field:'road',title:'所在道路',visible:true,align:'center'},
				{field:'teamOrgName',title:'队伍',visible:false,align:'center'},
				{field:'directOrgName',title:'直属单位',visible:false,align:'center'},
				{field:'parentOrgName',title:'上报单位',visible:true,align:'center'},
				{field:'pcode',title:'问题大类',visible:true,align:'center',formatter: format_pcode},
				{field:'childCode',title:'问题子类',visible:true,align:'center',formatter: format_childCode},
				{field:'cityVillage',title:'管理状态',visible:true,align:'center'},
				{field:'checkState',title:'审核状态',visible:true,align:'center',formatter: format_checkState},
				{title:'操作',visible:true,align:'center',formatter: format_lack_add_oper}]
		});
	},
	LackAddTable.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        //markPerson : $("#markPerson").val(),
	        //directOrgName : $("#directOrgName").val(),
	        //parentOrgName : $("#parentOrgName").val()
	        /*startTime : $("#startTime").val(),
			 endTime :  $("#endTime").val(),*/
            startTime : $("#startTime").val()?new Date(Date.parse($("#startTime").val().replace(/-/g,"/"))).getTime():'',
            endTime : $("#startTime").val()? new Date(Date.parse($("#endTime").val().replace(/-/g,"/"))).getTime():'',
	        markPerson : $("#sbr").val(),
	        parentOrgId: $("#parentOrgId").val(),
	        componentType : $("#componentType").find("option:selected").text(),
	        road : $("#szdl").val(),
	        checkState : $("#shzt").val(),
	        checkDesription : $("#shyj").val(),
	        objectId: $("#objectId").val(),
	        cityVillage: $("#cityVillage").val(),
	        pcode: $("#wentilx").val()?$("#wentilx").val():"",
	    	childCode: $("#wentilx-2").val()?$("#wentilx-2").val():""
	        //isBinding : "0"
		};
		return temp;
	}
	return LackAddTable;
}
//加载设施纠错图表
var CorrectTable=function(){
	CorrectTable = new Object();
	CorrectTable.Init=function(){
		$("#correctTable").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/correctMark/searchSbPage',
			method: 'get',
			rowStyle:"rowStyle",
			cache:false,
			pagination:true,
			dataType:'json',
			striped:true,
			sidePagination:"server",
			pageNumber: 1,
		    pageSize: 10,                       
		    pageList: [10, 25, 50, 100],
			queryParams:CorrectTable.queryParms,
			clickToSelect:true,
			columns:[
				{field:'id',title:'编号',visible:false,algin:'center'},
				{field:'markPersonId',title:'标识人编号',visible:false,align:'center'},
				{field:'objectId',title:'上报编号',visible:true,align:'center'},
				{field:'markPerson',title:'上报人',visible:true,align:'center'},
				{field:'layerName',title:'设施类型',visible:true,align:'center'},
				{field:'layerId',title:'图层id',visible:false,align:'center'},
				{field:'markTime',title:'上报时间',visible:true,align:'center',formatter: format_date},
				{field:'correctType',title:'核准类型',visible:true,align:'center'},
				{field:'road',title:'所在道路',visible:true,align:'center'},
				{field:'teamOrgName',title:'队伍',visible:false,align:'center'},
				{field:'directOrgName',title:'直属单位',visible:false,align:'center'},
				{field:'parentOrgName',title:'上报单位',visible:true,align:'center'},
				{field:'pcode',title:'问题大类',visible:true,align:'center',formatter: format_pcode},
				{field:'childCode',title:'问题子类',visible:true,align:'center',formatter: format_childCode},
				{field:'x',title:'经度',visible:false,align:'center'},
				{field:'y',title:'纬度',visible:false,align:'center'},
				{field:'cityVillage',title:'管理状态',visible:true,align:'center'},
				{field:'checkState',title:'审核状态',visible:true,align:'center',formatter: format_checkState},
				{title:'操作',visible:true,align:'center',formatter: format_correct_oper}]
		});
	},
	CorrectTable.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        //markPerson : $("#markPerson").val(),
	        //directOrgName : $("#directOrgName").val(),
	        parentOrgId : $("#parentOrgId").val(),
	        layerName : $("#componentType").find("option:selected").text(),
	        markPerson : $("#sbr").val(),
            startTime : $("#startTime").val()?new Date(Date.parse($("#startTime").val().replace(/-/g,"/"))).getTime():'',
            endTime : $("#startTime").val()? new Date(Date.parse($("#endTime").val().replace(/-/g,"/"))).getTime():'',
	        reportType:"modify",
	        road : $("#szdl").val(),
	        checkState : $("#shzt").val(),
	        checkDesription : $("#shyj").val(),
	        objectId: $("#objectId").val(),
	        cityVillage: $("#cityVillage").val(),
	        pcode: $("#wentilx").val() ? $("#wentilx").val():"",
	    	childCode: $("#wentilx-2").val()?$("#wentilx-2").val():""
		};
		return temp;
	}
	return CorrectTable;
}

//应开未开井
var NotCorrectTable=function(){
	NotCorrectTable = new Object();
	NotCorrectTable.Init=function(){
		$("#notCorrectTable").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/correctMark/searchNotCorrectPage',
			method: 'get',
			rowStyle:"rowStyle",
			cache:false,
			pagination:true,
			dataType:'json',
			striped:true,
			sidePagination:"server",
			pageNumber: 1,
		    pageSize: 10,                       
		    pageList: [10, 25, 50, 100],
			queryParams:NotCorrectTable.queryParms,
			clickToSelect:true,
			columns:[
				{field:'usid',title:'标识码',algin:'center'},
				{field:'district',title:'所在区',algin:'center'},
				{field:'ownerdept',title:'所属部门',align:'center'},
				{field:'addr',title:'地址',visible:true,align:'center'},
				{field:'sort',title:'井类型',visible:true,align:'center'},
				{field:'material',title:'井材质',visible:true,align:'center'},
				{field:'objectid',title:'查询编号',algin:'center'},
				{title:'操作',visible:true,align:'center',formatter: format_not_correct_oper}]
		});
	},
	NotCorrectTable.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
            startTime : $("#startTime").val()?new Date(Date.parse($("#startTime").val().replace(/-/g,"/"))).getTime():'',
            endTime : $("#startTime").val()? new Date(Date.parse($("#endTime").val().replace(/-/g,"/"))).getTime():'',
	        parentOrgName : $("#parentOrgId").find("option:selected").text()
	       };
		return temp;
	}
	return NotCorrectTable;
}

//格式化设施类型
function format_sslx(val,row,index){
	if(val){
		for(var i in componentType){
			if(val==componentType[i].code){
				return componentType[i].name;
			}
		}
		return val;
	}else{
		return "";
	}
}
//格式化审核状态
function format_checkState(val,row,index){
	if(val){
		if("1"==val){
			return "未审核";
		}else if("2"==val){
			return "已审核";
		}else if("3"==val){
			return "存在疑问";
		}else{
			return "未同步";
		}
			
	}else{
		return "未同步";
	}
}
function format_isBinding(val,row,index){
	if(val){
		if("0"==val)
			return "数据新增";
		else
			return "";
	}else{
		return "";
	}
}
//格式化问题类型
function format_bhlx(val,row,index){
	/*if(val){
		for(var i in wtlx){
			if(val==wtlx[i].code){
				return wtlx[i].name;
			}
		}
		return val;
	}else{
		return "";
	}*/
	return getDicName(wtlx, val);
}
//解决一个字段多个数据字典值拼接
function getDicName(dicAry, value) {
    if (dicAry != null && dicAry != undefined) {
        value = "" + value;
        if (value.indexOf(",") != -1) {
            var disname = "";
            var checkboxAry = value.split(",");
            for (var k in checkboxAry) {
            	for (var j in dicAry) {
                    if (dicAry[j].code == checkboxAry[k]) {
                        disname += dicAry[j].name + ",";
                        break;//满足一个就弹出
                    }
                }

            }
            return disname.substring(0, disname.length - 1);
        } else {
            for (var j in dicAry) {
                if (dicAry[j].code == value) {
                    return dicAry[j].name;
                }
            }
            return "";
        }
    }
}
/*//问题上报导出word
function exportWord(id){
	var index = layer.msg('导出中，请稍候...', {icon: 16});
	$.ajax({
        type: 'post',
        url: '/psxj/gx-problem-report!exportWtsb.action',
        data: {id: id},
        dataType: 'json',
        success: function (data) {
        	layer.close(index);
    		layer.alert('导出成功！');
        },
        error: function (data) {
        	layer.close(index);
    		layer.alert('导出失败！');
        },
        
	});
}*/
//问题上报导出word
function exportWord(id){
	layer.msg('导出中，请稍等...', {time:2000}, {icon: 16});
	window.location.href="/psxj/gx-problem-report!exportWtsb.action?id="+id;
}

//问题上报导出word
function exportExcelForNotCorrect(){
	var index = layer.msg('导出中，请稍等...数据量较大时，导出需要等待几分钟',{time:10000}, {icon: 16});
	window.location.href="/psxj/correct-mark!exportExcelForNotCorrect.action?parentOrgName="+$("#parentOrgId").find("option:selected").text();
}

//删除已开井
function delCorrected(){
	layer.confirm('确认要删除吗？', {
        btn : [ '确定', '取消' ]//按钮
    }, function(index) {
        layer.close(index);
        var index = layer.msg('删除中，请稍候...', {icon: 16});
    	$.ajax({
            type: 'post',
            url: '/psxj/correctMark/delCorrected',
            dataType: 'json',
            success: function (data) {
            	layer.close(index);
        		layer.alert('操作成功！'+data.message);
            },
            error: function (data) {
            	layer.close(index);
        		layer.alert('删除失败！');
            },
            
    	});
    }); 
}
//格式化问题类型
function format_pcode(val,row,index){
	if(parent.awater){
		var pcode = parent.awater.code.pcode;
		var arr = val.split(',');
		var html="";
		for(i in arr){
			var code = arr[i];
			for(k in pcode){
				if(code==pcode[k].code){
					var codeName = pcode[k].name;
					html+=html==""? codeName:","+codeName;
				}
			}
		}
		return html==""?"无":html;
	}
	return "无";
}
function format_childCode(val,row,index){
	if(parent.awater){
		var childCode = parent.awater.code.childCode;
		var arr = val.split(',');
		var html="";
		for(i in arr){
			var code = arr[i];
			for(k in childCode){
				if(code==childCode[k].code){
					var codeName = childCode[k].name;
					html+=html==""? codeName:","+codeName;
				}
			}
		}
		return html==""?"无":html;
	}
	return "无";
}
//操作(问题上报)
function format_oper(val,row,index){
	var a="",b ='<button type="button" class="btn btn-primary btn-sm" onclick="toInfor(\''+row.id+'\',\''+row.state+'\')">查看</button>';
	if(row.x && row.y){
		a+='&nbsp;<button type="button" class="btn btn-primary btn-sm" onclick="toPoint('+row.x+','+row.y+')">定位</button>';
	}
	var c='&nbsp;<button type="button" class="btn btn-primary btn-sm" onclick="exportWord('+row.id+')">导出word</button>';
	return b+a;
}
//数据确认
function format_lack_oper(val,row,index){
	var a="",b ='<button type="button" class="btn btn-primary btn-sm" onclick="toLackInfor('+row.id +')">查看</button>';
	if(row.x && row.y){
		a+='&nbsp;<button type="button" class="btn btn-primary btn-sm" onclick="toPoint('+row.x+','+row.y+')">定位</button>';
	}
	return b+a; 
}
//数据新增
function format_lack_add_oper(val,row,index){
	var a="",b ='<button type="button" class="btn btn-primary btn-sm" onclick="toLackAddInfor('+row.id +')">查看</button>';
	if(row.x && row.y){
		a+='&nbsp;<button type="button" class="btn btn-primary btn-sm" onclick="toPoint('+row.x+','+row.y+')">定位</button>';
	}
	return b+a; 
}
//数据纠错
function format_correct_oper(val,row,index){
	var a="",b ='<button type="button" class="btn btn-primary btn-sm" onclick="toCorrectInfor('+row.id +')">查看</button>';
	if(row.x && row.y){
		a+='&nbsp;<button type="button" class="btn btn-primary btn-sm" onclick="toPoint('+row.x+','+row.y+')">定位</button>';
	}
	return b+a; 
}
//应开未开井
function format_not_correct_oper(val,row,index){
	var c='';
	if(index==0){
		c='<button type="button" class="btn btn-primary btn-sm" onclick="exportExcelForNotCorrect()">全部导出excel</button>';
	}else if(index==1){
		c='<button type="button" class="btn btn-primary btn-sm" onclick="delCorrected()">删除已开井</button>';
	}
	return c; 
}

//格式化时间
function format_date(val,rows,index){
	if(val)
		return getLocalTime(val.time?val.time:val);
	else
		return "";
}
//格式化状态
function format_state(val,rows,index){
	return val;
	/*if(val){
		if(rows.isbyself=="true"){
			return "自行处理";
		}else if("active"==val){
			return "办理中";
		}else if("ended"==val){
			return "已办结";
		}else{
			return "";
		}
	}
	else
		return "自行处理";*/
}
//刷新 
function refreshTable(){
	var notClass=$('#not_correct_Tab').attr('class');
	if(notClass && notClass.indexOf('active')!=-1){//应开未开井活跃才去刷新，不然速度很慢
		$("#notCorrectTable").bootstrapTable('refresh');
	}else{
		$("#problemTable").bootstrapTable('refresh');
		$("#lackTable").bootstrapTable('refresh');
		$("#lackAddTable").bootstrapTable('refresh');
		$("#correctTable").bootstrapTable('refresh');
	}
}
//搜索
function search(){
	refreshTable();
}
//清空
function resets(){
	$('#myform')[0].reset();
	$('#wentilx').selectpicker('refresh');
	$('#childCode').html("");
	 $('#wentilx-2').selectpicker('refresh');
	refreshTable();
}
//数据确认详情页面
function toLackInfor(thisId){
	layer.open({
		type: 2,
		area: ['1050px', '550px'],
		maxmin: true,
		title : "查看确认信息",	
		btn:['确定','取消'],
		content: ['/psxj/systemInfo/ssxjxt/problem_report/parts_correct/correctInput.html?id='+thisId+'&type=view', 'yes']
	});
}
//数据新增详情页面
function toLackAddInfor(thisId){
	layer.open({
		type: 2,
		area: ['850px', '450px'],
		maxmin: true,
		title : "查看新增信息",	
		btn:['确定','取消'],
		content: ['/psxj/systemInfo/ssxjxt/problem_report/parts_lack/lackInput.html?id='+thisId+'&type=view', 'yes']
	});
}
//数据纠错详情页面
function toCorrectInfor(thisId){
	layer.open({
		type: 2,
		area: ['1050px', '550px'],
		title : "查看纠错信息",	
		maxmin: true,
		btn:['确定','取消'],
		content: ['/psxj/systemInfo/ssxjxt/problem_report/parts_correct/correctInput.html?id='+thisId+'&type=view', 'yes']
	});
}
//详情页面
function toInfor(thisId,taskInstDbid){
    //layer.msg('暂不支持查看问题详情!', {icon: 5});
	$.ajax({
        type: 'post',
        url: '/psxj/gxProblemrReport/searchGzlData',
        data: {id: thisId},
        dataType: 'json',
        success: function (data) {
        	var row=data.result;
        	layer.open({
        		type: 2,
        	    title: "查看问题详情信息",
        	    shadeClose: false,
        	    //closeBtn : [0 , true],
        	    shade: 0.5,
        	    maxmin: true, //开启最大化最小化按钮
        	    area: [$(window).width() * 0.9+'px', $(window).height() * 0.9+'px'],
        	    offset: [$(window).height() * 0.05+'px', $(window).width() * 0.05+'px'],
                content: "/psxj/systemInfo/ssxjxt/xcyh/xcyh/detail.html?serverName=psxj&procInstId="+row.PROC_INST_ID_+"&masterEntityKey="+row.ID+"&taskName="+row.NAME_+"&taskId="+row.TASK_ID
				//content: "/psxj/systemInfo/ssxjxt/xcyh/xcyh/detail.html?serverName="+"psxj"+"&templateCode="+result.templateCode+"&taskInstDbid="+taskInstDbid+"&masterEntityKey="+thisId+"&activityChineseName="+thisId+"&activityName="+thisId,
        	});
        }
	});
}

//清除查询条件（清除input hidden框的查询条件）
function refreshContext(){
	$("input[type=hidden]").each(function(){
		$(this).val("");
	});
}

//定位
function toPoint(x,y){
	if(x && y){
		toMap();
		window.parent.positPoint(x,y);
	}
}
//跳回到map地图
function toMap(){
	var aTab = parent.$(".page-tabs-content a[data-id*='wrapper-map']");
    aTab.addClass("active").siblings(".J_menuTab").removeClass("active");
    var aContent = parent.$(".J_mainContent .J_iframe[data-id*='wrapper-map']");
    aContent.show().siblings(".J_iframe").hide();
}
