package com.augurit.awater.dri.patrolTrack.web;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.augurit.agcloud.common.controller.BaseController;
import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.framework.security.user.OpuOmUser;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.patrolTrack.convert.TrackLineConvertor;
import com.augurit.awater.dri.patrolTrack.convert.TrackPointConvertor;
import com.augurit.awater.dri.patrolTrack.entity.TrackLine;
import com.augurit.awater.dri.patrolTrack.service.ITrackLineService;
import com.augurit.awater.dri.patrolTrack.web.form.TrackLineForm;
import com.augurit.awater.util.DateUtil;
import com.augurit.awater.util.StringUtil;
import org.apache.commons.lang.StringUtils;
import org.apache.taglibs.standard.tag.common.sql.DataSourceUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springside.modules.utils.DataUtils;

import javax.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/trackLine")
public class TrackLineController extends BaseController<TrackLineForm>{

	@Autowired
	private ITrackLineService trackLineService;

	/**
	 * 分页查询
	 * */
	@RequestMapping(value = "/getPageList",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String getPageList(String startTime, String endTime, TrackLineForm form, BindingResult bindingResult){
		OpuOmUser userForm =  SecurityContext.getCurrentUser();
		Page page = new Page();
		String pageSize = this.request.getParameter("page.pageSize");
		String pageNo = this.request.getParameter("page.pageNo");
		if(StringUtils.isNotBlank(pageSize) && StringUtil.isNotBlank(pageNo)){
			try {
				page.setPageNo(Integer.valueOf(pageNo));
				page.setPageSize(Integer.valueOf(pageSize));
			} catch (NumberFormatException e) {
				e.printStackTrace();
			}
		}
		Map<String,Object> map = new HashMap();
		if(startTime!=null || endTime!=null){
			map.put("startTime", DateUtil.stringToDate(startTime,"yyyy-MM-dd"));
			map.put("endTime", DateUtil.stringToDate(endTime,"yyyy-MM-dd"));
		}
		return trackLineService.getPageList(userForm,page, form,map);
	}

}