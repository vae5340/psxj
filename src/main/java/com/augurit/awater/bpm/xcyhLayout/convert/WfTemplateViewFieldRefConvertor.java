package com.augurit.awater.bpm.xcyhLayout.convert;

import com.augurit.awater.bpm.xcyhLayout.entity.WfTemplateViewFieldRef;
import com.augurit.awater.bpm.xcyhLayout.web.form.WfTemplateViewFieldRefForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class WfTemplateViewFieldRefConvertor {
	public static WfTemplateViewFieldRefForm convertVoToForm(WfTemplateViewFieldRef entity) {
		if(entity != null) {
			WfTemplateViewFieldRefForm form = new WfTemplateViewFieldRefForm();
			form.setId(entity.getId());
			form.setTemplateId(entity.getTemplateId());
			form.setViewId(entity.getViewId());
			form.setElementId(entity.getElementId());
			form.setDisplayOrder(entity.getDisplayOrder());
			form.setDisplayFlag(entity.getDisplayFlag());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(WfTemplateViewFieldRefForm form, WfTemplateViewFieldRef entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			entity.setTemplateId(form.getTemplateId());
			entity.setViewId(form.getViewId());
			entity.setElementId(form.getElementId());
			entity.setDisplayOrder(form.getDisplayOrder());
			entity.setDisplayFlag(form.getDisplayFlag());
		}
	}
	
	public static List<WfTemplateViewFieldRefForm> convertVoListToFormList(List<WfTemplateViewFieldRef> wfTemplateViewFieldRefList) {
		if(wfTemplateViewFieldRefList != null && wfTemplateViewFieldRefList.size() > 0) {
			List<WfTemplateViewFieldRefForm> wfTemplateViewFieldRefFormList = new ArrayList();
			for(int i=0; i<wfTemplateViewFieldRefList.size(); i++) {
				wfTemplateViewFieldRefFormList.add(convertVoToForm(wfTemplateViewFieldRefList.get(i)));
			}
			return wfTemplateViewFieldRefFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<WfTemplateViewFieldRef> wfTemplateViewFieldRefList) {
		if(wfTemplateViewFieldRefList != null && wfTemplateViewFieldRefList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<wfTemplateViewFieldRefList.size(); i++) {
				WfTemplateViewFieldRef entity = wfTemplateViewFieldRefList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("templateId", entity.getTemplateId() == null ? "" : entity.getTemplateId().toString());
				map.put("viewId", entity.getViewId() == null ? "" : entity.getViewId().toString());
				map.put("elementId", entity.getElementId() == null ? "" : entity.getElementId().toString());
				map.put("displayOrder", entity.getDisplayOrder() == null ? "" : entity.getDisplayOrder().toString());
				map.put("displayFlag", entity.getDisplayFlag() == null ? "" : entity.getDisplayFlag().toString());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<WfTemplateViewFieldRef> convertFormListToVoList(List<WfTemplateViewFieldRefForm> wfTemplateViewFieldRefFormList) {
		if(wfTemplateViewFieldRefFormList != null && wfTemplateViewFieldRefFormList.size() > 0) {
			List<WfTemplateViewFieldRef> wfTemplateViewFieldRefList = new ArrayList();
			for(int i=0; i<wfTemplateViewFieldRefFormList.size(); i++) {
				WfTemplateViewFieldRef wfTemplateViewFieldRef = new WfTemplateViewFieldRef();
				convertFormToVo(wfTemplateViewFieldRefFormList.get(i), wfTemplateViewFieldRef);
				wfTemplateViewFieldRefList.add(wfTemplateViewFieldRef);
			}
			return wfTemplateViewFieldRefList;
		}
		return null;
	}
}