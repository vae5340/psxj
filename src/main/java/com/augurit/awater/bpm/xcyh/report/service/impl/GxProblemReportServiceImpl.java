package com.augurit.awater.bpm.xcyh.report.service.impl;

import com.augurit.agcloud.bpm.common.domain.BpmTaskSendConfig;
import com.augurit.agcloud.bpm.common.domain.BpmTaskSendObject;
import com.augurit.agcloud.bpm.common.service.BpmTaskService;
import com.augurit.agcloud.bpm.front.service.impl.BpmBusAbstractServiceImpl;
import com.augurit.agcloud.bsc.domain.BscAttForm;
import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.framework.ui.result.ResultForm;
import com.augurit.agcloud.opus.common.domain.*;
import com.augurit.agcloud.opus.common.mapper.OpuAcRoleUserMapper;
import com.augurit.agcloud.opus.common.mapper.OpuOmOrgMapper;
import com.augurit.agcloud.opus.common.mapper.OpuOmUserOrgMapper;
import com.augurit.agcloud.opus.common.mapper.OpuOmUserPosMapper;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.org.service.IBpmService;
import com.augurit.agcloud.org.service.IPsOrgUserService;
import com.augurit.awater.bpm.file.entity.SysFileLink;
import com.augurit.awater.bpm.file.service.IDynamictableService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metacodeitem;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.service.IMetacodetypeService;
import com.augurit.awater.bpm.xcyh.reassign.domain.ReassignProcess;
import com.augurit.awater.bpm.xcyh.reassign.service.IReassignProcessService;
import com.augurit.awater.bpm.xcyh.report.domain.GxProblemReport;
import com.augurit.awater.bpm.xcyh.report.mapper.GxProblemReportMapper;
import com.augurit.awater.bpm.xcyh.report.service.IGxProblemReportService;
import com.augurit.awater.bpm.xcyh.report.web.WfRestController;
import com.augurit.awater.bpm.xcyh.report.web.form.GxProblemReportConvertor;
import com.augurit.awater.bpm.xcyh.report.web.form.GxProblemReportForm;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.problem_report.correct_mark.service.ICorrectMarkService;
import com.augurit.awater.dri.utils.JsonOfForm;
import com.augurit.awater.util.DateUtils;
import com.augurit.awater.util.lang.CollectionUtils;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.session.RowBounds;
import org.flowable.engine.HistoryService;
import org.flowable.engine.TaskService;
import org.flowable.task.api.Task;
import org.flowable.task.api.history.HistoricTaskInstance;
import org.flowable.task.api.history.HistoricTaskInstanceQuery;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Date;
import java.util.stream.Collectors;

@Service
@Transactional
public class GxProblemReportServiceImpl extends BpmBusAbstractServiceImpl<GxProblemReport> implements IGxProblemReportService {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    ;
    @Autowired
    private IPsOrgUserService psOrgUserService;
    @Autowired
    private ICorrectMarkService correctMarkService;
    @Autowired
    private IDynamictableService dynamictableService;
    @Autowired
    private IBpmService bpmService;
    @Autowired
    private BpmTaskService bpmTaskService;
    @Autowired
    private GxProblemReportMapper gxProblemReportMapper;
    @Autowired
    private IReassignProcessService reassignProcessService;

    @Autowired
    private IOmOrgRestService omOrgRestService;

    @Autowired
    private IMetacodetypeService metacodetypeService;

    @Autowired
    private TaskService taskService;
    @Autowired
    private HistoryService historyService;
    @Autowired
    private OpuOmUserOrgMapper opuOmUserOrgMapper;
    @Autowired
    private OpuOmUserPosMapper opuOmUserPosMapper;
    @Autowired
    private OpuAcRoleUserMapper opuAcRoleUserMapper;
    @Autowired
    private OpuOmOrgMapper opuOmOrgMapper;

    public static String DB_SQL = "select arp.KEY_ PROCDEF_KEY,art.TASK_DEF_KEY_ TASK_CODE,art.NAME_ TASK_NAME,art.ID_ TASK_ID,asa.PROC_INST_ID,dgpr.SZWZ,dgpr.SSLX,dgpr.BHLX,dgpr.ID,dgpr.SBSJ,dgpr.SBR,dgpr.WTMS,dgpr.JJCD,dgpr.PARENT_ORG_NAME,rownum RN from ACT_RU_TASK art,ACT_RE_PROCDEF arp,ACT_STO_APPINST asa,DRI_GX_PROBLEM_REPORT dgpr where arp.KEY_ in (?,?) AND art.ASSIGNEE_=? AND art.PROC_DEF_ID_=arp.ID_ AND dgpr.ID = asa.MASTER_RECORD_ID AND asa.PROC_INST_ID=art.PROC_INST_ID_ order by art.CREATE_TIME_ desc";
    public static String DB_COUNT_SQL = "select count(distinct art.PROC_INST_ID_) as RECORD_NUM from ACT_RU_TASK art,ACT_RE_PROCDEF arp,ACT_STO_APPINST asa where arp.KEY_ in (?,?) AND art.ASSIGNEE_=? AND art.PROC_DEF_ID_ = arp.ID_ AND asa.PROC_INST_ID=art.PROC_INST_ID_";

    public static String YB_SQL = "select temp.start_time_,temp.PROCDEF_KEY,temp.TASK_CODE,temp.TASK_ID,temp.TASK_NAME,asa.PROC_INST_ID,dgpr.SZWZ,dgpr.SSLX,dgpr.BHLX,dgpr.ID,dgpr.SBSJ,dgpr.SBR,dgpr.WTMS,dgpr.JJCD,dgpr.PARENT_ORG_NAME,rownum RN from (select arp.KEY_ PROCDEF_KEY,aht.TASK_DEF_KEY_ TASK_CODE,aht.ID_ TASK_ID,aht.NAME_ TASK_NAME,aht.PROC_INST_ID_,aht.END_TIME_,aht.start_time_,row_number() over(partition by aht.PROC_INST_ID_ order by aht.START_TIME_ desc) ROW_NUMBER from ACT_HI_TASKINST aht, ACT_RE_PROCDEF arp where arp.KEY_ in (?,?) AND aht.ASSIGNEE_=? AND aht.PROC_DEF_ID_=arp.ID_ AND aht.END_TIME_ is NOT NULL ) temp,DRI_GX_PROBLEM_REPORT dgpr,ACT_STO_APPINST asa where temp.ROW_NUMBER=1 AND dgpr.ID = asa.MASTER_RECORD_ID AND asa.PROC_INST_ID = temp.PROC_INST_ID_ order by temp.start_time_ DESC";
    public static String YB_COUNT_SQL = "select count(distinct aht.PROC_INST_ID_) RECORD_NUM from ACT_HI_TASKINST aht,ACT_RE_PROCDEF arp,ACT_STO_APPINST asa where arp.KEY_ in (?,?) AND aht.ASSIGNEE_=? AND arp.ID_ = aht.PROC_DEF_ID_ AND asa.PROC_INST_ID = aht.PROC_INST_ID_ AND aht.END_TIME_ is NOT NULL";

    //public static String BJ_SQL="select aht.NAME_ TASK_NAME,aht.ID_ TASK_ID,asa.PROC_INST_ID,dgpr.SZWZ,dgpr.SSLX,dgpr.BHLX,dgpr.ID,dgpr.SBSJ,dgpr.SBR,dgpr.WTMS,dgpr.JJCD,dgpr.PARENT_ORG_NAME,rownum RN from ACT_HI_TASKINST aht, ACT_STO_APPINST asa,ACT_HI_PROCINST ahp,ACT_RE_PROCDEF arp,DRI_GX_PROBLEM_REPORT dgpr where arp.KEY_ in (?,?) AND aht.ASSIGNEE_=? AND asa.PROC_INST_ID=ahp.ID_ AND arp.ID_=ahp.PROC_DEF_ID_ AND aht.PROC_INST_ID_=ahp.ID_ AND dgpr.ID = asa.MASTER_RECORD_ID AND ahp.END_TIME_ is NOT NULL order by ahp.END_TIME_ desc";
    public static String BJ_SQL = "select temp.PROCDEF_KEY,temp.TASK_CODE,temp.TASK_ID,temp.TASK_NAME,asa.PROC_INST_ID,dgpr.SZWZ,dgpr.SSLX,dgpr.BHLX,dgpr.ID,dgpr.SBSJ,dgpr.SBR,dgpr.WTMS,dgpr.JJCD,dgpr.PARENT_ORG_NAME,rownum RN from (select arp.KEY_ PROCDEF_KEY,aht.TASK_DEF_KEY_ TASK_CODE,aht.ID_ TASK_ID,aht.NAME_ TASK_NAME,aht.PROC_INST_ID_,ahp.END_TIME_,row_number() over(partition by aht.PROC_INST_ID_ order by aht.START_TIME_ desc) ROW_NUMBER from ACT_HI_TASKINST aht,ACT_RE_PROCDEF arp,ACT_HI_PROCINST ahp WHERE arp.KEY_ in (?, ?) AND aht.ASSIGNEE_=? AND aht.PROC_INST_ID_=ahp.ID_ AND arp.ID_=ahp.PROC_DEF_ID_ AND ahp.END_TIME_ is NOT NULL) temp,DRI_GX_PROBLEM_REPORT dgpr,ACT_STO_APPINST asa where temp.ROW_NUMBER=1 AND asa.MASTER_RECORD_ID=dgpr.ID AND asa.PROC_INST_ID=temp.PROC_INST_ID_ order by temp.END_TIME_ desc";
    public static String BJ_COUNT_SQL = "select count(distinct aht.PROC_INST_ID_) RECORD_NUM from ACT_HI_TASKINST aht,ACT_RE_PROCDEF arp,ACT_HI_PROCINST ahp,ACT_STO_APPINST asa where arp.KEY_ in (?,?) AND aht.ASSIGNEE_=? AND aht.PROC_INST_ID_=ahp.ID_ AND arp.ID_ = ahp.PROC_DEF_ID_ AND asa.PROC_INST_ID = ahp.ID_ AND ahp.END_TIME_ is NOT NULL";

    @Override
    public List<GxProblemReport> listGxProblemReport(GxProblemReport gxProblemReport) throws Exception {
        return gxProblemReportMapper.listGxProblemReport(gxProblemReport);
    }
    /**
     * app修改保存
     * @param entity
     */
//	public void saveforUpdate(GxProblemReport entity){
//		gxProblemReportDao.save(entity);
//	}

    /**
     * 根据任务对象主键和任务参与人获取属于指定参与人的带有流程上下文信息的任务对象
     * @param taskInstDbid 任务对象主键
     */
//	public WfContextTaskForm getWfContextTaskForm(Long taskInstDbid){
//		if(taskInstDbid != null){
//
//			String hql = "select new com.augurit.ads.wf.sc.wftpl.web.form.WfContextTaskForm(task, procInst, instance, template) " +
//					"from WfBusTemplate template, WfBusInstance instance, Jbpm4Task task, Jbpm4HistProcinst procInst" +
//					" where template.id=instance.templateId and instance.procInstId=procInst.procInstId " +
//					" and task.procinst=procInst.procInstDbId and task.taskInstDbid=:taskInstDbid ";
//					//" and (task.assignee=:taskAssignee or (task.agent=:taskAssignee and task.agentStartDate<:now and task.agentEndDate>:now))";
//
//			Map<String, Object> values = new HashMap();
//			values.put("taskInstDbid", taskInstDbid);
//			//values.put("taskAssignee", taskAssignee);
//			values.put("now", new Date());
//
//			return gxProblemReportDao.findUnique(hql, values);
//		}
//		return null;
//	}
    @Override
    public void delete (String id) throws Exception {
        if(gxProblemReportMapper.getGxProblemReportById(id)!=null){
            gxProblemReportMapper.deleteGxProblemReport(id);
        }
    }

