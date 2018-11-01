package com.augurit.awater.dri.problem_report.check_record.convert;

import com.augurit.awater.dri.problem_report.check_record.entity.CheckRecord;
import com.augurit.awater.dri.problem_report.check_record.web.form.CheckRecordForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class CheckRecordConvertor {
	public static CheckRecordForm convertVoToForm(CheckRecord entity) {
		if(entity != null) {
			CheckRecordForm form = new CheckRecordForm();
			form.setId(entity.getId());
			form.setCheckPersonId(entity.getCheckPersonId());
			form.setCheckPerson(entity.getCheckPerson());
			form.setCheckState(entity.getCheckState());
			form.setCheckTime(entity.getCheckTime());
			form.setCheckDesription(entity.getCheckDesription());
			form.setReportType(entity.getReportType());
			form.setReportId(entity.getReportId());
			form.setUsId(entity.getUsId());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(CheckRecordForm form, CheckRecord entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			if(form.getCheckPersonId() != null && form.getCheckPersonId().trim().length() > 0)
				entity.setCheckPersonId(form.getCheckPersonId().trim());
			if(form.getCheckPerson() != null && form.getCheckPerson().trim().length() > 0)
				entity.setCheckPerson(form.getCheckPerson().trim());
			if(form.getCheckState() != null && form.getCheckState().trim().length() > 0)
				entity.setCheckState(form.getCheckState().trim());
			entity.setCheckTime(form.getCheckTime());
			if(form.getCheckDesription() != null && form.getCheckDesription().trim().length() > 0)
				entity.setCheckDesription(form.getCheckDesription().trim());
			if(form.getReportType() != null && form.getReportType().trim().length() > 0)
				entity.setReportType(form.getReportType().trim());
			if(form.getReportId() != null && form.getReportId().trim().length() > 0)
				entity.setReportId(form.getReportId().trim());
			if(form.getUsId() != null && form.getUsId().trim().length() > 0)
				entity.setUsId(form.getUsId().trim());
		}
	}
	
	public static List<CheckRecordForm> convertVoListToFormList(List<CheckRecord> checkRecordList) {
		if(checkRecordList != null && checkRecordList.size() > 0) {
			List<CheckRecordForm> checkRecordFormList = new ArrayList();
			for(int i=0; i<checkRecordList.size(); i++) {
				checkRecordFormList.add(convertVoToForm(checkRecordList.get(i)));
			}
			return checkRecordFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<CheckRecord> checkRecordList) {
		if(checkRecordList != null && checkRecordList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<checkRecordList.size(); i++) {
				CheckRecord entity = checkRecordList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("checkPersonId", entity.getCheckPersonId());
				map.put("checkPerson", entity.getCheckPerson());
				map.put("checkState", entity.getCheckState());
				map.put("checkTime", entity.getCheckTime());
				map.put("checkDesription", entity.getCheckDesription());
				map.put("reportType", entity.getReportType());
				map.put("reportId", entity.getReportId());
				map.put("usId", entity.getUsId());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<CheckRecord> convertFormListToVoList(List<CheckRecordForm> checkRecordFormList) {
		if(checkRecordFormList != null && checkRecordFormList.size() > 0) {
			List<CheckRecord> checkRecordList = new ArrayList();
			for(int i=0; i<checkRecordFormList.size(); i++) {
				CheckRecord checkRecord = new CheckRecord();
				convertFormToVo(checkRecordFormList.get(i), checkRecord);
				checkRecordList.add(checkRecord);
			}
			return checkRecordList;
		}
		return null;
	}
}