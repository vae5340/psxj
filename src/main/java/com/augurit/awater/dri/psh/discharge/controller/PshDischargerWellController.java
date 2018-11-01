package com.augurit.awater.dri.psh.discharge.controller;

import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.framework.security.user.OpuOmUser;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.awater.dri.psh.discharge.service.IPshDischargerWellService;
import com.augurit.awater.dri.psh.discharge.web.form.PshDischargerWellForm;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
@Controller
public class PshDischargerWellController {
    @Autowired
    private IPshDischargerWellService pshDischargerWellService;
    @Autowired
    private IOmUserInfoRestService omUserService;


    /**
     * 根据门牌号Id查询接驳井信息
     */
    public String getFormBySGuid(HttpServletRequest request) throws Exception {
        String sGuid=request.getParameter("sGuid");
        List<Map<String,Object>> list=pshDischargerWellService.getFormBySGuid(sGuid);
        StringUtils.join(list);
        //Ext3BaseAction.extRenderListJson(list, false);
        return null;
    }

    /**
     * 准备页面模型
     */
    protected void prepareModel(PshDischargerWellForm form) throws Exception {
        OpuOmUser user = SecurityContext.getCurrentUser();
        OpuOmUserInfo userInfo = omUserService.getOpuOmUserInfoByLoginName(user.getUserName());
        Long id = Long.parseLong(userInfo.getUserId());
        if(id != null){
            form = pshDischargerWellService.get(id);
        }
        else
            form = new PshDischargerWellForm();
    }


    public PshDischargerWellForm getModel(PshDischargerWellForm form) {
        return form;
    }
}
