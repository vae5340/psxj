
define(['jquery','layer','awaterui','dateUtil','areaUtil','bootstrap','bootstrapTable','bootstrapTableCN','bootstrapValidator','bootstrapValidatorCN','bootstrapDatetimepicker','bootstrapDatetimepickerCN'],function($,layer,awaterui,dateUtil,areaUtil){

	var template_id,meteoHydrologAlarmId,pIndex;

	var setting = {
		check: {
			enable: true,
			chkStyle : "checkbox",
			chkboxType: { "Y": "s", "N": "s" }
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
			
    function init(_template_id,_meteoHydrologAlarmId,index){
		template_id = _template_id;
		meteoHydrologAlarmId = _meteoHydrologAlarmId;

		$("#cityRecordAlarmInput #checkAndSaveBtn").click(checkAndSave);
		$("#cityRecordAlarmInput #cancelBtn").click(cancel);

		pIndex = index;
		if(!template_id)
			searchSms(11);

		ajaxJsonTemplate();

		$("#cityRecordAlarmInput #content").mCustomScrollbar();
		$("#cityRecordAlarmInput #templateCreateTime").datetimepicker({
			language: 'zh-CN',
			format: 'yyyy-mm-dd hh:ii:ss',
			autoclose:true,
			pickerPosition:'top-right'
		});
	}

	//加载信息
	function ajaxJsonTemplate(){
		$.ajax({
			method : 'GET',
			url : '/psemgy/yaTemplateCity/inputJson?id='+template_id,
			async : true,
			dataType : 'json',
			success : function(data) {
				var dictionary=data.Dict;
				for (itemname in dictionary){
					for (num in dictionary[itemname]){
						var selText="";
						if(dictionary[itemname][num].itemCode==data.form[itemname])
							selText="selected='true'";
						$("#cityRecordAlarmInput #"+itemname).append("<option value='"+dictionary[itemname][num].itemCode+"' "+selText+">"+dictionary[itemname][num].itemName+"</option>");
					}
				}
				
				var orgTree = data.Tbmap["orgTable"];
				$.fn.zTree.init($("#cityRecordAlarmInput #templateSmsReceiver"), setting,orgTree);
				//$.fn.zTree.init($("#recordNoteDistrict"), setting,orgTree);
				
				for (var key in data.form){
					if(key.toLowerCase().indexOf("id")!=-1)
						$("#cityRecordAlarmInput #templateId").val(data.form[key]);
					else if(key.toLowerCase().indexOf("time")!=-1)
						$("#cityRecordAlarmInput #"+key).val(dateUtil.getLocalTime(data.form[key].time));
					/*else if(key=="recordNoteDistrict"){
						var strArray=data.form[key].split(",");
						var zTree = $.fn.zTree.getZTreeObj("recordNoteDistrict");
						for(var i=0;i<strArray.length;i++){
							var node = zTree.getNodeByParam("orgId",strArray[i]);
							if(node!=null){
								node.checked = true;
								zTree.updateNode(node);
							}
						}
					}*/ 
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
					$("#cityRecordAlarmInput #"+key).val(data.form[key]);
				}
			},
			error : function() {
				layer.msg('error');
			}
		});
	}
	function checkAndSave(){
		$.ajax({  
			url: "/psemgy/yaRecordCity/checkStatus",
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
		var dataparam=getStrParamByArray($("#cityRecordAlarmInput #form").serializeArray());
		$.ajax({
			type: 'post',
			url : '/psemgy/yaRecordCity/saveJson',
			data: dataparam,
			dataType : 'json',  
			success : function(data) {
				layer.msg(data.result);
				if(data.status=="200"){
					awaterui.createNewtab("/psemgy/eims/dispatch/pages/municipal/supervise/supervise.html","市级调度",function(){
						require(['psemgy/eims/dispatch/pages/municipal/supervise/js/supervise'],function(supervise){
							supervise.init(data.record_id);
						})
					});								
				}
				layer.close(pIndex);
			},
			error : function(){
				layer.msg('启动预案失败');
			}
		});
	}

	function getStrParamByArray(array){
		var param="";
		for (pitem in array){
			if(param!=""){
				if(array[pitem].name.toLowerCase().indexOf("time")!=-1){
					param+="&"+array[pitem].name+"="+encodeURIComponent(dateUtil.getTimeLong(array[pitem].value));
				} else
					param+="&"+array[pitem].name+"="+encodeURIComponent(array[pitem].value);
			}
			else{
				if(array[pitem].name.toLowerCase().indexOf("time")!=-1){
					param=array[pitem].name+"="+encodeURIComponent(dateUtil.getTimeLong(array[pitem].value));
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
		//param+="&recordNoteDistrict="+encodeURIComponent(checkIds);
		param+="&meteoHydrologAlarmId="+meteoHydrologAlarmId;
		return param;
	}
			
	function cancel(){
		layer.close(pIndex);
	}
	//加载启动响应的短信模板
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
					this.TEMPLATE_CONTET? $("#templateSms").val(this.TEMPLATE_CONTET) : $("#templateSms").val("");
				});
				searchWeather();
			},
			error : function(){
			}
		});
	}
	// 加载预警信息的气象发布时间信息
	function searchWeather(){
		var meid = meteoHydrologAlarmId
		if(meid)
			$.ajax({
				type: 'get',
				url:'/psemgy/meteoHydrologAlarm/inputJson?id='+meid,
				dataType : 'json',
				success : function(data){
					var alarmName=$("#cityRecordAlarmInput #templateName").val().replace('级应急响应','');
					var title=data.form.alarmTitle.replace('预警','');
					var altime=new Date(data.form.alarmTime.time).FormatNew("yyyy年MM月dd日hh时mm分");
					var content=data.form.alarmContent;
					var newTime=new Date().FormatNew("yyyy年MM月dd日hh时mm分");
					
					//得到短信模板变量
					var smsVal=$("#cityRecordAlarmInput #templateSms").val();
					var r= /\{(.+?)\}/g;
					var res = smsVal.match(r);
					for(var key=0;key<res.length;key++){
						if(res[key].indexOf('{alarmTime}')>-1) smsVal=smsVal.replace('$'+res[key],altime.toString().split('年')[1]);
						if(res[key].indexOf('{time}')>-1) smsVal=smsVal.replace('$'+res[key],newTime.toString().split('年')[1]);
						if(res[key].indexOf('{alarm}')>-1) smsVal=smsVal.replace('$'+res[key],title);
						if(res[key].indexOf('{grade}')>-1) smsVal=smsVal.replace('$'+res[key],alarmName);
					}
					$("#cityRecordAlarmInput #templateSms").val(smsVal);
				},error:function(){}
			});
	}

	return { 
		init: init
	}
});