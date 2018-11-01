//数据填充
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) return unescape(r[2]); return "";
}
//获取预案模板编号
var id=getQueryStr("id");
//所属行政区编号
var districtArea="";
//市级预案模板编号
var cityPanId;
//获取所属行政区编号
$.ajax({
	method : 'GET',
	url : '/agsupport/om-org!getOrganizationName.action',
	async : true,
	success : function(data) {
		var districtName=data;
		for(var index in nnArea){
			if(nnArea[index].name==districtName){
				districtArea=nnArea[index].code;
				break;
			}
		}
	},
	error : function(e) {
		parent.layer.msg('获取用户信息失败');
	}
});

//机构树设置
var setting = {
	check: {enable: true,chkStyle : "checkbox",chkboxType: { "Y": "s", "N": "s" }},
	data: {
		key: {name: "orgName"},
		simpleData: {
			enable: true,
			idKey: "orgId",
			pIdKey: "parentOrgId",
			rootPId: 0
		}
	}
};

//获取预案板等级
function getTemplateGrade(value, row, index){
	for (grade in dictionary.templateGrade){
		if(value==dictionary.templateGrade[grade].itemCode)
			return dictionary.templateGrade[grade].itemName;
	}
}

//日期格式化
function format_date(value, row, index){
	if(value)
		return getLocalTime(value.time);
	return '';
}
//物资合并数量单位显示
function operateFormatterNum(value, row, index) {
       return value+row.unit;
}

function getInputNumGood(value, row, index){
		 return value ;
}

function getInputNumTeam(value, row, index){
		 return value ;
}
//队伍人员数量和单位合并显示
function peopleFormat(value, row, index){
    return value+"人";		
}
//表格查询参数生成
function queryParams(params) {
	return {
		pageSize:params.limit,
		pageNo: params.offset/params.limit+1
	};
}

//生成易涝隐患点调度详细按钮
function addBtnCol(value, row, index){
	return "<button id=\"btn_edit\" type=\"button\" class=\"btn\" style=\"border:1px solid transparent;\" onclick=\"detailDialog('"+row.id+"','"+row.combName+"')\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>调度详细</button>";
}
//易涝隐患点输入框序号
var cId;
//易涝隐患点调度情况
var firstDispatch=true;
//易涝隐患点调度详细
function detailDialog(combId,jsdName){
	if(!id){
		layer.msg("保存当前预案后，才能进行易涝隐患点调度");
		return ;
	}
	layer.open({
		type: 2,
		title: jsdName+" 调度详情",
		shadeClose: true,
		shade: 0,
		area: ['700px', '440px'],
		content: "Template_jsdDispatchPreview.html?combId="+combId+"&modelId="+id
	});
}

function refreshJsdTeam(teamData){
    var arr=teamData.split(",");
    $("#tableJsd tr:eq("+(cId+1)+")").children("td:eq(1)").html(arr[0]);
    $("#tableJsd tr:eq("+(cId+1)+")").children("td:eq(2)").html(arr[1]);
}

$(window).load(function(){
	$("#tableMuni").on('post-body.bs.table', function (row,obj) {
		$(".fixed-table-body").mCustomScrollbar({mouseWheelPixels:300});
	});
	
	$("#tableGood").on('post-body.bs.table', function (row,obj) {
		$(".fixed-table-body").mCustomScrollbar({mouseWheelPixels:300});
	});
	
	$("#tableTeam").on('post-body.bs.table', function (row,obj) {
		$(".fixed-table-body").mCustomScrollbar({mouseWheelPixels:300});
	});
	
	$("#tableJsd").on('post-body.bs.table', function (row,obj) {
		$(".fixed-table-body").mCustomScrollbar({mouseWheelPixels:300});
	});
	
/*	$("#templateCreateTime").datetimepicker({
		language: 'zh-CN',
		format: 'yyyy-mm-dd hh:ii:ss',
		autoclose:true,
		pickerPosition:'top-right',
		minView:1,
	});
*/	
	$('#form').bootstrapValidator();
});
			
var dictionary;

