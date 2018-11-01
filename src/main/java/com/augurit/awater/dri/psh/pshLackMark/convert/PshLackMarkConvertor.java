package com.augurit.awater.dri.psh.pshLackMark.convert;

import com.augurit.awater.dri.psh.pshLackMark.entity.PshLackMark;
import com.augurit.awater.dri.psh.pshLackMark.web.form.PshLackMarkForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PshLackMarkConvertor {
	public static PshLackMarkForm convertVoToForm(PshLackMark entity) {
		if(entity != null) {
			PshLackMarkForm form = new PshLackMarkForm();
			form.setParentOrgId(entity.getParentOrgId());
			form.setParentOrgName(entity.getParentOrgName());
			form.setId(entity.getId());
			form.setMarkPersonId(entity.getMarkPersonId());
			form.setMarkPerson(entity.getMarkPerson());
			form.setMarkTime(entity.getMarkTime());
			form.setDescription(entity.getDescription());
			form.setComponentType(entity.getComponentType());
			form.setRoad(entity.getRoad());
			form.setAddr(entity.getAddr());
			form.setX(entity.getX());
			form.setY(entity.getY());
			form.setTeamOrgId(entity.getTeamOrgId());
			form.setTeamOrgName(entity.getTeamOrgName());
			form.setDirectOrgId(entity.getDirectOrgId());
			form.setDirectOrgName(entity.getDirectOrgName());
			form.setSuperviseOrgId(entity.getSuperviseOrgId());
			form.setSuperviseOrgName(entity.getSuperviseOrgName());
			form.setAttrOne(entity.getAttrOne());
			form.setAttrTwo(entity.getAttrTwo());
			form.setAttrThree(entity.getAttrThree());
			form.setAttrFour(entity.getAttrFour());
			form.setAttrFive(entity.getAttrFive());
			form.setUpdateTime(entity.getUpdateTime());
			form.setLayerName(entity.getLayerName());
			form.setUsid(entity.getUsid());
			form.setIsBinding(entity.getIsBinding());
			
			form.setIsAddFeature(entity.getIsAddFeature());
			
			form.setCheckState(entity.getCheckState());
			form.setCheckPerson(entity.getCheckPerson());
			form.setCheckPersonId(entity.getCheckPersonId());
			form.setCheckTime(entity.getCheckTime());
			form.setCheckDesription(entity.getCheckDesription());
			form.setObjectId(entity.getObjectId());
			
			form.setUserX(entity.getUserx());
			form.setUserY(entity.getUsery());
			form.setUserAddr(entity.getUserAddr());
			form.setPersonUserId(entity.getPersonUserId());
			form.setPcode(entity.getPcode());
			form.setChildCode(entity.getChildCode());
			form.setCityVillage(entity.getCityVillage());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(PshLackMarkForm form, PshLackMark entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			if(form.getParentOrgId() != null && form.getParentOrgId().trim().length() > 0)
				entity.setParentOrgId(form.getParentOrgId().trim());
			if(form.getParentOrgName() != null && form.getParentOrgName().trim().length() > 0)
				entity.setParentOrgName(form.getParentOrgName().trim());
			if(form.getMarkPersonId() != null && form.getMarkPersonId().trim().length() > 0)
				entity.setMarkPersonId(form.getMarkPersonId().trim());
			if(form.getMarkPerson() != null && form.getMarkPerson().trim().length() > 0)
				entity.setMarkPerson(form.getMarkPerson().trim());
			if(form.getMarkTime()!=null){
				entity.setMarkTime(form.getMarkTime());
			}
			//if(form.getDescription() != null && form.getDescription().trim().length() > 0)
			entity.setDescription(form.getDescription());
			if(form.getComponentType() != null && form.getComponentType().trim().length() > 0)
				entity.setComponentType(form.getComponentType().trim());
			if(form.getRoad() != null && form.getRoad().trim().length() > 0)
				entity.setRoad(form.getRoad().trim());
			if(form.getAddr() != null && form.getAddr().trim().length() > 0)
				entity.setAddr(form.getAddr().trim());
			if(form.getX()!=null){
				entity.setX(form.getX());
			}
			if(form.getY()!=null)
				entity.setY(form.getY());
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
			//if(form.getAttrOne() != null && form.getAttrOne().trim().length() > 0)
			entity.setAttrOne(form.getAttrOne());
			//if(form.getAttrTwo() != null && form.getAttrTwo().trim().length() > 0)
			entity.setAttrTwo(form.getAttrTwo());
			//if(form.getAttrThree() != null && form.getAttrThree().trim().length() > 0)
			entity.setAttrThree(form.getAttrThree());
			//if(form.getAttrFour() != null && form.getAttrFour().trim().length() > 0)
			entity.setAttrFour(form.getAttrFour());
			//if(form.getAttrFive() != null && form.getAttrFive().trim().length() > 0)
			entity.setAttrFive(form.getAttrFive());
			entity.setUpdateTime(form.getUpdateTime());
			
			if(form.getLayerName() != null && form.getLayerName().trim().length() > 0)
				entity.setLayerName(form.getLayerName().trim());
			if(form.getUsid() != null && form.getUsid().trim().length() > 0)
				entity.setUsid(form.getUsid().trim());
			if(form.getIsBinding() != null && form.getIsBinding().trim().length() > 0)
				entity.setIsBinding(form.getIsBinding().trim());
			
			if(form.getIsAddFeature() != null && form.getIsAddFeature().trim().length() > 0)
				entity.setIsAddFeature(form.getIsAddFeature().trim());
			
			if(form.getCheckState()!= null && form.getCheckState().trim().length() > 0)
				entity.setCheckState(form.getCheckState().trim());
			if(form.getCheckPerson()!= null && form.getCheckPerson().trim().length() > 0)
				entity.setCheckPerson(form.getCheckPerson().trim());
			if(form.getCheckPersonId()!= null && form.getCheckPersonId().trim().length() > 0)
				entity.setCheckPersonId(form.getCheckPersonId().trim());
			entity.setCheckTime(form.getCheckTime());
			if(form.getCheckDesription()!= null && form.getCheckDesription().trim().length() > 0)
				entity.setCheckDesription(form.getCheckDesription().trim());
			if(form.getObjectId()!= null && form.getObjectId().trim().length() > 0)
				entity.setObjectId(form.getObjectId().trim());
			if(form.getUserX()!=null)
				entity.setUserx(form.getUserX());
			if(form.getUserY()!=null)
				entity.setUsery(form.getUserY());
			if(form.getUserAddr()!=null)
				entity.setUserAddr(form.getUserAddr());
			if(form.getPersonUserId()!=null)
				entity.setPersonUserId(form.getPersonUserId());
			entity.setPcode(form.getPcode());
			entity.setChildCode(form.getChildCode());
			entity.setCityVillage(form.getCityVillage());
		}
	}
	
	public static List<PshLackMarkForm> convertVoListToFormList(List<PshLackMark> PshLackMarkList) {
		if(PshLackMarkList != null && PshLackMarkList.size() > 0) {
			List<PshLackMarkForm> PshLackMarkFormList = new ArrayList();
			for(int i=0; i<PshLackMarkList.size(); i++) {
				PshLackMarkFormList.add(convertVoToForm(PshLackMarkList.get(i)));
			}
			return PshLackMarkFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<PshLackMark> PshLackMarkList) {
		if(PshLackMarkList != null && PshLackMarkList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<PshLackMarkList.size(); i++) {
				PshLackMark entity = PshLackMarkList.get(i);
				Map map = new HashMap();

				map.put("parentOrgId", entity.getParentOrgId());
				map.put("parentOrgName", entity.getParentOrgName());
				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("markPersonId", entity.getMarkPersonId());
				map.put("markPerson", entity.getMarkPerson());
				map.put("markTime", entity.getMarkTime());
				map.put("description", entity.getDescription());
				map.put("componentType", entity.getComponentType());
				map.put("road", entity.getRoad());
				map.put("addr", entity.getAddr());
				map.put("x", entity.getX());
				map.put("y", entity.getY());
				map.put("teamOrgId", entity.getTeamOrgId());
				map.put("teamOrgName", entity.getTeamOrgName());
				map.put("directOrgId", entity.getDirectOrgId());
				map.put("directOrgName", entity.getDirectOrgName());
				map.put("superviseOrgId", entity.getSuperviseOrgId());
				map.put("superviseOrgName", entity.getSuperviseOrgName());
				map.put("attrOne", entity.getAttrOne());
				map.put("attrTwo", entity.getAttrTwo());
				map.put("attrThree", entity.getAttrThree());
				map.put("attrFour", entity.getAttrFour());
				map.put("attrFive", entity.getAttrFive());
				map.put("updateTime", entity.getUpdateTime());
				
				map.put("layerName", entity.getLayerName());
				map.put("usid", entity.getUsid());
				map.put("isBinding", entity.getIsBinding());

				map.put("isAddFeature", entity.getIsAddFeature());
				
				map.put("checkState", entity.getCheckState());
				map.put("checkPerson", entity.getCheckPerson());
				map.put("checkPersonId", entity.getCheckPersonId());
				map.put("checkTime", entity.getCheckTime());
				map.put("checkDesription", entity.getCheckDesription());
				map.put("objectId", entity.getObjectId());
				
				map.put("userX", entity.getUserx());
				map.put("userY", entity.getUsery());
				map.put("userAddr", entity.getUserAddr());
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
	
	public static List<PshLackMark> convertFormListToVoList(List<PshLackMarkForm> PshLackMarkFormList) {
		if(PshLackMarkFormList != null && PshLackMarkFormList.size() > 0) {
			List<PshLackMark> PshLackMarkList = new ArrayList();
			for(int i=0; i<PshLackMarkFormList.size(); i++) {
				PshLackMark PshLackMark = new PshLackMark();
				convertFormToVo(PshLackMarkFormList.get(i), PshLackMark);
				PshLackMarkList.add(PshLackMark);
			}
			return PshLackMarkList;
		}
		return null;
	}
	
	/**
	 * 移动端日期转成long
	 * */
	public static Map convertFormToMap(PshLackMarkForm form) {
		Map map = new HashMap();
		map.put("parentOrgId", form.getParentOrgId());
		map.put("parentOrgName", form.getParentOrgName());
		map.put("id", form.getId() == null ? "" : form.getId().toString());
		map.put("markPersonId", form.getMarkPersonId());
		map.put("markPerson", form.getMarkPerson());
		map.put("markTime", form.getMarkTime()!=null? form.getMarkTime().getTime():null);
		map.put("description", form.getDescription());
		map.put("componentType", form.getComponentType());
		map.put("road", form.getRoad());
		map.put("addr", form.getAddr());
		map.put("x", form.getX());
		map.put("y", form.getY());
		map.put("teamOrgId", form.getTeamOrgId());
		map.put("teamOrgName", form.getTeamOrgName());
		map.put("directOrgId", form.getDirectOrgId());
		map.put("directOrgName", form.getDirectOrgName());
		map.put("superviseOrgId", form.getSuperviseOrgId());
		map.put("superviseOrgName", form.getSuperviseOrgName());
		map.put("attrOne", form.getAttrOne());
		map.put("attrTwo", form.getAttrTwo());
		map.put("attrThree", form.getAttrThree());
		map.put("attrFour", form.getAttrFour());
		map.put("attrFive", form.getAttrFive());
		map.put("updateTime", form.getUpdateTime()!=null?form.getUpdateTime().getTime():null);
		
		map.put("layerName", form.getLayerName());
		map.put("usid", form.getUsid());
		map.put("isBinding", form.getIsBinding());
		
		map.put("isAddFeature", form.getIsAddFeature());
		
		map.put("checkState", form.getCheckState());
		map.put("checkPerson", form.getCheckPerson());
		map.put("checkPersonId", form.getCheckPersonId());
		map.put("checkTime", form.getCheckTime());
		map.put("checkDesription", form.getCheckDesription());
		map.put("objectId", form.getObjectId());
		
		map.put("userX", form.getUserX());
		map.put("userY", form.getUserY());
		map.put("userAddr", form.getUserAddr());
		map.put("personUserId", form.getPersonUserId());
		map.put("pcode", form.getPcode());
		map.put("childCode", form.getChildCode());
		map.put("cityVillage", form.getCityVillage());
		return map;
	}
	public static List<Map> convertFormToMap(List<PshLackMarkForm> list) {
		List<Map> listMap = new ArrayList<>();
		for(PshLackMarkForm form :list){
			Map map = new HashMap();
			map.put("parentOrgId", form.getParentOrgId());
			map.put("parentOrgName", form.getParentOrgName());
			map.put("id", form.getId() == null ? "" : form.getId().toString());
			map.put("markPersonId", form.getMarkPersonId());
			map.put("markPerson", form.getMarkPerson());
			map.put("markTime", form.getMarkTime()!=null? form.getMarkTime().getTime():null);
			map.put("description", form.getDescription());
			map.put("componentType", form.getComponentType());
			map.put("road", form.getRoad());
			map.put("addr", form.getAddr());
			map.put("x", form.getX());
			map.put("y", form.getY());
			map.put("teamOrgId", form.getTeamOrgId());
			map.put("teamOrgName", form.getTeamOrgName());
			map.put("directOrgId", form.getDirectOrgId());
			map.put("directOrgName", form.getDirectOrgName());
			map.put("superviseOrgId", form.getSuperviseOrgId());
			map.put("superviseOrgName", form.getSuperviseOrgName());
			map.put("attrOne", form.getAttrOne());
			map.put("attrTwo", form.getAttrTwo());
			map.put("attrThree", form.getAttrThree());
			map.put("attrFour", form.getAttrFour());
			map.put("attrFive", form.getAttrFive());
			map.put("updateTime", form.getUpdateTime()!=null?form.getUpdateTime().getTime():null);
			
			map.put("layerName", form.getLayerName());
			map.put("usid", form.getUsid());
			map.put("isBinding", form.getIsBinding());
			
			map.put("isAddFeature", form.getIsAddFeature());
			
			map.put("checkState", form.getCheckState());
			map.put("checkPerson", form.getCheckPerson());
			map.put("checkPersonId", form.getCheckPersonId());
			map.put("checkTime", form.getCheckTime());
			map.put("checkDesription", form.getCheckDesription());
			map.put("objectId", form.getObjectId());
			
			map.put("userX", form.getUserX());
			map.put("userY", form.getUserY());
			map.put("userAddr", form.getUserAddr());
			map.put("personUserId", form.getPersonUserId());
			map.put("pcode", form.getPcode());
			map.put("childCode", form.getChildCode());
			map.put("cityVillage", form.getCityVillage());
			listMap.add(map);
		}
		return listMap;
	}
}