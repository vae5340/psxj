package com.augurit.awater.awaterMobile.monitoring.station.mapper;

import com.augurit.awater.awaterMobile.monitoring.station.domain.HisData;
import com.augurit.awater.awaterMobile.monitoring.station.domain.Station;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface StationMapper {

    List<Map<String, Object>> getAllStation(Map<String, Object> map) throws Exception;
    List<Map<String, Object>> getAllStationValue(Map<String, Object> map) throws Exception;
    List<Map<String,Object>> getStationByMap(Map<String, Object> param) throws Exception;
    List<Map<String,Object>> getStationByTm(Map<String, Object> param) throws Exception;
    List<Station> getStation(Map<String, Object> map) throws Exception;
    List<HisData> getHisDataByTm(Map<String, Object> param) throws Exception;
    List<Map<String,Object>> getAlarmStation(Map<String,Object> map) throws Exception;
    List<Map<String, Object>> getAllSPStation(Map<String, Object> map) throws Exception;
}
