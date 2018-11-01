package com.augurit.awater.bpm.xcyhLayout.service.impl;

import java.util.*;

import com.augurit.awater.bpm.xcyhLayout.convert.WfRoleViewRefConvertor;
import com.augurit.awater.bpm.xcyhLayout.dao.WfRoleViewRefDao;
import com.augurit.awater.bpm.xcyhLayout.dao.WfTemplateViewDao;
import com.augurit.awater.bpm.xcyhLayout.entity.WfRoleViewRef;
import com.augurit.awater.bpm.xcyhLayout.service.IWfRoleViewRefService;
import com.augurit.awater.bpm.xcyhLayout.web.form.WfRoleViewRefForm;
import com.augurit.awater.bpm.xcyhLayout.web.form.WfTemplateViewForm;
import com.augurit.awater.common.Tree;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.util.data.DataConvert;
import com.augurit.awater.util.sql.HqlUtils;
import com.augurit.awater.util.file.PageUtils;
import com.augurit.awater.util.PropertyFilter;
import com.google.gson.Gson;
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
public class WfRoleViewRefServiceImpl implements IWfRoleViewRefService {

    @Autowired
    private WfRoleViewRefDao wfRoleViewRefDao;

//    @Autowired
//    private AcRoleDao acRoleDao;

    @Autowired
    private WfTemplateViewDao wfTemplateViewDao;

    /**
     * 根据主键获取Form对象
     */
    @Transactional(readOnly = true)
    public WfRoleViewRefForm get(Long id) {
        WfRoleViewRef entity = wfRoleViewRefDao.get(id);
        return WfRoleViewRefConvertor.convertVoToForm(entity);
    }

    /**
     * 删除Form对象列表
     */
    public void delete(Long... ids) {
        wfRoleViewRefDao.delete(ids);
    }

    /**
     * 保存新增或修改的Form对象列表
     */
    public void save(WfRoleViewRefForm... forms) {
        if (forms != null)
            for (WfRoleViewRefForm form : forms)
                this.save(form);
    }

    /**
     * 保存新增或修改的Form对象
     */
    public void save(WfRoleViewRefForm form) {

        if (form != null) {
            WfRoleViewRef entity = null;

            //准备VO对象
            if (form != null && form.getId() != null) {
                entity = wfRoleViewRefDao.get(form.getId());
            } else {
                entity = new WfRoleViewRef();
            }

            //属性值转换
            WfRoleViewRefConvertor.convertFormToVo(form, entity);

            //保存
            wfRoleViewRefDao.save(entity);

            //回填ID属性值
            form.setId(entity.getId());
        }
    }

    /**
     * 根据Form对象的查询条件作分页查询
     */
    @Transactional(readOnly = true)
    public Page<WfRoleViewRefForm> search(Page<WfRoleViewRefForm> page, WfRoleViewRefForm form) {
        // 查询语句及参数
        StringBuffer hql = new StringBuffer("from WfRoleViewRef ps where 1=1");
        Map<String, Object> values = new HashMap<String, Object>();

        // 查询条件
        if (form != null) {

        }

        //排序
        hql.append(HqlUtils.buildOrderBy(page, "ps"));

        // 执行分页查询操作
        Page pg = wfRoleViewRefDao.findPage(page, hql.toString(), values);

        // 转换为Form对象列表并赋值到原分页对象中
        List<WfRoleViewRefForm> list = WfRoleViewRefConvertor.convertVoListToFormList(pg.getResult());
        PageUtils.copy(pg, list, page);
        return page;
    }

    /**
     * 根据过滤条件列表作分页查询
     */
    @Transactional(readOnly = true)
    public Page<WfRoleViewRefForm> search(Page<WfRoleViewRefForm> page, List<PropertyFilter> filters) {
        // 按过滤条件分页查找对象
        Page<WfRoleViewRef> pg = wfRoleViewRefDao.findPage(page, filters);

        // 转换为Form对象列表并赋值到原分页对象中
        List<WfRoleViewRefForm> list = WfRoleViewRefConvertor.convertVoListToFormList(pg.getResult());
        PageUtils.copy(pg, list, page);
        return page;
    }

    /**
     * 获取角色列表
     */
    public String getAcRole(HttpServletRequest request) throws Exception {
        String roleCode = request.getParameter("roleCode");
        String roleName = request.getParameter("roleName");
        String hql = "from AcRole where 1=1 ";
        if (StringUtils.isNotBlank(roleCode))
            hql += "and roleCode like '%" + roleCode + "%'";
        if (StringUtils.isNotBlank(roleName))
            hql += "and roleName like '%" + roleName + "%'";
        //Todo
//        List<AcRole> acRoleList = acRoleDao.find(hql);
        List acRoleList = null;
        return new Gson().toJson(acRoleList);
    }

