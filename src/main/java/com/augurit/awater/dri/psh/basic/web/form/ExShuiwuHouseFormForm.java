package com.augurit.awater.dri.psh.basic.web.form;

import java.util.List;

public class ExShuiwuHouseFormForm {
	// 属性
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

	//人
	List<ExShuiwuPopHouseFormForm> popList;
	
	//单位
	List<ExShuiwuUnitHouseFormForm> unitList;
	
	public List<ExShuiwuPopHouseFormForm> getPopList() {
		return popList;
	}

	public void setPopList(List<ExShuiwuPopHouseFormForm> popList) {
		this.popList = popList;
	}

	public List<ExShuiwuUnitHouseFormForm> getUnitList() {
		return unitList;
	}

	public void setUnitList(List<ExShuiwuUnitHouseFormForm> unitList) {
		this.unitList = unitList;
	}

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