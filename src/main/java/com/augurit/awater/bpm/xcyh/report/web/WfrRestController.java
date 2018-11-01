package com.augurit.awater.bpm.xcyh.report.web;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.text.Format;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import javax.persistence.EntityManager;
import javax.servlet.http.HttpServletRequest;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.augurit.agcloud.bpm.common.domain.*;
import com.augurit.agcloud.bpm.common.service.*;
import com.augurit.agcloud.bpm.common.utils.ViewProviderSqlCreater;
import com.augurit.agcloud.bpm.front.controller.BpmBusAbstractController;
import com.augurit.agcloud.bpm.front.domain.BpmProcessContext;
import com.augurit.agcloud.bpm.front.domain.BpmWorkFlowConfig;
import com.augurit.agcloud.bpm.front.service.BpmProcessFrontService;
import com.augurit.agcloud.bpm.front.service.BpmViewDynRenderingService;
import com.augurit.agcloud.bsc.domain.BscAttForm;
import com.augurit.agcloud.bsc.sc.att.service.IBscAttService;
import com.augurit.agcloud.bsc.sc.init.service.BscInitService;
import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.framework.security.user.OpusLoginUser;
import com.augurit.agcloud.framework.ui.result.ContentResultForm;
import com.augurit.agcloud.opus.common.domain.*;
import com.augurit.agcloud.org.PsxjProperties;
import com.augurit.agcloud.org.rest.service.IOmRsRoleRestService;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.agcloud.org.service.IBpmService;
import com.augurit.agcloud.org.service.IPsOrgUserService;
import com.augurit.agcloud.util.login.AppLoginClient;
import com.augurit.agcloud.util.login.AppLoginForm;
import com.augurit.awater.bpm.file.service.IDynamictableService;
import com.augurit.awater.bpm.file.service.ISysFileService;
import com.augurit.awater.bpm.file.web.form.SysFileForm;
import com.augurit.awater.bpm.problem.service.ICcProblemService;
import com.augurit.awater.bpm.sggc.service.IGxSggcService;
import com.augurit.awater.bpm.sggc.web.form.GxSggcForm;
import com.augurit.awater.bpm.sggc.web.form.GxSggcLogForm;
import com.augurit.awater.bpm.xcyh.asiWorkflow.web.form.BzFrom;
import com.augurit.awater.bpm.xcyh.report.domain.GxProblemReport;
import com.augurit.awater.bpm.xcyh.report.service.IGxProblemReportService;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.awater.bpm.xcyh.report.web.form.*;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.problem_report.correct_mark.service.ICorrectMarkService;
import com.augurit.awater.dri.utils.JsonOfForm;
import com.augurit.awater.dri.utils.Result;
import com.augurit.awater.dri.utils.ResultForm;
import com.augurit.awater.util.ThirdUtils;
import com.augurit.awater.util.data.SymmetricEncoder;
import com.augurit.awater.util.file.SysFileUtils;
import com.common.util.Common;
import net.coobird.thumbnailator.Thumbnails;
import net.sf.json.JSONObject;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.lang3.StringUtils;
import org.flowable.engine.HistoryService;
import org.flowable.engine.RepositoryService;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.flowable.engine.history.HistoricActivityInstance;
import org.flowable.engine.history.HistoricProcessInstance;
import org.flowable.engine.repository.ProcessDefinition;
import org.flowable.task.api.Task;
import org.flowable.task.api.history.HistoricTaskInstance;
import org.flowable.task.api.history.HistoricTaskInstanceQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@RestController
@RequestMapping("/rest/app/asiWorkflow")
public class WfrRestController extends BpmBusAbstractController<GxProblemReport> {
	//附件
	@Autowired
	protected IBscAttService bscAtService;
	@Autowired
	private PsxjProperties psxjProperties;
	@Autowired
	private IPsOrgUserService psOrgUserService;
    @Autowired
    private ISysFileService sysFileService;
	@Autowired
	private IGxProblemReportService gxProblemReportService;
    @Autowired
    private IGxSggcService gxSggcService;
    @Autowired
    private ICcProblemService ccproblemService;
    @Autowired
    private ActStoAppinstService actStoAppinstService;

    @Autowired
    private ICorrectMarkService correctMarkService;
    @Autowired
    private IDynamictableService dynamictableService;

	@Autowired
	private IOmOrgRestService omOrgRestService;

	@Autowired
	private IOmUserInfoRestService omUserInfoRestService;
	@Autowired
	private IOmRsRoleRestService omRsRoleRestService;

	/*@Autowired
	private ActTplAppProcdefService actTplAppProcdefService;*/
	@Autowired
	private IBpmService bpmService;
	/**flowable*/
	@Autowired
	private HistoryService historyService;
	@Autowired
	private ActTplAppService actTplAppService;
	@Autowired
	private BpmProcessFrontService bpmProcessFrontService;
	@Autowired
	private ActStoViewService actStoViewService;
	@Autowired
	private ActStoLayoutService actStoLayoutService;
	@Autowired
	private BpmViewDynRenderingService bpmViewDynRenderingService;
	@Autowired
	private BpmProcessService bpmProcessService;
	@Autowired
	private BpmTaskService bpmTaskService;
	@Autowired
	private TaskService taskService;
	@Autowired
	private RuntimeService runtimeService;
	@Autowired
	private RepositoryService repositoryService;
	@Autowired
	protected BscInitService bscInitService;


	@Value("${filePath}")
	private String filePath;

	private String procdefKey = "GX_XCYH";

	private String R2 = "R025-G014";
	private String R1 = "R025-G005";
	private String R0 = "R025-G013";
	private String RM = "R025-G024";
	private String RG = "R025-G018";

	private String appProcdefId;

	@Autowired
	private EntityManager entityManager;

    public WfrRestController() {
    }

    /**获取下一环节信息*/
	@RequestMapping({"/getTaskSendConfig.do"})
	public Result getTaskSendConfig(String taskId) throws Exception {
		if(StringUtils.isBlank(taskId)) {
			return new Result(false, "taskId不能为空");
		} else {
			List<BpmDestTaskConfig> sendEntity = this.bpmService.getBpmDestTaskConfigsByCurrTaskId(taskId);
			return new Result(true, sendEntity);
		}
	}
    /**
	 * 待办(leave_request_agency_view)
	 * 已办(view-code-00000037)
	 * 办结(view-code-00000039)
	 * @return TASK_ID,viewId
	 * */
	@RequestMapping({"/handleView"})
	public Map checkTask(ActStoView actStoView, com.github.pagehelper.Page page, HttpServletRequest request) throws Exception {
		Map<String, String> queryMap = ViewProviderSqlCreater.parserAndGetQuestMap(request);
		return this.bpmViewDynRenderingService.getBootstrapPageViewData(actStoView, page, queryMap);
	}
    /**
	 *  根据任务id和视图id查询相关业务表配置
	 * */
	@RequestMapping({"/checkTask"})
	public Map checkTask(String taskId, String viewId) throws Exception {
		Map modelMap = new HashMap();
		if(StringUtils.isNotBlank(taskId)) {
			HistoricTaskInstance historicTaskInstance = (HistoricTaskInstance)((HistoricTaskInstanceQuery)this.historyService.createHistoricTaskInstanceQuery().taskId(taskId)).singleResult();
			if(historicTaskInstance == null) {
				throw new RuntimeException("task不存在！");
			}
			HistoricProcessInstance processInstance = (HistoricProcessInstance)this.historyService.createHistoricProcessInstanceQuery().processInstanceId(historicTaskInstance.getProcessInstanceId()).singleResult();
			modelMap.put("taskId", taskId);
			modelMap.put("taskName", historicTaskInstance.getName());
			modelMap.put("processInstanceId", processInstance.getId());
			modelMap.put("isCheck", "1");
			modelMap.put("viewId", viewId);
			modelMap.put("currTaskDefId", historicTaskInstance.getTaskDefinitionKey());
			ProcessDefinition processDefinition = this.repositoryService.getProcessDefinition(processInstance.getProcessDefinitionId());
			if(processDefinition != null) {
				modelMap.put("currProcDefVersion", Integer.valueOf(processDefinition.getVersion()));
			}
			ActStoAppinst actStoAppinst = this.bpmProcessFrontService.getActStoAppinstByProcInstId(processInstance.getId());
			if(actStoAppinst == null) {
				throw new RuntimeException("没获取到流程实例与业务主表关联信息，请查证");
			}
			modelMap.put("masterEntityKey", actStoAppinst.getMasterRecordId());
			ActTplAppFlowdef actTplAppProcdef = this.bpmProcessFrontService.getActTplAppProcdefById(actStoAppinst.getAppFlowdefId());
			if(actTplAppProcdef == null) {
				throw new RuntimeException("流程不存在！");
			}
			ActTplApp actTplApp = this.actTplAppService.getActTplAppById(actTplAppProcdef.getAppId());
			if(actTplApp != null) {
				modelMap.put("appComment", actTplApp.getAppComment());
			}
			modelMap.put("appProcdefId", actTplAppProcdef.getAppFlowdefId());
			modelMap.put("formJson", this.bpmProcessFrontService.getFormJson(actTplAppProcdef.getAppId()));
		}
		return modelMap;
	}


    /*
    *暂存
    */
	public com.augurit.agcloud.framework.ui.result.ResultForm workFlowBusSave(GxProblemReport gxProblemReport, BpmWorkFlowConfig bpmWorkFlowConfig) throws Exception {
		BpmProcessContext processContext = super.workFlowBusSave(gxProblemReportService,gxProblemReport,bpmWorkFlowConfig);
		return new ContentResultForm(true,processContext);
	}

	/**
	 * 发送到下一步
	 * */
	@RequestMapping("/wfSend.do")
	public Result wfSend(BpmTaskSendObject sendConfig){
		try {
			if(sendConfig == null || sendConfig.getSendConfigs()==null ) {
				return new Result(false, "参数不能为空");
			}
			this.bpmTaskService.completeTask(sendConfig);
		} catch (Exception var3) {
			var3.printStackTrace();
			return new Result(false, var3.getMessage());
		}
		return new Result(true,"success");
	}

	/**
	 * 获取办理经过
	 * */
	@RequestMapping("/getTraceInfo")
	public Result getTraceInfo(String taskId,String id){
		try {
			Map map = new HashMap();
			List<Map> list = gxProblemReportService.getTraceInfo(taskId);
			//GxProblemReport gxProblemReport = gxProblemReportService.get(id);
			//map.put("form",gxProblemReport);
			//map.put("data",list);
			return new Result(true,list);
		} catch (Exception e) {
			e.printStackTrace();
			return new Result(false,e.getMessage());
		}
	}
	/**
	 * 任务回退
	 * */
	@RequestMapping({"/returnPrevTask.do"})
	public ResultForm returnPrevTask(String taskId) throws Exception {
		return StringUtils.isBlank(taskId)?
				new ResultForm(false, "当前节点id不能为空"):
				new ResultForm(true,this.bpmTaskService.returnPrevTask(taskId).getMessage());
	}
	/**
	 * 获取下一环节办理人的信息(任务派单-->r0)
	 * */
	@RequestMapping("/getAssignees")
	public Result  getAssignees(String loginName,HttpServletRequest request){
		OpusLoginUser user =(OpusLoginUser)request.getAttribute("opusLoginUser");
		Result res = new Result();
		List<OpuOmUser> userInfos =  gxProblemReportService.getAssignees(R0,loginName);
		List<Map<String,Object>> listMap= new ArrayList<>();
		if(userInfos!=null && (user!=null || StringUtils.isNotBlank(loginName))){
			for(OpuOmUser userInfo : userInfos){
				Map map = new HashMap();
				if(!user.getUser().getLoginName().equals(userInfo.getLoginName())){
					map.put("userCode",userInfo.getLoginName());
					map.put("userName",userInfo.getUserName());
					map.put("userId",userInfo.getUserId());
					listMap.add(map);
				}
			}
			return new Result(true,listMap);
		}else{
			return new Result(false,"查询信息失败!");
		}
	}

