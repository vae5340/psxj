define(['jquery','layer','dateUtil','bootstrapTable','bootstrapValidator'],function($,layer,dateUtil){
	function init(_id,index){
		id=_id;                                                                        	
		pIndex=index;
		$("#floodRecordWCViewSaveBtn").click(save);
	    $("#floodRecordWCViewCancelBtn").click(cancel);

		if(id!=""){ 
			$.ajax({
				method : 'GET',
				url : '/psemgy/floodRecord/inputJson?id='+id,
				async : true,
				dataType : 'json',
				success : function(data) {
					//填充表单内容 
					for (var key in data){
						$("#"+key).val(data[key]);
					}
					if(data.isRelease==1)
						document.getElementById("isRelease").checked = true;
						
				},
				error : function(error) {
					console.log(error);
				}
			});			
		}

		$('#floodRecordWCViewForm').bootstrapValidator({
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
			$('#floodRecordWCViewForm').bootstrapValidator();
		});
		
	}

	
	var id,pIndex;

	function save(){
		//通过验证再往下执行
		$("#floodRecordWCViewForm").data("bootstrapValidator").validate();
		if(!$("#floodRecordWCViewForm").data("bootstrapValidator").isValid()) {
			return;
		}

		var isRelease;
		if(document.getElementById("isRelease").checked == true) {
			isRelease = 1;
		} else
			isRelease = 0;
		$.ajax({
			type: 'post',
			url : '/psemgy/floodRecord/saveOneJson',
			data: {id:$("#id").val(),recordTitle:$("#recordTitle").val(),recordContent:$("#recordContent").val(),isRelease:isRelease},
			dataType : 'json',
			success : function(data) {
				layer.msg(data.result);
				layer.close(pIndex);
			},
			error : function() {
				layer.msg("操作失败");
			}
		});
	}
	function cancel() {
		layer.close(pIndex);
	}
	
	return{ 
		init: init
	}
});
