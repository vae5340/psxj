package com.augurit.awater.bpm.file.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.augurit.awater.bpm.file.convert.SysFileConverter;
import com.augurit.awater.bpm.file.dao.DynamictableDao;
import com.augurit.awater.bpm.file.dao.SysFileDao;
import com.augurit.awater.bpm.file.dao.SysFileLinkDao;
import com.augurit.awater.bpm.file.entity.SysFile;
import com.augurit.awater.bpm.file.entity.SysFileLink;
import com.augurit.awater.bpm.file.service.IDynamictableService;
import com.augurit.awater.bpm.file.web.form.SysFileForm;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.convert.MetadatatableConvertor;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.dao.MetacodeitemDao;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.dao.MetadatafieldDao;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.dao.MetadatatableDao;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metacodeitem;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metacodetype;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metadatafield;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metadatatable;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.service.IMetacodetypeService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetadatacategoryForm;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetadatatableForm;
import com.augurit.awater.common.Tree;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.util.sql.HqlUtils;
import com.augurit.awater.util.file.PageUtils;
import com.augurit.awater.util.PropertyFilter;
import com.google.gson.Gson;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.sql.Clob;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Transactional
public class DynamictableServiceImpl implements IDynamictableService {


    @Autowired
    private DynamictableDao dynamictableDao;

    @Autowired
    private MetadatatableDao metadatatableDao;

    @Autowired
    private MetacodeitemDao metacodeitemDao;

    @Autowired
    private MetadatafieldDao metadatafieldDao;

    @Autowired
    private IMetacodetypeService metacodetypeService;

    @Value("${cs.srid}")
    private String srid;

    @Value("${filePath}")
    private String filePath;

    @Autowired
    private SysFileDao sysFileDao;

    @Autowired
    private SysFileLinkDao sysFileLinkDao;

