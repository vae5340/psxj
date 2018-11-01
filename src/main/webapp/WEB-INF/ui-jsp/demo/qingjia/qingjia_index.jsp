<%@ page contentType="text/html;charset=UTF-8" %>

<!DOCTYPE html>
<html>
<head>
	<title>专有业务流程视图配置表管理</title>
    <%@ include file="/ui-static/agcloud/framework/jsp/agcloud-meta.jsp"%>
    <%@ include file="/ui-static/agcloud/framework/theme-libs/metronic-v5/template-default.jsp"%>
    <%@ include file="/ui-static/agcloud/framework/jsp/agcloud-common.jsp"%>

    <%@ taglib prefix="agbpm" uri="/WEB-INF/ui-jsp/agcloud/bpm/front/tag/augurit_bpm.tld"%>
</head>
<!-- 用户自己编写的js -->
<script>
    function wfBusSave(flowdefKey,taskId,masterEntityKey,appFlowdefId,processInstanceId,flowModel){
        var url = ctx+'/erp/hr/employee/bill/workFlowBusSave.do?flowdefKey='+flowdefKey+"&appFlowdefId="+appFlowdefId+"&processInstanceId="+processInstanceId + "&flowModel=" + flowModel;
        if(masterEntityKey!=null && masterEntityKey!=''){
            url = ctx+'/erp/hr/employee/bill/workFlowBusSave.do?masterEntityKey='+masterEntityKey+'&taskId='+taskId+"&appFlowdefId="+appFlowdefId+"&processInstanceId="+processInstanceId + "&flowModel=" + flowModel;
        }
        var content;
        $.ajax({
            url : url,
            data : $('#form-code-00000062').serialize(),
            type : "post",
            dataType : "json",
            async : false,
            success : function(result){
                if(result.success){
                    //注意保存后返回的信息要返回给调用者，所以这里用了同步
                    content =  result.content;
                }
            }
        });
        return content;
    }
    function loadWfBusData(billId){
        if(billId!=null&&billId!=''){
            $.post(ctx+'/erp/hr/employee/bill/getEmployee.do',{id:billId}, function(result){
                agcloud.bpm.form.metronic.loadFormData(true,"#form-code-00000062",result);
            }, 'json');
        }
    }
    $(function(){
        //初始化表单
        var billId = parent.masterEntityKey;
        loadWfBusData(billId);
    });
</script>
<body style="overflow: hidden">
    <!-- 注意表单的id是创建表单界面中的配置表单基本信息的 表单编号 ，input的id是页面元素那里拿的元素编号，name是页面元素名称转驼峰后的字符串。-->
    <form id="form-code-00000062" method="post" class="m-form m-form--fit m-form--label-align-right">
        <input type="hidden" name="billId">
        <div class="form-group m-form__group row">
            <label for="form-code-00000062_ERP_HR_EMPLOYEE_BILL_USER_NAME" class="col-2 col-form-label">
                请假人：
            </label>
            <div class="col-4">
                <agbpm:input name="userName" value="${currUserName}" id="form-code-00000062_ERP_HR_EMPLOYEE_BILL_USER_NAME" type="text" cssClass="form-control m-input"/>
            </div>
            <label for="form-code-00000062_ERP_HR_EMPLOYEE_BILL_BILL_REASON" class="col-2 col-form-label">
                请假事由：
            </label>
            <div class="col-4">
                <agbpm:textarea name="billReason" value="" cssClass="form-control m-input" id="form-code-00000062_ERP_HR_EMPLOYEE_BILL_BILL_REASON" rows="3"></agbpm:textarea>
            </div>
        </div>
        <div class="form-group m-form__group row">
            <label for="form-code-00000062_ERP_HR_EMPLOYEE_BILL_BILL_START_DATE" class="col-2 col-form-label">
                请假开始时间：
            </label>
            <div class="col-4">
                <agbpm:datetime format="yyyy-mm-dd hh:ii:ss" cssClass="form-control m-input" id="form-code-00000062_ERP_HR_EMPLOYEE_BILL_BILL_START_DATE" name="billStartDate" value="" onFocus="agcloud.bpm.form.metronic.initBpmDatetimeTag(this)"/>
            </div>
            <label for="form-code-00000062_ERP_HR_EMPLOYEE_BILL_BILL_END_DATE" class="col-2 col-form-label">
                请假结束时间：
            </label>
            <div class="col-4">
                <agbpm:datetime format="yyyy-mm-dd hh:ii:ss" cssClass="form-control m-input" id="form-code-00000062_ERP_HR_EMPLOYEE_BILL_BILL_END_DATE" name="billEndDate" value="" onFocus="agcloud.bpm.form.metronic.initBpmDatetimeTag(this)"/>
            </div>
        </div>
    </form>
    <!-- 这个是流程默认引入的js-->
    <script src="${pageContext.request.contextPath}/ui-static/agcloud/bpm/front/process/wfCommon.js"></script>
</body>
</html>