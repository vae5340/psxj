package com.augurit.awater.bpm.xcyh.reassign.service;

import com.augurit.awater.bpm.xcyh.reassign.domain.ReassignProcess;

import java.util.List;

public interface IReassignProcessService {
	List<ReassignProcess> getReassignByTaskId(String taskId)throws Exception;
	ReassignProcess getReassignProcessById(String id)throws Exception;
	void saveReassignProcess(ReassignProcess reassignProcess)throws Exception;
	void deleteReassignProcess(String id)throws Exception;

    List<ReassignProcess> getReassingByTaskIds(List<String> taskIds);
}