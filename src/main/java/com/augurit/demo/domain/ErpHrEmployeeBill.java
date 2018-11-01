package com.augurit.demo.domain;

import com.augurit.agcloud.bpm.front.domain.IdEntity;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;

/**
* -模型
<ul>
    <li>项目名：奥格erp3.0--第一期建设项目</li>
    <li>版本信息：v1.0</li>
    <li>日期：2018-04-27 10:26:25</li>
    <li>版权所有(C)2016广州奥格智能科技有限公司-版权所有</li>
    <li>创建人:Administrator</li>
    <li>创建时间：2018-04-27 10:26:25</li>
    <li>修改人1：</li>
    <li>修改时间1：</li>
    <li>修改内容1：</li>
</ul>
*/
public class ErpHrEmployeeBill extends IdEntity implements Serializable{
// ----------------------------------------------------- Properties

    private static final long serialVersionUID = 1L;
    private String billId; // (主键)
    @DateTimeFormat(pattern="yyyy-MM-dd")
    private java.util.Date billCreateDate; // (填写日期)
    private String userLoginName; // (用户登录名)
    private String userName; // (用户名)
    private String orgId; // (所属组织ID)
    private String billReason; // (请假或加班事由)
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private java.util.Date billStartDate; // (请假或加班开始时间)
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private java.util.Date billEndDate; // (请假或加班结束时间)
    private String isDeleted; // (是否逻辑删除，0表示未删除，1表示已删除)

    private String billStartDateStr;
    private String billEndDateStr;
// ----------------------------------------------------- Constructors
// ----------------------------------------------------- Methods
    public String getBillId(){
        return billId;
    }
    public void setBillId( String billId ) {
        this.billId = billId == null ? null : billId.trim();
    }
    public java.util.Date getBillCreateDate() {
        return billCreateDate;
    }
    public void setBillCreateDate( java.util.Date billCreateDate ){
        this.billCreateDate = billCreateDate;
    }

    public String getUserLoginName(){
        return userLoginName;
    }
    public void setUserLoginName( String userLoginName ) {
        this.userLoginName = userLoginName == null ? null : userLoginName.trim();
    }
    public String getUserName(){
        return userName;
    }
    public void setUserName( String userName ) {
        this.userName = userName == null ? null : userName.trim();
    }
    public String getOrgId(){
        return orgId;
    }
    public void setOrgId( String orgId ) {
        this.orgId = orgId == null ? null : orgId.trim();
    }
    public String getBillReason(){
        return billReason;
    }
    public void setBillReason( String billReason ) {
        this.billReason = billReason == null ? null : billReason.trim();
    }
    public java.util.Date getBillStartDate() {
        return billStartDate;
    }
    public void setBillStartDate( java.util.Date billStartDate ){
        this.billStartDate = billStartDate;
    }

    public java.util.Date getBillEndDate() {
        return billEndDate;
    }
    public void setBillEndDate( java.util.Date billEndDate ){
        this.billEndDate = billEndDate;
    }

    public String getIsDeleted(){
        return isDeleted;
    }
    public void setIsDeleted( String isDeleted ) {
        this.isDeleted = isDeleted == null ? null : isDeleted.trim();
    }

    public String getBillStartDateStr() {
        return billStartDateStr;
    }

    public void setBillStartDateStr(String billStartDateStr) {
        this.billStartDateStr = billStartDateStr;
    }

    public String getBillEndDateStr() {
        return billEndDateStr;
    }

    public void setBillEndDateStr(String billEndDateStr) {
        this.billEndDateStr = billEndDateStr;
    }

    @Override
    public String getBusId() {
        return billId;
    }


    @Override
    public boolean isSupportSummary() {
        return true;
    }
    //public String getTableName()  {
    //    return "ErpHrEmployeeBill";
    //}
}
