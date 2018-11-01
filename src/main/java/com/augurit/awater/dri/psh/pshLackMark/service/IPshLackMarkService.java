package com.augurit.awater.dri.psh.pshLackMark.service;

import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.psh.pshLackMark.web.form.PshLackMarkForm;

import java.util.List;
import java.util.Map;



public interface IPshLackMarkService extends ICrudService<PshLackMarkForm, Long> {
	Page<PshLackMarkForm> searchFromAndMap(Page<PshLackMarkForm> page,
                                           PshLackMarkForm corrFrom, Map<String, Object> map);
	
	Page<PshLackMarkForm> searchFromAndMapPc(Page<PshLackMarkForm> page,
                                             PshLackMarkForm corrFrom, Map<String, Object> map);

	String seeLackMark(Long id);

	String getLackMarks(String loginName, Page<PshLackMarkForm> page,
                        PshLackMarkForm form, Map<String, Object> map);

	void updateForm(PshLackMarkForm f);

	String getLackMarkList(OpuOmUserInfo userForm, Page<PshLackMarkForm> page, PshLackMarkForm form,
						   Map<String, Object> map);

	String searchEachts(PshLackMarkForm form, Map<String, Object> map);

	List<Map<String, Object>> getLatestTen();

	Map<String, Object> searchLackMark(Page page, String layerName, String parentOrgName, String parentOrgName2, Map<String, Object> map, String path);

	Map<String, Object> seeLackMark(String path, long parseLong);

	List<Map> searchNotFeature();

	List<PshLackMarkForm> getListLack(PshLackMarkForm lackForm);
	/**
	 * pc端上报页面查询
	 * @param userForm
	 * */
	public String searchSbPage(OpuOmUserInfo userForm, Page<PshLackMarkForm> page, PshLackMarkForm form,
                               Map<String, Object> map);

	Map<String, Object> lackCount(PshLackMarkForm lackForm,
                                  Map<String, Object> map);
	
	/**
	 *上报统计
	 *按人统计
	 * */
	public String statisticsForPerson(OpuOmUserInfo userForm, PshLackMarkForm form, Map<String, Object> map);
	/**
	 *上报统计
	 *按区统计
	 * */
	public String statisticsForArea(OpuOmUserInfo userForm, PshLackMarkForm form, Map<String, Object> map);
	/**
	 *上报统计
	 *按单位统计
	 * */
	public String statisticsForUnit(OpuOmUserInfo userForm, PshLackMarkForm form, Map<String, Object> map);
	

	List<Map<String, Object>> countRoad(Map<String, Object> map);
	/**
	 * 首页地图上显示各区上报数量
	 * */
	public String showAreaData(PshLackMarkForm form, Map<String, Object> map);
	/**
	 *获取所有的上报数据
	 * */
	public String getAllLackAndCorrect(OpuOmUserInfo userForm, PshLackMarkForm form, Map<String, Object> map, Page<PshLackMarkForm> page);

	String qsfwtj(Map<String, Object> map);

	void saveAndToTc(PshLackMarkForm form);

	Map<String, Object> getFormByObjId(String path, String ObjId);
}