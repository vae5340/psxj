/**
 * 工作流相关功能js
 */

//获取发送功能弹框内容
var userId='';
var userAssignee='';
var assigneeRangeKey;
var userForm;
var needSelectAssignee;
var masterEntityKey;
var taskId;
var sendTaskInfos;
var sendTaskInfo;
var taskSendType = 1;
var isCheck=0;
var attType="";
var PROCDEF_KEY;
var TASK_CODE;
var PROC_INST_ID;

function showWfSendPage(){
	$("#send").unbind('click');
	$("#send").click(function () {
        wfSend();
    });
    var rowData = $('#exampleTableEvents').bootstrapTable('getSelections');
    if (rowData.length == 1) {
        var row = rowData[0];
        taskId = row.TASK_ID;
        if(false){
        	layer.alert("请选择待办的业务！");
        }else{
        	 // $.getJSON(
	         //    '/' + serverName + '/front/task/signTask.do',
	         //    {taskId:taskId},
	         //    function(data){
	         //    	templateCode=data.templateCode;
	         //    	templateName=data.templateName;
	         //    	masterEntityKey=data.masterEntityKey;
            // });
            masterEntityKey = row.ID;
            PROCDEF_KEY = row.PROCDEF_KEY;
            TASK_CODE = row.TASK_CODE;
            PROC_INST_ID = row.PROC_INST_ID;
            getTaskSendConfig(taskId, row);
        }
    } else {
        layer.alert("请选中一条记录！");
    }

}

function getTaskSendConfig(taskId, row) {
    $.ajax({
        type: 'post',
        url: '/' + serverName + '/front/task/getTaskSendConfig.do',
        data: {'taskId': taskId},
        dataType: 'json',
        success: function (result) {
            sendTaskInfos =  result.content;
            sendTaskInfo =  sendTaskInfos[0];
            var activeChineseName = row.TASK_NAME;
            $("#sendForm").html("");
            $("#sendModalLabel").html("");
            $("#sendModalLabel").append("当前环节-" + activeChineseName);
            // var activties = sendTaskInfo.nextTransitions;
            needSelectAssignee = sendTaskInfo.needSelectAssignee;
            userId=sendTaskInfo.defaultSendAssigneesId;
            userAssignee=sendTaskInfo.defaultSendAssignees;

            var HtmlText = writePageHtml(row);

            $("#sendForm").html(HtmlText.join(""));
            initFileInput(row.TASK_ID);
            $("#sendModal").modal();
        }
    });
}

