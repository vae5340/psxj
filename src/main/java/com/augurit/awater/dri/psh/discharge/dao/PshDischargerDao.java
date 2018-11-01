package com.augurit.awater.dri.psh.discharge.dao;

import com.augurit.awater.common.hibernate.dao.BaseDao;
import com.augurit.awater.dri.psh.discharge.entity.PshDischarger;
import com.augurit.awater.util.AssertUtils;
import org.springframework.stereotype.Repository;


@Repository
public class PshDischargerDao extends BaseDao<PshDischarger, Long> {
    /*public PshDischarger get(Long id) {
        AssertUtils.notNull(id, "id不能为空");
        PshDischarger entity = (PshDischarger)this.getSession().get(this.entityClass, id);
        return entity;
    }*/
}