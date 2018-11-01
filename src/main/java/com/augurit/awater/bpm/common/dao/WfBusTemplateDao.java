package com.augurit.awater.bpm.common.dao;

import com.augurit.awater.bpm.common.entity.WfBusTemplate;
import com.augurit.awater.common.hibernate.dao.BaseDao;
import org.springframework.stereotype.Repository;
import java.util.HashMap;
import java.util.Map;

@Repository
public class WfBusTemplateDao extends BaseDao<WfBusTemplate, Long> {
    public WfBusTemplateDao() {
    }
//
//    public Page<OmUser> getUsersByTemplateId(Page<OmUserForm> page, Long templateId) {
//        String hql = "select user from WfTemplateMgmtPriv tgp,OmUser user where tgp.adminUserKey = user.loginName and tgp.templateId = ?";
//        Page usersPage = this.findPage(page, hql, new Object[]{templateId});
//        Page<OmUser> pg = new Page();
//        PageUtils.copy(usersPage, usersPage.getResult(), pg);
//        return pg;
//    }
//
//    public List<OmUser> getAllUsersByTemplateId(Long templateId) {
//        String hql = "select user from WfTemplateMgmtPriv tgp,OmUser user where tgp.adminUserKey = user.loginName and tgp.templateId = ?";
//        List<OmUser> users = this.find(hql, new Object[]{templateId});
//        return users;
//    }

    public WfBusTemplate getTemplateByProcInstId(Long procInstDbId) {
        StringBuffer hqlBuffer = new StringBuffer("select temp from Jbpm4HistProcinst hp,WfBusInstance bi,WfBusTemplate temp ");
        hqlBuffer.append(" where hp.procInstId = bi.procInstId and bi.templateId=temp.id ");
        hqlBuffer.append(" and hp.procInstDbId = :procInstDbId");
        Map<String, Object> values = new HashMap();
        values.put("procInstDbId", procInstDbId);
        WfBusTemplate template = (WfBusTemplate)this.findUnique(hqlBuffer.toString(), values);
        return template;
    }

    public WfBusTemplate getTemplateByProcInstId(String processInstanceId) {
        StringBuffer hqlBuffer = new StringBuffer("select temp from Jbpm4HistProcinst hp,WfBusInstance bi,WfBusTemplate temp ");
        hqlBuffer.append(" where hp.procInstId = bi.procInstId and bi.templateId=temp.id ");
        hqlBuffer.append(" and hp.procInstId = :procInstId");
        Map<String, Object> values = new HashMap();
        values.put("procInstId", processInstanceId);
        WfBusTemplate template = (WfBusTemplate)this.findUnique(hqlBuffer.toString(), values);
        return template;
    }
}
