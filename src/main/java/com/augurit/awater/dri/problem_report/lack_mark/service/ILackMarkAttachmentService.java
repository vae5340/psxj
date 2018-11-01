package com.augurit.awater.dri.problem_report.lack_mark.service;

import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.awater.dri.problem_report.lack_mark.web.form.LackMarkAttachmentForm;

import java.util.List;


public interface ILackMarkAttachmentService extends ICrudService<LackMarkAttachmentForm, Long> {

	List<LackMarkAttachmentForm> getMarkId(String markId);

	String deleteLackAttach(String id);

	void deleteIds(String attachment)  throws NumberFormatException;
}