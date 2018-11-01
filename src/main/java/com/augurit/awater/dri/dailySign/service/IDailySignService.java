package com.augurit.awater.dri.dailySign.service;

import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.dailySign.web.form.DailySignForm;
import com.augurit.awater.dri.dailySign.web.form.OrgSignForm;
import com.augurit.awater.dri.dailySign.web.form.SignStatisticsForm;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

public interface IDailySignService extends ICrudService<DailySignForm, Long> {
    DailySignForm getUserSignRecord(String userId,String date);
    DailySignForm getUserSignInfo(Long id);
    DailySignForm getUserMonthlySignRecord(String userId,String yearMonth) throws ParseException;
    OrgSignForm getOrgSignRecord(String orgName, String date);
    SignStatisticsForm getSignStatisticsInfo(String orgName, String date);
    List<SignStatisticsForm> getSignStatisticsInfo(String orgName,String today,String lastDay);
    Page<DailySignForm> getDailySignList(Page<DailySignForm> page,DailySignForm dailySignForm, Map params);
    Page<DailySignForm> getDailySignListAll(Page<DailySignForm> page, DailySignForm dailySignForm, Map params) ;
}