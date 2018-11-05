package com.augurit.agcloud.org.service.impl;

import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.agcloud.opus.common.domain.OpuOmUser;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.opus.common.domain.OpuRsRole;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.org.rest.service.IOmRsRoleRestService;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.agcloud.org.rest.service.IOmUserRestService;
import com.augurit.agcloud.org.service.IPsOrgUserService;
import com.augurit.awater.dri.utils.JsonOfForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by HOWS on 2018-07-21.
 */
@Service
public class PsOrgUserServiceImpl implements IPsOrgUserService {

    @Autowired
    private IOmOrgRestService omOrgRestService;
    @Autowired
    private IOmUserInfoRestService omUserInfoRestService;
    @Autowired
    private IOmRsRoleRestService omRsRoleRestService;
    @Autowired
    private IOmUserRestService omUserRestService;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * 获取区级用户所属业主单位的id
     */
    @Override
    public String getParentOrgId(String userId){
        List<OpuOmOrg> list = omOrgRestService.listOpuOmOrgByUserId(userId);
        if(list!=null && list.size()>0){
            for(OpuOmOrg org :list ){
                if("14".equals(org.getOrgRank())){
                    return org.getOrgId();
                }
            }
        }
        return null;
    }
    /**
     * 获取最下层父机构seq排序
     * */
    @Override
    public OpuOmOrg getParentOrgByUserId(String userId){
        String sql = "select og.* from opu_om_User us,opu_om_org og,OPU_OM_USER_ORG usog where 1=1" +
                " and us.user_id=usog.user_id and usog.org_id = og.org_id and us.user_id = ? " +
                " order by LENGTH(og.ORG_SEQ) desc";
        List<Map<String,Object>> list = jdbcTemplate.queryForList(sql, userId);
        if(list!=null && list.size()>0){
            return (OpuOmOrg) JsonOfForm.mapToForm(list.get(0),OpuOmOrg.class);
        }
        return null;
    }
    /**
     * 获取关联的所有父机构
     * */
    @Override
    public List<OpuOmOrg> getParentOrgsByUserId(String userId){
        String sql = "select og.* from opu_om_User us,opu_om_org og,OPU_OM_USER_ORG usog where 1=1" +
                " and og.ORG_PROPERTY is not null and og.ORG_PROPERTY<>'g' and us.user_id=usog.user_id " +
                "and usog.org_id = og.org_id and us.user_id = ? " +
                " order by LENGTH(og.ORG_SEQ) desc";
        List<Map<String,Object>> list = jdbcTemplate.queryForList(sql, userId);
        if(list!=null && list.size()>0){
            return (List<OpuOmOrg>) JsonOfForm.listMapToForm(list,OpuOmOrg.class);
        }
        return null;
    }
    /**
     * 根据角色编码查询所属角色的所有用户
     * */
    @Override
    public List<OpuOmUser> getUsersByRoleCode(String roleCode){
        OpuRsRole role = omRsRoleRestService.getRoleByRoleCode(roleCode);
        return omRsRoleRestService.listOpuOmUserByRoleId(role.getRoleId());
    }

