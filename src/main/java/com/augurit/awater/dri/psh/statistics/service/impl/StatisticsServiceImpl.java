package com.augurit.awater.dri.psh.statistics.service.impl;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.agcloud.opus.common.domain.OpuOmUser;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.agcloud.org.service.IPsOrgUserService;
import com.augurit.awater.dri.psh.statistics.service.IStatisticsService;
import com.augurit.awater.dri.utils.JsonOfForm;
import net.sf.json.JSONObject;

import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class StatisticsServiceImpl implements IStatisticsService {

	@Autowired
	  private IOmOrgRestService omOrgRestService;
	@Autowired
	private IOmUserInfoRestService omUserInfoRestService;
	@Autowired
	private IPsOrgUserService psOrgUserService;
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Override
	public String pshStatistics(Object[] orgArray,String type) {
		JSONObject json = new JSONObject();
		StringBuffer sb = new StringBuffer();
		Map<String, String> map = new LinkedHashMap<>();
		List resultList =new ArrayList<>();
		if(orgArray != null && orgArray.length>0){
			String teamId=orgArray[0].toString().split(":")[0];
			OpuOmOrg  teamForm = omOrgRestService.getOrgByOrgId(teamId);
			if("33".equals(teamForm.getOrgRank())){//镇级
				List arrList = new ArrayList<>();
				List<OpuOmUserInfo> parentUserList =  psOrgUserService.listUsersByOrgId(teamForm.getOrgId());
				arrList.add("区水务");
				arrList.add(parentUserList == null ? 0 : parentUserList.size());
				resultList.add(arrList);
			}
			sb.append("select ");
			for(int i=0 ; i<orgArray.length;i++){
				String[] org=orgArray[i].toString().split(":");
				String orgId = org[0];
				String orgName= org[1];
				if(!"all".equals(orgId)){
					map.put(orgId, orgName);
					if(orgName.length()>15){
						orgName = orgName.substring(0,14);
					}
					sb.append(" SUM(case when t.org_seq like '%"+orgId+".%' then 1 else 0 end) \"" + orgId +"\",");
				}
			}
			String sql = sb.toString().substring(0, sb.toString().length()-1);
			sb = new StringBuffer(sql);
			sb.append(" from (select t1.org_id,t1.org_seq,t3.user_id ,row_number() ");
			sb.append(" over(partition by t3.user_id order by t1.org_id desc) rn from opu_om_user t3 left join opu_om_user_org t2 ");
			sb.append(" on t2.user_id = t3.user_id left join opu_om_org t1 on t1.org_id=t2.org_id ");
			sb.append(" where t1.org_code like '%PSH%')t ");
			if("qu".equals(type)){//去重复
				sb.append(" where t.rn = 1 ");
			}
			List resultlist = jdbcTemplate.queryForList(sb.toString());
			if(resultlist != null){
				Map value=(Map)resultlist.get(0);
				for(String key : map.keySet()){
					List arrList = new ArrayList<>();
					if(value.get(key)!=null){
						arrList.add(map.get(key));
						arrList.add(value.get(key).toString());
						arrList.add(key);
						resultList.add(arrList);
					}
				}
			}
			json.put("rows", resultList);
			json.put("code", 200);
		}else{
			json.put("rows", resultList);
			json.put("code", 500);
		}
		return json.toString();
	}

	/**
	 * 获取组织id
	 */
	@Override
	public String getOrgIdByOrgName(String orgName, String orgGrade, String parentOrgId) {
		StringBuffer hql = new StringBuffer("from OPU_Om_Org ps where 1=1 and ps.org_Code like '%PSH%' ");
		List<Object> map = new ArrayList<>();
		if("32".equals(orgGrade)){
			hql.append(" and ps.org_Name like ?");
			map.add("%" + orgName + "%");
		}else{
			hql.append(" and ps.org_Name =? ");
			map.add(orgName);
		}
		hql.append(" and ps.org_Grade = ? ");
		map.add(orgGrade);
		if(parentOrgId != null){
			hql.append(" and ps.parent_Org_Id =? ");
			map.add(parentOrgId);
		}
		hql.append(" order by org_Id ");
		List<OpuOmOrg> list = (List<OpuOmOrg>) JsonOfForm.listMapToForm(jdbcTemplate.queryForList(hql.toString(),map),OpuOmOrg.class);
		if(list != null && list.size()>0){
			return list.get(0).getOrgId();
		}
		return null;
	}

}
