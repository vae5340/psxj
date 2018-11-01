package com.augurit.agcloud.org.service;

import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.agcloud.opus.common.domain.OpuOmUser;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;

import java.util.List;

/**
 * Created by HOWS on 2018-07-21.
 */
public interface IPsOrgUserService {


    String getParentOrgId(String userId);

    OpuOmOrg getParentOrgByUserId(String userId);

    List<OpuOmOrg> getParentOrgsByUserId(String userId);

    List<OpuOmUser> getUsersByRoleCode(String roleCode);

    List<OpuOmOrg> listOmOrgByUserId(String userId);

    List<OpuOmOrg> listOmOrgByRank(String orgRank);

    List<OpuOmUserInfo> listWorkGroupByOrgId(String groupId, String orgId);

    List<OpuOmUserInfo> listUsersByOrgId(String orgId);

    List<OpuOmUserInfo> listChildUsersByOrgId(String orgId);

    OpuOmOrg getOrgByOrgCode(String orgCode);

    List<OpuOmOrg> getChildOrgsByOrgId(String orgId);

    List<OpuOmUser> getGroupByOrgId(String groupId, String[] orgIds);

    List<OpuOmOrg> getOrgsByUserId(String userId);

    OpuOmUser getUserByUserId(String userId);
}
