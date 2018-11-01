<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="agbpm" uri="/WEB-INF/ui-jsp/agcloud/bpm/front/tag/augurit_bpm.tld" %>
<!DOCTYPE html>
<html>
<head>
    <title>
        ${appComment}
    </title>
    <%@ include file="/ui-static/agcloud/framework/jsp/agcloud-meta.jsp" %>
    <%@ include file="/ui-static/agcloud/framework/theme-libs/metronic-v5/template-default.jsp" %>
    <%@ include file="/ui-static/agcloud/framework/jsp/agcloud-common.jsp" %>
    <%@ include file="/ui-static/agcloud/framework/jsp/lib-agtree3.jsp"%>
    <style>
        .miniScrollbar {
            overflow: auto;
        }

        .miniScrollbar::-webkit-scrollbar { /*滚动条整体样式*/
            width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 4px;
        }

        .miniScrollbar::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
            border-radius: 5px;
            -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            background: rgba(0, 0, 0, 0.2);
        }

        .miniScrollbar::-webkit-scrollbar-track { /*滚动条里面轨道*/
            -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            border-radius: 0;
            background: rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<script>
    var ctx = '${pageContext.request.contextPath}';
    var flowdefKey = '${flowdefKey}';
    var taskId = '${taskId}';
    var taskName = '${taskName}';
    var masterEntityKey = '${masterEntityKey}';
    var processInstanceId = '${processInstanceId}';
    var appFlowdefId = '${appFlowdefId}';
    var currTaskDefId = '${currTaskDefId}';
    var currProcDefVersion = '${currProcDefVersion}';
    var isCheck = '${isCheck}';
    var formJson = '${formJson}';
    var viewId = '${viewId}';
    var flowModel = '${flowModel}';
    var _tableName = '${masterEntityKey}';
    var _pkName = '${masterEntityKey}';
    var recordIds = '${recordIds}';
    var initError = '${initError}';
    var btnDisable = taskId == null || taskId.trim() == "" ? true : false;
    var busRecordId = '${busRecordId}';
</script>
<body>
<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">
            <nav class="agcloud-navbar">
                <div class="agcloud-navbar-container">
                    <a class="agcloud-navbar-brand agcloud-icon-data-dictionary" href="javascript:void(0);">
                        ${appComment}&nbsp;&nbsp;&nbsp;&nbsp;
                        <span style="font-weight: normal" id="currentTask">
								<c:if test="${taskId!=null}">当前环节：${taskName}</c:if>
							</span>
                    </a>
                    <div class="agcloud-navbar-collapse">
                        <ul class="agcloud-navbar-tabs">
                            <li class="agcloud-nav-item">
                                <a href="javascript:void(0);"
                                   class="agcloud-nav-icon  agcloud-navbar-icon-question"> </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    </div>
    <div class="row" style="margin-top: 5px;">
        <div class="col-md-9" style="padding-left: 0px;padding-right: 0px">
            <div id="formContent">
                <div class="m-portlet" style="margin: 0px">
                    <div class="m-portlet__head">
                        <div id="buttonBar" style="padding: 3px 0px;">
                        </div>
                    </div>
                    <div class="m-portlet__body">
                        <ul class="nav nav-tabs  m-tabs-line" id="form-tabsId" role="tablist">
                        </ul>
                        <div class="tab-content miniScrollbar" id="form-tabs-content" style="overflow: auto">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3" style="padding-left: 0px;padding-right: 0px">
            <div id="attachmentsManage">
                <div class="m-portlet" data-portlet="true" id="m_portlet_tools_2" style="margin: 0px">
                    <div class="m-portlet__head">
                        <div class="m-portlet__head-caption">
                            <div class="m-portlet__head-title">
                                <h3 class="m-portlet__head-text">
                                    附件管理
                                </h3>
                            </div>
                        </div>
                        <div class="m-portlet__head-tools">
                            <ul class="m-portlet__nav">
                                <li class="m-portlet__nav-item">
                                    <a href="#" data-portlet-tool="fullscreen"
                                       class="m-portlet__nav-link m-portlet__nav-link--icon">
                                        <i class="la la-expand"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="m-portlet__body" style="padding: 15px 5px 15px 15px">
                        <div id="attachContent" style="overflow: hidden;padding: 0px">
                            <%--<div class="tab-pane active m-scrollable" id="m_quick_sidebar_tabs_messenger" role="tabpanel">--%>
                            <div style="height: 100%;overflow: hidden;">
                                <iframe frameborder="0" id="attachContentFrame"
                                        style="width:100%;overflow-x: hidden;height: 100%;margin: 0;padding: 0;border: 0;overflow: auto;"
                                        src=""></iframe>
                            </div>
                            <%--</div>--%>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--  保存并发送 弹窗 -->
<div class="modal fade" id="m_modal_saveAndSend" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header" style="padding:10px 10px 0px 10px;height: 40px;">
                <h5 class="modal-title" id="exampleModalLabel">
                    发送对话框
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body miniScrollbar">
                <form id="nextTaskForm" method="post" class="m-form m-form--fit m-form--label-align-right">
                    <div class="m-portlet m-portlet--bordered m-portlet--unair">
                        <div class="m-portlet__head">
                            <div class="m-portlet__head-caption">
                                <div class="m-portlet__head-title">
                                    <h3 class="m-portlet__head-text">
                                        发送环节及办理人
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div class="m-portlet__body">
                            <div class="form-group row">
                                <label class="col-3">
                                    下一环节：
                                </label>
                                <div class="col-9">
                                    <div class="m-radio-inline" id="nextTaskList"><!-- 下个环节在js中动态生成-->
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-3">
                                    下一环节参与者：
                                </label>
                                <div class="col-9">
                                    <input class="form-control m-input" type="text" name="nextAssignee"
                                           value="" id="nextAssignee" style="width: 85%;display: inline-block" readonly="readonly">
                                    <button type="button" class="btn btn-secondary" id="selectAsingee"
                                            onclick="selectAsingeeDialog()">选择
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 暂时不开放提醒功能 -->
                    <div class="m-portlet m-portlet--bordered m-portlet--unair" style="display: none;">
                        <div class="m-portlet__head">
                            <div class="m-portlet__head-caption">
                                <div class="m-portlet__head-title">
                                    <h3 class="m-portlet__head-text">
                                        发送提醒选项
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div class="m-portlet__body">
                            <div class="form-group row">
                                <label class="col-3">
                                    是否邮件提醒：
                                </label>
                                <div class="col-9">
                                    <div class="m-radio-inline">
                                        <label class="m-radio">
                                            <input type="radio" name="isMailTip" value="1">
                                            是
                                            <span></span>
                                        </label>
                                        <label class="m-radio">
                                            <input type="radio" name="isMailTip" value="0" checked="checked">
                                            否
                                            <span></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-3">
                                    是否短信提醒：
                                </label>
                                <div class="col-9">
                                    <div class="m-radio-inline">
                                        <label class="m-radio">
                                            <input type="radio" name="isMessageTip" value="1">
                                            是
                                            <span></span>
                                        </label>
                                        <label class="m-radio">
                                            <input type="radio" name="isMessageTip" value="0" checked="checked">
                                            否
                                            <span></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div class="m-portlet m-portlet--bordered m-portlet--unair">
                    <div class="m-portlet__head">
                        <div class="m-portlet__head-caption">
                            <div class="m-portlet__head-title">
                                <h3 class="m-portlet__head-text">
                                    备注说明
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div class="m-portlet__body" id="commentTip">
                    </div>
                </div>
            </div>
            <div class="modal-footer" style="padding-right:19px;height: 45px;">
                <button type="button" class="btn btn-secondary cancel" data-dismiss="modal">
                    取消
                </button>
                <button type="button" class="btn btn-primary confirm">
                    发送
                </button>
            </div>
        </div>
    </div>
</div>
<!--  选择参与者 弹窗 -->
<div class="modal fade" id="m_modal_selectAssignee" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel_1"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header" style="padding:10px 10px 0px 10px;height: 40px;">
                <h5 class="modal-title" id="exampleModalLabel_1">
                    选择受理人
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body miniScrollbar">
                <div class="row">
                    <div class="col-9">
                        <div class="m-portlet m-portlet--bordered m-portlet--unair"
                             style="margin-bottom:0px;height: 380px">
                            <div class="m-portlet__head">
                                <div class="m-portlet__head-caption">
                                    <div class="m-portlet__head-title">
                                        <h3 class="m-portlet__head-text">
                                            请输入查询关键字并选择参与者：
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div class="m-portlet__body miniScrollbar" style="padding:0px;height: 338px">
                                <%--<div id="assigneeTree" class="tree-demo"></div>--%>
                                <%--<input type="text" class="form-control" placeholder="请输入关键字" onchange="assigneeSearch()" style="margin-top: 1px;height: 33px">--%>
                                    <ul id="assigneeOrgTree" class="ztree"></ul>
                            </div>
                        </div>
                    </div>
                    <%--<div class="col-1">--%>
                        <%--<button type="button" class="btn btn-secondary addAssignee"--%>
                                <%--style="width:50px;margin-top: 170px;"> &gt;--%>
                        <%--</button>--%>
                    <%--</div>--%>
                    <div class="col-3">
                        <div class="m-portlet m-portlet--bordered m-portlet--unair"
                             style="margin-bottom:0px;height: 380px;">
                            <div class="m-portlet__head">
                                <div class="m-portlet__head-caption">
                                    <div class="m-portlet__head-title">
                                        <h3 class="m-portlet__head-text">
                                            已选中参与者：
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div class="m-portlet__body miniScrollbar" style="padding:0px;height: 338px">
                                <div class="m-list-search">
                                    <div class="m-list-search__results" id="selectedAssignees">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer" style="padding-right:19px;height: 45px;">
                <button type="button" class="btn btn-secondary cancel" data-dismiss="modal">
                    取消
                </button>
                <button type="button" class="btn btn-primary confirm">
                    确定
                </button>
            </div>
        </div>
    </div>
</div>
<!--  添加审批意见弹窗 -->
<div class="modal fade" id="m_modal_comment" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel_2"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header" style="padding:10px 10px 0px 10px;height: 40px;">
                <h5 class="modal-title" id="exampleModalLabel_2">
                    添加审批意见
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body miniScrollbar">
                <div class="row">
                    <div class="col-md-8">
                        <form id="addTaskCommentForm" method="post">
                            <textarea class="form-control m-input" name="message" id="message"
                                      style="height: 302px"></textarea>
                        </form>
                    </div>
                    <div class="col-md-4">
                        <div class="m_datatable" id="commentTable"></div>
                    </div>
                </div>
            </div>
            <div class="modal-footer" style="padding-right:19px;height: 45px;">
                <button type="button" class="btn btn-secondary cancel" data-dismiss="modal">
                    取消
                </button>
                <button type="button" class="btn btn-primary confirm">
                    保存
                </button>
            </div>
        </div>
    </div>
</div>
<!--  查看历史审批意见弹窗 -->
<div class="modal fade" id="m_modal_historyComment" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel_3"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header" style="padding:10px 10px 0px 10px;height: 40px;">
                <h5 class="modal-title" id="exampleModalLabel_3">
                    历史审批意见
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body miniScrollbar">
                <div class="row">
                    <div class="col-md-12">
                        <div class="m_datatable" id="historyCommentTable"></div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary cancel" data-dismiss="modal">
                    取消
                </button>
                <button type="button" class="btn btn-primary confirm">
                    保存
                </button>
            </div>
        </div>
    </div>
</div>
<!--  查看流程图弹窗 -->
<div class="modal fade" id="m_modal_Diagram" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel_4"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header" style="padding:10px 10px 0px 10px;height: 40px;">
                <h5 class="modal-title" id="exampleModalLabel_4">
                    查看流程图
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body miniScrollbar">
                <div class="row">
                    <div class="col-md-12">
                        <div id="bpmnModel"></div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary cancel" data-dismiss="modal">
                    取消
                </button>
                <button type="button" class="btn btn-primary confirm">
                    保存
                </button>
            </div>
        </div>
    </div>
</div>

<!--  选择转交人员 弹窗 -->
<div class="modal fade" id="m_modal_sendOnUser" tabindex="-1" role="dialog" aria-labelledby="sendOnUser_model_title"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header" style="padding:10px 10px 0px 10px;height: 40px;">
                <h5 class="modal-title" id="sendOnUser_model_title">
                    任务转交对话框
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body miniScrollbar" style="padding: 5px">
                <div class="m-portlet m-portlet--bordered m-portlet--unair">
                    <div class="m-portlet__head">
                        <div class="m-portlet__head-caption">
                            <div class="m-portlet__head-title">
                                <h3 class="m-portlet__head-text">
                                    选择转交受理人
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div class="m-portlet__body" style="height: 260px;">
                        <div id="sendToAssigneeTree" class="tree-demo"></div>
                    </div>
                </div>
            </div>
            <div class="modal-footer" style="padding-right:19px;height: 45px;">
                <button type="button" class="btn btn-secondary cancel" data-dismiss="modal">
                    取消
                </button>
                <button type="button" class="btn btn-primary confirm"
                        onclick="agcloud.bpm.engine.metronic.sendOnTask()">
                    确定转交
                </button>
            </div>
        </div>
    </div>
</div>

</body>

<link type="text/css" rel="stylesheet"
      href="${pageContext.request.contextPath}/ui-static/agcloud/bpm/front/process/diagram/display/jquery.qtip.min.css"/>
<link type="text/css" rel="stylesheet"
      href="${pageContext.request.contextPath}/ui-static/agcloud/bpm/front/process/diagram/display/displaymodel.css"/>

<script type="text/javascript"
        src="${pageContext.request.contextPath}/ui-static/agcloud/bpm/front/process/diagram/display/jquery.qtip.min.js"></script>
<script type="text/javascript"
        src="${pageContext.request.contextPath}/ui-static/agcloud/bpm/front/process/diagram/display/raphael.js"></script>
<script type="text/javascript"
        src="${pageContext.request.contextPath}/ui-static/agcloud/bpm/front/process/diagram/display/bpmn-draw.js"></script>
<script type="text/javascript"
        src="${pageContext.request.contextPath}/ui-static/agcloud/bpm/front/process/diagram/display/bpmn-icons.js"></script>
<script type="text/javascript"
        src="${pageContext.request.contextPath}/ui-static/agcloud/bpm/front/process/diagram/display/Polyline.js"></script>
<%--<script type="text/javascript" src="${pageContext.request.contextPath}/ui-static/agcloud/bpm/front/process/diagram/display/displaymodel.js"></script>--%>

<script type="text/javascript"
        src="${pageContext.request.contextPath}/ui-static/agcloud/bpm/front/process/showDiagram.js"></script>
<script type="text/javascript"
        src="${pageContext.request.contextPath}/ui-static/agcloud/bpm/front/process/wfCommon.js"></script>
<script type="text/javascript"
        src="${pageContext.request.contextPath}/ui-static/agcloud/bpm/front/process/process_flow_main_index.js"></script>
</html>