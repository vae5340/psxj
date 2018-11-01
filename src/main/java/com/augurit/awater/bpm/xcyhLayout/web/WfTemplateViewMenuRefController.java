package com.augurit.awater.bpm.xcyhLayout.web;

import com.augurit.awater.bpm.xcyhLayout.service.IWfTemplateViewMenuRefService;
import com.augurit.awater.bpm.xcyhLayout.web.form.WfTemplateViewMenuRefForm;
import com.augurit.awater.common.Tree;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/wfTemplateViewMenuRef")
public class WfTemplateViewMenuRefController {

    @Autowired
    private IWfTemplateViewMenuRefService wfTemplateViewMenuRefService;

    @RequestMapping("/save")
    public String save(WfTemplateViewMenuRefForm form) throws Exception {
        wfTemplateViewMenuRefService.save(form);
        return "true";
    }

    /**
     * 删除一条记录
     */
    @RequestMapping("/delete")
    public String delete(Long id) throws Exception {
        wfTemplateViewMenuRefService.delete(id);
        return "true";
    }

    /**
     * 删除多条记录
     */
    @RequestMapping("/deleteMore")
    public String deleteMore(Long[] checkedIds) throws Exception {
        wfTemplateViewMenuRefService.delete(checkedIds);
        return "true";
    }

    /**
     * 获取某一模版视图的菜单树
     *
     * @return
     */
    @RequestMapping("/getWfTemplateViewMenuTree")
    public List<Tree> getWfTemplateViewMenuTree(HttpServletRequest request) {
        List<Tree> rlt = wfTemplateViewMenuRefService.getWfTemplateViewMenuTree(request);
        return rlt;
    }

    /**
     * 保存某一模版视图的对应菜单
     *
     * @return
     */
    @RequestMapping("/saveWfTemplateViewMenuData")
    public String saveWfTemplateViewMenuData(HttpServletRequest request) {
        boolean hasSuccessfullySaved = wfTemplateViewMenuRefService.saveWfTemplateViewMenuData(request);
        if (hasSuccessfullySaved) {
            return "true";
        } else {
            return "false";
        }
    }
}