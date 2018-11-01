package com.augurit.awater.bpm.xcyhLayout.service;

import com.augurit.awater.bpm.common.service.ICrudService;
import com.augurit.awater.bpm.xcyhLayout.web.form.WfTemplateViewFieldRefForm;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface IWfTemplateViewFieldRefService extends ICrudService<WfTemplateViewFieldRefForm, Long> {
    List getWfTemplateViewFieldRefData(HttpServletRequest request);
    boolean saveWfTemplateViewFieldRefData(HttpServletRequest request);
    boolean deleteWfTemplateViewFieldRefData(HttpServletRequest request);
}