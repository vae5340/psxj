package com.augurit.awater.dri.psh.discharge.web.form;

import java.util.Date;

public class PshDischargerForm {
	// 属性
	private Long id;//
	private String doorplateAddressCode;//门牌号id
	private String houseIdFlag;//房间栋或房间套id标识
	private String houseId;//房屋栋或套id
	private String markPersonId;//上报人ID
	private String markPerson;//上报人名称
	private Date markTime;//上报时间
	private String addr;//地址
	private String area;//区
	private String town;//乡镇街道
	private String village;//社区居委
	private String street;//街路巷名称
	private String mph;//门牌号
	private String name;//排水户名称
	private String psdy;//排水单元分区
	private String fqname;//分区名称
	private String jzwcode;//所属建筑物编号
	private Double volume;//月均用水量
	private String owner;//产权人
	private String ownerTele;//产权人联系电话
	private String operator;//经营人
	private String operatorTele;//经营人联系电话
	private String hasCert1;//是否有工商营业执照
	private String cert1Code;//工商执照代码
	private String hasCert2;//是否有接驳核准意见书
	private String hasCert3;//是否有排水许可证
	private String cert3Code;//排水许可证代码
	private String hasCert4;//是否有排污许可证
	private String cert4Code;//排污许可证代码
	private String dischargerType1;//行业类别大类：
	private String dischargerType2;//行业类别小类
	private String fac1;//是否有隔油池
	private String fac1Cont;///隔油池运行情况
	private String fac1Main;//隔油池是否进行保养
	private String fac1Record;//隔油池是否有养护记录
	private String fac2;//是否有格栅
	private String fac2Cont;//格栅运行情况
	private String fac2Main;//格栅是否进行保养
	private String fac2Record;//格栅是否有养护记录
	private String fac3;//是否有沉淀池
	private String fac3Cont;///沉淀池运行情况
	private String fac3Main;//沉淀池是否进行保养
	private String fac3Record;//沉淀池是否有养护记录
	private String fac4;//预处理设施名称
	private String fac4Cont;//沉淀池运行情况
	private String fac4Main;//沉淀池是否进行保养
	private String fac4Record;//沉淀池是否有养护记录
	private String state;//
	private String checkPersonId;
	private String checkPerson;
	private Date checkTime;
	private String checkDesription;
	
	private String loginName;
	private String directOrgId;
	private String directOrgName;
	private String teamOrgId;
	private String teamOrgName;
	private String parentOrgId;
	private String parentOrgName;
	
	private String  unitId;
	private Double x;
	private Double y;
	private String description;
	private Date updateTime;
	private String kjArea;
	private String kjTown;
	private String kjVillage;
	
	public String getKjArea() {
		return kjArea;
	}

	public void setKjArea(String kjArea) {
		this.kjArea = kjArea;
	}

	public String getKjTown() {
		return kjTown;
	}

	public void setKjTown(String kjTown) {
		this.kjTown = kjTown;
	}

	public String getKjVillage() {
		return kjVillage;
	}

