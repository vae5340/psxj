package com.augurit.awater.dri.psh.discharge.controller;

import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.framework.security.user.OpuOmUser;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.psh.discharge.service.IPshReportDeleteService;
import com.augurit.awater.dri.psh.discharge.web.form.PshReportDeleteForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Map;


@Controller
public class PshReportDeleteController {
    @Autowired
    private IPshReportDeleteService pshReportDeleteService;
    @Autowired
    private IOmUserInfoRestService omUserService;

    /**
     * 准备页面模型
     */
    protected void prepareModel(PshReportDeleteForm form) throws Exception {
        OpuOmUser user = SecurityContext.getCurrentUser();
        OpuOmUserInfo userInfo = omUserService.getOpuOmUserInfoByLoginName(user.getUserName());
        Long id = Long.parseLong(userInfo.getUserId());
        if (id != null) {
            form = pshReportDeleteService.get(id);
        } else
            form = new PshReportDeleteForm();

    }
}