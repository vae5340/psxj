package com.augurit.awater.dri.psh.sewerageUser.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.framework.security.user.OpuOmUser;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.psh.sewerageUser.service.ISewerageUserAttachmentService;
import com.augurit.awater.dri.psh.sewerageUser.web.form.SewerageUserAttachmentForm;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.augurit.agcom.common.ConfigProperties;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import static com.augurit.awater.util.json.JsonUtils.toJson;


public class SewerageUserAttachmentController{

    @Autowired
    private ISewerageUserAttachmentService sewerageUserAttachmentService;

    /**
     * 通过排水用户表id和类型获取其附件
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getByTypeAndSewerageUserId",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String getByTypeAndSewerageUserId(SewerageUserAttachmentForm form) throws Exception {
        String type="";
        if("xctpFileTable".equals(form.getAttType())){
            type="1";
        }else if("yyzzFileTable".equals(form.getAttType())){
            type="2";
        }else if("hzsFileTable".equals(form.getAttType())){
            type="3";
        }else if("psxkzFileTable".equals(form.getAttType())){
            type="4";
        }else if("pwxkzFileTable".equals(form.getAttType())){
            type="5";
        }
        List<SewerageUserAttachmentForm> list =sewerageUserAttachmentService.getByTypeAndSewerageUserId(type,form.getSewerageUserId());
		/*List<Map<String, Object>> fileList= new ArrayList<Map<String, Object>>();
		if(list!=null && list.size()>0){
			for(SewerageUserAttachmentForm attachmentForm : list){
				String urlAll=getRequest().getRequestURL().toString();
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
				fileList.add(mp);
			}
		}*/
        return (toJson(list));
    }
    /**
     * 下载附件
     * @return
     */
    @RequestMapping(value = "/downloadFile",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String downloadFile(HttpServletResponse response){
        OpuOmUser user = SecurityContext.getCurrentUser();
        Long id=Long.parseLong(user.getUserId());
        SewerageUserAttachmentForm sysFile = sewerageUserAttachmentService.get(id);
        if (null != sysFile) {

            ServletOutputStream out;
            //String path = sysFile.getFilePath();
            String path = ConfigProperties.getByKey("filePath");
            String fileName = sysFile.getAttPath().substring(4, sysFile.getAttPath().length());
            path = path.replace("\\", "/");
            File file = new File(path  + fileName);
            fileName = sysFile.getAttName();
            response.setContentType("application/OCTET-STREAM;charset=UTF-8");
            try {
                //设置文件夹名称，并防止中文乱码。
                response.setHeader("Content-Disposition", "attachment;filename=" + new String(fileName.getBytes("gbk"), "iso8859-1"));
                FileInputStream inputStream = new FileInputStream(file);
                out = response.getOutputStream();
                int b = 0;
                byte[] buffer = new byte[1024];
                while ((b = inputStream.read(buffer)) != -1) {
                    out.write(buffer, 0, b);
                }
                inputStream.close();
                out.close();
                out.flush();

            }catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        return null;
    }
    /**
     * 删除
     */
    @RequestMapping(value = "/deleteById",produces="application/json;charset=UTF-8")
    @ResponseBody
    public String deleteById(HttpServletRequest request,SewerageUserAttachmentForm form) throws Exception {
        OpuOmUser user = SecurityContext.getCurrentUser();
        Long id=Long.parseLong(user.getUserId());
        try {
            String key=request.getParameter("key");
            if(StringUtils.isNotBlank(key)){
                id=Long.valueOf(key);
                form=sewerageUserAttachmentService.get(id);
            }
            String path = ConfigProperties.getByKey("filePath");
            path = path.replace("\\", "/");
            String attPath = form.getAttPath().substring(4, form.getAttPath().length());
            File file = new File(path + attPath );
            // 路径为文件且不为空则进行删除
            if (file.isFile() && file.exists()) {
                file.delete();
                //删除缩略图
                String thumPath = form.getThumPath().substring(4, form.getAttPath().length());
                File fileSmall = new File(path + thumPath);
                if (fileSmall.isFile() && fileSmall.exists()) {
                    fileSmall.delete();
                }
            }
            sewerageUserAttachmentService.delete(id);
            return ("{\"success\":true}");
        } catch (Exception e) {
            // TODO: handle exception
            return ("{\"success\":false}");
        }
    }


    /**
     * 准备页面模型
     */
    protected void prepareModel(SewerageUserAttachmentForm form) throws Exception {
        OpuOmUser user = SecurityContext.getCurrentUser();
        Long id=Long.parseLong(user.getUserId());
        if(id != null){
            form = sewerageUserAttachmentService.get(id);
        }
        else
            form = new SewerageUserAttachmentForm();
    }


    public SewerageUserAttachmentForm getModel(SewerageUserAttachmentForm form) {
        return form;
    }


}