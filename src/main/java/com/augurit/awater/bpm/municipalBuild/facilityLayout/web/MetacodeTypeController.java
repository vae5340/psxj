package com.augurit.awater.bpm.municipalBuild.facilityLayout.web;

import com.augurit.awater.bpm.municipalBuild.facilityLayout.service.IMetacodetypeService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetacodetypeForm;
import com.augurit.awater.common.Tree;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.augurit.awater.common.page.Page;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/metacodeType")
public class MetacodeTypeController {

	@Autowired
	private IMetacodetypeService metacodetypeService;

	private MetacodetypeForm form;
	private Long id;
	private Long[] checkedIds;
	private Page<MetacodetypeForm> page = new Page<MetacodetypeForm>();

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

	public Page<MetacodetypeForm> getPage() {
		return page;
	}


	public void setPage(Page<MetacodetypeForm> page) {
		this.page = page;
	}

	private List<Tree> rlt = new ArrayList<Tree>();

	/**
	 * 获取数据字典树
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getMetaDictionaryTree")
	public List getMetaDictionaryTree() throws Exception{
		rlt=metacodetypeService.getMetadictionaryTree();
		return rlt;
	}

	/**
	 * 获取数据字典信息
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getMetaDictionaryData")
	public List getMetaDictionaryData(HttpServletRequest request) throws Exception{
		String id = request.getParameter("id");
		return metacodetypeService.getMetadictionaryData(id);
	}

	/**
	 *
	 * 保存数据字典信息
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/saveMetaDictionaryData")
	public String saveMetaDictionaryData(HttpServletRequest request) throws Exception{
		boolean result = metacodetypeService.saveMetadictionaryData(request);
		if(result){
			return "true";
		}else{
			return "false";
		}
	}

	/**
	 * 删除数据字典信息
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/delMetaDictionaryData")
	public String delMetaDictionaryData(HttpServletRequest request) throws Exception{
		boolean result = metacodetypeService.delMetadictionaryData(request);
		if(result){
			return "true";
		}else{
			return "false";
		}
	}

	@RequestMapping("/delMetacodeItemData")
	public String delMetacodeItemData(HttpServletRequest request) throws Exception {
		boolean result = metacodetypeService.delMetaCodeitemData(request);
		if(result) {
			return "true";
		} else {
			return "false";
		}
	}
}