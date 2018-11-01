package com.augurit.awater.dri.psh.sewerageUser.convert;

import com.augurit.awater.dri.psh.sewerageUser.entity.SewerageUserAttachment;
import com.augurit.awater.dri.psh.sewerageUser.web.form.SewerageUserAttachmentForm;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;



public class SewerageUserAttachmentConvertor {
	public static SewerageUserAttachmentForm convertVoToForm(SewerageUserAttachment entity) {
		if(entity != null) {
			SewerageUserAttachmentForm form = new SewerageUserAttachmentForm();
			form.setId(entity.getId());
			form.setSewerageUserId(entity.getSewerageUserId());
			form.setAttName(entity.getAttName());
			form.setAttType(entity.getAttType());
			form.setAttTime(entity.getAttTime());
			form.setMime(entity.getMime());
			form.setAttPath(entity.getAttPath());
			form.setThumPath(entity.getThumPath());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(SewerageUserAttachmentForm form, SewerageUserAttachment entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			if(form.getSewerageUserId() != null && form.getSewerageUserId().trim().length() > 0)
				entity.setSewerageUserId(form.getSewerageUserId().trim());
			if(form.getAttName() != null && form.getAttName().trim().length() > 0)
				entity.setAttName(form.getAttName().trim());
			if(form.getAttType() != null && form.getAttType().trim().length() > 0)
				entity.setAttType(form.getAttType().trim());
			entity.setAttTime(form.getAttTime());
			if(form.getMime() != null && form.getMime().trim().length() > 0)
				entity.setMime(form.getMime().trim());
			if(form.getAttPath() != null && form.getAttPath().trim().length() > 0)
				entity.setAttPath(form.getAttPath().trim());
			if(form.getThumPath() != null && form.getThumPath().trim().length() > 0)
				entity.setThumPath(form.getThumPath().trim());
		}
	}
	
	public static List<SewerageUserAttachmentForm> convertVoListToFormList(List<SewerageUserAttachment> sewerageUserAttachmentList) {
		if(sewerageUserAttachmentList != null && sewerageUserAttachmentList.size() > 0) {
			List<SewerageUserAttachmentForm> sewerageUserAttachmentFormList = new ArrayList();
			for(int i=0; i<sewerageUserAttachmentList.size(); i++) {
				sewerageUserAttachmentFormList.add(convertVoToForm(sewerageUserAttachmentList.get(i)));
			}
			return sewerageUserAttachmentFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<SewerageUserAttachment> sewerageUserAttachmentList) {
		if(sewerageUserAttachmentList != null && sewerageUserAttachmentList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<sewerageUserAttachmentList.size(); i++) {
				SewerageUserAttachment entity = sewerageUserAttachmentList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("sewerageUserId", entity.getSewerageUserId());
				map.put("attName", entity.getAttName());
				map.put("attType", entity.getAttType());
				map.put("attTime", entity.getAttTime());
				map.put("mime", entity.getMime());
				map.put("attPath", entity.getAttPath());
				map.put("thumPath", entity.getThumPath());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<SewerageUserAttachment> convertFormListToVoList(List<SewerageUserAttachmentForm> sewerageUserAttachmentFormList) {
		if(sewerageUserAttachmentFormList != null && sewerageUserAttachmentFormList.size() > 0) {
			List<SewerageUserAttachment> sewerageUserAttachmentList = new ArrayList();
			for(int i=0; i<sewerageUserAttachmentFormList.size(); i++) {
				SewerageUserAttachment sewerageUserAttachment = new SewerageUserAttachment();
				convertFormToVo(sewerageUserAttachmentFormList.get(i), sewerageUserAttachment);
				sewerageUserAttachmentList.add(sewerageUserAttachment);
			}
			return sewerageUserAttachmentList;
		}
		return null;
	}
	
	public static SewerageUserAttachmentForm convertMapVoForm(Map<String, Object> map) {
		SewerageUserAttachmentForm form = new SewerageUserAttachmentForm();
		if(map.containsKey("id"))
			form.setId(Long.parseLong(map.get("id").toString()));
		if(map.containsKey("markId"))
			form.setSewerageUserId(map.get("markId").toString());
		if(map.containsKey("attName"))
			form.setAttName(map.get("attName").toString());
		if(map.containsKey("attTime"))
			form.setAttTime((Date)map.get("attTime"));
		if(map.containsKey("mime"))
			form.setMime(map.get("mime").toString());
		if(map.containsKey("attPath"))
			form.setAttPath(map.get("attPath").toString());
		if(map.containsKey("thumPath"))
			form.setThumPath(map.get("thumPath").toString());
		return form;
	}
}