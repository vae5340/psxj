package com.augurit.awater.bpm.municipalBuild.facilityLayout.service;

import com.augurit.awater.bpm.common.service.ICrudService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.TemplateForm;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface ITemplateService extends ICrudService<TemplateForm, Long> {
   // public String getTemplateData(HttpServletRequest request);
   public List<TemplateForm> getTemplateData(HttpServletRequest request);
    public String saveTemplateData(TemplateForm form, HttpServletRequest request);
    public void searchInusedData(String num);
    public boolean deleteTemplateData(HttpServletRequest request);
}