package com.augurit.awater.dri.psh.sewerageUser.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.psh.sewerageUser.convert.SewerageUserAttachmentConvertor;
import com.augurit.awater.dri.psh.sewerageUser.dao.SewerageUserAttachmentDao;
import com.augurit.awater.dri.psh.sewerageUser.entity.SewerageUserAttachment;
import com.augurit.awater.dri.psh.sewerageUser.service.ISewerageUserAttachmentService;
import com.augurit.awater.dri.psh.sewerageUser.web.form.SewerageUserAttachmentForm;
import com.augurit.awater.util.PropertyFilter;
import com.augurit.awater.util.file.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



@Service
@Transactional
public class SewerageUserAttachmentServiceImpl implements ISewerageUserAttachmentService {

	@Autowired
	private SewerageUserAttachmentDao sewerageUserAttachmentDao;
	
	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public SewerageUserAttachmentForm get(Long id) {
		SewerageUserAttachment entity = sewerageUserAttachmentDao.get(id);
		return SewerageUserAttachmentConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		sewerageUserAttachmentDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(SewerageUserAttachmentForm... forms) {
		if(forms != null)
			for(SewerageUserAttachmentForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(SewerageUserAttachmentForm form){
		
		if(form != null){
			SewerageUserAttachment entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = sewerageUserAttachmentDao.get(form.getId());
			}else{
				entity = new SewerageUserAttachment();
			}
			
			//属性值转换
			SewerageUserAttachmentConvertor.convertFormToVo(form, entity);
			
			//保存
			sewerageUserAttachmentDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<SewerageUserAttachmentForm> search(Page<SewerageUserAttachmentForm> page, SewerageUserAttachmentForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from SewerageUserAttachment ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = sewerageUserAttachmentDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<SewerageUserAttachmentForm> list = SewerageUserAttachmentConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<SewerageUserAttachmentForm> search(Page<SewerageUserAttachmentForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<SewerageUserAttachment> pg = sewerageUserAttachmentDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<SewerageUserAttachmentForm> list = SewerageUserAttachmentConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	/**
	 * 通过排水用户表id获取其附件
	 * @param id
	 * @return
	 */
	@Override
	public List<SewerageUserAttachmentForm> getListBySewerageUserId(String id){
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from SewerageUserAttachment ps where 1=1");
		
		if(StringUtils.isNotBlank(id)){
			hql.append(" and ps.sewerageUserId = ?");
			hql.append(" order by ps.attTime");
			List<SewerageUserAttachment> list = sewerageUserAttachmentDao.find(hql.toString(), id);
			return SewerageUserAttachmentConvertor.convertVoListToFormList(list);
		}
		return null;
	}
	
	@Override
	/**
	 * 通过排水用户表id和类型获取其附件
	 */
	public List<SewerageUserAttachmentForm> getByTypeAndSewerageUserId(String type,String id){
		if(StringUtils.isBlank(type) || StringUtils.isBlank(id)){
			return null;
		}
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from SewerageUserAttachment ps where 1=1");
		Map<String , Object> map = new HashMap<String , Object>();
		if(StringUtils.isNotBlank(id)){
			hql.append(" and ps.sewerageUserId = :id");
			map.put("id", id);
		}
		if(StringUtils.isNotBlank(type)){
			hql.append(" and ps.attType = :type");
			map.put("type", type);
		}
		hql.append(" order by ps.attTime");
		List<SewerageUserAttachment> list = sewerageUserAttachmentDao.find(hql.toString(), map);
		return SewerageUserAttachmentConvertor.convertVoListToFormList(list);
	}

	/**
	 * 删除
	 */
	@Override
	public void deleteBySewerageUserIdAndType(String id, String type) {
		List<SewerageUserAttachmentForm> list = getByTypeAndSewerageUserId(type, id);
		if(list != null && StringUtils.isNotBlank(id) && StringUtils.isNotBlank(type)){
			for(SewerageUserAttachmentForm form : list){
				delete(form.getId());
			}
		}
		
	}
}