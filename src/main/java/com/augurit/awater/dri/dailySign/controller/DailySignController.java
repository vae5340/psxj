package com.augurit.awater.dri.dailySign.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.augurit.agcloud.common.controller.BaseController;
import com.augurit.awater.dri.dailySign.service.IDailySignService;
import com.augurit.awater.dri.dailySign.web.form.DailySignForm;
import com.augurit.awater.dri.dailySign.web.form.SignStatisticsForm;
import com.augurit.awater.dri.utils.ResultForm;
import com.augurit.awater.util.DateUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.augurit.awater.common.page.Page;

import javax.websocket.server.PathParam;
import java.util.*;

@RequestMapping("/dailySign")
@Controller
public class DailySignController extends BaseController<DailySignForm>{

	@Autowired
	private IDailySignService dailySignService;

	/**
	 *
	 * @return 查询签到记录
	 */
	@RequestMapping(value = "getDailySignList",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String getDailySignList( DailySignForm form,String startTime){
		Map<String,Object> params=null;
		JSONObject jsonObject= null;
		try {
			Date startTimeDate = StringUtils.isNotBlank(startTime) ?new Date(Long.valueOf(startTime)) :null;
			if(null!=startTimeDate ){
                params=new HashMap<>();
                params.put("startTime",startTimeDate);
                //设置结束时间为当前日期的23:59:59
                Calendar c =Calendar.getInstance();
                c.setTime(startTimeDate);
                c.set(c.get(Calendar.YEAR),c.get(Calendar.MONTH),c.get(Calendar.DAY_OF_MONTH),23,59,59);
                params.put("endTime",c.getTime());
            }

			Page<DailySignForm> dailySignFormPage=dailySignService.getDailySignListAll(page,form,params);
			jsonObject = new JSONObject();
			if(null!=dailySignFormPage) {
                jsonObject.put("rows", dailySignFormPage.getResult());
                jsonObject.put("total", dailySignFormPage.getTotalItems());
            }
			return jsonObject.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"参数错误!"));
		}
	}

	/**
	 *
	 * @return 返回一条用户签到记录，含用户信息
	 */
	@RequestMapping(value = "/getUserSignRecord/{id}",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String getUserSignRecord(@PathVariable("id") Long id){
		DailySignForm form=null;
		if(null!=id)
			form=dailySignService.getUserSignInfo(id);
		ResultForm resultForm=new ResultForm(200,form!=null?form:new DailySignForm());
		return JSON.toJSONString(resultForm);
	}

	@RequestMapping(value = "/getStatisticsInfo",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String getStatisticsInfo( DailySignForm form,String startTime){
		List<SignStatisticsForm> signStatisticsForms= null;
		try {
			Date startTimeDate = StringUtils.isNotBlank(startTime)? new Date(Long.valueOf(startTime)) : null;
			String orgName=form.getOrgName();
			if(null==orgName){
                orgName="全市";
            }
			signStatisticsForms = null;
			if(null!=orgName){
                //根据orgCode查出所有的用户当天和昨天的签到信息
                Calendar calendar=Calendar.getInstance();
                if(null!=startTimeDate) {
                //当天
                    calendar.setTime(startTimeDate);
                }
                String today= DateUtils.dateTimeToString(calendar.getTime(),"yyyyMMdd");
                //前一天
                calendar.add(Calendar.DAY_OF_MONTH,-1);
                String lastDay=DateUtils.dateTimeToString(calendar.getTime(),"yyyyMMdd");
                signStatisticsForms=dailySignService.getSignStatisticsInfo(orgName,today,lastDay);
            }
			return JSON.toJSONString(new ResultForm(200,signStatisticsForms));
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"参数错误!"));
		}
	}

}