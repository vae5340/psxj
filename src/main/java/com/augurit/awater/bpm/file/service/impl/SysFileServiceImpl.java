package com.augurit.awater.bpm.file.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import com.augurit.agcloud.framework.util.CollectionUtils;
import com.augurit.awater.bpm.file.convert.SysFileConverter;
import com.augurit.awater.bpm.file.dao.SysFileDao;
import com.augurit.awater.bpm.file.dao.SysFileLinkDao;
import com.augurit.awater.bpm.file.entity.SysFile;
import com.augurit.awater.bpm.file.entity.SysFileLink;
import com.augurit.awater.bpm.file.service.ISysFileService;
import com.augurit.awater.bpm.file.web.form.SysFileForm;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.util.file.PageUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SysFileServiceImpl implements ISysFileService {
    private static final String GET_BY_ENTITY = "select file from SysFile file, SysFileLink link where file.sysFileId=link.sysFileId and link.entity=? and link.entityId=? ";
    @Autowired
    private SysFileDao sysFileDao;
    @Autowired
    private SysFileLinkDao sysFileLinkDao;

    public SysFileServiceImpl() {
    }

    @Transactional(
            readOnly = true
    )
    public SysFileForm getSysFile(Long id) {
        return this.sysFileDao.getForm(id);
    }

    @Transactional(
            readOnly = true
    )
    public List<String> getAllEntity() {
        return this.sysFileLinkDao.getAllEntity();
    }

    @Transactional(
            readOnly = true
    )
    public List<SysFileForm> getAllSysFiles() {
        List<SysFile> list = this.sysFileDao.getAll();
        return SysFileConverter.convertToFormList(list);
    }

    @Transactional(
            readOnly = true
    )
    public List<SysFileForm> getSysFilesByEntityAndEntityId(String entity, String entityId) {
        return this.getByEntityAndEntityId(entity, entityId);
    }

    @Transactional(
            readOnly = true
    )
    public List<SysFileForm> getByEntityAndEntityId(String entity, String entityId) {
        if( entity != null && entity.trim().length() > 0 && entityId != null && entityId.trim().length() > 0 ) {
            return this.sysFileDao.find("select file from SysFile file, SysFileLink link where file.sysFileId=link.sysFileId and link.entity=? and link.entityId=? "
                    , new String[]{entity, entityId});
        }else
            return null;
    }

    @Override
    public Page<SysFileForm> search(Page<SysFileForm> page, SysFileForm form) {
        String hql = "select file, link.entity, link.entityId from SysFileLink link, SysFile file where link.sysFileId=file.sysFileId ";
        List<Object> values = new ArrayList();
        if (form != null) {
            if (StringUtils.isNotBlank(form.getFileCode())) {
                hql = hql + " and file.fileCode like ?";
                values.add("%" + form.getFileCode() + "%");
            }

            if (StringUtils.isNotBlank(form.getFileName())) {
                hql = hql + " and file.fileName like ?";
                values.add("%" + form.getFileName() + "%");
            }

            if (StringUtils.isNotBlank(form.getFileFormat())) {
                hql = hql + " and file.fileFormat = ?";
                values.add(form.getFileFormat());
            }

            if (StringUtils.isNotBlank(form.getEntity())) {
                hql = hql + " and link.entity like ?";
                values.add("%" + form.getEntity() + "%");
            }

            if (StringUtils.isNotBlank(form.getEntityId())) {
                hql = hql + " and link.entityId = ?";
                values.add(form.getEntityId());
            }
        }

        if (StringUtils.isNotBlank(page.getOrderBy())) {
            hql = hql + SysFileConverter.constructOrderBy(page.getOrderBy(), page.getOrderDir());
        }

        Page pg = this.sysFileDao.findPage(page, hql, values);
        PageUtils.copy(pg, SysFileConverter.pageResultConvertToFormList(pg), page);
        return page;
    }

//    @Override
    public Page<SysFileForm> searchImg(Page<SysFileForm> page, SysFileForm form) {
        StringBuilder hql = new StringBuilder("select file,'no','yes' from SysFile file ");
        List<Object> values = new ArrayList();
        hql.append(" where  file.fileType in(?,?)");
        //限定图片类型：头部展示图片、启动图片
        values.add("startImg");
        values.add("topImg");
        if (form != null) {

            if (StringUtils.isNotBlank(form.getFileType())) {
                hql.append( " and file.fileType = ?");
                values.add(form.getFileType() );
            }

            if (StringUtils.isNotBlank(form.getFileName())) {
                hql.append( " and file.fileName like ?");
                values.add("%" + form.getFileName() + "%");
            }

            if(StringUtils.isNotBlank(form.getMemo1())){
                hql.append(" and file.memo1 = ?");
                values.add(form.getMemo1());
            }

//            if (StringUtils.isNotBlank(form.getFileFormat())) {
//                hql = hql + " and file.fileFormat = ?";
//                values.add(form.getFileFormat());
//            }
        }

        if (StringUtils.isNotBlank(page.getOrderBy())) {
            hql.append( SysFileConverter.constructOrderBy(page.getOrderBy(), page.getOrderDir()));
        }

        Page pg = this.sysFileDao.findPage(page, hql.toString(), values);
        PageUtils.copy(pg, SysFileConverter.pageResultConvertToFormList(pg), page);
        return page;
    }

    public void saveSysFile(SysFileForm form, String userName) {
        this.sysFileDao.save(form, userName);
    }

    public void saveSysFile(SysFileForm form, String userName,boolean updateStartImg) {
        if(null!=form&&"startImg".equals(form.getFileType())&&"1".equals(form.getMemo1())){
            //将启用的启动图片设为禁用
            for(SysFileForm file:this.getActiveStartImg()){
                file.setMemo1("0");
                SysFile sysFile = new SysFile();
                SysFileConverter.convert(form, sysFile);
                this.sysFileDao.save(sysFile);
            }
        }
        this.sysFileDao.save(form, userName);
    }

    //只能有一个启用的启动图片
    @Transactional(readOnly = true)
    @Override
    public List<SysFileForm> getActiveStartImg() {
        String sql="select * from sys_file where file_type ='startImg' and memo1='1'";
        return sysFileDao.createSQLQuery(sql).addEntity(SysFile.class).list();

    }

    public void saveSysFile(SysFileForm... forms) {
        if (forms != null) {
            SysFileForm[] var5 = forms;
            int var4 = forms.length;

            for(int var3 = 0; var3 < var4; ++var3) {
                SysFileForm form = var5[var3];
                this.sysFileDao.save(form, (String)null);
            }
        }

    }

    public void deleteSysFile(Long... ids) {
        if (ids != null) {
            this.sysFileDao.delete(ids);
        }

    }

    public void deleteSysFilesByEntityAndEntityId(String entity, String entityId) {
        if (entity != null && entity.trim().length() > 0 && entityId != null && entityId.trim().length() > 0) {
            List<SysFileForm> list = this.getByEntityAndEntityId(entity, entityId);
            if (list != null && list.size() > 0) {
                Iterator var5 = list.iterator();

                while(var5.hasNext()) {
                    SysFile sysFile = (SysFile)var5.next();
                    this.deleteCascade(sysFile.getSysFileId());
                }
            }
        }

    }

    public void deleteCascade(Long... sysFileIds) {
        if (sysFileIds != null) {
            Long[] var5 = sysFileIds;
            int var4 = sysFileIds.length;

            for(int var3 = 0; var3 < var4; ++var3) {
                Long sysFileId = var5[var3];
                SysFileLink link = this.sysFileLinkDao.getBySysFileId(sysFileId);
                this.sysFileLinkDao.delete(link);
                this.deleteSysFile(sysFileId);
            }
        }
    }

    public void deleteCascade(SysFileForm... forms) {
        if (forms != null) {
            SysFileForm[] var5 = forms;
            int var4 = forms.length;

            for(int var3 = 0; var3 < var4; ++var3) {
                SysFileForm form = var5[var3];
                this.deleteCascade(form.getSysFileId());
            }
        }

    }

    @Transactional(
            readOnly = true
    )
    public boolean existSysFile(String fileCode) {
        boolean exist = false;
        if (fileCode != null && fileCode.trim().length() > 0) {
            List<SysFile> result = this.sysFileDao.findBy("fileCode", fileCode);
            if (result != null && result.size() > 0) {
                exist = true;
            }
        }

        return exist;
    }

    @Transactional(
            readOnly = true
    )
    public int getSysFileCount(String entity, String entityId) {
        Long[] sysFileIds = this.sysFileLinkDao.getSysFileIds(entity, entityId);
        return sysFileIds != null ? sysFileIds.length : 0;
    }

    @Transactional(
            readOnly = true
    )
    public List<SysFileForm> getSysFilesByEntityAndEntityId(String entity, String entityId, String sortClause) {
        if (entity != null && entity.trim().length() > 0 && entityId != null && entityId.trim().length() > 0 && sortClause != null && sortClause.trim().length() > 0) {
            String hql = "select file from SysFile file, SysFileLink link where file.sysFileId=link.sysFileId and link.entity=? and link.entityId=? " + sortClause;
            List<SysFile> list = this.sysFileDao.find(hql, new Object[]{entity, entityId});
            return SysFileConverter.convertToFormList(list);
        } else {
            return null;
        }
    }

    @Transactional(
            readOnly = true
    )
    public List<SysFileForm> getSysFilesByEntityAndEntityId(String entity, String entityId, String fileType, String sortClause) {
        if (entity != null && entity.trim().length() > 0 && entityId != null && entityId.trim().length() > 0 && sortClause != null && sortClause.trim().length() > 0) {
            String hql = "select file from SysFile file, SysFileLink link where file.sysFileId=link.sysFileId and link.entity=? and link.entityId=?  and file.fileType=? " + sortClause;
            List<SysFile> list = this.sysFileDao.find(hql, new Object[]{entity, entityId, fileType});
            return SysFileConverter.convertToFormList(list);
        } else {
            return null;
        }
    }

    public List<SysFileForm> getSysFiles(Long... ids) {
        List<SysFile> sysFiles = this.sysFileDao.get(CollectionUtils.toLongSet(Arrays.asList(ids)));
        return SysFileConverter.convertToFormList(sysFiles);
    }

//    @Override
//    public List<AppPictureForm> getAppPictureList(String baseURL) {
//        List<AppPictureForm> appPictureFormList=new ArrayList<>();
//        String sql="select * from sys_file where file_type in('topImg','startImg') and memo1='1' order by file_type asc,memo2 asc";
//        List<SysFile> results=sysFileDao.createSQLQuery(sql).addEntity(SysFile.class).list();
//        AppPictureForm appPictureForm;
//        StringBuilder tmpURL;
//        for(SysFile file:results){
//            appPictureForm=new AppPictureForm();
//            appPictureForm.setType("startImg".equals(file.getFileType())?0:"topImg".equals(file.getFileType())?1:-9999);
//            tmpURL=new StringBuilder();
//            if(null!=file.getFilePath()){
//                file.setFilePath(file.getFilePath().replace('\\','/'));
//            }
//            tmpURL.append(baseURL).append(file.getFilePath()).append("/").append(file.getFileName()).append(".").append(file.getFileFormat());
//            appPictureForm.setUrl(tmpURL.toString());
//            appPictureFormList.add(appPictureForm);
//        }
//        return appPictureFormList;
//    }
    
    /**
     *根据fileName排序查询
     * */
    @Transactional(
            readOnly = true
    )
    public List<SysFileForm> getByEnAndEnIdOrderByFN(String entity, String entityId) {
        if (entity != null && entity.trim().length() > 0 && entityId != null && entityId.trim().length() > 0) {
            String hql = "select file from SysFile file, SysFileLink link where file.sysFileId=link.sysFileId and link.entity=? and link.entityId=? order by substr(file.fileName,0,14)" ;
            List<SysFile> list = this.sysFileDao.find(hql, new Object[]{entity, entityId});
            return SysFileConverter.convertToFormList(list);
        } else {
            return null;
        }
    }
}
