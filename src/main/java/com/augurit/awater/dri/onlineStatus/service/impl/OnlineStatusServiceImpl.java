package com.augurit.awater.dri.onlineStatus.service.impl;

import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.onlineStatus.convert.OnlineStatusConvertor;
import com.augurit.awater.dri.onlineStatus.dao.OnlineStatusDao;
import com.augurit.awater.dri.onlineStatus.entity.OnlineStatus;
import com.augurit.awater.dri.onlineStatus.service.IOnlineStatusService;
import com.augurit.awater.dri.onlineStatus.web.form.OnlineStatusForm;
import com.augurit.awater.util.PropertyFilter;
import com.augurit.awater.util.page.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class OnlineStatusServiceImpl implements IOnlineStatusService {

	@Autowired
	private OnlineStatusDao onlineStatusDao;
	
	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public OnlineStatusForm get(Long id) {
		OnlineStatus entity = onlineStatusDao.get(id);
		return OnlineStatusConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		onlineStatusDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(OnlineStatusForm... forms) {
		if(forms != null)
			for(OnlineStatusForm form : forms)
				this.save(form);
	}

	public void saveByUserId(OnlineStatusForm form){
		if(form!=null){
			OnlineStatus entity=null;
			if(form!=null && form.getUserId()!=null){
				OnlineStatusForm old=this.getOnlineStatusByUserId(form.getUserId());
				if(null!=old&&null!=old.getId()) {
					form.setId(old.getId());
					entity=onlineStatusDao.get(form.getId());
				}else{
					entity=new OnlineStatus();
				}
			}else{
				entity=new OnlineStatus();
			}
			//属性值转换
			OnlineStatusConvertor.convertFormToVo(form, entity);

			//保存
			onlineStatusDao.save(entity);

			//回填ID属性值
			form.setId(entity.getId());

		}
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(OnlineStatusForm form){
		
		if(form != null){
			OnlineStatus entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = onlineStatusDao.get(form.getId());
			}else{
				entity = new OnlineStatus();
			}
			
			//属性值转换
			OnlineStatusConvertor.convertFormToVo(form, entity);
			
			//保存
			onlineStatusDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<OnlineStatusForm> search(Page<OnlineStatusForm> page, OnlineStatusForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from OnlineStatus ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = onlineStatusDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<OnlineStatusForm> list = OnlineStatusConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<OnlineStatusForm> search(Page<OnlineStatusForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<OnlineStatus> pg = onlineStatusDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<OnlineStatusForm> list = OnlineStatusConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}

	@Override
	public OnlineStatusForm getOnlineStatusByUserId(String userId) {
		if(null!=userId&&!"".equals(userId)){
			String hql="select ps from OnlineStatus ps where ps.userId=?";
			OnlineStatus onlineStatus=this.onlineStatusDao.findFirst(hql,new Object[]{userId});
			return OnlineStatusConvertor.convertVoToForm(onlineStatus);
		}
		return null;
	}
}