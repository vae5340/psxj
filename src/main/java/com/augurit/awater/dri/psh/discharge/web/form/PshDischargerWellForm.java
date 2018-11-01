package com.augurit.awater.dri.psh.discharge.web.form;

import java.util.Date;

public class PshDischargerWellForm {
	// 属性
	private String id;
	private String dischargeId;
	private String wellId;
	private String wellType;
	private String wellPro;
	private String wellDir;
	private String drainPro;
	private String pipeType;
	private String lxId;
	

	public String getLxId() {
		return lxId;
	}

	public void setLxId(String lxId) {
		this.lxId = lxId;
	}
	
	//额外添加字段，不保存到数据库
	private Double x;
	private Double y;
	

	public Double getX() {
		return x;
	}

	public void setX(Double x) {
		this.x = x;
	}

	public Double getY() {
		return y;
	}

	public void setY(Double y) {
		this.y = y;
	}

	public String getId() {
		return this.id;
	}

	public String getPipeType() {
		return pipeType;
	}

	public void setPipeType(String pipeType) {
		this.pipeType = pipeType;
	}

	public void setId(String id) {
		this.id = id;
	}
	public String getDischargeId() {
		return this.dischargeId;
	}

	public void setDischargeId(String dischargeId) {
		this.dischargeId = dischargeId;
	}
	public String getWellId() {
		return this.wellId;
	}

	public void setWellId(String wellId) {
		this.wellId = wellId;
	}
	public String getWellType() {
		return this.wellType;
	}

	public void setWellType(String wellType) {
		this.wellType = wellType;
	}
	public String getWellPro() {
		return this.wellPro;
	}

	public void setWellPro(String wellPro) {
		this.wellPro = wellPro;
	}
	public String getWellDir() {
		return this.wellDir;
	}

	public void setWellDir(String wellDir) {
		this.wellDir = wellDir;
	}
	public String getDrainPro() {
		return this.drainPro;
	}

	public void setDrainPro(String drainPro) {
		this.drainPro = drainPro;
	}
}