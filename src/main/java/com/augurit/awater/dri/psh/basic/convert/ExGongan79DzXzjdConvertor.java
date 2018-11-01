package com.augurit.awater.dri.psh.basic.convert;

import com.augurit.awater.dri.psh.basic.entity.ExGongan79DzXzjd;
import com.augurit.awater.dri.psh.basic.web.form.ExGongan79DzXzjdForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ExGongan79DzXzjdConvertor {
	public static ExGongan79DzXzjdForm convertVoToForm(ExGongan79DzXzjd entity) {
		if(entity != null) {
			ExGongan79DzXzjdForm form = new ExGongan79DzXzjdForm();
			form.setSGuid(entity.getSGuid());
			form.setSCreationTime(entity.getSCreationTime());
			form.setSLastUpdated(entity.getSLastUpdated());
			form.setSStatus(entity.getSStatus());
			form.setSTransStatus(entity.getSTransStatus());
			form.setSRouteStatus(entity.getSRouteStatus());
			form.setSSrcNode(entity.getSSrcNode());
			form.setSDestNode(entity.getSDestNode());
			form.setMc(entity.getMc());
			form.setBhpcsdm(entity.getBhpcsdm());
			form.setSsxzqhdm(entity.getSsxzqhdm());
			form.setLastupdatedtime(entity.getLastupdatedtime());
			form.setGzdbAddtime(entity.getGzdbAddtime());
			form.setSystemid(entity.getSystemid());
			form.setZxzt(entity.getZxzt());
			form.setPy(entity.getPy());
			form.setDm(entity.getDm());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(ExGongan79DzXzjdForm form, ExGongan79DzXzjd entity) {
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
			if(form.getMc() != null && form.getMc().trim().length() > 0)
				entity.setMc(form.getMc().trim());
			if(form.getBhpcsdm() != null && form.getBhpcsdm().trim().length() > 0)
				entity.setBhpcsdm(form.getBhpcsdm().trim());
			if(form.getSsxzqhdm() != null && form.getSsxzqhdm().trim().length() > 0)
				entity.setSsxzqhdm(form.getSsxzqhdm().trim());
			entity.setLastupdatedtime(form.getLastupdatedtime());
			entity.setGzdbAddtime(form.getGzdbAddtime());
			if(form.getSystemid() != null && form.getSystemid().trim().length() > 0)
				entity.setSystemid(form.getSystemid().trim());
			if(form.getZxzt() != null && form.getZxzt().trim().length() > 0)
				entity.setZxzt(form.getZxzt().trim());
			if(form.getPy() != null && form.getPy().trim().length() > 0)
				entity.setPy(form.getPy().trim());
			if(form.getDm() != null && form.getDm().trim().length() > 0)
				entity.setDm(form.getDm().trim());
		}
	}
	
	public static List<ExGongan79DzXzjdForm> convertVoListToFormList(List<ExGongan79DzXzjd> exGongan79DzXzjdList) {
		if(exGongan79DzXzjdList != null && exGongan79DzXzjdList.size() > 0) {
			List<ExGongan79DzXzjdForm> exGongan79DzXzjdFormList = new ArrayList();
			for(int i=0; i<exGongan79DzXzjdList.size(); i++) {
				exGongan79DzXzjdFormList.add(convertVoToForm(exGongan79DzXzjdList.get(i)));
			}
			return exGongan79DzXzjdFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<ExGongan79DzXzjd> exGongan79DzXzjdList) {
		if(exGongan79DzXzjdList != null && exGongan79DzXzjdList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<exGongan79DzXzjdList.size(); i++) {
				ExGongan79DzXzjd entity = exGongan79DzXzjdList.get(i);
				Map map = new HashMap();

				map.put("sGuid", entity.getSGuid());
				map.put("sCreationTime", entity.getSCreationTime());
				map.put("sLastUpdated", entity.getSLastUpdated());
				map.put("sStatus", entity.getSStatus());
				map.put("sTransStatus", entity.getSTransStatus());
				map.put("sRouteStatus", entity.getSRouteStatus());
				map.put("sSrcNode", entity.getSSrcNode());
				map.put("sDestNode", entity.getSDestNode());
				map.put("mc", entity.getMc());
				map.put("bhpcsdm", entity.getBhpcsdm());
				map.put("ssxzqhdm", entity.getSsxzqhdm());
				map.put("lastupdatedtime", entity.getLastupdatedtime());
				map.put("gzdbAddtime", entity.getGzdbAddtime());
				map.put("systemid", entity.getSystemid());
				map.put("zxzt", entity.getZxzt());
				map.put("py", entity.getPy());
				map.put("dm", entity.getDm());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<ExGongan79DzXzjd> convertFormListToVoList(List<ExGongan79DzXzjdForm> exGongan79DzXzjdFormList) {
		if(exGongan79DzXzjdFormList != null && exGongan79DzXzjdFormList.size() > 0) {
			List<ExGongan79DzXzjd> exGongan79DzXzjdList = new ArrayList();
			for(int i=0; i<exGongan79DzXzjdFormList.size(); i++) {
				ExGongan79DzXzjd exGongan79DzXzjd = new ExGongan79DzXzjd();
				convertFormToVo(exGongan79DzXzjdFormList.get(i), exGongan79DzXzjd);
				exGongan79DzXzjdList.add(exGongan79DzXzjd);
			}
			return exGongan79DzXzjdList;
		}
		return null;
	}
}