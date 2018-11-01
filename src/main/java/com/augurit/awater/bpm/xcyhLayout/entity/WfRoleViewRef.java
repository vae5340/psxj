package com.augurit.awater.bpm.xcyhLayout.entity;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

@Entity
@Table(name = "DRI_WF_ROLE_VIEW_REF")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class WfRoleViewRef implements java.io.Serializable {
	
	// 属性
	@Id
    @Column(name = "ID")
    @SequenceGenerator(name="SEQ_WF_ROLE_VIEW_REF", sequenceName="SEQ_WF_ROLE_VIEW_REF", allocationSize=1)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="SEQ_WF_ROLE_VIEW_REF")
	private Long id;
	
	private Long templateId;
	
	private Long viewId;
	
	private Long roleId;

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
	public Long getRoleId() {
		return this.roleId;
	}

	public void setRoleId(Long roleId) {
		this.roleId = roleId;
	}
}