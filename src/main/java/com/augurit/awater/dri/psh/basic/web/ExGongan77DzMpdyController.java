package com.augurit.awater.dri.psh.basic.web;

import com.augurit.agcloud.common.controller.BaseController;
import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.agcloud.org.service.IPsOrgUserService;
import com.augurit.awater.dri.psh.basic.service.IExGongan77DzMpdyService;
import com.augurit.awater.dri.psh.basic.web.form.ExGongan77DzMpdyForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;


@Controller
@RequestMapping(value = "/exGongan77DzMpdy")
public class ExGongan77DzMpdyController extends BaseController<ExGongan77DzMpdyForm> {

	@Autowired
	private IExGongan77DzMpdyService exGongan77DzMpdyService;
	@Autowired
	private IOmUserInfoRestService userInfoRestService;
	@Autowired
	private IPsOrgUserService psOrgUserService;

	/**
	 * 门牌查询
	 * */
	@RequestMapping(value = "/getMpList",produces="application/json;charset=UTF-8")
	@ResponseBody
	public String getMpList(ExGongan77DzMpdyForm form){
		OpuOmUserInfo userForm =  userInfoRestService.
				getOpuOmUserInfoByLoginName(SecurityContext.getCurrentUser().getLoginName());
		return exGongan77DzMpdyService.getMpList(userForm,page,form);
	}
}