package com.augurit.awater.bpm.xcyhLayout.entity;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

@Entity
@Table(name = "DRI_WF_TEMPLATE_VIEW")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class WfTemplateView implements java.io.Serializable {
	
	// 属性
	@Id
	@Column(name = "ID")
	@SequenceGenerator(name="SEQ_WF_TEMPLATE_VIEW", allocationSize=1)
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="SEQ_WF_TEMPLATE_VIEW")
	private Long id;

	private Long templateid;
	
	private String viewname;
	
	private String viewdisplayname;
	
	private String viewtype;
	
	private String filterconditionssql;
	
	private Long displayorder;
	
	private String remark;


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
}