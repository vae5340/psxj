package com.augurit.awater.dri.psh.pshLackMark.service;

import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.problem_report.correct_mark.web.form.CorrectMarkForm;
import com.augurit.awater.dri.psh.pshLackMark.rest.util.arcgis.form.FeatureForm;
import com.augurit.awater.dri.psh.pshLackMark.web.form.PshLackMarkForm;

import java.util.List;
import java.util.Map;


public interface IPshCorrectMarkService extends ICrudService<CorrectMarkForm, Long> {

	Page<CorrectMarkForm> searchFromAndMap(Page<CorrectMarkForm> page, CorrectMarkForm corrFrom, Map<String, Object> map);
	Page<CorrectMarkForm> searchFromAndMapPc(Page<CorrectMarkForm> page, CorrectMarkForm corrFrom, Map<String, Object> map);

	String seeCorrectMark(Long id);

	String getCorrectMarks(String loginName, Page<CorrectMarkForm> page,
                           CorrectMarkForm form, Map<String, Object> map);

	void updateForm(CorrectMarkForm f);

	String getCorrectMarkList(OpuOmUserInfo userForm, Page<CorrectMarkForm> page, CorrectMarkForm form,
                              Map<String, Object> map);

	String searchEachts(CorrectMarkForm form, Map<String, Object> map);
	
	Map<String, String> getFrom(String loginName);

	String getLatestTenList();

	Map<String, Object> searchCorrectMark(Page page, String layerName,
                                          String parentOrgName, String parentOrgName2, Map<String, Object> map, String path);

	Map<String, Object> seeCorrectMark(String path, long parseLong);

	String getParentOrgName(String loginName);

	Boolean featureToSaveForm(FeatureForm takse);

	void featureToUpdateForm(FeatureForm form);

	String checkForm(String checkState, String checkDesription, OpuOmUserInfo userForm, String isCheck, Long id);
	/**
	 * 获取各审批状态的数量
	 * @param userForm 
	 * @return
	 */
	public String getNum(OpuOmUserInfo userForm, CorrectMarkForm form, Map<String, Object> map);

	Boolean updateFeatureToForm(FeatureForm takse, String string);

	String saveAFeatureFormJs(OpuOmUserInfo userForm);

	String getCorrectAndLackMarks(OpuOmUserInfo userForm, Page<CorrectMarkForm> page,
                                  CorrectMarkForm form, Map<String, Object> map);

	String toFeatureAttach(String path, String objectId, String reportType);
	/**
	 * pc端的上报页面查询
	 * */
	public String searchSbPage(OpuOmUserInfo userForm, Page<CorrectMarkForm> page,
                               CorrectMarkForm form, Map<String, Object> map);

	String getFormId(String isCheck, CorrectMarkForm form);

	String toPastNowDay(String layerName);

	Map<String, Object> toPartsCount(CorrectMarkForm form,
                                     Map<String, Object> map);
	
	PshLackMarkForm getLackForm(Long id);
	
	List<Long> getNotSyncForm(String string, String object, String string2);
	
	String deleteReport(String reportType, String reportId, String loginName, String phoneBrand);
	
	void updateFeatureVoToForm(FeatureForm takse, String string);
	
	void save(PshLackMarkForm lackForm);
	
	Map<String, Object> searchCorrectAndLackMark(Page page, String loginName,
                                                 String layerName, String parentOrgName, Map<String, Object> map,
                                                 String path);
	List<Map<String, Object>> countRoad(Map<String, Object> map);
	String getRepeatReport(OpuOmUserInfo userForm, Page<CorrectMarkForm> page,
                           CorrectMarkForm form, Map<String, Object> map);
	String getRepeatReportDetail(Page<CorrectMarkForm> page,
                                 CorrectMarkForm form);

}