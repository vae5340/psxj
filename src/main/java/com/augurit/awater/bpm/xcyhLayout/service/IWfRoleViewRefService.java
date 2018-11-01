package com.augurit.awater.bpm.xcyhLayout.service;


import com.augurit.awater.bpm.common.service.ICrudService;
import com.augurit.awater.bpm.xcyhLayout.web.form.WfRoleViewRefForm;
import com.augurit.awater.common.Tree;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface IWfRoleViewRefService extends ICrudService<WfRoleViewRefForm, Long> {
    /**获取角色列表*/
    String getAcRole(HttpServletRequest request) throws Exception;
    /**获取任务视图树*/
    List<Tree> getWfTemplateViewTree(HttpServletRequest request) throws Exception;
    /**保存角色任务视图信息*/
    void saveWfRoleViewRef(HttpServletRequest request) throws Exception;
}