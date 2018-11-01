package com.augurit.awater.dri.installRecord.service.impl;

import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.agcloud.opus.common.domain.OpuOmUser;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.org.rest.service.IOmRsRoleRestService;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.agcloud.org.rest.service.IOmUserRestService;
import com.augurit.agcloud.org.service.IPsOrgUserService;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.installRecord.convert.InstallRecordConvertor;
import com.augurit.awater.dri.installRecord.dao.InstallRecordDao;
import com.augurit.awater.dri.installRecord.entity.InstallRecord;
import com.augurit.awater.dri.installRecord.service.IInstallRecordService;
import com.augurit.awater.dri.installRecord.web.form.InstallRecordForm;
import com.augurit.awater.dri.installRecord.web.form.OrgNameForm;
import com.augurit.awater.dri.utils.JsonOfForm;
import com.augurit.awater.util.PropertyFilter;
import com.augurit.awater.util.page.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.hibernate.Query;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
@Transactional
public class InstallRecordServiceImpl implements IInstallRecordService {

	@Autowired
	private InstallRecordDao installRecordDao;
	@Autowired
	private IOmOrgRestService omOrgRestService;
	@Autowired
	private IOmUserRestService omUserRestService;
	@Autowired
	private IOmUserInfoRestService omUserInfoRestService;
	@Autowired
	private IOmRsRoleRestService omRsRoleRestService;
	@Autowired
	private IPsOrgUserService psOrgUserService;
	@Autowired
	private JdbcTemplate jdbcTemplate;
	/**
	 * 根据主键获取Form对象0
	 */
	@Transactional(readOnly = true)
	public InstallRecordForm get(Long id) {
		InstallRecord entity = installRecordDao.get(id);
		return InstallRecordConvertor.convertVoToForm(entity);
	}

	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		installRecordDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(InstallRecordForm... forms) {
		if(forms != null)
			for(InstallRecordForm form : forms)
				this.save(form);
	}

	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(InstallRecordForm form){

		if(form != null){
			InstallRecord entity = null;

			//准备VO对象
			if(form != null && form.getId() != null){
				entity = installRecordDao.get(form.getId());
			}else{
				entity = new InstallRecord();
			}

			//属性值转换
			InstallRecordConvertor.convertFormToVo(form, entity);

			//保存
			installRecordDao.save(entity);

			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<InstallRecordForm> search(Page<InstallRecordForm> page, InstallRecordForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from InstallRecord ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();

		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));

		// 执行分页查询操作
		Page pg = installRecordDao.findPage(page, hql.toString(), values);

		// 转换为Form对象列表并赋值到原分页对象中
		List<InstallRecordForm> list = InstallRecordConvertor.convertVoListToFormList(pg.getResult());


		PageUtils.copy(pg, list, page);
		return page;
	}

	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<InstallRecordForm> search(Page<InstallRecordForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<InstallRecord> pg = installRecordDao.findPage(page, filters);

		// 转换为Form对象列表并赋值到原分页对象中
		List<InstallRecordForm> list = InstallRecordConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}

