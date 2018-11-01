package com.augurit.awater.dri.problem_report.diary.service.impl;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.awater.dri.problem_report.diary.convert.DiaryAttachmentConvertor;
import com.augurit.awater.dri.problem_report.diary.convert.DiaryConvertor;
import com.augurit.awater.dri.problem_report.diary.dao.DiaryDao;
import com.augurit.awater.dri.problem_report.diary.entity.Diary;
import com.augurit.awater.dri.problem_report.diary.entity.DiaryAttachment;
import com.augurit.awater.dri.problem_report.diary.service.IDiaryAttachmentService;
import com.augurit.awater.dri.problem_report.diary.service.IDiaryService;
import com.augurit.awater.dri.problem_report.diary.web.form.DiaryAttachmentForm;
import com.augurit.awater.dri.problem_report.diary.web.form.DiaryForm;
import com.augurit.awater.util.page.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.util.PropertyFilter;


@Service
@Transactional
public class DiaryServiceImpl implements IDiaryService {

	@Autowired
	private DiaryDao diaryDao;
	@Autowired
	private IDiaryAttachmentService diaryAttachmentService;
	@Autowired
	private IOmOrgRestService omOrgService;
	@Autowired
	private IOmUserInfoRestService omUserService;
	
	/************************************pc端**************************************/
	/**
	 * 查询条件统计图
	 * */
	@Override
	public String searchEachts(DiaryForm form, Map<String, Object> map) {
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
	 * 获取巡查列表
	 * */
	@Override
	public String getDiary(Page<DiaryForm> page, DiaryForm form,Map<String,Object> map ) {
		JSONObject json = new JSONObject();
		try {
			Page<DiaryForm> pages= this.searchFromAndMap(page, form, map);
			List<DiaryForm> list = new ArrayList<>();
			Long total=null;
			if(pages.getResult()!=null){
				list= pages.getResult();
				total = pages.getTotalItems();
			}
			json.put("rows", list);
			json.put("total", total);
			json.put("code", 200);
		} catch (RuntimeException e) {
			json.put("code", 500);
			e.printStackTrace();
			throw new RuntimeException(e);
		}
		return json.toString();
	}
	/**
	 * 删除日志
	 */
	@Override
	public String deleteDiary(String id) {
		JSONObject json = new JSONObject();
		try {
			if(StringUtils.isNotBlank(id)){
				Long formId = Long.parseLong(id);
				this.delete(formId);
				json.put("code", 200);
				json.put("message", "删除成功！");
			}else{
				json.put("code", 300);
				json.put("message", "参数错误!");
			}
		} catch (NumberFormatException e) {
			json.put("code", 500);
			json.put("message", "参数类型错误!");
			e.printStackTrace();
		}
		return json.toString();
	}

	/**
	 * 获取当前设施的巡查日志
	 * @param corrFrom 查询参数对象
	 * */
	@Override
	public Page<DiaryForm> searchDiaryOfFacilty( String objectId,Page<DiaryForm> page,
												 DiaryForm corrFrom, Map<String, Object> map) {
		//返回的符合条件的List集合
		List<DiaryForm> list= new ArrayList<>();
		Page<DiaryForm> pg = new Page<>();
		//corrFrom.setWriterId(loginName);
		corrFrom.setObjectId(objectId);
		pg = this.searchFromAndMap(page,corrFrom,map);
		return pg;
	}

	/**
	 * 查看日志列表时显示图片
	 * */
	@Override
	public Map<String,Object> seeDiaryMark(String path, long id) {
		Map<String,Object> map = new HashMap();
		//diaryDao.getSessionFactory().evict(Diary.class,id);
		DiaryForm form = get(id);
		if(form==null){
			return map;
		}
		Map mapForm = DiaryConvertor.convertFormToMap(form);
		List<DiaryAttachmentForm> list =  diaryAttachmentService.getMarkId(form.getId().toString());
		List<DiaryAttachment> listAttachments =
				DiaryAttachmentConvertor.convertFormListToVoList(list);
		List<Map> listMap = DiaryAttachmentConvertor.
				convertVoListToMapList(listAttachments);
		if(listMap!=null&&listMap.size()>0){
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
	 * 查看详细
	 * */
	@Override
	public String seeDiary(Long id) {
		JSONObject json = new JSONObject();
		try {
			DiaryForm form = this.get(id);
			List<DiaryAttachmentForm> list = diaryAttachmentService.getMarkId(id.toString());
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
	public List<Map<String, Object>> searchGroup (DiaryForm form, Map<String,Object> map){
		List<Map<String, Object>> list = new ArrayList<>();
		StringBuffer hql = new StringBuffer("");
		Map values = new HashMap<>();
		if(StringUtils.isNotBlank(form.getParentOrgName()) &&
				!StringUtils.isNotBlank(form.getDirectOrgName())){
			hql.append("select ps.parentOrgName as name,count(*) as total from Diary ps where 1=1");
			if(StringUtils.isNotBlank(form.getLayerName())){
				hql.append(" and ps.layerName like :layerName");
				values.put("layerName", "%"+form.getLayerName()+"%");
			}
			if(map.size()>0 && map.containsKey("startTime") && map.containsKey("endTime")){
				hql.append(" and ps.recordTime between :startTime and :endTime");
				values.put("startTime", (Date)map.get("startTime"));
				values.put("endTime", (Date)map.get("endTime"));
			}
			hql.append(" group by ps.parentOrgName");
		}else if(StringUtils.isNotBlank(form.getDirectOrgName()) && 
					StringUtils.isNotBlank(form.getParentOrgName())){
			hql.append("select ps.directOrgName as name,count(*) as total from Diary ps where 1=1");
			if(StringUtils.isNotBlank(form.getLayerName())){
				hql.append(" and ps.layerName like :layerName");
				values.put("layerName", "%"+form.getLayerName()+"%");
			}
			if(map.size()>0 && map.containsKey("startTime") && map.containsKey("endTime")){
				hql.append(" and ps.recordTime between :startTime and :endTime");
				values.put("startTime", (Date)map.get("startTime"));
				values.put("endTime", (Date)map.get("endTime"));
			}
			hql.append(" and ps.parentOrgName like :parentOrgName");
			values.put("parentOrgName", "%"+form.getParentOrgName()+"%");
			hql.append(" group by ps.directOrgName");
		}else if(StringUtils.isNotBlank(form.getTeamOrgName()) &&
				StringUtils.isNotBlank(form.getDirectOrgName())){
			hql.append("select ps.teamOrgName as name,count(*) as total from Diary ps where 1=1");
			if(StringUtils.isNotBlank(form.getLayerName())){
				hql.append(" and ps.layerName like :layerName");
				values.put("layerName", "%"+form.getLayerName()+"%");
			}
			if(map.size()>0 && map.containsKey("startTime") && map.containsKey("endTime")){
				hql.append(" and ps.recordTime between :startTime and :endTime");
				values.put("startTime", (Date)map.get("startTime"));
				values.put("endTime", (Date)map.get("endTime"));
			}
			hql.append(" and ps.directOrgName like :directOrgName");
			values.put("directOrgName", "%"+form.getDirectOrgName()+"%");
			hql.append(" group by ps.teamOrgName");
		}
		if(StringUtils.isNotBlank(hql.toString())){
			list = diaryDao.find(hql.toString(), values);
			//Query query =  diaryDao.createQuery(hql.toString(), values);
			//list = query.list();
		}
		return list;
	}
	/************************************移动端业务**************************************/
	/**
	 * 获取当前所属巡查组或者单位下的巡查日志
	 * @param corrFrom 查询参数对象
	 * */
	@Override
	public Page<DiaryForm> searchDiaryOfUser(String loginName,Page<DiaryForm> page,
			DiaryForm corrFrom, Map<String, Object> map) {
		//返回的符合条件的List集合
		List<DiaryForm> list= new ArrayList<>();
		Page<DiaryForm> pg = new Page<>();
		corrFrom.setWriterId(loginName);
		pg = this.searchFromAndMap(page,corrFrom,map);
		//得到所属上级机构的信息，再判断是哪一级别的单位
		/*OpuOmUserInfo user = omUserService.getOpuOmUserInfoByLoginName(loginName);
		List<OpuOmOrg> listOrg =  omOrgService.listOpuOmOrgByUserId(user.getUserId());
		if(listOrg!=null){
			for (OpuOmOrg omOrgForm: listOrg) {
				if(omOrgForm.getOrgRank().equals("11")) { //队伍
					corrFrom.setTeamOrgId(omOrgForm.getOrgId().toString());
					corrFrom.setDirectOrgId(null);
					corrFrom.setSuperviseOrgId(null);
					corrFrom.setParentOrgId(null);
					pg = this.searchFromAndMap(page,corrFrom,map);
					if(pg.getResult()!=null){
						for(DiaryForm f : pg.getResult()){
							if(StringUtils.isNotBlank(f.getTeamMember())){
								JSONArray jsonArry = null;
								try {
									jsonArry = JSONArray.fromObject(f.getTeamMember());
								} catch (RuntimeException e) {
									e.printStackTrace();
									throw new RuntimeException(e);
								}
								if(jsonArry!=null){
									for(int i=0;i<jsonArry.size();i++){
										JSONObject json = (JSONObject) jsonArry.get(i);
										if(json.containsKey("loginName") &&
												json.getString("loginName").equals(loginName)){
											list.add(f);
										}
									}
								}
							}else{
								if(f.getWriterId().equals(loginName)){
									list.add(f);
								}
							}
						}
					}
					break;
				}else if(omOrgForm.getOrgRank().equals("12")){// 直属单位
					corrFrom.setDirectOrgId(omOrgForm.getOrgId().toString());
					corrFrom.setSuperviseOrgId(null);
					corrFrom.setParentOrgId(null);
					pg = this.searchFromAndMap(page,corrFrom,map);
					break;
				}else if(omOrgForm.getOrgRank().equals("13")){ // 监理单位
					corrFrom.setSuperviseOrgId(omOrgForm.getOrgId().toString());
					corrFrom.setParentOrgId(null);
					pg = this.searchFromAndMap(page,corrFrom,map);
					break;
				}else if(omOrgForm.getOrgRank().equals("14")){ // 业主单位
					corrFrom.setParentOrgId(omOrgForm.getOrgId().toString());
					pg = this.searchFromAndMap(page,corrFrom,map);
					break;
				}else if("1".equals(omOrgForm.getOrgRank())) {//管理部门(管理部门的上一级(或者上上级)是业主单位)
					pg = this.searchFromAndMap(page, corrFrom, map);
					break;
				}
			}
		}*/
		return pg;
	}
	
	/**
	 * 根据记录人id查询
	 * */
	public List<DiaryForm> searchFormOfWriterId(Page<DiaryForm> page,
			DiaryForm form) {
		List<DiaryForm> list= new ArrayList<>();
		Map<String,Object> values = new HashMap<String,Object>();
		if(StringUtils.isNotBlank(form.getWriterId())){
			StringBuffer hql = new StringBuffer(" from Diary ps where 1=1 and ps.writerId=:writerId");
			values.put("writerId", form.getWriterId());
			hql.append(" order by ps.recordTime desc");
			hql.append(HqlUtils.buildOrderBy(page, "ps"));
			Page pg = diaryDao.findPage(page, hql.toString(), values);
			// 转换为Form对象列表并赋值到原分页对象中
			list = DiaryConvertor.convertVoListToFormList(pg.getResult());
		}
		return list;
	}
	/**
	 * 条件查询列表
	 * */
	@Override
	public Page<DiaryForm> searchFromAndMap(Page<DiaryForm> page,
											DiaryForm form, Map<String, Object> map) {
		StringBuffer hql = new StringBuffer("from Diary ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		// 查询条件
		if(form != null){
			if(form.getId() !=null && form.getId()!= 0 ){
				hql.append(" and ps.id=:id");
				values.put("id", form.getId());
			}
			if(StringUtils.isNotBlank(form.getUsid())){
				hql.append(" and ps.usid=:usid");
				values.put("usid", form.getUsid());
			}
			if(StringUtils.isNotBlank(form.getWriterId())){
				hql.append(" and ps.writerId=:writerId");
				values.put("writerId", form.getWriterId());
			}
			/*if(StringUtils.isNotBlank(form.getObjectId())){
				hql.append(" and ps.objectId=:objectId");
				values.put("objectId", form.getObjectId());
			}*/
			if(StringUtils.isNotBlank(form.getWriterName())){
				hql.append(" and ps.writerName like :writerName");
				values.put("writerName", "%"+form.getWriterName()+"%");
			}
			if(StringUtils.isNotBlank(form.getTeamOrgId())){//巡逻队伍
				hql.append(" and ps.teamOrgId = :teamOrgId");
				values.put("teamOrgId", form.getTeamOrgId());
			}
			if(StringUtils.isNotBlank(form.getDirectOrgName())){ //直属单位
				hql.append(" and ps.directOrgName like :directOrgName");
				values.put("directOrgName", "%"+form.getDirectOrgName()+"%");
			}
			if(StringUtils.isNotBlank(form.getSuperviseOrgId())){
				hql.append(" and ps.superviseOrgId = :superviseOrgId");
				values.put("superviseOrgId", form.getSuperviseOrgId());
			}
			if(StringUtils.isNotBlank(form.getParentOrgId())){ //业主单位
				hql.append(" and ps.parentOrgId = :parentOrgId");
				values.put("parentOrgId", form.getParentOrgId());
			}
			//pc端条件查询
			/*if(StringUtils.isNotBlank(form.getParentOrgName()) && !"全部".equals(form.getParentOrgName())){ //业主单位
				hql.append(" and ps.parentOrgName like :parentOrgName");
				values.put("parentOrgName", "%"+form.getParentOrgName()+"%");
			}*/
			if(StringUtils.isNotBlank(form.getLayerName()) && !"全部".equals(form.getLayerName())){
				hql.append(" and ps.layerName like :layerName");
				values.put("layerName", "%"+form.getLayerName()+"%");
			}
		}
		if(map!=null){
			SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
			if(map.get("startTime")!=null){
				hql.append(" and to_char(ps.recordTime,'yyyymmdd') >= :startTime ");
				values.put("startTime", df.format((Date)map.get("startTime")));
			}
			if(map.get("endTime")!=null){
				hql.append(" and to_char(ps.recordTime,'yyyymmdd') <= :endTime");
				values.put("endTime", df.format((Date)map.get("endTime")));
			}

			if(map.containsKey("layerName") && StringUtils.isNotBlank(map.get("layerName").toString()) && !"全部".equals(map.get("layerName").toString())){
				hql.append(" and ps.layerName like :layerName");
				values.put("layerName", "%"+map.get("layerName")+"%");
			}
			if(map.containsKey("parentOrgName")&&StringUtils.isNotBlank(map.get("parentOrgName").toString()) && !"全市".equals(form.getParentOrgName())){
				hql.append(" and ps.parentOrgName like :parentOrgName");
				values.put("parentOrgName", "%"+map.get("parentOrgName")+"%");
			}
			if(map.containsKey("road") && StringUtils.isNotBlank(map.get("road").toString())){
				hql.append(" and ps.road like :road");
				values.put("road", "%"+map.get("road")+"%");
			}
			if(map.containsKey("attrFive") && StringUtils.isNotBlank(map.get("attrFive").toString())){
				hql.append(" and ps.attrFive like :attrFive");
				values.put("attrFive", "%"+map.get("attrFive")+"%");
			}
			if(map.containsKey("addr") && StringUtils.isNotBlank(map.get("addr").toString())){
				hql.append(" and ps.addr like :addr");
				values.put("addr", "%"+map.get("addr")+"%");
			}
			if(map.containsKey("objectId") && StringUtils.isNotBlank(map.get("objectId").toString())){
				hql.append(" and ps.objectId = :objectId");
				values.put("objectId", map.get("objectId"));
			}

		}
		hql.append(" order by ps.recordTime desc");
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		// 执行分页查询操作
		Page pg = diaryDao.findPage(page, hql.toString(), values);
		// 转换为Form对象列表并赋值到原分页对象中
		List<DiaryForm> list = DiaryConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	/**
	 * 修改对象（不能修改的字段，上报人，上报时间和所属单位）
	 * */
	@Override
	public void updateForm(DiaryForm f) {
		if(f!=null&&f.getId()!=null){
			f.setWriterId(null);
			f.setWriterName(null);
			f.setRecordTime(null);
			f.setTeamOrgId(null);
			f.setTeamOrgName(null);
			f.setDirectOrgId(null);
			f.setDirectOrgName(null);
			f.setSuperviseOrgId(null);
			f.setSuperviseOrgName(null);
			f.setParentOrgId(null);
			f.setParentOrgName(null);
			this.save(f);
		}
	}
	/****************************************************************************/
	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public DiaryForm get(Long id) {
		Diary entity = diaryDao.get(id);
		return DiaryConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		diaryDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(DiaryForm... forms) {
		if(forms != null)
			for(DiaryForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(DiaryForm form){
		
		if(form != null){
			Diary entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = diaryDao.get(form.getId());
			}else{
				entity = new Diary();
			}
			
			//属性值转换
			DiaryConvertor.convertFormToVo(form, entity);
			
			//保存
			diaryDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<DiaryForm> search(Page<DiaryForm> page, DiaryForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from Diary ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = diaryDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<DiaryForm> list = DiaryConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<DiaryForm> search(Page<DiaryForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<Diary> pg = diaryDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<DiaryForm> list = DiaryConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}


	/**
	 *达标统计
	 * */
	public String statistics1(DiaryForm form,Map<String, Object> map) {
		JSONObject json = new JSONObject();
		List<Map> list = new ArrayList<>();
		Map  valueMap=new HashMap<>();
		//先去查一下巡检频率
		int xjpl=1;
		/*List<SysCodeForm> sysCodeForms= sysCodeService.getItems("PS_XJPL");
		if(sysCodeForms!=null && sysCodeForms.size()>0){
			for(SysCodeForm s:sysCodeForms){
				if(s.getItemMemo().matches("[0-9]+")){//验证一下是否纯数字
					xjpl=Integer.parseInt(s.getItemMemo());
					break;
				}
			}
		}*/
		StringBuffer timeSql1=new StringBuffer();
		StringBuffer timeSql2=new StringBuffer();
		if (map!=null) {
			SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
			if(map.get("startTime")!=null){
				timeSql1.append(" and to_char(mark_time,'yyyyMMdd') >= :startTime ");
				timeSql2.append(" and to_char(record_time,'yyyyMMdd') >= :startTime ");
			}
			if(map.get("endTime")!=null){
				timeSql1.append(" and to_char(mark_time,'yyyyMMdd') <= :endTime");
				timeSql2.append(" and to_char(record_time,'yyyyMMdd') <= :endTime");
			}
		}
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("select ps.parent_org_name 单位,"
				+" sum(case when lx='xj' and "
				+" round(months_between(sysdate, ps.sbsj),0)<="+xjpl+" "//获取两个日期相隔的月份，并且保留0位小数
				+" then 1 else 0 end ) 达标, "
				+" sum(case when lx='sb'then 1 else 0 end ) 总数"
				+" from ( "
				+" select  a.mark_time sbsj, a.parent_org_name,'sb' lx from DRI_PS_LACK_MARK a  "
				+" union all  "
				+" select  b.mark_time sbsj, b.parent_org_name,'sb' lx from "
				+" (select ROW_NUMBER() OVER(PARTITION BY cm.usid ORDER BY cm.mark_time DESC) rn,cm.mark_time,cm.parent_org_name  from "
				+ " DRI_PS_CORRECT_MARK cm where cm.correct_type not like '%设施不存在%' "
				+ " ) b "
				+" where b.rn=1 "
				+" union all  "
				+" select  c.record_time sbsj, c.parent_org_name,'xj' lx from "//去上报时间最大的那一条和当前日期比，是否超时
				+" (select ROW_NUMBER() OVER(PARTITION BY di.object_id ORDER BY di.record_time DESC) rn,di.record_time,di.parent_org_name "
				+ " from dri_diary di where 1=1 "+timeSql2.toString()
				+ ") c "
				+" where c.rn=1"
				+" ) ps where 1=1 ");
		// 查询条件
		if(form != null){
			if(StringUtils.isNotBlank(form.getParentOrgName())){
				hql.append(" and ps.parent_org_name like :parentOrgName");
				valueMap.put("parentOrgName", "%"+form.getParentOrgName()+"%");
			}
		}
		if (map!=null) {//这个时间是针对巡检达标算，总数不限制
			SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
			if(map.get("startTime")!=null){
//				hql.append(" and to_char(ps.sbsj,'yyyyMMdd') >= :startTime ");
				valueMap.put("startTime", df.format((Date)map.get("startTime")));
			}
			if(map.get("endTime")!=null){
//				hql.append(" and to_char(ps.sbsj,'yyyyMMdd') <= :endTime");
				valueMap.put("endTime", df.format((Date)map.get("endTime")));
			}
		}
		hql.append(" group by ps.parent_org_name ");//order by count(*) desc
		hql.append(" order by  case ");
		hql.append(" when ps.parent_org_name like '%天河%' then 1");//%天河% 按特定顺序排序
		hql.append(" when ps.parent_org_name like '%番禺%' then 2");//%番禺%
		hql.append(" when ps.parent_org_name like '%黄埔%' then 3");//%黄埔%
		hql.append(" when ps.parent_org_name like '%白云%' then 4");//%白云%
		hql.append(" when ps.parent_org_name like '%南沙%' then 5");//%南沙%
		hql.append(" when ps.parent_org_name like '%海珠%' then 6");//%海珠%
		hql.append(" when ps.parent_org_name like '%荔湾%' then 7");//%荔湾%
		hql.append(" when ps.parent_org_name like '%花都%' then 8");//%花都%
		hql.append(" when ps.parent_org_name like '%越秀%' then 9");//%越秀%
		hql.append(" when ps.parent_org_name like '%增城%' then 10");//%增城%
		hql.append(" when ps.parent_org_name like '%从化%' then 11");//%从化%
		hql.append(" when ps.parent_org_name like '%净水%' then 12");//%净水有限公司%
		hql.append(" end ");
		//data : ['天河','番禺','黄埔','白云','南沙','海珠', '荔湾','花都','越秀','增城','从化','净水有限公司']
		List<Object[]> resultlist = diaryDao.createSQLQuery(hql.toString(),valueMap).list();
		String[] qy = new String[]{"天河","番禺","黄埔","白云","南沙","海珠", "荔湾","花都","越秀","增城","从化","净水有限公司","市水务局"};
		//封装成对象
		long db=0;
		long allData=0;
		int index=0;
		for(Object[] obj : resultlist){
			if(obj.length==3 && index<=qy.length-1 && obj[0].toString().indexOf(qy[index])<0){
				while(index<=qy.length-1 && obj[0].toString().indexOf(qy[index])<0){
					Map mp = new HashMap<>();
					mp.put("orgName", qy[index]);
					mp.put("db",  0);
					mp.put("allData", 0);
					list.add(mp);
					index++;
				}
			}
			Map mp = new HashMap<>();
			mp.put("orgName", obj[0]);
			mp.put("db",  obj[1]);
			mp.put("allData", obj[2]);
			list.add(mp);
			index++;
			db+=obj[1]==null?0:Long.valueOf(obj[1].toString());
			allData+=obj[2]==null?0:Long.valueOf(obj[2].toString());
		}
		if(index<qy.length){
			while(index<=qy.length-1){
				Map mp = new HashMap<>();
				mp.put("orgName", qy[index]);
				mp.put("db",  0);
				mp.put("allData", 0);
				list.add(mp);
				index++;
			}
		}
		Map mp = new HashMap<>();
		mp.put("orgName", "总计");
		mp.put("db",  db);
		mp.put("allData", allData);
		list.add(mp);
		json.put("rows", list);
		json.put("total", list.size());
		json.put("code", 200);
		return json.toString();
	}
	/**
	 *处理时效统计
	 * */
	public String statistics2(DiaryForm form,Map<String, Object> map) {
		JSONObject json = new JSONObject();
		List<Map> list = new ArrayList<>();
		Map  valueMap=new HashMap<>();
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("select ps.parent_org_name 单位,sum(case " +
				"  when ps.lx='lc' and (ps.END_TIME_ is not null and " +
				"  round(to_date(to_char(ps.END_TIME_, 'yyyy-mm-dd'), 'yyyy-mm-dd')-to_date(to_char(ps.START_TIME_, 'yyyy-mm-dd'), 'yyyy-mm-dd'), \n" +
				"  0) <= (select max(it.item_memo) from (select TY.type_code,item.* from BSC_DIC_CODE_TYPE ty,BSC_DIC_CODE_ITEM item where item.type_id=TY.type_id\n" +
				" ) it where it.type_code='PS_WTSB_WTLX' and instr(ps.bhlx,it.item_code)>0)) " +
				"  or round(to_date(to_char(sysdate, 'yyyy-mm-dd'), 'yyyy-mm-dd')-to_date(to_char(ps.START_TIME_, 'yyyy-mm-dd'), 'yyyy-mm-dd'), \n" +
				"  0) <= (select max(it.item_memo) from (select TY.type_code,item.* from BSC_DIC_CODE_TYPE ty,BSC_DIC_CODE_ITEM item where item.type_id=TY.type_id\n" +
				" ) it where it.type_code='PS_WTSB_WTLX' and instr(ps.bhlx,it.item_code)>0) then " +
				"  1 else 0 end) 未超时, sum(case when ps.lx='lc' and (ps.END_TIME_ is not null and " +
				"  round(to_date(to_char(ps.END_TIME_, 'yyyy-mm-dd'), 'yyyy-mm-dd')-to_date(to_char(ps.START_TIME_, 'yyyy-mm-dd'), 'yyyy-mm-dd'), \n" +
				"  0) > (select max(it.item_memo) from (select TY.type_code,item.* from BSC_DIC_CODE_TYPE ty,BSC_DIC_CODE_ITEM item where item.type_id=TY.type_id\n" +
				" ) it where it.type_code='PS_WTSB_WTLX' and  instr(ps.bhlx,it.item_code)>0)) or " +
				"  round(to_date(to_char(sysdate, 'yyyy-mm-dd'), 'yyyy-mm-dd')-to_date(to_char(ps.START_TIME_, 'yyyy-mm-dd'), 'yyyy-mm-dd'), \n" +
				"  0) > (select max(it.item_memo) from (select TY.type_code,item.* from BSC_DIC_CODE_TYPE ty,BSC_DIC_CODE_ITEM item where item.type_id=TY.type_id\n" +
				" ) it where it.type_code='PS_WTSB_WTLX' and  instr(ps.bhlx,it.item_code)>0) then " +
				"  1 else 0 end) 超时, sum(case when ps.lx='zxcl' then 1 else 0 end ) 自行处理, " +
				" count(*)  from ( SELECT G .parent_org_name," +
				"G .sbsj, G .bhlx, hp.START_TIME_, hp.END_TIME_, 'lc' lx FROM " +
				"ACT_HI_TASKINST hp, act_sto_appinst sto, ACT_HI_PROCINST hip, dri_gx_problem_report G " +
				"WHERE sto.PROC_INST_ID = HIP.ID_ AND HP.PROC_INST_ID_ = HIP.ID_ AND G . ID = sto.MASTER_RECORD_ID " +
				"UNION ALL SELECT gx.parent_org_name, gx.sbsj, gx.bhlx, SYSTIMESTAMP start_, SYSTIMESTAMP end_, " +
				"'zxcl' lx FROM dri_gx_problem_report gx WHERE gx.isbyself = 'true' ) ps where 1=1 ");
		// 查询条件
		if(form != null){
			if(StringUtils.isNotBlank(form.getParentOrgName())){
				hql.append(" and ps.parent_org_name like :parentOrgName");
				valueMap.put("parentOrgName", "%"+form.getParentOrgName()+"%");
			}
		}
		if (map!=null) {
			SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
			if(map.get("startTime")!=null){
				hql.append(" and to_char(ps.sbsj,'yyyyMMdd') >= :startTime ");
				valueMap.put("startTime", df.format((Date)map.get("startTime")));
			}
			if(map.get("endTime")!=null){
				hql.append(" and to_char(ps.sbsj,'yyyyMMdd') <= :endTime");
				valueMap.put("endTime", df.format((Date)map.get("endTime")));
			}
		}
		hql.append(" group by ps.parent_org_name ");//order by count(*) desc
		hql.append(" order by  case ");
		hql.append(" when ps.parent_org_name like '%天河%' then 1");//%天河% 按特定顺序排序
		hql.append(" when ps.parent_org_name like '%番禺%' then 2");//%番禺%
		hql.append(" when ps.parent_org_name like '%黄埔%' then 3");//%黄埔%
		hql.append(" when ps.parent_org_name like '%白云%' then 4");//%白云%
		hql.append(" when ps.parent_org_name like '%南沙%' then 5");//%南沙%
		hql.append(" when ps.parent_org_name like '%海珠%' then 6");//%海珠%
		hql.append(" when ps.parent_org_name like '%荔湾%' then 7");//%荔湾%
		hql.append(" when ps.parent_org_name like '%花都%' then 8");//%花都%
		hql.append(" when ps.parent_org_name like '%越秀%' then 9");//%越秀%
		hql.append(" when ps.parent_org_name like '%增城%' then 10");//%增城%
		hql.append(" when ps.parent_org_name like '%从化%' then 11");//%从化%
		hql.append(" when ps.parent_org_name like '%净水%' then 12");//%净水有限公司%
		hql.append(" end ");
		//data : ['天河','番禺','黄埔','白云','南沙','海珠', '荔湾','花都','越秀','增城','从化','净水有限公司']
		List<Object[]> resultlist = diaryDao.createSQLQuery(hql.toString(),valueMap).list();
		String[] qy = new String[]{"天河","番禺","黄埔","白云","南沙","海珠", "荔湾","花都","越秀","增城","从化","净水有限公司","市水务局"};
		//封装成对象
		long wcs=0;
		long cs=0;
		long zxcl=0;
		long allData=0;
		int index=0;
		for(Object[] obj : resultlist){
			if(index<=qy.length-1 && obj[0].toString().indexOf(qy[index])<0){
				while(index<=qy.length-1 && obj[0].toString().indexOf(qy[index])<0){
					Map mp = new HashMap<>();
					mp.put("orgName", qy[index]);
					mp.put("wcs",  0);
					mp.put("cs",  0);
					mp.put("zxcl",  0);
					mp.put("allData", 0);
					list.add(mp);
					index++;
				}
			}
			Map mp = new HashMap<>();
			mp.put("orgName", obj[0]);
			mp.put("wcs",  obj[1]);
			mp.put("cs",  obj[2]);
			mp.put("zxcl", obj[3]);
			mp.put("allData", obj[4]);
			list.add(mp);
			index++;
			wcs+=obj[1]==null?0:Long.valueOf(obj[1].toString());
			cs+=obj[2]==null?0:Long.valueOf(obj[2].toString());
			zxcl+=obj[3]==null?0:Long.valueOf(obj[3].toString());
			allData+=obj[4]==null?0:Long.valueOf(obj[4].toString());
		}
		if(index<qy.length){
			while(index<=qy.length-1){
				Map mp = new HashMap<>();
				mp.put("orgName", qy[index]);
				mp.put("wcs",  0);
				mp.put("cs",  0);
				mp.put("zxcl",  0);
				mp.put("allData", 0);
				list.add(mp);
				index++;
			}
		}
		Map mp = new HashMap<>();
		mp.put("orgName", "总计");
		mp.put("wcs",  wcs);
		mp.put("cs",  cs);
		mp.put("zxcl",  zxcl);
		mp.put("allData", allData);
		list.add(mp);
		json.put("rows", list);
		json.put("total", list.size());
		json.put("code", 200);
		return json.toString();
	}
	/**
	 *处理时效统计 按单位
	 * */
	public String statistics22(DiaryForm form,Map<String, Object> map) {
		JSONObject json = new JSONObject();
		List<Map> list = new ArrayList<>();
		Map  valueMap=new HashMap<>();
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("select ps.direct_org_name 单位,sum(case " +
				"  when ps.lx='lc' and (ps.END_TIME_ is not null and " +
				"  round(to_date(to_char(ps.END_TIME_, 'yyyy-mm-dd'), 'yyyy-mm-dd')-to_date(to_char(ps.START_TIME_, 'yyyy-mm-dd'), 'yyyy-mm-dd'), \n" +
				"  0) <= (select max(it.item_memo) from (select TY.type_code,item.* from BSC_DIC_CODE_TYPE ty,BSC_DIC_CODE_ITEM item where item.type_id=TY.type_id\n" +
				" ) it where it.type_code='PS_WTSB_WTLX' and instr(ps.bhlx,it.item_code)>0)) " +
				"  or round(to_date(to_char(sysdate, 'yyyy-mm-dd'), 'yyyy-mm-dd')-to_date(to_char(ps.START_TIME_, 'yyyy-mm-dd'), 'yyyy-mm-dd'), \n" +
				"  0) <= (select max(it.item_memo) from (select TY.type_code,item.* from BSC_DIC_CODE_TYPE ty,BSC_DIC_CODE_ITEM item where item.type_id=TY.type_id\n" +
				" ) it where it.type_code='PS_WTSB_WTLX' and instr(ps.bhlx,it.item_code)>0) then " +
				"  1 else 0 end) 未超时, sum(case when ps.lx='lc' and (ps.END_TIME_ is not null and " +
				"  round(to_date(to_char(ps.END_TIME_, 'yyyy-mm-dd'), 'yyyy-mm-dd')-to_date(to_char(ps.START_TIME_, 'yyyy-mm-dd'), 'yyyy-mm-dd'), \n" +
				"  0) > (select max(it.item_memo) from (select TY.type_code,item.* from BSC_DIC_CODE_TYPE ty,BSC_DIC_CODE_ITEM item where item.type_id=TY.type_id\n" +
				" ) it where it.type_code='PS_WTSB_WTLX' and  instr(ps.bhlx,it.item_code)>0)) or " +
				"  round(to_date(to_char(sysdate, 'yyyy-mm-dd'), 'yyyy-mm-dd')-to_date(to_char(ps.START_TIME_, 'yyyy-mm-dd'), 'yyyy-mm-dd'), \n" +
				"  0) > (select max(it.item_memo) from (select TY.type_code,item.* from BSC_DIC_CODE_TYPE ty,BSC_DIC_CODE_ITEM item where item.type_id=TY.type_id\n" +
				" ) it where it.type_code='PS_WTSB_WTLX' and  instr(ps.bhlx,it.item_code)>0) then " +
				"  1 else 0 end) 超时, sum(case when ps.lx='zxcl' then 1 else 0 end ) 自行处理, " +
				" count(*)  from ( SELECT g.supervise_org_name, g.DIRECT_ORG_NAME,G .parent_org_name," +
				" G .sbsj, G .bhlx, hp.START_TIME_, hp.END_TIME_, 'lc' lx FROM " +
				" ACT_HI_TASKINST hp, act_sto_appinst sto, ACT_HI_PROCINST hip, dri_gx_problem_report G " +
				" WHERE sto.PROC_INST_ID = HIP.ID_ AND HP.PROC_INST_ID_ = HIP.ID_ AND G . ID = sto.MASTER_RECORD_ID " +
				" UNION ALL SELECT gx.supervise_org_name, gx.direct_org_name,gx.parent_org_name, gx.sbsj, gx.bhlx, SYSTIMESTAMP start_, SYSTIMESTAMP end_, " +
				"'zxcl' lx FROM dri_gx_problem_report gx WHERE gx.isbyself = 'true' ) ps where 1=1 ");
		// 查询条件
		if(form != null){
			if(StringUtils.isNotBlank(form.getParentOrgName())){
				hql.append(" and ps.parent_org_name like :parentOrgName");
				valueMap.put("parentOrgName", "%"+form.getParentOrgName()+"%");
			}
		}
		if (map!=null) {
			SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
			if(map.get("startTime")!=null){
				hql.append(" and to_char(ps.sbsj,'yyyyMMdd') >= :startTime ");
				valueMap.put("startTime", df.format((Date)map.get("startTime")));
			}
			if(map.get("endTime")!=null){
				hql.append(" and to_char(ps.sbsj,'yyyyMMdd') <= :endTime");
				valueMap.put("endTime", df.format((Date)map.get("endTime")));
			}
		}
		hql.append(" group by ps.supervise_org_name,ps.direct_org_name ");//order by count(*) desc
		List<Object[]> resultlist = diaryDao.createSQLQuery(hql.toString(),valueMap).list();
		//封装成对象
		long wcs=0;
		long cs=0;
		long zxcl=0;
		long allData=0;
		int index=0;
		for(Object[] obj : resultlist){
			Map mp = new HashMap<>();
			mp.put("orgName", form.getParentOrgName());
			mp.put("dwName", obj[0]);
			mp.put("wcs",  obj[1]);
			mp.put("cs",  obj[2]);
			mp.put("zxcl", obj[3]);
			mp.put("allData", obj[4]);
			mp.put("yzdwName", obj[5]);
			list.add(mp);
			index++;
			wcs+=obj[1]==null?0:Long.valueOf(obj[1].toString());
			cs+=obj[2]==null?0:Long.valueOf(obj[2].toString());
			zxcl+=obj[3]==null?0:Long.valueOf(obj[3].toString());
			allData+=obj[4]==null?0:Long.valueOf(obj[4].toString());
		}
		Map mp = new HashMap<>();
		mp.put("orgName", "总计");
		mp.put("wcs",  wcs);
		mp.put("cs",  cs);
		mp.put("zxcl",  zxcl);
		mp.put("allData", allData);
		list.add(mp);
		json.put("rows", list);
		json.put("total", list.size());
		json.put("code", 200);
		return json.toString();
	}
	/**
	 *环节统计
	 * */
	public String statistics3(DiaryForm form,Map<String, Object> map) {
		JSONObject json = new JSONObject();
		List<Map> list = new ArrayList<>();
		Map  valueMap=new HashMap<>();
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("select ps.parent_org_name 单位, " +
				" sum(case when ps.activity_name_ ='problemReport' then 1 else 0 end ) 问题上报," +
				" sum(case when ps.activity_name_ ='sendTask' then 1 else 0 end ) 任务派单," +
				" sum(case when ps.activity_name_ ='getTask' then 1 else 0 end ) 任务处置," +
				" sum(case when ps.activity_name_ ='xcyfh' then 1 else 0 end ) 巡查员复核," +
				" sum(case when ps.activity_name_ ='rwfh' then 1 else 0 end ) 任务复核," +
				" sum(case when ps.activity_name_ ='fh' then 1 else 0 end ) 复核 ," +
				" sum(case when ps.activity_name_ ='zxcl' then 1 else 0 end ) 自行处理 ," +
				" count(*)  from  ( SELECT G .parent_org_name, G .sbsj, task.NAME_ as activity_name_" +
				" FROM ACT_RU_TASK task, act_sto_appinst sto, ACT_HI_PROCINST hip, dri_gx_problem_report G " +
				" WHERE sto.PROC_INST_ID = HIP.ID_ AND task.PROC_INST_ID_ = HIP.ID_ AND G . ID = sto.MASTER_RECORD_ID " +
				" UNION ALL SELECT gx.parent_org_name, gx.sbsj, cast('zxcl' as nvarchar2(100)) activity_name_ " +
				" FROM dri_gx_problem_report gx WHERE gx.isbyself = 'true') ps where 1=1" );
		// 查询条件
		if(form != null){
			if(StringUtils.isNotBlank(form.getParentOrgName())){
				hql.append(" and ps.parent_org_name like :parentOrgName");
				valueMap.put("parentOrgName", "%"+form.getParentOrgName()+"%");
			}
		}
		if (map!=null) {
			SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
			if(map.get("startTime")!=null){
				hql.append(" and to_char(ps.sbsj,'yyyyMMdd') >= :startTime ");
				valueMap.put("startTime", df.format((Date)map.get("startTime")));
			}
			if(map.get("endTime")!=null){
				hql.append(" and to_char(ps.sbsj,'yyyyMMdd') <= :endTime");
				valueMap.put("endTime", df.format((Date)map.get("endTime")));
			}
		}
		hql.append(" group by ps.parent_org_name ");//order by count(*) desc
		hql.append(" order by  case ");
		hql.append(" when ps.parent_org_name like '%天河%' then 1");//%天河% 按特定顺序排序
		hql.append(" when ps.parent_org_name like '%番禺%' then 2");//%番禺%
		hql.append(" when ps.parent_org_name like '%黄埔%' then 3");//%黄埔%
		hql.append(" when ps.parent_org_name like '%白云%' then 4");//%白云%
		hql.append(" when ps.parent_org_name like '%南沙%' then 5");//%南沙%
		hql.append(" when ps.parent_org_name like '%海珠%' then 6");//%海珠%
		hql.append(" when ps.parent_org_name like '%荔湾%' then 7");//%荔湾%
		hql.append(" when ps.parent_org_name like '%花都%' then 8");//%花都%
		hql.append(" when ps.parent_org_name like '%越秀%' then 9");//%越秀%
		hql.append(" when ps.parent_org_name like '%增城%' then 10");//%增城%
		hql.append(" when ps.parent_org_name like '%从化%' then 11");//%从化%
		hql.append(" when ps.parent_org_name like '%净水%' then 12");//%净水有限公司%
		hql.append(" end ");
		//data : ['天河','番禺','黄埔','白云','南沙','海珠', '荔湾','花都','越秀','增城','从化','净水有限公司']
		List<Object[]> resultlist = diaryDao.createSQLQuery(hql.toString(),valueMap).list();
		String[] qy = new String[]{"天河","番禺","黄埔","白云","南沙","海珠", "荔湾","花都","越秀","增城","从化","净水有限公司","市水务局"};
		//封装成对象
		long tj1=0;
		long tj2=0;
		long tj3=0;
		long tj4=0;
		long tj5=0;
		long tj6=0;
		long tj7=0;
		long allData=0;
		int index=0;
		for(Object[] obj : resultlist){
			if(index<=qy.length-1 && obj[0].toString().indexOf(qy[index])<0){
				while(index<=qy.length-1 && obj[0].toString().indexOf(qy[index])<0){
					Map mp = new HashMap<>();
					mp.put("orgName", qy[index]);
					mp.put("problemReport", 0);//问题上报
					mp.put("sendTask", 0);// 任务派单,"
					mp.put("getTask", 0);//任务处置,"
					mp.put("xcyfh", 0);//巡查员复核,"
					mp.put("rwfh", 0);//任务复核,"
					mp.put("fh", 0);//复核 ,
					mp.put("zxcl", 0);//自行处理
					mp.put("allData", 0);
					list.add(mp);
					index++;
				}
			}
			Map mp = new HashMap<>();
			mp.put("orgName", obj[0]);
			mp.put("problemReport", obj[1]);//问题上报
			mp.put("sendTask", obj[2]);// 任务派单,"
			mp.put("getTask", obj[3]);//任务处置,"
			mp.put("xcyfh", obj[4]);//巡查员复核,"
			mp.put("rwfh", obj[5]);//任务复核,"
			mp.put("fh", obj[6]);//复核 ,"
			mp.put("zxcl", obj[7]);//自行处理
			mp.put("allData", obj[8]);
			list.add(mp);
			index++;
			tj1+=obj[1]==null?0:Long.valueOf(obj[1].toString());
			tj2+=obj[2]==null?0:Long.valueOf(obj[2].toString());
			tj3+=obj[3]==null?0:Long.valueOf(obj[3].toString());
			tj4+=obj[4]==null?0:Long.valueOf(obj[4].toString());
			tj5+=obj[5]==null?0:Long.valueOf(obj[5].toString());
			tj6+=obj[6]==null?0:Long.valueOf(obj[6].toString());
			tj7+=obj[7]==null?0:Long.valueOf(obj[7].toString());
			allData+=obj[8]==null?0:Long.valueOf(obj[8].toString());
		}
		if(index<qy.length){
			while(index<=qy.length-1){
				Map mp = new HashMap<>();
				mp.put("orgName", qy[index]);
				mp.put("problemReport", 0);//问题上报
				mp.put("sendTask", 0);// 任务派单,"
				mp.put("getTask", 0);//任务处置,"
				mp.put("xcyfh", 0);//巡查员复核,"
				mp.put("rwfh", 0);//任务复核,"
				mp.put("fh", 0);//复核 ,"
				mp.put("zxcl", 0);//自行处理
				mp.put("allData", 0);
				list.add(mp);
				index++;
			}
		}
		Map mp = new HashMap<>();
		mp.put("orgName", "总计");
		mp.put("problemReport", tj1);//问题上报
		mp.put("sendTask", tj2);// 任务派单,"
		mp.put("getTask", tj3);//任务处置,"
		mp.put("xcyfh", tj4);//巡查员复核,"
		mp.put("rwfh", tj5);//任务复核,"
		mp.put("fh", tj6);//复核 ,"
		mp.put("zxcl", tj7);//自行处理
		mp.put("allData", allData);
		list.add(mp);
		json.put("rows", list);
		json.put("total", list.size());
		json.put("code", 200);
		return json.toString();
	}
	/**
	 *环节统计 按单位
	 * */
	public String statistics33(DiaryForm form,Map<String, Object> map) {
		JSONObject json = new JSONObject();
		List<Map> list = new ArrayList<>();
		Map  valueMap=new HashMap<>();
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("select ps.direct_org_name 单位, " +
				" sum(case when ps.activity_name_ ='problemReport' then 1 else 0 end ) 问题上报," +
				" sum(case when ps.activity_name_ ='sendTask' then 1 else 0 end ) 任务派单," +
				" sum(case when ps.activity_name_ ='getTask' then 1 else 0 end ) 任务处置," +
				" sum(case when ps.activity_name_ ='xcyfh' then 1 else 0 end ) 巡查员复核," +
				" sum(case when ps.activity_name_ ='rwfh' then 1 else 0 end ) 任务复核," +
				" sum(case when ps.activity_name_ ='fh' then 1 else 0 end ) 复核 ," +
				" sum(case when ps.activity_name_ ='zxcl' then 1 else 0 end ) 自行处理 ," +
				" count(*),ps.supervise_org_name from (SELECT G .supervise_org_name, G .direct_org_name," +
				" G .parent_org_name, G .sbsj, task.name_ as activity_name_ FROM ACT_RU_TASK task," +
				" act_sto_appinst sto, ACT_HI_PROCINST hip, dri_gx_problem_report G WHERE" +
				" sto.PROC_INST_ID = HIP.ID_ AND task.PROC_INST_ID_ = HIP.ID_ AND G . ID = sto.MASTER_RECORD_ID" +
				" UNION ALL SELECT gx.supervise_org_name, gx.direct_org_name, gx.parent_org_name," +
				" gx.sbsj, cast('zxcl' as nvarchar2(100)) activity_name_" +
				" FROM dri_gx_problem_report gx WHERE gx.isbyself = 'true') ps where 1=1 " );
		// 查询条件
		if(form != null){
			if(StringUtils.isNotBlank(form.getParentOrgName())){
				hql.append(" and ps.parent_org_name like :parentOrgName");
				valueMap.put("parentOrgName", "%"+form.getParentOrgName()+"%");
			}
		}
		if (map!=null) {
			SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
			if(map.get("startTime")!=null){
				hql.append(" and to_char(ps.sbsj,'yyyyMMdd') >= :startTime ");
				valueMap.put("startTime", df.format((Date)map.get("startTime")));
			}
			if(map.get("endTime")!=null){
				hql.append(" and to_char(ps.sbsj,'yyyyMMdd') <= :endTime");
				valueMap.put("endTime", df.format((Date)map.get("endTime")));
			}
		}
		hql.append(" group by ps.supervise_org_name,ps.direct_org_name ");//order by count(*) desc
		List<Object[]> resultlist = diaryDao.createSQLQuery(hql.toString(),valueMap).list();
		//封装成对象
		long tj1=0;
		long tj2=0;
		long tj3=0;
		long tj4=0;
		long tj5=0;
		long tj6=0;
		long tj7=0;
		long allData=0;
		int index=0;
		for(Object[] obj : resultlist){
			Map mp = new HashMap<>();
			mp.put("orgName", form.getParentOrgName());
			mp.put("dwName", obj[0]);
			mp.put("problemReport", obj[1]);//问题上报
			mp.put("sendTask", obj[2]);// 任务派单,"
			mp.put("getTask", obj[3]);//任务处置,"
			mp.put("xcyfh", obj[4]);//巡查员复核,"
			mp.put("rwfh", obj[5]);//任务复核,"
			mp.put("fh", obj[6]);//复核 ,"
			mp.put("zxcl", obj[7]);//自行处理
			mp.put("allData", obj[8]);
			mp.put("yzdwName", obj[9]);
			list.add(mp);
			index++;
			tj1+=obj[1]==null?0:Long.valueOf(obj[1].toString());
			tj2+=obj[2]==null?0:Long.valueOf(obj[2].toString());
			tj3+=obj[3]==null?0:Long.valueOf(obj[3].toString());
			tj4+=obj[4]==null?0:Long.valueOf(obj[4].toString());
			tj5+=obj[5]==null?0:Long.valueOf(obj[5].toString());
			tj6+=obj[6]==null?0:Long.valueOf(obj[6].toString());
			tj7+=obj[7]==null?0:Long.valueOf(obj[7].toString());
			allData+=obj[8]==null?0:Long.valueOf(obj[8].toString());
		}
		Map mp = new HashMap<>();
		mp.put("orgName", "总计");
		mp.put("problemReport", tj1);//问题上报
		mp.put("sendTask", tj2);// 任务派单,"
		mp.put("getTask", tj3);//任务处置,"
		mp.put("xcyfh", tj4);//巡查员复核,"
		mp.put("rwfh", tj5);//任务复核,"
		mp.put("fh", tj6);//复核 ,"
		mp.put("zxcl", tj7);//自行处理
		mp.put("allData", allData);
		list.add(mp);
		json.put("rows", list);
		json.put("total", list.size());
		json.put("code", 200);
		return json.toString();
	}
	/**
	 *按井类型统计问题数量
	 * */
	public String statistics4(DiaryForm form,Map<String, Object> map) {
		JSONObject json = new JSONObject();
		List<Map> list = new ArrayList<>();
		Map  valueMap=new HashMap<>();
		StringBuffer hql = new StringBuffer("select ps.parent_org_name , "
				+ "SUM(case when ps.sslx='A174001' then 1 else 0 end) 窨井, "
				+ "SUM(case when ps.sslx='A174002' then 1 else 0 end) 雨水口, "
				+ "SUM(case when ps.sslx='A174003' then 1 else 0 end) 排放口, "
				+ "SUM(case when ps.sslx='A174005' then 1 else 0 end) 排水管道, "
				+ "SUM(case when ps.sslx='A174006' then 1 else 0 end) 排水沟渠, "
				+ "SUM(case when ps.sslx='A174007' then 1 else 0 end) 其他, "
				+ "count(*) "
				+ "from dri_Gx_Problem_Report ps  where 1=1");
		// 查询条件
		if(form != null){
			if(StringUtils.isNotBlank(form.getParentOrgName())){
				hql.append(" and ps.parent_org_name like :parentOrgName");
				valueMap.put("parentOrgName", "%"+form.getParentOrgName()+"%");
			}
		}
		if (map!=null) {
			SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
			if(map.get("startTime")!=null){
				hql.append(" and to_char(ps.sbsj,'yyyyMMdd') >= :startTime ");
				valueMap.put("startTime", df.format((Date)map.get("startTime")));
			}
			if(map.get("endTime")!=null){
				hql.append(" and to_char(ps.sbsj,'yyyyMMdd') <= :endTime");
				valueMap.put("endTime", df.format((Date)map.get("endTime")));
			}
		}
		hql.append(" group by ps.parent_org_name ");//order by count(*) desc
		hql.append(" order by  case ");
		hql.append(" when ps.parent_org_name like '%天河%' then 1");//%天河% 按特定顺序排序
		hql.append(" when ps.parent_org_name like '%番禺%' then 2");//%番禺%
		hql.append(" when ps.parent_org_name like '%黄埔%' then 3");//%黄埔%
		hql.append(" when ps.parent_org_name like '%白云%' then 4");//%白云%
		hql.append(" when ps.parent_org_name like '%南沙%' then 5");//%南沙%
		hql.append(" when ps.parent_org_name like '%海珠%' then 6");//%海珠%
		hql.append(" when ps.parent_org_name like '%荔湾%' then 7");//%荔湾%
		hql.append(" when ps.parent_org_name like '%花都%' then 8");//%花都%
		hql.append(" when ps.parent_org_name like '%越秀%' then 9");//%越秀%
		hql.append(" when ps.parent_org_name like '%增城%' then 10");//%增城%
		hql.append(" when ps.parent_org_name like '%从化%' then 11");//%从化%
		hql.append(" when ps.parent_org_name like '%净水%' then 12");//%净水有限公司%
		hql.append(" end ");
		//data : ['天河','番禺','黄埔','白云','南沙','海珠', '荔湾','花都','越秀','增城','从化','净水有限公司']
		List<Object[]> resultlist = diaryDao.createSQLQuery(hql.toString(),valueMap).list();
		String[] qy = new String[]{"天河","番禺","黄埔","白云","南沙","海珠", "荔湾","花都","越秀","增城","从化","净水有限公司","市水务局"};
		//封装成对象
		long tj1=0;
		long tj2=0;
		long tj3=0;
		long tj5=0;
		long tj6=0;
		long tj7=0;
		long allData=0;
		int index=0;
		for(Object[] obj : resultlist){
			if(index<=qy.length-1 && obj[0].toString().indexOf(qy[index])<0){
				while(index<=qy.length-1 && obj[0].toString().indexOf(qy[index])<0){
					Map mp = new HashMap<>();
					mp.put("orgName", qy[index]);
					mp.put("A174001", 0);//窨井
					mp.put("A174002", 0);//雨水口
					mp.put("A174003", 0);//排放口
					mp.put("A174005", 0);//排水管道
					mp.put("A174006", 0);//排水沟渠
					mp.put("A174007", 0);//其他
					mp.put("allData", 0);
					list.add(mp);
					index++;
				}
			}
			Map mp = new HashMap<>();
			mp.put("orgName", obj[0]);
			mp.put("A174001", obj[1]);//窨井
			mp.put("A174002", obj[2]);//雨水口
			mp.put("A174003", obj[3]);//排放口
			mp.put("A174005", obj[4]);//排水管道
			mp.put("A174006", obj[5]);//排水沟渠
			mp.put("A174007", obj[6]);//其他
			mp.put("allData", obj[7]);
			list.add(mp);
			index++;
			tj1+=obj[1]==null?0:Long.valueOf(obj[1].toString());
			tj2+=obj[2]==null?0:Long.valueOf(obj[2].toString());
			tj3+=obj[3]==null?0:Long.valueOf(obj[3].toString());
			tj5+=obj[4]==null?0:Long.valueOf(obj[4].toString());
			tj6+=obj[5]==null?0:Long.valueOf(obj[5].toString());
			tj7+=obj[6]==null?0:Long.valueOf(obj[6].toString());
			allData+=obj[7]==null?0:Long.valueOf(obj[7].toString());
		}
		if(index<qy.length){
			while(index<=qy.length-1){
				Map mp = new HashMap<>();
				mp.put("orgName", qy[index]);
				mp.put("A174001", 0);//窨井
				mp.put("A174002", 0);//雨水口
				mp.put("A174003", 0);//排放口
				mp.put("A174005", 0);//排水管道
				mp.put("A174006", 0);//排水沟渠
				mp.put("A174007", 0);//其他
				mp.put("allData", 0);
				list.add(mp);
				index++;
			}
		}
		Map mp = new HashMap<>();
		mp.put("orgName", "总计");
		mp.put("A174001", tj1);//窨井
		mp.put("A174002", tj2);//雨水口
		mp.put("A174003", tj3);//排放口
		mp.put("A174005", tj5);//排水管道
		mp.put("A174006", tj6);//排水沟渠
		mp.put("A174007", tj7);//其他
		mp.put("allData", allData);
		list.add(mp);
		json.put("rows", list);
		json.put("total", list.size());
		json.put("code", 200);
		return json.toString();
	}

	/**
	 *按井类型统计问题数量 按单位
	 * */
	public String statistics44(DiaryForm form,Map<String, Object> map) {
		JSONObject json = new JSONObject();
		List<Map> list = new ArrayList<>();
		Map  valueMap=new HashMap<>();
		StringBuffer hql = new StringBuffer("select ps.direct_org_name , "
				+ "SUM(case when ps.sslx='A174001' then 1 else 0 end) 窨井, "
				+ "SUM(case when ps.sslx='A174002' then 1 else 0 end) 雨水口, "
				+ "SUM(case when ps.sslx='A174003' then 1 else 0 end) 排放口, "
				+ "SUM(case when ps.sslx='A174005' then 1 else 0 end) 排水管道, "
				+ "SUM(case when ps.sslx='A174006' then 1 else 0 end) 排水沟渠, "
				+ "SUM(case when ps.sslx='A174007' then 1 else 0 end) 其他, "
				+ "count(*),ps.supervise_org_name "
				+ "from dri_Gx_Problem_Report ps  where 1=1");
		// 查询条件
		if(form != null){
			if(StringUtils.isNotBlank(form.getParentOrgName())){
				hql.append(" and ps.parent_org_name like :parentOrgName");
				valueMap.put("parentOrgName", "%"+form.getParentOrgName()+"%");
			}
		}
		if (map!=null) {
			SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
			if(map.get("startTime")!=null){
				hql.append(" and to_char(ps.sbsj,'yyyyMMdd') >= :startTime ");
				valueMap.put("startTime", df.format((Date)map.get("startTime")));
			}
			if(map.get("endTime")!=null){
				hql.append(" and to_char(ps.sbsj,'yyyyMMdd') <= :endTime");
				valueMap.put("endTime", df.format((Date)map.get("endTime")));
			}
		}
		hql.append(" group by ps.supervise_org_name,ps.direct_org_name ");//order by count(*) desc
		List<Object[]> resultlist = diaryDao.createSQLQuery(hql.toString(),valueMap).list();
		//封装成对象
		long tj1=0;
		long tj2=0;
		long tj3=0;
		long tj5=0;
		long tj6=0;
		long tj7=0;
		long allData=0;
		int index=0;
		for(Object[] obj : resultlist){
			Map mp = new HashMap<>();
			mp.put("orgName", form.getParentOrgName());
			mp.put("dwName", obj[0]);
			mp.put("A174001", obj[1]);//窨井
			mp.put("A174002", obj[2]);//雨水口
			mp.put("A174003", obj[3]);//排放口
			mp.put("A174005", obj[4]);//排水管道
			mp.put("A174006", obj[5]);//排水沟渠
			mp.put("A174007", obj[6]);//其他
			mp.put("allData", obj[7]);
			mp.put("yzdwName", obj[8]);
			list.add(mp);
			index++;
			tj1+=obj[1]==null?0:Long.valueOf(obj[1].toString());
			tj2+=obj[2]==null?0:Long.valueOf(obj[2].toString());
			tj3+=obj[3]==null?0:Long.valueOf(obj[3].toString());
			tj5+=obj[4]==null?0:Long.valueOf(obj[4].toString());
			tj6+=obj[5]==null?0:Long.valueOf(obj[5].toString());
			tj7+=obj[6]==null?0:Long.valueOf(obj[6].toString());
			allData+=obj[7]==null?0:Long.valueOf(obj[7].toString());
		}
		Map mp = new HashMap<>();
		mp.put("orgName", "总计");
		mp.put("A174001", tj1);//窨井
		mp.put("A174002", tj2);//雨水口
		mp.put("A174003", tj3);//排放口
		mp.put("A174005", tj5);//排水管道
		mp.put("A174006", tj6);//排水沟渠
		mp.put("A174007", tj7);//其他
		mp.put("allData", allData);
		list.add(mp);
		json.put("rows", list);
		json.put("total", list.size());
		json.put("code", 200);
		return json.toString();
	}
	// 获取巡检日志的巡检次数
	public Long getDiaryCount(String objectId){
		String sql = "select round(months_between(sysdate, ps.sbsj),0) total,objectid " +
				" from ( select row_number() over(partition by objectid order by sbsj desc) rn,sbsj,objectid " +
				" from ( select a.record_time sbsj,to_number(a.object_id) objectid from  dri_diary a )) ps where 1=1 " +
				" and ps.objectid = ?";
		List<Map<String,Object>> list =  diaryDao.createSQLQuery(sql,new Object[]{objectId})
				.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP).list();
		if(list!=null && list.size()>0){
			BigDecimal total = (BigDecimal) list.get(0).get("TOTAL");
			return total.longValue();
		}
		return null;
	}
}