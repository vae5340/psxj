package com.augurit.agcloud.org.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.augurit.agcloud.bpm.common.constant.BpmTaskConstant;
import com.augurit.agcloud.bpm.common.domain.*;
import com.augurit.agcloud.bpm.common.mapper.ActStoSmartFormOperaMapper;
import com.augurit.agcloud.bpm.common.service.*;
import com.augurit.agcloud.bpm.common.utils.CommonTools;
import com.augurit.agcloud.bpm.front.domain.BpmProcessContext;
import com.augurit.agcloud.bpm.front.domain.BpmWorkFlowConfig;
import com.augurit.agcloud.bpm.front.domain.IdEntity;
import com.augurit.agcloud.bpm.front.service.BpmBusAbstractService;
import com.augurit.agcloud.bpm.front.service.BpmProcessFrontService;
import com.augurit.agcloud.bpm.front.service.BpmTaskFrontService;
import com.augurit.agcloud.common.conver.BpmHistoryCommentForm;
import com.augurit.agcloud.framework.security.user.OpusLoginUser;
import com.augurit.agcloud.framework.ui.result.ResultForm;
import com.augurit.agcloud.meta.domain.MetaDbColumn;
import com.augurit.agcloud.meta.sc.db.service.MetaDbColumnService;
import com.augurit.agcloud.opus.common.domain.*;
import com.augurit.agcloud.opus.common.mapper.*;
import com.augurit.agcloud.org.service.IBpmService;
import com.augurit.awater.bpm.xcyh.report.domain.GxProblemReport;
import com.augurit.awater.bpm.xcyh.report.service.IGxProblemReportService;
import org.apache.commons.lang.StringUtils;
import org.flowable.bpmn.model.*;
import org.flowable.bpmn.model.Process;
import org.flowable.engine.HistoryService;
import org.flowable.engine.RepositoryService;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.flowable.engine.history.HistoricActivityInstance;
import org.flowable.engine.repository.ProcessDefinition;
import org.flowable.engine.runtime.ProcessInstance;
import org.flowable.engine.task.Comment;
import org.flowable.task.api.Task;
import org.flowable.task.api.TaskQuery;
import org.flowable.task.api.history.HistoricTaskInstance;
import org.flowable.task.api.history.HistoricTaskInstanceQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Transactional
public class BpmServiceImpl implements IBpmService {
    @Autowired
    private HistoryService historyService;
    @Autowired
    private OpuOmUserMapper opuOmUserMapper;
    @Autowired
    private OpuOmUserOrgMapper opuOmUserOrgMapper;
    @Autowired
    private OpuOmUserPosMapper opuOmUserPosMapper;
    @Autowired
    private OpuAcRoleUserMapper opuAcRoleUserMapper;
    @Autowired
    private OpuOmOrgMapper opuOmOrgMapper;
    @Autowired
    private OpuRsRoleMapper opuRsRoleMapper;
    @Autowired
    private OpuOmPosMapper opuOmPosMapper;
    @Autowired
    private RuntimeService runtimeService;
    @Autowired
    private OpuOmUserInfoMapper opuOmUserInfoMapper;
    @Autowired
    private BpmTaskService bpmTaskService;
    @Autowired
    private BpmTaskFrontService bpmTaskFrontService;
    @Autowired
    private ActTplPrivProcformService actTplPrivProcformService;



    @Autowired
    private BpmProcessService bpmProcessService;
    @Autowired
    private ActStoAppinstService actStoAppinstService;
    @Autowired
    private TaskService taskService;
    @Autowired
    private ActTplAppFlowdefService actTplAppFlowdefService;
    @Autowired
    private RepositoryService repositoryService;
    @Autowired
    private ActTplAppFormService actTplAppFormService;
    @Autowired
    private BpmProcessFrontService bpmProcessFrontService;
    @Autowired
    private ActFlexCasedefVersionService actFlexCasedefVersionService;
    @Autowired
    private IGxProblemReportService gxProblemReportService;

    @Autowired
    private MetaDbColumnService metaDbColumnService;
    @Autowired
    private ActStoSmartFormOperaMapper actStoSmartFormOperaMapper;
    @Autowired
    private ActStoRuleService actStoRuleService;
    @Autowired
    private ActStoFormService actStoFormService;

