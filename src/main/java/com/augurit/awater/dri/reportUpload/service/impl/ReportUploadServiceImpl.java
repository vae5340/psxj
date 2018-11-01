package com.augurit.awater.dri.reportUpload.service.impl;

import com.augurit.awater.dri.reportUpload.convert.ReportUploadConvertor;
import com.augurit.awater.dri.reportUpload.dao.ReportUploadDao;
import com.augurit.awater.dri.reportUpload.entity.ReportUpload;
import com.augurit.awater.dri.reportUpload.service.IReportUploadService;
import com.augurit.awater.dri.reportUpload.web.form.ReportUploadForm;
import com.augurit.awater.util.page.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import net.sf.json.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.util.PropertyFilter;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ReportUploadServiceImpl implements IReportUploadService {

	@Autowired
	private ReportUploadDao reportUploadDao;
	
	/**添加附件*/
	@Override
	public void saveForm(Map<String, Object> form) {
		ReportUploadForm f = new ReportUploadForm();
		f.setObjectId(form.get("objectId").toString());
		f.setLayerName(form.get("layerName").toString());
		f.setAttachName(form.get("attachName").toString());
		f.setFilePath(form.get("filePath").toString());
		f.setUploadTime((Date) form.get("uploadTime"));
		f.setType(form.get("type").toString());
		save(f);
	}
	
	/**删除附件*/
	@Override
	public String deleteFile(Long id,String attachName) {
		JSONObject json = new JSONObject();
		ReportUploadForm form = this.get(id);
		if(form!=null && form.getAttachName().equals(attachName)){
			this.delete(id);
			json.put("status", 200);
		}else{
			json.put("status", 300);
			json.put("message", "参数错误!");
		}
		return json.toString();
	}
	
	/**获取符合条件的全部列表*/
	@Override
	public String getFiles(String path,String objectId, String layerName) {
		JSONObject json = new JSONObject();
		if(StringUtils.isNotBlank(objectId)&&StringUtils.isNotBlank(layerName)){
			ReportUploadForm form = new ReportUploadForm();
			form.setObjectId(objectId);
			form.setLayerName(layerName);
			Page<ReportUploadForm> page = this.search(new Page(), form);
			if(page.getResult()!=null){
				for(ReportUploadForm f :page.getResult()){
					f.setFilePath(path+f.getFilePath());
				}
			}
			json.put("status", 200);
			json.put("rows", page.getResult());
			json.put("total", page.getTotalItems());
		}else{
			json.put("status", 300);
			json.put("message", "格式不正确!");
		}
		return json.toString();
	}
	
	
	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public ReportUploadForm get(Long id) {
		ReportUpload entity = reportUploadDao.get(id);
		return ReportUploadConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		reportUploadDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(ReportUploadForm... forms) {
		if(forms != null)
			for(ReportUploadForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(ReportUploadForm form){
		
		if(form != null){
			ReportUpload entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = reportUploadDao.get(form.getId());
			}else{
				entity = new ReportUpload();
			}
			
			//属性值转换
			ReportUploadConvertor.convertFormToVo(form, entity);
			
			//保存
			reportUploadDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<ReportUploadForm> search(Page<ReportUploadForm> page, ReportUploadForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from ReportUpload ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			if(StringUtils.isNotBlank(form.getObjectId())){
				hql.append(" and ps.objectId = :objectId");
				values.put("objectId", form.getObjectId());
			}
			if(StringUtils.isNotBlank(form.getLayerName())){
				hql.append(" and ps.layerName = :layerName");
				values.put("layerName", form.getLayerName());
			}
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = reportUploadDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<ReportUploadForm> list = ReportUploadConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<ReportUploadForm> search(Page<ReportUploadForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<ReportUpload> pg = reportUploadDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<ReportUploadForm> list = ReportUploadConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}

}