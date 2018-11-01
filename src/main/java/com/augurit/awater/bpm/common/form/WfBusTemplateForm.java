package com.augurit.awater.bpm.common.form;

import com.augurit.awater.bpm.common.entity.WfBusTemplate;

import java.io.Serializable;
import java.util.Date;

public class WfBusTemplateForm implements Serializable {
    private static final long serialVersionUID = -4511355047498619038L;
    private Long id;
    private String templateCode;
    private String templateName;
    private String masterEntity;
    private String slaveEntities;
    private String wfDefKey;
    private Integer wfDefVersion;
    private String isActive;
    private String creator;
    private Date createTime;
    private String updator;
    private Date updateTime;
    private String memo;
    private Long templateTypeId;
    private Integer sortNo;
    private String templateTypeName;
    private String templateShortName;

    public WfBusTemplateForm() {
    }

    public WfBusTemplateForm(WfBusTemplate template, String templateTypeName) {
        this.id = template.getId();
        this.templateCode = template.getTemplateCode();
        this.templateName = template.getTemplateName();
        this.masterEntity = template.getMasterEntity();
        this.slaveEntities = template.getSlaveEntities();
        this.wfDefKey = template.getWfDefKey();
        this.wfDefVersion = template.getWfDefVersion();
        this.isActive = template.getIsActive();
        this.creator = template.getCreator();
        this.createTime = template.getCreateTime();
        this.updator = template.getUpdator();
        this.updateTime = template.getUpdateTime();
        this.memo = template.getMemo();
        this.templateTypeId = template.getTemplateTypeId();
        this.sortNo = template.getSortNo();
        this.templateShortName = template.getTemplateName();
        this.templateTypeName = templateTypeName;
    }

    public String getTemplateTypeName() {
        return this.templateTypeName;
    }

    public void setTemplateTypeName(String templateTypeName) {
        this.templateTypeName = templateTypeName;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTemplateCode() {
        return this.templateCode;
    }

    public void setTemplateCode(String templateCode) {
        this.templateCode = templateCode;
    }

    public String getTemplateName() {
        return this.templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public String getWfDefKey() {
        return this.wfDefKey;
    }

    public void setWfDefKey(String wfDefKey) {
        this.wfDefKey = wfDefKey;
    }

    public Integer getWfDefVersion() {
        return this.wfDefVersion;
    }

    public void setWfDefVersion(Integer wfDefVersion) {
        this.wfDefVersion = wfDefVersion;
    }

    public String getIsActive() {
        return this.isActive;
    }

    public void setIsActive(String isActive) {
        this.isActive = isActive;
    }

    public String getCreator() {
        return this.creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public Date getCreateTime() {
        return this.createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getUpdator() {
        return this.updator;
    }

    public void setUpdator(String updator) {
        this.updator = updator;
    }

    public Date getUpdateTime() {
        return this.updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public String getMemo() {
        return this.memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public String getMasterEntity() {
        return this.masterEntity;
    }

    public void setMasterEntity(String masterEntity) {
        this.masterEntity = masterEntity;
    }

    public String getSlaveEntities() {
        return this.slaveEntities;
    }

    public void setSlaveEntities(String slaveEntities) {
        this.slaveEntities = slaveEntities;
    }

    public Long getTemplateTypeId() {
        return this.templateTypeId;
    }

    public void setTemplateTypeId(Long templateTypeId) {
        this.templateTypeId = templateTypeId;
    }

    public String getTemplateShortName() {
        return this.templateShortName;
    }

    public void setTemplateShortName(String templateShortName) {
        this.templateShortName = templateShortName;
    }

    public Integer getSortNo() {
        return this.sortNo;
    }

    public void setSortNo(Integer sortNo) {
        this.sortNo = sortNo;
    }
}
