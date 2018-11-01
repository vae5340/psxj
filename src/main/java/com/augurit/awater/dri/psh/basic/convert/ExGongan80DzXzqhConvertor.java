package com.augurit.awater.dri.psh.basic.convert;

import com.augurit.awater.dri.psh.basic.entity.ExGongan80DzXzqh;
import com.augurit.awater.dri.psh.basic.web.form.ExGongan80DzXzqhForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class ExGongan80DzXzqhConvertor {
	public static ExGongan80DzXzqhForm convertVoToForm(ExGongan80DzXzqh entity) {
		if(entity != null) {
			ExGongan80DzXzqhForm form = new ExGongan80DzXzqhForm();
			form.setSGuid(entity.getSGuid());
			form.setSCreationTime(entity.getSCreationTime());
			form.setSLastUpdated(entity.getSLastUpdated());
			form.setSStatus(entity.getSStatus());
			form.setSTransStatus(entity.getSTransStatus());
			form.setSRouteStatus(entity.getSRouteStatus());
			form.setSSrcNode(entity.getSSrcNode());
			form.setSDestNode(entity.getSDestNode());
			form.setFjdm(entity.getFjdm());
			form.setSsgajgdm(entity.getSsgajgdm());
			form.setZxzt(entity.getZxzt());
			form.setSystemid(entity.getSystemid());
			form.setLastupdatedtime(entity.getLastupdatedtime());
			form.setGzdbAddtime(entity.getGzdbAddtime());
			form.setMc(entity.getMc());
			form.setXzqhjb(entity.getXzqhjb());
			form.setPy(entity.getPy());
			form.setDm(entity.getDm());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(ExGongan80DzXzqhForm form, ExGongan80DzXzqh entity) {
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
			if(form.getFjdm() != null && form.getFjdm().trim().length() > 0)
				entity.setFjdm(form.getFjdm().trim());
			if(form.getSsgajgdm() != null && form.getSsgajgdm().trim().length() > 0)
				entity.setSsgajgdm(form.getSsgajgdm().trim());
			if(form.getZxzt() != null && form.getZxzt().trim().length() > 0)
				entity.setZxzt(form.getZxzt().trim());
			if(form.getSystemid() != null && form.getSystemid().trim().length() > 0)
				entity.setSystemid(form.getSystemid().trim());
			entity.setLastupdatedtime(form.getLastupdatedtime());
			entity.setGzdbAddtime(form.getGzdbAddtime());
			if(form.getMc() != null && form.getMc().trim().length() > 0)
				entity.setMc(form.getMc().trim());
			if(form.getXzqhjb() != null && form.getXzqhjb().trim().length() > 0)
				entity.setXzqhjb(form.getXzqhjb().trim());
			if(form.getPy() != null && form.getPy().trim().length() > 0)
				entity.setPy(form.getPy().trim());
			if(form.getDm() != null && form.getDm().trim().length() > 0)
				entity.setDm(form.getDm().trim());
		}
	}
	
	public static List<ExGongan80DzXzqhForm> convertVoListToFormList(List<ExGongan80DzXzqh> exGongan80DzXzqhList) {
		if(exGongan80DzXzqhList != null && exGongan80DzXzqhList.size() > 0) {
			List<ExGongan80DzXzqhForm> exGongan80DzXzqhFormList = new ArrayList();
			for(int i=0; i<exGongan80DzXzqhList.size(); i++) {
				exGongan80DzXzqhFormList.add(convertVoToForm(exGongan80DzXzqhList.get(i)));
			}
			return exGongan80DzXzqhFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<ExGongan80DzXzqh> exGongan80DzXzqhList) {
		if(exGongan80DzXzqhList != null && exGongan80DzXzqhList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<exGongan80DzXzqhList.size(); i++) {
				ExGongan80DzXzqh entity = exGongan80DzXzqhList.get(i);
				Map map = new HashMap();

				map.put("sGuid", entity.getSGuid());
				map.put("sCreationTime", entity.getSCreationTime());
				map.put("sLastUpdated", entity.getSLastUpdated());
				map.put("sStatus", entity.getSStatus());
				map.put("sTransStatus", entity.getSTransStatus());
				map.put("sRouteStatus", entity.getSRouteStatus());
				map.put("sSrcNode", entity.getSSrcNode());
				map.put("sDestNode", entity.getSDestNode());
				map.put("fjdm", entity.getFjdm());
				map.put("ssgajgdm", entity.getSsgajgdm());
				map.put("zxzt", entity.getZxzt());
				map.put("systemid", entity.getSystemid());
				map.put("lastupdatedtime", entity.getLastupdatedtime());
				map.put("gzdbAddtime", entity.getGzdbAddtime());
				map.put("mc", entity.getMc());
				map.put("xzqhjb", entity.getXzqhjb());
				map.put("py", entity.getPy());
				map.put("dm", entity.getDm());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<ExGongan80DzXzqh> convertFormListToVoList(List<ExGongan80DzXzqhForm> exGongan80DzXzqhFormList) {
		if(exGongan80DzXzqhFormList != null && exGongan80DzXzqhFormList.size() > 0) {
			List<ExGongan80DzXzqh> exGongan80DzXzqhList = new ArrayList();
			for(int i=0; i<exGongan80DzXzqhFormList.size(); i++) {
				ExGongan80DzXzqh exGongan80DzXzqh = new ExGongan80DzXzqh();
				convertFormToVo(exGongan80DzXzqhFormList.get(i), exGongan80DzXzqh);
				exGongan80DzXzqhList.add(exGongan80DzXzqh);
			}
			return exGongan80DzXzqhList;
		}
		return null;
	}
}