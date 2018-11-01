define(['jquery','layer','dateUtil','areaUtil','bootstrapTable','bootstrapValidator','mousewheel','customScrollbar'],function($,layer,dateUtil,areaUtil){
	function init(_id,index){
		id=_id;                                                                        	
		pIndex=index;
		$("#floodRecordWCSaveBtn").click(save);
    $("#floodRecordWCCancelBtn").click(cancel);
		$("#getContentBtn").click(getContent);
		$('#floodRecordWCInputForm').bootstrapValidator({
			message: 'This value is not valid',
			feedbackIcons: {/*input状态样式图片*/
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {/*验证：规则*/
				recordTitle: {//验证input项：验证规则
					message: 'The recordTitle is not valid',
					validators: {
						notEmpty: {//非空验证：提示消息
							message: '必填项'
						}
					}
				},
				recordContent: {//验证input项：验证规则
					message: 'The recordContent is not valid',
					validators: {
						notEmpty: {//非空验证：提示消息
							message: '必填项'
						}
					}
				}
			}
		});	

		$("#tableTeam").on('post-body.bs.table', function (row,obj) {
			$(".fixed-table-body").mCustomScrollbar({
				mouseWheelPixels:300
			});	
			$('#floodRecordWCInputForm').bootstrapValidator();
		});	 
	}

	var id,pIndex;

	function save(){
		//通过验证再往下执行
		$("#floodRecordWCInputForm").data("bootstrapValidator").validate();
		if(!$("#floodRecordWCInputForm").data("bootstrapValidator").isValid()) {
			return;
		}
		
		if(document.getElementById("isRelease").checked == true) {
			var dataparam=$("#floodRecordWCInputForm").serialize()+"&recordType=2";
		} else {
			var dataparam=$("#floodRecordWCInputForm").serialize() + "&isRelease=0" +"&recordType=2";
		}
		
		$.ajax({
			type: 'post',
			url : '/psemgy/floodRecord/saveWCJson',
			data: dataparam,
			dataType : 'json',
			success : function(data) {
				layer.msg(data.result);
				layer.close(pIndex);
				$("#floodRecordListTable").bootstrapTable('refresh');
			},
			error : function() {
				layer.msg("操作失败");
			}
		});
	}

	function cancel() {
		layer.close(pIndex);
	}

	function getAreaName(code) {
		for(var i=0; i<areaUtil.xzArea.length; i++) {
			if(areaUtil.xzArea[i].code == code)
				return areaUtil.xzArea[i].name;
		}
	}

	//自动生成内容
	function getContent() {
		$.ajax({
			type: 'post',
			url : '/psfacility/pscomb/forGetContent',
			data: {estType:33},
			dataType : 'json',
			cache:false,
			success : function(data) {
				if(data.result.length >0) {
					var content = "";
					content += "时间：" + dateUtil.getCNLocalTime(data.nowTime.time) + ",";
					for(var i=0; i<data.result.length; i++) {
						if(i > 0)
							content += ",";
						content += "在" + getAreaName(data.result[i].area) + data.result[i].comb_name + "有积水,积水深度为" + data.result[i].jsddeep + "米"
					}
					content = content.substring(0, content.lastIndexOf(",")) + "。";
					$("#recordContent").val(content);
					$("#recordTitle").val(dateUtil.dateUtil.getCNLocalTime(data.nowTime.time) + "涝情发布");
				} else {
					layer.msg("暂无积水点报警信息");
				}
			},
			error : function() {
				layer.msg("获取积水点信息失败");
			}
		});
	}

	return{ 
		init: init
	}
});	