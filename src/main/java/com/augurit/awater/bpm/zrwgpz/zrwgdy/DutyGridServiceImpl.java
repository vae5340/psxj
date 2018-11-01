package com.augurit.awater.bpm.zrwgpz.zrwgdy;

import com.augurit.awater.bpm.problem.dao.CcProblemDao;
import com.augurit.awater.bpm.problem.web.form.CcProblemForm;
import com.augurit.awater.common.Tree;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.util.data.DataConvert;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class DutyGridServiceImpl implements IDutyGridService {
    @Autowired
    private CcProblemDao ccproblemDao;

    @Override
    public CcProblemForm get(Long aLong) {
        return null;
    }

    @Override
    public void save(CcProblemForm... ccProblemForms) {

    }

    @Override
    public void delete(Long... longs) {

    }

    @Override
    public Page<CcProblemForm> search(Page<CcProblemForm> page, CcProblemForm ccProblemForm) {
        return null;
    }

    /**
     * 获取责任网格图层图层树
     */
    public String getDutyGridLayerTree(String sqlWhere) throws Exception {
        String sql = "select t.objectid, t.net_code, t.net_name, sde.st_astext(t.shape) from dutygird t ";
        sql += DataConvert.strToStr(sqlWhere);
        List listDutyGrid = ccproblemDao.createSQLQuery(sql).list();
        Tree tree = new Tree();
        tree.setName("责任网格树");
        tree.setIconCls("icon-root");
        tree.setIconSkin("icon_root");
        //叶子节点数组
        List<Tree> children = new ArrayList();
        for (int i = 0; i < listDutyGrid.size(); i++) {
            Object[] dutyGridLayer = (Object[]) listDutyGrid.get(i);
            //叶子节点
            Tree child = new Tree();
            child.setId(DataConvert.objToStr(dutyGridLayer[0]));
            child.setName(DataConvert.objToStr(dutyGridLayer[2]));
            Map<String, Object> map = new HashMap();
            map.put("objectId", DataConvert.objToStr(dutyGridLayer[0]));
            map.put("net_code", DataConvert.objToStr(dutyGridLayer[1]));
            map.put("net_name", DataConvert.objToStr(dutyGridLayer[2]));
            map.put("wkt", DataConvert.objClobToStr(dutyGridLayer[3]));
            child.setAttributes(map);
            child.setIconCls("icon-leaf");
            child.setIconSkin("icon_leaf");
            children.add(child);
        }
        tree.setChildren(children);
        return new Gson().toJson(tree);
    }

    /**
     * 获取所在道路树
     */
    @RequestMapping("/getStreetTree")
    public String getStreetTree(HttpServletRequest request) throws Exception {
        String net_code = request.getParameter("net_code");
        //获取有权限的路段和还没有授权的路段
        String sql = "select t.objectid, t.start_point, t.end_point, t.road_id, sde.st_astext(t.shape), t.net_code from dl_road_part t where t.net_code = '" + net_code + "' or t.net_code is null";
        List listRoadPartLayer = ccproblemDao.createSQLQuery(sql).list();
        String roadIdList = "";

        Map<String, List<Tree>> chilNodeMap = new HashMap();
        for (int i = 0; i < listRoadPartLayer.size(); i++) {
            Map<String, Object> map = new HashMap();
            Tree child = new Tree();
            Object[] roadPartLayer = (Object[]) listRoadPartLayer.get(i);
            String roadId = DataConvert.objToStr(roadPartLayer[3]);
            roadIdList += "," + roadId;
            //拼接节点名
            String roadPartExtent = roadPartLayer[1] + "-" + roadPartLayer[2];
            child.setId(roadPartLayer[0].toString());
            child.setName(roadPartExtent);
            child.setIconCls("icon-leaf");
            child.setIconSkin("icon_leaf");
            //勾选已经授权的路段
            if (!"".equals(DataConvert.objToStr(roadPartLayer[5]))) {
                child.setChecked(true);
            }
            map.put("objectid", roadPartLayer[0]);
            map.put("roadPartExtent", roadPartExtent);
            map.put("wkt", DataConvert.objClobToStr(roadPartLayer[4]));
            child.setAttributes(map);

            //先将叶子节点储存起来，最后再拼接到道路图层树上
            if (chilNodeMap.containsKey(roadId)) {
                chilNodeMap.get(roadId).add(child);
            } else {
                List<Tree> children = new ArrayList();
                children.add(child);
                chilNodeMap.put(roadId, children);
            }
        }

        if (roadIdList.length() > 0) {
            roadIdList = roadIdList.substring(1);
        }

        Tree tree = new Tree();
        //道路图层
        sql = "select t.objectid, t.id, t.road_name, sde.st_astext(t.shape) from dl_road_information t where t.id in (" + roadIdList + ")";
        List listRoadLayer = ccproblemDao.createSQLQuery(sql).list();
        List<Tree> children = new ArrayList();
        for (int i = 0; i < listRoadLayer.size(); i++) {
            Object[] roadLayer = (Object[]) listRoadLayer.get(i);
            Tree child = new Tree();
            child.setName(DataConvert.objToStr(roadLayer[2]));
            Map<String, Object> map = new HashMap();
            map.put("objectid", roadLayer[0]);
            map.put("wkt", DataConvert.objClobToStr(roadLayer[3]));
            child.setAttributes(map);
            //取出对应的路段
            child.setChildren(chilNodeMap.get(roadLayer[1]));
            child.setIconCls("icon-leaf");
            child.setIconSkin("icon_leaf");
            children.add(child);
        }

        tree.setChildren(children);
        tree.setName("养护单元");
        tree.setId(-1);
        tree.setIconCls("icon-root");
        tree.setIconSkin("icon_root");

        return new Gson().toJson(tree);
    }

    /**
     * 保存责任网格图层
     */
    public String saveDutyGrid(HttpServletRequest request) throws Exception {
        String dutyGridId = request.getParameter("dutyGridId");
        String netCode = request.getParameter("netCode");
        String netNewName = request.getParameter("netNewName");
        String cancelAuthorize = request.getParameter("cancelAuthorize");
        String addAuthorize = request.getParameter("addAuthorize");

        String sql;
        //修改责任片区名称
        if (StringUtils.isNotBlank(netNewName)) {
            sql = "update dutygird t set t.net_name = '" + netNewName + "' where t.objectid = " + dutyGridId;
            ccproblemDao.createQuery(sql).executeUpdate();
        }

        //取消授权
        if (StringUtils.isNotBlank(cancelAuthorize)) {
            sql = "update dl_road_part t set t.net_id = null, t.net_code = null where t.objectid in (" + cancelAuthorize.substring(1, cancelAuthorize.length() - 1) + ")";
            ccproblemDao.createQuery(sql).executeUpdate();
        }

        //新增授权
        if (StringUtils.isNotBlank(addAuthorize)) {
            sql = "update dl_road_part t set t.net_id = '" + netCode + "', t.net_code = '" + netCode + "' where t.objectid in (" + addAuthorize.substring(1, addAuthorize.length() - 1) + ")";
            ccproblemDao.createQuery(sql).executeUpdate();
        }

        return null;
    }

//    /**
//     * 获取巡查养护人员树
//     */
//    public String getPatrolUserTree() throws Exception {
//        //获取巡查养护角色
//        AcRole acRole = acRoleDao.findFirst("from AcRole  where roleCode = 'xc_user'");
//        Tree tree = new Tree();
//        tree.setName("巡查员");
//        tree.setIconCls("icon-root");
//        tree.setIconSkin("icon_root");
//        //叶子节点数组
//        List<Tree> children = new ArrayList();
//        Gson gson = new Gson();
//        if (acRole != null) {
//            //获取与该角色关联的用户id
//            List<Long> acUserRoleIdList = acUserRoleDao.getUserIdsByRoleId(acRole.getRoleId());
//            for (int i = 0; i < acUserRoleIdList.size(); i++) {
//                //获取用户名
//                OmUserForm omUserForm = omUserDao.getUser(acUserRoleIdList.get(i));
//                String userName = omUserForm.getUserName();
//                String userId = DataConvert.longToStr(omUserForm.getUserId());
//                //叶子节点
//                Tree child = new Tree();
//                child.setId(userId);
//                child.setName(userName);
//                child.setIconCls("icon-leaf");
//                child.setIconSkin("icon_leaf");
//                child.setAttributes(DataConvert.beanToMap(omUserForm));
//                children.add(child);
//            }
//        }
//        tree.setChildren(children);
//        return gson.toJson(tree);
//    }

    /**
     * 巡查养护绑定 保存
     */
    public String savePatrolBinding(HttpServletRequest request) throws Exception {
        String strUserId = request.getParameter("userId");
        Long userId = DataConvert.strToLong(strUserId);
        String cancelAuthorize = request.getParameter("cancelAuthorize");
        String addAuthorize = request.getParameter("addAuthorize");
        String sql = "";
        //取消授权
        if (StringUtils.isNotBlank(cancelAuthorize)) {
            cancelAuthorize = cancelAuthorize.replace("\"", "'");
            sql = "delete from PATROL_DUTYGRID where net_code in(" + cancelAuthorize.substring(1, cancelAuthorize.length() - 1) + ")";
            ccproblemDao.createQuery(sql).executeUpdate();
        }

        //新增授权
        if (StringUtils.isNotBlank(addAuthorize)) {
            addAuthorize = addAuthorize.replace("\"", "'");
            sql = "insert into PATROL_DUTYGRID(OBJECTID, USERID, NET_CODE) select seq_patrol_dutygrid.nextval, t.* from (";
            List<String> net_codes = new Gson().fromJson(addAuthorize, new TypeToken<List<String>>() {
            }.getType());
            for (int i = 0; i < net_codes.size(); i++) {
                if (i != 0) sql += " union";
                sql += " select " + userId + ", '" + net_codes.get(i) + "' from dual";
            }
            sql += ") t";
            ccproblemDao.createQuery(sql).executeUpdate();
        }
        return null;
    }

    /**
     * 通过sqlwhere获取责任网格图层树
     */
    public String getDutyGridLayerTreeBySqlWhere(HttpServletRequest request) throws Exception {
        Long userId = DataConvert.strToLong(request.getParameter("userId"));
        //获取与该用户绑定的责任网格
        String sql = "select net_code from PATROL_DUTYGRID where userid = " + userId;
        List<String> bindingNetCodeList = (List<String>) ccproblemDao.createSQLQuery(sql).list();
        String bindingNetCodes = bindingNetCodeList.toString();
        bindingNetCodes = bindingNetCodes.replace(", ", "','").replace("[", "'").replace("]", "'");

        //获取所有已经绑定的责任网格编号
        sql = "select distinct net_code from PATROL_DUTYGRID";
        List<String> allNetCodeList = (List<String>) ccproblemDao.createSQLQuery(sql).list();
        String allNetCodes = allNetCodeList.toString();
        allNetCodes = allNetCodes.replace(", ", "','").replace("[", "'").replace("]", "'");

        String sqlWhere = "";
        if (bindingNetCodeList.size() != 0) {
            sqlWhere = " where t.net_code in(" + bindingNetCodes + ")";
            if (allNetCodeList.size() != 0)
                sqlWhere += " or t.net_code not in(" + allNetCodes + ")";
        } else if (allNetCodeList.size() != 0) {
            sqlWhere = " where t.net_code not in(" + allNetCodes + ")";
        } else {
            sqlWhere = null;
        }

        String tree = getDutyGridLayerTree(sqlWhere);
        List<String> resultList = new ArrayList();
        Gson gson = new Gson();
        resultList.add(gson.toJson(bindingNetCodeList));
        resultList.add(tree);

        return gson.toJson(resultList);
    }
}
