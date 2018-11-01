package com.augurit.awater.bpm.message;

import java.util.Date;

public class ShortmessageRecordForm {
	// 属性
	private Long id;
	private String content;
	private String result;
	private String errmsg;
	private String sid;
	private String ext;
	private String fee;
	private String sendPerson;
	private String receivePerson;
	private String phone;
	private Date sendDate;
	private String taskInstDbid;
	private String templateCode;
	private String templateName;
	private String activityName;
	private String activityChineseName;
	
	private Date sendDate1;
	private Date sendDate2;
	private Long modelid;
	private Long masterEntityKey;
	
	public Long getMasterEntityKey() {
		return masterEntityKey;
	}

	public void setMasterEntityKey(Long masterEntityKey) {
		this.masterEntityKey = masterEntityKey;
	}

	public Long getModelid() {
		return modelid;
	}

	public void setModelid(Long modelid) {
		this.modelid = modelid;
	}

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	public String getContent() {
		return this.content;
	}

	public void setContent(String content) {
		this.content = content;
	}
	public String getResult() {
		return this.result;
	}

	public void setResult(String result) {
		this.result = result;
	}
	public String getErrmsg() {
		return this.errmsg;
	}

	public void setErrmsg(String errmsg) {
		this.errmsg = errmsg;
	}
	public String getSid() {
		return this.sid;
	}

	public void setSid(String sid) {
		this.sid = sid;
	}
	public String getExt() {
		return this.ext;
	}

	public void setExt(String ext) {
		this.ext = ext;
	}
	public String getFee() {
		return this.fee;
	}

	public void setFee(String fee) {
		this.fee = fee;
	}
	public String getSendPerson() {
		return this.sendPerson;
	}

	public void setSendPerson(String sendPerson) {
		this.sendPerson = sendPerson;
	}
	public String getReceivePerson() {
		return this.receivePerson;
	}

	public void setReceivePerson(String receivePerson) {
		this.receivePerson = receivePerson;
	}
	public String getPhone() {
		return this.phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}
	public Date getSendDate() {
		return this.sendDate;
	}

	public void setSendDate(Date sendDate) {
		this.sendDate = sendDate;
	}
	public String getTaskInstDbid() {
		return this.taskInstDbid;
	}

	public void setTaskInstDbid(String taskInstDbid) {
		this.taskInstDbid = taskInstDbid;
	}
	public String getTemplateCode() {
		return this.templateCode;
	}

	public void setTemplateCode(String templateCode) {
		this.templateCode = templateCode;
	}
	public String getTemplateName() {
		return this.templateName;
	}

	public void setTemplateName(String templateName) {
		this.templateName = templateName;
	}
	public String getActivityName() {
		return this.activityName;
	}

	public void setActivityName(String activityName) {
		this.activityName = activityName;
	}
	public String getActivityChineseName() {
		return this.activityChineseName;
	}

	public void setActivityChineseName(String activityChineseName) {
		this.activityChineseName = activityChineseName;
	}

	public Date getSendDate1() {
		return sendDate1;
	}

	public void setSendDate1(Date sendDate1) {
		this.sendDate1 = sendDate1;
	}

	public Date getSendDate2() {
		return sendDate2;
	}

	public void setSendDate2(Date sendDate2) {
		this.sendDate2 = sendDate2;
	}
	
}