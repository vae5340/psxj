package com.augurit.awater.bpm.municipalBuild.facilityLayout.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import com.augurit.awater.bpm.municipalBuild.facilityLayout.convert.MetadatacategoryConvertor;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.dao.*;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metaclassproperty;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metadatacategory;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metadatatable;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metatemplateclass;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.service.IMetadatacategoryService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetadatacategoryForm;
import com.augurit.awater.common.Tree;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.util.sql.HqlUtils;
import com.augurit.awater.util.file.PageUtils;
import com.augurit.awater.util.PropertyFilter;
import org.apache.commons.lang.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;

@Service
@Transactional
public class MetadatacategoryServiceImpl implements IMetadatacategoryService {

    @Autowired
    private MetadatacategoryDao metadatacategoryDao;

    @Autowired
    private MetatemplateclassDao metatemplateclassDao;

    @Autowired
    private MetaclasspropertyDao metaclasspropertyDao;
    
	@Autowired
	private MetadatatableDao metadatatableDao;
	
	@Autowired
	private MetadatafieldDao metadatafieldDao;


    /**
     * 根据主键获取Form对象
     */
    @Transactional(readOnly = true)
    public MetadatacategoryForm get(Long id) {
        Metadatacategory entity = metadatacategoryDao.get(id);
        return MetadatacategoryConvertor.convertVoToForm(entity);
    }

    /**
     * 删除Form对象列表
     */
    public void delete(Long... ids) {
        metadatacategoryDao.delete(ids);
    }

    /**
     * 保存新增或修改的Form对象列表
     */
    public void save(MetadatacategoryForm... forms) {
        if (forms != null)
            for (MetadatacategoryForm form : forms)
                this.save(form);
    }

    /**
     * 保存新增或修改的Form对象
     */
    public void save(MetadatacategoryForm form) {

        if (form != null) {
            Metadatacategory entity = null;

            //准备VO对象
            if (form != null && form.getId() != null) {
                entity = metadatacategoryDao.get(form.getId());
            } else {
                entity = new Metadatacategory();
            }

            //属性值转换
            MetadatacategoryConvertor.convertFormToVo(form, entity);

            //保存
            metadatacategoryDao.save(entity);

            //回填ID属性值
            form.setId(entity.getId());
        }
    }

    /**
     * 根据Form对象的查询条件作分页查询
     */
    @Transactional(readOnly = true)
    public Page<MetadatacategoryForm> search(Page<MetadatacategoryForm> page, MetadatacategoryForm form) {
        // 查询语句及参数
        StringBuffer hql = new StringBuffer("from Metadatacategory ps where 1=1");
        Map<String, Object> values = new HashMap<String, Object>();

        // 查询条件
        if (form != null) {

        }

        //排序
        hql.append(HqlUtils.buildOrderBy(page, "ps"));

        // 执行分页查询操作
        Page pg = metadatacategoryDao.findPage(page, hql.toString(), values);

        // 转换为Form对象列表并赋值到原分页对象中
        List<MetadatacategoryForm> list = MetadatacategoryConvertor.convertVoListToFormList(pg.getResult());
        PageUtils.copy(pg, list, page);
        return page;
    }

    /**
     * 根据过滤条件列表作分页查询
     */
    @Transactional(readOnly = true)
    public Page<MetadatacategoryForm> search(Page<MetadatacategoryForm> page, List<PropertyFilter> filters) {
        // 按过滤条件分页查找对象
        Page<Metadatacategory> pg = metadatacategoryDao.findPage(page, filters);

        // 转换为Form对象列表并赋值到原分页对象中
        List<MetadatacategoryForm> list = MetadatacategoryConvertor.convertVoListToFormList(pg.getResult());
        PageUtils.copy(pg, list, page);
        return page;
    }

