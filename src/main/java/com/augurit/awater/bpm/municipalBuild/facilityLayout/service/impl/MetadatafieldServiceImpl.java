package com.augurit.awater.bpm.municipalBuild.facilityLayout.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import com.augurit.awater.bpm.municipalBuild.facilityLayout.convert.MetacodetypeConvertor;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.convert.MetadatafieldConvertor;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.dao.*;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metacodetype;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metadatafield;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metadatatable;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.service.IMetadatafieldService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetacodeitemForm;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetacodetypeForm;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetadatafieldForm;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
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
public class MetadatafieldServiceImpl implements IMetadatafieldService {


    @Autowired
    private MetadatafieldDao metadatafieldDao;

    @Autowired
    private MetacodetypeDao metacodetypeDao;

    @Autowired
    private MetacodeitemDao metacodeitemDao;

    @Autowired
    private MetadatatableDao metadatatableDao;

    /**
     * 根据主键获取Form对象
     */
    @Transactional(readOnly = true)
    public MetadatafieldForm get(Long id) {
        Metadatafield entity = metadatafieldDao.get(id);
        return MetadatafieldConvertor.convertVoToForm(entity);
    }

    /**
     * 删除Form对象列表
     */
    public void delete(Long... ids) {
        metadatafieldDao.delete(ids);
    }

    /**
     * 保存新增或修改的Form对象列表
     */
    public void save(MetadatafieldForm... forms) {
        if (forms != null)
            for (MetadatafieldForm form : forms)
                this.save(form);
    }

    /**
     * 保存新增或修改的Form对象
     */
    public void save(MetadatafieldForm form) {

        if (form != null) {
            Metadatafield entity = null;

            //准备VO对象
            if (form != null && form.getId() != null) {
                entity = metadatafieldDao.get(form.getId());
            } else {
                entity = new Metadatafield();
            }

            //属性值转换
            MetadatafieldConvertor.convertFormToVo(form, entity);

            //保存
            metadatafieldDao.save(entity);

            //回填ID属性值
            form.setId(entity.getId());
        }
    }

    /**
     * 根据Form对象的查询条件作分页查询
     */
    @Transactional(readOnly = true)
    public Page<MetadatafieldForm> search(Page<MetadatafieldForm> page, MetadatafieldForm form) {
        // 查询语句及参数
        StringBuffer hql = new StringBuffer("from Metadatafield ps where 1=1");
        Map<String, Object> values = new HashMap<String, Object>();

        // 查询条件
        if (form != null) {

        }

        //排序
        hql.append(HqlUtils.buildOrderBy(page, "ps"));

        // 执行分页查询操作
        Page pg = metadatafieldDao.findPage(page, hql.toString(), values);

        // 转换为Form对象列表并赋值到原分页对象中
        List<MetadatafieldForm> list = MetadatafieldConvertor.convertVoListToFormList(pg.getResult());
        PageUtils.copy(pg, list, page);
        return page;
    }

    /**
     * 根据过滤条件列表作分页查询
     */
    @Transactional(readOnly = true)
    public Page<MetadatafieldForm> search(Page<MetadatafieldForm> page, List<PropertyFilter> filters) {
        // 按过滤条件分页查找对象
        Page<Metadatafield> pg = metadatafieldDao.findPage(page, filters);

        // 转换为Form对象列表并赋值到原分页对象中
        List<MetadatafieldForm> list = MetadatafieldConvertor.convertVoListToFormList(pg.getResult());
        PageUtils.copy(pg, list, page);
        return page;
    }

