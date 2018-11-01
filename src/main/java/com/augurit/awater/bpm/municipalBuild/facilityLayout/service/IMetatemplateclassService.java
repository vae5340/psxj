package com.augurit.awater.bpm.municipalBuild.facilityLayout.service;

import com.augurit.awater.bpm.common.service.ICrudService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metatemplateclass;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetatemplateclassForm;
import com.augurit.awater.common.Tree;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface IMetatemplateclassService extends ICrudService<MetatemplateclassForm, Long> {
    public List getMetatemplateclassData(HttpServletRequest request);

    public boolean saveMetatemplateclassData(HttpServletRequest request);

    public boolean delMetatemplateclassData(HttpServletRequest request);

    public List<Tree> getMetatemplateclassTree();

    public boolean delMetaclasspropertyData(HttpServletRequest request);

    public List<Metatemplateclass> getMetatemplateclassList(HttpServletRequest request);
}