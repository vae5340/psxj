/**
 * 流程起草、待办、在办、办结的主JS
 */
var sendTaskInfos;//当前环节发送相关信息
var sendTaskInfo;//当前环节发送相关信息
var nextTaskAssignee;//下一环节办理人
var nextTaskAssigneeId;//下一环节办理人id（登录名）
var nextTask;//下一环节名称
var sendParam;
var infoWinStayTime = 3000;//自动关闭提示框显示时间（毫秒）
var ID_SPLIT = ",";
var TEXT_SPLIT = "、";
var FLOW_MODEL_PROC = "proc";
var FLOW_MODEL_CASE = "case";
var FLOW_MODEL_CMMN = "cmmn";
//针对请假流程的测试数据
var formDatas;
var privInfo;
var buttonDatas = [{elementName:"暂存",elementCode:"wfBusSave",columnType:"button",isReadonly:0,isHidden:0,elementRender:'<button class="btn btn-info" type="button" onclick="wfBusSave();">暂存</button>'}
    // {elementName:"发送",elementCode:"wfBusSend",columnType:"button",isReadonly:0,isHidden:0,elementRender:'<button class="btn btn-info" type="button" onclick="wfBusSend();">发送</button>'},
    // {elementName:"填写意见",elementCode:"addTaskComment",columnType:"button",isReadonly:0,isHidden:0},
    // {elementName:"历史审批意见",elementCode:"listHistoryTaskComment",columnType:"button",isReadonly:0,isHidden:0},
    // {elementName:"查看流程图",elementCode:"showDiagramDialog",columnType:"button",isReadonly:0,isHidden:0},
    // {elementName:"任务回退",elementCode:"wfTaskReturn",columnType:"button",isReadonly:0,isHidden:0}
    ];
