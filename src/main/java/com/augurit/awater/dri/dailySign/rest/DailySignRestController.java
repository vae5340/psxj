package com.augurit.awater.dri.dailySign.rest;

import com.alibaba.fastjson.JSON;
import com.augurit.agcloud.opus.common.domain.OpuOmUser;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.org.service.IPsOrgUserService;
import com.augurit.awater.dri.dailySign.service.IDailySignService;
import com.augurit.awater.dri.dailySign.web.form.DailySignForm;
import com.augurit.awater.dri.dailySign.web.form.OrgSignForm;
import com.augurit.awater.dri.dailySign.web.form.SignStatisticsForm;
import com.augurit.awater.dri.utils.ParamsToFrom;
import com.augurit.awater.util.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

/***
 * 签到
 * **/
@RestController
@RequestMapping({"/rest/app/dailySign"})
public class DailySignRestController {

	@Autowired
	private IDailySignService dailySignService;
	@Autowired
	private IOmOrgRestService omOrgRestService;
	@Autowired
	private IPsOrgUserService psOrgUserService;
	/***
	 *签到保存
	 * ****/
	@RequestMapping(value = "/sign",produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String sign(HttpServletRequest request){
		DailySignForm form= null;
		try {
			form = (DailySignForm) ParamsToFrom.paramsTofromApp(request, DailySignForm.class);
			Map isIn = omOrgRestService.getOrgByOrgOmId(form.getSignerId().toString());
			OpuOmUser opuOmUser = psOrgUserService.getUserByUserId(form.getSignerId().toString());
			if (isIn==null) {//如果该用户不在机构里面，直接结束掉，不存签到信息
                form=new DailySignForm();
                form.setSignTime(new Date());
                form.setFirstSign(false);
                return JSON.toJSONString(form);
            }
			//设置签到时间为当前时间
			if(null!=form) {
                Date now = Calendar.getInstance().getTime();
                DailySignForm dailySignForm=dailySignService.getUserSignRecord(form.getSignerId(), DateUtils.dateTimeToString(now,"yyyyMMdd"));
                //如果用户已经在当天完成签到，则不能重复签到
                if(null!=dailySignForm&&null!=dailySignForm.getId()){
                    form=new DailySignForm();
                    form.setSignTime(dailySignForm.getSignTime());
                    form.setFirstSign(false);
                    return JSON.toJSONString(form);
                }
                form.setOrgSeq(isIn.get("orgSeq").toString());//这里获取非排水户机构序列
                form.setOrgName(isIn.get("orgName").toString());
                form.setSignerName(opuOmUser.getUserName());
                form.setSignTime(now);
                form.setCreateTime(now);
                dailySignService.save(form);
                Date time=form.getSignTime();
                form=new DailySignForm();
                form.setSignTime(time);
                form.setFirstSign(true);
            }
		} catch (Exception e) {
			e.printStackTrace();
		}
		return JSON.toJSONString(form);
	}

	/**
	 * 查询用户一个月的签到记录
	 * **/
	@RequestMapping(value = "/getSignInfo/{signerId}/{yearMonth}",produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String getSignInfo(@PathVariable("signerId") String signerId, @PathVariable("yearMonth")String yearMonth) throws ParseException {
		DailySignForm dailySignForm=new DailySignForm();
		if(null!=signerId&&null!=yearMonth)
			dailySignForm = dailySignService.getUserMonthlySignRecord(signerId,yearMonth.trim());
		return JSON.toJSONString(dailySignForm);
	}

	/**
	 * 获取所有昨天和今天的签到数据
	 * **/
	@RequestMapping(value = "/getStatisticsInfo",produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String getStatisticsInfo(HttpServletRequest request){
		String orgName=request.getParameter("orgName");
		SignStatisticsForm result=new SignStatisticsForm();
		if(null!=orgName){
			//根据orgCode查出所有的用户当天和昨天的签到信息
			Calendar calendar=Calendar.getInstance();
			//当天
			String today=DateUtils.dateTimeToString(calendar.getTime(),"yyyyMMdd");
			//前一天
			calendar.add(Calendar.DAY_OF_MONTH,-1);
			String lastDay=DateUtils.dateTimeToString(calendar.getTime(),"yyyyMMdd");
			List<SignStatisticsForm> signStatisticsForms=dailySignService.getSignStatisticsInfo(orgName,today,lastDay);
			return JSON.toJSONString(signStatisticsForms);
		}
		return JSON.toJSONString(result);
	}

	/**
	 * 获取某一个月的签到情况
	 * **/
	@RequestMapping(value = "/getDetailSignInfo",produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String getDetailSignInfo(/*@PathVariable String orgName, @PathVariable String date,*/HttpServletRequest request){
		String orgName = request.getParameter("orgName");
		String date = request.getParameter("date");
		OrgSignForm orgSignForm=new OrgSignForm();
		if(null!=orgName&&null!=date){
			orgSignForm=dailySignService.getOrgSignRecord(orgName,date);
		}
		return JSON.toJSONString(orgSignForm);
	}
}
