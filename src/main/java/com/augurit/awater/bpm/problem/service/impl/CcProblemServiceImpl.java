package com.augurit.awater.bpm.problem.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import com.alibaba.fastjson.JSONObject;

import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.agcloud.opus.common.domain.OpuOmUser;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.opus.common.domain.OpuRsRole;
import com.augurit.awater.bpm.common.dao.WfBusTemplateDao;
import com.augurit.awater.bpm.common.dao.WfPageElementDao;
import com.augurit.awater.bpm.common.entity.WfPageElement;
import com.augurit.awater.bpm.common.form.WfBusTemplateForm;
import com.augurit.awater.bpm.file.entity.SysFile;
import com.augurit.awater.bpm.file.service.IDynamictableService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.dao.MetacodeitemDao;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.dao.MetadatafieldDao;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.dao.MetadatatableDao;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metacodeitem;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metadatafield;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metadatatable;
import com.augurit.awater.bpm.xcyhLayout.convert.WfTemplateViewConvertor;
import com.augurit.awater.bpm.xcyhLayout.dao.WfRoleViewMenuRefDao;
import com.augurit.awater.bpm.xcyhLayout.dao.WfTemplateViewDao;
import com.augurit.awater.bpm.xcyhLayout.entity.WfRoleViewMenuRef;
import com.augurit.awater.bpm.xcyhLayout.entity.WfTemplateView;
import com.augurit.awater.bpm.xcyhLayout.web.form.WfTemplateViewForm;
import com.augurit.awater.bpm.problem.convert.CcProblemConvertor;
import com.augurit.awater.bpm.problem.dao.CcProblemDao;
import com.augurit.awater.bpm.problem.service.ICcProblemService;
import com.augurit.awater.bpm.problem.web.form.CcProblemForm;
import com.augurit.awater.bpm.common.entity.WfBusTemplate;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;

import com.augurit.awater.common.page.Page;
import com.augurit.awater.util.Constant;
import com.augurit.awater.util.file.PageUtils;
import org.hibernate.SQLQuery;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * CCPROBLEM实现类
 */
@Service
@Transactional
public class CcProblemServiceImpl implements ICcProblemService {

    @Autowired
    private CcProblemDao ccProblemDao;

    @Autowired
    private WfTemplateViewDao wfTemplateViewDao;

    @Autowired
    private WfRoleViewMenuRefDao wfRoleViewMenuRefDao;

    @Autowired
    private WfBusTemplateDao wfBusTemplateDao;
//
//    @Autowired
//    private WfBusInstanceDao wfBusInstanceDao;
//
    @Autowired
    private WfPageElementDao wfPageElementDao;
//
//    @Autowired
//    private Jbpm4HistProcinstDao jbpm4HistProcinstDao;
//
    @Autowired
    private MetadatatableDao metadatatableDao;

    @Autowired
    private MetadatafieldDao metadatafieldDao;

    @Autowired
    private MetacodeitemDao metacodeitemDao;

//    @Autowired
//    private IAcRoleService acRoleService;
//    @Autowired
//    private IOmUserService omUserService;
//    @Autowired
//    private IOmOrgService omOrgService;

//    @Autowired
//    private ISysFileService sysFileService;
//
//    @Autowired
//    private IMetadatatableService metadatatableService;

    @Autowired
    private IDynamictableService dynamictableService;
//
//    @Autowired
//    private IWfBusTemplateService wfBusTemplateService;

    @Autowired
    private IOmOrgRestService omOrgRestService;

    @Value("${filePath}")
    private String filePath;

    @Value("${virtualPath}")
    private String virtualPath;

    private Long templateId = 3382L;
    private String templateCode = "GX_XCYH";
    private String masterEntity = "DRI_GX_PROBLEM_REPORT";

    /**
     * 根据指定主键集合批量删除CCPROBLEM
     *
     * @param ids 主键集合
     */
    @Override
    public void deleteCcProblems(Long... ids) {
        ccProblemDao.delete(ids);
    }

    /**
     * 获取系统中所有的CCPROBLEM列表
     *
     * @return CcProblemForm列表
     */
    @Override
    public List<CcProblemForm> getAll() {
        return CcProblemConvertor.convertVoListToFormList(ccProblemDao.getAll());
    }

    /**
     * 获取CcProblemForm对象
     *
     * @param id CCPROBLEMid
     * @return CcProblemForm对象
     */
    @Override
    public CcProblemForm getCcProblemForm(Long id) {
        return ccProblemDao.getForm(id);
    }

