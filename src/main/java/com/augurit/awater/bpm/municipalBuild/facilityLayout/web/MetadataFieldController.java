package com.augurit.awater.bpm.municipalBuild.facilityLayout.web;


import com.augurit.awater.bpm.municipalBuild.facilityLayout.service.IMetacodetypeService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.service.IMetadatafieldService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetadatafieldForm;
import com.augurit.awater.common.page.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/metadataField")
public class MetadataFieldController {

	@Autowired
	private IMetadatafieldService metadatafieldService;
	private IMetacodetypeService metacodetypeService;

	private MetadatafieldForm form;
	private Long id;
	private Long[] checkedIds;
	private Page<MetadatafieldForm> page = new Page<MetadatafieldForm>();

	/**
	 *
	 * @获取表结构定义
	 */
	@RequestMapping("/getMetadataFieldData")
	public List getMetadataFieldData(HttpServletRequest request){
		return metadatafieldService.getMetadatafieldData(request);
	}

	@RequestMapping("/getTableFieldsByTableid")
	public List getTableFieldsByTableid(HttpServletRequest request){
		return metadatafieldService.getTableFieldsByTableid(request.getParameter("tableid"));
	}


	/**
	 * 获取数据字典项
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getMetaCodeItem")
	public List getMetaCodeItem(HttpServletRequest request) throws Exception{
		List rlt= metadatafieldService.getMetaCodeItem(request);
		return rlt;
	}

	@RequestMapping("/saveFieldAttribute")
	public String saveFieldAttribute(HttpServletRequest request){
		boolean result = metadatafieldService.saveFieldAttribute(request);
		if(result){
			return "true";
		}else{
			return "false";
		}
	}

	@RequestMapping("/getMetaCodeTypeData")
	public List getMetaCodeTypeData(HttpServletRequest request){
		return metadatafieldService.getMetacodetypeData(request);
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
	
	public Page<MetadatafieldForm> getPage() {
		return page;
	}


	public void setPage(Page<MetadatafieldForm> page) {
		this.page = page;
	}
}