    private List<Metadatafield> searchfieldlist = new ArrayList<Metadatafield>();
    private JSONObject search_json = null;
    private String formdata = null;

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
        if (forms != null)
            for (MetadatatableForm form : forms)
                this.save(form);
    }

    /**
     * 保存新增或修改的Form对象
     */
    public void save(MetadatatableForm form) {

        if (form != null) {
            Metadatatable entity = null;

            //准备VO对象
            if (form != null && form.getId() != null) {
                entity = metadatatableDao.get(form.getId());
            } else {
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
        Map<String, Object> values = new HashMap<String, Object>();

        // 查询条件
        if (form != null) {

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

    /**
     * 获取表单字段
     *
     * @return
     */
    @Override
    public List getEditFormFields(HttpServletRequest request) {
        String tablename = request.getParameter("tablename");
        String tableid = request.getParameter("tableid");
        String id = request.getParameter("id");
        List list = new ArrayList();
        //获取表相关信息
        Metadatatable table = null;
        if (null != tableid) {
            table = getMetadatatableByTableid(tableid);
        } else {
            table = getMetadatatableByTablename(tablename);
        }
        list.add(table);
        //获取表单字段
        List<Metadatafield> metadatafields = getMetadatafields(table.getTableid());
        list.add(metadatafields);
        //存储数据字典list
        List<Map> dicList = new ArrayList<Map>();
        Map<String, List> map = new HashMap<String, List>();
        String sql = "select ";
        String condition_sql = " where 1=1";
        for (Metadatafield field : metadatafields) {
            if (null != field.getComponentid()) {
                //控件类型为下拉框时，根据字典编码查询数据字典
                if (field.getComponentid() == 0 || field.getComponentid() == 3 || field.getComponentid() == 5) {
                    if(null == field.getRelatedtablediccode() || field.getRelatedtablediccode().equals("")) {
                        List<Metacodeitem> items = metacodeitemDao.find(" from Metacodeitem where status = 1 and typecode = '" + field.getDiccode() + "'");
                        map.put(field.getFieldname(), items);
                    }else{
                        String tableHql = "select tablename from metadatatable where tableid="+field.getDiccode();
                        Object tablenameObj = dynamictableDao.createSQLQuery(tableHql).uniqueResult();
                        if(null != tablenameObj && !tablenameObj.toString().equals("")) {
                            map.put(field.getFieldname(), getTableDicList(field.getRelatedtablediccode(),field.getRelatedtabledicname(),tablenameObj.toString(),null,null));
                        }
                    }
                }
            }
            sql += field.getFieldname() + ",";
            if (null != id && !id.equals("")) {
                if (null != field.getPrimarykeyfieldflag()) {
                    if (field.getPrimarykeyfieldflag() == 1) {
                        condition_sql += " and " + field.getFieldname() + " = " + Long.valueOf(id);
                    }
                }
            }
        }
        dicList.add(map);
        list.add(dicList);
        sql = sql.substring(0, sql.length() - 1) + " from " + table.getTablename();
        //id不为空时，根据id查询相关数据
        if (null != id && !id.equals("")) {
            Object obj = dynamictableDao.createSQLQuery(sql + condition_sql).uniqueResult();
            Object[] objAry = (Object[])obj;
            for (int i = 0;i<objAry.length;i++) {
                if(metadatafields.get(i).getDatatypename().contains("CLOB")){
                    if(null != objAry[i] && !objAry[i].toString().equals("")){
                        Clob clob = (Clob)objAry[i];
                        objAry[i] = exchangeClobToString(clob);
                    }
                }
            }
            list.add(obj);
            List<SysFile> fileList = (List<SysFile>) loadFilelist(id,table.getTablename(),table.getTableid().toString(),request);
            if (null != fileList && fileList.size() > 0) {
                list.add(fileList);
            }
        }
        return list;
    }

    private List<Metacodeitem> getTableDicList(String relatedcode,String relatedname,String tablename,String relatedtypecode,String parenttypecode){
        List<Metacodeitem> items = new ArrayList<Metacodeitem>();
        String dicSql = "select " + relatedcode + "," + relatedname +
                " from "+tablename.toString();
        if(null != relatedtypecode && null != parenttypecode){
            dicSql += " where "+relatedtypecode+"='"+parenttypecode+"'";
        }
        SQLQuery query = dynamictableDao.createSQLQuery(dicSql);
        List dictableList = query.list();
        for (int i = 0; i < dictableList.size(); i++) {
            Object obj = dictableList.get(i);
            Object[] objAry = (Object[]) obj;
            Metacodeitem item = new Metacodeitem();
            if(null != objAry[0] && null != objAry[1]){
                item.setCode(objAry[0].toString());
                item.setName(objAry[1].toString());
            }
            items.add(item);
        }
        return items;
    }

    private String exchangeClobToString(Clob clob) {
        String reString = "";
        Reader is = null;// 得到流
        try {
            if(null != clob){
                is = clob.getCharacterStream();
            }
            if(null != is){
                BufferedReader br = new BufferedReader(is);
                String s = br.readLine();
                StringBuffer sb = new StringBuffer();
                while (s != null) {// 执行循环将字符串全部取出付值给StringBuffer由StringBuffer转成STRING
                    sb.append(s);
                    s = br.readLine();
                }
                reString = sb.toString();

            }
         } catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        return reString;
    }

    /**
     * 保存表单数据
     *
     * @param request
     * @return
     */
    @Override
    public String saveDynamictableData(HttpServletRequest request) {
        String return_key = "";
        String tablename = request.getParameter("tablename");
        String tableid = request.getParameter("tableid");
        String formData = request.getParameter("formData");
        String x = request.getParameter("x");
        String y = request.getParameter("y");
        String wkt = request.getParameter("wkt");
        JSONObject json = JSONObject.parseObject(formData);
        Metadatatable table = null;
        if (null != tableid) {
            table = getMetadatatableByTableid(tableid);
        } else {
            table = getMetadatatableByTablename(tablename);
        }
        if (table.getTabletype() == 1) {
            if (null != x && null != y) {
                wkt = "POINT(" + x + " " + y + ")";
            }
        }
        //新增操作sql语句
        String add_sql = "insert into " + table.getTablename() + " (";
        //修改操作sql语句
        String update_sql = "update " + table.getTablename() + " set ";
        //根据id执行修改操作
        String update_condition = " where ";
        //新增操作插入数据
        String values = "values(";
        if (null != wkt && !wkt.equals("")) {
            String srid_sql = " select auth_srid from sde.spatial_references where srid = " + Long.valueOf(srid);
            Object obj = dynamictableDao.createSQLQuery(srid_sql).uniqueResult();
            if(null != obj && !obj.toString().equals("")){
                int st_srid = Integer.parseInt(obj.toString());
                update_sql += " SHAPE=sde.st_geometry('" + wkt + "'," + st_srid + "),";
                values += "sde.st_geometry('" + wkt + "'," + st_srid+ "),";
            }
            add_sql += "SHAPE,";


        }
        //根据表id获取表单字段以及主键字段
        List<Metadatafield> metadatafields = getMetadatafields(table.getTableid());
        //新增或修改操作标识
        String opt = "add";
        for (Metadatafield metadatafield : metadatafields) {
            //字段不是主键且前端传递参数包含该字段
            if (metadatafield.getPrimarykeyfieldflag() != 1 && json.containsKey(metadatafield.getFieldname()) && null != json.getString(metadatafield.getFieldname())) {
                add_sql += metadatafield.getFieldname() + ",";
                if (null != metadatafield.getComponentid() && metadatafield.getComponentid() == 3) {
                    String checkboxValue = json.getString(metadatafield.getFieldname());
                    String ss = "";
                    if (checkboxValue.indexOf("[") == -1 || checkboxValue.indexOf("]") == -1) {
                        ss = checkboxValue;
                    } else {
                        checkboxValue = checkboxValue.substring(checkboxValue.indexOf("[") + 1, checkboxValue.indexOf("]"));
                        String[] strAry = checkboxValue.split(",");

                        for (String str : strAry) {
                            ss += str.substring(str.indexOf("\"") + 1, str.lastIndexOf("\"")) + ",";
                        }
                        ss = ss.substring(0, ss.length() - 1);
                    }
                    update_sql += metadatafield.getFieldname() + "= '" + ss + "',";
                    values += "'" + ss + "',";
                } else if (metadatafield.getDatatypename().equalsIgnoreCase("Integer")) {
                    if(!json.getString(metadatafield.getFieldname()).equals("")){
                        update_sql += metadatafield.getFieldname() + "=" + Integer.parseInt(json.getString(metadatafield.getFieldname())) + ",";
                        values += Integer.parseInt(json.getString(metadatafield.getFieldname())) + ",";
                    }else{
                        update_sql += metadatafield.getFieldname() + "= null,";
                        values += "null,";
                    }

                } else if (metadatafield.getDatatypename().equalsIgnoreCase("number")) {
                    String str = "";
                    if (json.getString(metadatafield.getFieldname()).equals("")) {
                        str = "''";
                    } else {
                        str = "to_number('" + json.getString(metadatafield.getFieldname()) + "')";

                    }
                    update_sql += metadatafield.getFieldname() + "= " + str + ",";
                    values += str + ",";

                } else if (metadatafield.getDatatypename().equalsIgnoreCase("date") || metadatafield.getDatatypename().toUpperCase().contains("TIMESTAMP")) {
                    update_sql += metadatafield.getFieldname() + "= to_date('" + json.getString(metadatafield.getFieldname()) + "','yyyy-MM-dd HH24:mi:ss'),";
                    values += "to_date('" + json.getString(metadatafield.getFieldname()) + "','yyyy-MM-dd HH24:mi:ss'),";
                } else {
                    update_sql += metadatafield.getFieldname() + "= '" + json.getString(metadatafield.getFieldname()) + "',";
                    values += "'" + json.getString(metadatafield.getFieldname()) + "',";
                }
            }
            //字段为主键
            else if (metadatafield.getPrimarykeyfieldflag() == 1) {
                add_sql += metadatafield.getFieldname() + ",";
                Object id;
                //id不为空，表示是修改操作
                if (null != json.getString(metadatafield.getFieldname()) && !json.getString(metadatafield.getFieldname()).equals("")) {
                    id = json.getString(metadatafield.getFieldname());
                    opt = "update";
                    update_condition += metadatafield.getFieldname() + "= " + Long.valueOf(id.toString());
                }
                //id为空，则查询序列号插入id
                else {
                    String idsql = "";
                    if (null != wkt && !wkt.equals("")) {
                        idsql = " select max(" + metadatafield.getFieldname() + ") from " + table.getTablename();
                    } else {
                        idsql = " select " + table.getTablename().split("\\.")[0].toUpperCase() + ".SEQ_" + table.getTablename().split("\\.")[1].toUpperCase() + ".nextval from dual";
                    }
                    id = dynamictableDao.createSQLQuery(idsql).uniqueResult();
                    if (null == id || id.toString().equals("")) {
                        id = 1;
                    }
                    id = Long.valueOf(id.toString()) + 1;
                    values += (id) + ",";
                }
                return_key = id.toString();
            }
            json.remove(metadatafield.getFieldname());
        }
        if(null != json && json.size()>0){
            Iterator<String> sIterator = json.keySet().iterator();
            while(sIterator.hasNext()){
                // 获得key
                String key = sIterator.next();
                List<Metadatafield> keyList = metadatafieldDao.find(" from Metadatafield where fieldname='" + key + "' and tableid=" + table.getTableid());
                Metadatafield valueFiled = new Metadatafield();
                if(null != keyList && keyList.size()>0){
                    valueFiled = keyList.get(0);
                }
                // 根据key获得value, value也可以是JSONObject,JSONArray,使用对应的参数接收即可
                String value = json.getString(key);
                add_sql += key+",";
                if(valueFiled.getDatatypename().equalsIgnoreCase("date")){
                    values += "to_date('" + value + "','yyyy-MM-dd HH24:mi:ss'),";
                    update_sql += key +"= to_date('" + value + "','yyyy-MM-dd HH24:mi:ss'),";
                }else{
                    values += "'"+value+"',";
                    update_sql += key +"='"+value+"',";
                }
            }
        }
        add_sql = add_sql.substring(0, add_sql.length() - 1) + ") " + values.substring(0, values.length() - 1) + ")";
        update_sql = update_sql.substring(0, update_sql.length() - 1) + update_condition;
        int flag = 0;
        if (opt.equals("add")) {
            flag = dynamictableDao.executeNonQuery(add_sql);
        } else {
            flag = dynamictableDao.executeNonQuery(update_sql);
        }
        return return_key;
    }

    /**
     * 删除表数据
     *
     * @param request
     * @return
     */
    @Override
    public boolean deleteDynamictableData(HttpServletRequest request) {
        String ids = request.getParameter("ids");
        String tablename = request.getParameter("tablename");
        String tableid = request.getParameter("tableid");
        try {
            //获取表相关信息
            Metadatatable table = null;
            if (null != tableid) {
                table = getMetadatatableByTableid(tableid);
            } else {
                table = getMetadatatableByTablename(tablename);
            }
            if(table.getHasfile() == 1){
                String filelink_sql = "select * from sys_file_link where upper(entity) = '"+table.getTablename().toUpperCase()+"'";
                SQLQuery query = sysFileDao.createSQLQuery(filelink_sql);
                query.addEntity(SysFileLink.class);
                List<SysFileLink> sysFileLinkList = query.list();

                if(null != sysFileLinkList && sysFileLinkList.size()>0){
                    Long[] sysFileIds = new Long[sysFileLinkList.size()];
                    for(int i = 0;i<sysFileLinkList.size();i++){
                        sysFileIds[i] = sysFileLinkList.get(i).getSysFileId();
                    }
                    deleteFile(sysFileIds);
                }

            }
            String sql = "delete from " + table.getTablename();
            List<Metadatafield> metadatafields = getMetadatafields(table.getTableid());
            for (Metadatafield field : metadatafields) {
                if (field.getPrimarykeyfieldflag() == 1) {
                    sql += " where " + field.getFieldname() + " in (" + ids + ")";
                    break;
                }
            }
            int flag = dynamictableDao.executeNonQuery(sql);
            if (flag > 0) {
                return true;
            }
        } catch (RuntimeException e) {
        	 throw new RuntimeException(e);
        }
        return false;
    }

    /**
     * 根据tableid获取表单字段以及主键
     *
     * @param tableid
     * @return
     */
    private List<Metadatafield> getMetadatafields(Long tableid) {
        String hql = " from Metadatafield where (primarykeyfieldflag =1  or  patrolfieldflag = 0) and tableid = " + tableid + " order by primarykeyfieldflag desc,colspan,displayorder";
        List<Metadatafield> metadatafields = metadatafieldDao.find(hql);
        return metadatafields;
    }

    /**
     * 根据表名获取表信息
     *
     * @param tablename
     * @return
     */
    @Override
    public Metadatatable getMetadatatableByTablename(String tablename) {
        if(null != tablename) {
            String hql = " from Metadatatable where upper(tablename) = '" + tablename.toUpperCase() + "'";
            List<Metadatatable> metadatatables = metadatafieldDao.find(hql);
            return metadatatables.get(0);
        }
        return null;
    }

    /**
     * 根据字典类型编码以及父类字典项编码获取字典项列表
     *
     * @param typecode
     * @param parenttypecode
     * @return
     */
    @Override
    public List<Metacodeitem> getRelatedDicitem(String typecode, String parenttypecode,String relatedFieldname,String tableid) {

        if(StringUtils.isNotBlank(typecode) && StringUtils.isNotBlank(parenttypecode)){
            List<Metacodeitem> metacodeitemList = null;
            Pattern pattern = Pattern.compile("[0-9]*");
            Matcher isNum = pattern.matcher(typecode);
            Metadatatable metadatatable = null;
            if(isNum.matches() ) {
                metadatatable = getMetadatatableByTableid(typecode);
            }
            if(null != metadatatable){
                Metadatatable table = getMetadatatableByTableid(tableid);
                List<Metadatafield> metadatafieldList = metadatafieldDao.find(" from Metadatafield where tableid="+tableid+" and fieldname='"+relatedFieldname+"'");
                if(null != metadatafieldList && metadatafieldList.size()==1){
                    String relatedcode = metadatafieldList.get(0).getRelatedtablediccode();
                    String relatedname = metadatafieldList.get(0).getRelatedtabledicname();
                    String relatedtypecode = metadatafieldList.get(0).getRelatedtabletypecode();
                    metacodeitemList = getTableDicList(relatedcode,relatedname,metadatatable.getTablename(),relatedtypecode,parenttypecode);
                }
            }else{
                String hql = " from Metacodeitem where status = 1 and typecode = '"+typecode+"' and parenttypecode = '"+parenttypecode+"'";
                metacodeitemList = metacodeitemDao.find(hql);
            }

            return metacodeitemList;
        }
        return null;
    }

    /**
     * 根据表名获取表信息
     *
     * @param tableid
     * @return
     */
    @Override
    public Metadatatable getMetadatatableByTableid(String tableid) {
        String hql = " from Metadatatable where tableid = '" + tableid + "'";
        List<Metadatatable> metadatatables = metadatafieldDao.find(hql);
        return metadatatables.get(0);
    }

    /**
     * 获取模板结构管理配置的动态表列表显示数据
     *
     * @param request
     * @return
     */
    @Override
    public List getDynamicTableData(HttpServletRequest request) {
        String idString = request.getParameter("idString");
        StringBuffer dynamicTableData_sql2 = null;
        StringBuffer rowsSql = null;
        List list = new ArrayList();//存放表头数据和表数据
        formdata = request.getParameter("formData");
        int pageSize = Integer.parseInt(request.getParameter("pageSize"));
        int pageNumber = Integer.parseInt(request.getParameter("pageNumber"));
        String tableId = request.getParameter("tableid");
        String tablename = request.getParameter("tablename");
        String orderbyparam = request.getParameter("orderbyparam");
        String orderasc = request.getParameter("orderasc");
        String primarykeyfield = null;
        //获取实体，通过实体获取tableid方便下一步查询做数据
        Metadatatable entity = null;
        if (null != tableId) {
            entity = getMetadatatableByTableid(tableId);
        } else {
            entity = getMetadatatableByTablename(tablename);
        }
        if(null != entity) {
            if(queTableExist(entity.getTablename())) {
                Long tableid = entity.getTableid();
                String metadatafield_search_hql = "from Metadatafield t where t.tableid = " + tableid + " order by primarykeyfieldflag desc,colspan,displayorder";
                List<Metadatafield> metadatafieldlist = metadatafieldDao.find(metadatafield_search_hql);
                if(null == metadatafieldlist || metadatafieldlist.size()==0){
                    return list;
                }
                list.add(entity);
                List<Metadatafield> listForm = new ArrayList<Metadatafield>();
                searchfieldlist = new ArrayList<Metadatafield>();
                for (Metadatafield metadatafield : metadatafieldlist) {
                    if (metadatafield.getListfieldflag() == 1 || metadatafield.getPrimarykeyfieldflag() == 1) {
                        listForm.add(metadatafield);
                    }
                    if (metadatafield.getQueryfieldflag() == 1) {
                        searchfieldlist.add(metadatafield);
                    }
                    if(metadatafield.getPrimarykeyfieldflag() == 1){
                        primarykeyfield = metadatafield.getFieldname();
                    }
                }
                list.add(listForm);

                //存储数据字典list
                List<Map> dicList = new ArrayList<Map>();
                Map<String, List<Metacodeitem>> dicmap = new HashMap<String, List<Metacodeitem>>();
                String diccodestr = "";
                for (Metadatafield field : metadatafieldlist) {
                    if (null != field.getComponentid()) {
                        //控件类型为下拉框时，根据字典编码查询数据字典
                        if (field.getComponentid() == 0 || field.getComponentid() == 3 || field.getComponentid() == 5) {
                            if(null != field.getRelatedtablediccode() && !field.getRelatedtablediccode().equals("")){
                                Metadatatable table = getMetadatatableByTableid(field.getDiccode());
                                dicmap.put(field.getDiccode(), getTableDicList(field.getRelatedtablediccode(),field.getRelatedtabledicname(),table.getTablename(),null,null));
                            }else{
                                String items_hql = "from Metacodeitem where status = 1 and typecode ='"+field.getDiccode()+"'";
                                List<Metacodeitem> items = metacodeitemDao.find(items_hql);
                                dicmap.put(field.getDiccode(),items);
                            }
                        }
                    }
                }
                dicList.add(dicmap);
                list.add(dicList);

                //查询列表字段数据
                String fieldname = "";
                for (int i = 0; i < listForm.size(); i++) {
                    fieldname += listForm.get(i).getFieldname() + ",";
                }
                if (entity.getTabletype() == 1) {
                    fieldname += "sde.st_astext(shape) as wkt,";
                }
                fieldname = fieldname.substring(0, fieldname.length() - 1);
                if(StringUtils.isNotBlank(orderbyparam)&&StringUtils.isNotBlank(orderasc)){
                    dynamicTableData_sql2 = new StringBuffer("select " + fieldname + " from" + "(SELECT t1.*,ROWNUM rn FROM (select t.* from "
                            + entity.getTablename() + " t  where 1=1 order by "+orderbyparam +" "+orderasc+" ) t1 where 1=1");
                }else{
                    dynamicTableData_sql2 = new StringBuffer("select " + fieldname + " from" + "(SELECT t1.*,ROWNUM rn FROM (select t.* from " + entity.getTablename() + " t  where 1=1                     order by "+primarykeyfield +" desc ) t1 where 1=1 ");

                }
                rowsSql = new StringBuffer("select count(*) from " + entity.getTablename() + " where 1=1");
                if(StringUtils.isNotBlank(idString)){
                    dynamicTableData_sql2.append(" and id in ("+idString+")");
                    rowsSql.append(" and id in ("+idString+")");
                }
                search_json = new JSONObject();
                //拼接勾选查询条件字段
                if (StringUtils.isNotBlank(formdata) && !(formdata.equals("{}")) && !(formdata.equals(""))) {
                    search_json = JSONObject.parseObject(formdata);
                    for (int j = 0; j < searchfieldlist.size(); j++) {
                        if (search_json.containsKey(searchfieldlist.get(j).getFieldname()) && StringUtils.isNotBlank(search_json.getString(searchfieldlist.get(j).getFieldname()))) {
                            String fieldvalue = search_json.getString(searchfieldlist.get(j).getFieldname());
                            if (!(fieldvalue.equals(""))) {
                                if (searchfieldlist.get(j).getDatatypename().equalsIgnoreCase("DATE")) {
                                    dynamicTableData_sql2.append(" and to_char(" + searchfieldlist.get(j).getFieldname() + ",'yyyy-mm-dd') =" + "'" + fieldvalue + "'");
                                    rowsSql.append(" and to_char(" + searchfieldlist.get(j).getFieldname() + ",'yyyy-mm-dd') =" + "'" + fieldvalue + "'");
                                } else if (searchfieldlist.get(j).getDatatypename().equalsIgnoreCase("NUMBER")) {
                                    dynamicTableData_sql2.append(" and " + searchfieldlist.get(j).getFieldname() + " = '" + fieldvalue + "'");
                                    rowsSql.append(" and " + searchfieldlist.get(j).getFieldname() + " = '" + fieldvalue + "'");
                                } else {
                                    dynamicTableData_sql2.append(" and upper(" + searchfieldlist.get(j).getFieldname() + ") like '%" + fieldvalue.toUpperCase() + "%'");
                                    rowsSql.append(" and upper(" + searchfieldlist.get(j).getFieldname() + ") like '%" + fieldvalue.toUpperCase() + "%'");
                                }
                            }
                        }
                        search_json.remove(searchfieldlist.get(j).getFieldname());
                    }
                }
                if(null != search_json && search_json.size()>0){
                    Iterator<String> sIterator = search_json.keySet().iterator();
                    while(sIterator.hasNext()){
                        // 获得key
                        String key = sIterator.next();
                        // 根据key获得value, value也可以是JSONObject,JSONArray,使用对应的参数接收即可
                        String value = search_json.getString(key);
                        dynamicTableData_sql2.append(" and " + key + " = '" + value + "'");
                        rowsSql.append(" and " + key + " = '" + value + "'");
                    }
                }
                Object rows = dynamictableDao.createSQLQuery(rowsSql.toString()).uniqueResult();
                int rowsnum = Integer.parseInt(rows.toString());
                dynamicTableData_sql2.append(") ");
                if (pageNumber != 0 && pageSize != 0) {
                    dynamicTableData_sql2.append(" where 1=1 and rn >= " + ((pageNumber - 1) * pageSize + 1) + " AND rn <= " + ((pageNumber - 1) * pageSize + pageSize));
                }

                List dynamicTableDataList = dynamictableDao.createSQLQuery(dynamicTableData_sql2.toString()).list();
                for (int j = 0;j<dynamicTableDataList.size();j++) {
                    Object[] objAry = (Object[]) dynamicTableDataList.get(j);
                    for(int i = 0;i<objAry.length-1;i++) {
                        if (listForm.get(i).getDatatypename().contains("CLOB")) {
                            if (null != objAry[i] && !objAry[i].toString().equals("")) {
                                Clob clob = (Clob) objAry[i];
                                objAry[i] = exchangeClobToString(clob);
                            }
                        }
                    }
                }
                if (entity.getTabletype() == 1) {
                    for (Object obj : dynamicTableDataList) {
                        Object[] array = (Object[]) obj;
                        Clob clob = (Clob) array[array.length - 1];
                        array[array.length - 1] = exchangeClobToString(clob);
                    }
                }
                Map map2 = new HashMap();
                map2.put("total", rowsnum);
                map2.put("rows", dynamicTableDataList);
                list.add(map2);
                list.add(searchfieldlist);
            }
        }
        return list;
    }

    @Override
    public boolean queTableExist(String tablename) {
        if(null != tablename && !tablename.equals("")){
            String sql = "select * from all_all_tables where owner = '"+tablename.split("\\.")[0].toUpperCase()+"' and table_name = '"+tablename.split("\\.")[1].toUpperCase()+"'";
            List list = dynamictableDao.createSQLQuery(sql).list();
            if(null != list && list.size()>0){
                return true;
            }else{
                //视图
                sql = "select * from all_views where owner = '"+tablename.split("\\.")[0].toUpperCase()+"' and view_name = '"+tablename.split("\\.")[1].toUpperCase()+"'";
                list = dynamictableDao.createSQLQuery(sql).list();
                if(null != list && list.size()>0){
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 获取导出Excel数据库数据
     *
     * @param request
     * @param response
     * @return
     */
    @Override
    public void getExportDynamicTableData(HttpServletRequest request, HttpServletResponse response) throws Exception {
        //通过获取表名称获取tableid
        String tname = request.getParameter("tablename");
        String tableid = null;
        if(StringUtils.isNotBlank(tname)&&!tname.equals("")){
            String gettableid_sql = "select tableid from metadatatable where upper(tablename) = "+"'"+tname.toUpperCase()+"'";
            tableid = dynamictableDao.createSQLQuery(gettableid_sql).list().get(0).toString();
//            tableid =  list1.get(0).toString();
        }else{
            tableid = request.getParameter("tableid");
        }
        //通过tableid获取表字段名称
        //前端传入一个exportflag参数，参数值为"0"时，默认导出列表字段，否则导出数据库所有字段。
        String exportflag = request.getParameter("exportflag");
        String sql_fieldname_disname = null;
        if (exportflag.equals("0")) {
            sql_fieldname_disname = "select displayname, fieldname,componentid,diccode from metadatafield where tableid = " + tableid + " and listfieldflag =1 order by primarykeyfieldflag desc,colspan,displayorder";
        } else {
            sql_fieldname_disname = "select displayname, fieldname,componentid,diccode from metadatafield where tableid = " + tableid + " order by primarykeyfieldflag desc,colspan,displayorder";
        }
        String sql_tablename_tabledisname = "select tablename,displayname from metadatatable where tableid =" + tableid;

        String diccode_sql = "select diccode from metadatafield where diccode is not null and tableid =" + tableid + "group by(diccode)";

        //组装存放数据字典项的map
        List list = dynamictableDao.createSQLQuery(diccode_sql).list();
        Map<String, Map> dicmap = new HashMap<String, Map>();
        if (list.size() != 0) {
            String diccodestr = "";
            for (int i = 0; i < list.size(); i++) {
                String diccode = list.get(i).toString();
                dicmap.put(diccode, new HashMap<String, String>());
                diccodestr += "'" + list.get(i).toString() + "',";
            }
            diccodestr = diccodestr.substring(0, diccodestr.length() - 1);
            String dicitem_hql = "from Metacodeitem where status = 1 and typecode in (" + diccodestr + ")";
            List<Metacodeitem> metacodeitems = dynamictableDao.find(dicitem_hql);
//组装数据字典code和name值的map
            for (Metacodeitem item : metacodeitems) {
                Map<String, String> code_name_map = dicmap.get(item.getTypecode());
                code_name_map.put(item.getCode(), item.getName());
            }
        }

        List list_fieldname_disname = dynamictableDao.createSQLQuery(sql_fieldname_disname).list();
        List list_tdname_tdisname = dynamictableDao.createSQLQuery(sql_tablename_tabledisname).list();//tdname=tablename and displayname
        //表名
        Object[] tbname = (Object[]) list_tdname_tdisname.get(0);
        String tablename = (String) tbname[0];
        String displayname = (String) tbname[1];

        StringBuilder sb = new StringBuilder();
        //组装要查询的所有字段
        for (int i = 0; i < list_fieldname_disname.size(); i++) {
            Object[] fieldname_disname = (Object[]) list_fieldname_disname.get(i);
            sb.append(fieldname_disname[1] + ",");
        }
        //拼接要查询的字段名称并查询获取数据

        String fieldname = sb.toString().substring(0, sb.toString().length() - 1);
        //封装查询条件sql
        StringBuffer sql_exportData = null;

        sql_exportData = new StringBuffer("select " + fieldname + " from " + tablename + " where 1=1 ");

        if (StringUtils.isNotBlank(formdata) && !(formdata.equals("{}")) && !(formdata.equals(""))) {
            for (int j = 0; j < searchfieldlist.size(); j++) {
                if (StringUtils.isNotBlank(search_json.getString(searchfieldlist.get(j).getFieldname()))) {
                    String fieldvalue = search_json.getString(searchfieldlist.get(j).getFieldname());
                    if (StringUtils.isNotBlank(fieldvalue) && !(fieldvalue.equals(""))) {
                        if (searchfieldlist.get(j).getDatatypename().equals("DATE")) {
                            sql_exportData.append(" and to_char(" + searchfieldlist.get(j).getFieldname() + ",'yyyy-mm-dd') =" + "'" + fieldvalue + "'");
                        } else {
                            sql_exportData.append(" and upper(" + searchfieldlist.get(j).getFieldname() + ") like '%" + fieldvalue.toUpperCase() + "%'");
                        }
                    }
                }
            }
        }


        List datalist = dynamictableDao.createSQLQuery(sql_exportData.toString()).list();
        //Excel导出准备
        //创建HSSFWorkbook对象
        HSSFWorkbook wb = new HSSFWorkbook();
        //创建HSSFSheet对象(Excel左下角sheet命名)
        HSSFSheet sheet = wb.createSheet(displayname);

//        ExcelExportUtil.fillMapData(list_fieldname_disname, datalist, sheet, dicmap);
        //导出excel到页面
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        String fileName = displayname + "_" + df.format(new Date()) + ".xls";
        response.setContentType("application/octet-stream");
        response.setContentType("application/OCTET-STREAM;charset=UTF-8");
        //设置文件夹名称，并防止中文乱码。
        response.setHeader("Content-Disposition", "attachment;filename=" + new String(fileName.getBytes("gbk"), "iso8859-1"));
        BufferedOutputStream out = new BufferedOutputStream(response.getOutputStream());
        wb.write(out);
        out.flush();//表示强制将缓冲区中的数据发送出去,不必等到缓冲区满.
        out.close();
        formdata = null;
        searchfieldlist = null;
        search_json = null;
    }

    /**
     * 根据所属区域获取所在道路
     *
     * @param request
     * @return
     */
    @Override
    public List getRoadNamesByRegionName(HttpServletRequest request) {
        String tablename = request.getParameter("tablename");
        String regionName = request.getParameter("regionName");
        String roadName = request.getParameter("roadName");
        String regionValue = request.getParameter("value");
        String tableid = request.getParameter("tableid");
        Metadatatable table = null;
        if (null != tableid) {
            table = getMetadatatableByTableid(tableid);
        } else {
            table = getMetadatatableByTablename(tablename);
        }
        List<Metadatafield> fieldList = getMetadatafields(table.getTableid());
        String sql = "select ";
        String wheresql = " from " + table.getTablename() + " where 1=1";
        for (Metadatafield field : fieldList) {
            if (field.getFieldname().equalsIgnoreCase(roadName)) {
                sql += field.getFieldname() + ",";
            }
            if (field.getFieldname().equalsIgnoreCase(regionName)) {
                wheresql += " and " + field.getFieldname() + "= '" + regionValue + "'";
            }
        }

        sql = sql.substring(0, sql.length() - 1) + wheresql;
        List raodnameList = dynamictableDao.createSQLQuery(sql).list();
        return raodnameList;
    }


    /**
     * 获取表字段标题分类数据
     *
     * @param request
     * @return
     */
    @Override
    public List getTabs(HttpServletRequest request) {
        String tablename = request.getParameter("tablename");
        String tableId = request.getParameter("tableid");

        List list = new ArrayList();//存放表数据

        //获取实体，通过实体获取tableid方便下一步查询做数据
        Metadatatable entity = null;
        if (null != tablename && !tablename.equals("")) {
            entity = getMetadatatableByTablename(tablename);
        } else {
            entity = getMetadatatableByTableid(tableId);
        }
        String metadatafield_hql = " from Metadatafield t where t.tableid = " + entity.getTableid() + " and t.patrolfieldflag = 0 and t.belongmetacodeitem is not null order by t.belongmetacodeitem";
        List<Metadatafield> metadatafieldlist = metadatafieldDao.find(metadatafield_hql);
        //存储数据字典list
        Map<String, String> map = new HashMap<String, String>();
        for (Metadatafield field : metadatafieldlist) {
            if (null != field.getBelongmetacodeitem()) {
                //根据字典编码查询数据字典
                if (map.containsKey(field.getBelongmetacodeitem())) {
                } else {
                    List<Metacodeitem> item = metacodeitemDao.find(" from Metacodeitem where status = 1 and code = '" + field.getBelongmetacodeitem() + "' and typecode= '" + field.getBelongmetacodename() + "'");
                    if(null != item && item.size()>0) {
                        map.put(item.get(0).getCode(), item.get(0).getName());
                        list.add(item);
                    }
                }
            }
        }
        return list;
    }

    /**
     * 保存文件信息
     *
     * @param fileForm
     * @return
     */
    @Override
    public SysFile saveFileInfo(SysFileForm fileForm) {
        SysFile sysFile = new SysFile();
        SysFileConverter.convert(fileForm, sysFile);
        sysFileDao.save(sysFile);
        return sysFile;
    }

    /**
     * 保存文件关联表信息
     *
     * @param entityId
     * @param tablename
     * @param systemfileId
     * @return
     */
    @Override
    public boolean saveFileLink(String entityId, String tablename, Long systemfileId) {
        SysFileLink sysFileLink = new SysFileLink();
        sysFileLink.setEntityId(entityId);
        sysFileLink.setEntity(tablename.toLowerCase());
        sysFileLink.setSysFileId(systemfileId);
        sysFileLinkDao.save(sysFileLink);
        if (null != sysFileLink.getId()) {
            return true;
        }
        return false;
    }

//    @Override
//    public String dowmLoadFile(String sysFileId, HttpServletResponse response) {
//        SysFile sysFile = sysFileDao.find(Long.valueOf(sysFileId));
//        if (null != sysFile) {
//
//            ServletOutputStream out;
//            //String path = sysFile.getFilePath();
//            String path = ConfigProperties.getByKey("filePath");
//            String fileName = sysFile.getFileCode() +"_"+sysFile.getFileName()+ "." + sysFile.getFileFormat();
//            path = path.replace("\\", "/");
//            File file = new File(path + "/" + fileName);
//            fileName = sysFile.getFileName() + "." + sysFile.getFileFormat();
//            if(!file.exists() && sysFile.getFileName().indexOf(sysFile.getFileFormat())!=-1){
//            	fileName=sysFile.getFileCode() +"_"+sysFile.getFileName();
//            	file = new File(path + "/" + fileName);
//            	fileName = sysFile.getFileName();
//            }
//            response.setContentType("application/OCTET-STREAM;charset=UTF-8");
//            try {
//                //设置文件夹名称，并防止中文乱码。
//                response.setHeader("Content-Disposition", "attachment;filename=" + new String(fileName.getBytes("gbk"), "iso8859-1"));
//                FileInputStream inputStream = new FileInputStream(file);
//                out = response.getOutputStream();
//                int b = 0;
//                byte[] buffer = new byte[1024];
//                while ((b = inputStream.read(buffer)) != -1) {
//                    out.write(buffer, 0, b);
//                }
//                inputStream.close();
//                out.close();
//                out.flush();
//
//            }catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//        }
//        return null;
//
//    }

    @Override
    public boolean deleteFile(Long... sysFileIds) {
        String idString = "";
        try {
            for (Long sysFileId : sysFileIds) {
                idString += sysFileId.toString() + ",";
            }
            idString = idString.substring(0, idString.length() - 1);
            List<SysFile> sysFileList = sysFileDao.find("from SysFile where sysFileId in (" + idString + ")");
            sysFileDao.delete(sysFileList);
            List<SysFileLink> sysFileLink = sysFileLinkDao.find(" from SysFileLink where sysFileId in (" + idString + ")");
            for (SysFile sysFile : sysFileList) {
                //String path = sysFile.getFilePath();
            	String path = this.filePath;
                String fileName = sysFile.getFileCode()+"_"+sysFile.getFileName()+ "." + sysFile.getFileFormat();
                path = path.replace("\\", "/");
                File file = new File(path + "/" + fileName);
                // 路径为文件且不为空则进行删除
                if (file.isFile() && file.exists()) {
                    file.delete();
                    //删除缩略图
                    File fileSmall = new File(path + "/" +"imgSmall/"+ fileName);
                    if (fileSmall.isFile() && fileSmall.exists()) {
                    	fileSmall.delete();
                    }
                }else {
                	fileName = sysFile.getFileCode()+"_"+sysFile.getFileName();
                	file = new File(path + "/" + fileName);
                	if (file.isFile() && file.exists()) {
                        file.delete();
                        //删除缩略图
                        File fileSmall = new File(path + "/" +"imgSmall/"+ fileName);
                        if (fileSmall.isFile() && fileSmall.exists()) {
                        	fileSmall.delete();
                        }
                    }
                }
            }
            if (sysFileLink.size() > 0) {
                sysFileLinkDao.delete(sysFileLink);
            }
            return true;
        } catch (RuntimeException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
     }

    /**
     * 根据entityId或者tablename获取其文件列表
     *
     * @param entityId
     * @param tablename
     * @return
     */
    @Override
    public List loadFilelist(String entityId, String tablename,String tableid, HttpServletRequest request) {
    	if(tablename.indexOf("GX_PROBLEM_REPORT")!=-1){
    		tablename="GxProblemReport";
    	}
        String sys_file_link_sql = "";
        if(null != entityId && !"".equals(entityId) && null != tablename && !"".equals(tablename)){
            sys_file_link_sql = "select * from sys_file f where f.sys_file_id in (select l.sys_file_id from sys_file_link l where l.entity_id = '"+entityId+"' and upper(l.entity) = '" + tablename.toUpperCase() + "') order by f.cdt desc";
        }else{
            if(null != tableid && !tableid.equals("")) {
                Metadatatable metadatatable = getMetadatatableByTableid(tableid);
                if (null != metadatatable) {
                    sys_file_link_sql = "select * from sys_file f where f.sys_file_id in (select l.sys_file_id from sys_file_link l where l.entity_id = '"+entityId+"' and upper(l.entity) = '" + metadatatable.getTablename().toUpperCase() + "') order by f.cdt desc";
                }
            }
        }
        SQLQuery query = dynamictableDao.createSQLQuery(sys_file_link_sql);
        query.addEntity(SysFile.class);
        List<SysFile> fileList = query.list();
        if (fileList.size() > 0) {
        	List<SysFileForm> fileFormList = SysFileConverter.convertToFormList(fileList);
        	String urlAll=request.getRequestURL().toString() ;
			String url="";//图片路径处理
			String[] mainurl=urlAll.split("/ag");
			if (mainurl!=null && mainurl.length>0) {
				url=mainurl[0]+"/img/";
			}
			for(SysFileForm objFile : fileFormList){
				objFile.setFilePath(url+objFile.getFileCode()+"_"+objFile.getFileName());
			}
            return fileFormList;
        }
        return new ArrayList<SysFileForm>();
    }

    /**
     * 判断该表单字段数据是否存在（唯一验证）
     *
     * @param fieldName
     * @param fieldValue
     * @return
     */
    @Override
    public boolean queryValueIsExist(String tableid, String tablename, String fieldName, String fieldValue, String primarykeyData) {
        Metadatatable table = null;
        try {
            if (null != tableid && !tableid.equals("")) {
                table = getMetadatatableByTableid(tableid);
            } else {
                table = getMetadatatableByTablename(tablename);
            }
            if (null != table) {
                String hql = " from Metadatafield where tableid = " + table.getTableid() + " and primarykeyfieldflag = 1";
                List<Metadatafield> fieldList = metadatafieldDao.find(hql);
                String id = "";
                if (fieldList.size() > 0) {
                    String idsql = "select " + fieldList.get(0).getFieldname() + " from " + table.getTablename() + " where " + fieldName + " = '" + fieldValue + "'";
                    Object idobj = dynamictableDao.createSQLQuery(idsql).uniqueResult();
                    if (null != idobj) {
                        id = idobj.toString();
                    }
                }
                String sql = "select " + fieldName + " from " + table.getTablename() + " where " + fieldName + " = '" + fieldValue + "'";
                Object obj = dynamictableDao.createSQLQuery(sql).uniqueResult();
                if (null != obj && !obj.toString().equals("") && obj.toString().equals(fieldValue) && !primarykeyData.equals(id)) {
                    return true;
                }
            }

        } catch (RuntimeException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return false;
    }

    /**
     * rest接口保存文件关联表信息
     *
     * @param entity
     * @param entityId
     * @param systemfileId
     * @return
     */
//    public boolean saveFileLink_rest(String entity, String entityId, Long systemfileId) {
//        SysFileLink sysFileLink = new SysFileLink();
//        sysFileLink.setEntityId(entityId);
//        sysFileLink.setEntity(entity);
//        sysFileLink.setSysFileId(systemfileId);
//        sysFileLinkDao.save(sysFileLink);
//        if (null != sysFileLink.getId()) {
//            return true;
//        }
//        return false;
//    }

    /**
     * rest接口上传文件并保存关联表信息
     *
     * @param fileName 文件名，带后缀
     * @param fileByte 文件的byte[]
     * @param entity   行业表所在数据库用户+"."+行业表表名
     * @param entityId 工单编号
     * @return
     */
    public void uploadFile(String fileName, byte[] fileByte, String entity, String entityId) throws Exception {
        File file = null;
        BufferedOutputStream bos = null;
        FileOutputStream fos = null;
        String filecode = String.valueOf(System.currentTimeMillis());
        try {
            //判断文件目录是否存在
            File dir = new File(this.filePath);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            /*if(null != activityName){
                filePath = filePath + "\\" + activityName;
                dir = new File(filePath);//如果文件夹不存在则创建
                if (!dir.exists() && dir.isDirectory()) {
                    dir.mkdirs();
                }
                filePath = filePath+"\\"+entityId;
                dir = new File(filePath);//如果文件夹不存在则创建
                if (!dir.exists() && dir.isDirectory()) {
                    dir.mkdirs();
                }
            }*/
            //文件名前面加上时间戳，防止重名
            file = new File(filePath + "\\" +  fileName);
//            file = new File(filePath + "\\" + filecode + "_" + fileName);
           // fos = new FileOutputStream(file);
          //  bos = new BufferedOutputStream(fos);
           // bos.write(fileByte);//pc
        } catch (RuntimeException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        } finally {
            if (bos != null) {
                try {
                    bos.flush();
                    bos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (fos != null) {
                try {
                    fos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

//        SysFileForm fileForm = new SysFileForm();
//
//        String fileFormat = fileName.split("\\.")[1];
//        fileName = fileName.split("\\.")[0];
//
//        String filetype = "0";
//        fileForm.setFileCode(filecode);
//        fileForm.setFileName(fileName);
//        fileForm.setFileType(filetype);
//        fileForm.setFileFormat(fileFormat);
//        fileForm.setFileSize(file.length());
//        fileForm.setFilePath(filePath);
//        fileForm.setCdt(new Date());
//        fileForm.setMemo1("appImport");
//        SysFile sysFile = saveFileInfo(fileForm);
//
//        if (null != sysFile) {
//            saveFileLink_rest(entity, entityId, sysFile.getSysFileId());
//        }
    }

    /**
     * 获取管线参数配置树
     * @return
     */
    public String gxGxcsTreeList() {
        List<Metacodetype> metacodetypeList = metacodetypeService.getMetacodetypeListBytypecode("hl_");
        Map<String,String> resultList = new HashMap();
        for(Metacodetype metacodetype:metacodetypeList) {
            List dictionaryList = metacodetypeService.getDicdataByTypecode(metacodetype.getTypecode());
            //将作为前端参数的名称
            String dictionaryName = metacodetype.getTypecode();
            dictionaryName = dictionaryName.split("_")[1];
            resultList.put(dictionaryName,new Gson().toJson(dictionaryList));
        }

        return new Gson().toJson(resultList);
    }

    @Override
    public List<Tree> getMetadatatableTree(String rootid){
        String sql = "select metadatacategoryid,displayname,state,seniorid from "+
                "metadatacategory where 1=1 and (belongtofacman is null or belongtofacman =1) start with metadatacategoryid in ("+rootid+") connect by prior metadatacategoryid = seniorid order by seniorid";
        // 查询条件
        SQLQuery query = metadatatableDao.createSQLQuery(sql);
        query.addScalar("metadatacategoryid", LongType.INSTANCE)
                .addScalar("displayname", StringType.INSTANCE)
                .addScalar("state", StringType.INSTANCE)
                .addScalar("seniorid", LongType.INSTANCE);
        query.setResultTransformer(Transformers.aliasToBean(MetadatacategoryForm.class));
        List<MetadatacategoryForm> list = query.list();

        //查找项目模板列表
        sql = "select c.tableid,c.displayname as displayname,c.metadatacategoryid from metadatatable c where " +
                " c.templateid = (select templateid from template where isinused=1) and c.metadatacategoryid in (select a.metadatacategoryid from METADATACATEGORY a where 1 = 1 and (a.belongtofacman is null or a.belongtofacman = 1)" +
                "start with a.metadatacategoryid in ("+rootid+") connect by prior a.metadatacategoryid = a.seniorid) order by c.tableid";
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
        List<Tree> ls = new ArrayList();
        if(rlt.size()>0){
            deleteNode(rlt);
        }
        return rlt;
    }
    
    @Override
    public List<Tree> getMetadataViewTree(String rootid){
        String sql = "select metadatacategoryid,displayname,state,seniorid from "+
                "metadatacategory where 1=1 and (belongtofacman is null or belongtofacman =1) start with metadatacategoryid in ("+rootid+") connect by prior metadatacategoryid = seniorid order by seniorid";
        // 查询条件
        SQLQuery query = metadatatableDao.createSQLQuery(sql);
        query.addScalar("metadatacategoryid", LongType.INSTANCE)
                .addScalar("displayname", StringType.INSTANCE)
                .addScalar("state", StringType.INSTANCE)
                .addScalar("seniorid", LongType.INSTANCE);
        query.setResultTransformer(Transformers.aliasToBean(MetadatacategoryForm.class));
        List<MetadatacategoryForm> list = query.list();

        //查找项目模板列表
        sql = "select c.tableid,c.displayname as displayname,c.metadatacategoryid from metadatatable c where c.tablestatecode='view' and" +
                " c.templateid = (select templateid from template where isinused=1) and c.metadatacategoryid in (select a.metadatacategoryid from METADATACATEGORY a where 1 = 1 and (a.belongtofacman is null or a.belongtofacman = 1)" +
                "start with a.metadatacategoryid in ("+rootid+") connect by prior a.metadatacategoryid = a.seniorid) order by c.tableid";
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
        List<Tree> ls = new ArrayList();
        if(rlt.size()>0){
            deleteNode(rlt);
        }
        return rlt;
    }

    private void deleteNode(List<Tree> list){
        for(int j=0;j<list.size();j++){
            Tree tree1 = list.get(j);
            if(tree1.getIconSkin().equals("icon_template")){
                break;
            }else if(tree1.getChildren().size()==0){
                list.remove(j);
                j--;
            }else if(tree1.getChildren().size()>0){
                List<Tree> ls = tree1.getChildren();
                deleteNode(ls);
                if(ls.size()==0){
                    list.remove(j);
                }
            }
        }
    }

    /**
     * 根据表名与id查询SysFileLink
     * @param entity
     * @param entityId
     * @return
     */
    @Override
    public List<SysFileLink> getSysFileLinkByEntityAndEntityId(String entity,String entityId){
    	List<SysFileLink> sysFileLink = sysFileLinkDao.find(" from SysFileLink where entityId = '" + entityId + "' and entity='"+ entity +"'");
    	return sysFileLink;
    }

    /**
     * 根据filecode与fileName删除SysFile
     * @param filecode
     * @param fileName
     * @return
     */
    @Override
    public void deleteSysFileByCodeAndName(String filecode,String fileName){
    	List<SysFile> sysFile = sysFileDao.find(" from SysFile where fileCode = '" + filecode + "' and fileName='"+ fileName +"'");
    	if(sysFile!=null && sysFile.size()>0){
    		Long[] sysFileIds=new Long[sysFile.size()];
    		for(int i=0;i<sysFile.size();i++){
    			sysFileIds[i]=sysFile.get(i).getSysFileId();
    		}
    		deleteFile(sysFileIds);
    	}
    }
}

