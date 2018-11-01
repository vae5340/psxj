package com.augurit.awater.dri.installRecord.rest;

import com.augurit.agcloud.common.controller.BaseController;
import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.agcloud.opus.common.domain.OpuOmUser;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.awater.dri.installRecord.service.IInstallRecordService;
import com.augurit.awater.dri.installRecord.web.form.InstallRecordForm;
import com.augurit.awater.dri.installRecord.web.form.OrgNameForm;
import com.augurit.awater.dri.problem_report.correct_mark.service.ICorrectMarkService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;


@RequestMapping("/rest/app/installRecord")
@Controller
public class InstallRecordRestController extends BaseController<InstallRecordForm> {

	@Autowired
	private IInstallRecordService installRecordService;
	@Autowired
	private ICorrectMarkService correctMarkService;
	@Autowired
	private IOmOrgRestService omOrgRestService;
	@Autowired
	private IOmUserInfoRestService userInfoRestService;


	/***
	 *保存安装信息0
	 * */
	@RequestMapping(value = "/saveInstallInf",produces = "application/json;charset=UTF-8")
	@ResponseBody
    public String saveInstallInf(HttpServletRequest request, HttpServletResponse response) {
        JSONObject jsonObject = new JSONObject();
        String loginName = request.getParameter("login_name");
        String userName = request.getParameter("user_name");
        String deviceCode = request.getParameter("device_code");
		OpuOmUserInfo userInfo = userInfoRestService.getOpuOmUserInfoByLoginName(loginName);
		List<String> listOrgIds = omOrgRestService.listOpuOmOrgIdByUserId(userInfo.getUserId(),new String[]{"swj"});
		Boolean isIn = false;
		if(listOrgIds!=null && listOrgIds.size()>0){
			for(String orgId :listOrgIds){
				OpuOmOrg org = omOrgRestService.getOpuOmOrgIdByOrgId(orgId);
				if(!org.getOrgCode().contains("PSH")){
					isIn=true;
				}
			}
		}
		if(!isIn){
			jsonObject.put("code", 200);
			jsonObject.put("message", "当前登录不是排水户用户，无法保存");
			return jsonObject.toString();
		}
        if ((loginName!=null && !"".equals(loginName)) || (deviceCode!=null && !"".equals(deviceCode))) {
        	List<InstallRecordForm> installRecordList=installRecordService.getByLnOrDc(loginName,deviceCode);
        	if (installRecordList!=null && installRecordList.size()>0) {
        		jsonObject.put("code", 200);
    			jsonObject.put("message", "该设备id在安装情况表中已经存在记录");
    			return jsonObject.toString();
			}
		}
        if (loginName!=null && !"".equals(loginName)) {
        	 InstallRecordForm installRecordForm=new InstallRecordForm();
             installRecordForm.setLoginName(loginName);
             installRecordForm.setUserName(userName);
             installRecordForm.setDeviceCode(deviceCode);
             installRecordForm.setInstallTime(new Date());
             try {
             	Map<String,String> cmMap=installRecordService.getOrgForAppInstall(loginName);
             	if(cmMap!=null && cmMap.size()>0){
             		installRecordForm.setTeamOrgId(cmMap.get("teamOrgId"));
                 	installRecordForm.setTeamOrgName(cmMap.get("teamOrgName"));
                 	installRecordForm.setDirectOrgId(cmMap.get("directOrgId"));
                 	installRecordForm.setDirectOrgName(cmMap.get("directOrgName"));
                 	installRecordForm.setSuperviseOrgId(cmMap.get("superviseOrgId"));
                 	installRecordForm.setSuperviseOrgName(cmMap.get("superviseOrgName"));
                 	installRecordForm.setParentOrgId(cmMap.get("parentOrgId"));
                 	installRecordForm.setParentOrgName(cmMap.get("parentOrgName"));
             	}
             	installRecordService.save(installRecordForm);
     		}  catch (Exception e) {
     			jsonObject.put("code", 500);
     			jsonObject.put("message", "异常错误!"+e.getMessage());
     			e.printStackTrace();
     		}
            jsonObject.put("data", installRecordForm);
            jsonObject.put("code", 200);
     		jsonObject.put("message", "保存成功");
		}else {
			jsonObject.put("code", 500);
			jsonObject.put("message", "参数异常，保存失败！");
	   }
       return jsonObject.toString();
	}

	
	/***
	 *统计App安装率
	 * */
	@RequestMapping(value = "/StatisticalApp",produces = "application/json;charset=UTF-8")
	@ResponseBody
    public String StatisticalApp(HttpServletRequest request){
        JSONObject jsonObject = new JSONObject();
        //String loginName = request.getParameter("login_name");
        String orgName = request.getParameter("org_name");
        String org_id = request.getParameter("org_id");
        String roleType = request.getParameter("roleType");//一线还是领导
        boolean ty=false;
        try {
        		if (roleType!=null && "true".equals(roleType)) {
        			ty=true;
				}
        		//区外领导部分，走这里
        		if (orgName!=null && (orgName.contains("市水务局"))) {//都是领导
                  	return installRecordService.getOverUserRate(false);	
          		}
        		//一线，当前只是4级结构的组织，要踢掉里面的领导用户
	        	OpuOmOrg om=installRecordService.getOmorgByOrgName(orgName);
	        	if (om!=null && om.getOrgId()!=null) {
	        		org_id=om.getOrgId().toString();
				}
        		//获取安装数
             	List<OrgNameForm> orgList=installRecordService.getStaticByOrgId(org_id,ty);
             	if (orgList==null) {//这个list存两部分，一线和领导，上面的查询是一线，如果没有值的话，就New一个去存领导层
             		orgList=new ArrayList<>();
				}
             	//如果查询的全市，还要把市级别  拼接上去
             	if (ty && (((orgName!=null && orgName.contains("全市"))) 
                  		|| orgName==null || "".equals(orgName) )) {//思路是吧，市级领导和区级领导合并
             		String ldJson=installRecordService.getOverUserRate(false);
             		if (ldJson.contains("data")) {
             			JSONObject ldjson = JSONObject.fromObject(ldJson);
                 		JSONObject dataJson= JSONObject.fromObject(ldjson.getString("data"));
                 		JSONArray childArray=JSONArray.fromObject(dataJson.getString("child_orgs"));
                 		JSONObject childJson= JSONObject.fromObject(childArray.get(0));
                 		OrgNameForm oruser = new OrgNameForm();  
                 		oruser.setOrg_name(childJson.getString("org_name"));  
                 		oruser.setInstall_percent(childJson.getString("install_percent"));  
                 		orgList.add(oruser); 
					}
             	}
             	int installs=0;
             	//得到该机构所有的用户，不管安装没有
             	List<OpuOmUser> omuserList=null;
             	if (org_id!=null && !"".equals(org_id)) {
             		 omuserList=installRecordService.getUsesByOrgId(org_id,ty);
             		//获取当前区安装的人数
         			List<OpuOmUser> omUserInsList=installRecordService.getUsesByIsinstalled(true,org_id,ty);
         			installs=omUserInsList==null?0:omUserInsList.size();
				}else {
					omuserList=installRecordService.getAllUses(ty);
					//获取当前市安装的总人数
        			List<OpuOmUser> allUserList= installRecordService.getUsesByIsinstalled(true,null,ty);
        			installs=allUserList==null?0:allUserList.size();
				}
             	JSONObject jso = new JSONObject();
             	jso.put("total", omuserList==null?0:omuserList.size());
             	jso.put("install", installs);
             	jso.put("child_orgs", orgList);
             	jsonObject.put("data", jso);
             	jsonObject.put("code", 200);
        		jsonObject.put("message", "查询成功");
      		}  catch (Exception e) {
      			jsonObject.put("code", 500);
      			jsonObject.put("message", "异常错误!"+e.getMessage());
      			e.printStackTrace();
      		}
        return jsonObject.toString();
	}

