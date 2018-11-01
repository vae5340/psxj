package com.augurit.awater.dri.psh.menpai.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.psh.basic.arcgis.PshHttpArcgisClient;
import com.augurit.awater.dri.psh.discharge.service.IPshDischargerService;
import com.augurit.awater.dri.psh.discharge.web.form.PshDischargerForm;
import com.augurit.awater.dri.psh.menpai.convert.PshMenpaiConvertor;
import com.augurit.awater.dri.psh.menpai.dao.PshMenpaiDao;
import com.augurit.awater.dri.psh.menpai.entity.PshMenpai;
import com.augurit.awater.dri.psh.menpai.service.IPshMenpaiService;
import com.augurit.awater.dri.psh.menpai.web.form.PshMenpaiForm;
import com.augurit.awater.util.PropertyFilter;
import com.augurit.awater.util.page.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class PshMenpaiServiceImpl implements IPshMenpaiService {

	@Autowired
	private PshMenpaiDao pshMenpaiDao;
	@Autowired
	private IPshDischargerService pshDischargerService;
	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public PshMenpaiForm get(Long id) {
		PshMenpai entity = pshMenpaiDao.get(id);
		return PshMenpaiConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		pshMenpaiDao.delete(ids);
	}
	/**
	 * 删除Form对象列表和图层
	 */
	@Override
	public void deleteAndToTc(PshMenpaiForm mpForm) {
		PshMenpai entity = new PshMenpai();
		PshMenpaiConvertor.convertFormToVo(mpForm, entity);
		pshMenpaiDao.delete(entity);
		
		Boolean flags =  PshHttpArcgisClient.deleteFeature(mpForm.getObjectId());
		if(!flags){
			throw new RuntimeException();
		}
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(PshMenpaiForm... forms) {
		if(forms != null)
			for(PshMenpaiForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(PshMenpaiForm form){
		
		if(form != null){
			PshMenpai entity = null;
			
			//准备VO对象
			if(form != null && form.getSGuid() != null){
				//entity = pshMenpaiDao.get(form.getId());
				entity = getSGuid(form.getSGuid());
			}else{
				entity = new PshMenpai();
			}
			
			//属性值转换
			PshMenpaiConvertor.convertFormToVo(form, entity);
			
			//保存
			pshMenpaiDao.save(entity);
			
			//回填ID属性值
			form.setSGuid(entity.getSGuid());
		}
	}
	/**
	 * 保存新增或修改的Form对象,并同步到图层
	 */
	@Override
	public void saveAndToTc(PshMenpaiForm form){
		boolean isAdd=false;
		if(form != null){
			PshMenpai entity = null;
			
			//准备VO对象
			if(form != null && form.getSGuid() != null){
				//entity = pshMenpaiDao.get(form.getId());
				isAdd=false;
				entity = getSGuid(form.getSGuid());
			}else{
				isAdd=true;
				entity = new PshMenpai();
				entity.setSGuid(java.util.UUID.randomUUID().toString());
			}
			
			//属性值转换
			PshMenpaiConvertor.convertFormToVo(form, entity);
			
			//保存
			pshMenpaiDao.save(entity);
			
			//回填ID属性值
			form.setSGuid(entity.getSGuid());
			//修改时，门牌下的排水户同步更新
			if(!isAdd){
				List<PshDischargerForm> pshDischargerList =pshDischargerService.getFormBySGuid(form.getSGuid());
				if(pshDischargerList!=null){
					for(PshDischargerForm pshDischargerForm : pshDischargerList){
						pshDischargerForm.setAddr(form.getSsxzqh()+form.getSsxzjd()+form.getMpwzhm());
						pshDischargerForm.setArea(form.getSsxzqh());
						pshDischargerForm.setTown(form.getSsxzjd());
						pshDischargerForm.setVillage(form.getSssqcjwh());
						pshDischargerForm.setStreet(form.getSsjlx());
						pshDischargerForm.setMph(form.getMpwzhm());
						pshDischargerForm.setJzwcode(form.getMpwzhm());
						pshDischargerService.save(pshDischargerForm);
					}
				}
			}
			//保存到图层
			/*if(isAdd){//新增
				MpFeatureForm feature = MpFormToFeatureConvertor
						.convertMpToForm(form);
				String features = MpFormToFeatureConvertor.convertFeatureToJson(feature);
				String result = PshHttpArcgisClient.addFeature(features);
				if("500".equals(result) || "300".equals(result)){
					throw new RuntimeException();
				}else{
					JSONObject json = JSONObject.fromObject(result);
					form.setObjectId(json.getString("objectId").toString());
					this.save(form);
				}
			}else{
				MpFeatureForm feature = MpFormToFeatureConvertor
						.convertMpToForm(form);
				feature.setUser_id(Long.valueOf(entity.getMarkPersonId()));
				String features = MpFormToFeatureConvertor.convertFeatureToJson(feature);
				String result = PshHttpArcgisClient.updateFeature(features);
				if("500".equals(result) || "300".equals(result)){
					throw new RuntimeException();
				}
			}*/
			
		}
	}
	/**
	 * 移动端修改
	 * */
	@Override
	public void updateForm(PshMenpaiForm f) {
		if(f!=null&&f.getSGuid()!=null){
			f.setState("1");
			f.setCheckPerson(null);
			f.setCheckPersonId(null);
			f.setCheckTime(null);
			f.setCheckDescription(null);
			f.setMarkTime(null);  //上报时间不修改
			f.setUpdateTime(new Date());
			f.setMarkPersonId(null);
			f.setMarkPerson(null);
			f.setLoginName(null);
			f.setTeamOrgId(null);
			f.setTeamOrgName(null);
			f.setDirectOrgId(null);
			f.setDirectOrgName(null);
			f.setParentOrgId(null);
			f.setParentOrgName(null);
			//f.setIstatue(null);
			f.setMpwzhm(f.getSsjlx()+f.getMpdzmc());
			f.setDzqc("广东省广州市"+f.getSsxzqh()+f.getSsjlx()+f.getMpdzmc());
			this.saveAndToTc(f);
		}
	}
	/**
	 * 根据门牌id获取实体
	 * */
	private PshMenpai getSGuid(String sGuid) {
		// 查询语句及参数
		List<PshMenpai> list = pshMenpaiDao.find("from PshMenpai ps where  ps.sGuid=?",sGuid);
		return list!=null && list.size()>0 ? list.get(0):null;
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<PshMenpaiForm> search(Page<PshMenpaiForm> page, PshMenpaiForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from PshMenpai ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = pshMenpaiDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<PshMenpaiForm> list = PshMenpaiConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<PshMenpaiForm> search(Page<PshMenpaiForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<PshMenpai> pg = pshMenpaiDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<PshMenpaiForm> list = PshMenpaiConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	/**
	 * 获取新增的门牌列表
	 */
	@Override
	@Transactional(readOnly = true)
	public Page<PshMenpaiForm> getMpList(Page<PshMenpaiForm> page, PshMenpaiForm form,Map<String, Object> map) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from PshMenpai ps where 1=1");
		StringBuffer sql = new StringBuffer("from Psh_Menpai ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form!=null){
			if(StringUtils.isNotBlank(form.getLoginName())){
				hql.append(" and ps.loginName = :loginName");
				sql.append(" and ps.login_Name = :loginName");
				values.put("loginName", form.getLoginName());
			}
			if(StringUtils.isNotBlank(form.getDzqc())){
				hql.append(" and ps.dzqc like :dzqc");
				sql.append(" and ps.dzqc like :dzqc");
				values.put("dzqc", "%"+form.getDzqc()+"%");
			}
			if(StringUtils.isNotBlank(form.getState())){
				hql.append(" and ps.state = :state");
				values.put("state", form.getState());
			}
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		hql.append(" order by markTime desc");
		// 执行分页查询操作
		Page pg = pshMenpaiDao.findPage(page, hql.toString(), values);
		
		Map<String,Object> getCheckNum = values;
		if(getCheckNum.containsKey("state")){
			getCheckNum.remove("state");
		}
		Long noCheck=pshMenpaiDao.countSqlResult(sql.toString()+" and (ps.state ='1' or ps.state ='' or ps.state is null)", getCheckNum);
		Long pass=pshMenpaiDao.countSqlResult(sql.toString()+" and ps.state ='2'", getCheckNum);
		Long doubt=pshMenpaiDao.countSqlResult(sql.toString()+" and ps.state ='3'", getCheckNum);
		map.put("no", noCheck);
		map.put("pass", pass);
		map.put("doubt", doubt);
		// 转换为Form对象列表并赋值到原分页对象中
		List<PshMenpaiForm> list = PshMenpaiConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据门牌id获取
	 * */
	public  PshMenpaiForm getBySGuid(String sGuid) {
		// 查询语句及参数
		List<PshMenpai> list = pshMenpaiDao.find("from PshMenpai ps where  ps.sGuid=?",sGuid);
		return list!=null && list.size()>0 ? PshMenpaiConvertor.convertVoToForm(list.get(0)):null;
	}
	
	/**
	 * 根据houseId获取
	 * */
	@Override
	public PshMenpaiForm getByHouseId(String houseId) {
		// 查询语句及参数
		String hql=" select ps from PshMenpai ps,ExShuiwuHouseForm a,ExShuiwuHousebuildForm b"+
				" where a.housebuildId=b.id and b.doorplateAddressCode=ps.dzdm and a.id=?";
		List<PshMenpai> list = pshMenpaiDao.find(hql,houseId);
		return list!=null ? PshMenpaiConvertor.convertVoToForm(list.get(0)):null;
	}
}