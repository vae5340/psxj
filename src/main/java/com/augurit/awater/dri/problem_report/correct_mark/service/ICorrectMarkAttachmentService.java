package com.augurit.awater.dri.problem_report.correct_mark.service;

import java.util.List;

import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.awater.dri.problem_report.correct_mark.web.form.CorrectMarkAttachmentForm;

public interface ICorrectMarkAttachmentService extends ICrudService<CorrectMarkAttachmentForm, Long> {

	List<CorrectMarkAttachmentForm> getMarkId(String markId);

	String deleteCorrAttach(String id);

	void deleteIds(String attachment) throws NumberFormatException;
}