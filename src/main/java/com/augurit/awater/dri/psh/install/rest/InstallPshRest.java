package com.augurit.awater.dri.psh.install.rest;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springside.modules.orm.Page;


public class InstallPshRest{
/*
	@Autowired
	private IInstallPshService installRecordService;
	@Autowired
	private ICorrectMarkService correctMarkService;
	@Autowired
	private IOmUserService omUserService;
	
	private PshInstallRecordForm form;
	private Long id;
	private Long[] checkedIds;
	private Page<PshInstallRecordForm> page = new Page<PshInstallRecordForm>();

	
	*//***
	 *保存安装信息
	 * *//*
	@POST
    @Path("saveInstallInf")
    @Produces({"application/json", "text/html"})
    public String saveInstallInf(@Context HttpServletRequest request) throws Exception{
        JSONObject jsonObject = new JSONObject();
        String loginName = request.getParameter("login_name");
        String userName = request.getParameter("user_name");
        String deviceCode = request.getParameter("device_code");
        boolean isIn=omUserService.checkUserIsInPsh(null, loginName);
        if (!isIn) {//如果该用户不在排水户机构里面，直接结束掉，不存信息
        	jsonObject.put("code", 200);
			jsonObject.put("message", "当前登录不是排水户用户，无法保存");
			return jsonObject.toString();
		}
        if ((loginName!=null && !"".equals(loginName)) || (deviceCode!=null && !"".equals(deviceCode))) {
        	List<PshInstallRecordForm> installRecordList=installRecordService.getByLnOrDc(loginName,deviceCode);
        	if (installRecordList!=null && installRecordList.size()>0) {
        		jsonObject.put("code", 200);
    			jsonObject.put("message", "该设备id在安装情况表中已经存在记录");
    			return jsonObject.toString();
			}
		}
        if (loginName!=null && !"".equals(loginName)) {
        	 PshInstallRecordForm PshInstallRecordForm=new PshInstallRecordForm();
             PshInstallRecordForm.setLoginName(loginName);
             PshInstallRecordForm.setUserName(userName);
             PshInstallRecordForm.setDeviceCode(deviceCode);
             PshInstallRecordForm.setInstallTime(new Date());
             try {
             	Map<String,String> cmMap=installRecordService.getOrgForAppInstall(loginName);
             	if(cmMap!=null && cmMap.size()>0){
             		PshInstallRecordForm.setTeamOrgId(cmMap.get("teamOrgId"));
                 	PshInstallRecordForm.setTeamOrgName(cmMap.get("teamOrgName"));
                 	PshInstallRecordForm.setDirectOrgId(cmMap.get("directOrgId"));
                 	PshInstallRecordForm.setDirectOrgName(cmMap.get("directOrgName"));
                 	PshInstallRecordForm.setSuperviseOrgId(cmMap.get("superviseOrgId"));
                 	PshInstallRecordForm.setSuperviseOrgName(cmMap.get("superviseOrgName"));
                 	PshInstallRecordForm.setParentOrgId(cmMap.get("parentOrgId"));
                 	PshInstallRecordForm.setParentOrgName(cmMap.get("parentOrgName"));
             	}
             	installRecordService.save(PshInstallRecordForm);
     		}  catch (Exception e) {
     			jsonObject.put("code", 500);
     			jsonObject.put("message", "异常错误!"+e.getMessage());
     			e.printStackTrace();
     		}
            jsonObject.put("data", PshInstallRecordForm);
            jsonObject.put("code", 200);
     		jsonObject.put("message", "保存成功");
		}else {
			jsonObject.put("code", 500);
			jsonObject.put("message", "参数异常，保存失败！");
	   }
       return jsonObject.toString();
	}

	
	*//***
	 *统计App安装率
	 * *//*
	@GET
    @Path("StatisticalApp")
    @Produces({"application/json", "text/html"})
    public String StatisticalApp(@Context HttpServletRequest request) throws Exception{
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
	        	OmOrgForm om=installRecordService.getOmorgByOrgName(orgName);
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
             		String ldJson=installRecordService.getOverUserRate(true);
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
             	List<OmUserForm> omuserList=null;
             	if (org_id!=null && !"".equals(org_id)) {
             		 omuserList=installRecordService.getUsesByOrgId(Long.parseLong(org_id),ty);
             		//获取当前区安装的人数
         			List<OmUserForm> omUserInsList=installRecordService.getUsesByIsinstalled(true,Long.parseLong(org_id),ty);
         			installs=omUserInsList==null?0:omUserInsList.size();
				}else {
					omuserList=installRecordService.getAllUses(ty);
					//获取当前市安装的总人数
        			List<OmUserForm> allUserList= installRecordService.getUsesByIsinstalled(true,null,ty);
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
	*//***
	 *查询某个机构下所有已安装App的用户
	 *第三个接口
	 * *//*
	@GET
    @Path("StatisticalAppInOrg")
    @Produces({"application/json", "text/html"})
    public String StatisticalAppInOrg(@Context HttpServletRequest request) throws Exception{
        JSONObject jsonObject = new JSONObject();
        String org_id = request.getParameter("org_id");
        String orgName = request.getParameter("org_name");
        String roleType = request.getParameter("roleType");//一线还是领导
        boolean ty=false;
        if (roleType!=null && "true".equals(roleType)) {
			ty=true;
		}
        //这里必须查询具体的机构，不允许有不存在
        if(orgName!=null && !"".equals(orgName)){
        	try {
        		List<OmUserForm> allUserInThisList=null;//该区总人数
            	//区外领导部分，走这里//查找市区领导
        		if (orgName!=null && (orgName.contains("市水务局"))) {//都是领导
        			allUserInThisList=installRecordService.getOverAreaUser();
        		}
            	if (allUserInThisList==null) {//非市区，走这个方法
            		OmOrgForm om=installRecordService.getOmorgByOrgName(orgName);
                	if (om!=null && om.getOrgId()!=null) {
                		org_id=om.getOrgId().toString();
        			}
                	//得到该机构所有的用户，不管安装没有
            		allUserInThisList=installRecordService.getUsesByOrgId(Long.parseLong(org_id),ty);
            	}
            	JSONObject userJson = new JSONObject();
            	if (allUserInThisList!=null && allUserInThisList.size()>0) {
            		userJson.put("total", allUserInThisList.size());
            		userJson.put("total_page",  1);
            		userJson.put("cur_page",  1);
            	}
            	if (allUserInThisList!=null && allUserInThisList.size()>0) {
            		List<OmUserForm> list =allUserInThisList;
            		//int count=0;//先循环一次排下序，把已安装的摆在前面
            		List<OmUserForm> tempList1=new ArrayList<>(); //存安装的人员
            		List<OmUserForm> tempList2=new ArrayList<>(); //存未安装的人员
    				for(int i=0;i<list.size();i++){	
    					OmUserForm s=list.get(i);
            			List<PshInstallRecordForm> insList=installRecordService.getByLnOrDc(s.getLoginName(), null);
         				if (insList!=null && insList.size()>0) {
         					//这里识别是否安装
         					s.setMemo1("true");
         					tempList1.add(s);
         				}else {
         					tempList2.add(s);
						}
            		}
    				list.clear();
    				list.addAll(tempList2);
    				list.addAll(tempList1);
    				JSONArray appArray=new JSONArray();
    				for(OmUserForm s:list){	
    					JSONObject app = new JSONObject();
    					app.put("user_name",s.getUserName());
    					app.put("phone",s.getMobile());
    					app.put( "job",s.getTitle());
    					if(s.getTitle()!=null && s.getTitle().contains("水投集团")){
    						app.put("direc_org","水投集团");
    					}else {
    						String dcorgName=installRecordService.getOrgByUserId(s.getUserId());
							app.put("direc_org",dcorgName);
//    						Map<String,String> cmMap=correctMarkService.getFrom(s.getLoginName());
//        	             	if(cmMap!=null && cmMap.size()>0){
//        	             		app.put("team_org",cmMap.get("teamOrgName"));
//        	             		if (cmMap.get("directOrgName")==null) {
//        	             			app.put("direc_org",cmMap.get("parentOrgName"));
//    							}else {
//    								app.put("direc_org",cmMap.get("directOrgName"));
//    	        				}
//            					app.put("supervise_org",cmMap.get("superviseOrgName"));
//        	             	}else {//这里处理一下顶层领导没有机构的
//    							
//    						} 
						}
    					if (s.getMemo1()!=null && "true".equals(s.getMemo1())) {
         					 //这里识别是否安装
         					app.put( "isInstalled",true);
         				}else {
         					app.put( "isInstalled",false);
						}
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
	*//**
	 * 获取已安装/未安装的人员详情
	 * *//*
	@GET
    @Path("StatisticalAppGetUsers")
    @Produces({"application/json", "text/html"})
    public String StatisticalAppGetUsers(@Context HttpServletRequest request) throws Exception{
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
        		List<OmUserForm> omuserList=null;
        		boolean flag=false;
        		Long oid=null;
        		if (orgName!=null && !"".equals(orgName)) {
        			OmOrgForm om=installRecordService.getOmorgByOrgName(orgName);
        			if (om!=null) {
        				oid=om.getOrgId();
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
    				for(OmUserForm s:omuserList){
    					JSONObject app = new JSONObject();
    					app.put("user_name",s.getUserName());
    					app.put("phone",s.getMobile());
    					app.put( "job",s.getTitle());
    					if(s.getTitle()!=null && s.getTitle().contains("水投集团")){
    						app.put("direc_org","水投集团");
    					}else {
    						String dcorgName=installRecordService.getOrgByUserId(s.getUserId());
							app.put("direc_org",dcorgName);
//	    					Map<String,String> cmMap=correctMarkService.getFrom(s.getLoginName());
//	    	             	if(cmMap!=null && cmMap.size()>0){
//	    	             		app.put("team_org",cmMap.get("teamOrgName"));
//	    	             		if (cmMap.get("directOrgName")==null) {
//	    	             			app.put("direc_org",cmMap.get("parentOrgName"));
//								}else {
//									app.put("direc_org",cmMap.get("directOrgName"));
//		        				}
//	        				    app.put("supervise_org",cmMap.get("superviseOrgName"));
//	    	             	}else {//这里处理一下顶层领导没有机构的
//								
//							} 
    					}
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
	*/
	
}