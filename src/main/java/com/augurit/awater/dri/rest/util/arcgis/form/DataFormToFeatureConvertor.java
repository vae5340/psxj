package com.augurit.awater.dri.rest.util.arcgis.form;

import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.augurit.awater.dri.problem_report.correct_mark.web.form.CorrectMarkForm;
import com.augurit.awater.dri.problem_report.lack_mark.web.form.LackMarkForm;
import org.apache.commons.lang3.StringUtils;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;


public class DataFormToFeatureConvertor {
	
	//转成图层实体准备保存
	public static FeatureForm convertCorrVoToForm(CorrectMarkForm form) {
		if(form != null) {
			FeatureForm featureForm = new FeatureForm();
			featureForm.setId(form.getId());
			featureForm.setObjectid(StringUtils.isNotBlank(form.getObjectId())?
					Long.parseLong(form.getObjectId()) : null);
			featureForm.setMark_pid(form.getMarkPersonId());
			featureForm.setMark_person(form.getMarkPerson());
			featureForm.setMark_time(form.getMarkTime()!=null? form.getMarkTime().getTime() :null);
			featureForm.setUpdate_time(form.getUpdateTime()!=null? form.getUpdateTime().getTime() :null);
			featureForm.setDesription(form.getDescription());
			featureForm.setCorrect_type(form.getCorrectType());
			featureForm.setAttr_one(form.getAttrOne());
			featureForm.setAttr_two(form.getAttrTwo());
			featureForm.setAttr_three(form.getAttrThree());
			featureForm.setAttr_four(form.getAttrFour());
			featureForm.setAttr_five(form.getAttrFive());
			featureForm.setRoad(form.getRoad());
			featureForm.setAddr(form.getAddr());
			featureForm.setX(form.getX());
			featureForm.setY(form.getY());
			featureForm.setLayer_name(form.getLayerName());
			featureForm.setUs_id(form.getUsid());
			featureForm.setTeam_org_id(form.getTeamOrgId());
			featureForm.setTeam_org_name(form.getTeamOrgName());
			featureForm.setDirect_org_id(form.getDirectOrgId());
			featureForm.setDirect_org_name(form.getDirectOrgName());
			featureForm.setSupervise_org_id(form.getSuperviseOrgId());
			featureForm.setSupervise_org_name(form.getSuperviseOrgName());
			featureForm.setParent_org_id(form.getParentOrgId());
			featureForm.setParent_org_name(form.getParentOrgName());
			featureForm.setCheck_state(form.getCheckState());
			featureForm.setCheck_person(form.getCheckPerson());
			featureForm.setCheck_person_id(form.getCheckPersonId());
			featureForm.setCheck_time(form.getCheckTime()!=null? form.getCheckTime().getTime(): null);
			featureForm.setCheck_desription(form.getCheckDesription());
			
			featureForm.setMark_id(form.getId().toString());
			featureForm.setOrigin_addr(form.getOriginAddr());
			featureForm.setOrigin_road(form.getOriginRoad());
			featureForm.setOrgin_x(form.getOrginX());
			featureForm.setOrgin_y(form.getOrginY());
			featureForm.setOrigin_attr_one(form.getOriginAttrOne());
			featureForm.setOrigin_attr_two(form.getOriginAttrTwo());
			featureForm.setOrigin_attr_three(form.getOriginAttrThree());
			featureForm.setOrigin_attr_four(form.getOriginAttrFour());
			featureForm.setOrigin_attr_five(form.getOriginAttrFive());
			featureForm.setOrigin_attr_four(form.getOriginAttrFour());
			featureForm.setUser_addr(form.getUserAddr());
			featureForm.setUser_x(form.getUserX());
			featureForm.setUser_y(form.getUserY());
			//featureForm.setUser_id(form.getPersonUserId());
			
			featureForm.setPcode(form.getPcode());
			featureForm.setChild_code(form.getChildCode());
			featureForm.setCity_village(form.getCityVillage());
			
			if("confirm".equals(form.getReportType())){
				featureForm.setReport_type(form.getReportType());
			}else{
				featureForm.setReport_type("modify");
			}
			return featureForm;
		}else
			return null;
	}
	//转成图层实体准备保存
	public static FeatureForm convertLackVoToForm(LackMarkForm form) {
		if(form != null) {
			FeatureForm featureForm = new FeatureForm();
			featureForm.setId(form.getId());
			featureForm.setObjectid(StringUtils.isNotBlank(form.getObjectId())?
					Long.parseLong(form.getObjectId()) : null);
			featureForm.setMark_pid(form.getMarkPersonId());
			featureForm.setMark_person(form.getMarkPerson());
			featureForm.setMark_time(form.getMarkTime()!=null? form.getMarkTime().getTime():null);
			featureForm.setUpdate_time(form.getUpdateTime()!=null? form.getUpdateTime().getTime() :null);
			featureForm.setDesription(form.getDescription());
			featureForm.setAttr_one(form.getAttrOne());
			featureForm.setAttr_two(form.getAttrTwo());
			featureForm.setAttr_three(form.getAttrThree());
			featureForm.setAttr_four(form.getAttrFour());
			featureForm.setAttr_five(form.getAttrFive());
			featureForm.setRoad(form.getRoad());
			featureForm.setAddr(form.getAddr());
			featureForm.setX(form.getX());
			featureForm.setY(form.getY());
			featureForm.setLayer_name(form.getLayerName());
			featureForm.setUs_id(form.getUsid());
			featureForm.setTeam_org_id(form.getTeamOrgId());
			featureForm.setTeam_org_name(form.getTeamOrgName());
			featureForm.setDirect_org_id(form.getDirectOrgId());
			featureForm.setDirect_org_name(form.getDirectOrgName());
			featureForm.setSupervise_org_id(form.getSuperviseOrgId());
			featureForm.setSupervise_org_name(form.getSuperviseOrgName());
			featureForm.setParent_org_id(form.getParentOrgId());
			featureForm.setParent_org_name(form.getParentOrgName());
			featureForm.setCheck_state(form.getCheckState());
			featureForm.setCheck_person(form.getCheckPerson());
			featureForm.setCheck_person_id(form.getCheckPersonId());
			featureForm.setCheck_time(form.getCheckTime()!=null? form.getCheckTime().getTime(): null);
			featureForm.setCheck_desription(form.getCheckDesription());
			
			featureForm.setMark_id(form.getId().toString());
			featureForm.setUser_addr(form.getUserAddr());
			featureForm.setUser_x(form.getUserX());
			featureForm.setUser_y(form.getUserY());
			//featureForm.setUser_id(form.getPersonUserId());
			
			featureForm.setPcode(form.getPcode());
			featureForm.setChild_code(form.getChildCode());
			featureForm.setCity_village(form.getCityVillage());
			
			featureForm.setReport_type("add");
			return featureForm;
		}else
			return null;
	}
	//图层实体储存转换
	public static Map<String, Object> convertFeatureVoToCorrForm(FeatureForm featureForm) {
		if(featureForm != null) {
			Map<String, Object> form = new HashMap();
			form.put("objectid",featureForm.getObjectid());
			form.put("check_state",featureForm.getCheck_state());
			form.put("check_person",featureForm.getCheck_person());
			form.put("check_person_id",featureForm.getCheck_person_id());
			form.put("check_desription",featureForm.getCheck_desription());
			form.put("check_time",featureForm.getCheck_time()!=null? new Date(featureForm.getCheck_time()): null);
			return form;
		}else{
			return null;
		}
	}
	//转成图层保存json字符串
	public static String convertFeatureToJson(FeatureForm form) {
		JSONArray jsonArray = new JSONArray();
		if(form!=null){
			Map<String, Object> feature = new HashMap<String, Object>();
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("x", form.getX());
			map.put("y", form.getY());
			feature.put("attributes", form);
			feature.put("geometry", map);
			jsonArray.add(feature);
			return jsonArray.toString();
		}else{
			return null;
		}
	}
	//转成图层保存json字符串
	public static String convertFeatureMapToJson(Map<String,Object> form) {
		JSONArray jsonArray = new JSONArray();
		if(form!=null){
			Map<String, Object> feature = new HashMap<String, Object>();
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("x", form.get("x"));
			map.put("y", form.get("y"));
			feature.put("attributes", form);
			feature.put("geometry", map);
			jsonArray.add(feature);
			return jsonArray.toString();
		}else{
			return null;
		}
	}
	/*********TODO******************移动端修改功能（不能修改审核信息）**********************TODO************/
	/**
	 * 校核(返回可以修改的数据)
	 * @param correctForm
	 * @return feature
	 * */
	public static String convertFeatureToMap(CorrectMarkForm correctForm){
		FeatureForm form = convertCorrVoToForm(correctForm);
		JSONArray jsonArray = new JSONArray();
		if(form!=null){
			Map<String, Object> feature = new HashMap<String, Object>();
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("x", form.getX());
			map.put("y", form.getY());
			JSONObject jsonForm =  JSONObject.fromObject(form);
			if(jsonForm.containsKey("check_person_id"))
				jsonForm.remove("check_person_id");
			if(jsonForm.containsKey("check_person"))
				jsonForm.remove("check_person");
			if(jsonForm.containsKey("check_state"))
				jsonForm.remove("check_state");
			if(jsonForm.containsKey("check_time"))
				jsonForm.remove("check_time");
			if(jsonForm.containsKey("check_type"))
				jsonForm.remove("check_type");
			if(jsonForm.containsKey("check_desription"))
				jsonForm.remove("check_desription");
			feature.put("attributes", jsonForm);
			feature.put("geometry", map);
			jsonArray.add(feature);
			return jsonArray.toString();
		}else{
			return null;
		}
	}
	/**
	 * 新增
	 * */
	public static String convertFeatureToMap(LackMarkForm lackForm){
		FeatureForm form = convertLackVoToForm(lackForm);
		JSONArray jsonArray = new JSONArray();
		if(form!=null){
			Map<String, Object> feature = new HashMap<String, Object>();
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("x", form.getX());
			map.put("y", form.getY());
			JSONObject jsonForm =  JSONObject.fromObject(form);
			if(jsonForm.containsKey("check_person_id"))
				jsonForm.remove("check_person_id");
			if(jsonForm.containsKey("check_person"))
				jsonForm.remove("check_person");
			if(jsonForm.containsKey("check_state"))
				jsonForm.remove("check_state");
			if(jsonForm.containsKey("check_time"))
				jsonForm.remove("check_time");
			if(jsonForm.containsKey("check_type"))
				jsonForm.remove("check_type");
			if(jsonForm.containsKey("check_desription"))
				jsonForm.remove("check_desription");
			feature.put("attributes", jsonForm);
			feature.put("geometry", map);
			jsonArray.add(feature);
			return jsonArray.toString();
		}else{
			return null;
		}
	}
	//转成图层实体准备保存
		public static FeatureUpdateForm convertCorrVoToUpdateForm(CorrectMarkForm form) {
			if(form != null) {
				FeatureUpdateForm featureForm = new FeatureUpdateForm();
				featureForm.setId(form.getId());
				featureForm.setObjectid(StringUtils.isNotBlank(form.getObjectId())?
						Long.parseLong(form.getObjectId()) : null);
				featureForm.setMark_pid(form.getMarkPersonId());
				featureForm.setMark_person(form.getMarkPerson());
				featureForm.setMark_time(form.getMarkTime()!=null? form.getMarkTime().getTime() :null);
				featureForm.setUpdate_time(form.getUpdateTime()!=null? form.getUpdateTime().getTime() :null);
				featureForm.setDesription(form.getDescription());
				featureForm.setCorrect_type(form.getCorrectType());
				featureForm.setAttr_one(form.getAttrOne());
				featureForm.setAttr_two(form.getAttrTwo());
				featureForm.setAttr_three(form.getAttrThree());
				featureForm.setAttr_four(form.getAttrFour());
				featureForm.setAttr_five(form.getAttrFive());
				featureForm.setRoad(form.getRoad());
				featureForm.setAddr(form.getAddr());
				featureForm.setX(form.getX());
				featureForm.setY(form.getY());
				featureForm.setLayer_name(form.getLayerName());
				featureForm.setUs_id(form.getUsid());
				featureForm.setTeam_org_id(form.getTeamOrgId());
				featureForm.setTeam_org_name(form.getTeamOrgName());
				featureForm.setDirect_org_id(form.getDirectOrgId());
				featureForm.setDirect_org_name(form.getDirectOrgName());
				featureForm.setSupervise_org_id(form.getSuperviseOrgId());
				featureForm.setSupervise_org_name(form.getSuperviseOrgName());
				featureForm.setParent_org_id(form.getParentOrgId());
				featureForm.setParent_org_name(form.getParentOrgName());
				
				featureForm.setMark_id(form.getId());
				featureForm.setOrigin_addr(form.getOriginAddr());
				featureForm.setOrigin_road(form.getOriginRoad());
				featureForm.setOrgin_x(form.getOrginX());
				featureForm.setOrgin_y(form.getOrginY());
				featureForm.setOrigin_attr_one(form.getOriginAttrOne());
				featureForm.setOrigin_attr_two(form.getOriginAttrTwo());
				featureForm.setOrigin_attr_three(form.getOriginAttrThree());
				featureForm.setOrigin_attr_four(form.getOriginAttrFour());
				featureForm.setOrigin_attr_five(form.getOriginAttrFive());
				featureForm.setOrigin_attr_four(form.getOriginAttrFour());
				featureForm.setUser_addr(form.getUserAddr());
				featureForm.setUser_x(form.getUserX());
				featureForm.setUser_y(form.getUserY());

				featureForm.setPcode(form.getPcode());
				featureForm.setChild_code(form.getChildCode());
				featureForm.setCity_village(form.getCityVillage());
				
				if("confirm".equals(form.getReportType())){
					featureForm.setReport_type(form.getReportType());
				}else{
					featureForm.setReport_type("modify");
				}
				return featureForm;
			}else
				return null;
		}
		//转成图层实体准备保存
		public static FeatureUpdateForm convertLackVoToUpdateForm(LackMarkForm form) {
			if(form != null) {
				FeatureUpdateForm featureForm = new FeatureUpdateForm();
				featureForm.setId(form.getId());
				featureForm.setObjectid(StringUtils.isNotBlank(form.getObjectId())?
						Long.parseLong(form.getObjectId()) : null);
				featureForm.setMark_pid(form.getMarkPersonId());
				featureForm.setMark_person(form.getMarkPerson());
				featureForm.setMark_time(form.getMarkTime()!=null? form.getMarkTime().getTime():null);
				featureForm.setUpdate_time(form.getUpdateTime()!=null? form.getUpdateTime().getTime() :null);
				featureForm.setDesription(form.getDescription());
				featureForm.setAttr_one(form.getAttrOne());
				featureForm.setAttr_two(form.getAttrTwo());
				featureForm.setAttr_three(form.getAttrThree());
				featureForm.setAttr_four(form.getAttrFour());
				featureForm.setAttr_five(form.getAttrFive());
				featureForm.setRoad(form.getRoad());
				featureForm.setAddr(form.getAddr());
				featureForm.setX(form.getX());
				featureForm.setY(form.getY());
				featureForm.setLayer_name(form.getLayerName());
				featureForm.setUs_id(form.getUsid());
				featureForm.setTeam_org_id(form.getTeamOrgId());
				featureForm.setTeam_org_name(form.getTeamOrgName());
				featureForm.setDirect_org_id(form.getDirectOrgId());
				featureForm.setDirect_org_name(form.getDirectOrgName());
				featureForm.setSupervise_org_id(form.getSuperviseOrgId());
				featureForm.setSupervise_org_name(form.getSuperviseOrgName());
				featureForm.setParent_org_id(form.getParentOrgId());
				featureForm.setParent_org_name(form.getParentOrgName());
				
				featureForm.setMark_id(form.getId());
				featureForm.setUser_addr(form.getUserAddr());
				featureForm.setUser_x(form.getUserX());
				featureForm.setUser_y(form.getUserY());
				featureForm.setReport_type("add");
				
				featureForm.setPcode(form.getPcode());
				featureForm.setChild_code(form.getChildCode());
				featureForm.setCity_village(form.getCityVillage());
				
				return featureForm;
			}else
				return null;
		}
		//转成图层保存json字符串
		public static String convertUpdateFeatureToJson(FeatureUpdateForm form) {
			JSONArray jsonArray = new JSONArray();
			if(form!=null){
				Map<String, Object> feature = new HashMap<String, Object>();
				Map<String, Object> map = new HashMap<String, Object>();
				map.put("x", form.getX());
				map.put("y", form.getY());
				feature.put("attributes", form);
				feature.put("geometry", map);
				jsonArray.add(feature);
				return jsonArray.toString();
			}else{
				return null;
			}
		}
	
	
	
	
	
