package com.augurit.awater.dri.problem_report.diary.rest;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.awater.dri.patrolTrack.service.ITrackLineService;
import com.augurit.awater.dri.patrolTrack.service.ITrackPointService;
import com.augurit.awater.dri.patrolTrack.web.form.TrackLineForm;
import com.augurit.awater.dri.patrolTrack.web.form.TrackPointForm;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;


@RequestMapping("/rest/diary")
@RestController
public class DiaryRestController {
	private IOmUserInfoRestService omUserInfoRestService;
	@Autowired
	private IOmOrgRestService omOrgService;
	@Autowired
	private ITrackPointService trackPointService;
	@Autowired
	private ITrackLineService trackLineService;

	/**
	 * 获取数据字典配置值
	 * */
	@RequestMapping(value = "/getItemValue",produces = "application/json;charset=UTF-8")
	//@ResponseBody
	public String getItemValue(HttpServletRequest req) {
		JSONObject json = new JSONObject();
		String code = req.getParameter("code");
	/*	List<SysCodeForm> sysCodeForms= sysCodeService.getItems(code);
		if(sysCodeForms!=null && sysCodeForms.size()>0){
			json.put("code", 200);
			json.put("data", sysCodeForms.get(0).getItemCode());
		}else{
			json.put("code", 500);
			json.put("data", null);
		}*/
		json.put("data",code);
		return json.toString();
	}
	/**
	 * 获取巡检轨迹配置值（改）
	 * */
	@RequestMapping(value = "/gettrackConfig",produces = "application/json;charset=UTF-8")
	public String gettrackConfig(HttpServletRequest req) {
		JSONObject json = new JSONObject();
		String code = req.getParameter("code");
		/*List<SysCodeForm> sysCodeForms= sysCodeService.getItems("APP_PATROL_TRACK");
		if(sysCodeForms!=null && sysCodeForms.size()>0){
			Map<String, String> map= new HashMap<String, String>();
			for(SysCodeForm codeForm : sysCodeForms){
				map.put(codeForm.getItemCode(), codeForm.getItemName());
			}
			json.put("code", 200);
			json.put("data", map);
		}else{
			json.put("code", 500);
			json.put("data", null);
		}*/
		json.put("message","暂无配置!");
		json.put("data",code);
		return json.toString();
	}
	/**
	 * 删除巡检轨迹线
	 * */
	@RequestMapping(value = "/deleteTrackLine",produces = "application/json;charset=UTF-8")
	public String deleteTrackLine(HttpServletRequest req) {
		JSONObject json = new JSONObject();
		String id = req.getParameter("id");
		TrackLineForm form=trackLineService.get(Long.valueOf(id));
		if(form==null){
			json.put("code", 400);
			json.put("message", "参数错误!");
			return json.toString();
		}
		try {
			//删除轨迹线
			trackLineService.delete(form.getId());
			//删除轨迹点
			List<TrackPointForm> list = trackPointService.getFormByTrackId(id);
			if(list!=null){
				for(TrackPointForm pointForm : list){
					trackPointService.delete(pointForm.getId());
				}
			}
			json.put("code", 200);
			json.put("message", "删除成功!");
		}catch (Exception e) {
			json.put("code", 500);
			json.put("message", "异常错误!");
			e.printStackTrace();
		}
		return json.toString();
	}
	/**
	 * 新增修改巡检轨迹线
	 * */
	@RequestMapping(value = "/addTrackLine",produces = "application/json;charset=UTF-8")
	public String addTrackLine(HttpServletRequest req) {
		JSONObject json = new JSONObject();
		String loginName = req.getParameter("loginName");
		String id = req.getParameter("id");
		String recordLength = req.getParameter("recordLength");
		try {
			TrackLineForm form;
			if(StringUtils.isNotBlank(id)){//修改
				form=trackLineService.get(Long.valueOf(id));
				if(form==null){
					json.put("code", 400);
					json.put("message", "参数错误!");
					return json.toString();
				}
				form.setEndTime(new Date());
				form.setState("1");
				form.setRecordLength(recordLength);
			}else{
				form=getTrackLineForm(loginName);
				form.setMarkTime(new Date());
				form.setStartTime(new Date());
				form.setState("0");
			}
			trackLineService.save(form);
			json.put("data", form.getId());
			json.put("code", 200);
			json.put("message", "保存成功!");
			//return json.toString();
		} catch (Exception e) {
			json.put("code", 500);
			json.put("message", "异常错误!");
			e.printStackTrace();
		}
		return json.toString();
	}
	/**
	 * 新增巡检轨迹坐标记录
	 * */
	@RequestMapping(value = "/addTrackPoint",produces = "application/json;charset=UTF-8")
	public String addTrackPoint(HttpServletRequest req) {
		JSONObject json = new JSONObject();
		String x = req.getParameter("x");
		String y = req.getParameter("y");
		String loginName = req.getParameter("loginName");
		String trackId = req.getParameter("trackId");
		String recordLength = req.getParameter("recordLength");
		String state = req.getParameter("state");
		String time = req.getParameter("time");
		try {
			TrackPointForm form=getTrackPointFrom(loginName);
			form.setX(Double.valueOf(x));
			form.setY(Double.valueOf(y));
			form.setMarkTime(new Date(Long.valueOf(time)));
			form.setTrackId(trackId);
			form.setRecordLength(recordLength);
			form.setState(state);
			trackPointService.save(form);
			json.put("code", 200);
			json.put("message", "保存成功!");
			return json.toString();
		} catch (Exception e) {
			json.put("code", 500);
			json.put("message", "异常错误!");
			e.printStackTrace();
		}
		return json.toString();
	}
	/**
	 * 本接口通用方法，生成TrackLineForm对象
	 * */
	public TrackLineForm getTrackLineForm(String loginName) throws Exception {
		TrackLineForm f = new TrackLineForm();
		f.setLoginName(loginName);
		OpuOmUserInfo user = omUserInfoRestService.getOpuOmUserInfoByLoginName(loginName);
		if (user != null) {
			f.setMarkPerson(user.getUserName());
			f.setMarkPersonId(user.getUserId());
			List<OpuOmOrg> list = omOrgService.listOpuOmOrgByUserId(user.getUserId());
			for (OpuOmOrg from : list) {
				if (from.getOrgRank() == null)
					continue;
				if (from.getOrgRank().equals("11")
						&& !StringUtils.isNotBlank(f.getTeamOrgName())) {// 巡查组(队伍名称)
					f.setTeamOrgId(from.getOrgId().toString());
					// f.setTeamOrgName(from.getRemark()!=null?from.getRemark():from.getOrgName());
					f.setTeamOrgName(from.getOrgName());
				} else if (from.getOrgRank().equals("12")
						&& !StringUtils.isNotBlank(f.getDirectOrgName())) {// 直属机构
					f.setDirectOrgId(from.getOrgId().toString());
					f.setDirectOrgName(from.getOrgName());
				} else if (from.getOrgRank().equals("13")
						&& !StringUtils.isNotBlank(f.getSuperviseOrgName())) {// 监理单位
					f.setSuperviseOrgId(from.getOrgId().toString());
					f.setSuperviseOrgName(from.getOrgName());
				} else if (from.getOrgRank().equals("14")) {// 业主机构
					f.setParentOrgId(from.getOrgId().toString());
					f.setParentOrgName(from.getOrgName());
				}
				if (list.size() <= 3
						&& from.getOrgLevel().equals(new Integer(1))) {// 市级(也是业主机构)
					if (from.getParentOrgId() == null) {
						f.setParentOrgId(from.getOrgId().toString());
						f.setParentOrgName(from.getOrgName());
					}
				}
			}
			return f;
		} else {
			return null;
		}
	}
	/**
	 * 本接口通用方法，生成TrackPointForm对象
	 * */
	public TrackPointForm getTrackPointFrom(String loginName) throws Exception {
		TrackPointForm f = new TrackPointForm();
		f.setLoginName(loginName);
		OpuOmUserInfo user = omUserInfoRestService.getOpuOmUserInfoByLoginName(loginName);
		if (user != null) {
			f.setMarkPerson(user.getUserName());
			f.setMarkPersonId(user.getUserId());
			List<OpuOmOrg> list = omOrgService.listOpuOmOrgByUserId(user.getUserId());
			for (OpuOmOrg from : list) {
				if (from.getOrgRank() == null)
					continue;
				if (from.getOrgRank().equals("11")
						&& !StringUtils.isNotBlank(f.getTeamOrgName())) {// 巡查组(队伍名称)
					f.setTeamOrgId(from.getOrgId().toString());
					// f.setTeamOrgName(from.getRemark()!=null?from.getRemark():from.getOrgName());
					f.setTeamOrgName(from.getOrgName());
				} else if (from.getOrgRank().equals("12")
						&& !StringUtils.isNotBlank(f.getDirectOrgName())) {// 直属机构
					f.setDirectOrgId(from.getOrgId().toString());
					f.setDirectOrgName(from.getOrgName());
				} else if (from.getOrgRank().equals("13")
						&& !StringUtils.isNotBlank(f.getSuperviseOrgName())) {// 监理单位
					f.setSuperviseOrgId(from.getOrgId().toString());
					f.setSuperviseOrgName(from.getOrgName());
				} else if (from.getOrgRank().equals("14")) {// 业主机构
					f.setParentOrgId(from.getOrgId().toString());
					f.setParentOrgName(from.getOrgName());
				}
				if (list.size() <= 3
						&& from.getOrgLevel().equals(new Integer(1))) {// 市级(也是业主机构)
					if (from.getParentOrgId() == null) {
						f.setParentOrgId(from.getOrgId().toString());
						f.setParentOrgName(from.getOrgName());
					}
				}
			}
			return f;
		} else {
			return null;
		}
	}

