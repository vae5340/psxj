package com.augurit.awater.dri.psh.discharge.convert;

import com.augurit.awater.dri.psh.discharge.entity.PshDischargerWell;
import com.augurit.awater.dri.psh.discharge.web.form.PshDischargerWellForm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class PshDischargerWellConvertor {
	public static PshDischargerWellForm convertVoToForm(PshDischargerWell entity) {
		if(entity != null) {
			PshDischargerWellForm form = new PshDischargerWellForm();
			form.setId(entity.getId());
			form.setDischargeId(entity.getDischargeId());
			form.setWellId(entity.getWellId());
			form.setWellType(entity.getWellType());
			form.setWellPro(entity.getWellPro());
			form.setWellDir(entity.getWellDir());
			form.setDrainPro(entity.getDrainPro());
			form.setPipeType(entity.getPipeType());
			form.setLxId(entity.getLxId());
			return form;
		}else
			return null;
	}
	
	public static void convertFormToVo(PshDischargerWellForm form, PshDischargerWell entity) {
		if(entity != null && form != null) {
			entity.setId(form.getId());
			if(form.getDischargeId() != null && form.getDischargeId().trim().length() > 0)
				entity.setDischargeId(form.getDischargeId().trim());
			if(form.getWellId() != null && form.getWellId().trim().length() > 0)
				entity.setWellId(form.getWellId().trim());
			if(form.getWellType() != null && form.getWellType().trim().length() > 0)
				entity.setWellType(form.getWellType().trim());
			if(form.getWellPro() != null && form.getWellPro().trim().length() > 0)
				entity.setWellPro(form.getWellPro().trim());
			if(form.getWellDir() != null && form.getWellDir().trim().length() > 0)
				entity.setWellDir(form.getWellDir().trim());
			if(form.getDrainPro() != null && form.getDrainPro().trim().length() > 0)
				entity.setDrainPro(form.getDrainPro().trim());
			entity.setPipeType(form.getPipeType());
			if(form.getLxId() != null && form.getLxId().trim().length() > 0)
				entity.setLxId(form.getLxId().trim());
		}
	}
	
	public static List<PshDischargerWellForm> convertVoListToFormList(List<PshDischargerWell> pshDischargerWellList) {
		if(pshDischargerWellList != null && pshDischargerWellList.size() > 0) {
			List<PshDischargerWellForm> pshDischargerWellFormList = new ArrayList();
			for(int i=0; i<pshDischargerWellList.size(); i++) {
				pshDischargerWellFormList.add(convertVoToForm(pshDischargerWellList.get(i)));
			}
			return pshDischargerWellFormList;
		}
		return null;
	}
	
	public static List<Map> convertVoListToMapList(List<PshDischargerWell> pshDischargerWellList) {
		if(pshDischargerWellList != null && pshDischargerWellList.size() > 0) {
			List<Map> mapList = new ArrayList();
			for(int i=0; i<pshDischargerWellList.size(); i++) {
				PshDischargerWell entity = pshDischargerWellList.get(i);
				Map map = new HashMap();

				map.put("id", entity.getId() == null ? "" : entity.getId().toString());
				map.put("dischargeId", entity.getDischargeId());
				map.put("wellId", entity.getWellId());
				map.put("pipeType", entity.getPipeType());
				map.put("wellType", entity.getWellType());
				map.put("wellPro", entity.getWellPro());
				map.put("wellDir", entity.getWellDir());
				map.put("drainPro", entity.getDrainPro());
				map.put("lxId", entity.getLxId());
				
				mapList.add(map);
			}
			return mapList;
		}
		return null;
	}
	
	public static List<PshDischargerWell> convertFormListToVoList(List<PshDischargerWellForm> pshDischargerWellFormList) {
		if(pshDischargerWellFormList != null && pshDischargerWellFormList.size() > 0) {
			List<PshDischargerWell> pshDischargerWellList = new ArrayList();
			for(int i=0; i<pshDischargerWellFormList.size(); i++) {
				PshDischargerWell pshDischargerWell = new PshDischargerWell();
				convertFormToVo(pshDischargerWellFormList.get(i), pshDischargerWell);
				pshDischargerWellList.add(pshDischargerWell);
			}
			return pshDischargerWellList;
		}
		return null;
	}
}