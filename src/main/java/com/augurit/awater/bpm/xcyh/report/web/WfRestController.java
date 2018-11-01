package com.augurit.awater.bpm.xcyh.report.web;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.augurit.agcloud.bpm.common.domain.ActTplApp;
import com.augurit.agcloud.bpm.common.domain.ActTplAppFlowdef;
import com.augurit.agcloud.bpm.common.service.ActTplAppService;
import com.augurit.agcloud.bpm.common.service.BpmTaskService;
import com.augurit.agcloud.bpm.front.controller.BpmBusAbstractController;
import com.augurit.agcloud.bpm.front.domain.BpmProcessContext;
import com.augurit.agcloud.bpm.front.domain.BpmWorkFlowConfig;
import com.augurit.agcloud.bpm.front.service.BpmProcessFrontService;
import com.augurit.agcloud.bsc.domain.BscAttForm;
import com.augurit.agcloud.bsc.sc.init.service.BscInitService;
import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.framework.ui.result.ContentResultForm;
import com.augurit.agcloud.framework.ui.result.ResultForm;
import com.augurit.agcloud.opus.common.domain.*;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.awater.bpm.file.service.ISysFileService;
import com.augurit.awater.bpm.file.web.form.SysFileForm;
import com.augurit.awater.bpm.problem.service.ICcProblemService;
import com.augurit.awater.bpm.sggc.service.IGxSggcService;
import com.augurit.awater.bpm.sggc.web.form.GxSggcForm;
import com.augurit.awater.bpm.sggc.web.form.GxSggcLogForm;
import com.augurit.awater.bpm.xcyh.asiWorkflow.web.form.BzFrom;
import com.augurit.awater.bpm.xcyh.opuTag.service.SelfOpuOmTagService;
import com.augurit.awater.bpm.xcyh.reassign.domain.ReassignProcess;
import com.augurit.awater.bpm.xcyh.reassign.service.IReassignProcessService;
import com.augurit.awater.bpm.xcyh.report.domain.GxProblemReport;
import com.augurit.awater.bpm.xcyh.report.service.IGxProblemReportService;
import com.augurit.awater.dri.problem_report.correct_mark.service.ICorrectMarkService;
import com.augurit.awater.dri.utils.Result;
import com.augurit.awater.util.data.SymmetricEncoder;
import com.augurit.awater.util.file.SysFileUtils;
import com.common.util.Common;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.lang3.StringUtils;
import org.flowable.bpmn.model.BpmnModel;
import org.flowable.bpmn.model.FlowNode;
import org.flowable.bpmn.model.Process;
import org.flowable.bpmn.model.SequenceFlow;
import org.flowable.bpmn.model.UserTask;
import org.flowable.engine.RepositoryService;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.flowable.task.api.Task;
import org.flowable.task.api.TaskQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.persistence.EntityManager;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

//import com.augurit.agcloud.bpm.common.domain.ActTplAppProcdef;
//import com.augurit.agcloud.bpm.common.service.ActTplAppProcdefService;

@RestController
@RequestMapping("/asiWorkflow")
public class WfRestController extends BpmBusAbstractController<GxProblemReport> {
    @Autowired
    private ISysFileService sysFileService;
	@Autowired
	private IGxProblemReportService gxProblemReportService;

    @Autowired
    private IGxSggcService gxSggcService;
    @Autowired
    private ICcProblemService ccproblemService;

    @Autowired
    private ICorrectMarkService correctMarkService;

	@Autowired
	private IOmOrgRestService omOrgRestService;
	@Autowired
	private IOmUserInfoRestService omUserInfoRestService;
	@Autowired
	private TaskService taskService;

	@Autowired
	private RuntimeService runtimeService;

	@Autowired
	private RepositoryService repositoryService;
	@Autowired
	private BpmProcessFrontService bpmProcessFrontService;
	@Autowired
	private BpmTaskService bpmTaskService;
	@Autowired
	private ActTplAppService actTplAppService;
	@Autowired
	private IReassignProcessService reassignProcessService;
	@Autowired
	protected BscInitService bscInitService;
	@Autowired
	protected SelfOpuOmTagService opuOmTagService;

	@Value("${filePath}")
	private String filePath;
//
	public static String PROCDEF_KEY = "GX_XCYH";
	public static String PROCDEF_KEY_RGRM = "GX_XCYH_RGRM_TEST";
	public static String GX_SGGC = "DRI_GX_SGGC";
	public static String GX_PROBLEM_REPORT = "DRI_GX_PROBLEM_REPORT";
	public static String OPU_TAG_CODE_RG="TAG000006";//旁观者RG
	public static String OPU_TAG_CODE_RM="TAG000007";//排水中心Rm

	@Autowired
	private EntityManager entityManager;

    public WfRestController() {
    }


	@RequestMapping("/problemFormIndex.do")
	public ModelAndView problemFormIndex(ModelMap modelMap){
		modelMap.put("currUserName", SecurityContext.getCurrentUser().getUserName());
		return new ModelAndView("/water/bpm/problem/problem_index");
	}

