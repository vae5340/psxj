package com.augurit.awater.dri.onlineStatus.rest;

import com.alibaba.fastjson.JSON;
import com.augurit.awater.dri.onlineStatus.service.IOnlineStatusService;
import com.augurit.awater.dri.onlineStatus.web.form.OnlineStatusForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;



@RequestMapping("/rest/onlineStatus")
@Controller
public class OnlineStatusRestController {
    @Autowired
    private IOnlineStatusService onlineStatusService;

    @RequestMapping(value = "/{userId}",produces="text/plain;charset=UTF-8")
    @ResponseBody
    public String getOnlineStatusByUserId(@PathVariable("userId") String userId)throws Exception{
        OnlineStatusForm form=null;
        if(null!=userId&&!"".equals(userId)){
            form=onlineStatusService.getOnlineStatusByUserId(userId);
        }
        return JSON.toJSONString(form);
    }
}
