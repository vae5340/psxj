package com.augurit.awater.dri.problem_report.correct_mark.service.impl;

import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.framework.security.user.OpuOmUser;
import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.opus.common.domain.OpuRsRole;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.org.rest.service.IOmRsRoleRestService;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.problem_report.check_record.convert.ReportDeleteConvertor;
import com.augurit.awater.dri.problem_report.check_record.service.ICheckRecordService;
import com.augurit.awater.dri.problem_report.check_record.service.IReportDeleteService;
import com.augurit.awater.dri.problem_report.check_record.web.form.CheckRecordForm;
import com.augurit.awater.dri.problem_report.check_record.web.form.ReportDeleteForm;
import com.augurit.awater.dri.problem_report.correct_mark.convert.CorrectMarkAttachmentConvertor;
import com.augurit.awater.dri.problem_report.correct_mark.convert.CorrectMarkConvertor;
import com.augurit.awater.dri.problem_report.correct_mark.dao.CorrectMarkDao;
import com.augurit.awater.dri.problem_report.correct_mark.entity.CorrectMark;
import com.augurit.awater.dri.problem_report.correct_mark.entity.CorrectMarkAttachment;
import com.augurit.awater.dri.problem_report.correct_mark.service.ICorrectMarkAttachmentService;
import com.augurit.awater.dri.problem_report.correct_mark.service.ICorrectMarkService;
import com.augurit.awater.dri.problem_report.correct_mark.web.form.CorrectMarkAttachmentForm;
import com.augurit.awater.dri.problem_report.correct_mark.web.form.CorrectMarkForm;
import com.augurit.awater.dri.problem_report.lack_mark.convert.LackMarkConvertor;
import com.augurit.awater.dri.problem_report.lack_mark.dao.LackMarkDao;
import com.augurit.awater.dri.problem_report.lack_mark.entity.LackMark;
import com.augurit.awater.dri.problem_report.lack_mark.service.ILackMarkAttachmentService;
import com.augurit.awater.dri.problem_report.lack_mark.service.ILackMarkService;
import com.augurit.awater.dri.problem_report.lack_mark.web.form.LackMarkAttachmentForm;
import com.augurit.awater.dri.problem_report.lack_mark.web.form.LackMarkForm;
import com.augurit.awater.dri.psh.pshLackMark.dao.PshLackMarkDao;
import com.augurit.awater.dri.psh.pshLackMark.entity.PshLackMark;
import com.augurit.awater.dri.rest.util.arcgis.form.DataFormToFeatureConvertor;
import com.augurit.awater.dri.rest.util.arcgis.form.FeatureForm;
import com.augurit.awater.dri.rest.util.arcgis.timer.SynchronousData;
import com.augurit.awater.dri.rest.util.arcgis.timer.SynchronousDeleteData;
import com.augurit.awater.util.PropertyFilter;
import com.augurit.awater.util.page.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import com.augurit.awater.util.sql.SqlPageUtils;
import net.sf.json.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@Transactional
public class CorrectMarkServiceImpl implements ICorrectMarkService {
	@Autowired
	private JdbcTemplate jdbcTemplate;
	@Autowired
	private CorrectMarkDao correctMarkDao;
	@Autowired
	private LackMarkDao lackMarkDao;
	@Autowired
	private PshLackMarkDao pshLackMarkDao;
	@Autowired
	private IOmRsRoleRestService omRsRoleRestService;
	/*@Autowired
	private IOmUserService omUserService;
	@Autowired
	private IOmOrgService omOrgService;*/
	@Autowired
	private IOmUserInfoRestService omUserInfoService;
	@Autowired
	private IOmOrgRestService omOrgRestService;
	@Autowired
	private ICorrectMarkAttachmentService correctMarkAttachmentService;
	@Autowired
	private ILackMarkService lackMarkService;
	@Autowired
	private ILackMarkAttachmentService lackMarkAttachmentService;
	/*@Autowired
	private IGxProblemReportService gxProblemReportService;*/
	@Autowired
	private ICheckRecordService checkRecordService;
	@Autowired
	private IReportDeleteService reportDeleteService;

	@Value("${spring.application.name}")
	private String serverName;

