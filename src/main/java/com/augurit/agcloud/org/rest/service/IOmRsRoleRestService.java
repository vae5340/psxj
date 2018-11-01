package com.augurit.agcloud.org.rest.service;

import com.augurit.agcloud.bsc.domain.BscDicCodeItem;
import com.augurit.agcloud.bsc.domain.BscDicCodeType;
import com.augurit.agcloud.framework.ui.base.ListCombo;
import com.augurit.agcloud.opus.common.domain.OpuRsRole;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface IOmRsRoleRestService {


    PageInfo<OpuRsRole> listAllRolesByAppId(String roleCode, String appId, Page page);

    List<com.augurit.agcloud.opus.common.domain.OpuOmUser> listOpuOmUserByRoleId(String roleId);

    List<OpuRsRole> listRoleByUserId(String userId);

    OpuRsRole getRoleByRoleCode(String roleCode);

    List<Map> listTypes(String typeKeyword, String orgId);

    List<BscDicCodeType> listTypess(String typeKeyword, String orgId);

    List<ListCombo> lgetItemsByTypeCode(String typeCode, String orgId);

    List<BscDicCodeItem> getItemTreeByTypeCode(String typeCode, String orgId) throws IOException;
}
