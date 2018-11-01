package com.augurit.awater.dri.problem_report.correct_mark.service;

import java.util.List;
import java.util.Map;

import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.agcloud.framework.security.user.OpuOmUser;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.problem_report.correct_mark.web.form.CorrectMarkForm;
import com.augurit.awater.dri.problem_report.lack_mark.web.form.LackMarkForm;
import com.augurit.awater.dri.rest.util.arcgis.form.FeatureForm;


public interface ICorrectMarkService extends ICrudService<CorrectMarkForm, Long> {

	Page<CorrectMarkForm> searchFromAndMap(Page<CorrectMarkForm> page, CorrectMarkForm corrFrom, Map<String, Object> map);
	Page<CorrectMarkForm> searchFromAndMapPc(Page<CorrectMarkForm> page, CorrectMarkForm corrFrom,Map<String, Object> map);

	String seeCorrectMark(Long id);

	String getCorrectMarks(String loginName, Page<CorrectMarkForm> page,
			CorrectMarkForm form, Map<String, Object> map);

	void updateForm(CorrectMarkForm f);

	String getCorrectMarkList(OpuOmUser userForm, Page<CorrectMarkForm> page, CorrectMarkForm form,
							  Map<String, Object> map);

	String searchEachts(CorrectMarkForm form, Map<String, Object> map);
	
	Map<String, String> getFrom(String loginName);

	List<Map<String, Object>> getLatestTenList();

	Map<String, Object> searchCorrectMark(Page page, String layerName,
			String parentOrgName, String parentOrgName2, Map<String, Object> map, String path);

	Map<String, Object> seeCorrectMark(String path, long parseLong);

	String getParentOrgName(String loginName);

	Boolean featureToSaveForm(FeatureForm takse);

	void featureToUpdateForm(FeatureForm form);

	String checkForm(String checkState, String checkDesription, OpuOmUser userForm, String isCheck, Long id);
	/**
	 * 获取各审批状态的数量
	 * @param userForm 
	 * @return
	 */
	public String getNum(OpuOmUser userForm,CorrectMarkForm form,Map<String,Object> map);

	Boolean updateFeatureToForm(FeatureForm takse, String string);

	String saveAFeatureFormJs(OpuOmUser userForm);

	String getCorrectAndLackMarks(OpuOmUser userForm, Page<CorrectMarkForm> page,
			CorrectMarkForm form, Map<String, Object> map);

	String toFeatureAttach(String path, String objectId, String reportType);
	/**
	 * pc端的上报页面查询
	 * */
	public String searchSbPage(OpuOmUser userForm,Page<CorrectMarkForm> page,
			CorrectMarkForm form, Map<String, Object> map);

	String getFormId(String isCheck, CorrectMarkForm form);

	String toPastNowDay(String layerName);

	Map<String, Object> toPartsCount(CorrectMarkForm form,
			Map<String, Object> map);
	
	LackMarkForm getLackForm(Long id);
	
	List<Long> getNotSyncForm(String string, String object, String string2);
	
	String deleteReport(String reportType, String reportId, String loginName, String phoneBrand);
	
	void updateFeatureVoToForm(FeatureForm takse, String string);
	
	void save(LackMarkForm lackForm);
	
	Map<String, Object> searchCorrectAndLackMark(Page page, String loginName,
			String layerName, String parentOrgName, Map<String, Object> map,
			String path);
	List<Map<String, Object>> countRoad(Map<String, Object> map);
	String getRepeatReport(OpuOmUser userForm, Page<CorrectMarkForm> page,
			CorrectMarkForm form, Map<String, Object> map);
	String getRepeatReportDetail(Page<CorrectMarkForm> page,
			CorrectMarkForm form);
	CorrectMarkForm getFormByObjId(String ObjId);
	
	/**
	 * pc端的上报页面查询应开未开井
	 * */
	public String searchNotCorrectPage(OpuOmUser userForm,Page<CorrectMarkForm> page,
			CorrectMarkForm form, Map<String, Object> map);
	
	/**
	 * pc端的导出全部数据到excel
	 * */
	public List<Object[]> getExcelData(CorrectMarkForm form);
	
	/**
	 * 删除已开井
	 * */
	public int delCorrected();
	String getFormByObjectId(String isCheck, CorrectMarkForm form);

}