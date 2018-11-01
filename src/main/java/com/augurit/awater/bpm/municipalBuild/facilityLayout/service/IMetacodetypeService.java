package com.augurit.awater.bpm.municipalBuild.facilityLayout.service;


import com.augurit.awater.bpm.common.service.ICrudService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metacodeitem;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metacodetype;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetacodetypeForm;
import com.augurit.awater.common.Tree;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface IMetacodetypeService extends ICrudService<MetacodetypeForm, Long> {
    List<Tree> getMetadictionaryTree();

    List getMetadictionaryData(String id);

    boolean saveMetadictionaryData(HttpServletRequest request);

    /**
     * 根据字典类型id删除字典数据
     * @param request
     * @return
     */
    boolean delMetadictionaryData(HttpServletRequest request);

    /**
     * 根据字典项id删除数据字典项
     * @param request
     * @return
     */
    boolean delMetaCodeitemData(HttpServletRequest request);

    /**
     * 根据字典类型编码获取字典项
     * @param typecode
     * @return
     */
    List<Metacodeitem> getDicdataByTypecode(String typecode);

    Metacodeitem getMetacodeitemByTypeCodeAndCode(String typecode, String code);

    /**
     *
     *根据字典类型编码获取字典信息
     * @param typecode
     * @return
     */
    Metacodetype getMetacodetypeBytypecode(String typecode);

    /**
     * 根据字典类型编码用like方式获取字典信息
     *
     * @param typecode
     * @return
     */
    List<Metacodetype> getMetacodetypeListBytypecode(String typecode);
}