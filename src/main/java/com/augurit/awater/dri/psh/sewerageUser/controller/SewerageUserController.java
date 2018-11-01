package com.augurit.awater.dri.psh.sewerageUser.controller;

import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.framework.security.user.OpuOmUser;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.agcom.common.ConfigProperties;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.psh.sewerageUser.service.ISewerageUserAttachmentService;
import com.augurit.awater.dri.psh.sewerageUser.service.ISewerageUserService;
import com.augurit.awater.dri.psh.sewerageUser.web.form.SewerageUserAttachmentForm;
import com.augurit.awater.dri.psh.sewerageUser.web.form.SewerageUserForm;
import com.augurit.awater.util.data.DateHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.util.*;

import static com.augurit.awater.util.json.JsonUtils.toJson;

@Controller
public class SewerageUserController{

    @Autowired
    private ISewerageUserService sewerageUserService;
    @Autowired
    private ISewerageUserAttachmentService sewerageUserAttachmentService;
    @Autowired
    private IOmUserInfoRestService omUserService;

    /**
     * 分页查询
     */
    @RequestMapping(value = "/list",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String list(SewerageUserForm form, Page<SewerageUserForm> page) throws Exception {
        return sewerageUserService.searchPage(page, form);
    }

    /**
     * 新增或修改
     */
/*	@Override
	public String input() throws Exception {
		return INPUT;
	}*/

    /**
     * 保存新增或者修改的Form对象
     */
    @RequestMapping(value = "/save",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String save(SewerageUserForm form) throws Exception {
        OpuOmUser user = SecurityContext.getCurrentUser();
        Long id=Long.parseLong(user.getUserId());
        if(id==null || "".equals(id)){//新增才赋值
            form.setCreateTime(new Date());
            form.setState("0");
        }
        sewerageUserService.save(form);
        return ("{\"success\":true,\"id\":"+form.getId()+"}");
    }

    /**
     * 根据id获取数据
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getById",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String getById(HttpServletRequest request, SewerageUserForm form) throws Exception {
        OpuOmUser user = SecurityContext.getCurrentUser();
        Long id=Long.parseLong(user.getUserId());
        Map<String, Object> map = new HashMap<String, Object>();
        List<SewerageUserAttachmentForm> fjList= sewerageUserAttachmentService.getListBySewerageUserId(id.toString());
        List<Map<String, Object>> licenceFileList= new ArrayList<Map<String, Object>>();
        List<Map<String, Object>> licenseDecisionFileList= new ArrayList<Map<String, Object>>();
        List<Map<String, Object>> imageFileList= new ArrayList<Map<String, Object>>();
        if(fjList!=null && fjList.size()>0){
            for(SewerageUserAttachmentForm attachmentForm : fjList){
                String urlAll=request.getRequestURL().toString();
                String url="";//图片路径处理
                String[] mainurl=urlAll.split("/ag");
                if (mainurl!=null && mainurl.length>0) {
                    url=mainurl[0]+"/img";
                }
                Map<String, Object> mp = new HashMap<String, Object>();
                mp.put("sysFileId", attachmentForm.getId());
                mp.put("fileName", attachmentForm.getAttName());
                mp.put("filePath", url+attachmentForm.getAttPath());
                mp.put("cdt", DateHelper.formatTime(attachmentForm.getAttTime()));
                if("1".equals(attachmentForm.getAttType())){
                    licenceFileList.add(mp);
                }else if("2".equals(attachmentForm.getAttType())){
                    licenseDecisionFileList.add(mp);
                }else if("3".equals(attachmentForm.getAttType())){
                    imageFileList.add(mp);
                }
            }
        }
        map.put("data", form);
        map.put("licenceFileList", licenceFileList);
        map.put("licenseDecisionFileList", licenseDecisionFileList);
        map.put("imageFileList", imageFileList);
        return (toJson(map));
    }
    /**
     * 删除一条记录
     */
/*	@Override
	public String delete() throws Exception {
		sewerageUserService.delete(id);
		return RELOAD;
	}*/
    /**
     * 删除数据
     * @return
     */
    @RequestMapping(value = "/deleteRow",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String deleteRow() {
        OpuOmUser user = SecurityContext.getCurrentUser();
        Long id=Long.parseLong(user.getUserId());
        try {
            sewerageUserService.delete(id);
            //删除附件
            List<SewerageUserAttachmentForm> fjList= sewerageUserAttachmentService.getListBySewerageUserId(id.toString());
            if(fjList!=null && fjList.size()>0){
                for(SewerageUserAttachmentForm attachmentForm : fjList){
                    String path = ConfigProperties.getByKey("filePath");
                    path = path.replace("\\", "/");
                    File file = new File(path +  attachmentForm.getAttPath());
                    // 路径为文件且不为空则进行删除
                    if (file.isFile() && file.exists()) {
                        file.delete();
                        //删除缩略图
                        File fileSmall = new File(path + attachmentForm.getThumPath());
                        if (fileSmall.isFile() && fileSmall.exists()) {
                            fileSmall.delete();
                        }
                    }
                    sewerageUserAttachmentService.delete(attachmentForm.getId());
                }
            }
            return ("{\"success\":true}");
        } catch (Exception e) {
            // TODO: handle exception
            return ("{\"success\":false}");
        }
    }

    /**
     * 准备页面模型
     */
    protected void prepareModel(SewerageUserForm form) throws Exception {
        OpuOmUser user = SecurityContext.getCurrentUser();
        Long id=Long.parseLong(user.getUserId());
        if(id != null){
            form = sewerageUserService.get(id);
        }
        else
            form = new SewerageUserForm();
    }

}
