package com.augurit.awater.bpm.municipalBuild.facilityLayout.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import com.augurit.awater.bpm.municipalBuild.facilityLayout.convert.TemplateConvertor;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.dao.MetadatafieldDao;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.dao.MetadatatableDao;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.dao.TemplateDao;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metadatatable;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Template;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.service.ITemplateService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.TemplateForm;
import com.augurit.awater.util.data.DataConvert;

import org.apache.commons.lang.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.type.LongType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.augurit.awater.util.file.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;

import com.augurit.awater.util.PropertyFilter;
import com.augurit.awater.common.page.Page;

import javax.servlet.http.HttpServletRequest;

@Service
@Transactional
public class TemplateServiceImpl implements ITemplateService {
	@Autowired
	private TemplateDao templateDao;
	@Autowired
	private MetadatatableDao metadatatableDao;
	@Autowired
	private MetadatafieldDao metadatafieldDao;

	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public TemplateForm get(Long id) {
		Template entity = templateDao.get(id);
		return TemplateConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		templateDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(TemplateForm... forms) {
		if(forms != null)
			for(TemplateForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(TemplateForm form){
		
		if(form != null){
			Template entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = templateDao.get(form.getId());
			}else{
				entity = new Template();
			}
			
			//属性值转换
			TemplateConvertor.convertFormToVo(form, entity);
			
			//保存
			templateDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<TemplateForm> search(Page<TemplateForm> page, TemplateForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from Template ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = templateDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<TemplateForm> list = TemplateConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<TemplateForm> search(Page<TemplateForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<Template> pg = templateDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<TemplateForm> list = TemplateConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}

	@Override
	public List<TemplateForm> getTemplateData(HttpServletRequest request) {
    	// 查询语句及参数
		StringBuffer hql = null;
		String displaynameformsearch = request.getParameter("displaynameforsearch");
		String templatnameforsearch = request.getParameter("templatnameforsearch");
		hql = new StringBuffer("from Template where 1=1");
		if(StringUtils.isNotBlank(displaynameformsearch)&& !displaynameformsearch.equals("")){
			hql.append(" and displayname like '%"+displaynameformsearch+"%'");
		}
		if(StringUtils.isNotBlank(templatnameforsearch) && !templatnameforsearch.equals("")){
			hql.append(" and templatename like'%"+templatnameforsearch+"%'");
		}
		hql.append(" ORDER BY templateid");
		List values = new ArrayList();
		// 转换为Form对象列表
		List<TemplateForm> list = templateDao.find(hql.toString(), values);
		return list;
	}

	@Override
	public String saveTemplateData(TemplateForm form, HttpServletRequest request) {
		int rowsnum = 0;
		String id = request.getParameter("id");
		String inusedValue = request.getParameter("IsInUsed");
		String templatename = request.getParameter("templatename");
		try {


		if(StringUtils.isBlank(id) || id.equals("")){
			String checkSql = "SELECT COUNT(*) FROM template where templatename = "+"'"+templatename+"'";
			Object rows = templateDao.createSQLQuery(checkSql).uniqueResult();
			 rowsnum = Integer.parseInt(rows.toString());
		}
		//同时只能使用一个模板
		if(rowsnum > 0){
			return "模板名称重复~!";
		}else{
			if(inusedValue.equals("1")){
				searchInusedData(inusedValue);
			}
			if(StringUtils.isBlank(id)){
				String sql = "select max(templateid) as  maxId from "+
						"Template where 1=1";
				SQLQuery query = templateDao.createSQLQuery(sql);
				//新增时templateid自增1
				query.addScalar("maxId", LongType.INSTANCE);
				Long templateidmax = (Long)query.uniqueResult();
				form.setTemplateid(templateidmax + 1);

				String sql2 = "select max(displayorder) as  maxId2 from "+
						"Template where 1=1";
				SQLQuery query2 = templateDao.createSQLQuery(sql2);
				//新增时templateid自增1
				query2.addScalar("maxId2", LongType.INSTANCE);
				Long displayMax = (Long)query2.uniqueResult();
				form.setDisplayorder(displayMax + 1);

				//前端传来的字符串，转成long型保存
				String isinused = request.getParameter("IsInUsed");
				long isInUserValue = DataConvert.strToLong(isinused);
				form.setIsinused(isInUserValue);
			}else{
				String isinused = request.getParameter("IsInUsed");
				long isInUserValue = DataConvert.strToLong(isinused);
				form.setIsinused(isInUserValue);
			}
			Template template = new Template();
			TemplateConvertor.convertFormToVo(form,template);
			templateDao.save(template);
		}
		}catch (RuntimeException e){
			e.printStackTrace();
			throw new RuntimeException(e);
		}
		return "true";
	}

	/**
	 *
	 * @param num 同时只能有一个模板被使用。
	 * author ls
	 */
	@Override
	public void searchInusedData(String num) {
		String sql = "select * from "+"Template t where 1=1 and t.isinused = "+num;
		long size = templateDao.countSqlResult(sql);
		if(size>0){
			String sql2 = "update Template"+" set isinused=0 where isinused=1";
	 			templateDao.executeNonQuery(sql2);
		}
	}

	@Override
	public boolean deleteTemplateData(HttpServletRequest request) {
		String ids = request.getParameter("ids");
		String[] str=ids.split(",");
		Long[] longIds = new Long[str.length];
		for (int i = 0; i < str.length; i++) {
			longIds[i] = Long.valueOf(str[i]);
			Template template = templateDao.get(longIds[i]);
			long templateid = template.getTemplateid();
			deleteAboutTemplateData(templateid);
		}
		templateDao.delete(longIds);
		return true;
	}

	/**
	 * 删除与模板有关数据
	 * @param templateid
	 * @return
	 */
	public boolean deleteAboutTemplateData(long templateid){
		String hql = "from Metadatatable where templateid="+templateid;
		List<Metadatatable> metadatatablelist = metadatatableDao.find(hql);
		for(int i=0;i<metadatatablelist.size();i++){
			long id = metadatatablelist.get(i).getId();
			long tableid = metadatatablelist.get(i).getTableid();
			String tablename = metadatatablelist.get(i).getTablename();
			long tabletype = metadatatablelist.get(i).getTabletype();
			String sql = "delete from metadataField where tableid="+tableid;
			metadatafieldDao.executeNonQuery(sql);
			metadatatableDao.delete(id);
			//删除创建表和序列
			if(Long.valueOf(tabletype).longValue()==0){
				int index = tablename.indexOf(".");
				String tableSpaceStr = tablename.substring(0, index);
				String tableNameStr = tablename.substring(index+1, tablename.length());
				String dropSQL ="drop table "+tablename;
				String dropSqSQL ="drop sequence "+tableSpaceStr+".SEQ_"+tableNameStr;
				metadatatableDao.executeNonQuery(dropSqSQL);
				metadatatableDao.executeNonQuery(dropSQL);
			}
		}
		return true;
	}
}
