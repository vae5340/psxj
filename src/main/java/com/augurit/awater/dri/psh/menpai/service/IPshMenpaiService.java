package com.augurit.awater.dri.psh.menpai.service;

import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.psh.menpai.web.form.PshMenpaiForm;

import java.util.Map;



public interface IPshMenpaiService extends ICrudService<PshMenpaiForm, Long> {

	void saveAndToTc(PshMenpaiForm form);

	void updateForm(PshMenpaiForm f);


	void deleteAndToTc(PshMenpaiForm mpForm);

	Page<PshMenpaiForm> getMpList(Page<PshMenpaiForm> page, PshMenpaiForm form, Map<String, Object> map);
	/**
	 * 根据门牌id获取
	 * */
	public  PshMenpaiForm getBySGuid(String sGuid);
	/**
	 * 根据houseId获取
	 * */
	public PshMenpaiForm getByHouseId(String houseId);
}