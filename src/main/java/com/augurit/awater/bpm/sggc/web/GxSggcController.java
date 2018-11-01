package com.augurit.awater.bpm.sggc.web;

import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.awater.bpm.sggc.service.IGxSggcService;
import com.augurit.awater.bpm.sggc.web.form.GxSggcForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/gxSggc")
public class GxSggcController {

	@Autowired
	private IGxSggcService gxSggcService;

	/**
	 * 保存施工日志
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/saveData")
	public String saveData(GxSggcForm form) throws Exception {
//		LoginUserForm userForm = (LoginUserForm) getSession().getAttribute(AdsFwContext.SESSION_LOGIN_USER);
//		form.setUsername(userForm.getUserName());
//		form.setLoginname(userForm.getLoginName());
		String userName = SecurityContext.getCurrentUserName();
		form.setUsername(userName);
		form.setLoginname(userName);
		form.setLx("0");
		form.setTime(new Date());
		String sggcid =gxSggcService.saveData(form);
		return sggcid;
	}
	/**
	 * 保存评论
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/saveContent")
	public String saveContent(GxSggcForm form) throws Exception {
		//Todo
		String userName = SecurityContext.getCurrentUserName();
		form.setUsername(userName);
		form.setLoginname(userName);
//		form.setUsername(userForm.getUserName());
//		form.setLoginname(userForm.getLoginName());

		form.setLx("1");
		form.setTime(new Date());
		String sggcid =gxSggcService.saveData(form);
		return sggcid;
	}
	/**
	 * 获取施工日志和评论
	 */
	@RequestMapping("/getSggcLogAndContent")
	public List<GxSggcForm> getSggcLogAndContent(GxSggcForm form) throws Exception{
		List<GxSggcForm> list= gxSggcService.search(form);
		return list;
	}

	/**
	 * 保存新增或者修改的Form对象
	 */
	@RequestMapping("/save")
	public String save(GxSggcForm form) throws Exception {
		gxSggcService.save(form);
		return "true";
	}
	/**
	 * 删除多条记录
	 */
	@RequestMapping("/deleteMore")
	public String deleteMore(Long[] checkedIds) throws Exception{
		gxSggcService.delete(checkedIds);
		return "true";
	}
}