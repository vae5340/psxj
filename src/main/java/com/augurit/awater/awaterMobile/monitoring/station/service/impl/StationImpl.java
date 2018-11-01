package com.augurit.awater.awaterMobile.monitoring.station.service.impl;

import com.augurit.awater.awaterMobile.monitoring.station.mapper.StationMapper;
import com.augurit.awater.awaterMobile.monitoring.station.service.IStation;
import com.augurit.awater.dri.common.MapToLowerCaseConvert;
import com.augurit.awater.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StationImpl implements IStation {

    @Autowired
    private StationMapper stationMapper;

    @Override
    public List<Map<String, Object>> getAllStation(HttpServletRequest request) throws Exception {
        Map param = new HashMap();
        return  MapToLowerCaseConvert.mapToCamelNameCase(stationMapper.getAllStation(param));
    }

    /*根据地图上所选点击的点，获取全部的监控信息*/
    @Override
    public List<Map<String, Object>> getStationByMap(HttpServletRequest request) throws Exception {
        Map<String,Object> param = new HashMap<String, Object>();
        String radius = request.getParameter("radius");
        String x = request.getParameter("x");
        String y = request.getParameter("y");
        String sttp = request.getParameter("sttp");
        String mnit = request.getParameter("mnit");//监控类型
        if(!StringUtil.isEmpty(radius)&&!StringUtil.isEmpty(x)){
            Float minx = Float.parseFloat(x)-Float.parseFloat(radius);
            Float maxx = Float.parseFloat(x)+Float.parseFloat(radius);
            param.put("minx", minx);
            param.put("maxx", maxx);
        }
        if(!StringUtil.isEmpty(radius)&&!StringUtil.isEmpty(y)){
            Float maxy = Float.parseFloat(y)+Float.parseFloat(radius);
            Float miny = Float.parseFloat(y)-Float.parseFloat(radius);
            param.put("miny", miny);
            param.put("maxy", maxy);
        }
        String[] sttpList = null;
        if(!StringUtil.isEmpty(sttp)){
            sttpList = sttp.split(",");
            param.put("sttps", sttpList);
        }
        if(!StringUtil.isEmpty(mnit)){
            param.put("mnit", mnit);
        }
        return MapToLowerCaseConvert.mapToCamelNameCase(stationMapper.getStationByMap(param));
    }

}
