package com.augurit.awater.dri.psh.discharge.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.psh.discharge.convert.PshReportDeleteConvertor;
import com.augurit.awater.dri.psh.discharge.dao.PshReportDeleteDao;
import com.augurit.awater.dri.psh.discharge.entity.PshReportDelete;
import com.augurit.awater.dri.psh.discharge.service.IPshReportDeleteService;
import com.augurit.awater.dri.psh.discharge.web.form.PshReportDeleteForm;
import com.augurit.awater.util.PropertyFilter;
import com.augurit.awater.util.page.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class PshReportDeleteServiceImpl implements IPshReportDeleteService {

	@Autowired
	private PshReportDeleteDao pshReportDeleteDao;
	
	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public PshReportDeleteForm get(Long id) {
		PshReportDelete entity = pshReportDeleteDao.get(id);
		return PshReportDeleteConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		pshReportDeleteDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(PshReportDeleteForm... forms) {
		if(forms != null)
			for(PshReportDeleteForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(PshReportDeleteForm form){
		
		if(form != null){
			PshReportDelete entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = pshReportDeleteDao.get(form.getId());
			}else{
				entity = new PshReportDelete();
			}
			
			//属性值转换
			PshReportDeleteConvertor.convertFormToVo(form, entity);
			
			//保存
			pshReportDeleteDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<PshReportDeleteForm> search(Page<PshReportDeleteForm> page, PshReportDeleteForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from PshReportDelete ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = pshReportDeleteDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<PshReportDeleteForm> list = PshReportDeleteConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<PshReportDeleteForm> search(Page<PshReportDeleteForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<PshReportDelete> pg = pshReportDeleteDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<PshReportDeleteForm> list = PshReportDeleteConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
}