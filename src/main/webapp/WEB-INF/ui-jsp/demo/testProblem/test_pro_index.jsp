<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
	<title>问题上报表</title>
	<%@ include file="/ui-static/agcloud/framework/jsp/agcloud-meta.jsp"%>
	<%@ include file="/ui-static/agcloud/framework/theme-libs/metronic-v5/template-default.jsp"%>
	<%@ include file="/ui-static/agcloud/framework/jsp/agcloud-common.jsp"%>

	<%@ taglib prefix="agbpm" uri="/WEB-INF/ui-jsp/agcloud/bpm/front/tag/augurit_bpm.tld"%>
</head>
<!-- 用户自己编写的js -->
<script>
    function wfSave(masterEntityKey) {
        $.ajax({
            url : ctx+'/test/problem/saveTestProlem.do?masterEntityKey='+masterEntityKey,
            data : $('#form-code-00000192').serialize(),
            type : "get",
            dataType : "json",
            async : false,
            success : function(result){
                if(result.success){
                    //alert('保存成功！');
                }
            }
        });
	}

    function loadWfBusData(masterEntityKey){
        if(masterEntityKey!=null&&masterEntityKey!=''){
            $.post(ctx+'/test/problem/getTestProblemByMasterKey.do',{masterEntityKey:masterEntityKey}, function(result){
                agcloud.bpm.form.metronic.loadFormData(true,"#form-code-00000192",result);
            }, 'json');
        }
    }
    $(function(){
        //初始化表单
        var problemId = parent.masterEntityKey;
        loadWfBusData(problemId);
    });
</script>
<body>
<!-- 注意表单的id是创建表单界面中的配置表单基本信息的 表单编号 ，input的id是页面元素那里拿的元素编号，name是页面元素名称转驼峰后的字符串。-->
<form id="form-code-00000192" method="post" class="m-form m-form--fit m-form--label-align-right">
	<input type="hidden" name="problemId">
	<div class="form-group m-form__group row">
		<label for="form-code-00000192_TEST_PROBLEM_PROBLEM_DESC" class="col-2 col-form-label">
			问题描述：
		</label>
		<div class="col-4">
			<agbpm:textarea name="problemDesc" value="${problemDesc}" cssClass="form-control m-input" id="form-code-00000192_TEST_PROBLEM_PROBLEM_DESC" rows="3"></agbpm:textarea>
		</div>
		<label for="form-code-00000192_TEST_PROBLEM_PROBLEM_LOCATION" class="col-2 col-form-label">
			问题地点：
		</label>
		<div class="col-4">
			<agbpm:input name="problemLocation" value="${problemLocation}" id="form-code-00000192_TEST_PROBLEM_PROBLEM_LOCATION" type="text" cssClass="form-control m-input"/>
		</div>
	</div>
	<div class="form-group m-form__group row">
		<label for="form-code-00000192_TEST_PROBLEM_PROBLEM_ROAD" class="col-2 col-form-label">
			问题所在道路：
		</label>
		<div class="col-4">
			<agbpm:input name="problemRoad" value="${problemRoad}" id="form-code-00000192_TEST_PROBLEM_PROBLEM_ROAD" type="text" cssClass="form-control m-input"/>
		</div>
		<label for="form-code-00000192_TEST_PROBLEM_DEVICE_TYPE" class="col-2 col-form-label">
			设施类型：
		</label>
		<div class="col-4">
			<agbpm:select name="deviceType" id="form-code-00000192_TEST_PROBLEM_DEVICE_TYPE" cssClass="form-control" value="${deviceType}"
						  options="[{text:'窨井',value:'1',selected:true},{text:'雨水口',value:'2'},{text:'排放口',value:'3'},{text:'排水管道',value:'4'},{text:'排水沟渠',value:'5'},{text:'其他',value:'6'}]">
			</agbpm:select>
		</div>
	</div>
	<div class="form-group m-form__group row">
		<label for="form-code-00000192_TEST_PROBLEM_PROBLEM_TYPE" class="col-2 col-form-label">
			问题类型：
		</label>
		<div class="col-4">
			<agbpm:select name="problemType" id="form-code-00000192_TEST_PROBLEM_PROBLEM_TYPE" cssClass="selectpicker" value="${problemType}" otherAtrribute="multiple=\"true\" data-live-search=\"true\" data-width=\"100%\""
						  options="[{text:'淤积',value:'1',selected:true},{text:'水溢出',value:'2'},{text:'水满管',value:'3'},{text:'存在偷排',value:'4'},{text:'井盖损坏',value:'5'},
             {text:'井盖缺失',value:'6'},{text:'井盖异响',value:'7'},{text:'沉陷',value:'8'},{text:'凸起',value:'9'},{text:'挂牌损坏',value:'10'},{text:'其他',value:'11'}]">
			</agbpm:select>
		</div>
		<label for="form-code-00000192_TEST_PROBLEM_URGENT_TYPE" class="col-2 col-form-label">
			紧急程度：
		</label>
		<div class="col-4">
			<agbpm:select name="urgentType" id="form-code-00000192_TEST_PROBLEM_URGENT_TYPE" cssClass="form-control" value="${urgentType}"
						  options="[{text:'一般',value:'1',selected:true},{text:'较紧急',value:'2'},{text:'紧急',value:'3'}]">
			</agbpm:select>
		</div>
	</div>
	<div class="form-group m-form__group row">
		<label for="form-code-00000192_TEST_PROBLEM_HANDLE_MYSELF" class="col-2 col-form-label">
			是否自行处理：
		</label>
		<div class="col-4">
			<agbpm:select name="handleMyself" id="form-code-00000192_TEST_PROBLEM_HANDLE_MYSELF" cssClass="form-control" value="${handleMyself}"
						  options="[{text:'是',value:'1'},{text:'否',value:'0',selected:true}]">
			</agbpm:select>
		</div>
		<label for="form-code-00000192_TEST_PROBLEM_SEND_MESSAGE" class="col-2 col-form-label">
			是否短信通知：
		</label>
		<div class="col-4">
			<agbpm:select name="sendMessage" id="form-code-00000192_TEST_PROBLEM_SEND_MESSAGE" cssClass="form-control" value="${sendMessage}"
						  options="[{text:'是',value:'1'},{text:'否',value:'0',selected:true}]">
			</agbpm:select>
		</div>
	</div>
</form>
<!-- 这个是流程默认引入的js-->
<script src="${pageContext.request.contextPath}/ui-static/agcloud/bpm/front/process/wfCommon.js"></script>
</body>
</html>