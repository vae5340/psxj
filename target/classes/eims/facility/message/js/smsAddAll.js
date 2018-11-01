define(['jquery','layer','bootstrap','bootstrapTable','bootstrapTableCN'],function($,layer,bootstrap,bootstrapTable,bootstrapTableCN){

	var layerIndex;

	function cancel(){
		layer.close(layerIndex);
	}

	function addAll(){
		var dateparms=$("#smsMessageForm").serializeArray();
		$.ajax({
			method : 'POST',
			url : '/psemgy/yaTemplateSms/toAddAll',
			data : dateparms,
			dataType : 'json',
			success : function(data){
				
				layer.msg(data.rows);
				require(['eims/facility/message/js/messageTemplate'],function(messageTemplate){
					messageTemplate.closeLayer();
				});
				// parent.refreshTable();
				// layer.close(layer.getFrameIndex(window.name));
			},
			error : function(){
			}
		});
	}

	function initBtn(){	
		$("#smsAddAllSaveBtn").click(addAll);
		$("#smsAddAllCannelBtn").click(cancel);
	}
	function init(_index){
		layerIndex=_index;
		//初始化点击事件
		initBtn();
		//初始化区域下拉框
		$.ajax({
			type: 'get',
			url : '/psemgy/yaTemplateSms/getArea',
			async : true,
			dataType : 'json',  
			success : function(data) {
				$.each(eval(data.smsList), function(){
					$("<option/>").val(this.itemCode).text(this.itemName).appendTo("#alarmType");
				});
			},
			error : function(e) {
				layer.msg("所属区域初始化失败!", {icon: 2,time: 1000});
			}
		});	
	};

	return{
	  init:init
	}
})
