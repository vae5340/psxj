package com.augurit.awater.dri.psh.sewerageUser.web.form;

import java.util.Date;

public class SewerageUserForm {
	// 属性
	private Long id;
	private String administrative;
	private String entryName;
	private String licenseKey;
	private String type;
	private String state;
	private Date createTime;

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	public String getAdministrative() {
		return this.administrative;
	}

	public void setAdministrative(String administrative) {
		this.administrative = administrative;
	}
	public String getEntryName() {
		return this.entryName;
	}

	public void setEntryName(String entryName) {
		this.entryName = entryName;
	}
	public String getLicenseKey() {
		return this.licenseKey;
	}

	public void setLicenseKey(String licenseKey) {
		this.licenseKey = licenseKey;
	}
	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}
	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}
	public Date getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
}