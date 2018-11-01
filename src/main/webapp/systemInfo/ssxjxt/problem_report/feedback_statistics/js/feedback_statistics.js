var myChars,option,componentType,wtlx,qdbh,qdmc;
$(function(){
	//初始化设施类型数据字典
	initComponentType();
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
function initComponentType(){
	$.ajax({
        type:'post',
        url:'/psxj/asi/municipalBuild/facilityLayout/metacodeitem!getItemList.action',
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
//        		var problemTables = new ProblemTable();
//        		problemTables.Init();
//        		var unitTables = new unitTable();
//        		unitTables.Init();
        		var lackAddTables = new LackLiTable();
        		lackAddTables.Init();
        		var wtlxTable = new WtlxTable();
        		wtlxTable.Init();
        	}
        }
    });
}
//清单数据
var LackLiTable=function(){
	LackLiTable = new Object();
	LackLiTable.Init=function(){
		$("#lackLiTable").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:"/psxj/swj-assign!getAssignList.action",
			rowStyle:"rowStyle",
			cache:false,
			pagination:true,//不显示分页
			dataType:'json',
			striped:true,
			sidePagination:"server",
			pageNumber: 1,
		    pageSize: 10,                       
		    pageList: [10, 25, 50, 100],
			queryParams:LackLiTable.queryParms,
			clickToSelect:true,
			columns:[
//                {field:'aid',checkbox: 'true',events: 'actionEvents'},
				{field:'id',title: '主键',visible:false,align:'center'},
                {field:'aid',title: '外键',visible:false,align:'center'},
				{title:'序号',align:'center',formatter: function (value, row, index) {return index+1;}},
			    {field:'assignId',title: '清单编号',visible:true,align:'center'},
			    {field:'assignName',title:'清单名称',visible:true,align:'center'},
			    {field:'assignPerson',title:'清单交办人',visible:true,align:'center'},
				{field:'assignDate',title:'清单交办日期',visible:true,align:'center',formatter: format_time},
				{field:'parentOrgName',title:'交办单位',visible:true,align:'center'},
				{field:'counts',title:'交办个数',visible:true,align:'center'},
				{title:'操作',visible:true,align:'center',formatter: format_operTwo}				
			]
		});
	},
	LackLiTable.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        startTime : $("#startTime").val(),
	        endTime :  $("#endTime").val(),
//	        objectId : $("#objectId").val(),
	        assignName:$("#assignName").val(),
	        assignId: $("#assignId").val(),
	        parentOrgName:  $("#parentOrgName").val()
	    };
		return temp;
	}
	return LackLiTable;
}