    /**
     * 批量保存CcProblemForm对象
     *
     * @param forms CcProblemForm对象集合
     */
    @Override
    public void saveCcProblems(CcProblemForm... forms) {
        if (forms != null && forms.length > 0) {
            for (CcProblemForm form : forms)
                ccProblemDao.save(form);
        }
    }

    /**
     * 根据分页对象和过滤条件列表进行分页条件查询
     *
     * @param page 分页对象
     * @param form 查询条件
     * @return 分页查询结果.附带结果列表及所有查询时的参数
     */
    @Transactional(readOnly = true)
    public Page<CcProblemForm> search(Page<CcProblemForm> page, CcProblemForm form) {
        // 建立新的分页对象
        Page pg = PageUtils.newPageInstance(page);

        // 查询语句及参数
        StringBuffer hql = new StringBuffer("from Ccproblem ps where 1=1");
        Map<String, Object> values = new HashMap<String, Object>();

        // 查询条件
        if (form != null) {

        }

        // 执行分页查询操作
        ccProblemDao.findPage(pg, hql.toString(), values);

        // 转换为Form对象列表并赋值到原分页对象中
        List<CcProblemForm> list = CcProblemConvertor.convertVoListToFormList(pg.getResult());
        PageUtils.copy(pg, list, page);
        return page;
    }

    /**
     * @param problemType 问题类型
     * @return List<OpuOmUser>  返回类型
     * @Title: getUserByProblemType
     * @Description: 根据问题类型获取对应角色的用户
     * @author otp
     * @date 2016-05-08 15:58:58
     */
    public List<OpuOmUser> getUserByProblemType(String problemType) {
        String roleCode = null;
        List<OpuOmUser> omUserList = null;
        if ("道路".equals(problemType)) {
            roleCode = "dl_yhzrr";
        } else if ("桥梁".equals(problemType)) {
            roleCode = "ql_yhzrr";
        } else if ("照明".equals(problemType)) {
            roleCode = "zm_yhzrr";
        } else if ("雨水".equals(problemType)) {
            roleCode = "ys_yhzrr";
        } else if ("污水".equals(problemType)) {
            roleCode = "ws_yhzrr";
        } else if ("自来水".equals(problemType)) {
            roleCode = "zls_yhzrr";
        } else if ("燃气".equals(problemType)) {
            roleCode = "rq_yhzrr";
        }
        if (roleCode != null) {
            //Todo do
//            AcRoleForm role = acRoleService.getRoleByRoleCode(roleCode);
//            omUserList = omUserService.getUsersByRoleId(role.getRoleId());
        }
        return omUserList;
    }

    /**
     * 修改数据
     *
     * @param templateId
     * @param jsonString
     * @return
     */
    @Override
    public Boolean saveData(Long templateId, String jsonString) {
        JSONObject json = JSONObject.parseObject(jsonString);
        String bhlx=json.get("bhlx")==null?"":json.get("bhlx").toString();
        if(bhlx!=null && bhlx.contains("[")){//特殊处理一下
            bhlx=bhlx.replace("[", "");
            bhlx=bhlx.replace("]", "");
            bhlx=bhlx.replace("\"", "");
        }
        json.put("bhlx", bhlx); // 直接put相同的key 如果没有值也要拼接一个上去  选其他的时候 bhlx为空
        List<Metadatafield> fieldList = new ArrayList<Metadatafield>();
        WfBusTemplate wfBusTemplate = wfBusTemplateDao.find(templateId);//通过模板id获取模板
        if (null != wfBusTemplate) {
            fieldList = getFieldsByTemplate(null);
        }
        String sql = "update " + masterEntity + " set ";
        String update_condition = " where ";
        if (fieldList.size() > 0) {
            for (Metadatafield metadatafield : fieldList) {
                String fieldname = metadatafield.getFieldname().toLowerCase();
                if (metadatafield.getPrimarykeyfieldflag() != 1 && json.containsKey(fieldname) && null != json.getString(fieldname)) {
                    if (metadatafield.getComponentid() == 3) {
                        String checkboxValue = json.getString(fieldname);
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
                        sql += fieldname + "= '" + ss + "',";
                    } else if (metadatafield.getDatatypename().equalsIgnoreCase("Integer")) {
                        if(!json.getString(fieldname).equals("")){
                            sql += fieldname + "=" + Integer.parseInt(json.getString(fieldname)) + ",";
                        }
                    } else if (metadatafield.getDatatypename().equalsIgnoreCase("number")) {
                        String str = "";
                        if (json.getString(fieldname).equals("")) {
                            str = "''";
                        } else {
                            str = "to_number('" + json.getString(fieldname) + "')";

                        }
                        sql += fieldname + "= " + str + ",";

                    } else if (metadatafield.getDatatypename().equalsIgnoreCase("date")) {
                        sql += fieldname + "= to_date('" + json.getString(fieldname) + "','yyyy-mm-dd hh24:mi:ss'),";
                    } else {
                        sql += fieldname + "= '" + json.getString(fieldname) + "',";
                    }
                }
                //字段为主键
                if (metadatafield.getPrimarykeyfieldflag() == 1) {
                    Object id;
                    //id不为空，表示是修改操作
                    if (null != json.getString(fieldname) && !json.getString(fieldname).equals("")) {
                        id = json.getString(fieldname);
                        update_condition += fieldname + "= " + Long.valueOf(id.toString());
                    }
                }
            }
        }
        sql = sql.substring(0, sql.length() - 1) + update_condition;
        int flag = ccProblemDao.createQuery(sql).executeUpdate();
        if (flag > 0) {
            return true;
        }
        return false;
    }

