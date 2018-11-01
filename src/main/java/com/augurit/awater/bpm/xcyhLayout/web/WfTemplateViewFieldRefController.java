package com.augurit.awater.bpm.xcyhLayout.web;

import com.augurit.awater.bpm.xcyhLayout.service.IWfTemplateViewFieldRefService;
import com.augurit.awater.bpm.xcyhLayout.web.form.WfTemplateViewFieldRefForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/wfTemplateViewFieldRef")
public class WfTemplateViewFieldRefController {

	@Autowired
	private IWfTemplateViewFieldRefService wfTemplateViewFieldRefService;

	@RequestMapping("/getWfTemplateViewFieldRefData")
	public List getWfTemplateViewFieldRefData(HttpServletRequest request){
		return wfTemplateViewFieldRefService.getWfTemplateViewFieldRefData(request);
	}
	/**
	 * 保存新增或者修改的Form对象
	 */
	@RequestMapping("/save")
	public String save(WfTemplateViewFieldRefForm form) throws Exception {
		wfTemplateViewFieldRefService.save(form);
		return "true";
	}

	/**
	 * 删除一条记录
	 */
	@RequestMapping("/delete")
	public String delete(Long id) throws Exception {
		wfTemplateViewFieldRefService.delete(id);
		return "true";
	}
	
	/**
	 * 删除多条记录
	 */
	@RequestMapping("/deleteMore")
	public String deleteMore(Long[] checkedIds) throws Exception{
		wfTemplateViewFieldRefService.delete(checkedIds);
		return "true";
	}

	/**
	 * 保存数据 2016-11-04 zhc
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/saveWfTemplateViewFieldRefData")
	public String saveWfTemplateViewFieldRefData(HttpServletRequest request) throws Exception{
		boolean result = wfTemplateViewFieldRefService.saveWfTemplateViewFieldRefData(request);
		if(result){
			return "true";
		}else{
			return "false";
		}
	}
	/**
	 * 删除数据 2016-11-04 zhc
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/deleteWfTemplateViewFieldRefData")
	public String deleteWfTemplateViewFieldRefData(HttpServletRequest request) throws Exception{
		boolean result = wfTemplateViewFieldRefService.deleteWfTemplateViewFieldRefData(request);
		if(result){
			return "true";
		}else{
			return "false";
		}
	}
}