package com.augurit.awater.dri.dailySign.convert;

import com.augurit.awater.dri.dailySign.entity.DailySign;
import com.augurit.awater.dri.dailySign.web.form.DailySignForm;
import com.augurit.awater.util.ThirdUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class DailySignConvertor {
	public static DailySignForm convertVoToForm(DailySign entity) {
		if(entity != null) {
			DailySignForm form = new DailySignForm();
			form.setId(entity.getId());
			form.setSignerId(entity.getSignerId());
			form.setSignerName(entity.getSignerName());
			form.setSignTime(entity.getSignTime());
			form.setX(entity.getX());
			form.setY(entity.getY());
			form.setRoad(entity.getRoad());
			form.setAddr(entity.getAddr());
			form.setOrgSeq(entity.getOrgSeq());
			form.setAppVersion(entity.getAppVersion());
			form.setCreateTime(entity.getCreateTime());
			form.setOrgName(entity.getOrgName());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(DailySignForm form, DailySign entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			entity.setSignerId(form.getSignerId());
			if(form.getSignerName() != null && form.getSignerName().trim().length() > 0)
				entity.setSignerName(form.getSignerName().trim());
			entity.setSignTime(form.getSignTime());
			entity.setX(form.getX());
			entity.setY(form.getY());
			if(form.getRoad() != null && form.getRoad().trim().length() > 0)
				entity.setRoad(form.getRoad().trim());
			if(form.getAddr() != null && form.getAddr().trim().length() > 0)
				entity.setAddr(form.getAddr().trim());
			if(form.getOrgSeq() != null && form.getOrgSeq().trim().length() > 0)
				entity.setOrgSeq(form.getOrgSeq().trim());
			if(form.getAppVersion()!=null&&form.getAppVersion().trim().length()>0)
				entity.setAppVersion(form.getAppVersion().trim());
			if(form.getOrgName()!=null&&form.getOrgName().trim().length()>0)
				entity.setOrgName(form.getOrgName().trim());
			entity.setCreateTime(form.getCreateTime());
		}
	}
	
	public static List<DailySignForm> convertVoListToFormList(List<DailySign> dailySignList) {
		if(dailySignList != null && dailySignList.size() > 0) {
			List<DailySignForm> dailySignFormList = new ArrayList();
			for(int i=0; i<dailySignList.size(); i++) {
				dailySignFormList.add(convertVoToForm(dailySignList.get(i)));
			}
			return dailySignFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<DailySign> dailySignList) {
		if(dailySignList != null && dailySignList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<dailySignList.size(); i++) {
				DailySign entity = dailySignList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("signerId", entity.getSignerId());
				map.put("signerName", entity.getSignerName());
				map.put("signTime", entity.getSignTime());
				map.put("x", entity.getX() == null ? "" : entity.getX().toString());
				map.put("y", entity.getY() == null ? "" : entity.getY().toString());
				map.put("road", entity.getRoad());
				map.put("addr", entity.getAddr());
				map.put("orgSeq", entity.getOrgSeq());
				map.put("createTime", entity.getCreateTime());
				map.put("orgName",entity.getOrgName());
				map.put("appVersion",entity.getAppVersion());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<DailySign> convertFormListToVoList(List<DailySignForm> dailySignFormList) {
		if(dailySignFormList != null && dailySignFormList.size() > 0) {
			List<DailySign> dailySignList = new ArrayList();
			for(int i=0; i<dailySignFormList.size(); i++) {
				DailySign dailySign = new DailySign();
				convertFormToVo(dailySignFormList.get(i), dailySign);
				dailySignList.add(dailySign);
			}
			return dailySignList;
		}
		return null;
	}

	public static String getDistrictOrgCode(String orgName){
		if(null!=orgName&&orgName.trim().length()>0){
			String orgList= ThirdUtils.getProperties().getProperty("orgList");
			if(null!=orgList){
				String[] orgArray=orgList.split(",");
				String[] org=null;
				if(null!=orgArray){
					for(int i=0;i<orgArray.length;i++){
						org=orgArray[i].split(":");
						if(orgName.contains(org[1])){
							return org[0];
						}
					}
				}
			}
		}
		return null;
	}

	public static final void convertOrgName(DailySignForm dailySignForm){
		if(dailySignForm==null||dailySignForm.getOrgSeq()==null)
			return;
		String orgCode=dailySignForm.getOrgSeq();
		String orgList= ThirdUtils.getProperties().getProperty("orgList");
		if(null!=orgList){
			String[] orgArray=orgList.split(",");
			String[] org=null;
			boolean isDefault=true;
			if(null!=orgArray) {
				for(int i=0;i<orgArray.length;i++){
					org=orgArray[i].split(":");
					if (orgCode.indexOf(org[0]) >= 0){
						dailySignForm.setOrgName(org[1]);
						isDefault=false;
					}
				}
			}
		}
	}

	public static final void convertOrgName(List<DailySign> dailySignFormList){
		if(dailySignFormList==null||dailySignFormList.size()>0)
			return;
		String orgList= ThirdUtils.getProperties().getProperty("orgList");
		if (null != orgList) {
			String[] orgArray=orgList.split(",");
			for (DailySign dailySign : dailySignFormList) {
				String orgCode = dailySign.getOrgSeq();
				String[] org = null;
				if (null != orgArray&&orgCode!=null) {
					for (int i = 0; i < orgArray.length; i++) {
						org = orgArray[i].split(":");
						if (orgCode.contains(org[0])) {
							dailySign.setOrgName(org[1]);
							break;
						}
					}
				}
			}
		}
	}
}