package com.augurit.awater.dri.psh.sewerageUser.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import javax.persistence.criteria.Order;

import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.psh.sewerageUser.convert.SewerageUserConvertor;
import com.augurit.awater.dri.psh.sewerageUser.dao.SewerageUserDao;
import com.augurit.awater.dri.psh.sewerageUser.entity.SewerageUser;
import com.augurit.awater.dri.psh.sewerageUser.service.ISewerageUserService;
import com.augurit.awater.dri.psh.sewerageUser.web.form.SewerageUserForm;
import com.augurit.awater.util.PropertyFilter;
import com.augurit.awater.util.file.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SewerageUserServiceImpl implements ISewerageUserService {

	@Autowired
	private SewerageUserDao sewerageUserDao;
	
	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public SewerageUserForm get(Long id) {
		SewerageUser entity = sewerageUserDao.get(id);
		return SewerageUserConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		sewerageUserDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(SewerageUserForm... forms) {
		if(forms != null)
			for(SewerageUserForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(SewerageUserForm form){
		
		if(form != null){
			SewerageUser entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = sewerageUserDao.get(form.getId());
			}else{
				entity = new SewerageUser();
			}
			
			//属性值转换
			SewerageUserConvertor.convertFormToVo(form, entity);
			
			//保存
			sewerageUserDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	@Transactional(readOnly = true)
	public String searchPage(Page<SewerageUserForm> page, SewerageUserForm form) {
		JSONObject json = new JSONObject();
		Long total = 0l;
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from SewerageUser ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			if(StringUtils.isNotBlank(form.getAdministrative())){
				hql.append(" and ps.administrative = :administrative");
				values.put("administrative", form.getAdministrative());
			}
			if(StringUtils.isNotBlank(form.getEntryName())){
				hql.append(" and ps.entryName like :entryName");
				values.put("entryName", "%"+form.getEntryName()+"%");
			}
			if(StringUtils.isNotBlank(form.getLicenseKey())){
				hql.append(" and ps.licenseKey like :licenseKey");
				values.put("licenseKey", "%"+form.getLicenseKey()+"%");
			}
			if(StringUtils.isNotBlank(form.getType())){
				hql.append(" and ps.type = :type");
				values.put("type", form.getType());
			}
			if(StringUtils.isNotBlank(form.getState())){
				hql.append(" and ps.state = :state");
				values.put("state", form.getState());
			}
		}
		
		//排序
		hql.append(" Order by ps.createTime desc");
		//hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = sewerageUserDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<SewerageUserForm> list = SewerageUserConvertor.convertVoListToFormList(pg.getResult());
		List<SewerageUserForm> rows = new ArrayList<SewerageUserForm>();
		PageUtils.copy(pg, list, page);
		if(page.getResult()!=null){
			rows=page.getResult();
			total=page.getTotalItems();
		}
		json.put("rows", rows);
		json.put("total", total);
		json.put("code", 200);
		return json.toString();
	}
	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<SewerageUserForm> search(Page<SewerageUserForm> page, SewerageUserForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from SewerageUser ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			
		}
		
		//排序
		//hql.append(HqlUtils.buildOrderBy(page, "ps"));
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = sewerageUserDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<SewerageUserForm> list = SewerageUserConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<SewerageUserForm> search(Page<SewerageUserForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<SewerageUser> pg = sewerageUserDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<SewerageUserForm> list = SewerageUserConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
}