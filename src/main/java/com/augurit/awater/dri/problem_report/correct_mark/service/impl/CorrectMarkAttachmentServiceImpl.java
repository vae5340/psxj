package com.augurit.awater.dri.problem_report.correct_mark.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.augurit.awater.dri.problem_report.correct_mark.convert.CorrectMarkAttachmentConvertor;
import com.augurit.awater.dri.problem_report.correct_mark.dao.CorrectMarkAttachmentDao;
import com.augurit.awater.dri.problem_report.correct_mark.entity.CorrectMarkAttachment;
import com.augurit.awater.dri.problem_report.correct_mark.service.ICorrectMarkAttachmentService;
import com.augurit.awater.dri.problem_report.correct_mark.web.form.CorrectMarkAttachmentForm;
import com.augurit.awater.util.page.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.util.PropertyFilter;


@Service
@Transactional
public class CorrectMarkAttachmentServiceImpl implements ICorrectMarkAttachmentService {

	@Autowired
	private CorrectMarkAttachmentDao correctMarkAttachmentDao;
	
	/**
	 *删除附件
	 * */
	@Override
	public String deleteCorrAttach(String id) {
		JSONObject json = new JSONObject();
		try {
			if(StringUtils.isNotBlank(id)){
				Long formId = Long.parseLong(id);
				this.delete(formId);
				json.put("code", 200);
			}else{
				json.put("code", 300);
				json.put("message", "参数错误!");
			}
		} catch (NumberFormatException e) {
			json.put("code", 500);
			json.put("message", "参数类型错误!");
			e.printStackTrace();
		}
		return json.toString();
	}
	/**
	 * 根据markId获取列表信息
	 * */
	@Override
	public List<CorrectMarkAttachmentForm> getMarkId(String markId) {
		List<CorrectMarkAttachmentForm> list= new ArrayList();
		CorrectMarkAttachmentForm from= new CorrectMarkAttachmentForm();
		from.setMarkId(markId);
		Page page = new Page();
		page.setPageSize(20);
		page= this.search(page, from);
		return page.getResult()!=null? page.getResult() :list;
	}
	
	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public CorrectMarkAttachmentForm get(Long id) {
		CorrectMarkAttachment entity = correctMarkAttachmentDao.get(id);
		return CorrectMarkAttachmentConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		correctMarkAttachmentDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(CorrectMarkAttachmentForm... forms) {
		if(forms != null)
			for(CorrectMarkAttachmentForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(CorrectMarkAttachmentForm form){
		
		if(form != null){
			CorrectMarkAttachment entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = correctMarkAttachmentDao.get(form.getId());
			}else{
				entity = new CorrectMarkAttachment();
			}
			
			//属性值转换
			CorrectMarkAttachmentConvertor.convertFormToVo(form, entity);
			
			//保存
			correctMarkAttachmentDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<CorrectMarkAttachmentForm> search(Page<CorrectMarkAttachmentForm> page, CorrectMarkAttachmentForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from CorrectMarkAttachment ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			if(StringUtils.isNotBlank(form.getMarkId())){
				hql.append(" and ps.markId = :markId");
				values.put("markId", form.getMarkId());
			}
		}
		hql.append(" order by ps.attTime asc");
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = correctMarkAttachmentDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<CorrectMarkAttachmentForm> list = CorrectMarkAttachmentConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<CorrectMarkAttachmentForm> search(Page<CorrectMarkAttachmentForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<CorrectMarkAttachment> pg = correctMarkAttachmentDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<CorrectMarkAttachmentForm> list = CorrectMarkAttachmentConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	/**
	 * 批量删除图片
	 * */
	@Override
	public void deleteIds(String attachment) throws NumberFormatException {
		if(StringUtils.isNotBlank(attachment)){
			String[] ids = attachment.split(",");
			for(String id :ids){
				Long idLong = Long.parseLong(id);
				this.delete(idLong);
			}
		}
	}
}