	/*************************************************************************************************/
	/** 获取启动工作流程配置 */
	private BpmWorkFlowConfig getBpmWrokConfig() throws Exception {
		BpmWorkFlowConfig bpmWorkFlowConfig = new BpmWorkFlowConfig();
		bpmWorkFlowConfig.setFlowdefKey(this.procdefKey);
		String appId = gxProblemReportService.getAppIdByProcDefKey(this.procdefKey);
		ActTplAppFlowdef actTplAppFlowdef = this.bpmProcessFrontService.getActTplAppProcdefByAppId(appId);
		if (actTplAppFlowdef != null) {
			ActTplApp actTplApp = this.actTplAppService.getActTplAppById(actTplAppFlowdef.getAppId());
			if ("proc".equals(actTplApp.getFlowModel())) {
				bpmWorkFlowConfig.setFlowdefKey(actTplAppFlowdef.getProcdefKey());
			} else if ("case".equals(actTplApp.getFlowModel())) {
				bpmWorkFlowConfig.setFlowdefKey(actTplAppFlowdef.getCasedefKey());
			}
			bpmWorkFlowConfig.setAppFlowdefId(actTplAppFlowdef.getAppFlowdefId());
			bpmWorkFlowConfig.setFlowModel(actTplApp.getFlowModel());
		}
		return bpmWorkFlowConfig;
	}
	/***********************************************app上报数据**********************************************/
	/**
	 * 施工过程日志上传
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/sggcLogSave")
	public Result sggcLogSave( HttpServletRequest request) {
		OpusLoginUser user =(OpusLoginUser)request.getAttribute("opusLoginUser");
		JSONObject jsonObject = new JSONObject();
		String loginName = request.getParameter("loginName");
		String userName = request.getParameter("userName");
		String sjid = request.getParameter("sjid");
		String sgjd = request.getParameter("sgjd");
		try{
			Map<String,MultipartFile> mapFile = null;
			boolean isMultiparPhotos = ServletFileUpload
					.isMultipartContent(request);
			if (isMultiparPhotos) {
				MultipartHttpServletRequest multiRequest=(MultipartHttpServletRequest)request;
				mapFile= multiRequest.getFileMap();
			}
			if(!Common.isCheckNull(userName) && !Common.isCheckNull(sjid) && !Common.isCheckNull(loginName)){

				GxSggcForm form = new GxSggcForm();
				form.setUsername(userName);
				form.setLoginname(loginName);
				form.setSjid(sjid);
				form.setLx("0");
				form.setTime(new Date());
				form.setContent(request.getParameter("content"));
				form.setSgjd(sgjd);
				gxSggcService.saveData(form);

				//上传附件
				List<BscAttForm> listAtt =  getMapParts(request,sjid,form.getId().toString(),"GxProblemReport_self",mapFile);
				for(BscAttForm basAtt :listAtt){
					basAtt.setRecordId(form.getId().toString());
					if(user!=null) basAtt.setOrgId(user.getCurrentOrgId());
					this.bscAtService.saveAtt(basAtt,loginName);
				}
				jsonObject.put("success", true);
				return new Result(true,"");
			}else{
				return new Result(false,"参数缺失!");
			}
		}catch(Exception e){
			e.printStackTrace();
			return new Result(false,"保存失败!"+e.getMessage());
		}
	}
	/**
	 * 获取区下班主
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/getbzOrg")
	public Result getbzOrg(HttpServletRequest request){
		OpusLoginUser user =(OpusLoginUser)request.getAttribute("opusLoginUser");
		String loginName = request.getParameter("loginName");
		List<Map<String, String>> userFormList = new ArrayList<Map<String, String>>();
		List<BzFrom> bzList = new ArrayList<BzFrom>();
		Map<String, String> map =new HashMap<String, String>();
		try {
			OpuOmUserInfo omUserForm = omUserInfoRestService.getOpuOmUserInfoByLoginName(user!=null?user.getUser().getLoginName():loginName);
			if(omUserForm != null){
                List<OpuOmOrg> orgList =  psOrgUserService.getParentOrgsByUserId(omUserForm.getUserId());
                if(orgList != null && orgList.size()>0){
                    List<OpuOmOrg> orgOrgList =new ArrayList<>();
                    for(OpuOmOrg omOrgForm : orgList){
                        List<OpuOmUserInfo> listUser =  psOrgUserService.listWorkGroupByOrgId(R2,omOrgForm.getOrgId());
                        for(OpuOmUser us :listUser){
                            Map<String, String> userMap = new HashMap<String, String>();
                            userMap.put("userCode", us.getLoginName());
                            userMap.put("userName", us.getUserName());
                            userFormList.add(userMap);
                        }
                        BzFrom bzFrom =new BzFrom();
                        bzFrom.setCode(omOrgForm.getOrgCode());
                        bzFrom.setName(omOrgForm.getOrgName());
                        bzFrom.setUserFormList(userFormList);
						bzList.add(bzFrom);
					}
                }
            }
            return new Result(true,bzList);
		} catch (Exception e) {
			e.printStackTrace();
			return new Result(false,"获取失败!"+e.getMessage());
		}
	}
	/**
	 * 转派
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/wfReassign")
	public ResultForm wfReassign(HttpServletRequest request) throws Exception {
		try {
			OpusLoginUser loginUser =(OpusLoginUser)request.getAttribute("opusLoginUser");
			String taskInstDbid = request.getParameter("instance.taskInstDbid");
			String assignee = request.getParameter("instance.assignee");
			String assigneeName = request.getParameter("instance.assigneeName");
			String activityChineseName = request.getParameter("instance.activityChineseName");
			String reassignComments = request.getParameter("instance.reassignComments");
			//短信记录需要的参数
			String isSendMessage=request.getParameter("isSendMessage");//是否发送短信
			String activityName = request.getParameter("instance.activityName");
			String procInstId = request.getParameter("instance.procInstId");
			String masterEntityKey=request.getParameter("instance.masterEntityKey");//实体主键
			if(StringUtils.isBlank(taskInstDbid) || StringUtils.isBlank(assignee)){
				return new ResultForm(false,"参数错误!");
			}
			//转派
			this.bpmTaskService.sendOnTask(taskInstDbid, assignee);
			return new ResultForm(200,true,"转派成功!");
		} catch (Exception e) {
			e.printStackTrace();
			return new ResultForm(500,false,"转派失败!"+e.getMessage());
		}
	}
	/**
	 * 获取下一步经办人信息和节点信息(获取R0用户)
	 * */
	@RequestMapping(value = "/getNextActivityInfo",produces="application/json;charset=UTF-8")
	public ResultForm getNextActivityInfo( HttpServletRequest request) {
		OpusLoginUser user =(OpusLoginUser)request.getAttribute("opusLoginUser");
		Map returnMap = new HashMap();
		String taskInstDbid = request.getParameter("taskInstDbid");
		String loginName = user==null?request.getParameter("loginName"):user.getUser().getLoginName();
		List<Map<String,Object>> returnList = new ArrayList<Map<String,Object>>();
		try {
			Task task =this.taskService.createTaskQuery().taskId(taskInstDbid).singleResult();
			if(task==null){
				return new ResultForm(false,"当前任务已处理!");
			}
			List<BpmDestTaskConfig> sendEntity = this.bpmService.getBpmDestTaskConfigsByCurrTaskId(taskInstDbid);
			for(BpmDestTaskConfig destConfig : sendEntity){
				Map<String,Object> result = new HashMap<>();
				result.put("activityName",destConfig.getDestActId());
				result.put("activityChineseName",destConfig.getDestActName());
				HistoricActivityInstance actIns = null;
				String sendTaskAssignee =null;
				//拿到节点默认处理人
				if("fh".equals(destConfig.getDestActId()) || "rwfh".equals(destConfig.getDestActId())){
					//获取任务处置的处理人
					List<HistoricActivityInstance> list = this.historyService.createHistoricActivityInstanceQuery().activityId("sendTask")
							.processInstanceId(task.getProcessInstanceId()).orderByHistoricActivityInstanceStartTime()
							.desc().list();
					if(list!=null && list.size()>0)
						actIns = list.get(0);
				}
				if("xcyfh".equals(destConfig.getDestActId())){
					//获取任务处置的处理人
					List<HistoricActivityInstance> list = this.historyService.createHistoricActivityInstanceQuery().activityId("sendTask")
							.processInstanceId(task.getProcessInstanceId()).orderByHistoricActivityInstanceStartTime()
							.desc().list();
					if(list!=null && list.size()>0)
						actIns = list.get(0);
					sendTaskAssignee=actIns.getAssignee();
				}
				List<OpuOmUser> listUser = null;
				//问题上报下一步处理人
				if("problemReport".equals(task.getTaskDefinitionKey())){
					listUser =  gxProblemReportService.getAssignees(R0,loginName);
				}
				//派单
				if("sendTask".equals(task.getTaskDefinitionKey())){
					listUser =  gxProblemReportService.getAssignees(R2,loginName);
				}
				if("getTask".equals(task.getTaskDefinitionKey())){
					listUser =  gxProblemReportService.getAssignees(R0,loginName);
				}
				if("rwfh".equals(task.getTaskDefinitionKey())){
					listUser =  gxProblemReportService.getAssignees(R1,loginName);
				}
				if("xcyfh".equals(task.getTaskDefinitionKey())){
					listUser =  gxProblemReportService.getAssignees(R0,loginName);
				}
				//List<OpuOmUserInfo> listUser =  psOrgUserService.listWorkGroupByOrgId(R0,user.getCurrentOrgId());
				List<Map<String, Object>> userFormList = new ArrayList<Map<String, Object>>();
				if(listUser!=null){
					for(OpuOmUser us: listUser){
						if(!us.getLoginName().equals(user.getUser().getLoginName())){
							Map<String,Object> mapUs = new HashMap();
							mapUs.put("userCode",us.getLoginName());
							mapUs.put("userName",us.getUserName());
							if(sendTaskAssignee!=null){
								//判断是否为默认节点处理人
								if(us.getLoginName().equals(actIns.getAssignee())){
									mapUs.put("isDefault",true);
								}else{
									mapUs.put("isDefault",false);
								}
							}
							userFormList.add(mapUs);
						}
					}
					result.put("assigneers",userFormList);
				}else{
					result.put("assigneers",new ArrayList());
				}
				returnList.add(result);
			}
			return new ResultForm(true,returnList);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResultForm(false,"获取失败!"+e.getMessage());
		}
	}
	@RequestMapping("/AESEncode")
	@ResponseBody
	public Result AESEncode(HttpServletRequest request) {
		JSONObject jsonObject = new JSONObject();
		String content = request.getParameter("content");
		if(content==null || content.trim().length()<1){
			return new Result(false,"参数错误!");
		}
		String result = SymmetricEncoder.AESEncode("augur2017", content);
		return new Result(true,result);
	}
	/**
	 * app发送下一步
	 * */
	@RequestMapping("/wfSend")
	public Result wfSend(HttpServletRequest request)  {
		OpusLoginUser user =(OpusLoginUser)request.getAttribute("opusLoginUser");
		String userString = request.getParameter("loginUser");
		String loginName = request.getParameter("loginName");
		String bzCode = request.getParameter("bzCode");
		try {
			if (userString != null && !"".equals(userString)) {
				userString = new String(userString.getBytes("ISO-8859-1"), "utf-8");
			}
			String taskInstDbid = request.getParameter("instance.taskInstDbid");
			String destActivityName = request.getParameter("instance.destActivityName");
			String destActivityChineseName = request.getParameter("instance.destActivityChineseName");
			String templateCode = request.getParameter("templateCode");//流程code
			String templateName = request.getParameter("templateName");//流程名称
			String masterEntityKey = request.getParameter("instance.masterEntityKey");//实体主键
			String procInstId = request.getParameter("instance.procInstId");
			String assignee = request.getParameter("instance.assignee");
			String assigneeName = request.getParameter("instance.assigneeName");
			String handleComments = request.getParameter("instance.handleComments");
			//添加审核信息
			this.bpmTaskService.addTaskComment(taskInstDbid, procInstId, handleComments);
			BpmTaskSendObject sendConfig = new BpmTaskSendObject();
			sendConfig.setTaskId(taskInstDbid);
			List<BpmTaskSendConfig> listSendConfig = new ArrayList<>();
			BpmTaskSendConfig sendConfigs =new BpmTaskSendConfig();
			sendConfigs.setUserTask(true);
			sendConfigs.setEnableMultiTask(false);
			sendConfigs.setAssignees(assignee);
			sendConfigs.setDestActId(destActivityName);
			listSendConfig.add(sendConfigs);
			sendConfig.setSendConfigs(listSendConfig);
			this.bpmTaskService.completeTask(sendConfig);
			return new Result(true,"发送成功!");
		} catch (Exception e) {
			e.printStackTrace();
			return new Result(true,"发送失败!"+e.getMessage());
		}
	}
	/**
	 * 获取下一环节办理人和节点的信息(任务派单-->r0)
	 * */
	@RequestMapping("/getTaskUserByloginName")
	public Result  getTaskUserByloginName(String loginName,HttpServletRequest request){
		OpusLoginUser user =(OpusLoginUser)request.getAttribute("opusLoginUser");
		Result res = new Result();
		List<OpuOmUser> userInfos =  gxProblemReportService.getAssignees(R0,loginName);
		List<Map> listMap = new ArrayList<>();
		for(OpuOmUser us : userInfos){
			Map map = new HashMap();
			map.put("userCode",us.getLoginName());
			map.put("uerName",us.getUserName());
			map.put("loginName",us.getLoginName());
			listMap.add(map);
		}
		if(user!=null){
			return new Result(true,listMap);
		}else{
			return new Result(false,"查询信息失败!");
		}
	}
	//问题上报修改
	@PostMapping(value = "/wfBusSave",produces="application/json;charset=UTF-8")
	public String wfBusSave(HttpServletRequest request){
		JSONObject jsonObject = new JSONObject();
		String jsonString = null;
		String loginName = request.getParameter("loginName");
		String json = request.getParameter("json");
		String type = request.getParameter("type");
		String isSendMessage = request.getParameter("isSendMessage");//是否发送短信
		String assignee = request.getParameter("instance.assignee");
		String assigneeName = request.getParameter("instance.assigneeName");
		Object object =request.getAttribute("opusLoginUser");
		OpusLoginUser userForm = (OpusLoginUser) object;
		if("isMobile".equals(type)){
			if(object != null){
				loginName = userForm.getUser().getLoginName();
			}
		}
		try {
			Map<String,MultipartFile> mapFile = null;
			boolean isMultiparPhotos = ServletFileUpload
					.isMultipartContent(request);
			if (isMultiparPhotos) {
				MultipartHttpServletRequest multiRequest=(MultipartHttpServletRequest)request;
				mapFile= multiRequest.getFileMap();
			}else{
				jsonObject.put("code", 500);
				jsonObject.put("message", "未检测到文件!");
				return jsonObject.toString();
			}
			if(!Common.isCheckNull(loginName) && !Common.isCheckNull(json)) {
                //执行自己的保存，不走流程
                JSONObject json2 = JSONObject.fromObject(json);
                String isBySelf = json2.containsKey("isbyself")?json2.getString("isbyself"):null;
                if (isBySelf!=null && "true".equals(isBySelf)) {
                    GxProblemReportForm reportForm=saveBySelf(json,loginName);
					reportForm.setIsbyself("true");
					GxProblemReport gxEntity = new GxProblemReport();
					GxProblemReportConvertor.convertFormToVo(reportForm,gxEntity);
					gxProblemReportService.save(gxEntity);
                    //保存自行处理详情与照片
                    GxSggcForm form = new GxSggcForm();
                    form.setUsername(userForm.getUser().getUserName());
                    form.setLoginname(loginName);
                    form.setSjid(gxEntity.getId());
                    form.setLx("2");
                    form.setTime(new Date());
                    form.setContent(json2.getString("self_process_detail"));
                    gxSggcService.saveData(form);
                    //上传附件开始
                    List<BscAttForm> listAtt =  getMapParts(request,gxEntity.getId().toString(),form.getId().toString(),"GxProblemReport_self",mapFile);
                    if(listAtt!=null){
						for(BscAttForm basAtt :listAtt){
							basAtt.setOrgId(userForm.getCurrentOrgId());
							basAtt.setRecordId("0");//自行处理的附件
							this.bscAtService.saveAtt(basAtt,loginName);
						}
					}
                    jsonObject.put("success", true);
                    return jsonObject.toString();
                }else{
					if(StringUtils.isBlank(assignee) || object==null){
						jsonObject.put("success",false);
						jsonObject.put("message","参数错误!");
						return jsonObject.toString();
					}
					GxProblemReportForm reportForm=saveBySelf(json,loginName);
					GxProblemReport gxForm = new GxProblemReport();
					GxProblemReportConvertor.convertFormToVo(reportForm,gxForm);
					gxForm.setLoginname(loginName);
					if(object!=null){
						OpusLoginUser userInfo = (OpusLoginUser) object;
						gxForm.setSbr(userInfo.getUser().getUserName());
						gxForm.setDirectOrgId(userInfo.getCurrentOrgId());
						gxForm.setLoginname(userInfo.getUser().getLoginName());
					}
					/*Map<String,String> cmMap=correctMarkService.getFrom(gxForm.getLoginname());
					if(cmMap!=null && cmMap.size()>0){
						gxForm.setTeamOrgId(cmMap.get("teamOrgId"));
						gxForm.setTeamOrgName(cmMap.get("teamOrgName"));
						gxForm.setDirectOrgId(cmMap.get("directOrgId"));
						gxForm.setDirectOrgName(cmMap.get("directOrgName"));
						gxForm.setSuperviseOrgId(cmMap.get("superviseOrgId"));
						gxForm.setSuperviseOrgName(cmMap.get("superviseOrgName"));
						gxForm.setParentOrgId(cmMap.get("parentOrgId"));
						gxForm.setParentOrgName(cmMap.get("parentOrgName"));
					}*/
					if (gxForm.getBhlx()!=null && gxForm.getBhlx().contains("[")) {//问题类型支持多选，特殊处理一下里面的符号
						String bhlx=gxForm.getBhlx();
						bhlx=bhlx.replace("[", "");
						bhlx=bhlx.replace("]", "");
						bhlx=bhlx.replace("\"", "");
						gxForm.setBhlx(bhlx);
					}
					OpusLoginUser userInfo = (OpusLoginUser) object;
					BpmWorkFlowConfig bpmConfig = getBpmWrokConfig();
					BpmProcessContext processContext = bpmService.workFlowBusSave(gxForm, bpmConfig,userInfo);
					if(processContext.isSuccess()){
						List<BscAttForm> listAtt =  getMapParts(request,gxForm.getId().toString(),"","DRI_GX_PROBLEM_REPORT",mapFile);
						for(BscAttForm basAtt :listAtt){
							basAtt.setRecordId(processContext.getTaskId());
							basAtt.setOrgId(userForm.getCurrentOrgId());
							this.bscAtService.saveAtt(basAtt,loginName);
						}
						List<BpmDestTaskConfig> listTaskConfig =this.bpmTaskService.getBpmDestTaskConfigByCurrTaskId(processContext.getTaskId());
						//保存成功后
						//发送到下一步
						BpmTaskSendObject sendConfig = new BpmTaskSendObject();
						sendConfig.setTaskId(processContext.getTaskId());
						List<BpmTaskSendConfig> listSendConfig = new ArrayList<>();
						BpmTaskSendConfig sendConfigs =new BpmTaskSendConfig();
						sendConfigs.setUserTask(true);
						sendConfigs.setEnableMultiTask(false);
						sendConfigs.setAssignees(assignee);
						sendConfigs.setDestActId(listTaskConfig.get(0).getDestActId());
						listSendConfig.add(sendConfigs);
						sendConfig.setSendConfigs(listSendConfig);
						this.bpmTaskService.completeTask(sendConfig);
						jsonObject.put("success", true);
						jsonObject.put("message", "发送成功!");
						return jsonObject.toString();
					}
				}
            }else{
				jsonObject.put("success", false);
				jsonObject.put("message", "参数解析错误!");
			}
		} catch (Exception e) {
			e.printStackTrace();
			jsonObject.put("success", false);
			jsonObject.put("message", e.getMessage());
		}
		return jsonObject.toString();
	}

