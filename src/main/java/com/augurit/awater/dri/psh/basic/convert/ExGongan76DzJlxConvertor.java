package com.augurit.awater.dri.psh.basic.convert;

import com.augurit.awater.dri.psh.basic.entity.ExGongan76DzJlx;
import com.augurit.awater.dri.psh.basic.web.form.ExGongan76DzJlxForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class ExGongan76DzJlxConvertor {
	public static ExGongan76DzJlxForm convertVoToForm(ExGongan76DzJlx entity) {
		if(entity != null) {
			ExGongan76DzJlxForm form = new ExGongan76DzJlxForm();
			form.setSGuid(entity.getSGuid());
			form.setSCreationTime(entity.getSCreationTime());
			form.setSLastUpdated(entity.getSLastUpdated());
			form.setSStatus(entity.getSStatus());
			form.setSTransStatus(entity.getSTransStatus());
			form.setSRouteStatus(entity.getSRouteStatus());
			form.setSSrcNode(entity.getSSrcNode());
			form.setSDestNode(entity.getSDestNode());
			form.setPx(entity.getPx());
			form.setSssqcjwhdm(entity.getSssqcjwhdm());
			form.setFjdm(entity.getFjdm());
			form.setSfyjjlx(entity.getSfyjjlx());
			form.setPy(entity.getPy());
			form.setSystemid(entity.getSystemid());
			form.setBhpcsdm(entity.getBhpcsdm());
			form.setSsxzqhdm(entity.getSsxzqhdm());
			form.setMc(entity.getMc());
			form.setZxzt(entity.getZxzt());
			form.setSmzt(entity.getSmzt());
			form.setGzdbAddtime(entity.getGzdbAddtime());
			form.setJlxlx(entity.getJlxlx());
			form.setSsxzjddm(entity.getSsxzjddm());
			form.setLastupdatedtime(entity.getLastupdatedtime());
			form.setDm(entity.getDm());
			form.setJlxly(entity.getJlxly());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(ExGongan76DzJlxForm form, ExGongan76DzJlx entity) {
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
			entity.setPx(form.getPx());
			if(form.getSssqcjwhdm() != null && form.getSssqcjwhdm().trim().length() > 0)
				entity.setSssqcjwhdm(form.getSssqcjwhdm().trim());
			if(form.getFjdm() != null && form.getFjdm().trim().length() > 0)
				entity.setFjdm(form.getFjdm().trim());
			if(form.getSfyjjlx() != null && form.getSfyjjlx().trim().length() > 0)
				entity.setSfyjjlx(form.getSfyjjlx().trim());
			if(form.getPy() != null && form.getPy().trim().length() > 0)
				entity.setPy(form.getPy().trim());
			if(form.getSystemid() != null && form.getSystemid().trim().length() > 0)
				entity.setSystemid(form.getSystemid().trim());
			if(form.getBhpcsdm() != null && form.getBhpcsdm().trim().length() > 0)
				entity.setBhpcsdm(form.getBhpcsdm().trim());
			if(form.getSsxzqhdm() != null && form.getSsxzqhdm().trim().length() > 0)
				entity.setSsxzqhdm(form.getSsxzqhdm().trim());
			if(form.getMc() != null && form.getMc().trim().length() > 0)
				entity.setMc(form.getMc().trim());
			if(form.getZxzt() != null && form.getZxzt().trim().length() > 0)
				entity.setZxzt(form.getZxzt().trim());
			if(form.getSmzt() != null && form.getSmzt().trim().length() > 0)
				entity.setSmzt(form.getSmzt().trim());
			entity.setGzdbAddtime(form.getGzdbAddtime());
			if(form.getJlxlx() != null && form.getJlxlx().trim().length() > 0)
				entity.setJlxlx(form.getJlxlx().trim());
			if(form.getSsxzjddm() != null && form.getSsxzjddm().trim().length() > 0)
				entity.setSsxzjddm(form.getSsxzjddm().trim());
			entity.setLastupdatedtime(form.getLastupdatedtime());
			if(form.getDm() != null && form.getDm().trim().length() > 0)
				entity.setDm(form.getDm().trim());
			if(form.getJlxly() != null && form.getJlxly().trim().length() > 0)
				entity.setJlxly(form.getJlxly().trim());
		}
	}
	
	public static List<ExGongan76DzJlxForm> convertVoListToFormList(List<ExGongan76DzJlx> exGongan76DzJlxList) {
		if(exGongan76DzJlxList != null && exGongan76DzJlxList.size() > 0) {
			List<ExGongan76DzJlxForm> exGongan76DzJlxFormList = new ArrayList();
			for(int i=0; i<exGongan76DzJlxList.size(); i++) {
				exGongan76DzJlxFormList.add(convertVoToForm(exGongan76DzJlxList.get(i)));
			}
			return exGongan76DzJlxFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<ExGongan76DzJlx> exGongan76DzJlxList) {
		if(exGongan76DzJlxList != null && exGongan76DzJlxList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<exGongan76DzJlxList.size(); i++) {
				ExGongan76DzJlx entity = exGongan76DzJlxList.get(i);
				Map map = new HashMap();

				map.put("sGuid", entity.getSGuid());
				map.put("sCreationTime", entity.getSCreationTime());
				map.put("sLastUpdated", entity.getSLastUpdated());
				map.put("sStatus", entity.getSStatus());
				map.put("sTransStatus", entity.getSTransStatus());
				map.put("sRouteStatus", entity.getSRouteStatus());
				map.put("sSrcNode", entity.getSSrcNode());
				map.put("sDestNode", entity.getSDestNode());
				map.put("px", entity.getPx() == null ? "" : entity.getPx().toString());
				map.put("sssqcjwhdm", entity.getSssqcjwhdm());
				map.put("fjdm", entity.getFjdm());
				map.put("sfyjjlx", entity.getSfyjjlx());
				map.put("py", entity.getPy());
				map.put("systemid", entity.getSystemid());
				map.put("bhpcsdm", entity.getBhpcsdm());
				map.put("ssxzqhdm", entity.getSsxzqhdm());
				map.put("mc", entity.getMc());
				map.put("zxzt", entity.getZxzt());
				map.put("smzt", entity.getSmzt());
				map.put("gzdbAddtime", entity.getGzdbAddtime());
				map.put("jlxlx", entity.getJlxlx());
				map.put("ssxzjddm", entity.getSsxzjddm());
				map.put("lastupdatedtime", entity.getLastupdatedtime());
				map.put("dm", entity.getDm());
				map.put("jlxly", entity.getJlxly());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<ExGongan76DzJlx> convertFormListToVoList(List<ExGongan76DzJlxForm> exGongan76DzJlxFormList) {
		if(exGongan76DzJlxFormList != null && exGongan76DzJlxFormList.size() > 0) {
			List<ExGongan76DzJlx> exGongan76DzJlxList = new ArrayList();
			for(int i=0; i<exGongan76DzJlxFormList.size(); i++) {
				ExGongan76DzJlx exGongan76DzJlx = new ExGongan76DzJlx();
				convertFormToVo(exGongan76DzJlxFormList.get(i), exGongan76DzJlx);
				exGongan76DzJlxList.add(exGongan76DzJlx);
			}
			return exGongan76DzJlxList;
		}
		return null;
	}
}