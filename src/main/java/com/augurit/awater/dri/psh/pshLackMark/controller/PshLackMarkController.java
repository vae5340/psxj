package com.augurit.awater.dri.psh.pshLackMark.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.augurit.agcloud.common.controller.BaseController;
import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.agcloud.org.rest.service.IOmUserRestService;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.psh.pshLackMark.rest.util.arcgis.form.DataFormToFeatureConvertor;
import com.augurit.awater.dri.psh.pshLackMark.rest.util.arcgis.form.FeatureForm;
import com.augurit.awater.dri.psh.pshLackMark.rest.util.arcgis.timer.SynchronousData;
import com.augurit.awater.dri.psh.pshLackMark.service.IPshLackMarkService;
import com.augurit.awater.dri.psh.pshLackMark.web.form.PshLackMarkForm;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@RequestMapping("/pshLackMark")
@Controller
public class PshLackMarkController extends BaseController<PshLackMarkForm>{

	@Autowired
	private IPshLackMarkService lackMarkService;
	@Autowired
	private IOmUserInfoRestService userInfoRestService;

	/**
	 * 获取所有的上报数据
	 * */
	@RequestMapping(value = "/getAllLackAndCorrect",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String getAllLackAndCorrect(PshLackMarkForm form, String startTime,String endTime){
		OpuOmUserInfo userForm =  userInfoRestService.
				getOpuOmUserInfoByLoginName(SecurityContext.getCurrentUser().getLoginName());
		Map<String,Object> map = new HashMap<>();
		if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
			map.put("startTime", new Date(Long.valueOf(startTime)));
			map.put("endTime", new Date(Long.valueOf(endTime)));
		}
		return lackMarkService.getAllLackAndCorrect(userForm,form,map,page);
	}
	
