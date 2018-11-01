package com.augurit.agcloud.org.rest.service.impl;

import com.augurit.agcloud.opus.common.domain.*;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OmOrgRestServiceImpl implements IOmOrgRestService {

    @Autowired
    private RestTemplate restTemplate;

    private String orgUrl = "http://192.168.30.133:7080/opus-admin";

    public OpuOmUserInfo getOpuOmUserInfoByLoginName(String loginName) {
        OpuOmUserInfo map = restTemplate.getForObject(orgUrl + "/rest/opus/om/getOpuOmUserInfoByUserId.do?userName=" + loginName, OpuOmUserInfo.class);
        return map;
    }

    public List<Map> getOrgAndTeam(String orgId) {
        List<Map> list = restTemplate.getForObject(orgUrl + "/rest/opus/om/getOrgAndTeam.do?orgId=" + orgId, List.class);
        return list;
    }

    public Map<String, String> getOpuOmOrgByOrgId(String orgId) {
        Map orgMap = restTemplate.getForObject(orgUrl + "/rest/opus/om/getOrgByOrgId.do?orgId=" + orgId, Map.class);
        return orgMap;
    }

    public String getParentOrgIdByOrgId(String orgId) {
        Map<String, String> orgMap = restTemplate.getForObject(orgUrl + "/rest/opus/om/getParentDistrictEntity.do?orgId=" + orgId, Map.class);
        if(orgMap.size()==0)
              return null;
        return orgMap.get("orgId");
    }

    public Map<String, String> getParentOrgFormByOrgId(String orgId) {
        Map<String, String> orgMap = restTemplate.getForObject(orgUrl + "/rest/opus/om/getParentDistrictEntity.do?orgId=" + orgId, Map.class);
        if(orgMap.size()>0)
          return orgMap;
        return null;
    }

    public List searchOrg(String orgName, String parentOrgId, String seq) {
        List list = restTemplate.getForObject(orgUrl + "/rest/opus/om/searchOrg.do?orgName="+orgName+"&parentOrgId="+parentOrgId+"&seq="+seq, List.class);
        return list;
    }

    public List<Map> listAllOpuOmUserByOrgId(String orgId) {
        List list = restTemplate.getForObject(orgUrl + "/rest/opus/om/listAllOpuOmUserByOrgId.do?orgId="+orgId, List.class);
        return list;
    }

    public List getDistrictList() {
        List list = restTemplate.getForObject(orgUrl + "/rest/opus/om/getDistrict.do", List.class);
        return list;
    }

    public List<Map> getOpuOmOrgAsyncZTree(String orgId) {
        List<Map> list = restTemplate.getForObject(orgUrl + "/rest/opus/om/getOpuOmOrgAsyncZTree.do?orgId=" + orgId, List.class);
        return list;
    }

    public List<Map<String, String>> listOpuOmOrgByOrgTypeAndOrgId(String[] orgIds, String[] orgTypes){
        String queryStr = "";
        if(orgIds != null){
            for (String orgId : orgIds) {
                queryStr+="orgIds=" + orgId + "&";
            }
        }
        if(orgTypes != null) {
            for (String orgType : orgTypes) {
                queryStr+="orgTypes=" + orgType + "&";
            }
        }
        queryStr = queryStr.substring(0, queryStr.length() - 1);
        List<Map<String, String>> list = restTemplate.getForObject(orgUrl + "/rest/opus/om/listOpuOmOrgByOrgTypeAndOrgId.do?" + queryStr, List.class);
        return list;
    }

    public OpuOmOrg getOrgByOrgId(String orgId) {
        OpuOmOrg opuOmOrg = restTemplate.getForObject(orgUrl + "/rest/opus/om/getOrgByOrgId.do?orgId="+orgId, OpuOmOrg.class);
        return opuOmOrg;
    }
    public Map getOrgByOrgOmId(String orgId) {
        Map om = restTemplate.getForObject(orgUrl + "/rest/opus/om/getOrgByOrgId.do?orgId="+orgId, Map.class);
        return om;
    }

    public List<Map> listOpuOmOrgByOrgType(String orgType) {
        List list = restTemplate.getForObject(orgUrl + "/rest/opus/om/listOpuOmOrgByOrgType.do?orgType="+orgType, List.class);
        return list;
    }

    public List<Map<String, String>> listSelfAndChildUserOrgsByOrgId(String orgId) {
        List<Map<String, String>> list = restTemplate.getForObject(orgUrl + "/rest/opus/om/listSelfAndChildUserOrgsByOrgId.do?orgId="+ orgId, List.class);
        return list;
    }

    public List<String> listOpuOmOrgIdByUserId(String userId) {
        if(StringUtils.isEmpty(userId)){
            throw new IllegalArgumentException("userId不能为空！");
        }
        ResponseEntity<List<String>> entity = restTemplate.exchange(new RequestEntity<String>(HttpMethod.GET, URI.create(orgUrl + "/rest/opus/om/listOpuOmOrgIdByUserId.do?userId="+ userId)), new ParameterizedTypeReference<List<String>>(){}) ;
        return entity.getBody();
    }

    public List<OpuAcRoleUser> getRolesByUserId(String userId) {
        if(StringUtils.isEmpty(userId)){
            throw new IllegalArgumentException("userId不能为空！");
        }
        ResponseEntity<List<OpuAcRoleUser>> entity = restTemplate.exchange(new RequestEntity<String>(HttpMethod.GET, URI.create(orgUrl + "/rest/opus/ac/getRolesByUserId.do?userId="+ userId)), new ParameterizedTypeReference<List<OpuAcRoleUser>>(){}) ;
        return entity.getBody();
    }

    public List<String> listOpuOmOrgIdByUserId(String userId, String[] orgTypes){
        Map<String,Object> values = new HashMap<>();
        values.put("userId",userId);
        values.put("orgTypes",orgTypes);
        HttpEntity httpEntity = new HttpEntity(values);
        return restTemplate.postForObject(orgUrl + "/rest/opus/om/listOpuOmOrgIdByUserId.do",httpEntity, List.class);
    }

    public List listAllOpuOmUsersByOrgId(String orgId){
        return restTemplate.getForObject(orgUrl + "/rest/opus/om/listAllOpuOmUserByOrgId.do?orgId="+ orgId, List.class);
    }

    /**
     * 根据角色编码获取角色
     */
    @Override
    public PageInfo<Map> listAllRolesByAppId(String roleCode, String appId, Page page){
        Map<String,Object> values = new HashMap<>();
        values.put("roleCode",roleCode);
        values.put("appId",appId);
        values.put("page",page);
        HttpEntity httpEntity = new HttpEntity(values);
        return restTemplate.postForObject(orgUrl + "/rest/opus/rs/listAllRolesByAppId.do",httpEntity, PageInfo.class);
    }

    /**
     *机构查询(根据机构登记和类型)
     * 如果是查询指定机构的下一级机构:请传入parentOrgId
     如果是查询指定机构的所有子孙机构请传入orgId
     * */
    @Override
    public List<Map> listOpuOmOrg(Map map){
        Map<String,Object> values = new HashMap<>();
        values.put("opuOmOrg",map);
        HttpEntity httpEntity = new HttpEntity(values);
        return restTemplate.postForObject(orgUrl + "/rest/opus/rs/listOpuOmOrg.do",httpEntity, List.class);
    }
    /**
     * 查询用户所属组织及其上级组织
     * */
    @Override
    public List<OpuOmOrg> listOpuOmOrgByUserId(String userId){
        ResponseEntity<List<OpuOmOrg>> entity = restTemplate.exchange(new RequestEntity<String>(HttpMethod.GET, URI.create(orgUrl + "/rest/opus/om/listOpuOmOrgByUserId.do?userId="+ userId)), new ParameterizedTypeReference<List<OpuOmOrg>>(){}) ;
        return entity.getBody();
    }

    @Override
    public OpuRsRole getRoleByRoleCode(String roleCode) {
        return restTemplate.getForObject(orgUrl + "/rest/opus/rs/getRoleByRoleCode.do?roleCode="+ roleCode, OpuRsRole.class);
    }

    @Override
    public List<OpuOmUser> listOpuOmUserByRoleId(String roleId) {
        return restTemplate.exchange(orgUrl + "/rest/opus/om/listOpuOmUserByRoleId.do?roleId="+ roleId,HttpMethod.GET,
               null, new ParameterizedTypeReference<List<OpuOmUser>>(){}).getBody();
    }

    @Override
    public List<OpuRsRole> listRoleByUserId(String userId) {
        return restTemplate.exchange(orgUrl + "/rest/opus/rs/listRoleByUserId.do?userId="+ userId,HttpMethod.GET,
                null, new ParameterizedTypeReference<List<OpuRsRole>>(){}).getBody();
    }



    /**
     *机构查询(根据机构登记和类型)
     * 如果是查询指定机构的下一级机构:请传入parentOrgId
     如果是查询指定机构的所有子孙机构请传入orgId
     * */
    @Override
    public List<OpuOmOrg> listOpuOmOrg(OpuOmOrg map){
        Map<String,Object> values = new HashMap<>();
        values.put("opuOmOrg",map);
        HttpEntity httpEntity = new HttpEntity(values);
        return restTemplate.exchange(orgUrl + "/rest/opus/om/listOpuOmOrg.do",HttpMethod.POST, httpEntity,
                new ParameterizedTypeReference<List<OpuOmOrg>>(){}).getBody();
    }
    @Override
    public OpuOmOrg getOpuOmOrgIdByOrgId(String orgId) {
        OpuOmOrg orgMap = restTemplate.getForObject(orgUrl + "/rest/opus/om/getOrgByOrgId.do?orgId=" + orgId, OpuOmOrg.class);
        return orgMap;
    }

    @Override
    public List<OpuOmUserInfo> getUsersByOrgIdAndGroupId(String groupId ,String orgId) {
        Map<String,Object> values = new HashMap<>();
        values.put("groupId",groupId);
        values.put("orgId",orgId);
        HttpEntity httpEntity = new HttpEntity(values);
        return restTemplate.exchange(orgUrl + "/rest/opus/om/getUsersByOrgIdAndGroupId.do",HttpMethod.POST, httpEntity,
                new ParameterizedTypeReference<List<OpuOmUserInfo>>(){}).getBody();
    }
}