var mainFormIframe = "busFormIframe";
var zTreeObj;
//暂存
var wfBusSave = function(){
    agcloud.ui.metronic.showBlock();
    //保存当前 正在编辑 的 表单
    var curIframe = $("#form-tabs-content").find(".tab-pane.active").find("iframe")[0];
    //如果是主表单
    if(curIframe && curIframe.name == mainFormIframe){
        //调用子窗口中的工作流保存方法，会保存表单数据同时启动一个流程，并返回表单主键和流程相关变量信息
        // checkFormSubmitPower(mainFormIframe);//这个 要和setFormFieldPrivData一起使用，但是有格式问题，暂时弃用，
        // 2018-08-10 为兼容柔性工作流，加入flowModel参数 proc 表示BPMM标准工作流，case 表示平台自定义柔性工作流，cmmn 表示cmmn工作流
        var content = busFormIframe.window.wfBusSave(flowdefKey,taskId,masterEntityKey,appFlowdefId,processInstanceId,flowModel);
        //如果返回content不为空，则流程启动成功；如果为空则是流程已经启动过了，当前只是表单的更新操作
        if(checkNotNull(content)){
            //获取流程启动后的相关信息
            masterEntityKey = content.masterEntityKey;    //主表单主键
            flowdefKey = content.flowdefKey;              //流程定义key
            _tableName = content.masterEntityKey;
            _pkName = content.masterEntityKey;
            processInstanceId = content.processInstanceId;//流程实例id
            taskId = content.taskId;                      //当前任务id
            taskName = content.taskName;                  //当前任务名称
            currTaskDefId = content.currTaskDefId;        //当前任务定义id
            currProcDefVersion = content.currProcDefVersion;//当前流程定义版本
            flowModel = content.flowModel;                  //当前流程类型
            recordIds = content.recordIds;// 附件关联id
            btnDisable = false;
            //如果流程启动失败，给出失败提示信息
            if(!content.success){
                agcloud.ui.metronic.showErrorTip(content.failMessage);
                return;
            }
            //如果 流程启动后，当前节点不是当前登录人处理节点，给出提示，关闭窗口。所有工作流类型都一样。
            if(!content.currUserTask){
                var message = "流程启动成功！已转发至 <span style='color:#22D479;font-size:18px' >&nbsp;" + taskName + "</span>&nbsp;环节";
                if(checkNotNull(content.nextTaskAssigneeName)){
                    message += "，下一环节参与者为：<span style='color:#22D479;font-size:18px' >&nbsp;" + content.nextTaskAssigneeName + "&nbsp;。</span>";
                }
                showSuccessTip(message);
                return;
            }
            //如果当前节点 是 当前登录人 处理节点，则回显标题
            $("#currentTask").text("当前环节：" + taskName);
            //刷新权限信息，会重新生成主从表单，如果无法获取流程待办视图的权限配置信息，则给出提示，关闭窗口。
            var initSuccess = initPrivInfo();
            if(!initSuccess){
                agcloud.ui.metronic.hideBlock();
                showSuccessTip("保存成功！因当前系统没有配置流程待办视图，请到待办工作中继续办理！");
                return;
            }
        }else{
            //不会重新生成表单，
            // refreshForm(mainFormIframe);
        }
    }else{
        //如果主表单id不为空，则可以开始保存当前 正在编辑 的从表单，当前加上从表单的保存方法是 wfSave
        if(checkNotNull(masterEntityKey)){
            if(document.getElementById(curIframe.id).contentWindow.wfSave){
                // checkFormSubmitPower(curIframe.name);
                document.getElementById(curIframe.id).contentWindow.wfSave(masterEntityKey);
                // refreshForm(curIframe.name);
            }
        }
    }
    initAttachment();
    agcloud.ui.metronic.hideBlock();
    agcloud.ui.metronic.showSuccessTip('保存成功!',1000);
};
//发送
var wfBusSend = function(){
    wfBusSendDialog();
};
//发送对话框
function wfBusSendDialog() {
    if(checkNotNull(taskId)){
        $.ajax({
            url : ctx + '/front/task/getTaskSendConfig.do',
            data : {taskId: taskId},
            type : "post",
            dataType : "json",
            success : function (result) {
                if(result.success){
                    //获取下一环节信息
                    sendTaskInfos = result.content;
                    sendTaskInfo = sendTaskInfos[0];//默认节点信息是 第一个节点的
                    nextTask = sendTaskInfo.destActName;
                    nextTaskAssignee = sendTaskInfo.defaultSendAssignees;
                    nextTaskAssigneeId = sendTaskInfo.defaultSendAssigneesId;
                    //流程流转的提交参数
                    sendParam = {
                        taskId : taskId,
                        sendConfigs:[{
                            isUserTask : sendTaskInfo.userTask,
                            isEnableMultiTask : sendTaskInfo.multiTask,
                            assignees : nextTaskAssigneeId,
                            destActId : sendTaskInfo.destActId
                        }]
                    };
                    if(sendTaskInfo.directSend){
                        //如果是定向发送，则提示转发成功，不提示转发到谁那里
                        if (masterEntityKey != null && masterEntityKey != '' && taskId != null && taskId != '') {
                            busFormIframe.window.wfBusSave(flowdefKey, taskId, masterEntityKey,appFlowdefId,processInstanceId);
                            $.ajax({
                                url : ctx + '/front/task/wfSend.do',
                                data : {sendObjectStr:JSON.stringify(sendParam)},
                                type : "post",
                                dataType : "json",
                                success : function (result) {
                                    if(result.success){
                                        //这里要在提交后给出提示信息。
                                        var message = "<span style='color:#22D479;font-size:18px' >流程转发成功！</span>";
                                        message += "<span style='font-size:18px'>任务处理完毕，正等待其他用户处理！</span>";
                                        showSuccessTip(message);
                                    }else{
                                        showSuccessTip(result.message);
                                    }
                                },
                                error : function () {
                                    agcloud.ui.metronic.showErrorTip("流程转发失败！");
                                }
                            });
                        } else {
                            busFormIframe.window.wfBusSave(flowdefKey, taskId, masterEntityKey, appFlowdefId,processInstanceId);
                            showSuccessTip("保存成功!");
                        }
                    }else{
                        //不是定向发送 则弹出下一环节信息框，显示环节信息和办理人信息，包括环节选择和办理人选择。
                        var options = {
                            width : 800,
                            height : 430,
                            confirm : function () {
                                if(sendTaskInfo.userTask && !nextTaskAssigneeId){
                                    agcloud.ui.metronic.showErrorTip('您选择的下一环节需要选择办理人，没有办理人无法发送！');
                                    return;
                                }
                                if (masterEntityKey != null && masterEntityKey != '' && taskId != null && taskId != '') {
                                    busFormIframe.window.wfBusSave(flowdefKey, taskId, masterEntityKey,appFlowdefId,processInstanceId);
                                    $.ajax({
                                        url : ctx + '/front/task/wfSend.do',
                                        data : {sendObjectStr:JSON.stringify(sendParam)},
                                        type : "post",
                                        dataType : "json",
                                        success : function (result) {
                                            if(result.success){
                                                //这里要在提交后的回调中调用到下一环节的提示信息，这两个变量会在操作过程中被改变。
                                                var message = "流程已转发至 <span style='color:#22D479;font-size:18px' >&nbsp;" + nextTask + "</span>&nbsp;环节";
                                                if(checkNotNull(nextTaskAssignee)){
                                                    message += "，下一环节参与者为：<span style='color:#22D479;font-size:18px' >&nbsp;" + nextTaskAssignee + "&nbsp;。</span>";
                                                }
                                                showSuccessTip(message);
                                            }else{
                                                showSuccessTip(result.message);
                                            }
                                        },
                                        error : function () {
                                            agcloud.ui.metronic.showErrorTip("流程转发失败！",infoWinStayTime);
                                        }
                                    });
                                } else {
                                    busFormIframe.window.wfBusSave(flowdefKey, taskId, masterEntityKey, appFlowdefId,processInstanceId);
                                    showSuccessTip("保存成功!");
                                }
                            },
                            callback : function () {
                                //初始化下一环节信息，这里后面可能有多个环节，要根据选择的环节获取该环节的处理人，再供用户选择。
                                // 如果多个环节时要绑定单选按钮事件，更新选择的环节到nextTask变量中
                                $("#nextTaskList").empty();
                                var nextTaskInfo = '';
                                for(var i=0; i<sendTaskInfos.length; i++){
                                    var temp = sendTaskInfos[i];
                                    var checked = '';
                                    if(i == 0){
                                        checked = '" checked="checked';
                                    }
                                    nextTaskInfo += '<label class="m-radio">' +
                                        '<input type="radio" onclick="selectNextNode(\''+temp.destActId+'\')" name="nextTask" value="'+ temp.destActId + checked +'">' +
                                        '<span></span>' +
                                        '<div style="display: inline;font-size: 16px;height: 21px;line-height: 20px;">'+ temp.destActName +'</div>' +
                                        '</label>';
                                }

                                $("#nextTaskList").append(nextTaskInfo);
                                //下一环节参与人信息
                                if(checkNotNull(nextTaskAssignee)){
                                    $("#nextAssignee").val(nextTaskAssignee);
                                }else{
                                    $("#nextAssignee").val("同时发送给主办及协办人员");
                                }
                                //备注说明信息
                                var commentTip = "提示：";
                                if(sendTaskInfo.message){
                                    commentTip += sendTaskInfo.message;
                                }
                                if(sendTaskInfo.needSelectAssignee){
                                    commentTip += "然后请点击“发送”按钮发送到所选环节";
                                }else{
                                    commentTip += "请点击“发送”按钮发送到所选环节";
                                }
                                $("#commentTip").text(commentTip);
                                //选择按钮启用/禁用
                                if(!sendTaskInfo.needSelectAssignee){
                                    $("#selectAsingee").attr("disabled",true);
                                }
                            }
                        }
                        showModal("m_modal_saveAndSend",options);
                    }
                }else{
                    agcloud.ui.metronic.showErrorTip('保存并发送失败!' + result.content);
                }
            },
            error : function () {
                agcloud.ui.metronic.showErrorTip('保存并发送失败!');
            }
        });
    }else{
        agcloud.ui.metronic.showErrorTip("请先点击暂存按钮，保存表单信息！");
    }
}

