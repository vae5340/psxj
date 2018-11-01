package com.augurit.awater.bpm.xcyhLayout.service;

import com.augurit.awater.bpm.common.service.ICrudService;
import com.augurit.awater.bpm.xcyhLayout.web.form.WfTemplateViewMenuRefForm;
import com.augurit.awater.common.Tree;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface IWfTemplateViewMenuRefService extends ICrudService<WfTemplateViewMenuRefForm, Long> {

    /**
     * 获取某一模版视图的菜单树
     *
     * @param request
     * @return
     */
    List<Tree> getWfTemplateViewMenuTree(HttpServletRequest request);

    /**
     * 保存某一模版视图的对应菜单
     *
     * @param request
     * @return
     */
    boolean saveWfTemplateViewMenuData(HttpServletRequest request);
}