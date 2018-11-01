package com.augurit.awater.dri.psh.discharge.convert;

import com.augurit.awater.dri.psh.discharge.entity.PshDischarger;
import com.augurit.awater.dri.psh.discharge.web.form.PshDischargerForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class PshDischargerConvertor {
	public static PshDischargerForm convertVoToForm(PshDischarger entity) {
		if(entity != null) {
			PshDischargerForm form = new PshDischargerForm();
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
			form.setTeamOrgId(entity.getTeamOrgId());
			form.setTeamOrgName(entity.getTeamOrgName());
			form.setDirectOrgId(entity.getDirectOrgId());
			form.setDirectOrgName(entity.getDirectOrgName());
			form.setParentOrgId(entity.getParentOrgId());
			form.setParentOrgName(entity.getParentOrgName());
			
			form.setUnitId(entity.getUnitId());
			form.setX(entity.getX());
			form.setY(entity.getY());
			form.setUpdateTime(entity.getUpdateTime());
			form.setDescription(entity.getDescription());
			form.setKjArea(entity.getKjArea());
			form.setKjTown(entity.getKjTown());
			form.setKjVillage(entity.getKjVillage());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(PshDischargerForm form, PshDischarger entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			if(form.getDoorplateAddressCode() != null && form.getDoorplateAddressCode().trim().length() > 0)
				entity.setDoorplateAddressCode(form.getDoorplateAddressCode());
			if(form.getHouseIdFlag() != null && form.getHouseIdFlag().trim().length() > 0)
				entity.setHouseIdFlag(form.getHouseIdFlag().trim());
			if(form.getHouseId() != null && form.getHouseId().trim().length() > 0)
				entity.setHouseId(form.getHouseId().trim());
			if(form.getMarkPersonId() != null && form.getMarkPersonId().trim().length() > 0)
				entity.setMarkPersonId(form.getMarkPersonId().trim());
			if(form.getMarkPerson() != null && form.getMarkPerson().trim().length() > 0)
				entity.setMarkPerson(form.getMarkPerson().trim());
			if(form.getMarkTime()!=null)
				entity.setMarkTime(form.getMarkTime());
			entity.setAddr(form.getAddr());
			entity.setArea(form.getArea());
			entity.setTown(form.getTown());
			entity.setVillage(form.getVillage());
			entity.setStreet(form.getStreet());
			entity.setMph(form.getMph());
			entity.setName(form.getName());
			entity.setPsdy(form.getPsdy());
			entity.setFqname(form.getFqname());
			entity.setJzwcode(form.getJzwcode());
			entity.setVolume(form.getVolume());
			entity.setOwner(form.getOwner());
			entity.setOwnerTele(form.getOwnerTele());
			entity.setOperator(form.getOperator());
			entity.setOperatorTele(form.getOperatorTele());
			entity.setHasCert1(form.getHasCert1());
			entity.setCert1Code(form.getCert1Code());
			entity.setHasCert2(form.getHasCert2());
			entity.setHasCert3(form.getHasCert3());
			entity.setCert3Code(form.getCert3Code());
			entity.setHasCert4(form.getHasCert4());
			entity.setCert4Code(form.getCert4Code());
			entity.setDischargerType1(form.getDischargerType1());
			entity.setDischargerType2(form.getDischargerType2());
			entity.setFac1(form.getFac1());
			entity.setFac1Cont(form.getFac1Cont());
			entity.setFac1Main(form.getFac1Main());
			entity.setFac1Record(form.getFac1Record());
			entity.setFac2(form.getFac2());
			entity.setFac2Cont(form.getFac2Cont());
			entity.setFac2Main(form.getFac2Main());
			entity.setFac2Record(form.getFac2Record());
			entity.setFac3(form.getFac3());
			entity.setFac3Cont(form.getFac3Cont());
			entity.setFac3Main(form.getFac3Main());
			entity.setFac3Record(form.getFac3Record());
			entity.setFac4(form.getFac4());
			entity.setFac4Cont(form.getFac4Cont());
			entity.setFac4Main(form.getFac4Main());
			entity.setFac4Record(form.getFac4Record());
			if(form.getState() != null && form.getState().trim().length() > 0)
				entity.setState(form.getState().trim());
			if(form.getCheckPersonId() != null && form.getCheckPersonId().trim().length() > 0)
				entity.setCheckPersonId(form.getCheckPersonId().trim());
			if(form.getCheckPerson() != null && form.getCheckPerson().trim().length() > 0)
				entity.setCheckPerson(form.getCheckPerson().trim());
			if(form.getCheckTime() != null)
				entity.setCheckTime(form.getCheckTime());
			if(form.getCheckDesription() != null && form.getCheckDesription().trim().length() > 0)
				entity.setCheckDesription(form.getCheckDesription().trim());
			if(form.getLoginName() != null && form.getLoginName().trim().length() > 0)
				entity.setLoginName(form.getLoginName());
			if(form.getTeamOrgId() != null && form.getTeamOrgId().trim().length() > 0)
				entity.setTeamOrgId(form.getTeamOrgId().trim());
			if(form.getTeamOrgName() != null && form.getTeamOrgName().trim().length() > 0)
				entity.setTeamOrgName(form.getTeamOrgName().trim());
			if(form.getDirectOrgId() != null && form.getDirectOrgId().trim().length() > 0)
				entity.setDirectOrgId(form.getDirectOrgId().trim());
			if(form.getDirectOrgName() != null && form.getDirectOrgName().trim().length() > 0)
				entity.setDirectOrgName(form.getDirectOrgName().trim());
			if(form.getParentOrgId() != null && form.getParentOrgId().trim().length() > 0)
				entity.setParentOrgId(form.getParentOrgId().trim());
			if(form.getParentOrgName() != null && form.getParentOrgName().trim().length() > 0)
				entity.setParentOrgName(form.getParentOrgName().trim());
			if(form.getUnitId() != null && form.getUnitId().trim().length() > 0)
				entity.setUnitId(form.getUnitId());
			if(form.getX() != null)
				entity.setX(form.getX());
			if(form.getY() != null)
				entity.setY(form.getY());
			if(form.getUpdateTime() != null)
				entity.setUpdateTime(form.getUpdateTime());
			entity.setDescription(form.getDescription());
			if(form.getKjArea() != null && form.getKjArea().trim().length() > 0)
				entity.setKjArea(form.getKjArea());
			if(form.getKjTown() != null && form.getKjTown().trim().length() > 0)
				entity.setKjTown(form.getKjTown());
			if(form.getKjVillage() != null && form.getKjVillage().trim().length() > 0)
				entity.setKjVillage(form.getKjVillage());
		}
	}
	
	public static List<PshDischargerForm> convertVoListToFormList(List<PshDischarger> pshDischargerList) {
		if(pshDischargerList != null && pshDischargerList.size() > 0) {
			List<PshDischargerForm> pshDischargerFormList = new ArrayList();
			for(int i=0; i<pshDischargerList.size(); i++) {
				pshDischargerFormList.add(convertVoToForm(pshDischargerList.get(i)));
			}
			return pshDischargerFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<PshDischarger> pshDischargerList) {
		if(pshDischargerList != null && pshDischargerList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<pshDischargerList.size(); i++) {
				PshDischarger entity = pshDischargerList.get(i);
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
				map.put("teamOrgId", entity.getTeamOrgId());
				map.put("teamOrgName", entity.getTeamOrgName());
				map.put("directOrgId", entity.getDirectOrgId());
				map.put("directOrgName", entity.getDirectOrgName());
				map.put("parentOrgId", entity.getParentOrgId());
				map.put("parentOrgName", entity.getParentOrgName());
				map.put("unitId", entity.getUnitId());
				map.put("x", entity.getX());
				map.put("y", entity.getY());
				map.put("updateTime", entity.getUpdateTime());
				map.put("description", entity.getDescription());
				map.put("kjArea", entity.getKjArea());
				map.put("kjTown", entity.getKjTown());
				map.put("kjVillage", entity.getKjVillage());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static Map convertVoToMap(PshDischargerForm form) {
		Map map = new HashMap();
		map.put("id", form.getId() == null ? "" : form.getId().toString());
		map.put("doorplateAddressCode", form.getDoorplateAddressCode() == null ? "" : form.getDoorplateAddressCode().toString());
		map.put("houseIdFlag", form.getHouseIdFlag());
		map.put("houseId", form.getHouseId());
		map.put("markPersonId", form.getMarkPersonId());
		map.put("markPerson", form.getMarkPerson());
		map.put("markTime", form.getMarkTime()!=null?form.getMarkTime().getTime():null);
		map.put("addr", form.getAddr());
		map.put("area", form.getArea());
		map.put("town", form.getTown());
		map.put("village", form.getVillage());
		map.put("street", form.getStreet());
		map.put("mph", form.getMph());
		map.put("name", form.getName());
		map.put("psdy", form.getPsdy());
		map.put("fqname", form.getFqname());
		map.put("jzwcode", form.getJzwcode());
		map.put("volume", form.getVolume() == null ? "" : form.getVolume().toString());
		map.put("owner", form.getOwner());
		map.put("ownerTele", form.getOwnerTele());
		map.put("operator", form.getOperator());
		map.put("operatorTele", form.getOperatorTele());
		map.put("hasCert1", form.getHasCert1());
		map.put("cert1Code", form.getCert1Code());
		map.put("hasCert2", form.getHasCert2());
		map.put("hasCert3", form.getHasCert3());
		map.put("cert3Code", form.getCert3Code());
		map.put("hasCert4", form.getHasCert4());
		map.put("cert4Code", form.getCert4Code());
		map.put("dischargerType1", form.getDischargerType1());
		map.put("dischargerType2", form.getDischargerType2());
		map.put("fac1", form.getFac1());
		map.put("fac1Cont", form.getFac1Cont());
		map.put("fac1Main", form.getFac1Main());
		map.put("fac1Record", form.getFac1Record());
		map.put("fac2", form.getFac2());
		map.put("fac2Cont", form.getFac2Cont());
		map.put("fac2Main", form.getFac2Main());
		map.put("fac2Record", form.getFac2Record());
		map.put("fac3", form.getFac3());
		map.put("fac3Cont", form.getFac3Cont());
		map.put("fac3Main", form.getFac3Main());
		map.put("fac3Record", form.getFac3Record());
		map.put("fac4", form.getFac4());
		map.put("fac4Cont", form.getFac4Cont());
		map.put("fac4Main", form.getFac4Main());
		map.put("fac4Record", form.getFac4Record());
		map.put("state", form.getState());
		map.put("checkPersonId", form.getCheckPersonId());
		map.put("checkPerson", form.getCheckPerson());
		map.put("checkTime", form.getCheckTime()!=null?form.getCheckTime().getTime():null);
		map.put("checkDesription", form.getCheckDesription());
		
		map.put("loginName", form.getLoginName());
		map.put("teamOrgId", form.getTeamOrgId());
		map.put("teamOrgName", form.getTeamOrgName());
		map.put("directOrgId", form.getDirectOrgId());
		map.put("directOrgName", form.getDirectOrgName());
		map.put("parentOrgId", form.getParentOrgId());
		map.put("parentOrgName", form.getParentOrgName());
		map.put("unitId", form.getUnitId());
		map.put("x", form.getX());
		map.put("y", form.getY());
		map.put("updateTime", form.getUpdateTime()!=null?form.getUpdateTime().getTime():null);
		map.put("description", form.getDescription());
		map.put("kjArea", form.getKjArea());
		map.put("kjTown", form.getKjTown());
		map.put("kjVillage", form.getKjVillage());
	return map;
}
	
	public static List<PshDischarger> convertFormListToVoList(List<PshDischargerForm> pshDischargerFormList) {
		if(pshDischargerFormList != null && pshDischargerFormList.size() > 0) {
			List<PshDischarger> pshDischargerList = new ArrayList();
			for(int i=0; i<pshDischargerFormList.size(); i++) {
				PshDischarger pshDischarger = new PshDischarger();
				convertFormToVo(pshDischargerFormList.get(i), pshDischarger);
				pshDischargerList.add(pshDischarger);
			}
			return pshDischargerList;
		}
		return null;
	}
}