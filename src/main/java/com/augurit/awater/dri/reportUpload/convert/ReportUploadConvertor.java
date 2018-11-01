package com.augurit.awater.dri.reportUpload.convert;


import com.augurit.awater.dri.reportUpload.entity.ReportUpload;
import com.augurit.awater.dri.reportUpload.web.form.ReportUploadForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ReportUploadConvertor {
	public static ReportUploadForm convertVoToForm(ReportUpload entity) {
		if(entity != null) {
			ReportUploadForm form = new ReportUploadForm();
			form.setId(entity.getId());
			form.setObjectId(entity.getObjectId());
			form.setLayerName(entity.getLayerName());
			form.setAttachName(entity.getAttachName());
			form.setUploadTime(entity.getUploadTime());
			form.setFilePath(entity.getFilePath());
			form.setType(entity.getType());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(ReportUploadForm form, ReportUpload entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			entity.setObjectId(form.getObjectId());
			if(form.getLayerName() != null && form.getLayerName().trim().length() > 0)
				entity.setLayerName(form.getLayerName().trim());
			if(form.getAttachName() != null && form.getAttachName().trim().length() > 0)
				entity.setAttachName(form.getAttachName().trim());
			entity.setUploadTime(form.getUploadTime());
			if(form.getFilePath() != null && form.getFilePath().trim().length() > 0)
				entity.setFilePath(form.getFilePath().trim());
			if(form.getType() != null && form.getType().trim().length() > 0)
				entity.setType(form.getType().trim());
		}
	}
	
	public static List<ReportUploadForm> convertVoListToFormList(List<ReportUpload> reportUploadList) {
		if(reportUploadList != null && reportUploadList.size() > 0) {
			List<ReportUploadForm> reportUploadFormList = new ArrayList();
			for(int i=0; i<reportUploadList.size(); i++) {
				reportUploadFormList.add(convertVoToForm(reportUploadList.get(i)));
			}
			return reportUploadFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<ReportUpload> reportUploadList) {
		if(reportUploadList != null && reportUploadList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<reportUploadList.size(); i++) {
				ReportUpload entity = reportUploadList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("objectId", entity.getObjectId() == null ? "" : entity.getObjectId().toString());
				map.put("layerName", entity.getLayerName());
				map.put("attachName", entity.getAttachName());
				map.put("uploadName", entity.getUploadTime());
				map.put("filePath", entity.getFilePath());
				map.put("type", entity.getType());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<ReportUpload> convertFormListToVoList(List<ReportUploadForm> reportUploadFormList) {
		if(reportUploadFormList != null && reportUploadFormList.size() > 0) {
			List<ReportUpload> reportUploadList = new ArrayList();
			for(int i=0; i<reportUploadFormList.size(); i++) {
				ReportUpload reportUpload = new ReportUpload();
				convertFormToVo(reportUploadFormList.get(i), reportUpload);
				reportUploadList.add(reportUpload);
			}
			return reportUploadList;
		}
		return null;
	}
}