package com.augurit.awater.dri.psh.sewerageUser.convert;

import com.augurit.awater.dri.psh.sewerageUser.entity.SewerageUser;
import com.augurit.awater.dri.psh.sewerageUser.web.form.SewerageUserForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;



public class SewerageUserConvertor {
	public static SewerageUserForm convertVoToForm(SewerageUser entity) {
		if(entity != null) {
			SewerageUserForm form = new SewerageUserForm();
			form.setId(entity.getId());
			form.setAdministrative(entity.getAdministrative());
			form.setEntryName(entity.getEntryName());
			form.setLicenseKey(entity.getLicenseKey());
			form.setType(entity.getType());
			form.setState(entity.getState());
			form.setCreateTime(entity.getCreateTime());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(SewerageUserForm form, SewerageUser entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			if(form.getAdministrative() != null && form.getAdministrative().trim().length() > 0)
				entity.setAdministrative(form.getAdministrative().trim());
			if(form.getEntryName() != null && form.getEntryName().trim().length() > 0)
				entity.setEntryName(form.getEntryName().trim());
			if(form.getLicenseKey() != null && form.getLicenseKey().trim().length() > 0)
				entity.setLicenseKey(form.getLicenseKey().trim());
			if(form.getType() != null && form.getType().trim().length() > 0)
				entity.setType(form.getType().trim());
			if(form.getState() != null && form.getState().trim().length() > 0)
				entity.setState(form.getState().trim());
			entity.setCreateTime(form.getCreateTime());
		}
	}
	
	public static List<SewerageUserForm> convertVoListToFormList(List<SewerageUser> sewerageUserList) {
		if(sewerageUserList != null && sewerageUserList.size() > 0) {
			List<SewerageUserForm> sewerageUserFormList = new ArrayList();
			for(int i=0; i<sewerageUserList.size(); i++) {
				sewerageUserFormList.add(convertVoToForm(sewerageUserList.get(i)));
			}
			return sewerageUserFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<SewerageUser> sewerageUserList) {
		if(sewerageUserList != null && sewerageUserList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<sewerageUserList.size(); i++) {
				SewerageUser entity = sewerageUserList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("administrative", entity.getAdministrative());
				map.put("entryName", entity.getEntryName());
				map.put("licenseKey", entity.getLicenseKey());
				map.put("type", entity.getType());
				map.put("state", entity.getState());
				map.put("createTime", entity.getCreateTime());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<SewerageUser> convertFormListToVoList(List<SewerageUserForm> sewerageUserFormList) {
		if(sewerageUserFormList != null && sewerageUserFormList.size() > 0) {
			List<SewerageUser> sewerageUserList = new ArrayList();
			for(int i=0; i<sewerageUserFormList.size(); i++) {
				SewerageUser sewerageUser = new SewerageUser();
				convertFormToVo(sewerageUserFormList.get(i), sewerageUser);
				sewerageUserList.add(sewerageUser);
			}
			return sewerageUserList;
		}
		return null;
	}
}