function writePageHtml(row) {
    var HtmlText = [];
    HtmlText.push('<input type="hidden" id="taskId" value="' + row.TASK_ID + '">');
    HtmlText.push('<input type="hidden" id="procInstId" value="' + row.PROC_INST_ID + '">');
    HtmlText.push('<div class="form-group"><label class="control-label col-sm-2 " style="padding-left: 5px;">下一环节:</label>');
    HtmlText.push('<div class="col-sm-4"><select id="activeName" class="form-control" onchange="selectNextNode(this)">');
    for(var i=0;i<sendTaskInfos.length;i++){
        var temp=sendTaskInfos[i];
        var checked='';
        if(i==0){
            checked='" checked="checked';
        }
        HtmlText.push('<option value="'+temp.destActId+checked+'">'+temp.destActName+'</option>');
    }
    HtmlText.push('</select></div>');
    if(checkNull(userAssignee)){
        HtmlText.push('<label id="assignee_label" class="control-label col-sm-2 " style="padding-left: 5px;display: none;">下一个环节处理人<font color="red">*</font>:</label>');
        HtmlText.push('<label id="assignee_label2" class="control-label col-sm-4 " style="padding-left: 5px;">同时发送给主办及协办人员</label>');
        HtmlText.push('<div id="assignee_div" class="col-sm-4" style="display: none;"><input id="assignee" type="hidden" value=""  /><input id="assigneeName" class="form-control" style="display: none;width:60%;" value=""  readonly/>&nbsp;&nbsp;<input type="button" id="selectAsingee" class="btn btn-primary" value="选择" onclick="popSelectedLayer('+row.TASK_ID+')"></div>');
        HtmlText.push('</div>');
    }else{
        HtmlText.push('<label id="assignee_label" class="control-label col-sm-2 " style="padding-left: 5px;">下一个环节处理人<font color="red">*</font>:</label>');
        HtmlText.push('<label id="assignee_label2" class="control-label col-sm-4 " style="padding-left: 5px;display: none">同时发送给主办及协办人员</label>');
        // HtmlText.push('<div id="assignee_div" class="col-sm-4"><input id="assignee" type="hidden" value="' +  sendTaskInfo.defaultSendAssigneesId + '"  /><input id="assigneeName" class="form-control" style="display: inline;width:60%;" value="' +  sendTaskInfo.defaultSendAssignees + '"  readonly/>&nbsp;&nbsp;<input type="button" id="selectAsingee" class="btn btn-primary" value="选择" onclick="popSelectedLayer('+row.TASK_ID+')"></div>');
        HtmlText.push('<div id="assignee_div" class="col-sm-4"><input id="assignee" type="hidden" value=""  /><input id="assigneeName" class="form-control" style="display: inline;width:60%;" value=""  readonly/>&nbsp;&nbsp;<input type="button" id="selectAsingee" class="btn btn-primary" value="选择" onclick="popSelectedLayer('+row.TASK_ID+')"></div>');
        HtmlText.push('</div>');
    }
    // HtmlText.push('<label id="assignee_label" class="control-label col-sm-2 " style="padding-left: 5px;">下一个环节处理人<font color="red">*</font>:</label>');
    // HtmlText.push('<label id="assignee_label2" class="control-label col-sm-4 " style="padding-left: 5px;display: none">同时发送给主办及协办人员</label>');
    // HtmlText.push('<div id="assignee_div" class="col-sm-4"><input id="assignee" type="hidden" value="' +  sendTaskInfo.defaultSendAssigneesId + '"  /><input id="assigneeName" class="form-control" style="display: inline;width:60%;" value="' +  sendTaskInfo.defaultSendAssignees + '"  readonly/>&nbsp;&nbsp;<input type="button" id="selectAsingee" class="btn btn-primary" value="选择" onclick="popSelectedLayer('+row.TASK_ID+')"></div>');
    // HtmlText.push('</div>');
    if(checkNull(userAssignee)){
        HtmlText.push('<div class="form-group" id="smsDiv" style="display: none;">');
        HtmlText.push('<label class="control-label col-sm-2" style="padding-left: 5px;">是否短信提醒:</label>');
        HtmlText.push('<div class="col-sm-4"><input type="radio" name="message" value="1">是&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="message" checked value="0">否</div>');
        HtmlText.push('</div>');
    }else{
        HtmlText.push('<div class="form-group" id="smsDiv">');
        HtmlText.push('<label class="control-label col-sm-2" style="padding-left: 5px;">是否短信提醒:</label>');
        HtmlText.push('<div class="col-sm-4"><input type="radio" name="message" value="1">是&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="message" checked value="0">否</div>');
        HtmlText.push('</div>');
    }

    HtmlText.push('<div class="form-group"><label class="control-label col-sm-2 " style="padding-left: 5px;">添加照片:</label>');
    HtmlText.push('<div class="col-sm-10"><input type="file" name="file" id="uploadfile" multiple class="file-loading form-control" /></div>');
    HtmlText.push('</div>');
    HtmlText.push('<div class="form-group"><label class="control-label col-sm-2 " style="padding-left: 5px;">审批意见<font color="red">*</font>:</label>');
    HtmlText.push('<div class="col-sm-10"><textarea id="taskOpinion" class="form-control" rows="3"></textarea></div>');
    HtmlText.push('</div>');
    return HtmlText;
}
function writePageHtml_备份(sendTaskInfo,row) {
    var HtmlText = [];
    HtmlText.push('<input type="hidden" id="taskId" value="' + row.TASK_ID + '">');
    HtmlText.push('<input type="hidden" id="procInstId" value="' + row.PROC_INST_ID + '">');
    HtmlText.push('<div class="form-group"><label class="control-label col-sm-2 " style="padding-left: 5px;">下一环节:</label>');
     if (sendTaskInfo.userTask) {
        HtmlText.push('<div class="col-sm-4"><input id="activeName" type="hidden" value="' + sendTaskInfo.destActId+ '" /><input id="destActivityChineseName" class="form-control" value="' +  sendTaskInfo.destActName + '" readonly/></div>');
        HtmlText.push('<div class="col-sm-4"><select id="chooseToEndSel" class="form-control" onchange="chooseToEndSelect(this)"><option value="1">是，现在结束</option><option value="0">否，继续发送</option></select>');
        HtmlText.push('</div>');
    } else {
        HtmlText.push('<div class="col-sm-4"><input id="activeName" type="hidden" value="' + sendTaskInfo.destActId+ '" /><input id="destActivityChineseName" class="form-control" value="' +  sendTaskInfo.destActName + '" readonly/></div>');

    }
     if(!sendTaskInfo.userTask){
		HtmlText.push('<div id="assignee_div" class="col-sm-12" style="display:none;padding-left: 0;padding-top: 15px;">' +
			'<label id="assignee_label" class="control-label" style="padding-left: 5px;padding-right: 25px;">环节处理人:</label>' +
			'<input id="assignee" type="hidden" />' +
			'<input id="assigneeName" class="form-control" style="display: inline;width:50%;"  readonly/>&nbsp;&nbsp;<input type="button" class="btn btn-primary" ' +
			'value="选择" onclick="popSelectedLayer('+row.TASK_ID+')"></div>');
        HtmlText.push('</div>');
    }else{
        HtmlText.push('<label id="assignee_label" class="control-label col-sm-2 " style="padding-left: 5px;">下一个环节处理人<font color="red">*</font>:</label>');
        HtmlText.push('<div id="assignee_div" class="col-sm-4"><input id="assignee" type="hidden" value="' +  sendTaskInfo.defaultSendAssigneesId + '"  /><input id="assigneeName" class="form-control" style="display: inline;width:60%;" value="' +  sendTaskInfo.defaultSendAssignees + '"  readonly/>&nbsp;&nbsp;<input type="button" id="selectAsingee" class="btn btn-primary" value="选择" onclick="popSelectedLayer('+row.TASK_ID+')"></div>');
        HtmlText.push('</div>');
    }

    HtmlText.push('<div class="form-group" >');
    HtmlText.push('<label class="control-label col-sm-2" style="padding-left: 5px;">是否短信提醒:</label>');
    HtmlText.push('<div class="col-sm-4"><input type="radio" name="message" value="1">是&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="message" checked value="0">否</div>');
    HtmlText.push('</div>');
    HtmlText.push('<div class="form-group"><label class="control-label col-sm-2 " style="padding-left: 5px;">添加照片:</label>');
    HtmlText.push('<div class="col-sm-10"><input type="file" name="file" id="uploadfile" multiple class="file-loading form-control" /></div>');
    HtmlText.push('</div>');
    HtmlText.push('<div class="form-group"><label class="control-label col-sm-2 " style="padding-left: 5px;">审批意见<font color="red">*</font>:</label>');
    HtmlText.push('<div class="col-sm-10"><textarea id="taskOpinion" class="form-control" rows="3"></textarea></div>');
    HtmlText.push('</div>');
    return HtmlText;
}

