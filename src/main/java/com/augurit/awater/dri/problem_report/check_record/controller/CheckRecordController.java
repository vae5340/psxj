package com.augurit.awater.dri.problem_report.check_record.controller;

import com.alibaba.fastjson.JSON;
import com.augurit.agcloud.common.controller.BaseController;
import com.augurit.awater.dri.utils.ParamsToFrom;
import com.augurit.awater.dri.problem_report.check_record.service.ICheckRecordService;
import com.augurit.awater.dri.problem_report.check_record.web.form.CheckRecordForm;
import com.augurit.awater.dri.utils.ResultForm;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@RequestMapping("/checkRecord")
@Controller
public class CheckRecordController extends BaseController<CheckRecordForm>{

	@Autowired
	private ICheckRecordService checkRecordService;

	/**
	 * 查看详细
	 * */
	@RequestMapping(value = "/searchCheckRecord",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String searchCheckRecord(HttpServletRequest request,HttpServletResponse response){
		JSONObject json = new JSONObject();
        List<CheckRecordForm> list = null;
        try {
            CheckRecordForm form = (CheckRecordForm) ParamsToFrom.paramsTofrom(request,CheckRecordForm.class);
            list = checkRecordService.searchForm(form);
            json.put("rows", list);
            json.put("code", 200);
            return json.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return JSON.toJSONString(new ResultForm(500,"系统异常!"));
        }
	}

}