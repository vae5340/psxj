package com.augurit.awater.psemgy.urgentMsg.mapper;

import com.augurit.awater.psemgy.urgentMsg.domain.DriUrgentMsg;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by HOWS on 2018-09-03.
 */
@Mapper
public interface DriUrgentMsgMapper {
    public List<DriUrgentMsg> findMsg (DriUrgentMsg msg) throws Exception;
    public DriUrgentMsg getMsg(@Param("id") String id) throws Exception;
    public DriUrgentMsg replyMsg(DriUrgentMsg msg);
}