    private List<Metadatafield> getFieldsByTemplate(String fields) {
        List<Metadatafield> fieldList = new ArrayList<Metadatafield>();
        String tableName = masterEntity;
        String hql = " from Metadatatable where upper(tablename) = '" + tableName.toUpperCase() + "'";
        Metadatatable metadatatable = metadatatableDao.findFirst(hql);
        if (null != metadatatable) {
            String fieldhql = "";
            if (null != fields) {
                String[] strAry = fields.split(",");
                fields = "";
                for (String str : strAry) {
                    fields += "'" + str + "',";
                }
                fields = fields.substring(0, fields.length() - 1);
                fieldhql = "from Metadatafield where tableid = " + metadatatable.getTableid() + " and (fieldname in (" + fields.toUpperCase() + ") or primarykeyfieldflag = 1) order by displayorder";//colspan,
            } else {
                fieldhql = "from Metadatafield where (patrolfieldflag = 0 or primarykeyfieldflag = 1) and tableid = "
                        + metadatatable.getTableid() + " order by primarykeyfieldflag desc,colspan,displayOrder asc";
            }
            fieldList = metadatafieldDao.find(fieldhql);
        }
        return fieldList;
    }

    /**
     * 根据模板id获取当前用户权限下的所有任务视图
     *
     * @param templateCode
     * @return
     */
    @Override
    public List getTabsData(String templateCode, String roleId) {
        List list = new ArrayList();
        List<WfBusTemplate> templateList = wfBusTemplateDao.findBy("templateCode", templateCode);
        WfBusTemplate wfBusTemplate = new WfBusTemplate();
        if (null != templateList && templateList.size() == 1) {
            wfBusTemplate = templateList.get(0);
        }
        list.add(wfBusTemplate);
        Long templateid = wfBusTemplate.getId();
        //获取用户角色权限下的所以视图
        String viewsql = "select * from dri_wf_template_view where templateid = " + templateid + " and id in " +
                "(select view_id from dri_wf_role_view_ref where template_id = " + templateid + " and role_id = '" + roleId + "') order by id";
        SQLQuery query = wfTemplateViewDao.createSQLQuery(viewsql);
        query.addEntity(WfTemplateView.class);
        List<WfTemplateView> viewlist = query.list();
        List<WfTemplateViewForm> formList = WfTemplateViewConvertor.convertVoListToFormList(viewlist);

        if (null != formList && formList.size() > 0) {

            //获取视图菜单（根据角色-菜单关系  或者 视图-菜单关系）
            List<WfPageElement> elementList = new ArrayList<WfPageElement>();
            List<WfRoleViewMenuRef> roleViewMenuRefList = hasRoleMenuRef(templateid, roleId);
            //根据角色-菜单关系获取菜单
            if (roleViewMenuRefList.size() > 0) {
                elementList = getElementsByRole(roleViewMenuRefList);
                for (WfTemplateViewForm form : formList) {
                    form.setWfMenu(elementList);
                }
            }
            //根据视图-菜单关系获取菜单
            else {
                for (WfTemplateViewForm form : formList) {
                    List<WfPageElement> wfPageElements = new ArrayList<WfPageElement>();
                    wfPageElements = getElementsByView(form.getId(), templateid);
                    form.setWfMenu(wfPageElements);
                }
            }
        }
        list.add(formList);
        return list;
    }
    private List<WfPageElement> getElementsByView(Long viewId, Long templateid) {
        List<WfPageElement> list = new ArrayList<WfPageElement>();
        String sql = "select * from dri_wf_page_element where id in ( select element_id from dri_wf_template_view_menu_ref where template_id = " + templateid + " and view_id = " + viewId + ") order by element_sort_no";
        SQLQuery query = wfPageElementDao.createSQLQuery(sql);
        query.addEntity(WfPageElement.class);
        list = query.list();
        return list;
    }

