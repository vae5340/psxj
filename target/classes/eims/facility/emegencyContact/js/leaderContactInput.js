define(['jquery','layer','customScrollbar','bootstrapValidator','bootstrapValidatorCN'],function($,layer){

	var id,layerIndex;

	function save(){	
		var data =$("#leaderContactInput #form").data('bootstrapValidator');
		if (data) {
		    //修复记忆的组件不验证
			data.validate();
	
			if (!data.isValid()) {
				return false;
			}
		}

		$.ajax({
			type: 'post',
			url : '/psemgy/yjLeaderContact/saveJson',
			data:$("#leaderContactInput #form").serialize(),
			dataType : 'json',  
			success : function(data) {
				layer.msg(data.result);
				// parent.reloadDataLC();
				// var index = layer.getFrameIndex(window.name);
				$("#leader_contact").bootstrapTable('refresh');
				layer.close(layerIndex);
			},
			error : function() {
				layer.msg('数据新增失败', {icon: 2,time: 1000});
			}
		});
	}


	function cancel() {
		layer.close(layerIndex);
	}

	function initBtn(){
		$('#leaderContactInputSaveBtn').click(save);
		$('#leaderContactInputCancelBtn').click(cancel);
	}  

	function loadData(){
		$.ajax({
			method : 'GET',
			url : '/psemgy/yjLeaderContact/inputJson?id='+id,
			async : true,
			dataType : 'json',
			success : function(data) {
				for (var key in data.form)
					$("#"+key).val(data.form[key]);
			},
			error : function() {
				layer.msg('数据加载失败', {icon: 2,time: 1000});
			}
		});
	}
	function init(_id,_layerIndex){
		id=_id;
		layerIndex=_layerIndex;

		$("#leaderContactInput").mCustomScrollbar();

		$("#leaderContactInput #form").bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                name: {
                    validators: {
                        notEmpty: {
                            message: '姓名不能为空!'
                        }
                    }
                },
                unit: {
                    validators: {
                        notEmpty: {
                            message: '单位不能为空!'
                        }
                    }
				},
				telNum: {
                    validators: {
                        notEmpty: {
                            message: '联系电话不能为空!'
                        }
                    }
                }
            }
		});

		initBtn();
		if(id&&id!=''){
	    	loadData()
		}
	};
	return{
	  init:init,
	}
	
})
