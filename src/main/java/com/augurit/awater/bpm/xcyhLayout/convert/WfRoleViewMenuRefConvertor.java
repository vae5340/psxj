package com.augurit.awater.bpm.xcyhLayout.convert;


import com.augurit.awater.bpm.xcyhLayout.entity.WfRoleViewMenuRef;
import com.augurit.awater.bpm.xcyhLayout.web.form.WfRoleViewMenuRefForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class WfRoleViewMenuRefConvertor {
	public static WfRoleViewMenuRefForm convertVoToForm(WfRoleViewMenuRef entity) {
		if(entity != null) {
			WfRoleViewMenuRefForm form = new WfRoleViewMenuRefForm();
			form.setId(entity.getId());
			form.setTemplateId(entity.getTemplateId());
			form.setElementId(entity.getElementId());
			form.setRoleId(entity.getRoleId());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(WfRoleViewMenuRefForm form, WfRoleViewMenuRef entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			entity.setTemplateId(form.getTemplateId());
			entity.setElementId(form.getElementId());
			entity.setRoleId(form.getRoleId());
		}
	}
	
	public static List<WfRoleViewMenuRefForm> convertVoListToFormList(List<WfRoleViewMenuRef> wfRoleViewMenuRefList) {
		if(wfRoleViewMenuRefList != null && wfRoleViewMenuRefList.size() > 0) {
			List<WfRoleViewMenuRefForm> wfRoleViewMenuRefFormList = new ArrayList();
			for(int i=0; i<wfRoleViewMenuRefList.size(); i++) {
				wfRoleViewMenuRefFormList.add(convertVoToForm(wfRoleViewMenuRefList.get(i)));
			}
			return wfRoleViewMenuRefFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<WfRoleViewMenuRef> wfRoleViewMenuRefList) {
		if(wfRoleViewMenuRefList != null && wfRoleViewMenuRefList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<wfRoleViewMenuRefList.size(); i++) {
				WfRoleViewMenuRef entity = wfRoleViewMenuRefList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("templateId", entity.getTemplateId() == null ? "" : entity.getTemplateId().toString());
				map.put("elementId", entity.getElementId() == null ? "" : entity.getElementId().toString());
				map.put("roleId", entity.getRoleId() == null ? "" : entity.getRoleId().toString());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<WfRoleViewMenuRef> convertFormListToVoList(List<WfRoleViewMenuRefForm> wfRoleViewMenuRefFormList) {
		if(wfRoleViewMenuRefFormList != null && wfRoleViewMenuRefFormList.size() > 0) {
			List<WfRoleViewMenuRef> wfRoleViewMenuRefList = new ArrayList();
			for(int i=0; i<wfRoleViewMenuRefFormList.size(); i++) {
				WfRoleViewMenuRef wfRoleViewMenuRef = new WfRoleViewMenuRef();
				convertFormToVo(wfRoleViewMenuRefFormList.get(i), wfRoleViewMenuRef);
				wfRoleViewMenuRefList.add(wfRoleViewMenuRef);
			}
			return wfRoleViewMenuRefList;
		}
		return null;
	}
}