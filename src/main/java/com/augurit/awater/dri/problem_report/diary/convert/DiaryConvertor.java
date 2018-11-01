package com.augurit.awater.dri.problem_report.diary.convert;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.augurit.awater.dri.problem_report.diary.entity.Diary;
import com.augurit.awater.dri.problem_report.diary.web.form.DiaryForm;

public class DiaryConvertor {
    public static DiaryForm convertVoToForm(Diary entity) {
        if (entity != null) {
            DiaryForm form = new DiaryForm();
            form.setId(entity.getId());
            form.setWriterId(entity.getWriterId());
            form.setWriterName(entity.getWriterName());
            form.setRecordTime(entity.getRecordTime());
            form.setDescription(entity.getDescription());
            form.setRoad(entity.getRoad());
            form.setAddr(entity.getAddr());
            form.setX(entity.getX());
            form.setY(entity.getY());
            form.setTeamOrgId(entity.getTeamOrgId());
            form.setTeamOrgName(entity.getTeamOrgName());
            form.setDirectOrgId(entity.getDirectOrgId());
            form.setDirectOrgName(entity.getDirectOrgName());
            form.setParentOrgId(entity.getParentOrgId());
            form.setParentOrgName(entity.getParentOrgName());
            form.setSuperviseOrgId(entity.getSuperviseOrgId());
            form.setSuperviseOrgName(entity.getSuperviseOrgName());
            form.setTeamMember(entity.getTeamMember());
            form.setUpdateTime(entity.getUpdateTime());
            form.setLayerUrl(entity.getLayerUrl());
            form.setLayerName(entity.getLayerName());
            form.setObjectId(entity.getObjectId());
            form.setWaterLevel(entity.getWaterLevel());
            form.setLayerId(entity.getLayerId());
            form.setUsid(entity.getUsid());
            form.setCorrectType(entity.getCorrectType());
            form.setAttrOne(entity.getAttrOne());
            form.setAttrTwo(entity.getAttrTwo());
            form.setAttrThree(entity.getAttrThree());
            form.setAttrFour(entity.getAttrFour());
            form.setAttrFive(entity.getAttrFive());
            form.setAddrLatest(entity.getAddrLatest());
            form.setCoox(entity.getCoox());
            form.setCooy(entity.getCooy());
            form.setIsAddFeature(entity.getIsAddFeature());
            form.setCheckState(entity.getCheckState());
            form.setCheckPersonId(entity.getCheckPersonId());
            form.setCheckPerson(entity.getCheckPerson());
            form.setCheckTime(entity.getCheckTime());
            form.setCheckDesription(entity.getCheckDesription());
            form.setReportType(entity.getReportType());
            form.setUserx(entity.getUserx());
            form.setUsery(entity.getUsery());
            form.setUserAddr(entity.getUserAddr());
            form.setOriginAddr(entity.getOriginAddr());
            form.setOriginRoad(entity.getOriginRoad());
            form.setOriginx(entity.getOrginx());
            form.setOriginy(entity.getOrginy());
            form.setOriginAttrOne(entity.getOriginAttrOne());
            form.setOriginAttrTwo(entity.getOriginAttrTwo());
            form.setOriginAttrThree(entity.getOriginAttrThree());
            form.setOriginAttrFour(entity.getOriginAttrFour());
            form.setOriginAttrFive(entity.getOriginAttrFive());
            form.setPersonUserId(entity.getPersonUserId());
            form.setPcode(entity.getPcode());
            form.setChildCode(entity.getChildCode());
            form.setCityVillage(entity.getCityVillage());
            return form;
        } else
            return null;
    }

