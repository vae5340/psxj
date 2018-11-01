package com.augurit.awater.dri.psh.basic.convert;

import com.augurit.awater.dri.psh.basic.entity.ExGongan78DzQjw;
import com.augurit.awater.dri.psh.basic.web.form.ExGongan78DzQjwForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class ExGongan78DzQjwConvertor {
	public static ExGongan78DzQjwForm convertVoToForm(ExGongan78DzQjw entity) {
		if(entity != null) {
			ExGongan78DzQjwForm form = new ExGongan78DzQjwForm();
			form.setSGuid(entity.getSGuid());
			form.setSCreationTime(entity.getSCreationTime());
			form.setSLastUpdated(entity.getSLastUpdated());
			form.setSStatus(entity.getSStatus());
			form.setSTransStatus(entity.getSTransStatus());
			form.setSRouteStatus(entity.getSRouteStatus());
			form.setSSrcNode(entity.getSSrcNode());
			form.setSDestNode(entity.getSDestNode());
			form.setGzdbAddtime(entity.getGzdbAddtime());
			form.setSspcsdm(entity.getSspcsdm());
			form.setMc(entity.getMc());
			form.setLastupdatedtime(entity.getLastupdatedtime());
			form.setSsxzjddm(entity.getSsxzjddm());
			form.setZxzt(entity.getZxzt());
			form.setPy(entity.getPy());
			form.setSystemid(entity.getSystemid());
			form.setDm(entity.getDm());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(ExGongan78DzQjwForm form, ExGongan78DzQjw entity) {
		if(entity != null && form != null) {
			if(form.getSGuid() != null && form.getSGuid().trim().length() > 0)
				entity.setSGuid(form.getSGuid().trim());
			entity.setSCreationTime(form.getSCreationTime());
			entity.setSLastUpdated(form.getSLastUpdated());
			if(form.getSStatus() != null && form.getSStatus().trim().length() > 0)
				entity.setSStatus(form.getSStatus().trim());
			if(form.getSTransStatus() != null && form.getSTransStatus().trim().length() > 0)
				entity.setSTransStatus(form.getSTransStatus().trim());
			if(form.getSRouteStatus() != null && form.getSRouteStatus().trim().length() > 0)
				entity.setSRouteStatus(form.getSRouteStatus().trim());
			if(form.getSSrcNode() != null && form.getSSrcNode().trim().length() > 0)
				entity.setSSrcNode(form.getSSrcNode().trim());
			if(form.getSDestNode() != null && form.getSDestNode().trim().length() > 0)
				entity.setSDestNode(form.getSDestNode().trim());
			entity.setGzdbAddtime(form.getGzdbAddtime());
			if(form.getSspcsdm() != null && form.getSspcsdm().trim().length() > 0)
				entity.setSspcsdm(form.getSspcsdm().trim());
			if(form.getMc() != null && form.getMc().trim().length() > 0)
				entity.setMc(form.getMc().trim());
			entity.setLastupdatedtime(form.getLastupdatedtime());
			if(form.getSsxzjddm() != null && form.getSsxzjddm().trim().length() > 0)
				entity.setSsxzjddm(form.getSsxzjddm().trim());
			if(form.getZxzt() != null && form.getZxzt().trim().length() > 0)
				entity.setZxzt(form.getZxzt().trim());
			if(form.getPy() != null && form.getPy().trim().length() > 0)
				entity.setPy(form.getPy().trim());
			if(form.getSystemid() != null && form.getSystemid().trim().length() > 0)
				entity.setSystemid(form.getSystemid().trim());
			if(form.getDm() != null && form.getDm().trim().length() > 0)
				entity.setDm(form.getDm().trim());
		}
	}
	
	public static List<ExGongan78DzQjwForm> convertVoListToFormList(List<ExGongan78DzQjw> exGongan78DzQjwList) {
		if(exGongan78DzQjwList != null && exGongan78DzQjwList.size() > 0) {
			List<ExGongan78DzQjwForm> exGongan78DzQjwFormList = new ArrayList();
			for(int i=0; i<exGongan78DzQjwList.size(); i++) {
				exGongan78DzQjwFormList.add(convertVoToForm(exGongan78DzQjwList.get(i)));
			}
			return exGongan78DzQjwFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<ExGongan78DzQjw> exGongan78DzQjwList) {
		if(exGongan78DzQjwList != null && exGongan78DzQjwList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<exGongan78DzQjwList.size(); i++) {
				ExGongan78DzQjw entity = exGongan78DzQjwList.get(i);
				Map map = new HashMap();

				map.put("sGuid", entity.getSGuid());
				map.put("sCreationTime", entity.getSCreationTime());
				map.put("sLastUpdated", entity.getSLastUpdated());
				map.put("sStatus", entity.getSStatus());
				map.put("sTransStatus", entity.getSTransStatus());
				map.put("sRouteStatus", entity.getSRouteStatus());
				map.put("sSrcNode", entity.getSSrcNode());
				map.put("sDestNode", entity.getSDestNode());
				map.put("gzdbAddtime", entity.getGzdbAddtime());
				map.put("sspcsdm", entity.getSspcsdm());
				map.put("mc", entity.getMc());
				map.put("lastupdatedtime", entity.getLastupdatedtime());
				map.put("ssxzjddm", entity.getSsxzjddm());
				map.put("zxzt", entity.getZxzt());
				map.put("py", entity.getPy());
				map.put("systemid", entity.getSystemid());
				map.put("dm", entity.getDm());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<ExGongan78DzQjw> convertFormListToVoList(List<ExGongan78DzQjwForm> exGongan78DzQjwFormList) {
		if(exGongan78DzQjwFormList != null && exGongan78DzQjwFormList.size() > 0) {
			List<ExGongan78DzQjw> exGongan78DzQjwList = new ArrayList();
			for(int i=0; i<exGongan78DzQjwFormList.size(); i++) {
				ExGongan78DzQjw exGongan78DzQjw = new ExGongan78DzQjw();
				convertFormToVo(exGongan78DzQjwFormList.get(i), exGongan78DzQjw);
				exGongan78DzQjwList.add(exGongan78DzQjw);
			}
			return exGongan78DzQjwList;
		}
		return null;
	}
}