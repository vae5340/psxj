package com.augurit.awater.bpm.xcyh.report.web.form;

/**
 * Created by HOWS on 2018-09-06.
 */
public class GxEventList {
    private String procInstDbId;//流程ID 分为R1上报的和Rg活Rm上报的流程
    private String taskInstDbid;
    private String upTtaskInstDbid;
    private String masterEntityKey;
    private String activityName;
    private String activityChineseName;
    private String templateName;
    private String templateCode;
    private long reportTime;
    private long hanleTime; //任务处理时间
    private String road;
    private String eventType;
    private String urgencyDegree;
    private String addr;
    private String description;
    private String componentType;
    private String reportUser;
    private String imgPath;
    private String thumPath;
    private String state;

    public String getProcInstDbId() {
        return procInstDbId;
    }

    public void setProcInstDbId(String procInstDbId) {
        this.procInstDbId = procInstDbId;
    }

    public String getTaskInstDbid() {
        return taskInstDbid;
    }

    public void setTaskInstDbid(String taskInstDbid) {
        this.taskInstDbid = taskInstDbid;
    }

    public String getMasterEntityKey() {
        return masterEntityKey;
    }

    public void setMasterEntityKey(String masterEntityKey) {
        this.masterEntityKey = masterEntityKey;
    }

    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public String getActivityChineseName() {
        return activityChineseName;
    }

    public void setActivityChineseName(String activityChineseName) {
        this.activityChineseName = activityChineseName;
    }

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public String getTemplateCode() {
        return templateCode;
    }

    public void setTemplateCode(String templateCode) {
        this.templateCode = templateCode;
    }

    public long getReportTime() {
        return reportTime;
    }

    public void setReportTime(long reportTime) {
        this.reportTime = reportTime;
    }

    public String getRoad() {
        return road;
    }

    public void setRoad(String road) {
        this.road = road;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getUrgencyDegree() {
        return urgencyDegree;
    }

    public void setUrgencyDegree(String urgencyDegree) {
        this.urgencyDegree = urgencyDegree;
    }

    public String getAddr() {
        return addr;
    }

    public void setAddr(String addr) {
        this.addr = addr;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getComponentType() {
        return componentType;
    }

    public void setComponentType(String componentType) {
        this.componentType = componentType;
    }

    public String getReportUser() {
        return reportUser;
    }

    public void setReportUser(String reportUser) {
        this.reportUser = reportUser;
    }

    public String getImgPath() {
        return imgPath;
    }

    public void setImgPath(String imgPath) {
        this.imgPath = imgPath;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getThumPath() {
        return thumPath;
    }

    public void setThumPath(String thumPath) {
        this.thumPath = thumPath;
    }

    public String getUpTtaskInstDbid() {
        return upTtaskInstDbid;
    }

    public void setUpTtaskInstDbid(String upTtaskInstDbid) {
        this.upTtaskInstDbid = upTtaskInstDbid;
    }

    public long getHanleTime() {
        return hanleTime;
    }

    public void setHanleTime(long hanleTime) {
        this.hanleTime = hanleTime;
    }
}
