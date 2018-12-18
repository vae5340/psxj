var myChars,option,componentType,wtlx;
$(function(){
	//初始化设施类型数据字典1
	initComponentType();
	//初始化查询和日期
	searchBtn();
	//初始化图表
	loadEcharts();
	
});
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
        		var tables = new Table();
        		tables.Init();
        	}
        }
    });
}
//加载图表

var Table=function(){
	Table = new Object();
	Table.Init=function(){
		$("#table").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/gxProblemrReport/searchPage',
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
				{title:'操作',visible:true,align:'center',formatter: format_oper}],
				onDblClickRow: function(row){
					toInfor(row.id ,row.taskInstDbid,row.procInstId);
				}
		});
	},
	Table.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        //markPerson : $("#markPerson").val(),
	        //directOrgName : $("#directOrgName").val(),
	        //parentOrgName : $("#parentOrgName").val()
	        startTime : getElementTime("#startTime"),
	        endTime :  getElementTime("#endTime"),
	        parentOrgName: $("#parentOrgName").val(),
	        sslx : $("#componentType").val()
		};
		return temp;
	}
	return Table;
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
//格式化问题类型
function format_bhlx(val,row,index){
	//之前的老版只能处理单个数据字典
//	if(val){
//		for(var i in wtlx){
//			if(val==wtlx[i].code){
//				return wtlx[i].name;
//			}
//		}
//		return val;
//	}else{
//		return "";
//	}
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
	var a="",b="",c="";
		//b ='<button type="button" class="btn btn-primary btn-sm" onclick="update('+row.id+',\''+row.state+'\')">修改</button>';
	var c='&nbsp;<button type="button" class="btn btn-primary btn-sm" onclick="deleteRow('+row.procInstId+',\''+row.id+',\''+row.state+'\')">删除</button>';
	if(row.x && row.y){
		a+='&nbsp;<button type="button" class="btn btn-primary btn-sm" onclick="toPoint('+row.x+','+row.y+')">定位</button>';
	}
	return b+c+a; 
}
//格式化时间
function format_date(val,rows,index){
	if(val)
		return val;
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
	$("#table").bootstrapTable('refresh');
}
//搜索
function search(){
	refreshTable();
}
//删除
function deleteRow(procInstId,thisId,state){
	layer.confirm('确定删除？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
    	$.ajax({
            type: 'post',
            //url: '/psxj/gxRroblemReport/deleteProcessInstance',
            url: '/psxj/rest/app/asiWorkflow/deleteProcessInstance',
            data: {"instance.procInstId": procInstId},
            dataType: 'json',
            success: function (data) {
            	if(data.success){
            		refreshTable();
            		layer.alert('删除成功！');
            	}else{
            		if(data.code=="500"){
            			layer.alert('该记录不能删除，请选择当前环节为问题上报的记录或办理状态为自行处理的记录！');
            		}else{
            			refreshTable();
            			layer.alert(data.message);
            		}
            	}
            }
    	});
    }, function () {
        return;
    });
}
//详情页面
function toInfor(thisId,taskInstDbid,procInstId){
	/*$.ajax({
        type: 'post',
        url: '/psxj/gxProblemrReport/searchGzlData',
        data: {id: thisId},
        dataType: 'json',
        success: function (data) {

        }
	});*/
    //var result=data.result;
    layer.open({
        type: 2,
        title: "查看问题详情信息",
        shadeClose: false,
        //closeBtn : [0 , true],
        shade: 0.5,
        maxmin: true, //开启最大化最小化按钮
        area: [$(window).width() * 0.9+'px', $(window).height() * 0.9+'px'],
        offset: [$(window).height() * 0.05+'px', $(window).width() * 0.05+'px'],
        content: "/psxj/systemInfo/ssxjxt/xcyh/xcyh/detail.html?serverName=psxj&templateCode=&procInstId="+procInstId+"&taskInstDbid="+taskInstDbid+"&masterEntityKey="+thisId+"&activityChineseName="+thisId+"&activityName="+thisId,
    });
}
//修改
function update(id,state){
	if(state=="ended"){
		layer.alert("已办结的记录不能修改！");
	    return;
	}
	$.ajax({
        type: 'post',
        url: '/psxj/gxProblemrReport/searchGzlData',
        data: {id: id},
        dataType: 'json',
        success: function (data) {
        	var result=data.result;
        	layer.open({
                type: 2,
                title: "修改问题信息",
                shadeClose: false,
                //closeBtn : [0 , true],
                shade: 0.5,
                maxmin: false, //开启最大化最小化按钮
                area: ['700px', '475px'],
                offset: ['30px', $(window).width()/2-400+'px'],
                content: "problemReportEdit.html?serverName="+"psxj"+"&templateId="+result.templateId+"&templateCode="+result.templateCode+"&tablename="+"GX_PROBLEM_REPORT"+"&id="+id+"&userCode="+id+"&activityName="+id,
                cancel: function(){
                },
                end : function(){
                    
                }

            });
        }
	});
}
//时间查询
function searchBtn(){
	//刷新
	$("#all-table").click(function(){
		option.title.text="全部新报统计";
		refreshContext();
		searchEarch();
		refreshTable();
	});
	$("#startTime").datetimepicker({
		format: 'yyyy-mm-dd hh:ii',
		autoclose:true, 
   		pickerPosition:'bottom-right', // 样式
   		minView: 0,    // 显示到小时
   		initialDate: new Date(),  // 初始化日期
   		todayBtn: true  //默认显示今日按钮
  	});
	$("#endTime").datetimepicker({
		format: 'yyyy-mm-dd hh:ii',
		autoclose:true, 
   		pickerPosition:'bottom-right', // 样式
   		minView: 0,    // 显示到小时
   		initialDate: new Date(),  // 初始化日期
   		todayBtn: true  //默认显示今日按钮
	});
	$("#thisDayBtn").click(function(){//今日
		$("#startTime").val(getZeroDate('day').pattern('yyyy-MM-dd HH:mm:ss'));
		$("#endTime").val(new Date().pattern('yyyy-MM-dd HH:mm:ss'));
		option.title.text="今日新报统计";
		searchEarch();
		refreshTable();
	});
	$("#thiWeek").click(function(){//本周
		var start = getZeroDate('week');
		$("#startTime").val(start.pattern('yyyy-MM-dd HH:mm:ss'));
		$("#endTime").val(new Date().pattern('yyyy-MM-dd HH:mm:ss'));
		option.title.text="本周新报统计";
		searchEarch();
		refreshTable();
	});
	$("#thisMonthBtn").click(function(){//本月
		$("#startTime").val(getZeroDate('month').pattern('yyyy-MM-dd HH:mm:ss'));
		$("#endTime").val(new Date().pattern('yyyy-MM-dd HH:mm:ss'));
		option.title.text="本月新报统计";
		searchEarch();
		refreshTable();
	});
	$("#thisYearBtn").click(function(){//本年
		$("#startTime").val(getZeroDate('year').pattern('yyyy-MM-dd HH:mm:ss'));
		$("#endTime").val(new Date().pattern('yyyy-MM-dd HH:mm:ss'));
		option.title.text="年度新报统计";
		searchEarch();
		refreshTable();
	});
	$("#last30DaysBtn").click(function(){//最近30天
		var newDate = new Date();
		var weekTime= newDate.getTime()-1000*60*60*24*30;
		$("#startTime").val(new Date(weekTime).pattern('yyyy-MM-dd HH:mm:ss'));
		$("#endTime").val(new Date().pattern('yyyy-MM-dd HH:mm:ss'));
		option.title.text="最近30天新报统计";
		searchEarch();
		refreshTable();
	});
}

