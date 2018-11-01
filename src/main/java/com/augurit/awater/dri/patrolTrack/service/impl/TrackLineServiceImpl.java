package com.augurit.awater.dri.patrolTrack.service.impl;

import com.augurit.agcloud.framework.security.user.OpuOmUser;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.patrolTrack.convert.TrackLineConvertor;
import com.augurit.awater.dri.patrolTrack.dao.TrackLineDao;
import com.augurit.awater.dri.patrolTrack.entity.TrackLine;
import com.augurit.awater.dri.patrolTrack.service.ITrackLineService;
import com.augurit.awater.dri.patrolTrack.service.ITrackPointService;
import com.augurit.awater.dri.patrolTrack.web.form.TrackLineForm;
import com.augurit.awater.util.PropertyFilter;
import com.augurit.awater.util.page.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import net.sf.json.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
@Transactional
public class TrackLineServiceImpl implements ITrackLineService {

	@Autowired
	private TrackLineDao trackLineDao;
	@Autowired
	private ITrackPointService trackPointService;
	
	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public TrackLineForm get(Long id) {
		TrackLine entity = trackLineDao.get(id);
		return TrackLineConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		trackLineDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(TrackLineForm... forms) {
		if(forms != null)
			for(TrackLineForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(TrackLineForm form){
		
		if(form != null){
			TrackLine entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = trackLineDao.get(form.getId());
			}else{
				entity = new TrackLine();
			}
			
			//属性值转换
			TrackLineConvertor.convertFormToVo(form, entity);
			
			//保存
			trackLineDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<TrackLineForm> search(Page<TrackLineForm> page, TrackLineForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from TrackLine ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = trackLineDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<TrackLineForm> list = TrackLineConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<TrackLineForm> search(Page<TrackLineForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<TrackLine> pg = trackLineDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<TrackLineForm> list = TrackLineConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	@Transactional(readOnly = true)
	@Override
	/**
	 * 巡检轨迹分页查询
	 * @param userForm
	 * @param page
	 * @param form
	 * @param map
	 * @return
	 */
	public String getPageList(OpuOmUser userForm, Page<TrackLineForm> page, TrackLineForm form,
							  Map<String, Object> map) {
		JSONObject json = new JSONObject();
		Long total = 0l;
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from TrackLine ps where 1=1  and ps.state='1' ");
		Map<String,Object> values = new HashMap<String,Object>();

		// 查询条件
		if(form != null){
			if(StringUtils.isNotBlank(form.getParentOrgId())){
				hql.append(" and ps.parentOrgId = :parentOrgId");
				values.put("parentOrgId", form.getParentOrgId());
			}
			if(StringUtils.isNotBlank(form.getMarkPerson())){
				hql.append(" and ps.markPerson  like :markPerson");
				values.put("markPerson", "%"+form.getMarkPerson()+"%");
			}
		}
		if(map!=null){
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
			if(map.get("startTime")!=null){
				hql.append(" and to_char(ps.markTime,'yyyy-MM-dd') >= :startTime ");
				values.put("startTime", df.format((Date)map.get("startTime")));
			}
			if(map.get("endTime")!=null){
				hql.append(" and to_char(ps.markTime,'yyyy-MM-dd') <= :endTime");
				values.put("endTime", df.format((Date)map.get("endTime")));
			}
		}

		//排序
		hql.append(" Order by ps.markTime desc");
		//hql.append(HqlUtils.buildOrderBy(page, "ps"));

		// 执行分页查询操作
		Page pg = trackLineDao.findPage(page, hql.toString(), values);

		// 转换为Form对象列表并赋值到原分页对象中
		List<TrackLineForm> list = TrackLineConvertor.convertVoListToFormList(pg.getResult());
		List<TrackLineForm> rows = new ArrayList<TrackLineForm>();
		PageUtils.copy(pg, list, page);
		if(page.getResult()!=null){
			rows=page.getResult();
			total=page.getTotalItems();
		}
		if(rows!=null && rows.size()>0){
			//未正常结束的巡检轨迹要去获取长度
			for(TrackLineForm trackLineForm : rows){
				if("0".equals(trackLineForm.getState())){
					trackLineForm.setRecordLength(String.valueOf(trackPointService.getLengthByTrackId(trackLineForm.getId().toString())));
				}
			}
		}
		json.put("rows", rows);
		json.put("total", total);
		json.put("code", 200);
		return json.toString();
	}
	/**
	 * 巡检路径分页查询（APP）
	 * @param page
	 * @param form
	 * @param map
	 * @return
	 */
	@Transactional(readOnly = true)
	@Override
	public Page<TrackLineForm> getPageListForApp(Page<TrackLineForm> page, TrackLineForm form,
												 Map<String, Object> map) {
		JSONObject json = new JSONObject();
		Long total = 0l;
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from TrackLine ps where 1=1  and ps.state='1'");
		Map<String,Object> values = new HashMap<String,Object>();

		// 查询条件
		if(form != null){
			if(StringUtils.isNotBlank(form.getParentOrgId())){
				hql.append(" and ps.parentOrgId = :parentOrgId");
				values.put("parentOrgId", form.getParentOrgId());
			}
			if(StringUtils.isNotBlank(form.getMarkPerson())){
				hql.append(" and ps.markPerson  like :markPerson");
				values.put("markPerson", "%"+form.getMarkPerson()+"%");
			}
			if(StringUtils.isNotBlank(form.getMarkPersonId())){
				hql.append(" and ps.markPersonId  = :markPersonId");
				values.put("markPersonId", form.getMarkPersonId());
			}
		}
		if(map!=null){
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
			if(map.get("startTime")!=null){
				hql.append(" and to_char(ps.markTime,'yyyy-MM-dd') >= :startTime ");
				values.put("startTime", df.format((Date)map.get("startTime")));
			}
			if(map.get("endTime")!=null){
				hql.append(" and to_char(ps.markTime,'yyyy-MM-dd') <= :endTime");
				values.put("endTime", df.format((Date)map.get("endTime")));
			}
		}

		//排序
		hql.append(" Order by ps.markTime desc");
		//hql.append(HqlUtils.buildOrderBy(page, "ps"));

		// 执行分页查询操作
		Page pg = trackLineDao.findPage(page, hql.toString(), values);

		// 转换为Form对象列表并赋值到原分页对象中
		List<TrackLineForm> list = TrackLineConvertor.convertVoListToFormList(pg.getResult());
		List<TrackLineForm> rows = new ArrayList<TrackLineForm>();
		PageUtils.copy(pg, list, page);
		if(page.getResult()!=null){
			rows=page.getResult();
			total=page.getTotalItems();
		}
		if(rows!=null && rows.size()>0){
			//未正常结束的巡检轨迹要去获取长度
			for(TrackLineForm trackLineForm : rows){
				if("0".equals(trackLineForm.getState())){
					trackLineForm.setRecordLength(String.valueOf(trackPointService.getLengthByTrackId(trackLineForm.getId().toString())));
				}
			}
		}
		page.setResult(rows);
		return page;
	}
}