package com.augurit.awater.bpm.problem.web.form;

import com.augurit.agcloud.bpm.front.domain.IdEntity;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;


public class CcProblemForm extends IdEntity {
	// 属性
	private Long id;
	private String code; //工单编号
	private Date uploadtime; //上报时间
	private String uploaduser; //上报人
	private String emergencydreege; //紧急程度
	private String problemtype; //问题类型
	private String problemsource; //问题来源
	private String facilitytype; //设施类型
	private String damagetype; //破损部位
	private String diseasetype; //病害类型
	private String handlestate; //工单状态
	private Double mnum; //预计工程量
	private String munit; //预计工程量单位
	private String isrepeat; //是否重复上报
	private Long unitid; //道桥ID
	private String unitname; //道桥单元名称
	private Long unitpartid; //路段ID
	private String unitpartname; //路段单元名称
	private Double factmnum; //实际工程量
	private String factmunit; //实际工程量单位
	private String proitemname; //事项名称
	private Long state; //状态
	private Long istocoordinator; //是否到总协调人
	private String location; //位置
	private String description; //问题描述
	private String remarks; //备注
	private String x; //X坐标
	private String y; //Y坐标


	public Map<String, String> getPropDefInfo() {
		Map<String, String> map = new HashMap();
			map.put("id", "主键ID");
			map.put("code", "工单编号");
			map.put("uploadtime", "上报时间");
			map.put("uploaduser", "上报人");
			map.put("emergencydreege", "紧急程度");
			map.put("problemtype", "问题类型");
			map.put("problemsource", "问题来源");
			map.put("facilitytype", "设施类型");
			map.put("damagetype", "破损部位");
			map.put("diseasetype", "病害类型");
			map.put("handlestate", "工单状态");
			map.put("mnum", "预计工程量");
			map.put("munit", "预计工程量单位");
			map.put("isrepeat", "是否重复上报");
			map.put("unitid", "道桥ID");
			map.put("unitname", "道桥单元名称");
			map.put("unitpartid", "路段ID");
			map.put("unitpartname", "路段单元名称");
			map.put("uploadusername", "上报人");
			map.put("factmnum", "实际工程量");
			map.put("factmunit", "实际工程量单位");
			map.put("proitemname", "事项名称");
			map.put("state", "状态");
			map.put("istocoordinator", "是否到总协调人");
			map.put("location", "位置");
			map.put("description", "问题描述");
			map.put("remarks", "备注");
			map.put("x", "X坐标");
			map.put("y", "Y坐标");
		return map;
	}

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Date getUploadtime() {
		return uploadtime;
	}

	public void setUploadtime(Date uploadtime) {
		this.uploadtime = uploadtime;
	}

	public String getUploaduser() {
		return uploaduser;
	}

	public void setUploaduser(String uploaduser) {
		this.uploaduser = uploaduser;
	}

	public String getEmergencydreege() {
		return emergencydreege;
	}

	public void setEmergencydreege(String emergencydreege) {
		this.emergencydreege = emergencydreege;
	}

	public String getProblemtype() {
		return problemtype;
	}

	public void setProblemtype(String problemtype) {
		this.problemtype = problemtype;
	}

	public String getProblemsource() {
		return problemsource;
	}

	public void setProblemsource(String problemsource) {
		this.problemsource = problemsource;
	}

	public String getFacilitytype() {
		return facilitytype;
	}

	public void setFacilitytype(String facilitytype) {
		this.facilitytype = facilitytype;
	}

	public String getDamagetype() {
		return damagetype;
	}

	public void setDamagetype(String damagetype) {
		this.damagetype = damagetype;
	}

	public String getDiseasetype() {
		return diseasetype;
	}

	public void setDiseasetype(String diseasetype) {
		this.diseasetype = diseasetype;
	}

	public String getHandlestate() {
		return handlestate;
	}

	public void setHandlestate(String handlestate) {
		this.handlestate = handlestate;
	}

	public Double getMnum() {
		return mnum;
	}

	public void setMnum(Double mnum) {
		this.mnum = mnum;
	}

	public String getMunit() {
		return munit;
	}

	public void setMunit(String munit) {
		this.munit = munit;
	}

	public String getIsrepeat() {
		return isrepeat;
	}

	public void setIsrepeat(String isrepeat) {
		this.isrepeat = isrepeat;
	}

	public Long getUnitid() {
		return unitid;
	}

	public void setUnitid(Long unitid) {
		this.unitid = unitid;
	}

	public String getUnitname() {
		return unitname;
	}

	public void setUnitname(String unitname) {
		this.unitname = unitname;
	}

	public Long getUnitpartid() {
		return unitpartid;
	}

	public void setUnitpartid(Long unitpartid) {
		this.unitpartid = unitpartid;
	}

	public String getUnitpartname() {
		return unitpartname;
	}

	public void setUnitpartname(String unitpartname) {
		this.unitpartname = unitpartname;
	}

	public Double getFactmnum() {
		return factmnum;
	}

	public void setFactmnum(Double factmnum) {
		this.factmnum = factmnum;
	}

	public String getFactmunit() {
		return factmunit;
	}

	public void setFactmunit(String factmunit) {
		this.factmunit = factmunit;
	}

	public String getProitemname() {
		return proitemname;
	}

	public void setProitemname(String proitemname) {
		this.proitemname = proitemname;
	}

	public Long getState() {
		return state;
	}

	public void setState(Long state) {
		this.state = state;
	}

	public Long getIstocoordinator() {
		return istocoordinator;
	}

	public void setIstocoordinator(Long istocoordinator) {
		this.istocoordinator = istocoordinator;
	}

	public String getLocation() {
		return this.location;
	}

	public void setLocation(String location) {
		this.location = location;
	}
	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	public String getRemarks() {
		return this.remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	public String getX() {
		return this.x;
	}

	public void setX(String x) {
		this.x = x;
	}
	public String getY() {
		return this.y;
	}

	public void setY(String y) {
		this.y = y;
	}

	@Override
	public String getBusId() {
		return id.toString();
	}


	@Override
	
	public boolean isSupportSummary() {
		return true;
	}
}
