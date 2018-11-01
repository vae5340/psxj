package com.augurit.awater.dri.psh.sewerageUser.service;


import com.augurit.awater.bpm.common.service.ICrudService;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.psh.sewerageUser.web.form.SewerageUserForm;

public interface ISewerageUserService extends ICrudService<SewerageUserForm, Long> {

	String searchPage(Page<SewerageUserForm> page, SewerageUserForm form);
}