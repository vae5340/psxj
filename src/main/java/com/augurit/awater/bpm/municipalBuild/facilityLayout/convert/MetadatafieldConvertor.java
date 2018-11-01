package com.augurit.awater.bpm.municipalBuild.facilityLayout.convert;

import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metadatafield;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetadatafieldForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class MetadatafieldConvertor {
	public static MetadatafieldForm convertVoToForm(Metadatafield entity) {
		if(entity != null) {
			MetadatafieldForm form = new MetadatafieldForm();
			form.setFieldid(entity.getFieldid());
			form.setFieldname(entity.getFieldname());
			form.setDisplayname(entity.getDisplayname());
			form.setTableid(entity.getTableid());
			form.setClasspropertyid(entity.getClasspropertyid());
			form.setFielddesc(entity.getFielddesc());
			form.setDatatypeid(entity.getDatatypeid());
			form.setDatatypename(entity.getDatatypename());
			form.setFieldstatecode(entity.getFieldstatecode());
			form.setDatatypelength(entity.getDatatypelength());
			form.setNullflag(entity.getNullflag());
			form.setFieldinfo(entity.getFieldinfo());
			form.setPrimarykeyfieldflag(entity.getPrimarykeyfieldflag());
			form.setRelatedfieldflag(entity.getRelatedfieldflag());
			form.setListfieldflag(entity.getListfieldflag());
			form.setQueryfieldflag(entity.getQueryfieldflag());
			form.setDisplayorder(entity.getDisplayorder());
			form.setDiccode(entity.getDiccode());
			form.setPatrolfieldflag(entity.getPatrolfieldflag());
			form.setComponentid(entity.getComponentid());
			form.setColspan(entity.getColspan());
			form.setEditflag(entity.getEditflag());
			form.setValidateid(entity.getValidateid());
			form.setId(entity.getId());
			form.setBelongmetacodeitem(entity.getBelongmetacodeitem());
			form.setBelongmetacodename(entity.getBelongmetacodename());
			form.setRelateddiccode(entity.getRelateddiccode());
			form.setRelatedtabletypecode(entity.getRelatedtabletypecode());
			form.setRelatedtablediccode(entity.getRelatedtablediccode());
			form.setRelatedtabledicname(entity.getRelatedtabledicname());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(MetadatafieldForm form, Metadatafield entity) {
		if(entity != null && form != null) {
			entity.setFieldid(form.getFieldid());
			if(form.getFieldname() != null && form.getFieldname().trim().length() > 0)
				entity.setFieldname(form.getFieldname().trim());
			if(form.getDisplayname() != null && form.getDisplayname().trim().length() > 0)
				entity.setDisplayname(form.getDisplayname().trim());
			entity.setTableid(form.getTableid());
			entity.setClasspropertyid(form.getClasspropertyid());
			if(form.getFielddesc() != null && form.getFielddesc().trim().length() > 0)
				entity.setFielddesc(form.getFielddesc().trim());
			entity.setDatatypeid(form.getDatatypeid());
			if(form.getDatatypename() != null && form.getDatatypename().trim().length() > 0)
				entity.setDatatypename(form.getDatatypename().trim());
			if(form.getFieldstatecode() != null && form.getFieldstatecode().trim().length() > 0)
				entity.setFieldstatecode(form.getFieldstatecode().trim());

			if(form.getBelongmetacodeitem() != null && form.getBelongmetacodeitem().trim().length() > 0)
				entity.setBelongmetacodeitem(form.getBelongmetacodeitem().trim());
			if(form.getBelongmetacodename() != null && form.getBelongmetacodename().trim().length() > 0)
				entity.setBelongmetacodeitem(form.getBelongmetacodename().trim());

			entity.setDatatypelength(form.getDatatypelength());
			entity.setNullflag(form.getNullflag());
			if(form.getFieldinfo() != null && form.getFieldinfo().trim().length() > 0)
				entity.setFieldinfo(form.getFieldinfo().trim());
			entity.setPrimarykeyfieldflag(form.getPrimarykeyfieldflag());
			entity.setRelatedfieldflag(form.getRelatedfieldflag());
			entity.setListfieldflag(form.getListfieldflag());
			entity.setQueryfieldflag(form.getQueryfieldflag());
			entity.setDisplayorder(form.getDisplayorder());
			if(form.getDiccode() != null && form.getDiccode().trim().length() > 0)
				entity.setDiccode(form.getDiccode().trim());
			entity.setPatrolfieldflag(form.getPatrolfieldflag());
			entity.setComponentid(form.getComponentid());
			entity.setColspan(form.getColspan());
			entity.setEditflag(form.getEditflag());
			entity.setValidateid(form.getValidateid());
			if(form.getRelateddiccode() != null && form.getRelateddiccode().trim().length() > 0)
				entity.setRelateddiccode(form.getRelateddiccode().trim());
			if(form.getRelatedtabletypecode() != null && form.getRelatedtabletypecode().trim().length() > 0)
				entity.setRelatedtabletypecode(form.getRelatedtabletypecode().trim());
			if(form.getRelatedtablediccode() != null && form.getRelatedtablediccode().trim().length() > 0)
				entity.setRelatedtablediccode(form.getRelatedtablediccode().trim());
			if(form.getRelatedtabledicname() != null && form.getRelatedtabledicname().trim().length() > 0)
				entity.setRelatedtabledicname(form.getRelatedtabledicname().trim());
			entity.setId(form.getId());
		}
	}
	
	public static List<MetadatafieldForm> convertVoListToFormList(List<Metadatafield> metadatafieldList) {
		if(metadatafieldList != null && metadatafieldList.size() > 0) {
			List<MetadatafieldForm> metadatafieldFormList = new ArrayList();
			for(int i=0; i<metadatafieldList.size(); i++) {
				metadatafieldFormList.add(convertVoToForm(metadatafieldList.get(i)));
			}
			return metadatafieldFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<Metadatafield> metadatafieldList) {
		if(metadatafieldList != null && metadatafieldList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<metadatafieldList.size(); i++) {
				Metadatafield entity = metadatafieldList.get(i);
				Map map = new HashMap();

				map.put("fieldid", entity.getFieldid() == null ? "" : entity.getFieldid().toString());
				map.put("fieldname", entity.getFieldname());
				map.put("displayname", entity.getDisplayname());
				map.put("tableid", entity.getTableid() == null ? "" : entity.getTableid().toString());
				map.put("classpropertyid", entity.getClasspropertyid() == null ? "" : entity.getClasspropertyid().toString());
				map.put("fielddesc", entity.getFielddesc());
				map.put("belongmetacodename", entity.getBelongmetacodename());
				map.put("fieldstatecode", entity.getFieldstatecode());
				map.put("getBelongmetacodeitem", entity.getBelongmetacodeitem());
				map.put("datatypeid", entity.getDatatypeid() == null ? "" : entity.getDatatypeid().toString());
				map.put("datatypename", entity.getDatatypename());
				map.put("datatypelength", entity.getDatatypelength() == null ? "" : entity.getDatatypelength().toString());
				map.put("nullflag", entity.getNullflag() == null ? "" : entity.getNullflag().toString());
				map.put("fieldinfo", entity.getFieldinfo());
				map.put("primarykeyfieldflag", entity.getPrimarykeyfieldflag() == null ? "" : entity.getPrimarykeyfieldflag().toString());
				map.put("relatedfieldflag", entity.getRelatedfieldflag() == null ? "" : entity.getRelatedfieldflag().toString());
				map.put("listfieldflag", entity.getListfieldflag() == null ? "" : entity.getListfieldflag().toString());
				map.put("queryfieldflag", entity.getQueryfieldflag() == null ? "" : entity.getQueryfieldflag().toString());
				map.put("displayorder", entity.getDisplayorder() == null ? "" : entity.getDisplayorder().toString());
				map.put("diccode", entity.getDiccode());
				map.put("patrolfieldflag", entity.getPatrolfieldflag() == null ? "" : entity.getPatrolfieldflag().toString());
				map.put("componentid", entity.getComponentid() == null ? "" : entity.getComponentid().toString());
				map.put("colspan", entity.getColspan() == null ? "" : entity.getColspan().toString());
				map.put("editflag", entity.getEditflag() == null ? "" : entity.getEditflag().toString());
				map.put("validateid", entity.getValidateid() == null ? "" : entity.getValidateid().toString());
				map.put("relateddiccode", entity.getRelateddiccode());
				map.put("relatedtabletypecode", entity.getRelatedtabletypecode());
				map.put("relatedtablediccode", entity.getRelatedtablediccode());
				map.put("relatedtabledicname", entity.getRelatedtabledicname());
				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<Metadatafield> convertFormListToVoList(List<MetadatafieldForm> metadatafieldFormList) {
		if(metadatafieldFormList != null && metadatafieldFormList.size() > 0) {
			List<Metadatafield> metadatafieldList = new ArrayList();
			for(int i=0; i<metadatafieldFormList.size(); i++) {
				Metadatafield metadatafield = new Metadatafield();
				convertFormToVo(metadatafieldFormList.get(i), metadatafield);
				metadatafieldList.add(metadatafield);
			}
			return metadatafieldList;
		}
		return null;
	}
}