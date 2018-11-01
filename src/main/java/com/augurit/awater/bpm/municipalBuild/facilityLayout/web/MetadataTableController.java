package com.augurit.awater.bpm.municipalBuild.facilityLayout.web;

import com.augurit.awater.bpm.municipalBuild.facilityLayout.service.IMetadatatableService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetaclasspropertyForm;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetadatafieldForm;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetadatatableForm;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.TemplateForm;
import com.augurit.awater.common.Tree;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.augurit.awater.common.page.Page;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/metadataTable")
public class MetadataTableController {

	@Autowired
	private IMetadatatableService metadatatableService;

	private Long id;
	private Long[] checkedIds;
	private Page<MetadatatableForm> page = new Page<MetadatatableForm>();
	
	
	private List<Tree> rlt = new ArrayList<Tree>();
	
	/**
	 * 获取数据 2016-11-03 zhc
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getMetadataTableTree")
	public List<Tree> getMetadataTableTree(HttpServletRequest request) throws Exception{
		String parentid = request.getParameter("parentid");
		if(null == parentid || parentid.equals("")){
			parentid = "0";
		}
		rlt=metadatatableService.getMetadatatableTree(parentid);
		return rlt;
	}

	/**
	 * 获取数据 2016-11-04 zhc
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getTemplateData")
	public List<TemplateForm> getTemplateData(HttpServletRequest request) throws Exception{
		return metadatatableService.getTemplateData();
	}
	
	/**
	 * 保存数据 2016-11-04 zhc
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/saveMetadatatTableData")
	public String saveMetadatatTableData(HttpServletRequest request) throws Exception{
		boolean result = metadatatableService.saveMetadatatableData(request);
		if(result){
			return "true";
		}else{
			return "false";
		}
	}
	
	/**
	 * 获取元数据记录 2016-11-10 zhc
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getMetadataTableData")
	public List getMetadataTableData(HttpServletRequest request) throws Exception{
		return metadatatableService.getMetadatatableData(request);
	}
	
	/**
	 * 删除数据 2016-11-10 zhc
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/delMetadatatableData")
	public String delMetadatatableData(HttpServletRequest request) throws Exception{
		boolean result = metadatatableService.delMetadatatableData(request);
		if(result){
			return "true";
		}else{
			return "false";
		}
	}
	
	/**
	 * 通过表名获取表字段信息 2016-11-11 zhc
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getTableFieldListByName")
	public List<MetadatafieldForm> getTableFieldListByName(HttpServletRequest request) throws Exception{
		return metadatatableService.getTableFieldListByName(request);
	}

	/**
	 * 匹配其他数据源字段
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getConnectOtherDatasource")
	public List getConnectOtherDatasource(HttpServletRequest request) throws Exception{
		return metadatatableService.getConnectOtherDatasource(request);
	}

	/**
	 * 连接其它数据
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getConnectDataSource")
	public String getConnectDataSource(HttpServletRequest request) throws Exception{
		String msg = metadatatableService.getConnectDataSource(request);
		return msg;
	}

	
	/**
	 * 获取oracle表数据类型信息 2016-11-21 zhc
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getDataTypeListByOracle")
	public List<MetadatafieldForm> getDataTypeListByOracle(HttpServletRequest request) throws Exception{
		return metadatatableService.getDataTypeListByOracle();
	}
	
	/**
	 * 获取设施基类模板属性信息 2016-11-22 zhc
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getMetaClassProperty")
	public List<MetaclasspropertyForm> getMetaClassProperty(HttpServletRequest request) throws Exception{
		return metadatatableService.getMetaClassProperty(request);
	}
	
	/**
	 * 通过表名同步更新表字段信息 2016-11-23 zhc
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getTableFieldListByTableName")
	public List<MetadatafieldForm> getTableFieldListByTableName(HttpServletRequest request) throws Exception{
		return metadatatableService.getTableFieldListByTableName(request);
	}
	
	/**
	 * 保存排序顺序 2016-11-24 zhc
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/saveFieldSort")
	public String saveFieldSort(HttpServletRequest request) throws Exception{
		boolean result = metadatatableService.saveFieldSort(request);
		if(result){
			return "true";
		}else{
			return "false";
		}
	}
	
	/**
	 * 获取表模板定义记录 2016-12-02 zhc
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/")
	public List getMetadataTables(HttpServletRequest request) throws Exception{
		return metadatatableService.getMetadatatables(request);
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
	
	public Page<MetadatatableForm> getPage() {
		return page;
	}


	public void setPage(Page<MetadatatableForm> page) {
		this.page = page;
	}
}