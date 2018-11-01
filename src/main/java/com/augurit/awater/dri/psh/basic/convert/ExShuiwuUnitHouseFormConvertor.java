package com.augurit.awater.dri.psh.basic.convert;

import com.augurit.awater.dri.psh.basic.entity.ExShuiwuUnitHouseForm;
import com.augurit.awater.dri.psh.basic.web.form.ExShuiwuUnitHouseFormForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class ExShuiwuUnitHouseFormConvertor {
	public static ExShuiwuUnitHouseFormForm convertVoToForm(ExShuiwuUnitHouseForm entity) {
		if(entity != null) {
			ExShuiwuUnitHouseFormForm form = new ExShuiwuUnitHouseFormForm();
			form.setUnitId(entity.getUnitId());
			form.setSocialCreditCode(entity.getSocialCreditCode());
			form.setHouseId(entity.getHouseId());
			form.setUnitType(entity.getUnitType());
			form.setName(entity.getName());
			form.setLegalRepresent(entity.getLegalRepresent());
			form.setAreaCode(entity.getAreaCode());
			form.setArea(entity.getArea());
			form.setRegisterStatu(entity.getRegisterStatu());
			form.setStatus(entity.getStatus());
			form.setIndustryType(entity.getIndustryType());
			form.setEconomicType(entity.getEconomicType());
			form.setBusinessScope(entity.getBusinessScope());
			form.setId(entity.getId());
			form.setIsexist(entity.getIsexist());
			form.setIsrecorded(entity.getIsrecorded());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(ExShuiwuUnitHouseFormForm form, ExShuiwuUnitHouseForm entity) {
		if(entity != null && form != null) {
			if(form.getUnitId() != null && form.getUnitId().trim().length() > 0)
				entity.setUnitId(form.getUnitId().trim());
			if(form.getSocialCreditCode() != null && form.getSocialCreditCode().trim().length() > 0)
				entity.setSocialCreditCode(form.getSocialCreditCode().trim());
			if(form.getHouseId() != null && form.getHouseId().trim().length() > 0)
				entity.setHouseId(form.getHouseId().trim());
			if(form.getUnitType() != null && form.getUnitType().trim().length() > 0)
				entity.setUnitType(form.getUnitType().trim());
			if(form.getName() != null && form.getName().trim().length() > 0)
				entity.setName(form.getName().trim());
			if(form.getLegalRepresent() != null && form.getLegalRepresent().trim().length() > 0)
				entity.setLegalRepresent(form.getLegalRepresent().trim());
			if(form.getAreaCode() != null && form.getAreaCode().trim().length() > 0)
				entity.setAreaCode(form.getAreaCode().trim());
			if(form.getArea() != null && form.getArea().trim().length() > 0)
				entity.setArea(form.getArea().trim());
			if(form.getRegisterStatu() != null && form.getRegisterStatu().trim().length() > 0)
				entity.setRegisterStatu(form.getRegisterStatu().trim());
			if(form.getStatus() != null && form.getStatus().trim().length() > 0)
				entity.setStatus(form.getStatus().trim());
			if(form.getIndustryType() != null && form.getIndustryType().trim().length() > 0)
				entity.setIndustryType(form.getIndustryType().trim());
			if(form.getEconomicType() != null && form.getEconomicType().trim().length() > 0)
				entity.setEconomicType(form.getEconomicType().trim());
			if(form.getBusinessScope() != null && form.getBusinessScope().trim().length() > 0)
				entity.setBusinessScope(form.getBusinessScope().trim());
			entity.setId(form.getId());
			entity.setIsexist(form.getIsexist());
			entity.setIsrecorded(form.getIsrecorded());
		}
	}
	
	public static List<ExShuiwuUnitHouseFormForm> convertVoListToFormList(List<ExShuiwuUnitHouseForm> exShuiwuUnitHouseFormList) {
		if(exShuiwuUnitHouseFormList != null && exShuiwuUnitHouseFormList.size() > 0) {
			List<ExShuiwuUnitHouseFormForm> exShuiwuUnitHouseFormFormList = new ArrayList();
			for(int i=0; i<exShuiwuUnitHouseFormList.size(); i++) {
				exShuiwuUnitHouseFormFormList.add(convertVoToForm(exShuiwuUnitHouseFormList.get(i)));
			}
			return exShuiwuUnitHouseFormFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<ExShuiwuUnitHouseForm> exShuiwuUnitHouseFormList) {
		if(exShuiwuUnitHouseFormList != null && exShuiwuUnitHouseFormList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<exShuiwuUnitHouseFormList.size(); i++) {
				ExShuiwuUnitHouseForm entity = exShuiwuUnitHouseFormList.get(i);
				Map map = new HashMap();

				map.put("unitId", entity.getUnitId());
				map.put("socialCreditCode", entity.getSocialCreditCode());
				map.put("houseId", entity.getHouseId());
				map.put("unitType", entity.getUnitType());
				map.put("name", entity.getName());
				map.put("legalRepresent", entity.getLegalRepresent());
				map.put("areaCode", entity.getAreaCode());
				map.put("area", entity.getArea());
				map.put("registerStatu", entity.getRegisterStatu());
				map.put("status", entity.getStatus());
				map.put("industryType", entity.getIndustryType());
				map.put("economicType", entity.getEconomicType());
				map.put("businessScope", entity.getBusinessScope());
				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("isexist", entity.getIsexist());
				map.put("isrecorded", entity.getIsrecorded());
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<ExShuiwuUnitHouseForm> convertFormListToVoList(List<ExShuiwuUnitHouseFormForm> exShuiwuUnitHouseFormFormList) {
		if(exShuiwuUnitHouseFormFormList != null && exShuiwuUnitHouseFormFormList.size() > 0) {
			List<ExShuiwuUnitHouseForm> exShuiwuUnitHouseFormList = new ArrayList();
			for(int i=0; i<exShuiwuUnitHouseFormFormList.size(); i++) {
				ExShuiwuUnitHouseForm exShuiwuUnitHouseForm = new ExShuiwuUnitHouseForm();
				convertFormToVo(exShuiwuUnitHouseFormFormList.get(i), exShuiwuUnitHouseForm);
				exShuiwuUnitHouseFormList.add(exShuiwuUnitHouseForm);
			}
			return exShuiwuUnitHouseFormList;
		}
		return null;
	}
}