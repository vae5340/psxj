package com.augurit.awater.bpm.sggc.convert;

import com.augurit.awater.bpm.sggc.entity.GxSggc;
import com.augurit.awater.bpm.sggc.web.form.GxSggcForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GxSggcConvertor {
	public static GxSggcForm convertVoToForm(GxSggc entity) {
		if(entity != null) {
			GxSggcForm form = new GxSggcForm();
			form.setId(entity.getId());
			form.setLx(entity.getLx());
			form.setUsername(entity.getUsername());
			form.setTime(entity.getTime());
			form.setContent(entity.getContent());
			form.setSgjd(entity.getSgjd());
			form.setSjid(entity.getSjid());
			form.setLoginname(entity.getLoginname());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(GxSggcForm form, GxSggc entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			if(form.getLx() != null && form.getLx().trim().length() > 0)
				entity.setLx(form.getLx().trim());
			if(form.getUsername() != null && form.getUsername().trim().length() > 0)
				entity.setUsername(form.getUsername().trim());
			entity.setTime(form.getTime());
			if(form.getContent() != null && form.getContent().trim().length() > 0)
				entity.setContent(form.getContent().trim());
			if(form.getSgjd() != null && form.getSgjd().trim().length() > 0)
				entity.setSgjd(form.getSgjd().trim());
			entity.setSjid(form.getSjid());
			if(form.getLoginname() != null && form.getLoginname().trim().length() > 0)
				entity.setLoginname(form.getLoginname().trim());
		}
	}
	
	public static List<GxSggcForm> convertVoListToFormList(List<GxSggc> gxSggcList) {
		if(gxSggcList != null && gxSggcList.size() > 0) {
			List<GxSggcForm> gxSggcFormList = new ArrayList();
			for(int i=0; i<gxSggcList.size(); i++) {
				gxSggcFormList.add(convertVoToForm(gxSggcList.get(i)));
			}
			return gxSggcFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<GxSggc> gxSggcList) {
		if(gxSggcList != null && gxSggcList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<gxSggcList.size(); i++) {
				GxSggc entity = gxSggcList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("lx", entity.getLx());
				map.put("username", entity.getUsername());
				map.put("time", entity.getTime());
				map.put("content", entity.getContent());
				map.put("sgjd", entity.getSgjd());
				map.put("sjid", entity.getSjid() == null ? "" : entity.getSjid().toString());
				map.put("loginname", entity.getLoginname());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<GxSggc> convertFormListToVoList(List<GxSggcForm> gxSggcFormList) {
		if(gxSggcFormList != null && gxSggcFormList.size() > 0) {
			List<GxSggc> gxSggcList = new ArrayList();
			for(int i=0; i<gxSggcFormList.size(); i++) {
				GxSggc gxSggc = new GxSggc();
				convertFormToVo(gxSggcFormList.get(i), gxSggc);
				gxSggcList.add(gxSggc);
			}
			return gxSggcList;
		}
		return null;
	}
}