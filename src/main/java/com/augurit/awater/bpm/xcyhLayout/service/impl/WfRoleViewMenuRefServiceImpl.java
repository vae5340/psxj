package com.augurit.awater.bpm.xcyhLayout.service.impl;

import java.util.*;

import com.augurit.awater.bpm.common.dao.WfPageElementDao;
import com.augurit.awater.bpm.common.entity.WfPageElement;
import com.augurit.awater.bpm.xcyhLayout.convert.WfRoleViewMenuRefConvertor;
import com.augurit.awater.bpm.xcyhLayout.dao.WfRoleViewMenuRefDao;
import com.augurit.awater.bpm.xcyhLayout.entity.WfRoleViewMenuRef;
import com.augurit.awater.bpm.xcyhLayout.service.IWfRoleViewMenuRefService;
import com.augurit.awater.bpm.xcyhLayout.web.form.WfRoleViewMenuRefForm;
import com.augurit.awater.common.Tree;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.util.data.DataConvert;
import com.augurit.awater.util.sql.HqlUtils;
import com.augurit.awater.util.file.PageUtils;
import com.augurit.awater.util.PropertyFilter;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;

@Service
@Transactional
public class WfRoleViewMenuRefServiceImpl implements IWfRoleViewMenuRefService {

    @Autowired
    private WfRoleViewMenuRefDao wfRoleViewMenuRefDao;

    @Autowired
    private WfPageElementDao wfPageElementDao;

    /**
     * 根据主键获取Form对象
     */
    @Transactional(readOnly = true)
    public WfRoleViewMenuRefForm get(Long id) {
        WfRoleViewMenuRef entity = wfRoleViewMenuRefDao.get(id);
        return WfRoleViewMenuRefConvertor.convertVoToForm(entity);
    }

    /**
     * 删除Form对象列表
     */
    public void delete(Long... ids) {
        wfRoleViewMenuRefDao.delete(ids);
    }

    /**
     * 保存新增或修改的Form对象列表
     */
    public void save(WfRoleViewMenuRefForm... forms) {
        if (forms != null)
            for (WfRoleViewMenuRefForm form : forms)
                this.save(form);
    }

    /**
     * 保存新增或修改的Form对象
     */
    public void save(WfRoleViewMenuRefForm form) {

        if (form != null) {
            WfRoleViewMenuRef entity = null;

            //准备VO对象
            if (form != null && form.getId() != null) {
                entity = wfRoleViewMenuRefDao.get(form.getId());
            } else {
                entity = new WfRoleViewMenuRef();
            }

            //属性值转换
            WfRoleViewMenuRefConvertor.convertFormToVo(form, entity);

            //保存
            wfRoleViewMenuRefDao.save(entity);

            //回填ID属性值
            form.setId(entity.getId());
        }
    }

    /**
     * 根据Form对象的查询条件作分页查询
     */
    @Transactional(readOnly = true)
    public Page<WfRoleViewMenuRefForm> search(Page<WfRoleViewMenuRefForm> page, WfRoleViewMenuRefForm form) {
        // 查询语句及参数
        StringBuffer hql = new StringBuffer("from WfRoleViewMenuRef ps where 1=1");
        Map<String, Object> values = new HashMap<String, Object>();

        // 查询条件
        if (form != null) {

        }

        //排序
        hql.append(HqlUtils.buildOrderBy(page, "ps"));

        // 执行分页查询操作
        Page pg = wfRoleViewMenuRefDao.findPage(page, hql.toString(), values);

        // 转换为Form对象列表并赋值到原分页对象中
        List<WfRoleViewMenuRefForm> list = WfRoleViewMenuRefConvertor.convertVoListToFormList(pg.getResult());
        PageUtils.copy(pg, list, page);
        return page;
    }

    /**
     * 根据过滤条件列表作分页查询
     */
    @Transactional(readOnly = true)
    public Page<WfRoleViewMenuRefForm> search(Page<WfRoleViewMenuRefForm> page, List<PropertyFilter> filters) {
        // 按过滤条件分页查找对象
        Page<WfRoleViewMenuRef> pg = wfRoleViewMenuRefDao.findPage(page, filters);

        // 转换为Form对象列表并赋值到原分页对象中
        List<WfRoleViewMenuRefForm> list = WfRoleViewMenuRefConvertor.convertVoListToFormList(pg.getResult());
        PageUtils.copy(pg, list, page);
        return page;
    }