	/**
	 * 存到arcgis服务时间戳是UTC+0的，转为UTC+8(北京时间)
	 * @params time 本地时间戳(arcgis服务上显示为零时区时间)
	 * @return UTC+8时区 (arcgis服务上显示为北京时间)
	 * */
	public static Long UnicVoUtc(Long time){
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(time);
		int zoneOffset = cal.get(Calendar.ZONE_OFFSET);
		int dstOffset =  cal.get(Calendar.DST_OFFSET);
		cal.add(Calendar.MILLISECOND, +(zoneOffset + dstOffset));
		return cal.getTimeInMillis();
	}

	/**
	 * 实体类
	 * @param bean
	 * @return Map
	 * */
	public static Map<String,Object> convertBeanToMap(Object bean) throws IntrospectionException, InvocationTargetException, IllegalAccessException {
		Class type = bean.getClass();
		Map<String, Object> map = new HashMap<>();
		BeanInfo beanInfo = Introspector.getBeanInfo(type);
		PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();
		for (PropertyDescriptor pro : propertyDescriptors) {
			String propertyName = pro.getName();
			if (!"class".equals(propertyName)) {
				Method method = pro.getReadMethod();
				Object result = method.invoke(bean, new Object[0]);
				if (result != null) {
					map.put(propertyName, result);
				} else {
					map.put(propertyName, null);
				}
			}
		}
		return map;
	}
}
