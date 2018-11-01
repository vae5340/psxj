package com.augurit.awater.dri.psh.checkRecord.web;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.augurit.agcloud.common.controller.BaseController;
import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.agcloud.org.service.IPsOrgUserService;
import com.augurit.awater.dri.psh.checkRecord.service.IPshCheckRecordService;
import com.augurit.awater.dri.psh.checkRecord.web.form.PshCheckRecordForm;
import com.augurit.awater.dri.psh.discharge.service.IPshDischargerService;
import com.augurit.awater.dri.psh.discharge.web.form.PshDischargerForm;
import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/pshCheckRecord")
public class PshCheckRecordController  {

	@Autowired
	private IPshCheckRecordService pshCheckRecordService;
	@Autowired
	private IOmUserInfoRestService userInfoRestService;
	@Autowired
	private IPsOrgUserService psOrgUserService;
	@Autowired
	private IPshDischargerService pshDischargerService;
	/**
	 * 查看详细
	 * */
	@RequestMapping(value = "/searchCheckRecord",produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String searchCheckRecord(PshCheckRecordForm form){
		JSONObject json = new JSONObject();
		List<PshCheckRecordForm> list = pshCheckRecordService.searchForm(form);
		json.put("rows", list);
		json.put("code", 200);
		return json.toString();
	}
	
	/**
	 * 保存审核记录
	 * */
	@RequestMapping(value = "/saveCheckInf",produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String saveCheckInf(PshCheckRecordForm form){
		OpuOmUserInfo userForm =  userInfoRestService.
				getOpuOmUserInfoByLoginName(SecurityContext.getCurrentUser().getLoginName());
		JSONObject json = new JSONObject();
		Map map = new HashMap();
		if(form.getReportId()!=null){
			PshCheckRecordForm forms=new PshCheckRecordForm();
			forms.setCheckPerson(userForm.getUserName());
			forms.setCheckPersonCode(userForm.getUserCode());
			forms.setCheckPersonPhone(userForm.getUserMobile());
			forms.setCheckTime(new Date());
			forms.setCheckState(form.getCheckState());
			List<OpuOmOrg> listOrg = psOrgUserService.listOmOrgByUserId(userForm.getUserId());
			String seq = "";
			OpuOmOrg orgOm = null;
			for(OpuOmOrg org :listOrg){
				if(seq == ""){
					seq = org.getOrgSeq();
				}else{
					if(org.getOrgSeq()!=null){
						if(seq.length()<org.getOrgSeq().length()){
							seq = org.getOrgSeq();
							orgOm = org;
							break;
						}
					}

				}
			}
			forms.setOrgName(orgOm!=null?orgOm.getOrgName():"");
			forms.setOrgId(orgOm!=null?orgOm.getOrgId():"");
			forms.setCheckDesription(form.getCheckDesription());
			forms.setReportEntity("psh_discharger");
			forms.setReportId(form.getReportId());
			pshCheckRecordService.save(forms);
			//子表保存完毕以后，更新一下主表
			PshDischargerForm sbForm=pshDischargerService.get(form.getReportId());
			if (sbForm!=null) {
				sbForm.setCheckTime(new Date());
				sbForm.setState(forms.getCheckState());
				sbForm.setCheckPersonId(forms.getCheckPersonCode());
				sbForm.setCheckPerson(forms.getCheckPerson());
				sbForm.setCheckDesription(forms.getCheckDesription());
	            pshDischargerService.save(sbForm);
			}
			json.put("code",200);
			json.put("message","成功!");
		}else{
			json.put("code",500);
			json.put("message","参数错误!");
		}
		return json.toString();
	}

}