package com.augurit.awater.dri.column.dao;

import com.augurit.awater.common.hibernate.dao.BaseDao;
import com.augurit.awater.dri.column.convert.ColumnsUnreadConvertor;
import com.augurit.awater.dri.column.entity.ColumnsUnread;
import com.augurit.awater.dri.column.web.form.ColumnsUnreadForm;
import org.springframework.stereotype.Repository;


import java.util.List;

@Repository
public class ColumnsUnreadDao extends BaseDao<ColumnsUnread, Long> {
    public ColumnsUnreadForm getColumnsByUserId(Long userId){
        if(userId!=null){
            String hql="select ps from ColumnsUnread ps where ps.userId=?";
            ColumnsUnread columnsUnread=this.findFirst(hql,new Object[]{userId});
            return ColumnsUnreadConvertor.convertVoToForm(columnsUnread);
        }else{
            return null;
        }
    }
    public void deleteByUserId(Long userId){
        List<ColumnsUnread> columnsUnreadList=this.findBy("userId",userId);
        if(columnsUnreadList!=null&&columnsUnreadList.size()>0){
            this.delete(columnsUnreadList);
        }
    }
}