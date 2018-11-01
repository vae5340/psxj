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
@Table(name = "EX_SHUIWU_UNIT_HOUSE_FORM" , catalog = "awater_swj")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ExShuiwuUnitHouseForm implements java.io.Serializable {
	
	// 属性
	
	private String unitId;
	
	private String socialCreditCode;
	
	private String houseId;
	
	private String unitType;
	
	private String name;
	
	private String legalRepresent;
	
	private String areaCode;
	
	private String area;
	
	private String registerStatu;
	
	private String status;
	
	private String industryType;
	
	private String economicType;
	
	private String businessScope;
	@Id
    @Column(name = "ID")
    @SequenceGenerator(name="SEQ_EX_SHUIWU_UNIT_HOUSE_FORM", sequenceName="awater_swj.SEQ_EX_SHUIWU_UNIT_HOUSE_FORM", allocationSize=1)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="SEQ_EX_SHUIWU_UNIT_HOUSE_FORM")
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
	public String getUnitId() {
		return this.unitId;
	}

	public void setUnitId(String unitId) {
		this.unitId = unitId;
	}
	public String getSocialCreditCode() {
		return this.socialCreditCode;
	}

	public void setSocialCreditCode(String socialCreditCode) {
		this.socialCreditCode = socialCreditCode;
	}
	public String getHouseId() {
		return this.houseId;
	}

	public void setHouseId(String houseId) {
		this.houseId = houseId;
	}
	public String getUnitType() {
		return this.unitType;
	}

	public void setUnitType(String unitType) {
		this.unitType = unitType;
	}
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}
	public String getLegalRepresent() {
		return this.legalRepresent;
	}

	public void setLegalRepresent(String legalRepresent) {
		this.legalRepresent = legalRepresent;
	}
	public String getAreaCode() {
		return this.areaCode;
	}

	public void setAreaCode(String areaCode) {
		this.areaCode = areaCode;
	}
	public String getArea() {
		return this.area;
	}

	public void setArea(String area) {
		this.area = area;
	}
	public String getRegisterStatu() {
		return this.registerStatu;
	}

	public void setRegisterStatu(String registerStatu) {
		this.registerStatu = registerStatu;
	}
	public String getStatus() {
		return this.status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	public String getIndustryType() {
		return this.industryType;
	}

	public void setIndustryType(String industryType) {
		this.industryType = industryType;
	}
	public String getEconomicType() {
		return this.economicType;
	}

	public void setEconomicType(String economicType) {
		this.economicType = economicType;
	}
	public String getBusinessScope() {
		return this.businessScope;
	}

	public void setBusinessScope(String businessScope) {
		this.businessScope = businessScope;
	}
	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
}