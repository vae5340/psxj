package com.augurit.awater.bpm.xcyhLayout.dao;

import com.augurit.awater.bpm.xcyhLayout.entity.WfTemplateViewFieldRef;
import org.hibernate.SQLQuery;
import org.springframework.stereotype.Repository;

import com.augurit.awater.common.hibernate.dao.BaseDao;

@Repository
public class WfTemplateViewFieldRefDao extends BaseDao<WfTemplateViewFieldRef, Long> {
    public int executeNonQuery(String sql) {
        int result;
        SQLQuery query = getSession().createSQLQuery(sql);
        result = query.executeUpdate();
        return result;
    }
}