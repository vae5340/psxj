package com.augurit.awater.bpm.municipalBuild.facilityLayout.service;

import com.augurit.awater.bpm.common.service.ICrudService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetadatacategoryForm;
import com.augurit.awater.common.Tree;

import java.util.List;


import javax.servlet.http.HttpServletRequest;

public interface IMetadatacategoryService extends ICrudService<MetadatacategoryForm, Long> {

    public List<Tree> getMetadatacategoryTree(int rootid);
    public boolean saveMetadatacategoryData(HttpServletRequest request);
    public List<MetadatacategoryForm>  getMetadatacategoryData(HttpServletRequest request);
    public boolean delMetadatacategoryData(HttpServletRequest request);
}