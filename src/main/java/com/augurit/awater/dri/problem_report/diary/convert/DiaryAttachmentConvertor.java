package com.augurit.awater.dri.problem_report.diary.convert;

import com.augurit.awater.dri.problem_report.diary.entity.DiaryAttachment;
import com.augurit.awater.dri.problem_report.diary.web.form.DiaryAttachmentForm;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class DiaryAttachmentConvertor {
	public static DiaryAttachmentForm convertVoToForm(DiaryAttachment entity) {
		if(entity != null) {
			DiaryAttachmentForm form = new DiaryAttachmentForm();
			form.setId(entity.getId());
			form.setMarkId(entity.getMarkId());
			form.setAttName(entity.getAttName());
			form.setAttTime(entity.getAttTime());
			form.setMime(entity.getMime());
			form.setAttPath(entity.getAttPath());
			form.setThumPath(entity.getThumPath());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(DiaryAttachmentForm form, DiaryAttachment entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			if(form.getMarkId() != null && form.getMarkId().trim().length() > 0)
				entity.setMarkId(form.getMarkId().trim());
			if(form.getAttName() != null && form.getAttName().trim().length() > 0)
				entity.setAttName(form.getAttName().trim());
			entity.setAttTime(form.getAttTime());
			if(form.getMime() != null && form.getMime().trim().length() > 0)
				entity.setMime(form.getMime().trim());
			if(form.getAttPath() != null && form.getAttPath().trim().length() > 0)
				entity.setAttPath(form.getAttPath().trim());
			if(form.getThumPath() != null && form.getThumPath().trim().length() > 0)
				entity.setThumPath(form.getThumPath().trim());
		}
	}
	
	public static List<DiaryAttachmentForm> convertVoListToFormList(List<DiaryAttachment> diaryAttachmentList) {
		if(diaryAttachmentList != null && diaryAttachmentList.size() > 0) {
			List<DiaryAttachmentForm> diaryAttachmentFormList = new ArrayList();
			for(int i=0; i<diaryAttachmentList.size(); i++) {
				diaryAttachmentFormList.add(convertVoToForm(diaryAttachmentList.get(i)));
			}
			return diaryAttachmentFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<DiaryAttachment> diaryAttachmentList) {
		if(diaryAttachmentList != null && diaryAttachmentList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<diaryAttachmentList.size(); i++) {
				DiaryAttachment entity = diaryAttachmentList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("markId", entity.getMarkId());
				map.put("attName", entity.getAttName());
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
	
	public static List<DiaryAttachment> convertFormListToVoList(List<DiaryAttachmentForm> diaryAttachmentFormList) {
		if(diaryAttachmentFormList != null && diaryAttachmentFormList.size() > 0) {
			List<DiaryAttachment> diaryAttachmentList = new ArrayList();
			for(int i=0; i<diaryAttachmentFormList.size(); i++) {
				DiaryAttachment diaryAttachment = new DiaryAttachment();
				convertFormToVo(diaryAttachmentFormList.get(i), diaryAttachment);
				diaryAttachmentList.add(diaryAttachment);
			}
			return diaryAttachmentList;
		}
		return null;
	}

	public static List<DiaryAttachmentForm> convertFormListToVoListMap(
			List<Map<String, Object>> listMap) {
		List<DiaryAttachmentForm> list = new ArrayList();
		if(listMap!=null || listMap.size()>0){
			for(Map map : listMap){
				DiaryAttachmentForm attFrom = new DiaryAttachmentForm();
				if(map.containsKey("id"))
					attFrom.setId(Long.parseLong(map.get("id").toString()));
				if(map.containsKey("markId"))
					attFrom.setMarkId(map.get("markId").toString());
				if(map.containsKey("attName"))
					attFrom.setAttName(map.get("attName").toString());
				if(map.containsKey("attTime"))
					attFrom.setAttTime((Date)map.get("attTime"));
				if(map.containsKey("mime"))
					attFrom.setMime(map.get("mime").toString());
				if(map.containsKey("attPath"))
					attFrom.setAttPath(map.get("attPath").toString());
				if(map.containsKey("thumPath"))
					attFrom.setThumPath(map.get("thumPath").toString());
				list.add(attFrom);
			}
			return list;
		}else{
			return null;
		}
	}
}