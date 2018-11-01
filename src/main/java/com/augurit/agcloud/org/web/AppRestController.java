package com.augurit.agcloud.org.web;


import com.alibaba.fastjson.JSON;
import com.augurit.agcloud.bsc.domain.BscDicCodeType;
import com.augurit.agcloud.framework.security.user.OpusLoginUser;
import com.augurit.agcloud.framework.ui.base.ListCombo;
import com.augurit.agcloud.opus.common.domain.OpuLogUserLogin;
import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.org.PsxjProperties;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.org.rest.service.IOmRsRoleRestService;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.agcloud.org.service.IPsOrgUserService;
import com.augurit.agcloud.util.login.AppLoginClient;
import com.augurit.agcloud.util.login.AppLoginForm;
import com.augurit.agcloud.util.login.AppResult;
import com.augurit.agcom.rongyun.io.rong.RongCloud;
import com.augurit.agcom.rongyun.io.rong.bean.User;
import com.augurit.agcom.rongyun.io.rong.models.TokenResult;
import com.augurit.awater.dri.rest.util.arcgis.httpArcgisClient;
import com.augurit.awater.dri.utils.Result;
import com.common.util.MD5;
import com.common.util.ReflectBeans;
import net.sf.json.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.websocket.server.PathParam;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/rest/app")
public class AppRestController {
    private Logger log = LoggerFactory.getLogger(AppRestController.class);
    @Autowired
    private PsxjProperties psxjProperties;
    @Autowired
    private IPsOrgUserService psOrgUserService;
    @Autowired
    private IOmUserInfoRestService userInfoRestService;
    @Autowired
    private IOmOrgRestService omOrgRestService;
    @Autowired
    private IOmRsRoleRestService omRsRoleRestService;

    /**
     * app登陆接口
     * @return token
     * */
    @RequestMapping("/login/{username}/{password}")
    public AppResult login(@PathVariable String username, @PathVariable String password){
        try {
            AppLoginForm loginForm = new AppLoginForm();
            //判断登录用户是否存在
            OpuOmUserInfo user =  userInfoRestService.getOpuOmUserInfoByLoginName(username);
            if(user==null){
                return new AppResult(false,"当前用户不存在!");
            }
            //回填机构id
            List<OpuOmOrg> listOrg  = omOrgRestService.listOpuOmOrgByUserId(user.getUserId());
            List<Map> listRole = new ArrayList();
            for(OpuOmOrg org:listOrg){
                //去除orgId中的OpusOmType前缀
                if(org.getOrgId().contains(org.getOpusOmType().getCode())){
                    org.setOrgId(org.getOrgId().substring(org.getOpusOmType().getCode().length()+1));
                }
                if("1".equals(org.getIsTopOrg())){
                    loginForm.setOrgId(org.getOrgId());

                }
            }
            loginForm.setLoginname(username);
            loginForm.setPassword(password);
            loginForm.setUsername(user.getUserName());
            loginForm.setLoginUrl(psxjProperties.getSso_server_url()); //设置登陆地址
            loginForm.setClientId(psxjProperties.getClientId());  //设置登陆凭证
            loginForm.setClientSecret(psxjProperties.getClientSecret());
            String result = AppLoginClient.appLogin(loginForm);
            if(result==null) {
                return new AppResult(false,"登陆失败!");
            }
            AppResult app = JSON.parseObject(result,AppResult.class);
            Map content = JSON.parseObject(app.getContent().toString(),Map.class);
            Map userMap = JSON.parseObject(JSONObject.fromObject(user).toString(),Map.class);
            Map<String,String> mapReportType = new HashMap<>();
            //获取数据字典拿到对应的roleCode
            try {
                Object object = content.get("opusLoginUser");
                ObjectMapper objectMapper = new ObjectMapper();
                OpusLoginUser opusLoginUser = (OpusLoginUser)objectMapper.convertValue(object, OpusLoginUser.class);
                List<ListCombo> listCombo =  omRsRoleRestService.lgetItemsByTypeCode("dri-report-type",opusLoginUser.getCurrentOrgId());
                for(ListCombo combo :listCombo){
                    mapReportType.put(combo.getLabel(),combo.getValue());
                }
            } catch (Exception e) {
            }
            for(OpuOmOrg org:listOrg) {
                if(org.getOrgProperty().equals("g")){  //工作组
                    Map map = new HashMap();
                    String roleCodeType = mapReportType.get(org.getOrgCode());
                    map.put("orgRoleCode", StringUtils.isNotBlank(roleCodeType) ? roleCodeType :org.getOrgCode());
                    map.put("orgRoleId",org.getOrgId());
                    map.put("orgRoleName",org.getOrgName());
                    listRole.add(map);
                }
            }
            userMap.put("role",listRole);
            content.put("user",userMap);
            content.put("org",listOrg);
            app.setContent(content);
            return app;
        } catch (IOException e) {
            e.printStackTrace();
            return new AppResult(false,e.getMessage());
        }
    }

