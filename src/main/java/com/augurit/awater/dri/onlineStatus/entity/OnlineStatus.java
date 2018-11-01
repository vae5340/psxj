package com.augurit.awater.dri.onlineStatus.entity;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "DRI_ONLINE_STATUS")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class OnlineStatus implements java.io.Serializable {
	
	// 属性
	@Id
    @Column(name = "ID")
    @SequenceGenerator(name="SEQ_DRI_ONLINE_STATUS", sequenceName="SEQ_DRI_ONLINE_STATUS", allocationSize=1)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="SEQ_DRI_ONLINE_STATUS")
	private Long id;
	
	private String userId;
	
	private String status;
	
	private String os;
	
	private Date time;

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	public String getUserId() {
		return this.userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getStatus() {
		return this.status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	public String getOs() {
		return this.os;
	}

	public void setOs(String os) {
		this.os = os;
	}
	public Date getTime() {
		return this.time;
	}

	public void setTime(Date time) {
		this.time = time;
	}
}