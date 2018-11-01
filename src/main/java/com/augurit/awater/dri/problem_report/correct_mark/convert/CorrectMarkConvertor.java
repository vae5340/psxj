package com.augurit.awater.dri.problem_report.correct_mark.convert;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.augurit.awater.dri.problem_report.correct_mark.entity.CorrectMark;
import com.augurit.awater.dri.problem_report.correct_mark.web.form.CorrectMarkForm;

public class CorrectMarkConvertor {
	public static CorrectMarkForm convertVoToForm(CorrectMark entity) {
		if(entity != null) {
			CorrectMarkForm form = new CorrectMarkForm();
			form.setId(entity.getId());
			form.setMarkPersonId(entity.getMarkPersonId());
			form.setMarkPerson(entity.getMarkPerson());
			form.setMarkTime(entity.getMarkTime());
			form.setDescription(entity.getDescription());
			form.setLayerName(entity.getLayerName());
			form.setUsid(entity.getUsid());
			form.setTeamOrgId(entity.getTeamOrgId());
			form.setTeamOrgName(entity.getTeamOrgName());
			form.setDirectOrgId(entity.getDirectOrgId());
			form.setDirectOrgName(entity.getDirectOrgName());
			form.setParentOrgId(entity.getParentOrgId());
			form.setParentOrgName(entity.getParentOrgName());
			form.setSuperviseOrgId(entity.getSuperviseOrgId());
			form.setSuperviseOrgName(entity.getSuperviseOrgName());
			form.setCorrectType(entity.getCorrectType());
			form.setAttrOne(entity.getAttrOne());
			form.setAttrThree(entity.getAttrThree());
			form.setAttrTwo(entity.getAttrTwo());
			form.setAttrFour(entity.getAttrFour());
			form.setAttrFive(entity.getAttrFive());
			form.setRoad(entity.getRoad());
			form.setAddr(entity.getAddr());
			form.setX(entity.getX());
			form.setY(entity.getY());
			form.setLayerUrl(entity.getLayerUrl());
			form.setUpdateTime(entity.getUpdateTime());
			form.setAddrLatest(entity.getAddrLatest());
			form.setCoox(entity.getCoox());
			form.setCooy(entity.getCooy());
			form.setObjectId(entity.getObjectId());
			form.setIsAddFeature(entity.getIsAddFeature());
			
			form.setCheckState(entity.getCheckState());
			form.setCheckPerson(entity.getCheckPerson());
			form.setCheckPersonId(entity.getCheckPersonId());
			form.setCheckTime(entity.getCheckTime());
			form.setCheckDesription(entity.getCheckDesription());
			
			form.setReportType(entity.getReportType());
			form.setUserX(entity.getUserx());
			form.setUserY(entity.getUsery());
			form.setUserAddr(entity.getUserAddr());
			form.setOriginAddr(entity.getOriginAddr());
			form.setOriginRoad(entity.getOriginRoad());
			form.setOrginY(entity.getOrginy());
			form.setOrginX(entity.getOrginx());
			form.setOriginAttrOne(entity.getOriginAttrOne());
			form.setOriginAttrTwo(entity.getOriginAttrTwo());
			form.setOriginAttrThree(entity.getOriginAttrThree());
			form.setOriginAttrFour(entity.getOriginAttrFour());
			form.setOriginAttrFive(entity.getOriginAttrFive());
			
			form.setPersonUserId(entity.getPersonUserId());
			form.setPcode(entity.getPcode());
			form.setChildCode(entity.getChildCode());
			form.setCityVillage(entity.getCityVillage());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(CorrectMarkForm form, CorrectMark entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			if(form.getMarkPersonId() != null && form.getMarkPersonId().trim().length() > 0)
				entity.setMarkPersonId(form.getMarkPersonId().trim());
			if(form.getMarkPerson() != null && form.getMarkPerson().trim().length() > 0)
				entity.setMarkPerson(form.getMarkPerson().trim());
			if(form.getMarkTime()!=null)
				entity.setMarkTime(form.getMarkTime());
			//if(form.getDescription() != null && form.getDescription().trim().length() > 0)
			entity.setDescription(form.getDescription());
			if(form.getLayerName() != null && form.getLayerName().trim().length() > 0)
				entity.setLayerName(form.getLayerName().trim());
			if(form.getUsid() != null && form.getUsid().trim().length() > 0)
				entity.setUsid(form.getUsid().trim());
			if(form.getTeamOrgId() != null && form.getTeamOrgId().trim().length() > 0)
				entity.setTeamOrgId(form.getTeamOrgId().trim());
			if(form.getTeamOrgName() != null && form.getTeamOrgName().trim().length() > 0)
				entity.setTeamOrgName(form.getTeamOrgName().trim());
			if(form.getDirectOrgId() != null && form.getDirectOrgId().trim().length() > 0)
				entity.setDirectOrgId(form.getDirectOrgId().trim());
			if(form.getDirectOrgName() != null && form.getDirectOrgName().trim().length() > 0)
				entity.setDirectOrgName(form.getDirectOrgName().trim());
			if(form.getParentOrgId() != null && form.getParentOrgId().trim().length() > 0)
				entity.setParentOrgId(form.getParentOrgId().trim());
			if(form.getParentOrgName() != null && form.getParentOrgName().trim().length() > 0)
				entity.setParentOrgName(form.getParentOrgName().trim());
			if(form.getSuperviseOrgId()!= null && form.getSuperviseOrgId().trim().length() > 0)
				entity.setSuperviseOrgId(form.getSuperviseOrgId().trim());
			if(form.getSuperviseOrgName()!= null && form.getSuperviseOrgName().trim().length() > 0)
				entity.setSuperviseOrgName(form.getSuperviseOrgName().trim());
			if(form.getCorrectType()!= null && form.getCorrectType().trim().length() > 0)
				entity.setCorrectType(form.getCorrectType().trim());
			//if(form.getAttrOne()!= null && form.getAttrOne().trim().length() > 0)
			entity.setAttrOne(form.getAttrOne());
			//if(form.getAttrTwo()!= null && form.getAttrTwo().trim().length() > 0)
			entity.setAttrTwo(form.getAttrTwo());
			//if(form.getAttrThree()!= null && form.getAttrThree().trim().length() > 0)
			entity.setAttrThree(form.getAttrThree());
			//if(form.getAttrFour()!= null && form.getAttrFour().trim().length() > 0)
			entity.setAttrFour(form.getAttrFour());
			//if(form.getAttrFive()!= null && form.getAttrFive().trim().length() > 0)
			entity.setAttrFive(form.getAttrFive());
			if(form.getRoad()!= null && form.getRoad().trim().length() > 0)
				entity.setRoad(form.getRoad().trim());
			if(form.getAddr()!= null && form.getAddr().trim().length() > 0)
				entity.setAddr(form.getAddr().trim());
			if(form.getX()!=null)
				entity.setX(form.getX());
			if(form.getY()!=null)	
				entity.setY(form.getY());
			if(form.getLayerUrl()!= null && form.getLayerUrl().trim().length() > 0)
				entity.setLayerUrl(form.getLayerUrl().trim());
			if(form.getUpdateTime()!=null)
				entity.setUpdateTime(form.getUpdateTime());
			if(form.getAddrLatest()!= null && form.getAddrLatest().trim().length() > 0)
				entity.setAddrLatest(form.getAddrLatest().trim());
			if(form.getCoox()!=null)
				entity.setCoox(form.getCoox());
			if(form.getCooy()!=null)
				entity.setCooy(form.getCooy());
			if(form.getIsAddFeature()!= null && form.getIsAddFeature().trim().length() > 0)
				entity.setIsAddFeature(form.getIsAddFeature().trim());
			
			if(form.getCheckState()!= null && form.getCheckState().trim().length() > 0)
				entity.setCheckState(form.getCheckState().trim());
			entity.setCheckPerson(form.getCheckPerson());
			entity.setCheckPersonId(form.getCheckPersonId());
			entity.setCheckTime(form.getCheckTime());
			entity.setCheckDesription(form.getCheckDesription());
			if(form.getObjectId()!= null && form.getObjectId().trim().length() > 0)
				entity.setObjectId(form.getObjectId().trim());
			
			if(form.getReportType()!=null  && form.getReportType().trim().length() > 0)
				entity.setReportType(form.getReportType().trim());
			if(form.getUserX()!=null)
				entity.setUserx(form.getUserX());
			if(form.getUserY()!=null)
				entity.setUsery(form.getUserY());
			if(form.getUserAddr()!=null  && form.getUserAddr().trim().length() > 0)
				entity.setUserAddr(form.getUserAddr().trim());
			if(form.getOriginAddr()!=null  && form.getOriginAddr().trim().length() > 0)
				entity.setOriginAddr(form.getOriginAddr().trim());
			if(form.getOriginRoad()!=null  && form.getOriginRoad().trim().length() > 0)
				entity.setOriginRoad(form.getOriginRoad().trim());
			if(form.getOrginY()!=null )
				entity.setOrginy(form.getOrginY());
			if(form.getOrginX()!=null )
				entity.setOrginx(form.getOrginX());
			if(form.getOriginAttrOne()!=null  && form.getOriginAttrOne().trim().length() > 0)
				entity.setOriginAttrOne(form.getOriginAttrOne().trim());
			if(form.getOriginAttrTwo()!=null  && form.getOriginAttrTwo().trim().length() > 0)
				entity.setOriginAttrTwo(form.getOriginAttrTwo().trim());
			if(form.getOriginAttrThree()!=null  && form.getOriginAttrThree().trim().length() > 0)
				entity.setOriginAttrThree(form.getOriginAttrThree().trim());
			if(form.getOriginAttrFour()!=null  && form.getOriginAttrFour().trim().length() > 0)
				entity.setOriginAttrFour(form.getOriginAttrFour().trim());
			if(form.getOriginAttrFive()!=null  && form.getOriginAttrFive().trim().length() > 0)
				entity.setOriginAttrFive(form.getOriginAttrFive().trim());
			if(form.getPersonUserId()!=null)
				entity.setPersonUserId(form.getPersonUserId());
			entity.setPcode(form.getPcode());
	    	entity.setChildCode(form.getChildCode());
	    	entity.setCityVillage(form.getCityVillage());
				
		}
	}
	
	public static List<CorrectMarkForm> convertVoListToFormList(List<CorrectMark> correctMarkList) {
		if(correctMarkList != null && correctMarkList.size() > 0) {
			List<CorrectMarkForm> correctMarkFormList = new ArrayList();
			for(int i=0; i<correctMarkList.size(); i++) {
				correctMarkFormList.add(convertVoToForm(correctMarkList.get(i)));
			}
			return correctMarkFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<CorrectMark> correctMarkList) {
		if(correctMarkList != null && correctMarkList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<correctMarkList.size(); i++) {
				CorrectMark entity = correctMarkList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("markPersonId", entity.getMarkPersonId());
				map.put("markPerson", entity.getMarkPerson());
				map.put("markTime", entity.getMarkTime());
				map.put("description", entity.getDescription());
				map.put("layerName", entity.getLayerName());
				map.put("usid", entity.getUsid());
				map.put("teamOrgId", entity.getTeamOrgId());
				map.put("teamOrgName", entity.getTeamOrgName());
				map.put("directOrgId", entity.getDirectOrgId());
				map.put("directOrgName", entity.getDirectOrgName());
				map.put("parentOrgId", entity.getParentOrgId());
				map.put("parentOrgName", entity.getParentOrgName());
				map.put("superviseOrgId", entity.getSuperviseOrgId());
				map.put("superviseOrgName", entity.getSuperviseOrgName());
				map.put("correctType", entity.getCorrectType());
				map.put("attrOne", entity.getAttrOne());
				map.put("attrTwo", entity.getAttrTwo());
				map.put("attrThree", entity.getAttrThree());
				map.put("attrFour", entity.getAttrFour());
				map.put("attrFive", entity.getAttrFive());
				map.put("road", entity.getRoad());
				map.put("addr", entity.getAddr());
				map.put("x", entity.getX());
				map.put("y", entity.getY());
				map.put("layerUrl", entity.getLayerUrl());
				map.put("updateTime", entity.getUpdateTime());
				map.put("addrLatest", entity.getAddrLatest());
				map.put("coox", entity.getCoox());
				map.put("cooy", entity.getCooy());
				
				map.put("isAddFeature", entity.getIsAddFeature());
				
				map.put("checkState", entity.getCheckState());
				map.put("checkPerson", entity.getCheckPerson());
				map.put("checkPersonId", entity.getCheckPersonId());
				map.put("checkTime", entity.getCheckTime());
				map.put("checkDesription", entity.getCheckDesription());
				map.put("objectId", entity.getObjectId());
				
				map.put("reportType", entity.getReportType());
				map.put("userX", entity.getUserx());
				map.put("userY", entity.getUsery());
				map.put("userAddr", entity.getUserAddr());
				map.put("originAddr", entity.getOriginAddr());
				map.put("originRoad", entity.getOriginRoad());
				map.put("orginx", entity.getOrginx());
				map.put("orginy", entity.getOrginy());
				map.put("originAttrOne", entity.getOriginAttrOne());
				map.put("originAttrTwo", entity.getOriginAttrTwo());
				map.put("originAttrThree", entity.getOriginAttrThree());
				map.put("originAttrFour", entity.getOriginAttrFour());
				map.put("originAttrFive", entity.getOriginAttrFive());
				
				map.put("personUserId", entity.getPersonUserId());
				map.put("pcode", entity.getPcode());
				map.put("childCode", entity.getChildCode());
				map.put("cityVillage", entity.getCityVillage());
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<CorrectMark> convertFormListToVoList(List<CorrectMarkForm> correctMarkFormList) {
		if(correctMarkFormList != null && correctMarkFormList.size() > 0) {
			List<CorrectMark> correctMarkList = new ArrayList();
			for(int i=0; i<correctMarkFormList.size(); i++) {
				CorrectMark correctMark = new CorrectMark();
				convertFormToVo(correctMarkFormList.get(i), correctMark);
				correctMarkList.add(correctMark);
			}
			return correctMarkList;
		}
		return null;
	}

	/**
	 * 移动端日期转成long
	 * */
	public static Map convertFormToMap(CorrectMarkForm form) {
		Map map = new HashMap();
		map.put("id", form.getId() == null ? "" : form.getId().toString());
		map.put("markPersonId", form.getMarkPersonId());
		map.put("markPerson", form.getMarkPerson());
		map.put("markTime", form.getMarkTime()!=null?form.getMarkTime().getTime():null);
		map.put("description", form.getDescription());
		map.put("layerName", form.getLayerName());
		map.put("usid", form.getUsid());
		map.put("teamOrgId", form.getTeamOrgId());
		map.put("teamOrgName", form.getTeamOrgName());
		map.put("directOrgId", form.getDirectOrgId());
		map.put("directOrgName", form.getDirectOrgName());
		map.put("parentOrgId", form.getParentOrgId());
		map.put("parentOrgName", form.getParentOrgName());
		map.put("superviseOrgId", form.getSuperviseOrgId());
		map.put("superviseOrgName", form.getSuperviseOrgName());
		map.put("correctType", form.getCorrectType());
		map.put("attrOne", form.getAttrOne());
		map.put("attrTwo", form.getAttrTwo());
		map.put("attrThree", form.getAttrThree());
		map.put("attrFour", form.getAttrFour());
		map.put("attrFive", form.getAttrFive());
		map.put("road", form.getRoad());
		map.put("addr", form.getAddr());
		map.put("x", form.getX());
		map.put("y", form.getY());
		map.put("layerUrl", form.getLayerUrl());
		map.put("updateTime", form.getUpdateTime()!=null? form.getUpdateTime().getTime():null);
		map.put("addrLatest", form.getAddrLatest());
		map.put("coox", form.getCoox());
		map.put("cooy", form.getCooy());
		
		map.put("isAddFeature", form.getIsAddFeature());
		
		map.put("checkState", form.getCheckState());
		map.put("checkPerson", form.getCheckPerson());
		map.put("checkPersonId", form.getCheckPersonId());
		map.put("checkTime", form.getCheckTime());
		map.put("checkDesription", form.getCheckDesription());
		map.put("objectId", form.getObjectId());
		
		map.put("reportType", form.getReportType());
		map.put("userX", form.getUserX());
		map.put("userY", form.getUserY());
		map.put("userAddr", form.getUserAddr());
		map.put("originAddr", form.getOriginAddr());
		map.put("originRoad", form.getOriginRoad());
		map.put("orginX", form.getOrginX());
		map.put("orginY", form.getOrginY());
		map.put("originAttrOne", form.getOriginAttrOne());
		map.put("originAttrTwo", form.getOriginAttrTwo());
		map.put("originAttrThree", form.getOriginAttrThree());
		map.put("originAttrFour", form.getOriginAttrFour());
		map.put("originAttrFive", form.getOriginAttrFive());
		map.put("personUserId", form.getPersonUserId());
		map.put("pcode", form.getPcode());
		map.put("childCode", form.getChildCode());
		map.put("cityVillage", form.getCityVillage());
		return map;
	}
	public static List<Map> convertFormToMap(List<CorrectMarkForm> list) {
		List<Map> listMap = new ArrayList<>();
		for(CorrectMarkForm form :list){
			Map map = new HashMap();
			map.put("id", form.getId() == null ? "" : form.getId().toString());
			map.put("markPersonId", form.getMarkPersonId());
			map.put("markPerson", form.getMarkPerson());
			map.put("markTime", form.getMarkTime()!=null?form.getMarkTime().getTime():null);
			map.put("description", form.getDescription());
			map.put("layerName", form.getLayerName());
			map.put("usid", form.getUsid());
			map.put("teamOrgId", form.getTeamOrgId());
			map.put("teamOrgName", form.getTeamOrgName());
			map.put("directOrgId", form.getDirectOrgId());
			map.put("directOrgName", form.getDirectOrgName());
			map.put("parentOrgId", form.getParentOrgId());
			map.put("parentOrgName", form.getParentOrgName());
			map.put("superviseOrgId", form.getSuperviseOrgId());
			map.put("superviseOrgName", form.getSuperviseOrgName());
			map.put("correctType", form.getCorrectType());
			map.put("attrOne", form.getAttrOne());
			map.put("attrTwo", form.getAttrTwo());
			map.put("attrThree", form.getAttrThree());
			map.put("attrFour", form.getAttrFour());
			map.put("attrFive", form.getAttrFive());
			map.put("road", form.getRoad());
			map.put("addr", form.getAddr());
			map.put("x", form.getX());
			map.put("y", form.getY());
			map.put("layerUrl", form.getLayerUrl());
			map.put("updateTime", form.getUpdateTime()!=null? form.getUpdateTime().getTime():null);
			map.put("addrLatest", form.getAddrLatest());
			map.put("coox", form.getCoox());
			map.put("cooy", form.getCooy());
			
			map.put("isAddFeature", form.getIsAddFeature());
			
			map.put("checkState", form.getCheckState());
			map.put("checkPerson", form.getCheckPerson());
			map.put("checkPersonId", form.getCheckPersonId());
			map.put("checkTime", form.getCheckTime());
			map.put("checkDesription", form.getCheckDesription());
			map.put("objectId", form.getObjectId());
			
			map.put("reportType", form.getReportType());
			map.put("userX", form.getUserX());
			map.put("userY", form.getUserY());
			map.put("userAddr", form.getUserAddr());
			map.put("originAddr", form.getOriginAddr());
			map.put("originRoad", form.getOriginRoad());
			map.put("orginX", form.getOrginX());
			map.put("orginY", form.getOrginY());
			map.put("originAttrOne", form.getOriginAttrOne());
			map.put("originAttrTwo", form.getOriginAttrTwo());
			map.put("originAttrThree", form.getOriginAttrThree());
			map.put("originAttrFour", form.getOriginAttrFour());
			map.put("originAttrFive", form.getOriginAttrFive());
			map.put("personUserId", form.getPersonUserId());
			map.put("pcode", form.getPcode());
			map.put("childCode", form.getChildCode());
			map.put("cityVillage", form.getCityVillage());
			listMap.add(map);
		}
		return listMap;
	}
}