    /**
     * 查询指定角色编号下面的用户
     * */
    @Override
    public List<OpuOmOrg> listOmOrgByUserId(String userId){
         return  (List<OpuOmOrg>) JsonOfForm.listMapToForm(
                 jdbcTemplate.queryForList("select s.* from opu_om_org s,opu_om_user_org s1,OPU_OM_USER s2 " +
                                 "where 1=1  and s1.ORG_ID=s.ORG_ID and s1.USER_ID = s2.USER_ID and s2.USER_ID= ? ",
                         userId),OpuOmOrg.class);
    }
    /**
     * 查询所有业主单位
     * */
    @Override
    public List<OpuOmOrg> listOmOrgByRank(String orgRank){
         return  jdbcTemplate.queryForList("select * from opu_om_org where ORG_RANK = ? ",
                new Object[]{orgRank},OpuOmOrg.class);
    }
    /**
     * 查询指定工作组和机构下的用户
     * */
    @Override
    public List<OpuOmUserInfo> listWorkGroupByOrgId(String groupCode, String orgId){
        String sql = "select t1.* from ( select US.* from opu_om_org org,OPU_OM_USER_ORG usg,opu_om_user us where 1=1 " +
                " and org.ORG_PROPERTY='g' and org.ORG_ID = USG.ORG_ID and " +
                "USG.USER_ID = us.USER_ID " +
                " and ORG.ORG_CODE = ? ) t1,OPU_OM_USER_ORG t2,opu_om_org t3 where 1=1 " +
                " and T1.user_id=T2.USER_ID and t2.ORG_ID=T3.ORG_ID and T3.ORG_SEQ like ? ";
        return (List<OpuOmUserInfo>) JsonOfForm.listMapToForm(jdbcTemplate.queryForList(sql, groupCode,"%"+orgId+"%"),OpuOmUser.class);
    }
    /**
     * 查询指定机构下的用户
     * */
    @Override
    public List<OpuOmUserInfo> listUsersByOrgId(String orgId){
        String sql = "select t1.* from opu_om_user t1,OPU_OM_USER_ORG t2,opu_om_org t3 where 1=1 " +
                " and T1.user_id=T2.USER_ID and t2.ORG_ID=T3.ORG_ID and T3.ORG_ID = ? ";
        return (List<OpuOmUserInfo>) JsonOfForm.listMapToForm(jdbcTemplate.queryForList(sql, orgId),OpuOmUser.class);
    }
    /**
     * 查询指定机构下所有的用户（包括子机构）
     * */
    @Override
    public List<OpuOmUserInfo> listChildUsersByOrgId(String orgId){
        String sql = "select distinct t2.* from  " +
                " (select * from OPU_OM_ORG start with org_id in (?) connect by prior org_id = parent_org_id) t left join " +
                " (select * from OPU_om_user_org) t1 on t.org_id = t1.org_id left join " +
                " (select * from OPU_om_user) t2 on t1.user_id =t2.user_id " +
                " where t2.user_id is not null";
        return (List<OpuOmUserInfo>) JsonOfForm.listMapToForm(jdbcTemplate.queryForList(sql, orgId),OpuOmUser.class);
    }
    /**
     * 查询指定机构编码
     * */
    @Override
    public OpuOmOrg getOrgByOrgCode(String orgCode){
        String sql = "select * from opu_om_org ps where 1=1 and ps.org_code = ?";
        List<Map<String,Object>> result = jdbcTemplate.queryForList(sql, orgCode);
        List<OpuOmOrg> listOrg = (List<OpuOmOrg>) JsonOfForm.listMapToForm(result,OpuOmOrg.class);
        if(listOrg!=null && listOrg.size()>0){
            return listOrg.get(0);
        }
        return null;
    }
    /**
     * 查询指定机构子机构
     * */
    @Override
    public List<OpuOmOrg> getChildOrgsByOrgId(String orgId){
        String sql = "select * from opu_Om_Org ps where ps.parent_Org_Id=? order by ps.org_seq asc";
        List<Map<String,Object>> result = jdbcTemplate.queryForList(sql, orgId);
        return (List<OpuOmOrg>) JsonOfForm.listMapToForm(result,OpuOmOrg.class);
    }
    /**
     * 机构和工作组的并集
     * */
    @Override
    public List<OpuOmUser> getGroupByOrgId(String groupId, String[] orgIds){
        List<Object> values = new ArrayList<>();
        values.add(groupId);
        StringBuffer buffer = new StringBuffer("");
        if(orgIds.length>0){
            String sqlStr = "";
            for(String orgId :orgIds){
                if(sqlStr==""){
                    sqlStr+=" ? ";
                }else{
                    sqlStr +=", ?";
                }
                values.add(orgId);
            }
            buffer.append(sqlStr);
        }
        String sql = "select distinct s3.* from(" +
                " select s.user_id from OPU_OM_user_org s where s.ORG_ID = ? )s1,( " +
                " select s.user_id from OPU_OM_user_org s where s.ORG_ID in (SELECT org_id FROM OPU_OM_org START WITH org_id IN ("+
                buffer.toString()+") CONNECT BY PRIOR org_id = PARENT_ORG_ID))s2,opu_om_user s3 " +
                " where 1=1 and s1.user_id=S2.user_id and S2.USER_ID = S3.USER_ID";
        List<Map<String,Object>> listMap =  jdbcTemplate.queryForList(sql,values.toArray());
        List<OpuOmUser> users =  (List<OpuOmUser>) JsonOfForm.listMapToForm(listMap,OpuOmUser.class);
        for (OpuOmUser us:users) {
            us.setLoginPwd(null);
        }
        return users;
    }

    /**
     * 查找用户所在上级单位
     * */
    @Override
    public List<OpuOmOrg> getOrgsByUserId(String userId){
        String sql = "select s.* from OPU_OM_ORG s,OPU_OM_USER_ORG s1,OPU_OM_USER s2 where 1=1 " +
                "and s.ORG_ID = s1.org_id and s1.user_id =s2.user_id and s2.user_id = ?";
        List<Map<String,Object>> list = jdbcTemplate.queryForList(sql, userId);
        return (List<OpuOmOrg>) JsonOfForm.listMapToForm(list,OpuOmOrg.class);
    }

    /**
     * 查找用户信息
     * */
    @Override
    public OpuOmUser getUserByUserId(String userId){
        String sql = "select s.* from OPU_OM_USER s where 1=1 and s.user_id= ?  ";
        return (OpuOmUser) JsonOfForm.mapToForm(jdbcTemplate.queryForMap(sql, userId),OpuOmUser.class);
    }
}
