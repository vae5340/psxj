package com.augurit.awater.dri.problem_report.diary.service;

import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.awater.dri.problem_report.diary.web.form.DiaryAttachmentForm;

import java.util.List;


public interface IDiaryAttachmentService extends ICrudService<DiaryAttachmentForm, Long> {

	List<DiaryAttachmentForm> getMarkId(String markId);

	String deleteDiaryAttach(String id);

	public void deleteIds(String attachment);
}