function selectNextNode(destActId){
    if(destActId){
        for(var i= 0;i<sendTaskInfos.length;i++){
            var currSendTask = sendTaskInfos[i];
            var currDestActId = currSendTask.destActId;

            if(currDestActId==destActId){
                sendTaskInfo = sendTaskInfos[i];
                nextTaskAssignee = sendTaskInfo.defaultSendAssignees;
                nextTaskAssigneeId = sendTaskInfo.defaultSendAssigneesId;
                nextTask = sendTaskInfo.destActName;

                //流程流转的提交参数
                /*sendParam = [{
                    taskId : taskId,
                    isUserTask : sendTaskInfo.userTask,
                    isMultiTask : sendTaskInfo.multiTask,
                    assignees : nextTaskAssigneeId,
                    destActId : sendTaskInfo.destActId
                }];*/
                sendParam = {
                    taskId : taskId,
                    sendConfigs:[{
                        isUserTask : sendTaskInfo.userTask,
                        isEnableMultiTask : sendTaskInfo.multiTask,
                        assignees : nextTaskAssigneeId,
                        destActId : sendTaskInfo.destActId
                    }]
                };

                //下一环节参与人信息
                if(checkNotNull(nextTaskAssignee)){
                    $("#nextAssignee").val(nextTaskAssignee);
                }else{
                    $("#nextAssignee").val("同时发送给主办及协办人员");
                }
                //备注说明信息
                var commentTip = "提示：";
                if(sendTaskInfo.message){
                    commentTip += sendTaskInfo.message;
                }
                if(sendTaskInfo.needSelectAssignee){
                    commentTip += "然后请点击“发送”按钮发送到所选环节";
                }else{
                    commentTip += "请点击“发送”按钮发送到所选环节";
                }
                $("#commentTip").text(commentTip);
                //选择按钮启用/禁用
                if(!sendTaskInfo.needSelectAssignee){
                    $("#selectAsingee").attr("disabled",true);
                }else{
                    $("#selectAsingee").attr("disabled",false);
                }
            }
        }
    }
}