//按问题类型统计
var WtlxTable=function(){
	WtlxTable = new Object();
	WtlxTable.Init=function(){
		$("#wtlxTable").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/swj-assignlist!statisticsForWtlx.action',
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
			queryParams:WtlxTable.queryParms,
			clickToSelect:true,
			onLoadSuccess: function(data){ //加载成功时执行
				appendWtlxTable(data);
			},
			columns:[
			    [
			     {title: "",visible:true, align:"center",colspan: 1},
			     {title: "",visible:true, align:"center",colspan: 1},
			     {title: "挂牌",visible:true, align:"center",colspan: 8},
			     {title: "挂网",visible:true, align:"center",colspan: 4},
			     {title: "井盖",visible:true, align:"center",colspan: 12},
			     {title: "结构性缺陷",visible:true, align:"center",colspan: 8},
			     {title: "功能性缺陷",visible:true, align:"center",colspan: 12}
			     ] ,
			    [
			     	{title: "",visible:true, align:"center",colspan: 1},
			     	{title: "",visible:true, align:"center",colspan: 1},
			     	{title:'一井多牌',visible:true,align:'center',colspan: 4},
					{title:'挂牌缺失损坏',visible:true,align:'center',colspan: 4},
					{title:'挂网缺失或损坏',visible:true,align:'center',colspan: 4},
					{title:'井盖打不开',visible:true,align:'center',colspan: 4},
					{title:'井盖类别错误',visible:true,align:'center',colspan: 4},
					{title:'井盖破损',visible:true,align:'center',colspan: 4},
					{title:'异物侵入',visible:true,align:'center',colspan: 4},
					{title:'井筒破损',visible:true,align:'center',colspan: 4},
					{title:'浮渣和沉积物',visible:true,align:'center',colspan: 4},
					{title:'水位高',visible:true,align:'center',colspan: 4},
					{title:'树根',visible:true,align:'center',colspan: 4}
				 ] ,
			    [
			     	{field: 'Number',title: '序号',align:'center',formatter: function (value, row, index) {return index+1;}},     
				    {field:'orgName',title:'区域',visible:true,align:'center',formatter: format_qy},
					{field:'gp12',title:'已完成',visible:true,align:'center'},
					{field:'gp11',title:'列入计划',visible:true,align:'center'},
					{field:'gp13',title:'未处理',visible:true,align:'center'},
					{field:'gp14',title:'总数',visible:true,align:'center'},
					
					{field:'gp22',title:'已完成',visible:true,align:'center'},
					{field:'gp21',title:'列入计划',visible:true,align:'center'},
					{field:'gp23',title:'未处理',visible:true,align:'center'},
					{field:'gp24',title:'总数',visible:true,align:'center'},
					
					{field:'gw12',title:'已完成',visible:true,align:'center'},
					{field:'gw11',title:'列入计划',visible:true,align:'center'},
					{field:'gw13',title:'未处理',visible:true,align:'center'},
					{field:'gw14',title:'总数',visible:true,align:'center'},
					
					{field:'jg12',title:'已完成',visible:true,align:'center'},
					{field:'jg11',title:'列入计划',visible:true,align:'center'},
					{field:'jg13',title:'未处理',visible:true,align:'center'},
					{field:'jg14',title:'总数',visible:true,align:'center'},
					
					{field:'jg22',title:'已完成',visible:true,align:'center'},
					{field:'jg21',title:'列入计划',visible:true,align:'center'},
					{field:'jg23',title:'未处理',visible:true,align:'center'},
					{field:'jg24',title:'总数',visible:true,align:'center'},
					
					{field:'jg32',title:'已完成',visible:true,align:'center'},
					{field:'jg31',title:'列入计划',visible:true,align:'center'},
					{field:'jg33',title:'未处理',visible:true,align:'center'},
					{field:'jg34',title:'总数',visible:true,align:'center'},
					
					{field:'jgqx12',title:'已完成',visible:true,align:'center'},
					{field:'jgqx11',title:'列入计划',visible:true,align:'center'},
					{field:'jgqx13',title:'未处理',visible:true,align:'center'},
					{field:'jgqx14',title:'总数',visible:true,align:'center'},
					
					{field:'jgqx22',title:'已完成',visible:true,align:'center'},
					{field:'jgqx21',title:'列入计划',visible:true,align:'center'},
					{field:'jgqx23',title:'未处理',visible:true,align:'center'},
					{field:'jgqx24',title:'总数',visible:true,align:'center'},
					
					{field:'gnqx12',title:'已完成',visible:true,align:'center'},
					{field:'gnqx11',title:'列入计划',visible:true,align:'center'},
					{field:'gnqx13',title:'未处理',visible:true,align:'center'},
					{field:'gnqx14',title:'总数',visible:true,align:'center'},
					
					{field:'gnqx22',title:'已完成',visible:true,align:'center'},
					{field:'gnqx21',title:'列入计划',visible:true,align:'center'},
					{field:'gnqx23',title:'未处理',visible:true,align:'center'},
					{field:'gnqx24',title:'总数',visible:true,align:'center'},
					
					{field:'gnqx32',title:'已完成',visible:true,align:'center'},
					{field:'gnqx31',title:'列入计划',visible:true,align:'center'},
					{field:'gnqx33',title:'未处理',visible:true,align:'center'},
					{field:'gnqx34',title:'总数',visible:true,align:'center'}
				]
			]
		});
	},
	WtlxTable.queryParms=function(params){
		var temp = {
			//pageSize:params.limit,
	       // pageNo: params.offset/params.limit+1,
	        //markPerson : $("#markPerson").val(),
	        //directOrgName : $("#directOrgName").val(),
	        //parentOrgName : $("#parentOrgName").val()
			assignName:$("#assignName").val(),	
	        startTime : $("#startTime").val(),
	        endTime :  $("#endTime").val(),
	        parentOrgName : $("#parentOrgName").val(),
	        assignId: $("#assignId").val()
	    };
		return temp;
	}
	return WtlxTable;
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
		}else if(val.indexOf('净水有限公司')>=0){
			return "净水公司";
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
	var a='<button type="button" class="btn btn-primary btn-sm" onclick="openUnit(\''+row.orgName+'\')">按单位</button>&nbsp;&nbsp;';
	a+='<button type="button" class="btn btn-primary btn-sm" onclick="openPerson(\''+row.orgName+'\')">按人</button>';
	return a; 
}
//操作
function format_operUnit(val,row,index){
	if(row.orgName=="总计" || row.allData==0){
		return ""; 
	}
	//var a='<button type="button" class="btn btn-primary btn-sm" onclick="openUnit(\''+row.orgName+'\')">按单位</button>&nbsp;&nbsp;';
	var a='<button type="button" class="btn btn-primary btn-sm" onclick="openPersonForUnit(\''+row.orgName+'\',\''+row.supName+'\',\''+row.orgNameArea+'\')">按人</button>';
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
//	$("#problemTable").bootstrapTable('refresh');
//	$("#lackAddTable").bootstrapTable('refresh');
	$("#lackLiTable").bootstrapTable('refresh');
	$("#wtlxTable").bootstrapTable('refresh');
}
//搜索
function search(){
	refreshTable();
}
//清空
function resets(){
	$('#myform')[0].reset();
	qdbh="";//如果点了搜索就清空一下
	qdmc="";//如果点了搜索就清空一下
	$("#assignId").val("");//执行完毕用以后清空，不然影响下次查询
	refreshTable();
}
//点击按区-按单位详情页面
function openUnit(orgName){
	if(orgName=="总计"){
		orgName="all";
	}
	//隐藏区域
	$("#problem_Tab").attr("class", "tab-pane");
	$("#problem_li").removeClass("active");
	//隐藏单位
	$("#lack_add_Tab").attr("class", "tab-pane");
	$("#lack_add_li").removeClass("active");
	//隐藏问题类型
	$("#wtlx_Tab").attr("class", "tab-pane");
	$("#wtlx_li").removeClass("active");
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
	//隐藏单位
	$("#unit_Tab").attr("class", "tab-pane");
	$("#unit_statistc").removeClass("active");
	//隐藏问题类型
	$("#wtlx_Tab").attr("class", "tab-pane");
	$("#wtlx_li").removeClass("active");
	//显示人数统计
	$("#lack_add_Tab").attr("class", "tab-pane fade in active");
	$("#lack_add_li").attr("class", "active");
	//刷新一下人数上报
	//给页面赋值，带到后台查询
	$("#parentOrgName").val(orgName);
	$("#lackAddTable").bootstrapTable('refresh');
	$("#parentOrgName").val("");//执行完毕用以后清空，不然影响下次查询
}

