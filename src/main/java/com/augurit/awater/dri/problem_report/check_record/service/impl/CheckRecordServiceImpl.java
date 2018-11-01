package com.augurit.awater.dri.problem_report.check_record.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.augurit.awater.dri.problem_report.check_record.convert.CheckRecordConvertor;
import com.augurit.awater.dri.problem_report.check_record.dao.CheckRecordDao;
import com.augurit.awater.dri.problem_report.check_record.entity.CheckRecord;
import com.augurit.awater.dri.problem_report.check_record.service.ICheckRecordService;
import com.augurit.awater.dri.problem_report.check_record.web.form.CheckRecordForm;
import com.augurit.awater.util.page.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.util.PropertyFilter;


@Service
@Transactional
public class CheckRecordServiceImpl implements ICheckRecordService {

	@Autowired
	private CheckRecordDao checkRecordDao;
	
	/**********************TODO 移动端代码**********************/
	@Override
	public String toCheckRecord(String reportType, String reportId) {
		JSONObject json = new JSONObject();
		JSONArray jsonArr=null;
		if(StringUtils.isNotBlank(reportType) && StringUtils.isNotBlank(reportId)){
			CheckRecordForm form = new CheckRecordForm();
			form.setReportType(reportType);
			form.setReportId(reportId);
			List<CheckRecordForm> listForm =this.searchForm(form);
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
	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public CheckRecordForm get(Long id) {
		CheckRecord entity = checkRecordDao.get(id);
		return CheckRecordConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		checkRecordDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(CheckRecordForm... forms) {
		if(forms != null)
			for(CheckRecordForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(CheckRecordForm form){
		
		if(form != null){
			CheckRecord entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = checkRecordDao.get(form.getId());
			}else{
				entity = new CheckRecord();
			}
			
			//属性值转换
			CheckRecordConvertor.convertFormToVo(form, entity);
			
			//保存
			checkRecordDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<CheckRecordForm> search(Page<CheckRecordForm> page, CheckRecordForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from CheckRecord ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = checkRecordDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<CheckRecordForm> list = CheckRecordConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<CheckRecordForm> search(Page<CheckRecordForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<CheckRecord> pg = checkRecordDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<CheckRecordForm> list = CheckRecordConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	/**
	 * 倒序查询审核记录
	 * */
	public List<CheckRecordForm> searchForm(CheckRecordForm form){
		List<CheckRecord> list = new ArrayList<>();
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from CheckRecord ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		// 查询条件
		if(form != null){
			if(StringUtils.isNotBlank(form.getReportType())){
				hql.append(" and ps.reportType=:reportType");
				values.put("reportType", form.getReportType());
			}
			if(StringUtils.isNotBlank(form.getReportId())){
				hql.append(" and ps.reportId=:reportId");
				values.put("reportId", form.getReportId());
			}
		}
		hql.append(" order by ps.checkTime desc");
		list = checkRecordDao.find(hql.toString(), values);
		if(list.size()>0)
			return CheckRecordConvertor.convertVoListToFormList(list);
		else
			return null;
	}
}