    public BpmServiceImpl() {
    }

    public List<BpmDestTaskConfig> getBpmDestTaskConfigsByCurrTaskId(String taskId) throws Exception {
        List<BpmDestTaskConfig> list = new ArrayList();
        if(taskId != null) {
            Task currTask = (Task)((TaskQuery)this.taskService.createTaskQuery().taskId(taskId)).singleResult();
            if(currTask == null) {
                throw new RuntimeException("当前节点任务不存在或者已完成，请检查taskId是否正确");
            }

            BpmnModel bpmnModel = this.repositoryService.getBpmnModel(currTask.getProcessDefinitionId());
            Process process = (Process)bpmnModel.getProcesses().get(0);
            UserTask currTaskElement = (UserTask)process.getFlowElement(currTask.getTaskDefinitionKey());
            List<SequenceFlow> outGoingFlowList = currTaskElement.getOutgoingFlows();
            if(outGoingFlowList != null && outGoingFlowList.size() > 0) {
                for (int i=0;i< outGoingFlowList.size();i++) {
                    SequenceFlow sequenceFlow = (SequenceFlow)outGoingFlowList.get(i);
                    FlowElement flowElement = sequenceFlow.getTargetFlowElement();
                    BpmDestTaskConfig destTaskConfig = new BpmDestTaskConfig();
                    destTaskConfig.setDestActId(flowElement.getId());
                    destTaskConfig.setDestActName(flowElement.getName());
                    destTaskConfig.setDirectSend(false);
                    Integer residueTaskInstCout = (Integer)this.runtimeService.getVariable(currTask.getExecutionId(), "nrOfActiveInstances");
                    if(residueTaskInstCout != null && residueTaskInstCout.intValue() > 1) {
                        destTaskConfig.setDirectSend(true);
                    }

                    if(flowElement instanceof UserTask) {
                        destTaskConfig.setUserTask(true);
                        UserTask userTask = (UserTask)flowElement;
                        String assignee = userTask.getAssignee();
                        String assigneeRange = userTask.getAssigneeRange();
                        List<String> candidateUsers = userTask.getCandidateUsers();
                        StringBuffer defaultSendAssignees;
                        String firstAssignee;
                        if(userTask.getEnableMultitask().booleanValue()) {
                            destTaskConfig.setMultiTask(true);
                            destTaskConfig.setMessage("所选下一环节为多人审批模式，请选择一个或多个办理人。");
                            if(StringUtils.isNotEmpty(assignee) || StringUtils.isNotEmpty(assigneeRange)) {
                                if(StringUtils.isNotEmpty(assignee)) {
                                    destTaskConfig.setNeedSelectAssignee(false);
                                    if(assignee.indexOf(",") != -1) {
                                        defaultSendAssignees = new StringBuffer();
                                        String[] assignees = assignee.split(",");
                                        if(assignees != null && assignees.length > 0) {
                                            String[] var17 = assignees;
                                            int var18 = assignees.length;

                                            for(int var19 = 0; var19 < var18; ++var19) {
                                                String var10000 = var17[var19];
                                                if(assignee.contains(BpmTaskConstant.ASSIGNEE_ORG_PREFIX)) {
                                                    OpuOmOrg opuOmOrg = this.opuOmOrgMapper.getActiveOrgByOrgCode(assignee.substring(assignee.indexOf("."), assignee.length()));
                                                    if(opuOmOrg != null) {
                                                        defaultSendAssignees.append(opuOmOrg.getOrgName() + "、");
                                                    }
                                                } else if(assignee.contains(BpmTaskConstant.ASSIGNEE_ROLE_PREFIX)) {
                                                    OpuOmPos opuOmPos = this.opuOmPosMapper.getPosByPosCode(assignee.substring(assignee.indexOf("."), assignee.length()));
                                                    if(opuOmPos != null) {
                                                        defaultSendAssignees.append(opuOmPos.getPosName() + "、");
                                                    }
                                                } else if(assignee.contains(BpmTaskConstant.ASSIGNEE_POS_PREFIX)) {
                                                    OpuRsRole opuRsRole = this.opuRsRoleMapper.getRoleByRoleCode(assignee.substring(assignee.indexOf("."), assignee.length()));
                                                    if(opuRsRole != null) {
                                                        defaultSendAssignees.append(opuRsRole.getRoleName() + "、");
                                                    }
                                                } else {
                                                    OpuOmUser opuOmUser = this.opuOmUserMapper.getUserByLoginName(assignee);
                                                    if(opuOmUser != null) {
                                                        defaultSendAssignees.append(opuOmUser.getUserName() + "、");
                                                    }
                                                }
                                            }
                                        }

                                        if(defaultSendAssignees.length() > 0) {
                                            destTaskConfig.setDefaultSendAssignees(defaultSendAssignees.substring(0, defaultSendAssignees.lastIndexOf("、")).toString());
                                        }
                                    } else if(assignee.contains(BpmTaskConstant.ASSIGNEE_ORG_PREFIX)) {
                                        OpuOmOrg opuOmOrg = this.opuOmOrgMapper.getActiveOrg(assignee.substring(assignee.indexOf("."), assignee.length()));
                                        if(opuOmOrg != null) {
                                            destTaskConfig.setDefaultSendAssignees(opuOmOrg.getOrgName());
                                        }
                                    } else if(assignee.contains(BpmTaskConstant.ASSIGNEE_ROLE_PREFIX)) {
                                        OpuOmPos opuOmPos = this.opuOmPosMapper.getPos(assignee.substring(assignee.indexOf("."), assignee.length()));
                                        if(opuOmPos != null) {
                                            destTaskConfig.setDefaultSendAssignees(opuOmPos.getPosName());
                                        }
                                    } else if(assignee.contains(BpmTaskConstant.ASSIGNEE_POS_PREFIX)) {
                                        OpuRsRole opuRsRole = this.opuRsRoleMapper.getRoleByRoleId(assignee.substring(assignee.indexOf("."), assignee.length()));
                                        if(opuRsRole != null) {
                                            destTaskConfig.setDefaultSendAssignees(opuRsRole.getRoleName());
                                        }
                                    } else {
                                        OpuOmUser opuOmUser = this.opuOmUserMapper.getUserByLoginName(assignee);
                                        if(opuOmUser != null) {
                                            List<OpuOmUserOrg> userOrgList = this.opuOmUserOrgMapper.getUserOrgsByUserId(opuOmUser.getUserId());
                                            if(userOrgList.size() > 0) {
                                                OpuOmUserInfo opuOmUserInfo = this.opuOmUserInfoMapper.getOpuOmUserInfoByUserId(opuOmUser.getUserId());
                                                destTaskConfig.setDefaultSendAssignees(opuOmUser.getUserName());
                                                destTaskConfig.setOrgId(((OpuOmUserOrg)userOrgList.get(0)).getOrgId());
                                                destTaskConfig.setUserMobile(opuOmUserInfo.getUserMobile());
                                                OpuOmOrg opuOmOrg = this.opuOmOrgMapper.getOrg(((OpuOmUserOrg)userOrgList.get(0)).getOrgId());
                                                if(opuOmOrg != null) {
                                                    destTaskConfig.setOrgName(opuOmOrg.getOrgName());
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    destTaskConfig.setNeedSelectAssignee(true);
                                    if(assigneeRange.indexOf(",") != -1) {
                                        firstAssignee = assigneeRange.substring(0, assigneeRange.indexOf(","));
                                    } else {
                                        firstAssignee = assigneeRange;
                                    }

                                    this.paserFirstAssigneeByFirstAssigneeString(firstAssignee, destTaskConfig);
                                }
                            }
                        } else {
                            destTaskConfig.setMultiTask(false);
                            destTaskConfig.setMessage("所选下一环节为单人审批模式，请选择一个办理人。");
                            defaultSendAssignees = null;
                            if(StringUtils.isNotEmpty(assignee) || StringUtils.isNotEmpty(assigneeRange)) {
                                if(StringUtils.isNotEmpty(assignee)) {
                                    destTaskConfig.setNeedSelectAssignee(false);
                                    if(assignee.indexOf(",") != -1) {
                                        firstAssignee = assignee.substring(0, assignee.indexOf(","));
                                    } else {
                                        firstAssignee = assignee;
                                    }

                                    if("$INITIATOR".equals(assignee)) {
                                        firstAssignee = (String)this.runtimeService.getVariable(currTask.getProcessInstanceId(), "$INITIATOR");
                                    }

                                    this.paserFirstAssigneeByFirstAssigneeString(firstAssignee, destTaskConfig);
                                } else {
                                    destTaskConfig.setNeedSelectAssignee(true);
                                    if(assigneeRange.indexOf(",") != -1) {
                                        firstAssignee = assigneeRange.substring(0, assigneeRange.indexOf(","));
                                    } else {
                                        firstAssignee = assigneeRange;
                                    }

                                    this.paserFirstAssigneeByFirstAssigneeString(firstAssignee, destTaskConfig);
                                }
                            }
                        }
                    } else {
                        destTaskConfig.setMessage("所选下一环节为自动环节，无需选择办理人。");
                        destTaskConfig.setNeedSelectAssignee(false);
                    }
                    list.add(destTaskConfig);
                }
                return list;
            }
        }

        return null;
    }

    private void paserFirstAssigneeByFirstAssigneeString(String firstAssignee, BpmDestTaskConfig taskSendEntity) {
        if(!firstAssignee.contains(BpmTaskConstant.ASSIGNEE_ORG_PREFIX) && !firstAssignee.contains(BpmTaskConstant.ASSIGNEE_POS_PREFIX) && !firstAssignee.contains(BpmTaskConstant.ASSIGNEE_ROLE_PREFIX)) {
            OpuOmUser opuOmUser = this.opuOmUserMapper.getUserByLoginName(firstAssignee);
            if(opuOmUser != null) {
                taskSendEntity.setDefaultSendAssignees(opuOmUser.getUserName());
                taskSendEntity.setDefaultSendAssigneesId(opuOmUser.getLoginName());
            }
        }

        List userList;
        if(firstAssignee.contains(BpmTaskConstant.ASSIGNEE_ORG_PREFIX)) {
            OpuOmOrg org = this.opuOmOrgMapper.getActiveOrg(firstAssignee.replace(BpmTaskConstant.ASSIGNEE_ORG_PREFIX, ""));
            userList = this.opuOmUserOrgMapper.getOpuOmUsersByOrgId(org.getOrgId());
            if(userList != null && userList.size() > 0) {
                taskSendEntity.setDefaultSendAssignees(((OpuOmUser)userList.get(0)).getUserName());
                taskSendEntity.setDefaultSendAssigneesId(((OpuOmUser)userList.get(0)).getLoginName());
            }
        }

        if(firstAssignee.contains(BpmTaskConstant.ASSIGNEE_POS_PREFIX)) {
            OpuOmPos pos = this.opuOmPosMapper.getPosByPosCode(firstAssignee.replace(BpmTaskConstant.ASSIGNEE_POS_PREFIX, ""));
            userList = this.opuOmUserPosMapper.getActiveUsersByPosId(pos.getPosId());
            if(userList != null && userList.size() > 0) {
                taskSendEntity.setDefaultSendAssignees(((OpuOmUser)userList.get(0)).getUserName());
                taskSendEntity.setDefaultSendAssigneesId(((OpuOmUser)userList.get(0)).getLoginName());
            }
        }

        if(firstAssignee.contains(BpmTaskConstant.ASSIGNEE_ROLE_PREFIX)) {
            OpuRsRole role = this.opuRsRoleMapper.getRoleByRoleCode(firstAssignee.replace(BpmTaskConstant.ASSIGNEE_ROLE_PREFIX, ""));
            userList = this.opuAcRoleUserMapper.getActiveUserByRoleId(role.getRoleId());
            if(userList != null && userList.size() > 0) {
                taskSendEntity.setDefaultSendAssignees(((OpuOmUser)userList.get(0)).getUserName());
                taskSendEntity.setDefaultSendAssigneesId(((OpuOmUser)userList.get(0)).getLoginName());
            }
        }

    }
    /**
     * 获取办理信息
     * */
    @Override
    public List<BpmHistoryCommentForm> getHistoryCommentsByProcessInstanceId(String processInstanceId) throws Exception {
        List<BpmHistoryCommentForm> list = new ArrayList();
        if(processInstanceId != null && !"".equals(processInstanceId)) {
            List<Comment> commentList = this.taskService.getProcessInstanceComments(processInstanceId);
            List<HistoricTaskInstance> historyTaskList = ((HistoricTaskInstanceQuery)this.historyService.createHistoricTaskInstanceQuery().processInstanceId(processInstanceId)).list();
            List<HistoricActivityInstance> historyActivityList = this.historyService.createHistoricActivityInstanceQuery().processInstanceId(processInstanceId).activityType("userTask").list();
            if(historyActivityList != null && historyActivityList.size() > 0) {
                Iterator var6 = historyActivityList.iterator();

                label57:
                while(var6.hasNext()) {
                    HistoricActivityInstance activityInstance = (HistoricActivityInstance)var6.next();
                    Iterator var8 = historyTaskList.iterator();

                    while(true) {
                        HistoricTaskInstance taskInstance;
                        do {
                            if(!var8.hasNext()) {
                                continue label57;
                            }

                            taskInstance = (HistoricTaskInstance)var8.next();
                        } while(!activityInstance.getTaskId().equals(taskInstance.getId()));

                        BpmHistoryCommentForm historyCommentForm = new BpmHistoryCommentForm();
                        historyCommentForm.setNodeName(activityInstance.getActivityName());
                        historyCommentForm.setSigeInDate(activityInstance.getStartTime());
                        historyCommentForm.setEndDate(activityInstance.getEndTime());
                        historyCommentForm.setTaskId(activityInstance.getTaskId());
                        if(StringUtils.isNotBlank(taskInstance.getAssignee())) {
                            OpuOmUser opuOmUser = this.opuOmUserMapper.getUserByLoginName(taskInstance.getAssignee());
                            if(opuOmUser != null) {
                                List<OpuOmUserOrg> userOrgList = this.opuOmUserOrgMapper.getUserOrgsByUserId(opuOmUser.getUserId());
                                if(userOrgList.size() > 0) {
                                    OpuOmUserInfo opuOmUserInfo = this.opuOmUserInfoMapper.getOpuOmUserInfoByUserId(opuOmUser.getUserId());
                                    historyCommentForm.setTaskAssignee(opuOmUser.getUserName());
                                    historyCommentForm.setOrgId(((OpuOmUserOrg)userOrgList.get(0)).getOrgId());
                                    historyCommentForm.setUserMobile(opuOmUserInfo.getUserMobile());
                                    OpuOmOrg opuOmOrg = this.opuOmOrgMapper.getOrg(((OpuOmUserOrg)userOrgList.get(0)).getOrgId());
                                    if(opuOmOrg != null) {
                                        historyCommentForm.setOrgName(opuOmOrg.getOrgName());
                                    }
                                }
                            }
                        }

                        historyCommentForm.setTaskState(Integer.valueOf(activityInstance.getRevision()));
                        if(commentList != null && commentList.size() > 0) {
                            Iterator var15 = commentList.iterator();

                            while(var15.hasNext()) {
                                Comment comment = (Comment)var15.next();
                                if(activityInstance.getTaskId().equals(comment.getTaskId())) {
                                    historyCommentForm.setCommentMessage(comment.getFullMessage());
                                }
                            }
                        }

                        list.add(historyCommentForm);
                    }
                }
            }
        }

        return list;
    }

    /**
     * 发送到下一步
     * */
    @Override
    public Boolean wfSend(BpmTaskSendObject sendObject) throws Exception {
        try {
            if(sendObject == null) {
                throw new RuntimeException("任务Id不能为空!");
            }
            //BpmTaskSendObject sendObject = (BpmTaskSendObject) JSONObject.parseObject(sendObjectStr, BpmTaskSendObject.class);
            this.completeTask(sendObject);
        } catch (Exception var3) {
            var3.printStackTrace();
            throw new RuntimeException(var3);
        }
        return true;
    }
    @Override
    public void completeTask(BpmTaskSendObject sendObject) throws Exception {
        if (sendObject != null && sendObject.getTaskId() != null) {
            String[] destActIds = null;
            Task task = (Task) ((TaskQuery) this.taskService.createTaskQuery().taskId(sendObject.getTaskId())).singleResult();
            List<BpmTaskSendConfig> sendConfigs = sendObject.getSendConfigs();
            if (sendConfigs != null && sendConfigs.size() > 0) {
                destActIds = new String[sendConfigs.size()];

                for (int i = 0; i < sendConfigs.size(); ++i) {
                    BpmTaskSendConfig sendConfig = (BpmTaskSendConfig) sendConfigs.get(i);
                    destActIds[i] = sendConfig.getDestActId();
                    if (sendConfig.isUserTask()) {
                        String assigneeStr = sendConfig.getAssignees();
                        String[] assignees;
                        if (assigneeStr != null && assigneeStr.contains(",")) {
                            assignees = assigneeStr.split(",");
                        } else {
                            assignees = new String[]{assigneeStr};
                        }

                        if (sendConfig.isEnableMultiTask()) {
                            if (assignees == null || assignees.length <= 0) {
                                throw new RuntimeException("所选下一环节为多人审批模式，请选择一个或多个办理人。");
                            }

                            Map<String, Object> vars = new HashMap();
                            vars.put("$SYSVAR_ASSIGNEES." + sendConfig.getDestActId(), Arrays.asList(assignees));
                            this.runtimeService.setVariables(task.getProcessInstanceId(), vars);
                        } else {
                            if (assignees == null || assignees.length != 1) {
                                int count = 0;
                                if (assignees != null) {
                                    count = assignees.length;
                                }

                                throw new RuntimeException("目标节点没有启用多工作项，因此只能发送给一个用户。但指定的实际用户数为:" + count);
                            }

                            if (assignees[0] != null && !"".equals(assignees[0].trim())) {
                                this.runtimeService.setVariableLocal(task.getProcessInstanceId(), "$SYSVAR_ASSIGNEE." + sendConfig.getDestActId(), assignees[0]);
                            }
                        }
                    }
                }
            }
            if (task != null) {
                this.taskService.complete(sendObject.getTaskId(), destActIds, (Map) null);
            }
        }
    }

    @Override
    public BpmProcessContext workFlowBusSave(GxProblemReport busForm, BpmWorkFlowConfig workFlowConfig, OpusLoginUser user) throws Exception {
        workFlowConfig.setNewForm(StringUtils.isBlank(busForm.getBusId()));
        if(busForm != null && workFlowConfig != null) {
            if(workFlowConfig.isNewForm() && workFlowConfig.getFlowdefKey() != null && !"".equals(workFlowConfig.getFlowdefKey().trim())) {
                gxProblemReportService.saveBusForm(busForm);
                String instanceId = null;
                String defId = null;
                ActStoAppinst actStoAppinst = new ActStoAppinst();
                if("proc".equals(workFlowConfig.getFlowModel()) || "cmmn".equals(workFlowConfig.getFlowModel())) {
                    ProcessInstance processInstance = this.bpmProcessService.startProcessInstanceByKey(workFlowConfig.getFlowdefKey(),user.getUser().getLoginName(), busForm);
                    instanceId = processInstance.getId();
                    defId = processInstance.getProcessDefinitionId();
                    actStoAppinst.setProcInstId(instanceId);
                }

                actStoAppinst.setAppFlowdefId(workFlowConfig.getAppFlowdefId());
                actStoAppinst.setMasterRecordId(busForm.getBusId());
                actStoAppinst.setAppinstId(UUID.randomUUID().toString());
                if(busForm.isSupportSummary()) {
                    actStoAppinst.setSupportSummary("1");
                } else {
                    actStoAppinst.setSupportSummary("0");
                }

                String appId = this.actTplAppFlowdefService.getActTplAppFlowdefById(workFlowConfig.getAppFlowdefId()).getAppId();
                ActTplAppForm actTplAppForm = new ActTplAppForm();
                actTplAppForm.setAppId(appId);
                actTplAppForm.setIsMasterForm("1");
                List<ActTplAppForm> actTplAppFormList = this.actTplAppFormService.listActTplAppForm(actTplAppForm);
                Iterator var9 = actTplAppFormList.iterator();

                Map tagsMap;
                while(var9.hasNext()) {
                    ActTplAppForm actTplAppForm1 = (ActTplAppForm)var9.next();
                    if("1".equals(actTplAppForm1.getFormTmnId())) {
                        tagsMap = this.getSummary(actTplAppForm1.getFormCode(), busForm.getBusId(),user);
                        if(tagsMap != null) {
                            if(tagsMap.get("summaryTitle") != null) {
                                actStoAppinst.setSummaryTitle(tagsMap.get("summaryTitle").toString());
                            }

                            if(tagsMap.get("summaryDesc") != null) {
                                actStoAppinst.setSummaryDesc(tagsMap.get("summaryDesc").toString());
                            }

                            if(tagsMap.get("summaryOthers") != null) {
                                actStoAppinst.setSummaryOthers(tagsMap.get("summaryOthers").toString());
                            }
                        }
                        break;
                    }
                }

                actStoAppinst.setAppinstIsDeleted("0");
                actStoAppinst.setCreater(user.getUser().getLoginName());
                actStoAppinst.setCreateTime(new Date());
                actStoAppinst.setAppId(appId);
                actStoAppinst.setFlowMode("proc");
                this.actStoAppinstService.saveActStoAppinst(actStoAppinst);
                BpmProcessContext processContext = new BpmProcessContext();
                processContext.setMasterEntityKey(busForm.getBusId());
                processContext.setProcdefKey(workFlowConfig.getFlowdefKey());
                processContext.setProcessInstanceId(instanceId);
                Task task = null;
                tagsMap = null;
                List list;
                if(!"proc".equals(workFlowConfig.getFlowModel()) && !"cmmn".equals(workFlowConfig.getFlowModel())) {
                    list = ((TaskQuery)((TaskQuery)this.taskService.createTaskQuery().caseinstId(instanceId)).taskAssignee(user.getUser().getLoginName())).list();
                } else {
                    list = ((TaskQuery)((TaskQuery)this.taskService.createTaskQuery().processInstanceId(instanceId)).taskAssignee(user.getUser().getLoginName())).list();
                }

                if(list != null && list.size() == 1) {
                    task = (Task)list.get(0);
                    processContext.setCurrUserTask(true);
                    processContext.setSuccess(true);
                    processContext.setFlowModel(workFlowConfig.getFlowModel());
                } else {
                    List<Task> otherTask = null;
                    if(!"proc".equals(workFlowConfig.getFlowModel()) && !"cmmn".equals(workFlowConfig.getFlowModel())) {
                        otherTask = ((TaskQuery)this.taskService.createTaskQuery().caseinstId(instanceId)).list();
                    } else {
                        otherTask = ((TaskQuery)this.taskService.createTaskQuery().processInstanceId(instanceId)).list();
                    }

                    if(otherTask != null && otherTask.size() > 0) {
                        task = (Task)otherTask.get(0);
                        processContext.setSuccess(true);
                    } else {
                        processContext.setSuccess(false);
                        processContext.setFailMessage("当前流程启动失败，无法获取第一个节点信息，请检查流程定义信息！");
                    }

                    processContext.setCurrUserTask(false);
                }

                if(task != null) {
                    processContext.setTaskId(task.getId());
                    processContext.setTaskName(task.getName());
                    processContext.setNextTaskAssigneeName(task.getAssigneeName());
                    processContext.setCurrTaskDefId(task.getTaskDefinitionKey());
                    processContext.setRecordIds(this.bpmProcessFrontService.getRecordIds(processContext.getProcessInstanceId()));
                    if(!"proc".equals(workFlowConfig.getFlowModel()) && !"cmmn".equals(workFlowConfig.getFlowModel())) {
                        ActFlexCasedefVersion actFlexCasedefVersion = this.actFlexCasedefVersionService.getActFlexCasedefVersionById(defId);
                        processContext.setCurrProcDefVersion(Integer.valueOf(actFlexCasedefVersion.getCasedefVersion().intValue()));
                    } else {
                        ProcessDefinition processDefinition = this.repositoryService.getProcessDefinition(defId);
                        processContext.setCurrProcDefVersion(Integer.valueOf(processDefinition.getVersion()));
                    }
                }

                return processContext;
            }

            gxProblemReportService.updateBusForm(busForm);
            if(workFlowConfig.getProcessInstanceId() == null) {
                throw new RuntimeException("流程实例id不能为空");
            }

            Map<String, Object> initiatorParam = new HashMap();
            initiatorParam.put("form", busForm);
            if("proc".equals(workFlowConfig.getFlowModel()) || "cmmn".equals(workFlowConfig.getFlowModel())) {
                this.bpmProcessService.setProcessInstanceVariables(workFlowConfig.getProcessInstanceId(), initiatorParam);
            }
        }

        return null;
    }


    public Map getSummary(String formCode, String bizId,OpusLoginUser user) throws Exception {
        ActStoRule actStoRule = new ActStoRule();
        ActStoForm actStoForm = this.actStoFormService.getActStoFormByFormCode(formCode);
        Map map = new HashMap();
        if(actStoForm != null) {
            actStoRule.setFormId(actStoForm.getFormId());
            List<ActStoRule> actStoRuleList = this.actStoRuleService.listActStoRule(actStoRule);
            if(actStoRuleList.size() > 0) {
                actStoRule = (ActStoRule)actStoRuleList.get(0);
                List<String> summaryTitleArr = this.getTags(actStoRule.getRuleTitle());
                map.put("summaryTitle", summaryTitleArr == null?actStoRule.getRuleTitle():this.replaceTags(actStoForm.getMetaDbTableId(), bizId, summaryTitleArr, actStoRule.getRuleTitle(),user));
                List<String> summaryDescArr = this.getTags(actStoRule.getRuleDesc());
                map.put("summaryDesc", summaryDescArr == null?actStoRule.getRuleDesc():this.replaceTags(actStoForm.getMetaDbTableId(), bizId, summaryDescArr, actStoRule.getRuleDesc(),user));
                List<String> summaryOthersArr = this.getTags(actStoRule.getRuleOthers());
                map.put("summaryOthers", summaryOthersArr == null?actStoRule.getRuleOthers():this.replaceTags(actStoForm.getMetaDbTableId(), bizId, summaryOthersArr, actStoRule.getRuleOthers(),user));
            }
        }

        return map;
    }
    private String replaceTags(String tableId, String bizId, List<String> list, String tag,OpusLoginUser user) throws Exception {
        MetaDbColumn metaDbColumn = new MetaDbColumn();
        metaDbColumn.setTableId(tableId);
        metaDbColumn.setIsPrimary("1");
        List<MetaDbColumn> metaDbColumnList = this.metaDbColumnService.listMetaDbColumn(metaDbColumn);
        Map<String, Object> formData = new HashMap();
        if(metaDbColumnList.size() > 0) {
            metaDbColumn = (MetaDbColumn)metaDbColumnList.get(0);
            formData = this.actStoSmartFormOperaMapper.getFormDataByBizId(metaDbColumn.getTableName(), metaDbColumn.getColumnName(), bizId);
        }

        ((Map)formData).put("CURR_USER_NAME", user.getUser().getUserName());
        OpuOmOrg opuOmOrg = this.opuOmOrgMapper.getOrg(user.getCurrentOrgId());
        ((Map)formData).put("ORG_NAME", opuOmOrg != null?opuOmOrg.getOrgName():"");
        Iterator var9 = list.iterator();

        while(true) {
            while(var9.hasNext()) {
                String str = (String)var9.next();
                String str1 = CommonTools.humpToLine(str).toUpperCase();
                Iterator var12 = ((Map)formData).entrySet().iterator();

                while(var12.hasNext()) {
                    Map.Entry<String, Object> entry = (Map.Entry)var12.next();
                    if(StringUtils.isNotBlank((String)entry.getKey()) && StringUtils.isNotBlank(str1) && ((String)entry.getKey()).toUpperCase().equals(str1)) {
                        tag = tag.replace("#[" + str + "]", entry.getValue().toString());
                        break;
                    }
                }
            }

            return tag;
        }
    }
    private List<String> getTags(String str) {
        List<String> list = new ArrayList();
        if(StringUtils.isNotBlank(str)) {
            String regAll = "\\#\\[[\\w]+\\]";
            Pattern pattern = Pattern.compile(regAll);
            Matcher matcher = pattern.matcher(str);

            while(matcher.find()) {
                String temp = matcher.group();
                list.add(temp.substring(2, temp.length() - 1));
            }
        }

        return list;
    }
}