var districtUnitId;
var districtUnitType;				
if(id==""){
	searchSms(11);
	$.ajax({
		type: 'post',
		url : '/agsupport/ya-team-dispatch!listJsdTeam.action?modelId='+id+"&type=1",
		async:false,
		dataType : 'json',  
		success : function(data) {
		    teamData=data;
		},
		error : function() {
			layer.msg("获取数据失败");
		}
	});
	
	//获取成员单位ID			
	$.ajax({
		method : 'GET',
		url : '/agsupport/ya-template-district!inputJson.action',
		async : true,
		dataType : 'json',
		success : function(data) {
			dictionary=data.Dict;
			districtUnitId=data.id;
			districtUnitType=data.type;
			for (itemname in dictionary){
				for (num in dictionary[itemname]){
					$("#"+itemname).append("<option value='"+dictionary[itemname][num].itemCode+"'>"+dictionary[itemname][num].itemName+"</option>");
				}
			}
			var orgTree = data.Tbmap["orgTable"];
			$.fn.zTree.init($("#templateSmsReceiver"), setting,orgTree);
			
			var goodTableRows=JSON.parse(data.Goodmap["goodTable"]).rows;
			$("#tableGood").bootstrapTable({
				toggle:"table",
				data:goodTableRows,
				rowStyle:"rowStyle",
				height:320,
				cache: false, 
				checkboxHeader:false,
				singleSelect:false,
				clickToSelect:true,
				sidePagination: "server",
				columns: [
					{field:'id',visible: false,title: '编号',align:'center'},
					{field:'name',visible: true,title: '物资名称',align:'center'},
					{field:'code',visible: true,title: '物资代码',align:'center'},
					{field:'model',visible: true,title: '型号',align:'center'},
					{field:'dispAmount',visible: true,title: '调度数量',formatter:getInputNumGood,align:'center'},
				    {field:'amount',visible: true,title: '数量',align:'center',formatter:'operateFormatterNum'}
				]
			});	 				  	
			
			var teamTableRows=JSON.parse(data.Teammap["teamTable"]).rows;
			$("#tableTeam").bootstrapTable({
				toggle:"table",
				data:teamTableRows,
				rowStyle:"rowStyle",
				height:320,
				cache: false, 
				checkboxHeader:false,
				singleSelect:false,
				clickToSelect:true,
				sidePagination: "server",
				columns: [
					{field:'id',visible: false,title: '编号'},
					{field:'name',visible: true,title: '名称',align:'center'},
					{field:'contact',visible: true,title: '联系人',align:'center'},
					{field:'phone',visible: true,title: '电话',align:'center'},
					{field:'address',visible: false,title: '地址',align:'center'},
					{field:'dispAmount',visible: true,title: '调度人数',formatter:getInputNumTeam,align:'center'},
					{field:'amount',visible: true,title: '人数',formatter:peopleFormat,align:'center'}
				]
			});
			initJsdTable();
			initCityYa();
		},
		error : function() {
			layer.msg("获取数据失败");
		}
	});
} else {
	$.ajax({
		method : 'GET',
		url : '/agsupport/ya-template-district!inputJson.action?id='+id,
		async : true,
		dataType : 'json',
		success : function(data) {
		 	cityPanId=data.form.cityPanId;
		 	dictionary=data.Dict;
			//填充字典，并选中值
			for (itemname in dictionary){
				for (num in dictionary[itemname]){
					var selText="";
					if(dictionary[itemname][num].itemCode==data.form[itemname])
						selText="selected='true'";
					$("#"+itemname).append("<option value='"+dictionary[itemname][num].itemCode+"' "+selText+">"+dictionary[itemname][num].itemName+"</option>");
				}
			}
			//填充表单内容 
			for (var key in data.form){
				$("#"+key).val(data.form[key]);
				if(key=="templateSmsReceiver"&&data.form[key]!=null) {					       
					var arr=data.form[key].split(',');
					$("#smsReceiver").selectpicker('val', arr);
				}					    
				if(key=="cityPanId"&&data.form[key]!=null) {
					var panIdData=$("#tableMuni").bootstrapTable("getData",true);
					for(var index in panIdData) { 
						 if(data.form[key]==panIdData[index]["id"]) {
							  $("#tableMuni").bootstrapTable("check",index);
						  }		                    
					}
				}
			}
			//填充机构内容，并选中 
			var orgTree = data.Tbmap["orgTable"];
			$.fn.zTree.init($("#templateSmsReceiver"), setting,orgTree);
			for (var key in data.form){
				if(key.toLowerCase().indexOf("time")!=-1&&data.form[key]!=null)
					$("#"+key).val(getLocalTime(data.form[key].time));
				else if(key=="templateSmsReceiver"){
					var strArray=data.form[key].split(",");
					var zTree = $.fn.zTree.getZTreeObj("templateSmsReceiver");
					for(var i=0;i<strArray.length;i++){
						var node = zTree.getNodeByParam("orgId",strArray[i]);
						if(node!=null){
						node.checked = true;
						zTree.updateNode(node);
						}
					}
				}else if(key=="templateSms"){ 
					searchSms(11);
				}else
					$("#"+key).val(data.form[key]);
			}
            
			var goodTableRows=JSON.parse(data.Goodmap["goodTable"]).rows;
			$("#tableGood").bootstrapTable({
				toggle:"table",
				data:goodTableRows,
				rowStyle:"rowStyle",
				height:320,
				cache: false, 
				checkboxHeader:false,
				singleSelect:false,
				clickToSelect:true,
				sidePagination: "server",
				columns: [
					{field:'id',visible: false,title: '编号'},
					{field:'name',visible: true,title: '物资名称',align:'center'},
					{field:'code',visible: true,title: '物资代码',align:'center'},
					{field:'model',visible: true,title: '型号',align:'center'},
					{field:'dispAmount',visible: true,title: '调度数量',formatter:getInputNumGood,align:'center'},
				    {field:'amount',visible: true,title: '数量',align:'center',formatter:'operateFormatterNum'}
				]
			});	  
			
			if(goodTableRows){
				$.each(goodTableRows,function(index,item){
					 if(item["goodChecked"]==1)
					   $("#tableGood").bootstrapTable("check",index);
				});
			}
			var teamTableRows=JSON.parse(data.Teammap["teamTable"]).rows;
			$("#tableTeam").bootstrapTable({
				toggle:"table",
				data:teamTableRows,
				rowStyle:"rowStyle",
				height:320,
				cache: false, 
				checkboxHeader:false,
				singleSelect:false,
				clickToSelect:true,
				sidePagination: "server",
				columns: [
					{field:'id',visible: false,title: '编号'},
					{field:'name',visible: true,title: '名称',align:'center'},
					{field:'contact',visible: true,title: '联系人',align:'center'},
					{field:'phone',visible: true,title: '电话',align:'center'},
					{field:'address',visible: false,title: '地址',align:'center'},
					{field:'dispAmount',visible: true,title: '调度人数',formatter:getInputNumTeam,align:'center'},
					{field:'amount',visible: true,title: '人数',formatter:peopleFormat,align:'center'}
				]
			});
			
			if(teamTableRows){
				$.each(teamTableRows,function(index,item){
					 if(item["teamChecked"]==1)
					   $("#tableTeam").bootstrapTable("check",index);
				});
			}
			initJsdTable();
			initCityYa();
		},
		error : function(error) {
			layer.msg("获取数据失败");
		}
	});			
}

