package com.augurit.awater.bpm.file.service;


import com.augurit.awater.bpm.common.service.ICrudService;
import com.augurit.awater.bpm.file.entity.SysFile;
import com.augurit.awater.bpm.file.entity.SysFileLink;
import com.augurit.awater.bpm.file.web.form.SysFileForm;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metacodeitem;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metadatatable;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetadatatableForm;
import com.augurit.awater.common.Tree;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.util.List;


public interface IDynamictableService extends ICrudService<MetadatatableForm, Long> {
    /**
     * 获取表单字段
     * @param request
     * @return
     */
    List getEditFormFields(HttpServletRequest request);
    /**
     * 获取列表数据
     * @param request
     * @return
     */

    /**
     * 保存表单数据
     * @param request
     * @return
     */
    String saveDynamictableData(HttpServletRequest request);

    /**
     * 删除表数据
     * @param request
     * @return
     */
    boolean deleteDynamictableData(HttpServletRequest request);

    List getDynamicTableData(HttpServletRequest request);

    /**
     * 获取导出Excel数据库数据
     * @param request
     * @return
     */
    public void getExportDynamicTableData(HttpServletRequest request,HttpServletResponse response) throws Exception;

    /**
     * 根据所属区域获取所在道路
     * @param request
     * @return
     */
    List getRoadNamesByRegionName(HttpServletRequest request);
    
    

    /**
     * 获取表字段标题分类数据
     * @param request
     * @return
     */
    List getTabs(HttpServletRequest request);


    /**
     * 保存文件信息
     * @param fileForm
     * @return
     */
    SysFile saveFileInfo(SysFileForm fileForm);

    /**
     * 保存文件关联表信息
     * @param tableid
     * @param tablename
     * @param systemfileId
     * @return
     */
    boolean saveFileLink(String tableid, String tablename, Long systemfileId);

    /**
     * 下载文件
     * @param sysFileId
     * @param response
     * @return
     */
//    String dowmLoadFile(String sysFileId, HttpServletResponse response);

    /**
     * 根据文件ID删除文件
     * @param sysFileIds
     * @return
     */
    boolean deleteFile(Long... sysFileIds);

    /**
     * 根据entityId和tablename获取其文件列表
     * @param entityId
     * @param tablename
     * @return
     */
    List loadFilelist(String entityId, String tablename,String tableid, HttpServletRequest request);

    /**
     * 判断该表单字段数据是否存在（唯一验证）
     * @param fieldName
     * @param fieldValue
     * @return
     */
    boolean queryValueIsExist(String tableid,String tablename,String fieldName, String fieldValue,String primarykeyData);

    /**
     * rest接口保存文件关联表信息
     * @param entity
     * @param entityId
     * @param systemfileId
     * @return
     */
//    boolean saveFileLink_rest(String entity, String entityId, Long systemfileId);

    /**
     * rest接口上传文件并保存关联表信息
     *
     * @param fileName 文件名，带后缀
     * @param fileByte 文件的byte[]
     * @param entity   行业表所在数据库用户+"."+行业表表名
     * @param entityId 工单编号
     * @return
     */
    void uploadFile(String fileName,byte[] fileByte,String entity,String entityId) throws Exception;

    /**
     * 根据表名获取表信息
     *
     * @param tableid
     * @return
     */
    Metadatatable getMetadatatableByTableid(String tableid);

    /**
     * 根据表名获取表信息
     *
     * @param tablename
     * @return
     */
    Metadatatable getMetadatatableByTablename(String tablename);

    /**
     * 根据字典类型编码以及父类字典项编码获取字典项列表
     * @param typecode
     * @param parenttypecode
     * @return
     */
    List<Metacodeitem> getRelatedDicitem(String typecode, String parenttypecode, String relatedFieldname, String tableid);

    /**
     * 获取管线参数配置树
     * @return
     */
    String gxGxcsTreeList();

    /**
     * 查询数据库是否存在该表结构
     * @param tablename
     * @return
     */
    boolean queTableExist(String tablename);

    public List<Tree> getMetadatatableTree(String rootid);
    
    /**
     * 查询数据库表视图
     * @return
     */

    public List<Tree> getMetadataViewTree(String rootid);

    /**
     * 根据表名与id查询SysFileLink
     * @param entity
     * @param entityId
     * @return
     */
    public List<SysFileLink> getSysFileLinkByEntityAndEntityId(String entity, String entityId);
    /**
     * 根据filecode与fileName删除SysFile
     * @param filecode
     * @param fileName
     * @return
     */
    public void deleteSysFileByCodeAndName(String filecode,String fileName);

}