package com.augurit.agcloud.org.service;

import com.augurit.agcloud.bpm.common.domain.BpmDestTaskConfig;
import com.augurit.agcloud.bpm.common.domain.BpmTaskSendObject;
import com.augurit.agcloud.bpm.front.domain.BpmProcessContext;
import com.augurit.agcloud.bpm.front.domain.BpmWorkFlowConfig;
import com.augurit.agcloud.framework.security.user.OpusLoginUser;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.awater.bpm.xcyh.report.domain.GxProblemReport;

import java.util.List;

public interface IBpmService {

    List<BpmDestTaskConfig> getBpmDestTaskConfigsByCurrTaskId(String taskId) throws Exception;

    List<com.augurit.agcloud.common.conver.BpmHistoryCommentForm> getHistoryCommentsByProcessInstanceId(String processInstanceId) throws Exception;

    Boolean wfSend(BpmTaskSendObject sendObject) throws Exception;

    void completeTask(BpmTaskSendObject sendObject) throws Exception;

    BpmProcessContext workFlowBusSave(GxProblemReport busForm, BpmWorkFlowConfig workFlowConfig, OpusLoginUser user) throws Exception;
}
