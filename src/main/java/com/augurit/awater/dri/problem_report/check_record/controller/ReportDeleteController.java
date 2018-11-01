package com.augurit.awater.dri.problem_report.check_record.controller;

import com.alibaba.fastjson.JSON;
import com.augurit.agcloud.common.controller.BaseController;
import com.augurit.awater.dri.utils.ParamsToFrom;
import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.framework.security.user.OpuOmUser;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.agcloud.org.service.IPsOrgUserService;
import com.augurit.awater.dri.problem_report.check_record.service.IReportDeleteService;
import com.augurit.awater.dri.problem_report.check_record.web.form.ReportDeleteForm;
import com.augurit.awater.dri.utils.ResultForm;
import net.sf.json.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RequestMapping("/reportDelete")
@Controller
public class ReportDeleteController extends BaseController<ReportDeleteForm> {

	@Autowired
	private IReportDeleteService reportDeleteService;
	@Autowired
	private IOmOrgRestService omOrgRestService;
	@Autowired
	private IOmUserInfoRestService userInfoRestService;
	@Autowired
	private IPsOrgUserService psOrgUserService;


	/**
	 *查看上报人当天数据 
	 * */
	@RequestMapping(value = "/getToDay",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String getToDay(HttpServletRequest request, HttpServletResponse response){
		JSONObject json = new JSONObject();
		List<Map> list = new ArrayList<>();
		try {
			ReportDeleteForm form = (ReportDeleteForm)ParamsToFrom.paramsTofrom(request,ReportDeleteForm.class);
			if(form.getDeleteTime()!=null && StringUtils.isNotBlank(form.getPersonUserId())){
                page= reportDeleteService.search(page,form);
                if(page.getResult()!=null){
                    json.put("rows", page.getResult());
                    json.put("total", page.getTotalItems());
                }else{
                    json.put("rows",list);
                    json.put("total", 0);
                }
                json.put("success", true);
            }else{
                json.put("success", false);
                json.put("message", "参数错误!");
            }
            return json.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}
	/**
	 * pc端页面展示删除数据
	 * */
	@RequestMapping(value = "/getCountList",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String getCountList(HttpServletRequest request,HttpServletResponse response){
		JSONObject json = new JSONObject();
		try {
			OpuOmUser userForm = SecurityContext.getCurrentUser();
			ReportDeleteForm form = (ReportDeleteForm)ParamsToFrom.paramsTofrom(request,ReportDeleteForm.class);
			Map<String,Object> map = new HashMap<String, Object>();
			String orgId =  psOrgUserService.getParentOrgId(userForm.getUserId());
			if(orgId!=null){
				map.put("parentOrgId",orgId);
			}
			if(StringUtils.isNotBlank(form.getParentOrgName())){
                map.put("parentOrgName", form.getParentOrgName());
            }
			if(StringUtils.isNotBlank(form.getDeletePerson())){
                map.put("userName", form.getDeletePerson());
            }
			if(StringUtils.isNotBlank(form.getParentOrgName())){
                map.put("parentOrgName", form.getParentOrgName());
            }
			if(form.getDeleteTime()!=null){
                map.put("deleteTime", form.getDeleteTime());
            }
			json.put("rows", reportDeleteService.getCountTodayAndTotal(map,page));
			json.put("total", page.getTotalItems());
			json.put("status", true);
			return json.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}
}