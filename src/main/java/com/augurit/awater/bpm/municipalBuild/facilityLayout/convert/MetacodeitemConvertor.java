package com.augurit.awater.bpm.municipalBuild.facilityLayout.convert;

import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metacodeitem;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetacodeitemForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class MetacodeitemConvertor {
    public static MetacodeitemForm convertVoToForm(Metacodeitem entity) {
        if (entity != null) {
            MetacodeitemForm form = new MetacodeitemForm();
            form.setId(entity.getId());
            form.setTypecode(entity.getTypecode());
            form.setCode(entity.getCode());
            form.setName(entity.getName());
            form.setStatus(entity.getStatus());
            form.setSortno(entity.getSortno());
            form.setMemo(entity.getMemo());
            form.setParenttypecode(entity.getParenttypecode());
            return form;
        } else
            return null;
    }

    public static void convertFormToVo(MetacodeitemForm form, Metacodeitem entity) {
        if (entity != null && form != null) {
            entity.setId(form.getId());
            if (form.getTypecode() != null && form.getTypecode().trim().length() > 0)
                entity.setTypecode(form.getTypecode().trim());
            if (form.getCode() != null && form.getCode().trim().length() > 0)
                entity.setCode(form.getCode().trim());
            if (form.getName() != null && form.getName().trim().length() > 0)
                entity.setName(form.getName().trim());
            entity.setStatus(form.getStatus());
            entity.setSortno(form.getSortno());
            if (form.getMemo() != null && form.getMemo().trim().length() > 0)
                entity.setMemo(form.getMemo().trim());
            if (form.getParenttypecode() != null && form.getParenttypecode().trim().length() > 0)
                entity.setParenttypecode(form.getParenttypecode().trim());
        }
    }

    public static List<MetacodeitemForm> convertVoListToFormList(List<Metacodeitem> metacodeitemList) {
        if (metacodeitemList != null && metacodeitemList.size() > 0) {
            List<MetacodeitemForm> metacodeitemFormList = new ArrayList();
            for (int i = 0; i < metacodeitemList.size(); i++) {
                metacodeitemFormList.add(convertVoToForm(metacodeitemList.get(i)));
            }
            return metacodeitemFormList;
        }
        return null;
    }

    public static List<Map> convertVoListToMapList(List<Metacodeitem> metacodeitemList) {
        if (metacodeitemList != null && metacodeitemList.size() > 0) {
            List<Map> mapList = new ArrayList();
            for (int i = 0; i < metacodeitemList.size(); i++) {
                Metacodeitem entity = metacodeitemList.get(i);
                Map map = new HashMap();

                map.put("id", entity.getId() == null ? "" : entity.getId().toString());
                map.put("typecode", entity.getTypecode());
                map.put("code", entity.getCode());
                map.put("name", entity.getName());
                map.put("status", entity.getStatus() == null ? "" : entity.getStatus().toString());
                map.put("sortno", entity.getSortno() == null ? "" : entity.getSortno().toString());
                map.put("memo", entity.getMemo());
                map.put("parenttypecode", entity.getParenttypecode());

                mapList.add(map);
            }
            return mapList;
        }
        return null;
    }

    public static List<Metacodeitem> convertFormListToVoList(List<MetacodeitemForm> metacodeitemFormList) {
        if (metacodeitemFormList != null && metacodeitemFormList.size() > 0) {
            List<Metacodeitem> metacodeitemList = new ArrayList();
            for (int i = 0; i < metacodeitemFormList.size(); i++) {
                Metacodeitem metacodeitem = new Metacodeitem();
                convertFormToVo(metacodeitemFormList.get(i), metacodeitem);
                metacodeitemList.add(metacodeitem);
            }
            return metacodeitemList;
        }
        return null;
    }
}