	@RequestMapping(value = "/updateWtsb",produces="application/json;charset=UTF-8")
	public String updateWtsb(HttpServletRequest request) throws Exception{
		OpusLoginUser userForm = (OpusLoginUser) request.getAttribute("opusLoginUser");;
		JSONObject jsonObject = new JSONObject();
		String loginName = request.getParameter("loginName");
		String reportId = request.getParameter("reportId");
		String json = request.getParameter("json");
		String deleteImgs = request.getParameter("deleteImgs");
		String isSendMessage = request.getParameter("isSendMessage");//是否发送短信
		String assignee = request.getParameter("instance.assignee");
		String assigneeName = request.getParameter("instance.assigneeName");
		if(!Common.isCheckNull(loginName) && !Common.isCheckNull(json) && !Common.isCheckNull(reportId)) {
			try {
				Map<String,MultipartFile> mapFile = null;
				boolean isMultiparPhotos = ServletFileUpload
						.isMultipartContent(request);
				if (isMultiparPhotos) {
					MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
					mapFile = multiRequest.getFileMap();
				}
				JSONObject json2 = JSONObject.fromObject(json);
				GxProblemReport gxProblemReportForm = gxProblemReportService.get(reportId);
				if(gxProblemReportForm==null){
					jsonObject.put("success",false);
					jsonObject.put("message","获取失败!");
					return jsonObject.toString();
				}
				OpuOmUserInfo userInfo = omUserInfoRestService.getOpuOmUserInfoByLoginName(loginName);
				Map<String, String> map = gxProblemReportService.searchGzlData(reportId);
				if(map!=null && gxProblemReportForm!=null){
					//判断是否有修改权限
					boolean isSbr=gxProblemReportForm.getLoginname()==null?userInfo.getLoginName().equals(gxProblemReportForm.getLoginname()):loginName.equals(gxProblemReportForm.getLoginname());
					if(isSbr && "problemReport".equals(map.get("activity"))){
						//保存修改信息
						GxProblemReportForm gxForm = saveByUpdate(json,reportId);
						//删除附件
						if(StringUtils.isNotBlank(deleteImgs)){
							String[] imageId=deleteImgs.split(",");
							for(int i=0;i<imageId.length;i++){
								String imId=imageId[i];
								if(StringUtils.isNotBlank(imId)){
									this.bscAtService.deleteAttDetailCascadeByDetailId(imId);
								}
							}
						}
						//判断是否自行处理
						String isBySelf = json2.containsKey("isbyself")?json2.getString("isbyself"):null;
						if (isBySelf!=null && "true".equals(isBySelf)) {//自行处理
							//结束流程
							//runtimeService.deleteProcessInstance(map.get("procInstId"),"自行处理!");
							//processInstanceManagementService.endProcessInstance();
							//保存自行处理详情与照片
							GxSggcForm form = new GxSggcForm();
							form.setUsername(userInfo.getUserName());
							form.setLoginname(loginName);
							form.setSjid(reportId);
							form.setLx("2");
							form.setTime(new Date());
							form.setContent(json2.getString("self_process_detail"));
							gxSggcService.saveData(form);
							//上传附件开始
							List<BscAttForm> listAtt =  getMapParts(request,reportId,form.getId().toString(),"DRI_GX_PROBLEM_REPORT",mapFile);
							if(listAtt!=null){
								for(BscAttForm basAtt :listAtt){
									basAtt.setOrgId(userForm.getCurrentOrgId());
									basAtt.setRecordId("0");//自行处理的附件
									this.bscAtService.saveAtt(basAtt,loginName);
								}
							}
						}else{
							//上传附件,获取开始环节的任务id保存图片（只有问题上报环节才有图片）
							Map<String, String> mapTask =  gxProblemReportService.getTaskByReportId(reportId);
							if(mapTask.get("taskId")!=null) {
								List<BscAttForm> listAtt = getMapParts(request, gxForm.getId().toString(), "", "DRI_GX_PROBLEM_REPORT", mapFile);
								for (BscAttForm basAtt : listAtt) {
									basAtt.setRecordId(String.valueOf(mapTask.get("taskId")));
									basAtt.setOrgId(userForm.getCurrentOrgId());
									this.bscAtService.saveAtt(basAtt, loginName);
								}
							}

							//判断是否有下一环节处理人,有就发送到下一环节
							if(StringUtils.isNotBlank(assignee) && StringUtils.isNotBlank(assigneeName)){
								//获取下一个环节的用户信息
								OpuOmUserInfo user = omUserInfoRestService.getOpuOmUserInfoByLoginName(assignee);
								if(user==null){
									jsonObject.put("success",false);
									jsonObject.put("message","经办人信息获取失败!");
									return jsonObject.toString();
								}
								String taskId= String.valueOf(map.get("taskId"));
								Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
								if(task==null){
									jsonObject.put("message","任务获取失败!");
									jsonObject.put("success",true);
									return  jsonObject.toString();
								}
								gxProblemReportService.updateTask(task,map,user);
								jsonObject.put("message","修改成功!");
								jsonObject.put("success",true);
								return  jsonObject.toString();
							}
						}
						jsonObject.put("message","修改成功!");
						jsonObject.put("success",true);
					}else{
						jsonObject.put("message","不在问题上报环节,您没有权限修改!");
						jsonObject.put("success",false);
					}
				}else{
					jsonObject.put("message","参数错误!");
					jsonObject.put("success",false);
				}
			} catch (Exception e) {
				e.printStackTrace();
				jsonObject.put("message","修改失败!");
				jsonObject.put("success",false);
			}
		}else{
			jsonObject.put("message","缺少参数!");
			jsonObject.put("success",false);
		}
		return jsonObject.toString();
	}
	/**
	 * 问题上报修改保存
	 * @param json
	 * @return
	 */
	public GxProblemReportForm saveByUpdate(String json, String id) throws Exception {
		if(!Common.isCheckNull(json))  {
			JSONObject o = JSONObject.fromObject(json);
			GxProblemReportForm gxForm = GxProblemReportConvertor.convertVoToForm(gxProblemReportService.get(id));
			GxProblemReport gxProblemReport= new GxProblemReport();
			GxProblemReportConvertor.convertFormToVo(gxForm, gxProblemReport);
			gxProblemReport.setFjzd(o.getString("photos"));
			gxProblemReport.setSzwz(o.getString("SZWZ"));
			gxProblemReport.setX(o.getString("X"));
			gxProblemReport.setY(o.getString("Y"));
			//gxProblemReport.setCode(o.getString("CODE"));
			gxProblemReport.setJdmc(o.getString("JDMC"));
			gxProblemReport.setBhlx(o.getString("BHLX"));
			gxProblemReport.setSslx(o.getString("SSLX"));
			gxProblemReport.setJjcd(o.getString("JJCD"));
			gxProblemReport.setWtms(o.getString("WTMS"));
			//gxProblemReport.setSbr(o.getString("SBR"));
			//gxProblemReport.setYjgcl(o.getString("YJGCL"));
			gxProblemReport.setBz(o.getString("BZ"));
			if(!o.getString("layer_id").equals("null")){
				gxProblemReport.setLayerId(o.getLong("layer_id"));
			}else{
				gxProblemReport.setLayerId(null);
			}
			gxProblemReport.setLayerName(o.getString("layer_name"));
			gxProblemReport.setObjectId(o.getString("object_id"));
			gxProblemReport.setUsid(o.getString("usid"));
			gxProblemReport.setLayerurl(o.getString("layerurl"));
			gxProblemReport.setReportx(o.getString("reportx"));
			gxProblemReport.setReporty(o.getString("reporty"));
			gxProblemReport.setReportaddr(o.getString("reportaddr"));
			if(!o.getString("yjwcsj").equals("null") && StringUtils.isNotBlank(o.getString("yjwcsj"))){
				Object object = o.get("yjwcsj");
				if(object instanceof Long){
					gxProblemReport.setYjwcsj(new Date(o.getLong("yjwcsj")));
				}else{
					gxProblemReport.setYjwcsj((Date) object);
				}
			}
			gxProblemReport.setSfjb(o.getString("sfjb")!=null&&!"null".equals(o.getString("sfjb"))?Integer.valueOf(o.getString("sfjb")):null);
			gxProblemReportService.save(gxProblemReport);
			return gxForm;
		}
		return null;
	}

