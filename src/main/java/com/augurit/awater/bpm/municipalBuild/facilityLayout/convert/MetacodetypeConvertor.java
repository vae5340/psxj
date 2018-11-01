package com.augurit.awater.bpm.municipalBuild.facilityLayout.convert;

import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metacodetype;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetacodetypeForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class MetacodetypeConvertor {
	public static MetacodetypeForm convertVoToForm(Metacodetype entity) {
		if(entity != null) {
			MetacodetypeForm form = new MetacodetypeForm();
			form.setId(entity.getId());
			form.setTypecode(entity.getTypecode());
			form.setName(entity.getName());
			form.setGrade(entity.getGrade());
			form.setMemo(entity.getMemo());
			form.setSeniorid(entity.getSeniorid());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(MetacodetypeForm form, Metacodetype entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			if(form.getTypecode() != null && form.getTypecode().trim().length() > 0)
				entity.setTypecode(form.getTypecode().trim());
			if(form.getName() != null && form.getName().trim().length() > 0)
				entity.setName(form.getName().trim());
			if(form.getGrade() != null && form.getGrade().trim().length() > 0)
				entity.setGrade(form.getGrade().trim());
			if(form.getMemo() != null && form.getMemo().trim().length() > 0)
				entity.setMemo(form.getMemo().trim());
			entity.setSeniorid(form.getSeniorid());
		}
	}
	
	public static List<MetacodetypeForm> convertVoListToFormList(List<Metacodetype> metacodetypeList) {
		if(metacodetypeList != null && metacodetypeList.size() > 0) {
			List<MetacodetypeForm> metacodetypeFormList = new ArrayList();
			for(int i=0; i<metacodetypeList.size(); i++) {
				metacodetypeFormList.add(convertVoToForm(metacodetypeList.get(i)));
			}
			return metacodetypeFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<Metacodetype> metacodetypeList) {
		if(metacodetypeList != null && metacodetypeList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<metacodetypeList.size(); i++) {
				Metacodetype entity = metacodetypeList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("typecode", entity.getTypecode());
				map.put("name", entity.getName());
				map.put("grade", entity.getGrade());
				map.put("memo", entity.getMemo());
				map.put("seniorid",entity.getSeniorid());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<Metacodetype> convertFormListToVoList(List<MetacodetypeForm> metacodetypeFormList) {
		if(metacodetypeFormList != null && metacodetypeFormList.size() > 0) {
			List<Metacodetype> metacodetypeList = new ArrayList();
			for(int i=0; i<metacodetypeFormList.size(); i++) {
				Metacodetype metacodetype = new Metacodetype();
				convertFormToVo(metacodetypeFormList.get(i), metacodetype);
				metacodetypeList.add(metacodetype);
			}
			return metacodetypeList;
		}
		return null;
	}
}