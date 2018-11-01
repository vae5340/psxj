package com.augurit.awater.dri.psh.discharge.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.psh.basic.web.form.ExGongan77DzMpdyForm;
import com.augurit.awater.dri.psh.discharge.arcgis.PshLxHttpArcgisClient;
import com.augurit.awater.dri.psh.discharge.convert.PshDischargerWellConvertor;
import com.augurit.awater.dri.psh.discharge.dao.PshDischargerWellDao;
import com.augurit.awater.dri.psh.discharge.entity.PshDischargerWell;
import com.augurit.awater.dri.psh.discharge.service.IPshDischargerWellService;
import com.augurit.awater.dri.psh.discharge.web.form.PshDischargerForm;
import com.augurit.awater.dri.psh.discharge.web.form.PshDischargerWellForm;
import com.augurit.awater.dri.psh.menpai.service.IPshMenpaiService;
import com.augurit.awater.dri.psh.menpai.web.form.PshMenpaiForm;
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
public class PshDischargerWellServiceImpl implements IPshDischargerWellService {

	@Autowired
	private PshDischargerWellDao pshDischargerWellDao;
	@Autowired
	private IPshMenpaiService pshMenpaiService;
	/*@Autowired
	private IExGongan77DzMpdyService exGongan77DzMpdyService;*/
	
	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public PshDischargerWellForm get(Long id) {
		PshDischargerWell entity = pshDischargerWellDao.get(id);
		return PshDischargerWellConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		pshDischargerWellDao.delete(ids);
	}
	
