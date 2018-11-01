package com.augurit.awater.bpm.xcyhLayout.convert;

import com.augurit.awater.bpm.xcyhLayout.entity.WfRoleViewRef;
import com.augurit.awater.bpm.xcyhLayout.web.form.WfRoleViewRefForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class WfRoleViewRefConvertor {
	public static WfRoleViewRefForm convertVoToForm(WfRoleViewRef entity) {
		if(entity != null) {
			WfRoleViewRefForm form = new WfRoleViewRefForm();
			form.setId(entity.getId());
			form.setTemplateId(entity.getTemplateId());
			form.setViewId(entity.getViewId());
			form.setRoleId(entity.getRoleId());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(WfRoleViewRefForm form, WfRoleViewRef entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			entity.setTemplateId(form.getTemplateId());
			entity.setViewId(form.getViewId());
			entity.setRoleId(form.getRoleId());
		}
	}
	
	public static List<WfRoleViewRefForm> convertVoListToFormList(List<WfRoleViewRef> wfRoleViewRefList) {
		if(wfRoleViewRefList != null && wfRoleViewRefList.size() > 0) {
			List<WfRoleViewRefForm> wfRoleViewRefFormList = new ArrayList();
			for(int i=0; i<wfRoleViewRefList.size(); i++) {
				wfRoleViewRefFormList.add(convertVoToForm(wfRoleViewRefList.get(i)));
			}
			return wfRoleViewRefFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<WfRoleViewRef> wfRoleViewRefList) {
		if(wfRoleViewRefList != null && wfRoleViewRefList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<wfRoleViewRefList.size(); i++) {
				WfRoleViewRef entity = wfRoleViewRefList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("templateId", entity.getTemplateId() == null ? "" : entity.getTemplateId().toString());
				map.put("viewId", entity.getViewId() == null ? "" : entity.getViewId().toString());
				map.put("roleId", entity.getRoleId() == null ? "" : entity.getRoleId().toString());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<WfRoleViewRef> convertFormListToVoList(List<WfRoleViewRefForm> wfRoleViewRefFormList) {
		if(wfRoleViewRefFormList != null && wfRoleViewRefFormList.size() > 0) {
			List<WfRoleViewRef> wfRoleViewRefList = new ArrayList();
			for(int i=0; i<wfRoleViewRefFormList.size(); i++) {
				WfRoleViewRef wfRoleViewRef = new WfRoleViewRef();
				convertFormToVo(wfRoleViewRefFormList.get(i), wfRoleViewRef);
				wfRoleViewRefList.add(wfRoleViewRef);
			}
			return wfRoleViewRefList;
		}
		return null;
	}
}