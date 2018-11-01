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
@Table(name = "EX_SHUIWU_POP_HOUSE_FORM", catalog = "awater_swj")
@Cache(usage = CacheConcurrencyStrategy.READ_ONLY)
public class ExShuiwuPopHouseForm implements java.io.Serializable {
	
	// 属性
	
	private String populationId;
	
	private String houseId;
	
	private String name;
	
	private String populationType;
	@Id
    @Column(name = "ID")
    @SequenceGenerator(name="SEQ_EX_SHUIWU_POP_HOUSE_FORM", sequenceName="SEQ_EX_SHUIWU_POP_HOUSE_FORM", allocationSize=1)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="SEQ_EX_SHUIWU_POP_HOUSE_FORM")
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