
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2]);
	}
	return null;
}

(function ($) {
	$(window).load(function () {
		$("#assessmentStart").datepicker({
			language:"zh-CN", 
			format:"yyyy-mm-dd", 
			autoclose:true, 
			pickerPosition:"bottom-right"
		}).on('hide',function(e) {  
        	$('#hiddenPointForm').data('bootstrapValidator')  
            .updateStatus('assessmentStart', 'NOT_VALIDATED',null)  
            .validateField('assessmentStart');  
        });
		$("#assessmentEnd").datepicker({
			language:"zh-CN", 
			format:"yyyy-mm-dd", 
			autoclose:true, 
			pickerPosition:"bottom-right"
		}).on('hide',function(e) {  
        	$('#hiddenPointForm').data('bootstrapValidator')  
            .updateStatus('assessmentEnd', 'NOT_VALIDATED',null)  
            .validateField('assessmentEnd');  
        });
	    $(".table").find("tbody tr td").each(function(){
		     $(this).css("vertical-align","middle");
		});		
		$("#content").mCustomScrollbar();
		
		
		//$(".form-group input.form-control").data("bvRegexp","true");
		//$(".form-group input.form-control").data("bvRegexpRegexp","[a-zA-Z0-9_\.]+");	
	     //$(".form-group input.form-control").attr("data-bv-regexp","true");
		 //$(".form-group input.form-control").attr("data-bv-regexp-regexp","[a-zA-Z0-9_\.]+");
	    $('#hiddenPointForm').bootstrapValidator();
	
		/*$('#hiddenPointForm').bootstrapValidator({
	        message: '',
	        feedbackIcons: {
	            valid: 'glyphicon glyphicon-ok',
	            invalid: 'glyphicon glyphicon-remove',
	            validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	            subjectUnit: {
	                validators: {
	                    notEmpty: {
	                        message: '受检单位不能为空'
	                    }
	                }
	            },
	            assessmentor: {
	                validators: {
	                    notEmpty: {
	                        message: '考评人不能为空'
	                    }
	                }
	            },
	            assessmentStart: {
	                validators: {
	                    notEmpty: {
	                        message: '检查开始时间不能为空'
	                    }
	                }
	            },
	            assessmentEnd: {
	                validators: {
	                    notEmpty: {
	                        message: '检查结束时间不能为空'
	                    }
	                }
	            }
	        }
	    });*/
	});
	
	var id = GetQueryString("id");
	
	//如果地址中包含id，则是修改数据
	if (id != null) {
		$.ajax({url:"/agsupport/sz-assessmentsocial!getById.action?id=" + id, dataType:"json", success:function (res) {
			console.log(res["rows"]);
			var r = res["rows"];

			//受检单位
			if (r.subjectUnit != "" && r.subjectUnit != null) {
				$("#subjectUnit").val(r.subjectUnit);
			}
			//考评人员
			if (r.assessmentor != "" && r.assessmentor != null) {
				$("#assessmentor").val(r.assessmentor);
			}
			//总分
			if (r.totalScore != "" && r.totalScore != null) {
				$("#totalScore").val(r.totalScore);
			}
			//检查时间
			if (r.assessmentStart != "" && r.assessmentStart != null) {
				$("#assessmentStart").datepicker("setDate", getLocalTime(r.assessmentStart));//设置
			}	
			//检查时间
			if (r.assessmentEnd != "" && r.assessmentEnd != null) {
				$("#assessmentEnd").datepicker("setDate", getLocalTime(r.assessmentEnd));//设置
			}
			/************/
			if (r.yjsjclScore != "" && r.yjsjclScore != null) {
				$("#yjsjclScore").val(r.yjsjclScore);
				$("#yjsjclScoreDeduct").val($("#yjsjcl").val()-$("#yjsjclScore").val())
			}
			if (r.gltsclScore != "" && r.gltsclScore != null) {
				$("#gltsclScore").val(r.gltsclScore);
				$("#gltsclScoreDeduct").val($("#gltscl").val()-$("#gltsclScore").val())
			}
			if (r.zdhdphScore != "" && r.zdhdphScore != null) {
				$("#zdhdphScore").val(r.zdhdphScore);
				$("#zdhdphScoreDeduct").val($("#zdhdph").val()-$("#zdhdphScore").val())
			}
			if (r.mtylqkScore != "" && r.mtylqkScore != null) {
				$("#mtylqkScore").val(r.mtylqkScore);
				$("#mtylqkScoreDeduct").val($("#mtylqk").val()-$("#mtylqkScore").val())
			}
			if (r.pqwtclScore != "" && r.pqwtclScore != null) {
				$("#pqwtclScore").val(r.pqwtclScore);
				$("#pqwtclScoreDeduct").val($("#pqwtcl").val()-$("#pqwtclScore").val())
			}
			if (r.fxwtScore != "" && r.fxwtScore != null) {
				$("#fxwtScore").val(r.fxwtScore);
				$("#fxwtScoreDeduct").val($("#fxwt").val()-$("#fxwtScore").val())
			}
			if (r.pswcqkScore != "" && r.pswcqkScore != null) {
				$("#pswcqkScore").val(r.pswcqkScore);
				$("#pswcqkScoreDeduct").val($("#pswcqk").val()-$("#pswcqkScore").val())
			}
			/************/
			$("#assessmentSocialId").val(r.assessmentSocialId);
			$("#districtUnitId").val(r.districtUnitId);
		}, error:function (XHR, error, errorThrown) {
			console.log("\u8bfb\u53d6\u9519\u8bef\uff1a" + error);
		}});
	}
})(jQuery);

function save() { 
    $('#hiddenPointForm').data('bootstrapValidator').validate();
	var validStatus=$('#hiddenPointForm').data('bootstrapValidator').isValid();
	if(validStatus==true){
		$("#hiddenPointForm").ajaxSubmit({url:"/agsupport/sz-assessmentsocial!saveJson.action", type:"post", success:function (res) {
			parent.layer.msg("新增考核成功");
			parent.location.reload();
		}, error:function (XHR, error, errorThrown) {
			parent.layer.msg("新增考核失败");
		}});
	} else {
		parent.layer.msg("表单验证失败，请检查表单内容");
	}
}

function calculateRow(id) {
	if ($("#" + id).val() != "") {
		var rowId = id.replace("ScoreDeduct", "");
		var zf = parseInt($("#" + rowId).val());//总分
		var kf = parseInt($("#" + id).val());
		$("#" + rowId + "ScoreDeduct").val(kf);//扣分
		var df = zf - kf;	
		if (df > zf) {
			alert("\u5f97\u5206\u4e0d\u80fd\u8d85\u8fc7\u603b\u5206\uff01");
			$("#" + id).val(0);
			$("#" + id+ "Deduct").val(0);	    
		}
	    else{
	    	$("#" + rowId + "Score").val(df);			   
	    }
	}
	
	var df=0;
	//计算总分
	$(".score").each(function(){
		if ($(this).val() != "")
			df+=parseInt($(this).val());
	});
	$("#totalScore").val(df);
}

function cancel() {
	parent.layer.close(parent.layer.getFrameIndex(window.name));
}
