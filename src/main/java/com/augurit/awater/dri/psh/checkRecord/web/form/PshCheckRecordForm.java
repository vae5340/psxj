package com.augurit.awater.dri.psh.checkRecord.web.form;

import java.util.Date;

public class PshCheckRecordForm {
	// 属性
	private Long id;
	private String checkPersonCode;
	private String checkPerson;
	private String checkState;
	private Date checkTime;
	private String checkDesription;
	private String orgId;
	private String orgName;
	private Long reportId;
	private String reportEntity;
	private String checkPersonPhone;
	
	public String getCheckPersonPhone() {
		return checkPersonPhone;
	}

	public void setCheckPersonPhone(String checkPersonPhone) {
		this.checkPersonPhone = checkPersonPhone;
	}

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	public String getCheckPersonCode() {
		return this.checkPersonCode;
	}

	public void setCheckPersonCode(String checkPersonCode) {
		this.checkPersonCode = checkPersonCode;
	}
	public String getCheckPerson() {
		return this.checkPerson;
	}

	public void setCheckPerson(String checkPerson) {
		this.checkPerson = checkPerson;
	}
	public String getCheckState() {
		return this.checkState;
	}

	public void setCheckState(String checkState) {
		this.checkState = checkState;
	}
	public Date getCheckTime() {
		return this.checkTime;
	}

	public void setCheckTime(Date checkTime) {
		this.checkTime = checkTime;
	}
	public String getCheckDesription() {
		return this.checkDesription;
	}

	public void setCheckDesription(String checkDesription) {
		this.checkDesription = checkDesription;
	}
	public String getOrgId() {
		return this.orgId;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}
	public String getOrgName() {
		return this.orgName;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}
	public Long getReportId() {
		return this.reportId;
	}

	public void setReportId(Long reportId) {
		this.reportId = reportId;
	}
	public String getReportEntity() {
		return this.reportEntity;
	}

	public void setReportEntity(String reportEntity) {
		this.reportEntity = reportEntity;
	}
}