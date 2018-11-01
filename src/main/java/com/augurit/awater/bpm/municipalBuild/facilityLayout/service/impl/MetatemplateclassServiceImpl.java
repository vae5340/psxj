package com.augurit.awater.bpm.municipalBuild.facilityLayout.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import com.augurit.awater.bpm.municipalBuild.facilityLayout.convert.MetaclasspropertyConvertor;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.convert.MetatemplateclassConvertor;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.dao.MetaclasspropertyDao;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.dao.MetadatacategoryDao;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.dao.MetatemplateclassDao;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metaclassproperty;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metatemplateclass;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.service.IMetatemplateclassService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetaclasspropertyForm;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetadatacategoryForm;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetatemplateclassForm;
import com.augurit.awater.common.Tree;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
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
public class MetatemplateclassServiceImpl implements IMetatemplateclassService {

	@Autowired
	private MetatemplateclassDao metatemplateclassDao;

	@Autowired
	private MetaclasspropertyDao metaclasspropertyDao;

	@Autowired
	private MetadatacategoryDao metadatacategoryDao;
	
	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public MetatemplateclassForm get(Long id) {
		Metatemplateclass entity = metatemplateclassDao.get(id);
		return MetatemplateclassConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		metatemplateclassDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(MetatemplateclassForm... forms) {
		if(forms != null)
			for(MetatemplateclassForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(MetatemplateclassForm form){
		
		if(form != null){
			Metatemplateclass entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = metatemplateclassDao.get(form.getId());
			}else{
				entity = new Metatemplateclass();
			}
			
			//属性值转换
			MetatemplateclassConvertor.convertFormToVo(form, entity);
			
			//保存
			metatemplateclassDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<MetatemplateclassForm> search(Page<MetatemplateclassForm> page, MetatemplateclassForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from Metatemplateclass ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = metatemplateclassDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<MetatemplateclassForm> list = MetatemplateclassConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<MetatemplateclassForm> search(Page<MetatemplateclassForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<Metatemplateclass> pg = metatemplateclassDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<MetatemplateclassForm> list = MetatemplateclassConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}

	@Override
	public List getMetatemplateclassData(HttpServletRequest request) {
		List metatemplateclassList= new ArrayList();
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from Metatemplateclass where 1=1");
		List values = new ArrayList();
		String templateclassid = request.getParameter("templateclassid");
		// 查询条件
		if(templateclassid !=null && templateclassid !=""){
			hql.append(" and templateclassid = ? ");
			values.add(Long.valueOf(templateclassid).longValue());
		}
		// 执行查询操作
		List<Metatemplateclass> templateclassList = metatemplateclassDao.find(hql.toString(), values);
		// 转换为Form对象列表中
		List<MetatemplateclassForm> list = MetatemplateclassConvertor.convertVoListToFormList(templateclassList);
		metatemplateclassList.add(list);

		// 查询语句及参数
		StringBuffer fieldHql = new StringBuffer("from Metaclassproperty where 1=1");
		List fieldValues = new ArrayList();
		if(templateclassList.size()>0) {
			// 查询条件
			if (templateclassList.get(0).getTemplateclassid() != null && !templateclassList.get(0).getTemplateclassid().equals("")) {
				fieldHql.append(" and templateclassid = ? ");
				fieldValues.add(Long.valueOf(templateclassList.get(0).getTemplateclassid()).longValue());
			}
			fieldHql.append(" order by classpropertyid");
			//执行查询操作
			List<Metaclassproperty> metadatafieldList = metatemplateclassDao.find(fieldHql.toString(), fieldValues);
			// 转换为Form对象列表中
			List<MetaclasspropertyForm> fieldList = MetaclasspropertyConvertor.convertVoListToFormList(metadatafieldList);
			metatemplateclassList.add(fieldList);
		}

		return metatemplateclassList;
	}

	@Override
	public boolean saveMetatemplateclassData(HttpServletRequest request) {
		String id = request.getParameter("id");
		String templateclassname = request.getParameter("templateclassname");
		String displayname = request.getParameter("displayname");
		String templateclassdesc = request.getParameter("templateclassdesc");
		String metadatacategoryid = request.getParameter("metadatacategoryid");

		Metatemplateclass entity = null;
		long categoryid=Long.valueOf(metadatacategoryid).longValue();

		if(id != null && !id.equals("")){
			entity = metatemplateclassDao.get(Long.valueOf(id).longValue());
		}else{
			entity = new Metatemplateclass();
			String sql = "select count(*) as  maxId from "+
					"Metatemplateclass where metadatacategoryid="+Long.valueOf(metadatacategoryid);
			SQLQuery query = metatemplateclassDao.createSQLQuery(sql);
			query.addScalar("maxId", LongType.INSTANCE);
			Long maxId = (Long)query.uniqueResult();
			entity.setTemplateclassid(Long.valueOf(categoryid).longValue()*100+maxId+1);
			entity.setMetadatacategoryid(categoryid);
		}
		entity.setTemplateclassname(templateclassname.toUpperCase());
		entity.setDisplayname(displayname);
		entity.setTemplateclassdesc(templateclassdesc);
		metatemplateclassDao.save(entity);

		String propertyList = request.getParameter("tableFieldList");
		List<Metaclassproperty> fieldList = new ArrayList<Metaclassproperty>();
		if (null != propertyList && !propertyList.equalsIgnoreCase("[]")) {
			JSONArray array = JSONArray.parseArray(propertyList);
			Long classpropertyid = entity.getTemplateclassid().longValue()*100;
			for (int i = 0; i < array.size(); i++) {
				JSONObject json = array.getJSONObject(i);
				Metaclassproperty property;
				if(json.getString("id") != null && !json.getString("id").equals("")) {
					property = metaclasspropertyDao.find(Long.valueOf(json.getString("id")));
					if (property.getClasspropertyid() >= classpropertyid) {
						classpropertyid = property.getClasspropertyid();
					}
					property.setClasspropertyname(json.getString("classpropertyname"));
					property.setClasspropertydesc(json.getString("classpropertydesc"));
					property.setDisplayname(json.getString("displayname"));
					property.setFieldstatecode(json.getString("fieldstatecode"));
					property.setNullflag(Long.valueOf(json.getString("nullflag")));
					property.setQuerypropertyflag(Long.valueOf(json.getString("querypropertyflag")));
					property.setListpropertyflag(Long.valueOf(json.getString("listpropertyflag")));
					property.setTemplateclassid(entity.getTemplateclassid());
					fieldList.add(property);
				}
			}
			for (int i = 0; i < array.size(); i++) {
				JSONObject json = array.getJSONObject(i);
				Metaclassproperty property;
				if(null == json.getString("id") || json.getString("id").equals("")) {
					property = new Metaclassproperty();
					classpropertyid = classpropertyid+1;
					property.setClasspropertyid(classpropertyid);
					property.setClasspropertyname(json.getString("classpropertyname"));
					property.setClasspropertydesc(json.getString("classpropertydesc"));
					property.setDisplayname(json.getString("displayname"));
					property.setFieldstatecode(json.getString("fieldstatecode"));
					property.setNullflag(Long.valueOf(json.getString("nullflag")));
					property.setQuerypropertyflag(Long.valueOf(json.getString("querypropertyflag")));
					property.setListpropertyflag(Long.valueOf(json.getString("listpropertyflag")));
					property.setTemplateclassid(entity.getTemplateclassid());
					fieldList.add(property);
				}
			}
		}

		metaclasspropertyDao.save(fieldList);
		return true;
	}

	@Override
	public boolean delMetatemplateclassData(HttpServletRequest request) {
		String id = request.getParameter("id");
		//删除基类模板记录
		Metatemplateclass metatemplateclass = metatemplateclassDao.find(Long.valueOf(id));
		metatemplateclassDao.delete(metatemplateclass);
		if(metatemplateclass.getTemplateclassid() != null){
			String hql = "from Metaclassproperty where templateclassid = "+metatemplateclass.getTemplateclassid();
			List<Metaclassproperty> propertyList = metaclasspropertyDao.find(hql);
			if(propertyList.size()>0){
				metaclasspropertyDao.delete(propertyList);
			}
		}
		return true;
	}

	@Override
	public List<Tree> getMetatemplateclassTree() {
		String sql = "select metadatacategoryid,displayname,seniorid,state from "+
				"metadatacategory order by seniorid";
		// 查询条件
		SQLQuery query = metadatacategoryDao.createSQLQuery(sql);
		query.addScalar("metadatacategoryid", LongType.INSTANCE)
				.addScalar("displayname", StringType.INSTANCE)
				.addScalar("seniorid", LongType.INSTANCE)
				.addScalar("state", StringType.INSTANCE);
		query.setResultTransformer(Transformers.aliasToBean(MetadatacategoryForm.class));
		List<MetadatacategoryForm> list = query.list();

		Map<Integer,Tree> treelist = new HashMap<Integer,Tree>();
		List<Tree> rlt = new ArrayList<Tree>();
		Tree tree = null;
		MetadatacategoryForm metadatacategoryForm = null;
		Tree parent = null;
		for(int i=0;i<list.size();i++){
			metadatacategoryForm = list.get(i);
			tree = new Tree();
			tree.setId(metadatacategoryForm.getMetadatacategoryid().intValue());
			tree.setSeniorid(metadatacategoryForm.getSeniorid().intValue());
			tree.setName(metadatacategoryForm.getDisplayname());
			if (metadatacategoryForm.getState().equals("leaf") || metadatacategoryForm.getState().equals("group")){
				if(metadatacategoryForm.getState().equals("leaf")){
					tree.setIconCls("icon-leaf");
					tree.setIconSkin("icon_leaf");
				}else{
					tree.setIconCls("icon-group");
					tree.setIconSkin("icon_group");
				}
				String hql = "from Metatemplateclass where metadatacategoryid = "+metadatacategoryForm.getMetadatacategoryid();
				List<Metatemplateclass> metatemplateclassList =  metatemplateclassDao.find(hql);
				List<Tree> childList = new ArrayList<Tree>();
				//添加基类模板
				for(Metatemplateclass mtc : metatemplateclassList){
					Tree childTree = new Tree();
					childTree.setId(mtc.getTemplateclassid().intValue());
					childTree.setSeniorid(mtc.getMetadatacategoryid().intValue());
					childTree.setName(mtc.getDisplayname());
					childTree.setIconCls("icon-template");
					childTree.setIconSkin("icon_template");
					childList.add(childTree);
				}
				tree.setChildren(childList);
			}else if(metadatacategoryForm.getState().equals("root")){
				tree.setIconCls("icon-root");
				tree.setIconSkin("icon_root");
			}
			parent = treelist.get(metadatacategoryForm.getSeniorid().intValue());
			if(parent !=null){
				parent.getChildren().add(tree);
			}else{
				rlt.add(tree);
			}
			treelist.put(metadatacategoryForm.getMetadatacategoryid().intValue(),tree);
		}
		return rlt;
	}

	@Override
	public boolean delMetaclasspropertyData(HttpServletRequest request) {
		String ids = request.getParameter("ids");
		String hql = "from Metaclassproperty where id in ("+ids+")";
		List<Metaclassproperty> propertyList = metaclasspropertyDao.find(hql);
		if(null != propertyList && propertyList.size()>0){
			metaclasspropertyDao.delete(propertyList);

		}
		return true;
	}

	@Override
	public List<Metatemplateclass> getMetatemplateclassList(HttpServletRequest request) {
		String metadatacategoryid = request.getParameter("metadatacategoryid");
		if(null != metadatacategoryid && !metadatacategoryid.equals("")){
			String sql = "select * from metatemplateclass where metadatacategoryid in (select metadatacategoryid from METADATACATEGORY a " +
					"start with a.metadatacategoryid = "+Long.valueOf(metadatacategoryid)+" connect by prior a.metadatacategoryid = a.seniorid)";
			SQLQuery query = metatemplateclassDao.createSQLQuery(sql);
			query.addEntity(Metatemplateclass.class);
			List<Metatemplateclass> list = query.list();
			if(list.size()>0){
				return list;
			}
		}
		return null;
	}
}