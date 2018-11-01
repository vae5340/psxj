package com.augurit.awater.dri.problem_report.diary.web.form;

import java.util.Date;

public class DiaryAttachmentForm {
	// 属性
	private Long id;
	private String markId;
	private String attName;
	private Date attTime;
	private String mime;
	private String attPath;
	private String thumPath;

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	public String getMarkId() {
		return this.markId;
	}

	public void setMarkId(String markId) {
		this.markId = markId;
	}
	public String getAttName() {
		return this.attName;
	}

	public void setAttName(String attName) {
		this.attName = attName;
	}
	public Date getAttTime() {
		return this.attTime;
	}

	public void setAttTime(Date attTime) {
		this.attTime = attTime;
	}
	public String getMime() {
		return this.mime;
	}

	public void setMime(String mime) {
		this.mime = mime;
	}
	public String getAttPath() {
		return this.attPath;
	}

	public void setAttPath(String attPath) {
		this.attPath = attPath;
	}

	public String getThumPath() {
		return thumPath;
	}

	public void setThumPath(String thumPath) {
		this.thumPath = thumPath;
	}
	
}