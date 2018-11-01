package com.augurit.awater.bpm.municipalBuild.facilityLayout.convert;

import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metadatatable;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetadatatableForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class MetadatatableConvertor {
	public static MetadatatableForm convertVoToForm(Metadatatable entity) {
		if(entity != null) {
			MetadatatableForm form = new MetadatatableForm();
			form.setTableid(entity.getTableid());
			form.setTablename(entity.getTablename());
			form.setDisplayname(entity.getDisplayname());
			form.setTabledesc(entity.getTabledesc());
			form.setTemplateid(entity.getTemplateid());
			form.setMetacodetypecode(entity.getMetacodetypecode());
			form.setMetadatacategoryid(entity.getMetadatacategoryid());
			form.setPrimarykeyfieldname(entity.getPrimarykeyfieldname());
			form.setRelatedfieldname(entity.getRelatedfieldname());
			form.setSequencename(entity.getSequencename());
			form.setDisplayorder(entity.getDisplayorder());
			form.setId(entity.getId());
			form.setLayertype(entity.getLayertype());
			form.setTabletype(entity.getTabletype());
			form.setTablestatecode(entity.getTablestatecode());
			form.setHasfile(entity.getHasfile());
			form.setIsDictionary(entity.getIsDictionary());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(MetadatatableForm form, Metadatatable entity) {
		if(entity != null && form != null) {
			entity.setTableid(form.getTableid());
			if(form.getTablename() != null && form.getTablename().trim().length() > 0)
				entity.setTablename(form.getTablename().trim());
			if(form.getDisplayname() != null && form.getDisplayname().trim().length() > 0)
				entity.setDisplayname(form.getDisplayname().trim());
			if(form.getTabledesc() != null && form.getTabledesc().trim().length() > 0)
				entity.setTabledesc(form.getTabledesc().trim());
			if(form.getMetacodetypecode() != null && form.getMetacodetypecode().trim().length() > 0)
				entity.setMetacodetypecode(form.getMetacodetypecode().trim());
			entity.setTemplateid(form.getTemplateid());
			entity.setMetadatacategoryid(form.getMetadatacategoryid());
			if(form.getPrimarykeyfieldname() != null && form.getPrimarykeyfieldname().trim().length() > 0)
				entity.setPrimarykeyfieldname(form.getPrimarykeyfieldname().trim());
			if(form.getRelatedfieldname() != null && form.getRelatedfieldname().trim().length() > 0)
				entity.setRelatedfieldname(form.getRelatedfieldname().trim());
			if(form.getSequencename() != null && form.getSequencename().trim().length() > 0)
				entity.setSequencename(form.getSequencename().trim());
			if(form.getTablestatecode() != null && form.getTablestatecode().trim().length() > 0)
				entity.setTablestatecode(form.getTablestatecode().trim());
			entity.setDisplayorder(form.getDisplayorder());
			entity.setId(form.getId());
			entity.setTabletype(form.getTabletype());
			entity.setLayertype(form.getLayertype());
			entity.setHasfile(form.getHasfile());
			entity.setIsDictionary(form.getIsDictionary());
		}
	}
	
	public static List<MetadatatableForm> convertVoListToFormList(List<Metadatatable> metadatatableList) {
		if(metadatatableList != null && metadatatableList.size() > 0) {
			List<MetadatatableForm> metadatatableFormList = new ArrayList();
			for(int i=0; i<metadatatableList.size(); i++) {
				metadatatableFormList.add(convertVoToForm(metadatatableList.get(i)));
			}
			return metadatatableFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<Metadatatable> metadatatableList) {
		if(metadatatableList != null && metadatatableList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<metadatatableList.size(); i++) {
				Metadatatable entity = metadatatableList.get(i);
				Map map = new HashMap();

				map.put("tableid", entity.getTableid() == null ? "" : entity.getTableid().toString());
				map.put("tablename", entity.getTablename());
				map.put("displayname", entity.getDisplayname());
				map.put("tabledesc", entity.getTabledesc());
				map.put("metacodetypecode", entity.getMetacodetypecode());
				map.put("templateid", entity.getTemplateid() == null ? "" : entity.getTemplateid().toString());
				map.put("metadatacategoryid", entity.getMetadatacategoryid() == null ? "" : entity.getMetadatacategoryid().toString());
				map.put("primarykeyfieldname", entity.getPrimarykeyfieldname());
				map.put("relatedfieldname", entity.getRelatedfieldname());
				map.put("sequencename", entity.getSequencename());
				map.put("tablestatecode", entity.getTablestatecode());
				map.put("displayorder", entity.getDisplayorder() == null ? "" : entity.getDisplayorder().toString());
				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("layertype", entity.getLayertype() == null ? "" : entity.getLayertype().toString());
				map.put("tabletype", entity.getTabletype() == null ? "" : entity.getTabletype().toString());
				map.put("hasfile",entity.getHasfile() == null ? "" : entity.getHasfile().toString());
				map.put("isDictionary",entity.getIsDictionary() == null ? "" : entity.getIsDictionary().toString());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<Metadatatable> convertFormListToVoList(List<MetadatatableForm> metadatatableFormList) {
		if(metadatatableFormList != null && metadatatableFormList.size() > 0) {
			List<Metadatatable> metadatatableList = new ArrayList();
			for(int i=0; i<metadatatableFormList.size(); i++) {
				Metadatatable metadatatable = new Metadatatable();
				convertFormToVo(metadatatableFormList.get(i), metadatatable);
				metadatatableList.add(metadatatable);
			}
			return metadatatableList;
		}
		return null;
	}
}