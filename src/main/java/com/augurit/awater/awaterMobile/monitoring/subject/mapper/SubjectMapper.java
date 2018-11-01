package com.augurit.awater.awaterMobile.monitoring.subject.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface SubjectMapper {

    //获取测站实时数据的最大最小日期
    Map<String, Object> getDateRange(Map<String, Object> map);

    //河道的属性值（警戒）
    Map<String, Object> getRiverProperties(@Param("stcd") String stcd);

    //积水点的属性值（警戒）
    Map<String, Object> getWaterpointsProperties(@Param("stcd") String stcd);

    //窨井的属性值（警戒）CONDUIT
    Map<String, Object> getConduitProperties(@Param("stcd") String stcd);

    //水闸的属性值（警戒）
    Map<String, Object> getSluiceProperties(@Param("stcd") String stcd);

    //水库的属性值（警戒）
    Map<String, Object> getReservoirProperties(@Param("stcd") String stcd);

    /**
     * 获取排水管网历史数据 maxt
     */
    List<Map<String, Object>> getDrainageHis(Map<String, Object> map) throws Exception;

    //通过时间段获取排水管网数据
    List<Map<String, Object>> getDrainageDataByTimewm(Map<String, Object> map);
    List<Map<String, Object>> getDrainageDataByTime3m(Map<String, Object> map);
    List<Map<String, Object>> getDrainageDataByTime6my(Map<String, Object> map);

    /**
     * 获取积水点历史数据
     */
    List<Map<String, Object>> getFloodPointHis(Map<String, Object> map) throws Exception;

    //通过时间段获取积水点的数据
    List<Map<String, Object>> getFloodPointDateByTimewm(Map<String, Object> map);
    List<Map<String, Object>> getFloodPointDateByTime3m(Map<String, Object> map);
    List<Map<String, Object>> getFloodPointDateByTime6my(Map<String, Object> map);

    /**
     * 查看泵站站上站下历史水位
     *
     * @return
     * @throws Exception
     */
    List<Map<String, Object>> queryPumpHist(Map<String, Object> map) throws Exception;

    //通过时间段获取泵站站上站下的数据
    List<Map<String, Object>> getPumpDataByTimewm(Map<String, Object> map);
    List<Map<String, Object>> getPumpDataByTime3m(Map<String, Object> map);
    List<Map<String, Object>> getPumpDataByTime6my(Map<String, Object> map);

    /**
     * 查询一个时间段的雨量
     *
     * @param map
     * @return
     * @throws Exception
     */
    List<Map<String, Object>> queryRainfallOneTime(Map<String, Object> map) throws Exception;

    /**
     * 查看时段水库水位情况
     *
     * @return
     * @throws Exception
     */
    List<Map<String, Object>> queryReservoirPeriod(Map<String, Object> map) throws Exception;

    //通过时间段获取水库的数据
    List<Map<String, Object>> getRSVRDataByTimewm(Map<String, Object> map);
    List<Map<String, Object>> getRSVRDataByTime3m(Map<String, Object> map);
    List<Map<String, Object>> getRSVRDataByTime6my(Map<String, Object> map);

    /**
     * 获取河流历史数据
     */
    List<Map<String, Object>> getRiverHis(Map<String, Object> map) throws Exception;

    //通过时间段获取河道的数据
    List<Map<String, Object>> getRiverDataByTimewm(Map<String, Object> map);
    List<Map<String, Object>> getRiverDataByTime3m(Map<String, Object> map);
    List<Map<String, Object>> getRiverDataByTimey(Map<String, Object> map);

    /**
     * 查看历史水闸水位情况
     *
     * @return
     * @throws Exception
     */
    List<Map<String, Object>> queryWasHist(Map<String, Object> map) throws Exception;

    //通过时间段获取排水水闸数据
    List<Map<String, Object>> getWasDateByTimewm(Map<String, Object> map);
    List<Map<String, Object>> getWasDateByTime3m(Map<String, Object> map);
    List<Map<String, Object>> getWasDateByTime6my(Map<String, Object> map);

    /**
     *  查看黑臭水体、污水处理厂 历史监测项
     *
     * @return
     * @throws Exception
     */
    List<Map<String, Object>> queryAllItemHis(Map<String, Object> map) throws Exception;
    List<Map<String, Object>> queryAllItemHisDay(Map<String, Object> paramMap) throws Exception;

}