var closePage=false;
function saveAndClose(){
    closePage=true;			
	save();
}	

function save(){
	var cityPanId=$("#tableMuni").bootstrapTable("getSelections")[0]==undefined?undefined:$("#tableMuni").bootstrapTable("getSelections")[0].id;
	var goods=$("#tableGood").bootstrapTable("getData");
	var goodIds=[];
	var gDispAmounts=[];
	var tDispAmounts=[];
	for(index in goods) {
		var amount=$("input[name='gnumbervalue"+goods[index]["id"]+"']").val();
		if(amount>0){
			goodIds.push(goods[index]["id"]);
			gDispAmounts.push(amount);
		}
	}
	var goodIdsStr=goodIds.join(",");
	var gDispAmountsStr=gDispAmounts.join(",");
	
	var teams=$("#tableTeam").bootstrapTable("getData");
	var teamIds=[];
	for(index in teams) {
		var amount=$("input[name='tnumbervalue"+teams[index]["id"]+"']").val();
		if(amount>0){
			teamIds.push(teams[index]["id"]);
			tDispAmounts.push(amount);
		}					
	}
	var teamIdsStr=teamIds.join(",");
	var tDispAmountsStr=tDispAmounts.join(",");
	//单是调整了人员物资，而没有更改易涝隐患点调度，也要将易涝隐患点调度数据清除
	if(firstDispatch&&id!=""){
    	$.ajax({  
		    url: "/agsupport/ya-template-district!testDispatchAlter.action",  
		    data:"goodIdsStr="+goodIdsStr+"&teamIdsStr="+teamIdsStr+"&gDispAmountsStr="+gDispAmountsStr+"&tDispAmountsStr="+tDispAmountsStr+"&id="+id,
		    async:false,
		    type: "get",
		    dataType: "json",
		    success: function(data) {
		    	if(data){
		        	layer.confirm('人员或物资调度已经调整，继续会将当前调整保存并将易涝隐患点调度数据清零，是否继续？', {
						btn: ['是','否'] //按钮
					}, function(index){ 
						$.ajax({  
							url: "/agsupport/ya-good-dispatch!clearJsdDispatch.action?modelId="+id+"&type=3",  
						    async:false,
						    type: "get",
						    dataType: "json",
						    success: function(data) {
                                layer.close(index);
                                saveData();
							}
					  	});     									
					}, function(index){
						closePage=false;				 
						layer.close(index);
						return;
					});  					      
		      	} else {
		      		saveData();
		      	}
		    }
		}); 
    } else {
		saveData();
	}
}

