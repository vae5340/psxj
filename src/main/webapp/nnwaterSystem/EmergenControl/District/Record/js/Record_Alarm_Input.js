
//数据填充	    
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}
var template_id=getQueryStr("template_id");
var id=getQueryStr("id");
var view=getQueryStr("view");    

var districtUnitId=getQueryStr("districtUnitId");
var yaCityId=getQueryStr("yaCityId");
var setting = {
	check: {
		enable: true,
		chkStyle : "checkbox",
		chkboxType: { "Y": "s", "N": "s" }
	},
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
var districtArea="";
$.ajax({
	method : 'GET',
	url : '/agsupport/om-org!getOrganizationName.action',
	async : false,
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
		layer.msg("获取当前用户机构信息失败");
	}
});
	    
function getInputNumGood(value, row, index){
	if(value)
		return "<input type='text' name='gnumbervalue"+row["id"]+"' class='form-control'  max='"+row["amount"]+"' min='0' value="+value+" style='text-align:center;width:80px;margin-left:30px'></input>";
	else
		return "<input type='text' name='gnumbervalue"+row["id"]+"' class='form-control'  max='"+row["amount"]+"' min='0' style='text-align:center;width:80px;margin-left:30px'></input>";
}

function getInputNumTeam(value, row, index){
	if(value)
		return "<input type='text' name='tnumbervalue"+row["id"]+"' class='form-control'  max='"+row["amount"]+"' min='0' value="+value+" style='text-align:center;width:80px;margin-left:30px'></input>";
	else
		return "<input type='text' name='tnumbervalue"+row["id"]+"' class='form-control'  max='"+row["amount"]+"' min='0' style='text-align:center;width:80px;margin-left:30px'></input>";
}

function queryParams(params) {
	return {
		pageSize:params.limit,
        pageNo: params.offset/params.limit+1
	};
}
		    
function addBtnCol(value, row, index){
	  return "<button id=\"btn_edit\" type=\"button\" class=\"btn\" style=\"border:1px solid transparent;\" onclick=\"detailDialog("+row.id+",'"+row.combName+"')\"><span class=\"glyphicon\" aria-hidden=\"true\"></span>调度详细</button>";
}

function peopleFormat(value, row, index){
    return value+"人";		
}
		
var firstDispatch=true;
function detailDialog(combId,jsdName){
	if(view){
		layer.open({
			type: 2,
			title: jsdName+" 调度详情",
			shadeClose: true,
			shade: 0,
			area: ['700px', '440px'],
			content: "/awater/nnwaterSystem/EmergenControl/District/Template/jsdDispatch.html?combId="+combId+"&modelId="+id+"&yaType=2&type=4&view=1"
		});		         
	} else {
		layer.open({
			type: 2,
		  	title: jsdName+" 调度详情",
		  	shadeClose: true,
		  	shade: 0,
		  	area: ['700px', '440px'],
		  	content: "/awater/nnwaterSystem/EmergenControl/District/Record/jsdDispatch_Record.html?combId="+combId+"&modelId="+template_id+"&type=2"
		});	
	}
}
var url;

