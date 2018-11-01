package com.augurit.awater.dri.rest;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.augurit.agcloud.bpm.common.domain.BpmDestTaskConfig;
import com.augurit.agcloud.bsc.domain.BscAttForm;
import com.augurit.agcloud.bsc.domain.BscDicCodeItem;
import com.augurit.agcloud.bsc.sc.init.service.BscInitService;
import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.framework.security.user.OpusLoginUser;
import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.org.PsxjProperties;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.org.rest.service.IOmRsRoleRestService;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.agcloud.org.service.IBpmService;
import com.augurit.awater.bpm.sggc.service.IGxSggcService;
import com.augurit.awater.bpm.sggc.web.form.GxSggcForm;
import com.augurit.awater.bpm.sggc.web.form.GxSggcLogForm;
import com.augurit.awater.bpm.xcyh.report.domain.GxProblemReport;
import com.augurit.awater.bpm.xcyh.report.service.IGxProblemReportService;
import com.augurit.awater.bpm.xcyh.report.web.WfrRestController;
import com.augurit.awater.bpm.xcyh.report.web.form.*;
import com.augurit.awater.dri.problem_report.correct_mark.service.ICorrectMarkService;
import com.augurit.awater.dri.problem_report.correct_mark.web.form.CorrectMarkForm;
import com.augurit.awater.dri.reportUpload.service.IReportUploadService;
import com.augurit.awater.dri.utils.Result;
import com.augurit.awater.dri.utils.ResultForm;
import com.augurit.awater.util.ThirdUtils;
import com.augurit.awater.util.data.SymmetricEncoder;
import com.augurit.awater.util.file.SysFileUtils;
import com.common.util.Common;
import net.sf.json.JSONObject;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.lang3.StringUtils;
import org.flowable.engine.HistoryService;
import org.flowable.engine.TaskService;
import org.flowable.engine.history.HistoricActivityInstance;
import org.flowable.task.api.Task;
import org.flowable.task.api.history.HistoricTaskInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.augurit.awater.common.page.Page;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.*;

@RequestMapping("/rest/report")
@Controller
public class ReportRestController {
	@Autowired
	private IBpmService bpmService;
	/**flowable*/
	@Autowired
	private HistoryService historyService;
	@Autowired
	private TaskService taskService;
	@Autowired
	private IGxProblemReportService gxProblemReportService;
	@Autowired
	private IGxSggcService gxSggcService;
	@Autowired
	private PsxjProperties psxjProperties;
	@Autowired
	protected BscInitService bscInitService;
	@Autowired
	private IOmUserInfoRestService omUserInfoRestService;


	@Autowired
	private IReportUploadService reportUploadService;
	@Autowired
	private IOmUserInfoRestService userInfoRestService;
	@Autowired
	private IOmRsRoleRestService rsRoleRestService;
	@Autowired
	private IOmOrgRestService omOrgRestService;
	@Autowired
	private ICorrectMarkService correctMarkService;

	/** 图片上传地址 */
	private String uploadPath = ThirdUtils.getInPath()+"\\ReportFile\\"; //图片的物理路径
	private String requestPath = "/img/ReportFile/"; //图片的请求路径


