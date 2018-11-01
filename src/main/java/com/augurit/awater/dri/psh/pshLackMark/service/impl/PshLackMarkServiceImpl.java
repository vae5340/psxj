package com.augurit.awater.dri.psh.pshLackMark.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.opus.common.domain.OpuRsRole;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.agcloud.org.service.IPsOrgUserService;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.problem_report.lack_mark.convert.LackMarkAttachmentConvertor;
import com.augurit.awater.dri.problem_report.lack_mark.entity.LackMarkAttachment;
import com.augurit.awater.dri.problem_report.lack_mark.service.ILackMarkAttachmentService;
import com.augurit.awater.dri.problem_report.lack_mark.web.form.LackMarkAttachmentForm;
import com.augurit.awater.dri.psh.pshLackMark.convert.PshLackMarkConvertor;
import com.augurit.awater.dri.psh.pshLackMark.dao.PshLackMarkDao;
import com.augurit.awater.dri.psh.pshLackMark.entity.PshLackMark;
import com.augurit.awater.dri.psh.pshLackMark.service.IPshCorrectMarkService;
import com.augurit.awater.dri.psh.pshLackMark.service.IPshLackMarkService;
import com.augurit.awater.dri.psh.pshLackMark.web.form.PshLackMarkForm;
import com.augurit.awater.util.PropertyFilter;
import com.augurit.awater.util.page.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import com.augurit.awater.util.sql.SqlPageUtils;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class PshLackMarkServiceImpl implements IPshLackMarkService {

	@Autowired
	private JdbcTemplate jdbcTemplate;
	@Autowired
	private IOmOrgRestService omOrgService;
	@Autowired
	private IPsOrgUserService psOrgUserService;
	@Autowired
	private IOmUserInfoRestService omUserService;
	@Autowired
	private PshLackMarkDao lackMarkDao;
	@Autowired
	private ILackMarkAttachmentService lackMarkAttachmentService;
	@Autowired
	private IPshCorrectMarkService correctMarkService;
	
	/**
	 * 查询用户上报过的道路数据,按照上报数量排序
	 **/
	@Override
	public List<Map<String,Object>> countRoad(Map<String, Object> map){
		StringBuffer hql = new StringBuffer("select * from(select s.road from (select s.road,count(*) as total from PSH_LACK_MARK s where 1=1 ");
		if(map.containsKey("personUserId")&&map.get("personUserId")!=null){
			hql.append(" and s.person_User_Id ="+map.get("personUserId"));
		}
		if(map.containsKey("road")&&map.get("road")!=null){
			hql.append(" and s.road like '%"+map.get("road").toString()+"%'");
		}
		hql.append(" GROUP BY s.road)s order by s.total desc) where rownum<=15");
		return lackMarkDao.getSession().createSQLQuery(hql.toString()).list();
	} 
	
	/**
	 * 查询最新十条数据
	 * */
	public List<Map<String,Object>> getLatestTen(){
		String hql = "select PARENT_ORG_NAME,DIRECT_ORG_NAME,SUPERVISE_ORG_NAME,"
				+ "TEAM_ORG_NAME,MARK_PERSON,COMPONENT_TYPE,ID,MARK_TIME from (select * from AWATER_SWJ.PSH_LACK_MARK s "+
				 " where s.MARK_TIME>sysdate-3 order by s.MARK_TIME desc ) where ROWNUM<=10";
		return jdbcTemplate.queryForList(hql);
	}
	/**
	 * 按业主单位统计数量(移动端使用)
	 * */
	public Map<String,Object> lackCount(PshLackMarkForm form, Map<String,Object> map){
		Map<String,Object> mapJson = new HashMap<>();
		StringBuffer hql = new StringBuffer("select count(*) as total from PshLackMark ps where 1=1 and parentOrgName not like '%广州市水务局%'");
		Map<String,Object> maps = new HashMap<>();
		if(StringUtils.isNotBlank(form.getParentOrgName())){
			hql.append(" and ps.parentOrgName like :parentOrgName");
			maps.put("parentOrgName", "%"+form.getParentOrgName()+"%");
		}
		if(map.size()>0 && map.containsKey("startTime") && map.containsKey("endTime")){
			hql.append(" and ps.markTime between :startTime and :endTime");
			maps.put("startTime", (Date)map.get("startTime"));
			maps.put("endTime", (Date)map.get("endTime"));
		}
		if(map.containsKey("reportType")){
			hql.append(" and ps.layerName like :layerName");
			maps.put("layerName", "%"+map.get("reportType").toString()+"%");
		}
		if(map.containsKey("checkState")){
			hql.append(" and ps.checkState = :checkState");
			maps.put("checkState", map.get("checkState"));
		}
		List<Map<String,Object>> list = lackMarkDao.find(hql.toString(), maps);
		mapJson.put("total", list!=null&&list.size()>0? list.get(0):0);
		return mapJson;
	}
	/*************************************pc端查询******************************************/
	/**
	 * 查询条件统计图
	 * */
	public String searchEachts(PshLackMarkForm form,Map<String, Object> map) {
		JSONObject json = new JSONObject();
		//分组查询，判断是否点击传参
		if(!StringUtils.isNotBlank(form.getParentOrgName()) && 
				!StringUtils.isNotBlank(form.getDirectOrgName())){
			form.setParentOrgName("1");
		}else if(StringUtils.isNotBlank(form.getParentOrgName())){
			form.setDirectOrgName("1");
		}else if(StringUtils.isNotBlank(form.getDirectOrgName())){
			form.setTeamOrgName("1");
		}
		List<Map<String,Object>> list = this.searchGroup(form, map);
		if(list!=null&&list.size()>0){
			json.put("rows", list);
		}
		json.put("code", 200);
		return json.toString();
	}
	/**
	 * pc端页面查询
	 * @param userForm
	 * */
	@Override
	public String getLackMarkList(OpuOmUserInfo userForm, Page<PshLackMarkForm> page, PshLackMarkForm form,
								  Map<String, Object> map) {
		JSONObject json = new JSONObject();
		List<PshLackMarkForm> list = new ArrayList<>();
		if(userForm!=null && StringUtils.isNotBlank(userForm.getLoginName())){
			Map<String, String> m = correctMarkService.getFrom(userForm.getLoginName());
			Long total=null;
			if(m.containsKey("parentOrgName")){
				if(!m.containsKey("top")){//非市级用户
					form.setParentOrgId(m.get("parentOrgId"));
				}
			}
			Page pg= this.searchFromAndMapPc(page, form, map);
			if(pg.getResult()!=null){
				list=pg.getResult();
				total=pg.getTotalItems();
			}
			json.put("rows", list);
			json.put("total", total);
			json.put("code", 200);
		}else{
			json.put("code", 300);
			json.put("message", "参数错误!");
		}
		return json.toString();
	}
	/**
	 * 查询附件
	 **/
	@Override
	public String seeLackMark(Long id) {
		JSONObject json = new JSONObject();
		try {
			PshLackMarkForm form = this.get(id);
			List<LackMarkAttachmentForm> list = lackMarkAttachmentService.getMarkId(form.getId().toString());
			json.put("code", 200);
			json.put("form", form);
			json.put("rows", list);
		} catch (RuntimeException e) {
			json.put("code", 500);
			e.printStackTrace();
			throw new RuntimeException(e);
		}
		return json.toString();
	}
	/**
	 * 分组查询统计
	 * */
	public List<Map<String, Object>> searchGroup (PshLackMarkForm form, Map<String,Object> map){
		List<Map<String, Object>> list = new ArrayList<>();
		StringBuffer hql = new StringBuffer("");
		Map values = new HashMap<>();
		if(StringUtils.isNotBlank(form.getParentOrgName()) &&
				!StringUtils.isNotBlank(form.getDirectOrgName())){
			hql.append("select ps.parentOrgName as name,count(*) as total from PshLackMark ps where 1=1");
			if(StringUtils.isNotBlank(form.getComponentType())){
				hql.append(" and ps.componentType like :componentType");
				values.put("componentType", "%"+form.getComponentType()+"%");
			}
			if(map.size()>0 && map.containsKey("startTime") && map.containsKey("endTime")){
				hql.append(" and ps.markTime between :startTime and :endTime");
				values.put("startTime", (Date)map.get("startTime"));
				values.put("endTime", (Date)map.get("endTime"));
			}
			hql.append(" group by ps.parentOrgName");
		}else if(StringUtils.isNotBlank(form.getDirectOrgName()) && 
					StringUtils.isNotBlank(form.getParentOrgName())){
			hql.append("select ps.directOrgName as name,count(*) as total from Diary ps where 1=1");
			if(StringUtils.isNotBlank(form.getComponentType())){
				hql.append(" and ps.componentType like :componentType");
				values.put("componentType", "%"+form.getComponentType()+"%");
			}
			if(map.size()>0 && map.containsKey("startTime") && map.containsKey("endTime")){
				hql.append(" and ps.markTime between :startTime and :endTime");
				values.put("startTime", (Date)map.get("startTime"));
				values.put("endTime", (Date)map.get("endTime"));
			}
			hql.append(" and ps.parentOrgName like :parentOrgName");
			values.put("parentOrgName", "%"+form.getParentOrgName()+"%");
			hql.append(" group by ps.directOrgName");
		}else if(StringUtils.isNotBlank(form.getTeamOrgName()) &&
				StringUtils.isNotBlank(form.getDirectOrgName())){
			hql.append("select ps.teamOrgName as name,count(*) as total from Diary ps where 1=1");
			if(StringUtils.isNotBlank(form.getComponentType())){
				hql.append(" and ps.componentType like :componentType");
				values.put("componentType", "%"+form.getComponentType()+"%");
			}
			if(map.size()>0 && map.containsKey("startTime") && map.containsKey("endTime")){
				hql.append(" and ps.markTime between :startTime and :endTime");
				values.put("startTime", (Date)map.get("startTime"));
				values.put("endTime", (Date)map.get("endTime"));
			}
			hql.append(" and ps.directOrgName like :directOrgName");
			values.put("directOrgName", "%"+form.getDirectOrgName()+"%");
			hql.append(" group by ps.teamOrgName");
		}
		if(StringUtils.isNotBlank(hql.toString())){
			list = lackMarkDao.find(hql.toString(), values);
		}
		return list;
	}
/*************************************移动端查询******************************************/
	/**
	 * 移动端查询缺失上报列表
	 * @param parentOrgName
	 * @return json
	 * */
	@Override
	public Map<String, Object> searchLackMark(Page page,String loginName, String layerName, 
			String parentOrgName,Map<String,Object> map,String path) {
		Map<String, Object> mapList = new HashMap<>();
		List<Map> list = new ArrayList<>();
		PshLackMarkForm form = new PshLackMarkForm();
		if(StringUtils.isNotBlank(loginName)){
			Map<String,String> mapForm = correctMarkService.getFrom(loginName);
			if(!mapForm.containsKey("parentOrgId")){
				return mapList;
			}
			if(mapForm.containsKey("parentOrgId") && !mapForm.containsKey("top")){
				form.setParentOrgId(mapForm.get("parentOrgId"));
			}
			if(mapForm.containsKey("top")){
				if(StringUtils.isNotBlank(parentOrgName)){
					if(parentOrgName.contains("净水公司")){
						form.setParentOrgName("净水有限公司");
					}else{
						form.setParentOrgName(parentOrgName);
					}
				}
			}
		}
		if(StringUtils.isNotBlank(layerName)){
			form.setComponentType(layerName);
		}
		map.put("notParentOrgName", "市水务局");//过滤除了市水务局条件
		Page<PshLackMarkForm> pa = searchFromAndMap(page, form, map);
		if(pa.getResult()!=null){
			List<PshLackMarkForm> listLackForm = pa.getResult();
			for(PshLackMarkForm fm : listLackForm){
				Map mp = new HashMap<>();
				List<LackMarkAttachmentForm> attach= lackMarkAttachmentService.getMarkId(fm.getId().toString());
				mp.put("id", fm.getId());
				mp.put("markPersonId", fm.getMarkPersonId());
				mp.put("markPerson", fm.getMarkPerson());
				mp.put("time",fm.getMarkTime()!=null? fm.getMarkTime().getTime(): null);
				mp.put("updateTime", fm.getUpdateTime()!=null? fm.getUpdateTime(): null);
				mp.put("layerName", fm.getComponentType());
				mp.put("parentOrgName", fm.getParentOrgName());
				mp.put("superviseOrgName", fm.getSuperviseOrgName());
				mp.put("directOrgName", fm.getDirectOrgName());
				mp.put("addr", fm.getAddr());
				mp.put("source", "lack");
				if(attach!=null && attach.size()>0){
					mp.put("attPath", attach.get(0).getAttPath()!=null?path+attach.get(0).getAttPath():"");
					mp.put("thumPath", attach.get(0).getThumPath()!=null?path+attach.get(0).getThumPath():"");
				}
					
				list.add(mp);
			}
			mapList.put("data", list);
			mapList.put("total", pa.getTotalItems());
		}
		return mapList;
	}
	/**
	 * 根据用户单位查询信息
	 * */
	@Override
	public String getLackMarks(String loginName,Page<PshLackMarkForm> page, PshLackMarkForm form,
			Map<String, Object> map) {
		JSONObject json = new JSONObject();
		Page<PshLackMarkForm> pg = new Page<>();
		try {
			OpuOmUserInfo user =  omUserService.getOpuOmUserInfoByLoginName(loginName);
			if(user== null)
				throw new RuntimeException("获取用户信息失败!");
			List<OpuOmOrg> listOrg =  psOrgUserService.listOmOrgByUserId(user.getUserId());
			if(listOrg == null)
				throw new RuntimeException("获取机构信息失败!");
			for (OpuOmOrg omOrgForm :listOrg) {
				if(omOrgForm.getOrgRank().equals("11")) { //队伍（队伍中的用户只能看见自己上报的事件）
					form.setMarkPersonId(loginName);
					form.setDirectOrgId(null);
					form.setSuperviseOrgId(null);
					form.setParentOrgId(null);
					pg = this.searchFromAndMap(page,form,map);
				}else{
					if(omOrgForm.getOrgRank().equals("12")){// 直属单位
						form.setDirectOrgId(omOrgForm.getOrgId().toString());
						form.setSuperviseOrgId(null);
						form.setParentOrgId(null);
						pg = this.searchFromAndMap(page,form,map);
					}else if(omOrgForm.getOrgRank().equals("13")){ // 监理单位
						form.setSuperviseOrgId(omOrgForm.getOrgId().toString());
						form.setParentOrgId(null);
						pg = this.searchFromAndMap(page,form,map);
					}else if(omOrgForm.getOrgRank().equals("14")){ // 业主单位
						form.setParentOrgId(omOrgForm.getOrgId().toString());
						pg = this.searchFromAndMap(page,form,map);
					}else if(omOrgForm.getOrgRank().equals("15")){//管理部门(管理部门的上一级是业主单位)
						//OmOrgForm omorgForm = omOrgService.getOrg(omOrgForm.getParentOrgId());
						String orgGrade = omOrgForm.getOrgRank();
						String parentId = omOrgForm.getParentOrgId();
						while("15".equals(orgGrade)){
							OpuOmOrg om = omOrgService.getOpuOmOrgIdByOrgId(parentId);
							orgGrade = om.getOrgRank();
							parentId = om.getParentOrgId();
							if(orgGrade.equals("1")){
								pg = this.searchFromAndMap(page,form,map);
							}else if(orgGrade.equals("14")){
								form.setParentOrgId(om.getOrgId().toString());
								pg = this.searchFromAndMap(page,form,map);
							}
						}
					}
				}
			}
			//Page<CorrectMarkForm> pa =this.searchFromAndMap(page, form, map);
			json.put("code",200);
			if(pg.getResult()!=null){
				json.put("rows", pg.getResult());
				json.put("total", pg.getTotalItems());
			}
		} catch (RuntimeException e) {
			json.put("code", 500);
			e.printStackTrace();
			throw new RuntimeException(e);
		}
		return json.toString();
	}
	/**
	 * pc端上报页面查询
	 * */
	@Override
	public String searchSbPage(OpuOmUserInfo userForm,Page<PshLackMarkForm> page, PshLackMarkForm form,
			Map<String, Object> map) {
		JSONObject json = new JSONObject();
		List<PshLackMarkForm> listForm = new ArrayList<>();
		String role=null;
		Long total = null;
		if(userForm!=null && StringUtils.isNotBlank(userForm.getLoginName())){
			Map<String, String> m = correctMarkService.getFrom(userForm.getLoginName());
			if(m.containsKey("parentOrgName")){
				if(!m.containsKey("top")){//非市级用户
					//form.setParentOrgId(m.get("parentOrgId"));
					map.put("parentOrgId", m.get("parentOrgId"));
					//判定角色
					List<OpuRsRole> roleList =  omOrgService.listRoleByUserId(userForm.getUserId());
					if(roleList!=null){
						for(OpuRsRole roleForm : roleList){
							if("ps_qj_manager".equals(roleForm.getRoleCode())){
								role="ps_qj_manager";break;
							}
						}
					}
				}
			}
			// 查询语句及参数
			StringBuffer hql = new StringBuffer("from PshLackMark ps where 1=1");
			Map<String,Object> values = new HashMap<String,Object>();
			
			// 查询条件
			if(form != null){
				if(StringUtils.isNotBlank(form.getMarkPerson())){
					hql.append(" and ps.markPerson like :markPerson");
					values.put("markPerson", "%"+form.getMarkPerson()+"%");
				}
				if(StringUtils.isNotBlank(form.getParentOrgId())){
					hql.append(" and ps.parentOrgId = :parentOrgId");
					values.put("parentOrgId", form.getParentOrgId());
				}
				if(StringUtils.isNotBlank(form.getComponentType()) && !"全部".equals(form.getComponentType())){
					hql.append(" and ps.componentType like :componentType");
					values.put("componentType", "%"+form.getComponentType()+"%");
				}
				if(StringUtils.isNotBlank(form.getIsBinding())){
					hql.append(" and ps.isBinding = :isBinding");
					values.put("isBinding", form.getIsBinding());
				}
				if(StringUtils.isNotBlank(form.getCheckState()) && !"全部".equals(form.getCheckState())){//审核状态
					hql.append(" and ps.checkState like :checkState");
					values.put("checkState", "%"+form.getCheckState()+"%");
				}
				if(StringUtils.isNotBlank(form.getCheckDesription()) ){
					hql.append(" and ps.checkDesription like :checkDesription");
					values.put("checkDesription", "%"+form.getCheckDesription()+"%");
				}
				if(StringUtils.isNotBlank(form.getRoad()) ){
					hql.append(" and ps.road like :road");
					values.put("road", "%"+form.getRoad()+"%");
				}
				if(StringUtils.isNotBlank(form.getObjectId()) ){
					hql.append(" and ps.objectId = :objectId");
					values.put("objectId", form.getObjectId());
				}
				if(StringUtils.isNotBlank(form.getPcode()) && !"null".equals(form.getPcode())){
					String[] pcode = form.getPcode().split(",");
					for(String code : pcode){
						hql.append(" and ps.pcode like '%"+code+"%'");
					}
				}
				if(StringUtils.isNotBlank(form.getChildCode()) && !"null".equals(form.getChildCode())){
					String[] pcode = form.getChildCode().split(",");
					for(String code : pcode){
						hql.append(" and ps.childCode like '%"+code+"%'");
					}
				}
			}
			if(map!=null){
				if(map.containsKey("parentOrgId")){//非市级
					if(role==null){//个人
						hql.append(" and ps.markPersonId = :loginname");
						values.put("loginname", userForm.getLoginName());
					}else if("ps_qj_manager".equals(role)){//区级管理员
						hql.append(" and ps.parentOrgId = :parentOrgId2");
						values.put("parentOrgId2", map.get("parentOrgId"));
					}
				}
				SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				if(map.get("startTime")!=null){
					hql.append(" and to_char(ps.markTime,'yyyy-MM-dd hh24:mi:ss') >= :startTime ");
					values.put("startTime", df.format((Date)map.get("startTime")));
				}
				if(map.get("endTime")!=null){
					hql.append(" and to_char(ps.markTime,'yyyy-MM-dd hh24:mi:ss') <= :endTime");
					values.put("endTime", df.format((Date)map.get("endTime")));
				}
			}
			hql.append(" order by ps.markTime desc");
			//排序
			hql.append(HqlUtils.buildOrderBy(page, "ps"));
			
			// 执行分页查询操作
			Page pg = lackMarkDao.findPage(page, hql.toString(), values);
			
			// 转换为Form对象列表并赋值到原分页对象中
			List<PshLackMarkForm> list = PshLackMarkConvertor.convertVoListToFormList(pg.getResult());
			PageUtils.copy(pg, list, page);
			if(page.getResult()!=null){
				listForm=page.getResult();
				total=page.getTotalItems();
			}
			json.put("rows", listForm);
			json.put("total", total);
			json.put("code", 200);
		}else{
			json.put("code", 300);
			json.put("message", "参数错误!");
		}
		return json.toString();
	}
	/**
	 * 分页查询
	 * */
	@Override
	public Page<PshLackMarkForm> searchFromAndMap(Page<PshLackMarkForm> page,
			PshLackMarkForm form, Map<String, Object> map) {
		// 查询语句及参数
				StringBuffer hql = new StringBuffer("from PshLackMark ps where 1=1");
				Map<String,Object> values = new HashMap<String,Object>();
				//sql统计数量
				StringBuffer sql = new StringBuffer("from PSH_LACK_MARK ps where 1=1");
				// 查询条件
				if(form != null){
					if(form.getPersonUserId()!=null){
						hql.append(" and ps.personUserId = :personUserId");
						sql.append(" and ps.person_User_Id = :personUserId");
						values.put("personUserId", form.getPersonUserId());
					}
					if (StringUtils.isNotBlank(form.getIsBinding())) {
						hql.append(" and ps.isBinding = :isBinding");
						sql.append(" and ps.is_Binding = :isBinding");
						values.put("isBinding", form.getIsBinding());
					}
					if(StringUtils.isNotBlank(form.getObjectId())){
						hql.append(" and ps.objectId like :objectId");
						sql.append(" and ps.object_Id like :objectId");
						values.put("objectId", "%"+form.getObjectId()+"%");
					}
					if(StringUtils.isNotBlank(form.getIsAddFeature())){
						hql.append(" and ps.isAddFeature = :isAddFeature");
						sql.append(" and ps.is_Add_Feature = :isAddFeature");
						values.put("isAddFeature", form.getIsAddFeature());
					}
					if(StringUtils.isNotBlank(form.getMarkPersonId())){
						hql.append(" and ps.markPersonId = :markPersonId");
						sql.append(" and ps.mark_Person_Id = :markPersonId");
						values.put("markPersonId", form.getMarkPersonId());
					}
					if(StringUtils.isNotBlank(form.getMarkPerson())){
						hql.append(" and ps.markPerson like :markPerson");
						sql.append(" and ps.mark_Person like :markPerson");
						values.put("markPerson", "%"+form.getMarkPerson()+"%");
					}
					if(StringUtils.isNotBlank(form.getRoad())){//所在道路
						hql.append(" and ps.road like :road");
						sql.append(" and ps.road like :road");
						values.put("road", "%"+form.getRoad()+"%");
					}
					if(StringUtils.isNotBlank(form.getAddr())){//所在道路
						hql.append(" and ps.addr like :addr");
						sql.append(" and ps.addr like :addr");
						values.put("addr", "%"+form.getAddr()+"%");
					}
					if(StringUtils.isNotBlank(form.getAttrFive())){//挂牌编号
						hql.append(" and ps.attrFive like :attrFive");
						sql.append(" and ps.attr_five like :attrFive");
						values.put("attrFive", "%"+form.getAttrFive()+"%");
					}
					if(StringUtils.isNotBlank(form.getDirectOrgId())){
						hql.append(" and ps.directOrgId = :directOrgId");
						sql.append(" and ps.direct_Org_Id = :directOrgId");
						values.put("directOrgId", form.getDirectOrgId());
					}
					if(StringUtils.isNotBlank(form.getSuperviseOrgId())){
						hql.append(" and ps.superviseOrgId = :superviseOrgId");
						sql.append(" and ps.supervise_Org_Id = :superviseOrgId");
						values.put("superviseOrgId", form.getSuperviseOrgId());
					}
					if(StringUtils.isNotBlank(form.getParentOrgId())){
						hql.append(" and ps.parentOrgId = :parentOrgId");
						sql.append(" and ps.parent_Org_Id = :parentOrgId");
						values.put("parentOrgId", form.getParentOrgId());
					}
					if(StringUtils.isNotBlank(form.getParentOrgName())){
						if(form.getParentOrgName().indexOf(",")!=-1){
							String[] parentName = form.getParentOrgName().split(",");
							hql.append(" and (");
							sql.append(" and (");
							for(int i=0;i<parentName.length;i++){
								if(i>0) {
									hql.append(" or");
									sql.append(" or");
								}
								hql.append(" ps.parentOrgName like '%"+parentName[i]+"%'");
								sql.append(" ps.parent_Org_Name like '%"+parentName[i]+"%'");
							}
							hql.append(")");
							sql.append(")");
						}else{
							hql.append(" and ps.parentOrgName like :parentOrgName");
							sql.append(" and ps.parent_Org_Name like :parentOrgName");
							values.put("parentOrgName", "%"+form.getParentOrgName()+"%");
						}
					}
					if(StringUtils.isNotBlank(form.getComponentType())){
						hql.append(" and ps.componentType like :componentType");
						sql.append(" and ps.component_Type like :componentType");
						values.put("componentType", "%"+form.getComponentType()+"%");
					}
					if(StringUtils.isNotBlank(form.getLayerName())){   //设施类型
						hql.append(" and ps.layerName like :layerName");
						sql.append(" and ps.layer_Name like :layerName");
						values.put("layerName", "%"+form.getLayerName()+"%");
					}
					if(StringUtils.isNotBlank(form.getCheckState())){
						if("1".equals(form.getCheckState())){
							hql.append(" and (ps.checkState = :checkState or ps.checkState ='' or ps.checkState is null)");
						}else{
							hql.append(" and ps.checkState = :checkState");
						}
						values.put("checkState", form.getCheckState());
					}
				}
				if(map!=null){
//					if(map.containsKey("startTime") && map.containsKey("endTime")){
//						hql.append(" and ps.markTime between :startTime and :endTime");
//						values.put("startTime", (Date)map.get("startTime"));
//						values.put("endTime", (Date)map.get("endTime"));
//					}
					SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
					if(map.get("startTime")!=null){
						hql.append(" and to_char(ps.markTime,'yyyy-MM-dd hh24:mi:ss') >= :startTime ");
						sql.append(" and to_char(ps.mark_Time,'yyyy-MM-dd hh24:mi:ss') >= :startTime ");
						values.put("startTime", df.format((Date)map.get("startTime")));
					}
					if(map.get("endTime")!=null){
						hql.append(" and to_char(ps.markTime,'yyyy-MM-dd hh24:mi:ss') <= :endTime");
						sql.append(" and to_char(ps.mark_Time,'yyyy-MM-dd hh24:mi:ss') <= :endTime");
						values.put("endTime", df.format((Date)map.get("endTime")));
					}
					if(map.containsKey("notParentOrgName")){
						hql.append(" and ps.parentOrgName not like :notParentOrgName");
						sql.append(" and ps.parent_Org_Name not like :notParentOrgName");
						values.put("notParentOrgName", "%"+map.get("notParentOrgName").toString()+"%");
					}
				}
				hql.append(" order by ps.updateTime desc");
				//排序
				hql.append(HqlUtils.buildOrderBy(page, "ps"));
				
				// 执行分页查询操作
				Page pg = lackMarkDao.findPage(page, hql.toString(), values);
				//获取各状态数量
				Map<String,Object> getNum = values;
				if(getNum.containsKey("checkState")){
					getNum.remove("checkState");
				}
				long no = lackMarkDao.countSqlResult(sql.toString()+" and (ps.check_State ='1' or ps.check_State ='' or ps.check_State is null) ", getNum);
				long pass = lackMarkDao.countSqlResult(sql.toString()+" and ps.check_State ='2' ", getNum);
				long doubt = lackMarkDao.countSqlResult(sql.toString()+" and ps.check_State ='3' ", getNum);
				map.put("no", no);
				map.put("pass", pass);
				map.put("doubt", doubt);
				// 转换为Form对象列表并赋值到原分页对象中
				List<PshLackMarkForm> list = PshLackMarkConvertor.convertVoListToFormList(pg.getResult());
				PageUtils.copy(pg, list, page);
				if(list!=null && list.size()>0)
					return page;
				else
					return pg;
	}
	
	/**
	 * Pc分页查询
	 * */
	@Override
	public Page<PshLackMarkForm> searchFromAndMapPc(Page<PshLackMarkForm> page,
			PshLackMarkForm form, Map<String, Object> map) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from PshLackMark ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			if (StringUtils.isNotBlank(form.getIsBinding())) {
				hql.append(" and ps.isBinding = :isBinding");
				values.put("isBinding", form.getIsBinding());
			}
			if(StringUtils.isNotBlank(form.getObjectId())){
				hql.append(" and ps.objectId = :objectId");
				values.put("objectId", form.getObjectId());
			}
			if(StringUtils.isNotBlank(form.getIsAddFeature())){
				hql.append(" and ps.isAddFeature = :isAddFeature");
				values.put("isAddFeature", form.getIsAddFeature());
			}
			if(StringUtils.isNotBlank(form.getMarkPersonId())){
				hql.append(" and ps.markPersonId = :markPersonId");
				values.put("markPersonId", form.getMarkPersonId());
			}
			if(StringUtils.isNotBlank(form.getMarkPerson())){
				hql.append(" and ps.markPerson like :markPerson");
				values.put("markPerson", "%"+form.getMarkPerson()+"%");
			}
			if(StringUtils.isNotBlank(form.getRoad())){//所在道路
				hql.append(" and ps.road like :road");
				values.put("road", "%"+form.getRoad()+"%");
			}
			if(StringUtils.isNotBlank(form.getDirectOrgId())){
				hql.append(" and ps.directOrgId = :directOrgId");
				values.put("directOrgId", form.getDirectOrgId());
			}
			if(StringUtils.isNotBlank(form.getSuperviseOrgId())){
				hql.append(" and ps.superviseOrgId = :superviseOrgId");
				values.put("superviseOrgId", form.getSuperviseOrgId());
			}
			if(StringUtils.isNotBlank(form.getParentOrgId())){
				hql.append(" and ps.parentOrgId = :parentOrgId");
				values.put("parentOrgId", form.getParentOrgId());
			}
			if(StringUtils.isNotBlank(form.getParentOrgName())){
				if(form.getParentOrgName().indexOf(",")!=-1){
					String[] parentName = form.getParentOrgName().split(",");
					hql.append(" and (");
					for(int i=0;i<parentName.length;i++){
						if(i>0) hql.append(" or");
						hql.append(" ps.parentOrgName like '%"+parentName[i]+"%'");
					}
					hql.append(")");
				}else{
					hql.append(" and ps.parentOrgName like :parentOrgName");
					values.put("parentOrgName", "%"+form.getParentOrgName()+"%");
				}
			}
			if(StringUtils.isNotBlank(form.getComponentType())){
				hql.append(" and ps.componentType like :componentType");
				values.put("componentType", "%"+form.getComponentType()+"%");
			}
			if(StringUtils.isNotBlank(form.getCheckState())){
				hql.append(" and ps.checkState = :checkState");
				values.put("checkState", form.getCheckState());
			}
		}
		if(map!=null){
//					if(map.containsKey("startTime") && map.containsKey("endTime")){
//						hql.append(" and ps.markTime between :startTime and :endTime");
//						values.put("startTime", (Date)map.get("startTime"));
//						values.put("endTime", (Date)map.get("endTime"));
//					}
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			if(map.get("startTime")!=null){
				hql.append(" and to_char(ps.markTime,'yyyy-MM-dd hh24:mi:ss') >= :startTime ");
				values.put("startTime", df.format((Date)map.get("startTime")));
			}
			if(map.get("endTime")!=null){
				hql.append(" and to_char(ps.markTime,'yyyy-MM-dd hh24:mi:ss') <= :endTime");
				values.put("endTime", df.format((Date)map.get("endTime")));
			}
		}
		hql.append(" order by ps.markTime ");
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = lackMarkDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<PshLackMarkForm> list = PshLackMarkConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		if(list!=null && list.size()>0)
			return page;
		else
			return pg;
	}
	/**
	 * 查找全部未同步数据
	 * @param form
	 * */
	public List<PshLackMarkForm> getListLack(PshLackMarkForm form){
		Page pg = new Page();
		pg.setPageSize(2500);
		StringBuffer hql = new StringBuffer("from PshLackMark ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		if(form != null){
			if(StringUtils.isNotBlank(form.getIsAddFeature())){
				hql.append(" and ps.isAddFeature like :isAddFeature");
				values.put("isAddFeature", "%"+form.getIsAddFeature()+"%");
			}
			if(StringUtils.isNotBlank(form.getParentOrgId())){
				hql.append(" and ps.parentOrgId like :parentOrgId");
				values.put("parentOrgId", "%"+form.getParentOrgId()+"%");
			}
		}
		hql.append(" order by ps.markTime desc");
		pg = lackMarkDao.findPage(pg,hql.toString(),values);
		List<PshLackMark> list =pg.getResult();
		return PshLackMarkConvertor.convertVoListToFormList(list);
	} 
	/**
	 * 移动端修改
	 * */
	@Override
	public void updateForm(PshLackMarkForm f) {
		if(f!=null&&f.getId()!=null){
			f.setCheckState("1");
			f.setCheckPerson(null);
			f.setCheckPersonId(null);
			f.setCheckTime(null);
			f.setCheckDesription(null);
			f.setUpdateTime(new Date());
			f.setMarkTime(null);  //上报时间不修改
			f.setUpdateTime(new Date());
			f.setMarkPersonId(null);
			f.setMarkPerson(null);
			f.setTeamOrgId(null);
			f.setTeamOrgName(null);
			f.setDirectOrgId(null);
			f.setDirectOrgName(null);
			f.setSuperviseOrgId(null);
			f.setSuperviseOrgName(null);
			f.setParentOrgId(null);
			f.setParentOrgName(null);
			this.saveAndToTc(f);
		}
	}
	/********************************************************************/
	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public PshLackMarkForm get(Long id) {
		PshLackMark entity = lackMarkDao.get(id);
		return PshLackMarkConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		lackMarkDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(PshLackMarkForm... forms) {
		if(forms != null)
			for(PshLackMarkForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(PshLackMarkForm form){
		if(form != null){
			PshLackMark entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = lackMarkDao.get(form.getId());
			}else{
				entity = new PshLackMark();
			}
			
			//属性值转换
			PshLackMarkConvertor.convertFormToVo(form, entity);
			
			//保存
			lackMarkDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
			
		}
	}
	/**
	 * 保存新增或修改的Form对象并保存图层
	 */
	@Override
	public void saveAndToTc(PshLackMarkForm form){
		boolean isAdd=false;
		if(form != null){
			PshLackMark entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				isAdd=false;
				entity = lackMarkDao.get(form.getId());
			}else{
				isAdd=true;
				entity = new PshLackMark();
			}
			
			//属性值转换
			PshLackMarkConvertor.convertFormToVo(form, entity);
			
			//保存
			lackMarkDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
			
			//保存到图层
			/*if(isAdd){//新增
				FeatureForm feature = DataFormToFeatureConvertor
						.convertLackVoToForm(form);
				feature.setPsh(1L);
				String features = DataFormToFeatureConvertor.convertFeatureToJson(feature);
				if(StringUtils.isNotBlank(features)){
					String result = httpArcgisClient.addFeature(features);
					if(!"500".equals(result) && !"300".equals(result)){
						JSONObject json = JSONObject.fromObject(result);
						feature.setObjectid(Long.parseLong(json.getString("objectId")));
						correctMarkService.featureToSaveForm(feature);
					}else{
						throw new RuntimeException();
					}
				}
			}else{//修改
				PshLackMarkForm updateForm = get(form.getId());
				// 同步图层操作
				if (updateForm.getObjectId() != null) {
					FeatureForm feature = DataFormToFeatureConvertor
							.convertLackVoToForm(updateForm);
					feature.setPsh(1L);
					String features = DataFormToFeatureConvertor.convertFeatureToJson(feature);
					if(StringUtils.isNotBlank(features)){
						String result = httpArcgisClient.updateFeature(features);
						if(!"500".equals(result) && !"300".equals(result)){

						}else{
							throw new RuntimeException();
						}
					}

				} else {// 可能存在未同步情况（修改顺便同步）
					FeatureForm feature = DataFormToFeatureConvertor
							.convertLackVoToForm(updateForm);
					feature.setPsh(1L);
					String features = DataFormToFeatureConvertor.convertFeatureToJson(feature);
					if(StringUtils.isNotBlank(features)){
						String result = httpArcgisClient.addFeature(features);
						if(!"500".equals(result) && !"300".equals(result)){
							JSONObject json = JSONObject.fromObject(result);
							feature.setObjectid(Long.parseLong(json.getString("objectId")));
							correctMarkService.featureToSaveForm(feature);
						}else{
							throw new RuntimeException();
						}
					}
				}
			}*/
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<PshLackMarkForm> search(Page<PshLackMarkForm> page, PshLackMarkForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from PshLackMark ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = lackMarkDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<PshLackMarkForm> list = PshLackMarkConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		if(list!=null && list.size()>0)
			return page;
		else
			return pg;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<PshLackMarkForm> search(Page<PshLackMarkForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<PshLackMark> pg = lackMarkDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<PshLackMarkForm> list = PshLackMarkConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	/**
	 * 统计上报类型的全部结果数量
	 * */
	public Long getLackTotal(String layerName,
			String parentOrgName,Map map){
		StringBuffer hql = new StringBuffer("select count(*) from PshLackMark ps where 1=1");
		Map values = new HashMap();
		if(StringUtils.isNotBlank(layerName)){
			hql.append("and ps.componentType like :componentType");
			values.put("componentType", "%"+layerName+"%");
		}
		if(StringUtils.isNotBlank(parentOrgName)){
			hql.append("and ps.parentOrgName like :parentOrgName");
			values.put("parentOrgName", "%"+parentOrgName+"%");
		}
		if(map!=null){
			if(map.containsKey("startTime") && map.containsKey("endTime")){
				hql.append(" and ps.markTime between :startTime and :endTime");
				values.put("startTime", (Date)map.get("startTime"));
				values.put("endTime", (Date)map.get("endTime"));
			}
		}
		return (Long)lackMarkDao.createQuery(hql.toString(),values).uniqueResult();
	}
	/**
	 * 移动端查看详细
	 * */
	@Override
	public Map<String,Object> seeLackMark(String path, long id) {
		Map<String,Object> map = new HashMap();
		//lackMarkDao.getSession().evict(PshLackMark.class,id);
		PshLackMarkForm form = this.get(id);
		if(form==null){
			return map;
		}
		Map mapForm = PshLackMarkConvertor.convertFormToMap(form);
		List<LackMarkAttachmentForm> list = lackMarkAttachmentService.getMarkId(form.getId().toString());
		List<LackMarkAttachment> listAttachments =
				LackMarkAttachmentConvertor.convertFormListToVoList(list);
		List<Map> listMap =LackMarkAttachmentConvertor.
				convertVoListToMapList(listAttachments);
		if(listMap!=null && listMap.size()>0){
			for(Map mp :listMap){
				mp.put("attPath",mp.get("attPath")!=null? path+mp.get("attPath").toString():"");
				mp.put("thumPath",mp.get("thumPath")!=null? path+mp.get("thumPath").toString():"");
				if(mp.containsKey("attTime")){
					Date time = (Date)mp.get("attTime");
					mp.put("attTime", time!=null? time.getTime():null);
				}
			}
		}
		map.put("data", mapForm);
		map.put("rows", listMap);
		return map;
	}
	
	/**
	 * 定时执行查询语句,（保存至图层属性中）未使用
	 * @return List
	 * */
	@Override
	public List<Map> searchNotFeature() {
		List<Map> listMap = new ArrayList<>();
		Map values = new HashMap<>();
		// isAddFeature初始值为0 表示没有新增到图层服务上去，新增状态为1
		String hql = "from PshLackMark ps where 1=1 and ps.isAddFeature=2";
		List<PshLackMark> list = lackMarkDao.find(hql, values);
		if(list!=null)
			listMap  =PshLackMarkConvertor.convertVoListToMapList(list);
		return listMap;
	}
	
	/**
	 *上报统计
	 *按人统计
	 * */
	@Override
	public String statisticsForPerson(OpuOmUserInfo userForm, PshLackMarkForm form,Map<String, Object> map) {
		JSONObject json = new JSONObject();
		List<Map> list = new ArrayList<>();
		Map  value=new HashMap();
		StringBuffer hql = new StringBuffer("select cc.mark_person 人名,min(cc.parent_org_name),"
			+ "min(case when cc.direct_org_name is null then cc.supervise_org_name else cc.direct_org_name end ) 权属单位, "
			+" SUM(case cc.标识 when '1' then 1 else 0 end) as 数据新增,"
			+" SUM(case cc.标识 when '2' then 1 else 0 end) as 数据校核,"
			+" SUM(case when cc.check_state='2' then 1 else 0 end) as 审核通过,"
			+" SUM(case when cc.check_state ='3' then 1 else 0 end) as 存在疑问,"
			+" SUM(case cc.check_state when '1' then 1 else 0 end) as 待审核,"
			+" count(*) as 总数  ,min(cc.team_org_name) 分片区   from"
			+" (select a.mark_time, a.team_org_name, a.direct_org_name,a.supervise_org_name, a.parent_org_name,a.mark_person,a.check_state,a.component_type sslx ,'1'  标识,a.check_desription, a.road from PSH_LACK_MARK a "
			+" union all "
			+" select b.mark_time, b.team_org_name, b.direct_org_name,b.supervise_org_name, b.parent_org_name,b.mark_person,b.check_state,b.layer_name sslx ,'2' 标识,b.check_desription, b.road from CORRECT_MARK b) cc"
			+" where 1=1"
			);
		if(form!=null){
			//在区域查询页面点击查看，就带区域过来查询
			if(StringUtils.isNotBlank(form.getParentOrgName())){
				if(!"all".equals(form.getParentOrgName())){
					hql.append(" and cc.parent_org_name like :ccc");
			    	value.put("ccc","%"+form.getParentOrgName()+"%");
				}
		    }else{//不是区域点击的
		    	//当前登录人就以当前区统计为主
				Map<String,String> cmMap=correctMarkService.getFrom(userForm.getLoginName());
		     	if(cmMap!=null && cmMap.size()>0){
		     		if(!"广州市水务局".equals(cmMap.get("parentOrgName")) && cmMap.get("parentOrgName")!=null){//非市级
						hql.append(" and cc.parent_org_name=:zz");
						value.put("zz",cmMap.get("parentOrgName"));
					}
		     	}	
		    }
			if(StringUtils.isNotBlank(form.getDirectOrgName())){
				if("null".equals(form.getDirectOrgName())){
					hql.append(" and cc.direct_org_name is null ");
				}else {
					hql.append(" and cc.direct_org_name like :aa");
//					hql.append(" and (( cc.direct_org_name is null and  cc.team_org_name like :aa) ");
//					hql.append(" or (cc.direct_org_name is not null and cc.direct_org_name like :aa ))");
			    	value.put("aa","%"+form.getDirectOrgName()+"%");
				}
			 }
		    if(StringUtils.isNotBlank(form.getMarkPerson())){
		    	hql.append(" and cc.mark_person like :bb");
		    	value.put("bb","%"+form.getMarkPerson()+"%");
		    }
		    if(StringUtils.isNotBlank(form.getComponentType()) && !"全部".equals(form.getComponentType())){
		    	hql.append(" and cc.sslx=:ct");
		    	value.put("ct", form.getComponentType());
		    }
		    if(StringUtils.isNotBlank(form.getCheckDesription()) ){
				hql.append(" and cc.check_desription like :checkDesription");
				value.put("checkDesription", "%"+form.getCheckDesription()+"%");
			}
			if(StringUtils.isNotBlank(form.getRoad()) ){
				hql.append(" and cc.road like :road");
				value.put("road", "%"+form.getRoad()+"%");
			}
			if(StringUtils.isNotBlank(form.getSuperviseOrgName())){
				if("null".equals(form.getSuperviseOrgName())){
					hql.append(" and cc.supervise_org_name is null ");
				}else {
					hql.append(" and cc.supervise_org_name like :sup");
					value.put("sup","%"+form.getSuperviseOrgName()+"%");
				}
		     }
		}
		if (map!=null) {
	    	SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
			if(map.get("startTime")!=null){
				hql.append(" and to_char(cc.mark_time,'yyyyMMdd') >= :dd ");
				value.put("dd",df.format((Date)map.get("startTime")));
			}else{//没有时间默认为当天
				hql.append(" and to_char(cc.mark_time,'yyyyMMdd') >= to_char(sysdate,'yyyyMMdd') ");
			}
			if(map.get("endTime")!=null){
				hql.append(" and to_char(cc.mark_time,'yyyyMMdd') <= :ff");
				value.put("ff",df.format((Date)map.get("endTime")));
			}else{//没有时间默认为当天
				hql.append(" and to_char(cc.mark_time,'yyyyMMdd') <= to_char(sysdate,'yyyyMMdd') ");
			}
	    }
		hql.append(" group by cc.mark_person  order by count(*) desc");
		SQLQuery query = lackMarkDao.createSQLQuery(hql.toString(),value);
		List<Object[]> resultlist = query.list();
		long xz=0;
		long jh=0;
		long allData=0;
		long shtg=0;
		long czyw=0;
		long dsh=0;
		//封装成对象
		for(Object[] obj : resultlist){
			Map mp = new HashMap<>();
			mp.put("markPerson", obj[0]);
			mp.put("parentorgName",  obj[1]);
			mp.put("orgName",  obj[2]);
			mp.put("xzData",  obj[3]);
			mp.put("jhData", obj[4]);
			mp.put("shtg",  obj[5]);
			mp.put("czyw",  obj[6]);
			mp.put("dsh",  obj[7]);
			mp.put("allData",  obj[8]);
			mp.put("teamName",  obj[9]);
			xz+=obj[3]==null?0:Long.valueOf(obj[3].toString());
			jh+=obj[4]==null?0:Long.valueOf(obj[4].toString());
			shtg+=obj[5]==null?0:Long.valueOf(obj[5].toString());
			czyw+=obj[6]==null?0:Long.valueOf(obj[6].toString());
			dsh+=obj[7]==null?0:Long.valueOf(obj[7].toString());
			allData+=obj[8]==null?0:Long.valueOf(obj[8].toString());
			list.add(mp);
		}
		Map mp = new HashMap<>();
		mp.put("markPerson","");
		mp.put("parentorgName",  "");
		mp.put("orgName", "总计");
		mp.put("xzData",  xz);
		mp.put("jhData", jh);
		mp.put("shtg",  shtg);
		mp.put("czyw",  czyw);
		mp.put("dsh",  dsh);
		mp.put("allData",  allData);
		mp.put("teamName", "");
		list.add(mp);
		json.put("rows", list);
		json.put("total", list.size());
		json.put("code", 200);
		return json.toString();
	}
	/**
	 *权属范围统计
	 * */
	@Override
	public String qsfwtj(Map<String, Object> map) {
		JSONObject json = new JSONObject();
		List<Map> list = new ArrayList<>();
		Map  valueMap=new HashMap<>();
		StringBuffer hql = new StringBuffer("select t.qsdw,t.yhdw,t.yhfwms,t.gwcd,t.memo1 from sde.POLYGON t where 1=1 ");
		if (map!=null) {
			if(map.get("szqy")!=null && !map.get("szqy").equals("")){
				hql.append(" and t.szqy = :szqy");
				valueMap.put("szqy", map.get("szqy"));
			}
			if(map.get("qslx")!=null && !map.get("qslx").equals("")){
				hql.append(" and t.qslx = :qslx");
				valueMap.put("qslx", map.get("qslx"));
			}
	    }
	    hql.append(" order by t.qsdw,t.yhdw,t.lrsj "); 
		SQLQuery query = lackMarkDao.createSQLQuery(hql.toString(),valueMap);
		List<Object[]> resultlist = query.list();
		//封装成对象
		for(Object[] obj : resultlist){
			Map mp = new HashMap<>();
			mp.put("qsdw", obj[0]);
			mp.put("yhdw", obj[1]);
			mp.put("yhfwms", obj[2]);
			mp.put("gwcd", obj[3]);
			mp.put("memo1", obj[4]);
			list.add(mp);
		}
		json.put("rows", list);
		json.put("total", list.size());
		json.put("code", 200);
		return json.toString();
	}
	/**
	 *上报统计
	 *按区统计
	 * */
	@Override
	public String statisticsForArea(OpuOmUserInfo userForm, PshLackMarkForm form,Map<String, Object> map) {
		JSONObject json = new JSONObject();
		List<Map> list = new ArrayList<>();
		Map  valueMap=new HashMap<>();
		StringBuffer hql = new StringBuffer("select max(c.parent_org_name) 单位,"
			+" SUM(case when c.check_state='2' then 1 else 0 end) as 审核通过,"
			+" SUM(case when c.check_state ='3' then 1 else 0 end) as 存在疑问,"
			+" SUM(case c.check_state when '1' then 1 else 0 end) as 待审核,"
			+" SUM(case when c.lx='lack' or c.lx='correct' then 1 else 0 end) 总数,  "
			+" SUM(case c.lx when 'lack' then 1 else 0 end) as 新增,"
			+" SUM(case c.lx when 'correct' then 1 else 0 end) as 校核 ,"
			+" SUM(case when c.check_state='add' then 1 else 0 end) as 删除新增,"
			+" SUM(case when c.check_state='modify' then 1 else 0 end) as 删除校核 from"
			+" (select  'lack' as lx,a.mark_time,a.parent_org_name,a.parent_org_id,a.check_state,a.component_type sslx ,a.check_desription, a.road from PSH_LACK_MARK a "
			+" union all "
			+" select  'correct' as lx,b.mark_time, b.parent_org_name,b.parent_org_id,b.check_state,b.layer_name sslx,b.check_desription, b.road from CORRECT_MARK b "
			+ "union all "
			+" select  'del' as lx,d.mark_time, d.parent_org_name,d.parent_org_id,d.report_type check_state,d.layer_name sslx,d.check_desription, d.road from report_delete d "
			+" ) c"
			+" where 1=1");
		if(form!=null){
			if(StringUtils.isNotBlank(form.getParentOrgName())){
		    	hql.append(" and c.parent_org_name like :do");
		    	valueMap.put("do", "%"+form.getParentOrgName()+"%");
		    }
			if(StringUtils.isNotBlank(form.getComponentType()) && !"全部".equals(form.getComponentType())){
		    	hql.append(" and c.sslx=:ct");
		    	valueMap.put("ct", form.getComponentType());
		    }
			if(StringUtils.isNotBlank(form.getCheckDesription()) ){
				hql.append(" and c.check_desription like :checkDesription");
				valueMap.put("checkDesription", "%"+form.getCheckDesription()+"%");
			}
			if(StringUtils.isNotBlank(form.getRoad()) ){
				hql.append(" and c.road like :road");
				valueMap.put("road", "%"+form.getRoad()+"%");
			}
		}
		if (map!=null) {
	    	SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
			if(map.get("startTime")!=null){
				hql.append(" and to_char(c.mark_time,'yyyyMMdd') >= :startTime ");
				valueMap.put("startTime", df.format((Date)map.get("startTime")));
			}else{//没有时间默认为当天
				hql.append(" and to_char(c.mark_time,'yyyyMMdd') >= to_char(sysdate,'yyyyMMdd') ");
			}
			if(map.get("endTime")!=null){
				hql.append(" and to_char(c.mark_time,'yyyyMMdd') <= :endTime");
				valueMap.put("endTime", df.format((Date)map.get("endTime")));
			}else{//没有时间默认为当天
				hql.append(" and to_char(c.mark_time,'yyyyMMdd') <= to_char(sysdate,'yyyyMMdd') ");
			}
	    }
	    hql.append(" group by c.parent_org_id  ");//order by count(*) desc
	    hql.append(" order by  case "); 
	    hql.append(" when c.parent_Org_id = '1066' then 1");//%天河% 按特定顺序排序
		hql.append(" when c.parent_Org_id = '1067' then 2");//%番禺% 
		hql.append(" when c.parent_Org_id = '1068' then 3");//%黄埔% 
		hql.append(" when c.parent_Org_id = '1069' then 4");//%白云% 
		hql.append(" when c.parent_Org_id = '1070' then 5");//%南沙% 
		hql.append(" when c.parent_Org_id = '1151' then 6");//%海珠% 
		hql.append(" when c.parent_Org_id = '1072' then 7");//%荔湾% 
		hql.append(" when c.parent_Org_id = '1073' then 8");//%花都% 
		hql.append(" when c.parent_Org_id = '1074' then 9");//%越秀% 
		hql.append(" when c.parent_Org_id = '1075' then 10");//%增城% 
		hql.append(" when c.parent_Org_id = '1076' then 11");//%从化% 
		hql.append(" when c.parent_Org_id = '1077' then 12");//%净水有限公司% 
		hql.append(" end ");  
		//data : ['天河','番禺','黄埔','白云','南沙','海珠', '荔湾','花都','越秀','增城','从化','净水有限公司']
		SQLQuery query = lackMarkDao.createSQLQuery(hql.toString(),valueMap);
		List<Object[]> resultlist = query.list();
		String[] qy = new String[]{"天河","番禺","黄埔","白云","南沙","海珠", "荔湾","花都","越秀","增城","从化","净水有限公司","市水务局"};
		//封装成对象
		long shtg=0;
		long czyw=0;
		long dsh=0;
		long allData=0;
		long xz=0;
		long jh=0;
		int index=0;
		long delXz=0;
		long delJh=0;
		for(Object[] obj : resultlist){
			if(obj[0].toString().indexOf(qy[index])<0){
				while(index<=qy.length-1 && obj[0].toString().indexOf(qy[index])<0){
					Map mp = new HashMap<>();
					mp.put("orgName", qy[index]);
					mp.put("shtg",  0);
					mp.put("czyw",  0);
					mp.put("dsh",  0);
					mp.put("allData", 0);
					mp.put("xz", 0);
					mp.put("jh", 0);
					mp.put("delXz", 0);
					mp.put("delJh",0);
					list.add(mp);
					index++;
				}
			}
			Map mp = new HashMap<>();
			mp.put("orgName", obj[0]);
			mp.put("shtg",  obj[1]);
			mp.put("czyw",  obj[2]);
			mp.put("dsh",  obj[3]);
			mp.put("allData", obj[4]);
			mp.put("xz", obj[5]);
			mp.put("jh", obj[6]);
			mp.put("delXz", obj[7]);
			mp.put("delJh", obj[8]);
			list.add(mp);
			index++;
			shtg+=obj[1]==null?0:Long.valueOf(obj[1].toString());
			czyw+=obj[2]==null?0:Long.valueOf(obj[2].toString());
			dsh+=obj[3]==null?0:Long.valueOf(obj[3].toString());
			allData+=obj[4]==null?0:Long.valueOf(obj[4].toString());
			xz+=obj[5]==null?0:Long.valueOf(obj[5].toString());
			jh+=obj[6]==null?0:Long.valueOf(obj[6].toString());
			delXz+=obj[7]==null?0:Long.valueOf(obj[7].toString());
			delJh+=obj[8]==null?0:Long.valueOf(obj[8].toString());
		}
		if(index<qy.length){
			while(index<=qy.length-1){
				Map mp = new HashMap<>();
				mp.put("orgName", qy[index]);
				mp.put("shtg",  0);
				mp.put("czyw",  0);
				mp.put("dsh",  0);
				mp.put("allData", 0);
				mp.put("xz", 0);
				mp.put("jh", 0);
				mp.put("delXz",0);
				mp.put("delJh", 0);
				list.add(mp);
				index++;
			}
		}
		Map mp = new HashMap<>();
		mp.put("orgName", "总计");
		mp.put("shtg",  shtg);
		mp.put("czyw",  czyw);
		mp.put("dsh",  dsh);
		mp.put("allData", allData);
		mp.put("xz", xz);
		mp.put("jh", jh);
		mp.put("delXz",delXz);
		mp.put("delJh",delJh);
		list.add(mp);
		json.put("rows", list);
		json.put("total", list.size());
		json.put("code", 200);
		return json.toString();
	}
	
	/**
	 *上报统计
	 *按单位统计
	 * */
	@Override
	public String statisticsForUnit(OpuOmUserInfo userForm, PshLackMarkForm form,Map<String, Object> map) {
		JSONObject json = new JSONObject();
		List<Map> list = new ArrayList<>();
		Map  valueMap=new HashMap<>();
		StringBuffer hql = new StringBuffer("select c.direct_org_name 权属单位,"
			+" SUM(case when c.check_state='2' then 1 else 0 end) as 审核通过,"
			+" SUM(case when c.check_state ='3' then 1 else 0 end) as 存在疑问,"
			+" SUM(case c.check_state when '1' then 1 else 0 end) as 待审核,"
			+" SUM(case when c.lx='lack' or c.lx='correct' then 1 else 0 end) 总数,  "
			+" SUM(case c.lx when 'lack' then 1 else 0 end) as 新增,"
			+" SUM(case c.lx when 'correct' then 1 else 0 end) as 校核,min(c.parent_org_name),"
			+" SUM(case when c.check_state='add' then 1 else 0 end) as 删除新增,"
			+" SUM(case when c.check_state='modify' then 1 else 0 end) as 删除校核,min(c.supervise_org_name) from"
			+" (select  'lack' as lx, a.team_org_name, a.direct_org_name,a.supervise_org_name,a.mark_time,a.parent_org_name,a.parent_org_id,a.check_state,a.component_type sslx ,a.check_desription, a.road from PSH_LACK_MARK a "
			+" union all "
			+" select  'correct' as lx, b.team_org_name, b.direct_org_name,b.supervise_org_name,b.mark_time, b.parent_org_name,b.parent_org_id,b.check_state,b.layer_name sslx,b.check_desription, b.road from CORRECT_MARK b "
			+ "union all "
			+" select  'del' as lx, d.team_org_name,d.direct_org_name,d.supervise_org_name,d.mark_time,d.parent_org_name,d.parent_org_id,d.report_type check_state,d.layer_name sslx,d.check_desription, d.road from report_delete d "
			+ ") c"
			+" where 1=1");
		if(form!=null){
			//在区域查询页面点击查看，就带区域过来查询
			if(StringUtils.isNotBlank(form.getParentOrgName())){
				if(!"all".equals(form.getParentOrgName())){
					hql.append(" and c.parent_org_name like :do");
			    	valueMap.put("do", "%"+form.getParentOrgName()+"%");
				}
		    }else{//不是区域点击的
		    	//当前登录人就以当前区统计为主
				Map<String,String> cmMap=correctMarkService.getFrom(userForm.getLoginName());
		     	if(cmMap!=null && cmMap.size()>0){
		     		if(!"广州市水务局".equals(cmMap.get("parentOrgName")) && cmMap.get("parentOrgName")!=null){//非市级
						hql.append(" and c.parent_org_name=:zz");
						valueMap.put("zz",cmMap.get("parentOrgName"));
					}
		     	}	
		    }
			if(StringUtils.isNotBlank(form.getComponentType()) && !"全部".equals(form.getComponentType())){
		    	hql.append(" and c.sslx=:ct");
		    	valueMap.put("ct", form.getComponentType());
		    }
			if(StringUtils.isNotBlank(form.getCheckDesription()) ){
				hql.append(" and c.check_desription like :checkDesription");
				valueMap.put("checkDesription", "%"+form.getCheckDesription()+"%");
			}
			if(StringUtils.isNotBlank(form.getRoad()) ){
				hql.append(" and c.road like :road");
				valueMap.put("road", "%"+form.getRoad()+"%");
			}
			if(StringUtils.isNotBlank(form.getDirectOrgName())){
				hql.append(" and c.direct_org_name like :aa");
//				hql.append(" and (( c.direct_org_name is null and  c.team_org_name like :aa) ");
//				hql.append(" or (c.direct_org_name is not null and c.direct_org_name like :aa ))");
				valueMap.put("aa","%"+form.getDirectOrgName()+"%");
		    	//三件事：1条件这个2机构登记修改3用户导入excel
		    }
		}
		if (map!=null) {
	    	SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
			if(map.get("startTime")!=null){
				hql.append(" and to_char(c.mark_time,'yyyyMMdd') >= :startTime ");
				valueMap.put("startTime", df.format((Date)map.get("startTime")));
			}else{//没有时间默认为当天
				hql.append(" and to_char(c.mark_time,'yyyyMMdd') >= to_char(sysdate,'yyyyMMdd') ");
			}
			if(map.get("endTime")!=null){
				hql.append(" and to_char(c.mark_time,'yyyyMMdd') <= :endTime");
				valueMap.put("endTime", df.format((Date)map.get("endTime")));
			}else{//没有时间默认为当天
				hql.append(" and to_char(c.mark_time,'yyyyMMdd') <= to_char(sysdate,'yyyyMMdd') ");
			}
	    }
	    hql.append(" group by c.direct_org_name,c.supervise_org_name,c.parent_org_name order by count(*) desc");
	    SQLQuery query = lackMarkDao.createSQLQuery(hql.toString(),valueMap);
		List<Object[]> resultlist = query.list();
		//封装成对象
		long shtg=0;
		long czyw=0;
		long dsh=0;
		long allData=0;
		long xz=0;
		long jh=0;
		int index=0;
		long delXz=0;
		long delJh=0;
		for(Object[] obj : resultlist){
			Map mp = new HashMap<>();
			mp.put("orgName", obj[0]);
			mp.put("shtg",  obj[1]);
			mp.put("czyw",  obj[2]);
			mp.put("dsh",  obj[3]);
			mp.put("allData", obj[4]);
			mp.put("xz", obj[5]);
			mp.put("jh", obj[6]);
			mp.put("orgNameArea", obj[7]);
			mp.put("delXz", obj[8]);
			mp.put("delJh", obj[9]);
			mp.put("supName", obj[10]);
			list.add(mp);
			index++;
			shtg+=obj[1]==null?0:Long.valueOf(obj[1].toString());
			czyw+=obj[2]==null?0:Long.valueOf(obj[2].toString());
			dsh+=obj[3]==null?0:Long.valueOf(obj[3].toString());
			allData+=obj[4]==null?0:Long.valueOf(obj[4].toString());
			xz+=obj[5]==null?0:Long.valueOf(obj[5].toString());
			jh+=obj[6]==null?0:Long.valueOf(obj[6].toString());
			delXz+=obj[7]==null?0:Long.valueOf(obj[8].toString());
			delJh+=obj[8]==null?0:Long.valueOf(obj[9].toString());
		}
		Map mp = new HashMap<>();
		mp.put("orgName", "总计");
		mp.put("shtg",  shtg);
		mp.put("czyw",  czyw);
		mp.put("dsh",  dsh);
		mp.put("allData", allData);
		mp.put("xz", xz);
		mp.put("jh", jh);
		mp.put("delXz", delXz);
		mp.put("delJh", delJh);
		list.add(mp);
		json.put("rows", list);
		json.put("total", list.size());
		json.put("code", 200);
		return json.toString();
	}
	
	/**
	 * 首页地图上显示各区上报数量
	 * */
	public String showAreaData(PshLackMarkForm form,Map<String, Object> map) {
		List<Object[]> list = new ArrayList<>();
		Map values = new HashMap<>();
		JSONArray jsonArray=new JSONArray();
		StringBuffer hql = new StringBuffer("select c.name,count(*) from (");
		hql.append("select a.parent_Org_Name as name from PSH_LACK_MARK a ");
		hql.append(" union all ");
		hql.append("select b.parent_Org_Name as name from Correct_Mark b ");
		hql.append(" ) c where c.name <> '广州市水务局' and c.name <> '广州市净水有限公司' group by c.name ");
		list = lackMarkDao.createSQLQuery(hql.toString(),values).list();
		if(list!=null && list.size()>0){
			for(Object[] o:list){
				jsonArray.add(o);
			}
		}
		return jsonArray.toString();
	}

	@Override
	public String getAllLackAndCorrect(OpuOmUserInfo userForm,PshLackMarkForm form, Map<String, Object> map,Page<PshLackMarkForm> page) {
		JSONObject json = new JSONObject();
		List<Map> list = new ArrayList<>();
		Map  value=new HashMap();
		StringBuffer hql = new StringBuffer("select * from"
			+" (select a.parent_org_name,a.pcode,a.child_Code,a.object_Id,a.road,a.addr, a.mark_person,a.mark_time, a.direct_org_name,a.supervise_org_name,a.check_state,a.parent_org_id,a.component_Type layerName from PSH_LACK_MARK a "
			+" union all "
			+" select b.parent_org_name,b.pcode,b.child_Code,b.object_Id,b.road,b.addr, b.mark_person,b.mark_time, b.direct_org_name,b.supervise_org_name,b.check_state,b.parent_org_id,b.layer_Name layerName from CORRECT_MARK b) cc"
			+" where 1=1"
			);
		Boolean isAddDate=true;
		if(form!=null){
			//在区域查询页面点击查看，就带区域过来查询
			if(StringUtils.isNotBlank(form.getParentOrgId())){
				if(!"all".equals(form.getParentOrgId())){
					hql.append(" and cc.parent_org_id = :ccc");
			    	value.put("ccc",form.getParentOrgId());
			    	isAddDate=false;
				}
		    }else{//不是区域点击的
		    	//当前登录人就以当前区统计为主
				Map<String,String> cmMap=correctMarkService.getFrom(userForm.getLoginName());
		     	if(cmMap!=null && cmMap.size()>0){
		     		if(!"广州市水务局".equals(cmMap.get("parentOrgName")) && cmMap.get("parentOrgName")!=null){//非市级
						hql.append(" and cc.parent_org_name=:zz");
						value.put("zz",cmMap.get("parentOrgName"));
						isAddDate=false;
					}
		     	}	
		    }
			if(StringUtils.isNotBlank(form.getDirectOrgName())){
				if("null".equals(form.getDirectOrgName())){
					hql.append(" and cc.direct_org_name is null ");
				}else {
					hql.append(" and cc.direct_org_name like :aa");
//					hql.append(" and (( cc.direct_org_name is null and  cc.team_org_name like :aa) ");
//					hql.append(" or (cc.direct_org_name is not null and cc.direct_org_name like :aa ))");
			    	value.put("aa","%"+form.getDirectOrgName()+"%");
				}
				isAddDate=false;
			 }
			if(StringUtils.isNotBlank(form.getChildCode())){
		    	hql.append(" and cc.child_Code like :ci");
		    	value.put("ci","%"+form.getChildCode()+"%");
		    	isAddDate=false;
		    }
		    if(StringUtils.isNotBlank(form.getPcode())){
		    	hql.append(" and cc.pcode like :pd");
		    	value.put("pd","%"+form.getPcode()+"%");
		    	isAddDate=false;
		    }
		    if(StringUtils.isNotBlank(form.getMarkPerson())){
		    	hql.append(" and cc.mark_person like :bb");
		    	value.put("bb","%"+form.getMarkPerson()+"%");
		    	isAddDate=false;
		    }
		    if(StringUtils.isNotBlank(form.getObjectId())){
		    	hql.append(" and cc.object_Id like :ob");
		    	value.put("ob","%"+form.getObjectId()+"%");
		    	isAddDate=false;
		    }
		    if(StringUtils.isNotBlank(form.getComponentType()) && !"全部".equals(form.getComponentType())){
		    	hql.append(" and cc.sslx=:ct");
		    	value.put("ct", form.getComponentType());
		    	isAddDate=false;
		    }
		    if(StringUtils.isNotBlank(form.getCheckDesription()) ){
				hql.append(" and cc.check_desription like :checkDesription");
				value.put("checkDesription", "%"+form.getCheckDesription()+"%");
				isAddDate=false;
			}
			if(StringUtils.isNotBlank(form.getRoad()) ){
				hql.append(" and cc.road like :road");
				value.put("road", "%"+form.getRoad()+"%");
				isAddDate=false;
			}
			if(StringUtils.isNotBlank(form.getSuperviseOrgName())){
				if("null".equals(form.getSuperviseOrgName())){
					hql.append(" and cc.supervise_org_name is null ");
				}else {
					hql.append(" and cc.supervise_org_name like :sup");
					value.put("sup","%"+form.getSuperviseOrgName()+"%");
				}
				isAddDate=false;
		     }
		}
		if (map!=null) {
	    	SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
			if(map.get("startTime")!=null){
				hql.append(" and to_char(cc.mark_time,'yyyyMMdd') >= :dd ");
				value.put("dd",df.format((Date)map.get("startTime")));
			}else if(isAddDate){//没有任何参数默认为当天
				hql.append(" and to_char(cc.mark_time,'yyyyMMdd') >= to_char(sysdate,'yyyyMMdd') ");
			}
			if(map.get("endTime")!=null){
				hql.append(" and to_char(cc.mark_time,'yyyyMMdd') <= :ff");
				value.put("ff",df.format((Date)map.get("endTime")));
			}else if(isAddDate){//没有任何参数默认为当天
				hql.append(" and to_char(cc.mark_time,'yyyyMMdd') <= to_char(sysdate,'yyyyMMdd') ");
			}
	    }
		hql.append(" order by cc.object_Id desc");
		String sql = SqlPageUtils.getPageSql(page, hql.toString());
		SQLQuery query = lackMarkDao.createSQLQuery(sql,value);
		List<Object[]> resultlist = query.list();
//		Page pg = PageUtils.newPageInstance(page);
//		pg.setTotalItems(list.size());
//		List<Object[]> resultlist = getPageList(resultlistAll,pg);//执行分页
		Long count=lackMarkDao.countSqlResult( hql.toString(), value);
		//封装成对象
		for(Object[] obj : resultlist){
			Map mp = new HashMap<>();
			mp.put("parent_org_name", obj[1]);
			mp.put("pcode",  obj[2]);
			mp.put("child_Code",  obj[3]);
			mp.put("object_Id",  obj[4]);
			mp.put("road", obj[5]);
			mp.put("addr",  obj[6]);
			mp.put("mark_person",  obj[7]);
			mp.put("mark_time",  obj[8]);
			mp.put("direct_org_name",  obj[9]);
			mp.put("supervise_org_name",  obj[10]);
			mp.put("check_state",  obj[11]);
			mp.put("layerName",  obj[13]);
			list.add(mp);
		}
		json.put("rows", list);
		json.put("total", count);
		json.put("code", 200);
		return json.toString();
	}
	
	 private List<Object[]> getPageList(List<Object[]> list, Page pg) {
        List<Object[]> newList = new ArrayList<Object[]>();
        if(list.size() <= (pg.getPageNo()*pg.getPageSize())){
            newList = list.subList((pg.getPageNo()-1)*pg.getPageSize(),list.size());
        }else{
            newList = list.subList((pg.getPageNo()-1)*pg.getPageSize(),pg.getPageNo()*pg.getPageSize());
        }
        return newList;
    }
	 /**
		 * 移动端根据ObjId查询图片信息(新增与校核)
		 */
		@Override
		public Map<String,Object>  getFormByObjId(String path,String ObjId) {
			Map<String,Object> map = new HashMap();
			StringBuffer hql = new StringBuffer("from PshLackMark ps where 1=1 ");
			Map<String,Object> values = new HashMap<String,Object>();
			if(StringUtils.isNotBlank(ObjId)){
				hql.append(" and ps.objectId = :ObjId");
				values.put("ObjId", ObjId);
			}
			List<PshLackMark> lackMarkList = lackMarkDao.find(hql.toString(), values);
			if(lackMarkList != null && lackMarkList.size()>0){
				PshLackMarkForm form= PshLackMarkConvertor.convertVoToForm(lackMarkList.get(0));
				Map mapForm = PshLackMarkConvertor.convertFormToMap(form);
				List<LackMarkAttachmentForm> list = lackMarkAttachmentService.getMarkId(form.getId().toString());
				List<LackMarkAttachment> listAttachments = 
						LackMarkAttachmentConvertor.convertFormListToVoList(list);
				List<Map> listMap =LackMarkAttachmentConvertor.
						convertVoListToMapList(listAttachments);
				if(listMap!=null && listMap.size()>0){
					for(Map mp :listMap){
						mp.put("attPath",mp.get("attPath")!=null? path+mp.get("attPath").toString():"");
						mp.put("thumPath",mp.get("thumPath")!=null? path+mp.get("thumPath").toString():"");
						if(mp.containsKey("attTime")){
							Date time = (Date)mp.get("attTime");
							mp.put("attTime", time!=null? time.getTime():null);
						}
					}
				}
				//map.put("data", mapForm);
				map.put("rows", listMap);
				return map;
			}
			return map;
		}
}