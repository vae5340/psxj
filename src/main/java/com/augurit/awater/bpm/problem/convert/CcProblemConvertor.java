package com.augurit.awater.bpm.problem.convert;

import com.augurit.awater.bpm.problem.entity.CcProblem;
import com.augurit.awater.bpm.problem.web.form.CcProblemForm;

import java.util.ArrayList;
import java.util.List;

public class CcProblemConvertor {
	
	//entity转换为form
	public static CcProblemForm convertVoToForm(CcProblem entity){
		CcProblemForm form = null ;
		if(entity != null){
			form = new CcProblemForm();
			form.setId(entity.getId());
			form.setCode(entity.getCode());
			form.setUploadtime(entity.getUploadtime());
			form.setUploaduser(entity.getUploaduser());
			form.setEmergencydreege(entity.getEmergencydreege());
			form.setProblemtype(entity.getProblemtype());
			form.setProblemsource(entity.getProblemsource());
			form.setFacilitytype(entity.getFacilitytype());
			form.setDamagetype(entity.getDamagetype());
			form.setDiseasetype(entity.getDiseasetype());
			form.setHandlestate(entity.getHandlestate());
			form.setMnum(entity.getMnum());
			form.setMunit(entity.getMunit());
			form.setIsrepeat(entity.getIsrepeat());
			form.setUnitid(entity.getUnitid());
			form.setUnitname(entity.getUnitname());
			form.setUnitpartid(entity.getUnitpartid());
			form.setUnitpartname(entity.getUnitpartname());
			form.setFactmnum(entity.getFactmnum());
			form.setFactmunit(entity.getFactmunit());
			form.setProitemname(entity.getProitemname());
			form.setState(entity.getState());
			form.setIstocoordinator(entity.getIstocoordinator());
			form.setLocation(entity.getLocation());
			form.setDescription(entity.getDescription());
			form.setRemarks(entity.getRemarks());
			form.setX(entity.getX());
			form.setY(entity.getY());
		}
		return form;
	}
	
	//entity列表转换为form列表
	public static List<CcProblemForm> convertVoListToFormList(List<CcProblem> entities){
		List<CcProblemForm> result = null;
		if(entities != null && entities.size() > 0){
			result = new ArrayList<CcProblemForm>();
			for(CcProblem entity:entities){
				result.add(convertVoToForm(entity));
			}
		}
		return result;
	}
	
	//form转换为vo
	public static void convertFormToVo(CcProblemForm form,CcProblem entity){
		if(form != null && entity != null){
			entity.setId(form.getId());
		if(form.getCode() != null && form.getCode().trim().length() > 0)
			entity.setCode(form.getCode().trim());
			entity.setUploadtime(form.getUploadtime());
		if(form.getUploaduser() != null && form.getUploaduser().trim().length() > 0)
			entity.setUploaduser(form.getUploaduser().trim());
		if(form.getEmergencydreege() != null && form.getEmergencydreege().trim().length() > 0)
			entity.setEmergencydreege(form.getEmergencydreege().trim());
		if(form.getProblemtype() != null && form.getProblemtype().trim().length() > 0)
			entity.setProblemtype(form.getProblemtype().trim());
		if(form.getProblemsource() != null && form.getProblemsource().trim().length() > 0)
			entity.setProblemsource(form.getProblemsource().trim());
		if(form.getFacilitytype() != null && form.getFacilitytype().trim().length() > 0)
			entity.setFacilitytype(form.getFacilitytype().trim());
		if(form.getDamagetype() != null && form.getDamagetype().trim().length() > 0)
			entity.setDamagetype(form.getDamagetype().trim());
		if(form.getDiseasetype() != null && form.getDiseasetype().trim().length() > 0)
			entity.setDiseasetype(form.getDiseasetype().trim());
		if(form.getHandlestate() != null && form.getHandlestate().trim().length() > 0)
			entity.setHandlestate(form.getHandlestate().trim());
			entity.setMnum(form.getMnum());
		if(form.getMunit() != null && form.getMunit().trim().length() > 0)
			entity.setMunit(form.getMunit().trim());
		if(form.getIsrepeat() != null && form.getIsrepeat().trim().length() > 0)
			entity.setIsrepeat(form.getIsrepeat().trim());
			entity.setUnitid(form.getUnitid());
		if(form.getUnitname() != null && form.getUnitname().trim().length() > 0)
			entity.setUnitname(form.getUnitname().trim());
			entity.setUnitpartid(form.getUnitpartid());
		if(form.getUnitpartname() != null && form.getUnitpartname().trim().length() > 0)
			entity.setUnitpartname(form.getUnitpartname().trim());
			entity.setFactmnum(form.getFactmnum());
		if(form.getFactmunit() != null && form.getFactmunit().trim().length() > 0)
			entity.setFactmunit(form.getFactmunit().trim());
		if(form.getProitemname() != null && form.getProitemname().trim().length() > 0)
			entity.setProitemname(form.getProitemname().trim());
			entity.setState(form.getState());
			entity.setIstocoordinator(form.getIstocoordinator());
		if(form.getLocation() != null && form.getLocation().trim().length() > 0)
			entity.setLocation(form.getLocation().trim());
		if(form.getDescription() != null && form.getDescription().trim().length() > 0)
			entity.setDescription(form.getDescription().trim());
		if(form.getRemarks() != null && form.getRemarks().trim().length() > 0)
			entity.setRemarks(form.getRemarks().trim());
		if(form.getX() != null && form.getX().trim().length() > 0)
			entity.setX(form.getX().trim());
		if(form.getY() != null && form.getY().trim().length() > 0)
			entity.setY(form.getY().trim());
		}
	}
	
	//form列表转换为entity列表
	public static List<CcProblem> convertFormListToVoList(List<CcProblemForm> forms){
		List<CcProblem> result = null;
		if(forms != null && forms.size() > 0){
			result = new ArrayList<CcProblem>();
			for(CcProblemForm form:forms){
				CcProblem entity = new CcProblem();
				convertFormToVo(form,entity);
				result.add(entity);
			}
		}
		return result;
	}
}