	/**
	 * 删除Form对象列表与连线图层
	 */
	@Override
	public void deleteAndToTc(Long... ids) {
		if(ids.length>0){
			for(Long id : ids){
				PshDischargerWellForm form=get(id);
				pshDischargerWellDao.delete(id);
				if(StringUtils.isNotBlank(form.getLxId())){
					Boolean flags =  PshLxHttpArcgisClient.deleteFeature(form.getLxId());
					if(!flags){
						throw new RuntimeException();
					}
				}
			}
		}
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(PshDischargerWellForm... forms) {
		if(forms != null)
			for(PshDischargerWellForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(PshDischargerWellForm form){
		
		if(form != null){
			PshDischargerWell entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = pshDischargerWellDao.get(Long.parseLong(form.getId()));
			}else{
				entity = new PshDischargerWell();
			}
			
			//属性值转换
			PshDischargerWellConvertor.convertFormToVo(form, entity);
			
			//保存
			pshDischargerWellDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
		}
	}
	/**
	 * 保存新增或修改的Form对象并保存到连线图层
	 */
	@Override
	public void saveAndToTc(PshDischargerWellForm form, PshDischargerForm dischargerForm, String isExist){
		boolean isAdd=false;
		if(form != null){
			PshDischargerWell entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				isAdd=false;
				entity = pshDischargerWellDao.get(Long.parseLong(form.getId()));
			}else{
				isAdd=true;
				entity = new PshDischargerWell();
			}
			
			//属性值转换
			PshDischargerWellConvertor.convertFormToVo(form, entity);
			
			//保存
			pshDischargerWellDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
			
			//保存到图层
			Double x = null,y=null;
			if("0".equals(isExist)){//新增门牌
				PshMenpaiForm pshMenpaiForm = pshMenpaiService.getBySGuid(dischargerForm.getDoorplateAddressCode());
				if(pshMenpaiForm != null){
					x=pshMenpaiForm.getZxjd();
					y=pshMenpaiForm.getZxwd();
				}
			}else{
				/*ExGongan77DzMpdyForm mpFrom = exGongan77DzMpdyService.getBySGuid(dischargerForm.getDoorplateAddressCode());
				if(mpFrom != null){
					x=mpFrom.getZxjd();
					y=mpFrom.getZxwd();
				}else{
					PshMenpaiForm pshMenpaiForm = pshMenpaiService.getBySGuid(dischargerForm.getDoorplateAddressCode());
					if(pshMenpaiForm != null){
						x=pshMenpaiForm.getZxjd();
						y=pshMenpaiForm.getZxwd();
					}
				}*/
			}
			if(x==null || y==null){
				throw new RuntimeException();
			}
			if(isAdd){//新增
				String features = convertFeatureToJson(form,dischargerForm,x,y);
				if(StringUtils.isNotBlank(features)){
					String result = PshLxHttpArcgisClient.addFeature(features);
					if(!"500".equals(result) && !"300".equals(result)){
						JSONObject json = JSONObject.fromObject(result);
						form.setLxId(json.getString("objectId"));
						save(form);
					}else{
						throw new RuntimeException();
					}
				}
			}else{//修改
				Double jX=form.getX();
				Double jY=form.getY();
				form=get(Long.parseLong(form.getId()));
				form.setX(jX);
				form.setY(jY);
				// 同步图层操作
				if (StringUtils.isNotBlank(form.getLxId())) {
					String features = convertFeatureToJson(form,dischargerForm,x,y);
					if(StringUtils.isNotBlank(features)){
						String result = PshLxHttpArcgisClient.updateFeature(features);
						if(!"500".equals(result) && !"300".equals(result)){
							
						}else{
							throw new RuntimeException();
						}
					}
					
				} else {// 可能存在未同步情况（修改顺便同步）
					String features = convertFeatureToJson(form,dischargerForm,x,y);
					if(StringUtils.isNotBlank(features)){
						String result = PshLxHttpArcgisClient.addFeature(features);
						if(!"500".equals(result) && !"300".equals(result)){
							JSONObject json = JSONObject.fromObject(result);
							form.setLxId(json.getString("objectId"));
							save(form);
						}else{
							throw new RuntimeException();
						}
					}
				}
			}
		}
	}
	//转成图层保存json字符串
	private  String convertFeatureToJson(PshDischargerWellForm form,PshDischargerForm dischargerForm,Double x,Double y) {
		
		JSONArray jsonArray = new JSONArray();
		if(form!=null){
			Map<String, Object> feature = new HashMap<String, Object>();
			Map<String, Object> map = new HashMap<String, Object>();
			Map<String, Object> formMap = new HashMap<String, Object>();
			List paths = new ArrayList<>();
			List<List<Double>> line = new ArrayList<>();
			List<Double> point1= new ArrayList<>();
			List<Double> point2= new ArrayList<>();
			point1.add(x);
			point1.add(y);
			point2.add(form.getX());
			point2.add(form.getY());
			line.add(point1);
			line.add(point2);
			paths.add(line);
			formMap.put("objectid", (form.getLxId()==null||"".equals(form.getLxId()))?null:Long.valueOf(form.getLxId()));
			formMap.put("mpid",dischargerForm.getDoorplateAddressCode() );
			formMap.put("pshid",form.getDischargeId() );
			formMap.put("jbjid",form.getWellId() );
			formMap.put("type",form.getPipeType() );
			//map.put("type", "polyline");
			map.put("paths", paths);
			feature.put("attributes", formMap);
			//接驳井坐标是null，修改时不改图层要素图形
			if(form.getX()!=null && form.getY()!=null && form.getX()!=0 && form.getY()!=0){
				feature.put("geometry", map);
			}
			jsonArray.add(feature);
			return jsonArray.toString();
		}else{
			return null;
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<PshDischargerWellForm> search(Page<PshDischargerWellForm> page, PshDischargerWellForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from PshDischargerWell ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = pshDischargerWellDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<PshDischargerWellForm> list = PshDischargerWellConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<PshDischargerWellForm> search(Page<PshDischargerWellForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<PshDischargerWell> pg = pshDischargerWellDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<PshDischargerWellForm> list = PshDischargerWellConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}

	@Override
	public List<PshDischargerWellForm> getAffList(String dischargeId) {
		List<PshDischargerWellForm> list= new ArrayList<>();
		if(dischargeId != null&&!("").equals(dischargeId)){
			List<PshDischargerWell> listAff = pshDischargerWellDao.findBy("dischargeId", dischargeId);
			if(listAff!=null&& listAff.size()>0)
				return PshDischargerWellConvertor.convertVoListToFormList(listAff);
			else
				return list;
		}else{
			return list;
		}
	}
	/**
	 * 根据门牌号Id查询接驳井信息
	 */
	@Override
	public List<Map<String,Object>> getFormBySGuid(String sGuid) {
		StringBuffer sql = new StringBuffer("select distinct(ps.well_id) objectId from Psh_Discharger_Well ps,PSH_DISCHARGER t where ps.discharge_id=t.id ");
		if(StringUtils.isNotBlank(sGuid)){
			sql.append(" and t.doorplate_address_code ='"+sGuid+"'");
		}
		List<Map<String,Object>> list= new ArrayList<Map<String,Object>>();
		list= pshDischargerWellDao.getSession().createSQLQuery(sql.toString()).list();
		if(list != null && list.size()>0){
			return list;
		}
		return new ArrayList<Map<String,Object>>();
	}
	/**
	 * 根据objectId查询接驳井与排水户的关联情况
	 */
	@Override
	public List<PshDischargerWellForm> getFormByObjectId(String objectId) {
		StringBuffer hql = new StringBuffer("from PshDischargerWell ps where 1=1 ");
		Map<String,Object> values = new HashMap<String,Object>();
		if(StringUtils.isNotBlank(objectId)){
			hql.append(" and ps.wellId = :objectId");
			values.put("objectId", objectId);
		}
		List<PshDischargerWell> list = pshDischargerWellDao.find(hql.toString(), values);
		if(list != null && list.size()>0){
			return PshDischargerWellConvertor.convertVoListToFormList(list);
		}
		return null;
	}
}