	/**
	 * 根据用户统计
	 * 区分一线或领导
	 * */
	@Override
	public List<OrgNameForm> getStaticByOrgId(String orgId, boolean roleType) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("select ps.parentOrgName as org_name,count(ps.parentOrgName) as install_percent from InstallRecord ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		if (orgId!=null && !"".equals(orgId)) {//存在该名称根据，do查
			//20171117改为都按照市区查
			hql.append(" and ps.parentOrgId=:poi");
			values.put("poi", orgId);
		}
		hql.append(" and ps.parentOrgName is not null");
		if (roleType) {//领导
			hql.append(" and ps.loginName in ");
		}else {//一线人员
			hql.append(" and ps.loginName not in ");
		}
		//下面语句是找到领导角色的用户
		List<OpuOmUser> psGc = psOrgUserService.getUsersByRoleCode("ps_gc");
		List<OpuOmUser> psManager =psOrgUserService.getUsersByRoleCode("ps_manager");
		List<String> loginNames = new ArrayList();
		if(psGc!=null && psGc.size()>0){
			for(OpuOmUser user: psGc){
				loginNames.add(user.getLoginName());
			}
		}
		if(psManager!=null && psManager.size()>0){
			for(OpuOmUser user: psManager){
				loginNames.add(user.getLoginName());
			}
		}
		if(loginNames.size()>0){
			hql.append(" (:loginNames) ");
			values.put("loginNames",loginNames);
		}
		hql.append(" group by ps.parentOrgName");
		List<Object[]> List=installRecordDao.find(hql.toString(), values);
		List<OrgNameForm> orgList=new ArrayList<>();
		if (List!=null && List.size()>0) {
			Long orgId1=null;
			Long installs=0l;//安装人数
			int omCount=0;//总人数
			//传了id就查一次就行
			if(orgId!=null && !"".equals(orgId)){
				//获取当前区安装的人数
				List<OpuOmUser> omUserInsList=this.getUsesByIsinstalled(true,orgId,roleType);
				int install=omUserInsList==null?0:omUserInsList.size();
				installs=Long.parseLong(install+"");
				//获取当前区总人数
				List<OpuOmUser> omList=this.getUsesByOrgId(orgId,roleType);
				if (omList!=null && omList.size()>0) {
					omCount=omList.size();
				}
			}
			for(Object[] o:List){
				OrgNameForm org=new OrgNameForm();
				org.setOrg_name((String)o[0]);
				//如果什么都不传，根据里面的二级目录找到总人数
				if (orgId==null) {
					String ordId2=null;
					OpuOmOrg om=this.getOmorgByOrgName((String)o[0]);
					if (om!=null) {
						ordId2=om.getOrgId();
						//获取当前区安装的人数
						List<OpuOmUser> omUserInsList=this.getUsesByIsinstalled(true,ordId2,roleType);
						int install=omUserInsList==null?0:omUserInsList.size();
						installs=Long.parseLong(install+"");
						//获取当前区总人数
						List<OpuOmUser> omList=this.getUsesByOrgId(ordId2,roleType);
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
	/**
	 * 获取百分百
	 * **/
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
	/**
	 * 获取安装用户
	 * */
	@Override
	public List<InstallRecordForm> getListByPOrgId(String porgId,boolean roleType) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from InstallRecord ps where 1=1");
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
		List<OpuOmUser> psGc = psOrgUserService.getUsersByRoleCode("ps_gc");
		List<OpuOmUser> psManager =psOrgUserService.getUsersByRoleCode("ps_manager");
		List<String> loginNames = new ArrayList();
		if(psGc!=null && psGc.size()>0){
			for(OpuOmUser user: psGc){
				loginNames.add(user.getLoginName());
			}
		}
		if(psManager!=null && psManager.size()>0){
			for(OpuOmUser user: psManager){
				loginNames.add(user.getLoginName());
			}
		}
		if(loginNames.size()>0){
			hql.append(" (:loginNames) ");
			values.put("loginNames",loginNames);
		}
		List<InstallRecord> List=installRecordDao.find(hql.toString(), values);
		if (List!=null && List.size()>0) {
			return InstallRecordConvertor.convertVoListToFormList(List);
		}
		return null;
	}

	/**
	 * 查找某区安装的用户
	 */
	@Transactional(readOnly = true)
	public Page<InstallRecordForm> searchForUser(Page<InstallRecordForm> page,InstallRecordForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from InstallRecord ps where 1=1");
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
		Page pg = installRecordDao.findPage(page, hql.toString(), values);
		// 转换为Form对象列表并赋值到原分页对象中
		List<InstallRecordForm> installList = InstallRecordConvertor.convertVoListToFormList(pg.getResult());
		if (installList!=null && installList.size()>0) {//有值，标识改机构有用户安装过
			//然后根据loginName去匹配,找到具体的用户，然后回填手机
			String [] lgStrings=new String[1];
			for(InstallRecordForm i:installList){
				Map userinfo = omUserInfoRestService.getOpuOmUserInfoByUserId(i.getLoginName());
				i.setPhone(userinfo.get("userMobile").toString());
				i.setJob(userinfo.get("userTitle").toString());
			}
			/*for(InstallRecordForm i:installList){
				lgStrings[0]=i.getLoginName();
				List<OpuOmUser> userList=omUserRestService.getActivityUsersByLoginNames(lgStrings);
				if (userList!=null && userList.size()>0) {
					OpuOmUser ou=userList.get(0);
					i.setPhone(ou.getMobile());
					i.setJob(ou.getTitle());
				}
			}*/
		}
		PageUtils.copy(pg, installList, page);
		return page;
	}

	/**
	 * 根据机构ID查找 用户列表
	 */
	public List<OpuOmUser> getUsesByOrgId(String OrgId, boolean roleType) {
        List<Object> listObj = new ArrayList<>();
        List<OpuOmUser> list =  new ArrayList<>();
        //下面语句是找到领导角色的用户
        List<OpuOmUser> psGc = psOrgUserService.getUsersByRoleCode("ps_gc");
        List<OpuOmUser> psManager =psOrgUserService.getUsersByRoleCode("ps_manager");
        Map<String,OpuOmUser> map = new HashMap();
        StringBuffer sqlStr=new StringBuffer("select t2.*,t3.user_mobile from " +
                "(select * from opu_OM_ORG start with org_id in (?) connect by prior org_id = parent_org_id) t left join " +
                "(select * from opu_om_user_org) t1 on t.org_id = t1.org_id left join " +
                "(select * from opu_om_user) t2 on t1.user_id =t2.user_id left join " +
                "(select * from opu_om_user_info) t3 on t3.user_id =t2.user_id " +
                " where t2.user_id is not null");
        listObj.add(OrgId);
        if(psGc!=null && psGc.size()>0){
			for(OpuOmUser user:psGc){
				map.put(user.getUserId(),user);
			}
		}
		if(psManager!=null && psManager.size()>0){
			for(OpuOmUser user:psManager){
				map.put(user.getUserId(),user);
			}
		}
		for(String usKey : map.keySet()){
		    list.add(map.get(usKey));
        }
		if(list!=null && list.size()>0){
            if (roleType) {//领导
                sqlStr.append(" and t2.login_Name in (");
                String usa = "";
                for(OpuOmUser us: list){
                    if(usa=="")
                        usa+="?";
                    else
                        usa+=",?";
                    listObj.add(us.getLoginName());
                }
                sqlStr.append(usa+")");
            }else {//一线人员
                sqlStr.append(" and t2.login_Name not in (");
                String usa = "";
                for(OpuOmUser us: list){
                    if(usa=="")
                        usa+="?";
                    else
                        usa+=",?";
                    listObj.add(us.getLoginName());
                }
                sqlStr.append(usa+")");
            }
            return (List<OpuOmUser>) JsonOfForm.listMapToForm( installRecordDao.createSQLQuery(sqlStr.toString(),listObj.toArray()).
                    setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP).list(),OpuOmUser.class);
        }
        return null;
	}

	public List<OpuOmUserInfo> getUsesInfoByOrgId(String OrgId, boolean roleType) {
		List<Object> listObj = new ArrayList<>();
		List<OpuOmUser> list =  new ArrayList<>();
		//下面语句是找到领导角色的用户
		List<OpuOmUser> psGc = psOrgUserService.getUsersByRoleCode("ps_gc");
		List<OpuOmUser> psManager =psOrgUserService.getUsersByRoleCode("ps_manager");
		Map<String,OpuOmUser> map = new HashMap();
		StringBuffer sqlStr=new StringBuffer("select distinct t2.* from " +
				"(select * from opu_OM_ORG start with org_id in (?) connect by prior org_id = parent_org_id) t left join " +
				"(select * from opu_om_user_org) t1 on t.org_id = t1.org_id left join " +
				"(select * from opu_om_user_info) t2 on t1.user_id =t2.user_id left join " +
				"(select * from opu_om_user) t3 on t3.user_id =t2.user_id" +
				" where t2.user_id is not null");
		listObj.add(OrgId);
		if(psGc!=null && psGc.size()>0){
			for(OpuOmUser user:psGc){
				map.put(user.getUserId(),user);
			}
		}
		if(psManager!=null && psManager.size()>0){
			for(OpuOmUser user:psManager){
				map.put(user.getUserId(),user);
			}
		}
		for(String usKey : map.keySet()){
			list.add(map.get(usKey));
		}
		if(list!=null && list.size()>0){
			if (roleType) {//领导
				sqlStr.append(" and t3.login_Name in (");
				String usa = "";
				for(OpuOmUser us: list){
					if(usa=="")
						usa+="?";
					else
						usa+=",?";
					listObj.add(us.getLoginName());
				}
				sqlStr.append(usa+")");
			}else {//一线人员
				sqlStr.append(" and t3.login_Name not in (");
				String usa = "";
				for(OpuOmUser us: list){
					if(usa=="")
						usa+="?";
					else
						usa+=",?";
					listObj.add(us.getLoginName());
				}
				sqlStr.append(usa+")");
			}
			return (List<OpuOmUserInfo>) JsonOfForm.listMapToForm( installRecordDao.createSQLQuery(sqlStr.toString(),listObj.toArray()).
					setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP).list(),OpuOmUserInfo.class);
		}
		return null;
	}

	/**
	 * 获取第四级机构记录
	 * */
	public OpuOmOrg getOmorgByOrgName(String OrgName) {
		StringBuffer sql = new StringBuffer("select * from Opu_Om_Org r where r.org_rank='14' and r.org_type not like '%PSH%' and r.org_Rank is not null");
		if (OrgName!=null && !"".equals(OrgName)) {
			sql.append(" and r.org_Name like ?");
			Query query = installRecordDao.createSQLQuery(sql.toString(), "%"+OrgName+"%");
			List<OpuOmOrg> omOrg = (List<OpuOmOrg>)JsonOfForm.listMapToForm(
					query.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP).list(),OpuOmOrg.class);
			if(omOrg!=null && omOrg.size()>0){
				return omOrg.get(0);
			}
		}
		return null;
	}
	/**
	 * 获取5以后级别
	 * */
	public OpuOmOrg getByOrgNameUp4(String OrgName) {
		StringBuffer hql = new StringBuffer("from OpuOmOrg r where r.orgLevel>3 and r.orgRank not like '%PSH%' and r.orgRank is not null");
		if (OrgName!=null && !"".equals(OrgName)) {
			Map<String,String> value=new HashMap<String,String>();
			hql.append(" and r.orgName like :on");
			value.put("on","%"+OrgName+"%");
			List<OpuOmOrg> omOrg = installRecordDao.find(hql.toString(), value);
			if(omOrg!=null && omOrg.size()>0){
				return omOrg.get(0);
			}
		}
		return null;
	}

