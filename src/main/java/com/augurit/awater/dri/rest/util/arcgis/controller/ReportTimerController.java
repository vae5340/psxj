package com.augurit.awater.dri.rest.util.arcgis.controller;

import com.alibaba.fastjson.JSON;
import com.augurit.agcloud.common.from.ResultForm;
import com.augurit.awater.dri.rest.util.arcgis.timer.SynchronousData;
import com.augurit.awater.dri.rest.util.arcgis.timer.SynchronousDeleteData;
import com.augurit.awater.dri.rest.util.arcgis.timer.SynchronousUpdateData;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@RequestMapping("/reportTimer")
@Controller
public class ReportTimerController {


    /**
     * 执行一次update
     * */
    @RequestMapping(value = "/addFeature",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String addFeature(){
        try {
            SynchronousData.syncNoAddFeature();
            return JSON.toJSONString(new ResultForm(true,"执行成功!"));
        } catch (Exception e) {
            e.printStackTrace();
            return JSON.toJSONString(new ResultForm(false,"执行失败!异常错误!"));
        }
    }
    @RequestMapping(value = "/updateFeature",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String updateFeature(){
        try {
            SynchronousUpdateData.updateFeature();
            return JSON.toJSONString(new ResultForm(true,"更新成功!"));
        } catch (Exception e) {
            e.printStackTrace();
            return JSON.toJSONString(new ResultForm(false,"更新失败!异常错误!"));
        }
    }


    /**
     * 执行一次delete
     * */
    @RequestMapping(value = "/deleteFeature",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String deleteFeature(){
        try {
            SynchronousDeleteData.deleteFeature();
            return JSON.toJSONString(new ResultForm(true,"执行成功!"));
        } catch (Exception e) {
            e.printStackTrace();
            return JSON.toJSONString(new ResultForm(false,"执行失败!异常错误!"));
        }
    }

    /**
     * 启动
     * */
    @RequestMapping(value = "/start",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String start(@RequestParam String timerName){
        JSONObject json = new JSONObject();
        json.put("success", true);
        if("Add".equals(timerName)) SynchronousData.start();
        else if("Update".equals(timerName)) SynchronousUpdateData.start();
        else if("Delete".equals(timerName)) SynchronousDeleteData.start();
        else json.put("success", false);
        return json.toString();
    }

    /**
     * stop
     * */
    @RequestMapping(value = "/stop",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String stop(@RequestParam String timerName){
        JSONObject json = new JSONObject();
        json.put("success", true);
        if("Add".equals(timerName)) SynchronousData.stop();
        else if("Update".equals(timerName)) SynchronousUpdateData.stop();
        else if("Delete".equals(timerName)) SynchronousDeleteData.stop();
        else json.put("success", false);
        return json.toString();
    }
    /**
     * 重启定时任务
     * */
    @RequestMapping(value = "/restartTimer",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String restartTimer(@RequestParam String timerName) {
        JSONObject json = new JSONObject();
        json.put("success", true);
        if("Add".equals(timerName)) SynchronousData.restart();
        else if("Update".equals(timerName)) SynchronousUpdateData.restart();
        else if("Delete".equals(timerName)) SynchronousDeleteData.restart();
        else json.put("success", false);
        return json.toString();
    }
    /**
     * 获取定时任务的列表
     * */
    @RequestMapping(value = "/getTimerList",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String getTimerList() {
        JSONObject json = new JSONObject();
        Map map = SynchronousData.getQueueView();
        Map mapDelete = SynchronousDeleteData.getQueueView();
        Map mapUpdate = SynchronousUpdateData.getQueueView();
        json.put("Add", map);
        json.put("Update", mapUpdate);
        json.put("Delete", mapDelete);
        return json.toString();
    }
}
