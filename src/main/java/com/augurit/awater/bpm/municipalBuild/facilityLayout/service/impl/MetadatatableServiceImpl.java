package com.augurit.awater.bpm.municipalBuild.facilityLayout.service.impl;

import com.augurit.awater.util.sql.HqlUtils;
import com.augurit.awater.util.file.PageUtils;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.convert.MetadatafieldConvertor;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.convert.MetadatatableConvertor;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.dao.MetaclasspropertyDao;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.dao.MetadatacategoryDao;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.dao.MetadatafieldDao;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.dao.MetadatatableDao;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metadatacategory;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metadatafield;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metadatatable;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.service.IMetadatafieldService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.service.IMetadatatableService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.*;
import com.augurit.awater.common.Tree;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.util.PropertyFilter;

import javax.servlet.http.HttpServletRequest;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class MetadatatableServiceImpl implements IMetadatatableService {

	@Autowired
	private MetadatatableDao metadatatableDao;
	
	@Autowired
	private MetadatafieldDao metadatafieldDao;
	
	@Autowired
	private MetaclasspropertyDao metaclasspropertyDao;

	@Autowired
	private MetadatacategoryDao metadatacategoryDao;

	@Autowired
	private IMetadatafieldService metadatafieldService;

//	@Autowired
//	private AgComUserDao agComUserDao;

//	private IAgSpatialRegisterDao agSpatialRegisterDao  = new AgSpatialRegisterDao10Impl();

	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public MetadatatableForm get(Long id) {
		Metadatatable entity = metadatatableDao.get(id);
		return MetadatatableConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		metadatatableDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(MetadatatableForm... forms) {
		if(forms != null)
			for(MetadatatableForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(MetadatatableForm form){
		
		if(form != null){
			Metadatatable entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = metadatatableDao.get(form.getId());
			}else{
				entity = new Metadatatable();
			}
			
			//属性值转换
			MetadatatableConvertor.convertFormToVo(form, entity);
			
			//保存
			metadatatableDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<MetadatatableForm> search(Page<MetadatatableForm> page, MetadatatableForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from Metadatatable ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = metadatatableDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<MetadatatableForm> list = MetadatatableConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<MetadatatableForm> search(Page<MetadatatableForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<Metadatatable> pg = metadatatableDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<MetadatatableForm> list = MetadatatableConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	// 生成表模板树
	@Override
	public List<Tree> getMetadatatableTree(String rootid){
		String sql = "select metadatacategoryid,displayname,state,seniorid from "+
	              "metadatacategory start with metadatacategoryid in ("+rootid+") connect by prior metadatacategoryid = seniorid order by seniorid";
		// 查询条件
		SQLQuery query = metadatatableDao.createSQLQuery(sql);
		query.addScalar("metadatacategoryid", LongType.INSTANCE)
		.addScalar("displayname", StringType.INSTANCE)
		.addScalar("state", StringType.INSTANCE)
		.addScalar("seniorid", LongType.INSTANCE);
		query.setResultTransformer(Transformers.aliasToBean(MetadatacategoryForm.class));
		List<MetadatacategoryForm> list = query.list();

		//查找项目模板列表
		if(!rootid.equals("0")){
			//查找项目模板列表
			sql = "select c.tableid,c.displayname as displayname,c.metadatacategoryid from metadatatable c  where " +
					" c.metadatacategoryid in (select a.metadatacategoryid from METADATACATEGORY a " +
					"start with a.metadatacategoryid in ("+rootid+") connect by prior a.metadatacategoryid = a.seniorid) order by c.tableid";
		}else{
			sql = "select c.tableid,c.displayname || '-' || b.displayname as displayname,c.metadatacategoryid from metadatatable c, template b where " +
					"c.templateid = b.templateid and c.metadatacategoryid in (select a.metadatacategoryid from METADATACATEGORY a " +
					"start with a.metadatacategoryid in ("+rootid+") connect by prior a.metadatacategoryid = a.seniorid) order by c.tableid";
		}


		
		query = metadatatableDao.createSQLQuery(sql);
		query.addScalar("tableid", LongType.INSTANCE)
		.addScalar("displayname", StringType.INSTANCE)
		.addScalar("metadatacategoryid", LongType.INSTANCE);
		query.setResultTransformer(Transformers.aliasToBean(MetadatatableForm.class));
		List<MetadatatableForm> metadatatableList = query.list();
				
		Map<Integer,Tree> treelist = new HashMap<Integer,Tree>();
		List<Tree> rlt = new ArrayList<Tree>();
		Tree tree = null;
		MetadatacategoryForm metadatacategoryForm = null;
		MetadatatableForm metadatatableForm = null;
		Tree parent = null;
		for(int i=0;i<list.size();i++){
			metadatacategoryForm = list.get(i);		
			tree = new Tree();
			tree.setId(metadatacategoryForm.getMetadatacategoryid().intValue());
			tree.setSeniorid(metadatacategoryForm.getSeniorid().intValue());
			tree.setName(metadatacategoryForm.getDisplayname());
			tree.setIconCls("icon-parent");
			tree.setState(metadatacategoryForm.getState());
			if(metadatacategoryForm.getState().equals("root")){
				tree.setIconSkin("icon_root");
			}else if(metadatacategoryForm.getState().equals("group")){
				tree.setIconSkin("icon_group");
			}else{
				tree.setIconSkin("icon_group");
			}
			parent = treelist.get(metadatacategoryForm.getSeniorid().intValue());
			if(parent !=null){
				parent.getChildren().add(tree);
			}else{
				rlt.add(tree);
			}
			treelist.put(metadatacategoryForm.getMetadatacategoryid().intValue(),tree);
		}
		
		for(int j=0;j<metadatatableList.size();j++){
			metadatatableForm = metadatatableList.get(j);		
			tree = new Tree();
			tree.setId(metadatatableForm.getTableid().intValue());
			tree.setSeniorid(metadatatableForm.getMetadatacategoryid().intValue());
			tree.setName(metadatatableForm.getDisplayname());
			tree.setIconCls("icon-children");
			tree.setIconSkin("icon_template");
			if(parent !=null){
				parent = treelist.get(metadatatableForm.getMetadatacategoryid().intValue());
				parent.getChildren().add(tree);
			}
		}
		
		return rlt;
	}
	
	// 查询模板表记录
	public List<TemplateForm> getTemplateData(){
		String sql = "select templateid,displayname from "+
	              "Template where 1=1";
		// 查询条件
		SQLQuery query = metadatatableDao.createSQLQuery(sql);
		query.addScalar("templateid", LongType.INSTANCE)
		.addScalar("displayname", StringType.INSTANCE);
		query.setResultTransformer(Transformers.aliasToBean(TemplateForm.class));
		List<TemplateForm> list = query.list();
		return list;
	}
	
	// 查询元数据表记录
	public List getMetadatatableData(HttpServletRequest request){
		List metadataList= new ArrayList();
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from Metadatatable ps where 1=1");
		List values = new ArrayList();
		
		String tableid = request.getParameter("tableid");
		
		// 查询条件		
		if(tableid !=null && !(tableid.equals(""))){
			hql.append(" and ps.tableid = ? ");
			values.add(Long.valueOf(tableid).longValue());
		}		
		//排序
		// 执行查询操作
		List<Metadatatable> metadatatableList = metadatatableDao.find(hql.toString(), values);		
		// 转换为Form对象列表中
		List<MetadatatableForm> list = MetadatatableConvertor.convertVoListToFormList(metadatatableList);
		metadataList.add(list);
		
		// 查询语句及参数
		StringBuffer fieldHql = new StringBuffer("from Metadatafield ps where 1=1");
		List fieldValues = new ArrayList();
		// 查询条件		
		if(tableid !=null && !(tableid.equals(""))){
			fieldHql.append(" and ps.tableid = ? ");
			fieldValues.add(Long.valueOf(tableid).longValue());
		}
		//排序
		fieldHql.append(" order by ps.displayorder");
		List<Metadatafield> metadatafieldList = metadatafieldDao.find(fieldHql.toString(), fieldValues);
		// 转换为Form对象列表中
		List<MetadatafieldForm> fieldList = MetadatafieldConvertor.convertVoListToFormList(metadatafieldList);
		metadataList.add(fieldList);
		
		return metadataList;
	}


	// 保存元数据表记录
	public boolean saveMetadatatableData(HttpServletRequest request) {
		String id = request.getParameter("ID");
		String templateName = request.getParameter("templateName");
		String displayName = request.getParameter("displayName");
		String tableName = request.getParameter("tableName");
		String primaryKeyName = request.getParameter("primaryKeyName");
		String relatedFieldName = request.getParameter("relatedFieldName");
		String tableType = request.getParameter("tableType");
		String layerType = request.getParameter("layerType");
		String metadatacategoryid = request.getParameter("metadatacategoryid");
		String createState = request.getParameter("createState");
		String metacodetypecode = request.getParameter("belongMetaCodeName");
		String tablestatecode = request.getParameter("tableStateCode");
		String hasfile = request.getParameter("hasfile");
		String isDictionary = request.getParameter("isDictionary");
		String tableFieldList = request.getParameter("tableFieldList");
		try {
			Metadatatable entity = null;
			long tableID = 0;
			//准备VO对象

			if (id != null && !(id.equals(""))) {
				entity = metadatatableDao.get(Long.valueOf(id).longValue());
				tableID = Long.valueOf(metadatacategoryid).longValue();
			} else {
				entity = new Metadatatable();
				//tableid生成规则
				String sql = "select count(*) as  maxId from " +
						"Metadatatable where metadatacategoryid=" + Long.valueOf(metadatacategoryid).longValue();
				SQLQuery query = metadatatableDao.createSQLQuery(sql);
				query.addScalar("maxId", LongType.INSTANCE);
				Long maxId = (Long) query.uniqueResult();
				tableID = Long.valueOf(metadatacategoryid).longValue() * 100 + maxId + 1;
				entity.setTableid(tableID);
				entity.setMetadatacategoryid(Long.valueOf(metadatacategoryid).longValue());
			}
			entity.setTemplateid(Long.valueOf(templateName).longValue());
			entity.setTablename(tableName.toUpperCase());
			entity.setDisplayname(displayName);
			entity.setPrimarykeyfieldname(primaryKeyName.toUpperCase());
			if (StringUtils.isNotBlank(relatedFieldName) && !relatedFieldName.equals("")) {
				entity.setRelatedfieldname(relatedFieldName.toUpperCase());
			}
			entity.setTabletype(Long.valueOf(tableType).longValue());
			entity.setLayertype(Long.valueOf(layerType).longValue());
			entity.setMetacodetypecode(metacodetypecode);
			entity.setTablestatecode(tablestatecode);
			entity.setHasfile(Long.valueOf(hasfile));
			entity.setIsDictionary(Long.valueOf(isDictionary));
			//保存模板详细定义模型
			metadatatableDao.save(entity);

			//保存模板表结构定义模型
			List<Metadatafield> fieldList = new ArrayList<Metadatafield>();
			if (null != tableFieldList && !tableFieldList.equalsIgnoreCase("[]")) {
				JSONArray array = JSONArray.parseArray(tableFieldList);
				for (int i = 0; i < array.size(); i++) {
					JSONObject jo = array.getJSONObject(i);
					Metadatafield field = new Metadatafield();
					if (jo.getLong("id") != 0) {
						field = metadatafieldDao.get(jo.getLong("id"));
					} else {
						field.setFieldid(tableID * 100 + i);
						field.setTableid(tableID);
						field.setPatrolfieldflag(Long.valueOf(1).longValue());
						field.setDisplayorder(field.getFieldid());
					}
					field.setFieldname(jo.getString("fieldName").toUpperCase());
					field.setDisplayname(jo.getString("displayName"));
					if (jo.containsKey("fieldStateCode")) {
						field.setFieldstatecode(jo.getString("fieldStateCode"));
					}
					field.setDatatypename(jo.getString("dataTypeName"));
					if (!jo.getString("dataTypeLength").equals("")) {
						field.setDatatypelength(jo.getLong("dataTypeLength"));
					} else {
						if (jo.getString("dataTypeName").equals("NVARCHAR2")) {
							field.setDatatypelength(Long.valueOf(100).longValue());
						} else if (jo.getString("dataTypeName").equals("INTEGER")) {

						} else if (jo.getString("dataTypeName").equals("NUMBER")) {
							field.setDatatypelength(Long.valueOf(38).longValue());
						} else if (jo.getString("dataTypeName").equals("DATE")) {
							field.setComponentid(2l);
						} else {
							field.setDatatypelength(Long.valueOf(10).longValue());
						}
					}
					if (!jo.getString("classProperty").equals("")) {
						field.setClasspropertyid(jo.getLong("classProperty"));
					} else {
						field.setClasspropertyid(null);
					}
					if (primaryKeyName.equalsIgnoreCase(jo.getString("fieldName"))) {
						field.setPrimarykeyfieldflag(1l);
					} else {
						field.setPrimarykeyfieldflag(jo.getLong("primaryKeyFieldFlag"));
					}
					field.setRelatedfieldflag(jo.getLong("relatedFieldFlag"));
					field.setNullflag(jo.getLong("nullFlag"));
					field.setQueryfieldflag(jo.getLong("queryFieldFlag"));
					field.setListfieldflag(jo.getLong("listFieldFlag"));
					field.setBelongmetacodename(metacodetypecode);
					fieldList.add(field);
				}
			}
			metadatafieldDao.save(fieldList);

			if (createState.equals("yes")) {
				//创建表结构
				if (Long.valueOf(tableType).intValue() == 0) {
					//创建非空间数据表
					String commentSql = "comment on table " + tableName + " is '" + displayName + "',";
					String createSQL = "create table " + tableName + "(";
					if (null != tableFieldList && !tableFieldList.equalsIgnoreCase("[]")) {
						JSONArray array = JSONArray.parseArray(tableFieldList);
						for (int i = 0; i < array.size(); i++) {
							JSONObject jo = array.getJSONObject(i);
							createSQL += jo.getString("fieldName") + " " + jo.getString("dataTypeName");
							commentSql += "comment on column " + tableName + "." + jo.getString("fieldName") + " is '" + jo.getString("displayName") + "',";
							if (jo.getString("dataTypeLength").equals("")) {
								if (jo.getString("dataTypeName").equals("NVARCHAR2")) {
									createSQL += "(100)";
								} else if (jo.getString("dataTypeName").equals("INTEGER")) {
									createSQL += "";
								} else if (jo.getString("dataTypeName").equals("NUMBER")) {
									createSQL += "(38)";
								} else if (jo.getString("dataTypeName").equals("DATE")) {
									createSQL += "";
								} else {
									createSQL += "(10)";
								}
							} else {
								if (jo.getString("dataTypeName").equals("INTEGER")) {
									createSQL += "";
								} else {
									createSQL += "(" + jo.getLong("dataTypeLength") + ")";
								}
							}
							if (jo.getLong("nullFlag") == 0) {
								createSQL += " not null";
							} else {
								createSQL += " null";
							}
							if (jo.getString("fieldName").toUpperCase().equals(primaryKeyName.toUpperCase())) {
								createSQL += " primary key,";
							} else {
								createSQL += ",";
							}
						}
					}
					createSQL = createSQL.substring(0, createSQL.length() - 1);
					createSQL += ")";
					int index = tableName.indexOf(".");
					String tableSpaceStr = tableName.substring(0, index);
					String tableNameStr = tableName.substring(index + 1, tableName.length());
					String sqSql = " create sequence " + tableSpaceStr + ".SEQ_" + tableNameStr +
							" minvalue 1 " +
							" maxvalue 9999999999999999 " +
							" start with 1 " +
							" increment by 1 " +
							" cache 20";
					metadatatableDao.executeNonQuery(createSQL);
					metadatatableDao.executeNonQuery(sqSql);
					String[] strAry = commentSql.split(",");
					if (null != strAry && strAry.length > 0) {
						for (String sqlString : strAry) {
							metadatatableDao.executeUpdateSql(sqlString);
						}
					}
				} else {
					//创建空间数据表
					List<Map> data = new ArrayList<Map>();
					JSONArray array = JSONArray.parseArray(tableFieldList);
					for (int i = 0; i < array.size(); i++) {
						JSONObject jo = array.getJSONObject(i);
						if (jo.getString("fieldName").equalsIgnoreCase("OBJECTID")) {
							continue;
						}
						Map map = new HashMap();
						map.put("attr", jo.getString("fieldName"));
						if (null != jo.getString("dataTypeLength") && !jo.getString("dataTypeLength").equals("")) {
							map.put("len", jo.getString("dataTypeLength"));
						} else {
							map.put("len", null);
						}

						map.put("pro", jo.getString("displayName"));
						map.put("dataType", jo.getString("dataTypeName"));
						data.add(map);
					}
					switch (Integer.parseInt(layerType)) {
						case 2:
							layerType = "polyline";
							break;
						case 3:
							layerType = "polygon";
							break;
						default:
							layerType = "polypoint";
							break;
					}
//					JSONArray dataArray = JSONArray.parseArray(data);
//					String post = "[{'tableName':'" + tableName + "','byName':'" + displayName + "','type':'" + layerType + "','data':" + dataArray.toString() + "}]";
//					AgSpatialAddLayersController action = new AgSpatialAddLayersController();
					//Todo do
//					LoginUserForm userForm = (LoginUserForm) request.getSession().getAttribute("SESSION_LOGIN_USER");
//					User user = agComUserDao.getUser(userForm.getLoginName());
//					try {
//						String msg = action.createSQLateLayerTable(post, user);
//					} catch (SQLException e) {
//						e.printStackTrace();
//					}
				}
			}
			return true;
		} catch (RuntimeException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}
	
	// 删除元数据表记录
	public boolean delMetadatatableData(HttpServletRequest request){
		String id = request.getParameter("ID");
		String tableid = request.getParameter("tableid");
		String tableName = request.getParameter("tableName");
		String tableType = request.getParameter("tableType");
		//删除元数据表模板字段配置表记录
		delMetadatatableField(tableid);
		//删除元数据表记录
		delete(Long.valueOf(id).longValue());

//		if(tableType.equals("1")){
//			agSpatialRegisterDao.deleteSdeAndAgsupport(tableName);
//		}
		
		//删除创建表和序列
		if(existTableByName(tableName)){
			int index = tableName.indexOf(".");
			String tableSpaceStr = tableName.substring(0, index);
			String tableNameStr = tableName.substring(index + 1, tableName.length());
			String dropSQL ="drop table "+tableName;
			if(!tableType.equals("1")){
				String exsistsequencesql = "select sequence_name from dba_sequences where sequence_owner='"+tableSpaceStr.toUpperCase()+"' and sequence_name = 'SEQ_"+tableNameStr.toUpperCase()+"' ";
				Object sequenceobj = metadatatableDao.createSQLQuery(exsistsequencesql).uniqueResult();
				if(null != sequenceobj && !sequenceobj.toString().equals("")){
					String dropSqSQL ="drop sequence "+tableSpaceStr+".SEQ_"+tableNameStr;
					metadatatableDao.executeNonQuery(dropSqSQL);

				}
			}
			String exsisttablesql = "select table_name from all_tables where owner = '"+tableSpaceStr.toUpperCase()+"' and table_name = '"+tableNameStr.toUpperCase()+"'";
			Object tableobj = metadatatableDao.createSQLQuery(exsisttablesql).uniqueResult();
			if(null != tableobj && !tableobj.toString().equals("")){
				metadatatableDao.executeNonQuery(dropSQL);
			}

		}
		return true;
	}
	
	// 删除元数据表模板字段配置表记录
	public boolean delMetadatatableField(String tableid){
		// 查询语句及参数
		StringBuffer fieldHql = new StringBuffer("from Metadatafield ps where 1=1");
		List fieldValues = new ArrayList();
		// 查询条件		
		if(tableid !=null && !(tableid.equals(""))){
			fieldHql.append(" and ps.tableid = ? ");
			fieldValues.add(Long.valueOf(tableid).longValue());
		}		
		//排序
		// 执行查询操作		
		List<Metadatafield> list = metadatafieldDao.find(fieldHql.toString(), fieldValues);	
		//删除元数据表模板字段配置表记录
		for(int i=0; i<list.size(); i++) {
			metadatafieldService.delete(list.get(i).getId());			
		}		
		return true;
	}
	
	/**
	 * 通过表名获取表字段信息
	 * @return
	 */
	public List<MetadatafieldForm> getTableFieldListByName(HttpServletRequest request) {
		String tableName = request.getParameter("referenceTable");
		int index = tableName.indexOf(".");
		String tableNameStr = tableName.substring(0, index);
		String tableSpaceStr = tableName.substring(index+1, tableName.length());
		String sql = " select a.COLUMN_NAME as fieldname, decode(DATA_TYPE,'NUMBER',decode(DATA_PRECISION,'','INTEGER',DATA_TYPE),DATA_TYPE) as datatypename, decode(DATA_TYPE,'DATE','','INTEGER','',DATA_LENGTH) as datatypelength, " +
	                 " b.comments as displayname from dba_tab_columns a,all_col_comments b WHERE a.owner = '"+tableNameStr.toUpperCase()+"' and a.table_name = '"+tableSpaceStr.toUpperCase()+"' and DATA_TYPE not in ('ST_GEOMETRY','SDO_GEOMETRY')" +
				" AND a.TABLE_NAME = b.table_name AND a.COLUMN_NAME = b.column_name AND a.OWNER = b.OWNER";
		SQLQuery query = metadatatableDao.createSQLQuery(sql);
		query.addScalar("fieldname", StringType.INSTANCE)
		.addScalar("datatypename", StringType.INSTANCE)
		.addScalar("datatypelength", LongType.INSTANCE)
		.addScalar("displayname", StringType.INSTANCE);
		query.setResultTransformer(Transformers.aliasToBean(MetadatafieldForm.class));
		List<MetadatafieldForm> list = query.list();
		return list;
	}
	
	/**
	 * 获取oracle表数据类型信息
	 * @return
	 */
	public List<MetadatafieldForm> getDataTypeListByOracle() {
		String sql = " select datatype  as datatypename " + 
	                 " from metadatatype";
		SQLQuery query = metadatatableDao.createSQLQuery(sql);
		query.addScalar("datatypename", StringType.INSTANCE);
		query.setResultTransformer(Transformers.aliasToBean(MetadatafieldForm.class));
		List<MetadatafieldForm> list = query.list();
		return list;
	}
	
	/**
	 * 获取设施基类模板属性
	 * @return
	 */
	public List<MetaclasspropertyForm> getMetaClassProperty(HttpServletRequest request) {
		
		String nodeID = request.getParameter("nodeID");
		//查找设施基类模板属性
		String sql = "select c.classpropertyid,c.classpropertyname,c.displayname as displayname,c.fieldstatecode as fieldstatecode,c.nullflag,c.listpropertyflag,c.querypropertyflag from "+
				"metaclassproperty c, "+
				"metatemplateclass b where 1=1 and c.templateclassid = b.templateclassid and b.metadatacategoryid in (SELECT t.metadatacategoryid FROM metadatacategory t"+
				" WHERE t.metadatacategoryid != 0 START WITH t.metadatacategoryid = "+Long.valueOf(nodeID).longValue()+" CONNECT BY PRIOR t.seniorid = t.metadatacategoryid) order by c.classpropertyid";
		SQLQuery query = metaclasspropertyDao.createSQLQuery(sql);
		query.addScalar("classpropertyid", LongType.INSTANCE)
				.addScalar("classpropertyname", StringType.INSTANCE)
		.addScalar("displayname", StringType.INSTANCE)
		.addScalar("fieldstatecode", StringType.INSTANCE)
		.addScalar("nullflag", LongType.INSTANCE)
		.addScalar("listpropertyflag", LongType.INSTANCE)
		.addScalar("querypropertyflag", LongType.INSTANCE);
		query.setResultTransformer(Transformers.aliasToBean(MetaclasspropertyForm.class));
		List<MetaclasspropertyForm> list = query.list();
		return list;
	}
	
	/**
	 * 通过表名获取表字段信息
	 * @return
	 */
	public List<MetadatafieldForm> getTableFieldListByTableName(HttpServletRequest request) {
		String tableID = request.getParameter("tableID");
		String tableName = request.getParameter("tableName");
		int index = tableName.indexOf(".");
		String tableNameStr = tableName.substring(0, index);
		String tableSpaceStr = tableName.substring(index+1, tableName.length());
		String sql = " select a.COLUMN_NAME as fieldname, decode(DATA_TYPE,'NUMBER',decode(DATA_PRECISION,'','INTEGER',DATA_TYPE),DATA_TYPE) as datatypename, decode(DATA_TYPE,'DATE','','INTEGER','',DATA_LENGTH) as datatypelength, " +
				" b.comments as displayname from dba_tab_columns a,all_col_comments b WHERE a.owner = '"+tableNameStr.toUpperCase()+"' and a.table_name = '"+tableSpaceStr.toUpperCase()+"' and DATA_TYPE not in ('ST_GEOMETRY','SDO_GEOMETRY')" +
				" AND a.TABLE_NAME = b.table_name AND a.COLUMN_NAME = b.column_name AND a.OWNER = b.OWNER";
		SQLQuery query = metadatatableDao.createSQLQuery(sql);
		query.addScalar("fieldname", StringType.INSTANCE)
		.addScalar("datatypename", StringType.INSTANCE)
		.addScalar("datatypelength", LongType.INSTANCE)
		.addScalar("displayname", StringType.INSTANCE);
		query.setResultTransformer(Transformers.aliasToBean(MetadatafieldForm.class));
		List<MetadatafieldForm> list = query.list();
		for (int i = 0; i < list.size(); i++) {
			list.get(i).setTableid(Long.valueOf(tableID).longValue());
			list.get(i).setFieldid(Long.valueOf(tableID).longValue()*100+i);
		}
		
		// 接着清空元数据表模板字段配置表记录
		delMetadatatableField(tableID);
		
		return list;
	}
	
	// 保存排序顺序
	public boolean saveFieldSort(HttpServletRequest request){	
		//保存模板表结构定义模型
		String tableFieldList = request.getParameter("fields");
		List<Metadatafield> fieldList = new ArrayList<Metadatafield>();
		if (null != tableFieldList && !tableFieldList.equalsIgnoreCase("[]")) {
			JSONArray array = JSONArray.parseArray(tableFieldList);
			for (int i = 0; i < array.size(); i++) {
				JSONObject jo = array.getJSONObject(i);
				Metadatafield field = metadatafieldDao.get(jo.getLong("id"));
				field.setDisplayorder(Long.valueOf(i).longValue());				
				fieldList.add(field);
			}
			metadatafieldDao.save(fieldList);
		}
		
		return true;
	}
	
	/**
	 * 通过表名判断数据库是否存在该物理表
	 * @param tableName 表名称
	 * @return
	 */
	@Override
	public boolean existTableByName(String tableName) {
		int index = tableName.indexOf(".");
		String tableNameStr = tableName.substring(0, index);
		String tableSpaceStr = tableName.substring(index+1, tableName.length());
		String sql = " select COLUMN_NAME as fieldname, decode(DATA_PRECISION,'',DATA_TYPE,'INTEGER') as datatypename, data_length as datatypelength " + 
	                 " from dba_tab_columns WHERE owner = '"+tableNameStr.toUpperCase()+"' and table_name = '"+tableSpaceStr.toUpperCase()+"' and DATA_TYPE not in ('ST_GEOMETRY','SDO_GEOMETRY')";
		SQLQuery query = metadatatableDao.createSQLQuery(sql);
		query.addScalar("fieldname", StringType.INSTANCE)
		.addScalar("datatypename", StringType.INSTANCE)
		.addScalar("datatypelength", LongType.INSTANCE);
		query.setResultTransformer(Transformers.aliasToBean(MetadatafieldForm.class));
		List<MetadatafieldForm> list = query.list();
		if(list.size()==0){
			return false;
		}else{
			return true;
		}
	}
	
	
	// 获取表模板定义表
	public List<MetadatatableForm> getMetadatatables(HttpServletRequest request){
        String metadatacategoryid = request.getParameter("nodeid");
		String sql = "select b.displayname as templatename,c.displayname as displayname,c.tablename," +
				"CASE c.tabletype WHEN 1 THEN '空间数据' WHEN 0 THEN '非空间数据' ELSE '' END as tabletypename," +
				"c.relatedfieldname from "+
				"metadatatable c,"+
				"template b where c.templateid = b.templateid and c.metadatacategoryid";
		
        sql += " in (select b.metadatacategoryid from METADATACATEGORY b "
                + "where b.metadatacategoryid in (select a.metadatacategoryid from METADATACATEGORY"
                + " a start with a.metadatacategoryid = " + Long.valueOf(metadatacategoryid)
                + " connect by prior a.metadatacategoryid = a.seniorid))";
		
		SQLQuery query = metadatatableDao.createSQLQuery(sql);
		query.addScalar("templatename", StringType.INSTANCE)
		.addScalar("displayname", StringType.INSTANCE)
		.addScalar("tablename", StringType.INSTANCE)
		.addScalar("tabletypename", StringType.INSTANCE)
		.addScalar("relatedfieldname", StringType.INSTANCE);
		query.setResultTransformer(Transformers.aliasToBean(MetadatatableForm.class));
		List<MetadatatableForm> metadatatableList = query.list();
		return metadatatableList;
	}

	@Override
	public List getConnectOtherDatasource(HttpServletRequest request) {
		List<MetadatafieldForm> list = new ArrayList();
		String driverName = request.getParameter("driname");
		String address = request.getParameter("address");
		String dbname = request.getParameter("dbname");
		String dbuser = request.getParameter("dbuser");
		String dbport = request.getParameter("dbport");
		String dbpassword = request.getParameter("dbpassword");
		String tbname = request.getParameter("tbname");
		// 驱动程序名
		String driver = driverName;
		// URL指向要访问的数据库名world
		String url = "jdbc:mysql://";
		url = url+address+':'+dbport+'/'+dbname;
		// MySQL配置时的用户名
		String user = dbuser;
		// MySQL配置时的密码
		String password = dbpassword;
		String fieldName;
		String displayName;
		String fieldType;
		String datatypelength;
		try {
			// 加载驱动程序
			Class.forName(driver);
			// 连续数据库
			Connection conn = DriverManager.getConnection(url, user, password);
			if (!conn.isClosed()){
//				System.out.println("Succeeded connecting to the Database!");
			}
			// statement用来执行SQL语句
			Statement statement = conn.createStatement();
			// 要执行的SQL语句
			String sql = "SELECT COLUMN_NAME , COLUMN_COMMENT,CASE WHEN DATA_TYPE ='int' THEN 'INTEGER' ELSE DATA_TYPE END AS DATA_TYPE," +
						"COLUMN_TYPE AS datatypelength FROM information_schema.columns t WHERE " +
						"t.`TABLE_NAME` ="+"'"+tbname+"'"+" AND t.`TABLE_SCHEMA`="+"'"+dbname+"'";
			// 结果集
			ResultSet rs = statement.executeQuery(sql);
			while (rs.next()) {
				MetadatafieldForm entityForm = new MetadatafieldForm();
				int i= 0;
				fieldName = rs.getString("COLUMN_NAME").toUpperCase();
				displayName = rs.getString("COLUMN_COMMENT");
				fieldType = rs.getString("DATA_TYPE").toUpperCase();
				datatypelength = rs.getString("datatypelength").toUpperCase();
				List datatypelist = getDataTypeListByOracle();

				//判断Oracle数据类型定义表中是否存在该类型
				String datatypeString = "";
				for(int j=0;j<datatypelist.size();j++){
					MetadatafieldForm form = (MetadatafieldForm) datatypelist.get(j);
					datatypeString += form.getDatatypename() +",";
				}
				datatypeString = datatypeString.substring(0,datatypeString.length()-1);
				if(!datatypeString.contains(fieldType)){//在Oracle中不存在该类型时，转成nvarchar2
					fieldType = "NVARCHAR2";
				}
				//如果是float或者integer类型则转成number
				if(fieldType.equals("FLOAT") || fieldType.equals("INTEGER")){
					fieldType = "NUMBER";
				}
				//只有当数据类型不等于‘DATE’且存在长度值时，才给设置字段长度，否则前端字段长度显示为空。
				if(!fieldType.equals("DATE") && datatypelength.contains("(")){
					datatypelength	= datatypelength.substring(datatypelength.indexOf("(")+1,datatypelength.indexOf(")"));
					entityForm.setDatatypelength(Long.valueOf(datatypelength));
				}
				entityForm.setFieldname(fieldName);
				entityForm.setDisplayname(displayName);
				entityForm.setDatatypename(fieldType);
				// 输出结果
				list.add(i,entityForm);
				i++;
			}
			rs.close();
			conn.close();
		} catch (ClassNotFoundException e) {
//			System.out.println("Sorry,can`t find the Driver!");
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}
	/**
	 * 测试连接其他数据源
	 * @param request
	 * @return
	 */
	@Override
	public String getConnectDataSource(HttpServletRequest request) {
		List<MetadatafieldForm> list = new ArrayList();
		String driverName = request.getParameter("driname");
		String address = request.getParameter("address");
		String dbname = request.getParameter("dbname");
		String dbuser = request.getParameter("dbuser");
		String dbport = request.getParameter("dbport");
		String dbpassword = request.getParameter("dbpassword");
		// 驱动程序名
		String driver = driverName;
		// URL指向要访问的数据库名world
		String url = "jdbc:mysql://";
		url = url+address+':'+dbport+'/'+dbname;
		// MySQL配置时的用户名
		String user = dbuser;
		// MySQL配置时的密码
		String password = dbpassword;
		try {
			// 加载驱动程序
			Class.forName(driver);
			// 连续数据库
			Connection conn = DriverManager.getConnection(url, user, password);
			if (!conn.isClosed()){
				return "成功连接数据库！";
			}
			conn.close();
		} catch (ClassNotFoundException e) {
			return "无法连接数据库！";
		} catch (SQLException e) {
			return "无法连接数据库！";
		}
		return "true";
	}

	/**
	 * 通过设施名称获取其下面所有图层配置信息
	 *
	 * @param categoryName 设施名称
	 * @return
	 */
	@Override
	public List<Metadatatable> getMetadataTableByCategoryName(String categoryName) {
		String csql = " select metadatacategoryid from METADATACATEGORY where metadatacategoryname = '"+categoryName+"'";
		Object obj = metadatatableDao.createSQLQuery(csql).uniqueResult();
		Long metadatacategoryid = Long.valueOf(obj.toString());
		String sql = "select * from metadatatable where metadatacategoryid in (select metadatacategoryid from METADATACATEGORY a " +
				"start with a.metadatacategoryid = "+Long.valueOf(metadatacategoryid)+" connect by prior a.metadatacategoryid = a.seniorid)";
		SQLQuery query = metadatatableDao.createSQLQuery(sql);
		query.addEntity(Metadatatable.class);
		List<Metadatatable> list = query.list();
		if(list.size()>0){
			return list;
		}
		return null;
	}

	/**
	 * 通过设施名称获取其下面所有子类设施信息
	 * @param categoryName 设施名称
	 * @return
	 */
	@Override
	public List<Metadatacategory> getMetadatacategoryByCategoryName(String categoryName) {
		String csql = "select metadatacategoryid from METADATACATEGORY where metadatacategoryname = '"+categoryName+"'";
		Object metadatacategoryid = metadatacategoryDao.createSQLQuery(csql).uniqueResult();
		if(null != metadatacategoryid && !metadatacategoryid.toString().equals("")){
			String sql = "select * from METADATACATEGORY a " +
					"start with a.seniorid = "+Long.valueOf(metadatacategoryid.toString())+" connect by prior a.metadatacategoryid = a.seniorid";
			SQLQuery query = metadatacategoryDao.createSQLQuery(sql);
			query.addEntity(Metadatacategory.class);
			List<Metadatacategory> list = query.list();
			if(list.size()>0){
				return list;
			}
		}
		return null;
	}

}