    /***********************************pc端页面展示**********************************/
    /**
     * 查询最新十条数据PC端展示(3天)
     */
    public List<Map<String, Object>> getLatestTen() {
        String hql = "select PARENT_ORG_NAME,DIRECT_ORG_NAME,SUPERVISE_ORG_NAME,"
                + "TEAM_ORG_NAME,SBSJ,SBR,BHLX,SSLX,ID from (select * from AWATER_SWJ.GX_PROBLEM_REPORT ps where ps.SBSJ>sysdate-3 order by ps.SBSJ desc ) where ROWNUM<=10";
        return jdbcTemplate.queryForList(hql);
    }

//	public String getState(Long entityId){
//		List<Object> values = new ArrayList<Object>();
//		StringBuffer hql = new StringBuffer("select proc from ");
//		hql.append(" Jbpm4HistTask task, Jbpm4HistProcinst proc, WfBusInstance inst");
//		hql.append(" where inst.masterEntity='GX_PROBLEM_REPORT' and inst.masterEntityKey=? and task.procInstId = proc.procInstId and proc.procInstId = inst.procInstId order by task.create desc ");
//		values.add(entityId);
//		List<Jbpm4HistProcinst> Jbpm4HistProcinstList = jbpm4HistProcinstDao.find(hql.toString(), values);
//		if(Jbpm4HistProcinstList!=null && Jbpm4HistProcinstList.size()>0){
//			return Jbpm4HistProcinstList.get(0).getState();
//		}
//		return "";
//	}

    /**
     * 删除数据和流程信息
     *
     * @param form
     * @return
     */
    public String deleteProcessInstance(GxProblemReport form) throws Exception {
        JSONObject jsonObject = new JSONObject();
        try {
            if (form != null) {
                //先删除有的文件
                List<SysFileLink> sysFileLink = dynamictableService.getSysFileLinkByEntityAndEntityId("GxProblemReport", form.getId().toString());
                if (sysFileLink != null && sysFileLink.size() > 0) {
                    Long[] ids = new Long[sysFileLink.size()];
                    for (int i = 0; i < sysFileLink.size(); i++) {
                        if (sysFileLink.get(i).getSysFileId() != null) {
                            ids[i] = sysFileLink.get(i).getSysFileId();
                        }
                    }
                    dynamictableService.deleteFile(ids);
                }
                if (true) {
                    gxProblemReportMapper.deleteGxProblemReport(form.getId());
                    jsonObject.put("code", 200);
                    jsonObject.put("success", true);
                    jsonObject.put("message", "删除成功！");
                } else {
                    Map<String, String> map = searchGzlData(form.getId());
                    if (map != null) {
                        if ("problemReport".equals(map.get("activityName"))) {
                            //删除流程
//							Boolean flag = processManageService.deleteProcessInstance(map.get("activityName"));
                            Boolean flag = false;
                            if (flag) {
                                gxProblemReportMapper.deleteGxProblemReport(form.getId());
                                jsonObject.put("code", 200);
                                jsonObject.put("success", true);
                                jsonObject.put("message", "删除成功！");
                            } else {
                                jsonObject.put("code", 400);
                                jsonObject.put("success", false);
                                jsonObject.put("message", "删除失败！");
                            }
                        } else {
                            jsonObject.put("code", 500);
                            jsonObject.put("success", false);
                            jsonObject.put("message", "不能删除！");
                        }
                    } else {
                        jsonObject.put("code", 400);
                        jsonObject.put("success", false);
                        jsonObject.put("message", "删除失败！");
                    }
                }
            } else {
                jsonObject.put("code", 400);
                jsonObject.put("success", false);
                jsonObject.put("message", "删除失败,记录不存在！");
            }
        } catch (RuntimeException e) {
            // TODO: handle exception
            jsonObject.put("code", 400);
            jsonObject.put("success", false);
            jsonObject.put("message", "删除失败！");
            throw new RuntimeException(e);
        }
        return jsonObject.toString();
    }

    /**
     * 根据id查询工作流相关信息
     */
    public Map<String, String> searchGzlData(String entityId) {
        List<Object> values = new ArrayList<Object>();
        StringBuffer hql = new StringBuffer("SELECT task.id_ as task_id,TASK.TASK_DEF_key_," +
                " task.START_TIME_,task.end_time_,task.name_ ,TEMP.key_ as TEMPLATE_CODE," +
                " TEMP.ID_ as def_id,PROC.PROC_INST_ID_ " +
                " FROM ACT_HI_TASKINST task,ACT_HI_PROCINST proc,ACT_STO_APPINST inst, " +
                " ACT_RE_PROCDEF temp WHERE inst.MASTER_RECORD_ID =? AND " +
                " task.PROC_INST_ID_ = proc.PROC_INST_ID_ AND proc.PROC_INST_ID_ = inst.PROC_INST_ID" +
                " AND temp.ID_ = PROC.PROC_DEF_ID_ ORDER BY task.START_TIME_ DESC");
        List<Map<String, Object>> listResult = jdbcTemplate.queryForList(hql.toString(), new Object[]{entityId});
        //Todo change
        if (listResult != null && listResult.size() > 0) {
            Map<String, String> map = new HashMap<String, String>();
            Map<String, Object> objs = listResult.get(0);
            map.put("histTaskInstDbid", objs.get("TASK_ID").toString());
            if (objs.get("START_TIME_") != null && objs.get("END_TIME_") != null) {
                java.sql.Date startTime = new java.sql.Date(((java.sql.Timestamp) objs.get("START_TIME_")).getTime());
                java.sql.Date endTime = new java.sql.Date(((java.sql.Timestamp) objs.get("END_TIME_")).getTime());
                if (startTime != null && endTime != null) {
                    map.put("state", "ended");
                } else {
                    map.put("state", "active");
                }

            }

            map.put("templateId", objs.get("DEF_ID").toString());
            map.put("taskId", objs.get("TASK_ID").toString());
            map.put("templateCode", objs.get("TEMPLATE_CODE").toString());
            map.put("activityName", objs.get("NAME_").toString());
            map.put("procInstId", objs.get("PROC_INST_ID_").toString());
            map.put("activity", objs.get("TASK_DEF_KEY_").toString());
            return map;
        }
        return null;
    }

    /**
     * 上报分页查询
     */
    public String searchSbPage(Page<GxProblemReport> page, GxProblemReport form,
                               Map<String, Object> map) {
        JSONObject json = new JSONObject();
        List<GxProblemReport> listForm = new ArrayList<>();
        String role = null;
        if (StringUtils.isNotBlank(SecurityContext.getCurrentUserId())) {
            Map<String, String> m = correctMarkService.getFrom(SecurityContext.getCurrentUser().getLoginName());
            if (m.containsKey("parentOrgName")) {
                if (!m.containsKey("top")) {//非市级用户
                    //form.setParentOrgId(m.get("parentOrgId"));
                    map.put("parentOrgId", m.get("parentOrgId"));
                    //判定角色
                    List<OpuRsRole> roleList = omOrgRestService.listRoleByUserId(SecurityContext.getCurrentUserId());
                    if (roleList != null) {
                        for (OpuRsRole roleForm : roleList) {
                            if ("ps_qj_manager".equals(roleForm.getRoleCode())) {
                                role = "ps_qj_manager";
                                break;
                            }
                        }
                    }
                }
            }
            // 查询语句及参数
            //StringBuffer hql = new StringBuffer("from GxProblemReport ps where 1=1");
            Map<String, Object> values = new HashMap<String, Object>();

            // 查询条件
            if (form != null) {
                if (StringUtils.isNotBlank(form.getParentOrgId())) {
                    //hql.append(" and ps.parentOrgId = :parentOrgId");
                    values.put("parentOrgId", form.getParentOrgId());
                }
                if (StringUtils.isNotBlank(form.getSzwz())) {
                    //hql.append(" and ps.parentOrgId = :parentOrgId");
                    values.put("szwz", "%" + form.getSzwz() + "%");
                }
                if (StringUtils.isNotBlank(form.getSslx())) {
                    //hql.append(" and ps.sslx = :sslx");
                    values.put("sslx", form.getSslx());
                }
                if (StringUtils.isNotBlank(form.getSbr())) {
                    //hql.append(" and ps.sbr like :sbr");
                    values.put("sbr", "%" + form.getSbr().trim() + "%");
                }
                if (StringUtils.isNotBlank(form.getJdmc())) {
                    //hql.append(" and ps.jdmc like :jdmc");
                    values.put("jdmc", "%" + form.getJdmc() + "%");
                }
            }
            if (map != null) {
                if (map.containsKey("parentOrgId")) {//非市级
                    if (role == null) {//个人
                        //hql.append(" and ps.loginname = :loginname");
                        //values.put("loginname", SecurityContext.getCurrentUserId());
                    } else if ("ps_qj_manager".equals(role)) {//区级管理员
                        //hql.append(" and ps.parentOrgId = :parentOrgId2");
                        //values.put("parentOrgId2", map.get("parentOrgId"));
                    }
                }
                /*if(map.get("startTime")!=null){
					//hql.append(" and to_char(ps.sbsj,'yyyyMMdd') >= :startTime ");
					values.put("startTime", df.format((Date)map.get("startTime")));
				}
				if(map.get("endTime")!=null){
					//hql.append(" and to_char(ps.sbsj,'yyyyMMdd') <= :endTime");
					values.put("endTime", df.format((Date)map.get("endTime")));
				}*/
            }
            //hql.append(" order by ps.sbsj desc");
            //排序
            //hql.append(HqlUtils.buildOrderBy(page, "ps"));
            int pageNo = page.getPageNo();//page.getPageNo()>1?(page.getPageNo()-1)*page.getPageSize()+1 : 1;
            int pageSize = page.getPageSize(); //page.getPageNo()*page.getPageSize();
            RowBounds rw = new RowBounds(pageNo, pageSize);
            //com.github.pagehelper.Page pageHel = new com.github.pagehelper.Page(pageNo,pageSize);
            PageHelper.startPage(pageNo, pageSize);
            List<GxProblemReport> result = gxProblemReportMapper.searchSbPage(values, map, rw);
            PageInfo<GxProblemReport> paheHel = new PageInfo(result);
            page.setTotalItems(paheHel.getTotal());
            List<GxProblemReportForm> listFrom = new ArrayList<>();
            if (result != null && result.size() > 0) {
                for (GxProblemReport gxProblemReportForm : result) {
                    GxProblemReportForm from = GxProblemReportConvertor.convertVoToForm(gxProblemReportForm);
                    Map<String, Object> gzlMap = this.searchProblem(gxProblemReportForm.getId());
                    if (gzlMap != null) {
                        from.setTaskInstDbid(String.valueOf(gzlMap.get("TASK_ID")));
                        if (gzlMap.get("END_TIME_") != null) {
                            from.setState("已办结");
                        } else {
                            from.setState("办理中");
                        }
                    } else {
                        from.setState("自行办理");
                    }
                    listFrom.add(from);
                }
            }
            json.put("rows", listFrom);
            json.put("total", page.getTotalItems());
            json.put("code", 200);
        } else {
            json.put("code", 300);
            json.put("message", "参数错误!");
        }
        return json.toString();
    }

    public String searchPage(Page<GxProblemReport> page, GxProblemReport form,
                             Map<String, Object> map) {
        JSONObject json = new JSONObject();
        List<GxProblemReport> list = new ArrayList<>();
        Page pg = this.searchFromAndMap(page, form, map);
        Long total = null;
        if (pg.getResult() != null) {
            list = pg.getResult();
            total = pg.getTotalItems();
        }
        json.put("rows", list);
        json.put("total", total);
        json.put("code", 200);
        return json.toString();
    }

