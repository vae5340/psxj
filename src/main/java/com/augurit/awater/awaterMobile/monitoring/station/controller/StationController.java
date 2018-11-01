package com.augurit.awater.awaterMobile.monitoring.station.controller;


import com.augurit.agcloud.framework.ui.result.ContentResultForm;
import com.augurit.awater.awaterMobile.monitoring.station.service.IStation;
import com.augurit.awater.util.json.JsonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping({"/station"})
public class StationController {

    @Autowired
    private IStation iStation;

    @RequestMapping(value = "/getAllStation", produces = "application/json;charset=UTF-8")
    public String getAllStation(HttpServletRequest request) throws  Exception{
        List list = iStation.getAllStation(request);
        return JsonUtils.toJson(new ContentResultForm<>(true,list,"查询成功"));
    }

    @RequestMapping(value = "/getStationByMap", produces = "application/json;charset=UTF-8")
    public String layerClick(HttpServletRequest request) throws  Exception {
        List list = iStation.getStationByMap(request);
        return JsonUtils.toJson(new ContentResultForm<>(true,list,"查询成功"));
    }

}
