package com.augurit.awater.dri.dailySign.entity;

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
@Table(name = "DRI_DAILY_SIGN")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class DailySign implements java.io.Serializable {
	
	// 属性
	@Id
    @Column(name = "ID")
    @SequenceGenerator(name="SEQ_DRI_DAILY_SIGN", sequenceName="SEQ_DRI_DAILY_SIGN", allocationSize=1)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="SEQ_DRI_DAILY_SIGN")
	private Long id;
	
	private String signerId;
	
	private String signerName;
	
	private Date signTime;
	
	private Double x;
	
	private Double y;
	
	private String road;
	
	private String addr;
	
	private String orgSeq;

	private String orgName;

	private String appVersion;
	
	private Date createTime;


	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	public String getSignerId() {
		return this.signerId;
	}

	public void setSignerId(String signerId) {
		this.signerId = signerId;
	}
	public String getSignerName() {
		return this.signerName;
	}

	public void setSignerName(String signerName) {
		this.signerName = signerName;
	}
	public Date getSignTime() {
		return this.signTime;
	}

	public void setSignTime(Date signTime) {
		this.signTime = signTime;
	}
	public Double getX() {
		return this.x;
	}

	public void setX(Double x) {
		this.x = x;
	}
	public Double getY() {
		return this.y;
	}

	public void setY(Double y) {
		this.y = y;
	}
	public String getRoad() {
		return this.road;
	}

	public void setRoad(String road) {
		this.road = road;
	}
	public String getAddr() {
		return this.addr;
	}

	public void setAddr(String addr) {
		this.addr = addr;
	}
	public String getOrgSeq() {
		return this.orgSeq;
	}

	public void setOrgSeq(String orgSeq) {
		this.orgSeq = orgSeq;
	}
	public Date getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getOrgName() {
		return orgName;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}

	public String getAppVersion() {
		return appVersion;
	}

	public void setAppVersion(String appVersion) {
		this.appVersion = appVersion;
	}
}