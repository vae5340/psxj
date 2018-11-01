var myChars,option,componentType,wtlx,userCode,userName,qdbh,qdmc;
var selectionIds = [];  //保存选中ids  
var $table;  
var serverName="psxj";
$(function(){
	//初始化设施类型数据字典
	initComponentType();
	initDatetimepicker();
	getLoginName();
	
	
	//选中事件操作数组  
	var union = function(array,ids){  
	    $.each(ids, function (i, id) {  
	        if($.inArray(id,array)==-1){  
	            array[array.length] = id;  
	        }  
	         });  
	        return array;  
	};  
	//取消选中事件操作数组  
	var difference = function(array,ids){  
	        $.each(ids, function (i, id) {  
	             var index = $.inArray(id,array);  
	             if(index!=-1){  
	                 array.splice(index, 1);  
	             }  
	         });  
	        return array;  
	};  
	var _ = {"union":union,"difference":difference};  
	//绑定选中事件、取消事件、全部选中、全部取消  
	$("#problemTable").on('check.bs.table check-all.bs.table uncheck.bs.table uncheck-all.bs.table', function (e, rows) {  
	    var ids = $.map(!$.isArray(rows) ? [rows] : rows, function (row) {  
	                 return row.object_Id;  
	        });  
	         func = $.inArray(e.type, ['check', 'check-all']) > -1 ? 'union' : 'difference';  
	         selectionIds = _[func](selectionIds, ids);   
	 }); 
});

//获取一下当前登录用户
function getLoginName(){
	$.ajax({
		type : 'get',
		url: '/psxj/swj-feedbacklist!getLoginName.action',
		dataType: 'json',
		success : function(data){
			userCode=data.loginName;
			userName=data.userName;
		}
	})
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
        		var problemTables = new ProblemTable();
        		problemTables.Init();
        		var lackLiTables = new LackLiTable();
        		lackLiTables.Init();
        		
        		var unitTables = new unitTable();
        		unitTables.Init();
        	}
        }
    });
}
//上报数据统计
var ProblemTable=function(){
	ProblemTable = new Object();
	ProblemTable.Init=function(){
		$("#problemTable").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/lackMark/getAllLackAndCorrect',
			rowStyle:"rowStyle",
			cache:false,
			pagination:true,//不显示分页
			dataType:'json',
			striped:true,
			sidePagination:"server",
			pageNumber: 1,
		    pageSize: 10,
			pageList: [10, 25, 50, 100],
			queryParams:ProblemTable.queryParms,
			clickToSelect:true,
			responseHandler:responseHandler, //在渲染页面数据之前执行的方法，此配置很重要!!!!!!!  
			columns:[
				{field: 'checkStatus',checkbox: 'true'},              
				//{field: 'Number',title: '序号',align:'center',formatter: function (value, row, index) {return index+1;}},     
				//{field:'id',title:'编号',visible:false,algin:'center'},
				{field:'object_Id',title:'上报编号',visible:true,align:'center'},
				{field:'mark_person',title:'上报人',visible:true,align:'center'},
				{field:'layerName',title:'设施类型',visible:true,align:'center'},
				{field:'mark_time',title:'上报时间',visible:true,align:'center',formatter: format_date},
				{field:'road',title:'所在道路',visible:true,align:'center'},
				{field:'addr',title:'地址',visible:true,align:'center'},
				{field:'direct_org_name',title:'直属单位',visible:false,align:'center'},
				{field:'parent_org_name',title:'上报单位',visible:true,align:'center'},
				{field:'pcode',title:'问题大类',visible:true,align:'center',formatter: format_pcode},
				{field:'child_Code',title:'问题子类',visible:true,align:'center',formatter: format_childCode},
				{field:'check_state',title:'审核状态',visible:true,align:'center',formatter: format_checkState},
			]
		});
	},
	ProblemTable.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        startTime : $("#startTime").val(),
	        endTime :  $("#endTime").val(),
	        objectId : $("#objectId").val(),
	        parentOrgId: $("#parentOrgId").val(),
	        pcode: $("#wentilx").val()?$("#wentilx").val():"",
	    	childCode: $("#wentilx-2").val()?$("#wentilx-2").val():""
	  	};
		return temp;
	}
	return ProblemTable;
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
				{title:'操作',visible:true,align:'center',formatter: format_operTwo,width:240}				
			]
		});
	},
	LackLiTable.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        startTime : $("#startTime").val(),
	        endTime :  $("#endTime").val(),
	        objectId : $("#objectId").val(),
	        assignId: $("#assignId").val(),
	        parentOrgName:  $("#parentOrgId").find("option:selected").text()
	    };
		return temp;
	}
	return LackLiTable;
}