	/*************************************/

	/**
	 * 获取各区R0、排水中心Rm组织
	 * */
	@RequestMapping(value="/getAllOrg",produces="application/json;charset=UTF-8")
	public String getAllOrg(HttpServletRequest request) throws Exception {
		List<BzFrom> bzList = new ArrayList<BzFrom>();
		/**排水中心*/
		BzFrom managerBzFrom = new BzFrom();
		managerBzFrom.setCode("O_GZPS_CENTER");
		managerBzFrom.setName("排水中心");
		managerBzFrom.setIcon("./icon/org.png");
		bzList.add(managerBzFrom);
		/**区水务局*/
		Map<String, String> map =new LinkedHashMap<String, String>();
		map.put("O_THSW", "天河区");
		map.put("O_PYSW", "番禺区");
		map.put("O_HPSW", "黄埔区");
		map.put("O_BYSW", "白云区");
		map.put("O_NSSW", "南沙区");
		map.put("O_HZSW", "海珠区");
		map.put("O_LWSW", "荔湾区");
		map.put("O_HDSW", "花都区");
		map.put("O_YXSW", "越秀区");
		map.put("O_ZCSW", "增城区");
		map.put("O_CHSW", "从化区");
		map.put("O_GZJS", "净水公司");
		for (String key : map.keySet()) {
			BzFrom bzFrom =new BzFrom();
			bzFrom.setCode(key);
			bzFrom.setName(map.get(key));
			bzFrom.setIcon("./icon/org.png");
			bzList.add(bzFrom);
		}
		return JSON.toJSONString(bzList);
	}


	/**
	 * 根据组织编码获取各区R0、排水中心Rm（）
	 * */
	@RequestMapping(value="/getUsersByorgCode",produces="application/json;charset=UTF-8")
	public String getUsersByorgCode(HttpServletRequest request) throws Exception {
		String loginName = request.getParameter("loginName");
		String orgCode = request.getParameter("orgCode");
		String orgName = request.getParameter("orgName");
		BzFrom bzFrom = new BzFrom();
		/**排水中心*/
		OpuOmOrg org =  psOrgUserService.getOrgByOrgCode(orgCode);
		 //排水中心
		if("O_GZPS_CENTER".equals(orgCode)){
			OpuRsRole opuRsRole = omOrgRestService.getRoleByRoleCode("ps_manager");
			//List<OpuOmUser> managerList = omOrgRestService.listOpuOmUserByRoleId(opuRsRole.getRoleId());
			//Todo toAdd getByOrgCode
			//managerList = managerList.stream().filter(user -> user.getOrgId().equals("1065-83ee-11e8-8936-231725e33d07")).collect(Collectors.toList());
//			List<OpuOmUser> managerList = omUserService.getUserByroleCode("O_GZPS_CENTER","ps_manager");
			List<OpuOmUserInfo> listUser =  psOrgUserService.listWorkGroupByOrgId(RM,org.getOrgId());
			List<Map<String, String>> managerMapList = getBzUser(listUser,loginName);
			bzFrom.setCode(orgCode);
			bzFrom.setName(orgName);
			bzFrom.setUserFormList(managerMapList);
		}else if(StringUtils.isNotBlank(orgCode)){
			bzFrom.setCode(orgCode);
			bzFrom.setName(orgName);
			// 获取R0成员
//			List<OpuOmUser> yzList = omUserService.getAllChildByroleCode(orgCode,"ps_yz_chief");
			List<OpuOmUserInfo> listUser =  psOrgUserService.listWorkGroupByOrgId(R0,org.getOrgId());
			//Todo toAdd change
			//OpuRsRole opuRsRole =omOrgRestService.getRoleByRoleCode("ps_yz_chief");
			//List<OpuOmUser> yzList = omOrgRestService.listOpuOmUserByRoleId(opuRsRole.getRoleId());

			List<Map<String, String>> yzMapList = getBzUser(listUser,loginName);
			bzFrom.setUserFormList(yzMapList);
		}
//		bzList.add(bzFrom);
		com.alibaba.fastjson.JSONObject jsonArray = com.alibaba.fastjson.JSONObject.parseObject(JSON.toJSONString(bzFrom));
		return jsonArray.toString();
	}

