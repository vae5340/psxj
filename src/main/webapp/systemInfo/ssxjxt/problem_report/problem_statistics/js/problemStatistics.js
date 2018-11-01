var myChars,option,componentType,wtlx;
$(function(){
	//初始化设施类型数据字典
	initComponentType();
	initDatetimepicker();
	//初始化图表
	//loadEcharts();
	
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
        url:'/psxj/rest/report/listWtsbTree',
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
        		var lackAddTables = new LackAddTable();
        		lackAddTables.Init();
        	}
        }
    });
}
//区域统计
var ProblemTable=function(){
	ProblemTable = new Object();
	ProblemTable.Init=function(){
		$("#problemTable").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/gxProblemrReport/statisticsForPerson',
			rowStyle:"rowStyle",
			cache:false,
			pagination:false,//不显示分页
			dataType:'json',
			striped:true,
			sidePagination:"server",
			pageNumber: 1,
		    pageSize: 20,                       
		    pageList: [10, 25, 50, 100],
			queryParams:ProblemTable.queryParms,
			clickToSelect:true,
			columns:[
			    {field: 'Number',title: '序号',align:'center',formatter: function (value, row, index) {return index+1;}},     
				{field:'parentorgName',title:'区域',visible:true,align:'center',formatter: format_qy},
				{field:'orgName',title:'直属区域',visible:true,align:'center',formatter: format_qy},
				{field:'notBj',title:'未办结',visible:true,align:'center'},
				{field:'yBj',title:'已办结',visible:true,align:'center'},
				{field:'allData',title:'总数',visible:true,align:'center'},
				{title:'操作',visible:true,align:'center',formatter: format_oper}
			]
		});
	},
	ProblemTable.queryParms=function(params){
		var temp = {
			//pageSize:params.limit,
	        //pageNo: params.offset/params.limit+1,
	        startTime : getElementTime("#startTime"),
	        endTime :  getElementTime("#endTime"),
	        parentOrgName: $("#parentOrgName").val()
	  	};
		return temp;
	}
	return ProblemTable;
}
function getElementTime(eve){
    return $(eve).val()?new Date(Date.parse($(eve).val().replace(/-/g,"/"))).getTime():'';
}
//人员统计
var LackAddTable=function(){
	LackAddTable = new Object();
	LackAddTable.Init=function(){
		$("#lackAddTable").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/gxProblemrReport/statisticsForPerson',
			method: 'get',
			rowStyle:"rowStyle",
			cache:false,
			pagination:false,//不显示分页
			dataType:'json',
			striped:true,
			sidePagination:"server",
			pageNumber: 1,
		    pageSize: 1000,                       
		    pageList: [10, 25, 50, 100],
			queryParams:LackAddTable.queryParms,
			clickToSelect:true,
			columns:[
			    {field: 'Number',title: '序号',align:'center',formatter: function (value, row, index) {return index+1;}},     
				{field:'sbr',title:'上报人',visible:true,align:'center'},
				{field:'parentorgName',title:'区单位',visible:true,align:'center'},
				{field:'orgName',title:'直属单位',visible:true,align:'center'},
				{field:'allData',title:'上报数量',visible:true,align:'center'}
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
            startTime : getElementTime("#startTime"),
            endTime :  getElementTime("#endTime"),
	        sbr : $("#sbr").val(),
	        directOrgName: $("#directOrgName").val(),
	        parentOrgName: $("#parentOrgName").val()
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
	var a='<button type="button" class="btn btn-primary btn-sm" onclick="openPerson(\''+row.orgName+'\')">查看</button>';
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
	//刷新图表
	//searchEarch();
}
//刷新图表
function searchEarch(){
	var startTime=$("#startTime").val();
	var endTime=$("#endTime").val();
	var temp ;
	if(startTime=="" && endTime==""){//两个都为空
		temp = {isShowEchart: 'true'};
	}else{
		temp = {
				startTime: $("#startTime").val(),
				endTime: $("#endTime").val(),
				isShowEchart: 'true'
		};
	}
	loadDataEacha(temp);
}
//搜索
function search(){
	refreshTable();
	var sbr=$("#sbr").val();
	var org=$("#directOrgName").val()
	if(sbr!="" || org!=""){//上报人查询只针对人数统计 区域无效 所以自动隐藏掉
		//隐藏区域
		$("#problem_Tab").attr("class", "tab-pane");
		$("#problem_li").removeClass("active");
		//显示人数统计
		$("#lack_add_Tab").attr("class", "tab-pane fade in active");
		$("#lack_add_li").attr("class", "active");
	}
}
//清空
function resets(){
	$('#myform')[0].reset();
	refreshTable();
}
//详情页面
function openPerson(orgName){
	if(orgName=="总计"){
		orgName="all";
	}
	//隐藏区域
	$("#problem_Tab").attr("class", "tab-pane");
	$("#problem_li").removeClass("active");
	//显示人数统计
	$("#lack_add_Tab").attr("class", "tab-pane fade in active");
	$("#lack_add_li").attr("class", "active");
	//刷新一下人数上报
	//给页面赋值，带到后台查询
	$("#parentOrgName").val(orgName);
	$("#lackAddTable").bootstrapTable('refresh');
	$("#parentOrgName").val("");//执行完毕用以后清空，不然影响下次查询
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

function loadEcharts(){
	if(options){
		option = options;
		options.title.text="";
		options.series[0].name="上报数量";
		myChar = echarts.init(document.getElementById('chartContainer'));
		myChar.setOption(options);
		//加载统计图表数据
		var temp = {isShowEchart: 'true'};//这里加个参数区分是不是都要展示
		loadDataEacha(temp);
		window.onresize = myChar.resize; //自适应窗口大小
		myChar.on('click',echartsLoadDate);
	}
}
//获取到的数据动态生成图表
function loadDataEacha(temp){
	var data = loadEachr.loadData("/psxj/gx-problem-report!searchEachts.action",temp? temp:null);
	var dataAttr=option.xAxis[0].data;
	var option_data= [];
	for(var k=0;k<dataAttr.length;k++){
		option_data[k]=0;
	}
	if(data && data.code=="200"){
		//$("#chartContainer").show();
		for(var i in data.rows){
			var item = data.rows[i];
			for(var k=0;k<dataAttr.length;k++){
				if(item[0]!=null && item[0].indexOf(dataAttr[k]) != -1){
					option_data[k]=item[1];
					break;
				}
			}
		}
		/*for(var i in dataAttr){
			if(!option_data[i]) option_data[i]=0;
		}*/
		option.series[0].data=option_data;
		setOption();
	}else{
		$("#chartContainer").hide();
	}
}

//从新加载图表数据
function setOption(){
	myChar.setOption(option);
}
//图表的点击事件查询
function echartsLoadDate(params){
	var name = params.name;
	$("#parentOrgName").val(name);
	search();
	$("#parentOrgName").val("");//执行完毕用以后清空，不然影响下次查询
}
//导出excel
function loadToExcel(){
	var qyClass=$('#problem_Tab').attr('class');
	if(qyClass.indexOf('active')!=-1){//谁活跃导出谁
		$('#problemTable').tableExport({ type: 'excel', escape: 'false',fileName:'问题上报统计-按区',ignoreColumn: [5] });//区域
	}else{
		$('#lackAddTable').tableExport({ type: 'excel', escape: 'false',fileName:'问题上报统计-按人' });//人员
	}
}
