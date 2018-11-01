package com.augurit.awater.dri.rest;

import com.alibaba.fastjson.JSON;
import com.augurit.agcloud.common.controller.BaseController;
import com.augurit.agcloud.framework.security.user.OpusLoginUser;
import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.org.PsxjProperties;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.agcloud.org.service.IPsOrgUserService;
import com.augurit.awater.bpm.xcyh.report.service.IGxProblemReportService;
import com.augurit.awater.bpm.xcyh.report.web.form.GxProblemReportForm;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.problem_report.check_record.service.ICheckRecordService;
import com.augurit.awater.dri.problem_report.check_record.service.IReportDeleteService;
import com.augurit.awater.dri.problem_report.correct_mark.convert.CorrectMarkAttachmentConvertor;
import com.augurit.awater.dri.problem_report.correct_mark.convert.CorrectMarkConvertor;
import com.augurit.awater.dri.problem_report.correct_mark.entity.CorrectMarkAttachment;
import com.augurit.awater.dri.problem_report.correct_mark.service.ICorrectMarkAttachmentService;
import com.augurit.awater.dri.problem_report.correct_mark.service.ICorrectMarkService;
import com.augurit.awater.dri.problem_report.correct_mark.web.form.CorrectMarkAttachmentForm;
import com.augurit.awater.dri.problem_report.correct_mark.web.form.CorrectMarkForm;
import com.augurit.awater.dri.problem_report.diary.convert.DiaryAttachmentConvertor;
import com.augurit.awater.dri.problem_report.diary.convert.DiaryConvertor;
import com.augurit.awater.dri.problem_report.diary.entity.Diary;
import com.augurit.awater.dri.problem_report.diary.entity.DiaryAttachment;
import com.augurit.awater.dri.problem_report.diary.service.IDiaryAttachmentService;
import com.augurit.awater.dri.problem_report.diary.service.IDiaryService;
import com.augurit.awater.dri.problem_report.diary.web.form.DiaryAttachmentForm;
import com.augurit.awater.dri.problem_report.diary.web.form.DiaryForm;
import com.augurit.awater.dri.problem_report.lack_mark.convert.LackMarkAttachmentConvertor;
import com.augurit.awater.dri.problem_report.lack_mark.convert.LackMarkConvertor;
import com.augurit.awater.dri.problem_report.lack_mark.entity.LackMarkAttachment;
import com.augurit.awater.dri.problem_report.lack_mark.service.ILackMarkAttachmentService;
import com.augurit.awater.dri.problem_report.lack_mark.service.ILackMarkService;
import com.augurit.awater.dri.problem_report.lack_mark.web.form.LackMarkAttachmentForm;
import com.augurit.awater.dri.problem_report.lack_mark.web.form.LackMarkForm;
import com.augurit.awater.dri.rest.util.arcgis.form.DataFormToFeatureConvertor;
import com.augurit.awater.dri.rest.util.arcgis.form.FeatureForm;
import com.augurit.awater.dri.rest.util.arcgis.timer.SynchronousData;
import com.augurit.awater.dri.rest.util.arcgis.timer.SynchronousUpdateData;
import com.augurit.awater.dri.utils.JsonOfForm;
import com.augurit.awater.dri.utils.ParamsToFrom;
import com.augurit.awater.dri.utils.ResultForm;
import com.augurit.awater.util.ThirdUtils;
import com.augurit.awater.util.file.SysFileUtils;
import com.common.util.Common;
import net.coobird.thumbnailator.Thumbnails;
import net.sf.json.JSONObject;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.text.Format;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@RequestMapping("/rest/app/parts")
@Controller
public class PartsRestController extends BaseController {
    @Autowired
    private IOmUserInfoRestService omUserInfoRestService;
    @Autowired
    private IOmOrgRestService omOrgRestService;
    @Autowired
    private PsxjProperties psxjProperties;
    @Autowired
    private IPsOrgUserService psOrgUserService;

    @Autowired
    private ICorrectMarkService correctMarkService;
    @Autowired
    private ICorrectMarkAttachmentService correctMarkAttachmentService;
    @Autowired
    private IGxProblemReportService gxProblemReportService;
    /**
     * 新增（缺失）标识
     */
    @Autowired
    private ILackMarkService lackMarkService;
    @Autowired
    private ILackMarkAttachmentService lackMarkAttachmentService;
    /**
     * 巡查、养护
     */
    @Autowired
    private IDiaryService diaryService;
    @Autowired
    private IDiaryAttachmentService diaryAttachmentService;
    // 审核记录表
    @Autowired
    private ICheckRecordService checkRecordService;
    //删除记录
    @Autowired
    private IReportDeleteService reportDeleteService;

    /**
     * 图片上传地址
     */
    private String uploadPath = ThirdUtils.getInPath() + "\\ReportFile\\"; // 图片的物理路径
    private String requestPath = "/ReportFile/"; // 图片的请求路径


