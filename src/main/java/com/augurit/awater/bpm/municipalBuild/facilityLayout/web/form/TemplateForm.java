package com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form;

public class TemplateForm {
	// 属性
	private Long templateid;
	private String templatename;
	private String displayname;
	private Long isinused;
	private Long displayorder;
	private String remark;
	private Long id;

	public Long getTemplateid() {
		return this.templateid;
	}

	public void setTemplateid(Long templateid) {
		this.templateid = templateid;
	}
	public String getTemplatename() {
		return this.templatename;
	}

	public void setTemplatename(String templatename) {
		this.templatename = templatename;
	}
	public String getDisplayname() {
		return this.displayname;
	}

	public void setDisplayname(String displayname) {
		this.displayname = displayname;
	}
	public Long getIsinused() {
		return this.isinused;
	}

	public void setIsinused(Long isinused) {
		this.isinused = isinused;
	}
	public Long getDisplayorder() {
		return this.displayorder;
	}

	public void setDisplayorder(Long displayorder) {
		this.displayorder = displayorder;
	}
	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}
	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
}