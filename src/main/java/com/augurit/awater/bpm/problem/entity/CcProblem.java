package com.augurit.awater.bpm.problem.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "CCPROBLEM")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class CcProblem implements java.io.Serializable {
	
	// 属性
	@Id
    @Column(name = "ID")
    @SequenceGenerator(name="SEQ_CCPROBLEM", allocationSize=1)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="SEQ_CCPROBLEM")
	private Long id;
	
	private String code;
	
	private Date uploadtime;
	
	private String uploaduser;
	
	private String emergencydreege;
	
	private String problemtype;
	
	private String problemsource;
	
	private String facilitytype;
	
	private String damagetype;
	
	private String diseasetype;
	
	private String handlestate;
	
	private Double mnum;
	
	private String munit;
	
	private String isrepeat;
	
	private Long unitid;
	
	private String unitname;
	
	private Long unitpartid;
	
	private String unitpartname;

	private Double factmnum;
	
	private String factmunit;
	
	private String proitemname;
	
	private Long state;
	
	private Long istocoordinator;
	
	private String location;
	
	private String description;
	
	private String remarks;
	
	private String x;
	
	private String y;

	public Long getId() {
		return this.id;
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
}