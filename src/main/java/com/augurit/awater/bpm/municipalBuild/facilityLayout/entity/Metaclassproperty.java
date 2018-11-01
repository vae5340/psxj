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
@Table(name = "DRI_METACLASSPROPERTY")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Metaclassproperty implements java.io.Serializable {
	
	// 属性
	private Long classpropertyid;
	
	private String classpropertyname;
	
	private String displayname;
	
	private Long templateclassid;

	private String fieldstatecode;

	private String classpropertydesc;

	private Long nullflag;

	private Long querypropertyflag;

	private Long listpropertyflag;

	@Id
    @Column(name = "ID")
    @SequenceGenerator(name="SEQ_METACLASSPROPERTY", allocationSize=1)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="SEQ_METACLASSPROPERTY")
	private Long id;

	public Long getClasspropertyid() {
		return this.classpropertyid;
	}

	public void setClasspropertyid(Long classpropertyid) {
		this.classpropertyid = classpropertyid;
	}
	public String getClasspropertyname() {
		return this.classpropertyname;
	}

	public void setClasspropertyname(String classpropertyname) {
		this.classpropertyname = classpropertyname;
	}
	public String getDisplayname() {
		return this.displayname;
	}

	public void setDisplayname(String displayname) {
		this.displayname = displayname;
	}
	public Long getTemplateclassid() {
		return this.templateclassid;
	}

	public void setTemplateclassid(Long templateclassid) {
		this.templateclassid = templateclassid;
	}
	public String getClasspropertydesc() {
		return this.classpropertydesc;
	}

	public void setClasspropertydesc(String classpropertydesc) {
		this.classpropertydesc = classpropertydesc;
	}
	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getNullflag() {
		return nullflag;
	}

	public void setNullflag(Long nullflag) {
		this.nullflag = nullflag;
	}

	public String getFieldstatecode() {
		return fieldstatecode;
	}

	public void setFieldstatecode(String fieldstatecode) {
		this.fieldstatecode = fieldstatecode;
	}

	public Long getQuerypropertyflag() {
		return querypropertyflag;
	}

	public void setQuerypropertyflag(Long querypropertyflag) {
		this.querypropertyflag = querypropertyflag;
	}

	public Long getListpropertyflag() {
		return listpropertyflag;
	}

	public void setListpropertyflag(Long listpropertyflag) {
		this.listpropertyflag = listpropertyflag;
	}
}