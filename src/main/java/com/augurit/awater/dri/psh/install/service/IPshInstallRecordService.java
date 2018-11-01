package com.augurit.awater.dri.psh.install.service;

import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.psh.install.web.form.PshInstallRecordForm;

public interface IPshInstallRecordService extends ICrudService<PshInstallRecordForm, Long> {
	
	/**
	 * 按区获取安装数据
	 * */
	public String getInstalledByArea();
	/**
	 * 按镇街获取安装数据
	 * */
	public String getInstalledByUnit(String unitName);
	/**
	 * 安装率图表获取安装具体数据
	 * */
	public String getInstalledInf(Page<PshInstallRecordForm> page, PshInstallRecordForm form);
	/**
	 * 安装数据
	 * 动态获取机构
	 * */
	public String getInstalledDynamic(Object[] orgArray, String type);
	/**
	 * 根据Form对象的查询条件作分页查询
	 * 关联机构查询
	 */
	public String getInstalledInfDynamic(Page<PshInstallRecordForm> page, PshInstallRecordForm form) ;
}