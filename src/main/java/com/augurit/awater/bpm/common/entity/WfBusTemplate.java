package com.augurit.awater.bpm.common.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(
    name = "DRI_WF_BUS_TEMPLATE"
)
@Cache(
    usage = CacheConcurrencyStrategy.READ_WRITE
)
public class WfBusTemplate implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @Column(
        name = "ID"
    )
    @SequenceGenerator(
        name = "SEQ_DRI_WF_BUS_TEMPLATE",
        sequenceName = "SEQ_WF_BUS_TEMPLATE",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "SEQ_DRI_WF_BUS_TEMPLATE"
    )
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

    public WfBusTemplate() {
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

    public Integer getSortNo() {
        return this.sortNo;
    }

    public void setSortNo(Integer sortNo) {
        this.sortNo = sortNo;
    }
}
