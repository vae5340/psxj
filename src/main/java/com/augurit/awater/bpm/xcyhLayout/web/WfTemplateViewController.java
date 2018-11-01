package com.augurit.awater.bpm.xcyhLayout.web;

import com.augurit.awater.bpm.xcyhLayout.entity.WfTemplateView;
import com.augurit.awater.bpm.xcyhLayout.service.IWfTemplateViewService;
import com.augurit.awater.bpm.xcyhLayout.web.form.WfTemplateViewForm;
import com.augurit.awater.common.Tree;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/wfTemplateView")
public class WfTemplateViewController {

	@Autowired
	private IWfTemplateViewService wfTemplateViewService;

	/**
	 * 保存新增或者修改的Form对象
	 */
	@RequestMapping("/save")
	public String save(WfTemplateViewForm form) throws Exception {
		wfTemplateViewService.save(form);
		return "true";
	}

	@RequestMapping("/saveWfTemplateViewData")
	public String saveWfTemplateViewData(HttpServletRequest request){
		boolean result = wfTemplateViewService.saveWfTemplateViewData(request);
		if(result){
			return "true";
		}else{
			return "false";
		}
	}

	@RequestMapping("/getWfTemplateViewTree")
	public List getWfTemplateViewTree(HttpServletRequest request){
		List<Tree> rlt = wfTemplateViewService.getWfTemplateViewTree(-1,request);
		return rlt;
	}

	/**
	 * 获取过滤字段
	 * @return
	 */
	@RequestMapping("/getFields")
	public List getFields(HttpServletRequest request){
		List result = wfTemplateViewService.getFields(request);
		return result;
	}

	@RequestMapping("/getWfBusTemplateData")
	public List getWfBusTemplateData(){
		List result = wfTemplateViewService.getWfBusTemplateData();
		return result;
	}

	@RequestMapping("/delWftemplateviewData")
	public String delWftemplateviewData(HttpServletRequest request){
		boolean result = wfTemplateViewService.delWftemplateviewData(request);
		if(result){
			return "true";
		}else{
			return "false";
		}
	}

	@RequestMapping("/getWfTemplateViewData")
	public List<WfTemplateView> getWfTemplateViewData(HttpServletRequest request){
		return wfTemplateViewService.getWfTemplateViewData(request);
	}
	/**
	 * 删除一条记录
	 */
	@RequestMapping("/delete")
	public String delete(Long id) throws Exception {
		wfTemplateViewService.delete(id);
		return "true";
	}
	
	/**
	 * 删除多条记录
	 */
	@RequestMapping("/deleteMore")
	public String deleteMore(Long[] checkedIds) throws Exception{
		wfTemplateViewService.delete(checkedIds);
		return "true";
	}
}