    @Override
    public List<Tree> getMetadatacategoryTree(int rootid) {
        String sql = "select metadatacategoryid,displayname,seniorid,state,belongToFacMan from "+
                "metadatacategory where 1=1 ORDER BY seniorid";
        // 查询条件
        SQLQuery query = metadatacategoryDao.createSQLQuery(sql);
        query.addScalar("metadatacategoryid", LongType.INSTANCE)
                .addScalar("displayname", StringType.INSTANCE)
                .addScalar("seniorid", LongType.INSTANCE)
                .addScalar("state", StringType.INSTANCE)
                .addScalar("belongtofacman", StringType.INSTANCE);
        query.setResultTransformer(Transformers.aliasToBean(MetadatacategoryForm.class));
        List<MetadatacategoryForm> list = query.list();
        Map<Integer, Tree> treelist = new HashMap<Integer, Tree>();
        List<Tree> rlt = new ArrayList<Tree>();
        Tree tree = null;
        MetadatacategoryForm metadatacategoryForm = null;
        Tree parent = null;
        for (int i = 0; i < list.size(); i++) {
            metadatacategoryForm = list.get(i);
            tree = new Tree();
            tree.setId(metadatacategoryForm.getMetadatacategoryid().intValue());
            tree.setSeniorid(metadatacategoryForm.getSeniorid().intValue());
            tree.setName(metadatacategoryForm.getDisplayname());
            String state = metadatacategoryForm.getState();
            tree.setState(metadatacategoryForm.getState());
            tree.setBelongtofacman(metadatacategoryForm.getBelongtofacman());
            if (state.equals("leaf")) {
                tree.setIconCls("icon-leaf");
                tree.setIconSkin("icon_leaf");
            } else if (state.equals("group")) {
                tree.setIconCls("icon-group");
                tree.setIconSkin("icon_group");
            } else {
                tree.setIconCls("icon-root");
                tree.setIconSkin("icon_root");
            }
            tree.setIconCls("icon-parent");
            parent = treelist.get(metadatacategoryForm.getSeniorid().intValue());
            if (parent != null) {
                parent.getChildren().add(tree);
            } else {
                rlt.add(tree);
            }
            treelist.put(metadatacategoryForm.getMetadatacategoryid().intValue(), tree);
        }
        return rlt;
    }

    @Override
    public boolean saveMetadatacategoryData(HttpServletRequest request) {
        String id = request.getParameter("ID");
        String metadatacategoryid = request.getParameter("metadatacategoryid");
        String metaDataCategoryName = request.getParameter("metaDataCategoryName");
        String displayName = request.getParameter("displayName");
        String state = request.getParameter("state");
        String belongToFacMan = request.getParameter("belongToFacMan");
        String sql_update = null;
        if(state.equals("group") && belongToFacMan.equals("0")){
             sql_update = "update Metadatacategory t"
                    +" set t.belongToFacMan = 0 where t.id in (select id from Metadatacategory start"
                    +" with metadatacategoryid = "+metadatacategoryid+" connect by prior metadatacategoryid = seniorid)";
            metaclasspropertyDao.createQuery(sql_update).executeUpdate();
        }else if(state.equals("group") && belongToFacMan.equals("1")){
             sql_update = "update Metadatacategory t"
                    +" set t.belongToFacMan = 1 where t.id in (select id from Metadatacategory start"
                    +" with metadatacategoryid = "+metadatacategoryid+" connect by prior metadatacategoryid = seniorid)";
            metaclasspropertyDao.createQuery(sql_update).executeUpdate();
        }

        Metadatacategory entity = null;
        //准备VO对象
        if (StringUtils.isNotBlank(id)) {
            entity = metadatacategoryDao.get(Long.valueOf(id).longValue());
        } else {
            entity = new Metadatacategory();
            //seniorid与displayorder自曾1
            String sql = "select max(metadatacategoryid) as  maxId from Metadatacategory where 1=1";
            SQLQuery query = metadatacategoryDao.createSQLQuery(sql);
            query.addScalar("maxId", LongType.INSTANCE);
            Long maxId = (Long) query.uniqueResult();
            entity.setMetadatacategoryid(maxId + 1);
            String sql2 = "select max(displayorder) as  maxId2 from Metadatacategory where 1=1";
            SQLQuery query2 = metadatacategoryDao.createSQLQuery(sql);
            query2.addScalar("maxId", LongType.INSTANCE);
            Long maxId2 = (Long) query2.uniqueResult();
            entity.setDisplayorder(maxId2 + 1);
            entity.setSeniorid(Long.valueOf(metadatacategoryid).longValue());

        }
        entity.setMetadatacategoryname(metaDataCategoryName);
        entity.setDisplayname(displayName);
        entity.setState(state);
        entity.setBelongtofacman(belongToFacMan);
        //保存
        metadatacategoryDao.save(entity);
        return true;
    }

