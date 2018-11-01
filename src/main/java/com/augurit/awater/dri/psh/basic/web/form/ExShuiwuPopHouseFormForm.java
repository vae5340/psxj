package com.augurit.awater.dri.psh.basic.web.form;

import java.util.Date;

public class ExShuiwuPopHouseFormForm {
	// 属性
	private String populationId;
	private String houseId;
	private String name;
	private String populationType;
	private Long id;
	private Long isexist;
	private Long isrecorded;
	
	
	
	public Long getIsexist() {
		return isexist;
	}

	public void setIsexist(Long isexist) {
		this.isexist = isexist;
	}

	public Long getIsrecorded() {
		return isrecorded;
	}

	public void setIsrecorded(Long isrecorded) {
		this.isrecorded = isrecorded;
	}
	public String getPopulationId() {
		return this.populationId;
	}

	public void setPopulationId(String populationId) {
		this.populationId = populationId;
	}
	public String getHouseId() {
		return this.houseId;
	}

	public void setHouseId(String houseId) {
		this.houseId = houseId;
	}
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}
	public String getPopulationType() {
		return this.populationType;
	}

	public void setPopulationType(String populationType) {
		this.populationType = populationType;
	}
	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
}