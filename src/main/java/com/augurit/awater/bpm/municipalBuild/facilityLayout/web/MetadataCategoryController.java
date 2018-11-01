package com.augurit.awater.bpm.municipalBuild.facilityLayout.web;

import com.augurit.awater.bpm.municipalBuild.facilityLayout.service.IMetadatacategoryService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetadatacategoryForm;
import com.augurit.awater.common.Tree;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.augurit.awater.common.page.Page;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/metacodeCategory")
public class MetadataCategoryController {

	@Autowired
	private IMetadatacategoryService metadatacategoryService;

	private MetadatacategoryForm form;
	private Long id;
	private Long[] checkedIds;
	private Page<MetadatacategoryForm> page = new Page<MetadatacategoryForm>();

	private List<Tree> rlt = new ArrayList<Tree>();

	@RequestMapping("/saveMetadataCategoryData")
	public String saveMetadataCategoryData(HttpServletRequest request){
		boolean result = metadatacategoryService.saveMetadatacategoryData(request);
		if(result){
			return "true";
		}else{
			return "false";
		}
	}
	@RequestMapping("/getMetadataCategoryData")
	public List getMetadataCategoryData(HttpServletRequest request) throws Exception{
		return metadatacategoryService.getMetadatacategoryData(request);
	}

	@RequestMapping("/getMetadataCategoryTree")
	public List<Tree> getMetadataCategoryTree(){
		rlt = metadatacategoryService.getMetadatacategoryTree(-1);
		return rlt;
	}

	/**
	 * 删除数据 2016-11-10 ls
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/delMetadataCategoryData")
	public String delMetadataCategoryData(HttpServletRequest request) throws Exception{
		boolean result = metadatacategoryService.delMetadatacategoryData(request);
		if(result){
			return "true";
		}else{
			return "false";
		}
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
	
	public Page<MetadatacategoryForm> getPage() {
		return page;
	}


	public void setPage(Page<MetadatacategoryForm> page) {
		this.page = page;
	}
}