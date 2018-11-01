package com.augurit.demo.domain;
import java.io.Serializable;

import com.augurit.agcloud.bpm.front.domain.IdEntity;
import org.springframework.format.annotation.DateTimeFormat;
/**
* 问题上报表-模型
<ul>
    <li>项目名：奥格erp3.0--第一期建设项目</li>
    <li>版本信息：v1.0</li>
    <li>日期：2018-07-02 10:48:52</li>
    <li>版权所有(C)2016广州奥格智能科技有限公司-版权所有</li>
    <li>创建人:Administrator</li>
    <li>创建时间：2018-07-02 10:48:52</li>
    <li>修改人1：</li>
    <li>修改时间1：</li>
    <li>修改内容1：</li>
</ul>
*/
public class TestProblem extends IdEntity implements Serializable{
// ----------------------------------------------------- Properties
    private static final long serialVersionUID = 1L;
    private String problemId; // (主键)
    private String problemLocation; // (问题地点)
    private String problemRoad; // (问题道路)
    private String deviceType; // (设施类型)
    private String problemType; // (问题类型，以逗号分隔)
    private String urgentType; // (紧急程度)
    private String problemDesc; // (问题描述)
    private String handleMyself; // (是否自行处理，0表示否，1表示是)
    private String sendMessage; // (是否短信通知，0表示否，1表示是)
    private String locationX; // (X坐标)
    private String locationY; // (Y坐标)
    private String creater; // (创建人)
    @DateTimeFormat(pattern="yyyy-MM-dd")
    private java.util.Date createTime; // (创建时间)
    private String modifier; // (修改人)
    @DateTimeFormat(pattern="yyyy-MM-dd")
    private java.util.Date modifyTime; // (修改时间)

    private String masterEntityKey;
// ----------------------------------------------------- Constructors
// ----------------------------------------------------- Methods
    public String getProblemId(){
        return problemId;
    }
    public void setProblemId( String problemId ) {
        this.problemId = problemId == null ? null : problemId.trim();
    }
    public String getProblemLocation(){
        return problemLocation;
    }
    public void setProblemLocation( String problemLocation ) {
        this.problemLocation = problemLocation == null ? null : problemLocation.trim();
    }
    public String getProblemRoad(){
        return problemRoad;
    }
    public void setProblemRoad( String problemRoad ) {
        this.problemRoad = problemRoad == null ? null : problemRoad.trim();
    }
    public String getDeviceType(){
        return deviceType;
    }
    public void setDeviceType( String deviceType ) {
        this.deviceType = deviceType == null ? null : deviceType.trim();
    }
    public String getProblemType(){
        return problemType;
    }
    public void setProblemType( String problemType ) {
        this.problemType = problemType == null ? null : problemType.trim();
    }
    public String getUrgentType(){
        return urgentType;
    }
    public void setUrgentType( String urgentType ) {
        this.urgentType = urgentType == null ? null : urgentType.trim();
    }
    public String getProblemDesc(){
        return problemDesc;
    }
    public void setProblemDesc( String problemDesc ) {
        this.problemDesc = problemDesc == null ? null : problemDesc.trim();
    }
    public String getHandleMyself(){
        return handleMyself;
    }
    public void setHandleMyself( String handleMyself ) {
        this.handleMyself = handleMyself == null ? null : handleMyself.trim();
    }
    public String getSendMessage(){
        return sendMessage;
    }
    public void setSendMessage( String sendMessage ) {
        this.sendMessage = sendMessage == null ? null : sendMessage.trim();
    }
    public String getLocationX(){
        return locationX;
    }
    public void setLocationX( String locationX ) {
        this.locationX = locationX == null ? null : locationX.trim();
    }
    public String getLocationY(){
        return locationY;
    }
    public void setLocationY( String locationY ) {
        this.locationY = locationY == null ? null : locationY.trim();
    }
    public String getCreater(){
        return creater;
    }
    public void setCreater( String creater ) {
        this.creater = creater == null ? null : creater.trim();
    }
    public java.util.Date getCreateTime() {
        return createTime;
    }
    public void setCreateTime( java.util.Date createTime ){
        this.createTime = createTime;
    }

    public String getModifier(){
        return modifier;
    }
    public void setModifier( String modifier ) {
        this.modifier = modifier == null ? null : modifier.trim();
    }
    public java.util.Date getModifyTime() {
        return modifyTime;
    }
    public void setModifyTime( java.util.Date modifyTime ){
        this.modifyTime = modifyTime;
    }

    @Override
    public String getBusId() {
        return problemId;
    }

    @Override
    public boolean isSupportSummary() {
        return false;
    }

    //public String getTableName()  {
    //    return "TestProblem";
    //}


    public String getMasterEntityKey() {
        return masterEntityKey;
    }

    public void setMasterEntityKey(String masterEntityKey) {
        this.masterEntityKey = masterEntityKey;
    }
}
