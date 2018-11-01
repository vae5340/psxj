package com.augurit.awater.psemgy.urgentMsg.form;

import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
public class DriUrgentMsgForm {

    private String id;
    private String iconUrl;
    private String title;
    private String content;
    private Date time;
    private Boolean isRead;
    private Boolean isReply;
    private String repaly; //已回复消息串
    private String create;//消息发起人
    private String loginName;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public Boolean getRead() {
        return isRead;
    }

    public void setRead(Boolean read) {
        isRead = read;
    }

    public Boolean getReply() {
        return isReply;
    }

    public void setReply(Boolean reply) {
        isReply = reply;
    }

    public String getRepaly() {
        return repaly;
    }

    public void setRepaly(String repaly) {
        this.repaly = repaly;
    }

    public String getCreate() {
        return create;
    }

    public void setCreate(String create) {
        this.create = create;
    }

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }
}