//选择流程处理人对话框
var selectedAssignee = [];
//双击删除已选参与人
function removeAssignee() {
    var id = $(this).attr("data-id").trim();
    var index = arrayIndexOf(selectedAssignee,id);
    if(index != -1){
        //从数组的index脚标开始，删除一个元素
        selectedAssignee.splice(index,1);
        //删除html节点
        $(this).remove();
        //同步去掉zTree上的勾
        toggleCheckAssignee(id,false);
        //多余一步，为了兼容zTree的一步加载完成操作同步默认办理人
        if(id == nextTaskAssigneeId)
            nextTaskAssigneeId = null;
    }
}
//添加参与人，会根据当前可选办理人个数，进行控制。
function addAssignee(id,text) {
    //判断是否已经选过了
    var index = arrayIndexOf(selectedAssignee,id);
    if(index == -1){
        //如果不是多工作项的话，就只能选择一个参与者
        if(!sendTaskInfo.multiTask){
            $("#selectedAssignees").empty();
            selectedAssignee = [];
        }
        var str = '<a id="selected_assignee_' + id + '" data-id="'+ id +'" href="#" class="m-list-search__result-item" style="display: block;border-bottom: 1px solid #ebedf2;" title="双击可移除">' +
            '<span class="m-list-search__result-item-icon">' +
            '<i class="fa fa-user-md" style="font-size: 18px;padding: 0px 5px;"></i>' +
            '</span>' +
            '<span class="m-list-search__result-item-text">'+ text +'</span>' +
            '</a>';
        $("#selectedAssignees").append(str);
        $("#selectedAssignees").find("a").dblclick(removeAssignee);
        selectedAssignee.push({id:id,text:text});
    }
}
//zTree树上勾掉时，移除办理人
function uncheckRemoveAssignee(id) {
    var index = arrayIndexOf(selectedAssignee,id);
    if(index != -1) {
        //从数组的index脚标开始，删除一个元素
        selectedAssignee.splice(index, 1);
        $("#selected_assignee_" + id).remove();
        //多余一步，为了兼容zTree的一步加载完成操作同步默认办理人
        if(id == nextTaskAssigneeId)
            nextTaskAssigneeId = null;
    }
}
//在树上勾选已选的办理人，对应jsTree的，zTree不会用到
function addCheckedAssignee(id) {
    var instance = $('#assigneeTree').jstree(true);
    instance.uncheck_all();
    instance.check_node(id);
}
//zTree的勾选办理人方法
function toggleCheckAssignee(id,flag) {
    if(zTreeObj){
        var nodes = zTreeObj.getNodesByParam("textValue", id, null);
        if(nodes && nodes.length > 0){
            for(var i=0; i<nodes.length; i++){
                zTreeObj.checkNode(nodes[i], flag, false);
            }
        }
    }
}
//判断数组中是否存在value数据，-1 没有，否则有
function arrayIndexOf(arr, value) {
    var index = -1;
    for(var i=0; i<arr.length; i++){
        if(value == arr[i].id){
            index = i;
            break;
        }
    }
    return index;
}
//选择参与人对话框
function selectAsingeeDialog() {
    var options = {
        width : 800,
        height : 530,
        confirm : function () {
            //点击确定按钮，拼接参数回填到上一级窗口的表单上，如果选择为空，则还是使用默认办理人
            if(selectedAssignee.length > 0){
                var assignee = "";
                var assigneeCn = "";
                for(var i in selectedAssignee){
                    assignee += selectedAssignee[i].id + ID_SPLIT;
                    assigneeCn += selectedAssignee[i].text + TEXT_SPLIT;//中文名用顿号
                }
                nextTaskAssigneeId = assignee.substring(0,assignee.length - 1);
                nextTaskAssignee = assigneeCn.substring(0,assigneeCn.length - 1);
                sendTaskInfo.defaultSendAssignees = nextTaskAssignee;
                sendTaskInfo.defaultSendAssigneesId = nextTaskAssigneeId;
            }else{
                nextTaskAssignee = sendTaskInfo.defaultSendAssignees;
                nextTaskAssigneeId = sendTaskInfo.defaultSendAssigneesId;
            }
            //设置到提交参数中
            sendParam.sendConfigs[0].assignees = nextTaskAssigneeId;
            //回显到发送信息框中
            $("#nextAssignee").val(nextTaskAssignee);
        },
        callback : function () {
            //清空已选的办理人列表
            $("#selectedAssignees").empty();
            selectedAssignee = [];
            //构建参与者范围树
            // buildAssigneeRangeTree();
            buildAssigneeRangeZTree();
            //绑定添加按钮点击事件
            // $(".addAssignee").click(function () {
            //     var nodes = $("#assigneeTree").jstree("get_checked");
            //     $.each(nodes, function(i, n) {
            //         if(n.indexOf('NODE') == 0){
            //             //这里需要考虑不加载子节点，就勾选父节点的清空。
            //         }else if($("#" + n).hasClass("jstree-leaf")){
            //             var id = $("#"+n).find("a").parent().attr("id").trim();
            //             var text = $("#"+n).find("a").text().trim();
            //             addAssignee(id,text);
            //         }
            //     });
            //     $("#selectedAssignees").find("a").dblclick(removeAssignee);
            // });
            //绑定表格行的点击事件，默认双击删除行
            // $("#selectedAssignees").find("a").dblclick(removeAssignee);
        }
    }
    showModal("m_modal_selectAssignee",options);
}
//创建参与人组织机构树
function buildAssigneeRangeTree() {
    var assigneeRangeKey;
    var tempDestActId = sendTaskInfo.destActId;
    //先请求参与者范围的字符串key，再根据key获取树根节点
    $.ajax({
        url: ctx + "/front/task/getAssigneeRangeByCurrTaskId.do",
        data:{taskId:taskId,destActId:tempDestActId},
        type:"post",
        async:false,
        success:function (result) {
            if(result.success){
                assigneeRangeKey = result.content.assigneeRange;
            }
        },
        error:function() {
            agcloud.ui.metronic.showErrorTip("请求参与人信息失败！");
        }
    });
    if(!assigneeRangeKey) return;
    var firstRequest = true;
    //初始化待选择办理人，树结构
    $('#assigneeTree').jstree("destroy");
    $('#assigneeTree').jstree({
        'plugins': ["wholerow", "checkbox", "types"],
        'core': {
            "themes" : {
                "responsive": false
            },
            'data':  {
                'url' : function (node) {
                    return ctx + "/front/task/getAssigneeRangeTree.do";
                },
                'data' : function (node) {
                    if(firstRequest){
                        firstRequest = false;
                        return { 'assigneeRangeKey': "$ORG.150,$ROLE.a73fc518-7ec6-4d74-8f06-4786b45f01c9,$POS.801dc783-2e5f-4cba-b4f1-c4f3d0094559," + assigneeRangeKey };
                        // return { 'assigneeRangeKey': assigneeRangeKey };
                    }else{
                        return { 'parentId' : node.id};
                    }
                }
            },
            'multiple': false
        },
        "checkbox":{
            "tie_selection":false
        },
        "types" : {
            "default" : {
                "icon" : "fa fa-user-md"
            }
        }
    });
    $('#assigneeTree').on("loaded.jstree", function (e, data) {
        //初始化已选择参与者,这里必须要用后台返回的原始数据。
        if(checkNotNull(nextTaskAssigneeId)){
            if(nextTaskAssigneeId.indexOf(ID_SPLIT) != -1){
                var texts = nextTaskAssignee.split(TEXT_SPLIT);
                var ids = nextTaskAssigneeId.split(ID_SPLIT);
                for(var i=0; i<ids.length; i++){
                    addAssignee(ids[i],texts[i]);
                }
                addCheckedAssignee(ids);
            }else{
                addAssignee(nextTaskAssigneeId,nextTaskAssignee);
                addCheckedAssignee(nextTaskAssigneeId)
            }
        }
    });
    //当只能选择一个办理人时，树是只能单选的
    $('#assigneeTree').on('check_node.jstree', function(e, obj) {
        var ref = $('#assigneeTree').jstree(true);
        if(!sendTaskInfo.multiTask){
            if(obj.node.id.indexOf('NODE') != -1){
                ref.uncheck_node(obj.node);
                return false;
            }
            var nodes = ref.get_checked();  //使用get_checked方法
            $.each(nodes, function(i, nd) {
                if (nd != obj.node.id)
                    ref.uncheck_node(nd);
            });
        }
    });
}
//新增组织机构树，目前使用中20180912
function buildAssigneeRangeZTree() {
    var assigneeRangeKey;
    var tempDestActId = sendTaskInfo.destActId;
    //先请求参与者范围的字符串key，再根据key获取树根节点
    $.ajax({
        url: ctx + "/front/task/getAssigneeRangeByCurrTaskId.do",
        data:{taskId:taskId,destActId:tempDestActId},
        type:"post",
        async:false,
        success:function (result) {
            if(result.success){
                assigneeRangeKey = result.content.assigneeRange;
            }
        },
        error:function() {
            agcloud.ui.metronic.showErrorTip("请求参与人信息失败！");
        }
    });
    if(!assigneeRangeKey) return;
    var setting = {
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pId"
            }
        },
        check: {
            enable: true,
            chkboxType:{ "Y" : "", "N" : "" },
            chkStyle: "checkbox",
            radioType: "all"   //对所有节点设置单选
        },
        //使用异步加载，必须设置 setting.async 中的各个属性
        async: {
            //设置 zTree 是否开启异步加载模式
            enable: true,
            autoParam:["id","dataType"],
            dataType:"json",
            type:"post",
            // url:ctx+"/front/task/getAssigneeRangeZTree.do?assigneeRangeKey=$ROLE.a73fc518-7ec6-4d74-8f06-4786b45f01c9,$POS.801dc783-2e5f-4cba-b4f1-c4f3d0094559," + assigneeRangeKey
            url:ctx+"/front/task/getAssigneeRangeZTree.do?assigneeRangeKey=" + assigneeRangeKey
        },
        callback: {
            onAsyncSuccess: function(e, treeId, treeNode) {
                if(checkNotNull(nextTaskAssigneeId)){
                    if(nextTaskAssigneeId.indexOf(ID_SPLIT) != -1){
                        var texts = nextTaskAssignee.split(TEXT_SPLIT);
                        var ids = nextTaskAssigneeId.split(ID_SPLIT);
                        for(var i=0; i<ids.length; i++){
                            addAssignee(ids[i],texts[i]);
                            toggleCheckAssignee(ids[i],true);
                        }
                    }else{
                        addAssignee(nextTaskAssigneeId,nextTaskAssignee);
                        toggleCheckAssignee(nextTaskAssigneeId,true);
                    }
                }
            },
            onClick: function (){
                var nodes = zTreeObj.getSelectedNodes();
                for(var i=0;i<nodes.length;i++){
                    if(nodes[i].dataType != 'USER') continue;
                    if(nodes[i].checked){
                        zTreeObj.checkNode(nodes[i], false, false);
                        uncheckRemoveAssignee(nodes[i].textValue);
                    }else{
                        zTreeObj.checkNode(nodes[i], true, false);
                        //改为直接在树上勾选时添加办理人
                        addAssignee(nodes[i].textValue,nodes[i].name);
                        //根据节点配置，过滤单选
                        if(!sendTaskInfo.multiTask){
                            var nodes1 = zTreeObj.getCheckedNodes(true);
                            for(var j=0;j<nodes1.length;j++){
                                if(nodes[i].id !=  nodes1[j].id){
                                    zTreeObj.checkNode(nodes1[j], false, false);
                                }
                            }
                        }
                    }
                }
            },
            onCheck: function (e,treeId,treeNode) {
                //根据节点配置，过滤单选
                if(!sendTaskInfo.multiTask && treeNode.checked){
                    var nodes = zTreeObj.getCheckedNodes(true);
                    for(var i=0;i<nodes.length;i++){
                        if(treeNode.id !=  nodes[i].id){
                            zTreeObj.checkNode(nodes[i], false, false);
                        }
                    }
                }
                //同步选择办理人
                if(treeNode.checked){
                    addAssignee(treeNode.textValue,treeNode.name);
                }else{
                    uncheckRemoveAssignee(treeNode.textValue);
                }
                //暂时在check时去掉节点的选择状态
                var nodes = zTreeObj.getSelectedNodes();
                for(var i=0;i<nodes.length;i++){
                    zTreeObj.cancelSelectedNode(nodes[i]);
                }
            }
        }
    };
    zTreeObj = jQuery.fn.zTree.init(jQuery("#assigneeOrgTree"), setting);
}
//添加意见
function addTaskComment(){
    var options = {
        width : 600,
        height : 450,
        confirm : saveTaskComment,
        cancel : function () {
        },
        callback : function () {
            //重置表单
            clearForm("addTaskCommentForm");
            //这里的数据可以从数据库获取，待扩展
            var data = [{opinion:"办理中"},{opinion:"同意办理"},{opinion:"不同意办理"},
        {opinion:"情况属实，批准"},{opinion:"通过"},{opinion:"不通过"}];
            //初始化表格
            var datatable = $('#commentTable').mDatatable({
                data: {
                    type: 'local',
                    source: data
                },
                layout: {
                    theme: 'default',
                    class: '',
                    scroll: true,
                    height: 300,
                    footer: false
                },
                sortable: true,
                filterable: false,
                pagination:false,
                columns: [{
                    field: "opinion",
                    title: "常用意见",
                    width: 150
                }]
            });
            $('#commentTable').css({"border": "1px solid #e9ecef"});
            //绑定表格行的点击事件
            $("#commentTable").find("tr").dblclick(function () {
                var opinion = $(this).text();
                $("#message").text(opinion);
            });
        }
    }
    showModal("m_modal_comment",options);
}
//保存意见
function saveTaskComment(){
    var d = {};
    var t = $('#addTaskCommentForm').serializeArray();
    $.each(t, function() {
        d[this.name] = this.value;
    });
    d["taskId"] = taskId;
    d["processInstanceId"] = processInstanceId;
    $.ajax({
        url: ctx+'/front/task/addTaskComment.do',
        type: 'POST',
        data: d,
        success: function (result) {
            if (result.success){
                agcloud.ui.metronic.showSuccessTip('保存成功!',1000);
            }else {
                agcloud.ui.metronic.showErrorTip(result.message);
            }
        },
        error:function(){
            agcloud.ui.metronic.showErrorTip('保存失败!');
        }
    });
}
//查看历史意见
function listHistoryTaskComment(){
    var options = {
        width : 900,
        height : 600,
        btnHidden : true,
        callback : loadHistoryTaskComment
    }
    showModal("m_modal_historyComment",options);
}
//加载历史意见
function loadHistoryTaskComment(){
    var data;
    $.ajax({
        url:ctx+'/front/task/listHistoryComment.do?processInstanceId=' + processInstanceId,
        type:"post",
        async:false,
        success:function (result) {
            data = result;
        }
    });
    //先干掉表格，才能刷新数据
    $('#historyCommentTable').mDatatable('destroy');
    //初始化表格
    var datatable = $('#historyCommentTable').mDatatable({
        data: {
            type: 'local',
            source: data
        },
        layout: {
            theme: 'default',
            class: '',
            scroll: true,
            height: 450,
            footer: false
        },
        sortable: true,
        filterable: false,
        pagination:false,
        columns: [{
            field: "nodeName",
            title: "环节名称",
            textAlign: 'center',
            sortable: false,
            width: 150
        },{
            field: "commentMessage",
            title: "办理意见",
            textAlign: 'center',
            sortable: false,
            width: 250
        },{
            field: "taskAssignee",
            title: "办理人",
            textAlign: 'center',
            sortable: false,
            width: 80
        },{
            field: "sigeInDate",
            title: "签收时间",
            textAlign: 'center',
            width: 200,
            template: function (row, index, datatable) {
                return formatterDateTime(row.sigeInDate);
            }
        },{
            field: "taskState",
            title: "办理状态",
            textAlign: 'center',
            sortable: false,
            width: 80,
            template: function (row, index, datatable) {
                return formatterTaskState(row.taskState);
            }
        }]
    });
    $('#historyCommentTable').css({"border": "1px solid #e9ecef"});
    //刷新一下，不然没有排序功能
    datatable.reload();
}
//格式化时间
function formatterDateTime(value){
    if(value==null&&value==''){
        return '';
    }
    return dateFormatByExp(value,'yyyy-MM-dd hh:mm:ss');
}
function formatterTaskState(value){
    if(value==null&&value==''){
        return '';
    }
    if(value==1){
        return '<p style="color: green">处理中</p>';
    }else if(value==2){
        return '已完成';
    }else if(value==3){
        return '<p style="color: orange">已回退</p>';
    }else if(value==4){
        return '<p style="color: orange">已转交</p>';
    }
}
//查看流程图
function showDiagramDialog(){
    $('#bpmnModel').html('');//先清空流程图容器div
    var options = {
        width : 1000,
        height : 600,
        btnHidden : true,
        callback : function(){
            _showProcessDiagram();
            //针对modal框的偏移处理
            var interval = window.setInterval(function () {
                if($('#bpmnModel').find("svg text").length > 0){
                    $('#bpmnModel').find("svg text").each(function () {
                        $(this).children(":first").attr("dy",4);
                    });
                    window.clearInterval(interval);
                }
            },300);
        }
    }
    showModal("m_modal_Diagram",options);
}
//任务回退
function wfTaskReturn() {
    agcloud.bpm.engine.metronic.returnPrevTask(taskId);
}
//面板全屏
function panelInit() {
    var portlet_2 = $('#m_portlet_tools_2').mPortlet();
    portlet_2.on('afterFullscreenOn', function(portlet) {
        var scrollable = portlet.getBody().find('> .m-scrollable');
        scrollable.data('original-height', scrollable.data('max-height'));
        scrollable.css('height', '100%');
        scrollable.css('max-height', '100%');
        mApp.initScroller(scrollable, {});
    });
    portlet_2.on('afterFullscreenOff', function(portlet) {
        // toastr.warning('After fullscreen off event fired!');
        var scrollable = portlet.getBody().find('> .m-scrollable');
        scrollable.css('height', scrollable.data('original-height'));
        scrollable.data('max-height', scrollable.data('original-height'));
        mApp.initScroller(scrollable, {});
    });
}
//面板高度自适应
function autoHeight() {
    var autoHeightForm = window.innerHeight - 210;
    var autoHeightAttach = window.innerHeight - 143;
    $("#attachContent").height(autoHeightAttach);
    $("#form-tabs-content").height(autoHeightForm);
}
//获取初始化权限信息
function initPrivInfo() {
    var initSuccess = true;
    if(currTaskDefId && currProcDefVersion){
        $.ajax({
            url:ctx + '/front/task/getAuthorizeElement.do',
            type:"post",
            data:{
                appFlowdefId:appFlowdefId,
                privMode:"act",
                actId:currTaskDefId ,
                viewId:viewId,
                version:currProcDefVersion
            },
            // dataType :"json",
            async:false,
            success:function (result) {
                if(checkNull(result)){
                    initSuccess = false;//获取初始化权限信息失败，需要给出提示，不进行下一步操作，关闭窗口。
                    return;
                }
                if(typeof result == 'string'){
                    privInfo = JSON.parse(result);
                }else{
                    privInfo = result;
                }
                buttonDatas = [];
                if(privInfo.publicEleList && privInfo.publicEleList.length > 0){
                    buttonDatas = privInfo.publicEleList;
                    sortButtonArray(buttonDatas);
                }
                for(var i in privInfo){
                    if(i != "publicEleList"){
                        for(var j in formDatas){
                            if(i == formDatas[j].formId){
                                formDatas[j].formField = privInfo[i];
                                break;
                            }
                        }
                    }
                }
            },
            error:function(XMLHttpRequest, textStatus) {
                initSuccess = false;
                buttonDatas = [];
                console.log(textStatus + " 没有获取到页面元素的权限数据");
            }
        });
    }
    //如果获取权限成功，才会初始化按钮和表单，否则没有任何页面元素被渲染
    if(initSuccess){
        //初始化按钮
        initButtons();
    }else{
        $("#buttonBar").empty();//初始化失败则清空工具栏
    }
    //初始化表单
    initForms();
    return initSuccess;
}
//目前使用这个排序
function sortButtonArray(arr) {
    var compare = function (obj1, obj2) {
        var val1 = obj1.sortNo;
        var val2 = obj2.sortNo;
        if(val1 && val2){
            if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }
        }
    }
    arr.sort(compare);
}
var busFormIframeArray = new Array();

