package com.augurit.awater.bpm.municipalBuild.facilityLayout.dao;

import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metadatatable;
import com.augurit.awater.common.hibernate.dao.BaseDao;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Repository;


import org.hibernate.SQLQuery;

@Repository
public class MetadatatableDao extends BaseDao<Metadatatable, Long> {
	
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

	public void executeUpdateSql(final String sql)throws DataAccessException
	{
		this.getSession().createSQLQuery(sql).executeUpdate();
		this.getSession().flush(); //清理缓存，执行批量插入
		this.getSession().clear(); //清空缓存中的 对象
	}
}