    private List<WfRoleViewMenuRef> hasRoleMenuRef(Long templateId, String roleId) {
        List<WfRoleViewMenuRef> roleViewMenuRefList = new ArrayList<WfRoleViewMenuRef>();
        String isExistMenuHql = " from WfRoleViewMenuRef where roleId = '" + roleId + "' and templateId = " + templateId;
        roleViewMenuRefList = wfRoleViewMenuRefDao.find(isExistMenuHql);
        return roleViewMenuRefList;
    }
    private List<WfPageElement> getElementsByRole(List<WfRoleViewMenuRef> roleViewMenuRefList) {
        List<WfPageElement> elementList = new ArrayList<WfPageElement>();
        String ids = "";
        for (WfRoleViewMenuRef roleViewMenuRef : roleViewMenuRefList) {
            ids += roleViewMenuRef.getElementId() + ",";
        }
        ids = ids.substring(0, ids.length() - 1);
        String menuhql = " from WfPageElement where id in (" + ids + ")";
        elementList = wfPageElementDao.find(menuhql);
        return elementList;
    }

    @Override
    public List getFormData(Long templateId, String id, HttpServletRequest request) {
        List list = new ArrayList();
        List<Metadatafield> fieldList = new ArrayList<Metadatafield>();
//        WfBusTemplate wfBusTemplate = wfBusTemplateDao.find(templateId);//通过模板id获取模板
        String tablename = masterEntity;
//        if (null != wfBusTemplate) {
            fieldList = getFieldsByTemplate(null);
//        }
        list.add(dynamictableService.getMetadatatableByTablename(tablename));
        list.add(fieldList);
        //存储数据字典list
        List<Map> dicList = new ArrayList<Map>();
        Map<String, List> map = new HashMap<String, List>();
        map = this.getDicMap(fieldList);
        dicList.add(map);
        list.add(dicList);
        if (null != id && !id.equals("")) {
            String fields = "";
            if (fieldList.size() > 0) {
                for (Metadatafield field : fieldList) {
                    fields += field.getFieldname() + ",";
                }
            }
            if (!fields.equals("")) {
                fields = fields.substring(0, fields.length() - 1);
                String sql = "select " + fields + " from " + masterEntity + " where id = " + Long.valueOf(id);
                List dataList = ccProblemDao.createSQLQuery(sql).list();
                list.add(dataList);
            }
            //String code = findReportCodeById(id, tablename);
            List<SysFile> fileList = (List<SysFile>)dynamictableService.loadFilelist(id,tablename,null,request);
            if(null != fileList && fileList.size()>0){
                list.add(fileList);
            }
        }
        return list;
    }

    //获取下拉框字段的数据字典
    private Map<String, List> getDicMap(List<Metadatafield> fieldList) {
        Map<String, List> map = new HashMap<String, List>();
        for (Metadatafield field : fieldList) {
            if (null != field.getComponentid()) {
                //控件类型为下拉框时，根据字典编码查询数据字典
                if (field.getComponentid() == 0 || field.getComponentid() == 3 || field.getComponentid() == 5) {
                    List<Metacodeitem> items = metacodeitemDao.find(" from Metacodeitem where typecode = '" + field.getDiccode() + "' and status = 1 order by sortno");
                    map.put(field.getFieldname().toLowerCase(), items);
                }
            }
        }
        return map;
    }

