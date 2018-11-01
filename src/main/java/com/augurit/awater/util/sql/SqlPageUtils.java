package com.augurit.awater.util.sql;

import com.augurit.awater.common.page.Page;

public class SqlPageUtils {
    /**
	 * 通过page与sql得到分页sql
	 * @param source
	 * @param sql
	 * @return
	 */
	public static String getPageSql(Page source, String sql){
		int startNo = (source.getPageNo()-1)*source.getPageSize()+1;
		int endNo = source.getPageNo()*source.getPageSize();
		StringBuffer  pageSql = new StringBuffer();
		pageSql.append(" select * from (select rownum as rowno,e.* from ( ");
		pageSql.append(sql);
		pageSql.append(" ) e where rownum<="+endNo+") f where f.rowno>="+startNo);
		return pageSql.toString();
	}
}