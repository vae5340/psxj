package com.augurit.awater.bpm.checkRecord.web.entity;

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

@Entity(name="com.augurit.awater.bpm.checkRecord.web.entity.ReportDelete")
@Table(name = "REPORT_DELETE")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ReportDelete implements java.io.Serializable {
	
	// 属性
	@Id
    @Column(name = "ID")
    @SequenceGenerator(name="SEQ_REPORT_DELETE", sequenceName="SEQ_REPORT_DELETE", allocationSize=1)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="SEQ_REPORT_DELETE")
	private Long id;
	
	private String isDelete; // 是否删除（0、正在删除队列，1、删除成功，2、删除失败）
	
	private String reportType;
	
	private String markId;
	
	private String objectId;
	
	private Date deleteTime;
	
	private String markPersonId;
	
	private String markPerson;
	
	private Date markTime;
	
	private Date updateTime;
	
	private String desription;
	
	private String correctType;
	
	private String layerName;
	
	private String addr;
	
	private String road;
	
	private Double x;
	
	private Double y;
	
	private String attrOne;
	
	private String attrTwo;
	
	private String attrThree;
	
	private String attrFour;
	
	private String attrFive;
	
	private String userAddr;
	
	private Double userx;
	
	private Double usery;
	
	private String usid;
	
	private String originAddr;
	
	private String originRoad;
	
	private Double orginx;
	
	private Double orginy;
	
	private String originAttrOne;
	
	private String originAttrTwo;
	
	private String originAttrThree;
	
	private String originAttrFour;
	
	private String originAttrFive;
	
	private String teamOrgId;
	
	private String teamOrgName;
	
	private String directOrgId;
	
	private String directOrgName;
	
	private String superviseOrgId;
	
	private String superviseOrgName;
	
	private String parentOrgId;
	
	private String parentOrgName;
	
	private String checkstate;
	
	private String checkPersonId;
	
	private String checkPerson;
	
	private Date checkTime;
	
	private String checkDesription;
	
	private String checkType;
	
	private String deletePersonId;//删除人id
	private String deletePerson;//删除人
	private String personUserId;
	private String phoneBrand; //删除人手机型号
	
	private String pcode; 
	private String childCode;
	private String cityVillage;
	
	public String getDeletePersonId() {
		return deletePersonId;
	}

	public void setDeletePersonId(String deletePersonId) {
		this.deletePersonId = deletePersonId;
	}

	public String getDeletePerson() {
		return deletePerson;
	}

	public void setDeletePerson(String deletePerson) {
		this.deletePerson = deletePerson;
	}

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	public String getReportType() {
		return this.reportType;
	}

	public void setReportType(String reportType) {
		this.reportType = reportType;
	}
	public String getMarkId() {
		return this.markId;
	}

	public void setMarkId(String markId) {
		this.markId = markId;
	}
	public String getObjectId() {
		return this.objectId;
	}

	public void setObjectId(String objectId) {
		this.objectId = objectId;
	}
	public Date getDeleteTime() {
		return this.deleteTime;
	}

	public void setDeleteTime(Date deleteTime) {
		this.deleteTime = deleteTime;
	}
	public String getMarkPersonId() {
		return this.markPersonId;
	}

	public void setMarkPersonId(String markPersonId) {
		this.markPersonId = markPersonId;
	}
	public String getMarkPerson() {
		return this.markPerson;
	}

	public void setMarkPerson(String markPerson) {
		this.markPerson = markPerson;
	}
	public Date getMarkTime() {
		return this.markTime;
	}

	public void setMarkTime(Date markTime) {
		this.markTime = markTime;
	}
	public Date getUpdateTime() {
		return this.updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
	public String getDesription() {
		return this.desription;
	}

	public void setDesription(String desription) {
		this.desription = desription;
	}
	public String getCorrectType() {
		return this.correctType;
	}

	public void setCorrectType(String correctType) {
		this.correctType = correctType;
	}
	public String getLayerName() {
		return this.layerName;
	}

	public void setLayerName(String layerName) {
		this.layerName = layerName;
	}
	public String getAddr() {
		return this.addr;
	}

	public void setAddr(String addr) {
		this.addr = addr;
	}
	public String getRoad() {
		return this.road;
	}

	public void setRoad(String road) {
		this.road = road;
	}
	public Double getX() {
		return this.x;
	}

	public void setX(Double x) {
		this.x = x;
	}
	public Double getY() {
		return this.y;
	}

	public void setY(Double y) {
		this.y = y;
	}
	public String getAttrOne() {
		return this.attrOne;
	}

	public void setAttrOne(String attrOne) {
		this.attrOne = attrOne;
	}
	public String getAttrTwo() {
		return this.attrTwo;
	}

	public void setAttrTwo(String attrTwo) {
		this.attrTwo = attrTwo;
	}
	public String getAttrThree() {
		return this.attrThree;
	}

	public void setAttrThree(String attrThree) {
		this.attrThree = attrThree;
	}
	public String getAttrFour() {
		return this.attrFour;
	}

	public void setAttrFour(String attrFour) {
		this.attrFour = attrFour;
	}
	public String getAttrFive() {
		return this.attrFive;
	}

	public void setAttrFive(String attrFive) {
		this.attrFive = attrFive;
	}
	public String getUserAddr() {
		return this.userAddr;
	}

	public void setUserAddr(String userAddr) {
		this.userAddr = userAddr;
	}
	
	public Double getUserx() {
		return userx;
	}

	public void setUserx(Double userx) {
		this.userx = userx;
	}

	public Double getUsery() {
		return usery;
	}

	public void setUsery(Double usery) {
		this.usery = usery;
	}

	public Double getOrginx() {
		return orginx;
	}

	public void setOrginx(Double orginx) {
		this.orginx = orginx;
	}

	public Double getOrginy() {
		return orginy;
	}

	public void setOrginy(Double orginy) {
		this.orginy = orginy;
	}

	public String getUsid() {
		return this.usid;
	}

	public void setUsid(String usid) {
		this.usid = usid;
	}
	public String getOriginAddr() {
		return this.originAddr;
	}

	public void setOriginAddr(String originAddr) {
		this.originAddr = originAddr;
	}
	public String getOriginRoad() {
		return this.originRoad;
	}

	public void setOriginRoad(String originRoad) {
		this.originRoad = originRoad;
	}
	
	public String getOriginAttrOne() {
		return this.originAttrOne;
	}

	public void setOriginAttrOne(String originAttrOne) {
		this.originAttrOne = originAttrOne;
	}
	public String getOriginAttrTwo() {
		return this.originAttrTwo;
	}

	public void setOriginAttrTwo(String originAttrTwo) {
		this.originAttrTwo = originAttrTwo;
	}
	public String getOriginAttrThree() {
		return this.originAttrThree;
	}

	public void setOriginAttrThree(String originAttrThree) {
		this.originAttrThree = originAttrThree;
	}
	public String getOriginAttrFour() {
		return this.originAttrFour;
	}

	public void setOriginAttrFour(String originAttrFour) {
		this.originAttrFour = originAttrFour;
	}
	public String getOriginAttrFive() {
		return this.originAttrFive;
	}

	public void setOriginAttrFive(String originAttrFive) {
		this.originAttrFive = originAttrFive;
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
	public String getCheckstate() {
		return this.checkstate;
	}

	public void setCheckstate(String checkstate) {
		this.checkstate = checkstate;
	}
	public String getCheckPersonId() {
		return this.checkPersonId;
	}

	public void setCheckPersonId(String checkPersonId) {
		this.checkPersonId = checkPersonId;
	}
	public String getCheckPerson() {
		return this.checkPerson;
	}

	public void setCheckPerson(String checkPerson) {
		this.checkPerson = checkPerson;
	}
	public Date getCheckTime() {
		return this.checkTime;
	}

	public void setCheckTime(Date checkTime) {
		this.checkTime = checkTime;
	}
	public String getCheckDesription() {
		return this.checkDesription;
	}

	public void setCheckDesription(String checkDesription) {
		this.checkDesription = checkDesription;
	}
	public String getCheckType() {
		return this.checkType;
	}

	public void setCheckType(String checkType) {
		this.checkType = checkType;
	}

	public String getIsDelete() {
		return isDelete;
	}

	public void setIsDelete(String isDelete) {
		this.isDelete = isDelete;
	}

	public String getPersonUserId() {
		return personUserId;
	}

	public void setPersonUserId(String personUserId) {
		this.personUserId = personUserId;
	}

	public String getPhoneBrand() {
		return phoneBrand;
	}

	public void setPhoneBrand(String phoneBrand) {
		this.phoneBrand = phoneBrand;
	}

	

	public String getPcode() {
		return pcode;
	}

	public void setPcode(String pcode) {
		this.pcode = pcode;
	}

	public String getChildCode() {
		return childCode;
	}

	public void setChildCode(String childCode) {
		this.childCode = childCode;
	}

	public String getCityVillage() {
		return cityVillage;
	}

	public void setCityVillage(String cityVillage) {
		this.cityVillage = cityVillage;
	}

}