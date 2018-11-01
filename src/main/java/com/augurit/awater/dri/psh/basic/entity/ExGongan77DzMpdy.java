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
@Table(name = "EX_GONGAN_77_DZ_MPDY", catalog = "awater_swj")
@Cache(usage = CacheConcurrencyStrategy.READ_ONLY)
public class ExGongan77DzMpdy implements java.io.Serializable {
	
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
	
	private Long dyhs;
	
	private String lphm;
	
	private String lpdzbm;
	
	private String dzqc;
	
	private String ssxzqhdm;
	
	private String dyhm;
	
	private Long mphm;
	
	private Double zxjd;
	
	private String lpdzmc;
	
	private String mpwzhm;
	
	private String mpdzbm;
	
	private String dzmc;
	
	private String dzdm;
	
	private String ssjlxdm;
	
	private String dymc;
	
	private String sspcsdm;
	
	private String shr;
	
	private Double zxwd;
	
	private String dzxxd;
	
	private String mpdzmc;
	
	private String hh;
	
	private String sffw;
	
	private String sssqcjwhdm;
	
	private String xgr;
	
	private String mplx;
	
	private Date lastupdatedtime;
	
	private Date xgsj;
	
	private String smzt;
	
	private String fjdzdm;
	
	private String lpdzmcpy;
	
	private String fwhs;
	
	private Date shsj;
	
	private String sfdtl;
	
	private String hjdz;
	
	private String dzxz;
	
	private String fwcs;
	
	private Date gzdbAddtime;
	
	private String zxzt;
	
	private String lpsszzxqdm;
	
	private String systemid;
	
	private String jlxlx;
	
	private Date cccjsj;
	
	private String cccjr;
	
	private Long dycs;
	
	private String ssjwqdm;
	
	private String ssxzjddm;
	
	private String mpdzmcpy;
	
	private Long isexist;
	
	private Long istatue;

	public Long getIsexist() {
		return isexist;
	}

	public void setIsexist(Long isexist) {
		this.isexist = isexist;
	}

	public Long getIstatue() {
		return istatue;
	}

	public void setIstatue(Long istatue) {
		this.istatue = istatue;
	}

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
	public Long getDyhs() {
		return this.dyhs;
	}

	public void setDyhs(Long dyhs) {
		this.dyhs = dyhs;
	}
	public String getLphm() {
		return this.lphm;
	}

	public void setLphm(String lphm) {
		this.lphm = lphm;
	}
	public String getLpdzbm() {
		return this.lpdzbm;
	}

	public void setLpdzbm(String lpdzbm) {
		this.lpdzbm = lpdzbm;
	}
	public String getDzqc() {
		return this.dzqc;
	}

	public void setDzqc(String dzqc) {
		this.dzqc = dzqc;
	}
	public String getSsxzqhdm() {
		return this.ssxzqhdm;
	}

	public void setSsxzqhdm(String ssxzqhdm) {
		this.ssxzqhdm = ssxzqhdm;
	}
	public String getDyhm() {
		return this.dyhm;
	}

	public void setDyhm(String dyhm) {
		this.dyhm = dyhm;
	}
	public Long getMphm() {
		return this.mphm;
	}

	public void setMphm(Long mphm) {
		this.mphm = mphm;
	}
	public Double getZxjd() {
		return this.zxjd;
	}

	public void setZxjd(Double zxjd) {
		this.zxjd = zxjd;
	}
	public String getLpdzmc() {
		return this.lpdzmc;
	}

	public void setLpdzmc(String lpdzmc) {
		this.lpdzmc = lpdzmc;
	}
	public String getMpwzhm() {
		return this.mpwzhm;
	}

	public void setMpwzhm(String mpwzhm) {
		this.mpwzhm = mpwzhm;
	}
	public String getMpdzbm() {
		return this.mpdzbm;
	}

	public void setMpdzbm(String mpdzbm) {
		this.mpdzbm = mpdzbm;
	}
	public String getDzmc() {
		return this.dzmc;
	}

	public void setDzmc(String dzmc) {
		this.dzmc = dzmc;
	}
	public String getDzdm() {
		return this.dzdm;
	}

	public void setDzdm(String dzdm) {
		this.dzdm = dzdm;
	}
	public String getSsjlxdm() {
		return this.ssjlxdm;
	}

	public void setSsjlxdm(String ssjlxdm) {
		this.ssjlxdm = ssjlxdm;
	}
	public String getDymc() {
		return this.dymc;
	}

	public void setDymc(String dymc) {
		this.dymc = dymc;
	}
	public String getSspcsdm() {
		return this.sspcsdm;
	}

	public void setSspcsdm(String sspcsdm) {
		this.sspcsdm = sspcsdm;
	}
	public String getShr() {
		return this.shr;
	}

	public void setShr(String shr) {
		this.shr = shr;
	}
	public Double getZxwd() {
		return this.zxwd;
	}

