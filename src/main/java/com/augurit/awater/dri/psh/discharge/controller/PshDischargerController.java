package com.augurit.awater.dri.psh.discharge.controller;

import com.alibaba.fastjson.JSON;
import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.framework.security.user.OpuOmUser;
//import com.augurit.agcloud.opus.common.domain.OpuOmUser;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.psh.discharge.service.IPshDischargerService;
import com.augurit.awater.dri.psh.discharge.web.form.PshDischargerForm;
import com.augurit.awater.dri.psh.discharge.web.form.PshDischargerWellForm;
import com.augurit.awater.dri.utils.JsonOfForm;
import com.augurit.awater.dri.utils.Result;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Controller
@RequestMapping(value = "pshDischarger")
public class PshDischargerController {

    @Autowired
    private IPshDischargerService pshDischargerService;
    @Autowired
    private IOmUserInfoRestService omUserService;


    /**
     * pc端审核，2未审核、3疑问
     * */
    @RequestMapping(value = "/checkDate",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String checkDate(HttpServletRequest request, PshDischargerForm form){
        OpuOmUser user = SecurityContext.getCurrentUser();
        JSONObject json = new JSONObject();
        String  shState=request.getParameter("shState");
        try {
            if(form!=null && StringUtils.isNotBlank(shState)){
                form.setCheckTime(new Date());
                form.setState(shState);
                form.setCheckPersonId(user.getUserId().toString());
                form.setCheckPerson(user.getUserName());
                pshDischargerService.save(form);
                json.put("code", 200);
                json.put("id", form.getId());
                json.put("message", "修改成功!");
            }else{
                json.put("code", 500);
                json.put("message","参数错误!");
            }
        } catch (Exception e) {
            e.printStackTrace();
            json.put("code", 500);
            json.put("message","异常错误!");
        }
        return json.toString();
    }
    /**
     * 排水户审核统计
     * **/
    @RequestMapping(value = "/statisticsForSh",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String statisticsForSh(HttpServletRequest request,PshDischargerForm form) {
        OpuOmUser user = SecurityContext.getCurrentUser();
        OpuOmUserInfo userInfo=omUserService.getOpuOmUserInfoByLoginName(user.getLoginName());
        Map<String, Object> map = new HashMap();
        String startTime=request.getParameter("startTime");
        map.put("startTime",startTime);
        String endTime=request.getParameter("endTime");
        map.put("endTime",endTime);
       // map.put("startTime",userInfo.getCreateTime());
        //map.put("endTime", userInfo.getModifyTime());
        return pshDischargerService.statisticsForSh(form,map);
    }
    /**
     * 按区统计
     * **/
    @RequestMapping(value = "/statisticsForArea",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String statisticsForArea(HttpServletRequest request,PshDischargerForm form) {
        Map<String, Object> map = new HashMap();
        OpuOmUser user = SecurityContext.getCurrentUser();
        OpuOmUserInfo userInfo=omUserService.getOpuOmUserInfoByLoginName(user.getLoginName());
        String startTime=request.getParameter("startTime");
        map.put("startTime", startTime);
        String endTime=request.getParameter("endTime");
        map.put("endTime", endTime);
        return pshDischargerService.statisticsForArea(userInfo,form,map);
    }

    /**
     * 按单位统计
     * **/
    @RequestMapping(value = "/statisticsForUnit",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String statisticsForUnit(PshDischargerForm form) {
        Map<String, Object> map = new HashMap();
        OpuOmUser user = SecurityContext.getCurrentUser();
        OpuOmUserInfo userInfo=omUserService.getOpuOmUserInfoByLoginName(user.getLoginName());
        map.put("startTime", userInfo.getCreateTime());
        map.put("endTime",userInfo.getModifyTime());
        return pshDischargerService.statisticsForUnit(userInfo,form,map);
    }

    /**
     *reportStatistics.js
     *上报统计
     *按人统计
     * */
    @RequestMapping(value = "/statisticsForPerson",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String statisticsForPerson(HttpServletRequest request,PshDischargerForm form){
        OpuOmUser user = SecurityContext.getCurrentUser();
        OpuOmUserInfo userInfo=omUserService.getOpuOmUserInfoByLoginName(user.getLoginName());
        Map<String,String> map = new HashMap();
        String startTime=request.getParameter("startTime");
        map.put("startTime", startTime);
        String endTime=request.getParameter("endTime");
        map.put("endTime", endTime);
        return pshDischargerService.statisticsForPerson(userInfo,form,map);
    }
    /**
     * 分页查询
     */
	/*@Override
	public String list(Page page,PshDischargerForm form) throws Exception {
		pshDischargerService.search(page, form);
		return SUCCESS;
	}*/
    /**
     * 	新增数据
     * @return
     */
    @RequestMapping(value = "/addRow",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String addRow(HttpServletRequest request,PshDischargerForm form) {
        try {
            OpuOmUser user = SecurityContext.getCurrentUser();
            OpuOmUserInfo userInfo=omUserService.getOpuOmUserInfoByLoginName(user.getLoginName());
            String sfdtl=request.getParameter("sfdtl");
            String wellBeen=request.getParameter("wellBeen");
            String deletewellBeen=request.getParameter("deletewellBeen");
            List<PshDischargerWellForm> wellList=null;//接驳井子表
            if(wellBeen!=null && !"".equals(wellBeen)){
                JSONArray formJson=JSONArray.fromObject(wellBeen);
                wellList = (List<PshDischargerWellForm>) JsonOfForm.paramsToListApp(formJson, PshDischargerWellForm.class);
            }
            Map<String,String> map=new HashMap<String,String>();
            if(form.getId()==null){
                map.put("sfdtl", sfdtl);
            }
            map.put("deletewellBeen", deletewellBeen);
            pshDischargerService.addRow(form, map, wellList,userInfo);
            return ("{\"success\":true,\"id\":"+form.getId()+"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ("{\"success\":false,\"id\":"+null+"}");
        }
        //return null;
    }
    /**
     * 删除数据
     * @return
     */
    @RequestMapping(value = "/deleteRow",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String deleteRow(String id) {
        try {
            //LoginUserForm userForm = (LoginUserForm) getSession().getAttribute(AdsFwContext.SESSION_LOGIN_USER);
            //OmUserForm userForm = omUserService.getUser(user.getLoginName());
            OpuOmUser user = SecurityContext.getCurrentUser();
            OpuOmUserInfo userInfo=omUserService.getOpuOmUserInfoByLoginName(user.getLoginName());
            pshDischargerService.deletePsh(id, userInfo);
            return ("{\"success\":true}");
        } catch (Exception e) {
            // TODO: handle exception
            return("{\"success\":false}");
        }
        //return null;
    }
    /**
     * 分页查询
     * */
    @RequestMapping(value = "/getPshList",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String getPshList(HttpServletRequest request, PshDischargerForm form, Page page,String startTime,String endTime){
        OpuOmUser user = SecurityContext.getCurrentUser();
        OpuOmUserInfo userInfo=omUserService.getOpuOmUserInfoByLoginName(user.getLoginName());
        String pageNo = request.getParameter("page.pageNo");
        String pageSize = request.getParameter("page.pageSize");
        try {
            if(StringUtils.isNotBlank(pageNo) && StringUtils.isNotBlank(pageSize)){
                page.setPageNo(Integer.valueOf(pageNo));
                page.setPageSize(Integer.valueOf(pageSize));
            }
            Map<String,Object> map = new HashMap();
            if(StringUtils.isNotBlank(startTime)&& StringUtils.isNotBlank(endTime)){
                SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
                map.put("startTime",df.parse(startTime));
                map.put("endTime", df.parse(endTime));
            }
            map.put("lr",request.getParameter("lr"));
            if(!"1".equals(form.getState())){
                page.setOrderDir("desc");
                page.setOrderBy("checkTime");
            }
            return (pshDischargerService.getPshList(user,page,form,map));
        } catch (ParseException e) {
            e.printStackTrace();
            return JSON.toJSONString(new Result(false,"异常错误!"+e.getMessage()));
        }
    }

    /**
     * 排水户数量统计
     */
    @RequestMapping(value = "/getSbedByArea",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String getSbedByArea(){
        return pshDischargerService.getSbedByArea();
    }

    /**
     * 设备安装统计
     */
    @RequestMapping(value = "/getInstalledByArea",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String getInstalledByArea(){
        return pshDischargerService.getInstalledByArea();
    }
    /**
     * 查看详细
     * */
    @RequestMapping(value = "/seePsh",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String seePsh(String id){
        OpuOmUser user = SecurityContext.getCurrentUser();
        //id=user.getUserId();
        //HttpServletRequest req = this.getRequest();
		/*String path = req.getScheme() + "://" + req.getServerName() + ":"
				+ req.getServerPort();*/
        //Long id= Long.parseLong(user.getUserId());
        return pshDischargerService.seePsh(id,"");
    }

    //@Override
    protected PshDischargerForm prepareModel() throws Exception {
        OpuOmUser user = SecurityContext.getCurrentUser();
        Long id= Long.parseLong(user.getUserId());
        PshDischargerForm form;
        if(id != null){
            form = pshDischargerService.get(id);
        }
        else
            form = new PshDischargerForm();
        return form;
    }


}