	/**
	 * 待办数据
	 * */
	@RequestMapping(value = "/getDZbSummary",produces = "application/json;charset=UTF-8")
	public String getDZbSummary(String pageNo,String pageSize,HttpServletRequest request) throws Exception{
		JSONObject json = new JSONObject();
		OpusLoginUser opusLoginUser = (OpusLoginUser)request.getAttribute("opusLoginUser");
		int pageNoInt=1;
		int pageSizeInt=10;
		if(pageNo!=null&&!"".equals(pageNo)){
			pageNoInt = Integer.parseInt(pageNo);
		}
		if(pageSize!=null&&!"".equals(pageSize)){
			pageSizeInt = Integer.parseInt(pageSize);
		}
		Page page = gxProblemReportService.getDZbSummaryList(opusLoginUser.getUser().getLoginName(),pageNoInt,pageSizeInt);
		List<GxEventList> listEvent =  GxProblemReportConvertor.convertVoToEventForm(page.getResult());
		if(listEvent!=null){
			for(GxEventList event : listEvent){
				//等到一步的任务id
				String startTaskId = gxProblemReportService.getStartTaskId(event.getTaskInstDbid());
				List<BscAttForm> lisAtt = null;
				if(StringUtils.isNotBlank(startTaskId) && !"null".equals(startTaskId)) {
					lisAtt = getImages(event.getMasterEntityKey(), startTaskId, request);
				}else{
					lisAtt = getImages(event.getMasterEntityKey(), event.getTaskInstDbid(), request);
				}
				Collections.sort(lisAtt,Comparator.comparing(BscAttForm::getCreateTime).reversed());
				List<DetailFilesForm> listDeta = convetBascToDetFile(lisAtt);
				if(listDeta!=null && listDeta.size()>0){
					event.setThumPath(listDeta.get(0).getThumbPath());
					event.setImgPath(listDeta.get(0).getPath());
				}
				event.setState("open");
			}
		}
		json.put("rows",listEvent);
		json.put("total",page.getTotalItems());
		return json.toString();
	}
	/**
	 * 已办数据
	 * */
	@RequestMapping(value = "/getYbSummary",produces = "application/json;charset=UTF-8")
	public String getYbSummary(String pageNo,String pageSize,HttpServletRequest request) throws Exception{
		OpusLoginUser loginUser =  SecurityContext.getOpusLoginUser();
		JSONObject json = new JSONObject();
		String loginName = request.getParameter("loginName");
		OpusLoginUser opusLoginUser = (OpusLoginUser)request.getAttribute("opusLoginUser");
		int pageNoInt=1;
		int pageSizeInt=10;
		if(pageNo!=null&&!"".equals(pageNo)){
			pageNoInt = Integer.parseInt(pageNo);
		}
		if(pageSize!=null&&!"".equals(pageSize)){
			pageSizeInt = Integer.parseInt(pageSize);
		}
		Page page =gxProblemReportService.getYbSummaryPage(opusLoginUser!=null?opusLoginUser.getUser().getLoginName()
				:loginName,pageNoInt,pageSizeInt);
		if(page.getResult()!=null && page.getResult().size()>0){
			for(int i =0;i<page.getResult().size();i++){
				Map<String,Object> mapPa = (Map<String, Object>) page.getResult().get(i);
				if(mapPa.get("RETURN_TIME_")!=null){
					String upTaskId = gxProblemReportService.getUpTaskId(String.valueOf(mapPa.get("CU_TASK_ID")));
					if(upTaskId!=null){
						//判断是否为撤回数据（撤回不显示）
						HistoricTaskInstance hiTask = historyService.createHistoricTaskInstanceQuery().taskId(upTaskId).singleResult();
						if(hiTask.getAssignee().equals(String.valueOf(mapPa.get("ASSIGNEE_")))){
							page.getResult().remove(i);
							page.setTotalItems(page.getTotalItems()-1);
						}
					}
				}
			}
		}
		List<GxEventList> listEvent =  GxProblemReportConvertor.convertVoToEventForm(page.getResult());
		if(listEvent!=null){
			for(GxEventList event : listEvent){
				String startTaskId = gxProblemReportService.getStartTaskId(event.getTaskInstDbid());
				List<BscAttForm> lisAtt = null;
				if(StringUtils.isNotBlank(startTaskId)) {
					lisAtt = getImages(event.getMasterEntityKey(), startTaskId, request);
				}else{
					lisAtt = getImages(event.getMasterEntityKey(), event.getTaskInstDbid(), request);
				}
				Collections.sort(lisAtt,Comparator.comparing(BscAttForm::getCreateTime).reversed());
				List<DetailFilesForm> listDeta = convetBascToDetFile(lisAtt);
				if(listDeta!=null && listDeta.size()>0){
					event.setThumPath(listDeta.get(0).getThumbPath());
					event.setImgPath(listDeta.get(0).getPath());
				}
				event.setState("open");
			}
		}
		json.put("rows",listEvent);
		json.put("total",page.getTotalItems());
		return json.toString();
	}
	/**
	 * 办结数据
	 * */
	@RequestMapping(value = "/getBjSummary",produces = "application/json;charset=UTF-8")
	public String getBjSummary(String pageNo,String pageSize,HttpServletRequest request) throws Exception{
		JSONObject json = new JSONObject();
		OpusLoginUser opusLoginUser = (OpusLoginUser)request.getAttribute("opusLoginUser");
		int pageNoInt=1;
		int pageSizeInt=10;
		if(pageNo!=null&&!"".equals(pageNo)){
			pageNoInt = Integer.parseInt(pageNo);
		}
		if(pageSize!=null&&!"".equals(pageSize)){
			pageSizeInt = Integer.parseInt(pageSize);
		}
		Page page = gxProblemReportService.getBjSummaryPage(opusLoginUser.getUser().getLoginName(),pageNoInt,pageSizeInt);
		List<GxEventList> listEvent =  GxProblemReportConvertor.convertVoToEventForm(page.getResult());
		if(listEvent!=null){
			for(GxEventList event : listEvent){
				String startTaskId = gxProblemReportService.getStartTaskId(event.getTaskInstDbid());
				List<BscAttForm> lisAtt = null;
				if(StringUtils.isNotBlank(startTaskId)) {
					lisAtt = getImages(event.getMasterEntityKey(), startTaskId, request);
				}else{
					lisAtt = getImages(event.getMasterEntityKey(), event.getTaskInstDbid(), request);
				}
				Collections.sort(lisAtt,Comparator.comparing(BscAttForm::getCreateTime).reversed());
				List<DetailFilesForm> listDeta = convetBascToDetFile(lisAtt);
				if(listDeta!=null && listDeta.size()>0){
					event.setThumPath(listDeta.get(0).getThumbPath());
					event.setImgPath(listDeta.get(0).getPath());
				}
				event.setState("completed");
			}
		}
		json.put("rows",listEvent);
		json.put("total",page.getTotalItems());
		return json.toString();
	}
	/**
	 * 删除
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/deleteProcessInstance")
	@ResponseBody
	public Result deleteProcessInstance( HttpServletRequest request) throws Exception {
		OpusLoginUser opusLoginUser = (OpusLoginUser)request.getAttribute("opusLoginUser");
		JSONObject jsonObject = new JSONObject();
		String loginName = request.getParameter("loginName");
		String deleteReason = request.getParameter("deleteReason");
		String procInstId = request.getParameter("instance.procInstId");
		String taskInstDbid = request.getParameter("instance.taskInstDbid");
		String sjid = request.getParameter("sjid");
		if(opusLoginUser==null && !opusLoginUser.getUser().getLoginName().equals(loginName)
				|| StringUtils.isBlank(procInstId) || StringUtils.isBlank(taskInstDbid)
				|| StringUtils.isBlank(sjid)){
			return new Result(false,"该任务不能删除!参数错误!");
		}
		try{
			//判断是否可以删除
			Task task  = taskService.createTaskQuery().processInstanceId(procInstId).singleResult();
			if(task ==null || !task.getTaskDefinitionKey().equals("problemReport")){
				return new Result(false,"该任务不能删除!流程已结束或不在问题上报环节!");
			}
			//删除上报信息
			GxProblemReport gxFrom = gxProblemReportService.get(sjid);
			if(gxFrom != null){
				bpmProcessService.deleteProcessInstance(procInstId,deleteReason);
				gxProblemReportService.delete(sjid);
				return new Result(true,"删除成功!");
			}else{
				return new Result(false,"你的问题上报不存在!");
			}
		} catch (Exception e) {
			e.printStackTrace();
			return new Result(false,e.getMessage());
		}
	}

	/**
	 * 回退
	 * */
	@RequestMapping(value = "/returnPrevTask",produces = "application/json;charset=UTF-8")
	public String returnPrevTask(HttpServletRequest request) {
		OpusLoginUser opusLoginUser = (OpusLoginUser)request.getAttribute("opusLoginUser");
		JSONObject json = new JSONObject();
		String taskId = request.getParameter("taskInstDbid");
		String loginName = request.getParameter("loginName");
		String backComments = request.getParameter("backComments");
		String isReturn = request.getParameter("isReturn");
		//短信发送需要的参数
		String isSendMessage=request.getParameter("isSendMessage");//是否发送短信
		String masterEntityKey=request.getParameter("masterEntityKey");//实体主键

		if(!Common.isCheckNull(taskId) && !Common.isCheckNull(loginName)) {

			try {
				Task taks = this.taskService.createTaskQuery().taskId(taskId).singleResult();
				if(taks==null){
					json.put("success",false);
					json.put("message","任务不存在!");
					return json.toString();
				}
				if("true".equals(isReturn)){
					//回退
					com.augurit.agcloud.framework.ui.result.ResultForm e =gxProblemReportService.returnPrevTask(taks,backComments);
					//回填回退信息
					if(e.isSuccess()){
						//撤回成功（添加任务注释）
						json.put("success",true);
						json.put("message","回退成功!");
					}
					else {
						json.put("success",false);
						json.put("message","该任务不能回退!");
					}
				}else{
					//撤回
					//获取上一环节（回退到那个环节）设置撤回处理人
					taks.setAssignee(opusLoginUser.getUser().getLoginName());
					taks.setAssigneeName(opusLoginUser.getUser().getUserName());
					com.augurit.agcloud.framework.ui.result.ResultForm e =gxProblemReportService.returnPrevTask(taks,backComments);
					//回填撤回信息
					if(e.isSuccess()){
						//撤回成功（添加任务注释）
						json.put("success",true);
						json.put("message","撤回成功!");
					}
					else {
						json.put("success",false);
						json.put("message","该任务不能撤回!");
					}
				}


			} catch (Exception var8) {
				var8.printStackTrace();
				json.put("success",false);
				json.put("message","任务处理失败!");
			}
			return json.toString();
		} else {
			json.put("success",false);
			json.put("message","参数异常!");
			return json.toString();
		}
	}
	/**
	 * 领取任务
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/takeTasks",produces = "application/json;charset=UTF-8")
	public String takeTasks( HttpServletRequest request){
		String taskInstDbids = request.getParameter("taskInstDbids");
		String loginUserName = request.getParameter("loginUserName");
		Long[] ids =  new Long[taskInstDbids.split(",").length];;
		if(taskInstDbids!=null&&!"".equals(taskInstDbids)){
			for(int i=0;i<taskInstDbids.split(",").length;i++){
				ids[i]=Long.valueOf(taskInstDbids.split(",")[i]);
			}
		}

		String json = null;
		Map<String,Object> map=new HashMap<String,Object>();
		try{
			if(ids!=null&&loginUserName!=null&&!"".equals(loginUserName)){
				//this.workTaskService.takeTasks(ids,loginUserName);
				map.put("success", true);
				map.put("info", "执行成功！");
			}else{
				map.put("success", false);
				map.put("info", "缺少参数！");
			}
		}catch(Exception e){
			map.put("success", false);
			map.put("info", "执行失败！");
			e.printStackTrace();
		}
		json=JSONObject.fromObject(map).toString();
		return json;
	}
	public static byte[] readInputStream(InputStream inStream) throws Exception{
		ByteArrayOutputStream outStream = new ByteArrayOutputStream();
		//创建一个Buffer字符串
		byte[] buffer = new byte[1024];
		//每次读取的字符串长度，如果为-1，代表全部读取完毕
		int len = 0;
		//使用一个输入流从buffer里把数据读取出来
		while( (len=inStream.read(buffer)) != -1 ){
			//用输出流往buffer里写入数据，中间参数代表从哪个位置开始读，len代表读取的长度
			outStream.write(buffer, 0, len);
		}
		//关闭输入流
		inStream.close();
		//把outStream里的数据写入内存
		return outStream.toByteArray();
	}

	/**
	 * 拼装数据
	 * @param userList
	 * @return
	 */
	private List<Map<String, String>> getBzUser(List<OpuOmUserInfo> userList , String loginName) {
		List<Map<String, String>> userFormList = new ArrayList<Map<String, String>>();
		if (userList != null) {
			for (OpuOmUser orgUserForm : userList) {
				Map<String, String> userMap = new HashMap<String, String>();
				//排除自己
				if(loginName == null || !loginName.equals(orgUserForm.getLoginName())){
					//userMap.put("userId", "USER#" + orgUserForm.getUserId());
					userMap.put("code", orgUserForm.getLoginName());
					userMap.put("name", orgUserForm.getUserName());
					userMap.put("icon", "./icon/user_blue.png");
					userFormList.add(userMap);
				}
			}
		}
		return userFormList;
	}
	/**
	 * 判断RgRm是否存在
	 * @param roleList
	 * @return
	 */
	private boolean checkExist(List<OpuAcRoleUser> roleList){
		OpuRsRole rgForm = omOrgRestService.getRoleByRoleCode("ps_gc");
		OpuRsRole rmForm = omOrgRestService.getRoleByRoleCode("ps_manager");
		for(int i=0;i<roleList.size();i++){
			//判断Rg角色
			if(rgForm != null && roleList.get(i).getRoleId().equals(rgForm.getRoleId())){
				return true;
			}
			//判断Rm角色
			if(rmForm != null && roleList.get(i).getRoleId().equals(rmForm.getRoleId())){
				return true;
			}
		}
		return false;
	}

	/**
	 * 自行处理，不走流程
	 * */
	public GxProblemReportForm saveBySelf(String json,String loginName){
		if(!Common.isCheckNull(loginName) && !Common.isCheckNull(json))  {
			JSONObject o = JSONObject.fromObject(json);
			GxProblemReportForm gxForm = new GxProblemReportForm();
			gxForm.setFjzd(o.containsKey("photos")?o.getString("photos"):null);
			gxForm.setSzwz(o.getString("SZWZ"));
			gxForm.setX(o.getString("X"));
			gxForm.setY(o.getString("Y"));
			//gxForm.setCode(o.getString("CODE"));
			gxForm.setJdmc(o.getString("JDMC"));
			gxForm.setBhlx(o.getString("BHLX"));
			gxForm.setSslx(o.getString("SSLX"));
			gxForm.setJjcd(o.getString("JJCD"));
			gxForm.setWtms(o.getString("WTMS"));
			gxForm.setSbr(o.getString("SBR"));
			gxForm.setLoginname(loginName);
			//gxForm.setYjgcl(o.getString("YJGCL"));
			gxForm.setBz(o.getString("BZ"));
			if(o.get("layer_id")!=null && !o.getString("layer_id").equals("null"))
				gxForm.setLayerId(o.getLong("layer_id"));
			gxForm.setLayerName(o.getString("layer_name"));
			gxForm.setObjectId(o.getString("object_id"));
			gxForm.setUsid(o.getString("usid"));
			gxForm.setLayerurl(o.getString("layerurl"));
			gxForm.setReportx(o.containsKey("reportx")?o.getString("reportx"):null);
			gxForm.setReporty(o.containsKey("reporty")?o.getString("reporty"):null);
			gxForm.setReportaddr(o.containsKey("reportaddr")?o.getString("reportaddr"):null);
			gxForm.setIsbyself(o.getString("isbyself"));
			if(o.containsKey("yjwcsj") && !o.getString("yjwcsj").equals("null") && StringUtils.isNotBlank(o.getString("yjwcsj"))){
				Object object = o.get("yjwcsj");
				if(object instanceof Long){
					gxForm.setYjwcsj(new Date(o.getLong("yjwcsj")));
				}else{
					SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
					try {
						gxForm.setYjwcsj(df.parse(object.toString()));
					} catch (ParseException e) {
						gxForm.setYjwcsj((Date) object);
						e.printStackTrace();
					}
				}
			}
			if(!o.getString("sfjb").equals("null"))
				gxForm.setSfjb(o.getString("sfjb"));
			gxForm.setSbsj(new Date());
			Map<String,String> cmMap=correctMarkService.getFrom(loginName);
			if(cmMap!=null && cmMap.size()>0){
				gxForm.setTeamOrgId(cmMap.get("teamOrgId"));
				gxForm.setTeamOrgName(cmMap.get("teamOrgName"));
				gxForm.setDirectOrgId(cmMap.get("directOrgId"));
				gxForm.setDirectOrgName(cmMap.get("directOrgName"));
				gxForm.setSuperviseOrgId(cmMap.get("superviseOrgId"));
				gxForm.setSuperviseOrgName(cmMap.get("superviseOrgName"));
				gxForm.setParentOrgId(cmMap.get("parentOrgId"));
				gxForm.setParentOrgName(cmMap.get("parentOrgName"));
				if (cmMap.get("bhlx") != null && cmMap.get("bhlx").contains("[")) {//问题类型支持多选，特殊处理一下里面的符号
					String bhlx=gxForm.getBhlx();
					bhlx=bhlx.replace("[", "");
					bhlx=bhlx.replace("]", "");
					bhlx=bhlx.replace("\"", "");
					gxForm.setBhlx(bhlx);
				}
			}
			/*if("1".equals(gxForm.getSfjb()))//gxEntity.set
				gxProblemReportService.updateSdeState(gxForm.getObjectId(), "2");*/
			return gxForm;
		}
		return null;
	}