//点击单位详情页面
function openPersonForUnit(orgName,supName,areaName){
	if(orgName=="总计"){
		orgName="all";
	}
	//隐藏区域
	$("#problem_Tab").attr("class", "tab-pane");
	$("#problem_li").removeClass("active");
	//隐藏单位
	$("#unit_Tab").attr("class", "tab-pane");
	$("#unit_statistc").removeClass("active");
	//隐藏问题类型
	$("#wtlx_Tab").attr("class", "tab-pane");
	$("#wtlx_li").removeClass("active");
	//显示人数统计
	$("#lack_add_Tab").attr("class", "tab-pane fade in active");
	$("#lack_add_li").attr("class", "active");
	//刷新一下人数上报
	//给页面赋值，带到后台查询,带两个条件，大区和单位
	$("#directOrgName").val(orgName);//直属单位
	$("#parentOrgName").val(areaName);//区单位
	$("#superviseOrgName").val(supName);//监理单位
	$("#lackAddTable").bootstrapTable('refresh');
	$("#directOrgName").val("");//执行完毕用以后清空，不然影响下次查询
	$("#parentOrgName").val("");
	$("#superviseOrgName").val("");
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
function loadToExcel(){
//	var qyClass=$('#problem_li').attr('class');
//	var dwClass=$('#unit_statistc').attr('class');
	var wtlxClass=$('#wtlx_li').attr('class');
//	if(qyClass=='active'){//谁活跃导出谁
//		$('#problemTable').tableExport({ type: 'excel', escape: 'false',fileName:'数据上报统计-按区',ignoreColumn: [14], ignoreRow: [1] });//区域
//	}else if(dwClass=='active'){
//		$('#unitTable').tableExport({ type: 'excel', escape: 'false',fileName:'数据上报统计-按单位' , ignoreColumn: [0,12],ignoreRow: [0] });//人员
//	}else 
	if((wtlxClass+"").indexOf('active')!=-1){
		$('#wtlxTable').tableExport({ type: 'excel', escape: 'false',fileName:'交办反馈统计-问题类型' , ignoreColumn: [0],ignoreRow: [1]});//问题类型
	}else{
		$('#lackLiTable').tableExport({ type: 'excel', escape: 'false',fileName:'清单列表' , ignoreColumn: [0,7]});//人员
	}
}
//拼接table
function appendTable(data){
	$('tr.del').remove();
	var sslx=$("#componentType").find("option:selected").text();
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
	 var tableStr='<tr class="del"><td style="text-align: center; ">当前时间段活跃上报人</td><td style="text-align: center; "></td><td style="text-align: center; "></td><td style="text-align: center; "></td><td style="text-align: center; " colspan="10"></td><td style="text-align: center; "></td></tr>';
	 if(data.rows.length>0){
		 for(var i=0;i<data.rows.length;i++){
			 tableStr+='<tr class="del"><td style="text-align: center; ">'+(i+1)+data.rows[i].markPerson+'</td><td style="text-align: center; ">'+data.rows[i].xzData+'</td><td style="text-align: center; ">'+data.rows[i].jhData+'</td><td style="text-align: center; ">'+data.rows[i].allData+'</td><td style="text-align: center; " colspan="10"></td><td style="text-align: center; "></td></tr>';
			 if(i==2){
				  break;
			 }
		 } 
	 }
	 $("#problemTable tbody").append(tableStr);  
}

//拼接表头table
function appendWtlxTable(data){
	$('tr.wtlxHead').remove();
	var dateStr="";
	var startTime= $("#startTime").val();
	var endTime= $("#endTime").val();
	var qdlb="";
	var qdbhStr="";
	if(qdmc==null || qdmc==""){
		qdmc=$("#assignName").val();
	}
	if(qdmc!=null && qdmc!=""){
		qdlb="清单名称："+qdmc;
	}
	qdbh=$("#assignId").val();
	if(qdbh!=null && qdbh!=""){
		qdbhStr=" 清单编号："+qdbh;
	}
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
	$("#wtlxTable thead").prepend('<tr class="wtlxHead"><th style="text-align: left;" colspan="46">'+qdlb+qdbhStr+' 问题类型统计报表</th></tr>');	
}
//百分比
function getBfb(num, total) {
    var leftWidth = (num / total) * 100;
    //将百分比保留两位小数
    var percentNum = (Math.round(leftWidth*100)/100).toFixed(2) + '%';
    return percentNum;
}
//第二个tab操作
function format_operTwo(val,row,index){
	var a='<button type="button" class="btn btn-primary btn-sm" onclick="viewShow(\''+row.assignId+'\',\''+row.assignName+'\')">统计</button>';
	return a; 
}
//查看清单详情
function viewShow(qdbh,assignName){
	//隐藏列表
	$("#lack_add_Tab").attr("class", "tab-pane");
	$("#lack_add_li").removeClass("active");
	//显示详情
	$("#wtlx_tab").attr("class", "tab-pane fade in active");
	$("#wtlx_li").attr("class", "active");
	//刷新一下人数上报
	//给页面赋值，带到后台查询
	$("#assignId").val(qdbh);
	qdmc=assignName;
	$("#wtlxTable").bootstrapTable('refresh');
//	$("#assignId").val("");//执行完毕用以后清空，不然影响下次查询
}
//格式化时间
function format_time(val,rows,index){
	if(val)
		return getLocalTime(val);
	else
		return "";
}
