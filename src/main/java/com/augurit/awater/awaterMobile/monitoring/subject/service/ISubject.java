package com.augurit.awater.awaterMobile.monitoring.subject.service;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

public interface ISubject {

    //获得实时数据的日期范围：返回最大日期和最小日期
    Map<String,Object> getDateRange(HttpServletRequest request) throws Exception;

    //获得测站的基本属性值
    Map<String,Object> getStationProperties(HttpServletRequest request) throws Exception;

    List<Map<String,Object>> getDrainageDataByTime(HttpServletRequest request) throws Exception;


    List<Map<String,Object>> getFloodPointDateByTime(HttpServletRequest request) throws Exception;

    List<Map<String,Object>> getPumpDataByTime(HttpServletRequest request) throws Exception;

    /**
     * 查询一个时间段的雨量
     *
     * @param tm_s
     * @param tm_e
     * @param stcd
     * @return
     * @throws Exception
     */
    List<Map<String, Object>> queryRainfallOneTime(String tm_s, String tm_e, String stcd) ;

    List<Map<String,Object>> getRSVRDataByTime(HttpServletRequest request) throws Exception;

    List<Map<String,Object>> getRiverDataByTime(HttpServletRequest request) throws Exception;

    List<Map<String,Object>> getWasDateByTime(HttpServletRequest request) throws Exception;

    /**
     * 查看黑臭水体、污水处理厂 历史监测项
     *
     * @param request
     * @return
     * @throws Exception
     */
    List<Map<String, Object>> queryAllItemHis(HttpServletRequest request) throws Exception;

    /**
     * 查看 污水处理厂 历史监测项  日均值
     *
     * @param request
     * @return
     * @throws Exception
     */
    List<Map<String,Object>> queryAllItemHisDay(HttpServletRequest request) throws Exception;

}
