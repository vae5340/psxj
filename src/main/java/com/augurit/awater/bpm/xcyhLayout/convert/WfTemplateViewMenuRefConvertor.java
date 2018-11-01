package com.augurit.awater.bpm.xcyhLayout.convert;

import com.augurit.awater.bpm.xcyhLayout.entity.WfTemplateViewMenuRef;
import com.augurit.awater.bpm.xcyhLayout.web.form.WfTemplateViewMenuRefForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class WfTemplateViewMenuRefConvertor {
	public static WfTemplateViewMenuRefForm convertVoToForm(WfTemplateViewMenuRef entity) {
		if(entity != null) {
			WfTemplateViewMenuRefForm form = new WfTemplateViewMenuRefForm();
			form.setId(entity.getId());
			form.setTemplateId(entity.getTemplateId());
			form.setViewId(entity.getViewId());
			form.setElementId(entity.getElementId());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(WfTemplateViewMenuRefForm form, WfTemplateViewMenuRef entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			entity.setTemplateId(form.getTemplateId());
			entity.setViewId(form.getViewId());
			entity.setElementId(form.getElementId());
		}
	}
	
	public static List<WfTemplateViewMenuRefForm> convertVoListToFormList(List<WfTemplateViewMenuRef> wfTemplateViewMenuRefList) {
		if(wfTemplateViewMenuRefList != null && wfTemplateViewMenuRefList.size() > 0) {
			List<WfTemplateViewMenuRefForm> wfTemplateViewMenuRefFormList = new ArrayList();
			for(int i=0; i<wfTemplateViewMenuRefList.size(); i++) {
				wfTemplateViewMenuRefFormList.add(convertVoToForm(wfTemplateViewMenuRefList.get(i)));
			}
			return wfTemplateViewMenuRefFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<WfTemplateViewMenuRef> wfTemplateViewMenuRefList) {
		if(wfTemplateViewMenuRefList != null && wfTemplateViewMenuRefList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<wfTemplateViewMenuRefList.size(); i++) {
				WfTemplateViewMenuRef entity = wfTemplateViewMenuRefList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("templateId", entity.getTemplateId() == null ? "" : entity.getTemplateId().toString());
				map.put("viewId", entity.getViewId() == null ? "" : entity.getViewId().toString());
				map.put("elementId", entity.getElementId() == null ? "" : entity.getElementId().toString());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<WfTemplateViewMenuRef> convertFormListToVoList(List<WfTemplateViewMenuRefForm> wfTemplateViewMenuRefFormList) {
		if(wfTemplateViewMenuRefFormList != null && wfTemplateViewMenuRefFormList.size() > 0) {
			List<WfTemplateViewMenuRef> wfTemplateViewMenuRefList = new ArrayList();
			for(int i=0; i<wfTemplateViewMenuRefFormList.size(); i++) {
				WfTemplateViewMenuRef wfTemplateViewMenuRef = new WfTemplateViewMenuRef();
				convertFormToVo(wfTemplateViewMenuRefFormList.get(i), wfTemplateViewMenuRef);
				wfTemplateViewMenuRefList.add(wfTemplateViewMenuRef);
			}
			return wfTemplateViewMenuRefList;
		}
		return null;
	}
}