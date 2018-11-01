define(['jquery','layer','dateUtil','awaterui','bootstrapValidator'],function($,layer,dateUtil,awaterui){
    var districtYaId,pIndex;
    
    function init(_districtYaId,index){
        districtYaId=_districtYaId;
        pIndex=index;
        $("#districtYaId").val(districtYaId);
        $("#planSaveBtn").click(save);
        $("#planCancelBtn").click(cancel);

        $.ajax({
            method : 'GET',
            url : '/psemgy/yaRecordDistrict/inputJson?id='+districtYaId,
            async : false,
            dataType:'json',
            success : function(data) {
                $("#reportName").val(dateUtil.getCNLocalTime(data.form.recordCreateTime.time)+data.form.templateName);
                $("#cityYaId").val(data.form.yaCityId);
            },
            error:function (e){
                layer.msg("请求失败");
            }
        });
        $("#form").bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                rescuePeopleNumber: {
                    validators: {
                        integer: {
                            message: '请输入正整数!'
                        },
                        notEmpty: {
                            message: '救援人员数量不能为空!'
                        }
                    }
                },
                rescueCarNumber: {
                    validators: {
                        integer: {
                            message: '请输入正整数!'
                        },
                        notEmpty: {
                            message: '救援车辆数量不能为空!'
                        }
                    }
                },
            }
        });
    }
    
    function save(){
        if($('#form').data('bootstrapValidator').validate().$invalidFields.length==0){
            $.ajax({
                type: 'post',
                url : '/psemgy/yaRainReport/saveDistrictJson',
                data:$("#form").serialize(),
                dataType : 'json',  
                success : function(data) {
                    layer.msg(data.result);
                    showWindow(data.form.id);
                    setTimeout(layer.closeAll, 2000 );
                },
                error : function() {
                    alert('error');
                }
            });
        } else {
            layer.msg("输入数据有误，请重新输入！");
        }
    }
    function showWindow(id){
        awaterui.createNewtab("/psemgy/eims/dispatch/pages/district/rainReport/list.html","成员单位防汛应急响应一雨一报",function(){
			require(["psemgy/eims/dispatch/pages/district/rainReport/js/list"],function(list){
				list.init(id);
			});
		});
    }
    function cancel() {
        layer.close(pIndex);
    }
});      