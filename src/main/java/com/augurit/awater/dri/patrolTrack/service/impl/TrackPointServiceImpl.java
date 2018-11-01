package com.augurit.awater.dri.patrolTrack.service.impl;

import com.augurit.awater.dri.patrolTrack.convert.TrackPointConvertor;
import com.augurit.awater.dri.patrolTrack.dao.TrackPointDao;
import com.augurit.awater.dri.patrolTrack.entity.TrackPoint;
import com.augurit.awater.dri.patrolTrack.service.ITrackPointService;
import com.augurit.awater.dri.patrolTrack.web.form.TrackPointForm;
import com.augurit.awater.util.page.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.util.PropertyFilter;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
@Transactional
public class TrackPointServiceImpl implements ITrackPointService{

	@Autowired
	private TrackPointDao trackPointDao;

	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public TrackPointForm get(Long id) {
		TrackPoint entity = trackPointDao.get(id);
		return TrackPointConvertor.convertVoToForm(entity);
	}

	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		trackPointDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(TrackPointForm... forms) {
		if(forms != null)
			for(TrackPointForm form : forms)
				this.save(form);
	}

	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(TrackPointForm form){

		if(form != null){
			TrackPoint entity = null;

			//准备VO对象
			if(form != null && form.getId() != null){
				entity = trackPointDao.get(form.getId());
			}else{
				entity = new TrackPoint();
			}

			//属性值转换
			TrackPointConvertor.convertFormToVo(form, entity);

			//保存
			trackPointDao.save(entity);

			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<TrackPointForm> search(Page<TrackPointForm> page, TrackPointForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from TrackPoint ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();

		// 查询条件
		if(form != null){

		}

		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));

		// 执行分页查询操作
		Page pg = trackPointDao.findPage(page, hql.toString(), values);

		// 转换为Form对象列表并赋值到原分页对象中
		List<TrackPointForm> list = TrackPointConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}

	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<TrackPointForm> search(Page<TrackPointForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<TrackPoint> pg = trackPointDao.findPage(page, filters);

		// 转换为Form对象列表并赋值到原分页对象中
		List<TrackPointForm> list = TrackPointConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	/**
	 * 根据区查询人员实时分布
	 */
	@Override
	public List<Map<String, Object>> getFormByParentOrgId(String parentOrgId) {
		StringBuffer sql = new StringBuffer("select * from (");
		sql.append("select ps.mark_person_id,ps.x,ps.y,ps.mark_time,ROW_NUMBER() OVER(PARTITION BY ps.mark_person_id ORDER BY ps.mark_time desc) AS code_id  ");
		sql.append(" from DRI_TRACK_POINT ps,DRI_TRACK_LINE t where ps.track_Id=t.id");
		Map<String,Object> values = new HashMap<String,Object>();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		if(StringUtils.isNotBlank(parentOrgId)){
			sql.append(" and t.parent_Org_Id = :parentOrgId");
			values.put("parentOrgId", parentOrgId);
		}
		sql.append(" and t.state = '0'");
		sql.append(" and to_char(ps.mark_Time,'yyyy-MM-dd') = '"+df.format(new Date())+"'");
		sql.append(") where code_id=1");
		sql.append(" order by mark_Time desc");
		SQLQuery query = trackPointDao.createSQLQuery(sql.toString(), values);
		List<Object[]> resultlist = query.list();
		List<Map<String, Object>> list = new ArrayList<>();
		if(resultlist!=null && resultlist.size()>0){
			for(Object[] obj : resultlist){
				Map<String, Object> mp = new HashMap<String, Object>();
				mp.put("x", obj[1]);
				mp.put("y", obj[2]);
				list.add(mp);
			}
		}
		return list;
	}
	/**
	 * 根据trackId查询
	 */
	@Override
	public List<TrackPointForm> getFormByTrackId(String trackId) {
		StringBuffer hql = new StringBuffer("from TrackPoint ps where 1=1 ");
		Map<String,Object> values = new HashMap<String,Object>();
		if(StringUtils.isNotBlank(trackId)){
			hql.append(" and ps.trackId = :trackId");
			values.put("trackId", trackId);
		}
		hql.append(" order by ps.markTime asc");
		List<TrackPoint> list = trackPointDao.find(hql.toString(), values);
		if(list != null && list.size()>0){
			return TrackPointConvertor.convertVoListToFormList(list);
		}
		return null;
	}
	/**
	 * 根据trackId查询长度
	 */
	@Override
	public long getLengthByTrackId(String trackId) {
		if(StringUtils.isNotBlank(trackId)){
			Map<String,Object> values = new HashMap<String,Object>();
			values.put("trackId", trackId);
			String sqlString="select max(t.record_length) from DRI_TRACK_POINT t where t.track_id=:trackId";
			SQLQuery query = trackPointDao.createSQLQuery(sqlString,values);
			List<Object> resultlist = query.list();
			if(resultlist!=null && resultlist.size()>0 && resultlist.get(0)!=null){
				return Long.valueOf(resultlist.get(0).toString());
			}else{
				return 0;
			}
		}else{
			return 0;
		}
	}
}