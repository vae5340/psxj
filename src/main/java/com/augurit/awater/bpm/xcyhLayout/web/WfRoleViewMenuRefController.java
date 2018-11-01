package com.augurit.awater.bpm.xcyhLayout.web;

import com.augurit.awater.bpm.xcyhLayout.service.IWfRoleViewMenuRefService;
import com.augurit.awater.common.Tree;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/wfRoleViewMenuRef")
public class WfRoleViewMenuRefController  {

    @Autowired
    private IWfRoleViewMenuRefService wfRoleViewMenuRefService;

    /**
     * 保存角色任务菜单信息
     */
    @RequestMapping("/saveWfRoleMenuRef")
    public String saveWfRoleMenuRef(HttpServletRequest request) throws Exception {
        try {
            wfRoleViewMenuRefService.saveWfRoleMenuRef(request);
            return "true";
        } catch (Exception e) {
            e.printStackTrace();
            return "false";
        }
    }

    /**
     * 获取任务菜单树
     */
    @RequestMapping("/getTemplateViewMenuTree")
    public List getTemplateViewMenuTree(HttpServletRequest request) throws Exception {
        List<Tree> rlt = wfRoleViewMenuRefService.getTemplateViewMenuTree(request);
        return rlt;
    }
}