	/**
	 * 首页地图上显示各区上报数量
	 * */
	@RequestMapping(value = "/showAreaData",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String showAreaData(PshLackMarkForm form){
//		LoginUserForm userForm = (LoginUserForm) getSession().getAttribute(AdsFwContext.SESSION_LOGIN_USER);
		Map<String,Object> map = new HashMap<>();
//		if(getStartTime()!=null && getEndTime()!=null){
//			map.put("startTime", getStartTime());
//			map.put("endTime", getEndTime());
//		}
		return lackMarkService.showAreaData(form,map);
	}
	/**
	 *reportStatistics.js
	 *上报统计
	 *按人统计
	 * */
	@RequestMapping(value = "/statisticsForPerson",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String statisticsForPerson( PshLackMarkForm form, String startTime,String endTime){
		OpuOmUserInfo userForm =  userInfoRestService.
				getOpuOmUserInfoByLoginName(SecurityContext.getCurrentUser().getLoginName());
		Map<String,Object> map = new HashMap();
		if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
			map.put("startTime", new Date(Long.valueOf(startTime)));
			map.put("endTime", new Date(Long.valueOf(endTime)));
		}
		return lackMarkService.statisticsForPerson(userForm,form,map);
	}
	/**
	 *权属范围统计
	 * */
	@RequestMapping(value = "/qsfwtj",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String qsfwtj(String szqy,String qslx){
		Map<String,Object> map = new HashMap();
		if(StringUtils.isNotBlank(szqy) || StringUtils.isNotBlank(qslx)){
			map.put("szqy", szqy);
			map.put("qslx", qslx);
		}
		return lackMarkService.qsfwtj(map);
	}
	/**
	 *reportStatistics.js
	 *上报统计
	 *按区统计
	 * */
	@RequestMapping(value = "/statisticsForArea",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String statisticsForArea(PshLackMarkForm form,String startTime,String endTime){
		OpuOmUserInfo userForm =  userInfoRestService.
				getOpuOmUserInfoByLoginName(SecurityContext.getCurrentUser().getLoginName());
		Map<String,Object> map = new HashMap();
		if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
			map.put("startTime", new Date(Long.valueOf(startTime)));
			map.put("endTime", new Date(Long.valueOf(endTime)));
		}
		return lackMarkService.statisticsForArea(userForm,form,map);
	}
	
	/**
	 *reportStatistics.js
	 *上报统计
	 *按单位统计
	 * */
	@RequestMapping(value = "/statisticsForUnit",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String statisticsForUnit(PshLackMarkForm form,String startTime,String endTime){
		OpuOmUserInfo userForm =  userInfoRestService.
				getOpuOmUserInfoByLoginName(SecurityContext.getCurrentUser().getLoginName());
		Map<String,Object> map = new HashMap();
		if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
			map.put("startTime", new Date(Long.valueOf(startTime)));
			map.put("endTime", new Date(Long.valueOf(endTime)));
		}
		return lackMarkService.statisticsForUnit(userForm,form,map);
	}
	/**
	 * 日志的统计图表
	 * */
	@RequestMapping(value = "/searchEachts",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String searchEachts(PshLackMarkForm form,String startTime,String endTime){
		OpuOmUserInfo userForm =  userInfoRestService.
				getOpuOmUserInfoByLoginName(SecurityContext.getCurrentUser().getLoginName());
		Map<String,Object> map = new HashMap<>();
		if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
			map.put("startTime", new Date(Long.valueOf(startTime)));
			map.put("endTime", new Date(Long.valueOf(endTime)));
		}
		return lackMarkService.searchEachts(form,map);
	}
	/**
	 * 查看详细
	 * */
	@RequestMapping(value = "/seeLackMark",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String seeLackMark(String id){
		return lackMarkService.seeLackMark(Long.valueOf(id));
	}
	/**
	 * 分页查询
	 * */
	@RequestMapping(value = "/getLackMarks",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String getLackMarks(PshLackMarkForm form,String startTime,String endTime){
		OpuOmUserInfo userForm =  userInfoRestService.
				getOpuOmUserInfoByLoginName(SecurityContext.getCurrentUser().getLoginName());
//		String sblx=getRequest().getParameter("sblx");
//		if("1".equals(sblx)){
//			form.setIsBinding("1");//数据确认
//		}else {
//			form.setIsBinding("0");//数据新增
//		}
		Map<String,Object> map = new HashMap();
		if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
			map.put("startTime", new Date(Long.valueOf(startTime)));
			map.put("endTime", new Date(Long.valueOf(endTime)));
		}
		return lackMarkService.getLackMarkList(userForm,page,form,map);
	}
	/**
	 * 上报分页查询
	 * */
	@RequestMapping(value = "/searchSbPage",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String searchSbPage(PshLackMarkForm form,String startTime,String endTime){
		OpuOmUserInfo userForm =  userInfoRestService.
				getOpuOmUserInfoByLoginName(SecurityContext.getCurrentUser().getLoginName());
		Map<String,Object> map = new HashMap();
		if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
			map.put("startTime", new Date(Long.valueOf(startTime)));
			map.put("endTime", new Date(Long.valueOf(endTime)));
		}
		if(StringUtils.isNotBlank(form.getPcode())&&StringUtils.isNotBlank(form.getChildCode())){
			form.setPcode(null);
		}
		return lackMarkService.searchSbPage(userForm,page,form,map);
	}
	/**
	 * pc端页面修改方法
	 * */
	@RequestMapping(value = "/updateForm",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String updateForm(PshLackMarkForm form,String startTime,String endTime){
		JSONObject json = new JSONObject();
		if(form!=null && form.getId()!=null){
			form.setUpdateTime(new Date());
			if(form.getIsAddFeature().equals("1")){// 未同步数据
				FeatureForm feature = DataFormToFeatureConvertor.convertLackVoToForm(form);
				Boolean flag = SynchronousData.updateFeature(feature);
				if(flag){
					lackMarkService.save(form);
				}
				json.put("success", flag);
			}else{
				lackMarkService.save(form);
				json.put("success", true);
			}
		}else{
			json.put("success", false);
		}
		return json.toString();
	}
}