    public static void convertFormToVo(DiaryForm form, Diary entity) {
        if (entity != null && form != null) {
            entity.setId(form.getId());
            if (form.getWriterId() != null && form.getWriterId().trim().length() > 0)
                entity.setWriterId(form.getWriterId().trim());
            if (form.getWriterName() != null && form.getWriterName().trim().length() > 0)
                entity.setWriterName(form.getWriterName().trim());
            if(form.getRecordTime()!=null){
                entity.setRecordTime(form.getRecordTime());
            }
            if (form.getDescription() != null && form.getDescription().trim().length() > 0)
                entity.setDescription(form.getDescription().trim());
            if (form.getRoad() != null && form.getRoad().trim().length() > 0)
                entity.setRoad(form.getRoad().trim());
            if (form.getAddr() != null && form.getAddr().trim().length() > 0)
                entity.setAddr(form.getAddr().trim());
            entity.setX(form.getX());
            entity.setY(form.getY());
            if (form.getTeamOrgId() != null && form.getTeamOrgId().trim().length() > 0)
                entity.setTeamOrgId(form.getTeamOrgId().trim());
            if (form.getTeamOrgName() != null && form.getTeamOrgName().trim().length() > 0)
                entity.setTeamOrgName(form.getTeamOrgName().trim());
            if (form.getDirectOrgId() != null && form.getDirectOrgId().trim().length() > 0)
                entity.setDirectOrgId(form.getDirectOrgId().trim());
            if (form.getDirectOrgName() != null && form.getDirectOrgName().trim().length() > 0)
                entity.setDirectOrgName(form.getDirectOrgName().trim());
            if (form.getParentOrgId() != null && form.getParentOrgId().trim().length() > 0)
                entity.setParentOrgId(form.getParentOrgId().trim());
            if (form.getParentOrgName() != null && form.getParentOrgName().trim().length() > 0)
                entity.setParentOrgName(form.getParentOrgName().trim());
            if (form.getSuperviseOrgId() != null && form.getSuperviseOrgId().trim().length() > 0)
                entity.setSuperviseOrgId(form.getSuperviseOrgId().trim());
            if (form.getSuperviseOrgName() != null && form.getSuperviseOrgName().trim().length() > 0)
                entity.setSuperviseOrgName(form.getSuperviseOrgName().trim());
            if (form.getTeamMember() != null && form.getTeamMember().trim().length() > 0)
                entity.setTeamMember(form.getTeamMember().trim());
            entity.setUpdateTime(form.getUpdateTime());
            if (form.getLayerUrl() != null && form.getLayerUrl().trim().length() > 0)
                entity.setLayerUrl(form.getLayerUrl().trim());
            if (form.getLayerName() != null && form.getLayerName().trim().length() > 0)
                entity.setLayerName(form.getLayerName().trim());
            if (form.getObjectId() != null && form.getObjectId().trim().length() > 0)
                entity.setObjectId(form.getObjectId().trim());
            entity.setWaterLevel(form.getWaterLevel());
            entity.setLayerId(form.getLayerId());
            if (form.getUsid() != null && form.getUsid().trim().length() > 0)
                entity.setUsid(form.getUsid().trim());
            if (form.getCorrectType() != null && form.getCorrectType().trim().length() > 0)
                entity.setCorrectType(form.getCorrectType().trim());
            if (form.getAttrOne() != null && form.getAttrOne().trim().length() > 0)
                entity.setAttrOne(form.getAttrOne().trim());
            if (form.getAttrTwo() != null && form.getAttrTwo().trim().length() > 0)
                entity.setAttrTwo(form.getAttrTwo().trim());
            if (form.getAttrThree() != null && form.getAttrThree().trim().length() > 0)
                entity.setAttrThree(form.getAttrThree().trim());
            if (form.getAttrFour() != null && form.getAttrFour().trim().length() > 0)
                entity.setAttrFour(form.getAttrFour().trim());
            if (form.getAttrFive() != null && form.getAttrFive().trim().length() > 0)
                entity.setAttrFive(form.getAttrFive().trim());
            if (form.getAddrLatest() != null && form.getAddrLatest().trim().length() > 0)
                entity.setAddrLatest(form.getAddrLatest().trim());
            entity.setCoox(form.getCoox());
            entity.setCooy(form.getCooy());
            if (form.getIsAddFeature() != null && form.getIsAddFeature().trim().length() > 0)
                entity.setIsAddFeature(form.getIsAddFeature().trim());
            if (form.getCheckState() != null && form.getCheckState().trim().length() > 0)
                entity.setCheckState(form.getCheckState().trim());
            if (form.getCheckPersonId() != null && form.getCheckPersonId().trim().length() > 0)
                entity.setCheckPersonId(form.getCheckPersonId().trim());
            if (form.getCheckPerson() != null && form.getCheckPerson().trim().length() > 0)
                entity.setCheckPerson(form.getCheckPerson().trim());
            entity.setCheckTime(form.getCheckTime());
            if (form.getCheckPerson() != null && form.getCheckPerson().trim().length() > 0)
                entity.setCheckPerson(form.getCheckPerson().trim());
            if (form.getCheckDesription() != null && form.getCheckDesription().trim().length() > 0)
                entity.setCheckDesription(form.getCheckDesription().trim());
            if (form.getReportType() != null && form.getReportType().trim().length() > 0)
                entity.setReportType(form.getReportType().trim());
            entity.setUserx(form.getUserx());
            entity.setUsery(form.getUsery());
            if (form.getUserAddr() != null && form.getUserAddr().trim().length() > 0)
                entity.setUserAddr(form.getUserAddr().trim());
            if (form.getOriginAddr() != null && form.getOriginAddr().trim().length() > 0)
                entity.setOriginAddr(form.getOriginAddr().trim());
            if (form.getOriginRoad() != null && form.getOriginRoad().trim().length() > 0)
                entity.setOriginRoad(form.getOriginRoad().trim());
            entity.setOrginx(form.getOriginx());
            entity.setOrginy(form.getOriginy());
            if (form.getOriginAttrOne() != null && form.getOriginAttrOne().trim().length() > 0)
                entity.setOriginAttrOne(form.getOriginAttrOne().trim());
            if (form.getOriginAttrTwo() != null && form.getOriginAttrTwo().trim().length() > 0)
                entity.setOriginAttrTwo(form.getOriginAttrTwo().trim());
            if (form.getOriginAttrThree() != null && form.getOriginAttrThree().trim().length() > 0)
                entity.setOriginAttrThree(form.getOriginAttrThree().trim());
            if (form.getOriginAttrFour() != null && form.getOriginAttrFour().trim().length() > 0)
                entity.setOriginAttrFour(form.getOriginAttrFour().trim());
            if (form.getOriginAttrFive() != null && form.getOriginAttrFive().trim().length() > 0)
                entity.setOriginAttrFive(form.getOriginAttrFive().trim());
            entity.setPersonUserId(form.getPersonUserId());
            if (form.getPcode() != null && form.getPcode().trim().length() > 0)
                entity.setPcode(form.getPcode().trim());
            if (form.getChildCode() != null && form.getChildCode().trim().length() > 0)
                entity.setChildCode(form.getChildCode().trim());
            if (form.getCityVillage() != null && form.getCityVillage().trim().length() > 0)
                entity.setCityVillage(form.getCityVillage().trim());
        }
    }