function chooseToEndSelect(e) {
	var optionVal = $(e).val();
	if(optionVal==0) {
        taskSendType = 2;
        loadTreeData(taskId);
    }else
        $("#assignee_div").hide();
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
function selectNextNode(obj){
    var destActId=$(obj).val();
    if(destActId){
        for(var i= 0;i<sendTaskInfos.length;i++){
            var currSendTask = sendTaskInfos[i];
            var currDestActId = currSendTask.destActId;

            if(currDestActId==destActId){
                sendTaskInfo = sendTaskInfos[i];
                needSelectAssignee=sendTaskInfo.needSelectAssignee;
                userId = sendTaskInfo.defaultSendAssigneesId;
                userAssignee = sendTaskInfo.defaultSendAssignees;
                //nextTask = sendTaskInfo.destActName;
                //下一环节参与人信息
                if(checkNull(userAssignee)){
                    $("#assigneeName").val("");
                    $("#assignee").val("");
                    $("#assignee_div").hide();
                    $("#assignee_label").hide();
                    $("#assignee_label2").show();
                    $("#smsDiv").hide();
                }else{
                    $("#assigneeName").val(userAssignee);
                    $("#assignee_div").show();
                    $("#assignee_label2").hide();
                    $("#assignee_label").show();
                    $("#smsDiv").show();
                }
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
function loadTreeData(taskId){
    var url;
    if(taskSendType==1)
        url = "/psxj/front/task/getAssigneeRangeByCurrTaskId.do";
    else
        url = "/psxj/asiWorkflow/getAssigneeRangeAfterTask";
    $.ajax({
        url: url,
        data:{taskId:taskId,destActId:$("#activeName").val()},
        type:"post",
        async:false,
        success:function (result) {
            if(result.success){
                assigneeRangeKey = result.content.assigneeRange;
                if(result.content.nextTaskName){
                    $("#assignee_label").text(result.content.nextTaskName + "-环节处理人");
                    $("#assignee_div").show();
                }
            }
        },
        error:function() {
            agcloud.ui.metronic.showErrorTip("请求参与人信息失败！");
        }
    });
}


//问题上报后获取发送功能弹框内容
//content.taskId,content.processInstanceId,content.masterEntityKey,content.taskName,content.procdefKey
function showWfSendPageAfterSave(content){
    masterEntityKey=content.masterEntityKey;
    taskId=content.taskId;
    PROC_INST_ID=content.processInstanceId;
    PROCDEF_KEY = content.procdefKey;
    TASK_CODE = content.currTaskDefId;
    taskName=content.taskName;

    $("#send").unbind('click');
    $("#send").click(function () {
        wfSend2();
    });
    $.ajax({
        type: 'post',
        url: '/' + serverName + '/front/task/getTaskSendConfig.do',
        data: {'taskId': taskId},
        dataType: 'json',
        success: function (result) {
            sendTaskInfos =  result.content;
            sendTaskInfo =  sendTaskInfos[0];
            var activeChineseName = taskName;
            $("#sendForm").html("");
            $("#sendModalLabel").html("");
            $("#sendModalLabel").append("当前环节-" + activeChineseName);
            // var activties = sendTaskInfo.nextTransitions;
            needSelectAssignee = sendTaskInfo.needSelectAssignee;
            userId=sendTaskInfo.defaultSendAssigneesId;
            userAssignee=sendTaskInfo.defaultSendAssignees;

            var HtmlText = initWritePageHtmlToNewForm(sendTaskInfo,taskId,PROC_INST_ID);

            $("#sendForm").html(HtmlText.join(""));
            initFileInput(taskId);
            $("#sendModal").modal();
        }
    });
}
function initWritePageHtmlToNewForm(sendTaskInfo,taskId,procInstId){
    var HtmlText = [];
    HtmlText.push('<input type="hidden" id="taskId" value="' + taskId + '">');
    HtmlText.push('<input type="hidden" id="procInstId" value="' + procInstId + '">');
    HtmlText.push('<div class="form-group"><label class="control-label col-sm-2 " style="padding-left: 5px;">下一环节:</label>');
    // if (activties.length > 1) {
    if (!sendTaskInfo.userTask) {
        HtmlText.push('<div class="col-sm-4"><input id="activeName" type="hidden" value="' + sendTaskInfo.destActId+ '" /><input id="destActivityChineseName" class="form-control" value="' +  sendTaskInfo.destActName + '" readonly/></div>');
        HtmlText.push('<div class="col-sm-4"><select id="chooseToEndSel" class="form-control" onchange="chooseToEndSelect(this)"><option value="1">是，现在结束</option><option value="0">否，继续发送</option></select>');
        HtmlText.push('</div>');
    } else {
        HtmlText.push('<div class="col-sm-4"><input id="activeName" type="hidden" value="' + sendTaskInfo.destActId+ '" /><input id="destActivityChineseName" class="form-control" value="' +  sendTaskInfo.destActName + '" readonly/></div>');

    }
    if(!sendTaskInfo.userTask){
        HtmlText.push('<div id="assignee_div" class="col-sm-12" style="display:none;padding-left: 0;padding-top: 15px;">' +
            '<label id="assignee_label" class="control-label" style="padding-left: 5px;padding-right: 25px;">环节处理人:</label>' +
            '<input id="assignee" type="hidden" />' +
            '<input id="assigneeName" class="form-control" style="display: inline;width:50%;"  readonly/>&nbsp;&nbsp;<input type="button" class="btn btn-primary" ' +
            'value="选择" onclick="popSelectedLayer('+taskId+')"></div>');
        HtmlText.push('</div>');
    }else{
        HtmlText.push('<label id="assignee_label" class="control-label col-sm-2 " style="padding-left: 5px;">下一个环节处理人<font color="red">*</font>:</label>');
        // HtmlText.push('<div id="assignee_div" class="col-sm-4"><input id="assignee" type="hidden" value="' +  sendTaskInfo.defaultSendAssigneesId + '"  /><input id="assigneeName" class="form-control" style="display: inline;width:60%;" value="' +  sendTaskInfo.defaultSendAssignees + '"  readonly/>&nbsp;&nbsp;<input type="button" class="btn btn-primary" value="选择" onclick="popSelectedLayer('+taskId+')"></div>');
        HtmlText.push('<div id="assignee_div" class="col-sm-4"><input id="assignee" type="hidden" value=""  /><input id="assigneeName" class="form-control" style="display: inline;width:60%;" value=""  readonly/>&nbsp;&nbsp;<input type="button" class="btn btn-primary" value="选择" onclick="popSelectedLayer('+taskId+')"></div>');
        HtmlText.push('</div>');
    }

    HtmlText.push('<div class="form-group">');
    HtmlText.push('<label class="control-label col-sm-2" style="padding-left: 5px;">是否短信提醒:</label>');
    HtmlText.push('<div class="col-sm-4"><input type="radio" name="message" value="1">是&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="message" checked value="0">否</div>');
    HtmlText.push('</div>');
    HtmlText.push('<div class="form-group"><label class="control-label col-sm-2 " style="padding-left: 5px;">添加照片:</label>');
    HtmlText.push('<div class="col-sm-10"><input type="file" name="file" id="uploadfile" multiple class="file-loading form-control" /></div>');
    HtmlText.push('</div>');
    HtmlText.push('<div class="form-group"><label class="control-label col-sm-2 " style="padding-left: 5px;">审批意见<font color="red">*</font>:</label>');
    HtmlText.push('<div class="col-sm-10"><textarea id="taskOpinion" class="form-control" rows="3"></textarea></div>');
    HtmlText.push('</div>');
    return HtmlText;
}

function initFileInput(taskInstDbid){
    if(taskInstDbid==undefined){
        taskInstDbid=taskId;
    }
    $("#uploadfile").fileinput({
        language: 'zh', //设置语言
        uploadUrl: "/"+serverName+"/uploadfile/uploadFile", //上传的地址
        allowedFileExtensions: ['jpg', 'gif', 'png'],//接收的文件后缀,'doc','docx','xlsx','txt','xls'
        uploadExtraData:function(previewId,index){
           return {tableName:"DRI_GX_PROBLEM_REPORT",pkName:masterEntityKey,recordId:taskInstDbid,attType:attType,isDbStore:"0",isEncrypt:"0",fileParam:"file"};
        },
        uploadAsync: true, //默认异步上传
        showUpload: false, //是否显示上传按钮
        showRemove : true, //显示移除按钮
        showPreview : true, //是否显示预览
        showCaption: true,//是否显示标题
        browseClass: "btn btn-primary", //按钮样式
        dropZoneEnabled: false,//是否显示拖拽区域
        //minImageWidth: 50, //图片的最小宽度
        //minImageHeight: 50,//图片的最小高度
        //maxImageWidth: 1000,//图片的最大宽度
        //maxImageHeight: 1000,//图片的最大高度
        //maxFileSize: 0,//单位为kb，如果为0表示不限制文件大小
        //minFileCount: 0,
        maxFileSize:30000,
        maxFileCount: 10, //表示允许同时上传的最大文件个数
        enctype: 'multipart/form-data',
        validateInitialCount:true,
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        slugCallback: function(filename) {
            return filename.replace('/\s/g', '_').replace('(', '_').replace(')', '_').replace('[', '_').replace(']', '_');
        }
    }).on('fileerror', function(event, data, msg) {
        alert("照片上传失败");
    }).on("fileuploaded", function (event, data, previewId, index) {
    	if(data.response.success){
    		wfSendData();
    	}else{
    		alert("照片上传失败");
    	}
        //$("#uploadfile").initFileActions();
        /*layer.msg('保存成功！', {
            icon: 1,
            time: 2000
        }, function () {
            window.parent.layer.closeAll();
        });*/
    });
}
//转派功能弹框内容
function showReassignPage(){
	$("#reassign").unbind('click');
	$("#reassign").click(function () {
    	// reassign();
        saveZJComment();
    });
	var rowData = $('#exampleTableEvents').bootstrapTable('getSelections');
    if (rowData.length == 1) {
    	var row = rowData[0];
    	if(viewId!=dbViewId){
        	layer.alert("请选择待办的业务！");
        }else if(row.TASK_NAME != "任务派单"){
        	layer.alert("请选择当前节点为<font color='red'>任务派单</font>的业务！");
        }else{
            taskId=row.TASK_ID;
	        $.ajax({
                 type: 'post',
                 url: '/' + serverName + '/asiWorkflow/getCurrTaskUser.do',
                 data: {taskId:taskId},
                 dataType: 'json',
                 success: function (data) {
                        $("#reassignForm").html("");
                         $("#reassignModalLabel").html("");
                         $("#reassignModalLabel").append("当前环节-" + row.TASK_NAME);
                         var HtmlText = [];
                         HtmlText.push('<div class="form-group"><label class="control-label col-sm-3 " style="padding-left: 5px;">转派接收人<font color="red">*</font>:</label>');

                          if (data.success && data.content.length > 0) {
                                HtmlText.push('<div class="col-sm-9"><select id="reassigner" class="form-control"> ');
                             for (var i in data.content) {
                                 if(data.content[i]){
                                     HtmlText.push('<option value="' + data.content[i].loginName + '">' + data.content[i].userName + '</option>');
                                 }
                             }
                             HtmlText.push('</select></div>');
                         }

                         HtmlText.push('</div>');
                         HtmlText.push('<div class="form-group"><label class="control-label col-sm-3" style="padding-left: 5px;">是否短信提醒:</label>');
                         HtmlText.push('<div class="col-sm-9"><input type="radio" name="reassignMessage" value="1">是&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="reassignMessage" checked value="0">否</div>');
                         HtmlText.push('</div>');
                         HtmlText.push('<div class="form-group"><label class="control-label col-sm-3 " style="padding-left: 5px;">转派意见<font color="red">*</font>:</label>');
                         HtmlText.push('<div class="col-sm-9"><textarea id="reassignComments" class="form-control" rows="3"></textarea></div>');
                         HtmlText.push('</div>');
                         $("#reassignForm").html(HtmlText.join(""));
                         $("#reassignModal").modal();
                 }
        	 });
        }
    } else {
        layer.alert("请选中一条记录！");
    }  
}
//转派发送
function reassign(){
	var reassigner=$("#reassigner").val();
	// if(typeof(reassigner)=="undefined"){
	// 	reassigner=$("#assignee").val();//管理者流程
	// }
	if(reassigner==null || reassigner==""){
		layer.alert("请选择转派接收人！");
		return;
	}
	var reassignComments = $("#reassignComments").val();
	if(reassignComments==null || reassignComments==""){
		layer.alert("请填写转派意见！");
    	return;
	}
	$("#reassignModal").modal('hide');
	var reassignerName=$("#reassigner").find("option:selected").text();
	// if(typeof(reassignerName)=="undefined" || reassignerName==""){
	// 	reassignerName=$("#assigneeName").val();//管理者流程
	// }
	var rowData = $('#exampleTableEvents').bootstrapTable('getSelections');
	var row = rowData[0];
	$.ajax({
         type: 'get',
         url: '/' + serverName + '/asiWorkflow/wfReassign.do',
         data:{
        	 'taskId':row.TASK_ID,
        	 'taskName':row.TASK_NAME,
        	 'sendToUserId':reassigner,
             'reassignComments':reassignComments
         },
         dataType: 'json',
         success: function (data) {
        	 var message = "转派任务成功！";
         	 if(!data.success){
         		message = "转交任务失败,失败原因："+result.content
         	 }
        	 parent.layer.alert(message);
             loadData(10,1);
         }
	 })
}

//转派调整   开始
//保存意见
function saveZJComment(){
    var reassigner=$("#reassigner").val();
    if(reassigner==null || reassigner==""){
        layer.alert("请选择转派接收人！");
        return;
    }
    var reassignComments = $("#reassignComments").val();
    if(reassignComments==null || reassignComments==""){
        layer.alert("请填写转派意见！");
        return;
    }
    $("#reassignModal").modal('hide');
    var rowData = $('#exampleTableEvents').bootstrapTable('getSelections');
    var row = rowData[0];
    var d = {};
    d["message"] =reassignComments;
    d["taskId"] = row.TASK_ID;
    d["processInstanceId"] = row.PROC_INST_ID;
    $.ajax({
        url: "/" + serverName +'/front/task/addTaskComment.do',
        type: 'POST',
        data: d,
        success: function (result) {
            if (result.success){
                newReassign(row.TASK_ID,reassigner);
            }else {
                parent.layer.alert("转交任务失败,失败原因："+result.message);
            }
        },
        error:function(){
            parent.layer.alert("转交任务失败");
        }
    });
}

function newReassign(taskId,userId){
    if (taskId != null && taskId != ''&&userId!=null && userId != '') {
        $.ajax({
            url:"/" + serverName  + "/front/task/sendOnTask.do?taskId="+taskId+"&sendToUserId="+userId,
            dataType:"json",
            type:"get",
            success:function(result){
                var message="转交任务成功！";
                if(!result.success){
                    parent.layer.alert("转交任务失败,失败原因："+result.message);
                }
                parent.layer.alert(message);
                loadData(10,1);
            }
        });
    }
}
//转派调整    结束
//撤回
function wfRetrieveTask(){
	var rowData = $('#exampleTableEvents').bootstrapTable('getSelections');
	if(rowData.length==1){
	var row = rowData[0];
	$.ajax({
		type: 'get',
		url: '/' + serverName + '/asiWorkflow/retrieveTask',
		data:{
			'loginName':userCode,
			'instance.procInstId':row.procInstId
		},
		dataType: 'json',
		success: function (data) {
			var message = data.message;
			parent.layer.alert(message);
			// loadData(10,1);
		}
	})
	}else{
		layer.alert("请选中一条记录！");
	}
}
//是否有处理意见
function hasHandleComments(){
    if($("#taskOpinion").val() != ""){
        //保存审批意见
        $.ajax({
            type:'post',
            url:'/'+serverName+'/front/task/addTaskComment.do',
            data:{
                'processInstanceId': $("#procInstId").val(),
                'taskId': taskId,
                'message':$("#taskOpinion").val()
            },
            dataType:'json',
            success:function(result){
                if(result.success){
                    wfBusUpdate(taskId, masterEntityKey,$("#procInstId").val(), 0,function(){
                        if($("#uploadfile").val() != ""){
                            $("#uploadfile").fileinput("upload");
                        }else{
                            wfSendData();
                        }
                    });
                }else{
                    layer.msg('发送异常！', {
                        icon: 2,
                        time: 2000
                    });
                }
            }
        })
    }else{
    	if($("#uploadfile").val() != ""){
            $("#uploadfile").fileinput("upload");
        }else{
        	wfSendData();
        }
    }
}
//busFormIframe.window.wfBusSave(procdefKey, taskId, masterEntityKey,appProcdefId,processInstanceId);
function wfBusUpdate(taskId, masterEntityKey, procInstId,toEnd,callback) {
    var url = "/psxj/asiWorkflow/selfWorkFlowBusSave.do";
    $.ajax({
        type : 'post',
        url : url,
        data : {taskId: taskId , id: masterEntityKey, processInstanceId: procInstId,sfjb: toEnd},
        dataType : "json",
        success : function (json) {
        	if(callback)
                  callback();
        }
    });
}

//发送到下一节点
function wfSend(){
	if(taskSendType==2)
        wfBusUpdate(taskId, masterEntityKey, $("#procInstId").val(), 0, function () {
			taskSendType = 1;
            wfSendData(wfSend);
        });
    else {
        var rowData = $('#exampleTableEvents').bootstrapTable('getSelections');
        var row = rowData[0];//管理流程，需要在任务派单环节，校验一下是否是R0发送到下一个环节
        var assignee = $("#assignee").val();
        if (needSelectAssignee == true && (assignee == "" || assignee == null)) {
            layer.alert("请选择下一环节处理人！");
            return;
        }
        var taskOpinion = $("#taskOpinion").val();
        if (taskOpinion == null || taskOpinion == "") {
            layer.alert("请填写审批意见！");
            return;
        }
        $("#sendModal").modal('hide');
        hasHandleComments(row.TASK_ID);
    }
}
//新增上报问题后调用的发送到下一节点
function wfSend2() {
    var assignee = $("#assignee").val();
    if (needSelectAssignee == true && (assignee == "" || assignee == null)) {
        layer.alert("请选择下一环节处理人！");
        return;
    }
    var taskOpinion = $("#taskOpinion").val();
    if (taskOpinion == null || taskOpinion == "") {
        layer.alert("请填写审批意见！");
        return;
    }
    $("#sendModal").modal('hide');
    hasHandleComments();
}

/**
 * 发送到下一环节
 * */
function wfSendData(callback){
    var sendParam = {
        taskId : taskId,
        sendConfigs:[{
            isUserTask : sendTaskInfo.userTask,
            isMultiTask : sendTaskInfo.multiTask,
            assignees : $("#assignee").val(),
            destActId : sendTaskInfo.destActId
        }]
    }
    $.ajax({
        url :  '/' + serverName  + '/front/task/wfSend.do',
        data : {sendObjectStr:JSON.stringify(sendParam)},
        type : "post",
        dataType : "json",
        success : function (result) {
            if(result.success){
            	// if(callback)
            	// 	callback();
                //这里要在提交后给出提示信息。
                // var message = "<span style='color:#22D479;font-size:18px' >流程发送成功！</span>";
                var message = "<span style='font-size:18px'>任务处理完毕，正等待其他用户处理！</span>";
                if(!sendTaskInfo.userTask){
                    message="任务处理完毕";
                }

                parent.layer.alert(message);
                loadData(10,1);
            }else{
            }
        },
        error : function () {
           showErrorTip("流程转发失败！");
        }
    });
}
//发送短信  已经切换到后台wfRest中调用，此处不用
function sendMessage(){
	if($('input[name="message"]:checked ').val()==1){//是否短信提示选择是
		var data = {
			    'assignee': $("#assignee").val(),
			    'assigneeName': $("#assignee  option:selected").text() == ""?$("#assigneeName").val():$("#assignee  option:selected").text(),
			    'activityChineseName': $("#activeName  option:selected").text() == ""?$("#destActivityChineseName").val():$("#activeName  option:selected").text(),
			    'loginName': userCode
			}
			$.ajax({
			  type:'get',
		      url: '/' + serverName + "/rest/smsTxyRest/sendMessage",
		      data:data,
		      dataType:'json',
		      success:function(result){
		    	  if(result.msg!="OK"){
		    		  parent.layer.alert("短信发送失败，原因是："+result.msg);
		    	  }
		      }
		  });
    }	
}


// 弹出选择层
function popSelectedLayer(taskId){
	if(taskSendType==1)
		loadTreeData(taskId);
	layer.open({
		type: 2,
        title: "选择发送者",
		shadeClose: false,
		// closeBtn : [0 , true],
		closeBtn:1,
		btn:["确定"],
		shade: 0.5,
		maxmin: false, //开启最大化最小化按钮
		area: ['500px', '350px'],
		offset: ['20px', $(window).width()/2-230+'px'],
		content: "/psxj/systemInfo/ssxjxt/xcyh/xcyh/tree.html?assigneeRangeKey="+assigneeRangeKey+"&PROCDEF_KEY="+PROCDEF_KEY+"&TASK_CODE="+TASK_CODE+"&PROC_INST_ID="+PROC_INST_ID+"&serverName="+serverName,
		cancle:function(){

		},
		yes : function(index,layero){
			layer.close(index);
		}
	});
}


//查看流程图
function viewWfDiagram(){
    var rowData = $('#exampleTableEvents').bootstrapTable('getSelections');
    if (rowData.length == 1) {
        var row = rowData[0];
        var modelUrl ="/"+ serverName + '/rest/process-instances/' + row.PROC_INST_ID + '/model-json';
        if(isCheck == 1){
            //已办或办结时查看流程图
            modelUrl = "/"+serverName + '/rest/process-instances/history/' + row.PROC_INST_ID + '/model-json';
        }
        var itemParam={
            serverName:serverName,
            modelUrl:modelUrl,
            isCheck:isCheck,
            processInstenceId:row.PROC_INST_ID
        }
        window.openLayerPanal('wfDiagram.html', "办理流程图", itemParam, $(window).width() * 0.5, $(window).height() * 0.8,80, $(window).width() * 0.25, false, true, null, null);
    }else {
        layer.alert("请选中一条记录！");
    }
}
// function viewWfDiagram(){
//     var rowData = $('#exampleTableEvents').bootstrapTable('getSelections');
//     if (rowData.length == 1) {
//         var row = rowData[0];
//         $.ajax({
//             type:'post',
//             url:"/"+serverName+"/xcyh/businessAccepted/ccproblem!getJbpmHistProcinst.action",
//             // url:"/"+serverName+"/rest/process-instances/history/"+row.PROC_INST_ID+ '/model-json',
//             data:{"procInstId":row.PROC_INST_ID},
//             dataType:'json',
//             success:function(result){
//                 var data = JSON.parse(result.result);
//                 var itemParam = {
//                     serverName: serverName,
//                     taskInstDbid: data.procInstDbId,
//                     processInstenceId:data.procInstId,
//                     processDefId:data.procdefid
//                 };
//                 window.openLayerPanal('wfDiagram.html', "办理流程图", itemParam, $(window).width() * 0.5, $(window).height() * 0.8,80, $(window).width() * 0.25, false, true, null, null);
//             }
//         })
//
//     }else {
//         layer.alert("请选中一条记录！");
//     }
// }

//回退
function wfReturnPrevTask(){
    var rowData = $('#exampleTableEvents').bootstrapTable('getSelections');
    if (rowData.length == 1) {
        var row = rowData[0];
        if(row.TASK_NAME == "问题上报"){
        	layer.alert("起始节点不能回退，请选择当前节点不为<font color='red'>问题上报</font>的业务！");
        }else{
        	 layer.confirm('确定回退到上一环节？', {
                 btn: ['确定', '取消'] //按钮
             }, function () {
                 $.ajax({
                     type: 'post',
                     url: "/" + serverName + "/front/task/returnPrevTask.do",
                     data:{'taskId': row.TASK_ID},
                     dataType: 'json',
                     success: function (result) {
                         if(result.success){
                             layer.alert(result.message);
                             loadData(10,1);
                         }

                     }
                 });
             }, function () {
                 return;
             });
        }
    }else {
        layer.alert("请选中一条记录！");
    }
}

//回退功能调整   开始
function newWfReturnPrevTask(){
    var rowData = $('#exampleTableEvents').bootstrapTable('getSelections');
    if (rowData.length == 1) {
        var row = rowData[0];
        if(viewId!=dbViewId){
            layer.alert("请选择待办的业务！");
        }else if(row.TASK_NAME == "问题上报"){
            layer.alert("起始节点不能回退，请选择当前节点不为<font color='red'>问题上报</font>的业务！");
        }else{
            $("#returnButton").unbind('click');
            $("#returnButton").click(function () {
                saveReturnComment();
            });
            taskId=row.TASK_ID;
            $("#returnContent").text("");
            $("#ReturnModalLabel").html("");
            $("#ReturnModalLabel").append("当前环节-" + row.TASK_NAME);
            $("#ReturnModal").modal();
        }
    } else {
        layer.alert("请选中一条记录！");
    }
}
function saveReturnComment(){
    var content=$("#returnContent").val();
    if(content==null || content==""){
        layer.alert("请填写回退原因！");
        return;
    }
    $("#ReturnModal").modal('hide');
    var rowData = $('#exampleTableEvents').bootstrapTable('getSelections');
    var row = rowData[0];
    var d = {};
    d["message"] =content;
    d["taskId"] = row.TASK_ID;
    d["processInstanceId"] = row.PROC_INST_ID;
    $.ajax({
        url: "/" + serverName +'/front/task/addTaskComment.do',
        type: 'POST',
        data: d,
        success: function (result) {
            if (result.success){
                returnTask(row.TASK_ID);
            }else{
                parent.layer.alert("回退失败,失败原因："+result.message);
            }
        },
        error:function(){
            parent.layer.alert("回退失败");
        }
    });
}
function returnTask(TASK_ID){
    $.ajax({
        type: 'post',
        url: "/" + serverName + "/front/task/returnPrevTask.do",
        data:{'taskId': TASK_ID},
        dataType: 'json',
        success: function (result) {
            if(result.success){
                layer.alert(result.message);
                loadData(10,1);
            }
        }
    });
}
//回退功能调整    结束
//查看历史意见
function listHistoryTaskComment(){
    var rowData = $('#exampleTableEvents').bootstrapTable('getSelections');
    if (rowData.length == 1) {
        var options = {
            width : 900,
            height : 600,
            btnHidden : true,
            callback : loadHistoryTaskComment
        }
        //$("#m_modal_historyComment").modal();
       // showModal("m_modal_historyComment",options);
        loadHistoryTaskComment()
    }else{
        layer.alert("请选中一条记录！");
    }
}
//加载历史意见
function loadHistoryTaskComment(){
    var rowData = $('#exampleTableEvents').bootstrapTable('getSelections');
    if (rowData.length == 1) {
        var row0 = rowData[0];
        var data;
        $.ajax({
            url:"/" + serverName+'/front/task/listHistoryComment.do?processInstanceId=' + row0.PROC_INST_ID,
            type:"post",
            async:false,
            success:function (result) {
                data = result;
            }
        });
        //先干掉表格，才能刷新数据
        $('#historyCommentTable').bootstrapTable('destroy');
        //初始化表格
        $('#historyCommentTable').bootstrapTable({
            data:data,
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
                width: 550
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
                width: 500,
                formatter: function (val,row,index) {
                    if(val) return getLocalTime(val);
                    return val;
                    //return formatterDateTime(row.sigeInDate);
                }
            },{
                field: "taskState",
                title: "办理状态",
                textAlign: 'center',
                sortable: false,
                width: 60,
                formatter: function (val,row,index) {
                    return formatterTaskState(val);
                }
            }]
        });
       // $('#historyCommentTable').css({"border": "1px solid #e9ecef"});
        //刷新一下，不然没有排序功能
       // datatable.reload();
        $("#m_modal_historyComment").modal();
    }else{
        layer.alert("请选中一条记录！");
    }
}

function formatterTaskState(value){
    if(!value||value==null||value==''){
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

