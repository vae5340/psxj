package com.augurit.awater.bpm.municipalBuild.facilityLayout.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.convert.MetacodetypeConvertor;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.dao.MetacodeitemDao;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.dao.MetacodetypeDao;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metacodeitem;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metacodetype;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.service.IMetacodetypeService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetacodetypeForm;
import com.augurit.awater.common.Tree;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.util.sql.HqlUtils;
import com.augurit.awater.util.file.PageUtils;
import com.augurit.awater.util.PropertyFilter;
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
public class MetacodetypeServiceImpl implements IMetacodetypeService {

    @Autowired
    private MetacodetypeDao metacodetypeDao;

    @Autowired
    private MetacodeitemDao metacodeitemDao;

    /**
     * 根据主键获取Form对象
     */
    @Transactional(readOnly = true)
    public MetacodetypeForm get(Long id) {
        Metacodetype entity = metacodetypeDao.get(id);
        return MetacodetypeConvertor.convertVoToForm(entity);
    }

    /**
     * 删除Form对象列表
     */
    public void delete(Long... ids) {
        metacodetypeDao.delete(ids);
    }

    /**
     * 保存新增或修改的Form对象列表
     */
    public void save(MetacodetypeForm... forms) {
        if (forms != null)
            for (MetacodetypeForm form : forms)
                this.save(form);
    }

    /**
     * 保存新增或修改的Form对象
     */
    public void save(MetacodetypeForm form) {

        if (form != null) {
            Metacodetype entity = null;

            //准备VO对象
            if (form != null && form.getId() != null) {
                entity = metacodetypeDao.get(form.getId());
            } else {
                entity = new Metacodetype();
            }

            //属性值转换
            MetacodetypeConvertor.convertFormToVo(form, entity);

            //保存
            metacodetypeDao.save(entity);

            //回填ID属性值
            form.setId(entity.getId());
        }
    }

    /**
     * 根据Form对象的查询条件作分页查询
     */
    @Transactional(readOnly = true)
    public Page<MetacodetypeForm> search(Page<MetacodetypeForm> page, MetacodetypeForm form) {
        // 查询语句及参数
        StringBuffer hql = new StringBuffer("from Metacodetype ps where 1=1");
        Map<String, Object> values = new HashMap<String, Object>();

        // 查询条件
        if (form != null) {

        }

        //排序
        hql.append(HqlUtils.buildOrderBy(page, "ps"));

        // 执行分页查询操作
        Page pg = metacodetypeDao.findPage(page, hql.toString(), values);

        // 转换为Form对象列表并赋值到原分页对象中
        List<MetacodetypeForm> list = MetacodetypeConvertor.convertVoListToFormList(pg.getResult());
        PageUtils.copy(pg, list, page);
        return page;
    }

    /**
     * 根据过滤条件列表作分页查询
     */
    @Transactional(readOnly = true)
    public Page<MetacodetypeForm> search(Page<MetacodetypeForm> page, List<PropertyFilter> filters) {
        // 按过滤条件分页查找对象
        Page<Metacodetype> pg = metacodetypeDao.findPage(page, filters);

        // 转换为Form对象列表并赋值到原分页对象中
        List<MetacodetypeForm> list = MetacodetypeConvertor.convertVoListToFormList(pg.getResult());
        PageUtils.copy(pg, list, page);
        return page;
    }

    @Override
    public List<Tree> getMetadictionaryTree() {
        String rootHql = "from Metacodetype where seniorid= -1";
        List<Metacodetype> metacodetypes = metacodetypeDao.find(rootHql);
        String idString = "";
        if(null != metacodetypes && metacodetypes.size()>0){
            for(Metacodetype type : metacodetypes){
                idString += type.getId()+",";
            }
            idString = idString.substring(0,idString.length()-1);
        }
        String sql = "select id,seniorid,name from metacodetype start with id in ("+idString+") connect by prior id = seniorid order by seniorid,id";
        // 查询条件
        SQLQuery query = metacodetypeDao.createSQLQuery(sql);
        query.addScalar("id", LongType.INSTANCE)
                .addScalar("seniorid", LongType.INSTANCE)
                .addScalar("name", StringType.INSTANCE);
        query.setResultTransformer(Transformers.aliasToBean(MetacodetypeForm.class));
        List<MetacodetypeForm> codetypeList = query.list();
        Map<Integer,Tree> treelist = new HashMap<Integer,Tree>();
        List<Tree> rlt = new ArrayList<Tree>();
        Tree tree = null;
        MetacodetypeForm metacodetypeForm = null;
        Tree parent = null;
        for(int i=0;i<codetypeList.size();i++){
            metacodetypeForm = codetypeList.get(i);
            tree = new Tree();
            tree.setId(metacodetypeForm.getId().intValue());
            tree.setSeniorid(metacodetypeForm.getSeniorid().intValue());
            tree.setName(metacodetypeForm.getName());
            tree.setIconCls("icon-children");
            if(metacodetypeForm.getSeniorid() == -1){
                tree.setIconSkin("icon_root");
            }else{
                tree.setIconSkin("icon_group");
            }
            parent = treelist.get(metacodetypeForm.getSeniorid().intValue());
            if(parent !=null){
                if(!parent.getSeniorid().equals("-1")){
                    parent.setIconSkin("icon_group");
                }
                parent.setIconCls("icon-parent");
                tree.setIconSkin("icon_leaf");
                parent.getChildren().add(tree);
            }else{
                if(metacodetypeForm.getSeniorid() != -1) {
                    tree.setIconSkin("icon_leaf");
                }
                rlt.add(tree);
            }
            treelist.put(metacodetypeForm.getId().intValue(),tree);
        }

        return rlt;
    }

