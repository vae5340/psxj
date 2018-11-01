package com.augurit.awater.dri.column.entity;

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
@Table(name = "DRI_COLUMNS_UNREAD")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ColumnsUnread implements java.io.Serializable {
	
	// 属性
	@Id
    @Column(name = "ID")
    @SequenceGenerator(name="SEQ_DRI_COLUMNS_UNREAD", sequenceName="SEQ_DRI_COLUMNS_UNREAD", allocationSize=1)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="SEQ_DRI_COLUMNS_UNREAD")
	private Long id;
	
	private Long userId;
	
	private String userName;
	
	private Long xwdtUnread;
	
	private Long tzggUnread;
	
	private Long jyjlUnread;
	
	private Long zcfgUnread;
	
	private Long bzgfUnread;
	
	private Long hhbUnread;
	
	private Long hongbUnread;
	
	private Long heibUnread;
	
	private Date createTime;
	
	private Date updateTime;
	
	private Long isActive;

	private Long czxzUnread;

	private Long flsmUnread;

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	public Long getUserId() {
		return this.userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public String getUserName() {
		return this.userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public Long getXwdtUnread() {
		return xwdtUnread;
	}

	public void setXwdtUnread(Long xwdtUnread) {
		this.xwdtUnread = xwdtUnread;
	}

	public Long getTzggUnread() {
		return this.tzggUnread;
	}

	public void setTzggUnread(Long tzggUnread) {
		this.tzggUnread = tzggUnread;
	}
	public Long getJyjlUnread() {
		return this.jyjlUnread;
	}

	public void setJyjlUnread(Long jyjlUnread) {
		this.jyjlUnread = jyjlUnread;
	}
	public Long getZcfgUnread() {
		return this.zcfgUnread;
	}

	public void setZcfgUnread(Long zcfgUnread) {
		this.zcfgUnread = zcfgUnread;
	}
	public Long getBzgfUnread() {
		return this.bzgfUnread;
	}

	public void setBzgfUnread(Long bzgfUnread) {
		this.bzgfUnread = bzgfUnread;
	}
	public Long getHhbUnread() {
		return this.hhbUnread;
	}

	public void setHhbUnread(Long hhbUnread) {
		this.hhbUnread = hhbUnread;
	}
	public Long getHongbUnread() {
		return this.hongbUnread;
	}

	public void setHongbUnread(Long hongbUnread) {
		this.hongbUnread = hongbUnread;
	}
	public Long getHeibUnread() {
		return this.heibUnread;
	}

	public void setHeibUnread(Long heibUnread) {
		this.heibUnread = heibUnread;
	}
	public Date getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public Date getUpdateTime() {
		return this.updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
	public Long getIsActive() {
		return this.isActive;
	}

	public void setIsActive(Long isActive) {
		this.isActive = isActive;
	}

	public Long getCzxzUnread() {
		return czxzUnread;
	}

	public void setCzxzUnread(Long czxzUnread) {
		this.czxzUnread = czxzUnread;
	}

	public Long getFlsmUnread() {
		return flsmUnread;
	}

	public void setFlsmUnread(Long flsmUnread) {
		this.flsmUnread = flsmUnread;
	}
}