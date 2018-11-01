package com.augurit.awater.dri.psh.basic.entity;

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
@Table(name = "EX_SHUIWU_HOUSE_FORM" , catalog = "awater_swj")
@Cache(usage = CacheConcurrencyStrategy.READ_ONLY)
public class ExShuiwuHouseForm implements java.io.Serializable {
	
	// 属性
	@Id
    @Column(name = "ID")
    @SequenceGenerator(name="SEQ_EX_SHUIWU_HOUSE_FORM", sequenceName="SEQ_EX_SHUIWU_HOUSE_FORM", allocationSize=1)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="SEQ_EX_SHUIWU_HOUSE_FORM")
	private String id;
	
	private String gridCode;
	
	private String extSystemid;
	
	private String housebuildId;
	
	private String doorplateId;
	
	private String roomNo;
	
	private String address;
	
	private String houseProperty;
	
	private String houseCategory;
	
	private String houseType;
	
	private String useWay;
	
	private String realUseWay;
	
	private Long buildArea;

	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}
	public String getGridCode() {
		return this.gridCode;
	}

	public void setGridCode(String gridCode) {
		this.gridCode = gridCode;
	}
	public String getExtSystemid() {
		return this.extSystemid;
	}

	public void setExtSystemid(String extSystemid) {
		this.extSystemid = extSystemid;
	}
	public String getHousebuildId() {
		return this.housebuildId;
	}

	public void setHousebuildId(String housebuildId) {
		this.housebuildId = housebuildId;
	}
	public String getDoorplateId() {
		return this.doorplateId;
	}

	public void setDoorplateId(String doorplateId) {
		this.doorplateId = doorplateId;
	}
	public String getRoomNo() {
		return this.roomNo;
	}

	public void setRoomNo(String roomNo) {
		this.roomNo = roomNo;
	}
	public String getAddress() {
		return this.address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
	public String getHouseProperty() {
		return this.houseProperty;
	}

	public void setHouseProperty(String houseProperty) {
		this.houseProperty = houseProperty;
	}
	public String getHouseCategory() {
		return this.houseCategory;
	}

	public void setHouseCategory(String houseCategory) {
		this.houseCategory = houseCategory;
	}
	public String getHouseType() {
		return this.houseType;
	}

	public void setHouseType(String houseType) {
		this.houseType = houseType;
	}
	public String getUseWay() {
		return this.useWay;
	}

	public void setUseWay(String useWay) {
		this.useWay = useWay;
	}
	public String getRealUseWay() {
		return this.realUseWay;
	}

	public void setRealUseWay(String realUseWay) {
		this.realUseWay = realUseWay;
	}
	public Long getBuildArea() {
		return this.buildArea;
	}

	public void setBuildArea(Long buildArea) {
		this.buildArea = buildArea;
	}
}