	public void setZxwd(Double zxwd) {
		this.zxwd = zxwd;
	}
	public String getDzxxd() {
		return this.dzxxd;
	}

	public void setDzxxd(String dzxxd) {
		this.dzxxd = dzxxd;
	}
	public String getMpdzmc() {
		return this.mpdzmc;
	}

	public void setMpdzmc(String mpdzmc) {
		this.mpdzmc = mpdzmc;
	}
	public String getHh() {
		return this.hh;
	}

	public void setHh(String hh) {
		this.hh = hh;
	}
	public String getSffw() {
		return this.sffw;
	}

	public void setSffw(String sffw) {
		this.sffw = sffw;
	}
	public String getSssqcjwhdm() {
		return this.sssqcjwhdm;
	}

	public void setSssqcjwhdm(String sssqcjwhdm) {
		this.sssqcjwhdm = sssqcjwhdm;
	}
	public String getXgr() {
		return this.xgr;
	}

	public void setXgr(String xgr) {
		this.xgr = xgr;
	}
	public String getMplx() {
		return this.mplx;
	}

	public void setMplx(String mplx) {
		this.mplx = mplx;
	}
	public Date getLastupdatedtime() {
		return this.lastupdatedtime;
	}

	public void setLastupdatedtime(Date lastupdatedtime) {
		this.lastupdatedtime = lastupdatedtime;
	}
	public Date getXgsj() {
		return this.xgsj;
	}

	public void setXgsj(Date xgsj) {
		this.xgsj = xgsj;
	}
	public String getSmzt() {
		return this.smzt;
	}

	public void setSmzt(String smzt) {
		this.smzt = smzt;
	}
	public String getFjdzdm() {
		return this.fjdzdm;
	}

	public void setFjdzdm(String fjdzdm) {
		this.fjdzdm = fjdzdm;
	}
	public String getLpdzmcpy() {
		return this.lpdzmcpy;
	}

	public void setLpdzmcpy(String lpdzmcpy) {
		this.lpdzmcpy = lpdzmcpy;
	}
	public String getFwhs() {
		return this.fwhs;
	}

	public void setFwhs(String fwhs) {
		this.fwhs = fwhs;
	}
	public Date getShsj() {
		return this.shsj;
	}

	public void setShsj(Date shsj) {
		this.shsj = shsj;
	}
	public String getSfdtl() {
		return this.sfdtl;
	}

	public void setSfdtl(String sfdtl) {
		this.sfdtl = sfdtl;
	}
	public String getHjdz() {
		return this.hjdz;
	}

	public void setHjdz(String hjdz) {
		this.hjdz = hjdz;
	}
	public String getDzxz() {
		return this.dzxz;
	}

	public void setDzxz(String dzxz) {
		this.dzxz = dzxz;
	}
	public String getFwcs() {
		return this.fwcs;
	}

	public void setFwcs(String fwcs) {
		this.fwcs = fwcs;
	}
	public Date getGzdbAddtime() {
		return this.gzdbAddtime;
	}

	public void setGzdbAddtime(Date gzdbAddtime) {
		this.gzdbAddtime = gzdbAddtime;
	}
	public String getZxzt() {
		return this.zxzt;
	}

	public void setZxzt(String zxzt) {
		this.zxzt = zxzt;
	}
	public String getLpsszzxqdm() {
		return this.lpsszzxqdm;
	}

	public void setLpsszzxqdm(String lpsszzxqdm) {
		this.lpsszzxqdm = lpsszzxqdm;
	}
	public String getSystemid() {
		return this.systemid;
	}

	public void setSystemid(String systemid) {
		this.systemid = systemid;
	}
	public String getJlxlx() {
		return this.jlxlx;
	}

	public void setJlxlx(String jlxlx) {
		this.jlxlx = jlxlx;
	}
	public Date getCccjsj() {
		return this.cccjsj;
	}

	public void setCccjsj(Date cccjsj) {
		this.cccjsj = cccjsj;
	}
	public String getCccjr() {
		return this.cccjr;
	}

	public void setCccjr(String cccjr) {
		this.cccjr = cccjr;
	}
	public Long getDycs() {
		return this.dycs;
	}

	public void setDycs(Long dycs) {
		this.dycs = dycs;
	}
	public String getSsjwqdm() {
		return this.ssjwqdm;
	}

	public void setSsjwqdm(String ssjwqdm) {
		this.ssjwqdm = ssjwqdm;
	}
	public String getSsxzjddm() {
		return this.ssxzjddm;
	}

	public void setSsxzjddm(String ssxzjddm) {
		this.ssxzjddm = ssxzjddm;
	}
	public String getMpdzmcpy() {
		return this.mpdzmcpy;
	}

	public void setMpdzmcpy(String mpdzmcpy) {
		this.mpdzmcpy = mpdzmcpy;
	}
}