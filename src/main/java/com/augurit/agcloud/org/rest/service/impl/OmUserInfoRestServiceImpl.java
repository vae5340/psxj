package com.augurit.agcloud.org.rest.service.impl;

import com.augurit.agcloud.opus.common.domain.OpuOmUser;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@PropertySource(value = {"classpath:application.properties"},encoding="utf-8")
public class OmUserInfoRestServiceImpl implements IOmUserInfoRestService {

    @Autowired
    private RestTemplate restTemplate;

    private String orgUrl = "http://192.168.30.133:7080/opus-admin";

    /**
     * 全部用户信息对象
     *
    @Override
    public List<OpuOmUserInfo> findAllUserInfoForEasyUICombobox(){
        return restTemplate.getForObject(orgUrl + "/rest/opus/om/user/info/findAllUserInfoForEasyUICombobox.do" , List.class);
    }*/
    /**
     * 组织下用户信息对象
     *
    @Override
    public List<OpuOmUserInfo> getOpuOmUserInfoByOrgId(String orgId){
        return restTemplate.getForObject(orgUrl + "/rest/opus/om/user/info/getOpuOmUserInfoByOrgId.do?orgId"+orgId , List.class);
    }*/
    /**
     * 分页查询所有用户信息
     *
    @Override
    public PageInfo<OpuOmUserInfo> listUser(OpuOmUserInfo opuOmUserInfo, Page page){
        Map<String,Object> map = new HashMap();
        map.put("opuOmUserInfo",opuOmUserInfo);
        map.put("page",page);
        HttpEntity httpEntity = new HttpEntity(map);
        return restTemplate.postForObject(orgUrl + "/rest/opus/om/user/info/listUser.do",httpEntity,PageInfo.class);
    }*/
    /**
     * loginName获取用户信息
     * */
    @Override
    public Map getOpuOmUserInfoByUserId(String loginName){
        return  restTemplate.getForObject(orgUrl + "/rest/opus/om/getOpuOmUserInfoByUserId.do?userName="+loginName , Map.class);
    }
    @Override
    public OpuOmUserInfo getOpuOmUserInfoByLoginName(String loginName){
        return  restTemplate.exchange(orgUrl + "/rest/opus/om/getOpuOmUserInfoByUserId.do?userName="+loginName ,
                HttpMethod.GET,null,new ParameterizedTypeReference<OpuOmUserInfo>(){}).getBody();
    }
    /**
     * 根据orgId查询组织机构下的用户
     *
     * */
    @Override
    public List<OpuOmUserInfo> listOpuOmUserInfoByOrgId(String orgId){
        return  restTemplate.exchange(orgUrl + "/rest/opus/om/listOpuOmUserInfoByOrgId.do?orgId="+orgId ,
                HttpMethod.GET,null,new ParameterizedTypeReference<List<OpuOmUserInfo>>(){}).getBody();
    }

    /**
     * 获取当前机构orgId下的所有用户
     * */
    @Override
    public PageInfo<OpuOmUserInfo> listAllOpuOmUserInfoByOrgId(String orgId, OpuOmUser user, Page page){
        Map<String,Object> values = new HashMap<>();
        values.put("orgId",orgId);
        values.put("user",user);
        values.put("page",page);
        HttpEntity httpEntity = new HttpEntity(values);
        return  restTemplate.exchange(orgUrl + "/rest/opus/om/listAllOpuOmUserInfoByOrgId.do", HttpMethod.POST, httpEntity,
                new ParameterizedTypeReference<PageInfo<OpuOmUserInfo>>() {}).getBody();
    }

}