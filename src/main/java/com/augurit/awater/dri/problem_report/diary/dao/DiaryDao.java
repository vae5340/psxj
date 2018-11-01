package com.augurit.awater.dri.problem_report.diary.dao;

import com.augurit.awater.common.hibernate.dao.BaseDao;
import com.augurit.awater.dri.problem_report.diary.entity.Diary;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;


@Repository
public class DiaryDao extends BaseDao<Diary, Long> {
    /*protected SessionFactory sessionFactory;
    public SessionFactory getSessionFactory() {
        return this.sessionFactory;
    }*/

}