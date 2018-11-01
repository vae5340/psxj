package com.augurit.awater.bpm.zrwgpz.zrwgdy;

import com.augurit.awater.bpm.common.service.ICrudService;
import com.augurit.awater.bpm.problem.web.form.CcProblemForm;

import javax.servlet.http.HttpServletRequest;

public interface IDutyGridService extends ICrudService<CcProblemForm, Long> {
    /**
     * 获取责任网格图层图层树
     */
    String getDutyGridLayerTree(String sqlWhere) throws Exception;

    /**
     * 获取所在道路树
     */
    String getStreetTree(HttpServletRequest request) throws Exception;

    /**
     * 保存责任网格图层
     */
    String saveDutyGrid(HttpServletRequest request) throws Exception;

    /**
     * 获取巡查养护人员树
     */
//    String getPatrolUserTree() throws Exception;

    /**
     * 巡查养护绑定 保存
     */
    String savePatrolBinding(HttpServletRequest request) throws Exception;

    /**
     * 通过sqlwhere获取责任网格图层树
     */
    String getDutyGridLayerTreeBySqlWhere(HttpServletRequest request) throws Exception;
}
