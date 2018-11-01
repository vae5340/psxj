package com.augurit.awater.bpm.municipalBuild.facilityLayout.dao;

import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Template;
import com.augurit.awater.common.hibernate.dao.BaseDao;
import org.hibernate.SQLQuery;
import org.springframework.stereotype.Repository;

@Repository
public class TemplateDao extends BaseDao<Template, Long> {
    /**
     * 执行原生sql，相当于ExecuteNonQuery
     *
     * @param sql
     * @return
     */
    public int executeNonQuery(String sql) {
        int result;
        SQLQuery query = getSession().createSQLQuery(sql);
        result = query.executeUpdate();
        return result;
    }
}
