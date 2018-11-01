package com.augurit.awater.bpm.municipalBuild.facilityLayout.web;

import com.augurit.awater.bpm.municipalBuild.facilityLayout.service.IMetacodeitemService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.service.IMetacodetypeService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetacodeitemForm;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.augurit.awater.common.page.Page;

@RestController
@RequestMapping("/metacodeItem")
public class MetacodeItemController {

	@Autowired
	private IMetacodeitemService metacodeitemService;
	@Autowired
	private IMetacodetypeService metacodetypeService;

	private MetacodeitemForm form;
	private Long id;
	private Long[] checkedIds;
	private Page<MetacodeitemForm> page = new Page<MetacodeitemForm>();

	/**
	 * 获取查询条件的数据字典
	 * @throws Exception
	 */
	@RequestMapping("/getItemList")
	public String getItemList() throws Exception {
		JSONObject json = new JSONObject();
		json.put("code", 200);
		json.put("facility_type", metacodetypeService.getDicdataByTypecode("facility_type"));
		json.put("wtlx3", metacodetypeService.getDicdataByTypecode("wtlx3"));
//		json.put("yzdw", omOrgService.getAllYzdw());
		return json.toString();
	}

	public MetacodeitemForm getModel() {
		return form;
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
	
	public Page<MetacodeitemForm> getPage() {
		return page;
	}


	public void setPage(Page<MetacodeitemForm> page) {
		this.page = page;
	}
}