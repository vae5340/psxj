package com.augurit.awater.bpm.xcyh.opuTag.mapper;

import java.util.List;

import com.augurit.agcloud.opus.common.domain.OpuOmTag;
import com.augurit.agcloud.opus.common.domain.OpuOmTagUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public abstract interface SelfOpuOmTagMapper
{
    /**
     * 获取角色列表
     * @param opuOmTag
     * @return
     * @throws Exception
     */
    List<OpuOmTag> listOpuOmTag(OpuOmTag opuOmTag) throws Exception;

    /**
     * 根据用户ID获取该用户的角色信息
     * @param userId
     * @return
     * @throws Exception
     */
    List<OpuOmTag> listOpuOmTagByUserId(@Param("userId") String userId) throws Exception;

    /**
     * 获取角色用户信息
     * @param opuOmTagUser
     * @return
     * @throws Exception
     */
    List<OpuOmTagUser> listOpuOmTagUser(OpuOmTagUser opuOmTagUser) throws Exception;

    /**
     * 根据角色ID获取角色用户信息
     * @param tagId
     * @return
     * @throws Exception
     */
    List<OpuOmTagUser> listOpuOmTagUserByTagId(@Param("tagId")String tagId) throws Exception;

    /**
     * 根据角色编码获取角色用户信息
     * @param tagCode
     * @return
     * @throws Exception
     */
    List<OpuOmTagUser> listOpuOmTagUserByTagCode(@Param("tagCode")String tagCode) throws Exception;

    /**
     * 根据角色ID获取角色信息
     * @param tagId
     * @return
     * @throws Exception
     */
    OpuOmTag getOpuOmTagById(@Param("tagId") String tagId) throws Exception;

    /**
     * 根据角色编码获取角色信息
     * @param tagCode
     * @return
     * @throws Exception
     */
    OpuOmTag getOpuOmTagByCode(@Param("tagCode") String tagCode) throws Exception;
}
