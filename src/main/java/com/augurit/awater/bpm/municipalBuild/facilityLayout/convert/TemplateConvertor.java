package com.augurit.awater.bpm.municipalBuild.facilityLayout.convert;

import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Template;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.TemplateForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TemplateConvertor {
	public static TemplateForm convertVoToForm(Template entity) {
		if(entity != null) {
			TemplateForm form = new TemplateForm();
			form.setTemplateid(entity.getTemplateid());
			form.setTemplatename(entity.getTemplatename());
			form.setDisplayname(entity.getDisplayname());
			form.setIsinused(entity.getIsinused());
			form.setDisplayorder(entity.getDisplayorder());
			form.setRemark(entity.getRemark());
			form.setId(entity.getId());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(TemplateForm form, Template entity) {
		if(entity != null && form != null) {
			entity.setTemplateid(form.getTemplateid());
			if(form.getTemplatename() != null && form.getTemplatename().trim().length() > 0)
				entity.setTemplatename(form.getTemplatename().trim());
			if(form.getDisplayname() != null && form.getDisplayname().trim().length() > 0)
				entity.setDisplayname(form.getDisplayname().trim());
			entity.setIsinused(form.getIsinused());
			entity.setDisplayorder(form.getDisplayorder());
			if(form.getRemark() != null && form.getRemark().trim().length() > 0)
				entity.setRemark(form.getRemark().trim());
			entity.setId(form.getId());
		}
	}
	
	public static List<TemplateForm> convertVoListToFormList(List<Template> templateList) {
		if(templateList != null && templateList.size() > 0) {
			List<TemplateForm> templateFormList = new ArrayList();
			for(int i=0; i<templateList.size(); i++) {
				templateFormList.add(convertVoToForm(templateList.get(i)));
			}
			return templateFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<Template> templateList) {
		if(templateList != null && templateList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<templateList.size(); i++) {
				Template entity = templateList.get(i);
				Map map = new HashMap();

				map.put("templateid", entity.getTemplateid() == null ? "" : entity.getTemplateid().toString());
				map.put("templatename", entity.getTemplatename());
				map.put("displayname", entity.getDisplayname());
				map.put("isinused", entity.getIsinused() == null ? "" : entity.getIsinused().toString());
				map.put("displayorder", entity.getDisplayorder() == null ? "" : entity.getDisplayorder().toString());
				map.put("remark", entity.getRemark());
				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<Template> convertFormListToVoList(List<TemplateForm> templateFormList) {
		if(templateFormList != null && templateFormList.size() > 0) {
			List<Template> templateList = new ArrayList();
			for(int i=0; i<templateFormList.size(); i++) {
				Template template = new Template();
				convertFormToVo(templateFormList.get(i), template);
				templateList.add(template);
			}
			return templateList;
		}
		return null;
	}
}