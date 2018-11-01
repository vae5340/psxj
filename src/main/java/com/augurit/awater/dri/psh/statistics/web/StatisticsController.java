package com.augurit.awater.dri.psh.statistics.web;

import java.util.ArrayList;
import java.util.List;

import com.alibaba.fastjson.JSON;
import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.agcloud.org.service.IPsOrgUserService;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.psh.discharge.service.IPshDischargerService;
import com.augurit.awater.dri.psh.discharge.web.form.PshDischargerForm;
import com.augurit.awater.dri.psh.statistics.service.IStatisticsService;
import com.augurit.awater.dri.utils.Result;
import com.augurit.awater.util.ExtUtils;
import com.augurit.awater.util.ThirdUtils;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;


public class StatisticsController {
	@Autowired
	private IOmUserInfoRestService omUserService;
	@Autowired
	private IOmOrgRestService omOrgService;
	@Autowired
	private IStatisticsService statisticsService;
	@Autowired
	private IPsOrgUserService psOrgUserService;
	/*@Autowired
	private IPshInstallRecordService pshInstallRecordService;*/
	@Autowired
	private IPshDischargerService pshDischargerService;

	/**
	 * 排水户图表按区获取安装数据
	 * */
	@RequestMapping(value="/getSbedByArea",produces="application/json;charset=UTF-8")
	public String getSbedByArea(){
		return pshDischargerService.getSbedByArea();
	};
	/**
	 * 排水户图表按镇街获取安装数据
	 * */
	@RequestMapping(value="/getSbedByUnit",produces="application/json;charset=UTF-8")
	public String getSbedByUnit(String orgName){
		return pshDischargerService.getSbedByUnit(orgName);
	};
	/**
	 * 排水户图表获取安装具体数据
	 * */
	@RequestMapping(value="/getSbedInf",produces="application/json;charset=UTF-8")
	public String getSbedInf(String orgName,String teamName,HttpServletRequest request){
		String pqge_no=request.getParameter("page.pageNo");
		String pqge_size=request.getParameter("page.pageSize");
		try {
			Page<PshDischargerForm> pageI = new Page<PshDischargerForm>();
			pageI.setPageNo(Integer.valueOf(pqge_no));
			pageI.setPageSize(Integer.valueOf(pqge_size));
			PshDischargerForm pshDischargerForm=new PshDischargerForm();
			pshDischargerForm.setParentOrgName(orgName);
			pshDischargerForm.setTeamOrgName(teamName);
			return pshDischargerService.getSbedInf(pageI, pshDischargerForm);
		} catch (NumberFormatException e) {
			e.printStackTrace();
			return JSON.toJSONString(new Result(false,"查询失败！"+e.getMessage()));
		}
	}


	/**
	 * 安装率图表按区获取安装数据
	 * */
	/*@RequestMapping(value="/getInstalledByArea",produces="application/json;charset=UTF-8")
	public String getInstalledByArea(){
		String orgList= ThirdUtils.getProperties().getProperty("orgListPsh");
		String[] orgArray=orgList.split(",");
		return pshInstallRecordService.getInstalledDynamic(orgArray,"qu");
		//单表，简单但是数据不可靠，暂时不用
//		renderText(pshInstallRecordService.getInstalledByArea());
	};
	*//**
	 * 安装率图表按镇街获取安装数据
	 * *//*
	@RequestMapping(value="/getInstalledByUnit",produces="application/json;charset=UTF-8")
	public String getInstalledByUnit(String orgName){
		List list = new ArrayList<>();
		if(StringUtils.isNotBlank(orgName)){
			String orgId = statisticsService.getOrgIdByOrgName(orgName,"32",null);
			if(orgId != null){
				OpuOmOrg org = new OpuOmOrg();
				org.setOrgId(orgId);
				List<OpuOmOrg> orgList = omOrgService.listOpuOmOrg(org);
				for(OpuOmOrg orgs : orgList){
					list.add(orgs.getOrgId()+":"+orgs.getOrgName());
				}
			}
		}
		return pshInstallRecordService.getInstalledDynamic(list.toArray(),"zj");
	}
	*//**
	 * 安装率图表获取安装具体数据
	 * *//*
	@RequestMapping(value="/getInstalledInf",produces="application/json;charset=UTF-8")
	public String getInstalledInf(){
		Page<PshInstallRecordForm> pageI = new Page<PshInstallRecordForm>();
		pageI.setPageNo(page.getPageNo());
		pageI.setPageSize(page.getPageSize());
		PshInstallRecordForm pshInstallRecordForm=new PshInstallRecordForm();
		pshInstallRecordForm.setParentOrgName(orgName);
		pshInstallRecordForm.setTeamOrgName(teamName);
		return pshInstallRecordService.getInstalledInfDynamic(pageI, pshInstallRecordForm);
	}*/

	/**
	 * 获取区数据
	 * @return
	 */
	@RequestMapping(value="/pshQuStatistics",produces="application/json;charset=UTF-8")
	public String pshQuStatistics(){
		String orgList=ThirdUtils.getProperties().getProperty("orgListPsh");
		String[] orgArray=orgList.split(",");
		return statisticsService.pshStatistics(orgArray,"qu");
	}
	
	/**
	 * 获取镇街数据
	 * @return
	 */
	@RequestMapping(value="/pshZjStatistics",produces="application/json;charset=UTF-8")
	public String pshZjStatistics(String orgName){
		List list = new ArrayList<>();
		if(StringUtils.isNotBlank(orgName)){
			String orgId = statisticsService.getOrgIdByOrgName(orgName,"32",null);
			if(orgId != null){
				OpuOmOrg org = new OpuOmOrg();
				org.setOrgId(orgId);
				List<OpuOmOrg> orgList = omOrgService.listOpuOmOrg(org);
				for(OpuOmOrg orgs : orgList){
					list.add(orgs.getOrgId()+":"+orgs.getOrgName());
				}
			}
		}
		return statisticsService.pshStatistics(list.toArray(),"zj");
	}
	
	/**
	 * 获取人
	 * @return
	 */
	@RequestMapping(value="/pshZjStatistics",produces="application/json;charset=UTF-8")
	public String pshRyStatistics(String orgName,String teamName,HttpServletRequest request){
		JSONObject json = new JSONObject();
		Page page = new Page();
		ExtUtils.initPageFromExtGridParam(request, page);
		List<OpuOmUserInfo> userList = new ArrayList<>();
		if(StringUtils.isNotBlank(teamName)){
			String parentOrgId = statisticsService.getOrgIdByOrgName(orgName,"32",null);
			if(parentOrgId != null){
				if("区水务".equals(teamName)){
					userList = psOrgUserService.listUsersByOrgId(parentOrgId);
				}else{
					String orgId = statisticsService.getOrgIdByOrgName(teamName,"33",parentOrgId);
					if(orgId != null){
						OpuOmOrg org = new OpuOmOrg();
						org.setOrgId(orgId);
						List<OpuOmOrg> orgList = omOrgService.listOpuOmOrg(org);
						userList =psOrgUserService.listChildUsersByOrgId(orgId);
					}
				}
			}
		}
		if(userList == null)
			userList = new ArrayList<>();
		json.put("data", userList);
		json.put("total", userList.size());
		json.put("code", 200);
		return json.toString();
	}
	
}
