package com.augurit.awater.bpm.file.entity;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(
    name = "DRI_SYS_FILE_LINK"
)
@Cache(
    usage = CacheConcurrencyStrategy.READ_WRITE
)
public class SysFileLink implements Serializable {
    private static final long serialVersionUID = 1L;
    private Long id;
    private String entity;
    private String entityId;
    private Long sysFileId;
    private String memo;

    public SysFileLink() {
    }

    @Id
    @SequenceGenerator(
        name = "SEQ_SYS_FILE_LINK",
        sequenceName = "SEQ_SYS_FILE_LINK",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "SEQ_SYS_FILE_LINK"
    )
    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEntity() {
        return this.entity;
    }

    public void setEntity(String entity) {
        this.entity = entity;
    }

    public String getEntityId() {
        return this.entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public Long getSysFileId() {
        return this.sysFileId;
    }

    public void setSysFileId(Long sysFileId) {
        this.sysFileId = sysFileId;
    }

    public String getMemo() {
        return this.memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
}
