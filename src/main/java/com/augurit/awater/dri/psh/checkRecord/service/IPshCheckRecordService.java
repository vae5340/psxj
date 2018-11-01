package com.augurit.awater.dri.psh.checkRecord.service;

import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.awater.dri.psh.checkRecord.web.form.PshCheckRecordForm;

import java.util.List;


public interface IPshCheckRecordService extends ICrudService<PshCheckRecordForm, Long> {
	
	/**
	 * 倒序查询审核记录
	 * */
	public List<PshCheckRecordForm> searchForm(PshCheckRecordForm form);
	public String toCheckRecord(String reportEntity, String reportId);
}