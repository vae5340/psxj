package com.augurit.awater.bpm.problem.web;

import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.framework.security.user.OpuOmUser;
import com.augurit.agcloud.opus.common.domain.OpuAcRoleUser;
import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.awater.bpm.problem.service.ICcProblemService;
import com.augurit.awater.bpm.problem.web.form.CcProblemForm;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.awater.bpm.xcyh.report.service.IGxProblemReportService;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.utils.Result;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/ccProblem")
public class CcProblemController {
	
	@Autowired
	private ICcProblemService ccProblemService;

	@Autowired
	private IGxProblemReportService gxProblemReportService;

	@Autowired
	private IOmOrgRestService omOrgRestService;
//	@Autowired
//	private IOmUserService iOmUserService;
//	@Autowired
//	private IAcRoleService iAcRoleService;
//
//	@Autowired
//	IOmOrgService iOmOrgService;
	private CcProblemForm form;
	private Long id;
	private Long[] ids;
	private Page<CcProblemForm> page = new Page<CcProblemForm>();
	private ObjectMapper objectMapper;

	/**
	 * 业务保存和流程启动
	 */
//	@SuppressWarnings("unchecked")
//	@Override
//	public String wfBusSave() throws Exception {
//		try{
//			WfContextTaskForm task = this.wfBusSave((IWfBusClientService)ccProblemService, form);
//			WfUtils.renderWfBusSaveResult(task, form);
//		}catch(Exception e){
//			e.printStackTrace();
//			WfUtils.renderWfBusSaveResult(null, null);
//		}
//		return null;
//	}
	
	/**
	 * 获取工作id
	 */
//	@RequestMapping("/getTaskInstDb")
//	public List getTaskInstDb(HttpServletRequest request) throws Exception {
//		String keyId=request.getParameter("MASTER_ENTITY_KEY");
//		String tableName=request.getParameter("MASTER_ENTITY");
//		List list=ccProblemService.getTaskInstDb(keyId,tableName);
//		return list;
//	}
//
	/**
	 * 获取表数据
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getTableData")
	public List getTableData(HttpServletRequest request) throws Exception{
		String keyId=request.getParameter("id");
		String tableName=request.getParameter("table");
		List list=ccProblemService.getTableData(keyId,tableName);
		return list;
	}
	/**
	 * 获取问题上报业务表单数据
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getProblemTableData")
	public Result getTableData(String id) {
		try {
			return new Result(true,gxProblemReportService.get(id));
		} catch (Exception e) {
			e.printStackTrace();
			return new Result(false,e.getMessage());
		}
	}

	@RequestMapping("/getTabsData")
	@CrossOrigin
	public List<OpuAcRoleUser> getTabsData(String templateCode) throws Exception {
		List<OpuAcRoleUser> list = omOrgRestService.getRolesByUserId(SecurityContext.getCurrentUserId());
		String[] roleIds = list.stream().map(user -> user.getRoleId()).collect(Collectors.toList()).toArray(new String[0]);
		return ccProblemService.getTabsData(templateCode, roleIds[0]);
	}

	/**
	 * 根据角色来获取自己区的办案人员
	 * */
	@RequestMapping("/getTaskUserByRole")
	public List<OpuOmUser> getTaskUsersByRole() throws Exception {
//		String reportName = Struts2Utils.getLoginUser().getLoginName();
		String userId = SecurityContext.getCurrentUserId();
		if(userId != null){
			List<String> orgList = omOrgRestService.listOpuOmOrgIdByUserId(userId);
			if(orgList != null){
				String orgId = orgList.get(0);
				//Todo getRoleByRoleCode
//				AcRoleForm acRoleForm = iAcRoleService.getRoleByRoleCode("ps_yz_chief");
//				if(acRoleForm != null){
				if(false){
//					OpuOmOrg parentOrg = getOrgId(OpuOmOrg, acRoleForm.getRoleId());
//					List<OpuOmUser> userOrgList = iOmUserService.getUsersByOrgId(parentOrg.getOrgId());
//					//缺一个过滤当前区域的代码
//					List<OpuOmUser> userRoleList=iOmUserService.getUsersByRoleId(acRoleForm.getRoleId());
					List<OpuOmUser> userRoleList2=new ArrayList<>();
//					if(userOrgList != null && userRoleList != null){
//						for(OpuOmUser orgUserForm : userOrgList){
//							for(OpuOmUser roleUserForm : userRoleList){
//								if(orgUserForm.getLoginName().equals(roleUserForm.getLoginName())){
//									userRoleList2.add(roleUserForm);
//								}
//							}
//						}
//					}
					return userRoleList2;
				}
			}
		}
		return null;
	}

