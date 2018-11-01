package com.augurit.awater.bpm.municipalBuild.facilityLayout.service;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.augurit.awater.bpm.common.service.ICrudService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metadatacategory;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metadatatable;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetaclasspropertyForm;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetadatafieldForm;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetadatatableForm;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.TemplateForm;
import com.augurit.awater.common.Tree;

public interface IMetadatatableService extends ICrudService<MetadatatableForm, Long> {
	public List<Tree> getMetadatatableTree(String rootid);
	public boolean saveMetadatatableData(HttpServletRequest request);
	public List<TemplateForm> getTemplateData();
	public List getMetadatatableData(HttpServletRequest request);
	public List getConnectOtherDatasource(HttpServletRequest request);
	public boolean delMetadatatableData(HttpServletRequest request);
	public List<MetadatafieldForm> getTableFieldListByName(HttpServletRequest request);
	public List<MetadatafieldForm> getDataTypeListByOracle();
	public List<MetaclasspropertyForm> getMetaClassProperty(HttpServletRequest request);
	public List<MetadatafieldForm> getTableFieldListByTableName(HttpServletRequest request);
	public boolean saveFieldSort(HttpServletRequest request);
	public List<MetadatatableForm> getMetadatatables(HttpServletRequest request);
	public String getConnectDataSource(HttpServletRequest request);

	/**
	 * 通过设施名称获取其下面所有图层配置信息
	 * @param categoryName 设施名称
	 * @return
	 */
	List<Metadatatable> getMetadataTableByCategoryName(String categoryName);

	/**
	 * 通过设施名称获取其下面所有子类设施信息
	 * @param categoryName 设施名称
	 * @return
	 */
	List<Metadatacategory> getMetadatacategoryByCategoryName(String categoryName);

	/**
	 * 判断物理表是否存在
	 * @param tableName（owner.tablename）
	 * @return
	 */
	boolean existTableByName(String tableName);

}