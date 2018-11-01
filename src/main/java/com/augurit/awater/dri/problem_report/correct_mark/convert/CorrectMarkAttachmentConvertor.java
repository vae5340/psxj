package com.augurit.awater.dri.problem_report.correct_mark.convert;

import com.augurit.awater.dri.problem_report.correct_mark.entity.CorrectMarkAttachment;
import com.augurit.awater.dri.problem_report.correct_mark.web.form.CorrectMarkAttachmentForm;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class CorrectMarkAttachmentConvertor {
	public static CorrectMarkAttachmentForm convertVoToForm(CorrectMarkAttachment entity) {
		if(entity != null) {
			CorrectMarkAttachmentForm form = new CorrectMarkAttachmentForm();
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
	
	public static void convertFormToVo(CorrectMarkAttachmentForm form, CorrectMarkAttachment entity) {
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
	
	public static List<CorrectMarkAttachmentForm> convertVoListToFormList(List<CorrectMarkAttachment> correctMarkAttachmentList) {
		if(correctMarkAttachmentList != null && correctMarkAttachmentList.size() > 0) {
			List<CorrectMarkAttachmentForm> correctMarkAttachmentFormList = new ArrayList();
			for(int i=0; i<correctMarkAttachmentList.size(); i++) {
				correctMarkAttachmentFormList.add(convertVoToForm(correctMarkAttachmentList.get(i)));
			}
			return correctMarkAttachmentFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<CorrectMarkAttachment> correctMarkAttachmentList) {
		if(correctMarkAttachmentList != null && correctMarkAttachmentList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<correctMarkAttachmentList.size(); i++) {
				CorrectMarkAttachment entity = correctMarkAttachmentList.get(i);
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
	
	public static List<CorrectMarkAttachment> convertFormListToVoList(List<CorrectMarkAttachmentForm> correctMarkAttachmentFormList) {
		if(correctMarkAttachmentFormList != null && correctMarkAttachmentFormList.size() > 0) {
			List<CorrectMarkAttachment> correctMarkAttachmentList = new ArrayList();
			for(int i=0; i<correctMarkAttachmentFormList.size(); i++) {
				CorrectMarkAttachment correctMarkAttachment = new CorrectMarkAttachment();
				convertFormToVo(correctMarkAttachmentFormList.get(i), correctMarkAttachment);
				correctMarkAttachmentList.add(correctMarkAttachment);
			}
			return correctMarkAttachmentList;
		}
		return null;
	}
	
	public static List<CorrectMarkAttachmentForm> convertFormListToVoListMap(List<Map<String,Object>> listMap) {
		List<CorrectMarkAttachmentForm> list = new ArrayList();
		if(listMap!=null || listMap.size()>0){
			for(Map map : listMap){
				CorrectMarkAttachmentForm attFrom = new CorrectMarkAttachmentForm();
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