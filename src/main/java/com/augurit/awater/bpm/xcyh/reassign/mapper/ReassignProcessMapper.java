package com.augurit.awater.bpm.xcyh.reassign.mapper;

import com.augurit.awater.bpm.xcyh.reassign.domain.ReassignProcess;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReassignProcessMapper {
    void insertReassignProcess(ReassignProcess reassignProcess) throws Exception;
    void updateReassignProcess(ReassignProcess reassignProcess) throws Exception;
    void deleteReassignProcess(@Param("id") String id) throws Exception;
    List<ReassignProcess> listReassignProcess(ReassignProcess reassignProcess) throws Exception;
    ReassignProcess getReassignProcessById(@Param("id") String id) throws Exception;
    List<ReassignProcess> getReassingByTaskIds(@Param("list") List<String> taskIds );
}
