package com.augurit.agcloud.org.rest.service;

import com.augurit.agcloud.opus.common.domain.OpuOmUser;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;

import java.util.List;
import java.util.Map;

public interface IOmUserInfoRestService {


    Map getOpuOmUserInfoByUserId(String loginName);

    OpuOmUserInfo getOpuOmUserInfoByLoginName(String loginName);

    List<OpuOmUserInfo> listOpuOmUserInfoByOrgId(String orgId);

    PageInfo<OpuOmUserInfo> listAllOpuOmUserInfoByOrgId(String orgId, OpuOmUser user, Page page);
}