	/**
	 * 获取所有的用户
	 */
	public List<OpuOmUser> getAllUses(boolean roleType) {
		StringBuffer hql = new StringBuffer("select ps.* from Opu_Om_User ps where 1=1");
		//过滤一下没有组织的人员
		hql.append(" and ps.user_Id in(select bb.user_Id from Opu_Om_User_Org bb,Opu_Om_Org og where bb.org_Id=og.org_Id "
				+ "and (og.org_type='swj') and og.org_Rank not like '%PSH%')");
		if (roleType) {//领导
			hql.append(" and ps.login_Name in ");
		}else {//一线人员
			hql.append(" and ps.login_Name not in ");
		}
		//下面语句是找到领导角色的用户
		hql.append("(select os.login_Name from Opu_Ac_Role_User ar, "
				+ "Opu_Om_User os where ar.user_Id=os.user_Id and ar.role_Id in(select "
				+ "ac.role_Id from Opu_Rs_Role ac where ac.role_Code='ps_gc' or ac.role_Code='ps_manager'))");
		hql.append(" and ps.login_Name !='aosadmin' ");
		Query query= installRecordDao.createSQLQuery(hql.toString());
		query.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
		List<OpuOmUser> omusers = (List<OpuOmUser>)JsonOfForm.listMapToForm(query.list(),OpuOmUser.class);
		return omusers;
	}