//初始化挂接的表单，表单的编辑权限已改由表单中的工作流标签控制了
function initForms() {
    var $formTab = $("#form-tabsId");
    var $formTabContent = $("#form-tabs-content");
    $formTab.empty();
    $formTabContent.empty();
    var index = 1;
    var masterFormName = "主表单"
    var disabledSubFormTab = "disabled";
    if(checkNotNull(masterEntityKey)){
        disabledSubFormTab = "";
    }
    for(var i in formDatas){
        var form = formDatas[i];
        if(form.isMasterForm == "1"){
            var formUrl = ctx + form.formLoadUrl + '?appFlowdefId='+appFlowdefId +"&currTaskDefId=" +currTaskDefId +"&currProcDefVersion=" +currProcDefVersion +"&viewId=" +viewId;
            $formTab.append("<li class='nav-item m-tabs__item'>" +
                "<a class='nav-link m-tabs__link active' data-toggle='tab' href='#m_tabs_6_"+ index +"' role='tab'>" +
                form.formName +
                "</a>" +
                "</li>");
            $formTabContent.append('<div class="tab-pane active" style="height: 98%;" id="m_tabs_6_'+ index +'" role="tabpanel">' +
                '<iframe id="'+ mainFormIframe+ '" name="'+ mainFormIframe +'" src="'+ formUrl
                + '" scrolling="no" style="width: 100%;height: 100%;" frameborder="0"/>'+
                '</div>');
            //同时设置表单权限，表单权限已由工作流标签控制，js控制已弃用
            // setFormEditPower(mainFormIframe,form.formCode,form.formField);
            //只设置权限信息，用于校验保存的表单值
            // setFormFieldPrivData(mainFormIframe,form.formField);
            index++;
            masterFormName = form.formName;
        }
    }
    for(var i in formDatas){
        var form = formDatas[i];
        var formUrl = ctx + form.formLoadUrl + '?appFlowdefId='+appFlowdefId +"&currTaskDefId=" +currTaskDefId +"&currProcDefVersion=" +currProcDefVersion +"&viewId=" +viewId;
        if(form.isMasterForm == "0"){
            $formTab.append("<li class='nav-item m-tabs__item'>" +
                "<a class='nav-link m-tabs__link "+ disabledSubFormTab + "' data-toggle='tab' href='#m_tabs_6_"+ index +"' role='tab'>" +
                form.formName +
                "</a>" +
                "</li>");
            var frameName = "busFormIframe_" + index;
            $formTabContent.append('<div class="tab-pane" id="m_tabs_6_'+ index +'" style="height: 98%;" role="tabpanel">' +
                '<iframe id="'+ frameName +'"  name="'+ frameName + '" src="'+ formUrl + '" scrolling="no" style="width: 100%;height: 100%;" frameborder="0"/>'+
                '</div>');
            // setFormEditPower(frameName,form.formCode,form.formField);
            // setFormFieldPrivData(frameName,form.formField);
            index++;
            busFormIframeArray.push(frameName);
        }
    }
    //添加从表单tab的点击事件，确保主表单保存成功后，才能进行从表单填写
    $("a.m-tabs__link").click(function () {
        if($(this).hasClass("disabled")){
            var currentFormName = $(this).text();
            agcloud.ui.metronic.showErrorTip("请先暂存" + masterFormName + "信息！再填写" + currentFormName + "信息！");
            $(this).css("outline","none");
            return;
        }
    })
}
//根据权限配置，渲染按钮，由于静默刷新的需求，工具栏按钮暂不使用工作流标签控制
function initButtons() {
    var $buttonBar = $("#buttonBar");
    $buttonBar.empty();
    for(var i in buttonDatas){
        var button = buttonDatas[i];
        if(button.isHidden == 0){
            //替换 id为 当前页面的任务id 变量值
            var realText = button.elementRender.replace("#[id]",taskId);
            if(button.isReadonly == 1){
                //如果当前按钮别锁定，即不可点击，则设置为disabled 且去掉 onclick事件，避免被前端修改。
                var id = "button_" + taskId + i;
                if(realText.indexOf("onclick") != -1){
                    realText = realText.replace("onclick"," id='"+ id +"' disabled='disabled' title = '已被锁定' data-clc");
                }else{
                    realText = realText.replace("onClick"," id='"+ id +"' disabled='disabled' title = '已被锁定' data-clc");
                }
                $buttonBar.append(realText);
                $("#" +　id).removeAttr("data-clc");
            }else{
                $buttonBar.append(realText);
            }
            $buttonBar.append("&nbsp;&nbsp;");//按钮间隔
        }
    }
}
//根据配置显示附件栏
function initAttachment() {
    var src = ctx + "/me/bsc/att/commonIndex.do";
    $("#attachContentFrame").attr("src",src);
}

