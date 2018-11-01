package com.augurit.awater.bpm.xcyh.report.web;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.augurit.agcloud.common.controller.BaseController;
import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.opus.common.domain.OpuOmUser;
import com.augurit.agcloud.opus.common.domain.OpuRsRole;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.org.rest.service.IOmRsRoleRestService;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.awater.bpm.sggc.service.IGxSggcService;
import com.augurit.awater.bpm.xcyh.reassign.service.IReassignProcessService;
import com.augurit.awater.bpm.xcyh.report.domain.GxProblemReport;
import com.augurit.awater.bpm.xcyh.report.service.IGxProblemReportService;
import com.augurit.awater.dri.problem_report.correct_mark.service.ICorrectMarkService;
import com.augurit.awater.dri.utils.Result;
import net.sf.json.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/gxProblemrReport")
public class GxProblemController extends BaseController<GxProblemReport>{

	@Autowired
	private IGxProblemReportService gxProblemReportService;
	@Autowired
	private IGxSggcService gxSggcService;
	@Autowired
	private IReassignProcessService reassignProcessService;
	@Autowired
    private IOmOrgRestService omOrgRestService;
	@Autowired
    private IOmRsRoleRestService omRsRoleRestService;
	@Autowired
    private IOmUserInfoRestService omUserInfoRestService;
	@Autowired
    private ICorrectMarkService correctMarkService;

