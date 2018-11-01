package com.augurit.awater.dri.psh.install.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.org.service.IPsOrgUserService;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.common.sql.SQLEntity;
import com.augurit.awater.common.sql.SQLTransformer;
import com.augurit.awater.dri.psh.install.convert.PshInstallRecordConvertor;
import com.augurit.awater.dri.psh.install.dao.PshInstallRecordDao;
import com.augurit.awater.dri.psh.install.entity.PshInstallRecord;
import com.augurit.awater.dri.psh.install.service.IPshInstallRecordService;
import com.augurit.awater.dri.psh.install.web.form.PshInstallRecordForm;
import com.augurit.awater.dri.psh.statistics.service.IStatisticsService;
import com.augurit.awater.util.PropertyFilter;
import com.augurit.awater.util.ThirdUtils;
import com.augurit.awater.util.page.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class PshInstallRecordServiceImpl implements IPshInstallRecordService {

	@Autowired
	private PshInstallRecordDao pshInstallRecordDao;
	@Autowired
	private IStatisticsService statisticsService;
	@Autowired
	private IOmOrgRestService omOrgService;
	@Autowired
	private IPsOrgUserService psOrgUserService;
	/**
	 * 根据主键获取Form对象
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
		
		// 查询条件
		if(form != null){
			if (StringUtils.isNotBlank(form.getTeamOrgName())) {
				hql.append(" and ps.teamOrgName= :tn ");
				values.put("tn", form.getTeamOrgName());
			}
			if (StringUtils.isNotBlank(form.getParentOrgName())) {
				hql.append(" and ps.parentOrgName like :pn ");
				values.put("pn", "%"+form.getParentOrgName()+"%");
			}
		}
		
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
	 * 按区获取安装数据
	 * */
	public String getInstalledByArea(){
		Map<String,Object> values = new HashMap<String,Object>();
     	StringBuffer hql = new StringBuffer("select d.parent_org_name,count(*) from psh_install_record d group by d.parent_org_name");
     	List<Object[]> list=pshInstallRecordDao.createSQLQuery(hql.toString(), values).list();
     	JSONArray jsonArray=new JSONArray();
     	//获取实际人数
		String orgList= ThirdUtils.getProperties().getProperty("orgListPsh");
		String[] orgArray=orgList.split(",");
		JSONObject jsonAll = JSONObject.fromObject(statisticsService.pshStatistics(orgArray,"qu"));
		List<JSONArray> resultlist =(List<JSONArray>) jsonAll.get("rows");
		if (list!=null && list.size()>0) {
			for(Object[] o:list){
				JSONObject jso = new JSONObject();
			 	jso.put("name", o[0]==null?"市水务":o[0]);
			 	jso.put("count", o[1]);
			 	for(JSONArray o2:resultlist){
					if((o[0]!=null?o[0].toString():"").indexOf(o2.get(0)!=null?o2.get(0).toString():"") != -1){
						jso.put("countAll", o2.get(1));
					}
				}
			 	jsonArray.add(jso);
			}
		}
		
		return jsonArray.toString();	
	}
	
	/**
	 * 按镇街获取安装数据
	 * */
	public String getInstalledByUnit(String unitName){
		Map<String,Object> values = new HashMap<String,Object>();
     	StringBuffer hql = new StringBuffer("select d.team_org_name,count(*) from psh_install_record d where d.team_org_name is not null ");
     	if(StringUtils.isNotBlank(unitName)){
     		hql.append(" and d.parent_org_name like :pn");
     		values.put("pn", "%"+unitName+"%");
		}
		hql.append(" group by d.team_org_name ");
     	List<Object[]> list=pshInstallRecordDao.createSQLQuery(hql.toString(), values).list();
     	//获取实际人数
     	List listAll = new ArrayList<>();
		if(StringUtils.isNotBlank(unitName)){
			String orgId = statisticsService.getOrgIdByOrgName(unitName,"32",null);
			if(orgId != null){
				List<OpuOmOrg> orgList = psOrgUserService.getChildOrgsByOrgId(orgId);
				for(OpuOmOrg org : orgList){
					listAll.add(org.getOrgId()+":"+org.getOrgName());
				}
			}
		}
		JSONObject jsonAll = JSONObject.fromObject(statisticsService.pshStatistics(listAll.toArray(),"zj"));
		List<JSONArray> resultlist =(List<JSONArray>) jsonAll.get("rows");
     	JSONArray jsonArray=new JSONArray();
		if (list!=null && list.size()>0) {
			for(Object[] o:list){
				JSONObject jso = new JSONObject();
				jso.put("name", o[0]==null?"区水务":o[0]);
			 	jso.put("count", o[1]);
			 	for(JSONArray o2:resultlist){
					if((o[0]!=null?o[0].toString():"").indexOf(o2.get(0)!=null?o2.get(0).toString():"") != -1 || (o[0]== null && "区水务".equals(o2.get(0)))){
						jso.put("countAll", o2.get(1));
					}
				}
			 	jsonArray.add(jso);
			}
		}
		return jsonArray.toString();	
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public String getInstalledInf(Page<PshInstallRecordForm> page, PshInstallRecordForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from PshInstallRecord ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		JSONObject json = new JSONObject();
		// 查询条件
		if(form != null){
			if (StringUtils.isNotBlank(form.getTeamOrgName())) {
				if ("区水务".equals(form.getTeamOrgName())) {
					hql.append(" and ps.teamOrgName is null ");
				}else{
					hql.append(" and ps.teamOrgName= :tn ");
					values.put("tn", form.getTeamOrgName());
				}
			}
			if (StringUtils.isNotBlank(form.getParentOrgName())) {
				hql.append(" and ps.parentOrgName like :pn ");
				values.put("pn", "%"+form.getParentOrgName()+"%");
			}
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		// 执行分页查询操作
		Page<PshInstallRecord> pg = pshInstallRecordDao.findPage(page, hql.toString(), values);
		if(pg.getResult()!=null){
			json.put("rows", pg.getResult());
			json.put("total", pg.getTotalItems());
			json.put("code", 200);
		}else{
			json.put("code", 300);
			json.put("message", "参数错误!");
		}
		return json.toString();
	}
	
	/**
	 * 按镇街获取上报数据
	 * 动态获取机构
	 * */
	public String getInstalledDynamic(Object[] orgArray,String type){
		Map<String,Object> values = new HashMap<String,Object>();
		Map<String, String> map = new LinkedHashMap<>();
     	StringBuffer sb = new StringBuffer();
     	sb.append("select ");
		for(int i=0 ; i<orgArray.length;i++){
			String[] org=orgArray[i].toString().split(":");
			String orgId = org[0];
			String orgName= org[1];
			if(!"all".equals(orgId)){
				map.put(orgId, orgName);
				if(orgName.length()>15){
					orgName = orgName.substring(0,14);
				}
				sb.append(" SUM(case when t.org_seq like '%"+orgId+".%' then 1 else 0 end) \"" + orgId +"\",");
			}
		}
		String sql = sb.toString().substring(0, sb.toString().length()-1);
		sb = new StringBuffer(sql);
		sb.append(" from (select t1.org_id,t1.org_seq,t3.user_id ,row_number() ");
		sb.append(" over(partition by t3.user_id order by t1.org_id desc) rn from psh_install_record t0 ");
		sb.append(" left join om_user t3 on t0.login_name=t3.login_name left join om_user_org t2 "); 
		sb.append(" on t2.user_id = t3.user_id left join om_org t1 on t1.org_id=t2.org_id ");
		sb.append(" where t1.org_code like '%PSH%')t ");
		if("qu".equals(type)){
			sb.append("  where t.rn = 1 ");
		}
		List resultlist = pshInstallRecordDao.createSQLQuery(sb.toString()).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP).list();
		JSONArray jsonArray=new JSONArray();
		if(resultlist != null){
			//获取实际人数
			JSONObject jsonAll = JSONObject.fromObject(statisticsService.pshStatistics(orgArray,type));
			List<JSONArray> resultlistSj =(List<JSONArray>) jsonAll.get("rows");
			
			Map value=(Map)resultlist.get(0);
			for(String key : map.keySet()){
				if(value.get(key)!=null){
					JSONObject jso = new JSONObject();
					jso.put("name", map.get(key));
				 	jso.put("count", value.get(key).toString());
				 	for(JSONArray o2:resultlistSj){
						if(map.get(key).indexOf(o2.get(0)!=null?o2.get(0).toString():"") != -1 || (map.get(key)== null && "区水务".equals(o2.get(0)))){
							jso.put("countAll", o2.get(1));
						}
					}
				 	jsonArray.add(jso);
				}
			}
		}
		return jsonArray.toString();	
	}
	
	
	/**
	 * 根据Form对象的查询条件作分页查询
	 * 关联机构查询
	 */
	@Transactional(readOnly = true)
	public String getInstalledInfDynamic(Page<PshInstallRecordForm> page, PshInstallRecordForm form) {
		JSONObject json = new JSONObject();
		if(form==null || form.getParentOrgName()==null || "".equals(form.getParentOrgName())){
			json.put("code", 300);
			json.put("message", "参数错误!");
			return json.toString();
		}
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("select ps.* from Psh_Install_Record ps ");
		hql.append(" left join om_User t3 on ps.login_Name=t3.login_Name left join om_User_Org t2 "); 
		hql.append(" on t2.user_Id = t3.user_Id left join om_Org t1 on t1.org_Id=t2.org_Id ");
		hql.append(" where 1=1 ");
		Map<String,Object> values = new HashMap<String,Object>();
		
		String orgList=ThirdUtils.getProperties().getProperty("orgListPsh");
		String[] orgArray=orgList.split(",");
		Map<String, String> orgMap = new LinkedHashMap<>();
		for(int i=0 ; i<orgArray.length;i++){
			String[] org=orgArray[i].toString().split(":");
			String orgId = org[0];
			String orgName= org[1];
			if(!"all".equals(orgId)){
				orgMap.put(orgName,orgId);
			}
		}	
		String orgId = statisticsService.getOrgIdByOrgName(form.getTeamOrgName(),"33",orgMap.get(form.getParentOrgName()));
		// 查询条件
		if(form != null){
			if (StringUtils.isNotBlank(form.getTeamOrgName())) {
				if ("区水务".equals(form.getTeamOrgName())) {
					hql.append(" and ps.team_Org_Name is null ");
				}else{
					hql.append(" and t1.org_Seq like :tn ");
					values.put("tn", "%"+orgId+"%");
				}
			}
		}
		List<SQLTransformer> sqlTransformer=new ArrayList<SQLTransformer>();//要转化的实体类
		SQLEntity sqlEntity=new SQLEntity(PshInstallRecord.class);//要转化的实体类
		sqlTransformer.add(sqlEntity);
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		Page pg = pshInstallRecordDao.findPageBySql(page, hql.toString(),sqlTransformer,values);
		if(pg.getResult()!=null){
			json.put("rows", pg.getResult());
			json.put("total", pg.getTotalItems());
			json.put("code", 200);
		}else{
			json.put("code", 300);
			json.put("message", "参数错误!");
		}
		return json.toString();
	}

}