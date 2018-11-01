define(['jquery','layer','dateUtil','bootstrapTable','bootstrapTableCN','bootstrapDatetimepicker','bootstrapDatetimepickerCN','zTree','mousewheel','customScrollbar'],function($,layer,dateUtil,bootstrapTable,bootstrapTableCN,bootstrapDatetimepicker,bootstrapDatetimepickerCN,zTree,mousewheel,customScrollbar){
var id;
var layerIndex;

//短信内容加载
	function searchArea(){		
		$("#templatems").change(function(){
			//$("#templateAlarm").hide();
			$("#smsId").html("");
			var dataparam = {alarmType:$("#templatems").val()};
			$.ajax({
				type: 'post',
				url : '/psemgy/yaTemplateSms/getAlarmTypeSms',
				data:dataparam,
				dataType : 'json',
				success : function(data){
					$.each(eval(data.rows), function(){
						$("#templateSmsId").val(this.ID);
						$("#smsId").html(this.TEMPLATE_CONTET);
					});
				},error : {
				}
			});
		});
	}


	var setting = {
		check: {
			enable: true,
			chkStyle : "checkbox",
			chkboxType: { "Y": "s", "N": "s" },
		},
		data: {
			key: {
				name: "orgName"
			},
			simpleData: {
				enable: true,
				idKey: "orgId",
				pIdKey: "parentOrgId",
				rootPId: 0
			}
		}
	};
	function ajaxJsonTemplate(){
  	if(id==""){
    	$.ajax({
				method : 'GET',
				url : '/psemgy/yaTemplateCity/inputJson',
				async : true,
				dataType : 'json',
				success : function(data) {
				    var dictionary=data.Dict;
					for (itemname in dictionary){
						for (num in dictionary[itemname]){
							$("#"+itemname).append("<option value='"+dictionary[itemname][num].itemCode+"'>"+dictionary[itemname][num].itemName+"</option>");
						}
					}
					var smsList = data.Tbmap["smsList"];
					for(sms in smsList){
						$("<option/>").val(smsList[sms].itemCode).text(smsList[sms].itemName).appendTo("#templatems");
					}
					var gradeList = data.Tbmap["gradeList"];
					for(grad in gradeList){
						$("<option/>").val(smsList[sms].itemCode).text(gradeList[grad].itemName).appendTo("#grade");
					}
					var orgTree = data.Tbmap["orgTable"];
					$.fn.zTree.init($("#templateSmsReceiver"), setting,orgTree);
					var dsblNodes = $.fn.zTree.getZTreeObj("templateSmsReceiver").getNodesByParam("chkDisabled", false);
					for (var i=0, l=dsblNodes.length; i < l; i++) {
						//console.log(i);
					    // 禁用状态
					    $.fn.zTree.getZTreeObj("templateSmsReceiver").setChkDisabled(dsblNodes[i], true);
					}
				},
				error : function() {
					alert('error');
				}
			});
    } else {
    	$("#smsId").hide();
	    $.ajax({
				method : 'GET',
				url : '/psemgy/yjSmsRecord/inputJson?id='+id,
				async : true,
				dataType : 'json',
				success : function(data) {
					var orgTree = data.Tbmap["orgTable"];
					var person = data.Tbmap["person"];
					$("#personName").val(person);
					$.fn.zTree.init($("#templateSmsReceiver"), setting,orgTree);
					for (var key in data.form){
						if(key=="receivePerson"){
							var strArray=data.form[key].split(",");
							var zTree = $.fn.zTree.getZTreeObj("templateSmsReceiver");
							for(var i=0;i<strArray.length;i++){
								var node = zTree.getNodeByParam("orgId",strArray[i]);
								if(!node) break;
								node.checked = true;
								zTree.updateNode(node);
							}
						}
						if(key in data.form){
							if(key=="alarmType"){
								var alType=data.form.alarmType;
								if(alType==1) $("#alarmTypeArea").val("市级预案短信");
								else if(alType==2) $("#alarmTypeArea").val("成员单位预案短信");
								else if(alType==3) $("#alarmTypeArea").val("督办短信");
								else if(alType==4) $("#alarmTypeArea").val("抢险队通知短信");
								else 
									$("#alarmTypeArea").val("短信调度");
							}else if(key == "peopleSendError"){
								$("#peopleSendError").val(data.form.peopleSendError);
							}else	
								$("#"+key).val(data.form[key]);
						}
					}
				},
				error : function() {
					alert('error');
				}
			});
		}
  }

	function getStrParamByArray(array){
		var param="";
		for (pitem in array){
			if(param!=""){
				if(array[pitem].name.toLowerCase().indexOf("time")!=-1){
					param+="&"+array[pitem].name+"="+getTimeLong(array[pitem].value);
				} else
					param+="&"+array[pitem].name+"="+encodeURIComponent(array[pitem].value);
			}
			else{
				if(array[pitem].name.toLowerCase().indexOf("time")!=-1){
					param=array[pitem].name+"="+getTimeLong(array[pitem].value);
				} else
					param=array[pitem].name+"="+encodeURIComponent(array[pitem].value);
			}
		}
		
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
          
		return param;
	}
		//关闭
	function cancel() {
		layer.close(layerIndex);
	}
		
   //初始化点击事件
	function initBtn(){
		$("#distictSmsDetailCancelBtn").click(cancel);
	}

	function init(_id,_index){
		id=_id;
		layerIndex=_index;
		initBtn();
	  // 加载下拉框
	  searchArea();
	  ajaxJsonTemplate();
	  $("#distictSmsDetail_content").mCustomScrollbar();
	};

	return{
		init:init
	}
});


	 	

	 
	    
    


