package com.augurit.awater.bpm.xcyhLayout.convert;

import com.augurit.awater.bpm.xcyhLayout.entity.WfTemplateView;
import com.augurit.awater.bpm.xcyhLayout.web.form.WfTemplateViewForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class WfTemplateViewConvertor {
	public static WfTemplateViewForm convertVoToForm(WfTemplateView entity) {
		if(entity != null) {
			WfTemplateViewForm form = new WfTemplateViewForm();
			form.setTemplateid(entity.getTemplateid());
			form.setViewname(entity.getViewname());
			form.setViewdisplayname(entity.getViewdisplayname());
			form.setViewtype(entity.getViewtype());
			form.setFilterconditionssql(entity.getFilterconditionssql());
			form.setDisplayorder(entity.getDisplayorder());
			form.setRemark(entity.getRemark());
			form.setId(entity.getId());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(WfTemplateViewForm form, WfTemplateView entity) {
		if(entity != null && form != null) {
			entity.setTemplateid(form.getTemplateid());
			if(form.getViewname() != null && form.getViewname().trim().length() > 0)
				entity.setViewname(form.getViewname().trim());
			if(form.getViewdisplayname() != null && form.getViewdisplayname().trim().length() > 0)
				entity.setViewdisplayname(form.getViewdisplayname().trim());
			if(form.getViewtype() != null && form.getViewtype().trim().length() > 0)
				entity.setViewtype(form.getViewtype().trim());
			if(form.getFilterconditionssql() != null && form.getFilterconditionssql().trim().length() > 0)
				entity.setFilterconditionssql(form.getFilterconditionssql().trim());
			entity.setDisplayorder(form.getDisplayorder());
			if(form.getRemark() != null && form.getRemark().trim().length() > 0)
				entity.setRemark(form.getRemark().trim());
			entity.setId(form.getId());
		}
	}
	
	public static List<WfTemplateViewForm> convertVoListToFormList(List<WfTemplateView> wfTemplateViewList) {
		if(wfTemplateViewList != null && wfTemplateViewList.size() > 0) {
			List<WfTemplateViewForm> wfTemplateViewFormList = new ArrayList();
			for(int i=0; i<wfTemplateViewList.size(); i++) {
				wfTemplateViewFormList.add(convertVoToForm(wfTemplateViewList.get(i)));
			}
			return wfTemplateViewFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<WfTemplateView> wfTemplateViewList) {
		if(wfTemplateViewList != null && wfTemplateViewList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<wfTemplateViewList.size(); i++) {
				WfTemplateView entity = wfTemplateViewList.get(i);
				Map map = new HashMap();

				map.put("templateid", entity.getTemplateid() == null ? "" : entity.getTemplateid().toString());
				map.put("viewname", entity.getViewname());
				map.put("viewdisplayname", entity.getViewdisplayname());
				map.put("viewtype", entity.getViewtype());
				map.put("filterconditionssql", entity.getFilterconditionssql());
				map.put("displayorder", entity.getDisplayorder() == null ? "" : entity.getDisplayorder().toString());
				map.put("remark", entity.getRemark());
				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<WfTemplateView> convertFormListToVoList(List<WfTemplateViewForm> wfTemplateViewFormList) {
		if(wfTemplateViewFormList != null && wfTemplateViewFormList.size() > 0) {
			List<WfTemplateView> wfTemplateViewList = new ArrayList();
			for(int i=0; i<wfTemplateViewFormList.size(); i++) {
				WfTemplateView wfTemplateView = new WfTemplateView();
				convertFormToVo(wfTemplateViewFormList.get(i), wfTemplateView);
				wfTemplateViewList.add(wfTemplateView);
			}
			return wfTemplateViewList;
		}
		return null;
	}
}