    @Override
    public List getMetadatafieldData(HttpServletRequest request) {
        List metadatafieldList = new ArrayList();
        // 查询语句及参数
        StringBuffer righthql = new StringBuffer("from Metadatafield ps where 1=1 and ps.patrolfieldflag= 1");
        List rightValues = new ArrayList();

        String tableid = request.getParameter("tableid");

        // 查询条件
        if (tableid != null && !(tableid.equals(""))) {
            righthql.append(" and ps.tableid = ? ");
            rightValues.add(Long.valueOf(tableid).longValue());
        }
		//排序
        righthql.append(" order by ps.displayorder");
        // 执行查询操作
        List<Metadatafield> metadatafieldRightList = metadatafieldDao.find(righthql.toString(), rightValues);
        // 转换为Form对象列表中
        List<MetadatafieldForm> rightlist = MetadatafieldConvertor.convertVoListToFormList(metadatafieldRightList);
        metadatafieldList.add(rightlist);

        // 查询语句及参数
        StringBuffer leftHql = new StringBuffer("from Metadatafield ps where 1=1 and ps.patrolfieldflag= 0");
        List leftValues = new ArrayList();
        // 查询条件
        if (tableid != null && !(tableid.equals(""))) {
            leftHql.append(" and ps.tableid = ? ");
            leftValues.add(Long.valueOf(tableid).longValue());
        }
        //排序
        leftHql.append(" order by ps.displayorder");
        List<Metadatafield> metadatafieldLeftList = metadatafieldDao.find(leftHql.toString(), leftValues);
        // 转换为Form对象列表中
        List<MetadatafieldForm> LeftList = MetadatafieldConvertor.convertVoListToFormList(metadatafieldLeftList);
        metadatafieldList.add(LeftList);

        return metadatafieldList;
    }

    @Override
    public List getMetacodetypeData(HttpServletRequest request) {
        String hql = "from Metacodetype where seniorid > -1";
        List<Metacodetype> metacodetypeList = metacodetypeDao.find(hql);
        List<MetacodetypeForm> list = MetacodetypeConvertor.convertVoListToFormList(metacodetypeList);
        String tableHql  = " from Metadatatable where isDictionary = 1";
        List<Metadatatable> metadatatableList = metadatatableDao.find(tableHql);
        if(null != metadatatableList && metadatatableList.size()>0){
            for(Metadatatable metadatatable : metadatatableList){
                MetacodetypeForm metacodetypeForm = new MetacodetypeForm();
                metacodetypeForm.setTypecode(metadatatable.getTableid().toString());
                metacodetypeForm.setName(metadatatable.getDisplayname());
                metacodetypeForm.setIsTable(1l);
                list.add(metacodetypeForm);
            }
        }
        return list;
    }
    @Override
    public boolean saveFieldAttribute(HttpServletRequest request) {
//保存模板表结构定义模型
        String tableFieldList = request.getParameter("fields");
        String nodeid = request.getParameter("nodeid");
        List<Metadatafield> fieldList = new ArrayList<Metadatafield>();
        changeParrolfieldflag(nodeid);
        if (null != tableFieldList && !tableFieldList.equalsIgnoreCase("[]")) {
            //将字符串转成json数组
            JSONArray array = JSONArray.parseArray(tableFieldList);
            for (int i = 0; i < array.size(); i++) {
                JSONObject jo = array.getJSONObject(i);
                boolean isHasDiccode = jo.containsKey("diccode");
                Metadatafield field = metadatafieldDao.get(jo.getLong("id"));
                field.setFieldname(jo.getString("fieldname"));
                if((jo.containsKey("displayname"))==true){
                    field.setDisplayname(jo.getString("displayname"));
                }
                if((jo.containsKey("belongmetacodeitem"))==true ){
                  String metaitmeValue =  jo.getString("belongmetacodeitem");
                    if(!(metaitmeValue.equals("null"))) {
                        field.setBelongmetacodeitem(jo.getString("belongmetacodeitem"));
                    }
                }

                if((jo.containsKey("colspan"))==true){
                    field.setColspan(jo.getLong("colspan"));
                }
                if((jo.containsKey("editflag"))==true){
                    field.setEditflag(jo.getLong("editflag"));
                }
                if((jo.containsKey("validateid"))==true){
                    field.setValidateid(jo.getLong("validateid"));
                }
                if ((jo.containsKey("diccode"))==true){
                    field.setDiccode(jo.getString("diccode"));
                    field.setComponentid(jo.getLong("componentid"));
                } else if((jo.containsKey("componentid"))==true){
                    field.setComponentid(jo.getLong("componentid"));
                }
                if ((jo.containsKey("relateddiccode"))==true) {
                    field.setRelateddiccode(jo.getString("relateddiccode"));
                }
                if(jo.containsKey("relatedtablediccode")==true && jo.containsKey("relatedtabledicname")==true){
                    if(jo.containsKey("relatedtabletypecode") == true){
                        field.setRelatedtabletypecode(jo.getString("relatedtabletypecode"));
                    }
                    field.setRelatedtablediccode(jo.getString("relatedtablediccode"));
                    field.setRelatedtabledicname(jo.getString("relatedtabledicname"));
                }
                field.setPatrolfieldflag(0l);
                fieldList.add(field);
            }
            metadatafieldDao.save(fieldList);
        }
        return true;

    }
    /**
     * 保存前将Parrolfieldflag值修改成1
     * @param nodeid
     */
    public void changeParrolfieldflag(String nodeid){
        String sql = "update metadatafield set  patrolfieldflag =1 where tableid = "+nodeid;
        metadatafieldDao.executeNonQuery(sql);
    }

