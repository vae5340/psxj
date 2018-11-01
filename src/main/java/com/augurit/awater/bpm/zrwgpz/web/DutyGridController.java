package com.augurit.awater.bpm.zrwgpz.web;

import com.augurit.awater.bpm.zrwgpz.zrwgdy.IDutyGridService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/dutyGrid")
public class DutyGridController {
    @Autowired
    private IDutyGridService dutyGridService;

    /**
     * 获取责任网格图层图层树
     */
    @RequestMapping("/getDutyGridLayerTree")
    public String getDutyGridLayerTree() throws Exception {

            return dutyGridService.getDutyGridLayerTree(null);


    }

    /**
     * 获取所在道路树
     */
    @RequestMapping("/getStreetTree")
    public String getStreetTree(HttpServletRequest request) throws Exception {
        return dutyGridService.getStreetTree(request);
    }

    /**
     * 保存责任网格图层
     */
    @RequestMapping("/saveDutyGrid")
    public String saveDutyGrid(HttpServletRequest request) throws Exception {

            return dutyGridService.saveDutyGrid(request);

    }

    /**
     * 获取巡查养护人员树
     */
    //Todo
//    @RequestMapping("/getPatrolUserTree")
//    public void getPatrolUserTree() throws Exception {
//        try {
//            AjaxResult.ajaxAction(dutyGridService.getPatrolUserTree());
//        } catch (Exception e) {
//            AjaxResult.ajaxActionError(e);
//        }
//    }

    /**
     * 巡查养护绑定 保存
     */
    @RequestMapping("/savePatrolBinding")
    public String savePatrolBinding(HttpServletRequest request) throws Exception {

            return dutyGridService.savePatrolBinding(request);

    }

    /**
     * 通过sqlwhere获取责任网格图层树
     */
    @RequestMapping("/getDutyGridLayerTreeBySqlWhere")
    public String getDutyGridLayerTreeBySqlWhere(HttpServletRequest request) throws Exception {

            return dutyGridService.getDutyGridLayerTreeBySqlWhere(request);


    }
}
