package com.augurit.awater.bpm.xcyhLayout.web.form;

public class WfTemplateViewFieldRefForm {
	// 属性
	private Long id;
	private Long templateId;
	private Long viewId;
	private Long elementId;
	private Long displayOrder;
	private Long displayFlag;

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	public Long getTemplateId() {
		return this.templateId;
	}

	public void setTemplateId(Long templateId) {
		this.templateId = templateId;
	}
	public Long getViewId() {
		return this.viewId;
	}

	public void setViewId(Long viewId) {
		this.viewId = viewId;
	}
	public Long getElementId() {
		return this.elementId;
	}

	public void setElementId(Long elementId) {
		this.elementId = elementId;
	}
	public Long getDisplayOrder() {
		return this.displayOrder;
	}

	public void setDisplayOrder(Long displayOrder) {
		this.displayOrder = displayOrder;
	}

	public Long getDisplayFlag() {
		return displayFlag;
	}

	public void setDisplayFlag(Long displayFlag) {
		this.displayFlag = displayFlag;
	}
}