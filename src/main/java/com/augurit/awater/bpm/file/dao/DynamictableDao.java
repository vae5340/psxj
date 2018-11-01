package com.augurit.awater.bpm.file.dao;

import com.augurit.awater.common.hibernate.dao.BaseDao;
import org.hibernate.SQLQuery;
import org.springframework.stereotype.Repository;

/**
 * Created by Administrator on 2016-12-06.
 */
@Repository
public class DynamictableDao extends BaseDao<Object, Long> {
    public int executeNonQuery(String sql) {
        int result;
        SQLQuery query = getSession().createSQLQuery(sql);
        result = query.executeUpdate();
        return result;
    }
}