	/**
	 *查询某个机构下所有已安装App的用户
	 *第三个接口
	 **/
	@RequestMapping(value = "/StatisticalAppInOrg", produces = "application/json;charset=UTF-8")
	@ResponseBody
    public String StatisticalAppInOrg(HttpServletRequest request) {
        JSONObject jsonObject = new JSONObject();
        String org_id = request.getParameter("org_id");
        String orgName = request.getParameter("org_name");
        String roleType = request.getParameter("roleType");//一线还是领导
        boolean ty = false;
        if (roleType!=null && "true".equals(roleType)) {
			ty=true;
		}
        //这里必须查询具体的机构，不允许有不存在
        if(orgName!=null && !"".equals(orgName)){
        	try {
        		List<OpuOmUser> allUserInThisList = null;//该区总人数
            	//区外领导部分，走这里//查找市区领导
        		if (orgName!=null && (orgName.contains("市水务局"))) {//都是领导
        			allUserInThisList = installRecordService.getOverAreaUser();
        		}
            	if (allUserInThisList == null) {//非市区，走这个方法
            		OpuOmOrg om = installRecordService.getOmorgByOrgName(orgName);
                	if (om!=null && om.getOrgId()!=null) {
                		org_id = om.getOrgId().toString();
        			}
                	//得到该机构所有的用户，不管安装没有
            		allUserInThisList = installRecordService.getUsesByOrgId(org_id,ty);
            	}
            	JSONObject userJson = new JSONObject();
				JSONArray appArray=new JSONArray();
				if (allUserInThisList!=null && allUserInThisList.size()>0) {
            		userJson.put("total", allUserInThisList.size());
            		userJson.put("total_page",  1);
            		userJson.put("cur_page",  1);

            		List<OpuOmUser> list = allUserInThisList;
            		List<OpuOmUser> tempList1 = new ArrayList<>(); //存安装的人员
            		List<OpuOmUser> tempList2 = new ArrayList<>(); //存未安装的人员

					JSONObject app = new JSONObject();
					for(int i=0; i<list.size(); i++){
						OpuOmUser s = list.get(i);
						app.put("user_name",s.getUserName());
						app.put("phone",s.getUserMobile());
						app.put("org_name",s.getOrgName());

						// 根据loginName判断是否安装
						List<InstallRecordForm> insList = installRecordService.getByLnOrDc(s.getLoginName(), null);
         				if (insList!=null && insList.size()>0) {
							app.put("isInstalled",true);
							tempList1.add(s);
         				}else {
							app.put("isInstalled",false);
							tempList2.add(s);
						}
						appArray.add(app);
					}
//    				list.clear();
//					list.addAll(tempList1);
//					list.addAll(tempList2);
    				userJson.put("users", appArray);//封装用户
    			}
            	jsonObject.put("data", userJson);
            	jsonObject.put("code", 200);
        		jsonObject.put("message", "查询成功");
     		}catch (Exception e) {
     			jsonObject.put("code", 500);
     			jsonObject.put("message", "异常错误!"+e.getMessage());
     			e.printStackTrace();
     		}
        }else {
        	jsonObject.put("code", 500);
    		jsonObject.put("message", "参数异常，查询失败！");
		}
        return jsonObject.toString();
	}

