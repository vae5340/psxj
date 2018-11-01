package com.augurit.awater.bpm.file.dao;

import java.util.List;

import com.augurit.agcloud.framework.util.CollectionUtils;
import com.augurit.awater.bpm.file.entity.SysFileLink;
import com.augurit.awater.common.hibernate.dao.BaseDao;
import org.springframework.stereotype.Repository;

@Repository
public class SysFileLinkDao extends BaseDao<SysFileLink, Long> {
    public SysFileLinkDao() {
    }

    public SysFileLink getBySysFileId(Long sysFileId) {
        return sysFileId != null ? (SysFileLink)this.findUniqueBy("sysFileId", sysFileId) : null;
    }

    public Long[] getSysFileIds(String entity, String entityId) {
        if (entity != null && entityId != null) {
            String hql = "select ps.sysFileId from SysFileLink ps where ps.entity=? and ps.entityId=?";
            List<Long> list = this.find(hql, new Object[]{entity, entityId});
            return CollectionUtils.toLongArray(list);
        } else {
            return null;
        }
    }

    public List<String> getAllEntity() {
        String hql = "select distinct(ps.entity) from SysFileLink ps";
        return this.find(hql, new Object[0]);
    }

    public SysFileLink add(String entity, String entityId, Long sysFileId, String memo) {
        if (sysFileId != null && entityId != null && entity != null && entity.trim().length() > 0) {
            SysFileLink link = new SysFileLink();
            link.setEntity(entity);
            link.setEntityId(entityId);
            link.setSysFileId(sysFileId);
            link.setMemo(memo);
            this.save(link);
            return link;
        } else {
            return null;
        }
    }

    public void changeEntityInfo(Long sysFileId, String newEntity, String newEntityId) {
        SysFileLink entity = this.getBySysFileId(sysFileId);
        if (entity != null && (!entity.getEntity().equals(newEntity) || entity.getEntityId().compareTo(newEntityId) != 0)) {
            entity.setEntity(newEntity);
            entity.setEntityId(newEntityId);
            this.save(entity);
        }

    }
}
