package com.augurit.awater.dri.problem_report.check_record.service;

import java.util.List;
import java.util.Map;

import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.awater.dri.problem_report.check_record.web.form.ReportDeleteForm;
import com.augurit.awater.common.page.Page;


public interface IReportDeleteService extends ICrudService<ReportDeleteForm, Long> {

	List<ReportDeleteForm> getDeleteStatus(String isDelete);

	Long getToDayCount(String userId);

	List<Map<String, Object>> getCountTodayAndTotal(Map<String, Object> map, Page<ReportDeleteForm> page);
}