    @Override
    public List getMetadictionaryData(String id) {
        List dictionaryList = new ArrayList();
        Metacodetype metacodetype = metacodetypeDao.find(Long.valueOf(id));
        if (null != metacodetype) {
            dictionaryList.add(metacodetype);
            String hql = " from Metacodeitem where typecode = '" + metacodetype.getTypecode() + "' order by sortno";
            List<Metacodeitem> itemList = metacodeitemDao.find(hql);
            if (null != itemList && itemList.size() > 0) {
                dictionaryList.add(itemList);
            }
        }

        return dictionaryList;
    }

    @Override
    public boolean saveMetadictionaryData(HttpServletRequest request) {
        String typecode = request.getParameter("typecode");
        String name = request.getParameter("name");
        String memo = request.getParameter("memo");
        String id = request.getParameter("id");
        String seniorid = request.getParameter("seniorid");
        Metacodetype metacodetype;
        if (null != id && !id.equals("")) {
            metacodetype = metacodetypeDao.find(Long.valueOf(id));
        } else {
            metacodetype = new Metacodetype();
        }
        metacodetype.setTypecode(typecode);
        metacodetype.setName(name);
        metacodetype.setMemo(memo);
        metacodetype.setSeniorid(Long.valueOf(seniorid));
        metacodetypeDao.save(metacodetype);

        String fieldList = request.getParameter("tableFieldList");
        List<Metacodeitem> itemList = new ArrayList<Metacodeitem>();
        if (null != fieldList && !fieldList.equalsIgnoreCase("[]")) {
            JSONArray array = JSONArray.parseArray(fieldList);
            for (int i = 0; i < array.size(); i++) {
                JSONObject json = array.getJSONObject(i);
                Metacodeitem item;
                if (json.getString("id") != null && !json.getString("id").equals("")) {
                    item = metacodeitemDao.find(Long.valueOf(json.getString("id")));
                } else {
                    item = new Metacodeitem();
                }
                item.setTypecode(metacodetype.getTypecode());
                item.setCode(json.getString("code"));
                item.setName(json.getString("name"));
                item.setSortno("".equals(json.getString("sortno"))?null:Long.valueOf(json.getString("sortno")));
                item.setMemo(json.getString("memo"));
                item.setParenttypecode(json.getString("parenttypecode"));
                item.setStatus(Long.valueOf(json.getString("status")));
                itemList.add(item);
            }
            metacodeitemDao.save(itemList);
        }
        return true;
    }

    @Override
    public boolean delMetadictionaryData(HttpServletRequest request) {
        String id = request.getParameter("id");
        String sql = "select * from METACODETYPE t start with t.id = "+Long.valueOf(id)+" connect by prior t.id = t.seniorid";
        SQLQuery query=  metacodetypeDao.createSQLQuery(sql);
        query.addEntity(Metacodetype.class);
        List<Metacodetype> list =  query.list();
        if (null != list && list.size()>0) {
            String typecodes = "";
            for(Metacodetype metacodetype : list){
                typecodes += "'"+metacodetype.getTypecode()+"',";
            }
            typecodes = typecodes.substring(0,typecodes.length()-1);
            if (!typecodes.equals("")) {
                String hql = " from Metacodeitem where typecode in (" + typecodes + ")";
                List<Metacodeitem> itemList = metacodeitemDao.find(hql);
                if (null != itemList && itemList.size() > 0) {
                    metacodeitemDao.delete(itemList);
                }
            }
            metacodetypeDao.delete(list);
        }
        return true;
    }

    @Override
    public boolean delMetaCodeitemData(HttpServletRequest request) {
        String ids = request.getParameter("ids");
        String hql = " from Metacodeitem where id in (" + ids + ")";
        List<Metacodeitem> itemList = metacodeitemDao.find(hql);
        if (null != itemList && itemList.size() > 0) {
            metacodeitemDao.delete(itemList);
        }
        return true;
    }

    /**
     * 根据字典类型编码获取字典项
     *
     * @param typecode
     * @return
     */
    @Override
    public List<Metacodeitem> getDicdataByTypecode(String typecode) {
        List<Metacodeitem> itemList = new ArrayList<Metacodeitem>();
        if (null != typecode) {
            String hql = " from Metacodeitem where status = 1 and typecode = '" + typecode + "' order by sortno";
            itemList = metacodeitemDao.find(hql);
        }
        return itemList;
    }

    @Override
    public Metacodeitem getMetacodeitemByTypeCodeAndCode(String typecode, String code) {
        List<Metacodeitem> itemList = new ArrayList<Metacodeitem>();
        if (null != typecode) {
            String hql = " from Metacodeitem where typecode = '" + typecode + "' and code = '"+code+"'";
            itemList = metacodeitemDao.find(hql);
            if(itemList.size()>0){
                return itemList.get(0);
            }
        }
        return null;
    }

    /**
     * 根据字典类型编码获取字典信息
     *
     * @param typecode
     * @return
     */
    @Override
    public Metacodetype getMetacodetypeBytypecode(String typecode) {
        if (null != typecode && !typecode.equals("")) {
            String hql = " from Metacodetype where typecode = '" + typecode + "'";
            List<Metacodetype> metacodetype = metacodetypeDao.find(hql);
            if (metacodetype.size() > 0) {
                return metacodetype.get(0);
            }
        }
        return new Metacodetype();
    }

    /**
     * 根据字典类型编码用like方式获取字典信息
     *
     * @param typecode
     * @return
     */
    @Override
    public List<Metacodetype> getMetacodetypeListBytypecode(String typecode) {
        List<Metacodetype> metacodetype = new ArrayList();
        if (null != typecode && !typecode.equals("")) {
            metacodetype = metacodetypeDao.find(" from Metacodetype where typecode like '%" + typecode + "%'");
        }
        return metacodetype;
    }
}