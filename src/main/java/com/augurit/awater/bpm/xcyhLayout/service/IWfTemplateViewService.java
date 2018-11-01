package com.augurit.awater.bpm.xcyhLayout.service;


import com.augurit.awater.bpm.common.entity.WfBusTemplate;
import com.augurit.awater.bpm.common.service.ICrudService;
import com.augurit.awater.bpm.xcyhLayout.entity.WfTemplateView;
import com.augurit.awater.bpm.xcyhLayout.web.form.WfTemplateViewForm;
import com.augurit.awater.common.Tree;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface IWfTemplateViewService extends ICrudService<WfTemplateViewForm, Long> {
    public List<Tree> getWfTemplateViewTree(int rootid, HttpServletRequest request);
    public List<WfBusTemplate> getWfBusTemplateData();
    public List<WfTemplateView> getWfTemplateViewData(HttpServletRequest request);
    public List getFields(HttpServletRequest request);
    public boolean saveWfTemplateViewData(HttpServletRequest request);
    public boolean delWftemplateviewData(HttpServletRequest request);
}