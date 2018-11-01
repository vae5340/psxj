package com.augurit.agcloud.org.rest.service.impl;

import com.augurit.agcloud.framework.security.user.OpuOmUser;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.org.rest.service.IOmUserRestService;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@PropertySource(value = {"classpath:application.properties"},encoding="utf-8")
@Service
public class OmUserRestServiceImpl implements IOmUserRestService {

    @Autowired
    private RestTemplate restTemplate;

    private String orgUrl = "http://192.168.30.133:7080/opus-admin";
    /**
     * 根据用户loginName获取用户信息
     * */
    @Override
    public OpuOmUser getOpuOmUser(String userName){
        OpuOmUser user = restTemplate.getForObject(orgUrl + "/rest/opus/om/getOpuOmUserByLoginName.do?userName=" + userName, OpuOmUser.class);
        return user;
    }
    /**
     * 查询当前机构下的全部用户
     * */
    @Override
    public PageInfo<Map> listAllOpuOmUserInfoByOrgId(String orgId,PageInfo page){
        Map<String,Object> values = new HashMap<>();
        values.put("orgId",orgId);
        values.put("page",page);
        HttpEntity httpEntity = new HttpEntity(values);
        PageInfo<Map> pageInfo = restTemplate.postForObject(orgUrl + "/rest/opus/om/listAllOpuOmUserInfoByOrgId.do?orgId="+orgId,httpEntity,PageInfo.class);
        return pageInfo;
    }
}