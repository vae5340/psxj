package com.augurit.awater.bpm.sggc.dao;

import java.util.List;

import com.augurit.awater.bpm.sggc.entity.GxSggc;
import com.augurit.awater.common.hibernate.dao.BaseDao;
import org.hibernate.SQLQuery;
import org.springframework.stereotype.Repository;


@Repository
public class GxSggcDao extends BaseDao<GxSggc, Long> {
	/*
	 * 提供sql查询list支持
	 * */
	public List getListBySql(String sql,List<Object> list){
		SQLQuery query=this.getSession().createSQLQuery(sql);
		for(int i=0;i<list.size();i++){
			query.setParameter(i, list.get(i));
		}
		List result=null;
		result=query.list();
		return result;
	}
}