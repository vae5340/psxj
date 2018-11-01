package com.augurit.awater.dri.reportUpload.rest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

@RequestMapping("/rest/appPicture")
@Controller
public class AppPictureRestController {



    @RequestMapping(value = "/getTopImg")
    @ResponseBody
    public String getTopImg(HttpServletRequest request){
        String baseURL="http://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath();
       /* List<AppPictureForm> appPictureFormList=sysFileService.getAppPictureList(baseURL);
        ResultForm resultForm=new ResultForm(200,appPictureFormList,"ok");
        return JSON.toJSONString(resultForm);*/
       return "";
    }

}
