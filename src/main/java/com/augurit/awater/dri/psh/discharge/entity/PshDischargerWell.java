package com.augurit.awater.dri.psh.discharge.entity;

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
@Table(name = "DRI_PSH_DISCHARGER_WELL")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class PshDischargerWell implements java.io.Serializable {
	
	// 属性
	@Id
    @Column(name = "ID")
    @SequenceGenerator(name="SEQ_DRI_PSH_DISCHARGER_WELL", sequenceName="SEQ_DRI_PSH_DISCHARGER_WELL", allocationSize=1)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="SEQ_DRI_PSH_DISCHARGER_WELL")
	private String id;
	
	private String dischargeId;
	
	private String wellId;
	
	private String pipeType;
	
	public String getPipeType() {
		return pipeType;
	}

	public void setPipeType(String pipeType) {
		this.pipeType = pipeType;
	}

	private String wellType;
	
	private String wellPro;
	
	private String wellDir;
	
	private String drainPro;
	
	private String lxId;
	

	public String getLxId() {
		return lxId;
	}

	public void setLxId(String lxId) {
		this.lxId = lxId;
	}

	public String getId() {
		return this.id;
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