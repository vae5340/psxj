package com.augurit.awater.bpm.xcyh.reassign.domain;

import org.springframework.format.annotation.DateTimeFormat;

import java.sql.Timestamp;

public class ReassignProcess implements java.io.Serializable {
	
	private String id;
	
	private String taskId;
	
	private String assignee;
	
	private String assigneeName;
	
	private String taskName;

	private String reassign;
	
	private String reassignName;
	
	private String reassignComments;
	@DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
	private Timestamp reasSignTime;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public String getAssignee() {
		return assignee;
	}

	public void setAssignee(String assignee) {
		this.assignee = assignee;
	}

	public String getAssigneeName() {
		return assigneeName;
	}

	public void setAssigneeName(String assigneeName) {
		this.assigneeName = assigneeName;
	}

	public String getTaskName() {
		return taskName;
	}

	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}

	public String getReassign() {
		return reassign;
	}

	public void setReassign(String reassign) {
		this.reassign = reassign;
	}

	public String getReassignName() {
		return reassignName;
	}

	public void setReassignName(String reassignName) {
		this.reassignName = reassignName;
	}

	public String getReassignComments() {
		return reassignComments;
	}

	public void setReassignComments(String reassignComments) {
		this.reassignComments = reassignComments;
	}

	public Timestamp getReasSignTime() {
		return reasSignTime;
	}

	public void setReasSignTime(Timestamp reasSignTime) {
		this.reasSignTime = reasSignTime;
	}
}