    /**
     * 获取任务视图树
     */
    public List<Tree> getWfTemplateViewTree(HttpServletRequest request) throws Exception {
        String templateId = request.getParameter("templateId");
        String strRoleId = request.getParameter("roleId");
        //勾选当前用户已有权限的视图
        List<Long> templateViewIds = new ArrayList();
        if (StringUtils.isNotBlank(strRoleId)) {
            Long roleId = DataConvert.strToLong(strRoleId);
            List<WfRoleViewRef> wfRoleViewRefs = wfRoleViewRefDao.find("from WfRoleViewRef where templateId = " + templateId + " and roleId = " + roleId);
            for (WfRoleViewRef wfRoleViewRef : wfRoleViewRefs) {
                templateViewIds.add(wfRoleViewRef.getViewId());
            }
        }

        String sql = "select templateid,viewdisplayname,id from " +
                "dri_wf_template_view where 1=1 and templateid in (" + 0 + "," + templateId + ") ORDER BY displayorder";
        // 查询条件
        SQLQuery query = wfTemplateViewDao.createSQLQuery(sql);
        query.addScalar("templateid", LongType.INSTANCE)
                .addScalar("viewdisplayname", StringType.INSTANCE)
                .addScalar("id", LongType.INSTANCE);
        query.setResultTransformer(Transformers.aliasToBean(WfTemplateViewForm.class));
        List<WfTemplateViewForm> list = query.list();
        Map<Integer, Tree> treelist = new HashMap<Integer, Tree>();
        List<Tree> rlt = new ArrayList<Tree>();
        Tree tree = null;
        WfTemplateViewForm wftemplateviewform = null;
        Tree parent = null;
        for (int i = 0; i < list.size(); i++) {
            wftemplateviewform = list.get(i);
            tree = new Tree();
            Long id = wftemplateviewform.getId();
            if (templateViewIds.contains(id)) {
                tree.setChecked(true);
            }
            tree.setId(wftemplateviewform.getId().intValue());
            tree.setName(wftemplateviewform.getViewdisplayname());
            if (id == 0) {
                tree.setIconCls("icon-root");
                tree.setIconSkin("icon_root");
            } else {
                tree.setIconCls("icon-leaf");
                tree.setIconSkin("icon_leaf");
            }
            parent = treelist.get(0);
            if (parent != null) {
                parent.getChildren().add(tree);
            } else {
                rlt.add(tree);
            }
            treelist.put(wftemplateviewform.getTemplateid().intValue(), tree);
        }
        return rlt;
    }

    /**
     * 保存角色任务视图信息
     */
    public void saveWfRoleViewRef(HttpServletRequest request) throws Exception {
        String strRoleId = request.getParameter("roleId");
        String strTemplateId = request.getParameter("templateId");
        Long roleId = DataConvert.strToLong(strRoleId);
        Long templateId = DataConvert.strToLong(strTemplateId);
        //将视图id转成list
        String checkedNodeId = request.getParameter("checkedNodeId");
        List<String> lstCheckedNodeId = new ArrayList();
        if (StringUtils.isNotBlank(checkedNodeId)) {
            String[] strCheckedNodeIds = checkedNodeId.split(",");
            lstCheckedNodeId = new ArrayList(Arrays.asList(strCheckedNodeIds));
        }

        List<WfRoleViewRef> lstwWfRoleViewRefs = wfRoleViewRefDao.find("from WfRoleViewRef where templateId = " + templateId + " and roleId = " + roleId);
        //遍历该用户拥有的视图，如果前端传回来没有这个id，则删除这条数据
        for (WfRoleViewRef wfRoleViewRef : lstwWfRoleViewRefs) {
            if (lstCheckedNodeId.contains(DataConvert.longToStr(wfRoleViewRef.getViewId()))) {
                lstCheckedNodeId.remove(DataConvert.longToStr(wfRoleViewRef.getViewId()));
            } else {
                wfRoleViewRefDao.delete(wfRoleViewRef);
            }
        }

        //将新增的视图存进数据库
        for (int i = 0; i < lstCheckedNodeId.size(); i++) {
            WfRoleViewRef wfRoleViewRef = new WfRoleViewRef();
            wfRoleViewRef.setRoleId(roleId);
            wfRoleViewRef.setTemplateId(templateId);
            wfRoleViewRef.setViewId(DataConvert.strToLong(lstCheckedNodeId.get(i)));
            wfRoleViewRefDao.save(wfRoleViewRef);
        }
    }
}