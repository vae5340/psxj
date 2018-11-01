package com.augurit.awater.bpm.xcyhLayout.web.form;

/**
 * Created by Administrator on 2017-03-15.
 */
public class WfTemplateViewFieldRefShowForm {
    // ����
    private Long id;
    private Long templateId;
    private Long viewId;
    private Long elementId;
    private String elementCode;
    private String elementName;
    private Long displayOrder;
    private Long displayFlag;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTemplateId() {
        return templateId;
    }

    public void setTemplateId(Long templateId) {
        this.templateId = templateId;
    }

    public Long getViewId() {
        return viewId;
    }

    public void setViewId(Long viewId) {
        this.viewId = viewId;
    }

    public Long getElementId() {
        return elementId;
    }

    public void setElementId(Long elementId) {
        this.elementId = elementId;
    }

    public String getElementCode() {
        return elementCode;
    }

    public void setElementCode(String elementCode) {
        this.elementCode = elementCode;
    }

    public String getElementName() {
        return elementName;
    }

    public void setElementName(String elementName) {
        this.elementName = elementName;
    }

    public Long getDisplayOrder() {
        return displayOrder;
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
