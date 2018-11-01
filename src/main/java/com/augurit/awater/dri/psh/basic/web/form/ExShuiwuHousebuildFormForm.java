package com.augurit.awater.dri.psh.basic.web.form;

import java.util.List;

public class ExShuiwuHousebuildFormForm {
	// 属性
	private String committees;
	private String gridCode;
	private String roadName;
	private String doorplateNumber;
	private String houseProperty;
	private String structure;
	private String type;
	private String houseType;
	private String houseUse;
	private Long floor;
	private Long sets;
	private Long floorUp;
	private Long floorDown;
	private String id;
	private String doorplateId;
	private String doorplateAddressCode;
	private String community;
	private String road;
	private String policeStation;

	//房屋
	List<ExShuiwuHouseFormForm> houseList;
	
	public List<ExShuiwuHouseFormForm> getHouseList() {
		return houseList;
	}

	public void setHouseList(List<ExShuiwuHouseFormForm> houseList) {
		this.houseList = houseList;
	}

	public String getCommittees() {
		return this.committees;
	}

	public void setCommittees(String committees) {
		this.committees = committees;
	}
	public String getGridCode() {
		return this.gridCode;
	}

	public void setGridCode(String gridCode) {
		this.gridCode = gridCode;
	}
	public String getRoadName() {
		return this.roadName;
	}

	public void setRoadName(String roadName) {
		this.roadName = roadName;
	}
	public String getDoorplateNumber() {
		return this.doorplateNumber;
	}

	public void setDoorplateNumber(String doorplateNumber) {
		this.doorplateNumber = doorplateNumber;
	}
	public String getHouseProperty() {
		return this.houseProperty;
	}

	public void setHouseProperty(String houseProperty) {
		this.houseProperty = houseProperty;
	}
	public String getStructure() {
		return this.structure;
	}

	public void setStructure(String structure) {
		this.structure = structure;
	}
	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}
	public String getHouseType() {
		return this.houseType;
	}

	public void setHouseType(String houseType) {
		this.houseType = houseType;
	}
	public String getHouseUse() {
		return this.houseUse;
	}

	public void setHouseUse(String houseUse) {
		this.houseUse = houseUse;
	}
	public Long getFloor() {
		return this.floor;
	}

	public void setFloor(Long floor) {
		this.floor = floor;
	}
	public Long getSets() {
		return this.sets;
	}

	public void setSets(Long sets) {
		this.sets = sets;
	}
	public Long getFloorUp() {
		return this.floorUp;
	}

	public void setFloorUp(Long floorUp) {
		this.floorUp = floorUp;
	}
	public Long getFloorDown() {
		return this.floorDown;
	}

	public void setFloorDown(Long floorDown) {
		this.floorDown = floorDown;
	}
	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}
	public String getDoorplateId() {
		return this.doorplateId;
	}

	public void setDoorplateId(String doorplateId) {
		this.doorplateId = doorplateId;
	}
	public String getDoorplateAddressCode() {
		return this.doorplateAddressCode;
	}

	public void setDoorplateAddressCode(String doorplateAddressCode) {
		this.doorplateAddressCode = doorplateAddressCode;
	}
	public String getCommunity() {
		return this.community;
	}

	public void setCommunity(String community) {
		this.community = community;
	}
	public String getRoad() {
		return this.road;
	}

	public void setRoad(String road) {
		this.road = road;
	}
	public String getPoliceStation() {
		return this.policeStation;
	}

	public void setPoliceStation(String policeStation) {
		this.policeStation = policeStation;
	}
}