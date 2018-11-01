package com.augurit.awater.bpm.sggc.service.impl;

import java.sql.*;
import java.util.*;

import com.augurit.agcloud.bsc.domain.BscAttForm;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.opus.common.mapper.OpuOmOrgMapper;
import com.augurit.agcloud.opus.common.mapper.OpuOmUserInfoMapper;
import com.augurit.agcloud.opus.common.mapper.OpuOmUserMapper;
import com.augurit.agcloud.opus.common.mapper.OpuOmUserOrgMapper;
import com.augurit.awater.bpm.sggc.convert.GxSggcConvertor;
import com.augurit.awater.bpm.sggc.dao.GxSggcDao;
import com.augurit.awater.bpm.sggc.entity.GxSggc;
import com.augurit.awater.bpm.sggc.service.IGxSggcService;
import com.augurit.awater.bpm.sggc.web.form.GxSggcForm;
import com.augurit.awater.bpm.sggc.web.form.GxSggcLogForm;
import com.augurit.awater.bpm.xcyh.reassign.domain.ReassignProcess;
import com.augurit.awater.bpm.xcyh.reassign.service.IReassignProcessService;
import com.augurit.awater.bpm.xcyh.report.service.IGxProblemReportService;
import com.augurit.awater.bpm.xcyh.report.web.WfRestController;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.util.sql.HqlUtils;
import com.augurit.awater.util.file.PageUtils;
import com.augurit.awater.util.PropertyFilter;
import org.apache.commons.lang.StringUtils;
import org.flowable.engine.HistoryService;
import org.flowable.engine.TaskService;
import org.flowable.engine.history.HistoricActivityInstance;
import org.flowable.engine.task.Comment;
import org.flowable.task.api.history.HistoricTaskInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class GxSggcServiceImpl implements IGxSggcService {

	@Autowired
	private GxSggcDao gxSggcDao;
	@Autowired
	private IReassignProcessService reassignProcessService;
	@Autowired
	private IGxProblemReportService gxProblemReportService;
	@Autowired
	private HistoryService historyService;
	@Autowired
	private TaskService taskService;
	@Autowired
	private OpuOmUserMapper opuOmUserMapper;
	@Autowired
	private OpuOmUserOrgMapper opuOmUserOrgMapper;
	@Autowired
	private OpuOmOrgMapper opuOmOrgMapper;
	@Autowired
	private OpuOmUserInfoMapper opuOmUserInfoMapper;
	@Autowired
	private JdbcTemplate jdbcTemplate;;

	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public GxSggcForm get(Long id) {
		GxSggc entity = gxSggcDao.get(id);
		return GxSggcConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		gxSggcDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(GxSggcForm... forms) {
		if(forms != null)
			for(GxSggcForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(GxSggcForm form){
		
		if(form != null){
			GxSggc entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = gxSggcDao.get(form.getId());
			}else{
				entity = new GxSggc();
			}
			
			//属性值转换
			GxSggcConvertor.convertFormToVo(form, entity);
			
			//保存
			gxSggcDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
			
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<GxSggcForm> search(Page<GxSggcForm> page, GxSggcForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from GxSggc ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = gxSggcDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<GxSggcForm> list = GxSggcConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<GxSggcForm> search(Page<GxSggcForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<GxSggc> pg = gxSggcDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<GxSggcForm> list = GxSggcConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	public String saveData(GxSggcForm form) throws Exception{
		if(form != null){
			GxSggc entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = gxSggcDao.get(form.getId());
			}else{
				entity = new GxSggc();
			}
			
			//属性值转换
			GxSggcConvertor.convertFormToVo(form, entity);
			
			//保存
			gxSggcDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
			
		}
		return form.getId()==null?"":form.getId()+"";
	}
	/**
	 * 根据表单条件查询列表
	 * @param form
	 * @return
	 */
	public List<GxSggcForm> search(GxSggcForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from GxSggc ps where 1=1");
		List<Object> values = new ArrayList<Object>();
		// 查询条件
		if (form != null) {
			if (form.getSjid() != null ) {
				hql.append(" and ps.sjid=?");
				values.add(form.getSjid());
			}
		}
		hql.append(" order by ps.time desc ");
		List<GxSggc> gxSggcs = gxSggcDao.find(hql.toString(), values);
		return GxSggcConvertor.convertVoListToFormList(gxSggcs);
	}
	public List<GxSggcLogForm> getHistoryCommentsByProcessInstanceId(String processInstanceId,String pkName) throws Exception {
		List<GxSggcLogForm> list = new ArrayList();//流程办理意见
		if (processInstanceId != null && !"".equals(processInstanceId)) {
			List<Comment> commentList = taskService.getProcessInstanceComments(processInstanceId);//获取流程办理意见
			List<HistoricTaskInstance> historyTaskList = (this.historyService.createHistoricTaskInstanceQuery().processInstanceId(processInstanceId)).list();
			List<HistoricActivityInstance> historyActivityList = this.historyService.createHistoricActivityInstanceQuery().processInstanceId(processInstanceId).activityType("userTask").list();
			if (historyActivityList != null && historyActivityList.size() > 0) {
				for(HistoricTaskInstance taskInstance:historyTaskList) {
					GxSggcLogForm gxSggcLogForm = new GxSggcLogForm();
					gxSggcLogForm.setTime(taskInstance.getEndTime()==null?0L:taskInstance.getEndTime().getTime());
					for(HistoricActivityInstance activityInstance:historyActivityList){
						if(!activityInstance.getActivityId().equals(taskInstance.getTaskDefinitionKey())) {
							continue;
						}
						gxSggcLogForm.setLinkName(activityInstance.getActivityName());
					}
					if (StringUtils.isNotBlank(taskInstance.getAssignee())) {
						OpuOmUserInfo opuOmUserInfo = this.opuOmUserInfoMapper.getOpuOmUserInfoByLoginName(taskInstance.getAssignee());
						if (opuOmUserInfo != null) {
							gxSggcLogForm.setOpUser(getAllName(taskInstance.getAssignee()));
							gxSggcLogForm.setOpUserPhone(opuOmUserInfo.getUserMobile()==null?"":opuOmUserInfo.getUserMobile());
						}
					}
					if (taskInstance.getEndTime() != null) {
						gxSggcLogForm.setLx("task2");
						if (taskInstance.getReturnTime() != null) {
							gxSggcLogForm.setLx("task3");
							gxSggcLogForm.setTime(taskInstance.getReturnTime().getTime());
						}

						if (taskInstance.getSendOnTime() != null) {
							gxSggcLogForm.setLx("task4");
							gxSggcLogForm.setTime(taskInstance.getSendOnTime().getTime());
						}
					} else {
						gxSggcLogForm.setLx("task1");
					}
					if (commentList != null && commentList.size() > 0) {
						Iterator var15 = commentList.iterator();
						while(var15.hasNext()) {
							Comment comment = (Comment)var15.next();
							if (taskInstance.getId().equals(comment.getTaskId())) {
								gxSggcLogForm.setContent(comment.getFullMessage()==null?"":comment.getFullMessage());
							}
						}
					}
					List<BscAttForm> fileList=gxProblemReportService.getBscAttByTableNameAndPkNameAndRecordId(WfRestController.GX_PROBLEM_REPORT,pkName,taskInstance.getId());
					if(fileList!=null&&fileList.size()>0){
						gxSggcLogForm.setFiles(fileList);
					}
					list.add(gxSggcLogForm);
				}
			}
		}
		return list;
	}
	//备份
	public List<GxSggcLogForm> getHistoryCommentsByProcessInstanceIdBf(String processInstanceId,String pkName) throws Exception {
		List<GxSggcLogForm> list = new ArrayList();//流程办理意见
		List<GxSggcLogForm> tempFormList = new ArrayList<GxSggcLogForm>();//转派记录
		if (processInstanceId != null && !"".equals(processInstanceId)) {
			List<Comment> commentList = taskService.getProcessInstanceComments(processInstanceId);//获取流程办理意见
			List<HistoricTaskInstance> historyTaskList = (this.historyService.createHistoricTaskInstanceQuery().processInstanceId(processInstanceId)).list();
			List<HistoricActivityInstance> historyActivityList = this.historyService.createHistoricActivityInstanceQuery().processInstanceId(processInstanceId).activityType("userTask").list();
			if (historyActivityList != null && historyActivityList.size() > 0) {
				for(HistoricActivityInstance activityInstance:historyActivityList){
					for(HistoricTaskInstance taskInstance:historyTaskList) {
						if(!activityInstance.getTaskId().equals(taskInstance.getId())) {
							continue;
						}
						GxSggcLogForm gxSggcLogForm = new GxSggcLogForm();
						gxSggcLogForm.setLinkName(activityInstance.getActivityName());
						gxSggcLogForm.setTime(activityInstance.getEndTime()==null?0L:activityInstance.getEndTime().getTime());
						if (StringUtils.isNotBlank(taskInstance.getAssignee())) {
							OpuOmUserInfo opuOmUserInfo = this.opuOmUserInfoMapper.getOpuOmUserInfoByLoginName(taskInstance.getAssignee());
							if (opuOmUserInfo != null) {
								gxSggcLogForm.setOpUser(getAllName(taskInstance.getAssignee()));
								gxSggcLogForm.setOpUserPhone(opuOmUserInfo.getUserMobile()==null?"":opuOmUserInfo.getUserMobile());
							}
						}
						if (taskInstance.getEndTime() != null) {
							gxSggcLogForm.setLx("task2");
							if (taskInstance.getReturnTime() != null) {
								gxSggcLogForm.setLx("task3");
								gxSggcLogForm.setTime(taskInstance.getReturnTime().getTime());
							}

							if (taskInstance.getSendOnTime() != null) {
								gxSggcLogForm.setLx("task4");
								gxSggcLogForm.setTime(taskInstance.getSendOnTime().getTime());
							}
						} else {
							gxSggcLogForm.setLx("task1");
						}
						if (commentList != null && commentList.size() > 0) {
							Iterator var15 = commentList.iterator();
							while(var15.hasNext()) {
								Comment comment = (Comment)var15.next();
								if (activityInstance.getTaskId().equals(comment.getTaskId())) {
									gxSggcLogForm.setContent(comment.getFullMessage()==null?"":comment.getFullMessage());
								}
							}
						}
						List<BscAttForm> fileList=gxProblemReportService.getBscAttByTableNameAndPkNameAndRecordId(WfRestController.GX_PROBLEM_REPORT,pkName,taskInstance.getId());
						if(fileList!=null&&fileList.size()>0){
							gxSggcLogForm.setFiles(fileList);
						}
						list.add(gxSggcLogForm);
						/***begin转派过程****/
						List<ReassignProcess> reassignList =reassignProcessService.getReassignByTaskId(activityInstance.getTaskId());
						if(reassignList != null && reassignList.size()>0){
							for(ReassignProcess reassignProcessForm : reassignList){
								GxSggcLogForm gxSggcLogReassignForm = new GxSggcLogForm();
								gxSggcLogReassignForm.setLinkName(reassignProcessForm.getTaskName());
								//获取单位加姓名
								gxSggcLogReassignForm.setOpUser(reassignProcessForm.getAssignee()== null ? "" : getAllName(reassignProcessForm.getAssignee()));
								OpuOmUserInfo assigneeUserfrom = opuOmUserInfoMapper.getOpuOmUserInfoByLoginName(reassignProcessForm.getAssignee());
								gxSggcLogReassignForm.setOpUserPhone(assigneeUserfrom == null ? reassignProcessForm.getAssignee() : assigneeUserfrom.getUserMobile());
								//获取单位加姓名
								gxSggcLogReassignForm.setNextOpUser(reassignProcessForm.getReassign() == null ? "" : getAllName(reassignProcessForm.getReassign()));
								OpuOmUserInfo reassignUserfrom = opuOmUserInfoMapper.getOpuOmUserInfoByLoginName(reassignProcessForm.getReassign());
								gxSggcLogReassignForm.setNextOpUserPhone(reassignUserfrom == null ? reassignProcessForm.getReassign() : reassignUserfrom.getUserMobile());
								gxSggcLogReassignForm.setContent(reassignProcessForm.getReassignComments()==null?"":reassignProcessForm.getReassignComments());
								if(reassignProcessForm.getReasSignTime() != null){
									gxSggcLogReassignForm.setTime(reassignProcessForm.getReasSignTime().getTime());
								}else{
									gxSggcLogReassignForm.setTime(0l);
								}
								gxSggcLogReassignForm.setLx("zp");
								tempFormList.add(gxSggcLogReassignForm);
							}
						}
						/***end转派过程****/
					}
				}
			}
		}
		//把转派意见添加进list
		list.addAll(tempFormList);
		return list;
	}

	public String getAllName(String loginName){
		//		String sqlString= " select u.login_name,u.user_name,u.mobile,u.title, o.remark as org_name from om_user u "+
//				"left join om_user_org uo on u.user_id=uo.user_id left join om_org o on uo.org_id=o.org_id  where u.login_name=? order by o.org_level asc,o.sort_no asc";

		String sqlString= " select u.login_name,u.user_name,ui.user_mobile,ui.user_title, o.org_name from opu_om_user u "+
				"left join opu_om_user_org uo on u.user_id=uo.user_id left join opu_om_org o on uo.org_id=o.org_id  left join opu_om_user_info ui on ui.user_id=u.user_id " +
				"where u.login_name=? order by o.org_level asc,o.org_sort_no asc";
		List<Object> values = new ArrayList<Object>();
		values.add(loginName);
		List<Object[]> objects = gxSggcDao.getListBySql(sqlString,values);
		if(objects!=null&&objects.size()>0){
			Object[] obj = objects.get(0);
			return Object2String(obj[4])+Object2String(obj[3])+Object2String(obj[1]);
		}else{
			return "";
		}
	}
	@Override
	public List<GxSggcForm> searcEntityBySjid(String SJID) {
		StringBuffer hql  = new StringBuffer("from GxSggc ps where 1=1 ");
		List<GxSggc> list =  gxSggcDao.findBy("SJID",SJID);
		//Collections.sort(list,Comparator.comparing(GxSggc::getTime));
		return GxSggcConvertor.convertVoListToFormList(list);
	}
	@Override
	public List<Map> searchJbpm4HistTaskByEntityId(String sjid) {
		List<Map> listResult = new ArrayList();
		String sql = "select mesg.message,s.* from (SELECT decode(proc.END_TIME_,null,'active','end')state," +
				"task.* FROM " +
				" ACT_HI_TASKINST task,ACT_HI_PROCINST proc,ACT_STO_APPINST inst WHERE " +
				" 1=1  AND inst.MASTER_RECORD_ID =? AND task.PROC_INST_ID_ = proc.ID_ " +
				" AND proc.ID_ = inst.PROC_INST_ID ORDER BY task.START_TIME_ ASC" +
				" )s left join (select wm_concat(to_char(me.MESSAGE_)) message,me.TASK_ID_ from ACT_HI_COMMENT " +
				" me where ME.PROC_INST_ID_ is not null GROUP BY me.TASK_ID_) mesg on s.id_ = mesg.TASK_ID_";
		List<Map<String,Object>> list =  jdbcTemplate.queryForList(sql,new Object[]{sjid});
		if(list!=null && list.size()>0){
			for (int i=0;i<list.size();i++) {
				Map<String,Object> mso =list.get(i);
				Map map = new HashMap();
				Object sendOnTime =  mso.get("SEND_ON_TIME_");
				Object returnTime =  mso.get("RETURN_TIME_");
				String isActive = mso.get("STATE").toString();
				map.put("taskId",mso.get("ID_"));
				if(sendOnTime!=null){
					map.put("linkName",mso.get("NAME_").toString()+"(已转派)");
				}else if(returnTime!=null){
					if(i>0){
						if(mso.get("ASSIGNEE")!=null && list.get(i-1).get("ASSIGNEE")!=null &&
								mso.get("ASSIGNEE").toString().equals(list.get(i-1).get("ASSIGNEE").toString())){
							map.put("linkName",mso.get("NAME_").toString()+"(已撤回)");
						}else{
							map.put("linkName",mso.get("NAME_").toString()+"(已回退)");
						}
					}
				}else if("end".equals(isActive)){
					map.put("linkName",mso.get("NAME_").toString()+"(已结束)");
				}else{
					map.put("linkName",mso.get("NAME_").toString());
				}
				map.put("reassignComments", mso.get("MESSAGE"));
				if(mso.get("START_TIME_")!=null)
					map.put("time", ((java.sql.Timestamp)mso.get("START_TIME_")).getTime());
				/*if(mso.get("END_TIME_")==null){
				}else{
					map.put("time", ((java.sql.Timestamp)mso.get("END_TIME_")).getTime());
				}*/
				//获取下一环节人与电话
				if("active".equals(isActive)){
					int aa = list.size();
					Map<String,Object> nextMap=new HashMap<>();
					if(i<aa-1){
						nextMap=list.get(i+1);
					}
					map.put("nextOpUser",nextMap.get("ASSIGNEE_NAME_"));
					map.put("nextOpUserPhone",nextMap.get("ASSIGNEE_"));
				}
				map.put("opUser", mso.get("ASSIGNEE_NAME_"));
				map.put("opUserPhone", mso.get("ASSIGNEE_"));
				listResult.add(map);
			}
		}
		return listResult;
	}

	private String Object2String(Object obj){
		String result="";
		try {
			if (obj != null) {
				result = obj.toString();
			}
		} catch (RuntimeException e) {
			//loggerStatic.warn(e.getMessage());
			throw new RuntimeException(e);
		}
		return result;		
	}
}