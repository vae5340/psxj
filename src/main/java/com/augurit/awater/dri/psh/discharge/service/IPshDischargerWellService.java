package com.augurit.awater.dri.psh.discharge.service;

import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.awater.dri.psh.discharge.web.form.PshDischargerForm;
import com.augurit.awater.dri.psh.discharge.web.form.PshDischargerWellForm;

import java.util.List;
import java.util.Map;


public interface IPshDischargerWellService extends ICrudService<PshDischargerWellForm, Long> {
	public List<PshDischargerWellForm> getAffList(String dischargeId);

	List<Map<String, Object>> getFormBySGuid(String sGuid);

	List<PshDischargerWellForm> getFormByObjectId(String objectId);

	void saveAndToTc(PshDischargerWellForm form,
					 PshDischargerForm dischargerForm, String isExist);

	void deleteAndToTc(Long[] ids);
}