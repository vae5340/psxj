package com.augurit.awater.dri.psh.basic.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.psh.basic.convert.ExGongan77DzMpdyConvertor;
import com.augurit.awater.dri.psh.basic.convert.ExShuiwuHouseFormConvertor;
import com.augurit.awater.dri.psh.basic.convert.ExShuiwuHousebuildFormConvertor;
import com.augurit.awater.dri.psh.basic.dao.ExGongan77DzMpdyDao;
import com.augurit.awater.dri.psh.basic.entity.ExGongan77DzMpdy;
import com.augurit.awater.dri.psh.basic.entity.ExShuiwuHouseForm;
import com.augurit.awater.dri.psh.basic.entity.ExShuiwuHousebuildForm;
import com.augurit.awater.dri.psh.basic.service.IExGongan77DzMpdyService;
import com.augurit.awater.dri.psh.basic.web.form.*;
import com.augurit.awater.util.PropertyFilter;
import com.augurit.awater.util.page.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import com.augurit.awater.util.sql.SqlPageUtils;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class ExGongan77DzMpdyServiceImpl implements IExGongan77DzMpdyService {

	@Autowired
	private ExGongan77DzMpdyDao exGongan77DzMpdyDao;
	
	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public ExGongan77DzMpdyForm get(Long id) {
		ExGongan77DzMpdy entity = exGongan77DzMpdyDao.get(id);
		return ExGongan77DzMpdyConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		exGongan77DzMpdyDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(ExGongan77DzMpdyForm... forms) {
		if(forms != null)
			for(ExGongan77DzMpdyForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(ExGongan77DzMpdyForm form){
		
		if(form != null){
			ExGongan77DzMpdy entity = null;
			
			//准备VO对象form.setSGuid(entity.getSGuid())
			if(form != null && form.getSGuid() != null){
				//entity = exGongan77DzMpdyDao.get(form.getSGuid());
				entity = getSGuid(form.getSGuid());
			}else{
				entity = new ExGongan77DzMpdy();
				//entity.setSGuid(java.util.UUID.randomUUID().toString());
				//System.out.println(java.util.UUID.randomUUID());
			}
			
			//属性值转换
			ExGongan77DzMpdyConvertor.convertFormToVo(form, entity);
			
			//保存
			exGongan77DzMpdyDao.save(entity);
			
			//回填ID属性值
			form.setSGuid(entity.getSGuid());
			//保存到图层
			/*MpFeatureForm feature = MpFormToFeatureConvertor
					.convertMpToForm(form);
			String features = MpFormToFeatureConvertor.convertFeatureToJson(feature);
			String result = PshHttpArcgisClient.addFeature(features);
			if("500".equals(result) || "300".equals(result)){
				throw new RuntimeException();
			}*/
			
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<ExGongan77DzMpdyForm> search(Page<ExGongan77DzMpdyForm> page, ExGongan77DzMpdyForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from ExGongan77DzMpdy ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			if (form.getSGuid()!=null && !"".equals(form.getSGuid())) {
				hql.append(" and ps.sGuid=:mp1");
				values.put("mp1", form.getSGuid());
			}
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = exGongan77DzMpdyDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<ExGongan77DzMpdyForm> list = ExGongan77DzMpdyConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<ExGongan77DzMpdyForm> search(Page<ExGongan77DzMpdyForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<ExGongan77DzMpdy> pg = exGongan77DzMpdyDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<ExGongan77DzMpdyForm> list = ExGongan77DzMpdyConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 通过门牌获取所有的子表信息
	 * */
	public ExGongan77DzMpdyForm getAllInf(Page<ExGongan77DzMpdyForm> page,ExGongan77DzMpdyForm form){
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from ExGongan77DzMpdy ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		// 查询条件
		if(form != null){
			if (form.getMpdzbm()!=null && !"".equals(form.getMpdzbm())) {
				hql.append(" and ps.mpdzbm=:mp1");
				values.put("mp1", form.getMpdzbm());
			}
			if (form.getSmzt()!=null && !"".equals(form.getSmzt())) {
				hql.append(" and ps.smzt=:mp2");
				values.put("mp2", form.getSmzt());
			}
			if (form.getZxzt()!=null && !"".equals(form.getZxzt())) {
				hql.append(" and ps.zxzt=:mp3");
				values.put("mp3", form.getZxzt());
			}
			if (form.getDzxxd()!=null && !"".equals(form.getDzxxd())) {
				hql.append(" and ps.dzxxd=:mp4");
				values.put("mp4", form.getDzxxd());
			}
		}
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		// 执行分页查询操作
		Page pg = exGongan77DzMpdyDao.findPage(page, hql.toString(), values);
		// 转换为Form对象列表并赋值到原分页对象中
		List<ExGongan77DzMpdyForm> list = ExGongan77DzMpdyConvertor.convertVoListToFormList(pg.getResult());
		//第二步，超找栋信息
		List<ExShuiwuHousebuildFormForm> list1 =null;
		if(list!=null && list.size()>0){
			for (ExGongan77DzMpdyForm mp:list) {
				StringBuffer hql1 = new StringBuffer("from ExShuiwuHousebuildForm ps where ps.doorplateAddressCode=?");
				List<ExShuiwuHousebuildForm> list11 = exGongan77DzMpdyDao.find(hql1.toString(),mp.getDzdm());
				list1= ExShuiwuHousebuildFormConvertor.convertVoListToFormList(list11);
				mp.setBuildList(list1);//封装到栋
			}
		}
		//第三步，查找房屋
		List<ExShuiwuHouseFormForm> list2 = null;
		if(list1!=null && list1.size()>0){
			for (ExShuiwuHousebuildFormForm mp:list1) {
				StringBuffer hql2 = new StringBuffer("from ExShuiwuHouseForm ps where ps.housebuildId=?");
				List<ExShuiwuHouseForm> list22 = exGongan77DzMpdyDao.find(hql2.toString(),mp.getId());
				list2= ExShuiwuHouseFormConvertor.convertVoListToFormList(list22);
				mp.setHouseList(list2);
			}
		}
		//第四步，查找人查找单位
		List<ExShuiwuPopHouseFormForm> list3 = null;
		List<ExShuiwuUnitHouseFormForm> list4 = null;
		if(list2!=null && list2.size()>0){
			for (ExShuiwuHouseFormForm mp:list2) {
				StringBuffer hql3 = new StringBuffer("from ExShuiwuPopHouseForm ps where ps.houseId=?");
				list3 = exGongan77DzMpdyDao.find(hql3.toString(),mp.getId());
				mp.setPopList(list3);
				StringBuffer hql4 = new StringBuffer("from ExShuiwuUnitHouseForm ps where ps.houseId=?");
				list4 = exGongan77DzMpdyDao.find(hql4.toString(),mp.getId());
				mp.setUnitList(list4);
			}
		}
		
		return null;
	}
	
	/**
	 * 根据根据地址代码获取获取
	 * */
	@Override
	public ExGongan77DzMpdyForm getByDzdm(String dzdm) {
		// 查询语句及参数
		List<ExGongan77DzMpdy> list = exGongan77DzMpdyDao.find("from ExGongan77DzMpdy ps where  ps.dzdm=?",dzdm);
		return list!=null && list.size()>0 ? ExGongan77DzMpdyConvertor.convertVoToForm(list.get(0)):null;
	}
	/**
	 * 根据门牌id获取
	 * */
	public ExGongan77DzMpdyForm getBySGuid(String sGuid) {
		// 查询语句及参数
		List<ExGongan77DzMpdy> list = exGongan77DzMpdyDao.find("from ExGongan77DzMpdy ps where  ps.sGuid=?",sGuid);
		return list!=null && list.size()>0 ? ExGongan77DzMpdyConvertor.convertVoToForm(list.get(0)):null;
	}
	
	/**
	 * 根据门牌id获取
	 * */
	private ExGongan77DzMpdy getSGuid(String sGuid) {
		// 查询语句及参数
		List<ExGongan77DzMpdy> list = exGongan77DzMpdyDao.find("from ExGongan77DzMpdy ps where  ps.sGuid=?",sGuid);
		return list!=null && list.size()>0 ? list.get(0):null;
	}
	/**
	 * 根据houseId获取
	 * */
	@Override
	public ExGongan77DzMpdyForm getByHouseId(String houseId) {
		// 查询语句及参数
		String hql=" select ps from ExGongan77DzMpdy ps,ExShuiwuHouseForm a,ExShuiwuHousebuildForm b"+
				" where a.housebuildId=b.id and b.doorplateAddressCode=ps.dzdm and a.id=?";
		List<ExGongan77DzMpdy> list = exGongan77DzMpdyDao.find(hql,houseId);
		return list!=null ? ExGongan77DzMpdyConvertor.convertVoToForm(list.get(0)):null;
	}


	
	/**
	 * 修改sde门牌状态
	 * */
	@Override
	public int updateStatue(String sGuid,Long istatue) {
		int count=0;
		if (StringUtils.isNotBlank(sGuid) && istatue != null) {
			// 查询语句及参数
			String hql=" update sbss.ex_gongan_77_dz_mpdy m set m.istatue=? where m.s_Guid=?";
			count= exGongan77DzMpdyDao.createSQLQuery(hql, istatue,sGuid).executeUpdate();
			hql=" update sde.menpai m set m.istatue=? where m.s_Guid=?";
			count += exGongan77DzMpdyDao.createSQLQuery(hql, istatue,sGuid).executeUpdate();
		}
		return count;
	}

	/**
	 * 调查完毕istatue：3，部分调查istatue：2
	 */
	@Override
	public int updateMpState(String sGuid, String investPersonId, String isExist,Long istatue) {
		int count=0;
		if (StringUtils.isNotBlank(sGuid) && istatue != null) {
			String hql=" update sde.menpai m set m.istatue=? where m.s_Guid=?";
			count= exGongan77DzMpdyDao.createSQLQuery(hql, istatue ,sGuid).executeUpdate();
			if("0".equals(isExist)){//新增门牌
				hql=" update psh_menpai  set istatue=?,invest_person_id=?,invert_time=sysdate where s_Guid=?";
				 count += exGongan77DzMpdyDao.createSQLQuery(hql, istatue,investPersonId,sGuid).executeUpdate();
			}else{
				hql=" update sbss.ex_gongan_77_dz_mpdy m set m.istatue=?,m.invest_person_id=?,m.invert_time=sysdate where m.s_Guid=?";
				count += exGongan77DzMpdyDao.createSQLQuery(hql, istatue,investPersonId,sGuid).executeUpdate();
			} 
		}
		return count;
	}
	
	@Transactional(readOnly = true)
	@Override
	/**
	 * 排水户分页查询
	 */
	public String getMpList(OpuOmUserInfo userForm, Page<ExGongan77DzMpdyForm> page, ExGongan77DzMpdyForm form) {
		JSONObject json = new JSONObject();
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("select * from ("
				+ " select a.s_guid,a.dzqc,a.mpwzhm,a1.mc ssjlx,a2.mc sssqcjwh,a3.mc ssxzjd,a4.mc ssxzqh,'no' isBySelf "
				+ " from sde.menpai a,"
				+ " sbss.ex_gongan_76_dz_jlx a1,"
				+ " sbss.ex_gongan_78_dz_qjw a2,"
				+ " sbss.ex_gongan_79_dz_xzjd a3,"
				+ " sbss.ex_gongan_80_dz_xzqh a4  where to_char(a.ssjlxdm)=a1.dm"  
				+ " and to_char(a.sssqcjwhdm)=a2.dm and to_char(a.ssxzjddm)=a3.dm and to_char(a.ssxzqhdm)=a4.dm"
				+ " and a.isexist=0 "
				+ " union all"
				+ " select b.s_guid,b.dzqc,b.mpwzhm,to_char(b.ssjlx),to_char(b.sssqcjwh),to_char(b.ssxzjd),to_char(b.ssxzqh) ,'yes' isBySelf  "
				+ " from sde.menpai b where b.isexist=1"
				+ " ) ps where 1=1 ");
		Map<String,Object> values = new HashMap<String,Object>();
		// 查询条件
		if(form != null){
			if(StringUtils.isNotBlank(form.getDzqc())){
				hql.append(" and ps.dzqc like :dzqc");
				values.put("dzqc", "%"+form.getDzqc()+"%");
			}
			if(StringUtils.isNotBlank(form.getMpwzhm())){
				hql.append(" and ps.mpwzhm like :mpwzhm");
				values.put("mpwzhm", "%"+form.getMpwzhm()+"%");
			}
			if(StringUtils.isNotBlank(form.getSsxzqhdm())){
				hql.append(" and ps.dzqc like :ssxzqhdm");
				values.put("ssxzqhdm", "%"+form.getSsxzqhdm()+"%");
			}
		}
		//排序
		//hql.append(" order by ps.markTime desc");
		
		// 执行分页查询操作
		String sql = SqlPageUtils.getPageSql(page, hql.toString());//带上分页
		SQLQuery query = exGongan77DzMpdyDao.createSQLQuery(sql,values);
		List<Object[]> resultlist = query.list();
		Long count=0l;
		List<ExGongan77DzMpdyForm> mpList=null;
		if (resultlist!=null) {
			mpList=new ArrayList<>();
			count=exGongan77DzMpdyDao.countSqlResult( hql.toString(), values);
			for(Object[] obj : resultlist){
				ExGongan77DzMpdyForm mp = new ExGongan77DzMpdyForm();
				mp.setSGuid((String)obj[1]);;
				mp.setDzqc((String)obj[2]);;
				mp.setMpwzhm((String)obj[3]);
				mp.setSsjlxdm((String)obj[4]);
				mp.setSssqcjwhdm((String)obj[5]);
				mp.setSsxzjddm((String)obj[6]);
				mp.setSsxzqhdm((String)obj[7]);
				mp.setSfdtl((String)obj[8]);
				mpList.add(mp);
			}
		}
		// 转换为Form对象列表并赋值到原分页对象中
		json.put("rows", mpList);
		json.put("total",count);
		json.put("code", 200);
		return json.toString();
	}
}