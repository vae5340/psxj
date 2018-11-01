package com.augurit.awater.dri.psh.sewerageUser.entity;

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
@Table(name = "DRI_SEWERAGE_USER_ATTACHMENT")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class SewerageUserAttachment implements java.io.Serializable {
	
	// 属性
	@Id
    @Column(name = "ID")
    @SequenceGenerator(name="SEQ_DRI_SEWERAGE_USER", sequenceName="SEQ_DRI_SEWERAGE_USER", allocationSize=1)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="SEQ_DRI_SEWERAGE_USER")
	private Long id;
	
	private String sewerageUserId;
	
	private String attName;
	
	private String attType;
	
	private Date attTime;
	
	private String mime;
	
	private String attPath;
	
	private String thumPath;

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	public String getSewerageUserId() {
		return this.sewerageUserId;
	}

	public void setSewerageUserId(String sewerageUserId) {
		this.sewerageUserId = sewerageUserId;
	}
	public String getAttName() {
		return this.attName;
	}

	public void setAttName(String attName) {
		this.attName = attName;
	}
	public String getAttType() {
		return this.attType;
	}

	public void setAttType(String attType) {
		this.attType = attType;
	}
	public Date getAttTime() {
		return this.attTime;
	}

	public void setAttTime(Date attTime) {
		this.attTime = attTime;
	}
	public String getMime() {
		return this.mime;
	}

	public void setMime(String mime) {
		this.mime = mime;
	}
	public String getAttPath() {
		return this.attPath;
	}

	public void setAttPath(String attPath) {
		this.attPath = attPath;
	}
	public String getThumPath() {
		return this.thumPath;
	}

	public void setThumPath(String thumPath) {
		this.thumPath = thumPath;
	}
}