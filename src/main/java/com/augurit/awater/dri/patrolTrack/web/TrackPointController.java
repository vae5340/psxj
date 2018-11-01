package com.augurit.awater.dri.patrolTrack.web;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.patrolTrack.service.ITrackPointService;
import com.augurit.awater.dri.patrolTrack.web.form.TrackPointForm;
import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RequestMapping("/trackPoint")
public class TrackPointController {

	@Autowired
	private ITrackPointService trackPointService;


	/**
	 * 根据区查询人员实时分布
	 */
	@RequestMapping(value = "/getFormByParentOrgId",produces="application/json;charset=UTF-8")
	@ResponseBody
	public String getFormByParentOrgId(TrackPointForm form) throws Exception {
		JSONObject json = new JSONObject();
		try {
			List<Map<String, Object>> list = trackPointService.getFormByParentOrgId(form.getParentOrgId());
			if(list!=null){
                json.put("code", 200);
                json.put("data", list);
                json.put("message", "成功!");
            }else{
                json.put("code", 400);
                json.put("message","无分布数据!");
            }
		} catch (Exception e) {
			e.printStackTrace();
			json.put("code", 500);
			json.put("message","异常错误!");
		}
		return json.toString();
	}
	/**
	 * 根据trackId查询
	 */
	@RequestMapping(value = "/getFormByTrackId",produces="application/json;charset=UTF-8")
	@ResponseBody
	public String getFormByTrackId(TrackPointForm form) throws Exception {
		JSONObject json = new JSONObject();
		try {
			List<TrackPointForm> list = trackPointService.getFormByTrackId(form.getTrackId());
			if(list!=null){
                json.put("code", 200);
                json.put("data", list);
                json.put("message", "成功!");
            }else{
                json.put("code", 400);
                json.put("message","无轨迹点!");
            }
		} catch (Exception e) {
			e.printStackTrace();
			json.put("code", 500);
			json.put("message","异常错误!");
		}
		return json.toString();
	}
}