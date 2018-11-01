package com.augurit.awater.dri.column.service.impl;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

import com.augurit.awater.dri.column.convert.ColumnsUnreadConvertor;
import com.augurit.awater.dri.column.dao.ColumnsUnreadDao;
import com.augurit.awater.dri.column.entity.ColumnsUnread;
import com.augurit.awater.dri.column.service.IColumnsUnreadService;
import com.augurit.awater.dri.column.web.form.ColumnsUnreadForm;
import com.augurit.awater.util.page.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.augurit.awater.util.PropertyFilter;
import com.augurit.awater.common.page.Page;

@Service
@Transactional
public class ColumnsUnreadServiceImpl implements IColumnsUnreadService {

	@Autowired
	private ColumnsUnreadDao columnsUnreadDao;


	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public ColumnsUnreadForm get(Long id) {
		ColumnsUnread entity = columnsUnreadDao.get(id);
		return ColumnsUnreadConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		columnsUnreadDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(ColumnsUnreadForm... forms) {
		if(forms != null)
			for(ColumnsUnreadForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(ColumnsUnreadForm form){
		
		if(form != null){
			ColumnsUnread entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = columnsUnreadDao.get(form.getId());
			}else{
				entity = new ColumnsUnread();
			}
			
			//属性值转换
			ColumnsUnreadConvertor.convertFormToVo(form, entity);
			
			//保存
			columnsUnreadDao.save(entity);

			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<ColumnsUnreadForm> search(Page<ColumnsUnreadForm> page, ColumnsUnreadForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from ColumnsUnread ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = columnsUnreadDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<ColumnsUnreadForm> list = ColumnsUnreadConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<ColumnsUnreadForm> search(Page<ColumnsUnreadForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<ColumnsUnread> pg = columnsUnreadDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<ColumnsUnreadForm> list = ColumnsUnreadConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}

	@Override
	public ColumnsUnreadForm getColumnsUnreadByUserId(Long userId) {
		if(userId!=null){
			String hql="select ps from ColumnsUnread ps where ps.userId=?";
			ColumnsUnread columnsUnread=columnsUnreadDao.findFirst(hql,new Object[]{userId});
			return ColumnsUnreadConvertor.convertVoToForm(columnsUnread);
		}else{
			return null;
		}
	}

	@Override
	public void deleteByUserId(final String userId) {

	}

	@Override
	public int updateUnreadColumns(final String type) {
		if(null==type){
			return -1;
		}
		boolean isUpdate=false;
		StringBuffer sql=new StringBuffer("update COLUMNS_UNREAD set ");
		if("xwdt".equals(type)){
			sql.append("xwdt_unread =xwdt_unread+1");
			isUpdate=true;
		}else if("tzgg".equals(type)){
			sql.append("tzgg_unread=tzgg_unread+1");
			isUpdate=true;
		}else if("jyjl".equals(type)){
			sql.append("jyjl_unread=jyjl_unread+1");
			isUpdate=true;
		}else if("bzgf".equals(type)){
			sql.append("bzgf_unread=bzgf_unread+1");
			isUpdate=true;
		}else if("zcfg".equals(type)){
			sql.append("zcfg_unread=zcfg_unread+1");
			isUpdate=true;
		}else if("redb".equals(type)){
			sql.append("hongb_unread=hongb_unread+1");
			isUpdate=true;
		}else if("blackb".equals(type)){
			sql.append("heib_unread=heib_unread+1");
			isUpdate=true;
		}else if("czxz".equals(type)){
			sql.append("czxz_unread=czxz_unread+1");
			isUpdate=true;
		}
		if(isUpdate) {
			return columnsUnreadDao.getSession().createSQLQuery(sql.toString()).executeUpdate();
		}
		return -1;
	}
}