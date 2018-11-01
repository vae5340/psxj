package com.augurit.awater.dri.problem_report.correct_mark.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.augurit.agcloud.common.controller.BaseController;
import com.augurit.awater.dri.utils.ParamsToFrom;
import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.framework.security.user.OpuOmUser;
import com.augurit.awater.dri.problem_report.correct_mark.service.ICorrectMarkService;
import com.augurit.awater.dri.problem_report.correct_mark.web.form.CorrectMarkForm;
import com.augurit.awater.dri.rest.util.arcgis.form.DataFormToFeatureConvertor;
import com.augurit.awater.dri.rest.util.arcgis.form.FeatureForm;
import com.augurit.awater.dri.rest.util.arcgis.timer.Synchronous;
import com.augurit.awater.dri.rest.util.arcgis.timer.SynchronousData;
import com.augurit.awater.dri.utils.ResultForm;
import com.augurit.awater.util.excel.util.ExcelExportUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.*;

@RequestMapping("/correctMark")
@Controller
public class CorrectMarkController extends BaseController<CorrectMarkForm> {

	@Autowired
	private ICorrectMarkService correctMarkService;


	/**
	 * 应开未开井
	 * */
	@RequestMapping(value = "/searchNotCorrectPage",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String searchNotCorrectPage(HttpServletRequest request,HttpServletResponse response){
		OpuOmUser omUser =  SecurityContext.getCurrentUser();
		Map<String,Object> map = new HashMap();
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		try {
			CorrectMarkForm form  = (CorrectMarkForm)ParamsToFrom.paramsTofrom(request,CorrectMarkForm.class);
			String startTime = request.getParameter("startTime");
			String endTime = request.getParameter("endTime");
			map.put("startTime", new Date(Long.valueOf(startTime)));
			map.put("endTime", new Date(Long.valueOf(endTime)));
			if(StringUtils.isNotBlank(form.getPcode())&&StringUtils.isNotBlank(form.getChildCode())
                    &&!"null".equals(form.getPcode())&&!"null".equals(form.getChildCode())){
                form.setPcode(null);
            }
			return correctMarkService.searchNotCorrectPage(omUser,page,form,map).toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}
	
	/**
	 * 问题上报导出Excel
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/exportExcelForNotCorrect",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public void exportExcelForNotCorrect(HttpServletRequest request,HttpServletResponse response) throws Exception{
		CorrectMarkForm form  = (CorrectMarkForm)ParamsToFrom.paramsTofrom(request,CorrectMarkForm.class);
		if (StringUtils.isNotBlank(form.getParentOrgName())) {

			String sheetName = form.getParentOrgName();  //叶签名称
			String titleName = form.getParentOrgName()+"应开未开井数据列表";  //抬头名称
			String fileName = form.getParentOrgName()+"应开未开井数据";  //文件名称
			int columnNumber = 7; //抬头合并单元格
			int[] columnWidth = { 30,10, 20, 30 ,10, 10, 10};//列长度
			String[] columnName = { "标识码", "所在区", "所属部门", "地址","井类型", "井材质", "查询编号" };//列名
			List<Object[]> dataList=correctMarkService.getExcelData(form);
			ExcelExportUtil.ExportWithResponse(sheetName, titleName, fileName,
						 columnNumber, columnWidth, columnName, dataList,response);
		}
   }
	/**
	 *删除已开井
	 */
	@RequestMapping(value = "/delCorrected",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String delCorrected() {
		try {
			int count=correctMarkService.delCorrected();
			String mess="";
			if(count>0){
                 mess="已成功删除掉"+count+"个数据";
            }
			return JSON.toJSONString(new com.augurit.agcloud.common.from.ResultForm(true,mess));
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new com.augurit.agcloud.common.from.ResultForm(false,"异常错误!"));
		}
    }
	/**
	 * 获取队列长度
	 * */
	@RequestMapping(value = "/getFeature",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String getFeature(){
		return JSON.toJSONString(new ResultForm(200,SynchronousData.getQueueView().toString()));
	}
	/**
	 * 根据objectid查找匹配数据库表id
	 * */
	@RequestMapping(value = "/getFormId",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String getFormId(HttpServletRequest request){
		try {
			String isCheck = request.getParameter("isCheck");
			CorrectMarkForm form  = (CorrectMarkForm)ParamsToFrom.paramsTofrom(request,CorrectMarkForm.class);
			return correctMarkService.getFormId(isCheck,form).toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new com.augurit.agcloud.common.from.ResultForm(false,"异常错误!"));
		}
	}
	/**
	 * 根据objectid查找数据上报
	 * */
	@RequestMapping(value = "/getFormByObjectId",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String getFormByObjectId(HttpServletRequest request){
		try {
			String isCheck  = request.getParameter("isCheck");
			CorrectMarkForm form = (CorrectMarkForm) ParamsToFrom.paramsTofrom(request,CorrectMarkForm.class);
			return correctMarkService.getFormByObjectId(isCheck,form).toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new com.augurit.agcloud.common.from.ResultForm(false,"异常错误!"));
		}
	}
	/**
	 * 获取各审批状态的数量
	 */
	@RequestMapping(value = "/getNum",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String getNum(HttpServletRequest request,HttpServletResponse response){
		OpuOmUser user = null;
		Map<String,Object> map = null;
		CorrectMarkForm form = null;
		try {
			user = SecurityContext.getCurrentUser();
			map = new HashMap();
			form = (CorrectMarkForm) ParamsToFrom.paramsTofrom(request,CorrectMarkForm.class);
			String startTime = request.getParameter("startTime");
			String endTime = request.getParameter("endTime");
			if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
                map.put("startTime", Long.valueOf(startTime));
                map.put("endTime", Long.valueOf(endTime));
            }
            return correctMarkService.getNum(user,form,map);
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}
	/**
	 * 获取重复上报的设施
	 */
	@RequestMapping(value = "/getRepeatReport",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String getRepeatReport(HttpServletRequest request){
		OpuOmUser user = null;
		CorrectMarkForm form  = null;
		Map<String,Object> map = null;
		try {
			user = SecurityContext.getCurrentUser();
			form = (CorrectMarkForm) ParamsToFrom.paramsTofrom(request,CorrectMarkForm.class);
			map = new HashMap();
			String startTime = request.getParameter("startTime");
			String endTime = request.getParameter("endTime");
			if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
				map.put("startTime", Long.valueOf(startTime));
				map.put("endTime", Long.valueOf(endTime));
			}
			return correctMarkService.getRepeatReport(user,page,form,map).toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}
	/**
	 * 获取重复上报明细
	 */
	@RequestMapping(value = "/getRepeatReportDetail",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String getRepeatReportDetail(HttpServletRequest request,HttpServletResponse response){
		CorrectMarkForm form  = null;
		try {
			form = (CorrectMarkForm) ParamsToFrom.paramsTofrom(request,CorrectMarkForm.class);
			return correctMarkService.getRepeatReportDetail(page,form).toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}
	/**
	 * 图层服务审批接口
	 * */
	@RequestMapping(value = "/checkForm",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String checkForm(String checkState,String checkDesription,String isCheck,Long id){
		try {
			OpuOmUser user  = SecurityContext.getCurrentUser();
			return correctMarkService.checkForm(checkState,checkDesription,user,isCheck,id).toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}
	
	/**
	 * 删除接口
	 * */
	@RequestMapping(value = "/deleteRecord",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String deleteRecord(String reportType,String reportId){
		OpuOmUser user  = SecurityContext.getCurrentUser();
		return correctMarkService.deleteReport(reportType, reportId, user.getLoginName(),null);
	}
	
	/**
	 * 图表统计
	 * */
	@RequestMapping(value = "/searchEachts",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String searchEachts(HttpServletRequest request,HttpServletResponse response,String startTime,String endTime){
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Map<String,Object> map = null;
		try {
			OpuOmUser userForm = SecurityContext.getCurrentUser();
			CorrectMarkForm form = (CorrectMarkForm) ParamsToFrom.paramsTofrom(request,CorrectMarkForm.class);
			map = new HashMap<>();
			if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
				Date startDate = new Date(Long.valueOf(startTime));
				Date endDate = new Date(Long.valueOf(endTime));
                map.put("startTime", startDate);
                map.put("endTime", endDate);
            }
            return correctMarkService.searchEachts(form,map).toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}
	/**
	 * 查看详细
	 * */
	@RequestMapping(value = "/seeCorrectMark",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String seeCorrectMark(Long id){
		try {
			return correctMarkService.seeCorrectMark(id).toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}
	/**
	 * 上报分页查询
	 * */
	@RequestMapping(value = "/searchSbPage",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String searchSbPage(HttpServletRequest request,HttpServletResponse response,String startTime,String endTime){
		try {
			OpuOmUser user  = SecurityContext.getCurrentUser();
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Map<String,Object> map = new HashMap();
			if(StringUtils.isNotBlank(startTime)&&StringUtils.isNotBlank(endTime)){
                Date startDate = new Date(Long.valueOf(startTime));
                Date endDate = new Date(Long.valueOf(endTime));
                map.put("startTime", startDate);
                map.put("endTime", endDate);
            }
			CorrectMarkForm form = (CorrectMarkForm) ParamsToFrom.paramsTofrom(request,CorrectMarkForm.class);
			if(StringUtils.isNotBlank(form.getPcode())&&StringUtils.isNotBlank(form.getChildCode())
					&&!"null".equals(form.getPcode())&&!"null".equals(form.getChildCode())){
				form.setPcode(null);
			}
			return correctMarkService.searchSbPage(user,page,form,map).toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}

	}
	/**
	 * 分页查询
	 * */
	@RequestMapping(value = "/getCorrectMarks",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String getCorrectMarks(HttpServletRequest req,String sblx, String startTime, String endTime){
		CorrectMarkForm form = null;
		try {
			OpuOmUser user  = SecurityContext.getCurrentUser();
			form = (CorrectMarkForm) ParamsToFrom.paramsTofrom(req,CorrectMarkForm.class);
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Map<String,Object> map = new HashMap();
			if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
                Date startDate = new Date(Long.valueOf(startTime));
                Date endDate = new Date(Long.valueOf(endTime));
                map.put("startTime", startDate);
                map.put("endTime", endDate);
            }
			if("1".equals(sblx)){
                form.setReportType("confirm");//数据确认
            }else if(!"99".equals(sblx)){
                form.setReportType("modify");//数据纠错
            }
			return correctMarkService.getCorrectMarkList(user,page,form,map).toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}
	/**
	 * 分页查询是否同步
	 * */
	@RequestMapping(value = "/getCorrectAndLackMarks",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String getCorrectAndLackMarks(HttpServletRequest request,HttpServletResponse response,String startTime,String endTime){
		Map<String,Object> map = null;
		try {
			CorrectMarkForm form = (CorrectMarkForm) ParamsToFrom.paramsTofrom(request,CorrectMarkForm.class);
			OpuOmUser user  = SecurityContext.getCurrentUser();
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			map = new HashMap();
			if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
                Date startDate = new Date(Long.valueOf(startTime));
                Date endDate = new Date(Long.valueOf(endTime));
                map.put("startTime", startDate);
                map.put("endTime", endDate);
            }
			return correctMarkService.getCorrectAndLackMarks(user,page,form,map).toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}
	/**
	 * 页面批量同步数据至图层
	 * */
	@RequestMapping(value = "/synNotAddFeature",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String synNotAddFeature(){
		OpuOmUser user  = SecurityContext.getCurrentUser();
		SynchronousData s = new SynchronousData(correctMarkService);
		if(Synchronous.correctMarkService==null){
			new Synchronous(correctMarkService);
		}
		return Synchronous.synNotAddFeature(user).toString();
	}
	/**
	 * 页面数据新增至图层（暂时未使用）
	 * */
	@RequestMapping(value = "/saveAFeatureFormJs",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String saveAFeatureFormJs(){
		OpuOmUser user  = SecurityContext.getCurrentUser();
		SynchronousData s = new SynchronousData(correctMarkService);
		return correctMarkService.saveAFeatureFormJs(user).toString();
	}
	/**
	 * pc端页面修改方法
	 * */
	@RequestMapping(value = "/updateForm",produces="text/plain;charset=UTF-8")
	@ResponseBody
	public String updateForm(HttpServletRequest request,HttpServletResponse response){
		try {
			CorrectMarkForm form = (CorrectMarkForm) ParamsToFrom.paramsTofrom(request,CorrectMarkForm.class);
			JSONObject json = new JSONObject();
			if(form!=null && form.getId()!=null){
                form.setUpdateTime(new Date());
                if(form.getIsAddFeature().equals("1")){// 已添加同步数据
                    FeatureForm feature = DataFormToFeatureConvertor.convertCorrVoToForm(form);
                    Boolean flag = SynchronousData.updateFeature(feature);
                    if(flag){
                        correctMarkService.save(form);
                    }
                    json.put("success", flag);
                }else{
                    correctMarkService.save(form);
                    json.put("success", true);
                }
            }else{
                json.put("success", false);
            }
			return json.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return JSON.toJSONString(new ResultForm(500,"异常错误!"));
		}
	}
}