function loadEcharts(){
	if(options){
		option = options;
		options.title.text="全部新报统计";
		options.series[0].name="新报统计";
		myChar = echarts.init(document.getElementById('chartContainer'));
		myChar.setOption(options);
		//加载统计图表数据
		loadDataEacha();
		window.onresize = myChar.resize; //自适应窗口大小
		myChar.on('click',echartsLoadDate);
	}
}
//获取到的数据动态生成图表
/*function loadDataEacha(temp){
	var data = loadEachr.loadData("/psxj/gx-problem-report!searchEachts.action",temp? temp:null);
	var dataAttr=option.xAxis[0].data;
	var option_data= [];
	if(data){
		for(var i in data.rows){
			var item = data.rows[i];
			for(var k=0;k<dataAttr.length;k++){
				if(item[0].indexOf(dataAttr[k]) != -1){
					option_data[k]=item[1];
				}
			}
		}
		option.series[0].data=option_data;
		setOption();
	}
}*/
//图表的点击事件查询
function echartsLoadDate(params){
	var name = params.name;
	$("#parentOrgName").val(name);
	search();
	//刷新图表
	searchEarch();
}
//刷新图表
function searchEarch(){
	var temp = {
        startTime : getElementTime("#startTime"),
        endTime :  getElementTime("#endTime"),
		sslx : $("#componentType").val()
	};
	loadDataEacha(temp);
}
//清除查询条件（清除input hidden框的查询条件）
function refreshContext(){
	$("input[type=hidden]").each(function(){
		$(this).val("");
	});
}
//重新加载图表数据
function setOption(){
	myChar.setOption(option);
}
//获取到的数据动态生成图表
function loadDataEacha(temp){
	var data = loadEachr.loadData("/psxj/gxProblemrReport/searchEachts",temp? temp:null);
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
				if(item.NAME!=null && item.NAME.indexOf(dataAttr[k]) != -1){
					option_data[k]=item.TOTAL;
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
