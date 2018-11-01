package com.augurit.awater.bpm.xcyh.report.web.form;

import java.util.List;

public class DetailEventForm {
	 private String reportId;
	 private String addr;
	 private String x;
	 public String getReportId() {
		return reportId;
	}
	public void setReportId(String reportId) {
		this.reportId = reportId;
	}
	private String y;
	 private String road;
	 private String componentType;
	 private String eventType;
	 private String urgency;
	 private String description;
	 private long time;
	 private String userName;
	 private String sbOrg;
	 private String remark;
	 private String taskInstDbid;

	 private Long layerId;
	 private String layerName;
	 private String objectId;
	 
	 private String parentOrgId;
	 
	 private Long yjwcsj;
	 private String sfjb;
	 
	 public String getSbOrg() {
		 return sbOrg;
	 }
	 public void setSbOrg(String sbOrg) {
		 this.sbOrg = sbOrg;
	 }
	 public String getParentOrgId() {
		return parentOrgId;
	}
	public void setParentOrgId(String parentOrgId) {
		this.parentOrgId = parentOrgId;
	}
	public String getParentOrgName() {
		return parentOrgName;
	}
	public void setParentOrgName(String parentOrgName) {
		this.parentOrgName = parentOrgName;
	}
	private String parentOrgName;
	private String isbyself;
	
	 
	 public String getIsbyself() {
		return isbyself;
	}
	public void setIsbyself(String isbyself) {
		this.isbyself = isbyself;
	}
	public Long getLayerId() {
		return layerId;
	}
	public void setLayerId(Long layerId) {
		this.layerId = layerId;
	}
	public String getLayerName() {
		return layerName;
	}
	public void setLayerName(String layerName) {
		this.layerName = layerName;
	}
	public String getObjectId() {
		return objectId;
	}
	public void setObjectId(String objectId) {
		this.objectId = objectId;
	}
	private String usid;
	 private String layerurl;
	 private String reportx;
	 private String reporty;
	 private String reportaddr;
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
	private List<DetailFilesForm> files;
	
	public String getAddr() {
		return addr;
	}
	public void setAddr(String addr) {
		this.addr = addr;
	}
	public String getX() {
		return x;
	}
	public void setX(String x) {
		this.x = x;
	}
	public String getY() {
		return y;
	}
	public void setY(String y) {
		this.y = y;
	}
	public String getRoad() {
		return road;
	}
	public void setRoad(String road) {
		this.road = road;
	}
	public String getComponentType() {
		return componentType;
	}
	public void setComponentType(String componentType) {
		this.componentType = componentType;
	}
	public String getEventType() {
		return eventType;
	}
	public void setEventType(String eventType) {
		this.eventType = eventType;
	}
	public String getUrgency() {
		return urgency;
	}
	public void setUrgency(String urgency) {
		this.urgency = urgency;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public long getTime() {
		return time;
	}
	public void setTime(long time) {
		this.time = time;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public List<DetailFilesForm> getFiles() {
		return files;
	}
	public void setFiles(List<DetailFilesForm> files) {
		this.files = files;
	}
	public Long getYjwcsj() {
		return yjwcsj;
	}
	public void setYjwcsj(Long yjwcsj) {
		this.yjwcsj = yjwcsj;
	}
	public String getSfjb() {
		return sfjb;
	}
	public void setSfjb(String sfjb) {
		this.sfjb = sfjb;
	}

	public String getTaskInstDbid() {
		return taskInstDbid;
	}

	public void setTaskInstDbid(String taskInstDbid) {
		this.taskInstDbid = taskInstDbid;
	}
}