$(window).resize(function () {
	$('#tableJsd').bootstrapTable('resetView');
	$('#tableGood').bootstrapTable('resetView');
	$('#tableTeam').bootstrapTable('resetView');
});	
$(function(){
	if(template_id){
		url='/agsupport/ya-template-district!inputJsonRecord.action?id='+template_id;
       	$("#recordCreatePerson").hide();
    } else {
       	url='/agsupport/ya-record-district!inputJson.action?id='+id;	           
    }  
	$.ajax({
		method : 'GET',
		url :url,
		async : true,
		dataType : 'json',
		success : function(data) {
			var dictionary=data.Dict;
			for (itemname in dictionary){
				for (num in dictionary[itemname]){
					var selText="";
					if(dictionary[itemname][num].itemCode==data.form[itemname])
						selText="selected='true'";
					$("#"+itemname).append("<option value='"+dictionary[itemname][num].itemCode+"' "+selText+">"+dictionary[itemname][num].itemName+"</option>");
				}
			}
			
			var orgTree = data.Tbmap["orgTable"];
			$.fn.zTree.init($("#templateSmsReceiver"), setting,orgTree);					
			
			$("#templateId").val(template_id);
			for (var key in data.form){
				if(key=="id")
				  continue;
				if(key=="templateCreateTime"&&data.form[key]!=null){                        						
					$("#templateCreateTime").val(getLocalTime(data.form[key].time));
				}
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
				}
				else if(key=="templateRemark")
				   	$("#remark").val(data.form[key]);
			    else
				   	$("#"+key).val(data.form[key]);
			}
			
			var goodTableRows=JSON.parse(data.Goodmap["goodTable"]).rows;
			$("#tableGood").bootstrapTable({
		   		toggle:"table",
			    data:goodTableRows,
				rowStyle:"rowStyle",
				height:450,
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
					{field:'amount',visible: true,title: '数量',align:'center'},
					{field:'unit',visible: true,title: '单位',align:'center'}
				]
		  	});
		  	
		  	$.each(goodTableRows,function(index,item){
				if(item["goodChecked"]==1)
					$("#tableGood").bootstrapTable("check",index);
		  	});
		  	
	  		var teamTableRows=JSON.parse(data.Teammap["teamTable"]).rows;
		  	$("#tableTeam").bootstrapTable({
		   		toggle:"table",
			    data:teamTableRows,
				rowStyle:"rowStyle",
				height:450,
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
					{field:'dispAmount',visible: true,title: '调度人数',formatter:getInputNumTeam,align:'center'},
					{field:'amount',visible: true,title: '人数',formatter:peopleFormat,align:'center'}
				]
		  	});
		  	
	  		$.each(teamTableRows,function(index,item){
				if(item["teamChecked"]==1)
					$("#tableTeam").bootstrapTable("check",index);
		  	});	   	  
		},
		error : function() {
			layer.msg("加载预案信息失败");
		}
	});
	
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
			{field:'combName',visible: true,title: '名称',width:"45%",align:'center'},
			{field:'xcoor',visible: false,title: '经度',align:'center'},
			{field:'ycoor',visible: false,title: '纬度',align:'center'},
			{field:'estDept',visible: true,title: '记录建立单位',width:"35%",align:'center'},
			{visible: true,title: '操作',align:'center',formatter:addBtnCol}
		]
	});
	$(window).load(function(){
		$("#templateCreateTime").datetimepicker({
			language: 'zh-CN',
		  	format: 'yyyy-mm-dd hh:ii:ss',
		  	autoclose:true,
		  	pickerPosition:'top-right'
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
	});
});
		
var closePage=false;
function saveAndClose(){
    closePage=true;
	$.ajax({  
	    url: "/agsupport/ya-record-district!checkStatus.action",  
	    data:{yaCityId:yaCityId},
	    async:false,
	    type: "get",
	    dataType: "json",
	    success: function(data) {
	    	if(data.statusId==0){
    			//未启动预案
    			save();
    		} else if(data.statusId==1){
    			//启动中
    			layer.msg("启动预案失败，当前已有预案启动中");
    		} else if(data.statusId==2) {
    			//已结束
    			layer.msg("启动预案失败，当前已有预案启动，且预案已经结束");
    		} else {
    			//未知状态
    			layer.msg("启动预案失败，未知错误");
    		}
	    },
	    error:function(){
	    	layer.msg("检查成员单位预案状态失败");
	    }
	});
}	
			
