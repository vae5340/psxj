package com.augurit.awater.bpm.file.dao;


import java.util.Date;

import com.augurit.awater.bpm.file.convert.SysFileConverter;
import com.augurit.awater.bpm.file.entity.SysFile;
import com.augurit.awater.bpm.file.entity.SysFileLink;
import com.augurit.awater.bpm.file.web.form.SysFileForm;
import com.augurit.awater.common.hibernate.dao.BaseDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class SysFileDao extends BaseDao<SysFile, Long> {
    @Autowired
    private SysFileLinkDao sysFileLinkDao;

    public SysFileDao() {
    }

    public SysFileForm getForm(Long id) {
        SysFileForm form = null;
        if (id != null) {
            SysFile entity = (SysFile)this.get(id);
            if (entity != null) {
                form = SysFileConverter.convertToForm(entity);
                SysFileLink link = this.sysFileLinkDao.getBySysFileId(id);
                if (link != null) {
                    form.setEntity(link.getEntity());
                    form.setEntityId(link.getEntityId());
                }
            }
        }

        return form;
    }

    public void save(SysFileForm form, String userName) {
        if (form != null) {
            SysFile entity = null;
            if (form != null && form.getSysFileId() != null) {
                if (userName != null && userName.trim().length() > 0) {
                    form.setEemp(userName);
                    form.setEdt(new Date());
                }

                entity = (SysFile)this.get(form.getSysFileId());
                this.sysFileLinkDao.changeEntityInfo(entity.getSysFileId(), form.getEntity(), form.getEntityId());
                SysFileConverter.convert(form, entity);
                super.save(entity);
            } else {
                if (userName != null && userName.trim().length() > 0) {
                    form.setCmp(userName);
                    form.setCdt(new Date());
                }

                entity = new SysFile();
                SysFileConverter.convert(form, entity);
                super.save(entity);
                this.sysFileLinkDao.add(form.getEntity(), form.getEntityId(), entity.getSysFileId(), (String)null);
            }

            form.setSysFileId(entity.getSysFileId());
        }

    }
}