	@RequestMapping(value = "/testCloud",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String testCloud(){
		CorrectMarkForm corm = new CorrectMarkForm();
		corm.setMarkPerson("test");
		corm.setMarkTime(new Date());
		correctMarkService.save(corm);
		//Page page = new Page();
		//return JSONObject.fromObject(new ResultForm(200,correctMarkService.search(page,null))).toString();
		return JSON.toJSONString(corm);
		//return JSON.toJSONString(new ResultForm(200,reportUploadService.search(page,null)));
		//return JSON.toJSONString(new ResultForm(200,correctMarkService.toPastNowDay(null)));
	}

	@RequestMapping(value = "/uploadFile",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String uploadInfo(HttpServletRequest req ) throws Exception {
		JSONObject json = new JSONObject();
		Format format = new SimpleDateFormat("yyyyMMdd");
		boolean isMultipar= ServletFileUpload.isMultipartContent(req);
		Map<String,Object> form = new HashMap<>();
		String objectId=req.getParameter("objectId");
		String layerName=req.getParameter("layerName");
		form.put("objectId", objectId);
		form.put("layerName", layerName);
		if(isMultipar){
			DiskFileItemFactory factory = new DiskFileItemFactory();
			factory.setSizeThreshold(1024*1024);
			factory.setRepository(Paths.get(uploadPath).toFile());
			ServletFileUpload upload = new ServletFileUpload(factory);
			upload.setFileSizeMax(1024*1024*20);
			upload.setSizeMax(1024*1024*22);
			upload.setHeaderEncoding("utf-8");
			List<FileItem> listFiles = upload.parseRequest(req);
			if(null==form.get("objectId") || null==form.get("layerName") ) {
				json.put("status", 300);
				json.put("message", "格式不正确!");
				return json.toString();
			}
			int fi=0;
			for(FileItem item: listFiles){
				if(!item.isFormField()){
					//String fileName = item.getFieldName();
					String name = item.getName();
					String type = item.getContentType();
					form.put("type", type);
					form.put("attachName", name);
					String filepaths = uploadPath+"imgReport\\"+format.format(new Date());
					File f = new File(filepaths);
					if(!f.isDirectory()){
						f.mkdirs();
					}
					String filecode= SysFileUtils.nextFileCode();
					String fileNames = filecode+"_"+name;
					String filePath = filepaths+"\\"+fileNames;
					f = new File(filePath);
					item.write(f);
					form.put("uploadTime", new Date());
					String filepaths2= requestPath+"imgReport/"+format.format(new Date())+"/"+fileNames;
					form.put("filePath", filepaths2);
					reportUploadService.saveForm(form);
					fi++;
					item.delete();
				}
			}
			json.put("status", 200);
			json.put("message", "成功上传"+fi+"个附件!");
		}else{
			json.put("status", 300);
			json.put("message", "不是文件类型!");
		}
		return json.toString();
	}
	
	@RequestMapping(value = "/getFiles",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String getFiles(HttpServletRequest req) {
		String path = req.getScheme() +"://" + req.getServerName()
				 + ":" +req.getServerPort() ;
		String objectIds = req.getParameter("objectId");
		String layerNames = req.getParameter("layerName");
		return reportUploadService.getFiles(path,objectIds,layerNames);
	}

	@RequestMapping(value = "/deleteFile",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String deleteFile(HttpServletRequest req)  {
		String ids = req.getParameter("id");
		String attachName = req.getParameter("attachName");
		Long id = null;
		if(StringUtils.isNotBlank(ids)){
			id=Long.parseLong(ids);
		}
		return id!=null ? reportUploadService.deleteFile(id,attachName) : "500";
	}
	/**
	 * 获取问题类型列表
	 * */
	@RequestMapping(value = "/queryProblemTree")
	@ResponseBody
	public Result queryProblemTree(HttpServletRequest req,String orgIds) throws IOException {
		List<Map> list = new ArrayList<>();
		Map<String,Object> map = new HashMap<>();
		try {
			String orgId = null;
			try {
				if(orgIds==null){
					orgId = SecurityContext.getCurrentOrgId();
				}else{
					orgId=orgIds;
				}
			} catch (Exception e) {
				e.printStackTrace();
				return new Result(false,"机构信息获取失败!");
			}
			OpuOmOrg org = omOrgRestService.getOrgByOrgId(orgId);
			while (org.getParentOrgId()!=null){
				org = omOrgRestService.getOrgByOrgId(org.getParentOrgId());
			}
			List<BscDicCodeItem> listCodes = rsRoleRestService.getItemTreeByTypeCode("dri-problem", org.getId());
			for (BscDicCodeItem item: listCodes){
				Map<String,Object> p = new HashMap<>();
				p.put("code",item.getItemCode());
				p.put("name",item.getItemName());
				List<BscDicCodeItem> childrens = item.getChildren();
				List<Map<String,Object>> l = new ArrayList<>();
				if(childrens!=null && childrens.size()>0){
					for(BscDicCodeItem child:childrens){
						Map<String,Object> c = new HashMap<>();
						c.put("code",child.getItemCode());
						c.put("pcode",item.getItemCode());
						c.put("name",child.getItemName());
						l.add(c);
					}
				}
				p.put("data",l);
				list.add(p);
			}
			return new Result(true,list);
		} catch (Exception e) {
			e.printStackTrace();
			return new Result(false,e.getMessage());
		}
	}
	/**
	 * 获取问题上报的数据字典（需要登录）
	 * */
	@RequestMapping(value = "/listWtsbTree")
	@ResponseBody
	public Map listWtsbTree(HttpServletRequest req) throws IOException {
		Map map = new HashMap();
		List<Map> listChilds = new ArrayList();
		List<Map> list = new ArrayList();
		try {
			String orgId = SecurityContext.getCurrentOrgId();
			OpuOmOrg org = omOrgRestService.getOrgByOrgId(orgId);
			while (org.getParentOrgId()!=null){
				org = omOrgRestService.getOrgByOrgId(org.getParentOrgId());
			}
			List<BscDicCodeItem> listCodes = rsRoleRestService.getItemTreeByTypeCode("dri-problem", org.getId());
			for (BscDicCodeItem item: listCodes){
				Map<String,Object> p = new HashMap<>();
				p.put("code",item.getItemCode());
				p.put("name",item.getItemName());
				List<BscDicCodeItem> childrens = item.getChildren();
				if(childrens==null || childrens.size()<1)
					continue;
				for(BscDicCodeItem child:childrens){
					Map<String,Object> c = new HashMap<>();
					c.put("code",child.getItemCode());
					c.put("parenttypecode",item.getItemCode());
					c.put("name",child.getItemName());
					listChilds.add(c);
				}
				list.add(p);
			}
			map.put("wtlx3",listChilds);
			map.put("facility_type",list);
			return map;
		} catch (Exception e) {
			e.printStackTrace();
			map.put("success",false);
			map.put("msg",e.getMessage());
			return map;
		}

	}


	/**
	 * 获取环节处理和施工日志与评论
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/getTraceRecordAndSggcLogList")
	@ResponseBody
	public ResultForm getTraceRecordAndSggcLogList(HttpServletRequest request) {
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
				return new ResultForm(200,gxSggcLogFormList);
			}catch (Exception e){
				e.printStackTrace();
				return new ResultForm(500,e.getMessage());
			}
		}else{
			return new ResultForm(200,"参数缺失");
		}
	}
	/***
	 * 通过事件id获取事件详情
	 * */
	@RequestMapping(value="/getReportDetail")
	@ResponseBody
	public ResultForm getReportDetail(HttpServletRequest request) throws Exception{
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
				GxProblemReportForm gxProblemReportForm= GxProblemReportConvertor.convertVoToForm(gxForm);
				if(gxProblemReportForm!=null){
					gxProblemReportForm.setState(gxProblemReportService.getState(gxProblemReportForm.getId()));
					gxProblemReportForm.setSbsj2(gxProblemReportForm.getSbsj()==null?0:gxProblemReportForm.getSbsj().getTime());
					gxProblemReportForm.setSbr(gxProblemReportForm.getLoginname()==null?gxProblemReportForm.getSbr():gxSggcService.getAllName(gxProblemReportForm.getLoginname()));
					List<BscAttForm> listAtt =  getImages(gxForm.getId(),startTask,request);
					//查找附件信息
					if(listAtt!=null && listAtt.size()>0){
						gxProblemReportForm.setFiles2(convetBascToDetFile(listAtt));
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
						return new ResultForm(200,dataForm);
					}else{
						//如果没有传taskId，就是自行处理的
						if(!StringUtils.isNotBlank(taskId)){
							DetailDataForm dataForm = new DetailDataForm();
							DetailEventForm eventForm = GxProblemReportConvertor.formToDetail(gxProblemReportForm);
							dataForm.setEvent(eventForm);
							return new ResultForm(200,dataForm);
						}
						HistoricTaskInstance hisTasks = null;
						hisTasks =  this.historyService.createHistoricTaskInstanceQuery().taskId(taskId).singleResult();
						if(hisTasks==null){
							return new ResultForm(400,false,"任务不存在");
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
							return new ResultForm(200,dataForm);
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
						return new ResultForm(200,dataForm);
					}
				}else{
					return new ResultForm(200,null);
				}
			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
				return new ResultForm(500,e.getMessage());
			}
		}else{
			return new ResultForm(404,"参数缺失!");
		}
	}

	/**
	 * 获取工作流附件图片
	 * */
	public List<BscAttForm> getImages(String masterEntityKey,String taskId,HttpServletRequest request) throws Exception {
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
			List<BscAttForm> sysList=gxProblemReportService.getBscAttByTableNameAndPkNameAndRecordId("DRI_GX_PROBLEM_REPORT",masterEntityKey,taskId,"406");
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