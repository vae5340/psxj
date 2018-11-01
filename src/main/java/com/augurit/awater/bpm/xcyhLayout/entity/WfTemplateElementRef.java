package com.augurit.awater.bpm.xcyhLayout.entity;

import java.io.Serializable;
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
    name = "WF_TEMPLATE_ELEMENT_REF"
)
@Cache(
    usage = CacheConcurrencyStrategy.READ_WRITE
)
public class WfTemplateElementRef implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @Column(
        name = "ID"
    )
    @SequenceGenerator(
        name = "SEQ_WF_TEMPLATE_ELEMENT_REF",
        sequenceName = "SEQ_WF_TEMPLATE_ELEMENT_REF",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "SEQ_WF_TEMPLATE_ELEMENT_REF"
    )
    private Long id;
    private Long templateId;
    private Long elementId;

    public WfTemplateElementRef() {
    }

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

    public Long getElementId() {
        return this.elementId;
    }

    public void setElementId(Long elementId) {
        this.elementId = elementId;
    }
}