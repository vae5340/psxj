package com.augurit.awater.awaterMobile.monitoring.station.controller;


import com.augurit.agcloud.framework.ui.result.ContentResultForm;
import com.augurit.awater.awaterMobile.monitoring.station.domain.Station;
import com.augurit.awater.awaterMobile.monitoring.station.service.IStation;
import com.augurit.awater.util.json.JsonUtils;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/station"})
public class StationController {

    @Autowired
    private IStation iStation;

    /**
     * 获取所有测站的坐标数据
     * */
    @RequestMapping(value="/getAllStation", produces = "application/json;charset=UTF-8")
    public String getAllStation(HttpServletRequest request) throws  Exception{
        List list=iStation.getAllStation(request);
        return JsonUtils.toJson(new ContentResultForm<>(true, list, "查询成功"));
    }




    /**
     * 获取所有测站的最新检测数据，
     * */
    @RequestMapping(value="/getAllStationValue", produces = "application/json;charset=UTF-8")
    public String getAllStationValue(HttpServletRequest request) throws  Exception{
        long startTime=System.currentTimeMillis();   //获取开始时间
        List list=iStation.getAllStationValue(request);
        long endTime=System.currentTimeMillis(); //获取结束时间
        System.out.println("获取最新数据运行时间： "+(endTime-startTime)+"ms");
        return JsonUtils.toJson(new ContentResultForm<>(true, list, "查询成功"));
    }
    /**
     *根据地图上的点获得测站信息
     */
    @RequestMapping(value="/getStationByMap", produces = "application/json;charset=UTF-8")
    public String layerClick(HttpServletRequest request) throws Exception {
        List list  =iStation.getStationByMap(request);
        return JsonUtils.toJson(new ContentResultForm<>(true, list, "查询成功"));
    }
    /**
     *根据地图上所选的范围获得测站信息
     */
    @RequestMapping(value="/getStationByExtent", produces = "application/json;charset=UTF-8")
    public String getStationByExtent(HttpServletRequest request) throws Exception {
        List list  =iStation.getStationByExtent(request);
        return JsonUtils.toJson(new ContentResultForm<>(true, list, "查询成功"));
    }

    /**
     * 联动分析 条件查询列表数据
     *根据时间获得测站信息有监测数据的测站信息（关联了多个实时数据表来判断）
     */
    @RequestMapping(value="/getStationByTm", produces = "application/json;charset=UTF-8")
    public String getStationByTm(HttpServletRequest request) throws Exception {
        List list  =iStation.getStationByTm(request);
        Map result = new HashMap();
        int total=0;
        if(null!=list&&list.size()>0){
            total =list.size();
        }
        result.put("total",total);
        result.put("rows",list);
        return JsonUtils.toJson(new ContentResultForm<>(true, result, "查询成功"));
    }
    /**
     *根据时间获得具体测站历史数据
     * sdate 开始时间
     * edate 结束时间
     * stcds 测站的stcds
     * hisTableName 要查询的历史数据表
     * layertype 所查询的测站类型
     */
    @RequestMapping(value="/getStationHisDataByTm", produces = "application/json;charset=UTF-8")
    public String getStationHisDataByTm(HttpServletRequest request) throws Exception {
        List list  =iStation.getStationHisDataByTm(request);
        return JsonUtils.toJson(new ContentResultForm<>(true, list, "查询成功"));
    }

    /**
     * 分页查询 获取模糊查询搜索列表
     * */
    @RequestMapping(value="/searchList", produces = "application/json;charset=UTF-8")
    public String searchList(HttpServletRequest request,
                             @RequestParam(required = false,defaultValue = "1",value = "curPage")Integer curPage,
                             @RequestParam(required = false,defaultValue = "9999",value = "perPageCount")Integer perPageCount
    ) throws  Exception{
        Page<Station> page = new Page<Station>(curPage, perPageCount);
        PageInfo<Station> pageData = iStation.searchList(request, page);
        return JsonUtils.toJson(new ContentResultForm<>(true,  pageData, "查询成功"));
    }
    /*
     * 分页查询 获取监控预警站点信息搜索列表
     * */
    @RequestMapping(value = "/searchAlarmlist",produces = "application/json;charset=UTF-8")
    public String searchAlarmlist(HttpServletRequest request,
                                  @RequestParam(required = false,defaultValue = "1",value = "page.pageNo")Integer pageNo,
                                  @RequestParam(required = false,defaultValue = "3",value = "page.pageSize")Integer pageSize
    ) throws  Exception{
        Page<Map<String,Object>> page = new Page<Map<String,Object>>(pageNo, pageSize);
        PageInfo<Map<String,Object>> list = iStation.searchAlarmlist(request,page);
        return JsonUtils.toJson(new ContentResultForm<>(true,list,"查询成功"));
    }

    /**
     * 获取积水点名称列表
     * */
    @RequestMapping(value="/getAllSPStation", produces = "application/json;charset=UTF-8")
    public String getAllSPStation(HttpServletRequest request) throws  Exception{
        List list=iStation.getAllSPStation(request);
        return JsonUtils.toJson(new ContentResultForm<>(true, list, "查询成功"));
    }
}
