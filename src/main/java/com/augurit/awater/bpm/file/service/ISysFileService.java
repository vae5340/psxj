package com.augurit.awater.bpm.file.service;

import com.augurit.awater.bpm.file.web.form.SysFileForm;
import com.augurit.awater.common.page.Page;

import java.util.List;


public interface ISysFileService {
    SysFileForm getSysFile(Long var1);

    List<SysFileForm> getActiveStartImg();

    List<SysFileForm> getSysFiles(Long... var1);

    List<String> getAllEntity();

    List<SysFileForm> getAllSysFiles();

    List<SysFileForm> getSysFilesByEntityAndEntityId(String var1, String var2);

    Page<SysFileForm> search(Page<SysFileForm> page, SysFileForm form);

    Page<SysFileForm> searchImg(Page<SysFileForm> page, SysFileForm form);

    void saveSysFile(SysFileForm var1, String var2);

    void saveSysFile(SysFileForm form, String userName,boolean updateStartImg);

    void saveSysFile(SysFileForm... var1);

    void deleteSysFile(Long... var1);

    void deleteSysFilesByEntityAndEntityId(String var1, String var2);

    void deleteCascade(Long... var1);

    void deleteCascade(SysFileForm... var1);

    boolean existSysFile(String var1);

    int getSysFileCount(String var1, String var2);

    List<SysFileForm> getSysFilesByEntityAndEntityId(String var1, String var2, String var3);

    List<SysFileForm> getSysFilesByEntityAndEntityId(String var1, String var2, String var3, String var4);

//    List<AppPictureForm> getAppPictureList(String baseURL);
    
    /**
     *根据fileName排序查询
     * */
 
    public List<SysFileForm> getByEnAndEnIdOrderByFN(String entity, String entityId) ;

}
