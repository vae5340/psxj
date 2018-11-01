package com.augurit.awater.awaterMobile.monitoring.subject.controller;

import com.augurit.agcloud.framework.ui.result.ContentResultForm;
import com.augurit.awater.awaterMobile.monitoring.subject.service.ISubject;
import com.augurit.awater.util.json.JsonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/subject"})
public class SubjectController {

    @Autowired
    private ISubject iSubject;

    /***
     * 获取测站的 警戒值属性接口
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "getDateRange",produces = "application/json;charset=UTF-8")
    public  String getDateRange(HttpServletRequest request) throws  Exception{
        Map<String, Object> result = iSubject.getDateRange(request);
        return JsonUtils.toJson(new ContentResultForm<>(true, result, "查询成功"));
    }

    /***
     * 获取测站的 警戒值属性接口
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "getStationProperties",produces = "application/json;charset=UTF-8")
    public  String getStationProperties(HttpServletRequest request) throws  Exception{
        Map<String, Object> result = iSubject.getStationProperties(request);
        return JsonUtils.toJson(new ContentResultForm<>(true, result, "查询成功"));
    }

    /***
     * 通过时间段获取排水管的数据
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getDrainageDataByTime",produces = "application/json;charset=UTF-8")
    public String getDrainageDataByTime(HttpServletRequest request) throws Exception{
        List<Map<String, Object>> pageData = iSubject.getDrainageDataByTime(request);
        return JsonUtils.toJson(new ContentResultForm<>(true, pageData, "查询成功"));
    }

    /***
     * 通过时间段获取积水点的数据
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "getFloodPointDateByTime",produces = "application/json;charset=UTF-8")
    public String getFloodPointDateByTime(HttpServletRequest request) throws  Exception{
        List<Map<String, Object>> pageData = iSubject.getFloodPointDateByTime(request);
        return JsonUtils.toJson(new ContentResultForm<>(true, pageData, "查询成功"));
    }

    /***
     * 通过时间段获取泵站站上站下数据
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getPumpDataByTime",produces = "application/json;charset=UTF-8")
    public  String getPumpDataByTime(HttpServletRequest request) throws  Exception{
        List<Map<String, Object>> list = iSubject.getPumpDataByTime(request);
        return JsonUtils.toJson(new ContentResultForm<>(true, list, "查询成功"));
    }

    /**
     * 查询一个时间段的雨量
     *
     * @param tm_s
     * @param tm_e
     * @param stcd
     * @return
     * @throws Exception
     */
    @RequestMapping(value="/queryRainfallOneTime", produces = "application/json;charset=UTF-8")
    public String queryRainfallOneTime(String tm_s, String tm_e, String stcd) {
        List<Map<String, Object>> list = iSubject.queryRainfallOneTime(tm_s, tm_e, stcd);
        return JsonUtils.toJson(new ContentResultForm<>(true, list, "查询成功"));
    }

    /**
     * 通过时间段获取水库数据
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getRSVRDataByTime",produces = "application/json;charset=UTF-8")
    public String getRSVRDataByTime(HttpServletRequest request) throws Exception{
        List<Map<String,Object>> pageData=iSubject.getRSVRDataByTime(request);
        return  JsonUtils.toJson(new ContentResultForm<>(true,pageData,"查询成功"));
    }

    /**
     * 通过时间段获取河流数据
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping(value="/getRiverDataByTime",produces = "application/json;charset=UTF-8")
    public String getRiverDataByTime(HttpServletRequest request) throws Exception{
        List<Map<String,Object>> pageData=iSubject.getRiverDataByTime(request);
        return  JsonUtils.toJson(new ContentResultForm<>(true,pageData,"查询成功"));
    }

    /***
     * 通过时间段获取排水水闸的数据
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "getWasDateByTime",produces = "application/json;charset=UTF-8")
    public  String getWasDateByTime(HttpServletRequest request) throws  Exception{
        List<Map<String, Object>> list = iSubject.getWasDateByTime(request);
        return JsonUtils.toJson(new ContentResultForm<>(true, list, "查询成功"));
    }

    /**
     * 查看黑臭水体、污水处理厂 历史监测项
     *
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping("/queryAllItemHis")
    public String queryAllItemHis(HttpServletRequest request) throws Exception {
        List<Map<String, Object>> list = iSubject.queryAllItemHis(request);
        return JsonUtils.toJson(new ContentResultForm<>(true, list, "查询成功"));
    }

    /**
     * 查看 污水处理厂 日均监测项
     *
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping("/queryAllItemHisDay")
    public String queryAllItemHisDay(HttpServletRequest request) throws Exception {
        List<Map<String, Object>> list = iSubject.queryAllItemHisDay(request);
        return JsonUtils.toJson(new ContentResultForm<>(true, list, "查询成功"));
    }

}
