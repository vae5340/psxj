package com.augurit.awater.dri.psh.install.service.impl;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.installRecord.web.form.OrgNameForm;
import com.augurit.awater.dri.psh.install.convert.PshInstallRecordConvertor;
import com.augurit.awater.dri.psh.install.dao.PshInstallRecordDao;
import com.augurit.awater.dri.psh.install.entity.PshInstallRecord;
import com.augurit.awater.dri.psh.install.service.IInstallPshService;
import com.augurit.awater.dri.psh.install.web.form.PshInstallRecordForm;
import com.augurit.awater.util.PropertyFilter;
import com.augurit.awater.util.page.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;




@Service
@Transactional
public class InstallPshServiceImpl implements IInstallPshService {

	@Autowired
	private PshInstallRecordDao pshInstallRecordDao;
	@Autowired
	private IOmUserInfoRestService omUserService;
	@Autowired
	private IOmOrgRestService omOrgService;
	/**
	 * 根据主键获取Form对象0
	 */
	@Transactional(readOnly = true)
	public PshInstallRecordForm get(Long id) {
		PshInstallRecord entity = pshInstallRecordDao.get(id);
		return PshInstallRecordConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		pshInstallRecordDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(PshInstallRecordForm... forms) {
		if(forms != null)
			for(PshInstallRecordForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(PshInstallRecordForm form){
		
		if(form != null){
			PshInstallRecord entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = pshInstallRecordDao.get(form.getId());
			}else{
				entity = new PshInstallRecord();
			}
			
			//属性值转换
			PshInstallRecordConvertor.convertFormToVo(form, entity);
			
			//保存
			pshInstallRecordDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<PshInstallRecordForm> search(Page<PshInstallRecordForm> page, PshInstallRecordForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from PshInstallRecord ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = pshInstallRecordDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<PshInstallRecordForm> list = PshInstallRecordConvertor.convertVoListToFormList(pg.getResult());
		
		
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<PshInstallRecordForm> search(Page<PshInstallRecordForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<PshInstallRecord> pg = pshInstallRecordDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<PshInstallRecordForm> list = PshInstallRecordConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}

	/**
	 * 根据用户统计
	 * 区分一线或领导
	 * *//*
	@Override
	public List<OrgNameForm> getStaticByOrgId(String orgId, boolean roleType) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("select ps.parentOrgName as org_name,count(ps.parentOrgName) as install_percent from PshInstallRecord ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();		
		if (orgId!=null && !"".equals(orgId)) {//存在该名称根据，do查
			//hql = new StringBuffer("select ps.directOrgName as org_name,count(ps.directOrgName) as install_percent from PshInstallRecord ps where 1=1");
			//20171117改为都按照市区查
			hql.append(" and ps.parentOrgId=:poi");
			values.put("poi", orgId);
//			hql.append(" and ps.directOrgName is not null");
//			hql.append(" group by ps.directOrgName");
		}
		hql.append(" and ps.parentOrgName is not null");
		if (roleType) {//领导
			hql.append(" and ps.loginName in ");
		}else {//一线人员
			hql.append(" and ps.loginName not in ");
		}
		//下面语句是找到领导角色的用户
		hql.append("(select os.loginName from AcUserRole ar, "
				+ "OmUser os where ar.userId=os.userId and ar.roleId in(select "
				+ "ac.roleId from AcRole ac where ac.roleCode='PSH_PGJS' or ac.roleCode='PSH_QJGLY'))");
		hql.append(" group by ps.parentOrgName");
		List<Object[]> List=pshInstallRecordDao.find(hql.toString(), values);
		List<OrgNameForm> orgList=new ArrayList<>();
		if (List!=null && List.size()>0) {
			Long orgId1=null;
			Long installs=0l;//安装人数
			int omCount=0;//总人数
			//传了id就查一次就行
			if(orgId!=null && !"".equals(orgId)){
				orgId1=Long.parseLong(orgId);
				//获取当前区安装的人数
				List<OpuOmUserInfo> omUserInsList=this.getUsesByIsinstalled(true,orgId1,roleType);
				int install=omUserInsList==null?0:omUserInsList.size();
				installs=Long.parseLong(install+"");
				//获取当前区总人数
				List<OpuOmUserInfo> omList=this.getUsesByOrgId(orgId1,roleType);
				if (omList!=null && omList.size()>0) {
					omCount=omList.size();
				}
			}
			for(Object[] o:List){
				OrgNameForm org=new OrgNameForm();
				org.setOrg_name((String)o[0]);
				//如果什么都不传，根据里面的二级目录找到总人数
				if (orgId1==null) {
					Long ordId2=null;
					OmOrgForm om=this.getOmorgByOrgName((String)o[0]);
					if (om!=null) {
						ordId2=om.getOrgId();
						//获取当前区安装的人数
						List<OmUserForm> omUserInsList=this.getUsesByIsinstalled(true,ordId2,roleType);
						int install=omUserInsList==null?0:omUserInsList.size();
						installs=Long.parseLong(install+"");
						//获取当前区总人数
						List<OmUserForm> omList=this.getUsesByOrgId(ordId2,roleType);
						if (omList!=null && omList.size()>0) {
							omCount=omList.size();
						}
					}
					
				}
				org.setInstall_percent(getBfb(installs,omCount));
				orgList.add(org);
			}
		}
		if (orgList!=null && orgList.size()>0) {
			return orgList;
		}
		return null;
	}
	*//**
	 * 获取百分百
	 * **//*
	private String getBfb(Long num1,int num2){
		if (num2!=0) {
			// 创建一个数值格式化对象  
			NumberFormat numberFormat = NumberFormat.getInstance();  
	        // 设置精确到小数点后2位  
			numberFormat.setMaximumFractionDigits(1);  
			String result = numberFormat.format((float) num1 / (float) num2 * 100);  
	        return result;
		}
		return null;
	}
	*//**
	 * 获取安装用户
	 * *//*
	@Override
	public List<PshInstallRecordForm> getListByPOrgId(String porgId,boolean roleType) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from PshInstallRecord ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		if (porgId!=null && !"".equals(porgId)) {
			hql.append(" and ps.parentOrgId=:poi");
			values.put("poi", porgId);
		}
		//hql.append(" and ps.parentOrgName is not null");
		if (roleType) {//领导
			hql.append(" and ps.loginName in ");
		}else {//一线人员
			hql.append(" and ps.loginName not in ");
		}
		//下面语句是找到领导角色的用户
		hql.append("(select os.loginName from AcUserRole ar, "
				+ "OmUser os where ar.userId=os.userId and ar.roleId in(select "
				+ "ac.roleId from AcRole ac where ac.roleCode='PSH_PGJS' or ac.roleCode='PSH_QJGLY'))");
		
		List<PshInstallRecord> List=pshInstallRecordDao.find(hql.toString(), values);
		if (List!=null && List.size()>0) {
			return PshInstallRecordConvertor.convertVoListToFormList(List);
		}
		return null;
	}
	
	*//**
	 * 查找某区安装的用户
	 *//*
	@Transactional(readOnly = true)
	public Page<PshInstallRecordForm> searchForUser(Page<PshInstallRecordForm> page,PshInstallRecordForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from PshInstallRecord ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		// 查询条件
		if(form != null){
//			if(form.getDirectOrgId()!=null && !"".equals(form.getDirectOrgId())){
//				hql.append(" and ps.parentOrgId=:did");
//				values.put("did", form.getDirectOrgId());
//			}
			if(form.getDirectOrgName()!=null && !"".equals(form.getDirectOrgName())){
				//20171117改为都按照市区查
				hql.append(" and (ps.directOrgName like :dn or ps.superviseOrgName like :dn or ps.parentOrgName like :dn)");
				values.put("dn", "%"+form.getDirectOrgName()+"%");
			}
		}
		// 执行分页查询操作
		Page pg = pshInstallRecordDao.findPage(page, hql.toString(), values);
		// 转换为Form对象列表并赋值到原分页对象中
		List<PshInstallRecordForm> installList = PshInstallRecordConvertor.convertVoListToFormList(pg.getResult());
		if (installList!=null && installList.size()>0) {//有值，标识改机构有用户安装过
			//然后根据loginName去匹配,找到具体的用户，然后回填手机
			String [] lgStrings=new String[1];
			for(PshInstallRecordForm i:installList){
				lgStrings[0]=i.getLoginName();
				List<OmUserForm> userList=omUserService.getActivityUsersByLoginNames(lgStrings);
				if (userList!=null && userList.size()>0) {
					OmUserForm ou=userList.get(0);
					i.setPhone(ou.getMobile());
					i.setJob(ou.getTitle());
				}
			}
		}
		
		PageUtils.copy(pg, installList, page);
		return page;
	}
	
	*//**
	 * 根据机构ID查找 用户列表
	 *//*
	public List<OmUserForm> getUsesByOrgId(Long OrgId,boolean roleType) {
		StringBuffer hql=new StringBuffer("select distinct t2.* from " +
				"(select * from OM_ORG start with org_id in (?) connect by prior org_id = parent_org_id) t left join " +
				"(select * from om_user_org) t1 on t.org_id = t1.org_id left join " +
				"(select * from om_user) t2 on t1.user_id =t2.user_id" +
				" where t2.user_id is not null");
		if (roleType) {//领导
			hql.append(" and t2.login_Name in ");
		}else {//一线人员
			hql.append(" and t2.login_Name not in ");
		}
		//下面语句是找到领导角色的用户
		hql.append("(select os.login_Name from Ac_User_Role ar, "
				+ "Om_User os where ar.user_Id=os.user_Id and ar.role_Id in(select "
				+ "ac.role_Id from Ac_Role ac where ac.role_code='PSH_PGJS' or ac.role_code='PSH_QJGLY'))");
		hql.append(" and t2.login_Name !='aosadmin' ");
		hql.append(" order by t2.sort_No");
		List<OmUser>  list = pshInstallRecordDao.createSQLQuery(hql.toString(), new Object[]{OrgId}).addEntity(OmUser.class).list();
		
		return OmUserConverter.convertToFormList(list);
	}
	
	*//**
	 * 获取第四级机构记录
	 * 只获取psh机构
	 * *//*
	public OmOrgForm getOmorgByOrgName(String OrgName) {
		StringBuffer hql = new StringBuffer("from OmOrg r where r.orgCode like'%PSH%' and r.orgLevel='4' ");
		if (OrgName!=null && !"".equals(OrgName)) {
			Map<String,String> value=new HashMap<String,String>();
			hql.append(" and r.orgName like :on");
			value.put("on","%"+OrgName+"%");
			List<OmOrg> omOrg = pshInstallRecordDao.find(hql.toString(), value);
			if(omOrg!=null && omOrg.size()>0){
				return OmOrgConverter.convertToForm(omOrg.get(0));
			}
		}
		return null;
	}
	*//**
	 * 获取5以后级别
	 * *//*
	public OmOrgForm getByOrgNameUp4(String OrgName) {
		StringBuffer hql = new StringBuffer("from OmOrg r where r.orgCode like'%PSH%' and r.orgLevel>3 ");
		if (OrgName!=null && !"".equals(OrgName)) {
			Map<String,String> value=new HashMap<String,String>();
			hql.append(" and r.orgName like :on");
			value.put("on","%"+OrgName+"%");
			List<OmOrg> omOrg = pshInstallRecordDao.find(hql.toString(), value);
			if(omOrg!=null && omOrg.size()>0){
				return OmOrgConverter.convertToForm(omOrg.get(0));
			}
		}
		return null;
	}

	*//**
	 * 获取所有的用户
	 *//*
	public List<OmUserForm> getAllUses(boolean roleType) {
		StringBuffer hql = new StringBuffer("select ps from OmUser ps where 1=1");
		//过滤一下没有组织的人员
		hql.append(" and ps.userId in(select bb.userId from OmUserOrg bb,OmOrg og where bb.orgId=og.orgId and og.orgCode like '%PSH%')");
		if (roleType) {//领导
			hql.append(" and ps.loginName in ");
		}else {//一线人员
			hql.append(" and ps.loginName not in ");
		}
		//下面语句是找到领导角色的用户
		hql.append("(select os.loginName from AcUserRole ar, "
				+ "OmUser os where ar.userId=os.userId and ar.roleId in(select "
				+ "ac.roleId from AcRole ac where ac.roleCode='PSH_PGJS' or ac.roleCode='PSH_QJGLY'))");
		hql.append(" and ps.loginName !='aosadmin' ");
		hql.append(" order by ps.sortNo");
		List<OmUser> omusers = pshInstallRecordDao.find(hql.toString());
		
		return OmUserConverter.convertToFormList(omusers);
	}

	*//**
	 * 根据设备id查找
	 * *//*
	@Override
	public List<PshInstallRecordForm> getByLnOrDc(String loginName,String devicecode) {
		if (devicecode!=null && !"".equals(devicecode)) {
			String hql = "from PshInstallRecord ps where ps.loginName=? or ps.deviceCode=?";
			List<PshInstallRecord> inst = pshInstallRecordDao.find(hql,loginName,devicecode);
			if (inst!=null && inst.size()>0) {
				return PshInstallRecordConvertor.convertVoListToFormList(inst);
			}
		}else if (devicecode==null && loginName!=null && !"".equals(loginName)) {
			String hql = "from PshInstallRecord ps where ps.loginName=? ";
			List<PshInstallRecord> inst = pshInstallRecordDao.find(hql,loginName);
			if (inst!=null && inst.size()>0) {
				return PshInstallRecordConvertor.convertVoListToFormList(inst);
			}
		}
		return null;
	}
	
	*//**
	 * 获取安装或未安装所有的用户
	 *//*
	public List<OpuOmUserInfo> getUsesByIsinstalled(boolean flag,Long OrgId,boolean roleType) {
		List<OpuOmUserInfo>  omusers = null;
		if(OrgId!=null && !"".equals(OrgId)){//按区来查询
			StringBuffer hql = new StringBuffer("select distinct t2.* from " +
					"(select * from OPU_OM_ORG start with org_id in (?) connect by prior org_id = parent_org_id) t left join " +
					"(select * from OPU_om_user_org) t1 on t.org_id = t1.org_id left join " +
					"(select * from OPU_om_user) t2 on t1.user_id =t2.user_id" +
					" where t2.user_id is not null ");
			if (flag) {//查找安装用户
				hql.append(" and t2.login_name in (select ps.login_name from dri_psh_install_record ps) ");
			}else {
				hql.append(" and t2.login_name not in (select ps.login_name from dri_psh_install_record ps) ");
			}
			if (roleType) {//领导
				hql.append(" and t2.login_Name in ");
			}else {//一线人员
				hql.append(" and t2.login_Name not in ");
			}
			//下面语句是找到领导角色的用户
			hql.append("(select os.login_Name from Ac_User_Role ar, "
					+ "Om_User os where ar.user_Id=os.user_Id and ar.role_Id in(select "
					+ "ac.role_Id from Ac_Role ac where ac.role_code='PSH_PGJS' or ac.role_code='PSH_QJGLY'))");
			hql.append(" and t2.login_Name !='aosadmin' ");
			hql.append(" order by t2.sort_No");
			omusers=pshInstallRecordDao.createSQLQuery(hql.toString(), new Object[]{OrgId}).addEntity(OmUser.class).list();
		}else {//按全市查询
			StringBuffer hql = new StringBuffer("select omuser from OmUser omuser where omuser.loginName "
					+ " not in(select ps.loginName from PshInstallRecord ps)");
			if (flag) {//查找安装用户
				hql=new StringBuffer("select omuser from OmUser omuser where omuser.loginName "
						+ " in(select ps.loginName from PshInstallRecord ps)");
			}
			//过滤一下没有组织的人员
			hql.append(" and omuser.userId in(select bb.userId from OmUserOrg bb,OmOrg og where bb.orgId=og.orgId and og.orgCode like '%PSH%')");
			if (roleType) {//领导
				hql.append(" and omuser.loginName in ");
			}else {//一线人员
				hql.append(" and omuser.loginName not in ");
			}
			//下面语句是找到领导角色的用户
			hql.append("(select os.loginName from AcUserRole ar, "
					+ "OmUser os where ar.userId=os.userId and ar.roleId in(select "
					+ "ac.roleId from AcRole ac where ac.roleCode='PSH_PGJS' or ac.roleCode='PSH_QJGLY'))");
			hql.append(" and omuser.loginName !='aosadmin' ");
			hql.append(" order by omuser.sortNo ");
			omusers = pshInstallRecordDao.find(hql.toString());
			
		}
		return OmUserConverter.convertToFormList(omusers);
	}

	*//**
	 * 根据登录用户删除
	 * **//*
	@Override
	public void deleteByLoginName(String loginName) {
		if (loginName!=null && !"".equals(loginName)) {
			pshInstallRecordDao.createSQLQuery("delete from psh_install_record t where t.login_name=?", loginName).executeUpdate();
		}
	}
	
	*//***
	 * 查找区以外的人员
	 * *//*
	public List<OmUserForm> getOverAreaUser(){
		String hql = "select a from OmUser a, OmUserOrg b  where  a.userId=b.userId and b.orgId in"
				+ "(select c.orgId from OmOrg c where (c.orgLevel='1' or c.orgLevel='2' or c.orgLevel='3') and c.orgCode like '%PSH%') "
				+ "  and a.loginName !='aosadmin'"
				+ " order by a.sortNo";
		List<OmUser> inst = pshInstallRecordDao.find(hql);
		if (inst!=null && inst.size()>0) {
			List<OmUserForm> list=OmUserConverter.convertToFormList(inst);
			return list;
		}
		return null;
	}
	
	*//***
	 * 查找区以外的人员
	 * *//*
	public List<OmUserForm> getOverAreaUserInstalled(Boolean isInstalled){
		String hql = "select a from OmUser a, OmUserOrg b  where  a.userId=b.userId and b.orgId in"
				+ "(select c.orgId from OmOrg c where  (c.orgLevel='1' or c.orgLevel='2' or c.orgLevel='3') and c.orgCode like '%PSH%') ";
		if (isInstalled) {
			hql+= " and a.loginName in(select ps.loginName from PshInstallRecord ps)";
		}else {
			hql+= " and a.loginName not in(select ps.loginName from PshInstallRecord ps)";
		}
		hql+=" and a.loginName !='aosadmin' ";
		hql+=" order by a.sortNo ";
		List<OmUser> inst = pshInstallRecordDao.find(hql);
		if (inst!=null && inst.size()>0) {
			List<OmUserForm> list=OmUserConverter.convertToFormList(inst);
			return list;
		}
		return null;
	}
	*//**
	 * 获取领导安装率
	 * *//*
	public String getOverUserRate(Boolean ty){
		int total=0;
     	int install=0;
     	String title="市水务局";
		if (ty) {//查全市
			//得到该机构所有的用户，不管安装没有
			List<OmUserForm> omuserList=this.getAllUses(ty);
			total=omuserList!=null ?omuserList.size():0;
			//获取全部的区下面的安装用户
	     	List<PshInstallRecordForm> installList=this.getListByPOrgId(null,ty);
	     	install=installList!=null ?installList.size():0;
	     	title="全市";
		}
     	//查询市里面的人员
		JSONObject jsonObject = new JSONObject();
		List<OmUserForm> omList=this.getOverAreaUser();
		if (omList!=null && omList.size()>0) {
			total=total+(omList==null?0:omList.size());
			JSONObject jso = new JSONObject();
		 	jso.put("total", total);
		 	List<OmUserForm> omListInst=this.getOverAreaUserInstalled(true);
		 	install=install+(omListInst==null?0:omListInst.size());
		 	jso.put("install", install);
		 	JSONArray appArray2=new JSONArray();
		 	JSONObject jsonObject2 = new JSONObject();
		 	jsonObject2.put("org_name", title);
		 	jsonObject2.put("install_percent", omListInst==null?0:getBfb(Long.parseLong(""+install),total));
		 	appArray2.add(jsonObject2);
		 	jso.put("child_orgs", appArray2);
		 	
		 	jsonObject.put("data", jso);
		 	jsonObject.put("code", 200);
			jsonObject.put("message", "查询成功");
		}
		return jsonObject.toString();	
	}
	
	*//***
	 * 根据用户找到机构
	 * 优先获取备注
	 * *//*
	public String getOrgByUserId(Long userId){
		String hql = "select b from OmUserOrg a, OmOrg b  where  a.orgId=b.orgId and b.orgCode  like '%PSH%' "
				//+ " and ( b.orgLevel='1' or b.orgLevel='2' or b.orgLevel='3' or b.orgLevel='4') "
				+ " and a.userId =? order by b.orgId desc";
		List<OmOrg> inst = pshInstallRecordDao.find(hql,userId);
		if (inst!=null && inst.size()>0) {
			OmOrgForm om=OmOrgConverter.convertToForm(inst.get(0));
			return om.getRemark()==null?om.getOrgName():om.getRemark();
		}
		return null;
	}
	
	*//**
	 * 根据loginName获取队伍和直属机构、业务单位
	* *//*
	public Map<String,String> getOrgForAppInstall(String loginName){
		Map<String,String> map = new HashMap();
		OmUserOrgForm userFrom = omUserService.getFormPsh(loginName);
		if(userFrom!=null){
			List<Long> list = omOrgService.getAllParentIds(userFrom.getOrgId());
			for(Long id : list){
				OmOrgForm from = omOrgService.getOrgWithParentInfo(id);
				if ("32".equals(from.getOrgGrade())) {// 区级机构
					map.put("parentOrgId",from.getOrgId().toString());
					map.put("parentOrgName",from.getOrgName());
				}else if("33".equals(from.getOrgGrade())){ //镇街单位
					map.put("teamOrgId",from.getOrgId().toString());
					map.put("teamOrgName",from.getOrgName());
				}else if("34".equals(from.getOrgGrade())){ //维管单位
					map.put("directOrgId",from.getOrgId().toString());
					map.put("directOrgName",from.getOrgName());
				}
			}
		}
		return map;
	}*/
 }