    @RequestMapping(value="/login",produces="text/plain;charset=UTF-8")
    public String getCurrentUserInfo(AppLoginForm loginForm) {
        try {
            loginForm.setLoginUrl(psxjProperties.getSso_server_url()); //设置登陆地址
            loginForm.setClientId(psxjProperties.getClientId());  //设置登陆凭证
            loginForm.setClientSecret(psxjProperties.getClientSecret());
            return AppLoginClient.appLogin(loginForm);
        } catch (IOException e) {
            e.printStackTrace();
            return JSON.toJSONString(new Result(false,e.getMessage()));
        }
    }

    /******* 获取用户信息  *******/
    /**
     * 通过用户ID获取用户信息
     * @return
     */
    @RequestMapping(value="/getUserByUserId/{userId}")
    @ResponseBody
    public Result getUserByUserIdSensitive(@PathParam("userId") String userId,
                                           HttpServletRequest request,  HttpServletResponse response){
        OpusLoginUser user =(OpusLoginUser)request.getAttribute("opusLoginUser");
        Result result = new Result();
        try {
            OpuOmUserInfo userInfo = userInfoRestService.getOpuOmUserInfoByLoginName(user.getUser().getLoginName());
            OpuOmOrg org =  psOrgUserService.getParentOrgByUserId(userInfo.getUserId());
            Map map = new HashMap();
            if(userInfo!=null){
                map.put("user",userInfo);
                if(org!=null){
                    map.put("org",org);
                }
                result.setData(map);
                result.setSuccess(true);
            }else{
                result.setSuccess(false);
                result.setMessage("用户不存在!");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.setSuccess(false);
            result.setMessage(e.getMessage());
        }
        return result;
    }
    @RequestMapping(value="/getUser")
    @ResponseBody
    public Result getUser( HttpServletRequest request, HttpServletResponse response) {
        Result result = new Result();
        OpusLoginUser form =(OpusLoginUser)request.getAttribute("opusLoginUser");
        try {
            //**将登陆的用户*//*
            if(StringUtils.isNotEmpty(form.getUser().getUserId())){
                User users = ReflectBeans.copy(form.getUser(), User.class);
                users.setId(form.getUser().getUserId());
                RongCloud rongCloud = RongCloud.getInstance();
                // 获取 Token 方法
                TokenResult userGetTokenResult = rongCloud.user.
                        getToken(form.getUser().getUserId(),form.getUser().getUserName(),
                                "");
                users.setToken(userGetTokenResult.getToken());
                result.setData(users);
            } else {
                result.setMessage("验证失败，用户名或密码错误！");
            }
            result.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
            result.setSuccess(false);
        }
        return result;
    }
    /******* 获取用户信息  *******/

    /*** 数据字典 ***/
    @RequestMapping("/listTypes")
    public Result listTypes(HttpServletRequest request,String typeKeyword, String orgId){
        Object o =  request.getAttribute("opusLoginUser");
        try {
            List<BscDicCodeType> list = omRsRoleRestService.listTypess(typeKeyword,orgId);
            return new Result(true,list);
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false,e.getMessage());
        }
    }
    @RequestMapping("/lgetItemsByTypeCode")
    public Result lgetItemsByTypeCode(String typeCode,String orgId){
        try {
            return new Result(true,omRsRoleRestService.lgetItemsByTypeCode(typeCode,orgId));
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false,e.getMessage());
        }
    }
    @RequestMapping("/getItemTreeByTypeCode")
    public Result getItemTreeByTypeCode(String typeCode,String orgId){
        try {
            return new Result(true,omRsRoleRestService.getItemTreeByTypeCode(typeCode,orgId));
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false,e.getMessage());
        }
    }
    /*** 数据字典 ***/
}