    /**
     * 分页查询
     */
    public Page<GxProblemReportForm> searchFromAndMap(Page<GxProblemReport> page,
                                                      GxProblemReport form, Map<String, Object> map) {
        Page<GxProblemReportForm> pg = new Page();
        List<OpuRsRole> roleList = omOrgRestService.listRoleByUserId(SecurityContext.getCurrentUserId());
        String role = null;
        if (roleList != null) {
            for (OpuRsRole roleForm : roleList) {
                if ("aosadmin".equals(roleForm.getRoleCode())) {
                    role = "aosadmin";
                    break;
                } else if ("ps_qj_manager".equals(roleForm.getRoleCode())) {
                    role = "ps_qj_manager";
                }
            }
        }
        role = "ps_qj_manager";
        if (role != null) {
            Map<String, String> cmMap = null;
            if ("ps_qj_manager".equals(role)) {
                cmMap = correctMarkService.getFrom(SecurityContext.getCurrentUser().getLoginName());
            }
            // 查询语句及参数
            //StringBuffer hql = new StringBuffer("from GxProblemReport ps where 1=1");
            Map<String, Object> values = new HashMap<String, Object>();

            // 查询条件
            if (form != null) {
                if (StringUtils.isNotBlank(form.getParentOrgId())) {
                    //hql.append(" and ps.parentOrgId = :parentOrgId");
                    values.put("parentOrgId", form.getParentOrgId());
                }
                if (StringUtils.isNotBlank(form.getParentOrgName())) {
                    //hql.append(" and ps.parentOrgName like :parentOrgName");
                    values.put("parentOrgName", "%" + form.getParentOrgName() + "%");
                }
                if (StringUtils.isNotBlank(form.getSslx())) {
                    //hql.append(" and ps.sslx = :sslx");
                    values.put("sslx", form.getSslx());
                }
            }
            if (map != null) {
                if (map.containsKey("startTime") && map.containsKey("endTime")) {
                    //hql.append(" and ps.sbsj between :startTime and :endTime");
                    values.put("startTime", (Date) map.get("startTime"));
                    values.put("endTime", (Date) map.get("endTime"));
                }
            }
            if (cmMap != null && StringUtils.isNotBlank(cmMap.get("parentOrgId"))) {
                //hql.append(" and ps.parentOrgId = :parentOrgId2");
                values.put("parentOrgId2", cmMap.get("parentOrgId"));
            }
            //hql.append(" order by ps.sbsj desc");
            //排序
            //hql.append(HqlUtils.buildOrderBy(page, "ps"));
            //Todo change
//			// 执行分页查询操作
//			Page pg = gxProblemReportDao.findPage(page, hql.toString(), values);

            // 转换为Form对象列表并赋值到原分页对象中
//			List<GxProblemReport> list = GxProblemReportConvertor.convertVoListToFormList(pg.getResult());
            RowBounds rw = new RowBounds(page.getPageNo(), page.getPageSize());
            List<GxProblemReport> result = gxProblemReportMapper.searchSbPage(values, map, rw);
            Integer count = gxProblemReportMapper.searchPageCount(values, map);
            pg.setTotalItems(count);
            pg.setPageNo(page.getPageNo());
            pg.setPageSize(page.getPageSize());
            List<GxProblemReportForm> listFrom = new ArrayList<>();
            if (result != null && result.size() > 0) {
                for (GxProblemReport gxProblemReportForm : result) {
                    GxProblemReportForm from = GxProblemReportConvertor.convertVoToForm(gxProblemReportForm);
                    Map<String, Object> gzlMap = this.searchProblem(gxProblemReportForm.getId());
                    if (gzlMap != null) {
                        from.setTaskInstDbid(String.valueOf(gzlMap.get("TASK_ID")));
                        if(from.getTaskInstDbid()!=null){
                            HistoricTaskInstance his = historyService.createHistoricTaskInstanceQuery().taskId(from.getTaskInstDbid()).singleResult();
                            if(his!=null) from.setProcInstId(his.getProcessInstanceId());
                        }
                        if (gzlMap.get("END_TIME_") != null) {
                            from.setState("已办结");
                        } else {
                            from.setState("办理中");
                        }
                    } else {
                        from.setState("自行办理");
                    }
                    listFrom.add(from);
                }
            }
            pg.setResult(listFrom);
            return pg;
        } else {
            return pg;
        }

    }

    /**
     * 查询条件统计图
     */
    public String searchEachts(GxProblemReport form, Map<String, Object> map) {
        JSONObject json = new JSONObject();
        if (map.containsKey("isShowEchart") && "true".equals((String) map.get("isShowEchart"))) {
            //如果前台要求显示，就不再判断权限了
        } else {
            //判断用户角色
            List<OpuRsRole> roleList = omOrgRestService.listRoleByUserId(SecurityContext.getCurrentUserId());
            String role = null;
            if (roleList != null) {
                for (OpuRsRole roleForm : roleList) {
                    if ("aosadmin".equals(roleForm.getRoleCode())) {
                        role = "aosadmin";
                        break;
                    } else if ("ps_qj_manager".equals(roleForm.getRoleCode())) {
                        role = "ps_qj_manager";
                    }
                }
            }
            //不是超级管理员的没有按区统计
            if (role == null || !"aosadmin".equals(role)) {
                json.put("code", 500);
                json.put("rows", new ArrayList<Map<String, Object>>());
                return json.toString();

            }
        }
        //分组查询，判断是否点击传参
		/*if(!StringUtils.isNotBlank(form.getParentOrgName()) &&
				!StringUtils.isNotBlank(form.getDirectOrgName())){
			form.setParentOrgName("1");
		}else if(StringUtils.isNotBlank(form.getParentOrgName())){
			form.setDirectOrgName("1");
		}else if(StringUtils.isNotBlank(form.getDirectOrgName())){
			form.setTeamOrgName("1");
		}*/
        form.setParentOrgName("1");
        //Todo change
        List<Map<String, Object>> list = gxProblemReportMapper.searchGroup(form, map);
        if (list != null && list.size() > 0) {
            json.put("rows", list);
        }
        json.put("code", 200);
        return json.toString();
    }
//	/**
//	 * 分组查询统计
//	 * */
//	public List<Map<String, Object>> searchGroup (GxProblemReport form, Map<String,Object> map){
//		List<Map<String, Object>> list = new ArrayList<>();
//		StringBuffer hql = new StringBuffer("");
//		Map values = new HashMap<>();
//		if(StringUtils.isNotBlank(form.getParentOrgName()) &&
//				!StringUtils.isNotBlank(form.getDirectOrgName())){
//			hql.append("select ps.parentOrgName as name,count(*) as total from GxProblemReport ps where 1=1");
//			if(StringUtils.isNotBlank(form.getSslx())){
//				hql.append(" and ps.sslx = :sslx");
//				values.put("sslx", form.getSslx());
//			}
//			if(map.size()>0 && map.containsKey("startTime") && map.containsKey("endTime")){
//				hql.append(" and ps.sbsj between :startTime and :endTime");
//				values.put("startTime", (Date)map.get("startTime"));
//				values.put("endTime", (Date)map.get("endTime"));
//			}
//			hql.append(" group by ps.parentOrgName");
//		}else if(StringUtils.isNotBlank(form.getDirectOrgName()) &&
//					StringUtils.isNotBlank(form.getParentOrgName())){
//			hql.append("select ps.directOrgName as name,count(*) as total from Diary ps where 1=1");
//			if(StringUtils.isNotBlank(form.getSslx())){
//				hql.append(" and ps.sslx = :sslx");
//				values.put("sslx", form.getSslx());
//			}
//			if(map.size()>0 && map.containsKey("startTime") && map.containsKey("endTime")){
//				hql.append(" and ps.recordTime between :startTime and :endTime");
//				values.put("startTime", (Date)map.get("startTime"));
//				values.put("endTime", (Date)map.get("endTime"));
//			}
//			hql.append(" and ps.parentOrgName like :parentOrgName");
//			values.put("parentOrgName", "%"+form.getParentOrgName()+"%");
//			hql.append(" group by ps.directOrgName");
//		}else if(StringUtils.isNotBlank(form.getTeamOrgName()) &&
//				StringUtils.isNotBlank(form.getDirectOrgName())){
//			hql.append("select ps.teamOrgName as name,count(*) as total from Diary ps where 1=1");
//			if(StringUtils.isNotBlank(form.getSslx())){
//				hql.append(" and ps.sslx = :sslx");
//				values.put("sslx", form.getSslx());
//			}
//			if(map.size()>0 && map.containsKey("startTime") && map.containsKey("endTime")){
//				hql.append(" and ps.recordTime between :startTime and :endTime");
//				values.put("startTime", (Date)map.get("startTime"));
//				values.put("endTime", (Date)map.get("endTime"));
//			}
//			hql.append(" and ps.directOrgName like :directOrgName");
//			values.put("directOrgName", "%"+form.getDirectOrgName()+"%");
//			hql.append(" group by ps.teamOrgName");
//		}
//		if(StringUtils.isNotBlank(hql.toString())){
//			list = gxProblemReportDao.find(hql.toString(), values);
//		}
//		return list;
//	}

    /**
     * 根据当前用户查询出当前区域下的上报问题
     */
    @Override
    public List<GxProblemReport> getByLoginName(String loginName) {
        String parentOrgId = null;
        //先由当前登录人找到他的区
        Map<String, String> cmMap = correctMarkService.getFrom(loginName);
        if (cmMap != null) {
            parentOrgId = cmMap.get("parentOrgId");
        }
        Map<String, Object> values = new HashMap<String, Object>();
        //非自行处理
        StringBuffer hql = new StringBuffer("select ps,proc.state ,task.signTime ,temp.templateCode,task.histTaskInstDbid ,task.activityName,task.activityChineseName from ");
        hql.append(" GxProblemReport ps, ");
        hql.append(" Jbpm4HistTask task, Jbpm4HistProcinst proc, WfBusInstance inst,WfBusTemplate temp ");
        hql.append(" where inst.masterEntity='GX_PROBLEM_REPORT' and inst.masterEntityKey=ps.id and task.procInstId = proc.procInstId and proc.procInstId = inst.procInstId and temp.id=inst.templateId ");
        hql.append(" and (ps.isbyself='false' or ps.isbyself is null)");
        //自行处理
        StringBuffer hqlbyself = new StringBuffer("from GxProblemReport ps where ps.isbyself='true' ");

        // 查询条件
        if (StringUtils.isNotBlank(parentOrgId) && !"1063".equals(parentOrgId)) {//1063为市水务局，查询全部
            hql.append(" and ps.parentOrgId = :parentOrgId");
            hqlbyself.append(" and ps.parentOrgId = :parentOrgId");
            values.put("parentOrgId", parentOrgId);
        }
        hql.append(" order by task.create desc ");
//		List list = gxProblemReportDao.find(hql.toString(), values);//非自行处理
//		List<GxProblemReport> isbyselfList = gxProblemReportDao.find(hqlbyself.toString(), values);//自行处理
//		if (list!=null && list.size()>0) {
//			List<GxProblemReport> gxList=GxProblemReportConvertor.convertWfVoToWfForm(list);
//			if(isbyselfList!=null && isbyselfList.size()>0){
//				List<GxProblemReport> gxListbyself=GxProblemReportConvertor.convertVoListToFormList(isbyselfList);
//				gxList.addAll(gxListbyself);
//			}
//			return  gxList;
//		}
        return null;
    }

    /**
     * 上报统计
     * 按人统计
     */
    @Override
    public String statisticsForPerson(GxProblemReport form, Map<String, Object> map) {
        JSONObject json = new JSONObject();
        List<Map> list = new ArrayList<>();
        Map value = new HashMap();
        StringBuffer hql = new StringBuffer("select cc.sbr SBR,min(cc.parent_org_name) PARENT_ORG_NAME,min("
                + " cc.direct_org_name) ORG_NAME, "
                + " count(*) as TOTAL  from dri_Gx_Problem_Report cc"
                + " where 1=1"
        );
        //在区域查询页面点击查看，就带区域过来查询
        if (StringUtils.isNotBlank(form.getParentOrgName())) {
            if (!"all".equals(form.getParentOrgName())) {
                hql.append(" and cc.parent_org_name like :ccc");
                value.put("ccc", "%" + form.getParentOrgName() + "%");
            }
        } else {//不是区域点击的
            //当前登录人就以当前区统计为主
            Map<String, String> cmMap = correctMarkService.getFrom(SecurityContext.getCurrentUserName());
            if (cmMap != null && cmMap.size() > 0) {
                if (!"广州市水务局".equals(cmMap.get("parentOrgName")) && cmMap.get("parentOrgName") != null) {//非市级
                    hql.append(" and cc.parent_org_name=:zz");
                    value.put("zz", cmMap.get("parentOrgName"));
                }
            }
        }
        if (StringUtils.isNotBlank(form.getDirectOrgName())) {
            hql.append(" and cc.direct_org_name like :aa");
            value.put("aa", "%" + form.getDirectOrgName() + "%");
        }
        if (StringUtils.isNotBlank(form.getSbr())) {
            hql.append(" and cc.sbr like :bb");
            value.put("bb", "%" + form.getSbr() + "%");
        }
        if (map != null) {
            SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
            if (map.get("startTime") != null) {
                hql.append(" and to_char(cc.sbsj,'yyyyMMdd') >= :dd ");
                value.put("dd", df.format((Date) map.get("startTime")));
            }
            if (map.get("endTime") != null) {
                hql.append(" and to_char(cc.sbsj,'yyyyMMdd') <= :ff");
                value.put("ff", df.format((Date) map.get("endTime")));
            }
        }
        hql.append(" group by cc.sbr  order by total desc");
        List<Map<String, Object>> resultlist = jdbcTemplate.queryForList(hql.toString());
        //SQLQuery query = gxProblemReportDao.createSQLQuery(hql.toString(),value);
//		List<Object[]> resultlist = query.list();
        //List<Object[]> resultlist = null;
        //封装成对象
        for (Map obj : resultlist) {
            Map mp = new HashMap<>();
            mp.put("sbr", obj.get("SBR"));
            mp.put("parentorgName", obj.get("PARENT_ORG_NAME"));
            mp.put("orgName", obj.get("ORG_NAME"));
            mp.put("allData", obj.get("TOTAL"));
            list.add(mp);
        }
        json.put("rows", list);
        json.put("total", list.size());
        json.put("code", 200);
        return json.toString();
    }