    /**
     * 模糊匹配用户上报道路列表
     */
    @RequestMapping(value = "/searchMatch", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String searchMatch(String loginName, String road, String type) {
        JSONObject json = new JSONObject();
        Map<String, Object> map = new HashMap<>();
        List<Map<String, Object>> list = new ArrayList<>();
        if (!StringUtils.isNotBlank(loginName) || !StringUtils.isNotBlank(road)
                || !StringUtils.isNotBlank(type)) {
            json.put("code", 500);
            json.put("message", "参数错误！");
            return json.toString();
        }
        try {
            OpuOmUserInfo user = omUserInfoRestService.getOpuOmUserInfoByLoginName(loginName);
            map.put("personUserId", user.getUserId());
            map.put("road", road);
            if ("correct".equals(type)) {
                list = correctMarkService.countRoad(map);
            } else if ("lack".equals(type)) {
                list = lackMarkService.countRoad(map);
            }
            json.put("code", 200);
            json.put("data", list);
        } catch (Exception e) {
            json.put("code", 500);
            json.put("message", "异常错误！");
            e.printStackTrace();
        }
        return json.toString();
    }

    /**
     * 移动端删除接口
     */
    @RequestMapping(value = "/deleteReport", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String deleteReport(String reportType, String loginName, String reportId, String phoneBrand) {
        JSONObject json = new JSONObject();
        OpuOmUserInfo userForm = omUserInfoRestService.getOpuOmUserInfoByLoginName(loginName);
        if (!StringUtils.isNotBlank(reportType) || !StringUtils.isNotBlank(reportId)
                || !StringUtils.isNotBlank(loginName) || !StringUtils.isNotBlank(phoneBrand)) {
            json.put("code", 500);
            json.put("message", "参数错误！");
            return json.toString();
        }
        /*THE
		List<SysCodeForm> codeList = sysCodeService.getItems("AWATER_APP_DELETE");
		Collections.sort(codeList, ParamsToFrom.comparatorObject);*/
        Long deleteCount = 10l;
        try {
			/*THE
			deleteCount = Long.parseLong(codeList.get(0).getItemCode());*/
        } catch (NumberFormatException e) {
            deleteCount = 10l;
        }
        Long countUser = reportDeleteService.getToDayCount(userForm.getUserId().toString());
        try {
            if (countUser >= deleteCount) {
                json.put("code", 500);
                json.put("message", "今日删除数量已达到上限!");
                return json.toString();
            } else {
                String result = correctMarkService.deleteReport(reportType, reportId, loginName, phoneBrand);
                JSONObject jsons = JSONObject.fromObject(result);
                if (jsons.containsKey("code") && jsons.get("code").equals(200)) {
					/*ReportProblemTypeForm rf = reportProblemTypeService.getForm(reportType,reportId);
					if(rf!=null){
						rf.setIsDelete(1l);
						reportProblemTypeService.save(rf);
					}*/
                    String message = jsons.getString("message");
                    jsons.put("message", message + "今日已删除" + (countUser + 1) + "条!");
                }
                return jsons.toString();
            }
        } catch (Exception e) {
            json.put("code", 500);
            json.put("message", "异常错误!");
            e.printStackTrace();
            return json.toString();
        }
    }

    /**
     * 验证上报记录是否重复
     */
    @RequestMapping(value = "/checkRecord", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String checkRecord(String loginName, String usid) {
        JSONObject json = new JSONObject();
        Map map = new HashMap<>();
        CorrectMarkForm form = new CorrectMarkForm();
        OpuOmUserInfo user = omUserInfoRestService.getOpuOmUserInfoByLoginName(loginName);
        List<OpuOmOrg> listOrg = omOrgRestService.listOpuOmOrgByUserId(user.getUserId());
        String ordId = null;
        if (listOrg != null && listOrg.size() > 0) {
            for (OpuOmOrg om : listOrg) {
                if ("14".equals(om.getOrgRank())) {
                    ordId = om.getOrgId();
                    if(om.getOrgId().contains(om.getOpusOmType().getCode()))
                        ordId = om.getOrgId().substring(om.getOpusOmType().getCode().length()+1);
                    break;
                }
            }
        }
        if (ordId == null) {
            return JSON.toJSONString(new ResultForm(500, "当前用户未找到业主单位!"));
        }
        //如果是业主单位就返回业主单位id，否则查询最上级的业主单位，没有返回null
        if (!StringUtils.isNotBlank(usid)) {
            json.put("code", 500);
            json.put("message", "参数错误!");
            return json.toString();
        }
        form.setParentOrgId(ordId);   //查询当前业主单位有没有
        form.setUsid(usid);
        Page<CorrectMarkForm> pag = new Page();
        try {
            pag = correctMarkService.search(pag, form);
            if (pag.getResult() != null && pag.getResult().size() > 0) {
                CorrectMarkForm f = pag.getResult().get(0);
                map.put("userName", f.getMarkPerson());
                OpuOmUserInfo userForm = omUserInfoRestService.getOpuOmUserInfoByLoginName(f.getMarkPersonId());
                map.put("phone", userForm != null ? userForm.getUserMobile() : "");
                map.put("total", pag.getTotalItems());
            }
            json.put("code", 200);
            json.put("data", map);
        } catch (Exception e) {
            json.put("code", 500);
            json.put("message", "异常错误!");
            e.printStackTrace();
        }
        return json.toString();
    }

    /**
     * 获取审核记录接口
     */
    @RequestMapping(value = "/toCheckRecord", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String toCheckRecord(String reportType, String reportId) {
        return checkRecordService.toCheckRecord(reportType, reportId);
    }

    /**
     * 数据上报统计
     */
    @RequestMapping(value = "/toPartsCount", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String toPartsCount(String parentOrgName, String reportType, String startTime,
                               String endTime) {
        JSONObject json = new JSONObject();
        CorrectMarkForm form = new CorrectMarkForm();
        Map<String, Object> map = new HashMap();
        if (StringUtils.isNotBlank(parentOrgName)) {
            if (parentOrgName.contains("净水公司")) {
                form.setParentOrgName("净水有限公司");
            } else {
                if (!parentOrgName.contains("全市")) {
                    form.setParentOrgName(parentOrgName);
                }
            }
        }
        if (StringUtils.isNotBlank(reportType)) {
            map.put("reportType", reportType);
        }
        if (StringUtils.isNotBlank(startTime))
            map.put("startTime", new Date(Long.parseLong(startTime)));
        if (StringUtils.isNotBlank(endTime))
            map.put("endTime", new Date(Long.parseLong(endTime)));
        Map<String, Object> maps = correctMarkService.toPartsCount(form, map);
        return JSONObject.fromObject(maps).toString();
    }

    /**
     * 昨天和今天区域统计
     */
    @RequestMapping(value = "/toPastNowDay", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String toPastNowDay(String layerName) {
        return correctMarkService.toPastNowDay(layerName);
    }

    /**
     * 根据图层数据条件查询附件
     */
    @RequestMapping(value = "/toFeatureAttach", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String toFeatureAttach(HttpServletRequest req) {
        String path = req.getScheme() + "://" + req.getServerName() + ":"
                + req.getServerPort();
        String objectId = req.getParameter("objectId");
        String reportType = req.getParameter("reportType");
        return correctMarkService.toFeatureAttach(path, objectId, reportType);
    }

    /**
     * 查询所在业主单位(暂未使用)
     */
    @RequestMapping(value = "/toParentName", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String toParent(HttpServletRequest req) {
        String loginName = req.getParameter("loginName");
        return correctMarkService.getParentOrgName(loginName);
    }

    /**
     * 查看详细 type（correct纠错、lack修正）
     */
    @RequestMapping(value = "/toView", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String toView(HttpServletRequest req) {
        JSONObject json = new JSONObject();
        Map<String, Object> maps = new HashMap<>();
        String path = req.getScheme() + "://" + req.getServerName() + ":"
                + req.getServerPort();
        String type = req.getParameter("type");
        String id = req.getParameter("id");
        if (StringUtils.isNotBlank(type) && StringUtils.isNotBlank(id)) {
            if (type.equals("correct")) {
                maps = correctMarkService.seeCorrectMark(path, Long.parseLong(id));
                Map m = (Map) maps.get("data");
                json = JSONObject.fromObject(maps);
            } else if (type.equals("lack")) {
                maps = lackMarkService.seeLackMark(path, Long.parseLong(id));
                Map m = (Map) maps.get("data");
                json = JSONObject.fromObject(maps);
            }
            json.put("code", 200);
        } else {
            json.put("code", 300);
            json.put("message", "参数有误!");
        }
        return json.toString();
    }

    /**
     * 移动端的查看全部功能（查看纠错上报和缺失上报）
     */
    @RequestMapping(value = "/searchCorrOrLack", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String searchCorrOrLack(HttpServletRequest req) {
        JSONObject json = new JSONObject();
        String path = req.getScheme() + "://" + req.getServerName() + ":"
                + req.getServerPort();
        String loginName = req.getParameter("loginName");
        String layerName = req.getParameter("layerName");// 设施类型
        String parentOrgName = req.getParameter("parentOrgName");// 区域搜索
        String type = req.getParameter("type");// 纠错还是上报（两张表）
        String pageNo = req.getParameter("pageNo");
        String pageSize = req.getParameter("pageSize");
        String startTime = req.getParameter("startTime");
        String endTime = req.getParameter("endTime");
        Map<String, Object> map = new HashMap();
        if (StringUtils.isNotBlank(startTime))
            map.put("startTime", new Date(Long.parseLong(startTime)));
        if (StringUtils.isNotBlank(endTime))
            map.put("endTime", new Date(Long.parseLong(endTime)));
        Page page = new Page();
        List<Map<String, Object>> listMap = new ArrayList<>();
        try {
            Long countCorr = new Long(0);
            Long countLack = new Long(0);
            Map<String, Object> mapList = new HashMap();
            if (StringUtils.isNotBlank(pageNo)
                    && StringUtils.isNotBlank(pageSize)) {
                page.setPageNo(Integer.parseInt(pageNo));
                page.setPageSize(Integer.parseInt(pageSize));
            }
            List<Map> listAll = new ArrayList<>();
             if (StringUtils.isNotBlank(type)) {
                if (type.equals("correct")) { // 纠错
                    mapList = correctMarkService.searchCorrectMark(page,
                            loginName, layerName, parentOrgName, map, path);
                    if (mapList.containsKey("data")) {
                        listAll = (List<Map>) mapList.get("data");
                        countCorr = (Long) mapList.get("total");
                    }
                } else if (type.equals("lack")) { // 上报
                    mapList = lackMarkService.searchLackMark(page, loginName,
                            layerName, parentOrgName, map, path);
                    if (mapList.containsKey("data")) {
                        listAll = (List<Map>) mapList.get("data");
                        countLack = (Long) mapList.get("total");
                    }
                }
            } else {
                Map<String, Object> ma = correctMarkService.searchCorrectAndLackMark(page, loginName, layerName, parentOrgName, map, path);
                json = JSONObject.fromObject(ma);
                json.put("code", 200);
                return json.toString();
            }
            json.put("code", 200);
            json.put("data", listAll);
            json.put("total", countCorr + countLack);
            json.put("corrTotal", countCorr);
            json.put("lackTotal", countLack);
            return json.toString();
        } catch (NumberFormatException e) {
            json.put("code", 300);
            json.put("message", "参数错误!查询失败!");
            e.printStackTrace();
            return json.toString();
        }
    }

    /**
     * 根据objectid查询所有
     * */
    @RequestMapping(value = "/searchCorrOrLackByOId", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String searchCorrOrLackByOId(HttpServletRequest req) {
        JSONObject json = new JSONObject();
        String path = req.getScheme() + "://" + req.getServerName() + ":"
                + req.getServerPort();
        String loginName = req.getParameter("loginName");
        String layerName = req.getParameter("layerName");// 设施类型
        String parentOrgName = req.getParameter("parentOrgName");// 区域搜索
        String type = req.getParameter("type");// 纠错还是上报（两张表）
        String pageNo = req.getParameter("pageNo");
        String pageSize = req.getParameter("pageSize");
        String startTime = req.getParameter("startTime");
        String endTime = req.getParameter("endTime");
        String objectId = req.getParameter("objectId");
        String usid = req.getParameter("usid");
        Map<String, Object> map = new HashMap();
        if (StringUtils.isNotBlank(startTime))
            map.put("startTime", new Date(Long.parseLong(startTime)));
        if (StringUtils.isNotBlank(endTime))
            map.put("endTime", new Date(Long.parseLong(endTime)));
        if (StringUtils.isNotBlank(objectId))
            map.put("objectId", objectId);
        if (StringUtils.isNotBlank(usid))
            map.put("usid", usid);
        Page page = new Page();
        List<Map<String, Object>> listMap = new ArrayList<>();
        try {
            Long countCorr = new Long(0);
            Long countLack = new Long(0);
            Map<String, Object> mapList = new HashMap();
            if (StringUtils.isNotBlank(pageNo)
                    && StringUtils.isNotBlank(pageSize)) {
                page.setPageNo(Integer.parseInt(pageNo));
                page.setPageSize(Integer.parseInt(pageSize));
            }
            List<Map> listAll = new ArrayList<>();
            if (StringUtils.isNotBlank(type)) {
                if (type.equals("correct")) { // 纠错
                    mapList = correctMarkService.searchCorrectMark(page,
                            null, layerName, parentOrgName, map, path);
                    if (mapList.containsKey("data")) {
                        listAll = (List<Map>) mapList.get("data");
                        countCorr = (Long) mapList.get("total");
                    }
                } else if (type.equals("lack")) { // 上报
                    mapList = lackMarkService.searchLackMark(page, null,
                            layerName, parentOrgName, map, path);
                    if (mapList.containsKey("data")) {
                        listAll = (List<Map>) mapList.get("data");
                        countLack = (Long) mapList.get("total");
                    }
                }
            } else {
                Map<String,Object> ma = correctMarkService.searchCorrectAndLackMark(page,loginName, layerName, parentOrgName, map, path);
                json = JSONObject.fromObject(ma);
                json.put("code", 200);
                return json.toString();
            }
            json.put("code", 200);
            json.put("data", listAll);
            json.put("total", countCorr + countLack);
            json.put("corrTotal", countCorr);
            json.put("lackTotal", countLack);
            return json.toString();
        } catch (NumberFormatException e) {
            json.put("code", 300);
            json.put("message", "参数错误!查询失败!");
            e.printStackTrace();
            return json.toString();
        }
    }

    /**
     * 数据上报和事件上报的最新十条数据(巡检动态)
     */
    @RequestMapping(value = "/getLatestTen")
    @ResponseBody
    public ResultForm getLatestTen() {
        try {
            return new ResultForm(200, correctMarkService.getLatestTenList());
        } catch (Exception e) {
            e.printStackTrace();
            return new ResultForm(500, "查询失败！");
        }
    }

    /**
     * 上报修正部件的修正标识
     */
    @RequestMapping(value = "/partsCorr")
    @ResponseBody
    public ResultForm partsCorr(HttpServletRequest req) {
        ResultForm result = new ResultForm();
        List<Map<String, Object>> listMapPhotos = new ArrayList<>();
        Date s1 = new Date();
        try {
            String loginName = req.getParameter("loginName");
            String reportType = req.getParameter("reportType");
            CorrectMarkForm f = this.getFrom(req, loginName);
            // 判断图片是否保存本地报错（如果有报错不执行保存数据库操作，反之往下执行）
            boolean isMultiparPhotos = ServletFileUpload
                    .isMultipartContent(req);
            if (isMultiparPhotos) {
                MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) req;
                Map<String, MultipartFile> mapFile = multiRequest.getFileMap();
                this.saveFiles(req, mapFile, listMapPhotos);
				/*if (listMapPhotos == null || listMapPhotos.size()==0) {
					return new ResultForm(400,"附件上传失败!异常错误!");
				}*/
            }
            if (f == null && !StringUtils.isNotBlank(reportType)) {
                return new ResultForm(300, "保存失败,参数有误！");
            }
            if ("数据确认".equals(reportType) || "confirm".equals(reportType)) {
                reportType = "confirm";
            } else {
                reportType = "modify";
            }
            f.setReportType(reportType);
            if (f.getId() == null) {
                if (!"设施不存在".equals(f.getCorrectType())
                        || !f.getCorrectType().contains("不存在")) {
                    if (listMapPhotos == null || listMapPhotos.size() < 1) {
                        return new ResultForm(300, "未检测到图片!");
                    }
                    if (listMapPhotos.size() < 3) {
                        return new ResultForm(300, "图片数量不满足要求!");
                    }
                }
                f.setMarkPersonId(loginName);
                f.setMarkTime(new Date());
                f.setUpdateTime(new Date());
                f.setIsAddFeature("0");
                f.setCheckState("1"); // 新报默认未审核
                correctMarkService.save(f);
                //20180521这里去删除一下空间表的开井的数据
                //correctMarkService.delCorrected();
                result.setMessage("保存成功!");
                FeatureForm feature = DataFormToFeatureConvertor
                        .convertCorrVoToForm(f);
                if (SynchronousData.correctMarkService == null) {
                    new SynchronousData(correctMarkService);
                }
                Boolean flag = SynchronousData.addFeature(feature);
                if (!flag) {
                    f.setIsAddFeature("2");// 未同步，需要手动同步
                    correctMarkService.save(f);
                }
            } else {// 判断7天修改期限
                Long times = 1000l * 60l * 60l * 24l * 180l;
                CorrectMarkForm corrForm = correctMarkService.get(f.getId());
                if (new Date().getTime() <= corrForm.getMarkTime().getTime()
                        + times) {
                    String attachment = req.getParameter("deletedPhotoIds");
                    try {
                        correctMarkAttachmentService.deleteIds(attachment);
                    } catch (Exception e) {
                        e.printStackTrace();
                        return new ResultForm(300, "修改失败！图片参数错误!"+e.getMessage());
                    }
                    correctMarkService.updateForm(f);
                    result.setMessage("修改成功!");
                    // 同步图层操作
                    CorrectMarkForm corrFormUppdate = correctMarkService.get(f
                            .getId());
                    if (corrFormUppdate.getObjectId() != null) {
                        FeatureForm feature = DataFormToFeatureConvertor
                                .convertCorrVoToForm(corrFormUppdate);
                        if (SynchronousUpdateData.correctMarkService == null) {
                            new SynchronousUpdateData(correctMarkService);
                        }
                        Boolean flag = SynchronousUpdateData
                                .addFeature(feature);
                        if (!flag) {
                            corrFormUppdate.setIsAddFeature("3"); // 更新失败需要定时器更新（可能图层服务挂了）
                            correctMarkService.save(corrFormUppdate);
                        }
                    } else {
                        if ("2".equals(corrFormUppdate.getIsAddFeature())) {// 可能存在未同步情况（修改顺便同步）
                            FeatureForm feature = DataFormToFeatureConvertor
                                    .convertCorrVoToForm(corrFormUppdate);
                            if (SynchronousData.correctMarkService == null) {
                                new SynchronousData(correctMarkService);
                            }
                            Boolean flag = SynchronousData.addFeature(feature);
                            if (!flag) {
                                corrFormUppdate.setIsAddFeature("2");// 未同步，需要手动同步
                                correctMarkService.save(corrFormUppdate);
                            }
                        }
                    }
                } else {
                    return new ResultForm(300, "修改失败,已超过修改时间!");
                }
            }
            result.setCode(200);
            result.setSuccess(true);
            if (listMapPhotos != null && listMapPhotos.size() > 0) {
                for (Map ma : listMapPhotos) {
                    ma.put("markId", f.getId());
                }
                List<CorrectMarkAttachmentForm> listFrom = CorrectMarkAttachmentConvertor
                        .convertFormListToVoListMap(listMapPhotos);
                int fi = 0;
                for (CorrectMarkAttachmentForm froms : listFrom) {
                    correctMarkAttachmentService.save(froms);
                    fi++;
                }
                String mess = result.getMessage();
                mess += ",成功上传" + fi + "个附件!";
                result.setMessage(mess);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResultForm(500, "异常错误!");
        }
        return result;
    }

    /**
     * 上报新增部件的标识
     */
    @RequestMapping(value = "/partsNew", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String partsNew(HttpServletRequest req) {
        JSONObject json = new JSONObject();
        List<Map<String, Object>> listMapPhotos = new ArrayList<>();
        try {
            String loginName = req.getParameter("loginName");
            String reportType = req.getParameter("reportType");
            LackMarkForm f = this.getAttachFrom(req, loginName);

            // 判断图片是否保存本地报错（如果有报错不执行保存数据库操作，反之往下执行）
            boolean isMultiparPhotos = ServletFileUpload
                    .isMultipartContent(req);
            if (isMultiparPhotos) {
                MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) req;
                Map<String, MultipartFile> mapFile = multiRequest.getFileMap();
                this.saveFiles(req, mapFile, listMapPhotos);
                if (listMapPhotos == null && listMapPhotos.size() == 0) {
                    json.put("code", 500);
                    json.put("message", "附件上传失败!异常错误!");
                    return json.toString();
                }
            }
            if (f == null) {
                json.put("code", 300);
                json.put("message", "保存失败,参数有误！");
                return json.toString();
            }
            if (f != null && f.getId() == null) {
                if (listMapPhotos == null || listMapPhotos.size() < 1) {
                    json.put("code", 300);
                    json.put("message", "未检测到图片!");
                    return json.toString();
                }
                if (listMapPhotos.size() < 3) {
                    json.put("code", 300);
                    json.put("message", "图片数量不满足要求!");
                    return json.toString();
                }
                f.setMarkPersonId(loginName);
                f.setMarkTime(new Date());
                f.setUpdateTime(new Date());
                f.setCheckState("1"); // 新报默认未审核
                f.setIsAddFeature("0");
                lackMarkService.save(f);
                json.put("message", "保存成功!");
                FeatureForm feature = DataFormToFeatureConvertor
                        .convertLackVoToForm(f);
                if (SynchronousData.correctMarkService == null) {
                    new SynchronousData(correctMarkService);
                }
                Boolean flag = SynchronousData.addFeature(feature);
                if (!flag) {
                    f.setIsAddFeature("2");// 未同步(队列已满)
                    lackMarkService.save(f);
                }
            } else {
                Long times = 1000l * 60l * 60l * 24l * 90l; // 默认90天的修改期限
                LackMarkForm lackForms = lackMarkService.get(f.getId());
                if (new Date().getTime() <= lackForms.getMarkTime().getTime()
                        + times) {
                    String attachment = req.getParameter("deletedPhotoIds");
                    try {
                        lackMarkAttachmentService.deleteIds(attachment);
                    } catch (Exception e) {
                        e.printStackTrace();
                        json.put("code", 300);
                        json.put("message", "修改失败！图片参数错误!"+e.getMessage());
                        return json.toString();
                    }
                    lackMarkService.updateForm(f);
                    json.put("message", "修改成功!");
                    LackMarkForm lackFormUpdate = lackMarkService
                            .get(f.getId());
                    // 同步图层操作
                    if (lackFormUpdate.getObjectId() != null) {
                        FeatureForm feature = DataFormToFeatureConvertor
                                .convertLackVoToForm(lackFormUpdate);
                        if (SynchronousUpdateData.correctMarkService == null) {
                            new SynchronousUpdateData(correctMarkService);
                        }
                        Boolean flag = SynchronousUpdateData
                                .addFeature(feature);
                        if (!flag) {
                            lackFormUpdate.setIsAddFeature("3"); // 更新失败需要定时器更新（可能图层服务挂了）
                            lackMarkService.save(lackFormUpdate);
                        }
                    } else {
                        if ("2".equals(lackFormUpdate.getIsAddFeature())) {// 可能存在未同步情况（修改顺便同步）
                            FeatureForm feature = DataFormToFeatureConvertor
                                    .convertLackVoToForm(lackFormUpdate);
                            if (SynchronousData.correctMarkService == null) {
                                new SynchronousData(correctMarkService);
                            }
                            Boolean flag = SynchronousData.addFeature(feature);
                            if (!flag) {
                                lackFormUpdate.setIsAddFeature("2");// 未同步，需要手动同步
                                lackMarkService.save(lackFormUpdate);
                            }
                        }
                    }
                } else {
                    json.put("code", 300);
                    json.put("message", "修改失败,已超过修改时间!");
                    return json.toString();
                }
            }
            json.put("code", 200);
            if (listMapPhotos != null && listMapPhotos.size() > 0) {
                for (Map ma : listMapPhotos) {
                    ma.put("markId", f.getId());
                }
                int fi = 0;
                List<LackMarkAttachmentForm> listFrom = LackMarkAttachmentConvertor
                        .convertFormListToVoListMap(listMapPhotos);
                for (LackMarkAttachmentForm froms : listFrom) {
                    lackMarkAttachmentService.save(froms);
                    fi++;
                }
                String mess = json.getString("message");
                mess += ",成功上传" + fi + "个附件!";
                json.put("message", mess);
            }
        } catch (Exception e) {
            json.put("code", 500);
            json.put("message", "异常错误!");
            e.printStackTrace();
        }
        return json.toString();
    }

    /**
     * 巡查、养护日志（上报日志）
     */
    @RequestMapping(value = "/diayrNew", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String diayrNew(HttpServletRequest req, MultipartFile[] files) {
        JSONObject json = new JSONObject();
        List<Map<String, Object>> listMapPhotos = new ArrayList<>();
        try {
            String loginName = req.getParameter("loginName");
            OpusLoginUser opusLoginUser = (OpusLoginUser) req.getAttribute("opusLoginUser");
            loginName = opusLoginUser.getUser().getLoginName();
            DiaryForm f = this.getDiaryAttachFrom(req, loginName);
			// 判断图片是否保存本地报错（如果有报错不执行保存数据库操作，反之往下执行）
			boolean isMultiparPhotos = ServletFileUpload
					.isMultipartContent(req);//判断enctype,文件上传的前提,1.form表单的method必须是post2.form表单的enctype必须是multipart/form-data 以二进制字节流
            if (isMultiparPhotos) {
				MultipartHttpServletRequest multiRequest=(MultipartHttpServletRequest)req;
				Map<String,MultipartFile> mapFile= multiRequest.getFileMap();
				this.saveFiles(req,mapFile,listMapPhotos);
				if (listMapPhotos == null&& listMapPhotos.size()==0) {
					json.put("code", 500);
					json.put("message", "附件上传失败!异常错误!");
					return json.toString();
				}
			}
			if (listMapPhotos == null || listMapPhotos.size() < 1) {
				json.put("code", 300);
				json.put("message", "未检测到图片!");
				return json.toString();
			}
			if (listMapPhotos.size() < 3) {
				json.put("code", 300);
				json.put("message", "图片数量不满足要求!");
				return json.toString();
			}
			// 判断接受过来的参数必须有队伍成员
			if (f == null || !StringUtils.isNotBlank(f.getTeamMember())) {
				json.put("code", 300);
				json.put("message", "操作失败,参数有误！");
				return json.toString();
			}
			if(StringUtils.isBlank(f.getObjectId())||"null".equals(f.getObjectId())){
				json.put("code", 300);
				json.put("message", "操作失败,请选择设施进行巡检！");
				return json.toString();
			}
			if (f.getId() == null) {
				f.setWriterId(loginName);
				f.setRecordTime(new Date());
				diaryService.save(f);
				Map<String,Object> featureMap= new HashMap();
				featureMap.put("x",f.getX());
				featureMap.put("y",f.getY());
				//获取设施巡检次数
				Long dirTotal =  diaryService.getDiaryCount(f.getObjectId());
				featureMap.put("dbzt",dirTotal);
				String feature = DataFormToFeatureConvertor.convertFeatureMapToJson(featureMap);
				Boolean flag = SynchronousUpdateData.updateFeature(feature);
				json.put("message", "保存成功!");
				if(!flag){
					log.info("图层写入失败!");
				}
			} else {// 系统会判断时间是否超过7天
				if (new Date().getTime() <= f.getRecordTime().getTime() + 1000
						* 60 * 60 * 24 * 7) {
					f.setUpdateTime(new Date());
					diaryService.updateForm(f);
					json.put("message", "修改成功!");
				} else {
					json.put("code", 300);
					json.put("message", "修改失败,已超过修改时限!");
				}
			}
			json.put("code", 200);
			if (listMapPhotos != null && listMapPhotos.size() > 0) {
				for (Map ma : listMapPhotos) {
					ma.put("markId", f.getId());
				}
				List<DiaryAttachmentForm> listFrom = DiaryAttachmentConvertor
						.convertFormListToVoListMap(listMapPhotos);
				int fi = 0;
				for (DiaryAttachmentForm froms : listFrom) {
					diaryAttachmentService.save(froms);
					fi++;
				}
				String mess = json.getString("message");
				mess += ",成功上传" + fi + "个文件!";
				json.put("message", mess);
			}
		} catch (Exception e) {
			json.put("code", 500);
			json.put("message", "异常错误!");
			e.printStackTrace();
		}
		return json.toString();
	}


    /**
     * 巡检日志删除接口
     **/
    @RequestMapping(value = "/deleteDiary", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String deleteDiary(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String id = request.getParameter("id");
        if (!StringUtils.isNotBlank(id)) {
            json.put("code", 300);
            json.put("message", "参数有误!");
            return json.toString();
        }
        DiaryForm df = diaryService.get(Long.parseLong(id));   //根据id删除
        String s = diaryService.deleteDiary(id);
        //diaryService.updateXjdbToOne(df.getObjectId());        //删除前查看是否达标
        return s;
    }

    /**
     * 巡检日志再次编辑(修改)
     */
    @RequestMapping(value = "/toEditDiary", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String toEditDiary(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        List<Map<String, Object>> listMapPhotos =new ArrayList<>();
        try {
            String loginName = request.getParameter("loginName");
            //String attachment = req.getParameter("attachment");
            DiaryForm f = this.getDiaryAttachFrom(request, loginName);

            // 判断图片是否保存本地报错（如果有报错不执行保存数据库操作，反之往下执行）
            boolean isMultiparPhotos = ServletFileUpload
                    .isMultipartContent(request);
            if (isMultiparPhotos) {
                MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
                Map<String, MultipartFile> mapFile = multiRequest.getFileMap();
                this.saveFiles(request, mapFile, listMapPhotos);
                if (listMapPhotos == null && listMapPhotos.size() == 0) {
                    json.put("code", 500);
                    json.put("message", "附件上传失败!异常错误!");
                    return json.toString();
                }
            }
            if (f.getId() == null) {
                if (listMapPhotos == null || listMapPhotos.size() < 1) {
                    json.put("code", 300);
                    json.put("message", "未检测到图片!");
                    return json.toString();
                }
                if (listMapPhotos.size() < 3) {
                    json.put("code", 300);
                    json.put("message", "图片数量不满足要求!");
                    return json.toString();
                }
                // 判断接受过来的参数必须有队伍成员
                if (f == null || !StringUtils.isNotBlank(f.getTeamMember())) {
                    json.put("code", 300);
                    json.put("message", "操作失败,参数有误！");
                    return json.toString();
                }
                f.setWriterId(loginName);
                f.setRecordTime(new Date());
                diaryService.save(f);
                json.put("message", "保存成功!");
            } else {// 系统会判断时间是否超过7天
//				if (new Date().getTime() <= f.getRecordTime().getTime() + 1000
//						* 60 * 60 * 24 * 7) {
                String attachment = request.getParameter("attachment");
                try {
                    diaryAttachmentService.deleteIds(attachment);

                } catch (Exception e) {
                    json.put("code", 300);
                    json.put("message", "修改失败!");
                    return json.toString();
                }
                f.setUpdateTime(new Date());
                diaryService.updateForm(f);
                json.put("message", "修改成功!");
            }
            json.put("code", 200);
            if (listMapPhotos != null && listMapPhotos.size() > 0) {
                for (Map ma : listMapPhotos) {
                    ma.put("markId", f.getId());
                }
                List<DiaryAttachmentForm> listFrom = DiaryAttachmentConvertor
                        .convertFormListToVoListMap(listMapPhotos);
                int fi = 0;
                for (DiaryAttachmentForm froms : listFrom) {
                    diaryAttachmentService.save(froms);
                    fi++;
                }
                String mess = json.getString("message");
                mess += ",成功上传" + fi + "个文件!";
                json.put("message", mess);
            }
        } catch (Exception e) {
            json.put("code", 500);
            json.put("message", "异常错误!");
            e.printStackTrace();
        }
        return json.toString();
    }

    /**
     * 查看详情 （巡查日志）
     */
    @RequestMapping(value = "/toDiaryView", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String toDiaryView(HttpServletRequest req) {
        JSONObject json = new JSONObject();
        Map<String, Object> maps = new HashMap<>();
        String path = req.getScheme() + "://" + req.getServerName() + ":"
                + req.getServerPort()+req.getContextPath()+psxjProperties.getRequest_file_path();
        //String type = req.getParameter("type");
        String id = req.getParameter("id");
        if (StringUtils.isNotBlank(id)) {

            maps = diaryService.seeDiaryMark(path, Long.parseLong(id));
            //maps= correctMarkService.seeCorrectMark(path,Long.parseLong(id));
            Map m = (Map) maps.get("data");
			/*	ReportProblemTypeForm rf = reportProblemTypeService.getForm("modify", m.get("id").toString());
				if(rf!=null){
					m.put("childCode", rf.getCode());
					m.put("pCode", rf.getPCode());
				}*/
            json = JSONObject.fromObject(maps);
            //return diaryService.seeDiary(Long.parseLong(id));
            json.put("code", 200);
        } else {
            json.put("code", 300);
            json.put("message", "参数有误!");
        }
        return json.toString();
    }

    /**
     * 获取某个设施的巡检日志列表
     */
    @RequestMapping(value = "/getFacilityDiary", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String getFacilityDiary(HttpServletRequest req) {
        JSONObject json = new JSONObject();//实质上是一个hashMap
        try {
            //String loginName = req.getParameter("loginName");
            String pageNo = req.getParameter("pageNo");
            String pageSize = req.getParameter("pageSize");
            String startTime = req.getParameter("startTime");
            String endTime = req.getParameter("endTime");
            String objectId = req.getParameter("objectId");
            String usid = req.getParameter("usid");
            String layerName = req.getParameter("layerName");// 设施类型
            String parentOrgName = req.getParameter("parentOrgName");// 区域搜索
            String loginName = req.getParameter("loginName");
            String sfss = req.getParameter("sfss");  //是否设施

            if (StringUtils.isBlank(parentOrgName)) {
                LackMarkForm f = this.getAttachFrom(req, loginName);
                parentOrgName = f.getParentOrgName();
            }
           /* if ("true".equals(sfss)) {
                if (StringUtils.isBlank(objectId) && StringUtils.isBlank(usid)) {
                    json.put("code", 300);
                    json.put("message", "数据未同步!");
                    return json.toString();
                }
            } else {
                objectId = null;
            }*/

            Map<String, Object> map = new HashMap();
            if (StringUtils.isNotBlank(startTime) && !"0".equals(startTime)) {
                if (startTime.length() < 11)
                    map.put("startTime", new Date(Long.parseLong(startTime) * 1000));
                else
                    map.put("startTime", new Date(Long.parseLong(startTime)));
            }
            if (StringUtils.isNotBlank(endTime) && !"0".equals(endTime)) {
                if (endTime.length() < 11)
                    map.put("endTime", new Date(Long.parseLong(endTime) * 1000));
                else
                    map.put("endTime", new Date(Long.parseLong(endTime)));
            }
            if (StringUtils.isNotBlank(layerName))
                map.put("layerName", layerName);
            if (StringUtils.isNotBlank(parentOrgName))
                map.put("parentOrgName", parentOrgName);
			/*if (StringUtils.isNotBlank(startTime))
				map.put("startTime", new Date(Long.parseLong(startTime)));
			if (StringUtils.isNotBlank(endTime))
				map.put("endTime", new Date(Long.parseLong(endTime)));*/
            Page<DiaryForm> page = new Page<DiaryForm>();
            if (StringUtils.isNotBlank(pageNo))
                page.setPageNo(Integer.parseInt(pageNo));
            if (StringUtils.isNotBlank(pageSize))
                page.setPageSize(Integer.parseInt(pageSize));
            DiaryForm corrFrom = (DiaryForm) ParamsToFrom.paramsTofromApp(req,
                    DiaryForm.class);
            corrFrom.setParentOrgName(parentOrgName);
            // 获取当前设施的巡查日志
            Page<DiaryForm> pages=null;
            if(StringUtils.isNotBlank(objectId)){
                 pages = diaryService.searchDiaryOfFacilty(objectId,
                        page, corrFrom, map);
            }else {
                 pages=diaryService.searchFromAndMap(page,
                 corrFrom,map);
            }
            // 转成Map对象
            List<DiaryForm> listDiarys = pages
                    .getResult();
            if (listDiarys != null && listDiarys.size() > 0) {
                List<Diary> lists = DiaryConvertor
                        .convertFormListToVoList(listDiarys);
                List<Map> listMap = DiaryConvertor
                        .convertVoListToMapList(lists);
                json.put("data", listMap);
                json.put("total", pages.getTotalItems());
            }
            json.put("code", 200);
        } catch (Exception e) {
            e.printStackTrace();
            json.put("code", 500);
            json.put("message", "异常错误!");
        }
        return json.toString();
    }

    /**
     * 根据objectid获取问题上报列表
     * @param request
     * @return
     */
    @RequestMapping(value = "/getProblemByObjectId", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String getProblemByObjectId( HttpServletRequest request) {
        JSONObject jsonObject = new JSONObject();
        String objectId = request.getParameter("objectId");
        String usid = request.getParameter("usid");
        String loginName = request.getParameter("loginName");
        String pageNo = request.getParameter("pageNo");
        String pageSize = request.getParameter("pageSize");
        String keyWord = request.getParameter("keyWord");
        String xzqh = request.getParameter("xzqh");
        String sslx = request.getParameter("sslx");
        String wtlx = request.getParameter("wtlx");
        String state = request.getParameter("state");
        String startTime = request.getParameter("startTime");
        String endTime = request.getParameter("endTime");
       // String procInstDbId = request.getParameter("procInstDbId");
        Map<String, String> map =new HashMap<String, String>();
        map.put("usid", usid);
        map.put("objectId", objectId);
        map.put("loginName", loginName);
        map.put("keyWord", keyWord);
        map.put("xzqh", xzqh);
        map.put("sslx", sslx);
        map.put("wtlx", wtlx);
        map.put("state", state);
        map.put("startTime", startTime);
        map.put("endTime", endTime);
       // map.put("procInstDbId", procInstDbId);
        try {
            if(!Common.isCheckNull(loginName) && !Common.isCheckNull(pageNo)
                    && !Common.isCheckNull(pageSize) && (!Common.isCheckNull(objectId) || !Common.isCheckNull(usid))) {
                //org.springside.modules.orm.Page<GxProblemReportForm> Page = new org.springside.modules.orm.Page<GxProblemReportForm>();
                Page<GxProblemReportForm> Page = new Page<GxProblemReportForm>();
                Page.setPageNo(Integer.valueOf(pageNo));
                Page.setPageSize(Integer.valueOf(pageSize));
                String urlAll=request.getRequestURL().toString() ;
                Page=gxProblemReportService.searchForApp(Page, map,urlAll);
                JSONObject data = new JSONObject();
                data.put("list", Page.getResult());
                jsonObject.put("total", Page.getResult().size());
                jsonObject.put("code", 200);
                jsonObject.put("data", data);
                jsonObject.put("message", "");
            } else {
                jsonObject.put("code", 404);
                //jsonObject.put("data", null);
                jsonObject.put("message", "数据未同步");
            }
        } catch (Exception e) {
            jsonObject.put("code", 500);
            //jsonObject.put("data", null);
            jsonObject.put("message", e.getMessage());
            e.printStackTrace();
        }
        return jsonObject.toString();
    }

    /**
     * 获取修正部件标识的列表
     */
    @RequestMapping(value = "/getPartsCorr", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String getPartsCorr(HttpServletRequest req) {
        JSONObject json = new JSONObject();
        try {
            String pageNo = req.getParameter("pageNo");
            String pageSize = req.getParameter("pageSize");
            String startTime = req.getParameter("startTime");
            String endTime = req.getParameter("endTime");
            CorrectMarkForm corrFrom = (CorrectMarkForm) ParamsToFrom
                    .paramsTofromApp(req, CorrectMarkForm.class);
            Map<String, Object> map = new HashMap();
            map.put("no", 0);
            map.put("pass", 0);
            map.put("doubt", 0);
            if (StringUtils.isNotBlank(startTime)) {
                if (endTime.length() < 11)
                    map.put("startTime", new Date(Long.parseLong(startTime) * 1000));
                else
                    map.put("startTime", new Date(Long.parseLong(startTime)));
            }
            if (StringUtils.isNotBlank(endTime)) {
                if (endTime.length() < 11)
                    map.put("endTime", new Date(Long.parseLong(endTime) * 1000));
                else
                    map.put("endTime", new Date(Long.parseLong(endTime)));
            }
            Page<CorrectMarkForm> page = new Page<CorrectMarkForm>();
            if (StringUtils.isNotBlank(pageNo))
                page.setPageNo(Integer.parseInt(pageNo));
            if (StringUtils.isNotBlank(pageSize))
                page.setPageSize(Integer.parseInt(pageSize));
            if (!StringUtils.isNotBlank(corrFrom.getMarkPersonId())) {
                json.put("code", 300);
                json.put("message", "参数错误!");
                return json.toString();
            }
            OpuOmUserInfo omUserForm = omUserInfoRestService.getOpuOmUserInfoByLoginName(corrFrom.getMarkPersonId());
            //corrFrom.setPersonUserId(omUserForm.getUserId());
            corrFrom.setMarkPersonId(omUserForm.getLoginName());
            Page<CorrectMarkForm> pg = correctMarkService.searchFromAndMap(
                    page, corrFrom, map);
            if (pg.getResult() != null) {
                List<Map> listMap = CorrectMarkConvertor.convertFormToMap(pg
                        .getResult());
                json.put("no", map.get("no"));
                json.put("pass", map.get("pass"));
                json.put("doubt", map.get("doubt"));
                json.put("code", 200);
                json.put("data", listMap);
                json.put("total", pg.getTotalItems());
            } else {
                json.put("no", map.get("no"));
                json.put("pass", map.get("pass"));
                json.put("doubt", map.get("doubt"));
                json.put("code", 200);
            }
        } catch (Exception e) {
            e.printStackTrace();
            json.put("code", 500);
            json.put("message", "异常错误!");
        }
        return json.toString();
    }

    /**
     * 获取缺失（新增）部件标识的列表
     */
    @RequestMapping(value = "/getPartsNew", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String getPartsNew(HttpServletRequest req) {
        JSONObject json = new JSONObject();
        try {
            String pageNo = req.getParameter("pageNo");
            String pageSize = req.getParameter("pageSize");
            String startTime = req.getParameter("startTime");
            String endTime = req.getParameter("endTime");
            Map<String, Object> map = new HashMap();
            map.put("no", 0);
            map.put("pass", 0);
            map.put("doubt", 0);
            if (StringUtils.isNotBlank(startTime)) {
                if (endTime.length() < 11)
                    map.put("startTime", new Date(Long.parseLong(startTime) * 1000));
                else
                    map.put("startTime", new Date(Long.parseLong(startTime)));
            }
            if (StringUtils.isNotBlank(endTime)) {
                if (endTime.length() < 11)
                    map.put("endTime", new Date(Long.parseLong(endTime) * 1000));
                else
                    map.put("endTime", new Date(Long.parseLong(endTime)));
            }
            Page<LackMarkForm> page = new Page<LackMarkForm>();
            if (StringUtils.isNotBlank(pageNo))
                page.setPageNo(Integer.parseInt(pageNo));
            if (StringUtils.isNotBlank(pageSize))
                page.setPageSize(Integer.parseInt(pageSize));
            LackMarkForm lackFrom = (LackMarkForm) ParamsToFrom
                    .paramsTofromApp(req, LackMarkForm.class);
            if (!StringUtils.isNotBlank(lackFrom.getMarkPersonId())) {
                json.put("code", 300);
                json.put("message", "参数有误!");
                return json.toString();
            }

            OpuOmUserInfo omUserForm = omUserInfoRestService.getOpuOmUserInfoByLoginName(lackFrom.getMarkPersonId());
            lackFrom.setPersonUserId(omUserForm.getUserId());
            lackFrom.setMarkPersonId(null);
            Page<LackMarkForm> pg = lackMarkService.searchFromAndMap(page,
                    lackFrom, map);
            if (pg.getResult() != null) {
                List<Map> listMap = LackMarkConvertor.convertFormToMap(pg
                        .getResult());
                json.put("no", map.get("no"));
                json.put("pass", map.get("pass"));
                json.put("doubt", map.get("doubt"));
                json.put("code", 200);
                json.put("data", listMap);
                json.put("total", pg.getTotalItems());
            } else {
                json.put("no", map.get("no"));
                json.put("pass", map.get("pass"));
                json.put("doubt", map.get("doubt"));
                json.put("code", 200);
            }
        } catch (Exception e) {
            e.printStackTrace();
            json.put("code", 500);
            json.put("message", "异常错误!");
        }
        return json.toString();
    }

    /**
     * 获取巡查、养护的列表 (需要转成Map给移动端)
     */
    @RequestMapping(value = "/getDiayr", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String getDiayr(HttpServletRequest req) {
        JSONObject json = new JSONObject();
        try {
            String loginName = req.getParameter("loginName");
            String pageNo = req.getParameter("pageNo");
            String pageSize = req.getParameter("pageSize");
            String startTime = req.getParameter("startTime");
            String endTime = req.getParameter("endTime");
            String addr = req.getParameter("addr");
            String road  = req.getParameter("road");
            String attrFive = req.getParameter("attrFive");
            if (!StringUtils.isNotBlank(loginName)) {
                json.put("code", 300);
                json.put("message", "参数有误!");
                return json.toString();
            }
            Map<String, Object> map = new HashMap();
            if (StringUtils.isNotBlank(startTime))
                map.put("startTime", new Date(Long.parseLong(startTime)));
            if (StringUtils.isNotBlank(endTime))
                map.put("endTime", new Date(Long.parseLong(endTime)));
            if(StringUtils.isNotBlank(addr)){
                map.put("addr",addr+"");
            }
            if(StringUtils.isNotBlank(road)){
                map.put("road",road+"");
            }
            if(StringUtils.isNotBlank(attrFive)){
                map.put("attrFive",attrFive+"");
            }
            Page<DiaryForm> page = new Page<DiaryForm>();
            if (StringUtils.isNotBlank(pageNo))
                page.setPageNo(Integer.parseInt(pageNo));
            if (StringUtils.isNotBlank(pageSize))
                page.setPageSize(Integer.parseInt(pageSize));
            DiaryForm corrFrom = (DiaryForm) ParamsToFrom.paramsTofromApp(req,
                    DiaryForm.class);
            // 获取当前所属巡查组或者单位下的巡查日志
            Page<DiaryForm> pages = diaryService.searchDiaryOfUser(loginName,
                    page, corrFrom, map);
            // Page<DiaryForm> pages=diaryService.searchFromAndMap(page,
            // corrFrom,map);
            // 转成Map对象
            List<DiaryForm> listDiarys = pages
                    .getResult();
            if (listDiarys != null && listDiarys.size() > 0) {
                List<Diary> lists = DiaryConvertor
                        .convertFormListToVoList(listDiarys);
                List<Map> listMap = DiaryConvertor
                        .convertVoListToMapList(lists);
                /*if (listMap != null && listMap.size() > 0) {
                    for (Map maps : listMap) {
                        if (maps.containsKey("recordTime")) {
                            Date time = (Date) maps.get("recordTime");
                            if (time != null) {
                                Long recordTime = time.getTime();
                                maps.put("recordTime", recordTime);
                            }
                        }
                    }
                }*/
                json.put("data", listMap);
                json.put("total", pages.getTotalItems());
            }
            json.put("code", 200);
        } catch (Exception e) {
            e.printStackTrace();
            json.put("code", 500);
            json.put("message", "异常错误!");
        }
        return json.toString();
    }

    /**
     * 获取修正部件附件列表(附件)
     */
    @RequestMapping(value = "/getPartsCorrAttach", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String getPartsCorrAttach(HttpServletRequest req) {
        JSONObject json = new JSONObject();
        String path = req.getScheme() + "://" + req.getServerName() + ":"
                + req.getServerPort() + req.getContextPath() + psxjProperties.getRequest_file_path();
        try {
            String markId = req.getParameter("markId");
            if (StringUtils.isNotBlank(markId)) {
                List<CorrectMarkAttachmentForm> list = correctMarkAttachmentService
                        .getMarkId(markId);
                for (CorrectMarkAttachmentForm f : list) {
                    String attPath = path + f.getAttPath();
                    f.setAttPath(f.getAttPath() != null ? attPath : "");
                    f.setThumPath(f.getThumPath() != null ? path
                            + f.getThumPath() : "");
                }
                List<CorrectMarkAttachment> listCorrecta = CorrectMarkAttachmentConvertor
                        .convertFormListToVoList(list);
                List<Map> listMap = CorrectMarkAttachmentConvertor
                        .convertVoListToMapList(listCorrecta);
                if (listMap != null && listMap.size() > 0) {
                    for (Map map : listMap) {
                        if (map.containsKey("attTime")) {
                            Date time = (Date) map.get("attTime");
                            map.put("attTime", time != null ? time.getTime()
                                    : 0);
                        }
                    }
                }
                json.put("code", 200);
                json.put("data", listMap);
            } else {
                json.put("code", 300);
                json.put("message", "参数有误!获取列表失败!");
            }
        } catch (Exception e) {
            json.put("code", 500);
            json.put("message", "异常错误!");
            e.printStackTrace();
        }
        return json.toString();
    }

    /**
     * 获取缺失（新增）部件的附件列表（附件）
     */
    @RequestMapping(value = "/getPartsNewAttach", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String getPartsNewAttach(HttpServletRequest req) {
        JSONObject json = new JSONObject();
        String path = req.getScheme() + "://" + req.getServerName() + ":"
                + req.getServerPort() + req.getContextPath() + psxjProperties.getRequest_file_path();
        String markId = req.getParameter("markId");
        try {
            if (StringUtils.isNotBlank(markId)) {
                List<LackMarkAttachmentForm> list = lackMarkAttachmentService
                        .getMarkId(markId);
                for (LackMarkAttachmentForm f : list) {
                    String attPath = path + f.getAttPath();
                    f.setAttPath(f.getAttPath() != null ? attPath : "");
                    f.setThumPath(f.getThumPath() != null ? path
                            + f.getThumPath() : "");
                }
                List<LackMarkAttachment> listLack = LackMarkAttachmentConvertor
                        .convertFormListToVoList(list);
                List<Map> listMap = LackMarkAttachmentConvertor
                        .convertVoListToMapList(listLack);
                if (listMap != null && listMap.size() > 0) {
                    for (Map map : listMap) {
                        if (map.containsKey("attTime")) {
                            Date time = (Date) map.get("attTime");
                            map.put("attTime", time != null ? time.getTime()
                                    : 0);
                        }
                    }
                }
                json.put("code", 200);
                json.put("data", listMap);
            } else {
                json.put("code", 300);
                json.put("message", "参数有误!获取列表失败!");
            }
        } catch (Exception e) {
            json.put("code", 500);
            json.put("message", "异常错误!");
            e.printStackTrace();
        }
        return json.toString();
    }

    /**
     * 获取缺失（新增）部件的附件列表（附件） (需要转成Map对象给移动端)
     */
    @RequestMapping(value = "/getDiayrAttach", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String getDiayrAttach(HttpServletRequest req) {
        JSONObject json = new JSONObject();
        String path = req.getScheme() + "://" + req.getServerName() + ":"
                + req.getServerPort() + req.getContextPath() + psxjProperties.getRequest_file_path();
        String markId = req.getParameter("markId");
        try {
            if (StringUtils.isNotBlank(markId)) {
                List<DiaryAttachmentForm> list = diaryAttachmentService
                        .getMarkId(markId);
                for (DiaryAttachmentForm f : list) {
                    String attPath = path + f.getAttPath();
                    f.setAttPath(f.getAttPath() != null ? attPath : "");
                    f.setThumPath(f.getThumPath() != null ? path
                            + f.getThumPath() : "");
                }
                // 转成Map对象
                List<DiaryAttachment> listEntity = DiaryAttachmentConvertor
                        .convertFormListToVoList(list);
                List<Map> listMap = DiaryAttachmentConvertor
                        .convertVoListToMapList(listEntity);
                if (listMap != null && listMap.size() > 0) {
                    for (Map m : listMap) {
                        if (m.containsKey("attTime")) {
                            Date times = (Date) m.get("attTime");
                            if (times != null) {
                                m.put("attTime", times.getTime());
                            }
                        }
                    }
                }
                json.put("code", 200);
                json.put("data", listMap);
            } else {
                json.put("code", 300);
                json.put("message", "参数有误!获取列表失败!");
            }
        } catch (Exception e) {
            json.put("code", 500);
            json.put("message", "系统错误!");
            e.printStackTrace();
        }
        return json.toString();
    }

    /**
     * 获取当前系统时间
     */
    @RequestMapping(value = "/getNewTime", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String getNewTime() {
        JSONObject json = new JSONObject();
        Long currTime = new Date().getTime();
        json.put("code", 200);
        json.put("data", currTime);
        return json.toString();
    }

    /**
     * 获取当前所属队伍人员
     *
     * @param loginName (登陆名)
     */
    @RequestMapping(value = "/getTeamUser", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String getTeamUser(String loginName) {
        JSONObject json = new JSONObject();
        if (StringUtils.isBlank(loginName)) {
            json.put("code", 300);
            json.put("message", "参数有误!");
        } else {
            List listMap = new ArrayList();
            OpuOmUserInfo userInfo = omUserInfoRestService.getOpuOmUserInfoByLoginName(loginName);
            OpuOmOrg org = psOrgUserService.getParentOrgByUserId(userInfo.getUserId());
            List<OpuOmUserInfo> listUsers = omUserInfoRestService.listOpuOmUserInfoByOrgId(org.getOrgId());
            for (OpuOmUserInfo userForm : listUsers) {
                Map map = new HashMap();
                map.put("userId", userForm.getUserId());
                map.put("loginName", userForm.getLoginName());
                map.put("userName", userForm.getUserName());
                listMap.add(map);
            }
            json.put("code", 200);
            json.put("data", listMap);
        }
        return json.toString();
    }

    /**
     * 删除纠错附件
     */
    @RequestMapping(value = "/deleteCorrAttach", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String deleteCorrAttach(String id) {
        return correctMarkAttachmentService.deleteCorrAttach(id);
    }

    /**
     * 删除缺失附件
     */
    @RequestMapping(value = "/deleteLackAttach", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String deleteLackAttach(String id) {
        return lackMarkAttachmentService.deleteLackAttach(id);
    }

    /**
     * 删除巡查附件
     *
     * @param id
     */
    @RequestMapping(value = "/deleteDiaryAttach", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public String deleteDiaryAttach(String id) {
        return diaryAttachmentService.deleteDiaryAttach(id);
    }

    /*************************************** 工具方法 ****************************************/
    /**
     * 本接口通用方法，生成correctMarkfrom对象
     */
    public CorrectMarkForm getFrom(HttpServletRequest request, String loginName) {
		/*CorrectMarkForm f = (CorrectMarkForm) ParamsToFrom.paramsTofromApp(
				request, CorrectMarkForm.class);*/
        String jsonFrom = request.getParameter("json");
        CorrectMarkForm f = (CorrectMarkForm) JsonOfForm.paramsTofromApp(JSONObject.fromObject(jsonFrom), CorrectMarkForm.class);

		OpuOmUserInfo user = omUserInfoRestService.getOpuOmUserInfoByLoginName(loginName);
		if (user != null) {
			f.setMarkPerson(user.getUserName());
			f.setPersonUserId(user.getUserId());
			List<OpuOmOrg> list = omOrgRestService.listOpuOmOrgByUserId(user.getUserId());
			for (OpuOmOrg from : list) {
				if(from.getOrgId().contains(from.getOpusOmType().getCode())){
					from.setOrgId(from.getOrgId().substring(from.getOpusOmType().getCode().length()+1));
				}
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
     * 本接口通用方法，生成LackMarkfrom对象
     */
    public LackMarkForm getAttachFrom(HttpServletRequest request,
                                      String loginName) {
		/*LackMarkForm f = (LackMarkForm) ParamsToFrom.paramsTofromApp(request,
				LackMarkForm.class);*/
		String jsonFrom = request.getParameter("json");
		LackMarkForm f= (LackMarkForm) JsonOfForm.paramsTofromApp(JSONObject.fromObject(jsonFrom),LackMarkForm.class);
		OpuOmUserInfo user = omUserInfoRestService.getOpuOmUserInfoByLoginName(loginName);
		if (user != null) {
			f.setMarkPerson(user.getUserName());
			f.setPersonUserId(user.getUserId());
			List<OpuOmOrg> list = omOrgRestService.listOpuOmOrgByUserId(user.getUserId());
			for (OpuOmOrg from : list) {
				if(from.getOrgId().contains(from.getOpusOmType().getCode())){
					from.setOrgId(from.getOrgId().substring(from.getOpusOmType().getCode().length()+1));
				}
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
	 * 本接口通用方法，生成diaryForm对象
	 * */
	public DiaryForm getDiaryAttachFrom(HttpServletRequest request,
			String loginName) {
		String jsonFrom = request.getParameter("json");
		DiaryForm f= (DiaryForm) JsonOfForm.paramsTofromApp(JSONObject.fromObject(jsonFrom),DiaryForm.class);
		OpuOmUserInfo userFrom = omUserInfoRestService.getOpuOmUserInfoByLoginName(loginName);
		if (userFrom != null) {
			f.setWriterName(userFrom.getUserName());
			List<OpuOmOrg> list = omOrgRestService.listOpuOmOrgByUserId(userFrom.getUserId());
			for (OpuOmOrg from : list) {
				if(from.getOrgId().contains(from.getOpusOmType().getCode())){
					from.setOrgId(from.getOrgId().substring(from.getOpusOmType().getCode().length()+1));
				}
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
     * 上传照片得到map对象（照片已保存）
     *
     * @param request
     * @param markId  部件表id
     * @throws ParseException
     * @throws Exception
     */
    public List<Map<String, Object>> getMapParts(HttpServletRequest request,
                                                 String markId) {
        List<Map<String, Object>> listMap = new ArrayList();
        SimpleDateFormat formatAttName = new SimpleDateFormat("yyyyMMddHHmmss"); // 月数的文件夹
        SimpleDateFormat formatDay = new SimpleDateFormat("yyyyMMdd"); // 天数的文件夹
        Format format = new SimpleDateFormat("yyyyMM");
        // 得到物理地址
        try {
            String attTime = request.getParameter("attTime");
            DiskFileItemFactory factory = new DiskFileItemFactory();
            factory.setSizeThreshold(1024 * 1024);
            factory.setRepository(Paths.get(uploadPath).toFile());
            ServletFileUpload upload = new ServletFileUpload(factory);
            upload.setFileSizeMax(1024 * 1024 * 10); // 单个文件大小
            upload.setSizeMax(1024 * 1024 * 40); // 整个表单大小限制
            upload.setHeaderEncoding("utf-8");
            List<FileItem> listFiles = upload.parseRequest(request);
            for (FileItem item : listFiles) {
                if (!item.isFormField()) {
                    if (item.getSize() > 1024 * 1024 * 40) {// 单个文件限制10M
                        return null;
                    }
                    Map<String, Object> map = new HashMap<String, Object>();
                    String name = item.getName();
                    String type = item.getContentType();
                    if (name.contains("_img.jpg")) {
                        String attTimeString = name.split("_img.jpg")[0];
                        try {
                            map.put("attTime",
                                    formatAttName.parse(attTimeString));
                        } catch (ParseException e) {
                            map.put("attTime", new Date());
                        }
                    } else {
                        map.put("attTime", new Date());
                    }
                    map.put("markId", markId);
                    map.put("attName", name);
                    map.put("mime", type);
                    String filepaths = uploadPath + "img\\"
                            + format.format(new Date());
                    File f = new File(filepaths);
                    if (!f.isDirectory()) {
                        f.mkdirs();
                    }
                    String filecode = SysFileUtils.nextFileCode();
                    String fileNames = filecode + "_" + name;
                    String filePath = filepaths + "\\" + fileNames;
                    String filepaths2 = requestPath + "img/"
                            + format.format(new Date()) + "/" + fileNames;
                    map.put("attPath", filepaths2);
                    f = new File(filePath);
                    // 缩略图的地址和保存
                    try {
                        item.write(f);
                        item.delete();
                        item = null;
                    } catch (Exception e) {
                        e.printStackTrace();
                    } finally {
                        if (item != null) {
                            item.delete();
                            item = null;
                        }
                        if (f != null) {
                            f = null;
                        }
                    }
                    String smallPath = uploadPath + "\\imgSmall\\"
                            + format.format(new Date());
                    String thumbnailsUrl = smallPath + "\\" + filecode + "_"
                            + name;
                    String smallUpoadPath = requestPath + "imgSmall/"
                            + format.format(new Date()) + "/" + filecode + "_"
                            + name;
                    File smallFile = new File(smallPath);
                    if (!smallFile.isDirectory()) {
                        smallFile.mkdirs();
                    }
                    Thumbnails.Builder<File> builder = null;
                    try {
                        builder = Thumbnails.of(filePath);
                        builder.scale(0.4f).toFile(thumbnailsUrl);
                        map.put("thumPath", smallUpoadPath); // 缩略图地址
                    } catch (IOException e) {
                        e.printStackTrace();
                    } finally {
                        if (builder != null) {
                            builder = null;
                        }
                    }
                    listMap.add(map);
                }
            }
            return listMap;
        } catch (FileUploadException e) {
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 在上报之前判断照片有无报错 上传照片得到map对象（照片已保存）
     *
     * @param request
     * @param
     * @throws Exception
     */
    public List<Map<String, Object>> isPhotos(HttpServletRequest request) {
        try {
            List<Map<String, Object>> listMap = new ArrayList();
            SimpleDateFormat formatAttName = new SimpleDateFormat(
                    "yyyyMMddHHmmss");
            SimpleDateFormat formatDay = new SimpleDateFormat("yyyyMMdd"); // 天数的文件夹
            Format format = new SimpleDateFormat("yyyyMM");
            String attTime = request.getParameter("attTime");
            DiskFileItemFactory factory = new DiskFileItemFactory();
            factory.setSizeThreshold(1024 * 1024);
            factory.setRepository(Paths.get(uploadPath).toFile());
            ServletFileUpload upload = new ServletFileUpload(factory);
            upload.setFileSizeMax(1024 * 1024 * 10); // 单个文件大小
            upload.setSizeMax(1024 * 1024 * 40); // 整个表单大小限制
            upload.setHeaderEncoding("utf-8");
            List<FileItem> listFiles = upload.parseRequest(request);
            List<FileItem> yPic = new ArrayList<>();
            List<FileItem> slPic = new ArrayList<>();
            if (listFiles != null && listFiles.size() > 0) {
                for (FileItem item : listFiles) {
                    if (item.getName() != null && item.getName().contains("thumbnail")) {
                        slPic.add(item);
                    } else {
                        yPic.add(item);
                    }
                }
            }
            for (FileItem item : yPic) {
                if (!item.isFormField()) {
                    if (item.getSize() > 1024 * 1024 * 10) { // 单个文件限制10M
                        return null;
                    }
                    Map<String, Object> map = new HashMap<String, Object>();
                    String name = item.getName();
                    String type = item.getContentType();
                    if (name.contains("_img.jpg")) {
                        String attTimeString = name.split("_img.jpg")[0];
                        try {
                            map.put("attTime",
                                    formatAttName.parse(attTimeString));
                        } catch (Exception e) {
                            map.put("attTime", new Date());
                        }
                    } else {
                        map.put("attTime", new Date());
                    }
                    map.put("attName", name);
                    map.put("mime", type);
                    String filepaths = uploadPath + "img\\"
                            + format.format(new Date()) + "\\"
                            + formatDay.format(new Date());
                    File f = new File(filepaths);
                    if (!f.isDirectory()) {
                        f.mkdirs();
                    }
                    String filecode = SysFileUtils.nextFileCode();
                    String fileNames = filecode + "_" + name;
                    String filePath = filepaths + "\\" + fileNames;
                    String filepaths2 = requestPath + "img/"
                            + format.format(new Date()) + "/"
                            + formatDay.format(new Date()) + "/" + fileNames;
                    map.put("attPath", filepaths2);
                    f = new File(filePath);
                    if (slPic != null && slPic.size() > 0) {
                        for (FileItem sl : slPic) {
                            if (sl.getName().contains(name.split("_img")[0])) {
                                String smallPath = uploadPath + "\\imgSmall\\" + format.format(new Date()) + "\\" + formatDay.format(new Date());
                                String thumbnailsUrl = smallPath + "\\" + filecode + "_" + name;
                                String smallUpoadPath = requestPath + "imgSmall/" + format.format(new Date()) + "/" + formatDay.format(new Date()) + "/" + filecode + "_" + name;
                                File smallFile = new File(smallPath);
                                if (!smallFile.isDirectory()) {
                                    smallFile.mkdirs();
                                }
                                map.put("thumPath", smallUpoadPath); //缩略图地址
                                smallFile = new File(thumbnailsUrl);
                                //图片的地址和保存
                                try {
                                    sl.write(smallFile);
                                    sl.delete();
                                    sl = null;
                                } catch (Exception e) {
                                    e.printStackTrace();
                                } finally {
                                    if (sl != null) {
                                        sl.delete();
                                        sl = null;
                                    }
                                    if (smallFile != null) {
                                        smallFile = null;
                                    }
                                }
                                break;
                            }
                        }
                    }
                    // 原图的地址和保存
                    try {
                        item.write(f);
                        item.delete();
                        item = null;
                    } catch (Exception e) {
                        e.printStackTrace();
                    } finally {
                        if (item != null) {
                            item.delete();
                            item = null;
                        }
                        if (f != null) {
                            f = null;
                        }
                    }
//					String smallPath = uploadPath + "\\imgSmall\\"
//							+ format.format(new Date()) + "\\"
//							+ formatDay.format(new Date());
//					String thumbnailsUrl = smallPath + "\\" + filecode + "_"
//							+ name;
//					String smallUpoadPath = requestPath + "imgSmall/"
//							+ format.format(new Date()) + "/"
//							+ formatDay.format(new Date()) + "/" + filecode
//							+ "_" + name;
//					File smallFile = new File(smallPath);
//					if (!smallFile.isDirectory()) {
//						smallFile.mkdirs();
//					}
//					Boolean flag = ParamsToFrom.toThumbnail(filePath,
//							thumbnailsUrl);
//					if (flag) {
//						map.put("thumPath", smallUpoadPath); // 缩略图地址
//					}
                    listMap.add(map);
                }
            }
            return listMap;
        } catch (FileUploadException e) {
            return null;
        }
    }

    /**
     * springmvc的文件上传
     */
    private void saveFiles(HttpServletRequest request, Map<String, MultipartFile> files, List<Map<String, Object>> list) throws Exception {
        SimpleDateFormat formatAttName = new SimpleDateFormat(
                "yyyyMMddHHmmss");
        SimpleDateFormat formatDay = new SimpleDateFormat("yyyyMMdd"); // 天数的文件夹
        Format format = new SimpleDateFormat("yyyyMM");
        String attTime = request.getParameter("attTime");
        List<MultipartFile> yPic = new ArrayList<>();
        List<MultipartFile> slPic = new ArrayList<>();
        if (files != null && files.size() > 0) {
            for (String itemKey : files.keySet()) {
                MultipartFile item = files.get(itemKey);
                if (item.getOriginalFilename() != null && item.getOriginalFilename().contains("thumbnail")) {
                    slPic.add(item);
                } else {
                    yPic.add(item);
                }
            }
        }

        for (MultipartFile item : yPic) {
            // 判断文件是否为空
            if (!item.isEmpty()) {
                if (item.getSize() > 1024 * 1024 * 50) { // 单个文件限制50M
                    throw new Exception("超过文件大小限制!");
                }
                try {
                    Map<String, Object> map = new HashMap<String, Object>();
                    String name = item.getOriginalFilename();
                    String type = item.getContentType();
                    if (name.contains("_img.jpg")) {
                        String attTimeString = name.split("_img.jpg")[0];
                        try {
                            map.put("attTime",
                                    formatAttName.parse(attTimeString));
                        } catch (Exception e) {
                            map.put("attTime", new Date());
                        }
                    } else {
                        map.put("attTime", new Date());
                    }
                    map.put("attName", name);
                    map.put("mime", type);
                    String filepaths = uploadPath + "img\\"
                            + format.format(new Date()) + "\\"
                            + formatDay.format(new Date());
                    File f = new File(filepaths);
                    if (!f.isDirectory()) {
                        f.mkdirs();
                    }
                    String filecode = SysFileUtils.nextFileCode();
                    String fileNames = filecode + "_" + name;
                    String filePath = filepaths + "\\" + fileNames;
                    String filepaths2 = requestPath + "img/"
                            + format.format(new Date()) + "/"
                            + formatDay.format(new Date()) + "/" + fileNames;
                    map.put("attPath", filepaths2);
                    f = new File(filePath);
                    if (slPic != null && slPic.size() > 0) {
                        for (MultipartFile sl : slPic) {
                            if (sl.getOriginalFilename().contains(name.split("_img")[0])) {
                                String smallPath = uploadPath + "\\imgSmall\\" + format.format(new Date()) + "\\" + formatDay.format(new Date());
                                String thumbnailsUrl = smallPath + "\\" + filecode + "_" + name;
                                String smallUpoadPath = requestPath + "imgSmall/" + format.format(new Date()) + "/" + formatDay.format(new Date()) + "/" + filecode + "_" + name;
                                File smallFile = new File(smallPath);
                                if (!smallFile.isDirectory()) {
                                    smallFile.mkdirs();
                                }
                                map.put("thumPath", smallUpoadPath); //缩略图地址
                                smallFile = new File(thumbnailsUrl);
                                //图片的地址和保存
                                try {
                                    sl.transferTo(smallFile);
                                    sl = null;
                                } catch (Exception e) {
                                    e.printStackTrace();
                                } finally {
                                    if (sl != null) {
                                        sl = null;
                                    }
                                    if (smallFile != null) {
                                        smallFile = null;
                                    }
                                }
                                break;
                            }
                        }
                    }
                    // 原图的地址和保存
                    try {
                        item.transferTo(f);
                        item = null;
                    } catch (Exception e) {
                        e.printStackTrace();
                    } finally {
                        if (item != null) {
                            item = null;
                        }
                        if (f != null) {
                            f = null;
                        }
                    }
                    list.add(map);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
}

