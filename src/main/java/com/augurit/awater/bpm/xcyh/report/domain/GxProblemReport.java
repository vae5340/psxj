package com.augurit.awater.bpm.xcyh.report.domain;

import com.augurit.agcloud.bpm.front.domain.IdEntity;
import com.augurit.awater.bpm.file.web.form.SysFileForm;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

public class GxProblemReport extends IdEntity implements Serializable {
	// 属性
		private String id;
		private String fjzd;
		private String szwz;
		private String x;
		private String y;
		private String jdmc;
		private String bhlx;
		private String sslx;
		private String jjcd;
		private String wtms;
		@DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
		private Timestamp sbsj;
		private String sbsjStr;
		private String sbr;
		private String yjgcl;
		private String bz;
		private Long layerId;
		private String layerName;
		private String objectId;
		private String teamOrgId;
		private String teamOrgName;
		private String directOrgId;
		private String directOrgName;
		private String superviseOrgId;
		private String superviseOrgName;
		private String parentOrgId;
		private String parentOrgName;
		private String creater;
		private String usid;
		private String layerurl;
		private String reportx;

		private String reporty;
		private String reportaddr;
		private String loginname;
		private String isbyself;

		
		private Date sjwcsj;
		private Date yjwcsj;
		private Integer sfjb;
	//		private Date signTime;
//		private String templateCode;
//		private Long histTaskInstDbid;
//		private String activityName;
//		private String activityChineseName;

		public String getLoginname() {
			return loginname;
		}

		public void setLoginname(String loginname) {
			this.loginname = loginname;
		}
//
//
//
//		//额外添加字段，只用于显示
	private String procInstId;
//		private Long sbsj2;
//		private Long yjwcsj2;
//		private List<DetailFilesForm> files2;
//		private String state;
//		private String taskInstDbid;

		public String getUsid() {
			return usid;
		}

		public void setUsid(String usid) {
			this.usid = usid;
		}

		public String getLayerurl() {
			return layerurl;
		}

		public void setLayerurl(String layerurl) {
			this.layerurl = layerurl;
		}

		public String getReportx() {
			return reportx;
		}

		public void setReportx(String reportx) {
			this.reportx = reportx;
		}

		public String getReporty() {
			return reporty;
		}

		public void setReporty(String reporty) {
			this.reporty = reporty;
		}

		public String getReportaddr() {
			return reportaddr;
		}

		public void setReportaddr(String reportaddr) {
			this.reportaddr = reportaddr;
		}


		private List<SysFileForm> files;
		
		public List<SysFileForm> getFiles() {
			return files;
		}

		public void setFiles(List<SysFileForm> files) {
			this.files = files;
		}

		public String getId() {
			return this.id;
		}

		public void setId(String id) {
			this.id = id;
		}
		public String getFjzd() {
			return this.fjzd;
		}

		public void setFjzd(String fjzd) {
			this.fjzd = fjzd;
		}
		public String getSzwz() {
			return this.szwz;
		}

		public void setSzwz(String szwz) {
			this.szwz = szwz;
		}
		public String getX() {
			return this.x;
		}

		public void setX(String x) {
			this.x = x;
		}
		public String getY() {
			return this.y;
		}

		public void setY(String y) {
			this.y = y;
		}
		public String getJdmc() {
			return this.jdmc;
		}

		public void setJdmc(String jdmc) {
			this.jdmc = jdmc;
		}
		public String getBhlx() {
			return this.bhlx;
		}

		public void setBhlx(String bhlx) {
			this.bhlx = bhlx;
		}
		public String getSslx() {
			return this.sslx;
		}

		public void setSslx(String sslx) {
			this.sslx = sslx;
		}
		public String getJjcd() {
			return this.jjcd;
		}

		public void setJjcd(String jjcd) {
			this.jjcd = jjcd;
		}
		public String getWtms() {
			return this.wtms;
		}

		public void setWtms(String wtms) {
			this.wtms = wtms;
		}
		public Timestamp getSbsj() {
			return this.sbsj;
		}

		public void setSbsj(Timestamp sbsj) {
			this.sbsj = sbsj;
		}
		public String getSbr() {
			return this.sbr;
		}

		public void setSbr(String sbr) {
			this.sbr = sbr;
		}
		public String getYjgcl() {
			return this.yjgcl;
		}

		public void setYjgcl(String yjgcl) {
			this.yjgcl = yjgcl;
		}
		public String getBz() {
			return this.bz;
		}

		public void setBz(String bz) {
			this.bz = bz;
		}
		public Long getLayerId() {
			return this.layerId;
		}

		public void setLayerId(Long layerId) {
			this.layerId = layerId;
		}
		public String getLayerName() {
			return this.layerName;
		}

		public void setLayerName(String layerName) {
			this.layerName = layerName;
		}
		public String getObjectId() {
			return this.objectId;
		}

		public void setObjectId(String objectId) {
			this.objectId = objectId;
		}
		public String getTeamOrgId() {
			return this.teamOrgId;
		}

		public void setTeamOrgId(String teamOrgId) {
			this.teamOrgId = teamOrgId;
		}
		public String getTeamOrgName() {
			return this.teamOrgName;
		}

		public void setTeamOrgName(String teamOrgName) {
			this.teamOrgName = teamOrgName;
		}
		public String getDirectOrgId() {
			return this.directOrgId;
		}

		public void setDirectOrgId(String directOrgId) {
			this.directOrgId = directOrgId;
		}
		public String getDirectOrgName() {
			return this.directOrgName;
		}

		public void setDirectOrgName(String directOrgName) {
			this.directOrgName = directOrgName;
		}
		public String getSuperviseOrgId() {
			return this.superviseOrgId;
		}

		public void setSuperviseOrgId(String superviseOrgId) {
			this.superviseOrgId = superviseOrgId;
		}
		public String getSuperviseOrgName() {
			return this.superviseOrgName;
		}

		public void setSuperviseOrgName(String superviseOrgName) {
			this.superviseOrgName = superviseOrgName;
		}
		public String getParentOrgId() {
			return this.parentOrgId;
		}

		public void setParentOrgId(String parentOrgId) {
			this.parentOrgId = parentOrgId;
		}
		public String getParentOrgName() {
			return this.parentOrgName;
		}

		public void setParentOrgName(String parentOrgName) {
			this.parentOrgName = parentOrgName;
		}

		public Date getSjwcsj() {
			return sjwcsj;
		}

		public void setSjwcsj(Date sjwcsj) {
			this.sjwcsj = sjwcsj;
		}

		public Date getYjwcsj() {
			return yjwcsj;
		}

		public void setYjwcsj(Date yjwcsj) {
			this.yjwcsj = yjwcsj;
		}

		public Integer getSfjb() {
			return sfjb;
		}

		public void setSfjb(Integer sfjb) {
			this.sfjb = sfjb;
		}

		public String getIsbyself() {
			return isbyself;
		}

		public void setIsbyself(String isbyself) {
			this.isbyself = isbyself;
		}

	public String getSbsjStr() {
		return sbsjStr;
	}

	public void setSbsjStr(String sbsjStr) {
		this.sbsjStr = sbsjStr;
	}

	public String getProcInstId() {
		return procInstId;
	}

	public void setProcInstId(String procInstId) {
		this.procInstId = procInstId;
	}

	@Override
	public String getBusId() {
		if(id!=null)
			return id.toString();
		return null;
	}

	@Override
	public boolean isSupportSummary() {
		return false;
	}


}