package com.augurit.awater.dri.problem_report.diary.service;

import java.util.Map;

import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.awater.dri.problem_report.diary.web.form.DiaryForm;
import com.augurit.awater.common.page.Page;


public interface IDiaryService extends ICrudService<DiaryForm, Long> {

	Page<DiaryForm> searchFromAndMap(Page<DiaryForm> page, DiaryForm corrFrom,
			Map<String, Object> map);

	String getDiary(Page<DiaryForm> page, DiaryForm form, Map<String, Object> map);

	String seeDiary(Long id);

	Page<DiaryForm> searchDiaryOfUser(String loginName, Page<DiaryForm> page,
			DiaryForm corrFrom, Map<String, Object> map);

	void updateForm(DiaryForm f);

	String searchEachts(DiaryForm form, Map<String, Object> map);

    String statistics1(DiaryForm form, Map<String, Object> map);

	String statistics2(DiaryForm form, Map<String, Object> map);

	String statistics22(DiaryForm form, Map<String, Object> map);

	String statistics3(DiaryForm form, Map<String, Object> map);

	String statistics33(DiaryForm form, Map<String, Object> map);

	String statistics4(DiaryForm form, Map<String, Object> map);

	String statistics44(DiaryForm form, Map<String, Object> map);

	String deleteDiary(String id);

	/**
	 * 获取当前设施的巡查日志
	 **/
	Page<DiaryForm> searchDiaryOfFacilty( String objectId, Page<DiaryForm> page,
										  DiaryForm corrFrom, Map<String, Object> map);

	Map<String, Object> seeDiaryMark(String path, long parseLong);

    Long getDiaryCount(String objectId);
}