function save(){
   	var goods=$("#tableGood").bootstrapTable("getData");
	var goodIds=[];
	var gDispAmounts=[];
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
	var tDispAmounts=[];
	for(index in teams) {
		var amount=$("input[name='tnumbervalue"+teams[index]["id"]+"']").val();
		if(amount>0){
			teamIds.push(teams[index]["id"]);
			tDispAmounts.push(amount);
		}				
	}
	var teamIdsStr=teamIds.join(",");
	var tDispAmountsStr=tDispAmounts.join(",");
	
    if(firstDispatch){
		$.ajax({  
		  	url: "/agsupport/ya-template-district!testDispatchAlter.action",  
		    data:"goodIdsStr="+goodIdsStr+"&teamIdsStr="+teamIdsStr+"&gDispAmountsStr="+gDispAmountsStr+"&tDispAmountsStr="+tDispAmountsStr+"&id="+template_id,
		    async:false,
		    type: "get",
		    dataType: "json",
		    success: function(data) {
				if(data){
		          	layer.confirm('人员或物资调度已经调整，继续会将当前调整保存并无积水点调度信息数据，是否继续？', {
						 btn: ['是','否'] //按钮
					}, function(index){ 
					    var dataparam=getStrParamByArray()+"&goodIdsStr="+
						encodeURIComponent(goodIdsStr)+"&teamIdsStr="+encodeURIComponent(teamIdsStr)+
						"&gDispAmountsStr="+gDispAmountsStr+"&tDispAmountsStr="+tDispAmountsStr;
						$.ajax({
							type: 'post',
							url : '/agsupport/ya-record-district!saveJson.action',
							data:dataparam,
							dataType : 'json',  
							success : function(data) {
								 if(closePage){
								     parent.layer.msg(data.result);
									 showTabWindow("/awater/nnwaterSystem/EmergenControl/District/main.html?districtUnitId="+data.districtUnitId+"&id="+data.id)			
									 parent.closeNavTab(window.location.href);
								 } else if(id=="") {
								      id=data.id;
								      $("#id").val(id);										    
								 }
							},
							error : function(e) {
								alert('error');
							}
						});							
					 }, function(index){
					 	  closePage=false;				 
						  layer.close(index);
						  return;
				   });  					      
		      }else if(data==0){
		        //将模板中所有调度信息复制至预案,提前获取id
        			$.ajax({
					method : 'GET',
					url :"/agsupport/ya-record-district!copyTemplateDispatch.action?templateId="+template_id,
					async : true,
					dataType : 'json',
					success : function(data) {		
	  	               if(data>0){
	  	                  id=data;
	  	                  $("#id").val(id);
	  	                  var dataparam=getStrParamByArray()+"&goodIdsStr="+
						  encodeURIComponent(goodIdsStr)+"&teamIdsStr="+encodeURIComponent(teamIdsStr)+
						 "&gDispAmountsStr="+gDispAmountsStr+"&tDispAmountsStr="+tDispAmountsStr;
						 $.ajax({
							type: 'post',
							url :'/agsupport/ya-record-district!saveJson.action',
							data:dataparam,
							dataType : 'json',  
							success : function(data) {
								 if(closePage){
								     parent.layer.msg(data.result);
									 showTabWindow("/awater/nnwaterSystem/EmergenControl/District/main.html?districtUnitId="+data.districtUnitId+"&id="+data.id)			
									 parent.closeNavTab(window.location.href);
								   }
								   else if(id==""){
								      id=data.id;
								      $("#id").val(id);										    
								   }
							},
							error : function(e) {
								alert('error');
							}
						});							  	               
	  	               }
					},
					error : function() {
						alert('error');
					}
				});	
		      
		      }
		    }
		}); 
    } else {		
		var dataparam=getStrParamByArray()+
			"&goodIdsStr="+encodeURIComponent(goodIdsStr)+
			"&teamIdsStr="+encodeURIComponent(teamIdsStr)+
			"&gDispAmountsStr="+encodeURIComponent(gDispAmountsStr)+
			"&tDispAmountsStr="+encodeURIComponent(tDispAmountsStr);
		$.ajax({
			type: 'post',
			url : '/agsupport/ya-record-district!saveJson.action?'+dataparam,
			async:false,
			dataType : 'json',  
			success : function(data) {	
				 if(closePage){
				     parent.layer.msg(data.result);
					 showTabWindow("/awater/nnwaterSystem/EmergenControl/District/main.html?districtUnitId="+data.districtUnitId+"&id="+data.id)			
					 parent.closeNavTab(window.location.href);
				   }
				   else if(id==""){
				      id=data.id;
				      $("#id").val(id);						      
				   }
			},
			error : function(e) {
				alert('error');
			}
		});
	}
}
		
function showTabWindow(url){
	parent.createNewtab(url,"成员单位调度室");	
}

function getStrParamByArray(){
	var param=$("#form").serialize();
	
	//添加机构树状参数
	var treeObj=$.fn.zTree.getZTreeObj("templateSmsReceiver"),
    nodes=treeObj.getCheckedNodes(true),
    checkIds="";
    for(var i=0;i<nodes.length;i++){
		if(checkIds=="")
			checkIds=nodes[i].orgId;
    	else
    		checkIds+= ","+nodes[i].orgId;
    }
    param+="&templateSmsReceiver="+encodeURIComponent(checkIds);
	
    param+="&districtUnitId="+encodeURIComponent(districtUnitId)+"&yaCityId="+encodeURIComponent(yaCityId)+"&status=1";
	
	return param;
}

function cancel() {
	parent.layer.close(parent.layer.getFrameIndex(window.name));
}

function freshSmsBtn() {
	$.ajax({
		type: 'post',
		url : '/agsupport/ya-good-dispatch!loadSmsJsdDispatchRecord.action',
		data : {modelId:template_id},
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