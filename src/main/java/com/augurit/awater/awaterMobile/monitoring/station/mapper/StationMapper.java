package com.augurit.awater.awaterMobile.monitoring.station.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface StationMapper {

    List<Map<String, Object>> getAllStation(Map<String, Object> map) throws Exception;

    List<Map<String, Object>> getStationByMap(Map<String, Object> map) throws Exception;

}
