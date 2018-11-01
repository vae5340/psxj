package com.augurit.awater.dri.psh.install.convert;

import com.augurit.awater.dri.psh.install.entity.PshInstallRecord;
import com.augurit.awater.dri.psh.install.web.form.PshInstallRecordForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class PshInstallRecordConvertor {
	public static PshInstallRecordForm convertVoToForm(PshInstallRecord entity) {
		if(entity != null) {
			PshInstallRecordForm form = new PshInstallRecordForm();
			form.setId(entity.getId());
			form.setLoginName(entity.getLoginName());
			form.setUserName(entity.getUserName());
			form.setInstallTime(entity.getInstallTime());
			form.setDeviceCode(entity.getDeviceCode());
			form.setTeamOrgId(entity.getTeamOrgId());
			form.setTeamOrgName(entity.getTeamOrgName());
			form.setDirectOrgId(entity.getDirectOrgId());
			form.setDirectOrgName(entity.getDirectOrgName());
			form.setSuperviseOrgId(entity.getSuperviseOrgId());
			form.setSuperviseOrgName(entity.getSuperviseOrgName());
			form.setParentOrgId(entity.getParentOrgId());
			form.setParentOrgName(entity.getParentOrgName());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(PshInstallRecordForm form, PshInstallRecord entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			if(form.getLoginName() != null && form.getLoginName().trim().length() > 0)
				entity.setLoginName(form.getLoginName().trim());
			if(form.getUserName() != null && form.getUserName().trim().length() > 0)
				entity.setUserName(form.getUserName().trim());
			entity.setInstallTime(form.getInstallTime());
			if(form.getDeviceCode() != null && form.getDeviceCode().trim().length() > 0)
				entity.setDeviceCode(form.getDeviceCode().trim());
			if(form.getTeamOrgId() != null && form.getTeamOrgId().trim().length() > 0)
				entity.setTeamOrgId(form.getTeamOrgId().trim());
			if(form.getTeamOrgName() != null && form.getTeamOrgName().trim().length() > 0)
				entity.setTeamOrgName(form.getTeamOrgName().trim());
			if(form.getDirectOrgId() != null && form.getDirectOrgId().trim().length() > 0)
				entity.setDirectOrgId(form.getDirectOrgId().trim());
			if(form.getDirectOrgName() != null && form.getDirectOrgName().trim().length() > 0)
				entity.setDirectOrgName(form.getDirectOrgName().trim());
			if(form.getSuperviseOrgId() != null && form.getSuperviseOrgId().trim().length() > 0)
				entity.setSuperviseOrgId(form.getSuperviseOrgId().trim());
			if(form.getSuperviseOrgName() != null && form.getSuperviseOrgName().trim().length() > 0)
				entity.setSuperviseOrgName(form.getSuperviseOrgName().trim());
			if(form.getParentOrgId() != null && form.getParentOrgId().trim().length() > 0)
				entity.setParentOrgId(form.getParentOrgId().trim());
			if(form.getParentOrgName() != null && form.getParentOrgName().trim().length() > 0)
				entity.setParentOrgName(form.getParentOrgName().trim());
		}
	}
	
	public static List<PshInstallRecordForm> convertVoListToFormList(List<PshInstallRecord> pshInstallRecordList) {
		if(pshInstallRecordList != null && pshInstallRecordList.size() > 0) {
			List<PshInstallRecordForm> pshInstallRecordFormList = new ArrayList();
			for(int i=0; i<pshInstallRecordList.size(); i++) {
				pshInstallRecordFormList.add(convertVoToForm(pshInstallRecordList.get(i)));
			}
			return pshInstallRecordFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<PshInstallRecord> pshInstallRecordList) {
		if(pshInstallRecordList != null && pshInstallRecordList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<pshInstallRecordList.size(); i++) {
				PshInstallRecord entity = pshInstallRecordList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("loginName", entity.getLoginName());
				map.put("userName", entity.getUserName());
				map.put("installTime", entity.getInstallTime());
				map.put("deviceCode", entity.getDeviceCode());
				map.put("teamOrgId", entity.getTeamOrgId());
				map.put("teamOrgName", entity.getTeamOrgName());
				map.put("directOrgId", entity.getDirectOrgId());
				map.put("directOrgName", entity.getDirectOrgName());
				map.put("superviseOrgId", entity.getSuperviseOrgId());
				map.put("superviseOrgName", entity.getSuperviseOrgName());
				map.put("parentOrgId", entity.getParentOrgId());
				map.put("parentOrgName", entity.getParentOrgName());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<PshInstallRecord> convertFormListToVoList(List<PshInstallRecordForm> pshInstallRecordFormList) {
		if(pshInstallRecordFormList != null && pshInstallRecordFormList.size() > 0) {
			List<PshInstallRecord> pshInstallRecordList = new ArrayList();
			for(int i=0; i<pshInstallRecordFormList.size(); i++) {
				PshInstallRecord pshInstallRecord = new PshInstallRecord();
				convertFormToVo(pshInstallRecordFormList.get(i), pshInstallRecord);
				pshInstallRecordList.add(pshInstallRecord);
			}
			return pshInstallRecordList;
		}
		return null;
	}
}