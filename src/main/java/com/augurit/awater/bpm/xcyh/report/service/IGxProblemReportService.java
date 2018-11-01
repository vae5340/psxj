package com.augurit.awater.bpm.xcyh.report.service;

import com.augurit.agcloud.bpm.front.service.BpmBusAbstractService;
import com.augurit.agcloud.bsc.domain.BscAttForm;
import com.augurit.agcloud.framework.ui.result.ResultForm;
import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.agcloud.opus.common.domain.OpuOmUser;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.awater.bpm.xcyh.report.domain.GxProblemReport;
import com.augurit.awater.bpm.xcyh.report.web.form.GxProblemReportForm;
import com.augurit.awater.common.page.Page;
import org.flowable.task.api.Task;

import java.util.List;
import java.util.Map;

public interface IGxProblemReportService extends BpmBusAbstractService<GxProblemReport> {

	public List<GxProblemReport> listGxProblemReport(GxProblemReport gxProblemReport) throws Exception;

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
	void delete(String id) throws Exception;

	public List<Map<String, Object>> getLatestTen();

	public String searchPage(Page<GxProblemReport> page, GxProblemReport form,
                             Map<String, Object> map);
	/**
	 * 分页查询
	 * */
	public Page<GxProblemReportForm> searchFromAndMap(Page<GxProblemReport> page,
                                                      GxProblemReport form, Map<String, Object> map);
	/**
	 * 查询条件统计图
	 * */
	public String searchEachts(GxProblemReport form, Map<String, Object> map);
	/**
	 * 根据id查询工作流相关信息
	 */
	public Map<String, String> searchGzlData(String entityId);

	Map<String, String> getTaskByReportId(String entityId);

	/**
	 * 上报分页查询
	 * */
	public String searchSbPage(Page<GxProblemReport> page, GxProblemReport form,
                               Map<String, Object> map) ;
	/**
	 * 删除数据和流程信息
	 * @param form
	 * @return
	 */
	public String deleteProcessInstance(GxProblemReport form) throws Exception;

	/**
	 * 根据当前用户查询出当前区域下的上报问题
	 * */
	public List<GxProblemReport> getByLoginName(String loginName);
	/**
	 *上报统计
	 *按人统计
	 * */
	public String statisticsForPerson(GxProblemReport form, Map<String, Object> map);
	/**
	 *上报统计
	 *按区统计
	 * */
	public String statisticsForArea(GxProblemReport form, Map<String, Object> map);
	
	/**
	 * 根据当前用户查询出当前区域下的上报问题
	 * */
	public List<GxProblemReport> getByObjectId(String objectId);

	public Boolean hasReportRight(String userId);

    void save(GxProblemReport form);

    public GxProblemReport get(String id) throws Exception;

	Page getDZbSummaryList(String loginName, int pageNo, int pageSize) throws Exception;

	Long  getYbCount(String loginName, Map<String, Object> map) throws Exception;

	Long  getDbCount(String loginName, Map<String, Object> map) throws Exception;

    List<Map> getDZbSummary(GxProblemReport problemReport) throws Exception;

    Page  getYbSummaryPage(String loginName, int pageNo, int pageSize) throws Exception;

    String getUpTaskId(String taskId);

    //获取问题上报的taskId（用于查询附件）
    String getStartTaskId(String taskId);

    String getDZbSummary(String loginName, int pageNo, int pageSize) throws Exception;

    Page getBjSummaryPage(String loginName, int pageNo, int pageSize) throws Exception;

    String getYbSummary(String loginName, int min, int max) throws Exception;//已办
    String getBjSummary(String loginName,int min,int max) throws Exception;//办结

    List<Map> getTraceInfo(String taskId) throws Exception;

	/**
	 * 获取问题上报实例 并初始化数据词典显示值
	 * @param id
	 * @return
	 */
    GxProblemReport getGxProblemReportById(String id) throws Exception;//	public void save(GxProblemReport insertGxProblemReport);
	List<BscAttForm> getBscAttByTableNameAndPkNameAndRecordId(String tableName,String pkName,String recordId)throws Exception;

    List<BscAttForm> getBscAttByTableNameAndPkNameAndRecordId(String tableName, String pkName, String recordId, String orgId) throws Exception;

    /**
	 * 根据业务流程定义code获取菜单信息
	 * @return
	 */
    List<Map<String,Object>> getTabsData()throws Exception;

    List<OpuOmUser> getAssignees(String groupCode, String loginName);

    String getState(String id);
	/**
	 * 根据所属流程定义KEY获取APPID
	 * @param flowdefKey
	 * @return
	 * @throws Exception
	 */
    String getAppIdByProcDefKey(String flowdefKey)throws Exception;
	Page<GxProblemReportForm> searchForApp(Page<GxProblemReportForm> page, Map<String, String> map, String urlAll);/**
	 * 根据组织code和角色Code获取用户信息
	 * @param orgCode
	 * @param roleCode
	 * @return
	 */
    List<Map<String,Object>> getUserByroleCode(String orgCode, String roleCode)throws Exception;
	/**
	 * 根据组织code和角色Code获取用户信息（包含组织code下的子组织code）
	 * @param orgCode
	 * @param roleCode
	 * @return
	 */
	List<Map<String,Object>> getAllChildByroleCode(String orgCode, String roleCode)throws Exception;

	/**
	 * 根据类型和id获取用户信息
	 * @param type
	 * @param id
	 * @return
	 * @throws Exception
	 */
	List<OpuOmUser> getUserAndSubNodeById(String type, String id) throws Exception;

	/**
	 * 获取指定节点经办人
	 * @param procInstId
	 * @param taskCode
	 * @return
	 * @throws Exception
	 */
	String getAssigneeByTaskCode(String procInstId,String taskCode) throws Exception;

	List<OpuOmOrg> getOrgsByLoginName(String loginName) throws Exception;
	List<OpuOmOrg> getJlOrgsByLoginName(String loginName) throws Exception;

    Page getListsMyCommit(String loginName, int pageNo, int pageSize);

    void updateTask(Task task, Map<String, String> map, OpuOmUserInfo user) throws Exception;

    Map<String, Object> searchTemplate(String entityId);

    ResultForm returnPrevTask(Task taks, String backComments) throws Exception;
}