package com.augurit.awater.dri.reportUpload.service;


import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.awater.dri.reportUpload.web.form.ReportUploadForm;

import java.util.Map;

public interface IReportUploadService extends ICrudService<ReportUploadForm, Long> {

	String deleteFile(Long id, String attachName);

	void saveForm(Map<String, Object> form);

	String getFiles(String path, String objectIds, String layerNames);
}