	/**
	 * 获取已安装/未安装的人员详情
	 *
	 **/
	@RequestMapping(value = "/StatisticalAppGetUsers",produces = "application/json;charset=UTF-8")
	@ResponseBody
    public String StatisticalAppGetUsers() {
        JSONObject jsonObject = new JSONObject();
        String isInstalled = request.getParameter("isInstalled");
        String orgName = request.getParameter("org_name");
        String roleType = request.getParameter("roleType");//一线还是领导
        boolean ty=false;
        if (roleType!=null && "true".equals(roleType)) {
			ty=true;
		}
        if(isInstalled!=null && !"".equals(isInstalled)){
        	try {
        		List<OpuOmUser> omuserList = null;
        		boolean flag = false;
        		String oid = null;
        		if (orgName!=null && !"".equals(orgName)) {
        			OpuOmOrg om=installRecordService.getOmorgByOrgName(orgName);
        			if (om!=null) {
        				oid = om.getOrgId();
					}
        		}
        		if("true".equals(isInstalled)){//查找安装用户
        			flag=true;
        		}
        		if (orgName!=null && orgName.contains("市水务局")) {
        			omuserList=installRecordService.getOverAreaUserInstalled(flag);
				}else {
					omuserList=installRecordService.getUsesByIsinstalled(flag,oid,ty);
				}
        		JSONObject userJson = new JSONObject();
            	if (omuserList!=null && omuserList.size()>0) {
            		userJson.put("total", omuserList.size());
            	}
            	if (omuserList!=null  && omuserList.size()>0) {
            		JSONArray appArray=new JSONArray();
    				for(OpuOmUser s:omuserList){
    					JSONObject app = new JSONObject();
    					app.put("user_name",s.getUserName());
    					app.put("phone",s.getUserMobile());
    					app.put("direc_org",s.getOrgName());
	             		//这里识别是否安装
     					app.put( "isInstalled",flag);
     					appArray.add(app);
    				}
    				userJson.put("users", appArray);//封装用户
    			}
            	jsonObject.put("data", userJson);
            	jsonObject.put("code", 200);
        		jsonObject.put("message", "查询成功");
     		}  catch (Exception e) {
     			jsonObject.put("code", 500);
     			jsonObject.put("message", "异常错误!"+e.getMessage());
     			e.printStackTrace();
     		}
        }else {
        	jsonObject.put("code", 500);
    		jsonObject.put("message", "参数异常，查询失败！");
		}
        return jsonObject.toString();
	}
	
	
}