    public static List<DiaryForm> convertVoListToFormList(List<Diary> diaryList) {
        if (diaryList != null && diaryList.size() > 0) {
            List<DiaryForm> diaryFormList = new ArrayList();
            for (int i = 0; i < diaryList.size(); i++) {
                diaryFormList.add(convertVoToForm(diaryList.get(i)));
            }
            return diaryFormList;
        }
        return null;
    }

    public static List<Map> convertVoListToMapList(List<Diary> diaryList) {
        if (diaryList != null && diaryList.size() > 0) {
            List<Map> mapList = new ArrayList();
            for (int i = 0; i < diaryList.size(); i++) {
                Diary entity = diaryList.get(i);
                Map map = new HashMap();
                map.put("id", entity.getId() == null ? "" : entity.getId().toString());
                map.put("writerId", entity.getWriterId());
                map.put("writerName", entity.getWriterName());
                if(entity.getRecordTime()!=null){
                    map.put("recordTime", entity.getRecordTime().getTime());
                }else {
                    map.put("recordTime",0);
                }
                map.put("description", entity.getDescription());
                map.put("road", entity.getRoad());
                map.put("addr", entity.getAddr());
                //map.put("x", entity.getX() == null ? "" : entity.getX().toString());
                //map.put("y", entity.getY() == null ? "" : entity.getY().toString());
                map.put("x", entity.getX());
                map.put("y", entity.getY());
                map.put("teamOrgId", entity.getTeamOrgId());
                map.put("teamOrgName", entity.getTeamOrgName());
                map.put("directOrgId", entity.getDirectOrgId());
                map.put("directOrgName", entity.getDirectOrgName());
                map.put("parentOrgId", entity.getParentOrgId());
                map.put("parentOrgName", entity.getParentOrgName());
                map.put("superviseOrgId", entity.getSuperviseOrgId());
                map.put("superviseOrgName", entity.getSuperviseOrgName());
                map.put("teamMember", entity.getTeamMember());
                if (entity.getUpdateTime()!= null) {
                    map.put("updateTime", entity.getUpdateTime().getTime());
                }else {
                    map.put("updateTime",0);
                }
                map.put("layerUrl", entity.getLayerUrl());
                map.put("layerName", entity.getLayerName());
                map.put("objectId", entity.getObjectId());
                map.put("waterLevel", entity.getWaterLevel());
                map.put("layerId", entity.getLayerId());
                map.put("usid", entity.getUsid());
                map.put("correctType", entity.getCorrectType());
                map.put("attrOne", entity.getAttrOne());
                map.put("attrTwo", entity.getAttrTwo());
                map.put("attrThree", entity.getAttrThree());
                map.put("attrFour", entity.getAttrFour());
                map.put("attrFive", entity.getAttrFive());
                map.put("addrLatest", entity.getAddrLatest());
                map.put("coox", entity.getCoox());
                map.put("cooy", entity.getCooy());
                map.put("isAddFeature", entity.getIsAddFeature());
                map.put("checkState", entity.getCheckState());
                map.put("checkPersonId", entity.getCheckPersonId());
                map.put("checkPerson", entity.getCheckPerson());
                map.put("checkTime", entity.getCheckTime());
                map.put("checkDesription", entity.getCheckDesription());
                map.put("reportType", entity.getReportType());
                map.put("userx", entity.getUserx());
                map.put("usery", entity.getUsery());
                map.put("userAddr", entity.getUserAddr());
                map.put("originAddr", entity.getOriginAddr());
                map.put("originRoad", entity.getOriginRoad());
                map.put("originx", entity.getOrginx());
                map.put("originy", entity.getOrginy());
                map.put("originAttrOne", entity.getOriginAttrOne());
                map.put("originAttrTwo", entity.getOriginAttrTwo());
                map.put("originAttrThree", entity.getOriginAttrThree());
                map.put("originAttrFour", entity.getOriginAttrFour());
                map.put("originAttrFive", entity.getOriginAttrFive());
                map.put("personUserId", entity.getPersonUserId());
                map.put("pcode", entity.getPcode());
                map.put("childCode", entity.getChildCode());
                map.put("cityVillage", entity.getCityVillage());
                mapList.add(map);
            }
            return mapList;
        }
        return null;
    }

