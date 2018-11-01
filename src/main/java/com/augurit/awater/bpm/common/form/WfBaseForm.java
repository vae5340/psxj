package com.augurit.awater.bpm.common.form;

import com.alibaba.fastjson.JSONObject;
import com.augurit.agcloud.bpm.front.domain.IdEntity;
import com.common.util.Common;

public class WfBaseForm extends IdEntity {
    public Long id;
    public String json;
    public String templateCode;
    private boolean isNewForm;
    public String taskInstDbid = null;

    public WfBaseForm() {
        this.json = json;
        JSONObject o = JSONObject.parseObject(json);
        this.setTemplateCode(o.getString("templateCode"));
        this.setId(Common.checkLong(o.getString("id")));
        this.isNewForm = Common.isCheckNull(this.getId());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTemplateCode() {
        return this.templateCode;
    }

    public void setTemplateCode(String templateCode) {
        this.templateCode = templateCode;
    }

    public String getTaskInstDbid() {
        return this.taskInstDbid;
    }

    public void setTaskInstDbid(String taskInstDbid) {
        this.taskInstDbid = taskInstDbid;
    }

    public String getJson() {
        return this.json;
    }

    public void setJson(String json) {
        this.json = json;
    }


    @Override
    public String getBusId() {
        return null;
    }

    @Override
    public boolean isSupportSummary() {
        return false;
    }


}
