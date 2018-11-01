package com.augurit.agcloud.org.web;

import com.alibaba.fastjson.JSON;
import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.util.login.AppLoginClient;
import com.augurit.agcloud.util.login.AppLoginForm;
import com.augurit.awater.dri.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * @author lizzy
 * @date 2018/7/17 16:12
 */
@RestController
@RequestMapping("/omOrgRest")
public class OmOrgRestController {

    @Autowired
    private IOmOrgRestService restService;


//    @RequestMapping("/getOpuOmUserInfoByUserId")
//    public OpuOmUserInfo getOpuOmUserInfoByUserId(String userName){
//        return restService.getOpuOmUserInfoByUserId(userName);
//    }

    @RequestMapping("/getCurrentUserInfo")
    public Map getCurrentUserInfo() {
        Map<String, Object> map = new HashMap<>();
        map.put("orgId", SecurityContext.getCurrentOrgId());
        map.put("loginName", SecurityContext.getCurrentUser().getLoginName());
        map.put("userName",  SecurityContext.getCurrentUser().getUserName());
        map.put("userId", SecurityContext.getCurrentUserId());
        map.put("roleIds", SecurityContext.getOpusLoginUser().getAllRoleIds());
        return map;
    }


}