	/**
	 * 获取上级业主单位负责人
	 * @param orgId
	 * @param roleId
	 * @return
	 */
	@RequestMapping("/getOrgId")
	private OpuOmOrg getOrgId(String orgId, Long roleId){
//	private OpuOmOrg getOrgId(OpuOmOrg OpuOmOrg , Long roleId){
		com.augurit.agcloud.opus.common.domain.OpuOmOrg orgMap = omOrgRestService.getOrgByOrgId(orgId);
		//Todo test
		OpuOmOrg opuOmOrg = objectMapper.convertValue(orgMap, OpuOmOrg.class);
		if(orgId != null && roleId != null){
			List<Map<String, String>> userOrgList = omOrgRestService.listSelfAndChildUserOrgsByOrgId(orgId);
//			List<OpuOmUser> userOrgList = iOmUserService.getUsersByOrgId(OpuOmOrg.getOrgId());
			List userList = omOrgRestService.listAllOpuOmUserByOrgId(orgId);
			if(userOrgList != null && userOrgList.size()>0){
				for(Map<String, String> userOrg : userOrgList){
//					Long[] roles = iAcRoleService.getAllRoleIdsByUserId(user.getUserId());
					List<OpuAcRoleUser> roleList = omOrgRestService.getRolesByUserId(userOrg.get("userId"));
					if(roleList.size() == 0)
						return null;
					Long[] roles = roleList.stream().map((OpuAcRoleUser user)->{return user.getRoleId();}).collect(Collectors.toList()).toArray(new Long[roleList.size()]);
					boolean flag = checkExist(roles, roleId);
					if(flag){
						return opuOmOrg;
					}else{
						String parentOrgId = omOrgRestService.getParentOrgFormByOrgId(orgId).get("orgId");
						return getOrgId(parentOrgId, roleId);
					}
				}
			}else{
				String parentOrgId = omOrgRestService.getParentOrgFormByOrgId(orgId).get("orgId");
				return getOrgId(parentOrgId, roleId);
			}
		}
		return null;
	}

	/**
	 * 判断是否存在
	 * @param roles
	 * @param roleId
	 * @return
	 */
	@RequestMapping("/checkExist")
	private boolean checkExist(Long [] roles,Long roleId){
		for(int i=0;i<roles.length;i++){
			if(roles[i].equals(roleId)){
				return true;
			}
		}
		return false;
	}
//
//	@RequestMapping("/getJbpmHistProcinst")
//	public String getJbpmHistProcinst(HttpServletRequest request) throws Exception {
//		String procInstId = request.getParameter("procInstId");
//		return ccProblemService.getJbpmHistProcinst(procInstId);
//	}

//	@RequestMapping("/getShowFieldList")
//	public List getShowFieldList(HttpServletRequest request) throws Exception {
//		Long templateId = Long.valueOf(request.getParameter("templateId"));
//		Long viewId = Long.valueOf(request.getParameter("viewId"));
//		String instIds = request.getParameter("instIds");
//		return ccProblemService.getShowFieldList(templateId, viewId, instIds);
//	}
//
	@RequestMapping("/getFormData")
	@CrossOrigin
	public List getFormData(Long templateId, String masterEntitykey, HttpServletRequest request) throws Exception {
		return ccProblemService.getFormData(templateId, masterEntitykey, request);
	}

	@RequestMapping("/getProblemForm")
	@CrossOrigin
	public ModelAndView getProblemForm() throws Exception {
		return new ModelAndView("/water/bpm/problem/problem_index");
	}

	@RequestMapping("/saveData")
	@CrossOrigin
	public String saveData(HttpServletRequest request) throws Exception {
		Long templateId = Long.valueOf(request.getParameter("templateId"));
		String jsonString = request.getParameter("dataList");
		Boolean flag = ccProblemService.saveData(templateId, jsonString);
		if(flag){
			return "true";
		}else{
			return "false";
		}
	}

	@RequestMapping("/getDetailData")
	public List getDetailData(HttpServletRequest request) throws Exception {
		String templateCode = request.getParameter("templateCode");
		String masterEntityKey = request.getParameter("masterEntityKey");
		return ccProblemService.getDetailData(templateCode,masterEntityKey);
	}

//	/**
//	 * 获取图片
//	 */
//	@RequestMapping("/getImages")
//	public String getImages(HttpServletRequest request) throws Exception{
//		try {
//			String urlAll=request.getRequestURL().toString() ;
//			String url="";//图片路径处理
//			String[] mainurl=urlAll.split("/ag");
//			if (mainurl!=null && mainurl.length>0) {
//				url=mainurl[0]+"/img/";
//			}
//			return ccProblemService.getImages(url, request);
//		} catch (Exception e) {
//			e.printStackTrace();
//			return null;
//		}
//	}

//	@RequestMapping("/getActivityImages")
//	public String getActivityImages(HttpServletRequest request) throws Exception{
//		String templateCode = request.getParameter("templateCode");
//		String masterEntityKey = request.getParameter("masterEntityKey");
//		try {
//			return ccProblemService.getActivityImages(templateCode, masterEntityKey);
//		} catch (Exception e) {
//			e.printStackTrace();
//			return null;
//		}
//	}
//
//	/**
//	 * 获取小斑wkt
//	 */
//	@RequestMapping("/getXiaoBanWkt")
//	public String getXiaoBanWkt(HttpServletRequest request) throws Exception {
//		try {
//			return ccProblemService.getXiaoBanWkt(request);
//		} catch (Exception e) {
//			e.printStackTrace();
//			return null;
//		}
//	}
//
//	/**
//	 * 获取河道wkt
//	 */
//	@RequestMapping("/getRiverWkt")
//	public String getRiverWkt(HttpServletRequest request) throws Exception {
//		try {
//			return ccProblemService.getRiverWkt(request);
//		} catch (Exception e) {
//			e.printStackTrace();
//			return null;
//		}
//	}
}
