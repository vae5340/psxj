package com.augurit.awater.dri.problem_report.check_record.service;

import java.util.List;

import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.awater.dri.problem_report.check_record.web.form.CheckRecordForm;

public interface ICheckRecordService extends ICrudService<CheckRecordForm, Long> {

	String toCheckRecord(String reportType, String reportId);
	public List<CheckRecordForm> searchForm(CheckRecordForm form);
}