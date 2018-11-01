define(['jquery','layer','bootstrap','bootstrapTable','bootstrapTableCN','bootstrapDatetimepicker','bootstrapDatetimepickerCN'],function($,layer,bootstrap,bootstrapTable,bootstrapTableCN,bootstrapDatetimepicker,bootstrapDatetimepickerCN){

	var id,layerIndex;
	//判断短信模板是否唯一   保存/修改
	function saveAjaxSmsSame(){
		if(id&&id!=''){
			save();
		}else{
			var datapara = {
				templateUnitCode : $("#templateUnitCode").val(),
				alarmType : $("#alarmType").val(),
			}
			$.ajax({
				method : 'post',
				url : '/psemgy/yaTemplateSms/getSmsSame',
				data : datapara,
				dataType : 'json',
				success : function(data){
					if(data.total>0){
						layer.msg("已有模板", {icon: 0,time: 1000});
					}else
						save();
				},error : function(){
					layer.msg("加载失败", {icon: 2,time: 1000});
				}
			});
		}	
	}
	function save(){
		var dataparam=$("#smsMessageForm").serializeArray();
			var obj=new Object();
			obj.name="templateGrade";
			obj.value=$("#templateUnitCode").find("option:selected").attr("orgType");
			if(obj.value==3) obj.value=2;
			dataparam.push(obj);
		    $.ajax({
				type: 'post',
				url : '/psemgy/yaTemplateSms/doSave',
				data:dataparam,
				dataType : 'json',  
				success : function(data) {
					layer.msg(data.result);
					require(['eims/facility/message/js/messageTemplate'],function(messageTemplate){
						messageTemplate.closeLayer();
					});
					// parent.refreshTable();
					// layer.close(layer.getFrameIndex(window.name));
				},
				error : function(e) {
					layer.msg("操作失败", {icon: 2,time: 1000});
				}
			});
	}

	/**加载数据*/
	function area(){
		var url ='/psemgy/yaTemplateSms/toUpdate';
			if(id&&id!=''){
				url+="?id="+id;
				$.ajax({
					method : 'GET',
					url :url,
					async : true,
					dataType : 'json',
					success : function(data) {
						for (var key in data.form){
							$("#"+key).val(data.form[key]);
						}
						var str = data.form.templateCreateTime;
						$("#templateCreateTime").val(toDate(str));
						$("#templateUnitCode").val(data.form.templateUnitCode);
					},
					error : function() {
						layer.msg("获取区域数据失败", {icon: 2,time: 1000});
					}
				});
			}
	}

	function cancel(){
		layer.close(layerIndex);
	}

	//设置日期空间
	function creatDatetimepicker(){
		$('#templateCreateTime').datetimepicker({
			language:  'zh-CN',
			weekStart: 1,
			todayBtn:  1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			minView: 2,
			forceParse: 0,
			format:'yyyy-mm-dd'
		});
	}
	//格式化日期
	function toDate(obj){  
		var date = new Date();  
		date.setTime(obj.time);  
		date.setHours(obj.hours);  
		date.setMinutes(obj.minutes);  
		date.setSeconds(obj.seconds);  
		return date.pattern("yyyy-MM-dd");
	}

	function initBtn(){
		$("#smsInputSaveBtn").click(saveAjaxSmsSame);
		$("#smsInputCancelBtn").click(cancel);
	}
	function init(_id,_index){
		id=_id;
		layerIndex=_index;
		//初始化点击事件
		initBtn();
		//初始化日期控件
		creatDatetimepicker();
		//初始化区域下拉框
		$.ajax({
			type: 'get',
			url : '/psemgy/yaTemplateSms/getArea',
			async : true,
			dataType : 'json',  
			success : function(data) {
				debugger;
				$.each(eval(data.rows), function(){
					$("<option/>").val(this.ORG_ID).text(this.ORG_NAME).attr("orgType",this.ORG_TYPE).appendTo("#templateUnitCode");
				});
				$.each(eval(data.smsList), function(){
					$("<option/>").val(this.itemCode).text(this.itemName).appendTo("#alarmType");
				});
				area(); //加载数据
			},
			error : function(e) {
				layer.msg("所属区域初始化失败!", {icon: 2,time: 1000});
				area(); //加载数据
			}
		});	
	};
	return{
	  init:init
	}
})
