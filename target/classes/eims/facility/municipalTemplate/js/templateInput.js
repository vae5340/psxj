define(['jquery','layer','dateUtil','bootstrap','bootstrapTable','bootstrapTableCN','bootstrapDatetimepicker','bootstrapDatetimepickerCN','zTree','dateUtil'],function($,layer,dateUtil,bootstrap,bootstrapTable,bootstrapTableCN,bootstrapDatetimepicker,bootstrapDatetimepickerCN,zTree,dateUtil){
	var id,layerIndex;

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

	function ajaxJsonTemplate(){
		if(!id||id==''){
			$.ajax({
				method : 'GET',
				url : '/psemgy/yaTemplateCity/inputJson',
				async : true,
				dataType : 'json',
				success : function(data) {
					searchSms(11); // 加载启动预警短信
					var dictionary=data.Dict;
					for (itemname in dictionary){//itemname in dictionary
						for (var num = 0; num < dictionary[itemname].length;num++){//num in dictionary[itemname]
							$("#templateInput #"+itemname).append("<option value='"+dictionary[itemname][num].itemCode+"'>"+dictionary[itemname][num].itemName+"</option>");
						}
					}
					var orgTree = data.Tbmap["orgTable"];
					$.fn.zTree.init($("#templateInput #templateSmsReceiver"), setting,orgTree);
					
				},
				error : function() {
					layer.msg('数据加载失败', {icon: 2,time: 1000});
				}
			});
		} else {
			$.ajax({
				method : 'GET',
				url : '/psemgy/yaTemplateCity/inputJson?id='+id,
				async : true,
				dataType : 'json',
				success : function(data) {
					var dictionary=data.Dict;
					for (itemname in dictionary){//itemname in dictionary
						for (var num = 0; num < dictionary[itemname].length;num++){//num in dictionary[itemname]
							var selText="";
							if(dictionary[itemname][num].itemCode==data.form[itemname])
								selText="selected='true'";
							$("#templateInput #"+itemname).append("<option value='"+dictionary[itemname][num].itemCode+"' "+selText+">"+dictionary[itemname][num].itemName+"</option>");
						}
					}
					var orgTree = data.Tbmap["orgTable"];
					$.fn.zTree.init($("#templateInput #templateSmsReceiver"), setting,orgTree);
					for (var key in data.form){
						if(key.toLowerCase().indexOf("time")!=-1&&data.form[key])
							$("#templateInput #"+key).val(dateUtil.getLocalTime(data.form[key].time));
						else if(key=="templateSmsReceiver"){
							if(!data.form[key])
								continue;
							var strArray=data.form[key].split(",");
							var zTree = $.fn.zTree.getZTreeObj("templateSmsReceiver");
							for(var i=0;i<strArray.length;i++){
								var node = zTree.getNodeByParam("orgId",strArray[i]);
								node.checked = true;
								zTree.updateNode(node);
							}
						}else if(key=="templateSms"){
							searchSms(11);
						}else
						$("#templateInput #"+key).val(data.form[key]);
					}
				},
				error : function() {
					layer.msg('数据加载失败', {icon: 2,time: 1000});
				}
			});
		}
	}

	function save(){
		var dataparam=getStrParamByArray($("#templateInput #form").serializeArray());
		$.ajax({
			type: 'post',
			url : '/psemgy/yaTemplateCity/saveJson',
			data:dataparam,
			dataType : 'json',  
			success : function(data) {
				layer.msg(data.result);
				layer.close(layerIndex);
			},
			error : function() {
				layer.msg('数据加载失败', {icon: 2,time: 1000});
			}
		});
	}
	function getStrParamByArray(array){
		var param="";
		for (var pitem=0; pitem<array.length;pitem++){
			if(param!=""){
				if(array[pitem].name.toLowerCase().indexOf("time")!=-1){
					param+="&"+array[pitem].name+"="+dateUtil.getTimeLong(array[pitem].value);
				} else
				param+="&"+array[pitem].name+"="+encodeURIComponent(array[pitem].value);
			}
			else{
				if(array[pitem].name.toLowerCase().indexOf("time")!=-1){
					param=array[pitem].name+"="+dateUtil.getTimeLong(array[pitem].value);
				} else
				param=array[pitem].name+"="+encodeURIComponent(array[pitem].value);
			}
		}
		
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
		param+="&templateSmsReceiver="+encodeURIComponent(checkIds);
		return param;
	}

	function cancel() {
		layer.close(layerIndex);
	}

	function searchSms(value){
		var dataparms={
			alarmType : value,
		};
		$.ajax({
			type: 'post',
			url : '/psemgy/yaTemplateSms/listSmsMessageAjax',
			data : dataparms,
			dataType : 'json',
			success : function(data){
				$.each(eval(data.rows), function(){
					//$("#templateInput #templateSms").val(this.TEMPLATE_CONTET);
					this.TEMPLATE_CONTET? $("#templateInput #templateSms").val(this.TEMPLATE_CONTET) : $("#templateInput #templateSms").val("");
				});
			},
			error : function(){
			}
		});
	}

	function initBtn(){
		$('#templateInputSaveBtn').click(save);
		$('#templateInputCancelBtn').click(cancel);
		$("#templateInput #templateCreateTime").datetimepicker({
			language: 'zh-CN',
			format: 'yyyy-mm-dd hh:ii:ss',
			autoclose:true,
			pickerPosition:'top-right'
		});
	}
	function init(_id,_layerIndex){
		id=_id;
		layerIndex=_layerIndex;
		initBtn();
		ajaxJsonTemplate();
	};
	return{
	  init:init
	}
})

