package com.augurit.awater.awaterMobile.monitoring.station.service.impl;

import com.augurit.awater.awaterMobile.monitoring.station.domain.HisData;
import com.augurit.awater.awaterMobile.monitoring.station.domain.Station;
import com.augurit.awater.awaterMobile.monitoring.station.mapper.StationMapper;
import com.augurit.awater.awaterMobile.monitoring.station.service.IStation;
import com.augurit.awater.awaterMobile.monitoring.subject.service.impl.SubjectImpl;
import com.augurit.awater.dri.common.MapToLowerCaseConvert;
import com.augurit.awater.util.StringUtil;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StationImpl implements IStation {
    private static Logger logger = LoggerFactory.getLogger(SubjectImpl.class);
    @Autowired
    private StationMapper stationMapper;

    @Override
    public List<Map<String, Object>> getAllStation(HttpServletRequest request) throws Exception {
        Map param = new HashMap();
        return  MapToLowerCaseConvert.mapToCamelNameCase(stationMapper.getAllStation(param));
    }
    @Override
    public List<Map<String, Object>> getAllStationValue(HttpServletRequest request) throws Exception {
        Map param = new HashMap();
        String sttp = request.getParameter("sttp");
        String mnit = request.getParameter("mnit");//监控类型
        if(!StringUtil.isEmpty(sttp)){
            param.put("sttp", sttp);
        }
        if(!StringUtil.isEmpty(mnit)){
            param.put("mnit", mnit);
        }
        return MapToLowerCaseConvert.mapToCamelNameCase(stationMapper.getAllStationValue(param));
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
            Float minx=Float.parseFloat(x)-Float.parseFloat(radius);
            Float maxx=Float.parseFloat(x)+Float.parseFloat(radius);
            param.put("minx", minx);
            param.put("maxx", maxx);
        }
        if(!StringUtil.isEmpty(radius)&&!StringUtil.isEmpty(y)){
            Float maxy=Float.parseFloat(y)+Float.parseFloat(radius);
            Float miny=Float.parseFloat(y)-Float.parseFloat(radius);
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

    /*根据地图上所选的范围，获取全部的监控信息*/
    @Override
    public List<Map<String, Object>> getStationByExtent(HttpServletRequest request) throws Exception {
        Map<String,Object> param = new HashMap<String, Object>();
        String xmax=request.getParameter("xmax");
        String xmin=request.getParameter("xmin");
        String ymax=request.getParameter("ymax");
        String ymin=request.getParameter("ymin");
        String layerId = request.getParameter("layerId");//所选类型
        String mnit = request.getParameter("mnit");//监控类型
        param.put("minx", xmin);
        param.put("maxx", xmax);
        param.put("miny", ymin);
        param.put("maxy", ymax);
        if(!StringUtil.isEmpty(layerId)){
            param.put("layertype", layerId);
        }
        return MapToLowerCaseConvert.mapToCamelNameCase(stationMapper.getStationByMap(param));
    }

    @Override
    public List<Map<String, Object>> getStationByTm(HttpServletRequest request) throws Exception {

        String sdate=request.getParameter("sdate");
        String edate=request.getParameter("edate");
        String stsys=request.getParameter("stsys");//数据来源
        String addvcd=request.getParameter("addvcd");//行政区
        String layertype = request.getParameter("layertype");//所选类型
        String mnit=null;
        String sttp=null;
        if(layertype.contains("-")){
            sttp = layertype.split("-")[0];
            mnit = layertype.split("-")[1];
        }
        //有时间才可以搜索
        if(StringUtil.isEmpty(sdate)|StringUtil.isEmpty(edate)){
            return null;
        }
        Map<String,Object> param = new HashMap<String, Object>();
        param.put("sdate", sdate);
        param.put("edate", edate);
        param.put("sttp", sttp);
        param.put("mnit", mnit);
        if(!StringUtil.isEmpty(stsys)){
            param.put("stsys", stsys);
        }
        if(!StringUtil.isEmpty(addvcd)){
            param.put("addvcd", addvcd);
        }
        if(!StringUtil.isEmpty(layertype)){
            param.put("layertype", layertype);
        }

        return MapToLowerCaseConvert.mapToCamelNameCase(stationMapper.getStationByTm(param));
    }


    @Override
    public List<Station> getStationHisDataByTm(HttpServletRequest request) throws Exception {

        String sdate=request.getParameter("sdate");
        String edate=request.getParameter("edate");
        String[] stcds=request.getParameterValues("stcds");//stcd
        String hisTableName =request.getParameter("hisTableName");//要查询的数据表
        String layertype =request.getParameter("layertype");

        if(null==stcds||StringUtil.isEmpty(sdate)||StringUtil.isEmpty(edate)||StringUtil.isEmpty(layertype)){
            return  null;
        }

        Map param =  new HashMap();
        param.put("stcds",stcds);
        param.put("layertype",layertype);
        List<Station> stationList =stationMapper.getStation(param);

        for (Station s:stationList){
            param.put("sdate", sdate);
            param.put("edate", edate);
            param.put("stcd", s.getStcd());
            param.put("hisTableName", hisTableName);
            List<HisData> hisDataList=stationMapper.getHisDataByTm(param);
            s.setHisDataList(hisDataList);
        }

        return stationList;
    }

    //    @Override
//    public Pager searchList(HttpServletRequest request, Pager pager) throws Exception {
//        String stnm =request.getParameter("stnm");//要查询的数据表
//        String addvcd =request.getParameter("addvcd");
//        Map param =  new HashMap();
//        param.put("stnm",stnm);
//        param.put("addvcd",addvcd);
//        List<Station> list =stationMapper.getStation(param);
//        logger.debug("searchList 成功执行分页查询");
//        return  new Pager(list, pager);
//    }
    @Override
    public PageInfo<Station> searchList(HttpServletRequest request, Page page) throws Exception {
        PageHelper.startPage(page);
        String stnm =request.getParameter("stnm");//要查询的数据表
        String addvcd =request.getParameter("xzq");
        String layerTypes = request.getParameter("layerTypes");
        List layerList=null;
        if(!StringUtil.isEmpty(layerTypes)){
            String[] layerArr=layerTypes.split(",");
            layerList = new ArrayList();
            for(String a:layerArr){
                layerList.add(a);
            }
        }
        Map param =  new HashMap();
        param.put("stnm",stnm);
        param.put("addvcd",addvcd);
        param.put("layertypes",layerList);
        List<Station> list =stationMapper.getStation(param);
        logger.debug("searchList 成功执行分页查询");
        return new PageInfo<Station>(list);
    }

    @Override
    public PageInfo<Map<String,Object>> searchAlarmlist(HttpServletRequest request, Page page) throws Exception {
        //Integer pageSize = Integer.parseInt( request.getParameter("pageSize"));
        //Integer pageNo = Integer.parseInt( request.getParameter("pageNo"));
        //PageHelper.startPage(page);
        String jkType = request.getParameter("jkType");
        Map param =  new HashMap();
        param.put("jkType",jkType);
        List<Map<String,Object>> list =stationMapper.getAlarmStation(param);
        logger.debug("searchAlarmlist 成功执行分页查询");
        PageInfo<Map<String,Object>> pf = new PageInfo<Map<String,Object>>(list);
        return pf;
    }
/*获取积水点名称列表 */
    @Override
    public List<Map<String, Object>> getAllSPStation(HttpServletRequest request) throws Exception {
        Map param = new HashMap();
        return  MapToLowerCaseConvert.mapToCamelNameCase(stationMapper.getAllSPStation(param));
    }
}
