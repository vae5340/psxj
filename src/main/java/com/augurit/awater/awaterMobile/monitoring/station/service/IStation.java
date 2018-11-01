package com.augurit.awater.awaterMobile.monitoring.station.service;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

public interface IStation {


    /*获取全部监控项*/
    List<Map<String, Object>> getAllStation(HttpServletRequest request) throws Exception;

    /*根据地图上的点击的点，获取全部的监控信息*/
    List<Map<String, Object>> getStationByMap(HttpServletRequest request) throws Exception;
}
