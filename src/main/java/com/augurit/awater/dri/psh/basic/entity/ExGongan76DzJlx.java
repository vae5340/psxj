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
@Table(name = "EX_GONGAN_76_DZ_JLX", catalog = "awater_swj")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ExGongan76DzJlx implements java.io.Serializable {
	
	// 属性
	@Id
	private String sGuid;
	
	private Date sCreationTime;
	
	private Date sLastUpdated;
	
	private String sStatus;
	
	private String sTransStatus;
	
	private String sRouteStatus;
	
	private String sSrcNode;
	
	private String sDestNode;
	
	private Long px;
	
	private String sssqcjwhdm;
	
	private String fjdm;
	
	private String sfyjjlx;
	
	private String py;
	
	private String systemid;
	
	private String bhpcsdm;
	
	private String ssxzqhdm;
	
	private String mc;
	
	private String zxzt;
	
	private String smzt;
	
	private Date gzdbAddtime;
	
	private String jlxlx;
	
	private String ssxzjddm;
	
	private Date lastupdatedtime;
	
	private String dm;
	
	private String jlxly;

	public String getSGuid() {
		return this.sGuid;
	}

	public void setSGuid(String sGuid) {
		this.sGuid = sGuid;
	}
	public Date getSCreationTime() {
		return this.sCreationTime;
	}

	public void setSCreationTime(Date sCreationTime) {
		this.sCreationTime = sCreationTime;
	}
	public Date getSLastUpdated() {
		return this.sLastUpdated;
	}

	public void setSLastUpdated(Date sLastUpdated) {
		this.sLastUpdated = sLastUpdated;
	}
	public String getSStatus() {
		return this.sStatus;
	}

	public void setSStatus(String sStatus) {
		this.sStatus = sStatus;
	}
	public String getSTransStatus() {
		return this.sTransStatus;
	}

	public void setSTransStatus(String sTransStatus) {
		this.sTransStatus = sTransStatus;
	}
	public String getSRouteStatus() {
		return this.sRouteStatus;
	}

	public void setSRouteStatus(String sRouteStatus) {
		this.sRouteStatus = sRouteStatus;
	}
	public String getSSrcNode() {
		return this.sSrcNode;
	}

	public void setSSrcNode(String sSrcNode) {
		this.sSrcNode = sSrcNode;
	}
	public String getSDestNode() {
		return this.sDestNode;
	}

	public void setSDestNode(String sDestNode) {
		this.sDestNode = sDestNode;
	}
	public Long getPx() {
		return this.px;
	}

	public void setPx(Long px) {
		this.px = px;
	}
	public String getSssqcjwhdm() {
		return this.sssqcjwhdm;
	}

	public void setSssqcjwhdm(String sssqcjwhdm) {
		this.sssqcjwhdm = sssqcjwhdm;
	}
	public String getFjdm() {
		return this.fjdm;
	}

	public void setFjdm(String fjdm) {
		this.fjdm = fjdm;
	}
	public String getSfyjjlx() {
		return this.sfyjjlx;
	}

	public void setSfyjjlx(String sfyjjlx) {
		this.sfyjjlx = sfyjjlx;
	}
	public String getPy() {
		return this.py;
	}

	public void setPy(String py) {
		this.py = py;
	}
	public String getSystemid() {
		return this.systemid;
	}

	public void setSystemid(String systemid) {
		this.systemid = systemid;
	}
	public String getBhpcsdm() {
		return this.bhpcsdm;
	}

	public void setBhpcsdm(String bhpcsdm) {
		this.bhpcsdm = bhpcsdm;
	}
	public String getSsxzqhdm() {
		return this.ssxzqhdm;
	}

	public void setSsxzqhdm(String ssxzqhdm) {
		this.ssxzqhdm = ssxzqhdm;
	}
	public String getMc() {
		return this.mc;
	}

	public void setMc(String mc) {
		this.mc = mc;
	}
	public String getZxzt() {
		return this.zxzt;
	}

	public void setZxzt(String zxzt) {
		this.zxzt = zxzt;
	}
	public String getSmzt() {
		return this.smzt;
	}

	public void setSmzt(String smzt) {
		this.smzt = smzt;
	}
	public Date getGzdbAddtime() {
		return this.gzdbAddtime;
	}

	public void setGzdbAddtime(Date gzdbAddtime) {
		this.gzdbAddtime = gzdbAddtime;
	}
	public String getJlxlx() {
		return this.jlxlx;
	}

	public void setJlxlx(String jlxlx) {
		this.jlxlx = jlxlx;
	}
	public String getSsxzjddm() {
		return this.ssxzjddm;
	}

	public void setSsxzjddm(String ssxzjddm) {
		this.ssxzjddm = ssxzjddm;
	}
	public Date getLastupdatedtime() {
		return this.lastupdatedtime;
	}

	public void setLastupdatedtime(Date lastupdatedtime) {
		this.lastupdatedtime = lastupdatedtime;
	}
	public String getDm() {
		return this.dm;
	}

	public void setDm(String dm) {
		this.dm = dm;
	}
	public String getJlxly() {
		return this.jlxly;
	}

	public void setJlxly(String jlxly) {
		this.jlxly = jlxly;
	}
}