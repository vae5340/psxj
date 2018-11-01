package com.augurit.awater.dri.problem_report.check_record.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.augurit.awater.dri.problem_report.check_record.convert.ReportDeleteConvertor;
import com.augurit.awater.dri.problem_report.check_record.dao.ReportDeleteDao;
import com.augurit.awater.dri.problem_report.check_record.entity.ReportDelete;
import com.augurit.awater.dri.problem_report.check_record.service.IReportDeleteService;
import com.augurit.awater.dri.problem_report.check_record.web.form.ReportDeleteForm;
import com.augurit.awater.util.page.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.util.PropertyFilter;


@Service
@Transactional
public class ReportDeleteServiceImpl implements IReportDeleteService {

	@Autowired
	private ReportDeleteDao reportDeleteDao;
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	/**
	 * 查询当天用户删除数量
	 * @params userid
	 * @return count
	 * */
	@Override
	public Long getToDayCount(String userId){
		String sql = "select count(*) from ReportDelete ps where 1=1 and to_char(ps.deleteTime,'yyyy-MM-dd')=to_char(sysdate,'yyyy-MM-dd')";
		Map values = new HashMap();
		if(StringUtils.isNotBlank(userId)){
			sql+=" and ps.personUserId=:personUserId";
			values.put("personUserId",userId);
		}
		return (Long) reportDeleteDao.createQuery(sql, values).uniqueResult() ;
	}
	
	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public ReportDeleteForm get(Long id) {
		ReportDelete entity = reportDeleteDao.get(id);
		return ReportDeleteConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		reportDeleteDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(ReportDeleteForm... forms) {
		if(forms != null)
			for(ReportDeleteForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(ReportDeleteForm form){
		
		if(form != null){
			ReportDelete entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = reportDeleteDao.get(form.getId());
			}else{
				entity = new ReportDelete();
			}
			
			//属性值转换
			ReportDeleteConvertor.convertFormToVo(form, entity);
			
			//保存
			reportDeleteDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<ReportDeleteForm> search(Page<ReportDeleteForm> page, ReportDeleteForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from ReportDelete ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		// 查询条件
		if(form != null){
			if(form.getDeleteTime()!=null){
				hql.append(" and to_char(ps.deleteTime,'yyyy-MM-dd') = :deleteTime");
				values.put("deleteTime", format.format(form.getDeleteTime()));
			}
			if(StringUtils.isNotBlank(form.getPersonUserId())){
				hql.append(" and ps.personUserId = :personUserId");
				values.put("personUserId", form.getPersonUserId());
			}
		}
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = reportDeleteDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<ReportDeleteForm> list = ReportDeleteConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<ReportDeleteForm> search(Page<ReportDeleteForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<ReportDelete> pg = reportDeleteDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<ReportDeleteForm> list = ReportDeleteConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}

	/**
	 *查询是否删除失败数据
	 * */
	@Override
	public List<ReportDeleteForm> getDeleteStatus(String isDelete) {
		Page<ReportDelete> page = new Page();
		page.setPageSize(500);
		List<ReportDelete> list = new ArrayList<>();
		if(StringUtils.isNotBlank(isDelete)){
			StringBuffer hql = new StringBuffer("from ReportDelete ps where 1=1");
			Map values = new HashMap<>();
			if("2".equals(isDelete)){
				hql.append(" and ps.isDelete=:isDelete");
				values.put("isDelete", isDelete);
				//list = reportDeleteDao.find(hql.toString(), values);
			}
			hql.append(HqlUtils.buildOrderBy(page, "ps"));
			page = reportDeleteDao.findPage(page, hql.toString(), values);
			if(page.getResult()!=null&& page.getResult().size()>0){
				list =page.getResult();
			}
		}
		return ReportDeleteConvertor.convertVoListToFormList(list);
	}

	/**
	 * 统计用户删除总数和当天删除总数
	 * */
	@Override
	public List<Map<String, Object>> getCountTodayAndTotal(Map<String,Object> map,Page<ReportDeleteForm> page){
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		StringBuffer sql = new StringBuffer("(select rownum as num,s.* from(select s2.ORG_NAME,s1.USER_NAME,S1.LOGIN_NAME,s.* from (select s.*,nvl(S1.TODAY,0) today from (");
		sql.append("select s.PARENT_ORG_ID,s.PERSON_USER_ID ,count(*) total from DRI_Report_Delete s GROUP BY s.PERSON_USER_ID,s.PARENT_ORG_ID) s LEFT JOIN ");
		sql.append("(select s.PARENT_ORG_ID,s.PERSON_USER_ID ,count(*) today from DRI_Report_Delete s where 1=1 ");
		if(map.containsKey("deleteTime")&&map.get("deleteTime")!=null){
			sql.append(" and to_char(s.DELETE_TIME,'yyyy-MM-dd') = '"+format.format((Date)map.get("deleteTime"))+"'");
		}else{
			sql.append(" and to_char(s.DELETE_TIME,'yyyy-MM-dd') = to_char(sysdate,'yyyy-MM-dd')");
		}
		sql.append(" GROUP BY s.PERSON_USER_ID,s.PARENT_ORG_ID)s1 on s.PERSON_USER_ID=S1.PERSON_USER_ID )s, opu_OM_USER s1,opu_OM_ORG s2 where ");
		sql.append(" s.PERSON_USER_ID=S1.USER_ID and s.parent_org_id=S2.ORG_ID ");
		sql.append(" order by s.TODAY desc ) s where 1=1");
		if(map.containsKey("userName")&&StringUtils.isNotBlank(map.get("userName").toString())){
			sql.append(" and s.user_name like '%"+map.get("userName").toString()+"%'");
		}
		if(map.containsKey("parentOrgName") && StringUtils.isNotBlank(map.get("parentOrgName").toString())){
			sql.append(" and s.ORG_NAME like '%"+map.get("parentOrgName").toString()+"%' ");
		}
		if(map.containsKey("parentOrgId") && map.get("parentOrgId")!=null &&StringUtils.isNotBlank(map.get("parentOrgId").toString())){
			sql.append(" and s.parent_org_id ="+map.get("parentOrgId").toString()+" ");
		}
		sql.append(" ) s where 1=1 ");
		if(page!=null){
			page.setTotalItems(jdbcTemplate.queryForObject("select count(*) from"+sql.toString(),Integer.class));
			int pageNo=page!=null? (page.getPageNo()>1? 1+page.getPageSize()*(page.getPageNo()-1) : 1):1;
			int pageSize = page!=null? page.getPageSize()*page.getPageNo() : 10;
			sql.insert(0, "select * from");
			sql.append(" and num>="+pageNo+" and num<="+pageSize);
		}
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql.toString());
		return list;
	}
}