    public static List<Diary> convertFormListToVoList(List<DiaryForm> diaryFormList) {
        if (diaryFormList != null && diaryFormList.size() > 0) {
            List<Diary> diaryList = new ArrayList();
            for (int i = 0; i < diaryFormList.size(); i++) {
                Diary diary = new Diary();
                convertFormToVo(diaryFormList.get(i), diary);
                diaryList.add(diary);
            }
            return diaryList;
        }
        return null;
    }


    /**
     * 移动端日期转成long
     */
    public static Map convertFormToMap(DiaryForm form) {

        Map map = new HashMap();
        map.put("id", form.getId() == null ? "" : form.getId().toString());
        map.put("writerId", form.getWriterId());
        map.put("writerName", form.getWriterName());
        map.put("recordTime", form.getRecordTime() != null ? form.getRecordTime().getTime() : null);

        map.put("description", form.getDescription());
        map.put("road", form.getRoad());
        map.put("addr", form.getAddr());
        //map.put("x", entity.getX() == null ? "" : entity.getX().toString());
        //map.put("y", entity.getY() == null ? "" : entity.getY().toString());
        map.put("x", form.getX());
        map.put("y", form.getY());
        map.put("teamOrgId", form.getTeamOrgId());
        map.put("teamOrgName", form.getTeamOrgName());
        map.put("directOrgId", form.getDirectOrgId());
        map.put("directOrgName", form.getDirectOrgName());
        map.put("parentOrgId", form.getParentOrgId());
        map.put("parentOrgName", form.getParentOrgName());
        map.put("superviseOrgId", form.getSuperviseOrgId());
        map.put("superviseOrgName", form.getSuperviseOrgName());
        map.put("teamMember", form.getTeamMember());
        map.put("updateTime", form.getUpdateTime() != null ? form.getUpdateTime().getTime() : null);

        map.put("layerUrl", form.getLayerUrl());
        map.put("layerName", form.getLayerName());
        map.put("objectId", form.getObjectId());
        map.put("waterLevel", form.getWaterLevel());
        map.put("layerId", form.getLayerId());
        map.put("usid", form.getUsid());
        map.put("correctType", form.getCorrectType());
        map.put("attrOne", form.getAttrOne());
        map.put("attrTwo", form.getAttrTwo());
        map.put("attrThree", form.getAttrThree());
        map.put("attrFour", form.getAttrFour());
        map.put("attrFive", form.getAttrFive());
        map.put("addrLatest", form.getAddrLatest());
        map.put("coox", form.getCoox());
        map.put("cooy", form.getCooy());
        map.put("isAddFeature", form.getIsAddFeature());
        map.put("checkState", form.getCheckState());
        map.put("checkPersonId", form.getCheckPersonId());
        map.put("checkPerson", form.getCheckPerson());
        map.put("checkTime", form.getCheckTime());
        map.put("checkDesription", form.getCheckDesription());
        map.put("reportType", form.getReportType());
        map.put("userX", form.getUserx());
        map.put("userY", form.getUsery());
        map.put("userAddr", form.getUserAddr());
        map.put("originAddr", form.getOriginAddr());
        map.put("originRoad", form.getOriginRoad());
        //map.put("originX", form.getOrginx());
        //map.put("originY", form.getOrginy());
        map.put("originX", form.getOriginx());
        map.put("originY", form.getOriginy());
        map.put("originAttrOne", form.getOriginAttrOne());
        map.put("originAttrTwo", form.getOriginAttrTwo());
        map.put("originAttrThree", form.getOriginAttrThree());
        map.put("originAttrFour", form.getOriginAttrFour());
        map.put("originAttrFive", form.getOriginAttrFive());
        map.put("personUserId", form.getPersonUserId());
        map.put("pcode", form.getPcode());
        map.put("childCode", form.getChildCode());
        map.put("cityVillage", form.getCityVillage());

        return map;
    }
}