    /**
     * 上报统计
     * 按区统计
     */
    @Override
    public String statisticsForArea(GxProblemReport form, Map<String, Object> map) {
        JSONObject json = new JSONObject();
        List<Map> list = new ArrayList<>();
        Map valueMap = new HashMap<>();
        // 查询语句及参数
        StringBuffer hql = new StringBuffer("select MAX(ps.parent_Org_Name),"
                + "SUM(case when ps.state_!='ended' then 1 else 0 end) ,"
                + "SUM(case when ps.state_='ended' then 1 else 0 end), count(*) ");
        hql.append(" from ");
        hql.append(" (select distinct gx.id, gx.parent_Org_Name,gx.parent_Org_id,proc.state_ ,gx.sbsj from");
        hql.append(" Gx_Problem_Report gx,Jbpm4_Hist_Task task, Jbpm4_Hist_Procinst proc, Wf_Bus_Instance inst,Wf_Bus_Template temp ");
        hql.append(" where inst.master_Entity='GX_PROBLEM_REPORT' and inst.master_Entity_Key=gx.id and ");
        hql.append(" task.procinst_ = proc.id_ and proc.id_ = inst.proc_Inst_Id ");
        hql.append("and temp.id=inst.template_Id and (gx.isbyself='false' or gx.isbyself is null)");
        hql.append(" union all select distinct gxp.id, gxp.parent_Org_Name,gxp.parent_Org_id,'ended' state_ , gxp.sbsj from Gx_Problem_Report gxp where "
                + " gxp.isbyself='true' ) ps  where 1=1 ");
        // 查询条件
        if (form != null) {
            if (StringUtils.isNotBlank(form.getParentOrgName())) {
                hql.append(" and ps.parent_Org_Name like :parentOrgName");
                valueMap.put("parentOrgName", "%" + form.getParentOrgName() + "%");
            }
        }
        if (map != null) {
            SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
            if (map.get("startTime") != null) {
                hql.append(" and to_char(ps.sbsj,'yyyyMMdd') >= :startTime ");
                valueMap.put("startTime", df.format((Date) map.get("startTime")));
            }
            if (map.get("endTime") != null) {
                hql.append(" and to_char(ps.sbsj,'yyyyMMdd') <= :endTime");
                valueMap.put("endTime", df.format((Date) map.get("endTime")));
            }
        }
        hql.append(" group by ps.parent_Org_id ");//order by count(*) desc
        hql.append(" order by  case ");
        hql.append(" when ps.parent_Org_id = '1066' then 1");//%天河% 按特定顺序排序
        hql.append(" when ps.parent_Org_id = '1067' then 2");//%番禺%
        hql.append(" when ps.parent_Org_id = '1068' then 3");//%黄埔%
        hql.append(" when ps.parent_Org_id = '1069' then 4");//%白云%
        hql.append(" when ps.parent_Org_id = '1070' then 5");//%南沙%
        hql.append(" when ps.parent_Org_id = '1151' then 6");//%海珠%
        hql.append(" when ps.parent_Org_id = '1072' then 7");//%荔湾%
        hql.append(" when ps.parent_Org_id = '1073' then 8");//%花都%
        hql.append(" when ps.parent_Org_id = '1074' then 9");//%越秀%
        hql.append(" when ps.parent_Org_id = '1075' then 10");//%增城%
        hql.append(" when ps.parent_Org_id = '1076' then 11");//%从化%
        hql.append(" when ps.parent_Org_id = '1077' then 12");//%净水有限公司%
        hql.append(" end ");
        //data : ['天河','番禺','黄埔','白云','南沙','海珠', '荔湾','花都','越秀','增城','从化','净水有限公司']
//		List<Object[]> resultlist = gxProblemReportDao.createSQLQuery(hql.toString(),valueMap).list();
        List<Object[]> resultlist = new ArrayList<>();
        String[] qy = new String[]{"天河", "番禺", "黄埔", "白云", "南沙", "海珠", "荔湾", "花都", "越秀", "增城", "从化", "净水有限公司", "市水务局"};
        //封装成对象
        long notBj = 0;
        long yBj = 0;
        long allData = 0;
        int index = 0;
        for (Object[] obj : resultlist) {
            if (index <= qy.length - 1 && obj[0].toString().indexOf(qy[index]) < 0) {
                while (index <= qy.length - 1 && obj[0].toString().indexOf(qy[index]) < 0) {
                    Map mp = new HashMap<>();
                    mp.put("orgName", qy[index]);
                    mp.put("notBj", 0);
                    mp.put("yBj", 0);
                    mp.put("allData", 0);
                    list.add(mp);
                    index++;
                }
            }
            Map mp = new HashMap<>();
            mp.put("orgName", obj[0]);
            mp.put("notBj", obj[1]);
            mp.put("yBj", obj[2]);
            mp.put("allData", obj[3]);
            list.add(mp);
            index++;
            notBj += obj[1] == null ? 0 : Long.valueOf(obj[1].toString());
            yBj += obj[2] == null ? 0 : Long.valueOf(obj[2].toString());
            allData += obj[3] == null ? 0 : Long.valueOf(obj[3].toString());
        }
        if (index < qy.length) {
            while (index <= qy.length - 1) {
                Map mp = new HashMap<>();
                mp.put("orgName", qy[index]);
                mp.put("notBj", 0);
                mp.put("yBj", 0);
                mp.put("allData", 0);
                list.add(mp);
                index++;
            }
        }
        Map mp = new HashMap<>();
        mp.put("orgName", "总计");
        mp.put("notBj", notBj);
        mp.put("yBj", yBj);
        mp.put("allData", allData);
        list.add(mp);
        json.put("rows", list);
        json.put("total", list.size());
        json.put("code", 200);
        return json.toString();
    }

    /**
     * 修改sde处理状态
     * 1：处理中
     * 2：处理完
     * 3：未处理
     */
//	@Override
//	public int updateSdeState(String objectId, String zt) {
//		int count =0;
//		if(StringUtils.isNotBlank(objectId) && StringUtils.isNotBlank(zt)){
//			String hql=" update sde.feedback m set m.qdzt=? where m.Objectid=?";
//			count = gxProblemReportDao.createSQLQuery(hql, zt,objectId).executeUpdate();
//		}
//		return count;
//	}

    /**
     * 根据当前用户查询出当前区域下的上报问题
     */
    @Override
    public List<GxProblemReport> getByObjectId(String objectId) {
        //自行处理
//		StringBuffer hql = new StringBuffer("from GxProblemReport ps where ps.objectId=? ");
//		hql.append(" order by ps.id desc ");
//		List<GxProblemReport> list = gxProblemReportDao.find(hql.toString(), objectId);//非自行处理
//		if (list!=null && list.size()>0) {
//			List<GxProblemReport> gxList=GxProblemReportConvertor.convertVoListToFormList(list);
//			return  gxList;
//		}
        return null;
    }

