package com.augurit.awater.dri.psh.sewerageUser.service;


import com.augurit.awater.bpm.common.service.ICrudService;
import com.augurit.awater.dri.psh.sewerageUser.web.form.SewerageUserAttachmentForm;

import java.util.List;


public interface ISewerageUserAttachmentService extends ICrudService<SewerageUserAttachmentForm, Long> {

	List<SewerageUserAttachmentForm> getListBySewerageUserId(String id);

	List<SewerageUserAttachmentForm> getByTypeAndSewerageUserId(String type, String id);
	void deleteBySewerageUserIdAndType(String id, String type);
}