	/**TODO*******************移动端******************TODO**/
	/**
	 * 移动端删除上报接口
	 * @param reportType
	 * @param reportId
	 * @return json
	 * */
	@Override
	public String deleteReport(String reportType, String reportId,String loginName,String phoneBrand) {
		JSONObject json = new JSONObject();
		if(StringUtils.isNotBlank(reportType) && StringUtils.isNotBlank(reportId) && StringUtils.isNotBlank(loginName)){
			try {
				Map userInfo = omUserInfoService.getOpuOmUserInfoByUserId(loginName);
				//OmUserForm userForm =  omUserService.getUser(loginName);
				if("add".equals(reportType)){
					LackMarkForm lackForm = lackMarkService.get(Long.parseLong(reportId));
					if(lackForm == null || lackForm.getId()==null){
						json.put("code", 500);
						json.put("message", "数据已删除,地图数据可能存在延迟!");
						return json.toString();
					}
					if(!StringUtils.isNotBlank(lackForm.getObjectId())){ // 是否有objectid，有的话就执行删除队列
						if("0".equals(lackForm.getIsAddFeature())){ 
							json.put("code", 500);
							json.put("message", "正在同步地图数据,请稍后删除....");
							return json.toString();
						}

					}else{
						ReportDeleteForm deleteForm =  ReportDeleteConvertor.convertLackVoToForm(lackForm);
						deleteForm.setIsDelete("0"); //表示正在同步中
						deleteForm.setDeleteTime(new Date());
						deleteForm.setDeletePerson(userInfo.get("userName").toString());
						deleteForm.setDeletePersonId(userInfo.get("loginName").toString());
						deleteForm.setPersonUserId(userInfo.get("userId").toString());
						deleteForm.setPhoneBrand(phoneBrand);
						if(SynchronousDeleteData.reportDeleteService==null){
							new SynchronousDeleteData(reportDeleteService);
						}
						Boolean flag = SynchronousDeleteData.addDelete(deleteForm);
						if(!flag){
							deleteForm.setIsDelete("2");//添加队列失败 需要定时器删除
							reportDeleteService.save(deleteForm);
						}else{
							reportDeleteService.save(deleteForm);
						}
					}
					lackMarkService.delete(lackForm.getId());
					json.put("code", 200);
					json.put("message", "成功!");
				}else if("confirm".equals(reportType) || "modify".equals(reportType)){
					CorrectMarkForm corrForm = this.get(Long.parseLong(reportId));
					if(corrForm == null || corrForm.getId()==null){
						json.put("code", 500);
						json.put("message", "数据已删除!地图数据未删除可能存在延迟.");
						return json.toString();
					}
					if(!StringUtils.isNotBlank(corrForm.getObjectId())){ // 是否有objectid，有的话就执行删除队列
						if("0".equals(corrForm.getIsAddFeature())){ 
							json.put("code", 500);
							json.put("message", "正在同步地图数据,请稍后删除....");
							return json.toString();
						}
					}else{
						ReportDeleteForm deleteForm =  ReportDeleteConvertor.convertCorrVoToForm(corrForm);
						deleteForm.setIsDelete("0"); //表示正在同步中
						deleteForm.setDeleteTime(new Date());
						deleteForm.setDeletePerson(userInfo.get("userName").toString());
						deleteForm.setDeletePersonId(userInfo.get("loginName").toString());
						deleteForm.setPersonUserId(userInfo.get("userId").toString());
						deleteForm.setPhoneBrand(phoneBrand);
						if(SynchronousDeleteData.reportDeleteService==null){
							new SynchronousDeleteData(reportDeleteService);
						}
						Boolean flag = SynchronousDeleteData.addDelete(deleteForm);
						if(!flag){
							deleteForm.setIsDelete("2");//添加队列失败 需要定时器删除
							reportDeleteService.save(deleteForm);
						}else{
							reportDeleteService.save(deleteForm);
						}
					}
					this.delete(corrForm.getId());
					json.put("code", 200);
					json.put("message", "成功!");
				}else{
					json.put("code", 500);
					json.put("message", "参数错误！");
				}
			} catch (RuntimeException e) {
				e.printStackTrace();
				json.put("code", 500);
				json.put("message", "参数错误！");
				throw new RuntimeException(e);
			}
		}else{
			json.put("code", 500);
			json.put("message", "参数错误！");
		}
		return json.toString();
	}
	/**
	 * 查询当前用户所在业主单位和所有的业主单位
	 * */
	@Override
	public String getParentOrgName(String loginName) {
		JSONObject json = new JSONObject();
		List<OpuOmOrg> list = new ArrayList<>();
		if(StringUtils.isNotBlank(loginName)){
			//全部市级单位
			OpuOmOrg omOrg = new OpuOmOrg();
			omOrg.setOrgRank("14");
			List<OpuOmOrg> listmap  = omOrgRestService.listOpuOmOrg(omOrg);
			Map<String,String> map =  this.getFrom(loginName);
			for(OpuOmOrg mm:listmap){
				Map m = new HashMap<>();
				if(map.get("parentOrgId")!=null
						&&mm.getOrgId().toString().equals(map.get("parentOrgId").toString())){
					Map dataMap = new HashMap<>();
					dataMap.put("parentOrgId", map.get("parentOrgId"));
					dataMap.put("parentOrgName", map.get("parentOrgName"));
					json.put("data", dataMap);
				}else{
					m.put("parentOrgName", mm.getOrgId().toString());
					m.put("parentOrgId", mm.getOrgId().toString());
					list.add(mm);
				}
			}
			json.put("rows", list);
			json.put("code", 200);
		}else{
			json.put("code", 300);
			json.put("message", "参数有误!");
		}
		return json.toString();
	}
	/**
	 * 统计最新十条数据（事件上报、纠错、数据上报）
	 * */
	public List<Map<String, Object>> getLatestTenList(){
		List<Map<String,Object>> list = new ArrayList<>();
		List<Map<String,Object>> listMap = new ArrayList<>();
		//得到纠错的最新十条
		List<Map<String,Object>> listCorrect = getLatestTen();
		//得到上报的最新十条
		List<Map<String,Object>> listLack = lackMarkService.getLatestTen();
		if(listCorrect!=null && listCorrect.size()>0){
			for(Map mp :listCorrect){
				if(mp.containsKey("MARK_TIME")){
					Date time = (Date)mp.get("MARK_TIME");
					mp.put("time", time!=null? time.getTime(): null);
					mp.remove("MARK_TIME");
				}
				if(mp.size()>0){
					mp.put("source","correct");
					list.add(mp);
				}
			}
		}
		if(listLack!=null && listLack.size()>0){
			for(Map mp :listLack){
				if(mp.containsKey("MARK_TIME")){
					Date time = (Date)mp.get("MARK_TIME");
					mp.put("time", time!=null? time.getTime(): null);
					mp.remove("MARK_TIME");
				}
				if(mp.size()>0){
					mp.put("source","lack");
					list.add(mp);
				}
			}
		}
		//得到事件上报的最新十条
		/**###THE#####
		List<Map<String,Object>> listProblem = gxProblemReportService.getLatestTen();
		if(listProblem!=null && listProblem.size()>0){
			for(Map mp :listProblem){
				if(mp.containsKey("SBSJ")){ //时间
					Date time = (Date)mp.get("SBSJ");
					mp.put("time", time!=null? time.getTime(): null);
					mp.put("MARK_PERSON", mp.get("SBR"));
					mp.put("PROBLEM_TYPE", mp.get("BHLX"));
					mp.put("LAYER_NAME", mp.get("SSLX"));
					mp.remove("SBSJ");
					mp.remove("SBR");
					mp.remove("BHLX");
					mp.remove("SSLX");
				}
				if(mp.size()>0){
					mp.put("source","problem");
					list.add(mp);
				}
			}
		}*/
		if(list.size()>0){
			Collections.sort(list, new Comparator(){
				@Override
				public int compare(Object o1, Object o2) {
					Map<String, Object> m1 = (Map<String, Object>) o1;
					Map<String, Object> m2 = (Map<String, Object>) o2;
					if(m1.get("time") == null) return 1;
					if(m2.get("time") == null) return 1;
					return ( (Long)(m1.get("time")) > (Long)m2.get("time") ? -1 :
							(m1.get("time") == m2.get("time") ? 0 : 1));
				}
			});
		}
		for(int i=0;i<(list.size()<10? list.size():10);i++){
			listMap.add(list.get(i));
		}
		return listMap;
	}
	/**
	 * 昨天和今天区域统计
	 * */
	@Override
	public String toPastNowDay(String layerName) {
		JSONObject json = new JSONObject();
		Map mapss = new HashMap<>();
		if(!"null".equals(layerName) && StringUtils.isNotBlank(layerName)){
			mapss.put("layerName", layerName);
		}
		List<Map> toDay = new ArrayList<>();
		List<Map> yestDay = new ArrayList<>();
		List<Object> list = new ArrayList<>();
		List<Object> yestDayList = getCountDay(true,mapss);//昨天
		List<Object> toDayList = getCountDay(false,mapss);//今天
		for(Object o:toDayList){
			Map map = new HashMap<>();
			if(o!=null&&((Object[])o).length>0){
				if(!((Object[])o)[0].toString().equals("广州市水务局")){
					map.put("name", ((Object[])o)[0]);
					map.put("corrCount", ((Object[])o)[1]!=null?((Object[])o)[1]:0);
					map.put("lackCount", ((Object[])o)[2]!=null?((Object[])o)[2]:0);
					toDay.add(map);
				}
			}
		}
		for(Object o:yestDayList){
			Map map = new HashMap<>();
			if(o!=null&&((Object[])o).length>0){
				if(!((Object[])o)[0].toString().equals("广州市水务局")){
					map.put("name", ((Object[])o)[0]);
					map.put("corrCount", ((Object[])o)[1]!=null?((Object[])o)[1]:0);
					map.put("lackCount", ((Object[])o)[2]!=null?((Object[])o)[2]:0);
					yestDay.add(map);
				}
			}
		}
		json.put("toDay", toDay);
		json.put("yestDay", yestDay);
		json.put("success", true);
		return json.toString();
	}
	/**
	 * 统计纠错和上报数量（对移动端接口）
	 **/
	public Map<String, Object> toPartsCount(CorrectMarkForm form,Map<String,Object> map){
		Map<String, Object> json = new HashMap<>();
		LackMarkForm lackForm = new LackMarkForm();
		if(StringUtils.isNotBlank(form.getParentOrgName())){
			lackForm.setParentOrgName(form.getParentOrgName());
			map.put("parentOrgName", form.getParentOrgName());
		}
		List<Map<String,Object>> eachtsList = toPartsAndChart(map);//图表记录
		//统计记录
		Map<String,Object> correctList = correctCount(form,map);
		Map<String,Object> lackList = lackMarkService.lackCount(lackForm,map);
		Long correctCount = correctList!=null?Long.parseLong(correctList.get("total").toString()):new Long(0);
		Long lackCount = lackList!=null?Long.parseLong(lackList.get("total").toString()):new Long(0);
		json.put("total", correctCount+lackCount);
		json.put("corrCount", correctCount);
		json.put("lackCount", lackCount);
		json.put("charts", eachtsList);
		//审核通过总数
		map.put("checkState", "2");//添加审核状态查询（通过）
		Map<String,Object> passCorrectList = correctCount(form,map);
		Map<String,Object> passLackList = lackMarkService.lackCount(lackForm,map);
		Long passCorrectCount = passCorrectList!=null?Long.parseLong(passCorrectList.get("total").toString()):new Long(0);
		Long passLackCount = passLackList!=null?Long.parseLong(passLackList.get("total").toString()):new Long(0);
		json.put("passTotal", passCorrectCount+passLackCount);
		json.put("passCorrCount", passCorrectCount);
		json.put("passLackCount", passLackCount);
		//存在疑问总数
		map.put("checkState", "3");//添加审核状态查询（存在疑问）
		Map<String,Object> doubtCorrectList = correctCount(form,map);
		Map<String,Object> doubtLackList = lackMarkService.lackCount(lackForm,map);
		Long doubtCorrectCount = doubtCorrectList!=null?Long.parseLong(doubtCorrectList.get("total").toString()):new Long(0);
		Long doubtLackCount = doubtLackList!=null?Long.parseLong(doubtLackList.get("total").toString()):new Long(0);
		json.put("doubtTotal", doubtCorrectCount+doubtLackCount);
		json.put("doubtCorrCount", doubtCorrectCount);
		json.put("doubtLackCount", doubtLackCount);
		
		return json;
	}
	/**
	 * 上报统计和图表
	 * */
	private List<Map<String,Object>> toPartsAndChart(Map<String,Object> map){
		SimpleDateFormat sim=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		List<Map<String,Object>> listTotal= new ArrayList<>();
		StringBuffer sql = new StringBuffer("select PARENT_ORG_NAME,sum(total) as total from ("+
				"select S1.PARENT_ORG_NAME , count(*) as total from DRI_PS_CORRECT_MARK s1 where 1=1");
				
		if(map.size()>0 && map.containsKey("startTime") && map.containsKey("endTime")){
			String startTime = sim.format(map.get("startTime"));
			String endTime = sim.format(map.get("endTime"));
			sql.append(" and s1.mark_time between to_date('"+startTime+"','YYYY-MM-DD HH24:MI:SS')"
					+ "and to_date('"+endTime+"','YYYY-MM-DD HH24:MI:SS')");
		}
		if(map.containsKey("parentOrgName")){
			sql.append(" and s1.parent_org_name like '%"+map.get("parentOrgName").toString()+"%'");
		}
		if(map.containsKey("reportType")){
			sql.append(" and s1.layer_name ='"+map.get("reportType").toString()+"'");
		}
		sql.append("GROUP BY s1.PARENT_ORG_NAME UNION all select S2.PARENT_ORG_NAME , count(*) as total from DRI_PS_LACK_MARK s2 where 1=1");
		if(map.size()>0 && map.containsKey("startTime") && map.containsKey("endTime")){
			String startTime = sim.format(map.get("startTime"));
			String endTime = sim.format(map.get("endTime"));
			sql.append(" and s2.mark_time between to_date('"+startTime+"','YYYY-MM-DD HH24:MI:SS')"
					+ "and to_date('"+endTime+"','YYYY-MM-DD HH24:MI:SS')");
		}
		if(map.containsKey("parentOrgName")){
			sql.append(" and s2.parent_org_name like '%"+map.get("parentOrgName").toString()+"%'");
		}
		if(map.containsKey("reportType")){
			sql.append(" and s2.layer_name ='"+map.get("reportType").toString()+"'");
		}
		sql.append(" GROUP BY s2.PARENT_ORG_NAME) GROUP BY PARENT_ORG_NAME");
		List<Object> list = correctMarkDao.getSession().createSQLQuery(sql.toString()).list();
		for(Object obj : list){
			Map<String,Object> maps = new HashMap<>();
			Object[] ob =  (Object[]) obj;
			if(!"广州市水务局".equals(ob[0].toString())){
				maps.put("name", ob[0]);
				maps.put("total", ob[1]);
				listTotal.add(maps);
			}
		}
		return listTotal;
	}
	/**TODO******************pc*********************TODO**/
	/**
	 * 按业主单位统计数量(移动端使用)
	 * */
	public Map<String,Object> correctCount(CorrectMarkForm form,Map<String,Object> map){
		Map<String,Object> mapJson = new HashMap<>();
		StringBuffer hql = new StringBuffer("select count(*) as total from CorrectMark ps where 1=1 and parentOrgName not like '%广州市水务局%'");
		Map<String,Object> maps = new HashMap<>();
		if(StringUtils.isNotBlank(form.getParentOrgName())){
			hql.append(" and ps.parentOrgName like :parentOrgName");
			maps.put("parentOrgName", "%"+form.getParentOrgName()+"%");
		}
		if(map.size()>0 && map.containsKey("startTime") && map.containsKey("endTime")){
			hql.append(" and ps.markTime between :startTime and :endTime");
			maps.put("startTime", map.get("startTime"));
			maps.put("endTime", map.get("endTime"));
		}
		if(map.containsKey("reportType")){
			hql.append(" and ps.layerName like :layerName");
			maps.put("layerName", "%"+map.get("reportType").toString()+"%");
		}
		if(map.containsKey("checkState")){
			hql.append(" and ps.checkState = :checkState");
			maps.put("checkState", map.get("checkState"));
		}
		List<Object> list = correctMarkDao.find(hql.toString(), maps);
		mapJson.put("total", list!=null&&list.size()>0? list.get(0):0);
		return mapJson;
	}
	/**
	 * 图表统计
	 * */
	@Override
	public String searchEachts(CorrectMarkForm form, Map<String, Object> map) {
		JSONObject json = new JSONObject();
		//分组查询，判断是否点击传参
		if(!StringUtils.isNotBlank(form.getParentOrgName()) && 
				!StringUtils.isNotBlank(form.getDirectOrgName())){
			form.setParentOrgName("1");
			Map<String, String> m = this.getFrom(SecurityContext.getCurrentUser().getLoginName());
			if(m.containsKey("parentOrgName")){
				if(!m.containsKey("top")){//非市级用户
					map.put("parentOrgName",m.get("parentOrgName"));
				}
			}
		}else if(StringUtils.isNotBlank(form.getParentOrgName())){
			form.setDirectOrgName("1");
		}else if(StringUtils.isNotBlank(form.getDirectOrgName())){
			form.setTeamOrgName("1");
		}
		List<Map<String,Object>> list = this.searchGroup(form, map);
		if(list!=null&&list.size()>0){
			json.put("rows", list);
		}
		json.put("code", 200);
		return json.toString();
	}
	/**
	 * pc端的页面查询
	 * */
	@Override
	public String getCorrectMarkList(OpuOmUser userForm,Page<CorrectMarkForm> page,
			CorrectMarkForm form, Map<String, Object> map) {
		JSONObject json = new JSONObject();
		List<CorrectMarkForm> list = new ArrayList<>();
		if(userForm!=null && StringUtils.isNotBlank(userForm.getLoginName())){
			Map<String, String> m = this.getFrom(userForm.getLoginName());
			Long total=null;
			if(m.containsKey("parentOrgName")){
				if(!m.containsKey("top")){//非市级用户
					form.setParentOrgId(m.get("parentOrgId"));
				}
			}
			Page pg = this.searchFromAndMapPc(page, form, map);
			if(pg.getResult()!=null){
				list = pg.getResult();
				total=pg.getTotalItems();
			}
			json.put("rows", list);
			json.put("total", total);
			json.put("code", 200);
		}else{
			json.put("code", 300);
			json.put("message", "参数错误!");
		}
		return json.toString();
	}
	/**
	 * 查看详细(查询附件)
	 * @param id
	 * @return json.toString()
	 * */
	@Override
	public String seeCorrectMark(Long id) {
		JSONObject josn = new JSONObject();
		try {
			CorrectMarkForm form = this.get(id);
			List<CorrectMarkAttachmentForm> list =  correctMarkAttachmentService.getMarkId(form.getId().toString());
			josn.put("code", 200);
			josn.put("form", form);
			josn.put("rows", list);
		} catch (RuntimeException e) {
			josn.put("code", 500);
			e.printStackTrace();
			throw new RuntimeException(e);
		}
		return josn.toString();
	}
	/**
	 * 分组查询统计
	 * */
	public List<Map<String, Object>> searchGroup (CorrectMarkForm form, Map<String,Object> map){
		List<Map<String, Object>> list = new ArrayList<>();
		StringBuffer hql = new StringBuffer("");
		Map values = new HashMap<>();
		if(StringUtils.isNotBlank(form.getParentOrgName()) &&
				!StringUtils.isNotBlank(form.getDirectOrgName())){
			hql.append("select ps.parentOrgName as name,count(*) as total from CorrectMark ps where 1=1");
			if(StringUtils.isNotBlank(form.getLayerName())){
				hql.append(" and ps.layerName like :layerName");
				values.put("layerName", "%"+form.getLayerName()+"%");
			}
			if(map.size()>0 && map.containsKey("startTime") && map.containsKey("endTime")){
				hql.append(" and ps.markTime between :startTime and :endTime");
				values.put("startTime", map.get("startTime"));
				values.put("endTime", map.get("endTime"));
			}
			if(map.containsKey("parentOrgName") && map.get("parentOrgName")!=null){
				hql.append(" and ps.parentOrgName like :parentOrgName");
				values.put("parentOrgName", "%"+map.get("parentOrgName").toString()+"%");
			}
			hql.append(" group by ps.parentOrgName");
		}else if(StringUtils.isNotBlank(form.getDirectOrgName()) && 
					StringUtils.isNotBlank(form.getParentOrgName())){
			hql.append("select ps.directOrgName as name,count(*) as total from Diary ps where 1=1");
			if(StringUtils.isNotBlank(form.getLayerName())){
				hql.append(" and ps.layerName like :layerName");
				values.put("layerName", "%"+form.getLayerName()+"%");
			}
			if(map.size()>0 && map.containsKey("startTime") && map.containsKey("endTime")){
				hql.append(" and ps.markTime between :startTime and :endTime");
				values.put("startTime", map.get("startTime"));
				values.put("endTime", map.get("endTime"));
			}
			hql.append(" and ps.parentOrgName like :parentOrgName");
			values.put("parentOrgName", "%"+form.getParentOrgName()+"%");
			hql.append(" group by ps.directOrgName");
		}else if(StringUtils.isNotBlank(form.getTeamOrgName()) &&
				StringUtils.isNotBlank(form.getDirectOrgName())){
			hql.append("select ps.teamOrgName as name,count(*) as total from Diary ps where 1=1");
			if(StringUtils.isNotBlank(form.getLayerName())){
				hql.append(" and ps.layerName like :layerName");
				values.put("layerName", "%"+form.getLayerName()+"%");
			}
			if(map.size()>0 && map.containsKey("startTime") && map.containsKey("endTime")){
				hql.append(" and ps.markTime between :startTime and :endTime");
				values.put("startTime", map.get("startTime"));
				values.put("endTime", map.get("endTime"));
			}
			hql.append(" and ps.directOrgName like :directOrgName");
			values.put("directOrgName", "%"+form.getDirectOrgName()+"%");
			hql.append(" group by ps.teamOrgName");
		}
		if(StringUtils.isNotBlank(hql.toString())){
			list = correctMarkDao.find(hql.toString(), values);
		}
		return list;
	}
	/****************************************移动端的接口******************************************/
	/**
	 * 移动端查询缺失上报列表(修改后的一个接口)
	 * @param layerName
	 * @param parentOrgName
	 * @return Map
	 * */
	public Map<String,Object> searchCorrectAndLackMark(Page page,String loginName,String layerName,
			String parentOrgName,Map<String,Object> map,String path) {
		Map<String,Object> maps = new HashMap<>();
		Page<CorrectMarkForm> pa = new Page();
		List<Map> list = new ArrayList<>();
		CorrectMarkForm form = new CorrectMarkForm();
		if(StringUtils.isNotBlank(layerName)){
			form.setLayerName(layerName);
		}
		if(StringUtils.isNotBlank(loginName)){
			Map<String, String> mapForm = this.getFrom(loginName);
			if(!mapForm.containsKey("parentOrgId")){
				return maps;
			}
			if(mapForm.containsKey("parentOrgId") && !mapForm.containsKey("top")){
				//top区级业主单位（否则就是市级业主单位）
				form.setParentOrgId(mapForm.get("parentOrgId"));
			}
			if(mapForm.containsKey("top")){
				if(StringUtils.isNotBlank(parentOrgName)){
					if(parentOrgName.contains("净水公司")){
						form.setParentOrgName("净水有限公司");
					}else{
						form.setParentOrgName(parentOrgName);
					}
				}
			}
		}
		List<Map<String,Object>> listMap = (List<Map<String, Object>>) this.getPublicCountAll(page,form,map,List.class);
		List<Map<String, Object>> listTotals = (List<Map<String, Object>>) this.getPublicCountAll(page,form,map,Long.class);
		Long lackTotal=0l;
		Long correctTotal=0l;
		for(Map<String,Object> m :listTotals){
			if("lack".equals(m.get("source").toString())){
				lackTotal= Long.parseLong(m.get("total").toString());
			}else if("correct".equals(m.get("source").toString())){
				correctTotal= Long.parseLong(m.get("total").toString());
			}
		}
		if(listMap!=null&&listMap.size()>0){
			for(Map fm : listMap){
				Map mp = new HashMap<>();
				if(fm!=null){
					mp.put("id", fm.get("ID"));
					mp.put("markPersonId", fm.get("MARK_PERSON_ID"));
					mp.put("markPerson", fm.get("MARK_PERSON"));
					mp.put("time", fm.get("MARK_TIME")!=null? ((Date)fm.get("MARK_TIME")).getTime():null);
					mp.put("updateTime", fm.get("UPDATE_TIME")!=null? ((Date)fm.get("UPDATE_TIME")).getTime() : null);
					mp.put("layerName", fm.get("LAYER_NAME"));
					mp.put("correctType", fm.get("CORRECT_TYPE"));
					mp.put("parentOrgName", fm.get("PARENT_ORG_NAME"));
					mp.put("superviseOrgName", fm.get("SUPERVISE_ORG_NAME"));
					mp.put("directOrgName", fm.get("DIRECT_ORG_NAME"));
					mp.put("addr", fm.get("ADDR"));
					mp.put("source", fm.get("SOURCE"));
					if("correct".equals(mp.get("source").toString())){
						List<CorrectMarkAttachmentForm> attach= correctMarkAttachmentService.getMarkId(fm.get("ID").toString());
						if(attach!=null && attach.size()>0){
							mp.put("attPath",attach.get(0).getAttPath()!=null? path+"/"+serverName+"/dri/rest"+attach.get(0).getAttPath():"");
							mp.put("thumPath",attach.get(0).getThumPath()!=null? path+"/"+serverName+"/dri/rest"+attach.get(0).getThumPath():"");
						}
					}
					if("lack".equals(mp.get("source").toString())){
						List<LackMarkAttachmentForm> attach= lackMarkAttachmentService.getMarkId(fm.get("ID").toString());
						if(attach!=null && attach.size()>0){
							mp.put("attPath",attach.get(0).getAttPath()!=null? path+"/"+serverName+"/dri/rest"+attach.get(0).getAttPath():"");
							mp.put("thumPath",attach.get(0).getThumPath()!=null? path+"/"+serverName+"/dri/rest"+attach.get(0).getThumPath():"");
						}
					}
					list.add(mp);
				}
			}
		}
		maps.put("data", list);
		maps.put("total", correctTotal+lackTotal);
		maps.put("corrTotal", correctTotal);
		maps.put("lackTotal", lackTotal);
		return maps;
	}
	/**
	 * 移动端查询缺失上报列表
	 * @param layerName
	 * @param parentOrgName
	 * @return json
	 * */
	@Override
	public Map<String, Object> searchCorrectMark(Page page,String loginName,String layerName,
			String parentOrgName,Map<String,Object> map,String path) {
		Page<CorrectMarkForm> pa = new Page();
		Map<String, Object> mapList = new HashMap<>();
		List<Map> list = new ArrayList<>();
		CorrectMarkForm form = new CorrectMarkForm();
		if(StringUtils.isNotBlank(layerName)){
			form.setLayerName(layerName);
		}
		if(StringUtils.isNotBlank(loginName)){
			Map<String, String> mapForm = this.getFrom(loginName);
			if(!mapForm.containsKey("parentOrgId")){
				return mapList;
			}
			if(mapForm.containsKey("parentOrgId") && !mapForm.containsKey("top")){
				//top区级业主单位（否则就是市级业主单位）
				form.setParentOrgId(mapForm.get("parentOrgId"));
			}
			if(mapForm.containsKey("top")){
				if(StringUtils.isNotBlank(parentOrgName)){
					if(parentOrgName.contains("净水公司")){
						form.setParentOrgName("净水有限公司");
					}else{
						form.setParentOrgName(parentOrgName);
					}
				}
			}
		}
		map.put("notParentOrgName", "市水务局");//过滤除了市水务局条件
		pa = this.searchFromAndMap(page, form, map);
		if(pa.getResult()!=null){
			for(CorrectMarkForm fm : pa.getResult()){
				Map mp = new HashMap<>();
				List<CorrectMarkAttachmentForm> attach= correctMarkAttachmentService.getMarkId(fm.getId().toString());
				mp.put("id", fm.getId());
				mp.put("markPersonId", fm.getMarkPersonId());
				mp.put("markPerson", fm.getMarkPerson());
				mp.put("time", fm.getMarkTime()!=null? fm.getMarkTime().getTime():null);
				mp.put("updateTime", fm.getUpdateTime()!=null? fm.getUpdateTime().getTime() : null);
				mp.put("layerName", fm.getLayerName());
				mp.put("correctType", fm.getCorrectType());
				mp.put("parentOrgName", fm.getParentOrgName());
				mp.put("superviseOrgName", fm.getSuperviseOrgName());
				mp.put("directOrgName", fm.getDirectOrgName());
				mp.put("addr", fm.getAddr());
				mp.put("source", "correct");
				if(attach!=null && attach.size()>0){
					mp.put("attPath",attach.get(0).getAttPath()!=null? path+attach.get(0).getAttPath():"");
					mp.put("thumPath",attach.get(0).getThumPath()!=null? path+attach.get(0).getThumPath():"");
				}
				list.add(mp);
			}
			mapList.put("data", list);
			mapList.put("total", pa.getTotalItems());
		}
		return mapList;
	}
	/**
	 * 当前用户所属单位分页查询
	 * */
	@Override
	public String getCorrectMarks(String loginName,Page<CorrectMarkForm> page, CorrectMarkForm corrFrom,
			Map<String, Object> map) {
		JSONObject josn = new JSONObject();
		//查询返回集合
		Page<CorrectMarkForm> pg = new Page<>();
		try {
			Map userInfo = omUserInfoService.getOpuOmUserInfoByUserId(loginName);
			Map  omOrgForm = omOrgRestService.getOrgByOrgOmId(userInfo.get("orgId").toString());
			if(omOrgForm!=null&&omOrgForm.get("orgRank")!=null){
				if(omOrgForm.get("orgRank").equals("11")){ //队伍（队伍中的用户只能看见自己上报的事件）
					corrFrom.setMarkPersonId(loginName);
					corrFrom.setDirectOrgId(null);
					corrFrom.setSuperviseOrgId(null);
					corrFrom.setParentOrgId(null);
					pg = this.searchFromAndMap(page,corrFrom,map);
				}else{
					if(omOrgForm.get("orgRank").equals("12")){// 直属单位
						corrFrom.setDirectOrgId(omOrgForm.get("orgId").toString());
						corrFrom.setSuperviseOrgId(null);
						corrFrom.setParentOrgId(null);
						pg = this.searchFromAndMap(page,corrFrom,map);
					}else if(omOrgForm.get("orgRank").equals("13")){ // 监理单位
						corrFrom.setSuperviseOrgId(omOrgForm.get("orgId").toString());
						corrFrom.setParentOrgId(null);
						pg = this.searchFromAndMap(page,corrFrom,map);
					}else if(omOrgForm.get("orgRank").equals("14")){ // 业主单位
						corrFrom.setParentOrgId(omOrgForm.get("orgId").toString());
						pg = this.searchFromAndMap(page,corrFrom,map);
					}else if(omOrgForm.get("orgRank").equals("15")){//管理部门(管理部门的上一级是业主单位)
						//OmOrgForm omorgForm = omOrgService.getOrg(omOrgForm.getParentOrgId());
						String orgGrade  = omOrgForm.get("orgRank").toString();
						String parentId = omOrgForm.get("parentOrgId").toString();
						while("15".equals(orgGrade)){
							Map om = omOrgRestService.getOrgByOrgOmId(parentId);
							orgGrade = om.get("orgRank").toString();
							parentId = om.get("parentOrgId").toString();
							if(orgGrade.equals("1")){
								pg = this.searchFromAndMap(page,corrFrom,map);
							}else if(orgGrade.equals("14")){
								corrFrom.setParentOrgId(om.get("orgId").toString());
								pg = this.searchFromAndMap(page,corrFrom,map);
							}
						}
					}
				}
			}
			josn.put("code",200);
			if(pg.getResult()!=null){
				josn.put("rows", pg.getResult());
				josn.put("total", pg.getTotalItems());
			}
		} catch (RuntimeException e) {
			josn.put("code", 500);
			e.printStackTrace();
			throw new RuntimeException(e);
		}
		return josn.toString();
	}
	/**
	 * 本接口通用方法，根据loginName获取队伍和直属机构、业务单位、监理单位
	 * @param loginName
	 * @return map 
	 * */
	public Map<String,String> getFrom(String loginName){
		Map<String,String> map = new HashMap();
		OpuOmUserInfo userFrom = omUserInfoService.getOpuOmUserInfoByLoginName(loginName);
		List<OpuOmOrg> listOrg =  omOrgRestService.listOpuOmOrgByUserId(userFrom.getUserId());
		if(userFrom!=null && listOrg!=null){
			for(OpuOmOrg om : listOrg){
				if(om.getOrgId().contains(om.getOpusOmType().getCode())){
					om.setOrgId(om.getOrgId().substring(om.getOpusOmType().getCode().length()+1));
				}
				Map from = new HashMap();
				from.put("orgRank",om.getOrgRank());
				from.put("orgId",om.getOrgId());
				from.put("orgName",om.getOrgName());
				from.put("orgLevel",om.getOrgLevel());
				if(("11").equals(from.get("orgRank")) && !map.containsKey("teamOrgName")){//巡查组(队伍名称)
					map.put("teamOrgId", from.get("orgId").toString());
					map.put("teamOrgName", from.get("orgName").toString());
				}else if(("12").equals(from.get("orgRank")) && !map.containsKey("directOrgName")){//直属机构
					map.put("directOrgId", from.get("orgId").toString());
					map.put("directOrgName", from.get("orgName").toString());
				}else if(("13").equals(from.get("orgRank")) && !map.containsKey("superviseOrgName")){//监理单位
					map.put("superviseOrgId", from.get("orgId").toString());
					map.put("superviseOrgName", from.get("orgName").toString());
				}else if("14".equals(from.get("orgRank"))){//业主机构
					map.put("parentOrgId", from.get("orgId").toString());
					map.put("parentOrgName", from.get("orgName").toString());
				}
				if(listOrg.size()<=4 && new Integer(3).equals(from.get("orgLevel"))){//市级(也是业主机构)
					if(from.get("parentOrgId")==null){
						map.put("parentOrgId", from.get("orgId").toString());
						map.put("parentOrgName", from.get("orgName").toString());
						map.put("top", "true");
					}
				}else if("ps_admin".equals(loginName) || listOrg.size()<=2){
						map.put("parentOrgId", from.get("orgId").toString());
						map.put("parentOrgName", from.get("orgName").toString());
						map.put("top", "true");
				}
			}
		}
		return map;
	}
	/**
	 * 获取重复上报的设施
	 */
	@Override
	public String getRepeatReport(OpuOmUser userForm,Page<CorrectMarkForm> page,
			CorrectMarkForm form, Map<String, Object> map) {
		JSONObject json = new JSONObject();
		Map<String,Object> values = new HashMap<String,Object>();
		StringBuffer sql = new StringBuffer("");
		sql.append("select ps.* from ");
		sql.append(" (select max(attr_four) attrFour,max(road) road,usid,layer_name layerName,count(*) num,max(parent_org_name) parentOrgName,max(correct_type) correctType,max(origin_attr_four) originAttrFour ");
		sql.append(" from DRI_PS_CORRECT_MARK ");
		sql.append(" group by usid,layer_name having count(*)>1) ps ");
		sql.append(" where 1=1 ");
		// 查询条件
		if(form != null){
			if(StringUtils.isNotBlank(form.getLayerName()) && !"全部".equals(form.getLayerName())){
				sql.append(" and ps.layerName like :layerName");
				values.put("layerName", "%"+form.getLayerName()+"%");
			}
			if(StringUtils.isNotBlank(form.getRoad())){
				sql.append(" and ps.road like :road");
				values.put("road", "%"+form.getRoad()+"%");
			}
			if(StringUtils.isNotBlank(form.getAttrFour())){
				sql.append(" and (ps.attrFour like :attrFour");
				sql.append(" or (ps.originAttrFour like :attrFour2 and ps.correctType='设施不存在'))");
				values.put("attrFour", "%"+form.getAttrFour()+"%");
				values.put("attrFour2", "%"+form.getAttrFour()+"%");
			}
		}
		sql.append(" order by ps.num desc");
		//查询加分页
		String pageSql = SqlPageUtils.getPageSql(page,sql.toString());
		SQLQuery query = correctMarkDao.createSQLQuery(pageSql,values);
		List<Object[]> resultlist = query.list();
		List<Map> list = new ArrayList<>();
		for(Object[] obj : resultlist){
			Map mp = new HashMap<>();
			mp.put("attrFour", obj[1]!=null?obj[1]:obj[8]);
			mp.put("road", obj[2]);
			mp.put("usid", obj[3]);
			mp.put("layerName", obj[4]);
			mp.put("sbcs", obj[5]);
			mp.put("parentOrgName", obj[6]);
			list.add(mp);
		}
		//得到总记录数
		String rowsSql = "select count(*)  from ( "+sql.toString()+")";
		List<Object> rowsObj = correctMarkDao.createSQLQuery(rowsSql, values).list();
		for(Object object : rowsObj) {
			long rows = Long.parseLong(object.toString());
			json.put("total", rows);
		}
		json.put("rows", list);
		json.put("code", 200);
		return json.toString();
	}
	/**
	 * 获取重复上报的设施
	 */
	@Override
	public String getRepeatReportDetail(Page<CorrectMarkForm> page,CorrectMarkForm form) {
		JSONObject json = new JSONObject();
		Long total=null;
		List<CorrectMarkForm> listForm = new ArrayList<>();
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from CorrectMark ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			if(StringUtils.isNotBlank(form.getUsid())){
				hql.append(" and ps.usid = :usid");
				values.put("usid", form.getUsid());
			}
			if(StringUtils.isNotBlank(form.getLayerName())){
				hql.append(" and ps.layerName = :layerName");
				values.put("layerName", form.getLayerName());
			}
		}
		hql.append(" order by ps.markTime ");
		
