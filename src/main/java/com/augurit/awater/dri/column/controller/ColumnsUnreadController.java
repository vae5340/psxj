package com.augurit.awater.dri.column.controller;

import com.alibaba.fastjson.JSON;
import com.augurit.agcloud.common.controller.BaseController;
import com.augurit.agcloud.common.from.ResultForm;
import com.augurit.awater.dri.column.service.IColumnsUnreadService;
import com.augurit.awater.dri.column.web.form.ColumnsUnreadForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.websocket.server.PathParam;

@RequestMapping("/reportData")
@Controller
public class ColumnsUnreadController extends BaseController<ColumnsUnreadForm>{

	@Autowired
	private IColumnsUnreadService columnsUnreadService;

	@RequestMapping(value = "/getUnreadInfo/{userId}",method = {RequestMethod.POST})
	@ResponseBody
	public String getUnreadInfo(@PathParam("userId")String userId){
		ColumnsUnreadForm form= null;
		try {
			form = null;
			if(userId!=null&&!"".equals(userId)){
                form=columnsUnreadService.getColumnsUnreadByUserId(Long.parseLong(userId));
            }
			return JSON.toJSONString(form);
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(false,"异常错误!"));
		}
	}


	/**
	 *用户读取消息，更新未读标志
	 * */
	@RequestMapping(value = "/readInfo",method = {RequestMethod.POST})
	@ResponseBody
	public String readInfo(HttpServletRequest request, HttpServletResponse response)throws Exception{
		String userId=request.getParameter("userId");
		String infoType=request.getParameter("infoType");

		ColumnsUnreadForm form=null;
		if(userId!=null&&!"".equals(userId)) {
			form= columnsUnreadService.getColumnsUnreadByUserId(Long.parseLong(userId));
			//已读为0时不进行修改
			if(form!=null) {
				boolean isUpdate=false;
				if ("xwdt".equals(infoType)&&form.getXwdtUnread()!=null&&0!=form.getXwdtUnread()) {
					form.setXwdtUnread(0l);
					isUpdate=true;
				}else if("tzgg".equals(infoType)&&form.getTzggUnread()!=null&&0!=form.getTzggUnread()){
					form.setTzggUnread(0l);
					isUpdate=true;
				}else if("jyjl".equals(infoType)&&form.getJyjlUnread()!=null&&0!=form.getJyjlUnread()){
					form.setJyjlUnread(0l);
					isUpdate=true;
				}else if("zcfg".equals(infoType)&&form.getZcfgUnread()!=null&&0!=form.getZcfgUnread()){
					form.setZcfgUnread(0l);
					form.setBzgfUnread(0l);
					isUpdate=true;
				}else if("bzgf".equals(infoType)&&form.getBzgfUnread()!=null&&0!=form.getBzgfUnread()){
					form.setZcfgUnread(0l);
					form.setBzgfUnread(0l);
					isUpdate=true;
				}else if("redb".equals(infoType)&form.getHongbUnread()!=null&&0!=form.getHongbUnread()){
					form.setHongbUnread(0l);
					form.setHeibUnread(0l);
					isUpdate=true;
				}else if("blackb".equals(infoType)&&form.getHeibUnread()!=null&&0!=form.getHeibUnread()){
					form.setHongbUnread(0l);
					form.setHeibUnread(0l);
					isUpdate=true;
				}else if("czxz".equals(infoType)&&form.getCzxzUnread()!=null&&0!=form.getCzxzUnread()){
					form.setCzxzUnread(0l);
					isUpdate=true;
				}else if("flsm".equals(infoType)&&form.getFlsmUnread()!=null&&0!=form.getFlsmUnread()){
					form.setFlsmUnread(0l);
					isUpdate=true;
				}
				if(isUpdate){
					columnsUnreadService.save(form);
				}
			}
		}
		return JSON.toJSONString(form!=null?form:new ColumnsUnreadForm());
	}

	/**
	 * 发布新消息,更新所有用户未读标志
	 * */
	@RequestMapping(value = "/releaseNews",method = {RequestMethod.POST})
	@ResponseBody
	public String releaseNews(HttpServletRequest request,HttpServletResponse response){
		String type=request.getParameter("infoType");
		if(type!=null&&!"".equals(type)) {
			int updateNums=columnsUnreadService.updateUnreadColumns(type);
			return "更新了"+updateNums+"条记录";
		}
		return "参数错误";
	}


}