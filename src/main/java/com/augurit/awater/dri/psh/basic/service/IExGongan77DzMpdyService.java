package com.augurit.awater.dri.psh.basic.service;


import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.psh.basic.web.form.ExGongan77DzMpdyForm;

public interface IExGongan77DzMpdyService extends ICrudService<ExGongan77DzMpdyForm, Long> {
	/**
	 * 通过门牌获取所有的子表信息
	 * */
	public ExGongan77DzMpdyForm getAllInf(Page<ExGongan77DzMpdyForm> page, ExGongan77DzMpdyForm form);
	/**
	 * 根据门牌id获取
	 * */
	public ExGongan77DzMpdyForm getBySGuid(String sGuid) ;
	ExGongan77DzMpdyForm getByHouseId(String houseId);
	/**
	 * 修改sde门牌状态
	 * */
	public int updateStatue(String sGuid, Long istatue);
	/**
	 *调查完毕istatue：3，部分调查istatue：2
	 * */
	public int updateMpState(String sGuid, String investPersonId, String isExist, Long istatue);
	
	/**
	 * 排水户分页查询
	 */
	public String getMpList(OpuOmUserInfo userForm, Page<ExGongan77DzMpdyForm> page, ExGongan77DzMpdyForm form);
	ExGongan77DzMpdyForm getByDzdm(String dzdm);
}