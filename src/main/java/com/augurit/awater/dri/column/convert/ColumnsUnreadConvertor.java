package com.augurit.awater.dri.column.convert;

import com.augurit.awater.dri.column.entity.ColumnsUnread;
import com.augurit.awater.dri.column.web.form.ColumnsUnreadForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class ColumnsUnreadConvertor {
	public static ColumnsUnreadForm convertVoToForm(ColumnsUnread entity) {
		if(entity != null) {
			ColumnsUnreadForm form = new ColumnsUnreadForm();
			form.setId(entity.getId());
			form.setUserId(entity.getUserId());
			form.setUserName(entity.getUserName());
			form.setXwdtUnread(entity.getXwdtUnread());
			form.setTzggUnread(entity.getTzggUnread());
			form.setJyjlUnread(entity.getJyjlUnread());
			form.setZcfgUnread(entity.getZcfgUnread());
			form.setBzgfUnread(entity.getBzgfUnread());
			form.setHhbUnread(entity.getHhbUnread());
			form.setHongbUnread(entity.getHongbUnread());
			form.setHeibUnread(entity.getHeibUnread());
			form.setCreateTime(entity.getCreateTime());
			form.setUpdateTime(entity.getUpdateTime());
			form.setIsActive(entity.getIsActive());
			form.setCzxzUnread(entity.getCzxzUnread());
			form.setFlsmUnread(entity.getFlsmUnread());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(ColumnsUnreadForm form, ColumnsUnread entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			entity.setUserId(form.getUserId());
			if(form.getUserName() != null && form.getUserName().trim().length() > 0)
				entity.setUserName(form.getUserName().trim());
			entity.setXwdtUnread(form.getXwdtUnread());
			entity.setTzggUnread(form.getTzggUnread());
			entity.setJyjlUnread(form.getJyjlUnread());
			entity.setZcfgUnread(form.getZcfgUnread());
			entity.setBzgfUnread(form.getBzgfUnread());
			entity.setHhbUnread(form.getHhbUnread());
			entity.setHongbUnread(form.getHongbUnread());
			entity.setHeibUnread(form.getHeibUnread());
			entity.setCreateTime(form.getCreateTime());
			entity.setUpdateTime(form.getUpdateTime());
			entity.setIsActive(form.getIsActive());
			entity.setCzxzUnread(form.getCzxzUnread());
			entity.setFlsmUnread(form.getFlsmUnread());
		}
	}
	
	public static List<ColumnsUnreadForm> convertVoListToFormList(List<ColumnsUnread> columnsUnreadList) {
		if(columnsUnreadList != null && columnsUnreadList.size() > 0) {
			List<ColumnsUnreadForm> columnsUnreadFormList = new ArrayList();
			for(int i=0; i<columnsUnreadList.size(); i++) {
				columnsUnreadFormList.add(convertVoToForm(columnsUnreadList.get(i)));
			}
			return columnsUnreadFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<ColumnsUnread> columnsUnreadList) {
		if(columnsUnreadList != null && columnsUnreadList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<columnsUnreadList.size(); i++) {
				ColumnsUnread entity = columnsUnreadList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("userId", entity.getUserId());
				map.put("userName", entity.getUserName());
				map.put("xwdt", entity.getXwdtUnread() == null ? "" : entity.getXwdtUnread().toString());
				map.put("tzggUnread", entity.getTzggUnread() == null ? "" : entity.getTzggUnread().toString());
				map.put("jyjlUnread", entity.getJyjlUnread() == null ? "" : entity.getJyjlUnread().toString());
				map.put("zcfgUnread", entity.getZcfgUnread() == null ? "" : entity.getZcfgUnread().toString());
				map.put("bzgfUnread", entity.getBzgfUnread() == null ? "" : entity.getBzgfUnread().toString());
				map.put("hhbUnread", entity.getHhbUnread() == null ? "" : entity.getHhbUnread().toString());
				map.put("hongbUnread", entity.getHongbUnread() == null ? "" : entity.getHongbUnread().toString());
				map.put("heibUnread", entity.getHeibUnread() == null ? "" : entity.getHeibUnread().toString());
				map.put("createTime", entity.getCreateTime());
				map.put("updateTime", entity.getUpdateTime());
				map.put("isActive", entity.getIsActive() == null ? "" : entity.getIsActive().toString());
				map.put("czxzUnread",entity.getCzxzUnread()==null?"":entity.getCzxzUnread().toString());
				map.put("flsmUnread",entity.getFlsmUnread()==null?"":entity.getFlsmUnread().toString());
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<ColumnsUnread> convertFormListToVoList(List<ColumnsUnreadForm> columnsUnreadFormList) {
		if(columnsUnreadFormList != null && columnsUnreadFormList.size() > 0) {
			List<ColumnsUnread> columnsUnreadList = new ArrayList();
			for(int i=0; i<columnsUnreadFormList.size(); i++) {
				ColumnsUnread columnsUnread = new ColumnsUnread();
				convertFormToVo(columnsUnreadFormList.get(i), columnsUnread);
				columnsUnreadList.add(columnsUnread);
			}
			return columnsUnreadList;
		}
		return null;
	}
}