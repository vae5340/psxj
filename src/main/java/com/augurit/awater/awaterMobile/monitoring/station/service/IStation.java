package com.augurit.awater.awaterMobile.monitoring.station.service;

import com.augurit.awater.awaterMobile.monitoring.station.domain.Station;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

public interface IStation {


    /*获取全部监控项*/
    List<Map<String, Object>> getAllStation(HttpServletRequest request) throws Exception;
    /*获取全部实时值*/
    List<Map<String, Object>> getAllStationValue(HttpServletRequest request) throws Exception;
    /*根据地图上的点击的点，获取全部的监控信息*/
    List<Map<String, Object>>  getStationByMap(HttpServletRequest request) throws Exception;
    /*根据地图上所选的范围，获取全部的监控信息*/
    List<Map<String, Object>>  getStationByExtent(HttpServletRequest request) throws Exception;
    /*按照时间，查询有监控数据的所有测站信息*/
    List<Map<String, Object>>  getStationByTm(HttpServletRequest request) throws Exception;

    /*按照时间，测站编号，获取对应表的历史数据*/
    List<Station>  getStationHisDataByTm(HttpServletRequest request) throws Exception;

    /*获取模糊查询搜索列表*/
//    Pager searchList(HttpServletRequest request, Pager pager) throws Exception;

    /*获取模糊查询搜索列表*/
    PageInfo<Station> searchList(HttpServletRequest request, Page pager) throws Exception;

    /*获取监控预警数据*/
    PageInfo<Map<String,Object>> searchAlarmlist(HttpServletRequest requset, Page pager) throws Exception;

    /*获取积水点名称列表*/
    List<Map<String, Object>> getAllSPStation(HttpServletRequest request) throws Exception;
}
