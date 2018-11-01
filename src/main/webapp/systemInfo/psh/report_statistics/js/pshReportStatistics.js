var myChars,option,componentType,wtlx;
//行业大类
var pcodeData=window.parent.awater.code.pcodeData;
$(function(){
	//初始化设施类型数据字典
	//initComponentType();
	initDatetimepicker();
	initHylbData();
	var problemTables = new ProblemTable();
	problemTables.Init();
	var unitTables = new unitTable();
	unitTables.Init();
	var lackAddTables = new LackAddTable();
	lackAddTables.Init();
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
function initComponentType(){
	$.ajax({
        type:'post',
        url:'/agsupport_swj/asi/municipalBuild/facilityLayout/metacodeitem!getItemList.action',
        data:{},
        dataType:'json',
        success:function(result){
        	if(result){
        		componentType=result.facility_type;
        		wtlx=result.wtlx3;
        		for(var i in result.facility_type){
        			item = result.facility_type[i];
        			$("#componentType").append("<option value='"+item.code+"'>"+item.name+"</option>");
        		}
        		for(var i in result.yzdw){
        			item = result.yzdw[i];
        			$("#parentOrgId").append("<option value='"+item.orgId+"'>"+item.orgName+"</option>");
        		}
        		var problemTables = new ProblemTable();
        		problemTables.Init();
        		var unitTables = new unitTable();
        		unitTables.Init();
        		var lackAddTables = new LackAddTable();
        		lackAddTables.Init();
        	}
        }
    });
}
function initHylbData(){
	//初始化行业类别数据字典
	$('#dischargerType1').selectpicker({
		noneSelectedText: '请选择',
		actionsBox: true,
		selectAllText: "全选",
		deselectAllText: "清除",
		selectedTextFormat:"count>3",
		countSelectedText:"选中{0}个污水类别"
    });
	for(i in pcodeData){
		if(pcodeData[i].code)
			$("#pcode").append("<option value='"+pcodeData[i].name+"'>"+pcodeData[i].name+"</option>");
	}
	$('#dischargerType1').selectpicker('refresh');	
}

//区域统计
var ProblemTable=function(){
	ProblemTable = new Object();
	ProblemTable.Init=function(){
		$("#problemTable").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/agsupport_swj/psh-discharger!statisticsForArea.action',
			rowStyle:"rowStyle",
			cache:false,
			pagination:false,//屏蔽分页
			dataType:'json',
			striped:true,
			sidePagination:"server",
			pageNumber: 1,
		    pageSize: 10,                       
		    pageList: [10, 25, 50, 100],
			queryParams:ProblemTable.queryParms,
			clickToSelect:true,
			columns:[
		        [
				     {title: "",visible:true, align:"center",colspan: 2},
				     {title: "污水类别统计",visible:true, align:"center",colspan: 4},
				     {title: "审批统计",visible:true, align:"center",colspan: 4},
				     {title: "删除统计",visible:true, align:"center",colspan: 4},
				     {title: "",visible:true, align:"center"}
				 ] , 
				 [
					{field:'orgName',title:'区域',visible:true,align:'center',formatter: format_qy},
					{field:'all',title:'上报总量',visible:true,align:'center'},
					{field:'ty1',title:'生活',visible:true,align:'center'},
					{field:'ty2',title:'餐饮',visible:true,align:'center'},
					{field:'ty3',title:'沉淀物',visible:true,align:'center'},
					{field:'ty4',title:'有毒有害',visible:true,align:'center'},
					{field:'awsh',title:'未审核',visible:true,align:'center'},
					{field:'aysh',title:'审核通过',visible:true,align:'center'},
					{field:'acyw',title:'存在疑问',visible:true,align:'center'},
					{field:'tgl',title:'通过率',visible:true,align:'center',formatter: function (value, row, index) {
							var tgl=0;
							if(row.all!="" && row.all!=0){
								tgl=getBfb(row.aysh,row.all);
							}
							return tgl;
					   }
					},
					{field:'allDel',title:'删除总数',visible:true,align:'center'},
					{field:'dwsh',title:'未审核',visible:true,align:'center'},
					{field:'dysh',title:'审核通过',visible:true,align:'center'},
					{field:'dcyw',title:'存在疑问',visible:true,align:'center'},
					{title:'统计',visible:true,align:'center',formatter: format_oper}
				]
			]
		});
	},
	ProblemTable.queryParms=function(params){
		var temp = {
	        startTime : $("#startTime").val(),
	        endTime :  $("#endTime").val(),
	        parentOrgName: $("#parentOrgName").val(),
	        dischargerType1: $("#dischargerType1").val()?$("#dischargerType1").val():"",
	        addr : $("#addr").val()
	    };
		return temp;
	}
	return ProblemTable;
}
//按镇街统计
var unitTable=function(){
	unitTable = new Object();
	unitTable.Init=function(){
		$("#unitTable").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/agsupport_swj/psh-discharger!statisticsForUnit.action',
			rowStyle:"rowStyle",
			cache:false,
			pagination:false,//屏蔽分页
			dataType:'json',
			striped:true,
			sidePagination:"server",
			pageNumber: 1,
		    pageSize: 10,                       
		    pageList: [10, 25, 50, 100],
			queryParams:unitTable.queryParms,
			clickToSelect:true,
			columns:[
		        [
				     {title: "",visible:true, align:"center",colspan: 3},
				     {title: "污水类别统计",visible:true, align:"center",colspan: 4},
				     {title: "审批统计",visible:true, align:"center",colspan: 4},
				     {title: "删除统计",visible:true, align:"center",colspan: 4},
				     {title: "",visible:true, align:"center"}
				 ] , 
				 [
					{field:'orgName',title:'区域',visible:true,align:'center',formatter: format_qy},
					{field:'teamName',title:'镇街',visible:true,align:'center'},
					{field:'all',title:'上报总量',visible:true,align:'center'},
					{field:'ty1',title:'生活',visible:true,align:'center'},
					{field:'ty2',title:'餐饮',visible:true,align:'center'},
					{field:'ty3',title:'沉淀物',visible:true,align:'center'},
					{field:'ty4',title:'有毒有害',visible:true,align:'center'},
					{field:'awsh',title:'未审核',visible:true,align:'center'},
					{field:'aysh',title:'审核通过',visible:true,align:'center'},
					{field:'acyw',title:'存在疑问',visible:true,align:'center'},
					{field:'tgl',title:'通过率',visible:true,align:'center',formatter: function (value, row, index) {
							var tgl=0;
							if(row.all!="" && row.all!=0){
								tgl=getBfb(row.aysh,row.all);
							}
							return tgl;
					   }
					},
					{field:'allDel',title:'删除总数',visible:true,align:'center'},
					{field:'dwsh',title:'未审核',visible:true,align:'center'},
					{field:'dysh',title:'审核通过',visible:true,align:'center'},
					{field:'dcyw',title:'存在疑问',visible:true,align:'center'},
					{title:'统计',visible:true,align:'center',formatter: format_operUnit}
				]
			]
		});
	},
	unitTable.queryParms=function(params){
		var temp = {
			startTime : $("#startTime").val(),
	        endTime :  $("#endTime").val(),
	        parentOrgName: $("#parentOrgName").val(),
	        dischargerType1: $("#dischargerType1").val()?$("#dischargerType1").val():"",
	        addr : $("#addr").val()
	  	};
		return temp;
	}
	return unitTable;
}
//人员统计
var LackAddTable=function(){
	LackAddTable = new Object();
	LackAddTable.Init=function(){
		$("#lackAddTable").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/agsupport_swj/psh-discharger!statisticsForPerson.action',
			method: 'get',
			rowStyle:"rowStyle",
			cache:false,
			pagination:false,//分页不显示
			dataType:'json',
			striped:true,
			sidePagination:"server",
			pageNumber: 1,
		    pageSize: 10,                       
		    pageList: [10, 25, 50, 100],
			queryParams:LackAddTable.queryParms,
			clickToSelect:true,
			onLoadSuccess: function(data){ //加载成功时执行
				appendTable(data);
			},
			columns:[
			    [
			      {title: "",visible:true, align:"center"},
			      {title: "",visible:true, align:"center",colspan: 3},
			      {title: "污水类别统计",visible:true, align:"center",colspan: 4},
			      {title: "审批统计",visible:true, align:"center",colspan: 4},
			      {title: "删除统计",visible:true, align:"center",colspan: 4},
			    ] ,
			    [
				    {field: 'Number',title: '序号',align:'center',formatter: function (value, row, index) {return index+1;}},     
				    {field:'markPerson',title:'上报人',visible:true,align:'center'},
				    {field:'orgName',title:'区域',visible:true,align:'center',formatter: format_qy},
					{field:'all',title:'上报总量',visible:true,align:'center'},
					{field:'ty1',title:'生活',visible:true,align:'center'},
					{field:'ty2',title:'餐饮',visible:true,align:'center'},
					{field:'ty3',title:'沉淀物',visible:true,align:'center'},
					{field:'ty4',title:'有毒有害',visible:true,align:'center'},
					{field:'awsh',title:'未审核',visible:true,align:'center'},
					{field:'aysh',title:'审核通过',visible:true,align:'center'},
					{field:'acyw',title:'存在疑问',visible:true,align:'center'},
					{field:'tgl',title:'通过率',visible:true,align:'center',formatter: function (value, row, index) {
							var tgl=0;
							if(row.all!="" && row.all!=0){
								tgl=getBfb(row.aysh,row.all);
							}
							return tgl;
					   }
					},
					{field:'allDel',title:'删除总数',visible:true,align:'center'},
					{field:'dwsh',title:'未审核',visible:true,align:'center'},
					{field:'dysh',title:'审核通过',visible:true,align:'center'},
					{field:'dcyw',title:'存在疑问',visible:true,align:'center'}
				]
			]
		});
	},
	LackAddTable.queryParms=function(params){
		var temp = {
			//pageSize:params.limit,
	       // pageNo: params.offset/params.limit+1,
	        //markPerson : $("#markPerson").val(),
	        //directOrgName : $("#directOrgName").val(),
	        //parentOrgName : $("#parentOrgName").val()
	        startTime : $("#startTime").val(),
	        endTime :  $("#endTime").val(),
	        markPerson : $("#sbr").val(),
	        parentOrgName: $("#parentOrgName").val(),
	        teamOrgName:$("#teamOrgName").val(),
	        dischargerType1: $("#dischargerType1").val()?$("#dischargerType1").val():"",
	        addr : $("#addr").val()
	    };
		return temp;
	}
	return LackAddTable;
}
//格式化区域
function format_qy(val,row,index){
	if(val){
		if(val.indexOf('天河')>=0){
			return "天河";
		}else if(val.indexOf('番禺')>=0){
			return "番禺";
		}else if(val.indexOf('黄埔')>=0){
			return "黄埔";
		}else if(val.indexOf('白云')>=0){
			return "白云";
		}else if(val.indexOf('南沙')>=0){
			return "南沙";
		}else if(val.indexOf('海珠')>=0){
			return "海珠";
		}else if(val.indexOf('荔湾')>=0){
			return "荔湾";
		}else if(val.indexOf('花都')>=0){
			return "花都";
		}else if(val.indexOf('越秀')>=0){
			return "越秀";
		}else if(val.indexOf('增城')>=0){
			return "增城";
		}else if(val.indexOf('从化')>=0){
			return "从化";
		}else if(val.indexOf('贝源检测')>=0){
			return "贝源公司";
		}else if(val.indexOf('市水务局')>=0){
			return "市水务局";
		}else{
			return val;
		}
	}else{
		return "";
	}
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
		}else{
			return "已审核";
		}
			
	}else{
		return "";
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
//操作
function format_oper(val,row,index){
	if(row.orgName=="总计" || row.allData==0){
		return ""; 
	}
	var a='<button type="button" class="btn btn-primary btn-sm" onclick="openUnit(\''+row.orgName+'\')">按镇街</button>&nbsp;&nbsp;';
	a+='<button type="button" class="btn btn-primary btn-sm" onclick="openPerson(\''+row.orgName+'\')">按人</button>';
	return a; 
}
//操作
function format_operUnit(val,row,index){
	if(row.orgName=="总计" || row.allData==0){
		return ""; 
	}
	//var a='<button type="button" class="btn btn-primary btn-sm" onclick="openUnit(\''+row.orgName+'\')">按镇街</button>&nbsp;&nbsp;';
	var a='<button type="button" class="btn btn-primary btn-sm" onclick="openPersonForUnit(\''+row.orgName+'\',\''+row.teamName+'\',\'\')">按人</button>';
	return a; 
}
//格式化时间
function format_date(val,rows,index){
	if(val)
		return getLocalTime(val.time);
	else
		return "";
}
//格式化状态
function format_state(val,rows,index){
	if(val){
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
		return "自行处理";
}
//刷新 
function refreshTable(){
	$("#problemTable").bootstrapTable('refresh');
	$("#lackAddTable").bootstrapTable('refresh');
	$("#unitTable").bootstrapTable('refresh');
}
//搜索
function search(){
	refreshTable();
}
//清空
function resets(){
	$('#myform')[0].reset();
	$('#dischargerType1').selectpicker('refresh');
	refreshTable();
}
//点击按区-按镇街详情页面
function openUnit(orgName){
	if(orgName=="总计"){
		orgName="all";
	}
	//隐藏区域
	$("#problem_Tab").attr("class", "tab-pane");
	$("#problem_li").removeClass("active");
	//隐藏镇街
	$("#lack_add_Tab").attr("class", "tab-pane");
	$("#lack_add_li").removeClass("active");
	//显示人数统计
	$("#unit_Tab").attr("class", "tab-pane fade in active");
	$("#unit_statistc").attr("class", "active");
	//刷新一下人数上报
	//给页面赋值，带到后台查询
	$("#parentOrgName").val(orgName);
	$("#parentOrgNameForUnit").val(orgName);//回填给按单位用,因为按单位以后，再点击按人，需要带上区域条件
	$("#unitTable").bootstrapTable('refresh');
	$("#parentOrgName").val("");//执行完毕用以后清空，不然影响下次查询
}
//点击按区-按人详情页面
function openPerson(orgName){
	if(orgName=="总计"){
		orgName="all";
	}
	//隐藏区域
	$("#problem_Tab").attr("class", "tab-pane");
	$("#problem_li").removeClass("active");
	//隐藏镇街
	$("#unit_Tab").attr("class", "tab-pane");
	$("#unit_statistc").removeClass("active");
	//显示人数统计
	$("#lack_add_Tab").attr("class", "tab-pane fade in active");
	$("#lack_add_li").attr("class", "active");
	//刷新一下人数上报
	//给页面赋值，带到后台查询
	$("#parentOrgName").val(orgName);
	$("#lackAddTable").bootstrapTable('refresh');
	$("#parentOrgName").val("");//执行完毕用以后清空，不然影响下次查询
}

//点击镇街详情页面
function openPersonForUnit(orgName,teamName,areaName){
	if(orgName=="总计"){
		orgName="all";
	}
	//隐藏区域
	$("#problem_Tab").attr("class", "tab-pane");
	$("#problem_li").removeClass("active");
	//隐藏镇街
	$("#unit_Tab").attr("class", "tab-pane");
	$("#unit_statistc").removeClass("active");
	//显示人数统计
	$("#lack_add_Tab").attr("class", "tab-pane fade in active");
	$("#lack_add_li").attr("class", "active");
	//刷新一下人数上报
	//给页面赋值，带到后台查询,带两个条件，大区和单位
	$("#teamOrgName").val(teamName);//直属单位
	$("#parentOrgName").val(orgName);//区单位
//	$("#superviseOrgName").val(supName);//监理单位
	$("#lackAddTable").bootstrapTable('refresh');
	$("#teamOrgName").val("");//执行完毕用以后清空，不然影响下次查询
	$("#parentOrgName").val("");
//	$("#superviseOrgName").val("");
}
//清除查询条件（清除input hidden框的查询条件）
function refreshContext(){
	$("input[type=hidden]").each(function(){
		$(this).val("");
	});
}

function loadToExcel(){
	var qyClass=$('#problem_li').attr('class');
	var dwClass=$('#unit_statistc').attr('class');
	if(qyClass=='active'){//谁活跃导出谁
		$('#problemTable').tableExport({ type: 'excel', escape: 'false',fileName:'数据上报统计-按区',ignoreColumn: [14], ignoreRow: [1] });//区域
	}else if(dwClass=='active'){
		$('#unitTable').tableExport({ type: 'excel', escape: 'false',fileName:'数据上报统计-按镇街' , ignoreColumn: [15],ignoreRow: [0] });//镇街
	}else{
		$('#lackAddTable').tableExport({ type: 'excel', escape: 'false',fileName:'数据上报统计-按人' , ignoreRow: [0]});//人员
	}
}
//拼接table
function appendTable(data){
	$('tr.del').remove();
	var sslx=$("#dischargerType1").val()?$("#dischargerType1").val():"";
	var dateStr="";
	var startTime= $("#startTime").val();
	var endTime= $("#endTime").val();
	if(startTime!="" || endTime!=""){
		if(startTime!=""){
			dateStr+=startTime.substring(0,4)+'年'+startTime.substring(5,7)+'月'+startTime.substring(8)+'日'+'-';
		}
		if(endTime!=""){
			dateStr+=endTime.substring(0,4)+'年'+endTime.substring(5,7)+'月'+endTime.substring(8)+'日';
		}
	}else{
		var date = new Date();//默认为当前时间
	    dateStr=date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate()+'日';
	}
	$("#problemTable thead").prepend('<tr class="del"><th style="text-align: center;" colspan="15">'+dateStr+(sslx=='全部'?'':sslx)+'统计报表</th></tr>');
	 var tableStr='<tr class="del"><td style="text-align: center; ">当前时间段活跃上报人</td><td style="text-align: center; " colspan="14"></td></tr>';
	 if(data.rows.length>0){
		 for(var i=0;i<data.rows.length;i++){
			 tableStr+='<tr class="del"><td style="text-align: center; ">'+(i+1)+data.rows[i].markPerson+'</td><td style="text-align: center; ">'+data.rows[i].all+'</td><td style="text-align: center; " colspan="13"></td></tr>';
			 if(i==2){
				  break;
			 }
		 } 
	 }
	 $("#problemTable tbody").append(tableStr);  
}
//百分比
function getBfb(num, total) {
    var leftWidth = (num / total) * 100;
    //将百分比保留两位小数
    var percentNum = (Math.round(leftWidth*100)/100).toFixed(2) + '%';
    return percentNum;
}