    /**
     * 获取上级监理单位下所有（R0）用户
     */
    @Override
    public List<OpuOmUser> getJlUserByUserCode(String loginName) {
        List<OpuOmUser> userFormList = new ArrayList<OpuOmUser>();
//        OpuOmUser OpuOmUser = omUserService.getUser(userCode);
        OpuOmUserInfo opuOmUserInfo = omOrgRestService.getOpuOmUserInfoByLoginName(loginName);
        Map<String, String> jlOrgMap = new LinkedHashMap<String, String>();
        if (opuOmUserInfo != null) {
//            List<OpuOmOrg> orgList = omOrgService.getOrgsByUserId(OpuOmUser.getUserId());
            List<String> orgIdList = omOrgRestService.listOpuOmOrgIdByUserId(opuOmUserInfo.getUserId());
            if (orgIdList != null) {
                //判断当前用户是否在监理单位下
                for(int i=0;i<orgIdList.size();i++){
                    OpuOmOrg jlOrgForm = null;
                    OpuOmOrg OpuOmOrg =omOrgRestService.getOrgByOrgId(orgIdList.get(i));
                    jlOrgForm = getJlOrg(OpuOmOrg);
                    if(jlOrgForm != null){
                        jlOrgMap.put(jlOrgForm.getOrgId(), jlOrgForm.getOrgCode());
                    }
                }
            }
            //找上级监理单位
//			if(jlOrgForm == null){
//				OpuOmOrg OpuOmOrg = orgList.get(0);
//				jlOrgForm = getJlOrg(OpuOmOrg);
//			}
            //存在多个组织
            List<String> orgIds = new ArrayList<>();
            for (String key : jlOrgMap.keySet()) {
                orgIds.add(key);
            }
            //找出监理单位下所有的R0

            //Todo test
            if(orgIds.size()>0){
//                userFormList =omUserService.getAllChildOrgIdsByroleCode(orgIds, "ps_yz_chief");
                OpuRsRole opuRsRole =omOrgRestService.getRoleByRoleCode("ps_yz_chief");
                userFormList = omOrgRestService.listOpuOmUserByRoleId(opuRsRole.getRoleId());
                userFormList =  userFormList.stream().filter( user -> orgIds.contains(user.getOrgId())).collect(Collectors.toList());
            }
        }
        if(userFormList != null && userFormList.size()>0){
            return userFormList;
        }
        return null;
    }

    /**
     * 获取上级监理单位
     * @param opuOmOrg
     * @return
     */
    private OpuOmOrg getJlOrg(OpuOmOrg opuOmOrg){
        boolean flag = false;
        if(opuOmOrg != null){
            if("13".equals(opuOmOrg.getOrgRank())){
                flag = true;
                if(flag){
                    return opuOmOrg;//返回本级组织
                }
            }
            if(!flag){//本级没有获取上级
                if(opuOmOrg.getParentOrgId()!=null){
                    String parentOrgId = opuOmOrg.getParentOrgId();
                    OpuOmOrg omPrentOrgForm = omOrgRestService.getOrgByOrgId(parentOrgId);
                    return getJlOrg(omPrentOrgForm);
                }
                return null;
            }
        }
        return null;
    }

    /**
     * 获取表单数据
     */
    @Override
    public List getTableData(String keyId, String tableName) {
        String sql = "select * from "+tableName+" where id = "+Long.valueOf(keyId);
        List list= ccProblemDao.createSQLQuery(sql).list();
        return list;
    }

    /**
     * 获取业务数据表记录详情
     *
     * @param templateCode
     * @param masterEntityKey
     * @return
     */
    @Override
    public List getDetailData(String templateCode, String masterEntityKey) {
        List showList = new ArrayList();
            int length = templateCode.length() + Constant.underline2Camel(masterEntity, true).length() + 1;
            String sql = "select element_code from wf_page_element where id in " +
                    "(select element_id from wf_template_element_ref where template_id=" + templateId + ")";
            SQLQuery query = wfPageElementDao.createSQLQuery(sql);
            query.addScalar("element_code", StringType.INSTANCE);
            List list = query.list();
            String fields = "";
            if (null != list && list.size() > 0) {
                for (Object obj : list) {
                    if(obj.toString().toUpperCase().indexOf(templateCode.toUpperCase()) != -1) {
                        fields += Constant.camel2Underline(obj.toString().substring(length + 1, obj.toString().length())) + ",";
                    }
                }
                fields = fields.substring(0, fields.length() - 1);
                if (!fields.equals("")) {
                    List<Metadatafield> fieldList = getFieldsByTemplate(fields);
                    if (null != fieldList && fieldList.size() > 0) {
                        String newFields = "";
                        for (Metadatafield field : fieldList) {
                            newFields += field.getFieldname() + ",";
                        }
                        newFields = newFields.substring(0, newFields.length() - 1);
                        String dataSql = "select " + newFields + " from " + masterEntity + " where id = " + Long.valueOf(masterEntityKey);
                        List dataList = ccProblemDao.createSQLQuery(dataSql).list();
                        if (null != dataList && dataList.size() > 0) {
                            showList.add(dataList.get(0));
                        }
                        showList.add(fieldList);
                        //存储数据字典list
                        List<Map> dicList = new ArrayList<Map>();
                        Map<String, List> map = new HashMap<String, List>();
                        map = this.getDicMap(fieldList);
                        dicList.add(map);
                        showList.add(dicList);
                    }
                }
            }
        return showList;
    }

}
