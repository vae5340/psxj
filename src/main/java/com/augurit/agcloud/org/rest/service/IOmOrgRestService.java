package com.augurit.agcloud.org.rest.service;

import com.augurit.agcloud.opus.common.domain.*;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;

import java.util.List;
import java.util.Map;

public interface IOmOrgRestService {

    /**
     * 查询全部机构信息
     *
     * @param orgId
     * @return
     */
    List<Map> getOrgAndTeam(String orgId);

    /**
     * 根据orgId查询parentOrgId
     *
     * @param orgId
     * @return
     */
    String getParentOrgIdByOrgId(String orgId);

    /**
     * 根据orgId查询parentOrgForm
     *
     * @param orgId
     * @return
     */
    Map<String, String> getParentOrgFormByOrgId(String orgId);

    List getDistrictList();

    List searchOrg(String orgName, String parentOrgId, String seq);

    Map getOpuOmOrgByOrgId(String orgId);

    List<Map> listAllOpuOmUserByOrgId(String orgId);

    /**
     * 展开组织ztree树
     *
     * @param orgId
     * @return
     */
    List<Map> getOpuOmOrgAsyncZTree(String orgId);

    /**
     * 根据orgId获取org
     *
     * @param orgId
     * @return
     */
    OpuOmOrg getOrgByOrgId(String orgId);

    Map getOrgByOrgOmId(String orgId);

    List<String> listOpuOmOrgIdByUserId(String userId, String[] orgTypes);

    PageInfo<Map> listAllRolesByAppId(String roleCode, String appId, Page page);

    /**
     * 根据组织类型和组织ID查询组织
     *
     * @param orgIds
     * @param orgTypes
     * @return
     */
    List<Map<String, String>> listOpuOmOrgByOrgTypeAndOrgId(String[] orgIds, String[] orgTypes);


    /**
     * 根据组织类型查找组织
     *
     * @param orgType
     * @return
     */
    List<Map> listOpuOmOrgByOrgType(String orgType);

    /**
     * 查询组织及其子孙机构下的所有关联信息
     *
     * @param orgId
     * @return
     */
    List<Map<String, String>> listSelfAndChildUserOrgsByOrgId(String orgId);

    /**
     * 根据userId查找机构Id
     *
     * @param userId
     * @return
     */
    List<String> listOpuOmOrgIdByUserId(String userId);


    /**
     * 根据userId获取角色列表
     *
     * @param userId
     * @return
     */
    List<OpuAcRoleUser> getRolesByUserId(String userId);


    List<Map> listOpuOmOrg(Map map);

    /**
     * 根据用户ID获取机构信息
     * @param userId
     * @return
     */
    List<OpuOmOrg> listOpuOmOrgByUserId(String userId);

    /**
     * 根据用户ID获取用户信息
     * @param userName
     * @return
     */
    OpuOmUserInfo getOpuOmUserInfoByLoginName(String userName);

    /**
     * 根据角色代码获取角色
     * @param roleCode
     * @return
     */
    OpuRsRole getRoleByRoleCode(String roleCode);

    List<OpuOmUser> listOpuOmUserByRoleId(String roleId);

    List<OpuRsRole> listRoleByUserId(String userId);

    List<OpuOmOrg> listOpuOmOrg(OpuOmOrg map);

    OpuOmOrg getOpuOmOrgIdByOrgId(String orgId);

    List<OpuOmUserInfo> getUsersByOrgIdAndGroupId(String groupId, String orgId);
}
