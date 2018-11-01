package com.augurit.awater.dri.dailySign.web.form;

import java.util.Date;
import java.util.List;

public class DailySignForm {
	// 属性
	private Long id;
	private String signerId;
	private String signerName;
	private Date signTime;
	private Double x;
	private Double y;
	private String road;
	private String addr;
	private String orgSeq;
	private String orgName;
	private String appVersion;
	private Date createTime;
	private List<String> monthlySignDate;
	private Boolean isFirstSign;

	private String directOrgName;
	private String phone;
	private String title;

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	public String getSignerId() {
		return this.signerId;
	}

	public void setSignerId(String signerId) {
		this.signerId = signerId;
	}
	public String getSignerName() {
		return this.signerName;
	}

	public void setSignerName(String signerName) {
		this.signerName = signerName;
	}
	public Date getSignTime() {
		return this.signTime;
	}

	public void setSignTime(Date signTime) {
		this.signTime = signTime;
	}
	public Double getX() {
		return this.x;
	}

	public void setX(Double x) {
		this.x = x;
	}
	public Double getY() {
		return this.y;
	}

	public void setY(Double y) {
		this.y = y;
	}
	public String getRoad() {
		return this.road;
	}

	public void setRoad(String road) {
		this.road = road;
	}
	public String getAddr() {
		return this.addr;
	}

	public void setAddr(String addr) {
		this.addr = addr;
	}
	public String getOrgSeq() {
		return this.orgSeq;
	}

	public void setOrgSeq(String orgSeq) {
		this.orgSeq = orgSeq;
	}
	public Date getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getOrgName() {
		return orgName;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}

	public List<String> getMonthlySignDate() {
		return monthlySignDate;
	}

	public void setMonthlySignDate(List<String> monthlySignDate) {
		this.monthlySignDate = monthlySignDate;
	}

	public String getAppVersion() {
		return appVersion;
	}

	public void setAppVersion(String appVersion) {
		this.appVersion = appVersion;
	}

	public Boolean getFirstSign() {
		return isFirstSign;
	}

	public void setFirstSign(Boolean firstSign) {
		isFirstSign = firstSign;
	}

	public String getDirectOrgName() {
		return directOrgName;
	}

	public void setDirectOrgName(String directOrgName) {
		this.directOrgName = directOrgName;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
}