package com.augurit.awater.bpm.xcyh.reassign.service.impl;

import com.augurit.awater.bpm.xcyh.reassign.domain.ReassignProcess;
import com.augurit.awater.bpm.xcyh.reassign.mapper.ReassignProcessMapper;
import com.augurit.awater.bpm.xcyh.reassign.service.IReassignProcessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ReassignProcessServiceImpl implements IReassignProcessService {

	@Autowired
	private ReassignProcessMapper reassignProcessMapper;

	@Override
	public List<ReassignProcess> getReassignByTaskId(String taskId) throws Exception{
		if(taskId==null||"".equals(taskId)){
			return null;
		}
		ReassignProcess reassignProcess = new ReassignProcess();
		reassignProcess.setTaskId(taskId);
		return reassignProcessMapper.listReassignProcess(reassignProcess);
	}

	@Override
	public ReassignProcess getReassignProcessById(String id) throws Exception {
		if(id==null||"".equals(id)){
			return null;
		}
		return reassignProcessMapper.getReassignProcessById(id);
	}


	@Override
	public void deleteReassignProcess(String id) throws Exception {
		reassignProcessMapper.deleteReassignProcess(id);
	}

	@Override
	public void saveReassignProcess(ReassignProcess reassignProcess) throws Exception {
		if(reassignProcess.getId()==null||"".equals(reassignProcess.getId())) {
			reassignProcess.setId(UUID.randomUUID().toString());
			reassignProcessMapper.insertReassignProcess(reassignProcess);
		}else{
			reassignProcessMapper.updateReassignProcess(reassignProcess);
		}
	}
	@Override
	public List<ReassignProcess> getReassingByTaskIds(List<String> taskIds){
		if(taskIds!=null && taskIds.size()>0){
			return reassignProcessMapper.getReassingByTaskIds(taskIds);
		}else{
			return null;
		}
	}
}