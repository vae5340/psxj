package com.augurit.awater.bpm.xcyh.opuTag.service;

import com.augurit.agcloud.opus.common.domain.OpuOmTag;
import com.augurit.agcloud.opus.common.domain.OpuOmTagUser;

import java.util.List;

public interface SelfOpuOmTagService {
    OpuOmTag getOpuOmTagById(String tagId) throws Exception;
    OpuOmTag getOpuOmTagByCode(String tagCode) throws Exception;
    List<OpuOmTag> listOpuOmTag(OpuOmTag opuOmTag) throws Exception;
    List<OpuOmTag> listOpuOmTagByUserId(String userId) throws Exception;
    List<OpuOmTagUser> listOpuOmTagUser(OpuOmTagUser opuOmTagUser) throws Exception;
    List<OpuOmTagUser> listOpuOmTagUserByTagCode(String tagCode) throws Exception;
    List<OpuOmTagUser> listOpuOmTagUserByTagId(String tagId) throws Exception;
    boolean isRgRm(String userId) throws Exception;
}
