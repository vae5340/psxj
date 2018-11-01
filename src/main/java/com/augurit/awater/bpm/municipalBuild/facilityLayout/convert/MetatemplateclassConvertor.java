package com.augurit.awater.bpm.municipalBuild.facilityLayout.convert;

import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metatemplateclass;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetatemplateclassForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class MetatemplateclassConvertor {
	public static MetatemplateclassForm convertVoToForm(Metatemplateclass entity) {
		if(entity != null) {
			MetatemplateclassForm form = new MetatemplateclassForm();
			form.setTemplateclassid(entity.getTemplateclassid());
			form.setTemplateclassname(entity.getTemplateclassname());
			form.setDisplayname(entity.getDisplayname());
			form.setTemplateclassdesc(entity.getTemplateclassdesc());
			form.setMetadatacategoryid(entity.getMetadatacategoryid());
			form.setId(entity.getId());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(MetatemplateclassForm form, Metatemplateclass entity) {
		if(entity != null && form != null) {
			entity.setTemplateclassid(form.getTemplateclassid());
			if(form.getTemplateclassname() != null && form.getTemplateclassname().trim().length() > 0)
				entity.setTemplateclassname(form.getTemplateclassname().trim());
			if(form.getDisplayname() != null && form.getDisplayname().trim().length() > 0)
				entity.setDisplayname(form.getDisplayname().trim());
			if(form.getTemplateclassdesc() != null && form.getTemplateclassdesc().trim().length() > 0)
				entity.setTemplateclassdesc(form.getTemplateclassdesc().trim());
			entity.setMetadatacategoryid(form.getMetadatacategoryid());
			entity.setId(form.getId());
		}
	}
	
	public static List<MetatemplateclassForm> convertVoListToFormList(List<Metatemplateclass> metatemplateclassList) {
		if(metatemplateclassList != null && metatemplateclassList.size() > 0) {
			List<MetatemplateclassForm> metatemplateclassFormList = new ArrayList();
			for(int i=0; i<metatemplateclassList.size(); i++) {
				metatemplateclassFormList.add(convertVoToForm(metatemplateclassList.get(i)));
			}
			return metatemplateclassFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<Metatemplateclass> metatemplateclassList) {
		if(metatemplateclassList != null && metatemplateclassList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<metatemplateclassList.size(); i++) {
				Metatemplateclass entity = metatemplateclassList.get(i);
				Map map = new HashMap();

				map.put("templateclassid", entity.getTemplateclassid() == null ? "" : entity.getTemplateclassid().toString());
				map.put("templateclassname", entity.getTemplateclassname());
				map.put("displayname", entity.getDisplayname());
				map.put("templateclassdesc", entity.getTemplateclassdesc());
				map.put("metadatacategoryid", entity.getMetadatacategoryid() == null ? "" : entity.getMetadatacategoryid().toString());
				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<Metatemplateclass> convertFormListToVoList(List<MetatemplateclassForm> metatemplateclassFormList) {
		if(metatemplateclassFormList != null && metatemplateclassFormList.size() > 0) {
			List<Metatemplateclass> metatemplateclassList = new ArrayList();
			for(int i=0; i<metatemplateclassFormList.size(); i++) {
				Metatemplateclass metatemplateclass = new Metatemplateclass();
				convertFormToVo(metatemplateclassFormList.get(i), metatemplateclass);
				metatemplateclassList.add(metatemplateclass);
			}
			return metatemplateclassList;
		}
		return null;
	}
}