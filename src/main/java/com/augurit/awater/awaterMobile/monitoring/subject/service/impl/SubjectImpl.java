package com.augurit.awater.awaterMobile.monitoring.subject.service.impl;

import com.augurit.awater.awaterMobile.monitoring.subject.mapper.SubjectMapper;
import com.augurit.awater.awaterMobile.monitoring.subject.service.ISubject;
import com.augurit.awater.dri.common.MapToLowerCaseConvert;
import com.augurit.awater.util.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class SubjectImpl implements ISubject {

    @Autowired
    private SubjectMapper subjectMapper;

    @Override
    public Map<String, Object> getDateRange(HttpServletRequest request) throws Exception {
        String sttp=request.getParameter("sttp");
        String stcd=request.getParameter("stcd");
        String mnit=request.getParameter("mnit");
        Map paramMap = new HashMap<>();
        paramMap.put("sttp", sttp);
        paramMap.put("stcd", stcd);
        paramMap.put("mnit", mnit);
        Map<String,Object> result = null;
        result = subjectMapper.getDateRange(paramMap);
        if(result==null){
            result = new HashMap<String,Object>();
            result.put("stcd",stcd);
            result.put("max_date", DateUtil.dateToString(new Date()));
            result.put("min_date", "2016-01-01 00:00:00");
        }
        return MapToLowerCaseConvert.mapToCamelNameCase(result);
    }

    @Override
    public Map<String, Object> getStationProperties(HttpServletRequest request) {
        String sttp=request.getParameter("sttp");
        String stcd=request.getParameter("stcd");
        Map<String,Object> result = null;
        if(sttp.equals("ZZ")){//河道
            result = subjectMapper.getRiverProperties(stcd);
        }else if(sttp.equals("WL")){//积水点
            result = subjectMapper.getWaterpointsProperties(stcd);
        }else if(sttp.equals("UP")){//窨井
            result = subjectMapper.getConduitProperties(stcd);
        }else if(sttp.equals("DP")){//泵站没有特征指标
//            result = subjectMapper.getPumpProperties(stcd);
        }else if(sttp.equals("DD")){//水闸
            result = subjectMapper.getSluiceProperties(stcd);
        }else if(sttp.equals("RR")){//水库
            result = subjectMapper.getReservoirProperties(stcd);
        }
        //如果查不到特征值的话
        if(result==null){
            result = new HashMap<String,Object>();
            result.put("stcd",stcd);
        }
        return MapToLowerCaseConvert.mapToCamelNameCase(result);
    }

    /***
     * 通过时间段获取排水管网数据
     * @param request
     * @return
     * @throws Exception
     */
    @Override
    public List<Map<String, Object>> getDrainageDataByTime(HttpServletRequest request) throws Exception {
        String timetype=request.getParameter("timetype");
        String bytime=request.getParameter("time");
        String stcd = request.getParameter("stcd");
        Map<String, Object> pmap = new HashMap<String, Object>();
        pmap.put("stcd", stcd);
        List<Map<String, Object>> list=null;
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        Date date = sdf.parse(bytime);
        Calendar cal=Calendar.getInstance();
        cal.setTime(date);
        if(timetype.equals("当日")){
            cal.add(Calendar.DATE,1);
            Date d1after=cal.getTime();
            String bytime1after= sdf.format(d1after);
            String fromDate=bytime.substring(0,10)+" 00:00:00";
            String toDate=bytime1after.substring(0,10)+" 00:00:00";
            pmap.put("fromDate", fromDate);
            pmap.put("toDate", toDate);
            list= subjectMapper.getDrainageHis(pmap);
        }else if(timetype.equals("近一周")||timetype.equals("近一月")){
            if(timetype.equals("近一周"))cal.add(Calendar.DATE,-7);
            if(timetype.equals("近一月"))cal.add(Calendar.MONTH,-1);
            Date d7before=cal.getTime();
            String bytime7before= sdf.format(d7before);
            pmap.put("fromDate", bytime7before);
            pmap.put("toDate", bytime);
            list=  subjectMapper.getDrainageDataByTimewm(pmap);
        }else if(timetype.equals("近三月")){
            cal.add(Calendar.MONTH,-3);
            Date m3before=cal.getTime();
            String sm3before= sdf.format(m3before);
            pmap.put("fromDate", sm3before);
            pmap.put("toDate", bytime);
            list=  subjectMapper.getDrainageDataByTime3m(pmap);
        }else if(timetype.equals("近六月")||timetype.equals("近一年")||timetype.equals("近两年")||timetype.equals("近三年")||timetype.equals("近五年")){
            if(timetype.equals("近六月"))cal.add(Calendar.MONTH,-6);
            if(timetype.equals("近一年"))cal.add(Calendar.YEAR,-1);
            if(timetype.equals("近两年"))cal.add(Calendar.YEAR,-2);
            if(timetype.equals("近三年"))cal.add(Calendar.YEAR,-3);
            if(timetype.equals("近五年"))cal.add(Calendar.YEAR,-5);
            Date m6before=cal.getTime();
            String sm6before= sdf.format(m6before);
            pmap.put("fromDate", sm6before);
            pmap.put("toDate", bytime);
            list=  subjectMapper.getDrainageDataByTime6my(pmap);
        }else{//自定义
            String fromDate=request.getParameter("fromDate");
            String toDate=request.getParameter("toDate");
            pmap.put("fromDate",fromDate );
            pmap.put("toDate", toDate);
            list=  subjectMapper.getDrainageHis(pmap);
        }
        return  MapToLowerCaseConvert.mapToCamelNameCase(list);
    }

    @Override
    public List<Map<String, Object>> getFloodPointDateByTime(HttpServletRequest request) throws Exception {
        String timetype=request.getParameter("timetype");
        String bytime=request.getParameter("time");
        String stcd = request.getParameter("stcd");
        Map<String, Object> pmap = new HashMap<String, Object>();
        pmap.put("stcd", stcd);
        List<Map<String, Object>> list=null;
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        Date date = sdf.parse(bytime);
        Calendar cal=Calendar.getInstance();
        cal.setTime(date);
        if(timetype.equals("当日")){
            cal.add(Calendar.DATE,1);
            Date d1after=cal.getTime();
            String bytime1after= sdf.format(d1after);
            String fromDate=bytime.substring(0,10)+" 00:00:00";
            String toDate=bytime1after.substring(0,10)+" 00:00:00";
            pmap.put("fromDate", fromDate);
            pmap.put("toDate", toDate);
            list= subjectMapper.getFloodPointHis(pmap);
        }else if(timetype.equals("近一周")||timetype.equals("近一月")){
            if(timetype.equals("近一周"))cal.add(Calendar.DATE,-7);
            if(timetype.equals("近一月"))cal.add(Calendar.MONTH,-1);
            Date d7before=cal.getTime();
            String bytime7before= sdf.format(d7before);
            pmap.put("fromDate", bytime7before);
            pmap.put("toDate", bytime);
            list=  subjectMapper.getFloodPointDateByTimewm(pmap);
        }else if(timetype.equals("近三月")){
            cal.add(Calendar.MONTH,-3);
            Date m3before=cal.getTime();
            String sm3before= sdf.format(m3before);
            pmap.put("fromDate", sm3before);
            pmap.put("toDate", bytime);
            list=  subjectMapper.getFloodPointDateByTime3m(pmap);
        }else if(timetype.equals("近六月")||timetype.equals("近一年")||timetype.equals("近两年")||timetype.equals("近三年")||timetype.equals("近五年")){
            if(timetype.equals("近六月"))cal.add(Calendar.MONTH,-6);
            if(timetype.equals("近一年"))cal.add(Calendar.YEAR,-1);
            if(timetype.equals("近两年"))cal.add(Calendar.YEAR,-2);
            if(timetype.equals("近三年"))cal.add(Calendar.YEAR,-3);
            if(timetype.equals("近五年"))cal.add(Calendar.YEAR,-5);
            Date m6before=cal.getTime();
            String sm6before= sdf.format(m6before);
            pmap.put("fromDate", sm6before);
            pmap.put("toDate", bytime);
            list=  subjectMapper.getFloodPointDateByTime6my(pmap);
        }else{//自定义
            String fromDate=request.getParameter("fromDate");
            String toDate=request.getParameter("toDate");
            pmap.put("fromDate", fromDate);
            pmap.put("toDate", toDate);
            list =  subjectMapper.getFloodPointHis(pmap);
        }
        return MapToLowerCaseConvert.mapToCamelNameCase(list);
    }

    /***
     * 通过时间段获取泵站站上站下的数据
     * @param request
     * @return
     * @throws Exception
     */
    @Override
    public List<Map<String, Object>> getPumpDataByTime(HttpServletRequest request) throws Exception {
        String timetype=request.getParameter("timetype");
        String bytime=request.getParameter("time");
        String stcd = request.getParameter("stcd");
        Map<String, Object> pmap = new HashMap<String, Object>();
        pmap.put("stcd", stcd);
        List<Map<String, Object>> list=null;
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        Date date = sdf.parse(bytime);
        Calendar cal=Calendar.getInstance();
        cal.setTime(date);
        if(timetype.equals("当日")){
            cal.add(Calendar.DATE,1);
            Date d1after=cal.getTime();
            String bytime1after= sdf.format(d1after);
            String fromDate=bytime.substring(0,10)+" 00:00:00";
            String toDate=bytime1after.substring(0,10)+" 00:00:00";
            pmap.put("fromDate", fromDate);
            pmap.put("toDate", toDate);
            list= subjectMapper.queryPumpHist(pmap);
        }else if(timetype.equals("近一周")||timetype.equals("近一月")){
            if(timetype.equals("近一周"))cal.add(Calendar.DATE,-7);
            if(timetype.equals("近一月"))cal.add(Calendar.MONTH,-1);
            Date d7before=cal.getTime();
            String bytime7before= sdf.format(d7before);
            pmap.put("fromDate", bytime7before);
            pmap.put("toDate", bytime);
            list=  subjectMapper.getPumpDataByTimewm(pmap);
        }else if(timetype.equals("近三月")){
            cal.add(Calendar.MONTH,-3);
            Date m3before=cal.getTime();
            String sm3before= sdf.format(m3before);
            pmap.put("fromDate", sm3before);
            pmap.put("toDate", bytime);
            list=  subjectMapper.getPumpDataByTime3m(pmap);
        }else if(timetype.equals("近六月")||timetype.equals("近一年")||timetype.equals("近两年")||timetype.equals("近三年")||timetype.equals("近五年")){
            if(timetype.equals("近六月"))cal.add(Calendar.MONTH,-6);
            if(timetype.equals("近一年"))cal.add(Calendar.YEAR,-1);
            if(timetype.equals("近两年"))cal.add(Calendar.YEAR,-2);
            if(timetype.equals("近三年"))cal.add(Calendar.YEAR,-3);
            if(timetype.equals("近五年"))cal.add(Calendar.YEAR,-5);
            Date m6before=cal.getTime();
            String sm6before= sdf.format(m6before);
            pmap.put("fromDate", sm6before);
            pmap.put("toDate", bytime);
            list=  subjectMapper.getPumpDataByTime6my(pmap);
        }else{//自定义
            String fromDate=request.getParameter("fromDate");
            String toDate=request.getParameter("toDate");
            pmap.put("fromDate", fromDate);
            pmap.put("toDate", toDate);
            list =  subjectMapper.queryPumpHist(pmap);
        }
        return  MapToLowerCaseConvert.mapToCamelNameCase(list);
    }

    /**
     * 查询一个时间段的雨量
     */
    public List<Map<String, Object>> queryRainfallOneTime(String tm_s, String tm_e, String stcd){
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        try {
            Map<String, Object> pmap = new HashMap<>();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            if (tm_s != null && tm_s.length() > 0) {
                Date startTime = sdf.parse(tm_s);
                pmap.put("startTime", startTime);
            }
            if (tm_e != null && tm_e.length() > 0) {
                Date endTime = sdf.parse(tm_e);
                pmap.put("endTime", endTime);
            }
            pmap.put("stcd", stcd);
            list = subjectMapper.queryRainfallOneTime(pmap);
            list = MapToLowerCaseConvert.mapToCamelNameCase(list);
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return list;
    }

    /***
     * 通过时间段获取水库数据
     * @param request
     * @return
     * @throws Exception
     */
    @Override
    public List<Map<String, Object>> getRSVRDataByTime(HttpServletRequest request) throws Exception {
        String timetype=request.getParameter("timetype");
        String bytime=request.getParameter("time");
        String stcd = request.getParameter("stcd");
        Map<String, Object> pmap = new HashMap<String, Object>();
        pmap.put("stcd", stcd);
        List<Map<String, Object>> list=null;
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        Date date = sdf.parse(bytime);
        Calendar cal=Calendar.getInstance();
        cal.setTime(date);
        if(timetype.equals("当日")){
            cal.add(Calendar.DATE,1);
            Date d1after=cal.getTime();
            String bytime1after= sdf.format(d1after);
            String fromDate=bytime.substring(0,10)+" 00:00:00";
            String toDate=bytime1after.substring(0,10)+" 00:00:00";
            pmap.put("fromDate", fromDate);
            pmap.put("toDate", toDate);
            list= subjectMapper.queryReservoirPeriod(pmap);
        }else if(timetype.equals("近一周")||timetype.equals("近一月")){
            if(timetype.equals("近一周"))cal.add(Calendar.DATE,-7);
            if(timetype.equals("近一月"))cal.add(Calendar.MONTH,-1);
            Date d7before=cal.getTime();
            String bytime7before= sdf.format(d7before);
            pmap.put("fromDate", bytime7before);
            pmap.put("toDate", bytime);
            list=  subjectMapper.getRSVRDataByTimewm(pmap);
        }else if(timetype.equals("近三月")){
            cal.add(Calendar.MONTH,-3);
            Date m3before=cal.getTime();
            String sm3before= sdf.format(m3before);
            pmap.put("fromDate", sm3before);
            pmap.put("toDate", bytime);
            list=  subjectMapper.getRSVRDataByTime3m(pmap);
        }else if(timetype.equals("近六月")||timetype.equals("近一年")||timetype.equals("近两年")||timetype.equals("近三年")||timetype.equals("近五年")){
            if(timetype.equals("近六月"))cal.add(Calendar.MONTH,-6);
            if(timetype.equals("近一年"))cal.add(Calendar.YEAR,-1);
            if(timetype.equals("近两年"))cal.add(Calendar.YEAR,-2);
            if(timetype.equals("近三年"))cal.add(Calendar.YEAR,-3);
            if(timetype.equals("近五年"))cal.add(Calendar.YEAR,-5);
            Date m6before=cal.getTime();
            String sm6before= sdf.format(m6before);
            pmap.put("fromDate", sm6before);
            pmap.put("toDate", bytime);
            list=  subjectMapper.getRSVRDataByTime6my(pmap);
        }else{//自定义
            String fromDate=request.getParameter("fromDate");
            String toDate=request.getParameter("toDate");
            pmap.put("fromDate",fromDate );
            pmap.put("toDate", toDate);
            list=  subjectMapper.queryReservoirPeriod(pmap);
        }
        return  MapToLowerCaseConvert.mapToCamelNameCase(list);
    }

    /***
     * 通过时间段获取河道数据
     * @param request
     * @return
     * @throws Exception
     */
    @Override
    public List<Map<String, Object>> getRiverDataByTime(HttpServletRequest request) throws Exception {
        String timetype=request.getParameter("timetype");
        String bytime=request.getParameter("time");
        String stcd = request.getParameter("stcd");
        Map<String, Object> pmap = new HashMap<String, Object>();
        pmap.put("stcd", stcd);
        List<Map<String, Object>> list=null;
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        Date date = sdf.parse(bytime);
        Calendar cal=Calendar.getInstance();
        cal.setTime(date);
        if(timetype.equals("当日")){
            cal.add(Calendar.DATE,1);
            Date d1after=cal.getTime();
            String bytime1after= sdf.format(d1after);
            String fromDate=bytime.substring(0,10)+" 00:00:00";
            String toDate=bytime1after.substring(0,10)+" 00:00:00";
            pmap.put("fromDate", fromDate);
            pmap.put("toDate", toDate);
            list= subjectMapper.getRiverHis(pmap);
        }else if(timetype.equals("近一周")||timetype.equals("近一月")){
            if(timetype.equals("近一周"))cal.add(Calendar.DATE,-7);
            if(timetype.equals("近一月")) cal.add(Calendar.MONTH,-1);
            Date d7before=cal.getTime();
            String bytime7before= sdf.format(d7before);
            pmap.put("fromDate", bytime7before);
            pmap.put("toDate", bytime);
            list=  subjectMapper.getRiverDataByTimewm(pmap);
        } else if(timetype.equals("近三月")){
            cal.add(Calendar.MONTH,-3);
            Date m3before=cal.getTime();
            String sm3before= sdf.format(m3before);
            pmap.put("fromDate", sm3before);
            pmap.put("toDate", bytime);
            list=  subjectMapper.getRiverDataByTime3m(pmap);
        }else if(timetype.equals("近六月")||timetype.equals("近一年")||timetype.equals("近两年")||timetype.equals("近三年")||timetype.equals("近五年")){
            if(timetype.equals("近六月"))cal.add(Calendar.MONTH,-6);
            if(timetype.equals("近一年"))cal.add(Calendar.YEAR,-1);
            if(timetype.equals("近两年"))cal.add(Calendar.YEAR,-2);
            if(timetype.equals("近三年"))cal.add(Calendar.YEAR,-3);
            if(timetype.equals("近五年"))cal.add(Calendar.YEAR,-5);
            Date m6before=cal.getTime();
            String sm6before= sdf.format(m6before);
            pmap.put("fromDate", sm6before);
            pmap.put("toDate", bytime);
            list=  subjectMapper.getRiverDataByTimey(pmap);
        }else{//自定义
            String fromDate=request.getParameter("fromDate");
            String toDate=request.getParameter("toDate");
            pmap.put("fromDate",fromDate );
            pmap.put("toDate", toDate);
            list=  subjectMapper.getRiverHis(pmap);
        }
        return  MapToLowerCaseConvert.mapToCamelNameCase(list);
    }

    /***
     * 通过时间段获取排水水闸的数据
     * @param request
     * @return
     * @throws Exception
     */
    @Override
    public List<Map<String, Object>> getWasDateByTime(HttpServletRequest request) throws Exception {
        String timetype=request.getParameter("timetype");
        String bytime=request.getParameter("time");
        String stcd = request.getParameter("stcd");
        Map<String, Object> pmap = new HashMap<String, Object>();
        pmap.put("stcd", stcd);
        List<Map<String, Object>> list=null;
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        Date date = sdf.parse(bytime);
        Calendar cal=Calendar.getInstance();
        cal.setTime(date);
        if(timetype.equals("当日")){
            cal.add(Calendar.DATE,1);
            Date d1after=cal.getTime();
            String bytime1after= sdf.format(d1after);
            String fromDate=bytime.substring(0,10)+" 00:00:00";
            String toDate=bytime1after.substring(0,10)+" 00:00:00";
            pmap.put("fromDate", fromDate);
            pmap.put("toDate", toDate);
            list= subjectMapper.queryWasHist(pmap);
        }else if(timetype.equals("近一周")||timetype.equals("近一月")){
            if(timetype.equals("近一周"))cal.add(Calendar.DATE,-7);
            if(timetype.equals("近一月"))cal.add(Calendar.MONTH,-1);
            Date d7before=cal.getTime();
            String bytime7before= sdf.format(d7before);
            pmap.put("fromDate", bytime7before);
            pmap.put("toDate", bytime);
            list=  subjectMapper.getWasDateByTimewm(pmap);
        }else if(timetype.equals("近三月")){
            cal.add(Calendar.MONTH,-3);
            Date m3before=cal.getTime();
            String sm3before= sdf.format(m3before);
            pmap.put("fromDate", sm3before);
            pmap.put("toDate", bytime);
            list=  subjectMapper.getWasDateByTime3m(pmap);
        }else if(timetype.equals("近六月")||timetype.equals("近一年")||timetype.equals("近两年")||timetype.equals("近三年")||timetype.equals("近五年")){
            if(timetype.equals("近六月"))cal.add(Calendar.MONTH,-6);
            if(timetype.equals("近一年"))cal.add(Calendar.YEAR,-1);
            if(timetype.equals("近两年"))cal.add(Calendar.YEAR,-2);
            if(timetype.equals("近三年"))cal.add(Calendar.YEAR,-3);
            if(timetype.equals("近五年"))cal.add(Calendar.YEAR,-5);
            Date m6before=cal.getTime();
            String sm6before= sdf.format(m6before);
            pmap.put("fromDate", sm6before);
            pmap.put("toDate", bytime);
            list=  subjectMapper.getWasDateByTime6my(pmap);
        }else{//自定义
            String fromDate=request.getParameter("fromDate");
            String toDate=request.getParameter("toDate");
            pmap.put("fromDate", fromDate);
            pmap.put("toDate", toDate);
            list =  subjectMapper.queryWasHist(pmap);
        }
        return  MapToLowerCaseConvert.mapToCamelNameCase(list);
    }

    /**
     * 查看黑臭水体、污水处理厂 历史监测项  maxt
     */
    @Override
    public List<Map<String, Object>> queryAllItemHis(HttpServletRequest request) throws Exception {
        Map<String, Object> paramMap = new HashMap<String, Object>();
        String stcd = request.getParameter("stcd");
        String fromDate = request.getParameter("fromDate");
        String toDate = request.getParameter("toDate");
        paramMap.put("stcd", stcd);
        paramMap.put("fromDate", fromDate);
        paramMap.put("toDate", toDate);
        return MapToLowerCaseConvert.mapToCamelNameCase(subjectMapper.queryAllItemHis(paramMap));
    }

    /**
     * 查看 污水处理厂 历史监测项  日均值
     * @param request
     * @return
     * @throws Exception
     */
    @Override
    public List<Map<String, Object>> queryAllItemHisDay(HttpServletRequest request) throws Exception {
        Map<String, Object> paramMap = new HashMap<String, Object>();
        String stcd = request.getParameter("stcd");
        String fromDate = request.getParameter("fromDate");
        String toDate = request.getParameter("toDate");
        paramMap.put("stcd", stcd);
        paramMap.put("fromDate", fromDate);
        paramMap.put("toDate", toDate);
        return MapToLowerCaseConvert.mapToCamelNameCase(subjectMapper.queryAllItemHisDay(paramMap));
    }
}
