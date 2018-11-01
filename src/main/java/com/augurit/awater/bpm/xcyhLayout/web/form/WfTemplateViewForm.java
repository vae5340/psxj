package com.augurit.awater.bpm.xcyhLayout.web.form;

import com.augurit.awater.bpm.common.entity.WfPageElement;

import java.util.List;

public class WfTemplateViewForm {
	// 属性
	private Long templateid;
	private String viewname;
	private String viewdisplayname;
	private String viewtype;
	private String filterconditionssql;
	private Long displayorder;
	private String remark;
	private Long id;

	private List<WfPageElement> wfMenu;

	public Long getTemplateid() {
		return this.templateid;
	}

	public void setTemplateid(Long templateid) {
		this.templateid = templateid;
	}
	public String getViewname() {
		return this.viewname;
	}

	public void setViewname(String viewname) {
		this.viewname = viewname;
	}
	public String getViewdisplayname() {
		return this.viewdisplayname;
	}

	public void setViewdisplayname(String viewdisplayname) {
		this.viewdisplayname = viewdisplayname;
	}
	public String getViewtype() {
		return this.viewtype;
	}

	public void setViewtype(String viewtype) {
		this.viewtype = viewtype;
	}
	public String getFilterconditionssql() {
		return this.filterconditionssql;
	}

	public void setFilterconditionssql(String filterconditionssql) {
		this.filterconditionssql = filterconditionssql;
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

	public List<WfPageElement> getWfMenu() {
		return wfMenu;
	}

	public void setWfMenu(List<WfPageElement> wfMenu) {
		this.wfMenu = wfMenu;
	}
}