		// 执行分页查询操作
		Page pg = correctMarkDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<CorrectMarkForm> list = CorrectMarkConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		if(page.getResult()!=null){
			listForm = page.getResult();
			total=page.getTotalItems();
		}
		json.put("rows", listForm);
		json.put("total", total);
		json.put("code", 200);
		return json.toString();
	}
	/**
	 * pc端的上报页面查询
	 * */
	@Override
	public String searchSbPage(OpuOmUser userForm,Page<CorrectMarkForm> page,
			CorrectMarkForm form, Map<String, Object> map) {
		JSONObject json = new JSONObject();
		Long total=null;
		List<CorrectMarkForm> listForm = new ArrayList<>();
		String role=null;
		if(userForm!=null && StringUtils.isNotBlank(userForm.getLoginName())){
			Map<String, String> m = getFrom(userForm.getLoginName());
			if(m.containsKey("parentOrgName")){
				if(!m.containsKey("top")){//非市级用户
					map.put("parentOrgId", m.get("parentOrgId"));
					//判定角色
					List<OpuRsRole> listRoles = omRsRoleRestService.listRoleByUserId(userForm.getUserId());
					if(listRoles!=null){
						for (OpuRsRole re : listRoles){
							if("ps_qj_manager".equals(re.getRoleCode())){
								role = "ps_qj_manager";break;
							}
						}
					}
				}
			}
			// 查询语句及参数
			StringBuffer hql = new StringBuffer("from CorrectMark ps where 1=1");
			Map<String,Object> values = new HashMap<String,Object>();
			
			// 查询条件
			if(form != null){
				if(StringUtils.isNotBlank(form.getMarkPerson())){
					hql.append(" and ps.markPerson like :markPerson");
					values.put("markPerson", "%"+form.getMarkPerson()+"%");
				}
				if(StringUtils.isNotBlank(form.getParentOrgId())){  //业主单位
					hql.append(" and ps.parentOrgId = :parentOrgId");
					values.put("parentOrgId", form.getParentOrgId());
				}
				if(StringUtils.isNotBlank(form.getReportType())){
					hql.append(" and ps.reportType = :reportType");
					values.put("reportType", form.getReportType());
				}
				if(StringUtils.isNotBlank(form.getLayerName()) && !"全部".equals(form.getLayerName())){//设施类型
					hql.append(" and ps.layerName like :layerName");
					values.put("layerName", "%"+form.getLayerName()+"%");
				}
				if(StringUtils.isNotBlank(form.getCheckState())){//审核状态
					hql.append(" and ps.checkState like :checkState");
					values.put("checkState", "%"+form.getCheckState()+"%");
				}
				if(StringUtils.isNotBlank(form.getCheckDesription()) ){
					hql.append(" and ps.checkDesription like :checkDesription");
					values.put("checkDesription", "%"+form.getCheckDesription()+"%");
				}
				if(StringUtils.isNotBlank(form.getRoad()) ){
					hql.append(" and ps.road like :road");
					values.put("road", "%"+form.getRoad()+"%");
				}
				if(StringUtils.isNotBlank(form.getCityVillage()) ){//管理状态
					hql.append(" and ps.cityVillage like :cityVillage");
					values.put("cityVillage", "%"+form.getCityVillage()+"%");
				}
				if(StringUtils.isNotBlank(form.getObjectId()) ){
					hql.append(" and ps.objectId = :objectId");
					values.put("objectId", form.getObjectId());
				}
				if(StringUtils.isNotBlank(form.getPcode()) && !"null".equals(form.getPcode())){
					String[] pcode = form.getPcode().split(",");
					for(String code : pcode){
						hql.append(" and ps.pcode like '%"+code+"%'");
					}
				}
				if(StringUtils.isNotBlank(form.getChildCode()) && !"null".equals(form.getChildCode())){
					String[] pcode = form.getChildCode().split(",");
					for(String code : pcode){
						hql.append(" and ps.childCode like '%"+code+"%'");
					}
				}
			}
			if(map!=null){
				if(map.containsKey("parentOrgId")){//非市级
					if(role==null){//个人
						hql.append(" and ps.markPersonId = :loginname");
						values.put("loginname", userForm.getLoginName());
					}else if("ps_qj_manager".equals(role)){//区级管理员
						hql.append(" and ps.parentOrgId = :parentOrgId2");
						values.put("parentOrgId2", map.get("parentOrgId"));
					}
				}
				SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
				if(map.get("startTime")!=null){
					hql.append(" and to_char(ps.markTime,'yyyymmdd') >= :startTime ");
					values.put("startTime", df.format((Date)map.get("startTime")));
				}
				if(map.get("endTime")!=null){
					hql.append(" and to_char(ps.markTime,'yyyymmdd') <= :endTime");
					values.put("endTime", df.format((Date)map.get("endTime")));
				}
			}
			hql.append(" order by ps.markTime desc");
			//排序
			hql.append(HqlUtils.buildOrderBy(page, "ps"));
			
			// 执行分页查询操作
			Page pg = correctMarkDao.findPage(page, hql.toString(), values);
			
			// 转换为Form对象列表并赋值到原分页对象中
			List<CorrectMarkForm> list = CorrectMarkConvertor.convertVoListToFormList(pg.getResult());
			PageUtils.copy(pg, list, page);
			if(page.getResult()!=null){
				listForm = page.getResult();
				total=page.getTotalItems();
			}
			json.put("rows", listForm);
			json.put("total", total);
			json.put("code", 200);
		}else{
			json.put("code", 300);
			json.put("message", "参数错误!");
		}
		return json.toString();
	}
	/**
	 * 自定义条件分页
	 * @param map 额外的查询参数
	 * */
	
	@Transactional(readOnly = true)
	public Page<CorrectMarkForm> searchFromAndMap(Page<CorrectMarkForm> page, 
			CorrectMarkForm form,Map<String, Object> map) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from CorrectMark ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		//sql统计数量
		StringBuffer sql = new StringBuffer("select * from DRI_PS_CORRECT_MARK ps where 1=1");
		// 查询条件
		if(form != null){
			if(form.getPersonUserId()!=null){
				hql.append(" and ps.personUserId = :personUserId");
				sql.append(" and ps.person_User_Id = :personUserId");
				values.put("personUserId", form.getPersonUserId());
			}
			if(StringUtils.isNotBlank(form.getObjectId())){
				hql.append(" and ps.objectId like :objectId");
				sql.append(" and ps.object_Id like :objectId");
				values.put("objectId", "%"+form.getObjectId()+"%");
			}
			if(StringUtils.isNotBlank(form.getIsAddFeature())){
				hql.append(" and ps.isAddFeature = :isAddFeature");
				sql.append(" and ps.is_Add_Feature = :isAddFeature");
				values.put("isAddFeature", form.getIsAddFeature());
			}
			if(StringUtils.isNotBlank(form.getMarkPersonId())){
				hql.append(" and ps.markPersonId = :markPersonId");
				sql.append(" and ps.mark_Person_Id = :markPersonId");
				values.put("markPersonId", form.getMarkPersonId());
			}
			if(StringUtils.isNotBlank(form.getMarkPerson())){
				hql.append(" and ps.markPerson like :markPerson");
				sql.append(" and ps.mark_Person like :markPerson");
				values.put("markPerson", "%"+form.getMarkPerson()+"%");
			}
			if(StringUtils.isNotBlank(form.getRoad())){//所在道路
				hql.append(" and ps.road like :road");
				sql.append(" and ps.road like :road");
				values.put("road", "%"+form.getRoad()+"%");
			}
			if(StringUtils.isNotBlank(form.getAddr())){//所在道路
				hql.append(" and ps.addr like :addr");
				sql.append(" and ps.addr like :addr");
				values.put("addr", "%"+form.getAddr()+"%");
			}
			if(StringUtils.isNotBlank(form.getAttrFive())){//挂牌编号
				hql.append(" and ps.attrFive like :attrFive");
				sql.append(" and ps.attr_five like :attrFive");
				values.put("attrFive", "%"+form.getAttrFive()+"%");
			}
			if(StringUtils.isNotBlank(form.getDirectOrgId())){   //直属单位
				hql.append(" and ps.directOrgId = :directOrgId");
				sql.append(" and ps.direct_Org_Id = :directOrgId");
				values.put("directOrgId",form.getDirectOrgId());
			}
			if(StringUtils.isNotBlank(form.getSuperviseOrgId())){ // 监理单位
				hql.append(" and ps.superviseOrgId = :superviseOrgId");
				sql.append(" and ps.supervise_Org_Id = :superviseOrgId");
				values.put("superviseOrgId", form.getSuperviseOrgId());
			}
			if(StringUtils.isNotBlank(form.getParentOrgId())){  //业主单位
				hql.append(" and ps.parentOrgId = :parentOrgId");
				sql.append(" and ps.parent_Org_Id = :parentOrgId");
				values.put("parentOrgId", form.getParentOrgId());
			}
			if(StringUtils.isNotBlank(form.getDirectOrgName())){  //直属单位
				hql.append(" and ps.directOrgName like :directOrgName");
				sql.append(" and ps.direct_Org_Name like :directOrgName");
				values.put("directOrgName", "%"+form.getDirectOrgName()+"%");
			}
			if(StringUtils.isNotBlank(form.getSuperviseOrgName())){  //监理单位
				hql.append(" and ps.superviseOrgName like :superviseOrgName");
				sql.append(" and ps.supervise_Org_Name like :superviseOrgName");
				values.put("superviseOrgName", "%"+form.getSuperviseOrgName()+"%");
			}
			if(StringUtils.isNotBlank(form.getParentOrgName())){  //业主单位
				if(form.getParentOrgName().indexOf(",")!=-1){
					String[] parentName = form.getParentOrgName().split(",");
					hql.append(" and (");
					sql.append(" and (");
					for(int i=0;i<parentName.length;i++){
						if(i>0) {
							hql.append(" or");
							sql.append(" or");
						}
						hql.append(" ps.parentOrgName like '%"+parentName[i]+"%'");
						sql.append(" ps.parent_Org_Name like '%"+parentName[i]+"%'");
					}
					hql.append(")");
					sql.append(")");
				}else{
					hql.append(" and ps.parentOrgName like :parentOrgName");
					sql.append(" and ps.parent_Org_Name like :parentOrgName");
					values.put("parentOrgName", "%"+form.getParentOrgName()+"%");
				}
			}
			if(StringUtils.isNotBlank(form.getLayerName())){   //设施类型
				hql.append(" and ps.layerName like :layerName");
				sql.append(" and ps.layer_Name like :layerName");
				values.put("layerName", "%"+form.getLayerName()+"%");
			}
			if(StringUtils.isNotBlank(form.getUsid())){
				hql.append(" and ps.usid like :usid");
				sql.append(" and ps.usid like :usid");
				values.put("usid", "%"+form.getUsid()+"%");
			}
			if(StringUtils.isNotBlank(form.getCheckState())){
				if("1".equals(form.getCheckState())){
					hql.append(" and (ps.checkState = :checkState or ps.checkState ='' or ps.checkState is null)");
				}else{
					hql.append(" and ps.checkState = :checkState");
				}
				values.put("checkState", form.getCheckState());
			}
		}
		if(map!=null){
//			if(map.containsKey("startTime") && map.containsKey("endTime")){
//				hql.append(" and ps.markTime between :startTime and :endTime");
//				values.put("startTime", (Date)map.get("startTime"));
//				values.put("endTime", (Date)map.get("endTime"));
//			}
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			if(map.get("startTime")!=null){
				hql.append(" and to_char(ps.markTime,'yyyy-MM-dd hh24:mi:ss') >= :startTime ");
				sql.append(" and to_char(ps.mark_Time,'yyyy-MM-dd hh24:mi:ss') >= :startTime ");
				values.put("startTime", df.format((Date)map.get("startTime")));
			}
			if(map.get("endTime")!=null){
				hql.append(" and to_char(ps.markTime,'yyyy-MM-dd hh24:mi:ss') <= :endTime");
				sql.append(" and to_char(ps.mark_Time,'yyyy-MM-dd hh24:mi:ss') <= :endTime");
				values.put("endTime", df.format((Date)map.get("endTime")));
			}
			if(map.containsKey("notParentOrgName")){
				hql.append(" and ps.parentOrgName not like :notParentOrgName");
				sql.append(" and ps.parent_Org_Name not like :notParentOrgName");
				values.put("notParentOrgName", "%"+map.get("notParentOrgName").toString()+"%");
			}
		}
		hql.append(" order by ps.updateTime desc");
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = correctMarkDao.findPage(page, hql.toString(), values);
		//获取各状态数量
		Map<String,Object> getNum = values;
		if(getNum.containsKey("checkState")){
			getNum.remove("checkState");
		}
		long no = correctMarkDao.countSqlResult(sql.toString()+" and (ps.check_State ='1' or ps.check_State ='' or ps.check_State is null) ", getNum);
		long pass = correctMarkDao.countSqlResult(sql.toString()+" and ps.check_State ='2' ", getNum);
		long doubt = correctMarkDao.countSqlResult(sql.toString()+" and ps.check_State ='3' ", getNum);
		map.put("no", no);
		map.put("pass", pass);
		map.put("doubt", doubt);
		// 转换为Form对象列表并赋值到原分页对象中
		List<CorrectMarkForm> list = CorrectMarkConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		if(list!=null && list.size()>0)
			return page;
		else
			return pg;
	}
	
	/**
	 * pc自定义条件分页
	 * @param map 额外的查询参数
	 * */
	
	@Transactional(readOnly = true)
	public Page<CorrectMarkForm> searchFromAndMapPc(Page<CorrectMarkForm> page, 
			CorrectMarkForm form,Map<String, Object> map) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from CorrectMark ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			/*if(StringUtils.isNotBlank(form.getCorrectType())){
				hql.append(" and ps.correctType = :correctType");
				values.put("correctType", form.getCorrectType());
			}*/
			if(StringUtils.isNotBlank(form.getObjectId())){
				hql.append(" and ps.objectId = :objectId");
				values.put("objectId", form.getObjectId());
			}
			if(StringUtils.isNotBlank(form.getReportType())){//上报类型
				hql.append(" and ps.reportType = :reportType");
				values.put("reportType", form.getReportType());
			}
			if(StringUtils.isNotBlank(form.getIsAddFeature())){
				hql.append(" and ps.isAddFeature = :isAddFeature");
				values.put("isAddFeature", form.getIsAddFeature());
			}
			if(StringUtils.isNotBlank(form.getMarkPersonId())){
				hql.append(" and ps.markPersonId = :markPersonId");
				values.put("markPersonId", form.getMarkPersonId());
			}
			if(StringUtils.isNotBlank(form.getMarkPerson())){
				hql.append(" and ps.markPerson like :markPerson");
				values.put("markPerson", "%"+form.getMarkPerson()+"%");
			}
			if(StringUtils.isNotBlank(form.getRoad())){//所在道路
				hql.append(" and ps.road like :road");
				values.put("road", "%"+form.getRoad()+"%");
			}
			if(StringUtils.isNotBlank(form.getDirectOrgId())){   //直属单位
				hql.append(" and ps.directOrgId = :directOrgId");
				values.put("directOrgId",form.getDirectOrgId());
			}
			if(StringUtils.isNotBlank(form.getSuperviseOrgId())){ // 监理单位
				hql.append(" and ps.superviseOrgId = :superviseOrgId");
				values.put("superviseOrgId", form.getSuperviseOrgId());
			}
			if(StringUtils.isNotBlank(form.getParentOrgId())){  //业主单位
				hql.append(" and ps.parentOrgId = :parentOrgId");
				values.put("parentOrgId", form.getParentOrgId());
			}
			if(StringUtils.isNotBlank(form.getDirectOrgName())){  //直属单位
				hql.append(" and ps.directOrgName like :directOrgName");
				values.put("directOrgName", "%"+form.getDirectOrgName()+"%");
			}
			if(StringUtils.isNotBlank(form.getSuperviseOrgName())){  //监理单位
				hql.append(" and ps.superviseOrgName like :superviseOrgName");
				values.put("superviseOrgName", "%"+form.getSuperviseOrgName()+"%");
			}
			if(StringUtils.isNotBlank(form.getParentOrgName())){  //业主单位
				if(form.getParentOrgName().indexOf(",")!=-1){
					String[] parentName = form.getParentOrgName().split(",");
					hql.append(" and (");
					for(int i=0;i<parentName.length;i++){
						if(i>0) hql.append(" or");
						hql.append(" ps.parentOrgName like '%"+parentName[i]+"%'");
					}
					hql.append(")");
				}else{
					hql.append(" and ps.parentOrgName like :parentOrgName");
					values.put("parentOrgName", "%"+form.getParentOrgName()+"%");
				}
			}
			if(StringUtils.isNotBlank(form.getLayerName())){   //设施类型
				hql.append(" and ps.layerName like :layerName");
				values.put("layerName", "%"+form.getLayerName()+"%");
			}
			if(StringUtils.isNotBlank(form.getUsid())){
				hql.append(" and ps.usid like :usid");
				values.put("usid", "%"+form.getUsid()+"%");
			}
			if(StringUtils.isNotBlank(form.getCheckState())){
				hql.append(" and ps.checkState = :checkState");
				values.put("checkState", form.getCheckState());
			}
		}
		if(map!=null){
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			if(map.containsKey("startTime") && map.containsKey("endTime")){
//				hql.append(" and to_char(ps.markTime,'yyyy-MM-dd hh24:mi:ss') >= :startTime and to_char(ps.markTime,'yyyy-MM-dd hh24:mi:ss') <= :endTime");
				if(map.get("startTime")!=null){
					hql.append(" and to_char(ps.markTime,'yyyy-MM-dd hh24:mi:ss') >= :startTime") ;
					values.put("startTime", df.format((Date)map.get("startTime")));
				}
				if(map.get("endTime")!=null){
					hql.append(" and to_char(ps.markTime,'yyyy-MM-dd hh24:mi:ss') <= :endTime") ;
					values.put("endTime", df.format((Date)map.get("endTime")));
				}
			}
		}
		hql.append(" and ps.parentOrgName is not null order by ps.markTime ");
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = correctMarkDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<CorrectMarkForm> list = CorrectMarkConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		if(list!=null && list.size()>0)
			return page;
		else
			return pg;
	}
	/**
	 * 移动端修改
	 * */
	@Override
	public void updateForm(CorrectMarkForm f) {
		if(f!=null&&f.getId()!=null){
			f.setMarkTime(null);//上报时间不修改,置空
			f.setCheckState("1");
			f.setCheckPerson(null);
			f.setCheckPersonId(null);
			f.setCheckTime(null);
			f.setCheckDesription(null);
			f.setUpdateTime(new Date());
			f.setMarkPersonId(null);
			f.setMarkPerson(null);
			f.setTeamOrgId(null);
			f.setTeamOrgName(null);
			f.setDirectOrgId(null);
			f.setDirectOrgName(null);
			f.setSuperviseOrgId(null);
			f.setSuperviseOrgName(null);
			f.setParentOrgId(null);
			f.setParentOrgName(null);
			this.save(f);
		}
	}
	/***************************************************/
	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public CorrectMarkForm get(Long id) {
		//correctMarkDao.getSession().evict(correctMarkDao.get(id));
		CorrectMark entity = correctMarkDao.get(id);
		//correctMarkDao.getSession().evict(entity);
		return CorrectMarkConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		correctMarkDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(CorrectMarkForm... forms) {
		if(forms != null)
			for(CorrectMarkForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	@Transactional(propagation= Propagation.REQUIRES_NEW,rollbackFor = Exception.class)
	public void save(CorrectMarkForm form){
		//correctMarkDao.getEntityManager().getTransaction().begin();

		if(form != null){
			CorrectMark entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = correctMarkDao.get(form.getId());
			}else{
				entity = new CorrectMark();
			}
			
			//属性值转换
			CorrectMarkConvertor.convertFormToVo(form, entity);
			
			//保存
			correctMarkDao.save(entity);
			//回填ID属性值
			form.setId(entity.getId());
			//correctMarkDao.getEntityManager().getTransaction().commit();
		}
	}
	/**
	 * 查找全部未同步数据
	 * @param form
	 * */
	public List<CorrectMarkForm> getListCorrect(CorrectMarkForm form){
		Page pg = new Page();
		pg.setPageSize(2500);
		StringBuffer hql = new StringBuffer("from CorrectMark ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		if(form != null){
			if(StringUtils.isNotBlank(form.getIsAddFeature())){
				hql.append(" and ps.isAddFeature like :isAddFeature");
				values.put("isAddFeature", "%"+form.getIsAddFeature()+"%");
			}
			if(StringUtils.isNotBlank(form.getParentOrgId())){
				hql.append(" and ps.parentOrgId like :parentOrgId");
				values.put("parentOrgId", "%"+form.getParentOrgId()+"%");
			}
		}
		hql.append(" order by ps.markTime desc");
		pg= correctMarkDao.findPage(pg,hql.toString(),values);
		List<CorrectMark> list =pg.getResult();
		return CorrectMarkConvertor.convertVoListToFormList(list);
	} 
	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<CorrectMarkForm> search(Page<CorrectMarkForm> page, CorrectMarkForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer(" from CorrectMark ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			if(StringUtils.isNotBlank(form.getParentOrgId())){
				hql.append(" and ps.parentOrgId = :parentOrgId");
				values.put("parentOrgId", form.getParentOrgId());
			}
			if(StringUtils.isNotBlank(form.getMarkPerson())){
				hql.append(" and ps.markPerson like :markPerson");
				values.put("markPerson", "%"+form.getMarkPerson()+"%");
			}
			if(StringUtils.isNotBlank(form.getDirectOrgName())){
				hql.append(" and ps.directOrgName like :directOrgName");
				values.put("directOrgName", "%"+form.getDirectOrgName()+"%");
			}
			if(StringUtils.isNotBlank(form.getLayerName())){
				hql.append(" and ps.markPerson like :layerName");
				values.put("layerName", "%"+form.getLayerName()+"%");
			}
			if(StringUtils.isNotBlank(form.getUsid())){
				hql.append(" and ps.usid = :usid");
				values.put("usid", form.getUsid());
			}
		}
		hql.append(" order by ps.updateTime desc");
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = correctMarkDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<CorrectMarkForm> list = CorrectMarkConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		if(list!=null && list.size()>0)
			return page;
		else
			return pg;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<CorrectMarkForm> search(Page<CorrectMarkForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<CorrectMark> pg = correctMarkDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<CorrectMarkForm> list = CorrectMarkConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	/**
	 * 查询最新十条数据
	 * */
	public List<Map<String,Object>> getLatestTen(){
		String sql = "select PARENT_ORG_NAME,DIRECT_ORG_NAME,SUPERVISE_ORG_NAME,"
				+ "TEAM_ORG_NAME,ID,MARK_PERSON,CORRECT_TYPE,MARK_TIME,LAYER_NAME from (select * from DRI_PS_CORRECT_MARK ps where ps.MARK_TIME>sysdate-3 order by ps.MARK_TIME desc) where ROWNUM<=10";
		return jdbcTemplate.queryForList(sql);
	}
	/**
	 * 统计纠错类型的全部结果数量
	 * */
	public Long getCorrectTotal(String layerName,
			String parentOrgName,Map<String,Object> map){
		StringBuffer hql = new StringBuffer("select count(*) from CorrectMark ps where 1=1 ");
		Map values = new HashMap();
		if(StringUtils.isNotBlank(layerName)){
			hql.append("and ps.layerName like :layerName");
			values.put("layerName", "%"+layerName+"%");
		}
		if(StringUtils.isNotBlank(parentOrgName)){
			hql.append("and ps.parentOrgName like :parentOrgName");
			values.put("parentOrgName", "%"+parentOrgName+"%");
		}
		if(map!=null){
			if(map.containsKey("startTime") && map.containsKey("endTime")){
				hql.append(" and ps.markTime between :startTime and :endTime");
				values.put("startTime", map.get("startTime"));
				values.put("endTime", map.get("endTime"));
			}
		}
		return (Long) correctMarkDao.createQuery(hql.toString(),values).uniqueResult();
	}
	/**
	 * 查看列表是显示图片
	 * */
	@Override
	public Map<String,Object> seeCorrectMark(String path, long id) {
		Map<String,Object> map = new HashMap();
		CorrectMarkForm form = get(id);
		if(form==null){
			return map;
		}
		Map mapForm = CorrectMarkConvertor.convertFormToMap(form);
		List<CorrectMarkAttachmentForm> list =  correctMarkAttachmentService.getMarkId(form.getId().toString());
		List<CorrectMarkAttachment> listAttachments =
				CorrectMarkAttachmentConvertor.convertFormListToVoList(list);
		List<Map> listMap =CorrectMarkAttachmentConvertor.
				convertVoListToMapList(listAttachments);
		if(listMap!=null&&listMap.size()>0){
			for(Map mp :listMap){
				mp.put("attPath",mp.get("attPath")!=null? path+mp.get("attPath").toString():"");
				mp.put("thumPath",mp.get("thumPath")!=null? path+mp.get("thumPath").toString():"");
				if(mp.containsKey("attTime")){
					Date time = (Date)mp.get("attTime");
					mp.put("attTime", time!=null? time.getTime():null);
				}
			}
		}
		map.put("data", mapForm);
		map.put("rows", listMap);
		return map;
	}
	/*************************************定时执行查询和保存（图层相关）*************************************/
	/**
	 * 成功修改至图层属性中的数据-更新数据库
	 * @params List<Map> listMap
	 * */
	public void featureToUpdateForm(FeatureForm featureForm){
		if("add".equals(featureForm.getReport_type()) ){
			LackMarkForm form = lackMarkService.get(featureForm.getId());
			form.setCheckState(featureForm.getCheck_state());
			form.setCheckPerson(featureForm.getCheck_person());
			form.setCheckPersonId(featureForm.getCheck_person_id());
			form.setCheckDesription(featureForm.getCheck_desription());
			form.setCheckTime(featureForm.getCheck_time()!=null? new Date(featureForm.getCheck_time()): null);
			lackMarkService.save(form);
		}
		if("modify".equals(featureForm.getReport_type())|| "confirm".equals(featureForm.getReport_type())){
			CorrectMarkForm form = this.get(featureForm.getId());
			form.setCheckState(featureForm.getCheck_state());
			form.setCheckPerson(featureForm.getCheck_person());
			form.setCheckPersonId(featureForm.getCheck_person_id());
			form.setCheckDesription(featureForm.getCheck_desription());
			form.setCheckTime(featureForm.getCheck_time()!=null? new Date(featureForm.getCheck_time()): null);
			this.save(form);
		}
	}
	/**
	 * 成功保存至图层属性中的数据-保存至数据库
	 * @params List<Map> listMap
	 * */
	public Boolean featureToSaveForm(FeatureForm featureForm){
		if("add".equals(featureForm.getReport_type()) ){
			LackMarkForm form = lackMarkService.get(featureForm.getId());
			form.setIsAddFeature("1"); // 已同步
			//form.setCheckState(featureForm.getCheck_state());
			form.setObjectId(featureForm.getObjectid().toString());
			lackMarkService.save(form);
			return true;
		}else if("modify".equals(featureForm.getReport_type())|| "confirm".equals(featureForm.getReport_type())){
			CorrectMarkForm form = this.get(featureForm.getId());
			form.setIsAddFeature("1"); // 已同步
			//form.setCheckState(featureForm.getCheck_state());
			form.setObjectId(featureForm.getObjectid().toString());
			this.save(form);
			return true;
		}else{
			return false;
		}
	}
	/**
	 * pc端审核返回数据库
	 * */
	@Override
	public String checkForm(String chechState,String checkDesription,OpuOmUser userForm,String isCheck, Long id) {
		JSONObject json = new JSONObject();
		Map userInfo = omUserInfoService.getOpuOmUserInfoByUserId(userForm.getLoginName());
		if("correct".equals(isCheck)){ //correct
			CorrectMarkForm form = this.get(id);
			if("2".equals(form.getCheckState())){
				json.put("success", false);
				json.put("message", "该数据已审！请刷新重新查看!");
				return json.toString();
			}
			CheckRecordForm checkForm = new CheckRecordForm();
			if(form.getObjectId()!=null && StringUtils.isNotBlank(chechState)){
//				form.setCheckPersonId(userForm.getUser().getUserId().toString());
				form.setCheckPersonId(userInfo.get("userMobile").toString());//存手机号
				form.setCheckPerson(userInfo.get("userName").toString());
				form.setCheckTime(new Date());
				checkForm.setReportId(form.getId().toString());
				checkForm.setUsId(form.getUsid());
				checkForm.setReportType(form.getReportType());
//				checkForm.setCheckPersonId(userForm.getUser().getUserId().toString());
				checkForm.setCheckPersonId(userInfo.get("userMobile").toString());//存手机号
				checkForm.setCheckPerson(userInfo.get("userName").toString());
				checkForm.setCheckTime(new Date());
				if("2".equals(chechState) || "3".equals(chechState)){
					form.setCheckState(chechState);// 审核（通过还是疑问）
					form.setCheckDesription(checkDesription);
					checkForm.setCheckState(chechState);
					checkForm.setCheckDesription(checkDesription);
				}
				FeatureForm featureForm = DataFormToFeatureConvertor.convertCorrVoToForm(form);
				try {
					Boolean flag = SynchronousData.updateFeature(featureForm);
					if(flag==true) this.save(form);
					checkRecordService.save(checkForm);
					json.put("success",flag);
					json.put("message",flag==true? "审核成功!":"审核失败!");
				} catch (RuntimeException e) {
					e.printStackTrace();
					json.put("success", false);
					json.put("message", "审核失败!");
					throw new RuntimeException(e);
				}
			}else{
				json.put("success", false);
				json.put("message", "该数据未同步,不能审核！");
			}
			
		}else if("lack".equals(isCheck)){ //lack
			LackMarkForm form = lackMarkService.get(id);
			if("2".equals(form.getCheckState())){
				json.put("success", false);
				json.put("message", "该数据已审！请刷新重新查看!");
				return json.toString();
			}
			CheckRecordForm checkForm = new CheckRecordForm();
			if(form.getObjectId()!=null && StringUtils.isNotBlank(chechState)){
//				form.setCheckPersonId(userForm.getUser().getUserId().toString());
				form.setCheckPersonId(userInfo.get("userMobile").toString());//存手机号
				form.setCheckPerson(userInfo.get("userName").toString());
				form.setCheckTime(new Date());
				checkForm.setReportId(form.getId().toString());
				checkForm.setUsId(form.getUsid());
				checkForm.setReportType("add");
//				checkForm.setCheckPersonId(userForm.getUser().getUserId().toString());
				checkForm.setCheckPersonId(userInfo.get("userMobile").toString());//存手机号
				checkForm.setCheckPerson(userInfo.get("userName").toString());
				checkForm.setCheckTime(new Date());
				if("2".equals(chechState) || "3".equals(chechState)){
					form.setCheckState(chechState);// 审核（通过还是疑问）
					form.setCheckDesription(checkDesription);
					checkForm.setCheckState(chechState);
					checkForm.setCheckDesription(checkDesription);
				}
				FeatureForm featureForm = DataFormToFeatureConvertor.convertLackVoToForm(form);
				try {
					Boolean flag = SynchronousData.updateFeature(featureForm);
					if(flag==true) lackMarkService.save(form);
					checkRecordService.save(checkForm);
					json.put("success",flag);
					json.put("message",flag==true? "审核成功!":"审核失败!");
				} catch (RuntimeException e) {
					e.printStackTrace();
					json.put("success", false);
					json.put("message", "审核失败!");
					throw new RuntimeException(e);
				}
			}else{
				json.put("success", false);
				json.put("message", "该数据未同步,不能审核！");
			}
		}else{
			json.put("success", false);
			json.put("message", "参数有误!");
		}
		return json.toString();
	}
	/**
	 * 获取各审批状态的数量(pc端页面展示)
	 * 新增一个form参数，带条件查询
	 * @return
	 */
	@Override
	public String getNum(OpuOmUser userForm,CorrectMarkForm form,Map<String,Object> map){
		JSONObject json = new JSONObject();
		String t_parentOrgId="";
		String k_parentOrgId="";
		StringBuffer sqlMoreCorrect=new StringBuffer();
		StringBuffer sqlMoreLack=new StringBuffer();
		if(userForm!=null && StringUtils.isNotBlank(userForm.getLoginName())){
			Map<String,String> map2 = this.getFrom(userForm.getLoginName());
			if(map2!=null&&map2.containsKey("parentOrgName")){
				if(!map2.containsKey("top")){//区级用户
					t_parentOrgId = " and t.parent_org_id= '"+map2.get("parentOrgId")+"'";
					k_parentOrgId = " and k.parent_org_id= '"+map2.get("parentOrgId")+"'";
				}
			}
		}
		//新增按区,部件名称,上报人模糊匹配 日期 
		if (StringUtils.isNotBlank(form.getParentOrgName())) {
			sqlMoreCorrect.append(" and t.parent_org_name like '%"+form.getParentOrgName()+"%'") ;
			sqlMoreLack.append(" and k.parent_org_name like '%"+form.getParentOrgName()+"%'") ;
		}
		if (StringUtils.isNotBlank(form.getCorrectType())) {
			sqlMoreCorrect.append(" and t.layer_name like '%"+form.getCorrectType()+"%'") ;
			sqlMoreLack.append(" and k.component_type like '%"+form.getCorrectType()+"%'") ;
		}
		if (StringUtils.isNotBlank(form.getMarkPerson())) {
			sqlMoreCorrect.append(" and t.mark_person like '%"+form.getMarkPerson()+"%'") ;
			sqlMoreLack.append(" and k.mark_person like '%"+form.getMarkPerson()+"%'") ;
		}
		if (StringUtils.isNotBlank(form.getRoad())) {
			sqlMoreCorrect.append(" and t.road like '%"+form.getRoad()+"%'") ;
			sqlMoreLack.append(" and k.road like '%"+form.getRoad()+"%'") ;
		}
		if (StringUtils.isNotBlank(form.getObjectId())) {
			sqlMoreCorrect.append(" and t.object_id = '"+form.getObjectId()+"'") ;
			sqlMoreLack.append(" and k.object_id = '"+form.getObjectId()+"'") ;
		}
		if(map!=null && map.size()>0){
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			if(map.get("startTime")!=null){
				sqlMoreCorrect.append(" and to_char(t.mark_Time,'yyyy-MM-dd hh24:mi:ss') >=  '"+df.format((Date)map.get("startTime"))+"'") ;
				sqlMoreLack.append(" and to_char(k.mark_Time,'yyyy-MM-dd hh24:mi:ss') >=  '"+df.format((Date)map.get("startTime"))+"'") ;
			}
			if(map.get("endTime")!=null){
				sqlMoreCorrect.append(" and to_char(t.mark_Time,'yyyy-MM-dd hh24:mi:ss') <= '"+df.format((Date)map.get("endTime"))+"'") ;
				sqlMoreLack.append(" and to_char(k.mark_Time,'yyyy-MM-dd hh24:mi:ss') <= '"+df.format((Date)map.get("endTime"))+"'") ;
			}
		}
		String sql1="select count(*) from( select t.id from DRI_PS_CORRECT_MARK t where t.check_state='1'"+t_parentOrgId+sqlMoreCorrect.toString()+" union all select k.id from DRI_PS_LACK_MARK k where k.check_state='1'"+k_parentOrgId+sqlMoreLack.toString()+") ";
		String sql2="select count(*) from( select t.id from DRI_PS_CORRECT_MARK t where t.check_state='2'"+t_parentOrgId+sqlMoreCorrect.toString()+" union all select k.id from DRI_PS_LACK_MARK k where k.check_state='2'"+k_parentOrgId+sqlMoreLack.toString()+") ";
		String sql3="select count(*) from( select t.id from DRI_PS_CORRECT_MARK t where t.check_state='3'"+t_parentOrgId+sqlMoreCorrect.toString()+"  union all select k.id from DRI_PS_LACK_MARK k where k.check_state='3'"+k_parentOrgId+sqlMoreLack.toString()+") ";
		String sql4="select count(*) from( select t.id from DRI_PS_CORRECT_MARK t where t.is_add_feature='2'"+t_parentOrgId+sqlMoreCorrect.toString()+"  union all select k.id from DRI_PS_LACK_MARK k where k.is_add_feature='2'"+k_parentOrgId+sqlMoreLack.toString()+") ";
		List<Object> result1 = correctMarkDao.getSession().createSQLQuery(sql1).list();
		List<Object> result2 = correctMarkDao.getSession().createSQLQuery(sql2).list();
		List<Object> result3 = correctMarkDao.getSession().createSQLQuery(sql3).list();
		List<Object> result4 = correctMarkDao.getSession().createSQLQuery(sql4).list();
		json.put("one",result1.get(0).toString());
		json.put("two",result2.get(0).toString());
		json.put("three",result3.get(0).toString());
		json.put("four",result4.get(0).toString());
		return json.toString();
	}
	/**
	 * 新增后回填
	 * 同步失败，标记为2，成功标记为1
	 * */
	@Override
	public Boolean updateFeatureToForm(FeatureForm featureForm, String isAddFeature) {
		if("add".equals(featureForm.getReport_type())){
			LackMarkForm form = lackMarkService.get(featureForm.getId());
			form.setIsAddFeature(isAddFeature);
			lackMarkService.save(form);
			return true;
		}else if("modify".equals(featureForm.getReport_type()) || "confirm".equals(featureForm.getReport_type())){
			CorrectMarkForm form = this.get(featureForm.getId());
			form.setIsAddFeature(isAddFeature);
			this.save(form);
			return true;
		}else{
			return false;
		}
	}
	/**
	 * 更新后回填
	 * 更新失败，标记为3(修改的话就更新审核状态为1，删除审核信息)
	 * */
	@Override
	public void updateFeatureVoToForm(FeatureForm featureForm, String isAddFeature) {
		if("add".equals(featureForm.getReport_type())){
			LackMarkForm form = lackMarkService.get(featureForm.getId());
			form.setIsAddFeature(isAddFeature);
			lackMarkService.save(form);
		}
		if("modify".equals(featureForm.getReport_type()) || "confirm".equals(featureForm.getReport_type())){
			CorrectMarkForm form = this.get(featureForm.getId());
			form.setIsAddFeature(isAddFeature);
			this.save(form);
		}
	}
	/**
	 * 获取区域下未同步数据或者更新失败数据
	 * @param tableName 表名
	 * @param parentOrgId 区域条件
	 * @return Long ids
	 * */
	public List<Long> getNotSyncForm(String tableName,String parentOrgId,String isAddFeature){
		if(StringUtils.isNotBlank(tableName)){
			List<Long> listIds = new ArrayList<>();
			String sql = "select t.id from "+tableName+" t where 1=1 ";
			if("3".equals(isAddFeature)){
				sql+="and t.IS_ADD_FEATURE='3' and t.object_id is not null"; //修改状态
			}else{
				sql+="and t.IS_ADD_FEATURE='"+isAddFeature+"'"; //否则就是同步失败
			}
			if(StringUtils.isNotBlank(parentOrgId)){
				sql+=" and t.parent_org_id ="+parentOrgId;
			}
			sql+=" and rownum <=3000";
			List<BigDecimal> bigIds = (List<BigDecimal>)correctMarkDao.getSession().createSQLQuery(sql).list();
		    for (BigDecimal bigDecimal : bigIds) {
		    	listIds.add(bigDecimal.longValue());
			}
			return listIds;
		}else{
			return null;
		}
	}
	
	/**
	 * 手动同步所属区域下的同步失败数据(同步所有)
	 * */
	@Override
	public String saveAFeatureFormJs(OpuOmUser userForm) {
		JSONObject json = new JSONObject();
		List<CorrectMarkForm> listCorr = new ArrayList<>();
		List<LackMarkForm> lackCorr = new ArrayList<>();
		Page pg = new Page();
		pg.setPageSize(100);
		Page pgLack = new Page();
		pgLack.setPageSize(100);
		if(userForm!=null&&userForm.getLoginName()!=null){
			Map<String,String> map = this.getFrom(userForm.getLoginName());
			if(map!=null&&map.containsKey("parentOrgName")){
				Map mp = new HashMap<>();
				CorrectMarkForm form = new CorrectMarkForm();
				LackMarkForm lackForm = new LackMarkForm();
				if(map.containsKey("top")){//市级用户
					form.setIsAddFeature("1");
				}else{// 区级用户
					form.setIsAddFeature("1");
					form.setParentOrgId(map.get("parentOrgId"));
				}
				pg = this.searchFromAndMap(pg, form, mp);
				pgLack = lackMarkService.searchFromAndMap(pgLack, lackForm, mp);
			}
		}
		if(pgLack.getResult()!=null){
			//listCorr = pg.getResult();
			lackCorr = pgLack.getResult();
			for(LackMarkForm lackForm : lackCorr){
				FeatureForm form = DataFormToFeatureConvertor.convertLackVoToForm(lackForm);
				SynchronousData.addFeature(form);
			}
			json.put("rows", pgLack.getResult());
			json.put("total", pgLack.getTotalItems());
			json.put("success", true);
		}
		return json.toString();
	}
	/**
	 * 页面分页查询是否同步
	 * */
	@Override
	public String getCorrectAndLackMarks(OpuOmUser userForm,Page<CorrectMarkForm> page,
			CorrectMarkForm form, Map<String, Object> maps) {
		JSONObject json = new JSONObject();
		List<Map> list = new ArrayList<>();
		List<CorrectMarkForm> listCorr =  new ArrayList<>();
		List<LackMarkForm> listLack =  new ArrayList<>();
		List<Map> listMap = new ArrayList<>();
		if(userForm!=null&&userForm.getLoginName()!=null){
			Map<String,String> map = this.getFrom(userForm.getLoginName());
			if(map!=null&&map.containsKey("parentOrgName")){
				LackMarkForm lackForm = new LackMarkForm();
				if(map.containsKey("top")){//市级用户
					form.setIsAddFeature("2");
					lackForm.setIsAddFeature("2");
				}else{// 区级用户
					form.setIsAddFeature("2");
					form.setParentOrgId(map.get("parentOrgId"));
					lackForm.setIsAddFeature("2");
					lackForm.setParentOrgId(map.get("parentOrgId"));
				}
				listCorr = this.getListCorrect(form);
				listLack = lackMarkService.getListLack(lackForm);
			}
			if(listCorr!=null){
				listMap.addAll(CorrectMarkConvertor.convertFormToMap(listCorr));
				for(int i=0;i<listMap.size();i++){
					Map m = listMap.get(i);
					m.put("source", "correct");
				}
			}
			if(listLack!=null){
				List<Map> listLackMap = LackMarkConvertor.convertFormToMap(listLack);
				for(int i=0;i<listLackMap.size();i++){
					Map m = listLackMap.get(i);
					m.put("source", "lack");
				}
				listMap.addAll(listLackMap);
			}
			Collections.sort(list, new Comparator(){
				@Override
				public int compare(Object o1, Object o2) {
					Map<String, Object> m1 = (Map<String, Object>) o1;
					Map<String, Object> m2 = (Map<String, Object>) o2;
					if(m1.get("markTime") == null) return 1;
					if(m2.get("markTime") == null) return 1;
					return ( (Long)(m1.get("markTime")) > (Long)m2.get("markTime") ? -1 :
							(m1.get("markTime") == m2.get("markTime") ? 0 : 1));
				}
			});
			json.put("code", 200);
			json.put("data", list);
			json.put("total", list.size());
		}else{
			json.put("success", false);
		}
		return json.toString();
	}
	/**
	 * 根据图层数据条件查询附件
	 * @param objectId 
	 * */
	@Override
	public String toFeatureAttach(String path,String objectId, String reportType) {
		JSONObject json = new JSONObject();
		if(StringUtils.isNotBlank(reportType) && StringUtils.isNotBlank(objectId)){
			Page page = new Page();
			if("add".equals(reportType)){
				LackMarkForm form = new LackMarkForm();
				form.setObjectId(objectId);
				page = lackMarkService.searchFromAndMap(page, form, null);
				if(page.getResult()!=null&& page.getResult().size()>0){
					form = (LackMarkForm) page.getResult().get(0);
					json = JSONObject.fromObject(lackMarkService.seeLackMark(path, form.getId()));
					json.put("code", 200);
					return json.toString();
				}
			}
			if("confirm".equals(reportType) || "modify".equals(reportType)){
				CorrectMarkForm form = new CorrectMarkForm();
				form.setObjectId(objectId);
				page = this.searchFromAndMap(page, form, null);
				if(page.getResult()!=null && page.getResult().size()>0){
					form = (CorrectMarkForm) page.getResult().get(0);
					json = JSONObject.fromObject(this.seeCorrectMark(path,form.getId()));
					json.put("code", 200);
					return json.toString();
				}
			}
			json.put("message", "not result");
			return json.toString();
		}
		json.put("code", 300);
		json.put("message", "参数有误!");
		return json.toString();
	}
	/**
	 * 根据objectId查询id
	 * */
	@Override
	public String getFormId(String isCheck,CorrectMarkForm form) {
		JSONObject json = new JSONObject();
		if(StringUtils.isNotBlank(form.getObjectId())){
			if("modify".equals(isCheck)|| "confirm".equals(isCheck)){
				String hql="from CorrectMark ps where 1=1 and objectId="+form.getObjectId();
				List<CorrectMark> list =  correctMarkDao.find(hql);
				if(list!=null&& list.size()>0)
					json.put("data", list.get(0).getId());
			}else if("add".equals(isCheck)){
				String hql="from LackMark ps where 1=1 and objectId="+form.getObjectId();
				List<LackMark> list = lackMarkDao.find(hql);
				if(list!=null&& list.size()>0)
					json.put("data", list.get(0).getId());
			}
			json.put("success", true);
		}else{
			json.put("success", false);
		}
		return json.toString();
	}
	/**
	 * 根据objectId查询
	 * */
	@Override
	public String getFormByObjectId(String isCheck,CorrectMarkForm form) {
		JSONObject json = new JSONObject();
		if(StringUtils.isNotBlank(form.getObjectId())){
			if("modify".equals(isCheck)|| "confirm".equals(isCheck)){
				String hql="from CorrectMark ps where 1=1 and objectId="+form.getObjectId();
				List<CorrectMark> list =  correctMarkDao.find(hql);
				if(list!=null&& list.size()>0){
					json.put("success", true);
				}else {
					json.put("success", false);
				}
			}else if("add".equals(isCheck)){
				String hql="from LackMark ps where 1=1 and objectId="+form.getObjectId();
				List<LackMark> list = lackMarkDao.find(hql);
				if(list!=null&& list.size()>0){
					json.put("success", true);
				}else {
					String hql2="from PshLackMark ps where 1=1 and objectId="+form.getObjectId();
					List<PshLackMark> list2 = pshLackMarkDao.find(hql2);
					if(list2!=null&& list2.size()>0){
						json.put("success", true);
					}else {
						json.put("success", false);
					}
				}
			}else{
				String hql2="from PshLackMark ps where 1=1 and objectId="+form.getObjectId();
				List<PshLackMark> list2 = pshLackMarkDao.find(hql2);
				if(list2!=null&& list2.size()>0){
					json.put("success", true);
				}else {
					json.put("success", false);
				}
			}
		}else{
			json.put("success", false);
		}
		return json.toString();
	}
	
	/**TODO***************************************TODO**/
	/**
	 * 统计昨天或者今天的校核和新增
	 * @param  yestDay 是否是昨天
	 * */
	private List<Object> getCountDay(Boolean yestDay,Map map){
		String wheres = "";
		if(map!=null){
			if(map.containsKey("layerName")){
				wheres+=" and ps.LAYER_NAME like '%"+map.get("layerName").toString()+"%'";
			}
		}
		String sql = "select PARENT_ORG_NAME,"+
			"wm_concat( case typess when 'corr' then total else null end)corrCount, "+
			"wm_concat(case typess when 'lack' then total else null end) lackCount "+
			 "from (select PARENT_ORG_NAME,count(*) as total,'lack' as typess from DRI_PS_LACK_MARK ps where 1=1 "+
			 "and to_char(ps.mark_Time,'yyyyMMdd')=to_char(sysdate"+(yestDay?"-1":"")+",'yyyyMMdd') "+wheres+" GROUP BY PARENT_ORG_NAME UNION all "+
			 "select PARENT_ORG_NAME,count(*) as total,'corr' as typess from DRI_PS_CORRECT_MARK ps where 1=1 "+
			 "and to_char(ps.mark_Time,'yyyyMMdd')=to_char(sysdate"+(yestDay?"-1":"")+",'yyyyMMdd') "+wheres+" GROUP BY PARENT_ORG_NAME ) where parent_org_name is not null GROUP BY PARENT_ORG_NAME";
		
		return correctMarkDao.getSession().createSQLQuery(sql).list();
	}
	/**
	 * 查看全部功能修改，数据整合（事务公开功能）
	 * */
	public Object getPublicCountAll(Page pg,CorrectMarkForm form ,Map<String,Object> map,Class calzz){
		List<Map<String, Object>> listObj= new ArrayList<>();
		StringBuffer sql = null;
		if(map.get("usid") !=null && StringUtils.isNotBlank(map.get("usid").toString())) {
			sql = new StringBuffer("(select c.*,ROWNUM num from (select * from (select s.object_id,s.usid,s.ID,s.MARK_PERSON,s.MARK_PERSON_ID,s.MARK_TIME,'correct' as source,"
					+"s.UPDATE_TIME,s.PARENT_ORG_ID,s.PARENT_ORG_NAME,s.SUPERVISE_ORG_ID,s.SUPERVISE_ORG_NAME,s.DIRECT_ORG_ID,s.DIRECT_ORG_NAME,s.ADDR,s.LAYER_NAME,s.CORRECT_TYPE from DRI_PS_CORRECT_MARK s "
					+"UNION all select s1.object_id,s1.usid,s1.ID,s1.MARK_PERSON,s1.MARK_PERSON_ID,s1.MARK_TIME,'lack' as source,"
					+"s1.UPDATE_TIME,s1.PARENT_ORG_ID,s1.PARENT_ORG_NAME,s1.SUPERVISE_ORG_ID,s1.SUPERVISE_ORG_NAME,s1.DIRECT_ORG_ID,s1.DIRECT_ORG_NAME,s1.ADDR,s1.COMPONENT_TYPE,'数据确认' as CORRECT_TYPE from DRI_PS_LACK_MARK s1 ) b "
					+"order by b.mark_time desc) c where 1=1");// and c.parent_org_name not like '%市水务局%'
			sql.append(" and c.usid = '"+map.get("usid")+"'");
		}else {
			sql = new StringBuffer("(select c.*,ROWNUM num from (select * from (select s.ID,s.MARK_PERSON,s.MARK_PERSON_ID,s.MARK_TIME,'correct' as source,"
					+"s.UPDATE_TIME,s.PARENT_ORG_ID,s.PARENT_ORG_NAME,s.SUPERVISE_ORG_ID,s.SUPERVISE_ORG_NAME,s.DIRECT_ORG_ID,s.DIRECT_ORG_NAME,s.ADDR,s.LAYER_NAME,s.CORRECT_TYPE from DRI_PS_CORRECT_MARK s "
					+"UNION all select s1.ID,s1.MARK_PERSON,s1.MARK_PERSON_ID,s1.MARK_TIME,'lack' as source,"
					+"s1.UPDATE_TIME,s1.PARENT_ORG_ID,s1.PARENT_ORG_NAME,s1.SUPERVISE_ORG_ID,s1.SUPERVISE_ORG_NAME,s1.DIRECT_ORG_ID,s1.DIRECT_ORG_NAME,s1.ADDR,s1.COMPONENT_TYPE,'数据确认' as CORRECT_TYPE from DRI_PS_LACK_MARK s1 ) b "
					+"order by b.mark_time desc) c where 1=1 and c.parent_org_name not like '%市水务局%'");

			if(StringUtils.isNotBlank(form.getParentOrgId())){  //业主单位
				sql.append(" and c.parent_org_id = '"+form.getParentOrgId()+"'");
			}
			if(StringUtils.isNotBlank(form.getParentOrgName())){  //业主单位
				sql.append(" and c.parent_org_name like '%"+form.getParentOrgName()+"%'");
			}
		}
		if(StringUtils.isNotBlank(form.getMarkPersonId())){
			sql.append(" and c.mark_person_id = '"+form.getMarkPersonId()+"'");
		}
		if(StringUtils.isNotBlank(form.getMarkPerson())){
			sql.append(" and c.mark_person like '%"+form.getMarkPerson()+"%'");
		}
		if(map.get("objectId") !=null && StringUtils.isNotBlank(map.get("objectId").toString())){
			sql.append(" and c.object_id = '"+map.get("objectId")+"'");
		}
		if(map.get("usid")!=null && StringUtils.isNotBlank(map.get("usid").toString())){
			sql.append(" and c.usid = '"+map.get("usid")+"'");
		}
		if(StringUtils.isNotBlank(form.getParentOrgId())){  //业主单位
			sql.append(" and c.parent_org_id = '"+form.getParentOrgId()+"'");
		}
		if(StringUtils.isNotBlank(form.getParentOrgName())){  //业主单位
			sql.append(" and c.parent_org_name like '%"+form.getParentOrgName()+"%'");
		}
		if(StringUtils.isNotBlank(form.getLayerName())){   //设施类型
			sql.append(" and c.layer_name like '%"+form.getLayerName()+"%'");
		}
		if(map!=null){
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			if(map.get("startTime")!=null && map.get("endTime")!=null){
				sql.append(" and to_char(c.mark_time,'yyyy-MM-dd hh24:mi:ss') >='"+df.format((Date)map.get("startTime"))+"'");
				sql.append(" and to_char(c.mark_time,'yyyy-MM-dd hh24:mi:ss') <= '"+df.format((Date)map.get("endTime"))+"'");
			}
		}
		sql.append(") v where 1=1");
		if(calzz!=null){
			if(calzz.equals(Long.class)){
				sql.insert(0, "select v.source,count(v.source) as total from ");
				sql.append(" GROUP BY v.source");
				/*if(map.containsKey("source")&&map.get("source")!=null){
					sql.append(" and v.source='"+map.get("source").toString()+"'");
				}*/
				List<Map<String,Object>> maps = jdbcTemplate.queryForList(sql.toString());
				//Long total = jdbcTemplate.queryForObject(sql.toString(), Long.class);
				return maps;
			}else if(calzz.equals(List.class)){
				if(pg!=null){
					sql.insert(0, "select * from ");
					int pageNo=pg!=null? (pg.getPageNo()>1? 1+pg.getPageSize()*(pg.getPageNo()-1) : 1):1;
					int pageSize = pg!=null? pg.getPageSize()*pg.getPageNo() : 15;
					sql.append(" and num>="+pageNo+" and num<="+pageSize);
				}
				listObj= jdbcTemplate.queryForList(sql.toString());
				return listObj;
			}
		}
		return  null;
	}
	/**
	 * 查询用户上报过的道路数据
	 **/
	@Override
	public List<Map<String,Object>> countRoad(Map<String, Object> map){
		Map values = new HashMap<>();
		StringBuffer hql = new StringBuffer("select * from(select s.road from (select s.road,count(*) as total from CorrectMark s where 1=1 ");
		if(map.containsKey("personUserId")&&map.get("personUserId")!=null){
			hql.append(" and s.person_User_Id = "+map.get("personUserId"));
		}
		if(map.containsKey("road")&&map.get("road")!=null){
			hql.append(" and s.road like '%"+map.get("road")+"%'");
		}
		hql.append(" GROUP BY s.road)s order by s.total desc) where rownum<=15");
		return correctMarkDao.getSession().createSQLQuery(hql.toString()).list();
		
	} 
	/**
	 * 定时器执行查询更新失败数据并更新到上报图层表中
	 * */
	@Override
	public LackMarkForm getLackForm(Long id) {
		return lackMarkService.get(id);
	}
	@Override
	public void save(LackMarkForm lackForm) {
		lackMarkService.save(lackForm);
	}
	/**
	 * 根据ObjId查询信息
	 */
	@Override
	public CorrectMarkForm getFormByObjId(String ObjId) {
		StringBuffer hql = new StringBuffer("from CorrectMark ps where 1=1 ");
		Map<String,Object> values = new HashMap<String,Object>();
		if(StringUtils.isNotBlank(ObjId)){
			hql.append(" and ps.objectId = :ObjId");
			values.put("ObjId", ObjId);
		}
		List<CorrectMark> list = correctMarkDao.find(hql.toString(), values);
		if(list != null && list.size()>0){
			return CorrectMarkConvertor.convertVoToForm(list.get(0));
		}
		return null;
	}
	
	
	/**
	 * pc端的上报页面查询应开未开井
	 * */
	public String searchNotCorrectPage(OpuOmUser userForm,Page<CorrectMarkForm> page,
			CorrectMarkForm form, Map<String, Object> map){
		JSONObject json = new JSONObject();
		List<Map> list = new ArrayList<>();
		Map  value=new HashMap();
		StringBuffer hql = new StringBuffer("select w.usid,w.ownerdept,w.addr,w.sort,w.material ,w.objectid,w.district "  
				+" from sde.ps_well_zy_ss w where w.usid not in ( "
				+" select b.usid from CorrectMark b where 1=1 "
			);
		hql.append(" ) and  w.district is not null  and  w.district <> ' ' ");
		if (form!=null ) {
			if(StringUtils.isNotBlank(form.getParentOrgName())){
				hql.append(" and w.district  like '"+form.getParentOrgName().substring(0, 2)+"%'");
			}
		}
		hql.append(" order by w.district desc ");
		String sql =SqlPageUtils.getPageSql(page, hql.toString());//带上分页
		SQLQuery query = lackMarkDao.createSQLQuery(sql,value);
		List<Object[]> resultlist = query.list();
		Long count=lackMarkDao.countSqlResult( hql.toString(), value);
		//封装成对象
		for(Object[] obj : resultlist){
			Map mp = new HashMap<>();
			mp.put("usid", obj[1]);
			mp.put("ownerdept", obj[2]);
			mp.put("addr",  obj[3]);
			mp.put("sort",  obj[4]);
			mp.put("material",  obj[5]);
			mp.put("objectid",  obj[6]);
			mp.put("district",  obj[7]);
			list.add(mp);
		}
		json.put("rows", list);
		json.put("total", count);
		json.put("code", 200);
		return json.toString();
	}
	
	/**
	 * pc端的导出全部数据到excel
	 * */
	public List<Object[]> getExcelData(CorrectMarkForm form){
		JSONObject json = new JSONObject();
		List<Map> list = new ArrayList<>();
		Map  value=new HashMap();
		StringBuffer hql = new StringBuffer("select w.usid,w.district,w.ownerdept,w.addr,w.sort,w.material ,w.objectid  "  
				+" from sde.ps_well_zy_ss w where w.usid not in ( "
				+" select b.usid from CorrectMark b where 1=1 "
			);		
		hql.append(" )  and w.district is not null  and  w.district <> ' ' ");
		if (form!=null ) {
			if(StringUtils.isNotBlank(form.getParentOrgName())){
				hql.append(" and w.district  like '"+form.getParentOrgName().substring(0, 2)+"%'");
			}
		}
		hql.append(" order by w.district desc ");
		SQLQuery query = lackMarkDao.createSQLQuery(hql.toString(),value);
		List<Object[]> resultlist = query.list();
		if (resultlist!=null) {
			return resultlist;
		}
		return null;
	}
	
	/**
	 * 删除已开井
	 * */
	public int delCorrected(){
		StringBuffer hql = new StringBuffer("delete  from sde.ps_well_zy_ss w where w.usid  in ( "
				+" select b.usid from CorrectMark b where 1=1 ) ");
		int count = lackMarkDao.createSQLQuery(hql.toString()).executeUpdate();
		return count;
	}
}
