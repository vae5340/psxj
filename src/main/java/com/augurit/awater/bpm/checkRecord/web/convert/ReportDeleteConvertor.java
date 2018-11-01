package com.augurit.awater.bpm.checkRecord.web.convert;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.augurit.awater.bpm.checkRecord.web.entity.ReportDelete;
import com.augurit.awater.bpm.checkRecord.web.form.ReportDeleteForm;
import com.augurit.awater.dri.problem_report.correct_mark.web.form.CorrectMarkForm;
import com.augurit.awater.dri.problem_report.lack_mark.web.form.LackMarkForm;
import org.apache.commons.lang3.StringUtils;

public class ReportDeleteConvertor {
	public static ReportDeleteForm convertVoToForm(ReportDelete entity) {
		if(entity != null) {
			ReportDeleteForm form = new ReportDeleteForm();
			form.setId(entity.getId());
			form.setIsDelete(entity.getIsDelete());
			form.setReportType(entity.getReportType());
			form.setMarkId(entity.getMarkId());
			form.setObjectId(entity.getObjectId());
			form.setDeleteTime(entity.getDeleteTime());
			form.setMarkPersonId(entity.getMarkPersonId());
			form.setMarkPerson(entity.getMarkPerson());
			form.setMarkTime(entity.getMarkTime());
			form.setUpdateTime(entity.getUpdateTime());
			form.setDesription(entity.getDesription());
			form.setCorrectType(entity.getCorrectType());
			form.setLayerName(entity.getLayerName());
			form.setAddr(entity.getAddr());
			form.setRoad(entity.getRoad());
			form.setX(entity.getX());
			form.setY(entity.getY());
			form.setAttrOne(entity.getAttrOne());
			form.setAttrTwo(entity.getAttrTwo());
			form.setAttrThree(entity.getAttrThree());
			form.setAttrFour(entity.getAttrFour());
			form.setAttrFive(entity.getAttrFive());
			form.setUserAddr(entity.getUserAddr());
			form.setUserX(entity.getUserx());
			form.setUserY(entity.getUsery());
			form.setUsid(entity.getUsid());
			form.setOriginAddr(entity.getOriginAddr());
			form.setOriginRoad(entity.getOriginRoad());
			form.setOrginX(entity.getOrginx());
			form.setOrginY(entity.getOrginy());
			form.setOriginAttrOne(entity.getOriginAttrOne());
			form.setOriginAttrTwo(entity.getOriginAttrTwo());
			form.setOriginAttrThree(entity.getOriginAttrThree());
			form.setOriginAttrFour(entity.getOriginAttrFour());
			form.setOriginAttrFive(entity.getOriginAttrFive());
			form.setTeamOrgId(entity.getTeamOrgId());
			form.setTeamOrgName(entity.getTeamOrgName());
			form.setDirectOrgId(entity.getDirectOrgId());
			form.setDirectOrgName(entity.getDirectOrgName());
			form.setSuperviseOrgId(entity.getSuperviseOrgId());
			form.setSuperviseOrgName(entity.getSuperviseOrgName());
			form.setParentOrgId(entity.getParentOrgId());
			form.setParentOrgName(entity.getParentOrgName());
			form.setCheckstate(entity.getCheckstate());
			form.setCheckPersonId(entity.getCheckPersonId());
			form.setCheckPerson(entity.getCheckPerson());
			form.setCheckTime(entity.getCheckTime());
			form.setCheckDesription(entity.getCheckDesription());
			form.setCheckType(entity.getCheckType());
			form.setDeletePersonId(entity.getDeletePersonId());
			form.setDeletePerson(entity.getDeletePerson());
			form.setPersonUserId(entity.getPersonUserId());
			form.setPhoneBrand(entity.getPhoneBrand());
			
			form.setPcode(entity.getPcode());
			form.setChildCode(entity.getChildCode());
			form.setCityVillage(entity.getCityVillage());
			
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(ReportDeleteForm form, ReportDelete entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			entity.setIsDelete(form.getIsDelete());
			if(form.getReportType() != null && form.getReportType().trim().length() > 0)
				entity.setReportType(form.getReportType().trim());
			if(form.getMarkId() != null && form.getMarkId().trim().length() > 0)
				entity.setMarkId(form.getMarkId().trim());
			if(form.getObjectId() != null && form.getObjectId().trim().length() > 0)
				entity.setObjectId(form.getObjectId().trim());
			entity.setDeleteTime(form.getDeleteTime());
			if(form.getMarkPersonId() != null && form.getMarkPersonId().trim().length() > 0)
				entity.setMarkPersonId(form.getMarkPersonId().trim());
			if(form.getMarkPerson() != null && form.getMarkPerson().trim().length() > 0)
				entity.setMarkPerson(form.getMarkPerson().trim());
			entity.setMarkTime(form.getMarkTime());
			entity.setUpdateTime(form.getUpdateTime());
			if(form.getDesription() != null && form.getDesription().trim().length() > 0)
				entity.setDesription(form.getDesription().trim());
			if(form.getCorrectType() != null && form.getCorrectType().trim().length() > 0)
				entity.setCorrectType(form.getCorrectType().trim());
			if(form.getLayerName() != null && form.getLayerName().trim().length() > 0)
				entity.setLayerName(form.getLayerName().trim());
			if(form.getAddr() != null && form.getAddr().trim().length() > 0)
				entity.setAddr(form.getAddr().trim());
			if(form.getRoad() != null && form.getRoad().trim().length() > 0)
				entity.setRoad(form.getRoad().trim());
			entity.setX(form.getX());
			entity.setY(form.getY());
			if(form.getAttrOne() != null && form.getAttrOne().trim().length() > 0)
				entity.setAttrOne(form.getAttrOne().trim());
			if(form.getAttrTwo() != null && form.getAttrTwo().trim().length() > 0)
				entity.setAttrTwo(form.getAttrTwo().trim());
			if(form.getAttrThree() != null && form.getAttrThree().trim().length() > 0)
				entity.setAttrThree(form.getAttrThree().trim());
			if(form.getAttrFour() != null && form.getAttrFour().trim().length() > 0)
				entity.setAttrFour(form.getAttrFour().trim());
			if(form.getAttrFive() != null && form.getAttrFive().trim().length() > 0)
				entity.setAttrFive(form.getAttrFive().trim());
			if(form.getUserAddr() != null && form.getUserAddr().trim().length() > 0)
				entity.setUserAddr(form.getUserAddr().trim());
			entity.setUserx(form.getUserX());
			entity.setUsery(form.getUserY());
			if(form.getUsid() != null && form.getUsid().trim().length() > 0)
				entity.setUsid(form.getUsid().trim());
			if(form.getOriginAddr() != null && form.getOriginAddr().trim().length() > 0)
				entity.setOriginAddr(form.getOriginAddr().trim());
			if(form.getOriginRoad() != null && form.getOriginRoad().trim().length() > 0)
				entity.setOriginRoad(form.getOriginRoad().trim());
			entity.setOrginx(form.getOrginX());
			entity.setOrginy(form.getOrginY());
			if(form.getOriginAttrOne() != null && form.getOriginAttrOne().trim().length() > 0)
				entity.setOriginAttrOne(form.getOriginAttrOne().trim());
			if(form.getOriginAttrTwo() != null && form.getOriginAttrTwo().trim().length() > 0)
				entity.setOriginAttrTwo(form.getOriginAttrTwo().trim());
			if(form.getOriginAttrThree() != null && form.getOriginAttrThree().trim().length() > 0)
				entity.setOriginAttrThree(form.getOriginAttrThree().trim());
			if(form.getOriginAttrFour() != null && form.getOriginAttrFour().trim().length() > 0)
				entity.setOriginAttrFour(form.getOriginAttrFour().trim());
			if(form.getOriginAttrFive() != null && form.getOriginAttrFive().trim().length() > 0)
				entity.setOriginAttrFive(form.getOriginAttrFive().trim());
			if(form.getTeamOrgId() != null && form.getTeamOrgId().trim().length() > 0)
				entity.setTeamOrgId(form.getTeamOrgId().trim());
			if(form.getTeamOrgName() != null && form.getTeamOrgName().trim().length() > 0)
				entity.setTeamOrgName(form.getTeamOrgName().trim());
			if(form.getDirectOrgId() != null && form.getDirectOrgId().trim().length() > 0)
				entity.setDirectOrgId(form.getDirectOrgId().trim());
			if(form.getDirectOrgName() != null && form.getDirectOrgName().trim().length() > 0)
				entity.setDirectOrgName(form.getDirectOrgName().trim());
			if(form.getSuperviseOrgId() != null && form.getSuperviseOrgId().trim().length() > 0)
				entity.setSuperviseOrgId(form.getSuperviseOrgId().trim());
			if(form.getSuperviseOrgName() != null && form.getSuperviseOrgName().trim().length() > 0)
				entity.setSuperviseOrgName(form.getSuperviseOrgName().trim());
			if(form.getParentOrgId() != null && form.getParentOrgId().trim().length() > 0)
				entity.setParentOrgId(form.getParentOrgId().trim());
			if(form.getParentOrgName() != null && form.getParentOrgName().trim().length() > 0)
				entity.setParentOrgName(form.getParentOrgName().trim());
			if(form.getCheckstate() != null && form.getCheckstate().trim().length() > 0)
				entity.setCheckstate(form.getCheckstate().trim());
			if(form.getCheckPersonId() != null && form.getCheckPersonId().trim().length() > 0)
				entity.setCheckPersonId(form.getCheckPersonId().trim());
			if(form.getCheckPerson() != null && form.getCheckPerson().trim().length() > 0)
				entity.setCheckPerson(form.getCheckPerson().trim());
			entity.setCheckTime(form.getCheckTime());
			if(form.getCheckDesription() != null && form.getCheckDesription().trim().length() > 0)
				entity.setCheckDesription(form.getCheckDesription().trim());
			if(form.getCheckType() != null && form.getCheckType().trim().length() > 0)
				entity.setCheckType(form.getCheckType().trim());
			if(form.getPersonUserId() !=null && form.getPersonUserId().trim().length() > 0)
				entity.setPersonUserId(form.getPersonUserId());
			entity.setDeletePersonId(form.getDeletePersonId());
			entity.setDeletePerson(form.getDeletePerson());
			if(form.getPhoneBrand() !=null && form.getPhoneBrand().trim().length() > 0)
				entity.setPhoneBrand(form.getPhoneBrand());
			entity.setPcode(form.getPcode());
			entity.setChildCode(form.getChildCode());
			entity.setCityVillage(form.getCityVillage());
			
		}
	}
	
	public static List<ReportDeleteForm> convertVoListToFormList(List<ReportDelete> reportDeleteList) {
		if(reportDeleteList != null && reportDeleteList.size() > 0) {
			List<ReportDeleteForm> reportDeleteFormList = new ArrayList();
			for(int i=0; i<reportDeleteList.size(); i++) {
				reportDeleteFormList.add(convertVoToForm(reportDeleteList.get(i)));
			}
			return reportDeleteFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<ReportDelete> reportDeleteList) {
		if(reportDeleteList != null && reportDeleteList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<reportDeleteList.size(); i++) {
				ReportDelete entity = reportDeleteList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("isDelete", entity.getIsDelete());
				map.put("reportType", entity.getReportType());
				map.put("markId", entity.getMarkId());
				map.put("objectId", entity.getObjectId());
				map.put("deleteTime", entity.getDeleteTime());
				map.put("markPersonId", entity.getMarkPersonId());
				map.put("markPerson", entity.getMarkPerson());
				map.put("markTime", entity.getMarkTime());
				map.put("updateTime", entity.getUpdateTime());
				map.put("desription", entity.getDesription());
				map.put("correctType", entity.getCorrectType());
				map.put("layerName", entity.getLayerName());
				map.put("addr", entity.getAddr());
				map.put("road", entity.getRoad());
				map.put("x", entity.getX() == null ? "" : entity.getX().toString());
				map.put("y", entity.getY() == null ? "" : entity.getY().toString());
				map.put("attrOne", entity.getAttrOne());
				map.put("attrTwo", entity.getAttrTwo());
				map.put("attrThree", entity.getAttrThree());
				map.put("attrFour", entity.getAttrFour());
				map.put("attrFive", entity.getAttrFive());
				map.put("userAddr", entity.getUserAddr());
				map.put("userX", entity.getUserx() == null ? "" : entity.getUserx().toString());
				map.put("userY", entity.getUsery() == null ? "" : entity.getUsery().toString());
				map.put("usid", entity.getUsid());
				map.put("originAddr", entity.getOriginAddr());
				map.put("originRoad", entity.getOriginRoad());
				map.put("orginX", entity.getOrginx() == null ? "" : entity.getOrginx().toString());
				map.put("orginY", entity.getOrginy() == null ? "" : entity.getOrginy().toString());
				map.put("originAttrOne", entity.getOriginAttrOne());
				map.put("originAttrTwo", entity.getOriginAttrTwo());
				map.put("originAttrThree", entity.getOriginAttrThree());
				map.put("originAttrFour", entity.getOriginAttrFour());
				map.put("originAttrFive", entity.getOriginAttrFive());
				map.put("teamOrgId", entity.getTeamOrgId());
				map.put("teamOrgName", entity.getTeamOrgName());
				map.put("directOrgId", entity.getDirectOrgId());
				map.put("directOrgName", entity.getDirectOrgName());
				map.put("superviseOrgId", entity.getSuperviseOrgId());
				map.put("superviseOrgName", entity.getSuperviseOrgName());
				map.put("parentOrgId", entity.getParentOrgId());
				map.put("parentOrgName", entity.getParentOrgName());
				map.put("checkstate", entity.getCheckstate());
				map.put("checkPersonId", entity.getCheckPersonId());
				map.put("checkPerson", entity.getCheckPerson());
				map.put("checkTime", entity.getCheckTime());
				map.put("checkDesription", entity.getCheckDesription());
				map.put("checkType", entity.getCheckType());
				map.put("deletePersonId", entity.getDeletePersonId());
				map.put("deletePerson", entity.getDeletePerson());
				map.put("personUserId", entity.getPersonUserId());
				map.put("phoneBrand", entity.getPhoneBrand());
				map.put("pcode", entity.getPcode());
				map.put("childCode", entity.getChildCode());
				map.put("cityVillage", entity.getCityVillage());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<ReportDelete> convertFormListToVoList(List<ReportDeleteForm> reportDeleteFormList) {
		if(reportDeleteFormList != null && reportDeleteFormList.size() > 0) {
			List<ReportDelete> reportDeleteList = new ArrayList();
			for(int i=0; i<reportDeleteFormList.size(); i++) {
				ReportDelete reportDelete = new ReportDelete();
				convertFormToVo(reportDeleteFormList.get(i), reportDelete);
				reportDeleteList.add(reportDelete);
			}
			return reportDeleteList;
		}
		return null;
	}
	/**
	 * 删除校核数据转换
	 * */
	public static ReportDeleteForm convertCorrVoToForm(CorrectMarkForm corrForm) {
		ReportDeleteForm form = new ReportDeleteForm();
		if(corrForm!=null&&StringUtils.isNotBlank(corrForm.getObjectId())){
			form.setReportType("modify");
			form.setMarkId(corrForm.getId().toString());
			form.setObjectId(corrForm.getObjectId());
			form.setMarkPersonId(corrForm.getMarkPersonId());
			form.setMarkPerson(corrForm.getMarkPerson());
			form.setMarkTime(corrForm.getMarkTime());
			form.setUpdateTime(corrForm.getUpdateTime());
			form.setDesription(corrForm.getDescription());
			form.setCorrectType(corrForm.getCorrectType());
			form.setLayerName(corrForm.getLayerName());
			form.setAddr(corrForm.getAddr());
			form.setRoad(corrForm.getRoad());
			form.setX(corrForm.getX());
			form.setY(corrForm.getY());
			form.setAttrOne(corrForm.getAttrOne());
			form.setAttrTwo(corrForm.getAttrTwo());
			form.setAttrThree(corrForm.getAttrThree());
			form.setAttrFour(corrForm.getAttrFour());
			form.setAttrFive(corrForm.getAttrFive());
			form.setUserX(corrForm.getUserX());
			form.setUserY(corrForm.getUserY());
			form.setUsid(corrForm.getUsid());
			form.setOriginAddr(corrForm.getOriginAddr());
			form.setOriginRoad(corrForm.getOriginRoad());
			form.setOrginX(corrForm.getOrginX());
			form.setOrginY(corrForm.getOrginY());
			form.setOriginAttrOne(corrForm.getOriginAttrOne());
			form.setOriginAttrTwo(corrForm.getOriginAttrTwo());
			form.setOriginAttrTwo(corrForm.getOriginAttrTwo());
			form.setOriginAttrThree(corrForm.getOriginAttrThree());
			form.setOriginAttrFour(corrForm.getOriginAttrFour());
			form.setOriginAttrFive(corrForm.getOriginAttrFive());
			form.setTeamOrgId(corrForm.getTeamOrgId());
			form.setTeamOrgName(corrForm.getTeamOrgName());
			form.setDirectOrgId(corrForm.getDirectOrgId());
			form.setDirectOrgName(corrForm.getDirectOrgName());
			form.setSuperviseOrgId(corrForm.getSuperviseOrgId());
			form.setSuperviseOrgName(corrForm.getSuperviseOrgName());
			form.setParentOrgId(corrForm.getParentOrgId());
			form.setParentOrgName(corrForm.getParentOrgName());
			form.setCheckstate(corrForm.getCheckState());
			form.setCheckPerson(corrForm.getCheckPerson());
			form.setCheckPersonId(corrForm.getCheckPersonId());
			form.setCheckTime(corrForm.getCheckTime());
			form.setCheckDesription(corrForm.getCheckDesription());
			form.setPcode(corrForm.getPcode());
			form.setChildCode(corrForm.getChildCode());
			form.setCityVillage(corrForm.getCityVillage());
			return form;
		}else{
			return null;
		}
	}
	/**
	 * 删除新增数据转换
	 * */
	public static ReportDeleteForm convertLackVoToForm(LackMarkForm lackForm) {
		ReportDeleteForm form = new ReportDeleteForm();
		if(lackForm!=null&&StringUtils.isNotBlank(lackForm.getObjectId())){
			form.setReportType("add");
			form.setMarkId(lackForm.getId().toString());
			form.setObjectId(lackForm.getObjectId());
			form.setMarkPersonId(lackForm.getMarkPersonId());
			form.setMarkPerson(lackForm.getMarkPerson());
			form.setMarkTime(lackForm.getMarkTime());
			form.setUpdateTime(lackForm.getUpdateTime());
			form.setDesription(lackForm.getDescription());
			form.setLayerName(lackForm.getLayerName());
			form.setAddr(lackForm.getAddr());
			form.setRoad(lackForm.getRoad());
			form.setX(lackForm.getX());
			form.setY(lackForm.getY());
			form.setAttrOne(lackForm.getAttrOne());
			form.setAttrTwo(lackForm.getAttrTwo());
			form.setAttrThree(lackForm.getAttrThree());
			form.setAttrFour(lackForm.getAttrFour());
			form.setAttrFive(lackForm.getAttrFive());
			form.setUserX(lackForm.getUserX());
			form.setUserY(lackForm.getUserY());
			form.setUsid(lackForm.getUsid());
			form.setTeamOrgId(lackForm.getTeamOrgId());
			form.setTeamOrgName(lackForm.getTeamOrgName());
			form.setDirectOrgId(lackForm.getDirectOrgId());
			form.setDirectOrgName(lackForm.getDirectOrgName());
			form.setSuperviseOrgId(lackForm.getSuperviseOrgId());
			form.setSuperviseOrgName(lackForm.getSuperviseOrgName());
			form.setParentOrgId(lackForm.getParentOrgId());
			form.setParentOrgName(lackForm.getParentOrgName());
			form.setCheckstate(lackForm.getCheckState());
			form.setCheckPerson(lackForm.getCheckPerson());
			form.setCheckPersonId(lackForm.getCheckPersonId());
			form.setCheckTime(lackForm.getCheckTime());
			form.setCheckDesription(lackForm.getCheckDesription());
			
			form.setPcode(lackForm.getPcode());
			form.setChildCode(lackForm.getChildCode());
			form.setCityVillage(lackForm.getCityVillage());
			return form;
		}else{
			return null;
		}
	}
	
}