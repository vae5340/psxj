package com.augurit.awater.dri.problem_report.diary.controller;

import com.alibaba.fastjson.JSON;
import com.augurit.agcloud.common.controller.BaseController;
import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.awater.dri.utils.ParamsToFrom;
import com.augurit.awater.dri.problem_report.diary.service.IDiaryService;
import com.augurit.awater.dri.problem_report.diary.web.form.DiaryForm;
import com.augurit.awater.dri.utils.ResultForm;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;


@RequestMapping("/diary")
@Controller
public class DiaryController extends BaseController<DiaryForm> {

	@Autowired
	private IDiaryService diaryService;


	/**
	 * 日志的统计图表
	 * */
	@RequestMapping(value = "/searchEachts",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String searchEachts(HttpServletRequest request, HttpServletResponse response,String startTime, String endTime){
	/*	Enumeration<String> emStr =  request.getSession().getAttributeNames();
		while(emStr.hasMoreElements()){
			System.out.println(emStr.nextElement());
		}*/
		SecurityContext.getOpusLoginUser();
		Map<String,Object> map = null;
		try {
			DiaryForm form = (DiaryForm) ParamsToFrom.paramsTofrom(request,DiaryForm.class);
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			map = new HashMap<>();
			if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
                map.put("startTime", new Date(Long.valueOf(startTime)));
                map.put("endTime",  new Date(Long.valueOf(endTime)));
            }
			return diaryService.searchEachts(form,map).toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}
	
	/**
	 * 查看详细
	 * */
	@RequestMapping(value = "/seeDiary",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String seeDiary(Long id){
		return diaryService.seeDiary(id).toString();
	}
	/**
	 * 分页查询
	 * */
	@RequestMapping(value = "/getDiary",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String getDiary(HttpServletRequest request,HttpServletResponse response,String startTime,String endTime){
		try {
			DiaryForm form = (DiaryForm) ParamsToFrom.paramsTofrom(request,DiaryForm.class);
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Map<String,Object> map = new HashMap<>();
			if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
                map.put("startTime", new Date(Long.valueOf(startTime)));
                map.put("endTime", new Date(Long.valueOf(endTime)));
            }
			return diaryService.getDiary(page,form,map).toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}

	/**
	 *达标统计
	 * */
	@RequestMapping(value = "/statistics1",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String statistics1(HttpServletRequest request,HttpServletResponse response,String startTime,String endTime){
		try {
			DiaryForm form = (DiaryForm) ParamsToFrom.paramsTofrom(request,DiaryForm.class);
			Map<String,Object> map = new HashMap<>();
			if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
                map.put("startTime", new Date(Long.valueOf(startTime)));
                map.put("endTime", new Date(Long.valueOf(endTime)));
            }
			return diaryService.statistics1(form,map);
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"参数类型错误!"));
		}
	}
	/**
	 *处理失效统计
	 * */
	@RequestMapping(value = "/statistics2",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String statistics2(HttpServletRequest request,HttpServletResponse response,String startTime,String endTime){
		try{
			DiaryForm form = (DiaryForm) ParamsToFrom.paramsTofrom(request,DiaryForm.class);
			Map<String,Object> map = new HashMap<>();
			if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
				map.put("startTime", new Date(Long.valueOf(startTime)));
				map.put("endTime", new Date(Long.valueOf(endTime)));
			}
			return diaryService.statistics2(form,map);
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"参数类型错误!"));
		}
	}
	/**
	 *处理失效统计 按单位
	 * */
	@RequestMapping(value = "/statistics22",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String statistics22(HttpServletRequest request,HttpServletResponse response,String startTime,String endTime){
		try{
			DiaryForm form = (DiaryForm) ParamsToFrom.paramsTofrom(request,DiaryForm.class);
			Map<String,Object> map = new HashMap<>();
			if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
				map.put("startTime", new Date(Long.valueOf(startTime)));
				map.put("endTime", new Date(Long.valueOf(endTime)));
			}
			return diaryService.statistics22(form,map);
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"参数类型错误!"));
		}
	}
	/**
	 *环节统计
	 * */
	@RequestMapping(value = "/statistics3",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String statistics3(HttpServletRequest request,HttpServletResponse response,String startTime,String endTime){
		try{
			DiaryForm form = (DiaryForm) ParamsToFrom.paramsTofrom(request,DiaryForm.class);
			Map<String,Object> map = new HashMap<>();
			if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
				map.put("startTime", new Date(Long.valueOf(startTime)));
				map.put("endTime", new Date(Long.valueOf(endTime)));
			}
			return diaryService.statistics3(form,map);
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"参数类型错误!"));
		}
	}
	/**
	 *环节统计 按单位
	 * */
	@RequestMapping(value = "/statistics33",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String statistics33(HttpServletRequest request,HttpServletResponse response,String startTime,String endTime){
		try{
			DiaryForm form = (DiaryForm) ParamsToFrom.paramsTofrom(request,DiaryForm.class);
			Map<String,Object> map = new HashMap<>();
			if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
				map.put("startTime", new Date(Long.valueOf(startTime)));
				map.put("endTime", new Date(Long.valueOf(endTime)));
			}
			return diaryService.statistics33(form,map);
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"参数类型错误!"));
		}
	}
	/**
	 *各类井的问题数 按区
	 * */
	@RequestMapping(value = "/statistics4",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String statistics4(HttpServletRequest request,HttpServletResponse response,String startTime,String endTime){
		try{
			DiaryForm form = (DiaryForm) ParamsToFrom.paramsTofrom(request,DiaryForm.class);
			Map<String,Object> map = new HashMap<>();
			if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
				map.put("startTime", new Date(Long.valueOf(startTime)));
				map.put("endTime", new Date(Long.valueOf(endTime)));
			}
			return diaryService.statistics4(form,map);
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"参数类型错误!"));
		}
	}
	/**
	 *各类井的问题数 按单位
	 * */
	@RequestMapping(value = "/statistics44",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String statistics44(HttpServletRequest request,HttpServletResponse response,String startTime,String endTime){
		try{
			DiaryForm form = (DiaryForm) ParamsToFrom.paramsTofrom(request,DiaryForm.class);
			Map<String,Object> map = new HashMap<>();
			if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
				map.put("startTime", new Date(Long.valueOf(startTime)));
				map.put("endTime", new Date(Long.valueOf(endTime)));
			}
			return diaryService.statistics44(form,map);
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"参数类型错误!"));
		}
	}
}