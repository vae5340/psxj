package com.augurit.awater.bpm.xcyh.report.web.form;

import com.alibaba.fastjson.JSONArray;

public class DetailDataForm {
	private String taskInstId; /* 任务实例ID */
	private String eventState; /* 事件当前状态，0处理中，1已办结，若状态为已办结，则当前节点名称和当前处理人应为空 */
	private String curNode; /* 当前节点名称 */
	private String curNodeName;
	private String curOpLoginName; /* 当前处理人 */
	private DetailEventForm event;

	private JSONArray opinion;
	private JSONArray nextlink;

	private String isRetrieve;// 是否可以撤回
	private String isDeleteTask;// 是否可以删除流程
	private String isEditAble;//是否可以编辑
	

	private String state;//active、ended流程状态

	public String getIsEditAble() {
		return isEditAble;
	}
	
	public void setIsEditAble(String isEditAble) {
		this.isEditAble = isEditAble;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getIsRetrieve() {
		return isRetrieve;
	}

	public void setIsRetrieve(String isRetrieve) {
		this.isRetrieve = isRetrieve;
	}

	public String getIsDeleteTask() {
		return isDeleteTask;
	}

	public void setIsDeleteTask(String isDeleteTask) {
		this.isDeleteTask = isDeleteTask;
	}

	public String getCurNodeName() {
		return curNodeName;
	}

	public void setCurNodeName(String curNodeName) {
		this.curNodeName = curNodeName;
	}

	public String getTaskInstId() {
		return taskInstId;
	}

	public void setTaskInstId(String taskInstId) {
		this.taskInstId = taskInstId;
	}

	public String getEventState() {
		return eventState;
	}

	public void setEventState(String eventState) {
		this.eventState = eventState;
	}

	public String getCurNode() {
		return curNode;
	}

	public void setCurNode(String curNode) {
		this.curNode = curNode;
	}

	public String getCurOpLoginName() {
		return curOpLoginName;
	}

	public void setCurOpLoginName(String curOpLoginName) {
		this.curOpLoginName = curOpLoginName;
	}

	public DetailEventForm getEvent() {
		return event;
	}

	public void setEvent(DetailEventForm event) {
		this.event = event;
	}

	public JSONArray getOpinion() {
		return opinion;
	}

	public void setOpinion(JSONArray opinion) {
		this.opinion = opinion;
	}

	public JSONArray getNextlink() {
		return nextlink;
	}

	public void setNextlink(JSONArray nextlink) {
		this.nextlink = nextlink;
	}

}
