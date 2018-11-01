package com.augurit.awater.dri.problem_report.lack_mark.service;

import java.util.List;
import java.util.Map;

import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.agcloud.framework.security.user.OpuOmUser;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.problem_report.lack_mark.web.form.LackMarkForm;


public interface ILackMarkService extends ICrudService<LackMarkForm, Long> {

	Page<LackMarkForm> searchFromAndMap(Page<LackMarkForm> page,
			LackMarkForm corrFrom, Map<String, Object> map);
	
	Page<LackMarkForm> searchFromAndMapPc(Page<LackMarkForm> page,
			LackMarkForm corrFrom, Map<String, Object> map);

	String seeLackMark(Long id);

	String getLackMarks(String loginName, Page<LackMarkForm> page,
			LackMarkForm form, Map<String, Object> map);

	void updateForm(LackMarkForm f);

	String getLackMarkList(OpuOmUser userForm, Page<LackMarkForm> page, LackMarkForm form,
						   Map<String, Object> map);

	String searchEachts(LackMarkForm form, Map<String, Object> map);

	List<Map<String, Object>> getLatestTen();

	Map<String, Object> searchLackMark(Page page, String layerName, String parentOrgName, String parentOrgName2, Map<String, Object> map, String path);

	Map<String, Object> seeLackMark(String path, long parseLong);

	List<Map> searchNotFeature();

	List<LackMarkForm> getListLack(LackMarkForm lackForm);
	/**
	 * pc端上报页面查询
	 * */
	public String searchSbPage(OpuOmUser userForm,Page<LackMarkForm> page, LackMarkForm form,
			Map<String, Object> map);

	Map<String, Object> lackCount(LackMarkForm lackForm,
			Map<String, Object> map);
	
	/**
	 *上报统计
	 *按人统计
	 * */
	public String statisticsForPerson(OpuOmUser userForm, LackMarkForm form,Map<String, Object> map);
	/**
	 *上报统计
	 *按区统计
	 * */
	public String statisticsForArea(OpuOmUser userForm, LackMarkForm form,Map<String, Object> map);
	/**
	 *上报统计
	 *按单位统计
	 * */
	public String statisticsForUnit(OpuOmUser userForm, LackMarkForm form,Map<String, Object> map);
	/**
	 *上报统计
	 *按问题类型统计
	 * */
	public String statisticsForWtlx(OpuOmUser userForm, LackMarkForm form,Map<String, Object> map);

	List<Map<String, Object>> countRoad(Map<String, Object> map);
	/**
	 * 首页地图上显示各区上报数量
	 * */
	public String showAreaData(LackMarkForm form, Map<String, Object> map);
	/**
	 *获取所有的上报数据
	 * */
	public String getAllLackAndCorrect(OpuOmUser userForm, LackMarkForm form,Map<String, Object> map,Page<LackMarkForm> page);

	String qsfwtj(Map<String, Object> map);

	Map<String, Object> getFormByObjId(String path, String ObjId);
	/**
	 * 根据objectId获取唯一数据
	 * */
	public LackMarkForm getFormByObjId(String objectId);
}