    /**
     * 获取数据字典项
     * @param request
     * @return
     */
    @Override
    public List getMetaCodeItem(HttpServletRequest request){
       String metacodename = request.getParameter("metacodename");
        String hql = "from Metacodeitem where typecode="+"'"+metacodename+"'";
        List<MetacodeitemForm> list = metacodeitemDao.find(hql);
        return list;
    }

    /**
     * 根据表名称获取表字段信息
     *
     * @param tablename 表名称
     * @return
     */
    @Override
    public List<Metadatafield> getTableFieldsByTablename(String tablename) {
        String hql1 = " from Metadatatable where tablename = '"+tablename+"'";
        List<Metadatatable> tableList = metadatatableDao.find(hql1);
        if(tableList.size()>0){
            String hql2 = " from Metadatafield where tableid = "+tableList.get(0).getTableid();
            List<Metadatafield> fieldList = metadatafieldDao.find(hql2);
            if(fieldList.size()>0){
                return fieldList;
            }
        }
        return new ArrayList<Metadatafield>();
    }

    /**
     * 根据表id获取表字段信息
     *
     * @param tableid 表id
     * @return
     */
    @Override
    public List<Metadatafield> getTableFieldsByTableid(String tableid) {
        String hql2 = " from Metadatafield where tableid = "+Long.valueOf(tableid);
        List<Metadatafield> fieldList = metadatafieldDao.find(hql2);
        return fieldList;
    }

    /**
     * 根据表状态标识获取表字段信息
     *
     * @param tablestatecode  表状态标识
     * @return
     */
    @Override
    public List<Metadatafield> getTableFieldsByTablestatecode (String tablestatecode ) {
        String hql1 = " from Metadatatable where tablestatecode = '"+tablestatecode +"'";
        List<Metadatatable> tableList = metadatatableDao.find(hql1);
        if(tableList.size()>0){
            String hql2 = " from Metadatafield where tableid = "+tableList.get(0).getTableid();
            List<Metadatafield> fieldList = metadatafieldDao.find(hql2);
            if(fieldList.size()>0){
                return fieldList;
            }
        }
        return new ArrayList<Metadatafield>();
    }

    /**
     * 根据类名称和属性名称获取表字段信息
     *
     * @param templateclassname 类名称
     * @param classpropertyname 属性名称
     * @return
     */
    @Override
    public List<Metadatafield> getFieldNameByTemplateclassnameAndClasspropertyname(String templateclassname, String classpropertyname) {
        String sql = String.format("select a.* from  metadatafield a, metatemplateclass b, metaclassproperty c  " +
                        "where b.templateclassname = '%s' and b.templateclassid = c.templateclassid" +
                        " and c.classpropertyname = '%s' and c.classpropertyid = a.classpropertyid"
                , templateclassname, classpropertyname);
        List<Metadatafield> fieldList = metadatafieldDao.createSQLQuery(sql).addEntity(Metadatafield.class).list();
        return fieldList;
    }
}