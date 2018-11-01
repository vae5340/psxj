package com.augurit.awater.bpm.municipalBuild.facilityLayout.entity;

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
@Table(name = "DRI_METATEMPLATECLASS")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Metatemplateclass implements java.io.Serializable {
	
	// 属性
	private Long templateclassid;
	
	private String templateclassname;
	
	private String displayname;
	
	private String templateclassdesc;
	
	private Long metadatacategoryid;
	@Id
    @Column(name = "ID")
    @SequenceGenerator(name="SEQ_METATEMPLATECLASS", allocationSize=1)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="SEQ_METATEMPLATECLASS")
	private Long id;

	public Long getTemplateclassid() {
		return this.templateclassid;
	}

	public void setTemplateclassid(Long templateclassid) {
		this.templateclassid = templateclassid;
	}
	public String getTemplateclassname() {
		return this.templateclassname;
	}

	public void setTemplateclassname(String templateclassname) {
		this.templateclassname = templateclassname;
	}
	public String getDisplayname() {
		return this.displayname;
	}

	public void setDisplayname(String displayname) {
		this.displayname = displayname;
	}
	public String getTemplateclassdesc() {
		return this.templateclassdesc;
	}

	public void setTemplateclassdesc(String templateclassdesc) {
		this.templateclassdesc = templateclassdesc;
	}
	public Long getMetadatacategoryid() {
		return this.metadatacategoryid;
	}

	public void setMetadatacategoryid(Long metadatacategoryid) {
		this.metadatacategoryid = metadatacategoryid;
	}
	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
}