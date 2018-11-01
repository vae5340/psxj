package com.augurit.awater.bpm.xcyh.report.mapper;

import com.augurit.agcloud.bsc.domain.BscAttForm;
import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.agcloud.opus.common.domain.OpuOmUser;
import com.augurit.awater.bpm.xcyh.report.domain.GxProblemReport;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Mapper
public interface GxProblemReportMapper {
    public void insertGxProblemReport(GxProblemReport gxProblemReport) throws Exception;
    public void updateGxProblemReport(GxProblemReport gxProblemReport) throws Exception;
    public void deleteGxProblemReport(@Param("id") String id) throws Exception;
    public List <GxProblemReport> listGxProblemReport( GxProblemReport gxProblemReport) throws Exception;
    public GxProblemReport getGxProblemReportById(@Param("id") String id) throws Exception;
	public List <GxProblemReport> searchSbPage(@Param("gx")Map<String,Object> gxProblemReport, @Param("mp")Map<String,Object> map, RowBounds rw);
    public Integer searchPageCount(@Param("gx")Map<String,Object> gxProblemReport, @Param("mp")Map<String,Object> map);
    public List<Map<String,Object>> searchGroup(@Param("gx") GxProblemReport form, @Param("mp") Map map);
    public List<BscAttForm> findBscAttForm(@Param("form") BscAttForm bscAttForm)throws Exception;
    String getAppIdByProcDefKey(@Param("flowdefKey") String flowdefKey)throws Exception;
    List<OpuOmOrg> getOrgsByLoginName(@Param("loginName") String loginName) throws Exception;
    List<OpuOmOrg> getChildOrgsByLoginName(@Param("loginName") String loginName) throws Exception;
    List<OpuOmOrg> getChildOrgByOrgIds(@Param("orgIds") Set<String> orgIds)throws Exception;
    List<OpuOmUser> getOpuOmUsersByOrgId(String orgId)throws Exception;
}