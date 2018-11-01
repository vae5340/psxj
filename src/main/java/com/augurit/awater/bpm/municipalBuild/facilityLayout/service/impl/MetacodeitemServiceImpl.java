package com.augurit.awater.bpm.municipalBuild.facilityLayout.service.impl;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

import com.augurit.awater.bpm.municipalBuild.facilityLayout.convert.MetacodeitemConvertor;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.dao.MetacodeitemDao;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.entity.Metacodeitem;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.service.IMetacodeitemService;
import com.augurit.awater.bpm.municipalBuild.facilityLayout.web.form.MetacodeitemForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.augurit.awater.util.file.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import com.augurit.awater.util.PropertyFilter;
import com.augurit.awater.common.page.Page;

@Service
@Transactional
public class MetacodeitemServiceImpl implements IMetacodeitemService {

	@Autowired
	private MetacodeitemDao metacodeitemDao;
	
	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public MetacodeitemForm get(Long id) {
		Metacodeitem entity = metacodeitemDao.get(id);
		return MetacodeitemConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		metacodeitemDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(MetacodeitemForm... forms) {
		if(forms != null)
			for(MetacodeitemForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(MetacodeitemForm form){
		
		if(form != null){
			Metacodeitem entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = metacodeitemDao.get(form.getId());
			}else{
				entity = new Metacodeitem();
			}
			
			//属性值转换
			MetacodeitemConvertor.convertFormToVo(form, entity);
			
			//保存
			metacodeitemDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<MetacodeitemForm> search(Page<MetacodeitemForm> page, MetacodeitemForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from Metacodeitem ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = metacodeitemDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<MetacodeitemForm> list = MetacodeitemConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<MetacodeitemForm> search(Page<MetacodeitemForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<Metacodeitem> pg = metacodeitemDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<MetacodeitemForm> list = MetacodeitemConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
}