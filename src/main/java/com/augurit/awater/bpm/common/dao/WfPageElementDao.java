package com.augurit.awater.bpm.common.dao;

import com.augurit.awater.bpm.common.entity.WfPageElement;
import com.augurit.awater.common.hibernate.dao.BaseDao;
import org.springframework.stereotype.Repository;

@Repository
public class WfPageElementDao extends BaseDao<WfPageElement, Long> {
    public WfPageElementDao() {
    }
}