/**
 * 公用窗口初始化方法，当前流转界面的对话框都是使用这个方法进行展示。
 * 根据属性进行配置，窗口默认居中，还可以扩展，modalId可以指定显示哪一个窗口。
 * 属性包括
 * title 标题
 * content 对话框体内容 html片段，因为很多内容是动态加载的，可以先用js组装
 * width 宽度
 * height 高度
 * callback 窗口显示的回调函数，可用于加载窗口体的内容或初始化操作
 * confirm 确定按钮的 函数 可用于 保存或 ajax操作
 * cancel  取消按钮的 函数 可用于销毁操作
 * buttons 自定义按钮，是一个数组，子项的function属性用于定义操作函数 text 是按钮名称
 * btnHidden 隐藏窗口底部的按钮
 */

function showModal(modalId,options) {
    var $mModalForm = $("#" + modalId);
    $mModalForm.find(".modal-footer").show();
    //窗口标题
    if(options.title){
        $mModalForm.find(".modal-title").text(options.title);
    }
    //窗口内容，html片段，样式自调
    if(options.content){
        $mModalForm.find(".modal-body").empty();
        $mModalForm.find(".modal-body").append(options.content);
    }
    //窗口宽度，只能针对.modal-dialog修改，并且要设置最大宽度
    if(!options.width){
        options.width = 500;
    }
    $mModalForm.find(".modal-dialog").css("max-width",options.width + "px");
    $mModalForm.find(".modal-dialog").width(options.width);
    //窗口高度，必须针对.modal-content设置
    if(!options.height){
        options.height = 500;
    }
    $mModalForm.find(".modal-content").height(options.height);
    //确定按钮事件
    if(options.confirm){
        //必须先解除绑定，再重新绑定事件
        $mModalForm.find(".confirm").unbind('click');
        $mModalForm.find(".confirm").bind('click',function () {
            options.confirm();
            $mModalForm.modal("hide");
        });
    }
    //按钮文本名称
    // $mModalForm.find(".confirm").text("保存");
    // if(options.confirmText){
    //     $mModalForm.find(".confirm").text(options.confirmText);
    // }
    //取消按钮事件
    if(options.cancel){
        $mModalForm.find(".cancel").unbind('click');
        $mModalForm.find(".cancel").bind('click',function () {
            options.cancel();
        });
    }
    //取消按钮名称
    // $mModalForm.find(".cancel").text("取消");
    // if(options.cancelText){
    //     $mModalForm.find(".cancel").text(options.cancelText);
    // }
    //自定义按钮，除了确定、取消按钮之外的。
    $mModalForm.find(".modal-footer .otherBtn").each(function () {
        $(this).remove();//先清除之前添加的其他按钮
    });
    if(options.buttons){
        for(var i=0; i<options.buttons.length; i++){
            var btn = options.buttons[i];
            var btnStr = '<button type="button" class="btn btn-secondary otherBtn" onclick="'+ btn.function +'()">'+ btn.text + '</button>';
            $mModalForm.find(".modal-footer").prepend(btnStr);//在footer元素的开头append
        }
    }
    //窗口初始化完成回调函数
    if(options.callback){
        options.callback();
    }
    //是否隐藏按钮
    if(options.btnHidden){
        $mModalForm.find(".modal-footer").hide();
    }
    //显示窗口
    $mModalForm.modal("show");
}
function showSuccessTip(message) {
    var options = {
        message:message,
        time:infoWinStayTime,
        closeWin:true,//默认会关闭窗口，并刷新父窗口
        type:"success",
        width:800
    }
    agcloud.ui.metronic.showSwal(options);
}
//清空表单
function clearForm(selector) {
    $(':input','#' + selector)
        .not(':button, :submit, :reset, :hidden')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    $("#" + selector + " textarea").text("");
}
//检查是否为空
function checkNull(str) {
    if(str == null)
        return true;
    if(str == '')
        return true;
    if(str == 'undefined')
        return true;
    if(str == '[]')
        return true;
    if(str == 'null')
        return true;
    if($.isEmptyObject(str))
        return true;
}
function checkNotNull(str) {
    return !checkNull(str);
}
//设置表单元素编辑权限，在表单初始化后调用
function setFormEditPower(frameName,fromCode,formField) {
    var frame = window.frames[frameName];
    var interval = window.setInterval(function () {
        if (frame.window.agcloud && frame.window.agcloud.bpm && frame.window.agcloud.bpm.form) {
            window.clearInterval(interval);
            frame.window.agcloud.bpm.form.metronic.formViewAndEditPower("#"+fromCode,formField);
        }
    }, 300);
}
//校验表单提交字段值的有效性，与setFormEditPower对应控制表单编辑权。在调用save前调用
function checkFormSubmitPower(frameName) {
    var frame = window.frames[frameName];
    if (frame.window.agcloud.bpm.form.metronic.formSubmitDataCheck) {
        frame.window.agcloud.bpm.form.metronic.formSubmitDataCheck();
    }
}
//异步刷新表单
function refreshForm(frameName) {
    var frame = window.frames[frameName];
    if (frame.window.agcloud.bpm.form.metronic.refreshForm) {
        frame.window.agcloud.bpm.form.metronic.refreshForm();
    }
}
function setFormFieldPrivData(frameName,formField) {
    var frame = window.frames[frameName];
    var interval = window.setInterval(function () {
        if (frame.window.agcloud && frame.window.agcloud.bpm && frame.window.agcloud.bpm.form) {
            window.clearInterval(interval);
            frame.window.agcloud.bpm.form.metronic.setCurrentPrivData(formField);
        }
    }, 300);
}
$(function(){
    //先判断是否初始化正常，不正常则给出提示，关闭窗口
    if(checkNotNull(initError)){
        agcloud.ui.metronic.showErrorTip(initError,3000,true);
        return;
    }
    //显示遮罩
    agcloud.ui.metronic.showBlock();
    if(formJson){
        //解析表单数据
        formDatas = JSON.parse(formJson);
    }
    //初始化界面页面元素权限
    var isSuccess = initPrivInfo();
    // if(!isSuccess){
    //     agcloud.ui.metronic.showErrorTip("获取当前流程关联信息失败！",2000,true);
    // }
    //初始化附件
    initAttachment();
    //面板事件
    panelInit();
    //面板高度自适应
    autoHeight();
    $(window).resize(function () {
        autoHeight();
    });
    agcloud.ui.metronic.hideBlock();
});

