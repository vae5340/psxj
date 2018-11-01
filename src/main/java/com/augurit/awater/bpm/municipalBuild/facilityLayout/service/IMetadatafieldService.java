package com.augurit.awater.bpm.municipalBuild.facilityLayout.service;

import com.augurit.awater.bpm.common.service.ICrudService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metadatafield;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetadatafieldForm;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface IMetadatafieldService extends ICrudService<MetadatafieldForm, Long> {
    public List getMetadatafieldData(HttpServletRequest request);
    public List getMetacodetypeData(HttpServletRequest request);
    public boolean saveFieldAttribute(HttpServletRequest request);
    public List getMetaCodeItem(HttpServletRequest request);

    /**
     * 根据表名称获取表字段信息
     * @param tablename 表名称
     * @return
     */
    List<Metadatafield> getTableFieldsByTablename(String tablename);

    List<Metadatafield> getTableFieldsByTableid(String tableid);

    /**
     * 根据表状态表示获取表字段信息
     * @param tablestatecode 表状态标识
     * @return
     */
    List<Metadatafield> getTableFieldsByTablestatecode(String tablestatecode);

    /**
     * 根据类名称和属性名称获取表字段信息
     * @param templateclassname 类名称
     * @param classpropertyname 属性名称
     * @return
     */
    List<Metadatafield> getFieldNameByTemplateclassnameAndClasspropertyname(String templateclassname, String classpropertyname);
}