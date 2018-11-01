//数据填充	    
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}
var id=getQueryStr("id");
  	    
$(function(){	    
	var totalScore=$("#totalScore").val();
	var roadScore=$("#roadScore").val();
	var drainScore=$("#drainScore").val();
	var bridgeScore=$("#bridgeScore").val();
						
	if(id!=""){
    	$.ajax({
			method : 'GET',
			url : location.protocol+"//"+location.hostname+":"+location.port+'/agsupport/sz-assessmentquality!listJson.action?id='+id,
			async : true,
			dataType : 'json',
			success : function(data) {
				for (var key in data.rows[0]){			
				   if(key.toLowerCase().indexOf("start")!=-1||key.toLowerCase().indexOf("end")!=-1&&data.rows[0][key]!=null){
						$("#"+key).val(getLocalTime(data.rows[0][key].time));
					}else{
					   	$("#"+key).val(data.rows[0][key]);
					   	if(key.toLowerCase().indexOf("score")!=-1){
					   	   var scoreDeduct=100-$("#"+key).val();
					   	   if(scoreDeduct.toString().length>5){
					   	      scoreDeduct=scoreDeduct.toFixed(2);
					   	      if(scoreDeduct.substr(scoreDeduct.length-1,1)==0)
					   	         scoreDeduct=scoreDeduct.substring(0,scoreDeduct.length-1);  
					       }
					       $("#"+key+"Deduct").val(scoreDeduct);
					   	}
				    }
				}
				totalScore=$("#totalScore").val();
				roadScore=($("#dlwgScore").val()*0.3+$("#dlscslScore").val()*0.4+$("#dlbzzlScore").val()*0.3).toFixed(2);
				drainScore=($("#pswgScore").val()*0.3+$("#psscslScore").val()*0.4+$("#psbzzlScore").val()*0.3).toFixed(2);
				bridgeScore=($("#qhwgScore").val()*0.3+$("#qhscslScore").val()*0.4+$("#qhbzzlScore").val()*0.3).toFixed(2);
			    $("#roadScore").val(roadScore);
			    $("#drainScore").val(drainScore);
			    $("#bridgeScore").val(bridgeScore);						
			},
			error : function() {
				alert('error');
			}
		});
	}
   
	$("#dlwgScoreDeduct").on("change",function(){
	    roadScore=(100-$("#dlwgScoreDeduct").val())*0.3+$("#dlscslScore").val()*0.4+$("#dlbzzlScore").val()*0.3;
	    $("#roadScore").val(roadScore.toFixed(2));		
	    totalScore=roadScore/3+drainScore/3+bridgeScore/3;
        $("#totalScore").val(totalScore.toFixed(2));	
	});
	$("#dlscslScoreDeduct").on("change",function(){
	    roadScore=(100-$("#dlwgScoreDeduct").val())*0.3+$("#dlscslScore").val()*0.4+$("#dlbzzlScore").val()*0.3;
	    $("#roadScore").val(roadScore.toFixed(2));		
	    totalScore=roadScore/3+drainScore/3+bridgeScore/3;
        $("#totalScore").val(totalScore.toFixed(2));			
	});
	$("#dlbzzlScoreDeduct").on("change",function(){
	    roadScore=(100-$("#dlwgScoreDeduct").val())*0.3+$("#dlscslScore").val()*0.4+$("#dlbzzlScore").val()*0.3;
	    $("#roadScore").val(roadScore.toFixed(2));	
	    totalScore=roadScore/3+drainScore/3+bridgeScore/3;
        $("#totalScore").val(totalScore.toFixed(2));	
	});
	
	$("#pswgScoreDeduct").on("change",function(){
	    drainScore=(100-$("#pswgScoreDeduct").val())*0.25+$("#psscslScore").val()*0.35+$("#psbzzlScore").val()*0.4;
	    $("#drainScore").val(drainScore.toFixed(2));	
	     totalScore=roadScore/3+drainScore/3+bridgeScore/3;
        $("#totalScore").val(totalScore.toFixed(2));			
	});
	$("#psscslScoreDeduct").on("change",function(){
	    drainScore=(100-$("#pswgScoreDeduct").val())*0.25+$("#psscslScore").val()*0.35+$("#psbzzlScore").val()*0.4;
	    $("#drainScore").val(drainScore.toFixed(2));	
	     totalScore=roadScore/3+drainScore/3+bridgeScore/3;
        $("#totalScore").val(totalScore.toFixed(2));				
	});
	$("#psbzzlScoreDeduct").on("change",function(){
	    drainScore=(100-$("#pswgScoreDeduct").val())*0.25+$("#psscslScore").val()*0.35+$("#psbzzlScore").val()*0.4;
	    $("#drainScore").val(drainScore.toFixed(2));	
	     totalScore=roadScore/3+drainScore/3+bridgeScore/3;
        $("#totalScore").val(totalScore.toFixed(2));	
	});
	
	$("#qhwgScoreDeduct").on("change",function(){
	    bridgeScore=(100-$("#qhwgScoreDeduct").val())*0.3+$("#qhscslScore").val()*0.4+$("#qhbzzlScore").val()*0.3;
	    $("#bridgeScore").val(bridgeScore.toFixed(2));	
	     totalScore=roadScore/3+drainScore/3+bridgeScore/3;
        $("#totalScore").val(totalScore.toFixed(2));			
	});
	$("#qhscslScoreDeduct").on("change",function(){
	    bridgeScore=(100-$("#qhwgScoreDeduct").val())*0.3+$("#qhscslScore").val()*0.4+$("#qhbzzlScore").val()*0.3;
	    $("#bridgeScore").val(bridgeScore.toFixed(2));
	     totalScore=roadScore/3+drainScore/3+bridgeScore/3;
        $("#totalScore").val(totalScore.toFixed(2));					
	});
	$("#qhbzzlScoreDeduct").on("change",function(){
	    bridgeScore=(100-$("#qhwgScoreDeduct").val())*0.3+$("#qhscslScore").val()*0.4+$("#qhbzzlScore").val()*0.3;
	    $("#bridgeScore").val(bridgeScore.toFixed(2));	
	     totalScore=roadScore/3+drainScore/3+bridgeScore/3;
        $("#totalScore").val(totalScore.toFixed(2));	
	});
	
	$("#content").mCustomScrollbar();
	
  	$("#assessmentStart").datetimepicker({
		language: 'zh-CN',
		minView:'month',
		format: 'yyyy-mm-dd',
		autoclose:true,
		pickerPosition:'bottom-right'
	}).on('hide',function(e) {  
		$('#form').data('bootstrapValidator')  
		.updateStatus('assessmentStart', 'NOT_VALIDATED',null)  
		.validateField('assessmentStart');  
	});
		
	$("#assessmentEnd").datetimepicker({
		language: 'zh-CN',
		minView:'month',
		format: 'yyyy-mm-dd',
		autoclose:true,
		pickerPosition:'bottom-right'
	}).on('hide',function(e) {  
		$('#form').data('bootstrapValidator')  
		.updateStatus('assessmentEnd', 'NOT_VALIDATED',null)  
		.validateField('assessmentEnd');  
	});
	
	$(".table").find("tbody tr td").each(function(){
    	$(this).css("vertical-align","middle");
	});
	
	$(".table").find("tr td").each(function(){
	    $(this).css("vertical-align","middle");
	});
	
	$('#form').bootstrapValidator({
        message: '',
        /*feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },*/
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
    });
});
   
function save(){
    $('#form').data('bootstrapValidator').validate();
	var validStatus=$('#form').data('bootstrapValidator').isValid();
	if(validStatus==true){
		$.ajax({
			type: 'post',
			url : '/agsupport/sz-assessmentquality!saveJson.action',
			data:$("#form").serialize(),
			dataType : 'json',  
			success : function(data) {
				parent.layer.msg(data.result);
				var index = parent.layer.getFrameIndex(window.name);
				window.parent.closeLayer(index);
			},
			error : function(e) {
				parent.layer.msg("考核操作失败");
			}
		});
	} else {
		parent.layer.msg("表单验证失败，请检查所填内容");
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
}

function cancel(){
	parent.layer.close(parent.layer.getFrameIndex(window.name));
}