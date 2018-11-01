package com.augurit.awater.dri.problem_report.lack_mark.controller;

import com.alibaba.fastjson.JSON;
import com.augurit.agcloud.common.controller.BaseController;
import com.augurit.awater.dri.problem_report.correct_mark.service.ICorrectMarkService;
import com.augurit.awater.dri.utils.ParamsToFrom;
import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.framework.security.user.OpuOmUser;
import com.augurit.awater.dri.problem_report.lack_mark.service.ILackMarkService;
import com.augurit.awater.dri.problem_report.lack_mark.web.form.LackMarkForm;
import com.augurit.awater.dri.rest.util.arcgis.form.DataFormToFeatureConvertor;
import com.augurit.awater.dri.rest.util.arcgis.form.FeatureForm;
import com.augurit.awater.dri.rest.util.arcgis.timer.SynchronousData;
import com.augurit.awater.dri.utils.ResultForm;
import net.sf.json.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RequestMapping("/lackMark")
@Controller
public class LackMarkController extends BaseController<LackMarkForm> {

	@Autowired
	private ILackMarkService lackMarkService;
	@Autowired
	private ICorrectMarkService correctMarkService;

	/**
	 *reportStatistics.js
	 *上报统计
	 *按人统计
	 * */
	@RequestMapping(value = "/statisticsForWtlx",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String statisticsForWtlx(HttpServletRequest request, HttpServletResponse response,String startTime, String endTime){
		try {
			LackMarkForm form = (LackMarkForm) ParamsToFrom.paramsTofrom(request,LackMarkForm.class);
			OpuOmUser omuser=  SecurityContext.getCurrentUser();
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Map<String,Object> 	map = new HashMap<>();
			if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
                Date startDate = new Date(Long.valueOf(startTime));
                Date endDate = new Date(Long.valueOf(endTime));
				map.put("startTime", startDate);
				map.put("endTime", endDate);
            }
			return lackMarkService.statisticsForWtlx(omuser,form,map).toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}

	/**
	 * 获取所有的上报数据
	 * */
	@RequestMapping(value = "/getAllLackAndCorrect",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String getAllLackAndCorrect(HttpServletRequest request,HttpServletResponse response,String startTime,String endTime){
		try {
			LackMarkForm form = (LackMarkForm) ParamsToFrom.paramsTofrom(request,LackMarkForm.class);
			OpuOmUser omuser=  SecurityContext.getCurrentUser();
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Map<String,Object> 	map = new HashMap<>();
			if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
                Date startDate = new Date(Long.valueOf(startTime));
                Date endDate = new Date(Long.valueOf(endTime));
				map.put("startTime", startDate);
				map.put("endTime", endDate);
            }
			return lackMarkService.getAllLackAndCorrect(omuser,form,map,page).toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}

	/**
	 * 首页地图上显示各区上报数量
	 * */
	@RequestMapping(value = "/showAreaData",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String showAreaData(HttpServletRequest request,HttpServletResponse response){
		try {
			LackMarkForm form = (LackMarkForm) ParamsToFrom.paramsTofrom(request,LackMarkForm.class);
			Map<String,Object> map = new HashMap<>();
			return lackMarkService.showAreaData(form,map).toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}
	/**
	 *reportStatistics.js
	 *上报统计
	 *按人统计
	 * */
	@RequestMapping(value = "/statisticsForPerson",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String statisticsForPerson(HttpServletRequest request,HttpServletResponse response,String startTime,String endTime){
		try {
			LackMarkForm form = (LackMarkForm) ParamsToFrom.paramsTofrom(request,LackMarkForm.class);
			OpuOmUser omuser=  SecurityContext.getCurrentUser();
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Map<String,Object> 	map = new HashMap<>();
			if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
                Date startDate = new Date(Long.valueOf(startTime));
                Date endDate = new Date(Long.valueOf(endTime));
                map.put("startTime", startDate);
                map.put("endTime", endDate);
            }
			return lackMarkService.statisticsForPerson(omuser,form,map).toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}
	/**
	 *权属范围统计
	 * */
	@RequestMapping(value = "/qsfwtj",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String qsfwtj(String szqy,String qslx){
		Map<String,Object> map = new HashMap();
		map.put("szqy", szqy);
		map.put("qslx", qslx);
		return lackMarkService.qsfwtj(map).toString();
	}
	/**
	 *reportStatistics.js
	 *上报统计
	 *按区统计
	 * */
	@RequestMapping(value = "/statisticsForArea",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String statisticsForArea(HttpServletRequest request,HttpServletResponse response,String startTime,String endTime){
		OpuOmUser userForm= null;
		Map<String,Object> 	map = null;
		try {
			LackMarkForm form = (LackMarkForm) ParamsToFrom.paramsTofrom(request,LackMarkForm.class);
			userForm = SecurityContext.getCurrentUser();
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			map = new HashMap<>();
			if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
                Date startDate = new Date(Long.valueOf(startTime));
                Date endDate = new Date(Long.valueOf(endTime));
                map.put("startTime", startDate);
                map.put("endTime", endDate);
            }
            return lackMarkService.statisticsForArea(userForm,form,map).toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}

	/**
	 *reportStatistics.js
	 *上报统计
	 *按单位统计
	 * */
	@RequestMapping(value = "/statisticsForUnit",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String statisticsForUnit(HttpServletRequest request,HttpServletResponse response,String startTime,String endTime){
		OpuOmUser userForm= null;
		Map<String,Object> 	map = null;
		try {
			LackMarkForm form = (LackMarkForm) ParamsToFrom.paramsTofrom(request,LackMarkForm.class);
			userForm = SecurityContext.getCurrentUser();
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			map = new HashMap<>();
			if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
                Date startDate = new Date(Long.valueOf(startTime));
                Date endDate = new Date(Long.valueOf(endTime));
				map.put("startTime", startDate);
				map.put("endTime", endDate);
            }
            return lackMarkService.statisticsForUnit(userForm,form,map).toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}
	/**
	 * 日志的统计图表
	 * */
	@RequestMapping(value = "/searchEachts",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String searchEachts(HttpServletRequest request,HttpServletResponse response,String startTime,String endTime){
		OpuOmUser userForm= null;
		Map<String,Object> 	map = null;
		try {
			LackMarkForm form = (LackMarkForm) ParamsToFrom.paramsTofrom(request,LackMarkForm.class);
			userForm = SecurityContext.getCurrentUser();
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			map = new HashMap<>();
			if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
                Date startDate = new Date(Long.valueOf(startTime));
                Date endDate = new Date(Long.valueOf(endTime));
				map.put("startTime", startDate);
				map.put("endTime", endDate);
            }
			return lackMarkService.searchEachts(form,map).toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}
	/**
	 * 查看详细
	 * */
	@RequestMapping(value = "/seeLackMark",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String seeLackMark(Long id){
		return lackMarkService.seeLackMark(id);
	}
	/**
	 * 分页查询
	 * */
	@RequestMapping(value = "/getLackMarks",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String getLackMarks(HttpServletRequest request,HttpServletResponse response,String startTime,String endTime){
		OpuOmUser userForm= null;
		Map<String,Object> 	map = null;
		try {
			LackMarkForm form = (LackMarkForm) ParamsToFrom.paramsTofrom(request,LackMarkForm.class);
			userForm = SecurityContext.getCurrentUser();
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			map = new HashMap<>();
			if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
				Date startDate = new Date(Long.valueOf(startTime));
				Date endDate = new Date(Long.valueOf(endTime));
				map.put("startTime", startDate);
				map.put("endTime", endDate);
			}
			return lackMarkService.getLackMarkList(userForm,page,form,map).toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}
	/**
	 * 上报分页查询
	 * */
	@RequestMapping(value = "/searchSbPage",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String searchSbPage(HttpServletRequest request,HttpServletResponse response,String startTime,String endTime){
		OpuOmUser userForm= null;
		Map<String,Object> 	map = null;
		try {
			LackMarkForm form = (LackMarkForm) ParamsToFrom.paramsTofrom(request,LackMarkForm.class);
			userForm = SecurityContext.getCurrentUser();
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			map = new HashMap<>();
			if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
				Date startDate = new Date(Long.valueOf(startTime));
				Date endDate = new Date(Long.valueOf(endTime));
				map.put("startTime", startDate);
				map.put("endTime", endDate);
			}
			if(StringUtils.isNotBlank(form.getPcode())&&StringUtils.isNotBlank(form.getChildCode())){
				form.setPcode(null);
			}
		  	return lackMarkService.searchSbPage(userForm,page,form,map).toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}
	/**
	 * pc端页面修改方法
	 * */
	@RequestMapping(value = "/updateForm",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String updateForm(HttpServletRequest request,HttpServletResponse response) {
		JSONObject json = null;
		try {
			LackMarkForm form = (LackMarkForm) ParamsToFrom.paramsTofrom(request,LackMarkForm.class);
			json = new JSONObject();
			if (form != null && form.getId() != null) {
                form.setUpdateTime(new Date());
                if ("1".equals(form.getIsAddFeature())) {// 未同步数据
                    FeatureForm feature = DataFormToFeatureConvertor.convertLackVoToForm(form);
                    Boolean flag = SynchronousData.updateFeature(feature);
                    if (flag) {
                        lackMarkService.save(form);
                    }
                    json.put("success", flag);
                } else {
                    lackMarkService.save(form);
                    json.put("success", true);
                }
            } else {
                json.put("success", false);
            }
			return json.toString().toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}
}