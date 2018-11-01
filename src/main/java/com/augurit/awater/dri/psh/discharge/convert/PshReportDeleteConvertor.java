package com.augurit.awater.dri.psh.discharge.convert;

import com.augurit.awater.dri.psh.discharge.entity.PshReportDelete;
import com.augurit.awater.dri.psh.discharge.web.form.PshDischargerForm;
import com.augurit.awater.dri.psh.discharge.web.form.PshReportDeleteForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class PshReportDeleteConvertor {
	public static PshReportDeleteForm convertVoToForm(PshReportDelete entity) {
		if(entity != null) {
			PshReportDeleteForm form = new PshReportDeleteForm();
			form.setId(entity.getId());
			form.setDoorplateAddressCode(entity.getDoorplateAddressCode());
			form.setHouseIdFlag(entity.getHouseIdFlag());
			form.setHouseId(entity.getHouseId());
			form.setMarkPersonId(entity.getMarkPersonId());
			form.setMarkPerson(entity.getMarkPerson());
			form.setMarkTime(entity.getMarkTime());
			form.setAddr(entity.getAddr());
			form.setArea(entity.getArea());
			form.setTown(entity.getTown());
			form.setVillage(entity.getVillage());
			form.setStreet(entity.getStreet());
			form.setMph(entity.getMph());
			form.setName(entity.getName());
			form.setPsdy(entity.getPsdy());
			form.setFqname(entity.getFqname());
			form.setJzwcode(entity.getJzwcode());
			form.setVolume(entity.getVolume());
			form.setOwner(entity.getOwner());
			form.setOwnerTele(entity.getOwnerTele());
			form.setOperator(entity.getOperator());
			form.setOperatorTele(entity.getOperatorTele());
			form.setHasCert1(entity.getHasCert1());
			form.setCert1Code(entity.getCert1Code());
			form.setHasCert2(entity.getHasCert2());
			form.setHasCert3(entity.getHasCert3());
			form.setCert3Code(entity.getCert3Code());
			form.setHasCert4(entity.getHasCert4());
			form.setCert4Code(entity.getCert4Code());
			form.setDischargerType1(entity.getDischargerType1());
			form.setDischargerType2(entity.getDischargerType2());
			form.setFac1(entity.getFac1());
			form.setFac1Cont(entity.getFac1Cont());
			form.setFac1Main(entity.getFac1Main());
			form.setFac1Record(entity.getFac1Record());
			form.setFac2(entity.getFac2());
			form.setFac2Cont(entity.getFac2Cont());
			form.setFac2Main(entity.getFac2Main());
			form.setFac2Record(entity.getFac2Record());
			form.setFac3(entity.getFac3());
			form.setFac3Cont(entity.getFac3Cont());
			form.setFac3Main(entity.getFac3Main());
			form.setFac3Record(entity.getFac3Record());
			form.setFac4(entity.getFac4());
			form.setFac4Cont(entity.getFac4Cont());
			form.setFac4Main(entity.getFac4Main());
			form.setFac4Record(entity.getFac4Record());
			form.setState(entity.getState());
			form.setCheckPersonId(entity.getCheckPersonId());
			form.setCheckPerson(entity.getCheckPerson());
			form.setCheckTime(entity.getCheckTime());
			form.setCheckDesription(entity.getCheckDesription());
			form.setLoginName(entity.getLoginName());
			form.setDirectOrgId(entity.getDirectOrgId());
			form.setDirectOrgName(entity.getDirectOrgName());
			form.setTeamOrgId(entity.getTeamOrgId());
			form.setTeamOrgName(entity.getTeamOrgName());
			form.setParentOrgId(entity.getParentOrgId());
			form.setParentOrgName(entity.getParentOrgName());
			form.setDeleteTime(entity.getDeleteTime());
			form.setDeleteUserId(entity.getDeleteUserId());
			form.setDeleteUserName(entity.getDeleteUserName());
			form.setDeleteUserPhone(entity.getDeleteUserPhone());
			form.setUnitId(entity.getUnitId());
			form.setX(entity.getX());
			form.setY(entity.getY());
			form.setUpdateTime(entity.getUpdateTime());
			form.setDescription(entity.getDescription());
			form.setDischargeId(entity.getDischargeId());
			return form;
		}else
			return null;
	}
	
	
	public static PshReportDeleteForm convertVoToForm(PshDischargerForm entity) {
		if(entity != null) {
			PshReportDeleteForm form = new PshReportDeleteForm();
			form.setDoorplateAddressCode(entity.getDoorplateAddressCode());
			form.setHouseIdFlag(entity.getHouseIdFlag());
			form.setHouseId(entity.getHouseId());
			form.setMarkPersonId(entity.getMarkPersonId());
			form.setMarkPerson(entity.getMarkPerson());
			form.setMarkTime(entity.getMarkTime());
			form.setAddr(entity.getAddr());
			form.setArea(entity.getArea());
			form.setTown(entity.getTown());
			form.setVillage(entity.getVillage());
			form.setStreet(entity.getStreet());
			form.setMph(entity.getMph());
			form.setName(entity.getName());
			form.setPsdy(entity.getPsdy());
			form.setFqname(entity.getFqname());
			form.setJzwcode(entity.getJzwcode());
			form.setVolume(entity.getVolume());
			form.setOwner(entity.getOwner());
			form.setOwnerTele(entity.getOwnerTele());
			form.setOperator(entity.getOperator());
			form.setOperatorTele(entity.getOperatorTele());
			form.setHasCert1(entity.getHasCert1());
			form.setCert1Code(entity.getCert1Code());
			form.setHasCert2(entity.getHasCert2());
			form.setHasCert3(entity.getHasCert3());
			form.setCert3Code(entity.getCert3Code());
			form.setHasCert4(entity.getHasCert4());
			form.setCert4Code(entity.getCert4Code());
			form.setDischargerType1(entity.getDischargerType1());
			form.setDischargerType2(entity.getDischargerType2());
			form.setFac1(entity.getFac1());
			form.setFac1Cont(entity.getFac1Cont());
			form.setFac1Main(entity.getFac1Main());
			form.setFac1Record(entity.getFac1Record());
			form.setFac2(entity.getFac2());
			form.setFac2Cont(entity.getFac2Cont());
			form.setFac2Main(entity.getFac2Main());
			form.setFac2Record(entity.getFac2Record());
			form.setFac3(entity.getFac3());
			form.setFac3Cont(entity.getFac3Cont());
			form.setFac3Main(entity.getFac3Main());
			form.setFac3Record(entity.getFac3Record());
			form.setFac4(entity.getFac4());
			form.setFac4Cont(entity.getFac4Cont());
			form.setFac4Main(entity.getFac4Main());
			form.setFac4Record(entity.getFac4Record());
			form.setState(entity.getState());
			form.setCheckPersonId(entity.getCheckPersonId());
			form.setCheckPerson(entity.getCheckPerson());
			form.setCheckTime(entity.getCheckTime());
			form.setCheckDesription(entity.getCheckDesription());
			form.setLoginName(entity.getLoginName());
			form.setDirectOrgId(entity.getDirectOrgId());
			form.setDirectOrgName(entity.getDirectOrgName());
			form.setTeamOrgId(entity.getTeamOrgId());
			form.setTeamOrgName(entity.getTeamOrgName());
			form.setParentOrgId(entity.getParentOrgId());
			form.setParentOrgName(entity.getParentOrgName());
			form.setUnitId(entity.getUnitId());
			form.setX(entity.getX());
			form.setY(entity.getY());
			form.setUpdateTime(entity.getUpdateTime());
			form.setDescription(entity.getDescription());
			form.setDischargeId(String.valueOf(entity.getId()));
			return form;
		}
			return null;
	}
	
	public static void convertFormToVo(PshReportDeleteForm form, PshReportDelete entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			entity.setDoorplateAddressCode(form.getDoorplateAddressCode());
			if(form.getHouseIdFlag() != null && form.getHouseIdFlag().trim().length() > 0)
				entity.setHouseIdFlag(form.getHouseIdFlag().trim());
			if(form.getHouseId() != null && form.getHouseId().trim().length() > 0)
				entity.setHouseId(form.getHouseId().trim());
			if(form.getMarkPersonId() != null && form.getMarkPersonId().trim().length() > 0)
				entity.setMarkPersonId(form.getMarkPersonId().trim());
			if(form.getMarkPerson() != null && form.getMarkPerson().trim().length() > 0)
				entity.setMarkPerson(form.getMarkPerson().trim());
			entity.setMarkTime(form.getMarkTime());
			if(form.getAddr() != null && form.getAddr().trim().length() > 0)
				entity.setAddr(form.getAddr().trim());
			if(form.getArea() != null && form.getArea().trim().length() > 0)
				entity.setArea(form.getArea().trim());
			if(form.getTown() != null && form.getTown().trim().length() > 0)
				entity.setTown(form.getTown().trim());
			if(form.getVillage() != null && form.getVillage().trim().length() > 0)
				entity.setVillage(form.getVillage().trim());
			if(form.getStreet() != null && form.getStreet().trim().length() > 0)
				entity.setStreet(form.getStreet().trim());
			if(form.getMph() != null && form.getMph().trim().length() > 0)
				entity.setMph(form.getMph().trim());
			if(form.getName() != null && form.getName().trim().length() > 0)
				entity.setName(form.getName().trim());
			if(form.getPsdy() != null && form.getPsdy().trim().length() > 0)
				entity.setPsdy(form.getPsdy().trim());
			if(form.getFqname() != null && form.getFqname().trim().length() > 0)
				entity.setFqname(form.getFqname().trim());
			if(form.getJzwcode() != null && form.getJzwcode().trim().length() > 0)
				entity.setJzwcode(form.getJzwcode().trim());
			entity.setVolume(form.getVolume());
			if(form.getOwner() != null && form.getOwner().trim().length() > 0)
				entity.setOwner(form.getOwner().trim());
			if(form.getOwnerTele() != null && form.getOwnerTele().trim().length() > 0)
				entity.setOwnerTele(form.getOwnerTele().trim());
			if(form.getOperator() != null && form.getOperator().trim().length() > 0)
				entity.setOperator(form.getOperator().trim());
			if(form.getOperatorTele() != null && form.getOperatorTele().trim().length() > 0)
				entity.setOperatorTele(form.getOperatorTele().trim());
			if(form.getHasCert1() != null && form.getHasCert1().trim().length() > 0)
				entity.setHasCert1(form.getHasCert1().trim());
			if(form.getCert1Code() != null && form.getCert1Code().trim().length() > 0)
				entity.setCert1Code(form.getCert1Code().trim());
			if(form.getHasCert2() != null && form.getHasCert2().trim().length() > 0)
				entity.setHasCert2(form.getHasCert2().trim());
			if(form.getHasCert3() != null && form.getHasCert3().trim().length() > 0)
				entity.setHasCert3(form.getHasCert3().trim());
			if(form.getCert3Code() != null && form.getCert3Code().trim().length() > 0)
				entity.setCert3Code(form.getCert3Code().trim());
			if(form.getHasCert4() != null && form.getHasCert4().trim().length() > 0)
				entity.setHasCert4(form.getHasCert4().trim());
			if(form.getCert4Code() != null && form.getCert4Code().trim().length() > 0)
				entity.setCert4Code(form.getCert4Code().trim());
			if(form.getDischargerType1() != null && form.getDischargerType1().trim().length() > 0)
				entity.setDischargerType1(form.getDischargerType1().trim());
			if(form.getDischargerType2() != null && form.getDischargerType2().trim().length() > 0)
				entity.setDischargerType2(form.getDischargerType2().trim());
			if(form.getFac1() != null && form.getFac1().trim().length() > 0)
				entity.setFac1(form.getFac1().trim());
			if(form.getFac1Cont() != null && form.getFac1Cont().trim().length() > 0)
				entity.setFac1Cont(form.getFac1Cont().trim());
			if(form.getFac1Main() != null && form.getFac1Main().trim().length() > 0)
				entity.setFac1Main(form.getFac1Main().trim());
			if(form.getFac1Record() != null && form.getFac1Record().trim().length() > 0)
				entity.setFac1Record(form.getFac1Record().trim());
			if(form.getFac2() != null && form.getFac2().trim().length() > 0)
				entity.setFac2(form.getFac2().trim());
			if(form.getFac2Cont() != null && form.getFac2Cont().trim().length() > 0)
				entity.setFac2Cont(form.getFac2Cont().trim());
			if(form.getFac2Main() != null && form.getFac2Main().trim().length() > 0)
				entity.setFac2Main(form.getFac2Main().trim());
			if(form.getFac2Record() != null && form.getFac2Record().trim().length() > 0)
				entity.setFac2Record(form.getFac2Record().trim());
			if(form.getFac3() != null && form.getFac3().trim().length() > 0)
				entity.setFac3(form.getFac3().trim());
			if(form.getFac3Cont() != null && form.getFac3Cont().trim().length() > 0)
				entity.setFac3Cont(form.getFac3Cont().trim());
			if(form.getFac3Main() != null && form.getFac3Main().trim().length() > 0)
				entity.setFac3Main(form.getFac3Main().trim());
			if(form.getFac3Record() != null && form.getFac3Record().trim().length() > 0)
				entity.setFac3Record(form.getFac3Record().trim());
			if(form.getFac4() != null && form.getFac4().trim().length() > 0)
				entity.setFac4(form.getFac4().trim());
			if(form.getFac4Cont() != null && form.getFac4Cont().trim().length() > 0)
				entity.setFac4Cont(form.getFac4Cont().trim());
			if(form.getFac4Main() != null && form.getFac4Main().trim().length() > 0)
				entity.setFac4Main(form.getFac4Main().trim());
			if(form.getFac4Record() != null && form.getFac4Record().trim().length() > 0)
				entity.setFac4Record(form.getFac4Record().trim());
			if(form.getState() != null && form.getState().trim().length() > 0)
				entity.setState(form.getState().trim());
			if(form.getCheckPersonId() != null && form.getCheckPersonId().trim().length() > 0)
				entity.setCheckPersonId(form.getCheckPersonId().trim());
			if(form.getCheckPerson() != null && form.getCheckPerson().trim().length() > 0)
				entity.setCheckPerson(form.getCheckPerson().trim());
			entity.setCheckTime(form.getCheckTime());
			if(form.getCheckDesription() != null && form.getCheckDesription().trim().length() > 0)
				entity.setCheckDesription(form.getCheckDesription().trim());
			if(form.getLoginName() != null && form.getLoginName().trim().length() > 0)
				entity.setLoginName(form.getLoginName().trim());
			if(form.getDirectOrgId() != null && form.getDirectOrgId().trim().length() > 0)
				entity.setDirectOrgId(form.getDirectOrgId().trim());
			if(form.getDirectOrgName() != null && form.getDirectOrgName().trim().length() > 0)
				entity.setDirectOrgName(form.getDirectOrgName().trim());
			if(form.getTeamOrgId() != null && form.getTeamOrgId().trim().length() > 0)
				entity.setTeamOrgId(form.getTeamOrgId().trim());
			if(form.getTeamOrgName() != null && form.getTeamOrgName().trim().length() > 0)
				entity.setTeamOrgName(form.getTeamOrgName().trim());
			if(form.getParentOrgId() != null && form.getParentOrgId().trim().length() > 0)
				entity.setParentOrgId(form.getParentOrgId().trim());
			if(form.getParentOrgName() != null && form.getParentOrgName().trim().length() > 0)
				entity.setParentOrgName(form.getParentOrgName().trim());
			entity.setDeleteTime(form.getDeleteTime());
			if(form.getDeleteUserId() != null && form.getDeleteUserId().trim().length() > 0)
				entity.setDeleteUserId(form.getDeleteUserId().trim());
			if(form.getDeleteUserName() != null && form.getDeleteUserName().trim().length() > 0)
				entity.setDeleteUserName(form.getDeleteUserName().trim());
			if(form.getDeleteUserPhone() != null && form.getDeleteUserPhone().trim().length() > 0)
				entity.setDeleteUserPhone(form.getDeleteUserPhone().trim());
			if(form.getUnitId() != null && form.getUnitId().trim().length() > 0)
				entity.setUnitId(form.getUnitId());
			if(form.getX() != null)
				entity.setX(form.getX());
			if(form.getY() != null)
				entity.setY(form.getY());
			if(form.getUpdateTime() != null)
				entity.setUpdateTime(form.getUpdateTime());
			if(form.getDescription() != null && form.getDescription().trim().length() > 0)
				entity.setDescription(form.getDescription());
			if(form.getDischargeId() != null)
				entity.setDischargeId(form.getDischargeId());
		}
	}
	
	public static List<PshReportDeleteForm> convertVoListToFormList(List<PshReportDelete> pshReportDeleteList) {
		if(pshReportDeleteList != null && pshReportDeleteList.size() > 0) {
			List<PshReportDeleteForm> pshReportDeleteFormList = new ArrayList();
			for(int i=0; i<pshReportDeleteList.size(); i++) {
				pshReportDeleteFormList.add(convertVoToForm(pshReportDeleteList.get(i)));
			}
			return pshReportDeleteFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<PshReportDelete> pshReportDeleteList) {
		if(pshReportDeleteList != null && pshReportDeleteList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<pshReportDeleteList.size(); i++) {
				PshReportDelete entity = pshReportDeleteList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("doorplateAddressCode", entity.getDoorplateAddressCode() == null ? "" : entity.getDoorplateAddressCode().toString());
				map.put("houseIdFlag", entity.getHouseIdFlag());
				map.put("houseId", entity.getHouseId());
				map.put("markPersonId", entity.getMarkPersonId());
				map.put("markPerson", entity.getMarkPerson());
				map.put("markTime", entity.getMarkTime());
				map.put("addr", entity.getAddr());
				map.put("area", entity.getArea());
				map.put("town", entity.getTown());
				map.put("village", entity.getVillage());
				map.put("street", entity.getStreet());
				map.put("mph", entity.getMph());
				map.put("name", entity.getName());
				map.put("psdy", entity.getPsdy());
				map.put("fqname", entity.getFqname());
				map.put("jzwcode", entity.getJzwcode());
				map.put("volume", entity.getVolume() == null ? "" : entity.getVolume().toString());
				map.put("owner", entity.getOwner());
				map.put("ownerTele", entity.getOwnerTele());
				map.put("operator", entity.getOperator());
				map.put("operatorTele", entity.getOperatorTele());
				map.put("hasCert1", entity.getHasCert1());
				map.put("cert1Code", entity.getCert1Code());
				map.put("hasCert2", entity.getHasCert2());
				map.put("hasCert3", entity.getHasCert3());
				map.put("cert3Code", entity.getCert3Code());
				map.put("hasCert4", entity.getHasCert4());
				map.put("cert4Code", entity.getCert4Code());
				map.put("dischargerType1", entity.getDischargerType1());
				map.put("dischargerType2", entity.getDischargerType2());
				map.put("fac1", entity.getFac1());
				map.put("fac1Cont", entity.getFac1Cont());
				map.put("fac1Main", entity.getFac1Main());
				map.put("fac1Record", entity.getFac1Record());
				map.put("fac2", entity.getFac2());
				map.put("fac2Cont", entity.getFac2Cont());
				map.put("fac2Main", entity.getFac2Main());
				map.put("fac2Record", entity.getFac2Record());
				map.put("fac3", entity.getFac3());
				map.put("fac3Cont", entity.getFac3Cont());
				map.put("fac3Main", entity.getFac3Main());
				map.put("fac3Record", entity.getFac3Record());
				map.put("fac4", entity.getFac4());
				map.put("fac4Cont", entity.getFac4Cont());
				map.put("fac4Main", entity.getFac4Main());
				map.put("fac4Record", entity.getFac4Record());
				map.put("state", entity.getState());
				map.put("checkPersonId", entity.getCheckPersonId());
				map.put("checkPerson", entity.getCheckPerson());
				map.put("checkTime", entity.getCheckTime());
				map.put("checkDesription", entity.getCheckDesription());
				map.put("loginName", entity.getLoginName());
				map.put("directOrgId", entity.getDirectOrgId());
				map.put("directOrgName", entity.getDirectOrgName());
				map.put("teamOrgId", entity.getTeamOrgId());
				map.put("teamOrgName", entity.getTeamOrgName());
				map.put("parentOrgId", entity.getParentOrgId());
				map.put("parentOrgName", entity.getParentOrgName());
				map.put("deleteTime", entity.getDeleteTime());
				map.put("deleteUserId", entity.getDeleteUserId());
				map.put("deleteUserName", entity.getDeleteUserName());
				map.put("deleteUserPhone", entity.getDeleteUserPhone());
				map.put("unitId", entity.getUnitId());
				map.put("x", entity.getX());
				map.put("y", entity.getY());
				map.put("updateTime", entity.getUpdateTime());
				map.put("description", entity.getDescription());
				map.put("dischargeId", entity.getDischargeId() == null ? "" : entity.getDischargeId().toString());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<PshReportDelete> convertFormListToVoList(List<PshReportDeleteForm> pshReportDeleteFormList) {
		if(pshReportDeleteFormList != null && pshReportDeleteFormList.size() > 0) {
			List<PshReportDelete> pshReportDeleteList = new ArrayList();
			for(int i=0; i<pshReportDeleteFormList.size(); i++) {
				PshReportDelete pshReportDelete = new PshReportDelete();
				convertFormToVo(pshReportDeleteFormList.get(i), pshReportDelete);
				pshReportDeleteList.add(pshReportDelete);
			}
			return pshReportDeleteList;
		}
		return null;
	}
}