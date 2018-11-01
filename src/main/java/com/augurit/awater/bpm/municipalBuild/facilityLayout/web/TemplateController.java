package com.augurit.awater.bpm.municipalBuild.facilityLayout.web;

import com.augurit.awater.bpm.municipalBuild.facilityLayout.service.ITemplateService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.TemplateForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.augurit.awater.common.page.Page;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/template")
public class TemplateController {

	@Autowired
	private ITemplateService templateService;

	private Long id;
	private Long[] checkedIds;
	private Page<TemplateForm> page = new Page<TemplateForm>();

	@RequestMapping("/getTemplateData")
	public List<TemplateForm> getTemplateData(HttpServletRequest request) throws Exception{
		return templateService.getTemplateData(request);
	}

	/**
	 * 保存新增或者修改的Form对象
	 */
	@RequestMapping("/save")
	 public String save(TemplateForm form, HttpServletRequest request) throws Exception {
		String msg = templateService.saveTemplateData(form, request);
		return msg;
	}

	@RequestMapping("/deleteMore")
	public String deleteMore(HttpServletRequest request) throws Exception{
		//将前端传的String[]转long[]
		String ids = request.getParameter("ids");
		String[] str=ids.split(",");
		Long[] longIds = new Long[str.length];
		for (int i = 0; i < str.length; i++) {
			longIds[i] = Long.valueOf(str[i]);
		}
		templateService.delete(longIds);
		//给前端Ajax接受请求成功的消息字符
		return null;
	}

	/**
	 * 删除模板表及其相关数据
	 * @return
	 */
	@RequestMapping("/deleteTemplateData")
	  public String deleteTemplateData(HttpServletRequest request){
		 templateService.deleteTemplateData(request);
		 return null;
	 }

	// 属性getter和setter方法
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long[] getCheckedIds() {
		return checkedIds;
	}

	public void setCheckedIds(Long[] checkedIds) {
		this.checkedIds = checkedIds;
	}
	
	public Page<TemplateForm> getPage() {
		return page;
	}


	public void setPage(Page<TemplateForm> page) {
		this.page = page;
	}
}