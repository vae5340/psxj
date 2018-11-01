package com.augurit.awater.bpm.xcyhLayout.service;


import com.augurit.awater.bpm.common.service.ICrudService;
import com.augurit.awater.bpm.xcyhLayout.web.form.WfRoleViewMenuRefForm;
import com.augurit.awater.common.Tree;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface IWfRoleViewMenuRefService extends ICrudService<WfRoleViewMenuRefForm, Long> {
    /**保存角色任务菜单信息*/
    void saveWfRoleMenuRef(HttpServletRequest request) throws Exception;
    /**获取任务菜单树*/
    List<Tree> getTemplateViewMenuTree(HttpServletRequest request) throws Exception;
}