package com.augurit.awater.dri.psh.basic.convert;

import com.augurit.awater.dri.psh.basic.entity.ExGongan77DzMpdy;
import com.augurit.awater.dri.psh.basic.web.form.ExGongan77DzMpdyForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class ExGongan77DzMpdyConvertor {
	public static ExGongan77DzMpdyForm convertVoToForm(ExGongan77DzMpdy entity) {
		if(entity != null) {
			ExGongan77DzMpdyForm form = new ExGongan77DzMpdyForm();
			form.setSGuid(entity.getSGuid());
			form.setSCreationTime(entity.getSCreationTime());
			form.setSLastUpdated(entity.getSLastUpdated());
			form.setSStatus(entity.getSStatus());
			form.setSTransStatus(entity.getSTransStatus());
			form.setSRouteStatus(entity.getSRouteStatus());
			form.setSSrcNode(entity.getSSrcNode());
			form.setSDestNode(entity.getSDestNode());
			form.setDyhs(entity.getDyhs());
			form.setLphm(entity.getLphm());
			form.setLpdzbm(entity.getLpdzbm());
			form.setDzqc(entity.getDzqc());
			form.setSsxzqhdm(entity.getSsxzqhdm());
			form.setDyhm(entity.getDyhm());
			form.setMphm(entity.getMphm());
			form.setZxjd(entity.getZxjd());
			form.setLpdzmc(entity.getLpdzmc());
			form.setMpwzhm(entity.getMpwzhm());
			form.setMpdzbm(entity.getMpdzbm());
			form.setDzmc(entity.getDzmc());
			form.setDzdm(entity.getDzdm());
			form.setSsjlxdm(entity.getSsjlxdm());
			form.setDymc(entity.getDymc());
			form.setSspcsdm(entity.getSspcsdm());
			form.setShr(entity.getShr());
			form.setZxwd(entity.getZxwd());
			form.setDzxxd(entity.getDzxxd());
			form.setMpdzmc(entity.getMpdzmc());
			form.setHh(entity.getHh());
			form.setSffw(entity.getSffw());
			form.setSssqcjwhdm(entity.getSssqcjwhdm());
			form.setXgr(entity.getXgr());
			form.setMplx(entity.getMplx());
			form.setLastupdatedtime(entity.getLastupdatedtime());
			form.setXgsj(entity.getXgsj());
			form.setSmzt(entity.getSmzt());
			form.setFjdzdm(entity.getFjdzdm());
			form.setLpdzmcpy(entity.getLpdzmcpy());
			form.setFwhs(entity.getFwhs());
			form.setShsj(entity.getShsj());
			form.setSfdtl(entity.getSfdtl());
			form.setHjdz(entity.getHjdz());
			form.setDzxz(entity.getDzxz());
			form.setFwcs(entity.getFwcs());
			form.setGzdbAddtime(entity.getGzdbAddtime());
			form.setZxzt(entity.getZxzt());
			form.setLpsszzxqdm(entity.getLpsszzxqdm());
			form.setSystemid(entity.getSystemid());
			form.setJlxlx(entity.getJlxlx());
			form.setCccjsj(entity.getCccjsj());
			form.setCccjr(entity.getCccjr());
			form.setDycs(entity.getDycs());
			form.setSsjwqdm(entity.getSsjwqdm());
			form.setSsxzjddm(entity.getSsxzjddm());
			form.setMpdzmcpy(entity.getMpdzmcpy());
			form.setIsexist(entity.getIsexist());
			form.setIstatue(entity.getIstatue());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(ExGongan77DzMpdyForm form, ExGongan77DzMpdy entity) {
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
			entity.setDyhs(form.getDyhs());
			if(form.getLphm() != null && form.getLphm().trim().length() > 0)
				entity.setLphm(form.getLphm().trim());
			if(form.getLpdzbm() != null && form.getLpdzbm().trim().length() > 0)
				entity.setLpdzbm(form.getLpdzbm().trim());
			if(form.getDzqc() != null && form.getDzqc().trim().length() > 0)
				entity.setDzqc(form.getDzqc().trim());
			if(form.getSsxzqhdm() != null && form.getSsxzqhdm().trim().length() > 0)
				entity.setSsxzqhdm(form.getSsxzqhdm().trim());
			if(form.getDyhm() != null && form.getDyhm().trim().length() > 0)
				entity.setDyhm(form.getDyhm().trim());
			entity.setMphm(form.getMphm());
			entity.setZxjd(form.getZxjd());
			if(form.getLpdzmc() != null && form.getLpdzmc().trim().length() > 0)
				entity.setLpdzmc(form.getLpdzmc().trim());
			if(form.getMpwzhm() != null && form.getMpwzhm().trim().length() > 0)
				entity.setMpwzhm(form.getMpwzhm().trim());
			if(form.getMpdzbm() != null && form.getMpdzbm().trim().length() > 0)
				entity.setMpdzbm(form.getMpdzbm().trim());
			if(form.getDzmc() != null && form.getDzmc().trim().length() > 0)
				entity.setDzmc(form.getDzmc().trim());
			if(form.getDzdm() != null && form.getDzdm().trim().length() > 0)
				entity.setDzdm(form.getDzdm().trim());
			if(form.getSsjlxdm() != null && form.getSsjlxdm().trim().length() > 0)
				entity.setSsjlxdm(form.getSsjlxdm().trim());
			if(form.getDymc() != null && form.getDymc().trim().length() > 0)
				entity.setDymc(form.getDymc().trim());
			if(form.getSspcsdm() != null && form.getSspcsdm().trim().length() > 0)
				entity.setSspcsdm(form.getSspcsdm().trim());
			if(form.getShr() != null && form.getShr().trim().length() > 0)
				entity.setShr(form.getShr().trim());
			entity.setZxwd(form.getZxwd());
			if(form.getDzxxd() != null && form.getDzxxd().trim().length() > 0)
				entity.setDzxxd(form.getDzxxd().trim());
			if(form.getMpdzmc() != null && form.getMpdzmc().trim().length() > 0)
				entity.setMpdzmc(form.getMpdzmc().trim());
			if(form.getHh() != null && form.getHh().trim().length() > 0)
				entity.setHh(form.getHh().trim());
			if(form.getSffw() != null && form.getSffw().trim().length() > 0)
				entity.setSffw(form.getSffw().trim());
			if(form.getSssqcjwhdm() != null && form.getSssqcjwhdm().trim().length() > 0)
				entity.setSssqcjwhdm(form.getSssqcjwhdm().trim());
			if(form.getXgr() != null && form.getXgr().trim().length() > 0)
				entity.setXgr(form.getXgr().trim());
			if(form.getMplx() != null && form.getMplx().trim().length() > 0)
				entity.setMplx(form.getMplx().trim());
			entity.setLastupdatedtime(form.getLastupdatedtime());
			entity.setXgsj(form.getXgsj());
			if(form.getSmzt() != null && form.getSmzt().trim().length() > 0)
				entity.setSmzt(form.getSmzt().trim());
			if(form.getFjdzdm() != null && form.getFjdzdm().trim().length() > 0)
				entity.setFjdzdm(form.getFjdzdm().trim());
			if(form.getLpdzmcpy() != null && form.getLpdzmcpy().trim().length() > 0)
				entity.setLpdzmcpy(form.getLpdzmcpy().trim());
			if(form.getFwhs() != null && form.getFwhs().trim().length() > 0)
				entity.setFwhs(form.getFwhs().trim());
			entity.setShsj(form.getShsj());
			if(form.getSfdtl() != null && form.getSfdtl().trim().length() > 0)
				entity.setSfdtl(form.getSfdtl().trim());
			if(form.getHjdz() != null && form.getHjdz().trim().length() > 0)
				entity.setHjdz(form.getHjdz().trim());
			if(form.getDzxz() != null && form.getDzxz().trim().length() > 0)
				entity.setDzxz(form.getDzxz().trim());
			if(form.getFwcs() != null && form.getFwcs().trim().length() > 0)
				entity.setFwcs(form.getFwcs().trim());
			entity.setGzdbAddtime(form.getGzdbAddtime());
			if(form.getZxzt() != null && form.getZxzt().trim().length() > 0)
				entity.setZxzt(form.getZxzt().trim());
			if(form.getLpsszzxqdm() != null && form.getLpsszzxqdm().trim().length() > 0)
				entity.setLpsszzxqdm(form.getLpsszzxqdm().trim());
			if(form.getSystemid() != null && form.getSystemid().trim().length() > 0)
				entity.setSystemid(form.getSystemid().trim());
			if(form.getJlxlx() != null && form.getJlxlx().trim().length() > 0)
				entity.setJlxlx(form.getJlxlx().trim());
			entity.setCccjsj(form.getCccjsj());
			if(form.getCccjr() != null && form.getCccjr().trim().length() > 0)
				entity.setCccjr(form.getCccjr().trim());
			entity.setDycs(form.getDycs());
			if(form.getSsjwqdm() != null && form.getSsjwqdm().trim().length() > 0)
				entity.setSsjwqdm(form.getSsjwqdm().trim());
			if(form.getSsxzjddm() != null && form.getSsxzjddm().trim().length() > 0)
				entity.setSsxzjddm(form.getSsxzjddm().trim());
			if(form.getMpdzmcpy() != null && form.getMpdzmcpy().trim().length() > 0)
				entity.setMpdzmcpy(form.getMpdzmcpy().trim());
			entity.setIsexist(form.getIsexist());
			entity.setIstatue(form.getIstatue());
		}
	}
	
	public static List<ExGongan77DzMpdyForm> convertVoListToFormList(List<ExGongan77DzMpdy> exGongan77DzMpdyList) {
		if(exGongan77DzMpdyList != null && exGongan77DzMpdyList.size() > 0) {
			List<ExGongan77DzMpdyForm> exGongan77DzMpdyFormList = new ArrayList();
			for(int i=0; i<exGongan77DzMpdyList.size(); i++) {
				exGongan77DzMpdyFormList.add(convertVoToForm(exGongan77DzMpdyList.get(i)));
			}
			return exGongan77DzMpdyFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<ExGongan77DzMpdy> exGongan77DzMpdyList) {
		if(exGongan77DzMpdyList != null && exGongan77DzMpdyList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<exGongan77DzMpdyList.size(); i++) {
				ExGongan77DzMpdy entity = exGongan77DzMpdyList.get(i);
				Map map = new HashMap();

				map.put("sGuid", entity.getSGuid());
				map.put("sCreationTime", entity.getSCreationTime());
				map.put("sLastUpdated", entity.getSLastUpdated());
				map.put("sStatus", entity.getSStatus());
				map.put("sTransStatus", entity.getSTransStatus());
				map.put("sRouteStatus", entity.getSRouteStatus());
				map.put("sSrcNode", entity.getSSrcNode());
				map.put("sDestNode", entity.getSDestNode());
				map.put("dyhs", entity.getDyhs() == null ? "" : entity.getDyhs().toString());
				map.put("lphm", entity.getLphm());
				map.put("lpdzbm", entity.getLpdzbm());
				map.put("dzqc", entity.getDzqc());
				map.put("ssxzqhdm", entity.getSsxzqhdm());
				map.put("dyhm", entity.getDyhm());
				map.put("mphm", entity.getMphm() == null ? "" : entity.getMphm().toString());
				map.put("zxjd", entity.getZxjd() == null ? "" : entity.getZxjd().toString());
				map.put("lpdzmc", entity.getLpdzmc());
				map.put("mpwzhm", entity.getMpwzhm());
				map.put("mpdzbm", entity.getMpdzbm());
				map.put("dzmc", entity.getDzmc());
				map.put("dzdm", entity.getDzdm());
				map.put("ssjlxdm", entity.getSsjlxdm());
				map.put("dymc", entity.getDymc());
				map.put("sspcsdm", entity.getSspcsdm());
				map.put("shr", entity.getShr());
				map.put("zxwd", entity.getZxwd() == null ? "" : entity.getZxwd().toString());
				map.put("dzxxd", entity.getDzxxd());
				map.put("mpdzmc", entity.getMpdzmc());
				map.put("hh", entity.getHh());
				map.put("sffw", entity.getSffw());
				map.put("sssqcjwhdm", entity.getSssqcjwhdm());
				map.put("xgr", entity.getXgr());
				map.put("mplx", entity.getMplx());
				map.put("lastupdatedtime", entity.getLastupdatedtime());
				map.put("xgsj", entity.getXgsj());
				map.put("smzt", entity.getSmzt());
				map.put("fjdzdm", entity.getFjdzdm());
				map.put("lpdzmcpy", entity.getLpdzmcpy());
				map.put("fwhs", entity.getFwhs());
				map.put("shsj", entity.getShsj());
				map.put("sfdtl", entity.getSfdtl());
				map.put("hjdz", entity.getHjdz());
				map.put("dzxz", entity.getDzxz());
				map.put("fwcs", entity.getFwcs());
				map.put("gzdbAddtime", entity.getGzdbAddtime());
				map.put("zxzt", entity.getZxzt());
				map.put("lpsszzxqdm", entity.getLpsszzxqdm());
				map.put("systemid", entity.getSystemid());
				map.put("jlxlx", entity.getJlxlx());
				map.put("cccjsj", entity.getCccjsj());
				map.put("cccjr", entity.getCccjr());
				map.put("dycs", entity.getDycs() == null ? "" : entity.getDycs().toString());
				map.put("ssjwqdm", entity.getSsjwqdm());
				map.put("ssxzjddm", entity.getSsxzjddm());
				map.put("mpdzmcpy", entity.getMpdzmcpy());
				map.put("isexist", entity.getIsexist());
				map.put("istatue", entity.getIstatue());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<ExGongan77DzMpdy> convertFormListToVoList(List<ExGongan77DzMpdyForm> exGongan77DzMpdyFormList) {
		if(exGongan77DzMpdyFormList != null && exGongan77DzMpdyFormList.size() > 0) {
			List<ExGongan77DzMpdy> exGongan77DzMpdyList = new ArrayList();
			for(int i=0; i<exGongan77DzMpdyFormList.size(); i++) {
				ExGongan77DzMpdy exGongan77DzMpdy = new ExGongan77DzMpdy();
				convertFormToVo(exGongan77DzMpdyFormList.get(i), exGongan77DzMpdy);
				exGongan77DzMpdyList.add(exGongan77DzMpdy);
			}
			return exGongan77DzMpdyList;
		}
		return null;
	}
}