package com.augurit.awater.bpm.xcyh.report.web.form;

import com.augurit.awater.bpm.xcyh.report.domain.GxProblemReport;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;



public class GxProblemReportConvertor {
	public static GxProblemReportForm convertVoToForm(GxProblemReport entity) {
		if(entity != null) {
			GxProblemReportForm form = new GxProblemReportForm();
			form.setId(entity.getId());
			form.setFjzd(entity.getFjzd());
			form.setSzwz(entity.getSzwz());
			form.setX(entity.getX());
			form.setY(entity.getY());
			form.setJdmc(entity.getJdmc());
			form.setBhlx(entity.getBhlx());
			form.setSslx(entity.getSslx());
			form.setJjcd(entity.getJjcd());
			form.setWtms(entity.getWtms());
			form.setSbsj(entity.getSbsj());
			form.setSbr(entity.getSbr());
			form.setYjgcl(entity.getYjgcl());
			form.setBz(entity.getBz());
			form.setLayerId(entity.getLayerId());
			form.setLayerName(entity.getLayerName());
			form.setObjectId(entity.getObjectId());
			form.setTeamOrgId(entity.getTeamOrgId());
			form.setTeamOrgName(entity.getTeamOrgName());
			form.setDirectOrgId(entity.getDirectOrgId());
			form.setDirectOrgName(entity.getDirectOrgName());
			form.setSuperviseOrgId(entity.getSuperviseOrgId());
			form.setSuperviseOrgName(entity.getSuperviseOrgName());
			form.setParentOrgId(entity.getParentOrgId());
			form.setParentOrgName(entity.getParentOrgName());
			
			form.setUsid(entity.getUsid());
			form.setLayerurl(entity.getLayerurl());
			form.setReportx(entity.getReportx());
			form.setReporty(entity.getReporty());
			form.setReportaddr(entity.getReportaddr());
			form.setLoginname(entity.getLoginname());
			form.setSjwcsj(entity.getSjwcsj());
			form.setYjwcsj(entity.getYjwcsj());
			form.setSfjb(String.valueOf(entity.getSfjb()));
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(GxProblemReportForm form, GxProblemReport entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			if(form.getFjzd() != null && form.getFjzd().trim().length() > 0)
				entity.setFjzd(form.getFjzd().trim());
			entity.setSzwz(form.getSzwz());
			entity.setX(form.getX());
			entity.setY(form.getY());
			entity.setJdmc(form.getJdmc());
			if(form.getBhlx() != null && form.getBhlx().trim().length() > 0)
				entity.setBhlx(form.getBhlx().trim());
			if(form.getSslx() != null && form.getSslx().trim().length() > 0)
				entity.setSslx(form.getSslx().trim());
			if(form.getJjcd() != null && form.getJjcd().trim().length() > 0)
				entity.setJjcd(form.getJjcd().trim());
			if(form.getWtms() != null && form.getWtms().trim().length() > 0)
				entity.setWtms(form.getWtms().trim());
			entity.setSbsj(form.getSbsj()!=null?new Timestamp(form.getSbsj().getTime()):null);
			if(form.getSbr() != null && form.getSbr().trim().length() > 0)
				entity.setSbr(form.getSbr().trim());
			if(form.getYjgcl() != null && form.getYjgcl().trim().length() > 0)
				entity.setYjgcl(form.getYjgcl().trim());
			entity.setBz(form.getBz());
			entity.setLayerId(form.getLayerId());
			if(form.getLayerName() != null && form.getLayerName().trim().length() > 0)
				entity.setLayerName(form.getLayerName().trim());
			if(form.getObjectId() != null && form.getObjectId().trim().length() > 0)
				entity.setObjectId(form.getObjectId().trim());
			if(form.getTeamOrgId() != null && form.getTeamOrgId().trim().length() > 0)
				entity.setTeamOrgId(form.getTeamOrgId().trim());
			if(form.getTeamOrgName() != null && form.getTeamOrgName().trim().length() > 0)
				entity.setTeamOrgName(form.getTeamOrgName().trim());
			if(form.getDirectOrgId() != null && form.getDirectOrgId().trim().length() > 0)
				entity.setDirectOrgId(form.getDirectOrgId().trim());
			if(form.getDirectOrgName() != null && form.getDirectOrgName().trim().length() > 0)
				entity.setDirectOrgName(form.getDirectOrgName().trim());
			if(form.getSuperviseOrgId() != null && form.getSuperviseOrgId().trim().length() > 0)
				entity.setSuperviseOrgId(form.getSuperviseOrgId().trim());
			if(form.getSuperviseOrgName() != null && form.getSuperviseOrgName().trim().length() > 0)
				entity.setSuperviseOrgName(form.getSuperviseOrgName().trim());
			if(form.getParentOrgId() != null && form.getParentOrgId().trim().length() > 0)
				entity.setParentOrgId(form.getParentOrgId().trim());
			if(form.getParentOrgName() != null && form.getParentOrgName().trim().length() > 0)
				entity.setParentOrgName(form.getParentOrgName().trim());
			entity.setUsid(form.getUsid());
			entity.setLayerurl(form.getLayerurl());
			entity.setReportx(form.getReportx());
			entity.setReporty(form.getReporty());
			entity.setReportaddr(form.getReportaddr());
			entity.setIsbyself(form.getIsbyself());
			if(form.getLoginname()!=null && form.getLoginname().trim().length()>0)
				entity.setLoginname(form.getLoginname());
			if(form.getSjwcsj() != null)
				entity.setSjwcsj(form.getSjwcsj());
			if(form.getYjwcsj() != null)
				entity.setYjwcsj(form.getYjwcsj());
			if(form.getSfjb() != null && form.getSfjb().trim().length() > 0)
				entity.setSfjb(Integer.valueOf(form.getSfjb()));
		}
	}
	
	public static List<GxProblemReportForm> convertVoListToFormList(List<GxProblemReport> gxProblemReportList) {
		if(gxProblemReportList != null && gxProblemReportList.size() > 0) {
			List<GxProblemReportForm> gxProblemReportFormList = new ArrayList();
			for(int i=0; i<gxProblemReportList.size(); i++) {
				gxProblemReportFormList.add(convertVoToForm(gxProblemReportList.get(i)));
			}
			return gxProblemReportFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<GxProblemReport> gxProblemReportList) {
		if(gxProblemReportList != null && gxProblemReportList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<gxProblemReportList.size(); i++) {
				GxProblemReport entity = gxProblemReportList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("fjzd", entity.getFjzd());
				map.put("szwz", entity.getSzwz());
				map.put("x", entity.getX());
				map.put("y", entity.getY());
				map.put("jdmc", entity.getJdmc());
				map.put("bhlx", entity.getBhlx());
				map.put("sslx", entity.getSslx());
				map.put("jjcd", entity.getJjcd());
				map.put("wtms", entity.getWtms());
				map.put("sbsj", entity.getSbsj()!=null?entity.getSbsj().getTime():0);
				map.put("sbr", entity.getSbr());
				map.put("yjgcl", entity.getYjgcl());
				map.put("bz", entity.getBz());
				map.put("layerId", entity.getLayerId() == null ? "" : entity.getLayerId().toString());
				map.put("layerName", entity.getLayerName());
				map.put("objectId", entity.getObjectId());
				map.put("teamOrgId", entity.getTeamOrgId());
				map.put("teamOrgName", entity.getTeamOrgName());
				map.put("directOrgId", entity.getDirectOrgId());
				map.put("directOrgName", entity.getDirectOrgName());
				map.put("superviseOrgId", entity.getSuperviseOrgId());
				map.put("superviseOrgName", entity.getSuperviseOrgName());
				map.put("parentOrgId", entity.getParentOrgId());
				map.put("parentOrgName", entity.getParentOrgName());
				map.put("sjwcsj", entity.getSjwcsj());
				map.put("yjwcsj", entity.getYjgcl());
				map.put("sfjb", entity.getSfjb());
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	public static List<Map<String,Object>> convertFormVoListToMapList(List<GxProblemReportForm> gxProblemReportList) {
		if(gxProblemReportList != null && gxProblemReportList.size() > 0) {
			List<Map<String,Object>> mapList = new ArrayList();
			for(int i=0; i<gxProblemReportList.size(); i++) {
				GxProblemReportForm entity = gxProblemReportList.get(i);
				Map<String,Object> map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("fjzd", entity.getFjzd());
				map.put("szwz", entity.getSzwz());
				map.put("x", entity.getX());
				map.put("y", entity.getY());
				map.put("jdmc", entity.getJdmc());
				map.put("bhlx", entity.getBhlx());
				map.put("sslx", entity.getSslx());
				map.put("jjcd", entity.getJjcd());
				map.put("wtms", entity.getWtms());
				map.put("sbsj", entity.getSbsj()!=null?entity.getSbsj().getTime():0);
				map.put("sbr", entity.getSbr());
				map.put("yjgcl", entity.getYjgcl());
				map.put("bz", entity.getBz());
				map.put("layerId", entity.getLayerId() == null ? "" : entity.getLayerId().toString());
				map.put("layerName", entity.getLayerName());
				map.put("objectId", entity.getObjectId());
				map.put("teamOrgId", entity.getTeamOrgId());
				map.put("teamOrgName", entity.getTeamOrgName());
				map.put("directOrgId", entity.getDirectOrgId());
				map.put("directOrgName", entity.getDirectOrgName());
				map.put("superviseOrgId", entity.getSuperviseOrgId());
				map.put("superviseOrgName", entity.getSuperviseOrgName());
				map.put("parentOrgId", entity.getParentOrgId());
				map.put("parentOrgName", entity.getParentOrgName());
				map.put("sjwcsj", entity.getSjwcsj());
				map.put("yjwcsj", entity.getYjgcl());
				map.put("sfjb", entity.getSfjb());
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	public static Map convertVoListToMap(GxProblemReportForm entity) {
		if(entity!=null){
			Map map = new HashMap();
			map.put("id", entity.getId() == null ? "" : entity.getId().toString());
			map.put("fjzd", entity.getFjzd());
			map.put("szwz", entity.getSzwz());
			map.put("x", entity.getX());
			map.put("y", entity.getY());
			map.put("jdmc", entity.getJdmc());
			map.put("bhlx", entity.getBhlx());
			map.put("sslx", entity.getSslx());
			map.put("jjcd", entity.getJjcd());
			map.put("wtms", entity.getWtms());
			map.put("sbsj", entity.getSbsj()!=null?entity.getSbsj().getTime():0);
			map.put("sbr", entity.getSbr());
			map.put("yjgcl", entity.getYjgcl());
			map.put("bz", entity.getBz());
			map.put("layerId", entity.getLayerId() == null ? "" : entity.getLayerId().toString());
			map.put("layerName", entity.getLayerName());
			map.put("objectId", entity.getObjectId());
			map.put("teamOrgId", entity.getTeamOrgId());
			map.put("teamOrgName", entity.getTeamOrgName());
			map.put("directOrgId", entity.getDirectOrgId());
			map.put("directOrgName", entity.getDirectOrgName());
			map.put("superviseOrgId", entity.getSuperviseOrgId());
			map.put("superviseOrgName", entity.getSuperviseOrgName());
			map.put("parentOrgId", entity.getParentOrgId());
			map.put("parentOrgName", entity.getParentOrgName());
			map.put("sjwcsj", entity.getSjwcsj());
			map.put("yjwcsj", entity.getYjgcl());
			map.put("sfjb", entity.getSfjb());
			return map;
		}
		return null;
	}

	public static List<GxProblemReport> convertFormListToVoList(List<GxProblemReportForm> gxProblemReportFormList) {
		if(gxProblemReportFormList != null && gxProblemReportFormList.size() > 0) {
			List<GxProblemReport> gxProblemReportList = new ArrayList();
			for(int i=0; i<gxProblemReportFormList.size(); i++) {
				GxProblemReport gxProblemReport = new GxProblemReport();
				convertFormToVo(gxProblemReportFormList.get(i), gxProblemReport);
				gxProblemReportList.add(gxProblemReport);
			}
			return gxProblemReportList;
		}
		return null;
	}
	
	public static List<GxProblemReportForm> convertWfVoToWfForm(List list) {
		List<GxProblemReportForm> result = new ArrayList<GxProblemReportForm>();
		GxProblemReportForm gxForm=null ;
		 for(Iterator iterator = list.iterator(); iterator.hasNext();result.add(gxForm))
         {
             Object objs[] = (Object[])iterator.next();
             GxProblemReport gx = (GxProblemReport)objs[0];
             String state = (String)objs[1];
             Date signTime = (Date)objs[2];
             String templateCode = (String)objs[3];
             Long histTaskInstDbid = (Long)objs[4];
             String activityName = (String)objs[5];
             String activityChineseName = (String)objs[6];
             
             gxForm=convertVoToForm(gx);
             if (gxForm!=null) {
            	 gxForm.setState(state);
            	 gxForm.setSignTime(signTime);
            	 gxForm.setTemplateCode(templateCode);
            	 gxForm.setHistTaskInstDbid(histTaskInstDbid);
            	 gxForm.setActivityName(activityName);
            	 gxForm.setActivityChineseName(activityChineseName);
             }
         }
		 return result;
	}

	public static List<GxEventList> convertVoToEventForm(List<Map<String,Object>> list) throws ParseException {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		List<GxEventList> enentList = new ArrayList<>();
		if(list!=null && list.size()>0){
			for(Map<String,Object> map : list){
				GxEventList event = new GxEventList();
				event.setActivityChineseName(String.valueOf(map.get("TASK_CODE")));
				event.setActivityName(String.valueOf(map.get("TASK_NAME")));
				event.setAddr(String.valueOf(map.get("SZWZ")));
				event.setRoad(String.valueOf(map.get("JDMC")));
				event.setTaskInstDbid(String.valueOf(map.get("TASK_ID")));
				if(map.get("CU_TASK_ID")!=null) //实时taskId
					event.setTaskInstDbid(String.valueOf(map.get("CU_TASK_ID")));
				event.setUpTtaskInstDbid(String.valueOf(map.get("UP_TASK_ID")));
				event.setProcInstDbId(String.valueOf(map.get("PROC_INST_ID")));
				if(map.get("SBSJ")!=null)
					event.setReportTime(map.get("SBSJ")!=null ?format.parse(String.valueOf(map.get("SBSJ"))).getTime():0);
				if(map.get("START_TIME_")!=null)
					event.setHanleTime(map.get("START_TIME_")!=null ?format.parse(String.valueOf(map.get("START_TIME_"))).getTime():0);
				event.setMasterEntityKey(String.valueOf(map.get("ID")));
				event.setComponentType(String.valueOf(map.get("SSLX")));
				event.setEventType(String.valueOf(map.get("BHLX")));
				event.setDescription(String.valueOf(map.get("WTMS")));
				event.setReportUser(String.valueOf(map.get("SBR")));
				event.setState(String.valueOf(map.get("STATE")));
				if(map.get("ISBYSELF")!=null && "true".equals(String.valueOf(map.get("ISBYSELF")))){
					event.setActivityName("自行处理");
				}
				enentList.add(event);
			}
			return enentList;
		}
		return null;
	}
	public static List<GxEventList> convertEventsVoToEventForm(List<GxProblemReportForm> list) throws ParseException {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		List<GxEventList> enentList = new ArrayList<>();
		if(list!=null && list.size()>0){
			for(GxProblemReportForm map : list){
				GxEventList event = new GxEventList();
				event.setActivityName(String.valueOf(map.getActivityName()));
				event.setAddr(String.valueOf(map.getSzwz()));
				event.setRoad(String.valueOf(map.getJdmc()));
				event.setReportTime(map.getSbsj()!=null ?map.getSbsj().getTime():0);
				event.setMasterEntityKey(String.valueOf(map.getId()));
				event.setComponentType(String.valueOf(map.getBhlx()));
				event.setDescription(String.valueOf(map.getWtms()));
				event.setReportUser(String.valueOf(map.getSbr()));
				enentList.add(event);
			}
			return enentList;
		}
		return null;
	}

	public static DetailEventForm formToDetail(GxProblemReportForm gxForm){
		DetailEventForm de=new DetailEventForm();
		de.setTaskInstDbid(gxForm.getTaskInstDbid());
		de.setAddr(gxForm.getSzwz());
		de.setComponentType(gxForm.getSslx());
		de.setDescription(gxForm.getWtms());
		de.setEventType(gxForm.getBhlx());
		de.setParentOrgId(gxForm.getParentOrgId());
		de.setParentOrgName(gxForm.getParentOrgName());
		de.setIsbyself(gxForm.getIsbyself());
		de.setYjwcsj(gxForm.getYjwcsj() == null ? 0 : gxForm.getYjwcsj().getTime());
		de.setSfjb(gxForm.getSfjb());
		de.setFiles(gxForm.getFiles2());
		de.setRemark(gxForm.getBz());
		de.setRoad(gxForm.getJdmc());
		de.setTime(gxForm.getSbsj()==null?0:gxForm.getSbsj().getTime());
		de.setUrgency(gxForm.getJjcd());
		de.setUserName(gxForm.getSbr());
		de.setSbOrg(gxForm.getParentOrgName());
		de.setX(gxForm.getX());
		de.setY(gxForm.getY());
		de.setUsid(gxForm.getUsid());
		de.setLayerurl(gxForm.getLayerurl());
		de.setReportx(gxForm.getReportx());
		de.setReporty(gxForm.getReporty());
		de.setReportaddr(gxForm.getReportaddr());

		de.setLayerId(gxForm.getLayerId());
		de.setLayerName(gxForm.getLayerName());
		de.setObjectId(gxForm.getObjectId());
		de.setReportId(gxForm.getId());
		return de;
	}
}