package com.augurit.agcloud.org.rest.service.impl;

import com.augurit.agcloud.bsc.domain.BscDicCodeItem;
import com.augurit.agcloud.bsc.domain.BscDicCodeType;
import com.augurit.agcloud.framework.ui.base.ListCombo;
import com.augurit.agcloud.opus.common.domain.OpuOmUser;
import com.augurit.agcloud.opus.common.domain.OpuRsRole;
import com.augurit.agcloud.org.rest.service.IOmRsRoleRestService;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@PropertySource(value = {"classpath:application.properties"},encoding="utf-8")
@Service
public class OmRsRoleServiceImpl implements IOmRsRoleRestService {

    @Autowired
    private RestTemplate restTemplate;

    private String orgUrl = "http://192.168.30.133:7080/opus-admin";

    /**
     * 根据角色编码获取角色
     * keyword:roleCode or roleName
     */
    @Override
    public PageInfo<OpuRsRole> listAllRolesByAppId(String roleCodeOrName, String appId, Page page){
        Map<String,Object> values = new HashMap<>();
        values.put("roleCode",roleCodeOrName);
        values.put("appId",appId==null? "1":appId);
        values.put("page",page);
        HttpEntity httpEntity = new HttpEntity(values);
        return restTemplate.exchange(orgUrl + "/rest/opus/rs/listAllRolesByAppId.do",HttpMethod.POST,httpEntity,
                new ParameterizedTypeReference<PageInfo<OpuRsRole>>(){}).getBody();
    }

    /**
     * 根据角色id查询用户
     * */
    @Override
    public List<OpuOmUser> listOpuOmUserByRoleId(String roleId){
        return restTemplate.exchange(orgUrl + "/rest/opus/om/listOpuOmUserByRoleId.do?roleId=" + roleId,
                HttpMethod.GET, null, new ParameterizedTypeReference<List<OpuOmUser>>() {}).getBody();
    }
    /**
     * 根据用户ID获取用户所有角色
     * */
    @Override
    public List<OpuRsRole> listRoleByUserId(String userId){
        return restTemplate.exchange(orgUrl + "/rest/opus/rs/listRoleByUserId.do?userId=" + userId, HttpMethod.GET,
                null, new ParameterizedTypeReference<List<OpuRsRole>>() {}).getBody();
    }
    /**
     *根据角色编号查询角色
     * */
    @Override
    public OpuRsRole getRoleByRoleCode(String roleCode){
        return  restTemplate.getForObject(orgUrl + "/rest/opus/rs/getRoleByRoleCode.do?roleCode=" + roleCode, OpuRsRole.class);
    }
    /**
     * 获取所有数据字典类型
     */
    @Override
    public List<Map> listTypes(String typeKeyword, String orgId){
        Map<String,Object> values = new HashMap<>();
        if(StringUtils.isNotBlank(typeKeyword)){
            values.put("typeKeyword",typeKeyword);
        }
        if(StringUtils.isNotBlank(orgId)){
            values.put("orgId",orgId);
        }
        HttpEntity httpEntity = new HttpEntity(values);
        return restTemplate.exchange(orgUrl +
                        "/rest/bsc/dic/code/listTypes.do",HttpMethod.POST,httpEntity,
                 new ParameterizedTypeReference<List<Map>>() {}).getBody();
    }
    @Override
    public List<BscDicCodeType> listTypess(String typeKeyword,String orgId){
        return restTemplate.exchange(orgUrl + "/rest/bsc/dic/code/listTypes.do?typeKeyword="+typeKeyword+"&orgId="+orgId, HttpMethod.GET,
                null, new ParameterizedTypeReference<List<BscDicCodeType>>() {}).getBody();
    }
    /**
     * 根据数据字典类型编码获取字典子项列表
     * */
    @Override
    public List<ListCombo> lgetItemsByTypeCode(String typeCode,String orgId){
        return restTemplate.exchange(orgUrl + "/rest/bsc/dic/code/lgetItemsByTypeCode.do?typeCode="+typeCode+"&orgId="+orgId, HttpMethod.GET,
                null, new ParameterizedTypeReference<List<ListCombo>>() {}).getBody();
    }
    /**
     * 根据类型编码获取类型树结构
     * */
    @Override
    public List<BscDicCodeItem> getItemTreeByTypeCode(String typeCode, String orgId) throws IOException {
        return restTemplate.exchange(orgUrl + "/rest/bsc/dic/code/getItemTreeByTypeCode.do?typeCode="+typeCode+"&orgId="+orgId, HttpMethod.GET,
                null, new ParameterizedTypeReference<List<BscDicCodeItem>>() {}).getBody();
    }
}