	/**

	 * 根据角色来获取自己区的办案人员
	 * */
	@RequestMapping("/getTaskUserByloginName")
	public String getTaskUserByloginName(HttpServletRequest request) throws Exception {
		String loginName = request.getParameter("loginName");
		List<Map<String, Object>> returnList = new ArrayList<Map<String, Object>>();
		Map<String, Object> map = new HashMap<String, Object>();
		List<Map<String, String>> userFormList = new ArrayList<Map<String, String>>();
		//获取上级业主单位负责人
//		List<OpuOmUser> omUserFormList = ccproblemService.getOmUserByUserCode(loginName);
		//获取上级监理单位下所有（R0）用户
		List<OpuOmUser> omUserFormList = ccproblemService.getJlUserByUserCode(loginName);
		if(omUserFormList != null){
			for (OpuOmUser orgUserForm : omUserFormList) {
				if(!loginName.equals(orgUserForm.getLoginName())){
					Map<String, String> userMap = new HashMap<String, String>();
					userMap.put("userCode", "USER#" + orgUserForm.getUserId());
					userMap.put("userName",orgUserForm.getUserName());
					userFormList.add(userMap);
				}
			}
		}
		map.put("assigneers", userFormList);
		returnList.add(map);
		JSONArray jsonArray = JSONArray.parseArray(JSON.toJSONString(returnList));
		return jsonArray.toString();
	}
	
	
	/**
	 * 获取各区R0、排水中心Rm组织
	 * */
//	@RequestMapping("/getAllOrg")
    @RequestMapping(value = "/getAllOrg.do",produces = "application/json;charset=UTF-8")
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
        	// 获取R0成员
//        	List<OpuOmUser> yzList = omUserService.getAllChildByroleCode(key,"ps_yz_chief");
//        	List<Map<String, String>> yzMapList = getBzUser(yzList);
//        	bzFrom.setUserFormList(yzMapList);
        	bzFrom.setIcon("./icon/org.png");
    		bzList.add(bzFrom);
        }
    	JSONArray jsonArray = JSONArray.parseArray(JSON.toJSONString(bzList));
    	return jsonArray.toString();
	}
	
	
	/**
	 * 根据组织编码获取各区R0、排水中心Rm（）
	 * */
 @RequestMapping(value = "/getUsersByorgCode.do",produces = "application/json;charset=UTF-8")
    public String getUsersByorgCode(HttpServletRequest request) throws Exception {
        // String loginName = SecurityContext.getCurrentUser().getLoginName();
        String orgCode = request.getParameter("orgCode");
        String orgName = request.getParameter("orgName");
        BzFrom bzFrom = new BzFrom();
        bzFrom.setCode(orgCode);
        bzFrom.setName(orgName);
        List<Map<String, String>> list = null;
        /**排水中心*/
        if("O_GZPS_CENTER".equals(orgCode)){
            // 获取Rm成员
            List<Map<String,Object>> managerList = gxProblemReportService.getUserByroleCode("O_GZPS_CENTER","R025-G017");//ps_manager
            list = getBzUser(managerList);
        }else if(StringUtils.isNotBlank(orgCode)){
            // 获取R0成员
            List<Map<String, Object>> yzList = gxProblemReportService.getAllChildByroleCode(orgCode,"R025-G013");//ps_yz_chief
            list = getBzUser(yzList);
        }
        bzFrom.setUserFormList(list);
        JSONObject jsonArray = JSONObject.parseObject(JSON.toJSONString(bzFrom));
        return jsonArray.toString();
    }

    /**
     * 拼装数据
     * @param userList
     * @return
     */
    private List<Map<String, String>> getBzUser(List<Map<String, Object>> userList ) {
        List<Map<String, String>> userFormList = new ArrayList<Map<String, String>>();
        if (userList != null) {
            for (Map<String, Object> userInfo : userList) {
                Map<String, String> userMap = new HashMap<String, String>();
                //排除自己
//				if(loginName == null || !loginName.equals(userInfo.get("LOGIN_NAME"))){
                userMap.put("code", (String)userInfo.get("LOGIN_NAME"));
                userMap.put("name", (String)userInfo.get("USER_NAME"));
                userMap.put("icon", "./icon/user_blue.png");
                userFormList.add(userMap);
//				}
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
	@RequestMapping("/getProblemForm.do")
	public GxProblemReport getGxProblemReportById(String id) throws Exception{
		return gxProblemReportService.getGxProblemReportById(id);
	}

    /**
     * 获取当前节点参与者
     * @param taskId
     * @return
     * @throws Exception
     */
    @RequestMapping("/getCurrTaskUser.do")
    public ContentResultForm getCurrTaskUser(String taskId) throws Exception {
		if (StringUtils.isBlank(taskId)) {
			return new ContentResultForm(false, "taskId不能为空");
		} else {
			Map<String, String> assigneeRange = bpmTaskService.getCurrTaskAssigneeOrRange(taskId);
			if(assigneeRange!=null&& !assigneeRange.isEmpty()){
				String assignee = assigneeRange.get("assigneeRange");
				assignee = assignee.replaceAll(",,",",");
				Map<String, List> assigneeMap=bpmTaskService.getAssigneeRangeTreeByRangeKey(assignee);
				if(assigneeMap!=null&&!assigneeMap.isEmpty()){
					List<OpuOmUser> userList = assigneeMap.get("$USER");
					if(userList!=null&&!userList.isEmpty()){
						return new ContentResultForm(true, userList);
					}
				}
			}
			return new ContentResultForm(false, "未查到可转派人员");
		}
    }

    /**
     * 获取附件图片信息
     * @param masterEntityKey
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping("/getImages.do")
    public ContentResultForm getImages(String masterEntityKey,HttpServletRequest request) throws Exception {
		if (StringUtils.isBlank(masterEntityKey)) {
			return new ContentResultForm(false, "参数masterEntityKey不能为空");
		} else {
			String basePath = bscInitService.getConfigValueByConfigKey("uploadPath");
			String urlAll=request.getRequestURL().toString() ;
			String url="";//图片路径处理
			String[] mainurl=urlAll.split("/psxj");
			if (mainurl!=null && mainurl.length>0) {
				url=mainurl[0]+"/psxj/dri";
			}
			List<BscAttForm> sysList=gxProblemReportService.getBscAttByTableNameAndPkNameAndRecordId(GX_PROBLEM_REPORT,masterEntityKey,null);
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
			return new ContentResultForm(true, sysList);
		}
    }

    /**
     * 保存转派信息   目前弃用
     * @param taskId
     * @param sendToUserId
     * @param reassignComments
     * @return
     * @throws Exception
     */
    @RequestMapping("/wfReassign.do")
    public ContentResultForm wfReassign(String taskId,String sendToUserId,String reassignComments) throws Exception {
		if (StringUtils.isBlank(taskId)||StringUtils.isBlank(sendToUserId)) {
			return new ContentResultForm(false, "参数taskId,sendToUserId不能为空");
		} else {
			bpmTaskService.sendOnTask(taskId, sendToUserId);
			com.augurit.agcloud.framework.security.user.OpuOmUser currUser=SecurityContext.getCurrentUser();
			OpuOmUserInfo sendUser = omUserInfoRestService.getOpuOmUserInfoByLoginName(sendToUserId);
			ReassignProcess reassignProcess = new ReassignProcess();
			reassignProcess.setTaskId(taskId);
			reassignProcess.setTaskName("任务派单");
			reassignProcess.setAssignee(currUser.getLoginName());
			reassignProcess.setAssigneeName(currUser.getUserName());
			reassignProcess.setReassign(sendUser.getLoginName());
			reassignProcess.setReassignName(sendUser.getUserName());
			reassignProcess.setReasSignTime(new Timestamp(System.currentTimeMillis()));
			reassignProcess.setReassignComments(reassignComments);
			reassignProcessService.saveReassignProcess(reassignProcess);
			return new ContentResultForm(true, reassignProcess);
		}
    }

    /**
     * 解析json中的业务数据
     * @param o
     * @return
     */
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
		gxForm.setLoginname(SecurityContext.getCurrentUser().getLoginName());
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
	@RequestMapping("/selfWorkFlowBusSave.do")//procdefKey=GX_XCYH,appProcdefId = '16093750-66fc-47d4-a493-553855f2b996'
	public ResultForm selfWorkFlowBusSave(HttpServletRequest request) throws Exception {
		String dataJson = request.getParameter("json");
		JSONObject jsonObject = new JSONObject();
		JSONObject json = JSONObject.parseObject(dataJson);
		String id = null;
		GxProblemReport gxProblemReport=null;
		if(json==null){
			id=request.getParameter("id");
		}else{
			id = json.getString("id");
		}
		String procdefKey,appProcdefId;
		BpmWorkFlowConfig bpmWorkFlowConfig = new BpmWorkFlowConfig();
		if(id==null||"".equals(id)||"undefined".equals(id)){//新增
            String userId=SecurityContext.getCurrentUser().getUserId();
            boolean isRgRm=opuOmTagService.isRgRm(userId);
            bpmWorkFlowConfig.setFlowdefKey(PROCDEF_KEY);
//            bpmWorkFlowConfig.setFlowdefKey(PROCDEF_KEY_RGRM);
            if(isRgRm){
                bpmWorkFlowConfig.setFlowdefKey(PROCDEF_KEY_RGRM);
            }
			id=null;
			gxProblemReport = getFormByJson(json);
			String appId = gxProblemReportService.getAppIdByProcDefKey(bpmWorkFlowConfig.getFlowdefKey());
			if(appId==null||"".equals(appId)){
				appId=json.getString("appId");
			}
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
				BpmProcessContext processContext = super.workFlowBusSave(gxProblemReportService, gxProblemReport, bpmWorkFlowConfig);
				jsonObject.put("save", gxProblemReport);
				String jsonStr = jsonObject.toString();
				if(jsonObject != null){
					jsonStr = jsonStr.replaceFirst(">null<", ">业主负责人<");
				}
				return new ContentResultForm(true,processContext);
			}
		}else{
			String processInstanceId = request.getParameter("processInstanceId");
			String taskId = request.getParameter("taskId");
			gxProblemReport = gxProblemReportService.get(id);
			String sfjbStr = request.getParameter("sfjb");
			if(sfjbStr!=null&&!"".equals(sfjbStr)){
				gxProblemReport.setSfjb(Integer.parseInt(sfjbStr));
			}
			if(processInstanceId!=null&&!"".equals(processInstanceId)&&taskId!=null&&!"".equals(taskId)){
				bpmWorkFlowConfig.setTaskId(taskId);
				bpmWorkFlowConfig.setProcessInstanceId(processInstanceId);
				bpmWorkFlowConfig.setFlowModel("proc");
				BpmProcessContext processContext =super.workFlowBusSave(gxProblemReportService, gxProblemReport, bpmWorkFlowConfig);
				new ContentResultForm(true,processContext);
			}
		}
		return new ResultForm(false,"noPriv:您没有权限上报!");
	}
    @PostMapping("/wfBusSave")
	public ResultForm workFlowBusSave(GxProblemReport gxProblemReport, BpmWorkFlowConfig bpmWorkFlowConfig) throws Exception {
		BpmProcessContext processContext = super.workFlowBusSave(gxProblemReportService, gxProblemReport, bpmWorkFlowConfig);
		String id;
		if(processContext == null)
			id = gxProblemReport.getBusId();
		else
			id = processContext.getMasterEntityKey();
		JSONObject jsonObject = new JSONObject();

//        if(!Common.isCheckNull(SecurityContext.getCurrentUserId())) {
//            List<OpuAcRoleUser> roleList = omOrgRestService.getRolesByUserId(SecurityContext.getCurrentUserId());
//            boolean roleFlag = checkExist(roleList);//判断是否存在RgRm
//            //判断是否有权限启动流程
//			Boolean flag = gxProblemReportService.hasReportRight(SecurityContext.getCurrentUserId());
//            Boolean flag = processExecutionService.canStartProcessInstance(loginName, wfBusTemplateForm.getWfDefKey(), wfBusTemplateForm.getWfDefVersion());
            if(true) {
//            if(flag) {
                //回填
                GxProblemReport gxForm=gxProblemReportService.get(id);
                if (gxForm!=null) {
					gxForm.setSbr(SecurityContext.getCurrentUserName());
//					gxForm.setLoginname(SecurityContext.getCurrentUser().getLoginName());
					gxForm.setLoginname("13660818186");
					gxForm.setSbsj(new Timestamp(System.currentTimeMillis()));
//                	Map<String,String> cmMap=correctMarkService.getFrom(SecurityContext.getCurrentUser().getLoginName());
                	Map<String,String> cmMap=correctMarkService.getFrom("13660818186");
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
				}
                jsonObject.put("save", gxForm);
                String jsonStr = jsonObject.toString();
                if(jsonObject != null){
                	jsonStr = jsonStr.replaceFirst(">null<", ">业主负责人<");
                }
                //上传附件开始 Todo change
//                getMapParts(request,id,null,"GxProblemReport");
				return new ResultForm(true,jsonStr);
            }else{
				return new ResultForm(true,"noPriv:您没有权限上报!");
            }
//        }else {
//        	return new ResultForm(true,"noPriv:您没有权限上报!");
//        }
    }

    @RequestMapping("/getAssigneeRangeAfterTask")
    public ResultForm getAssigneeRangeForTaskAfterGateway(String taskId, String destActId) {
		if (taskId != null && destActId != null) {
			Task currTask = (Task)((TaskQuery)this.taskService.createTaskQuery().taskId(taskId)).singleResult();
			if (currTask != null) {
				BpmnModel bpmnModel = this.repositoryService.getBpmnModel(currTask.getProcessDefinitionId());
				Process process = (Process)bpmnModel.getProcesses().get(0);
				List<SequenceFlow> flow = ((FlowNode)process.getFlowElement(destActId)).getOutgoingFlows().stream().filter(sequenceFlow -> sequenceFlow.getTargetFlowElement() instanceof UserTask).collect(Collectors.toList());
//				UserTask userTask = (UserTask)((FlowNode)process.getFlowElement(destActId)).getOutgoingFlows().get(1).getTargetFlowElement();
				if (flow.size()>0) {
					UserTask userTask = (UserTask)flow.get(0).getTargetFlowElement();
					Map map = new HashMap();
					map.put("assigneeRange", userTask.getAssigneeRange());
					map.put("nextTaskName", userTask.getName());
					return new ContentResultForm(true, map);

				} else {
					throw new RuntimeException("自动流程后并无用户任务");
				}
			} else {
				throw new RuntimeException("当前节点任务不存在或者已完成，请检查taskId是否正确");
			}
		} else {
			return null;
		}
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
     * 保存节点附件
     *
     * @return
     */
    @PostMapping("/saveJdFile")
    public String saveSysFile(HttpServletRequest request) throws Exception {
    	String taskInstDbid = request.getParameter("taskInstDbid");
//    	System.out.println("taskInstDbid"+taskInstDbid);
//    	String jdmc =request.getParameter("jdmc");
    	boolean falg = getMapParts(request, taskInstDbid,null,"JDFJ");
    	if(falg){
    		return "true";
    	}else{
    		return "false";
    	}
    }
    
	/**
	 * 上传照片
	 * @param request
	 * @throws Exception
	 * */
	public boolean getMapParts(HttpServletRequest request,String entityId,String jdmc,String entity) throws Exception{
		SimpleDateFormat formatAttName = new SimpleDateFormat("yyyyMMddHHmmss");
		//String upload_path=request.getSession().getServletContext().getRealPath("/")+"uploadFile\\uploadFile\\";
		//20171113修改为从磁盘存入，不是项目里面的upload
	    String upload_path = this.filePath;
		try {
			DiskFileItemFactory factory = new DiskFileItemFactory();
			factory.setSizeThreshold(1024*1024);
			factory.setRepository(Paths.get(upload_path).toFile());
			ServletFileUpload upload = new ServletFileUpload(factory);
			upload.setFileSizeMax(1024*1024*20);
			upload.setSizeMax(1024*1024*22);
			upload.setHeaderEncoding("utf-8");
			boolean isMultipar= ServletFileUpload.isMultipartContent(request);
			if(isMultipar){
				List<FileItem> listFiles = upload.parseRequest(request);
				if (listFiles!=null && listFiles.size()>0) {
					for(FileItem item: listFiles){
						if(!item.isFormField()){
							String name = item.getName();
							Date cdtDate = new Date();
							if(name.contains("_img.jpg")){
								String attTimeString = name.split("_img.jpg")[0];
								try {
									cdtDate = formatAttName.parse(attTimeString);
								} catch (Exception e) {
								}
							}
							String filepaths = upload_path;//按照月份存图片
							File f = new File(filepaths);
							if(!f.isDirectory()){
								f.mkdirs();
							}
							String filecode= SysFileUtils.nextFileCode();
							String filePath = filepaths+"\\"+filecode+"_"+name;
							f = new File(filePath);
							item.write(f);
							item.delete();
							//保存到附件表
							String loginName = request.getParameter("userName");
							//如果是问题上报自行处理，要分开存问题上报的照片和自行处理的照片
							if("GxProblemReport_self".equals(entity) && item.getName().indexOf("_self_")!=-1 && jdmc!=null){
								saveSysFileLog(name, loginName, filePath, jdmc, "awater_swj.gx_sggc", filecode,cdtDate);
							}else{
								if("GxProblemReport_self".equals(entity) && item.getName().indexOf("_probleam_")!=-1){
									saveSysFile(name,loginName,filePath,entityId,"GxProblemReport",filecode,cdtDate);
								}else{
									saveSysFile(name,loginName,filePath,entityId,entity,filecode,cdtDate);
								}
							}
							// 缩略图 start						
							// 缩略图地址
							String smallpicPath=upload_path+"\\imgSmall";
							String picThumbnailUrl=smallpicPath+"\\"+filecode+"_"+name;
							File sf = new File(smallpicPath);
							if(!sf.isDirectory()){
								sf.mkdirs();
							}
							Thumbnails.of(filePath)
							.scale(0.4f)
							.toFile(picThumbnailUrl); 
						  // 缩略图 end 
						}
					}
				}			
			}
		} catch (FileUploadException e) {
//			System.out.println(e.getMessage());
			return false;
		}
		return true;
	}

//    @GetMapping("/viewHistoryTask")
//    public String viewHistoryTask(HttpServletRequest request) {
//        String wfBusInstanceId = request.getParameter("wfBusInstanceId");
//        if(Common.isCheckNull(wfBusInstanceId)) {
//            return null;
//        } else {
//            WfContextTaskForm instance = new WfContextTaskForm();
//            instance.setWfBusInstanceId(Long.valueOf(Long.parseLong(wfBusInstanceId)));
//            instance = AdsWfServiceHolder.getTaskService().getWfContextTaskForm(instance.getWfBusInstanceId());
//            if(instance == null) {
//                throw new CanNotFoundTaskInstanceException(instance.getTaskInstDbid());
//            } else {
//                instance.setViewName(instance.getProcInstState().equals("active")?"yb":"bj");
//                instance.setActivityName((String)null);
//                return Utils.parseObject(instance).toString();
//            }
//        }
//    }

//    @GetMapping("/getTraceInfo")
//    public String getTraceInfo(HttpServletRequest request) {
//        String taskInstDbid = request.getParameter("taskInstDbid");
//        String procInstId = request.getParameter("procInstId");
//        WfContextTaskForm instance = new WfContextTaskForm();
//        List list = null;
//        if(!Common.isCheckNull(taskInstDbid)) {
//            instance.setTaskInstDbid(Long.valueOf(Long.parseLong(taskInstDbid)));
//            list = this.traceRecordService.getAllTraceRecords(instance.getTaskInstDbid());
//        } else if(!Common.isCheckNull(procInstId)) {
//            instance.setProcInstId(procInstId);
//            list = this.traceRecordService.getAllTraceRecords(instance.getProcInstId());
//        }
//
//        ExtResult result = new ExtResult(true, true);
//        result.setResult(list);
//        return Utils.parseObject(result).toString();
//    }
    
    @RequestMapping("/saveWfReminds")
    public String saveWfReminds(HttpServletRequest request) {
        String json = request.getParameter("json");
        String resJson = null;
        if(Common.isCheckNull(json)) {
            return resJson;
        } else {
//            WfRemindFormVO form = new WfRemindFormVO(json);
//            try {
//                this.wfRemindService.saveWfReminds(new WfRemindForm[]{form});
//                resJson = Utils.extRenderSuccess();
//            } catch (Exception var6) {
//                resJson = Utils.extRenderFailture();
//            }
            return resJson;
        }
    }

    
    @RequestMapping("/remindInfoList")
    public String remindInfoList(HttpServletRequest request) {
        String loginName = request.getParameter("loginName");
        String json = null;
        if(Common.isCheckNull(loginName)) {
            return json;
        } else {
//            try {
//                Page e = new Page();
//                WfRemindForm form = new WfRemindForm();
//                ExtUtils.initPageFromExtGridParam(request, e);
//                form.setAssignee(loginName);
//                this.wfRemindService.search(e, form);
//                json = Utils.extRenderGridJson(e);
//            } catch (Exception var6) {
//                json = Utils.extRenderFailture();
//            }

            return json;
        }
    }

    
    @RequestMapping("/deleteWfReminds")
    public String deleteWfReminds(HttpServletRequest request) {
        String checkedIds = request.getParameter("checkedIds");
        String json = null;
        if(Common.isCheckNull(checkedIds)) {
            return json;
        } else {
//            try {
//                this.wfRemindService.deleteWfReminds(new Long[]{Long.valueOf(Long.parseLong(checkedIds))});
//                json = Utils.extRenderSuccess();
//            } catch (Exception var5) {
//                json = Utils.extRenderFailture();
//            }

            return json;
        }
    }

    
    @RequestMapping("/readDocument")
    public String readDocument(HttpServletRequest request, HttpServletResponse response) {
        String sysFileId = request.getParameter("sysFileId");

        try {
            File e = null;
//            if(!Common.isCheckNull(sysFileId)) {
//                e = this.attachmentMgr.readFileFromServer(request, sysFileId);
//            } else {
//                e = this.attachmentMgr.readBlankFile(request);
//            }
//
//            this.attachmentMgr.download(e, response, request, sysFileId);
        } catch (Exception var5) {
            var5.printStackTrace();
        }

        return null;
    }

    
    @RequestMapping("/deleteAttachment")
    public String deleteAttachment(HttpServletRequest request) {
        String fileIds = request.getParameter("sysFileIds").replace("{", "").replace("}", "");
        String json = null;
        if(Common.isCheckNull(fileIds)) {
            return json;
        } else {
            String[] sysFileIds = fileIds.split(",");

            try {
                if(sysFileIds != null && sysFileIds.length > 0) {
                    String[] var8 = sysFileIds;
                    int var7 = sysFileIds.length;

                    for(int var6 = 0; var6 < var7; ++var6) {
                        String e = var8[var6];
//                        this.attachmentMgr.delete(Long.valueOf(Long.parseLong(e)), request);
                    }
                }

//                json = Utils.extRenderSuccess();
            } catch (Exception var9) {
                var9.printStackTrace();
//                json = Utils.extRenderFailture();
            }

            return json;
        }
    }

    @PostMapping("/uploadDocument")
    public String uploadDocument(HttpServletRequest request) throws Exception {
        String json = null;
//        boolean success = this.attachmentMgr.upload(request);
//        if(success) {
//            json = "{\'success\':true}";
//        } else {
//            json = "{\'success\':false}";
//        }

        return json;
    }

    /**
     * 施工过程日志上传
     * @param request
     * @return
     * @throws Exception
     */
    @PostMapping("/sggcLogSave")
    public String sggcLogSave(HttpServletRequest request) throws Exception{
    	JSONObject jsonObject = new JSONObject();
        String loginName = request.getParameter("loginName");
        String userName = request.getParameter("userName");
        String sjid = request.getParameter("sjid");
        if(!Common.isCheckNull(userName) && !Common.isCheckNull(sjid) && !Common.isCheckNull(loginName)){
        	try{
        		GxSggcForm form = new GxSggcForm();
            	form.setUsername(userName);
            	form.setLoginname(loginName);
            	form.setSjid(sjid);
            	form.setLx("0");
            	form.setTime(new Date());
            	form.setContent(request.getParameter("content"));
            	form.setSgjd(request.getParameter("sgjd"));
            	gxSggcService.saveData(form);
            	//上传附件
            	uploadLogFile(request,form.getId().toString(),"awater_swj.gx_sggc");
            	jsonObject.put("code", 200);
            	jsonObject.put("data", null);
            	jsonObject.put("message", "");
        	}catch(Exception e){
        		jsonObject.put("code", 404);
            	jsonObject.put("data", null);
            	jsonObject.put("message", "参数缺失");
        	}
        }else{
        	return null;
        }
        return jsonObject.toString();
    	
    }
    /**
     * 评论上传
     * @param request
     * @return
     * @throws Exception
     */
    @PostMapping("/sggcContentSave")
    public String sggcContentSave(HttpServletRequest request) throws Exception{
    	JSONObject jsonObject = new JSONObject();
        String loginName = request.getParameter("loginName");
        String userName = request.getParameter("userName");
        //OpuOmUser omUserForm=omOrgRestService.getOpuOmUserInfoByUserId(loginName);
        String sjid = request.getParameter("sjid");
        if(!Common.isCheckNull(userName) && !Common.isCheckNull(sjid) && !Common.isCheckNull(loginName)){
        	try{
        		GxSggcForm form = new GxSggcForm();
    			form.setUsername(userName);
    			form.setLoginname(loginName);
            	form.setSjid(sjid);
            	form.setLx("1");
            	form.setTime(new Date());
            	form.setContent(request.getParameter("content"));
            	gxSggcService.saveData(form);
            	jsonObject.put("code", 200);
            	jsonObject.put("data", null);
            	jsonObject.put("message", "");
        	}catch(Exception e){
        		jsonObject.put("code", 500);
            	jsonObject.put("data", null);
            	jsonObject.put("message", e.getMessage());
        	}
        }else{
        	jsonObject.put("code", 404);
        	jsonObject.put("data", null);
        	jsonObject.put("message", "参数缺失");
        }
        return jsonObject.toString();
    }
    /**
	 * 施工日志上传照片
	 * @param request
	 * @param entityId 
	 * @throws Exception 
	 * */
	public boolean uploadLogFile(HttpServletRequest request,String entityId,String entity) throws Exception{
		SimpleDateFormat  formatAttName = new SimpleDateFormat("yyyyMMddHHmmss");
		//String upload_path=request.getSession().getServletContext().getRealPath("/")+"uploadFile\\uploadFile\\";
		//20171113修改为从磁盘存入，不是项目里面的upload
	    String upload_path = this.filePath;
		try {
			DiskFileItemFactory factory = new DiskFileItemFactory();
			factory.setSizeThreshold(1024*1024);
			factory.setRepository(Paths.get(upload_path).toFile());
			ServletFileUpload upload = new ServletFileUpload(factory);
			upload.setFileSizeMax(1024*1024*20);
			upload.setSizeMax(1024*1024*22);
			upload.setHeaderEncoding("utf-8");
			boolean isMultipar= ServletFileUpload.isMultipartContent(request);
			if(isMultipar){
				List<FileItem> listFiles = upload.parseRequest(request);
				if (listFiles!=null && listFiles.size()>0) {
					for(FileItem item: listFiles){
						if(!item.isFormField()){
							String name = item.getName();
							Date cdtDate = new Date();
							if(name.contains("_img.jpg")){
								String attTimeString = name.split("_img.jpg")[0];
								try {
									cdtDate = formatAttName.parse(attTimeString);
								} catch (Exception e) {
								}
							}
							String filepaths = upload_path;
							File f = new File(filepaths);
							if(!f.isDirectory()){
								f.mkdirs();
							}
							String filecode= SysFileUtils.nextFileCode();
							String filePath = filepaths+"\\"+filecode+"_"+name;
							f = new File(filePath);
							item.write(f);
							item.delete();
							//保存到附件表
							String loginName = request.getParameter("userName");
							saveSysFileLog(name,loginName,filePath,entityId,entity,filecode,cdtDate);
							// 缩略图 start						
							// 缩略图地址
							String smallpicPath=upload_path+"\\imgSmall";
							String picThumbnailUrl=smallpicPath+"\\"+filecode+"_"+name;
							File sf = new File(smallpicPath);
							if(!sf.isDirectory()){
								sf.mkdirs();
							}
							Thumbnails.of(filePath)
							.scale(0.4f)
							.toFile(picThumbnailUrl); 
						  // 缩略图 end 
						}
					}
				}			
			}
		} catch (FileUploadException e) {
//			System.out.println(e.getMessage());
			return false;
		}
		return true;
	}
	 /**
     * 保存到sysfile
     * sysfileLink
     * ***/
    public void saveSysFileLog(String fileName,String loginName,String path,String entityId,String tableName,String filecode,Date cdtDate){
    	String uploadPath = path;//服务器上传路径
    	String t_ext = fileName.substring(fileName.lastIndexOf(".") + 1);//后缀
		
		SysFileForm form = new SysFileForm();
		form.setFileName(fileName.substring(0,fileName.lastIndexOf('.')));
		form.setFileCode(filecode);
		form.setFilePath(uploadPath);
		form.setFileFormat(t_ext);
		form.setCmp("");
		form.setCdt(cdtDate);
		form.setEntity(tableName);
		form.setEntityId(entityId);
		this.sysFileService.saveSysFile(form, loginName);
    }
    /**
     * 获取施工日志与评论
     * @param request
     * @return
     * @throws Exception
     */
    @PostMapping("/getSggcLogList")
    public String getSggcLogList(HttpServletRequest request) throws Exception{
    	JSONObject jsonObject = new JSONObject();
        String sjid = request.getParameter("sjid");//获取上报事件id
        //String loginName = request.getParameter("loginName");
        GxSggcForm form =new GxSggcForm();
        form.setSjid(sjid);
        if(!Common.isCheckNull(sjid)){
        	try{
        		List<GxSggcForm> list = gxSggcService.search(form);
            	if(list!=null && list.size()>0){
            		List<GxSggcLogForm> gxSggcLogFormList = new ArrayList<GxSggcLogForm>();
            		for(GxSggcForm gxSggcForm: list){
            			GxSggcLogForm gxSggcLogForm = new GxSggcLogForm();
            			gxSggcLogForm.setContent(gxSggcForm.getContent());
            			gxSggcLogForm.setId(gxSggcForm.getId());
            			gxSggcLogForm.setLx(gxSggcForm.getLx());
            			gxSggcLogForm.setSgjd(gxSggcForm.getSgjd());
            			gxSggcLogForm.setSjid(sjid);
            			gxSggcLogForm.setUsername(gxSggcForm.getUsername());
            			gxSggcLogForm.setTime(gxSggcForm.getTime()==null?0:gxSggcForm.getTime().getTime());
            			//查找附件信息
			        	List<BscAttForm> sysList=gxProblemReportService.getBscAttByTableNameAndPkNameAndRecordId(GX_SGGC, gxSggcForm.getSjid(),gxSggcForm.getSgjd());
			        	if (sysList!=null && sysList.size()>0) {
//			        		List<DetailFilesForm> fileList=new ArrayList<>();
//			        		String urlAll=request.getRequestURL().toString() ;
//			        		String url="";//图片路径处理
//			        		if (url!=null) {
//			        			String[] mainurl=urlAll.split("/ag");
//			        			if (mainurl!=null && mainurl.length>0) {
//			        				url=mainurl[0]+"/img/";
//								}
//			        		}
//			        		for (SysFileForm s:sysList) {
//								DetailFilesForm filesForm=new DetailFilesForm();
//								filesForm.setName(s.getFileName());
//								filesForm.setMime(s.getFileFormat());
//								filesForm.setPath(url+s.getFileCode()+"_"+s.getFileName()+"."+s.getFileFormat());
//								//这里要传Http路径
//								filesForm.setTime(s.getCdt()==null?0:s.getCdt().getTime());
//								fileList.add(filesForm);
//							}
			        		gxSggcLogForm.setFiles(sysList);
						}
			        	gxSggcLogFormList.add(gxSggcLogForm);
			        	
            		}
            		jsonObject.put("code", 200);
                	jsonObject.put("data", gxSggcLogFormList);
                	jsonObject.put("message", "");
            	}else{
            		jsonObject.put("code", 200);
                	jsonObject.put("data",null);
                	jsonObject.put("message", "");
            	}
        	}catch(Exception e){
        		jsonObject.put("code", 500);
            	jsonObject.put("data", null);
            	jsonObject.put("message", e.getMessage());
        	}
        }else{
        	jsonObject.put("code", 404);
        	jsonObject.put("data", null);
        	jsonObject.put("message", "参数缺失");
        }
        return jsonObject.toString();
    }
    /**
     * 获取环节处理和施工日志与评论
     * @param request
     * @return
     * @throws Exception
     */
    
    @RequestMapping(value="/getTraceRecordAndSggcLogList", produces = "application/json;charset=UTF-8")
    public String getTraceRecordAndSggcLogList(HttpServletRequest request) throws Exception{
    	JSONObject jsonObject = new JSONObject();
    	String sjid = request.getParameter("sjid");//获取上报事件id
    	String procInstId = request.getParameter("procInstId");//获取上报事件id
        if(!Common.isCheckNull(sjid)&&!Common.isCheckNull(procInstId)){
        	try{
        		String basePath = bscInitService.getConfigValueByConfigKey("uploadPath");
				String urlAll=request.getRequestURL().toString() ;
				String url="";//图片路径处理
				String[] mainurl=urlAll.split("/psxj");
				if (mainurl!=null && mainurl.length>0) {
					url=mainurl[0]+"/psxj/dri";
				}
        		/************获取施工日志与评论开始***************/
        		GxSggcForm form =new GxSggcForm();
                form.setSjid(sjid);
        		List<GxSggcForm> list = gxSggcService.search(form);
        		List<GxSggcLogForm> gxSggcLogFormList = new ArrayList<GxSggcLogForm>();
            	if(list!=null && list.size()>0){
            		for(GxSggcForm gxSggcForm: list){
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
						List<BscAttForm> sysList= gxProblemReportService.getBscAttByTableNameAndPkNameAndRecordId(GX_SGGC,gxSggcForm.getSjid(),gxSggcForm.getSgjd());
						if(sysList!=null&&sysList.size()>0){
							String tempPath=null;
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
							gxSggcLogForm.setFiles(sysList);
						}
                        gxSggcLogFormList.add(gxSggcLogForm);
			        	
            		}
            	}
            	/************获取施工日志与评论结束***************/
            	/************获取环节处理信息开始***************/
				List<GxSggcLogForm> gxSggcLogFormList2 = gxSggcService.getHistoryCommentsByProcessInstanceId(procInstId,sjid);
				if(gxSggcLogFormList2!=null&&gxSggcLogFormList2.size()>0){
					String tempPath=null;
					for(GxSggcLogForm log:gxSggcLogFormList2){
						if(log.getFiles()==null||log.getFiles().isEmpty()){
							continue;
						}
						List<BscAttForm> sysList = log.getFiles();
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
						log.setFiles(sysList);
					}
				}
				List<GxSggcLogForm> hbList = new ArrayList<GxSggcLogForm>();
            	//排序
            	Collections.sort(gxSggcLogFormList2,new Comparator<GxSggcLogForm>(){  
            		public int compare(GxSggcLogForm arg0, GxSggcLogForm arg1) {  
            			return arg0.getTime().compareTo(arg1.getTime());  
            		}  
            	});

            	int listSize=gxSggcLogFormList2.size();
                GxSggcLogForm temp = null;
            	for(int i=0;i<listSize;i++){
            	    if(i==0&&gxSggcLogFormList2.get(i).getTime().longValue()==0){
                        temp=gxSggcLogFormList2.get(i);
                    }
            		if(i<listSize-1 && gxSggcLogFormList2.get(i).getTime()>0){
            			gxSggcLogFormList2.get(i).setNextOpUser(gxSggcLogFormList2.get(i+1).getOpUser());
            			gxSggcLogFormList2.get(i).setNextOpUserPhone(gxSggcLogFormList2.get(i+1).getOpUserPhone());
            		}else if(i==listSize-1 && temp!=null){
                        gxSggcLogFormList2.get(i).setNextOpUser(temp.getOpUser());
                        gxSggcLogFormList2.get(i).setNextOpUserPhone(temp.getOpUserPhone());
                    }
            	}
            	hbList.addAll(gxSggcLogFormList);
            	hbList.addAll(gxSggcLogFormList2);
            	Collections.sort(hbList,new Comparator<GxSggcLogForm>(){  
                    public int compare(GxSggcLogForm arg0, GxSggcLogForm arg1) {  
                        return arg0.getTime().compareTo(arg1.getTime());  
                    }  
                });
            	if(hbList!=null && hbList.size()>0){
            		if(hbList.get(0).getTime() == 0){
            			GxSggcLogForm logFrom=hbList.get(0);
            			hbList.remove(0);
            			hbList.add(logFrom);
            		}
            		//撤回不显示下环节只显示经办人
            		for(int i=0 ; i<hbList.size() ;i++){
            			if("撤回".equals(hbList.get(i).getLinkName())){
            				hbList.get(i).setOpUser(hbList.get(i).getNextOpUser());
            				hbList.get(i).setOpUserPhone(hbList.get(i).getNextOpUserPhone());
            				hbList.get(i).setNextOpUser("");
            				hbList.get(i).setNextOpUserPhone("");
            			}
            		}
            	}
            	jsonObject.put("code", 200);
            	jsonObject.put("data", hbList);
            	jsonObject.put("message", "");
            	/************获取环节处理信息结束***************/
        	}catch(Exception e){
        		jsonObject.put("code", 500);
            	//jsonObject.put("data", null);
            	jsonObject.put("message", e.getMessage());
            	e.printStackTrace();
        	}
        }else{
        	jsonObject.put("code", 404);
        	//jsonObject.put("data", null);
        	jsonObject.put("message", "参数缺失");
        }
        return jsonObject.toString();
    }
	
	/**
     * RGM流程检验是否是管理者
     * @param request
     * @return
     * @throws Exception
     */
    
//    @RequestMapping("/checkUserForRgm")
//    public String checkUserForRgm(HttpServletRequest request) throws Exception{
//    	String procInstId = request.getParameter("procInstId");
//    	String userCode = request.getParameter("userCode");
//        String activityName = request.getParameter("activityName");
//    	JSONObject jsonObject=new JSONObject();
//    	if(procInstId!=null && procInstId.contains("GX_XCYH_RGRM") && "sendTask".equals(activityName)){//管理
//			 OpuOmUser omForm=omUserService.getUserByUserCode(userCode);
//			 List<Long> roleList = omUserService.getRoleByUserId(omForm!=null?omForm.getUserId():null);
//	         boolean roleFlag = checkExist(roleList);//判断是否存在RgRm
//	         if (roleFlag) {//存在的话，不允许发送，只能是R0才能发送到下个环节
//	        	 jsonObject.put("success", true);
//	         }else {
//	        	jsonObject.put("success", false);
//			 }
//		}
//		return jsonObject.toString();
//    }
    
    /**
     * 删除
     * @return
     * @throws Exception
     */
    
    @RequestMapping("/deleteProcessInstance")
    public void deleteProcessInstance(String id) throws Exception {
		this.runtimeService.deleteProcessInstance(id, "useless data");
    }
    /**
     * AES加密
     * @param request
     * @return
     * @throws Exception
     */
    
    @RequestMapping("/AESEncode")
    public String AESEncode(HttpServletRequest request) throws Exception {
    	JSONObject jsonObject = new JSONObject();
    	//String encodeRules=request.getParameter("rules");
    	String content = request.getParameter("content");
    	String result = SymmetricEncoder.AESEncode("augur2017", content);
    	if(result==null){
    		jsonObject.put("code",500);
    	}
    	jsonObject.put("code",200);
		jsonObject.put("data",result);
		jsonObject.put("message","");
		return jsonObject.toString();
    }

    @RequestMapping("/getDZbSummary2")
    public List<Map> getDZbSummary2() throws Exception{
//        bpmTaskService.getRuTaskByTaskId()
		GxProblemReport gxProblemReport = new GxProblemReport();
		gxProblemReport.setLoginname(SecurityContext.getCurrentUserName());
		gxProblemReport.setSfjb(0);
		return gxProblemReportService.getDZbSummary(gxProblemReport);
	}
	@RequestMapping(value = "/getDZbSummary",produces = "application/json;charset=UTF-8")
    public String getDZbSummary(String pageNo,String pageSize) throws Exception{
        int pageNoInt=1;
        int pageSizeInt=10;
        if(pageNo!=null&&!"".equals(pageNo)){
            pageNoInt = Integer.parseInt(pageNo);
        }
        if(pageSize!=null&&!"".equals(pageSize)){
            pageSizeInt = Integer.parseInt(pageSize);
        }
		return gxProblemReportService.getDZbSummary(SecurityContext.getCurrentUserName(),pageNoInt,pageSizeInt);
	}
    @RequestMapping(value = "/getYbSummary",produces = "application/json;charset=UTF-8")
    public String getYbSummary(String pageNo,String pageSize) throws Exception{
    	int pageNoInt=1;
    	int pageSizeInt=10;
    	if(pageNo!=null&&!"".equals(pageNo)){
    		pageNoInt = Integer.parseInt(pageNo);
		}
    	if(pageSize!=null&&!"".equals(pageSize)){
			pageSizeInt = Integer.parseInt(pageSize);
		}
		return gxProblemReportService.getYbSummary(SecurityContext.getCurrentUserName(),pageNoInt,pageSizeInt);
	}

    /**
     * 问题上报办结列表
     * @param pageNo
     * @param pageSize
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getBjSummary",produces = "application/json;charset=UTF-8")
    public String getBjSummary(String pageNo,String pageSize) throws Exception{
        int pageNoInt=1;
        int pageSizeInt=10;
        if(pageNo!=null&&!"".equals(pageNo)){
            pageNoInt = Integer.parseInt(pageNo);
        }
        if(pageSize!=null&&!"".equals(pageSize)){
            pageSizeInt = Integer.parseInt(pageSize);
        }
		return gxProblemReportService.getBjSummary(SecurityContext.getCurrentUserName(),pageNoInt,pageSizeInt);
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
    //获取问题上报菜单信息
    @RequestMapping(value = "/getTabsData",produces = "application/json;charset=UTF-8")
    public List<Map<String,Object>> getTabsData()throws Exception{
        return gxProblemReportService.getTabsData();
    }
    //发送代办人
	//GX_XCYH_RGRM_TEST 任务派单=task1535532389786,任务处置=task1535532395450,任务复核=task1535532398403,巡查员复核=task1535532400971,复核=task1535532374172
    //GX_XCYH 问题上报=problemReport,任务派单=sendTask,任务处置=getTask,任务复核=rwfh
	@RequestMapping(value = "/getAssigneeRangeTree.do",produces = "application/json;charset=UTF-8")
    public List<Map<String,Object>> getAssigneeRangeTree(String assigneeRangeKey, String procdefKey,String procInstId,String taskCode)throws Exception{
        List<Map> result = new ArrayList();
		List<OpuOmUser> tempList=null;
        if(PROCDEF_KEY_RGRM.equals(procdefKey)){
			String rwpdUser = gxProblemReportService.getAssigneeByTaskCode(procInstId,"task1535532389786");
			List<OpuOmOrg> orgList = gxProblemReportService.getOrgsByLoginName(rwpdUser);
			tempList = filterUser(assigneeRangeKey,orgList);
        }else{
        	String baseUser=null;
			if("getTask".equals(taskCode)){
				baseUser=gxProblemReportService.getAssigneeByTaskCode(procInstId,"sendTask");
				List<OpuOmOrg> orgList = gxProblemReportService.getOrgsByLoginName(baseUser);
				tempList =filterUser(assigneeRangeKey,orgList);
			}else{
				baseUser=gxProblemReportService.getAssigneeByTaskCode(procInstId,"problemReport");
				List<OpuOmOrg> orgList = gxProblemReportService.getJlOrgsByLoginName(baseUser);
				tempList =filterUser(assigneeRangeKey,orgList);
			}
        }
		return createResultTree(tempList);
    }
	List<OpuOmUser> filterUser(String assigneeRangeKey,List<OpuOmOrg> orgList) throws Exception{
		Map<String, List> map=bpmTaskService.getAssigneeRangeTreeByRangeKey(assigneeRangeKey);
		orgList=filterOrg(map,orgList);
		List<OpuOmUser> userList = getUserByResult(map);
		List<OpuOmUser> tempList = new ArrayList<OpuOmUser>();
		Set<String> set  = new HashSet<String>();
		for(OpuOmUser user:userList){
			boolean flag = false;
			for(OpuOmOrg org:orgList){
				if(org.getOrgId().equals(user.getOrgId())){
					flag = true;
					break;
				}
			}
			if(flag){
			    if(!set.contains(user.getUserId())){
                    set.add(user.getUserId());
                    tempList.add(user);
                }
			}
		}
		return tempList;
	}
	List<OpuOmOrg> filterOrg(Map<String,List> map,List<OpuOmOrg> orgList){
		List<OpuOmOrg> tempList=map.get("$ORG");
		if(tempList==null||tempList.size()==0){
			return orgList;
		}
		List<OpuOmOrg> result = new ArrayList<OpuOmOrg>();
		for(OpuOmOrg org:orgList){
			boolean flag=false;
			for(OpuOmOrg o:tempList){
				if(o.getOrgId().equals(org.getOrgId())){
					flag=true;
					break;
				}
			}
			if(!flag){
				result.add(org);
			}
		}
		return result;
	}
    private List<OpuOmUser> getUserByResult(Map<String, List> map){
		List<OpuOmUser> result = new ArrayList<OpuOmUser>();
		try{
			for (Map.Entry<String, List> entry : map.entrySet()) {
				String key = entry.getKey();
				if ("$ORG".equals(key)||"$POS".equals(key)) {
					List<OpuOmOrg> orgList = (List) map.get(key);
					Iterator orgIter = orgList.iterator();
					while (orgIter.hasNext()) {
						OpuOmOrg ooo = (OpuOmOrg) orgIter.next();
						if (ooo != null) {
							result.addAll(gxProblemReportService.getUserAndSubNodeById(key,ooo.getOrgId()));
						}
					}
				}else if ("$USER".equals(key)){
					result.addAll((List) map.get(key));
				}
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		return result;
	}
   private List<Map<String,Object>> createResultTree(List<OpuOmUser> userList) {
        ArrayList result = new ArrayList();
        try {
			List<Map<String,Object>> subList = new ArrayList(userList.size());
			Iterator var14 = userList.iterator();
			while (var14.hasNext()) {
				OpuOmUser oou = (OpuOmUser) var14.next();
				if (oou != null) {
					Map map4 = new HashMap();
					map4.put("id", oou.getLoginName());
					map4.put("text", oou.getUserName());
					map4.put("children", false);
					map4.put("icon", "fa fa-user-md");
					subList.add(map4);
				}
			}
			Map map3 = new HashMap();
			Map state = new HashMap();
			state.put("opened", true);
			map3.put("id", "USER_NODE");
			map3.put("text", "用户");
			map3.put("icon", "fa fa-user");
			map3.put("state", state);
			map3.put("children", subList);
			result.add(map3);
		}catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

	/**
	 * 获取办理经过
	 * */
	@RequestMapping("/getTraceInfo")
	public Result getTraceInfo(String taskId, String id){
		try {
			Map map = new HashMap();
			List<Map> list = gxProblemReportService.getTraceInfo(taskId);
			return new Result(true,list);
		} catch (Exception e) {
			e.printStackTrace();
			return new Result(false,e.getMessage());
		}
	}
}