//初始化关联市级预案
function initCityYa(){
	$("#tableMuni").bootstrapTable({
		toggle:"table",
		url:"/agsupport/ya-template-city!listJson.action",
		rowStyle:"rowStyle",
		toolbar: '#toolbar',
		height:140,
		cache: false, 
		checkboxHeader:false,
		singleSelect:true,
		clickToSelect:true,
		sidePagination: "server",
		columns: [
			{visible:true,title: '',checkbox:true,readOnly: 'readonly'},
			{field:'id',visible: false,title: '编号'},
			{field:'templateNo',visible: true,title: '预案编号',align:'center'},
			{field:'templateName',visible: true,title: '预案名称',align:'center'},
			/*{field:'templateCreateTime',visible: true,title: '创建时间',align:'center',formatter:format_date},*/
			{field:'templateGrade',visible: true,title: '预案级别',align:'center',formatter:getTemplateGrade}
		]
	});
}

//初始化易涝隐患点表格
function initJsdTable(){
	$("#tableJsd").bootstrapTable({
	    toggle:"table",
		height:400,
		url:"/agsupport/ps-comb!listJson.action?estType=13&area="+districtArea,
		rowStyle:"rowStyle", 
		cache: false, 
		pagination:true,
		pageNumber:1,
	    pageSize: 10,
		pageList: [10,25],
		queryParams: queryParams,
		sidePagination: "server",
		columns: [
			{field:'combName',visible: true,title: '名称',width:"25%",align:'center'},
			/*{field:'xcoor',visible: true,title: '经度',align:'center'},
			{field:'ycoor',visible: true,title: '纬度',align:'center'},*/
			{field:'estDept',visible: true,title: '记录建立单位',align:'center'},
			{visible: true,title: '操作',align:'center',formatter:addBtnCol}
		 ]
	});
}
//自动勾选关联市级预案
$("#tableMuni").on('post-body.bs.table', function (row,obj) {
	var allMuniTableData = $("#tableMuni").bootstrapTable('getData');//获取表格的所有内容行 
	$.each(allMuniTableData,function(index,item){
		if(item["id"]==cityPanId)
			$("#tableMuni").bootstrapTable("check",index);
	});			
});

