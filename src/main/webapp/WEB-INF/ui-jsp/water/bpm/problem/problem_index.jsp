<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>问题上报表</title>
    <%@ include file="/ui-static/agcloud/framework/jsp/agcloud-meta.jsp" %>
    <%@ include file="/ui-static/agcloud/framework/theme-libs/metronic-v5/template-default.jsp" %>
    <%@ include file="/ui-static/agcloud/framework/jsp/agcloud-common.jsp" %>
    <%@ include file="/ui-static/agcloud/framework/awater-jsp/layer3.jsp" %>
</head>
<!-- 用户自己编写的js -->

<body>
<div class="container">
    <div class="row clearfix">
        <div class="col-md-12 column">
<!-- 注意表单的id是创建表单界面中的配置表单基本信息的 表单编号 ，input的id是页面元素那里拿的元素编号，name是页面元素名称转驼峰后的字符串。-->
            <form id="myform" class="form-horizontal" role="form" style="margin-top:15px;width:95%;">
                <div class="col-sm-2">
                    <input type="button" value="获取位置" onclick="locationByPoint('point')">
                </div>
                <input id="X" type="hidden" name="x" required="" maxlength="20" class="form-control" value="">
                <input id="Y" type="hidden" name="y" required="" maxlength="20" class="form-control" value="">
                <input id="primarykeyfieldflag" class="form-control" name="id" value="" type="hidden">
                <div class="form-group">
                    <label class="control-label col-sm-2" for="szwz">问题地点
                        <font color="red" style="vertical-align:middle">&nbsp;*</font>:
                    </label>
                    <div class="col-sm-4"><input id="szwz" name="szwz" value="" class="form-control" required="" maxlength="100">
                    </div>
                    <label class="control-label col-sm-2" for="jdmc">所在道路
                        <font color="red" style="vertical-align:middle">&nbsp;*</font>:
                    </label>
                    <div class="col-sm-4">
                        <input id="jdmc" name="jdmc" value="" class="form-control" required="" maxlength="100">
                    </div>
                </div>
                <div class="form-group"><label class="control-label col-sm-2" for="sslx">设施类型<font color="red"
                                                                                                   style="vertical-align:middle">&nbsp;*</font>:</label>
                    <div class="col-sm-4">
                        <select id="sslx" name="sslx" class="form-control" onchange="getRelatedDic('wtlx3',this.value)" required=""
                                maxlength="20">
                            <option value=""></option>
                            <option value="A174001">窨井</option>
                            <option value="A174002">雨水口</option>
                            <option value="A174003">排放口</option>
                            <option value="A174005">排水管道</option>
                            <option value="A174006">排水沟渠</option>
                            <option value="A174007">其他</option>
                        </select>
                    </div>
                    <label class="control-label col-sm-2" for="jjcd">紧急程度<font color="red"
                                                                               style="vertical-align:middle">&nbsp;*</font>:</label>
                    <div class="col-sm-4">
                        <select id="jjcd" name="jjcd" class="form-control" onchange="getRelatedDic('null',this.value)" required=""
                                maxlength="10">
                            <option value=""></option>
                            <option value="1">一般</option>
                            <option value="3">紧急</option>
                            <option value="2">较紧急</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label col-sm-2" for="bhlx">问题类型<font color="red"
                           style="vertical-align:middle" id="isNullbhlx"><font color="red" style="vertical-align:middle">&nbsp;*</font>:</label>
                    <div class="col-sm-10">
                        <div id="sblxChecks" style="font-size: 15px;">
                        </div>
                    </div>
                </div>
                <div class="form-group"><label class="control-label col-sm-2" for="wtms">问题<font color="red" style="vertical-align:middle" id="isNullwtms">&nbsp;*</font>:</label>
                    <div class="col-sm-10">
                        <textarea id="wtms" name="wtms" class="form-control" rows="3">

                        </textarea>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<!-- 这个是流程默认引入的js-->
<script src="${pageContext.request.contextPath}/ui-static/agcloud/bpm/front/process/wfCommon.js"></script>
<script>
    function wfBusSave(procdefKey, taskId, masterEntityKey, appProcdefId, processInstanceId) {
        var url = ctx + '/test/problem/workFlowBusSave.do?procdefKey=' + procdefKey + "&appProcdefId=" + appProcdefId + "&processInstanceId=" + processInstanceId;
        if (masterEntityKey != null && masterEntityKey != '') {
            url = ctx + '/test/problem/workFlowBusSave.do?masterEntityKey=' + masterEntityKey + '&taskId=' + taskId + "&appProcdefId=" + appProcdefId + "&processInstanceId=" + processInstanceId
        }
        var content;
        $.ajax({
            url: url,
            data: $('#wentishangbao0001').serialize(),
            type: "post",
            dataType: "json",
            async: false,
            success: function (result) {
                if (result.success) {
                    //注意保存后返回的信息要返回给调用者，所以这里用了同步
                    content = result.content;
                }
            }
        });
        return content;
    }

    function loadWfBusData(problemId) {
        if (problemId != null && problemId != '') {
            $.post(ctx + '/test/problem/getTestProblemById.do', {id: problemId}, function (result) {
                agcloud.bpm.form.metronic.loadFormData(true, "#wentishangbao0001", result);
            }, 'json');
        }
    }

    $(function () {
        debugger;
        //初始化表单
        var problemId = parent.masterEntityKey;
        loadWfBusData(problemId);
    });
</script>
<script src="/psxj/systemInfo/ssxjxt/xcyh/xcyh/js/xcyh_public.js"></script>
</body>
</html>