    /**
     * 保存角色任务菜单信息
     */
    public void saveWfRoleMenuRef(HttpServletRequest request) throws Exception {
        String strRoleId = request.getParameter("roleId");
        String strTemplateId = request.getParameter("templateId");
        Long roleId = DataConvert.strToLong(strRoleId);
        Long templateId = DataConvert.strToLong(strTemplateId);
        //将视图id转成list
        String checkedNodeId = request.getParameter("checkedNodeId");
        List<String> elementIds = new ArrayList();
        if (StringUtils.isNotBlank(checkedNodeId)) {
            String[] strCheckedNodeIds = checkedNodeId.split(",");
            elementIds = new ArrayList(Arrays.asList(strCheckedNodeIds));
        }


        List<WfRoleViewMenuRef> wfRoleViewMenuRefs = wfRoleViewMenuRefDao.find("from WfRoleViewMenuRef where templateId = " + templateId + " and roleId = " + roleId);
        //遍历该用户拥有的菜单，如果前端传回来没有这个id，则删除这条数据
        for (WfRoleViewMenuRef wfRoleViewMenuRef : wfRoleViewMenuRefs) {
            if (elementIds.contains(DataConvert.longToStr(wfRoleViewMenuRef.getElementId()))) {
                elementIds.remove(DataConvert.longToStr(wfRoleViewMenuRef.getElementId()));
            } else {
                wfRoleViewMenuRefDao.delete(wfRoleViewMenuRef);
            }
        }

        //将新增的菜单存进数据库
        for (int i = 0; i < elementIds.size(); i++) {
            WfRoleViewMenuRef wfRoleViewMenuRef = new WfRoleViewMenuRef();
            wfRoleViewMenuRef.setRoleId(roleId);
            wfRoleViewMenuRef.setTemplateId(templateId);
            wfRoleViewMenuRef.setElementId(DataConvert.strToLong(elementIds.get(i)));
            wfRoleViewMenuRefDao.save(wfRoleViewMenuRef);
        }
    }

    /**
     * 获取任务菜单树
     */
    public List<Tree> getTemplateViewMenuTree(HttpServletRequest request) throws Exception {
        //模版id
        String templateId = request.getParameter("templateId");
        String strRoleId = request.getParameter("roleId");
        //勾选当前用户已有权限的菜单
        List<Long> elementIds = new ArrayList();
        if (StringUtils.isNotBlank(strRoleId)) {
            Long roleId = DataConvert.strToLong(strRoleId);
            List<WfRoleViewMenuRef> wfRoleViewMenuRefs = wfRoleViewMenuRefDao.find("from WfRoleViewMenuRef where templateId = " + templateId + " and roleId = " + roleId);
            for (WfRoleViewMenuRef wfRoleViewMenuRef : wfRoleViewMenuRefs) {
                elementIds.add(wfRoleViewMenuRef.getElementId());
            }
        }

        String sql = String.format("select * from wf_page_element p where p.element_type = 'button' and p.id in " +
                "(select t.element_id from wf_template_element_ref t where t.template_id = %s)", templateId);
        List<WfPageElement> lstWfPageElement = wfPageElementDao.createSQLQuery(sql).addEntity(WfPageElement.class).list();

        List<Tree> rlt = new ArrayList();

        //构建树的最初2层
        Tree wfOperationNode = new Tree();
        wfOperationNode.setId(1);
        wfOperationNode.setName("工作流操作");
        wfOperationNode.setIconCls("icon-root");
        wfOperationNode.setIconSkin("icon_root");
        Tree newOperationNode = new Tree();
        newOperationNode.setId(2);
        newOperationNode.setName("新增操作");
        newOperationNode.setIconCls("icon-root");
        newOperationNode.setIconSkin("icon_root");
        Tree rootNode = new Tree();
        rootNode.setId(-1);
        rootNode.setName("菜单树");
        rootNode.setIconCls("icon-root");
        rootNode.setIconSkin("icon_root");
        rootNode.getChildren().add(wfOperationNode);
        rootNode.getChildren().add(newOperationNode);

        for (WfPageElement wfPageElement : lstWfPageElement) {
            long id = wfPageElement.getId();

            Tree tree = new Tree();
            tree.setId((int) id);
            tree.setName(wfPageElement.getElementName());
            tree.setIconCls("icon-leaf");
            tree.setIconSkin("icon_leaf");
            if (elementIds.contains(id)) {
                tree.setChecked(true);
            }

            if ("1".equals(wfPageElement.getIsPublic()))
                wfOperationNode.getChildren().add(tree);
            else
                newOperationNode.getChildren().add(tree);
        }

        rlt.add(rootNode);
        return rlt;
    }
}