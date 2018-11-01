package com.augurit.awater.dri.psh.discharge.service;

import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.agcloud.framework.security.user.OpuOmUser;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.psh.discharge.web.form.PshDischargerForm;
import com.augurit.awater.dri.psh.discharge.web.form.PshDischargerWellForm;

import java.util.List;
import java.util.Map;


public interface IPshDischargerService extends ICrudService<PshDischargerForm, Long> {

	Page<PshDischargerForm> search(Page<PshDischargerForm> page,
                                   PshDischargerForm form, Map<String, Object> map);

	String getLatestTenList();
	Page<PshDischargerForm> searchCollectAll(Page<PshDischargerForm> page, PshDischargerForm form, Map<String, Object> map);
	Map getUsersFrom(String loginName);
	Map<String,Object> countCollect(PshDischargerForm form, Map<String, Object> map);
	List<Map<String,Object>> toPartsAndChart(Map<String, Object> map);
	Map toPastNowDay(Map<String, Object> map);
	PshDischargerForm getFormByUnitId(String unitId);

	String getPshList(OpuOmUser userForm, Page<PshDischargerForm> page,
					  PshDischargerForm form, Map<String, Object> map);

	String seePsh(String id, String path);
	
	/**
	 *上报统计
	 *按区统计
	 * */
	public String statisticsForArea(OpuOmUserInfo user, PshDischargerForm form, Map<String, Object> map);
	
	/**
	 *上报统计
	 *按单位统计
	 * */
	public String statisticsForUnit(OpuOmUserInfo user, PshDischargerForm form, Map<String, Object> map);
	/**
	 *上报统计
	 *按人统计
	 * */
	public String statisticsForPerson(OpuOmUserInfo user, PshDischargerForm form, Map<String, String> map);

	List<PshDischargerForm> getFormBySGuid(String sGuid);
	//修改调查状态
	void updateDczt(PshDischargerForm pshForm);
	void deletePsh(String pshId, OpuOmUserInfo userForm);
	
	/**
	 * 按区获取上报数据
	 * */
	public String getSbedByArea();
	/**
	 * 设备安装统计
	 */
	public String getInstalledByArea();
	/**
	 * 按区获取上报数据
	 * */
	public String getSbedByUnit(String unitName);
	/**
	 * 安装率图表获取上报具体数据
	 * */
	public String getSbedInf(Page<PshDischargerForm> page, PshDischargerForm form);
	void getUsersFrom(PshDischargerForm form, String loginName)
			throws Exception;

	void addRow(PshDischargerForm form, Map<String, String> map,
				List<PshDischargerWellForm> wellList, OpuOmUserInfo userForm) throws Exception;

	String importSave(List<Map<String, Object>> list, OpuOmUserInfo userForm, String model)
			throws Exception;

	String statisticsForSh(PshDischargerForm form, Map<String, Object> map);
	/**
	 * 导出
	 * @param form
	 * @return
	 */
	public List<Object[]> getExcelData(PshDischargerForm form, Map<String, Object> map);

	String getKjTjByUnit(String area);

	String getKjTjByTown(String area, String town);

	String getKjTjByAll();
	
	/**
	 * pc端的导出excel
	 * */
	public List<Object[]> getExcelData(PshDischargerForm form);
}