//保存数据
function saveData(){
	var cityPanId=$("#tableMuni").bootstrapTable("getSelections")[0]==undefined?undefined:$("#tableMuni").bootstrapTable("getSelections")[0].id;
	var goods=$("#tableGood").bootstrapTable("getData");
	var goodIds=[];
	var gDispAmounts=[];
	var tDispAmounts=[];
	for(index in goods) {
		var amount=$("input[name='gnumbervalue"+goods[index]["id"]+"']").val();
		if(amount>0){
			goodIds.push(goods[index]["id"]);
			gDispAmounts.push(amount);
		}
	}
	
	
	var goodIdsStr=goodIds.join(",");
	var gDispAmountsStr=gDispAmounts.join(",");
	
	var teams=$("#tableTeam").bootstrapTable("getData");
	var teamIds=[];
	for(index in teams) {
		var amount=$("input[name='tnumbervalue"+teams[index]["id"]+"']").val();
		if(amount>0){
			teamIds.push(teams[index]["id"]);
			tDispAmounts.push(amount);
		}					
	}
	var teamIdsStr=teamIds.join(",");
	var tDispAmountsStr=tDispAmounts.join(",");
	//添加机构树状参数
	var treeObj=$.fn.zTree.getZTreeObj("templateSmsReceiver");
	nodes=treeObj.getCheckedNodes(true);
	checkIds="";
	for(var i=0;i<nodes.length;i++){
		if(checkIds=="")
			checkIds=nodes[i].orgId;
		else
			checkIds+= ","+nodes[i].orgId;
	}
	var dataparam;
	if(cityPanId==undefined)
	   dataparam=$("#form").serialize()+"&cityPanId=&goodIdsStr="+goodIdsStr+"&teamIdsStr="+teamIdsStr+"&gDispAmountsStr="+gDispAmountsStr+"&tDispAmountsStr="+tDispAmountsStr+"&templateSmsReceiver="+encodeURIComponent(checkIds);
	else
	   dataparam=$("#form").serialize()+"&cityPanId="+cityPanId+"&goodIdsStr="+goodIdsStr+"&teamIdsStr="+teamIdsStr+"&gDispAmountsStr="+gDispAmountsStr+"&tDispAmountsStr="+tDispAmountsStr+"&templateSmsReceiver="+encodeURIComponent(checkIds);
	if(districtUnitId!=undefined) {
		dataparam=dataparam+"&districtUnitId="+districtUnitId+"&districtUnitType="+districtUnitType;
	}
	
	$.ajax({
		type: 'post',
		url : '/agsupport/ya-template-district!saveJson.action',
		async : true,
		data: dataparam,
		dataType : 'json',  
		success : function(data) {
			if(closePage){
		       	parent.layer.msg(data.result);
	 		   	var index = parent.layer.getFrameIndex(window.name);
				window.parent.closeLayer(index);
			} else if(id=="") {
				id=data.id;
				$("#id").val(id);
		   }
		},
		error : function() {
			layer.msg("保存数据失败");
		}
	});
}
function cancel() {
	parent.layer.close(parent.layer.getFrameIndex(window.name));
}
function searchSms(value){
	var dataparms={alarmType : value};
	$.ajax({
		type: 'post',
		url : '/agsupport/ya-temlate-sms!listSmsMessageAjax.action',
		data : dataparms,
		dataType : 'json',
		success : function(data){
			$.each(eval(data.rows), function(){
				//$("#templateSms").val(this.TEMPLATE_CONTET);
				this.TEMPLATE_CONTET? $("#templateSms").val(this.TEMPLATE_CONTET) : $("#templateSms").val("");
			});
		},
		error : function(){
			parent.layer.msg('获取短信失败');
		}
	});
}

function freshSmsBtn() {
	$.ajax({
		type: 'post',
		url : '/agsupport/ya-good-dispatch!loadSmsJsdDispatchTemplate.action',
		data : {modelId:id},
		dataType : 'text',
		success : function(data){
			$("#templateSms").val(data);
			parent.layer.msg('更新短信内容成功');
		},
		error : function(){
			parent.layer.msg('加载短信内容失败');
		}
	});
}