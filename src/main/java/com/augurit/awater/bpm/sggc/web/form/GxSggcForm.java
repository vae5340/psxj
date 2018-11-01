package com.augurit.awater.bpm.sggc.web.form;

import java.util.Date;

public class GxSggcForm {
	// 属性
	private Long id;
	private String lx;
	private String username;
	private Date time;
	private String content;
	private String sgjd;
	private String sjid;
	private String loginname;
	

	public String getLoginname() {
		return loginname;
	}

	public void setLoginname(String loginname) {
		this.loginname = loginname;
	}

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	public String getLx() {
		return this.lx;
	}

	public void setLx(String lx) {
		this.lx = lx;
	}
	public String getUsername() {
		return this.username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
	public Date getTime() {
		return this.time;
	}

	public void setTime(Date time) {
		this.time = time;
	}
	public String getContent() {
		return this.content;
	}

	public void setContent(String content) {
		this.content = content;
	}
	public String getSgjd() {
		return this.sgjd;
	}

	public void setSgjd(String sgjd) {
		this.sgjd = sgjd;
	}
	public String getSjid() {
		return this.sjid;
	}

	public void setSjid(String sjid) {
		this.sjid = sjid;
	}
}