//初始化转交任务
function initSendOnTask (taskId){
    var assigneeRangeKey;
    //先请求参与者范围的字符串key，再根据key获取树根节点
    $.ajax({
        url: ctx + "/front/task/getCurrTaskAssigneeOrRange.do",
        data:{taskId:taskId},
        type:"post",
        async:false,
        success:function (result) {
            if(result.success){
                assigneeRangeKey = result.content.assigneeRange;
            }
        },
        error:function() {
            agcloud.ui.metronic.showErrorTip("请求参与人信息失败！");
        }
    });

    var options = {
        width : 600,
        height : 430,
        btnHidden : false,
        confirm : function () {
            if (taskId != null && taskId != '') {
                var nodes = $("#sendToAssigneeTree").jstree("get_checked");
                agcloud.bpm.engine.metronic.sendOnTask(taskId,nodes[0]);
            }
        },
        callback : function (){
            var firstRequest = true;
            //初始化待选择办理人，树结构
            $('#sendToAssigneeTree').jstree("destroy");
            $('#sendToAssigneeTree').jstree({
                'plugins': ["wholerow", "checkbox", "types"],
                'core': {
                    "themes" : {
                        "responsive": false
                    },
                    'data':  {
                        'url' : function (node) {
                            return ctx + "/front/task/getAssigneeRangeTree.do";
                        },
                        'data' : function (node) {
                            if(firstRequest){
                                firstRequest = false;
                                return { 'assigneeRangeKey': assigneeRangeKey };
                            }else{
                                return { 'parentId' : node.id};
                            }
                        }
                    },
                    'multiple': false
                },
                "checkbox":{
                    "tie_selection ":false,
                    "three_state":false
                },
                "types" : {
                    "default" : {
                        "icon" : "fa fa-user-md"
                    }
                }
            });
        }
    }
    showModal("m_modal_sendOnUser",options);
}