package com.augurit.awater.dri.patrolTrack.convert;

import com.augurit.awater.dri.patrolTrack.entity.TrackPoint;
import com.augurit.awater.dri.patrolTrack.web.form.TrackPointForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TrackPointConvertor {
	public static TrackPointForm convertVoToForm(TrackPoint entity) {
		if(entity != null) {
			TrackPointForm form = new TrackPointForm();
			form.setId(entity.getId());
			form.setX(entity.getX());
			form.setY(entity.getY());
			form.setMarkPersonId(entity.getMarkPersonId());
			form.setMarkPerson(entity.getMarkPerson());
			form.setLoginName(entity.getLoginName());
			form.setMarkTime(entity.getMarkTime());
			form.setTeamOrgId(entity.getTeamOrgId());
			form.setTeamOrgName(entity.getTeamOrgName());
			form.setDirectOrgId(entity.getDirectOrgId());
			form.setDirectOrgName(entity.getDirectOrgName());
			form.setParentOrgId(entity.getParentOrgId());
			form.setParentOrgName(entity.getParentOrgName());
			form.setSuperviseOrgId(entity.getSuperviseOrgId());
			form.setSuperviseOrgName(entity.getSuperviseOrgName());
			form.setState(entity.getState());
			form.setTrackId(entity.getTrackId());
			form.setTrackName(entity.getTrackName());
			form.setRecordLength(entity.getRecordLength());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(TrackPointForm form, TrackPoint entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			entity.setX(form.getX());
			entity.setY(form.getY());
			if(form.getMarkPersonId() != null && form.getMarkPersonId().trim().length() > 0)
				entity.setMarkPersonId(form.getMarkPersonId().trim());
			if(form.getMarkPerson() != null && form.getMarkPerson().trim().length() > 0)
				entity.setMarkPerson(form.getMarkPerson().trim());
			if(form.getLoginName() != null && form.getLoginName().trim().length() > 0)
				entity.setLoginName(form.getLoginName().trim());
			entity.setMarkTime(form.getMarkTime());
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
			if(form.getSuperviseOrgId() != null && form.getSuperviseOrgId().trim().length() > 0)
				entity.setSuperviseOrgId(form.getSuperviseOrgId().trim());
			if(form.getSuperviseOrgName() != null && form.getSuperviseOrgName().trim().length() > 0)
				entity.setSuperviseOrgName(form.getSuperviseOrgName().trim());
			if(form.getState() != null && form.getState().trim().length() > 0)
				entity.setState(form.getState().trim());
			if(form.getTrackId() != null && form.getTrackId().trim().length() > 0)
				entity.setTrackId(form.getTrackId().trim());
			if(form.getTrackName() != null && form.getTrackName().trim().length() > 0)
				entity.setTrackName(form.getTrackName().trim());
			if(form.getRecordLength() != null && form.getRecordLength().trim().length() > 0)
				entity.setRecordLength(form.getRecordLength().trim());
		}
	}
	
	public static List<TrackPointForm> convertVoListToFormList(List<TrackPoint> trackPointList) {
		if(trackPointList != null && trackPointList.size() > 0) {
			List<TrackPointForm> trackPointFormList = new ArrayList();
			for(int i=0; i<trackPointList.size(); i++) {
				trackPointFormList.add(convertVoToForm(trackPointList.get(i)));
			}
			return trackPointFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<TrackPoint> trackPointList) {
		if(trackPointList != null && trackPointList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<trackPointList.size(); i++) {
				TrackPoint entity = trackPointList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("x", entity.getX() == null ? "" : entity.getX().toString());
				map.put("y", entity.getY() == null ? "" : entity.getY().toString());
				map.put("markPersonId", entity.getMarkPersonId());
				map.put("markPerson", entity.getMarkPerson());
				map.put("loginName", entity.getLoginName());
				map.put("markTime", entity.getMarkTime());
				map.put("teamOrgId", entity.getTeamOrgId());
				map.put("teamOrgName", entity.getTeamOrgName());
				map.put("directOrgId", entity.getDirectOrgId());
				map.put("directOrgName", entity.getDirectOrgName());
				map.put("parentOrgId", entity.getParentOrgId());
				map.put("parentOrgName", entity.getParentOrgName());
				map.put("superviseOrgId", entity.getSuperviseOrgId());
				map.put("superviseOrgName", entity.getSuperviseOrgName());
				map.put("state", entity.getState());
				map.put("trackId", entity.getTrackId());
				map.put("trackName", entity.getTrackName());
				map.put("recordLength", entity.getRecordLength());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<TrackPoint> convertFormListToVoList(List<TrackPointForm> trackPointFormList) {
		if(trackPointFormList != null && trackPointFormList.size() > 0) {
			List<TrackPoint> trackPointList = new ArrayList();
			for(int i=0; i<trackPointFormList.size(); i++) {
				TrackPoint trackPoint = new TrackPoint();
				convertFormToVo(trackPointFormList.get(i), trackPoint);
				trackPointList.add(trackPoint);
			}
			return trackPointList;
		}
		return null;
	}
}