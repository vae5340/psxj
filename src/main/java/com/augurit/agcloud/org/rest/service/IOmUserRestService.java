package com.augurit.agcloud.org.rest.service;

import com.augurit.agcloud.framework.security.user.OpuOmUser;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;

import java.util.List;
import java.util.Map;

public interface IOmUserRestService {


    OpuOmUser getOpuOmUser(String userId);

    PageInfo<Map> listAllOpuOmUserInfoByOrgId(String orgId, PageInfo page);
}