	public void setKjVillage(String kjVillage) {
		this.kjVillage = kjVillage;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

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

	public String getUnitId() {
		return unitId;
	}

	public void setUnitId(String unitId) {
		this.unitId = unitId;
	}

	public String getLoginName() {
		return loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	public String getDirectOrgId() {
		return directOrgId;
	}

	public void setDirectOrgId(String directOrgId) {
		this.directOrgId = directOrgId;
	}

	public String getDirectOrgName() {
		return directOrgName;
	}

	public void setDirectOrgName(String directOrgName) {
		this.directOrgName = directOrgName;
	}

	public String getTeamOrgId() {
		return teamOrgId;
	}

	public void setTeamOrgId(String teamOrgId) {
		this.teamOrgId = teamOrgId;
	}

	public String getTeamOrgName() {
		return teamOrgName;
	}

	public void setTeamOrgName(String teamOrgName) {
		this.teamOrgName = teamOrgName;
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

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	public String getDoorplateAddressCode() {
		return this.doorplateAddressCode;
	}

	public void setDoorplateAddressCode(String doorplateAddressCode) {
		this.doorplateAddressCode = doorplateAddressCode;
	}
	public String getHouseIdFlag() {
		return this.houseIdFlag;
	}

	public void setHouseIdFlag(String houseIdFlag) {
		this.houseIdFlag = houseIdFlag;
	}
	public String getHouseId() {
		return this.houseId;
	}

	public void setHouseId(String houseId) {
		this.houseId = houseId;
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
	public String getAddr() {
		return this.addr;
	}

	public void setAddr(String addr) {
		this.addr = addr;
	}
	public String getArea() {
		return this.area;
	}

	public void setArea(String area) {
		this.area = area;
	}
	public String getTown() {
		return this.town;
	}

	public void setTown(String town) {
		this.town = town;
	}
	public String getVillage() {
		return this.village;
	}

	public void setVillage(String village) {
		this.village = village;
	}
	public String getStreet() {
		return this.street;
	}

	public void setStreet(String street) {
		this.street = street;
	}
	public String getMph() {
		return this.mph;
	}

	public void setMph(String mph) {
		this.mph = mph;
	}
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}
	public String getPsdy() {
		return this.psdy;
	}

	public void setPsdy(String psdy) {
		this.psdy = psdy;
	}
	public String getFqname() {
		return this.fqname;
	}

	public void setFqname(String fqname) {
		this.fqname = fqname;
	}
	public String getJzwcode() {
		return this.jzwcode;
	}

	public void setJzwcode(String jzwcode) {
		this.jzwcode = jzwcode;
	}
	public Double getVolume() {
		return this.volume;
	}

	public void setVolume(Double volume) {
		this.volume = volume;
	}
	public String getOwner() {
		return this.owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}
	public String getOwnerTele() {
		return this.ownerTele;
	}

	public void setOwnerTele(String ownerTele) {
		this.ownerTele = ownerTele;
	}
	public String getOperator() {
		return this.operator;
	}

	public void setOperator(String operator) {
		this.operator = operator;
	}
	public String getOperatorTele() {
		return this.operatorTele;
	}

	public void setOperatorTele(String operatorTele) {
		this.operatorTele = operatorTele;
	}
	public String getHasCert1() {
		return this.hasCert1;
	}

	public void setHasCert1(String hasCert1) {
		this.hasCert1 = hasCert1;
	}
	public String getCert1Code() {
		return this.cert1Code;
	}

	public void setCert1Code(String cert1Code) {
		this.cert1Code = cert1Code;
	}
	public String getHasCert2() {
		return this.hasCert2;
	}

	public void setHasCert2(String hasCert2) {
		this.hasCert2 = hasCert2;
	}
	public String getHasCert3() {
		return this.hasCert3;
	}

	public void setHasCert3(String hasCert3) {
		this.hasCert3 = hasCert3;
	}
	public String getCert3Code() {
		return this.cert3Code;
	}

	public void setCert3Code(String cert3Code) {
		this.cert3Code = cert3Code;
	}
	public String getHasCert4() {
		return this.hasCert4;
	}

	public void setHasCert4(String hasCert4) {
		this.hasCert4 = hasCert4;
	}
	public String getCert4Code() {
		return this.cert4Code;
	}

	public void setCert4Code(String cert4Code) {
		this.cert4Code = cert4Code;
	}
	public String getDischargerType1() {
		return this.dischargerType1;
	}

	public void setDischargerType1(String dischargerType1) {
		this.dischargerType1 = dischargerType1;
	}
	public String getDischargerType2() {
		return this.dischargerType2;
	}

	public void setDischargerType2(String dischargerType2) {
		this.dischargerType2 = dischargerType2;
	}
	public String getFac1() {
		return this.fac1;
	}

	public void setFac1(String fac1) {
		this.fac1 = fac1;
	}
	public String getFac1Cont() {
		return this.fac1Cont;
	}

	public void setFac1Cont(String fac1Cont) {
		this.fac1Cont = fac1Cont;
	}
	public String getFac1Main() {
		return this.fac1Main;
	}

	public void setFac1Main(String fac1Main) {
		this.fac1Main = fac1Main;
	}
	public String getFac1Record() {
		return this.fac1Record;
	}

	public void setFac1Record(String fac1Record) {
		this.fac1Record = fac1Record;
	}
	public String getFac2() {
		return this.fac2;
	}

	public void setFac2(String fac2) {
		this.fac2 = fac2;
	}
	public String getFac2Cont() {
		return this.fac2Cont;
	}

	public void setFac2Cont(String fac2Cont) {
		this.fac2Cont = fac2Cont;
	}
	public String getFac2Main() {
		return this.fac2Main;
	}

	public void setFac2Main(String fac2Main) {
		this.fac2Main = fac2Main;
	}
	public String getFac2Record() {
		return this.fac2Record;
	}

	public void setFac2Record(String fac2Record) {
		this.fac2Record = fac2Record;
	}
	public String getFac3() {
		return this.fac3;
	}

	public void setFac3(String fac3) {
		this.fac3 = fac3;
	}
	public String getFac3Cont() {
		return this.fac3Cont;
	}

	public void setFac3Cont(String fac3Cont) {
		this.fac3Cont = fac3Cont;
	}
	public String getFac3Main() {
		return this.fac3Main;
	}

	public void setFac3Main(String fac3Main) {
		this.fac3Main = fac3Main;
	}
	public String getFac3Record() {
		return this.fac3Record;
	}

	public void setFac3Record(String fac3Record) {
		this.fac3Record = fac3Record;
	}
	public String getFac4() {
		return this.fac4;
	}

	public void setFac4(String fac4) {
		this.fac4 = fac4;
	}
	public String getFac4Cont() {
		return this.fac4Cont;
	}

	public void setFac4Cont(String fac4Cont) {
		this.fac4Cont = fac4Cont;
	}
	public String getFac4Main() {
		return this.fac4Main;
	}

	public void setFac4Main(String fac4Main) {
		this.fac4Main = fac4Main;
	}
	public String getFac4Record() {
		return this.fac4Record;
	}

	public void setFac4Record(String fac4Record) {
		this.fac4Record = fac4Record;
	}
	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
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
}