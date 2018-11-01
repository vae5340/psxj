package com.augurit.awater.bpm.municipalBuild.facilityLayout.web;

import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metatemplateclass;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.service.IMetatemplateclassService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetatemplateclassForm;
import com.augurit.awater.common.Tree;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.augurit.awater.common.page.Page;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/metaTemplateClass")
public class MetaTemplateClassController {

	@Autowired
	private IMetatemplateclassService metatemplateclassService;

	private MetatemplateclassForm form;
	private Long id;
	private Long[] checkedIds;
	private Page<MetatemplateclassForm> page = new Page<MetatemplateclassForm>();
	
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
	
	public Page<MetatemplateclassForm> getPage() {
		return page;
	}


	public void setPage(Page<MetatemplateclassForm> page) {
		this.page = page;
	}

	private List<Tree> rlt = new ArrayList<Tree>();

	/**
	 * 获取市政设施树
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getMetaTemplateClassTree")
	public List<Tree> getMetaTemplateClassTree(HttpServletRequest request) throws Exception{
		rlt=metatemplateclassService.getMetatemplateclassTree();
		return rlt;
	}

	@RequestMapping("/getMetaTemplateClassList")
	public List<Metatemplateclass> getMetaTemplateClassList(HttpServletRequest request) throws Exception{
		return metatemplateclassService.getMetatemplateclassList(request);
	}

	/**
	 * 获取基类模板记录
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getMetaTemplateClassData")
	public List getMetaTemplateClassData(HttpServletRequest request) throws Exception{
		return metatemplateclassService.getMetatemplateclassData(request);
	}

	/**
	 *
	 * 保存基类模板数据
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/saveMetaTemplateClassData")
	public String saveMetaTemplateClassData(HttpServletRequest request) throws Exception{
		boolean result = metatemplateclassService.saveMetatemplateclassData(request);
		if(result){
			return "true";
		}else{
			return "false";
		}
	}

	/**
	 * 删除基类模板数据
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/delMetaTemplateClassData")
	public String delMetaTemplateClassData(HttpServletRequest request) throws Exception{
		boolean result = metatemplateclassService.delMetatemplateclassData(request);
		if(result){
			return "true";
		}else{
			return "false";
		}
	}

	@RequestMapping("/delMetaClassPropertyData")
	public String delMetaClassPropertyData(HttpServletRequest request) throws Exception{
		boolean result = metatemplateclassService.delMetaclasspropertyData(request);
		if(result){
			return "true";
		}else{
			return "false";
		}
	}
}