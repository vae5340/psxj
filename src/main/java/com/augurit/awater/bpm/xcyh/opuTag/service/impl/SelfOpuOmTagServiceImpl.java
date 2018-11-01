package com.augurit.awater.bpm.xcyh.opuTag.service.impl;

import com.augurit.agcloud.opus.common.domain.OpuOmTag;
import com.augurit.agcloud.opus.common.domain.OpuOmTagUser;
import com.augurit.awater.bpm.xcyh.opuTag.mapper.SelfOpuOmTagMapper;
import com.augurit.awater.bpm.xcyh.opuTag.service.SelfOpuOmTagService;
import com.augurit.awater.bpm.xcyh.report.web.WfRestController;
import com.augurit.awater.util.StringUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SelfOpuOmTagServiceImpl implements SelfOpuOmTagService {
    private static Logger logger = LoggerFactory.getLogger(SelfOpuOmTagServiceImpl.class);
    @Autowired
    private SelfOpuOmTagMapper opuOmTagMapper;

    @Override
    public OpuOmTag getOpuOmTagById(String tagId) throws Exception {
        if(StringUtil.isEmpty(tagId)){
            return null;
        }
        return opuOmTagMapper.getOpuOmTagById(tagId);
    }
    @Override
    public OpuOmTag getOpuOmTagByCode(String tagCode) throws Exception {
        if(StringUtil.isEmpty(tagCode)){
            return null;
        }
        return opuOmTagMapper.getOpuOmTagByCode(tagCode);
    }
    @Override
    public List<OpuOmTag> listOpuOmTag(OpuOmTag opuOmTag) throws Exception {
        if(opuOmTag==null){
            return null;
        }
        return opuOmTagMapper.listOpuOmTag(opuOmTag);
    }
    @Override
    public List<OpuOmTag> listOpuOmTagByUserId(String userId) throws Exception {
        if(StringUtil.isEmpty(userId)){
            return null;
        }
        return opuOmTagMapper.listOpuOmTagByUserId(userId);
    }
    @Override
    public List<OpuOmTagUser> listOpuOmTagUser(OpuOmTagUser opuOmTagUser) throws Exception{
        if(opuOmTagUser==null){
            return null;
        }
        return opuOmTagMapper.listOpuOmTagUser(opuOmTagUser);
    }
    @Override
    public List<OpuOmTagUser> listOpuOmTagUserByTagCode(String tagCode) throws Exception{
        if(StringUtil.isEmpty(tagCode)){
            return null;
        }
        return opuOmTagMapper.listOpuOmTagUserByTagCode(tagCode);
    }
    @Override
    public List<OpuOmTagUser> listOpuOmTagUserByTagId(String tagId) throws Exception{
        if(StringUtil.isEmpty(tagId)){
            return null;
        }
        return opuOmTagMapper.listOpuOmTagUserByTagId(tagId);
    }

    @Override
    public boolean isRgRm(String userId) throws Exception{
        boolean result=false;
        List<OpuOmTag> list = opuOmTagMapper.listOpuOmTagByUserId(userId);
        if(list!=null&&list.size()>0){
            List<OpuOmTag> tempList = list.stream().filter(opuOmTag -> WfRestController.OPU_TAG_CODE_RG.equals(opuOmTag.getTagCode()) || WfRestController.OPU_TAG_CODE_RM.equals(opuOmTag.getTagCode())).collect(Collectors.toList());
            result= (tempList!=null&&tempList.size()>0);
        }
        return result;
    }
}
