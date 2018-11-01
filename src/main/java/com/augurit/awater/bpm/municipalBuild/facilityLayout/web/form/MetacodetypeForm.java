package com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form;

public class MetacodetypeForm {
	// 属性
	private Long id;
	private String typecode;
	private String name;
	private String grade;
	private String memo;
	private Long seniorid;
	private Long isTable = 0l;

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	public String getTypecode() {
		return this.typecode;
	}

	public void setTypecode(String typecode) {
		this.typecode = typecode;
	}
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}
	public String getGrade() {
		return this.grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}
	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public Long getSeniorid() {
		return seniorid;
	}

	public void setSeniorid(Long seniorid) {
		this.seniorid = seniorid == null?0:seniorid;
	}

	public Long getIsTable() {
		return isTable;
	}

	public void setIsTable(Long isTable) {
		this.isTable = isTable;
	}
}