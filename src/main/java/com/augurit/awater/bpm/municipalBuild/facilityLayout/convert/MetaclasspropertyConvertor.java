package com.augurit.awater.bpm.municipalBuild.facilityLayout.convert;

import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metaclassproperty;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetaclasspropertyForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class MetaclasspropertyConvertor {
	public static MetaclasspropertyForm convertVoToForm(Metaclassproperty entity) {
		if(entity != null) {
			MetaclasspropertyForm form = new MetaclasspropertyForm();
			form.setClasspropertyid(entity.getClasspropertyid());
			form.setClasspropertyname(entity.getClasspropertyname());
			form.setDisplayname(entity.getDisplayname());
			form.setTemplateclassid(entity.getTemplateclassid());
			form.setClasspropertydesc(entity.getClasspropertydesc());
			form.setFieldstatecode(entity.getFieldstatecode());
			form.setNullflag(entity.getNullflag());
			form.setQuerypropertyflag(entity.getQuerypropertyflag());
			form.setListpropertyflag(entity.getListpropertyflag());
			form.setId(entity.getId());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(MetaclasspropertyForm form, Metaclassproperty entity) {
		if(entity != null && form != null) {
			entity.setClasspropertyid(form.getClasspropertyid());
			if(form.getClasspropertyname() != null && form.getClasspropertyname().trim().length() > 0)
				entity.setClasspropertyname(form.getClasspropertyname().trim());
			if(form.getDisplayname() != null && form.getDisplayname().trim().length() > 0)
				entity.setDisplayname(form.getDisplayname().trim());
			entity.setTemplateclassid(form.getTemplateclassid());
			if(form.getClasspropertydesc() != null && form.getClasspropertydesc().trim().length() > 0)
				entity.setClasspropertydesc(form.getClasspropertydesc().trim());
			if(form.getFieldstatecode() != null && form.getFieldstatecode().trim().length() > 0)
				entity.setFieldstatecode(form.getFieldstatecode().trim());
			entity.setNullflag(form.getNullflag());
			entity.setQuerypropertyflag(form.getQuerypropertyflag());
			entity.setListpropertyflag(form.getListpropertyflag());
			entity.setId(form.getId());
		}
	}
	
	public static List<MetaclasspropertyForm> convertVoListToFormList(List<Metaclassproperty> metaclasspropertyList) {
		if(metaclasspropertyList != null && metaclasspropertyList.size() > 0) {
			List<MetaclasspropertyForm> metaclasspropertyFormList = new ArrayList();
			for(int i=0; i<metaclasspropertyList.size(); i++) {
				metaclasspropertyFormList.add(convertVoToForm(metaclasspropertyList.get(i)));
			}
			return metaclasspropertyFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<Metaclassproperty> metaclasspropertyList) {
		if(metaclasspropertyList != null && metaclasspropertyList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<metaclasspropertyList.size(); i++) {
				Metaclassproperty entity = metaclasspropertyList.get(i);
				Map map = new HashMap();

				map.put("classpropertyid", entity.getClasspropertyid() == null ? "" : entity.getClasspropertyid().toString());
				map.put("classpropertyname", entity.getClasspropertyname());
				map.put("displayname", entity.getDisplayname());
				map.put("templateclassid", entity.getTemplateclassid() == null ? "" : entity.getTemplateclassid().toString());
				map.put("classpropertydesc", entity.getClasspropertydesc());
				map.put("fieldstatecode", entity.getFieldstatecode() == null ? "" : entity.getFieldstatecode().toString());
				map.put("nullflag", entity.getNullflag() == null ? "" : entity.getNullflag().toString());
				map.put("querypropertyflag", entity.getQuerypropertyflag() == null ? "" : entity.getQuerypropertyflag().toString());
				map.put("listpropertyflag", entity.getListpropertyflag() == null ? "" : entity.getListpropertyflag().toString());
				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<Metaclassproperty> convertFormListToVoList(List<MetaclasspropertyForm> metaclasspropertyFormList) {
		if(metaclasspropertyFormList != null && metaclasspropertyFormList.size() > 0) {
			List<Metaclassproperty> metaclasspropertyList = new ArrayList();
			for(int i=0; i<metaclasspropertyFormList.size(); i++) {
				Metaclassproperty metaclassproperty = new Metaclassproperty();
				convertFormToVo(metaclasspropertyFormList.get(i), metaclassproperty);
				metaclasspropertyList.add(metaclassproperty);
			}
			return metaclasspropertyList;
		}
		return null;
	}
}