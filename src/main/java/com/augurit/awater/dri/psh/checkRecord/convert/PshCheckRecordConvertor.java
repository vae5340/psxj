package com.augurit.awater.dri.psh.checkRecord.convert;

import com.augurit.awater.dri.psh.checkRecord.entity.PshCheckRecord;
import com.augurit.awater.dri.psh.checkRecord.web.form.PshCheckRecordForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class PshCheckRecordConvertor {
	public static PshCheckRecordForm convertVoToForm(PshCheckRecord entity) {
		if(entity != null) {
			PshCheckRecordForm form = new PshCheckRecordForm();
			form.setId(entity.getId());
			form.setCheckPersonCode(entity.getCheckPersonCode());
			form.setCheckPerson(entity.getCheckPerson());
			form.setCheckState(entity.getCheckState());
			form.setCheckTime(entity.getCheckTime());
			form.setCheckDesription(entity.getCheckDesription());
			form.setOrgId(entity.getOrgId());
			form.setOrgName(entity.getOrgName());
			form.setReportId(entity.getReportId());
			form.setReportEntity(entity.getReportEntity());
			form.setCheckPersonPhone(entity.getCheckPersonPhone());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(PshCheckRecordForm form, PshCheckRecord entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			if(form.getCheckPersonCode() != null && form.getCheckPersonCode().trim().length() > 0)
				entity.setCheckPersonCode(form.getCheckPersonCode().trim());
			if(form.getCheckPerson() != null && form.getCheckPerson().trim().length() > 0)
				entity.setCheckPerson(form.getCheckPerson().trim());
			if(form.getCheckState() != null && form.getCheckState().trim().length() > 0)
				entity.setCheckState(form.getCheckState().trim());
			entity.setCheckTime(form.getCheckTime());
			if(form.getCheckDesription() != null && form.getCheckDesription().trim().length() > 0)
				entity.setCheckDesription(form.getCheckDesription().trim());
			if(form.getOrgId() != null && form.getOrgId().trim().length() > 0)
				entity.setOrgId(form.getOrgId().trim());
			if(form.getOrgName() != null && form.getOrgName().trim().length() > 0)
				entity.setOrgName(form.getOrgName().trim());
			entity.setReportId(form.getReportId());
			if(form.getReportEntity() != null && form.getReportEntity().trim().length() > 0)
				entity.setReportEntity(form.getReportEntity().trim());
			entity.setCheckPersonPhone(form.getCheckPersonPhone());
		}
	}
	
	public static List<PshCheckRecordForm> convertVoListToFormList(List<PshCheckRecord> pshCheckRecordList) {
		if(pshCheckRecordList != null && pshCheckRecordList.size() > 0) {
			List<PshCheckRecordForm> pshCheckRecordFormList = new ArrayList();
			for(int i=0; i<pshCheckRecordList.size(); i++) {
				pshCheckRecordFormList.add(convertVoToForm(pshCheckRecordList.get(i)));
			}
			return pshCheckRecordFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<PshCheckRecord> pshCheckRecordList) {
		if(pshCheckRecordList != null && pshCheckRecordList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<pshCheckRecordList.size(); i++) {
				PshCheckRecord entity = pshCheckRecordList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("checkPersonCode", entity.getCheckPersonCode());
				map.put("checkPerson", entity.getCheckPerson());
				map.put("checkState", entity.getCheckState());
				map.put("checkTime", entity.getCheckTime());
				map.put("checkDesription", entity.getCheckDesription());
				map.put("orgId", entity.getOrgId());
				map.put("orgName", entity.getOrgName());
				map.put("reportId", entity.getReportId() == null ? "" : entity.getReportId().toString());
				map.put("reportEntity", entity.getReportEntity());
				map.put("checkPersonPhone", entity.getCheckPersonPhone());
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<PshCheckRecord> convertFormListToVoList(List<PshCheckRecordForm> pshCheckRecordFormList) {
		if(pshCheckRecordFormList != null && pshCheckRecordFormList.size() > 0) {
			List<PshCheckRecord> pshCheckRecordList = new ArrayList();
			for(int i=0; i<pshCheckRecordFormList.size(); i++) {
				PshCheckRecord pshCheckRecord = new PshCheckRecord();
				convertFormToVo(pshCheckRecordFormList.get(i), pshCheckRecord);
				pshCheckRecordList.add(pshCheckRecord);
			}
			return pshCheckRecordList;
		}
		return null;
	}
}