	/**
	 * 通过交办获取问题上报
	 * */
	@RequestMapping(value = "/getWtsbForJb",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String getWtsbForJb(GxProblemReport form){
		JSONObject jsonObject = new JSONObject();
		List<GxProblemReport> list=gxProblemReportService.getByObjectId(form.getObjectId());
		if(list!=null && list.size()>0){
			form=list.get(0);
			jsonObject.put("thisId", form.getId());
			Map<String, String> map=gxProblemReportService.searchGzlData(form.getId());
			if(map!=null && map.size()>0){
				for(String s:map.keySet()){
					jsonObject.put(s, map.get(s));
				}
			}
		}
		return jsonObject.toString();
	}
	/**
	 *reportStatistics.js
	 *上报统计
	 *按人统计
	 * */
	@RequestMapping(value = "/statisticsForPerson",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String statisticsForPerson(GxProblemReport form,String startTime,String endTime){
		com.augurit.agcloud.framework.security.user.OpuOmUser user = SecurityContext.getCurrentUser();
		Map<String,Object> map = new HashMap();
		if (StringUtils.isNotBlank(startTime))
			map.put("startTime", new Date(Long.parseLong(startTime)));
		if (StringUtils.isNotBlank(endTime))
			map.put("endTime", new Date(Long.parseLong(endTime)));
		return gxProblemReportService.statisticsForPerson(form,map);
	}
	/**
	 *reportStatistics.js
	 *上报统计
	 *按区统计
	 * */
	@RequestMapping(value = "/statisticsForArea",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String statisticsForArea(GxProblemReport form,String startTime,String endTime){
		com.augurit.agcloud.framework.security.user.OpuOmUser userForm =  SecurityContext.getCurrentUser();
		Map<String,Object> map = new HashMap();
		if (StringUtils.isNotBlank(startTime))
			map.put("startTime", new Date(Long.parseLong(startTime)));
		if (StringUtils.isNotBlank(endTime))
			map.put("endTime", new Date(Long.parseLong(endTime)));
		return gxProblemReportService.statisticsForArea(form,map);
	}

	/**
	 * 根据当前登录人获取当前区域的问题上报
	 * */
	@RequestMapping(value = "/getByLoginName",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public Result  getByLoginName(){
		com.augurit.agcloud.framework.security.user.OpuOmUser userForm =  SecurityContext.getCurrentUser();
		List<GxProblemReport> listReport = gxProblemReportService.getByLoginName(userForm.getLoginName());
		return new Result(true,listReport);
	}
	/**
	 * 处理数据字典有多个值
	 * @param dicAry
	 * @param value
	 * @return
	 */
	@RequestMapping(value = "/getDicName",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String getDicName(List<Map<String,String>> dicAry,String value){
		if (dicAry != null && value != null) {
	        if (value.indexOf(",") != -1) {
	        	String disname = "";
	            String[] checkboxAry = value.split(",");
	            for (String k : checkboxAry) {
	            	for (Map<String,String> j : dicAry) {
	                    if (j.get("code").equals(k)) {
	                        disname += j.get("name") + ",";
	                        break;//满足一个就弹出
	                    }
	                }
	            }
	            return disname.substring(0, disname.length() - 1);
	        } else {
	            for (Map<String,String> j : dicAry) {
	                if (j.get("code").equals(value)) {
	                    return j.get("name");
	                }
	            }
	            return "";
	        }
	    }else{
	    	return "";
	    }
	}
	/**
	 * 问题上报导出Word
	 * @return
	 * @throws Exception

	@RequestMapping(value = "exportWtsb",produces="text/plain;charset=UTF-8")
	@ResponseBody*/
	/*public Result exportWtsb(String id) throws Exception{
		Map<String, Object> map = new HashMap<String, Object>();
		String sjid = id.toString();//获取上报事件id
		String filepath = ConfigProperties.getByKey("filePath")+"\\";
        if(!Common.isCheckNull(sjid)){
        	try{
        		//问题上报基本信息
        		GxProblemReportForm gxProblemReportForm=gxProblemReportService.get(Long.valueOf(sjid));
            	if(gxProblemReportForm!=null){
            		//gxProblemReportForm.setState(gxProblemReportService.getState(gxProblemReportForm.getId()));
            		//gxProblemReportForm.setSbsj2(gxProblemReportForm.getSbsj()==null?0:gxProblemReportForm.getSbsj().getTime());
            		//gxProblemReportForm.setSbr(gxProblemReportForm.getLoginname()==null?gxProblemReportForm.getSbr():gxSggcService.getAllName(gxProblemReportForm.getLoginname()));
            		map.put("sbr", gxProblemReportForm.getSbr());
            		map.put("sbsj", gxProblemReportForm.getSbsj());
            		map.put("sbdw", gxProblemReportForm.getParentOrgName());
            		Metacodeitem metacodeitem =metacodetypeService.getMetacodeitemByTypeCodeAndCode("facility_type",gxProblemReportForm.getSslx());
            		map.put("sslx", metacodeitem==null?"":metacodeitem.getName());
            		map.put("wtlx", getDicName(metacodetypeService.getDicdataByTypecode("wtlx3"),gxProblemReportForm.getBhlx()));
            		metacodeitem = metacodetypeService.getMetacodeitemByTypeCodeAndCode("emergency_degree",gxProblemReportForm.getJjcd());
            		map.put("jjcd", metacodeitem==null?"":metacodeitem.getName());
            		map.put("wtdd", gxProblemReportForm.getSzwz());
            		map.put("wtmx", gxProblemReportForm.getWtms());
            		//查找附件信息
            		List<Map<String, Object>> list=new ArrayList<Map<String, Object>>();
    	        	List<SysFileForm> sysList=sysFileService.getSysFilesByEntityAndEntityId("GxProblemReport", gxProblemReportForm.getId().toString());
    	        	if (sysList!=null && sysList.size()>0) {
    	        		String urlAll=getRequest().getRequestURL().toString() ;
    	        		String url="";//图片路径处理
    	        		if (url!=null) {
    	        			String[] mainurl=urlAll.split("/ag");
    	        			if (mainurl!=null && mainurl.length>0) {
    	        				url=mainurl[0]+"/img/imgSmall/";
    						}
    	        		}
    	        		Map<String, Object> mapimg = null;
    	        		for (SysFileForm s:sysList) {
    	        			mapimg = new HashMap<String, Object>();
    	        			mapimg.put("name", s.getFileName());
    	        			mapimg.put("height", WordUtils.getImageHeight(filepath+s.getFileCode()+"_"+s.getFileName()));
    	        			mapimg.put("img", WordUtils.getImageBase(filepath+s.getFileCode()+"_"+s.getFileName()));
    	        			list.add(mapimg);
    					}
    				}
    	        	map.put("imgs", list);
            	}
        		//WfContextTaskForm instance = gxProblemReportService.getWfContextTaskForm(Long.parseLong(dbid));
        		*//************获取施工日志与评论开始***************//*
        		GxSggcForm form =new GxSggcForm();
                form.setSjid(Long.parseLong(sjid));
        		List<GxSggcForm> list = gxSggcService.search(form);
        		List<GxSggcLogForm> gxSggcLogFormList = new ArrayList<GxSggcLogForm>();
	        	GxSggcLogForm tempLogForm = null;
            	if(list!=null && list.size()>0){
            		for(GxSggcForm gxSggcForm: list) {
						GxSggcLogForm gxSggcLogForm = new GxSggcLogForm();
						gxSggcLogForm.setContent(gxSggcForm.getContent());
						gxSggcLogForm.setId(gxSggcForm.getId());
						gxSggcLogForm.setLx(gxSggcForm.getLx());
						if ("0".equals(gxSggcForm.getLx())) {
							gxSggcLogForm.setLinkName("施工日志");
						} else if ("1".equals(gxSggcForm.getLx())) {
							gxSggcLogForm.setLinkName("管理层意见");
						} else if ("2".equals(gxSggcForm.getLx())) {
							gxSggcLogForm.setLinkName("自行处理（已结束）");
						}
						gxSggcLogForm.setSgjd(gxSggcForm.getSgjd());
						gxSggcLogForm.setSjid(Long.parseLong(sjid));
						gxSggcLogForm.setOpUser(gxSggcForm.getLoginname() == null ? gxSggcForm.getUsername() : gxSggcService.getAllName(gxSggcForm.getLoginname()));
            			if(gxSggcForm.getLoginname()!=null){
            				OmUserForm omUserForm = omUserService.getUser(gxSggcForm.getLoginname());
            				if(omUserForm!=null){
            					gxSggcLogForm.setOpUserPhone(omUserForm.getMobile());
            				}
            			}
            			gxSggcLogForm.setTime(gxSggcForm.getTime()==null?0:gxSggcForm.getTime().getTime());
            			//查找附件信息
			        	List<SysFileForm> sysList=sysFileService.getSysFilesByEntityAndEntityId("awater_swj.gx_sggc", gxSggcForm.getId().toString());
			        	if (sysList!=null && sysList.size()>0) {
			        		List<DetailFilesForm> fileList=new ArrayList<>();
			        		*//**String urlAll=getRequest().getRequestURL().toString() ;
			        		String url="";//图片路径处理
			        		if (url!=null) {
			        			String[] mainurl=urlAll.split("/ag");
			        			if (mainurl!=null && mainurl.length>0) {
			        				url=mainurl[0]+"/img/imgSmall/";
								}
			        		}*//*
			        		for (SysFileForm s:sysList) {
								DetailFilesForm filesForm=new DetailFilesForm();
								filesForm.setName(s.getFileName());
								filesForm.setMime(s.getFileFormat());
								filesForm.setPath(filepath+s.getFileCode()+"_"+s.getFileName()+"."+s.getFileFormat());
								//这里要传Http路径
								filesForm.setTime(s.getCdt()==null?0:s.getCdt().getTime());
								fileList.add(filesForm);
							}
			        		gxSggcLogForm.setFiles(fileList);
						}
			        	gxSggcLogFormList.add(gxSggcLogForm);

            		}
            	}
            	*//************获取施工日志与评论结束***************//*
						*//************获取环节处理信息开始***************//*
						JSONArray hjxxArray = gxSggcService.searchJbpm4HistTaskByEntityId(Long.parseLong(sjid));
						//JSONArray htyjJson=new JSONArray();
						List<GxSggcLogForm> gxSggcLogFormList2 = new ArrayList<GxSggcLogForm>();
						if (hjxxArray != null && hjxxArray.size() > 0) {
							for (Object t : hjxxArray) {
								JSONObject j = (JSONObject) t;
								//OmUserForm omUserForm = "".equals(j.getString("opUser"))?null:omUserService.userNameOrCodeToForm(j.getString("opUser"));
								String dbId = j.getString("dbId");
								GxSggcLogForm gxSggcLogForm = new GxSggcLogForm();
								gxSggcLogForm.setLinkName(j.getString("linkName"));
								gxSggcLogForm.setOpUser(j.getString("opUser"));
								gxSggcLogForm.setOpUserPhone(j.getString("opUserPhone"));
								gxSggcLogForm.setContent(j.getString("opinion"));
								gxSggcLogForm.setNextOpUser(j.getString("nextOpUser"));
								gxSggcLogForm.setNextOpUserPhone(j.getString("nextOpUserPhone"));
								gxSggcLogForm.setReassignComments(j.getString("reassignComments"));
								if (j.get("time") != "") {
									gxSggcLogForm.setTime(Long.parseLong(j.get("time").toString()));
								} else {
									gxSggcLogForm.setTime(0l);
								}

								*//***begin转派过程****//*
								List<GxSggcLogForm> tempFormList = new ArrayList<GxSggcLogForm>();
								List<ReassignProcessForm> reassignList = reassignProcessService.getReassignByDbid(Common.checkLong(dbId));
								if (reassignList != null && reassignList.size() > 0) {
									for (ReassignProcessForm reassignProcessForm : reassignList) {
										GxSggcLogForm gxSggcLogReassignForm = new GxSggcLogForm();
										gxSggcLogReassignForm.setLinkName(reassignProcessForm.getActivitychinesename());
										//获取单位加姓名
										gxSggcLogReassignForm.setOpUser(reassignProcessForm.getAssignee() == null ? "" : gxSggcService.getAllName(reassignProcessForm.getAssignee()));
										OmUserForm assigneeUserfrom = omUserService.getUser(reassignProcessForm.getAssignee());
										gxSggcLogReassignForm.setOpUserPhone(assigneeUserfrom == null ? reassignProcessForm.getAssignee() : assigneeUserfrom.getMobile());
										//获取单位加姓名
										gxSggcLogReassignForm.setNextOpUser(reassignProcessForm.getReassign() == null ? "" : gxSggcService.getAllName(reassignProcessForm.getReassign()));
										OmUserForm reassignUserfrom = omUserService.getUser(reassignProcessForm.getReassign());
										gxSggcLogReassignForm.setNextOpUserPhone(reassignUserfrom == null ? reassignProcessForm.getReassign() : reassignUserfrom.getMobile());
										//gxSggcLogReassignForm.setReassignComments(reassignProcessForm.getReassigncomments());
										gxSggcLogReassignForm.setContent(reassignProcessForm.getReassigncomments());
										if (reassignProcessForm.getReassigntime() != null) {
											gxSggcLogReassignForm.setTime(reassignProcessForm.getReassigntime().getTime());
										} else {
											gxSggcLogReassignForm.setTime(0l);
										}
										tempFormList.add(gxSggcLogReassignForm);
									}
								}
								gxSggcLogFormList2.addAll(tempFormList);
								gxSggcLogFormList2.add(gxSggcLogForm);
								*//***end转派过程****//*

								//获取附件
								List<SysFileForm> sysList = sysFileService.getSysFilesByEntityAndEntityId("JDFJ", j.getString("dbId"));
								if (sysList != null && sysList.size() > 0) {
									List<DetailFilesForm> fileList = new ArrayList<>();
									for (SysFileForm s : sysList) {
										DetailFilesForm filesForm = new DetailFilesForm();
										filesForm.setName(s.getFileName());
										filesForm.setMime(s.getFileFormat());
										filesForm.setPath(filepath + s.getFileCode() + "_" + s.getFileName());
										//这里要传Http路径
										filesForm.setTime(s.getCdt() == null ? 0 : s.getCdt().getTime());
										fileList.add(filesForm);
									}
									gxSggcLogForm.setFiles(fileList);
								}
							}
						}
						List<GxSggcLogForm> hbList = new ArrayList<GxSggcLogForm>();
						Collections.sort(gxSggcLogFormList2, new Comparator<GxSggcLogForm>() {
							public int compare(GxSggcLogForm arg0, GxSggcLogForm arg1) {
								return arg0.getTime().compareTo(arg1.getTime());
							}
						});
						int listSize = gxSggcLogFormList2.size();
						for (int i = 0; i < listSize; i++) {
							if (i < listSize - 1 && gxSggcLogFormList2.get(i).getTime() > 0) {
								gxSggcLogFormList2.get(i).setNextOpUser(gxSggcLogFormList2.get(i + 1).getOpUser());
								gxSggcLogFormList2.get(i).setNextOpUserPhone(gxSggcLogFormList2.get(i + 1).getOpUserPhone());
							}
						}
						hbList.addAll(gxSggcLogFormList);
						hbList.addAll(gxSggcLogFormList2);
						Collections.sort(hbList, new Comparator<GxSggcLogForm>() {
							public int compare(GxSggcLogForm arg0, GxSggcLogForm arg1) {
								return arg0.getTime().compareTo(arg1.getTime());
							}
						});
						List<Map<String, Object>> listClqk = new ArrayList<Map<String, Object>>();
						Map<String, Object> clqk = null;
						if (hbList != null && hbList.size() > 0) {
							if (hbList.get(0).getTime() == 0) {
								GxSggcLogForm logFrom = hbList.get(0);
								hbList.remove(0);
								hbList.add(logFrom);
							}
							for (int i = 0; i < hbList.size(); i++) {
								//撤回不显示下环节只显示经办人
								if ("撤回".equals(hbList.get(i).getLinkName())) {
									hbList.get(i).setOpUser(hbList.get(i).getNextOpUser());
									hbList.get(i).setOpUserPhone(hbList.get(i).getNextOpUserPhone());
									hbList.get(i).setNextOpUser("");
									hbList.get(i).setNextOpUserPhone("");
								}
								clqk = new HashMap<String, Object>();
								clqk.put("linkName", (i + 1) + "." + hbList.get(i).getLinkName());
								if ("0".equals(hbList.get(i).getLx())) {
									clqk.put("opUser2", "填写人：");
									clqk.put("content2", "内容：");
								} else if ("1".equals(hbList.get(i).getLx())) {
									clqk.put("opUser2", "填写人：");
									clqk.put("content2", "意见：");
								} else {
									if (i == 0) {
										clqk.put("opUser2", "上报人：");
									} else {
										clqk.put("opUser2", "经办人：");
									}
									clqk.put("content2", "意见：");
								}
								clqk.put("opUser", hbList.get(i).getOpUser());
								clqk.put("opUserPhone", hbList.get(i).getOpUserPhone());
								if (hbList.get(i).getTime() > 0) {
									clqk.put("time", new Date(hbList.get(i).getTime()));
								} else {
									clqk.put("time", null);
								}
								clqk.put("content", hbList.get(i).getContent());
								clqk.put("nextOpUser", hbList.get(i).getNextOpUser());
								clqk.put("nextOpUserPhone", hbList.get(i).getNextOpUserPhone());
								List<Map<String, Object>> listClqkImg = new ArrayList<Map<String, Object>>();
								Map<String, Object> clqkImg = null;
								if (hbList.get(i).getFiles() != null && hbList.get(i).getFiles().size() > 0) {
									for (DetailFilesForm obj : hbList.get(i).getFiles()) {
										clqkImg = new HashMap<String, Object>();
										clqkImg.put("name", obj.getName());
										clqkImg.put("height", WordUtils.getImageHeight(obj.getPath()));
										clqkImg.put("img", WordUtils.getImageBase(obj.getPath()));
										listClqkImg.add(clqkImg);
									}
								}
								clqk.put("clqkImgs", listClqkImg);
								listClqk.add(clqk);
							}
						}
						map.put("clqks", listClqk);
						WordUtils.exportMillCertificateWord(getRequest(), getResponse(), map, "问题上报", "exportWtsb.ftl");
						*//************获取环节处理信息结束***************//*
					}
				}catch(Exception e){
					e.printStackTrace();
					throw new Exception(e);
        		}
			}*/
	/**
	 * 获取办理经过
	 * */
	@RequestMapping("/getTraceInfo")
	public Result getTraceInfo(String taskId){
		try {
			List<Map> list = gxProblemReportService.getTraceInfo(taskId);
			return new Result(true,list);
		} catch (Exception e) {
			e.printStackTrace();
			return new Result(false,e.getMessage());
		}
	}
	/**
	/**
	 * 分页查询
	 * */
	@RequestMapping(value = "/searchPage",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String searchPage(GxProblemReport form ,String startTime,String endTime){
		com.augurit.agcloud.framework.security.user.OpuOmUser userForm = SecurityContext.getCurrentUser();
		Map<String,Object> map = new HashMap();
		if (StringUtils.isNotBlank(startTime))
			map.put("startTime", new Date(Long.parseLong(startTime)));
		if (StringUtils.isNotBlank(endTime))
			map.put("endTime", new Date(Long.parseLong(endTime)));
		return gxProblemReportService.searchPage(page,form,map);
	}
	/**
	 * 判断当前用户是否是区管理员或系统管理员
	 */
	@RequestMapping(value = "/userIsAdmin")
	@ResponseBody
	public Result userIsAdmin(){
		com.augurit.agcloud.framework.security.user.OpuOmUser userForm = SecurityContext.getCurrentUser();
		List<OpuRsRole> listRs =  omRsRoleRestService.listRoleByUserId(userForm.getUserId());
		boolean flag=false;
		if(listRs!=null){
			for(OpuRsRole roleForm : listRs){
				if("aosadmin".equals(roleForm.getRoleCode()) || "ps_qj_manager".equals(roleForm.getRoleCode())){
					flag=true;break;
				}
			}
		}
		return new Result(flag,flag?"是":"否");
	}
	/**
	 * 获取当前用户所在区域
	 */
	@RequestMapping(value = "/getUserSzqy",produces="application/json;charset=UTF-8")
	@ResponseBody
	public String getUserSzqy() throws Exception{
		JSONObject json = new JSONObject();
		com.augurit.agcloud.framework.security.user.OpuOmUser userForm = SecurityContext.getCurrentUser();
		Map<String,String> cmMap=correctMarkService.getFrom(userForm.getLoginName());
		String qsdwString=cmMap.get("parentOrgName");
		if("ps_admin".equals(userForm.getLoginName())){
			qsdwString="市水务局";
		}
		if(StringUtils.isBlank(qsdwString)){
			json.put("success",false);
			json.put("message","请确认当前用户所属市水务局!");
			return json.toString();
		}
		if(qsdwString.contains("净水")){
			qsdwString="净水公司";
		}else if(qsdwString.contains("区")){
			qsdwString=qsdwString.substring(0,3);
		}else{
			qsdwString="市水务局";
		}
		json.put("szqy",qsdwString);
		json.put("success",true);
		return json.toString();
	}
	/**
	 * 删除数据和流程信息
	 */
	@RequestMapping(value = "deleteProcessInstance",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String deleteProcessInstance(String id) throws Exception{
		GxProblemReport gxFrom = gxProblemReportService.get(id);
		return gxProblemReportService.deleteProcessInstance(gxFrom);
	}
	/**
	 * 上报分页查询
	 * */
	@RequestMapping(value = "/searchSbPage",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String searchSbPage(GxProblemReport form, String startTime,String endTime){
		com.augurit.agcloud.framework.security.user.OpuOmUser userForm = SecurityContext.getCurrentUser();
		Map<String,Object> map = new HashMap();
		//SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		try{
			if (StringUtils.isNotBlank(startTime))
				map.put("startTime", new Date(Long.valueOf(startTime)));
			else
				map.put("startTime",null);
			if (StringUtils.isNotBlank(endTime))
				map.put("endTime", new Date(Long.valueOf(endTime)));
			else
				map.put("endTime",null);
			return gxProblemReportService.searchSbPage(page,form,map);
		}catch (Exception e){
			e.printStackTrace();
			return JSONObject.fromObject(new Result(false,"参数错误!")).toString();
		}
	}
	/**
	 * 问题上报的统计图表
	 * */
	@RequestMapping(value = "/searchEachts",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String searchEachts(GxProblemReport form,String startTime ,String endTime){
		com.augurit.agcloud.framework.security.user.OpuOmUser userForm = SecurityContext.getCurrentUser();
		Map<String,Object> map = new HashMap<>();
		if (StringUtils.isNotBlank(startTime))
			map.put("startTime", new Date(Long.parseLong(startTime)));
		if (StringUtils.isNotBlank(startTime))
			map.put("startTime", new Date(Long.parseLong(startTime)));
		if (StringUtils.isNotBlank(endTime))
			map.put("endTime", new Date(Long.parseLong(endTime)));
		map.put("isShowEchart","true");
		return gxProblemReportService.searchEachts(form,map);
	}
	/**
	 * 查询工作流相关信息
	 */
	@RequestMapping(value = "searchGzlData",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String searchGzlData(String id){
		JSONObject json = new JSONObject();
		json.put("result", gxProblemReportService.searchTemplate(id));
		return json.toString();
	}

	  
}