package com.augurit.awater.dri.psh.basic.convert;

import com.augurit.awater.dri.psh.basic.entity.ExShuiwuPopHouseForm;
import com.augurit.awater.dri.psh.basic.web.form.ExShuiwuPopHouseFormForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class ExShuiwuPopHouseFormConvertor {
	public static ExShuiwuPopHouseFormForm convertVoToForm(ExShuiwuPopHouseForm entity) {
		if(entity != null) {
			ExShuiwuPopHouseFormForm form = new ExShuiwuPopHouseFormForm();
			form.setPopulationId(entity.getPopulationId());
			form.setHouseId(entity.getHouseId());
			form.setName(entity.getName());
			form.setPopulationType(entity.getPopulationType());
			form.setId(entity.getId());
			form.setIsexist(entity.getIsexist());
			form.setIsrecorded(entity.getIsrecorded());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(ExShuiwuPopHouseFormForm form, ExShuiwuPopHouseForm entity) {
		if(entity != null && form != null) {
			if(form.getPopulationId() != null && form.getPopulationId().trim().length() > 0)
				entity.setPopulationId(form.getPopulationId().trim());
			if(form.getHouseId() != null && form.getHouseId().trim().length() > 0)
				entity.setHouseId(form.getHouseId().trim());
			if(form.getName() != null && form.getName().trim().length() > 0)
				entity.setName(form.getName().trim());
			if(form.getPopulationType() != null && form.getPopulationType().trim().length() > 0)
				entity.setPopulationType(form.getPopulationType().trim());
			entity.setId(form.getId());
			entity.setIsexist(form.getIsexist());
			entity.setIsrecorded(form.getIsrecorded());
		}
	}
	
	public static List<ExShuiwuPopHouseFormForm> convertVoListToFormList(List<ExShuiwuPopHouseForm> exShuiwuPopHouseFormList) {
		if(exShuiwuPopHouseFormList != null && exShuiwuPopHouseFormList.size() > 0) {
			List<ExShuiwuPopHouseFormForm> exShuiwuPopHouseFormFormList = new ArrayList();
			for(int i=0; i<exShuiwuPopHouseFormList.size(); i++) {
				exShuiwuPopHouseFormFormList.add(convertVoToForm(exShuiwuPopHouseFormList.get(i)));
			}
			return exShuiwuPopHouseFormFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<ExShuiwuPopHouseForm> exShuiwuPopHouseFormList) {
		if(exShuiwuPopHouseFormList != null && exShuiwuPopHouseFormList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<exShuiwuPopHouseFormList.size(); i++) {
				ExShuiwuPopHouseForm entity = exShuiwuPopHouseFormList.get(i);
				Map map = new HashMap();

				map.put("populationId", entity.getPopulationId());
				map.put("houseId", entity.getHouseId());
				map.put("name", entity.getName());
				map.put("populationType", entity.getPopulationType());
				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("isexist", entity.getIsexist());
				map.put("isrecorded", entity.getIsrecorded());
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<ExShuiwuPopHouseForm> convertFormListToVoList(List<ExShuiwuPopHouseFormForm> exShuiwuPopHouseFormFormList) {
		if(exShuiwuPopHouseFormFormList != null && exShuiwuPopHouseFormFormList.size() > 0) {
			List<ExShuiwuPopHouseForm> exShuiwuPopHouseFormList = new ArrayList();
			for(int i=0; i<exShuiwuPopHouseFormFormList.size(); i++) {
				ExShuiwuPopHouseForm exShuiwuPopHouseForm = new ExShuiwuPopHouseForm();
				convertFormToVo(exShuiwuPopHouseFormFormList.get(i), exShuiwuPopHouseForm);
				exShuiwuPopHouseFormList.add(exShuiwuPopHouseForm);
			}
			return exShuiwuPopHouseFormList;
		}
		return null;
	}
}