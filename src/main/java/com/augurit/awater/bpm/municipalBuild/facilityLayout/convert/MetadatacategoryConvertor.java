package com.augurit.awater.bpm.municipalBuild.facilityLayout.convert;

import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metadatacategory;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetadatacategoryForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MetadatacategoryConvertor {
    public static MetadatacategoryForm convertVoToForm(Metadatacategory entity) {
        if (entity != null) {
            MetadatacategoryForm form = new MetadatacategoryForm();
            form.setMetadatacategoryid(entity.getMetadatacategoryid());
            form.setMetadatacategoryname(entity.getMetadatacategoryname());
            form.setDisplayname(entity.getDisplayname());
            form.setDisplayorder(entity.getDisplayorder());
            form.setSeniorid(entity.getSeniorid());
            form.setId(entity.getId());
            form.setState(entity.getState());
            form.setBelongtofacman(entity.getBelongtofacman());
            return form;
        } else
            return null;
    }

    public static void convertFormToVo(MetadatacategoryForm form, Metadatacategory entity) {
        if (entity != null && form != null) {
            entity.setMetadatacategoryid(form.getMetadatacategoryid());
            if (form.getMetadatacategoryname() != null && form.getMetadatacategoryname().trim().length() > 0)
                entity.setMetadatacategoryname(form.getMetadatacategoryname().trim());
            if (form.getDisplayname() != null && form.getDisplayname().trim().length() > 0)
                entity.setDisplayname(form.getDisplayname().trim());
            entity.setDisplayorder(form.getDisplayorder());
            entity.setSeniorid(form.getSeniorid());
            entity.setId(form.getId());
            if (form.getState() != null && form.getState().trim().length() > 0)
                entity.setState(form.getState().trim());
            if (form.getBelongtofacman() != null && form.getBelongtofacman().trim().length() > 0)
                entity.setBelongtofacman(form.getBelongtofacman().trim());
        }
    }

    public static List<MetadatacategoryForm> convertVoListToFormList(List<Metadatacategory> metadatacategoryList) {
        if (metadatacategoryList != null && metadatacategoryList.size() > 0) {
            List<MetadatacategoryForm> metadatacategoryFormList = new ArrayList();
            for (int i = 0; i < metadatacategoryList.size(); i++) {
                metadatacategoryFormList.add(convertVoToForm(metadatacategoryList.get(i)));
            }
            return metadatacategoryFormList;
        }
        return null;
    }

    public static List<Map> convertVoListToMapList(List<Metadatacategory> metadatacategoryList) {
        if (metadatacategoryList != null && metadatacategoryList.size() > 0) {
            List<Map> mapList = new ArrayList();
            for (int i = 0; i < metadatacategoryList.size(); i++) {
                Metadatacategory entity = metadatacategoryList.get(i);
                Map map = new HashMap();

                map.put("metadatacategoryid", entity.getMetadatacategoryid() == null ? "" : entity.getMetadatacategoryid().toString());
                map.put("metadatacategoryname", entity.getMetadatacategoryname());
                map.put("displayname", entity.getDisplayname());
                map.put("displayorder", entity.getDisplayorder() == null ? "" : entity.getDisplayorder().toString());
                map.put("seniorid", entity.getSeniorid() == null ? "" : entity.getSeniorid().toString());
                map.put("id", entity.getId() == null ? "" : entity.getId().toString());
                map.put("state", entity.getState());
                map.put("belongtofacman", entity.getBelongtofacman());
                mapList.add(map);
            }
            return mapList;
        }
        return null;
    }

    public static List<Metadatacategory> convertFormListToVoList(List<MetadatacategoryForm> metadatacategoryFormList) {
        if (metadatacategoryFormList != null && metadatacategoryFormList.size() > 0) {
            List<Metadatacategory> metadatacategoryList = new ArrayList();
            for (int i = 0; i < metadatacategoryFormList.size(); i++) {
                Metadatacategory metadatacategory = new Metadatacategory();
                convertFormToVo(metadatacategoryFormList.get(i), metadatacategory);
                metadatacategoryList.add(metadatacategory);
            }
            return metadatacategoryList;
        }
        return null;
    }
}