	/**
	 * 保存节点附件
	 * @return
	 */
	@RequestMapping(value="/saveJdFile",produces="application/json;charset=UTF-8")
	public String saveSysFile(HttpServletRequest request) throws Exception {
		OpusLoginUser opusLoginUser = (OpusLoginUser)request.getAttribute("opusLoginUser");
		JSONObject json = new JSONObject();
		String taskInstDbid = request.getParameter("taskInstDbid");
		String entityId = request.getParameter("masterEntityKey");
		Map<String,MultipartFile> mapFile = null;
		boolean isMultiparPhotos = ServletFileUpload
				.isMultipartContent(request);
		if (isMultiparPhotos) {
			MultipartHttpServletRequest multiRequest=(MultipartHttpServletRequest)request;
			mapFile= multiRequest.getFileMap();
		}else{
			json.put("success", false);
			json.put("message", "未检测到文件!");
			return json.toString();
		}
		if(StringUtils.isBlank(entityId) || StringUtils.isBlank(taskInstDbid)){
			return JSON.toJSONString(new Result(false,"参数错误!"));
		}
		//可能当前的taskId不是最新的，防止过时，到数据库拿最新的
		HistoricTaskInstance his = historyService.createHistoricTaskInstanceQuery().taskId(taskInstDbid).singleResult();
		List<HistoricTaskInstance> listHist =  historyService.createHistoricTaskInstanceQuery()
				.processInstanceId(his.getProcessInstanceId()).orderByHistoricTaskInstanceStartTime().desc().list();
		if(listHist!=null && listHist.size()>0){
			his = listHist.get(0);
		}
		/*Task curTask = taskService.createTaskQuery().processInstanceId(his.getProcessInstanceId()).singleResult();
		if(curTask==null){
			json.put("success",false);
			json.put("message","当前任务已结束!");
			return json.toString();
		}*/
		taskInstDbid = his.getId();
		boolean falg = true;
		try {
			List<BscAttForm> listAtt =  getMapParts(request, entityId,null,"",mapFile);
			for(BscAttForm sac :listAtt){
				sac.setRecordId(taskInstDbid);
				sac.setOrgId(opusLoginUser.getCurrentOrgId());
                this.bscAtService.saveAtt(sac,opusLoginUser.getUser().getLoginName());
            }
		} catch (Exception e) {
			e.printStackTrace();
			falg=false;
		}
		json.put("success",falg);
		return json.toString();
	}
	/**
	 * 评论上传
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/sggcContentSave")
	public Result sggcContentSave(HttpServletRequest request) throws Exception{
		JSONObject jsonObject = new JSONObject();
		String loginName = request.getParameter("loginName");
		String userName = request.getParameter("userName");
		String content = request.getParameter("content");
		String sjid = request.getParameter("sjid");
		if(!Common.isCheckNull(userName) && !Common.isCheckNull(sjid) && !Common.isCheckNull(loginName)){
			try{
				GxSggcForm form = new GxSggcForm();
				form.setUsername(userName);
				form.setLoginname(loginName);
				form.setSjid(sjid);
				form.setLx("1");
				form.setTime(new Date());
				form.setContent(content);
				gxSggcService.saveData(form);
				return new Result(true,"评论成功!");
			}catch(Exception e){
				return new Result(false,"评论失败!"+e.getMessage());
			}
		}else{
			return new Result(false,"评论失败!参数有误!");
		}
	}
	/**
	 * 获取问题上报列表
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/getProblemReport",produces="application/json;charset=UTF-8")
	public String getProblemReport(HttpServletRequest request){
		JSONObject jsonObject = new JSONObject();
		OpusLoginUser opusLoginUser = (OpusLoginUser)request.getAttribute("opusLoginUser");
		String loginName = StringUtils.isBlank(request.getParameter("loginName"))?
				opusLoginUser.getUser().getLoginName():request.getParameter("loginName");
		String pageNo = request.getParameter("pageNo");
		String pageSize = request.getParameter("pageSize");
		String keyWord = request.getParameter("keyWord");
		String xzqh = request.getParameter("xzqh");
		String sslx = request.getParameter("sslx");
		String wtlx = request.getParameter("wtlx");
		String state = request.getParameter("state");
		String startTime = request.getParameter("startTime");
		String endTime = request.getParameter("endTime");
		Map<String, String> map =new HashMap<String, String>();
		if("全市".equals(xzqh)){
			xzqh=null;
		}
		if("0".equals(state)){
			map.put("state", "active");
		}else if("1".equals(state)){
			map.put("state", "ended");
		}else{
			map.put("state", null);
		}
		map.put("loginName", loginName);
		map.put("keyWord", keyWord);
		map.put("xzqh", xzqh);
		map.put("sslx", sslx);
		map.put("wtlx", wtlx);
		map.put("startTime", startTime);
		map.put("endTime", endTime);
		map.put("activeNum", "0");
		map.put("endedNum", "0");
		try {if(!Common.isCheckNull(loginName)) {
				Page<GxProblemReportForm> page = new Page();
				if(!Common.isCheckNull(pageNo) && !Common.isCheckNull(pageSize)){
					page.setPageNo(Integer.valueOf(pageNo));
					page.setPageSize(Integer.valueOf(pageSize));
				}
				String urlAll=request.getRequestURL().toString() ;
				//gxProblemReportService.s
				page=gxProblemReportService.searchForApp(page, map,urlAll);
				List<GxProblemReportForm> listResult = page.getResult();
				if(listResult!=null){
					for(GxProblemReportForm form :listResult){
						form.setSbsj2(form.getSbsj()!=null?form.getSbsj().getTime():0);
						List<BscAttForm> listAt =  getImages(form.getId(),null,request);
						List<DetailFilesForm> listDeta = new ArrayList<>();
						//默认升序
						Collections.sort(listAt,Comparator.comparing(BscAttForm::getCreateTime).reversed());
						if(listAt!=null){
							for (BscAttForm s:listAt) {
								DetailFilesForm filesForm=new DetailFilesForm();
								filesForm.setName(s.getAttName());
								filesForm.setMime(s.getAttFormat());
								filesForm.setPath(s.getAttPath());
								String[] urlParh = s.getAttPath().split(psxjProperties.getRequest_file_path());
								filesForm.setThumbPath(urlParh[0]+psxjProperties.getRequest_file_path()
										+psxjProperties.getFileSmallPath()+urlParh[1]);
								//这里要传Http路径
								filesForm.setTime(s.getCreateTime()==null?0:s.getCreateTime().getTime());
								listDeta.add(filesForm);
								break;
							}
						}
						form.setFiles2(listDeta);
					}
				}
				String zb = map.get("activeNum");
				String yb = map.get("endedNum");
				JSONObject data = new JSONObject();
				//data.put("handling", zb);
				//data.put("finished", yb);
				data.put("list", page.getResult());
				data.put("handling",map.get("activeNum"));
				data.put("finished", map.get("endedNum"));
				jsonObject.put("code", 200);
				jsonObject.put("data", data);
				jsonObject.put("message", "");
			} else {
				jsonObject.put("code", 404);
				//jsonObject.put("data", null);
				jsonObject.put("message", "参数缺失");
			}
		} catch (Exception e) {
			jsonObject.put("code", 500);
			//jsonObject.put("data", null);
			jsonObject.put("message", e.getMessage());
			e.printStackTrace();
		}
		return jsonObject.toString();
	}
	/**
	 *我的提交
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/getListsMyCommit")
	public Result getListsMyCommit(HttpServletRequest request){
		JSONObject jsonObject = new JSONObject();
		OpusLoginUser opusLoginUser = (OpusLoginUser)request.getAttribute("opusLoginUser");
		String loginName = StringUtils.isBlank(request.getParameter("loginName"))?
				opusLoginUser.getUser().getLoginName():request.getParameter("loginName");
		String pageNo = request.getParameter("pageNo");
		String pageSize = request.getParameter("pageSize");
		String state = request.getParameter("state");
		String startTime = request.getParameter("startTime");
		String endTime = request.getParameter("endTime");
		Map<String, String> map =new HashMap<String, String>();
		map.put("loginName",loginName);
		map.put("state", state);
		map.put("startTime", startTime);
		map.put("endTime", endTime);
		map.put("activeNum", "0");
		map.put("endedNum", "0");
		try {if(!Common.isCheckNull(loginName)) {
			Page<Map<String,Object>> page = new Page();
			if(!Common.isCheckNull(pageNo) && !Common.isCheckNull(pageSize)){
				page.setPageNo(Integer.valueOf(pageNo));
				page.setPageSize(Integer.valueOf(pageSize));
			}
			String urlAll=request.getRequestURL().toString() ;
			page=gxProblemReportService.getListsMyCommit(loginName, page.getPageNo(),page.getPageSize());
			List<GxEventList> listEvent =  GxProblemReportConvertor.convertVoToEventForm(page.getResult());
			if(listEvent!=null){
				for(GxEventList event : listEvent){
					if(event.getTaskInstDbid()!=null){
						String startTaskId = gxProblemReportService.getStartTaskId(event.getTaskInstDbid());
						if(StringUtils.isNotBlank(startTaskId)){
							event.setUpTtaskInstDbid(startTaskId);
						}
						List<BscAttForm> lisAtt = getImages(event.getMasterEntityKey(),startTaskId,request);
						Collections.sort(lisAtt,Comparator.comparing(BscAttForm::getCreateTime).reversed());
						List<DetailFilesForm> listDeta = convetBascToDetFile(lisAtt);
						if(listDeta!=null && listDeta.size()>0){
							event.setThumPath(listDeta.get(0).getThumbPath());
							event.setImgPath(listDeta.get(0).getPath());
						}
					}else{//自行处理的图片
						List<BscAttForm> lisAtt = getImages(event.getMasterEntityKey(),"0",request);
						Collections.sort(lisAtt,Comparator.comparing(BscAttForm::getCreateTime).reversed());
						List<DetailFilesForm> listDeta = convetBascToDetFile(lisAtt);
						if(listDeta!=null && listDeta.size()>0){
							event.setThumPath(listDeta.get(0).getThumbPath());
							event.setImgPath(listDeta.get(0).getPath());
						}
					}

				}
			}
			//String zb = map.get("activeNum");
			//String yb = map.get("endedNum");
			/*Map mapJson = new HashMap();
			mapJson.put("rows",listEvent);
			mapJson.put("total",page.getTotalItems());*/
			return new Result(true,listEvent);
		} else {
			return new Result(false,"参数缺失!");
		}
		} catch (Exception e) {
			e.printStackTrace();
			return new Result(false,"异常错误!"+e.getMessage());
		}
	}
	/***
	 * 通过事件id获取事件详情
	 * */
	@RequestMapping(value="/getReportDetail",produces="application/json;charset=UTF-8")
	public String getReportDetail(HttpServletRequest request) throws Exception{
		OpusLoginUser opusLoginUser = (OpusLoginUser)request.getAttribute("opusLoginUser");
		JSONObject jsonObject = new JSONObject();
		String sjid = request.getParameter("masterEntityKey");//获取上报事件id
		String taskId = request.getParameter("taskInstId");//获取上报事件id
		String procInstDbId = request.getParameter("procInstDbId");//获取流程id
		String isRetrView = request.getParameter("isRetrView"); //是否显示撤回(true) 是否显示编辑(noEdit)
		if(!Common.isCheckNull(sjid)){
			try {
				//AES解
				String isNeedDecode = request.getParameter("isNeedDecode");
				if(isNeedDecode!=null && "1".equals(isNeedDecode)){
					sjid= SymmetricEncoder.AESDncode("augur2017", sjid);
				}
				GxProblemReport gxForm=gxProblemReportService.get(sjid);
				String startTask = null;
				if(!"null".equals(taskId) && taskId!=null && taskId!=""){
					startTask = gxProblemReportService.getStartTaskId(taskId);
				}else if(!"null".equals(procInstDbId) && procInstDbId!=null && procInstDbId!=""){
					List<HistoricTaskInstance> listHist =  historyService.createHistoricTaskInstanceQuery().processInstanceId(procInstDbId)
							.orderByHistoricTaskInstanceStartTime().asc().list();
					if(listHist!=null && listHist.size()>0){
						startTask = listHist.get(0).getId();
					}
				}
				GxProblemReportForm  gxProblemReportForm= GxProblemReportConvertor.convertVoToForm(gxForm);
				if(gxProblemReportForm!=null){
					gxProblemReportForm.setState(gxProblemReportService.getState(gxProblemReportForm.getId()));
					gxProblemReportForm.setSbsj2(gxProblemReportForm.getSbsj()==null?0:gxProblemReportForm.getSbsj().getTime());
					gxProblemReportForm.setSbr(gxProblemReportForm.getLoginname()==null?gxProblemReportForm.getSbr():gxSggcService.getAllName(gxProblemReportForm.getLoginname()));
					List<BscAttForm> listAtt =  getImages(gxForm.getId(),startTask,request);
					//查找附件信息
					if(listAtt!=null && listAtt.size()>0){
						gxProblemReportForm.setFiles2(this.convetBascToDetFile(listAtt));
					}
					//如果是事务公开那么直接返回
					if(StringUtils.isNotBlank(procInstDbId) && !"null".equals(procInstDbId)){
						Task currTask = this.taskService.createTaskQuery().processInstanceId(procInstDbId).singleResult();
						DetailDataForm dataForm = new DetailDataForm();
						DetailEventForm eventForm = GxProblemReportConvertor.formToDetail(gxProblemReportForm);
						dataForm.setIsEditAble("false");
						dataForm.setIsDeleteTask("false");
						dataForm.setIsRetrieve("false");
						dataForm.setEvent(eventForm);
						if(currTask==null){
							dataForm.setCurNode("end");
							dataForm.setCurNodeName( "结束");
							dataForm.setState("end");
						}else{
							eventForm.setTaskInstDbid(currTask.getId());
							dataForm.setTaskInstId(currTask.getId());
						}
						jsonObject.put("code", 200);
						jsonObject.put("data",dataForm);
						return jsonObject.toString();
					}else{
						//如果没有传taskId，就是自行处理的
						if(!StringUtils.isNotBlank(taskId)){
							DetailDataForm dataForm = new DetailDataForm();
							DetailEventForm eventForm = GxProblemReportConvertor.formToDetail(gxProblemReportForm);
							dataForm.setEvent(eventForm);
							jsonObject.put("code", 200);
							jsonObject.put("data",dataForm);
							return jsonObject.toString();
						}
						HistoricTaskInstance hisTasks = null;
						hisTasks =  this.historyService.createHistoricTaskInstanceQuery().taskId(taskId).singleResult();
						if(hisTasks==null){
							jsonObject.put("code", 400);
							jsonObject.put("success", false);
							jsonObject.put("message","任务不存在!");
							return jsonObject.toString();
						}
						DetailDataForm dataForm = new DetailDataForm();
						DetailEventForm eventForm = GxProblemReportConvertor.formToDetail(gxProblemReportForm);
						dataForm.setIsEditAble("false");
						dataForm.setIsDeleteTask("false");
						dataForm.setIsRetrieve("false");
						dataForm.setEvent(eventForm);
						/** 如果不是则下一步 */
						Task currTask = this.taskService.createTaskQuery().processInstanceId(hisTasks.getProcessInstanceId()).singleResult();
						if(currTask==null){
							dataForm.setCurNode("end");
							dataForm.setCurNodeName( "结束");
							dataForm.setState("end");
							jsonObject.put("code", 200);
							jsonObject.put("data",dataForm);
							return jsonObject.toString();
						}
						eventForm.setTaskInstDbid(currTask.getId());
						dataForm.setTaskInstId(currTask.getId());
						/***/
						/**获取是否在最新task*/
						Task task = this.taskService.createTaskQuery().taskId(taskId).singleResult();
						HistoricActivityInstance hiAc=null;
						if(currTask!=null && "problemReport".equals(currTask.getTaskDefinitionKey())){
							dataForm.setIsEditAble("true");
							dataForm.setIsDeleteTask("true");
						}
						if(task!=null){
							/*if("problemReport".equals(task.getTaskDefinitionKey())){
								dataForm.setIsEditAble("true");
							}*/
							//判断上一环节是否处在问题上报
							if("true".equals(isRetrView)){
								String upTaskId = gxProblemReportService.getUpTaskId(task.getId());
								if(upTaskId!=null && !"null".equals(upTaskId)){
									HistoricTaskInstance upTask =  historyService.createHistoricTaskInstanceQuery().taskId(upTaskId).singleResult();
									if(upTask!=null && "problemReport".equals(upTask.getTaskDefinitionKey())){
										dataForm.setIsRetrieve("true");
									}
								}
							}

							dataForm.setCurNode(task.getTaskDefinitionKey());
							dataForm.setCurNodeName(task.getName());
							dataForm.setCurOpLoginName(task.getAssigneeName());
							//拿到下一步节点信息
							List<BpmDestTaskConfig> sendEntity = this.bpmService.getBpmDestTaskConfigsByCurrTaskId(taskId);
							JSONArray jsonArr1 = new JSONArray();
							if(sendEntity!=null){
								dataForm.setState("active");
								for(BpmDestTaskConfig taskConfig :sendEntity){
									Map map = new HashMap();
									map.put("linkcode",taskConfig.getDestActId());
									map.put("linkname",taskConfig.getDestActName());
									jsonArr1.add(map);
								}
								dataForm.setNextlink(jsonArr1);
							}else{
								dataForm.setState("ended");
							}
						}else{
							dataForm.setCurNode(currTask.getTaskDefinitionKey());
							dataForm.setCurNodeName(currTask.getName());
							dataForm.setCurOpLoginName(currTask.getAssigneeName());
						}
						if("noEdit".equals(isRetrView)){
							dataForm.setIsEditAble("false");
						}
						jsonObject.put("code", 200);
						jsonObject.put("data",dataForm);
						jsonObject.put("message", "");
					}
				}else{
					jsonObject.put("code", 200);
					jsonObject.put("data", null);
					jsonObject.put("message", "");
				}
			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
				jsonObject.put("code", 500);
				jsonObject.put("data", null);
				jsonObject.put("message",e.getMessage());
			}
		}else{
			jsonObject.put("code", 404);
			jsonObject.put("message", "参数缺失");
		}
		return jsonObject.toString();
	}
	@RequestMapping(value="/getDbAndYbSummarySum",produces="application/json;charset=UTF-8")
	public String getDbAndYbSummarySum(HttpServletRequest request) {
		Map resultMap =new HashMap();
		Map sumMap =new HashMap();
		resultMap.put("code", 200);
		long dbcount =0;
		long ybcount =0;
		try {
			String viewId  = request.getParameter("viewId");
			String isView  = request.getParameter("isView");
			String loginName = request.getParameter("loginName");
			String groupBy = request.getParameter("groupBy");
			String groupDir = request.getParameter("groupDir");
			if(StringUtils.isBlank(groupBy)){
				groupBy="sbsj";
			}
			if(StringUtils.isBlank(groupDir)){
				groupDir="desc";
			}
			String json = request.getParameter("json");
			if(!Common.isCheckNull(loginName) ) {
				if(!"yb".equals(isView)){
					ybcount = gxProblemReportService.getYbCount(loginName,null);
				}
				if(!"db".equals(isView)){
					dbcount = gxProblemReportService.getDbCount(loginName,null);
				}

			}
			sumMap.put("db", dbcount);
			sumMap.put("yb", ybcount);
		} catch (Exception e) {
			resultMap.put("code", 500);
			resultMap.put("message", e.getMessage());
			JSONObject jsonArray = JSONObject.fromObject(resultMap);
			return jsonArray.toString();
		}
		resultMap.put("data", sumMap);
		JSONObject jsonArray = JSONObject.fromObject(resultMap);
		return jsonArray.toString();
	}
	/**
	 * 获取环节处理和施工日志与评论
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/getTraceRecordAndSggcLogList",produces="application/json;charset=UTF-8")
	public String getTraceRecordAndSggcLogList(HttpServletRequest request) {
		JSONObject jsonObject = new JSONObject();
		Map<String,DetailFilesForm> attMap = new HashMap();
		String sjid = request.getParameter("sjid");//获取上报事件id
		if(!Common.isCheckNull(sjid)){
			try {
				//AES解密
				String isNeedDecode = request.getParameter("isNeedDecode");
				if (isNeedDecode != null && "1".equals(isNeedDecode)) {
					sjid = SymmetricEncoder.AESDncode("augur2017", sjid);
				}
				GxSggcForm form =new GxSggcForm();
				form.setSjid(sjid);
				List<GxSggcForm> list = gxSggcService.search(form);
				//List<GxSggcForm> listSgg = gxSggcService.searcEntityBySjid(sjid);
				//if(listSgg!=null) list.addAll(listSgg);
				List<GxSggcLogForm> gxSggcLogFormList = new ArrayList<GxSggcLogForm>();
				GxSggcLogForm tempLogForm = null;
				if(list!=null && list.size()>0) {
					for (GxSggcForm gxSggcForm : list) {
						GxSggcLogForm gxSggcLogForm = new GxSggcLogForm();
						gxSggcLogForm.setContent(gxSggcForm.getContent());
						gxSggcLogForm.setId(gxSggcForm.getId());
						gxSggcLogForm.setLx(gxSggcForm.getLx());
						if("2".equals(gxSggcForm.getLx())){
							gxSggcLogForm.setLinkName("自行处理（已结束）");
						}
						gxSggcLogForm.setSgjd(gxSggcForm.getSgjd());
						gxSggcLogForm.setSjid(sjid);
						gxSggcLogForm.setOpUser(gxSggcForm.getLoginname()==null?gxSggcForm.getUsername():gxSggcService.getAllName(gxSggcForm.getLoginname()));
						gxSggcLogForm.setTime(gxSggcForm.getTime()==null?0:gxSggcForm.getTime().getTime());
						if(gxSggcLogForm.getSjid()!=null){
							//查找附件信息
							List<BscAttForm> listAtt =  getImages(gxSggcLogForm.getSjid(),gxSggcLogForm.getId().toString(),request);
							if(listAtt!=null && listAtt.size()>0){
								gxSggcLogForm.setAttFiles(convetBascToDetFile(listAtt));
							}
						}
						gxSggcLogFormList.add(gxSggcLogForm);
					}
				}
				/************获取施工日志与评论结束***************/
				/************获取环节处理信息开始***************/
				List<Map> hjxxArray = gxSggcService.searchJbpm4HistTaskByEntityId(sjid);
				List<GxSggcLogForm> listGxss = new ArrayList();
				if(hjxxArray!=null){
					List<BscAttForm> listAtt = getImages(sjid,null,request);
					Map<String,List<BscAttForm>> mapAtt = new HashMap();
					for(BscAttForm bscAtt:listAtt){
						if(mapAtt.containsKey(bscAtt.getRecordId())){
							List<BscAttForm> att =mapAtt.get(bscAtt.getRecordId());
							att.add(bscAtt);
							mapAtt.put(bscAtt.getRecordId(),att);
						}else{
							List<BscAttForm> att = new ArrayList<>();
							att.add(bscAtt);
							mapAtt.put(bscAtt.getRecordId(),att);
						}
					}
					for(Map j :hjxxArray){
						OpuOmUserInfo userInfo =  omUserInfoRestService.getOpuOmUserInfoByLoginName(j.get("opUserPhone").toString());
						String dbTaskId = j.get("taskId")!=null?j.get("taskId").toString():"";
						GxSggcLogForm gxSggcLogForm = new GxSggcLogForm();
						gxSggcLogForm.setLinkName(j.get("linkName")!=null?j.get("linkName").toString():"");
						if(userInfo!=null){
							j.put("opUser",userInfo.getUserName());
							j.put("opUserPhone",userInfo.getUserMobile());
						}
						gxSggcLogForm.setOpUser(j.get("opUser")!=null?j.get("opUser").toString():"");
						gxSggcLogForm.setOpUserPhone(j.get("opUserPhone")!=null? j.get("opUserPhone").toString():"");
						gxSggcLogForm.setContent(j.get("opinion")!=null? j.get("opinion").toString():"");
						gxSggcLogForm.setNextOpUser(j.get("nextOpUser")!=null?j.get("nextOpUser").toString():"");
						gxSggcLogForm.setNextOpUserPhone(j.get("nextOpUserPhone")!=null?j.get("nextOpUserPhone").toString():"");
						gxSggcLogForm.setReassignComments(j.get("reassignComments")!=null?j.get("reassignComments").toString():"");
						if(j.get("time") != ""){
							gxSggcLogForm.setTime(Long.parseLong(j.get("time").toString()));
						}else{
							gxSggcLogForm.setTime(0l);
						}
						if(mapAtt.containsKey(dbTaskId)){
							gxSggcLogForm.setAttFiles(convetBascToDetFile(mapAtt.get(dbTaskId)));
						}
						if(gxSggcLogForm.getAttFiles()==null)
							gxSggcLogForm.setAttFiles(new ArrayList<>());
						List<DetailFilesForm> listDeta = gxSggcLogForm.getAttFiles();
						if(attMap.get(dbTaskId)!=null)
							listDeta.add(attMap.get(dbTaskId));
						listGxss.add(gxSggcLogForm);
					}
				}
				gxSggcLogFormList.addAll(listGxss);
				Collections.sort(gxSggcLogFormList,new Comparator<GxSggcLogForm>(){
					public int compare(GxSggcLogForm arg0, GxSggcLogForm arg1) {
						return arg0.getTime().compareTo(arg1.getTime());
					}
				});
				jsonObject.put("code", 200);
				jsonObject.put("data", gxSggcLogFormList);
			}catch (Exception e){
				e.printStackTrace();
				jsonObject.put("code", 500);
				jsonObject.put("message", e.getMessage());
			}
		}else{
			jsonObject.put("code", 404);
			jsonObject.put("message", "参数缺失");
		}
		return jsonObject.toString();
	}

	/**
	 * 获取工作流附件图片
	 * */
	public List<BscAttForm> getImages(String masterEntityKey,String taskId,HttpServletRequest request) throws Exception {
		OpusLoginUser opusLoginUser = (OpusLoginUser) request.getAttribute("opusLoginUser");
		if (StringUtils.isBlank(masterEntityKey)) {
			return null;
		} else {
			String basePath = bscInitService.getConfigValueByConfigKey("uploadPath");
			String urlAll=request.getRequestURL().toString() ;
			String url="";//图片路径处理
			String[] mainurl=urlAll.split(psxjProperties.getServerName());
			if (mainurl!=null && mainurl.length>0) {
				url=mainurl[0]+psxjProperties.getServerName()+psxjProperties.getRequest_file_path();
			}
			List<BscAttForm> sysList=gxProblemReportService.getBscAttByTableNameAndPkNameAndRecordId("DRI_GX_PROBLEM_REPORT",masterEntityKey,taskId,opusLoginUser.getCurrentOrgId());
			String tempPath=null;
			if(sysList!=null && sysList.size()>0){
				for(BscAttForm att:sysList){
					tempPath=att.getAttPath();
					tempPath = tempPath.replace(basePath,"");
					tempPath = tempPath.replace("\\","/");
					if(!tempPath.endsWith("/")){
						tempPath +="/";
					}
					tempPath+=att.getAttDiskName();
					att.setAttPath(url+tempPath);
				}
			}
			return sysList;
		}
	}

	/**
	 * 上传照片
	 * @param request
	 * @param entityId 部件表id
	 * */
	public List<BscAttForm> getMapParts(HttpServletRequest request,String entityId,String jdmc,String entity, Map<String,MultipartFile> files) {
		String upload_path = ThirdUtils.getInPath();
		SimpleDateFormat  formatAttName = new SimpleDateFormat("yyyyMMddHHmmss");
		SimpleDateFormat formatDay = new SimpleDateFormat("yyyyMMdd"); // 天数的文件夹
		Format format = new SimpleDateFormat("yyyyMM"); //月
		String attTime = request.getParameter("attTime");
		List<BscAttForm> listAtt = new ArrayList<>();
		try {
			if (files!=null && files.size()>0) {
                for(String itemKey:files.keySet()){
                    MultipartFile item = files.get(itemKey);
                    if(!item.isEmpty()){
                        String name = item.getName();
                        String fileFileName = item.getOriginalFilename();
						String fileformat = fileFileName.substring(fileFileName.lastIndexOf('.') + 1, fileFileName.length());
                        String filePath = "";
						Date cdtDate = new Date();
                        if(name.contains("_img.jpg")){
                            String attTimeString = name.split("_img.jpg")[0];
                            try {
                                cdtDate = formatAttName.parse(attTimeString);
                            } catch (Exception e) {
                            }
                        }
                        String filepaths = upload_path;//按照月份存图片
                        //保存到附件表
                        String loginName = request.getParameter("userName");
                        //如果是问题上报自行处理，要分开存问题上报的照片和自行处理的照片
                        if("GxProblemReport_self".equals(entity) && item.getName().indexOf("_self_")!=-1 && jdmc!=null){
                            //saveSysFileLog(name, loginName, filePath, jdmc, "DriGxSggc");
							BscAttForm form = new BscAttForm();
							form = buildNewAtForm("","DRI_GX_SGGC",entityId,"","","0","0");
							form.setAttFormat(fileformat);
							form.setAttDiskName(form.getAttCode() + "." + form.getAttFormat());
							form.setCreateTime(cdtDate);
							File f = new File(form.getAttPath());
							if(!f.isDirectory()){
								f.mkdirs();
							}
							f = new File(form.getAttPath(),form.getAttDiskName());
							item.transferTo(f);
							item = null;
							form.setAttSize(f.length()+"");
							listAtt.add(form);
							filePath = form.getAttPath()+File.separator+form.getAttDiskName();
                        }else{
							BscAttForm form = new BscAttForm();
							form = buildNewAtForm("","DRI_GX_PROBLEM_REPORT",entityId,"","","0","0");
							form.setAttFormat(fileformat);
							form.setCreateTime(cdtDate);
							form.setAttDiskName(form.getAttCode() + "." + form.getAttFormat());
							File f = new File(form.getAttPath());
							if(!f.isDirectory()){
								f.mkdirs();
							}
							f = new File(form.getAttPath(),form.getAttDiskName());
							item.transferTo(f);
							item = null;
							form.setAttSize(f.length()+"");
							listAtt.add(form);
							filePath = form.getAttPath()+File.separator+form.getAttDiskName();
                        }
                        // 缩略图 start
                        // 缩略图地址
                        String smallpicPath=upload_path+"\\imgSmall";
                        String picThumbnailUrl=smallpicPath+filePath.substring(upload_path.length());
                        File sf = new File(smallpicPath);
                        if(!sf.isDirectory()){
                            sf.mkdirs();
                        }
                        File temp = new File(picThumbnailUrl);
                        if(!temp.exists()){
							File parentFile = temp.getParentFile();
							if(!parentFile.isDirectory()){
								parentFile.mkdirs();
							}
						}
                        Thumbnails.of(filePath)
                                .scale(0.4f)
                                .toFile(picThumbnailUrl);
                    }
                }
            }
		} catch (IOException e) {
			e.printStackTrace();
		}
		return listAtt;
	}
	/**
	 * 保存到sysfile
	 * sysfileLink
	 * ***/
	public void saveSysFile(String fileName,String loginName,String path,String entityId,String entity,String filecode,Date cdtDate){
		String uploadPath = path;//服务器上传路径
		String t_ext = fileName.substring(fileName.lastIndexOf(".") + 1);//后缀
		SysFileForm form = new SysFileForm();
		form.setFileName(fileName);
		form.setFileCode(filecode);
		form.setFilePath(uploadPath);
		form.setFileFormat(t_ext);
		form.setCmp("");
		form.setCdt(cdtDate);
		form.setEntity(entity);
		form.setEntityId(entityId);
		this.sysFileService.saveSysFile(form, loginName);
	}
	/**
	 * 保存到工作流附件表
	 * ***/
	public BscAttForm saveSysFileLog(String fileName,String loginName,String path,String entityId,String tableName){
		BscAttForm form = this.buildNewAtForm("",tableName,entityId,"taskId","","","");
		String uploadPath = path;//服务器上传路径
		String fileformat = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length());
		form.setAttFormat(fileformat);
		form.setAttName(fileName);
		form.setAttDiskName(form.getAttCode() + "." + form.getAttFormat());
		return form;
	}
	private BscAttForm buildNewAtForm(String dirId, String tableName,String pkName, String recordId , String atType, String isDbStore, String isEncrypt) {
		String configPathDefault = this.bscInitService.getConfigValueByConfigKey("uploadPath");
		String isDbStroDefault = this.bscInitService.getConfigValueByConfigKey("isDbStore");
		String isEncryptDefault = this.bscInitService.getConfigValueByConfigKey("isEncrypt");
		String isreDefault = this.bscInitService.getConfigValueByConfigKey("isRelative");
		String iniencryptClass = this.bscInitService.getConfigValueByConfigKey("encryptClassFullName");
		BscAttForm form = new BscAttForm();
		form.setCreateTime(new Date());
		form.setDirId(dirId);
		form.setTableName(tableName);
		form.setEncryptClass(iniencryptClass);
		form.setPkName(pkName);
		form.setAttCode((new Date()).getTime() + "");
		form.setAttPath(configPathDefault + File.separator+ tableName +File.separator+pkName );
		form.setAttType(atType);
		form.setIsDbStore(isDbStore == null || !"0".equals(isDbStore) && !"1".equals(isDbStore) ? isDbStroDefault : isDbStore);
		form.setIsEncrypt(isEncrypt == null || !"0".equals(isEncrypt) && !"1".equals(isEncrypt) ? isEncryptDefault : isEncrypt);
		form.setIsRelative(isreDefault);
		return form;
	}
	private GxProblemReport getFormByJson(JSONObject o){
		if(o==null){
			return null;
		}
		GxProblemReport gxForm = new GxProblemReport();
		gxForm.setFjzd(o.containsKey("photos")?o.getString("photos"):null);
		gxForm.setSzwz(o.getString("szwz"));
		gxForm.setX(o.getString("x"));
		gxForm.setY(o.getString("y"));
		gxForm.setJdmc(o.getString("jdmc"));
		gxForm.setBhlx(o.getString("bhlx"));
		gxForm.setSslx(o.getString("sslx"));
		gxForm.setJjcd(o.getString("jjcd"));
		gxForm.setWtms(o.getString("wtms"));
		gxForm.setBz(o.getString("bz"));
		gxForm.setLayerId(o.getLong("layer_id"));
		gxForm.setLayerName(o.getString("layer_name"));
		gxForm.setObjectId(o.getString("object_id"));
		gxForm.setUsid(o.getString("usid"));
		gxForm.setLayerurl(o.getString("layerurl"));
		gxForm.setReportx(o.containsKey("reportx")?o.getString("reportx"):null);
		gxForm.setReporty(o.containsKey("reporty")?o.getString("reporty"):null);
		gxForm.setReportaddr(o.containsKey("reportaddr")?o.getString("reportaddr"):null);

		Map<String,String> cmMap=correctMarkService.getFrom(gxForm.getLoginname());
		if(cmMap!=null && cmMap.size()>0){
			gxForm.setTeamOrgId(cmMap.get("teamOrgId"));
			gxForm.setTeamOrgName(cmMap.get("teamOrgName"));
			gxForm.setDirectOrgId(cmMap.get("directOrgId"));
			gxForm.setDirectOrgName(cmMap.get("directOrgName"));
			gxForm.setSuperviseOrgId(cmMap.get("superviseOrgId"));
			gxForm.setSuperviseOrgName(cmMap.get("superviseOrgName"));
			gxForm.setParentOrgId(cmMap.get("parentOrgId"));
			gxForm.setParentOrgName(cmMap.get("parentOrgName"));
		}
		if (gxForm.getBhlx()!=null && gxForm.getBhlx().contains("[")) {//问题类型支持多选，特殊处理一下里面的符号
			String bhlx=gxForm.getBhlx();
			bhlx=bhlx.replace("[", "");
			bhlx=bhlx.replace("]", "");
			bhlx=bhlx.replace("\"", "");
			gxForm.setBhlx(bhlx);
		}
		return gxForm;
	}
	public List<DetailFilesForm> convetBascToDetFile(List<BscAttForm> listAt){
		if(listAt!=null){
			List<DetailFilesForm> listDeta = new ArrayList<>();
			//默认升序
			Collections.sort(listAt,Comparator.comparing(BscAttForm::getCreateTime).reversed());
			for (BscAttForm s:listAt) {
				DetailFilesForm filesForm=new DetailFilesForm();
				filesForm.setId(s.getDetailId());
				filesForm.setName(s.getAttName());
				filesForm.setMime(s.getAttFormat());
				filesForm.setPath(s.getAttPath());
				String[] urlParh = s.getAttPath().split(psxjProperties.getRequest_file_path());
				filesForm.setThumbPath(urlParh[0]+psxjProperties.getRequest_file_path()
						+psxjProperties.getFileSmallPath()+urlParh[1]);
				//这里要传Http路径
				filesForm.setTime(s.getCreateTime()==null?0:s.getCreateTime().getTime());
				listDeta.add(filesForm);
			}
			return listDeta;
		}
		return null;
	}
}

