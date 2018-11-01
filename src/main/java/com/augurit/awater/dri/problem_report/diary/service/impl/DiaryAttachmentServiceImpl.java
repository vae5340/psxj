package com.augurit.awater.dri.problem_report.diary.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.augurit.awater.dri.problem_report.diary.convert.DiaryAttachmentConvertor;
import com.augurit.awater.dri.problem_report.diary.dao.DiaryAttachmentDao;
import com.augurit.awater.dri.problem_report.diary.entity.DiaryAttachment;
import com.augurit.awater.dri.problem_report.diary.service.IDiaryAttachmentService;
import com.augurit.awater.dri.problem_report.diary.web.form.DiaryAttachmentForm;
import com.augurit.awater.util.PropertyFilter;
import com.augurit.awater.util.page.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.augurit.awater.common.page.Page;


@Service
@Transactional
public class DiaryAttachmentServiceImpl implements IDiaryAttachmentService {

	@Autowired
	private DiaryAttachmentDao diaryAttachmentDao;
	
	/**
	 * 删除附件
	 * */
	@Override
	public String deleteDiaryAttach(String id) {
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
	 * 批量删除图片
	 * */
	@Override
	public void deleteIds(String attachment) throws NumberFormatException{
		if(StringUtils.isNotBlank(attachment)){
			String[] ids = attachment.split(",");
			for(String id :ids){
				Long idLong = Long.parseLong(id);
				this.delete(idLong);
			}
		}

	}
	/**
	 * 获取附件
	 * */
	@Override
	public List<DiaryAttachmentForm> getMarkId(String markId) {
		List<DiaryAttachmentForm> list= new ArrayList();
		DiaryAttachmentForm from= new DiaryAttachmentForm();
		from.setMarkId(markId);
		Page page = this.search(new Page(), from);
		return page.getResult()!=null? page.getResult() :list;
	}
	
	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public DiaryAttachmentForm get(Long id) {
		DiaryAttachment entity = diaryAttachmentDao.get(id);
		return DiaryAttachmentConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		diaryAttachmentDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(DiaryAttachmentForm... forms) {
		if(forms != null)
			for(DiaryAttachmentForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(DiaryAttachmentForm form){
		
		if(form != null){
			DiaryAttachment entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = diaryAttachmentDao.get(form.getId());
			}else{
				entity = new DiaryAttachment();
			}
			
			//属性值转换
			DiaryAttachmentConvertor.convertFormToVo(form, entity);
			
			//保存
			diaryAttachmentDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<DiaryAttachmentForm> search(Page<DiaryAttachmentForm> page, DiaryAttachmentForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from DiaryAttachment ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			if(StringUtils.isNotBlank(form.getMarkId())){
				hql.append(" and ps.markId=:markId");
				values.put("markId", form.getMarkId());
			}
		}
		hql.append(" order by ps.attTime desc");
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = diaryAttachmentDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<DiaryAttachmentForm> list = DiaryAttachmentConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<DiaryAttachmentForm> search(Page<DiaryAttachmentForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<DiaryAttachment> pg = diaryAttachmentDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<DiaryAttachmentForm> list = DiaryAttachmentConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
}