//清单详情
var unitTable=function(){
	unitTable = new Object();
	unitTable.Init=function(){
		$("#unitTable").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:"/psxj/swj-assignlist!getAssignData.action",
			method: 'get',
			rowStyle:"rowStyle",
			cache:false,
			pagination:true,//不显示分页
			dataType:'json',
			striped:true,
			sidePagination:"server",
			pageNumber: 1,
		    pageSize: 10,                       
		    pageList: [10, 25, 50, 100, 200, 'All'],
			queryParams:unitTable.queryParms,
			clickToSelect:true,
			onLoadSuccess: function(data){ //加载成功时执行
				appendTable(data);
			},
			columns:[
//				{field:'xid',checkbox: 'true',events: 'actionEvents'},
//				{field:'Number',title: '序号',align:'center',formatter: function (value, row, index) {return index+1;}},
//				{field:'id',title: '清单编号',visible:true,align:'center'},
//				{field:'assignId',title: '清单编号',visible:true,align:'center'},     
//				{field:'objectId',title:'上报编号',visible:true,align:'center'},
//				{field:'assignDate',title:'清单交办日期',visible:true,align:'center',formatter: format_date},
//				{field:'assignPerson',title:'清单交办人',visible:true,align:'center'},
//                {title:'操作',visible:true,align:'center',formatter: format_operThree}
//				{field: 'xid',checkbox: 'true',events: 'actionEvents'},              
				{field: 'Number',title: '序号',align:'center',formatter: function (value, row, index) {return index+1;}},
				{field:'id',title: '清单编号',visible:false,align:'center'},
				{field:'parent_org_name',title:'单位',visible:true,align:'center'},
				{field:'child_Code',title:'问题类型',visible:true,align:'center',formatter: format_childCode},
				{field:'object_Id',title:'上报编号',visible:true,align:'center'},
				{field:'road',title:'所在道路',visible:true,align:'center'},
				{field:'addr',title:'地址',visible:true,align:'center'},
				{field:'mark_person',title:'上报人',visible:true,align:'center'},
				{field:'direct_org_name',title:'直属单位',visible:true,align:'center'},
				{field:'supervise_org_name',title:'监理单位',visible:true,align:'center'},
				{field:'report_type',title:'上报类型',visible:false,align:'center'},
				{field:'x',title:'经度',visible:false,align:'center'},
				{field:'y',title:'纬度',visible:false,align:'center'},
				{field:'qdzt',title:'交办状态',visible:true,align:'center',formatter: format_qdzt},
				{field:'sbid',title:'上报的Id',visible:false,align:'center'},
				{field:'new_oid',title:'新sde生成的object_Id',visible:false,align:'center'},
				{title:'操作',visible:true,align:'center',formatter: format_operThree,width:240}
			],onDblClickRow: function(row){//查看办理过程
				if(row.qdzt!='3' ){
					toInfor(row.new_oid);
				}
			}
		});
	},
	unitTable.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        startTime : $("#startTime").val(),
	        endTime :  $("#endTime").val(),
	        objectId : $("#objectId").val(),
	        assignId: $("#assignId").val(),
	        pcode: $("#wentilx").val()?$("#wentilx").val():"",
	        childCode: $("#wentilx-2").val()?$("#wentilx-2").val():"",
	        parentOrgId: $("#parentOrgId").val()		
	    };
		return temp;
	}
	return unitTable;
}
//流程详情页面
function toInfor(new_oid){
	$.ajax({
        type: 'post',
        url: '/psxj/gx-problem-report!getWtsbForJb.action',
        data: {objectId: new_oid},
        dataType: 'json',
        success: function (data) {
        	var taskInstDbid=data.histTaskInstDbid;
        	var thisId=data.thisId;
        	$.ajax({
                type: 'post',
                url: '/psxj/gx-problem-report!searchGzlData.action',
                data: {id: thisId},
                dataType: 'json',
                success: function (data) {
                	var result=data.result;
                	layer.open({
                		type: 2,
                	    title: "查看问题详情信息",
                	    shadeClose: false,
                	    //closeBtn : [0 , true],
                	    shade: 0.5,
                	    maxmin: true, //开启最大化最小化按钮
                	    area: [$(window).width() * 0.9+'px', $(window).height() * 0.9+'px'],
                	    offset: [$(window).height() * 0.05+'px', $(window).width() * 0.05+'px'],
                	    content: "/psxj/systemInfo/ssxjxt/xcyh/xcyh/detail.html?serverName="+"psxj"+"&templateCode="+result.templateCode+"&taskInstDbid="+taskInstDbid+"&masterEntityKey="+thisId+"&activityChineseName="+thisId+"&activityName="+thisId,
                	});
                }
        	});
        }
	});	
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
//第二个tab操作
function format_operTwo(val,row,index){
	var a='<button type="button" class="btn btn-primary btn-sm" onclick="viewShow(\''+row.id+'\',\'' +row.assignName+'\')">详细</button>';
	var d='&nbsp;<button type="button" class="btn btn-primary btn-sm" onclick="showFeedBackTc(\''+row.assignId+'\')">图层</button>';
	var c='&nbsp;<button type="button" class="btn btn-primary btn-sm" onclick="add(\'\',\''+row.id+'\',\'' +row.assignName+'\',\'' +row.parentOrgName+'\')">修改</button>';
	var b='&nbsp;<button type="button" class="btn btn-primary btn-sm" onclick="deleteRow(\''+row.id+'\',\'two\')">删除</button>';
	return a+d+c+b; 
}
//查看图层
function showFeedBackTc(qdbh){
	if(qdbh){
		toMap();
		window.parent.showFeedBackTc(qdbh);
	}
}
//第三个tab操作
function format_operThree(val,row,index){
	var c='<button type="button" class="btn btn-primary btn-sm" onclick="qdToWtsb(\''+row.report_type+'\',\''+row.sbid+'\',\''+row.new_oid+'\')">详细</button>';
	var d='&nbsp;<button type="button" class="btn btn-primary btn-sm" onclick="toPoint(\''+row.x+'\',\''+row.y+'\')">定位</button>';
	var a='&nbsp;<button type="button" class="btn btn-primary btn-sm" onclick="feedBackShow(\''+row.object_Id+'\',\''+row.id+'\')">反馈</button>';
	var b='&nbsp;<button type="button" class="btn btn-primary btn-sm" onclick="deleteRow(\''+row.id+'\',\'three\')">删除</button>';
	return c+d+a+b; 
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
//第四步   点击地图上面的点弹出里面的内容再，进一步弹框，出现反馈交办信息，准备转化为问题上报
function qdToWtsb(type,mid,new_oid){
	//这里判断一下再跳转
	var url,weigt,hight;
	if(type=='modify' || type=='confirm'){//校核
		weigt='1050px';
		hight='500px';
		url="/psxj/systemInfo/ssxjxt/problem_report/parts_correct/correctInput.html";
	}else{
		weigt='850px';
		hight='450px';
		url="/psxj/systemInfo/ssxjxt/problem_report/parts_lack/lackInput.html";
	}
	layer.open({
		type: 2,
		area: [weigt, hight],
		title : "设施信息",	
		maxmin: true,
		btn:['形成问题上报','取消'],
		btn1: function(index, layero){
			//调用弹出层页面的方法
		       var jsonString=$(layero).find("iframe")[0].contentWindow.getSssbToProblemReportDate();
		       layer.open({
					type: 2,
					area: ['280px', '410px'],
					title : "交办",	
					maxmin: false,
					btn:['保存','取消'],
					content: ['/psxj/systemInfo/ssxjxt/problem_report/assign_feedback/ssjbInput.html', 'yes'],
					btn1: function(index,layero){
							var formJb = $(layero).find("iframe")[0].contentWindow.document.getElementById("jbDialogform");
							var dataJb = $(formJb).serializeArray();
							 $.each(dataJb, function () {
						         if(this.type != 'button') {
						        	 if(this.name=='yjwcsj'){ 
						        		 jsonString = jsonString + ',"yjwcsj":"' + this.value + '"';
						        	 }else if(this.name=='isbyself'){
						        		 jsonString = jsonString + ',"isbyself":"' + this.value + '"';
						        	 }else if(this.name=='bz'){
						        		 jsonString = jsonString + ',"BZ":"' + this.value + '"';
						        	 } 
						        }
						     });
							 jsonString = jsonString + ',"SBR":"' + userName + '"';
							 jsonString = jsonString + ',"object_id":"' + new_oid + '"';
							jsonString = jsonString + '}';
					       var url = "/" + serverName + "/asiWorkflow/wfBusSaveForSssbToWtsb";
						    $.ajax({
				                type : 'post',
				                url : url,
				                data : {json: jsonString},
				                dataType : "json",
				                success : function (json) {
				                    if(json && json.noPriv){
				                        layer.alert(json.noPriv,function(){
				                            layer.closeAll();
				                        });
				                    }
				                    if(json && json.save){
				                    	if(json.save=='success_self'){//自行处理
				                    		layer.alert("自行处理成功！可到“问题列表”中查看",function(){
				                    			layer.closeAll();
					                        });
				                    	}else{
					                	   layer.alert("转办成功！请到“问题上报”-“待受理”中查看",function(){
					                		   layer.closeAll();
					                        });
				                    	}
				                    }
				                }
				             });
						    layer.msg('正在处理中，请稍等...',{time: 3000});		
					},cancel: function(index, layero){
						layer.close(index)
			        }
				});
		},
		content: [url+'?id='+mid+'&type=view', 'yes']
		//content: ['/psxj/systemInfo/ssxjxt/problem_report/assign_feedback/qdToWtsb.html?objectId='+objectId, 'yes']
	});
}
//格式化时间
function format_date(val,rows,index){
	if(val)
		return getLocalTime(val.time);
	else
		return "";
}

//格式化时间
function format_time(val,rows,index){
	if(val)
		return getLocalTime(val);
	else
		return "";
}
//刷新 
function refreshTable(){
	$("#problemTable").bootstrapTable('refresh');
	$("#lackLiTable").bootstrapTable('refresh');
	$("#unitTable").bootstrapTable('refresh');
}

//搜索
function search(){
	refreshTable();
	qdbh="";//如果点了搜索就清空一下
	qdmc="";//如果点了搜索就清空一下
	selectionIds = [];//此时数组也要清空
}
//清空
function resets(){
	selectionIds = [];//此时数组也要清空
	$('#myform')[0].reset();
	$('#wentilx').selectpicker('refresh');
	$('#childCode').html("");
	$('#wentilx-2').selectpicker('refresh');
	refreshTable();
}


//清除查询条件（清除input hidden框的查询条件）
function refreshContext(){
	$("input[type=hidden]").each(function(){
		$(this).val("");
	});
}

//导出excel
function loadToExcel(){
	var qyClass=$('#problem_li').attr('class');
	var dwClass=$('#unit_statistc').attr('class');
	if(qyClass=='active'){//谁活跃导出谁
		$('#problemTable').tableExport({ type: 'excel', escape: 'false',fileName:'上报数据',exportDataType:"all"});//区域
	}else if(dwClass=='active'){
		$('#unitTable').tableExport({ type: 'excel', escape: 'false',fileName:'清单详情', ignoreColumn: [9],exportDataType:"all"});//人员
	}else{
		$('#lackAddTable').tableExport({ type: 'excel', escape: 'false',fileName:'清单列表', ignoreColumn: [5],exportDataType:"all"});//人员
	}
}
//形成清单
function reportAssign(){
	  	//使用getSelections即可获得，row是json格式的数据
//	    var getSelectRows = $("#problemTable").bootstrapTable('getSelections'); 
//	    if(getSelectRows.length<=0){  
//	    	layer.alert("请先选择数据")
//	         return;
//	    } 
//	    for (var i = 0; i < getSelectRows.length; i++) { 
//            var metadatacategory  = getSelectRows[i].object_Id;  
//            array.push(metadatacategory);
//        }
	    var array=selectionIds;
	    if(array.length<=0){  
	    	layer.alert("请先选择数据")  
	    }else{  
	    	var a= $("#problemTable").bootstrapTable('getSelections');
	    	var parentOrgName = a[0].parent_org_name;
	    	add(array,"","",parentOrgName);
	    }	    
}   
//删除
function deleteRow(thisId,flag){
	var title="确定删除？将会一并删除对应的反馈信息和图片";
	if(flag=='two'){
		title="确定删除？将会一并删除清单中的所有数据，包括对应的反馈信息和图片";
	}
	layer.confirm(title, {
        btn: ['确定', '取消'] //按钮
    }, function () {
    	layer.closeAll('dialog');
    	layer.load(2);
    	$.ajax({
            type: 'post',
            url: '/psxj/swj-assign!deleteData.action',
            data: {assid: thisId,flag:flag},
            dataType: 'json',
            success: function (data) {
            	if(data.sucess){
            		layer.closeAll('loading');
            		$("#assignId").val(qdbh);//刷新的时候也带上参数
            		refreshTable();
            		$("#assignId").val("");//刷新的时候也带上参数
            		layer.msg('删除成功！', {
                        icon: 1,
                        time: 2000
                    });
            	}else{
            		$("#assignId").val(qdbh);//刷新的时候也带上参数
        			refreshTable();
        			$("#assignId").val("");//刷新的时候也带上参数
        			layer.msg('删除失败！', {
                        icon: 2,
                        time: 2000
                    });
            	}
            }
    	});
    }, function () {
        return;
    });
}

//查看清单详情
function viewShow(assignId,assignName){
	//隐藏列表
	$("#lack_add_Tab").attr("class", "tab-pane");
	$("#lack_add_li").removeClass("active");
	//显示详情
	$("#unit_Tab").attr("class", "tab-pane fade in active");
	$("#unit_statistc").attr("class", "active");
	//刷新一下人数上报
	//给页面赋值，带到后台查询
	$("#assignId").val(assignId);
	qdbh=assignId;
	qdmc=assignName;
	$("#unitTable").bootstrapTable('refresh');
//	$("#assignId").val("");//执行完毕用以后清空，不然影响下次查询
}


//数据确认详情页面
function feedBackShow(objectId,id){
	layer.open({
		type: 2,
		area: ['850px', '500px'],
		maxmin: true,
		title : "反馈信息",	
		content: ['/psxj/systemInfo/ssxjxt/problem_report/assign_feedback/feedBackInput.html?objectId='+objectId+'&aid='+id+'&userName='+userName+'&userCode='+userCode, 'yes']
	});
}

//格式化问题类型
function format_pcode(val,row,index){
	if(parent.awater){
		var html="";
		var pcode = parent.awater.code.pcode;
		if(val!=null){
			var arr = val.split(',');
			for(i in arr){
				var code = arr[i];
				for(k in pcode){
					if(code==pcode[k].code){
						var codeName = pcode[k].name;
						html+=html==""? codeName:","+codeName;
					}
				}
			}
		}
		return html==""?"无":html;
	}
	return "无";
}
function format_childCode(val,row,index){
	if(parent.awater){
		var html="";
		var childCode = parent.awater.code.childCode;
		if(val!=null){
			var arr = val.split(',');
			for(i in arr){
				var code = arr[i];
				for(k in childCode){
					if(code==childCode[k].code){
						var codeName = childCode[k].name;
						html+=html==""? codeName:","+codeName;
					}
				}
			}
		}
		return html==""?"无":html;
	}
	return "无";
}
function format_qdzt(val,row,index){
	var text="处理中"
	if(val=='2'){
		text="办理完"
	}else if(val=='3'){
		text="未处理"
	}
	return text;
}
//拼接table加个表头
function appendTable(data){
	$('tr.del').remove();
	var sbdw1=$("#parentOrgId").find("option:selected").text();
	var dateStr="";
	var qdlb="";
	var sbdw="";
	if(qdmc!=null && qdmc!=""){
		qdlb="(清单名称："+qdmc+")";
//		dateStr=timetrans(qdbh);
	}
	if(sbdw1!=null && sbdw1!="" && sbdw1!="全部"){
		sbdw=format_qy(sbdw1);
	}
	$("#unitTable thead").prepend('<tr class="del"><th style="text-align: center;" colspan="10">'+sbdw+'排水设施核查数据问题一栏表'+qdlb+'</th></tr>');	 
}

function timetrans(date){
    var date = new Date(date*1);//如果date为10位不需要乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y+M+D+h+m+s;
}
 
 
//表格分页之前处理多选框数据  
function responseHandler(res) {  
      $.each(res.rows, function (i, row) {  
          row.checkStatus = $.inArray(row.object_Id, selectionIds) != -1;  //判断当前行的数据id是否存在与选中的数组，存在则将多选框状态变为true  
      });  
      return res;  
}

//新增
function add(array,id,name,orgName){
	layer.open({
		type: 2,
		area: ['500px', '235px'],
		title : "交办",	
		maxmin: false,
		btn:['保存','取消'],
		content: ['/psxj/systemInfo/ssxjxt/problem_report/assign_feedback/assignInput.html?id='+id+'&type=add&name='+name+'&orgName='+orgName, 'yes'],
		btn1: function(index,layero){
			//$(layero).find("iframe")[0].contentWindow.save();
			/**/
		    layero.find('.layui-layer-btn0')[0].style.display="block";
			var form = $(layero).find("iframe")[0].contentWindow.document.getElementById("myform");
			var data = $(form).serializeArray();
			var id,assignName,parentOrgName;
			for(i in data){
				if(data[i].name == "id"){
					id=data[i].value;
				}if(data[i].name == "assignName"){
					assignName=data[i].value;
				}if(data[i].name == "parentOrgName"){
					parentOrgName=data[i].value;
				}
			} 
			if(assignName == ""){
				layer.alert("请先填写交办清单名称！");  
				return;
			}
			if(parentOrgName == ""){
				layer.alert("请先选择交办单位！");  
				return;
			}
			$.ajax({
		    	type: "post",
	            data: {"assdataList" : JSON.stringify(array),"assignName":assignName,"parentOrgName":parentOrgName,"id":id},
	            dataType: "json",
	            url: "/psxj/swj-assign!save.action",
	            async: false,
	            success: function (result) {
	                if (result.sucess) {
	                	layer.close(index);
	                	selectionIds = [];//此时数组也要清空
	                	//隐藏上报数据
	                	$("#problem_Tab").attr("class", "tab-pane");
	                	$("#problem_li").removeClass("active");
	                	//显示清单数据
	                	$("#lack_add_Tab").attr("class", "tab-pane fade in active");
	                	$("#lack_add_li").attr("class", "active");
	                	//刷新一下
	                	$("#lackLiTable").bootstrapTable('refresh');
	                	$("#unitTable").bootstrapTable('refresh');
	                }else{
	                	layer.msg('保存失败！', {
	                        icon: 2,
	                        time: 2000
	                    });
	                }
	            }   
		    })
		    
	    },cancel: function(index, layero){
			layer.close(index)
        }
	});
}

function refreshSave(){
	selectionIds = [];//此时数组也要清空
	//隐藏上报数据
	$("#problem_Tab").attr("class", "tab-pane");
	$("#problem_li").removeClass("active");
	//显示清单数据
	$("#lack_add_Tab").attr("class", "tab-pane fade in active");
	$("#lack_add_li").attr("class", "active");
	//刷新一下
	$("#lackLiTable").bootstrapTable('refresh');
	$("#unitTable").bootstrapTable('refresh');
}