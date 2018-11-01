package com.augurit.awater.dri.psh.checkRecord.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.psh.checkRecord.convert.PshCheckRecordConvertor;
import com.augurit.awater.dri.psh.checkRecord.dao.PshCheckRecordDao;
import com.augurit.awater.dri.psh.checkRecord.entity.PshCheckRecord;
import com.augurit.awater.dri.psh.checkRecord.service.IPshCheckRecordService;
import com.augurit.awater.dri.psh.checkRecord.web.form.PshCheckRecordForm;
import com.augurit.awater.util.PropertyFilter;
import com.augurit.awater.util.page.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class PshCheckRecordServiceImpl implements IPshCheckRecordService {

	@Autowired
	private PshCheckRecordDao pshCheckRecordDao;
	
	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public PshCheckRecordForm get(Long id) {
		PshCheckRecord entity = pshCheckRecordDao.get(id);
		return PshCheckRecordConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		pshCheckRecordDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(PshCheckRecordForm... forms) {
		if(forms != null)
			for(PshCheckRecordForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(PshCheckRecordForm form){
		
		if(form != null){
			PshCheckRecord entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = pshCheckRecordDao.get(form.getId());
			}else{
				entity = new PshCheckRecord();
			}
			
			//属性值转换
			PshCheckRecordConvertor.convertFormToVo(form, entity);
			
			//保存
			pshCheckRecordDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<PshCheckRecordForm> search(Page<PshCheckRecordForm> page, PshCheckRecordForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from PshCheckRecord ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = pshCheckRecordDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<PshCheckRecordForm> list = PshCheckRecordConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<PshCheckRecordForm> search(Page<PshCheckRecordForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<PshCheckRecord> pg = pshCheckRecordDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<PshCheckRecordForm> list = PshCheckRecordConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 倒序查询审核记录
	 * */
	public List<PshCheckRecordForm> searchForm(PshCheckRecordForm form){
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from PshCheckRecord ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		// 查询条件
		if(form != null){
			if(StringUtils.isNotBlank(form.getReportEntity())){
				hql.append(" and ps.reportEntity=:reportEntity");
				values.put("reportEntity", form.getReportEntity());
			}
			if(form.getReportId()!=null){
				hql.append(" and ps.reportId=:reportId");
				values.put("reportId", form.getReportId());
			}
		}
		hql.append(" order by ps.checkTime desc");
		List<PshCheckRecord> list  = pshCheckRecordDao.find(hql.toString(), values);
		if(list.size()>0)
			return PshCheckRecordConvertor.convertVoListToFormList(list);
		else
			return null;
	}

	/**
	 * 查询审核意见
	 */
	@Override
	public String toCheckRecord(String reportEntity, String reportId) {
		JSONObject json = new JSONObject();
		JSONArray jsonArr=null;
		if(StringUtils.isNotBlank(reportId)){
			PshCheckRecordForm form = new PshCheckRecordForm();
			form.setReportEntity(reportEntity);
			form.setReportId(Long.valueOf(reportId));
			List<PshCheckRecordForm> listForm =this.searchForm(form);
			if(listForm!=null&&listForm.size()>0)
				jsonArr = JSONArray.fromObject(listForm);
			if(jsonArr!=null&& jsonArr.size()>0){
				for(Object js : jsonArr){
					if(js!=null){
						JSONObject j = (JSONObject) js;
						if(j.containsKey("checkTime")){
//							System.out.println(j.get("checkTime"));
							Map<String, Object> m = (Map<String, Object>) j.get("checkTime");
							if(m.containsKey("time"))
								j.put("checkTime",m.get("time"));
						}
					}
				}
				json.put("data", jsonArr);
			}
			json.put("code", 200);
		}else{
			json.put("code", 500);
			json.put("message", "请求参数错误!");
		}
		return json.toString();
	}
}