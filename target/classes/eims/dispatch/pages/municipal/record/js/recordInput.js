define(['jquery','dateUtil','layer','awaterui','zTree','zTreeExcheck','mousewheel','customScrollbar','bootstrapDatetimepicker','bootstrapDatetimepickerCN'],function($,dateUtil,layer,awaterui){
		var yaCityId;
		var showStart;
		var layerIndex;
    function init(yaId,_showStat,index){
		yaCityId=yaId;
		showStart=_showStat;
		layerIndex=index;
		if(!showStart){
			$("#recordInput_startBtn").hide();	            
		}
		if(!yaCityId)
		     searchSms(11);
        $("#recordInput_startBtn").click(start);
		$("#recordInput_cancelBtn").click(cancel);
    
		$.ajax({
			method : 'GET',
			url : '/psemgy/yaRecordCity/inputJson?id='+yaCityId,
			async : true,
			dataType : 'json',
			success : function(data) {
				var dictionary=data.Dict;
				for (itemname in dictionary){
					for (num in dictionary[itemname]){
						var selText="";
						if(dictionary[itemname][num].itemCode==data.form[itemname])
							selText="selected='true'";
						$("#recordInput_"+itemname).append("<option value='"+dictionary[itemname][num].itemCode+"' "+selText+">"+dictionary[itemname][num].itemName+"</option>");
					}
				}
				
				var orgTree = data.Tbmap["orgTable"];
				$.fn.zTree.init($("#recordInput_templateSmsReceiver"), setting,orgTree);
				
				var dsblNodes = $.fn.zTree.getZTreeObj("recordInput_templateSmsReceiver").getNodesByParam("chkDisabled", false);
				for (var i=0, l=dsblNodes.length; i < l; i++) {
					// 禁用状态
					$.fn.zTree.getZTreeObj("recordInput_templateSmsReceiver").setChkDisabled(dsblNodes[i], true);
				}
				for (var key in data.form){
					if(key.toLowerCase().indexOf("id")!=-1)
						$("#recordInput_templateId").val(data.form[key]);
					else if(key.toLowerCase().indexOf("time")!=-1&&data.form[key]!=null)
						$("#recordInput_"+key).val(dateUtil.getLocalTime(data.form[key]));
					else if(key=="templateSmsReceiver"){
						var strArray=data.form[key].split(",");
						var zTree = $.fn.zTree.getZTreeObj("recordInput_templateSmsReceiver");
						for(var i=0;i<strArray.length;i++){
							var node = zTree.getNodeByParam("orgId",strArray[i]);
							if(node!=null){
								node.checked = true;
								zTree.updateNode(node);
							}
						}
					} 
					else
						$("#recordInput_"+key).val(data.form[key]);
				}
			},
			error : function() {
				alert('error');
			}
		});

		//$(window).load(function(){
			$("#recordInput").mCustomScrollbar();
			$("#recordInput_templateCreateTime").datetimepicker({
				language: 'zh-CN',
				format: 'yyyy-mm-dd hh:ii:ss',
				autoclose:true,
				pickerPosition:'top-right'
			});
		//});
	}
   

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

	function setmeteoHydrologAlarmTb(cityYaId,id){
		$.ajax({
			type: 'post',
			url : '/psemgy/meteoHydrologAlarm/updateSatus',
			data:{"id":id,"cityYaId":cityYaId},
			dataType : 'json',  
			success : function(data) {},
			error : function() {
				alert('error');
			}
		});
	}
			
	function start(){	
		$.get("/psemgy/eims/dispatch/pages/district/template/templateAlarmList.html",function(h){
			var index=layer.open({
				type: 1,
				title: '选择启动应急预警模板',
				shadeClose: false,
				shade: 0,
				maxmin: true,
				area: ['700px', '400px'],
				content: h,
				success: function(layero, index){
					require(["psemgy/eims/dispatch/pages/district/template/js/templateAlarmList"],function(templateAlarmList){
            			templateAlarmList.init(yaCityId,index);
					});
				}  						 
			}); 	
			layer.close(layerIndex);
		});				
	}
			
	function cancel(){
		if(layerIndex)
		   layer.close(layerIndex);
		else
			awaterui.closeTab();
	}
			
	function searchSms(value){
		var dataparms={alarmType : value};
		$.ajax({
			type: 'post',
			url : '/psemgy/yaTemplateSms/listSmsMessageAjax',
			data : dataparms,
			dataType : 'json',
			success : function(data){
				$.each(eval(data.rows), function(){
					//$("#recordInput_templateSms").val(this.TEMPLATE_CONTET);
					this.TEMPLATE_CONTET? $("#recordInput_templateSms").val(this.TEMPLATE_CONTET) : $("#recordInput_templateSms").val("");
				});
			},
			error : function(){
			}
		});
	}

	return{
		init: init
	}
});
