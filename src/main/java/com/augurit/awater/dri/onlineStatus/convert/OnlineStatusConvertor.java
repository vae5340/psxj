package com.augurit.awater.dri.onlineStatus.convert;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.augurit.awater.dri.onlineStatus.entity.OnlineStatus;
import com.augurit.awater.dri.onlineStatus.web.form.OnlineStatusForm;

import java.util.*;


public class OnlineStatusConvertor {
	public static OnlineStatusForm convertVoToForm(OnlineStatus entity) {
		if(entity != null) {
			OnlineStatusForm form = new OnlineStatusForm();
			form.setId(entity.getId());
			form.setUserId(entity.getUserId());
			form.setStatus(entity.getStatus());
			form.setOs(entity.getOs());
			form.setTime(entity.getTime());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(OnlineStatusForm form, OnlineStatus entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			if(form.getUserId() != null && form.getUserId().trim().length() > 0)
				entity.setUserId(form.getUserId().trim());
			entity.setStatus(form.getStatus());
			if(form.getOs() != null && form.getOs().trim().length() > 0)
				entity.setOs(form.getOs().trim());
			entity.setTime(form.getTime());
		}
	}
	
	public static List<OnlineStatusForm> convertVoListToFormList(List<OnlineStatus> onlineStatusList) {
		if(onlineStatusList != null && onlineStatusList.size() > 0) {
			List<OnlineStatusForm> onlineStatusFormList = new ArrayList();
			for(int i=0; i<onlineStatusList.size(); i++) {
				onlineStatusFormList.add(convertVoToForm(onlineStatusList.get(i)));
			}
			return onlineStatusFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<OnlineStatus> onlineStatusList) {
		if(onlineStatusList != null && onlineStatusList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<onlineStatusList.size(); i++) {
				OnlineStatus entity = onlineStatusList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("userId", entity.getUserId());
				map.put("status", entity.getStatus() == null ? "" : entity.getStatus().toString());
				map.put("os", entity.getOs());
				map.put("time", entity.getTime());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<OnlineStatus> convertFormListToVoList(List<OnlineStatusForm> onlineStatusFormList) {
		if(onlineStatusFormList != null && onlineStatusFormList.size() > 0) {
			List<OnlineStatus> onlineStatusList = new ArrayList();
			for(int i=0; i<onlineStatusFormList.size(); i++) {
				OnlineStatus onlineStatus = new OnlineStatus();
				convertFormToVo(onlineStatusFormList.get(i), onlineStatus);
				onlineStatusList.add(onlineStatus);
			}
			return onlineStatusList;
		}
		return null;
	}

	public static OnlineStatusForm convertJsonToOnlineStatusForm(final String json){
		OnlineStatusForm onlineStatusForm=null;
		if(null!=json&&!"".equals(json)) {
			JSONArray jsonArray=JSONArray.parseArray(json);
			if(null!=jsonArray&&jsonArray.size()>0) {
				JSONObject jsonObject=(JSONObject) jsonArray.get(0);
				int max=0;
				//取最新的数据
				long maxTime=Long.parseLong(jsonObject.get("time").toString());
				long now;
				for(int i=1;i<jsonArray.size();i++){
					now=Long.parseLong(((JSONObject)jsonArray.get(i)).get("time").toString());
					if(now>maxTime){
						maxTime=now;
						max=i;
					}
				}
				jsonObject=(JSONObject)jsonArray.get(max);
				onlineStatusForm = new OnlineStatusForm();
				if (jsonObject.containsKey("userid") && null != jsonObject.get("userid")) {
					onlineStatusForm.setUserId(jsonObject.get("userid").toString().trim());
				}
				if (jsonObject.containsKey("status") && null != jsonObject.get("status")) {
					onlineStatusForm.setStatus(jsonObject.get("status").toString().trim());
				}
				if (jsonObject.containsKey("os") && null != jsonObject.get("os")) {
					onlineStatusForm.setOs(jsonObject.get("os").toString().trim());
				}
				if (jsonObject.containsKey("time") && null != jsonObject.get("time")) {
					onlineStatusForm.setTime(new Date(Long.parseLong(jsonObject.get("time").toString().trim())));
				}
			}
		}
		return onlineStatusForm;
	}
}