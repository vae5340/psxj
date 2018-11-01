package com.augurit.awater.dri.psh.basic.convert;

import com.augurit.awater.dri.psh.basic.entity.ExShuiwuHousebuildForm;
import com.augurit.awater.dri.psh.basic.web.form.ExShuiwuHousebuildFormForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class ExShuiwuHousebuildFormConvertor {
	public static ExShuiwuHousebuildFormForm convertVoToForm(ExShuiwuHousebuildForm entity) {
		if(entity != null) {
			ExShuiwuHousebuildFormForm form = new ExShuiwuHousebuildFormForm();
			form.setCommittees(entity.getCommittees());
			form.setGridCode(entity.getGridCode());
			form.setRoadName(entity.getRoadName());
			form.setDoorplateNumber(entity.getDoorplateNumber());
			form.setHouseProperty(entity.getHouseProperty());
			form.setStructure(entity.getStructure());
			form.setType(entity.getType());
			form.setHouseType(entity.getHouseType());
			form.setHouseUse(entity.getHouseUse());
			form.setFloor(entity.getFloor());
			form.setSets(entity.getSets());
			form.setFloorUp(entity.getFloorUp());
			form.setFloorDown(entity.getFloorDown());
			form.setId(entity.getId());
			form.setDoorplateId(entity.getDoorplateId());
			form.setDoorplateAddressCode(entity.getDoorplateAddressCode());
			form.setCommunity(entity.getCommunity());
			form.setRoad(entity.getRoad());
			form.setPoliceStation(entity.getPoliceStation());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(ExShuiwuHousebuildFormForm form, ExShuiwuHousebuildForm entity) {
		if(entity != null && form != null) {
			if(form.getCommittees() != null && form.getCommittees().trim().length() > 0)
				entity.setCommittees(form.getCommittees().trim());
			if(form.getGridCode() != null && form.getGridCode().trim().length() > 0)
				entity.setGridCode(form.getGridCode().trim());
			if(form.getRoadName() != null && form.getRoadName().trim().length() > 0)
				entity.setRoadName(form.getRoadName().trim());
			if(form.getDoorplateNumber() != null && form.getDoorplateNumber().trim().length() > 0)
				entity.setDoorplateNumber(form.getDoorplateNumber().trim());
			if(form.getHouseProperty() != null && form.getHouseProperty().trim().length() > 0)
				entity.setHouseProperty(form.getHouseProperty().trim());
			if(form.getStructure() != null && form.getStructure().trim().length() > 0)
				entity.setStructure(form.getStructure().trim());
			if(form.getType() != null && form.getType().trim().length() > 0)
				entity.setType(form.getType().trim());
			if(form.getHouseType() != null && form.getHouseType().trim().length() > 0)
				entity.setHouseType(form.getHouseType().trim());
			if(form.getHouseUse() != null && form.getHouseUse().trim().length() > 0)
				entity.setHouseUse(form.getHouseUse().trim());
			entity.setFloor(form.getFloor());
			entity.setSets(form.getSets());
			entity.setFloorUp(form.getFloorUp());
			entity.setFloorDown(form.getFloorDown());
			if(form.getId() != null && form.getId().trim().length() > 0)
				entity.setId(form.getId().trim());
			if(form.getDoorplateId() != null && form.getDoorplateId().trim().length() > 0)
				entity.setDoorplateId(form.getDoorplateId().trim());
			if(form.getDoorplateAddressCode() != null && form.getDoorplateAddressCode().trim().length() > 0)
				entity.setDoorplateAddressCode(form.getDoorplateAddressCode().trim());
			if(form.getCommunity() != null && form.getCommunity().trim().length() > 0)
				entity.setCommunity(form.getCommunity().trim());
			if(form.getRoad() != null && form.getRoad().trim().length() > 0)
				entity.setRoad(form.getRoad().trim());
			if(form.getPoliceStation() != null && form.getPoliceStation().trim().length() > 0)
				entity.setPoliceStation(form.getPoliceStation().trim());
		}
	}
	
	public static List<ExShuiwuHousebuildFormForm> convertVoListToFormList(List<ExShuiwuHousebuildForm> exShuiwuHousebuildFormList) {
		if(exShuiwuHousebuildFormList != null && exShuiwuHousebuildFormList.size() > 0) {
			List<ExShuiwuHousebuildFormForm> exShuiwuHousebuildFormFormList = new ArrayList();
			for(int i=0; i<exShuiwuHousebuildFormList.size(); i++) {
				exShuiwuHousebuildFormFormList.add(convertVoToForm(exShuiwuHousebuildFormList.get(i)));
			}
			return exShuiwuHousebuildFormFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<ExShuiwuHousebuildForm> exShuiwuHousebuildFormList) {
		if(exShuiwuHousebuildFormList != null && exShuiwuHousebuildFormList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<exShuiwuHousebuildFormList.size(); i++) {
				ExShuiwuHousebuildForm entity = exShuiwuHousebuildFormList.get(i);
				Map map = new HashMap();

				map.put("committees", entity.getCommittees());
				map.put("gridCode", entity.getGridCode());
				map.put("roadName", entity.getRoadName());
				map.put("doorplateNumber", entity.getDoorplateNumber());
				map.put("houseProperty", entity.getHouseProperty());
				map.put("structure", entity.getStructure());
				map.put("type", entity.getType());
				map.put("houseType", entity.getHouseType());
				map.put("houseUse", entity.getHouseUse());
				map.put("floor", entity.getFloor() == null ? "" : entity.getFloor().toString());
				map.put("sets", entity.getSets() == null ? "" : entity.getSets().toString());
				map.put("floorUp", entity.getFloorUp() == null ? "" : entity.getFloorUp().toString());
				map.put("floorDown", entity.getFloorDown() == null ? "" : entity.getFloorDown().toString());
				map.put("id", entity.getId());
				map.put("doorplateId", entity.getDoorplateId());
				map.put("doorplateAddressCode", entity.getDoorplateAddressCode());
				map.put("community", entity.getCommunity());
				map.put("road", entity.getRoad());
				map.put("policeStation", entity.getPoliceStation());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<ExShuiwuHousebuildForm> convertFormListToVoList(List<ExShuiwuHousebuildFormForm> exShuiwuHousebuildFormFormList) {
		if(exShuiwuHousebuildFormFormList != null && exShuiwuHousebuildFormFormList.size() > 0) {
			List<ExShuiwuHousebuildForm> exShuiwuHousebuildFormList = new ArrayList();
			for(int i=0; i<exShuiwuHousebuildFormFormList.size(); i++) {
				ExShuiwuHousebuildForm exShuiwuHousebuildForm = new ExShuiwuHousebuildForm();
				convertFormToVo(exShuiwuHousebuildFormFormList.get(i), exShuiwuHousebuildForm);
				exShuiwuHousebuildFormList.add(exShuiwuHousebuildForm);
			}
			return exShuiwuHousebuildFormList;
		}
		return null;
	}
}