package com.augurit.awater.bpm.common.entity;

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
    name = "DRI_WF_PAGE_ELEMENT"
)
@Cache(
    usage = CacheConcurrencyStrategy.READ_WRITE
)
public class WfPageElement implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @Column(
        name = "ID"
    )
    @SequenceGenerator(
        name = "SEQ_WF_PAGE_ELEMENT",
        sequenceName = "SEQ_WF_PAGE_ELEMENT",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "SEQ_WF_PAGE_ELEMENT"
    )
    private Long id;
    private String elementCode;
    private String elementName;
    private Long parentId;
    private String elementType;
    private String elementGroup;
    private String isActive;
    private String memo;
    private String isPublic;
    private String elementTip;
    private String smallImgPath;
    private String middleImgPath;
    private String bigImgPath;
    private String elementInvoke;
    private Integer elementSortNo;
    private Integer groupSortNo;
    private String elementInvokeMode;

    public WfPageElement() {
    }

    public Integer getElementSortNo() {
        return this.elementSortNo;
    }

    public void setElementSortNo(Integer elementSortNo) {
        this.elementSortNo = elementSortNo;
    }

    public Integer getGroupSortNo() {
        return this.groupSortNo;
    }

    public void setGroupSortNo(Integer groupSortNo) {
        this.groupSortNo = groupSortNo;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getElementCode() {
        return this.elementCode;
    }

    public void setElementCode(String elementCode) {
        this.elementCode = elementCode;
    }

    public String getElementName() {
        return this.elementName;
    }

    public void setElementName(String elementName) {
        this.elementName = elementName;
    }

    public Long getParentId() {
        return this.parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public String getElementType() {
        return this.elementType;
    }

    public void setElementType(String elementType) {
        this.elementType = elementType;
    }

    public String getElementGroup() {
        return this.elementGroup;
    }

    public void setElementGroup(String elementGroup) {
        this.elementGroup = elementGroup;
    }

    public String getIsActive() {
        return this.isActive;
    }

    public void setIsActive(String isActive) {
        this.isActive = isActive;
    }

    public String getMemo() {
        return this.memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public String getIsPublic() {
        return this.isPublic;
    }

    public void setIsPublic(String isPublic) {
        this.isPublic = isPublic;
    }

    public String getElementTip() {
        return this.elementTip;
    }

    public void setElementTip(String elementTip) {
        this.elementTip = elementTip;
    }

    public String getSmallImgPath() {
        return this.smallImgPath;
    }

    public void setSmallImgPath(String smallImgPath) {
        this.smallImgPath = smallImgPath;
    }

    public String getMiddleImgPath() {
        return this.middleImgPath;
    }

    public void setMiddleImgPath(String middleImgPath) {
        this.middleImgPath = middleImgPath;
    }

    public String getBigImgPath() {
        return this.bigImgPath;
    }

    public void setBigImgPath(String bigImgPath) {
        this.bigImgPath = bigImgPath;
    }

    public String getElementInvoke() {
        return this.elementInvoke;
    }

    public void setElementInvoke(String elementInvoke) {
        this.elementInvoke = elementInvoke;
    }

    public String getElementInvokeMode() {
        return this.elementInvokeMode;
    }

    public void setElementInvokeMode(String elementInvokeMode) {
        this.elementInvokeMode = elementInvokeMode;
    }
}
