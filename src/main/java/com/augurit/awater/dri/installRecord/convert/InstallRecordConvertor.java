package com.augurit.awater.dri.installRecord.convert;

import com.augurit.awater.dri.installRecord.entity.InstallRecord;
import com.augurit.awater.dri.installRecord.web.form.InstallRecordForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class InstallRecordConvertor {
	public static InstallRecordForm convertVoToForm(InstallRecord entity) {
		if(entity != null) {
			InstallRecordForm form = new InstallRecordForm();
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
	
	public static void convertFormToVo(InstallRecordForm form, InstallRecord entity) {
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
	
	public static List<InstallRecordForm> convertVoListToFormList(List<InstallRecord> InstallRecordList) {
		if(InstallRecordList != null && InstallRecordList.size() > 0) {
			List<InstallRecordForm> InstallRecordFormList = new ArrayList();
			for(int i=0; i<InstallRecordList.size(); i++) {
				InstallRecordFormList.add(convertVoToForm(InstallRecordList.get(i)));
			}
			return InstallRecordFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<InstallRecord> InstallRecordList) {
		if(InstallRecordList != null && InstallRecordList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<InstallRecordList.size(); i++) {
				InstallRecord entity = InstallRecordList.get(i);
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
	
	public static List<InstallRecord> convertFormListToVoList(List<InstallRecordForm> InstallRecordFormList) {
		if(InstallRecordFormList != null && InstallRecordFormList.size() > 0) {
			List<InstallRecord> InstallRecordList = new ArrayList();
			for(int i=0; i<InstallRecordFormList.size(); i++) {
				InstallRecord InstallRecord = new InstallRecord();
				convertFormToVo(InstallRecordFormList.get(i), InstallRecord);
				InstallRecordList.add(InstallRecord);
			}
			return InstallRecordList;
		}
		return null;
	}
}