	/**
	 * 根据设备id查找
	 * */
	@Override
	public List<InstallRecordForm> getByLnOrDc(String loginName,String devicecode) {
		if (devicecode!=null && !"".equals(devicecode)) {
			String hql = "from InstallRecord ps where ps.loginName=? or ps.deviceCode=?";
			List<InstallRecord> inst = installRecordDao.find(hql,loginName,devicecode);
			if (inst!=null && inst.size()>0) {
				return InstallRecordConvertor.convertVoListToFormList(inst);
			}
		}else if (devicecode==null && loginName!=null && !"".equals(loginName)) {
			String hql = "from InstallRecord ps where ps.loginName=? ";
			List<InstallRecord> inst = installRecordDao.find(hql,loginName);
			if (inst!=null && inst.size()>0) {
				return InstallRecordConvertor.convertVoListToFormList(inst);
			}
		}
		return null;
	}

	/**
	 * 获取安装或未安装所有的用户
	 */
	public List<OpuOmUser> getUsesByIsinstalled(boolean flag, String orgId, boolean roleType) {
        List<OpuOmUser>  omusers = null;
        Map values = new HashMap();
        if(orgId!=null && !"".equals(orgId)){//按区来查询
			List<String> userLoginNames = new ArrayList<>();
			/*List<OpuOmUserInfo>  listUsers = omUserInfoRestService.listOpuOmUserInfoByOrgId(orgId.toString());
			if(listUsers!=null&&listUsers.size()>0){
				for(OpuOmUserInfo userInfo :listUsers)
					userLoginNames.add(userInfo.getLoginName());
			}*/
			List<OpuOmUser> opuOmUserList = this.getUsesByOrgId(orgId,roleType);
			List<String> userIds = new ArrayList<>();
			for(OpuOmUser opuOmUser : opuOmUserList) {
				userIds.add(opuOmUser.getUserId());
			}
			List<OpuOmUser> installList = new ArrayList<>();
			for(OpuOmUser omUser:opuOmUserList) {
				List<InstallRecordForm> installRecordFormList = this.getByLnOrDc(omUser.getLoginName(),null);
				if(installRecordFormList!=null && installRecordFormList.size()>0) {
					installList.add(omUser);
				}
			}
            if(installList!=null&&installList.size()>0){
                for(OpuOmUser userInfo :installList)
                    userLoginNames.add(userInfo.getLoginName());
            }
            StringBuffer hql = new StringBuffer("from InstallRecord ps where 1=1 ");
            hql.append(" and ps.loginName in(:loginName) ");
            values.put("loginName",userLoginNames);
            if (roleType) {//领导
                hql.append(" and ps.loginName in ");
            }else {//一线人员
                hql.append(" and ps.loginName not in ");
            }
            //下面语句是找到领导角色的用户
            List<OpuOmUser> psGc = psOrgUserService.getUsersByRoleCode("ps_gc");
            List<OpuOmUser> psManager =psOrgUserService.getUsersByRoleCode("ps_manager");
            List<String> loginNames = new ArrayList();
            if(psGc!=null && psGc.size()>0){
                for(OpuOmUser user: psGc){
                    loginNames.add(user.getLoginName());
                }
            }
            if(psManager!=null && psManager.size()>0){
                for(OpuOmUser user: psManager){
                    loginNames.add(user.getLoginName());
                }
            }
            if(loginNames.size()>0){
                hql.append(" (:loginNames) ");
                values.put("loginNames",loginNames);
            }
            hql.append(" and ps.loginName !='aosadmin' ");
            List<InstallRecord> listInstall =installRecordDao.find(hql.toString(), values);
            List<Object> listValue = new ArrayList<>();
            StringBuffer sql = new StringBuffer("select s.*,ui.user_mobile from opu_om_user s, opu_om_user_info ui "
					+ "where s.user_id=ui.user_id ");
            sql.append(" and s.user_id in (");
            String str = "";
            for (String userId:userIds) {
				if(str=="")
					str+="?";
				else
					str+=",?";
				listValue.add(userId);
			}
            sql.append(str + ") and 1=1 ");
            if (flag) {//查找安装用户
                sql.append(" and s.login_name in ( ");
                String sqlStr = "";
                for(InstallRecord ins :listInstall){
                    if(sqlStr=="")
                        sqlStr+="?";
                    else
                        sqlStr+=",?";
                    listValue.add(ins.getLoginName());
                }
                sql.append(sqlStr+") ");
            }else {
                sql.append(" and s.login_name not in ( ");
                String sqlStr = "";
                for(InstallRecord ins :listInstall){
                    if(sqlStr=="")
                        sqlStr+="?";
                    else
                        sqlStr+=",?";
                    listValue.add(ins.getLoginName());
                }
                sql.append(sqlStr+")");
            }
            omusers = (List<OpuOmUser>) JsonOfForm.listMapToForm(installRecordDao.createSQLQuery(sql.toString(),listValue.toArray())
                    .setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP).list(),OpuOmUser.class);
		}else {//按全市查询
			List<Object> listObject = new ArrayList<>();
			StringBuffer hql = new StringBuffer("select omuser.*,ui.user_mobile from Opu_Om_User omuser,Opu_Om_User_info ui "
					+ "where omuser.user_id = ui.user_id and omuser.login_Name not in(select ps.login_Name from DRI_Install_Record ps)");
			if (flag) {//查找安装用户
				hql=new StringBuffer("select omuser.* ,ui.user_mobile from Opu_Om_User omuser,Opu_Om_User_info ui "
						+ "where omuser.user_id = ui.user_id and omuser.login_Name "
						+ " in(select ps.login_Name from DRI_Install_Record ps)");
			}
			//过滤一下没有组织的人员
			hql.append(" and omuser.user_Id in(select bb.user_Id from Opu_Om_User_Org bb,Opu_Om_Org og where bb.org_Id=og.org_Id "
					+ "and (og.org_Type='swj')  and og.org_Rank not like '%PSH%' )");
			if (roleType) {//领导
				hql.append(" and omuser.login_Name in ");
			}else {//一线人员
				hql.append(" and omuser.login_Name not in ");
			}
			//下面语句是找到领导角色的用户
			List<OpuOmUser> psGc = psOrgUserService.getUsersByRoleCode("ps_gc");
			List<OpuOmUser> psManager =psOrgUserService.getUsersByRoleCode("ps_manager");
			List<String> loginNames = new ArrayList();
			if(psGc!=null && psGc.size()>0){
				for(OpuOmUser user: psGc){
					loginNames.add(user.getLoginName());
				}
			}
			if(psManager!=null && psManager.size()>0){
				for(OpuOmUser user: psManager){
					loginNames.add(user.getLoginName());
				}
			}
			if(loginNames.size()>0){
				hql.append(" ( ");
				String loginNameQuery = "";
				for(String lo :loginNames){
					if(loginNameQuery==""){
						loginNameQuery+="?";
					}else{
						loginNameQuery+=",?";
					}
					listObject.add(lo);
				}
				hql.append(loginNameQuery+")");
				//values.put("loginNames",loginNames);
			}
			hql.append(" and omuser.login_Name !='aosadmin' ");
			List list = installRecordDao.createSQLQuery(hql.toString(),listObject.toArray()).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP).list();
			omusers = (List<OpuOmUser>) JsonOfForm.listMapToForm(list,OpuOmUser.class);
		}
		return omusers;
	}

	/**
	 * 根据登录用户删除
	 * **/
	@Override
	public void deleteByLoginName(String loginName) {
		if (loginName!=null && !"".equals(loginName)) {
			installRecordDao.createSQLQuery("delete from Install_Record t where t.login_name=?", loginName).executeUpdate();
		}
	}

	/***
	 * 查找区以外的人员
	 * */
	public List<OpuOmUser> getOverAreaUser(){
		String hql = "select a.*,i.user_mobile from Opu_Om_User a, Opu_Om_User_Org b, Opu_Om_User_Info i where  a.user_Id=b.user_Id and a.user_id=i.user_id and b.org_Id in"
				+ "(select c.org_Id from Opu_Om_Org c where (c.org_Level='1' or c.org_Level='2' or c.org_Level='3') "
				+ "and (c.org_Type='swj')  and c.org_Code not like '%PSH%') "
				+ "  and a.login_Name !='aosadmin'";
		List<OpuOmUser> inst = (List<OpuOmUser>)JsonOfForm.listMapToForm(installRecordDao.createSQLQuery(hql)
				.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP).list(),OpuOmUser.class);
		if (inst!=null && inst.size()>0) {
			return inst;
		}
		return null;
	}

	public List<OpuOmUserInfo> getOverAreaUserInfo(){
		String hql = "select a.* from Opu_Om_User a, Opu_Om_User_Org b  where  a.user_Id=b.user_Id and b.org_Id in"
				+ "(select c.org_Id from Opu_Om_Org c where (c.org_Level='1' or c.org_Level='2' or c.org_Level='3') "
				+ "and (c.org_Type='swj')  and c.org_Code not like '%PSH%') "
				+ "  and a.login_Name !='aosadmin'";
		Query query = installRecordDao.createSQLQuery(hql.toString());
		query.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
		List<OpuOmUserInfo> omUserList = (List<OpuOmUserInfo>)JsonOfForm.listMapToForm(query.list(),OpuOmUser.class);
		if (omUserList!=null && omUserList.size()>0) {
			return omUserList;
		}
		return null;
	}

	/***
	 * 查找区以外的人员
	 * */
	public List<OpuOmUser> getOverAreaUserInstalled(Boolean isInstalled){
		String hql = "select a.*,ui.user_mobile from Opu_Om_User a, Opu_Om_User_info ui, Opu_Om_User_Org b "
				+ "where a.user_Id=ui.user_id and a.user_Id=b.user_Id and b.org_Id in"
				+ "(select c.org_Id from Opu_Om_Org c where  (c.org_Level='1' or c.org_Level='2' or c.org_Level='3')  "
				+" and c.org_Code not like '%PSH%')";
		if (isInstalled) {
			hql+= " and a.login_Name in(select ps.login_Name from DRI_Install_Record ps)";
		}else {
			hql+= " and a.login_Name not in(select ps.login_Name from DRI_Install_Record ps)";
		}
		hql+=" and a.login_Name !='aosadmin' ";
		Query query =  installRecordDao.createSQLQuery(hql.toString());
		List<Map<String,Object>> listMap =  query.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP).list();
		List<OpuOmUser> inst = (List<OpuOmUser>) JsonOfForm.listMapToForm(listMap,OpuOmUser.class);
		if (inst!=null && inst.size()>0) {
			return inst;
		}
		return null;
	}
	/**
	 * 获取领导安装率
	 * */
	public String getOverUserRate(Boolean ty){
		int total=0;
		int install=0;
		String title="市水务局";
		if (ty) {//查全市
			//得到该机构所有的用户，不管安装没有
			List<OpuOmUser> omuserList=this.getAllUses(ty);
			total=omuserList!=null ?omuserList.size():0;
			//获取全部的区下面的安装用户
			List<InstallRecordForm> installList=this.getListByPOrgId(null,ty);
			install=installList!=null ?installList.size():0;
			title="全市";
		}
		//查询市里面的人员
		JSONObject jsonObject = new JSONObject();
		List<OpuOmUser> omList=this.getOverAreaUser();
		if (omList!=null && omList.size()>0) {
			total=total+(omList==null?0:omList.size());
			JSONObject jso = new JSONObject();
			jso.put("total", total);
			List<OpuOmUser> omListInst=this.getOverAreaUserInstalled(true);
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

	/***
	 * 根据用户找到机构
	 * 优先获取备注
	 * */
	public String getOrgByUserId(Long userId){
		String hql = "select b from OpuOmUserOrg a, OpuOmOrg b  where  a.orgId=b.orgId and b.orgCode not like '%PSH%' "
				//+ " and ( b.orgLevel='1' or b.orgLevel='2' or b.orgLevel='3' or b.orgLevel='4') "
				+ " and a.userId =? order by b.orgId desc";
		List<OpuOmOrg> inst = installRecordDao.find(hql,userId);
		if (inst!=null && inst.size()>0) {
			OpuOmOrg om=inst.get(0);
			return om.getOrgName();
		}
		return null;
	}

	/**
	 * 根据loginName获取队伍和直属机构、业务单位
	 * */
	public Map<String,String> getOrgForAppInstall(String loginName){
		Map<String,String> map = new HashMap();
		Map userInfo = omUserInfoRestService.getOpuOmUserInfoByUserId(loginName);
		OpuOmUserInfo user = omUserInfoRestService.getOpuOmUserInfoByLoginName(loginName);
		if (user != null) {
			List<com.augurit.agcloud.opus.common.domain.OpuOmOrg> list = omOrgRestService.listOpuOmOrgByUserId(user.getUserId());
			for (com.augurit.agcloud.opus.common.domain.OpuOmOrg from : list) {
				if (("11").equals(from.getOrgRank())) {//巡查组(队伍名称)
					map.put("teamOrgId", from.getOrgId().toString());
					map.put("teamOrgName", from.getOrgName());
				} else if (("12").equals(from.getOrgRank())) {//直属机构
					map.put("directOrgId", from.getOrgId().toString());
					map.put("directOrgName", from.getOrgName());
				} else if (("13").equals(from.getOrgRank())) {//监理单位
					map.put("superviseOrgId", from.getOrgId().toString());
					map.put("superviseOrgName", from.getOrgName());
				} else if ("14".equals(from.getOrgRank())) {//业主机构
					map.put("parentOrgId", from.getOrgId().toString());
					map.put("parentOrgName", from.getOrgName());
				}

			}
		}
		return map;
	}
}