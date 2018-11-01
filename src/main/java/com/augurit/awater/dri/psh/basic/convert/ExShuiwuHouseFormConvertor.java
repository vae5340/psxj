package com.augurit.awater.dri.psh.basic.convert;

import com.augurit.awater.dri.psh.basic.entity.ExShuiwuHouseForm;
import com.augurit.awater.dri.psh.basic.web.form.ExShuiwuHouseFormForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class ExShuiwuHouseFormConvertor {
	public static ExShuiwuHouseFormForm convertVoToForm(ExShuiwuHouseForm entity) {
		if(entity != null) {
			ExShuiwuHouseFormForm form = new ExShuiwuHouseFormForm();
			form.setId(entity.getId());
			form.setGridCode(entity.getGridCode());
			form.setExtSystemid(entity.getExtSystemid());
			form.setHousebuildId(entity.getHousebuildId());
			form.setDoorplateId(entity.getDoorplateId());
			form.setRoomNo(entity.getRoomNo());
			form.setAddress(entity.getAddress());
			form.setHouseProperty(entity.getHouseProperty());
			form.setHouseCategory(entity.getHouseCategory());
			form.setHouseType(entity.getHouseType());
			form.setUseWay(entity.getUseWay());
			form.setRealUseWay(entity.getRealUseWay());
			form.setBuildArea(entity.getBuildArea());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(ExShuiwuHouseFormForm form, ExShuiwuHouseForm entity) {
		if(entity != null && form != null) {
			if(form.getId() != null && form.getId().trim().length() > 0)
				entity.setId(form.getId().trim());
			if(form.getGridCode() != null && form.getGridCode().trim().length() > 0)
				entity.setGridCode(form.getGridCode().trim());
			if(form.getExtSystemid() != null && form.getExtSystemid().trim().length() > 0)
				entity.setExtSystemid(form.getExtSystemid().trim());
			if(form.getHousebuildId() != null && form.getHousebuildId().trim().length() > 0)
				entity.setHousebuildId(form.getHousebuildId().trim());
			if(form.getDoorplateId() != null && form.getDoorplateId().trim().length() > 0)
				entity.setDoorplateId(form.getDoorplateId().trim());
			if(form.getRoomNo() != null && form.getRoomNo().trim().length() > 0)
				entity.setRoomNo(form.getRoomNo().trim());
			if(form.getAddress() != null && form.getAddress().trim().length() > 0)
				entity.setAddress(form.getAddress().trim());
			if(form.getHouseProperty() != null && form.getHouseProperty().trim().length() > 0)
				entity.setHouseProperty(form.getHouseProperty().trim());
			if(form.getHouseCategory() != null && form.getHouseCategory().trim().length() > 0)
				entity.setHouseCategory(form.getHouseCategory().trim());
			if(form.getHouseType() != null && form.getHouseType().trim().length() > 0)
				entity.setHouseType(form.getHouseType().trim());
			if(form.getUseWay() != null && form.getUseWay().trim().length() > 0)
				entity.setUseWay(form.getUseWay().trim());
			if(form.getRealUseWay() != null && form.getRealUseWay().trim().length() > 0)
				entity.setRealUseWay(form.getRealUseWay().trim());
			entity.setBuildArea(form.getBuildArea());
		}
	}
	
	public static List<ExShuiwuHouseFormForm> convertVoListToFormList(List<ExShuiwuHouseForm> exShuiwuHouseFormList) {
		if(exShuiwuHouseFormList != null && exShuiwuHouseFormList.size() > 0) {
			List<ExShuiwuHouseFormForm> exShuiwuHouseFormFormList = new ArrayList();
			for(int i=0; i<exShuiwuHouseFormList.size(); i++) {
				exShuiwuHouseFormFormList.add(convertVoToForm(exShuiwuHouseFormList.get(i)));
			}
			return exShuiwuHouseFormFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<ExShuiwuHouseForm> exShuiwuHouseFormList) {
		if(exShuiwuHouseFormList != null && exShuiwuHouseFormList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<exShuiwuHouseFormList.size(); i++) {
				ExShuiwuHouseForm entity = exShuiwuHouseFormList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId());
				map.put("gridCode", entity.getGridCode());
				map.put("extSystemid", entity.getExtSystemid());
				map.put("housebuildId", entity.getHousebuildId());
				map.put("doorplateId", entity.getDoorplateId());
				map.put("roomNo", entity.getRoomNo());
				map.put("address", entity.getAddress());
				map.put("houseProperty", entity.getHouseProperty());
				map.put("houseCategory", entity.getHouseCategory());
				map.put("houseType", entity.getHouseType());
				map.put("useWay", entity.getUseWay());
				map.put("realUseWay", entity.getRealUseWay());
				map.put("buildArea", entity.getBuildArea() == null ? "" : entity.getBuildArea().toString());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<ExShuiwuHouseForm> convertFormListToVoList(List<ExShuiwuHouseFormForm> exShuiwuHouseFormFormList) {
		if(exShuiwuHouseFormFormList != null && exShuiwuHouseFormFormList.size() > 0) {
			List<ExShuiwuHouseForm> exShuiwuHouseFormList = new ArrayList();
			for(int i=0; i<exShuiwuHouseFormFormList.size(); i++) {
				ExShuiwuHouseForm exShuiwuHouseForm = new ExShuiwuHouseForm();
				convertFormToVo(exShuiwuHouseFormFormList.get(i), exShuiwuHouseForm);
				exShuiwuHouseFormList.add(exShuiwuHouseForm);
			}
			return exShuiwuHouseFormList;
		}
		return null;
	}
	
}