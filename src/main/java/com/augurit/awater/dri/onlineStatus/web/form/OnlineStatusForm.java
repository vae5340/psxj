package com.augurit.awater.dri.onlineStatus.web.form;

import java.util.Date;

public class OnlineStatusForm {
	// 属性
	private Long id;
	private String userId;
	private String status;
	private String os;
	private Date time;

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	public String getUserId() {
		return this.userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getStatus() {
		return this.status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	public String getOs() {
		return this.os;
	}

	public void setOs(String os) {
		this.os = os;
	}
	public Date getTime() {
		return this.time;
	}

	public void setTime(Date time) {
		this.time = time;
	}
}