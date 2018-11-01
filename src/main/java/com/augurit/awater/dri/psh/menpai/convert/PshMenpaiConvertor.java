package com.augurit.awater.dri.psh.menpai.convert;

import com.augurit.awater.dri.psh.menpai.entity.PshMenpai;
import com.augurit.awater.dri.psh.menpai.web.form.PshMenpaiForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class PshMenpaiConvertor {
	public static PshMenpaiForm convertVoToForm(PshMenpai entity) {
		if(entity != null) {
			PshMenpaiForm form = new PshMenpaiForm();
			form.setParentOrgId(entity.getParentOrgId());
			form.setParentOrgName(entity.getParentOrgName());
			form.setIstatue(entity.getIstatue());
			form.setSGuid(entity.getSGuid());
			form.setSsxzqh(entity.getSsxzqh());
			form.setSsxzjd(entity.getSsxzjd());
			form.setSssqcjwh(entity.getSssqcjwh());
			form.setSsjlx(entity.getSsjlx());
			form.setMpdzmc(entity.getMpdzmc());
			form.setMpwzhm(entity.getMpwzhm());
			form.setDzqc(entity.getDzqc());
			form.setZxjd(entity.getZxjd());
			form.setZxwd(entity.getZxwd());
			form.setMarkPersonId(entity.getMarkPersonId());
			form.setMarkPerson(entity.getMarkPerson());
			form.setMarkTime(entity.getMarkTime());
			form.setUpdateTime(entity.getUpdateTime());
			form.setDescription(entity.getDescription());
			form.setState(entity.getState());
			form.setCheckPersonId(entity.getCheckPersonId());
			form.setCheckPerson(entity.getCheckPerson());
			form.setCheckTime(entity.getCheckTime());
			form.setCheckDescription(entity.getCheckDescription());
			form.setLoginName(entity.getLoginName());
			form.setDirectOrgId(entity.getDirectOrgId());
			form.setDirectOrgName(entity.getDirectOrgName());
			form.setTeamOrgId(entity.getTeamOrgId());
			form.setTeamOrgName(entity.getTeamOrgName());
			form.setDzdm(entity.getDzdm());
			form.setInvestPersonId(entity.getInvestPersonId());
			form.setInvertTime(entity.getInvertTime());
			form.setObjectId(entity.getObjectId());
			form.setKjArea(entity.getKjArea());
			form.setKjTown(entity.getKjTown());
			form.setKjVillage(entity.getKjVillage());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(PshMenpaiForm form, PshMenpai entity) {
		if(entity != null && form != null) {
			if(form.getParentOrgId() != null && form.getParentOrgId().trim().length() > 0)
				entity.setParentOrgId(form.getParentOrgId().trim());
			if(form.getParentOrgName() != null && form.getParentOrgName().trim().length() > 0)
				entity.setParentOrgName(form.getParentOrgName().trim());
			if(form.getIstatue() != null && form.getIstatue().trim().length() > 0)
				entity.setIstatue(form.getIstatue().trim());
			if(form.getSGuid() != null && form.getSGuid().trim().length() > 0)
				entity.setSGuid(form.getSGuid().trim());
			if(form.getSsxzqh() != null && form.getSsxzqh().trim().length() > 0)
				entity.setSsxzqh(form.getSsxzqh().trim());
			if(form.getSsxzjd() != null && form.getSsxzjd().trim().length() > 0)
				entity.setSsxzjd(form.getSsxzjd().trim());
			if(form.getSssqcjwh() != null && form.getSssqcjwh().trim().length() > 0)
				entity.setSssqcjwh(form.getSssqcjwh().trim());
			if(form.getSsjlx() != null && form.getSsjlx().trim().length() > 0)
				entity.setSsjlx(form.getSsjlx().trim());
			if(form.getMpdzmc() != null && form.getMpdzmc().trim().length() > 0)
				entity.setMpdzmc(form.getMpdzmc().trim());
			if(form.getMpwzhm() != null && form.getMpwzhm().trim().length() > 0)
				entity.setMpwzhm(form.getMpwzhm().trim());
			if(form.getDzqc() != null && form.getDzqc().trim().length() > 0)
				entity.setDzqc(form.getDzqc().trim());
			entity.setZxjd(form.getZxjd());
			entity.setZxwd(form.getZxwd());
			if(form.getMarkPersonId() != null && form.getMarkPersonId().trim().length() > 0)
				entity.setMarkPersonId(form.getMarkPersonId().trim());
			if(form.getMarkPerson() != null && form.getMarkPerson().trim().length() > 0)
				entity.setMarkPerson(form.getMarkPerson().trim());
			if(form.getMarkTime()!=null){
				entity.setMarkTime(form.getMarkTime());
			}
			entity.setUpdateTime(form.getUpdateTime());
			if(form.getDescription() != null && form.getDescription().trim().length() > 0)
				entity.setDescription(form.getDescription().trim());
			if(form.getState() != null && form.getState().trim().length() > 0)
				entity.setState(form.getState().trim());
			if(form.getCheckPersonId() != null && form.getCheckPersonId().trim().length() > 0)
				entity.setCheckPersonId(form.getCheckPersonId().trim());
			if(form.getCheckPerson() != null && form.getCheckPerson().trim().length() > 0)
				entity.setCheckPerson(form.getCheckPerson().trim());
			if(form.getInvertTime()!=null){
				entity.setCheckTime(form.getCheckTime());
			}
			if(form.getCheckDescription() != null && form.getCheckDescription().trim().length() > 0)
				entity.setCheckDescription(form.getCheckDescription().trim());
			if(form.getLoginName() != null && form.getLoginName().trim().length() > 0)
				entity.setLoginName(form.getLoginName().trim());
			if(form.getDirectOrgId() != null && form.getDirectOrgId().trim().length() > 0)
				entity.setDirectOrgId(form.getDirectOrgId().trim());
			if(form.getDirectOrgName() != null && form.getDirectOrgName().trim().length() > 0)
				entity.setDirectOrgName(form.getDirectOrgName().trim());
			if(form.getTeamOrgId() != null && form.getTeamOrgId().trim().length() > 0)
				entity.setTeamOrgId(form.getTeamOrgId().trim());
			if(form.getTeamOrgName() != null && form.getTeamOrgName().trim().length() > 0)
				entity.setTeamOrgName(form.getTeamOrgName().trim());
			if(form.getDzdm() != null && form.getDzdm().trim().length() > 0)
				entity.setDzdm(form.getDzdm().trim());
			if(form.getInvertTime()!=null){
				entity.setInvertTime(form.getInvertTime());
			}
			if(form.getInvestPersonId() != null && form.getInvestPersonId().trim().length() > 0)
				entity.setInvestPersonId(form.getInvestPersonId().trim());
			if(form.getObjectId() != null && form.getObjectId().trim().length() > 0)
				entity.setObjectId(form.getObjectId().trim());
			if(form.getKjArea() != null && form.getKjArea().trim().length() > 0)
				entity.setKjArea(form.getKjArea());
			if(form.getKjTown() != null && form.getKjTown().trim().length() > 0)
				entity.setKjTown(form.getKjTown());
			if(form.getKjVillage() != null && form.getKjVillage().trim().length() > 0)
				entity.setKjVillage(form.getKjVillage());
		}
	}
	
	public static List<PshMenpaiForm> convertVoListToFormList(List<PshMenpai> pshMenpaiList) {
		if(pshMenpaiList != null && pshMenpaiList.size() > 0) {
			List<PshMenpaiForm> pshMenpaiFormList = new ArrayList();
			for(int i=0; i<pshMenpaiList.size(); i++) {
				pshMenpaiFormList.add(convertVoToForm(pshMenpaiList.get(i)));
			}
			return pshMenpaiFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<PshMenpai> pshMenpaiList) {
		if(pshMenpaiList != null && pshMenpaiList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<pshMenpaiList.size(); i++) {
				PshMenpai entity = pshMenpaiList.get(i);
				Map map = new HashMap();

				map.put("parentOrgId", entity.getParentOrgId());
				map.put("parentOrgName", entity.getParentOrgName());
				map.put("istatue", entity.getIstatue());
				map.put("sGuid", entity.getSGuid());
				map.put("ssxzqh", entity.getSsxzqh());
				map.put("ssxzjd", entity.getSsxzjd());
				map.put("sssqcjwh", entity.getSssqcjwh());
				map.put("ssjlx", entity.getSsjlx());
				map.put("mpdzmc", entity.getMpdzmc());
				map.put("mpwzhm", entity.getMpwzhm());
				map.put("dzqc", entity.getDzqc());
				map.put("zxjd", entity.getZxjd() == null ? "" : entity.getZxjd().toString());
				map.put("zxwd", entity.getZxwd() == null ? "" : entity.getZxwd().toString());
				map.put("markPersonId", entity.getMarkPersonId());
				map.put("markPerson", entity.getMarkPerson());
				map.put("markTime", entity.getMarkTime());
				map.put("updateTime", entity.getUpdateTime());
				map.put("description", entity.getDescription());
				map.put("state", entity.getState());
				map.put("checkPersonId", entity.getCheckPersonId());
				map.put("checkPerson", entity.getCheckPerson());
				map.put("checkTime", entity.getCheckTime());
				map.put("checkDescription", entity.getCheckDescription());
				map.put("loginName", entity.getLoginName());
				map.put("directOrgId", entity.getDirectOrgId());
				map.put("directOrgName", entity.getDirectOrgName());
				map.put("teamOrgId", entity.getTeamOrgId());
				map.put("teamOrgName", entity.getTeamOrgName());
				map.put("dzdm", entity.getDzdm());
				map.put("investPersonId", entity.getInvestPersonId());
				map.put("invertTime", entity.getInvertTime());
				map.put("objectId", entity.getObjectId());
				map.put("kjArea", entity.getKjArea());
				map.put("kjTown", entity.getKjTown());
				map.put("kjVillage", entity.getKjVillage());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<PshMenpai> convertFormListToVoList(List<PshMenpaiForm> pshMenpaiFormList) {
		if(pshMenpaiFormList != null && pshMenpaiFormList.size() > 0) {
			List<PshMenpai> pshMenpaiList = new ArrayList();
			for(int i=0; i<pshMenpaiFormList.size(); i++) {
				PshMenpai pshMenpai = new PshMenpai();
				convertFormToVo(pshMenpaiFormList.get(i), pshMenpai);
				pshMenpaiList.add(pshMenpai);
			}
			return pshMenpaiList;
		}
		return null;
	}
}