    @Override
    public void saveBusForm(GxProblemReport form) {
//		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        if (form.getId() == null || "".equals(form.getId()))
            form.setId(UUID.randomUUID().toString());
        form.setSbsj(new Timestamp(System.currentTimeMillis()));
        try {
            if (SecurityContext.getCurrentUser() != null) {
                form.setSbr(SecurityContext.getCurrentUser().getUserName());
                form.setParentOrgId(SecurityContext.getCurrentOrgId());
                OpuOmUserInfo userInfo = omOrgRestService.getOpuOmUserInfoByLoginName(SecurityContext.getCurrentUserName());
                form.setDirectOrgId(userInfo.getOrgId());
                form.setLoginname(SecurityContext.getOpusLoginUser().getUser().getLoginName());
            }
        } catch (Exception e) {
        }
        form.setSfjb(0);
        try {
            gxProblemReportMapper.insertGxProblemReport(form);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Override
    public void save(GxProblemReport form) {
        try {
            if (form.getId() != null) {
                gxProblemReportMapper.updateGxProblemReport(form);
            } else {
                form.setId(UUID.randomUUID().toString());
                gxProblemReportMapper.insertGxProblemReport(form);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    //	@Override
    public void updateBusForm(GxProblemReport form) throws Exception {
        gxProblemReportMapper.updateGxProblemReport(form);
    }

    @Override
    public GxProblemReport get(String id) throws Exception {
        return gxProblemReportMapper.getGxProblemReportById(id);
    }

    @Override
    public Boolean hasReportRight(String userId) {
        List<OpuAcRoleUser> opuAcRoleUsers = omOrgRestService.getRolesByUserId(userId);
        String inspectorRoleId = omOrgRestService.getRoleByRoleCode("ps_xc").getRoleId();
        for (OpuAcRoleUser opuAcRoleUser : opuAcRoleUsers) {
            if (opuAcRoleUser.getRoleId().equals(inspectorRoleId))
                return true;
        }
        return false;
    }

    @Override
    public GxProblemReport getGxProblemReportById(String id) throws Exception {
        GxProblemReport gxProblemReport = get(id);
        if (gxProblemReport != null) {
            List<Metacodeitem> facilityTypeItems = metacodetypeService.getDicdataByTypecode("facility_type");
            List<Metacodeitem> wtlxItems = metacodetypeService.getDicdataByTypecode("wtlx3");
            List<Metacodeitem> degreeItems = metacodetypeService.getDicdataByTypecode("emergency_degree");
            if (ObjectUtils.allNotNull(gxProblemReport.getBhlx())) {
                List<Metacodeitem> bhlxList = wtlxItems.stream().filter(metacodeitem -> gxProblemReport.getBhlx().toString().contains(metacodeitem.getCode())).collect(Collectors.toList());
                if (ObjectUtils.allNotNull(gxProblemReport.getSslx())) {
                    bhlxList = bhlxList.stream().filter(metacodeitem -> gxProblemReport.getSslx().equals(metacodeitem.getParenttypecode())).collect(Collectors.toList());
                }
                gxProblemReport.setBhlx(bhlxList.stream().map(metacodeitem -> metacodeitem.getName()).collect(Collectors.joining(",")));
            }
            if (ObjectUtils.allNotNull(gxProblemReport.getSslx())) {
                String sslx = facilityTypeItems.stream().filter(metacodeitem -> metacodeitem.getCode().equals(gxProblemReport.getSslx())).collect(Collectors.toList()).get(0).getName();
                gxProblemReport.setSslx(sslx);
            }
            if (ObjectUtils.allNotNull(gxProblemReport.getJjcd())) {
                String jjcd = degreeItems.stream().filter(metacodeitem -> metacodeitem.getCode().equals(gxProblemReport.getJjcd())).collect(Collectors.toList()).get(0).getName();
                gxProblemReport.setJjcd(jjcd);
            }
            if (ObjectUtils.allNotNull(gxProblemReport.getSbsj())) {
                gxProblemReport.setSbsjStr(DateUtils.dateTimeToString(gxProblemReport.getSbsj(), "yyyy-MM-DD HH:mm:ss"));
            }
        }
        return gxProblemReport;
    }

    @Override
    public List<BscAttForm> getBscAttByTableNameAndPkNameAndRecordId(String tableName, String pkName, String recordId) throws Exception {
        BscAttForm form = new BscAttForm();
        form.setOrgId(SecurityContext.getCurrentOrgId());
        if (ObjectUtils.allNotNull(tableName)) {
            form.setTableName(tableName);
        }
        if (ObjectUtils.allNotNull(pkName)) {
            form.setPkName(pkName);
        }
        if (ObjectUtils.allNotNull(recordId)) {
            form.setRecordId(recordId);
        }
        return gxProblemReportMapper.findBscAttForm(form);
    }

    @Override
    public List<BscAttForm> getBscAttByTableNameAndPkNameAndRecordId(String tableName, String pkName, String recordId, String orgId) throws Exception {
        BscAttForm form = new BscAttForm();
        form.setOrgId(orgId);
        if (ObjectUtils.allNotNull(tableName)) {
            form.setTableName(tableName);
        }
        if (ObjectUtils.allNotNull(pkName)) {
            form.setPkName(pkName);
        }
        if (ObjectUtils.allNotNull(recordId)) {
            form.setRecordId(recordId);
        }
        return gxProblemReportMapper.findBscAttForm(form);
    }

    @Override
    public List<Map<String, Object>> getTabsData() throws Exception {
        String sql = "select v.VIEW_ID,v.VIEW_COMMENT,av.APP_VIEW_ID,av.APP_ID,af.APP_FLOWDEF_ID,f.APP_FORM_ID from ACT_TPL_APP_VIEW av,ACT_TPL_APP_FLOWDEF af,ACT_STO_VIEW v,ACT_TPL_APP_FORM f where af.PROCDEF_KEY=? and af.APP_ID=av.APP_ID and v.VIEW_ID=av.VIEW_ID and f.APP_ID = af.APP_ID  order by v.CREATE_TIME";
        StringBuffer elementSql = new StringBuffer("select w.WIDGET_RENDERER,e.ELEMENT_CODE,e.ELEMENT_NAME from ACT_STO_ELEMENT e,ACT_STO_WIDGET w where ELEMENT_ID in ( select distinct ELEMENT_ID from ACT_TPL_PRIV_PROCFORM p where ");
        elementSql.append(" p.APP_FORM_ID = ? and p.PROC_DEF_VERSION = (select max(VERSION_) from ACT_RE_PROCDEF where KEY_=?) ")
                .append(" and p.VIEW_ID=? and p.IS_HIDDEN=0 and p.IS_READONLY=0) and IS_INNER_ELEMENT=1 and w.WIDGET_ID=e.WIDGET_ID order by w.SORT_NO");
        List<Map<String, Object>> tabList = jdbcTemplate.queryForList(sql, WfRestController.PROCDEF_KEY);
        for (Map<String, Object> tab : tabList) {
            List<Map<String, Object>> wfMenuList = jdbcTemplate.queryForList(elementSql.toString(), tab.get("APP_FORM_ID"), WfRestController.PROCDEF_KEY, tab.get("VIEW_ID"));
            tab.put("wfMenu", wfMenuList);
        }
        return tabList;
    }

    @Override
    public String getAppIdByProcDefKey(String flowdefKey) throws Exception {
//		String sql = "select APP_ID from ACT_TPL_APP_FLOWDEF where PROCDEF_KEY=?";
//		Map<String,Object> appIdMap = jdbcTemplate.queryForMap(sql,flowdefKey);
//		return (String)appIdMap.get("APP_ID");
        return gxProblemReportMapper.getAppIdByProcDefKey(flowdefKey);
    }

    @Override
    public List<Map<String, Object>> getUserByroleCode(String orgCode, String roleCode) throws Exception {
        String orgHql = "select u.* from opu_om_user u left join opu_om_user_org uo on uo.user_id=u.user_id left join opu_om_org o on o.org_id=uo.org_id where org_code=? " +
                " Intersect " +
                "select u.* from opu_om_user u left join opu_om_user_org uo on uo.user_id=u.user_id left join opu_om_org o on o.org_id=uo.org_id where org_code=?";
        return jdbcTemplate.queryForList(orgHql, orgCode, roleCode);
    }

    @Override
    public List<Map<String, Object>> getAllChildByroleCode(String orgCode, String roleCode) throws Exception {
        String orgHql = "select u.* from opu_om_user u left join opu_om_user_org uo on uo.user_id=u.user_id where uo.org_id in (select org_id from opu_om_org start with org_code=? connect by prior org_id=parent_org_id )" +
                " Intersect " +
                "select u.* from opu_om_user u left join opu_om_user_org uo on uo.user_id=u.user_id left join opu_om_org o on o.org_id=uo.org_id where org_code=?";
        return jdbcTemplate.queryForList(orgHql, orgCode, roleCode);
    }

    @Override
    public List<OpuOmUser> getUserAndSubNodeById(String type, String id) throws Exception {
        List activeUsers = null;
        if ("$ORG".equalsIgnoreCase(type)) {
            activeUsers = gxProblemReportMapper.getOpuOmUsersByOrgId(id);
        } else if ("$ROLE".equalsIgnoreCase(type)) {
            activeUsers = opuAcRoleUserMapper.getActiveUserByRoleId(id);
        } else if ("$POS".equalsIgnoreCase(type)) {
            activeUsers = opuOmUserPosMapper.getActiveUsersByPosId(id);
        }
        return activeUsers;
    }

    @Override
    public String getAssigneeByTaskCode(String procInstId, String taskCode) throws Exception {
        List<HistoricTaskInstance> historyTaskList = ((HistoricTaskInstanceQuery) historyService.createHistoricTaskInstanceQuery().processInstanceId(procInstId)).list();
        String assignee = null;
        for (HistoricTaskInstance task : historyTaskList) {
            if (taskCode.equals(task.getTaskDefinitionKey())) {
                assignee = task.getAssignee();
                break;
            }
        }
        return assignee;
    }

    @Override
    public List<OpuOmOrg> getOrgsByLoginName(String loginName) throws Exception {
        return gxProblemReportMapper.getChildOrgsByLoginName(loginName);
    }

    @Override
    public List<OpuOmOrg> getJlOrgsByLoginName(String loginName) throws Exception {
        List<OpuOmOrg> list = gxProblemReportMapper.getOrgsByLoginName(loginName);
        OpuOmOrg temp = null;
        String orgIds = "";
        Set<String> set = new HashSet<String>();
        for (OpuOmOrg org : list) {
            temp = getJlOrg(org);
            if (temp != null) {
                set.add(temp.getOrgId());
            }
        }
        if (set.isEmpty()) {
            return null;
        }
        return gxProblemReportMapper.getChildOrgByOrgIds(set);
    }

    /**
     * 获取上级监理单位
     *
     * @param omOrg
     * @return
     */
    private OpuOmOrg getJlOrg(OpuOmOrg omOrg) {
        boolean flag = false;
        if (omOrg != null) {
            if ("13".equals(omOrg.getOrgRank())) {
                flag = true;
                if (flag) {
                    return omOrg;//返回本级组织
                }
            }
            if (!flag) {//本级没有获取上级
                String parentOrgId = omOrg.getParentOrgId();
                OpuOmOrg omPrentOrgForm = opuOmOrgMapper.getActiveOrg(parentOrgId);
                return getJlOrg(omPrentOrgForm);
            }
        }
        return null;
    }

    @Override
    public String getBjSummary(String loginName, int pageNo, int pageSize) throws Exception {
        StringBuffer sql = new StringBuffer("select PROCDEF_KEY,TASK_CODE,TASK_NAME,TASK_ID,PROC_INST_ID,SZWZ,SSLX,BHLX,ID,to_char(SBSJ,'yyyy-MM-DD HH24:mi:ss') SBSJ,SBR,WTMS,JJCD,PARENT_ORG_NAME from (");
        sql.append(BJ_SQL).append(") where rownum BETWEEN ? and ?");
        Map<String, Object> countMap = jdbcTemplate.queryForMap(BJ_COUNT_SQL, new Object[]{WfRestController.PROCDEF_KEY, WfRestController.PROCDEF_KEY_RGRM, loginName});
        BigDecimal count = (BigDecimal) countMap.get("RECORD_NUM");
        List<Map<String, Object>> list = null;
        if (count != null && count.intValue() > 0) {
            if (count.intValue() < pageSize) {
                pageSize = count.intValue();
            }
            int maxPageNum = (count.intValue() + (pageSize - count.intValue() % pageSize)) / pageSize;
            if (pageNo > maxPageNum) {
                pageNo = maxPageNum;
            }
            int min = (pageNo - 1) * pageSize + 1;
            if (min == 0) {
                min = 1;
            }
            int max = pageNo * pageSize;
            list = jdbcTemplate.queryForList(sql.toString(), new Object[]{WfRestController.PROCDEF_KEY, WfRestController.PROCDEF_KEY_RGRM, loginName, min, max});

        }
        JSONObject json = new JSONObject();
        if (list == null) {
            list = new ArrayList<Map<String, Object>>();
        }
        JSONArray jsonArray = new JSONArray(list);
        json.put("rows", jsonArray);
        json.put("total", count);
        return json.toString();
    }

    @Override
    public Page getBjSummaryPage(String loginName, int pageNo, int pageSize) throws Exception {
        StringBuffer sql = new StringBuffer("select TASK_NAME,TASK_ID,PROC_INST_ID,SZWZ,SSLX,BHLX,ID,to_char(SBSJ,'yyyy-MM-DD HH24:mi:ss') SBSJ,SBR,WTMS,JJCD,PARENT_ORG_NAME from (");
        sql.append(BJ_SQL).append(") where rownum BETWEEN ? and ?");
        Map<String, Object> countMap = jdbcTemplate.queryForMap(BJ_COUNT_SQL, new Object[]{WfRestController.PROCDEF_KEY, WfRestController.PROCDEF_KEY_RGRM, loginName});
        BigDecimal count = (BigDecimal) countMap.get("RECORD_NUM");
        List<Map<String, Object>> list = null;
        if (count != null && count.intValue() > 0) {
            if (count.intValue() < pageSize) {
                pageSize = count.intValue();
            }
            int maxPageNum = (count.intValue() + (pageSize - count.intValue() % pageSize)) / pageSize;
            if (pageNo > maxPageNum) {
                pageNo = maxPageNum;
            }
            int min = (pageNo - 1) * pageSize + 1;
            if (min == 0) {
                min = 1;
            }
            int max = pageNo * pageSize;
            list = jdbcTemplate.queryForList(sql.toString(), new Object[]{WfRestController.PROCDEF_KEY, WfRestController.PROCDEF_KEY_RGRM, loginName, min, max});

        }
        JSONObject json = new JSONObject();
        if (list == null) {
            list = new ArrayList<Map<String, Object>>();
        }
        Page page = new Page();
        page.setResult(list);
        page.setTotalItems(count.longValueExact());
        return page;
    }

    @Override
    public String getYbSummary(String loginName, int pageNo, int pageSize) throws Exception {
        StringBuffer sql = new StringBuffer("select PROCDEF_KEY,TASK_CODE,TASK_NAME,TASK_ID,PROC_INST_ID,SZWZ,SSLX,BHLX,ID,to_char(SBSJ,'yyyy-MM-DD HH24:mi:ss') SBSJ,SBR,WTMS,JJCD,PARENT_ORG_NAME from (");
        sql.append(YB_SQL).append(") where rownum BETWEEN ? and ?");
        Map<String, Object> countMap = jdbcTemplate.queryForMap(YB_COUNT_SQL, new Object[]{WfRestController.PROCDEF_KEY, WfRestController.PROCDEF_KEY_RGRM, loginName});
        BigDecimal count = (java.math.BigDecimal) countMap.get("RECORD_NUM");
        List<Map<String, Object>> list = null;
        if (count != null && count.intValue() > 0) {
			if (count.intValue() < pageSize) {
				pageSize = count.intValue();
			}
			int maxPageNum = (count.intValue() + (pageSize - count.intValue() % pageSize)) / pageSize;
			if (pageNo > maxPageNum) {
				pageNo = maxPageNum;
			}
			int min = (pageNo - 1) * pageSize + 1;
			if (min == 0) {
				min = 1;
			}
			int max = pageNo * pageSize;
			list = jdbcTemplate.queryForList(sql.toString(), new Object[]{WfRestController.PROCDEF_KEY, WfRestController.PROCDEF_KEY_RGRM, loginName, min, max});
		}
        JSONObject json = new JSONObject();
        if (list == null) {
            list = new ArrayList<Map<String, Object>>();
        }
        JSONArray jsonArray = new JSONArray(list);
        json.put("rows", jsonArray);
        json.put("total", count);
        return json.toString();
    }

    @Override
    public Page getYbSummaryPage(String loginName, int pageNo, int pageSize) throws Exception {
        String yb_sql = "select temp.start_time_,temp.return_time_ re_time,temp.ASSIGNEE_,return_time_,temp.PROCDEF_KEY,temp.TASK_CODE,temp.TASK_ID,temp.cu_task_id,temp.TASK_NAME,asa.PROC_INST_ID,dgpr.SZWZ,dgpr.SSLX,dgpr.BHLX,dgpr.ID,dgpr.SBSJ,dgpr.SBR,dgpr.WTMS,dgpr.JJCD,dgpr.PARENT_ORG_NAME from " +
                "(select arp.KEY_ PROCDEF_KEY,aht.TASK_DEF_KEY_ TASK_CODE,aht.ID_ TASK_ID,rut.ID_ cu_task_id,aht.NAME_ TASK_NAME,aht.PROC_INST_ID_,aht.END_TIME_,aht.start_time_,aht.ASSIGNEE_,aht.return_time_,row_number() over(partition by aht.PROC_INST_ID_ order by aht.START_TIME_ desc) ROW_NUMBER " +
                "from ACT_HI_TASKINST aht,ACT_RU_TASK rut, ACT_RE_PROCDEF arp where arp.KEY_ in (?,?) AND aht.ASSIGNEE_=? " +
                "AND aht.PROC_DEF_ID_=arp.ID_ and rut.PROC_INST_ID_=AHT.PROC_INST_ID_ AND aht.END_TIME_ is NOT NULL ) temp,DRI_GX_PROBLEM_REPORT dgpr,ACT_STO_APPINST asa where temp.ROW_NUMBER=1 AND dgpr.ID = asa.MASTER_RECORD_ID AND asa.PROC_INST_ID = temp.PROC_INST_ID_ order by temp.start_time_ DESC";
        StringBuffer sql = new StringBuffer("select * from (select ROWNUM RN,TO_CHAR (start_time_,'yyyy-MM-DD HH24:mi:ss') start_time_," +
                "re_time return_time_,ASSIGNEE_,TASK_NAME,TASK_ID,cu_task_id,PROC_INST_ID,SZWZ,SSLX,BHLX,ID,to_char(SBSJ,'yyyy-MM-DD HH24:mi:ss') SBSJ,SBR,WTMS,JJCD,PARENT_ORG_NAME from (");
        sql.append(yb_sql).append("))where rn BETWEEN ? and ?");

        Map<String, Object> countMap = jdbcTemplate.queryForMap(YB_COUNT_SQL, new Object[]{WfRestController.PROCDEF_KEY, WfRestController.PROCDEF_KEY_RGRM, loginName});
        BigDecimal count = (java.math.BigDecimal) countMap.get("RECORD_NUM");
        List<Map<String, Object>> list = null;
        if (count != null && count.intValue() > 0) {
            if (count.intValue() < pageSize) {
                pageSize = count.intValue();
            }
            int maxPageNum = (count.intValue() + (pageSize - count.intValue() % pageSize)) / pageSize;
            if (pageNo > maxPageNum) {
                pageNo = maxPageNum;
            }
            int min = (pageNo - 1) * pageSize + 1;
            if (min == 0) {
                min = 1;
            }
            int max = pageNo * pageSize;
            list = jdbcTemplate.queryForList(sql.toString(), new Object[]{WfRestController.PROCDEF_KEY, WfRestController.PROCDEF_KEY_RGRM, loginName, min, max});

        }

        JSONObject json = new JSONObject();
        if (list == null) {
            list = new ArrayList<Map<String, Object>>();
        }
        Page page = new Page();
        page.setResult(list);
        page.setTotalItems(count.longValue());
        return page;
    }

    //获取上一步taskId
    @Override
    public String getUpTaskId(String taskId) {
        String sql = "select * from(select lead(s.ID_,1) over (order by s.ID_ desc) as up_id," +
                " s.* from ACT_HI_TASKINST s,ACT_RU_TASK s1 where s1.id_=? " +
                "and s.PROC_INST_ID_=S1.PROC_INST_ID_ " +
                " order by s.END_TIME_ desc) ps where ps.id_ = ?";
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql, new Object[]{taskId, taskId});
        if (list != null && list.size() > 0)
            return String.valueOf(list.get(0).get("UP_ID"));
        return null;
    }
    //获取问题上报的taskId（用于查询附件）
    @Override
    public String getStartTaskId(String taskId) {
        String sql = "select * from( select lead(s.ID_,1) over (order by s.ID_ desc) as up_id," +
                "ROW_NUMBER () OVER ( PARTITION BY s.PROC_INST_ID_ ORDER BY s.START_TIME_ asc ) ru, " +
                " s.* from ACT_HI_TASKINST s,ACT_HI_TASKINST s1 where s1.id_= ? and s.PROC_INST_ID_=S1.PROC_INST_ID_  order by s.start_time_ asc " +
                ") ps where 1=1 and ru =1";
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql, new Object[]{taskId});
        if (list != null && list.size() > 0)
            return String.valueOf(list.get(0).get("ID_"));
        return null;
    }

    @Override
    public String getDZbSummary(String loginName, int pageNo, int pageSize) throws Exception {
        StringBuffer sql = new StringBuffer("select PROCDEF_KEY,TASK_CODE,TASK_NAME,TASK_ID,PROC_INST_ID,SZWZ,SSLX,BHLX,ID,to_char(SBSJ,'yyyy-MM-DD HH24:mi:ss') SBSJ,SBR,WTMS,JJCD,PARENT_ORG_NAME from (");
        sql.append(DB_SQL).append(") where rownum BETWEEN ? and ?");

        Map<String, Object> countMap = jdbcTemplate.queryForMap(DB_COUNT_SQL, new Object[]{WfRestController.PROCDEF_KEY, WfRestController.PROCDEF_KEY_RGRM, loginName});
        BigDecimal count = (java.math.BigDecimal) countMap.get("RECORD_NUM");
        List<Map<String, Object>> list = null;
        if (count != null && count.intValue() > 0) {
            if (count.intValue() < pageSize) {
                pageSize = count.intValue();
            }
            int maxPageNum = (count.intValue() + (pageSize - count.intValue() % pageSize)) / pageSize;
            if (pageNo > maxPageNum) {
                pageNo = maxPageNum;
            }
            int min = (pageNo - 1) * pageSize + 1;
            if (min == 0) {
                min = 1;
            }
            int max = pageNo * pageSize;
            list = jdbcTemplate.queryForList(sql.toString(), new Object[]{WfRestController.PROCDEF_KEY, WfRestController.PROCDEF_KEY_RGRM, loginName, min, max});

        }
        JSONObject json = new JSONObject();
        if (list == null) {
            list = new ArrayList<Map<String, Object>>();
        }
        JSONArray jsonArray = new JSONArray(list);
        json.put("rows", jsonArray);
        json.put("total", count);
        return json.toString();
    }

    @Override
    public Page getDZbSummaryList(String loginName, int pageNo, int pageSize) throws Exception {
        /*StringBuffer sql = new StringBuffer("select * from (select TASK_NAME,TASK_ID,create_time_ START_TIME_,PROC_INST_ID,SZWZ,SSLX,BHLX,ID,to_char(SBSJ,'yyyy-MM-DD HH24:mi:ss') SBSJ,SBR,WTMS,JJCD,PARENT_ORG_NAME,ROWNUM RN from (");
        String MY_DB_SQL = "select arp.KEY_ PROCDEF_KEY,art.TASK_DEF_KEY_ TASK_CODE,art.NAME_ TASK_NAME,art.create_time_,art.ID_ TASK_ID,asa.PROC_INST_ID,dgpr.SZWZ,dgpr.SSLX,dgpr.BHLX,dgpr.ID,dgpr.SBSJ,dgpr.SBR,dgpr.WTMS,dgpr.JJCD,dgpr.PARENT_ORG_NAME" +
                " from ACT_RU_TASK art,ACT_RE_PROCDEF arp,ACT_STO_APPINST asa,DRI_GX_PROBLEM_REPORT dgpr where arp.KEY_ in (?,?) AND art.ASSIGNEE_=? AND art.PROC_DEF_ID_=arp.ID_ AND dgpr.ID = asa.MASTER_RECORD_ID AND asa.PROC_INST_ID=art.PROC_INST_ID_ order by art.CREATE_TIME_ desc";
        sql.append(MY_DB_SQL).append(")) where RN BETWEEN ? and ? ");
        Map<String, Object> countMap = jdbcTemplate.queryForMap(DB_COUNT_SQL, new Object[]{WfRestController.PROCDEF_KEY, WfRestController.PROCDEF_KEY_RGRM, loginName});
        BigDecimal count = (java.math.BigDecimal) countMap.get("RECORD_NUM");
        List<Map<String, Object>> list = null;
        if (count != null && count.intValue() > 0) {
            if (count.intValue() < pageSize) {
                pageSize = count.intValue();
            }
            int maxPageNum = (count.intValue() + (pageSize - count.intValue() % pageSize)) / pageSize;
            if (pageNo > maxPageNum) {
                pageNo = maxPageNum;
            }
            int min = (pageNo - 1) * pageSize + 1;
            if (min == 0) {
                min = 1;
            }
            int max = pageNo * pageSize;
            list = jdbcTemplate.queryForList(sql.toString(), new Object[]{WfRestController.PROCDEF_KEY, WfRestController.PROCDEF_KEY_RGRM, loginName, min, max});
*/
		StringBuffer sql = new StringBuffer("select * from (select TASK_NAME,TASK_ID,create_time_ START_TIME_,PROC_INST_ID,SZWZ,SSLX,BHLX,ID,to_char(SBSJ,'yyyy-MM-DD HH24:mi:ss') SBSJ,SBR,WTMS,JJCD,PARENT_ORG_NAME,ROWNUM RN from (");
		String MY_DB_SQL="select arp.KEY_ PROCDEF_KEY,art.TASK_DEF_KEY_ TASK_CODE,art.NAME_ TASK_NAME,art.create_time_,art.ID_ TASK_ID,asa.PROC_INST_ID,dgpr.SZWZ,dgpr.SSLX,dgpr.BHLX,dgpr.ID,dgpr.SBSJ,dgpr.SBR,dgpr.WTMS,dgpr.JJCD,dgpr.PARENT_ORG_NAME" +
				" from ACT_RU_TASK art,ACT_RE_PROCDEF arp,ACT_STO_APPINST asa,DRI_GX_PROBLEM_REPORT dgpr where arp.KEY_ in (?,?) AND art.ASSIGNEE_=? AND art.PROC_DEF_ID_=arp.ID_ AND dgpr.ID = asa.MASTER_RECORD_ID AND asa.PROC_INST_ID=art.PROC_INST_ID_ order by art.CREATE_TIME_ desc";
		sql.append(MY_DB_SQL).append(")) where RN BETWEEN ? and ? ");
		Map<String,Object> countMap = jdbcTemplate.queryForMap("select count(1) RECORD_NUM from ("+MY_DB_SQL.toString()+")",new Object[]{WfRestController.PROCDEF_KEY,WfRestController.PROCDEF_KEY_RGRM,loginName});
		BigDecimal count = (java.math.BigDecimal)countMap.get("RECORD_NUM");
		List<Map<String, Object>> list=null;
		if(count!=null&&count.intValue()>0){
			if(count.intValue()<pageSize){
				pageSize=count.intValue();
			}
			int maxPageNum = (count.intValue()+(pageSize-count.intValue()%pageSize))/pageSize;
			if(pageNo>maxPageNum){
				pageNo = maxPageNum;
			}
			int min = (pageNo-1)*pageSize+1;
			if(min==0){
				min=1;
			}
			int max = pageNo*pageSize;
			list = jdbcTemplate.queryForList(sql.toString(),new Object[]{WfRestController.PROCDEF_KEY,WfRestController.PROCDEF_KEY_RGRM,loginName,min,max});
		}
        JSONObject json = new JSONObject();
        if (list == null) {
            list = new ArrayList<Map<String, Object>>();
        }
        Page page = new Page();
        page.setResult(list);
        page.setTotalItems(count.longValue());
        return page;
    }

    @Override
    public List<Map> getDZbSummary(GxProblemReport problemReport) throws Exception {
        List<Map> resultList = new ArrayList<>();
        List<Metacodeitem> facilityTypeItems = metacodetypeService.getDicdataByTypecode("facility_type");
        List<Metacodeitem> wtlxItems = metacodetypeService.getDicdataByTypecode("wtlx3");
        String sql = "select a.*,b.proc_inst_id,b.summary_title from dri_gx_problem_report a inner join act_sto_appinst b on a.id = b.master_record_id";
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
        for (Map map : list) {
            String procInstId = map.get("PROC_INST_ID").toString();
            List<Task> tasksw = taskService.createTaskQuery().processInstanceId(procInstId).list();
            List<Task> tasks = taskService.createTaskQuery().processInstanceId(procInstId).taskAssignee(problemReport.getLoginname()).list();
            if (ObjectUtils.allNotNull(map.get("SSLX"))) {
                String sslx = facilityTypeItems.stream().filter(metacodeitem -> metacodeitem.getCode().equals(map.get("sslx"))).collect(Collectors.toList()).get(0).getName();
                map.put("SSLX", sslx);
            }
            if (ObjectUtils.allNotNull(map.get("BHLX"))) {
                List<Metacodeitem> bhlxList = wtlxItems.stream().filter(metacodeitem -> map.get("bhlx").toString().contains(metacodeitem.getCode())).collect(Collectors.toList());
                map.put("BHLX", bhlxList.stream().map(metacodeitem -> metacodeitem.getCode()).collect(Collectors.joining(",")));
            }
            if (CollectionUtils.isEmpty(tasks))
                continue;
            for (Task task : tasks) {
                Map resultMap = new HashMap();
                resultMap.putAll(map);
                MapUtils.safeAddToMap(resultMap, "TASK_NAME", task.getName());
                MapUtils.safeAddToMap(resultMap, "TASK_ID", task.getId());
                MapUtils.safeAddToMap(resultMap, "TASK_DEF_KEY", task.getTaskDefinitionKey());
                resultList.add(resultMap);
            }
        }
        return resultList;
    }

    /**
     * 获取正在运行中的历史信息
     */
    @Override
    public List<Map> getTraceInfo(String taskId) throws Exception {
        List<Map> list = new ArrayList();
        HistoricTaskInstanceQuery hisQuery = historyService.createHistoricTaskInstanceQuery();
        HistoricTaskInstance hisTask = hisQuery.taskId(taskId).singleResult();
        List<HistoricTaskInstance> listHis = historyService.createHistoricTaskInstanceQuery().processInstanceId(hisTask.getProcessInstanceId()).list();
        if (hisTask.getProcessInstanceId() != null) {
            String processInstanceId = hisTask.getProcessInstanceId();
            List<com.augurit.agcloud.bpm.common.domain.BpmHistoryCommentForm> listBpm = bpmTaskService.getHistoryCommentsByProcessInstanceId(processInstanceId);
            //List<BpmHistoryCommentForm> listBpm = bpmTaskService.getHistoryCommentsByProcessInstanceId(processInstanceId);
            List<String> listTaskIds = new ArrayList();
            for (HistoricTaskInstance his : listHis) {
                listTaskIds.add(his.getId());
            }
            //得到转派意见
            List<ReassignProcess> listReass = reassignProcessService.getReassingByTaskIds(listTaskIds);
            Map<String, Map> task = new HashMap();
            if (listReass != null) {
                for (ReassignProcess res : listReass) {
					/*BpmHistoryCommentForm map = new BpmHistoryCommentForm();
					map.setNodeName(res.getTaskName());
					map.setSigeInDate(res.getReasSignTime()!=null?new Date(res.getReasSignTime().getTime()):null);
					map.setEndDate(null);
					map.setTaskAssignee(res.getTaskName());
					map.setCommentMessage(res.getReassignComments());
					map.setTaskState(30);*/
                    Map map = new HashMap();
                    map.put("taskId", res.getTaskId());
                    map.put("name", "任务转派");//res.getTaskName()
                    map.put("endTime", res.getReasSignTime() != null ? new Date(res.getReasSignTime().getTime()) : null);
                    map.put("startTime", null);
                    map.put("assignee", null);
                    map.put("assigneeName", res.getAssigneeName());
                    map.put("description", res.getReassignComments());
                    map.put("state", "trans");
                    task.put(res.getTaskId(), map);
                    //list.add(map);
                }
            }
            //排序（默认升序）
            Collections.sort(listBpm, Comparator.comparing(com.augurit.agcloud.bpm.common.domain.BpmHistoryCommentForm::getSigeInDate));
            //Collections.sort(list, (arg0, arg1) -> ((Date)arg0.get("startTime")).compareTo((Date) arg1.get("startTime")));
            for (com.augurit.agcloud.bpm.common.domain.BpmHistoryCommentForm his : listBpm) {
                Map map = new HashMap();
                //map.put("name",his.getTaskId());
                map.put("name", his.getNodeName());
                map.put("startTime", his.getSigeInDate());
                map.put("endTime", his.getEndDate());
                map.put("assignee", null);
                map.put("assigneeName", his.getTaskAssignee());
                map.put("description", his.getCommentMessage());
                Integer taskState = his.getTaskState();
                String taskStateString = String.valueOf(taskState);
                if ("1".equals(taskStateString)) {
                    map.put("state", "start");
                } else if ("2".equals(taskStateString)) {
                    map.put("state", "end");
                } else if ("4".equals(taskStateString)) {
                    map.put("state", "trans");
                } else if ("3".equals(taskStateString)) {
                    map.put("state", "return");
                }
                list.add(map);
            }

        } else {
            throw new RuntimeException("查询不到历史任务信息!");
        }
        return list;
    }

    /**
     * 获取下一步监理单位下的处理人信息
     */
    @Override
    public List<OpuOmUser> getAssignees(String groupCode, String loginName) {
        Map map = correctMarkService.getFrom(loginName);
        OpuOmOrg org = psOrgUserService.getOrgByOrgCode(groupCode);
        if (map.containsKey("superviseOrgId") && map.get("superviseOrgId") != null) {
            String orgId = map.get("superviseOrgId").toString();
            if (orgId.contains("ORG_")) {
                orgId = orgId.substring(4);
            }
            List<OpuOmUser> users = psOrgUserService.getGroupByOrgId(org.getOrgId(), new String[]{orgId});
            //List<OpuOmUserInfo> users = omOrgRestService.getUsersByOrgIdAndGroupId("R025-G014",orgId);
            return users;
        } else if (map.containsKey("parentOrgId") && map.get("parentOrgId") != null) {
            String orgId = map.get("parentOrgId").toString();
            if (orgId.contains("ORG_")) {
                orgId = orgId.substring(4);
            }
            List<OpuOmUser> users = psOrgUserService.getGroupByOrgId(org.getOrgId(), new String[]{orgId});
            //List<OpuOmUserInfo> users = omOrgRestService.getUsersByOrgIdAndGroupId("R025-G014",orgId);
            return users;
        } else {
            return null;
        }
    }

    /**
     * 上报查询（问题上报列表查询）
     */
    public Map<String, Object> searchProblem(String id) {
        StringBuffer sql = new StringBuffer("select HI.start_time_,HI.end_time_,hi.id_ as task_id,HI.name_,DGPR.* from(" +
                "select row_number()over(partition BY HI.PROC_INST_ID_ order by HI.START_TIME_ desc) count_hi " +
                " ,HI.* from ACT_HI_TASKINST hi ) hi, " +
                "ACT_STO_APPINST asa, DRI_GX_PROBLEM_REPORT dgpr " +
                " where 1=1 and ASA.PROC_INST_ID = hi.PROC_INST_ID_ and " +
                "ASA.MASTER_RECORD_ID=DGPR.id and count_hi=1 and dgpr.id = ?");
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql.toString(), new Object[]{id});
        return list != null && list.size() > 0 ? list.get(0) : null;
    }

    /**
     * 查看任务状态（是否已办结）
     */
    @Override
    public String getState(String id) {
        String sql = "select hi.* from ACT_STO_APPINST app,ACT_HI_TASKINST hi,ACT_HI_PROCINST pro where 1=1\n" +
                " and APP.PROC_INST_ID=pro.ID_ and pro.ID_ = HI.PROC_INST_ID_ and APP.MASTER_RECORD_ID=?\n" +
                " order by HI.START_TIME_ desc";
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql, new Object[]{id});
        if (list != null && list.size() > 0) {
            Map<String, Object> map = list.get(0);
            if (map.containsKey("END_TIME_")) {
                Object o = map.get("END_TIME_");
                return o != null ? "end" : "active";
            }
        }
        return null;
    }

    /**
     * 查询上报数据
     */
    @Override
    public Page<GxProblemReportForm> searchForApp(Page<GxProblemReportForm> page, Map<String, String> map, String urlAll) {
        StringBuffer sql = new StringBuffer("select * from(SELECT decode(hi.END_TIME_,null,'active','ended') state," +
                " s.*,s1.proc_inst_id FROM DRI_GX_PROBLEM_REPORT s, ACT_STO_APPINST s1,ACT_HI_PROCINST hi " +
                " WHERE s. ID = S1.MASTER_RECORD_ID and s1.PROC_INST_ID=HI.PROC_INST_ID_ order by s.sbsj desc) ps where 1=1");
        List<Object> query = new ArrayList<>();
        if (map != null && map.size() > 0) {
            if (StringUtils.isNotBlank(map.get("state"))) {
                sql.append(" and ps.state= ?");
                query.add(map.get("state"));
            }
            if (StringUtils.isNotBlank(map.get("loginName"))) {
                sql.append(" and ps.loginname= ?");
                query.add(map.get("loginName"));
            }
            if (StringUtils.isNotBlank(map.get("keyWord"))) {
                sql.append(" and (ps.sbr like ? or ps.szwz like ?) ");
                query.add("%" + map.get("keyWord") + "%");
                query.add("%" + map.get("keyWord") + "%");
            }
            if (StringUtils.isNotBlank(map.get("xzqh"))) {
                sql.append(" and ps.parent_Org_Name like ? ");
                query.add("%" + map.get("xzqh") + "%");
            }
            if (StringUtils.isNotBlank(map.get("sslx"))) {
                sql.append(" and ps.sslx = ?");
                query.add(map.get("sslx"));
            }
            if (StringUtils.isNotBlank(map.get("wtlx"))) {
                sql.append(" and ps.bhlx like ?");
                query.add("%" + map.get("wtlx") + "%");
            }
            if (StringUtils.isNotBlank(map.get("startTime"))) {
                sql.append(" and ps.sbsj >= ?");
                query.add(new Date(new Long(map.get("startTime"))));
            }
            if (StringUtils.isNotBlank(map.get("endTime"))) {
                sql.append(" and ps.sbsj <= ?");
                query.add(new Date(new Long(map.get("endTime"))));
            }
            if(StringUtils.isNotBlank(map.get("usid"))){
                sql.append(" and ps.usid = ?");
                query.add(map.get("usid"));
            }else if(StringUtils.isNotBlank(map.get("objectId"))){
                sql.append(" and ps.objectId = ?");
                query.add(map.get("objectId"));
            }

        }
        sql.append(" and rownum BETWEEN ? and ?");
        int min = (page.getPageNo() - 1) * page.getPageSize() + 1;
        if (min == 0) min = 1;
        int max = page.getPageNo() * page.getPageSize();
        query.add(min);
        query.add(max);
        //Long count = jdbcTemplate.queryForObject(sql.toString(),query.toArray(),Long.class);
        List<GxProblemReportForm> listGx = (List<GxProblemReportForm>) JsonOfForm.listMapToForm(jdbcTemplate.queryForList(sql.toString(), query.toArray()), GxProblemReportForm.class);
        page.setResult(listGx);
        //page.setTotalItems(count);
        return page;
    }

    /**
     * app查看我的提交（包括自行处理数据）
     */
    @Override
    public Page getListsMyCommit(String loginName, int pageNo, int pageSize) {
        StringBuffer sql = new StringBuffer("select * from(SELECT START_TIME_,TASK_NAME, TASK_ID, PROC_INST_ID, SZWZ, SSLX , BHLX, ID, TO_CHAR(SBSJ," +
                " 'yyyy-MM-DD HH24:mi:ss') AS SBSJ , SBR,loginname, WTMS, JJCD, PARENT_ORG_NAME, ISBYSELF,ROWNUM AS RN FROM ( SELECT temp.START_TIME_,temp.PROCDEF_KEY, temp.TASK_CODE, " +
                "temp.TASK_ID, temp.TASK_NAME, asa.PROC_INST_ID ,dgpr.loginname, dgpr.SZWZ, dgpr.SSLX, dgpr.BHLX, dgpr.ID, dgpr.SBSJ , dgpr.SBR," +
                " dgpr.WTMS, dgpr.JJCD, dgpr.PARENT_ORG_NAME, dgpr.ISBYSELF  FROM DRI_GX_PROBLEM_REPORT dgpr LEFT " +
                " JOIN ACT_STO_APPINST asa ON dgpr.ID = asa.MASTER_RECORD_ID LEFT JOIN ( SELECT arp.KEY_ AS PROCDEF_KEY, " +
                " art.TASK_DEF_KEY_ AS TASK_CODE, art.ID_ AS TASK_ID, art.NAME_ AS TASK_NAME, aht.PROC_INST_ID_ , aht.END_TIME_,aht.START_TIME_, " +
                "ROW_NUMBER() OVER (PARTITION BY aht.PROC_INST_ID_ ORDER BY aht.START_TIME_ DESC) AS ROW_NUMBER FROM ACT_HI_TASKINST aht," +
                " ACT_RU_TASK art, ACT_RE_PROCDEF arp WHERE (arp.KEY_ IN (?, ?) AND aht.ASSIGNEE_ = ? AND AHT.PROC_INST_ID_ = art.PROC_INST_ID_ AND" +
                " aht.PROC_DEF_ID_ = arp.ID_ AND aht.END_TIME_ IS NOT NULL) ) temp ON asa.PROC_INST_ID = temp.PROC_INST_ID_ WHERE " +
                "1 = 1 and (temp.TASK_ID is not null or dgpr.ISBYSELF='true') and dgpr.loginname = ? ORDER BY temp.START_TIME_ DESC )) ");
        Page<Map<String, Object>> page = new Page();
        List<Map<String, Object>> list = null;
        Map<String, Object> countMap = jdbcTemplate.queryForMap("select count(1) as total from (" + sql.toString() + ")",
                new Object[]{WfRestController.PROCDEF_KEY, WfRestController.PROCDEF_KEY_RGRM, loginName, loginName});
        BigDecimal count = (java.math.BigDecimal) countMap.get("TOTAL");
        if (count != null && count.intValue() > 0) {
            if (count.intValue() < pageSize) {
                pageSize = count.intValue();
            }
            int maxPageNum = (count.intValue() + (pageSize - count.intValue() % pageSize)) / pageSize;
            if (pageNo > maxPageNum) {
                pageNo = maxPageNum;
            }
            int min = (pageNo - 1) * pageSize + 1;
            if (min == 0) {
                min = 1;
            }
            int max = pageNo * pageSize;
            sql.append(" WHERE rn BETWEEN ? AND ?");
            list = jdbcTemplate.queryForList(sql.toString(), new Object[]{WfRestController.PROCDEF_KEY, WfRestController.PROCDEF_KEY_RGRM, loginName, loginName, min, max});
            page.setResult(list);
            page.setTotalItems(count.intValue());
        }
        return page;
    }

    /**
     * 撤回或者回退
     */
    public ResultForm returnPrevTask(Task taks, String backComments) throws Exception {
        //设置回退
        taskService.setAssignee(taks.getId(), taks.getAssignee());
        taskService.setAssigneeName(taks.getId(), taks.getAssigneeName());
        this.bpmTaskService.addTaskComment(taks.getId(), taks.getProcessInstanceId(), backComments);
        return this.bpmTaskService.returnPrevTask(taks.getId());
    }

    /**
     * 根据masterEntity查询template相关信息
     */
    @Override
    public Map<String, Object> searchTemplate(String entityId) {
        StringBuffer hql = new StringBuffer("select TASK.id_ task_id,TASK.name_,task.PROC_INST_ID_,RE.KEY_ template_code,GX.* from " +
                " (select s.*,row_number() over(partition by s.PROC_INST_ID_ order by s.START_TIME_ desc) rum " +
                " from ACT_HI_TASKINST s) task, ACT_STO_APPINST app," +
                " DRI_GX_PROBLEM_REPORT  gx, ACT_RE_PROCDEF re where 1=1 and task.RUM = 1  and gx.ID = APP.MASTER_RECORD_ID " +
                " and app.PROC_INST_ID = TASK.PROC_INST_ID_ and TASK.PROC_DEF_ID_ = RE.id_" +
                " and gx.id=?");
        List<Map<String, Object>> list = this.jdbcTemplate.queryForList(hql.toString(), new Object[]{entityId});
        if (list != null && list.size() > 0) {
            return list.get(0);
			/*Map<String, String> map = new HashMap<String, String>();
			Map<String, Object> mapaa = list.get(0);
			map.put("templateId", String.valueOf(mapaa.get("TASK_ID")));
			map.put("templateCode", String.valueOf(mapaa.get("TEAMPLATE_CODE")));
			return map;*/
        }
        return null;
    }

    /**
     * 修改任务开始时间
     * */
    @Override
    public void updateTask (Task task, Map < String, String > map, OpuOmUserInfo user) throws Exception {
        if (task != null && "problemReport".equals(task.getTaskDefinitionKey())) {
            task.setDelegateStartTime(new Date());
            taskService.setDelegateStartTime(task.getId(), new Date());
            BpmTaskSendObject sendObject = new BpmTaskSendObject();
            sendObject.setTaskId(map.get("histTaskInstDbid"));
            List<BpmTaskSendConfig> listConfigs = new ArrayList<>();
            BpmTaskSendConfig sendConfig = new BpmTaskSendConfig();
            sendConfig.setAssignees(user.getLoginName());
            sendConfig.setUserTask(true);
            sendConfig.setEnableMultiTask(false);
            listConfigs.add(sendConfig);
            sendObject.setSendConfigs(listConfigs);
            this.bpmTaskService.completeTask(sendObject);
        } else {
            throw new RuntimeException("当前任务不在问题上报环节或不存在!");
        }
    }

    //获取问题上报的taskId（用于查询附件）
    @Override
    public Long getYbCount (String loginName, Map < String, Object > map) throws Exception {
        String yb_sql = "select temp.start_time_,temp.return_time_ re_time,temp.ASSIGNEE_,return_time_,temp.PROCDEF_KEY,temp.TASK_CODE,temp.TASK_ID,temp.cu_task_id,temp.TASK_NAME,asa.PROC_INST_ID,dgpr.SZWZ,dgpr.SSLX,dgpr.BHLX,dgpr.ID,dgpr.SBSJ,dgpr.SBR,dgpr.WTMS,dgpr.JJCD,dgpr.PARENT_ORG_NAME from " +
                " (select ru.id_ cu_task_id,s.* from ( SELECT arp.KEY_ PROCDEF_KEY, aht.TASK_DEF_KEY_ TASK_CODE, aht.ID_ TASK_ID, aht.NAME_ TASK_NAME, aht.PROC_INST_ID_,aht.END_TIME_, aht.start_time_, aht.ASSIGNEE_, aht.return_time_, ROW_NUMBER () OVER ( PARTITION BY aht.PROC_INST_ID_ ORDER BY aht.START_TIME_ desc ) ROW_NUMBER FROM ACT_HI_TASKINST aht, ACT_RE_PROCDEF arp WHERE arp.KEY_ IN (?,?) " +
                " AND aht.ASSIGNEE_ =? AND aht.PROC_DEF_ID_ = arp.ID_ AND aht.END_TIME_ IS NOT NULL) s left join ACT_RU_TASK ru on s.PROC_INST_ID_=RU.PROC_INST_ID_ ) temp,DRI_GX_PROBLEM_REPORT dgpr,ACT_STO_APPINST asa where temp.ROW_NUMBER=1 AND dgpr.ID = asa.MASTER_RECORD_ID AND asa.PROC_INST_ID = temp.PROC_INST_ID_ order by temp.start_time_ DESC";
        StringBuffer sql = new StringBuffer("select * from (select ROWNUM RN,TO_CHAR (start_time_,'yyyy-MM-DD HH24:mi:ss') start_time_," +
                "re_time return_time_,ASSIGNEE_,TASK_NAME,TASK_ID,cu_task_id,PROC_INST_ID,SZWZ,SSLX,BHLX,ID,to_char(SBSJ,'yyyy-MM-DD HH24:mi:ss') SBSJ,SBR,WTMS,JJCD,PARENT_ORG_NAME from (");
        String sqlCount = "select count(1) RECORD_NUM from (" + yb_sql + ")";

        Map<String, Object> countMap = jdbcTemplate.queryForMap(sqlCount, new Object[]{WfRestController.PROCDEF_KEY, WfRestController.PROCDEF_KEY_RGRM, loginName});
        BigDecimal count = (java.math.BigDecimal) countMap.get("RECORD_NUM");
        return count.longValue();
    }

    @Override
    public Long getDbCount (String loginName, Map < String, Object > map ) throws Exception {
        StringBuffer sql = new StringBuffer("select count(1) RECORD_NUM from (select TASK_NAME,TASK_ID,create_time_ START_TIME_,PROC_INST_ID,SZWZ,SSLX,BHLX,ID,to_char(SBSJ,'yyyy-MM-DD HH24:mi:ss') SBSJ,SBR,WTMS,JJCD,PARENT_ORG_NAME,ROWNUM RN from (");
        String MY_DB_SQL = "select arp.KEY_ PROCDEF_KEY,art.TASK_DEF_KEY_ TASK_CODE,art.NAME_ TASK_NAME,art.create_time_,art.ID_ TASK_ID,asa.PROC_INST_ID,dgpr.SZWZ,dgpr.SSLX,dgpr.BHLX,dgpr.ID,dgpr.SBSJ,dgpr.SBR,dgpr.WTMS,dgpr.JJCD,dgpr.PARENT_ORG_NAME" +
                " from ACT_RU_TASK art,ACT_RE_PROCDEF arp,ACT_STO_APPINST asa,DRI_GX_PROBLEM_REPORT dgpr where arp.KEY_ in (?,?) AND art.ASSIGNEE_=? AND art.PROC_DEF_ID_=arp.ID_ AND dgpr.ID = asa.MASTER_RECORD_ID AND asa.PROC_INST_ID=art.PROC_INST_ID_ order by art.CREATE_TIME_ desc";
        sql.append(MY_DB_SQL).append(")) ");
        Map<String, Object> countMap = jdbcTemplate.queryForMap(sql.toString(), new Object[]{WfRestController.PROCDEF_KEY, WfRestController.PROCDEF_KEY_RGRM, loginName});
        BigDecimal count = (java.math.BigDecimal) countMap.get("RECORD_NUM");
        return count.longValue();
    }

    /**
     * 根据id查询工作流的问题上报环节信息
     */
    public Map<String, String> getTaskByReportId (String entityId){
        List<Object> values = new ArrayList<Object>();
        StringBuffer hql = new StringBuffer("SELECT task.id_ as task_id,TASK.TASK_DEF_key_," +
                " task.START_TIME_,task.end_time_,task.name_ ,TEMP.key_ as TEMPLATE_CODE," +
                " TEMP.ID_ as def_id,PROC.PROC_INST_ID_ " +
                " FROM ACT_HI_TASKINST task,ACT_HI_PROCINST proc,ACT_STO_APPINST inst, " +
                " ACT_RE_PROCDEF temp WHERE inst.MASTER_RECORD_ID =? AND " +
                " task.PROC_INST_ID_ = proc.PROC_INST_ID_ AND proc.PROC_INST_ID_ = inst.PROC_INST_ID" +
                " AND temp.ID_ = PROC.PROC_DEF_ID_ ORDER BY task.START_TIME_ asc");
        List<Map<String, Object>> listResult = jdbcTemplate.queryForList(hql.toString(), new Object[]{entityId});
        //Todo change
        if (listResult != null && listResult.size() > 0) {
            Map<String, String> map = new HashMap<String, String>();
            Map<String, Object> objs = listResult.get(0);
            map.put("histTaskInstDbid", objs.get("TASK_ID").toString());
            if (objs.get("START_TIME_") != null && objs.get("END_TIME_") != null) {
                java.sql.Date startTime = new java.sql.Date(((java.sql.Timestamp) objs.get("START_TIME_")).getTime());
                java.sql.Date endTime = new java.sql.Date(((java.sql.Timestamp) objs.get("END_TIME_")).getTime());
                if (startTime != null && endTime != null) {
                    map.put("state", "ended");
                } else {
                    map.put("state", "active");
                }

            }

            map.put("templateId", objs.get("DEF_ID").toString());
            map.put("taskId", objs.get("TASK_ID").toString());
            map.put("templateCode", objs.get("TEMPLATE_CODE").toString());
            map.put("activityName", objs.get("NAME_").toString());
            map.put("procInstId", objs.get("PROC_INST_ID_").toString());
            map.put("activity", objs.get("TASK_DEF_KEY_").toString());
            return map;
        }
        return null;
    }
}

