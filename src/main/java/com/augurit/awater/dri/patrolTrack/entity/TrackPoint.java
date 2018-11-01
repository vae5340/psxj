package com.augurit.awater.dri.patrolTrack.entity;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "DRI_TRACK_POINT")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class TrackPoint implements java.io.Serializable {
	
	// 属性
	@Id
    @Column(name = "ID")
    @SequenceGenerator(name="SEQ_DRI_TRACK_POINT", sequenceName="SEQ_DRI_TRACK_POINT", allocationSize=1)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="SEQ_DRI_TRACK_POINT")
	private Long id;
	
	private Double x;
	
	private Double y;
	
	private String markPersonId;
	
	private String markPerson;
	
	private String loginName;
	
	private Date markTime;
	
	private String teamOrgId;
	
	private String teamOrgName;
	
	private String directOrgId;
	
	private String directOrgName;
	
	private String parentOrgId;
	
	private String parentOrgName;
	
	private String superviseOrgId;
	
	private String superviseOrgName;
	
	private String state;
	
	private String trackId;
	
	private String trackName;
	
	private String recordLength;

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
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
	public String getMarkPersonId() {
		return this.markPersonId;
	}

	public void setMarkPersonId(String markPersonId) {
		this.markPersonId = markPersonId;
	}
	public String getMarkPerson() {
		return this.markPerson;
	}

	public void setMarkPerson(String markPerson) {
		this.markPerson = markPerson;
	}
	public String getLoginName() {
		return this.loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}
	public Date getMarkTime() {
		return this.markTime;
	}

	public void setMarkTime(Date markTime) {
		this.markTime = markTime;
	}
	public String getTeamOrgId() {
		return this.teamOrgId;
	}

	public void setTeamOrgId(String teamOrgId) {
		this.teamOrgId = teamOrgId;
	}
	public String getTeamOrgName() {
		return this.teamOrgName;
	}

	public void setTeamOrgName(String teamOrgName) {
		this.teamOrgName = teamOrgName;
	}
	public String getDirectOrgId() {
		return this.directOrgId;
	}

	public void setDirectOrgId(String directOrgId) {
		this.directOrgId = directOrgId;
	}
	public String getDirectOrgName() {
		return this.directOrgName;
	}

	public void setDirectOrgName(String directOrgName) {
		this.directOrgName = directOrgName;
	}
	public String getParentOrgId() {
		return this.parentOrgId;
	}

	public void setParentOrgId(String parentOrgId) {
		this.parentOrgId = parentOrgId;
	}
	public String getParentOrgName() {
		return this.parentOrgName;
	}

	public void setParentOrgName(String parentOrgName) {
		this.parentOrgName = parentOrgName;
	}
	public String getSuperviseOrgId() {
		return this.superviseOrgId;
	}

	public void setSuperviseOrgId(String superviseOrgId) {
		this.superviseOrgId = superviseOrgId;
	}
	public String getSuperviseOrgName() {
		return this.superviseOrgName;
	}

	public void setSuperviseOrgName(String superviseOrgName) {
		this.superviseOrgName = superviseOrgName;
	}
	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}
	public String getTrackId() {
		return this.trackId;
	}

	public void setTrackId(String trackId) {
		this.trackId = trackId;
	}
	public String getTrackName() {
		return this.trackName;
	}

	public void setTrackName(String trackName) {
		this.trackName = trackName;
	}
	public String getRecordLength() {
		return this.recordLength;
	}

	public void setRecordLength(String recordLength) {
		this.recordLength = recordLength;
	}
}