    @Override
    public List<MetadatacategoryForm> getMetadatacategoryData(HttpServletRequest request) {
        // 查询语句及参数
        Page<MetadatacategoryForm> page = new Page<MetadatacategoryForm>();
        StringBuffer hql = new StringBuffer("from Metadatacategory ps where 1=1");
        List values = new ArrayList();

        String metadatacategoryid = request.getParameter("metadatacategoryid");

        // 查询条件
        if (metadatacategoryid != null && metadatacategoryid != "") {
            hql.append(" and ps.metadatacategoryid = ? ");
            values.add(Long.valueOf(metadatacategoryid).longValue());
        }

        //排序
        hql.append(HqlUtils.buildOrderBy(page, "ps"));

        // 执行分页查询操作
        Page pg = metadatacategoryDao.findPage(page, hql.toString(), values);

        // 转换为Form对象列表并赋值到原分页对象中
        List<MetadatacategoryForm> list = MetadatacategoryConvertor.convertVoListToFormList(pg.getResult());
        return list;
    }

    @Override
    public boolean delMetadatacategoryData(HttpServletRequest request) {
        //批量删除树节点
        String id = request.getParameter("metadatacategoryid");
        String sql = "select * from METADATACATEGORY a " +
                "start with a.metadatacategoryid = "+Long.valueOf(id)+" connect by prior a.metadatacategoryid = a.seniorid";

        SQLQuery query=  metadatacategoryDao.createSQLQuery(sql);
        query.addEntity(Metadatacategory.class);
        List<Metadatacategory> list =  query.list();
        for(Metadatacategory metadatacategory : list) {
            if (metadatacategory.getState().equals("leaf")) {
                deleteMetatemplateclassData(metadatacategory.getMetadatacategoryid());
                deleteAboutMetadatatableData(metadatacategory.getMetadatacategoryid());
            }
        }
        metadatacategoryDao.delete(list);
        return true;
    }

    /**
     * 删除与设施分类相关的基类模板及其属性
     * @param metadatacategoryid
     * @return
     */
    public boolean deleteMetatemplateclassData(long metadatacategoryid){

        String hql = "from Metatemplateclass where metadatacategoryid = "+metadatacategoryid;
        List<Metatemplateclass> metatemplateclassList =metatemplateclassDao.find(hql);
        if(null != metatemplateclassList && metatemplateclassList.size()>0){
            for(Metatemplateclass metatemplateclass : metatemplateclassList){
                metatemplateclassDao.delete(metatemplateclass);
                if(metatemplateclass.getTemplateclassid() != null){
                    String hql1 = "from Metaclassproperty where templateclassid = "+metatemplateclass.getTemplateclassid();
                    List<Metaclassproperty> propertyList = metaclasspropertyDao.find(hql1);
                    if(propertyList.size()>0){
                        metaclasspropertyDao.delete(propertyList);
                    }
                }
            }
        }
        return true;
    }
    
	/**
	 * 删除与设施分类有关数据
	 * @param metadatacategoryid
	 * @return
	 */
	public boolean deleteAboutMetadatatableData(long metadatacategoryid){
		String hql = "from Metadatatable where metadatacategoryid="+metadatacategoryid;
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
				String tableNameStr = tablename.substring(index + 1, tablename.length());
                String exsisttablesql = "select table_name from all_tables where owner = '"+tableSpaceStr.toUpperCase()+"' and table_name = '"+tableNameStr.toUpperCase()+"'";
                Object tableobj = metadatatableDao.createSQLQuery(exsisttablesql).uniqueResult();
                String exsistsequencesql = "select sequence_name from dba_sequences where sequence_owner='"+tableSpaceStr.toUpperCase()+"' and sequence_name = 'SEQ_"+tableNameStr.toUpperCase()+"' ";
                Object sequenceobj = metadatatableDao.createSQLQuery(exsistsequencesql).uniqueResult();
                if(null != sequenceobj && !sequenceobj.toString().equals("")){
                    String dropSqSQL ="drop sequence "+tableSpaceStr+".SEQ_"+tableNameStr;
                    metadatatableDao.executeNonQuery(dropSqSQL);

                }
                if(null != tableobj && !tableobj.toString().equals("")){
                    String dropSQL ="drop table "+tablename;
                    metadatatableDao.executeNonQuery(dropSQL);
                }
			}
		}
		return true;
	}
}