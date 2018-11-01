package com.augurit.awater.bpm.sggc.service;

import com.augurit.awater.bpm.common.service.ICrudService;
import com.augurit.awater.bpm.sggc.entity.GxSggc;
import com.augurit.awater.bpm.sggc.web.form.GxSggcForm;
import com.augurit.awater.bpm.sggc.web.form.GxSggcLogForm;

import java.util.List;
import java.util.Map;

public interface IGxSggcService extends ICrudService<GxSggcForm, Long> {
	public String saveData(GxSggcForm form) throws Exception;
	public List<GxSggcForm> search(GxSggcForm form);
	public List<GxSggcLogForm> getHistoryCommentsByProcessInstanceId(String processInstanceId,String pkName) throws Exception;
	public String getAllName(String loginName);

    List<GxSggcForm> searcEntityBySjid(String SJID);

    List<Map> searchJbpm4HistTaskByEntityId(String sjid);
}