	/**
	 * 根据用户名获取巡检轨迹
	 * */
	@RequestMapping(value = "/getTrackLinesByLoginName",produces = "application/json;charset=UTF-8")
	public String getTrackLinesByLoginName(HttpServletRequest req) {
		JSONObject json = new JSONObject();
		String loginName = req.getParameter("loginName");
		List<TrackLineForm> list=trackLineService.getTrackLinesByLoginName(loginName);
		try {
			if (list!=null) {
				if (list.size() > 0) {
					json.put("code", 200);
					json.put("data", list);
					json.put("message", "查询成功!");
				}
			}else {
				json.put("code", 404);
				json.put("message", "该用户没有巡检轨迹!");
			}
		} catch (Exception e) {
			json.put("code", 500);
			json.put("message", "异常错误!");
			e.printStackTrace();
		}
		return json.toString();
	}

	/**
	 * 根据轨迹id获取巡检轨迹
	 * */
	@RequestMapping(value = "/getTrackPointsByTrackId",produces = "application/json;charset=UTF-8")
	public String getTrackPointsByTrackId(HttpServletRequest req) {
		JSONObject json = new JSONObject();
		String trackId = req.getParameter("trackId");
		List<TrackPointForm> list=trackPointService.getFormByTrackId(trackId);
		try {
			if (list!=null) {
				if (list.size() > 0) {
					json.put("code", 200);
					json.put("data", list);
					json.put("message", "查询成功!");
				}
			}else {
				json.put("code", 404);
				json.put("message", "找不到该轨迹!");
			}
		} catch (Exception e) {
			json.put("code", 500);
			json.put("message", "异常错误!");
			e.printStackTrace();
		}
		return json.toString();
	}
}
