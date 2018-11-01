package com.augurit.awater.dri.dailySign.service.impl;

import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.dailySign.convert.DailySignConvertor;
import com.augurit.awater.dri.dailySign.dao.DailySignDao;
import com.augurit.awater.dri.dailySign.entity.DailySign;
import com.augurit.awater.dri.dailySign.service.IDailySignService;
import com.augurit.awater.dri.dailySign.web.form.DailySignForm;
import com.augurit.awater.dri.dailySign.web.form.OrgSignForm;
import com.augurit.awater.dri.dailySign.web.form.SignStatisticsForm;
import com.augurit.awater.util.DateUtils;
import com.augurit.awater.util.PropertyFilter;
import com.augurit.awater.util.ThirdUtils;
import com.augurit.awater.util.page.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@Transactional
public class DailySignServiceImpl implements IDailySignService {

	@Autowired
	private DailySignDao dailySignDao;

	@Autowired
	private IOmOrgRestService omOrgRestServiceImpl;
	@Autowired
	private IOmUserInfoRestService omUserInfoRestServiceImpl;

	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public DailySignForm get(Long id) {
		DailySign entity = dailySignDao.get(id);
		return DailySignConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		dailySignDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(DailySignForm... forms) {
		if(forms != null)
			for(DailySignForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(DailySignForm form){
		
		if(form != null){
			DailySign entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = dailySignDao.get(form.getId());
			}else{
				entity = new DailySign();
			}
			
			//属性值转换
			DailySignConvertor.convertFormToVo(form, entity);
			
			//保存
			dailySignDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<DailySignForm> search(Page<DailySignForm> page, DailySignForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from DailySign ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = dailySignDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<DailySignForm> list = DailySignConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<DailySignForm> search(Page<DailySignForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<DailySign> pg = dailySignDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<DailySignForm> list = DailySignConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}

	/***
	 * 查询用户一个月的签到记录
	 * @param userId
	 * @param yearMonth
	 * @return
	 */
	@Override
	public DailySignForm getUserMonthlySignRecord(String userId, String yearMonth) throws ParseException {
		DailySignForm dailySignForm = null;
		if(null!=userId&&null!=yearMonth) {
			StringBuffer sql = new StringBuffer();
			sql.append("select ds.sign_time,ds.org_name,ds.org_seq,ds.signer_id,ds.signer_name from dri_daily_sign ds where signer_id='").append(userId).append("'")
					.append(" and to_char(sign_time,'YYYYMM')='").append(yearMonth).append("'")
					.append("order by sign_time asc");
			List<Object[]> results = dailySignDao.createSQLQuery(sql.toString()).list();
			if(null!=results && results.size()>0) {
				List<String> dayList = new ArrayList<>();
				for(Object[] items : results) {
					dailySignForm = new DailySignForm();
					SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd");
					Date date = sf.parse(sf.format(items[0]));
					Calendar cal = Calendar.getInstance();
					cal.setTime(date);
					String day = cal.get(Calendar.DATE)+"";
					dayList.add(day);
					dailySignForm.setMonthlySignDate(dayList);
					dailySignForm.setOrgName(items[1].toString());
					dailySignForm.setOrgSeq(items[2].toString());
					dailySignForm.setSignerId(items[3].toString());
					dailySignForm.setSignerName(items[4].toString());
				}
			}
		}
		return dailySignForm;
	}

	/**
	 *合并签到日期
	 */
	private DailySignForm convertMonthlySignForm(List<DailySign> values){
		DailySignForm dailySignForm=null;
		if(null!=values&&values.size()>0){
			dailySignForm=new DailySignForm();
			dailySignForm.setSignerId(values.get(0).getSignerId());
			dailySignForm.setSignerName(values.get(0).getSignerName());
			dailySignForm.setOrgSeq(values.get(0).getOrgSeq());
			dailySignForm.setOrgName(values.get(0).getOrgName());
			//合并签到日期
			if(null!=dailySignForm) {
				dailySignForm.setMonthlySignDate(new ArrayList<String>());
				String t;
				for (DailySign items : values) {
					t= DateUtils.dateTimeToString(items.getSignTime(),"dd");
					dailySignForm.getMonthlySignDate().add(t);
				}
			}
		}
		return dailySignForm;
	}

	/***
	 *查询两天的签到信息
	 * 机构编号 orgCode>0时，查询机构下属所有用户的签到信息,orgCode<0时，查询除该机构外所有的签到信息
	 * @param today  日期
	 * @return
	 */
	@Override
	public List<SignStatisticsForm> getSignStatisticsInfo(String orgName, String today, String lastDay) {
		List<SignStatisticsForm> signStatisticsForms=new ArrayList<>();
		if(null!=orgName){
			if(null!=today){
				SignStatisticsForm signStatisticsForm=this.getSignStatisticsInfo(orgName,today);
				signStatisticsForms.add(signStatisticsForm);
			}
			if(null!=lastDay){
				SignStatisticsForm signStatisticsForm=this.getSignStatisticsInfo(orgName,lastDay);
				signStatisticsForms.add(signStatisticsForm);
			}
		}
		return signStatisticsForms;
	}

	/***
	 *查询某天的签到信息
	 *  机构编号 orgCode>0时，查询机构下属所有用户的签到信息,orgCode<0时，查询除该机构外所有的签到信息
	 * @param date  日期
	 * @return
	 */
	@Override
	public SignStatisticsForm getSignStatisticsInfo(String orgName,String date) {
		SignStatisticsForm signStatisticsForm=new SignStatisticsForm();
		List<SignStatisticsForm.ChildOrg> childOrgs=new ArrayList<>();
		signStatisticsForm.setChildOrgs(childOrgs);
		String orgCode=DailySignConvertor.getDistrictOrgCode(orgName);
		if(null!=orgCode&&null!=date){
			DecimalFormat decimalFormat=new DecimalFormat("#.00");
			StringBuilder sql=new StringBuilder();
			List<Object[]> dailySignList=null;
			Integer signNumer=null;
			Integer total=null;
			Double  signPercentage=null;
			//查询全市
			if(orgCode.contains("all")){
				String orgList= ThirdUtils.getProperties().getProperty("orgList");
				if(null!=orgList){
					String[] orgArray=orgList.split(",");
					String s1=this.generateSignStatisticsSQL(date,orgArray);
					sql.append(s1);
				}
				dailySignList=dailySignDao.createSQLQuery(sql.toString()).list();
				if(null!=dailySignList&&dailySignList.size()>0){
					Object[] item;
					String tmpOrgName;
					SignStatisticsForm.ChildOrg childOrg=null;
					for (int i = 0; i <dailySignList.size() ; i++) {
						tmpOrgName=(String)dailySignList.get(i)[0];
						signNumer=((BigDecimal) dailySignList.get(i)[1]).intValue();
						total=((BigDecimal) dailySignList.get(i)[2]).intValue();
						//格式化百分比
						signPercentage=total==0?0:(Double.parseDouble(signNumer.toString())/Double.parseDouble(total.toString())*100);
						signPercentage=Double.parseDouble(decimalFormat.format(signPercentage));
						//最后一项为汇总信息
						if(i==dailySignList.size()-1){
							signStatisticsForm.setOrgName(tmpOrgName);
							signStatisticsForm.setSignDate(date);
							signStatisticsForm.setTotal(total);
							signStatisticsForm.setSignNumber(signNumer);
							signStatisticsForm.setSignPercentage(signPercentage);
						}
						//其余为childOrgs
						else{
							childOrg=new SignStatisticsForm.ChildOrg();
							childOrg.setOrgName(tmpOrgName);
							childOrg.setSignNumber(signNumer);
							childOrg.setTotal(total);
							childOrg.setSignPercentage(signPercentage);
							childOrgs.add(childOrg);
						}
					}
				}
			}
			//查询单个行政区
			else{
				String s1=this.generateSignStatisticsSQL(date,new String[]{orgCode+":"+orgName});
				sql.append(s1);
				dailySignList=dailySignDao.createSQLQuery(sql.toString()).list();
				signStatisticsForm.setOrgName(orgName);
				signStatisticsForm.setSignDate(date);
				if(null!=dailySignList&&dailySignList.size()>0) {
					signNumer = ((BigDecimal) dailySignList.get(0)[1]).intValue();
					total = ((BigDecimal) dailySignList.get(0)[2]).intValue();
					//格式化百分比
					signPercentage = total == 0 ? 0 : (Double.parseDouble(signNumer.toString()) / Double.parseDouble(total.toString()) * 100);
					signPercentage = Double.parseDouble(decimalFormat.format(signPercentage));
					signStatisticsForm.setSignNumber(signNumer);
					signStatisticsForm.setTotal(total);
					signStatisticsForm.setSignPercentage(signPercentage);
				}
			}
		}
		return signStatisticsForm;
	}

	private String generateSignStatisticsSQL(String date,String[] orgArray){
		if(null!=orgArray||date!=null ) {
			StringBuilder sql=new StringBuilder();
			for (int i=0;i<orgArray.length;i++) {
				String orgInfo[] = orgArray[i].split(":");
				if(null==orgInfo||2!=orgInfo.length){
					continue;
				}
				if(i>0){
					sql.append("union all ");
				}
				if(orgInfo[0].contains("1065")){
					orgInfo[0]=orgInfo[0].replace("-","");
					sql.append("select t1.org_name,sign_number,total from (")
							.append("select '"+ orgInfo[1] + "' as org_name,count(1)as total from OPU_OM_USER u where login_name not like '%gly' and u.user_id in(select uo.user_id from OPU_OM_USER_ORG uo where  exists(select 1 from (select org_id,org_seq from OPU_OM_ORG t where t.org_level<4 )where uo.org_id=org_id ) and u.login_name<>'aosadmin')")
							.append(")t1 inner join(")
							.append("select '"+ orgInfo[1] + "' as org_name,count(1) as sign_number from dri_daily_sign ds where to_char(sign_time,'YYYYMMdd')='"+date+"' and  exists(select 1 from (select org_id,org_seq from OPU_OM_ORG t  where t.org_level<4)where ds.org_seq =org_seq )")
							.append(") t2 on t1.org_name=t2.org_name\n");
				}else if(orgInfo[0].contains("-")){
					orgInfo[0]=orgInfo[0].replace("-","");
					sql.append("select t1.org_name,sign_number,total from (")
							.append("select '"+ orgInfo[1] + "' as org_name,count(1)as total from OPU_OM_USER u where login_name not like '%gly' and u.user_id in(select uo.user_id from OPU_OM_USER_ORG uo where not exists(select 1 from (select org_id,org_seq from OPU_OM_ORG t start with org_id =" + orgInfo[0] + " connect by prior  org_id=parent_org_id )where uo.org_id=org_id and  org_id <>" + orgInfo[0] + ") and u.login_name<>'aosadmin')")
							.append(")t1 inner join(")
							.append("select '"+ orgInfo[1] + "' as org_name,count(1) as sign_number from dri_daily_sign ds where to_char(sign_time,'YYYYMMdd')='"+date+"' and  not exists(select 1 from (select org_id,org_seq from OPU_OM_ORG t start with org_id =" + orgInfo[0] + " connect by prior  org_id=parent_org_id )where ds.org_seq =org_seq and org_id <>" + orgInfo[0] + ")")
							.append(") t2 on t1.org_name=t2.org_name\n");
				}else if(orgInfo[0].contains("all")){
					sql.append("select t1.org_name,sign_number,total from (")
					.append("select '" + orgInfo[1] + "' as org_name,count(1)as total from OPU_OM_USER u where login_name not like '%gly'  and exists (select uo.user_id from OPU_OM_USER_ORG uo,OPU_OM_ORG og where og.org_id=uo.org_id and og.org_code not like '%PSH%'  and og.org_level>3 and u.user_id=uo.user_id)")
					.append(")t1 inner join(")
					.append("select '" + orgInfo[1] + "' as org_name,count(1) as sign_number from dri_psh_daily_sign ds where to_char(sign_time,'YYYYMMdd')='" + date )
					.append("') t2 on t1.org_name=t2.org_name\n");
				}else {
					sql.append("select t1.org_name,sign_number,total from (")
							.append("select '" + orgInfo[1] + "' as org_name,count(1)as total from OPU_OM_USER u where login_name not like '%gly'  and u.user_id in(select uo.user_id from OPU_OM_USER_ORG uo where  exists(select 1 from OPU_OM_ORG where org_seq like '%" + orgInfo[0] + "%' and uo.org_id=org_id))")
							.append(")t1 inner join(")
							.append("select '" + orgInfo[1] + "' as org_name,count(1) as sign_number from dri_daily_sign ds where to_char(sign_time,'YYYYMMdd')='" + date + "' and exists (select 1 from OPU_OM_ORG where org_seq like '%" + orgInfo[0] + "%' and ds.org_seq =org_seq)")
							.append(") t2 on t1.org_name=t2.org_name\n");
				}
			}
			return sql.toString();
		}
		return "";
	}

	/***
	 * 查询用户当天的签到记录
	 * @param userId
	 * @param date
	 * @return
	 */
	@Override
	public DailySignForm getUserSignRecord(String userId, String date) {
		DailySignForm dailySignForm=new DailySignForm();
		if(null!=userId&&null!=date) {
			String sql = "select * from dri_daily_sign  where signer_id=? and to_char(sign_time,'YYYYMMdd')=?  ";
			List<DailySign> results =
					dailySignDao.createSQLQuery(sql).addEntity(DailySign.class).setString(0, userId).setString(1, date).list();
			if(null!=results&&results.size()>0){
				dailySignForm=DailySignConvertor.convertVoToForm(results.get(0));
			}
		}
		return dailySignForm;
	}

    @Override
    public OrgSignForm getOrgSignRecord(String orgName, String date) {
        String orgCode=DailySignConvertor.getDistrictOrgCode(orgName);
        OrgSignForm orgSignForm=new OrgSignForm();
        if(null!=orgCode&&null!=date){
            StringBuilder sql=new StringBuilder();
            sql.append("with all_user as(select u.user_id,u.login_name,u.user_name,ui.user_mobile as phone,o.org_name as remark, rank() over(partition by u.user_name,ui.user_mobile  order by o.org_id asc) as row_no" )
                    .append(" from OPU_OM_USER u inner join OPU_OM_USER_INFO ui on u.user_id = ui.user_id inner join OPU_OM_USER_ORG uo on u.user_id=uo.user_id left join OPU_OM_ORG o on uo.org_id=o.org_id");
            //过滤机构下所有的子机构
            String sSwj="";
            if(orgCode.contains("-")){
                orgCode=orgCode.replace("-","");
                sql.append(" where not exists (select 1 from (select org_id,org_seq from OPU_OM_ORG t start with org_id =").append("'"+orgCode+"'").append(" connect by prior  org_id=parent_org_id )where uo.org_id=org_id and  org_id <>").append("'"+orgCode+"'").append(")");
                sSwj=" and d.org_name like '%"+orgName+"%' ";
            }
            else if(orgCode.contains("all")){
                //查询所有机构时 ，不用限定机构
            }else{
                sql.append(" where o.org_seq like '%").append(orgCode).append("%'");
            }
            sql.append(" order by o.org_level asc) select user_name,phone,remark,nvl2(d.id,1,0) as isSigned from all_user ")
                    .append("left join dri_daily_sign d on user_id=d.signer_id and to_char(d.sign_time,'YYYYMMdd')='").append(date).append("'")
                    .append(" where row_no=1 and login_name not like '%gly'");
            sql.append(sSwj);
            List<Object[]> results=dailySignDao.createSQLQuery(sql.toString()).list();
            if(null!=results&&results.size()>0){
                orgSignForm.setDate(date);
                orgSignForm.setOrgName(orgName);
                orgSignForm.setTotal(results.size());
                List<OrgSignForm.UserSignForm> userSignFormList=new ArrayList<>();
                orgSignForm.setUsers(userSignFormList);
                OrgSignForm.UserSignForm userSignForm=null;
                int unsignedTotal=0;
				int signedTotal=0;
                for(Object[] items:results){
                    userSignForm=new OrgSignForm.UserSignForm();
                    userSignForm.setUserName((String)items[0]);
                    userSignForm.setPhone((String)items[1]);
//                    userSignForm.setTitle((String)items[2]);
                    userSignForm.setDirectOrgName((String)items[2]);
                    //1表示已签到 非1表示未签到
					boolean isSigned=((BigDecimal)items[3]).intValue()==1;
                    userSignForm.setSigned(isSigned);
                    userSignFormList.add(userSignForm);
                    if(isSigned){
                    	signedTotal++;
					}else{
						unsignedTotal++;
					}
                }
				orgSignForm.setSignedTotal(signedTotal);
				orgSignForm.setUnsignedTotal(unsignedTotal);
            }

        }
        return orgSignForm;
    }

	@Override
	public Page<DailySignForm> getDailySignListAll(Page<DailySignForm> page, DailySignForm dailySignForm, Map params) {
		StringBuilder hql=new StringBuilder();
		hql.append("from DailySign ps where 1=1");
		Map<String,Object> values=new HashMap<>();
		//设置基本查询条件
		setBasicCondition(dailySignForm,values,hql);
		//设置查询的时间区间
		if(null!=params){
			if(params.containsKey("startTime")){
				hql.append(" and ps.signTime > :startTime");
				values.put("startTime", params.get("startTime"));
			}
			if(params.containsKey("endTime")){
				hql.append(" and ps.signTime <= :endTime");
				values.put("endTime", params.get("endTime"));
			}
		}
		//增加排序字段
		hql.append(HqlUtils.buildOrderBy(page,"ps"));
		//执行分页查询操作
		Page pg=dailySignDao.findPage(page,hql.toString(),values);
		PageUtils.copy(pg,DailySignConvertor.convertVoListToFormList(pg.getResult()),page);
		return page;
	}


	@Override
	public Page<DailySignForm> getDailySignList(Page<DailySignForm> page, DailySignForm dailySignForm, Map params) {
		StringBuilder hql=new StringBuilder();
		hql.append("from DailySign ps where 1=1");
		Map<String,Object> values=new HashMap<>();
		//设置基本查询条件
		setBasicCondition(dailySignForm,values,hql);
		//设置查询的时间区间
		if(null!=params){
			if(params.containsKey("startTime")){
				hql.append(" and ps.signTime > :startTime");
				values.put("startTime", params.get("startTime"));
			}
			if(params.containsKey("endTime")){
				hql.append(" and ps.signTime <= :endTime");
				values.put("endTime", params.get("endTime"));
			}
		}
		//增加排序字段
		hql.append(HqlUtils.buildOrderBy(page,"ps"));
		//执行分页查询操作
		Page pg=dailySignDao.findPage(page,hql.toString(),values);
		PageUtils.copy(pg,DailySignConvertor.convertVoListToFormList(pg.getResult()),page);
		return page;
	}

	public List<String> getOrgIdsExcept(String orgId){
		List<String> orgList=new ArrayList<>();
		OpuOmOrg org = new OpuOmOrg();
		org.setOrgType("swj");
		org.setParentOrgId(orgId);
		List<OpuOmOrg> listOrg =  omOrgRestServiceImpl.listOpuOmOrg(org);
		org.setParentOrgId(null);
		List<OpuOmOrg> listOrgAll =  omOrgRestServiceImpl.listOpuOmOrg(org);
		for(int i=0;i<listOrgAll.size();i++){
			OpuOmOrg orgZs =  listOrgAll.get(i);
			for(OpuOmOrg orgs: listOrg){
				if(orgZs.getOrgId().equals(orgs.getOrgId())){
					listOrgAll.remove(i);
				}
			}
			orgList.add(orgZs.getOrgId());
		}
		return orgList;
	}
	//设置基本查询条件
	private void setBasicCondition(DailySignForm dailySignForm,Map values,StringBuilder hql){
		if(null!=dailySignForm){
			//设置机构查询条件
			if(StringUtils.isNotEmpty(dailySignForm.getOrgName())&&StringUtils.isEmpty(dailySignForm.getOrgSeq())){
				String orgCode=DailySignConvertor.getDistrictOrgCode(dailySignForm.getOrgName());
				if(null!=orgCode) {
					if ("all".equals(orgCode)) {
						//不限定机构
					}
					else if (orgCode.contains("-")){
						List<String> orgIds=getOrgIdsExcept(orgCode.replace("-",""));
						if(null!=orgIds&&orgIds.size()>0) {
							int len=orgIds.size();
							String para;
							for (int i = 0; i <len; i++) {
								para="orgSeq"+i;
								if(0==i) {
									hql.append(" and (ps.orgSeq like :").append(para);
								}else if(len-1==i){
									hql.append(" or ps.orgSeq like :").append(para).append(")");
								}else{
									hql.append(" or ps.orgSeq like :").append(para);
								}
								values.put(para,"%"+orgIds.get(i)+".");
							}
						}
					}
					else {
						hql.append(" and ps.orgSeq like :orgSeq");
							values.put("orgSeq", "%" + orgCode + "%");
						}
					}
				}
			}

			//签到人id
			if(null!=dailySignForm.getSignerId()){
				hql.append(" and ps.signerId = :signerId");
				values.put("signerId",dailySignForm.getSignerId());
			}
			//签到人姓名
			if(StringUtils.isNotBlank(dailySignForm.getSignerName())){
				hql.append(" and ps.signerName like :signerName");
				values.put("signerName","%"+dailySignForm.getSignerName()+"%");
			}
			//签到所在道路
			if(StringUtils.isNotBlank(dailySignForm.getRoad())){
				hql.append(" and ps.road like :road");
				values.put("road","%"+dailySignForm.getRoad()+"%");
			}
			//签到所在地址
			if(StringUtils.isNotBlank(dailySignForm.getAddr())){
				hql.append(" and ps.addr like :addr");
				values.put("addr","%"+dailySignForm.getAddr()+"%");
			}
//			//签到人所属机构编号
//			if(StringUtils.isNotBlank(dailySignForm.getOrgSeq())){
//				hql.append(" and ps.orgSeq like :orgSeq");
//				values.put("orgSeq","%"+dailySignForm.getOrgSeq()+"%");
//			}
//			//签到人所属机构名称
//			if(StringUtils.isNotBlank(dailySignForm.getOrgName())){
//				hql.append(" and ps.orgName like :orgName");
//				values.put("orgName","%"+dailySignForm.getOrgName()+"%");
//			}

	}

	/**
	 *
	 * @param id
	 * @return 返回用户签到的相信信息，包括用户机构信息 电话号码
	 */
	@Override
	public DailySignForm getUserSignInfo(Long id) {
		DailySignForm form=null;
		if(null!=id) {
			form = DailySignConvertor.convertVoToForm(dailySignDao.get(id));
			if(null!=form) {
				String userId = form.getSignerId();
				//设置电话号码，称谓
				OpuOmUserInfo userInfo =  omUserInfoRestServiceImpl.getOpuOmUserInfoByLoginName(SecurityContext.getCurrentUser().getLoginName());
				if (null != userInfo) {
					form.setPhone(userInfo.getUserMobile());
					form.setTitle(userInfo.getUserTitle());
				}
				//设置直属机构名
				String orgSeq = form.getOrgSeq();
				if (null != orgSeq) {
					String[] orgList = orgSeq.split(",");
					String directOrgName = null;
					for (String orgStr : orgList) {
						String[] orgStrArr = orgStr.split("\\.");
						String directOrgId = orgStrArr[orgStrArr.length - 1];
						Map omOrg = omOrgRestServiceImpl.getOrgByOrgOmId(directOrgId);
						directOrgName = directOrgName == null ? omOrg.get("orgName").toString() : directOrgName + "," + omOrg.get("orgName").toString();
					}
					form.setDirectOrgName(directOrgName);
				}
			}
		}
		return form;
	}
}








