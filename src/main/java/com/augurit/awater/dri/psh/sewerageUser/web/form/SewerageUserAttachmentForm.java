package com.augurit.awater.dri.psh.sewerageUser.web.form;

import java.util.Date;

public class SewerageUserAttachmentForm {
	// 属性
	private Long id;
	private String sewerageUserId;
	private String attName;
	private String attType;
	private Date attTime;
	private String mime;
	private String attPath;
	private String thumPath;
	
	private Long fileSize;

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	public String getSewerageUserId() {
		return this.sewerageUserId;
	}

	public void setSewerageUserId(String sewerageUserId) {
		this.sewerageUserId = sewerageUserId;
	}
	public String getAttName() {
		return this.attName;
	}

	public void setAttName(String attName) {
		this.attName = attName;
	}
	public String getAttType() {
		return this.attType;
	}

	public void setAttType(String attType) {
		this.attType = attType;
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
		return this.thumPath;
	}

	public void setThumPath(String thumPath) {
		this.thumPath = thumPath;
	}

	public Long getFileSize() {
		return fileSize;
	}

	public void setFileSize(Long fileSize) {
		this.fileSize = fileSize;
	}
}