package com.augurit.awater.bpm.sggc.web.form;

import com.augurit.agcloud.bsc.domain.BscAttForm;
import com.augurit.awater.bpm.xcyh.report.web.form.DetailFilesForm;

import java.util.List;

public class GxSggcLogForm {
	// 属性
	private Long id;
	private String lx;
	private String username;
	private Long time;
	private String content;
	private String sgjd;
	private String sjid;
	private String loginname;
	
	private String opUser;
	private String opUserPhone;
	private String linkName;
	private String opinion;
	private String nextOpUser;
	private String nextOpUserPhone;
	private String reassignComments;

	public String getLoginname() {
		return loginname;
	}

	public void setLoginname(String loginname) {
		this.loginname = loginname;
	}
	
	public String getReassignComments() {
		return reassignComments;
	}

	public void setReassignComments(String reassignComments) {
		this.reassignComments = reassignComments;
	}

	public String getNextOpUser() {
		return nextOpUser;
	}

	public void setNextOpUser(String nextOpUser) {
		this.nextOpUser = nextOpUser;
	}

	public String getNextOpUserPhone() {
		return nextOpUserPhone;
	}

	public void setNextOpUserPhone(String nextOpUserPhone) {
		this.nextOpUserPhone = nextOpUserPhone;
	}

	public String getOpUser() {
		return opUser;
	}

	public void setOpUser(String opUser) {
		this.opUser = opUser;
	}

	public String getOpUserPhone() {
		return opUserPhone;
	}

	public void setOpUserPhone(String opUserPhone) {
		this.opUserPhone = opUserPhone;
	}

	public String getLinkName() {
		return linkName;
	}

	public void setLinkName(String linkName) {
		this.linkName = linkName;
	}

	public String getOpinion() {
		return opinion;
	}

	public void setOpinion(String opinion) {
		this.opinion = opinion;
	}

	private List<BscAttForm> files;
	private List<DetailFilesForm> attFiles;

	public List<DetailFilesForm> getAttFiles() {
		return attFiles;
	}

	public void setAttFiles(List<DetailFilesForm> attFiles) {
		this.attFiles = attFiles;
	}

	public List<BscAttForm> getFiles() {
		return files;
	}

	public void setFiles(List<BscAttForm> files) {
		this.files = files;
	}

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	public String getLx() {
		return this.lx;
	}

	public void setLx(String lx) {
		this.lx = lx;
	}
	public String getUsername() {
		return this.username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
	public Long getTime() {
		return this.time;
	}

	public void setTime(Long time) {
		this.time = time;
	}
	public String getContent() {
		return this.content;
	}

	public void setContent(String content) {
		this.content = content;
	}
	public String getSgjd() {
		return this.sgjd;
	}

	public void setSgjd(String sgjd) {
		this.sgjd = sgjd;
	}
	public String getSjid() {
		return this.sjid;
	}

	public void setSjid(String sjid) {
		this.sjid = sjid;
	}
}