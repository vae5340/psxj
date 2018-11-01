package com.augurit.awater.bpm.xcyhLayout.web;

import com.augurit.awater.bpm.xcyhLayout.service.IWfRoleViewRefService;
import com.augurit.awater.bpm.xcyhLayout.web.form.WfRoleViewRefForm;
import com.augurit.awater.common.Tree;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/wfRoleViewRef")
public class WfRoleViewRefController {

	@Autowired
	private IWfRoleViewRefService wfRoleViewRefService;


	@RequestMapping("/save")
	public String save(WfRoleViewRefForm form) throws Exception {
		wfRoleViewRefService.save(form);
		return "true";
	}

	/**
	 * 删除一条记录
	 */
	@RequestMapping("/delete")
	public String delete(Long id) throws Exception {
		wfRoleViewRefService.delete(id);
		return "true";
	}

	/**
	 * 删除多条记录
	 */
	@RequestMapping("/deleteMore")
	public String deleteMore(Long[] checkedIds) throws Exception{
		wfRoleViewRefService.delete(checkedIds);
		return "true";
	}

	/**
	 * 获取角色列表
	 */
	@RequestMapping("/getAcRole")
	public String getAcRole(HttpServletRequest request) throws Exception {
		return wfRoleViewRefService.getAcRole(request);

	}

	/**获取任务视图树*/
	@RequestMapping("/getWfTemplateViewTree")
	public List getWfTemplateViewTree(HttpServletRequest request) throws Exception {
		List<Tree> rlt = wfRoleViewRefService.getWfTemplateViewTree(request);
		return rlt;
	}

	/**
	 * 保存角色任务视图信息
	 */
	@RequestMapping("/saveWfRoleViewRef")
	public String  saveWfRoleViewRef(HttpServletRequest request) throws Exception {
		try {
			wfRoleViewRefService.saveWfRoleViewRef(request);
			return "true";
		} catch (Exception e) {
			e.printStackTrace();
			return "false";
		}
	}
}