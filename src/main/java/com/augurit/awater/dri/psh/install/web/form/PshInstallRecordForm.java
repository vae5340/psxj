package com.augurit.awater.dri.psh.install.web.form;

import java.util.Date;

public class PshInstallRecordForm {
	// 属性
	private Long id;
	private String loginName;
	private String userName;
	private Date installTime;
	private String deviceCode;
	private String teamOrgId;
	private String teamOrgName;
	private String directOrgId;
	private String directOrgName;
	private String superviseOrgId;
	private String superviseOrgName;
	private String parentOrgId;
	private String parentOrgName;
	
	
	private String phone;
	private String job;

	private int per_page;
	private int page_num;
	private int total;//总记录数（人）
	private int total_page;//总页数
	private int cur_page;//当前页码
	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	public String getLoginName() {
		return this.loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}
	public String getUserName() {
		return this.userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}
	public Date getInstallTime() {
		return this.installTime;
	}

	public void setInstallTime(Date installTime) {
		this.installTime = installTime;
	}
	public String getDeviceCode() {
		return this.deviceCode;
	}

	public void setDeviceCode(String deviceCode) {
		this.deviceCode = deviceCode;
	}
	public String getTeamOrgId() {
		return this.teamOrgId;
	}

	public void setTeamOrgId(String teamOrgId) {
		this.teamOrgId = teamOrgId;
	}
	public String getTeamOrgName() {
		return this.teamOrgName;
	}

	public void setTeamOrgName(String teamOrgName) {
		this.teamOrgName = teamOrgName;
	}
	public String getDirectOrgId() {
		return this.directOrgId;
	}

	public void setDirectOrgId(String directOrgId) {
		this.directOrgId = directOrgId;
	}
	public String getDirectOrgName() {
		return this.directOrgName;
	}

	public void setDirectOrgName(String directOrgName) {
		this.directOrgName = directOrgName;
	}
	public String getSuperviseOrgId() {
		return this.superviseOrgId;
	}

	public void setSuperviseOrgId(String superviseOrgId) {
		this.superviseOrgId = superviseOrgId;
	}
	public String getSuperviseOrgName() {
		return this.superviseOrgName;
	}

	public void setSuperviseOrgName(String superviseOrgName) {
		this.superviseOrgName = superviseOrgName;
	}
	public String getParentOrgId() {
		return this.parentOrgId;
	}

	public void setParentOrgId(String parentOrgId) {
		this.parentOrgId = parentOrgId;
	}
	public String getParentOrgName() {
		return this.parentOrgName;
	}

	public void setParentOrgName(String parentOrgName) {
		this.parentOrgName = parentOrgName;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getJob() {
		return job;
	}

	public void setJob(String job) {
		this.job = job;
	}

	public int getPer_page() {
		return per_page;
	}

	public void setPer_page(int per_page) {
		this.per_page = per_page;
	}

	public int getPage_num() {
		return page_num;
	}

	public void setPage_num(int page_num) {
		this.page_num = page_num;
	}

	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
	}

	public int getTotal_page() {
		return total_page;
	}

	public void setTotal_page(int total_page) {
		this.total_page = total_page;
	}

	public int getCur_page() {
		return cur_page;
	}

	public void setCur_page(int cur_page) {
		this.cur_page = cur_page;
	}
	
	
}